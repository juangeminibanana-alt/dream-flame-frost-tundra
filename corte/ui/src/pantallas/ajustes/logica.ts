/**
 * Lógica pura de Conexión y ajustes (sin React): estado de la conexión con TikTok (01 §4.14 A), intervalo de
 * sincronización (C36), historial en lenguaje simple (01 §4.14 B), espacio usado, ruta amigable del archivo anterior y
 * validación del enlace de regreso (01 §5.4 A).
 */
import type * as C from '@/contrato';
import { formato, textoPermiso } from '@/dominio';
import { T } from './textos';

// ---------------------------------------------------------------------------------------------- secciones

export type IdSeccion = 'tiktok' | 'metricas' | 'sincronizacion' | 'celular' | 'recordatorios' | 'plantillas' | 'apariencia' | 'datos' | 'ayuda' | 'acerca';

export interface DefSeccion {
  id: IdSeccion;
  titulo: string;
  resumen: string;
  icono: 'Store' | 'TrendingUp' | 'RefreshCw' | 'Smartphone' | 'Monitor' | 'Bell' | 'MessageCircle' | 'Sun' | 'Lock' | 'CircleHelp' | 'Info';
}

/** Orden de 01 §3.1 (Windows) y de «Más» en Android (01 §3.3: Conexión con la PC primero, sin Sincronización). */
export function seccionesPara(android: boolean): DefSeccion[] {
  const s = T.secciones;
  // En Android la cuenta es solo lectura (C35): el resumen no promete manejar la clave de la app.
  const tiktok: DefSeccion = { id: 'tiktok', titulo: android ? s.tiktok.tituloAndroid : s.tiktok.titulo, resumen: android ? s.tiktok.resumenAndroid : s.tiktok.resumen, icono: 'Store' };
  const celular: DefSeccion = {
    id: 'celular',
    titulo: android ? s.celular.tituloAndroid : s.celular.titulo,
    resumen: android ? s.celular.resumenAndroid : s.celular.resumen,
    icono: android ? 'Monitor' : 'Smartphone',
  };
  // rev. 5 · Métricas de tus videos (Display API): justo después de TikTok Shop. En Android solo informa.
  const metricas: DefSeccion = { id: 'metricas', titulo: s.metricas.titulo, resumen: android ? s.metricas.resumenAndroid : s.metricas.resumen, icono: 'TrendingUp' };
  const resto: DefSeccion[] = [
    { id: 'recordatorios', titulo: s.recordatorios.titulo, resumen: s.recordatorios.resumen, icono: 'Bell' },
    { id: 'plantillas', titulo: s.plantillas.titulo, resumen: s.plantillas.resumen, icono: 'MessageCircle' },
    { id: 'apariencia', titulo: s.apariencia.titulo, resumen: android ? s.apariencia.resumenAndroid : s.apariencia.resumen, icono: 'Sun' },
    { id: 'datos', titulo: s.datos.titulo, resumen: s.datos.resumen, icono: 'Lock' },
    { id: 'ayuda', titulo: s.ayuda.titulo, resumen: s.ayuda.resumen, icono: 'CircleHelp' },
    { id: 'acerca', titulo: s.acerca.titulo, resumen: s.acerca.resumen, icono: 'Info' },
  ];
  if (android) return [celular, tiktok, metricas, ...resto];
  return [tiktok, metricas, { id: 'sincronizacion', titulo: s.sincronizacion.titulo, resumen: s.sincronizacion.resumen, icono: 'RefreshCw' }, celular, ...resto];
}

const IDS: ReadonlySet<string> = new Set<IdSeccion>(['tiktok', 'metricas', 'sincronizacion', 'celular', 'recordatorios', 'plantillas', 'apariencia', 'datos', 'ayuda', 'acerca']);
export function esSeccion(v: string | null | undefined): v is IdSeccion {
  return typeof v === 'string' && IDS.has(v);
}

// ---------------------------------------------------------------------------------------------- TikTok

export type EstadoTiktok = 'conectado' | 'vence_pronto' | 'vencida' | 'faltan_permisos' | 'falta_clave' | 'sin_autorizar' | 'sin_region';

const DIA_S = 86_400;

/** Días completos que le quedan a la autorización (refresh). null si no hay fecha. */
export function diasParaVencer(refreshExpiraAt: C.EpochS | null, ahora: C.EpochS): number | null {
  if (refreshExpiraAt === null) return null;
  return Math.max(0, Math.ceil((refreshExpiraAt - ahora) / DIA_S));
}

/**
 * Estado visible de 01 §4.14 A. `credenciales` es null en Android o mientras carga (entonces solo manda la conexión).
 * Prioridad: sin región > falta la clave > vencida > sin autorizar > faltan permisos > vence pronto (< 7 días) > conectado.
 */
export function estadoTiktok(conexion: C.Conexion, credenciales: C.CredencialesEstado | null, ahora: C.EpochS): EstadoTiktok {
  if (conexion.estado === 'cuenta_sin_region') return 'sin_region';
  const sinClave = credenciales ? !credenciales.app_secret_configurado : conexion.estado === 'sin_credenciales';
  if (sinClave || conexion.estado === 'sin_credenciales') return 'falta_clave';
  if (conexion.estado === 'reautorizar') return 'vencida';
  if (conexion.estado === 'sin_autorizar') return 'sin_autorizar';
  if (conexion.scopes_faltantes.length > 0) return 'faltan_permisos';
  const dias = diasParaVencer(conexion.refresh_expira_at, ahora);
  if (dias !== null && dias < 7) return 'vence_pronto';
  return 'conectado';
}

/** 'Ver tu vitrina, Crear enlaces de afiliado' (textos de 01 §4.14 A vía dominio.textoPermiso). */
export function listaPermisos(scopes: readonly string[]): string {
  return scopes.map((s) => textoPermiso(s)).join(', ');
}

/** Documentos › PROJECTS › API de Affiliate Creator (sin el usuario de Windows ni el nombre del archivo). */
export function rutaAmigable(ruta: string): string {
  const partes = ruta.split(/[\\/]+/).filter((p) => p !== '' && !/^[a-z]:$/i.test(p));
  partes.pop(); // el archivo
  const i = partes.findIndex((p) => /^(documents|documentos|mis documentos)$/i.test(p));
  if (i >= 0) return ['Documentos', ...partes.slice(i + 1)].join(' › ');
  return partes.slice(-2).join(' › ') || ruta;
}

// ---------------------------------------------------------------------------------------------- métricas de tus videos (rev. 5)

/** Lo que se ve en Ajustes › Métricas de tus videos según EstadoDisplay (contrato rev. 5). */
export type VistaMetricas = 'sin_configurar' | 'sin_conectar' | 'esperando' | 'conectada' | 'reautorizar';

/**
 * `pendienteLocal`: el intento que ESTA ventana abrió (expira_at de ConectarDisplayResponse) por si el estado del hub aún
 * no trae conexion_pendiente. Un intento vencido ya no cuenta como espera.
 */
export function vistaMetricas(e: C.EstadoDisplay, pendienteLocal: C.EpochS | null, ahora: C.EpochS): VistaMetricas {
  if (e.estado === 'conectada') return 'conectada';
  if (e.estado === 'sin_credenciales' || !e.configurada) return 'sin_configurar';
  const expira = Math.max(e.conexion_pendiente?.expira_at ?? 0, pendienteLocal ?? 0);
  if (expira > ahora) return 'esperando';
  return e.estado === 'reautorizar' ? 'reautorizar' : 'sin_conectar';
}

/** Mismas reglas de formato que el hub (tiktok_dev/servicio.py): se revisan antes de mandar nada. */
export function revisarClientKey(v: string): 'vacio' | 'formato' | null {
  const t = v.trim();
  if (t === '') return 'vacio';
  return /^[A-Za-z0-9]{8,64}$/.test(t) ? null : 'formato';
}
export function revisarClientSecret(v: string): 'vacio' | 'formato' | null {
  const t = v.trim();
  if (t === '') return 'vacio';
  return /^[A-Za-z0-9_-]{16,128}$/.test(t) ? null : 'formato';
}

/** Los 4 permisos que pide Corte, con su nombre en español. */
export const PERMISOS_DISPLAY: readonly C.ScopeDisplay[] = ['user.info.basic', 'user.info.profile', 'user.info.stats', 'video.list'];
export function nombrePermisoDisplay(scope: string): string {
  return T.metricas.permisos[scope] ?? scope;
}
/** 'la lista de tus videos y sus vistas' (en minúsculas para ir dentro de una frase). */
export function listaPermisosDisplay(scopes: readonly string[]): string {
  return scopes.map((s) => {
    const n = nombrePermisoDisplay(s);
    return n.charAt(0).toLocaleLowerCase('es-MX') + n.slice(1);
  }).join(', ');
}

/** 48,200 · 51.9 mil · 1.2 M (cifras grandes de un perfil). */
export function cifraCompacta(n: number): string {
  const abs = Math.abs(n);
  if (abs < 10_000) return formato.numero(n);
  if (abs < 1_000_000) {
    const mil = n / 1000;
    return `${abs < 100_000 ? (Math.round(mil * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 }) : formato.numero(Math.round(mil))} mil`;
  }
  return `${(Math.round((n / 1_000_000) * 10) / 10).toLocaleString('es-MX', { maximumFractionDigits: 1 })} M`;
}

// ---------------------------------------------------------------------------------------------- enlace de regreso

export type RevisionEnlace = 'vacio' | 'cancelado' | 'no_es_enlace' | 'ok';

/** Revisión local antes de mandar al hub (el hub vuelve a validar y es quien decide). */
export function revisarEnlace(texto: string): RevisionEnlace {
  const t = texto.trim();
  if (t === '') return 'vacio';
  const tieneCode = /[?&#]code=[^&\s]+/i.test(t);
  if (!tieneCode && /[?&#]error(_description)?=/i.test(t)) return 'cancelado';
  if (tieneCode) return 'ok';
  // Un `code` suelto (sin URL) también se acepta: el hub lo canjea si hay un solo intento activo.
  if (/^[A-Za-z0-9._~-]{16,}$/.test(t) && !/^https?:/i.test(t)) return 'ok';
  return 'no_es_enlace';
}

/** '9:41' a partir de segundos. */
export function cuentaRegresiva(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------------------------- sincronización

export type ValorIntervalo = '15' | '30' | '60' | 'apagado';

/** C36: 30 por omisión; apagado = sync_auto false (se conserva el intervalo elegido). */
export function intervaloDe(ajustes: Pick<C.AjustesPc, 'sync_auto' | 'sync_intervalo_min'> | undefined): ValorIntervalo {
  if (!ajustes) return '30';
  if (!ajustes.sync_auto) return 'apagado';
  return String(ajustes.sync_intervalo_min) as ValorIntervalo;
}

export function cambiosDeIntervalo(v: ValorIntervalo): C.AjustesPcCambios {
  if (v === 'apagado') return { sync_auto: false };
  return { sync_auto: true, sync_intervalo_min: Number(v) as 15 | 30 | 60 };
}

/** '2 min' · '45 s' · '1 h 5 min'. */
export function duracion(seg: number | null): string | null {
  if (seg === null || !Number.isFinite(seg) || seg < 0) return null;
  if (seg < 60) return `${Math.max(1, Math.round(seg))} s`;
  const min = Math.round(seg / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return resto === 0 ? `${h} h` : `${h} h ${resto} min`;
}

/** 'hoy, 6:04 p. m.' · 'ayer, 5:34 p. m.' · '10 nov, 8:00 a. m.'. */
export function cuandoFue(t: C.EpochS, ahora: C.EpochS): string {
  const dia = formato.fechaCorta(t);
  const etiqueta = dia === formato.fechaCorta(ahora) ? 'hoy' : dia === formato.fechaCorta(ahora - DIA_S) ? 'ayer' : dia;
  return `${etiqueta}, ${formato.hora(t)}`;
}

/** 'Hoy 6:04 p. m.' (como en 01 §4.14 B). */
export function cuandoFueTitulo(t: C.EpochS, ahora: C.EpochS): string {
  const s = cuandoFue(t, ahora).replace(', ', ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Resumen del historial en lenguaje simple: 'Listo · 3 pedidos nuevos, 1 muestra cambió de estado'. */
export function resumenHistorial(item: C.SyncHistorialItem): { estado: string; detalle: string; tono: 'ok' | 'atencion' | 'critico' | 'neutro' } {
  const H = T.sync;
  if (item.estado === 'error') return { estado: H.noSePudo(item.error?.mensaje ?? T.errorGenerico), detalle: '', tono: 'critico' };
  if (item.estado === 'cancelada') return { estado: H.cancelada, detalle: '', tono: 'neutro' };
  if (item.estado === 'en_curso') return { estado: H.enCursoHist, detalle: '', tono: 'neutro' };
  const r = item.resumen;
  const partes: string[] = [];
  const pedidos = r.ordenes?.nuevos ?? 0;
  const muestrasNuevas = r.muestras?.nuevos ?? 0;
  const cambiaron = (r.cumplimientos?.cambiados ?? 0) + (r.muestras?.cambiados ?? 0);
  if (pedidos > 0) partes.push(H.pedidosNuevos(pedidos));
  if (muestrasNuevas > 0) partes.push(H.muestrasNuevas(muestrasNuevas));
  if (cambiaron > 0) partes.push(H.muestrasCambiaron(cambiaron));
  const detalle = partes.length > 0 ? partes.join(', ') : item.cambios > 0 ? '' : H.sinCambios;
  return { estado: item.estado === 'parcial' ? H.listoAvisos : H.listo, detalle, tono: item.estado === 'parcial' ? 'atencion' : 'ok' };
}

// ---------------------------------------------------------------------------------------------- datos

/** 4.2 MB · 38 MB · 820 KB · 1.3 GB (separador decimal de es-MX: punto). */
export function tamano(bytes: number): string {
  const b = Math.max(0, bytes);
  const KB = 1024;
  const MB = KB * 1024;
  const GB = MB * 1024;
  const uno = (v: number): string => (v < 10 ? v.toFixed(1).replace(/\.0$/, '') : formato.numero(Math.round(v)));
  if (b >= GB) return `${uno(b / GB)} GB`;
  if (b >= MB) return `${uno(b / MB)} MB`;
  if (b >= KB) return `${uno(b / KB)} KB`;
  return `${formato.numero(b)} B`;
}

/** Nombre del archivo de exportación: corte-plan-avisos-notas-2026-11-13.json. */
export function nombreExportacion(hoy: C.FechaLocal): string {
  return `corte-plan-avisos-notas-${hoy}.json`;
}

/** Licencias de /licencias.json (build-empaquetado): {componentes:[{nombre, version, licencia, texto}]} o una lista. */
export interface Licencia {
  nombre: string;
  version: string;
  licencia: string;
  texto: string;
}
export function leerLicencias(v: unknown): Licencia[] | null {
  const lista = Array.isArray(v) ? v : v !== null && typeof v === 'object' && Array.isArray((v as { componentes?: unknown }).componentes) ? (v as { componentes: unknown[] }).componentes : null;
  if (!lista) return null;
  const salida: Licencia[] = [];
  for (const x of lista) {
    if (x === null || typeof x !== 'object') continue;
    const o = x as Record<string, unknown>;
    const nombre = typeof o['nombre'] === 'string' ? o['nombre'] : null;
    if (!nombre) continue;
    salida.push({
      nombre,
      version: typeof o['version'] === 'string' ? o['version'] : '',
      licencia: typeof o['licencia'] === 'string' ? o['licencia'] : '',
      texto: typeof o['texto'] === 'string' ? o['texto'] : '',
    });
  }
  return salida.length > 0 ? salida : null;
}

/** Horas que ofrece el recordatorio diario: de 6:00 a 22:00, cada hora ('HH:MM'). */
export const HORAS_RECORDATORIO: readonly string[] = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

/** '10:00' → '10:00 a. m.' (es-MX, 12 h). */
export function horaLegible(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return hhmm;
  const h = Number(m[1]);
  const sufijo = h < 12 ? 'a. m.' : 'p. m.';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m[2]} ${sufijo}`;
}

/** Alias de la PC (LanCambios): 1–40 caracteres imprimibles, sin saltos de línea. */
export function aliasValido(v: string): boolean {
  const t = v.trim();
  // eslint-disable-next-line no-control-regex
  return t.length >= 1 && t.length <= 40 && !/[\u0000-\u001f\u007f]/.test(t);
}
