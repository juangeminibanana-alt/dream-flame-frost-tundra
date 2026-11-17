/**
 * Estados de carga, error y sin conexión de Videos (01_ux §4.16, 02 §7.15–7.16). Esqueletos con la forma final (una
 * sola animación por vista, la de EsqueletoVista) y EstadoVacio con UNA acción.
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { navegar } from '@/app';
import { EstadoVacio, Esqueleto, EsqueletoVista } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './videos.module.css';

export function CargaRejilla(p: { n?: number }): ReactElement {
  const n = p.n ?? 10;
  return (
    <EsqueletoVista textoLento={T.lento} className={cx(css.carga)}>
      <span className={cx(css.srSolo)}>{T.cargando}</span>
      <div className={cx(css.cargaControles)}>
        {[220, 96, 132, 112].map((a, i) => <Esqueleto key={i} forma="bloque" ancho={a} alto={36} />)}
      </div>
      <div className={cx(css.rejilla)}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className={cx(css.cargaTarjeta)}>
            <Esqueleto forma="bloque" alto="100%" className={cx(css.cargaPoster)} />
            <Esqueleto forma="texto" lineas={2} />
          </div>
        ))}
      </div>
    </EsqueletoVista>
  );
}

export function CargaDetalle(): ReactElement {
  return (
    <EsqueletoVista textoLento={T.lento} className={cx(css.carga)}>
      <span className={cx(css.srSolo)}>{T.cargando}</span>
      <div className={cx(css.cargaHeroe)}>
        <Esqueleto forma="bloque" className={cx(css.cargaPosterGrande)} />
        <div className={cx(css.cargaHeroeTexto)}>
          <Esqueleto forma="texto" ancho="40%" />
          <Esqueleto forma="titulo" ancho="70%" />
          <div className={cx(css.cargaKpis)}>
            {[0, 1, 2, 3].map((i) => <Esqueleto key={i} forma="kpi" />)}
          </div>
          <Esqueleto forma="bloque" alto={180} />
        </div>
      </div>
    </EsqueletoVista>
  );
}

export function ErrorVista(p: { error: ErrorHub; titulo: string; alReintentar: () => void; textoNecesitaPc?: string; accionNecesitaPc?: { etiqueta: string; alPulsar: () => void } }): ReactElement {
  if (p.error.codigo === 'necesita_pc') {
    return (
      <EstadoVacio
        icono="Monitor"
        titulo={T.necesitaPc}
        texto={p.textoNecesitaPc ?? T.necesitaPcTexto}
        {...(p.accionNecesitaPc ? { accion: p.accionNecesitaPc } : {})}
        className={cx(css.estado)}
      />
    );
  }
  if (p.error.codigo === 'no_encontrado') {
    return <EstadoVacio icono="SquarePlay" titulo={T.noExiste} texto={T.noExisteTexto} accion={{ etiqueta: T.verVideos, alPulsar: () => navegar('/videos') }} className={cx(css.estado)} />;
  }
  return (
    <EstadoVacio
      icono="CircleAlert"
      titulo={p.titulo}
      texto={p.error.mensaje}
      accion={{ etiqueta: T.reintentar, alPulsar: p.alReintentar }}
      className={cx(css.estado)}
    />
  );
}
