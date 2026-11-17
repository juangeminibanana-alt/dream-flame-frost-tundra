/**
 * Tarjeta (02 §5, ritmo de superficies): surface-1, radio 14, borde 7 %, reflejo superior. Solo para módulos
 * secundarios. Con `alPulsar` toda la tarjeta responde (teclado: Enter y Espacio) y se nombra con `etiqueta`.
 */
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import { cx } from './util/clases';
import css from './Tarjeta.module.css';

export function Tarjeta(p: { children: ReactNode; padding?: 'ninguno' | 'normal' | 'amplio'; alPulsar?: () => void; etiqueta?: string; className?: string }): ReactElement {
  const relleno = css[p.padding ?? 'normal'];
  if (!p.alPulsar) {
    return (
      <div className={cx(css.tarjeta, relleno, p.className)} {...(p.etiqueta ? { role: 'group', 'aria-label': p.etiqueta } : {})}>
        {p.children}
      </div>
    );
  }
  const alPulsar = p.alPulsar;
  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      alPulsar();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={p.etiqueta}
      className={cx(css.tarjeta, relleno, css.pulsable, p.className)}
      onClick={() => alPulsar()}
      onKeyDown={alTecla}
    >
      {p.children}
    </div>
  );
}
