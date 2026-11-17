/**
 * @/raiz · reglas de arranque de BUILD_SPEC §8.6: `#/` (o el hash vacío) decide a dónde ir.
 * - Windows (y el navegador de desarrollo): sin credenciales ni datos → #/bienvenida.
 * - Android: sin emparejar → #/bienvenida.
 * - Si no, #/inicio.
 * Puro, para probarlo con tablas.
 */
import type { SessionResponse } from '@/contrato';
import type { EstadoConexionPc, PlataformaUi } from '@/plataforma';

export type DecisionArranque = 'bienvenida' | 'inicio' | 'esperar';

export interface EntradaArranque {
  plataforma: PlataformaUi;
  sesion: SessionResponse | undefined;
  /** La sesión no se pudo leer (hub caído, Android sin copia): se va a Inicio, que explica el estado. */
  sesionFallo: boolean;
  conexionPc: EstadoConexionPc | null;
}

/** ¿La ruta es la raíz (`#/`, `#`, vacío)? */
export function esRaiz(ruta: string): boolean {
  return ruta === '' || ruta === '/';
}

export function decidirArranque(e: EntradaArranque): DecisionArranque {
  if (e.plataforma === 'android') {
    if (e.conexionPc && !e.conexionPc.emparejado) return 'bienvenida';
    if (e.conexionPc) return 'inicio';
    // Sin dato del puente todavía: se decide con la sesión (copia) como en Windows.
  }
  if (e.sesion) {
    const sinCredenciales = e.sesion.conexion.estado === 'sin_credenciales' || e.sesion.conexion.estado === 'sin_autorizar';
    return sinCredenciales && !e.sesion.datos.hay_datos ? 'bienvenida' : 'inicio';
  }
  return e.sesionFallo ? 'inicio' : 'esperar';
}
