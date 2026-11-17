/** Área de texto con contador opcional ("124/500") y los mismos estados del campo (02 §7.10). */
import { useId, type ReactElement } from 'react';
import type { CampoTextoProps } from '@firmas/componentes';
import { formato } from '@/dominio';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Campo.module.css';

export function AreaTexto(p: Omit<CampoTextoProps, 'tipo' | 'alEnter'> & { filas?: number; contador?: boolean }): ReactElement {
  const id = useId();
  const idNota = useId();
  const nota = p.error ?? p.ayuda;
  return (
    <div className={cx(css.campo, p.className)}>
      <label htmlFor={id} className={cx(css.etiqueta, p.etiquetaOculta && css.sr)}>
        {p.etiqueta}
      </label>
      <div className={cx(css.caja, css.cajaArea, p.error && css.conError)}>
        <textarea
          id={id}
          className={cx(css.input, css.area, p.monoespaciado && css.mono)}
          rows={p.filas ?? 4}
          value={p.valor}
          placeholder={p.placeholder}
          maxLength={p.maximo}
          autoFocus={p.autoFoco}
          {...(p.autoFoco ? { 'data-autofoco': '' } : {})}
          aria-invalid={p.error ? true : undefined}
          aria-describedby={nota ? idNota : undefined}
          onChange={(e) => p.alCambiar(e.target.value)}
        />
      </div>
      <div className={css.pieArea}>
        {p.error ? (
          <p id={idNota} className={css.error} role="alert">
            <Icono nombre="CircleAlert" tamano={14} />
            {p.error}
          </p>
        ) : p.ayuda ? (
          <p id={idNota} className={css.ayuda}>
            {p.ayuda}
          </p>
        ) : (
          <span />
        )}
        {p.contador ? (
          <span className={css.contador} aria-live="polite">
            {formato.numero(p.valor.length)}
            {p.maximo !== undefined ? `/${formato.numero(p.maximo)}` : ''}
          </span>
        ) : null}
      </div>
    </div>
  );
}
