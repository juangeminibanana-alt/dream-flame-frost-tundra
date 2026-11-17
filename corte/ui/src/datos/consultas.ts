/**
 * @/datos · consultas tipadas (spec/ui_firmas/datos.d.ts): useConsulta / consultar / invalidar, useSesion, useSync,
 * useConexionPc y los atajos de imágenes sobre dominio.registroImagenes (C47).
 */
import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import type * as C from '@/contrato';
import type { EstadoConexionPc } from '@firmas/plataforma';
import type { ClaveConsulta, EstadoConsulta, EstadoSync, OpcionesConsulta, ParamsDe, RespuestaDe } from '@firmas/datos';
import { alCambiarConexionPc, esAndroid, estadoConexionPc } from '@/plataforma';
import { type Entrada, ejecutar, invalidarClaves, leerEntrada, suscribirEntrada } from './almacen';
import { dom } from './dominio';
import { ErrorHub } from './errores';
import { fijarEstadoSync, iniciarMotor, useEstadoSyncEventos } from './eventos';
import { claveCache } from './rutas';
import { hub } from './hub';

const SIN_ENTRADA: Entrada | undefined = undefined;

function estaFresca(e: Entrada | undefined): boolean {
  return e !== undefined && e.datos !== undefined && e.error === null && !e.vieja && !e.pidiendo;
}

/**
 * Lee una ruta GET. Se vuelve a pedir sola con 'datos.cambiaron' (Windows: SSE) o 'creatorhub-copia' (Android).
 * Las respuestas con meta_imagenes se registran solas para <Foto>.
 */
export function useConsulta<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, opciones?: OpcionesConsulta): EstadoConsulta<RespuestaDe<K>> {
  const activa = opciones?.activa ?? true;
  const k = claveCache(clave, params);
  const ultimos = useRef({ clave, params });
  ultimos.current = { clave, params };
  const suscribir = useCallback((fn: () => void) => suscribirEntrada(k, fn), [k]);
  const leer = useCallback(() => leerEntrada(k), [k]);
  const e = useSyncExternalStore(suscribir, leer, () => SIN_ENTRADA);
  const necesita = activa && (e === undefined || (!e.pidiendo && (e.vieja || (e.datos === undefined && e.error === null))));
  useEffect(() => {
    iniciarMotor();
  }, []);
  useEffect(() => {
    if (necesita) void ejecutar(ultimos.current.clave, ultimos.current.params);
  }, [k, necesita]);
  const refrescar = useCallback(() => ejecutar(ultimos.current.clave, ultimos.current.params), [k]);
  return useMemo((): EstadoConsulta<RespuestaDe<K>> => {
    const datos = e?.datos as RespuestaDe<K> | undefined;
    const sinDatos = datos === undefined;
    return {
      datos,
      cargando: activa && sinDatos && (e?.error ?? null) === null,
      refrescando: (e?.pidiendo ?? false) && !sinDatos,
      error: e?.error ?? null,
      fuente: e?.fuente ?? 'hub',
      copia_at: e?.fuente === 'copia' ? e.copia_at : null,
      con_cambios_pendientes: e?.pendientes ?? false,
      refrescar,
    };
  }, [e, activa, refrescar]);
}

/** Igual que useConsulta pero fuera de React (búsqueda global, exportar CSV). Rechaza con ErrorHub. */
export async function consultar<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<RespuestaDe<K>> {
  iniciarMotor();
  const k = claveCache(clave, params);
  for (let intento = 0; intento < 3; intento += 1) {
    if (!estaFresca(leerEntrada(k))) await ejecutar(clave, params);
    const e = leerEntrada(k);
    if (!e || (e.datos === undefined && e.error === null)) continue; // se invalidó mientras llegaba: otra vez
    if (e.error) throw e.error;
    return e.datos as RespuestaDe<K>;
  }
  throw new ErrorHub('error_interno', 'No pudimos leer tus datos. Inténtalo de nuevo.', 0);
}

/** Marca como viejas las consultas indicadas (todas si no se pasa ninguna). */
export function invalidar(...claves: ClaveConsulta[]): void {
  invalidarClaves(claves);
}

// ---------------------------------------------------------------------------------------------- sesión y sincronización

export function useSesion(): EstadoConsulta<C.SessionResponse> {
  return useConsulta('sesion', {});
}

export function useSync(): EstadoSync {
  const sesion = useSesion();
  const deEventos = useEstadoSyncEventos();
  const conexion = useConexionPc();
  const android = esAndroid();
  const estado = deEventos ?? sesion.datos?.sync ?? null;
  const capacidad = sesion.datos?.capacidades.sincronizar ?? false;
  const puede = capacidad && (!android || (conexion !== null && conexion.conectado && !conexion.revocado));
  const sincronizar = useCallback(async (tipo?: C.TipoSync): Promise<void> => {
    const r = await hub.sincronizar(tipo);
    fijarEstadoSync(r.estado);
  }, []);
  const cancelar = useCallback(async (): Promise<void> => {
    fijarEstadoSync(await hub.cancelarSync());
  }, []);
  return useMemo(() => ({ estado, puede, sincronizar, cancelar }), [estado, puede, sincronizar, cancelar]);
}

// ---------------------------------------------------------------------------------------------- conexión con la PC (Android)

let conexion: EstadoConexionPc | null | undefined;

function leerConexion(): EstadoConexionPc | null {
  if (conexion === undefined) conexion = estadoConexionPc();
  return conexion;
}

function suscribirConexion(fn: () => void): () => void {
  leerConexion();
  return alCambiarConexionPc((e) => {
    conexion = e;
    fn();
  });
}

/** null en Windows y en el navegador. */
export function useConexionPc(): EstadoConexionPc | null {
  return useSyncExternalStore(suscribirConexion, leerConexion, leerConexion);
}

/** Solo pruebas: olvida el último estado de conexión leído. */
export function reiniciarConexion(): void {
  conexion = undefined;
}

// ---------------------------------------------------------------------------------------------- imágenes (C47)

function suscribirRegistro(fn: () => void): () => void {
  return dom.registroImagenes.suscribir(fn);
}

function versionRegistro(): number {
  return dom.registroImagenes.version();
}

/** Atajo sobre dominio.registroImagenes: se vuelve a pintar cuando llega el meta de esa URL. */
export function useMetaImagen(url: C.UrlImagen | null | undefined): C.ImagenMeta | undefined {
  useSyncExternalStore(suscribirRegistro, versionRegistro, versionRegistro);
  return dom.registroImagenes.leer(url);
}

export function registrarMetaImagenes(meta: C.MetaImagenes | undefined): void {
  dom.registroImagenes.registrar(meta);
}
