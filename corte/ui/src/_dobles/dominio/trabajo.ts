/* __DOBLE_CORTE__ · doble de @/dominio: trabajo, plan, mensajes, recordatorios, CSV y copia.
   esPendiente es real (01_ux §2.5). Lo demás es neutro o una versión simple: armarPlan → resultado vacío,
   deCopia → null, aplicarLocal → identidad. La lógica completa la entrega ui-dominio. */
import type * as C from '@/contrato';
import type {
  AccionEtapa, AsignacionPlan, ConteosTrabajo, ContextoMensaje, DatosEtapa, EntradaPlan, MensajeResuelto,
  OperacionPlan, ResultadoPlan, ResultadoRecorrido,
} from '@firmas/dominio';
import type { NotificacionProgramada } from '@/plataforma';
import type { ClaveConsulta, ParamsDe, RespuestaDe } from '@/datos';
import { ahoraS, epochDeFecha, fechaLocalDe, horaLocal, sumarDias } from './fechas';
import { formato } from './formato';
import { nombreCorto, nuevoId } from './texto';

const GRUPOS_PENDIENTES: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada']);
const GRUPOS_CON_ETAPAS: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada', 'esperando_aprobacion', 'en_camino']);

/** Grupo ∈ {por_vencer, vencida, pausada} y etapa ∉ {publicada, no_se_puede}. */
export function esPendiente(m: C.MuestraVista): boolean {
  return GRUPOS_PENDIENTES.has(m.grupo) && m.avance.etapa !== 'publicada' && m.avance.etapa !== 'no_se_puede';
}

export function contarTrabajo(muestras: C.MuestraVista[], avisos: C.AvisoTienda[], _hoy: C.FechaLocal): ConteosTrabajo {
  const deTrabajo = muestras.filter((m) => GRUPOS_PENDIENTES.has(m.grupo));
  const pendientes = deTrabajo.filter(esPendiente);
  const porEtapa = { planeada: 0, video_listo: 0, programada: 0, publicada: 0 };
  for (const m of deTrabajo) {
    const e = m.avance.etapa;
    if (e === 'planeada' || e === 'video_listo' || e === 'programada' || e === 'publicada') porEtapa[e] += 1;
  }
  const tiendasPendientes = new Set(pendientes.map((m) => m.tienda.tienda_key));
  const enviados = avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null);
  const avisadas = new Set<string>();
  for (const m of pendientes) {
    if (enviados.some((a) => a.solicitud_ids.includes(m.application_id))) avisadas.add(m.tienda.tienda_key);
  }
  const ahora = ahoraS();
  return {
    pendientes: pendientes.length,
    total_cohorte: pendientes.length + porEtapa.publicada,
    publicadas: porEtapa.publicada,
    por_etapa: porEtapa,
    tiendas_con_pendientes: tiendasPendientes.size,
    tiendas_avisadas: avisadas.size,
    tiendas_por_avisar: tiendasPendientes.size - avisadas.size,
    promesas_vencidas: pendientes.filter((m) => m.avisos.promesa_vencida).length,
    por_vencer_48h: pendientes.filter((m) => m.grupo === 'por_vencer' && m.fecha_limite_at !== null && m.fecha_limite_at - ahora < 172_800).length,
    no_se_puede: deTrabajo.filter((m) => m.avance.etapa === 'no_se_puede').length,
  };
}

/** Neutro: identidad. */
export function aplicarLocal(m: C.MuestraVista, _planes: C.PlanVideo[], _avisos: C.AvisoTienda[], _hoy: C.FechaLocal): C.MuestraVista {
  return m;
}

/** Tabla "Acción principal visible por etapa" de 01_ux §2.4. */
export function accionPrincipal(m: C.MuestraVista, programoMisVideos: boolean): AccionEtapa | null {
  if (!GRUPOS_CON_ETAPAS.has(m.grupo)) return null;
  switch (m.avance.etapa) {
    case 'por_planear':
      return 'planear';
    case 'planeada':
      return 'marcar_publicada';
    case 'video_listo':
      return programoMisVideos ? 'marcar_programada' : 'marcar_publicada';
    case 'programada':
      return 'marcar_publicada';
    case 'publicada': {
      const publicada = m.avance.fecha_publicada;
      const avisado = m.avisos.ultimo_enviado_at;
      return publicada !== null && avisado !== null && avisado >= epochDeFecha(publicada) ? null : 'avisar';
    }
    case 'no_se_puede':
      return null;
  }
}

export function accionSecundaria(m: C.MuestraVista, _programoMisVideos: boolean): AccionEtapa | null {
  if (!GRUPOS_CON_ETAPAS.has(m.grupo)) return null;
  if (m.avance.etapa === 'por_planear') return 'avisar';
  if (m.avance.etapa === 'planeada') return 'video_listo';
  if (m.avance.etapa === 'programada') return 'cambiar_fecha';
  return null;
}

/** Datos obligatorios por etapa (01_ux §2.4). */
export function validarEtapa(etapa: C.EtapaAvance, datos: DatosEtapa): string | null {
  if (etapa === 'planeada' && !datos.fecha_plan) return 'Elige qué día haces este video.';
  if (etapa === 'programada' && datos.programada_para_at === undefined) return 'Elige la fecha y la hora de publicación.';
  if (etapa === 'no_se_puede') {
    if (!datos.motivo_no_se_puede) return 'Elige el motivo.';
    if (datos.motivo_no_se_puede === 'otro' && !datos.motivo_texto) return 'Escribe el motivo.';
  }
  return null;
}

/** Versión simple: crea o edita el plan vivo con la etapa y los datos que vengan. */
export function opCambioEtapa(m: C.MuestraVista, etapa: C.EtapaAvance, datos: DatosEtapa, _hoy: C.FechaLocal): OperacionPlan {
  const campos: Partial<Omit<C.PlanVideoCrear, 'id' | 'titulo'>> = { estado: etapa };
  if (datos.fecha_plan !== undefined) campos.fecha_plan = datos.fecha_plan;
  if (datos.fecha_video_listo !== undefined) campos.fecha_video_listo = datos.fecha_video_listo;
  if (datos.programada_para_at !== undefined) campos.programada_para_at = datos.programada_para_at;
  if (datos.fecha_publicada !== undefined) campos.fecha_publicada = datos.fecha_publicada;
  if (datos.content_id !== undefined) campos.content_id = datos.content_id;
  if (datos.enlace_video !== undefined) campos.enlace_video = datos.enlace_video;
  if (datos.vinculo_origen !== undefined) campos.vinculo_origen = datos.vinculo_origen;
  if (datos.motivo_no_se_puede !== undefined) campos.motivo_no_se_puede = datos.motivo_no_se_puede;
  if (datos.motivo_texto !== undefined) campos.motivo_texto = datos.motivo_texto;
  if (m.avance.plan_id) return { tipo: 'plan.editar', id: m.avance.plan_id, cambios: { ...campos, rev: m.avance.rev } };
  return {
    tipo: 'plan.crear',
    datos: {
      ...campos,
      id: nuevoId(),
      titulo: m.producto.titulo_corto ?? nombreCorto(m.producto.titulo),
      application_id: m.application_id,
      product_id: m.producto.product_id,
      tienda_key: m.tienda.tienda_key,
    },
  };
}

/** content_id de 'https://www.tiktok.com/@x/video/<id>' (o el id suelto de 19 dígitos). Enlace corto → null. */
export function contentIdDeEnlace(texto: string): string | null {
  const t = texto.trim();
  const suelto = /^(\d{19})$/.exec(t);
  if (suelto?.[1]) return suelto[1];
  const largo = /^https?:\/\/(?:www\.|m\.)?tiktok\.com\/@[^/?#\s]+\/video\/(\d{15,21})/i.exec(t);
  return largo?.[1] ?? null;
}

export function esEnlaceTikTok(texto: string): boolean {
  return /^https?:\/\/(?:www\.|m\.|vm\.|vt\.)?tiktok\.com\//i.test(texto.trim());
}

/** Fecha prometida por omisión (01_ux §4.8): programada; si no, planeada + 2; null si no hay fecha. */
export function fechaPrometidaPorOmision(avance: C.AvanceMuestra): C.FechaLocal | null {
  if (avance.programada_para_at !== null) return fechaLocalDe(avance.programada_para_at);
  if (avance.fecha_planeada !== null) return sumarDias(avance.fecha_planeada, 2);
  return null;
}

/** Promesa en riesgo: fecha planeada (o programada) + 2 > promesa vigente. */
export function promesaEnRiesgo(fechaPlan: C.FechaLocal, promesa: C.FechaLocal | null): boolean {
  return promesa !== null && sumarDias(fechaPlan, 2) > promesa;
}

/** Neutro: las tiendas tal cual llegan. */
export function ordenTiendasAvisar(tiendas: C.FilaTienda[], _muestras: C.MuestraVista[], _avisos: C.AvisoTienda[], _hoy: C.FechaLocal): C.FilaTienda[] {
  return [...tiendas];
}

function planVacio(): ResultadoPlan {
  return { asignaciones: [], termina: null, publica_a_mas_tardar: null, por_dia: {}, no_alcanza: [], rompe_promesa: [] };
}

/** Neutro: resultado vacío. */
export function armarPlan(_entrada: EntradaPlan): ResultadoPlan {
  return planVacio();
}

/** 'Hoy' antes de las 6:00 p. m. local; si no, mañana. */
export function desdePorOmision(ahora: C.EpochS): C.FechaLocal {
  const hoy = fechaLocalDe(ahora);
  return horaLocal(ahora).h < 18 ? hoy : sumarDias(hoy, 1);
}

/** Neutro: sin operaciones. */
export function opsDePlan(_resultado: ResultadoPlan, _muestras: C.MuestraVista[], _planes: C.PlanVideo[]): OperacionPlan[] {
  return [];
}

/** Neutro: nada que recorrer. */
export function recorrerPlan(_entrada: EntradaPlan, _nueva: C.MuestraVista): ResultadoRecorrido {
  const cambios: AsignacionPlan[] = [];
  return { ...planVacio(), cambios, termina_antes: null };
}

export const IDS_PLANTILLAS = [
  'disculpa_y_fecha', 'varias_muestras', 'nueva_fecha', 'ya_publique', 'ya_tengo_video', 'producto_no_disponible',
  'no_me_llego_completa', 'prefiero_otro_producto', 'disculpa_sin_fecha', 'ya_la_recibi', 'gracias_por_las_ventas',
] as const;

export const VARIABLES_PLANTILLA: readonly string[] = [
  'tienda', 'producto', 'fecha_compromiso', 'fecha_anterior', 'link_video', 'lista_productos', 'lista_fechas',
  'agradecimiento_socio', 'problema_envio', 'firma',
];

/** Versión simple: solo sustituye {tienda} y {firma}; sin faltantes. */
export function resolverPlantilla(plantilla: Pick<C.PlantillaMensaje, 'id' | 'cuerpo' | 'predeterminada' | 'rev'>, ctx: ContextoMensaje): MensajeResuelto {
  const texto = plantilla.cuerpo.split('{tienda}').join(ctx.tienda.nombre).split('{firma}').join(ctx.firma);
  return { texto, faltantes: [], puede_copiar: true, resaltados: [] };
}

export function plantillaRecomendada(ctx: { muestras: C.MuestraVista[]; promesa_vencida: boolean; es_socio: boolean }): string {
  if (ctx.promesa_vencida) return 'nueva_fecha';
  return ctx.muestras.length > 1 ? 'varias_muestras' : 'disculpa_y_fecha';
}

export function textoDatosGuion(m: C.MuestraVista): string {
  const p = m.producto;
  return [
    `Producto: ${p.titulo_corto ?? nombreCorto(p.titulo)}`,
    `Tienda: ${m.tienda.nombre}`,
    `Precio de venta: ${formato.rangoDinero(p.precio_venta_min_centavos, p.precio_venta_max_centavos, { aprox: true })}`,
  ].join('\n');
}

/** Neutro: sin notificaciones. */
export function calcularNotificaciones(_e: {
  muestras: C.MuestraVista[];
  planes: C.PlanVideo[];
  avisos: C.AvisoTienda[];
  recordatorios: C.Recordatorio[];
  preferencias: C.PreferenciasSincronizadas;
  ahora: C.EpochS;
  dias?: number;
}): NotificacionProgramada[] {
  return [];
}

function celdaCsv(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Versión simple del CSV de Muestras › Todas (UTF-8 con BOM, coma). */
export function csvMuestras(muestras: C.MuestraVista[], _incluirLocal: boolean, _extra?: { avisos: C.AvisoTienda[]; notas: C.Nota[] }): string {
  const filas = [['solicitud', 'tienda', 'producto', 'grupo']];
  for (const m of muestras) filas.push([m.application_id, m.tienda.nombre, m.producto.titulo_corto ?? '', m.grupo]);
  return '﻿' + filas.map((f) => f.map(celdaCsv).join(',')).join('\r\n') + '\r\n';
}

/** Neutro: sin copia no se arma nada ("Necesita tu PC encendida"). */
export function deCopia<K extends ClaveConsulta>(_clave: K, _params: ParamsDe<K>, _copia: C.SnapshotResponse, _hoy: C.FechaLocal): RespuestaDe<K> | null {
  return null;
}

/** Neutro: identidad. */
export function aplicarOpsACopia(copia: C.SnapshotResponse, _ops: C.OpLocal[], _hoy: C.FechaLocal): C.SnapshotResponse {
  return copia;
}
