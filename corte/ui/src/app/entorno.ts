/**
 * @/app · entorno de desarrollo (BUILD_SPEC §8.1, §8.7). Los parámetros `?tema=`, `?densidad=` y `?buscar=` de la
 * URL se aceptan antes del hash (`/?tema=claro#/inicio`) o dentro de él (`#/inicio?tema=claro`). Los de apariencia
 * (`tema`, `densidad`) solo cuentan en `npm run dev:demo` (import.meta.env.DEV && VITE_DEMO === '1'): en `vite build`
 * esa rama desaparece.
 */

/** true en `npm run dev:demo`. Nunca en `vite build`. */
export function modoDemo(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_DEMO === '1';
}

/** Valor de un parámetro de la URL (antes del hash o dentro de él), o null. */
export function parametroUrl(nombre: string): string | null {
  if (typeof window === 'undefined') return null;
  const listas = [new URLSearchParams(window.location.search)];
  const hash = window.location.hash;
  const i = hash.indexOf('?');
  if (i >= 0) listas.push(new URLSearchParams(hash.slice(i + 1)));
  for (const p of listas) {
    const v = p.get(nombre);
    if (v !== null && v !== '') return v;
  }
  return null;
}

/** Parámetro de desarrollo: solo en el modo demo; si no, siempre null. */
export function parametroDesarrollo(nombre: string): string | null {
  return modoDemo() ? parametroUrl(nombre) : null;
}

/** localStorage que nunca truena (ventana privada, almacenamiento bloqueado o pruebas sin DOM). */
export const almacen = {
  leer(clave: string): string | null {
    try {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(clave);
    } catch {
      return null;
    }
  },
  escribir(clave: string, valor: string): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(clave, valor);
    } catch {
      /* almacenamiento bloqueado: se queda en memoria */
    }
  },
  borrar(clave: string): void {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(clave);
    } catch {
      /* almacenamiento bloqueado */
    }
  },
};
