/**
 * @/app · tabla de rutas de BUILD_SPEC §8.6 (sin React): patrones con parámetros con nombre (':id', ':key', ':seccion'),
 * módulo de pantallas que atiende cada uno y su exportación según spec/ui_firmas/pantallas.d.ts. La usan el router
 * (navegacion.ts), la carga perezosa (rutas.tsx) y el marco (raiz/). El orden importa: la primera que coincide gana.
 */
import type {
  ModuloAjustes, ModuloBienvenida, ModuloEmparejar, ModuloFlujos, ModuloGaleria, ModuloGaleriaBloques, ModuloInicio,
  ModuloMuestras, ModuloProductos, ModuloTiendas, ModuloVentas, ModuloVideos,
} from '@firmas/pantallas';

/** Módulo de cada carpeta (o galería) con lo que exporta según pantallas.d.ts. */
export interface Modulos {
  inicio: ModuloInicio;
  ventas: ModuloVentas;
  muestras: ModuloMuestras;
  flujos: ModuloFlujos;
  tiendas: ModuloTiendas;
  videos: ModuloVideos;
  productos: ModuloProductos;
  ajustes: ModuloAjustes;
  bienvenida: ModuloBienvenida;
  emparejar: ModuloEmparejar;
  'galeria-componentes': ModuloGaleria;
  'galeria-bloques': ModuloGaleriaBloques;
}
export type NombreModulo = keyof Modulos;

interface DefRutaDe<M extends NombreModulo> {
  /** Patrón con parámetros con nombre (':id', ':key', ':seccion'). */
  patron: string;
  modulo: M;
  exporta: Extract<keyof Modulos[M], string>;
  /** Título accesible de respaldo (la pantalla pone el suyo con <Pantalla titulo>). */
  titulo: string;
  /** Pantalla completa, fuera de la navegación (01 §3.1: Bienvenida, Emparejar). */
  completa?: boolean;
  /** Solo en desarrollo (galerías). */
  soloDev?: boolean;
}
export type DefRuta = { [M in NombreModulo]: DefRutaDe<M> }[NombreModulo];

/** BUILD_SPEC §8.6. */
export const TABLA_RUTAS: readonly DefRuta[] = [
  { patron: '/inicio', modulo: 'inicio', exporta: 'PantallaInicio', titulo: 'Inicio' },
  { patron: '/muestras', modulo: 'muestras', exporta: 'PantallaMuestras', titulo: 'Muestras' },
  { patron: '/muestras/m/:id', modulo: 'muestras', exporta: 'PantallaMuestras', titulo: 'Muestra' },
  { patron: '/muestras/todas', modulo: 'muestras', exporta: 'PantallaMuestrasTodas', titulo: 'Todas tus muestras' },
  { patron: '/muestras/agenda', modulo: 'flujos', exporta: 'PantallaAgenda', titulo: 'Agenda' },
  { patron: '/muestras/plan', modulo: 'flujos', exporta: 'PantallaArmarPlan', titulo: 'Armar mi plan' },
  { patron: '/muestras/sesion', modulo: 'flujos', exporta: 'PantallaSesion', titulo: 'Sesión de videos' },
  { patron: '/muestras/avisos', modulo: 'flujos', exporta: 'PantallaAvisar', titulo: 'Avisar a mis tiendas' },
  { patron: '/tiendas', modulo: 'tiendas', exporta: 'PantallaTiendas', titulo: 'Tiendas' },
  { patron: '/tiendas/:key', modulo: 'tiendas', exporta: 'PantallaTienda', titulo: 'Tienda' },
  { patron: '/ventas', modulo: 'ventas', exporta: 'PantallaVentas', titulo: 'Ventas' },
  { patron: '/videos', modulo: 'videos', exporta: 'PantallaVideos', titulo: 'Videos' },
  { patron: '/videos/generar', modulo: 'videos', exporta: 'PantallaGenerar', titulo: 'Generar video' },
  { patron: '/videos/:id', modulo: 'videos', exporta: 'PantallaVideo', titulo: 'Video' },
  { patron: '/productos', modulo: 'productos', exporta: 'PantallaProductos', titulo: 'Productos' },
  { patron: '/productos/:id', modulo: 'productos', exporta: 'PantallaProducto', titulo: 'Producto' },
  { patron: '/ajustes', modulo: 'ajustes', exporta: 'PantallaAjustes', titulo: 'Conexión y ajustes' },
  { patron: '/ajustes/:seccion', modulo: 'ajustes', exporta: 'PantallaAjustes', titulo: 'Conexión y ajustes' },
  { patron: '/bienvenida', modulo: 'bienvenida', exporta: 'PantallaBienvenida', titulo: 'Bienvenida', completa: true },
  { patron: '/emparejar', modulo: 'emparejar', exporta: 'PantallaEmparejar', titulo: 'Emparejar con tu PC', completa: true },
  { patron: '/dev/galeria', modulo: 'galeria-componentes', exporta: 'GaleriaComponentes', titulo: 'Galería de componentes', soloDev: true },
  { patron: '/dev/bloques', modulo: 'galeria-bloques', exporta: 'GaleriaBloques', titulo: 'Galería de bloques', soloDev: true },
];

export interface RutaResuelta {
  /** Sin '#' ni consulta, normalizada ('/muestras/m/807…'); '/' para el hash vacío. */
  ruta: string;
  def: DefRuta | null;
  params: Readonly<Record<string, string>>;
  consulta: URLSearchParams;
}

function decodificar(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** Separa '#/muestras/m/8071?vista=tablero' en ruta normalizada y consulta. */
export function partirHash(hash: string): { ruta: string; consulta: URLSearchParams } {
  let h = hash.startsWith('#') ? hash.slice(1) : hash;
  const i = h.indexOf('?');
  const consulta = new URLSearchParams(i >= 0 ? h.slice(i + 1) : '');
  h = i >= 0 ? h.slice(0, i) : h;
  if (!h.startsWith('/')) h = `/${h}`;
  h = h.replace(/\/{2,}/g, '/');
  if (h.length > 1 && h.endsWith('/')) h = h.slice(0, -1);
  return { ruta: h, consulta };
}

/** Empareja una ruta con la tabla de §8.6 y saca los parámetros con nombre (decodificados). */
export function resolverRuta(hash: string, tabla: readonly DefRuta[] = TABLA_RUTAS): RutaResuelta {
  const { ruta, consulta } = partirHash(hash);
  const segmentos = ruta.split('/').slice(1);
  for (const def of tabla) {
    if (def.soloDev && !import.meta.env.DEV) continue;
    const partes = def.patron.split('/').slice(1);
    if (partes.length !== segmentos.length) continue;
    const params: Record<string, string> = {};
    let ok = true;
    for (let k = 0; k < partes.length; k++) {
      const p = partes[k] ?? '';
      const s = segmentos[k] ?? '';
      if (p.startsWith(':')) {
        if (s === '') {
          ok = false;
          break;
        }
        params[p.slice(1)] = decodificar(s);
      } else if (p !== s) {
        ok = false;
        break;
      }
    }
    if (ok) return { ruta, def, params, consulta };
  }
  return { ruta, def: null, params: {}, consulta };
}
