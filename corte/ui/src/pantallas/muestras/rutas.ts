/** Rutas hash que usan las vistas de Muestras (BUILD §8.6, 01 §3.1). */
export const RUTA_PENDIENTES = '/muestras';
export const RUTA_TODAS = '/muestras/todas';
export const RUTA_PLAN = '/muestras/plan';
export const RUTA_AVISOS = '/muestras/avisos';
export const RUTA_SESION = '/muestras/sesion';

export function rutaDetalle(id: string): string {
  return `/muestras/m/${encodeURIComponent(id)}`;
}

export function rutaTienda(tiendaKey: string): string {
  return `/tiendas/${encodeURIComponent(tiendaKey)}`;
}

/** «Avisar a estas tiendas» (01 §4.2): Avisar a mis tiendas limitado a una selección (?tiendas=k1,k2). */
export function rutaAvisarTiendas(claves: readonly string[]): string {
  const unicas = [...new Set(claves)];
  return `${RUTA_AVISOS}?tiendas=${unicas.map((k) => encodeURIComponent(k)).join(',')}`;
}
