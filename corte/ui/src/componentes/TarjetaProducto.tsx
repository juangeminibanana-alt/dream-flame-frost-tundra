/**
 * Tarjeta de producto (02 §7.4): imagen 1:1 a sangre arriba; cuerpo 12/14 con tienda (avatar de 20 + nombre de 12),
 * nombre corto (14/19, 520, 2 líneas) y cifras: principal en kpi reducido a 18 y secundaria de 12. Ranking opcional
 * (#1 en lima, los demás grafito al 72 %). Hover en Windows: sube 2 px con la sombra en ::after (sin transicionar
 * box-shadow). Toda la tarjeta es pulsable con un botón estirado sobre el nombre (un solo objetivo de foco).
 */
import type { ReactElement } from 'react';
import type { TarjetaProductoProps } from '@firmas/componentes';
import { AvatarTienda } from './AvatarTienda';
import { FotoBase } from './Foto';
import { cx } from './util/clases';
import css from './TarjetaProducto.module.css';

export function TarjetaProducto(p: TarjetaProductoProps): ReactElement {
  const alPulsar = p.alPulsar;
  return (
    <article className={cx(css.tarjeta, alPulsar && css.pulsable, p.className)}>
      <FotoBase
        url={p.imagen}
        alt={p.nombre}
        anchoCss={240}
        proporcion="1:1"
        tienda={p.tienda}
        categoria={p.categoria ?? null}
        className={cx(css.foto)}
        {...(p.meta ? { meta: p.meta } : {})}
      />
      {p.ranking !== undefined ? (
        <span className={cx(css.ranking, p.ranking === 1 && css.rankingUno)} aria-label={`Lugar ${p.ranking}`}>
          #{p.ranking}
        </span>
      ) : null}
      <div className={css.cuerpo}>
        {p.tienda ? (
          <div className={css.tienda}>
            <AvatarTienda nombre={p.tienda} tamano={20} />
            <span className={css.tiendaNombre}>{p.tienda}</span>
          </div>
        ) : null}
        {alPulsar ? (
          <button type="button" className={cx(css.nombre, css.nombreBoton)} onClick={() => alPulsar()} title={p.nombre}>
            {p.nombre}
          </button>
        ) : (
          <h3 className={css.nombre} title={p.nombre}>
            {p.nombre}
          </h3>
        )}
        <div className={css.cifras}>
          <span className={css.principal}>{p.cifraPrincipal}</span>
          {p.cifraSecundaria ? <span className={css.secundaria}>{p.cifraSecundaria}</span> : null}
        </div>
        {p.chips ? <div className={css.chips}>{p.chips}</div> : null}
      </div>
    </article>
  );
}
