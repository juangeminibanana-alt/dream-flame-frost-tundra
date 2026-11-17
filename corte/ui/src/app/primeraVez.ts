/**
 * @/app · «primera vez en ESTE equipo» (01 §4.15, §7.4): recorridos, notas que se descartan, la oferta única de
 * reordenar el plan. Se guarda en localStorage (con try/catch: si el almacenamiento está bloqueado se recuerda solo en
 * memoria durante la sesión) y todos los componentes con la misma clave se enteran al instante.
 */
import { useCallback, useSyncExternalStore } from 'react';
import { almacen } from './entorno';

const PREFIJO = 'corte.visto.';
/** Respaldo en memoria por si localStorage no está disponible. */
const enMemoria = new Set<string>();
const oyentes = new Set<() => void>();

export function yaVisto(clave: string): boolean {
  return enMemoria.has(clave) || almacen.leer(PREFIJO + clave) === '1';
}

export function marcarVisto(clave: string): void {
  enMemoria.add(clave);
  almacen.escribir(PREFIJO + clave, '1');
  for (const o of [...oyentes]) o();
}

/** Solo pruebas (y «volver a ver los recorridos»): olvida una clave. */
export function olvidarVisto(clave: string): void {
  enMemoria.delete(clave);
  almacen.borrar(PREFIJO + clave);
  for (const o of [...oyentes]) o();
}

function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  const alAlmacen = (e: StorageEvent): void => {
    if (e.key === null || e.key.startsWith(PREFIJO)) fn();
  };
  if (typeof window !== 'undefined') window.addEventListener('storage', alAlmacen);
  return () => {
    oyentes.delete(fn);
    if (typeof window !== 'undefined') window.removeEventListener('storage', alAlmacen);
  };
}

/** Primera vez en ESTE equipo (caché local: recorridos, notas descartables). [esPrimera, marcarVisto]. */
export function usePrimeraVez(clave: string): [boolean, () => void] {
  const visto = useSyncExternalStore(suscribir, () => yaVisto(clave), () => true);
  const marcar = useCallback(() => marcarVisto(clave), [clave]);
  return [!visto, marcar];
}

/** Solo pruebas. */
export function reiniciarPrimeraVez(): void {
  enMemoria.clear();
}
