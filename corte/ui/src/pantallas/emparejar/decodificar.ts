/**
 * Decodificación de un cuadro de la cámara con jsQR 1.4.0 (04 §B.9: JS puro, en un Web Worker a 5–10 cuadros/s).
 * Función pura para que el trabajador sea una envoltura mínima y se pueda probar sin Worker.
 */
import jsQR from 'jsqr';

export interface CuadroQr {
  /** RGBA, ancho × alto × 4 bytes. */
  datos: ArrayBuffer;
  ancho: number;
  alto: number;
}

export interface ResultadoQr {
  texto: string | null;
}

export function decodificarCuadro(c: CuadroQr): ResultadoQr {
  if (c.ancho <= 0 || c.alto <= 0 || c.datos.byteLength < c.ancho * c.alto * 4) return { texto: null };
  const r = jsQR(new Uint8ClampedArray(c.datos), c.ancho, c.alto, { inversionAttempts: 'dontInvert' });
  const texto = r?.data ?? '';
  return { texto: texto === '' ? null : texto };
}
