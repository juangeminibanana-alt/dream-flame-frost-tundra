/**
 * @/datos · cada clave de Consultas = UNA ruta GET de BUILD_SPEC §5. Query ordenada por nombre; listas con sus
 * valores ordenados y unidos con ',' (CSV que espera el hub, 03 §6.2); booleanos '1'/'0'; el id/key de detalle va
 * en la ruta con encodeURIComponent. La misma forma canónica es la clave de la caché (orden de params irrelevante).
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, ParamsDe } from '@firmas/datos';

interface DefRuta {
  ruta: string;
  /** Parámetro que va en la ruta (detalle). */
  enRuta?: 'id' | 'key';
}

export const RUTAS_CONSULTA: Readonly<Record<ClaveConsulta, DefRuta>> = {
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
  // rev. 5 · Display API: solo la ventana de Windows (por la LAN responde 404; Android ni la pide).
  display: { ruta: '/api/display/estado' },
};

export const TODAS_LAS_CLAVES: readonly ClaveConsulta[] = Object.keys(RUTAS_CONSULTA).filter(
  (k): k is ClaveConsulta => k in RUTAS_CONSULTA,
);

export interface RutaConsulta {
  /** Con el segmento de detalle codificado ('/api/tiendas/value%20chic%20clothes'). */
  ruta: string;
  /** Pares de la query ordenados por clave. */
  query: Array<[string, string]>;
}

function valorQuery(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.length ? v.map(String).sort().join(',') : null;
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'string') return v === '' ? null : v;
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : null;
  return null;
}

export function rutaDeConsulta<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): RutaConsulta {
  const def = RUTAS_CONSULTA[clave];
  let ruta = def.ruta;
  const query: Array<[string, string]> = [];
  for (const [k, v] of Object.entries(params)) {
    const texto = valorQuery(v);
    if (texto === null) continue;
    if (def.enRuta === k) ruta = `${def.ruta}/${encodeURIComponent(texto)}`;
    else query.push([k, texto]);
  }
  query.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { ruta, query };
}

/** URL relativa lista para fetch ('/api/muestras?grupo=pausada,vencida&orden=prioridad'). */
export function urlDe(r: RutaConsulta): string {
  if (r.query.length === 0) return r.ruta;
  return `${r.ruta}?${r.query.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%2C/gi, ',')}`).join('&')}`;
}

/** Clave de la caché: clave + URL canónica. */
export function claveCache<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): string {
  return `${clave}|${urlDe(rutaDeConsulta(clave, params))}`;
}

/** Claves que dependen del estado local (plan, avisos, notas…): se superponen con las ops pendientes. */
export const CLAVES_LOCALES: readonly ClaveConsulta[] = ['plan', 'avisos', 'notas', 'recordatorios', 'plantillas', 'preferencias'];

/** Claves que traen imágenes versionadas (C45): se vuelven a pedir cuando sube img_rev. */
export const CLAVES_CON_IMAGENES: readonly ClaveConsulta[] = [
  'sesion', 'dashboard', 'muestras', 'muestra', 'tiendas', 'tienda', 'videos', 'video', 'productos', 'producto', 'ordenes',
];

const POR_SECCION: Readonly<Record<C.Seccion, readonly ClaveConsulta[]>> = {
  muestras: ['muestras', 'muestra', 'dashboard', 'tiendas', 'tienda', 'producto', 'sync_cobertura'],
  ordenes: ['ordenes', 'dashboard', 'serie', 'tiendas', 'tienda', 'videos', 'video', 'productos', 'producto', 'muestras', 'muestra', 'sync_cobertura'],
  productos: ['productos', 'producto', 'muestras', 'muestra', 'tiendas', 'tienda', 'videos', 'video', 'dashboard', 'ordenes', 'sync_cobertura'],
  tiendas: ['tiendas', 'tienda', 'muestras', 'muestra', 'dashboard'],
  videos: ['videos', 'video', 'producto', 'dashboard', 'sync_cobertura'],
  cuenta: ['sesion', 'credenciales', 'lan'],
  local: ['plan', 'avisos', 'notas', 'recordatorios', 'plantillas', 'preferencias', 'muestras', 'muestra', 'tiendas', 'tienda', 'dashboard', 'producto'],
};

/** Claves a invalidar por las secciones de `datos.cambiaron` (siempre incluye 'sesion': cambia data_version/local_rev). */
export function clavesDeSecciones(secciones: readonly C.Seccion[]): ClaveConsulta[] {
  const salida = new Set<ClaveConsulta>(['sesion']);
  for (const s of secciones) for (const k of POR_SECCION[s] ?? []) salida.add(k);
  return [...salida];
}

/** Claves que tocan las ops de cada tipo (invalidación inmediata tras una acción propia). */
export function clavesDeOp(tipo: C.OpLocal['tipo']): ClaveConsulta[] {
  if (tipo.startsWith('plan.')) return ['plan', 'muestras', 'muestra', 'tiendas', 'tienda', 'producto', 'dashboard'];
  if (tipo.startsWith('aviso.')) return ['avisos', 'muestras', 'muestra', 'tiendas', 'tienda', 'dashboard'];
  if (tipo.startsWith('nota.')) return ['notas', 'muestra', 'tienda', 'producto'];
  if (tipo.startsWith('recordatorio.')) return ['recordatorios', 'muestra'];
  if (tipo.startsWith('plantilla.')) return ['plantillas'];
  return ['preferencias', 'dashboard', 'muestras'];
}
