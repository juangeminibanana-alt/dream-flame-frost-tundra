/** Selector de número (− valor +) con role=spinbutton: ↑/↓ y RePág/AvPág cambian el valor entre min y max. */
import { useId, type KeyboardEvent, type ReactElement } from 'react';
import { formato } from '@/dominio';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Controles.module.css';

export function SelectorNumero(p: { valor: number; min: number; max: number; alCambiar: (valor: number) => void; etiqueta: string; className?: string }): ReactElement {
  const idEtiqueta = useId();
  const fijar = (v: number): void => {
    const c = Math.min(p.max, Math.max(p.min, Math.round(v)));
    if (c !== p.valor) p.alCambiar(c);
  };
  const alTecla = (e: KeyboardEvent<HTMLSpanElement>): void => {
    const pasos: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 };
    if (e.key in pasos) {
      e.preventDefault();
      fijar(p.valor + (pasos[e.key] ?? 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      fijar(p.min);
    } else if (e.key === 'End') {
      e.preventDefault();
      fijar(p.max);
    }
  };
  return (
    <div className={cx(css.numero, p.className)} role="group" aria-labelledby={idEtiqueta}>
      <span className={css.etiqueta} id={idEtiqueta}>
        {p.etiqueta}
      </span>
      <div className={css.numeroControl}>
        <button type="button" className={cx(css.paso, 'hit')} aria-label="Menos" disabled={p.valor <= p.min} onClick={() => fijar(p.valor - 1)}>
          <Icono nombre="Minus" tamano={16} />
        </button>
        <span
          className={css.valor}
          role="spinbutton"
          tabIndex={0}
          aria-labelledby={idEtiqueta}
          aria-valuenow={p.valor}
          aria-valuemin={p.min}
          aria-valuemax={p.max}
          onKeyDown={alTecla}
        >
          {formato.numero(p.valor)}
        </span>
        <button type="button" className={cx(css.paso, 'hit')} aria-label="Más" disabled={p.valor >= p.max} onClick={() => fijar(p.valor + 1)}>
          <Icono nombre="Plus" tamano={16} />
        </button>
      </div>
    </div>
  );
}
