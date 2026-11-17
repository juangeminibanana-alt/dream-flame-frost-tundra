/**
 * Estados de carga, error y sin conexión de Tiendas (01_ux §4.16, 02 §7.15–7.16). Esqueletos con la forma final
 * (una sola animación por vista, la de EsqueletoVista) y EstadoVacio con UNA acción.
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { navegar } from '@/app';
import { EstadoVacio, Esqueleto, EsqueletoVista } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './tiendas.module.css';

export function CargaLista(p: { tarjetas: boolean }): ReactElement {
  return (
    <EsqueletoVista textoLento={T.lento} className={cx(css.carga)}>
      <span className={cx(css.srSolo)}>{T.cargando}</span>
      <div className={cx(css.cargaChips)}>
        {[96, 132, 92, 72, 80].map((a) => <Esqueleto key={a} forma="bloque" ancho={a} alto={32} />)}
      </div>
      {p.tarjetas ? (
        <div className={cx(css.cargaTarjetas)}>
          {[0, 1, 2, 3, 4].map((i) => <Esqueleto key={i} forma="bloque" alto={96} />)}
        </div>
      ) : (
        <Esqueleto forma="fila" lineas={10} />
      )}
    </EsqueletoVista>
  );
}

export function CargaDetalle(): ReactElement {
  return (
    <EsqueletoVista textoLento={T.lento} className={cx(css.carga)}>
      <span className={cx(css.srSolo)}>{T.cargando}</span>
      <div className={cx(css.cargaHeroe)}>
        <Esqueleto forma="foto" ancho={180} alto={225} />
        <div className={cx(css.cargaHeroeTexto)}>
          <Esqueleto forma="titulo" ancho="60%" />
          <Esqueleto forma="texto" lineas={2} ancho="80%" />
          <Esqueleto forma="bloque" ancho={220} alto={36} />
        </div>
      </div>
      <div className={cx(css.cargaKpis)}>
        {[0, 1, 2, 3].map((i) => <Esqueleto key={i} forma="kpi" />)}
      </div>
      <Esqueleto forma="fila" lineas={4} />
    </EsqueletoVista>
  );
}

export function ErrorVista(p: { error: ErrorHub; titulo: string; alReintentar: () => void }): ReactElement {
  if (p.error.codigo === 'necesita_pc') {
    return <EstadoVacio icono="Monitor" titulo={T.necesitaPc} texto={T.necesitaPcTexto} className={cx(css.estado)} />;
  }
  if (p.error.codigo === 'no_encontrado') {
    return <EstadoVacio icono="Store" titulo={T.noExiste} texto={T.noExisteTexto} accion={{ etiqueta: T.verTiendas, alPulsar: () => navegar('/tiendas') }} className={cx(css.estado)} />;
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
