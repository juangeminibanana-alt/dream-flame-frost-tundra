/**
 * Banda de dinero: encabezado title3 con "Ver ventas ›" y los KPI como 4 tarjetas (surface-1, borde de 1 px, radio de
 * tarjeta, relleno 18, separación 14), como el lienzo aprobado (Main.png, Ventas.png, MovilInicio.png). La composición
 * del lienzo manda sobre 02 §7.3 «sin tarjeta» (LEEME.md:17); la firma no cambia. Los valores comparten línea base
 * (subgrid). Con poco ancho (Android o una columna angosta) pasa a 2×2 con 10 de separación y a una sola columna cuando
 * la escala de texto ya no deja caber la etiqueta (minmax en em, que crece con --fs).
 */
import { Children, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { Icono } from './Icono';
import { cx } from './util/clases';
import { hrefDeRuta, sinChevron } from './util/rutas';
import css from './BandaKpi.module.css';

export function BandaKpi(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; className?: string }): ReactElement {
  const idTitulo = useId();
  const n = Children.toArray(p.children).filter(isValidElement).length;
  const columnas = Math.min(Math.max(n, 1), 4);
  return (
    <section className={cx(css.banda, p.className)} aria-labelledby={idTitulo}>
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
      <div className={css.rejilla} data-cols={columnas}>
        {p.children}
      </div>
    </section>
  );
}
