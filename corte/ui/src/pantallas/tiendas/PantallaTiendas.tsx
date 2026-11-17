/**
 * #/tiendas · Lista de tiendas (01_ux §4.9). Chips de vista con conteo · búsqueda · ordenar (atención, comisión,
 * pendientes, nombre) · tabla (Windows) o tarjetas (celular). En Windows también «Fichas» con foto. Desde 1280 la
 * tienda se abre en el panel de 480 (?sel=<key>, con ⤢ a página completa); debajo, a página completa.
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import type { OrdenTiendas } from '@/datos';
import { useConsulta, useSync } from '@/datos';
import { Pantalla, navegar, useClaseAncho, usePanelDisponible, useParametro, usePlataforma } from '@/app';
import {
  Boton, CampoTexto, ChipFiltro, EncabezadoPantalla, EstadoVacio, Menu, PanelLateral, Segmentado, Tabla,
} from '@/componentes';
import { TarjetaTienda, columnasTiendas, useControlMuestra } from '@/bloques';
import { CargaDetalle, CargaLista, ErrorVista } from './Estados';
import { CeldaTienda } from './CeldaTienda';
import { ContenidoTienda } from './ContenidoTienda';
import { useColumnasQueCaben } from './ajusteColumnas';
import {
  REGLA_COLUMNAS, buscarTiendas, conAnchosDeEncabezado, conteosVistas, esOrden, esVista, filtrarVista, ordenarTiendas,
  resumenTiendas, type VistaTiendas,
} from './logica';
import { ETIQUETA_VISTA, T } from './textos';
import { cx, guardarLocal, leerLocal, useClicReciente, useDesborde } from './util';
import css from './tiendas.module.css';

const ORDENES: readonly OrdenTiendas[] = ['atencion', 'comision', 'deuda', 'nombre'];
type ModoLista = 'tabla' | 'fichas';
const CLAVE_MODO = 'corte.tiendas.modo';

export const rutaTienda = (key: string): string => `/tiendas/${encodeURIComponent(key)}`;

function PanelTienda(p: { clave: string; fila: C.FilaTienda | undefined; alCerrar: () => void }): ReactElement {
  const consulta = useConsulta('tienda', { key: p.clave });
  const control = useControlMuestra();
  const d = consulta.datos;
  return (
    <PanelLateral
      abierto
      titulo={d?.tienda.nombre ?? p.fila?.nombre ?? T.panelTitulo}
      alCerrar={p.alCerrar}
      alExpandir={() => navegar(rutaTienda(p.clave))}
      pie={
        <div className={cx(css.panelPie)}>
          <Boton variante="primario" icono="MessageCircle" alPulsar={() => control.abrirMensaje({ tienda: p.clave })}>{T.avisarTienda}</Boton>
          <Boton variante="secundario" iconoFinal="ArrowRight" alPulsar={() => navegar(rutaTienda(p.clave))}>{T.verFicha}</Boton>
        </div>
      }
    >
      {consulta.cargando || (!d && !consulta.error) ? <CargaDetalle /> : null}
      {consulta.error && !d ? <ErrorVista error={consulta.error} titulo={T.errorDetalleTitulo} alReintentar={() => void consulta.refrescar()} /> : null}
      {d ? <ContenidoTienda detalle={d} modo="panel" /> : null}
    </PanelLateral>
  );
}

export function PantallaTiendas(): ReactElement {
  const consulta = useConsulta('tiendas', {});
  const sync = useSync();
  const [vistaParam, setVista] = useParametro('vista');
  const [ordenParam, setOrden] = useParametro('orden');
  const [sel, setSel] = useParametro('sel');
  const [busqueda, setBusqueda] = useState('');
  const [modo, setModoEstado] = useState<ModoLista>(() => (leerLocal(CLAVE_MODO) === 'fichas' ? 'fichas' : 'tabla'));
  const clic = useClicReciente();
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const conPanel = usePanelDisponible() && !android;
  const tarjetas = android || ancho === 'compacta';

  const vista: VistaTiendas = esVista(vistaParam) ? vistaParam : 'con_relacion';
  const orden: OrdenTiendas = esOrden(ordenParam) ? ordenParam : 'atencion';
  const todas = consulta.datos?.items;

  const conteos = useMemo(() => conteosVistas(todas ?? [], vista), [todas, vista]);
  const resumen = useMemo(() => resumenTiendas(todas ?? []), [todas]);
  const visibles = useMemo(
    () => ordenarTiendas(buscarTiendas(filtrarVista(todas ?? [], vista), busqueda), orden),
    [todas, vista, busqueda, orden],
  );
  const filaSel = sel ? todas?.find((t) => t.tienda_key === sel) : undefined;
  // La celda «Tienda» lleva la foto de la tienda (su producto más relevante; mosaico con iniciales si no hay) y el porqué
  // de su salud: así cada fila tiene foto en cualquier ancho y la columna «Productos» (la misma foto) sobra.
  const todasLasColumnas = useMemo(
    () => conAnchosDeEncabezado(columnasTiendas())
      .filter((c) => c.id !== 'productos')
      .map((c) => (c.id === 'tienda' ? { ...c, celda: (t: C.FilaTienda) => <CeldaTienda tienda={t} /> } : c)),
    [],
  );
  const ajuste = useColumnasQueCaben(todasLasColumnas, REGLA_COLUMNAS);
  const filaChips = useDesborde(conteos.map((c) => `${c.id}${c.n}`).join());

  const setModo = (m: ModoLista): void => {
    setModoEstado(m);
    guardarLocal(CLAVE_MODO, m);
  };
  const abrir = (t: C.FilaTienda): void => {
    if (conPanel) setSel(t.tienda_key);
    else navegar(rutaTienda(t.tienda_key));
  };

  // Acción principal (01 §4.9): en el encabezado en Windows; en el celular, a todo lo ancho bajo el encabezado (el
  // encabezado de Android solo lleva botones circulares y en 390 el texto apretaba el contexto).
  const avisar = resumen.porAvisar > 0 ? (
    <Boton
      variante={tarjetas ? 'secundario' : 'primario'}
      icono="MessageCircle"
      {...(tarjetas ? { anchoCompleto: true, className: cx(css.trasEncabezado) } : {})}
      alPulsar={() => navegar('/muestras/avisos')}
    >
      {T.avisarTiendas}
    </Boton>
  ) : null;
  const acciones = avisar && !tarjetas ? avisar : undefined;

  let cuerpo: ReactElement;
  if (consulta.cargando || (!todas && !consulta.error)) {
    cuerpo = <CargaLista tarjetas={tarjetas} />;
  } else if (consulta.error && !todas) {
    cuerpo = <ErrorVista error={consulta.error} titulo={T.errorTitulo} alReintentar={() => void consulta.refrescar()} />;
  } else if (!todas || todas.length === 0) {
    cuerpo = (
      <EstadoVacio
        icono="Store"
        titulo={T.vacioTitulo}
        texto={T.vacioTexto}
        {...(sync.puede ? { accion: { etiqueta: T.vacioAccion, alPulsar: () => void sync.sincronizar() } } : {})}
        className={cx(css.estado)}
      />
    );
  } else {
    const sinResultados = (
      <EstadoVacio
        icono="Search"
        titulo={T.sinResultados}
        texto={T.sinResultadosTexto}
        accion={{ etiqueta: T.verTodas, alPulsar: () => { setBusqueda(''); setVista(null, { reemplazar: true }); } }}
        className={cx(css.estado)}
      />
    );
    if (visibles.length === 0) {
      cuerpo = sinResultados;
    } else if (tarjetas) {
      cuerpo = (
        <ul className={cx(css.listaTarjetas)} aria-label={T.tablaEtiqueta}>
          {visibles.map((t) => (
            <li key={t.tienda_key}>
              <TarjetaTienda tienda={t} variante="fila" alAbrir={() => abrir(t)} />
            </li>
          ))}
        </ul>
      );
    } else if (modo === 'fichas') {
      cuerpo = (
        <ul className={cx(css.rejillaFichas)} aria-label={T.tablaEtiqueta}>
          {visibles.map((t) => (
            <li key={t.tienda_key}>
              <TarjetaTienda tienda={t} variante="ficha" alAbrir={() => abrir(t)} />
            </li>
          ))}
        </ul>
      );
    } else {
      cuerpo = (
        <div className={cx(css.tablaMarco)} ref={ajuste.ref} onPointerDownCapture={clic.alPuntero}>
          <Tabla
            etiqueta={T.tablaEtiqueta}
            filas={visibles}
            columnas={ajuste.columnas}
            idFila={(t) => t.tienda_key}
            seleccionada={conPanel ? sel : null}
            alSeleccionar={(t) => {
              if (clic.fueClic()) abrir(t);
            }}
            alAbrir={abrir}
            claveScroll={`tiendas-${vista}-${orden}`}
            vacio={sinResultados}
          />
        </div>
      );
    }
  }

  return (
    <Pantalla titulo={T.titulo} lista={!!todas || !!consulta.error}>
      <div className={cx(css.pantalla)}>
      <EncabezadoPantalla
        titulo={T.titulo}
        {...(todas && todas.length > 0 ? { contexto: T.contexto(resumen.relacion, resumen.conPendientes, resumen.socios) } : {})}
        {...(acciones ? { acciones } : {})}
      />
      {avisar && tarjetas ? avisar : null}
      {todas && todas.length > 0 ? (
        <div className={cx(css.controles, css.trasEncabezado)}>
          <div
            ref={filaChips.ref}
            className={cx(css.chips)}
            role="group"
            aria-label={T.vistas}
            data-fila-unica=""
            {...(filaChips.desborde ? { 'data-desborde': filaChips.desborde } : {})}
          >
            {conteos.map((c) => (
              <ChipFiltro
                key={c.id}
                activo={c.id === vista}
                conteo={c.n}
                alCambiar={(activo) => setVista(activo && c.id !== 'con_relacion' ? c.id : null, { reemplazar: true })}
              >
                {ETIQUETA_VISTA[c.id]}
              </ChipFiltro>
            ))}
          </div>
          <div className={cx(css.herramientas)}>
            <CampoTexto
              etiqueta={T.buscar}
              etiquetaOculta
              tipo="search"
              placeholder={T.buscar}
              valor={busqueda}
              alCambiar={setBusqueda}
              className={cx(css.buscador)}
            />
            {/* En el celular el orden va como botón de ícono junto a la búsqueda (un renglón menos antes de las tiendas);
                su nombre accesible y el título de la hoja dicen el orden actual, y si no es el de siempre se dice abajo. */}
            <Menu
              etiqueta={T.ordenarCon(T.orden[orden])}
              icono="ArrowDownUp"
              disparador={tarjetas ? 'icono' : 'boton'}
              opciones={ORDENES.map((o) => ({
                id: o,
                etiqueta: T.orden[o],
                ...(o === orden ? { icono: 'Check' as const } : {}),
                alPulsar: () => setOrden(o === 'atencion' ? null : o, { reemplazar: true }),
              }))}
              className={cx(tarjetas ? css.ordenIcono : css.menuControl)}
            />
            {!tarjetas ? (
              <Segmentado<ModoLista>
                etiqueta={T.modo}
                valor={modo}
                alCambiar={setModo}
                opciones={[
                  { valor: 'tabla', etiqueta: T.modoTabla, icono: 'LayoutList' },
                  { valor: 'fichas', etiqueta: T.modoFichas, icono: 'LayoutGrid' },
                ]}
                className={cx(css.segmentoModo)}
              />
            ) : null}
          </div>
          {busqueda.trim() || vista !== 'con_relacion' || (tarjetas && orden !== 'atencion') ? (
            <p className={cx(css.mostrando)} aria-live="polite">
              {[
                busqueda.trim() || vista !== 'con_relacion' ? T.mostrando(visibles.length, todas.length) : null,
                tarjetas && orden !== 'atencion' ? T.ordenActivo(T.orden[orden]) : null,
              ].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className={cx(css.trasEncabezado, consulta.refrescando && css.refrescando)}>{cuerpo}</div>
      {conPanel && sel ? <PanelTienda clave={sel} fila={filaSel} alCerrar={() => setSel(null, { reemplazar: true })} /> : null}
      </div>
    </Pantalla>
  );
}
