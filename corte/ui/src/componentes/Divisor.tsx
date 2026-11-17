/** Filete de 1 px en --border-subtle (horizontal o vertical). */
import type { ReactElement } from 'react';
import { cx } from './util/clases';
import css from './Divisor.module.css';

export function Divisor(p: { vertical?: boolean; className?: string }): ReactElement {
  return <div role="separator" aria-orientation={p.vertical ? 'vertical' : 'horizontal'} className={cx(css.divisor, p.vertical && css.vertical, p.className)} />;
}
