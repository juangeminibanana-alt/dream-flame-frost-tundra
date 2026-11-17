/**
 * Lógica pura de Muestras › Pendientes y Todas (ui-muestras-cola): filtros, orden dentro de cada grupo, secciones de
 * 01 §4.2, conteos de la franja, punto de control 2 de la primera sincronización (C34) y el reacomodo del plan de la
 * oferta única «¿Reordenamos tu plan?» (01 §4.5 regla 6). Sin React ni DOM: se prueba sola (logica.test.ts).
 */
import type * as C from '@/contrato';
import type { OperacionPlan } from '@/dominio';
import { coincide, epochDeFecha, esPendiente, fechaLocalDe, formato, sumarDias } from '@/dominio';
import { T } from './textos';

// ============================================================================ tipos de la barra de herramientas
export type Agrupar = 'prioridad' | 'tienda' | 'tipo' | 'etapa' | 'mes';
export type OrdenCola = 'sugerido' | 'antiguas' | 'comision' | 'vendidas' | 'precio' | 'tienda';
export type VistaCola = 'lista' | 'tabla' | 'tablero';
export const AGRUPACIONES: readonly Agrupar[] = ['prioridad', 'tienda', 'tipo', 'etapa', 'mes'];
export const ORDENES: readonly OrdenCola[] = ['sugerido', 'antiguas', 'comision', 'vendidas', 'precio', 'tienda'];
export const VISTAS: readonly VistaCola[] = ['lista', 'tabla', 'tablero'];

/** Grupos de TikTok que pueden filtrarse en Pendientes (01 §4.2 «Estado en TikTok»). */
export const GRUPOS_FILTRO: readonly C.GrupoMuestra[] = ['por_vencer', 'vencida', 'pausada', 'en_revision'];

export interface FiltrosCola {
  q: string;
  grupos: C.GrupoMuestra[];
  yaLoVendo: boolean;
  etiquetable: boolean;
  conPromesa: boolean;
  fijadas: boolean;
}
export const FILTROS_VACIOS: FiltrosCola = { q: '', grupos: [], yaLoVendo: false, etiquetable: false, conPromesa: false, fijadas: false };

/** Cuántos filtros hay activos (la búsqueda cuenta como uno). */
export function contarFiltros(f: FiltrosCola): number {
  return (f.q.trim() ? 1 : 0) + (f.grupos.length > 0 ? 1 : 0) + [f.yaLoVendo, f.etiquetable, f.conPromesa, f.fijadas].filter(Boolean).length;
}

export function nombreDe(m: Pick<C.MuestraVista, 'producto'>): string {
  return m.producto.titulo_corto ?? m.producto.titulo ?? `Producto ${formato.idCorto(m.producto.product_id)}`;
}

export function filtrar(muestras: readonly C.MuestraVista[], f: FiltrosCola): C.MuestraVista[] {
  const q = f.q.trim();
  return muestras.filter((m) => {
    if (q && !coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante)) return false;
    if (f.grupos.length > 0 && !f.grupos.includes(m.grupo)) return false;
    if (f.yaLoVendo && !m.razones.includes('ya_lo_vendes') && m.ventas_producto.pedidos_validos <= 0) return false;
    if (f.etiquetable && m.prioridad === 'no_se_puede_etiquetar') return false;
    if (f.conPromesa && m.avisos.promesa === null) return false;
    if (f.fijadas && !m.avance.fijada) return false;
    return true;
  });
}

// ============================================================================ orden dentro de cada grupo
const nulosAlFinal = (a: number | null, b: number | null, desc: boolean): number => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return desc ? b - a : a - b;
};

/** Orden estable. 'sugerido' conserva el orden recibido (la cola del hub, ya estabilizada) con las fijadas arriba. */
export function ordenar(muestras: readonly C.MuestraVista[], orden: OrdenCola): C.MuestraVista[] {
  const indice = new Map(muestras.map((m, i) => [m.application_id, i] as const));
  const desempate = (a: C.MuestraVista, b: C.MuestraVista): number => (indice.get(a.application_id) ?? 0) - (indice.get(b.application_id) ?? 0);
  const comparar: Record<OrdenCola, (a: C.MuestraVista, b: C.MuestraVista) => number> = {
    sugerido: (a, b) => Number(b.avance.fijada) - Number(a.avance.fijada),
    // Sin fecha de solicitud cuenta como la más antigua (01 §6.0).
    antiguas: (a, b) => (a.solicitada_at ?? -Infinity) - (b.solicitada_at ?? -Infinity),
    comision: (a, b) => nulosAlFinal(a.producto.comision_por_venta_centavos, b.producto.comision_por_venta_centavos, true),
    vendidas: (a, b) => nulosAlFinal(a.producto.unidades_vendidas_global, b.producto.unidades_vendidas_global, true),
    precio: (a, b) => nulosAlFinal(a.producto.precio_venta_min_centavos, b.producto.precio_venta_min_centavos, true),
    tienda: (a, b) => a.tienda.nombre.localeCompare(b.tienda.nombre, 'es-MX', { sensitivity: 'base' }),
  };
  const f = comparar[orden];
  return [...muestras].sort((a, b) => f(a, b) || desempate(a, b));
}

// ============================================================================ secciones de 01 §4.2
export type IdSeccionPrioridad = keyof typeof T.seccion;
export interface Seccion {
  id: string;
  titulo: string;
  muestras: C.MuestraVista[];
  /** «Decidiste no hacerlas» empieza colapsada (01 §4.2). */
  colapsadaPorOmision: boolean;
  /** Sección informativa o de trabajo especial (promesas vencidas, no se pueden etiquetar). */
  tipo: 'trabajo' | 'promesas' | 'etiquetar' | 'informativa' | 'resuelta';
}

/** Publicada sin un aviso posterior a la publicación (01 §2.5 «Falta avisar»). */
export function faltaAvisar(m: C.MuestraVista): boolean {
  if (m.avance.etapa !== 'publicada') return false;
  const publicada = m.avance.fecha_publicada;
  const ultimo = m.avisos.ultimo_enviado_at;
  if (ultimo === null) return true;
  return publicada !== null && ultimo < epochDeFecha(publicada);
}

/** Sección de 01 §4.2 a la que pertenece una muestra con la agrupación por prioridad (gana la primera regla). */
export function seccionPrioridad(m: C.MuestraVista, prioridad: C.NivelPrioridad | null = m.prioridad): IdSeccionPrioridad | null {
  if (m.avance.etapa === 'no_se_puede') return 'no_hacer';
  if (faltaAvisar(m)) return 'falta_avisar';
  if (m.grupo === 'en_revision') return 'en_revision';
  if (!esPendiente(m)) return null;
  if (m.grupo === 'por_vencer') return 'vencen_pronto';
  if (m.avisos.promesa_vencida) return 'promesas_vencidas';
  if (m.grupo === 'pausada') return 'pausadas';
  if (prioridad === 'no_se_puede_etiquetar') return 'no_etiquetar';
  if (prioridad === 'media') return 'media';
  if (prioridad === 'baja') return 'baja';
  return 'alta';
}

const ORDEN_SECCIONES: readonly IdSeccionPrioridad[] = [
  'vencen_pronto', 'promesas_vencidas', 'en_revision', 'alta', 'media', 'baja', 'falta_avisar', 'no_etiquetar', 'pausadas', 'no_hacer',
];
const TIPO_SECCION: Readonly<Record<IdSeccionPrioridad, Seccion['tipo']>> = {
  vencen_pronto: 'trabajo', promesas_vencidas: 'promesas', en_revision: 'informativa', alta: 'trabajo', media: 'trabajo', baja: 'trabajo',
  falta_avisar: 'trabajo', no_etiquetar: 'etiquetar', pausadas: 'trabajo', no_hacer: 'resuelta',
};

/** Diccionario local de categorías frecuentes que llegan en inglés (01 §4.2). Lo desconocido se muestra tal cual. */
const DICCIONARIO_CATEGORIAS: Readonly<Record<string, string>> = {
  "men's wallets": 'Carteras de hombre',
  "men's boots": 'Botas de hombre',
  "men's t-shirts": 'Camisetas',
  "men's shirts": 'Camisas',
  "men's vests": 'Chalecos',
  "men's hoodies & sweatshirts": 'Sudaderas',
  "men's underwear": 'Ropa interior',
  "men's jeans": 'Jeans',
  "men's pants": 'Pantalones',
  "men's sneakers": 'Tenis',
  "men's coats & jackets": 'Chamarras y abrigos',
};

/** Tipo de prenda = hoja de la categoría ('A > B > Camisetas' → 'Camisetas'), traducida si está en el diccionario. */
export function tipoDePrenda(categoria: string | null): string {
  if (!categoria) return T.sinCategoria;
  const hoja = categoria.split('>').map((s) => s.trim()).filter(Boolean).pop() ?? categoria.trim();
  return DICCIONARIO_CATEGORIAS[hoja.toLowerCase()] ?? hoja;
}

function agruparEn(muestras: readonly C.MuestraVista[], clave: (m: C.MuestraVista) => string, titulo: (k: string) => string, prefijo: string): Seccion[] {
  const mapa = new Map<string, C.MuestraVista[]>();
  for (const m of muestras) {
    const k = clave(m);
    const l = mapa.get(k);
    if (l) l.push(m);
    else mapa.set(k, [m]);
  }
  return [...mapa.entries()].map(([k, l]) => ({ id: `${prefijo}:${k}`, titulo: titulo(k), muestras: l, colapsadaPorOmision: false, tipo: 'trabajo' as const }));
}

const ETAPAS_TRABAJO: readonly C.EtapaAvance[] = ['por_planear', 'planeada', 'video_listo', 'programada'];

/**
 * Secciones visibles. `prioridades` = prioridad «aceptada» por fila (la de la última vez que el usuario vio el orden):
 * así una sincronización que cambia la prioridad no mueve filas de sección por su cuenta (01 §4.16).
 */
export function seccionar(muestras: readonly C.MuestraVista[], agrupar: Agrupar, etiquetaEtapa: Readonly<Record<C.EtapaAvance, string>>, prioridades?: ReadonlyMap<string, C.NivelPrioridad | null>): Seccion[] {
  const prio = (m: C.MuestraVista): C.NivelPrioridad | null => (prioridades?.has(m.application_id) ? (prioridades.get(m.application_id) ?? null) : m.prioridad);
  if (agrupar === 'prioridad') {
    const porSeccion = new Map<IdSeccionPrioridad, C.MuestraVista[]>();
    for (const m of muestras) {
      const s = seccionPrioridad(m, prio(m));
      if (s === null) continue;
      const l = porSeccion.get(s);
      if (l) l.push(m);
      else porSeccion.set(s, [m]);
    }
    return ORDEN_SECCIONES.filter((s) => (porSeccion.get(s)?.length ?? 0) > 0).map((s) => ({
      id: s,
      titulo: T.seccion[s],
      muestras: porSeccion.get(s) ?? [],
      colapsadaPorOmision: s === 'no_hacer',
      tipo: TIPO_SECCION[s],
    }));
  }
  // Otras agrupaciones: las pendientes por la clave pedida y, al final, las que ya no son trabajo (01 §4.2).
  const trabajo = muestras.filter((m) => esPendiente(m) || m.grupo === 'en_revision');
  const resto = muestras.filter((m) => !trabajo.includes(m));
  let grupos: Seccion[];
  if (agrupar === 'tienda') grupos = agruparEn(trabajo, (m) => m.tienda.nombre, (k) => k, 'tienda');
  else if (agrupar === 'tipo') grupos = agruparEn(trabajo, (m) => tipoDePrenda(m.producto.categoria), (k) => k, 'tipo');
  else if (agrupar === 'mes') {
    const claveMes = (m: C.MuestraVista): string => (m.solicitada_at === null ? '' : fechaLocalDe(m.solicitada_at).slice(0, 7));
    grupos = agruparEn(trabajo, claveMes, (k) => (k === '' ? T.sinFechaSolicitud : tituloMes(k)), 'mes');
    // Las sin fecha cuentan como las más antiguas (01 §6.0): van primero; luego de la más antigua a la más reciente.
    grupos.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    grupos = ETAPAS_TRABAJO.map((e) => ({ id: `etapa:${e}`, titulo: etiquetaEtapa[e], muestras: trabajo.filter((m) => m.avance.etapa === e), colapsadaPorOmision: false, tipo: 'trabajo' as const })).filter((s) => s.muestras.length > 0);
  }
  const fin = seccionar(resto, 'prioridad', etiquetaEtapa, prioridades).filter((s) => s.id === 'falta_avisar' || s.id === 'no_hacer');
  return [...grupos, ...fin];
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/** '2026-09' → 'Septiembre 2026'. */
export function tituloMes(aaaamm: string): string {
  const [a, m] = aaaamm.split('-');
  const nombre = MESES[Number(m) - 1] ?? aaaamm;
  return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${a ?? ''}`.trim();
}

// ============================================================================ franja de progreso y acción principal
export interface EstadoPlanCola {
  /** Hay al menos una pendiente con fecha (etapa planeada o más avanzada sin publicar). */
  hayPlan: boolean;
  termina: C.FechaLocal | null;
  publica: C.FechaLocal | null;
  /** Planeadas para hoy que aún no tienen video listo. */
  paraHoy: number;
}

export function estadoPlan(muestras: readonly C.MuestraVista[], hoy: C.FechaLocal): EstadoPlanCola {
  const conFecha = muestras.filter((m) => esPendiente(m) && m.avance.fecha_planeada !== null && m.avance.etapa !== 'por_planear');
  const fechas = conFecha.map((m) => m.avance.fecha_planeada).filter((f): f is C.FechaLocal => f !== null).sort();
  const termina = fechas.length > 0 ? (fechas[fechas.length - 1] ?? null) : null;
  return {
    hayPlan: conFecha.length > 0,
    termina,
    publica: termina ? sumarDias(termina, 2) : null,
    paraHoy: conFecha.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada === hoy).length,
  };
}

export type AccionCola = 'armar_plan' | 'avisar' | 'sesion' | null;
/** Una sola acción principal (01 §4.2): sin plan → Armar mi plan; con tiendas por avisar → Avisar; si no, Sesión. */
export function accionPrincipalCola(plan: EstadoPlanCola, tiendasPorAvisar: number, pendientes: number): AccionCola {
  if (pendientes === 0) return null;
  if (!plan.hayPlan) return 'armar_plan';
  if (tiendasPorAvisar > 0) return 'avisar';
  return plan.paraHoy > 0 ? 'sesion' : 'armar_plan';
}

// ============================================================================ punto de control 2 (C34) y oferta única
function pasoOrdenes(e: C.SyncEstado): C.SyncPaso | undefined {
  return e.pasos.find((p) => p.paso === 'ordenes');
}
const TERMINADO: ReadonlySet<C.EstadoPaso> = new Set<C.EstadoPaso>(['ok', 'parcial']);

/** Primera sincronización = nunca ha terminado una con éxito (ni según la sesión ni según el último SyncEstado). */
export function esPrimeraSync(ultimaOkSesion: C.EpochS | null | undefined, e: C.SyncEstado | null): boolean {
  return (ultimaOkSesion ?? null) === null && (e?.ultima_ok_at ?? null) === null;
}

/** ¿Faltan aún las ventas de 180 días de la PRIMERA sincronización? («Orden provisional: faltan tus ventas»). */
export function faltanVentas(e: C.SyncEstado | null, primeraSync: boolean): boolean {
  if (!e || !e.en_curso || !primeraSync) return false;
  const p = pasoOrdenes(e);
  return p !== undefined && !TERMINADO.has(p.estado) && p.estado !== 'omitido';
}

/**
 * ¿Ya pasó el punto de control 2 de la PRIMERA sincronización? Sí mientras esa sincronización sigue en curso y su paso
 * 'ordenes' (ventas de 180 días) ya terminó (ok o parcial). Al terminar la primera sincronización la ventana se cierra:
 * la oferta «¿Reordenamos tu plan?» es de ese momento (01 §4.5 regla 6) y no se arrastra a sincronizaciones posteriores.
 */
export function pasoPuntoControl2(e: C.SyncEstado | null, primeraSync: boolean): boolean {
  if (!e || !e.en_curso || !primeraSync) return false;
  const p = pasoOrdenes(e);
  return p !== undefined && TERMINADO.has(p.estado);
}

/** Mismo orden de ids (para saber si «cambió el orden sugerido»). */
export function mismoOrden(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** Avisos «enviados» (no quitados): con alguno, la oferta de reordenar ya no se ofrece (01 §4.5 regla 6). */
export function hayAvisosEnviados(avisos: readonly C.AvisoTienda[]): boolean {
  return avisos.some((a) => a.marcado_enviado_at !== null && a.quitado_at === null);
}

/**
 * Reacomoda el plan existente al orden nuevo SIN cambiar la fecha de término: se toman las fechas de las planeadas que
 * se pueden mover (no fijadas y sin promesa), se ordenan, y se reparten en el orden nuevo de la cola. Solo devuelve
 * las ediciones que cambian algo (un solo lote, un solo Deshacer).
 */
export function opsReordenarPlan(enOrdenNuevo: readonly C.MuestraVista[]): OperacionPlan[] {
  const movibles = enOrdenNuevo.filter(
    (m) => esPendiente(m) && m.avance.etapa === 'planeada' && m.avance.plan_id !== null && m.avance.fecha_planeada !== null && !m.avance.fijada && m.avisos.promesa === null,
  );
  const fechas = movibles.map((m) => m.avance.fecha_planeada).filter((f): f is C.FechaLocal => f !== null).sort();
  const ops: OperacionPlan[] = [];
  movibles.forEach((m, i) => {
    const nueva = fechas[i];
    if (nueva === undefined || nueva === m.avance.fecha_planeada || m.avance.plan_id === null) return;
    ops.push({ tipo: 'plan.editar', id: m.avance.plan_id, cambios: { fecha_plan: nueva, rev: m.avance.rev } });
  });
  return ops;
}

// ============================================================================ chips con conteo y detalle
/** Conteo por grupo de TikTok (chips de filtro y de Todas: solo se muestran los que tienen más de 0). */
export function contarPorGrupo(muestras: readonly C.MuestraVista[]): Partial<Record<C.GrupoMuestra, number>> {
  const r: Partial<Record<C.GrupoMuestra, number>> = {};
  for (const m of muestras) r[m.grupo] = (r[m.grupo] ?? 0) + 1;
  return r;
}

export interface PasoAvance {
  etapa: C.EtapaAvance;
  hecho: boolean;
  actual: boolean;
  /** Fecha del paso completado, ya formateada por quien la pinta (FechaLocal o epoch). */
  fecha: C.FechaLocal | C.EpochS | null;
}

const ORDEN_PASOS: readonly C.EtapaAvance[] = ['por_planear', 'planeada', 'video_listo', 'programada', 'publicada'];

/**
 * Pasos de «Tu avance» (01 §4.3): Por planear → Planeada → Video listo → (Programada) → Publicada, con la fecha en los
 * completados. Programada solo aparece si la preferencia está encendida o la muestra ya la usó (01 §2.4).
 */
export function pasosAvance(m: C.MuestraVista, programoMisVideos: boolean, plan: C.PlanVideo | null): PasoAvance[] {
  const conProgramada = programoMisVideos || m.avance.etapa === 'programada' || m.avance.programada_para_at !== null;
  const etapas = ORDEN_PASOS.filter((e) => e !== 'programada' || conProgramada);
  const actual = etapas.indexOf(m.avance.etapa);
  const fechaDe = (e: C.EtapaAvance): C.FechaLocal | C.EpochS | null => {
    if (e === 'planeada') return m.avance.fecha_planeada ?? plan?.fecha_plan ?? null;
    if (e === 'video_listo') return plan?.fecha_video_listo ?? null;
    if (e === 'programada') return m.avance.programada_para_at ?? plan?.programada_para_at ?? null;
    if (e === 'publicada') return m.avance.fecha_publicada ?? plan?.fecha_publicada ?? null;
    return null;
  };
  return etapas.map((e, i) => ({ etapa: e, hecho: actual >= 0 && i <= actual, actual: i === actual, fecha: actual >= 0 && i <= actual && i > 0 ? fechaDe(e) : null }));
}

/** El PlanVideo vivo de la muestra (el que guarda su avance), si llegó en el detalle. */
export function planVivo(m: C.MuestraVista, planes: readonly C.PlanVideo[]): C.PlanVideo | null {
  if (m.avance.plan_id) return planes.find((p) => p.id === m.avance.plan_id) ?? null;
  return planes.find((p) => p.application_id === m.application_id) ?? null;
}

/** «Recibida (aprox.)»: solo en abiertas (01 §4.3): fecha límite − 14 días (sin la pausa: MuestraVista no la trae). */
export function recibidaAprox(m: C.MuestraVista): C.FechaLocal | null {
  if (m.fecha_limite_at === null || (m.grupo !== 'por_vencer' && m.grupo !== 'en_revision')) return null;
  return sumarDias(fechaLocalDe(m.fecha_limite_at), -14);
}

/** Otras pendientes de la misma tienda (para «¿Un solo mensaje para las dos?»), en el orden de la cola. */
export function pendientesDeTienda(m: C.MuestraVista, cola: readonly C.MuestraVista[]): C.MuestraVista[] {
  return cola.filter((x) => x.tienda.tienda_key === m.tienda.tienda_key && (esPendiente(x) || x.application_id === m.application_id));
}

/** Avisos enviados que siguen contando (no quitados), del más reciente al más antiguo. */
export function avisosEnviados(avisos: readonly C.AvisoTienda[]): C.AvisoTienda[] {
  return avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null).sort((a, b) => (b.marcado_enviado_at ?? 0) - (a.marcado_enviado_at ?? 0));
}

// ============================================================================ Todas (01 §4.7)
export const ORDEN_GRUPOS_TODAS: readonly C.GrupoMuestra[] = [
  'vencida', 'entregada', 'exenta', 'sin_envio', 'por_vencer', 'en_revision', 'pausada', 'esperando_aprobacion', 'en_camino', 'pedido_cancelado',
];

/** Desglose del texto de «Sin envío»: sin pedido · rechazada · no la envió · retirada. */
export function desgloseSinEnvio(muestras: readonly C.MuestraVista[]): { sinPedido: number; rechazada: number; noEnvio: number; retirada: number } {
  const s = muestras.filter((m) => m.grupo === 'sin_envio');
  return {
    sinPedido: s.filter((m) => m.subestado === 'sin_respuesta' || m.subestado === 'esperando_respuesta').length,
    rechazada: s.filter((m) => m.subestado === 'rechazada').length,
    noEnvio: s.filter((m) => m.subestado === 'tienda_no_envio').length,
    retirada: s.filter((m) => m.subestado === 'retirada').length,
  };
}

export type DireccionOrden = 'asc' | 'desc';
/** Orden ordinal de «Tu avance» para ordenar la columna (no alfabético). */
const ORDEN_ETAPAS_TABLA: readonly C.EtapaAvance[] = ['por_planear', 'planeada', 'video_listo', 'programada', 'publicada', 'no_se_puede'];
/** Valor para ordenar una columna de Todas por su id (columnasMuestras('todas') de @/bloques). */
export function valorColumna(m: C.MuestraVista, columna: string): string | number | null {
  const id = columna.toLowerCase();
  if (id.includes('solicit')) return m.solicitada_at;
  if (id.includes('comision')) return m.producto.comision_por_venta_centavos;
  if (id.includes('precio')) return m.producto.precio_venta_min_centavos;
  if (id.includes('tienda')) return m.tienda.nombre.toLowerCase();
  if (id.includes('variante')) return (m.variante ?? '').toLowerCase();
  if (id.includes('vend')) return m.ventas_producto.pedidos_validos;
  if (id.includes('avance') || id.includes('etapa')) return ORDEN_ETAPAS_TABLA.indexOf(m.avance.etapa);
  if (id.includes('promesa')) return m.avisos.promesa;
  if (id.includes('estado') || id.includes('grupo') || id.includes('tiktok')) return m.grupo;
  if (id.includes('producto') || id.includes('nombre')) return nombreDe(m).toLowerCase();
  return null;
}

export function ordenarPorColumna(muestras: readonly C.MuestraVista[], columna: string, direccion: DireccionOrden): C.MuestraVista[] {
  const signo = direccion === 'asc' ? 1 : -1;
  return [...muestras]
    .map((m, i) => ({ m, i, v: valorColumna(m, columna) }))
    .sort((a, b) => {
      if (a.v === b.v) return a.i - b.i;
      if (a.v === null) return 1;
      if (b.v === null) return -1;
      const c = typeof a.v === 'number' && typeof b.v === 'number' ? a.v - b.v : String(a.v).localeCompare(String(b.v), 'es-MX');
      return c * signo || a.i - b.i;
    })
    .map((x) => x.m);
}
