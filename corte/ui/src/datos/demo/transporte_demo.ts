/**
 * @/datos · transporte de demostración (SOLO `npm run dev:demo`; BUILD_SPEC §8.1, §8.1.2). Hace de "hub en memoria"
 * sobre ui/fixtures/datos:
 * - Lecturas: fixture del escenario activo (?simular=) + el estado local en memoria (ops aplicadas) encima.
 * - ?simular=android: todo se arma con dominio.deCopia sobre la copia (snapshot.json) con las ops en cola aplicadas
 *   (dominio.aplicarOpsACopia). Si deCopia no puede (p. ej. mientras @/dominio es el doble) → ErrorHub('necesita_pc');
 *   la sesión, si deCopia no la arma, sale del sesion.json del escenario (para que la app arranque).
 * - rev. 4 (15/11): la ficha de producto ('producto') llega con `extendido` sintético (demo/ficha_demo.ts); con
 *   ?simular=android&pc=conectada la contesta «el hub» (fixture + extendido) en lugar de la copia.
 * - Acciones: se aplican en memoria ('aplicada'); en ?simular=android quedan 'en_cola'.
 * - hub.*: respuestas de los fixtures o ErrorHub('solo_en_pc').
 * - Eventos: la «secuencia» del escenario (sincronizando) avanza un cuadro por intervalo leyendo el disparador, emite
 *   sync.progreso / sync.fin y, al cambiar de fase (punto de control), datos.cambiaron.
 * - rev. 5 (15/11): Display API CONECTADA con métricas sintéticas (demo/display_demo.ts) en videos, detalle (con
 *   tendencia), producto, muestra y tablero (perfil_tiktok); /api/display/* responde 403 prohibido como el hub demo.
 *   En ?simular=android los mismos campos llegan en la copia (conDisplayCopia: videos, tableros, extras de las muestras
 *   y portadas en meta_imagenes), así que deCopia arma Videos, el detalle, Inicio y la ficha con ellos (sin tendencia).
 *   `?display=<estado>` simula los demás estados (y el flujo en memoria, con 'display.cambio') para pruebas y capturas.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, ParamsDe } from '@firmas/datos';
import { dom, registrarMetaDe } from '../dominio';
import { ErrorHub, necesitaPc, soloEnPc } from '../errores';
import {
  type ContextoOp, type EstadoLocalListas, ESTADO_VACIO, aplicarOpAEstado, entraEnConsulta, guardas, solicitudesTocadas,
} from '../optimista';
import { rutaDeConsulta, type RutaConsulta } from '../rutas';
import type { Lectura, MetodoMutacion, ResultadoOpTransporte, SumideroEventos, Transporte } from '../transporte';
import { esMuestra } from '../transporte_android';
import { parametroUrl } from '../../plataforma/entorno';
import {
  SIMULACIONES, conDisplayCopia, conDisplayDashboard, conDisplayMuestra, conDisplayProducto, conDisplayVideo, conDisplayVideos, crearDemoDisplay,
  estadoDisplayDemo, type DemoDisplay, type SimulacionDisplay,
} from './display_demo';
import { completarFichaDemo } from './ficha_demo';
import { avanzarSiDisparador, escenarioActivo, indiceCuadro, leerRuta, secuenciaDe } from './fixtures';

const DISPOSITIVO_DEMO = 'demo';

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function esSnapshot(v: unknown): v is C.SnapshotResponse {
  return esObjeto(v) && v['version_esquema'] === 1 && Array.isArray(v['muestras']) && esObjeto(v['local']);
}

function esSyncEstado(v: unknown): v is C.SyncEstado {
  return esObjeto(v) && typeof v['en_curso'] === 'boolean' && Array.isArray(v['pasos']);
}

function esSesion(v: unknown): v is C.SessionResponse {
  return esObjeto(v) && esSyncEstado(v['sync']) && esObjeto(v['conexion']) && esObjeto(v['datos']) && esObjeto(v['capacidades']);
}

function itemsDe(v: unknown): unknown[] {
  return esObjeto(v) && Array.isArray(v['items']) ? v['items'] : [];
}

const r0 = (ruta: string): RutaConsulta => ({ ruta, query: [] });

/** Estado en memoria del modo demo (se pierde al recargar la página). */
export interface MemoriaDemo {
  /** Ops aplicadas (escenarios que no son android). */
  ops: C.OpLocal[];
  /** Cola de ?simular=android (se superpone a la copia). */
  pendientes: C.OpLocal[];
  ajustes: C.AjustesPcCambios;
  lan: C.LanCambios & { activo?: boolean };
  /** rev. 5 · Con ?display=…: el estado al que llevó el flujo simulado (credenciales → conectar → regreso). Nunca guarda el
   *  Client secret: solo QUÉ estado sigue. */
  display: SimulacionDisplay | null;
}

export const memoriaDemo: MemoriaDemo = { ops: [], pendientes: [], ajustes: {}, lan: {}, display: null };

/** Solo pruebas. */
export function vaciarMemoriaDemo(): void {
  memoriaDemo.ops = [];
  memoriaDemo.pendientes = [];
  memoriaDemo.ajustes = {};
  memoriaDemo.lan = {};
  memoriaDemo.display = null;
}

// ---------------------------------------------------------------------------------------------- rev. 5 · Display API

const MSG_DEMO_DISPLAY = 'En el modo de demostración no puedes cambiar la conexión para ver las vistas de tus videos.';
/** Tiempo que tarda «TikTok» en volver en el flujo simulado (?display=…). */
export const REGRESO_SIMULADO_MS = 2500;

/** `?display=<estado>` (solo dev:demo): simula los estados que el hub demo no tiene. null = conectada, como el hub demo. */
export function simulacionPedida(): SimulacionDisplay | null {
  const v = parametroUrl('display');
  return v !== null && (SIMULACIONES as readonly string[]).includes(v) ? (v as SimulacionDisplay) : null;
}

function simulacionActual(): SimulacionDisplay {
  return memoriaDemo.display ?? simulacionPedida() ?? 'conectada';
}

/** Hay cifras de la Display API (se conectó alguna vez): conectada, por reautorizar o con un permiso de menos. */
function conMetricas(): boolean {
  const s = simulacionActual();
  return s === 'conectada' || s === 'reautorizar' || s === 'permiso';
}

let demoDisplay: { ahora: C.EpochS; d: DemoDisplay } | null = null;

async function display(escenario: string | null): Promise<DemoDisplay | null> {
  const ahora = dom.ahoraS();
  if (demoDisplay?.ahora === ahora) return demoDisplay.d;
  // ?simular=android no tiene lecturas propias (solo la copia): la lista de toda la vida sale de la base, como en el hub.
  const todos = await leerOpcional('/api/analitica/videos', escenario === 'android' ? null : escenario);
  if (!esObjeto(todos) || !Array.isArray(todos['items'])) return null;
  const d = crearDemoDisplay(todos['items'] as C.FilaVideo[], ahora);
  demoDisplay = { ahora, d };
  return d;
}

/** Agrega los campos opcionales de la rev. 5 a las lecturas que los traen (como analitica/display.py del hub). */
async function conDisplay(clave: ClaveConsulta, datos: unknown, escenario: string | null): Promise<unknown> {
  if (!conMetricas() || !esObjeto(datos)) return datos;
  if (clave !== 'videos' && clave !== 'video' && clave !== 'producto' && clave !== 'muestra' && clave !== 'dashboard') return datos;
  const d = await display(escenario);
  if (!d) return datos;
  switch (clave) {
    case 'videos': return Array.isArray(datos['items']) ? conDisplayVideos(d, datos as unknown as C.VideosResponse) : datos;
    case 'video': return esObjeto(datos['video']) ? conDisplayVideo(d, datos as unknown as C.VideoDetalleResponse) : datos;
    case 'producto': return Array.isArray(datos['videos']) ? conDisplayProducto(d, datos as unknown as C.ProductoDetalleResponse) : datos;
    case 'muestra': return Array.isArray(datos['videos_del_producto']) ? conDisplayMuestra(d, datos as unknown as C.MuestraDetalleResponse) : datos;
    default: return Array.isArray(datos['top_videos']) ? conDisplayDashboard(d, datos as unknown as C.DashboardResponse) : datos;
  }
}

const sumiderosDisplay = new Set<SumideroEventos>();

function emitirDisplay(e: C.EstadoDisplay): void {
  for (const s of [...sumiderosDisplay]) s.evento({ tipo: 'display.cambio', display: e });
}

async function estadoDisplayActual(escenario: string | null): Promise<C.EstadoDisplay> {
  const d = (await display(escenario)) ?? crearDemoDisplay([], dom.ahoraS());
  return estadoDisplayDemo(d, simulacionActual());
}

const RE_CLIENT_KEY = /^[A-Za-z0-9]{8,64}$/;
const RE_CLIENT_SECRET = /^[A-Za-z0-9_-]{16,128}$/;

/**
 * Mutaciones de /api/display/* en la demo. Sin ?display= responden 403 prohibido, como el hub demo. Con ?display= hacen
 * el flujo en memoria: credenciales (mismas reglas de formato que el hub; el secreto NO se guarda) → sin_conectar →
 * conectar (URL de ejemplo) → a los 2.5 s «vuelve de TikTok» y llega 'display.cambio' conectada.
 */
async function pedirDisplay(metodo: MetodoMutacion, ruta: string, cuerpo: unknown, escenario: string | null): Promise<unknown> {
  if (simulacionPedida() === null) throw new ErrorHub('prohibido', MSG_DEMO_DISPLAY, 403);
  const c = esObjeto(cuerpo) ? cuerpo : {};
  if (metodo === 'PUT' && ruta === '/api/display/credenciales') {
    const clave = c['client_key'];
    if (typeof clave !== 'string' || !RE_CLIENT_KEY.test(clave)) {
      throw new ErrorHub('parametros_invalidos', 'El Client key debe tener de 8 a 64 letras y números, sin espacios.', 422, { campo: 'client_key' });
    }
    const secreto = c['client_secret'];
    if (typeof secreto !== 'string' || !RE_CLIENT_SECRET.test(secreto)) {
      throw new ErrorHub('parametros_invalidos', 'El Client secret debe tener de 16 a 128 letras, números, guiones o guiones bajos, sin espacios.', 422, { campo: 'client_secret' });
    }
    memoriaDemo.display = 'sin_conectar';
    const e = await estadoDisplayActual(escenario);
    emitirDisplay(e);
    return e;
  }
  if (metodo === 'POST' && ruta === '/api/display/conectar') {
    if (simulacionActual() === 'sin_credenciales') {
      throw new ErrorHub('sin_credenciales', 'Primero escribe el Client key y el Client secret de tu app de TikTok for Developers.', 409);
    }
    const expira = dom.ahoraS() + 600;
    memoriaDemo.display = 'esperando';
    setTimeout(() => {
      if (memoriaDemo.display !== 'esperando') return;
      memoriaDemo.display = 'conectada';
      void estadoDisplayActual(escenario).then(emitirDisplay);
    }, REGRESO_SIMULADO_MS);
    return {
      url: 'https://www.tiktok.com/v2/auth/authorize/?client_key=demo&scope=user.info.basic,user.info.profile,user.info.stats,video.list&response_type=code&state=demo',
      expira_at: expira, abierto: false,
    } satisfies C.ConectarDisplayResponse;
  }
  if (metodo === 'POST' && ruta === '/api/display/desconectar') {
    memoriaDemo.display = c['olvidar_app'] === true ? 'sin_credenciales' : 'sin_conectar';
    const e = await estadoDisplayActual(escenario);
    emitirDisplay(e);
    return { display: e, revocado: true } satisfies C.DesconectarDisplayResponse;
  }
  throw soloEnPc();
}

function contexto(): ContextoOp {
  return { ahora: dom.ahoraS(), dispositivo: DISPOSITIVO_DEMO };
}

async function leerOpcional(ruta: string, escenario: string | null): Promise<unknown> {
  try {
    return await leerRuta(r0(ruta), escenario);
  } catch {
    return null;
  }
}

/** Listas del estado local de los fixtures (sin filtros) con las ops en memoria aplicadas. */
async function estadoLocal(escenario: string | null): Promise<EstadoLocalListas> {
  const [plan, avisos, notas, recordatorios, plantillas, preferencias] = await Promise.all(
    ['/api/plan', '/api/avisos', '/api/notas', '/api/recordatorios', '/api/plantillas', '/api/preferencias'].map((r) => leerOpcional(r, escenario)),
  );
  let estado: EstadoLocalListas = {
    planes: itemsDe(plan).filter(guardas.esPlan),
    avisos: itemsDe(avisos).filter(guardas.esAviso),
    notas: itemsDe(notas).filter(guardas.esNota),
    recordatorios: itemsDe(recordatorios).filter(guardas.esRecordatorio),
    plantillas: itemsDe(plantillas).filter(guardas.esPlantilla),
    preferencias: guardas.esPreferencias(preferencias) ? preferencias : null,
  };
  const ctx = contexto();
  for (const op of memoriaDemo.ops) estado = aplicarOpAEstado(estado, op, ctx).estado;
  return estado;
}

const LISTAS_FILTRADAS: ReadonlySet<ClaveConsulta> = new Set<ClaveConsulta>(['plan', 'avisos', 'notas', 'recordatorios']);

/**
 * Superpone el estado local en memoria a la respuesta de un fixture. Las listas con filtros (plan, avisos, notas,
 * recordatorios) se arman SIEMPRE desde la lista completa + memoria y se filtran con los params (el índice solo trae
 * algunas combinaciones; sin coincidencia exacta devolvería la lista entera).
 */
async function superponerMemoria(clave: ClaveConsulta, params: object, datos: unknown, escenario: string | null): Promise<unknown> {
  if (!esObjeto(datos)) return datos;
  if (memoriaDemo.ops.length === 0 && !LISTAS_FILTRADAS.has(clave)) return datos;
  const local = await estadoLocal(escenario);
  const lista = (items: C.ObjetoLocal[]): unknown => ({ ...datos, items: items.filter((o) => entraEnConsulta(clave, params, o)) });
  const hoy = dom.hoyLocal();
  const tocadas = new Set<string>();
  const ctx = contexto();
  let previo: EstadoLocalListas = ESTADO_VACIO;
  for (const op of memoriaDemo.ops) {
    const r = aplicarOpAEstado(previo, op, ctx);
    for (const s of solicitudesTocadas(null, r.objeto)) tocadas.add(s);
    previo = r.estado;
  }
  const recalcular = (m: unknown): unknown => (esMuestra(m) && tocadas.has(m.application_id) ? dom.aplicarLocal(m, local.planes, local.avisos, hoy) : m);
  switch (clave) {
    case 'plan': return lista(local.planes);
    case 'avisos': return lista(local.avisos);
    case 'notas': return lista(local.notas);
    case 'recordatorios': return lista(local.recordatorios);
    case 'plantillas': return { ...datos, items: local.plantillas };
    case 'preferencias': return local.preferencias ?? datos;
    case 'muestras': return { ...datos, items: itemsDe(datos).map(recalcular) };
    case 'muestra': {
      const m: unknown = datos['muestra'];
      if (!esMuestra(m)) return datos;
      const id = m.application_id;
      return {
        ...datos,
        muestra: recalcular(m),
        planes: local.planes.filter((p) => p.application_id === id),
        avisos: local.avisos.filter((a) => a.solicitud_ids.includes(id)),
        notas: local.notas.filter((n) => n.entidad === 'muestra' && n.entidad_id === id),
        recordatorios: local.recordatorios.filter((r) => r.entidad === 'muestra' && r.entidad_id === id),
      };
    }
    case 'tienda':
    case 'producto': {
      const ms: unknown = datos['muestras'];
      return Array.isArray(ms) ? { ...datos, muestras: ms.map(recalcular) } : datos;
    }
    default:
      return datos;
  }
}

function esDetalleProducto(v: unknown): v is C.ProductoDetalleResponse {
  return esObjeto(v) && typeof v['product_id'] === 'string' && Array.isArray(v['muestras']) && Array.isArray(v['videos']) && 'ficha' in v && 'fila' in v;
}

/**
 * rev. 4 (15/11): los fixtures son anteriores a la ficha completa y no traen `extendido`; el demo lo arma con datos
 * sintéticos coherentes (demo/ficha_demo.ts). `?trazas=sin_permiso` simula el código 105005 de orders/trace/search.
 */
async function conFichaCompleta(datos: unknown, escenario: string | null): Promise<unknown> {
  if (!esDetalleProducto(datos) || datos.extendido) return datos;
  const muestras = await leerOpcional('/api/muestras', escenario);
  const meta = esObjeto(muestras) && esObjeto(muestras['meta_imagenes']) ? (muestras['meta_imagenes'] as C.MetaImagenes) : {};
  return completarFichaDemo(datos, {
    catalogo: itemsDe(muestras).filter(esMuestra),
    metaCatalogo: meta,
    ahora: dom.ahoraS(),
    trazasSinPermiso: parametroUrl('trazas') === 'sin_permiso',
  });
}

/** La copia de ?simular=android. rev. 5: con la Display API conectada (lo normal en la demo) lleva sus campos opcionales,
 *  como la que arma el hub demo (display_demo.conDisplayCopia); el fixture snapshot.json es anterior a la rev. 5. */
async function leerCopia(): Promise<C.SnapshotResponse | null> {
  const v = await leerOpcional('/api/snapshot', 'android');
  if (!esSnapshot(v)) return null;
  if (!conMetricas()) return v;
  const d = await display('android');
  return d ? conDisplayCopia(d, v) : v;
}

export function crearTransporteDemo(): Transporte {
  async function leer<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<Lectura> {
    const escenario = escenarioActivo();
    // ?simular=android&pc=conectada: con la PC al alcance, la ficha de producto la contesta el hub (vía ProxyHub)
    // completa, con `extendido`; sin la PC sale de la copia (deCopia), que no lo trae.
    if (escenario === 'android' && clave === 'producto' && parametroUrl('pc') === 'conectada') {
      const datos = await conDisplay(clave, await conFichaCompleta(await leerRuta(rutaDeConsulta(clave, params), escenario), escenario), escenario);
      return { datos, fuente: 'demo', copia_at: null, con_cambios_pendientes: false };
    }
    // rev. 5 · /api/display/estado: solo la ventana de Windows (el celular no la ve).
    if (clave === 'display') {
      if (escenario === 'android') throw soloEnPc();
      return { datos: await estadoDisplayActual(escenario), fuente: 'demo', copia_at: null, con_cambios_pendientes: false };
    }
    if (escenario === 'android') {
      const copia = await leerCopia();
      if (copia) {
        registrarMetaDe(copia);
        const hoy = dom.hoyLocal();
        const pendientes = memoriaDemo.pendientes;
        const conOps = pendientes.length > 0 ? dom.aplicarOpsACopia(copia, pendientes, hoy) : copia;
        const armada = dom.deCopia(clave, params, conOps, hoy);
        if (armada !== null) return { datos: armada, fuente: 'copia', copia_at: copia.generado_at, con_cambios_pendientes: pendientes.length > 0 };
      }
      if (clave !== 'sesion') throw necesitaPc();
      return { datos: await leerRuta(rutaDeConsulta(clave, params), escenario), fuente: 'demo', copia_at: null, con_cambios_pendientes: false };
    }
    let datos = await leerRuta(rutaDeConsulta(clave, params), escenario);
    datos = await superponerMemoria(clave, params, datos, escenario);
    if (clave === 'producto') datos = await conFichaCompleta(datos, escenario);
    datos = await conDisplay(clave, datos, escenario);
    if (clave === 'ajustes_pc' && esObjeto(datos)) datos = { ...datos, ...memoriaDemo.ajustes };
    if (clave === 'lan' && esObjeto(datos)) datos = { ...datos, ...memoriaDemo.lan };
    return { datos, fuente: 'demo', copia_at: null, con_cambios_pendientes: false };
  }

  async function obtener(ruta: string): Promise<unknown> {
    const escenario = escenarioActivo();
    if (escenario === 'android' && ruta !== '/api/sync/estado') throw soloEnPc();
    if (escenario) await avanzarSiDisparador(escenario, ruta);
    try {
      return await leerRuta(r0(ruta), escenario);
    } catch {
      throw soloEnPc();
    }
  }

  async function sesion(): Promise<C.SessionResponse | null> {
    const v = await leerOpcional('/api/session', escenarioActivo());
    return esSesion(v) ? v : null;
  }

  async function pedir(metodo: MetodoMutacion, ruta: string, cuerpo?: unknown): Promise<unknown> {
    const escenario = escenarioActivo();
    const enAndroid = escenario === 'android';
    if (metodo === 'POST' && ruta === '/api/sync') {
      const s = await sesion();
      if (!s) throw soloEnPc();
      return { sync_id: s.sync.sync_id ?? 1, ya_en_curso: s.sync.en_curso, estado: s.sync } satisfies C.SyncIniciarResponse;
    }
    const restaurar = /^\/api\/plantillas\/([^/]+)\/restaurar$/.exec(ruta);
    if (metodo === 'POST' && restaurar) {
      if (enAndroid) throw necesitaPc();
      const id = decodeURIComponent(restaurar[1] ?? '');
      // Restaurar = olvidar lo editado en memoria de esa plantilla.
      memoriaDemo.ops = memoriaDemo.ops.filter((o) => !(o.tipo === 'plantilla.editar' && o.id === id));
      const p = (await estadoLocal(escenario)).plantillas.find((x) => x.id === id);
      if (!p) throw new ErrorHub('no_encontrado', 'No encontramos esa plantilla.', 404);
      return p;
    }
    if (enAndroid) throw soloEnPc();
    if (ruta.startsWith('/api/display/')) return pedirDisplay(metodo, ruta, cuerpo, escenario);
    if (metodo === 'POST' && ruta === '/api/sync/cancelar') {
      const s = await sesion();
      if (!s) throw soloEnPc();
      return { ...s.sync, en_curso: false };
    }
    if (metodo === 'PATCH' && ruta === '/api/ajustes/pc' && esObjeto(cuerpo)) {
      memoriaDemo.ajustes = { ...memoriaDemo.ajustes, ...ajustesDe(cuerpo) };
      const base = await leerOpcional('/api/ajustes/pc', escenario);
      return esObjeto(base) ? { ...base, ...memoriaDemo.ajustes } : soloEnPcLanzar();
    }
    if (metodo === 'POST' && ruta === '/api/lan/activar' && esObjeto(cuerpo) && typeof cuerpo['activo'] === 'boolean') {
      memoriaDemo.lan = { ...memoriaDemo.lan, activo: cuerpo['activo'] };
      const base = await leerOpcional('/api/lan/estado', escenario);
      return esObjeto(base) ? { ...base, ...memoriaDemo.lan } : soloEnPcLanzar();
    }
    if (metodo === 'PATCH' && ruta === '/api/lan/estado' && esObjeto(cuerpo)) {
      if (typeof cuerpo['nombre_equipo'] === 'string') memoriaDemo.lan = { ...memoriaDemo.lan, nombre_equipo: cuerpo['nombre_equipo'] };
      const base = await leerOpcional('/api/lan/estado', escenario);
      return esObjeto(base) ? { ...base, ...memoriaDemo.lan } : soloEnPcLanzar();
    }
    if (metodo === 'POST' && ruta === '/api/auth/refrescar') {
      const s = await sesion();
      if (!s) throw soloEnPc();
      return { conexion: s.conexion } satisfies C.AuthEstadoResponse;
    }
    if (metodo === 'POST' && ruta === '/api/lan/firewall') {
      const d = await leerOpcional('/api/lan/firewall', escenario);
      if (!esObjeto(d)) throw soloEnPc();
      return { resultado: 'listo', diagnostico: d };
    }
    if (metodo === 'POST' && ruta === '/api/lan/emparejar') {
      const d = await leerOpcional('/api/lan/emparejar', escenario);
      if (!esObjeto(d)) throw soloEnPc();
      return d;
    }
    // Lo demás (autorizar, importar, borrar, decidir emparejamientos…) necesita el hub real.
    throw soloEnPc();
  }

  async function aplicarOps(ops: C.OpLocal[]): Promise<ResultadoOpTransporte[]> {
    const escenario = escenarioActivo();
    const ctx = contexto();
    if (escenario === 'android') {
      const copia = await leerCopia();
      const salida: ResultadoOpTransporte[] = [];
      for (const op of ops) {
        memoriaDemo.pendientes = [...memoriaDemo.pendientes, op];
        salida.push({ op_id: op.op_id, estado: 'en_cola', estado_hub: null, objeto: null, error: null });
      }
      if (copia) registrarMetaDe(copia);
      return salida;
    }
    let estado = await estadoLocal(escenario);
    const salida: ResultadoOpTransporte[] = [];
    for (const op of ops) {
      const r = aplicarOpAEstado(estado, op, ctx);
      if (!r.encontrada) {
        salida.push({ op_id: op.op_id, estado: 'error', estado_hub: 'invalida', objeto: null, error: new ErrorHub('no_encontrado', 'No encontramos eso en tus datos de demostración.', 404) });
        continue;
      }
      estado = r.estado;
      memoriaDemo.ops = [...memoriaDemo.ops, op];
      salida.push({ op_id: op.op_id, estado: 'aplicada', estado_hub: 'aplicada', objeto: r.objeto, error: null });
    }
    return salida;
  }

  function conectarEventos(sumidero: SumideroEventos): () => void {
    const escenario = escenarioActivo();
    // rev. 5 · 'display.cambio' del flujo simulado (?display=…) llega en cualquier escenario.
    sumiderosDisplay.add(sumidero);
    if (!escenario) {
      return () => {
        sumiderosDisplay.delete(sumidero);
      };
    }
    let vivo = true;
    let t: ReturnType<typeof setTimeout> | null = null;
    let faseAnterior: number | null = null;
    void (async () => {
      const s = await secuenciaDe(escenario);
      if (!s || !vivo) return;
      const paso = async (): Promise<void> => {
        if (!vivo) return;
        const v = await obtener(s.disparador).catch(() => null);
        if (!vivo) return;
        const indice = Math.min(s.cuadros.length - 1, indiceCuadro(escenario));
        const fase = s.cuadros[indice]?.fase ?? 0;
        if (esSyncEstado(v)) sumidero.evento({ tipo: v.en_curso ? 'sync.progreso' : 'sync.fin', estado: v });
        if (faseAnterior !== null && fase !== faseAnterior) {
          const ses = await sesion();
          sumidero.evento({
            tipo: 'datos.cambiaron',
            data_version: ses?.datos.data_version ?? fase,
            local_rev: ses?.datos.local_rev ?? 0,
            secciones: ['muestras', 'ordenes', 'productos', 'tiendas', 'videos', 'cuenta'],
          });
        }
        faseAnterior = fase;
        const terminado = (esSyncEstado(v) && !v.en_curso) || indice >= s.cuadros.length - 1;
        if (!terminado) t = setTimeout(() => void paso(), s.intervalo_ms);
      };
      await paso();
    })();
    return () => {
      vivo = false;
      if (t) clearTimeout(t);
      sumiderosDisplay.delete(sumidero);
    };
  }

  return {
    tipo: 'demo',
    leer,
    obtener,
    pedir,
    aplicarOps: (ops) => aplicarOps(ops),
    conectarEventos,
    vigilarSync(): void {
      /* La secuencia del escenario ya emite los eventos de la sincronización. */
    },
  };
}

function soloEnPcLanzar(): never {
  throw soloEnPc();
}

/** Solo los campos válidos de AjustesPcCambios. */
function ajustesDe(v: Record<string, unknown>): C.AjustesPcCambios {
  const c: C.AjustesPcCambios = {};
  const auto = v['sync_auto'];
  if (typeof auto === 'boolean') c.sync_auto = auto;
  const intervalo = v['sync_intervalo_min'];
  if (intervalo === 15 || intervalo === 30 || intervalo === 60) c.sync_intervalo_min = intervalo;
  const fondo = v['segundo_plano'];
  if (typeof fondo === 'boolean' || fondo === null) c.segundo_plano = fondo;
  const inicio = v['iniciar_con_windows'];
  if (typeof inicio === 'boolean') c.iniciar_con_windows = inicio;
  const densidad = v['densidad'];
  if (densidad === 'comoda' || densidad === 'compacta') c.densidad = densidad;
  return c;
}
