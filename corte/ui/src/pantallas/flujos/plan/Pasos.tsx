/**
 * Los tres pasos de Armar mi plan (01 §4.5): 1 «Tu ritmo» (capacidad, días, desde y, si ya hay plan, qué repartir),
 * 2 «¿Qué incluimos?» (lista por prioridad con casillas, respetar fechas y orden) y 3 «Revisa tu plan» (fecha de término
 * grande, fecha de publicación, calendario con fotos, primeros días y los avisos de las reglas 1 y 3).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, Casilla, ChipsDias, Foto, Interruptor, OpcionRadio, Segmentado, SelectorFecha, SelectorNumero } from '@/componentes';
import { ETIQUETA_NIVEL, formato, type ResultadoPlan } from '@/dominio';
import { Aviso } from '../Estados';
import { T } from '../textos';
import { cuenta, cx, nombreDe } from '../util';
import { gruposIncluir, textoRitmo, type ModoDesde, type ModoRehacer, type OrdenPlan } from './logica';
import { CalendarioPlan, PrimerosDias } from './VistaPrevia';
import css from './Plan.module.css';

// ============================================================================================= paso 1

export function PasoRitmo(p: {
  /** Celular: «Otra fecha» va sin ícono para que quepa en su tercio del segmentado sin partirse en dos renglones. */
  compacta?: boolean;
  conPlan: boolean;
  modoRehacer: ModoRehacer;
  capacidad: number;
  dias: number[];
  desde: C.FechaLocal;
  modoDesde: ModoDesde;
  hoy: C.FechaLocal;
  lugaresHoy: number;
  despuesDeLas6: boolean;
  alRehacer: (m: ModoRehacer) => void;
  alCapacidad: (n: number) => void;
  alDias: (d: number[]) => void;
  alDesde: (modo: ModoDesde, fecha: C.FechaLocal | null) => void;
}): ReactElement {
  const ayudaDesde = [
    T.empiezasEl(formato.fechaConDia(p.desde)),
    p.desde === p.hoy ? T.quedanHoy(p.lugaresHoy) : null,
    p.desde === p.hoy && p.despuesDeLas6 ? T.yaPasaron6 : null,
  ].filter((x): x is string => x !== null).join(' · ');
  return (
    <div className={cx(css.campos)}>
      {p.conPlan ? (
        <div className={cx(css.campo)}>
          <OpcionRadio<ModoRehacer>
            etiqueta={T.rehacerPregunta}
            valor={p.modoRehacer}
            alCambiar={p.alRehacer}
            opciones={[
              { valor: 'sin_fecha', etiqueta: T.rehacerSoloSinFecha, descripcion: T.rehacerSoloSinFechaAyuda },
              { valor: 'todo', etiqueta: T.rehacerTodo, descripcion: T.rehacerTodoAyuda },
            ]}
          />
        </div>
      ) : null}
      <div className={cx(css.campo, css.campoFila)}>
        <SelectorNumero etiqueta={T.cuantosPorDia} valor={p.capacidad} min={1} max={10} alCambiar={p.alCapacidad} />
      </div>
      <div className={cx(css.campo, css.campoDias)}>
        <ChipsDias etiqueta={T.queDias} dias={p.dias} alCambiar={p.alDias} className={cx(css.diasAjustados)} />
      </div>
      <div className={cx(css.campo)}>
        <span className={cx(css.etiqueta)} id="flujos-plan-desde">
          {T.desdeCuando}
        </span>
        <Segmentado<ModoDesde>
          etiqueta={T.desdeCuando}
          anchoCompleto
          valor={p.modoDesde}
          alCambiar={(v) => p.alDesde(v, v === 'otra' ? p.desde : null)}
          opciones={[
            { valor: 'hoy', etiqueta: T.hoy },
            { valor: 'manana', etiqueta: T.manana },
            p.compacta ? { valor: 'otra', etiqueta: T.otraFecha } : { valor: 'otra', etiqueta: T.otraFecha, icono: 'CalendarDays' },
          ]}
        />
        {p.modoDesde === 'otra' ? <SelectorFecha etiqueta={T.desdeCuando} valor={p.desde} min={p.hoy} alCambiar={(f) => p.alDesde('otra', f)} /> : null}
        <p className={cx(css.ayuda)}>{ayudaDesde}</p>
      </div>
    </div>
  );
}

// ============================================================================================= paso 2

export function PasoIncluir(p: {
  visibles: C.MuestraVista[];
  conFechaFuera: number;
  quitadas: ReadonlySet<string>;
  modoRehacer: ModoRehacer;
  orden: OrdenPlan;
  preguntarQuitadas: boolean;
  alRespetar: (respetar: boolean) => void;
  alOrden: (o: OrdenPlan) => void;
  alIncluir: (ids: string[], incluir: boolean) => void;
  alDejarDespues: () => void;
  alNoPuedo: () => void;
}): ReactElement {
  const grupos = gruposIncluir(p.visibles);
  const incluidas = p.visibles.filter((m) => !p.quitadas.has(m.application_id)).length;
  const quitadas = p.visibles.length - incluidas;
  return (
    <div className={cx(css.incluir)}>
      <div className={cx(css.opcionesIncluir)}>
        <Interruptor activo={p.modoRehacer === 'sin_fecha'} alCambiar={p.alRespetar} etiqueta={T.respetarFechas} descripcion={T.siemprePromesas} />
        <div className={cx(css.campo)}>
          <span className={cx(css.etiqueta)}>{T.orden}</span>
          <Segmentado<OrdenPlan>
            etiqueta={T.orden}
            anchoCompleto
            valor={p.orden}
            alCambiar={p.alOrden}
            opciones={[
              { valor: 'sugerido', etiqueta: T.sugerido },
              { valor: 'por_tipo_de_prenda', etiqueta: T.porTipo },
            ]}
          />
          <p className={cx(css.ayuda)}>{p.orden === 'sugerido' ? T.sugeridoAyuda : T.porTipoAyuda}</p>
        </div>
      </div>

      <p className={cx(css.conteoIncluidas)} aria-live="polite">
        {T.incluidasDe(incluidas, p.visibles.length)}
        {p.conFechaFuera > 0 ? ` · ${cuenta(p.conFechaFuera, 'ya tiene fecha y se queda', 'ya tienen fecha y se quedan')} donde está${p.conFechaFuera === 1 ? '' : 'n'}` : ''}
      </p>

      {p.preguntarQuitadas && quitadas > 0 ? (
        <Aviso
          tono="atencion"
          icono="CircleHelp"
          rol="alert"
          acciones={
            <>
              <Boton variante="secundario" tamano="sm" alPulsar={p.alDejarDespues}>
                {quitadas === 1 ? T.dejarlaDespues : T.dejarlasDespues}
              </Boton>
              <Boton variante="fantasma" tamano="sm" alPulsar={p.alNoPuedo}>
                {quitadas === 1 ? T.noPuedoEste : T.noPuedoEstos}
              </Boton>
            </>
          }
        >
          {quitadas === 1 ? T.quitadaPregunta : T.quitadasPregunta(quitadas)}
        </Aviso>
      ) : null}

      <div className={cx(css.grupos)}>
        {grupos.map((g) => {
          const marcadas = g.items.filter((m) => !p.quitadas.has(m.application_id)).length;
          const nivel = ETIQUETA_NIVEL[g.nivel].toLowerCase();
          return (
            <section key={g.nivel} className={cx(css.grupo)} aria-label={T.prioridad(nivel, g.items.length)}>
              <div className={cx(css.grupoCabeza)}>
                <Casilla
                  etiqueta={T.prioridad(nivel, g.items.length)}
                  marcada={marcadas === g.items.length}
                  indeterminada={marcadas > 0 && marcadas < g.items.length}
                  alCambiar={(v) => p.alIncluir(g.items.map((m) => m.application_id), v)}
                  className={cx(css.grupoCasilla)}
                />
              </div>
              <ul className={cx(css.grupoLista)}>
                {g.items.map((m) => (
                  <FilaIncluir key={m.application_id} m={m} incluida={!p.quitadas.has(m.application_id)} alCambiar={(v) => p.alIncluir([m.application_id], v)} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function FilaIncluir(p: { m: C.MuestraVista; incluida: boolean; alCambiar: (v: boolean) => void }): ReactElement {
  const m = p.m;
  const nombre = nombreDe(m.producto);
  const meta = m.avance.fecha_planeada
    ? T.yaTieneFecha(formato.fechaConDia(m.avance.fecha_planeada))
    : m.grupo === 'por_vencer' && m.fecha_limite_at !== null
      ? T.venceEl(formato.fechaConDia(m.fecha_limite_at))
      : m.motivo;
  return (
    <li className={cx(css.fila, !p.incluida && css.filaQuitada)} data-incluir={m.application_id}>
      <Foto url={m.producto.imagen} alt="" anchoCss={48} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto48)} />
      <div className={cx(css.filaTextos)}>
        <Casilla etiqueta={nombre} marcada={p.incluida} alCambiar={p.alCambiar} className={cx(css.filaCasilla)} />
        {/* Una línea en escritorio; en angosto el estado («Vence el…», «Vencida sin video») baja completo a su renglón y
            solo la tienda · variante se recorta con «…». */}
        <span className={cx(css.filaMeta)}>
          <span className={cx(css.filaTienda)}>
            {m.tienda.nombre}
            {m.variante ? ` · ${m.variante}` : ''}
          </span>
          <span className={cx(css.filaEstado, m.grupo === 'por_vencer' && css.filaVence)}>{meta}</span>
        </span>
      </div>
    </li>
  );
}

// ============================================================================================= paso 3

export function PasoRevisar(p: {
  resultado: ResultadoPlan;
  desde: C.FechaLocal;
  capacidad: number;
  dias: number[];
  pendientes: C.MuestraVista[];
  provisional: boolean;
}): ReactElement {
  const r = p.resultado;
  const porId = new Map(p.pendientes.map((m) => [m.application_id, m] as const));
  return (
    <div className={cx(css.revisar)}>
      <div className={cx(css.terminaBloque)}>
        <p className={cx(css.ritmoTexto)}>{textoRitmo(r.asignaciones.length, p.capacidad, p.dias)}</p>
        {r.termina ? (
          <p className={cx(css.termina)}>
            <span className={cx(css.terminaRotulo)}>{T.terminasLargo}</span>
            <span className={cx(css.terminaFecha)}>{formato.fechaLarga(r.termina)}</span>
          </p>
        ) : null}
        {r.publica_a_mas_tardar ? <p className={cx(css.publica)}>{T.publicaLargo(formato.fechaLarga(r.publica_a_mas_tardar))}</p> : null}
      </div>

      {p.provisional ? (
        <Aviso tono="info" icono="Hourglass">
          {T.provisional}
        </Aviso>
      ) : null}
      {r.no_alcanza.map((x) => {
        const m = porId.get(x.application_id);
        return (
          <Aviso key={`na-${x.application_id}`} tono="critico" rol="alert">
            {T.noAlcanza(m ? nombreDe(m.producto) : 'una muestra', formato.fechaConDia(x.fecha_limite))}
          </Aviso>
        );
      })}
      {r.rompe_promesa.length > 0 ? (
        <Aviso tono="atencion" icono="CalendarClock" rol="alert">
          <strong>{T.rompePromesa(r.rompe_promesa.length)}</strong>
          <ul className={cx(css.listaAviso)}>
            {r.rompe_promesa.map((x) => {
              const m = porId.get(x.application_id);
              return <li key={x.application_id}>{T.rompePromesaDetalle(m ? nombreDe(m.producto) : 'Una muestra', m?.tienda.nombre ?? 'la tienda', formato.fechaConDia(x.promesa))}</li>;
            })}
          </ul>
        </Aviso>
      ) : null}

      <CalendarioPlan resultado={r} desde={p.desde} dias={p.dias} capacidad={p.capacidad} muestras={p.pendientes} />
      <PrimerosDias resultado={r} muestras={p.pendientes} />
    </div>
  );
}
