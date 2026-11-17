/**
 * @/datos · estado local optimista (funciones puras, sin React). Aplica una OpLocal a las listas del estado local con
 * las mismas formas que el hub (03 §3: rev empieza en 1 y sube 1 por cambio; ids uuid del cliente), arma la op inversa
 * para Deshacer y filtra las listas por los parámetros de cada consulta. Lo usan la superposición optimista de Windows,
 * el objeto previsto de Android ('en_cola') y el estado en memoria del modo demo.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, OpSinId } from '@firmas/datos';

export interface ContextoOp {
  ahora: C.EpochS;
  dispositivo: string;
}

export interface EstadoLocalListas {
  planes: C.PlanVideo[];
  avisos: C.AvisoTienda[];
  notas: C.Nota[];
  recordatorios: C.Recordatorio[];
  plantillas: C.PlantillaMensaje[];
  preferencias: C.PreferenciasSincronizadas | null;
}

export const ESTADO_VACIO: EstadoLocalListas = { planes: [], avisos: [], notas: [], recordatorios: [], plantillas: [], preferencias: null };

export type ListaLocal = 'planes' | 'avisos' | 'notas' | 'recordatorios' | 'plantillas' | 'preferencias';

/** Lista del estado local que toca una op y la clave de Consultas que la lee. */
export function listaDeOp(tipo: C.OpLocal['tipo']): { lista: ListaLocal; clave: ClaveConsulta } {
  if (tipo.startsWith('plan.')) return { lista: 'planes', clave: 'plan' };
  if (tipo.startsWith('aviso.')) return { lista: 'avisos', clave: 'avisos' };
  if (tipo.startsWith('nota.')) return { lista: 'notas', clave: 'notas' };
  if (tipo.startsWith('recordatorio.')) return { lista: 'recordatorios', clave: 'recordatorios' };
  if (tipo.startsWith('plantilla.')) return { lista: 'plantillas', clave: 'plantillas' };
  return { lista: 'preferencias', clave: 'preferencias' };
}

/** Id del objeto que toca la op ('preferencias' para las preferencias). */
export function idDeOp(op: OpSinId | C.OpLocal): string {
  switch (op.tipo) {
    case 'plan.crear':
    case 'nota.crear':
    case 'recordatorio.crear':
    case 'aviso.crear':
      return op.datos.id;
    case 'preferencias.editar':
      return 'preferencias';
    default:
      return op.id;
  }
}

/** La op con su op_id (uuid4 que genera la capa de datos). */
export function conOpId(op: OpSinId, op_id: string): C.OpLocal {
  switch (op.tipo) {
    case 'plan.crear': return { op_id, tipo: op.tipo, datos: op.datos };
    case 'plan.editar': return { op_id, tipo: op.tipo, id: op.id, cambios: op.cambios };
    case 'plan.borrar': return { op_id, tipo: op.tipo, id: op.id, rev: op.rev };
    case 'nota.crear': return { op_id, tipo: op.tipo, datos: op.datos };
    case 'nota.editar': return { op_id, tipo: op.tipo, id: op.id, cambios: op.cambios };
    case 'nota.borrar': return { op_id, tipo: op.tipo, id: op.id, rev: op.rev };
    case 'recordatorio.crear': return { op_id, tipo: op.tipo, datos: op.datos };
    case 'recordatorio.editar': return { op_id, tipo: op.tipo, id: op.id, cambios: op.cambios };
    case 'recordatorio.borrar': return { op_id, tipo: op.tipo, id: op.id, rev: op.rev };
    case 'aviso.crear': return { op_id, tipo: op.tipo, datos: op.datos };
    case 'aviso.editar': return { op_id, tipo: op.tipo, id: op.id, cambios: op.cambios };
    case 'plantilla.editar': return { op_id, tipo: op.tipo, id: op.id, cambios: op.cambios };
    case 'preferencias.editar': return { op_id, tipo: op.tipo, cambios: op.cambios };
  }
}

// ---------------------------------------------------------------------------------------------- objetos completos

function versionNueva(ctx: ContextoOp): { creado_at: C.EpochS; actualizado_at: C.EpochS; rev: number; dispositivo_id: string } {
  return { creado_at: ctx.ahora, actualizado_at: ctx.ahora, rev: 1, dispositivo_id: ctx.dispositivo };
}

export function planCompleto(datos: C.PlanVideoCrear, ctx: ContextoOp): C.PlanVideo {
  return {
    application_id: null, product_id: null, tienda_key: null, fecha_plan: null, estado: 'por_planear',
    fecha_video_listo: null, programada_para_at: null, fecha_publicada: null, content_id: null, enlace_video: null,
    vinculo_origen: null, sugerencias_descartadas: [], motivo_no_se_puede: null, motivo_texto: null, fijada: false,
    nombre_corto: null, notas: null, orden: 0, en_cohorte_desde_at: null,
    ...datos,
    ...versionNueva(ctx),
  };
}

export function avisoCompleto(datos: C.AvisoCrear, ctx: ContextoOp): C.AvisoTienda {
  return { fecha_anterior: null, copiado_at: null, marcado_enviado_at: null, quitado_at: null, ...datos, ...versionNueva(ctx) };
}

export function notaCompleta(datos: C.NotaCrear, ctx: ContextoOp): C.Nota {
  return { fijada: false, ...datos, ...versionNueva(ctx) };
}

export function recordatorioCompleto(datos: C.RecordatorioCrear, ctx: ContextoOp): C.Recordatorio {
  return {
    entidad: 'general', entidad_id: null, repetir: 'no', estado: 'activo', pospuesto_hasta: null, notificado_at: null,
    ...datos,
    ...versionNueva(ctx),
  };
}

function sinRev<T extends { rev: number }>(cambios: T): Omit<T, 'rev'> {
  const { rev: _rev, ...resto } = cambios;
  return resto;
}

function editado<T extends { rev: number; actualizado_at: C.EpochS; dispositivo_id: string }>(base: T, cambios: object, ctx: ContextoOp): T {
  return { ...base, ...cambios, rev: base.rev + 1, actualizado_at: ctx.ahora, dispositivo_id: ctx.dispositivo };
}

function reemplazar<T extends { id: string }>(lista: readonly T[], objeto: T): T[] {
  let hubo = false;
  const salida = lista.map((x) => {
    if (x.id !== objeto.id) return x;
    hubo = true;
    return objeto;
  });
  if (!hubo) salida.push(objeto);
  return salida;
}

function quitar<T extends { id: string }>(lista: readonly T[], id: string): T[] {
  return lista.filter((x) => x.id !== id);
}

export interface ResultadoAplicar {
  estado: EstadoLocalListas;
  /** El objeto como queda (null si se borró o si no existía para editar). */
  objeto: C.ObjetoLocal | null;
  /** false = editar/borrar algo que no está en las listas. */
  encontrada: boolean;
}

/** Aplica una op al estado local (no muta la entrada). */
export function aplicarOpAEstado(estado: EstadoLocalListas, op: OpSinId | C.OpLocal, ctx: ContextoOp): ResultadoAplicar {
  switch (op.tipo) {
    case 'plan.crear': {
      const previo = estado.planes.find((p) => p.id === op.datos.id);
      const objeto = previo ?? planCompleto(op.datos, ctx);
      return { estado: { ...estado, planes: reemplazar(estado.planes, objeto) }, objeto, encontrada: true };
    }
    case 'plan.editar': {
      const base = estado.planes.find((p) => p.id === op.id);
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto = editado(base, sinRev(op.cambios), ctx);
      return { estado: { ...estado, planes: reemplazar(estado.planes, objeto) }, objeto, encontrada: true };
    }
    case 'plan.borrar': {
      const encontrada = estado.planes.some((p) => p.id === op.id);
      return { estado: { ...estado, planes: quitar(estado.planes, op.id) }, objeto: null, encontrada };
    }
    case 'nota.crear': {
      const objeto = estado.notas.find((n) => n.id === op.datos.id) ?? notaCompleta(op.datos, ctx);
      return { estado: { ...estado, notas: reemplazar(estado.notas, objeto) }, objeto, encontrada: true };
    }
    case 'nota.editar': {
      const base = estado.notas.find((n) => n.id === op.id);
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto = editado(base, sinRev(op.cambios), ctx);
      return { estado: { ...estado, notas: reemplazar(estado.notas, objeto) }, objeto, encontrada: true };
    }
    case 'nota.borrar': {
      const encontrada = estado.notas.some((n) => n.id === op.id);
      return { estado: { ...estado, notas: quitar(estado.notas, op.id) }, objeto: null, encontrada };
    }
    case 'recordatorio.crear': {
      const objeto = estado.recordatorios.find((r) => r.id === op.datos.id) ?? recordatorioCompleto(op.datos, ctx);
      return { estado: { ...estado, recordatorios: reemplazar(estado.recordatorios, objeto) }, objeto, encontrada: true };
    }
    case 'recordatorio.editar': {
      const base = estado.recordatorios.find((r) => r.id === op.id);
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto = editado(base, sinRev(op.cambios), ctx);
      return { estado: { ...estado, recordatorios: reemplazar(estado.recordatorios, objeto) }, objeto, encontrada: true };
    }
    case 'recordatorio.borrar': {
      const encontrada = estado.recordatorios.some((r) => r.id === op.id);
      return { estado: { ...estado, recordatorios: quitar(estado.recordatorios, op.id) }, objeto: null, encontrada };
    }
    case 'aviso.crear': {
      const objeto = estado.avisos.find((a) => a.id === op.datos.id) ?? avisoCompleto(op.datos, ctx);
      return { estado: { ...estado, avisos: reemplazar(estado.avisos, objeto) }, objeto, encontrada: true };
    }
    case 'aviso.editar': {
      const base = estado.avisos.find((a) => a.id === op.id);
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto = editado(base, sinRev(op.cambios), ctx);
      return { estado: { ...estado, avisos: reemplazar(estado.avisos, objeto) }, objeto, encontrada: true };
    }
    case 'plantilla.editar': {
      const base = estado.plantillas.find((p) => p.id === op.id);
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto = editado(base, sinRev(op.cambios), ctx);
      return { estado: { ...estado, plantillas: reemplazar(estado.plantillas, objeto) }, objeto, encontrada: true };
    }
    case 'preferencias.editar': {
      const base = estado.preferencias;
      if (!base) return { estado, objeto: null, encontrada: false };
      const objeto: C.PreferenciasSincronizadas = { ...base, ...sinRev(op.cambios), rev: base.rev + 1 };
      return { estado: { ...estado, preferencias: objeto }, objeto, encontrada: true };
    }
  }
}

// ---------------------------------------------------------------------------------------------- deshacer

function camposPrevios<T extends object>(antes: T, cambios: object): Partial<T> {
  const salida: Partial<T> = {};
  for (const k of Object.keys(cambios)) {
    if (k === 'rev' || !(k in antes)) continue;
    const clave = k as keyof T;
    salida[clave] = antes[clave];
  }
  return salida;
}

function esVersionado(o: unknown): o is Record<string, unknown> & { id: string; rev: number } {
  return o !== null && typeof o === 'object' && !Array.isArray(o) && 'id' in o && typeof o.id === 'string' && 'rev' in o && typeof o.rev === 'number';
}
function esPlan(o: unknown): o is C.PlanVideo {
  return esVersionado(o) && 'fecha_plan' in o && 'titulo' in o;
}
function esAviso(o: unknown): o is C.AvisoTienda {
  return esVersionado(o) && Array.isArray(o['solicitud_ids']) && 'compromisos' in o;
}
function esRecordatorio(o: unknown): o is C.Recordatorio {
  return esVersionado(o) && 'vence_at' in o && 'titulo' in o;
}
function esNota(o: unknown): o is C.Nota {
  return esVersionado(o) && 'entidad' in o && 'texto' in o && !('vence_at' in o) && !('solicitud_ids' in o);
}
function esPlantilla(o: unknown): o is C.PlantillaMensaje {
  return esVersionado(o) && 'cuerpo' in o && 'predeterminada' in o;
}
function esPreferencias(o: unknown): o is C.PreferenciasSincronizadas {
  return o !== null && typeof o === 'object' && 'capacidad_videos_dia' in o && 'rev' in o && typeof o.rev === 'number';
}
/** Cualquier objeto del estado local reconocible. */
function esObjetoLocalConocido(o: unknown): o is C.ObjetoLocal {
  return esPlan(o) || esAviso(o) || esRecordatorio(o) || esNota(o) || esPlantilla(o) || esPreferencias(o);
}

export const guardas = { esPlan, esAviso, esRecordatorio, esNota, esPlantilla, esPreferencias, esObjetoLocalConocido };

function datosPlan(p: C.PlanVideo, id: string): C.PlanVideoCrear {
  return {
    id, titulo: p.titulo, application_id: p.application_id, product_id: p.product_id, tienda_key: p.tienda_key,
    fecha_plan: p.fecha_plan, estado: p.estado, fecha_video_listo: p.fecha_video_listo, programada_para_at: p.programada_para_at,
    fecha_publicada: p.fecha_publicada, content_id: p.content_id, enlace_video: p.enlace_video, vinculo_origen: p.vinculo_origen,
    sugerencias_descartadas: [...p.sugerencias_descartadas], motivo_no_se_puede: p.motivo_no_se_puede, motivo_texto: p.motivo_texto,
    fijada: p.fijada, nombre_corto: p.nombre_corto, notas: p.notas, orden: p.orden,
  };
}

/**
 * Op inversa para "Deshacer" (con la rev NUEVA del objeto: `despues`). Crear → borrar (aviso: quitar con quitado_at,
 * no hay DELETE); editar → editar con los valores previos de los campos tocados; borrar → crear una copia con id nuevo.
 * null = no se puede armar (falta el objeto previo o el resultante).
 */
export function inversaDe(op: C.OpLocal, antes: C.ObjetoLocal | null, despues: C.ObjetoLocal | null, ctx: ContextoOp, nuevoId: () => string): OpSinId | null {
  switch (op.tipo) {
    case 'plan.crear':
      return esPlan(despues) ? { tipo: 'plan.borrar', id: despues.id, rev: despues.rev } : null;
    case 'plan.editar':
      return esPlan(antes) && esPlan(despues) ? { tipo: 'plan.editar', id: op.id, cambios: { ...camposPrevios(antes, op.cambios), rev: despues.rev } } : null;
    case 'plan.borrar':
      return esPlan(antes) ? { tipo: 'plan.crear', datos: datosPlan(antes, nuevoId()) } : null;
    case 'nota.crear':
      return esNota(despues) ? { tipo: 'nota.borrar', id: despues.id, rev: despues.rev } : null;
    case 'nota.editar':
      return esNota(antes) && esNota(despues) ? { tipo: 'nota.editar', id: op.id, cambios: { ...camposPrevios(antes, op.cambios), rev: despues.rev } } : null;
    case 'nota.borrar':
      return esNota(antes)
        ? { tipo: 'nota.crear', datos: { id: nuevoId(), entidad: antes.entidad, entidad_id: antes.entidad_id, texto: antes.texto, fijada: antes.fijada } }
        : null;
    case 'recordatorio.crear':
      return esRecordatorio(despues) ? { tipo: 'recordatorio.borrar', id: despues.id, rev: despues.rev } : null;
    case 'recordatorio.editar':
      return esRecordatorio(antes) && esRecordatorio(despues)
        ? { tipo: 'recordatorio.editar', id: op.id, cambios: { ...camposPrevios(antes, op.cambios), rev: despues.rev } }
        : null;
    case 'recordatorio.borrar':
      return esRecordatorio(antes)
        ? { tipo: 'recordatorio.crear', datos: { id: nuevoId(), titulo: antes.titulo, vence_at: antes.vence_at, entidad: antes.entidad, entidad_id: antes.entidad_id, repetir: antes.repetir } }
        : null;
    case 'aviso.crear':
      return esAviso(despues) ? { tipo: 'aviso.editar', id: despues.id, cambios: { quitado_at: ctx.ahora, rev: despues.rev } } : null;
    case 'aviso.editar':
      return esAviso(antes) && esAviso(despues) ? { tipo: 'aviso.editar', id: op.id, cambios: { ...camposPrevios(antes, op.cambios), rev: despues.rev } } : null;
    case 'plantilla.editar':
      return esPlantilla(antes) && esPlantilla(despues)
        ? { tipo: 'plantilla.editar', id: op.id, cambios: { nombre: antes.nombre, cuerpo: antes.cuerpo, rev: despues.rev } }
        : null;
    case 'preferencias.editar':
      return esPreferencias(antes) && esPreferencias(despues)
        ? { tipo: 'preferencias.editar', cambios: { ...camposPrevios(antes, op.cambios), rev: despues.rev } }
        : null;
  }
}

// ---------------------------------------------------------------------------------------------- filtros por consulta

function texto(params: object, k: string): string | undefined {
  const v: unknown = k in params ? Object.getOwnPropertyDescriptor(params, k)?.value : undefined;
  return typeof v === 'string' && v !== '' ? v : undefined;
}

/** ¿El objeto entra en la lista que devuelve la consulta `clave` con `params`? (mismo criterio que el hub). */
export function entraEnConsulta(clave: ClaveConsulta, params: object, o: C.ObjetoLocal): boolean {
  switch (clave) {
    case 'plan': {
      if (!esPlan(o)) return false;
      const desde = texto(params, 'desde');
      const hasta = texto(params, 'hasta');
      if (!desde && !hasta) return true;
      if (o.fecha_plan === null) return false;
      return (!desde || o.fecha_plan >= desde) && (!hasta || o.fecha_plan <= hasta);
    }
    case 'avisos': {
      if (!esAviso(o)) return false;
      const tienda = texto(params, 'tienda');
      const solicitud = texto(params, 'solicitud');
      return (!tienda || o.tienda_key === tienda) && (!solicitud || o.solicitud_ids.includes(solicitud));
    }
    case 'notas': {
      if (!esNota(o)) return false;
      const entidad = texto(params, 'entidad');
      const entidadId = texto(params, 'entidad_id');
      return (!entidad || o.entidad === entidad) && (!entidadId || o.entidad_id === entidadId);
    }
    case 'recordatorios': {
      if (!esRecordatorio(o)) return false;
      const estado = texto(params, 'estado');
      return !estado || o.estado === estado;
    }
    case 'plantillas':
      return esPlantilla(o);
    default:
      return false;
  }
}

/** application_id cuyo avance o avisos cambia con la op (para recalcular esas muestras con dominio.aplicarLocal). */
export function solicitudesTocadas(antes: C.ObjetoLocal | null, despues: C.ObjetoLocal | null): Set<string> {
  const salida = new Set<string>();
  for (const o of [antes, despues]) {
    if (esPlan(o) && o.application_id) salida.add(o.application_id);
    if (esAviso(o)) for (const s of o.solicitud_ids) salida.add(s);
  }
  return salida;
}
