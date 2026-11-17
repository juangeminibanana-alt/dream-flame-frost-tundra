/* __DOBLE_CORTE__ · doble de @/datos: ErrorHub con la forma exacta de la firma (incluye `vigente`, rev. 3.1). */
import type * as C from '@/contrato';
import type { CodigoErrorUi } from '@firmas/datos';

export class ErrorHub extends Error {
  readonly codigo: CodigoErrorUi;
  readonly http: number;
  readonly mensaje: string;
  readonly detalle: Record<string, string | number | boolean | null> | undefined;
  readonly reintentar_en_s: number | undefined;
  readonly vigente: C.ObjetoLocal | undefined;

  constructor(
    codigo: CodigoErrorUi,
    mensaje: string,
    http: number = 0,
    detalle?: Record<string, string | number | boolean | null>,
    reintentar_en_s?: number,
    vigente?: C.ObjetoLocal,
  ) {
    super(mensaje);
    this.name = 'ErrorHub';
    this.codigo = codigo;
    this.mensaje = mensaje;
    this.http = http;
    this.detalle = detalle;
    this.reintentar_en_s = reintentar_en_s;
    this.vigente = vigente;
  }
}

export function soloEnPc(): ErrorHub {
  return new ErrorHub('solo_en_pc', 'Esta acción no está disponible con los datos de demostración.', 0);
}

export function sinFixture(ruta: string): ErrorHub {
  return new ErrorHub('no_encontrado', 'No hay datos de demostración para esta vista.', 404, { ruta });
}

export function comoErrorHub(e: unknown): ErrorHub {
  if (e instanceof ErrorHub) return e;
  return new ErrorHub('error_interno', 'Algo salió mal al leer los datos de demostración.', 0);
}
