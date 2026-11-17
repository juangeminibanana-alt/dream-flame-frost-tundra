/**
 * Chip de filtro (02 §7.11): alto 36 con área táctil de 48 (.hit), radio total, borde default; activo en
 * --brand-subtle + --brand-ink con aria-pressed.
 */
import type { ReactElement } from 'react';
import type { ChipFiltroProps } from '@firmas/componentes';
import { formato } from '@/dominio';
import { cx } from './util/clases';
import css from './ChipFiltro.module.css';

export function ChipFiltro(p: ChipFiltroProps): ReactElement {
  return (
    <button
      type="button"
      className={cx(css.chip, 'hit', p.activo && 'fc-selected', p.className)}
      aria-pressed={p.activo}
      onClick={() => p.alCambiar(!p.activo)}
    >
      <span className={css.texto}>{p.children}</span>
      {p.conteo !== undefined ? <span className={css.conteo}>{formato.numero(p.conteo)}</span> : null}
    </button>
  );
}
