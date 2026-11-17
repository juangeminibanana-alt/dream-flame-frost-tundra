/**
 * Barra horizontal apilada (02 §9.4 catálogo): "¿Dónde está tu dinero?" (Liquidada iris · Por liquidar iris 35 % con
 * contorno · Perdida por reembolsos rayada a 45°) y "De quién depende tu comisión" (5 tiendas en slots 1–5 con etiquetas
 * directas + "Otras" en neutro). 24 px de alto, bloques con radio 4 y 2 px de separación; la leyenda lleva montos y
 * porcentajes. Etiquetas directas (02 §9.2: coral y aqua juntos las exigen): «Tienda · 60 %» si cabe en el bloque, si
 * no solo el porcentaje y, si tampoco cabe, el porcentaje en un segundo renglón centrado en su bloque cuando no pisa
 * al de al lado. Lo que no cabe queda en la leyenda y la tabla gemela.
 */
import { useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import type { BarraApiladaProps } from '@firmas/componentes';
import { formato } from '@/dominio';
import { cx, vars } from '../util/clases';
import { anchoTexto } from './escalas';
import { claseMuestra, slotsDeSeries } from './Leyenda';
import { TablaGemelaVista } from './MarcoGrafica';
import { Boton } from '../Boton';
import { useTamano } from '../util/medidas';
import css from './graficas.module.css';

export function BarraApilada(p: BarraApiladaProps): ReactElement {
  const barra = useRef<HTMLDivElement>(null);
  const { ancho } = useTamano(barra);
  const [activa, setActiva] = useState<string | null>(null);
  const [foco, setFoco] = useState(0);
  const [verTabla, setVerTabla] = useState(false);
  const partes = p.partes.filter((x) => x.valor > 0);
  const total = partes.reduce((a, x) => a + x.valor, 0);
  const slots = slotsDeSeries(p.partes);
  const W = ancho > 0 ? ancho : 560;
  const util = W - Math.max(0, partes.length - 1) * 2;
  const pct = (v: number): string => formato.porcentaje(total > 0 ? v / total : 0, total > 0 && v / total < 0.1 ? 1 : 0);
  let acumulado = 0;
  const posiciones = partes.map((x) => {
    const izquierda = acumulado;
    const px = total > 0 ? (x.valor / total) * util : 0;
    acumulado += px + 2;
    return { id: x.id, izquierda, px };
  });

  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key) || partes.length === 0) return;
    e.preventDefault();
    let i = foco;
    if (e.key === 'ArrowRight') i = Math.min(partes.length - 1, foco + 1);
    if (e.key === 'ArrowLeft') i = Math.max(0, foco - 1);
    if (e.key === 'Home') i = 0;
    if (e.key === 'End') i = partes.length - 1;
    setFoco(i);
    barra.current?.querySelectorAll<HTMLElement>('[data-parte]')[i]?.focus();
  };
  const parteActiva = partes.find((x) => x.id === activa);

  return (
    <figure className={cx(css.grafica, p.className)} aria-label={p.titulo}>
      <figcaption className={css.cabeza}>
        <h3 className={css.titulo}>{p.titulo}</h3>
        <span className={css.verTabla}>
          <Boton variante="fantasma" tamano="sm" icono={verTabla ? 'ChartColumn' : 'LayoutList'} alPulsar={() => setVerTabla((v) => !v)} aria-label={verTabla ? `Ver gráfica: ${p.titulo}` : `Ver como tabla: ${p.titulo}`}>
            {verTabla ? 'Ver gráfica' : 'Ver como tabla'}
          </Boton>
        </span>
      </figcaption>
      {verTabla ? (
        <TablaGemelaVista titulo={p.titulo} tabla={p.tablaGemela} />
      ) : (
        <>
          <div ref={barra} className={cx(css.apilada, 'fc-keep')} role="group" aria-label={p.titulo} onKeyDown={alTecla}>
            {partes.map((x, i) => (
              <span
                key={x.id}
                data-parte=""
                className={cx(css.bloque, css[claseMuestra(x, slots)], activa === x.id && css.bloqueActivo)}
                style={vars({ '--crece': x.valor })}
                tabIndex={i === foco ? 0 : -1}
                role="img"
                aria-label={`${x.etiqueta}: ${x.texto} (${pct(x.valor)})`}
                onMouseEnter={() => setActiva(x.id)}
                onMouseLeave={() => setActiva(null)}
                onFocus={() => {
                  setActiva(x.id);
                  setFoco(i);
                }}
                onBlur={() => setActiva(null)}
              />
            ))}
            {total === 0 ? <span className={css.bloqueVacio} /> : null}
          </div>
          {p.etiquetasDirectas ? <EtiquetasDirectas partes={partes.map((x, i) => ({ id: x.id, etiqueta: x.etiqueta, pct: pct(x.valor), izquierda: posiciones[i]?.izquierda ?? 0, px: posiciones[i]?.px ?? 0 }))} ancho={W} /> : null}
          <div className={css.lecturaLinea} aria-hidden="true">
            {parteActiva ? (
              <>
                <b>{parteActiva.texto}</b> {parteActiva.etiqueta} · {pct(parteActiva.valor)}
              </>
            ) : null}
          </div>
          <ul className={css.leyendaLista} role="list">
            {p.partes.map((x) => (
              <li key={x.id} className={css.leyendaElemento}>
                <i className={cx(css.muestra, css[claseMuestra(x, slots)])} aria-hidden="true" />
                <span>{x.etiqueta}</span>
                <b className={css.leyendaValor}>{x.texto}</b>
                {total > 0 && x.valor > 0 ? <span className={css.leyendaPct}>{pct(x.valor)}</span> : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </figure>
  );
}

/** Etiquetas directas bajo los bloques: en el bloque si caben y, si no, el porcentaje escalonado en un 2.º renglón. */
function EtiquetasDirectas(p: { partes: Array<{ id: string; etiqueta: string; pct: string; izquierda: number; px: number }>; ancho: number }): ReactElement {
  let finSegundo = -Infinity;
  const filas = p.partes.map((x) => {
    const completo = `${x.etiqueta} · ${x.pct}`;
    if (x.px >= anchoTexto(completo, 12) + 8) return { ...x, texto: completo, renglon: 1 as const, left: x.izquierda, width: x.px as number | undefined };
    if (x.px >= anchoTexto(x.pct, 12) + 6) return { ...x, texto: x.pct, renglon: 1 as const, left: x.izquierda, width: x.px as number | undefined };
    const w = anchoTexto(x.pct, 12) + 2;
    const left = Math.max(0, Math.min(p.ancho - w, x.izquierda + x.px / 2 - w / 2));
    if (left < finSegundo + 6) return null;
    finSegundo = left + w;
    return { ...x, texto: x.pct, renglon: 2 as const, left, width: undefined };
  });
  const conSegundo = filas.some((f) => f?.renglon === 2);
  return (
    <div className={cx(css.directas, conSegundo && css.directasDos)} aria-hidden="true">
      {filas.map((f) =>
        f ? (
          <span key={f.id} className={cx(css.directa, f.renglon === 2 && css.directaSegunda)} style={{ left: f.left, ...(f.width !== undefined ? { width: f.width } : {}) }}>
            {f.texto}
          </span>
        ) : null,
      )}
    </div>
  );
}