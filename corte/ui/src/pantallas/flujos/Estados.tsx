/**
 * Estados comunes de los flujos (01 §4.16, 02 §7.15–7.16): primera carga con esqueletos de la forma final (una sola
 * animación), «Necesita tu PC encendida» (Android sin la PC y la vista no sale de la copia), error sin datos y los
 * avisos en línea (info, atención y crítico, siempre con ícono y texto).
 */
import type { ReactElement, ReactNode } from 'react';
import type { ErrorHub } from '@/datos';
import { Esqueleto, EsqueletoVista, EstadoVacio, Icono, type NombreIcono } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './flujos.module.css';

/** Esqueleto genérico de un flujo: título de sección + filas con foto (la forma de las tarjetas de muestra). */
export function EsqueletoFlujo(p: { filas?: number; conFoto?: boolean; className?: string }): ReactElement {
  const filas = Array.from({ length: p.filas ?? 5 }, (_, i) => i);
  return (
    <EsqueletoVista textoLento={T.cargandoLento} className={cx(css.esqueleto, p.className)}>
      <p className={cx(css.cargandoTexto)}>{T.cargando}</p>
      {p.conFoto ? <Esqueleto forma="foto" ancho="100%" alto={280} /> : <Esqueleto forma="titulo" ancho="38%" />}
      {filas.map((i) => (
        <div key={i} className={cx(css.esqueletoFila)} aria-hidden="true">
          <Esqueleto forma="foto" ancho={56} alto={56} />
          <div className={cx(css.esqueletoTextos)}>
            <Esqueleto forma="texto" ancho={`${72 - (i % 3) * 12}%`} />
            <Esqueleto forma="texto" ancho="44%" />
          </div>
        </div>
      ))}
    </EsqueletoVista>
  );
}

/** Error sin datos. `necesita_pc` tiene su propio texto (Android sin la PC y la vista no se arma con la copia). */
export function ErrorFlujo(p: { error: ErrorHub; titulo: string; alReintentar: () => void }): ReactElement {
  const necesita = p.error.codigo === 'necesita_pc';
  return (
    <div className={cx(css.estadoCentro)}>
      <EstadoVacio
        icono={necesita ? 'Monitor' : 'CircleAlert'}
        titulo={necesita ? T.necesitaPcTitulo : p.titulo}
        texto={necesita ? T.necesitaPcTexto : p.error.mensaje || T.errorTexto}
        accion={{ etiqueta: T.reintentar, alPulsar: p.alReintentar }}
      />
    </div>
  );
}

export type TonoAviso = 'info' | 'atencion' | 'critico' | 'neutro';

const ICONO_TONO: Readonly<Record<TonoAviso, NombreIcono>> = { info: 'Info', atencion: 'CircleAlert', critico: 'CircleAlert', neutro: 'Info' };

/** Aviso en línea con ícono + texto (nunca solo color) y acciones opcionales. */
export function Aviso(p: { tono: TonoAviso; children: ReactNode; icono?: NombreIcono; acciones?: ReactNode; rol?: 'status' | 'alert'; className?: string }): ReactElement {
  return (
    <div className={cx(css.aviso, p.className)} data-tono={p.tono} role={p.rol ?? 'status'}>
      <span className={cx(css.avisoIcono)} aria-hidden="true">
        <Icono nombre={p.icono ?? ICONO_TONO[p.tono]} tamano={18} />
      </span>
      <div className={cx(css.avisoCuerpo)}>
        <div className={cx(css.avisoTexto)}>{p.children}</div>
        {p.acciones ? <div className={cx(css.avisoAcciones)}>{p.acciones}</div> : null}
      </div>
    </div>
  );
}
