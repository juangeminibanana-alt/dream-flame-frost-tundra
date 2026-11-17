/**
 * Avisar a mis tiendas (01 §4.17) · lógica de los pasos, sin React. El recorrido es el orden de «Tiendas que necesitan
 * atención» (promesas vencidas → socio con pendientes → con pendientes por comisión de 180 días, nº de pendientes y
 * valor recibido) y se congela al abrir. Una tienda queda «avisada» solo con un aviso confirmado (marcado como enviado)
 * que cubre todas sus pendientes sin promesa vencida: copiar no basta (criterio de 01 §4.17).
 */
import type * as C from '@/contrato';
import { ordenTiendasAvisar } from '@/dominio';

/** Pendientes agrupadas por tienda, en el orden en que llegan (el de la cola). */
export function pendientesPorTienda(pendientes: readonly C.MuestraVista[]): Map<string, C.MuestraVista[]> {
  const salida = new Map<string, C.MuestraVista[]>();
  for (const m of pendientes) {
    const lista = salida.get(m.tienda.tienda_key);
    if (lista) lista.push(m);
    else salida.set(m.tienda.tienda_key, [m]);
  }
  return salida;
}

/** Todas sus pendientes aparecen en un aviso enviado y ninguna tiene la promesa vencida. */
export function tiendaAvisada(pendientes: readonly C.MuestraVista[] | undefined): boolean {
  if (!pendientes || pendientes.length === 0) return true;
  return pendientes.every((m) => m.avisos.ultimo_enviado_at !== null && !m.avisos.promesa_vencida);
}

/**
 * Orden de 01 §4.17 que NO cambia al crear el plan. Qué tiendas entran (con pendientes por avisar o con una promesa
 * vencida) lo decide dominio.ordenTiendasAvisar; el orden se recalcula aquí porque el de dominio ordena por la salud
 * recalculada (`socio_con_pendientes` → `con_pendientes` → `con_plan`), y esa salud baja a «con plan» toda tienda cuyas
 * pendientes ya tienen fecha: tras «Crear mi plan» una tienda con una pendiente sin fecha (p. ej. «Tienda B», cuya
 * única pendiente no se puede etiquetar y no entra al plan) se adelantaba a todas y el recorrido dejaba de empezar en
 * «1 de 10 · Tienda Ejemplo» (01 §5.1 paso 3). Aquí «socio con pendientes» es socio con pendientes sin video,
 * planeadas o no: promesas vencidas → socio → comisión de 180 días → nº de pendientes → valor recibido (máx. y mín.)
 * → tienda_key.
 */
export function ordenAvisar(tiendas: C.FilaTienda[], pendientes: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): C.FilaTienda[] {
  const porTienda = pendientesPorTienda(pendientes);
  const filas = ordenTiendasAvisar(tiendas, pendientes, avisos, hoy).map((t) => {
    const pend = porTienda.get(t.tienda_key) ?? [];
    // Promesa vencida (03 §5.10): hoy > la fecha prometida vigente y todavía sin publicar.
    const vencidas = pend.filter((m) => m.avisos.promesa_vencida || (m.avisos.promesa !== null && hoy > m.avisos.promesa && m.avance.etapa !== 'publicada')).length;
    return { t, vencidas, socio: t.es_socio && pend.length > 0 ? 0 : 1, pendientes: pend.length };
  });
  filas.sort((a, b) =>
    (b.vencidas > 0 ? 1 : 0) - (a.vencidas > 0 ? 1 : 0)
    || b.vencidas - a.vencidas
    || a.socio - b.socio
    || b.t.ventas.comision_180d_centavos - a.t.ventas.comision_180d_centavos
    || b.pendientes - a.pendientes
    || b.t.muestras.valor_recibido_max_centavos - a.t.muestras.valor_recibido_max_centavos
    || b.t.muestras.valor_recibido_min_centavos - a.t.muestras.valor_recibido_min_centavos
    || (a.t.tienda_key < b.t.tienda_key ? -1 : a.t.tienda_key > b.t.tienda_key ? 1 : 0));
  return filas.map((f) => f.t);
}

/** Claves de las tiendas por avisar en el orden de 01 §4.17 (ordenAvisar). */
export function armarRecorrido(tiendas: C.FilaTienda[], pendientes: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): string[] {
  return ordenAvisar(tiendas, pendientes, avisos, hoy).map((t) => t.tienda_key);
}

/**
 * Tiendas con pendientes que YA estaban avisadas al abrir (no se recorren, pero cuentan en «Tienda 3 de 30» y se ven con
 * ✓ en la lista). Van en el mismo orden de atención, calculado como si nadie estuviera avisado.
 */
export function tiendasPrevias(tiendas: C.FilaTienda[], pendientes: C.MuestraVista[], porAvisar: readonly string[], hoy: C.FechaLocal): string[] {
  const enRecorrido = new Set(porAvisar);
  return ordenAvisar(tiendas, pendientes, [], hoy).map((t) => t.tienda_key).filter((k) => !enRecorrido.has(k));
}

/** Sin ningún plan: ninguna pendiente tiene día ni hora programada (01 §4.17: «Arma tu plan para darles fechas reales»). */
export function sinPlan(pendientes: readonly C.MuestraVista[]): boolean {
  return pendientes.every((m) => m.avance.fecha_planeada === null && m.avance.programada_para_at === null);
}

export interface EstadoAvisar {
  /** Claves congeladas al abrir: primero las ya avisadas (`previas`) y luego las por avisar en el orden de 01 §4.17
   *  (vacío = todavía no llegan los datos). */
  recorrido: string[];
  /** Ya avisadas al abrir: se ven con ✓ y nunca se recorren. */
  previas: string[];
  /** Tienda en pantalla; null = cierre. */
  actual: string | null;
  saltadas: string[];
  iniciado: boolean;
}

export const AVISAR_VACIO: EstadoAvisar = { recorrido: [], previas: [], actual: null, saltadas: [], iniciado: false };

export type AccionAvisar =
  /** Al abrir: continúa en la primera tienda por avisar. */
  | { tipo: 'iniciar'; recorrido: string[]; avisadas: string[]; previas?: string[] }
  /** «Sí, siguiente» (o se confirmó por otra vía): pasa a la siguiente por avisar. */
  | { tipo: 'avisada'; tienda: string; avisadas: string[] }
  /** «Saltar»: pasa a la siguiente sin registrar (la tienda sigue por avisar). */
  | { tipo: 'saltar'; tienda: string; avisadas: string[] }
  /** Escritorio: elegir una tienda de la lista de la izquierda. */
  | { tipo: 'elegir'; tienda: string }
  | { tipo: 'volverASaltadas'; avisadas: string[] };

/** La siguiente tienda por avisar después de `desde` (sin las avisadas ni las saltadas); null si no queda ninguna. */
export function siguientePorAvisar(recorrido: readonly string[], desde: string | null, avisadas: ReadonlySet<string>, saltadas: ReadonlySet<string>): string | null {
  const inicio = desde === null ? 0 : recorrido.indexOf(desde) + 1;
  for (let i = 0; i < recorrido.length; i++) {
    const k = recorrido[(inicio + i) % recorrido.length];
    if (k !== undefined && k !== desde && !avisadas.has(k) && !saltadas.has(k)) return k;
  }
  return null;
}

export function reducirAvisar(e: EstadoAvisar, a: AccionAvisar): EstadoAvisar {
  switch (a.tipo) {
    case 'iniciar': {
      if (e.iniciado) return e;
      const previas = [...new Set(a.previas ?? [])].filter((k) => !a.recorrido.includes(k));
      const recorrido = [...new Set([...previas, ...a.recorrido])];
      const avisadas = new Set([...a.avisadas, ...previas]);
      return { recorrido, previas, actual: siguientePorAvisar(recorrido, null, avisadas, new Set()), saltadas: [], iniciado: true };
    }
    case 'avisada': {
      if (e.actual !== a.tienda) return e;
      const avisadas = new Set([...a.avisadas, a.tienda]);
      const saltadas = e.saltadas.filter((k) => k !== a.tienda);
      return { ...e, saltadas, actual: siguientePorAvisar(e.recorrido, a.tienda, avisadas, new Set(saltadas)) };
    }
    case 'saltar': {
      if (e.actual !== a.tienda) return e;
      const saltadas = e.saltadas.includes(a.tienda) ? e.saltadas : [...e.saltadas, a.tienda];
      return { ...e, saltadas, actual: siguientePorAvisar(e.recorrido, a.tienda, new Set(a.avisadas), new Set(saltadas)) };
    }
    case 'elegir':
      return e.recorrido.includes(a.tienda) ? { ...e, actual: a.tienda, saltadas: e.saltadas.filter((k) => k !== a.tienda) } : e;
    case 'volverASaltadas':
      return { ...e, saltadas: [], actual: siguientePorAvisar(e.recorrido, null, new Set(a.avisadas), new Set()) };
  }
}

/** Posición 1-based de la tienda actual dentro del recorrido («1 de 10»). */
export function posicionEnRecorrido(e: EstadoAvisar): number {
  return e.actual === null ? e.recorrido.length : e.recorrido.indexOf(e.actual) + 1;
}
