/* Solo para las pruebas de @/dominio (vitest): carga bajo demanda los JSON de desarrollo de ui/fixtures/datos (cifras
   reales del 12 nov 2026, cuenta creador_demo) con import.meta.glob, sin leer el disco a mano. Nunca lo importa el
   código del módulo (index.ts no lo exporta), así que no llega a dist. */
import type * as C from '@/contrato';

const DATOS = import.meta.glob<unknown>('../../fixtures/datos/**/*.json', { import: 'default' });

/** Instante de los datos de desarrollo: jue 12 nov 2026, 10:20 a. m. (UTC−6), el generado_at de la copia. */
export const AHORA_FIXTURES = 1794500400;
export const HOY_FIXTURES = '2026-11-12';

/** Carga `ui/fixtures/datos/<ruta>` (p. ej. 'muestras.json', 'escenarios/con_plan/plan.json'). */
export async function cargarDatos<T>(ruta: string): Promise<T> {
  const cargar = DATOS[`../../fixtures/datos/${ruta}`];
  if (!cargar) throw new Error(`No existe ui/fixtures/datos/${ruta}`);
  return (await cargar()) as T;
}

export function hayDatos(ruta: string): boolean {
  return DATOS[`../../fixtures/datos/${ruta}`] !== undefined;
}

/** Archivo de una ruta de la API según el indice.json base (las claves llevan la query ordenada). */
export async function archivoDeRuta(ruta: string): Promise<string> {
  const indice = await cargarDatos<{ rutas: Record<string, string> }>('indice.json');
  const archivo = indice.rutas[ruta];
  if (archivo === undefined) throw new Error(`indice.json no tiene ${ruta}`);
  return archivo;
}

export async function cargarRuta<T>(ruta: string): Promise<T> {
  return cargarDatos<T>(await archivoDeRuta(ruta));
}

export interface DatosBase {
  muestras: C.MuestrasResponse;
  avisos: C.AvisosResponse;
  planes: C.PlanResponse;
  tiendas: C.TiendasResponse;
  copia: C.SnapshotResponse;
}

export async function datosBase(): Promise<DatosBase> {
  const [muestras, avisos, planes, tiendas, copia] = await Promise.all([
    cargarDatos<C.MuestrasResponse>('muestras.json'),
    cargarDatos<C.AvisosResponse>('avisos.json'),
    cargarDatos<C.PlanResponse>('plan.json'),
    cargarDatos<C.TiendasResponse>('tiendas.json'),
    cargarDatos<C.SnapshotResponse>('escenarios/android/snapshot.json'),
  ]);
  return { muestras, avisos, planes, tiendas, copia };
}

export interface DatosConPlan {
  muestras: C.MuestrasResponse;
  avisos: C.AvisosResponse;
  planes: C.PlanResponse;
  tiendas: C.TiendasResponse;
  dashboard30: C.DashboardResponse;
}

/** Escenario con_plan: 32 videos planeados 3 por día de L a S desde el jue 12 nov y avisos enviados. */
export async function datosConPlan(): Promise<DatosConPlan> {
  const [muestras, avisos, planes, tiendas, dashboard30] = await Promise.all([
    cargarDatos<C.MuestrasResponse>('escenarios/con_plan/muestras.json'),
    cargarDatos<C.AvisosResponse>('escenarios/con_plan/avisos.json'),
    cargarDatos<C.PlanResponse>('escenarios/con_plan/plan.json'),
    cargarDatos<C.TiendasResponse>('escenarios/con_plan/tiendas.json'),
    cargarDatos<C.DashboardResponse>('escenarios/con_plan/dashboard_30d.json'),
  ]);
  return { muestras, avisos, planes, tiendas, dashboard30 };
}

/** Copia profunda (para modificar muestras de los datos sin tocar los originales). */
export function clonar<T>(x: T): T {
  return structuredClone(x);
}
