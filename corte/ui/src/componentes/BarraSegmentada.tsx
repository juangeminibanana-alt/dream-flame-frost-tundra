/**
 * Barra segmentada de estados (02 §7.20, partes de un todo): 24 de alto, segmentos con radio 4 y 2 px de separación en
 * --*-solid. El número va dentro solo si cabe; la leyenda lleva el conteo de cada parte. Hover y foco (flechas entre
 * segmentos) muestran nombre, cantidad y porcentaje.
 */
import { useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import type { TonoEstado } from '@firmas/componentes';
import { formato } from '@/dominio';
import { cx, vars } from './util/clases';
import { useTamano } from './util/medidas';
import css from './BarraSegmentada.module.css';

interface Parte {
  id: string;
  etiqueta: string;
  n: number;
  tono: TonoEstado;
}

export function BarraSegmentada(p: { partes: Parte[]; etiqueta: string; className?: string }): ReactElement {
  const contenedor = useRef<HTMLDivElement>(null);
  const { ancho } = useTamano(contenedor);
  const [activa, setActiva] = useState<string | null>(null);
  const [foco, setFoco] = useState(0);
  const visibles = p.partes.filter((x) => x.n > 0);
  const total = visibles.reduce((a, x) => a + x.n, 0);
  const anchoUtil = (ancho || 480) - Math.max(0, visibles.length - 1) * 2;
  const pct = (n: number): string => formato.porcentaje(total > 0 ? n / total : 0, total > 0 && n / total < 0.1 ? 1 : 0);
  const textoParte = (x: Parte): string => `${x.etiqueta}: ${formato.numero(x.n)} (${pct(x.n)})`;
  const parteActiva = visibles.find((x) => x.id === activa) ?? null;

  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key) || visibles.length === 0) return;
    e.preventDefault();
    let i = foco;
    if (e.key === 'ArrowRight') i = Math.min(visibles.length - 1, foco + 1);
    if (e.key === 'ArrowLeft') i = Math.max(0, foco - 1);
    if (e.key === 'Home') i = 0;
    if (e.key === 'End') i = visibles.length - 1;
    setFoco(i);
    const el = contenedor.current?.querySelectorAll<HTMLElement>('[data-segmento]')[i];
    el?.focus();
  };

  return (
    <div className={cx(css.raiz, p.className)}>
      <div ref={contenedor} className={cx(css.barra, 'fc-keep')} role="group" aria-label={p.etiqueta} onKeyDown={alTecla}>
        {visibles.map((x, i) => {
          const px = total > 0 ? (x.n / total) * anchoUtil : 0;
          const cabe = px >= String(x.n).length * 8 + 12;
          return (
            <span
              key={x.id}
              data-segmento=""
              className={cx(css.segmento, css[x.tono], activa === x.id && css.activo)}
              style={vars({ '--crece': x.n })}
              tabIndex={i === foco ? 0 : -1}
              role="img"
              aria-label={textoParte(x)}
              onMouseEnter={() => setActiva(x.id)}
              onMouseLeave={() => setActiva(null)}
              onFocus={() => {
                setActiva(x.id);
                setFoco(i);
              }}
              onBlur={() => setActiva(null)}
            >
              {cabe ? <span className={css.numero}>{formato.numero(x.n)}</span> : null}
            </span>
          );
        })}
        {total === 0 ? <span className={css.vacia} /> : null}
      </div>
      <div className={css.lectura} aria-hidden="true">
        {parteActiva ? (
          <>
            <b>{formato.numero(parteActiva.n)}</b> {parteActiva.etiqueta.toLocaleLowerCase('es-MX')} · {pct(parteActiva.n)}
          </>
        ) : null}
      </div>
      <ul className={css.leyenda} role="list">
        {p.partes.map((x) => (
          <li key={x.id} className={css.elemento}>
            <i className={cx(css.muestra, css[x.tono], 'fc-keep')} aria-hidden="true" />
            <span>
              <b className={css.n}>{formato.numero(x.n)}</b> {x.etiqueta.toLocaleLowerCase('es-MX')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
