/**
 * Lectura del entorno SIN depender de @/app (la capa componentes solo importa @/dominio, BUILD_SPEC §8.2):
 * - plataforma: atributo data-platform de <html> (lo pone ui-marco o Java; nunca el user-agent, 02 §13);
 * - clases de ancho de 02 §5.1 con matchMedia;
 * - devicePixelRatio para elegir la variante de imagen (02 §8.2).
 */
import { useSyncExternalStore } from 'react';

export type PlataformaHtml = 'windows' | 'android';

const hayDom = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

function suscribirHtml(avisar: () => void): () => void {
  if (!hayDom() || typeof MutationObserver === 'undefined') return () => undefined;
  const o = new MutationObserver(avisar);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-platform', 'data-density', 'data-theme', 'style'] });
  return () => o.disconnect();
}

export function plataformaHtml(): PlataformaHtml {
  if (!hayDom()) return 'windows';
  return document.documentElement.getAttribute('data-platform') === 'android' ? 'android' : 'windows';
}

/** 'android' si <html data-platform="android">; si no, 'windows' (también en el navegador de desarrollo). */
export function usePlataformaHtml(): PlataformaHtml {
  return useSyncExternalStore(suscribirHtml, plataformaHtml, () => 'windows');
}

export function densidadHtml(): string {
  if (!hayDom()) return 'comfortable';
  return document.documentElement.getAttribute('data-density') ?? 'comfortable';
}

/** Cambia cuando cambian data-density o el estilo en línea de <html> (Java escribe ahí --fs). */
export function useFirmaDensidad(): string {
  return useSyncExternalStore(
    suscribirHtml,
    () => `${densidadHtml()}|${hayDom() ? document.documentElement.style.getPropertyValue('--fs') : ''}`,
    () => 'comfortable|',
  );
}

function consulta(q: string): boolean {
  return hayDom() && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

export function useMedia(q: string, servidor = false): boolean {
  return useSyncExternalStore(
    (avisar) => {
      if (!hayDom() || typeof window.matchMedia !== 'function') return () => undefined;
      const l = window.matchMedia(q);
      l.addEventListener('change', avisar);
      window.addEventListener('resize', avisar);
      return () => {
        l.removeEventListener('change', avisar);
        window.removeEventListener('resize', avisar);
      };
    },
    () => consulta(q),
    () => servidor,
  );
}

/** Compacta < 600 (02 §5.1). */
export const MEDIA_COMPACTA = '(max-width: 599px)';
/** Media 600–1179 (riel de 80). */
export const MEDIA_MEDIA = '(min-width: 600px) and (max-width: 1179px)';

export function useReducirMovimiento(): boolean {
  const sistema = useMedia('(prefers-reduced-motion: reduce)');
  const atributos = useSyncExternalStore(
    (avisar) => {
      if (!hayDom() || typeof MutationObserver === 'undefined') return () => undefined;
      const o = new MutationObserver(avisar);
      o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion', 'data-motion'] });
      return () => o.disconnect();
    },
    () => (hayDom() ? `${document.documentElement.hasAttribute('data-reduced-motion')}|${document.documentElement.getAttribute('data-motion') ?? ''}` : 'false|'),
    () => 'false|',
  );
  const [reducir, motion] = atributos.split('|');
  if (reducir === 'true') return true;
  if (motion === 'full') return false;
  return sistema;
}

function dprActual(): number {
  if (!hayDom()) return 1;
  const d = window.devicePixelRatio;
  return typeof d === 'number' && d > 0 ? d : 1;
}

/** devicePixelRatio con aviso al cambiar de pantalla o de zoom. */
export function useDpr(): number {
  return useSyncExternalStore(
    (avisar) => {
      if (!hayDom()) return () => undefined;
      window.addEventListener('resize', avisar);
      return () => window.removeEventListener('resize', avisar);
    },
    dprActual,
    () => 1,
  );
}
