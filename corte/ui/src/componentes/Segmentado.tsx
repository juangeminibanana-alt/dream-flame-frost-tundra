/**
 * Segmentado (02 §7.11): rejilla de columnas iguales, contenedor surface-2. Medidas del lienzo aprobado: 44 de alto
 * (48 en táctil), relleno 4 y radio 12 (LEEME.md:17). El pulgar mide calc(100%/n) fijo y SOLO se mueve con
 * translateX(calc(var(--i) * 100%)) en 200 ms. role=radiogroup con flechas ← →.
 */
import { useRef, type KeyboardEvent, type ReactElement } from 'react';
import type { SegmentadoProps } from '@firmas/componentes';
import { formato } from '@/dominio';
import { Icono } from './Icono';
import { cx, vars } from './util/clases';
import css from './Segmentado.module.css';

export function Segmentado<V extends string>(p: SegmentadoProps<V>): ReactElement {
  const grupo = useRef<HTMLDivElement>(null);
  const indice = Math.max(0, p.opciones.findIndex((o) => o.valor === p.valor));
  const elegir = (i: number): void => {
    const o = p.opciones[i];
    if (!o) return;
    if (o.valor !== p.valor) p.alCambiar(o.valor);
    grupo.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[i]?.focus();
  };
  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    const n = p.opciones.length;
    if (n === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      elegir((indice + 1) % n);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      elegir((indice - 1 + n) % n);
    } else if (e.key === 'Home') {
      e.preventDefault();
      elegir(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      elegir(n - 1);
    }
  };
  return (
    <div
      ref={grupo}
      role="radiogroup"
      aria-label={p.etiqueta}
      className={cx(css.segmentado, p.anchoCompleto && css.completo, p.className)}
      style={vars({ '--n': Math.max(1, p.opciones.length), '--i': indice })}
      onKeyDown={alTecla}
    >
      <span className={cx(css.pulgar, 'fc-fill')} aria-hidden="true" />
      {p.opciones.map((o, i) => {
        const activa = i === indice;
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={activa}
            tabIndex={activa ? 0 : -1}
            className={css.opcion}
            onClick={() => elegir(i)}
          >
            {o.icono ? <Icono nombre={o.icono} tamano={16} /> : null}
            <span className={css.etiqueta}>{o.etiqueta}</span>
            {o.conteo !== undefined ? <span className={css.conteo}>{formato.numero(o.conteo)}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
