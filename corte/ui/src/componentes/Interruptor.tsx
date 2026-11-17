/** Interruptor (role=switch): pista de 36×20 con perilla que se desliza con transform; activo en lima. */
import { useId, type ReactElement } from 'react';
import { cx } from './util/clases';
import css from './Controles.module.css';

export function Interruptor(p: { activo: boolean; alCambiar: (activo: boolean) => void; etiqueta: string; descripcion?: string; deshabilitado?: boolean; className?: string }): ReactElement {
  const idEtiqueta = useId();
  const idDescripcion = useId();
  return (
    <div className={cx(css.fila, p.deshabilitado && css.inactiva, p.className)}>
      <span className={css.textos}>
        <span className={css.etiqueta} id={idEtiqueta}>
          {p.etiqueta}
        </span>
        {p.descripcion ? (
          <span className={css.descripcion} id={idDescripcion}>
            {p.descripcion}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={p.activo}
        aria-labelledby={idEtiqueta}
        {...(p.descripcion ? { 'aria-describedby': idDescripcion } : {})}
        disabled={!!p.deshabilitado}
        className={cx(css.interruptor, 'hit')}
        onClick={() => p.alCambiar(!p.activo)}
      >
        <span className={cx(css.pistaInterruptor, p.activo && 'fc-fill')} aria-hidden="true">
          <span className={css.perilla} />
        </span>
      </button>
    </div>
  );
}
