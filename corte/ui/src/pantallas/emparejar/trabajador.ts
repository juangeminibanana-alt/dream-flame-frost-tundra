/** Crea el Web Worker del escáner (separado para que las pruebas lo sustituyan; happy-dom no tiene Worker). */
export function crearTrabajadorQr(): Worker | null {
  if (typeof Worker === 'undefined') return null;
  try {
    return new Worker(new URL('./escaner.worker.ts', import.meta.url), { type: 'module', name: 'escaner-qr' });
  } catch {
    return null;
  }
}
