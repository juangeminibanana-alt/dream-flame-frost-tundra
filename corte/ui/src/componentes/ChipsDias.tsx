/** Chips L M M J V S D (0 = lunes … 6 = domingo) con aria-pressed y el nombre completo del día para lectores. */
import { useId, type ReactElement } from 'react';
import { cx } from './util/clases';
import css from './Controles.module.css';

const DIAS: ReadonlyArray<[string, string]> = [
  ['L', 'lunes'], ['M', 'martes'], ['M', 'miércoles'], ['J', 'jueves'], ['V', 'viernes'], ['S', 'sábado'], ['D', 'domingo'],
];

export function ChipsDias(p: { dias: number[]; alCambiar: (dias: number[]) => void; etiqueta: string; className?: string }): ReactElement {
  const idEtiqueta = useId();
  const activos = new Set(p.dias);
  return (
    <div className={cx(css.dias, p.className)} role="group" aria-labelledby={idEtiqueta}>
      <span className={css.etiqueta} id={idEtiqueta}>
        {p.etiqueta}
      </span>
      <div className={css.diasFila}>
        {DIAS.map(([corta, larga], i) => {
          const activo = activos.has(i);
          return (
            <button
              key={larga}
              type="button"
              className={cx(css.dia, 'hit')}
              aria-pressed={activo}
              aria-label={larga}
              onClick={() => {
                const s = new Set(p.dias);
                if (activo) s.delete(i);
                else s.add(i);
                p.alCambiar([...s].sort((a, b) => a - b));
              }}
            >
              {corta}
            </button>
          );
        })}
      </div>
    </div>
  );
}
