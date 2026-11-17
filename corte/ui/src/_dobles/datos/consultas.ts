/* __DOBLE_CORTE__ · doble de @/datos: consultas tipadas sobre los fixtures (caché por clave + params,
   invalidación, registro de meta_imagenes en dominio.registroImagenes) y hooks de sesión, sync y eventos. */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type * as C from '@/contrato';
import type { EstadoConexionPc } from '@/plataforma';
import type {
  ClaveConsulta, EstadoConsulta, EstadoSync, FuenteDatos, ListaEstable, OpcionesConsulta, ParamsDe, RespuestaDe,
} from '@firmas/datos';
import { deCopia, hoyLocal, registroImagenes } from '@/dominio';
import { escenarioActivo, simulaAndroid } from '../comun/entorno';
import { ErrorHub, comoErrorHub } from './errores';
import { cuadroActual, fijarCuadro, leerRuta, rutaDeConsulta, secuenciaDe } from './fixtures';
import { superponerMemoria } from './memoria';

interface Resultado {
  datos: unknown;
  fuente: FuenteDatos;
  copia_at: C.EpochS | null;
}

function registrarMeta(datos: unknown): void {
  if (datos !== null && typeof datos === 'object' && 'meta_imagenes' in datos) {
    const meta = datos.meta_imagenes;
    if (meta !== null && typeof meta === 'object') registroImagenes.registrar(meta as C.MetaImagenes);
  }
}

function esSnapshot(v: unknown): v is C.SnapshotResponse {
  return v !== null && typeof v === 'object' && 'version_esquema' in v && 'muestras' in v;
}

async function leerCopia(): Promise<C.SnapshotResponse | null> {
  try {
    const v = await leerRuta({ ruta: '/api/snapshot', query: [] }, 'android');
    return esSnapshot(v) ? v : null;
  } catch {
    return null;
  }
}

/** Carga una consulta: con ?simular=android intenta dominio.deCopia sobre snapshot.json; si no, el fixture. */
export async function cargarConsulta(clave: ClaveConsulta, params: object): Promise<Resultado> {
  if (escenarioActivo() === 'android') {
    const copia = await leerCopia();
    if (copia) {
      registrarMeta(copia);
      const armada = deCopia(clave, params as ParamsDe<typeof clave>, copia, hoyLocal());
      if (armada !== null) {
        registrarMeta(armada);
        return { datos: armada, fuente: 'copia', copia_at: copia.generado_at };
      }
    }
  }
  const datos = superponerMemoria(clave, await leerRuta(rutaDeConsulta(clave, params)));
  registrarMeta(datos);
  return { datos, fuente: 'demo', copia_at: null };
}

// ---------------------------------------------------------------------------------------------- almacén de consultas

interface EstadoInterno {
  datos: unknown;
  error: ErrorHub | null;
  fuente: FuenteDatos;
  copia_at: C.EpochS | null;
  pidiendo: boolean;
  vieja: boolean;
  version: number;
}

const INICIAL: EstadoInterno = { datos: undefined, error: null, fuente: 'demo', copia_at: null, pidiendo: false, vieja: false, version: 0 };
const almacen = new Map<string, EstadoInterno>();
const oyentes = new Map<string, Set<() => void>>();
const enCurso = new Map<string, Promise<void>>();

function ordenarParams(params: object): Array<[string, unknown]> {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

export function claveCache(clave: ClaveConsulta, params: object): string {
  return `${clave}:${JSON.stringify(ordenarParams(params))}`;
}

function emitir(k: string): void {
  for (const fn of [...(oyentes.get(k) ?? [])]) fn();
}

function fijar(k: string, cambios: Partial<EstadoInterno>): void {
  const previo = almacen.get(k) ?? INICIAL;
  almacen.set(k, { ...previo, ...cambios, version: previo.version + 1 });
  emitir(k);
}

function ejecutar(k: string, clave: ClaveConsulta, params: object): Promise<void> {
  const actual = enCurso.get(k);
  if (actual) return actual;
  fijar(k, { pidiendo: true, vieja: false });
  const p = cargarConsulta(clave, params)
    .then((r) => fijar(k, { datos: r.datos, fuente: r.fuente, copia_at: r.copia_at, error: null, pidiendo: false }))
    .catch((e: unknown) => fijar(k, { error: comoErrorHub(e), pidiendo: false }))
    .finally(() => enCurso.delete(k));
  enCurso.set(k, p);
  return p;
}

/** Lee una ruta GET de los fixtures. Se vuelve a pedir con invalidar(). */
export function useConsulta<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, opciones?: OpcionesConsulta): EstadoConsulta<RespuestaDe<K>> {
  const activa = opciones?.activa ?? true;
  const k = claveCache(clave, params);
  const ultimos = useRef({ clave, params });
  ultimos.current = { clave, params };
  const suscribir = useCallback(
    (fn: () => void) => {
      const set = oyentes.get(k) ?? new Set<() => void>();
      set.add(fn);
      oyentes.set(k, set);
      return () => {
        set.delete(fn);
      };
    },
    [k],
  );
  const leer = useCallback(() => almacen.get(k) ?? INICIAL, [k]);
  const st = useSyncExternalStore(suscribir, leer, leer);
  const necesita = activa && !st.pidiendo && (st.vieja || (st.datos === undefined && st.error === null));
  useEffect(() => {
    if (necesita) void ejecutar(k, ultimos.current.clave, ultimos.current.params);
  }, [k, necesita]);
  const refrescar = useCallback(() => ejecutar(k, ultimos.current.clave, ultimos.current.params), [k]);
  return useMemo(
    () => ({
      datos: st.datos as RespuestaDe<K> | undefined,
      cargando: activa && st.datos === undefined && st.error === null,
      refrescando: st.pidiendo && st.datos !== undefined,
      error: st.error,
      fuente: st.fuente,
      copia_at: st.copia_at,
      con_cambios_pendientes: false,
      refrescar,
    }),
    [st, activa, refrescar],
  );
}

/** Igual que useConsulta pero fuera de React. */
export async function consultar<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<RespuestaDe<K>> {
  const k = claveCache(clave, params);
  await ejecutar(k, clave, params);
  const st = almacen.get(k) ?? INICIAL;
  if (st.error) throw st.error;
  return st.datos as RespuestaDe<K>;
}

/** Marca como viejas las consultas indicadas (todas si no se pasa ninguna). */
export function invalidar(...claves: ClaveConsulta[]): void {
  for (const k of [...almacen.keys()]) {
    if (claves.length > 0 && !claves.some((c) => k.startsWith(`${c}:`))) continue;
    if ((oyentes.get(k)?.size ?? 0) > 0) fijar(k, { vieja: true });
    else almacen.delete(k);
  }
}

/** Solo pruebas: vacía la caché. */
export function vaciarConsultas(): void {
  almacen.clear();
  enCurso.clear();
}

// ---------------------------------------------------------------------------------------------- sesión, sync y eventos

export function useSesion(): EstadoConsulta<C.SessionResponse> {
  return useConsulta('sesion', {});
}

type Manejador = (e: C.EventoHub) => void;
const manejadores = new Set<Manejador>();

export function emitirEvento(e: C.EventoHub): void {
  for (const m of [...manejadores]) m(e);
}

/** En el doble no hay SSE: solo llegan los eventos que el propio doble emite (secuencia de `sincronizando`). */
export function useEventoHub(manejador: Manejador): void {
  const ref = useRef(manejador);
  ref.current = manejador;
  useEffect(() => {
    const m: Manejador = (e) => ref.current(e);
    manejadores.add(m);
    return () => {
      manejadores.delete(m);
    };
  }, []);
}

function esSyncEstado(v: unknown): v is C.SyncEstado {
  return v !== null && typeof v === 'object' && 'en_curso' in v && 'pasos' in v;
}

/**
 * Con ?simular=sincronizando avanza un cuadro de la «secuencia» del escenario cada intervalo_ms (1.5 s): lee
 * /api/sync/estado del cuadro, emite sync.progreso / sync.fin y, si cambió la fase (punto de control), datos.cambiaron
 * e invalida las consultas para que la vista vea lo que ya llegó.
 */
function useSecuenciaSync(): C.SyncEstado | null {
  const [estado, setEstado] = useState<C.SyncEstado | null>(null);
  const activo = escenarioActivo() === 'sincronizando';
  useEffect(() => {
    if (!activo) return undefined;
    let vivo = true;
    let t: ReturnType<typeof setTimeout> | null = null;
    void (async () => {
      const secuencia = await secuenciaDe('sincronizando');
      if (!secuencia || secuencia.cuadros.length === 0 || !vivo) return;
      const paso = async (): Promise<void> => {
        const i = cuadroActual('sincronizando');
        const v = await leerRuta({ ruta: secuencia.disparador, query: [] }, 'sincronizando').catch(() => null);
        if (!vivo) return;
        if (esSyncEstado(v)) {
          setEstado(v);
          emitirEvento({ tipo: v.en_curso ? 'sync.progreso' : 'sync.fin', estado: v });
        }
        const siguiente = Math.min(i + 1, secuencia.cuadros.length - 1);
        if (siguiente !== i) {
          fijarCuadro('sincronizando', siguiente);
          if (secuencia.cuadros[siguiente]?.fase !== secuencia.cuadros[i]?.fase) {
            invalidar();
            emitirEvento({ tipo: 'datos.cambiaron', data_version: siguiente, local_rev: 0, secciones: ['muestras', 'tiendas', 'productos', 'ordenes', 'videos'] });
          }
          t = setTimeout(() => void paso(), secuencia.intervalo_ms);
        }
      };
      await paso();
    })();
    return () => {
      vivo = false;
      if (t) clearTimeout(t);
    };
  }, [activo]);
  return estado;
}

export function useSync(): EstadoSync {
  const sesion = useSesion();
  const secuencia = useSecuenciaSync();
  return {
    estado: secuencia ?? sesion.datos?.sync ?? null,
    puede: sesion.datos?.capacidades.sincronizar ?? true,
    async sincronizar(_tipo?: C.TipoSync): Promise<void> {
      /* En el doble no hay hub: la sincronización es inmediata. */
    },
    async cancelar(): Promise<void> {
      /* Nada en curso en el doble. */
    },
  };
}

const CONEXION_DEMO: EstadoConexionPc = {
  emparejado: true,
  host_id: '3f2a0000000000000000000000000000',
  nombre_equipo: 'PC 3F2A',
  conectado: true,
  ip: '192.168.1.20',
  ultima_copia_at: null,
  cambios_pendientes: 0,
  permisos: 'lectura_escritura',
  revocado: false,
  incompatible: null,
  sync_en_curso: false,
};

/** null en Windows y en el navegador; con ?simular=android, una PC emparejada de demostración. */
export function useConexionPc(): EstadoConexionPc | null {
  return simulaAndroid() ? CONEXION_DEMO : null;
}

// ---------------------------------------------------------------------------------------------- imágenes

export function useMetaImagen(url: C.UrlImagen | null | undefined): C.ImagenMeta | undefined {
  useSyncExternalStore(registroImagenes.suscribir, registroImagenes.version, registroImagenes.version);
  return registroImagenes.leer(url);
}

export function registrarMetaImagenes(meta: C.MetaImagenes | undefined): void {
  registroImagenes.registrar(meta);
}

// ---------------------------------------------------------------------------------------------- listas estables y novedades

/** Conserva el orden visible; si llega uno distinto, avisa con hayOrdenNuevo. */
export function useListaEstable<T>(items: T[] | undefined, id: (t: T) => string): ListaEstable<T> {
  const [orden, setOrden] = useState<string[] | null>(null);
  const ids = useMemo(() => (items ?? []).map(id), [items, id]);
  useEffect(() => {
    if (orden === null && items !== undefined) setOrden(ids);
  }, [orden, items, ids]);
  const visibles = useMemo(() => {
    if (!items) return [];
    if (orden === null) return items;
    const porId = new Map(items.map((t) => [id(t), t] as const));
    const conocidos = orden.flatMap((i) => {
      const t = porId.get(i);
      return t === undefined ? [] : [t];
    });
    const nuevos = items.filter((t) => !orden.includes(id(t)));
    return [...conocidos, ...nuevos];
  }, [items, orden, id]);
  const hayOrdenNuevo = orden !== null && visibles.map(id).join('\u0000') !== ids.join('\u0000');
  return { items: visibles, hayOrdenNuevo, aplicarOrdenNuevo: () => setOrden(ids) };
}

/** En el doble nada es "nuevo desde tu última visita". */
export function useNovedades<T>(_seccion: string, _items: T[] | undefined, _id: (t: T) => string, _huella: (t: T) => string): {
  esNuevo(t: T): boolean;
  marcarVistos(): void;
} {
  return { esNuevo: () => false, marcarVistos: () => undefined };
}
