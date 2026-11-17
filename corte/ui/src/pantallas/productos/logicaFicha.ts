/**
 * Lógica de presentación de la FICHA COMPLETA de producto (contrato rev. 4, 15/11: ProductoDetalleResponse.extendido).
 * Funciones puras sobre los tipos del contrato: qué se muestra de comisión (plan abierto, planes dirigidos y la tasa que
 * de verdad pagaron tus pedidos), de precio (lista, vitrina, descuento de TikTok Shop y lo que pagaron tus compradores),
 * de la muestra (elegibilidad y variantes), del origen de las ventas y el orden de los parecidos. Cada parte devuelve
 * null cuando no hay nada que decir: la sección se oculta entera. Sin React.
 */
import type * as C from '@/contrato';
import type { NombreIcono, TonoEstado } from '@/componentes';

/** Planes dirigidos que se listan en la sección de comisión (el resto se cuenta: «y 2 planes más»). */
export const MAX_PLANES = 3;
/** Variantes para muestra que se ven sin pulsar «Ver las N». */
export const MAX_SKUS = 6;

export function extendidoDe(d: C.ProductoDetalleResponse): C.ProductoExtendido | null {
  return d.extendido ?? null;
}

// ---------------------------------------------------------------------------------------------- comisión

export interface VistaComision {
  /** Plan abierto vigente (ficha de open_collaborations o, sin ficha, el que reporta comision_real). */
  abierto: { bp: C.PuntosBase; porVentaMin: C.Centavos | null; porVentaMax: C.Centavos | null } | null;
  /** Hasta MAX_PLANES planes dirigidos (el hub ya los manda activos primero y de mayor comisión a menor). */
  dirigidos: C.PlanDirigido[];
  /** Planes dirigidos que no se listan. */
  dirigidosOcultos: number;
  real: C.ComisionReal | null;
  /** La tasa más común de tus pedidos (= por_tasa[0]). */
  principal: C.TasaComisionReal | null;
  /** tasa principal − plan abierto, en puntos base (null sin alguno de los dos). */
  diferenciaBp: number | null;
  /** Pedidos que llegaron con una campaña de la tienda. */
  conCampana: number;
}

export function vistaComision(d: C.ProductoDetalleResponse): VistaComision | null {
  const x = extendidoDe(d);
  const ficha = d.ficha;
  const real = x?.comision_real ?? null;
  const principal = real?.por_tasa[0] ?? null;
  let abierto: VistaComision['abierto'] = null;
  if (ficha && ficha.en_colaboracion_abierta && ficha.comision_bp !== null) {
    abierto = { bp: ficha.comision_bp, porVentaMin: ficha.comision_por_venta_centavos, porVentaMax: ficha.comision_por_venta_max_centavos };
  } else if (real?.plan_abierto_bp != null) {
    abierto = { bp: real.plan_abierto_bp, porVentaMin: null, porVentaMax: null };
  }
  const todos = x?.planes_dirigidos ?? [];
  if (!abierto && todos.length === 0 && !real) return null;
  return {
    abierto,
    dirigidos: todos.slice(0, MAX_PLANES),
    dirigidosOcultos: Math.max(0, todos.length - MAX_PLANES),
    real,
    principal,
    diferenciaBp: real && abierto ? real.tasa_principal_bp - abierto.bp : null,
    conCampana: real ? real.por_tasa.reduce((s, t) => s + t.lineas_con_campana, 0) : 0,
  };
}

/** Puntos porcentuales de una diferencia en puntos base: 400 → 4 · 250 → 2.5. */
export function puntosDe(bp: number): number {
  return Math.round(Math.abs(bp)) / 100;
}

// ---------------------------------------------------------------------------------------------- precio

export type Rango = readonly [C.Centavos, C.Centavos];

export interface VistaPrecio {
  /** true = los precios son de tu vitrina (showcases/products); false = de la ficha (precio de venta ≈). */
  deVitrina: boolean;
  lista: Rango | null;
  venta: Rango | null;
  /** Con el descuento de la plataforma (solo vitrina). */
  plataforma: Rango | null;
  /** Lo más bajo que se paga hoy contra el precio de lista (0..1); null si no hay descuento que valga decir. */
  descuento: number | null;
  /** Lo que pagaron tus compradores por unidad, en promedio (ventas ÷ unidades de tus pedidos). */
  promedio: C.Centavos | null;
  unidades: number;
  /** status.inventory_status de la vitrina (true = con existencias, false = agotado). */
  existencias: boolean | null;
  oculto: boolean;
}

function rango(min: C.Centavos | null, max: C.Centavos | null): Rango | null {
  if (min === null && max === null) return null;
  const a = min ?? max ?? 0;
  const b = max ?? min ?? 0;
  return a <= b ? [a, b] : [b, a];
}

export function vistaPrecio(d: C.ProductoDetalleResponse): VistaPrecio | null {
  const v = extendidoDe(d)?.vitrina ?? null;
  const ficha = d.ficha;
  if (!v && !ficha) return null;
  const lista = v ? rango(v.precio_lista_min_centavos, v.precio_lista_max_centavos) ?? (ficha ? rango(ficha.precio_min_centavos, ficha.precio_max_centavos) : null)
    : ficha ? rango(ficha.precio_min_centavos, ficha.precio_max_centavos) : null;
  const venta = v ? rango(v.precio_venta_min_centavos, v.precio_venta_max_centavos)
    : ficha ? rango(ficha.precio_venta_min_centavos, ficha.precio_venta_max_centavos) : null;
  // Si el precio de venta ≈ de la ficha es el mismo de lista, no se repite.
  const ventaUtil = !v && venta && lista && venta[0] === lista[0] && venta[1] === lista[1] ? null : venta;
  const plataforma = v ? rango(v.precio_plataforma_min_centavos, v.precio_plataforma_max_centavos) : null;
  const plataformaUtil = plataforma && ventaUtil && plataforma[0] >= ventaUtil[0] && plataforma[1] >= ventaUtil[1] ? null : plataforma;
  const fila = d.fila;
  const promedio = fila && fila.unidades > 0 && fila.ventas_centavos > 0 ? Math.round(fila.ventas_centavos / fila.unidades) : null;
  const final = plataformaUtil?.[0] ?? ventaUtil?.[0] ?? null;
  const descuento = lista && final !== null && lista[0] > 0 && final < lista[0] ? 1 - final / lista[0] : null;
  if (!lista && !ventaUtil && !plataformaUtil) return null;
  return {
    deVitrina: !!v,
    lista,
    venta: ventaUtil,
    plataforma: plataformaUtil,
    descuento: descuento !== null && descuento >= 0.05 ? descuento : null,
    promedio,
    unidades: fila?.unidades ?? 0,
    existencias: v?.con_existencias ?? null,
    oculto: v?.oculto === true,
  };
}

// ---------------------------------------------------------------------------------------------- muestra

export interface EstiloEstado { tono: TonoEstado; icono: NombreIcono }

/** Chip del estado de samples/labels: en proceso (info), puedes pedir (ok), límite (ámbar), no se puede (neutro). */
export function estiloElegibilidad(m: C.ElegibilidadMuestra): EstiloEstado {
  if (m.estado === 'ONGOING') return { tono: 'info', icono: 'Hourglass' };
  if (m.estado === 'COMPLETE') return { tono: 'neutro', icono: 'CircleCheckBig' };
  if (m.limite_alcanzado) return { tono: 'atencion', icono: 'CircleAlert' };
  if (m.puede_solicitar === true) return { tono: 'ok', icono: 'Check' };
  if (m.puede_solicitar === false) return { tono: 'neutro', icono: 'Ban' };
  return { tono: 'neutro', icono: 'CircleHelp' };
}

/** «Puedes pedir otra»: ya la pediste (o se completó) y TikTok dice que puedes volver a pedir. */
export function puedePedirOtra(m: C.ElegibilidadMuestra): boolean {
  return m.puede_solicitar === true && (m.estado === 'COMPLETE' || m.application_id !== null);
}

/** Tono del motivo de una variante que no se puede pedir: agotado en ámbar, «ya la pediste» en info, lo demás neutro. */
export function estiloSku(s: C.SkuMuestra): EstiloEstado | null {
  if (s.disponible !== false) return null;
  if (s.motivo_no_disponible === 'OUT_OF_STOCK') return { tono: 'atencion', icono: 'CircleMinus' };
  if (s.motivo_no_disponible === 'ALREADY_APPLYED') return { tono: 'info', icono: 'Check' };
  return { tono: 'neutro', icono: 'Ban' };
}

/** Tono del cumplimiento de una solicitud recuperada. */
export function estiloCumplimiento(c: string | null): EstiloEstado {
  switch (c) {
    case 'SUCCEED':
    case 'REPEATED':
    case 'EXEMPTED':
      return { tono: 'ok', icono: 'CircleCheckBig' };
    case 'OVERDUE':
    case 'FAILED':
      return { tono: 'atencion', icono: 'CircleAlert' };
    case 'PENDING':
    case 'ONGOING':
      return { tono: 'info', icono: 'Clock' };
    default:
      return { tono: 'neutro', icono: 'CircleMinus' };
  }
}

export function resumenSkus(skus: readonly C.SkuMuestra[]): { disponibles: number; total: number } {
  return { disponibles: skus.filter((s) => s.disponible === true).length, total: skus.length };
}

/** ¿Hay algo de la muestra que decir (además de las muestras de la búsqueda)? */
export function hayMuestraExtendida(d: C.ProductoDetalleResponse): boolean {
  const x = extendidoDe(d);
  return !!x && (x.muestra !== null || x.solicitudes_recuperadas.length > 0);
}

// ---------------------------------------------------------------------------------------------- origen

/** 'datos' = hay origen de ventas · 'aviso' = falta el permiso (solo se dice si el producto tiene ventas) · null. */
export function estadoOrigen(d: C.ProductoDetalleResponse): 'datos' | 'aviso' | null {
  const x = extendidoDe(d);
  if (!x) return null;
  if (x.origen_ventas && x.origen_ventas.lineas > 0) return 'datos';
  if (x.origen_ventas_aviso === 'sin_permiso' && (d.fila?.pedidos ?? 0) > 0) return 'aviso';
  return null;
}

// ---------------------------------------------------------------------------------------------- parecidos

export type CriterioParecidos = 'comision' | 'vendidos';

const menosInfinito = (n: number | null): number => (n === null ? Number.NEGATIVE_INFINITY : n);

/** Copia ordenada: por comisión (tasa, luego monto por venta, luego vendidos) o por vendidos (luego tasa). Estable. */
export function ordenarParecidos(items: readonly C.ProductoParecido[], criterio: CriterioParecidos): C.ProductoParecido[] {
  const conIndice = items.map((x, i) => ({ x, i }));
  conIndice.sort((a, b) => {
    const porComision = menosInfinito(b.x.comision_bp) - menosInfinito(a.x.comision_bp)
      || menosInfinito(b.x.comision_por_venta_centavos) - menosInfinito(a.x.comision_por_venta_centavos);
    const porVendidos = menosInfinito(b.x.unidades_vendidas_global) - menosInfinito(a.x.unidades_vendidas_global);
    const d = criterio === 'comision' ? porComision || porVendidos : porVendidos || porComision;
    return Number.isNaN(d) || d === 0 ? a.i - b.i : d;
  });
  return conIndice.map((c) => c.x);
}
