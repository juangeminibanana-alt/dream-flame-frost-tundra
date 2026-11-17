/**
 * Celda «Tienda» de la tabla de Tiendas (01 §4.9; 02 §7.5 «miniatura de 40 + nombre de 1 línea»). La API no da
 * logotipos: la imagen de la tienda es la foto de su producto más relevante (FilaTienda.imagen) y, si no hay foto, Foto
 * pinta el mosaico con las iniciales y el tono de la tienda (el mismo de AvatarTienda, 02 §7.17). El porqué de la salud
 * va en la ayuda del chip de la columna Salud (01 §4.9: «chip + porqué en ayuda»).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Foto } from '@/componentes';
import { cx } from './util';
import css from './tiendas.module.css';

export function CeldaTienda(p: { tienda: C.FilaTienda }): ReactElement {
  const t = p.tienda;
  return (
    <span className={cx(css.celdaTienda)}>
      <Foto url={t.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={t.nombre} className={cx(css.celdaTiendaFoto)} />
      <span className={cx(css.celdaTiendaNombre)} title={t.nombre}>{t.nombre}</span>
    </span>
  );
}
