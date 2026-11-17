/**
 * Convivencia con las capas globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, los avisos
 * de @/componentes): todas llevan la marca común `data-capa-corte`. Mientras una está fija abajo, el final de Ventas
 * deja un espacio de su mismo alto para que lo último de la página (la paginación de pedidos) pueda subir por encima de ella y nunca
 * quede tapado. Sin capas, el espacio es 0. Los diálogos y hojas a pantalla completa no cuentan (tapan a propósito).
 */
import { useEffect, useState } from 'react';

/** Una capa fija medida (solo lo que hace falta de DOMRect, para probarlo sin DOM). */
export interface CajaCapa {
  top: number;
  bottom: number;
  height: number;
  width: number;
}

/** Alto (px) que hay que dejar libre al final de la página: el de la capa anclada abajo más alta; 0 si no hay. */
export function holguraCapas(capas: readonly CajaCapa[], altoVentana: number): number {
  let holgura = 0;
  for (const r of capas) {
    if (r.width < 1 || r.height < 1) continue;
    if (r.height > altoVentana * 0.7) continue; // diálogo u hoja: tapa todo a propósito
    if (r.bottom < altoVentana - 160) continue; // no está anclada abajo
    holgura = Math.max(holgura, Math.ceil(r.height));
  }
  return holgura;
}

function capasFijas(propio: HTMLElement): CajaCapa[] {
  const salida: CajaCapa[] = [];
  for (const el of document.querySelectorAll<HTMLElement>('[data-capa-corte]')) {
    if (propio.contains(el)) continue;
    // La marca puede estar en la capa misma (tarjeta) o en su contenedor (avisos): se miden ella y sus hijos fijos.
    for (const c of [el, ...el.querySelectorAll<HTMLElement>(':scope > *')]) {
      const s = getComputedStyle(c);
      if (s.visibility === 'hidden' || s.display === 'none' || s.position !== 'fixed') continue;
      salida.push(c.getBoundingClientRect());
    }
  }
  return salida;
}

/**
 * Holgura inferior para el elemento `el` (la raíz de la pantalla). Se recalcula cuando cambia el DOM (aparece o se va
 * una capa), al cambiar el tamaño de la ventana y al terminar una animación, una vez por cuadro.
 */
export function useHolguraCapas(el: HTMLElement | null): number {
  const [holgura, setHolgura] = useState(0);
  useEffect(() => {
    if (!el || typeof window === 'undefined' || typeof MutationObserver === 'undefined') return undefined;
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      const nueva = holguraCapas(capasFijas(el), window.innerHeight);
      setHolgura((previa) => (previa === nueva ? previa : nueva));
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    pedir();
    const o = new MutationObserver(pedir);
    o.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', pedir);
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
