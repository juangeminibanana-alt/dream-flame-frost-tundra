/**
 * Campo del código de 12 caracteres (C6): un solo <input> que agrupa solo en 3 bloques de 4 ('K7QM-3XRA-9TPF') en
 * Geist Mono, acepta minúsculas, espacios, guiones y pegar el código entero; O→0 e I/L→1. Debajo, las 3 marcas de
 * avance por grupo y la ayuda con el conteo.
 */
import { useId, type ChangeEvent, type ReactElement } from 'react';
import { agruparCodigo, normalizarCodigo, LARGO_CODIGO } from './codigo';
import { T } from './textos';
import css from './Emparejar.module.css';
import { cx } from './clases';

export function CampoCodigo(p: {
  /** Normalizado, sin guiones. */
  valor: string;
  alCambiar: (normalizado: string) => void;
  etiqueta: string;
  error?: string | null;
  autoFoco?: boolean;
  grande?: boolean;
  alCompletar?: () => void;
  /** id del <input> (para que otra acción le pase el foco). */
  id?: string;
}): ReactElement {
  const propio = useId();
  const id = p.id ?? propio;
  const idAyuda = `${id}-ayuda`;
  const alCambiar = (e: ChangeEvent<HTMLInputElement>): void => {
    p.alCambiar(normalizarCodigo(e.target.value));
  };
  const grupos = [0, 1, 2].map((g) => Math.max(0, Math.min(4, p.valor.length - g * 4)));
  return (
    <div className={cx(css.campoCodigo)}>
      <label htmlFor={id} className={cx(css.etiquetaCampo)}>
        {p.etiqueta}
      </label>
      <input
        id={id}
        className={cx(css.inputCodigo, p.grande && css.inputCodigoGrande)}
        value={agruparCodigo(p.valor)}
        onChange={alCambiar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && p.valor.length === LARGO_CODIGO) p.alCompletar?.();
        }}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="one-time-code"
        autoCorrect="off"
        spellCheck={false}
        maxLength={LARGO_CODIGO + 8}
        placeholder="XXXX-XXXX-XXXX"
        aria-describedby={idAyuda}
        aria-invalid={p.error ? true : undefined}
        autoFocus={p.autoFoco}
        data-campo-codigo=""
      />
      <div className={cx(css.marcasCodigo)} aria-hidden="true">
        {grupos.map((n, i) => (
          <span key={i} className={cx(css.marcaGrupo)} data-lleno={n === 4 ? '' : undefined}>
            <span className={cx(css.marcaRelleno)} style={{ transform: `scaleX(${n / 4})` }} />
          </span>
        ))}
      </div>
      <p id={idAyuda} className={cx(p.error ? css.errorCampo : css.ayudaCampo)} role={p.error ? 'alert' : undefined}>
        {p.error ?? T.ayudaCodigo(p.valor.length)}
      </p>
    </div>
  );
}
