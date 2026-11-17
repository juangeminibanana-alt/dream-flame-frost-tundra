/**
 * @/datos · SOLO DESARROLLO (`npm run dev:demo`). Lee ui/fixtures/datos (paquete fixtures-ui, BUILD_SPEC §8.1.2) con
 * import.meta.glob según indice.json: ruta + query ordenada → archivo; sin coincidencia exacta, solo la ruta.
 * Escenarios (`?simular=<e>`, cualquier carpeta escenarios/<e>/ con indice.json): su índice manda; si una ruta no
 * está, se usa el archivo del índice base reemplazado por el del mismo nombre en la carpeta del escenario.
 * Secuencias (sincronizando): `secuencia {disparador, intervalo_ms, cuadros[{paso, fase, texto, rutas}]}`; cada lectura
 * del disparador avanza un cuadro y las rutas del cuadro mandan sobre las del escenario.
 * Este módulo solo se carga con import() desde transporte.ts bajo import.meta.env.DEV && VITE_DEMO: nunca llega a dist.
 */
import { parametroUrl } from '../../plataforma/entorno';
import { ErrorHub } from '../errores';
import type { RutaConsulta } from '../rutas';

const RAIZ = '../../../fixtures/datos/';
const cargadores = import.meta.glob<unknown>('../../../fixtures/datos/**/*.json', { import: 'default' });

const archivos = new Map<string, () => Promise<unknown>>();
for (const [ruta, cargar] of Object.entries(cargadores)) {
  if (ruta.startsWith(RAIZ)) archivos.set(ruta.slice(RAIZ.length), cargar);
}

export function hayFixtures(): boolean {
  return archivos.has('indice.json');
}

const cache = new Map<string, Promise<unknown>>();

/** Lee un JSON de ui/fixtures/datos (copia nueva en cada lectura: nadie puede mutar el original). */
export function leerArchivo(relativo: string): Promise<unknown> | null {
  const cargar = archivos.get(relativo);
  if (!cargar) return null;
  let p = cache.get(relativo);
  if (!p) {
    p = cargar();
    cache.set(relativo, p);
  }
  return p.then((v) => structuredClone(v));
}

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

async function rutasDe(dir: string): Promise<Record<string, string>> {
  const leido = leerArchivo(`${dir}indice.json`);
  if (!leido) return {};
  const v = await leido;
  const fuente = esObjeto(v) && esObjeto(v['rutas']) ? v['rutas'] : {};
  const salida: Record<string, string> = {};
  for (const [k, x] of Object.entries(fuente)) if (typeof x === 'string') salida[k] = x;
  return salida;
}

// ---------------------------------------------------------------------------------------------- escenarios

/** Escenario activo (`?simular=<e>` con su carpeta en ui/fixtures/datos/escenarios), o null. */
export function escenarioActivo(): string | null {
  const v = parametroUrl('simular');
  if (!v || !/^[a-z0-9_]{1,40}$/.test(v)) return null;
  return archivos.has(`escenarios/${v}/indice.json`) ? v : null;
}

export interface CuadroSecuencia {
  paso: string | null;
  fase: number;
  texto: string | null;
  rutas: Record<string, string>;
}
export interface Secuencia {
  disparador: string;
  intervalo_ms: number;
  cuadros: CuadroSecuencia[];
}

const secuencias = new Map<string, Promise<Secuencia | null>>();
const cuadroActual = new Map<string, number>();
const disparadorLeido = new Set<string>();

function aCuadro(v: unknown): CuadroSecuencia | null {
  if (!esObjeto(v)) return null;
  const rutas: Record<string, string> = {};
  if (esObjeto(v['rutas'])) for (const [k, x] of Object.entries(v['rutas'])) if (typeof x === 'string') rutas[k] = x;
  return {
    paso: typeof v['paso'] === 'string' ? v['paso'] : null,
    fase: typeof v['fase'] === 'number' ? v['fase'] : 0,
    texto: typeof v['texto'] === 'string' ? v['texto'] : null,
    rutas,
  };
}

export function secuenciaDe(escenario: string): Promise<Secuencia | null> {
  let p = secuencias.get(escenario);
  if (!p) {
    p = (async (): Promise<Secuencia | null> => {
      const leido = leerArchivo(`escenarios/${escenario}/indice.json`);
      if (!leido) return null;
      const v = await leido;
      const s = esObjeto(v) ? v['secuencia'] : null;
      if (!esObjeto(s) || !Array.isArray(s['cuadros'])) return null;
      const cuadros = s['cuadros'].map(aCuadro).filter((c): c is CuadroSecuencia => c !== null);
      if (cuadros.length === 0) return null;
      return {
        disparador: typeof s['disparador'] === 'string' ? s['disparador'] : '/api/sync/estado',
        intervalo_ms: typeof s['intervalo_ms'] === 'number' && s['intervalo_ms'] > 0 ? s['intervalo_ms'] : 1500,
        cuadros,
      };
    })();
    secuencias.set(escenario, p);
  }
  return p;
}

export function indiceCuadro(escenario: string): number {
  return cuadroActual.get(escenario) ?? 0;
}

/** Lectura del disparador: la primera devuelve el cuadro 1; cada una de las siguientes avanza uno (hasta el último). */
export async function avanzarSiDisparador(escenario: string, ruta: string): Promise<void> {
  const s = await secuenciaDe(escenario);
  if (!s || s.disparador !== ruta) return;
  if (!disparadorLeido.has(escenario)) {
    disparadorLeido.add(escenario);
    return;
  }
  cuadroActual.set(escenario, Math.min(indiceCuadro(escenario) + 1, s.cuadros.length - 1));
}

/** Solo pruebas: vuelve todas las secuencias al primer cuadro. */
export function reiniciarSecuencias(): void {
  cuadroActual.clear();
  disparadorLeido.clear();
}

// ---------------------------------------------------------------------------------------------- consulta → archivo

/** Claves candidatas del índice, de la más exacta a la más general (mismas normalizaciones que fixtures-ui). */
export function candidatos(r: RutaConsulta): string[] {
  const rutas = [r.ruta];
  try {
    const decodificada = decodeURIComponent(r.ruta);
    if (!rutas.includes(decodificada)) rutas.push(decodificada);
  } catch {
    /* segmento sin codificación válida */
  }
  const lista: string[] = [];
  const agregar = (s: string): void => {
    if (!lista.includes(s)) lista.push(s);
  };
  for (const ruta of rutas) {
    if (r.query.length === 0) continue;
    agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%2C/gi, ',')}`).join('&')}`);
    agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`);
    agregar(`${ruta}?${r.query.map(([k, v]) => `${k}=${v}`).join('&')}`);
    agregar(`${ruta}?${new URLSearchParams(r.query).toString()}`);
  }
  for (const ruta of rutas) agregar(ruta);
  return lista;
}

function sinDatos(r: RutaConsulta): ErrorHub {
  const ruta = r.query.length ? `${r.ruta}?${r.query.map(([k, v]) => `${k}=${v}`).join('&')}` : r.ruta;
  return new ErrorHub('no_encontrado', 'No hay datos de demostración para esta vista.', 404, { ruta });
}

/** Respuesta de una ruta GET con el escenario indicado (null = base). Rechaza con ErrorHub('no_encontrado'). */
export async function leerRuta(r: RutaConsulta, escenario: string | null): Promise<unknown> {
  const opciones = candidatos(r);
  if (escenario) {
    const dir = `escenarios/${escenario}/`;
    const s = await secuenciaDe(escenario);
    const cuadro = s ? s.cuadros[Math.min(indiceCuadro(escenario), s.cuadros.length - 1)] : undefined;
    const propias = await rutasDe(dir);
    for (const c of opciones) {
      const archivo = cuadro?.rutas[c] ?? propias[c];
      if (!archivo) continue;
      const leido = leerArchivo(`${dir}${archivo}`) ?? leerArchivo(archivo);
      if (leido) return leido;
    }
  }
  const base = await rutasDe('');
  for (const c of opciones) {
    const archivo = base[c];
    if (!archivo) continue;
    if (escenario) {
      const reemplazo = leerArchivo(`escenarios/${escenario}/${archivo}`);
      if (reemplazo) return reemplazo;
    }
    const leido = leerArchivo(archivo);
    if (leido) return leido;
  }
  throw sinDatos(r);
}
