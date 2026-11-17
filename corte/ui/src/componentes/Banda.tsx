/**
 * Banda abierta sobre el lienzo, sin tarjeta (02 §5 ritmo de superficies): encabezado title3 y acción opcional
 * "Ver todos ›" (enlace de la ruta hash, sin depender de @/app).
 */
import { useId, type ReactElement, type ReactNode } from 'react';
import { Icono } from './Icono';
import { cx } from './util/clases';
import { hrefDeRuta, sinChevron } from './util/rutas';
import css from './Banda.module.css';

export function Banda(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; id?: string; className?: string }): ReactElement {
  const idTitulo = useId();
  return (
    <section className={cx(css.banda, p.className)} id={p.id} aria-labelledby={idTitulo}>
      <header className={css.encabezado}>
        <h2 className={css.titulo} id={idTitulo}>
          {p.titulo}
        </h2>
        {p.accion ? (
          <a className={css.accion} href={hrefDeRuta(p.accion.a)}>
            {sinChevron(p.accion.etiqueta)}
            <Icono nombre="ChevronRight" tamano={16} />
          </a>
        ) : null}
      </header>
      {p.children}
    </section>
  );
}
