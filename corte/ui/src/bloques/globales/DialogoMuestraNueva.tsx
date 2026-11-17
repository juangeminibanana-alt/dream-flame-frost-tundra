/**
 * DialogoMuestraNueva (rev. 3.1 · 01 §5.5 paso 4): cuando llega una muestra nueva Por vencer y el plan ya no le deja
 * lugar antes de su fecha límite: «Llegó una muestra que vence el {sáb 21 nov}. ¿La metemos en tu plan?»
 * [Agregar y recorrer las demás] [Elegir día]. Recorrer usa dominio.recorrerPlan (respeta capacidad, días y lo fijado;
 * pone la nueva antes de su vencimiento) y aplica TODO con un solo acciones.lote: un solo Deshacer. Si alguna recorrida
 * pasa de su promesa lo dice antes de confirmar: «Esto mueve {1} muestra después de lo que le prometiste a {tienda}.»
 * [Recorrer y preparar mensajes] [Elegir otro día]. Una vez por muestra (usePrimeraVez('muestra-nueva-<id>')).
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { AvatarTienda, Boton, Foto, Icono, Modal } from '@/componentes';
import { usePrimeraVez } from '@/app';
import { useConsulta } from '@/datos';
import { ahoraS, desdePorOmision, esPendiente, fechaLocalDe, formato, hoyLocal, opsDePlan, recorrerPlan, type OperacionPlan, type ResultadoRecorrido } from '@/dominio';
import { abrirMensajeEn } from '../control/contexto';
import { useOcupacion, useOperaciones, usePreferencias } from '../control/operaciones';
import { useControlMuestra } from '../useControlMuestra';
import { T } from '../textos';
import { PARAMS_PENDIENTES, cuenta, cx, nombreDe } from '../util/comun';
import comun from '../util/comun.module.css';
import css from './globales.module.css';

export interface PropuestaMuestraNueva {
  nueva: C.MuestraVista;
  limite: C.FechaLocal;
  resultado: ResultadoRecorrido;
  ops: OperacionPlan[];
  /** Muestras recorridas que quedarían después de su promesa (con su tienda). */
  afectadas: Array<{ muestra: C.MuestraVista; promesa: C.FechaLocal }>;
}

/** Calcula la propuesta (null si no hay plan, no hay muestra nueva por vencer sin fecha o todavía le cabe). Pura. */
export function calcularPropuesta(e: {
  pendientes: C.MuestraVista[];
  planes: C.PlanVideo[];
  capacidad: number;
  dias: number[];
  orden: 'sugerido' | 'por_tipo_de_prenda';
  hayLugar: (desde: C.FechaLocal, excluir: string, hasta: C.FechaLocal) => boolean;
  hoy: C.FechaLocal;
  desde: C.FechaLocal;
}): PropuestaMuestraNueva | null {
  const conPlan = e.pendientes.some((m) => m.avance.fecha_planeada !== null && m.avance.etapa !== 'por_planear');
  if (!conPlan) return null;
  const candidatas = e.pendientes
    .filter((m) => m.grupo === 'por_vencer' && m.avance.etapa === 'por_planear' && m.fecha_limite_at !== null)
    .sort((a, b) => (a.fecha_limite_at ?? 0) - (b.fecha_limite_at ?? 0));
  const nueva = candidatas[0];
  if (!nueva || nueva.fecha_limite_at === null) return null;
  const limite = fechaLocalDe(nueva.fecha_limite_at);
  if (e.hayLugar(e.desde, nueva.application_id, limite)) return null;
  const resto = e.pendientes.filter((m) => m.application_id !== nueva.application_id);
  const promesas: Record<string, C.FechaLocal> = {};
  for (const m of resto) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
  const resultado = recorrerPlan({ muestras: resto, incluidas: [], capacidad: e.capacidad, dias: e.dias, desde: e.desde, respetarFechas: true, orden: e.orden, planes: e.planes, promesas, hoy: e.hoy }, nueva);
  const ops = opsDePlan(resultado, [...resto, nueva], e.planes);
  const afectadas = resultado.rompe_promesa
    .map((r) => ({ muestra: resto.find((m) => m.application_id === r.application_id), promesa: r.promesa }))
    .filter((x): x is { muestra: C.MuestraVista; promesa: C.FechaLocal } => x.muestra !== undefined);
  return { nueva, limite, resultado, ops, afectadas };
}

export function usePropuestaMuestraNueva(): PropuestaMuestraNueva | null {
  const consulta = useConsulta('muestras', PARAMS_PENDIENTES);
  const planes = useConsulta('plan', {});
  const prefs = usePreferencias();
  const ocupacion = useOcupacion();
  return useMemo(() => {
    if (!consulta.datos || !planes.datos) return null;
    const hoy = hoyLocal();
    return calcularPropuesta({
      pendientes: consulta.datos.items.filter(esPendiente),
      planes: planes.datos.items,
      capacidad: Math.max(1, prefs.capacidad_videos_dia),
      dias: prefs.dias_videos,
      orden: prefs.orden_plan,
      hayLugar: (desde, excluir, hasta) => ocupacion.siguienteLibre(desde, excluir, hasta) !== null,
      hoy,
      desde: desdePorOmision(ahoraS()),
    });
  }, [consulta.datos, planes.datos, prefs.capacidad_videos_dia, prefs.dias_videos, prefs.orden_plan, ocupacion]);
}

/** «Esto mueve {1} muestra después de lo que le prometiste a {tienda}.» */
export function textoAfectadas(afectadas: PropuestaMuestraNueva['afectadas']): string {
  const tiendas = [...new Set(afectadas.map((a) => a.muestra.tienda.nombre))];
  const lista = tiendas.length <= 1 ? tiendas[0] ?? T.unaTienda : `${tiendas.slice(0, -1).join(', ')} ${T.y} ${tiendas[tiendas.length - 1]}`;
  return T.estoMueve(cuenta(afectadas.length, T.muestra), lista);
}

export function VistaMuestraNueva(p: {
  propuesta: PropuestaMuestraNueva;
  abierto: boolean;
  ocupado?: boolean;
  alRecorrer: (prepararMensajes: boolean) => void;
  alElegirDia: () => void;
  alCerrar: () => void;
}): ReactElement | null {
  const { nueva, limite, resultado, afectadas } = p.propuesta;
  const [confirmar, setConfirmar] = useState(false);
  const nombre = nombreDe(nueva.producto);
  const recorridas = resultado.cambios.filter((c) => c.application_id !== nueva.application_id).length;
  const enConfirmacion = confirmar && afectadas.length > 0;
  return (
    <Modal
      abierto={p.abierto}
      titulo={T.llegoMuestraVence(formato.fechaConDia(limite))}
      alCerrar={p.alCerrar}
      pie={
        enConfirmacion ? (
          <>
            <Boton variante="fantasma" alPulsar={p.alElegirDia}>
              {T.elegirOtroDia}
            </Boton>
            <Boton variante="primario" icono="MessageCircle" cargando={p.ocupado ?? false} alPulsar={() => p.alRecorrer(true)}>
              {T.recorrerYPreparar}
            </Boton>
          </>
        ) : (
          <>
            <Boton variante="fantasma" icono="CalendarDays" alPulsar={p.alElegirDia}>
              {T.elegirDia}
            </Boton>
            <Boton variante="primario" icono="CalendarCheck" cargando={p.ocupado ?? false} alPulsar={() => (afectadas.length > 0 ? setConfirmar(true) : p.alRecorrer(false))}>
              {T.agregarYRecorrer}
            </Boton>
          </>
        )
      }
    >
      <div className={css.nueva}>
        <div className={css.nuevaMuestra}>
          <Foto url={nueva.producto.imagen} alt={nombre} anchoCss={72} proporcion="1:1" radio="md" tienda={nueva.tienda.nombre} categoria={nueva.producto.categoria} className={cx(css.foto72)} />
          <div className={css.nuevaTextos}>
            <span className={css.nuevaNombre}>{nombre}</span>
            <span className={css.nuevaTienda}>
              <AvatarTienda nombre={nueva.tienda.nombre} tamano={16} /> {nueva.tienda.nombre}
            </span>
            <span className={css.vence}>
              <Icono nombre="Clock" tamano={14} /> {T.venceEl(formato.fechaConDia(limite))}
            </span>
          </div>
        </div>
        {resultado.termina ? (
          <div className={comun.avisoInfo}>
            <Icono nombre="CalendarCheck" tamano={18} />
            <span>
              {resultado.termina !== resultado.termina_antes ? (
                <>
                  {T.ahoraTerminasEl} <strong>{formato.fechaConDia(resultado.termina)}</strong>
                  {resultado.termina_antes ? T.antesEl(formato.fechaConDia(resultado.termina_antes)) : ''}.
                </>
              ) : (
                <>
                  {T.siguesTerminandoEl} <strong>{formato.fechaConDia(resultado.termina)}</strong>.
                </>
              )}{' '}
              {recorridas > 0 ? T.recorremos(cuenta(recorridas, T.muestra)) : T.noHayQueMover}
            </span>
          </div>
        ) : null}
        {resultado.no_alcanza.some((x) => x.application_id === nueva.application_id) ? (
          <div className={comun.avisoCritico} role="alert">
            <Icono nombre="CircleAlert" tamano={18} />
            <span>{T.noAlcanzasHacerla(formato.fechaConDia(limite))}</span>
          </div>
        ) : null}
        {enConfirmacion ? (
          <div className={comun.aviso} role="alert">
            <Icono nombre="CalendarClock" tamano={18} />
            <span>{textoAfectadas(afectadas)}</span>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

export function DialogoMuestraNueva(): ReactElement | null {
  const propuesta = usePropuestaMuestraNueva();
  const id = propuesta?.nueva.application_id ?? 'ninguna';
  const [primera, marcarVista] = usePrimeraVez(`muestra-nueva-${id}`);
  const ops = useOperaciones();
  const control = useControlMuestra();
  const [ocupado, setOcupado] = useState(false);
  if (!propuesta || !primera) return null;

  const recorrer = async (prepararMensajes: boolean): Promise<void> => {
    setOcupado(true);
    const termina = propuesta.resultado.termina;
    const r = await ops.aplicarLote(propuesta.ops, termina ? T.ahoraTerminasElFecha(formato.fechaConDia(termina)) : T.agregamosMuestra, { solicitud: propuesta.nueva.application_id });
    setOcupado(false);
    marcarVista();
    const afectada = propuesta.afectadas[0];
    if (prepararMensajes && afectada && r && (r.estado === 'aplicada' || r.estado === 'en_cola')) {
      abrirMensajeEn({ tienda: afectada.muestra.tienda.tienda_key }, { plantilla: 'nueva_fecha' });
    }
  };

  return (
    <VistaMuestraNueva
      key={id}
      propuesta={propuesta}
      abierto
      ocupado={ocupado}
      alRecorrer={(preparar) => void recorrer(preparar)}
      alElegirDia={() => {
        marcarVista();
        void control.planear(propuesta.nueva);
      }}
      alCerrar={marcarVista}
    />
  );
}
