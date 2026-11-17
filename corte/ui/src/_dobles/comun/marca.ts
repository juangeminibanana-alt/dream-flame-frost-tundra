/* __DOBLE_CORTE__ · utilidades compartidas de los dobles de ejecución (BUILD_SPEC §8.1.1). Nunca llegan a `dist`:
   el plugin corte-respaldo-dobles falla en `vite build` y scripts/verificar_dist.mjs busca este marcador. */

type GlobalConDobles = typeof globalThis & { __DOBLE_CORTE__?: string[] };

/** Cada doble se registra al cargarse: la App doble lista cuáles están activos. La propiedad global lleva el
 *  nombre del marcador para que sobreviva a cualquier minificación (los nombres de propiedad no se acortan). */
export function marcarDoble(modulo: string): void {
  const g = globalThis as GlobalConDobles;
  const lista = g.__DOBLE_CORTE__ ?? (g.__DOBLE_CORTE__ = []);
  if (!lista.includes(modulo)) lista.push(modulo);
}

export function doblesActivos(): readonly string[] {
  return (globalThis as GlobalConDobles).__DOBLE_CORTE__ ?? [];
}
