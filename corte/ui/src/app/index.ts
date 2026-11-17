/**
 * @/app (paquete ui-marco) · implementación de spec/ui_firmas/app.d.ts rev. 3.1 (BUILD_SPEC §8.4): navegación hash,
 * tamaño de ventana y plataforma, tema, atajos, primera vez, recorridos y utilidades de pantalla. No importa el módulo
 * de bloques ni las pantallas de forma estática (BUILD_SPEC §8.2): la App vive en @/raiz.
 */
export type * from '@firmas/app';

export { useRuta, navegar, atras, useParametro } from './navegacion';
export { EnlaceRuta } from './EnlaceRuta';
export { useClaseAncho, usePanelDisponible, usePlataforma, useCapacidades } from './entornoUi';
export { useTema } from './tema';
export { useAtajos } from './atajos';
export { usePrimeraVez } from './primeraVez';
export { useRecorrido, iniciarRecorridos } from './recorridos';
export { Pantalla } from './Pantalla';
export { LimiteError } from './LimiteError';
