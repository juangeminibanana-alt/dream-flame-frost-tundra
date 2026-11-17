/* __DOBLE_CORTE__ · resumen corto de las props de un componente doble ("titulo: Muestras · filas: [33] · alPulsar: ƒ"). */
import { isValidElement } from 'react';

const OMITIR = new Set(['children', 'className', 'key', 'ref']);

function valorCorto(v: unknown): string | null {
  if (v === undefined) return null;
  if (v === null) return 'null';
  if (typeof v === 'string') return v.length > 28 ? `«${v.slice(0, 27)}…»` : `«${v}»`;
  if (typeof v === 'number' || typeof v === 'boolean' || typeof v === 'bigint') return String(v);
  if (typeof v === 'function') return 'ƒ';
  if (Array.isArray(v)) return `[${v.length}]`;
  if (isValidElement(v)) return '<…>';
  if (typeof v === 'object') return '{…}';
  return '?';
}

export function resumirProps(props: object, maximo = 6): string {
  const partes: string[] = [];
  for (const [clave, valor] of Object.entries(props)) {
    if (OMITIR.has(clave)) continue;
    const corto = valorCorto(valor);
    if (corto === null) continue;
    partes.push(`${clave}: ${corto}`);
    if (partes.length >= maximo) {
      partes.push('…');
      break;
    }
  }
  return partes.join(' · ');
}
