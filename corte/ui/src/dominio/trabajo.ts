/* @/dominio · trabajo: pendientes, avance, promesas y avisos (01_ux §2.4–2.6, §4.17; 03 §5.7 y §5.10). Las reglas son
   las mismas del hub (spec/verificacion/analitica_ref.py y v_muestras de schema.sql) para que la superposición optimista
   (aplicarLocal) dé exactamente lo que el hub dará cuando confirme. */
import type * as C from '@/contrato';
import type { AccionEtapa, ConteosTrabajo, DatosEtapa, OperacionPlan } from '@firmas/dominio';
import { diasEntre, epochDeFecha, esFechaLocal, fechaLocalDe, instanteDe, sumarDias } from './fechas';
import { nombreCorto, nuevoId } from './texto';

export const GRUPOS_PENDIENTES: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada']);
/** 01_ux §2.4: las etapas aplican en estos grupos (en los dos últimos solo se puede planear con anticipación). */
const GRUPOS_CON_ETAPAS: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada', 'esperando_aprobacion', 'en_camino']);
const GRUPOS_ANTICIPADOS: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['esperando_aprobacion', 'en_camino']);
const SIETE_DIAS_S = 7 * 86_400;

// ============================================================================ pendiente (01_ux §2.5, v_muestras)
/** Grupo ∈ {por_vencer, vencida, pausada} y etapa ∉ {publicada, no_se_puede}. Igual que el hub: un plan "publicada"
 *  con vinculo_origen 'video_previo' SIGUE pendiente (un video anterior a la muestra no salda, 01_ux §2.4 regla 4). */
export function esPendiente(m: C.MuestraVista): boolean {
  if (!GRUPOS_PENDIENTES.has(m.grupo)) return false;
  const e = m.avance.etapa;
  if (e === 'no_se_puede') return false;
  return !(e === 'publicada' && m.avance.vinculo_origen !== 'video_previo');
}

/** Publicada que cuenta como video publicado (sin video previo no aceptado). */
export function esPublicadaValida(a: Pick<C.AvanceMuestra, 'etapa' | 'vinculo_origen'>): boolean {
  return a.etapa === 'publicada' && a.vinculo_origen !== 'video_previo';
}

// ============================================================================ avisos y promesas (03 §5.10)
/** Avisos que mencionan la solicitud (en solicitud_ids o en compromisos), en el orden recibido. */
export function avisosDe(applicationId: string, avisos: readonly C.AvisoTienda[]): C.AvisoTienda[] {
  return avisos.filter((a) => a.solicitud_ids.includes(applicationId) || Object.prototype.hasOwnProperty.call(a.compromisos, applicationId));
}

function enviado(a: C.AvisoTienda): boolean {
  return a.marcado_enviado_at !== null && a.quitado_at === null;
}

/** Promesa vigente: la fecha de `compromisos` del aviso más reciente marcado como enviado (no quitado) que incluye la
 *  muestra. null si no hay. Con empate de marcado_enviado_at gana el primero (como el `max` del hub). */
export function promesaDe(applicationId: string, avisos: readonly C.AvisoTienda[]): { fecha: C.FechaLocal; aviso_id: string } | null {
  let mejor: C.AvisoTienda | null = null;
  for (const a of avisosDe(applicationId, avisos)) {
    if (!enviado(a) || !Object.prototype.hasOwnProperty.call(a.compromisos, applicationId)) continue;
    if (mejor === null || (a.marcado_enviado_at ?? 0) > (mejor.marcado_enviado_at ?? 0)) mejor = a;
  }
  const fecha = mejor?.compromisos[applicationId];
  return mejor && fecha !== undefined ? { fecha, aviso_id: mejor.id } : null;
}

/** Hoy > promesa y etapa ≠ publicada. */
export function esPromesaVencida(promesa: C.FechaLocal | null, etapa: C.EtapaAvance, hoy: C.FechaLocal): boolean {
  return promesa !== null && hoy > promesa && etapa !== 'publicada';
}

/** La solicitud aparece en algún aviso enviado y no quitado. */
export function estaAvisada(applicationId: string, avisos: readonly C.AvisoTienda[]): boolean {
  return avisosDe(applicationId, avisos).some(enviado);
}

function resumenAvisos(applicationId: string, etapa: C.EtapaAvance, avisos: readonly C.AvisoTienda[], hoy: C.FechaLocal): C.ResumenAvisosMuestra {
  const ahora = instanteDe(hoy);
  const propios = avisosDe(applicationId, avisos);
  let copiado: C.AvisoTienda | null = null;
  let ultimo: C.EpochS | null = null;
  for (const a of propios) {
    if (a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS_S) {
      if (copiado === null || a.copiado_at > (copiado.copiado_at ?? 0)) copiado = a;
    }
    if (enviado(a) && a.marcado_enviado_at !== null && (ultimo === null || a.marcado_enviado_at > ultimo)) ultimo = a.marcado_enviado_at;
  }
  const promesa = promesaDe(applicationId, avisos)?.fecha ?? null;
  return {
    promesa,
    promesa_vencida: esPromesaVencida(promesa, etapa, hoy),
    copiado_sin_confirmar: copiado && copiado.copiado_at !== null ? { aviso_id: copiado.id, copiado_at: copiado.copiado_at } : null,
    ultimo_enviado_at: ultimo,
  };
}

/** El PlanVideo vivo de la solicitud (el hub garantiza uno; si llegan varios, el editado más recientemente). */
export function planVivo(applicationId: string, planes: readonly C.PlanVideo[]): C.PlanVideo | null {
  let mejor: C.PlanVideo | null = null;
  for (const p of planes) {
    if (p.application_id !== applicationId) continue;
    if (mejor === null || p.actualizado_at > mejor.actualizado_at || (p.actualizado_at === mejor.actualizado_at && p.rev > mejor.rev)) mejor = p;
  }
  return mejor;
}

const AVANCE_SIN_PLAN: C.AvanceMuestra = {
  plan_id: null, etapa: 'por_planear', fecha_planeada: null, programada_para_at: null, fecha_publicada: null,
  content_id: null, vinculo_origen: null, fijada: false, rev: 0,
};

function avanceDe(plan: C.PlanVideo | null): C.AvanceMuestra {
  if (plan === null) return { ...AVANCE_SIN_PLAN };
  return {
    plan_id: plan.id, etapa: plan.estado, fecha_planeada: plan.fecha_plan, programada_para_at: plan.programada_para_at,
    fecha_publicada: plan.fecha_publicada, content_id: plan.content_id, vinculo_origen: plan.vinculo_origen,
    fijada: plan.fijada, rev: plan.rev,
  };
}

/**
 * Superposición optimista: recalcula `avance` (del PlanVideo vivo de esa solicitud dentro de `planes`) y `avisos`
 * (promesa, vencida, copiado sin confirmar, último enviado) con las mismas reglas que el hub (03 §5.10), y la razón
 * 'promesa'. `planes` y `avisos` son TODOS los conocidos (los del hub o de la copia + los cambios locales pendientes):
 * una solicitud sin plan en `planes` queda en 'por_planear'. No toca grupo, clase, prioridad ni salud. No muta `m`.
 */
export function aplicarLocal(m: C.MuestraVista, planes: C.PlanVideo[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): C.MuestraVista {
  const avance = avanceDe(planVivo(m.application_id, planes));
  const resumen = resumenAvisos(m.application_id, avance.etapa, avisos, hoy);
  const sinPromesa = m.razones.filter((r) => r !== 'promesa');
  const razones: C.RazonPrioridad[] = resumen.promesa !== null ? ['promesa', ...sinPromesa] : sinPromesa;
  return { ...m, avance, avisos: resumen, razones };
}

// ============================================================================ conteos (01_ux §2.5, M9, M10, M24)
function enCohorte(m: C.MuestraVista): boolean {
  if (GRUPOS_PENDIENTES.has(m.grupo)) return true;
  // Pasó por pendientes y TikTok ya la movió (publicaste y está en revisión o confirmada): conserva su plan local.
  return (m.grupo === 'en_revision' || m.grupo === 'entregada' || m.grupo === 'exenta') && m.avance.plan_id !== null;
}

function cuentaComoPublicada(m: C.MuestraVista): boolean {
  if (m.avance.etapa === 'no_se_puede') return false;
  return esPublicadaValida(m.avance) || m.grupo === 'entregada' || m.grupo === 'exenta' || m.grupo === 'en_revision';
}

/**
 * Recalcula en la interfaz lo que cambia con el estado local, para que "Te faltan 11" baje al instante (también sin
 * conexión). Cohorte = pendientes + las que ya publicaste (sin "No se puede"): grupos de trabajo y las que TikTok ya
 * movió a revisión/entregada/exenta y tienen plan local. Promesas y avisos se recalculan con `avisos` y `hoy`.
 */
export function contarTrabajo(muestras: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): ConteosTrabajo {
  const ahora = instanteDe(hoy);
  const pendientes = muestras.filter(esPendiente);
  const cohorte = muestras.filter((m) => enCohorte(m) && m.avance.etapa !== 'no_se_puede');
  const publicadas = cohorte.filter((m) => !esPendiente(m) && cuentaComoPublicada(m));
  const porEtapa = { planeada: 0, video_listo: 0, programada: 0, publicada: 0 };
  for (const m of pendientes) {
    const e = m.avance.etapa;
    if (e === 'planeada' || e === 'video_listo' || e === 'programada') porEtapa[e] += 1;
  }
  porEtapa.publicada = publicadas.length;
  const porTienda = new Map<string, C.MuestraVista[]>();
  for (const m of pendientes) {
    const lista = porTienda.get(m.tienda.tienda_key);
    if (lista) lista.push(m);
    else porTienda.set(m.tienda.tienda_key, [m]);
  }
  let avisadas = 0;
  for (const lista of porTienda.values()) if (lista.every((m) => estaAvisada(m.application_id, avisos))) avisadas += 1;
  const promesasVencidas = muestras.filter((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy)).length;
  return {
    pendientes: pendientes.length,
    total_cohorte: pendientes.length + publicadas.length,
    publicadas: publicadas.length,
    por_etapa: porEtapa,
    tiendas_con_pendientes: porTienda.size,
    tiendas_avisadas: avisadas,
    tiendas_por_avisar: porTienda.size - avisadas,
    promesas_vencidas: promesasVencidas,
    por_vencer_48h: pendientes.filter((m) => m.grupo === 'por_vencer' && m.fecha_limite_at !== null && m.fecha_limite_at - ahora < 172_800).length,
    no_se_puede: muestras.filter((m) => GRUPOS_PENDIENTES.has(m.grupo) && m.avance.etapa === 'no_se_puede').length,
  };
}

// ============================================================================ acciones por etapa (01_ux §2.4)
/** "Publicada sin aviso posterior a la publicación": se usa el último aviso enviado (MuestraVista no dice qué
 *  plantilla llevaba; 03 §5.10 sugiere "Ya publiqué" para toda publicada). */
function faltaAvisarPublicada(m: C.MuestraVista): boolean {
  const publicada = m.avance.fecha_publicada;
  const avisado = m.avisos.ultimo_enviado_at;
  if (avisado === null) return true;
  return publicada !== null && avisado < epochDeFecha(publicada);
}

/** Tabla "Acción principal visible por etapa" de 01_ux §2.4. null si la muestra no admite etapas. */
export function accionPrincipal(m: C.MuestraVista, programoMisVideos: boolean): AccionEtapa | null {
  const etapa = m.avance.etapa;
  if (etapa === 'publicada') return faltaAvisarPublicada(m) ? 'avisar' : null;
  if (!GRUPOS_CON_ETAPAS.has(m.grupo)) return null;
  if (GRUPOS_ANTICIPADOS.has(m.grupo)) {
    // Aún no llega: solo se puede planear con anticipación.
    if (etapa === 'por_planear') return 'planear';
    return etapa === 'no_se_puede' ? null : 'cambiar_fecha';
  }
  switch (etapa) {
    case 'por_planear':
      return 'planear';
    case 'planeada':
      return 'marcar_publicada';
    case 'video_listo':
      return programoMisVideos ? 'marcar_programada' : 'marcar_publicada';
    case 'programada':
      return 'marcar_publicada';
    case 'no_se_puede':
      return null;
  }
}

export function accionSecundaria(m: C.MuestraVista, _programoMisVideos: boolean): AccionEtapa | null {
  if (!GRUPOS_CON_ETAPAS.has(m.grupo) || GRUPOS_ANTICIPADOS.has(m.grupo)) return null;
  switch (m.avance.etapa) {
    case 'por_planear':
      return 'avisar';
    case 'planeada':
      return 'video_listo';
    case 'programada':
      return 'cambiar_fecha';
    default:
      return null;
  }
}

// ============================================================================ validar y cambiar de etapa
/** Mensaje en español si faltan datos obligatorios (las reglas del 422 del hub: CHECK de plan_videos y 03 §6.2); null
 *  si está bien. */
export function validarEtapa(etapa: C.EtapaAvance, datos: DatosEtapa): string | null {
  const fechaInvalida = (f: C.FechaLocal | undefined): boolean => f !== undefined && !esFechaLocal(f);
  if (fechaInvalida(datos.fecha_plan) || fechaInvalida(datos.fecha_video_listo) || fechaInvalida(datos.fecha_publicada)) {
    return 'Esa fecha no es válida.';
  }
  switch (etapa) {
    case 'planeada':
      return datos.fecha_plan === undefined ? 'Elige qué día haces este video.' : null;
    case 'programada':
      return datos.programada_para_at === undefined || !Number.isFinite(datos.programada_para_at)
        ? 'Elige la fecha y la hora en que se publica.'
        : null;
    case 'publicada':
      if (datos.vinculo_origen === 'video_previo') {
        return 'Un video anterior a la muestra no cuenta como publicado. Si la tienda lo aceptó, usa «La tienda aceptó este video».';
      }
      if (datos.enlace_video !== undefined && datos.enlace_video !== null && datos.enlace_video.trim() !== '' && !esEnlaceTikTok(datos.enlace_video)) {
        return 'Ese enlace no parece de un video de TikTok. Cópialo desde Compartir › Copiar enlace.';
      }
      if (datos.content_id !== undefined && datos.content_id !== null && !/^\d{15,21}$/.test(datos.content_id)) {
        return 'Ese enlace no parece de un video de TikTok. Cópialo desde Compartir › Copiar enlace.';
      }
      return null;
    case 'no_se_puede':
      if (datos.motivo_no_se_puede === undefined) return 'Elige por qué no puedes hacer este video.';
      if (datos.motivo_texto !== undefined && datos.motivo_texto !== null && datos.motivo_texto.length > 300) {
        return 'El motivo puede tener hasta 300 caracteres.';
      }
      return null;
    default:
      return null;
  }
}

type CamposPlan = Partial<Omit<C.PlanVideoCrear, 'id' | 'titulo'>>;

function limpiarDesde(campos: CamposPlan, desde: 'video_listo' | 'programada' | 'publicada'): void {
  if (desde === 'video_listo') campos.fecha_video_listo = null;
  if (desde === 'video_listo' || desde === 'programada') campos.programada_para_at = null;
  campos.fecha_publicada = null;
  campos.content_id = null;
  campos.enlace_video = null;
  campos.vinculo_origen = null;
}

/**
 * Crea o edita el PlanVideo de la muestra para pasarla a `etapa` (un solo plan vivo por solicitud). Se puede avanzar
 * saltando etapas y retroceder (01_ux §2.4 regla 1): al retroceder se limpian los datos de las etapas posteriores.
 * Video listo y Publicada ponen su fecha automática (hoy) si no viene. Publicada toma el content_id del enlace
 * (contentIdDeEnlace; un enlace corto queda en enlace_video con content_id null y el hub lo resuelve, C30).
 */
export function opCambioEtapa(m: C.MuestraVista, etapa: C.EtapaAvance, datos: DatosEtapa, hoy: C.FechaLocal): OperacionPlan {
  const a = m.avance;
  const campos: CamposPlan = { estado: etapa };
  if (etapa !== 'no_se_puede') {
    campos.motivo_no_se_puede = null;
    campos.motivo_texto = null;
  }
  switch (etapa) {
    case 'por_planear':
      campos.fecha_plan = null;
      limpiarDesde(campos, 'video_listo');
      break;
    case 'planeada':
      campos.fecha_plan = datos.fecha_plan ?? a.fecha_planeada ?? hoy;
      limpiarDesde(campos, 'video_listo');
      break;
    case 'video_listo':
      if (datos.fecha_plan !== undefined) campos.fecha_plan = datos.fecha_plan;
      campos.fecha_video_listo = datos.fecha_video_listo ?? hoy;
      limpiarDesde(campos, 'programada');
      break;
    case 'programada':
      if (datos.fecha_plan !== undefined) campos.fecha_plan = datos.fecha_plan;
      if (datos.fecha_video_listo !== undefined) campos.fecha_video_listo = datos.fecha_video_listo;
      campos.programada_para_at = datos.programada_para_at ?? a.programada_para_at;
      limpiarDesde(campos, 'publicada');
      break;
    case 'publicada': {
      const enlace = datos.enlace_video !== undefined && datos.enlace_video !== null && datos.enlace_video.trim() !== '' ? datos.enlace_video.trim() : null;
      let contentId: string | null;
      if (datos.content_id !== undefined) contentId = datos.content_id;
      else if (enlace !== null) contentId = contentIdDeEnlace(enlace);
      else if (a.vinculo_origen === 'video_previo' && datos.vinculo_origen !== 'video_previo_aceptado') contentId = null;
      else contentId = a.content_id;
      const conservaOrigen = a.vinculo_origen !== null && a.vinculo_origen !== 'video_previo' && contentId === a.content_id;
      campos.fecha_publicada = datos.fecha_publicada ?? hoy;
      if (datos.fecha_plan !== undefined) campos.fecha_plan = datos.fecha_plan;
      campos.content_id = contentId;
      campos.enlace_video = enlace;
      campos.vinculo_origen = datos.vinculo_origen ?? (contentId !== null || enlace !== null ? (conservaOrigen ? a.vinculo_origen : 'manual') : null);
      break;
    }
    case 'no_se_puede':
      if (datos.motivo_no_se_puede !== undefined) campos.motivo_no_se_puede = datos.motivo_no_se_puede;
      campos.motivo_texto = datos.motivo_texto !== undefined && datos.motivo_texto !== null && datos.motivo_texto.trim() !== '' ? datos.motivo_texto.trim() : null;
      break;
  }
  if (a.plan_id) return { tipo: 'plan.editar', id: a.plan_id, cambios: { ...campos, rev: a.rev } };
  return {
    tipo: 'plan.crear',
    datos: {
      ...campos,
      id: nuevoId(),
      titulo: tituloPlan(m),
      application_id: m.application_id,
      product_id: m.producto.product_id,
      tienda_key: m.tienda.tienda_key,
    },
  };
}

/** Título de un PlanVideo nuevo (1..200 caracteres): el nombre corto del producto o "Video de muestra" (como el hub). */
export function tituloPlan(m: C.MuestraVista): string {
  const t = (m.producto.titulo_corto ?? nombreCorto(m.producto.titulo)).trim();
  return t ? Array.from(t).slice(0, 200).join('') : 'Video de muestra';
}

// ============================================================================ enlaces de TikTok (BUILD_SPEC §6.3, C30)
const ENLACE_VIDEO = /^(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/@[^/?#\s]+\/video\/(\d{15,21})(?:[/?#]\S*)?$/i;

/** content_id de 'https://www.tiktok.com/@x/video/<id>' (o el id suelto de 19 dígitos). Enlace corto (vm./vt.) → null:
 *  se guarda en enlace_video y el hub lo resuelve después (BUILD_SPEC §6.3). */
export function contentIdDeEnlace(texto: string): string | null {
  const t = texto.trim();
  if (/^\d{19}$/.test(t)) return t;
  return ENLACE_VIDEO.exec(t)?.[1] ?? null;
}

/** Enlace de TikTok (www, m, vm o vt), con o sin https://. */
export function esEnlaceTikTok(texto: string): boolean {
  return /^(?:https?:\/\/)?(?:www\.|m\.|vm\.|vt\.)?tiktok\.com\/\S+$/i.test(texto.trim());
}

// ============================================================================ fecha prometida (01_ux §4.8, §2.5)
/** Fecha prometida por omisión (01_ux §4.8): programada; si no, planeada + 2; null si no hay fecha. */
export function fechaPrometidaPorOmision(avance: C.AvanceMuestra): C.FechaLocal | null {
  if (avance.programada_para_at !== null) return fechaLocalDe(avance.programada_para_at);
  if (avance.fecha_planeada !== null) return sumarDias(avance.fecha_planeada, 2);
  return null;
}

/** Promesa en riesgo: fecha planeada (o programada) + 2 > promesa vigente. */
export function promesaEnRiesgo(fechaPlan: C.FechaLocal, promesa: C.FechaLocal | null): boolean {
  return promesa !== null && diasEntre(promesa, sumarDias(fechaPlan, 2)) > 0;
}

// ============================================================================ Avisar a mis tiendas (01_ux §4.17)
/** Orden de salud de "Tiendas que necesitan atención" (01_ux §2.7, en el orden en que se evalúan). */
export const ORDEN_SALUD: readonly C.SaludTienda[] = [
  'socio_con_pendientes', 'con_pendientes', 'con_plan', 'socio', 'al_dia', 'vende_contigo', 'solo_solicitudes', 'solo_reembolsos',
];

/** Salud recalculada para una tienda CON pendientes (las tres primeras filas de 01_ux §2.7, regla del hub). */
export function saludConPendientes(pendientes: readonly C.MuestraVista[], esSocio: boolean, avisos: readonly C.AvisoTienda[], hoy: C.FechaLocal): C.SaludTienda {
  const urgentes = pendientes.some((m) => m.avance.etapa === 'por_planear')
    || pendientes.some((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy));
  if (esSocio && urgentes) return 'socio_con_pendientes';
  return urgentes ? 'con_pendientes' : 'con_plan';
}

/** Orden de "Avisar a mis tiendas" (01_ux §4.17): promesas vencidas → socio con pendientes → con pendientes, por
 *  comisión de 180 días, nº de pendientes y valor recibido. Solo tiendas con pendientes por avisar o con promesa
 *  vencida. La salud se recalcula con el estado local (las tiendas que entran aquí siempre tienen pendientes). */
export function ordenTiendasAvisar(tiendas: C.FilaTienda[], muestras: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): C.FilaTienda[] {
  const pendientesDe = new Map<string, C.MuestraVista[]>();
  for (const m of muestras) {
    if (!esPendiente(m)) continue;
    const lista = pendientesDe.get(m.tienda.tienda_key);
    if (lista) lista.push(m);
    else pendientesDe.set(m.tienda.tienda_key, [m]);
  }
  const filas: Array<{ t: C.FilaTienda; vencidas: number; salud: number; pendientes: number }> = [];
  for (const t of tiendas) {
    const pend = pendientesDe.get(t.tienda_key) ?? [];
    if (pend.length === 0) continue;
    const vencidas = pend.filter((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy)).length;
    const porAvisar = pend.some((m) => !estaAvisada(m.application_id, avisos));
    if (!porAvisar && vencidas === 0) continue;
    const salud = ORDEN_SALUD.indexOf(saludConPendientes(pend, t.es_socio, avisos, hoy));
    filas.push({ t, vencidas, salud, pendientes: pend.length });
  }
  filas.sort((a, b) =>
    (b.vencidas > 0 ? 1 : 0) - (a.vencidas > 0 ? 1 : 0)
    || b.vencidas - a.vencidas
    || a.salud - b.salud
    || b.t.ventas.comision_180d_centavos - a.t.ventas.comision_180d_centavos
    || b.pendientes - a.pendientes
    // "Valor recibido" por su extremo alto: así sale el orden de 01_ux §4.17 (Tienda A ≈ $100 – $1,000 antes que
    // Tienda B ≈ $500, ambas sin comisión en 180 días y con 2 pendientes); el mínimo desempata después.
    || b.t.muestras.valor_recibido_max_centavos - a.t.muestras.valor_recibido_max_centavos
    || b.t.muestras.valor_recibido_min_centavos - a.t.muestras.valor_recibido_min_centavos
    || (a.t.tienda_key < b.t.tienda_key ? -1 : a.t.tienda_key > b.t.tienda_key ? 1 : 0));
  return filas.map((f) => f.t);
}

// ============================================================================ plantilla sugerida (03 §5.10)
/** Precedencia de 03 §5.10 para una muestra: promesa vencida > publicada > "No se puede" según el motivo (o no
 *  promocionable) > tarjeta "Ya tienes un video" > por vencer > varias pendientes de la tienda > una > socio. */
export function plantillaSugeridaDe(m: C.MuestraVista, pendientesTienda: number, motivo: C.MotivoNoSePuede | null): string {
  if (m.avisos.promesa_vencida) return 'nueva_fecha';
  if (m.avance.etapa === 'publicada') return 'ya_publique';
  if (m.avance.etapa === 'no_se_puede') {
    if (motivo === 'agotado' || motivo === 'desactivado') return 'producto_no_disponible';
    if (motivo === 'no_llego' || motivo === 'incompleta') return 'no_me_llego_completa';
    if (motivo === 'no_va_con_mi_contenido') return 'prefiero_otro_producto';
    return 'disculpa_sin_fecha';
  }
  const pendiente = esPendiente(m);
  if (pendiente && m.prioridad === 'no_se_puede_etiquetar') return 'producto_no_disponible';
  if (pendiente && m.tarjeta_video === 'video_previo') return 'ya_tengo_video';
  if (m.grupo === 'por_vencer') return 'ya_la_recibi';
  if (pendiente) return pendientesTienda >= 2 ? 'varias_muestras' : 'disculpa_y_fecha';
  if (m.tienda.es_socio) return 'gracias_por_las_ventas';
  return 'disculpa_y_fecha';
}
