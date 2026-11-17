/**
 * @/bloques · utilidades internas (no salen del barril): clases, parámetros de consulta compartidos, nombre de producto,
 * enlaces de TikTok y la plataforma efectiva (la galería puede simular Android sin cambiar de transporte).
 */
import { createContext, useContext, type CSSProperties } from 'react';
import type * as C from '@/contrato';
import type { ParamsMuestras } from '@/datos';
import type { PlataformaUi } from '@/plataforma';
import { usePlataforma } from '@/app';
import { formato, nombreCorto } from '@/dominio';
import { T } from '../textos';

/** Une nombres de clase e ignora los vacíos. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  let salida = '';
  for (const c of clases) {
    if (!c) continue;
    salida = salida ? `${salida} ${c}` : c;
  }
  return salida;
}

/** Variables CSS en línea (medidas que dependen de datos; nunca colores sueltos). */
export function vars(valores: Record<`--${string}`, string | number>): CSSProperties {
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === 'number' ? String(v) : v;
  return salida as CSSProperties;
}

/** Grupos que cuentan como pendientes (01 §2.5), en el orden canónico que usa el índice del hub. */
export const GRUPOS_PENDIENTES: C.GrupoMuestra[] = ['pausada', 'por_vencer', 'vencida'];
/** Consulta de la cola de pendientes (la misma clave que usan Inicio y Muestras). */
export const PARAMS_PENDIENTES: ParamsMuestras = { grupo: GRUPOS_PENDIENTES, orden: 'prioridad' };

/** Nombre corto del producto (01 §6.0): el del hub o el que calcula @/dominio. */
export function nombreDe(p: Pick<C.ProductoResumen, 'titulo' | 'titulo_corto'>): string {
  return p.titulo_corto ?? nombreCorto(p.titulo);
}

/** Enlace público de un video: https://www.tiktok.com/@{username}/video/{content_id}. */
export function enlaceVideo(username: string | null | undefined, contentId: string): string {
  return `https://www.tiktok.com/@${username && username.length > 0 ? username : 'tiktok'}/video/${contentId}`;
}

/** @usuario de un enlace largo de TikTok, o null (enlace corto o id suelto). */
export function usuarioDeEnlace(texto: string): string | null {
  const m = /tiktok\.com\/@([^/?#\s]+)\/video\//i.exec(texto.trim());
  return m?.[1] ?? null;
}

/** «Solicitada 11 sep (hace 62 días)» · «Solicitada: fecha por verificar». */
export function textoSolicitada(m: C.MuestraVista): string {
  if (m.solicitada_at === null) return T.solicitadaSinFecha;
  return `${T.solicitada} ${formato.fechaCorta(m.solicitada_at)} (${formato.haceDias(m.solicitada_at)})`;
}

/** La galería y las pruebas pueden fijar la plataforma de los bloques (sin cambiar el transporte de datos). */
export const ContextoPlataformaBloques = createContext<PlataformaUi | null>(null);

/** Plataforma efectiva de los bloques: la fijada por ContextoPlataformaBloques o la de @/app. */
export function usePlataformaBloques(): PlataformaUi {
  const fijada = useContext(ContextoPlataformaBloques);
  const real = usePlataforma();
  return fijada ?? real;
}

/** true en Android (copiar y abrir TikTok, hojas inferiores, deslizar). */
export function useEsAndroid(): boolean {
  return usePlataformaBloques() === 'android';
}

/** Texto del enlace externo según la plataforma (01 §3.5). */
export function textoAbrirFuera(android: boolean): string {
  return android ? T.abrirAppTikTok : T.abrirTikTokShop;
}

/** Primera palabra con mayúscula (para encabezados que arrancan con una fecha). */
export function capitalizar(t: string): string {
  return t.length > 0 ? `${t.charAt(0).toLocaleUpperCase('es-MX')}${t.slice(1)}` : t;
}

/** Plural sencillo: (1, 'muestra') → '1 muestra' · (2, 'muestra') → '2 muestras'. */
export function cuenta(n: number, singular: string, plural?: string): string {
  return `${formato.numero(n)} ${n === 1 ? singular : plural ?? `${singular}s`}`;
}
