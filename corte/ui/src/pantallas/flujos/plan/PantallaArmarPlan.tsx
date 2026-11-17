/**
 * #/muestras/plan · Armar mi plan (01 §4.5, §5.2). Asistente de 3 pasos con indicador: escritorio = superficie de 640
 * con la vista previa en vivo al lado; celular (o ventana compacta) = pantalla completa con el botón inferior fijo
 * «Siguiente». El reparto lo hace dominio.armarPlan (reglas 1–3) y «Crear mi plan» manda TODO con UN solo
 * acciones.lote (opsDePlan) → un solo Deshacer, en la pantalla de éxito (y con Ctrl+Z). Si ya hay plan, la acción se
 * llama «Rehacer mi plan» y ofrece «Solo las que no tienen fecha» o «Repartir todo de nuevo».
 */
import { useEffect, useMemo, useReducer, useRef, useState, type ReactElement } from 'react';
import { navegar, Pantalla, useClaseAncho, usePlataforma } from '@/app';
import { useControlMuestra } from '@/bloques';
import { Boton, EncabezadoPantalla, EstadoVacio, Icono, useToast } from '@/componentes';
import { useAcciones, useSesion, useSync } from '@/datos';
import { ahoraS, armarPlan, contarTrabajo, desdePorOmision, horaLocal, hoyLocal, opsDePlan } from '@/dominio';
import { BarraFija, ReservaCapas } from '../BarraFija';
import { useDatosTrabajo } from '../datos';
import { ErrorFlujo, EsqueletoFlujo } from '../Estados';
import { T } from '../textos';
import { cx } from '../util';
import comun from '../flujos.module.css';
import { ExitoPlan, type DatosExito } from './Exito';
import {
  ESTADO_INICIAL, aOpLocal, cambiosRitmo, candidatasPlan, desdeEfectivo, entradaPlan, hayPlan, incluidasPorOmision, lugaresLibres, modoDeDesde,
  modoRehacerInicial, motivoVacio, ordenProvisional, primerosDias, puedeSeguir, reducirAsistente, type PasoPlan,
} from './logica';
import { PasoIncluir, PasoRevisar, PasoRitmo } from './Pasos';
import { VistaPrevia } from './VistaPrevia';
import css from './Plan.module.css';

const TITULOS: Readonly<Record<PasoPlan, string>> = { 1: T.tuRitmo, 2: T.queIncluimos, 3: T.revisaTuPlan };

export function PantallaArmarPlan(): ReactElement {
  const datos = useDatosTrabajo();
  const sync = useSync();
  const sesion = useSesion();
  const acciones = useAcciones();
  const control = useControlMuestra();
  const toast = useToast();
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  // Composición por ancho (una tableta Android usa la de escritorio); lo nativo, por plataforma.
  const movil = clase === 'compacta';

  const [e, despachar] = useReducer(reducirAsistente, ESTADO_INICIAL);
  const [exito, setExito] = useState<DatosExito | null>(null);
  const [creando, setCreando] = useState(false);

  // «Armar» o «Rehacer» se decide al abrir: crear el plan no cambia el título de la pantalla de éxito.
  const conPlanAlAbrir = useRef<boolean | null>(null);
  if (conPlanAlAbrir.current === null && datos.listo) conPlanAlAbrir.current = hayPlan(datos.pendientes);
  const conPlan = conPlanAlAbrir.current === true;

  const ahora = ahoraS();
  const hoy = hoyLocal(ahora);
  const omision = desdePorOmision(ahora);
  const capacidad = e.capacidad ?? datos.ritmo.capacidad;
  const dias = e.dias ?? datos.ritmo.dias;
  const orden = e.orden ?? datos.ritmo.orden;
  const desde = desdeEfectivo(e, hoy, omision);
  const modoDesde = modoDeDesde(e, desde, hoy);

  const candidatas = useMemo(() => candidatasPlan(datos.pendientes), [datos.pendientes]);
  // «Rehacer mi plan» sin ninguna candidata sin fecha: se abre con «Repartir todo de nuevo» (si no, no habría qué repartir).
  const modoAjustado = useRef(false);
  useEffect(() => {
    if (modoAjustado.current || !datos.listo) return;
    modoAjustado.current = true;
    if (conPlan && modoRehacerInicial(candidatas) === 'todo') despachar({ tipo: 'rehacer', modo: 'todo' });
  }, [datos.listo, conPlan, candidatas]);
  const quitadas = useMemo(() => new Set(e.quitadas), [e.quitadas]);
  const visibles = useMemo(
    () => (e.modoRehacer === 'todo' ? candidatas : candidatas.filter((m) => m.avance.fecha_planeada === null)),
    [candidatas, e.modoRehacer],
  );
  const incluidas = useMemo(() => incluidasPorOmision(candidatas, e.modoRehacer, quitadas), [candidatas, e.modoRehacer, quitadas]);
  const resultado = useMemo(
    () => armarPlan(entradaPlan({ pendientes: datos.pendientes, incluidas, capacidad, dias, desde, respetarFechas: e.modoRehacer === 'sin_fecha', orden, planes: datos.planes, hoy })),
    [datos.pendientes, incluidas, capacidad, dias, desde, e.modoRehacer, orden, datos.planes, hoy],
  );
  const provisional = ordenProvisional(sync.estado);
  const titulo = conPlan ? T.rehacerMiPlan : T.planTitulo;
  const celularEmparejado = plataforma !== 'android' && (sesion.datos?.lan?.dispositivos_activos ?? 0) > 0;

  const crear = async (): Promise<void> => {
    if (resultado.termina === null || resultado.publica_a_mas_tardar === null || creando) return;
    setCreando(true);
    // El ritmo se recuerda ANTES del plan: así el plan es la última acción y Ctrl+Z (o Deshacer) lo deshace completo.
    const cambios = cambiosRitmo(datos.ritmo, { capacidad, dias, orden });
    if (datos.ritmo.rev !== null && Object.keys(cambios).length > 0) await acciones.editarPreferencias({ ...cambios, rev: datos.ritmo.rev });
    const ops = opsDePlan(resultado, datos.pendientes, datos.planes).map(aOpLocal);
    const r = ops.length > 0 ? await acciones.lote(ops) : null;
    setCreando(false);
    if (r && (r.estado === 'error' || r.estado === 'conflicto')) {
      toast.mostrar({ texto: r.estado === 'conflicto' ? (r.resultados.find((x) => x.error)?.error ?? T.planErrorCrear) : T.planErrorCrear, tono: 'error' });
      return;
    }
    const conteo = contarTrabajo(datos.pendientes, datos.avisos, hoy);
    const primero = primerosDias(resultado, 1)[0];
    const porId = new Map(datos.pendientes.map((m) => [m.application_id, m] as const));
    setExito({
      videos: new Set(resultado.asignaciones.map((a) => a.application_id)).size,
      termina: resultado.termina,
      publica: resultado.publica_a_mas_tardar,
      tiendasPorAvisar: conteo.tiendas_por_avisar,
      primerDia: primero ? { fecha: primero.fecha, muestras: primero.ids.map((id) => porId.get(id)).filter((m): m is NonNullable<typeof m> => m !== undefined) } : null,
      deshacer: r ? r.deshacer : null,
      enCola: r?.estado === 'en_cola',
    });
    // Regla 3: «Crear y preparar mensajes» abre «Nueva fecha» para la primera tienda afectada.
    const afectada = resultado.rompe_promesa[0];
    const m = afectada ? datos.pendientes.find((x) => x.application_id === afectada.application_id) : undefined;
    if (m) navegar(`/muestras/plan?mensaje=${encodeURIComponent(`t:${m.tienda.tienda_key}`)}&plantilla=nueva_fecha`);
  };

  const deshacer = async (): Promise<void> => {
    const d = exito?.deshacer;
    if (!d) return;
    try {
      await d();
      setExito(null);
      despachar({ tipo: 'ir', paso: 3 });
      toast.mostrar({ texto: T.planDeshecho, tono: 'ok' });
    } catch (err) {
      toast.mostrar({ texto: err instanceof Error && err.message ? err.message : T.planErrorCrear, tono: 'error' });
    }
  };

  const noPuedo = async (): Promise<void> => {
    const lista = visibles.filter((m) => quitadas.has(m.application_id));
    despachar({ tipo: 'dejarDespues' });
    // «No puedo hacer estos videos» abre la hoja de motivos para cada una (01 §4.5 paso 2), una tras otra.
    for (const m of lista) await control.noSePuede(m);
  };

  const encabezado = (
    <EncabezadoPantalla
      titulo={titulo}
      contexto={movil ? undefined : conPlan ? T.planContextoRehacer : T.planContexto}
      {...(!movil || plataforma === 'android' ? { volver: { a: '/muestras', etiqueta: T.muestras } } : {})}
    />
  );

  let cuerpo: ReactElement;
  if (!datos.listo) {
    cuerpo = datos.error ? <ErrorFlujo error={datos.error} titulo={T.planError} alReintentar={datos.refrescar} /> : <EsqueletoFlujo filas={4} />;
  } else if (exito) {
    cuerpo = (
      <div className={cx(css.asistente, css.asistenteExito)}>
        <ExitoPlan
          exito={exito}
          celularEmparejado={celularEmparejado}
          alAvisar={() => navegar('/muestras/avisos')}
          alDespues={() => navegar('/inicio')}
          alDeshacer={() => void deshacer()}
        />
      </div>
    );
  } else if (candidatas.length === 0) {
    cuerpo = (
      <div className={cx(comun.estadoCentro)}>
        <EstadoVacio icono="CalendarCheck" titulo={T.sinPendientesPlan} texto={T.sinPendientesPlanTexto} accion={{ etiqueta: T.verAgenda, alPulsar: () => navegar('/muestras/agenda') }} />
      </div>
    );
  } else {
    const n = incluidas.length;
    // «Repartir todo de nuevo»: las planeadas que se van a repartir no ocupan hoy (la vista previa las vuelve a poner).
    const lugaresHoy = lugaresLibres(hoy, capacidad, dias, datos.pendientes, e.modoRehacer === 'todo' ? new Set(incluidas) : undefined);
    const despuesDeLas6 = horaLocal(ahora).h >= 18;
    const rompe = resultado.rompe_promesa.length > 0;
    const vacio = resultado.termina === null ? motivoVacio(dias, e.modoRehacer, candidatas, n) : null;
    cuerpo = (
      <div className={cx(css.asistente, e.paso === 3 && css.asistenteRevisar)}>
        <section className={cx(css.tarjeta)} aria-labelledby="flujos-plan-paso">
          <ol className={cx(css.pasos)} aria-label={T.pasos}>
            {([1, 2, 3] as const).map((paso) => (
              <li key={paso} className={cx(css.paso, paso === e.paso && css.pasoActual, paso < e.paso && css.pasoHecho)} aria-current={paso === e.paso ? 'step' : undefined}>
                {paso < e.paso ? (
                  <button type="button" className={cx(css.pasoBoton)} onClick={() => despachar({ tipo: 'ir', paso })}>
                    <span className={cx(css.pasoNumero)} aria-hidden="true">
                      <Icono nombre="Check" tamano={14} />
                    </span>
                    <span className={cx(css.pasoTitulo)}>{TITULOS[paso]}</span>
                  </button>
                ) : (
                  <span className={cx(css.pasoBoton)}>
                    <span className={cx(css.pasoNumero)} aria-hidden="true">
                      {paso}
                    </span>
                    <span className={cx(css.pasoTitulo)}>{TITULOS[paso]}</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className={cx(css.cabezaPaso)}>
            {/* En el celular el indicador queda en círculos: «Paso 2 de 3» se lee aquí, sobre el título del paso. */}
            <p className={cx(css.pasoDe)} aria-hidden="true">
              {T.pasoDe(e.paso, 3)}
            </p>
            <h2 id="flujos-plan-paso" className={cx(css.tituloPaso)}>
              <span className={cx(comun.lector)}>{T.pasoDe(e.paso, 3)}: </span>
              {TITULOS[e.paso]}
            </h2>
          </div>

          {e.paso === 1 ? (
            <PasoRitmo
              compacta={clase === 'compacta'}
              conPlan={conPlan}
              modoRehacer={e.modoRehacer}
              capacidad={capacidad}
              dias={dias}
              desde={desde}
              modoDesde={modoDesde}
              hoy={hoy}
              lugaresHoy={lugaresHoy}
              despuesDeLas6={despuesDeLas6}
              alRehacer={(modo) => despachar({ tipo: 'rehacer', modo })}
              alCapacidad={(valor) => despachar({ tipo: 'capacidad', valor })}
              alDias={(valor) => despachar({ tipo: 'dias', valor })}
              alDesde={(modo, fecha) => despachar({ tipo: 'desde', modo, fecha })}
            />
          ) : null}
          {e.paso === 2 ? (
            <PasoIncluir
              visibles={visibles}
              conFechaFuera={e.modoRehacer === 'sin_fecha' ? candidatas.length - visibles.length : 0}
              quitadas={quitadas}
              modoRehacer={e.modoRehacer}
              orden={orden}
              preguntarQuitadas={e.preguntarQuitadas}
              alRespetar={(respetar) => despachar({ tipo: 'rehacer', modo: respetar ? 'sin_fecha' : 'todo' })}
              alOrden={(valor) => despachar({ tipo: 'orden', valor })}
              alIncluir={(ids, incluir) => despachar({ tipo: 'incluir', ids, incluir })}
              alDejarDespues={() => despachar({ tipo: 'dejarDespues' })}
              alNoPuedo={() => void noPuedo()}
            />
          ) : null}
          {e.paso === 3 ? <PasoRevisar resultado={resultado} desde={desde} capacidad={capacidad} dias={dias} pendientes={datos.pendientes} provisional={provisional} /> : null}

          <BarraFija etiqueta={T.pasoDe(e.paso, 3)} className={cx(css.pie, movil && css.pieMovil, comun.repisa)}>
            {e.paso > 1 ? (
              <Boton variante="fantasma" tamano="lg" icono="ArrowLeft" alPulsar={() => despachar({ tipo: 'atras' })}>
                {T.atras}
              </Boton>
            ) : (
              <Boton variante="fantasma" tamano="lg" alPulsar={() => navegar('/muestras')}>
                {T.cancelar}
              </Boton>
            )}
            <span className={cx(comun.barraFijaEspacio)} aria-hidden="true" />
            {e.paso < 3 ? (
              <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" deshabilitado={!puedeSeguir(e, dias, n)} alPulsar={() => despachar({ tipo: 'siguiente' })} className={cx(movil && css.botonPrincipalMovil)}>
                {T.siguiente}
              </Boton>
            ) : (
              <Boton
                variante="primario"
                tamano="lg"
                icono={rompe ? 'MessageCircle' : 'CalendarCheck'}
                cargando={creando}
                deshabilitado={resultado.asignaciones.length === 0}
                alPulsar={() => void crear()}
                className={cx(movil && css.botonPrincipalMovil)}
              >
                {rompe ? T.crearYPreparar : T.crearMiPlan}
              </Boton>
            )}
          </BarraFija>
        </section>

        {e.paso < 3 ? (
          <VistaPrevia
            resultado={resultado}
            desde={desde}
            capacidad={capacidad}
            dias={dias}
            muestras={datos.pendientes}
            provisional={provisional}
            {...(vacio ? { vacio } : {})}
            className={cx(css.aside)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <Pantalla titulo={titulo} lista={datos.listo} className={cx(comun.pantalla, datos.refrescando && comun.refrescando)}>
      {encabezado}
      {cuerpo}
      <ReservaCapas />
    </Pantalla>
  );
}
