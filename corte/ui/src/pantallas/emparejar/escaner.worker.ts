/** Web Worker del escáner QR (04 §B.9): recibe cuadros RGBA y responde el texto del QR o null. */
import { decodificarCuadro, type CuadroQr } from './decodificar';

self.addEventListener('message', (e: MessageEvent<CuadroQr>) => {
  self.postMessage(decodificarCuadro(e.data));
});
