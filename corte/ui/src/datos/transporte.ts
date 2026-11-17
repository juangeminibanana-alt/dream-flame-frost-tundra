/**
 * @/datos · transporte (BUILD_SPEC §8.3): Windows (fetch con cookie + SSE), Android (fetch interceptado por ProxyHub,
 * copia sin conexión, cola de ops por el puente) o demo (ui/fixtures, solo en `npm run dev:demo`). Se elige una vez.
 * El transporte de demostración se carga con import() dinámico SOLO bajo `import.meta.env.DEV && VITE_DEMO === '1'`:
 * en `vite build` esa condición es `false` y la rama (con sus fixtures) desaparece del paquete.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, FuenteDatos, ParamsDe } from '@firmas/datos';
import type { ErrorHub } from './errores';
import { puenteAndroidDatos } from './puente';
import { crearTransporteAndroid } from './transporte_android';
import { crearTransporteWindows } from './transporte_windows';

export interface Lectura {
  datos: unknown;
  fuente: FuenteDatos;
  copia_at: C.EpochS | null;
  /** Ya trae cambios locales que el hub aún no confirma (ops en cola de Android). */
  con_cambios_pendientes: boolean;
}

export type EstadoOpTransporte = 'aplicada' | 'en_cola' | 'conflicto' | 'error';

export interface ResultadoOpTransporte {
  op_id: string;
  estado: EstadoOpTransporte;
  /** Estado tal como lo dio el hub en /api/local/ops (conserva 'duplicada'). */
  estado_hub: C.OpsResultado['estado'] | null;
  /** Lo guardado; en 'conflicto' la versión vigente; null si el transporte no lo sabe (se usa el predicho). */
  objeto: C.ObjetoLocal | null;
  error: ErrorHub | null;
}

export interface SumideroEventos {
  /** Evento del hub (SSE en Windows; traducido de la capa nativa en Android; simulado en demo). */
  evento(e: C.EventoHub): void;
  /** Invalida claves sin pasar por un EventoHub (cola de Android confirmada, reconexión del SSE…). [] = todas. */
  invalidar(claves: readonly ClaveConsulta[]): void;
}

export type MetodoMutacion = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface Transporte {
  readonly tipo: 'windows' | 'android' | 'demo';
  leer<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<Lectura>;
  /** GET de una ruta que no es una consulta (/api/sync/estado, /api/local/exportar, /api/lan/emparejar/{id}…). */
  obtener(ruta: string): Promise<unknown>;
  /** Mutación que no es estado local (hub.*, restaurar plantilla). Android: solo sync y restaurar; el resto solo_en_pc. */
  pedir(metodo: MetodoMutacion, ruta: string, cuerpo?: unknown): Promise<unknown>;
  /** Estado local. 'individual' = la ruta REST de cada op (Windows); 'lote' = /api/local/ops. */
  aplicarOps(ops: C.OpLocal[], modo: 'individual' | 'lote'): Promise<ResultadoOpTransporte[]>;
  conectarEventos(sumidero: SumideroEventos): () => void;
  /** Android: empezar a consultar /api/sync/estado cada 1.5 s (C27). En los demás, nada. */
  vigilarSync(): void;
}

let actual: Promise<Transporte> | null = null;

async function crearTransporte(): Promise<Transporte> {
  if (import.meta.env.DEV && import.meta.env.VITE_DEMO === '1') {
    const { crearTransporteDemo } = await import('./demo/transporte_demo');
    return crearTransporteDemo();
  }
  if (puenteAndroidDatos() !== null) return crearTransporteAndroid();
  return crearTransporteWindows();
}

export function obtenerTransporte(): Promise<Transporte> {
  if (!actual) actual = crearTransporte();
  return actual;
}

/** Solo pruebas: fija el transporte (o null para volver a elegirlo). */
export function fijarTransporte(t: Transporte | null): void {
  actual = t ? Promise.resolve(t) : null;
}
