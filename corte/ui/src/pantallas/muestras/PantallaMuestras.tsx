/**
 * Muestras › Pendientes y Detalle de muestra (01 §4.2, §4.3; BUILD §8.6). Atiende #/muestras y #/muestras/m/:id:
 * - con panel disponible (≥ 1280 y no compacta, C5/C41): la cola y, a la derecha, el panel de 480 con el detalle;
 * - sin panel: la cola en #/muestras y el detalle a pantalla completa en #/muestras/m/:id.
 * Es el MISMO componente para las dos rutas, así que la cola (y su lista estable) no se desmonta al abrir el panel.
 */
import type { ReactElement } from 'react';
import { usePanelDisponible, usePlataforma, useRuta } from '@/app';
import { Pendientes } from './Pendientes';
import { DetalleCompleto } from './DetalleCompleto';

export function PantallaMuestras(): ReactElement {
  const ruta = useRuta();
  const panel = usePanelDisponible();
  const plataforma = usePlataforma();
  const id = ruta.params['id'] ?? null;
  // En Android el detalle siempre es pantalla completa (02 §7.12). ⤢ del panel = «Abrir en página completa» (?completa=1).
  const conPanel = panel && plataforma !== 'android';
  const completa = ruta.consulta.get('completa') === '1';
  if (id !== null && (!conPanel || completa)) return <DetalleCompleto id={id} />;
  return <Pendientes idAbierto={id} conPanel={conPanel} />;
}
