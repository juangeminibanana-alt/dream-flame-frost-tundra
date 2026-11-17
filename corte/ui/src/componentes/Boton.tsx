/**
 * Botón de 02 §7.1: primario (una acción principal por vista), secundario, fantasma y peligro; sm 32 · md 36 · lg 44
 * (táctil 40/48/52 por tokens). Presionado scale(.98) en 80 ms; deshabilitado SIN opacidad; cargando = spinner de 16
 * sin cambiar el ancho. `atajo` solo se muestra en el tooltip (Windows); no registra el atajo.
 */
import type { ReactElement } from 'react';
import type { BotonProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { Kbd } from './Kbd';
import { Tooltip } from './Tooltip';
import { cx } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import css from './Boton.module.css';

export function Boton(p: BotonProps): ReactElement {
  const plataforma = usePlataformaHtml();
  const variante = p.variante ?? 'secundario';
  const tamano = p.tamano ?? 'md';
  const inactivo = !!p.deshabilitado || !!p.cargando;
  const tamIcono = tamano === 'sm' ? 16 : 18;
  const boton = (
    <button
      type={p.tipo ?? 'button'}
      className={cx(css.boton, css[variante], css[tamano], p.anchoCompleto && css.completo, p.cargando && css.cargando, p.className)}
      data-variante={variante}
      disabled={!!p.deshabilitado}
      aria-disabled={p.cargando ? true : undefined}
      aria-busy={p.cargando ? true : undefined}
      aria-label={p['aria-label']}
      aria-keyshortcuts={p.atajo}
      onClick={() => {
        if (!inactivo) p.alPulsar?.();
      }}
    >
      <span className={css.contenido}>
        {p.icono ? <Icono nombre={p.icono} tamano={tamIcono} /> : null}
        <span className={css.texto}>{p.children}</span>
        {p.iconoFinal ? <Icono nombre={p.iconoFinal} tamano={tamIcono} /> : null}
      </span>
      {p.cargando ? <span className={cx(css.spinner, 'anim-loop')} aria-hidden="true" /> : null}
    </button>
  );
  if (!p.atajo) return boton;
  return (
    <Tooltip
      desactivado={plataforma === 'android'}
      contenido={
        <>
          <span>Atajo</span>
          <Kbd>{p.atajo}</Kbd>
        </>
      }
    >
      {boton}
    </Tooltip>
  );
}
