/**
 * Presupuesto de fundidos de imagen (02 §8.3, §10.3): como máximo 6 fundidos a la vez (los demás aparecen al
 * instante) y ninguno mientras el scroll va a más de 1 px/ms.
 */
const MAXIMO = 6;
let activos = 0;
let escuchando = false;
let ultimo: { t: number; y: number; objetivo: EventTarget | null } = { t: 0, y: 0, objetivo: null };
let rapidoHasta = 0;

function posicion(objetivo: EventTarget | null): number {
  if (objetivo instanceof Element) return objetivo.scrollTop;
  return typeof window !== 'undefined' ? window.scrollY : 0;
}

function alScroll(e: Event): void {
  const ahora = performance.now();
  const y = posicion(e.target === document ? null : e.target);
  if (ultimo.objetivo === e.target && ahora > ultimo.t) {
    const velocidad = Math.abs(y - ultimo.y) / (ahora - ultimo.t);
    if (velocidad > 1) rapidoHasta = ahora + 150;
  }
  ultimo = { t: ahora, y, objetivo: e.target };
}

function asegurarEscucha(): void {
  if (escuchando || typeof window === 'undefined') return;
  window.addEventListener('scroll', alScroll, { capture: true, passive: true });
  escuchando = true;
}

/** true = este fundido puede animarse (y debe soltarse con soltarFundido). */
export function pedirFundido(): boolean {
  asegurarEscucha();
  if (activos >= MAXIMO) return false;
  if (typeof performance !== 'undefined' && performance.now() < rapidoHasta) return false;
  activos += 1;
  return true;
}

export function soltarFundido(): void {
  activos = Math.max(0, activos - 1);
}

/** Solo pruebas. */
export function fundidosActivos(): number {
  return activos;
}
