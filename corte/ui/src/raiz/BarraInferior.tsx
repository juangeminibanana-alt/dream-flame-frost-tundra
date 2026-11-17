/**
 * @/raiz · barra inferior (01 §3.3, 02 §7.8, lienzo MovilInicio.png): 64 + inset inferior, cinco destinos con etiqueta
 * siempre visible (Inicio · Muestras · Tiendas · Ventas · Más). Activo: píldora --brand-subtle con el ícono en
 * --brand-ink y la etiqueta en text-1 600. Insignias sobre Muestras y Tiendas con anillo de 2 px del lienzo. Capa .glass
 * (opaca salvo data-glass="on"). Se oculta con el teclado abierto.
 */
import type { MouseEvent, ReactElement } from 'react';
import { Icono, Insignia } from '@/componentes';
import { navegar } from '../app/navegacion';
import { cx } from '../app/clases';
import type { InsigniaNav } from './BarraLateral';
import { DESTINOS_INFERIOR, type IdDestino } from './destinos';
import { T } from './textos';
import css from './BarraInferior.module.css';

export function BarraInferior(p: { activo: IdDestino | null; insignias: Partial<Record<IdDestino, InsigniaNav>>; oculta: boolean }): ReactElement {
  return (
    <nav className={cx(css.barra, 'glass', p.oculta && css.oculta)} aria-label={T.navPrincipal} data-nav="inferior" aria-hidden={p.oculta ? true : undefined}>
      <ul className={css.lista} role="list">
        {DESTINOS_INFERIOR.map((d) => {
          const activo = p.activo === d.id;
          const insignia = p.insignias[d.id];
          return (
            <li key={d.id} className={css.celda}>
              <a
                href={`#${d.a}`}
                className={cx(css.destino, activo && css.activo)}
                aria-current={activo ? 'page' : undefined}
                tabIndex={p.oculta ? -1 : undefined}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  navegar(d.a);
                }}
                data-destino={d.id}
              >
                <span className={cx(css.pildora, activo && 'fc-fill')}>
                  <Icono nombre={d.icono} tamano={22} />
                  {insignia ? <Insignia {...insignia} className={cx(css.insignia)} /> : null}
                </span>
                <span className={css.etiqueta}>{d.etiqueta}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
