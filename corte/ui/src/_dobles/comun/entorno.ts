/* __DOBLE_CORTE__ · lectura de los parámetros de desarrollo (?simular=, ?tema=, ?densidad=) para los dobles.
   Se aceptan antes del hash (`/?simular=android#/inicio`) o dentro del hash (`#/inicio?simular=android`). */

function parametros(): URLSearchParams[] {
  if (typeof window === 'undefined') return [];
  const lista = [new URLSearchParams(window.location.search)];
  const hash = window.location.hash;
  const i = hash.indexOf('?');
  if (i >= 0) lista.push(new URLSearchParams(hash.slice(i + 1)));
  return lista;
}

export function parametroDesarrollo(nombre: string): string | null {
  for (const p of parametros()) {
    const v = p.get(nombre);
    if (v !== null && v !== '') return v;
  }
  return null;
}

export const ESCENARIOS = ['android', 'primera_vez', 'sincronizando', 'sin_fotos', 'reautorizar'] as const;
export type Escenario = (typeof ESCENARIOS)[number];

/** Escenario de fixtures activo (`?simular=<e>`), o null. */
export function escenarioActivo(): Escenario | null {
  const v = parametroDesarrollo('simular');
  return ESCENARIOS.find((e) => e === v) ?? null;
}

export function simulaAndroid(): boolean {
  return escenarioActivo() === 'android';
}

/** true en `npm run dev:demo` (VITE_DEMO=1). */
export function esModoDemo(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_DEMO === '1';
}
