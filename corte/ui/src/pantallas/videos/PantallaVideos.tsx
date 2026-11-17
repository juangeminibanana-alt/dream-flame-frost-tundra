/**
 * #/videos · Galería de videos (01_ux §4.12, C4). Encabezado con «40 videos con pedidos · 35 con ventas · 6 vendieron
 * en los últimos 7 días» y la nota de la fecha. Controles en una fila arriba de lo que filtran (02 §7.11): rango (por
 * omisión «Todo», se recuerda aparte de Ventas), orden, filtros y vista. La galería es de MiniaturaVideo: portada = foto
 * del producto con el rótulo «Foto del producto» (o póster tipográfico si no hay foto). En Windows también hay tabla.
 * rev. 5 (Display API): con las métricas de TikTok, la portada es la REAL del video ('/img/v') cuando existe; tarjetas y
 * tabla llevan vistas, likes, comentarios, compartidos y «pedidos por 1,000 vistas», y se puede ordenar por vistas y por
 * conversión. Un video sin cifras de TikTok (privado o borrado) lo dice; uno con vistas y sin ventas válidas se marca.
 * La lista sale de tus ventas: los videos que nunca vendieron no llegan en el contrato (ver notas/pendientes).
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useConsulta, useSync, type EstadoConsulta } from '@/datos';
import { Pantalla, navegar, useClaseAncho, useParametro, usePlataforma } from '@/app';
import {
  AvatarTienda, Boton, CampoTexto, Chip, ChipFiltro, EncabezadoPantalla, EstadoVacio, Foto, Menu, MiniaturaVideo, PuntoVivo, Segmentado,
  Tabla, type ColumnaTabla,
} from '@/componentes';
import { formato } from '@/dominio';
import { columnasVideos } from '@/bloques';
import { CargaRejilla, ErrorVista } from './Estados';
import { useColumnasQueCaben } from './ajusteColumnas';
import {
  ORDENES_METRICAS, RANGOS, REGLA_COLUMNAS, cifraCompacta, esOrden, esRango, filtrarVideos, hayMetricas, idsVendiendo, mapaNombres,
  metricasAl, nombreVideo, ordenarVideos, ordenesPara, portadaDe, rankingPorComision, resumenVideos, sinVentasConVistas, textoPorMil,
  type FiltrosVideos,
} from './logica';
import { T, type ClaveRango } from './textos';
import { cx, guardarLocal, leerLocal, rutaVideo, useClicReciente } from './util';
import css from './videos.module.css';

const CLAVE_RANGO = 'corte.videos.rango';
const CLAVE_VISTA = 'corte.videos.vista';
type Vista = 'cuadricula' | 'tabla';

/** Rango pedido: «Todo» va sin fechas (lo arma también la copia del celular); los demás con las fechas del hub. */
function useRangoVideos(rango: ClaveRango): { params: { desde?: C.FechaLocal; hasta?: C.FechaLocal } | null; tablero: EstadoConsulta<C.DashboardResponse> } {
  const tablero = useConsulta('dashboard', { periodo: rango === 'todo' ? '30d' : rango }, { activa: rango !== 'todo' });
  if (rango === 'todo') return { params: {}, tablero };
  const p = tablero.datos?.periodo;
  return { params: p ? { desde: p.desde, hasta: p.hasta } : null, tablero };
}

/** Celda «Video» de la tabla: portada 9:16 (la real de TikTok o la foto del producto) + nombre corto del producto + «Video 7677…3012». */
function CeldaVideo(p: { video: C.FilaVideo; nombre: string }): ReactElement {
  const v = p.video;
  const idCorto = T.nombreVideo(formato.idCorto(v.content_id));
  const portada = portadaDe(v);
  // Con la foto del producto (C4) el rótulo va en el renglón de abajo: en la miniatura de 28 px no cabe.
  const detalle = [portada.delProducto ? T.fotoDelProducto : null, p.nombre !== idCorto ? idCorto : null].filter(Boolean).join(' · ');
  return (
    <span className={cx(css.celdaVideo)}>
      <Foto url={portada.url} alt="" anchoCss={28} proporcion="9:16" radio="xs" tienda={v.tienda_principal} className={cx(css.celdaVideoFoto)} />
      <span className={cx(css.celdaVideoTextos)}>
        <span className={cx(css.celdaVideoNombre)} title={p.nombre}>{p.nombre}</span>
        {detalle ? <span className={cx(css.celdaVideoId)}>{detalle}</span> : null}
      </span>
    </span>
  );
}

/** Cifra de la tabla alineada a la derecha y tabular; la exacta en el title. «—» sin cifra de TikTok. */
function CeldaCifra(p: { valor: number | null | undefined; texto?: string; fuerte?: boolean }): ReactElement {
  if (p.valor === null || p.valor === undefined) return <span className={cx(css.celdaCifraVacia)} title={T.sinCifrasAyuda}>—</span>;
  return (
    <span className={cx(css.celdaCifra, p.fuerte && css.celdaCifraFuerte)} title={formato.numero(p.valor)}>
      {p.texto ?? cifraCompacta(p.valor)}
    </span>
  );
}

/** rev. 5 · Columnas de TikTok para la tabla (solo si la lista trae las cifras de la Display API). */
function columnasMetricas(): ColumnaTabla<C.FilaVideo>[] {
  return [
    { id: 'vistas', titulo: T.colVistas, ancho: 96, alineacion: 'derecha', celda: (v) => <CeldaCifra valor={v.vistas} fuerte /> },
    {
      id: 'porMil', titulo: T.colPorMil, ancho: 168, alineacion: 'derecha',
      celda: (v) => <CeldaCifra valor={v.pedidos_por_mil_vistas} {...(typeof v.pedidos_por_mil_vistas === 'number' ? { texto: textoPorMil(v.pedidos_por_mil_vistas) } : {})} />,
    },
    { id: 'likes', titulo: T.colLikes, ancho: 96, alineacion: 'derecha', prescindible: true, celda: (v) => <CeldaCifra valor={v.likes} /> },
    { id: 'comentarios', titulo: T.colComentarios, ancho: 120, alineacion: 'derecha', prescindible: true, celda: (v) => <CeldaCifra valor={v.comentarios} /> },
    { id: 'compartidos', titulo: T.colCompartidos, ancho: 120, alineacion: 'derecha', prescindible: true, celda: (v) => <CeldaCifra valor={v.compartidos} /> },
  ];
}

/** Pie de la tarjeta con las cifras de TikTok: «48.2 mil vistas · 2.1 mil likes · …» y «7.10 pedidos por 1,000 vistas». */
function MetricasTarjeta(p: { video: C.FilaVideo }): ReactElement | null {
  const v = p.video;
  if (v.vistas === undefined) return null;
  if (v.vistas === null) {
    return <span className={cx(css.pieSinCifras)} title={T.sinCifrasAyuda}>{T.sinCifras}</span>;
  }
  // Dos renglones fijos (vistas · likes / comentarios · compartidos); cada cifra con su palabra nunca se parte.
  const renglones = [
    [T.vistas(cifraCompacta(v.vistas)), ...(typeof v.likes === 'number' ? [T.likes(cifraCompacta(v.likes))] : [])],
    [
      ...(typeof v.comentarios === 'number' ? [T.comentarios(cifraCompacta(v.comentarios), v.comentarios)] : []),
      ...(typeof v.compartidos === 'number' ? [T.compartidos(cifraCompacta(v.compartidos))] : []),
    ],
  ].filter((r) => r.length > 0);
  return (
    <>
      {typeof v.pedidos_por_mil_vistas === 'number' ? (
        <span className={cx(css.piePorMil)} data-por-mil="">
          {/* En el celular se parte entre «pedidos» y «por 1,000 vistas», nunca a mitad. */}
          <span className={cx(css.sinCorte)}><span className={cx(css.piePorMilCifra)}>{textoPorMil(v.pedidos_por_mil_vistas)}</span> {T.porMilPedidos}</span>{' '}
          <span className={cx(css.sinCorte)}>{T.porMilResto}</span>
        </span>
      ) : null}
      <span className={cx(css.pieMetricas)} data-metricas="">
        {renglones.map((r, j) => (
          <span key={j} className={cx(css.pieRenglon)}>
            {r.map((x, i) => (
              <span key={x}>
                {i > 0 ? ' · ' : null}
                <span className={cx(css.sinCorte)}>{x}</span>
              </span>
            ))}
            {j < renglones.length - 1 ? <span className={cx(css.srSolo)}> · </span> : null}
          </span>
        ))}
      </span>
    </>
  );
}

function TarjetaGaleria(p: {
  video: C.FilaVideo;
  nombre: string;
  lugar: number | null;
  vendiendo: boolean;
}): ReactElement {
  const v = p.video;
  const dinero = formato.dinero(v.comision_estimada_centavos);
  const portada = portadaDe(v);
  return (
    <li className={cx(css.celda)}>
      <MiniaturaVideo
        url={portada.url}
        {...(portada.delProducto ? { rotulo: T.fotoDelProducto } : {})}
        {...(p.lugar !== null && p.lugar <= 10 ? { ranking: p.lugar } : {})}
        comision={dinero}
        unidades={T.unidades(v.unidades)}
        nombre={p.nombre}
        fechaPoster={formato.fechaCorta(v.primera_venta)}
        tienda={v.tienda_principal}
        anchoCss={220}
        etiqueta={T.etiquetaVideo(p.lugar, dinero, v.unidades, p.nombre)}
        alPulsar={() => navegar(rutaVideo(v.content_id))}
        className={cx(css.miniatura)}
      />
      <div className={cx(css.pie)}>
        {v.tienda_principal ? (
          <span className={cx(css.pieTienda)}>
            {/* 20 y no 16: debajo de 20 AvatarTienda es un cuadrito de 10 del tono, que en claro parecía una imagen rota;
                con 20 lleva las iniciales, como el de TarjetaProducto. */}
            <AvatarTienda nombre={v.tienda_principal} tamano={20} />
            <span className={cx(css.recorte)}>{v.tienda_principal}</span>
          </span>
        ) : null}
        {/* «123 pedidos · 12 % reembolsos»: si no cabe, se parte en el punto medio, nunca a mitad de una cifra. */}
        <span className={cx(css.pieCifras)}>
          <span className={cx(css.sinCorte)}>{T.pedidos(v.pedidos)}</span>
          {' · '}
          <span className={cx(css.sinCorte)}>{T.reembolsos(formato.porcentaje(v.tasa_reembolso))}</span>
        </span>
        <MetricasTarjeta video={v} />
        {sinVentasConVistas(v) ? (
          <Chip tono="neutro" icono="Eye" className={cx(css.pieChip)} titulo={T.sinVentasConVistasAyuda}>
            {T.sinVentasConVistas}
          </Chip>
        ) : null}
        {p.vendiendo ? (
          <Chip tono="ok" className={cx(css.pieChip)} titulo={T.vendiendoAhoraAyuda}>
            <PuntoVivo estado="ok" className={cx(css.punto)} />
            {T.vendiendoAhora}
          </Chip>
        ) : null}
      </div>
    </li>
  );
}

export function PantallaVideos(): ReactElement {
  const [rango, setRangoEstado] = useState<ClaveRango>(() => {
    const r = leerLocal(CLAVE_RANGO);
    return esRango(r) ? r : 'todo';
  });
  const [vista, setVistaEstado] = useState<Vista>(() => (leerLocal(CLAVE_VISTA) === 'tabla' ? 'tabla' : 'cuadricula'));
  const [ordenParam, setOrden] = useParametro('orden');
  const [filtros, setFiltros] = useState<FiltrosVideos>({ soloConVentas: true, vendiendoAhora: false, reembolsoAlto: false, q: '' });
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const angosta = android || ancho === 'compacta';
  const conTabla = !angosta;
  const clic = useClicReciente();
  const sync = useSync();

  const { params, tablero } = useRangoVideos(rango);
  const videos = useConsulta('videos', params ?? {}, { activa: params !== null });
  const tablero7 = useConsulta('dashboard', { periodo: '7d' });
  const p7 = tablero7.datos?.periodo;
  const semana = useConsulta('videos', p7 ? { desde: p7.desde, hasta: p7.hasta } : {}, { activa: !!p7 });
  const productos = useConsulta('productos', {});

  const errorRango = rango !== 'todo' ? tablero.error : null;
  // Sin las fechas del rango (cargando o sin la PC) la consulta queda inactiva con params {}: lo que guarde la caché para
  // {} es «Todo» y NO se puede mostrar bajo «7 días».
  const items = params !== null && !errorRango ? videos.datos?.items : undefined;
  // rev. 5 · Con las métricas de TikTok (Display API) hay columnas, cifras en las tarjetas y dos órdenes más.
  const conMetricas = hayMetricas(items);
  const ordenPedido = esOrden(ordenParam) ? ordenParam : 'comision';
  const orden = !conMetricas && ORDENES_METRICAS.includes(ordenPedido) ? 'comision' : ordenPedido;
  const nombres = useMemo(() => mapaNombres(productos.datos?.items), [productos.datos]);
  const vendiendo = useMemo(() => (p7 && semana.datos ? idsVendiendo(semana.datos.items) : null), [p7, semana.datos]);
  const resumen = useMemo(() => resumenVideos(items ?? [], vendiendo), [items, vendiendo]);
  const ranking = useMemo(() => rankingPorComision(items ?? []), [items]);
  const visibles = useMemo(() => ordenarVideos(filtrarVideos(items ?? [], filtros, vendiendo, nombres), orden), [items, filtros, vendiendo, nombres, orden]);
  const reembolsoAltos = useMemo(() => filtrarVideos(items ?? [], { ...filtros, reembolsoAlto: true, q: '' }, vendiendo, nombres).length, [items, filtros, vendiendo, nombres]);
  // columnasVideos() de @/bloques no conoce el nombre del producto (FilaVideo.titulo siempre es null, C4): la celda
  // «Video» se cambia por una con el nombre corto del producto de la portada, igual que en la cuadrícula.
  const todasLasColumnas = useMemo(() => {
    const base = columnasVideos().map((c) => (c.id === 'video' ? { ...c, celda: (v: C.FilaVideo) => <CeldaVideo video={v} nombre={nombreVideo(v, nombres)} /> } : c));
    if (!conMetricas) return base;
    // Vistas y «pedidos por 1,000 vistas» junto a la comisión; likes, comentarios y compartidos después de reembolsos.
    const extra = columnasMetricas();
    const salida: ColumnaTabla<C.FilaVideo>[] = [];
    for (const c of base) {
      salida.push(c);
      if (c.id === 'comision') salida.push(...extra.filter((x) => x.id === 'vistas' || x.id === 'porMil'));
      if (c.id === 'reembolsos') salida.push(...extra.filter((x) => x.id !== 'vistas' && x.id !== 'porMil'));
    }
    return salida;
  }, [nombres, conMetricas]);
  const ajuste = useColumnasQueCaben(todasLasColumnas, REGLA_COLUMNAS);

  const setRango = (r: ClaveRango): void => {
    setRangoEstado(r);
    guardarLocal(CLAVE_RANGO, r);
  };
  const setVista = (v: Vista): void => {
    setVistaEstado(v);
    guardarLocal(CLAVE_VISTA, v);
  };
  const cambiar = (c: Partial<FiltrosVideos>): void => setFiltros((f) => ({ ...f, ...c }));
  const hayFiltros = filtros.vendiendoAhora || filtros.reembolsoAlto || filtros.q.trim() !== '' || !filtros.soloConVentas;

  const error = errorRango ?? videos.error;
  const cargando = !error && (params === null || videos.cargando || (!items && !videos.error));

  let cuerpo: ReactElement;
  if (cargando) {
    cuerpo = <CargaRejilla />;
  } else if (error && !items) {
    cuerpo = (
      <ErrorVista
        error={error}
        titulo={T.errorTitulo}
        alReintentar={() => void (errorRango ? tablero.refrescar() : videos.refrescar())}
        {...(rango !== 'todo' ? { textoNecesitaPc: T.necesitaPcRango, accionNecesitaPc: { etiqueta: T.verTodo, alPulsar: () => setRango('todo') } } : {})}
      />
    );
  } else if (!items || items.length === 0 || resumen.conVentas === 0 && filtros.soloConVentas && !hayFiltros) {
    cuerpo = (
      <EstadoVacio
        icono="SquarePlay"
        titulo={T.vacioTitulo}
        texto={T.vacioTexto}
        {...(rango !== 'todo'
          ? { accion: { etiqueta: T.verTodo, alPulsar: () => setRango('todo') } }
          : sync.puede ? { accion: { etiqueta: T.sincronizar, alPulsar: () => void sync.sincronizar() } } : {})}
        className={cx(css.estado)}
      />
    );
  } else if (visibles.length === 0) {
    cuerpo = (
      <EstadoVacio
        icono="Search"
        titulo={T.sinResultados}
        texto={T.sinResultadosTexto}
        accion={{ etiqueta: T.quitarFiltros, alPulsar: () => setFiltros({ soloConVentas: true, vendiendoAhora: false, reembolsoAlto: false, q: '' }) }}
        className={cx(css.estado)}
      />
    );
  } else if (conTabla && vista === 'tabla') {
    cuerpo = (
      <div className={cx(css.tablaMarco)} ref={ajuste.ref} onPointerDownCapture={clic.alPuntero}>
        <Tabla
          etiqueta={T.tablaEtiqueta}
          filas={visibles}
          columnas={ajuste.columnas}
          idFila={(v) => v.content_id}
          alAbrir={(v) => navegar(rutaVideo(v.content_id))}
          alSeleccionar={(v) => {
            if (clic.fueClic()) navegar(rutaVideo(v.content_id));
          }}
          claveScroll={`videos-${rango}-${orden}`}
        />
      </div>
    );
  } else {
    cuerpo = (
      <ul className={cx(css.rejilla)} aria-label={T.rejillaEtiqueta}>
        {visibles.map((v) => (
          <TarjetaGaleria
            key={v.content_id}
            video={v}
            nombre={nombreVideo(v, nombres)}
            lugar={ranking.get(v.content_id) ?? null}
            vendiendo={vendiendo?.has(v.content_id) ?? false}
          />
        ))}
      </ul>
    );
  }

  // Con las métricas de TikTok se dice de cuándo son las vistas; sin ellas, de dónde sale la fecha (primera venta).
  const metricasAt = conMetricas && items ? metricasAl(items) : null;
  const contexto = items && items.length > 0 ? (
    <>
      <span>{T.contexto(resumen.conPedidos, resumen.conVentas, resumen.ultimos7)}</span>
      <span className={cx(css.notaFecha)}>{metricasAt !== null ? T.notaMetricas(formato.fechaCorta(metricasAt)) : T.notaFecha}</span>
    </>
  ) : undefined;

  const sinNada = rango === 'todo' && !!items && items.length === 0;
  // «Cuadrícula | Tabla» va en el encabezado, a la derecha del título: así rango y orden caben en una fila desde la
  // ventana mínima de Windows (960) y los filtros en la siguiente.
  const vistaControl = conTabla ? (
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
  ) : null;

  return (
    <Pantalla titulo={T.titulo} lista={!!items || !!error}>
      <div className={cx(css.pantalla)}>
        <EncabezadoPantalla
          titulo={T.titulo}
          {...(contexto ? { contexto } : {})}
          acciones={(
            <div className={cx(css.accionesEncabezado)}>
              <Boton variante="primario" icono="Clapperboard" alPulsar={() => navegar('/videos/generar')}>
                Generar video
              </Boton>
              {vistaControl && !sinNada ? vistaControl : null}
            </div>
          )}
        />
        {/* Sin ningún video en todo el historial, rango, orden y vista no sirven: solo el estado vacío. */}
        {sinNada ? null : (
        <div className={cx(css.controles, css.trasEncabezado)}>
          <div className={cx(css.filaControles)} data-angosta={angosta ? '' : undefined}>
            {angosta ? (
              // En el celular los 5 rangos no caben en un segmentado sin partirse: van en un menú (hoja inferior).
              <Menu
                etiqueta={T.rangoCon(T.rangos[rango])}
                icono="CalendarDays"
                disparador="boton"
                opciones={RANGOS.map((r) => ({
                  id: r,
                  etiqueta: T.rangos[r],
                  ...(r === rango ? { icono: 'Check' as const } : {}),
                  alPulsar: () => setRango(r),
                }))}
                className={cx(css.menuRango)}
              />
            ) : (
              <Segmentado<ClaveRango>
                etiqueta={T.rango}
                valor={rango}
                alCambiar={setRango}
                opciones={RANGOS.map((r) => ({ valor: r, etiqueta: T.rangos[r] }))}
                className={cx(css.segmentoRango)}
              />
            )}
            {/* En el celular el orden va como botón de ícono junto al rango (un renglón menos antes de las fotos); su
                nombre accesible y el título de la hoja dicen el orden actual, y si no es el de siempre se ve en un chip. */}
            <Menu
              etiqueta={T.ordenarCon(T.orden[orden])}
              icono="ArrowDownUp"
              disparador={angosta ? 'icono' : 'boton'}
              opciones={ordenesPara(conMetricas).map((o) => ({
                id: o,
                etiqueta: T.orden[o],
                ...(o === orden ? { icono: 'Check' as const } : {}),
                alPulsar: () => setOrden(o === 'comision' ? null : o, { reemplazar: true }),
              }))}
              className={cx(angosta ? css.ordenIcono : css.menuControl)}
            />
          </div>
          {items && items.length > 0 ? (
            <div className={cx(css.filaFiltros)}>
              <div className={cx(css.chips)} role="group" aria-label={T.filtros}>
                {angosta && orden !== 'comision' ? (
                  <ChipFiltro activo alCambiar={() => setOrden(null, { reemplazar: true })}>{T.ordenActivo(T.orden[orden])}</ChipFiltro>
                ) : null}
                {vendiendo ? (
                  <ChipFiltro activo={filtros.vendiendoAhora} conteo={vendiendo.size} alCambiar={(a) => cambiar({ vendiendoAhora: a })}>
                    {T.vendiendoAhora}
                  </ChipFiltro>
                ) : null}
                <ChipFiltro activo={filtros.soloConVentas} conteo={resumen.conVentas} alCambiar={(a) => cambiar({ soloConVentas: a })}>
                  {T.soloConVentas}
                </ChipFiltro>
                <ChipFiltro activo={filtros.reembolsoAlto} conteo={reembolsoAltos} alCambiar={(a) => cambiar({ reembolsoAlto: a })}>
                  {T.reembolsoAlto}
                </ChipFiltro>
              </div>
              <CampoTexto
                etiqueta={T.buscar}
                etiquetaOculta
                tipo="search"
                placeholder={T.buscar}
                valor={filtros.q}
                alCambiar={(q) => cambiar({ q })}
                className={cx(css.buscador)}
              />
            </div>
          ) : null}
          {items && hayFiltros && visibles.length > 0 ? (
            <p className={cx(css.mostrando)} aria-live="polite">{T.mostrando(visibles.length, items.length)}</p>
          ) : null}
        </div>
        )}
        <div className={cx(css.trasEncabezado, videos.refrescando && css.refrescando)}>{cuerpo}</div>
      </div>
    </Pantalla>
  );
}
