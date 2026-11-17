/**
 * @/datos · SOLO DESARROLLO (`npm run dev:demo`). Display API (contrato rev. 5, 15/11) con datos SINTÉTICOS para el modo
 * demo: los fixtures de ui/fixtures son anteriores a la rev. 5 y no traen vistas. Imita al hub demo
 * (hub/creatorhub/tiktok_dev/demo.py y analitica/display.py):
 * - cuenta `creador_demo` conectada con los 4 permisos y 120 videos públicos: los del fixture con venta menos 3 que «ya
 *   no son públicos» (sus campos van en null y su portada sigue siendo la foto del producto), más 30 sin venta (solo
 *   cuentan para el perfil: la lista de videos sale de tus ventas);
 * - cada video se publicó 1–3 días antes de su primera venta y sus vistas crecen con sus pedidos y con los días que lleva
 *   publicado: (pedidos × factor + extra) × (0.35 + 0.65 × (1 − e^(−días/20))); likes = vistas × tasa, comentarios = 3 %
 *   de los likes y compartidos = 5 %;
 * - conversión con las cifras de TODA la vida del video (pedidos válidos ÷ vistas × 1,000, 2 decimales; comisión ÷ vistas
 *   × 1,000, entero), aunque la lista venga filtrada por periodo; en VideoDeProducto, la parte de ESE producto;
 * - tendencia: una foto por día desde que se conectó (hace 120 días) o desde que se publicó, escalonada (un día solo
 *   aparece si alguna cifra cambió) y con algunos días sin foto (Corte cerrado), máx. 400;
 * - portadas '/img/v/<content_id>?v=…' que el middleware de demo de vite.config.ts dibuja.
 * Determinista: cada video usa su propio generador (semilla = su content_id). Nunca hay secretos ni tokens.
 * Este módulo solo lo importa transporte_demo.ts (que solo se carga con DEV && VITE_DEMO): nunca llega a dist.
 */
import type * as C from '@/contrato';
import { epochDeFecha, fechaLocalDe, sumarDias } from '@/dominio';

const DIA = 86_400;
const SEGUIDORES_BASE = 48_200;
const VIDEOS_PUBLICOS = 120;
const VIDEOS_SIN_VENTA = 30;
/** Días desde que la cuenta demo se conectó a la Display API (primera foto de la tendencia). */
const DIAS_CONECTADA = 120;
/** Lugares (por comisión de toda la vida, desde 0) de los videos con venta que ya no son públicos. */
const LUGARES_PRIVADOS: readonly number[] = [5, 17, 40];
const MAX_TENDENCIA = 400;
export const USUARIO_DEMO = 'creador_demo';
export const SCOPES_DEMO: readonly C.ScopeDisplay[] = ['user.info.basic', 'user.info.profile', 'user.info.stats', 'video.list'];

// ---------------------------------------------------------------------------------------------- azar con semilla

function huella(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function generador(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const hex8 = (texto: string): string => huella(texto).toString(16).padStart(8, '0');

// ---------------------------------------------------------------------------------------------- base de cada video

interface BaseVideo {
  id: string;
  creado_at: C.EpochS;
  pedidos: number;
  factor: number;
  extra: number;
  tasa_like: number;
  duracion: number;
}

/** Lo que dice la lista de TODA la vida de un video (para la conversión y la curva de vistas). */
interface VidaVideo {
  pedidos: number;
  pedidos_validos: number;
  comision: C.Centavos;
  primera_venta: C.FechaLocal;
}

export interface Cifras {
  vistas: number;
  likes: number;
  comentarios: number;
  compartidos: number;
}

export interface DemoDisplay {
  readonly ahora: C.EpochS;
  readonly vida: ReadonlyMap<string, VidaVideo>;
  readonly privados: ReadonlySet<string>;
  readonly base: ReadonlyMap<string, BaseVideo>;
  /** Los 30 públicos sin venta (solo para el perfil). */
  readonly sinVenta: readonly BaseVideo[];
}

function baseDe(id: string, inicio: C.EpochS, pedidos: number, conVenta: boolean): BaseVideo {
  const r = generador(huella(`display:${id}`));
  const antes = DIA + Math.floor(r() * 2 * DIA);
  return {
    id,
    creado_at: inicio - antes,
    pedidos,
    factor: conVenta ? 150 + r() * 750 : 0,
    extra: 800 + Math.floor(r() * 5200),
    tasa_like: 0.03 + r() * 0.06,
    duracion: 12 + Math.floor(r() * 80),
  };
}

/** Arma la demo a partir de la lista de videos de TODA la vida (el fixture de «Todo»). */
export function crearDemoDisplay(todos: readonly C.FilaVideo[], ahora: C.EpochS): DemoDisplay {
  const vida = new Map<string, VidaVideo>();
  const base = new Map<string, BaseVideo>();
  for (const v of todos) {
    vida.set(v.content_id, { pedidos: v.pedidos, pedidos_validos: v.pedidos_validos, comision: v.comision_estimada_centavos, primera_venta: v.primera_venta });
    base.set(v.content_id, baseDe(v.content_id, epochDeFecha(v.primera_venta, 12), v.pedidos, true));
  }
  const porComision = [...todos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos || a.content_id.localeCompare(b.content_id));
  const privados = new Set<string>();
  for (const i of LUGARES_PRIVADOS) {
    const v = porComision[i];
    if (v) privados.add(v.content_id);
  }
  const r = generador(20261115);
  const sinVenta: BaseVideo[] = [];
  for (let i = 0; i < VIDEOS_SIN_VENTA; i++) {
    const id = `7${String(Math.floor(r() * 1e9)).padStart(9, '0')}${String(Math.floor(r() * 1e9)).padStart(9, '0')}`;
    sinVenta.push(baseDe(id, ahora - (2 + Math.floor(r() * 298)) * DIA, 0, false));
  }
  return { ahora, vida, privados, base, sinVenta };
}

export function cifrasEn(b: BaseVideo, t: C.EpochS): Cifras {
  const dias = Math.max(0, (t - b.creado_at) / DIA);
  const madurez = 1 - Math.exp(-dias / 20);
  const vistas = t < b.creado_at ? 0 : Math.floor((b.pedidos * b.factor + b.extra) * (0.35 + 0.65 * madurez));
  const likes = Math.floor(vistas * b.tasa_like);
  return { vistas, likes, comentarios: Math.floor(likes * 0.03), compartidos: Math.floor(likes * 0.05) };
}

function porMil(valor: number, vistas: number, decimales: number | null): number | null {
  if (vistas <= 0) return null;
  const x = (valor * 1000) / vistas;
  if (decimales === null) return Math.round(x);
  const f = 10 ** decimales;
  return Math.round(x * f) / f;
}

export function urlPortada(id: string): C.UrlImagen {
  return `/img/v/${id}?v=${hex8(`portada:${id}`)}`;
}

/** Color de fondo de la portada (lo usa <Foto> como pozo mientras carga). */
function colorPortada(id: string): string {
  const tonos = ['#2d2a26', '#3a3330', '#25303a', '#2f3a2c', '#3a2c35', '#33302a'];
  return tonos[huella(id) % tonos.length] ?? '#2d2a26';
}

/** Campos opcionales de FilaVideo (null si el video no está en la Display API: privado o desconocido). */
export function camposFilaVideo(d: DemoDisplay, cid: string): Partial<C.FilaVideo> {
  const b = d.base.get(cid);
  const vida = d.vida.get(cid);
  if (!b || !vida || d.privados.has(cid)) {
    return {
      vistas: null, likes: null, comentarios: null, compartidos: null, portada: null, descripcion: null, duracion_s: null,
      publicado_at: null, metricas_at: null, pedidos_por_mil_vistas: null, comision_por_mil_vistas_centavos: null,
    };
  }
  const c = cifrasEn(b, d.ahora);
  return {
    ...c,
    portada: urlPortada(cid),
    descripcion: null,
    duracion_s: b.duracion,
    publicado_at: b.creado_at,
    // La última sync de la demo: hoy a las 9:00 (o hace 2 h si aún no son las 9).
    metricas_at: Math.min(d.ahora - 2 * 3600, epochDeFecha(fechaLocalDe(d.ahora), 9)),
    pedidos_por_mil_vistas: porMil(vida.pedidos_validos, c.vistas, 2),
    comision_por_mil_vistas_centavos: porMil(vida.comision, c.vistas, null),
  };
}

function metaPortadas(d: DemoDisplay, ids: Iterable<string>, previo: C.MetaImagenes | undefined): C.MetaImagenes {
  const meta: C.MetaImagenes = { ...(previo ?? {}) };
  for (const id of ids) {
    if (!d.base.has(id) || d.privados.has(id)) continue;
    meta[urlPortada(id)] = { w: 720, h: 1280, lqip: null, color: colorPortada(id) };
  }
  return meta;
}

const conCampos = (d: DemoDisplay, v: C.FilaVideo): C.FilaVideo => ({ ...v, ...camposFilaVideo(d, v.content_id) });

export function conDisplayVideos(d: DemoDisplay, r: C.VideosResponse): C.VideosResponse {
  return { ...r, items: r.items.map((v) => conCampos(d, v)), meta_imagenes: metaPortadas(d, r.items.map((v) => v.content_id), r.meta_imagenes) };
}

/** Fotos diarias escalonadas del video (de la más vieja a la más nueva, máx. 400); [] si no está en la Display API. */
export function tendenciaDe(d: DemoDisplay, cid: string): C.PuntoTendenciaVideo[] {
  const b = d.base.get(cid);
  if (!b || d.privados.has(cid)) return [];
  const hoy = fechaLocalDe(d.ahora);
  const conectada = sumarDias(hoy, -DIAS_CONECTADA);
  const publicado = fechaLocalDe(b.creado_at);
  const salida: C.PuntoTendenciaVideo[] = [];
  let previo: Cifras | null = null;
  for (let f = publicado > conectada ? publicado : conectada; f <= hoy; f = sumarDias(f, 1)) {
    // Algún día sin foto (Corte no se abrió): lo que creció se ve al día siguiente. Hoy siempre hay foto.
    if (f !== hoy && previo !== null && huella(`${cid}:${f}`) % 9 === 0) continue;
    const c = cifrasEn(b, Math.min(d.ahora, epochDeFecha(f, 23, 59)));
    if (previo && c.vistas === previo.vistas && c.likes === previo.likes && c.comentarios === previo.comentarios && c.compartidos === previo.compartidos) continue;
    salida.push({ fecha: f, ...c });
    previo = c;
  }
  return salida.slice(-MAX_TENDENCIA);
}

export function conDisplayVideo(d: DemoDisplay, r: C.VideoDetalleResponse): C.VideoDetalleResponse {
  const cid = r.video.content_id;
  return { ...r, video: conCampos(d, r.video), tendencia: tendenciaDe(d, cid), meta_imagenes: metaPortadas(d, [cid], r.meta_imagenes) };
}

export function conDisplayProducto(d: DemoDisplay, r: C.ProductoDetalleResponse): C.ProductoDetalleResponse {
  return { ...r, videos: r.videos.map((v) => conCampos(d, v)), meta_imagenes: metaPortadas(d, r.videos.map((v) => v.content_id), r.meta_imagenes) };
}

/** VideoDeProducto: la conversión usa la parte de ESE producto (pedidos ≈ los del video en proporción a su comisión). */
function videoDeProductoCon(d: DemoDisplay, v: C.VideoDeProducto): C.VideoDeProducto {
  const b = d.base.get(v.content_id);
  const vida = d.vida.get(v.content_id);
  if (!b || !vida || d.privados.has(v.content_id)) {
    return { ...v, vistas: null, likes: null, comentarios: null, compartidos: null, portada: null, pedidos_por_mil_vistas: null, comision_por_mil_vistas_centavos: null };
  }
  const c = cifrasEn(b, d.ahora);
  const parte = vida.comision > 0 ? Math.min(1, v.comision_estimada_centavos / vida.comision) : 0;
  return {
    ...v, ...c, portada: urlPortada(v.content_id),
    pedidos_por_mil_vistas: porMil(Math.round(vida.pedidos_validos * parte), c.vistas, 2),
    comision_por_mil_vistas_centavos: porMil(v.comision_estimada_centavos, c.vistas, null),
  };
}

export function conDisplayMuestra(d: DemoDisplay, r: C.MuestraDetalleResponse): C.MuestraDetalleResponse {
  const videos = r.videos_del_producto.map((v) => videoDeProductoCon(d, v));
  return { ...r, videos_del_producto: videos, meta_imagenes: metaPortadas(d, r.videos_del_producto.map((v) => v.content_id), r.meta_imagenes) };
}

/** Seguidores y likes del perfil en el instante `t` (los likes de los 120 públicos × 1.3, como el hub demo). */
function perfilEn(d: DemoDisplay, t: C.EpochS): { seguidores: number; likes: number } {
  const dias = Math.round((epochDeFecha(fechaLocalDe(t)) - epochDeFecha('2026-01-01')) / DIA);
  let likes = 0;
  for (const [id, b] of d.base) if (!d.privados.has(id)) likes += cifrasEn(b, t).likes;
  for (const b of d.sinVenta) likes += cifrasEn(b, t).likes;
  return { seguidores: SEGUIDORES_BASE + 60 * Math.max(0, dias), likes: Math.floor(likes * 1.3) };
}

export function resumenPerfil(d: DemoDisplay): C.ResumenPerfilTikTok {
  const hoy = perfilEn(d, d.ahora);
  const antes = perfilEn(d, d.ahora - 7 * DIA);
  return {
    username: USUARIO_DEMO,
    nombre: 'Creador Demo',
    seguidores: hoy.seguidores,
    siguiendo: 312,
    likes_total: hoy.likes,
    videos_total: VIDEOS_PUBLICOS,
    seguidores_cambio_7d: hoy.seguidores - antes.seguidores,
    likes_cambio_7d: hoy.likes - antes.likes,
    actualizado_at: Math.min(d.ahora - 2 * 3600, epochDeFecha(fechaLocalDe(d.ahora), 9)),
  };
}

export function conDisplayDashboard(d: DemoDisplay, r: C.DashboardResponse): C.DashboardResponse {
  return {
    ...r,
    top_videos: r.top_videos.map((v) => conCampos(d, v)),
    meta_imagenes: metaPortadas(d, r.top_videos.map((v) => v.content_id), r.meta_imagenes),
    perfil_tiktok: resumenPerfil(d),
  };
}

/**
 * La copia del celular (SnapshotResponse) como la arma el hub demo con la Display API conectada (analitica/servicio.py
 * con vista.py): sale de las mismas lecturas, así que trae los campos opcionales en `videos` (top 100), en
 * `dashboard['30d'|'todo']` (top_videos y perfil_tiktok) y en `extras.muestras.*.videos_del_producto`, y las portadas
 * en `meta_imagenes` e `imagenes` (variante sm, como el hub). La tendencia NO: el detalle del video sin la PC se arma
 * sin serie (deCopia). El fixture snapshot.json es anterior a la rev. 5; con esto ?simular=android coincide con el hub.
 */
export function conDisplayCopia(d: DemoDisplay, copia: C.SnapshotResponse): C.SnapshotResponse {
  const ids = new Set<string>(copia.videos.map((v) => v.content_id));
  for (const t of [copia.dashboard['30d'], copia.dashboard.todo]) for (const v of t.top_videos) ids.add(v.content_id);
  let extras = copia.extras;
  if (extras) {
    const muestras: C.ExtrasSinConexion['muestras'] = {};
    for (const [aid, ex] of Object.entries(extras.muestras)) {
      for (const v of ex.videos_del_producto) ids.add(v.content_id);
      muestras[aid] = { ...ex, videos_del_producto: ex.videos_del_producto.map((v) => videoDeProductoCon(d, v)) };
    }
    extras = { ...extras, muestras };
  }
  const meta = metaPortadas(d, ids, copia.meta_imagenes);
  const imagenes = [...copia.imagenes];
  for (const u of Object.keys(meta)) if (u.startsWith('/img/v/') && !imagenes.includes(`${u}&t=sm`)) imagenes.push(`${u}&t=sm`);
  // Los tableros de la copia no llevan su propio meta_imagenes (va una sola vez, arriba): solo top_videos y perfil.
  const tablero = (t: C.DashboardResponse): C.DashboardResponse => ({ ...t, top_videos: t.top_videos.map((v) => conCampos(d, v)), perfil_tiktok: resumenPerfil(d) });
  return {
    ...copia,
    videos: copia.videos.map((v) => conCampos(d, v)),
    dashboard: { '30d': tablero(copia.dashboard['30d']), todo: tablero(copia.dashboard.todo) },
    ...(extras ? { extras } : {}),
    meta_imagenes: meta,
    imagenes,
  };
}

// ---------------------------------------------------------------------------------------------- estado de la conexión

/**
 * `?display=` (SOLO dev:demo, para capturas y para probar el flujo): sin_credenciales · sin_conectar · esperando ·
 * reautorizar · permiso · error. Sin el parámetro: conectada, como el hub demo.
 */
export type SimulacionDisplay = 'conectada' | 'sin_credenciales' | 'sin_conectar' | 'esperando' | 'reautorizar' | 'permiso' | 'error';
export const SIMULACIONES: readonly SimulacionDisplay[] = ['conectada', 'sin_credenciales', 'sin_conectar', 'esperando', 'reautorizar', 'permiso', 'error'];

export function estadoDisplayDemo(d: DemoDisplay, sim: SimulacionDisplay): C.EstadoDisplay {
  const p = resumenPerfil(d);
  const ahora = d.ahora;
  const ultimaSync = p.actualizado_at;
  const usuario: C.UsuarioDisplay = {
    username: USUARIO_DEMO, nombre: 'Creador Demo', verificada: false, enlace_perfil: `https://www.tiktok.com/@${USUARIO_DEMO}`,
    seguidores: p.seguidores, siguiendo: p.siguiendo, likes_total: p.likes_total, videos_total: p.videos_total, actualizado_at: ultimaSync,
  };
  const conectada: C.EstadoDisplay = {
    configurada: true, conectada: true, estado: 'conectada', usuario, scopes: [...SCOPES_DEMO], scopes_faltantes: [],
    access_expira_at: ahora + 5400, refresh_expira_at: ahora + 150 * DIA, conectada_at: ahora - DIAS_CONECTADA * DIA,
    ultima_sync: { at: ultimaSync, estado: 'ok', videos: VIDEOS_PUBLICOS, nuevos: 0, cambiados: 64, quitados: 0, completa: true, error: null },
    ultimo_error: null, conexion_pendiente: null,
  };
  const sinConexion: C.EstadoDisplay = {
    ...conectada, conectada: false, estado: 'sin_conectar', usuario: null, scopes: [], scopes_faltantes: [], access_expira_at: null,
    refresh_expira_at: null, conectada_at: null, ultima_sync: null,
  };
  switch (sim) {
    case 'conectada':
      return conectada;
    case 'sin_credenciales':
      return { ...sinConexion, configurada: false, estado: 'sin_credenciales' };
    case 'sin_conectar':
      return sinConexion;
    case 'esperando':
      return { ...sinConexion, conexion_pendiente: { expira_at: ahora + 9 * 60 + 41 } };
    case 'reautorizar':
      return {
        ...conectada, estado: 'reautorizar', access_expira_at: ahora - 3 * DIA, refresh_expira_at: ahora - DIA,
        ultimo_error: { codigo: 'reautorizar', mensaje: 'TikTok pide que vuelvas a autorizar a Corte para seguir trayendo las vistas de tus videos.', at: ahora - DIA },
      };
    case 'permiso':
      return {
        ...conectada, scopes: SCOPES_DEMO.filter((s) => s !== 'video.list'), scopes_faltantes: ['video.list'],
        ultima_sync: { at: ultimaSync, estado: 'sin_permiso', videos: 0, nuevos: 0, cambiados: 0, quitados: 0, completa: false, error: { codigo: 'permiso_faltante', mensaje: 'Falta el permiso para ver la lista de tus videos.' } },
      };
    case 'error':
      return {
        ...sinConexion,
        ultimo_error: { codigo: 'credenciales_rechazadas', mensaje: 'TikTok rechazó el Client key o el Client secret. Revísalos en TikTok for Developers.', at: ahora - 600 },
      };
  }
}
