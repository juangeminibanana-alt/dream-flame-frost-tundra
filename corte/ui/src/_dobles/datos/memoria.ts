/* __DOBLE_CORTE__ · doble de @/datos: estado local en memoria (plan, avisos, notas, recordatorios, plantillas y
   preferencias). Las acciones escriben aquí y las consultas de esas claves lo superponen a los fixtures. */
import type * as C from '@/contrato';

export interface Memoria {
  planes: Map<string, C.PlanVideo | null>;
  avisos: Map<string, C.AvisoTienda>;
  notas: Map<string, C.Nota | null>;
  recordatorios: Map<string, C.Recordatorio | null>;
  plantillas: Map<string, C.PlantillaMensaje>;
  preferencias: C.PreferenciasSincronizadas | null;
  local_rev: number;
}

/** null en un mapa = borrado en memoria (oculta el del fixture). */
export const memoria: Memoria = {
  planes: new Map(),
  avisos: new Map(),
  notas: new Map(),
  recordatorios: new Map(),
  plantillas: new Map(),
  preferencias: null,
  local_rev: 0,
};

export function vaciarMemoria(): void {
  memoria.planes.clear();
  memoria.avisos.clear();
  memoria.notas.clear();
  memoria.recordatorios.clear();
  memoria.plantillas.clear();
  memoria.preferencias = null;
  memoria.local_rev = 0;
}

function superponer<T extends { id: string }>(items: T[], cambios: Map<string, T | null>): T[] {
  const vistos = new Set<string>();
  const salida: T[] = [];
  for (const it of items) {
    vistos.add(it.id);
    if (!cambios.has(it.id)) salida.push(it);
    else {
      const nuevo = cambios.get(it.id);
      if (nuevo) salida.push(nuevo);
    }
  }
  for (const [id, it] of cambios) if (!vistos.has(id) && it) salida.push(it);
  return salida;
}

function esLista(v: unknown): v is { items: unknown[]; local_rev?: number } {
  return v !== null && typeof v === 'object' && 'items' in v && Array.isArray(v.items);
}

/** Superpone la memoria a la respuesta de un fixture de estado local. Las demás claves pasan tal cual. */
export function superponerMemoria(clave: string, datos: unknown): unknown {
  if (clave === 'preferencias') return memoria.preferencias ?? datos;
  if (!esLista(datos)) return datos;
  const lista = datos as { items: Array<{ id: string }>; local_rev?: number };
  const rev = Math.max(lista.local_rev ?? 0, memoria.local_rev);
  switch (clave) {
    case 'plan':
      return { ...lista, items: superponer(lista.items as C.PlanVideo[], memoria.planes), local_rev: rev };
    case 'avisos':
      return { ...lista, items: superponer(lista.items as C.AvisoTienda[], memoria.avisos), local_rev: rev };
    case 'notas':
      return { ...lista, items: superponer(lista.items as C.Nota[], memoria.notas), local_rev: rev };
    case 'recordatorios':
      return { ...lista, items: superponer(lista.items as C.Recordatorio[], memoria.recordatorios), local_rev: rev };
    case 'plantillas':
      return { ...lista, items: superponer(lista.items as C.PlantillaMensaje[], memoria.plantillas), local_rev: rev };
    default:
      return datos;
  }
}
