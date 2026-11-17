/**
 * @/plataforma · acceso tipado a los puentes crudos (spec/ui_firmas/plataforma.d.ts: ApiPywebview, PuenteAndroid,
 * EventosAndroid). Nadie fuera de ui/src/plataforma y ui/src/datos (paquete ui-datos) toca window.pywebview ni
 * window.CreatorHubAndroid.
 * - pywebview publica window.pywebview (con su api) de forma asíncrona y dispara 'pywebviewready'. pywebview 6.2.1
 *   (el de .venv-hub) lo inyecta en NavigationCompleted de WebView2, es decir DESPUÉS del evento load, cuando la
 *   interfaz ya arrancó: las llamadas a la js_api que llegan antes esperan a 'pywebviewready' (esperarPuente). Las
 *   llamadas a la js_api devuelven Promesa: SIEMPRE con await (04 §A.4).
 * - Android: addJavascriptInterface publica window.CreatorHubAndroid antes de que corra la página (no se espera).
 *   Cada pedido largo lleva un idPedido y su respuesta llega como CustomEvent en window con el mismo id.
 */
import type { ApiPywebview, EventosAndroid, PuenteAndroid } from '@firmas/plataforma';

interface VentanaCorte {
  pywebview?: { api?: Partial<ApiPywebview> } | null;
  CreatorHubAndroid?: PuenteAndroid | null;
  creatorHubBack?: () => boolean;
}

export function ventanaCorte(): (Window & VentanaCorte) | null {
  return typeof window === 'undefined' ? null : (window as Window & VentanaCorte);
}

/** El puente de Android, o null (Windows, navegador o modo demo con ?simular=android). */
export function puenteAndroid(): PuenteAndroid | null {
  const p = ventanaCorte()?.CreatorHubAndroid;
  return p !== undefined && p !== null && typeof p === 'object' ? p : null;
}

/** true si corre dentro de la ventana de pywebview (Windows), aunque la js_api aún no esté publicada. */
export function hayPywebview(): boolean {
  const p = ventanaCorte()?.pywebview;
  return p !== undefined && p !== null && typeof p === 'object';
}

// ---------------------------------------------------------------------------------------------- pywebview

/** window.pywebview existe pero su api todavía no: tope para 'pywebviewready'. */
const ESPERA_API_MS = 3000;
/** Sin window.pywebview: cuánto se espera después de load a que pywebview se inyecte (navegador = nunca llega). */
const GRACIA_TRAS_CARGA_MS = 2500;
/** En el origen del propio hub (solo lo abre la ventana de Windows) se espera más antes de darlo por perdido. */
const GRACIA_ORIGEN_HUB_MS = 10_000;
/** Tope absoluto de cualquier espera (por si load nunca llega). */
const TOPE_ESPERA_MS = 15_000;

let apiLista = false;
let graciaTerminada = false;

if (typeof window !== 'undefined') {
  window.addEventListener('pywebviewready', () => {
    apiLista = true;
  });
}

function apiPublicada(): boolean {
  const api = ventanaCorte()?.pywebview?.api;
  return api !== undefined && api !== null && typeof api === 'object';
}

/**
 * La ventana de Windows carga la interfaz desde el propio hub: http://127.0.0.1:39229 (respaldo 39228…39220, C8).
 * Ningún otro origen sirve esa interfaz con sesión (la cookie solo sale de /boot?t=, que abre el shell).
 */
export function esOrigenDelHub(): boolean {
  if (typeof location === 'undefined') return false;
  const p = Number(location.port);
  return location.protocol === 'http:' && location.hostname === '127.0.0.1' && Number.isInteger(p) && p >= 39220 && p <= 39229;
}

/**
 * Resuelve cuando ya se sabe si la interfaz corre con puente: al instante con Android o con la js_api publicada; si no,
 * con 'pywebviewready' o al vencer la gracia (2.5 s después de load; 10 s en el origen del hub). Después de una gracia
 * vencida en el navegador ya no se vuelve a esperar. Nunca rechaza.
 */
export function esperarPuente(): Promise<void> {
  const w = ventanaCorte();
  if (!w || apiLista || puenteAndroid() !== null || apiPublicada()) return Promise.resolve();
  const objetoSinApi = hayPywebview();
  if (!objetoSinApi && graciaTerminada) return Promise.resolve();
  return new Promise((resolve) => {
    const relojes: Array<ReturnType<typeof setTimeout>> = [];
    let hecho = false;
    const fin = (): void => {
      if (hecho) return;
      hecho = true;
      for (const t of relojes) clearTimeout(t);
      w.removeEventListener('pywebviewready', fin);
      w.removeEventListener('load', alCargar);
      resolve();
    };
    const vencio = (): void => {
      if (!hayPywebview() && !esOrigenDelHub()) graciaTerminada = true;
      fin();
    };
    const alCargar = (): void => {
      relojes.push(setTimeout(vencio, esOrigenDelHub() ? GRACIA_ORIGEN_HUB_MS : GRACIA_TRAS_CARGA_MS));
    };
    w.addEventListener('pywebviewready', fin);
    relojes.push(setTimeout(vencio, objetoSinApi ? ESPERA_API_MS : TOPE_ESPERA_MS));
    if (!objetoSinApi) {
      if (typeof document === 'undefined' || document.readyState === 'complete') alCargar();
      else w.addEventListener('load', alCargar, { once: true });
    }
  });
}

/**
 * La js_api de pywebview con el método pedido listo para llamarse (con await), o null si no corre en Windows o el
 * shell no expone ese método. Si la js_api aún no está publicada, primero espera (esperarPuente).
 */
export async function apiPywebview(metodo: keyof ApiPywebview): Promise<Partial<ApiPywebview> | null> {
  if (typeof ventanaCorte()?.pywebview?.api?.[metodo] !== 'function') await esperarPuente();
  const api = ventanaCorte()?.pywebview?.api;
  return api && typeof api[metodo] === 'function' ? api : null;
}

/** Solo pruebas: olvida que pywebview ya avisó y vuelve a abrir la gracia de inyección. */
export function reiniciarPywebviewParaPruebas(): void {
  apiLista = false;
  graciaTerminada = false;
}

/** Solo pruebas: da por vencida la gracia (el navegador ya no espera a pywebview). */
export function terminarGraciaParaPruebas(): void {
  graciaTerminada = true;
}

// ---------------------------------------------------------------------------------------------- Android: eventos

export type NombreEventoAndroid = keyof EventosAndroid;

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Lee el `detail` de un CustomEvent como objeto (o null si no lo es). */
export function detalleDe(e: Event): Record<string, unknown> | null {
  if (!('detail' in e)) return null;
  const d: unknown = e.detail;
  if (typeof d === 'string') {
    try {
      const v: unknown = JSON.parse(d);
      return esObjeto(v) ? v : null;
    } catch {
      return null;
    }
  }
  return esObjeto(d) ? d : null;
}

/** Escucha un CustomEvent de la capa nativa; `leer` valida y convierte el detail (null = se ignora). */
export function escucharAndroid<T>(nombre: NombreEventoAndroid, leer: (d: Record<string, unknown>) => T | null, fn: (v: T) => void): () => void {
  const w = ventanaCorte();
  if (!w) return () => undefined;
  const escucha = (e: Event): void => {
    const d = detalleDe(e);
    if (!d) return;
    const v = leer(d);
    if (v !== null) fn(v);
  };
  w.addEventListener(nombre, escucha);
  return () => w.removeEventListener(nombre, escucha);
}

let contadorPedidos = 0;

/** idPedido único de esta sesión de la interfaz. */
export function nuevoIdPedido(): string {
  contadorPedidos += 1;
  return `corte-${Date.now().toString(36)}-${contadorPedidos}`;
}

/**
 * Llama al puente con un idPedido y espera el CustomEvent `nombre` cuyo detail.id coincide. El oyente se registra
 * ANTES de llamar al puente. `tope_ms` vencido o error del puente → null.
 */
export function pedirAndroid<T>(
  nombre: NombreEventoAndroid,
  llamar: (idPedido: string) => void,
  leer: (d: Record<string, unknown>) => T | null,
  tope_ms: number,
): Promise<T | null> {
  return new Promise((resolve) => {
    const id = nuevoIdPedido();
    let hecho = false;
    const terminar = (v: T | null): void => {
      if (hecho) return;
      hecho = true;
      clearTimeout(t);
      quitar();
      resolve(v);
    };
    const quitar = escucharAndroid(nombre, (d) => (d['id'] === id ? leer(d) : null), (v) => terminar(v));
    const t = setTimeout(() => terminar(null), tope_ms);
    try {
      llamar(id);
    } catch {
      terminar(null);
    }
  });
}
