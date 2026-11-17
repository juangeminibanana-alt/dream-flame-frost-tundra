/**
 * Lógica de presentación de Productos (01_ux §4.13 y §6.5). Funciones puras sobre los tipos del contrato: segmentos
 * (Más vendidos · Muestras sin ventas · Todos), resumen del encabezado, filtros y lo que se oculta sin ficha. Sin React.
 */
import type * as C from '@/contrato';
import { coincide, diasEntre, esPendiente, nombreCorto, normalizarTitulo } from '@/dominio';
import type { ReglaColumnas } from './ajusteColumnas';
import { T } from './textos';

/** Columnas de columnasProductos() que se quedan cuando no caben todas en la tabla (producto y comisión siempre). */
export const REGLA_COLUMNAS: ReglaColumnas = {
  prioridad: ['producto', 'comision', 'unidades', 'tienda', 'videos', 'pedidos', 'reembolsos', 'tasa', 'vitrina'],
  fijas: ['producto', 'comision'],
  minimos: { producto: 240, tienda: 160 },
};

/**
 * Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
 * en MAYÚSCULAS: «BOTA CASUAL DE PIEL PARA HOMBRE…»); normalizarTitulo es de la capa de vista, así que se aplica aquí.
 * Un nombre corto en mayúsculas y minúsculas (el que escribió el usuario, o uno normal) no cambia. Sin corto, el
 * nombre corto del título.
 */
export function nombreVisible(corto: string | null | undefined, titulo: string | null): string {
  const c = corto?.replace(/\s+/g, ' ').trim();
  return c ? normalizarTitulo(c) : nombreCorto(titulo);
}

/** La fila con su nombre corto normalizado, para los bloques que lo pintan tal cual (columnasProductos de la tabla). */
export function filaConNombre(f: C.FilaProducto): C.FilaProducto {
  const c = f.titulo_corto;
  if (!c || !c.trim()) return f;
  const n = nombreVisible(c, f.titulo);
  return n === c ? f : { ...f, titulo_corto: n };
}

/** La muestra con el nombre corto del producto normalizado, para TarjetaMuestra (que lo pinta tal cual). */
export function muestraConNombre(m: C.MuestraVista): C.MuestraVista {
  const c = m.producto.titulo_corto;
  if (!c || !c.trim()) return m;
  const n = nombreVisible(c, m.producto.titulo);
  return n === c ? m : { ...m, producto: { ...m.producto, titulo_corto: n } };
}

export type Segmento = 'vendidos' | 'sin_ventas' | 'todos';
export const SEGMENTOS: readonly Segmento[] = ['vendidos', 'sin_ventas', 'todos'];
export function esSegmento(v: string | null): v is Segmento {
  return v !== null && (SEGMENTOS as readonly string[]).includes(v);
}

/** Días después de publicar sin ventas para el chip «Publicado hace {n} días sin ventas» (01 §4.13, P7). */
export const DIAS_PUBLICADO_SIN_VENTAS = 14;

/** P1: productos con al menos una línea válida, de más a menos comisión. */
export function productosVendidos(items: readonly C.FilaProducto[]): C.FilaProducto[] {
  return items
    .filter((x) => x.pedidos_validos > 0)
    .sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos || b.unidades - a.unidades || a.product_id.localeCompare(b.product_id));
}

export interface MuestraSinVentas {
  producto: C.ProductoResumen;
  /** La muestra que representa al producto: una pendiente si hay; si no, la más reciente. */
  muestra: C.MuestraVista;
  /** Cuántas muestras recibidas hay de este producto. */
  muestras: number;
}

/** P5: productos de muestras RECIBIDAS cuyo product_id no aparece en líneas válidas. */
export function muestrasSinVentas(recibidas: readonly C.MuestraVista[], productos: readonly C.FilaProducto[]): MuestraSinVentas[] {
  const vendidos = new Set(productos.filter((x) => x.pedidos_validos > 0).map((x) => x.product_id));
  const porProducto = new Map<string, C.MuestraVista[]>();
  for (const m of recibidas) {
    if (!m.recibida) continue;
    const id = m.producto.product_id;
    if (vendidos.has(id)) continue;
    const lista = porProducto.get(id);
    if (lista) lista.push(m);
    else porProducto.set(id, [m]);
  }
  const salida: MuestraSinVentas[] = [];
  for (const lista of porProducto.values()) {
    const ordenadas = [...lista].sort((a, b) => Number(esPendiente(b)) - Number(esPendiente(a)) || (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0));
    const muestra = ordenadas[0];
    if (muestra) salida.push({ producto: muestra.producto, muestra, muestras: lista.length });
  }
  // Primero lo que todavía te toca (pendientes en orden de cola), después el resto por fecha de solicitud.
  return salida.sort((a, b) =>
    Number(esPendiente(b.muestra)) - Number(esPendiente(a.muestra))
    || (a.muestra.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.muestra.posicion_cola ?? Number.MAX_SAFE_INTEGER)
    || (b.muestra.solicitada_at ?? 0) - (a.muestra.solicitada_at ?? 0));
}

export interface ResumenProductos {
  conVentas: number;
  /** Productos distintos de muestras recibidas (null si aún no llegan las muestras). */
  deMuestra: number | null;
  sinVentas: number | null;
  yaVendieron: number | null;
}

/** «20 productos con ventas · 15 productos de muestra recibidos · 10 todavía sin ventas» (01 §4.13, P1, P5, P6). */
export function resumenProductos(productos: readonly C.FilaProducto[], recibidas: readonly C.MuestraVista[] | undefined): ResumenProductos {
  const conVentas = productos.filter((x) => x.pedidos_validos > 0).length;
  if (!recibidas) return { conVentas, deMuestra: null, sinVentas: null, yaVendieron: null };
  const deMuestra = new Set(recibidas.filter((m) => m.recibida).map((m) => m.producto.product_id)).size;
  const sinVentas = muestrasSinVentas(recibidas, productos).length;
  return { conVentas, deMuestra, sinVentas, yaVendieron: deMuestra - sinVentas };
}

/** P7: días desde que se publicó el video de la muestra, si pasan de 14 (y la muestra sigue sin ventas). */
export function diasPublicadoSinVentas(m: C.MuestraVista, hoy: C.FechaLocal): number | null {
  if (m.avance.etapa !== 'publicada' || !m.avance.fecha_publicada) return null;
  const dias = diasEntre(m.avance.fecha_publicada, hoy);
  return dias > DIAS_PUBLICADO_SIN_VENTAS ? dias : null;
}

/** Etapas anteriores a Publicada (las que todavía se pueden planear). */
export function puedePlanear(m: C.MuestraVista): boolean {
  return m.avance.etapa === 'por_planear' || m.avance.etapa === 'planeada' || m.avance.etapa === 'video_listo' || m.avance.etapa === 'programada';
}

// ---------------------------------------------------------------------------------------------- «Todos»

export interface ElementoProducto {
  product_id: string;
  nombre: string;
  imagen: C.UrlImagen | null;
  tienda: string | null;
  categoria: string | null;
  fila: C.FilaProducto | null;
  muestra: C.MuestraVista | null;
  conVentas: boolean;
  fueMuestra: boolean;
  enVitrina: boolean;
}

/** Muestras recibidas y productos de pedidos, sin repetir (01 §4.13 «Todos»). */
export function todosLosProductos(productos: readonly C.FilaProducto[], recibidas: readonly C.MuestraVista[]): ElementoProducto[] {
  const porId = new Map<string, ElementoProducto>();
  for (const x of productos) {
    porId.set(x.product_id, {
      product_id: x.product_id,
      nombre: nombreVisible(x.titulo_corto, x.titulo),
      imagen: x.imagen,
      tienda: x.tienda_nombre,
      categoria: null,
      fila: x,
      muestra: null,
      conVentas: x.pedidos_validos > 0,
      fueMuestra: x.es_muestra,
      enVitrina: x.en_vitrina === true,
    });
  }
  for (const m of recibidas) {
    if (!m.recibida) continue;
    const id = m.producto.product_id;
    const previo = porId.get(id);
    if (previo) {
      if (!previo.muestra) porId.set(id, { ...previo, muestra: m, fueMuestra: true, categoria: previo.categoria ?? m.producto.categoria, imagen: previo.imagen ?? m.producto.imagen });
      continue;
    }
    porId.set(id, {
      product_id: id,
      nombre: nombreVisible(m.producto.titulo_corto, m.producto.titulo),
      imagen: m.producto.imagen,
      tienda: m.tienda.nombre,
      categoria: m.producto.categoria,
      fila: null,
      muestra: m,
      conVentas: false,
      fueMuestra: true,
      enVitrina: m.producto.en_vitrina === true,
    });
  }
  return [...porId.values()].sort((a, b) =>
    (b.fila?.comision_estimada_centavos ?? 0) - (a.fila?.comision_estimada_centavos ?? 0) || a.nombre.localeCompare(b.nombre, 'es-MX'));
}

export interface FiltrosTodos { conVentas: boolean; sinVentas: boolean; fueMuestra: boolean; enVitrina: boolean; q: string }

export function filtrarTodos(items: readonly ElementoProducto[], f: FiltrosTodos): ElementoProducto[] {
  const q = f.q.trim();
  return items.filter((x) => {
    if (f.conVentas && !x.conVentas) return false;
    if (f.sinVentas && x.conVentas) return false;
    if (f.fueMuestra && !x.fueMuestra) return false;
    if (f.enVitrina && !x.enVitrina) return false;
    if (q && !coincide(q, x.nombre, x.tienda)) return false;
    return true;
  });
}

export function buscarFilas(items: readonly C.FilaProducto[], q: string): C.FilaProducto[] {
  const t = q.trim();
  if (!t) return [...items];
  return items.filter((x) => coincide(t, nombreVisible(x.titulo_corto, x.titulo), x.titulo, x.tienda_nombre));
}

// ---------------------------------------------------------------------------------------------- detalle

export interface VistaDetalle {
  nombre: string;
  /** Título completo (con ficha, el de la ficha; si no, el de los pedidos), normalizado y sin el prefijo promocional. */
  tituloCompleto: string | null;
  /** Prefijo promocional quitado del título ('Buen Fin' de «【Buen Fin】…»): se muestra como chip (02 §4.4). */
  promocion: string | null;
  imagen: C.UrlImagen | null;
  tienda: string | null;
  tiendaKey: string | null;
  /** Sin ficha: se ocultan precio, comisión, categoría, vendidos e inventario (C18, 01 §4.13). */
  conFicha: boolean;
  /** Para Guardar imagen: la ficha o, sin ficha, un resumen mínimo armado con lo que se sabe (precios en null). */
  resumen: C.ProductoResumen | null;
}

/** Lo que muestra el detalle, venga o no la ficha (la cascada de imagen ya la resolvió el hub, C39). */
export function vistaDetalle(d: C.ProductoDetalleResponse): VistaDetalle {
  const ficha = d.ficha;
  const fila = d.fila;
  const muestra = d.muestras[0] ?? null;
  const titulo = ficha?.titulo ?? fila?.titulo ?? muestra?.producto.titulo ?? null;
  const corto = nombreVisible(ficha?.titulo_corto ?? fila?.titulo_corto ?? muestra?.producto.titulo_corto, titulo);
  const imagen = ficha?.imagen ?? fila?.imagen ?? muestra?.producto.imagen ?? null;
  const tienda = fila?.tienda_nombre ?? muestra?.tienda.nombre ?? null;
  const tiendaKey = fila?.tienda_key ?? muestra?.tienda.tienda_key ?? null;
  // Con ficha, el resumen (Guardar imagen nombra el archivo con él) lleva también el nombre normalizado.
  const fichaNombrada = ficha && ficha.titulo_corto && ficha.titulo_corto !== corto ? { ...ficha, titulo_corto: corto } : ficha;
  const resumen: C.ProductoResumen | null = fichaNombrada ?? (imagen
    ? {
        product_id: d.product_id, titulo, titulo_corto: corto, imagen, enlace: null,
        precio_min_centavos: null, precio_max_centavos: null, precio_venta_min_centavos: null, precio_venta_max_centavos: null,
        precio_fuente: null, comision_bp: null, comision_por_venta_centavos: null, comision_por_venta_max_centavos: null,
        unidades_vendidas_global: null, en_colaboracion_abierta: false, en_vitrina: fila?.en_vitrina ?? null, categoria: null,
      }
    : null);
  const { prefijo, resto } = partirPromocion(titulo);
  return { nombre: corto, tituloCompleto: resto, promocion: prefijo, imagen, tienda, tiendaKey, conFicha: ficha !== null, resumen };
}

/** 02 §4.4: «【Buen Fin】Chaqueta…» → prefijo 'Buen Fin' y el título normalizado sin él. */
export function partirPromocion(titulo: string | null): { prefijo: string | null; resto: string | null } {
  if (!titulo || !titulo.trim()) return { prefijo: null, resto: null };
  const m = /^\s*[【\[]([^】\]]{1,40})[】\]]\s*/u.exec(titulo);
  const resto = normalizarTitulo(m ? titulo.slice(m[0].length) : titulo);
  return { prefijo: m?.[1]?.trim() || null, resto: resto || null };
}

const puntoVacio = (clave: string, etiqueta: string): C.PuntoSerie => ({
  clave, etiqueta, pedidos: 0, pedidos_reembolsados: 0, unidades: 0, ventas_centavos: 0, comision_estimada_centavos: 0, comision_liquidada_centavos: 0,
});

function mesSiguiente(clave: string): string {
  const anio = Number(clave.slice(0, 4));
  const mes = Number(clave.slice(5, 7));
  return mes >= 12 ? `${anio + 1}-01` : `${anio}-${String(mes + 1).padStart(2, '0')}`;
}

/** 'ago 26', como las etiquetas del hub. */
function etiquetaMes(clave: string): string {
  const mes = T.meses[Number(clave.slice(5, 7)) - 1] ?? clave.slice(5, 7);
  return `${mes} ${clave.slice(2, 4)}`;
}

/**
 * Serie mensual CONTINUA para la gráfica: el hub solo manda los meses con pedidos, y un producto que vendió en marzo y
 * en octubre saldría con dos columnas juntas, como si fueran meses seguidos. Rellena con ceros los meses sin pedidos
 * desde el primero hasta el mes en curso. Si la serie no trae claves 'YYYY-MM' no la toca. Tope de 10 años.
 */
export function serieMensualContinua(serie: readonly C.PuntoSerie[], mesActual: string): C.PuntoSerie[] {
  if (serie.length === 0 || serie.some((p) => !/^\d{4}-(0[1-9]|1[0-2])$/.test(p.clave)) || !/^\d{4}-\d{2}$/.test(mesActual)) return [...serie];
  const porClave = new Map(serie.map((p) => [p.clave, p]));
  const claves = [...porClave.keys()].sort();
  const primera = claves[0] ?? mesActual;
  const ultima = claves[claves.length - 1] ?? mesActual;
  const fin = ultima > mesActual ? ultima : mesActual;
  const salida: C.PuntoSerie[] = [];
  for (let k = primera; k <= fin && salida.length < 120; k = mesSiguiente(k)) salida.push(porClave.get(k) ?? puntoVacio(k, etiquetaMes(k)));
  return salida;
}

/** Mes con más comisión (nota de la gráfica); null sin ventas. */
export function mejorMes(serie: readonly C.PuntoSerie[]): C.PuntoSerie | null {
  let mejor: C.PuntoSerie | null = null;
  for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
  return mejor;
}

/** Etiqueta del eje: sin el año si toda la serie es del mismo año ('feb 26' → 'feb'). */
export function etiquetasMes(serie: readonly C.PuntoSerie[]): string[] {
  const anios = new Set(serie.map((x) => x.clave.slice(0, 4)));
  return serie.map((x) => (anios.size <= 1 ? x.etiqueta.replace(/\s+\d{2,4}$/, '') : x.etiqueta));
}

/** product_id de una portada '/img/p/<id>?v=…'; null si no es de producto. */
export function productoDePortada(url: C.UrlImagen | null): string | null {
  if (!url) return null;
  const m = /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url);
  return m?.[1] ?? null;
}

// ---------------------------------------------------------------------------------------------- rev. 5 · métricas de TikTok

/** Portada de un video: la REAL de TikTok ('/img/v/…') si existe; si no, la foto del producto (rotulada). */
export function portadaVideo(v: Pick<C.FilaVideo, 'portada' | 'miniatura' | 'miniatura_origen'>): { url: C.UrlImagen | null; delProducto: boolean } {
  if (v.portada) return { url: v.portada, delProducto: false };
  return { url: v.miniatura, delProducto: v.miniatura !== null && v.miniatura_origen !== null };
}

/** 9,876 · 48.2 mil · 482 mil · 1.3 M. */
export function cifraCompacta(n: number): string {
  const abs = Math.abs(n);
  const uno = (x: number): string => (Math.round(x * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 });
  if (abs < 10_000) return n.toLocaleString('es-MX', { maximumFractionDigits: 0 });
  if (abs < 100_000) return `${uno(n / 1000)} mil`;
  if (abs < 1_000_000) return `${Math.round(n / 1000).toLocaleString('es-MX')} mil`;
  return `${uno(n / 1_000_000)} M`;
}

/** «Pedidos por 1,000 vistas» con 2 decimales. */
export function textoPorMil(x: number): string {
  return x.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
