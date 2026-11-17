/**
 * Ventas · lógica de presentación pura (01_ux §4.11, §6.3; 02 §9). Sin React ni DOM: periodos, los KPI con sus
 * variaciones (V14; Liquidada y Por liquidar sin comparación; la tasa en puntos), los puntos y la tabla gemela de cada
 * gráfica, «¿Dónde está tu dinero?», «De quién depende tu comisión», «Por mes», filtros de pedidos y el detalle de una
 * línea. Todas las cifras salen de las respuestas del hub (o de la copia).
 */
import type * as C from '@/contrato';
import type { BarraApiladaProps, PuntoGrafica, SerieApilada, TablaGemela } from '@/componentes';
import { ETIQUETA_ESTADO_ORDEN, diaSemana, etiquetaContenido, fechaLocalDe, formato, nombreCorto, sumarDias } from '@/dominio';
import { T } from './textos';

// ---------------------------------------------------------------------------------------------- periodos

export const PERIODOS_FIJOS = ['7d', '30d', '90d', '12m', 'todo'] as const;
export type PeriodoFijo = (typeof PERIODOS_FIJOS)[number];
export const PERIODO_POR_OMISION: PeriodoFijo = '30d';

export function esPeriodoFijo(v: string | null | undefined): v is PeriodoFijo {
  return v !== null && v !== undefined && (PERIODOS_FIJOS as readonly string[]).includes(v);
}

/** '7d' · '30d' · '90d' · '12m' · 'todo' · 'YYYY-MM' (01 §4.11: «Este mes», «Mes pasado»). */
export function esPeriodo(v: string | null | undefined): v is C.Periodo {
  if (esPeriodoFijo(v)) return true;
  if (!v) return false;
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  return !!m && Number(m[2]) >= 1 && Number(m[2]) <= 12;
}

/** Mes 'YYYY-MM' de una fecha y el anterior. */
export function mesesRapidos(hoy: C.FechaLocal): { esteMes: C.Periodo; mesPasado: C.Periodo } {
  const esteMes = hoy.slice(0, 7) as `${number}-${number}`;
  const anterior = sumarDias(`${esteMes}-01`, -1).slice(0, 7) as `${number}-${number}`;
  return { esteMes, mesPasado: anterior };
}

/** 'feb' · 'feb 2025' (otro año) · largo: 'feb 2026'. */
export function etiquetaMes(clave: string, largo = false): string {
  const corto = formato.fechaCorta(`${clave.slice(0, 7)}-01`).replace(/^1 /, '');
  return largo && !/\d{4}$/.test(corto) ? `${corto} ${clave.slice(0, 4)}` : corto;
}

/** Nombre del periodo para el encabezado y la banda: 'Últimos 30 días' · 'nov 2026'. */
export function nombrePeriodo(p: C.Periodo): string {
  if (esPeriodoFijo(p)) return T.periodo.largo[p];
  return etiquetaMes(p, true);
}

/** 'vs. 30 días anteriores' (texto de la variación). */
export function textoVs(p: C.Periodo): string {
  if (p === '7d' || p === '30d' || p === '90d') return T.periodo.vs[p];
  if (!esPeriodoFijo(p)) return T.periodo.vs.mes;
  return T.periodo.vs.otro;
}

/** '14 oct – 12 nov' (rango real que respondió el hub). */
export function textoRango(periodo: Pick<C.DashboardResponse['periodo'], 'desde' | 'hasta'>): string {
  return periodo.desde === periodo.hasta ? formato.fechaCorta(periodo.desde) : `${formato.fechaCorta(periodo.desde)} – ${formato.fechaCorta(periodo.hasta)}`;
}

/** Fecha del hub («hoy» con que calculó la respuesta): marca el periodo en curso sin depender del reloj del equipo. */
export function hoyDelHub(d: Pick<C.DashboardResponse, 'generado_at'>): C.FechaLocal {
  return fechaLocalDe(d.generado_at);
}

/** Días del rango, inclusivo: 14 oct – 12 nov = 30. */
export function diasDelRango(desde: C.FechaLocal, hasta: C.FechaLocal): number {
  return Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 86_400_000) + 1;
}

/** Agrupar por (01 §4.11): Día ≤ 31 días · Semana ≤ 180 · Mes > 180. */
export function granularidadAuto(desde: C.FechaLocal, hasta: C.FechaLocal): C.Granularidad {
  const dias = diasDelRango(desde, hasta);
  if (dias <= 31) return 'dia';
  if (dias <= 180) return 'semana';
  return 'mes';
}

/** Granularidades que tienen sentido para el rango (sin cientos de barras diarias). */
export function granularidadesPermitidas(desde: C.FechaLocal, hasta: C.FechaLocal): C.Granularidad[] {
  const dias = Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 86_400_000) + 1;
  const lista: C.Granularidad[] = [];
  if (dias <= 92) lista.push('dia');
  if (dias >= 14 && dias <= 400) lista.push('semana');
  if (dias >= 45) lista.push('mes');
  return lista.length > 0 ? lista : ['dia'];
}

// ---------------------------------------------------------------------------------------------- KPI

export interface Variacion {
  texto: string;
  sentido: 'favorable' | 'desfavorable' | 'neutro';
  direccion: 'sube' | 'baja' | 'igual';
}

/**
 * V14: (actual − anterior) ÷ anterior; anterior 0 → «Nuevo»; `menosEsMejor` invierte el color. Con `vs` = null
 * (celular) solo la cifra, '21 %': el interruptor «Comparar con el periodo anterior» está justo arriba.
 */
export function variacion(actual: number, anterior: number | null | undefined, vs: string | null, menosEsMejor = false): Variacion | null {
  if (anterior === null || anterior === undefined) return null;
  if (anterior === 0) return actual > 0 ? { texto: T.kpi.nuevo, sentido: menosEsMejor ? 'desfavorable' : 'favorable', direccion: 'sube' } : null;
  const cambio = (actual - anterior) / anterior;
  const direccion: Variacion['direccion'] = Math.abs(cambio) < 0.005 ? 'igual' : cambio > 0 ? 'sube' : 'baja';
  const sentido: Variacion['sentido'] = direccion === 'igual' ? 'neutro' : (direccion === 'baja') === menosEsMejor ? 'favorable' : 'desfavorable';
  const cifra = formato.porcentaje(Math.abs(cambio));
  return { texto: vs === null ? cifra : `${cifra} vs. ${vs}`, sentido, direccion };
}

/** La tasa de reembolso varía en puntos porcentuales: '2.4 pts vs. 30 días anteriores' (bajar es bueno). */
export function variacionPts(actual: number, anterior: number | null | undefined, vs: string | null): Variacion | null {
  if (anterior === null || anterior === undefined) return null;
  // 0 % contra 0 % (periodos sin pedidos): no hay nada que comparar.
  if (actual === 0 && anterior === 0) return null;
  const pts = Math.round((actual - anterior) * 1000) / 10;
  const direccion: Variacion['direccion'] = Math.abs(pts) < 0.05 ? 'igual' : pts > 0 ? 'sube' : 'baja';
  const sentido: Variacion['sentido'] = direccion === 'igual' ? 'neutro' : direccion === 'baja' ? 'favorable' : 'desfavorable';
  const cifra = T.kpi.pts(formato.numero(Math.abs(pts)));
  return { texto: vs === null ? cifra : `${cifra} vs. ${vs}`, sentido, direccion };
}

/** Comisión total = liquidada + por liquidar + retenida (Kpis.comision_total_centavos, «número principal»). */
export function totalComision(k: C.Kpis): C.Centavos {
  return k.comision_liquidada_centavos + k.comision_por_liquidar_centavos + k.comision_retenida_centavos;
}

export interface KpiVentas {
  id: 'comision' | 'liquidada' | 'por_liquidar' | 'congelada' | 'perdida' | 'pedidos' | 'tasa' | 'unidades' | 'ventas';
  etiqueta: string;
  valor: string;
  variacion: Variacion | null;
  nota: string | null;
}

/**
 * Los 8 KPI de 01 §4.11 (+ «Congelada» si hay comisión en revisión, V5). `compacto` (celular): variaciones cortas
 * («▼ 21 %»). La tasa lleva «48 pedidos» salvo en Windows con comparación, donde «▼ 2.4 pts vs. 30 días anteriores ·
 * 48 pedidos» se partía en dos renglones y desalineaba la banda: los pedidos reembolsados se leen en «Reembolsos».
 */
export function kpisVentas(d: C.DashboardResponse, comparar: boolean, compacto = false): KpiVentas[] {
  const k = d.kpis;
  const a = comparar ? d.kpis_anterior : null;
  const vs = compacto ? null : textoVs(d.periodo.clave);
  const tasa = variacionPts(k.tasa_reembolso, a?.tasa_reembolso, vs);
  const lista: KpiVentas[] = [
    { id: 'comision', etiqueta: T.kpi.comision, valor: formato.dinero(k.comision_total_centavos), variacion: variacion(k.comision_total_centavos, a?.comision_total_centavos, vs), nota: a ? null : T.kpi.sinReembolsos },
    { id: 'liquidada', etiqueta: T.kpi.liquidada, valor: formato.dinero(k.comision_liquidada_centavos), variacion: null, nota: T.kpi.deEstePeriodo },
    { id: 'por_liquidar', etiqueta: T.kpi.porLiquidar, valor: formato.dinero(k.comision_por_liquidar_centavos), variacion: null, nota: T.kpi.deEstePeriodo },
    { id: 'perdida', etiqueta: T.kpi.perdida, valor: formato.dinero(k.comision_perdida_reembolsos_centavos), variacion: variacion(k.comision_perdida_reembolsos_centavos, a?.comision_perdida_reembolsos_centavos, vs, true), nota: null },
    { id: 'pedidos', etiqueta: T.kpi.pedidos, valor: formato.numero(k.pedidos), variacion: variacion(k.pedidos, a?.pedidos, vs), nota: null },
    {
      id: 'tasa',
      etiqueta: T.kpi.tasa,
      valor: formato.porcentaje(k.tasa_reembolso, 1),
      variacion: tasa,
      nota: tasa && !compacto ? null : T.kpi.pedidosReembolsados(k.pedidos_reembolsados, formato.numero(k.pedidos_reembolsados)),
    },
    { id: 'unidades', etiqueta: T.kpi.unidades, valor: formato.numero(k.unidades), variacion: variacion(k.unidades, a?.unidades, vs), nota: null },
    { id: 'ventas', etiqueta: T.kpi.ventas, valor: formato.dineroAprox(k.ventas_centavos), variacion: variacion(k.ventas_centavos, a?.ventas_centavos, vs), nota: a ? null : T.kpi.aprox },
  ];
  if (k.comision_retenida_centavos > 0) {
    lista.splice(3, 0, { id: 'congelada', etiqueta: T.kpi.congelada, valor: formato.dinero(k.comision_retenida_centavos), variacion: null, nota: T.kpi.enRevision });
  }
  return lista;
}

// ---------------------------------------------------------------------------------------------- serie

export type Metrica = 'comision' | 'pedidos' | 'unidades' | 'tasa';
export const METRICAS: readonly Metrica[] = ['comision', 'pedidos', 'unidades', 'tasa'];

export interface PuntoVentas {
  clave: string;
  /** Etiqueta del eje: '14 oct' · '10 ago' · 'feb'. */
  etiqueta: string;
  /** Para la lectura y la tabla: '14 oct' · 'Semana del 10 ago al 16 ago' · 'feb 2026'. */
  cuando: string;
  enCurso: boolean;
  liquidada: C.Centavos;
  porLiquidar: C.Centavos;
  estimada: C.Centavos;
  pedidos: number;
  reembolsados: number;
  unidades: number;
  /** 0..1 */
  tasa: number;
}

/** Periodo en curso (02 §9.4 regla 9): el que contiene la fecha del hub y todavía no termina. */
export function enCursoDe(clave: string, gran: C.Granularidad, hoyHub: C.FechaLocal): boolean {
  if (gran === 'dia') return clave === hoyHub;
  if (gran === 'semana') return clave <= hoyHub && sumarDias(clave, 6) > hoyHub;
  const mes = clave.slice(0, 7);
  if (mes !== hoyHub.slice(0, 7)) return false;
  return sumarDias(hoyHub, 1).slice(0, 7) === mes;
}

/**
 * Semanas (lunes a domingo, 01 §6.0) a partir de la serie diaria del tablero: todos los campos de PuntoSerie son
 * sumas, así que la semana es exacta y no hace falta otra consulta (en el celular sin la PC, la copia solo trae la
 * serie del tablero). La clave es el lunes, como la que manda el hub.
 */
export function agruparSemanas(puntos: readonly C.PuntoSerie[]): C.PuntoSerie[] {
  const semanas = new Map<string, C.PuntoSerie>();
  for (const p of puntos) {
    const lunes = sumarDias(p.clave, -diaSemana(p.clave));
    const s = semanas.get(lunes);
    if (s) {
      s.pedidos += p.pedidos;
      s.pedidos_reembolsados += p.pedidos_reembolsados;
      s.unidades += p.unidades;
      s.ventas_centavos += p.ventas_centavos;
      s.comision_estimada_centavos += p.comision_estimada_centavos;
      s.comision_liquidada_centavos += p.comision_liquidada_centavos;
    } else {
      semanas.set(lunes, { ...p, clave: lunes, etiqueta: formato.fechaCorta(lunes) });
    }
  }
  return [...semanas.values()].sort((a, b) => (a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0));
}

/**
 * Meses a partir de la serie diaria del tablero, con la misma clave que manda el hub ('2026-10'). Como en
 * agruparSemanas, todos los campos son sumas: el resultado es el mismo que GET /api/serie?granularidad=mes del mismo
 * rango (el primer mes trae solo los días del rango, igual que la serie del hub). Así «Por mes» y «Tasa de reembolso
 * por mes» funcionan en el celular sin la PC (la copia solo trae la serie del tablero) y no hace falta otra consulta.
 */
export function agruparMeses(puntos: readonly C.PuntoSerie[]): C.PuntoSerie[] {
  const meses = new Map<string, C.PuntoSerie>();
  for (const p of puntos) {
    const clave = p.clave.slice(0, 7);
    const m = meses.get(clave);
    if (m) {
      m.pedidos += p.pedidos;
      m.pedidos_reembolsados += p.pedidos_reembolsados;
      m.unidades += p.unidades;
      m.ventas_centavos += p.ventas_centavos;
      m.comision_estimada_centavos += p.comision_estimada_centavos;
      m.comision_liquidada_centavos += p.comision_liquidada_centavos;
    } else {
      meses.set(clave, { ...p, clave, etiqueta: etiquetaMes(clave) });
    }
  }
  return [...meses.values()].sort((a, b) => (a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0));
}

/**
 * `desde` = inicio del rango pedido: una semana que empezó antes (la del 12 oct en «Últimos 30 días», que arranca el
 * 14) se nombra desde ahí («Semana del 14 oct al 18 oct»), porque solo trae esos días.
 */
export function puntosSerie(puntos: readonly C.PuntoSerie[], gran: C.Granularidad, hoyHub: C.FechaLocal, desde?: C.FechaLocal): PuntoVentas[] {
  return puntos.map((p) => {
    const inicioSemana = desde && p.clave < desde ? desde : p.clave;
    // El eje dice lo mismo que la lectura y la nota: la primera semana parcial se rotula desde donde empieza el rango.
    const etiqueta = gran === 'mes' ? etiquetaMes(p.clave) : formato.fechaCorta(gran === 'semana' ? inicioSemana : p.clave);
    const cuando = gran === 'mes' ? etiquetaMes(p.clave, true) : gran === 'semana' ? T.grafica.semanaDel(formato.fechaCorta(inicioSemana), formato.fechaCorta(sumarDias(p.clave, 6))) : formato.fechaConDia(p.clave);
    return {
      clave: p.clave,
      etiqueta,
      cuando,
      enCurso: enCursoDe(p.clave, gran, hoyHub),
      liquidada: p.comision_liquidada_centavos,
      porLiquidar: Math.max(0, p.comision_estimada_centavos - p.comision_liquidada_centavos),
      estimada: p.comision_estimada_centavos,
      pedidos: p.pedidos,
      reembolsados: p.pedidos_reembolsados,
      unidades: p.unidades,
      tasa: p.pedidos > 0 ? p.pedidos_reembolsados / p.pedidos : 0,
    };
  });
}

function cuandoTabla(p: PuntoVentas): string {
  return p.enCurso ? T.grafica.enCurso(p.cuando) : p.cuando;
}

/** «Comisión por …»: Liquidada (sólido) + Por liquidar (mismo tono al 35 % con contorno), 02 §9.1. */
export function datosApiladas(puntos: readonly PuntoVentas[]): {
  series: SerieApilada[];
  puntos: { clave: string; etiqueta: string; valores: Record<string, number>; enCurso?: boolean; aria: string }[];
  tabla: TablaGemela;
} {
  return {
    series: [
      { id: 'liquidada', etiqueta: T.grafica.liquidada, estilo: 'solido', slot: 1 },
      { id: 'por_liquidar', etiqueta: T.grafica.porLiquidar, estilo: 'tenue', slot: 1 },
    ],
    puntos: puntos.map((p) => ({
      clave: p.clave,
      etiqueta: p.etiqueta,
      valores: { liquidada: p.liquidada, por_liquidar: p.porLiquidar },
      enCurso: p.enCurso,
      aria: T.grafica.aria(p.cuando, formato.dinero(p.estimada), formato.numero(p.pedidos), formato.numero(p.reembolsados), formato.porcentaje(p.tasa), p.enCurso),
    })),
    tabla: {
      columnas: [...T.grafica.columnas.comision],
      filas: puntos.map((p) => [cuandoTabla(p), formato.dinero(p.liquidada), formato.dinero(p.porLiquidar), formato.dinero(p.estimada), formato.numero(p.pedidos), formato.numero(p.reembolsados)]),
    },
  };
}

/** Pedidos · Unidades · Tasa de reembolso: UNA serie en --viz-mono (02 §9.4 catálogo). */
export function datosSimple(puntos: readonly PuntoVentas[], metrica: Exclude<Metrica, 'comision'>): { puntos: PuntoGrafica[]; tabla: TablaGemela; formatoEje: (v: number) => string } {
  const valor = (p: PuntoVentas): number => (metrica === 'pedidos' ? p.pedidos : metrica === 'unidades' ? p.unidades : Math.round(p.tasa * 1000) / 10);
  const texto = (p: PuntoVentas): string =>
    metrica === 'pedidos' ? `${formato.numero(p.pedidos)} pedidos` : metrica === 'unidades' ? `${formato.numero(p.unidades)} unidades` : `${formato.porcentaje(p.tasa, 1)} de reembolso`;
  const filas = puntos.map((p): string[] =>
    metrica === 'tasa' ? [cuandoTabla(p), formato.porcentaje(p.tasa, 1), formato.numero(p.reembolsados), formato.numero(p.pedidos)] : [cuandoTabla(p), formato.numero(valor(p))],
  );
  return {
    puntos: puntos.map((p) => ({ clave: p.clave, etiqueta: p.etiqueta, valor: valor(p), enCurso: p.enCurso, aria: T.grafica.ariaSimple(p.cuando, texto(p), p.enCurso) })),
    tabla: { columnas: [...T.grafica.columnas[metrica]], filas },
    formatoEje: metrica === 'tasa' ? (v) => `${formato.numero(Math.round(v))} %` : (v) => formato.numero(Math.round(v)),
  };
}

/** «Tu mejor semana del periodo: 2 mar – 8 mar ($1,234)» (V16, solo hechos; sin el periodo en curso). */
export function mejorPeriodo(puntos: readonly PuntoVentas[], gran: C.Granularidad, desde?: C.FechaLocal): string | null {
  const completos = puntos.filter((p) => !p.enCurso && p.estimada > 0);
  if (completos.length < 2) return null;
  const mejor = completos.reduce((a, b) => (b.estimada > a.estimada ? b : a));
  const inicio = desde && mejor.clave < desde ? desde : mejor.clave;
  const cuando = gran === 'semana' ? `${formato.fechaCorta(inicio)} – ${formato.fechaCorta(sumarDias(mejor.clave, 6))}` : mejor.cuando;
  return T.grafica.mejor(gran, cuando, formato.dinero(mejor.estimada));
}

// ---------------------------------------------------------------------------------------------- dinero y dependencia

type ParteBarra = BarraApiladaProps['partes'][number];

/** «¿Dónde está tu dinero?»: Liquidada · Por liquidar · (Congelada) · Perdida por reembolsos (rayado). */
export function partesDinero(k: C.Kpis): { partes: ParteBarra[]; tabla: TablaGemela; ayudas: Array<{ id: string; titulo: string; texto: string }> } {
  const partes: ParteBarra[] = [
    { id: 'liquidada', etiqueta: T.dinero.liquidada, valor: k.comision_liquidada_centavos, texto: formato.dinero(k.comision_liquidada_centavos), estilo: 'solido', slot: 1 },
    { id: 'por_liquidar', etiqueta: T.dinero.porLiquidar, valor: k.comision_por_liquidar_centavos, texto: formato.dinero(k.comision_por_liquidar_centavos), estilo: 'tenue', slot: 1 },
  ];
  if (k.comision_retenida_centavos > 0) {
    partes.push({ id: 'congelada', etiqueta: T.dinero.congelada, valor: k.comision_retenida_centavos, texto: formato.dinero(k.comision_retenida_centavos), estilo: 'neutro' });
  }
  partes.push({ id: 'perdida', etiqueta: T.dinero.perdida, valor: k.comision_perdida_reembolsos_centavos, texto: formato.dinero(k.comision_perdida_reembolsos_centavos), estilo: 'rayado' });
  const suma = partes.reduce((a, x) => a + Math.max(0, x.valor), 0);
  const ayudas = [
    { id: 'liquidada', titulo: T.dinero.liquidada, texto: T.dinero.ayudaLiquidada },
    { id: 'por_liquidar', titulo: T.dinero.porLiquidar, texto: T.dinero.ayudaPorLiquidar },
    ...(k.comision_retenida_centavos > 0 ? [{ id: 'congelada', titulo: T.dinero.congelada, texto: T.dinero.ayudaCongelada }] : []),
    { id: 'perdida', titulo: T.dinero.perdida, texto: T.dinero.ayudaPerdida },
  ];
  return {
    partes,
    tabla: { columnas: [...T.dinero.columnas], filas: partes.map((x) => [x.etiqueta, x.texto, formato.porcentaje(suma > 0 ? x.valor / suma : 0, 1)]) },
    ayudas,
  };
}

/** «De quién depende tu comisión»: las 5 tiendas con más comisión del periodo (slots 1–5) + «Otras» (neutro). */
export function partesDependencia(tiendas: readonly C.FilaTienda[], total: C.Centavos): { partes: ParteBarra[]; tabla: TablaGemela; principal: { nombre: string; pct: string; fraccion: number } | null } {
  const conVenta = [...tiendas].filter((t) => t.ventas.comision_estimada_centavos > 0).sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos);
  const top = conVenta.slice(0, 5);
  const suma = top.reduce((a, t) => a + t.ventas.comision_estimada_centavos, 0);
  const otras = Math.max(0, total - suma);
  const base = Math.max(total, suma);
  const slots = [1, 2, 3, 4, 5] as const;
  const partes: ParteBarra[] = top.map((t, i) => ({
    id: t.tienda_key,
    etiqueta: t.nombre,
    valor: t.ventas.comision_estimada_centavos,
    texto: formato.dinero(t.ventas.comision_estimada_centavos),
    estilo: 'solido',
    slot: slots[i] ?? 5,
  }));
  if (otras > 0) partes.push({ id: 'otras', etiqueta: T.dependencia.otras, valor: otras, texto: formato.dinero(otras), estilo: 'neutro' });
  const pct = (v: number): string => formato.porcentaje(base > 0 ? v / base : 0, 1);
  const primera = top[0];
  return {
    partes,
    tabla: { columnas: [...T.dependencia.columnas], filas: partes.map((x) => [x.etiqueta, x.texto, pct(x.valor)]) },
    principal: primera && base > 0 ? { nombre: primera.nombre, pct: formato.porcentaje(primera.ventas.comision_estimada_centavos / base), fraccion: primera.ventas.comision_estimada_centavos / base } : null,
  };
}

// ---------------------------------------------------------------------------------------------- reembolsos y por mes

export function puntosReembolsoMes(puntos: readonly PuntoVentas[]): { puntos: PuntoGrafica[]; tabla: TablaGemela } {
  return {
    puntos: puntos.map((p) => ({
      clave: p.clave,
      etiqueta: p.etiqueta,
      valor: Math.round(p.tasa * 1000) / 10,
      enCurso: p.enCurso,
      aria: T.reembolsos.aria(p.cuando, formato.porcentaje(p.tasa, 1), formato.numero(p.reembolsados), formato.numero(p.pedidos)),
    })),
    tabla: { columnas: [...T.reembolsos.columnas], filas: puntos.map((p) => [cuandoTabla(p), formato.porcentaje(p.tasa, 1), formato.numero(p.reembolsados), formato.numero(p.pedidos)]) },
  };
}

export interface FilaMes {
  clave: string;
  mes: string;
  pedidos: string;
  reembolsados: string;
  tasa: string;
  comision: string;
  liquidada: string;
  enCurso: boolean;
}

/** Tabla «Por mes» (01 §4.11 #6): el mes en curso dice «nov (al 12)»; el primero y los de enero llevan año. */
export function filasPorMes(puntos: readonly C.PuntoSerie[], hoyHub: C.FechaLocal): FilaMes[] {
  return puntos.map((p, i) => {
    const enCurso = enCursoDe(p.clave, 'mes', hoyHub);
    const conAnio = i === 0 || p.clave.endsWith('-01');
    const base = etiquetaMes(p.clave, conAnio);
    return {
      clave: p.clave,
      mes: enCurso ? T.porMes.alDia(base, String(Number(hoyHub.slice(8, 10)))) : base,
      pedidos: formato.numero(p.pedidos),
      reembolsados: formato.numero(p.pedidos_reembolsados),
      tasa: formato.porcentaje(p.pedidos > 0 ? p.pedidos_reembolsados / p.pedidos : 0),
      comision: formato.dinero(p.comision_estimada_centavos),
      liquidada: formato.dinero(p.comision_liquidada_centavos),
      enCurso,
    };
  });
}

// ---------------------------------------------------------------------------------------------- pedidos

export type FiltroPedidos = 'todos' | 'liquidados' | 'por_liquidar' | 'reembolsados';
export const FILTROS_PEDIDOS: readonly FiltroPedidos[] = ['todos', 'liquidados', 'por_liquidar', 'reembolsados'];
export const POR_PAGINA = 50;

export function esFiltro(v: string | null | undefined): v is FiltroPedidos {
  return v !== null && v !== undefined && (FILTROS_PEDIDOS as readonly string[]).includes(v);
}

/** Chip → estados de la consulta (01 §4.11 #7). 'todos' = sin filtro. */
export function estadosDe(f: FiltroPedidos): C.EstadoOrden[] | null {
  switch (f) {
    case 'liquidados':
      return ['SETTLED'];
    case 'por_liquidar':
      return ['To-SETTLE', 'AWAITING PAYMENT'];
    case 'reembolsados':
      return ['REFUNDED'];
    default:
      return null;
  }
}

/**
 * Defensa: si la fuente devolvió pedidos que no corresponden al filtro o al rango pedidos (no debería con el hub), no
 * se muestran. Con el hub es la identidad.
 */
export function filtrarPedidos(items: readonly C.OrdenVista[], estados: readonly C.EstadoOrden[] | null, desde: C.FechaLocal | null, hasta: C.FechaLocal | null): C.OrdenVista[] {
  return items.filter((o) => (!estados || estados.includes(o.estado)) && (!desde || o.fecha >= desde) && (!hasta || o.fecha <= hasta));
}

export function totalPaginas(total: number, porPagina = POR_PAGINA): number {
  return Math.max(1, Math.ceil(Math.max(0, total) / porPagina));
}

/** Tono del chip de estado: liquidado ok · por liquidar/esperando info · congelado ámbar · el resto neutro (reembolsado no es riesgo). */
export function tonoEstado(e: C.EstadoOrden): 'ok' | 'info' | 'atencion' | 'neutro' {
  if (e === 'SETTLED') return 'ok';
  if (e === 'To-SETTLE' || e === 'AWAITING PAYMENT') return 'info';
  if (e === 'FROZEN') return 'atencion';
  return 'neutro';
}

export function etiquetaEstado(e: C.EstadoOrden): string {
  return ETIQUETA_ESTADO_ORDEN[e];
}

export function nombreLinea(l: Pick<C.LineaVista, 'producto'>): string {
  return l.producto ? nombreCorto(l.producto) : T.detalle.productoSinNombre;
}

/** Tarjeta de celular: '12 nov · Gorra Ejemplo · Por liquidar · $12.34'. */
export function textoTarjetaPedido(o: C.OrdenVista): { fecha: string; producto: string; estado: string; comision: string } {
  const l = o.lineas[0];
  return {
    fecha: formato.fechaCorta(o.fecha),
    producto: l ? nombreLinea(l) : T.detalle.productoSinNombre,
    estado: etiquetaEstado(o.estado),
    comision: formato.dinero(o.estado === 'SETTLED' ? o.comision_real_centavos : o.comision_estimada_centavos, { decimales: true }),
  };
}

export interface DatoLinea {
  id: string;
  etiqueta: string;
  valor: string;
}

/** Detalle de una línea (01 §4.11 #7, al expandir): bases, desglose, unidades reembolsadas o devueltas, ISR/IVA y
 *  agencia solo si vienen, fecha de actualización y carrusel. */
export function detalleLinea(l: C.LineaVista): DatoLinea[] {
  const d: DatoLinea[] = [];
  const dinero = (c: C.Centavos): string => formato.dinero(c, { decimales: true });
  d.push({ id: 'estimada', etiqueta: T.detalle.comisionEstimada, valor: dinero(l.com_estimada_centavos) });
  d.push({ id: 'real', etiqueta: T.detalle.comisionLiquidada, valor: dinero(l.com_real_centavos) });
  if (l.base_estimada_centavos !== null) d.push({ id: 'base_est', etiqueta: T.detalle.baseEstimada, valor: dinero(l.base_estimada_centavos) });
  if (l.base_real_centavos !== null) d.push({ id: 'base_real', etiqueta: T.detalle.baseReal, valor: dinero(l.base_real_centavos) });
  if (l.comision_bp !== null) d.push({ id: 'tasa', etiqueta: T.detalle.tasa, valor: formato.tasaBp(l.comision_bp) });
  if (l.comision_std_bp !== null) d.push({ id: 'std', etiqueta: T.detalle.estandar, valor: formato.tasaBp(l.comision_std_bp) });
  if (l.comision_ads_bp !== null && l.comision_ads_bp > 0) d.push({ id: 'ads', etiqueta: T.detalle.anuncios, valor: formato.tasaBp(l.comision_ads_bp) });
  if (l.comision_bono_bp !== null && l.comision_bono_bp > 0) d.push({ id: 'bono', etiqueta: T.detalle.bono, valor: formato.tasaBp(l.comision_bono_bp) });
  if (l.isr_centavos !== null) d.push({ id: 'isr', etiqueta: T.detalle.isr, valor: dinero(l.isr_centavos) });
  if (l.iva_centavos !== null) d.push({ id: 'iva', etiqueta: T.detalle.iva, valor: dinero(l.iva_centavos) });
  if (l.compartido_agencia_centavos !== null && l.compartido_agencia_centavos > 0) d.push({ id: 'agencia', etiqueta: T.detalle.agencia, valor: dinero(l.compartido_agencia_centavos) });
  if (l.tipo_contenido) d.push({ id: 'contenido', etiqueta: T.detalle.contenido, valor: etiquetaContenido(l.tipo_contenido) });
  return d;
}

/** Notas de la línea: unidades reembolsadas/devueltas, actualización de TikTok y carrusel. */
export function notasLinea(l: C.LineaVista): string[] {
  const n: string[] = [];
  if (l.reembolsadas > 0) n.push(T.detalle.reembolsadas(l.reembolsadas));
  if (l.devueltas > 0) n.push(T.detalle.devueltas(l.devueltas));
  if (l.actualizada_at !== null) n.push(T.detalle.actualizado(formato.fechaCorta(l.actualizada_at)));
  if (l.es_carrusel === true) n.push(T.detalle.carrusel);
  return n;
}

/**
 * Primera sincronización antes de que lleguen los pedidos recientes (C34, antes del punto de control 2): el tablero
 * todavía dice $0 y 0 pedidos, y eso no es «sin ventas». La pantalla muestra «Todavía estamos trayendo tus pedidos…» y
 * esqueletos en lugar de cifras.
 */
export function ventasTodaviaNo(sync: C.SyncEstado | null | undefined, ultimaSyncOk: C.EpochS | null | undefined): boolean {
  if (!sync?.en_curso || (ultimaSyncOk ?? null) !== null || sync.ultima_ok_at !== null) return false;
  const ordenes = sync.pasos.find((p) => p.paso === 'ordenes');
  return !ordenes || !['ok', 'parcial', 'omitido'].includes(ordenes.estado);
}

/** Paso de pedidos de la sincronización en curso (para «Todavía estamos trayendo tus pedidos…»). */
export function pasoPedidosEnCurso(sync: C.SyncEstado | null | undefined): C.SyncPaso | null {
  if (!sync?.en_curso) return null;
  return sync.pasos.find((p) => (p.paso === 'ordenes' || p.paso === 'ordenes_anteriores') && p.estado === 'en_curso') ?? null;
}

/**
 * Semana que se está trayendo (la que sigue a las `hechos` terminadas), como la cuenta el texto del hub en el indicador
 * global («Tus ventas recientes: semana 5 de 26…» con 4 hechas): así la franja y el indicador dicen la misma semana.
 */
export function semanaQueTrae(paso: C.SyncPaso | null): { n: number; total: number } | null {
  if (!paso || !paso.total) return null;
  return { n: Math.min(paso.hechos + 1, paso.total), total: paso.total };
}
