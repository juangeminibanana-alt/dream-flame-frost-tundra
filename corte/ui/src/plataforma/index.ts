/**
 * @/plataforma (paquete ui-datos) · implementación de spec/ui_firmas/plataforma.d.ts rev. 3.1 (BUILD_SPEC §8.3).
 * Ninguna pantalla habla con window.pywebview ni con window.CreatorHubAndroid directo: todo pasa por aquí.
 */
export type * from '@firmas/plataforma';

export { infoPlataforma, esAndroid, esWindows } from './deteccion';
export {
  abrirExterno, abrirTikTok, copiarTexto, compartirTexto, guardarImagen, guardarArchivo, elegirArchivo, vibrar,
  mantenerPantalla, avisarTemaNativo, avisarInterfazLista,
} from './sistema';
export { programarNotificaciones, permisoNotificaciones, pedirPermisoNotificaciones } from './notificaciones';
export { registrarAtras, alVolverAlFrente, ventana } from './ciclo';
export {
  estadoConexionPc, alCambiarConexionPc, buscarPcs, emparejarConQr, emparejarConCodigo, olvidarPc, actualizarCopiaAhora,
  consumirEnlacePendiente, alEnlace,
} from './android';
