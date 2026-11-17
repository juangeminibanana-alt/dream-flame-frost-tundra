/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/app (BUILD_SPEC §8.1.1): router hash funcional, useClaseAncho con
   matchMedia, usePlataforma = 'navegador' (o Android con ?simular=android), capacidades en true, useTema, atajos
   básicos, usePrimeraVez en memoria, Pantalla, LimiteError y recorridos inactivos. Lo reemplaza ui/src/app/index.ts
   (paquete ui-marco). */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/app';

export { useRuta, navegar, atras, useParametro } from './navegacion';
export {
  useClaseAncho, usePanelDisponible, usePlataforma, useCapacidades, useTema, useAtajos, usePrimeraVez, useRecorrido,
  iniciarRecorridos,
} from './entorno';
export { EnlaceRuta, Pantalla, LimiteError } from './Componentes';

marcarDoble('app');
