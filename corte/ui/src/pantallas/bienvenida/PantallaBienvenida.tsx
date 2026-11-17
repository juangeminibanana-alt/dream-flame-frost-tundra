/**
 * #/bienvenida · Primera ejecución (01_ux §4.15). Pantalla completa, fuera de la navegación.
 * - Windows W1–W6 (?paso=w1…w6): panel de marca con el avance a la izquierda y el paso a la derecha (lámina
 *   «win-bienvenida»). W2 conecta (importar el archivo anterior, la clave o autorizar con DialogoReautorizar), W3 sigue
 *   la primera sincronización y activa [Continuar] con el punto de control 1, W4 PanelPlan compacto (si se salta:
 *   iniciarRecorridos()), W5 PanelQrEmparejamiento y W6 el cierre con las tiendas por avisar.
 * - Android A1–A6 (?paso=a1…a6): A2/A2'/A3 viven en #/emparejar; aquí A1, A4 (copia), A5 (recordatorios) y A6.
 */
import { type ReactElement } from 'react';
import { usePlataforma } from '@/app';
import { BienvenidaWindows } from './Windows';
import { BienvenidaAndroid } from './Android';

export function PantallaBienvenida(): ReactElement {
  return usePlataforma() === 'android' ? <BienvenidaAndroid /> : <BienvenidaWindows />;
}
