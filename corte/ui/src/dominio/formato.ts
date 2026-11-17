/* @/dominio · formato es-MX (01_ux §1.5, 02 §4.3). Dinero en centavos enteros; signo menos tipográfico (U+2212);
   «≈» para aproximados; fechas siempre en UTC−6 fijo (nunca la zona del equipo). */
import type * as C from '@/contrato';
import { ahoraS, diaSemana, diasEntre, fechaLocalDe, hoyLocal, horaLocal, partesFecha } from './fechas';

export const MENOS = '−';
export const APROX = '≈';
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const;
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] as const;
const DIAS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'] as const;
const DIAS_LARGOS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

const nfEntero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const nfDos = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nfUno = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nfHastaUno = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
const nfHastaDos = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const nfLibre = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 });

/** Antepone el menos tipográfico solo si la cifra mostrada no es cero ("−$0" no existe). */
function conSigno(negativo: boolean, texto: string): string {
  return negativo && /[1-9]/.test(texto) ? `${MENOS}${texto}` : texto;
}

function aFecha(f: C.FechaLocal | C.EpochS): C.FechaLocal {
  return typeof f === 'number' ? fechaLocalDe(f) : f;
}

function esOtroAnio(anio: number): boolean {
  return anio !== partesFecha(hoyLocal())[0];
}

function mesCorto(m: number): string {
  return MESES[m - 1] ?? '';
}

function dinero(centavos: C.Centavos, opciones?: { decimales?: boolean }): string {
  const pesos = Math.abs(centavos) / 100;
  const cifra = opciones?.decimales === true ? nfDos.format(pesos) : nfEntero.format(pesos);
  return conSigno(centavos < 0, `$${cifra}`);
}

function numero(n: number): string {
  return conSigno(n < 0, nfLibre.format(Math.abs(n)));
}

function fechaCorta(f: C.FechaLocal | C.EpochS): string {
  const [a, m, d] = partesFecha(aFecha(f));
  const base = `${d} ${mesCorto(m)}`;
  return esOtroAnio(a) ? `${base} ${a}` : base;
}

function fechaConDia(f: C.FechaLocal | C.EpochS): string {
  const fecha = aFecha(f);
  const [a, m, d] = partesFecha(fecha);
  const base = `${DIAS[diaSemana(fecha)] ?? ''} ${d} ${mesCorto(m)}`;
  return esOtroAnio(a) ? `${base} ${a}` : base;
}

function fechaLarga(f: C.FechaLocal | C.EpochS): string {
  const fecha = aFecha(f);
  const [a, m, d] = partesFecha(fecha);
  const base = `${DIAS_LARGOS[diaSemana(fecha)] ?? ''} ${d} de ${MESES_LARGOS[m - 1] ?? ''}`;
  return esOtroAnio(a) ? `${base} de ${a}` : base;
}

/**
 * Relativa (01_ux §1.5): con hora cerca del instante ('hace unos segundos', 'hace 4 min', 'hace 2 h', 'en 20 min') y,
 * después, por días de calendario: 'hoy', 'ayer', 'mañana', 'hace 3 días', 'en 2 días' (hasta 7); más lejos, fechaCorta.
 */
function relativa(t: C.EpochS, ahora: C.EpochS = ahoraS()): string {
  const diferencia = ahora - t;
  const abs = Math.abs(diferencia);
  const pasado = diferencia >= 0;
  if (abs < 60) return pasado ? 'hace unos segundos' : 'en unos segundos';
  if (abs < 3600) {
    const n = Math.floor(abs / 60);
    return pasado ? `hace ${n} min` : `en ${n} min`;
  }
  if (abs < 6 * 3600) {
    const n = Math.floor(abs / 3600);
    return pasado ? `hace ${n} h` : `en ${n} h`;
  }
  const dias = diasEntre(fechaLocalDe(t), fechaLocalDe(ahora));
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias === -1) return 'mañana';
  if (dias > 1 && dias <= 7) return `hace ${dias} días`;
  if (dias < -1 && dias >= -7) return `en ${-dias} días`;
  return fechaCorta(t);
}

export const formato = {
  /** $12,345 (sin decimales) · con decimales: $12.34 · signo: −$1,234 con menos tipográfico. */
  dinero,
  /** '≈ $1,234'. */
  dineroAprox(centavos: C.Centavos): string {
    return `${APROX} ${dinero(centavos)}`;
  },
  /** '$14 – $131' o '$14' si son iguales; '—' si ambos null. */
  rangoDinero(min: C.Centavos | null, max: C.Centavos | null, opciones?: { decimales?: boolean; aprox?: boolean }): string {
    const a = min ?? max;
    const b = max ?? min;
    if (a === null || b === null) return '—';
    const op = opciones?.decimales === true ? { decimales: true } : {};
    const ta = dinero(Math.min(a, b), op);
    const tb = dinero(Math.max(a, b), op);
    const texto = ta === tb ? ta : `${ta} – ${tb}`;
    return opciones?.aprox === true ? `${APROX} ${texto}` : texto;
  },
  /** 'desde ≈ $1,234' (suma aproximada con rangos). */
  desdeAprox(centavos: C.Centavos): string {
    return `desde ${APROX} ${dinero(centavos)}`;
  },
  /** '1,234'. */
  numero,
  /** 0..1 → '42 %' (0 decimales) o '42.5 %'. */
  porcentaje(p: number, decimales: 0 | 1 = 0): string {
    const valor = Math.abs(p) * 100;
    const cifra = decimales === 1 ? nfUno.format(valor) : nfEntero.format(valor);
    return `${conSigno(p < 0, cifra)} %`;
  },
  /** 800 → '8 %' · 850 → '8.5 %'. */
  tasaBp(bp: C.PuntosBase): string {
    return `${conSigno(bp < 0, nfHastaDos.format(Math.abs(bp) / 100))} %`;
  },
  /** '12 nov' · otro año: '28 dic 2025'. */
  fechaCorta,
  /** 'jue 12 nov'. */
  fechaConDia,
  /** 'viernes 20 de noviembre' (mensajes a tiendas). */
  fechaLarga,
  relativa,
  /** '6:30 p. m.'. */
  hora(t: C.EpochS): string {
    const { h, m } = horaLocal(t);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
  },
  /** Eje Y: 0 · '$5 mil' · '$10 mil' · '$1.2 M' (02 §4.3, sin "$0"). */
  ejeDinero(centavos: C.Centavos): string {
    const pesos = Math.abs(centavos) / 100;
    if (pesos === 0) return '0';
    let texto: string;
    if (pesos >= 1_000_000) texto = `$${nfHastaUno.format(pesos / 1_000_000)} M`;
    else if (pesos >= 1000) texto = `$${nfHastaUno.format(pesos / 1000)} mil`;
    else texto = `$${nfEntero.format(pesos)}`;
    return conSigno(centavos < 0, texto);
  },
  /** '7677…3012'. */
  idCorto(id: string): string {
    return id.length > 10 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id;
  },
  /** 'hace 69 días' desde solicitada_at (nunca "días de atraso"). Sin fecha: '—'. */
  haceDias(t: C.EpochS | null, ahora: C.EpochS = ahoraS()): string {
    if (t === null) return '—';
    const dias = diasEntre(fechaLocalDe(t), hoyLocal(ahora));
    if (dias <= 0) return 'hoy';
    if (dias === 1) return 'hace 1 día';
    return `hace ${numero(dias)} días`;
  },
};
