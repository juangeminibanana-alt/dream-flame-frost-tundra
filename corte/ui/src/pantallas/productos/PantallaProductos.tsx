/**
 * #/productos · Productos con foto (01_ux §4.13). Encabezado «20 productos con ventas · 15 productos de muestra
 * recibidos · 10 todavía sin ventas». Segmentos: Más vendidos (por omisión; cuadrícula o tabla en Windows) · Muestras sin
 * ventas (grupo, etapa, «Sin ventas todavía», [Planear video] y «Publicado hace {n} días sin ventas») · Todos (muestras
 * y productos de pedidos, con filtros). La foto ya viene resuelta por el hub (cascada de 3 pasos, C39); sin foto, Foto
 * pinta el mosaico de la tienda.
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useConsulta, useSync } from '@/datos';
import { Pantalla, navegar, useClaseAncho, useParametro, usePlataforma } from '@/app';
import {
  Boton, CampoTexto, Chip, ChipEtapa, ChipFiltro, EncabezadoPantalla, EstadoVacio, Segmentado, Tabla, TarjetaProducto,
} from '@/componentes';
import {
  ETIQUETA_ETAPA, ETIQUETA_GRUPO, ICONO_ETAPA, ICONO_GRUPO, PASO_ETAPA, TONO_GRUPO, formato, hoyLocal,
} from '@/dominio';
import { columnasProductos, useControlMuestra } from '@/bloques';
import { CargaRejilla, ErrorVista } from './Estados';
import { useColumnasQueCaben } from './ajusteColumnas';
import {
  REGLA_COLUMNAS, buscarFilas, diasPublicadoSinVentas, esSegmento, filaConNombre, filtrarTodos, muestrasSinVentas, nombreVisible, productosVendidos,
  puedePlanear,
  resumenProductos, todosLosProductos, type ElementoProducto, type FiltrosTodos, type MuestraSinVentas, type Segmento,
} from './logica';
import { T } from './textos';
import { cx, guardarLocal, leerLocal, rutaProducto, useClicReciente } from './util';
import css from './productos.module.css';

const CLAVE_VISTA = 'corte.productos.vista';
type Vista = 'cuadricula' | 'tabla';
const SIN_FILTROS: FiltrosTodos = { conVentas: false, sinVentas: false, fueMuestra: false, enVitrina: false, q: '' };

function ChipsProducto(p: { videos?: number; fueMuestra: boolean; enVitrina: boolean; renglones: 1 | 2 }): ReactElement {
  // Siempre el mismo alto de chips (aunque no lleve ninguno): la cifra de la tarjeta va pegada a los chips (margin-top:
  // auto en TarjetaProducto) y así queda a la misma altura en toda la fila de la cuadrícula. «Más vendidos» lleva
  // «N videos» + «Fue muestra», que en ~200 px ocupan dos renglones; «Todos», solo uno.
  return (
    <span className={cx(css.chipsFila)} data-renglones={p.renglones}>
      {p.videos && p.videos > 0 ? <Chip tono="neutro" icono="Play">{T.videos(p.videos)}</Chip> : null}
      {p.fueMuestra ? <Chip tono="marca" icono="Package">{T.fueMuestra}</Chip> : null}
      {p.enVitrina ? <Chip tono="info" icono="Store">{T.enVitrina}</Chip> : null}
    </span>
  );
}

function TarjetaVendido(p: { fila: C.FilaProducto; lugar: number }): ReactElement {
  const x = p.fila;
  return (
    <li className={cx(css.celda)}>
      <TarjetaProducto
        imagen={x.imagen}
        nombre={nombreVisible(x.titulo_corto, x.titulo)}
        tienda={x.tienda_nombre}
        cifraPrincipal={formato.dinero(x.comision_estimada_centavos)}
        cifraSecundaria={T.unidades(x.unidades)}
        {...(p.lugar <= 10 ? { ranking: p.lugar } : {})}
        chips={<ChipsProducto videos={x.videos} fueMuestra={x.es_muestra} enVitrina={x.en_vitrina === true} renglones={2} />}
        alPulsar={() => navegar(rutaProducto(x.product_id))}
        className={cx(css.tarjeta)}
      />
    </li>
  );
}

function TarjetaSinVentas(p: { item: MuestraSinVentas; hoy: C.FechaLocal; alPlanear: (m: C.MuestraVista) => void }): ReactElement {
  const m = p.item.muestra;
  const producto = p.item.producto;
  const dias = diasPublicadoSinVentas(m, p.hoy);
  return (
    <li className={cx(css.celda)}>
      {/* Misma lectura que «Más vendidos» (cifra = tu comisión con ese producto): $0 y «Sin ventas todavía» (01 §4.13).
          La frase en cifras de 18 no cabía en la tarjeta de ~155 px del celular. */}
      <TarjetaProducto
        imagen={producto.imagen}
        nombre={nombreVisible(producto.titulo_corto, producto.titulo)}
        tienda={m.tienda.nombre}
        categoria={producto.categoria}
        cifraPrincipal={formato.dinero(0)}
        cifraSecundaria={T.sinVentasTodavia}
        chips={
          <>
            <Chip tono={TONO_GRUPO[m.grupo]} icono={ICONO_GRUPO[m.grupo]}>{ETIQUETA_GRUPO[m.grupo]}</Chip>
            <ChipEtapa paso={PASO_ETAPA[m.avance.etapa]} icono={ICONO_ETAPA[m.avance.etapa]}>{ETIQUETA_ETAPA[m.avance.etapa]}</ChipEtapa>
            {dias !== null ? <Chip tono="atencion" icono="Clock">{T.publicadoSinVentas(dias)}</Chip> : null}
            {puedePlanear(m) ? (
              <Boton variante="secundario" tamano="sm" anchoCompleto alPulsar={() => p.alPlanear(m)} className={cx(css.planear)}>
                {T.planearVideo}
              </Boton>
            ) : null}
          </>
        }
        alPulsar={() => navegar(rutaProducto(producto.product_id))}
        className={cx(css.tarjeta)}
      />
    </li>
  );
}

function TarjetaTodos(p: { item: ElementoProducto }): ReactElement {
  const x = p.item;
  const vendio = x.fila !== null && x.conVentas;
  return (
    <li className={cx(css.celda)}>
      <TarjetaProducto
        imagen={x.imagen}
        nombre={x.nombre}
        tienda={x.tienda}
        categoria={x.categoria}
        cifraPrincipal={formato.dinero(vendio && x.fila ? x.fila.comision_estimada_centavos : 0)}
        cifraSecundaria={vendio && x.fila ? T.unidades(x.fila.unidades) : T.sinVentas}
        chips={<ChipsProducto fueMuestra={x.fueMuestra} enVitrina={x.enVitrina} renglones={1} />}
        alPulsar={() => navegar(rutaProducto(x.product_id))}
        className={cx(css.tarjeta)}
      />
    </li>
  );
}

export function PantallaProductos(): ReactElement {
  const [segParam, setSegmento] = useParametro('segmento');
  const segmento: Segmento = esSegmento(segParam) ? segParam : 'vendidos';
  const [vista, setVistaEstado] = useState<Vista>(() => (leerLocal(CLAVE_VISTA) === 'tabla' ? 'tabla' : 'cuadricula'));
  const [q, setQ] = useState('');
  const [filtros, setFiltros] = useState<FiltrosTodos>(SIN_FILTROS);
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const angosta = android || ancho === 'compacta';
  const conTabla = !angosta;
  const clic = useClicReciente();
  const control = useControlMuestra();
  const sync = useSync();
  const hoy = hoyLocal();

  const productos = useConsulta('productos', {});
  const recibidas = useConsulta('muestras', { recibidas: true });
  const filas = productos.datos?.items;
  const muestras = recibidas.datos?.items;

  const vendidos = useMemo(() => productosVendidos(filas ?? []), [filas]);
  const sinVentas = useMemo(() => (muestras ? muestrasSinVentas(muestras, filas ?? []) : []), [muestras, filas]);
  const todos = useMemo(() => todosLosProductos(filas ?? [], muestras ?? []), [filas, muestras]);
  const resumen = useMemo(() => resumenProductos(filas ?? [], muestras), [filas, muestras]);
  const todasLasColumnas = useMemo(() => columnasProductos(), []);
  const ajuste = useColumnasQueCaben(todasLasColumnas, REGLA_COLUMNAS);

  const setVista = (v: Vista): void => {
    setVistaEstado(v);
    guardarLocal(CLAVE_VISTA, v);
  };
  const quitarFiltros = (): void => {
    setQ('');
    setFiltros(SIN_FILTROS);
  };

  const consultaPrincipal = segmento === 'sin_ventas' ? recibidas : productos;
  const necesitaMuestras = segmento !== 'vendidos';
  const cargando = productos.cargando || (!filas && !productos.error) || (necesitaMuestras && (recibidas.cargando || (!muestras && !recibidas.error)));
  const error = productos.error && !filas ? productos.error : necesitaMuestras && recibidas.error && !muestras ? recibidas.error : null;

  // Sin ningún producto (ni vendido ni de muestra recibida): segmentos, vista y búsqueda no sirven; solo el estado vacío.
  const sinNada = !!filas && filas.length === 0 && !!muestras && !muestras.some((m) => m.recibida);

  let cuerpo: ReactElement;
  if (error) {
    cuerpo = <ErrorVista error={error} titulo={T.errorTitulo} alReintentar={() => void consultaPrincipal.refrescar()} />;
  } else if (cargando) {
    cuerpo = <CargaRejilla />;
  } else if (sinNada) {
    cuerpo = (
      <EstadoVacio
        icono="Shirt"
        titulo={T.nadaTitulo}
        texto={T.nadaTexto}
        {...(sync.puede ? { accion: { etiqueta: T.sincronizar, alPulsar: () => void sync.sincronizar() } } : {})}
        className={cx(css.estado)}
      />
    );
  } else if (segmento === 'vendidos') {
    const visibles = buscarFilas(vendidos, q);
    if (vendidos.length === 0) {
      cuerpo = <EstadoVacio icono="Tag" titulo={T.vacioTitulo} texto={T.vacioTexto} className={cx(css.estado)} />;
    } else if (visibles.length === 0) {
      cuerpo = <EstadoVacio icono="Search" titulo={T.sinResultados} texto={T.sinResultadosTexto} accion={{ etiqueta: T.quitarFiltros, alPulsar: quitarFiltros }} className={cx(css.estado)} />;
    } else if (conTabla && vista === 'tabla') {
      cuerpo = (
        <div className={cx(css.tablaMarco)} ref={ajuste.ref} onPointerDownCapture={clic.alPuntero}>
          <Tabla
            etiqueta={T.tablaEtiqueta}
            filas={visibles.map(filaConNombre)}
            columnas={ajuste.columnas}
            idFila={(x) => x.product_id}
            alAbrir={(x) => navegar(rutaProducto(x.product_id))}
            alSeleccionar={(x) => {
              if (clic.fueClic()) navegar(rutaProducto(x.product_id));
            }}
            claveScroll="productos-vendidos"
          />
        </div>
      );
    } else {
      const lugar = new Map(vendidos.map((x, i) => [x.product_id, i + 1]));
      cuerpo = (
        <ul className={cx(css.rejilla)} aria-label={T.rejillaVendidos}>
          {visibles.map((x) => <TarjetaVendido key={x.product_id} fila={x} lugar={lugar.get(x.product_id) ?? 99} />)}
        </ul>
      );
    }
  } else if (segmento === 'sin_ventas') {
    cuerpo = sinVentas.length === 0 ? (
      <EstadoVacio icono="CircleCheckBig" titulo={T.sinVentasVacioTitulo} texto={T.sinVentasVacioTexto} className={cx(css.estado)} />
    ) : (
      <div className={cx(css.bloque)}>
        {resumen.deMuestra !== null && resumen.yaVendieron !== null ? (
          <p className={cx(css.resumen)}>{T.sinVentasResumen(resumen.deMuestra, resumen.yaVendieron)}</p>
        ) : null}
        <ul className={cx(css.rejilla)} aria-label={T.rejillaSinVentas}>
          {sinVentas.map((x) => <TarjetaSinVentas key={x.producto.product_id} item={x} hoy={hoy} alPlanear={(m) => void control.planear(m)} />)}
        </ul>
      </div>
    );
  } else {
    const visibles = filtrarTodos(todos, { ...filtros, q });
    cuerpo = visibles.length === 0 ? (
      <EstadoVacio icono="Search" titulo={T.sinResultados} texto={T.sinResultadosTexto} accion={{ etiqueta: T.quitarFiltros, alPulsar: quitarFiltros }} className={cx(css.estado)} />
    ) : (
      <div className={cx(css.bloque)}>
        {visibles.length !== todos.length ? <p className={cx(css.mostrando)} aria-live="polite">{T.mostrando(visibles.length, todos.length)}</p> : null}
        <ul className={cx(css.rejilla)} aria-label={T.rejillaTodos}>
          {visibles.map((x) => <TarjetaTodos key={x.product_id} item={x} />)}
        </ul>
      </div>
    );
  }

  const conteoVitrina = todos.filter((x) => x.enVitrina).length;
  const buscador = <CampoTexto etiqueta={T.buscar} etiquetaOculta tipo="search" placeholder={T.buscar} valor={q} alCambiar={setQ} className={cx(css.buscador)} />;
  const contexto = filas && !sinNada ? T.contexto(resumen.conVentas, resumen.deMuestra, resumen.sinVentas) : undefined;

  return (
    <Pantalla titulo={T.titulo} lista={!!filas || !!productos.error}>
      <div className={cx(css.pantalla)}>
        {/* «Cuadrícula | Tabla» va en el encabezado, a la derecha del título, como en Videos: así a 960 los segmentos
            caben en una fila y la vista no queda sola en un renglón. */}
        <EncabezadoPantalla
          titulo={T.titulo}
          {...(contexto ? { contexto } : {})}
          {...(segmento === 'vendidos' && conTabla && !sinNada && filas ? {
            acciones: (
              <Segmentado<Vista>
                etiqueta={T.vista}
                valor={vista}
                alCambiar={setVista}
                opciones={[
                  { valor: 'cuadricula', etiqueta: T.vistaCuadricula, icono: 'LayoutGrid' },
                  { valor: 'tabla', etiqueta: T.vistaTabla, icono: 'LayoutList' },
                ]}
                className={cx(css.segmentoVista)}
              />
            ),
          } : {})}
        />
        {sinNada ? null : (
        <div className={cx(css.controles, css.trasEncabezado)}>
          <div className={cx(css.filaControles)}>
            {/* En el celular los segmentos van sin conteo: las mismas cifras están en el contexto de arriba, y con ellas
                «Sin ventas 36» se partía en dos renglones a 360 (y con la letra más grande también a 390). */}
            <Segmentado<Segmento>
              etiqueta={T.segmentos}
              valor={segmento}
              alCambiar={(s) => setSegmento(s === 'vendidos' ? null : s, { reemplazar: true })}
              opciones={[
                { valor: 'vendidos', etiqueta: angosta ? T.segVendidosCorto : T.segVendidos, ...(filas && !angosta ? { conteo: resumen.conVentas } : {}) },
                { valor: 'sin_ventas', etiqueta: angosta ? T.segSinVentasCorto : T.segSinVentas, ...(resumen.sinVentas !== null && !angosta ? { conteo: resumen.sinVentas } : {}) },
                { valor: 'todos', etiqueta: T.segTodos },
              ]}
              {...(angosta ? { anchoCompleto: true } : {})}
              className={cx(css.segmentos)}
            />
          </div>
          {/* Segunda fila (02 §7.11, igual que Videos): filtros a la izquierda y la búsqueda; en «Más vendidos» solo la búsqueda. */}
          {segmento !== 'sin_ventas' && filas ? (
            <div className={cx(css.filaFiltros)} data-solo-busqueda={segmento === 'vendidos' ? '' : undefined}>
              {segmento === 'todos' ? (
                <div className={cx(css.chips)} role="group" aria-label={T.filtros}>
                  <ChipFiltro activo={filtros.conVentas} alCambiar={(a) => setFiltros((f) => ({ ...f, conVentas: a, sinVentas: a ? false : f.sinVentas }))}>{T.filtroConVentas}</ChipFiltro>
                  <ChipFiltro activo={filtros.sinVentas} alCambiar={(a) => setFiltros((f) => ({ ...f, sinVentas: a, conVentas: a ? false : f.conVentas }))}>{T.filtroSinVentas}</ChipFiltro>
                  <ChipFiltro activo={filtros.fueMuestra} alCambiar={(a) => setFiltros((f) => ({ ...f, fueMuestra: a }))}>{T.filtroFueMuestra}</ChipFiltro>
                  {conteoVitrina > 0 ? (
                    <ChipFiltro activo={filtros.enVitrina} conteo={conteoVitrina} alCambiar={(a) => setFiltros((f) => ({ ...f, enVitrina: a }))}>{T.filtroVitrina}</ChipFiltro>
                  ) : null}
                </div>
              ) : null}
              {buscador}
            </div>
          ) : null}
        </div>
        )}
        <div className={cx(css.trasEncabezado, (productos.refrescando || recibidas.refrescando) && css.refrescando)}>{cuerpo}</div>
      </div>
    </Pantalla>
  );
}
