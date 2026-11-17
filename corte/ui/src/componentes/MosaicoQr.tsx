/**
 * Tile del QR de emparejamiento (02 §7.19): blanco de 236, radio 20, padding 20 (zona de silencio), siempre oscuro sobre
 * blanco también en tema oscuro, módulos nítidos (image-rendering: pixelated). Al centro, la marca en un cuadrado
 * grafito de 48 (radio 13) con anillo blanco de 5 px (tapa ≈ 9 % de los módulos; la corrección H tolera ~30 %).
 * `png` es el data URI de EmparejarResponse.qr_png: no pasa por <Foto> (no es una imagen de la caché del hub).
 */
import type { ReactElement } from 'react';
import { cx } from './util/clases';
import css from './MosaicoQr.module.css';

export function MarcaCorte(p: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 1024 1024" className={p.className} aria-hidden="true" focusable="false">
      <rect width="1024" height="1024" rx="270" className={css.marcaFondo} />
      <g transform="translate(18 -6)">
        <path d="M741.81 319.16A300 300 0 0 0 278.45 700.29L398.82 579.93A132 132 0 0 1 613.12 427.15Z" className={css.marcaLima} />
        <path d="M323.71 745.55A300 300 0 0 0 741.81 704.84L613.12 596.85A132 132 0 0 1 444.07 625.18Z" className={css.marcaPieza} transform="translate(-15.56 15.56)" />
      </g>
    </svg>
  );
}

export function MosaicoQr(p: { png: string; alt: string; className?: string }): ReactElement {
  const valido = /^data:image\/(png|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(p.png);
  return (
    <figure className={cx(css.tile, p.className)}>
      {valido ? <img className={css.qr} src={p.png} alt={p.alt} draggable={false} /> : <span className={css.vacio} role="img" aria-label={p.alt} />}
      <span className={css.logo} aria-hidden="true">
        <MarcaCorte className={cx(css.marca)} />
      </span>
    </figure>
  );
}
