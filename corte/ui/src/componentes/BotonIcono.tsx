/**
 * Botón de solo ícono (02 §7.1): 36×36 (táctil 48×48 circular), aria-label obligatorio y tooltip en Windows a los
 * 500 ms. `girando` es el único bucle permitido (Sincronizando…) y se apaga con movimiento reducido (.anim-loop).
 */
import type { ReactElement } from 'react';
import type { BotonIconoProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { Tooltip } from './Tooltip';
import { cx } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import css from './BotonIcono.module.css';

export function BotonIcono(p: BotonIconoProps): ReactElement {
  const plataforma = usePlataformaHtml();
  const tamano = p.tamano ?? 'md';
  return (
    <Tooltip contenido={p.etiqueta} desactivado={plataforma === 'android'}>
      <button
        type="button"
        className={cx(css.boton, css[p.variante ?? 'fantasma'], css[tamano], p.activo && css.activo, p.className)}
        aria-label={p.etiqueta}
        aria-pressed={p.activo === undefined ? undefined : p.activo}
        disabled={!!p.deshabilitado}
        onClick={() => p.alPulsar?.()}
      >
        <Icono nombre={p.icono} tamano={tamano === 'sm' ? 16 : 18} className={cx(p.girando && css.girando, p.girando && 'anim-loop')} />
      </button>
    </Tooltip>
  );
}
