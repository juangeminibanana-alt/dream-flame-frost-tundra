/** Utilidades de presentación de Muestras (sin lógica de negocio). */
import type { CSSProperties } from 'react';

/** Variables CSS en línea ('--columnas', '--halo'…) con el tipo de `style`. */
export function vars(valores: Record<`--${string}`, string | number>): CSSProperties {
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === 'number' ? String(v) : v;
  return salida as CSSProperties;
}

/** Une clases de CSS Modules ignorando las vacías. */
export function cx(...lista: Array<string | false | null | undefined>): string {
  return lista.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

/** Las pestañas de Muestras (con su acción principal) van junto al título solo con la barra lateral completa (≥ 1180,
 *  02 §5.1); en el riel y en el celular ocupan su propia fila. */
export function pestanasArriba(movil: boolean, clase: 'compacta' | 'media' | 'expandida' | 'amplia'): boolean {
  return !movil && (clase === 'expandida' || clase === 'amplia');
}

/** Color dominante de la foto (meta de la imagen, «#RRGGBB») → canal rgb para el halo (`rgb(r g b / 14%)`). Inválido → null. */
export function rgbDeHex(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) return null;
  const n = Number.parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
