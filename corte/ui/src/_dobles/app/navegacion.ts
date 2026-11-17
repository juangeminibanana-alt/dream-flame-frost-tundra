/* __DOBLE_CORTE__ · doble de @/app: router hash funcional (BUILD_SPEC §8.6) con useSyncExternalStore. */
import { useMemo, useSyncExternalStore } from 'react';
import type { Ruta } from '@firmas/app';
import { resolverHash } from '../comun/rutas';

function suscribirHash(avisar: () => void): () => void {
  window.addEventListener('hashchange', avisar);
  window.addEventListener('popstate', avisar);
  return () => {
    window.removeEventListener('hashchange', avisar);
    window.removeEventListener('popstate', avisar);
  };
}

function hashActual(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}

export function useRuta(): Ruta {
  const hash = useSyncExternalStore(suscribirHash, hashActual, () => '');
  return useMemo(() => {
    const r = resolverHash(hash);
    return { ruta: r.ruta, params: r.params, consulta: r.consulta };
  }, [hash]);
}

function normalizarDestino(destino: string): string {
  let d = destino.startsWith('#') ? destino.slice(1) : destino;
  if (!d.startsWith('/')) d = `/${d}`;
  return d;
}

/** `destino` con o sin '#': '/tiendas/value%20chic%20clothes'. */
export function navegar(destino: string, opciones?: { reemplazar?: boolean }): void {
  const d = normalizarDestino(destino);
  if (opciones?.reemplazar) {
    window.history.replaceState(window.history.state, '', `#${d}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  if (window.location.hash === `#${d}`) return;
  window.location.hash = d;
}

export function atras(): void {
  window.history.back();
}

/** Lee/escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). */
export function useParametro(nombre: string): [string | null, (valor: string | null, opciones?: { reemplazar?: boolean }) => void] {
  const r = useRuta();
  const valor = r.consulta.get(nombre);
  const fijar = (nuevo: string | null, opciones?: { reemplazar?: boolean }): void => {
    const actual = resolverHash(window.location.hash);
    const consulta = new URLSearchParams(actual.consulta);
    if (nuevo === null) consulta.delete(nombre);
    else consulta.set(nombre, nuevo);
    const q = consulta.toString();
    navegar(q ? `${actual.ruta}?${q}` : actual.ruta, opciones?.reemplazar ? { reemplazar: true } : {});
  };
  return [valor, fijar];
}

export { normalizarDestino };
