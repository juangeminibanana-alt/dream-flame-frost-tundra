/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/datos (BUILD_SPEC §8.1.1): lee ui/fixtures/datos con import.meta.glob
   según indice.json (y escenarios con ?simular=), acciones en memoria que responden 'aplicada', y hub.* con fixtures
   o ErrorHub('solo_en_pc'). Lo reemplaza ui/src/datos/index.ts (paquete ui-datos). */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/datos';

export { ErrorHub } from './errores';
export {
  useConsulta, consultar, invalidar, useSesion, useSync, useEventoHub, useConexionPc, useMetaImagen,
  registrarMetaImagenes, useListaEstable, useNovedades,
} from './consultas';
export { useAcciones, hub } from './acciones';

marcarDoble('datos');
