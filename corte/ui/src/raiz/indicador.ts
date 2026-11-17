/**
 * @/raiz · qué dice el indicador de sincronización (01 §3.5 y §4.16): «Actualizado hace {t}» · «Sincronizando… {paso}» ·
 * «Sin conexión a internet» · «Conexión con TikTok vencida». En Android, si la PC está sincronizando: «Tu PC está
 * sincronizando con TikTok ({paso})…» (C27, EstadoConexionPc.sync_en_curso). Puro.
 */
import type { Conexion, EpochS, SyncEstado } from '@/contrato';
import type { EstadoConexionPc } from '@/plataforma';
import { ETIQUETA_PASO_SYNC, formato } from '@/dominio';
import { T } from './textos';

export interface VistaIndicador {
  estado: 'ok' | 'sincronizando' | 'error' | 'inactivo';
  texto: string;
  /** Paso en curso o explicación corta (segunda línea). */
  detalle: string | null;
}

/** Texto del paso actual: el del hub ('Tus ventas recientes: semana 5 de 26…') o la etiqueta del paso. */
export function textoPaso(sync: SyncEstado | null): string | null {
  if (!sync) return null;
  const texto = sync.texto.trim().replace(/…$/, '').trim();
  if (texto) return texto;
  return sync.paso_actual ? ETIQUETA_PASO_SYNC[sync.paso_actual] : null;
}

/** 'hace 4 min', 'hoy', 'ayer' o 'el 12 nov'. */
export function cuandoRelativo(t: EpochS, ahora: EpochS): string {
  const r = formato.relativa(t, ahora);
  return /^(hace|hoy|ayer|en )/.test(r) ? r : `el ${r}`;
}

export function vistaIndicador(e: {
  android: boolean;
  sync: SyncEstado | null;
  conexion: Pick<Conexion, 'estado'> | null;
  conexionPc: EstadoConexionPc | null;
  ultimaOk: EpochS | null;
  ahora: EpochS;
}): VistaIndicador {
  const paso = textoPaso(e.sync);
  if (e.android && e.conexionPc?.sync_en_curso) {
    return { estado: 'sincronizando', texto: paso ? T.pcSincronizando(paso.charAt(0).toLowerCase() + paso.slice(1)) : T.pcSincronizandoSinPaso, detalle: null };
  }
  if (!e.android && e.sync?.en_curso) return { estado: 'sincronizando', texto: T.sincronizando, detalle: paso };
  if (e.conexion?.estado === 'reautorizar') return { estado: 'error', texto: T.conexionVencida, detalle: null };
  if (!e.android && e.sync?.ultimo_error?.codigo === 'sin_internet') return { estado: 'inactivo', texto: T.sinInternet, detalle: null };
  if (e.ultimaOk !== null) {
    const base = T.actualizadoHace(cuandoRelativo(e.ultimaOk, e.ahora));
    return { estado: 'ok', texto: e.android ? `${base} · ${T.desdeTuPc}` : base, detalle: null };
  }
  return { estado: 'inactivo', texto: T.sinSincronizar, detalle: null };
}
