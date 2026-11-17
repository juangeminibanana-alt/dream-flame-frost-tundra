/**
 * Miniatura de video 9:16 (02 §7.18, C4). La portada es la foto del producto que más vendió ese video, con el rótulo
 * "Foto del producto": llena el 9:16 en `cover`, como el lienzo aprobado (Main.png, video estrella), y mientras carga se
 * ve su LQIP a tamaño completo (sin filter). Así no queda un 40 % inferior de LQIP turbio bajo una foto 1:1 (el lienzo
 * manda sobre el «1:1 contenido» de 02 §7.18 en uso de fotografía, LEEME.md:17). Si la original es pequeña para ese
 * tamaño, FotoBase la centra en `contain` sobre su LQIP. Sin imagen: póster tipográfico distinto por video (tono de la
 * tienda, fecha de la primera venta en cifras anchas, ranking grande y nombre corto). Velos superior e inferior
 * anclados en px (α ≥ .66 bajo el texto). Arriba: ranking y ▶; abajo: comisión, unidades y el nombre en 2 renglones
 * (02 §4.4, tarjetas). La imagen va con alt="" y el enlace lleva el aria-label completo (02 §8.5). Sin reproducción
 * automática.
 */
import type { ReactElement } from 'react';
import type { MiniaturaVideoProps } from '@firmas/componentes';
import { tonoTienda } from '@/dominio';
import { FotoBase, useMetaImagen } from './Foto';
import { cx, vars } from './util/clases';
import css from './MiniaturaVideo.module.css';

export function MiniaturaVideo(p: MiniaturaVideoProps): ReactElement {
  const metaRegistro = useMetaImagen(p.url);
  const meta = p.meta ?? metaRegistro;
  const tono = p.tienda ? tonoTienda(p.tienda) : 'pizarra';
  const contenido = (
    <>
      {p.url ? (
        <>
          <span className={css.fondo} style={meta?.color ? vars({ '--fondo-color': meta.color }) : undefined} aria-hidden="true">
            {meta?.lqip ? <img src={meta.lqip} alt="" decoding="async" draggable={false} /> : null}
          </span>
          <FotoBase
            url={p.url}
            alt=""
            // En cover sobre el 9:16 la foto 1:1 se ve al alto: se pide la variante para ese ancho (16/9 del marco).
            anchoCss={Math.round((p.anchoCss * 16) / 9)}
            proporcion="1:1"
            radio="xs"
            tienda={p.tienda}
            className={cx(css.producto)}
            {...(p.meta ? { meta: p.meta } : {})}
          />
          {p.rotulo ? <span className={css.rotulo}>{p.rotulo}</span> : null}
        </>
      ) : (
        <span className={css.poster} aria-hidden="true">
          <b className={css.posterFecha}>{p.fechaPoster}</b>
          <small className={css.posterNota}>primera venta</small>
          {p.ranking !== undefined ? <span className={css.posterRanking}>#{p.ranking}</span> : null}
        </span>
      )}
      {p.ranking !== undefined ? (
        <span className={cx(css.ranking, p.ranking === 1 && css.rankingUno)} aria-hidden="true">
          #{p.ranking}
        </span>
      ) : null}
      <span className={css.play} aria-hidden="true">
        <svg viewBox="0 0 12 12" focusable="false">
          <path d="M3.2 1.9v8.2a.6.6 0 0 0 .9.5l6.5-4.1a.6.6 0 0 0 0-1L4.1 1.4a.6.6 0 0 0-.9.5z" />
        </svg>
      </span>
      {/* Un dato vacío no deja renglón: la tarjeta del video estrella pone la comisión en su columna de texto y aquí
          solo pide las unidades (Main.png). */}
      <span className={css.datos} aria-hidden="true">
        {p.comision ? <span className={css.comision}>{p.comision}</span> : null}
        {p.unidades ? <span className={css.unidades}>{p.unidades}</span> : null}
        {p.nombre ? <span className={css.nombre}>{p.nombre}</span> : null}
      </span>
    </>
  );
  const clase = cx(css.miniatura, !p.url && css.conPoster, p.className);
  const estilo = vars({ '--ancho': `${p.anchoCss}px` });
  if (p.alPulsar) {
    const alPulsar = p.alPulsar;
    return (
      <button type="button" className={cx(clase, css.pulsable)} data-tono={tono} style={estilo} aria-label={p.etiqueta} onClick={() => alPulsar()}>
        {contenido}
      </button>
    );
  }
  return (
    <div className={clase} data-tono={tono} style={estilo} role="img" aria-label={p.etiqueta}>
      {contenido}
    </div>
  );
}
