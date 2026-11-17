/**
 * Pila de capas abiertas (Modal, Hoja, PanelLateral, Menú, BurbujaRecorrido):
 * - Esc cierra SOLO la capa de arriba (un menú dentro de un modal se cierra primero);
 * - mientras hay una capa modal abierta, <html data-overlay> apaga el vidrio y bloquea el scroll del fondo
 *   (02 §7.12, tokens.css §14.2, base.css). Solo se quita el atributo si lo puso esta pila.
 */
import { useEffect, useRef } from 'react';

interface Capa {
  id: number;
  modal: boolean;
  alEsc: (() => void) | null;
}

const pila: Capa[] = [];
let siguienteId = 1;
let puseOverlay = false;
let escuchando = false;

function actualizarOverlay(): void {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  const hayModal = pila.some((c) => c.modal);
  if (hayModal && !html.hasAttribute('data-overlay')) {
    html.setAttribute('data-overlay', '');
    puseOverlay = true;
  } else if (!hayModal && puseOverlay) {
    html.removeAttribute('data-overlay');
    puseOverlay = false;
  }
}

function alTecla(e: KeyboardEvent): void {
  if (e.key !== 'Escape' || e.defaultPrevented) return;
  const cima = pila[pila.length - 1];
  if (!cima?.alEsc) return;
  e.preventDefault();
  e.stopPropagation();
  cima.alEsc();
}

function asegurarEscucha(): void {
  if (escuchando || typeof document === 'undefined') return;
  document.addEventListener('keydown', alTecla, true);
  escuchando = true;
}

export function apilarCapa(modal: boolean, alEsc: (() => void) | null): number {
  asegurarEscucha();
  const id = siguienteId++;
  pila.push({ id, modal, alEsc });
  actualizarOverlay();
  return id;
}

export function quitarCapa(id: number): void {
  const i = pila.findIndex((c) => c.id === id);
  if (i >= 0) pila.splice(i, 1);
  actualizarOverlay();
}

export function esCapaSuperior(id: number): boolean {
  return pila[pila.length - 1]?.id === id;
}

/** Registra la capa mientras `activa` sea true. `alEsc` siempre es la versión más reciente. */
export function useCapa(activa: boolean, modal: boolean, alEsc: (() => void) | null): void {
  const ref = useRef(alEsc);
  ref.current = alEsc;
  useEffect(() => {
    if (!activa) return undefined;
    const id = apilarCapa(modal, () => ref.current?.());
    return () => quitarCapa(id);
  }, [activa, modal]);
}
