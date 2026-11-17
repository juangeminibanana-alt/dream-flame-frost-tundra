/**
 * «Tu dinero · {periodo}» (01 §4.11 #1, 02 §7.3): banda sin tarjeta con los 8 KPI en 4 × 2 (2 × 2 en celular).
 * Comisión estimada = liquidada + por liquidar + congelada. Liquidada y Por liquidar sin comparación; la tasa compara en
 * puntos; las pérdidas por reembolsos con el color invertido (bajar es bueno).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { BandaKpi, Kpi } from '@/componentes';
import { kpisVentas, nombrePeriodo } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export function Kpis(p: { tablero: C.DashboardResponse; comparar: boolean; compacto?: boolean }): ReactElement {
  const kpis = kpisVentas(p.tablero, p.comparar, p.compacto === true);
  return (
    <BandaKpi titulo={T.kpi.banda(nombrePeriodo(p.tablero.periodo.clave))} className={css.kpis}>
      {kpis.map((k) => (
        <Kpi key={k.id} etiqueta={k.etiqueta} valor={k.valor} variacion={k.variacion} {...(k.nota ? { nota: k.nota } : {})} />
      ))}
    </BandaKpi>
  );
}
