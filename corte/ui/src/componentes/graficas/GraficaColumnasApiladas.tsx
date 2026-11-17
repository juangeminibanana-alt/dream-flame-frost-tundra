/**
 * Columnas apiladas (02 §9.1–9.4, 01 §4.11): series en orden fijo de la paleta categórica (la misma entidad, el mismo
 * slot); 'tenue' = mismo tono al 35 % con contorno de 1.5 px; 'rayado' = perdido por reembolsos (45°, gris); 'neutro' =
 * "Otras". Barras como el lienzo aprobado (Ventas.png: 64 px en meses, gap 14), nunca bajo el 62 % de la ranura (el lienzo manda
 * sobre los 24 px de 02 §9.4.4, LEEME.md:17); 2 px de separación real entre segmentos, extremo superior redondeado a
 * 4 px y base recta en la línea base. Leyenda siempre (≥ 2 series), una lectura con todas las series por columna y
 * tabla gemela. Etiquetas directas selectivas: lo ganado en el pico y en el último periodo (el extremo); colocarRotulos
 * los pone sin pisar ninguna barra ajena ni a otro rótulo, contando el anclaje al borde. Periodo en curso al 35 % con contorno y "en curso". Eje X con etiquetasEje: se cuentan desde el final, nunca
 * se enciman y la que se saldría se ancla al borde.
 */
import { useId, useState, type ReactElement } from 'react';
import type { GraficaColumnasApiladasProps, SerieApilada, TablaGemela } from '@firmas/componentes';
import { cx } from '../util/clases';
import { anchoBarra, anchoTexto, barraVertical, colocarRotulos, etiquetasEje, marcasEje, partirAria } from './escalas';
import { LecturaGrafica, MarcoGrafica } from './MarcoGrafica';
import { RotuloArriba } from './RotuloArriba';
import { Leyenda, claseMuestra, slotsDeSeries } from './Leyenda';
import { useRoving } from './roving';
import css from './graficas.module.css';

const ANCHO_RESPALDO = 640;
const SEPARACION = 2;
/** Ancho de barra del lienzo aprobado para columnas mensuales (Ventas.html: max-width 64px). */
const BARRA_LIENZO = 64;
/** Separación entre columnas del lienzo (Ventas.html: gap 14px). */
const GAP_LIENZO = 14;

/** La lectura muestra el monto exacto de la tabla gemela (fila = columna de la gráfica, columna = nombre de la serie)
 *  cuando la tabla trae una fila por punto; si no, cae al formato del eje ('$X.X mil'). */
function valorExacto(tabla: TablaGemela, fila: number, puntos: number, serie: string): string | null {
  if (tabla.filas.length !== puntos) return null;
  const columna = tabla.columnas.indexOf(serie);
  if (columna <= 0) return null;
  return tabla.filas[fila]?.[columna] ?? null;
}

export function GraficaColumnasApiladas(p: GraficaColumnasApiladasProps): ReactElement {
  const [activa, setActiva] = useState<number | null>(null);
  const roving = useRoving(p.puntos.length);
  const idPatron = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const slots = slotsDeSeries(p.series);
  const leyenda = <Leyenda series={p.series} slots={slots} />;
  return (
    <MarcoGrafica titulo={p.titulo} tablaGemela={p.tablaGemela} className={p.className} leyenda={leyenda}>
      {({ ancho }) => {
        const W = ancho > 0 ? ancho : ANCHO_RESPALDO;
        const H = p.alto ?? 220;
        const totales = p.puntos.map((pt) => p.series.reduce((a, s) => a + Math.max(0, pt.valores[s.id] ?? 0), 0));
        const maximo = Math.max(0, ...totales);
        // El rótulo del pico dice lo ganado: sin la serie rayada (perdida por reembolsos), que sí cuenta en el alto de
        // la pila y en el eje. Así «$X.X mil» sobre un mes coincide con el KPI de comisión, no la suma apilada bruta.
        const ganados = p.puntos.map((pt) => p.series.reduce((a, s) => (s.estilo === 'rayado' ? a : a + Math.max(0, pt.valores[s.id] ?? 0)), 0));
        const maximoGanado = Math.max(0, ...ganados);
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
        const barra = anchoBarra(ranura, BARRA_LIENZO, GAP_LIENZO);
        const y = (v: number): number => arriba + altoUtil - (v / tope) * altoUtil;
        const centro = (i: number): number => izq + (i + 0.5) * ranura;
        const iMax = maximoGanado > 0 ? ganados.indexOf(maximoGanado) : -1;
        // Rótulos directos (pico y último periodo, lo ganado; «en curso») colocados sin pisar barras ajenas ni entre sí.
        const iUltimo = p.puntos.length - 1;
        const ultimo = p.puntos[iUltimo];
        const ganadoUltimo = ganados[iUltimo] ?? 0;
        const rotulos = colocarRotulos({
          columnas: p.puntos.map((pt, i) => ({ centro: centro(i), yTope: y(totales[i] ?? 0), enCurso: !!pt.enCurso })),
          barra,
          yBase: y(0),
          ancho: W,
          pico: iMax >= 0 ? { i: iMax, texto: p.formatoEje(maximoGanado) } : null,
          ultimo: ultimo && iUltimo > 0 && iUltimo !== iMax && ganadoUltimo > 0 ? { i: iUltimo, texto: p.formatoEje(ganadoUltimo) } : null,
        });
        const visibles = new Map(etiquetasEje(p.puntos.map((x) => x.etiqueta), centro, 0, W - 4, 6, iMax >= 0 ? [iMax] : []).map((e) => [e.i, e]));
        const puntoActivo = activa !== null ? p.puntos[activa] : undefined;
        const lectura = puntoActivo ? partirAria(puntoActivo.aria, puntoActivo.etiqueta) : null;
        return (
          <>
            <svg ref={roving.contenedor} className={css.svg} width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="group" aria-label={p.titulo} onKeyDown={roving.alTecla}>
              <defs>
                <pattern id={`rayado-${idPatron}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" className={css.rayadoFondo} />
                  <rect width="1" height="6" className={css.rayadoLinea} />
                </pattern>
              </defs>
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
                const conValor = p.series.filter((s) => (pt.valores[s.id] ?? 0) > 0);
                const ultima = conValor[conValor.length - 1];
                let acumulado = 0;
                const segmentos = conValor.map((s: SerieApilada) => {
                  const v = Math.max(0, pt.valores[s.id] ?? 0);
                  const y0 = y(acumulado);
                  acumulado += v;
                  const esTope = s.id === ultima?.id;
                  const y1 = y(acumulado) + (esTope ? 0 : SEPARACION);
                  if (y0 - y1 < 0.5) return null;
                  const d = barraVertical(cx0 - barra / 2, barra, y0, y1, 4, esTope);
                  const tenue = s.estilo === 'tenue' || (!!pt.enCurso && s.estilo !== 'rayado');
                  const color = s.estilo === 'rayado' ? null : s.estilo === 'neutro' ? css.neutroSerie : css[`s${slots[s.id] ?? 1}`];
                  return (
                    <path
                      key={s.id}
                      d={d}
                      className={cx(css.segmento, color, tenue && css.tenue)}
                      {...(s.estilo === 'rayado' ? { fill: `url(#rayado-${idPatron})` } : {})}
                    />
                  );
                });
                const etiquetaX = visibles.get(i);
                const rotuloEnCurso = rotulos.enCurso.get(i);
                return (
                  <g
                    key={pt.clave}
                    data-marca={i}
                    className={cx(css.marca, css.marcaApilada, activa === i && css.marcaActiva)}
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
                    {segmentos}
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
            {lectura && puntoActivo && activa !== null ? (
              <LecturaGrafica
                x={izq + (activa + 0.5) * ranura}
                y={y(totales[activa] ?? 0)}
                ancho={W}
                valor={lectura.valor}
                etiqueta={`${lectura.etiqueta}${puntoActivo.enCurso ? ' · en curso' : ''}`}
                filas={[...p.series].reverse().map((s) => ({
                  clave: s.id,
                  etiqueta: s.etiqueta,
                  valor: valorExacto(p.tablaGemela, activa, p.puntos.length, s.etiqueta) ?? p.formatoEje(Math.max(0, puntoActivo.valores[s.id] ?? 0)),
                  muestra: claseMuestra(s, slots),
                }))}
              />
            ) : null}
          </>
        );
      }}
    </MarcoGrafica>
  );
}
