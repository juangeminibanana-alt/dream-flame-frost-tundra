/**
 * Lógica de presentación de Videos (01_ux §4.12 y §6.4). Funciones puras sobre los tipos del contrato: nombre del
 * video (C4: `titulo` siempre es null), resumen del encabezado, filtros, orden, ranking y semana en curso. Sin React.
 */
import type * as C from '@/contrato';
import { coincide, diaSemana, formato, nombreCorto, normalizarTitulo, sumarDias } from '@/dominio';
import type { ClaveOrden, ClaveRango } from './textos';
import { T } from './textos';
import type { ReglaColumnas } from './ajusteColumnas';

/** Columnas de columnasVideos() que se quedan cuando no caben todas en la tabla (video y comisión siempre). rev. 5:
 *  con métricas de TikTok, vistas y «pedidos por 1,000 vistas» van justo después de la comisión. */
export const REGLA_COLUMNAS: ReglaColumnas = {
  prioridad: ['video', 'comision', 'vistas', 'porMil', 'pedidos', 'ultima', 'reembolsos', 'likes', 'unidades', 'comentarios', 'compartidos', 'tienda', 'primera', 'productos'],
  fijas: ['video', 'comision'],
  minimos: { video: 240, tienda: 160 },
};

/** Más de este porcentaje de pedidos reembolsados = «Reembolso alto» (01 §4.12). */
export const UMBRAL_REEMBOLSO_ALTO = 0.3;

export const ORDENES: readonly ClaveOrden[] = ['comision', 'pedidos', 'unidades', 'reciente', 'nuevos', 'reembolso', 'vistas', 'conversion'];
/** rev. 5 · Órdenes que necesitan las cifras de la Display API. */
export const ORDENES_METRICAS: readonly ClaveOrden[] = ['vistas', 'conversion'];

/** Órdenes que se ofrecen: sin métricas de TikTok no hay «Más vistas» ni «Más pedidos por 1,000 vistas». */
export function ordenesPara(conMetricas: boolean): ClaveOrden[] {
  return ORDENES.filter((o) => conMetricas || !ORDENES_METRICAS.includes(o));
}

// ---------------------------------------------------------------------------------------------- rev. 5 · métricas de TikTok

/** ¿La lista trae las cifras de la Display API? (AUSENTES si nunca se conectó; null por video si no está en ella). */
export function hayMetricas(items: readonly Pick<C.FilaVideo, 'vistas'>[] | undefined): boolean {
  return !!items && items.some((v) => v.vistas !== undefined);
}

/** Portada a mostrar: la REAL del video ('/img/v/…') si existe; si no, la de siempre (foto del producto, rotulada). */
export function portadaDe(v: Pick<C.FilaVideo, 'portada' | 'miniatura' | 'miniatura_origen'>): { url: C.UrlImagen | null; delProducto: boolean } {
  if (v.portada) return { url: v.portada, delProducto: false };
  return { url: v.miniatura, delProducto: portadaEsDelProducto(v) };
}

/** Tiene vistas en TikTok pero ninguna venta válida (todo se reembolsó o se canceló). */
export function sinVentasConVistas(v: Pick<C.FilaVideo, 'pedidos_validos' | 'vistas'>): boolean {
  return v.pedidos_validos === 0 && (v.vistas ?? 0) > 0;
}

/** 9,876 · 48.2 mil · 482 mil · 1.3 M (vistas, likes…). El número exacto va en el title/tabla gemela. */
export function cifraCompacta(n: number): string {
  const abs = Math.abs(n);
  const uno = (x: number): string => (Math.round(x * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 });
  if (abs < 10_000) return formato.numero(n);
  if (abs < 100_000) return `${uno(n / 1000)} mil`;
  if (abs < 1_000_000) return `${formato.numero(Math.round(n / 1000))} mil`;
  return `${uno(n / 1_000_000)} M`;
}

/** Eje de una gráfica de vistas: 0 · 500 · 1 mil · 1.5 mil · 2 M. */
export function ejeVistas(n: number): string {
  const abs = Math.abs(n);
  const uno = (x: number): string => (Math.round(x * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 });
  if (abs === 0) return '0';
  if (abs < 1000) return formato.numero(Math.round(n));
  if (abs < 1_000_000) return `${uno(n / 1000)} mil`;
  return `${uno(n / 1_000_000)} M`;
}

/** «Pedidos por 1,000 vistas» con 2 decimales (como lo manda el hub). */
export function textoPorMil(x: number): string {
  return x.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Mediana de «pedidos por 1,000 vistas» de los videos con cifra (tu video típico); null con menos de 3. */
export function porMilTipico(items: readonly Pick<C.FilaVideo, 'pedidos_por_mil_vistas'>[]): number | null {
  const xs = items.map((v) => v.pedidos_por_mil_vistas).filter((x): x is number => typeof x === 'number').sort((a, b) => a - b);
  if (xs.length < 3) return null;
  const m = Math.floor(xs.length / 2);
  return xs.length % 2 === 1 ? xs[m] ?? null : ((xs[m - 1] ?? 0) + (xs[m] ?? 0)) / 2;
}

/** La lectura más reciente de las cifras de TikTok (para «Vistas de TikTok al …»). */
export function metricasAl(items: readonly Pick<C.FilaVideo, 'metricas_at'>[]): C.EpochS | null {
  let max: number | null = null;
  for (const v of items) if (typeof v.metricas_at === 'number' && (max === null || v.metricas_at > max)) max = v.metricas_at;
  return max;
}

export interface DiaVistas {
  fecha: C.FechaLocal;
  /** Vistas que sumó ese día (contra la foto anterior; 0 si no cambió o no hubo foto). */
  nuevas: number;
  /** Vistas acumuladas al cierre del día (la última foto hasta ese día). */
  total: number;
}

/**
 * «Vistas nuevas por día» de los últimos `dias` días a partir de la tendencia ESCALONADA del hub (un día solo aparece si
 * alguna cifra cambió; un día sin foto suma lo suyo al siguiente). Empieza en la primera foto si es más reciente que la
 * ventana. Con menos de 2 fotos con vistas no hay con qué comparar: [].
 */
export function vistasPorDia(tendencia: readonly C.PuntoTendenciaVideo[], hoy: C.FechaLocal, dias = 30): DiaVistas[] {
  const fotos = tendencia.filter((p): p is C.PuntoTendenciaVideo & { vistas: number } => typeof p.vistas === 'number' && p.fecha <= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  const primera = fotos[0];
  if (!primera || fotos.length < 2) return [];
  const desdeVentana = sumarDias(hoy, -(dias - 1));
  // La primera foto no tiene contra qué compararse: la ventana empieza al día siguiente de ella como pronto.
  const inicio = sumarDias(primera.fecha, 1) > desdeVentana ? sumarDias(primera.fecha, 1) : desdeVentana;
  const salida: DiaVistas[] = [];
  let i = 0;
  let previa: number = primera.vistas;
  while (i + 1 < fotos.length && (fotos[i + 1]?.fecha ?? '') < inicio) {
    i += 1;
    previa = fotos[i]?.vistas ?? previa;
  }
  for (let f = inicio; f <= hoy && salida.length < dias; f = sumarDias(f, 1)) {
    const foto = fotos.find((p) => p.fecha === f);
    if (foto) {
      salida.push({ fecha: f, nuevas: Math.max(0, foto.vistas - previa), total: foto.vistas });
      previa = foto.vistas;
    } else {
      salida.push({ fecha: f, nuevas: 0, total: previa });
    }
  }
  return salida;
}

/** 12 puntos de vistas acumuladas, repartidos a lo largo de la tendencia (sparkline del KPI). */
export function serieAcumulada(tendencia: readonly C.PuntoTendenciaVideo[]): number[] {
  const vistas = tendencia.map((p) => p.vistas).filter((x): x is number => typeof x === 'number');
  if (vistas.length < 2) return [];
  if (vistas.length <= 12) return vistas;
  return Array.from({ length: 12 }, (_, k) => vistas[Math.round((k * (vistas.length - 1)) / 11)] ?? 0);
}
export const RANGOS: readonly ClaveRango[] = ['7d', '30d', '90d', '12m', 'todo'];

export function esOrden(v: string | null): v is ClaveOrden {
  return v !== null && (ORDENES as readonly string[]).includes(v);
}
export function esRango(v: string | null): v is ClaveRango {
  return v !== null && (RANGOS as readonly string[]).includes(v);
}

/** product_id de la portada '/img/p/<id>?v=…' (también bajo /lan/v1/img/…); null si no es de producto. */
export function productoDePortada(url: C.UrlImagen | null): string | null {
  if (!url) return null;
  const m = /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url);
  return m?.[1] ?? null;
}

/**
 * Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
 * en MAYÚSCULAS); normalizarTitulo es de la capa de vista, así que se aplica aquí. Sin corto, el nombre corto del título.
 */
export function nombreVisible(corto: string | null | undefined, titulo: string | null): string {
  const c = corto?.replace(/\s+/g, ' ').trim();
  return c ? normalizarTitulo(c) : nombreCorto(titulo);
}

/** La muestra con el nombre corto del producto normalizado, para TarjetaMuestra (que lo pinta tal cual). */
export function muestraConNombre(m: C.MuestraVista): C.MuestraVista {
  const c = m.producto.titulo_corto;
  if (!c || !c.trim()) return m;
  const n = nombreVisible(c, m.producto.titulo);
  return n === c ? m : { ...m, producto: { ...m.producto, titulo_corto: n } };
}

/** product_id → nombre corto, de cualquier lista de productos que ya se tenga. */
export function mapaNombres(productos: readonly C.FilaProducto[] | undefined): Map<string, string> {
  const mapa = new Map<string, string>();
  for (const x of productos ?? []) mapa.set(x.product_id, nombreVisible(x.titulo_corto, x.titulo));
  return mapa;
}

/**
 * tienda_key de la tienda principal de un video para el enlace: la de sus productos (que la trae el hub, también las
 * 'shop:<id>'); si no hay, el nombre normalizado, que es la regla del hub para las tiendas sin shop_id.
 */
export function claveTiendaVideo(tienda: string | null, productos: readonly C.FilaProducto[]): string | null {
  if (!tienda || !tienda.trim()) return null;
  const nombre = tienda.trim().toLocaleLowerCase('es-MX').replace(/\s+/g, ' ');
  const deProducto = productos.find((x) => x.tienda_nombre && x.tienda_nombre.trim().toLocaleLowerCase('es-MX').replace(/\s+/g, ' ') === nombre);
  return deProducto?.tienda_key ?? nombre;
}

/**
 * Nombre visible de un video (C4): el nombre corto del producto de su portada (el que más vendió en ese video) o,
 * si no se conoce, «Video 7677…3012». `titulo` no se usa: el hub siempre lo manda en null.
 */
export function nombreVideo(v: Pick<C.FilaVideo, 'content_id' | 'miniatura'>, nombres: ReadonlyMap<string, string>): string {
  const id = productoDePortada(v.miniatura);
  const nombre = id ? nombres.get(id) : undefined;
  return nombre && nombre.trim() ? nombre : T.nombreVideo(formato.idCorto(v.content_id));
}

/** ¿La portada es la foto del producto? (C4: con imagen, siempre lo es salvo que el hub diga lo contrario). */
export function portadaEsDelProducto(v: Pick<C.FilaVideo, 'miniatura' | 'miniatura_origen'>): boolean {
  return v.miniatura !== null && v.miniatura_origen !== null;
}

export interface ResumenVideos {
  conPedidos: number;
  conVentas: number;
  /** null si no se pudo saber (p. ej. el celular sin la PC). */
  ultimos7: number | null;
}

/** «40 videos con pedidos · 35 con ventas · 6 vendieron en los últimos 7 días» (01 §4.12, VD1 y VD5). */
export function resumenVideos(items: readonly C.FilaVideo[], vendiendo: ReadonlySet<string> | null): ResumenVideos {
  return {
    conPedidos: items.length,
    conVentas: items.filter((v) => v.pedidos_validos > 0).length,
    ultimos7: vendiendo ? vendiendo.size : null,
  };
}

/** Videos con al menos una venta válida en la respuesta de 7 días (VD5 «Vendiendo ahora»). */
export function idsVendiendo(semana: readonly C.FilaVideo[] | undefined): Set<string> | null {
  if (!semana) return null;
  return new Set(semana.filter((v) => v.pedidos_validos > 0).map((v) => v.content_id));
}

export interface FiltrosVideos {
  soloConVentas: boolean;
  vendiendoAhora: boolean;
  reembolsoAlto: boolean;
  q: string;
}

export function filtrarVideos(
  items: readonly C.FilaVideo[],
  f: FiltrosVideos,
  vendiendo: ReadonlySet<string> | null,
  nombres: ReadonlyMap<string, string>,
): C.FilaVideo[] {
  const q = f.q.trim();
  return items.filter((v) => {
    if (f.soloConVentas && v.pedidos_validos === 0) return false;
    if (f.vendiendoAhora && !(vendiendo?.has(v.content_id) ?? false)) return false;
    if (f.reembolsoAlto && !(v.tasa_reembolso > UMBRAL_REEMBOLSO_ALTO)) return false;
    if (q && !coincide(q, nombreVideo(v, nombres), v.tienda_principal, v.content_id)) return false;
    return true;
  });
}

const porComision = (a: C.FilaVideo, b: C.FilaVideo): number =>
  b.comision_estimada_centavos - a.comision_estimada_centavos || a.content_id.localeCompare(b.content_id);

export function ordenarVideos(items: readonly C.FilaVideo[], orden: ClaveOrden): C.FilaVideo[] {
  const copia = [...items];
  switch (orden) {
    case 'comision':
      return copia.sort(porComision);
    case 'pedidos':
      return copia.sort((a, b) => b.pedidos - a.pedidos || porComision(a, b));
    case 'unidades':
      return copia.sort((a, b) => b.unidades - a.unidades || porComision(a, b));
    case 'reciente':
      return copia.sort((a, b) => b.ultima_venta.localeCompare(a.ultima_venta) || porComision(a, b));
    case 'nuevos':
      return copia.sort((a, b) => b.primera_venta.localeCompare(a.primera_venta) || porComision(a, b));
    case 'reembolso':
      return copia.sort((a, b) => b.tasa_reembolso - a.tasa_reembolso || b.pedidos - a.pedidos || porComision(a, b));
    // rev. 5 · Los videos sin cifra de TikTok (null o ausente) van al final.
    case 'vistas':
      return copia.sort((a, b) => (b.vistas ?? -1) - (a.vistas ?? -1) || porComision(a, b));
    case 'conversion':
      return copia.sort((a, b) => (b.pedidos_por_mil_vistas ?? -1) - (a.pedidos_por_mil_vistas ?? -1) || (b.vistas ?? -1) - (a.vistas ?? -1) || porComision(a, b));
  }
}

/** Lugar de cada video por comisión dentro del rango (la insignia «#1»), solo para los que vendieron. */
export function rankingPorComision(items: readonly C.FilaVideo[]): Map<string, number> {
  const mapa = new Map<string, number>();
  [...items].filter((v) => v.comision_estimada_centavos > 0).sort(porComision).forEach((v, i) => mapa.set(v.content_id, i + 1));
  return mapa;
}

/** Clave ('YYYY-MM-DD' del lunes) de la semana que contiene `hoy`. */
export function lunesDe(hoy: C.FechaLocal): C.FechaLocal {
  return sumarDias(hoy, -diaSemana(hoy));
}

const puntoVacio = (clave: string, etiqueta: string): C.PuntoSerie => ({
  clave, etiqueta, pedidos: 0, pedidos_reembolsados: 0, unidades: 0, ventas_centavos: 0, comision_estimada_centavos: 0, comision_liquidada_centavos: 0,
});

/**
 * Serie semanal CONTINUA para la gráfica: el hub solo manda las semanas con pedidos, y un video que vendió el 10 y el
 * 24 de agosto saldría con dos columnas juntas, como si fueran semanas seguidas. Rellena con ceros las semanas sin
 * pedidos desde la primera hasta la semana en curso (así también se ve cuándo dejó de vender). Si alguna clave no es
 * el lunes 'YYYY-MM-DD' de su semana, no la toca. Tope de 10 años.
 */
export function serieSemanalContinua(serie: readonly C.PuntoSerie[], lunesActual: C.FechaLocal): C.PuntoSerie[] {
  const esLunes = (k: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(k) && diaSemana(k) === 0;
  if (serie.length === 0 || !esLunes(lunesActual) || serie.some((p) => !esLunes(p.clave))) return [...serie];
  const porClave = new Map(serie.map((p) => [p.clave, p]));
  const claves = [...porClave.keys()].sort();
  const primera = claves[0] ?? lunesActual;
  const ultima = claves[claves.length - 1] ?? lunesActual;
  const fin = ultima > lunesActual ? ultima : lunesActual;
  const salida: C.PuntoSerie[] = [];
  for (let k = primera; k <= fin && salida.length < 530; k = sumarDias(k, 7)) {
    salida.push(porClave.get(k) ?? puntoVacio(k, T.etiquetaSemana(formato.fechaCorta(k))));
  }
  return salida;
}

/** Punto con más comisión (nota de la gráfica); null sin ventas. */
export function mejorPunto(serie: readonly C.PuntoSerie[]): C.PuntoSerie | null {
  let mejor: C.PuntoSerie | null = null;
  for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
  return mejor;
}

/** 'sem 24 ago' → '24 ago' para el eje (la gráfica ya dice «por semana»). */
export function etiquetaEje(etiqueta: string): string {
  return etiqueta.replace(/^sem\s+/i, '');
}

/** Reembolsados de un video: pedidos − válidos no es exacto (FROZEN/UNSPECIFIED); se usa la tasa del hub. */
export function reembolsados(v: Pick<C.FilaVideo, 'pedidos' | 'tasa_reembolso'>): number {
  return Math.round(v.pedidos * v.tasa_reembolso);
}
