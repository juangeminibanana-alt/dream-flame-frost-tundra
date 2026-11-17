/**
 * Mosaico de respaldo (02 §8.4 paso 5): degradado de 160° del tono de la tienda a --media-bg, iniciales al 40 % del
 * lado (640, --av-{tono}-fg al 70 %) y el ícono de la categoría abajo a la derecha. Sin el texto "Sin foto".
 */
import type { ReactElement } from 'react';
import type { ProporcionFoto } from '@firmas/componentes';
import { iconoCategoria, inicialesTienda, tonoTienda } from '@/dominio';
import { Icono } from './Icono';
import { cx, vars } from './util/clases';
import css from './MosaicoTienda.module.css';

export interface MosaicoInternoProps {
  tienda: string;
  categoria?: string | null | undefined;
  anchoCss: number;
  proporcion?: ProporcionFoto | undefined;
  className?: string | undefined;
  /** Dentro de <Foto>: ocupa todo el pozo (sin ancho ni proporción propios). */
  relleno?: boolean | undefined;
}

export const CLASE_PROPORCION: Readonly<Record<ProporcionFoto, string>> = { '1:1': 'p11', '4:5': 'p45', '9:16': 'p916' };

export function MosaicoTienda(p: MosaicoInternoProps): ReactElement {
  const nombre = p.tienda.trim();
  const tono = nombre ? tonoTienda(nombre) : 'pizarra';
  const iniciales = nombre ? inicialesTienda(nombre) : '';
  return (
    <span
      className={cx(css.mosaico, p.relleno ? css.relleno : css[CLASE_PROPORCION[p.proporcion ?? '1:1']], p.className)}
      data-tono={tono}
      style={p.relleno ? undefined : vars({ '--mosaico-ancho': `${p.anchoCss}px` })}
      aria-hidden="true"
    >
      {iniciales ? <b className={css.iniciales}>{iniciales}</b> : null}
      <Icono nombre={iconoCategoria(p.categoria)} className={cx(css.icono, !iniciales && css.iconoSolo)} />
    </span>
  );
}
