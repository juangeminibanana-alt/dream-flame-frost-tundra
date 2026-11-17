/**
 * PestanasMuestras (01 §4.2 encabezado): «Pendientes 12 · Agenda · Todas 80» + UNA acción principal según el estado
 * del plan —sin plan [Armar mi plan]; con plan y tiendas por avisar [Avisar a mis tiendas]; con plan, todas avisadas y
 * videos para hoy [Empezar sesión de videos]— y las otras en ⋯ junto con «Rehacer mi plan». En angosto (celular) solo
 * las pestañas a todo el ancho: la acción va en el botón flotante de la pantalla (01 §4.2 Celular).
 */
import { useMemo, type ReactElement } from 'react';
import { Boton, Menu, type OpcionMenu } from '@/componentes';
import { navegar } from '@/app';
import { useConsulta } from '@/datos';
import { contarTrabajo, esPendiente, formato, hoyLocal } from '@/dominio';
import { T } from '../textos';
import { PARAMS_PENDIENTES, cx } from '../util/comun';
import css from './PestanasMuestras.module.css';

type Pestana = 'pendientes' | 'agenda' | 'todas';

const RUTA: Readonly<Record<Pestana, string>> = { pendientes: '/muestras', agenda: '/muestras/agenda', todas: '/muestras/todas' };

export interface EstadoAccionesMuestras {
  conPlan: boolean;
  tiendasPorAvisar: number;
  paraHoy: number;
  pendientes: number;
}

/** Cuál es LA acción principal (01 §4.2). */
export function accionPrincipalMuestras(e: EstadoAccionesMuestras): 'plan' | 'avisar' | 'sesion' | null {
  if (e.pendientes === 0) return null;
  if (!e.conPlan) return 'plan';
  if (e.tiendasPorAvisar > 0) return 'avisar';
  if (e.paraHoy > 0) return 'sesion';
  return null;
}

export function useEstadoAccionesMuestras(): EstadoAccionesMuestras & { total: number | null } {
  const pendientes = useConsulta('muestras', PARAMS_PENDIENTES);
  const avisos = useConsulta('avisos', {});
  const tablero = useConsulta('dashboard', { periodo: '30d' });
  return useMemo(() => {
    const items = (pendientes.datos?.items ?? []).filter(esPendiente);
    const hoy = hoyLocal();
    const conteo = contarTrabajo(items, avisos.datos?.items ?? [], hoy);
    const conPlan = items.some((m) => m.avance.etapa !== 'por_planear');
    const paraHoy = items.filter((m) => m.avance.etapa === 'planeada' && m.avance.fecha_planeada !== null && m.avance.fecha_planeada <= hoy).length;
    return { conPlan, tiendasPorAvisar: conteo.tiendas_por_avisar, paraHoy, pendientes: items.length, total: tablero.datos?.muestras.total ?? null };
  }, [pendientes.datos, avisos.datos, tablero.datos]);
}

export function PestanasMuestras(p: { activa: Pestana; className?: string }): ReactElement {
  const e = useEstadoAccionesMuestras();
  const principal = accionPrincipalMuestras(e);
  const acciones: Record<'plan' | 'avisar' | 'sesion', { etiqueta: string; ir: () => void }> = {
    plan: { etiqueta: e.conPlan ? T.rehacerMiPlan : T.armarMiPlan, ir: () => navegar('/muestras/plan') },
    avisar: { etiqueta: T.avisarMisTiendas, ir: () => navegar('/muestras/avisos') },
    sesion: { etiqueta: T.empezarSesion, ir: () => navegar('/muestras/sesion') },
  };
  const otras: OpcionMenu[] = (['plan', 'avisar', 'sesion'] as const)
    .filter((a) => a !== principal)
    .map((a) => ({ id: a, etiqueta: acciones[a].etiqueta, icono: a === 'plan' ? 'CalendarDays' : a === 'avisar' ? 'MessageCircle' : 'Clapperboard', alPulsar: acciones[a].ir }));
  const pestanas: Array<{ id: Pestana; etiqueta: string; conteo: number | null }> = [
    { id: 'pendientes', etiqueta: T.pendientes, conteo: e.pendientes },
    { id: 'agenda', etiqueta: T.agenda, conteo: null },
    { id: 'todas', etiqueta: T.todas, conteo: e.total },
  ];
  return (
    <div className={cx(css.raiz, p.className)}>
      <nav className={css.pestanas} aria-label={T.vistasMuestras}>
        {pestanas.map((t) => (
          <a
            key={t.id}
            href={`#${RUTA[t.id]}`}
            className={cx(css.pestana, t.id === p.activa && css.activa)}
            aria-current={t.id === p.activa ? 'page' : undefined}
            onClick={(ev) => {
              ev.preventDefault();
              navegar(RUTA[t.id]);
            }}
          >
            {t.etiqueta}
            {t.conteo !== null ? <span className={cx(css.conteo, t.id === 'pendientes' && t.conteo > 0 && css.conteoAtencion)}>{formato.numero(t.conteo)}</span> : null}
          </a>
        ))}
      </nav>
      <div className={css.acciones}>
        {principal ? (
          <Boton variante="primario" icono={principal === 'plan' ? 'CalendarDays' : principal === 'avisar' ? 'MessageCircle' : 'Clapperboard'} alPulsar={acciones[principal].ir}>
            {principal === 'plan' && !e.conPlan ? T.armarMiPlanUnMinuto : acciones[principal].etiqueta}
          </Boton>
        ) : null}
        <Menu etiqueta={T.masAcciones} opciones={otras} />
      </div>
    </div>
  );
}
