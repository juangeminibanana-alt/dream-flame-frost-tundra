/**
 * Convivencia de los flujos con las capas globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques,
 * los avisos de @/componentes; todas llevan la marca común `data-capa-corte`). Dos piezas:
 *
 * BarraFija · barra de acciones pegada abajo (botón inferior fijo «Siguiente» de 01 §4.5, las acciones de la Sesión y
 * su entrada, el botón flotante de la Agenda). Es `position: sticky` (no fixed): convive con la animación de entrada de
 * la pantalla y se asienta al final del contenido. Si una capa la taparía:
 *   - si la capa ocupa solo un lado (escritorio: la tarjeta va abajo a la derecha) y del otro lado caben los botones,
 *     la barra se queda en su lugar y sus botones se recorren hacia el lado libre (relleno de ese lado);
 *   - si no caben (celular o tableta: la tarjeta ocupa todo el ancho), la barra SIGUE FIJA y se apila justo encima de
 *     la capa (`data-esquiva="subir"`: su `bottom` de sticky crece lo que invade la capa más 12 px de aire). Así
 *     «Video listo» o «Siguiente» quedan a un toque en el primer pliegue aunque la tarjeta esté abierta.
 *   La decisión se toma con la barra en su sitio pegada abajo, sin importar cuánto se haya desplazado la página: así no
 *   oscila entre los dos modos al desplazar.
 *
 * ReservaCapas · espaciador al final de cada pantalla de flujos: mientras una capa anclada abajo se cruza con la
 * pantalla, deja libre lo que la capa invade del borde inferior para que lo último de la página (y la barra en su lugar
 * natural) se pueda desplazar por encima de ella y ningún botón quede tapado. Sin capas mide 0 y no ocupa lugar.
 */
import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cx, vars } from './util';
import css from './flujos.module.css';

/** Aire entre la capa y lo que se apila o termina encima de ella (12 px). */
export const SEPARACION = 12;

interface Caja {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
export interface CajaCapa extends Caja {
  width: number;
  height: number;
}

/** Cómo esquivar las capas: subir la barra (`arriba`) o recorrer sus botones con relleno a la izquierda o a la derecha. */
export interface Holgura {
  arriba: number;
  izquierda: number;
  derecha: number;
}
export const SIN_HOLGURA: Holgura = { arriba: 0, izquierda: 0, derecha: 0 };

/** La capa cuenta: visible, anclada abajo y no casi de pantalla completa (un diálogo u hoja tapan todo a propósito). */
function capaAnclada(r: CajaCapa, altoVentana: number): boolean {
  if (r.width < 1 || r.height < 1) return false;
  if (r.height > altoVentana * 0.7) return false;
  return r.bottom >= altoVentana - 200;
}

/**
 * `propio` = la barra en reposo; `minimo` = el ancho que necesitan sus botones (con sus huecos y su relleno base).
 * Una capa que no está anclada abajo, que es casi de pantalla completa (diálogo u hoja) o que no se cruza con la barra
 * no cuenta.
 */
export function holguraContra(propio: Caja, capas: ReadonlyArray<CajaCapa>, altoVentana: number, minimo = Number.POSITIVE_INFINITY): Holgura {
  const h: Holgura = { ...SIN_HOLGURA };
  let subida = 0;
  for (const r of capas) {
    if (!capaAnclada(r, altoVentana)) continue;
    const horizontal = r.left < propio.right && r.right > propio.left;
    const vertical = r.top < propio.bottom - 1 && r.bottom > propio.top + 1;
    if (!horizontal || !vertical) continue;
    subida = Math.max(subida, Math.ceil(propio.bottom - r.top + SEPARACION));
    const libreIzquierda = r.left - propio.left - SEPARACION;
    const libreDerecha = propio.right - r.right - SEPARACION;
    if (libreIzquierda >= minimo) h.derecha = Math.max(h.derecha, Math.ceil(propio.right - r.left + SEPARACION));
    else if (libreDerecha >= minimo) h.izquierda = Math.max(h.izquierda, Math.ceil(r.right - propio.left + SEPARACION));
    else h.arriba = subida;
  }
  // Si alguna capa obliga a subir, o dos capas (una a cada lado) juntas no dejan lugar, se sube sobre todas.
  if (h.arriba > 0 || (h.izquierda > 0 && h.derecha > 0 && propio.right - propio.left - h.izquierda - h.derecha < minimo)) {
    return { arriba: subida, izquierda: 0, derecha: 0 };
  }
  return h;
}

/**
 * La holgura final: primero con la barra PEGADA ABAJO (su sitio fijo en la ventana, `pegada`), que no depende del
 * desplazamiento; si ahí la capa obliga a subir, manda eso. Si no, el relleno lateral se calcula con la posición real
 * (`actual`), para no recorrer los botones mientras la barra todavía descansa arriba de la capa.
 */
export function holguraBarra(actual: Caja, pegada: Caja, capas: ReadonlyArray<CajaCapa>, altoVentana: number, minimo: number): Holgura {
  const enSuSitio = holguraContra(pegada, capas, altoVentana, minimo);
  if (enSuSitio.arriba > 0) return { arriba: enSuSitio.arriba, izquierda: 0, derecha: 0 };
  return holguraContra(actual, capas, altoVentana, minimo);
}

/**
 * Alto del espaciador del final de la pantalla (px). `columna` = lo ancho de la pantalla; `finContenido` = dónde termina
 * su contenido (coordenadas del documento, sin el espaciador); `despues` = lo que el documento sigue después de él
 * (rellenos inferiores de la pantalla y del marco). El contenido tiene que poder terminar 12 px arriba de la capa
 * anclada abajo más alta que se cruce con la pantalla; si ya termina ahí sin desplazar, no hace falta nada.
 */
export function reservaContra(capas: ReadonlyArray<CajaCapa>, altoVentana: number, columna: { left: number; right: number }, finContenido: number, despues: number): number {
  let tope = Number.POSITIVE_INFINITY;
  for (const r of capas) {
    if (!capaAnclada(r, altoVentana)) continue;
    if (!(r.left < columna.right && r.right > columna.left)) continue;
    tope = Math.min(tope, r.top);
  }
  if (!Number.isFinite(tope)) return 0;
  const limite = tope - SEPARACION;
  const finAlMaximo = finContenido - Math.max(0, finContenido + despues - altoVentana);
  if (finAlMaximo <= limite) return 0;
  return Math.max(0, Math.ceil(altoVentana - despues - limite));
}

/** Rectángulos de las capas globales visibles (la marca puede ir en la capa o en su contenedor fijo, como los avisos).
 *  Los menús, globos de ayuda y burbujas de recorrido van pegados a su botón: no son capas ancladas. */
export function capasFijas(propio: HTMLElement): DOMRect[] {
  const salida: DOMRect[] = [];
  for (const raiz of document.querySelectorAll<HTMLElement>('[data-capa-corte]')) {
    if (propio.contains(raiz) || raiz.contains(propio)) continue;
    if (raiz.matches('[role="menu"], [role="tooltip"], [aria-modal="false"]')) continue;
    for (const el of [raiz, ...raiz.querySelectorAll<HTMLElement>(':scope > *')]) {
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none') continue;
      if (el === raiz && s.position !== 'fixed') continue;
      salida.push(el.getBoundingClientRect());
    }
  }
  return salida;
}

/** Ancho que necesitan los botones de la barra: sus anchos + los huecos + el relleno base (sin el espaciador). */
function anchoMinimo(el: HTMLElement): number {
  const s = getComputedStyle(el);
  const hueco = Number.parseFloat(s.columnGap) || 0;
  const hijos = [...el.children].filter((h): h is HTMLElement => h instanceof HTMLElement && !h.classList.contains(css.barraFijaEspacio ?? '') && h.getClientRects().length > 0);
  const anchos = hijos.reduce((suma, h) => suma + h.getBoundingClientRect().width, 0);
  return anchos + hueco * Math.max(0, hijos.length - 1) + 2 * SEPARACION;
}

/** Vuelve a medir cuando cambia el DOM (aparece o se va una capa), la ventana, el desplazamiento o termina una animación;
 *  una vez por cuadro. */
function useRemedir(el: HTMLElement | null, medir: (el: HTMLElement) => void, conScroll: boolean): void {
  const ultima = useRef(medir);
  ultima.current = medir;
  useEffect(() => {
    if (!el || typeof window === 'undefined' || typeof MutationObserver === 'undefined') return undefined;
    let cuadro = 0;
    const correr = (): void => {
      cuadro = 0;
      ultima.current(el);
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(correr);
    };
    pedir();
    const o = new MutationObserver(pedir);
    o.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', pedir);
    if (conScroll) window.addEventListener('scroll', pedir, { passive: true });
    document.addEventListener('animationend', pedir, true);
    document.addEventListener('transitionend', pedir, true);
    return () => {
      o.disconnect();
      window.removeEventListener('resize', pedir);
      window.removeEventListener('scroll', pedir);
      document.removeEventListener('animationend', pedir, true);
      document.removeEventListener('transitionend', pedir, true);
      if (cuadro) window.cancelAnimationFrame(cuadro);
    };
  }, [el, conScroll]);
}

/** `pegada` = el sticky está activo (la barra está en su línea de pegado y no en su lugar natural dentro del contenido). */
interface EstadoBarra {
  holgura: Holgura;
  pegada: boolean;
}

function useHolgura(el: HTMLElement | null): EstadoBarra {
  const [estado, setEstado] = useState<EstadoBarra>({ holgura: SIN_HOLGURA, pegada: false });
  useRemedir(
    el,
    (barra) => {
      // Separación de la barra pegada con el borde de abajo: su `bottom` de CSS menos la subida que ya se le aplicó.
      const aplicada = Number.parseFloat(barra.style.getPropertyValue('--holgura')) || 0;
      const bottomCss = Number.parseFloat(getComputedStyle(barra).bottom) || 0;
      const fondo = bottomCss - aplicada;
      const r = barra.getBoundingClientRect();
      const alto = window.innerHeight;
      const abajo = alto - fondo;
      const enSuSitio = { top: abajo - r.height, bottom: abajo, left: r.left, right: r.right };
      const nueva = holguraBarra({ top: r.top, bottom: r.bottom, left: r.left, right: r.right }, enSuSitio, capasFijas(barra), alto, anchoMinimo(barra));
      // Solo pegada de verdad lleva repisa: en su lugar natural (contenido corto) la repisa taparía lo que sigue.
      const pegada = r.height > 0 && r.bottom >= alto - bottomCss - 1.5;
      setEstado((previa) =>
        previa.pegada === pegada && previa.holgura.arriba === nueva.arriba && previa.holgura.izquierda === nueva.izquierda && previa.holgura.derecha === nueva.derecha
          ? previa
          : { holgura: nueva, pegada },
      );
    },
    true,
  );
  return estado;
}

export function BarraFija(p: { children: ReactNode; etiqueta: string; className?: string }): ReactElement {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const { holgura, pegada } = useHolgura(el);
  return (
    <div
      ref={setEl}
      role="group"
      aria-label={p.etiqueta}
      className={cx(css.barraFija, p.className)}
      style={vars({ '--holgura': `${holgura.arriba}px`, '--holgura-izquierda': `${holgura.izquierda}px`, '--holgura-derecha': `${holgura.derecha}px` })}
      data-barra-fija=""
      {...(holgura.arriba > 0 ? { 'data-esquiva': 'subir' } : {})}
      {...(pegada ? { 'data-pegada': '' } : {})}
    >
      {p.children}
    </div>
  );
}

/** Lo que el documento sigue después del espaciador: rellenos, bordes y márgenes inferiores de sus contenedores. */
function despuesDe(el: HTMLElement): number {
  let suma = 0;
  for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
    const s = getComputedStyle(a);
    suma += (Number.parseFloat(s.paddingBottom) || 0) + (Number.parseFloat(s.borderBottomWidth) || 0) + Math.max(0, Number.parseFloat(s.marginBottom) || 0);
  }
  return suma;
}

/** Alto del espaciador del final de la pantalla (ver reservaContra). */
export function useReservaCapas(el: HTMLElement | null): number {
  const [reserva, setReserva] = useState(0);
  useRemedir(
    el,
    (espaciador) => {
      const r = espaciador.getBoundingClientRect();
      const columna = espaciador.parentElement?.getBoundingClientRect() ?? r;
      const nueva = reservaContra(capasFijas(espaciador), window.innerHeight, columna, r.top + window.scrollY, despuesDe(espaciador));
      setReserva((previa) => (previa === nueva ? previa : nueva));
    },
    false,
  );
  return reserva;
}

/** Espaciador del final de cada pantalla de flujos (va como su último hijo). Sin capas no ocupa lugar: su margen
 *  negativo se come el hueco de la columna. */
export function ReservaCapas(): ReactElement {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const reserva = useReservaCapas(el);
  return <div ref={setEl} aria-hidden="true" className={cx(css.reserva)} style={{ height: reserva }} data-reserva-capas={reserva} />;
}
