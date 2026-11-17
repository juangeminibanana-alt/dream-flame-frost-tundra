/**
 * @/datos · lo que la capa de datos necesita del puente de Android y que no es parte de la firma pública de
 * @/plataforma (ops, opsPendientes, peticion y sus CustomEvent). Los dos módulos son del mismo paquete (ui-datos):
 * se reutiliza el acceso tipado de ui/src/plataforma/puentes.ts en vez de duplicarlo.
 */
export { puenteAndroid as puenteAndroidDatos, escucharAndroid, nuevoIdPedido } from '../plataforma/puentes';
