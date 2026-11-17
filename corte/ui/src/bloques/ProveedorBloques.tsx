/**
 * ProveedorBloques (spec/ui_firmas/bloques.d.ts, BUILD_SPEC §8.4): lo monta la raíz UNA vez dentro de ProveedorToasts.
 * Monta las hojas de etapa (planear, fecha, publicar, programar, no se puede, cambiar etapa), DialogoMensaje
 * (?mensaje=), TarjetaConfirmarAviso, DialogoMuestraNueva y, en Windows (y en el navegador de desarrollo, que habla con
 * el mismo hub), DialogoSolicitudEmparejamiento y DialogoCierre. En Android esos dos no existen (el celular no administra
 * emparejamientos ni tiene ventana).
 */
import type { ReactElement, ReactNode } from 'react';
import { AnfitrionHojas } from './control/AnfitrionHojas';
import { DialogoSolicitudEmparejamiento } from './celular/PanelQrEmparejamiento';
import { DialogoCierre } from './globales/DialogoCierre';
import { DialogoMuestraNueva } from './globales/DialogoMuestraNueva';
import { DialogoMensaje, TarjetaConfirmarAviso } from './mensajes/DialogoMensaje';
import { useEsAndroid } from './util/comun';

export function ProveedorBloques(p: { children: ReactNode }): ReactElement {
  const android = useEsAndroid();
  return (
    <AnfitrionHojas>
      {p.children}
      <DialogoMensaje />
      <TarjetaConfirmarAviso />
      <DialogoMuestraNueva />
      {!android ? <DialogoSolicitudEmparejamiento /> : null}
      {!android ? <DialogoCierre /> : null}
    </AnfitrionHojas>
  );
}
