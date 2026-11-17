/**
 * @/bloques (paquete ui-bloques) · implementación de spec/ui_firmas/bloques.d.ts rev. 3.1 (BUILD_SPEC §8.5): bloques de
 * dominio que comparten varias pantallas. Capa: usa @/componentes, @/dominio, @/datos, @/plataforma y @/app (§8.2);
 * nunca habla con la red directo. La galería (#/dev/bloques) vive en ./galeria y NO se exporta aquí.
 */
export type * from '@firmas/bloques';

export { ProveedorBloques } from './ProveedorBloques';
export { DialogoMuestraNueva } from './globales/DialogoMuestraNueva';
export { useControlMuestra } from './useControlMuestra';
export { TarjetaMuestra } from './muestras/TarjetaMuestra';
export { columnasMuestras } from './muestras/columnasMuestras';
export { ChipTikTok, ChipAvance, ChipsRazones, ChipPromesa, ChipCopiadoSinConfirmar, ChipVitrina, ChipPrioridad, ChipSalud } from './muestras/chips';
export { BotonAccionMuestra, BotonGuardarImagen, BotonCopiarGuion } from './muestras/botones';
export { FichaPrecio } from './muestras/FichaPrecio';
export { TarjetaVentasProducto } from './muestras/TarjetaVentasProducto';
export { PestanasMuestras } from './muestras/PestanasMuestras';
export { TarjetaTienda } from './catalogo/TarjetaTienda';
export { TarjetaVideo, TarjetaProductoFila } from './catalogo/TarjetaVideo';
export { columnasTiendas, columnasVideos, columnasProductos, columnasPedidos } from './catalogo/columnas';
export { ListaNotas } from './catalogo/ListaNotas';
export { EditorMensaje } from './mensajes/EditorMensaje';
export { DialogoMensaje, TarjetaConfirmarAviso } from './mensajes/DialogoMensaje';
export { PanelPlan } from './plan/PanelPlan';
export { PanelQrEmparejamiento, DialogoSolicitudEmparejamiento } from './celular/PanelQrEmparejamiento';
