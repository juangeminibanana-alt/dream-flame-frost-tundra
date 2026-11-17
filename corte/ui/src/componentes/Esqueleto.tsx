/**
 * Formas de esqueleto (02 §7.15) que imitan el layout final. NO animan por sí mismas: la única animación de opacidad
 * vive en el contenedor (EsqueletoVista).
 */
import type { CSSProperties, ReactElement } from 'react';
import { cx } from './util/clases';
import css from './Esqueleto.module.css';

type Forma = 'texto' | 'titulo' | 'bloque' | 'foto' | 'kpi' | 'fila' | 'circulo';

function medida(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

export function Esqueleto(p: { forma: Forma; ancho?: number | string; alto?: number | string; lineas?: number; className?: string }): ReactElement {
  const estilo: CSSProperties = {};
  const ancho = medida(p.ancho);
  const alto = medida(p.alto);
  if (ancho) estilo.width = ancho;
  if (alto) estilo.height = alto;
  const lineas = Math.max(1, p.lineas ?? (p.forma === 'texto' ? 3 : p.forma === 'fila' ? 4 : 1));

  if (p.forma === 'texto') {
    return (
      <span className={cx(css.texto, p.className)} style={ancho ? { width: ancho } : undefined} aria-hidden="true">
        {Array.from({ length: lineas }, (_, i) => (
          <i key={i} className={css.linea} style={{ width: i === lineas - 1 && lineas > 1 ? '62%' : '100%' }} />
        ))}
      </span>
    );
  }
  if (p.forma === 'kpi') {
    return (
      <span className={cx(css.kpi, p.className)} style={estilo} aria-hidden="true">
        <i className={css.linea} style={{ width: '58%' }} />
        <i className={css.valor} />
        <i className={css.linea} style={{ width: '72%', height: 10 }} />
      </span>
    );
  }
  if (p.forma === 'fila') {
    return (
      <span className={cx(css.filas, p.className)} style={ancho ? { width: ancho } : undefined} aria-hidden="true">
        {Array.from({ length: lineas }, (_, i) => (
          <span key={i} className={css.fila}>
            <i className={css.miniatura} />
            <span className={css.filaTextos}>
              <i className={css.linea} style={{ width: `${78 - ((i * 17) % 30)}%` }} />
              <i className={css.linea} style={{ width: `${44 - ((i * 11) % 16)}%`, height: 10 }} />
            </span>
            <i className={css.linea} style={{ width: 64 }} />
          </span>
        ))}
      </span>
    );
  }
  return <i className={cx(css.base, css[p.forma], p.className)} style={estilo} aria-hidden="true" />;
}
