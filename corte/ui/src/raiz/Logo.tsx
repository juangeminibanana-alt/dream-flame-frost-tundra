/**
 * @/raiz · marca de la barra lateral: el ícono de app de 02 §2.2 (spec/assets/icon.svg, misma geometría) en su versión
 * plana. El ícono no cambia con el tema (como el de la app): mosaico grafito, corte lima y papel.
 */
import type { ReactElement } from 'react';
import css from './Logo.module.css';

export function Logo(p: { tamano: number }): ReactElement {
  return (
    <svg className={css.logo} width={p.tamano} height={p.tamano} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
      <rect className={css.fondo} width="1024" height="1024" rx="232" />
      <g transform="translate(18 -6)">
        <path className={css.lima} d="M741.81 319.16A300 300 0 0 0 278.45 700.29L398.82 579.93A132 132 0 0 1 613.12 427.15Z" />
        <path className={css.papel} d="M323.71 745.55A300 300 0 0 0 741.81 704.84L613.12 596.85A132 132 0 0 1 444.07 625.18Z" transform="translate(-15.56 15.56)" />
      </g>
    </svg>
  );
}
