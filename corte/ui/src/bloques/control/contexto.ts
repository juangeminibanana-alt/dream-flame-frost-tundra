/**
 * @/bloques · contexto de las hojas de etapa que monta ProveedorBloques UNA vez (01 §3.3: hojas para cambiar etapa y
 * elegir fecha). useControlMuestra pide una hoja y la promesa se resuelve cuando la hoja se cierra (con o sin cambio).
 */
import { createContext, useCallback, useContext } from 'react';
import type * as C from '@/contrato';
import { navegar } from '@/app';

export type PeticionHoja =
  /** «¿Qué día haces este video?» (planear) o «Mover a otro día» (mover), con la ocupación por día. */
  | { tipo: 'planear'; m: C.MuestraVista; modo: 'planear' | 'mover' }
  /** Confirmación de promesa (01 §4.4) cuando ya se sabe la fecha. */
  | { tipo: 'promesa'; m: C.MuestraVista; fecha: C.FechaLocal; modo: 'planear' | 'mover' }
  /** «¿Tienes el enlace del video?» (Marcar publicada) o «Vincular un video». */
  | { tipo: 'publicar'; m: C.MuestraVista; origen: 'etapa' | 'vincular'; sugerido?: string }
  /** «¿Cuándo se publica?» (fecha y hora obligatorias). */
  | { tipo: 'programar'; m: C.MuestraVista }
  /** «No puedo hacer este video» (motivo obligatorio). */
  | { tipo: 'no_se_puede'; m: C.MuestraVista }
  /** «Cambiar etapa ▸» del menú ⋯. */
  | { tipo: 'etapa'; m: C.MuestraVista };

export interface ApiHojas {
  abrir(p: PeticionHoja): Promise<void>;
}

/** null = no hay ProveedorBloques montado (las acciones directas siguen funcionando; las hojas no se abren). */
export const ContextoHojas = createContext<ApiHojas | null>(null);

const RESUELTA: Promise<void> = Promise.resolve();

/** Abre una hoja de etapa directamente (p. ej. «Cambiar etapa…» del menú ⋯). Sin proveedor no hace nada. */
export function useAbrirHoja(): (p: PeticionHoja) => Promise<void> {
  const hojas = useContext(ContextoHojas);
  return useCallback((p: PeticionHoja) => (hojas ? hojas.abrir(p) : RESUELTA), [hojas]);
}

export type DestinoMensaje = { solicitud: string } | { tienda: string };

/** Hash actual separado en ruta y consulta (rutas hash de BUILD_SPEC §8.6). */
function hashActual(): { ruta: string; consulta: URLSearchParams } {
  const h = typeof window === 'undefined' ? '' : window.location.hash.replace(/^#/, '');
  const i = h.indexOf('?');
  const ruta = (i >= 0 ? h.slice(0, i) : h) || '/';
  return { ruta: ruta.startsWith('/') ? ruta : `/${ruta}`, consulta: new URLSearchParams(i >= 0 ? h.slice(i + 1) : '') };
}

/** Abre el diálogo de 01 §4.8 con ?mensaje=<id> o ?mensaje=t:<tienda_key> (y la plantilla preseleccionada, si viene). */
export function abrirMensajeEn(destino: DestinoMensaje, extra?: { plantilla?: string }): void {
  const { ruta, consulta } = hashActual();
  consulta.set('mensaje', 'solicitud' in destino ? destino.solicitud : `t:${destino.tienda}`);
  if (extra?.plantilla) consulta.set('plantilla', extra.plantilla);
  else consulta.delete('plantilla');
  navegar(`${ruta}?${consulta.toString()}`);
}

/** Quita ?mensaje y ?plantilla sin agregar otra entrada al historial. */
export function cerrarMensaje(): void {
  const { ruta, consulta } = hashActual();
  if (!consulta.has('mensaje') && !consulta.has('plantilla')) return;
  consulta.delete('mensaje');
  consulta.delete('plantilla');
  const q = consulta.toString();
  navegar(q ? `${ruta}?${q}` : ruta, { reemplazar: true });
}
