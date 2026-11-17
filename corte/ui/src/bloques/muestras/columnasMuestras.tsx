/**
 * Columnas de la tabla de muestras (Windows, 02 §7.5) para cada contexto: la cola de pendientes (01 §4.2), Todas
 * (01 §4.7), el detalle de tienda (01 §4.10 «Lo que le debes») y el detalle de producto (01 §4.13 «Muestras de este
 * producto»). Celda de producto = miniatura (--thumb-row) + nombre corto de 1 línea + variante en text-3.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { AvatarTienda, Chip, Foto, type ColumnaTabla } from '@/componentes';
import { formato } from '@/dominio';
import { cx, nombreDe } from '../util/comun';
import { BotonAccionMuestra } from './botones';
import { ChipAvanceBase, ChipTikTokBase, ChipsRazonesBase } from './chips';
import { precioVisible, textoTeDeja } from './FichaPrecio';
import { T, TITULO_COLUMNA as TC } from '../textos';
import css from './columnas.module.css';

export function CeldaProducto(p: { m: C.MuestraVista; conVariante?: boolean }): ReactElement {
  const { m } = p;
  const nombre = nombreDe(m.producto);
  return (
    <span className={css.producto}>
      <Foto url={m.producto.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.miniatura)} />
      <span className={css.textos}>
        <span className={css.principal} title={m.producto.titulo ?? nombre}>
          {nombre}
        </span>
        {p.conVariante !== false && m.variante ? <span className={css.secundario}>{m.variante}</span> : null}
      </span>
    </span>
  );
}

export function CeldaTienda(p: { nombre: string }): ReactElement {
  return (
    <span className={css.tienda}>
      <AvatarTienda nombre={p.nombre} tamano={20} />
      <span className={css.principalNormal}>{p.nombre}</span>
    </span>
  );
}

function CeldaSolicitada(p: { m: C.MuestraVista }): ReactElement {
  const t = p.m.solicitada_at;
  if (t === null) return <span className={css.secundario}>{T.porVerificar}</span>;
  return (
    <span className={css.apilada}>
      <span className={css.principalNormal}>{formato.fechaCorta(t)}</span>
      <span className={css.secundario}>{formato.haceDias(t)}</span>
    </span>
  );
}

function CeldaPrecio(p: { m: C.MuestraVista }): ReactElement {
  const v = precioVisible(p.m.producto);
  if (!v) return <span className={css.secundario}>—</span>;
  return (
    <span className={css.apiladaDerecha} title={v.rotulo}>
      <span className={css.cifra}>{v.texto}</span>
      {v.fuente === 'lista' ? <span className={css.secundario}>{T.precioLista}</span> : null}
    </span>
  );
}

function CeldaComision(p: { m: C.MuestraVista }): ReactElement {
  const pr = p.m.producto;
  if (pr.comision_por_venta_centavos === null && pr.comision_por_venta_max_centavos === null) return <span className={css.secundario}>—</span>;
  return (
    <span className={css.apiladaDerecha} title={textoTeDeja(pr) ?? undefined}>
      <span className={css.cifra}>{formato.rangoDinero(pr.comision_por_venta_centavos, pr.comision_por_venta_max_centavos, { decimales: true })}</span>
      {pr.comision_bp !== null ? <span className={css.secundario}>{formato.tasaBp(pr.comision_bp)}</span> : null}
    </span>
  );
}

/*
 * Anchos: las columnas de texto son fracciones CON mínimo (`minmax(Npx, Xfr)`, que Tabla pasa tal cual a la rejilla)
 * para que nunca colapsen a 0 cuando las fijas no caben; las de chips y cifras son fijas y miden lo que su contenido
 * más largo (con los 12 px de relleno por lado de la celda). Si la suma de mínimos no cabe, la tabla se desplaza
 * dentro de su caja en vez de recortar chips. En una columna «Estado en TikTok» o «Tu avance» el chip va sin el
 * prefijo: el encabezado ya da el contexto (02 §7.5: «el chip de etapa»).
 */
const columnaProducto = (conVariante = true): ColumnaTabla<C.MuestraVista> => ({
  id: 'producto', titulo: TC.producto, ancho: 'minmax(232px, 2.4fr)', ordenable: true, celda: (m) => <CeldaProducto m={m} conVariante={conVariante} />,
});
const columnaTienda: ColumnaTabla<C.MuestraVista> = { id: 'tienda', titulo: TC.tienda, ancho: 'minmax(148px, 1.3fr)', ordenable: true, celda: (m) => <CeldaTienda nombre={m.tienda.nombre} /> };
const columnaTikTok = (conMotivo = false): ColumnaTabla<C.MuestraVista> => ({
  id: 'tiktok', titulo: TC.estadoTikTok, ancho: 184, celda: (m) => <ChipTikTokBase muestra={m} conMotivo={conMotivo} sinPrefijo />,
});
const columnaAvance: ColumnaTabla<C.MuestraVista> = { id: 'avance', titulo: TC.tuAvance, ancho: 212, ordenable: true, celda: (m) => <ChipAvanceBase avance={m.avance} sinPrefijo /> };
function CeldaPromesa(p: { m: C.MuestraVista }): ReactElement {
  const { m } = p;
  const promesa = m.avisos.promesa;
  if (promesa === null || m.avance.etapa === 'publicada' || m.avance.etapa === 'no_se_puede') return <span className={css.secundario}>—</span>;
  // En la columna «Promesa» basta la fecha; el texto completo («Le prometiste el …») va en la ayuda.
  const vencida = m.avisos.promesa_vencida;
  return (
    <Chip tono={vencida ? 'critico' : 'info'} icono="CalendarClock" titulo={`${vencida ? T.promesaVencidaPrefijo : ''}${T.lePrometisteElFecha(formato.fechaConDia(promesa))}`}>
      {formato.fechaConDia(promesa)}
    </Chip>
  );
}
const columnaPromesa: ColumnaTabla<C.MuestraVista> = { id: 'promesa', titulo: TC.promesa, ancho: 136, prescindible: true, celda: (m) => <CeldaPromesa m={m} /> };
const columnaRazones: ColumnaTabla<C.MuestraVista> = {
  id: 'razones', titulo: TC.porQue, ancho: 'minmax(200px, 1.6fr)', prescindible: true,
  celda: (m) => (
    <span className={css.chips}>
      <ChipsRazonesBase muestra={m} maximo={1} sinPromesa />
    </span>
  ),
};
const columnaSolicitada: ColumnaTabla<C.MuestraVista> = { id: 'solicitada', titulo: TC.solicitada, ancho: 112, ordenable: true, celda: (m) => <CeldaSolicitada m={m} /> };
const columnaPrecio: ColumnaTabla<C.MuestraVista> = { id: 'precio', titulo: TC.precioVenta, ancho: 140, alineacion: 'derecha', ordenable: true, celda: (m) => <CeldaPrecio m={m} /> };
const columnaComision: ColumnaTabla<C.MuestraVista> = { id: 'comision', titulo: TC.comisionPorVenta, ancho: 140, alineacion: 'derecha', ordenable: true, prescindible: true, celda: (m) => <CeldaComision m={m} /> };
const columnaAccion: ColumnaTabla<C.MuestraVista> = { id: 'accion', titulo: TC.accion, ancho: 172, alineacion: 'derecha', celda: (m) => <BotonAccionMuestra muestra={m} tamano="sm" /> };
const columnaVariante: ColumnaTabla<C.MuestraVista> = { id: 'variante', titulo: TC.variante, ancho: 'minmax(120px, 1fr)', prescindible: true, celda: (m) => <span className={css.principalNormal}>{m.variante ?? '—'}</span> };
const columnaVendio: ColumnaTabla<C.MuestraVista> = {
  id: 'vendio', titulo: TC.vendio, ancho: 96, alineacion: 'centro', prescindible: true,
  celda: (m) => (m.ventas_producto.pedidos_validos > 0 ? <span className={css.si}>{T.si} · {formato.numero(m.ventas_producto.pedidos_validos)}</span> : <span className={css.secundario}>{T.no}</span>),
};

/** Columnas de la tabla de muestras (Windows) para cada contexto. */
export function columnasMuestras(contexto: 'pendientes' | 'todas' | 'tienda' | 'producto'): ColumnaTabla<C.MuestraVista>[] {
  switch (contexto) {
    case 'pendientes':
      return [columnaProducto(), columnaTienda, columnaTikTok(), columnaAvance, columnaRazones, columnaPrecio, columnaComision, columnaAccion];
    case 'todas':
      return [columnaProducto(false), columnaTienda, columnaVariante, columnaTikTok(true), columnaSolicitada, columnaPrecio, columnaComision, columnaVendio, columnaAvance, columnaPromesa];
    case 'tienda':
      return [columnaProducto(), columnaTikTok(), columnaAvance, columnaPromesa, columnaSolicitada, columnaPrecio, columnaAccion];
    case 'producto':
      return [columnaTienda, columnaVariante, columnaTikTok(true), columnaAvance, columnaSolicitada];
  }
}
