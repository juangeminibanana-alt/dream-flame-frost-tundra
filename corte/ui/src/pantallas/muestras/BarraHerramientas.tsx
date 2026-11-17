/**
 * Barra de herramientas de Pendientes (01 §4.2 «Filtros y orden», 02 §7.11): búsqueda, chips de filtro (grupo de
 * TikTok con conteo e interruptores), «Agrupar por», «Ordenar», vista Lista · Tabla · Tablero (solo escritorio) y
 * «¿Por qué este orden?». Con filtros activos: «{3} filtros · Limpiar». En el celular los chips se desplazan en una fila
 * y agrupar/ordenar viven en una hoja inferior.
 */
import { useCallback, useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { Boton, BotonIcono, CampoTexto, Chip, ChipFiltro, Hoja, Menu, Modal, OpcionRadio, type OpcionMenu } from '@/componentes';
import { registrarAtras } from '@/plataforma';
import { AGRUPACIONES, ORDENES, FILTROS_VACIOS, GRUPOS_FILTRO, contarFiltros, contarPorGrupo, type Agrupar, type FiltrosCola, type OrdenCola } from './logica';
import type { PreferenciasCola } from './recuerdo';
import { useAncho } from './columnas';

/** Ancho de la barra desde el que «Agrupar por» cabe en chips junto al orden (5 chips + rótulo ≈ 600, orden + ayuda ≈ 240). */
export const ANCHO_CHIPS_AGRUPAR = 1080;
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

type Interruptor = 'yaLoVendo' | 'etiquetable' | 'conPromesa' | 'fijadas';
const INTERRUPTORES: ReadonlyArray<[Interruptor, string]> = [
  ['yaLoVendo', T.filtroYaLoVendo],
  ['etiquetable', T.filtroEtiquetable],
  ['conPromesa', T.filtroConPromesa],
  ['fijadas', T.filtroFijadas],
];

function ChipsFiltro(p: { filtros: FiltrosCola; conteos: Partial<Record<C.GrupoMuestra, number>>; alCambiar: (f: FiltrosCola) => void }): ReactElement {
  const f = p.filtros;
  // El filtro «Estado en TikTok» solo tiene sentido con 2 o más estados en la cola (si todas son Vencidas, un chip
  // único no filtraría nada); uno activo se queda para poder quitarlo.
  const presentes = GRUPOS_FILTRO.filter((g) => (p.conteos[g] ?? 0) > 0);
  const grupos = GRUPOS_FILTRO.filter((g) => f.grupos.includes(g) || (presentes.length > 1 && presentes.includes(g)));
  return (
    <>
      {grupos.map((g) => (
        <ChipFiltro
          key={g}
          activo={f.grupos.includes(g)}
          conteo={p.conteos[g] ?? 0}
          alCambiar={(si) => p.alCambiar({ ...f, grupos: si ? [...f.grupos, g] : f.grupos.filter((x) => x !== g) })}
        >
          {T.filtroGrupo[g] ?? g}
        </ChipFiltro>
      ))}
      {INTERRUPTORES.map(([k, texto]) => (
        <ChipFiltro key={k} activo={f[k]} alCambiar={(si) => p.alCambiar({ ...f, [k]: si })}>
          {texto}
        </ChipFiltro>
      ))}
    </>
  );
}

export function BarraHerramientas(p: {
  prefs: PreferenciasCola;
  alCambiar: (c: Partial<PreferenciasCola>) => void;
  items: readonly C.MuestraVista[];
  movil: boolean;
  ordenProvisional: boolean;
  /** Escritorio: Lista · Tabla · Tablero, a la derecha del orden (lienzo: el encabezado queda para las pestañas). */
  selectorVista?: ReactNode;
}): ReactElement {
  const [porQue, setPorQue] = useState(false);
  const [hoja, setHoja] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [refBarra, anchoBarra] = useAncho<HTMLDivElement>();
  const f = p.prefs.filtros;
  const conteos = useMemo(() => contarPorGrupo(p.items), [p.items]);
  const nFiltros = contarFiltros(f);
  const { alCambiar } = p;
  const cambiarFiltros = useCallback((nuevo: FiltrosCola): void => alCambiar({ filtros: nuevo }), [alCambiar]);
  const cerrarBusqueda = useCallback((): void => {
    setBuscando(false);
    if (f.q !== '') cambiarFiltros({ ...f, q: '' });
  }, [f, cambiarFiltros]);
  // Botón Atrás de Android con la búsqueda abierta: primero la cierra (01 §3.3).
  const busquedaAbiertaMovil = p.movil && (buscando || f.q.trim() !== '');
  useEffect(() => {
    if (!busquedaAbiertaMovil) return undefined;
    return registrarAtras(() => {
      cerrarBusqueda();
      return true;
    });
  }, [busquedaAbiertaMovil, cerrarBusqueda]);

  const busqueda = (
    <CampoTexto
      etiqueta={T.buscarEtiqueta}
      etiquetaOculta
      tipo="search"
      valor={f.q}
      placeholder={T.buscarPlaceholder}
      alCambiar={(q) => cambiarFiltros({ ...f, q })}
      className={cx(css.busqueda)}
    />
  );
  const limpiar =
    nFiltros > 0 ? (
      <span className={cx(css.filtrosActivos)}>
        {T.filtrosActivos(nFiltros)} ·{' '}
        <Boton variante="fantasma" tamano="sm" alPulsar={() => cambiarFiltros(FILTROS_VACIOS)}>
          {T.limpiar}
        </Boton>
      </span>
    ) : null;
  const provisional = p.ordenProvisional ? (
    <Chip tono="info" icono="Hourglass">
      {T.ordenProvisional}
    </Chip>
  ) : null;
  const modalPorQue = (
    <Modal abierto={porQue} titulo={T.porQueOrden} alCerrar={() => setPorQue(false)} pie={<Boton variante="primario" alPulsar={() => setPorQue(false)}>{T.entendido}</Boton>}>
      <p className={cx(css.parrafo)}>{T.porQueTexto}</p>
    </Modal>
  );

  if (p.movil) {
    // Celular (02 §7.10 «la lupa expande el campo a todo el ancho»): la fila de chips desplazable empieza con ⌕ y
    // «Ordenar y agrupar»; ⌕ abre la búsqueda a todo el ancho encima de los chips (su texto de ayuda completo cabe en
    // 360). Así la primera tarjeta con su foto sube al primer pliegue. Con texto escrito, la búsqueda queda abierta;
    // Atrás la cierra (01 §3.3: hoja → búsqueda → selección…).
    const abierta = buscando || f.q.trim() !== '';
    return (
      <div className={cx(css.herramientasMovil)}>
        {abierta ? (
          <CampoTexto
            etiqueta={T.buscarEtiqueta}
            etiquetaOculta
            tipo="search"
            valor={f.q}
            placeholder={T.buscarPlaceholder}
            alCambiar={(q) => cambiarFiltros({ ...f, q })}
            autoFoco={buscando && f.q === ''}
            className={cx(css.busqueda)}
          />
        ) : null}
        <div className={cx(css.chipsDesplazables)} role="group" aria-label={T.filtrosEtiqueta}>
          {/* El campo va a todo el ancho (su ayuda no se corta en 360): cerrarlo es el primer botón de la fila. */}
          {abierta ? (
            <BotonIcono icono="X" etiqueta={T.cerrarBusqueda} variante="secundario" tamano="sm" alPulsar={cerrarBusqueda} className={cx(css.botonOrdenMovil)} />
          ) : (
            <BotonIcono icono="Search" etiqueta={T.buscarEtiqueta} variante="secundario" tamano="sm" alPulsar={() => setBuscando(true)} className={cx(css.botonOrdenMovil)} />
          )}
          <BotonIcono icono="ArrowDownUp" etiqueta={T.ordenarYAgrupar} variante="secundario" tamano="sm" activo={p.prefs.agrupar !== 'prioridad' || p.prefs.orden !== 'sugerido'} alPulsar={() => setHoja(true)} className={cx(css.botonOrdenMovil)} />
          <ChipsFiltro filtros={f} conteos={conteos} alCambiar={cambiarFiltros} />
        </div>
        {limpiar || provisional ? (
          <div className={cx(css.filaMeta)}>
            {provisional}
            {limpiar}
          </div>
        ) : null}
        <Hoja abierta={hoja} titulo={T.ordenarYAgrupar} alCerrar={() => setHoja(false)}>
          <div className={cx(css.hojaCuerpo)}>
            <OpcionRadio<Agrupar>
              etiqueta={T.agruparPor}
              opciones={AGRUPACIONES.map((a) => ({ valor: a, etiqueta: T.agrupar[a] }))}
              valor={p.prefs.agrupar}
              alCambiar={(agrupar) => p.alCambiar({ agrupar })}
            />
            <OpcionRadio<OrdenCola>
              etiqueta={T.ordenarEtiqueta}
              opciones={ORDENES.map((o) => ({ valor: o, etiqueta: T.ordenar[o] }))}
              valor={p.prefs.orden}
              alCambiar={(orden) => p.alCambiar({ orden })}
            />
            <Boton variante="fantasma" icono="CircleHelp" alPulsar={() => setPorQue(true)}>
              {T.porQueOrden}
            </Boton>
          </div>
        </Hoja>
        {modalPorQue}
      </div>
    );
  }

  // Escritorio (lienzo Muestras.png). Con la barra ancha (≥ 1080 px, ventana de 1440): fila 1 = búsqueda + filtros y el
  // selector de vista a la derecha; fila 2 = «Agrupar por» en chips (como el lienzo) y, a la derecha, el orden con su
  // «¿Por qué este orden?». Más angosta (1280 con barra lateral, riel): «Agrupar por» pasa a un menú junto al orden y el
  // selector de vista baja a la fila 2, para que ninguna fila se parta en tres ni recorte la búsqueda.
  const opcionesOrden: OpcionMenu[] = ORDENES.map((o) => ({ id: o, etiqueta: T.ordenar[o], ...(o === p.prefs.orden ? { icono: 'Check' as const } : {}), alPulsar: () => p.alCambiar({ orden: o }) }));
  const opcionesAgrupar: OpcionMenu[] = AGRUPACIONES.map((a) => ({ id: a, etiqueta: T.agrupar[a], ...(a === p.prefs.agrupar ? { icono: 'Check' as const } : {}), alPulsar: () => p.alCambiar({ agrupar: a }) }));
  const ancha = anchoBarra === 0 || anchoBarra >= ANCHO_CHIPS_AGRUPAR;
  const selector = p.selectorVista ? <span className={cx(css.selectorVista)}>{p.selectorVista}</span> : null;
  const orden = <Menu etiqueta={T.ordenActual(T.ordenar[p.prefs.orden])} opciones={opcionesOrden} disparador="boton" icono="ArrowDownUp" />;
  const ayudaOrden = <BotonIcono icono="CircleHelp" etiqueta={T.porQueOrden} alPulsar={() => setPorQue(true)} />;
  return (
    <div ref={refBarra} className={cx(css.herramientas)} data-ancha={ancha ? '' : undefined}>
      <div className={cx(css.filaHerramientas)}>
        {busqueda}
        <div className={cx(css.chipsFiltro)} role="group" aria-label={T.filtrosEtiqueta}>
          <ChipsFiltro filtros={f} conteos={conteos} alCambiar={cambiarFiltros} />
          {limpiar}
        </div>
        {ancha ? selector : null}
      </div>
      {ancha ? (
        <div className={cx(css.filaHerramientas)}>
          <div className={cx(css.agrupar)} role="group" aria-label={T.agruparPor}>
            <span className={cx(css.rotulo)}>{T.agruparPor}</span>
            {AGRUPACIONES.map((a) => (
              <ChipFiltro key={a} activo={p.prefs.agrupar === a} alCambiar={() => p.alCambiar({ agrupar: a })}>
                {T.agrupar[a]}
              </ChipFiltro>
            ))}
          </div>
          <div className={cx(css.herramientasDerecha)}>
            {provisional}
            {orden}
            {ayudaOrden}
          </div>
        </div>
      ) : (
        <div className={cx(css.filaHerramientas)}>
          <div className={cx(css.agrupar)}>
            <Menu etiqueta={T.agruparActual(T.agrupar[p.prefs.agrupar])} opciones={opcionesAgrupar} disparador="boton" icono="LayoutList" />
            {orden}
            {ayudaOrden}
            {provisional}
          </div>
          {selector}
        </div>
      )}
      {modalPorQue}
    </div>
  );
}
