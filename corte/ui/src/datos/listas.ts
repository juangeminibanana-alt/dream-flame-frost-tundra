/**
 * @/datos · listas estables y novedades (01 §3.5 y §4.16).
 * - useListaEstable: la lista visible NUNCA se reordena sola. Conserva el orden que el usuario ya ve, actualiza el
 *   contenido de cada fila, quita las que desaparecen y agrega al final las nuevas; si el orden que llegó es otro,
 *   `hayOrdenNuevo` ("Hay un orden nuevo · Actualizar") hasta aplicarOrdenNuevo().
 * - useNovedades: "Nuevo desde tu última visita" (punto azul) con una huella por fila guardada en este equipo
 *   (localStorage, siempre con try/catch; si no hay almacenamiento, en memoria).
 */
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ListaEstable } from '@firmas/datos';

function mismoOrden(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

/** Nunca reordena sola la lista visible: conserva el orden y solo actualiza el contenido de cada fila. */
export function useListaEstable<T>(items: T[] | undefined, id: (t: T) => string): ListaEstable<T> {
  const orden = useRef<string[] | null>(null);
  const [version, forzar] = useReducer((n: number) => n + 1, 0);
  const idRef = useRef(id);
  idRef.current = id;

  const { visibles, entrantes } = useMemo(() => {
    const lista = items ?? [];
    const ids = lista.map((t) => idRef.current(t));
    if (items === undefined) return { visibles: [] as T[], entrantes: ids };
    const previo = orden.current;
    if (previo === null) return { visibles: lista, entrantes: ids };
    const porId = new Map(lista.map((t, i) => [ids[i] ?? '', t] as const));
    const conocidos = new Set(previo);
    const salida: T[] = [];
    for (const i of previo) {
      const t = porId.get(i);
      if (t !== undefined) salida.push(t);
    }
    lista.forEach((t, i) => {
      if (!conocidos.has(ids[i] ?? '')) salida.push(t);
    });
    return { visibles: salida, entrantes: ids };
    // `version` cambia con aplicarOrdenNuevo(): vuelve a calcular con el orden que llegó.
  }, [items, version]);

  const idsVisibles = visibles.map((t) => idRef.current(t));
  // El orden visible pasa a ser el conocido (sin las filas que se fueron y con las nuevas al final).
  if (items !== undefined) orden.current = idsVisibles;
  const hayOrdenNuevo = items !== undefined && !mismoOrden(idsVisibles, entrantes);

  const aplicarOrdenNuevo = useCallback(() => {
    orden.current = null;
    forzar();
  }, []);

  return { items: visibles, hayOrdenNuevo, aplicarOrdenNuevo };
}

// ---------------------------------------------------------------------------------------------- novedades

const PREFIJO = 'corte.novedades.';
const MAX_HUELLAS = 2000;
const enMemoria = new Map<string, Record<string, string>>();

function leerHuellas(seccion: string): Record<string, string> | null {
  try {
    const crudo = window.localStorage.getItem(PREFIJO + seccion);
    if (crudo !== null) {
      const v: unknown = JSON.parse(crudo);
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        const salida: Record<string, string> = {};
        for (const [k, x] of Object.entries(v)) if (typeof x === 'string') salida[k] = x;
        return salida;
      }
    }
  } catch {
    /* sin almacenamiento: se usa la memoria */
  }
  return enMemoria.get(seccion) ?? null;
}

function guardarHuellas(seccion: string, huellas: Record<string, string>): void {
  const claves = Object.keys(huellas);
  const recortadas = claves.length > MAX_HUELLAS ? Object.fromEntries(claves.slice(-MAX_HUELLAS).map((k) => [k, huellas[k] ?? ''])) : huellas;
  enMemoria.set(seccion, recortadas);
  try {
    window.localStorage.setItem(PREFIJO + seccion, JSON.stringify(recortadas));
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
}

/** Solo pruebas: olvida las huellas en memoria. */
export function vaciarNovedadesEnMemoria(): void {
  enMemoria.clear();
}

/** "Nuevo desde tu última visita" (punto azul, 01_ux §3.5). La huella es por equipo (caché local). */
export function useNovedades<T>(seccion: string, items: T[] | undefined, id: (t: T) => string, huella: (t: T) => string): {
  esNuevo(t: T): boolean;
  marcarVistos(): void;
} {
  const [vistas, setVistas] = useState<Record<string, string> | null>(() => leerHuellas(seccion));
  const fn = useRef({ id, huella });
  fn.current = { id, huella };

  useEffect(() => {
    setVistas(leerHuellas(seccion));
  }, [seccion]);

  // Primera visita a la sección en este equipo: lo que hay ahora es la base (nada se marca como nuevo).
  useEffect(() => {
    if (vistas !== null || items === undefined) return;
    const base: Record<string, string> = {};
    for (const t of items) base[fn.current.id(t)] = fn.current.huella(t);
    guardarHuellas(seccion, base);
    setVistas(base);
  }, [vistas, items, seccion]);

  const esNuevo = useCallback(
    (t: T): boolean => {
      if (vistas === null) return false;
      return vistas[fn.current.id(t)] !== fn.current.huella(t);
    },
    [vistas],
  );

  const marcarVistos = useCallback(() => {
    if (items === undefined) return;
    const siguiente: Record<string, string> = { ...(leerHuellas(seccion) ?? {}) };
    for (const t of items) {
      const k = fn.current.id(t);
      delete siguiente[k]; // al final: las más recientes sobreviven al recorte
      siguiente[k] = fn.current.huella(t);
    }
    guardarHuellas(seccion, siguiente);
    setVistas(siguiente);
  }, [items, seccion]);

  return useMemo(() => ({ esNuevo, marcarVistos }), [esNuevo, marcarVistos]);
}
