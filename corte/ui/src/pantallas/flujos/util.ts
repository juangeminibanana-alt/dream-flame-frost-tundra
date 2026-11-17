/** Utilidades de presentación de los flujos de Muestras (sin lógica de negocio ni React). */
import type { CSSProperties } from 'react';
import type * as C from '@/contrato';
import { formato, nombreCorto } from '@/dominio';

/** Une clases de CSS Modules ignorando las vacías (las clases de un módulo llegan como string | undefined). */
export function cx(...lista: Array<string | false | null | undefined>): string {
  return lista.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

/** Variables CSS en línea ('--p', '--holgura'…) con el tipo de `style`: medidas que dependen de datos, nunca colores. */
export function vars(valores: Record<`--${string}`, string | number>): CSSProperties {
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === 'number' ? String(v) : v;
  return salida as CSSProperties;
}

/** Plural sencillo con separador de miles: (1, 'muestra') → '1 muestra' · (2, 'tienda') → '2 tiendas'. */
export function cuenta(n: number, singular: string, plural?: string): string {
  return `${formato.numero(n)} ${n === 1 ? singular : plural ?? `${singular}s`}`;
}

/** Primera letra en mayúscula (encabezados que empiezan con una fecha: «Hoy · jue 12 nov», «Vie 13 nov»). */
export function capitalizar(t: string): string {
  return t.length > 0 ? `${t.charAt(0).toLocaleUpperCase('es-MX')}${t.slice(1)}` : t;
}

/** Nombre corto del producto (01 §6.0): el del hub o el que calcula @/dominio. */
export function nombreDe(p: Pick<C.ProductoResumen, 'titulo' | 'titulo_corto'>): string {
  return p.titulo_corto ?? nombreCorto(p.titulo);
}
