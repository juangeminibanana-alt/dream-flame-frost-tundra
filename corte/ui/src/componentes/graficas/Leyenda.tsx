/**
 * Leyenda de series (02 §9.4.7, siempre con ≥ 2 series) y asignación de slots: la paleta categórica se usa en orden
 * fijo y nunca se cicla (un slot explícito manda; si no, el siguiente libre). Rayado y neutro no gastan slot.
 */
import type { ReactElement } from 'react';
import type { SerieApilada } from '@firmas/componentes';
import { cx } from '../util/clases';
import css from './graficas.module.css';

interface ConEstilo {
  id: string;
  estilo: SerieApilada['estilo'];
  slot?: SerieApilada['slot'] | undefined;
}

export function slotsDeSeries(series: ConEstilo[]): Record<string, number> {
  const usados = new Set(series.map((s) => s.slot).filter((x): x is NonNullable<typeof x> => x !== undefined));
  const salida: Record<string, number> = {};
  let siguiente = 1;
  for (const s of series) {
    if (s.estilo === 'rayado' || s.estilo === 'neutro') continue;
    if (s.slot !== undefined) {
      salida[s.id] = s.slot;
      continue;
    }
    while (usados.has(siguiente as NonNullable<SerieApilada['slot']>) && siguiente < 8) siguiente += 1;
    salida[s.id] = Math.min(8, siguiente);
    usados.add(Math.min(8, siguiente) as NonNullable<SerieApilada['slot']>);
  }
  return salida;
}

/** Clase de la muestra (cuadro en la leyenda, línea en la lectura). */
export function claseMuestra(s: ConEstilo, slots: Record<string, number>): string {
  if (s.estilo === 'rayado') return 'mRayado';
  if (s.estilo === 'neutro') return 'mNeutro';
  return `${s.estilo === 'tenue' ? 't' : 'm'}${slots[s.id] ?? 1}`;
}

export function Leyenda(p: { series: Array<ConEstilo & { etiqueta: string }>; slots: Record<string, number>; textos?: Record<string, string> | undefined }): ReactElement {
  return (
    <ul className={css.leyendaLista} role="list">
      {p.series.map((s) => (
        <li key={s.id} className={css.leyendaElemento}>
          <i className={cx(css.muestra, css[claseMuestra(s, p.slots)])} aria-hidden="true" />
          <span>{s.etiqueta}</span>
          {p.textos?.[s.id] ? <b className={css.leyendaValor}>{p.textos[s.id]}</b> : null}
        </li>
      ))}
    </ul>
  );
}
