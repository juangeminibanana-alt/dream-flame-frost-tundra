/**
 * Foco atrapado para capas modales (02 §7.12–7.13, §12.2): al abrir enfoca [data-autofoco] o el contenedor; Tab y
 * Mayús+Tab dan la vuelta dentro de la capa; un foco que escapa (clic fuera, lector de pantalla) vuelve adentro; al
 * cerrar, el foco regresa al elemento que lo tenía (la fila, el botón que abrió el diálogo).
 */
import { useEffect, useRef, type RefObject } from 'react';

const SELECTOR_ENFOCABLE = [
  'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
  'textarea:not([disabled])', 'iframe', 'audio[controls]', 'video[controls]', '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])',
].join(',');

export function enfocables(contenedor: HTMLElement): HTMLElement[] {
  return Array.from(contenedor.querySelectorAll<HTMLElement>(SELECTOR_ENFOCABLE)).filter(
    (el) => !el.closest('[hidden],[inert],[aria-hidden="true"]') && el.tabIndex >= 0,
  );
}

/** Maneja Tab dentro de `contenedor`: true si movió el foco (para preventDefault). */
export function ciclarFoco(contenedor: HTMLElement, e: { key: string; shiftKey: boolean; preventDefault(): void }): void {
  if (e.key !== 'Tab') return;
  const lista = enfocables(contenedor);
  const primero = lista[0];
  const ultimo = lista[lista.length - 1];
  const activo = document.activeElement;
  if (!primero || !ultimo) {
    e.preventDefault();
    contenedor.focus();
    return;
  }
  if (e.shiftKey && (activo === primero || activo === contenedor || !contenedor.contains(activo))) {
    e.preventDefault();
    ultimo.focus();
  } else if (!e.shiftKey && (activo === ultimo || !contenedor.contains(activo))) {
    e.preventDefault();
    primero.focus();
  }
}

/** Atrapa el foco en `ref` mientras `activo`. Devuelve nada: el contenedor necesita tabIndex={-1}. */
export function useAtraparFoco(ref: RefObject<HTMLElement | null>, activo: boolean): void {
  const previo = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!activo) return undefined;
    const c = ref.current;
    if (!c) return undefined;
    previo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const autofoco = c.querySelector<HTMLElement>('[data-autofoco]');
    (autofoco ?? c).focus({ preventScroll: true });
    const alTecla = (e: KeyboardEvent): void => ciclarFoco(c, e);
    const alEntrarFoco = (e: FocusEvent): void => {
      const destino = e.target;
      if (!(destino instanceof Node) || c.contains(destino)) return;
      // Otra capa encima (un menú en portal, un toast) puede tener el foco: solo se recupera si nadie más lo reclama.
      if (destino instanceof HTMLElement && destino.closest('[data-capa-corte]')) return;
      c.focus({ preventScroll: true });
    };
    c.addEventListener('keydown', alTecla);
    document.addEventListener('focusin', alEntrarFoco);
    return () => {
      c.removeEventListener('keydown', alTecla);
      document.removeEventListener('focusin', alEntrarFoco);
      const p = previo.current;
      if (p && p.isConnected) p.focus({ preventScroll: true });
    };
  }, [activo, ref]);
}
