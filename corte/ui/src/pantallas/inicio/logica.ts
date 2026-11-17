/**
 * Inicio · lógica de presentación pura (01_ux §4.1, §6). Sin React ni DOM: recibe las respuestas del hub (o de la copia)
 * y devuelve lo que la pantalla pinta, ya decidido: estado del héroe, bloques «Vencen pronto», «Promesas vencidas» y
 * «Hoy», tiendas que necesitan atención, video estrella, KPI con su variación y la tendencia de 12 semanas.
 * Las cifras salen SIEMPRE de los datos (nada escrito a mano); los textos, de textos.ts.
 */
import type * as C from '@/contrato';
import { diaSemana, diasEntre, esPendiente, fechaLocalDe, formato, nombreCorto, rangoDePeriodo, sumarDias, type ConteosTrabajo } from '@/dominio';
import { T } from './textos';

// ---------------------------------------------------------------------------------------------- utilidades

function porFecha(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Nombre corto del producto de una muestra (el que escribe el usuario gana, 01 §6.0). */
export function nombreProducto(m: Pick<C.MuestraVista, 'producto'>): string {
  return m.producto.titulo_corto ?? nombreCorto(m.producto.titulo);
}

// ---------------------------------------------------------------------------------------------- cola y conteos

/** Orden de la cola sugerida (posicion_cola); las que no tienen posición van al final en su orden original. */
export function ordenarCola(items: readonly C.MuestraVista[]): C.MuestraVista[] {
  return items
    .map((m, i) => ({ m, i }))
    .sort((a, b) => (a.m.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.m.posicion_cola ?? Number.MAX_SAFE_INTEGER) || a.i - b.i)
    .map((x) => x.m);
}

/** Pendientes (01 §2.5) en orden de cola. */
export function pendientesEnCola(items: readonly C.MuestraVista[]): C.MuestraVista[] {
  return ordenarCola(items.filter(esPendiente));
}

export interface SegmentoHeroe {
  etapa: 'planeada' | 'video_listo' | 'programada' | 'publicada';
  n: number;
}

/** Segmentos de la barra de etapas: planeadas · listas · (programadas si se usan) · publicadas de la cohorte. */
export function segmentosEtapas(c: ConteosTrabajo): SegmentoHeroe[] {
  const s: SegmentoHeroe[] = [
    { etapa: 'planeada', n: c.por_etapa.planeada },
    { etapa: 'video_listo', n: c.por_etapa.video_listo },
  ];
  if (c.por_etapa.programada > 0) s.push({ etapa: 'programada', n: c.por_etapa.programada });
  s.push({ etapa: 'publicada', n: c.por_etapa.publicada });
  return s;
}

/** Total de la barra «{publicadas} de {total} videos publicados» (cohorte; nunca menor que lo publicado). */
export function totalBarra(c: ConteosTrabajo): number {
  return Math.max(c.total_cohorte, c.publicadas, c.pendientes);
}

// ---------------------------------------------------------------------------------------------- héroe

const ETAPAS_CON_FECHA: ReadonlySet<C.EtapaAvance> = new Set(['planeada', 'video_listo', 'programada']);

type ConFecha = C.MuestraVista & { avance: C.AvanceMuestra & { fecha_planeada: C.FechaLocal } };

function conFecha(m: C.MuestraVista): m is ConFecha {
  return ETAPAS_CON_FECHA.has(m.avance.etapa) && m.avance.fecha_planeada !== null;
}

export type EstadoHeroe =
  /** Sin pendientes ni publicadas en la cohorte: no hay héroe. */
  | { tipo: 'nada' }
  /** Sin plan: «Armar mi plan · 1 min» + «Planear solo esta». */
  | { tipo: 'sin_plan'; siguiente: C.MuestraVista | null }
  /** Con plan y videos para hoy sin terminar: la acción del primero de hoy + «Ver mi agenda». */
  | { tipo: 'hoy'; termina: C.FechaLocal; publica: C.FechaLocal; primero: C.MuestraVista; accion: 'empezar_sesion' | 'marcar_publicada' }
  /** Con plan y nada pendiente para hoy (`proxima` = la primera del siguiente día con videos). */
  | { tipo: 'nada_hoy'; termina: C.FechaLocal; publica: C.FechaLocal; siguienteDia: C.FechaLocal | null; proxima: C.MuestraVista | null }
  /** Con plan atrasado (M23): «Llevas {n} videos de retraso en tu plan» en ámbar (`primera` = la atrasada más antigua). */
  | { tipo: 'atrasado'; n: number; termina: C.FechaLocal; publica: C.FechaLocal; primera: C.MuestraVista }
  /** Al día con todo (celebración). */
  | { tipo: 'al_dia'; publicadas: number; tiendas: number };

/**
 * Tabla «El héroe tiene una sola acción principal» de 01 §4.1. `cola` = pendientes en el orden que se muestra (la lista
 * estable: si llega un orden nuevo, la nº 1 no cambia sola). `todas` = todas las muestras (para la celebración).
 */
export function estadoHeroe(cola: readonly C.MuestraVista[], todas: readonly C.MuestraVista[], conteos: ConteosTrabajo, hoy: C.FechaLocal): EstadoHeroe {
  const pendientes = cola.filter(esPendiente);
  if (pendientes.length === 0) {
    if (conteos.publicadas > 0) {
      const tiendas = new Set(todas.filter((m) => m.avance.etapa === 'publicada').map((m) => m.tienda.tienda_key)).size;
      return { tipo: 'al_dia', publicadas: conteos.publicadas, tiendas };
    }
    return { tipo: 'nada' };
  }
  const planeadas = pendientes.filter(conFecha);
  if (planeadas.length === 0) return { tipo: 'sin_plan', siguiente: pendientes[0] ?? null };

  const termina = planeadas.reduce((max, m) => (m.avance.fecha_planeada > max ? m.avance.fecha_planeada : max), planeadas[0]?.avance.fecha_planeada ?? hoy);
  const publica = sumarDias(termina, 2);
  // M23: planeadas con fecha ≤ ayer que todavía no pasan a Video listo.
  const atrasadas = planeadas.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada < hoy).sort((a, b) => porFecha(a.avance.fecha_planeada, b.avance.fecha_planeada));
  const primeraAtrasada = atrasadas[0];
  if (primeraAtrasada) return { tipo: 'atrasado', n: atrasadas.length, termina, publica, primera: primeraAtrasada };

  const deHoy = planeadas.filter((m) => m.avance.fecha_planeada === hoy);
  const primero = deHoy.find((m) => m.avance.etapa === 'planeada') ?? deHoy[0];
  if (primero) {
    const accion = primero.avance.etapa === 'planeada' ? 'empezar_sesion' : 'marcar_publicada';
    return { tipo: 'hoy', termina, publica, primero, accion };
  }
  const futuras = planeadas.filter((m) => m.avance.fecha_planeada > hoy).sort((a, b) => porFecha(a.avance.fecha_planeada, b.avance.fecha_planeada));
  const proxima = futuras[0] ?? null;
  return { tipo: 'nada_hoy', termina, publica, siguienteDia: proxima?.avance.fecha_planeada ?? null, proxima };
}

/** La muestra cuya foto protagoniza el héroe en cada estado (null en «al día»). */
export function destacadaDe(e: EstadoHeroe): C.MuestraVista | null {
  switch (e.tipo) {
    case 'sin_plan':
      return e.siguiente;
    case 'hoy':
      return e.primero;
    case 'nada_hoy':
      return e.proxima;
    case 'atrasado':
      return e.primera;
    default:
      return null;
  }
}

/** true si existe un plan (alguna pendiente con fecha): muestra «Hoy» y «Tiendas avisadas». */
export function hayPlan(items: readonly C.MuestraVista[]): boolean {
  return items.some((m) => esPendiente(m) && conFecha(m));
}

/** Tira de pendientes: de la 2.ª a la 13.ª de la cola (sin la destacada) y cuántas quedan para «+N» (02 §7.23). */
export function tiraDe(cola: readonly C.MuestraVista[], excluir: string | null, maximo = 12): { visibles: C.MuestraVista[]; mas: number } {
  const resto = cola.filter((m) => esPendiente(m) && m.application_id !== excluir);
  const visibles = resto.slice(0, maximo);
  return { visibles, mas: resto.length - visibles.length };
}

// ---------------------------------------------------------------------------------------------- bloques de arriba

export interface FilaVencePronto {
  muestra: C.MuestraVista;
  producto: string;
  tienda: string;
  /** 'en 2 días (sáb 14 nov)'. */
  vence: string;
  /** < 48 h: rojo (riesgo real); si no, ámbar. */
  tono: 'critico' | 'atencion';
}

/** «Vencen pronto · todavía cuentan para TikTok»: por vencer pendientes, por fecha límite. */
export function vencenPronto(items: readonly C.MuestraVista[], ahora: C.EpochS): FilaVencePronto[] {
  return items
    .filter((m) => m.grupo === 'por_vencer' && esPendiente(m) && m.fecha_limite_at !== null)
    .sort((a, b) => (a.fecha_limite_at ?? 0) - (b.fecha_limite_at ?? 0))
    .map((m) => {
      const limite = m.fecha_limite_at ?? ahora;
      return {
        muestra: m,
        producto: nombreProducto(m),
        tienda: m.tienda.nombre,
        vence: `${formato.relativa(limite, ahora)} (${formato.fechaConDia(limite)})`,
        tono: limite - ahora < 48 * 3600 ? 'critico' : 'atencion',
      };
    });
}

export interface FilaPromesa {
  tienda_key: string;
  tienda: string;
  /** Fecha prometida más antigua de esa tienda. */
  promesa: C.FechaLocal;
  solicitudes: string[];
}

/** «Promesas vencidas»: una fila por tienda (01 §4.1). */
export function promesasVencidas(items: readonly C.MuestraVista[]): FilaPromesa[] {
  const porTienda = new Map<string, FilaPromesa>();
  for (const m of items) {
    if (!m.avisos.promesa_vencida || !m.avisos.promesa || m.avance.etapa === 'publicada') continue;
    const previa = porTienda.get(m.tienda.tienda_key);
    if (previa) {
      previa.solicitudes.push(m.application_id);
      if (m.avisos.promesa < previa.promesa) previa.promesa = m.avisos.promesa;
    } else {
      porTienda.set(m.tienda.tienda_key, { tienda_key: m.tienda.tienda_key, tienda: m.tienda.nombre, promesa: m.avisos.promesa, solicitudes: [m.application_id] });
    }
  }
  return [...porTienda.values()].sort((a, b) => porFecha(a.promesa, b.promesa) || a.tienda.localeCompare(b.tienda, 'es'));
}

/** Pendientes que TikTok no deja etiquetar (prioridad 'no_se_puede_etiquetar'), en orden de cola. */
export function noSePuedeEtiquetar(cola: readonly C.MuestraVista[]): C.MuestraVista[] {
  return cola.filter((m) => esPendiente(m) && m.prioridad === 'no_se_puede_etiquetar');
}

export interface BloqueHoy {
  fecha: C.FechaLocal;
  items: C.MuestraVista[];
  hechos: number;
  total: number;
  completo: boolean;
}

/** «Hoy» (solo con plan): videos planeados para hoy; hecho = ya está en Video listo o más. */
export function bloqueHoy(items: readonly C.MuestraVista[], hoy: C.FechaLocal): BloqueHoy | null {
  const deHoy = ordenarCola(items.filter((m) => m.avance.fecha_planeada === hoy && m.avance.etapa !== 'no_se_puede' && m.avance.etapa !== 'por_planear'));
  if (deHoy.length === 0) return null;
  const hechos = deHoy.filter((m) => m.avance.etapa !== 'planeada').length;
  return { fecha: hoy, items: deHoy, hechos, total: deHoy.length, completo: hechos === deHoy.length };
}

// ---------------------------------------------------------------------------------------------- tiendas

/** Tiendas que necesitan atención: las del orden 'atencion' del hub con pendientes o promesas vencidas (3 como máximo). */
export function tiendasAtencion(tiendas: readonly C.FilaTienda[], maximo = 3): C.FilaTienda[] {
  return tiendas.filter((t) => t.muestras.pendientes > 0 || t.promesas.vencidas > 0).slice(0, maximo);
}

/** Cuántas tiendas tienen pendientes (para «Ver las {n} tiendas con pendientes»). */
export function tiendasConPendientes(tiendas: readonly C.FilaTienda[]): number {
  return tiendas.filter((t) => t.muestras.pendientes > 0).length;
}

/** Pendientes de cada tienda, en orden de cola (fotos de las fichas de tienda). */
export function pendientesPorTienda(cola: readonly C.MuestraVista[]): Map<string, C.MuestraVista[]> {
  const mapa = new Map<string, C.MuestraVista[]>();
  for (const m of cola) {
    if (!esPendiente(m)) continue;
    const lista = mapa.get(m.tienda.tienda_key) ?? [];
    lista.push(m);
    mapa.set(m.tienda.tienda_key, lista);
  }
  return mapa;
}

// ---------------------------------------------------------------------------------------------- videos

/** product_id de una portada '/img/p/<id>?v=…' (C4: la portada es la foto del producto). */
export function productoDePortada(url: C.UrlImagen | null): string | null {
  if (!url) return null;
  const m = /\/img\/p\/([^/?#&]+)/.exec(url);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/** Nombre que se muestra para un video (titulo siempre null, C4): nombre corto del producto de la portada o «Video 7677…3012». */
export function nombreDeVideo(v: C.FilaVideo, productos: readonly C.FilaProducto[], muestras: readonly C.MuestraVista[]): string {
  if (v.titulo) return nombreCorto(v.titulo);
  const id = productoDePortada(v.miniatura);
  if (id) {
    const p = productos.find((x) => x.product_id === id);
    if (p) return p.titulo_corto ?? nombreCorto(p.titulo);
    const m = muestras.find((x) => x.producto.product_id === id);
    if (m) return nombreProducto(m);
  }
  return T.video.sinNombre(formato.idCorto(v.content_id));
}

/** '123 unidades'. */
export function textoUnidades(n: number): string {
  return T.estrella.unidades(n, formato.numero(n));
}

/**
 * rev. 5 · Portada a mostrar: la REAL del video ('/img/v/…', Display API) si existe; si no, la foto del producto que más
 * vendió en él (C4), que lleva el rótulo «Foto del producto». Sin ninguna, null (póster tipográfico o mosaico).
 */
export function portadaVideo(v: Pick<C.FilaVideo, 'portada' | 'miniatura' | 'miniatura_origen'>): { url: C.UrlImagen | null; delProducto: boolean } {
  if (v.portada) return { url: v.portada, delProducto: false };
  return { url: v.miniatura, delProducto: v.miniatura !== null && v.miniatura_origen !== null };
}

// ---------------------------------------------------------------------------------------------- rev. 5 · perfil de TikTok

/** 9,876 · 55.2 mil · 482 mil · 1.3 M (seguidores y likes del perfil). */
export function cifraCompacta(n: number): string {
  const abs = Math.abs(n);
  const uno = (x: number): string => (Math.round(x * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 });
  if (abs < 10_000) return formato.numero(n);
  if (abs < 100_000) return `${uno(n / 1000)} mil`;
  if (abs < 1_000_000) return `${formato.numero(Math.round(n / 1000))} mil`;
  return `${uno(n / 1_000_000)} M`;
}

/** '+420' · '−35' · '0' (el cambio de 7 días del perfil, con su signo). */
export function cambioConSigno(n: number): string {
  const c = cifraCompacta(n);
  return n > 0 ? `+${c}` : c;
}

/**
 * ¿Invitar a conectar las métricas de videos? Solo en Windows (en el celular no se puede hacer nada), sin perfil de
 * TikTok en el tablero, con la Display API sin credenciales o sin conectar, y si la persona no la cerró antes.
 */
export function invitarMetricas(android: boolean, perfil: C.ResumenPerfilTikTok | null | undefined, estado: C.EstadoConexionDisplay | null, cerrada: boolean): boolean {
  if (android || cerrada || perfil) return false;
  return estado === 'sin_credenciales' || estado === 'sin_conectar';
}

/** aria-label del enlace de un video (02 §8.5). */
export function etiquetaVideo(ranking: number, v: C.FilaVideo, nombre: string): string {
  return T.video.etiqueta(ranking, formato.dinero(v.comision_estimada_centavos), textoUnidades(v.unidades), nombre);
}

/** Video estrella (VD9): máxima comisión estimada entre los videos con ventas válidas del rango de 7 días. */
export function videoEstrella(videos: readonly C.FilaVideo[]): C.FilaVideo | null {
  let mejor: C.FilaVideo | null = null;
  for (const v of videos) {
    if (v.pedidos_validos <= 0 || v.comision_estimada_centavos <= 0) continue;
    if (!mejor || v.comision_estimada_centavos > mejor.comision_estimada_centavos) mejor = v;
  }
  return mejor;
}

/**
 * Los 7 días caben en los 30: si la suma de comisión de los videos de 7 días pasa la comisión estimada de 30 días, la
 * respuesta no es del rango pedido (p. ej. una lista sin filtrar mientras la primera sincronización todavía arma los
 * rangos) y no se presenta como «la semana». Con el hub siempre es coherente.
 */
export function semanaCoherente(videos7: readonly C.FilaVideo[], d30: C.DashboardResponse | undefined): boolean {
  if (!d30) return true;
  const suma = videos7.reduce((a, v) => a + Math.max(0, v.comision_estimada_centavos), 0);
  return suma <= d30.kpis.comision_estimada_centavos + 100;
}

/** Videos que vendieron en el rango (VD5 con el rango de 7 días): con al menos una línea válida. */
export function videosQueVendieron(videos: readonly C.FilaVideo[]): number {
  return videos.filter((v) => v.pedidos_validos > 0).length;
}

/** Los N videos con más comisión (ya vienen ordenados del hub; se reordena por si acaso, sin mutar). */
export function topVideos(videos: readonly C.FilaVideo[], n = 5): C.FilaVideo[] {
  return [...videos].filter((v) => v.comision_estimada_centavos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, n);
}

// ---------------------------------------------------------------------------------------------- avisos del hub

/**
 * Alertas que se muestran en «Para tener en cuenta». Se quitan las que repiten una cifra que ya está arriba (02 §5.2:
 * sin repetir cifras): las pendientes (el héroe) y lo por liquidar (el KPI). El resto, por nivel.
 */
export function alertasVisibles(alertas: readonly C.Alerta[]): C.Alerta[] {
  const orden: Record<C.Alerta['nivel'], number> = { critica: 0, aviso: 1, info: 2 };
  return alertas.filter((a) => a.id !== 'pendientes' && a.id !== 'por_liquidar').sort((a, b) => orden[a.nivel] - orden[b.nivel]);
}

export type TonoAlerta = 'critico' | 'atencion' | 'info';

/**
 * Color de un aviso en Inicio (02 §1 principio 5 y §3.4: el rojo solo marca riesgo real —por vencer, promesa vencida,
 * conexión o error— y la deuda va en ámbar; «en Inicio no hay ningún rojo con los datos de hoy»). El hub marca como
 * `critica` también la deuda (`pendientes`, `tienda_clave:*`, 03 §5.4): esas van en ámbar. Rojo solo para
 * `limite:*` crítico (vence en ≤ 3 días) y `promesas_vencidas`.
 */
export function tonoAlerta(a: C.Alerta): TonoAlerta {
  if (a.nivel === 'info') return 'info';
  if (a.nivel === 'critica' && (a.id.startsWith('limite:') || a.id === 'promesas_vencidas')) return 'critico';
  return 'atencion';
}

/** Une la cifra con «%» con espacio duro para que «71 %» nunca se parta entre renglones (textos que llegan del hub). */
export function sinCortarPorcentaje(texto: string): string {
  return texto.replace(/(\d) %/g, '$1 %');
}

// ---------------------------------------------------------------------------------------------- dinero

export interface Variacion {
  texto: string;
  sentido: 'favorable' | 'desfavorable' | 'neutro';
  direccion: 'sube' | 'baja' | 'igual';
}

/**
 * Variación contra el periodo anterior (V14): '21 % vs. 30 días anteriores' (la flecha la pone el KPI). null si no hay
 * anterior. `menosEsMejor` invierte el color (reembolsos). Con anterior = 0 y actual > 0: 'Nuevo'. Con `vs` = null
 * (celular, lienzo MovilInicio.png) solo la cifra: '21 %'; el periodo ya va en la etiqueta del KPI.
 */
export function variacion(actual: number, anterior: number | null | undefined, vs: string | null, menosEsMejor = false): Variacion | null {
  if (anterior === null || anterior === undefined) return null;
  if (anterior === 0) return actual > 0 ? { texto: T.dinero.nuevo, sentido: menosEsMejor ? 'desfavorable' : 'favorable', direccion: 'sube' } : null;
  const cambio = (actual - anterior) / anterior;
  const direccion: Variacion['direccion'] = Math.abs(cambio) < 0.005 ? 'igual' : cambio > 0 ? 'sube' : 'baja';
  const sentido: Variacion['sentido'] = direccion === 'igual' ? 'neutro' : (direccion === 'baja') === menosEsMejor ? 'favorable' : 'desfavorable';
  const cifra = formato.porcentaje(Math.abs(cambio));
  return { texto: vs === null ? cifra : `${cifra} vs. ${vs}`, sentido, direccion };
}

export interface KpiInicio {
  id: 'comision' | 'pedidos' | 'reembolsos' | 'por_liquidar';
  etiqueta: string;
  valor: string;
  variacion: Variacion | null;
  nota: string | null;
  /** Ruta de Ventas con el mismo rango que muestra el KPI (01 §4.1). */
  destino: string;
}

/** Estados que suman «Por liquidar» (V4 de 01 §6: To-SETTLE + AWAITING PAYMENT). */
export const ESTADOS_POR_LIQUIDAR: readonly C.EstadoOrden[] = ['To-SETTLE', 'AWAITING PAYMENT'];

/**
 * Respuesta de GET /api/ordenes?estado=To-SETTLE,AWAITING PAYMENT&por_pagina=1 SOLO si respetó el filtro y la página
 * (1 pedido como máximo, todos por liquidar); si no, null. Así una respuesta que no filtró (p. ej. los datos de
 * demostración, que no traen esa consulta y responden la primera página de todos los pedidos) nunca se presenta como
 * «N pedidos por liquidar».
 */
export function respuestaPorLiquidar(r: C.OrdenesResponse | undefined): C.OrdenesResponse | null {
  if (!r || r.por_pagina !== 1 || r.items.length > 1 || r.total < 0) return null;
  return r.items.every((o) => ESTADOS_POR_LIQUIDAR.includes(o.estado)) ? r : null;
}

/** Pedidos por liquidar de todo el historial y la fecha del más antiguo (si ya llegó), para la nota del KPI 4. */
export interface PedidosPorLiquidar {
  total: number;
  masAntiguo: C.FechaLocal | null;
}

/**
 * Cuenta y fecha del más antiguo a partir de las dos consultas de 1 por página: la primera da el total; la del más
 * antiguo pide la última página (el hub ordena del más reciente al más antiguo). null si la cuenta no es confiable.
 */
export function pedidosPorLiquidar(cuenta: C.OrdenesResponse | undefined, ultimo: C.OrdenesResponse | undefined): PedidosPorLiquidar | null {
  const c = respuestaPorLiquidar(cuenta);
  if (c === null) return null;
  const u = respuestaPorLiquidar(ultimo);
  const masAntiguo = u !== null && u.total === c.total && u.pagina === c.total ? (u.items[0]?.fecha ?? null) : null;
  return { total: c.total, masAntiguo };
}

/**
 * Las 4 tarjetas de «Tu dinero» (01 §4.1, 02 §5.2). Por liquidar sale del rango «Todo» (si aún no llega, del de 30
 * días). `compacto` (celular): la variación sin «vs. 30 días anteriores», como el lienzo MovilInicio.png.
 * `porLiquidar`: la nota «45 pedidos · el más antiguo del 3 mar» (01 §4.1 KPI 4); sin ella (o sin el rango «Todo»,
 * del que sale la cifra), la nota dice de dónde sale la cifra.
 */
export function kpisInicio(d30: C.DashboardResponse, dTodo: C.DashboardResponse | undefined, compacto = false, porLiquidar: PedidosPorLiquidar | null = null): KpiInicio[] {
  const k = d30.kpis;
  const a = d30.kpis_anterior;
  const vs = compacto ? null : T.dinero.vs30;
  const sinPedidos = k.pedidos === 0;
  return [
    {
      id: 'comision',
      etiqueta: T.dinero.comision,
      valor: formato.dinero(k.comision_total_centavos),
      variacion: variacion(k.comision_total_centavos, a?.comision_total_centavos, vs),
      nota: sinPedidos ? T.dinero.sinPedidos : null,
      destino: '/ventas?periodo=30d',
    },
    {
      id: 'pedidos',
      etiqueta: T.dinero.pedidos,
      valor: formato.numero(k.pedidos),
      variacion: variacion(k.pedidos, a?.pedidos, vs),
      nota: sinPedidos ? T.dinero.sinPedidos : null,
      destino: '/ventas?periodo=30d',
    },
    {
      id: 'reembolsos',
      etiqueta: T.dinero.reembolsos,
      valor: formato.porcentaje(k.tasa_reembolso),
      variacion: null,
      nota: T.dinero.pedidosReembolsados(k.pedidos_reembolsados, formato.numero(k.pedidos_reembolsados)),
      destino: '/ventas?periodo=30d',
    },
    {
      id: 'por_liquidar',
      etiqueta: T.dinero.porLiquidar,
      valor: formato.dinero((dTodo ?? d30).kpis.comision_por_liquidar_centavos),
      variacion: null,
      nota: !dTodo
        ? T.dinero.porLiquidarNota30
        : porLiquidar
          ? T.dinero.porLiquidarPedidos(porLiquidar.total, formato.numero(porLiquidar.total), porLiquidar.masAntiguo ? formato.fechaCorta(porLiquidar.masAntiguo) : null)
          : T.dinero.porLiquidarNota,
      destino: '/ventas?periodo=todo&estado=por_liquidar',
    },
  ];
}

// ---------------------------------------------------------------------------------------------- tendencia

export interface PuntoTendencia {
  clave: string;
  etiqueta: string;
  valor: number;
  enCurso: boolean;
  aria: string;
  pedidos: number;
  reembolsados: number;
  rango: string;
}

/** Rango de una semana que empieza en `lunes`: '2 mar – 8 mar'. */
export function rangoSemana(lunes: C.FechaLocal): string {
  return `${formato.fechaCorta(lunes)} – ${formato.fechaCorta(sumarDias(lunes, 6))}`;
}

/** Lunes de la semana de una fecha. */
export function lunesDe(fecha: C.FechaLocal): C.FechaLocal {
  return sumarDias(fecha, -diaSemana(fecha));
}

/**
 * Rango que se pide a /api/analitica/serie para las 12 semanas: los 90 días que terminan en `hasta` (la fecha del hub,
 * dashboard.periodo.hasta). Trae 13–14 semanas y se usan las 12 últimas, así la primera siempre está completa.
 */
export function rangoTendencia(hasta: C.FechaLocal): { desde: C.FechaLocal; hasta: C.FechaLocal } {
  return rangoDePeriodo('90d', hasta);
}

/**
 * Comisión por semana, últimas 12 semanas (01 §4.1 #10, 02 §9.4): la semana en curso (la que contiene `hasta` sin
 * haber terminado) va marcada; no se extrapola.
 */
export function tendenciaSemanal(serie: C.SerieResponse, hasta: C.FechaLocal, n = 12): PuntoTendencia[] {
  const semanas = serie.puntos.filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.clave) && p.clave <= hasta).slice(-n);
  return semanas.map((p) => {
    const enCurso = sumarDias(p.clave, 6) > hasta;
    const rango = rangoSemana(p.clave);
    return {
      clave: p.clave,
      etiqueta: enCurso ? T.tendencia.estaSemana : formato.fechaCorta(p.clave),
      valor: p.comision_estimada_centavos,
      enCurso,
      aria: T.tendencia.aria(rango, formato.dinero(p.comision_estimada_centavos), formato.numero(p.pedidos), enCurso),
      pedidos: p.pedidos,
      reembolsados: p.pedidos_reembolsados,
      rango,
    };
  });
}

/** «Semana pico: 2 mar – 8 mar · $1,234» (V16), solo entre semanas completas. */
export function semanaPico(puntos: readonly PuntoTendencia[]): string | null {
  const completas = puntos.filter((p) => !p.enCurso && p.valor > 0);
  if (completas.length === 0) return null;
  const pico = completas.reduce((a, b) => (b.valor > a.valor ? b : a));
  return T.tendencia.pico(pico.rango, formato.dinero(pico.valor));
}

/** Tabla gemela de la tendencia (02 §9.4 regla 10). */
export function tablaTendencia(puntos: readonly PuntoTendencia[]): { columnas: string[]; filas: string[][] } {
  return {
    columnas: [...T.tendencia.columnas],
    filas: puntos.map((p) => [p.enCurso ? T.tendencia.enCursoTabla(p.rango) : p.rango, formato.dinero(p.valor), formato.numero(p.pedidos), formato.numero(p.reembolsados)]),
  };
}

// ---------------------------------------------------------------------------------------------- frescura

/** 'Jueves 12 de noviembre'. */
export function fechaSaludo(hoy: C.FechaLocal): string {
  const larga = formato.fechaLarga(hoy);
  return larga.charAt(0).toUpperCase() + larga.slice(1);
}

/** 'hoy, 6:04 p. m.' · 'ayer, 2:41 p. m.' · '10 nov, 9:12 a. m.' (pie de Inicio, F1). */
export function momentoSync(t: C.EpochS, hoy: C.FechaLocal): string {
  const dias = diasEntre(fechaLocalDe(t), hoy);
  const dia = dias === 0 ? 'hoy' : dias === 1 ? 'ayer' : formato.fechaCorta(t);
  return `${dia}, ${formato.hora(t)}`;
}

/**
 * La hora nunca se parte entre renglones: '10:15 a. m.' lleva espacios de no separación (NBSP) para que, en una
 * línea angosta, no quede «10:15 a.» arriba y «m.» solo abajo. Lo mismo con 'hace 4 min' (a 360 con el texto al
 * 130 % quedaba «hace 4» arriba y «min» abajo). Solo para pintar; la lógica conserva el texto normal.
 */
export function horaSinCorte(texto: string): string {
  return texto.replace(/\b(hace|en) (\d+) (min|h)\b/g, '$1 $2 $3').replace(/(\d{1,2}:\d{2}) ([ap])\. m\./g, '$1 $2. m.');
}

/** 'hace 4 min' hasta 6 h; después 'ayer, 6:02 p. m.' (F1). */
export function haceCuanto(t: C.EpochS, ahora: C.EpochS): string {
  return ahora - t < 6 * 3600 ? formato.relativa(t, ahora) : momentoSync(t, fechaLocalDe(ahora));
}

/** Pasos de pedidos de la sincronización (los recientes; en la primera, los anteriores también cuentan para «trayendo»). */
function pasoOrdenes(sync: C.SyncEstado): C.SyncPaso | undefined {
  return sync.pasos.find((p) => p.paso === 'ordenes');
}

/** Primera sincronización en curso (sin ninguna sincronización completa antes). */
export function primeraSincronizacion(sync: C.SyncEstado | null | undefined, ultimaSyncOk: C.EpochS | null | undefined): boolean {
  return !!sync?.en_curso && (ultimaSyncOk ?? null) === null && sync.ultima_ok_at === null;
}

/** Primera sincronización antes del punto de control 2 (C34, F6): la cola aún no considera las ventas. */
export function ordenProvisional(sync: C.SyncEstado | null | undefined, ultimaSyncOk: C.EpochS | null | undefined): boolean {
  if (!sync || !primeraSincronizacion(sync, ultimaSyncOk)) return false;
  const ordenes = pasoOrdenes(sync);
  return !ordenes || !['ok', 'parcial', 'omitido'].includes(ordenes.estado);
}

/** En la primera sincronización, las ventas todavía no llegan (el dinero y los videos se muestran como esqueleto). */
export function ventasEnCamino(sync: C.SyncEstado | null | undefined, ultimaSyncOk: C.EpochS | null | undefined): boolean {
  return ordenProvisional(sync, ultimaSyncOk);
}
