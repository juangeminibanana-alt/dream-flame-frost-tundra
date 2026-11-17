/**
 * Lecturas que comparten los cuatro flujos, con las MISMAS claves de consulta que usan Inicio y Muestras (la caché de
 * @/datos se comparte y la superposición optimista ya viene aplicada). Funcionan igual en Windows y en Android sin la
 * PC: todas estas claves se arman con la copia del celular (BUILD §8.3).
 */
import { useMemo } from 'react';
import type * as C from '@/contrato';
import { useConsulta, type ErrorHub, type ParamsMuestras } from '@/datos';
import { esPendiente } from '@/dominio';

/** Grupos que cuentan como pendientes (01 §2.5), en el orden canónico del índice del hub. */
export const GRUPOS_PENDIENTES: C.GrupoMuestra[] = ['pausada', 'por_vencer', 'vencida'];
/** La cola de pendientes: la misma clave que usan Inicio, Muestras y los bloques. */
export const PARAMS_PENDIENTES: ParamsMuestras = { grupo: GRUPOS_PENDIENTES, orden: 'prioridad' };

/** Preferencias por omisión mientras llegan las del hub (01 §4.5: 3 por día, de lunes a sábado). */
export const RITMO_OMISION = { capacidad: 3, dias: [0, 1, 2, 3, 4, 5], orden: 'sugerido' as const };

export interface Ritmo {
  capacidad: number;
  dias: number[];
  orden: 'sugerido' | 'por_tipo_de_prenda';
  programo: boolean;
  rev: number | null;
}

export function ritmoDe(p: C.PreferenciasSincronizadas | undefined): Ritmo {
  return {
    capacidad: Math.max(1, Math.min(10, p?.capacidad_videos_dia ?? RITMO_OMISION.capacidad)),
    dias: p?.dias_videos ?? RITMO_OMISION.dias,
    orden: p?.orden_plan ?? RITMO_OMISION.orden,
    programo: p?.programo_mis_videos ?? false,
    rev: p?.rev ?? null,
  };
}

export interface DatosTrabajo {
  /** Todas las muestras de los grupos de trabajo (incluye publicadas y «no se puede», para la Agenda). */
  items: C.MuestraVista[];
  /** Solo las pendientes (01 §2.5). */
  pendientes: C.MuestraVista[];
  planes: C.PlanVideo[];
  avisos: C.AvisoTienda[];
  ritmo: Ritmo;
  preferencias: C.PreferenciasSincronizadas | undefined;
  /** Primera carga sin datos de muestras. */
  cargando: boolean;
  refrescando: boolean;
  /** Error sin datos que mostrar (con datos en caché, la vista sigue usable). */
  error: ErrorHub | null;
  listo: boolean;
  refrescar(): void;
}

/** Muestras de trabajo + plan + avisos + preferencias (lo que necesitan Agenda, Armar mi plan, Sesión y Avisar). */
export function useDatosTrabajo(): DatosTrabajo {
  const muestras = useConsulta('muestras', PARAMS_PENDIENTES);
  const plan = useConsulta('plan', {});
  const avisos = useConsulta('avisos', {});
  const prefs = useConsulta('preferencias', {});
  return useMemo<DatosTrabajo>(() => {
    const items = muestras.datos?.items ?? [];
    return {
      items,
      pendientes: items.filter(esPendiente),
      planes: plan.datos?.items ?? [],
      avisos: avisos.datos?.items ?? [],
      ritmo: ritmoDe(prefs.datos),
      preferencias: prefs.datos,
      cargando: muestras.datos === undefined && muestras.error === null,
      refrescando: muestras.refrescando,
      error: muestras.datos === undefined ? muestras.error : null,
      listo: muestras.datos !== undefined,
      refrescar: () => {
        void muestras.refrescar();
        void plan.refrescar();
        void avisos.refrescar();
      },
    };
  }, [muestras, plan, avisos, prefs]);
}
