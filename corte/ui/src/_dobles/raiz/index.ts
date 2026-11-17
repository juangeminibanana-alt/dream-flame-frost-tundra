/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/raiz (BUILD_SPEC §8.1.1): App mínima que pinta la ruta actual con
   import.meta.glob sobre ui/src/pantallas/<carpeta>/index.ts + lazy. Lo reemplaza ui/src/raiz/index.ts (paquete
   ui-marco). */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/raiz';

export { App } from './App';

marcarDoble('raiz');
