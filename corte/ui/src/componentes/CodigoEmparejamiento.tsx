/**
 * Código manual de emparejamiento (C6, 02 §7.19): 12 caracteres Crockford 'ABCD-EFGH-JKMN' en Geist Mono 30/36, 600,
 * en 3 grupos de 4, y un anillo de cuenta regresiva de 36 (5 min, trazo --brand-ink) con "Caduca en 4:52" en mono.
 * El reloj es el de @/dominio (ahoraS, inyectable en pruebas). Llama alVencer una sola vez al llegar a cero.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { EpochS } from '@/contrato';
import { ahoraS } from '@/dominio';
import { cx, vars } from './util/clases';
import css from './CodigoEmparejamiento.module.css';

const VENTANA_S = 300;

export function gruposDeCodigo(codigo: string): string[] {
  const limpio = codigo.toUpperCase().replace(/[^0-9A-Z]/g, '');
  const grupos: string[] = [];
  for (let i = 0; i < limpio.length; i += 4) grupos.push(limpio.slice(i, i + 4));
  return grupos;
}

function mmss(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function CodigoEmparejamiento(p: { codigo: string; expiraAt: EpochS; alVencer?: () => void; className?: string }): ReactElement {
  const [ahora, setAhora] = useState(() => ahoraS());
  const avisado = useRef(false);
  const alVencer = useRef(p.alVencer);
  alVencer.current = p.alVencer;
  const restante = Math.max(0, Math.round(p.expiraAt - ahora));

  useEffect(() => {
    avisado.current = false;
    setAhora(ahoraS());
    const t = window.setInterval(() => setAhora(ahoraS()), 1000);
    return () => window.clearInterval(t);
  }, [p.expiraAt]);

  useEffect(() => {
    if (restante === 0 && !avisado.current) {
      avisado.current = true;
      alVencer.current?.();
    }
  }, [restante]);

  const grupos = gruposDeCodigo(p.codigo);
  const fraccion = Math.min(1, restante / VENTANA_S);
  const vencido = restante === 0;
  return (
    <div className={cx(css.codigo, vencido && css.vencido, p.className)}>
      <span className={css.grupos}>
        <span className={css.sr}>{`Código: ${grupos.map((g) => g.split('').join(' ')).join(', ')}`}</span>
        {grupos.map((g, i) => (
          <span key={i} className={css.grupo} aria-hidden="true">
            {g}
          </span>
        ))}
      </span>
      <span className={css.cuenta}>
        <svg className={cx(css.anillo, 'fc-keep')} viewBox="0 0 36 36" aria-hidden="true" focusable="false" style={vars({ '--f': fraccion })}>
          <circle className={css.pista} cx="18" cy="18" r="15" />
          <circle className={css.avance} cx="18" cy="18" r="15" pathLength={1} />
        </svg>
        <span className={css.texto} role="timer" aria-live="off">
          {vencido ? 'Código vencido' : `Caduca en ${mmss(restante)}`}
        </span>
      </span>
    </div>
  );
}
