/** Errores del emparejamiento → texto y acción de 01_ux §5.3 (tabla «Errores del emparejamiento»). */
import type { CodigoErrorEmparejamiento } from '@/plataforma';
import { T } from './textos';

export type AccionError = 'escanear' | 'intentar' | 'reintentar' | null;

export interface ErrorVisible {
  texto: string;
  ayuda: string | null;
  accion: AccionError;
}

/**
 * `trasVerificar`: el error llegó después de mostrar el número de 4 dígitos. Un 'vencido' entonces es «Sin respuesta
 * en 90 s» (no confirmaron en la PC a tiempo), no un código caducado. `mensaje` es el texto que trae el evento; se usa
 * para los casos que 01 no lista (QR inválido, código inválido, versión, PC ocupada).
 */
export function errorVisible(error: CodigoErrorEmparejamiento, mensaje: string, trasVerificar: boolean): ErrorVisible {
  switch (error) {
    case 'vencido':
      return trasVerificar
        ? { texto: T.errores.sinRespuesta, ayuda: null, accion: 'intentar' }
        : { texto: T.errores.vencido, ayuda: null, accion: 'escanear' };
    case 'rechazado':
      return { texto: T.errores.rechazado, ayuda: null, accion: 'intentar' };
    case 'red':
    case 'pc_no_encontrada':
      return { texto: T.errores.red, ayuda: T.errores.redAyuda, accion: 'reintentar' };
    case 'huella_distinta':
      return { texto: T.errores.huella, ayuda: null, accion: 'escanear' };
    // Casos que 01 no lista: el texto de la capa nativa y, si llega vacío, uno propio (nunca un error sin texto).
    case 'qr_invalido':
      return { texto: conRespaldo(mensaje, T.errores.qrInvalido), ayuda: null, accion: 'escanear' };
    case 'codigo_invalido':
      return { texto: conRespaldo(mensaje, T.errores.codigoInvalido), ayuda: null, accion: 'escanear' };
    case 'ocupado':
      return { texto: T.errores.ocupado, ayuda: null, accion: null };
    case 'version_incompatible':
      return { texto: conRespaldo(mensaje, T.errores.version), ayuda: null, accion: 'reintentar' };
    case 'cancelado':
      return { texto: conRespaldo(mensaje, T.errores.cancelado), ayuda: null, accion: null };
  }
}

function conRespaldo(mensaje: string, respaldo: string): string {
  const m = mensaje.trim();
  return m === '' ? respaldo : m;
}

export function etiquetaAccion(a: AccionError): string | null {
  if (a === 'escanear') return T.escanearDeNuevo;
  if (a === 'intentar') return T.intentarDeNuevo;
  if (a === 'reintentar') return T.reintentar;
  return null;
}
