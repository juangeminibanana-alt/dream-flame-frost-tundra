/**
 * Contenido del Detalle de tienda (01_ux §4.10). Lo usan la página completa (#/tiendas/:key) y el panel de 480 de la
 * lista (≥ 1280). Orden de 01: salud y su porqué, KPI, lo que le debes, lo que le prometiste, lo que ya cumpliste,
 * ventas (comisión por mes, productos y videos con foto), historial de solicitudes y notas. En la página, columna
 * principal (8) y lateral (4) desde 1180; en el panel y en el celular, una sola columna.
 */
import { useMemo, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { useAcciones, useConsulta } from '@/datos';
import { navegar, useClaseAncho, usePlataforma } from '@/app';
import {
  AvatarTienda, BandaKpi, Boton, BotonIcono, Chip, Foto, GraficaColumnas, Icono, Kpi, MiniaturaVideo, Tabla, Tarjeta, TarjetaProducto, useToast,
} from '@/componentes';
import { ahoraS, formato, hoyLocal } from '@/dominio';
import { ChipSalud, ListaNotas, TarjetaMuestra, columnasMuestras, useControlMuestra } from '@/bloques';
import { copiarTexto } from '@/plataforma';
import {
  MESES_GRAFICA_ANGOSTA, REGLA_MUESTRAS, avisosConPromesas, mejorMes, muestraConNombre, nombreVisible, participacionKpi, pedidosTienda, portadaDelProducto,
  productoDePortada, seccionesMuestras, serieMensualContinua, ultimosPuntos, videosDeTienda, type AvisoVista,
} from './logica';
import { T } from './textos';
import { cx, useClicReciente } from './util';
import { useColumnasQueCaben } from './ajusteColumnas';
import css from './tiendas.module.css';

export type ModoDetalle = 'panel' | 'pagina';

const rutaMuestra = (id: string): string => `/muestras/m/${encodeURIComponent(id)}`;
const rutaProducto = (id: string): string => `/productos/${encodeURIComponent(id)}`;
const rutaVideo = (id: string): string => `/videos/${encodeURIComponent(id)}`;
export const rutaPlanTienda = (key: string): string => `/muestras/plan?tienda=${encodeURIComponent(key)}`;
export const ID_NOTAS = 'notas-tienda';

/** Bloque con título (17/24, 600). En la página va en Tarjeta (ritmo de 02 §5); en el panel, abierto con filete. */
function Seccion(p: { titulo: string; acciones?: ReactNode; children: ReactNode; id?: string; enTarjeta: boolean }): ReactElement {
  const contenido = (
    <section className={cx(css.seccion)} id={p.id} aria-label={p.titulo} data-en-tarjeta={p.enTarjeta ? '' : undefined}>
      <header className={cx(css.seccionCabeza)}>
        <h2 className={cx(css.seccionTitulo)}>{p.titulo}</h2>
        {p.acciones ? <div className={cx(css.seccionAcciones)}>{p.acciones}</div> : null}
      </header>
      {p.children}
    </section>
  );
  return p.enTarjeta ? <Tarjeta padding="amplio" className={cx(css.seccionTarjeta)}>{contenido}</Tarjeta> : contenido;
}

/** Hasta 3 fotos de la tienda: su imagen, la de sus productos con más comisión y la de sus muestras. */
function fotosDeTienda(d: C.TiendaDetalleResponse): FotoTienda[] {
  const vistas = new Set<string>();
  const salida: FotoTienda[] = [];
  const agregar = (url: C.UrlImagen | null, nombre: string, id: string | null): void => {
    if (!url) return;
    const clave = productoDePortada(url) ?? url;
    if (vistas.has(clave) || salida.length >= 3) return;
    vistas.add(clave);
    salida.push({ url, nombre, id });
  };
  const productos = [...d.productos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
  for (const x of productos) agregar(x.imagen, nombreVisible(x.titulo_corto, x.titulo), x.product_id);
  for (const m of d.muestras) agregar(m.producto.imagen, nombreVisible(m.producto.titulo_corto, m.producto.titulo), m.producto.product_id);
  agregar(d.tienda.imagen, d.tienda.nombre, productoDePortada(d.tienda.imagen));
  return salida;
}

interface FotoTienda { url: C.UrlImagen; nombre: string; id: string | null }

/** Foto de producto pulsable (lleva a su detalle). Sin product_id queda como imagen fija. */
function FotoProductoTienda(p: { foto: FotoTienda; tienda: string; anchoCss: number; proporcion: '1:1' | '4:5'; radio: 'md' | 'lg'; prioridad?: 'alta' }): ReactElement {
  const foto = <Foto url={p.foto.url} alt="" anchoCss={p.anchoCss} proporcion={p.proporcion} tienda={p.tienda} radio={p.radio} {...(p.prioridad ? { prioridad: p.prioridad } : {})} />;
  const id = p.foto.id;
  if (!id) return <div className={cx(css.heroeFoto)} role="img" aria-label={p.foto.nombre}>{foto}</div>;
  return (
    <button type="button" className={cx(css.heroeFoto)} onClick={() => navegar(rutaProducto(id))} aria-label={p.foto.nombre}>
      {foto}
    </button>
  );
}

function IdTienda(p: { shopId: string }): ReactElement {
  const toast = useToast();
  const copiar = (): void => {
    void copiarTexto(p.shopId).then((ok) => {
      if (ok) toast.mostrar({ texto: T.idCopiado, tono: 'ok' });
    });
  };
  return (
    <p className={cx(css.heroeId)}>
      <span>{T.idTienda}:</span>
      <code className={cx(css.mono)} title={p.shopId}>{formato.idCorto(p.shopId)}</code>
      <BotonIcono icono="Copy" etiqueta={T.copiarId} tamano="sm" alPulsar={copiar} />
    </p>
  );
}

/**
 * Héroe: la fotografía de sus productos manda (02 §1). Página ancha: foto 4:5 + dos cuadradas apiladas a la
 * izquierda; en el panel y en el celular, una fila de hasta 3 cuadradas arriba. A la derecha (o debajo): chip de
 * salud, su porqué, ID de tienda y la banda de KPI.
 */
/** Lo que pide atención de un vistazo: por avisar, promesas, última venta y el mensaje que sugerimos. */
function Hechos(p: { detalle: C.TiendaDetalleResponse }): ReactElement | null {
  const t = p.detalle.tienda;
  const plantillas = useConsulta('plantillas', {}, { activa: p.detalle.plantilla_sugerida !== null });
  const sugerida = p.detalle.plantilla_sugerida ? plantillas.datos?.items.find((x) => x.id === p.detalle.plantilla_sugerida) : undefined;
  const m = t.muestras;
  const conMuestras = m.recibidas > 0 || m.pendientes > 0 || m.entregadas > 0;
  const hay = t.por_avisar || t.promesas.vencidas > 0 || t.promesas.vigentes > 0 || t.ventas.ultima_venta_at !== null || !!sugerida || conMuestras;
  if (!hay) return null;
  return (
    <div className={cx(css.hechos)}>
      <div className={cx(css.hechosChips)}>
        {t.promesas.vencidas > 0 ? <Chip tono="critico" icono="CircleAlert">{T.promesasVencidas(t.promesas.vencidas)}</Chip> : null}
        {t.por_avisar ? <Chip tono="atencion" icono="Bell">{T.porAvisar}</Chip> : null}
        {t.promesas.vigentes > 0 ? <Chip tono="info" icono="CalendarCheck">{T.promesasVigentes(t.promesas.vigentes)}</Chip> : null}
        {t.ventas.ultima_venta_at !== null ? (
          <span className={cx(css.hecho)}>
            <Icono nombre="History" tamano={16} />
            {T.ultimaVenta(formato.fechaCorta(t.ventas.ultima_venta_at))}
          </span>
        ) : null}
      </div>
      {/* T4 de 01 §6.2: recibidas · pendientes · entregadas (la banda de KPI queda en 4, 02 §7.3). */}
      {conMuestras ? (
        <p className={cx(css.hecho)} data-hecho="muestras">
          <Icono nombre="Package" tamano={16} />
          <span>{T.muestrasResumen(m.recibidas, m.pendientes, m.entregadas)}</span>
        </p>
      ) : null}
      {sugerida ? (
        <p className={cx(css.hecho)}>
          <Icono nombre="MessageCircle" tamano={16} />
          <span>{T.mensajeSugerido(sugerida.nombre)}</span>
        </p>
      ) : null}
    </div>
  );
}

function Heroe(p: { detalle: C.TiendaDetalleResponse; modo: ModoDetalle; fila: boolean }): ReactElement {
  const t = p.detalle.tienda;
  const fotos = fotosDeTienda(p.detalle);
  const [principal, ...resto] = fotos;
  // Con 2 fotos van como pareja 4:5 del mismo alto (una 4:5 y una cuadrada dejaban un hueco debajo de la chica); con 3,
  // la 4:5 y las dos cuadradas apiladas suman el mismo alto.
  const pareja = !p.fila && fotos.length === 2;
  const fotosHtml = p.fila ? (
    <div className={cx(css.heroeFila)} data-n={Math.max(1, fotos.length)}>
      {fotos.length > 0
        ? fotos.map((f, i) => <FotoProductoTienda key={f.url} foto={f} tienda={t.nombre} anchoCss={160} proporcion="1:1" radio="md" {...(i === 0 ? { prioridad: 'alta' as const } : {})} />)
        : <Foto url={null} alt="" anchoCss={160} proporcion="1:1" tienda={t.nombre} radio="md" />}
    </div>
  ) : pareja ? (
    <div className={cx(css.heroeFotos)} data-n={2}>
      {fotos.map((f, i) => <FotoProductoTienda key={f.url} foto={f} tienda={t.nombre} anchoCss={210} proporcion="4:5" radio="lg" {...(i === 0 ? { prioridad: 'alta' as const } : {})} />)}
    </div>
  ) : (
    <div className={cx(css.heroeFotos)} data-n={fotos.length}>
      {principal
        ? <FotoProductoTienda foto={principal} tienda={t.nombre} anchoCss={264} proporcion="4:5" radio="lg" prioridad="alta" />
        : <Foto url={null} alt="" anchoCss={264} proporcion="4:5" tienda={t.nombre} radio="lg" />}
      {resto.length > 0 ? (
        <div className={cx(css.heroeFotosChicas)}>
          {resto.map((f) => <FotoProductoTienda key={f.url} foto={f} tienda={t.nombre} anchoCss={164} proporcion="1:1" radio="md" />)}
        </div>
      ) : null}
    </div>
  );
  // Página ancha: el porqué (title1) a la izquierda y las fotos a la derecha, como «Ponte al día» y su SIGUIENTE en
  // Main.png; en fila (panel, celular), las fotos arriba. Los KPI NO van aquí: BandaKpi ya son 4 tarjetas y van debajo,
  // como banda abierta (Inicio y Ventas), nunca dentro de la tarjeta del héroe.
  const texto = (
    <div className={cx(css.heroeTexto)}>
      {/* 01 §4.10: avatar de la tienda (iniciales y tono de 02 §7.17, el mismo de la tabla) con su chip de salud. */}
      <div className={cx(css.heroeIdentidad)}>
        <AvatarTienda nombre={t.nombre} tamano={40} />
        <ChipSalud salud={t.salud} esSocio={t.es_socio} />
      </div>
      <p className={cx(css.heroePorque)}>{t.salud_porque}</p>
      <Hechos detalle={p.detalle} />
      {t.shop_id ? <IdTienda shopId={t.shop_id} /> : null}
    </div>
  );
  const cuerpo = (
    <div className={cx(css.heroe)} data-modo={p.modo} data-fila={p.fila ? '' : undefined}>
      {p.fila ? fotosHtml : texto}
      {p.fila ? texto : fotosHtml}
    </div>
  );
  // En el celular y en el panel (fila) el héroe va abierto, como el del detalle de video.
  return p.modo === 'pagina' && !p.fila ? <Tarjeta padding="amplio" className={cx(css.heroeTarjeta)}>{cuerpo}</Tarjeta> : cuerpo;
}

function Kpis(p: { detalle: C.TiendaDetalleResponse; comision90: C.Centavos | null }): ReactElement {
  const t = p.detalle.tienda;
  const ped = pedidosTienda(p.detalle);
  const valor = t.muestras.valor_recibido_min_centavos > 0 || t.muestras.valor_recibido_max_centavos > 0
    ? formato.rangoDinero(t.muestras.valor_recibido_min_centavos, t.muestras.valor_recibido_max_centavos, { aprox: true })
    : T.sinDato;
  const tasa = ped.pedidos > 0 ? formato.porcentaje(ped.reembolsados / ped.pedidos) : formato.porcentaje(0);
  return (
    <BandaKpi titulo={T.kpiTitulo} className={cx(css.kpis)}>
      <Kpi
        etiqueta={T.kpiComision}
        valor={formato.dinero(t.ventas.comision_estimada_centavos)}
        {...(p.comision90 !== null ? { nota: T.kpiComision90(formato.dinero(p.comision90)) } : {})}
      />
      <Kpi etiqueta={T.kpiParte} valor={participacionKpi(t.ventas.participacion_90d) ?? T.sinDato} nota={T.kpiParteNota} />
      <Kpi
        etiqueta={ped.completos ? T.kpiPedidos : T.kpiPedidosValidos}
        valor={formato.numero(ped.pedidos)}
        nota={ped.completos ? T.kpiPedidosNota(tasa, ped.reembolsados) : T.kpiPedidosNotaSinSerie}
      />
      <Kpi etiqueta={T.kpiValor} valor={valor} nota={T.kpiValorNota(t.muestras.recibidas)} />
    </BandaKpi>
  );
}

function TablaMuestras(p: { muestras: C.MuestraVista[]; etiqueta: string }): ReactElement {
  const clic = useClicReciente();
  const todas = useMemo(() => columnasMuestras('tienda'), []);
  const ajuste = useColumnasQueCaben(todas, REGLA_MUESTRAS);
  return (
    <div className={cx(css.tablaMarco)} ref={ajuste.ref} onPointerDownCapture={clic.alPuntero}>
      <Tabla
        etiqueta={p.etiqueta}
        filas={p.muestras}
        columnas={ajuste.columnas}
        idFila={(m) => m.application_id}
        alAbrir={(m) => navegar(rutaMuestra(m.application_id))}
        alSeleccionar={(m) => {
          if (clic.fueClic()) navegar(rutaMuestra(m.application_id));
        }}
      />
    </div>
  );
}

function ListaMuestras(p: { muestras: C.MuestraVista[]; tabla: boolean; etiqueta: string; conAccion: boolean }): ReactElement {
  if (p.tabla) return <TablaMuestras muestras={p.muestras} etiqueta={p.etiqueta} />;
  return (
    <ul className={cx(css.listaMuestras)}>
      {p.muestras.map((m) => (
        <li key={m.application_id}>
          <TarjetaMuestra muestra={m} variante="lista" conAccion={p.conAccion} alAbrir={() => navegar(rutaMuestra(m.application_id))} />
        </li>
      ))}
    </ul>
  );
}


const TONO_PROMESA = { vigente: 'info', vencida: 'critico', cumplida: 'ok' } as const;

function Promesas(p: { avisos: AvisoVista[]; tiendaKey: string }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const control = useControlMuestra();
  if (p.avisos.length === 0) return <p className={cx(css.vacioCorto)}>{T.prometisteVacio}</p>;
  const quitar = (a: C.AvisoTienda): void => {
    void acciones.editarAviso(a.id, { quitado_at: ahoraS(), rev: a.rev }).then((r) => {
      if (r.estado === 'error' || r.estado === 'conflicto') {
        if (r.error) toast.mostrar({ texto: r.error.mensaje, tono: 'error' });
        return;
      }
      toast.mostrar({ texto: T.avisoQuitado, accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
    });
  };
  return (
    <ul className={cx(css.avisos)}>
      {p.avisos.map(({ aviso, promesas }) => (
        <li key={aviso.id} className={cx(css.aviso)}>
          <div className={cx(css.avisoCabeza)}>
            <span className={cx(css.avisoFecha)}>{T.avisoEnviado(formato.fechaCorta(aviso.marcado_enviado_at ?? ahoraS()))}</span>
            <Boton variante="fantasma" tamano="sm" icono="Trash2" alPulsar={() => quitar(aviso)}>{T.quitarAviso}</Boton>
          </div>
          {aviso.texto ? <p className={cx(css.avisoTexto)}>{aviso.texto}</p> : null}
          <ul className={cx(css.promesas)}>
            {promesas.map((x) => (
              <li key={`${x.avisoId}-${x.solicitud}`} className={cx(css.promesa)}>
                <span className={cx(css.promesaProducto)}>
                  {x.muestra ? nombreVisible(x.muestra.producto.titulo_corto, x.muestra.producto.titulo) : T.muestraDesconocida}
                </span>
                <span className={cx(css.promesaFecha)}>{T.promesa(formato.fechaConDia(x.fecha))}</span>
                <Chip tono={TONO_PROMESA[x.estado]}>
                  {x.estado === 'cumplida' && x.cumplidaEl ? T.promesaCumplida(formato.fechaCorta(x.cumplidaEl)) : x.estado === 'vencida' ? T.promesaVencida : T.promesaVigente}
                </Chip>
                {x.estado === 'vencida' ? (
                  <Boton variante="secundario" tamano="sm" alPulsar={() => control.abrirMensaje({ tienda: p.tiendaKey })}>{T.prepararNuevaFecha}</Boton>
                ) : null}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** Etiqueta del eje: sin el año si toda la serie es del mismo año ('feb 26' → 'feb'). */
function etiquetasMes(serie: readonly C.PuntoSerie[]): string[] {
  const anios = new Set(serie.map((x) => x.clave.slice(0, 4)));
  return serie.map((x) => (anios.size <= 1 ? x.etiqueta.replace(/\s+\d{2,4}$/, '') : x.etiqueta));
}

function Ventas(p: { detalle: C.TiendaDetalleResponse; videos: C.FilaVideo[] | undefined; modo: ModoDetalle; angosta: boolean }): ReactElement {
  const d = p.detalle;
  const hoyMes = hoyLocal().slice(0, 7);
  // Eje de tiempo continuo (los meses sin pedidos van en cero): ver serieMensualContinua. En el celular la gráfica
  // muestra los últimos 6 meses (con 10 columnas en ~300 px el rótulo «$1.2 mil · en curso» pisaba la columna vecina);
  // la tabla gemela («Ver como tabla») sigue con todos.
  const serieCompleta = serieMensualContinua(d.serie, hoyMes);
  const serie = p.angosta ? ultimosPuntos(serieCompleta, MESES_GRAFICA_ANGOSTA) : serieCompleta;
  const recortada = serie.length < serieCompleta.length;
  const etiquetas = etiquetasMes(serie);
  const mejor = mejorMes(serie);
  const unico = serieCompleta.length === 1 ? serieCompleta[0] : undefined;
  const notaMejor = mejor ? T.graficaNota(etiquetasMes([mejor])[0] ?? mejor.etiqueta, formato.dinero(mejor.comision_estimada_centavos)) : null;
  const nota = recortada ? T.graficaUltimos(serie.length, notaMejor) : notaMejor;
  const productos = [...d.productos].filter((x) => x.pedidos_validos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, 4);
  const nombres = new Map(d.productos.map((x) => [x.product_id, nombreVisible(x.titulo_corto, x.titulo)]));
  const videos = p.modo === 'pagina' && p.videos ? videosDeTienda(p.videos, d.tienda.nombre, 4) : [];
  if (serie.length === 0 && productos.length === 0 && videos.length === 0) return <p className={cx(css.vacioCorto)}>{T.sinVentas}</p>;
  return (
    <div className={cx(css.ventas)}>
      {unico ? (
        <div className={cx(css.subseccion)}>
          <h3 className={cx(css.subtitulo)}>{T.graficaMes}</h3>
          <p className={cx(css.vacioCorto)} data-un-solo-periodo="">
            {T.unSoloMes(etiquetasMes([unico])[0] ?? unico.etiqueta, formato.dinero(unico.comision_estimada_centavos), unico.pedidos)}
          </p>
        </div>
      ) : serie.length > 1 ? (
        <div className={cx(css.grafica)}>
          <GraficaColumnas
            titulo={T.graficaMes}
            alto={p.modo === 'panel' ? 160 : 200}
            {...(nota ? { nota } : {})}
            puntos={serie.map((x, i) => ({
              clave: x.clave,
              etiqueta: etiquetas[i] ?? x.etiqueta,
              valor: x.comision_estimada_centavos,
              enCurso: x.clave === hoyMes,
              aria: T.ariaMes(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.pedidos),
            }))}
            formatoEje={(v) => formato.ejeDinero(v)}
            tablaGemela={{
              columnas: [T.colMes, T.colComision, T.colPedidos],
              filas: serieCompleta.map((x) => [x.clave === hoyMes ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta, formato.dinero(x.comision_estimada_centavos), formato.numero(x.pedidos)]),
            }}
          />
        </div>
      ) : null}
      {productos.length > 0 ? (
        <div className={cx(css.subseccion)}>
          <h3 className={cx(css.subtitulo)}>{T.productosTop}</h3>
          <div className={cx(css.rejillaProductos)} data-modo={p.modo}>
            {productos.map((x, i) => (
              <TarjetaProducto
                key={x.product_id}
                imagen={x.imagen}
                nombre={nombreVisible(x.titulo_corto, x.titulo)}
                tienda={x.tienda_nombre ?? d.tienda.nombre}
                cifraPrincipal={formato.dinero(x.comision_estimada_centavos)}
                cifraSecundaria={T.productoCifra(x.unidades)}
                ranking={i + 1}
                alPulsar={() => navegar(rutaProducto(x.product_id))}
              />
            ))}
          </div>
        </div>
      ) : null}
      {videos.length > 0 ? (
        <div className={cx(css.subseccion)}>
          <h3 className={cx(css.subtitulo)}>{T.videosTop}</h3>
          <div className={cx(css.rejillaVideos)}>
            {videos.map((v, i) => {
              const idProducto = productoDePortada(v.miniatura);
              const nombre = (idProducto ? nombres.get(idProducto) : undefined) ?? T.videoNombre(formato.idCorto(v.content_id));
              const dinero = formato.dinero(v.comision_estimada_centavos);
              return (
                <MiniaturaVideo
                  key={v.content_id}
                  url={v.miniatura}
                  {...(portadaDelProducto(v) ? { rotulo: T.fotoDelProducto } : {})}
                  ranking={i + 1}
                  comision={dinero}
                  unidades={T.videoUnidades(v.unidades)}
                  nombre={nombre}
                  fechaPoster={formato.fechaCorta(v.primera_venta)}
                  tienda={v.tienda_principal}
                  anchoCss={160}
                  etiqueta={T.videoEtiqueta(i + 1, dinero, v.unidades, nombre)}
                  alPulsar={() => navegar(rutaVideo(v.content_id))}
                  className={cx(css.miniatura)}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ContenidoTienda(p: { detalle: C.TiendaDetalleResponse; modo: ModoDetalle }): ReactElement {
  const d = p.detalle;
  const ancho = useClaseAncho();
  const android = usePlataforma() === 'android';
  const hoy = hoyLocal();
  const control = useControlMuestra();
  // 90 días: el rango exacto lo da el tablero de 90 días (el mismo «hoy» del hub); sin él (copia), no se muestra.
  const tablero90 = useConsulta('dashboard', { periodo: '90d' });
  const rango = tablero90.datos?.periodo;
  const tiendas90 = useConsulta('tiendas', rango ? { desde: rango.desde, hasta: rango.hasta } : {}, { activa: !!rango });
  const videos = useConsulta('videos', {}, { activa: p.modo === 'pagina' });
  const comision90 = useMemo(() => {
    if (!rango || !tiendas90.datos) return null;
    const fila = tiendas90.datos.items.find((t) => t.tienda_key === d.tienda.tienda_key);
    return fila ? fila.ventas.comision_estimada_centavos : 0;
  }, [rango, tiendas90.datos, d.tienda.tienda_key]);

  // TarjetaMuestra y la tabla pintan titulo_corto tal cual: van con el nombre ya normalizado (02 §4.4).
  const secciones = useMemo(() => seccionesMuestras(d.muestras.map(muestraConNombre)), [d.muestras]);
  const avisos = useMemo(() => avisosConPromesas(d.avisos, d.muestras, hoy), [d.avisos, d.muestras, hoy]);
  const angosta = android || ancho === 'compacta';
  const tabla = p.modo === 'pagina' && !angosta;
  const dosColumnas = p.modo === 'pagina' && (ancho === 'expandida' || ancho === 'amplia');
  const enTarjeta = p.modo === 'pagina';
  const n = secciones.pendientes.length;

  const prometiste = (
    <Seccion titulo={T.prometiste} enTarjeta={enTarjeta}>
      <Promesas avisos={avisos} tiendaKey={d.tienda.tienda_key} />
    </Seccion>
  );
  const notas = (
    // ListaNotas ya es una tarjeta con su propio título (h3): en la página va sola, con el mismo padding y sombra que las
    // demás tarjetas; en el panel, debajo de un filete.
    enTarjeta ? (
      <div id={ID_NOTAS} className={cx(css.notasPagina)}>
        <ListaNotas entidad="tienda" entidadId={d.tienda.tienda_key} titulo={T.notas} className={cx(css.notasTarjeta)} />
      </div>
    ) : (
      <div id={ID_NOTAS} className={cx(css.notasPanel)}>
        <ListaNotas entidad="tienda" entidadId={d.tienda.tienda_key} titulo={T.notas} />
      </div>
    )
  );

  // Orden de 01 §4.10: le debes · le prometiste · ya cumpliste · ventas · historial · notas. Desde 1180 (página), las
  // dos tablas («Lo que le debes» e historial) van a todo lo ancho para que quepan sus columnas, y en medio la columna
  // principal (cumpliste y ventas) con la lateral (promesas y notas).
  const leDebes = (
    <Seccion
      titulo={T.leDebes(n)}
      enTarjeta={enTarjeta}
      acciones={n > 0 ? (
        <Boton variante="secundario" tamano="sm" icono="CalendarDays" alPulsar={() => navegar(rutaPlanTienda(d.tienda.tienda_key))}>
          {T.planearLas(n)}
        </Boton>
      ) : undefined}
    >
      {n > 0 ? <ListaMuestras muestras={secciones.pendientes} tabla={tabla} etiqueta={T.tablaPendientes} conAccion /> : <p className={cx(css.vacioCorto)}>{T.leDebesVacio}</p>}
    </Seccion>
  );
  const cumpliste = (
    <Seccion titulo={T.cumpliste} enTarjeta={enTarjeta}>
      {secciones.cumplidas.length > 0 ? (
        <ListaMuestras muestras={secciones.cumplidas} tabla={false} etiqueta={T.cumpliste} conAccion={false} />
      ) : <p className={cx(css.vacioCorto)}>{T.cumplisteVacio}</p>}
    </Seccion>
  );
  const ventas = (
    <Seccion titulo={T.ventas} enTarjeta={enTarjeta}>
      <Ventas detalle={d} videos={videos.datos?.items} modo={p.modo} angosta={angosta} />
    </Seccion>
  );
  const historial = p.modo === 'pagina' ? (
    <Seccion titulo={T.historial} enTarjeta={enTarjeta}>
      {secciones.historial.length > 0 ? (
        <ListaMuestras muestras={secciones.historial} tabla={tabla} etiqueta={T.tablaHistorial} conAccion={false} />
      ) : <p className={cx(css.vacioCorto)}>{T.historialVacio}</p>}
    </Seccion>
  ) : null;

  return (
    <div className={cx(css.detalle)} data-modo={p.modo}>
      <Heroe detalle={d} modo={p.modo} fila={p.modo === 'panel' || angosta} />
      <Kpis detalle={d} comision90={comision90} />
      {dosColumnas ? (
        <>
          {leDebes}
          <div className={cx(css.columnas)}>
            <div className={cx(css.columnaPrincipal)}>
              {cumpliste}
              {ventas}
            </div>
            <aside className={cx(css.columnaLateral)} aria-label={T.prometiste}>
              {prometiste}
              {notas}
            </aside>
          </div>
          {historial}
        </>
      ) : (
        <>
          {leDebes}
          {prometiste}
          {cumpliste}
          {ventas}
          {historial}
          {notas}
        </>
      )}
      {p.modo === 'pagina' && angosta ? (
        <div className={cx(css.barraFija)} data-barra-fija="">
          <Boton variante="primario" tamano="lg" anchoCompleto icono="MessageCircle" alPulsar={() => control.abrirMensaje({ tienda: d.tienda.tienda_key })}>
            {T.avisarTienda}
          </Boton>
        </div>
      ) : null}
    </div>
  );
}
