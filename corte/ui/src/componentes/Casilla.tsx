/** Casilla de verificación nativa con caja propia (18 px, radio 5); marcada en lima con ✓, indeterminada con −. */
import { useEffect, useId, useRef, type ReactElement } from 'react';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Controles.module.css';

export function Casilla(p: { marcada: boolean; alCambiar: (marcada: boolean) => void; etiqueta: string; indeterminada?: boolean; deshabilitado?: boolean; className?: string }): ReactElement {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!p.indeterminada;
  }, [p.indeterminada]);
  const estado = p.indeterminada ? 'mixta' : p.marcada ? 'si' : 'no';
  return (
    <label htmlFor={id} className={cx(css.casilla, p.deshabilitado && css.inactiva, p.className)}>
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={css.nativo}
        checked={p.marcada}
        disabled={!!p.deshabilitado}
        onChange={(e) => p.alCambiar(e.target.checked)}
      />
      <span className={cx(css.caja, estado !== 'no' && 'fc-fill')} data-estado={estado} aria-hidden="true">
        {estado === 'si' ? <Icono nombre="Check" tamano={14} /> : estado === 'mixta' ? <Icono nombre="Minus" tamano={14} /> : null}
      </span>
      <span className={css.etiqueta}>{p.etiqueta}</span>
    </label>
  );
}
