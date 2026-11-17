/**
 * @/datos · ErrorHub (firma de spec/ui_firmas/datos.d.ts rev. 3.1) y el mapeo de códigos a textos listos para mostrar
 * (español de México, vocabulario de 01 §1.5). Si el hub manda `error.mensaje`, ese manda; la tabla es el respaldo.
 * 409 → `vigente` (C26) desde `ErrorRespuesta.error.vigente`.
 */
import type * as C from '@/contrato';
import type { CodigoErrorUi } from '@firmas/datos';

type Detalle = Record<string, string | number | boolean | null>;

export class ErrorHub extends Error {
  readonly codigo: CodigoErrorUi;
  /** 0 si no hubo respuesta HTTP. */
  readonly http: number;
  readonly mensaje: string;
  readonly detalle: Detalle | undefined;
  readonly reintentar_en_s: number | undefined;
  /** Solo con codigo 'conflicto': la versión vigente del hub. */
  readonly vigente: C.ObjetoLocal | undefined;

  constructor(codigo: CodigoErrorUi, mensaje: string, http: number = 0, detalle?: Detalle, reintentar_en_s?: number, vigente?: C.ObjetoLocal) {
    super(mensaje);
    this.name = 'ErrorHub';
    this.codigo = codigo;
    this.mensaje = mensaje;
    this.http = http;
    this.detalle = detalle;
    this.reintentar_en_s = reintentar_en_s;
    this.vigente = vigente;
  }
}

/** Texto del conflicto de edición (BUILD_SPEC C26). */
export const TEXTO_CONFLICTO = 'Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.';
/** Android sin la PC y la vista no se arma con la copia (02 §11, BUILD_SPEC §8.3). */
export const TEXTO_NECESITA_PC = 'Necesita tu PC encendida';
/** Android: la PC no responde (01 §5.3 B). */
export const TEXTO_RED_ANDROID = 'No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.';

/** Respaldo por código cuando la respuesta no trae `mensaje`. */
export const MENSAJES: Readonly<Record<CodigoErrorUi, string>> = {
  no_encontrado: 'No encontramos lo que buscas. Puede que ya no exista.',
  parametros_invalidos: 'Algo no cuadró con lo que pediste. Revisa los datos e inténtalo de nuevo.',
  cuerpo_demasiado_grande: 'Es demasiado grande para guardarlo de una vez.',
  sesion_invalida: 'Tu sesión en Corte se cerró. Cierra y vuelve a abrir Corte.',
  prohibido: 'No tienes permiso para hacer este cambio.',
  solo_local: 'Esto solo se puede hacer desde Corte en tu PC.',
  conflicto: TEXTO_CONFLICTO,
  demasiadas_solicitudes: 'Vamos muy rápido. Espera un momento e inténtalo de nuevo.',
  sin_credenciales: 'Falta conectar Corte con TikTok.',
  reautorizar: 'Tu conexión con TikTok se venció. Reautoriza para seguir actualizando tus datos.',
  sin_permiso_tiktok: 'Falta un permiso de TikTok. Vuelve a autorizar y deja activados todos los permisos.',
  tiktok_no_disponible: 'TikTok Shop tuvo un problema temporal. Reintentaremos automáticamente.',
  sin_internet: 'Sin conexión a internet. Revísala e inténtalo de nuevo.',
  state_invalido: 'Ese enlace de autorización ya no sirve. Genera uno nuevo.',
  codigo_vencido: 'La autorización tardó demasiado y venció. Vuelve a autorizar.',
  cuenta_distinta: 'Autorizaste otra cuenta de TikTok distinta de la que ya estaba conectada.',
  no_es_creador: 'La cuenta que autorizaste no es de creador de TikTok Shop. Cierra sesión en TikTok Shop y vuelve a intentarlo con tu cuenta de creador.',
  archivo_no_encontrado: 'No encontramos ese archivo. Revisa que siga en su lugar.',
  archivo_invalido: 'Ese archivo no es válido para Corte.',
  app_secret_invalido: 'La clave de la app no es válida. Revísala en Partner Center.',
  firma_invalida: 'No pudimos verificar la conexión con tu PC. Inténtalo de nuevo.',
  reloj_desfasado: 'La hora de tu celular no coincide con la de tu PC. Revisa la fecha y hora del celular.',
  repetida: 'No pudimos verificar la conexión con tu PC. Inténtalo de nuevo.',
  dispositivo_revocado: 'Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.',
  dispositivo_desconocido: 'Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.',
  emparejamiento_vencido: 'El código para emparejar venció. Genera uno nuevo.',
  emparejamiento_rechazado: 'Se rechazó el emparejamiento.',
  emparejamiento_ocupado: 'Ya hay otro emparejamiento en curso. Termínalo o espera unos minutos.',
  base_de_version_nueva: 'Tus datos son de una versión más nueva de Corte. Actualiza Corte en esta PC.',
  error_interno: 'Algo salió mal en Corte. Inténtalo de nuevo.',
  necesita_pc: TEXTO_NECESITA_PC,
  solo_en_pc: 'Esto solo se puede hacer desde Corte en tu PC.',
  red: 'No pudimos conectar con Corte. Inténtalo de nuevo.',
};

const CODIGOS_HUB: ReadonlySet<string> = new Set<C.CodigoError>([
  'no_encontrado', 'parametros_invalidos', 'cuerpo_demasiado_grande', 'sesion_invalida', 'prohibido', 'solo_local',
  'conflicto', 'demasiadas_solicitudes', 'sin_credenciales', 'reautorizar', 'sin_permiso_tiktok', 'tiktok_no_disponible',
  'sin_internet', 'state_invalido', 'codigo_vencido', 'cuenta_distinta', 'no_es_creador', 'archivo_no_encontrado',
  'archivo_invalido', 'app_secret_invalido', 'firma_invalida', 'reloj_desfasado', 'repetida', 'dispositivo_revocado',
  'dispositivo_desconocido', 'emparejamiento_vencido', 'emparejamiento_rechazado', 'emparejamiento_ocupado',
  'base_de_version_nueva', 'error_interno',
]);

export function esCodigoHub(v: unknown): v is C.CodigoError {
  return typeof v === 'string' && CODIGOS_HUB.has(v);
}

/** Código por estado HTTP cuando el cuerpo no es un ErrorRespuesta (proxy, HTML, vacío). */
export function codigoPorHttp(http: number): CodigoErrorUi {
  if (http === 401) return 'sesion_invalida';
  if (http === 403) return 'prohibido';
  if (http === 404) return 'no_encontrado';
  if (http === 409) return 'conflicto';
  if (http === 413) return 'cuerpo_demasiado_grande';
  if (http === 400 || http === 422) return 'parametros_invalidos';
  if (http === 429) return 'demasiadas_solicitudes';
  return 'error_interno';
}

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function leerDetalle(v: unknown): Detalle | undefined {
  if (!esObjeto(v)) return undefined;
  const salida: Detalle = {};
  for (const [k, x] of Object.entries(v)) {
    if (x === null || typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean') salida[k] = x;
  }
  return salida;
}

/** ¿Parece un objeto del estado local (PlanVideo, Nota, …, PreferenciasSincronizadas)? */
export function esObjetoLocal(v: unknown): v is C.ObjetoLocal {
  return esObjeto(v) && typeof v['rev'] === 'number';
}

/**
 * ErrorHub desde el estado HTTP y el cuerpo ya leído (texto JSON o valor). Acepta ErrorRespuesta completo; si no lo es,
 * usa el código por estado. `reintentarCabecera` = Retry-After en segundos, si vino.
 */
export function errorDesdeCuerpo(http: number, cuerpo: unknown, reintentarCabecera?: number): ErrorHub {
  let valor: unknown = cuerpo;
  if (typeof cuerpo === 'string') {
    try {
      valor = cuerpo === '' ? null : JSON.parse(cuerpo);
    } catch {
      valor = null;
    }
  }
  const e = esObjeto(valor) && esObjeto(valor['error']) ? valor['error'] : null;
  const codigo = e ? e['codigo'] : undefined;
  if (e && esCodigoHub(codigo)) {
    const textoHub = e['mensaje'];
    const mensaje = typeof textoHub === 'string' && textoHub.trim() !== '' ? textoHub : MENSAJES[codigo];
    const r = e['reintentar_en_s'];
    const reintentar = typeof r === 'number' ? r : reintentarCabecera;
    const v = e['vigente'];
    const vigente = codigo === 'conflicto' && esObjetoLocal(v) ? v : undefined;
    return new ErrorHub(codigo, mensaje, http, leerDetalle(e['detalle']), reintentar, vigente);
  }
  const porHttp = codigoPorHttp(http);
  return new ErrorHub(porHttp, MENSAJES[porHttp], http, undefined, reintentarCabecera);
}

/** ErrorHub desde una Response de fetch que no fue 2xx/304. */
export async function errorDesdeRespuesta(resp: Response): Promise<ErrorHub> {
  let cuerpo = '';
  try {
    cuerpo = await resp.text();
  } catch {
    cuerpo = '';
  }
  const ra = Number(resp.headers.get('Retry-After'));
  return errorDesdeCuerpo(resp.status, cuerpo, Number.isFinite(ra) && ra > 0 ? ra : undefined);
}

export function errorDeRed(mensaje: string = MENSAJES.red): ErrorHub {
  return new ErrorHub('red', mensaje, 0);
}

export function necesitaPc(): ErrorHub {
  return new ErrorHub('necesita_pc', TEXTO_NECESITA_PC, 0);
}

export function soloEnPc(): ErrorHub {
  return new ErrorHub('solo_en_pc', MENSAJES.solo_en_pc, 0);
}

/** Cualquier error → ErrorHub (los inesperados como error_interno, sin texto técnico). */
export function comoErrorHub(e: unknown): ErrorHub {
  if (e instanceof ErrorHub) return e;
  return new ErrorHub('error_interno', MENSAJES.error_interno, 0);
}
