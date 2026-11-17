/**
 * Tooltip de 02 §7.20 / §11.1: surface-4, borde, sombra 3, radio 8. Aparece a los 500 ms con el puntero, al instante
 * con el foco de teclado y con toque largo. Nunca es la única forma de leer algo (el texto ya está en aria-label o en
 * la tabla gemela). Se pinta en un portal con posición fija (no lo recorta un overflow).
 */
import { cloneElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from './util/clases';
import css from './Tooltip.module.css';

const RETRASO_PUNTERO_MS = 500;
const MARGEN = 8;

interface Posicion {
  x: number;
  y: number;
  abajo: boolean;
}

export interface TooltipInternoProps {
  contenido: ReactNode;
  children: ReactElement;
  className?: string | undefined;
  /** Sin tooltip (Android no tiene hover; un botón sin texto ya lleva aria-label). */
  desactivado?: boolean | undefined;
}

function esFocoVisible(el: Element | null): boolean {
  if (!el) return false;
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
}

export function Tooltip(p: TooltipInternoProps): ReactElement {
  const id = useId();
  const ancla = useRef<HTMLSpanElement>(null);
  const globo = useRef<HTMLDivElement>(null);
  const reloj = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<Posicion | null>(null);

  const limpiar = useCallback((): void => {
    if (reloj.current !== null) window.clearTimeout(reloj.current);
    reloj.current = null;
  }, []);
  const mostrar = useCallback((retraso: number): void => {
    limpiar();
    if (retraso <= 0) setVisible(true);
    else reloj.current = window.setTimeout(() => setVisible(true), retraso);
  }, [limpiar]);
  const ocultar = useCallback((): void => {
    limpiar();
    setVisible(false);
    setPos(null);
  }, [limpiar]);

  useEffect(() => limpiar, [limpiar]);
  useEffect(() => {
    if (p.desactivado) ocultar();
  }, [p.desactivado, ocultar]);

  useEffect(() => {
    if (!visible) return undefined;
    const alTecla = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') ocultar();
    };
    const alScroll = (): void => ocultar();
    document.addEventListener('keydown', alTecla);
    window.addEventListener('scroll', alScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('keydown', alTecla);
      window.removeEventListener('scroll', alScroll, { capture: true });
    };
  }, [visible, ocultar]);

  useLayoutEffect(() => {
    if (!visible) return;
    const destino = ancla.current?.firstElementChild;
    const g = globo.current;
    if (!destino || !g) return;
    const r = destino.getBoundingClientRect();
    const ancho = g.offsetWidth;
    const alto = g.offsetHeight;
    let x = r.left + r.width / 2 - ancho / 2;
    x = Math.max(MARGEN, Math.min(window.innerWidth - ancho - MARGEN, x));
    let y = r.top - alto - MARGEN;
    let abajo = false;
    if (y < MARGEN) {
      y = r.bottom + MARGEN;
      abajo = true;
    }
    setPos({ x, y, abajo });
  }, [visible, p.contenido]);

  const activo = !p.desactivado;
  const hijo = cloneElement(p.children as ReactElement<{ 'aria-describedby'?: string }>, visible && activo ? { 'aria-describedby': id } : {});
  // La envoltura es siempre la misma (display: contents) para que el hijo no se vuelva a montar al activar o desactivar.
  return (
    <span
      ref={ancla}
      className={css.ancla}
      onMouseEnter={activo ? () => mostrar(RETRASO_PUNTERO_MS) : undefined}
      onMouseLeave={activo ? ocultar : undefined}
      onFocus={
        activo
          ? (e) => {
              if (esFocoVisible(e.target)) mostrar(0);
            }
          : undefined
      }
      onBlur={activo ? ocultar : undefined}
      onPointerDown={
        activo
          ? (e) => {
              if (e.pointerType === 'mouse') ocultar();
            }
          : undefined
      }
      onTouchStart={activo ? () => mostrar(RETRASO_PUNTERO_MS) : undefined}
      onTouchEnd={
        activo
          ? () => {
              limpiar();
              if (visible) reloj.current = window.setTimeout(ocultar, 1500);
            }
          : undefined
      }
    >
      {hijo}
      {visible && activo && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={globo}
              id={id}
              role="tooltip"
              data-capa-corte=""
              data-abajo={pos?.abajo ? '' : undefined}
              className={cx(css.globo, pos && css.visible, p.className)}
              style={pos ? { left: pos.x, top: pos.y } : { left: -9999, top: -9999 }}
            >
              {p.contenido}
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
