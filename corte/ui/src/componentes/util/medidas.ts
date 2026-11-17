/** Medición de elementos con ResizeObserver y memoria de scroll por clave (02 §7.6). */
import { useLayoutEffect, useState, type RefObject } from 'react';

export interface Tamano {
  ancho: number;
  alto: number;
}

/**
 * Ancho y alto del elemento (0 mientras no se mide). Además de la primera medida síncrona y del ResizeObserver, vuelve
 * a medir dos cuadros después del montaje: si el contenedor todavía no tenía su ancho final al montarse (ruta perezosa,
 * fuentes, una captura con captureBeyondViewport) y el observador no llegó a avisar, la gráfica no se queda con el
 * ancho de respaldo dentro de un área más ancha.
 */
export function useTamano(ref: RefObject<HTMLElement | null>): Tamano {
  const [t, setT] = useState<Tamano>({ ancho: 0, alto: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const medir = (): void => {
      const r = el.getBoundingClientRect();
      setT((previo) => (previo.ancho === r.width && previo.alto === r.height ? previo : { ancho: r.width, alto: r.height }));
    };
    medir();
    let cuadro = 0;
    if (typeof requestAnimationFrame === 'function') {
      cuadro = requestAnimationFrame(() => {
        medir();
        cuadro = requestAnimationFrame(medir);
      });
    }
    const o = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(medir);
    o?.observe(el);
    return () => {
      if (cuadro && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(cuadro);
      o?.disconnect();
    };
  }, [ref]);
  return t;
}

const memoriaScroll = new Map<string, number>();

export function guardarScroll(clave: string | undefined, y: number): void {
  if (!clave) return;
  memoriaScroll.set(clave, y);
  if (memoriaScroll.size > 100) {
    const vieja = memoriaScroll.keys().next();
    if (!vieja.done) memoriaScroll.delete(vieja.value);
  }
}

export function leerScroll(clave: string | undefined): number | null {
  if (!clave) return null;
  return memoriaScroll.get(clave) ?? null;
}

/** Valor en px de una variable CSS (p. ej. --row-h, que puede ser calc()) medido en el elemento. */
export function pxDeVariable(el: Element | null, variable: string, respaldo: number): number {
  if (!el || typeof getComputedStyle === 'undefined') return respaldo;
  const sonda = document.createElement('div');
  sonda.style.position = 'absolute';
  sonda.style.visibility = 'hidden';
  sonda.style.height = `var(${variable})`;
  el.appendChild(sonda);
  const alto = sonda.getBoundingClientRect().height;
  el.removeChild(sonda);
  if (alto > 0) return alto;
  const crudo = Number.parseFloat(getComputedStyle(el).getPropertyValue(variable));
  return Number.isFinite(crudo) && crudo > 0 ? crudo : respaldo;
}
