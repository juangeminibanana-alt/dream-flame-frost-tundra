import type { CSSProperties } from 'react';

/** Une nombres de clase e ignora los vacíos (false, null, undefined, ''). */
export function cx(...clases: Array<string | false | null | undefined>): string {
  let salida = '';
  for (const c of clases) {
    if (!c) continue;
    salida = salida ? `${salida} ${c}` : c;
  }
  return salida;
}

/** Propiedad opcional solo si el valor existe (exactOptionalPropertyTypes no acepta `undefined` explícito). */
export function siHay<K extends string, V>(clave: K, valor: V | undefined | null): { [P in K]?: V } {
  return valor === undefined || valor === null ? {} : ({ [clave]: valor } as { [P in K]?: V });
}

/** Variables CSS en línea (`--foto-ancho: 40px`). Los valores vienen de datos o medidas, nunca colores sueltos. */
export function vars(valores: Record<`--${string}`, string | number>): CSSProperties {
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === 'number' ? String(v) : v;
  return salida as CSSProperties;
}
