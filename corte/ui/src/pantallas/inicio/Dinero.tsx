/**
 * «Tu dinero · últimos 30 días» (01 §4.1 #7, 02 §5.2 fila 3 y §7.3): banda sin tarjeta con 4 KPI separados por filetes.
 * Cada KPI lleva a Ventas con el mismo rango que muestra (Por liquidar → «Todo» con el filtro «Por liquidar»). La
 * comisión lleva su sparkline de 12 semanas (la misma serie de la tendencia).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { navegar } from '@/app';
import { BandaKpi, Kpi } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion, EsqueletoKpis } from './Estados';
import { kpisInicio, type PedidosPorLiquidar, type PuntoTendencia } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

export interface DineroProps {
  d30: C.DashboardResponse | undefined;
  dTodo: C.DashboardResponse | undefined;
  /** Pedidos por liquidar y el más antiguo (nota del KPI 4); null mientras no hay una cuenta confiable. */
  porLiquidar?: PedidosPorLiquidar | null;
  error: ErrorHub | null;
  /** Primera sincronización: las ventas aún no llegan. */
  enCamino: boolean;
  tendencia: PuntoTendencia[];
  /** Celular: variación corta («▼ 21 %»), como el lienzo MovilInicio.png. */
  compacto?: boolean;
  alReintentar: () => void;
}

export function Dinero(p: DineroProps): ReactElement {
  const accion = { etiqueta: T.dinero.verVentas, a: '/ventas?periodo=30d' };
  if (p.enCamino || (!p.d30 && !p.error)) {
    return (
      <section className={css.dinero} aria-label={T.dinero.titulo} aria-busy="true">
        <h2 className={css.bandaTitulo}>{T.dinero.titulo}</h2>
        <EsqueletoKpis />
      </section>
    );
  }
  if (!p.d30) {
    return (
      <section className={css.dinero} aria-label={T.dinero.titulo}>
        <h2 className={css.bandaTitulo}>{T.dinero.titulo}</h2>
        {p.error ? <AvisoSeccion error={p.error} alReintentar={p.alReintentar} /> : null}
      </section>
    );
  }
  const kpis = kpisInicio(p.d30, p.dTodo, p.compacto === true, p.porLiquidar ?? null);
  const serie = p.tendencia.map((x) => x.valor);
  const primera = p.tendencia[0];
  const ultima = p.tendencia[p.tendencia.length - 1];
  const resumen = primera && ultima ? T.dinero.resumenSerie(formato.dinero(primera.valor), formato.dinero(ultima.valor)) : '';
  return (
    <BandaKpi titulo={T.dinero.titulo} accion={accion} className={css.dinero}>
      {kpis.map((k) => (
        <Kpi
          key={k.id}
          etiqueta={k.etiqueta}
          valor={k.valor}
          variacion={k.variacion}
          {...(k.nota ? { nota: k.nota } : {})}
          {...(k.id === 'comision' && serie.length >= 2 ? { serie, resumenSerie: resumen } : {})}
          alPulsar={() => navegar(k.destino)}
        />
      ))}
    </BandaKpi>
  );
}
