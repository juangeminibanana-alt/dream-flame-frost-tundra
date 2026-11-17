/**
 * «¿Dónde está tu dinero?» y «De quién depende tu comisión» (01 §4.11 #2 y #5, 02 §9.4): barras horizontales apiladas
 * con leyenda con montos, etiquetas directas (la dependencia usa los slots 2 y 3 juntos: obligatorias, 02 §9.2), aria
 * por bloque y tabla gemela.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { BarraApilada, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { partesDependencia, partesDinero, totalComision } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export function DondeDinero(p: { kpis: C.Kpis }): ReactElement {
  const d = partesDinero(p.kpis);
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      <BarraApilada titulo={T.dinero.titulo} partes={d.partes} tablaGemela={d.tabla} />
      <p className={css.corte}>{T.dinero.total(formato.dinero(totalComision(p.kpis)))}</p>
      <dl className={css.ayudas}>
        {d.ayudas.map((a) => (
          <div key={a.id} className={css.ayuda}>
            <dt>{a.titulo}</dt>
            <dd>{a.texto}</dd>
          </div>
        ))}
      </dl>
    </Tarjeta>
  );
}

export function Dependencia(p: { tiendas: C.FilaTienda[] | undefined; total: C.Centavos; error: ErrorHub | null; alReintentar: () => void }): ReactElement {
  let cuerpo: ReactElement;
  if (!p.tiendas && p.error) {
    cuerpo = (
      <>
        <h3 className={css.tarjetaTitulo}>{T.dependencia.titulo}</h3>
        <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />
      </>
    );
  } else if (!p.tiendas) cuerpo = <EsqueletoSeccion alto={120} />;
  else {
    const d = partesDependencia(p.tiendas, p.total);
    cuerpo =
      d.partes.length === 0 ? (
        <>
          <h3 className={css.tarjetaTitulo}>{T.dependencia.titulo}</h3>
          <p className={css.vacioSuave}>{T.dependencia.sinVentas}</p>
        </>
      ) : (
        <>
          <BarraApilada titulo={T.dependencia.titulo} partes={d.partes} etiquetasDirectas tablaGemela={d.tabla} />
          {d.principal ? (
            <p className={css.textoNota}>
              {T.dependencia.texto(d.principal.nombre, d.principal.pct)}
              {d.principal.fraccion >= 0.5 ? ` ${T.dependencia.riesgo}` : ''}
            </p>
          ) : null}
        </>
      );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      {cuerpo}
    </Tarjeta>
  );
}
