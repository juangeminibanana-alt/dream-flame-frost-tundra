/* @/dominio · copia sin conexión del celular (BUILD_SPEC §8.3, C20, C26–C27). deCopia arma la respuesta de una consulta
   con la copia (SnapshotResponse + extras + ops pendientes ya aplicadas con aplicarOpsACopia); null = no se puede sin
   la PC ("Necesita tu PC encendida"). Claves que se arman (17): sesion, dashboard (30d y todo), muestras, muestra,
   tiendas, tienda, videos, video, productos, producto, ordenes, plan, avisos, plantillas, preferencias, notas y
   recordatorios. Las muestras siempre llevan el estado local superpuesto (aplicarLocal) y lo que depende de él
   (conteos, salud de las tiendas con pendientes, promesas) se recalcula con las reglas del hub. La plantilla sugerida
   sale de extras (la del hub) mientras el estado local de esa tienda no haya cambiado; si cambió, se recalcula.
   Nunca se presenta como completo algo que la copia trae recortado (01 principios 3 y 5):
   - videos, productos, tiendas y tienda son de todo el historial: con un rango que no lo cubre → null.
   - videos es el top 100 por comisión: si la copia llenó ese tope, el total real no se conoce → null.
   - ordenes trae los últimos 90 días y como máximo 500 pedidos: solo responde con un `desde` desde el que la copia
     tiene todos los pedidos (ordenesCompletasDesde); sin `desde` o con uno anterior → null.
   - video y producto se arman (§8.3) sin serie. Sus listas "Productos que vendió este video" y "Videos que lo venden"
     salen de los pedidos de 90 días, los extras y el top 100, y pueden quedar cortas; el conteo real va en la misma
     respuesta (video.productos y fila.videos), así que la pantalla detecta cuando `productos.length < video.productos`
     o `videos.length < fila.videos`. */
import type * as C from '@/contrato';
import type { ClaveConsulta, OrdenTiendas, ParamsDe, ParamsMuestras, ParamsOrdenes, RespuestaDe } from '@/datos';
import { fechaLocalDe, instanteDe, sumarDias } from './fechas';
import { formato } from './formato';
import { coincide } from './texto';
import {
  ORDEN_SALUD, aplicarLocal, contarTrabajo, esPendiente, esPromesaVencida, esPublicadaValida, estaAvisada, planVivo,
  plantillaSugeridaDe, promesaDe, saludConPendientes,
} from './trabajo';

const CLASES: readonly C.ClaseMuestra[] = ['debe_video', 'entregada', 'exenta', 'cancelada', 'nunca_enviada', 'pendiente_abierta'];
const GRUPOS: readonly C.GrupoMuestra[] = [
  'entregada', 'exenta', 'en_revision', 'por_vencer', 'pausada', 'vencida', 'esperando_aprobacion', 'en_camino', 'pedido_cancelado', 'sin_envio',
];
const SALUD_CON_PENDIENTES: ReadonlySet<C.SaludTienda> = new Set<C.SaludTienda>(['socio_con_pendientes', 'con_pendientes', 'con_plan']);
const SIN_FIN = Number.MAX_SAFE_INTEGER;
/** SnapshotResponse.ordenes_recientes (contrato.ts; hub analitica/servicio.py): pedidos de hoy − 89 … hoy (hoy = fecha
 *  local de generado_at), como máximo 500, los más recientes. */
const DIAS_ORDENES_COPIA = 90;
const MAX_ORDENES_COPIA = 500;
/** SnapshotResponse.videos: top 100 por comisión. */
const TOPE_VIDEOS_COPIA = 100;

function compararTexto(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Igualdad estructural sin depender del orden de las claves (el JSON del hub y lo que arma aplicarLocal pueden
 *  traerlas en otro orden). */
function igual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ra = a as Record<string, unknown>;
  const rb = b as Record<string, unknown>;
  const ka = Object.keys(ra);
  if (ka.length !== Object.keys(rb).length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(rb, k) && igual(ra[k], rb[k]));
}

/** El estado local de la muestra sigue como lo vio el hub al armar la copia: mismo avance (plan, etapa, fechas, rev)
 *  y mismos avisos (promesa, vencida —depende de hoy—, copiado sin confirmar, último enviado). */
function sinCambiosLocales(m: C.MuestraVista, original: C.MuestraVista | undefined): boolean {
  return original !== undefined && igual(m.avance, original.avance) && igual(m.avisos, original.avisos);
}

/** Ningún cambio local en las muestras de la tienda (de eso dependen la plantilla de cada una y la de la tienda). */
function tiendaSinCambios(muestrasTienda: readonly C.MuestraVista[], originales: ReadonlyMap<string, C.MuestraVista>): boolean {
  return muestrasTienda.every((m) => sinCambiosLocales(m, originales.get(m.application_id)));
}

/** La copia trae videos, productos y tiendas de TODO el historial (dashboard.todo.periodo; el hub los arma sin rango).
 *  Sirve sin desde/hasta o con un rango que cubre ese historial completo (p. ej. "Todo" o 12 meses); otro rango daría
 *  cifras de otro periodo sin aviso → null ("Necesita tu PC encendida"), como dashboard fuera de 30d y todo. */
function rangoEnLaCopia(p: { desde?: C.FechaLocal; hasta?: C.FechaLocal }, copia: C.SnapshotResponse): boolean {
  const { desde, hasta } = copia.dashboard.todo.periodo;
  return (p.desde === undefined || p.desde <= desde) && (p.hasta === undefined || p.hasta >= hasta);
}

/** Primer día desde el que la copia trae TODOS los pedidos que tenía el hub al armarla. Si se llenó el tope de 500, el
 *  día más antiguo de la lista puede venir cortado (el hub corta por creada_at, no por día): completa desde el día
 *  siguiente. Si no se llenó, la ventana de 90 días del hub (hoy − 89 de generado_at). */
export function ordenesCompletasDesde(copia: C.SnapshotResponse): C.FechaLocal {
  const ventana = sumarDias(fechaLocalDe(copia.generado_at), -(DIAS_ORDENES_COPIA - 1));
  if (copia.ordenes_recientes.length < MAX_ORDENES_COPIA) return ventana;
  let masAntigua: C.FechaLocal | null = null;
  for (const o of copia.ordenes_recientes) if (masAntigua === null || o.fecha < masAntigua) masAntigua = o.fecha;
  const corte = masAntigua === null ? ventana : sumarDias(masAntigua, 1);
  return corte > ventana ? corte : ventana;
}

/** La copia trae videos completos solo si no llenó el top 100 (con 100 o más pudo quedar fuera alguno y el total
 *  real no se conoce). */
function videosCompletos(copia: C.SnapshotResponse): boolean {
  return copia.videos.length < TOPE_VIDEOS_COPIA;
}

/** tienda_key de 01_ux §6.0: sin espacios a los lados, espacios repetidos colapsados y en minúsculas. */
function claveTienda(nombre: string | null): string {
  return (nombre ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es-MX');
}

// ---------------------------------------------------------------------------------------------- imágenes
function recorrerUrls(v: unknown, salida: Set<string>): void {
  if (typeof v === 'string') {
    if (v.startsWith('/img/')) salida.add(v.split('&t=')[0] ?? v);
    return;
  }
  if (Array.isArray(v)) {
    for (const x of v) recorrerUrls(x, salida);
    return;
  }
  if (v !== null && typeof v === 'object') for (const x of Object.values(v)) recorrerUrls(x, salida);
}

/** meta_imagenes de la copia restringido a las URLs que aparecen en la respuesta (como con_meta del hub). */
function metaDe(obj: unknown, copia: C.SnapshotResponse): C.MetaImagenes | null {
  const fuente = copia.meta_imagenes;
  if (!fuente) return null;
  const urls = new Set<string>();
  recorrerUrls(obj, urls);
  const meta: C.MetaImagenes = {};
  for (const u of [...urls].sort()) {
    const im = fuente[u];
    if (im) meta[u] = im;
  }
  return Object.keys(meta).length > 0 ? meta : null;
}

function conMeta<T extends { meta_imagenes?: C.MetaImagenes }>(obj: T, copia: C.SnapshotResponse): T {
  const meta = metaDe(obj, copia);
  return meta ? { ...obj, meta_imagenes: meta } : obj;
}

// ---------------------------------------------------------------------------------------------- muestras
/** Muestras de la copia con el estado local superpuesto (planes y avisos de copia.local). */
function vistaMuestras(copia: C.SnapshotResponse, hoy: C.FechaLocal): C.MuestraVista[] {
  return copia.muestras.map((m) => aplicarLocal(m, copia.local.planes, copia.local.avisos, hoy));
}

function ordenarMuestras(items: C.MuestraVista[], orden: C.OrdenMuestras): C.MuestraVista[] {
  const pos = (m: C.MuestraVista): number => m.posicion_cola ?? SIN_FIN;
  const id = (a: C.MuestraVista, b: C.MuestraVista): number => compararTexto(a.application_id, b.application_id);
  const copia = [...items];
  switch (orden) {
    case 'solicitud_asc':
      return copia.sort((a, b) => (a.solicitada_at ?? 0) - (b.solicitada_at ?? 0) || id(a, b));
    case 'solicitud_desc':
      return copia.sort((a, b) => (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0) || id(a, b));
    case 'valor_desc':
      return copia.sort((a, b) => (b.producto.precio_venta_min_centavos ?? 0) - (a.producto.precio_venta_min_centavos ?? 0) || pos(a) - pos(b) || id(a, b));
    case 'tienda':
      return copia.sort((a, b) => compararTexto(a.tienda.nombre.toLocaleLowerCase('es-MX'), b.tienda.nombre.toLocaleLowerCase('es-MX')) || pos(a) - pos(b) || id(a, b));
    default:
      return copia.sort((a, b) => pos(a) - pos(b) || id(a, b));
  }
}

function muestras(p: ParamsMuestras, copia: C.SnapshotResponse, hoy: C.FechaLocal): C.MuestrasResponse {
  const vista = vistaMuestras(copia, hoy);
  let items = vista;
  const grupos = p.grupo;
  if (grupos && grupos.length > 0) items = items.filter((m) => grupos.includes(m.grupo));
  const clases = p.clase;
  if (clases && clases.length > 0) items = items.filter((m) => clases.includes(m.clase));
  if (p.tienda !== undefined) items = items.filter((m) => m.tienda.tienda_key === p.tienda);
  const q = p.q?.trim();
  if (q) items = items.filter((m) => coincide(q, m.producto.titulo, m.producto.titulo_corto, m.tienda.nombre, m.variante, m.application_id));
  if (p.recibidas !== undefined) items = items.filter((m) => m.recibida === p.recibidas);
  items = ordenarMuestras(items, p.orden ?? 'prioridad');
  const conteos = Object.fromEntries(CLASES.map((c) => [c, 0])) as Record<C.ClaseMuestra, number>;
  const porGrupo = Object.fromEntries(GRUPOS.map((g) => [g, 0])) as Record<C.GrupoMuestra, number>;
  for (const m of vista) {
    conteos[m.clase] += 1;
    porGrupo[m.grupo] += 1;
  }
  return conMeta<C.MuestrasResponse>({ items, total: items.length, conteos, por_grupo: porGrupo, data_version: copia.data_version }, copia);
}

function pendientesPorTienda(vista: readonly C.MuestraVista[]): Map<string, C.MuestraVista[]> {
  const mapa = new Map<string, C.MuestraVista[]>();
  for (const m of vista) {
    if (!esPendiente(m)) continue;
    const lista = mapa.get(m.tienda.tienda_key);
    if (lista) lista.push(m);
    else mapa.set(m.tienda.tienda_key, [m]);
  }
  return mapa;
}

function motivoDe(m: C.MuestraVista, copia: C.SnapshotResponse): C.MotivoNoSePuede | null {
  return planVivo(m.application_id, copia.local.planes)?.motivo_no_se_puede ?? null;
}

function muestra(p: { id: string }, copia: C.SnapshotResponse, hoy: C.FechaLocal): C.MuestraDetalleResponse | null {
  const vista = vistaMuestras(copia, hoy);
  const m = vista.find((x) => x.application_id === p.id);
  if (!m) return null;
  const extra = copia.extras?.muestras[p.id];
  const pendTienda = pendientesPorTienda(vista).get(m.tienda.tienda_key)?.length ?? 0;
  // La del hub (extras) manda mientras nada local de la tienda haya cambiado; si cambió, se recalcula con sus reglas.
  const originales = new Map(copia.muestras.map((x) => [x.application_id, x] as const));
  const deLaTienda = vista.filter((x) => x.tienda.tienda_key === m.tienda.tienda_key);
  const sugerida = extra !== undefined && tiendaSinCambios(deLaTienda, originales)
    ? extra.plantilla_sugerida
    : plantillaSugeridaDe(m, pendTienda, motivoDe(m, copia));
  return conMeta<C.MuestraDetalleResponse>({
    muestra: m,
    historial: extra?.historial ?? [],
    notas: copia.local.notas.filter((n) => n.entidad_id === p.id),
    planes: copia.local.planes.filter((x) => x.application_id === p.id),
    recordatorios: copia.local.recordatorios.filter((r) => r.entidad_id === p.id),
    avisos: copia.local.avisos.filter((a) => a.solicitud_ids.includes(p.id)),
    plantilla_sugerida: sugerida,
    videos_del_producto: extra?.videos_del_producto ?? [],
    otras_de_la_tienda: deLaTienda
      .filter((x) => x.application_id !== p.id)
      .map((x) => ({ application_id: x.application_id, grupo: x.grupo, etiqueta: x.etiqueta, producto: x.producto })),
  }, copia);
}

// ---------------------------------------------------------------------------------------------- tiendas
function firmaPendientes(lista: readonly C.MuestraVista[], hoy: C.FechaLocal, avisos: readonly C.AvisoTienda[] | null): string {
  return lista
    .map((m) => {
      const vencida = avisos === null ? m.avisos.promesa_vencida : esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy);
      return `${m.application_id}:${m.avance.etapa === 'por_planear' ? 'p' : 'f'}:${vencida ? 'v' : '-'}`;
    })
    .sort()
    .join('|');
}

function porcentaje90(t: C.FilaTienda): number {
  return Math.round(t.ventas.participacion_90d * 100);
}

/** FilaTienda con el estado local: avisos y promesas siempre; pendientes, salud y su "por qué" solo si el estado local
 *  cambió las pendientes de la tienda respecto de lo que calculó el hub (si no, se conserva lo del hub). */
function filaConLocal(t: C.FilaTienda, todas: readonly C.MuestraVista[], originales: ReadonlyMap<string, C.MuestraVista>,
  avisos: readonly C.AvisoTienda[], hoy: C.FechaLocal): C.FilaTienda {
  const pend = todas.filter(esPendiente);
  let vigentes = 0;
  let vencidas = 0;
  let cumplidas = 0;
  for (const m of todas) {
    const p = promesaDe(m.application_id, avisos)?.fecha ?? null;
    if (p === null) continue;
    const e = m.avance.etapa;
    if (e !== 'publicada' && hoy <= p) vigentes += 1;
    if (esPromesaVencida(p, e, hoy)) vencidas += 1;
    if (e === 'publicada' && m.avance.fecha_publicada !== null && m.avance.fecha_publicada <= p) cumplidas += 1;
  }
  const fila: C.FilaTienda = {
    ...t,
    por_avisar: pend.some((m) => !estaAvisada(m.application_id, avisos)),
    promesas: { vigentes, vencidas, cumplidas },
  };
  const antes = todas.map((m) => originales.get(m.application_id)).filter((o): o is C.MuestraVista => o !== undefined && esPendiente(o));
  if (firmaPendientes(antes, hoy, null) === firmaPendientes(pend, hoy, avisos)) return fila;

  const idsAhora = new Set(pend.map((m) => m.application_id));
  const idsAntes = new Set(antes.map((m) => m.application_id));
  let valor = t.muestras.valor_debido_centavos;
  for (const m of antes) if (!idsAhora.has(m.application_id)) valor -= m.producto.precio_venta_min_centavos ?? 0;
  for (const m of pend) if (!idsAntes.has(m.application_id)) valor += m.producto.precio_venta_min_centavos ?? 0;
  valor = Math.max(0, valor);
  const n = pend.length;
  const s = n === 1 ? '' : 's';
  let salud = t.salud;
  let porque = t.salud_porque;
  if (n > 0) {
    salud = saludConPendientes(pend, t.es_socio, avisos, hoy);
    if (salud === 'con_plan') {
      const fechas = pend.map((m) => m.avance.fecha_planeada).filter((f): f is C.FechaLocal => f !== null).sort();
      porque = fechas[0] ? `Todo planeado · siguiente video el ${formato.fechaCorta(fechas[0])}` : 'Todo planeado';
    } else {
      porque = t.es_socio
        ? `${n} muestra${s} sin video · ${porcentaje90(t)} % de tu comisión en 90 días`
        : `${n} muestra${s} sin video · ${formato.dineroAprox(valor)} en producto recibido`;
    }
  } else if (SALUD_CON_PENDIENTES.has(t.salud)) {
    const publicadas = todas.filter((m) => esPublicadaValida(m.avance)).length;
    const cumplidasTotal = t.muestras.entregadas + t.muestras.exentas + publicadas;
    if (t.es_socio) {
      salud = 'socio';
      porque = t.ventas.ultima_venta_at !== null
        ? `${porcentaje90(t)} % de tu comisión en 90 días · última venta ${formato.fechaCorta(t.ventas.ultima_venta_at)}`
        : `${porcentaje90(t)} % de tu comisión en 90 días`;
    } else if (cumplidasTotal > 0) {
      salud = 'al_dia';
      porque = `Cumpliste con ${cumplidasTotal} muestras`;
    }
  }
  return {
    ...fila,
    salud,
    salud_porque: porque,
    muestras: { ...t.muestras, pendientes: n, debidas_con_plan: pend.filter((m) => m.avance.etapa !== 'por_planear').length, valor_debido_centavos: valor },
  };
}

function filasTiendas(copia: C.SnapshotResponse, vista: readonly C.MuestraVista[], hoy: C.FechaLocal): C.FilaTienda[] {
  const originales = new Map(copia.muestras.map((m) => [m.application_id, m] as const));
  const porTienda = new Map<string, C.MuestraVista[]>();
  for (const m of vista) {
    const lista = porTienda.get(m.tienda.tienda_key);
    if (lista) lista.push(m);
    else porTienda.set(m.tienda.tienda_key, [m]);
  }
  return copia.tiendas.map((t) => filaConLocal(t, porTienda.get(t.tienda_key) ?? [], originales, copia.local.avisos, hoy));
}

function ordenarTiendas(filas: C.FilaTienda[], orden: OrdenTiendas): C.FilaTienda[] {
  const k = (a: C.FilaTienda, b: C.FilaTienda): number => compararTexto(a.tienda_key, b.tienda_key);
  const copia = [...filas];
  switch (orden) {
    case 'comision':
      return copia.sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos || k(a, b));
    case 'deuda':
      return copia.sort((a, b) => b.muestras.pendientes - a.muestras.pendientes || b.muestras.valor_debido_centavos - a.muestras.valor_debido_centavos || k(a, b));
    case 'nombre':
      return copia.sort((a, b) => compararTexto(a.nombre.toLocaleLowerCase('es-MX'), b.nombre.toLocaleLowerCase('es-MX')));
    default:
      return copia.sort((a, b) => b.promesas.vencidas - a.promesas.vencidas || ORDEN_SALUD.indexOf(a.salud) - ORDEN_SALUD.indexOf(b.salud)
        || b.ventas.comision_180d_centavos - a.ventas.comision_180d_centavos || k(a, b));
  }
}

/** Plantilla sugerida para "Avisar a esta tienda" (03 §5.10): ≥ 2 pendientes → Varias muestras; 1 → la de esa
 *  muestra; sin pendientes y socio → Gracias por las ventas; si no, null. */
function plantillaTienda(t: C.FilaTienda, pend: readonly C.MuestraVista[], copia: C.SnapshotResponse): string | null {
  if (pend.length >= 2) return 'varias_muestras';
  const unica = pend[0];
  if (unica) return plantillaSugeridaDe(unica, 1, motivoDe(unica, copia));
  return t.es_socio ? 'gracias_por_las_ventas' : null;
}

// ---------------------------------------------------------------------------------------------- tablero
function round4(x: number): number {
  return Math.round(x * 10_000) / 10_000;
}

function resumenConLocal(r: C.ResumenMuestras, copia: C.SnapshotResponse, vista: readonly C.MuestraVista[], hoy: C.FechaLocal): C.ResumenMuestras {
  const conteos = contarTrabajo([...vista], copia.local.avisos, hoy);
  const originales = new Map(copia.muestras.map((m) => [m.application_id, m] as const));
  const abierta = (m: C.MuestraVista): boolean => !esPublicadaValida(m.avance) && m.avance.etapa !== 'no_se_puede';
  const deb = vista.filter((m) => m.clase === 'debe_video');
  const saldadas = deb.filter((m) => esPublicadaValida(m.avance)).length;
  const conPlan = deb.filter((m) => abierta(m) && m.avance.etapa !== 'por_planear').length;
  let vmin = r.debe_video.valor_min_centavos;
  let vmax = r.debe_video.valor_max_centavos;
  for (const m of deb) {
    const o = originales.get(m.application_id);
    if (!o || abierta(o) === abierta(m)) continue;
    const signo = abierta(m) ? 1 : -1;
    vmin += signo * (m.producto.precio_venta_min_centavos ?? 0);
    vmax += signo * (m.producto.precio_venta_max_centavos ?? m.producto.precio_venta_min_centavos ?? 0);
  }
  const ahora = instanteDe(hoy);
  let proxima: C.ResumenMuestras['proxima_fecha_limite'] = null;
  for (const m of vista) {
    if (!esPendiente(m) || m.fecha_limite_at === null || m.fecha_limite_at <= ahora) continue;
    if (proxima === null || m.fecha_limite_at < proxima.fecha_limite_at) proxima = { application_id: m.application_id, fecha_limite_at: m.fecha_limite_at };
  }
  const e = r.por_clase.entregada;
  const den = e + r.debe_video.n;
  return {
    ...r,
    debe_video: { ...r.debe_video, valor_min_centavos: Math.max(0, vmin), valor_max_centavos: Math.max(0, vmax), con_plan: conPlan, saldadas },
    pendientes: conteos.pendientes,
    tiendas_por_avisar: conteos.tiendas_por_avisar,
    promesas_vencidas: conteos.promesas_vencidas,
    cumplimiento: den > 0 ? round4((e + saldadas) / den) : null,
    proxima_fecha_limite: proxima,
  };
}

/** Rehace las alertas que dependen del estado local ("pendientes" y "promesas_vencidas") con los textos del hub. */
function alertasConLocal(alertas: readonly C.Alerta[], r: C.ResumenMuestras, tiendasConPendientes: number): C.Alerta[] {
  const resto = alertas.filter((a) => a.id !== 'pendientes' && a.id !== 'promesas_vencidas');
  const salida: C.Alerta[] = [];
  const pend = r.pendientes;
  if (pend > 0) {
    const sald = r.debe_video.saldadas;
    const t = tiendasConPendientes;
    salida.push({
      id: 'pendientes',
      nivel: 'critica',
      titulo: sald > 0 ? `Te faltan ${pend} de ${r.debe_video.n}; ya publicaste ${sald}`
        : `Tienes ${pend} muestra${pend !== 1 ? 's' : ''} sin video de ${t} tienda${t !== 1 ? 's' : ''}`,
      texto: 'TikTok ya las marca como vencidas. Empieza por las de arriba y avísale a cada tienda cuándo publicarás.',
      accion: { etiqueta: 'Ver pendientes', ruta: '/muestras' },
    });
  }
  const antes = resto.filter((a) => a.id.startsWith('tienda_clave:') || a.id.startsWith('limite:'));
  const despues = resto.filter((a) => !(a.id.startsWith('tienda_clave:') || a.id.startsWith('limite:')));
  salida.push(...antes);
  if (r.promesas_vencidas > 0) {
    salida.push({
      id: 'promesas_vencidas', nivel: 'critica', titulo: `${r.promesas_vencidas} promesas vencidas`,
      texto: 'Le dijiste a la tienda una fecha que ya pasó. Avísale la nueva fecha.',
      accion: { etiqueta: 'Avisar a mis tiendas', ruta: '/muestras/avisos' },
    });
  }
  salida.push(...despues);
  return salida;
}

function dashboard(p: { periodo: C.Periodo }, copia: C.SnapshotResponse, hoy: C.FechaLocal): C.DashboardResponse | null {
  const d = p.periodo === '30d' ? copia.dashboard['30d'] : p.periodo === 'todo' ? copia.dashboard.todo : null;
  if (!d) return null;
  const vista = vistaMuestras(copia, hoy);
  const resumen = resumenConLocal(d.muestras, copia, vista, hoy);
  const tiendasConPendientes = pendientesPorTienda(vista).size;
  return conMeta<C.DashboardResponse>({ ...d, muestras: resumen, alertas: alertasConLocal(d.alertas, resumen, tiendasConPendientes) }, copia);
}

// ---------------------------------------------------------------------------------------------- ventas
/** content_id de video que vendieron cada producto, según los pedidos recientes y los extras de las muestras. */
function videosPorProducto(copia: C.SnapshotResponse): Map<string, Set<string>> {
  const mapa = new Map<string, Set<string>>();
  const poner = (pid: string, cid: string): void => {
    const s = mapa.get(pid);
    if (s) s.add(cid);
    else mapa.set(pid, new Set([cid]));
  };
  for (const o of copia.ordenes_recientes) {
    for (const l of o.lineas) if (l.tipo_contenido === 'VIDEO' && l.content_id) poner(l.product_id, l.content_id);
  }
  const pidDe = new Map(copia.muestras.map((m) => [m.application_id, m.producto.product_id] as const));
  for (const [aid, ex] of Object.entries(copia.extras?.muestras ?? {})) {
    const pid = pidDe.get(aid);
    if (pid !== undefined) for (const v of ex.videos_del_producto) poner(pid, v.content_id);
  }
  return mapa;
}

/** Pedidos de la copia. Solo con un `desde` cubierto (ordenesCompletasDesde): p. ej. "Últimos 7 días" o "Últimos 30
 *  días". Sin `desde` (todo el historial, o por tienda, producto o video sin rango) o con uno anterior, la lista y el
 *  total saldrían recortados sin aviso → null ("Necesita tu PC encendida"). Un `desde` posterior al día en que se armó
 *  la copia tampoco: de esos días la copia no sabe nada (no es que haya 0 pedidos). */
function ordenes(p: ParamsOrdenes, copia: C.SnapshotResponse): C.OrdenesResponse | null {
  const { desde, hasta, estado, tienda, producto, video } = p;
  if (desde === undefined || desde < ordenesCompletasDesde(copia) || desde > fechaLocalDe(copia.generado_at)) return null;
  let items = copia.ordenes_recientes.filter((o) => o.fecha >= desde);
  if (hasta !== undefined) items = items.filter((o) => o.fecha <= hasta);
  if (estado && estado.length > 0) items = items.filter((o) => estado.includes(o.estado));
  if (tienda !== undefined) items = items.filter((o) => o.lineas.some((l) => claveTienda(l.tienda_nombre) === tienda));
  if (producto !== undefined) items = items.filter((o) => o.lineas.some((l) => l.product_id === producto));
  if (video !== undefined) items = items.filter((o) => o.lineas.some((l) => l.content_id === video));
  const q = p.q?.trim();
  if (q) items = items.filter((o) => coincide(q, o.order_id, ...o.lineas.flatMap((l) => [l.producto, l.tienda_nombre, l.product_id])));
  items = [...items].sort((a, b) => b.creada_at - a.creada_at || compararTexto(a.order_id, b.order_id));
  const porPagina = Math.min(200, Math.max(1, Math.floor(p.por_pagina ?? 50)));
  const pagina = Math.max(1, Math.floor(p.pagina ?? 1));
  const pag = items.slice((pagina - 1) * porPagina, pagina * porPagina);
  return conMeta<C.OrdenesResponse>({ items: pag, total: items.length, pagina, por_pagina: porPagina, data_version: copia.data_version }, copia);
}

// ---------------------------------------------------------------------------------------------- armadores
type Armador<K extends ClaveConsulta> = (params: ParamsDe<K>, copia: C.SnapshotResponse, hoy: C.FechaLocal) => RespuestaDe<K> | null;
type Armadores = { [K in ClaveConsulta]: Armador<K> };

const necesitaPc = (): null => null;

const ARMADORES: Armadores = {
  sesion: (_p, copia) => ({
    cuenta: copia.cuenta,
    conexion: {
      estado: copia.conexion.estado, access_expira_at: null, refresh_expira_at: null, scopes: [], scopes_faltantes: [],
      aviso: copia.conexion.aviso, origen: null,
    },
    sync: {
      en_curso: false, sync_id: null, tipo: null, origen: null, progreso: copia.sync.ultima_ok_at !== null ? 1 : 0, paso_actual: null,
      texto: '', pasos: [], iniciada_at: null, ultima_ok_at: copia.sync.ultima_ok_at, ultima_estado: copia.sync.ultima_estado,
      proxima_auto_at: null, ultimo_error: null,
    },
    datos: {
      data_version: copia.data_version, local_rev: copia.local_rev, ultima_sync_ok_at: copia.sync.ultima_ok_at,
      hay_datos: copia.muestras.length > 0 || copia.ordenes_recientes.length > 0 || copia.sync.ultima_ok_at !== null,
    },
    plataforma: 'android',
    // SnapshotResponse no trae el modo de la PC (faltante de contrato): la copia se trata como datos reales.
    modo: 'real',
    // Sin la PC: no se sincroniza ni se administra nada; el estado local sí se escribe (va a la cola).
    capacidades: { auth: false, lan_admin: false, portapapeles: false, escribir: true, sincronizar: false },
  }),
  dashboard,
  muestras,
  muestra,
  tiendas: (p, copia, hoy) => {
    if (!rangoEnLaCopia(p, copia)) return null;
    const filas = ordenarTiendas(filasTiendas(copia, vistaMuestras(copia, hoy), hoy), p.orden ?? 'atencion');
    return conMeta<C.TiendasResponse>({ items: filas, total: filas.length, data_version: copia.data_version }, copia);
  },
  tienda: (p, copia, hoy) => {
    if (!rangoEnLaCopia(p, copia)) return null;
    const base = copia.tiendas.find((x) => x.tienda_key === p.key);
    if (!base) return null;
    const ms = copia.muestras.filter((m) => m.tienda.tienda_key === p.key).map((m) => aplicarLocal(m, copia.local.planes, copia.local.avisos, hoy));
    const originales = new Map(copia.muestras.map((m) => [m.application_id, m] as const));
    const t = filaConLocal(base, ms, originales, copia.local.avisos, hoy);
    const extra = copia.extras?.tiendas[p.key];
    // La del hub (extras) manda mientras nada local de la tienda haya cambiado; si cambió, se recalcula con sus reglas.
    const sugerida = extra !== undefined && tiendaSinCambios(ms, originales) ? extra.plantilla_sugerida : plantillaTienda(t, ms.filter(esPendiente), copia);
    return conMeta<C.TiendaDetalleResponse>({
      tienda: t,
      muestras: ms,
      serie: extra?.serie ?? [],
      productos: copia.productos.filter((x) => x.tienda_key === p.key),
      notas: copia.local.notas.filter((n) => n.entidad === 'tienda' && n.entidad_id === p.key),
      avisos: copia.local.avisos.filter((a) => a.tienda_key === p.key),
      plantilla_sugerida: sugerida,
    }, copia);
  },
  serie: necesitaPc,
  videos: (p, copia) => {
    if (!rangoEnLaCopia(p, copia) || !videosCompletos(copia)) return null;
    const items = p.limite !== undefined ? copia.videos.slice(0, Math.max(0, Math.floor(p.limite))) : copia.videos;
    return conMeta<C.VideosResponse>({ items, total: copia.videos.length, data_version: copia.data_version }, copia);
  },
  video: (p, copia) => {
    const v = copia.videos.find((x) => x.content_id === p.id);
    if (!v) return null;
    const productos = new Set<string>();
    for (const [pid, cids] of videosPorProducto(copia)) if (cids.has(p.id)) productos.add(pid);
    return conMeta<C.VideoDetalleResponse>({ video: v, serie: [], productos: copia.productos.filter((x) => productos.has(x.product_id)) }, copia);
  },
  productos: (p, copia) => {
    if (!rangoEnLaCopia(p, copia)) return null;
    const items = p.limite !== undefined ? copia.productos.slice(0, Math.max(0, Math.floor(p.limite))) : copia.productos;
    return conMeta<C.ProductosResponse>({ items, total: copia.productos.length, data_version: copia.data_version }, copia);
  },
  producto: (p, copia, hoy) => {
    const fila = copia.productos.find((x) => x.product_id === p.id) ?? null;
    const ms = vistaMuestras(copia, hoy).filter((m) => m.producto.product_id === p.id);
    if (fila === null && ms.length === 0) return null;
    const ficha = ms[0] !== undefined && (fila === null || fila.con_ficha) ? ms[0].producto : null;
    const cids = videosPorProducto(copia).get(p.id) ?? new Set<string>();
    return conMeta<C.ProductoDetalleResponse>({
      product_id: p.id,
      ficha,
      con_inventario: null,
      categoria_ruta: ficha?.categoria ? ficha.categoria.split(/\s*>\s*/).join(' › ') : null,
      comision_anuncios_bp: null,
      fila,
      serie: [],
      videos: copia.videos.filter((v) => cids.has(v.content_id)),
      muestras: ms,
      notas: copia.local.notas.filter((n) => n.entidad === 'producto' && n.entidad_id === p.id),
    }, copia);
  },
  ordenes: (p, copia) => ordenes(p, copia),
  plan: (p, copia) => {
    const { desde, hasta } = p;
    const conRango = desde !== undefined || hasta !== undefined;
    const items = copia.local.planes.filter((x) => {
      if (!conRango) return true;
      if (x.fecha_plan === null) return false;
      return (desde === undefined || x.fecha_plan >= desde) && (hasta === undefined || x.fecha_plan <= hasta);
    });
    return { items, local_rev: copia.local_rev };
  },
  avisos: (p, copia) => ({
    items: copia.local.avisos.filter((a) => (p.tienda === undefined || a.tienda_key === p.tienda) && (p.solicitud === undefined || a.solicitud_ids.includes(p.solicitud))),
    local_rev: copia.local_rev,
  }),
  plantillas: (_p, copia) => ({ items: copia.local.plantillas, local_rev: copia.local_rev }),
  preferencias: (_p, copia) => copia.local.preferencias,
  notas: (p, copia) => ({
    items: copia.local.notas.filter((n) => (p.entidad === undefined || n.entidad === p.entidad) && (p.entidad_id === undefined || n.entidad_id === p.entidad_id)),
    local_rev: copia.local_rev,
  }),
  recordatorios: (p, copia) => ({
    items: copia.local.recordatorios.filter((r) => p.estado === undefined || r.estado === p.estado),
    local_rev: copia.local_rev,
  }),
  sync_historial: necesitaPc,
  sync_cobertura: necesitaPc,
  credenciales: necesitaPc,
  lan: necesitaPc,
  firewall: necesitaPc,
  ajustes_pc: necesitaPc,
  uso_datos: necesitaPc,
  display: necesitaPc,
};

/** Claves de BUILD_SPEC §8.3 que se pueden armar con la copia. */
export const CLAVES_DE_COPIA: readonly ClaveConsulta[] = [
  'sesion', 'dashboard', 'muestras', 'muestra', 'tiendas', 'tienda', 'videos', 'video', 'productos', 'producto', 'ordenes',
  'plan', 'avisos', 'plantillas', 'preferencias', 'notas', 'recordatorios',
];

/** Arma la respuesta de una consulta con la copia (SnapshotResponse + extras + ops pendientes ya aplicadas).
 *  null = no se puede sin la PC (la interfaz muestra "Necesita tu PC encendida"). Claves derivables: BUILD_SPEC §8.3. */
export function deCopia<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, copia: C.SnapshotResponse, hoy: C.FechaLocal): RespuestaDe<K> | null {
  const armar: Armador<K> | undefined = ARMADORES[clave];
  if (typeof armar !== 'function') return null;
  return armar(params, copia, hoy);
}

// ---------------------------------------------------------------------------------------------- ops pendientes
type Local = C.SnapshotResponse['local'];

function versionado(ahora: C.EpochS): { creado_at: C.EpochS; actualizado_at: C.EpochS; rev: number; dispositivo_id: string } {
  return { creado_at: ahora, actualizado_at: ahora, rev: 1, dispositivo_id: 'android' };
}

function aplicarOp(local: Local, op: C.OpLocal, ahora: C.EpochS): Local {
  switch (op.tipo) {
    case 'plan.crear': {
      const d = op.datos;
      if (local.planes.some((p) => p.id === d.id)) return local;
      const previo = d.application_id ? planVivo(d.application_id, local.planes) : null;
      const plan: C.PlanVideo = {
        id: d.id, application_id: d.application_id ?? null, product_id: d.product_id ?? null, tienda_key: d.tienda_key ?? null,
        titulo: d.titulo, fecha_plan: d.fecha_plan ?? null, estado: d.estado ?? 'por_planear', fecha_video_listo: d.fecha_video_listo ?? null,
        programada_para_at: d.programada_para_at ?? null, fecha_publicada: d.fecha_publicada ?? null, content_id: d.content_id ?? null,
        enlace_video: d.enlace_video ?? null, vinculo_origen: d.vinculo_origen ?? null, sugerencias_descartadas: d.sugerencias_descartadas ?? [],
        motivo_no_se_puede: d.motivo_no_se_puede ?? null, motivo_texto: d.motivo_texto ?? null, fijada: d.fijada ?? false,
        nombre_corto: d.nombre_corto ?? null, notas: d.notas ?? null, orden: d.orden ?? 0,
        en_cohorte_desde_at: previo?.en_cohorte_desde_at ?? null, ...versionado(ahora),
      };
      // Un solo plan vivo por solicitud (ux_plan_muestra): el nuevo reemplaza al anterior en la vista local.
      const planes = previo ? local.planes.filter((p) => p.id !== previo.id) : [...local.planes];
      return { ...local, planes: [...planes, plan] };
    }
    case 'plan.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, planes: local.planes.map((p) => (p.id === op.id ? { ...p, ...cambios, rev: p.rev + 1, actualizado_at: ahora } : p)) };
    }
    case 'plan.borrar':
      return { ...local, planes: local.planes.filter((p) => p.id !== op.id) };
    case 'nota.crear': {
      const d = op.datos;
      if (local.notas.some((n) => n.id === d.id)) return local;
      const nota: C.Nota = { id: d.id, entidad: d.entidad, entidad_id: d.entidad_id, texto: d.texto, fijada: d.fijada ?? false, ...versionado(ahora) };
      return { ...local, notas: [...local.notas, nota] };
    }
    case 'nota.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, notas: local.notas.map((n) => (n.id === op.id ? { ...n, ...cambios, rev: n.rev + 1, actualizado_at: ahora } : n)) };
    }
    case 'nota.borrar':
      return { ...local, notas: local.notas.filter((n) => n.id !== op.id) };
    case 'recordatorio.crear': {
      const d = op.datos;
      if (local.recordatorios.some((r) => r.id === d.id)) return local;
      const rec: C.Recordatorio = {
        id: d.id, entidad: d.entidad ?? 'general', entidad_id: d.entidad_id ?? null, titulo: d.titulo, vence_at: d.vence_at,
        repetir: d.repetir ?? 'no', estado: 'activo', pospuesto_hasta: null, notificado_at: null, ...versionado(ahora),
      };
      return { ...local, recordatorios: [...local.recordatorios, rec] };
    }
    case 'recordatorio.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, recordatorios: local.recordatorios.map((r) => (r.id === op.id ? { ...r, ...cambios, rev: r.rev + 1, actualizado_at: ahora } : r)) };
    }
    case 'recordatorio.borrar':
      return { ...local, recordatorios: local.recordatorios.filter((r) => r.id !== op.id) };
    case 'aviso.crear': {
      const d = op.datos;
      if (local.avisos.some((a) => a.id === d.id)) return local;
      const aviso: C.AvisoTienda = {
        id: d.id, tienda_key: d.tienda_key, solicitud_ids: [...d.solicitud_ids], plantilla_id: d.plantilla_id, texto: d.texto,
        compromisos: { ...d.compromisos }, fecha_anterior: d.fecha_anterior ?? null, origen: d.origen, copiado_at: d.copiado_at ?? null,
        marcado_enviado_at: d.marcado_enviado_at ?? null, quitado_at: null, ...versionado(ahora),
      };
      return { ...local, avisos: [...local.avisos, aviso] };
    }
    case 'aviso.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, avisos: local.avisos.map((a) => (a.id === op.id ? { ...a, ...cambios, rev: a.rev + 1, actualizado_at: ahora } : a)) };
    }
    case 'plantilla.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, plantillas: local.plantillas.map((p) => (p.id === op.id ? { ...p, ...cambios, rev: p.rev + 1, actualizado_at: ahora } : p)) };
    }
    case 'preferencias.editar': {
      const { rev: _rev, ...cambios } = op.cambios;
      return { ...local, preferencias: { ...local.preferencias, ...cambios, rev: local.preferencias.rev + 1 } };
    }
  }
}

/** Aplica ops pendientes (cola de Android) al bloque `local` de la copia, en orden y sin mutar la copia. Optimista: una
 *  edición se aplica aunque su `rev` ya no coincida (el hub decide al recibirla; si hay conflicto gana la PC, C26).
 *  Crear con un id que ya existe no hace nada (idempotente por id, como el hub). */
export function aplicarOpsACopia(copia: C.SnapshotResponse, ops: C.OpLocal[], hoy: C.FechaLocal): C.SnapshotResponse {
  if (ops.length === 0) return copia;
  const ahora = instanteDe(hoy);
  let local: Local = copia.local;
  for (const op of ops) local = aplicarOp(local, op, ahora);
  return { ...copia, local };
}
