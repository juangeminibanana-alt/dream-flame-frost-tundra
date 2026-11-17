/* __DOBLE_CORTE__ · doble de @/componentes: gráficas. Cada una pinta su título y la tabla gemela (02 §9),
   que es justo lo que una gráfica real también entrega a los lectores de pantalla. */
import type { ReactElement } from 'react';
import type {
  BarraApiladaProps, BarrasHorizontalesProps, GraficaColumnasApiladasProps, GraficaColumnasProps, TablaGemela,
} from '@firmas/componentes';
import type { FechaLocal } from '@/contrato';
import { Caja, estilosDoble as css } from '../comun/Caja';

function Gemela(p: { titulo: string; tabla: TablaGemela }): ReactElement {
  return (
    <table className={css.tabla} aria-label={p.titulo}>
      <thead>
        <tr>
          {p.tabla.columnas.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {p.tabla.filas.map((f, i) => (
          <tr key={`${i}-${f.join('|')}`}>
            {f.map((celda, k) => (
              <td key={`${k}-${celda}`}>{celda}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function GraficaColumnas(p: GraficaColumnasProps): ReactElement {
  return (
    <Caja nombre="GraficaColumnas" props={{ puntos: p.puntos, alto: p.alto }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      {p.nota ? <span className={css.atenuado}>{p.nota}</span> : null}
      <Gemela titulo={p.titulo} tabla={p.tablaGemela} />
    </Caja>
  );
}

export function GraficaColumnasApiladas(p: GraficaColumnasApiladasProps): ReactElement {
  return (
    <Caja nombre="GraficaColumnasApiladas" props={{ series: p.series, puntos: p.puntos }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      <Gemela titulo={p.titulo} tabla={p.tablaGemela} />
    </Caja>
  );
}

export function BarraApilada(p: BarraApiladaProps): ReactElement {
  return (
    <Caja nombre="BarraApilada" props={{ partes: p.partes }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      <Gemela titulo={p.titulo} tabla={p.tablaGemela} />
    </Caja>
  );
}

export function BarrasHorizontales(p: BarrasHorizontalesProps): ReactElement {
  return (
    <Caja nombre="BarrasHorizontales" props={{ filas: p.filas }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      <Gemela titulo={p.titulo} tabla={p.tablaGemela} />
    </Caja>
  );
}

export function Sparkline(p: { valores: number[]; resumen: string; ancho?: number; alto?: number; className?: string }): ReactElement {
  return <Caja nombre="Sparkline" props={{ valores: p.valores }} enLinea className={p.className} etiqueta={p.resumen} />;
}

export function CalendarioCalor(p: { titulo: string; dias: { fecha: FechaLocal; valor: number; texto: string }[]; tablaGemela: TablaGemela; className?: string }): ReactElement {
  return (
    <Caja nombre="CalendarioCalor" props={{ dias: p.dias }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      <Gemela titulo={p.titulo} tabla={p.tablaGemela} />
    </Caja>
  );
}
