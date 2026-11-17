/**
 * @/bloques · operaciones sobre el avance de una muestra (01 §2.4): crea o edita su PlanVideo con opCambioEtapa, muestra
 * el Toast con Deshacer de 6 s, el texto de C26 en los conflictos (409) y el de la cola en Android sin conexión.
 * También la ocupación por día (Planear, Mover, Agenda) con la capacidad de las preferencias.
 */
import { useCallback, useMemo } from 'react';
import type * as C from '@/contrato';
import { useAcciones, useConsulta, useSesion, type OpSinId, type ResultadoAccion, type ResultadoLote } from '@/datos';
import { useToast } from '@/componentes';
import { navegar } from '@/app';
import {
  ETIQUETA_ETAPA, diaSemana, formato, hoyLocal, nuevoId, opCambioEtapa, sumarDias, validarEtapa, type DatosEtapa, type OperacionPlan,
} from '@/dominio';
import { T } from '../textos';
import { nombreDe } from '../util/comun';

/** Preferencias por omisión mientras llegan las del hub (01 §4.5: 3 por día, lunes a sábado). */
export const PREFERENCIAS_OMISION: Pick<C.PreferenciasSincronizadas, 'capacidad_videos_dia' | 'dias_videos' | 'programo_mis_videos' | 'firma' | 'orden_plan'> = {
  capacidad_videos_dia: 3,
  dias_videos: [0, 1, 2, 3, 4, 5],
  programo_mis_videos: false,
  firma: '',
  orden_plan: 'sugerido',
};

export function usePreferencias(): Pick<C.PreferenciasSincronizadas, 'capacidad_videos_dia' | 'dias_videos' | 'programo_mis_videos' | 'firma' | 'orden_plan'> & { rev: number | null } {
  const p = useConsulta('preferencias', {});
  const d = p.datos;
  return useMemo(() => ({
    capacidad_videos_dia: d?.capacidad_videos_dia ?? PREFERENCIAS_OMISION.capacidad_videos_dia,
    dias_videos: d?.dias_videos ?? PREFERENCIAS_OMISION.dias_videos,
    programo_mis_videos: d?.programo_mis_videos ?? PREFERENCIAS_OMISION.programo_mis_videos,
    firma: d?.firma ?? PREFERENCIAS_OMISION.firma,
    orden_plan: d?.orden_plan ?? PREFERENCIAS_OMISION.orden_plan,
    rev: d?.rev ?? null,
  }), [d]);
}

/** @usuario de la cuenta (para el placeholder del enlace y {link_video}). */
export function useUsername(): string | null {
  const s = useSesion();
  return s.datos?.cuenta?.username ?? null;
}

const OCUPAN: ReadonlySet<C.EtapaAvance> = new Set<C.EtapaAvance>(['planeada', 'video_listo', 'programada']);

export interface Ocupacion {
  /** Videos ya planeados por día (planeada, video listo o programada). */
  porDia: Record<C.FechaLocal, number>;
  capacidad: number;
  dias: number[];
  /** Mapa para SelectorFecha (usados/capacidad) de los próximos `n` días desde hoy. */
  mapa(desde: C.FechaLocal, n: number, excluir?: string): Record<C.FechaLocal, { usados: number; capacidad: number }>;
  /** Primer día de videos con lugar desde `desde` (excluye la muestra que se mueve). */
  siguienteLibre(desde: C.FechaLocal, excluir?: string, hasta?: C.FechaLocal | null): C.FechaLocal | null;
  usados(fecha: C.FechaLocal, excluir?: string): number;
}

/** Ocupación por día desde el plan vivo (GET /api/plan) y la capacidad de las preferencias. */
export function useOcupacion(): Ocupacion {
  const plan = useConsulta('plan', {});
  const prefs = usePreferencias();
  const items = plan.datos?.items;
  return useMemo(() => {
    const porMuestra = new Map<string, C.FechaLocal>();
    const sueltos: C.FechaLocal[] = [];
    for (const p of items ?? []) {
      if (p.fecha_plan === null || !OCUPAN.has(p.estado)) continue;
      if (p.application_id === null) sueltos.push(p.fecha_plan);
      else porMuestra.set(p.application_id, p.fecha_plan);
    }
    const usados = (fecha: C.FechaLocal, excluir?: string): number => {
      let n = 0;
      for (const [id, f] of porMuestra) if (f === fecha && id !== excluir) n += 1;
      for (const f of sueltos) if (f === fecha) n += 1;
      return n;
    };
    const porDia: Record<C.FechaLocal, number> = {};
    for (const f of porMuestra.values()) porDia[f] = (porDia[f] ?? 0) + 1;
    for (const f of sueltos) porDia[f] = (porDia[f] ?? 0) + 1;
    const capacidad = Math.max(1, prefs.capacidad_videos_dia);
    const dias = prefs.dias_videos;
    return {
      porDia,
      capacidad,
      dias,
      usados,
      mapa(desde, n, excluir) {
        const salida: Record<C.FechaLocal, { usados: number; capacidad: number }> = {};
        for (let i = 0; i < n; i++) {
          const f = sumarDias(desde, i);
          if (!dias.includes(diaSemana(f))) continue;
          salida[f] = { usados: usados(f, excluir), capacidad };
        }
        return salida;
      },
      siguienteLibre(desde, excluir, hasta) {
        for (let i = 0; i < 400; i++) {
          const f = sumarDias(desde, i);
          if (hasta && f > hasta) return null;
          if (!dias.includes(diaSemana(f))) continue;
          if (usados(f, excluir) < capacidad) return f;
        }
        return null;
      },
    };
  }, [items, prefs.capacidad_videos_dia, prefs.dias_videos]);
}

/** Texto del Toast de cada etapa (02 §7.14: «Video listo · Deshacer»). */
export function textoToastEtapa(etapa: C.EtapaAvance, datos: DatosEtapa): string {
  switch (etapa) {
    case 'planeada':
      return datos.fecha_plan ? T.planeadaParaEl(formato.fechaConDia(datos.fecha_plan)) : ETIQUETA_ETAPA.planeada;
    case 'video_listo':
      return T.toastVideoListo;
    case 'programada':
      return datos.programada_para_at !== undefined
        ? T.programadaParaEl(formato.fechaConDia(datos.programada_para_at), formato.hora(datos.programada_para_at))
        : T.programada;
    case 'publicada':
      return T.toastPublicada;
    case 'no_se_puede':
      return T.toastNoSePuede;
    case 'por_planear':
      return T.toastPorPlanear;
  }
}

export interface OpcionesResultado {
  /** Muestra afectada: el [Ver] del conflicto abre su detalle. */
  solicitud?: string;
  /** Detalle opcional del Toast. */
  detalle?: string;
  /** Sin Toast (la pantalla de éxito lo reemplaza). */
  silencioso?: boolean;
}

export interface Operaciones {
  /** «Fijar arriba» / «Quitar de arriba»: solo cambia `fijada` del plan vivo (lo crea en Por planear si no existe). */
  aplicarFijada(m: C.MuestraVista, fijada: boolean): Promise<ResultadoAccion<C.PlanVideo>>;
  /** Pasa la muestra a `etapa` con los datos que pide (valida como el hub); null si no pasó la validación. */
  aplicarEtapa(m: C.MuestraVista, etapa: C.EtapaAvance, datos: DatosEtapa, opciones?: OpcionesResultado & { texto?: string }): Promise<ResultadoAccion<C.PlanVideo> | null>;
  /** Varias operaciones con UN solo Deshacer (paquetes, plan, recorrer). */
  aplicarLote(ops: OperacionPlan[], texto: string, opciones?: OpcionesResultado): Promise<ResultadoLote | null>;
  /** Toast con Deshacer / C26 / cola / error para un resultado ya obtenido. */
  avisarResultado(r: { estado: ResultadoAccion<unknown>['estado']; error: { mensaje: string } | null; deshacer(): Promise<void> }, texto: string, opciones?: OpcionesResultado): void;
}

/** De OperacionPlan (@/dominio) a la OpLocal sin op_id que recibe acciones.lote. */
export function aOpLocal(op: OperacionPlan): OpSinId {
  return op.tipo === 'plan.crear' ? { tipo: 'plan.crear', datos: op.datos } : { tipo: 'plan.editar', id: op.id, cambios: op.cambios };
}

export function useOperaciones(): Operaciones {
  const acciones = useAcciones();
  const toast = useToast();

  const avisarResultado = useCallback<Operaciones['avisarResultado']>((r, texto, opciones) => {
    if (r.estado === 'conflicto') {
      const id = opciones?.solicitud;
      toast.mostrar({
        texto: T.conflicto,
        tono: 'info',
        ...(id ? { accion: { etiqueta: T.ver, alPulsar: () => navegar(`/muestras/m/${encodeURIComponent(id)}`) } } : {}),
      });
      return;
    }
    if (r.estado === 'error') {
      toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
      return;
    }
    if (opciones?.silencioso) return;
    const detalle = r.estado === 'en_cola' ? T.enCola : opciones?.detalle;
    toast.mostrar({
      texto,
      tono: 'ok',
      ...(detalle ? { detalle } : {}),
      accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() },
      duracion_ms: 6000,
    });
  }, [toast]);

  const aplicarEtapa = useCallback<Operaciones['aplicarEtapa']>(async (m, etapa, datos, opciones) => {
    const error = validarEtapa(etapa, datos);
    if (error) {
      toast.mostrar({ texto: error, tono: 'error' });
      return null;
    }
    const op = opCambioEtapa(m, etapa, datos, hoyLocal());
    const r = op.tipo === 'plan.crear' ? await acciones.crearPlan(op.datos) : await acciones.editarPlan(op.id, op.cambios);
    avisarResultado(r, opciones?.texto ?? textoToastEtapa(etapa, datos), { solicitud: m.application_id, ...opciones });
    return r;
  }, [acciones, avisarResultado, toast]);

  const aplicarFijada = useCallback<Operaciones['aplicarFijada']>(async (m, fijada) => {
    const a = m.avance;
    const r = a.plan_id
      ? await acciones.editarPlan(a.plan_id, { fijada, rev: a.rev })
      : await acciones.crearPlan({
        id: nuevoId(),
        titulo: Array.from(nombreDe(m.producto) || T.videoDeMuestra).slice(0, 200).join(''),
        application_id: m.application_id,
        product_id: m.producto.product_id,
        tienda_key: m.tienda.tienda_key,
        estado: a.etapa,
        fijada,
      });
    avisarResultado(r, fijada ? T.toastFijada : T.toastDesfijada, { solicitud: m.application_id });
    return r;
  }, [acciones, avisarResultado]);

  const aplicarLote = useCallback<Operaciones['aplicarLote']>(async (ops, texto, opciones) => {
    if (ops.length === 0) return null;
    const r = await acciones.lote(ops.map(aOpLocal));
    const primerError = r.resultados.find((x) => x.estado === 'invalida' || x.estado === 'conflicto');
    avisarResultado(
      {
        estado: r.estado,
        error: r.estado === 'error' ? { mensaje: primerError?.error ?? T.errorGenerico } : null,
        deshacer: r.deshacer,
      },
      texto,
      opciones,
    );
    return r;
  }, [acciones, avisarResultado]);

  return useMemo(() => ({ aplicarFijada, aplicarEtapa, aplicarLote, avisarResultado }), [aplicarFijada, aplicarEtapa, aplicarLote, avisarResultado]);
}
