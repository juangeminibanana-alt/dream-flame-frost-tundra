/**
 * Columnas de las tablas de Windows (02 §7.5) para Tiendas (01 §4.9), Videos (01 §4.12), Productos (01 §4.13) y
 * Pedidos (01 §4.11). Cifras a la derecha, proporcionales y con los mismos decimales por columna; foto en cada fila.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Foto, Icono, type ColumnaTabla } from '@/componentes';
import { ETIQUETA_ESTADO_ORDEN, formato, nombreCorto } from '@/dominio';
import { T, TITULO_COLUMNA as TC } from '../textos';
import { cx } from '../util/comun';
import { ChipSalud } from '../muestras/chips';
import { CeldaTienda } from '../muestras/columnasMuestras';
import { nombreVideo, vendiendoAhora } from './TarjetaVideo';
import css from '../muestras/columnas.module.css';

const guion = (): ReactElement => <span className={css.secundario}>—</span>;

function Cifra(p: { texto: string; fuerte?: boolean; secundario?: string }): ReactElement {
  return (
    <span className={css.apiladaDerecha}>
      <span className={p.fuerte ? css.cifraFuerte : css.cifra}>{p.texto}</span>
      {p.secundario ? <span className={css.secundario}>{p.secundario}</span> : null}
    </span>
  );
}

function Fecha(p: { valor: C.FechaLocal | C.EpochS | null }): ReactElement {
  return p.valor === null ? guion() : <span className={css.principalNormal}>{formato.fechaCorta(p.valor)}</span>;
}

// ---------------------------------------------------------------------------------------------- tiendas

function CeldaAviso(p: { t: C.FilaTienda }): ReactElement {
  const t = p.t;
  if (t.promesas.vencidas > 0) return <span className={css.avisoCritico}>{T.promesaVencida}</span>;
  if (t.por_avisar) return <span className={css.avisoPendiente}>{T.porAvisar}</span>;
  if (t.muestras.pendientes > 0 && t.promesas.vigentes > 0) {
    return (
      <span className={css.avisoOk}>
        <Icono nombre="Check" tamano={14} /> {T.avisada}
      </span>
    );
  }
  return guion();
}

export function columnasTiendas(): ColumnaTabla<C.FilaTienda>[] {
  return [
    { id: 'tienda', titulo: TC.tienda, ancho: 'minmax(200px, 1.6fr)', ordenable: true, celda: (t) => <CeldaTienda nombre={t.nombre} /> },
    {
      id: 'salud', titulo: TC.salud, ancho: 196, ordenable: true,
      celda: (t) => (
        <span title={t.salud_porque}>
          <ChipSalud salud={t.salud} esSocio={t.es_socio} />
        </span>
      ),
    },
    { id: 'pendientes', titulo: TC.pendientes, ancho: 104, alineacion: 'derecha', ordenable: true, celda: (t) => <Cifra texto={formato.numero(t.muestras.pendientes)} fuerte={t.muestras.pendientes > 0} /> },
    { id: 'aviso', titulo: TC.aviso, ancho: 136, celda: (t) => <CeldaAviso t={t} /> },
    { id: 'recibidas', titulo: TC.recibidas, ancho: 96, alineacion: 'derecha', prescindible: true, celda: (t) => <Cifra texto={formato.numero(t.muestras.recibidas)} /> },
    { id: 'entregadas', titulo: TC.entregadas, ancho: 104, alineacion: 'derecha', prescindible: true, celda: (t) => <Cifra texto={formato.numero(t.muestras.entregadas)} /> },
    {
      id: 'valor', titulo: TC.valorRecibido, ancho: 152, alineacion: 'derecha', ordenable: true, prescindible: true,
      celda: (t) => (t.muestras.recibidas > 0 ? <Cifra texto={formato.rangoDinero(t.muestras.valor_recibido_min_centavos, t.muestras.valor_recibido_max_centavos, { aprox: true })} /> : guion()),
    },
    { id: 'comision', titulo: TC.comisionTotal, ancho: 128, alineacion: 'derecha', ordenable: true, celda: (t) => <Cifra texto={formato.dinero(t.ventas.comision_estimada_centavos)} fuerte /> },
    {
      id: 'participacion', titulo: TC.participacion, ancho: 132, alineacion: 'derecha', prescindible: true,
      celda: (t) => (t.ventas.participacion_90d > 0 ? <Cifra texto={formato.porcentaje(t.ventas.participacion_90d, 1)} /> : guion()),
    },
    { id: 'ultima', titulo: TC.ultimaVenta, ancho: 108, ordenable: true, prescindible: true, celda: (t) => <Fecha valor={t.ventas.ultima_venta_at} /> },
    {
      id: 'productos', titulo: TC.productos, ancho: 72, prescindible: true,
      celda: (t) => <Foto url={t.imagen} alt="" anchoCss={32} proporcion="1:1" radio="xs" tienda={t.nombre} className={cx(css.miniatura)} />,
    },
  ];
}

// ---------------------------------------------------------------------------------------------- videos

function CeldaVideo(p: { v: C.FilaVideo }): ReactElement {
  const v = p.v;
  const nombre = nombreVideo(v);
  return (
    <span className={css.producto}>
      <Foto url={v.miniatura} alt="" anchoCss={30} proporcion="9:16" radio="xs" tienda={v.tienda_principal} className={cx(css.miniaturaVideo)} />
      <span className={css.textos}>
        <span className={css.principal}>{nombre}</span>
        <span className={css.secundario}>{v.miniatura_origen === 'producto' ? T.fotoDelProducto : T.videoId(formato.idCorto(v.content_id))}</span>
      </span>
    </span>
  );
}

export function columnasVideos(): ColumnaTabla<C.FilaVideo>[] {
  return [
    { id: 'video', titulo: TC.video, ancho: 'minmax(220px, 2fr)', celda: (v) => <CeldaVideo v={v} /> },
    { id: 'comision', titulo: TC.comision, ancho: 120, alineacion: 'derecha', ordenable: true, celda: (v) => <Cifra texto={formato.dinero(v.comision_estimada_centavos)} fuerte /> },
    { id: 'pedidos', titulo: TC.pedidos, ancho: 96, alineacion: 'derecha', ordenable: true, celda: (v) => <Cifra texto={formato.numero(v.pedidos)} /> },
    { id: 'unidades', titulo: TC.unidades, ancho: 96, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (v) => <Cifra texto={formato.numero(v.unidades)} /> },
    { id: 'reembolsos', titulo: TC.reembolsos, ancho: 108, alineacion: 'derecha', ordenable: true, celda: (v) => <Cifra texto={formato.porcentaje(v.tasa_reembolso, 1)} /> },
    { id: 'primera', titulo: TC.primeraVenta, ancho: 116, ordenable: true, prescindible: true, celda: (v) => <Fecha valor={v.primera_venta} /> },
    {
      id: 'ultima', titulo: TC.ultimaVenta, ancho: 128, ordenable: true,
      celda: (v) => (vendiendoAhora(v) ? (
        <span className={css.estado}>
          <span className={css.puntoOk} aria-hidden="true" />
          {formato.fechaCorta(v.ultima_venta)}
        </span>
      ) : <Fecha valor={v.ultima_venta} />),
    },
    { id: 'tienda', titulo: TC.tienda, ancho: 'minmax(150px, 1.2fr)', prescindible: true, celda: (v) => (v.tienda_principal ? <CeldaTienda nombre={v.tienda_principal} /> : guion()) },
    { id: 'productos', titulo: TC.productos, ancho: 96, alineacion: 'derecha', prescindible: true, celda: (v) => <Cifra texto={formato.numero(v.productos)} /> },
  ];
}

// ---------------------------------------------------------------------------------------------- productos

function CeldaProductoFila(p: { f: C.FilaProducto }): ReactElement {
  const f = p.f;
  const nombre = f.titulo_corto ?? nombreCorto(f.titulo);
  return (
    <span className={css.producto}>
      <Foto url={f.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={f.tienda_nombre} className={cx(css.miniatura)} />
      <span className={css.textos}>
        <span className={css.principal} title={f.titulo ?? nombre}>
          {nombre || T.productoId(formato.idCorto(f.product_id))}
        </span>
        {f.es_muestra ? <span className={css.secundario}>{T.fueMuestra}</span> : null}
      </span>
    </span>
  );
}

export function columnasProductos(): ColumnaTabla<C.FilaProducto>[] {
  return [
    { id: 'producto', titulo: TC.producto, ancho: 'minmax(240px, 2.2fr)', celda: (f) => <CeldaProductoFila f={f} /> },
    { id: 'tienda', titulo: TC.tienda, ancho: 'minmax(150px, 1.2fr)', prescindible: true, celda: (f) => (f.tienda_nombre ? <CeldaTienda nombre={f.tienda_nombre} /> : guion()) },
    { id: 'unidades', titulo: TC.unidades, ancho: 96, alineacion: 'derecha', ordenable: true, celda: (f) => <Cifra texto={formato.numero(f.unidades)} /> },
    { id: 'comision', titulo: TC.comision, ancho: 120, alineacion: 'derecha', ordenable: true, celda: (f) => <Cifra texto={formato.dinero(f.comision_estimada_centavos)} fuerte /> },
    { id: 'pedidos', titulo: TC.pedidos, ancho: 92, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (f) => <Cifra texto={formato.numero(f.pedidos)} /> },
    { id: 'videos', titulo: TC.videos, ancho: 84, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (f) => <Cifra texto={formato.numero(f.videos)} /> },
    { id: 'reembolsos', titulo: TC.reembolsos, ancho: 108, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (f) => <Cifra texto={formato.porcentaje(f.tasa_reembolso, 1)} /> },
    { id: 'tasa', titulo: TC.comisionPct, ancho: 104, alineacion: 'derecha', prescindible: true, celda: (f) => (f.con_ficha && f.comision_bp !== null ? <Cifra texto={formato.tasaBp(f.comision_bp)} /> : guion()) },
    {
      id: 'vitrina', titulo: TC.vitrina, ancho: 96, alineacion: 'centro', prescindible: true,
      celda: (f) => (f.en_vitrina === null ? guion() : f.en_vitrina ? <span className={css.si}>{T.si}</span> : <span className={css.secundario}>{T.no}</span>),
    },
  ];
}

// ---------------------------------------------------------------------------------------------- pedidos

const PUNTO_ESTADO: Readonly<Record<C.EstadoOrden, string | undefined>> = {
  SETTLED: css.puntoOk,
  'To-SETTLE': css.puntoInfo,
  'AWAITING PAYMENT': css.puntoInfo,
  REFUNDED: css.puntoNeutro,
  FROZEN: css.puntoAtencion,
  UNSPECIFIED: css.puntoAtencion,
  NO_DEVUELTA: css.puntoNeutro,
};

function CeldaPedidoProducto(p: { o: C.OrdenVista }): ReactElement {
  const linea = p.o.lineas[0];
  if (!linea) return guion();
  const nombre = nombreCorto(linea.producto) || T.productoId(formato.idCorto(linea.product_id));
  const mas = p.o.lineas.length - 1;
  return (
    <span className={css.producto}>
      <Foto url={linea.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={linea.tienda_nombre} className={cx(css.miniatura)} />
      <span className={css.textos}>
        <span className={css.principal} title={linea.producto ?? nombre}>
          {nombre}
        </span>
        <span className={css.secundario}>
          {linea.tienda_nombre ?? '—'}
          {mas > 0 ? ` · +${formato.numero(mas)} ${mas === 1 ? T.producto : T.productosMinusculas}` : ''}
        </span>
      </span>
    </span>
  );
}

export function columnasPedidos(): ColumnaTabla<C.OrdenVista>[] {
  return [
    {
      id: 'fecha', titulo: TC.pedido, ancho: 132, ordenable: true,
      celda: (o) => (
        <span className={css.apilada}>
          <span className={css.principalNormal}>{formato.fechaCorta(o.fecha)}</span>
          <span className={css.secundario}>{formato.idCorto(o.order_id)}</span>
        </span>
      ),
    },
    { id: 'producto', titulo: TC.producto, ancho: 'minmax(240px, 2.4fr)', celda: (o) => <CeldaPedidoProducto o={o} /> },
    {
      id: 'estado', titulo: TC.estado, ancho: 172, ordenable: true,
      celda: (o) => (
        <span className={css.estado}>
          <span className={cx(PUNTO_ESTADO[o.estado])} aria-hidden="true" />
          {ETIQUETA_ESTADO_ORDEN[o.estado]}
        </span>
      ),
    },
    { id: 'total', titulo: TC.total, ancho: 112, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (o) => <Cifra texto={formato.dinero(o.total_centavos, { decimales: true })} /> },
    { id: 'estimada', titulo: TC.comisionEstimada, ancho: 148, alineacion: 'derecha', ordenable: true, celda: (o) => <Cifra texto={formato.dinero(o.comision_estimada_centavos, { decimales: true })} fuerte /> },
    {
      id: 'liquidada', titulo: TC.comisionLiquidada, ancho: 148, alineacion: 'derecha', prescindible: true,
      celda: (o) => (o.estado === 'SETTLED' ? <Cifra texto={formato.dinero(o.comision_real_centavos, { decimales: true })} /> : guion()),
    },
  ];
}
