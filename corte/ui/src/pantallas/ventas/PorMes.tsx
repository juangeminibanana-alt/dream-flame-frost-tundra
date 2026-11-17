/**
 * «Por mes» (01 §4.11 #6): tabla en escritorio (Mes · Pedidos · Reembolsados · Tasa · Comisión estimada · Liquidada,
 * cifras alineadas a la derecha) y lista desplegable en celular. El mes en curso dice «nov (al 12)».
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { Tarjeta } from '@/componentes';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { filasPorMes } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export function PorMes(p: { puntos: C.PuntoSerie[] | undefined; hoyHub: C.FechaLocal; compacto: boolean; error: ErrorHub | null; alReintentar: () => void }): ReactElement | null {
  let cuerpo: ReactElement;
  if (!p.puntos && p.error) cuerpo = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.puntos) cuerpo = <EsqueletoSeccion alto={160} />;
  else {
    const filas = filasPorMes(p.puntos, p.hoyHub);
    if (filas.length === 0) return null;
    const [cMes, cPedidos, cReemb, cTasa, cComision, cLiquidada] = T.porMes.columnas;
    cuerpo = p.compacto ? (
      <ul className={css.mesesLista}>
        {filas.map((f) => (
          <li key={f.clave}>
            <details className={css.mesDetalle}>
              <summary className={css.mesResumen}>
                <span className={css.mesNombre}>{f.mes}</span>
                <span className={css.mesCifra}>{f.comision}</span>
              </summary>
              <dl className={css.mesDatos}>
                <div>
                  <dt>{cPedidos}</dt>
                  <dd>{f.pedidos}</dd>
                </div>
                <div>
                  <dt>{cReemb}</dt>
                  <dd>
                    {f.reembolsados} · {f.tasa}
                  </dd>
                </div>
                <div>
                  <dt>{cLiquidada}</dt>
                  <dd>{f.liquidada}</dd>
                </div>
              </dl>
            </details>
          </li>
        ))}
      </ul>
    ) : (
      <div className={css.tablaDesplaza}>
        <table className={css.tablaMeses}>
          <caption className={css.srSolo}>{T.porMes.titulo}</caption>
          <thead>
            <tr>
              <th scope="col">{cMes}</th>
              <th scope="col" className={css.num}>
                {cPedidos}
              </th>
              <th scope="col" className={css.num}>
                {cReemb}
              </th>
              <th scope="col" className={css.num}>
                {cTasa}
              </th>
              <th scope="col" className={css.num}>
                {cComision}
              </th>
              <th scope="col" className={css.num}>
                {cLiquidada}
              </th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.clave} data-en-curso={f.enCurso ? '' : undefined}>
                <th scope="row">{f.mes}</th>
                <td className={css.num}>{f.pedidos}</td>
                <td className={css.num}>{f.reembolsados}</td>
                <td className={css.num}>{f.tasa}</td>
                <td className={css.num}>{f.comision}</td>
                <td className={css.num}>{f.liquidada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      <section className={css.seccion} aria-labelledby="ventas-por-mes">
        <h3 className={css.tarjetaTitulo} id="ventas-por-mes">
          {T.porMes.titulo}
        </h3>
        {cuerpo}
      </section>
    </Tarjeta>
  );
}
