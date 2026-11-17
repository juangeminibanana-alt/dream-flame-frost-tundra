/**
 * Columnas de UNA serie (02 §9.1, §9.4): --viz-mono; hover/foco/selección en --viz-current con transición de fill.
 * Barras como el lienzo aprobado (Main.png: 46 px en semanas, gap 10), nunca bajo el 62 % de la ranura (anchoBarra; el lienzo
 * manda sobre los 24 px de 02 §9.4.4, LEEME.md:17), extremo de datos redondeado a 4 px y base recta. Retícula fina
 * --viz-grid y línea base --viz-axis. Etiquetas directas selectivas: el máximo (en reposo esa columna va en
 * --viz-current, Main.png) y el último valor, el extremo; colocarRotulos los pone sin pisar ninguna barra ajena ni a otro
 * rótulo, contando el anclaje al borde (el último se quita si no cabe). Periodo en curso: relleno al 35 % con contorno de
 * 1.5 px y "en curso". Eje X con etiquetasEje (desde el final, sin encimarse y ancladas al borde). Cada
 * columna es su objetivo (la ranura completa), enfocable con aria-label. Tabla gemela.
 */
import { useState, type ReactElement } from 'react';
import type { GraficaColumnasProps } from '@firmas/componentes';
import { cx } from '../util/clases';
import { anchoBarra, anchoTexto, barraVertical, colocarRotulos, etiquetasEje, marcasEje, partirAria } from './escalas';
import { LecturaGrafica, MarcoGrafica } from './MarcoGrafica';
import { RotuloArriba } from './RotuloArriba';
import { useRoving } from './roving';
import css from './graficas.module.css';

const ANCHO_RESPALDO = 640;
/** Ancho de barra del lienzo aprobado para columnas semanales (Main.html: max-width 46px). */
const BARRA_LIENZO = 46;

export function GraficaColumnas(p: GraficaColumnasProps): ReactElement {
  const [activa, setActiva] = useState<number | null>(null);
  const roving = useRoving(p.puntos.length);
  return (
    <MarcoGrafica titulo={p.titulo} nota={p.nota} tablaGemela={p.tablaGemela} className={p.className}>
      {({ ancho }) => {
        const W = ancho > 0 ? ancho : ANCHO_RESPALDO;
        const H = p.alto ?? 200;
        const valores = p.puntos.map((x) => Math.max(0, x.valor));
        const maximo = Math.max(0, ...valores);
        const marcas = marcasEje(maximo);
        const tope = marcas[marcas.length - 1] ?? 1;
        const textosEje = marcas.map((m) => p.formatoEje(m));
        const izq = Math.ceil(Math.max(...textosEje.map((t) => anchoTexto(t)), 12)) + 10;
        const arriba = 22;
        const abajo = 24;
        const anchoUtil = Math.max(1, W - izq - 4);
        const altoUtil = Math.max(1, H - arriba - abajo);
        const n = Math.max(1, p.puntos.length);
        const ranura = anchoUtil / n;
        const barra = anchoBarra(ranura, BARRA_LIENZO);
        const y = (v: number): number => arriba + altoUtil - (v / tope) * altoUtil;
        const centro = (i: number): number => izq + (i + 0.5) * ranura;
        const iMax = valores.indexOf(maximo);
        const yTopeDe = (v: number): number => Math.min(y(v), y(0) - (v > 0 ? 1 : 0));
        // Rótulos directos (pico, «en curso» y el último valor) colocados sin pisar barras ajenas ni entre sí.
        const iUltimo = p.puntos.length - 1;
        const ultimo = p.puntos[iUltimo];
        const rotulos = colocarRotulos({
          columnas: p.puntos.map((pt, i) => ({ centro: centro(i), yTope: yTopeDe(Math.max(0, pt.valor)), enCurso: !!pt.enCurso })),
          barra,
          yBase: y(0),
          ancho: W,
          pico: maximo > 0 && iMax >= 0 ? { i: iMax, texto: p.formatoEje(maximo) } : null,
          ultimo: ultimo && iUltimo > 0 && iUltimo !== iMax && ultimo.valor > 0 ? { i: iUltimo, texto: p.formatoEje(ultimo.valor) } : null,
        });
        const visibles = new Map(etiquetasEje(p.puntos.map((x) => x.etiqueta), centro, 0, W - 4, 6, maximo > 0 ? [iMax] : []).map((e) => [e.i, e]));
        const puntoActivo = activa !== null ? p.puntos[activa] : undefined;
        const lectura = puntoActivo ? partirAria(puntoActivo.aria, puntoActivo.etiqueta) : null;
        return (
          <>
            <svg
              ref={roving.contenedor}
              className={css.svg}
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              role="group"
              aria-label={p.titulo}
              onKeyDown={roving.alTecla}
            >
              {marcas.map((m, i) => (
                <g key={m}>
                  <line x1={izq} x2={W - 4} y1={y(m)} y2={y(m)} className={m === 0 ? css.base : css.reticula} />
                  <text x={izq - 8} y={y(m) + 4} textAnchor="end" className={css.eje}>
                    {textosEje[i]}
                  </text>
                </g>
              ))}
              {p.puntos.map((pt, i) => {
                const cx0 = izq + (i + 0.5) * ranura;
                const d = barraVertical(cx0 - barra / 2, barra, y(0), yTopeDe(Math.max(0, pt.valor)));
                const rotuloEnCurso = rotulos.enCurso.get(i);
                const etiquetaX = visibles.get(i);
                // Selección por omisión: sin hover ni foco, la columna pico va en --viz-current (como Main.png);
                // en cuanto otra columna toma el hover o el foco, la pico vuelve a grafito (una sola en iris).
                const picoEnReposo = activa === null && i === iMax && maximo > 0 && !pt.enCurso;
                return (
                  <g
                    key={pt.clave}
                    data-marca={i}
                    className={cx(css.marca, activa === i && css.marcaActiva, picoEnReposo && css.marcaPico, pt.enCurso && css.enCurso)}
                    tabIndex={i === roving.foco ? 0 : -1}
                    role="img"
                    aria-label={pt.aria}
                    onMouseEnter={() => setActiva(i)}
                    onMouseLeave={() => setActiva(null)}
                    onFocus={() => {
                      setActiva(i);
                      roving.setFoco(i);
                    }}
                    onBlur={() => setActiva(null)}
                  >
                    <rect x={cx0 - ranura / 2} y={arriba} width={ranura} height={altoUtil} className={css.objetivo} />
                    {d ? <path d={d} className={css.barra} /> : null}
                    {etiquetaX ? (
                      <text x={etiquetaX.x} y={H - 7} textAnchor={etiquetaX.ancla} className={cx(css.eje, activa === i && css.ejeActivo)}>
                        {pt.etiqueta}
                      </text>
                    ) : null}
                    {rotuloEnCurso ? <RotuloArriba tipo="en_curso" rotulo={rotuloEnCurso} /> : null}
                    {i === iMax && rotulos.pico ? <RotuloArriba tipo="pico" rotulo={rotulos.pico} /> : null}
                    {i === iUltimo && rotulos.ultimo ? <RotuloArriba tipo="actual" rotulo={rotulos.ultimo} /> : null}
                  </g>
                );
              })}
            </svg>
            {lectura && activa !== null ? (
              <LecturaGrafica x={izq + (activa + 0.5) * ranura} y={y(Math.max(0, puntoActivo?.valor ?? 0))} ancho={W} valor={lectura.valor} etiqueta={`${lectura.etiqueta}${puntoActivo?.enCurso ? ' · en curso' : ''}`} />
            ) : null}
          </>
        );
      }}
    </MarcoGrafica>
  );
}
