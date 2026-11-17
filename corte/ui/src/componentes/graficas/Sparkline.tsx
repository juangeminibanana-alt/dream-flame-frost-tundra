/**
 * Sparkline de 02 §7.3 / §9: 12 puntos, línea de 1.75 px en --viz-mono, sin ejes, y el punto "ahora" en lima con anillo
 * del color de la superficie (en claro, anillo --lima-850 vía --viz-now-ring). aria-hidden + `resumen` para lectores.
 */
import type { ReactElement } from 'react';
import { cx } from '../util/clases';
import css from './graficas.module.css';

export function Sparkline(p: { valores: number[]; resumen: string; ancho?: number; alto?: number; className?: string }): ReactElement {
  const W = p.ancho ?? 96;
  const H = p.alto ?? 32;
  const valores = p.valores.filter((v) => Number.isFinite(v));
  const margen = 4.5;
  let linea = '';
  let fin: [number, number] | null = null;
  if (valores.length >= 2) {
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const rango = max - min || 1;
    const puntos = valores.map((v, i): [number, number] => [
      margen + (i * (W - margen * 2)) / (valores.length - 1),
      margen + (1 - (v - min) / rango) * (H - margen * 2),
    ]);
    linea = puntos.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
    fin = puntos[puntos.length - 1] ?? null;
  }
  return (
    <span className={cx(css.sparkline, p.className)}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" className={cx(css.sparkSvg, 'fc-keep')}>
        {linea ? <path d={linea} className={css.sparkLinea} /> : <line x1={margen} x2={W - margen} y1={H / 2} y2={H / 2} className={css.sparkVacia} />}
        {fin ? <circle cx={fin[0]} cy={fin[1]} r={3} className={css.sparkAhora} /> : null}
      </svg>
      <span className={css.sr}>{p.resumen}</span>
    </span>
  );
}
