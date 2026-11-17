/**
 * @/datos · funciones de @/dominio que usa la capa de datos, en un objeto inyectable (BUILD_SPEC §8.2: datos → dominio).
 * Mientras ui-dominio no exista, @/dominio resuelve a su doble (deCopia → null, aplicarLocal/aplicarOpsACopia → identidad);
 * las pruebas de ui-datos inyectan sus propias versiones con fijarDominio() para no depender de ninguno de los dos.
 */
import type * as C from '@/contrato';
import { ahoraS, aplicarLocal, aplicarOpsACopia, deCopia, hoyLocal, nuevoId, registroImagenes } from '@/dominio';

export interface DependenciasDominio {
  ahoraS: () => C.EpochS;
  hoyLocal: () => C.FechaLocal;
  nuevoId: () => string;
  deCopia: typeof deCopia;
  aplicarOpsACopia: typeof aplicarOpsACopia;
  aplicarLocal: typeof aplicarLocal;
  registroImagenes: Pick<typeof registroImagenes, 'registrar' | 'leer' | 'suscribir' | 'version'>;
}

function reales(): DependenciasDominio {
  return {
    ahoraS: () => ahoraS(),
    hoyLocal: () => hoyLocal(),
    nuevoId: () => nuevoId(),
    deCopia,
    aplicarOpsACopia,
    aplicarLocal,
    registroImagenes,
  };
}

export const dom: DependenciasDominio = reales();

/** Solo pruebas: reemplaza algunas funciones de dominio. */
export function fijarDominio(parcial: Partial<DependenciasDominio>): void {
  Object.assign(dom, parcial);
}

/** Solo pruebas: vuelve a las de @/dominio. */
export function restaurarDominio(): void {
  Object.assign(dom, reales());
}

/** Registra el meta_imagenes de cualquier respuesta (C47: el almacén vive en dominio.registroImagenes). */
export function registrarMetaDe(datos: unknown): void {
  if (datos === null || typeof datos !== 'object' || !('meta_imagenes' in datos)) return;
  const meta: unknown = datos.meta_imagenes;
  if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) return;
  dom.registroImagenes.registrar(meta as C.MetaImagenes);
}
