/**
 * Rótulos directos sobre una columna (02 §9.4.6, etiquetas selectivas: solo el máximo y el extremo):
 * - 'pico': el máximo (11 px, text-2, 600);
 * - 'actual': el valor del último periodo, el extremo (11 px, text-3), encima del «en curso» si lo hay;
 * - 'en_curso': «en curso» (micro, 11 px, text-3), en uno o dos renglones.
 * La posición (renglones, x, ancla y base) la decide colocarRotulos (escalas.ts) para que ningún rótulo pise una barra
 * ajena ni a otro rótulo; aquí solo se pinta.
 */
import type { ReactElement } from 'react';
import { ALTO_RENGLON_ROTULO, type RotuloColocado } from './escalas';
import css from './graficas.module.css';

export function RotuloArriba(p: { tipo: 'en_curso' | 'pico' | 'actual'; rotulo: RotuloColocado }): ReactElement {
  const { renglones, x, ancla, yBase } = p.rotulo;
  const y0 = yBase - (renglones.length - 1) * ALTO_RENGLON_ROTULO;
  const clase = p.tipo === 'en_curso' ? css.enCursoTexto : p.tipo === 'pico' ? css.pico : css.ultimoValor;
  return (
    <text x={x} y={y0} textAnchor={ancla} className={clase}>
      {renglones.length === 1
        ? renglones[0]
        : renglones.map((r, k) => (
            <tspan key={r} x={x} dy={k === 0 ? 0 : ALTO_RENGLON_ROTULO}>
              {r}
            </tspan>
          ))}
    </text>
  );
}
