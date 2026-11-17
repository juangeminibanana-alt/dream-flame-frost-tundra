/**
 * Marco común de las gráficas (02 §9.4): título (title3) con su nota, "Ver como tabla" (tabla gemela accesible en todas
 * las gráficas), leyenda opcional y el área de trazado con UNA sola animación de aparición (clip-path en Windows,
 * fundido en Android; nada con movimiento reducido).
 */
import { useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { TablaGemela } from '@firmas/componentes';
import { Boton } from '../Boton';
import { cx } from '../util/clases';
import { usePlataformaHtml } from '../util/entorno';
import { useTamano, type Tamano } from '../util/medidas';
import css from './graficas.module.css';

const NUMERICA = /^[−\-+≈$]?\s?\$?[\d.,]+(\s?(%|mil|M))?$/;
const MONTO_FINAL = /^[−\-+≈]?\s?\$[\d.,]+(\s?(mil|M))?$/;

/** Nota de texto que termina en « · $monto»: el monto va resaltado (text-1, 600) y el resto se queda en text-2. */
function notaConCifra(nota: ReactNode): ReactNode {
  if (typeof nota !== 'string') return nota;
  const i = nota.lastIndexOf(' · ');
  const cola = i >= 0 ? nota.slice(i + 3) : '';
  if (!MONTO_FINAL.test(cola.trim())) return nota;
  return (
    <>
      {nota.slice(0, i + 3)}
      <b className={css.notaCifra}>{cola}</b>
    </>
  );
}

export function TablaGemelaVista(p: { titulo: string; tabla: TablaGemela; id?: string }): ReactElement {
  const derecha = p.tabla.columnas.map((_, ci) => p.tabla.filas.length > 0 && p.tabla.filas.every((f) => NUMERICA.test((f[ci] ?? '').trim())));
  return (
    <div className={css.tablaGemela} id={p.id}>
      <table className={css.tabla}>
        <caption className={css.sr}>{p.titulo}</caption>
        <thead>
          <tr>
            {p.tabla.columnas.map((c, i) => (
              <th key={c} scope="col" className={cx(derecha[i] && css.num)}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {p.tabla.filas.map((f, i) => (
            <tr key={i}>
              {f.map((celda, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row">
                    {celda}
                  </th>
                ) : (
                  <td key={ci} className={cx(derecha[ci] && css.num)}>
                    {celda}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface MarcoGraficaProps {
  titulo: string;
  nota?: ReactNode | undefined;
  tablaGemela: TablaGemela;
  leyenda?: ReactNode | undefined;
  className?: string | undefined;
  /** Recibe el tamaño medido del área de trazado. */
  children: (t: Tamano) => ReactNode;
}

export function MarcoGrafica(p: MarcoGraficaProps): ReactElement {
  const plataforma = usePlataformaHtml();
  const idTitulo = useId();
  const idTabla = useId();
  const [verTabla, setVerTabla] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const tamano = useTamano(area);
  const [primera, setPrimera] = useState(true);
  useLayoutEffect(() => {
    const t = window.setTimeout(() => setPrimera(false), 600);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <figure className={cx(css.grafica, p.className)} aria-labelledby={idTitulo}>
      <figcaption className={css.cabeza}>
        <h3 className={css.titulo} id={idTitulo}>
          {p.titulo}
        </h3>
        {p.nota ? <span className={css.nota}>{notaConCifra(p.nota)}</span> : null}
        <span className={css.verTabla}>
          <Boton variante="fantasma" tamano="sm" icono={verTabla ? 'ChartColumn' : 'LayoutList'} alPulsar={() => setVerTabla((v) => !v)} aria-label={verTabla ? `Ver gráfica: ${p.titulo}` : `Ver como tabla: ${p.titulo}`}>
            {verTabla ? 'Ver gráfica' : 'Ver como tabla'}
          </Boton>
        </span>
      </figcaption>
      {p.leyenda && !verTabla ? <div className={css.leyenda}>{p.leyenda}</div> : null}
      <div
        ref={area}
        className={cx(css.area, primera && (plataforma === 'android' ? css.apareceFundido : css.aparece), 'anim-grow', 'fc-keep')}
        hidden={verTabla}
      >
        {p.children(tamano)}
      </div>
      {verTabla ? <TablaGemelaVista titulo={p.titulo} tabla={p.tablaGemela} id={idTabla} /> : null}
    </figure>
  );
}

/** Lectura flotante de la marca con hover o foco: el valor manda y la etiqueta acompaña (02 §7.20). */
export function LecturaGrafica(p: { x: number; y: number; ancho: number; valor: string; etiqueta: string; filas?: Array<{ clave: string; etiqueta: string; valor: string; muestra: string }> | undefined }): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [anchoGlobo, setAnchoGlobo] = useState(160);
  const [altoGlobo, setAltoGlobo] = useState(48);
  useLayoutEffect(() => {
    if (!ref.current) return;
    setAnchoGlobo(ref.current.offsetWidth || 160);
    setAltoGlobo(ref.current.offsetHeight || 48);
  }, [p.valor, p.etiqueta, p.filas]);
  const x = Math.max(0, Math.min(p.ancho - anchoGlobo, p.x - anchoGlobo / 2));
  const arriba = p.y - altoGlobo - 10;
  const y = arriba < -8 ? p.y + 14 : arriba;
  return (
    <div ref={ref} className={css.lectura} style={{ left: x, top: y }} aria-hidden="true">
      <b className={css.lecturaValor}>{p.valor}</b>
      <span className={css.lecturaEtiqueta}>{p.etiqueta}</span>
      {p.filas && p.filas.length > 0 ? (
        <span className={css.lecturaFilas}>
          {p.filas.map((f) => (
            <span key={f.clave} className={css.lecturaFila}>
              <i className={cx(css.clave, css[f.muestra])} />
              <span className={css.lecturaFilaEtiqueta}>{f.etiqueta}</span>
              <b>{f.valor}</b>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}
