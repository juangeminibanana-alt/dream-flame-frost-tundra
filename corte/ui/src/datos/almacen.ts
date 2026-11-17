/**
 * @/datos · caché de consultas por clave + params (forma canónica de rutas.ts), sin React. Cada entrada es inmutable
 * (se reemplaza en cada cambio: sirve de snapshot para useSyncExternalStore). Una respuesta vieja nunca pisa a una
 * más nueva (contador de generación por entrada). Invalidar marca `vieja` las entradas con suscriptores (se vuelven a
 * pedir solas) y borra las demás.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, FuenteDatos, ParamsDe } from '@firmas/datos';
import { dom, registrarMetaDe } from './dominio';
import { type ErrorHub, comoErrorHub } from './errores';
import { claveCache } from './rutas';
import { obtenerTransporte } from './transporte';

export interface Entrada {
  readonly clave: ClaveConsulta;
  readonly params: object;
  readonly datos: unknown;
  readonly error: ErrorHub | null;
  readonly fuente: FuenteDatos;
  readonly copia_at: C.EpochS | null;
  readonly pendientes: boolean;
  readonly pidiendo: boolean;
  readonly vieja: boolean;
}

const entradas = new Map<string, Entrada>();
const oyentes = new Map<string, Set<() => void>>();
const enCurso = new Map<string, Promise<void>>();
const generaciones = new Map<string, number>();

function emitir(k: string): void {
  for (const fn of [...(oyentes.get(k) ?? [])]) fn();
}

function nueva(clave: ClaveConsulta, params: object): Entrada {
  return { clave, params, datos: undefined, error: null, fuente: 'hub', copia_at: null, pendientes: false, pidiendo: false, vieja: false };
}

function fijar(k: string, clave: ClaveConsulta, params: object, cambios: Partial<Entrada>): void {
  const previa = entradas.get(k) ?? nueva(clave, params);
  entradas.set(k, { ...previa, ...cambios });
  emitir(k);
}

export function leerEntrada(k: string): Entrada | undefined {
  return entradas.get(k);
}

export function suscribirEntrada(k: string, fn: () => void): () => void {
  let set = oyentes.get(k);
  if (!set) {
    set = new Set();
    oyentes.set(k, set);
  }
  set.add(fn);
  return () => {
    const s = oyentes.get(k);
    s?.delete(fn);
    if (s && s.size === 0) oyentes.delete(k);
  };
}

function tieneOyentes(k: string): boolean {
  return (oyentes.get(k)?.size ?? 0) > 0;
}

function siguienteGeneracion(k: string): number {
  const g = (generaciones.get(k) ?? 0) + 1;
  generaciones.set(k, g);
  return g;
}

/** Pide (o reutiliza el pedido en curso de) una consulta. Nunca rechaza: el error queda en la entrada. */
export function ejecutar<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<void> {
  const k = claveCache(clave, params);
  const actual = enCurso.get(k);
  if (actual) return actual;
  const gen = siguienteGeneracion(k);
  fijar(k, clave, params, { pidiendo: true, vieja: false });
  const pedir = async (): Promise<void> => {
    try {
      const t = await obtenerTransporte();
      const l = await t.leer(clave, params);
      registrarMetaDe(l.datos);
      if (generaciones.get(k) !== gen) return;
      fijar(k, clave, params, { datos: l.datos, error: null, fuente: l.fuente, copia_at: l.copia_at, pendientes: l.con_cambios_pendientes, pidiendo: false });
    } catch (e) {
      if (generaciones.get(k) !== gen) return;
      fijar(k, clave, params, { error: comoErrorHub(e), pidiendo: false });
    }
  };
  const promesa: Promise<void> = pedir().finally(() => {
    if (enCurso.get(k) === promesa) enCurso.delete(k);
  });
  enCurso.set(k, promesa);
  return promesa;
}

/** Marca viejas las entradas de esas claves (todas si la lista está vacía). */
export function invalidarClaves(claves: readonly ClaveConsulta[]): void {
  const filtro = claves.length > 0 ? new Set(claves) : null;
  for (const [k, e] of [...entradas]) {
    if (filtro && !filtro.has(e.clave)) continue;
    if (tieneOyentes(k)) {
      if (!e.vieja) fijar(k, e.clave, e.params, { vieja: true });
    } else {
      // Sin nadie mirando: se olvida (y una respuesta en vuelo ya no la vuelve a crear).
      siguienteGeneracion(k);
      enCurso.delete(k);
      entradas.delete(k);
    }
  }
}

/** Entradas con datos de una clave (para la superposición optimista y para buscar objetos del estado local). */
export function entradasDe(clave: ClaveConsulta): Array<[string, Entrada]> {
  return [...entradas].filter(([, e]) => e.clave === clave && e.datos !== undefined);
}

/**
 * Reemplaza los datos de una entrada sin pedirlos (optimismo). Descarta la respuesta en vuelo (si la hay) y deja la
 * entrada marcada para volver a pedirse cuando se invalide. Devuelve la entrada previa para revertir.
 */
export function parchearEntrada(k: string, datos: unknown): Entrada | null {
  const previa = entradas.get(k);
  if (!previa) return null;
  if (previa.pidiendo) {
    siguienteGeneracion(k);
    enCurso.delete(k);
  }
  entradas.set(k, { ...previa, datos, pendientes: true, pidiendo: false, vieja: previa.vieja || previa.pidiendo });
  emitir(k);
  return previa;
}

/**
 * rev. 5 · Escribe datos FRESCOS que llegaron completos por otro camino (evento 'display.cambio', respuesta de una
 * acción del hub): descarta la lectura en vuelo y deja la entrada al día, sin volver a pedirla.
 */
export function escribirEntrada<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, datos: unknown): void {
  const k = claveCache(clave, params);
  siguienteGeneracion(k);
  enCurso.delete(k);
  fijar(k, clave, params, { datos, error: null, fuente: 'hub', copia_at: null, pendientes: false, pidiendo: false, vieja: false });
}

/** Revierte un parche si nadie volvió a escribir esa entrada desde entonces. */
export function revertirEntrada(k: string, previa: Entrada, parchados: unknown): void {
  const actual = entradas.get(k);
  if (!actual || actual.datos !== parchados) return;
  entradas.set(k, { ...actual, datos: previa.datos, pendientes: previa.pendientes });
  emitir(k);
}

/** Solo pruebas: vacía la caché. */
export function vaciarAlmacen(): void {
  for (const k of entradas.keys()) siguienteGeneracion(k);
  entradas.clear();
  enCurso.clear();
}

/** Para pruebas y diagnóstico: cuántas entradas hay. */
export function tamanoAlmacen(): number {
  return entradas.size;
}

/** Reloj de la capa de datos (inyectable vía dominio). */
export function ahora(): C.EpochS {
  return dom.ahoraS();
}
