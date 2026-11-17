/**
 * Ticket de corte (02 §2.3 regla 4, §7.22): tira surface-1 con borde inferior dentado (máscara zigzag de 8 px), filetes
 * punteados de 1 px entre secciones, renglones "concepto ··· cifra" con guía punteada y el total en cifras anchas
 * (display al 125 %). Variante 'al_dia': diagonal a 45° exactos (M24 112 L128 8) y palomita en círculo ok.
 */
import { useId, type ReactElement } from 'react';
import type { TicketProps } from '@firmas/componentes';
import { Palomita } from './Palomita';
import { cx } from './util/clases';
import css from './Ticket.module.css';

export function Ticket(p: TicketProps): ReactElement {
  const variante = p.variante ?? 'semana';
  const idTitulo = useId();
  return (
    <article className={cx(css.ticket, p.className)} aria-labelledby={idTitulo} data-variante={variante}>
      <header className={css.cabeza}>
        <span className={css.marca} aria-hidden="true">
          corte
        </span>
        <span className={css.subtitulo} id={idTitulo}>
          {p.titulo}
          {p.subtitulo ? ` · ${p.subtitulo}` : ''}
        </span>
      </header>
      {variante === 'al_dia' ? (
        <div className={css.ilustracion} aria-hidden="true">
          <svg viewBox="0 0 152 120" width="152" height="120" focusable="false" className={css.diagonal}>
            <path d="M24 112 L128 8" />
          </svg>
          <Palomita tamano={52} className={cx(css.palomita)} />
        </div>
      ) : null}
      {p.renglones.length > 0 ? (
        <dl className={css.renglones}>
          {p.renglones.map((r) => (
            <div key={r.concepto} className={css.renglon}>
              <dt className={css.concepto}>
                {r.rayado ? <i className={cx(css.rayado, 'fc-keep')} aria-hidden="true" /> : null}
                {r.concepto}
              </dt>
              <span className={css.guia} aria-hidden="true" />
              <dd className={css.cifra}>{r.cifra}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className={css.total}>
        <span className={css.totalEtiqueta}>{variante === 'al_dia' ? 'Estás al día' : 'Total de la semana'}</span>
        <span className={cx(css.totalCifra, p.total.length > 9 && css.totalLargo)}>{p.total}</span>
      </div>
    </article>
  );
}
