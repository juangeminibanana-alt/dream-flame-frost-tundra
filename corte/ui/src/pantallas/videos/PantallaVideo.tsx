/**
 * #/videos/:id · Detalle de video a página completa (01_ux §4.12, C4, C43). Portada grande (foto del producto, rotulada)
 * con el ReproductorTikTok SOLO en Windows; en Android, [Abrir en TikTok] fuera de la app. KPI (comisión, pedidos,
 * unidades, reembolsos), «Vendiendo desde» y «Última venta», comisión por semana, productos que vendió (con foto),
 * muestras vinculadas, notas del video e ID con [Copiar]. Nombre = nombre corto del producto o «Video 7677…3012».
 * Sin la PC (Android) se arma con la copia (sin serie, lista de productos que puede venir corta: se rotula).
 * rev. 5 (Display API): portada REAL cuando existe, «Publicado el …» y la banda «En TikTok» (MetricasVideo.tsx) con
 * vistas, likes, comentarios, compartidos, conversión y vistas nuevas por día. Sin métricas, nada de eso aparece.
 */
import { useMemo, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { useConsulta } from '@/datos';
import { EnlaceRuta, Pantalla, navegar, useClaseAncho, usePlataforma, useRuta } from '@/app';
import {
  AvatarTienda, BandaKpi, BotonIcono, Chip, EncabezadoPantalla, GraficaColumnas, Icono, Kpi, PuntoVivo, Tarjeta, TarjetaProducto,
  useToast,
} from '@/componentes';
import { formato, hoyLocal, nombreCorto } from '@/dominio';
import { ListaNotas, TarjetaMuestra } from '@/bloques';
import { copiarTexto } from '@/plataforma';
import { CargaDetalle, ErrorVista } from './Estados';
import { BotonAbrirVideo, PortadaVideo } from './MarcoVideo';
import { EnTikTok } from './MetricasVideo';
import {
  claveTiendaVideo, etiquetaEje, idsVendiendo, lunesDe, mapaNombres, mejorPunto, muestraConNombre, nombreVideo, nombreVisible, porMilTipico,
  rankingPorComision, reembolsados, serieSemanalContinua,
} from './logica';
import { T } from './textos';
import { cx, rutaMuestra, rutaProducto, rutaTienda } from './util';
import css from './videos.module.css';

function Seccion(p: { titulo: string; nota?: string; children: ReactNode; className?: string }): ReactElement {
  return (
    <Tarjeta padding="amplio" className={`${css.seccion} ${p.className ?? ''}`}>
      <section aria-label={p.titulo} className={cx(css.seccionInterior)}>
        <header className={cx(css.seccionCabeza)}>
          <h2 className={cx(css.seccionTitulo)}>{p.titulo}</h2>
          {p.nota ? <p className={cx(css.seccionNota)}>{p.nota}</p> : null}
        </header>
        {p.children}
      </section>
    </Tarjeta>
  );
}

function IdVideo(p: { id: string }): ReactElement {
  const toast = useToast();
  return (
    <p className={cx(css.id)}>
      <span>{T.idVideo}</span>
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

function GraficaSemanas(p: { serie: C.PuntoSerie[]; compacta: boolean }): ReactElement {
  const enCurso = lunesDe(hoyLocal());
  // Eje de tiempo continuo (las semanas sin pedidos van en cero): ver serieSemanalContinua.
  const serie = serieSemanalContinua(p.serie, enCurso);
  const mejor = mejorPunto(serie);
  const unico = serie.length === 1 ? serie[0] : undefined;
  if (unico) {
    // Una sola columna no es gráfica (02 §9): se dice la cifra.
    return (
      <section aria-label={T.graficaSemana} className={cx(css.seccionInterior)}>
        <h2 className={cx(css.seccionTitulo)}>{T.graficaSemana}</h2>
        <p className={cx(css.vacioCorto)} data-un-solo-periodo="">
          {T.unaSolaSemana(etiquetaEje(unico.etiqueta), formato.dinero(unico.comision_estimada_centavos), unico.pedidos)}
        </p>
      </section>
    );
  }
  return (
    <GraficaColumnas
      titulo={T.graficaSemana}
      alto={p.compacta ? 168 : 196}
      {...(mejor ? { nota: T.graficaNota(etiquetaEje(mejor.etiqueta), formato.dinero(mejor.comision_estimada_centavos)) } : {})}
      puntos={serie.map((x) => ({
        clave: x.clave,
        etiqueta: etiquetaEje(x.etiqueta),
        valor: x.comision_estimada_centavos,
        enCurso: x.clave === enCurso,
        aria: T.ariaSemana(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.pedidos),
      }))}
      formatoEje={(v) => formato.ejeDinero(v)}
      tablaGemela={{
        columnas: [T.colSemana, T.colComision, T.colPedidos],
        filas: serie.map((x) => [x.clave === enCurso ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta, formato.dinero(x.comision_estimada_centavos), formato.numero(x.pedidos)]),
      }}
    />
  );
}

function Contenido(p: { detalle: C.VideoDetalleResponse; nombre: string; lugar: number | null; vendiendo: boolean; compacta: boolean; android: boolean; tipico: number | null }): ReactElement {
  const v = p.detalle.video;
  const productos = [...p.detalle.productos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
  const vinculadas = v.muestras_vinculadas;
  const muestras = useConsulta('muestras', {}, { activa: vinculadas.length > 0 });
  const porId = useMemo(() => new Map((muestras.datos?.items ?? []).map((m) => [m.application_id, m])), [muestras.datos]);
  const r = reembolsados(v);

  const kpis = (
    <BandaKpi titulo={T.kpisTitulo} className={cx(css.kpis)}>
      <Kpi etiqueta={T.kpiComision} valor={formato.dinero(v.comision_estimada_centavos)} nota={T.kpiVentas(formato.dinero(v.ventas_centavos))} />
      <Kpi etiqueta={T.kpiPedidos} valor={formato.numero(v.pedidos)} nota={T.kpiPedidosNota(v.pedidos_validos)} />
      <Kpi etiqueta={T.kpiUnidades} valor={formato.numero(v.unidades)} />
      <Kpi etiqueta={T.kpiReembolsos} valor={formato.porcentaje(v.tasa_reembolso)} nota={T.kpiReembolsosNota(r)} />
    </BandaKpi>
  );

  const fechas = (
    <div className={cx(css.fechas)}>
      <span className={cx(css.fecha)}>
        <Icono nombre="CalendarDays" tamano={16} />
        <span>{T.vendiendoDesde(formato.fechaCorta(v.primera_venta))}</span>
      </span>
      <span className={cx(css.fecha)}>
        <Icono nombre="History" tamano={16} />
        <span>{T.ultimaVenta(formato.fechaCorta(v.ultima_venta))}</span>
      </span>
      {typeof v.publicado_at === 'number' ? (
        <span className={cx(css.fecha)}>
          <Icono nombre="Clapperboard" tamano={16} />
          <span>{T.publicadoEl(formato.fechaCorta(v.publicado_at))}</span>
        </span>
      ) : null}
      {p.vendiendo ? (
        <Chip tono="ok" titulo={T.vendiendoAhoraAyuda}>
          <PuntoVivo estado="ok" className={cx(css.punto)} />
          {T.vendiendoAhora}
        </Chip>
      ) : null}
    </div>
  );

  const claveTienda = claveTiendaVideo(v.tienda_principal, p.detalle.productos);
  const tienda = v.tienda_principal && claveTienda ? (
    <EnlaceRuta a={rutaTienda(claveTienda)} className={cx(css.tienda)}>
      <AvatarTienda nombre={v.tienda_principal} tamano={24} />
      <span>{v.tienda_principal}</span>
    </EnlaceRuta>
  ) : null;

  // La gráfica trae su propio título (title3) y «Ver como tabla»: va en una tarjeta sin encabezado.
  const grafica = p.detalle.serie.length > 0 ? (
    <Tarjeta padding="amplio" className={cx(css.seccion, !p.compacta && css.heroeGrafica)}>
      <GraficaSemanas serie={p.detalle.serie} compacta={p.compacta} />
    </Tarjeta>
  ) : (
    <Seccion titulo={T.graficaSemana} {...(p.compacta ? {} : { className: css.heroeGrafica })}>
      <p className={cx(css.vacioCorto)}>{T.sinSerie}</p>
    </Seccion>
  );

  // Ventana (no compacta): rejilla con la portada a la izquierda y, a su lado, texto, KPI, gráfica e ID. Si el detalle
  // mide menos de 720 (ventana de ~600–900), KPI, gráfica e ID bajan a todo lo ancho debajo de la portada (CSS
  // @container): con la portada al lado, la gráfica quedaba en una columna de ~90 px que no se leía.
  return (
    <div className={cx(css.detalle)} data-compacta={p.compacta ? '' : undefined}>
      <div className={cx(css.heroe)}>
        <PortadaVideo video={v} nombre={p.nombre} lugar={p.lugar} anchoCss={p.compacta ? 150 : 300} className={cx(css.heroePortada)} />
        <div className={cx(css.heroeTexto)}>
          <p className={cx(css.overline)}>{T.overline(formato.porcentaje(v.participacion, v.participacion < 0.1 ? 1 : 0))}</p>
          {tienda}
          {fechas}
          {p.android && !p.compacta ? <BotonAbrirVideo enlace={v.enlace} variante="primario" tamano="lg" anchoCompleto /> : null}
          {/* Ventana de menos de 768 (solo desarrollo; Windows no baja de 960): [Abrir en TikTok] baja del encabezado
              aquí para que el título conserve el ancho. Lo decide CSS (.soloVentanaAngosta / .soloVentanaAncha). */}
          {!p.android && !p.compacta ? <BotonAbrirVideo enlace={v.enlace} variante="secundario" className={cx(css.soloVentanaAngosta)} /> : null}
        </div>
        {!p.compacta ? kpis : null}
        {!p.compacta ? grafica : null}
        {!p.compacta ? <IdVideo id={v.content_id} /> : null}
      </div>
      {p.compacta ? <BotonAbrirVideo enlace={v.enlace} variante="primario" tamano="lg" anchoCompleto /> : null}
      {p.compacta ? kpis : null}
      {p.compacta ? grafica : null}
      {/* rev. 5 · Vistas, likes, conversión y tendencia de TikTok (solo si alguna vez se conectó la Display API). */}
      <EnTikTok detalle={p.detalle} tipico={p.tipico} compacta={p.compacta} />

      <div className={cx(css.columnas)}>
        <Seccion titulo={T.productos} nota={T.productosNota} className={cx(css.columnaAncha)}>
          {productos.length > 0 ? (
            <>
              <div className={cx(css.rejillaProductos)}>
                {productos.map((x, i) => {
                  const nombre = nombreVisible(x.titulo_corto, x.titulo);
                  return (
                    <TarjetaProducto
                      key={x.product_id}
                      imagen={x.imagen}
                      nombre={nombre}
                      tienda={x.tienda_nombre}
                      cifraPrincipal={formato.dinero(x.comision_estimada_centavos)}
                      cifraSecundaria={T.productoCifra(x.unidades)}
                      {...(i === 0 ? { ranking: 1 } : {})}
                      alPulsar={() => navegar(rutaProducto(x.product_id))}
                    />
                  );
                })}
              </div>
              {productos.length < v.productos ? <p className={cx(css.listaCorta)}>{T.listaCorta(productos.length, v.productos)}</p> : null}
            </>
          ) : (
            <p className={cx(css.vacioCorto)}>{T.sinProductos}</p>
          )}
        </Seccion>
        <div className={cx(css.columnaLateral)}>
          <Seccion titulo={T.muestras}>
            {vinculadas.length === 0 ? (
              <p className={cx(css.vacioCorto)}>{T.muestrasVacio}</p>
            ) : (
              <ul className={cx(css.listaMuestras)}>
                {vinculadas.map((id) => {
                  const m = porId.get(id);
                  return (
                    <li key={id}>
                      {m ? (
                        <TarjetaMuestra muestra={muestraConNombre(m)} variante="lista" conAccion={false} alAbrir={() => navegar(rutaMuestra(id))} />
                      ) : (
                        <EnlaceRuta a={rutaMuestra(id)} className={cx(css.enlaceMuestra)}>
                          {T.muestraSinDatos(formato.idCorto(id))}
                          <Icono nombre="ChevronRight" tamano={16} />
                        </EnlaceRuta>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Seccion>
          {/* ListaNotas ya es una tarjeta con su título: va sola, con el padding y la sombra de las demás. */}
          <div className={cx(css.notasPagina)}>
            <ListaNotas entidad="video" entidadId={v.content_id} titulo={T.notas} className={cx(css.notasTarjeta)} />
          </div>
          {p.compacta ? <IdVideo id={v.content_id} /> : null}
        </div>
      </div>
    </div>
  );
}

/** En el celular el título va junto a «‹ Videos»: con 20 caracteres cabe en un renglón a 360–390 («Chaqueta con
 *  cuello…»); el nombre completo sigue en la portada y en el lector de pantalla (título de la página). */
const TITULO_CELULAR = 20;
/** En la ventana el título va en 30/700 junto a [Abrir en TikTok]: con más de ~32 caracteres bajaba a dos renglones a
 *  960–1280. Se corta en palabra y el nombre completo pasa al contexto. */
const TITULO_VENTANA = 32;

export function PantallaVideo(): ReactElement {
  const { params } = useRuta();
  const id = params['id'] ?? '';
  const consulta = useConsulta('video', { id }, { activa: id !== '' });
  const productos = useConsulta('productos', {});
  const tablero7 = useConsulta('dashboard', { periodo: '7d' });
  const p7 = tablero7.datos?.periodo;
  const semana = useConsulta('videos', p7 ? { desde: p7.desde, hasta: p7.hasta } : {}, { activa: !!p7 });
  // Todo el historial (la misma consulta de la galería por omisión): su lugar por comisión para el «#4» de la portada.
  const historial = useConsulta('videos', {});
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const compacta = ancho === 'compacta';
  const d = consulta.datos;
  const lugar = useMemo(
    () => (d && historial.datos ? rankingPorComision(historial.datos.items).get(d.video.content_id) ?? null : null),
    [d, historial.datos],
  );
  // rev. 5 · «Tu video típico»: la mediana de pedidos por 1,000 vistas de todo tu historial.
  const tipico = useMemo(() => (historial.datos ? porMilTipico(historial.datos.items) : null), [historial.datos]);

  const nombres = useMemo(() => {
    const m = mapaNombres(productos.datos?.items);
    for (const [k, valor] of mapaNombres(d?.productos)) m.set(k, valor);
    return m;
  }, [productos.datos, d]);
  const nombre = d ? nombreVideo(d.video, nombres) : T.titulo;
  const vendiendo = d && p7 && semana.datos ? idsVendiendo(semana.datos.items)?.has(d.video.content_id) ?? false : false;

  // Sin la PC, la franja «Sin conexión con tu PC · datos del {fecha}» la pone el marco (02 §7.9).
  // Si el video no tiene nombre de producto, el título ya es «Video 7680…4613»: el contexto pasa a ser la tienda.
  // En la ventana, si el título se acortó, el contexto lleva el nombre completo antes del ID corto.
  const idCorto = d ? T.nombreVideo(formato.idCorto(d.video.content_id)) : null;
  const titulo = (compacta ? nombreCorto(nombre, TITULO_CELULAR) : nombreCorto(nombre, TITULO_VENTANA)) || nombre;
  const contexto = !d ? undefined
    : nombre === idCorto ? d.video.tienda_principal ?? undefined
      : !compacta && titulo !== nombre ? T.contextoDetalle(nombre, idCorto ?? '') : idCorto ?? undefined;

  return (
    <Pantalla titulo={nombre} lista={!!d || !!consulta.error}>
      <div className={cx(css.pantalla)}>
        <EncabezadoPantalla
          titulo={titulo}
          volver={{ a: '/videos', etiqueta: T.volver }}
          {...(contexto ? { contexto } : {})}
          {...(d && !android && !compacta ? { acciones: <BotonAbrirVideo enlace={d.video.enlace} variante="secundario" className={cx(css.soloVentanaAncha)} /> } : {})}
        />
        <div className={cx(css.trasEncabezado, consulta.refrescando && css.refrescando)}>
          {consulta.cargando || (!d && !consulta.error) ? <CargaDetalle /> : null}
          {consulta.error && !d ? <ErrorVista error={consulta.error} titulo={T.errorDetalleTitulo} alReintentar={() => void consulta.refrescar()} /> : null}
          {d ? <Contenido detalle={d} nombre={nombre} lugar={lugar} vendiendo={vendiendo} compacta={compacta} android={android} tipico={tipico} /> : null}
        </div>
      </div>
    </Pantalla>
  );
}
