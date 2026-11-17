/**
 * @/datos (paquete ui-datos) · implementación de spec/ui_firmas/datos.d.ts rev. 3.1 (BUILD_SPEC §8.3). Única puerta de
 * las pantallas a los datos: consultas tipadas (copia sin conexión en Android), acciones sobre el estado local
 * (optimistas, con Deshacer y cola en Android) y acciones del hub.
 */
export type * from '@firmas/datos';

export { ErrorHub } from './errores';
export {
  useConsulta, consultar, invalidar, useSesion, useSync, useConexionPc, useMetaImagen, registrarMetaImagenes,
} from './consultas';
export { useEventoHub } from './eventos';
export { useListaEstable, useNovedades } from './listas';
export { useAcciones } from './acciones';
export { hub } from './hub';
