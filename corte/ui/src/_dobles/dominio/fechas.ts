/* __DOBLE_CORTE__ · doble de @/dominio: reloj y fechas en hora de México centro = UTC−6 FIJO (implementación real).
   Nunca se usa la zona del dispositivo: todo se calcula desplazando el epoch y leyendo en UTC. */
import type * as C from '@/contrato';

export const TZ_OFFSET_S = -21600;
const DIA_MS = 86_400_000;

let relojFijo: (() => C.EpochS) | null = null;

/** Reloj de la app (epoch s). En pruebas: fijarReloj(() => 1794500100). */
export function ahoraS(): C.EpochS {
  return relojFijo ? relojFijo() : Math.floor(Date.now() / 1000);
}

export function fijarReloj(fn: (() => C.EpochS) | null): void {
  relojFijo = fn;
}

export function partesFecha(fecha: C.FechaLocal): [number, number, number] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!m) throw new RangeError(`Fecha local inválida: ${fecha}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function msUtcDe(fecha: C.FechaLocal): number {
  const [a, m, d] = partesFecha(fecha);
  return Date.UTC(a, m - 1, d);
}

function fechaDeMsUtc(ms: number): C.FechaLocal {
  return new Date(ms).toISOString().slice(0, 10);
}

export function fechaLocalDe(t: C.EpochS): C.FechaLocal {
  return fechaDeMsUtc((Math.floor(t) + TZ_OFFSET_S) * 1000);
}

export function hoyLocal(ahora: C.EpochS = ahoraS()): C.FechaLocal {
  return fechaLocalDe(ahora);
}

export function sumarDias(fecha: C.FechaLocal, dias: number): C.FechaLocal {
  return fechaDeMsUtc(msUtcDe(fecha) + Math.trunc(dias) * DIA_MS);
}

/** b − a en días de calendario. */
export function diasEntre(a: C.FechaLocal, b: C.FechaLocal): number {
  return Math.round((msUtcDe(b) - msUtcDe(a)) / DIA_MS);
}

/** 0 = lunes … 6 = domingo. */
export function diaSemana(fecha: C.FechaLocal): number {
  return (new Date(msUtcDe(fecha)).getUTCDay() + 6) % 7;
}

export function horaLocal(t: C.EpochS): { h: number; m: number } {
  const s = (((Math.floor(t) + TZ_OFFSET_S) % 86_400) + 86_400) % 86_400;
  return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60) };
}

/** Epoch del inicio (00:00 local) de una fecha, o de la hora indicada. */
export function epochDeFecha(fecha: C.FechaLocal, hora: number = 0, minuto: number = 0): C.EpochS {
  return msUtcDe(fecha) / 1000 + hora * 3600 + minuto * 60 - TZ_OFFSET_S;
}

function primeroDeMes(anio: number, mes: number): C.FechaLocal {
  return `${String(anio).padStart(4, '0')}-${String(mes).padStart(2, '0')}-01`;
}

/** Desde/hasta de un periodo ('7d','30d','90d','12m','todo','2026-10'); ventanas inclusivas de N días (01_ux §6.0).
 *  12m = 12 meses calendario incluyendo el actual (03 §6.2). 'todo' empieza en `primeraFecha` (o hoy). */
export function rangoDePeriodo(periodo: C.Periodo, hoy: C.FechaLocal, primeraFecha?: C.FechaLocal): { desde: C.FechaLocal; hasta: C.FechaLocal } {
  const dias = /^(\d+)d$/.exec(periodo);
  if (dias) {
    const n = Math.max(1, Number(dias[1]));
    return { desde: sumarDias(hoy, -(n - 1)), hasta: hoy };
  }
  if (periodo === '12m') {
    const [a, m] = partesFecha(hoy);
    const indice = a * 12 + (m - 1) - 11;
    return { desde: primeroDeMes(Math.floor(indice / 12), (indice % 12) + 1), hasta: hoy };
  }
  if (periodo === 'todo') {
    return { desde: primeraFecha !== undefined && primeraFecha <= hoy ? primeraFecha : hoy, hasta: hoy };
  }
  const mes = /^(\d{4})-(\d{1,2})$/.exec(periodo);
  if (mes) {
    const a = Number(mes[1]);
    const m = Number(mes[2]);
    const desde = primeroDeMes(a, m);
    const siguiente = m === 12 ? primeroDeMes(a + 1, 1) : primeroDeMes(a, m + 1);
    return { desde, hasta: sumarDias(siguiente, -1) };
  }
  return { desde: sumarDias(hoy, -29), hasta: hoy };
}
