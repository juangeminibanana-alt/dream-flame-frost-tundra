/**
 * Convivencia de la banda fija «¿Le enviaste el mensaje a {tienda}?» (TarjetaConfirmarAviso, 01 §3.5) con el resto de
 * la app:
 *   · no sale en las rutas a pantalla completa (bienvenida y emparejar): ahí no hay nada que confirmar todavía y
 *     tapaba el botón «Conectar»;
 *   · mientras se ve, declara su alto en --avisos-extra (en el celular y en ventanas de menos de 600, los avisos de
 *     @/componentes suben sobre ella en vez de encimarse; tokens de Toasts.module.css);
 *   · si un aviso u otra capa global anclada abajo (marca común `data-capa-corte`, fuera de diálogos, menús y tooltips)
 *     cae encima de ella —Windows angosto, donde la banda y los avisos se acercan—, la banda sube lo justo (--subir).
 */
import { useEffect } from 'react';

/** Rutas a pantalla completa donde la banda no se muestra (tabla de rutas de BUILD_SPEC §8.6: `completa`). */
export const RUTAS_SIN_BANDA: readonly string[] = ['/bienvenida', '/emparejar'];

export function rutaSinBanda(ruta: string): boolean {
  return RUTAS_SIN_BANDA.some((r) => ruta === r || ruta.startsWith(`${r}/`));
}

/** Separación entre la banda y lo que sube sobre ella (o ella sobre lo demás). */
export const SEPARACION_BANDA = 8;

/** Capas que tapan a propósito o que flotan junto a un elemento (no empujan a la banda). */
const NO_EMPUJAN = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="tooltip"], [role="listbox"]';

/**
 * Cuánto (px) debe subir `banda` (medida en reposo) para no quedar debajo de otra capa fija anclada abajo. 0 si nada la
 * tapa. Se exporta para las pruebas.
 */
export function subidaContra(banda: { top: number; bottom: number; left: number; right: number }, capas: readonly DOMRect[], altoVentana: number): number {
  let subir = 0;
  for (const c of capas) {
    if (c.width < 1 || c.height < 1) continue;
    if (c.height > altoVentana * 0.5) continue; // panel u hoja grande: no es un aviso
    if (c.bottom < altoVentana - 200) continue; // no está anclada abajo
    const horizontal = c.left < banda.right && c.right > banda.left;
    const vertical = c.top < banda.bottom - 1 && c.bottom > banda.top + 1;
    if (horizontal && vertical) subir = Math.max(subir, Math.ceil(banda.bottom - c.top + SEPARACION_BANDA));
  }
  return subir;
}

function capasQueEmpujan(propia: HTMLElement): DOMRect[] {
  const salida: DOMRect[] = [];
  for (const capa of document.querySelectorAll<HTMLElement>('[data-capa-corte]')) {
    if (capa === propia || capa.contains(propia) || propia.contains(capa)) continue;
    if (capa.matches(NO_EMPUJAN) || capa.querySelector(NO_EMPUJAN)) continue;
    const s = getComputedStyle(capa);
    if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') continue;
    salida.push(capa.getBoundingClientRect());
  }
  return salida;
}

/** Aplica --avisos-extra (en <html>) y --subir (en la banda) mientras `banda` está montada y `activa`. */
export function useConvivenciaBanda(banda: HTMLElement | null, activa: boolean): void {
  useEffect(() => {
    if (!banda || !activa || typeof window === 'undefined') return undefined;
    const raiz = document.documentElement;
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      const aplicada = Number.parseFloat(banda.style.getPropertyValue('--subir')) || 0;
      const r = banda.getBoundingClientRect();
      if (r.height > 0) raiz.style.setProperty('--avisos-extra', `${Math.ceil(r.height + SEPARACION_BANDA)}px`);
      // Se mide en su lugar de reposo (sin la subida ya aplicada) para no subir y bajar en cada medición.
      const reposo = { top: r.top + aplicada, bottom: r.bottom + aplicada, left: r.left, right: r.right };
      const subir = subidaContra(reposo, capasQueEmpujan(banda), window.innerHeight);
      if (subir !== aplicada) banda.style.setProperty('--subir', `${subir}px`);
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    medir();
    const mutaciones = typeof MutationObserver === 'undefined' ? null : new MutationObserver(pedir);
    mutaciones?.observe(document.body, { childList: true, subtree: true });
    const tamano = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(pedir);
    tamano?.observe(banda);
    window.addEventListener('resize', pedir);
    // Un aviso que entra con animación cambia de lugar sin tocar el DOM: se vuelve a medir al terminar.
    document.addEventListener('animationend', pedir, true);
    document.addEventListener('transitionend', pedir, true);
    return () => {
      mutaciones?.disconnect();
      tamano?.disconnect();
      window.removeEventListener('resize', pedir);
      document.removeEventListener('animationend', pedir, true);
      document.removeEventListener('transitionend', pedir, true);
      if (cuadro) window.cancelAnimationFrame(cuadro);
      raiz.style.removeProperty('--avisos-extra');
      banda.style.removeProperty('--subir');
    };
  }, [banda, activa]);
}
