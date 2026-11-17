/**
 * Panel de firma «Ponte al día» (02 §7.23, §2.3 regla 3): el ÚNICO con chaflán de 18 px arriba a la derecha (clip-path
 * a 45° exactos) y reflejo superior. Medidas del lienzo aprobado (Main.png, MovilInicio.png; LEEME.md:17): radio 20,
 * relleno 28/30 (18 y radio 22 en celular), degradado a 135°, cuña lima tenue y diagonal lima de 2 px en la esquina.
 */
import type { ReactElement, ReactNode } from 'react';
import { cx } from './util/clases';
import css from './PanelFirma.module.css';

export function PanelFirma(p: { children: ReactNode; className?: string }): ReactElement {
  return <section className={cx(css.panel, p.className)}>{p.children}</section>;
}
