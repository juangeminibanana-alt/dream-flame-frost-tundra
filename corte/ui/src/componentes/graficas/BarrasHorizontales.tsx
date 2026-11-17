/**
 * Barras horizontales de UNA serie (02 §9.4 catálogo, "Tiendas que más te pagan"): nombre a la izquierda, valor y
 * secundario (%) a la derecha, barra de 8 px en --viz-mono con el extremo de datos redondeado a 4 px y base recta;
 * hover/foco en --viz-current. Filas pulsables si traen alPulsar. Los valores van impresos: la tabla gemela repite.
 */
import { useState, type ReactElement } from 'react';
import type { BarrasHorizontalesProps } from '@firmas/componentes';
import { Boton } from '../Boton';
import { cx, vars } from '../util/clases';
import { TablaGemelaVista } from './MarcoGrafica';
import css from './graficas.module.css';

export function BarrasHorizontales(p: BarrasHorizontalesProps): ReactElement {
  const [verTabla, setVerTabla] = useState(false);
  const maximo = Math.max(0, ...p.filas.map((f) => f.valor));
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
        <ol className={cx(css.horizontales, 'fc-keep')} role="list">
          {p.filas.map((f) => {
            const fraccion = maximo > 0 ? Math.max(0, f.valor) / maximo : 0;
            const contenido = (
              <>
                <span className={css.hFila}>
                  <span className={css.hEtiqueta}>{f.etiqueta}</span>
                  <span className={css.hValor}>
                    <b>{f.texto}</b>
                    {f.secundario ? <span className={css.hSecundario}> · {f.secundario}</span> : null}
                  </span>
                </span>
                <span className={css.hPista} aria-hidden="true">
                  <span className={css.hBarra} style={vars({ '--f': fraccion })} />
                </span>
              </>
            );
            const alPulsar = f.alPulsar;
            return (
              <li key={f.id} className={css.hElemento}>
                {alPulsar ? (
                  <button type="button" className={cx(css.hContenido, css.hPulsable)} onClick={() => alPulsar()}>
                    {contenido}
                  </button>
                ) : (
                  <div className={css.hContenido}>{contenido}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </figure>
  );
}
