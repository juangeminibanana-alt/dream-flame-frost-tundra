/**
 * Barra de "ponerse al día" (02 §3.6, §7.21). Etapas desde la izquierda: Publicada → Programada → Video listo →
 * Planeada, con la escala lima de --stage-*; el resto es --stage-track.
 * - tamano 'inicio' (héroe) con 1–60 videos: UNA CELDA POR VIDEO, como el lienzo aprobado (Main.png: una celda de 8 px por video,
 *   radio 3, separación 3, ancho máximo 560). En una columna angosta (celular, como MovilInicio.png) o con más de 60
 *   videos vuelve a la pista continua.
 * - tamano 'muestras' (o más de 60): pista continua de 10/12 px con cortes de 2 px a 45° (clip-path en paralelogramo).
 * Contador debajo (encima en 'muestras') y leyenda en caption con los conteos. Vacía, se ve la pista completa y el
 * texto, sin culpa. Accesible: role=progressbar con aria-valuenow / aria-valuemax, nombre = contador y aria-valuetext
 * con el desglose por etapa.
 */
import type { ReactElement } from 'react';
import type { SegmentoEtapas } from '@firmas/componentes';
import { formato } from '@/dominio';
import { cx, vars } from './util/clases';
import css from './BarraEtapas.module.css';

const ORDEN_BARRA: ReadonlyArray<SegmentoEtapas['etapa']> = ['publicada', 'programada', 'video_listo', 'planeada'];
const ORDEN_LEYENDA: ReadonlyArray<SegmentoEtapas['etapa']> = ['planeada', 'video_listo', 'programada', 'publicada'];
const PALABRA: Readonly<Record<SegmentoEtapas['etapa'], string>> = {
  planeada: 'planeados',
  video_listo: 'listos',
  programada: 'programados',
  publicada: 'publicados',
};
/** Más de esto, las celdas quedarían de menos de 4 px a 560: vuelve la pista continua. */
const MAX_CELDAS = 60;

/** '0 de 12 videos publicados' → ['0 de 12', ' videos publicados'] para resaltar la cifra. */
function partirContador(texto: string): [string, string] {
  const m = /^(\S+\s+de\s+\S+)(.*)$/.exec(texto);
  return m ? [m[1] ?? texto, m[2] ?? ''] : ['', texto];
}

/** '1,250 de 2,000' → 1250 (la primera cifra del contador), o null si no hay. */
function primeraCifra(cifra: string): number | null {
  const m = /^[^\d]*([\d.,\s]+)/.exec(cifra);
  if (!m?.[1]) return null;
  const n = Number(m[1].replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export function BarraEtapas(p: { segmentos: SegmentoEtapas[]; total: number; contador: string; tamano?: 'inicio' | 'muestras'; leyenda?: boolean; className?: string }): ReactElement {
  const tamano = p.tamano ?? 'inicio';
  const total = Math.max(0, Math.floor(p.total));
  const conteo = (etapa: SegmentoEtapas['etapa']): number => p.segmentos.filter((s) => s.etapa === etapa).reduce((a, s) => a + Math.max(0, s.n), 0);
  // La barra nunca pasa del total: si los conteos suman de más, el último tramo se recorta (la leyenda dice los reales).
  let acumulado = 0;
  const visibles = ORDEN_BARRA.map((etapa) => {
    const n = Math.min(conteo(etapa), Math.max(0, total - acumulado));
    acumulado += n;
    return { etapa, n };
  }).filter((s) => s.n > 0);
  const suma = visibles.reduce((a, s) => a + s.n, 0);
  const lleno = total > 0 && suma >= total;
  const [cifra, resto] = partirContador(p.contador);
  const usaProgramada = p.segmentos.some((s) => s.etapa === 'programada');
  const leyenda = ORDEN_LEYENDA.filter((e) => e !== 'programada' || usaProgramada);
  const conCeldas = tamano === 'inicio' && total > 0 && total <= MAX_CELDAS;
  const ahora = Math.min(total, Math.max(0, primeraCifra(cifra) ?? conteo('publicada')));
  const desglose = leyenda.map((e) => `${formato.numero(conteo(e))} ${PALABRA[e]}`).join(', ');

  const contador = (
    <span className={css.contador}>
      {cifra ? <b className={css.cifra}>{cifra}</b> : null}
      {resto}
    </span>
  );
  const textoLeyenda = p.leyenda === false ? null : (
    <span className={css.leyenda}>
      {leyenda.map((etapa, i) => (
        <span key={etapa} className={css.elemento}>
          {i > 0 ? <span className={css.punto} aria-hidden="true">·</span> : null}
          <i className={cx(css.muestra, css[etapa], 'fc-keep')} aria-hidden="true" />
          {formato.numero(conteo(etapa))} {PALABRA[etapa]}
        </span>
      ))}
    </span>
  );
  const pista = (
    <div className={cx(css.pista, 'fc-keep')}>
      {total > 0
        ? visibles.map((s, i) => {
            const primero = i === 0;
            const ultimo = i === visibles.length - 1;
            const forma = visibles.length === 1 && lleno ? 'completo' : primero ? 'primero' : ultimo && lleno ? 'final' : 'medio';
            return (
              <i
                key={s.etapa}
                className={cx(css.segmento, css[s.etapa], css[forma], 'fc-fill')}
                style={vars({ '--parte': `${(Math.min(s.n, total) / total) * 100}%` })}
                data-primero={primero ? '' : undefined}
              />
            );
          })
        : null}
    </div>
  );
  // Una celda por video: las primeras van por etapa en el orden de la barra y el resto es pista.
  const etapaDeCelda: Array<SegmentoEtapas['etapa'] | null> = [];
  if (conCeldas) {
    for (const s of visibles) for (let k = 0; k < s.n; k++) etapaDeCelda.push(s.etapa);
    while (etapaDeCelda.length < total) etapaDeCelda.push(null);
  }
  const celdas = conCeldas ? (
    <div className={cx(css.celdas, 'fc-keep')} style={vars({ '--n': total })}>
      {etapaDeCelda.map((e, i) => (
        <i key={i} className={cx(css.celda, e && css[e], e && 'fc-fill')} />
      ))}
    </div>
  ) : null;
  // El progressbar no expone hijos (children presentational de ARIA; Chromium los poda): el role=img interno con el
  // mismo nombre solo existe para quien todavía busque la barra como imagen.
  const barra = (
    <div
      className={cx(css.progreso, conCeldas && css.conCeldas)}
      role="progressbar"
      aria-label={p.contador}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={ahora}
      aria-valuetext={desglose || p.contador}
    >
      <div className={css.dibujo} role="img" aria-label={p.contador}>
        {celdas}
        {pista}
      </div>
    </div>
  );

  return (
    <div className={cx(css.barra, css[tamano], p.className)}>
      {tamano === 'muestras' ? (
        <>
          <div className={css.textos}>
            {contador}
            {textoLeyenda}
          </div>
          {barra}
        </>
      ) : (
        <>
          {barra}
          <div className={css.textos}>
            {contador}
            {textoLeyenda}
          </div>
        </>
      )}
    </div>
  );
}
