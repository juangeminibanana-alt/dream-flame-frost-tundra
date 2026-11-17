/**
 * «Filtros y agrupación se recuerdan por dispositivo» (01 §4.2): vista, agrupación, orden y filtros de la cola en
 * localStorage, siempre con try/catch (ventana privada o almacenamiento bloqueado → solo en memoria).
 */
import { useCallback, useState } from 'react';
import type { GrupoMuestra } from '@/contrato';
import { AGRUPACIONES, FILTROS_VACIOS, GRUPOS_FILTRO, ORDENES, VISTAS, type Agrupar, type FiltrosCola, type OrdenCola, type VistaCola } from './logica';

const CLAVE = 'corte.muestras.cola.v1';

export interface PreferenciasCola {
  vista: VistaCola | null;
  agrupar: Agrupar;
  orden: OrdenCola;
  filtros: FiltrosCola;
}
export const PREFERENCIAS_INICIALES: PreferenciasCola = { vista: null, agrupar: 'prioridad', orden: 'sugerido', filtros: FILTROS_VACIOS };

const esUno = <T extends string>(lista: readonly T[], v: unknown): v is T => typeof v === 'string' && (lista as readonly string[]).includes(v);

export function leerPreferencias(): PreferenciasCola {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return PREFERENCIAS_INICIALES;
    const v: unknown = JSON.parse(crudo);
    if (v === null || typeof v !== 'object') return PREFERENCIAS_INICIALES;
    const o = v as Record<string, unknown>;
    const f = (o['filtros'] ?? {}) as Record<string, unknown>;
    const grupos = Array.isArray(f['grupos']) ? f['grupos'].filter((g): g is GrupoMuestra => esUno(GRUPOS_FILTRO, g)) : [];
    return {
      vista: esUno(VISTAS, o['vista']) ? o['vista'] : null,
      agrupar: esUno(AGRUPACIONES, o['agrupar']) ? o['agrupar'] : 'prioridad',
      orden: esUno(ORDENES, o['orden']) ? o['orden'] : 'sugerido',
      // La búsqueda no se recuerda: al volver se ve toda la cola.
      filtros: { ...FILTROS_VACIOS, grupos, yaLoVendo: f['yaLoVendo'] === true, etiquetable: f['etiquetable'] === true, conPromesa: f['conPromesa'] === true, fijadas: f['fijadas'] === true },
    };
  } catch {
    return PREFERENCIAS_INICIALES;
  }
}

export function guardarPreferencias(p: PreferenciasCola): void {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify({ ...p, filtros: { ...p.filtros, q: '' } }));
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
}

/** Estado de la barra de herramientas que se guarda solo en cada cambio. */
export function usePreferenciasCola(): [PreferenciasCola, (cambio: Partial<PreferenciasCola>) => void] {
  const [p, setP] = useState<PreferenciasCola>(leerPreferencias);
  const cambiar = useCallback((cambio: Partial<PreferenciasCola>) => {
    setP((previo) => {
      const siguiente = { ...previo, ...cambio };
      guardarPreferencias(siguiente);
      return siguiente;
    });
  }, []);
  return [p, cambiar];
}
