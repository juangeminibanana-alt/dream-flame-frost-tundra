/**
 * Utilidades de interacción de Videos. `useClicReciente` distingue el clic (abre) de J/K (solo mueve la selección):
 * la Tabla llama alSeleccionar en ambos casos y la pantalla solo abre cuando hubo un puntero hace un momento.
 */
import { useCallback, useRef } from 'react';

const VENTANA_MS = 700;

export function useClicReciente(): { alPuntero: () => void; fueClic: () => boolean } {
  const ultimo = useRef(0);
  const alPuntero = useCallback(() => {
    ultimo.current = Date.now();
  }, []);
  const fueClic = useCallback(() => Date.now() - ultimo.current < VENTANA_MS, []);
  return { alPuntero, fueClic };
}

/** Lee y escribe en localStorage sin romper si no hay almacenamiento (ventana privada, vista previa). */
export function leerLocal(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
}

export function guardarLocal(clave: string, valor: string): void {
  try {
    window.localStorage.setItem(clave, valor);
  } catch {
    /* sin almacenamiento: la preferencia dura lo que la vista */
  }
}

/** Une clases (las de CSS Modules llegan como string | undefined con noUncheckedIndexedAccess). */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

export const rutaVideo =(id: string): string => `/videos/${encodeURIComponent(id)}`;
export const rutaProducto = (id: string): string => `/productos/${encodeURIComponent(id)}`;
export const rutaMuestra = (id: string): string => `/muestras/m/${encodeURIComponent(id)}`;
export const rutaTienda = (key: string): string => `/tiendas/${encodeURIComponent(key)}`;
