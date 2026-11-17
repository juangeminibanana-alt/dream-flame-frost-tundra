/** Fecha y hora (Programada, recordatorios): calendario + hora en 24 h, siempre en UTC−6 con @/dominio. */
import { useId, type ReactElement } from 'react';
import type { EpochS } from '@/contrato';
import { epochDeFecha, fechaLocalDe, formato, horaLocal, hoyLocal } from '@/dominio';
import { SelectorFecha } from './SelectorFecha';
import { cx } from './util/clases';
import css from './Campo.module.css';
import cssFh from './SelectorFechaHora.module.css';

const HORA_POR_OMISION = { h: 18, m: 0 };

export function SelectorFechaHora(p: { etiqueta: string; valor: EpochS | null; alCambiar: (t: EpochS) => void; min?: EpochS; className?: string }): ReactElement {
  const idHora = useId();
  const fecha = p.valor !== null ? fechaLocalDe(p.valor) : null;
  const hora = p.valor !== null ? horaLocal(p.valor) : HORA_POR_OMISION;
  const valorHora = `${String(hora.h).padStart(2, '0')}:${String(hora.m).padStart(2, '0')}`;
  const minFecha = p.min !== undefined ? fechaLocalDe(p.min) : undefined;
  const emitir = (t: EpochS): void => p.alCambiar(p.min !== undefined ? Math.max(p.min, t) : t);
  return (
    <div className={cx(cssFh.raiz, p.className)}>
      <SelectorFecha
        etiqueta={p.etiqueta}
        valor={fecha}
        {...(minFecha ? { min: minFecha } : {})}
        alCambiar={(f) => emitir(epochDeFecha(f, hora.h, hora.m))}
      />
      <div className={cx(css.campo, cssFh.hora)}>
        <label htmlFor={idHora} className={css.etiqueta}>
          Hora
        </label>
        <div className={css.caja}>
          <input
            id={idHora}
            type="time"
            step={300}
            className={css.input}
            value={valorHora}
            onChange={(e) => {
              const m = /^(\d{2}):(\d{2})$/.exec(e.target.value);
              if (!m) return;
              emitir(epochDeFecha(fecha ?? hoyLocal(), Number(m[1]), Number(m[2])));
            }}
          />
        </div>
        {p.valor !== null ? <p className={css.ayuda}>{`${formato.fechaConDia(p.valor)}, ${formato.hora(p.valor)}`}</p> : null}
      </div>
    </div>
  );
}
