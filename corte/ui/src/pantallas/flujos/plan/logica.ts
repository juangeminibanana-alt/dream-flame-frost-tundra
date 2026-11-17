/**
 * Armar mi plan (01 §4.5) · lógica de los pasos, sin React. Las reglas del reparto (1–3) viven en dominio.armarPlan;
 * aquí se decide QUÉ entra (candidatas, quitadas, «Rehacer mi plan»), el estado del asistente (pasos 1 «Tu ritmo» →
 * 2 «¿Qué incluimos?» → 3 «Revisa tu plan» → éxito) y los textos que resumen el resultado.
 */
import type * as C from '@/contrato';
import type { OpSinId } from '@/datos';
import { diaSemana, formato, sumarDias, type EntradaPlan, type OperacionPlan, type ResultadoPlan } from '@/dominio';
import { cuenta } from '../util';

/** De OperacionPlan (@/dominio) a la op sin op_id que recibe acciones.lote (un solo Deshacer para todas). */
export function aOpLocal(op: OperacionPlan): OpSinId {
  return op.tipo === 'plan.crear' ? { tipo: 'plan.crear', datos: op.datos } : { tipo: 'plan.editar', id: op.id, cambios: op.cambios };
}

export type PasoPlan = 1 | 2 | 3;
export type ModoRehacer = 'sin_fecha' | 'todo';
export type OrdenPlan = 'sugerido' | 'por_tipo_de_prenda';
export type ModoDesde = 'hoy' | 'manana' | 'otra';

/** Etapas que ocupan un lugar en un día (01 §4.5 regla 2: la capacidad cuenta lo ya planeado). */
const OCUPAN: ReadonlySet<C.EtapaAvance> = new Set<C.EtapaAvance>(['planeada', 'video_listo', 'programada']);

// ============================================================================================= qué entra

/** Promocionable = TikTok deja etiquetarlo (01 §2.3): las que no, van a su sección y no se planean solas. */
export function promocionable(m: C.MuestraVista): boolean {
  return m.prioridad !== 'no_se_puede_etiquetar';
}

/** Candidatas del paso 2: pendientes promocionables que aún no tienen el video hecho (por planear o planeadas). */
export function candidatasPlan(pendientes: readonly C.MuestraVista[]): C.MuestraVista[] {
  return pendientes.filter((m) => promocionable(m) && (m.avance.etapa === 'por_planear' || m.avance.etapa === 'planeada'));
}

/** Ya hay plan si alguna pendiente tiene día (planeada, video listo o programada): la acción se llama «Rehacer mi plan». */
export function hayPlan(pendientes: readonly C.MuestraVista[]): boolean {
  return pendientes.some((m) => OCUPAN.has(m.avance.etapa) && m.avance.fecha_planeada !== null);
}

/**
 * Por omisión (01 §4.5 paso 2): todas las pendientes promocionables sin fecha (hoy 32). Al rehacer y «Repartir todo
 * de nuevo», también las planeadas. Devuelve los application_id incluidos en el orden de las candidatas.
 */
export function incluidasPorOmision(candidatas: readonly C.MuestraVista[], modo: ModoRehacer, quitadas: ReadonlySet<string>): string[] {
  return candidatas
    .filter((m) => !quitadas.has(m.application_id))
    .filter((m) => modo === 'todo' || m.avance.etapa === 'por_planear' || m.avance.fecha_planeada === null)
    .map((m) => m.application_id);
}

/** Entrada de dominio.armarPlan con las promesas vigentes de cada muestra (sus avisos ya superpuestos). */
export function entradaPlan(e: {
  pendientes: C.MuestraVista[];
  incluidas: string[];
  capacidad: number;
  dias: number[];
  desde: C.FechaLocal;
  respetarFechas: boolean;
  orden: OrdenPlan;
  planes: C.PlanVideo[];
  hoy: C.FechaLocal;
}): EntradaPlan {
  const promesas: Record<string, C.FechaLocal> = {};
  for (const m of e.pendientes) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
  return {
    muestras: e.pendientes,
    incluidas: e.incluidas,
    capacidad: Math.max(1, Math.min(10, Math.round(e.capacidad))),
    dias: e.dias,
    desde: e.desde,
    respetarFechas: e.respetarFechas,
    orden: e.orden,
    planes: e.planes,
    promesas,
    hoy: e.hoy,
  };
}

/**
 * Lugares que le quedan a `fecha` (capacidad − lo que ya ocupa ese día); 0 si ese día no se hacen videos. `repartir` =
 * las que el plan va a volver a repartir («Repartir todo de nuevo»): no ocupan su día actual, porque se mueven.
 */
export function lugaresLibres(fecha: C.FechaLocal, capacidad: number, dias: readonly number[], muestras: readonly C.MuestraVista[], repartir: ReadonlySet<string> = new Set()): number {
  if (!dias.includes(diaSemana(fecha))) return 0;
  const ocupados = muestras.filter((m) => OCUPAN.has(m.avance.etapa) && m.avance.fecha_planeada === fecha && !repartir.has(m.application_id)).length;
  return Math.max(0, capacidad - ocupados);
}

/** Grupos por prioridad del paso 2 (urgente → baja), con las muestras en el orden de la cola. */
export function gruposIncluir(candidatas: readonly C.MuestraVista[]): Array<{ nivel: C.NivelPrioridad; items: C.MuestraVista[] }> {
  const niveles: C.NivelPrioridad[] = ['urgente', 'alta', 'media', 'baja'];
  const porCola = [...candidatas].sort((a, b) => (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER));
  return niveles.map((nivel) => ({ nivel, items: porCola.filter((m) => (m.prioridad ?? 'baja') === nivel) })).filter((g) => g.items.length > 0);
}

// ============================================================================================= textos del resultado

const NOMBRE_DIA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

/** «de lunes a sábado» · «lunes, miércoles y viernes» · «todos los días» (0 = lunes). */
export function textoDias(dias: readonly number[]): string {
  const orden = [...new Set(dias)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
  if (orden.length === 0) return 'sin días de videos';
  if (orden.length === 7) return 'todos los días';
  const seguidos = orden.every((d, i) => i === 0 || d === (orden[i - 1] ?? -2) + 1);
  if (seguidos && orden.length >= 3) return `de ${NOMBRE_DIA[orden[0] ?? 0]} a ${NOMBRE_DIA[orden[orden.length - 1] ?? 0]}`;
  const nombres = orden.map((d) => NOMBRE_DIA[d] ?? '');
  if (nombres.length === 1) return `los ${nombres[0]}`;
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
}

/** «Terminas el mar 24 nov · publicas a más tardar el jue 26 nov» (01 §5.1 paso 1); null sin videos. */
export function textoTermina(r: Pick<ResultadoPlan, 'termina' | 'publica_a_mas_tardar'>): string | null {
  if (r.termina === null || r.publica_a_mas_tardar === null) return null;
  return `Terminas el ${formato.fechaConDia(r.termina)} · publicas a más tardar el ${formato.fechaConDia(r.publica_a_mas_tardar)}`;
}

/** «32 videos · 3 por día · de lunes a sábado». */
export function textoRitmo(videos: number, capacidad: number, dias: readonly number[]): string {
  return `${cuenta(videos, 'video')} · ${formato.numero(capacidad)} por día · ${textoDias(dias)}`;
}

/** La primera sincronización todavía no trae las ventas de 180 días (antes del punto de control 2, C34). */
export function ordenProvisional(estado: C.SyncEstado | null): boolean {
  if (!estado || estado.ultima_ok_at !== null) return false;
  const ordenes = estado.pasos.find((p) => p.paso === 'ordenes');
  return ordenes === undefined || ordenes.estado === 'pendiente' || ordenes.estado === 'en_curso';
}

// ============================================================================================= vista previa

export interface DiaPlan {
  fecha: C.FechaLocal;
  /** Videos ese día (lo ya planeado + lo que asigna el plan). */
  n: number;
  /** Ese día se hacen videos. */
  trabaja: boolean;
  /** Muestras que el plan pone ese día (para las fotos). */
  ids: string[];
}

/** Días del plan desde `desde` hasta la fecha de término (máximo 70), con su conteo y las muestras de cada uno. */
export function diasDelPlan(r: ResultadoPlan, desde: C.FechaLocal, dias: readonly number[]): DiaPlan[] {
  if (r.termina === null) return [];
  const porFecha = new Map<C.FechaLocal, string[]>();
  for (const a of r.asignaciones) porFecha.set(a.fecha, [...(porFecha.get(a.fecha) ?? []), a.application_id]);
  const salida: DiaPlan[] = [];
  for (let f = desde, i = 0; f <= r.termina && i < 70; f = sumarDias(f, 1), i++) {
    salida.push({ fecha: f, n: r.por_dia[f] ?? 0, trabaja: dias.includes(diaSemana(f)), ids: porFecha.get(f) ?? [] });
  }
  return salida;
}

/** Semanas (lunes a domingo) que cubren los días del plan; las celdas fuera del rango van en null. */
export function semanasDelPlan(diasPlan: readonly DiaPlan[]): Array<Array<DiaPlan | null>> {
  const primero = diasPlan[0];
  if (!primero) return [];
  const porFecha = new Map(diasPlan.map((d) => [d.fecha, d] as const));
  const ultimo = diasPlan[diasPlan.length - 1]?.fecha ?? primero.fecha;
  const semanas: Array<Array<DiaPlan | null>> = [];
  for (let lunes = sumarDias(primero.fecha, -diaSemana(primero.fecha)); lunes <= ultimo; lunes = sumarDias(lunes, 7)) {
    const fila: Array<DiaPlan | null> = [];
    for (let i = 0; i < 7; i++) fila.push(porFecha.get(sumarDias(lunes, i)) ?? null);
    semanas.push(fila);
  }
  return semanas;
}

/** Los primeros `n` días con videos asignados (la «lista de los primeros días» del paso 3). */
export function primerosDias(r: ResultadoPlan, n = 2): Array<{ fecha: C.FechaLocal; ids: string[] }> {
  const porFecha = new Map<C.FechaLocal, string[]>();
  for (const a of r.asignaciones) porFecha.set(a.fecha, [...(porFecha.get(a.fecha) ?? []), a.application_id]);
  return [...porFecha.keys()].sort().slice(0, n).map((fecha) => ({ fecha, ids: porFecha.get(fecha) ?? [] }));
}

// ============================================================================================= el asistente

export interface EstadoAsistente {
  paso: PasoPlan;
  /** null = el valor recordado (preferencias). */
  capacidad: number | null;
  dias: number[] | null;
  modoDesde: ModoDesde | null;
  desde: C.FechaLocal | null;
  modoRehacer: ModoRehacer;
  orden: OrdenPlan | null;
  quitadas: string[];
  /** «¿Qué hacemos con las {n} que quitaste?» está a la vista (paso 2). */
  preguntarQuitadas: boolean;
}

export const ESTADO_INICIAL: EstadoAsistente = {
  paso: 1,
  capacidad: null,
  dias: null,
  modoDesde: null,
  desde: null,
  modoRehacer: 'sin_fecha',
  orden: null,
  quitadas: [],
  preguntarQuitadas: false,
};

export type AccionAsistente =
  | { tipo: 'capacidad'; valor: number }
  | { tipo: 'dias'; valor: number[] }
  | { tipo: 'desde'; modo: ModoDesde; fecha: C.FechaLocal | null }
  | { tipo: 'rehacer'; modo: ModoRehacer }
  | { tipo: 'orden'; valor: OrdenPlan }
  | { tipo: 'incluir'; ids: string[]; incluir: boolean }
  | { tipo: 'siguiente' }
  | { tipo: 'atras' }
  /** «Dejarlas para después»: siguen en Pendientes sin fecha y se pasa a revisar. */
  | { tipo: 'dejarDespues' }
  | { tipo: 'ir'; paso: PasoPlan };

export function reducirAsistente(e: EstadoAsistente, a: AccionAsistente): EstadoAsistente {
  switch (a.tipo) {
    case 'capacidad':
      return { ...e, capacidad: Math.max(1, Math.min(10, Math.round(a.valor))) };
    case 'dias':
      return { ...e, dias: [...new Set(a.valor)].filter((d) => d >= 0 && d <= 6).sort((x, y) => x - y) };
    case 'desde':
      return { ...e, modoDesde: a.modo, desde: a.fecha };
    case 'rehacer':
      return { ...e, modoRehacer: a.modo };
    case 'orden':
      return { ...e, orden: a.valor };
    case 'incluir': {
      const s = new Set(e.quitadas);
      for (const id of a.ids) {
        if (a.incluir) s.delete(id);
        else s.add(id);
      }
      return { ...e, quitadas: [...s], preguntarQuitadas: false };
    }
    case 'siguiente':
      if (e.paso === 1) return { ...e, paso: 2 };
      if (e.paso === 2) {
        // Si quitó alguna, primero la pregunta de 01 §4.5 («¿Qué hacemos con las {n} que quitaste?»).
        if (e.quitadas.length > 0 && !e.preguntarQuitadas) return { ...e, preguntarQuitadas: true };
        return { ...e, paso: 3, preguntarQuitadas: false };
      }
      return e;
    case 'dejarDespues':
      return e.paso === 2 ? { ...e, paso: 3, preguntarQuitadas: false } : e;
    case 'atras':
      return { ...e, paso: e.paso === 3 ? 2 : 1, preguntarQuitadas: false };
    case 'ir':
      return a.paso < e.paso ? { ...e, paso: a.paso, preguntarQuitadas: false } : e;
  }
}

/** Desde efectivo: lo elegido o, por omisión, dominio.desdePorOmision («Hoy» antes de las 6 p. m.; si no, mañana). */
export function desdeEfectivo(e: Pick<EstadoAsistente, 'modoDesde' | 'desde'>, hoy: C.FechaLocal, omision: C.FechaLocal): C.FechaLocal {
  if (e.modoDesde === 'hoy') return hoy;
  if (e.modoDesde === 'manana') return sumarDias(hoy, 1);
  if (e.modoDesde === 'otra' && e.desde !== null) return e.desde < hoy ? hoy : e.desde;
  return omision;
}

/** Valor del segmentado «¿Desde cuándo?» para el desde efectivo. */
export function modoDeDesde(e: Pick<EstadoAsistente, 'modoDesde'>, desde: C.FechaLocal, hoy: C.FechaLocal): ModoDesde {
  if (e.modoDesde === 'otra') return 'otra';
  if (desde === hoy) return 'hoy';
  if (desde === sumarDias(hoy, 1)) return 'manana';
  return 'otra';
}

/** Por qué el plan no tiene nada que repartir: sin días de videos, todas ya tienen día («Solo las que no tienen fecha»)
 *  o se quitaron todas. */
export type MotivoVacio = 'sin_dias' | 'todas_con_fecha' | 'sin_incluidas';

export function motivoVacio(dias: readonly number[], modo: ModoRehacer, candidatas: readonly C.MuestraVista[], incluidas: number): MotivoVacio | null {
  if (dias.length === 0) return 'sin_dias';
  if (incluidas > 0) return null;
  if (modo === 'sin_fecha' && candidatas.length > 0 && candidatas.every((m) => m.avance.fecha_planeada !== null)) return 'todas_con_fecha';
  return 'sin_incluidas';
}

/** Al abrir «Rehacer mi plan» sin ninguna candidata sin fecha, la opción útil es «Repartir todo de nuevo». */
export function modoRehacerInicial(candidatas: readonly C.MuestraVista[]): ModoRehacer {
  return candidatas.length > 0 && candidatas.every((m) => m.avance.fecha_planeada !== null) ? 'todo' : 'sin_fecha';
}

/** Se puede pasar del paso actual: con días de videos (paso 1) y con al menos una incluida (paso 2). */
export function puedeSeguir(e: EstadoAsistente, dias: readonly number[], incluidas: number): boolean {
  if (e.paso === 1) return dias.length > 0 && incluidas > 0;
  if (e.paso === 2) return incluidas > 0;
  return incluidas > 0;
}

/** Cambios de preferencias que se recuerdan al crear (ritmo de 01 §4.5): solo lo que cambió. */
export function cambiosRitmo(
  actual: { capacidad: number; dias: number[]; orden: OrdenPlan },
  elegido: { capacidad: number; dias: number[]; orden: OrdenPlan },
): Partial<Pick<C.PreferenciasSincronizadas, 'capacidad_videos_dia' | 'dias_videos' | 'orden_plan'>> {
  const salida: Partial<Pick<C.PreferenciasSincronizadas, 'capacidad_videos_dia' | 'dias_videos' | 'orden_plan'>> = {};
  if (elegido.capacidad !== actual.capacidad) salida.capacidad_videos_dia = elegido.capacidad;
  if ([...elegido.dias].sort().join(',') !== [...actual.dias].sort().join(',')) salida.dias_videos = [...elegido.dias].sort((a, b) => a - b);
  if (elegido.orden !== actual.orden) salida.orden_plan = elegido.orden;
  return salida;
}
