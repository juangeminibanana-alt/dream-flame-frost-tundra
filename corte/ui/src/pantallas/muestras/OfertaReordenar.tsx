/**
 * Oferta única al pasar el punto de control 2 de la primera sincronización (01 §4.5 regla 6, BUILD §8.5 (b)):
 * «Ya llegaron tus ventas. ¿Reordenamos tu plan para empezar por las tiendas con las que ya vendes? Tu fecha de término
 * no cambia.» [Reordenar] [Dejar así]. Tarjeta en línea (no modal): la cola sigue usable debajo.
 */
import type { ReactElement } from 'react';
import { Boton, Icono } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

export function OfertaReordenar(p: { alReordenar: () => void; alDejar: () => void }): ReactElement {
  return (
    <section className={cx(css.oferta)} role="region" aria-label={T.ofertaTitulo} data-oferta="reordenar-ventas">
      <span className={cx(css.ofertaIcono)} aria-hidden="true">
        <Icono nombre="TrendingUp" tamano={20} />
      </span>
      <div className={cx(css.ofertaTextos)}>
        <p className={cx(css.ofertaTitulo)}>{T.ofertaTitulo}</p>
        <p className={cx(css.ofertaTexto)}>
          {T.ofertaPregunta} {T.ofertaSinCambioFecha}
        </p>
      </div>
      <div className={cx(css.ofertaAcciones)}>
        <Boton variante="fantasma" alPulsar={p.alDejar}>
          {T.dejarAsi}
        </Boton>
        <Boton variante="secundario" icono="ArrowDownUp" alPulsar={p.alReordenar}>
          {T.reordenar}
        </Boton>
      </div>
    </section>
  );
}
