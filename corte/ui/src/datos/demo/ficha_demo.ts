/**
 * @/datos · SOLO DESARROLLO (`npm run dev:demo`). Ficha completa de producto (contrato rev. 4, 15/11) con datos
 * SINTÉTICOS coherentes para el modo demo: los fixtures de ui/fixtures se generaron antes de la rev. 4 y no traen
 * `extendido`, así que el transporte de demostración lo arma aquí a partir de lo que ya dice el propio fixture (ficha,
 * fila de ventas, muestras, foto) y del catálogo de muestras (para los parecidos). Nada sale de research/ ni de la API.
 *
 * Determinista: cada producto usa su propio generador (semilla = su product_id), así que la misma ficha sale igual en
 * cada carga, en cada prueba y en cada captura. Las reglas imitan al hub (analitica/vista.py, producto_extendido):
 * - galería (6–9 fotos '/img/g/<id>-<n>') y vitrina solo si el producto tiene ficha y está en tu vitrina;
 * - comisión real por tasa coherente con la tasa promedio de tus ventas (fila.comision_bp) y con el plan dirigido;
 * - elegibilidad de muestra con SKU de color/talla según la categoría y la variante que ya pediste;
 * - parecidos del catálogo de la misma categoría: los que están en Corte enlazan a su ficha; los «del marketplace»
 *   son otro vendedor del mismo artículo (id sintético '9…', foto '/img/m/9…' que el middleware de demo resuelve);
 * - origen de las ventas para los productos con ventas; con `?trazas=sin_permiso` simula el código 105005.
 * Este módulo solo lo importa transporte_demo.ts (que solo se carga con DEV && VITE_DEMO): nunca llega a dist.
 */
import type * as C from '@/contrato';

const HORA = 3_600;
const DIA = 86_400;

// ---------------------------------------------------------------------------------------------- azar con semilla

/** FNV-1a de 32 bits. */
function huella(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32: 0..1 reproducible. */
function generador(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const hex8 = (texto: string): string => huella(texto).toString(16).padStart(8, '0');

/** Id numérico de `largo` dígitos que empieza con `prefijo` (sku_id, application_id, collab_id sintéticos). */
function idSintetico(prefijo: string, texto: string, largo = 19): string {
  let s = prefijo;
  for (let i = 0; s.length < largo; i++) s += String(huella(`${texto}#${i}`) % 1_000_000).padStart(6, '0');
  return s.slice(0, largo);
}

function elegir<T>(r: () => number, lista: readonly T[]): T {
  return lista[Math.min(lista.length - 1, Math.floor(r() * lista.length))] as T;
}

const esVersionCero = (url: string | null): boolean => !!url && /[?&]v=0(?:&|$)/.test(url);

// ---------------------------------------------------------------------------------------------- textos (= hub)

const TEXTO_MOTIVO_SKU: Readonly<Record<string, string>> = {
  IS_PREORDER: 'Es preventa: no tiene muestra gratis', IS_GIFT: 'Es un regalo: no tiene muestra gratis',
  OUT_OF_STOCK: 'Agotado', EXCEED_CB_PRICE_THRESHOLD: 'Su precio pasa el límite para pedir muestra',
  ALREADY_APPLYED: 'Ya pediste esta variante', UNKNOWN: 'No disponible como muestra',
};
const TEXTO_TIPO_SOLICITUD: Readonly<Record<string, string>> = { FREE_SAMPLE: 'Muestra gratis', SAMPLE_COUPON: 'Cupón de muestra' };
const TEXTO_CUMPLIMIENTO: Readonly<Record<string, string>> = {
  PENDING: 'Por publicar', ONGOING: 'Tu video está en revisión', SUCCEED: 'Video entregado', REPEATED: 'Video entregado',
  OVERDUE: 'Venció el plazo para publicar', FAILED: 'TikTok no aceptó el video', SUSPEND: 'Plazo en pausa',
  CANCELLED: 'Cancelada', EXEMPTED: 'Exenta: no tienes que publicar',
};
const TEXTO_PLAN: Readonly<Record<string, string>> = { LIVE: 'Activo', EXPIRED: 'Vencido', DELETED: 'Eliminado', ENDED: 'Terminado' };
const TEXTO_CONTENIDO: Readonly<Record<string, string>> = {
  VIDEO: 'Video', LIVE: 'En vivo', SHOP: 'Tienda', PRE_LIVE: 'Antes del en vivo', PROMOTION_PAGE: 'Página de promoción', LINKSHARE: 'Enlace compartido',
};
const TEXTO_ENLACE: Readonly<Record<string, string>> = { GENERAL: 'Enlace general', SPECIFIC: 'Enlace para un publicador' };

/** = vista.texto_elegibilidad del hub. */
export function textoElegibilidad(puede: boolean | null, estado: string | null, limite: boolean | null): string {
  if (estado === 'ONGOING') return 'Ya la pediste; sigue en proceso';
  if (estado === 'COMPLETE') return 'Ya la pediste y se completó';
  if (limite) return 'Llegaste al límite de solicitudes de muestra';
  if (puede === true) return 'Puedes pedir muestra';
  if (puede === false) return 'Por ahora no puedes pedir muestra';
  return 'TikTok no dio este dato';
}

// ---------------------------------------------------------------------------------------------- piezas

const GRUPOS_EN_CURSO: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada', 'en_camino', 'en_revision', 'esperando_aprobacion']);
const GRUPOS_COMPLETOS: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['entregada', 'exenta']);
const COLORES = ['Negro', 'Café', 'Beige', 'Gris Oxford', 'Azul marino', 'Verde olivo', 'Blanco', 'Vino'] as const;
const TALLAS_ROPA = ['S', 'M', 'L', 'XL', '2XL'] as const;
const TALLAS_CALZADO = ['25', '25.5', '26', '26.5', '27', '28'] as const;
const TIENDAS_MARKETPLACE = [
  'Moda Aurora MX', 'Estilo Norte', 'Casa Olmo', 'Urbano Fino', 'Taller Sierra', 'Bazar Lumen', 'Punto Cardinal Shop',
  'Nómada Store', 'Calle 12 Moda', 'Brisa Outlet',
] as const;
const NOMBRES_PLAN = ['Creadores destacados de noviembre', 'Plan Buen Fin para creadores', 'Socios de temporada', 'Creadores que ya venden'] as const;
const PALABRAS_VACIAS = new Set(['para', 'con', 'del', 'los', 'las', 'una', 'uno', 'por', 'que', 'sus', 'mas', 'más', 'muy', 'ideal', 'estilo', 'nuevo', 'nueva']);

const redondear = (c: number, paso = 100): number => Math.max(paso, Math.round(c / paso) * paso);
/** Precio «de etiqueta»: $479 en lugar de $483.17. */
const precioEtiqueta = (c: number): number => Math.max(900, Math.round(c / 1000) * 1000 - 100);

function hojaCategoria(cat: string | null | undefined): string {
  const partes = (cat ?? '').split(/\s*[>›]\s*/).filter(Boolean);
  return partes[partes.length - 1] ?? '';
}
function raizCategoria(cat: string | null | undefined): string {
  return (cat ?? '').split(/\s*[>›]\s*/).filter(Boolean)[0] ?? '';
}

/** Palabras del título con las que el hub busca parecidos (como api_enriquecer: las primeras con contenido). */
export function palabrasDelTitulo(titulo: string | null): string[] {
  const limpio = (titulo ?? '').replace(/[【[][^】\]]{0,40}[】\]]/gu, ' ').toLowerCase();
  const salida: string[] = [];
  for (const p of limpio.split(/[^a-záéíóúüñ0-9]+/u)) {
    if (p.length < 4 || PALABRAS_VACIAS.has(p) || salida.includes(p)) continue;
    salida.push(p);
    if (salida.length === 3) break;
  }
  return salida;
}

function vitrinaDe(ficha: C.ProductoResumen, conInventario: boolean | null, r: () => number): C.VitrinaProducto {
  let listaMin = ficha.precio_min_centavos;
  let listaMax = ficha.precio_max_centavos ?? listaMin;
  const ventaMin = ficha.precio_venta_min_centavos ?? (listaMin !== null ? redondear(listaMin * 0.72) : null);
  const ventaMax = ficha.precio_venta_max_centavos ?? (listaMax !== null ? redondear(listaMax * 0.72) : ventaMin);
  if (listaMin === null && ventaMin !== null) {
    listaMin = precioEtiqueta(ventaMin / 0.68);
    listaMax = ventaMax !== null ? precioEtiqueta(ventaMax / 0.68) : listaMin;
  }
  const factor = 0.88 + r() * 0.07;
  const conPlataforma = r() < 0.75;
  const platMin = conPlataforma && ventaMin !== null ? precioEtiqueta(ventaMin * factor) : null;
  const platMax = conPlataforma && ventaMax !== null ? precioEtiqueta(ventaMax * factor) : null;
  const agotado = conInventario === false || (conInventario === null && r() < 0.1);
  return {
    inventario: agotado ? 'SOLD_OUT' : 'IN_STOCK',
    con_existencias: !agotado,
    precio_lista_min_centavos: listaMin,
    precio_lista_max_centavos: listaMax,
    precio_venta_min_centavos: ventaMin,
    precio_venta_max_centavos: ventaMax,
    precio_plataforma_min_centavos: platMin,
    precio_plataforma_max_centavos: platMax,
    comision_bp: ficha.comision_bp,
    oculto: false,
  };
}

function skusDe(pid: string, categoria: string, variantePedida: string | null, precio: number | null, agotado: boolean, r: () => number): C.SkuMuestra[] {
  const ropa = /ropa|camis|chamarr|chaquet|sudader|pantal|jeans|chaleco|tops|sets|tejida|polo/i.test(categoria);
  const calzado = /calzado|zapat|bot[ií]n|sandal|boots/i.test(categoria);
  const partes = (variantePedida ?? '').split(' / ').map((x) => x.trim()).filter(Boolean);
  const colorPedido = partes[0] ?? null;
  const tallaPedida = partes[1] ?? null;
  const colores: string[] = colorPedido ? [colorPedido] : [];
  while (colores.length < (ropa || calzado ? 2 + Math.floor(r() * 2) : 2 + Math.floor(r() * 3))) {
    const c = elegir(r, COLORES);
    if (!colores.some((x) => x.startsWith(c) || c.startsWith(x))) colores.push(c);
  }
  let tallas: string[] = [];
  if (ropa || calzado) {
    const base: readonly string[] = calzado ? TALLAS_CALZADO : TALLAS_ROPA;
    const cuantas = 3 + Math.floor(r() * 2);
    const inicio = Math.floor(r() * (base.length - cuantas + 1));
    tallas = base.slice(inicio, inicio + cuantas);
    if (tallaPedida && !tallas.includes(tallaPedida)) tallas = [...tallas.slice(0, cuantas - 1), tallaPedida];
    while (colores.length * tallas.length > 10 && colores.length > 1) colores.pop();
  }
  const combinaciones: Array<{ props: C.PropiedadSku[] }> = [];
  for (const color of colores) {
    if (tallas.length === 0) combinaciones.push({ props: [{ nombre: 'Color', valor: color }] });
    else for (const talla of tallas) combinaciones.push({ props: [{ nombre: 'Color', valor: color }, { nombre: 'Talla', valor: talla }] });
  }
  return combinaciones.slice(0, 10).map((c, i) => {
    const variante = c.props.map((p) => p.valor).join(' / ');
    let motivo: string | null = null;
    if (agotado) motivo = 'OUT_OF_STOCK';
    else if (variantePedida && variante === variantePedida) motivo = 'ALREADY_APPLYED';
    else if (r() < 0.16) motivo = 'OUT_OF_STOCK';
    const extra = c.props.some((p) => p.valor === '2XL' || p.valor === '28') ? 1_000 : 0;
    return {
      sku_id: idSintetico('17', `${pid}:sku:${i}`),
      propiedades: c.props,
      variante,
      precio_centavos: precio !== null ? precio + extra : null,
      disponible: motivo === null,
      motivo_no_disponible: motivo,
      motivo_texto: motivo ? (TEXTO_MOTIVO_SKU[motivo] ?? 'No disponible como muestra') : null,
    };
  });
}

/** Reparte `total` en enteros según `partes` (suma exacta). */
function repartir(total: number, partes: readonly number[]): number[] {
  const suma = partes.reduce((a, b) => a + b, 0) || 1;
  const crudos = partes.map((p) => (total * p) / suma);
  const enteros = crudos.map((x) => Math.floor(x));
  let falta = total - enteros.reduce((a, b) => a + b, 0);
  const orden = crudos.map((x, i) => [x - Math.floor(x), i] as const).sort((a, b) => b[0] - a[0]);
  for (const [, i] of orden) {
    if (falta <= 0) break;
    enteros[i] = (enteros[i] ?? 0) + 1;
    falta--;
  }
  return enteros;
}

function comisionRealDe(fila: C.FilaProducto, abierto: number | null, dirigido: number | null, r: () => number): C.ComisionReal | null {
  if (fila.pedidos_validos <= 0 || fila.comision_bp === null) return null;
  const promedio = fila.comision_bp;
  let tasas: Array<{ bp: number; parte: number }>;
  if (abierto === null) {
    tasas = [{ bp: redondear(promedio), parte: 1 }];
  } else if (promedio - abierto >= 50) {
    const alta = dirigido !== null && dirigido > promedio ? dirigido : Math.ceil((promedio + 1) / 100) * 100;
    const p = Math.min(0.95, Math.max(0.05, (promedio - abierto) / (alta - abierto)));
    tasas = [{ bp: alta, parte: p }, { bp: abierto, parte: 1 - p }];
  } else if (abierto - promedio >= 50) {
    const baja = Math.max(100, Math.floor(promedio / 100) * 100 - 100);
    const p = Math.min(0.95, Math.max(0.05, (promedio - baja) / (abierto - baja)));
    tasas = [{ bp: abierto, parte: p }, { bp: baja, parte: 1 - p }];
  } else {
    tasas = [{ bp: abierto, parte: 1 }];
  }
  const total = fila.pedidos_validos;
  const lineas = repartir(total, tasas.map((t) => t.parte));
  const unidades = repartir(fila.unidades, tasas.map((t) => t.parte));
  const comisiones = repartir(fila.comision_estimada_centavos, tasas.map((t) => t.parte * t.bp));
  const conCampana = (bp: number, n: number): number => (bp > (abierto ?? Number.POSITIVE_INFINITY) ? Math.round(n * (0.3 + r() * 0.3)) : 0);
  const por_tasa: C.TasaComisionReal[] = tasas
    .map((t, i) => ({
      comision_bp: t.bp,
      lineas: lineas[i] ?? 0,
      unidades: unidades[i] ?? 0,
      comision_estimada_centavos: comisiones[i] ?? 0,
      participacion: Math.round(((lineas[i] ?? 0) / total) * 10_000) / 10_000,
      lineas_con_campana: conCampana(t.bp, lineas[i] ?? 0),
    }))
    .filter((t) => t.lineas > 0)
    .sort((a, b) => b.lineas - a.lineas || b.comision_bp - a.comision_bp);
  const principal = por_tasa[0];
  if (!principal) return null;
  const conCampanas = por_tasa.some((t) => t.lineas_con_campana > 0);
  return {
    lineas: total,
    por_tasa,
    tasa_principal_bp: principal.comision_bp,
    plan_abierto_bp: abierto,
    campanas: conCampanas ? 1 + Math.floor(r() * 2) : 0,
  };
}

function origenDe(fila: C.FilaProducto, r: () => number): C.OrigenVentas | null {
  const total = fila.pedidos_validos;
  if (total <= 0) return null;
  const video = 0.74 + r() * 0.12;
  const contenido: Array<[string | null, number]> = fila.videos > 0
    ? [['VIDEO', video], ['SHOP', (1 - video) * 0.6], ['LIVE', (1 - video) * 0.25], [null, (1 - video) * 0.15]]
    : [['SHOP', 0.7], ['LINKSHARE', 0.2], [null, 0.1]];
  const especifico = 0.6 + r() * 0.15;
  const enlace: Array<[string | null, number]> = [['SPECIFIC', especifico], ['GENERAL', (1 - especifico) * 0.7], [null, (1 - especifico) * 0.3]];
  const armar = (pares: Array<[string | null, number]>, textos: Readonly<Record<string, string>>, sin: string): C.CuentaOrigen[] => {
    const n = repartir(total, pares.map((x) => x[1]));
    return pares
      .map(([tipo], i) => ({ tipo, texto: tipo ? (textos[tipo] ?? tipo) : sin, lineas: n[i] ?? 0 }))
      .filter((x) => x.lineas > 0)
      .sort((a, b) => b.lineas - a.lineas);
  };
  return { lineas: total, por_tipo_contenido: armar(contenido, TEXTO_CONTENIDO, 'Sin dato'), por_tipo_enlace: armar(enlace, TEXTO_ENLACE, 'Sin enlace compartido') };
}

interface Candidato { producto: C.ProductoResumen; tienda: string }

function parecidosDe(
  pid: string, titulo: string | null, categoria: string, propia: number | null, catalogo: readonly C.MuestraVista[], ahora: C.EpochS, r: () => number,
): { parecidos: C.ParecidosProducto; fuentes: Map<C.UrlImagen, C.UrlImagen> } | null {
  const vistos = new Set<string>([pid]);
  const candidatos: Array<Candidato & { puntos: number; orden: number }> = [];
  for (const m of catalogo) {
    const p = m.producto;
    if (vistos.has(p.product_id) || !p.imagen) continue;
    vistos.add(p.product_id);
    const puntos = hojaCategoria(p.categoria) === hojaCategoria(categoria) && categoria ? 2 : raizCategoria(p.categoria) === raizCategoria(categoria) && categoria ? 1 : 0;
    candidatos.push({ producto: p, tienda: m.tienda.nombre, puntos, orden: huella(`${pid}:${p.product_id}`) });
  }
  candidatos.sort((a, b) => b.puntos - a.puntos || a.orden - b.orden);
  // Misma subcategoría si alcanza para 8; si no, la misma categoría; si tampoco, lo que haya.
  const misma = candidatos.filter((c) => c.puntos === 2);
  const relevantes = candidatos.filter((c) => c.puntos > 0);
  const lista = (misma.length >= 8 ? misma : relevantes.length >= 8 ? relevantes : candidatos).slice(0, 20);
  if (lista.length === 0) return null;
  const fuentes = new Map<C.UrlImagen, C.UrlImagen>();
  const items: C.ProductoParecido[] = lista.map((c) => {
    const p = c.producto;
    const enCorte = r() < 0.35;
    const id = enCorte ? p.product_id : `9${p.product_id.slice(1)}`;
    const original = p.imagen ?? '';
    const imagen = `/img/m/${id}?v=${esVersionCero(original) ? '0' : hex8(`m:${id}`)}`;
    fuentes.set(imagen, original);
    if (enCorte) {
      const bp = p.comision_bp;
      const venta = bp && p.comision_por_venta_centavos !== null ? Math.round((p.comision_por_venta_centavos * 10_000) / bp) : p.precio_min_centavos;
      const ventaMax = bp && p.comision_por_venta_max_centavos !== null ? Math.round((p.comision_por_venta_max_centavos * 10_000) / bp) : venta;
      return {
        product_id: id, titulo: p.titulo, titulo_corto: p.titulo_corto, tienda_nombre: c.tienda, imagen,
        precio_min_centavos: p.precio_min_centavos, precio_max_centavos: p.precio_max_centavos,
        precio_venta_min_centavos: venta, precio_venta_max_centavos: ventaMax,
        precio_fuente: bp && p.comision_por_venta_centavos !== null ? 'comision' : p.precio_min_centavos !== null ? 'lista' : null,
        comision_bp: bp, comision_por_venta_centavos: p.comision_por_venta_centavos, comision_por_venta_max_centavos: p.comision_por_venta_max_centavos,
        unidades_vendidas_global: p.unidades_vendidas_global, enlace: p.enlace, tiene_ficha: true,
      };
    }
    const base = p.comision_bp ?? propia ?? 800;
    const bp = Math.max(300, base + elegir(r, [-200, 0, 200, 400, 700]));
    const lista0 = p.precio_min_centavos ?? p.precio_venta_min_centavos ?? 49_900;
    const listaMin = precioEtiqueta(lista0 * (0.85 + r() * 0.3));
    const ventaMin = precioEtiqueta(listaMin * (0.62 + r() * 0.12));
    const monto = Math.round((ventaMin * bp) / 10_000);
    return {
      product_id: id, titulo: p.titulo, titulo_corto: p.titulo_corto, tienda_nombre: elegir(r, TIENDAS_MARKETPLACE), imagen,
      precio_min_centavos: listaMin, precio_max_centavos: listaMin,
      precio_venta_min_centavos: Math.round((monto * 10_000) / bp), precio_venta_max_centavos: Math.round((monto * 10_000) / bp), precio_fuente: 'comision',
      comision_bp: bp, comision_por_venta_centavos: monto, comision_por_venta_max_centavos: monto,
      unidades_vendidas_global: Math.max(24, Math.round(Math.max(120, p.unidades_vendidas_global ?? 400) * (0.15 + r() * 2.5))),
      enlace: null, tiene_ficha: false,
    };
  });
  return { parecidos: { palabras: palabrasDelTitulo(titulo), consultado_at: ahora - (1 + Math.floor(r() * 5)) * DIA, items }, fuentes };
}

// ---------------------------------------------------------------------------------------------- entrada

export interface FuentesFichaDemo {
  /** Catálogo de muestras del fixture (/api/muestras): productos con foto y categoría para los parecidos. */
  catalogo: readonly C.MuestraVista[];
  /** meta_imagenes del catálogo (los parecidos usan la misma foto: mismo LQIP y color). */
  metaCatalogo: C.MetaImagenes;
  ahora: C.EpochS;
  /** `?trazas=sin_permiso`: el hub aún no tiene el permiso de orders/trace/search (105005). */
  trazasSinPermiso: boolean;
}

/** ProductoDetalleResponse del fixture + `extendido` sintético (y `en_vitrina` coherente con la vitrina inventada). */
export function completarFichaDemo(d: C.ProductoDetalleResponse, f: FuentesFichaDemo): C.ProductoDetalleResponse {
  if (d.extendido) return d;
  const pid = d.product_id;
  const r = generador(huella(`ficha:${pid}`));
  const ficha = d.ficha;
  const fila = d.fila;
  const m0 = d.muestras[0] ?? null;
  const titulo = ficha?.titulo ?? fila?.titulo ?? m0?.producto.titulo ?? null;
  const categoria = ficha?.categoria ?? m0?.producto.categoria ?? '';
  const tienda = fila?.tienda_nombre ?? m0?.tienda.nombre ?? null;
  const imagen = ficha?.imagen ?? fila?.imagen ?? m0?.producto.imagen ?? null;
  const metaFoto = imagen ? d.meta_imagenes?.[imagen] : undefined;
  const meta: C.MetaImagenes = { ...(d.meta_imagenes ?? {}) };

  // Vitrina y galería: con ficha y (con ventas o 3 de cada 4).
  const enVitrina = ficha !== null && ((fila?.pedidos ?? 0) > 0 || r() < 0.75);
  const vitrina = enVitrina && ficha ? vitrinaDe(ficha, d.con_inventario, r) : null;
  const galeria: C.UrlImagen[] = [];
  if (vitrina && imagen) {
    const n = 6 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++) {
      const url = `/img/g/${pid}-${i}?v=${esVersionCero(imagen) ? '0' : hex8(`g:${pid}-${i}`)}`;
      galeria.push(url);
      // Mismo tamaño y color dominante que la foto principal; sin LQIP (cada foto encuadra distinto).
      if (metaFoto && !esVersionCero(url)) meta[url] = { w: metaFoto.w, h: metaFoto.h, lqip: null, color: metaFoto.color };
    }
  }

  // Comisión: plan abierto, plan dirigido coherente con la tasa promedio de tus ventas.
  const abierto = ficha?.en_colaboracion_abierta ? ficha.comision_bp : null;
  const promedio = fila?.comision_bp ?? null;
  const planes: C.PlanDirigido[] = [];
  if (ficha && tienda && ((fila?.pedidos ?? 0) >= 20 || r() < 0.3)) {
    const base = abierto ?? ficha.comision_bp ?? 800;
    const bp = promedio !== null && promedio - base >= 50 ? Math.ceil((promedio + 1) / 100) * 100 : base + (r() < 0.6 ? 400 : 200);
    const venta = vitrina?.precio_venta_min_centavos ?? ficha.precio_venta_min_centavos;
    planes.push({
      collab_id: idSintetico('73', `${pid}:plan:1`), nombre: elegir(r, NOMBRES_PLAN), estado: 'LIVE', estado_texto: TEXTO_PLAN['LIVE'] ?? 'Activo', activo: true,
      comision_bp: bp, comision_monto_centavos: venta !== null ? Math.round((venta * bp) / 10_000) : null, tienda_nombre: tienda,
    });
    if (r() < 0.5) {
      const bp2 = base + 200;
      planes.push({
        collab_id: idSintetico('73', `${pid}:plan:2`), nombre: 'Plan de lanzamiento', estado: 'EXPIRED', estado_texto: TEXTO_PLAN['EXPIRED'] ?? 'Vencido', activo: false,
        comision_bp: bp2, comision_monto_centavos: venta !== null ? Math.round((venta * bp2) / 10_000) : null, tienda_nombre: tienda,
      });
    }
  }
  const dirigido = planes.find((p) => p.activo)?.comision_bp ?? null;
  const comision_real = fila ? comisionRealDe(fila, abierto, dirigido, r) : null;

  // Muestra: elegibilidad (samples/labels) y SKU.
  let muestra: C.ElegibilidadMuestra | null = null;
  const skus = ficha || m0 ? skusDe(pid, categoria, m0?.variante ?? null, vitrina?.precio_venta_min_centavos ?? ficha?.precio_venta_min_centavos ?? null, vitrina?.con_existencias === false, r) : [];
  if (ficha || m0) {
    let estado = 'TO_APPLY';
    let puede: boolean | null = true;
    let limite: boolean | null = false;
    let aplicacion: string | null = null;
    if (m0 && GRUPOS_EN_CURSO.has(m0.grupo)) {
      estado = 'ONGOING';
      puede = false;
      aplicacion = m0.application_id;
    } else if (m0 && GRUPOS_COMPLETOS.has(m0.grupo)) {
      estado = 'COMPLETE';
      puede = r() < 0.6;
      aplicacion = m0.application_id;
    } else if (r() < 0.1) {
      limite = true;
      puede = false;
    }
    // Sin ninguna variante disponible (p. ej. agotado en tu vitrina) TikTok no deja pedir otra.
    if (puede && skus.length > 0 && skus.every((s) => s.disponible === false)) puede = false;
    muestra = {
      puede_solicitar: puede, estado, estado_texto: textoElegibilidad(puede, estado, limite), application_id: aplicacion,
      limite_alcanzado: limite, skus, consultado_at: f.ahora - (3 + Math.floor(r() * 40)) * HORA,
    };
  }

  // Solicitud recuperada desde su cumplimiento (no sale en la búsqueda de solicitudes).
  const recuperadas: C.SolicitudRecuperada[] = [];
  if (m0 && ((fila?.pedidos ?? 0) >= 50 || r() < 0.25)) {
    const otra = skus.find((s) => s.variante !== m0.variante && s.disponible) ?? skus.find((s) => s.variante !== m0.variante) ?? null;
    const cumplimiento = (fila?.videos ?? 0) > 0 ? 'SUCCEED' : 'OVERDUE';
    recuperadas.push({
      application_id: idSintetico('5770', `${pid}:recuperada`), sku_id: otra?.sku_id ?? null, variante: otra?.variante ?? null,
      tipo: 'FREE_SAMPLE', tipo_texto: TEXTO_TIPO_SOLICITUD['FREE_SAMPLE'] ?? null,
      solicitada_at: (m0.solicitada_at ?? f.ahora - 60 * DIA) - (25 + Math.floor(r() * 30)) * DIA,
      cumplimiento, cumplimiento_texto: TEXTO_CUMPLIMIENTO[cumplimiento] ?? null,
    });
  }

  // Parecidos del marketplace (solo con ficha: el hub los busca para vitrina, ventas y muestras con título).
  let parecidos: C.ParecidosProducto | null = null;
  if (ficha) {
    const p = parecidosDe(pid, titulo, categoria, ficha.comision_bp, f.catalogo, f.ahora, r);
    if (p) {
      parecidos = p.parecidos;
      for (const [url, original] of p.fuentes) {
        const m = f.metaCatalogo[original];
        if (m && !esVersionCero(url)) meta[url] = m;
      }
    }
  }

  const origen_ventas = !f.trazasSinPermiso && fila ? origenDe(fila, r) : null;
  const extendido: C.ProductoExtendido = {
    galeria, vitrina, muestra, solicitudes_recuperadas: recuperadas, planes_dirigidos: planes, comision_real, parecidos,
    origen_ventas, origen_ventas_aviso: f.trazasSinPermiso ? 'sin_permiso' : null,
  };

  // Coherencia dentro de la ficha: si está en tu vitrina, la ficha, la fila y sus muestras lo dicen.
  const conVitrina = <T extends { en_vitrina: boolean | null }>(x: T): T => (vitrina && x.en_vitrina !== true ? { ...x, en_vitrina: true } : x);
  return {
    ...d,
    meta_imagenes: meta,
    ficha: ficha ? conVitrina(ficha) : null,
    fila: fila ? conVitrina(fila) : null,
    muestras: vitrina ? d.muestras.map((m) => ({ ...m, producto: conVitrina(m.producto) })) : d.muestras,
    extendido,
  };
}
