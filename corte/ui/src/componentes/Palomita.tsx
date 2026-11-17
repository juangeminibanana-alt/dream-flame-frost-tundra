/**
 * Palomita de 02 §10.2: círculo ok scale(.6→1) con resorte de 400 ms y trazo del ✓ en 280 ms con 120 ms de retraso.
 * Sin rebote con movimiento reducido (los tokens cambian --ease-spring y las duraciones). Decorativa.
 */
import type { ReactElement } from 'react';
import { cx, vars } from './util/clases';
import css from './Palomita.module.css';

export function Palomita(p: { tamano?: number; className?: string }): ReactElement {
  const t = p.tamano ?? 48;
  return (
    <span className={cx(css.palomita, 'fc-keep', p.className)} style={vars({ '--t': `${t}px` })} aria-hidden="true">
      <svg viewBox="0 0 48 48" width={t} height={t} focusable="false">
        <circle className={css.circulo} cx="24" cy="24" r="22" />
        <path className={css.trazo} d="M14.5 24.5 21 31l12.5-13" pathLength={1} />
      </svg>
    </span>
  );
}
