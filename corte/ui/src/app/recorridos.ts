/**
 * @/app · recorridos breves (01 §4.15 con el texto de C36, BUILD_SPEC §8.5 (c)). Secuencia FIJA:
 * heroe_inicio (Inicio) → muestras (Muestras) → indicador_sync (indicador de sincronización de la raíz).
 * - Solo se activan si Bienvenida llama iniciarRecorridos() (el usuario saltó W4); si se creó el plan, nunca.
 * - Máximo uno visible a la vez: el paso actual. «Siguiente» pasa al siguiente y navega a su pantalla si hace falta.
 * - «Entendido» (o cerrar) termina el recorrido completo y marca la clave 'recorridos-v1' de usePrimeraVez.
 * El estado (activo y paso) se guarda en localStorage['corte.recorridos'] para sobrevivir a una recarga.
 */
import { useSyncExternalStore } from 'react';
import type { EstadoRecorrido, PasoRecorrido } from '@firmas/app';
import { almacen } from './entorno';
import { marcarVisto, yaVisto } from './primeraVez';
import { navegar } from './navegacion';
import { partirHash } from './tablaRutas';

export const CLAVE_RECORRIDOS = 'recorridos-v1';
const CLAVE_ESTADO = 'corte.recorridos';
export const SECUENCIA_RECORRIDO: readonly PasoRecorrido[] = ['heroe_inicio', 'muestras', 'indicador_sync'];

/** Textos exactos de 01 §4.15 (el tercero con C36: 30 minutos). */
export const TEXTOS_RECORRIDO: Readonly<Record<PasoRecorrido, string>> = {
  heroe_inicio: 'Arma tu plan y te decimos cuándo terminas.',
  muestras: 'Planea, marca tu avance y avisa a cada tienda.',
  indicador_sync: 'Tus datos se actualizan solos cada 30 minutos.',
};

/** Pantalla de cada paso (el indicador de sincronización está en todas: no navega). */
const RUTA_DEL_PASO: Readonly<Partial<Record<PasoRecorrido, string>>> = { heroe_inicio: '/inicio', muestras: '/muestras' };

interface Estado {
  activo: boolean;
  paso: number;
}

let estado: Estado = leer();
const oyentes = new Set<() => void>();

function leer(): Estado {
  const crudo = almacen.leer(CLAVE_ESTADO);
  if (!crudo) return { activo: false, paso: 0 };
  try {
    const v: unknown = JSON.parse(crudo);
    if (v !== null && typeof v === 'object' && 'activo' in v && 'paso' in v && typeof v.activo === 'boolean' && typeof v.paso === 'number') {
      return { activo: v.activo, paso: Math.max(0, Math.min(SECUENCIA_RECORRIDO.length - 1, Math.floor(v.paso))) };
    }
  } catch {
    /* valor corrupto: se ignora */
  }
  return { activo: false, paso: 0 };
}

function fijar(nuevo: Estado): void {
  estado = nuevo;
  almacen.escribir(CLAVE_ESTADO, JSON.stringify(nuevo));
  for (const o of [...oyentes]) o();
}

function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

/** Paso visible ahora (null si no hay recorrido activo o ya se terminó en este equipo). */
export function pasoActual(): PasoRecorrido | null {
  if (!estado.activo || yaVisto(CLAVE_RECORRIDOS)) return null;
  return SECUENCIA_RECORRIDO[estado.paso] ?? null;
}

/** Lo llama Bienvenida cuando el usuario salta W4 ("Saltar"). Si se creó el plan en W4, nunca se llama. */
export function iniciarRecorridos(): void {
  if (yaVisto(CLAVE_RECORRIDOS)) return;
  fijar({ activo: true, paso: 0 });
}

function entendido(): void {
  marcarVisto(CLAVE_RECORRIDOS);
  fijar({ activo: false, paso: 0 });
}

function siguiente(): void {
  const proximo = estado.paso + 1;
  const paso = SECUENCIA_RECORRIDO[proximo];
  if (!paso) {
    entendido();
    return;
  }
  fijar({ activo: true, paso: proximo });
  const ruta = RUTA_DEL_PASO[paso];
  if (ruta && typeof window !== 'undefined' && partirHash(window.location.hash).ruta !== ruta) navegar(ruta);
}

export function useRecorrido(paso: PasoRecorrido): EstadoRecorrido {
  const actual = useSyncExternalStore(suscribir, pasoActual, () => null);
  return {
    visible: actual === paso,
    texto: TEXTOS_RECORRIDO[paso],
    esUltimo: paso === SECUENCIA_RECORRIDO[SECUENCIA_RECORRIDO.length - 1],
    siguiente,
    entendido,
  };
}

/** Solo pruebas: vuelve a leer el estado guardado. */
export function reiniciarRecorridos(): void {
  estado = leer();
  for (const o of [...oyentes]) o();
}
