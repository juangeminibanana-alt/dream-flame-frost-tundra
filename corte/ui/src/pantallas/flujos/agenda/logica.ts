/**
 * Agenda (01 §4.4) · lógica sin React: semana y mes en hora de México (lunes a domingo), qué muestra va en qué día,
 * la capacidad «2/3» de cada día (en rojo si se excede), los días sin videos, las atrasadas y las ops de
 * «Mover a hoy» y «Repartir en los próximos días» (dominio.armarPlan: respeta capacidad y promesas).
 */
import type * as C from '@/contrato';
import { armarPlan, diaSemana, formato, opCambioEtapa, sumarDias, type OperacionPlan, type ResultadoPlan } from '@/dominio';
import { capitalizar } from '../util';
import { entradaPlan, type OrdenPlan } from '../plan/logica';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] as const;
/** Etapas que ocupan lugar en un día (la capacidad las cuenta). */
const OCUPAN: ReadonlySet<C.EtapaAvance> = new Set<C.EtapaAvance>(['planeada', 'video_listo', 'programada']);

function dia(f: C.FechaLocal): number {
  return Number(f.slice(8, 10));
}
function mes(f: C.FechaLocal): string {
  return MESES[Number(f.slice(5, 7)) - 1] ?? '';
}
function anio(f: C.FechaLocal): string {
  return f.slice(0, 4);
}

// ============================================================================================= calendario

export function lunesDe(f: C.FechaLocal): C.FechaLocal {
  return sumarDias(f, -diaSemana(f));
}

export function diasDeSemana(lunes: C.FechaLocal): C.FechaLocal[] {
  return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}

/** «Semana del 9 al 15 de noviembre» · «Semana del 30 de noviembre al 6 de diciembre» · con año si cambia. */
export function textoSemana(lunes: C.FechaLocal): string {
  const domingo = sumarDias(lunes, 6);
  if (anio(lunes) !== anio(domingo)) return `Semana del ${dia(lunes)} de ${mes(lunes)} de ${anio(lunes)} al ${dia(domingo)} de ${mes(domingo)} de ${anio(domingo)}`;
  if (mes(lunes) !== mes(domingo)) return `Semana del ${dia(lunes)} de ${mes(lunes)} al ${dia(domingo)} de ${mes(domingo)}`;
  return `Semana del ${dia(lunes)} al ${dia(domingo)} de ${mes(lunes)}`;
}

/** «Noviembre de 2026». */
export function textoMes(f: C.FechaLocal): string {
  return capitalizar(`${mes(f)} de ${anio(f)}`);
}

export function primeroDelMes(f: C.FechaLocal): C.FechaLocal {
  return `${f.slice(0, 7)}-01`;
}

/** Semanas (lunes a domingo) que cubren el mes de `f`. */
export function semanasDelMes(f: C.FechaLocal): C.FechaLocal[][] {
  const primero = primeroDelMes(f);
  const clave = primero.slice(0, 7);
  const semanas: C.FechaLocal[][] = [];
  let lunes = lunesDe(primero);
  for (let i = 0; i < 6; i++, lunes = sumarDias(lunes, 7)) {
    const semana = diasDeSemana(lunes);
    if (!semana.some((d) => d.slice(0, 7) === clave)) break;
    semanas.push(semana);
  }
  return semanas;
}

/** Mes siguiente o anterior (primer día). */
export function moverMes(f: C.FechaLocal, delta: number): C.FechaLocal {
  const a = Number(f.slice(0, 4));
  const m = Number(f.slice(5, 7)) - 1 + delta;
  const anioNuevo = a + Math.floor(m / 12);
  const mesNuevo = ((m % 12) + 12) % 12;
  return `${anioNuevo}-${String(mesNuevo + 1).padStart(2, '0')}-01`;
}

/** «Hoy · jue 12 nov» · «Mañana · vie 13 nov» · «Sáb 14 nov». */
export function etiquetaDia(f: C.FechaLocal, hoy: C.FechaLocal): string {
  if (f === hoy) return `Hoy · ${formato.fechaConDia(f)}`;
  if (f === sumarDias(hoy, 1)) return `Mañana · ${formato.fechaConDia(f)}`;
  return capitalizar(formato.fechaConDia(f));
}

// ============================================================================================= qué va en cada día

/** Va en la agenda: tiene día y no está por planear ni descartada. */
export function enAgenda(m: C.MuestraVista): boolean {
  return m.avance.fecha_planeada !== null && m.avance.etapa !== 'por_planear' && m.avance.etapa !== 'no_se_puede';
}

function porCola(a: C.MuestraVista, b: C.MuestraVista): number {
  return (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER) || (a.application_id < b.application_id ? -1 : 1);
}

/** Muestras de cada día (en el orden de la cola). */
export function agruparPorDia(items: readonly C.MuestraVista[]): Map<C.FechaLocal, C.MuestraVista[]> {
  const salida = new Map<C.FechaLocal, C.MuestraVista[]>();
  for (const m of [...items].filter(enAgenda).sort(porCola)) {
    const f = m.avance.fecha_planeada;
    if (f === null) continue;
    salida.set(f, [...(salida.get(f) ?? []), m]);
  }
  return salida;
}

export interface OcupacionDia {
  usados: number;
  capacidad: number;
  /** Ese día se hacen videos (preferencias). */
  trabaja: boolean;
  /** «4/3»: se pasó de la capacidad (en rojo). */
  excedido: boolean;
}

export function ocupacionDia(fecha: C.FechaLocal, lista: readonly C.MuestraVista[] | undefined, capacidad: number, dias: readonly number[]): OcupacionDia {
  const usados = (lista ?? []).filter((m) => OCUPAN.has(m.avance.etapa)).length;
  return { usados, capacidad, trabaja: dias.includes(diaSemana(fecha)), excedido: usados > capacidad };
}

/** «Sin fecha»: pendientes por planear, en el orden de la cola. */
export function sinFecha(pendientes: readonly C.MuestraVista[]): C.MuestraVista[] {
  return pendientes.filter((m) => m.avance.etapa === 'por_planear' || (m.avance.etapa === 'planeada' && m.avance.fecha_planeada === null)).sort(porCola);
}

/** Atrasadas: planeadas para un día que ya pasó y sin avanzar (01 §4.4). */
export function atrasadas(pendientes: readonly C.MuestraVista[], hoy: C.FechaLocal): C.MuestraVista[] {
  return pendientes.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada !== null && m.avance.fecha_planeada < hoy).sort(porCola);
}

/** Solo se arrastra lo que aún no tiene el video hecho (mover una «video listo» la regresaría a planeada). */
export function sePuedeMover(m: C.MuestraVista): boolean {
  return m.avance.etapa === 'planeada' || m.avance.etapa === 'por_planear';
}

/** Destino de soltar una tarjeta: nada que hacer, quitar la fecha, preguntar por un día sin videos o planear. */
export type DecisionSoltar =
  | { tipo: 'nada' }
  | { tipo: 'quitar_fecha' }
  | { tipo: 'confirmar_dia'; fecha: C.FechaLocal }
  | { tipo: 'planear'; fecha: C.FechaLocal };

/** `hoy`: un día que ya pasó no recibe tarjetas (se volvería atrasada al soltarla). */
export function decidirSoltar(m: C.MuestraVista, destino: C.FechaLocal | 'sin_fecha', dias: readonly number[], hoy: C.FechaLocal): DecisionSoltar {
  if (!sePuedeMover(m)) return { tipo: 'nada' };
  if (destino === 'sin_fecha') return m.avance.fecha_planeada === null ? { tipo: 'nada' } : { tipo: 'quitar_fecha' };
  if (destino === m.avance.fecha_planeada || destino < hoy) return { tipo: 'nada' };
  if (!dias.includes(diaSemana(destino))) return { tipo: 'confirmar_dia', fecha: destino };
  return { tipo: 'planear', fecha: destino };
}

// ============================================================================================= atrasadas

/** «Mover a hoy»: todas a hoy (decisión explícita, aunque pase la capacidad). */
export function opsMoverAHoy(lista: readonly C.MuestraVista[], hoy: C.FechaLocal): OperacionPlan[] {
  return lista.map((m) => opCambioEtapa(m, 'planeada', { fecha_plan: hoy }, hoy));
}

/** «Repartir en los próximos días»: las atrasadas desde hoy con dominio.armarPlan (capacidad, días y promesas). */
export function repartirAtrasadas(e: {
  pendientes: C.MuestraVista[];
  lista: C.MuestraVista[];
  capacidad: number;
  dias: number[];
  orden: OrdenPlan;
  planes: C.PlanVideo[];
  hoy: C.FechaLocal;
}): ResultadoPlan {
  return armarPlan(entradaPlan({
    pendientes: e.pendientes,
    incluidas: e.lista.map((m) => m.application_id),
    capacidad: e.capacidad,
    dias: e.dias,
    desde: e.hoy,
    respetarFechas: false,
    orden: e.orden,
    planes: e.planes,
    hoy: e.hoy,
  }));
}
