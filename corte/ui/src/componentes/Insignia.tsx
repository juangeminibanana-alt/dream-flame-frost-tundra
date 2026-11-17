/**
 * Insignia numérica (02 §7.2): alto 18, ancho mínimo 18, texto de 11 en 640. Atención sólida (pendientes), crítica
 * sólida (solo riesgo real), discreta y marca. El número es visual; el lector oye la `etiqueta` completa.
 */
import type { ReactElement } from 'react';
import type { InsigniaProps } from '@firmas/componentes';
import { formato } from '@/dominio';
import { cx } from './util/clases';
import css from './Insignia.module.css';

export function Insignia(p: InsigniaProps): ReactElement {
  const maximo = p.maximo ?? 99;
  const texto = p.valor > maximo ? `${formato.numero(maximo)}+` : formato.numero(p.valor);
  return (
    <span className={cx(css.insignia, css[p.variante], 'fc-fill', p.className)}>
      <span aria-hidden="true">{texto}</span>
      <span className={css.sr}>{p.etiqueta}</span>
    </span>
  );
}
