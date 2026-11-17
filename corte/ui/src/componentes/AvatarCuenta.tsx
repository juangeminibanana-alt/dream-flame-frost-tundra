/**
 * Avatar redondo de la cuenta del creador (02 §7.7, §8.1): 32 o 40, foto del perfil con carga progresiva sobre las
 * iniciales (se ven mientras carga y se quedan si no hay foto o falla), en el degradado iris → cielo de la lámina.
 * Decorativo: el @usuario va al lado.
 */
import type { ReactElement } from 'react';
import { inicialesTienda } from '@/dominio';
import { FotoBase } from './Foto';
import { cx, vars } from './util/clases';
import css from './AvatarCuenta.module.css';

export function AvatarCuenta(p: { url: string | null; username: string; tamano: 32 | 40; className?: string }): ReactElement {
  return (
    <span className={cx(css.avatar, p.className)} style={vars({ '--lado': `${p.tamano}px` })} title={`@${p.username}`} aria-hidden="true">
      <span className={css.iniciales}>{inicialesTienda(p.username || '?')}</span>
      {p.url ? <FotoBase url={p.url} alt="" anchoCss={p.tamano} llenar respaldo={<></>} className={cx(css.foto)} /> : null}
    </span>
  );
}
