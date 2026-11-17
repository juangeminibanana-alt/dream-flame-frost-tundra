/**
 * KPI (02 §7.3): subgrid de filas para que los valores de una banda compartan línea base. Etiqueta ≤ 20 caracteres
 * con su periodo (13, 520, text-3 como el lienzo aprobado) · valor `kpi` al 112 %, 700 como el lienzo, con
 * clamp(20px, 15.4cqi, --text-kpi-size) (24 de mínimo en la banda angosta, como MovilInicio) · meta de 12 con la variación (favorable en --ok-fg, desfavorable en --warn-fg, NUNCA en rojo) o una
 * nota; en tarjeta angosta solo la cifra («▼ 21 %») y el resto queda para el lector · sparkline opcional a la derecha
 * del valor. La tarjeta (surface-1, borde, radio) la pone BandaKpi. No existe la variante "alerta" (C17).
 */
import type { ReactElement } from 'react';
import type { KpiProps, VariacionKpi } from '@firmas/componentes';
import { Sparkline } from './graficas/Sparkline';
import { cx } from './util/clases';
import css from './Kpi.module.css';

function Flecha(p: { direccion: VariacionKpi['direccion'] }): ReactElement {
  if (p.direccion === 'igual') {
    return (
      <svg className={css.flecha} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
        <rect x="1.5" y="4.25" width="7" height="1.5" rx="0.75" />
      </svg>
    );
  }
  return (
    <svg className={css.flecha} viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      {p.direccion === 'sube' ? <path d="M5 1.6 9 8.4H1z" /> : <path d="M5 8.4 1 1.6h8z" />}
    </svg>
  );
}

const DIRECCION_LEIDA: Readonly<Record<VariacionKpi['direccion'], string>> = { sube: 'sube', baja: 'baja', igual: 'sin cambio' };

/** '−21 % vs. 30 días anteriores' → cifra con color y el resto atenuado. */
function partirVariacion(texto: string): [string, string] {
  const i = texto.indexOf(' vs.');
  if (i <= 0) return [texto, ''];
  return [texto.slice(0, i), texto.slice(i)];
}

export function Kpi(p: KpiProps): ReactElement {
  const v = p.variacion ?? null;
  const [cifra, resto] = v ? partirVariacion(v.texto) : ['', ''];
  const contenido = (
    <>
      <span className={css.etiqueta} title={p.etiqueta}>
        {p.etiqueta}
      </span>
      <span className={css.filaValor}>
        <span className={css.valor}>{p.valor}</span>
        {p.serie && p.serie.length >= 2 ? <Sparkline valores={p.serie} resumen={p.resumenSerie ?? ''} ancho={96} alto={32} className={cx(css.chispa)} /> : null}
      </span>
      <span className={css.meta}>
        {v ? (
          <span className={cx(css.variacion, css[v.sentido])}>
            <Flecha direccion={v.direccion} />
            {/* La flecha es aria-hidden y el color nunca va solo (02 §12.2): el lector oye la dirección. */}
            <span className={css.sr}>{DIRECCION_LEIDA[v.direccion]} </span>
            <span>{cifra}</span>
            {resto ? <span className={css.restoVariacion}>{resto}</span> : null}
          </span>
        ) : null}
        {p.nota ? <span className={css.nota}>{v ? ` · ${p.nota}` : p.nota}</span> : null}
      </span>
    </>
  );
  if (p.alPulsar) {
    const alPulsar = p.alPulsar;
    return (
      <button type="button" className={cx(css.kpi, css.pulsable, p.className)} onClick={() => alPulsar()}>
        {contenido}
      </button>
    );
  }
  return <div className={cx(css.kpi, p.className)}>{contenido}</div>;
}
