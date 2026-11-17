/**
 * @/plataforma · acciones del sistema (C21, C22, C46; BUILD_SPEC §6.4 y §6.6; 04 §A.4 y §B.5).
 * Windows: js_api de pywebview, siempre con await. Android: CreatorHubAndroid (métodos síncronos con primitivos).
 * Navegador: APIs web equivalentes cuando existen. Antes de decidir entre Windows y navegador se espera a saber si
 * pywebview se va a inyectar (esperarPuente: inmediato una vez que se sabe).
 */
import type { UrlImagen } from '@/contrato';
import type { ResultadoGuardar, TipoVibracion } from '@firmas/plataforma';
import { apiPywebview, esperarPuente, hayPywebview, puenteAndroid } from './puentes';

/** Hosts permitidos para abrir fuera de la app (BUILD_SPEC §6.4). Solo https. */
const HOSTS_PERMITIDOS: ReadonlySet<string> = new Set([
  'shop.tiktok.com', 'www.tiktok.com', 'affiliate.tiktok.com', 'seller-mx.tiktok.com', 'partner.tiktokshop.com',
]);

export function urlPermitida(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && HOSTS_PERMITIDOS.has(u.hostname) && u.username === '' && u.password === '';
  } catch {
    return false;
  }
}

function abrirEnNavegador(url: string): boolean {
  if (typeof window === 'undefined' || typeof window.open !== 'function') return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export async function abrirExterno(url: string): Promise<boolean> {
  if (!urlPermitida(url)) return false;
  const android = puenteAndroid();
  if (android) {
    try {
      return android.abrirExterno(url) === true;
    } catch {
      return false;
    }
  }
  await esperarPuente();
  if (hayPywebview()) {
    const api = await apiPywebview('abrir_externo');
    if (api?.abrir_externo) {
      try {
        return (await api.abrir_externo(url)) === true;
      } catch {
        return false;
      }
    }
    // Sin js_api: WebView2 entrega el window.open a NewWindowRequested, que solo abre hosts de la lista (C43).
  }
  return abrirEnNavegador(url);
}

export async function abrirTikTok(urlRespaldo?: string): Promise<boolean> {
  const respaldo = urlRespaldo !== undefined && urlPermitida(urlRespaldo) ? urlRespaldo : '';
  const android = puenteAndroid();
  if (android) {
    try {
      return android.abrirTikTok(respaldo) === true;
    } catch {
      return false;
    }
  }
  return respaldo ? abrirExterno(respaldo) : false;
}

async function copiarConNavegador(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    /* sigue con el respaldo */
  }
  if (typeof document === 'undefined') return false;
  try {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = typeof document.execCommand === 'function' && document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

export async function copiarTexto(texto: string): Promise<boolean> {
  const android = puenteAndroid();
  if (android) {
    try {
      return android.copiar(texto) === true;
    } catch {
      return false;
    }
  }
  await esperarPuente();
  if (hayPywebview()) {
    const api = await apiPywebview('copiar');
    if (api?.copiar) {
      try {
        return (await api.copiar(texto)) === true;
      } catch {
        return copiarConNavegador(texto);
      }
    }
  }
  return copiarConNavegador(texto);
}

export async function compartirTexto(texto: string): Promise<boolean> {
  const android = puenteAndroid();
  if (android) {
    try {
      return android.compartir(texto) === true;
    } catch {
      return false;
    }
  }
  await esperarPuente();
  if (!hayPywebview() && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ text: texto });
      return true;
    } catch {
      return false;
    }
  }
  // Windows no tiene hoja de compartir: se copia.
  return copiarTexto(texto);
}

const RESULTADOS_PC: ReadonlySet<string> = new Set(['guardado', 'cancelado', 'error']);

function comoResultado(v: unknown): ResultadoGuardar {
  return typeof v === 'string' && RESULTADOS_PC.has(v) ? (v as ResultadoGuardar) : 'error';
}

function descargar(href: string, nombre: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = nombre;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Windows: diálogo Guardar con el ORIGINAL de la caché del hub. Android: compartir. Navegador: descarga. */
export async function guardarImagen(url: UrlImagen, nombreSugerido: string): Promise<ResultadoGuardar> {
  const android = puenteAndroid();
  if (android) {
    try {
      return android.compartirImagen(url, nombreSugerido) === true ? 'compartido' : 'error';
    } catch {
      return 'error';
    }
  }
  await esperarPuente();
  if (hayPywebview()) {
    const api = await apiPywebview('guardar_imagen');
    if (!api?.guardar_imagen) return 'error';
    try {
      return comoResultado(await api.guardar_imagen(url, nombreSugerido));
    } catch {
      return 'error';
    }
  }
  if (typeof document === 'undefined') return 'error';
  try {
    descargar(url, nombreSugerido);
    return 'guardado';
  } catch {
    return 'error';
  }
}

export async function guardarArchivo(nombreSugerido: string, mime: 'application/json' | 'text/csv', contenido: string): Promise<ResultadoGuardar> {
  const android = puenteAndroid();
  if (android) {
    try {
      return android.compartirArchivo(nombreSugerido, mime, contenido) === true ? 'compartido' : 'error';
    } catch {
      return 'error';
    }
  }
  await esperarPuente();
  if (hayPywebview()) {
    const api = await apiPywebview('guardar_archivo');
    if (!api?.guardar_archivo) return 'error';
    try {
      return comoResultado(await api.guardar_archivo(nombreSugerido, mime, contenido));
    } catch {
      return 'error';
    }
  }
  if (typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return 'error';
  try {
    const url = URL.createObjectURL(new Blob([contenido], { type: `${mime};charset=utf-8` }));
    descargar(url, nombreSugerido);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'guardado';
  } catch {
    return 'error';
  }
}

/**
 * C46 · Solo Windows: diálogo Abrir nativo (js_api elegir_archivo). Devuelve la RUTA absoluta, que solo viaja al hub
 * (ImportarRequest.ruta, ImportarLocalRequest.ruta). Android y navegador: null SIEMPRE (no se toca el puente).
 */
export async function elegirArchivo(titulo: string, filtros: Array<'json'>): Promise<string | null> {
  if (puenteAndroid() !== null) return null;
  await esperarPuente();
  if (!hayPywebview()) return null;
  const api = await apiPywebview('elegir_archivo');
  if (!api?.elegir_archivo) return null;
  try {
    const ruta: unknown = await api.elegir_archivo(titulo, [...filtros]);
    return typeof ruta === 'string' && ruta.trim() !== '' ? ruta : null;
  } catch {
    return null;
  }
}

export function vibrar(tipo: TipoVibracion): void {
  try {
    puenteAndroid()?.vibrar(tipo);
  } catch {
    /* sin vibración */
  }
}

export function mantenerPantalla(encendida: boolean): void {
  try {
    puenteAndroid()?.mantenerPantalla(encendida);
  } catch {
    /* sin efecto */
  }
}

/** Ejecuta una llamada a la js_api sin bloquear a quien llama (pero con await adentro, 04 §A.4). */
export function enSegundoPlano(fn: () => Promise<unknown>): void {
  void fn().catch(() => undefined);
}

export function avisarTemaNativo(modo: 'claro' | 'oscuro'): void {
  const android = puenteAndroid();
  if (android) {
    try {
      android.tema(modo);
    } catch {
      /* sin efecto */
    }
    return;
  }
  // Puede llegar antes de que pywebview se inyecte (primer tema al montar): apiPywebview espera a 'pywebviewready'.
  enSegundoPlano(async () => {
    const api = await apiPywebview('tema');
    if (api?.tema) await api.tema(modo);
  });
}

let interfazLista = false;

/** La interfaz pintó su primera vista con datos (Windows `--medir`, Android retira el splash). Solo la primera vez. */
export function avisarInterfazLista(): void {
  if (interfazLista) return;
  interfazLista = true;
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-interfaz-lista', '');
  const android = puenteAndroid();
  if (android) {
    try {
      android.lista();
    } catch {
      /* sin efecto */
    }
    return;
  }
  // La primera vista con datos puede pintarse antes de que pywebview se inyecte: sin esta espera `--medir` y la
  // autoprueba no recibirían nunca lista().
  enSegundoPlano(async () => {
    const api = await apiPywebview('lista');
    if (api?.lista) await api.lista();
  });
}

/** Solo pruebas. */
export function reiniciarInterfazListaParaPruebas(): void {
  interfazLista = false;
}
