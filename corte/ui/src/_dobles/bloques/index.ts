/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/bloques (BUILD_SPEC §8.1.1): cajas con nombre; ProveedorBloques pasa
   children; useControlMuestra con promesas vacías; columnas* con 2 columnas básicas. Lo reemplaza
   ui/src/bloques/index.ts (paquete ui-bloques). */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/bloques';

export {
  ProveedorBloques, DialogoMuestraNueva, useControlMuestra, TarjetaMuestra, columnasMuestras, ChipTikTok, ChipAvance,
  ChipsRazones, ChipPromesa, ChipCopiadoSinConfirmar, ChipVitrina, ChipPrioridad, BotonAccionMuestra, FichaPrecio,
  TarjetaVentasProducto, BotonGuardarImagen, BotonCopiarGuion, PestanasMuestras, ChipSalud, TarjetaTienda,
  columnasTiendas, TarjetaVideo, columnasVideos, TarjetaProductoFila, columnasProductos, columnasPedidos, ListaNotas,
  EditorMensaje, DialogoMensaje, TarjetaConfirmarAviso, PanelPlan, PanelQrEmparejamiento,
  DialogoSolicitudEmparejamiento,
} from './Bloques';

marcarDoble('bloques');
