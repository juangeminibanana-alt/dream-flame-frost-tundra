/**
 * Controles de Ventas (01 §4.11 «Controles»): periodo (7 · 30 · 90 días · 12 meses · Todo, y «Otro periodo» con este
 * mes y el pasado) y «Comparar con el periodo anterior». Windows: segmentado; celular: chips desplazables (02 §7.11).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { ChipFiltro, Interruptor, Menu, Segmentado } from '@/componentes';
import { etiquetaMes, esPeriodo, esPeriodoFijo, mesesRapidos, PERIODOS_FIJOS } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export interface ControlesProps {
  periodo: C.Periodo;
  hoy: C.FechaLocal;
  compacto: boolean;
  comparar: boolean;
  /** Hay periodo anterior con qué comparar (no en 12 meses ni en Todo). */
  puedeComparar: boolean;
  alCambiarPeriodo: (p: C.Periodo) => void;
  alCambiarComparar: (v: boolean) => void;
}

export function Controles(p: ControlesProps): ReactElement {
  const { esteMes, mesPasado } = mesesRapidos(p.hoy);
  const opcionesMes = [
    { id: esteMes, etiqueta: T.periodo.esteMes(etiquetaMes(esteMes)) },
    { id: mesPasado, etiqueta: T.periodo.mesPasado(etiquetaMes(mesPasado)) },
  ];
  const menuMeses = (
    <Menu
      etiqueta={T.periodo.otro}
      icono="CalendarDays"
      disparador="boton"
      opciones={opcionesMes.map((o) => ({ id: o.id, etiqueta: o.etiqueta, ...(o.id === p.periodo ? { icono: 'Check' as const } : {}), alPulsar: () => p.alCambiarPeriodo(o.id) }))}
    />
  );
  const comparar = p.puedeComparar ? (
    <Interruptor activo={p.comparar} alCambiar={p.alCambiarComparar} etiqueta={T.periodo.comparar} className={css.comparar} />
  ) : null;

  if (p.compacto) {
    const mesActivo = !esPeriodoFijo(p.periodo);
    return (
      <div className={css.controlesCompactos}>
        <div className={css.chipsPeriodo} role="group" aria-label={T.periodo.etiqueta}>
          {PERIODOS_FIJOS.map((x) => (
            <ChipFiltro key={x} activo={p.periodo === x} alCambiar={() => p.alCambiarPeriodo(x)}>
              {T.periodo[x]}
            </ChipFiltro>
          ))}
          {opcionesMes.map((o) => (
            <ChipFiltro key={o.id} activo={mesActivo && p.periodo === o.id} alCambiar={() => p.alCambiarPeriodo(o.id)}>
              {etiquetaMes(o.id, true)}
            </ChipFiltro>
          ))}
        </div>
        {comparar}
      </div>
    );
  }

  const opciones: Array<{ valor: string; etiqueta: string }> = PERIODOS_FIJOS.map((x) => ({ valor: x, etiqueta: T.periodo[x] }));
  if (!esPeriodoFijo(p.periodo)) opciones.push({ valor: p.periodo, etiqueta: etiquetaMes(p.periodo, true) });
  return (
    <div className={css.controles}>
      <Segmentado<string> etiqueta={T.periodo.etiqueta} opciones={opciones} valor={p.periodo} alCambiar={(v) => {
        if (esPeriodo(v)) p.alCambiarPeriodo(v);
      }} className={css.segmentoPeriodo} />
      {menuMeses}
      {comparar}
    </div>
  );
}
