/**
 * @/raiz · datos que el marco lee de @/datos: pendientes y avisos (insignias de Muestras y Tiendas, banner de promesa
 * vencida) y un reloj que avanza cada 30 s (para «Actualizado hace 4 min»). Las consultas usan los MISMOS parámetros
 * que las pantallas, así que comparten caché y se actualizan al instante con el estado local (dominio.contarTrabajo).
 */
import { useEffect, useMemo, useState } from 'react';
import type { EpochS, MuestraVista } from '@/contrato';
import { useConsulta, type ParamsMuestras } from '@/datos';
import { ahoraS, contarTrabajo, hoyLocal, type ConteosTrabajo } from '@/dominio';

/** Pendientes por prioridad: los mismos parámetros que la cola de Muestras (spec/ui_firmas/ejemplo_uso.tsx). */
export const PARAMS_PENDIENTES: ParamsMuestras = { grupo: ['vencida', 'por_vencer', 'pausada'], orden: 'prioridad' };
const SIN_PARAMS = {};

export interface DatosTrabajo {
  pendientes: readonly MuestraVista[];
  conteos: ConteosTrabajo | null;
}

export function useTrabajo(activa: boolean): DatosTrabajo {
  const muestras = useConsulta('muestras', PARAMS_PENDIENTES, { activa });
  const avisos = useConsulta('avisos', SIN_PARAMS, { activa });
  const items = muestras.datos?.items;
  const listaAvisos = avisos.datos?.items;
  return useMemo(() => {
    if (!items) return { pendientes: [], conteos: null };
    return { pendientes: items, conteos: contarTrabajo(items, listaAvisos ?? [], hoyLocal()) };
  }, [items, listaAvisos]);
}

/**
 * Epoch actual (reloj de @/dominio) para los textos relativos: se lee en cada render y, además, se vuelve a pintar cada
 * `cadaMs`. Así, si el reloj cambia (reloj de demostración anclado al llegar la sesión), el siguiente render ya lo usa.
 */
export function useAhora(cadaMs: number = 30_000): EpochS {
  const [, setPulso] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setPulso((n) => n + 1), cadaMs);
    return () => window.clearInterval(t);
  }, [cadaMs]);
  return ahoraS();
}
