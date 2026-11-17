/**
 * Avatar de tienda (02 §7.17): iniciales + color determinista (mismo nombre, mismo color en todas las pantallas y en
 * ambos dispositivos). Texto al 40 % del lado (mín. 9 px), 640, radio al 30 %. Debajo de 20 px: cuadrado de 10 del
 * tono, sin letras. Lleva title y aria-hidden (el nombre siempre va al lado).
 */
import type { ReactElement } from 'react';
import { inicialesTienda, tonoTienda } from '@/dominio';
import { cx, vars } from './util/clases';
import css from './AvatarTienda.module.css';

export function AvatarTienda(p: { nombre: string; tamano: 16 | 20 | 24 | 32 | 40 | 56; className?: string }): ReactElement {
  const tono = tonoTienda(p.nombre || '?');
  if (p.tamano < 20) {
    return <span className={cx(css.avatar, css.punto, p.className)} data-tono={tono} title={p.nombre} aria-hidden="true" />;
  }
  return (
    <span className={cx(css.avatar, p.className)} data-tono={tono} title={p.nombre} aria-hidden="true" style={vars({ '--lado': `${p.tamano}px` })}>
      {inicialesTienda(p.nombre || '?')}
    </span>
  );
}
