/**
 * Estados de carga, error y sin conexión de Productos (01_ux §4.16, 02 §7.15–7.16). Esqueletos con la forma final (una
 * sola animación por vista, la de EsqueletoVista) y EstadoVacio con UNA acción.
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { navegar } from '@/app';
import { EstadoVacio, Esqueleto, EsqueletoVista } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './productos.module.css';

export function CargaRejilla(p: { n?: number }): ReactElement {
  const n = p.n ?? 10;
  return (
    <EsqueletoVista textoLento={T.lento} className={cx(css.carga)}>
      <span className={cx(css.srSolo)}>{T.cargando}</span>
      <Esqueleto forma="bloque" ancho={360} alto={36} />
      <div className={cx(css.rejilla)}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className={cx(css.cargaTarjeta)}>
            <Esqueleto forma="foto" className={cx(css.cargaFoto)} />
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
        <Esqueleto forma="foto" className={cx(css.cargaFotoGrande)} />
        <div className={cx(css.cargaHeroeTexto)}>
          <Esqueleto forma="texto" ancho="35%" />
          <Esqueleto forma="titulo" ancho="80%" />
          <Esqueleto forma="texto" lineas={3} ancho="70%" />
          <Esqueleto forma="bloque" ancho={260} alto={44} />
        </div>
      </div>
      <div className={cx(css.cargaKpis)}>
        {[0, 1, 2, 3].map((i) => <Esqueleto key={i} forma="kpi" />)}
      </div>
    </EsqueletoVista>
  );
}

export function ErrorVista(p: { error: ErrorHub; titulo: string; alReintentar: () => void }): ReactElement {
  if (p.error.codigo === 'necesita_pc') {
    return <EstadoVacio icono="Monitor" titulo={T.necesitaPc} texto={T.necesitaPcTexto} className={cx(css.estado)} />;
  }
  if (p.error.codigo === 'no_encontrado') {
    return <EstadoVacio icono="Tag" titulo={T.noExiste} texto={T.noExisteTexto} accion={{ etiqueta: T.verProductos, alPulsar: () => navegar('/productos') }} className={cx(css.estado)} />;
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
