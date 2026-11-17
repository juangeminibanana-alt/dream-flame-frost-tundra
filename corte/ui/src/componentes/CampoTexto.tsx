/**
 * Campo de texto (02 §7.10): fondo surface-2, borde --border-control, radio 8, alto --control-h-md. Foco: borde
 * --border-focus, halo --brand-subtle de 3 px y fondo surface-1. Búsqueda con lupa y ✕ para borrar; contraseña con
 * ojo para mostrar. Ayuda y error ligados con aria-describedby (error con aria-invalid y role=alert).
 * Contraseña = campo NO controlado: en un campo controlado React copia lo escrito al atributo `value` del DOM, que
 * cualquiera puede serializar (outerHTML, inspector, capturas del árbol). Aquí lo escrito vive solo en la propiedad del
 * campo; `valor` se aplica al montar y cada vez que cambia (p. ej. la pantalla lo vacía tras mandarlo).
 */
import { useId, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import type { CampoTextoProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './Campo.module.css';

export function CampoTexto(p: CampoTextoProps): ReactElement {
  const id = useId();
  const idNota = useId();
  const [ver, setVer] = useState(false);
  const tipo = p.tipo ?? 'text';
  const esClave = tipo === 'password';
  const entrada = useRef<HTMLInputElement>(null);
  // El atributo `value` de una contraseña siempre queda vacío: `valor` (también el del montaje) se aplica solo a la
  // propiedad del campo, antes de pintar.
  useLayoutEffect(() => {
    const el = entrada.current;
    if (esClave && el && el.value !== p.valor) el.value = p.valor;
  }, [esClave, p.valor]);
  const nota = p.error ? p.error : p.ayuda;
  // Un código corto (texto monoespaciado con tope de 16 o menos) se pinta como código: grande, centrado y con interletra.
  const codigo = !!p.monoespaciado && tipo === 'text' && p.maximo !== undefined && p.maximo <= 16;
  return (
    <div className={cx(css.campo, p.className)}>
      <label htmlFor={id} className={cx(css.etiqueta, p.etiquetaOculta && css.sr)}>
        {p.etiqueta}
      </label>
      <div className={cx(css.caja, codigo && css.cajaCodigo, p.error && css.conError)}>
        {tipo === 'search' ? <Icono nombre="Search" tamano={16} className={cx(css.lupa)} /> : null}
        <input
          ref={entrada}
          id={id}
          className={cx(css.input, p.monoespaciado && css.mono, codigo && css.codigo)}
          type={tipo === 'password' && ver ? 'text' : tipo}
          {...(esClave ? { defaultValue: '' } : { value: p.valor })}
          placeholder={p.placeholder}
          maxLength={p.maximo}
          autoFocus={p.autoFoco}
          {...(p.autoFoco ? { 'data-autofoco': '' } : {})}
          spellCheck={tipo === 'text' && !p.monoespaciado}
          autoComplete={tipo === 'password' ? 'off' : undefined}
          aria-invalid={p.error ? true : undefined}
          aria-describedby={nota ? idNota : undefined}
          onChange={(e) => p.alCambiar(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && p.alEnter && !e.nativeEvent.isComposing) {
              e.preventDefault();
              p.alEnter();
            } else if (e.key === 'Escape' && tipo === 'search' && p.valor) {
              e.preventDefault();
              e.stopPropagation();
              p.alCambiar('');
            }
          }}
        />
        {tipo === 'search' && p.valor ? (
          <button type="button" className={css.accionCaja} aria-label="Borrar búsqueda" onClick={() => p.alCambiar('')}>
            <Icono nombre="X" tamano={16} />
          </button>
        ) : null}
        {tipo === 'password' ? (
          <button type="button" className={css.accionCaja} aria-label={`Mostrar ${p.etiqueta.charAt(0).toLocaleLowerCase('es-MX')}${p.etiqueta.slice(1)}`} aria-pressed={ver} onClick={() => setVer((v) => !v)}>
            <Icono nombre={ver ? 'EyeOff' : 'Eye'} tamano={16} />
          </button>
        ) : null}
      </div>
      {p.error ? (
        <p id={idNota} className={css.error} role="alert">
          <Icono nombre="CircleAlert" tamano={14} />
          {p.error}
        </p>
      ) : p.ayuda ? (
        <p id={idNota} className={css.ayuda}>
          {p.ayuda}
        </p>
      ) : null}
    </div>
  );
}
