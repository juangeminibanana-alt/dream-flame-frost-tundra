/** Grupo de opciones (radios nativos con aro propio y descripción opcional), dentro de un fieldset con leyenda. */
import { useId, type ReactElement } from 'react';
import { cx } from './util/clases';
import css from './Controles.module.css';

export function OpcionRadio<V extends string>(p: { opciones: { valor: V; etiqueta: string; descripcion?: string }[]; valor: V | null; alCambiar: (valor: V) => void; etiqueta: string; className?: string }): ReactElement {
  const nombre = useId();
  return (
    <fieldset className={cx(css.grupoRadio, p.className)}>
      <legend className={css.leyenda}>{p.etiqueta}</legend>
      {p.opciones.map((o) => {
        const id = `${nombre}-${o.valor}`;
        const marcada = o.valor === p.valor;
        return (
          <label key={o.valor} htmlFor={id} className={cx(css.radio, marcada && css.radioMarcada)}>
            <input id={id} type="radio" name={nombre} className={css.nativo} checked={marcada} onChange={() => p.alCambiar(o.valor)} />
            <span className={cx(css.aro, marcada && 'fc-fill')} aria-hidden="true" />
            <span className={css.textos}>
              <span className={css.etiqueta}>{o.etiqueta}</span>
              {o.descripcion ? <span className={css.descripcion}>{o.descripcion}</span> : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
