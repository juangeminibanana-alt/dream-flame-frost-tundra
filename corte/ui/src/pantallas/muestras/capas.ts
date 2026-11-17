/**
 * Convivencia de las capas flotantes de Muestras (botón flotante, barra de acciones del detalle) con las capas
 * globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, los avisos de @/componentes): si una
 * de ellas tapa a la nuestra, la nuestra sube lo justo para quedar encima de ella (como un aviso empuja al botón
 * flotante en Android). Las capas globales se reconocen por su marca común `data-capa-corte`; si no hay ninguna, no
 * se mueve nada. Los diálogos y hojas a pantalla completa no cuentan (tapan todo a propósito).
 */
import { useEffect, useState } from 'react';

const SEPARACION = 12;

/** Altura (px desde el borde inferior) que debe dejar libre `propio` para no quedar debajo de otra capa fija. */
export function holguraContra(propio: DOMRect, capas: readonly DOMRect[], altoVentana: number): number {
  let holgura = 0;
  for (const r of capas) {
    if (r.width < 1 || r.height < 1) continue;
    if (r.height > altoVentana * 0.7) continue; // diálogo u hoja: tapa todo a propósito
    if (r.bottom < altoVentana - 160) continue; // no está anclada abajo
    const horizontal = r.left < propio.right && r.right > propio.left;
    // Solo si de verdad se enciman (una capa que apenas toca el borde superior, como la tarjeta sobre la barra
    // inferior en Android, no mueve nada).
    const vertical = r.top < propio.bottom - 1 && r.bottom > propio.top + 1;
    if (horizontal && vertical) holgura = Math.max(holgura, Math.ceil(altoVentana - r.top + SEPARACION));
  }
  return holgura;
}

/**
 * Alto (px desde el borde superior de la ventana) que ocupan, ya pegados, los encabezados pegajosos que quedan sobre
 * `propio` (EncabezadoPantalla de @/componentes mide más que --header-h: título de 30 y un contexto que puede ir en dos
 * renglones). 0 si no hay ninguno. Sirve para que lo pegajoso de la pantalla (panel de detalle, «Hay un orden nuevo»)
 * se pegue DEBAJO del encabezado y no por detrás de él.
 */
export function altoCabezaPegajosa(propio: HTMLElement): number {
  const r = propio.getBoundingClientRect();
  let alto = 0;
  for (const h of document.querySelectorAll<HTMLElement>('header')) {
    if (h.contains(propio) || propio.contains(h)) continue;
    const s = getComputedStyle(h);
    if (s.position !== 'sticky' && s.position !== 'fixed') continue;
    const rh = h.getBoundingClientRect();
    if (rh.height < 1 || rh.height > window.innerHeight * 0.4 || rh.left >= r.right || rh.right <= r.left) continue;
    alto = Math.max(alto, (Number.parseFloat(s.top) || 0) + rh.height);
  }
  return Math.ceil(alto);
}

/**
 * Pega `el` (position: sticky) `separacion` px debajo de los encabezados pegajosos de la pantalla (altoCabezaPegajosa);
 * sin encabezado deja el `top` de su CSS. Se recalcula al cambiar el tamaño de la ventana o el DOM, una vez por cuadro.
 */
export function useTopeBajoCabeza(el: HTMLElement | null, separacion: number): void {
  useEffect(() => {
    if (!el || typeof window === 'undefined') return undefined;
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      const alto = altoCabezaPegajosa(el);
      if (alto > 0) el.style.top = `${alto + separacion}px`;
      else el.style.removeProperty('top');
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    medir();
    const o = typeof MutationObserver === 'undefined' ? null : new MutationObserver(pedir);
    o?.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', pedir);
    return () => {
      o?.disconnect();
      window.removeEventListener('resize', pedir);
      if (cuadro) window.cancelAnimationFrame(cuadro);
    };
  }, [el, separacion]);
}

/** Rectángulos de las capas globales fijas visibles (marca `data-capa-corte`), sin contar las que contienen a `propio`. */
export function capasFijas(propio: HTMLElement): DOMRect[] {
  const salida: DOMRect[] = [];
  for (const raiz of document.querySelectorAll<HTMLElement>('[data-capa-corte]')) {
    if (propio.contains(raiz) || raiz.contains(propio)) continue;
    // La marca puede estar en el contenedor (avisos) o en la capa misma (tarjeta): se miden sus hijos fijos visibles.
    const candidatos = [raiz, ...raiz.querySelectorAll<HTMLElement>(':scope > *')];
    for (const el of candidatos) {
      const s = getComputedStyle(el);
      // (La opacidad no cuenta: una capa que entra con fundido empieza en 0 y en un momento se ve.)
      if (s.visibility === 'hidden' || s.display === 'none') continue;
      if (el === raiz && s.position !== 'fixed') continue;
      salida.push(el.getBoundingClientRect());
    }
  }
  return salida;
}

/**
 * Cuánto (px) debe subir la capa `el` para no quedar debajo de otra capa fija anclada abajo: 0 si nada la tapa. Quien
 * la usa lo aplica con `--holgura` (transform: translateY(-holgura)). Se recalcula cuando cambia el DOM de la página
 * (aparece o se va una capa) y al cambiar el tamaño de la ventana, una vez por cuadro.
 */
export function useHolguraInferior(el: HTMLElement | null): number {
  const [holgura, setHolgura] = useState(0);
  useEffect(() => {
    if (!el || typeof window === 'undefined' || typeof MutationObserver === 'undefined') return undefined;
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      // Se mide en su posición de reposo (sin el desplazamiento ya aplicado) para no subir y bajar en cada medición.
      const actual = el.getBoundingClientRect();
      const aplicada = Number.parseFloat(el.style.getPropertyValue('--holgura')) || 0;
      const reposo = new DOMRect(actual.left, actual.top + aplicada, actual.width, actual.height);
      const libre = holguraContra(reposo, capasFijas(el), window.innerHeight);
      const distancia = window.innerHeight - reposo.bottom;
      setHolgura(libre > 0 ? Math.max(0, libre - distancia) : 0);
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    pedir();
    const o = new MutationObserver(pedir);
    o.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', pedir);
    // Una capa que entra con animación cambia de tamaño o lugar sin tocar el DOM: se vuelve a medir al terminar.
    document.addEventListener('animationend', pedir, true);
    document.addEventListener('transitionend', pedir, true);
    return () => {
      o.disconnect();
      window.removeEventListener('resize', pedir);
      document.removeEventListener('animationend', pedir, true);
      document.removeEventListener('transitionend', pedir, true);
      if (cuadro) window.cancelAnimationFrame(cuadro);
    };
  }, [el]);
  return holgura;
}
