/* __DOBLE_CORTE__ · doble de @/bloques: cajas con nombre (y el dato principal), ProveedorBloques pasa children,
   useControlMuestra con promesas vacías y columnas* con 2 columnas básicas. Agrupados en un archivo: herramienta
   temporal hasta que ui-bloques entregue ui/src/bloques/. */
import type { ReactElement, ReactNode } from 'react';
import type * as C from '@/contrato';
import type { ColumnaTabla } from '@/componentes';
import type { ControlMuestra, EditorMensajeProps, ResumenPlanCreado, TarjetaMuestraProps } from '@firmas/bloques';
import { formato, nombreCorto, ETIQUETA_ETAPA, ETIQUETA_GRUPO, ETIQUETA_NIVEL, ETIQUETA_SALUD } from '@/dominio';
import { Caja, estilosDoble as css } from '../comun/Caja';

export function ProveedorBloques(p: { children: ReactNode }): ReactElement {
  return <>{p.children}</>;
}

export function DialogoMuestraNueva(): ReactElement | null {
  return null;
}

const nada = async (): Promise<void> => undefined;

const CONTROL: ControlMuestra = {
  planear: nada,
  cambiarEtapa: nada,
  accionPrincipal: nada,
  noSePuede: nada,
  vincularVideo: nada,
  moverDia: nada,
  fijar: nada,
  abrirMensaje: () => undefined,
};

export function useControlMuestra(): ControlMuestra {
  return CONTROL;
}

function tituloProducto(p: C.ProductoResumen): string {
  return p.titulo_corto ?? nombreCorto(p.titulo);
}

export function TarjetaMuestra(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  return (
    <Caja nombre="TarjetaMuestra" props={{ variante: p.variante, seleccionada: p.seleccionada }} className={p.className} alPulsar={p.alAbrir}>
      <span className={css.titulo}>{tituloProducto(m.producto)}</span>
      <span className={css.atenuado}>
        {m.tienda.nombre} · {ETIQUETA_GRUPO[m.grupo]} · Tu avance: {ETIQUETA_ETAPA[m.avance.etapa]}
      </span>
    </Caja>
  );
}

export function columnasMuestras(_contexto: 'pendientes' | 'todas' | 'tienda' | 'producto'): ColumnaTabla<C.MuestraVista>[] {
  return [
    { id: 'producto', titulo: 'Producto', celda: (m) => tituloProducto(m.producto) },
    { id: 'tienda', titulo: 'Tienda', celda: (m) => m.tienda.nombre },
  ];
}

export function ChipTikTok(p: { muestra: C.MuestraVista; conMotivo?: boolean; className?: string }): ReactElement {
  return (
    <Caja nombre="ChipTikTok" enLinea className={p.className}>
      TikTok: {ETIQUETA_GRUPO[p.muestra.grupo]}
      {p.conMotivo ? ` · ${p.muestra.motivo}` : ''}
    </Caja>
  );
}

export function ChipAvance(p: { avance: C.AvanceMuestra; className?: string }): ReactElement {
  return (
    <Caja nombre="ChipAvance" enLinea className={p.className}>
      Tu avance: {ETIQUETA_ETAPA[p.avance.etapa]}
    </Caja>
  );
}

export function ChipsRazones(p: { muestra: C.MuestraVista; maximo?: number; className?: string }): ReactElement | null {
  const razones = p.muestra.razones.slice(0, p.maximo ?? 2);
  if (razones.length === 0) return null;
  return <Caja nombre="ChipsRazones" props={{ razones }} enLinea className={p.className} />;
}

export function ChipPromesa(p: { avisos: C.ResumenAvisosMuestra; etapa: C.EtapaAvance; className?: string }): ReactElement | null {
  if (!p.avisos.promesa) return null;
  return (
    <Caja nombre="ChipPromesa" enLinea className={p.className}>
      Le prometiste el {formato.fechaConDia(p.avisos.promesa)}
    </Caja>
  );
}

export function ChipCopiadoSinConfirmar(p: { avisos: C.ResumenAvisosMuestra; className?: string }): ReactElement | null {
  if (!p.avisos.copiado_sin_confirmar) return null;
  return (
    <Caja nombre="ChipCopiadoSinConfirmar" enLinea className={p.className}>
      Mensaje copiado · sin confirmar
    </Caja>
  );
}

export function ChipVitrina(p: { enVitrina: boolean | null; className?: string }): ReactElement | null {
  if (p.enVitrina === null) return null;
  return (
    <Caja nombre="ChipVitrina" enLinea className={p.className}>
      {p.enVitrina ? 'En tu vitrina' : 'No está en tu vitrina'}
    </Caja>
  );
}

export function ChipPrioridad(p: { nivel: C.NivelPrioridad; className?: string }): ReactElement {
  return (
    <Caja nombre="ChipPrioridad" enLinea className={p.className}>
      {ETIQUETA_NIVEL[p.nivel]}
    </Caja>
  );
}

export function BotonAccionMuestra(p: { muestra: C.MuestraVista; tamano?: 'sm' | 'md' | 'lg'; anchoCompleto?: boolean; className?: string }): ReactElement | null {
  return (
    <button type="button" className={css.boton} data-componente="BotonAccionMuestra" onClick={() => undefined}>
      Acción de la muestra
    </button>
  );
}

export function FichaPrecio(p: { producto: C.ProductoResumen; compacta?: boolean; className?: string }): ReactElement {
  return (
    <Caja nombre="FichaPrecio" className={p.className}>
      {formato.rangoDinero(p.producto.precio_venta_min_centavos, p.producto.precio_venta_max_centavos, { aprox: true })}
    </Caja>
  );
}

export function TarjetaVentasProducto(p: { detalle: C.MuestraDetalleResponse; className?: string }): ReactElement | null {
  return <Caja nombre="TarjetaVentasProducto" props={{ tarjeta: p.detalle.muestra.tarjeta_video }} className={p.className} />;
}

export function BotonGuardarImagen(p: { producto: C.ProductoResumen; className?: string }): ReactElement {
  return (
    <button type="button" className={css.boton} data-componente="BotonGuardarImagen" onClick={() => undefined}>
      Guardar imagen del producto
    </button>
  );
}

export function BotonCopiarGuion(p: { muestra: C.MuestraVista; className?: string }): ReactElement {
  return (
    <button type="button" className={css.boton} data-componente="BotonCopiarGuion" onClick={() => undefined}>
      Copiar datos para tu guion
    </button>
  );
}

export function PestanasMuestras(p: { activa: 'pendientes' | 'agenda' | 'todas'; className?: string }): ReactElement {
  return <Caja nombre="PestanasMuestras" props={{ activa: p.activa }} className={p.className} />;
}

export function ChipSalud(p: { salud: C.SaludTienda; esSocio: boolean; className?: string }): ReactElement {
  return (
    <Caja nombre="ChipSalud" enLinea className={p.className}>
      {ETIQUETA_SALUD[p.salud]}
    </Caja>
  );
}

export function TarjetaTienda(p: { tienda: C.FilaTienda; variante: 'ficha' | 'fila'; alAbrir?: () => void; className?: string }): ReactElement {
  return (
    <Caja nombre="TarjetaTienda" props={{ variante: p.variante }} className={p.className} alPulsar={p.alAbrir}>
      <span className={css.titulo}>{p.tienda.nombre}</span>
      <span className={css.atenuado}>{p.tienda.salud_porque}</span>
    </Caja>
  );
}

export function columnasTiendas(): ColumnaTabla<C.FilaTienda>[] {
  return [
    { id: 'tienda', titulo: 'Tienda', celda: (t) => t.nombre },
    { id: 'comision', titulo: 'Comisión', alineacion: 'derecha', celda: (t) => formato.dinero(t.ventas.comision_estimada_centavos) },
  ];
}

export function TarjetaVideo(p: { video: C.FilaVideo; ranking?: number; nombreProducto?: string | null; anchoCss: number; alAbrir?: () => void; className?: string }): ReactElement {
  return (
    <Caja nombre="TarjetaVideo" props={{ ranking: p.ranking }} className={p.className} alPulsar={p.alAbrir}>
      <span className={css.titulo}>{p.nombreProducto ?? `Video ${formato.idCorto(p.video.content_id)}`}</span>
      <span className={css.cifra}>{formato.dinero(p.video.comision_estimada_centavos)}</span>
    </Caja>
  );
}

export function columnasVideos(): ColumnaTabla<C.FilaVideo>[] {
  return [
    { id: 'video', titulo: 'Video', celda: (v) => `Video ${formato.idCorto(v.content_id)}` },
    { id: 'comision', titulo: 'Comisión', alineacion: 'derecha', celda: (v) => formato.dinero(v.comision_estimada_centavos) },
  ];
}

export function TarjetaProductoFila(p: { producto: C.FilaProducto; ranking?: number; alAbrir?: () => void; className?: string }): ReactElement {
  return (
    <Caja nombre="TarjetaProductoFila" props={{ ranking: p.ranking }} className={p.className} alPulsar={p.alAbrir}>
      <span className={css.titulo}>{p.producto.titulo_corto ?? nombreCorto(p.producto.titulo)}</span>
      <span className={css.cifra}>{formato.dinero(p.producto.comision_estimada_centavos)}</span>
    </Caja>
  );
}

export function columnasProductos(): ColumnaTabla<C.FilaProducto>[] {
  return [
    { id: 'producto', titulo: 'Producto', celda: (x) => x.titulo_corto ?? nombreCorto(x.titulo) },
    { id: 'comision', titulo: 'Comisión', alineacion: 'derecha', celda: (x) => formato.dinero(x.comision_estimada_centavos) },
  ];
}

export function columnasPedidos(): ColumnaTabla<C.OrdenVista>[] {
  return [
    { id: 'pedido', titulo: 'Pedido', celda: (o) => formato.idCorto(o.order_id) },
    { id: 'total', titulo: 'Total', alineacion: 'derecha', celda: (o) => formato.dinero(o.total_centavos, { decimales: true }) },
  ];
}

export function ListaNotas(p: { entidad: C.EntidadNota; entidadId: string | null; titulo?: string; className?: string }): ReactElement {
  return <Caja nombre="ListaNotas" props={{ entidad: p.entidad, entidadId: p.entidadId, titulo: p.titulo }} className={p.className} />;
}

export function EditorMensaje(p: EditorMensajeProps): ReactElement {
  return <Caja nombre="EditorMensaje" props={{ tiendaKey: p.tiendaKey, solicitudes: p.solicitudes, modo: p.modo }} className={p.className} />;
}

export function DialogoMensaje(): ReactElement | null {
  return null;
}

export function TarjetaConfirmarAviso(): ReactElement | null {
  return null;
}

export function PanelPlan(p: { modo: 'compacto' | 'completo'; alCrear: (r: ResumenPlanCreado) => void; alSaltar?: () => void; className?: string }): ReactElement {
  return (
    <Caja nombre="PanelPlan" props={{ modo: p.modo }} className={p.className}>
      {p.alSaltar ? (
        <button type="button" className={css.boton} onClick={p.alSaltar}>
          Saltar
        </button>
      ) : null}
    </Caja>
  );
}

export function PanelQrEmparejamiento(p: { compacto?: boolean; alEmparejado?: (dispositivo: string) => void; className?: string }): ReactElement {
  return <Caja nombre="PanelQrEmparejamiento" props={{ compacto: p.compacto }} className={p.className} />;
}

export function DialogoSolicitudEmparejamiento(): ReactElement | null {
  return null;
}
