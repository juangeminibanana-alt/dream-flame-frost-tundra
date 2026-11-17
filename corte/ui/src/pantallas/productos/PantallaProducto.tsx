/**
 * #/productos/:id · Detalle de producto (01_ux §4.13, C18, C39). Foto grande con [Guardar imagen], título completo,
 * tienda, precio ≈ y comisión (FichaPrecio), comisión por anuncios, categoría en ruta, vendidos en TikTok Shop,
 * inventario, vitrina y [Abrir en TikTok Shop | la app de TikTok]; después «Tus ventas» (KPI y comisión por mes),
 * «Videos que lo venden», «Muestras de este producto» y notas.
 * SIN FICHA (ficha = null): se ocultan precio, comisión, categoría, vendidos e inventario y se dice por qué.
 * rev. 4 (15/11) · FICHA COMPLETA con `extendido` (./FichaCompleta): galería de tu vitrina bajo la foto, tarjetas de
 * Comisión (la tasa real de tus pedidos contra el plan abierto y los dirigidos) y Precio (lista, vitrina, descuento de
 * TikTok Shop y lo que pagaron tus compradores), origen de las ventas (o la nota del permiso), elegibilidad de muestra
 * con sus variantes y solicitudes anteriores, y parecidos del marketplace. Cada parte se oculta si no hay datos.
 * rev. 5 (15/11) · Display API: en «Videos que lo venden», la portada REAL de cada video y sus vistas y pedidos por 1,000
 * vistas (del video completo); sin métricas, todo queda como antes.
 */
import { useMemo, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useConsulta } from '@/datos';
import { EnlaceRuta, Pantalla, navegar, useClaseAncho, usePlataforma, useRuta, type ClaseAncho } from '@/app';
import {
  AvatarTienda, BandaKpi, Boton, BotonIcono, Chip, EncabezadoPantalla, GraficaColumnas, Icono, Kpi, MiniaturaVideo, Tarjeta,
  useToast,
} from '@/componentes';
import { formato, hoyLocal, nombreCorto } from '@/dominio';
import { FichaPrecio, ListaNotas, TarjetaMuestra } from '@/bloques';
import { abrirExterno, copiarTexto } from '@/plataforma';
import { CargaDetalle, ErrorVista } from './Estados';
import {
  BloqueMuestraExtendida, ChipsVitrina, GaleriaProducto, NotaPermisoOrigen, Seccion, SeccionComision, SeccionOrigen, SeccionParecidos,
  SeccionPrecio,
} from './FichaCompleta';
import {
  cifraCompacta, etiquetasMes, mejorMes, muestraConNombre, nombreVisible, portadaVideo, productoDePortada, serieMensualContinua, textoPorMil,
  vistaDetalle,
} from './logica';
import { extendidoDe, hayMuestraExtendida, vistaComision, vistaPrecio } from './logicaFicha';
import { T } from './textos';
import { cx, rutaMuestra, rutaTienda, rutaVideo } from './util';
import css from './productos.module.css';

function IdProducto(p: { id: string }): ReactElement {
  const toast = useToast();
  return (
    <p className={cx(css.id)}>
      <span>{T.idProducto}</span>
      <code className={cx(css.mono)} title={p.id}>{p.id}</code>
      <BotonIcono
        icono="Copy"
        etiqueta={T.copiarId}
        tamano="sm"
        alPulsar={() => void copiarTexto(p.id).then((ok) => ok && toast.mostrar({ texto: T.idCopiado, tono: 'ok' }))}
      />
    </p>
  );
}

function BotonAbrir(p: { enlace: string; android: boolean; anchoCompleto?: boolean }): ReactElement {
  const toast = useToast();
  return (
    <Boton
      variante="secundario"
      iconoFinal="ExternalLink"
      {...(p.anchoCompleto ? { anchoCompleto: true, tamano: 'lg' as const } : {})}
      alPulsar={() => void abrirExterno(p.enlace).then((ok) => !ok && toast.mostrar({ texto: T.abrirFallo, tono: 'error' }))}
    >
      {p.android ? T.abrirAppTikTok : T.abrirTikTokShop}
    </Boton>
  );
}

/** Lo que solo se sabe con la ficha de TikTok Shop. Sin ficha, este bloque NO se pinta (C18). */
function DatosFicha(p: { d: C.ProductoDetalleResponse; ficha: C.ProductoResumen }): ReactElement {
  const d = p.d;
  const vitrina = extendidoDe(d)?.vitrina ?? null;
  return (
    <div className={cx(css.ficha)} data-ficha="">
      <FichaPrecio producto={p.ficha} className={cx(css.fichaPrecio)} />
      {d.comision_anuncios_bp !== null ? <p className={cx(css.dato)}>{T.comisionAnuncios(formato.tasaBp(d.comision_anuncios_bp))}</p> : null}
      {d.categoria_ruta ? (
        <p className={cx(css.dato)} data-dato="categoria">
          <Icono nombre="Tag" tamano={16} />
          <span><span className={cx(css.srSolo)}>{T.categoria}: </span>{d.categoria_ruta}</span>
        </p>
      ) : null}
      {p.ficha.unidades_vendidas_global !== null ? (
        <p className={cx(css.dato)} data-dato="vendidos">
          <Icono nombre="TrendingUp" tamano={16} />
          <span>{T.vendidosGlobal(p.ficha.unidades_vendidas_global)}</span>
        </p>
      ) : null}
      <div className={cx(css.chipsFicha)}>
        {d.con_inventario !== null ? (
          <Chip tono={d.con_inventario ? 'ok' : 'atencion'} icono={d.con_inventario ? 'Check' : 'CircleAlert'}>
            {d.con_inventario ? T.conInventario : T.sinInventario}
          </Chip>
        ) : null}
        {p.ficha.en_vitrina || vitrina ? <Chip tono="info" icono="Store">{T.enVitrina}</Chip> : null}
        {/* «Sin inventario» ya lo dice: no se repite «Agotado en tu vitrina». */}
        <ChipsVitrina vitrina={vitrina && d.con_inventario === false ? { ...vitrina, con_existencias: null } : vitrina} />
      </div>
    </div>
  );
}

function GraficaMeses(p: { serie: C.PuntoSerie[]; compacta: boolean }): ReactElement {
  const mes = hoyLocal().slice(0, 7);
  // Eje de tiempo continuo (los meses sin pedidos van en cero): ver serieMensualContinua.
  const serie = serieMensualContinua(p.serie, mes);
  const etiquetas = etiquetasMes(serie);
  const mejor = mejorMes(serie);
  const unico = serie.length === 1 ? serie[0] : undefined;
  if (unico) {
    // Una sola columna no es gráfica (02 §9): se dice la cifra.
    return (
      <section aria-label={T.graficaMes} className={cx(css.seccionInterior)}>
        <h2 className={cx(css.seccionTitulo)}>{T.graficaMes}</h2>
        <p className={cx(css.vacioCorto)} data-un-solo-periodo="">
          {T.unSoloMes(etiquetas[0] ?? unico.etiqueta, formato.dinero(unico.comision_estimada_centavos), unico.unidades)}
        </p>
      </section>
    );
  }
  return (
    <GraficaColumnas
      titulo={T.graficaMes}
      alto={p.compacta ? 168 : 196}
      {...(mejor ? { nota: T.graficaNota(etiquetasMes([mejor])[0] ?? mejor.etiqueta, formato.dinero(mejor.comision_estimada_centavos)) } : {})}
      puntos={serie.map((x, i) => ({
        clave: x.clave,
        etiqueta: etiquetas[i] ?? x.etiqueta,
        valor: x.comision_estimada_centavos,
        enCurso: x.clave === mes,
        aria: T.ariaMes(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.unidades),
      }))}
      formatoEje={(v) => formato.ejeDinero(v)}
      tablaGemela={{
        columnas: [T.colMes, T.colComision, T.colUnidades],
        filas: serie.map((x) => [x.clave === mes ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta, formato.dinero(x.comision_estimada_centavos), formato.numero(x.unidades)]),
      }}
    />
  );
}

function Contenido(p: { d: C.ProductoDetalleResponse; compacta: boolean; ancho: ClaseAncho; android: boolean }): ReactElement {
  const d = p.d;
  const vista = vistaDetalle(d);
  const fila = d.fila;
  const productos = useConsulta('productos', {});
  const nombres = useMemo(() => {
    const m = new Map<string, string>();
    for (const x of productos.datos?.items ?? []) m.set(x.product_id, nombreVisible(x.titulo_corto, x.titulo));
    m.set(d.product_id, vista.nombre);
    return m;
  }, [productos.datos, d.product_id, vista.nombre]);
  const videos = [...d.videos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
  const r = fila ? Math.round(fila.pedidos * fila.tasa_reembolso) : 0;
  const enlace = d.ficha?.enlace ?? null;

  const extendido = extendidoDe(d);
  const foto = (
    // Con otra ficha (p. ej. al abrir un parecido) la galería vuelve a la foto del producto.
    <GaleriaProducto
      key={d.product_id}
      productoId={d.product_id}
      principal={vista.imagen}
      fotos={extendido?.galeria ?? []}
      nombre={vista.nombre}
      compacta={p.compacta}
      tienda={vista.tienda}
      categoria={d.ficha?.categoria ?? null}
      resumen={vista.resumen}
    />
  );
  const conComision = vistaComision(d) !== null;
  const conPrecio = vistaPrecio(d) !== null;

  const ventas = fila && fila.pedidos > 0 ? (
    <>
      <BandaKpi titulo={T.tusVentas} className={cx(css.kpis)}>
        <Kpi etiqueta={T.kpiComision} valor={formato.dinero(fila.comision_estimada_centavos)} nota={T.kpiVentas(formato.dinero(fila.ventas_centavos))} />
        <Kpi etiqueta={T.kpiUnidades} valor={formato.numero(fila.unidades)} />
        <Kpi etiqueta={T.kpiPedidos} valor={formato.numero(fila.pedidos)} nota={T.kpiPedidosNota(fila.pedidos_validos)} />
        <Kpi etiqueta={T.kpiReembolsos} valor={formato.porcentaje(fila.tasa_reembolso)} nota={T.kpiReembolsosNota(r)} />
      </BandaKpi>
      {d.serie.length > 0 ? (
        <Tarjeta padding="amplio" className={cx(css.seccion)}>
          <GraficaMeses serie={d.serie} compacta={p.compacta} />
        </Tarjeta>
      ) : (
        <p className={cx(css.vacioCorto)}>{T.sinSerie}</p>
      )}
      <NotaPermisoOrigen d={d} />
      <SeccionOrigen d={d} />
    </>
  ) : (
    <Seccion titulo={T.tusVentas}>
      <p className={cx(css.vacioCorto)}>{T.tusVentasVacio}</p>
    </Seccion>
  );

  // rev. 5 · Con las métricas de TikTok, cada video dice sus vistas y sus pedidos por 1,000 vistas (del video completo).
  const conMetricas = videos.some((v) => v.vistas !== undefined);
  const seccionVideos = (
    <Seccion titulo={T.videos_} {...(videos.length > 0 ? { nota: conMetricas ? T.videosNotaMetricas : T.videosNota } : {})}>
      {videos.length > 0 ? (
        <>
          <ul className={cx(css.rejillaVideos)}>
            {videos.slice(0, 8).map((v) => {
              const idPortada = productoDePortada(v.miniatura);
              const nombre = (idPortada ? nombres.get(idPortada) : undefined) ?? T.nombreVideo(formato.idCorto(v.content_id));
              const dinero = formato.dinero(v.comision_estimada_centavos);
              const portada = portadaVideo(v);
              const porMil = typeof v.pedidos_por_mil_vistas === 'number' ? textoPorMil(v.pedidos_por_mil_vistas) : null;
              return (
                <li key={v.content_id} className={cx(css.videoCelda)}>
                  <MiniaturaVideo
                    url={portada.url}
                    {...(portada.delProducto ? { rotulo: T.fotoDelProducto } : {})}
                    comision={dinero}
                    unidades={T.unidades(v.unidades)}
                    nombre={nombre}
                    fechaPoster={formato.fechaCorta(v.primera_venta)}
                    tienda={v.tienda_principal}
                    anchoCss={132}
                    etiqueta={T.etiquetaVideo(dinero, v.unidades, nombre)}
                    alPulsar={() => navegar(rutaVideo(v.content_id))}
                    className={cx(css.miniatura)}
                  />
                  {typeof v.vistas === 'number' ? (
                    <p className={cx(css.videoMetricas)} data-metricas="" title={T.metricasDe(formato.numero(v.vistas), porMil)}>
                      <span className={cx(css.videoVistas)}>{T.vistas(cifraCompacta(v.vistas))}</span>
                      {porMil ? (
                        <span className={cx(css.videoPorMil)}>
                          <span className={cx(css.sinCorte)}><span className={cx(css.videoPorMilCifra)}>{porMil}</span> {T.porMilPedidos}</span>{' '}
                          <span className={cx(css.sinCorte)}>{T.porMilResto}</span>
                        </span>
                      ) : null}
                    </p>
                  ) : v.vistas === null ? (
                    <p className={cx(css.videoMetricas, css.videoSinCifras)} title={T.sinCifrasTikTokAyuda}>{T.sinCifrasTikTok}</p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {fila && videos.length < fila.videos ? <p className={cx(css.listaCorta)}>{T.listaCorta(videos.length, fila.videos)}</p> : null}
        </>
      ) : (
        <p className={cx(css.vacioCorto)}>{T.videosVacio}</p>
      )}
    </Seccion>
  );

  const listaMuestras = d.muestras.length > 0 ? (
    <ul className={cx(css.listaMuestras)} aria-label={T.tusSolicitudes}>
      {d.muestras.map((m) => (
        <li key={m.application_id}>
          <TarjetaMuestra muestra={muestraConNombre(m)} variante="lista" alAbrir={() => navegar(rutaMuestra(m.application_id))} />
        </li>
      ))}
    </ul>
  ) : null;
  const seccionMuestras = (
    <Seccion titulo={T.muestras}>
      {hayMuestraExtendida(d) ? (
        // rev. 4: si puedes pedir muestra, tus solicitudes (las de la lista y las anteriores) y las variantes.
        <BloqueMuestraExtendida
          d={d}
          antes={listaMuestras ? (
            <div className={cx(css.subbloque)}>
              <h3 className={cx(css.subtitulo)}>{T.tusSolicitudes}</h3>
              {listaMuestras}
            </div>
          ) : null}
        />
      ) : (
        listaMuestras ?? <p className={cx(css.vacioCorto)}>{T.muestrasVacio}</p>
      )}
    </Seccion>
  );

  const notas = (
    // ListaNotas ya es una tarjeta con su título: va sola, con el padding y la sombra de las demás.
    <div className={cx(css.notasPagina)}>
      <ListaNotas entidad="producto" entidadId={d.product_id} titulo={T.notas} className={cx(css.notasTarjeta)} />
    </div>
  );

  return (
    <div className={cx(css.detalle)} data-compacta={p.compacta ? '' : undefined}>
      <div className={cx(css.heroe)}>
        {foto}
        <div className={cx(css.heroeTexto)}>
          {vista.tienda ? (
            vista.tiendaKey ? (
              <EnlaceRuta a={rutaTienda(vista.tiendaKey)} className={cx(css.tienda)}>
                <AvatarTienda nombre={vista.tienda} tamano={24} />
                <span>{vista.tienda}</span>
              </EnlaceRuta>
            ) : (
              <span className={cx(css.tienda)}>
                <AvatarTienda nombre={vista.tienda} tamano={24} />
                <span>{vista.tienda}</span>
              </span>
            )
          ) : null}
          {vista.promocion ? <Chip tono="marca" icono="Sparkles">{vista.promocion}</Chip> : null}
          {vista.tituloCompleto ? <p className={cx(css.tituloCompleto)}>{vista.tituloCompleto}</p> : null}
          {d.ficha ? (
            <DatosFicha d={d} ficha={d.ficha} />
          ) : (
            <p className={cx(css.sinFicha)} data-sin-ficha="">
              <Icono nombre="Info" tamano={18} />
              <span>{T.sinFicha}</span>
            </p>
          )}
          {enlace ? (
            <div className={cx(css.acciones)}>
              <BotonAbrir enlace={enlace} android={p.android} {...(p.compacta ? { anchoCompleto: true } : {})} />
            </div>
          ) : null}
          <IdProducto id={d.product_id} />
        </div>
      </div>
      {conComision || conPrecio ? (
        <div className={cx(css.dosTarjetas)} data-solo={conComision && conPrecio ? undefined : ''}>
          <SeccionComision d={d} />
          <SeccionPrecio d={d} />
        </div>
      ) : null}
      <div className={cx(css.columnas)}>
        <div className={cx(css.columnaAncha)}>
          {ventas}
          {seccionVideos}
        </div>
        <div className={cx(css.columnaLateral)}>
          {seccionMuestras}
          {notas}
        </div>
      </div>
      <SeccionParecidos d={d} ancho={p.ancho} />
    </div>
  );
}

/** En el celular el título va junto a «‹ Productos»: con 20 caracteres cabe en un renglón a 360–390; el título
 *  completo se lee debajo de la foto. */
const TITULO_CELULAR = 20;
/** En la ventana el título va en 30/700: con más de ~36 caracteres bajaba a dos renglones a 960–1280. Se corta en
 *  palabra; el nombre completo va en el contexto (y el título completo, debajo de la tienda). */
const TITULO_VENTANA = 36;

export function PantallaProducto(): ReactElement {
  const { params } = useRuta();
  const id = params['id'] ?? '';
  const consulta = useConsulta('producto', { id }, { activa: id !== '' });
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const compacta = ancho === 'compacta';
  const d = consulta.datos;
  const vista = d ? vistaDetalle(d) : null;
  const nombre = vista?.nombre ?? T.titulo;
  const titulo = !vista ? nombre
    : compacta ? nombreCorto(vista.tituloCompleto ?? nombre, TITULO_CELULAR) || nombre
      : nombreCorto(nombre, TITULO_VENTANA) || nombre;
  // Sin la PC, la franja «Sin conexión con tu PC · datos del {fecha}» la pone el marco (02 §7.9).
  // En la ventana, si el título se acortó, el contexto lleva el nombre completo antes de la tienda.
  const tienda = vista?.tienda ?? null;
  const contexto = vista && !compacta && titulo !== nombre ? T.contextoDetalle(nombre, tienda) : tienda ?? undefined;

  return (
    <Pantalla titulo={nombre} lista={!!d || !!consulta.error}>
      <div className={cx(css.pantalla)}>
        <EncabezadoPantalla titulo={titulo} volver={{ a: '/productos', etiqueta: T.volver }} {...(contexto ? { contexto } : {})} />
        <div className={cx(css.trasEncabezado, consulta.refrescando && css.refrescando)}>
          {consulta.cargando || (!d && !consulta.error) ? <CargaDetalle /> : null}
          {consulta.error && !d ? <ErrorVista error={consulta.error} titulo={T.errorDetalleTitulo} alReintentar={() => void consulta.refrescar()} /> : null}
          {d ? <Contenido d={d} compacta={compacta} ancho={ancho} android={android} /> : null}
        </div>
      </div>
    </Pantalla>
  );
}
