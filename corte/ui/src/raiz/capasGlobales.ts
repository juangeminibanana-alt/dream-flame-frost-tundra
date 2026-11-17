/**
 * @/raiz · estado de las capas globales que se abren desde cualquier parte: la paleta de búsqueda (Ctrl+K) y el panel
 * de atajos ('?'). Un almacén mínimo sin React (useSyncExternalStore).
 *
 * Abrir la paleta desde una pantalla: spec/ui_firmas/app.d.ts no tiene una función para eso (CampoBusqueda solo recibe
 * `alAbrir`), así que el marco también la abre con el evento `corte:buscar` en window, con `?buscar=1` en el hash o
 * con un Ctrl+K sintético. `?buscar=<texto>` la abre ya con esa búsqueda. Se anota como faltante de contrato.
 */
import { useSyncExternalStore } from 'react';

export const EVENTO_BUSCAR = 'corte:buscar';

interface Estado {
  paleta: boolean;
  atajos: boolean;
}

let estado: Estado = { paleta: false, atajos: false };
const oyentes = new Set<() => void>();
/** Texto con el que abre la paleta (`?buscar=chaqueta`); vacío con Ctrl+K o `?buscar=1`. */
let textoInicial = '';

function fijar(nuevo: Partial<Estado>): void {
  const siguiente = { ...estado, ...nuevo };
  if (siguiente.paleta === estado.paleta && siguiente.atajos === estado.atajos) return;
  estado = siguiente;
  for (const o of [...oyentes]) o();
}

function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

export function abrirPaleta(texto = ''): void {
  textoInicial = texto;
  fijar({ paleta: true, atajos: false });
}
export function cerrarPaleta(): void {
  textoInicial = '';
  fijar({ paleta: false });
}
export function alternarPaleta(): void {
  textoInicial = '';
  fijar({ paleta: !estado.paleta, atajos: false });
}
/** Lo lee la paleta al abrirse (no es reactivo: solo cuenta en la apertura). */
export function textoInicialPaleta(): string {
  return textoInicial;
}
export function abrirAtajos(): void {
  fijar({ atajos: true, paleta: false });
}
export function cerrarAtajos(): void {
  fijar({ atajos: false });
}

export function usePaletaAbierta(): boolean {
  return useSyncExternalStore(suscribir, () => estado.paleta, () => false);
}
export function useAtajosAbiertos(): boolean {
  return useSyncExternalStore(suscribir, () => estado.atajos, () => false);
}

/** Solo pruebas. */
export function reiniciarCapas(): void {
  estado = { paleta: false, atajos: false };
  textoInicial = '';
  for (const o of [...oyentes]) o();
}
