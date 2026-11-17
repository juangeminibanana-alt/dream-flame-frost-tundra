/**
 * Celular (02 §5.3): «La acción principal ("Armar mi plan") queda dentro del primer pliegue en 390×844 y en 360×800
 * con la escala de texto al 130 %, incluida la barra de estado». La foto 1:1 de la siguiente muestra es la protagonista,
 * pero con texto grande, una pantalla baja o un aviso global arriba (sin conexión, demostración) empujaba el botón bajo
 * la barra inferior. Aquí se calcula cuánto puede medir de alto la foto para que el botón quepa: si cabe entera, queda
 * 1:1; si no, baja de alto (recorte «cover», mismo ancho) hasta un mínimo del 60 % del ancho, y por debajo de eso se
 * deja que el botón quede a un desplazamiento (como al 200 %, sin recortar nada).
 */
import { useLayoutEffect, useState } from 'react';
import { capasFijas, type CajaCapa } from './capas';

/** Separación que se deja entre el botón y la barra inferior. */
export const MARGEN_PLIEGUE = 12;
/** La foto nunca baja de este tanto de su ancho (≈ 196 px a 326 de ancho). */
export const MINIMO_FOTO = 0.6;

export interface GeometriaFoto {
  /** Borde superior de la barra fija de abajo (o el alto de la ventana), en px de la ventana. */
  pliegue: number;
  /** Borde superior de la foto con la página arriba del todo (sin desplazar), en px de la ventana. */
  topFoto: number;
  /** Distancia del pie de la foto al pie del botón principal. */
  debajo: number;
  /** Ancho de la foto (= su alto natural, 1:1). */
  ancho: number;
}

/** Alto de la foto (px) para que el botón quepa; null = cabe 1:1, sin tocarla. */
export function altoFotoQueCabe(g: GeometriaFoto): number | null {
  if (!(g.ancho > 0)) return null;
  const cabe = Math.floor(g.pliegue - MARGEN_PLIEGUE - g.topFoto - g.debajo);
  if (cabe >= g.ancho) return null;
  return Math.max(Math.round(g.ancho * MINIMO_FOTO), cabe);
}

/** Foto ajustada (celular): desde aquí el velo lleva 1 chip y el nombre en 2 renglones; por debajo, «baja». */
export const ALTO_VELO_MEDIO = 240;

/**
 * Cómo se aprieta el velo «Siguiente» de una foto que cedió alto, para que nunca suba por encima de la foto:
 * sin ajuste, 2 chips en total (02 §5.3: el provisional, si aplica, + 1 razón; si no, 2 razones); «media», 1 chip;
 * «baja» (< 240 px), el nombre en un renglón y sin chips de razón. «Orden provisional: faltan tus ventas» nunca se
 * esconde (01 §4.1): con 1 chip, es ese.
 */
export function veloAjustado(alto: number | null, provisional: boolean): { nivel: 'media' | 'baja' | null; chips: 0 | 1 | 2 } {
  if (alto === null) return { nivel: null, chips: 2 };
  const nivel = alto >= ALTO_VELO_MEDIO ? 'media' : 'baja';
  return { nivel, chips: nivel === 'media' || provisional ? 1 : 0 };
}

/**
 * Pliegue efectivo: el borde superior de la barra inferior o, si está más arriba, el de una capa global anclada abajo
 * que cubre el ancho (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, marcada con data-capa-corte). Así el botón
 * principal queda a la vista también mientras esa tarjeta está abierta. Los diálogos y hojas a pantalla completa, las
 * capas angostas y las que no están ancladas abajo no cuentan (mismo criterio que capas.ts).
 */
export function pliegueConCapas(barra: number, capas: readonly CajaCapa[], altoVentana: number, anchoVentana: number): number {
  let pliegue = barra;
  for (const r of capas) {
    if (r.height < 1 || r.width < anchoVentana * 0.6) continue;
    if (r.height > altoVentana * 0.7) continue;
    if (r.bottom < altoVentana - 160) continue;
    pliegue = Math.min(pliegue, Math.floor(r.top));
  }
  return pliegue;
}

/** Borde superior de la barra fija que tapa el pie de la ventana (la barra inferior del celular); si no hay, el alto. */
function pliegueInferior(): number {
  const alto = window.innerHeight;
  const ancho = window.innerWidth;
  if (typeof document.elementsFromPoint !== 'function') return alto;
  for (const el of document.elementsFromPoint(ancho / 2, alto - 2)) {
    for (let p: Element | null = el; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const posicion = getComputedStyle(p).position;
      if (posicion !== 'fixed' && posicion !== 'sticky') continue;
      const r = p.getBoundingClientRect();
      if (r.top > alto * 0.6 && r.width > ancho * 0.6) return r.top;
    }
  }
  return alto;
}

/** Cuánto está desplazada la página (ventana y contenedores con scroll) por encima de `el`. */
function desplazamiento(el: HTMLElement): number {
  let s = window.scrollY;
  for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) s += p.scrollTop;
  return s;
}

/**
 * Alto de la foto protagonista en celular. `contenedor` = el panel del héroe; dentro busca la foto
 * (`[data-foto-heroe]`) y el botón principal (`[data-cta]`). Se recalcula al cambiar el tamaño de la ventana, al
 * cambiar el alto de la página (avisos que aparecen arriba, escala de texto) y al cargar las fuentes, una vez por cuadro.
 * El cálculo no depende del alto actual de la foto (solo de su borde superior y de lo que hay debajo), así que es estable.
 */
export function useAltoFotoQueCabe(contenedor: HTMLElement | null, activo: boolean): number | null {
  const [alto, setAlto] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (!activo || !contenedor || typeof window === 'undefined') {
      setAlto(null);
      return undefined;
    }
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      const foto = contenedor.querySelector<HTMLElement>('[data-foto-heroe]');
      const cta = contenedor.querySelector<HTMLElement>('[data-cta]');
      if (!foto || !cta) return;
      const rf = foto.getBoundingClientRect();
      const rc = cta.getBoundingClientRect();
      const pliegue = pliegueConCapas(pliegueInferior(), capasFijas(contenedor), window.innerHeight, window.innerWidth);
      const nuevo = altoFotoQueCabe({ pliegue, topFoto: rf.top + desplazamiento(foto), debajo: rc.bottom - rf.bottom, ancho: rf.width });
      setAlto((previo) => (previo === nuevo ? previo : nuevo));
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('resize', pedir);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(pedir);
    ro?.observe(document.documentElement);
    ro?.observe(contenedor);
    // Una capa global que aparece o se va (data-capa-corte) no cambia el alto de la página: se vigila el DOM y el fin
    // de sus animaciones, como en capas.ts.
    const mo = typeof MutationObserver === 'undefined' ? null : new MutationObserver(pedir);
    mo?.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('animationend', pedir, true);
    document.addEventListener('transitionend', pedir, true);
    void document.fonts?.ready.then(pedir);
    return () => {
      window.removeEventListener('resize', pedir);
      ro?.disconnect();
      mo?.disconnect();
      document.removeEventListener('animationend', pedir, true);
      document.removeEventListener('transitionend', pedir, true);
      if (cuadro) window.cancelAnimationFrame(cuadro);
    };
  }, [contenedor, activo]);
  return alto;
}
