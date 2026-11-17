/**
 * Gráfica principal (01 §4.11 #3, 02 §9): «Comisión por {día|semana|mes}» en columnas apiladas Liquidada + Por
 * liquidar (mismo tono: sólido y al 35 % con contorno), o UNA serie en --viz-mono con Pedidos, Unidades o Tasa de
 * reembolso (un solo eje Y siempre). El periodo en curso va marcado y no se extrapola; lectura con hover/foco por
 * columna, nota automática «Tu mejor … del periodo» y tabla gemela («Ver como tabla»).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { ChipFiltro, GraficaColumnas, GraficaColumnasApiladas, Segmentado, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { datosApiladas, datosSimple, mejorPeriodo, METRICAS, type Metrica, type PuntoVentas } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export interface GraficaPrincipalProps {
  puntos: PuntoVentas[] | undefined;
  granularidad: C.Granularidad;
  /** Inicio del rango (nombra la primera semana parcial desde ahí). */
  desde?: C.FechaLocal;
  permitidas: C.Granularidad[];
  metrica: Metrica;
  error: ErrorHub | null;
  compacto: boolean;
  alCambiarMetrica: (m: Metrica) => void;
  alCambiarGranularidad: (g: C.Granularidad) => void;
  alReintentar: () => void;
}

export function GraficaPrincipal(p: GraficaPrincipalProps): ReactElement {
  const alto = p.compacto ? 200 : 260;
  let grafica: ReactElement;
  if (!p.puntos && p.error) grafica = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.puntos) grafica = <EsqueletoSeccion alto={alto} />;
  else if (p.metrica === 'comision') {
    const d = datosApiladas(p.puntos);
    grafica = (
      <GraficaColumnasApiladas
        titulo={T.grafica.titulo('comision', p.granularidad)}
        series={d.series}
        puntos={d.puntos}
        formatoEje={(v) => formato.ejeDinero(v)}
        alto={alto}
        tablaGemela={d.tabla}
      />
    );
  } else {
    const d = datosSimple(p.puntos, p.metrica);
    grafica = <GraficaColumnas titulo={T.grafica.titulo(p.metrica, p.granularidad)} puntos={d.puntos} formatoEje={d.formatoEje} alto={alto} tablaGemela={d.tabla} />;
  }
  const mejor = p.puntos && p.metrica === 'comision' ? mejorPeriodo(p.puntos, p.granularidad, p.desde) : null;
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      {p.compacto ? (
        <div className={css.graficaControlesCompactos}>
          <div className={css.chipsMetrica} role="group" aria-label={T.grafica.metrica}>
            {METRICAS.map((m) => (
              <ChipFiltro key={m} activo={p.metrica === m} alCambiar={() => p.alCambiarMetrica(m)}>
                {T.grafica.metricas[m]}
              </ChipFiltro>
            ))}
          </div>
          {p.permitidas.length > 1 ? (
            <Segmentado<C.Granularidad>
              etiqueta={T.grafica.agrupar}
              opciones={p.permitidas.map((g) => ({ valor: g, etiqueta: T.grafica.granularidades[g] }))}
              valor={p.granularidad}
              alCambiar={p.alCambiarGranularidad}
              anchoCompleto
            />
          ) : null}
        </div>
      ) : (
      <div className={css.graficaControles}>
        <Segmentado<Metrica>
          etiqueta={T.grafica.metrica}
          opciones={METRICAS.map((m) => ({ valor: m, etiqueta: T.grafica.metricas[m] }))}
          valor={p.metrica}
          alCambiar={p.alCambiarMetrica}
          className={css.segmentoMetrica}
        />
        {p.permitidas.length > 1 ? (
          <Segmentado<C.Granularidad>
            etiqueta={T.grafica.agrupar}
            opciones={p.permitidas.map((g) => ({ valor: g, etiqueta: T.grafica.granularidades[g] }))}
            valor={p.granularidad}
            alCambiar={p.alCambiarGranularidad}
            className={css.segmentoGran}
          />
        ) : null}
      </div>
      )}
      {grafica}
      {/* La nota automática (solo hechos) va al pie de la gráfica, como conclusión: encima del título de la figura
          competía con él y parecía el subtítulo de los controles. */}
      {mejor ? <p className={css.notaGrafica}>{mejor}</p> : null}
    </Tarjeta>
  );
}
