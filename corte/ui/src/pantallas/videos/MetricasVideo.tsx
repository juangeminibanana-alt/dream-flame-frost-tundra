/**
 * rev. 5 · «En TikTok» del Detalle de video (Display API, contrato rev. 5): KPI de TikTok (vistas con su tendencia
 * acumulada, likes, comentarios y compartidos), la conversión (pedidos y comisión por cada 1,000 vistas, contra tu video
 * típico) y «Vistas nuevas por día» (GraficaColumnas, una serie fina en --viz-mono con tabla gemela y lectura al pasar).
 * - Campos AUSENTES (nunca se conectó la Display API): la sección no existe.
 * - null (privado, borrado o de otra cuenta): una línea que lo explica; las ventas siguen arriba.
 * - Tendencia con menos de 2 fotos: se dice cuándo aparece en vez de pintar una gráfica vacía. Sin `tendencia` (el
 *   detalle salió de la copia del celular, que no la trae): «necesita tu PC encendida», como la gráfica por semana.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { BandaKpi, GraficaColumnas, Kpi, Tarjeta } from '@/componentes';
import { formato, hoyLocal } from '@/dominio';
import { ejeVistas, serieAcumulada, textoPorMil, vistasPorDia } from './logica';
import { T } from './textos';
import { cx } from './util';
import css from './videos.module.css';

function Conversion(p: { video: C.FilaVideo; tipico: number | null }): ReactElement {
  const v = p.video;
  const x = v.pedidos_por_mil_vistas;
  return (
    <section aria-label={T.conversionTitulo} className={cx(css.conversion)} data-conversion="">
      <h2 className={cx(css.seccionTitulo)}>{T.conversionTitulo}</h2>
      {typeof x === 'number' ? (
        <>
          <p className={cx(css.conversionCifra)}>
            <span className={cx(css.conversionValor)}>{textoPorMil(x)}</span>
            <span className={cx(css.conversionEtiqueta)}>{T.conversionEtiqueta}</span>
          </p>
          {typeof v.comision_por_mil_vistas_centavos === 'number' ? (
            <p className={cx(css.conversionDato)}>{T.conversionComision(formato.dinero(v.comision_por_mil_vistas_centavos))}</p>
          ) : null}
          {p.tipico !== null ? <p className={cx(css.conversionDato)}>{T.conversionTipico(textoPorMil(p.tipico))}</p> : null}
          <p className={cx(css.seccionNota)}>{T.conversionNota}</p>
        </>
      ) : (
        <p className={cx(css.vacioCorto)}>{T.conversionSinVistas}</p>
      )}
    </section>
  );
}

function VistasPorDia(p: { tendencia: readonly C.PuntoTendenciaVideo[] | undefined; compacta: boolean }): ReactElement {
  const hoy = hoyLocal();
  const dias = vistasPorDia(p.tendencia ?? [], hoy, p.compacta ? 14 : 30);
  if (dias.length < 2) {
    return (
      <section aria-label={T.tendenciaTitulo} className={cx(css.seccionInterior)}>
        <h2 className={cx(css.seccionTitulo)}>{T.tendenciaTitulo}</h2>
        {/* Sin `tendencia` pero con vistas: el detalle salió de la copia del celular, que no la trae (como la serie). */}
        <p className={cx(css.vacioCorto)} data-tendencia-vacia="">{p.tendencia === undefined ? T.tendenciaSinPc : T.tendenciaPoca}</p>
      </section>
    );
  }
  let mejor: (typeof dias)[number] | null = null;
  for (const d of dias) if (d.nuevas > 0 && (!mejor || d.nuevas > mejor.nuevas)) mejor = d;
  return (
    <GraficaColumnas
      titulo={T.tendenciaTitulo}
      alto={p.compacta ? 160 : 188}
      {...(mejor ? { nota: T.tendenciaNota(formato.fechaCorta(mejor.fecha), formato.numero(mejor.nuevas)) } : {})}
      puntos={dias.map((d) => ({
        clave: d.fecha,
        etiqueta: formato.fechaCorta(d.fecha),
        valor: d.nuevas,
        // Sin la marca «en curso»: con 14–30 columnas finas su rótulo no cabe; la tabla gemela dice cuál es hoy.
        aria: T.ariaDia(d.fecha === hoy ? `${formato.fechaCorta(d.fecha)} (${T.enCurso})` : formato.fechaCorta(d.fecha), formato.numero(d.nuevas), formato.numero(d.total)),
      }))}
      formatoEje={ejeVistas}
      tablaGemela={{
        columnas: [T.colDia, T.colNuevas, T.colTotal],
        filas: dias.map((d) => [d.fecha === hoy ? `${formato.fechaCorta(d.fecha)} (${T.enCurso})` : formato.fechaCorta(d.fecha), formato.numero(d.nuevas), formato.numero(d.total)]),
      }}
    />
  );
}

export function EnTikTok(p: { detalle: C.VideoDetalleResponse; tipico: number | null; compacta: boolean }): ReactElement | null {
  const v = p.detalle.video;
  if (v.vistas === undefined) return null;
  if (v.vistas === null) {
    return (
      <Tarjeta padding="amplio" className={cx(css.seccion)}>
        <section aria-label={T.tiktokTitulo} className={cx(css.seccionInterior)} data-sin-cifras="">
          <h2 className={cx(css.seccionTitulo)}>{T.tiktokTitulo}</h2>
          <p className={cx(css.vacioCorto)}>{T.sinCifrasDetalle}</p>
        </section>
      </Tarjeta>
    );
  }
  const tendencia = p.detalle.tendencia ?? [];
  const serie = serieAcumulada(tendencia);
  const primera = tendencia[0]?.fecha;
  const ultima = tendencia[tendencia.length - 1]?.fecha;
  const vistas = v.vistas;
  const nota = typeof v.metricas_at === 'number'
    ? T.tiktokNota(formato.fechaCorta(v.metricas_at), typeof v.publicado_at === 'number' ? formato.fechaCorta(v.publicado_at) : null)
    : null;
  return (
    <div className={cx(css.tiktok)} data-en-tiktok="">
      <BandaKpi titulo={T.tiktokTitulo} className={cx(css.kpis)}>
        <Kpi
          etiqueta={T.kpiVistas}
          valor={formato.numero(vistas)}
          {...(serie.length >= 2 && primera && ultima ? { serie, resumenSerie: T.kpiVistasResumen(formato.fechaCorta(primera), formato.fechaCorta(ultima), formato.numero(vistas)) } : {})}
        />
        {typeof v.likes === 'number' ? (
          <Kpi etiqueta={T.kpiLikes} valor={formato.numero(v.likes)} {...(vistas > 0 ? { nota: T.kpiLikesNota(formato.porcentaje(v.likes / vistas, 1)) } : {})} />
        ) : null}
        {typeof v.comentarios === 'number' ? <Kpi etiqueta={T.kpiComentarios} valor={formato.numero(v.comentarios)} /> : null}
        {typeof v.compartidos === 'number' ? <Kpi etiqueta={T.kpiCompartidos} valor={formato.numero(v.compartidos)} /> : null}
      </BandaKpi>
      {nota ? <p className={cx(css.seccionNota)}>{nota}</p> : null}
      <div className={cx(css.tiktokFila)}>
        <Tarjeta padding="amplio" className={cx(css.seccion)}>
          <Conversion video={v} tipico={p.tipico} />
        </Tarjeta>
        <Tarjeta padding="amplio" className={cx(css.seccion)}>
          <VistasPorDia tendencia={p.detalle.tendencia} compacta={p.compacta} />
        </Tarjeta>
      </div>
    </div>
  );
}
