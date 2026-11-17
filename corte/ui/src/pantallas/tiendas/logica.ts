/**
 * Lógica de presentación de Tiendas (01_ux §4.9, §4.10, §2.7 y §6.2). Funciones puras sobre los tipos del contrato:
 * vistas (chips), orden, búsqueda, KPI del detalle y promesas. Sin React.
 */
import type * as C from '@/contrato';
import type { OrdenTiendas } from '@/datos';
import type { ColumnaTabla } from '@/componentes';
import { coincide, esPendiente, formato, nombreCorto, normalizarTitulo } from '@/dominio';
import type { ReglaColumnas } from './ajusteColumnas';
import { T } from './textos';

// ---------------------------------------------------------------------------------------------- tablas (02 §7.5)

/** Qué columnas de columnasTiendas() se quedan cuando no caben todas (01 §4.9: tienda, salud y pendientes siempre). */
export const REGLA_COLUMNAS: ReglaColumnas = {
  prioridad: ['tienda', 'salud', 'pendientes', 'comision', 'aviso', 'participacion', 'productos', 'ultima', 'valor', 'recibidas', 'entregadas'],
  fijas: ['tienda', 'salud', 'pendientes'],
  minimos: { tienda: 200 },
};

/** columnasMuestras('tienda') cuando no caben todas: producto, estado en TikTok, tu avance y promesa primero (el botón
 *  de la acción ya está en «Planear las {n}» y la fila abre la muestra). */
export const REGLA_MUESTRAS: ReglaColumnas = {
  prioridad: ['producto', 'tiktok', 'avance', 'promesa', 'solicitada', 'accion', 'precio'],
  fijas: ['producto'],
  minimos: { producto: 220 },
};

/** Anchos para que el encabezado se lea completo (02 §7.5): «% de tu comisión (90 días)» lleva su periodo (01 §1.5). */
const ANCHOS_ENCABEZADO: Readonly<Record<string, number>> = { participacion: 188, productos: 96 };

export function conAnchosDeEncabezado<T>(columnas: readonly ColumnaTabla<T>[]): ColumnaTabla<T>[] {
  return columnas.map((c) => {
    const ancho = ANCHOS_ENCABEZADO[c.id];
    return ancho !== undefined ? { ...c, ancho } : c;
  });
}

export type VistaTiendas =
  | 'con_relacion' | 'atencion' | 'por_avisar' | 'promesas_vencidas' | 'con_plan' | 'socios' | 'al_dia'
  | 'vende_contigo' | 'solo_solicitudes' | 'solo_reembolsos';

interface DefVista {
  id: VistaTiendas;
  incluye: (t: C.FilaTienda) => boolean;
  /** Solo se muestra el chip si hay al menos una tienda (01 §4.9: «solo si > 0»). */
  soloSiHay: boolean;
}

/** Orden de la salud (01 §2.7, el mismo con que el hub ordena por atención). */
export const ORDEN_SALUD: readonly C.SaludTienda[] = [
  'socio_con_pendientes', 'con_pendientes', 'con_plan', 'socio', 'al_dia', 'vende_contigo', 'solo_solicitudes', 'solo_reembolsos',
];

const SIN_RELACION: ReadonlySet<C.SaludTienda> = new Set(['solo_solicitudes', 'solo_reembolsos']);

/** Chips de vista en el orden de 01 §4.9. */
export const VISTAS: readonly DefVista[] = [
  { id: 'con_relacion', incluye: (t) => !SIN_RELACION.has(t.salud), soloSiHay: false },
  { id: 'atencion', incluye: (t) => t.salud === 'socio_con_pendientes' || t.salud === 'con_pendientes', soloSiHay: false },
  { id: 'por_avisar', incluye: (t) => t.por_avisar, soloSiHay: false },
  { id: 'promesas_vencidas', incluye: (t) => t.promesas.vencidas > 0, soloSiHay: true },
  { id: 'con_plan', incluye: (t) => t.salud === 'con_plan', soloSiHay: true },
  { id: 'socios', incluye: (t) => t.es_socio, soloSiHay: false },
  { id: 'al_dia', incluye: (t) => t.salud === 'al_dia', soloSiHay: false },
  { id: 'vende_contigo', incluye: (t) => t.salud === 'vende_contigo', soloSiHay: false },
  { id: 'solo_solicitudes', incluye: (t) => t.salud === 'solo_solicitudes', soloSiHay: false },
  { id: 'solo_reembolsos', incluye: (t) => t.salud === 'solo_reembolsos', soloSiHay: false },
];

export function esVista(v: string | null): v is VistaTiendas {
  return v !== null && VISTAS.some((d) => d.id === v);
}

export function esOrden(v: string | null): v is OrdenTiendas {
  return v === 'atencion' || v === 'comision' || v === 'deuda' || v === 'nombre';
}

export interface ConteoVista { id: VistaTiendas; n: number }

/** Conteo de cada vista; quita las de «solo si > 0» que no tienen tiendas (salvo la activa). */
export function conteosVistas(tiendas: readonly C.FilaTienda[], activa: VistaTiendas): ConteoVista[] {
  return VISTAS.map((d) => ({ id: d.id, n: tiendas.filter(d.incluye).length, soloSiHay: d.soloSiHay }))
    .filter((c) => !c.soloSiHay || c.n > 0 || c.id === activa)
    .map(({ id, n }) => ({ id, n }));
}

export function filtrarVista(tiendas: readonly C.FilaTienda[], vista: VistaTiendas): C.FilaTienda[] {
  const def = VISTAS.find((d) => d.id === vista) ?? VISTAS[0];
  return def ? tiendas.filter(def.incluye) : [...tiendas];
}

export function buscarTiendas(tiendas: readonly C.FilaTienda[], q: string): C.FilaTienda[] {
  const texto = q.trim();
  if (!texto) return [...tiendas];
  return tiendas.filter((t) => coincide(texto, t.nombre, t.tienda_key));
}

const porNombre = (a: C.FilaTienda, b: C.FilaTienda): number => a.nombre.localeCompare(b.nombre, 'es-MX', { sensitivity: 'base' });

/** Orden estable de 01 §4.9 y 03 §5.9 (atención = promesas vencidas → salud → comisión de 180 días). */
export function ordenarTiendas(tiendas: readonly C.FilaTienda[], orden: OrdenTiendas): C.FilaTienda[] {
  const copia = [...tiendas];
  const salud = (t: C.FilaTienda): number => ORDEN_SALUD.indexOf(t.salud);
  switch (orden) {
    case 'atencion':
      return copia.sort((a, b) =>
        b.promesas.vencidas - a.promesas.vencidas
        || salud(a) - salud(b)
        || b.ventas.comision_180d_centavos - a.ventas.comision_180d_centavos
        || porNombre(a, b));
    case 'comision':
      return copia.sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos || porNombre(a, b));
    case 'deuda':
      return copia.sort((a, b) =>
        b.muestras.pendientes - a.muestras.pendientes
        || b.muestras.valor_debido_centavos - a.muestras.valor_debido_centavos
        || porNombre(a, b));
    case 'nombre':
      return copia.sort(porNombre);
  }
}

export interface ResumenTiendas { relacion: number; conPendientes: number; socios: number; porAvisar: number }

/** Contexto del encabezado: «24 tiendas con las que tienes relación · 10 con pendientes · 3 socios». */
export function resumenTiendas(tiendas: readonly C.FilaTienda[]): ResumenTiendas {
  return {
    relacion: tiendas.filter((t) => !SIN_RELACION.has(t.salud)).length,
    conPendientes: tiendas.filter((t) => t.muestras.pendientes > 0).length,
    socios: tiendas.filter((t) => t.es_socio).length,
    porAvisar: tiendas.filter((t) => t.por_avisar).length,
  };
}

// ---------------------------------------------------------------------------------------------- detalle

/**
 * Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
 * en MAYÚSCULAS); normalizarTitulo es de la capa de vista, así que se aplica aquí. Sin corto, el nombre corto del título.
 */
export function nombreVisible(corto: string | null | undefined, titulo: string | null): string {
  const c = corto?.replace(/\s+/g, ' ').trim();
  return c ? normalizarTitulo(c) : nombreCorto(titulo);
}

/** La muestra con el nombre corto del producto normalizado, para los bloques que lo pintan tal cual (TarjetaMuestra y
 *  columnasMuestras de la tabla). */
export function muestraConNombre(m: C.MuestraVista): C.MuestraVista {
  const c = m.producto.titulo_corto;
  if (!c || !c.trim()) return m;
  const n = nombreVisible(c, m.producto.titulo);
  return n === c ? m : { ...m, producto: { ...m.producto, titulo_corto: n } };
}

/** Meses de la gráfica en el celular: con más de 6 columnas en ~300 px, los rótulos del extremo pisan a la vecina. */
export const MESES_GRAFICA_ANGOSTA = 6;

/** Los últimos `n` puntos (la tabla gemela conserva todos). */
export function ultimosPuntos<P>(serie: readonly P[], n: number): P[] {
  return serie.length > n ? serie.slice(serie.length - n) : [...serie];
}

/**
 * «% de tu comisión · 90 días» del KPI (T2 de 01 §6.2). Entero en KPI (01 §1.5) salvo que redondeado diera «0 %» a una
 * tienda que sí te generó comisión ($8 de $10,000 = 0.08 %): debajo del 10 % lleva un decimal y, si ni así llega a
 * 0.1 %, «< 0.1 %». null si no te generó nada en 90 días (la pantalla pone «—»).
 */
export function participacionKpi(p: number): string | null {
  if (!(p > 0)) return null;
  if (p < 0.0005) return `< ${formato.porcentaje(0.001, 1)}`;
  return formato.porcentaje(p, p < 0.1 ? 1 : 0);
}

export interface PedidosTienda {
  pedidos: number;
  reembolsados: number;
  /** false si la serie no vino (copia del celular): entonces `pedidos` son los válidos de la fila. */
  completos: boolean;
}

/** T3 de 01 §6.2: pedidos distintos con alguna línea de la tienda y cuántos se reembolsaron (de la serie mensual). */
export function pedidosTienda(detalle: C.TiendaDetalleResponse): PedidosTienda {
  if (detalle.serie.length === 0) return { pedidos: detalle.tienda.ventas.pedidos_validos, reembolsados: 0, completos: false };
  let pedidos = 0;
  let reembolsados = 0;
  for (const p of detalle.serie) {
    pedidos += p.pedidos;
    reembolsados += p.pedidos_reembolsados;
  }
  return { pedidos, reembolsados, completos: true };
}

export interface SeccionesMuestras {
  pendientes: C.MuestraVista[];
  cumplidas: C.MuestraVista[];
  historial: C.MuestraVista[];
}

/** «Lo que le debes» (pendientes en orden de cola), «Lo que ya cumpliste» y el historial completo (más reciente primero). */
export function seccionesMuestras(muestras: readonly C.MuestraVista[]): SeccionesMuestras {
  const pendientes = muestras.filter(esPendiente).sort((a, b) =>
    (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER));
  const cumplidas = muestras.filter((m) => m.grupo === 'entregada' || m.grupo === 'exenta' || m.avance.etapa === 'publicada');
  const historial = [...muestras].sort((a, b) => (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0));
  return { pendientes, cumplidas, historial };
}

export type EstadoPromesa = 'vigente' | 'vencida' | 'cumplida';
export interface PromesaVista {
  avisoId: string;
  solicitud: string;
  fecha: C.FechaLocal;
  estado: EstadoPromesa;
  /** Fecha en que se publicó (solo cumplida). */
  cumplidaEl: C.FechaLocal | null;
  muestra: C.MuestraVista | null;
}
export interface AvisoVista { aviso: C.AvisoTienda; promesas: PromesaVista[] }

/** «Lo que le prometiste» (01 §4.10 punto 4): avisos enviados y no quitados, cada fecha con su estado. */
export function avisosConPromesas(avisos: readonly C.AvisoTienda[], muestras: readonly C.MuestraVista[], hoy: C.FechaLocal): AvisoVista[] {
  const porId = new Map(muestras.map((m) => [m.application_id, m]));
  return avisos
    .filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null)
    .sort((a, b) => (b.marcado_enviado_at ?? 0) - (a.marcado_enviado_at ?? 0))
    .map((aviso) => ({
      aviso,
      promesas: Object.entries(aviso.compromisos).map(([solicitud, fecha]): PromesaVista => {
        const m = porId.get(solicitud) ?? null;
        const publicada = m?.avance.etapa === 'publicada' ? m.avance.fecha_publicada ?? fecha : null;
        const estado: EstadoPromesa = publicada !== null ? 'cumplida' : hoy > fecha ? 'vencida' : 'vigente';
        return { avisoId: aviso.id, solicitud, fecha, estado, cumplidaEl: publicada, muestra: m };
      }),
    }));
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
 * Serie mensual CONTINUA para la gráfica: el hub solo manda los meses con pedidos, y una tienda que vendió en febrero
 * y en septiembre saldría con dos columnas juntas, como si fueran meses seguidos. Rellena con ceros los meses sin
 * pedidos desde el primero hasta el mes en curso (así también se ve que dejó de vender). Si la serie no trae claves
 * 'YYYY-MM' no la toca. Tope de 10 años para no generar de más con una clave rara.
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

/** Mes con más comisión (para la nota de la gráfica); null sin serie o sin ventas. */
export function mejorMes(serie: readonly C.PuntoSerie[]): C.PuntoSerie | null {
  let mejor: C.PuntoSerie | null = null;
  for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
  return mejor;
}

/** Videos cuya tienda principal es esta (por comisión), para «Videos que más venden sus productos». */
export function videosDeTienda(videos: readonly C.FilaVideo[], nombre: string, limite = 6): C.FilaVideo[] {
  const clave = nombre.trim().toLocaleLowerCase('es-MX');
  return videos
    .filter((v) => (v.tienda_principal ?? '').trim().toLocaleLowerCase('es-MX') === clave && v.pedidos_validos > 0)
    .sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos)
    .slice(0, limite);
}

/** C4: con imagen, la portada de un video siempre es la foto del producto (miniatura_origen 'producto' u omitido). */
export function portadaDelProducto(v: Pick<C.FilaVideo, 'miniatura' | 'miniatura_origen'>): boolean {
  return v.miniatura !== null && v.miniatura_origen !== null;
}

/** product_id de la portada '/img/p/<id>?v=…' (también bajo /lan/v1/img/…); null si no es de producto. */
export function productoDePortada(url: C.UrlImagen | null): string | null {
  if (!url) return null;
  const m = /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url);
  return m?.[1] ?? null;
}
