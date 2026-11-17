/**
 * @/app · tamaño de ventana y plataforma (02 §5.1, BUILD_SPEC C5/C41).
 * compacta < 600 · media 600–1179 (riel de 80) · expandida 1180–1439 (lateral de 248) · amplia ≥ 1440.
 * El panel de detalle de 480 cabe desde 1280 (también en tabletas: de 600 a 1279, detalle a pantalla completa).
 */
import { useSyncExternalStore } from 'react';
import type { Capacidades } from '@/contrato';
import { infoPlataforma, type PlataformaUi } from '@/plataforma';
import { useSesion } from '@/datos';
import type { ClaseAncho } from '@firmas/app';

export const CORTES = { media: 600, expandida: 1180, panel: 1280, amplia: 1440 } as const;

function coincideMedia(q: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

function suscribirAncho(avisar: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listas = typeof window.matchMedia === 'function'
    ? [CORTES.media, CORTES.expandida, CORTES.panel, CORTES.amplia].map((c) => window.matchMedia(`(min-width: ${c}px)`))
    : [];
  for (const l of listas) l.addEventListener('change', avisar);
  window.addEventListener('resize', avisar);
  return () => {
    for (const l of listas) l.removeEventListener('change', avisar);
    window.removeEventListener('resize', avisar);
  };
}

/** Clase de ancho actual (sin React, para pruebas y para la raíz). */
export function claseDeAncho(): ClaseAncho {
  if (coincideMedia(`(min-width: ${CORTES.amplia}px)`)) return 'amplia';
  if (coincideMedia(`(min-width: ${CORTES.expandida}px)`)) return 'expandida';
  if (coincideMedia(`(min-width: ${CORTES.media}px)`)) return 'media';
  return 'compacta';
}

/** compacta < 600 · media 600–1179 (riel de 80) · expandida 1180–1439 · amplia ≥ 1440. */
export function useClaseAncho(): ClaseAncho {
  return useSyncExternalStore(suscribirAncho, claseDeAncho, () => 'expandida');
}

function panelCabe(): boolean {
  return coincideMedia(`(min-width: ${CORTES.panel}px)`);
}

/** true si cabe el panel de detalle de 480 px (ancho ≥ 1280 y no es compacta). */
export function usePanelDisponible(): boolean {
  const clase = useClaseAncho();
  const cabe = useSyncExternalStore(suscribirAncho, panelCabe, () => true);
  return cabe && clase !== 'compacta';
}

// ---------------------------------------------------------------------------------------------- plataforma

/** pywebview 6 publica su objeto después de cargar la interfaz ('pywebviewready'): la plataforma puede cambiar. */
function suscribirPlataforma(avisar: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener('pywebviewready', avisar);
  window.addEventListener('hashchange', avisar);
  return () => {
    window.removeEventListener('pywebviewready', avisar);
    window.removeEventListener('hashchange', avisar);
  };
}

function plataformaActual(): PlataformaUi {
  return infoPlataforma().plataforma;
}

export function usePlataforma(): PlataformaUi {
  return useSyncExternalStore(suscribirPlataforma, plataformaActual, () => 'navegador');
}

const SIN_CAPACIDADES: Capacidades = Object.freeze({ auth: false, lan_admin: false, portapapeles: false, escribir: false, sincronizar: false });

/** Capacidades de SessionResponse (todas false mientras carga). */
export function useCapacidades(): Capacidades {
  return useSesion().datos?.capacidades ?? SIN_CAPACIDADES;
}
