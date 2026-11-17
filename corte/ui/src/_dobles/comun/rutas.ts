/* __DOBLE_CORTE__ · tabla de rutas de BUILD_SPEC §8.6 para los dobles de @/app (parámetros) y @/raiz (pantalla).
   La tabla real la escribe ui-marco en ui/src/app/rutas.tsx. */

export interface DefRuta {
  /** Patrón con parámetros ':id', ':key', ':seccion'. */
  patron: string;
  /** Carpeta de ui/src/pantallas/ (o 'galeria-componentes' / 'galeria-bloques' en desarrollo). */
  modulo: string;
  /** Nombre exportado por el módulo (spec/ui_firmas/pantallas.d.ts). */
  exporta: string;
  titulo: string;
}

export const TABLA_RUTAS: readonly DefRuta[] = [
  { patron: '/', modulo: 'inicio', exporta: 'PantallaInicio', titulo: 'Inicio' },
  { patron: '/inicio', modulo: 'inicio', exporta: 'PantallaInicio', titulo: 'Inicio' },
  { patron: '/muestras', modulo: 'muestras', exporta: 'PantallaMuestras', titulo: 'Muestras' },
  { patron: '/muestras/m/:id', modulo: 'muestras', exporta: 'PantallaMuestras', titulo: 'Muestra' },
  { patron: '/muestras/todas', modulo: 'muestras', exporta: 'PantallaMuestrasTodas', titulo: 'Todas las muestras' },
  { patron: '/muestras/agenda', modulo: 'flujos', exporta: 'PantallaAgenda', titulo: 'Agenda' },
  { patron: '/muestras/plan', modulo: 'flujos', exporta: 'PantallaArmarPlan', titulo: 'Armar mi plan' },
  { patron: '/muestras/sesion', modulo: 'flujos', exporta: 'PantallaSesion', titulo: 'Sesión de videos' },
  { patron: '/muestras/avisos', modulo: 'flujos', exporta: 'PantallaAvisar', titulo: 'Avisar a mis tiendas' },
  { patron: '/tiendas', modulo: 'tiendas', exporta: 'PantallaTiendas', titulo: 'Tiendas' },
  { patron: '/tiendas/:key', modulo: 'tiendas', exporta: 'PantallaTienda', titulo: 'Tienda' },
  { patron: '/ventas', modulo: 'ventas', exporta: 'PantallaVentas', titulo: 'Ventas' },
  { patron: '/videos', modulo: 'videos', exporta: 'PantallaVideos', titulo: 'Videos' },
  { patron: '/videos/:id', modulo: 'videos', exporta: 'PantallaVideo', titulo: 'Video' },
  { patron: '/productos', modulo: 'productos', exporta: 'PantallaProductos', titulo: 'Productos' },
  { patron: '/productos/:id', modulo: 'productos', exporta: 'PantallaProducto', titulo: 'Producto' },
  { patron: '/ajustes', modulo: 'ajustes', exporta: 'PantallaAjustes', titulo: 'Conexión y ajustes' },
  { patron: '/ajustes/:seccion', modulo: 'ajustes', exporta: 'PantallaAjustes', titulo: 'Conexión y ajustes' },
  { patron: '/bienvenida', modulo: 'bienvenida', exporta: 'PantallaBienvenida', titulo: 'Bienvenida' },
  { patron: '/emparejar', modulo: 'emparejar', exporta: 'PantallaEmparejar', titulo: 'Conectar con tu PC' },
  { patron: '/dev/galeria', modulo: 'galeria-componentes', exporta: 'GaleriaComponentes', titulo: 'Galería de componentes' },
  { patron: '/dev/bloques', modulo: 'galeria-bloques', exporta: 'GaleriaBloques', titulo: 'Galería de bloques' },
];

export interface RutaResuelta {
  ruta: string;
  def: DefRuta | null;
  params: Record<string, string>;
  consulta: URLSearchParams;
}

function decodificar(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** '#/muestras/m/8071?vista=tablero' → ruta, parámetros con nombre y consulta. */
export function resolverHash(hash: string): RutaResuelta {
  let h = hash.startsWith('#') ? hash.slice(1) : hash;
  const i = h.indexOf('?');
  const consulta = new URLSearchParams(i >= 0 ? h.slice(i + 1) : '');
  h = i >= 0 ? h.slice(0, i) : h;
  if (!h.startsWith('/')) h = `/${h}`;
  if (h.length > 1 && h.endsWith('/')) h = h.slice(0, -1);
  const segmentos = h.split('/').slice(1);
  for (const def of TABLA_RUTAS) {
    const partes = def.patron.split('/').slice(1);
    if (def.patron === '/') {
      if (h === '/') return { ruta: h, def, params: {}, consulta };
      continue;
    }
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
    if (ok) return { ruta: h, def, params, consulta };
  }
  return { ruta: h, def: null, params: {}, consulta };
}
