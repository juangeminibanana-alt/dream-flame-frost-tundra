/**
 * Sesión de videos (01 §4.6) · lógica de los pasos, sin React: qué muestras entran (las planeadas para hoy o, si no
 * hay, las siguientes de la cola), el recorrido una por una (Video listo, Saltar, volver a las saltadas) y su progreso.
 * La lista se congela al empezar: cambiar la etapa de la actual no la saca ni reordena la sesión.
 */
import type * as C from '@/contrato';
import { promocionable } from '../plan/logica';

function porCola(a: C.MuestraVista, b: C.MuestraVista): number {
  return (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER) || (a.application_id < b.application_id ? -1 : 1);
}

/** «Toma las planeadas para hoy» (01 §4.6), en el orden de la cola. */
export function planeadasParaHoy(pendientes: readonly C.MuestraVista[], hoy: C.FechaLocal): C.MuestraVista[] {
  return pendientes.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada === hoy).sort(porCola);
}

/** «¿Hacemos las {3} siguientes de tu cola?»: promocionables sin video hecho (por planear o planeadas más adelante). */
export function siguientesDeCola(pendientes: readonly C.MuestraVista[], n: number, hoy: C.FechaLocal): C.MuestraVista[] {
  return pendientes
    .filter((m) => promocionable(m) && (m.avance.etapa === 'por_planear' || (m.avance.etapa === 'planeada' && (m.avance.fecha_planeada ?? hoy) >= hoy)))
    .sort(porCola)
    .slice(0, Math.max(0, n));
}

export interface EstadoSesion {
  /** application_id de la sesión, congelados al empezar. Vacío = todavía no empieza. */
  ids: string[];
  /** Posición actual dentro de `ids` (== ids.length: terminada). */
  indice: number;
  listos: string[];
  saltadas: string[];
}

export const SESION_VACIA: EstadoSesion = { ids: [], indice: 0, listos: [], saltadas: [] };

export type AccionSesion =
  | { tipo: 'empezar'; ids: string[] }
  | { tipo: 'listo'; id: string }
  | { tipo: 'saltar'; id: string }
  /** Deshacer de «Video listo»: vuelve a esa muestra. */
  | { tipo: 'deshacerListo'; id: string }
  | { tipo: 'volverASaltadas' };

function siguienteIndice(ids: readonly string[], desde: number, hechos: ReadonlySet<string>): number {
  let i = desde;
  while (i < ids.length && hechos.has(ids[i] ?? '')) i++;
  return i;
}

export function reducirSesion(e: EstadoSesion, a: AccionSesion): EstadoSesion {
  switch (a.tipo) {
    case 'empezar': {
      const ids = [...new Set(a.ids)];
      return { ids, indice: 0, listos: [], saltadas: [] };
    }
    case 'listo': {
      if (!e.ids.includes(a.id) || e.listos.includes(a.id)) return e;
      const listos = [...e.listos, a.id];
      const saltadas = e.saltadas.filter((x) => x !== a.id);
      const actual = e.ids[e.indice];
      const indice = actual === a.id ? siguienteIndice(e.ids, e.indice + 1, new Set(listos)) : e.indice;
      return { ...e, listos, saltadas, indice };
    }
    case 'saltar': {
      if (e.ids[e.indice] !== a.id) return e;
      const saltadas = e.saltadas.includes(a.id) ? e.saltadas : [...e.saltadas, a.id];
      return { ...e, saltadas, indice: siguienteIndice(e.ids, e.indice + 1, new Set(e.listos)) };
    }
    case 'deshacerListo': {
      const i = e.ids.indexOf(a.id);
      if (i < 0 || !e.listos.includes(a.id)) return e;
      return { ...e, listos: e.listos.filter((x) => x !== a.id), indice: Math.min(e.indice, i) };
    }
    case 'volverASaltadas': {
      if (e.saltadas.length === 0) return e;
      // Se recorren otra vez, en el mismo orden, solo las que saltó (las listas ya no vuelven).
      return { ids: e.saltadas, indice: 0, listos: [], saltadas: [] };
    }
  }
}

export function sesionTerminada(e: EstadoSesion): boolean {
  return e.ids.length > 0 && e.indice >= e.ids.length;
}

/** Posición 1-based de la actual y total («2 de 3»); los puntos de progreso (hecha, actual, saltada, pendiente). */
export function progresoSesion(e: EstadoSesion): { actual: number; total: number; puntos: Array<'listo' | 'actual' | 'saltada' | 'pendiente'> } {
  const listos = new Set(e.listos);
  const saltadas = new Set(e.saltadas);
  return {
    actual: Math.min(e.indice + 1, e.ids.length),
    total: e.ids.length,
    puntos: e.ids.map((id, i) => (listos.has(id) ? 'listo' : i === e.indice ? 'actual' : saltadas.has(id) ? 'saltada' : 'pendiente')),
  };
}
