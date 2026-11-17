/**
 * @/raiz · búsqueda global de la paleta Ctrl+K (01 §3.5, 02 §7.10): busca en muestras (producto, tienda, variante),
 * tiendas, productos, videos (content_id y título o producto) y acciones. Ignora acentos y mayúsculas
 * (dominio.coincide). Resultados agrupados, con imagen. Puro: sin React ni red (las listas las trae consultar()).
 */
import type { FilaProducto, FilaTienda, FilaVideo, MuestraVista, UrlImagen } from '@/contrato';
import type { NombreIcono } from '@/componentes';
import { coincide, formato, nombreCorto } from '@/dominio';
import { T } from './textos';

export type IdAccionPaleta = 'sincronizar' | 'plan' | 'avisar' | 'sesion' | 'generar' | 'emparejar' | 'reautorizar' | 'ventas';

export interface AccionPaleta {
  id: IdAccionPaleta;
  etiqueta: string;
  icono: NombreIcono;
  /** Palabras extra que también la encuentran. */
  claves: string;
}

/** Acciones de 01 §3.5, en su orden. Reautorizar no existe en Android (C35); emparejar va a la pantalla del celular. */
export function accionesPaleta(e: { android: boolean; puedeSincronizar: boolean; puedeReautorizar: boolean }): AccionPaleta[] {
  const todas: Array<AccionPaleta | null> = [
    e.puedeSincronizar ? { id: 'sincronizar', etiqueta: T.accionSincronizar, icono: 'RefreshCw', claves: 'actualizar tiktok datos' } : null,
    { id: 'plan', etiqueta: T.accionPlan, icono: 'CalendarDays', claves: 'plan agenda fechas' },
    { id: 'avisar', etiqueta: T.accionAvisar, icono: 'MessageCircle', claves: 'mensaje tiendas aviso' },
    { id: 'sesion', etiqueta: T.accionSesion, icono: 'Clapperboard', claves: 'grabar videos enfoque' },
    { id: 'generar', etiqueta: T.accionGenerar, icono: 'Sparkles', claves: 'generar video ugc product hold corte 10s' },
    { id: 'emparejar', etiqueta: T.accionEmparejar, icono: 'Smartphone', claves: 'celular telefono qr pc' },
    e.puedeReautorizar && !e.android ? { id: 'reautorizar', etiqueta: T.accionReautorizar, icono: 'Link', claves: 'conexion autorizacion cuenta' } : null,
    { id: 'ventas', etiqueta: T.accionVentas, icono: 'ChartColumn', claves: 'comision pedidos dinero' },
  ];
  return todas.filter((a): a is AccionPaleta => a !== null);
}

export type TipoResultado = 'accion' | 'muestra' | 'tienda' | 'producto' | 'video';

export interface ResultadoPaleta {
  /** Único en toda la lista (para aria-activedescendant). */
  id: string;
  tipo: TipoResultado;
  titulo: string;
  detalle: string;
  /** Foto del producto o portada del video. */
  imagen: UrlImagen | null;
  /** Para el mosaico de respaldo y el avatar de tienda. */
  tienda: string | null;
  categoria: string | null;
  icono: NombreIcono | null;
  /** Ruta hash a la que lleva (sin '#') o acción a ejecutar. */
  destino: { tipo: 'ruta'; a: string } | { tipo: 'accion'; accion: IdAccionPaleta };
}

export interface GrupoPaleta {
  id: TipoResultado;
  titulo: string;
  resultados: ResultadoPaleta[];
}

export interface FuentesPaleta {
  muestras: readonly MuestraVista[];
  tiendas: readonly FilaTienda[];
  productos: readonly FilaProducto[];
  videos: readonly FilaVideo[];
}

export const MAX_POR_GRUPO = 5;

function enc(s: string): string {
  return encodeURIComponent(s);
}

/** Muestras: producto (título corto o completo), tienda y variante. */
function deMuestra(m: MuestraVista): ResultadoPaleta {
  const nombre = m.producto.titulo_corto ?? nombreCorto(m.producto.titulo);
  return {
    id: `muestra-${m.application_id}`,
    tipo: 'muestra',
    titulo: nombre || formato.idCorto(m.application_id),
    detalle: [m.tienda.nombre, m.variante, m.etiqueta].filter((x): x is string => !!x).join(' · '),
    imagen: m.producto.imagen,
    tienda: m.tienda.nombre,
    categoria: m.producto.categoria,
    icono: null,
    destino: { tipo: 'ruta', a: `/muestras/m/${enc(m.application_id)}` },
  };
}

function deTienda(t: FilaTienda): ResultadoPaleta {
  return {
    id: `tienda-${t.tienda_key}`,
    tipo: 'tienda',
    titulo: t.nombre,
    detalle: t.salud_porque,
    imagen: null,
    tienda: t.nombre,
    categoria: null,
    icono: null,
    destino: { tipo: 'ruta', a: `/tiendas/${enc(t.tienda_key)}` },
  };
}

function deProducto(p: FilaProducto): ResultadoPaleta {
  const nombre = p.titulo_corto ?? nombreCorto(p.titulo);
  return {
    id: `producto-${p.product_id}`,
    tipo: 'producto',
    titulo: nombre || formato.idCorto(p.product_id),
    detalle: [p.tienda_nombre, `${formato.dinero(p.comision_estimada_centavos)} de comisión`].filter((x): x is string => !!x).join(' · '),
    imagen: p.imagen,
    tienda: p.tienda_nombre,
    categoria: null,
    icono: null,
    destino: { tipo: 'ruta', a: `/productos/${enc(p.product_id)}` },
  };
}

function deVideo(v: FilaVideo, nombreProducto: string | null): ResultadoPaleta {
  return {
    id: `video-${v.content_id}`,
    tipo: 'video',
    titulo: v.titulo ?? nombreProducto ?? T.videoSinTitulo(formato.idCorto(v.content_id)),
    detalle: [v.tienda_principal, `${formato.dinero(v.comision_estimada_centavos)} de comisión`].filter((x): x is string => !!x).join(' · '),
    imagen: v.miniatura,
    tienda: v.tienda_principal,
    categoria: null,
    icono: null,
    destino: { tipo: 'ruta', a: `/videos/${enc(v.content_id)}` },
  };
}

function deAccion(a: AccionPaleta): ResultadoPaleta {
  return {
    id: `accion-${a.id}`,
    tipo: 'accion',
    titulo: a.etiqueta,
    detalle: '',
    imagen: null,
    tienda: null,
    categoria: null,
    icono: a.icono,
    destino: { tipo: 'accion', accion: a.id },
  };
}

/**
 * Resultados agrupados para `consulta`. Sin texto: solo las acciones. Con texto: acciones que coinciden y hasta
 * `max` resultados por grupo, en el orden de las listas (las muestras ya vienen por prioridad; tiendas, productos y
 * videos por comisión). Grupos vacíos se omiten.
 */
export function buscarEnPaleta(consulta: string, fuentes: FuentesPaleta, acciones: readonly AccionPaleta[], max: number = MAX_POR_GRUPO): GrupoPaleta[] {
  const q = consulta.trim();
  const grupos: GrupoPaleta[] = [];
  const accionesQ = q ? acciones.filter((a) => coincide(q, a.etiqueta, a.claves)) : acciones.slice();
  if (!q) return accionesQ.length ? [{ id: 'accion', titulo: T.grupoAcciones, resultados: accionesQ.map(deAccion) }] : [];

  const muestras: ResultadoPaleta[] = [];
  for (const m of fuentes.muestras) {
    if (muestras.length >= max) break;
    if (coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante, m.application_id)) muestras.push(deMuestra(m));
  }
  const tiendas: ResultadoPaleta[] = [];
  for (const t of fuentes.tiendas) {
    if (tiendas.length >= max) break;
    if (coincide(q, t.nombre, t.tienda_key)) tiendas.push(deTienda(t));
  }
  const productos: ResultadoPaleta[] = [];
  const nombrePorImagen = new Map<string, string>();
  for (const p of fuentes.productos) {
    const nombre = p.titulo_corto ?? nombreCorto(p.titulo);
    if (p.imagen && nombre) nombrePorImagen.set(p.imagen, nombre);
    if (productos.length >= max) continue;
    if (coincide(q, p.titulo_corto, p.titulo, p.tienda_nombre, p.product_id)) productos.push(deProducto(p));
  }
  const videos: ResultadoPaleta[] = [];
  for (const v of fuentes.videos) {
    if (videos.length >= max) break;
    // El título de oEmbed ya no existe (C4): el video se reconoce por su content_id y por el producto de su portada.
    const producto = v.miniatura ? (nombrePorImagen.get(v.miniatura) ?? null) : null;
    if (coincide(q, v.titulo, producto, v.content_id, v.tienda_principal)) videos.push(deVideo(v, producto));
  }

  if (accionesQ.length) grupos.push({ id: 'accion', titulo: T.grupoAcciones, resultados: accionesQ.map(deAccion) });
  if (muestras.length) grupos.push({ id: 'muestra', titulo: T.grupoMuestras, resultados: muestras });
  if (tiendas.length) grupos.push({ id: 'tienda', titulo: T.grupoTiendas, resultados: tiendas });
  if (productos.length) grupos.push({ id: 'producto', titulo: T.grupoProductos, resultados: productos });
  if (videos.length) grupos.push({ id: 'video', titulo: T.grupoVideos, resultados: videos });
  return grupos;
}

/** Lista plana en el orden en que se pintan (para ↑/↓). */
export function aplanar(grupos: readonly GrupoPaleta[]): ResultadoPaleta[] {
  return grupos.flatMap((g) => g.resultados);
}
