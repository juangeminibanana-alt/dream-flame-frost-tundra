/* @/dominio · Armar mi plan (01_ux §4.5) y "Agregar y recorrer las demás" (01_ux §5.5 paso 4).
   Reglas: 1) las por vencer primero y siempre antes de su fecha límite; 2) capacidad diaria contando lo ya planeado y
   sin videos en los días que no se trabaja; 3) ninguna muestra con promesa queda en una fecha cuya fecha + 2 supere lo
   prometido (si es imposible, se reporta). Caso real: 32 pendientes, 3/día, L–S, desde jue 12 nov → termina mar 24 nov,
   publica jue 26 nov. */
import type * as C from '@/contrato';
import type { AsignacionPlan, EntradaPlan, OperacionPlan, ResultadoPlan, ResultadoRecorrido } from '@firmas/dominio';
import { diaSemana, fechaLocalDe, horaLocal, sumarDias } from './fechas';
import { nuevoId } from './texto';
import { esPendiente, planVivo, tituloPlan } from './trabajo';

/** Etapas cuyo día planeado ocupa capacidad (ya hay un video para ese día). */
const ESTADOS_OCUPAN: ReadonlySet<C.EtapaAvance> = new Set<C.EtapaAvance>(['planeada', 'video_listo', 'programada']);
/** Tope de búsqueda de días (10 años): evita ciclos infinitos con entradas absurdas. */
const TOPE_DIAS = 3660;

function sumar(mapa: Map<C.FechaLocal, number>, fecha: C.FechaLocal, n: number = 1): void {
  mapa.set(fecha, (mapa.get(fecha) ?? 0) + n);
}

function diasValidos(dias: readonly number[]): ReadonlySet<number> {
  return new Set(dias.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6));
}

function capacidadDe(c: number): number {
  return Number.isFinite(c) ? Math.max(1, Math.floor(c)) : 1;
}

function compararTexto(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function posicion(m: C.MuestraVista): number {
  return m.posicion_cola ?? Number.MAX_SAFE_INTEGER;
}

function compararSugerido(a: C.MuestraVista, b: C.MuestraVista): number {
  return posicion(a) - posicion(b) || compararTexto(a.application_id, b.application_id);
}

/** Categoría hoja ('Ropa interior y de hombre > Camisas > Sudaderas' → 'sudaderas'). */
function categoriaHoja(m: C.MuestraVista): string {
  const partes = (m.producto.categoria ?? '').split(/\s*(?:›|>)\s*/).map((p) => p.trim()).filter((p) => p.length > 0);
  return (partes[partes.length - 1] ?? '').toLocaleLowerCase('es-MX');
}

/** "En lote por tipo de prenda": junta las de la misma categoría hoja en días seguidos; los lotes salen en el orden
 *  sugerido de su primera muestra y, dentro de cada lote, en orden sugerido. */
function ordenarPorTipo(lista: C.MuestraVista[]): C.MuestraVista[] {
  const sugerido = [...lista].sort(compararSugerido);
  const lotes = new Map<string, C.MuestraVista[]>();
  for (const m of sugerido) {
    const clave = categoriaHoja(m) || `~${m.application_id}`;
    const lote = lotes.get(clave);
    if (lote) lote.push(m);
    else lotes.set(clave, [m]);
  }
  return [...lotes.values()].flat();
}

function fechaLimite(m: C.MuestraVista): C.FechaLocal | null {
  return m.fecha_limite_at !== null ? fechaLocalDe(m.fecha_limite_at) : null;
}

function promesaPara(m: C.MuestraVista, promesas: Record<string, C.FechaLocal>): C.FechaLocal | null {
  return promesas[m.application_id] ?? m.avisos.promesa ?? null;
}

/** Fecha más tardía en la que se puede hacer el video sin romper la promesa (promesa − 2). */
function topePromesa(p: C.FechaLocal | null): C.FechaLocal | null {
  return p === null ? null : sumarDias(p, -2);
}

function vacio(): ResultadoPlan {
  return { asignaciones: [], termina: null, publica_a_mas_tardar: null, por_dia: {}, no_alcanza: [], rompe_promesa: [] };
}

/** Ocupación por día de lo que NO se reacomoda: planes (y avances de muestras) en etapas que ocupan, con fecha. */
function ocupacion(e: EntradaPlan, excluir: ReadonlySet<string>): Map<C.FechaLocal, number> {
  const ocupado = new Map<C.FechaLocal, number>();
  const vistos = new Set<string>();
  for (const p of e.planes) {
    if (p.fecha_plan === null || !ESTADOS_OCUPAN.has(p.estado)) continue;
    const clave = p.application_id ?? `plan:${p.id}`;
    if (vistos.has(clave) || (p.application_id !== null && excluir.has(p.application_id))) continue;
    vistos.add(clave);
    sumar(ocupado, p.fecha_plan);
  }
  for (const m of e.muestras) {
    const f = m.avance.fecha_planeada;
    if (f === null || !ESTADOS_OCUPAN.has(m.avance.etapa) || excluir.has(m.application_id) || vistos.has(m.application_id)) continue;
    vistos.add(m.application_id);
    sumar(ocupado, f);
  }
  return ocupado;
}

function cerrar(asignaciones: AsignacionPlan[], ocupado: Map<C.FechaLocal, number>, desde: C.FechaLocal,
  no_alcanza: ResultadoPlan['no_alcanza'], rompe_promesa: ResultadoPlan['rompe_promesa']): ResultadoPlan {
  const porDia = new Map<C.FechaLocal, number>();
  for (const [f, n] of ocupado) if (f >= desde) sumar(porDia, f, n);
  for (const a of asignaciones) sumar(porDia, a.fecha);
  let termina: C.FechaLocal | null = null;
  for (const a of asignaciones) if (termina === null || a.fecha > termina) termina = a.fecha;
  const por_dia: Record<C.FechaLocal, number> = {};
  for (const f of [...porDia.keys()].sort()) {
    const n = porDia.get(f) ?? 0;
    if (n > 0) por_dia[f] = n;
  }
  return {
    asignaciones,
    termina,
    publica_a_mas_tardar: termina === null ? null : sumarDias(termina, 2),
    por_dia,
    no_alcanza,
    rompe_promesa,
  };
}

/** Reglas 1–3 de 01_ux §4.5 (por vencer primero, capacidad contando lo ya planeado, días sin videos, promesas).
 *  Caso real: 32 pendientes, 3/día, L–S, desde jue 12 nov → termina mar 24 nov, publica jue 26 nov. */
export function armarPlan(entrada: EntradaPlan): ResultadoPlan {
  const dias = diasValidos(entrada.dias);
  const capacidad = capacidadDe(entrada.capacidad);
  const porId = new Map(entrada.muestras.map((m) => [m.application_id, m] as const));
  const vistos = new Set<string>();
  const incluidas: C.MuestraVista[] = [];
  for (const id of entrada.incluidas) {
    const m = porId.get(id);
    if (!m || vistos.has(id) || !esPendiente(m)) continue;
    if (m.avance.etapa !== 'por_planear' && m.avance.etapa !== 'planeada') continue;
    vistos.add(id);
    incluidas.push(m);
  }
  if (incluidas.length === 0 || dias.size === 0) return vacio();

  const conservar = entrada.respetarFechas ? incluidas.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada !== null) : [];
  const idsConservar = new Set(conservar.map((m) => m.application_id));
  const asignar = incluidas.filter((m) => !idsConservar.has(m.application_id));
  const idsAsignar = new Set(asignar.map((m) => m.application_id));
  const ocupado = ocupacion(entrada, idsAsignar);

  // Regla 1: las por vencer van primero (por fecha límite); el resto en el orden elegido.
  const porVencer = asignar.filter((m) => m.grupo === 'por_vencer').sort((a, b) =>
    (a.fecha_limite_at ?? Number.MAX_SAFE_INTEGER) - (b.fecha_limite_at ?? Number.MAX_SAFE_INTEGER) || compararSugerido(a, b));
  const restoBase = asignar.filter((m) => m.grupo !== 'por_vencer');
  const resto = entrada.orden === 'por_tipo_de_prenda' ? ordenarPorTipo(restoBase) : [...restoBase].sort(compararSugerido);
  const orden = [...porVencer, ...resto];

  // Regla 2: lugares libres día por día desde `desde`, solo en días de videos y con la capacidad que le queda al día.
  const lugares: C.FechaLocal[] = [];
  let d = entrada.desde;
  for (let i = 0; i < TOPE_DIAS && lugares.length < orden.length; i++, d = sumarDias(d, 1)) {
    if (!dias.has(diaSemana(d))) continue;
    const libres = Math.max(0, capacidad - (ocupado.get(d) ?? 0));
    for (let k = 0; k < libres && lugares.length < orden.length; k++) lugares.push(d);
  }
  const ocupante: Array<C.MuestraVista | undefined> = orden.slice(0, lugares.length);

  // Regla 3: una promesa que no se cumple en su lugar se intercambia con la muestra más tardía que esté en un lugar
  // que sí la cumple (la de menor prioridad entre las que van antes), sin romper la promesa de esa otra ni la regla 1:
  // las demás nunca pasan delante de una por vencer, y una por vencer solo se cambia con otra por vencer que siga
  // antes de su fecha límite en el lugar nuevo. Se revisan TODAS las que tienen promesa (también las por vencer); lo
  // que no se puede arreglar se reporta en rompe_promesa antes de crear.
  const indiceDe = (m: C.MuestraVista): number => ocupante.indexOf(m);
  const conPromesa = orden.filter((m) => promesaPara(m, entrada.promesas) !== null)
    .sort((a, b) => compararTexto(promesaPara(a, entrada.promesas) ?? '', promesaPara(b, entrada.promesas) ?? ''));
  const rompe_promesa: ResultadoPlan['rompe_promesa'] = [];
  const idsPorVencer = new Set(porVencer.map((m) => m.application_id));
  for (const m of conPromesa) {
    const p = promesaPara(m, entrada.promesas);
    const tope = topePromesa(p);
    const i = indiceDe(m);
    if (p === null || tope === null || i < 0) continue;
    const fecha = lugares[i];
    if (fecha === undefined || fecha <= tope) continue;
    const mVence = idsPorVencer.has(m.application_id);
    let elegido = -1;
    for (let j = i - 1; j >= 0; j--) {
      const lugar = lugares[j];
      const otro = ocupante[j];
      if (lugar === undefined || otro === undefined || lugar > tope) continue;
      const otroVence = idsPorVencer.has(otro.application_id);
      if (otroVence !== mVence) continue;
      const limiteOtro = otroVence ? fechaLimite(otro) : null;
      if (limiteOtro !== null && fecha > limiteOtro) continue;
      const topeOtro = topePromesa(promesaPara(otro, entrada.promesas));
      if (topeOtro !== null && fecha > topeOtro) continue;
      elegido = j;
      break;
    }
    if (elegido >= 0) {
      const otro = ocupante[elegido];
      ocupante[elegido] = m;
      ocupante[i] = otro;
    } else {
      rompe_promesa.push({ application_id: m.application_id, promesa: p, fecha });
    }
  }

  const no_alcanza: ResultadoPlan['no_alcanza'] = [];
  const asignaciones: Array<AsignacionPlan & { _orden: number }> = [];
  conservar.forEach((m, k) => {
    const fecha = m.avance.fecha_planeada ?? entrada.desde;
    asignaciones.push({ application_id: m.application_id, fecha, ya_tenia_fecha: true, _orden: -conservar.length + k });
    const limite = fechaLimite(m);
    if (m.grupo === 'por_vencer' && limite !== null && fecha > limite) no_alcanza.push({ application_id: m.application_id, fecha_limite: limite });
    const p = promesaPara(m, entrada.promesas);
    const tope = topePromesa(p);
    if (p !== null && tope !== null && fecha > tope) rompe_promesa.push({ application_id: m.application_id, promesa: p, fecha });
  });
  ocupante.forEach((m, i) => {
    const fecha = lugares[i];
    if (m === undefined || fecha === undefined) return;
    asignaciones.push({ application_id: m.application_id, fecha, ya_tenia_fecha: m.avance.fecha_planeada !== null, _orden: i });
    const limite = fechaLimite(m);
    if (m.grupo === 'por_vencer' && limite !== null && fecha > limite) no_alcanza.push({ application_id: m.application_id, fecha_limite: limite });
  });
  asignaciones.sort((a, b) => compararTexto(a.fecha, b.fecha) || a._orden - b._orden);
  const limpias: AsignacionPlan[] = asignaciones.map(({ application_id, fecha, ya_tenia_fecha }) => ({ application_id, fecha, ya_tenia_fecha }));
  // por_dia = lo que ya estaba (sin las conservadas, que ya van en asignaciones) + lo asignado.
  const ocupadoAjeno = ocupacion(entrada, new Set([...idsAsignar, ...idsConservar]));
  return cerrar(limpias, ocupadoAjeno, entrada.desde, no_alcanza, rompe_promesa);
}

/** 'Hoy' antes de las 6:00 p. m. local; si no, mañana. */
export function desdePorOmision(ahora: C.EpochS): C.FechaLocal {
  const hoy = fechaLocalDe(ahora);
  return horaLocal(ahora).h < 18 ? hoy : sumarDias(hoy, 1);
}

function esRecorrido(r: ResultadoPlan): r is ResultadoRecorrido {
  return 'cambios' in r && Array.isArray(r.cambios);
}

/** Ops para crear/editar los PlanVideo del resultado (todas a 'planeada' con su fecha_plan). Con un ResultadoRecorrido
 *  solo se generan las de `cambios`. Lo que ya está planeado en esa misma fecha no genera op. */
export function opsDePlan(resultado: ResultadoPlan, muestras: C.MuestraVista[], planes: C.PlanVideo[]): OperacionPlan[] {
  const lista = esRecorrido(resultado) ? resultado.cambios : resultado.asignaciones;
  const porId = new Map(muestras.map((m) => [m.application_id, m] as const));
  const ops: OperacionPlan[] = [];
  const hechos = new Set<string>();
  lista.forEach((a, i) => {
    if (hechos.has(a.application_id)) return;
    hechos.add(a.application_id);
    const m = porId.get(a.application_id);
    const plan = planVivo(a.application_id, planes);
    if (plan !== null) {
      if (plan.estado === 'planeada' && plan.fecha_plan === a.fecha) return;
      ops.push({ tipo: 'plan.editar', id: plan.id, cambios: { estado: 'planeada', fecha_plan: a.fecha, rev: plan.rev } });
      return;
    }
    if (m === undefined) return;
    if (m.avance.plan_id !== null) {
      if (m.avance.etapa === 'planeada' && m.avance.fecha_planeada === a.fecha) return;
      ops.push({ tipo: 'plan.editar', id: m.avance.plan_id, cambios: { estado: 'planeada', fecha_plan: a.fecha, rev: m.avance.rev } });
      return;
    }
    ops.push({
      tipo: 'plan.crear',
      datos: {
        id: nuevoId(), titulo: tituloPlan(m), application_id: m.application_id, product_id: m.producto.product_id,
        tienda_key: m.tienda.tienda_key, estado: 'planeada', fecha_plan: a.fecha, orden: i,
      },
    });
  });
  return ops;
}

// ============================================================================ recorrer el plan (01_ux §5.5 paso 4)
interface ElementoPlan {
  clave: string;
  application_id: string | null;
  fecha: C.FechaLocal;
  movible: boolean;
  orden: number;
  posicion: number;
  pendiente: boolean;
  m: C.MuestraVista | undefined;
}

function compararElementos(a: ElementoPlan, b: ElementoPlan): number {
  return a.orden - b.orden || a.posicion - b.posicion || compararTexto(a.clave, b.clave);
}

/**
 * "Agregar y recorrer las demás" (01 §5.5): pone `nueva` (por vencer, prioridad urgente) en el primer día de videos
 * desde `desde`, al frente de ese día; si el día ya estaba lleno, la última planeada NO fijada de ese día pasa al
 * frente del siguiente día de videos, y así en cascada hasta que alguien cabe. Lo fijado (fijada, video listo,
 * programada o planes sin muestra) no se mueve y cuenta para la capacidad. Reporta: no_alcanza si la nueva (o una
 * por vencer recorrida) queda después de su fecha límite; rompe_promesa por cada muestra recorrida cuya fecha + 2
 * supere lo prometido. `cambios` = solo lo que cambia de fecha (y la nueva); termina_antes = término antes de meterla.
 * De la entrada se usan capacidad, dias, desde, muestras, planes y promesas (incluidas, orden y respetarFechas no
 * aplican: todo lo que no se recorre conserva su fecha).
 */
export function recorrerPlan(entrada: EntradaPlan, nueva: C.MuestraVista): ResultadoRecorrido {
  const dias = diasValidos(entrada.dias);
  const capacidad = capacidadDe(entrada.capacidad);
  const porId = new Map(entrada.muestras.map((m) => [m.application_id, m] as const));
  const elementos: ElementoPlan[] = [];
  const vistos = new Set<string>([nueva.application_id]);
  const agregar = (clave: string, applicationId: string | null, fecha: C.FechaLocal, etapa: C.EtapaAvance, fijada: boolean, orden: number): void => {
    const m = applicationId !== null ? porId.get(applicationId) : undefined;
    const pendiente = m !== undefined && esPendiente(m);
    elementos.push({
      clave, application_id: applicationId, fecha, orden, pendiente, m,
      movible: etapa === 'planeada' && !fijada && fecha >= entrada.desde && pendiente,
      posicion: m !== undefined ? posicion(m) : Number.MAX_SAFE_INTEGER,
    });
  };
  for (const p of entrada.planes) {
    if (p.fecha_plan === null || !ESTADOS_OCUPAN.has(p.estado)) continue;
    const clave = p.application_id ?? `plan:${p.id}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    agregar(clave, p.application_id, p.fecha_plan, p.estado, p.fijada, p.orden);
  }
  for (const m of entrada.muestras) {
    const f = m.avance.fecha_planeada;
    if (f === null || !ESTADOS_OCUPAN.has(m.avance.etapa) || vistos.has(m.application_id)) continue;
    vistos.add(m.application_id);
    agregar(m.application_id, m.application_id, f, m.avance.etapa, m.avance.fijada, Number.MAX_SAFE_INTEGER);
  }

  const terminoDe = (lista: Array<{ fecha: C.FechaLocal; pendiente: boolean }>): C.FechaLocal | null => {
    let t: C.FechaLocal | null = null;
    for (const x of lista) if (x.pendiente && (t === null || x.fecha > t)) t = x.fecha;
    return t;
  };
  const termina_antes = terminoDe(elementos);

  const elementoNuevo: ElementoPlan = {
    clave: nueva.application_id, application_id: nueva.application_id, fecha: entrada.desde, movible: true,
    orden: Number.MIN_SAFE_INTEGER, posicion: 0, pendiente: true, m: nueva,
  };
  const porDia = new Map<C.FechaLocal, ElementoPlan[]>();
  for (const x of elementos) {
    const lista = porDia.get(x.fecha);
    if (lista) lista.push(x);
    else porDia.set(x.fecha, [x]);
  }
  for (const lista of porDia.values()) lista.sort(compararElementos);

  const nuevaFecha = new Map<string, C.FechaLocal>();
  let arrastre: ElementoPlan[] = [elementoNuevo];
  let d = entrada.desde;
  for (let i = 0; i < TOPE_DIAS && arrastre.length > 0 && dias.size > 0; i++, d = sumarDias(d, 1)) {
    if (!dias.has(diaSemana(d))) continue;
    const existentes = porDia.get(d) ?? [];
    const fijos = existentes.filter((x) => !x.movible);
    const movibles = existentes.filter((x) => x.movible);
    const permitido = Math.max(capacidad, existentes.length);
    const cola = [...arrastre, ...movibles];
    const libres = Math.max(0, permitido - fijos.length);
    for (const x of cola.slice(0, libres)) nuevaFecha.set(x.clave, d);
    arrastre = cola.slice(libres);
  }
  // Sin días de videos (o fuera del tope): la nueva queda en `desde` y se reporta si eso pasa su fecha límite.
  for (const x of arrastre) nuevaFecha.set(x.clave, x === elementoNuevo ? entrada.desde : x.fecha);

  const despues = [...elementos, elementoNuevo].map((x) => ({ ...x, fechaFinal: nuevaFecha.get(x.clave) ?? x.fecha }));
  const cambios: AsignacionPlan[] = [];
  const asignaciones: AsignacionPlan[] = [];
  const no_alcanza: ResultadoPlan['no_alcanza'] = [];
  const rompe_promesa: ResultadoPlan['rompe_promesa'] = [];
  for (const x of despues) {
    if (x.application_id === null) continue;
    const esNueva = x === despues[despues.length - 1];
    const ya = esNueva ? nueva.avance.fecha_planeada !== null : true;
    const asignacion: AsignacionPlan = { application_id: x.application_id, fecha: x.fechaFinal, ya_tenia_fecha: ya };
    if (x.pendiente || esNueva) asignaciones.push(asignacion);
    const cambio = esNueva || x.fechaFinal !== x.fecha;
    if (!cambio) continue;
    cambios.push(asignacion);
    const m = x.m;
    if (m === undefined) continue;
    const limite = fechaLimite(m);
    if ((esNueva || m.grupo === 'por_vencer') && limite !== null && x.fechaFinal > limite) {
      no_alcanza.push({ application_id: x.application_id, fecha_limite: limite });
    }
    const p = promesaPara(m, entrada.promesas);
    const tope = topePromesa(p);
    if (p !== null && tope !== null && x.fechaFinal > tope) rompe_promesa.push({ application_id: x.application_id, promesa: p, fecha: x.fechaFinal });
  }
  const orden = (a: AsignacionPlan, b: AsignacionPlan): number => compararTexto(a.fecha, b.fecha) || compararTexto(a.application_id, b.application_id);
  asignaciones.sort(orden);
  cambios.sort(orden);

  const ocupadoFijo = new Map<C.FechaLocal, number>();
  for (const x of despues) if (x.application_id === null || !(x.pendiente || x === despues[despues.length - 1])) sumar(ocupadoFijo, x.fechaFinal);
  const base = cerrar(asignaciones, ocupadoFijo, entrada.desde, no_alcanza, rompe_promesa);
  const termina = terminoDe(despues.map((x) => ({ fecha: x.fechaFinal, pendiente: x.pendiente || x.clave === nueva.application_id })));
  return {
    ...base,
    termina,
    publica_a_mas_tardar: termina === null ? null : sumarDias(termina, 2),
    cambios,
    termina_antes,
  };
}
