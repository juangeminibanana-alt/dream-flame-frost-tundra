/**
 * FIRMAS NORMATIVAS · exportaciones de cada carpeta de pantallas (BUILD_SPEC §8.6). La tabla de rutas de ui-marco
 * (ui/src/app/rutas.tsx) importa EXACTAMENTE estos nombres, siempre con import.meta.glob + React.lazy (nunca estático:
 * así compila y corre aunque falte una carpeta). Cada pantalla es un componente sin props: lee sus parámetros con
 * useRuta() / useParametro() de @/app. En `vite build` deben existir los 10 módulos de pantallas y NO la galería.
 */
import type { ReactElement } from 'react';

type PantallaSinProps = () => ReactElement;

/** ui/src/pantallas/inicio/index.ts (paquete ui-inicio-ventas) */
export interface ModuloInicio { PantallaInicio: PantallaSinProps }
/** ui/src/pantallas/ventas/index.ts (paquete ui-inicio-ventas) */
export interface ModuloVentas { PantallaVentas: PantallaSinProps }
/** ui/src/pantallas/muestras/index.ts (paquete ui-muestras-cola). PantallaMuestras atiende #/muestras y
 *  #/muestras/m/:id (lista + panel de 480 o detalle a pantalla completa según usePanelDisponible). */
export interface ModuloMuestras { PantallaMuestras: PantallaSinProps; PantallaMuestrasTodas: PantallaSinProps }
/** ui/src/pantallas/flujos/index.ts (paquete ui-muestras-flujos) */
export interface ModuloFlujos {
  PantallaAgenda: PantallaSinProps;
  PantallaArmarPlan: PantallaSinProps;
  PantallaSesion: PantallaSinProps;
  PantallaAvisar: PantallaSinProps;
}
/** ui/src/pantallas/tiendas|videos|productos/index.ts (paquete ui-catalogo) */
export interface ModuloTiendas { PantallaTiendas: PantallaSinProps; PantallaTienda: PantallaSinProps }
export interface ModuloVideos { PantallaVideos: PantallaSinProps; PantallaVideo: PantallaSinProps; PantallaGenerar: PantallaSinProps }
export interface ModuloProductos { PantallaProductos: PantallaSinProps; PantallaProducto: PantallaSinProps }
/** ui/src/pantallas/ajustes/index.ts (paquete ui-ajustes). PantallaAjustes atiende #/ajustes y #/ajustes/:seccion
 *  (en compacta, #/ajustes es la lista "Más"). DialogoReautorizar lee ?reautorizar=1 y lo monta ui-marco con
 *  import.meta.glob + lazy (sin import estático). En Android NO reautoriza (C35): muestra el estado y
 *  "Reautoriza desde Corte en tu PC". */
export interface ModuloAjustes { PantallaAjustes: PantallaSinProps; DialogoReautorizar: () => ReactElement | null }
/** ui/src/pantallas/bienvenida/index.ts (paquete ui-ajustes): W1–W6 en Windows, A1–A6 en Android. */
export interface ModuloBienvenida { PantallaBienvenida: PantallaSinProps }
/** ui/src/pantallas/emparejar/index.ts (paquete ui-ajustes): A2/A2'/A3 (cámara + jsQR, código, número de 4 dígitos). */
export interface ModuloEmparejar { PantallaEmparejar: PantallaSinProps }
/** ui/src/componentes/galeria/index.ts (paquete ui-componentes): #/dev/galeria, solo en desarrollo (verificar_dist
 *  falla si aparece en el build). */
export interface ModuloGaleria { GaleriaComponentes: PantallaSinProps }
/** rev. 3.1 · ui/src/bloques/galeria/index.ts (paquete ui-bloques): #/dev/bloques, solo en desarrollo, con fixtures. */
export interface ModuloGaleriaBloques { GaleriaBloques: PantallaSinProps }
