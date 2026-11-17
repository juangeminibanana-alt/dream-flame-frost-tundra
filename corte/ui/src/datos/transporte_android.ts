/**
 * @/datos · transporte de Android (BUILD_SPEC §8.3, C27, C35, C45; 04 §B.4–B.5).
 * - GET relativo: lo intercepta ProxyHub (hub firmado o copia). Si responde `X-CH-Fuente: sin_conexion` o fetch falla,
 *   la vista se arma con la copia (`/api/snapshot`, que la capa nativa sirve desde el archivo) + las ops pendientes
 *   (dominio.aplicarOpsACopia) con dominio.deCopia; null → ErrorHub('necesita_pc').
 * - Con datos del hub y ops aún en la cola (opsPendientes), la respuesta se superpone: listas locales con
 *   aplicarOpsACopia y muestras con dominio.aplicarLocal (C26: lo confirmado por el hub manda al llegar).
 * - Estado local: CreatorHubAndroid.ops() (la cola persiste antes de responder). Con la PC conectada se espera hasta
 *   2 s el creatorhub-ops con el resultado; si no llega: 'en_cola'.
 * - peticion() SOLO para POST /api/sync y POST /api/plantillas/{id}/restaurar; lo demás → solo_en_pc (sin la PC:
 *   necesita_pc).
 * - Eventos: creatorhub-copia (data_version/local_rev/img_rev → datos.cambiaron por secciones), creatorhub-ops y
 *   creatorhub-conexion; durante una sync (EstadoConexionPc.sync_en_curso) consulta /api/sync/estado cada 1.5 s.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, ParamsDe } from '@firmas/datos';
import type { PuenteAndroid } from '@firmas/plataforma';
import { estadoConexionPc } from '@/plataforma';
import { dom, registrarMetaDe } from './dominio';
import {
  ErrorHub, TEXTO_CONFLICTO, TEXTO_RED_ANDROID, errorDesdeCuerpo, errorDesdeRespuesta, esObjetoLocal, necesitaPc, soloEnPc,
} from './errores';
import { entraEnConsulta } from './optimista';
import { escucharAndroid, nuevoIdPedido, puenteAndroidDatos } from './puente';
import { CLAVES_LOCALES, TODAS_LAS_CLAVES, clavesDeSecciones, rutaDeConsulta, urlDe } from './rutas';
import type { Lectura, MetodoMutacion, ResultadoOpTransporte, SumideroEventos, Transporte } from './transporte';
import { desdeOpsResultado } from './transporte_windows';

export const INTERVALO_SYNC_MS = 1500;
export const ESPERA_OPS_MS = 2000;
const TOPE_PETICION_MS = 30_000;
const TIPOS_OP: ReadonlySet<string> = new Set<C.OpLocal['tipo']>([
  'plan.crear', 'plan.editar', 'plan.borrar', 'nota.crear', 'nota.editar', 'nota.borrar', 'recordatorio.crear',
  'recordatorio.editar', 'recordatorio.borrar', 'aviso.crear', 'aviso.editar', 'plantilla.editar', 'preferencias.editar',
]);

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function esOp(v: unknown): v is C.OpLocal {
  return esObjeto(v) && typeof v['op_id'] === 'string' && typeof v['tipo'] === 'string' && TIPOS_OP.has(v['tipo']);
}

function esSnapshot(v: unknown): v is C.SnapshotResponse {
  return esObjeto(v) && v['version_esquema'] === 1 && Array.isArray(v['muestras']) && esObjeto(v['local']);
}

/** MuestraVista mínima (lo necesario para dominio.aplicarLocal). */
export function esMuestra(v: unknown): v is C.MuestraVista {
  return esObjeto(v) && typeof v['application_id'] === 'string' && esObjeto(v['avance']) && esObjeto(v['avisos']);
}

function esSyncEstado(v: unknown): v is C.SyncEstado {
  return esObjeto(v) && typeof v['en_curso'] === 'boolean' && Array.isArray(v['pasos']);
}

function leerResultadoOps(v: unknown): C.OpsResultado | null {
  if (!esObjeto(v) || typeof v['op_id'] !== 'string') return null;
  const estado = v['estado'];
  if (estado !== 'aplicada' && estado !== 'duplicada' && estado !== 'conflicto' && estado !== 'invalida') return null;
  const r: C.OpsResultado = { op_id: v['op_id'], estado };
  if (esObjetoLocal(v['objeto'])) r.objeto = v['objeto'];
  if (typeof v['error'] === 'string') r.error = v['error'];
  return r;
}

function puenteObligatorio(): PuenteAndroid {
  const p = puenteAndroidDatos();
  if (!p) throw new ErrorHub('error_interno', 'Falta la capa de Android de Corte.', 0);
  return p;
}

/** Ops que la capa nativa aún no confirma con el hub. */
export function leerPendientes(): C.OpLocal[] {
  const p = puenteAndroidDatos();
  if (!p) return [];
  try {
    const v: unknown = JSON.parse(p.opsPendientes());
    return Array.isArray(v) ? v.filter(esOp) : [];
  } catch {
    return [];
  }
}

/** Superpone la copia con ops (ya aplicadas por aplicarOpsACopia) a una respuesta del hub. */
export function superponerPendientes(clave: ClaveConsulta, params: object, datos: unknown, local: C.SnapshotResponse['local'], hoy: C.FechaLocal): unknown {
  if (!esObjeto(datos)) return datos;
  const recalcular = (m: C.MuestraVista): C.MuestraVista => dom.aplicarLocal(m, local.planes, local.avisos, hoy);
  const filtrar = <T extends C.ObjetoLocal>(lista: T[]): T[] => lista.filter((o) => entraEnConsulta(clave, params, o));
  switch (clave) {
    case 'muestras': {
      const items: unknown = datos['items'];
      return Array.isArray(items) ? { ...datos, items: items.map((m: unknown) => (esMuestra(m) ? recalcular(m) : m)) } : datos;
    }
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
    case 'plan':
      return { ...datos, items: filtrar(local.planes) };
    case 'avisos':
      return { ...datos, items: filtrar(local.avisos) };
    case 'notas':
      return { ...datos, items: filtrar(local.notas) };
    case 'recordatorios':
      return { ...datos, items: filtrar(local.recordatorios) };
    case 'plantillas':
      return { ...datos, items: local.plantillas };
    case 'preferencias':
      return local.preferencias;
    default:
      return datos;
  }
}

const CLAVES_SUPERPUESTAS: ReadonlySet<ClaveConsulta> = new Set<ClaveConsulta>([...CLAVES_LOCALES, 'muestras', 'muestra']);

export function crearTransporteAndroid(): Transporte {
  let copia: C.SnapshotResponse | null = null;
  let etagCopia: string | null = null;
  let copiaVieja = true;
  let pidiendoCopia: Promise<C.SnapshotResponse | null> | null = null;
  let sumideroActual: SumideroEventos | null = null;
  let sondeo: ReturnType<typeof setInterval> | null = null;

  async function pedirCopia(): Promise<C.SnapshotResponse | null> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (etagCopia && copia) headers['If-None-Match'] = etagCopia;
    let resp: Response;
    try {
      resp = await fetch('/api/snapshot', { method: 'GET', cache: 'no-store', headers });
    } catch {
      return copia;
    }
    if (resp.status === 304 && copia) {
      copiaVieja = false;
      return copia;
    }
    if (!resp.ok || resp.headers.get('X-CH-Fuente') === 'sin_conexion') return copia;
    try {
      const v: unknown = await resp.json();
      if (!esSnapshot(v)) return copia;
      copia = v;
      etagCopia = resp.headers.get('ETag');
      copiaVieja = false;
      registrarMetaDe(v);
      return v;
    } catch {
      return copia;
    }
  }

  /** La copia sin conexión (en memoria; se revalida con If-None-Match cuando llega creatorhub-copia). */
  function obtenerCopia(): Promise<C.SnapshotResponse | null> {
    if (copia && !copiaVieja) return Promise.resolve(copia);
    if (!pidiendoCopia) pidiendoCopia = pedirCopia().finally(() => {
      pidiendoCopia = null;
    });
    return pidiendoCopia;
  }

  async function desdeCopia<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, pendientes: C.OpLocal[]): Promise<Lectura> {
    const c = await obtenerCopia();
    if (!c) throw necesitaPc();
    const hoy = dom.hoyLocal();
    const conOps = pendientes.length > 0 ? dom.aplicarOpsACopia(c, pendientes, hoy) : c;
    const armada = dom.deCopia(clave, params, conOps, hoy);
    if (armada === null) throw necesitaPc();
    return { datos: armada, fuente: 'copia', copia_at: c.generado_at, con_cambios_pendientes: pendientes.length > 0 };
  }

  async function getHub(url: string): Promise<{ resp: Response | null; sinConexion: boolean }> {
    try {
      const resp = await fetch(url, { method: 'GET', cache: 'no-store', headers: { Accept: 'application/json' } });
      return { resp, sinConexion: resp.headers.get('X-CH-Fuente') === 'sin_conexion' };
    } catch {
      return { resp: null, sinConexion: true };
    }
  }

  function conectado(): boolean {
    return estadoConexionPc()?.conectado === true;
  }

  async function peticion(metodo: string, ruta: string, cuerpo: unknown): Promise<unknown> {
    if (!conectado()) throw necesitaPc();
    const p = puenteObligatorio();
    const id = nuevoIdPedido();
    const respuesta = await new Promise<{ status: number; cuerpo: string } | null>((resolve) => {
      let hecho = false;
      const fin = (v: { status: number; cuerpo: string } | null): void => {
        if (hecho) return;
        hecho = true;
        clearTimeout(t);
        quitar();
        resolve(v);
      };
      const quitar = escucharAndroid(
        'creatorhub-respuesta',
        (d) => (d['id'] === id && typeof d['status'] === 'number' ? { status: d['status'], cuerpo: typeof d['cuerpo'] === 'string' ? d['cuerpo'] : '' } : null),
        fin,
      );
      const t = setTimeout(() => fin(null), TOPE_PETICION_MS);
      try {
        p.peticion(metodo, ruta, cuerpo === undefined ? '' : JSON.stringify(cuerpo), id);
      } catch {
        fin(null);
      }
    });
    if (!respuesta || respuesta.status === 0) throw new ErrorHub('red', TEXTO_RED_ANDROID, 0);
    if (respuesta.status >= 200 && respuesta.status < 300) {
      if (respuesta.cuerpo === '') return null;
      try {
        const v: unknown = JSON.parse(respuesta.cuerpo);
        return v;
      } catch {
        return null;
      }
    }
    const error = errorDesdeCuerpo(respuesta.status, respuesta.cuerpo);
    // 503 de la capa nativa sin conexión con la PC.
    if (respuesta.status === 503 && (error.codigo === 'error_interno' || error.codigo === 'sin_internet')) throw necesitaPc();
    throw error;
  }

  function esperarResultados(ids: ReadonlySet<string>, tope_ms: number): { promesa: Promise<Map<string, C.OpsResultado>>; cancelar: () => void } {
    const encontrados = new Map<string, C.OpsResultado>();
    let quitar: () => void = () => undefined;
    let t: ReturnType<typeof setTimeout> | null = null;
    let resolver: (m: Map<string, C.OpsResultado>) => void = () => undefined;
    const promesa = new Promise<Map<string, C.OpsResultado>>((resolve) => {
      resolver = resolve;
    });
    const fin = (): void => {
      if (t) clearTimeout(t);
      quitar();
      resolver(encontrados);
    };
    quitar = escucharAndroid(
      'creatorhub-ops',
      (d) => (Array.isArray(d['resultados']) ? d['resultados'].map(leerResultadoOps).filter((r): r is C.OpsResultado => r !== null) : null),
      (lista) => {
        for (const r of lista) if (ids.has(r.op_id)) encontrados.set(r.op_id, r);
        if (encontrados.size >= ids.size) fin();
      },
    );
    t = setTimeout(fin, tope_ms);
    return { promesa, cancelar: fin };
  }

  async function sondearSync(): Promise<void> {
    const { resp, sinConexion } = await getHub('/api/sync/estado');
    if (!resp || sinConexion || !resp.ok) return;
    let v: unknown;
    try {
      v = await resp.json();
    } catch {
      return;
    }
    if (!esSyncEstado(v)) return;
    sumideroActual?.evento({ tipo: v.en_curso ? 'sync.progreso' : 'sync.fin', estado: v });
    if (!v.en_curso) detenerSondeo();
  }

  function detenerSondeo(): void {
    if (sondeo) clearInterval(sondeo);
    sondeo = null;
  }

  function vigilarSync(): void {
    if (sondeo) return;
    sondeo = setInterval(() => void sondearSync(), INTERVALO_SYNC_MS);
    void sondearSync();
  }

  return {
    tipo: 'android',

    async leer<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<Lectura> {
      // rev. 5 · /api/display/* es solo de la ventana de Windows (por la LAN es 404): ni se intenta.
      if (clave === 'display') throw soloEnPc();
      const pendientes = leerPendientes();
      const { resp, sinConexion } = await getHub(urlDe(rutaDeConsulta(clave, params)));
      if (!resp || sinConexion) return desdeCopia(clave, params, pendientes);
      if (!resp.ok) throw await errorDesdeRespuesta(resp);
      let datos: unknown;
      try {
        datos = await resp.json();
      } catch {
        throw new ErrorHub('error_interno', 'Tu PC respondió algo que no esperábamos. Inténtalo de nuevo.', resp.status);
      }
      const desdeArchivo = resp.headers.get('X-CH-Fuente') === 'copia';
      const copiaAtCabecera = Number(resp.headers.get('X-CH-Copia-At'));
      let conPendientes = false;
      if (pendientes.length > 0 && CLAVES_SUPERPUESTAS.has(clave)) {
        const c = await obtenerCopia();
        if (c) {
          const hoy = dom.hoyLocal();
          // Las listas de la respuesta del hub reemplazan a las de la copia antes de aplicar la cola.
          const base: C.SnapshotResponse = { ...c, local: { ...c.local, ...listasDe(clave, datos) } };
          const conOps = dom.aplicarOpsACopia(base, pendientes, hoy);
          datos = superponerPendientes(clave, params, datos, conOps.local, hoy);
          conPendientes = true;
        }
      }
      return {
        datos,
        fuente: desdeArchivo ? 'copia' : 'hub',
        copia_at: desdeArchivo && Number.isFinite(copiaAtCabecera) && copiaAtCabecera > 0 ? copiaAtCabecera : null,
        con_cambios_pendientes: conPendientes,
      };
    },

    async obtener(ruta: string): Promise<unknown> {
      // Los GET que no son consultas son de hub.* (portapapeles, emparejar, firewall, exportar): rutas solo locales
      // (§5) que en Android fallan con solo_en_pc sin salir a la red (firma de AccionesHub). Solo el estado de la
      // sincronización se consulta por la LAN.
      if (ruta !== '/api/sync/estado') throw soloEnPc();
      const { resp, sinConexion } = await getHub(ruta);
      if (!resp || sinConexion) throw necesitaPc();
      if (!resp.ok) throw await errorDesdeRespuesta(resp);
      const v: unknown = await resp.json();
      return v;
    },

    async pedir(metodo: MetodoMutacion, ruta: string, cuerpo?: unknown): Promise<unknown> {
      const permitida = metodo === 'POST' && (ruta === '/api/sync' || /^\/api\/plantillas\/[^/]+\/restaurar$/.test(ruta));
      if (!permitida) throw soloEnPc();
      return peticion(metodo, ruta, cuerpo);
    },

    async aplicarOps(ops: C.OpLocal[]): Promise<ResultadoOpTransporte[]> {
      const p = puenteObligatorio();
      const espera = conectado() ? esperarResultados(new Set(ops.map((o) => o.op_id)), ESPERA_OPS_MS) : null;
      let aceptadas = 0;
      try {
        const v: unknown = JSON.parse(p.ops(JSON.stringify(ops)));
        aceptadas = esObjeto(v) && typeof v['aceptadas'] === 'number' ? v['aceptadas'] : 0;
      } catch {
        aceptadas = 0;
      }
      if (aceptadas < ops.length) {
        espera?.cancelar();
        const error = new ErrorHub('error_interno', 'No pudimos guardar el cambio en tu celular. Inténtalo de nuevo.', 0);
        return ops.map((op) => ({ op_id: op.op_id, estado: 'error', estado_hub: null, objeto: null, error }));
      }
      const resultados = espera ? await espera.promesa : new Map<string, C.OpsResultado>();
      return ops.map((op): ResultadoOpTransporte => {
        const r = resultados.get(op.op_id);
        if (!r) return { op_id: op.op_id, estado: 'en_cola', estado_hub: null, objeto: null, error: null };
        const t = desdeOpsResultado(r);
        if (t.estado === 'conflicto' && t.error) {
          return { ...t, error: new ErrorHub('conflicto', TEXTO_CONFLICTO, 409, undefined, undefined, t.objeto ?? undefined) };
        }
        return t;
      });
    },

    conectarEventos(sumidero: SumideroEventos): () => void {
      sumideroActual = sumidero;
      let versiones: { dv: number; lr: number; ir: number } | null = null;
      let estabaConectado = conectado();
      const quitarCopia = escucharAndroid(
        'creatorhub-copia',
        (d) =>
          typeof d['data_version'] === 'number' && typeof d['local_rev'] === 'number'
            ? {
                dv: d['data_version'],
                lr: d['local_rev'],
                ir: typeof d['img_rev'] === 'number' ? d['img_rev'] : 0,
                sync: d['sync_en_curso'] === true,
              }
            : null,
        (c) => {
          copiaVieja = true;
          const previo = versiones;
          versiones = { dv: c.dv, lr: c.lr, ir: c.ir };
          const secciones: C.Seccion[] = [];
          if (!previo || previo.dv !== c.dv) secciones.push('muestras', 'ordenes', 'productos', 'tiendas', 'videos', 'cuenta');
          if (!previo || previo.lr !== c.lr) secciones.push('local');
          if (!previo || previo.ir !== c.ir) secciones.push('productos', 'videos', 'tiendas', 'muestras');
          if (secciones.length > 0) {
            sumidero.evento({ tipo: 'datos.cambiaron', data_version: c.dv, local_rev: c.lr, secciones: [...new Set(secciones)], img_rev: c.ir });
          }
          if (c.sync) vigilarSync();
        },
      );
      const quitarOps = escucharAndroid(
        'creatorhub-ops',
        (d) => (Array.isArray(d['resultados']) ? true : null),
        () => sumidero.invalidar([...CLAVES_LOCALES, ...clavesDeSecciones(['local'])]),
      );
      const quitarConexion = escucharAndroid(
        'creatorhub-conexion',
        (d) => ({ conectado: d['conectado'] === true, sync: d['sync_en_curso'] === true }),
        (c) => {
          if (c.sync) vigilarSync();
          if (c.conectado !== estabaConectado) {
            estabaConectado = c.conectado;
            copiaVieja = true;
            sumidero.invalidar(TODAS_LAS_CLAVES); // cambia la fuente (hub ↔ copia)
          }
        },
      );
      if (estadoConexionPc()?.sync_en_curso) vigilarSync();
      return () => {
        quitarCopia();
        quitarOps();
        quitarConexion();
        detenerSondeo();
        sumideroActual = null;
      };
    },

    vigilarSync,
  };
}

/** Listas del bloque `local` de la copia que trae una respuesta del hub (para superponer la cola encima). */
function listasDe(clave: ClaveConsulta, datos: unknown): Partial<C.SnapshotResponse['local']> {
  if (!esObjeto(datos)) return {};
  const items = datos['items'];
  switch (clave) {
    case 'plan':
      return Array.isArray(items) ? { planes: items.filter((x): x is C.PlanVideo => esObjetoLocal(x)) } : {};
    case 'avisos':
      return Array.isArray(items) ? { avisos: items.filter((x): x is C.AvisoTienda => esObjetoLocal(x)) } : {};
    case 'notas':
      return Array.isArray(items) ? { notas: items.filter((x): x is C.Nota => esObjetoLocal(x)) } : {};
    case 'recordatorios':
      return Array.isArray(items) ? { recordatorios: items.filter((x): x is C.Recordatorio => esObjetoLocal(x)) } : {};
    case 'plantillas':
      return Array.isArray(items) ? { plantillas: items.filter((x): x is C.PlantillaMensaje => esObjetoLocal(x)) } : {};
    case 'preferencias':
      return esObjetoLocal(datos) && 'capacidad_videos_dia' in datos ? { preferencias: datos as C.PreferenciasSincronizadas } : {};
    default:
      return {};
  }
}
