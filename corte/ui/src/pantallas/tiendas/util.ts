/**
 * Utilidades de interacción de Tiendas. `useClicReciente` distingue el clic (abre) de J/K (solo mueve la selección):
 * la Tabla llama alSeleccionar en ambos casos y la pantalla solo abre cuando hubo un puntero hace un momento.
 */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export type Desborde = 'derecha' | 'izquierda' | 'ambos' | null;

/** Qué lados de una fila desplazable quedan fuera de vista (para desvanecer solo esos). Sin medida (happy-dom): null. */
export function ladoDesbordado(scrollLeft: number, clientWidth: number, scrollWidth: number): Desborde {
  if (!(clientWidth > 0) || scrollWidth - clientWidth <= 1) return null;
  const izquierda = scrollLeft > 1;
  const derecha = scrollLeft + clientWidth < scrollWidth - 1;
  return izquierda && derecha ? 'ambos' : izquierda ? 'izquierda' : derecha ? 'derecha' : null;
}

/** Mide la fila (ResizeObserver + scroll) y devuelve `ref` y el lado desbordado para `data-desborde`. `clave` cambia
 *  cuando cambian los hijos (p. ej. los conteos de los chips) para volver a medir. */
export function useDesborde(clave?: unknown): { ref: (el: HTMLElement | null) => void; desborde: Desborde } {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [desborde, setDesborde] = useState<Desborde>(null);
  const ref = useCallback((nodo: HTMLElement | null) => setEl(nodo), []);
  useLayoutEffect(() => {
    if (!el) return undefined;
    const medir = (): void => setDesborde(ladoDesbordado(el.scrollLeft, el.clientWidth, el.scrollWidth));
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    const o = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(medir);
    o?.observe(el);
    for (const hijo of Array.from(el.children)) o?.observe(hijo);
    return () => {
      el.removeEventListener('scroll', medir);
      o?.disconnect();
    };
  }, [el, clave]);
  return { ref, desborde };
}

const VENTANA_MS = 700;

export function useClicReciente(): { alPuntero: () => void; fueClic: () => boolean } {
  const ultimo = useRef(0);
  const alPuntero = useCallback(() => {
    ultimo.current = Date.now();
  }, []);
  const fueClic = useCallback(() => Date.now() - ultimo.current < VENTANA_MS, []);
  return { alPuntero, fueClic };
}

/** Une clases (las de CSS Modules llegan como string | undefined con noUncheckedIndexedAccess). */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
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
