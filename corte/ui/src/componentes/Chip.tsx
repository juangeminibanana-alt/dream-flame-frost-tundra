/**
 * Chip de estado (02 §7.2, §3.4): alto 22 (lg 28), radio total, ícono de 14 con trazo 2, texto de 12 en 600.
 * Siempre ícono + texto en los estados (el color nunca va solo). `prefijo` ('TikTok:', 'Tu avance:') va atenuado.
 */
import type { ReactElement } from 'react';
import type { ChipProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Chip.module.css';

export function Chip(p: ChipProps): ReactElement {
  return (
    <span className={cx(css.chip, css[p.tono], p.tamano === 'lg' && css.lg, p.icono && css.conIcono, p.className)} title={p.titulo}>
      {p.icono ? <Icono nombre={p.icono} tamano={14} /> : null}
      <span className={css.texto}>
        {p.prefijo ? <span className={css.prefijo}>{p.prefijo} </span> : null}
        {p.children}
      </span>
    </span>
  );
}
