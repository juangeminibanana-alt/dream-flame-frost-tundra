/**
 * Lógica pura de la Bienvenida (sin React): pasos de W3 con las etiquetas de §6.3.2 (dominio.ETIQUETA_PASO_SYNC),
 * cuándo se activa [Continuar] (punto de control 1: muestras, estado de cada muestra y productos en 'ok'), el paso
 * inicial y la sub-vista de W2 según las credenciales.
 */
import type * as C from '@/contrato';
import { ETIQUETA_PASO_SYNC, formato } from '@/dominio';
import { T } from './textos';

export type PasoW = 'w1' | 'w2' | 'w3' | 'w4' | 'w5' | 'w6';
export type PasoA = 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6';
export const PASOS_W: readonly PasoW[] = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
export const PASOS_A: readonly PasoA[] = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'];

export function esPasoW(v: string | null): v is PasoW {
  return v !== null && (PASOS_W as readonly string[]).includes(v);
}
export function esPasoA(v: string | null): v is PasoA {
  return v !== null && (PASOS_A as readonly string[]).includes(v);
}

/** Los 9 primeros pasos de §6.3.2, en el orden de C34 (W3 los lista con sus conteos). */
export const PASOS_W3: readonly C.PasoSync[] = [
  'perfil', 'muestras', 'cumplimientos', 'productos', 'ordenes', 'vitrina', 'detalles', 'ordenes_anteriores', 'productos_ventas',
];

export type EstadoFilaW3 = 'ok' | 'en_curso' | 'pendiente' | 'error' | 'omitido';
export interface FilaW3 {
  paso: C.PasoSync;
  etiqueta: string;
  estado: EstadoFilaW3;
  /** Conteo en vivo ('80', '30 de 75', 'semana 5 de 26', '1,234 pedidos') o ''. */
  conteo: string;
}

function conteoDe(p: C.SyncPaso | undefined, paso: C.PasoSync): string {
  // Un paso que aún no empieza no lleva conteo (nada de «semana 0 de 26»): solo su etiqueta atenuada.
  if (!p || p.estado === 'pendiente') return '';
  const n = formato.numero;
  if (p.estado === 'omitido') return T.omitido;
  if (paso === 'perfil') return '';
  if (paso === 'ordenes' || paso === 'ordenes_anteriores') {
    if (p.estado === 'ok' && p.nuevos > 0) return T.pedidos(n(p.nuevos));
    if (p.total !== null && p.total > 0) return T.semana(Math.min(p.hechos + (p.estado === 'en_curso' ? 1 : 0), p.total), p.total);
    return '';
  }
  if (p.estado === 'en_curso' && p.total !== null && p.total > 0) return T.deTotal(n(p.hechos), n(p.total));
  if (p.estado === 'ok' || p.estado === 'parcial') return p.hechos > 0 ? n(p.hechos) : '';
  return p.hechos > 0 ? n(p.hechos) : '';
}

function estadoDe(p: C.SyncPaso | undefined): EstadoFilaW3 {
  if (!p) return 'pendiente';
  switch (p.estado) {
    case 'ok':
    case 'parcial':
      return 'ok';
    case 'en_curso':
      return 'en_curso';
    case 'error':
      return 'error';
    case 'omitido':
      return 'omitido';
    default:
      return 'pendiente';
  }
}

export function filasW3(estado: C.SyncEstado | null): FilaW3[] {
  const pasos = estado?.pasos ?? [];
  return PASOS_W3.map((paso) => {
    const p = pasos.find((x) => x.paso === paso);
    return { paso, etiqueta: ETIQUETA_PASO_SYNC[paso], estado: estadoDe(p), conteo: conteoDe(p, paso) };
  });
}

/** [Continuar] de W3: cuando muestras, cumplimientos y productos están 'ok' (punto de control 1 publicado, C34). */
export function continuarActivo(estado: C.SyncEstado | null): boolean {
  if (!estado) return false;
  const ok = (paso: C.PasoSync): boolean => {
    const p = estado.pasos.find((x) => x.paso === paso);
    return p !== undefined && (p.estado === 'ok' || p.estado === 'parcial');
  };
  if (ok('muestras') && ok('cumplimientos') && ok('productos')) return true;
  // Ya hubo una sincronización completa antes (p. ej. se volvió a la bienvenida): no hay nada que esperar.
  return !estado.en_curso && estado.ultima_estado === 'ok' && estado.ultima_ok_at !== null;
}

/** «No pudimos traer tus muestras»: la sincronización terminó sin traer muestras, estado o productos. */
export function fallaronMuestras(estado: C.SyncEstado | null): boolean {
  if (!estado || estado.en_curso) return false;
  const p = estado.pasos.find((x) => x.paso === 'muestras');
  const malo = (x: C.SyncPaso | undefined): boolean => x !== undefined && x.estado === 'error';
  return malo(p) || malo(estado.pasos.find((x) => x.paso === 'cumplimientos')) || malo(estado.pasos.find((x) => x.paso === 'productos'));
}

/** Paso inicial de Windows si la URL no trae ?paso. */
export function pasoInicialW(s: C.SessionResponse | undefined): PasoW {
  if (!s) return 'w1';
  if (s.conexion.estado === 'conectada' && (s.sync.en_curso || !s.datos.hay_datos)) return 'w3';
  return 'w1';
}

export type VistaW2 = 'importar' | 'importada' | 'vencida' | 'conectar';

/**
 * Sub-vista de W2 (01 §4.15): W2a (hay archivo anterior sin importar) · W2a' (importada y vigente, el archivo sigue ahí) ·
 * W2a'' (importada pero vencida) · W2b (sin configuración).
 */
export function vistaW2(cred: C.CredencialesEstado | undefined, conexion: C.Conexion | undefined, importadaAhora: boolean): VistaW2 {
  const estado = conexion?.estado;
  const importada = importadaAhora || cred?.origen === 'importado' || (cred?.legado.ya_importado_at ?? null) !== null;
  if (importada && (estado === 'reautorizar' || estado === 'sin_autorizar')) return 'vencida';
  if (importada && estado === 'conectada' && cred?.legado.disponible) return 'importada';
  if (!importada && cred?.legado.disponible && estado !== 'conectada') return 'importar';
  return 'conectar';
}

/** Documentos › PROJECTS › API de Affiliate Creator (sin el usuario de Windows ni el nombre del archivo). */
export function rutaAmigable(ruta: string): string {
  const partes = ruta.split(/[\\/]+/).filter((p) => p !== '' && !/^[a-z]:$/i.test(p));
  partes.pop();
  const i = partes.findIndex((p) => /^(documents|documentos|mis documentos)$/i.test(p));
  if (i >= 0) return ['Documentos', ...partes.slice(i + 1)].join(' › ');
  return partes.slice(-2).join(' › ') || ruta;
}
