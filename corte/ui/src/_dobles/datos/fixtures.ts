/* __DOBLE_CORTE__ · doble de @/datos: lectura de ui/fixtures/datos (fixtures-ui, solo desarrollo) con
   import.meta.glob según indice.json {"version":1,"rutas":{"/api/dashboard?periodo=30d":"dashboard_30d.json"}}.
   Ruta + query ordenada → archivo; sin coincidencia exacta se busca solo por ruta (BUILD_SPEC §8.1.2).
   Con ?simular=<e>, escenarios/<e>/ (y su indice.json) sobreescribe archivos. Tolera que la carpeta aún no exista. */
import type { ClaveConsulta } from '@firmas/datos';
import { escenarioActivo, type Escenario } from '../comun/entorno';
import { sinFixture } from './errores';

const RAIZ = '../../../fixtures/datos/';
const cargadores = import.meta.glob<unknown>('../../../fixtures/datos/**/*.json', { import: 'default' });

const archivos = new Map<string, () => Promise<unknown>>();
for (const [ruta, cargar] of Object.entries(cargadores)) {
  if (ruta.startsWith(RAIZ)) archivos.set(ruta.slice(RAIZ.length), cargar);
}

/** Archivos de fixtures disponibles (rutas relativas a ui/fixtures/datos). */
export function archivosFixtures(): readonly string[] {
  return [...archivos.keys()].sort();
}

export function hayFixtures(): boolean {
  return archivos.has('indice.json');
}

const cacheJson = new Map<string, Promise<unknown>>();

export function leerArchivo(relativo: string): Promise<unknown> | null {
  const cargar = archivos.get(relativo);
  if (!cargar) return null;
  let p = cacheJson.get(relativo);
  if (!p) {
    p = cargar().then((v) => structuredClone(v));
    cacheJson.set(relativo, p);
  }
  return p.then((v) => structuredClone(v));
}

async function indiceDe(dir: string): Promise<Record<string, string>> {
  const leido = leerArchivo(`${dir}indice.json`);
  if (!leido) return {};
  const datos = await leido;
  if (datos === null || typeof datos !== 'object') return {};
  const fuente = 'rutas' in datos && datos.rutas !== null && typeof datos.rutas === 'object' ? datos.rutas : datos;
  const salida: Record<string, string> = {};
  for (const [k, v] of Object.entries(fuente)) if (typeof v === 'string') salida[k] = v;
  return salida;
}

// ---------------------------------------------------------------------------------------------- consulta → ruta

interface DefRutaConsulta {
  ruta: string;
  /** Parámetro que va en la ruta (detalle). */
  enRuta?: 'id' | 'key';
}

export const RUTAS_CONSULTA: Readonly<Record<ClaveConsulta, DefRutaConsulta>> = {
  sesion: { ruta: '/api/session' },
  dashboard: { ruta: '/api/dashboard' },
  muestras: { ruta: '/api/muestras' },
  muestra: { ruta: '/api/muestras', enRuta: 'id' },
  tiendas: { ruta: '/api/tiendas' },
  tienda: { ruta: '/api/tiendas', enRuta: 'key' },
  serie: { ruta: '/api/analitica/serie' },
  videos: { ruta: '/api/analitica/videos' },
  video: { ruta: '/api/videos', enRuta: 'id' },
  productos: { ruta: '/api/analitica/productos' },
  producto: { ruta: '/api/productos', enRuta: 'id' },
  ordenes: { ruta: '/api/ordenes' },
  plan: { ruta: '/api/plan' },
  avisos: { ruta: '/api/avisos' },
  plantillas: { ruta: '/api/plantillas' },
  preferencias: { ruta: '/api/preferencias' },
  notas: { ruta: '/api/notas' },
  recordatorios: { ruta: '/api/recordatorios' },
  sync_historial: { ruta: '/api/sync/historial' },
  sync_cobertura: { ruta: '/api/sync/cobertura' },
  credenciales: { ruta: '/api/credenciales/estado' },
  lan: { ruta: '/api/lan/estado' },
  firewall: { ruta: '/api/lan/firewall' },
  ajustes_pc: { ruta: '/api/ajustes/pc' },
  uso_datos: { ruta: '/api/datos/uso' },
  display: { ruta: '/api/display/estado' },
};

function valorQuery(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  // Listas: valores ordenados y unidos con ',' (mismo criterio que hub/herramientas/fixtures_ui).
  if (Array.isArray(v)) return v.length ? v.map(String).sort().join(',') : null;
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  return null;
}

export interface RutaConsulta {
  /** Ruta con el segmento de detalle codificado ('/api/tiendas/value%20chic%20clothes'). */
  ruta: string;
  /** Pares de la query ordenados por clave. */
  query: Array<[string, string]>;
}

export function rutaDeConsulta(clave: ClaveConsulta, params: object): RutaConsulta {
  const def = RUTAS_CONSULTA[clave];
  const entradas = Object.entries(params);
  let ruta = def.ruta;
  const query: Array<[string, string]> = [];
  for (const [k, v] of entradas) {
    const texto = valorQuery(v);
    if (texto === null) continue;
    if (def.enRuta === k) ruta = `${def.ruta}/${encodeURIComponent(texto)}`;
    else query.push([k, texto]);
  }
  query.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { ruta, query };
}

/** Claves candidatas del índice, de la más exacta a la más general. */
export function candidatos(r: RutaConsulta): string[] {
  const rutas = [r.ruta];
  try {
    const decodificada = decodeURI(r.ruta).replace(/%2F/gi, '/');
    if (!rutas.includes(decodificada)) rutas.push(decodificada);
    const completa = decodeURIComponent(r.ruta);
    if (!rutas.includes(completa)) rutas.push(completa);
  } catch {
    /* ruta sin codificación válida: solo la original */
  }
  const lista: string[] = [];
  const agregar = (s: string): void => {
    if (!lista.includes(s)) lista.push(s);
  };
  for (const ruta of rutas) {
    if (r.query.length > 0) {
      agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%2C/gi, ',')}`).join('&')}`);
      agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${v}`).join('&')}`);
      agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`);
      agregar(`${ruta}?${new URLSearchParams(r.query).toString()}`);
    }
  }
  for (const ruta of rutas) agregar(ruta);
  return lista;
}

// ---------------------------------------------------------------------------------------------- secuencias (sincronizando)

export interface CuadroSecuencia {
  paso?: string;
  fase?: number;
  texto?: string;
  rutas?: Record<string, string>;
}
export interface Secuencia {
  disparador: string;
  intervalo_ms: number;
  cuadros: CuadroSecuencia[];
}

const cuadroPorEscenario = new Map<string, number>();

function aSecuencia(v: unknown): Secuencia | null {
  if (v === null || typeof v !== 'object' || !('cuadros' in v) || !Array.isArray(v.cuadros)) return null;
  const disparador = 'disparador' in v && typeof v.disparador === 'string' ? v.disparador : '/api/sync/estado';
  const intervalo = 'intervalo_ms' in v && typeof v.intervalo_ms === 'number' ? v.intervalo_ms : 1500;
  const cuadros: CuadroSecuencia[] = v.cuadros.filter((c: unknown): c is CuadroSecuencia => c !== null && typeof c === 'object');
  return { disparador, intervalo_ms: intervalo, cuadros };
}

/** «secuencia» del indice.json de un escenario (p. ej. sincronizando: cuadros de W3 con los dos puntos de control). */
export async function secuenciaDe(escenario: Escenario): Promise<Secuencia | null> {
  const leido = leerArchivo(`escenarios/${escenario}/indice.json`);
  if (!leido) return null;
  const datos = await leido;
  return datos !== null && typeof datos === 'object' && 'secuencia' in datos ? aSecuencia(datos.secuencia) : null;
}

export function cuadroActual(escenario: Escenario): number {
  return cuadroPorEscenario.get(escenario) ?? 0;
}

export function fijarCuadro(escenario: Escenario, n: number): void {
  cuadroPorEscenario.set(escenario, Math.max(0, n));
}

async function buscarEnIndice(dir: string, r: RutaConsulta, cuadro?: CuadroSecuencia): Promise<string | null> {
  const indice = await indiceDe(dir);
  for (const c of candidatos(r)) {
    const archivo = cuadro?.rutas?.[c] ?? indice[c];
    if (archivo) return archivo;
  }
  return null;
}

/**
 * Lee la respuesta de una ruta GET con el escenario activo: primero el índice del escenario; si no, el archivo del
 * índice base, reemplazado por uno con el mismo nombre en la carpeta del escenario si existe.
 */
export async function leerRuta(r: RutaConsulta, escenario: Escenario | null = escenarioActivo()): Promise<unknown> {
  if (escenario) {
    const dir = `escenarios/${escenario}/`;
    const secuencia = await secuenciaDe(escenario);
    const cuadros = secuencia?.cuadros ?? [];
    const cuadro = cuadros.length ? cuadros[Math.min(cuadroActual(escenario), cuadros.length - 1)] : undefined;
    const propio = await buscarEnIndice(dir, r, cuadro);
    if (propio) {
      const leido = leerArchivo(`${dir}${propio}`) ?? leerArchivo(propio);
      if (leido) return leido;
    }
  }
  const base = await buscarEnIndice('', r);
  if (base) {
    if (escenario) {
      const reemplazo = leerArchivo(`escenarios/${escenario}/${base}`);
      if (reemplazo) return reemplazo;
    }
    const leido = leerArchivo(base);
    if (leido) return leido;
  }
  throw sinFixture(r.query.length ? `${r.ruta}?${r.query.map(([k, v]) => `${k}=${v}`).join('&')}` : r.ruta);
}

