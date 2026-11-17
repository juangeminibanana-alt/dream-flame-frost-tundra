/** Tecla en Geist Mono de 11 (02 §7.7, §7.10): "Ctrl K", "G I". */
import type { ReactElement, ReactNode } from 'react';
import { cx } from './util/clases';
import css from './Kbd.module.css';

export function Kbd(p: { children: ReactNode; className?: string }): ReactElement {
  return <kbd className={cx(css.kbd, p.className)}>{p.children}</kbd>;
}
