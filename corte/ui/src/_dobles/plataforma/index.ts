/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/plataforma (BUILD_SPEC §8.1.1): comportamiento de navegador.
   copiarTexto con navigator.clipboard, elegirArchivo → null, estadoConexionPc → null. Lo reemplaza
   ui/src/plataforma/index.ts (paquete ui-datos). */
import type { UrlImagen } from '@/contrato';
import type {
  EstadoConexionPc, EventoEmparejamiento, InfoPlataforma, NotificacionProgramada, PcEncontrada,
  PermisoNotificaciones, ResultadoGuardar, TipoVibracion,
} from '@firmas/plataforma';
import { marcarDoble } from '../comun/marca';
import { esModoDemo, simulaAndroid } from '../comun/entorno';

export type * from '@firmas/plataforma';

/** Hosts permitidos para abrir fuera de la app (BUILD_SPEC §6.4). Solo https. */
const HOSTS_PERMITIDOS = new Set(['shop.tiktok.com', 'www.tiktok.com', 'affiliate.tiktok.com', 'seller-mx.tiktok.com', 'partner.tiktokshop.com']);

export function infoPlataforma(): InfoPlataforma {
  return {
    plataforma: simulaAndroid() ? 'android' : 'navegador',
    version_app: '0.0.0-dev',
    tiene_puente: false,
    modo_demo_navegador: esModoDemo(),
  };
}

export function esAndroid(): boolean {
  return simulaAndroid();
}

export function esWindows(): boolean {
  return false;
}

export function urlPermitida(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && HOSTS_PERMITIDOS.has(u.hostname);
  } catch {
    return false;
  }
}

export async function abrirExterno(url: string): Promise<boolean> {
  if (!urlPermitida(url)) return false;
  if (typeof window === 'undefined' || typeof window.open !== 'function') return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

export async function abrirTikTok(urlRespaldo?: string): Promise<boolean> {
  return urlRespaldo ? abrirExterno(urlRespaldo) : false;
}

export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function compartirTexto(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ text: texto });
      return true;
    }
  } catch {
    return false;
  }
  return copiarTexto(texto);
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

export async function guardarImagen(url: UrlImagen, nombreSugerido: string): Promise<ResultadoGuardar> {
  try {
    descargar(url, nombreSugerido);
    return 'guardado';
  } catch {
    return 'error';
  }
}

export async function guardarArchivo(nombreSugerido: string, mime: 'application/json' | 'text/csv', contenido: string): Promise<ResultadoGuardar> {
  try {
    const url = URL.createObjectURL(new Blob([contenido], { type: `${mime};charset=utf-8` }));
    descargar(url, nombreSugerido);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'guardado';
  } catch {
    return 'error';
  }
}

/** Solo Windows tiene diálogo nativo: en el navegador, siempre null (C46). */
export async function elegirArchivo(_titulo: string, _filtros: Array<'json'>): Promise<string | null> {
  return null;
}

export function vibrar(_tipo: TipoVibracion): void {
  /* Sin efecto en el navegador. */
}

export function mantenerPantalla(_encendida: boolean): void {
  /* Sin efecto en el navegador. */
}

export function avisarTemaNativo(_modo: 'claro' | 'oscuro'): void {
  /* Sin barra de título nativa en el navegador. */
}

let interfazLista = false;
export function avisarInterfazLista(): void {
  if (interfazLista) return;
  interfazLista = true;
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-interfaz-lista', '');
}

let programadas: NotificacionProgramada[] = [];
export async function programarNotificaciones(lista: NotificacionProgramada[]): Promise<void> {
  programadas = [...lista];
}

/** Solo para pruebas y diagnóstico del doble. */
export function notificacionesProgramadas(): readonly NotificacionProgramada[] {
  return programadas;
}

export async function permisoNotificaciones(): Promise<PermisoNotificaciones> {
  return 'no_aplica';
}

export async function pedirPermisoNotificaciones(): Promise<PermisoNotificaciones> {
  return 'no_aplica';
}

const pilaAtras: Array<() => boolean> = [];
export function registrarAtras(manejador: () => boolean): () => void {
  pilaAtras.push(manejador);
  return () => {
    const i = pilaAtras.lastIndexOf(manejador);
    if (i >= 0) pilaAtras.splice(i, 1);
  };
}

export function alVolverAlFrente(fn: () => void): () => void {
  if (typeof document === 'undefined') return () => undefined;
  const escucha = (): void => {
    if (document.visibilityState === 'visible') fn();
  };
  document.addEventListener('visibilitychange', escucha);
  return () => document.removeEventListener('visibilitychange', escucha);
}

export const ventana = {
  ocultar(): void {
    /* Sin ventana nativa en el navegador. */
  },
  cerrarDelTodo(): void {
    /* Sin ventana nativa en el navegador. */
  },
};

export function estadoConexionPc(): EstadoConexionPc | null {
  return null;
}

export function alCambiarConexionPc(_fn: (e: EstadoConexionPc) => void): () => void {
  return () => undefined;
}

export async function buscarPcs(): Promise<PcEncontrada[]> {
  return [];
}

function emparejarNoDisponible(alEvento: (e: EventoEmparejamiento) => void): () => void {
  let cancelado = false;
  const t = setTimeout(() => {
    if (!cancelado) alEvento({ fase: 'error', error: 'red', mensaje: 'Para conectar tu celular abre Corte en Android.' });
  }, 0);
  return () => {
    cancelado = true;
    clearTimeout(t);
  };
}

export function emparejarConQr(_textoQr: string, alEvento: (e: EventoEmparejamiento) => void): () => void {
  return emparejarNoDisponible(alEvento);
}

export function emparejarConCodigo(_codigo: string, _ip: string | null, alEvento: (e: EventoEmparejamiento) => void): () => void {
  return emparejarNoDisponible(alEvento);
}

export async function olvidarPc(): Promise<void> {
  /* Nada guardado en el navegador. */
}

export async function actualizarCopiaAhora(): Promise<void> {
  /* Sin copia en el navegador. */
}

export function consumirEnlacePendiente(): string | null {
  return null;
}

export function alEnlace(_fn: (url: string) => void): () => void {
  return () => undefined;
}

marcarDoble('plataforma');
