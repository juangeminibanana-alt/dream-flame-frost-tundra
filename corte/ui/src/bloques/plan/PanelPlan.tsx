/**
 * PanelPlan (01 §4.5 «Armar mi plan» y §4.15 W4). Reparte las pendientes en fechas realistas con dominio.armarPlan
 * (reglas 1–3: por vencer primero, capacidad contando lo ya planeado, días sin videos, promesas) y crea el plan con UN
 * solo acciones.lote (un solo Deshacer).
 *   'compacto' · W4: ritmo + vista previa en vivo «{32} videos · Terminas el {mar 24 nov} · publicas a más tardar el
 *                {jue 26 nov}» en una pantalla · [Crear mi plan] [Saltar]
 *   'completo' · pasos 1 «Tu ritmo» → 2 «¿Qué incluimos?» → 3 «Revisa tu plan»
 * Antes del punto de control 2 de la primera sincronización: «Orden provisional: faltan tus ventas.»
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ResumenPlanCreado } from '@firmas/bloques';
import { Boton, Casilla, ChipsDias, Esqueleto, EstadoVacio, Foto, GraficaColumnas, Icono, Interruptor, Segmentado, SelectorFecha, SelectorNumero } from '@/componentes';
import { useAcciones, useConsulta, useSync } from '@/datos';
import {
  ETIQUETA_NIVEL, ahoraS, armarPlan, contarTrabajo, desdePorOmision, diaSemana, esPendiente, formato, hoyLocal, opsDePlan,
  sumarDias, type EntradaPlan, type ResultadoPlan,
} from '@/dominio';
import { useOperaciones, usePreferencias } from '../control/operaciones';
import { useControlMuestra } from '../useControlMuestra';
import { NOMBRE_DIA, T } from '../textos';
import { PARAMS_PENDIENTES, capitalizar, cuenta, cx, nombreDe } from '../util/comun';
import comun from '../util/comun.module.css';
import css from './PanelPlan.module.css';

/** «de lunes a sábado» · «lunes, miércoles y viernes» (0 = lunes). */
export function textoDias(dias: number[]): string {
  const orden = [...new Set(dias)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
  if (orden.length === 0) return T.sinDiasVideos;
  if (orden.length === 7) return T.todosLosDias;
  const seguidos = orden.every((d, i) => i === 0 || d === (orden[i - 1] ?? -2) + 1);
  if (seguidos && orden.length >= 3) return T.deDiaADia(NOMBRE_DIA[orden[0] ?? 0] ?? '', NOMBRE_DIA[orden[orden.length - 1] ?? 0] ?? '');
  const nombres = orden.map((d) => NOMBRE_DIA[d] ?? '');
  return nombres.length === 1 ? T.losDia(nombres[0] ?? '') : `${nombres.slice(0, -1).join(', ')} ${T.y} ${nombres[nombres.length - 1]}`;
}

/** Vista previa en vivo de W4 y del paso 3: «32 videos · Terminas el mar 24 nov · publicas a más tardar el jue 26 nov». */
export function textoResumenPlan(r: Pick<ResultadoPlan, 'asignaciones' | 'termina' | 'publica_a_mas_tardar'>): string {
  const n = r.asignaciones.length;
  if (n === 0 || r.termina === null || r.publica_a_mas_tardar === null) return T.sinVideosPlan;
  return T.resumenPlan(cuenta(n, T.video), formato.fechaConDia(r.termina), formato.fechaConDia(r.publica_a_mas_tardar));
}

/** La primera sincronización todavía no termina las ventas de 180 días (punto de control 2, C34). */
export function ordenProvisional(estado: C.SyncEstado | null): boolean {
  if (!estado || estado.ultima_ok_at !== null) return false;
  const ordenes = estado.pasos.find((p) => p.paso === 'ordenes');
  return estado.en_curso && (ordenes === undefined || ordenes.estado === 'pendiente' || ordenes.estado === 'en_curso');
}

/** Promocionable = TikTok deja etiquetarlo (01 §2.3); las que no, van a su propia sección y no se planean solas. */
function promocionable(m: C.MuestraVista): boolean {
  return m.prioridad !== 'no_se_puede_etiquetar';
}

type Paso = 1 | 2 | 3;

export function PanelPlan(p: { modo: 'compacto' | 'completo'; alCrear: (r: ResumenPlanCreado) => void; alSaltar?: () => void; className?: string }): ReactElement {
  const consulta = useConsulta('muestras', PARAMS_PENDIENTES);
  const planes = useConsulta('plan', {});
  const avisos = useConsulta('avisos', {});
  const prefs = usePreferencias();
  const sync = useSync();
  const ops = useOperaciones();
  const acciones = useAcciones();
  const control = useControlMuestra();

  const pendientes = useMemo(() => (consulta.datos?.items ?? []).filter(esPendiente), [consulta.datos]);
  const hoy = hoyLocal();
  const desdeOmision = desdePorOmision(ahoraS());

  const [capacidad, setCapacidad] = useState<number | null>(null);
  const [dias, setDias] = useState<number[] | null>(null);
  const [desde, setDesde] = useState<C.FechaLocal | null>(null);
  const [otraFecha, setOtraFecha] = useState(false);
  const [respetar, setRespetar] = useState(true);
  const [orden, setOrden] = useState<'sugerido' | 'por_tipo_de_prenda' | null>(null);
  const [quitadas, setQuitadas] = useState<ReadonlySet<string>>(() => new Set());
  const [paso, setPaso] = useState<Paso>(1);
  const [preguntarQuitadas, setPreguntarQuitadas] = useState(false);
  const [creando, setCreando] = useState(false);

  const cap = capacidad ?? prefs.capacidad_videos_dia;
  const diasEf = dias ?? prefs.dias_videos;
  const desdeEf = desde ?? desdeOmision;
  const ordenEf = orden ?? prefs.orden_plan;

  /** Candidatas por omisión: promocionables que aún no tienen el video hecho (por planear o planeadas). */
  const candidatas = useMemo(() => pendientes.filter((m) => promocionable(m) && (m.avance.etapa === 'por_planear' || m.avance.etapa === 'planeada')), [pendientes]);
  const incluidas = useMemo(() => candidatas.filter((m) => !quitadas.has(m.application_id)).map((m) => m.application_id), [candidatas, quitadas]);

  const entrada = useMemo<EntradaPlan>(() => {
    const promesas: Record<string, C.FechaLocal> = {};
    for (const m of pendientes) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
    return { muestras: pendientes, incluidas, capacidad: Math.max(1, Math.min(10, cap)), dias: diasEf, desde: desdeEf, respetarFechas: respetar, orden: ordenEf, planes: planes.datos?.items ?? [], promesas, hoy };
  }, [pendientes, incluidas, cap, diasEf, desdeEf, respetar, ordenEf, planes.datos, hoy]);

  const resultado = useMemo(() => armarPlan(entrada), [entrada]);
  const provisional = ordenProvisional(sync.estado);
  const resumen = textoResumenPlan(resultado);

  const crear = async (prepararMensajes: boolean): Promise<void> => {
    if (resultado.asignaciones.length === 0 || resultado.termina === null || resultado.publica_a_mas_tardar === null) return;
    setCreando(true);
    const opsPlan = opsDePlan(resultado, pendientes, planes.datos?.items ?? []);
    const cambiosPrefs: Partial<Omit<C.PreferenciasSincronizadas, 'rev'>> = {};
    if (cap !== prefs.capacidad_videos_dia) cambiosPrefs.capacidad_videos_dia = cap;
    if (diasEf.join(',') !== prefs.dias_videos.join(',')) cambiosPrefs.dias_videos = diasEf;
    if (ordenEf !== prefs.orden_plan) cambiosPrefs.orden_plan = ordenEf;
    // Todas las muestras pasan a Planeada en UN lote: un solo Deshacer (01 §4.5 regla 4).
    const r = await ops.aplicarLote(opsPlan, T.planListo(formato.fechaConDia(resultado.termina)));
    if (prefs.rev !== null && Object.keys(cambiosPrefs).length > 0 && r && (r.estado === 'aplicada' || r.estado === 'en_cola')) {
      // El ritmo se recuerda (01 §4.5) aparte del plan: deshacer el plan no olvida el ritmo elegido.
      void acciones.editarPreferencias({ ...cambiosPrefs, rev: prefs.rev });
    }
    setCreando(false);
    if (!r || r.estado === 'error' || r.estado === 'conflicto') return;
    const planeadas = new Set(resultado.asignaciones.map((a) => a.application_id));
    const conteo = contarTrabajo(pendientes, avisos.datos?.items ?? [], hoy);
    p.alCrear({ videos: planeadas.size, termina: resultado.termina, publica_a_mas_tardar: resultado.publica_a_mas_tardar, tiendas_por_avisar: conteo.tiendas_por_avisar });
    if (prepararMensajes) {
      const primera = resultado.rompe_promesa[0];
      const m = primera ? pendientes.find((x) => x.application_id === primera.application_id) : undefined;
      if (m) control.abrirMensaje({ tienda: m.tienda.tienda_key });
    }
  };

  if (consulta.cargando || planes.cargando) {
    return (
      <div className={cx(css.panel, p.className)} aria-busy="true">
        <Esqueleto forma="titulo" ancho="50%" />
        <Esqueleto forma="bloque" alto={120} />
        <Esqueleto forma="texto" lineas={2} />
      </div>
    );
  }
  if (consulta.error && !consulta.datos) {
    return (
      <div className={cx(css.panel, p.className)}>
        <EstadoVacio icono="CircleAlert" titulo={T.errorPendientes} texto={consulta.error.mensaje} accion={{ etiqueta: T.reintentar, alPulsar: () => void consulta.refrescar() }} />
      </div>
    );
  }
  if (candidatas.length === 0) {
    return (
      <div className={cx(css.panel, p.className)}>
        <EstadoVacio icono="CalendarCheck" titulo={T.sinPendientesPlan} texto={T.sinPendientesPlanTexto} {...(p.alSaltar ? { accion: { etiqueta: T.continuar, alPulsar: p.alSaltar } } : {})} />
      </div>
    );
  }

  const ritmo = (
    <div className={css.ritmo}>
      <div className={css.campo}>
        <SelectorNumero etiqueta={T.cuantosPorDia} valor={cap} min={1} max={10} alCambiar={setCapacidad} />
      </div>
      <div className={css.campo}>
        <ChipsDias etiqueta={T.queDias} dias={diasEf} alCambiar={(d) => setDias(d)} />
      </div>
      <div className={css.campo}>
        <span className={css.etiqueta} aria-hidden="true">
          {T.desdeCuando}
        </span>
        <div className={css.desde}>
          <Segmentado<'hoy' | 'manana' | 'otra'>
            etiqueta={T.desdeCuando}
            anchoCompleto
            valor={otraFecha ? 'otra' : desdeEf === hoy ? 'hoy' : desdeEf === sumarDias(hoy, 1) ? 'manana' : 'otra'}
            alCambiar={(v) => {
              if (v === 'otra') {
                setOtraFecha(true);
                return;
              }
              setOtraFecha(false);
              setDesde(v === 'hoy' ? hoy : sumarDias(hoy, 1));
            }}
            opciones={[
              { valor: 'hoy', etiqueta: T.hoy },
              { valor: 'manana', etiqueta: T.manana },
              { valor: 'otra', etiqueta: T.otraFecha },
            ]}
          />
        </div>
        {otraFecha ? <SelectorFecha etiqueta={T.desdeCuando} valor={desdeEf} min={hoy} alCambiar={(f) => setDesde(f)} /> : null}
        <p className={css.ayuda}>
          {T.empiezasEl(formato.fechaConDia(desdeEf))}
          {desdeEf === hoy && desdeOmision !== hoy ? T.yaPasaronLas6 : ''}
        </p>
      </div>
    </div>
  );

  const avisoProvisional = provisional ? (
    <div className={comun.avisoInfo} role="status">
      <Icono nombre="Hourglass" tamano={18} />
      <span>{p.modo === 'compacto' ? T.provisionalCorto : T.provisionalLargo}</span>
    </div>
  ) : null;

  const avisosReglas = (
    <>
      {resultado.no_alcanza.map((x) => {
        const m = pendientes.find((y) => y.application_id === x.application_id);
        return (
          <div key={`na-${x.application_id}`} className={comun.avisoCritico} role="alert">
            <Icono nombre="CircleAlert" tamano={18} />
            <span>
              {T.noAlcanzas(m ? nombreDe(m.producto) : T.unaMuestra, formato.fechaConDia(x.fecha_limite))}
            </span>
          </div>
        );
      })}
      {resultado.rompe_promesa.length > 0 ? (
        <div className={comun.aviso} role="alert">
          <Icono nombre="CalendarClock" tamano={18} />
          <span>
            {T.rompePromesa(cuenta(resultado.rompe_promesa.length, T.muestra), resultado.rompe_promesa.length === 1)}
          </span>
        </div>
      ) : null}
    </>
  );

  const vistaPrevia = (
    <section className={css.previa} aria-label={T.vistaPreviaPlan} aria-live="polite">
      <p className={css.resumen} data-resumen-plan="">
        {resumen}
      </p>
      <CalendarioPlan resultado={resultado} desde={desdeEf} dias={diasEf} capacidad={cap} />
    </section>
  );

  const botonCrear = (
    <Boton
      variante="primario"
      tamano="lg"
      icono={resultado.rompe_promesa.length > 0 ? 'MessageCircle' : 'CalendarCheck'}
      cargando={creando}
      deshabilitado={resultado.asignaciones.length === 0}
      alPulsar={() => void crear(resultado.rompe_promesa.length > 0)}
    >
      {resultado.rompe_promesa.length > 0 ? T.crearYPreparar : T.crearMiPlan}
    </Boton>
  );

  if (p.modo === 'compacto') {
    return (
      <div className={cx(css.panel, css.compacto, p.className)}>
        <div className={css.columnas}>
          {ritmo}
          <div className={css.lado}>
            {vistaPrevia}
            {avisoProvisional}
            {avisosReglas}
          </div>
        </div>
        <div className={css.pie}>
          {p.alSaltar ? (
            <Boton variante="fantasma" tamano="lg" alPulsar={p.alSaltar}>
              {T.saltar}
            </Boton>
          ) : null}
          {botonCrear}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------------------------------- completo (3 pasos)
  const titulos: Record<Paso, string> = { 1: T.tuRitmo, 2: T.queIncluimos, 3: T.revisaTuPlan };
  const siguiente = (): void => {
    if (paso === 1) setPaso(2);
    else if (paso === 2) {
      if (quitadas.size > 0 && !preguntarQuitadas) setPreguntarQuitadas(true);
      else setPaso(3);
    }
  };

  return (
    <div className={cx(css.panel, css.completo, p.className)}>
      <ol className={css.pasos} aria-label={T.pasoDe(paso, 3)}>
        {([1, 2, 3] as const).map((n) => (
          <li key={n} className={cx(css.paso, n === paso && css.pasoActual, n < paso && css.pasoHecho)} aria-current={n === paso ? 'step' : undefined}>
            <span className={css.pasoNumero}>{n < paso ? <Icono nombre="Check" tamano={14} /> : n}</span>
            <span className={css.pasoTitulo}>{titulos[n]}</span>
          </li>
        ))}
      </ol>
      <h3 className={css.tituloPaso}>
        <span className={comun.lector}>{T.pasoDe(paso, 3)}: </span>
        {titulos[paso]}
      </h3>

      {paso === 1 ? (
        <div className={css.columnas}>
          {ritmo}
          <div className={css.lado}>{vistaPrevia}</div>
        </div>
      ) : null}

      {paso === 2 ? (
        <div className={css.incluir}>
          <div className={css.opcionesIncluir}>
            <Interruptor activo={respetar} alCambiar={setRespetar} etiqueta={T.respetarFechas} descripcion={T.siemprePromesas} />
            <div className={css.campo}>
              <span className={css.etiqueta}>{T.orden}</span>
              <Segmentado<'sugerido' | 'por_tipo_de_prenda'>
                etiqueta={T.orden}
                valor={ordenEf}
                alCambiar={setOrden}
                opciones={[
                  { valor: 'sugerido', etiqueta: T.sugerido },
                  { valor: 'por_tipo_de_prenda', etiqueta: T.porTipo },
                ]}
              />
            </div>
          </div>
          <ListaIncluir candidatas={candidatas} quitadas={quitadas} alCambiar={setQuitadas} />
          {preguntarQuitadas ? (
            <div className={comun.aviso} role="alert">
              <Icono nombre="CircleHelp" tamano={18} />
              <div className={css.pregunta}>
                <span>{T.queHacemosQuitadas(formato.numero(quitadas.size))}</span>
                <div className={comun.botones}>
                  <Boton variante="secundario" tamano="sm" alPulsar={() => { setPreguntarQuitadas(false); setPaso(3); }}>
                    {T.dejarlasDespues}
                  </Boton>
                  <Boton variante="fantasma" tamano="sm" alPulsar={() => { const m = candidatas.find((x) => quitadas.has(x.application_id)); setPreguntarQuitadas(false); setPaso(3); if (m) void control.noSePuede(m); }}>
                    {T.noPuedoEstos}
                  </Boton>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {paso === 3 ? (
        <div className={css.revisar}>
          <p className={css.ritmoTexto}>
            {cuenta(resultado.asignaciones.length, T.video)} · {formato.numero(cap)} {T.porDia} · {textoDias(diasEf)}
          </p>
          {resultado.termina ? (
            <p className={css.termina}>
              {T.terminasEl} <strong>{formato.fechaLarga(resultado.termina)}</strong>
            </p>
          ) : null}
          {resultado.publica_a_mas_tardar ? <p className={css.publica}>{T.ultimoPublicado(formato.fechaLarga(resultado.publica_a_mas_tardar))}</p> : null}
          <CalendarioPlan resultado={resultado} desde={desdeEf} dias={diasEf} capacidad={cap} />
          <PrimerosDias resultado={resultado} muestras={pendientes} />
          {avisoProvisional}
          {avisosReglas}
        </div>
      ) : null}

      <div className={css.pie}>
        {paso > 1 ? (
          <Boton variante="fantasma" tamano="lg" icono="ArrowLeft" alPulsar={() => { setPreguntarQuitadas(false); setPaso((x) => (x === 3 ? 2 : 1)); }}>
            {T.atras}
          </Boton>
        ) : p.alSaltar ? (
          <Boton variante="fantasma" tamano="lg" alPulsar={p.alSaltar}>
            {T.cancelar}
          </Boton>
        ) : null}
        {paso < 3 ? (
          <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" deshabilitado={paso === 2 && incluidas.length === 0} alPulsar={siguiente}>
            {T.siguiente}
          </Boton>
        ) : (
          botonCrear
        )}
      </div>
    </div>
  );
}

/** Videos por día del plan con GraficaColumnas (@/componentes, una serie, tabla gemela para lectores). */
function CalendarioPlan(p: { resultado: ResultadoPlan; desde: C.FechaLocal; dias: number[]; capacidad: number }): ReactElement | null {
  const fin = p.resultado.termina;
  if (fin === null) return null;
  const puntos: Array<{ clave: string; etiqueta: string; valor: number; aria: string }> = [];
  for (let f = p.desde, i = 0; f <= fin && i < 70; f = sumarDias(f, 1), i++) {
    const n = p.resultado.por_dia[f] ?? 0;
    const trabaja = p.dias.includes(diaSemana(f));
    puntos.push({ clave: f, etiqueta: formato.fechaConDia(f).replace(/ \S+$/, ''), valor: n, aria: `${formato.fechaConDia(f)}: ${trabaja ? T.videosDeCapacidad(formato.numero(n), formato.numero(p.capacidad)) : T.noHacesVideosCorto}` });
  }
  return (
    <GraficaColumnas
      titulo={T.videosPorDia}
      puntos={puntos}
      formatoEje={(v) => formato.numero(v)}
      alto={132}
      nota={T.notaGraficaPlan(formato.numero(p.capacidad))}
      tablaGemela={{ columnas: [T.dia, T.videosColumna], filas: puntos.map((x) => [formato.fechaConDia(x.clave), formato.numero(x.valor)]) }}
      className={cx(css.grafica)}
    />
  );
}

/** «La lista de los primeros días» del paso 3 (01 §4.5). */
function PrimerosDias(p: { resultado: ResultadoPlan; muestras: C.MuestraVista[] }): ReactElement | null {
  const porFecha = new Map<C.FechaLocal, C.MuestraVista[]>();
  for (const a of p.resultado.asignaciones) {
    const m = p.muestras.find((x) => x.application_id === a.application_id);
    if (!m) continue;
    porFecha.set(a.fecha, [...(porFecha.get(a.fecha) ?? []), m]);
  }
  const fechas = [...porFecha.keys()].sort().slice(0, 2);
  if (fechas.length === 0) return null;
  return (
    <div className={css.primeros}>
      {fechas.map((f) => (
        <section key={f} className={css.dia} aria-label={formato.fechaConDia(f)}>
          <span className={css.diaTitulo}>{capitalizar(formato.fechaConDia(f))}</span>
          <ul className={css.diaLista}>
            {(porFecha.get(f) ?? []).map((m) => (
              <li key={m.application_id} className={css.diaFila}>
                <Foto url={m.producto.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto40)} />
                <span className={css.diaTextos}>
                  <span className={css.diaNombre}>{nombreDe(m.producto)}</span>
                  <span className={css.diaTienda}>{m.tienda.nombre}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Paso 2: lista agrupada por prioridad con casillas (por omisión, todas las promocionables sin video hecho). */
function ListaIncluir(p: { candidatas: C.MuestraVista[]; quitadas: ReadonlySet<string>; alCambiar: (s: ReadonlySet<string>) => void }): ReactElement {
  const niveles: C.NivelPrioridad[] = ['urgente', 'alta', 'media', 'baja'];
  const grupos = niveles.map((n) => ({ nivel: n, items: p.candidatas.filter((m) => (m.prioridad ?? 'baja') === n) })).filter((g) => g.items.length > 0);
  const alternar = (id: string, incluir: boolean): void => {
    const s = new Set(p.quitadas);
    if (incluir) s.delete(id);
    else s.add(id);
    p.alCambiar(s);
  };
  return (
    <div className={css.grupos}>
      {grupos.map((g) => {
        const marcadas = g.items.filter((m) => !p.quitadas.has(m.application_id)).length;
        return (
          <section key={g.nivel} className={css.grupo} aria-label={`${T.prioridad} ${ETIQUETA_NIVEL[g.nivel].toLowerCase()}`}>
            <div className={css.grupoCabeza}>
              <Casilla
                etiqueta={T.prioridadGrupo(ETIQUETA_NIVEL[g.nivel].toLowerCase(), g.items.length)}
                marcada={marcadas === g.items.length}
                indeterminada={marcadas > 0 && marcadas < g.items.length}
                alCambiar={(v) => {
                  const s = new Set(p.quitadas);
                  for (const m of g.items) {
                    if (v) s.delete(m.application_id);
                    else s.add(m.application_id);
                  }
                  p.alCambiar(s);
                }}
              />
            </div>
            <ul className={css.grupoLista}>
              {g.items.map((m) => (
                <li key={m.application_id} className={css.incluirFila}>
                  <Casilla etiqueta={`${nombreDe(m.producto)} · ${m.tienda.nombre}`} marcada={!p.quitadas.has(m.application_id)} alCambiar={(v) => alternar(m.application_id, v)} className={cx(css.incluirCasilla)} />
                  <Foto url={m.producto.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto40)} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
