/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/componentes (BUILD_SPEC §8.1.1): cada componente pinta una caja con
   borde punteado (--border-default), su nombre y un resumen de props; los interactivos funcionan (Boton llama
   alPulsar, Modal/Hoja/PanelLateral muestran children si están abiertos, Tabla pinta filas y columnas, Foto pinta
   <img> con la variante, ProveedorToasts/useToast muestran el texto). Lo reemplaza ui/src/componentes/index.ts
   (paquete ui-componentes). */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/componentes';

export {
  Icono, Boton, BotonIcono, Kbd, Chip, ChipEtapa, ChipFiltro, Insignia, PuntoVivo, Tarjeta, PanelFirma, Banda,
  EncabezadoPantalla, Divisor, Kpi, BandaKpi,
} from './basicos';
export { Foto, MosaicoTienda, AvatarTienda, AvatarCuenta, MiniaturaVideo, TarjetaProducto, ReproductorTikTok } from './imagenes';
export { Tabla, ListaVirtual } from './listas';
export {
  Segmentado, CampoTexto, AreaTexto, Interruptor, Casilla, OpcionRadio, SelectorNumero, ChipsDias, SelectorFecha,
  SelectorFechaHora, Menu, CampoBusqueda,
} from './controles';
export { Modal, Hoja, PanelLateral, Tooltip, BurbujaRecorrido, useToast, ProveedorToasts } from './capas';
export {
  Esqueleto, EsqueletoVista, EstadoVacio, BarraProgreso, BarraEtapas, BarraSegmentada, Ticket, Palomita, MosaicoQr,
  CodigoEmparejamiento,
} from './progreso';
export { GraficaColumnas, GraficaColumnasApiladas, BarraApilada, BarrasHorizontales, Sparkline, CalendarioCalor } from './graficas';

marcarDoble('componentes');
