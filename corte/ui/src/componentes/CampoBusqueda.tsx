/**
 * Campo "Buscar" de la barra de Windows (02 §7.10): 280×36, radio 8, surface-2, borde --border-control, lupa de 16,
 * placeholder "Buscar" que nunca se corta y kbd "Ctrl K". No es un input: abre la paleta global (ui-marco) con clic,
 * Enter, Espacio o al empezar a escribir, así que el foco nunca queda atrapado en un campo que no busca.
 */
import type { KeyboardEvent, ReactElement } from 'react';
import { Icono } from './Icono';
import { Kbd } from './Kbd';
import { cx } from './util/clases';
import css from './CampoBusqueda.module.css';

export function CampoBusqueda(p: { alAbrir: () => void; className?: string }): ReactElement {
  const alTecla = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1 && e.key !== ' ') {
      e.preventDefault();
      p.alAbrir();
    }
  };
  return (
    <button type="button" className={cx(css.campo, p.className)} aria-label="Buscar" aria-keyshortcuts="Control+K" aria-haspopup="dialog" onClick={() => p.alAbrir()} onKeyDown={alTecla}>
      <Icono nombre="Search" tamano={16} className={cx(css.lupa)} />
      <span className={css.placeholder}>Buscar</span>
      <Kbd className={cx(css.kbd)}>Ctrl K</Kbd>
    </button>
  );
}
