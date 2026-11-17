/**
 * Barra de progreso (02 §7.20): 8 de alto. El relleno mide el ancho completo dentro de una pista con overflow hidden y
 * se mueve con translateX((p − 1) × 100 %): así el corte a 45° del borde de avance nunca se deforma y la animación se
 * compone. En claro lleva el contorno interior --progress-edge.
 */
import type { ReactElement } from 'react';
import { cx, vars } from './util/clases';
import css from './BarraProgreso.module.css';

export function BarraProgreso(p: { valor: number; etiqueta: string; className?: string }): ReactElement {
  const v = Number.isFinite(p.valor) ? Math.min(1, Math.max(0, p.valor)) : 0;
  return (
    <div
      className={cx(css.pista, p.className)}
      role="progressbar"
      aria-label={p.etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      style={vars({ '--p': v })}
    >
      <span className={cx(css.relleno, 'fc-fill', 'anim-grow')} data-completo={v >= 1 ? '' : undefined} />
    </div>
  );
}
