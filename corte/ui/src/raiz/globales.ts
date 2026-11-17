/**
 * @/raiz · comportamientos globales que monta la App una sola vez (BUILD_SPEC §8.4):
 * - atributos de <html> con la tabla EXACTA de §8.4 (C48) + avisarTemaNativo;
 * - atajos globales de 01 §3.6 (G + letra, Ctrl+K, '?', Ctrl+R/F5, Ctrl+Z → deshacerUltimo con Toast);
 * - notificaciones locales: calcularNotificaciones → programarNotificaciones con antirrebote de 2 s (C32/C44);
 * - eventos del hub: ventana.mostrar_ruta, fin de sincronización (aviso con resumen) y recordatorio.vencido (Toast si la
 *   ventana está visible, C44);
 * - aperturas de la paleta desde fuera (evento corte:buscar, ?buscar=1) y el botón Atrás de Android;
 * - reloj de demostración (solo `npm run dev:demo`).
 */
import { useEffect, useLayoutEffect, useRef } from 'react';
import type { EventoHub, SessionResponse, SyncEstado } from '@/contrato';
import { ErrorHub, useAcciones, useConsulta, useEventoHub, useSync } from '@/datos';
import { useToast, type DatosToast } from '@/componentes';
import { ahoraS, calcularNotificaciones, fijarReloj } from '@/dominio';
import { avisarTemaNativo, programarNotificaciones, registrarAtras, type NotificacionProgramada, type PlataformaUi } from '@/plataforma';
import { registrarAtajos } from '../app/atajos';
import { modoDemo } from '../app/entorno';
import { atras, fijarParametro, navegar, profundidadHistorial, rutaActual, useRuta } from '../app/navegacion';
import { aplicarAtributos, calcularAtributos, temaVisible, useEntradaAtributos } from '../app/tema';
import { abrirAtajos, abrirPaleta, alternarPaleta, cerrarPaleta, EVENTO_BUSCAR } from './capasGlobales';
import { PARAMS_PENDIENTES } from './datosMarco';
import { T } from './textos';

// ---------------------------------------------------------------------------------------------- <html> (C48)

export function useAtributosHtml(): void {
  const entrada = useEntradaAtributos();
  const a = calcularAtributos(entrada);
  const visible = temaVisible(a, entrada.sistemaOscuro);
  const firma = [a['data-theme'], a['data-density'], a['data-platform'], a['data-glass'], a['data-reduced-motion'], a['data-motion'], a.guardar].join('|');
  const ultimo = useRef(a);
  ultimo.current = a;
  useLayoutEffect(() => {
    aplicarAtributos(document.documentElement, ultimo.current);
  }, [firma]);
  useEffect(() => {
    avisarTemaNativo(visible);
  }, [visible]);
}

// ---------------------------------------------------------------------------------------------- Ctrl+Z

/** Ctrl+Z global (01 §3.6, BUILD §8.5 (d)): deshacerUltimo() y un Toast con el resultado. El rechazo (conflicto) se avisa. */
export async function deshacerConAviso(deshacerUltimo: () => Promise<boolean>, mostrar: (t: DatosToast) => void): Promise<void> {
  try {
    const hubo = await deshacerUltimo();
    mostrar(hubo ? { texto: T.deshecho, tono: 'ok' } : { texto: T.nadaQueDeshacer, tono: 'info' });
  } catch (e: unknown) {
    mostrar({ texto: e instanceof ErrorHub ? e.mensaje : T.noSeDeshizo, tono: 'error' });
  }
}

// ---------------------------------------------------------------------------------------------- atajos globales

const IR_A: ReadonlyArray<[string, string, string]> = [
  ['g i', '/inicio', T.atajoIrInicio],
  ['g g', '/videos/generar', T.atajoIrGenerar],
  ['g m', '/muestras', T.atajoIrMuestras],
  ['g t', '/tiendas', T.atajoIrTiendas],
  ['g v', '/ventas', T.atajoIrVentas],
  ['g d', '/videos', T.atajoIrVideos],
  ['g p', '/productos', T.atajoIrProductos],
];

export function useAtajosGlobales(e: { sincronizar: () => void; deshacer: () => void }): void {
  const ref = useRef(e);
  ref.current = e;
  useEffect(() => {
    const navegacion = registrarAtajos(
      () => [
        ...IR_A.map(([teclas, a, descripcion]) => ({ teclas, descripcion, accion: () => navegar(a) })),
        { teclas: 'shift+?', descripcion: T.atajoVerAtajos, accion: abrirAtajos },
        { teclas: 'ctrl+z', descripcion: T.atajoDeshacer, accion: () => ref.current.deshacer() },
      ],
      { grupo: 'Global', oculto: true },
    );
    // Ctrl+K funciona aunque el foco esté en un campo.
    const busqueda = registrarAtajos(() => [{ teclas: 'ctrl+k', descripcion: T.atajoBuscar, accion: alternarPaleta }], { grupo: 'Global', oculto: true, enCampos: true });
    // Ctrl+R y F5 nunca recargan el WebView: sincronizan (01 §3.6), también con un diálogo abierto.
    const recarga = registrarAtajos(
      () => [
        { teclas: 'ctrl+r', descripcion: T.atajoSincronizar, accion: () => ref.current.sincronizar() },
        { teclas: 'F5', descripcion: T.atajoSincronizar, accion: () => ref.current.sincronizar() },
      ],
      { grupo: 'Global', oculto: true, enCampos: true, siempre: true },
    );
    return () => {
      navegacion.quitar();
      busqueda.quitar();
      recarga.quitar();
    };
  }, []);
}

/** Sincronizar desde un atajo o una acción global: si no se puede (Android sin la PC), no hace nada. */
export function useSincronizarConAviso(): () => void {
  const sync = useSync();
  const toast = useToast();
  const ref = useRef({ sync, toast });
  ref.current = { sync, toast };
  return useRef(() => {
    const { sync: s, toast: t } = ref.current;
    if (!s.puede || s.estado?.en_curso) return;
    s.sincronizar().catch((err: unknown) => t.mostrar({ texto: err instanceof ErrorHub ? err.mensaje : 'No pudimos empezar a sincronizar.', tono: 'error' }));
  }).current;
}

export function useDeshacerGlobal(): () => void {
  const acciones = useAcciones();
  const toast = useToast();
  const ref = useRef({ acciones, toast });
  ref.current = { acciones, toast };
  return useRef(() => {
    void deshacerConAviso(() => ref.current.acciones.deshacerUltimo(), (t) => ref.current.toast.mostrar(t));
  }).current;
}

// ---------------------------------------------------------------------------------------------- notificaciones (C32, C44)

export const ANTIRREBOTE_NOTIFICACIONES_MS = 2000;
const SIN_PARAMS = {};
const ACTIVOS = { estado: 'activo' } as const;

/**
 * Recalcula las notificaciones locales cuando cambian muestras, plan, avisos, recordatorios o preferencias y las
 * entrega a la plataforma 2 s después del último cambio (reemplaza TODO lo programado). Una lista idéntica no se vuelve
 * a mandar.
 */
export function useNotificaciones(activa: boolean): void {
  const muestras = useConsulta('muestras', PARAMS_PENDIENTES, { activa });
  const plan = useConsulta('plan', SIN_PARAMS, { activa });
  const avisos = useConsulta('avisos', SIN_PARAMS, { activa });
  const recordatorios = useConsulta('recordatorios', ACTIVOS, { activa });
  const preferencias = useConsulta('preferencias', SIN_PARAMS, { activa });
  const enviada = useRef<string | null>(null);
  const m = muestras.datos?.items;
  const pl = plan.datos?.items;
  const av = avisos.datos?.items;
  const re = recordatorios.datos?.items;
  const pr = preferencias.datos;

  useEffect(() => {
    if (!activa || !m || !pr) return undefined;
    const t = window.setTimeout(() => {
      let lista: NotificacionProgramada[];
      try {
        lista = calcularNotificaciones({ muestras: m, planes: pl ?? [], avisos: av ?? [], recordatorios: re ?? [], preferencias: pr, ahora: ahoraS() });
      } catch {
        return;
      }
      const firma = JSON.stringify(lista);
      if (firma === enviada.current) return;
      enviada.current = firma;
      void programarNotificaciones(lista).catch(() => {
        enviada.current = null;
      });
    }, ANTIRREBOTE_NOTIFICACIONES_MS);
    return () => window.clearTimeout(t);
  }, [activa, m, pl, av, re, pr]);
}

// ---------------------------------------------------------------------------------------------- eventos del hub

/** Pedidos nuevos y muestras que cambiaron de estado en una sincronización (01 §4.16 «Fin de sincronización»). */
export function resumenSync(estado: SyncEstado): { pedidos: number; muestras: number } {
  let pedidos = 0;
  let muestras = 0;
  for (const p of estado.pasos) {
    if (p.paso === 'ordenes' || p.paso === 'ordenes_anteriores') pedidos += p.nuevos;
    if (p.paso === 'muestras' || p.paso === 'cumplimientos') muestras = Math.max(muestras, p.cambiados);
  }
  return { pedidos, muestras };
}

export function useEventosGlobales(): void {
  const toast = useToast();
  const ref = useRef(toast);
  ref.current = toast;
  useEventoHub((e: EventoHub) => {
    if (e.tipo === 'ventana.mostrar_ruta') {
      navegar(e.ruta);
    } else if (e.tipo === 'recordatorio.vencido') {
      // C44: el globo sale de la lista programada; aquí solo el Toast dentro de la app si la ventana se ve.
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        ref.current.mostrar({ texto: e.recordatorio.titulo, detalle: T.recordatorio, tono: 'info' });
      }
    } else if (e.tipo === 'sync.fin') {
      const s = e.estado;
      if (s.ultima_estado !== 'ok' && s.ultima_estado !== 'parcial') return;
      const r = resumenSync(s);
      const hubo = r.pedidos > 0 || r.muestras > 0;
      // Las automáticas sin cambios no avisan (cada 30 min sería ruido); las que pidió el usuario siempre.
      if (!hubo && s.origen !== 'usuario' && s.origen !== 'telefono') return;
      ref.current.mostrar({
        texto: T.finSync(r.pedidos, r.muestras),
        tono: 'ok',
        ...(hubo ? { accion: { etiqueta: T.verCambios, alPulsar: () => navegar(r.muestras > 0 ? '/muestras' : '/ventas') } } : {}),
      });
    }
  });
}

// ---------------------------------------------------------------------------------------------- aperturas de la paleta

export function useAperturasPaleta(): void {
  const r = useRuta();
  const pedir = r.consulta.get('buscar');
  useEffect(() => {
    const alPedir = (): void => abrirPaleta();
    window.addEventListener(EVENTO_BUSCAR, alPedir);
    return () => window.removeEventListener(EVENTO_BUSCAR, alPedir);
  }, []);
  useEffect(() => {
    if (pedir === null) return;
    // `?buscar=1` abre la paleta vacía; `?buscar=chaqueta`, ya con esa búsqueda.
    abrirPaleta(pedir === '1' ? '' : pedir);
    fijarParametro('buscar', null, { reemplazar: true });
  }, [pedir]);
}

// ---------------------------------------------------------------------------------------------- botón Atrás (Android, 01 §3.3)

/**
 * Último eslabón de la pila de Atrás: vuelve al nivel anterior → a Inicio → deja que la app pase a segundo plano.
 * Las hojas, la búsqueda y la selección registran sus propios manejadores encima (el último decide primero).
 */
export function useAtrasAndroid(plataforma: PlataformaUi, paletaAbierta: boolean): void {
  useEffect(() => {
    if (plataforma !== 'android') return undefined;
    return registrarAtras(() => {
      if (rutaActual() === '/inicio' && profundidadHistorial() === 0) return false;
      atras();
      return true;
    });
  }, [plataforma]);
  useEffect(() => {
    if (plataforma !== 'android' || !paletaAbierta) return undefined;
    return registrarAtras(() => {
      cerrarPaleta();
      return true;
    });
  }, [plataforma, paletaAbierta]);
}

// ---------------------------------------------------------------------------------------------- reloj de demostración

let relojAnclado = false;

/**
 * Solo en `npm run dev:demo`: los fixtures son una foto del 12 nov 2026 (01 §6.7). Para que «hoy», «Actualizado hace
 * 4 min», el plan y los vencimientos cuadren con esos datos, el reloj de @/dominio arranca 4 minutos después de la
 * última sincronización de la sesión de demostración y avanza con el tiempo real. Nunca en `vite build` ni con el hub.
 */
export function anclarRelojDemo(sesion: SessionResponse | undefined): boolean {
  if (relojAnclado || !modoDemo() || !sesion) return relojAnclado;
  // Sin sincronización terminada (escenario «sincronizando»), el inicio de la que está en curso.
  const ultima = sesion.datos.ultima_sync_ok_at ?? sesion.sync.iniciada_at;
  if (ultima === null) return false;
  const ancla = ultima + 240;
  const inicio = Date.now();
  fijarReloj(() => ancla + Math.floor((Date.now() - inicio) / 1000));
  relojAnclado = true;
  return true;
}
