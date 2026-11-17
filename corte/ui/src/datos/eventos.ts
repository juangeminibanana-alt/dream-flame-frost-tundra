/**
 * @/datos · motor de eventos y refresco (BUILD_SPEC §8.3, §6.3.3). Se enciende con la primera consulta o suscripción:
 * Windows = SSE /api/events; Android = eventos de la capa nativa (creatorhub-copia → datos.cambiaron, sondeo de
 * /api/sync/estado durante una sync); demo = secuencia del escenario.
 * `datos.cambiaron` (también por img_rev) invalida SOLO las claves de sus secciones, con antirrebote de 2 s (y como
 * máximo 10 s de espera si los avisos no paran), para que un lote de imágenes no provoque una ola de peticiones.
 */
import { useEffect, useRef, useSyncExternalStore } from 'react';
import type * as C from '@/contrato';
import type { ClaveConsulta } from '@firmas/datos';
import { escribirEntrada, invalidarClaves } from './almacen';
import { CLAVES_CON_IMAGENES, clavesDeSecciones } from './rutas';
import { obtenerTransporte } from './transporte';

export const ANTIRREBOTE_MS = 2000;
export const ESPERA_MAXIMA_MS = 10_000;

// ---------------------------------------------------------------------------------------------- invalidación diferida

let pendientes: Set<ClaveConsulta> | 'todas' | null = null;
let temporizador: ReturnType<typeof setTimeout> | null = null;
let primeraAt: number | null = null;

function vaciarPendientes(): void {
  const p = pendientes;
  pendientes = null;
  primeraAt = null;
  if (temporizador) clearTimeout(temporizador);
  temporizador = null;
  if (p === 'todas') invalidarClaves([]);
  else if (p && p.size > 0) invalidarClaves([...p]);
}

/** Junta claves a invalidar y las invalida juntas 2 s después del último aviso (máx. 10 s desde el primero). [] = todas. */
export function programarInvalidacion(claves: readonly ClaveConsulta[]): void {
  if (claves.length === 0) pendientes = 'todas';
  else if (pendientes !== 'todas') {
    const set = pendientes ?? new Set<ClaveConsulta>();
    for (const c of claves) set.add(c);
    pendientes = set;
  }
  const t = Date.now();
  if (primeraAt === null) primeraAt = t;
  if (temporizador) clearTimeout(temporizador);
  const espera = Math.max(0, Math.min(ANTIRREBOTE_MS, primeraAt + ESPERA_MAXIMA_MS - t));
  temporizador = setTimeout(vaciarPendientes, espera);
}

// ---------------------------------------------------------------------------------------------- estado de la sincronización

let estadoSync: C.SyncEstado | null = null;
const oyentesSync = new Set<() => void>();

export function fijarEstadoSync(e: C.SyncEstado | null): void {
  estadoSync = e;
  for (const fn of [...oyentesSync]) fn();
}

function suscribirSync(fn: () => void): () => void {
  oyentesSync.add(fn);
  return () => {
    oyentesSync.delete(fn);
  };
}

function leerSync(): C.SyncEstado | null {
  return estadoSync;
}

/** Último SyncEstado que llegó por eventos (null si aún no llega ninguno). */
export function useEstadoSyncEventos(): C.SyncEstado | null {
  return useSyncExternalStore(suscribirSync, leerSync, leerSync);
}

// ---------------------------------------------------------------------------------------------- motor

type Manejador = (e: C.EventoHub) => void;
const manejadores = new Set<Manejador>();
let encendido: Promise<void> | null = null;
let apagar: (() => void) | null = null;
let ultimoImgRev: number | null = null;

export function recibirEvento(e: C.EventoHub): void {
  for (const m of [...manejadores]) {
    try {
      m(e);
    } catch {
      /* un manejador con error no corta a los demás */
    }
  }
  switch (e.tipo) {
    case 'datos.cambiaron': {
      const claves = clavesDeSecciones(e.secciones);
      if (e.img_rev !== undefined && e.img_rev !== ultimoImgRev) {
        ultimoImgRev = e.img_rev;
        claves.push(...CLAVES_CON_IMAGENES);
      }
      programarInvalidacion(claves);
      break;
    }
    case 'sync.progreso':
      fijarEstadoSync(e.estado);
      break;
    case 'sync.fin':
      fijarEstadoSync(e.estado);
      programarInvalidacion(['sesion', 'sync_historial', 'sync_cobertura']);
      break;
    case 'conexion.cambio':
      programarInvalidacion(['sesion', 'credenciales']);
      break;
    case 'display.cambio':
      // rev. 5 · Trae el EstadoDisplay completo: se escribe tal cual (sin sondeo ni antirrebote) para que Ajustes vea al
      // instante que la conexión quedó lista o falló.
      escribirEntrada('display', {}, e.display);
      break;
    default:
      break;
  }
}

/** Enciende el motor una sola vez (idempotente). */
export function iniciarMotor(): void {
  if (encendido) return;
  encendido = obtenerTransporte()
    .then((t) => {
      apagar = t.conectarEventos({ evento: recibirEvento, invalidar: programarInvalidacion });
    })
    .catch(() => {
      encendido = null;
    });
}

/** Windows: SSE /api/events. Android: los eventos que traduce la capa nativa. Se desuscribe al desmontar. */
export function useEventoHub(manejador: (e: C.EventoHub) => void): void {
  const ref = useRef(manejador);
  ref.current = manejador;
  useEffect(() => {
    iniciarMotor();
    const m: Manejador = (e) => ref.current(e);
    manejadores.add(m);
    return () => {
      manejadores.delete(m);
    };
  }, []);
}

/** Solo pruebas: apaga el motor y olvida lo pendiente. */
export async function reiniciarEventos(): Promise<void> {
  if (encendido) await encendido;
  apagar?.();
  apagar = null;
  encendido = null;
  manejadores.clear();
  if (temporizador) clearTimeout(temporizador);
  temporizador = null;
  pendientes = null;
  primeraAt = null;
  ultimoImgRev = null;
  estadoSync = null;
}
