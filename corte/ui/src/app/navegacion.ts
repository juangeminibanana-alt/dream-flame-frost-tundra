/**
 * @/app · navegación hash (01 §3.1, BUILD_SPEC §8.6): useRuta con los parámetros con nombre de la tabla, navegar con
 * el scroll recordado de la vista anterior, atras y useParametro. Un solo almacén (useSyncExternalStore) que escucha
 * hashchange/popstate y los cambios propios (pushState no emite hashchange).
 *
 * Scroll: se recuerda la posición de cada ruta (sin la consulta). Al ir a otra ruta con navegar() la nueva empieza
 * arriba; al volver con Atrás (popstate) se restaura la que tenía. Cambiar solo la consulta (?mensaje=, ?vista=) no
 * toca el scroll. <Pantalla> termina la restauración cuando su contenido ya está listo (la página ya tiene su alto).
 */
import { useMemo, useSyncExternalStore } from 'react';
import type { Ruta } from '@firmas/app';
import { partirHash, resolverRuta } from './tablaRutas';

const oyentes = new Set<() => void>();
let escuchando = false;

/** Ruta vigente (sin consulta) y posiciones recordadas. */
let rutaVigente: string | null = null;
const posiciones = new Map<string, number>();
/** Qué hacer con el scroll la próxima vez que cambie la ruta: 'arriba' (navegar) o 'restaurar' (Atrás/Adelante). */
let intencion: 'arriba' | 'restaurar' = 'restaurar';
/** Ruta con restauración pendiente → posición a recuperar cuando la pantalla esté lista. */
let pendiente: { ruta: string; y: number } | null = null;

function hashActual(): string {
  return typeof window === 'undefined' ? '' : window.location.hash;
}

function rutaDe(hash: string): string {
  return partirHash(hash).ruta;
}

function guardarScroll(): void {
  if (rutaVigente !== null && typeof window !== 'undefined') posiciones.set(rutaVigente, window.scrollY);
}

/** Se llama en cada cambio de hash (propio o externo): decide el scroll de la ruta nueva. */
function alCambiarHash(): void {
  const nueva = rutaDe(hashActual());
  if (rutaVigente !== null && nueva !== rutaVigente) {
    const y = intencion === 'restaurar' ? (posiciones.get(nueva) ?? 0) : 0;
    pendiente = { ruta: nueva, y };
    if (y === 0 && typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo(0, 0);
      } catch {
        /* happy-dom sin scrollTo */
      }
    }
  }
  rutaVigente = nueva;
  intencion = 'restaurar';
  for (const o of [...oyentes]) o();
}

let marcoScroll = 0;
function alScroll(): void {
  if (marcoScroll) return;
  marcoScroll = window.requestAnimationFrame(() => {
    marcoScroll = 0;
    guardarScroll();
  });
}

/**
 * Los enlaces internos que no son <EnlaceRuta> (p. ej. `<a href="#/tiendas">` de un componente) también pasan por
 * navegar(): así cuentan en el historial propio (atras) y la vista nueva empieza arriba.
 */
function alClic(e: MouseEvent): void {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey) return;
  const destino = e.target instanceof Element ? e.target.closest('a[href^="#/"]') : null;
  if (!(destino instanceof HTMLAnchorElement) || destino.hasAttribute('download') || (destino.target && destino.target !== '_self')) return;
  e.preventDefault();
  navegar(destino.getAttribute('href') ?? '#/inicio');
}

/** Clic central en un enlace interno: nunca abre otra ventana (01 §3.1); navega aquí mismo. */
function alClicAuxiliar(e: MouseEvent): void {
  if (e.defaultPrevented || e.button !== 1) return;
  const destino = e.target instanceof Element ? e.target.closest('a[href^="#/"]') : null;
  if (!(destino instanceof HTMLAnchorElement)) return;
  e.preventDefault();
  navegar(destino.getAttribute('href') ?? '#/inicio');
}

function asegurarEscucha(): void {
  if (escuchando || typeof window === 'undefined') return;
  escuchando = true;
  rutaVigente = rutaDe(hashActual());
  window.addEventListener('hashchange', alCambiarHash);
  window.addEventListener('popstate', alCambiarHash);
  window.addEventListener('scroll', alScroll, { passive: true });
  document.addEventListener('click', alClic);
  document.addEventListener('auxclick', alClicAuxiliar);
}

function suscribir(avisar: () => void): () => void {
  asegurarEscucha();
  oyentes.add(avisar);
  return () => oyentes.delete(avisar);
}

export function useRuta(): Ruta {
  const hash = useSyncExternalStore(suscribir, hashActual, () => '');
  return useMemo(() => {
    const r = resolverRuta(hash);
    return { ruta: r.ruta, params: r.params, consulta: r.consulta };
  }, [hash]);
}

/** '#/x', '/x' o 'x' → '/x' (con su consulta). */
export function normalizarDestino(destino: string): string {
  let d = destino.trim();
  if (d.startsWith('#')) d = d.slice(1);
  if (!d.startsWith('/')) d = `/${d}`;
  return d;
}

function profundidad(): number {
  if (typeof window === 'undefined') return 0;
  const e: unknown = window.history.state;
  if (e !== null && typeof e === 'object' && 'corte' in e && typeof e.corte === 'number') return e.corte;
  return 0;
}

/** `destino` con o sin '#': '/tiendas/value%20chic%20clothes'. Conserva el scroll de la vista anterior. */
export function navegar(destino: string, opciones?: { reemplazar?: boolean }): void {
  if (typeof window === 'undefined') return;
  asegurarEscucha();
  const d = normalizarDestino(destino);
  if (hashActual() === `#${d}`) return;
  guardarScroll();
  intencion = 'arriba';
  if (opciones?.reemplazar) window.history.replaceState({ corte: profundidad() }, '', `#${d}`);
  else window.history.pushState({ corte: profundidad() + 1 }, '', `#${d}`);
  alCambiarHash();
}

/** Atrás dentro de la app; sin historial propio (se abrió directo en esta vista) va a Inicio. */
export function atras(): void {
  if (typeof window === 'undefined') return;
  if (profundidad() > 0) {
    window.history.back();
    return;
  }
  navegar('/inicio', { reemplazar: true });
}

/** Escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). Versión sin React de useParametro. */
export function fijarParametro(nombre: string, nuevo: string | null, opciones?: { reemplazar?: boolean }): void {
  const actual = partirHash(hashActual());
  const consulta = new URLSearchParams(actual.consulta);
  if (nuevo === null) consulta.delete(nombre);
  else consulta.set(nombre, nuevo);
  const q = consulta.toString();
  navegar(q ? `${actual.ruta}?${q}` : actual.ruta, opciones?.reemplazar ? { reemplazar: true } : {});
}

/** Lee/escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). */
export function useParametro(nombre: string): [string | null, (valor: string | null, opciones?: { reemplazar?: boolean }) => void] {
  const r = useRuta();
  const valor = r.consulta.get(nombre);
  const fijar = useMemo(
    () =>
      (nuevo: string | null, opciones?: { reemplazar?: boolean }): void => {
        fijarParametro(nombre, nuevo, opciones);
      },
    [nombre],
  );
  return [valor, fijar];
}

/** Ruta vigente sin '#' ni consulta (fuera de React). */
export function rutaActual(): string {
  return rutaDe(hashActual());
}

/** Cuántos pasos de historial propio hay detrás de la vista actual (0 = se abrió directo aquí). */
export function profundidadHistorial(): number {
  return profundidad();
}

/**
 * Restauración pendiente de la ruta indicada (la toma una sola vez). La llama <Pantalla> cuando `lista` es true:
 * el contenido ya tiene su alto y el scroll de antes se puede recuperar.
 */
export function restaurarScrollPendiente(ruta: string): void {
  if (!pendiente || pendiente.ruta !== ruta || typeof window === 'undefined') return;
  const { y } = pendiente;
  pendiente = null;
  if (y > 0 && typeof window.scrollTo === 'function') {
    try {
      window.scrollTo(0, y);
    } catch {
      /* sin scrollTo */
    }
  }
}

/** Solo pruebas: posición recordada de una ruta. */
export function scrollRecordado(ruta: string): number | undefined {
  return posiciones.get(ruta);
}

/** Solo pruebas: reinicia el estado del módulo. */
export function reiniciarNavegacion(): void {
  posiciones.clear();
  pendiente = null;
  intencion = 'restaurar';
  rutaVigente = typeof window === 'undefined' ? null : rutaDe(hashActual());
}
