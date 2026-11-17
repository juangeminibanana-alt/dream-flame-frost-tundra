/**
 * @/plataforma · notificaciones locales (C32, C44). La interfaz calcula la lista (dominio.calcularNotificaciones) y la
 * entrega aquí; programar REEMPLAZA todo lo programado. Windows: js_api programar_notificaciones (globo de la bandeja,
 * también con la ventana oculta). Android: AlarmManager (programarRecordatorios). Navegador: solo se recuerda.
 */
import type { NotificacionProgramada, PermisoNotificaciones } from '@firmas/plataforma';
import { apiPywebview, esperarPuente, hayPywebview, pedirAndroid, puenteAndroid } from './puentes';

const PERMISOS: ReadonlySet<string> = new Set(['concedido', 'denegado', 'no_aplica']);

function comoPermiso(v: unknown): PermisoNotificaciones | null {
  return typeof v === 'string' && PERMISOS.has(v) ? (v as PermisoNotificaciones) : null;
}

function limpiar(lista: NotificacionProgramada[]): NotificacionProgramada[] {
  return lista
    .filter((n) => typeof n.id === 'string' && n.id !== '' && Number.isFinite(n.at))
    .map((n) => ({ id: n.id, titulo: n.titulo, texto: n.texto, at: Math.trunc(n.at), ruta: n.ruta }));
}

let programadasNavegador: NotificacionProgramada[] = [];

export async function programarNotificaciones(lista: NotificacionProgramada[]): Promise<void> {
  const limpia = limpiar(lista);
  const json = JSON.stringify(limpia);
  const android = puenteAndroid();
  if (android) {
    try {
      android.programarRecordatorios(json);
    } catch {
      /* el siguiente cálculo vuelve a programar */
    }
    return;
  }
  await esperarPuente(); // la primera programación puede llegar antes de que pywebview se inyecte
  if (hayPywebview()) {
    const api = await apiPywebview('programar_notificaciones');
    if (api?.programar_notificaciones) {
      try {
        await api.programar_notificaciones(json);
      } catch {
        /* el siguiente cálculo vuelve a programar */
      }
    }
    return;
  }
  programadasNavegador = limpia;
}

/** Lo último que se programó en el navegador (sin puente). Para diagnóstico y pruebas. */
export function notificacionesProgramadasNavegador(): readonly NotificacionProgramada[] {
  return programadasNavegador;
}

export async function permisoNotificaciones(): Promise<PermisoNotificaciones> {
  const android = puenteAndroid();
  if (!android) return 'no_aplica';
  try {
    return comoPermiso(android.permisoNotificaciones()) ?? 'no_aplica';
  } catch {
    return 'no_aplica';
  }
}

const TOPE_PERMISO_MS = 60_000;

export async function pedirPermisoNotificaciones(): Promise<PermisoNotificaciones> {
  const android = puenteAndroid();
  if (!android) return 'no_aplica';
  const r = await pedirAndroid(
    'creatorhub-permiso',
    (id) => android.pedirPermisoNotificaciones(id),
    (d) => comoPermiso(d['resultado']),
    TOPE_PERMISO_MS,
  );
  return r ?? permisoNotificaciones();
}
