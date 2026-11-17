/**
 * Datos de Muestras › Pendientes (ui-muestras-cola): la consulta de pendientes, la lista ESTABLE (nunca se reordena
 * sola, 01 §4.16), la prioridad «aceptada» por fila (para que una sincronización no mueva filas de sección hasta
 * «Actualizar»), conteos que bajan al instante (contarTrabajo) y la oferta única «¿Reordenamos tu plan?» al pasar el
 * punto de control 2 de la primera sincronización (C34, 01 §4.5 regla 6, BUILD §8.5 (b)).
 */
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type * as C from '@/contrato';
import type { EstadoConsulta, ParamsMuestras } from '@/datos';
import { usePrimeraVez } from '@/app';
import { useAcciones, useConsulta, useListaEstable, useSesion, useSync } from '@/datos';
import { contarTrabajo, hoyLocal, type ConteosTrabajo } from '@/dominio';
import { useToast } from '@/componentes';
import { esPrimeraSync, estadoPlan, faltanVentas, hayAvisosEnviados, opsReordenarPlan, pasoPuntoControl2, type EstadoPlanCola } from './logica';
import { T } from './textos';

/** Pendientes = Por vencer + Vencidas + Pausadas (01 §2.5), en el orden sugerido del hub. */
export const PARAMS_PENDIENTES: ParamsMuestras = { grupo: ['pausada', 'por_vencer', 'vencida'], orden: 'prioridad' };
/** «En revisión de TikTok» (sección informativa de 01 §4.2): no son pendientes, se piden aparte solo si existen. */
export const PARAMS_EN_REVISION: ParamsMuestras = { grupo: ['en_revision'], orden: 'prioridad' };

const idDe = (m: C.MuestraVista): string => m.application_id;
const SIN_MUESTRAS: C.MuestraVista[] = [];

export interface Cola {
  consulta: EstadoConsulta<C.MuestrasResponse>;
  /** Orden estable (el que el usuario ya ve). Pendientes + «En revisión» al final (su sección va aparte). */
  items: C.MuestraVista[];
  /** El orden que llegó del hub (para reacomodar el plan con la oferta). */
  entrantes: C.MuestraVista[];
  hayOrdenNuevo: boolean;
  aplicarOrdenNuevo(): void;
  /** Prioridad aceptada por fila: la que define la sección hasta que se actualiza el orden. */
  prioridades: ReadonlyMap<string, C.NivelPrioridad | null>;
  conteos: ConteosTrabajo;
  plan: EstadoPlanCola;
  avisos: C.AvisoTienda[] | undefined;
  hoy: C.FechaLocal;
  /** «Orden provisional: faltan tus ventas» (01 §2.6, §4.16). */
  ordenProvisional: boolean;
  primeraSync: boolean;
  syncEstado: C.SyncEstado | null;
  /** Conteos globales por grupo de TikTok (encabezado: «· 6 entregadas · 65 sin envío»). */
  porGrupo: Partial<Record<C.GrupoMuestra, number>>;
  /** Última sincronización con éxito (banner «Te mostramos las del {fecha}»). */
  ultimaSyncAt: C.EpochS | null;
}

export function useCola(): Cola {
  const consulta = useConsulta('muestras', PARAMS_PENDIENTES);
  const porGrupo: Partial<Record<C.GrupoMuestra, number>> = consulta.datos?.por_grupo ?? {};
  const conRevision = (porGrupo.en_revision ?? 0) > 0;
  const revision = useConsulta('muestras', PARAMS_EN_REVISION, { activa: conRevision });
  const avisosQ = useConsulta('avisos', {});
  const sesion = useSesion();
  const { estado } = useSync();
  const hoy = hoyLocal();

  // Si el transporte no filtra (o el hub devuelve de más), la cola solo admite sus grupos.
  const entrantes = useMemo(() => {
    const pend = consulta.datos?.items;
    if (pend === undefined) return undefined;
    const permitidos = new Set(PARAMS_PENDIENTES.grupo ?? []);
    const base = pend.filter((m) => permitidos.has(m.grupo));
    const rev = conRevision ? (revision.datos?.items ?? SIN_MUESTRAS).filter((m) => m.grupo === 'en_revision') : SIN_MUESTRAS;
    return rev.length > 0 ? [...base, ...rev] : base;
  }, [consulta.datos, revision.datos, conRevision]);
  const estable = useListaEstable(entrantes, idDe);

  // Prioridad y Nº en la cola «aceptados»: se fijan la primera vez que se ve cada fila y se renuevan solo al aplicar el
  // orden nuevo. Así una sincronización no mueve filas de sección ni deja la lista numerada «1, 5, 2…» (el orden
  // visible es el anterior y su número también) hasta que el usuario pulsa «Actualizar».
  const aceptadas = useRef(new Map<string, C.NivelPrioridad | null>());
  const posiciones = useRef(new Map<string, number | null>());
  const [version, renovar] = useReducer((n: number) => n + 1, 0);
  for (const m of estable.items) {
    if (!aceptadas.current.has(m.application_id)) aceptadas.current.set(m.application_id, m.prioridad);
    if (!posiciones.current.has(m.application_id)) posiciones.current.set(m.application_id, m.posicion_cola);
  }
  const prioridadCambio = estable.items.some((m) => aceptadas.current.get(m.application_id) !== m.prioridad || posiciones.current.get(m.application_id) !== m.posicion_cola);
  const { aplicarOrdenNuevo: aplicarEstable } = estable;
  const aplicarOrdenNuevo = useCallback(() => {
    aceptadas.current = new Map();
    posiciones.current = new Map();
    aplicarEstable();
    renovar();
  }, [aplicarEstable]);
  // `version` renueva la copia al aplicar el orden nuevo.
  const prioridades = useMemo(() => new Map(aceptadas.current), [estable.items, version]);
  const items = useMemo(
    () =>
      estable.items.map((m) => {
        const pos = posiciones.current.get(m.application_id);
        return pos === undefined || pos === m.posicion_cola ? m : { ...m, posicion_cola: pos };
      }),
    // `version` renueva los números al aplicar el orden nuevo.
    [estable.items, version],
  );

  const avisos = avisosQ.datos?.items;
  const conteos = useMemo(() => contarTrabajo(items, avisos ?? [], hoy), [items, avisos, hoy]);
  const plan = useMemo(() => estadoPlan(items, hoy), [items, hoy]);
  const primeraSync = esPrimeraSync(sesion.datos?.datos.ultima_sync_ok_at, estado);

  return {
    consulta,
    items,
    entrantes: entrantes ?? SIN_MUESTRAS,
    hayOrdenNuevo: estable.hayOrdenNuevo || prioridadCambio,
    aplicarOrdenNuevo,
    prioridades,
    conteos,
    plan,
    avisos,
    hoy,
    ordenProvisional: faltanVentas(estado, primeraSync),
    primeraSync,
    syncEstado: estado,
    porGrupo,
    ultimaSyncAt: sesion.datos?.datos.ultima_sync_ok_at ?? estado?.ultima_ok_at ?? null,
  };
}

export interface OfertaReordenar {
  visible: boolean;
  conPlan: boolean;
  reordenar(): Promise<void>;
  dejarAsi(): void;
}

/**
 * Oferta única (01 §4.5 regla 6): ya pasó el punto de control 2 de la primera sincronización (las ventas de 180 días
 * llegaron), el orden sugerido cambió (la lista visible tiene «un orden nuevo» o el plan quedaría distinto) y todavía no
 * hay avisos enviados → se ofrece UNA vez en este equipo (usePrimeraVez('reordenar-ventas')). [Reordenar] aplica el
 * orden nuevo y, si hay plan, reparte sus mismas fechas en el orden nuevo (la fecha de término no cambia) con un solo
 * Deshacer. [Dejar así] la descarta (la lista conserva su orden y sigue el aviso «Hay un orden nuevo · Actualizar»).
 */
export function useOfertaReordenar(cola: Cola): OfertaReordenar {
  const [esPrimera, marcarVisto] = usePrimeraVez('reordenar-ventas');
  const [visible, setVisible] = useState(false);
  const acciones = useAcciones();
  const toast = useToast();
  const { syncEstado, primeraSync, entrantes, aplicarOrdenNuevo } = cola;

  const opsPlan = useMemo(() => opsReordenarPlan(entrantes), [entrantes]);
  const sinAvisos = cola.avisos !== undefined && !hayAvisosEnviados(cola.avisos);
  const cambioOrden = cola.hayOrdenNuevo || opsPlan.length > 0;
  const toca = esPrimera && sinAvisos && cambioOrden && pasoPuntoControl2(syncEstado, primeraSync);
  useEffect(() => {
    if (visible || !toca) return;
    setVisible(true);
    marcarVisto();
  }, [visible, toca, marcarVisto]);

  const reordenar = useCallback(async (): Promise<void> => {
    setVisible(false);
    aplicarOrdenNuevo();
    if (opsPlan.length === 0) {
      toast.mostrar({ texto: T.reordenado, tono: 'ok' });
      return;
    }
    const r = await acciones.lote(opsPlan);
    if (r.estado === 'error' || r.estado === 'conflicto') {
      toast.mostrar({ texto: T.noSePudo, tono: 'error' });
      return;
    }
    toast.mostrar({ texto: T.reordenadoPlan(opsPlan.length), tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
  }, [opsPlan, aplicarOrdenNuevo, acciones, toast]);

  const dejarAsi = useCallback(() => setVisible(false), []);
  return { visible, conPlan: cola.plan.hayPlan, reordenar, dejarAsi };
}
