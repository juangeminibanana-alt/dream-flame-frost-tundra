/* __DOBLE_CORTE__ · doble de @/dominio: formato es-MX (01_ux §1.5, 02 §4.3), implementación real.
   Dinero en centavos enteros; signo menos tipográfico (U+2212); fechas en UTC−6 fijo. */
import type * as C from '@/contrato';
import { ahoraS, diaSemana, diasEntre, fechaLocalDe, hoyLocal, horaLocal, partesFecha } from './fechas';

const MENOS = '−';
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

function conSigno(negativo: boolean, texto: string): string {
  return negativo && /[1-9]/.test(texto) ? `${MENOS}${texto}` : texto;
}

function aFecha(f: C.FechaLocal | C.EpochS): C.FechaLocal {
  return typeof f === 'number' ? fechaLocalDe(f) : f;
}

function anioDe(f: C.FechaLocal): number {
  return partesFecha(f)[0];
}

function mesCorto(m: number): string {
  return MESES[m - 1] ?? '';
}

function dinero(centavos: C.Centavos, opciones?: { decimales?: boolean }): string {
  const pesos = Math.abs(centavos) / 100;
  const cifra = opciones?.decimales ? nfDos.format(pesos) : nfEntero.format(pesos);
  return conSigno(centavos < 0, `$${cifra}`);
}

function numero(n: number): string {
  return conSigno(n < 0, nfLibre.format(Math.abs(n)));
}

function fechaCorta(f: C.FechaLocal | C.EpochS): string {
  const fecha = aFecha(f);
  const [a, m, d] = partesFecha(fecha);
  const base = `${d} ${mesCorto(m)}`;
  return a === anioDe(hoyLocal()) ? base : `${base} ${a}`;
}

export const formato = {
  dinero,
  dineroAprox(centavos: C.Centavos): string {
    return `≈ ${dinero(centavos)}`;
  },
  rangoDinero(min: C.Centavos | null, max: C.Centavos | null, opciones?: { decimales?: boolean; aprox?: boolean }): string {
    const a = min ?? max;
    const b = max ?? min;
    if (a === null || b === null) return '—';
    const op = opciones?.decimales ? { decimales: true } : {};
    const ta = dinero(a, op);
    const tb = dinero(b, op);
    const texto = ta === tb ? ta : `${ta} – ${tb}`;
    return opciones?.aprox ? `≈ ${texto}` : texto;
  },
  desdeAprox(centavos: C.Centavos): string {
    return `desde ≈ ${dinero(centavos)}`;
  },
  numero,
  porcentaje(p: number, decimales: 0 | 1 = 0): string {
    const valor = Math.abs(p) * 100;
    const cifra = decimales === 1 ? nfUno.format(valor) : nfEntero.format(valor);
    return `${conSigno(p < 0, cifra)} %`;
  },
  tasaBp(bp: C.PuntosBase): string {
    return `${conSigno(bp < 0, nfHastaDos.format(Math.abs(bp) / 100))} %`;
  },
  fechaCorta,
  fechaConDia(f: C.FechaLocal | C.EpochS): string {
    const fecha = aFecha(f);
    const [a, m, d] = partesFecha(fecha);
    const base = `${DIAS[diaSemana(fecha)] ?? ''} ${d} ${mesCorto(m)}`;
    return a === anioDe(hoyLocal()) ? base : `${base} ${a}`;
  },
  fechaLarga(f: C.FechaLocal | C.EpochS): string {
    const fecha = aFecha(f);
    const [a, m, d] = partesFecha(fecha);
    const base = `${DIAS_LARGOS[diaSemana(fecha)] ?? ''} ${d} de ${MESES_LARGOS[m - 1] ?? ''}`;
    return a === anioDe(hoyLocal()) ? base : `${base} de ${a}`;
  },
  relativa(t: C.EpochS, ahora: C.EpochS = ahoraS()): string {
    const diferencia = ahora - t;
    if (diferencia >= 0 && diferencia < 60) return 'hace un momento';
    if (diferencia >= 60 && diferencia < 3600) return `hace ${Math.floor(diferencia / 60)} min`;
    const dias = diasEntre(fechaLocalDe(t), fechaLocalDe(ahora));
    if (dias === 0) return 'hoy';
    if (dias === 1) return 'ayer';
    if (dias === -1) return 'mañana';
    if (dias > 1 && dias <= 7) return `hace ${dias} días`;
    if (dias < -1 && dias >= -7) return `en ${-dias} días`;
    return fechaCorta(t);
  },
  hora(t: C.EpochS): string {
    const { h, m } = horaLocal(t);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`;
  },
  ejeDinero(centavos: C.Centavos): string {
    const pesos = Math.abs(centavos) / 100;
    if (pesos === 0) return '0';
    let texto: string;
    if (pesos >= 1_000_000) texto = `$${nfHastaUno.format(pesos / 1_000_000)} M`;
    else if (pesos >= 1000) texto = `$${nfHastaUno.format(pesos / 1000)} mil`;
    else texto = `$${nfEntero.format(pesos)}`;
    return conSigno(centavos < 0, texto);
  },
  idCorto(id: string): string {
    return id.length > 10 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id;
  },
  haceDias(t: C.EpochS | null, ahora: C.EpochS = ahoraS()): string {
    if (t === null) return '—';
    const dias = diasEntre(fechaLocalDe(t), hoyLocal(ahora));
    if (dias <= 0) return 'hoy';
    if (dias === 1) return 'hace 1 día';
    return `hace ${numero(dias)} días`;
  },
};
