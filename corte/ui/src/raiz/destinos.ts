/**
 * @/raiz · destinos de navegación (01 §3.2 y §3.3, 02 §7.7–7.8). Windows: barra lateral con TU TRABAJO (Inicio ·
 * Muestras · Tiendas) y ESTADÍSTICAS (Ventas · Videos · Productos). Android (y la ventana compacta): barra inferior de 5
 * (Inicio · Muestras · Tiendas · Ventas · Más), donde Videos y Productos son segmentos de Ventas. Puro.
 */
import type { NombreIcono } from '@/componentes';
import type { PlataformaUi } from '@/plataforma';
import type { ClaseAncho } from '@firmas/app';
import { T } from './textos';

export type IdDestino = 'inicio' | 'generar' | 'muestras' | 'tiendas' | 'ventas' | 'videos' | 'productos' | 'mas';

export interface DestinoNav {
  id: IdDestino;
  a: string;
  etiqueta: string;
  icono: NombreIcono;
  /** Secuencia de 01 §3.6 ('g i'); se muestra en kbd «G I» al pasar el cursor. */
  atajo: string | null;
  grupo: 'trabajo' | 'estadisticas';
}

export const DESTINOS_LATERAL: readonly DestinoNav[] = [
  { id: 'generar', a: '/videos/generar', etiqueta: T.generar, icono: 'Clapperboard', atajo: 'g g', grupo: 'trabajo' },
  { id: 'inicio', a: '/inicio', etiqueta: T.inicio, icono: 'House', atajo: 'g i', grupo: 'trabajo' },
  { id: 'muestras', a: '/muestras', etiqueta: T.muestras, icono: 'Package', atajo: 'g m', grupo: 'trabajo' },
  { id: 'tiendas', a: '/tiendas', etiqueta: T.tiendas, icono: 'Store', atajo: 'g t', grupo: 'trabajo' },
  { id: 'ventas', a: '/ventas', etiqueta: T.ventas, icono: 'ChartColumn', atajo: 'g v', grupo: 'estadisticas' },
  { id: 'videos', a: '/videos', etiqueta: T.videos, icono: 'SquarePlay', atajo: 'g d', grupo: 'estadisticas' },
  { id: 'productos', a: '/productos', etiqueta: T.productos, icono: 'Shirt', atajo: 'g p', grupo: 'estadisticas' },
];

export const DESTINOS_INFERIOR: readonly DestinoNav[] = [
  { id: 'inicio', a: '/inicio', etiqueta: T.inicio, icono: 'House', atajo: null, grupo: 'trabajo' },
  { id: 'generar', a: '/videos/generar', etiqueta: T.generar, icono: 'Clapperboard', atajo: null, grupo: 'trabajo' },
  { id: 'muestras', a: '/muestras', etiqueta: T.muestras, icono: 'Package', atajo: null, grupo: 'trabajo' },
  { id: 'tiendas', a: '/tiendas', etiqueta: T.tiendas, icono: 'Store', atajo: null, grupo: 'trabajo' },
  { id: 'ventas', a: '/ventas', etiqueta: T.ventas, icono: 'ChartColumn', atajo: null, grupo: 'estadisticas' },
  { id: 'mas', a: '/ajustes', etiqueta: T.mas, icono: 'Ellipsis', atajo: null, grupo: 'estadisticas' },
];

/** Qué destino queda activo para una ruta (con o sin barra inferior: ahí Videos y Productos cuentan como Ventas). */
export function destinoActivo(ruta: string, inferior: boolean): IdDestino | null {
  if (ruta === '/videos/generar') return 'generar';
  const primero = ruta.split('/')[1] ?? '';
  switch (primero) {
    case 'inicio':
      return 'inicio';
    case 'muestras':
      return 'muestras';
    case 'tiendas':
      return 'tiendas';
    case 'ventas':
      return 'ventas';
    case 'videos':
      return inferior ? 'ventas' : 'videos';
    case 'productos':
      return inferior ? 'ventas' : 'productos';
    case 'ajustes':
      return inferior ? 'mas' : null;
    default:
      return null;
  }
}

export type ModoNav = 'lateral' | 'riel' | 'inferior' | 'ninguna';

/**
 * C5 · compacta < 600 → barra inferior; media 600–1179 → riel de 80; expandida y amplia → lateral de 248. Android
 * siempre barra inferior en teléfono (C41: la tableta, de 600 a 1279, usa el riel). Las pantallas completas
 * (Bienvenida, Emparejar) van sin navegación; el detalle de muestra en Android trae su propia barra de acciones.
 */
export function modoNav(e: { plataforma: PlataformaUi; clase: ClaseAncho; completa: boolean; detalleMuestra: boolean }): ModoNav {
  if (e.completa) return 'ninguna';
  if (e.clase === 'compacta') return e.plataforma === 'android' && e.detalleMuestra ? 'ninguna' : 'inferior';
  if (e.clase === 'media') return 'riel';
  return e.plataforma === 'android' ? 'riel' : 'lateral';
}

/** Android: las rutas de lista de Ventas · Videos · Productos llevan el segmentado fijo (01 §3.3). */
export type SegmentoVentas = 'ventas' | 'videos' | 'productos';
export function segmentoVentas(ruta: string): SegmentoVentas | null {
  if (ruta === '/ventas') return 'ventas';
  if (ruta === '/videos') return 'videos';
  if (ruta === '/productos') return 'productos';
  return null;
}
