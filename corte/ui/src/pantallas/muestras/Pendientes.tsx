/**
 * Muestras › Pendientes (01 §4.2): encabezado con pestañas, franja de progreso («Te faltan {n}»), barra de
 * herramientas (búsqueda, filtros, agrupar, ordenar, vista), la cola en secciones con su lista ESTABLE («Hay un orden
 * nuevo · Actualizar»), selección múltiple, la oferta única «¿Reordenamos tu plan?» y el paso de recorrido 'muestras'.
 * Windows: lista | tabla | tablero, teclado J/K/E/P/L/C/Enter/Esc y panel de 480 a la derecha (≥ 1280).
 * Android (y ventanas compactas): tarjetas a todo lo ancho, deslizables, mantener presionado = selección múltiple y
 * un solo botón flotante extendido.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, useAtajos, useClaseAncho, useParametro, usePlataforma, useRecorrido, Pantalla } from '@/app';
import { PestanasMuestras, columnasMuestras, useControlMuestra } from '@/bloques';
import { BurbujaRecorrido, Boton, EncabezadoPantalla, EstadoVacio, Icono, Segmentado } from '@/componentes';
import { useConsulta, useNovedades, useSync } from '@/datos';
import { ETIQUETA_ETAPA, formato } from '@/dominio';
import { registrarAtras } from '@/plataforma';
import { accionPrincipalCola, FILTROS_VACIOS, filtrar, ordenar, seccionar, VISTAS, type Seccion, type VistaCola } from './logica';
import { usePreferenciasCola } from './recuerdo';
import { AJUSTE_PENDIENTES, columnasQueCaben, useAncho } from './columnas';
import { useCola, useOfertaReordenar } from './useCola';
import { AlDia, BannerCache, ErrorVista, EsqueletoCola, NecesitaPc } from './Estados';
import { FranjaProgreso } from './FranjaProgreso';
import { BarraHerramientas } from './BarraHerramientas';
import { ListaCola } from './ListaCola';
import { TablaCola } from './TablaCola';
import { TableroCola } from './TableroCola';
import { BarraSeleccion } from './BarraSeleccion';
import { OfertaReordenar } from './OfertaReordenar';
import { PanelDetalle } from './PanelDetalle';
import { useTopeBajoCabeza } from './capas';
import { Flotante } from './Flotante';
import { RUTA_AVISOS, RUTA_PLAN, RUTA_SESION, RUTA_TODAS, rutaDetalle } from './rutas';
import { T } from './textos';
import { cx, pestanasArriba } from './util';
import css from './Muestras.module.css';

const idDe = (m: C.MuestraVista): string => m.application_id;
const huellaDe = (m: C.MuestraVista): string => [m.grupo, m.avance.etapa, m.avance.fecha_planeada ?? '', m.avisos.promesa ?? '', m.prioridad ?? ''].join('|');

function enGrid(): boolean {
  const a = typeof document === 'undefined' ? null : document.activeElement;
  return a instanceof HTMLElement && a.closest('[role="grid"]') !== null;
}

/** Enter abre la muestra del cursor solo si el foco no está en un control (un botón ya hace lo suyo con Enter). */
function focoLibre(): boolean {
  const a = typeof document === 'undefined' ? null : document.activeElement;
  return !(a instanceof HTMLElement) || a === document.body || a.closest('button, a, input, select, textarea, [role="menu"], [role="dialog"]') === null;
}

export function Pendientes(p: { idAbierto: string | null; conPanel: boolean }): ReactElement {
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  const movil = android || clase === 'compacta';
  const control = useControlMuestra();
  const sync = useSync();
  const recorrido = useRecorrido('muestras');

  const cola = useCola();
  const oferta = useOfertaReordenar(cola);
  const preferencias = useConsulta('preferencias', {});
  const [prefs, cambiarPrefs] = usePreferenciasCola();
  // «#/muestras?vista=tablero» (app.d.ts, 01 §3.1) abre esa vista; si no, la que se recuerda en este equipo.
  const [vistaEnlace, setVistaEnlace] = useParametro('vista');
  const vistaPedida = (VISTAS as readonly string[]).includes(vistaEnlace ?? '') ? (vistaEnlace as VistaCola) : null;
  const vista: VistaCola = movil ? 'lista' : (vistaPedida ?? prefs.vista ?? 'lista');
  const cambiarVista = useCallback(
    (v: VistaCola) => {
      cambiarPrefs({ vista: v });
      if (vistaEnlace !== null) setVistaEnlace(null, { reemplazar: true });
    },
    [cambiarPrefs, vistaEnlace, setVistaEnlace],
  );
  // La tabla solo se pinta si sus columnas caben en la columna de la cola (con el panel abierto, no): si no, tarjetas.
  const [refColumna, anchoColumna] = useAncho<HTMLDivElement>();
  // «Hay un orden nuevo · Actualizar» se pega 8 px debajo del encabezado de la pantalla (no por detrás de él).
  const [pildoraOrden, setPildoraOrden] = useState<HTMLDivElement | null>(null);
  useTopeBajoCabeza(pildoraOrden, 8);
  const todasLasColumnas = useMemo(() => columnasMuestras('pendientes'), []);
  const ajuste = useMemo(() => columnasQueCaben(todasLasColumnas, anchoColumna, AJUSTE_PENDIENTES), [todasLasColumnas, anchoColumna]);
  const vistaEfectiva = vista === 'tabla' && !ajuste.caben ? 'lista' : vista;

  const [colapsadas, setColapsadas] = useState<Record<string, boolean>>({});
  const [cursor, setCursor] = useState<string | null>(null);
  const [marcadas, setMarcadas] = useState<ReadonlySet<string>>(new Set());
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const seleccion = p.idAbierto ?? cursor;

  const novedades = useNovedades('muestras-pendientes', cola.consulta.datos ? cola.items : undefined, idDe, huellaDe);
  const { marcarVistos } = novedades;
  const marcarRef = useRef(marcarVistos);
  marcarRef.current = marcarVistos;
  useEffect(() => () => marcarRef.current(), []);

  const filtradas = useMemo(() => ordenar(filtrar(cola.items, prefs.filtros), prefs.orden), [cola.items, prefs.filtros, prefs.orden]);
  const secciones = useMemo(() => seccionar(filtradas, prefs.agrupar, ETIQUETA_ETAPA, cola.prioridades), [filtradas, prefs.agrupar, cola.prioridades]);
  /** Sin filtros: ¿queda algo de trabajo (falta avisar, en revisión…) aunque no haya pendientes? */
  const seccionesBase = useMemo(() => seccionar(cola.items, 'prioridad', ETIQUETA_ETAPA, cola.prioridades), [cola.items, cola.prioridades]);
  const estaColapsada = useCallback((s: Seccion): boolean => colapsadas[s.id] ?? s.colapsadaPorOmision, [colapsadas]);
  /** Orden visible de arriba abajo (J/K, la tabla y «Nº en tu cola» del panel). */
  const plano = useMemo(() => secciones.flatMap((s) => (estaColapsada(s) ? [] : s.muestras)), [secciones, estaColapsada]);
  const abierta = useMemo(() => (p.idAbierto ? (cola.items.find((m) => m.application_id === p.idAbierto) ?? null) : null), [cola.items, p.idAbierto]);
  const actual = useMemo(() => (seleccion ? (cola.items.find((m) => m.application_id === seleccion) ?? null) : null), [cola.items, seleccion]);

  const abrir = useCallback(
    (m: C.MuestraVista, reemplazar = false) => {
      setCursor(m.application_id);
      navegar(rutaDetalle(m.application_id), reemplazar ? { reemplazar: true } : {});
    },
    [],
  );
  const cerrarPanel = useCallback(() => navegar('/muestras', { reemplazar: true }), []);

  const mover = useCallback(
    (delta: number) => {
      if (plano.length === 0) return;
      const i = seleccion ? plano.findIndex((m) => m.application_id === seleccion) : -1;
      const destino = plano[Math.max(0, Math.min(plano.length - 1, i < 0 ? 0 : i + delta))];
      if (!destino) return;
      if (p.idAbierto && p.conPanel) abrir(destino, true);
      else setCursor(destino.application_id);
      if (typeof document !== 'undefined') {
        document.querySelector(`[data-muestra="${destino.application_id}"]`)?.scrollIntoView?.({ block: 'nearest' });
      }
    },
    [plano, seleccion, p.idAbierto, p.conPanel, abrir],
  );

  // ------------------------------------------------------------------ selección múltiple
  const marcar = useCallback((id: string, si: boolean) => {
    setMarcadas((prev) => {
      const s = new Set(prev);
      if (si) s.add(id);
      else s.delete(id);
      return s;
    });
  }, []);
  const quitarSeleccion = useCallback(() => {
    setMarcadas(new Set());
    setModoSeleccion(false);
  }, []);
  const entrarSeleccion = useCallback(
    (id: string) => {
      setModoSeleccion(true);
      marcar(id, true);
    },
    [marcar],
  );
  // Botón Atrás de Android: primero sale de la selección múltiple (01 §3.3).
  useEffect(() => {
    if (!modoSeleccion && marcadas.size === 0) return undefined;
    return registrarAtras(() => {
      quitarSeleccion();
      return true;
    });
  }, [modoSeleccion, marcadas.size, quitarSeleccion]);
  const elegidas = useMemo(() => cola.items.filter((m) => marcadas.has(m.application_id)), [cola.items, marcadas]);

  // ------------------------------------------------------------------ teclado (Windows, 01 §3.6)
  const conSeleccion = (): boolean => actual !== null;
  useAtajos(
    [
      { teclas: 'j', descripcion: 'Siguiente muestra', accion: () => mover(1), cuando: () => !enGrid() },
      { teclas: 'k', descripcion: 'Muestra anterior', accion: () => mover(-1), cuando: () => !enGrid() },
      { teclas: 'Enter', descripcion: 'Abrir el detalle', accion: () => actual && abrir(actual), cuando: () => conSeleccion() && !enGrid() && focoLibre() && !p.idAbierto },
      { teclas: 'e', descripcion: 'Hacer la acción principal', accion: () => actual && void control.accionPrincipal(actual), cuando: conSeleccion },
      { teclas: 'p', descripcion: 'Planear la muestra', accion: () => actual && void control.planear(actual), cuando: conSeleccion },
      { teclas: 'l', descripcion: 'Video listo', accion: () => actual && void control.cambiarEtapa(actual, 'video_listo'), cuando: conSeleccion },
      { teclas: 'c', descripcion: 'Abrir mensaje para la tienda', accion: () => actual && control.abrirMensaje({ solicitud: actual.application_id }), cuando: conSeleccion },
      // Con un menú, hoja, diálogo o burbuja abiertos, Esc es suyo (useCapa de @/componentes los cierra).
      { teclas: 'Escape', descripcion: 'Cerrar el panel', accion: cerrarPanel, cuando: () => p.idAbierto !== null && p.conPanel && document.querySelector('[role="dialog"], [role="menu"]') === null },
    ],
    !android,
  );

  // ------------------------------------------------------------------ estados de la vista
  const { consulta } = cola;
  const datos = consulta.datos;
  const lista = datos !== undefined;
  const pendientes = cola.conteos.pendientes;
  const accion = accionPrincipalCola(cola.plan, cola.conteos.tiendas_por_avisar, pendientes);
  const irAccion = (a: typeof accion): void => {
    if (a === 'armar_plan') navegar(RUTA_PLAN);
    else if (a === 'avisar') navegar(RUTA_AVISOS);
    else if (a === 'sesion') navegar(RUTA_SESION);
  };

  const contexto = !lista
    ? T.contextoCargando
    : movil
      ? T.contextoMovil(formato.numero(pendientes), formato.numero(cola.conteos.tiendas_con_pendientes), pendientes, cola.conteos.tiendas_con_pendientes)
      : T.contexto(
          formato.numero(pendientes),
          formato.numero(cola.conteos.tiendas_con_pendientes),
          formato.numero(cola.porGrupo.entregada ?? 0),
          formato.numero(cola.porGrupo.sin_envio ?? 0),
          pendientes,
          cola.conteos.tiendas_con_pendientes,
          cola.porGrupo.entregada ?? 0,
        );

  // Lienzo Muestras.png: desde 1180 (barra lateral completa) las pestañas Pendientes · Agenda · Todas, con LA acción
  // principal, van arriba a la derecha junto al título; el selector de vista Lista · Tabla · Tablero baja a la barra de
  // herramientas, junto al orden. En el riel (600–1179) las pestañas ocupan su propia fila y, en el celular, solo
  // las pestañas a todo el ancho (la acción va en el botón flotante).
  const pestanasEnCabeza = pestanasArriba(movil, clase);
  const pestanas = <PestanasMuestras activa="pendientes" className={cx(pestanasEnCabeza ? css.pestanasCabeza : movil ? css.pestanasMovil : css.pestanas)} />;
  const selectorVista = movil ? null : (
    <Segmentado<VistaCola>
      etiqueta={T.vistaEtiqueta}
      valor={vista}
      alCambiar={cambiarVista}
      opciones={[
        { valor: 'lista', etiqueta: T.vista.lista },
        { valor: 'tabla', etiqueta: T.vista.tabla },
        { valor: 'tablero', etiqueta: T.vista.tablero },
      ]}
    />
  );
  const encabezado = <EncabezadoPantalla titulo={T.titulo} contexto={contexto} {...(pestanasEnCabeza ? { acciones: pestanas } : {})} />;

  let cuerpo: ReactElement;
  if (!lista) {
    if (consulta.error?.codigo === 'necesita_pc') cuerpo = <NecesitaPc alReintentar={() => void consulta.refrescar()} />;
    else if (consulta.error) cuerpo = <ErrorVista error={consulta.error} alReintentar={() => void consulta.refrescar()} />;
    else cuerpo = <EsqueletoCola conPanel={p.conPanel && p.idAbierto !== null} />;
  } else if (cola.items.length === 0 && Object.values(cola.porGrupo).every((n) => !n)) {
    cuerpo = (
      <div className={cx(css.estadoCentro)}>
        <EstadoVacio
          icono="Package"
          titulo={T.nuncaTitulo}
          texto={T.nuncaTexto}
          {...(sync.puede ? { accion: { etiqueta: T.sincronizarAhora, alPulsar: () => void sync.sincronizar() } } : {})}
        />
      </div>
    );
  } else if (pendientes === 0 && seccionesBase.every((s) => s.id === 'no_hacer')) {
    cuerpo = <AlDia publicadas={cola.conteos.publicadas} tiendas={cola.conteos.tiendas_avisadas} alVerHistorial={() => navegar(RUTA_TODAS)} />;
  } else {
    const sinResultados = filtradas.length === 0;
    const colaVista =
      vistaEfectiva === 'tabla' ? (
        <TablaCola
          filas={plano}
          columnas={ajuste.columnas}
          seleccionada={seleccion}
          esNueva={novedades.esNuevo}
          alSeleccionar={(m) => (p.idAbierto && p.conPanel ? abrir(m, true) : setCursor(m.application_id))}
          alAbrir={(m) => abrir(m)}
        />
      ) : vistaEfectiva === 'tablero' ? (
        <TableroCola muestras={filtradas} seleccionada={seleccion} alAbrir={(m) => abrir(m)} />
      ) : (
        <ListaCola
          secciones={secciones}
          colapsada={estaColapsada}
          alColapsar={(s, c) => setColapsadas((prev) => ({ ...prev, [s.id]: c }))}
          seleccionada={seleccion}
          marcadas={marcadas}
          modoSeleccion={modoSeleccion || (!android && marcadas.size > 0)}
          movil={movil}
          android={android}
          esNueva={novedades.esNuevo}
          alAbrir={(m) => (modoSeleccion ? marcar(m.application_id, !marcadas.has(m.application_id)) : abrir(m))}
          alMarcar={marcar}
          alMantener={entrarSeleccion}
        />
      );
    cuerpo = (
      <>
        <BarraHerramientas
          prefs={prefs}
          alCambiar={cambiarPrefs}
          items={cola.items}
          movil={movil}
          ordenProvisional={cola.ordenProvisional}
          selectorVista={selectorVista}
        />
        {cola.hayOrdenNuevo && !oferta.visible ? (
          <div ref={setPildoraOrden} className={cx(css.ordenNuevo)} role="status">
            <Icono nombre="ArrowDownUp" tamano={16} />
            <span>{T.ordenNuevo}</span>
            <Boton variante="fantasma" tamano="sm" alPulsar={cola.aplicarOrdenNuevo}>
              {T.actualizar}
            </Boton>
          </div>
        ) : null}
        <div className={cx(css.contenedorCuerpo)}>
          <div className={p.conPanel && p.idAbierto ? css.cuerpoConPanel : css.cuerpo}>
            <div ref={refColumna} className={cx(css.columnaCola)} data-vista={vistaEfectiva}>
              {sinResultados ? (
                <div className={cx(css.estadoCentro)}>
                  <EstadoVacio icono="Search" titulo={T.sinResultadosTitulo} accion={{ etiqueta: T.limpiarFiltros, alPulsar: () => cambiarPrefs({ filtros: FILTROS_VACIOS }) }} />
                </div>
              ) : (
                colaVista
              )}
            </div>
            {p.conPanel && p.idAbierto ? (
              <PanelDetalle id={p.idAbierto} muestraLista={abierta} cola={plano.length > 0 ? plano : cola.items} alCerrar={cerrarPanel} alAbrir={(m) => abrir(m, true)} />
            ) : null}
          </div>
        </div>
      </>
    );
  }

  const conBarraSel = marcadas.size > 0;
  return (
    <Pantalla titulo={T.titulo} lista={lista} className={cx(css.pantalla)}>
      {encabezado}
      {pestanasEnCabeza ? null : pestanas}
      {lista && consulta.error ? <BannerCache fechaAt={cola.ultimaSyncAt} alReintentar={() => void consulta.refrescar()} /> : null}
      {oferta.visible ? <OfertaReordenar alReordenar={() => void oferta.reordenar()} alDejar={oferta.dejarAsi} /> : null}
      {lista && pendientes > 0 ? (
        <BurbujaRecorrido visible={recorrido.visible} texto={recorrido.texto} esUltimo={recorrido.esUltimo} alSiguiente={recorrido.siguiente} alEntendido={recorrido.entendido}>
          <FranjaProgreso conteos={cola.conteos} plan={cola.plan} movil={movil} programo={preferencias.datos?.programo_mis_videos ?? false} />
        </BurbujaRecorrido>
      ) : null}
      <div className={cx(css.cuerpoVista, consulta.refrescando && css.refrescando)}>{cuerpo}</div>
      {conBarraSel ? <BarraSeleccion muestras={elegidas} todas={cola.items} hoy={cola.hoy} movil={movil} alQuitar={quitarSeleccion} /> : null}
      {movil && accion && lista && !conBarraSel ? (
        <Flotante className={cx(css.fab)} alTaparse="ocultar">
          <Boton variante="primario" tamano="lg" icono={accion === 'armar_plan' ? 'CalendarDays' : accion === 'avisar' ? 'MessageCircle' : 'Clapperboard'} alPulsar={() => irAccion(accion)}>
            {accion === 'armar_plan' ? T.armarPlan : accion === 'avisar' ? T.avisarTiendas : T.sesionCorta}
          </Boton>
        </Flotante>
      ) : null}
    </Pantalla>
  );
}
