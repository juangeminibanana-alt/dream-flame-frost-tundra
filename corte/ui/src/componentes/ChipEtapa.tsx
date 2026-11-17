/**
 * Chip de etapa «Tu avance» (02 §3.6): neutro (surface-2, text-2) con el ícono de la etapa y un punto de 8 px con el
 * color de la escala lima (paso 0 = pista vacía, 1..4 = Planeada · Video listo · Programada · Publicada, 'no' = gris).
 * La etapa nunca se pinta con colores de estado.
 */
import type { ReactElement, ReactNode } from 'react';
import type { NombreIcono } from '@firmas/componentes';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Chip.module.css';

const CLASE_PASO = { 0: 'paso0', 1: 'paso1', 2: 'paso2', 3: 'paso3', 4: 'paso4', no: 'pasoNo' } as const;

export function ChipEtapa(p: { paso: 0 | 1 | 2 | 3 | 4 | 'no'; icono: NombreIcono; children: ReactNode; prefijo?: string; className?: string }): ReactElement {
  return (
    <span className={cx(css.chip, css.etapa, css.conIcono, p.className)} data-paso={String(p.paso)}>
      <Icono nombre={p.icono} tamano={14} />
      <i className={cx(css.punto, css[CLASE_PASO[p.paso]], 'fc-keep')} aria-hidden="true" />
      <span className={css.texto}>
        {p.prefijo ? <span className={css.prefijo}>{p.prefijo} </span> : null}
        {p.children}
      </span>
    </span>
  );
}
