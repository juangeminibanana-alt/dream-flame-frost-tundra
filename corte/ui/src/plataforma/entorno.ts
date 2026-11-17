/**
 * @/plataforma · entorno de ejecución (BUILD_SPEC §8.1, §8.3). Los parámetros de desarrollo (`?simular=android`,
 * `?pc=conectada`) SOLO cuentan en `npm run dev:demo` (import.meta.env.DEV && VITE_DEMO === '1'); en `vite build`
 * import.meta.env.DEV es `false` y esas ramas se eliminan.
 */

/** true en `npm run dev:demo` (ui/.env.demo → VITE_DEMO=1). Nunca en `vite build`. */
export function modoDemo(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_DEMO === '1';
}

/** Lee un parámetro de la URL antes del hash (`/?simular=android#/inicio`) o dentro del hash (`#/inicio?simular=android`). */
export function parametroUrl(nombre: string): string | null {
  if (typeof window === 'undefined') return null;
  const listas = [new URLSearchParams(window.location.search)];
  const hash = window.location.hash;
  const i = hash.indexOf('?');
  if (i >= 0) listas.push(new URLSearchParams(hash.slice(i + 1)));
  for (const p of listas) {
    const v = p.get(nombre);
    if (v !== null && v !== '') return v;
  }
  return null;
}

/** `?simular=android` en el modo demo: la interfaz se comporta como Android sin puente nativo (datos de la copia). */
export function simulaAndroid(): boolean {
  return modoDemo() && parametroUrl('simular') === 'android';
}
