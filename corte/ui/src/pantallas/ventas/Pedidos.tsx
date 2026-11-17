/**
 * Pedidos (01 §4.11 #7): chips «Todos · Liquidados · Por liquidar · Reembolsados», tabla con las columnas de
 * columnasPedidos() en Windows (fila seleccionada → panel de 480 desde 1280; si no, hoja) y tarjetas «12 nov · Gorra
 * Ejemplo · Por liquidar · $12.34» en celular, paginación de 50 y el detalle de cada línea (bases, desglose, unidades
 * reembolsadas o devueltas, ISR/IVA y agencia si vienen, actualización de TikTok y carrusel).
 */
import { useRef, type ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { EnlaceRuta } from '@/app';
import { columnasPedidos } from '@/bloques';
import { Boton, Chip, ChipFiltro, EstadoVacio, Foto, Hoja, Icono, PanelLateral, Tabla, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { detalleLinea, etiquetaEstado, FILTROS_PEDIDOS, nombreLinea, notasLinea, textoTarjetaPedido, tonoEstado, totalPaginas, type FiltroPedidos } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

/**
 * Anchos de las columnas de columnasPedidos() dentro de la tarjeta: con los de omisión (952 px fijos) la tabla pasaba
 * de los 928 px útiles a 1280×800 y «Comisión liquidada» quedaba cortada en el borde. Solo se ajusta `ancho` de las
 * columnas que existan; el resto de la definición (celdas, orden, prescindibles) es la de @/bloques.
 */
const ANCHOS_PEDIDOS: Readonly<Record<string, number>> = { fecha: 108, estado: 152, total: 108, estimada: 144, liquidada: 144 };
const COLUMNAS_PEDIDOS = columnasPedidos().map((c) => {
  const ancho = ANCHOS_PEDIDOS[c.id];
  return ancho !== undefined && typeof c.ancho === 'number' ? { ...c, ancho } : c;
});

/** Contenido del detalle de un pedido (panel de 480 o hoja). */
export function DetallePedido(p: { orden: C.OrdenVista }): ReactElement {
  const o = p.orden;
  return (
    <div className={css.detalle}>
      <div className={css.detalleCabeza}>
        <Chip tono={tonoEstado(o.estado)}>{etiquetaEstado(o.estado)}</Chip>
        <span className={css.detalleId}>
          {T.detalle.pedido} {formato.idCorto(o.order_id)}
        </span>
      </div>
      <dl className={css.detalleTotales}>
        <div>
          <dt>{T.detalle.total}</dt>
          <dd>{formato.dinero(o.total_centavos, { decimales: true })}</dd>
        </div>
        <div>
          <dt>{T.detalle.comisionEstimada}</dt>
          <dd>{formato.dinero(o.comision_estimada_centavos, { decimales: true })}</dd>
        </div>
        <div>
          <dt>{T.detalle.comisionLiquidada}</dt>
          <dd>{formato.dinero(o.comision_real_centavos, { decimales: true })}</dd>
        </div>
      </dl>
      <ul className={css.lineas}>
        {o.lineas.map((l, i) => {
          const nombre = nombreLinea(l);
          const notas = notasLinea(l);
          return (
            <li key={`${l.sku_id}-${i}`} className={css.linea}>
              <div className={css.lineaCabeza}>
                <Foto url={l.imagen} alt={nombre} anchoCss={56} proporcion="1:1" radio="sm" tienda={l.tienda_nombre} />
                <div className={css.lineaTextos}>
                  <EnlaceRuta a={`/productos/${encodeURIComponent(l.product_id)}`} className={css.lineaNombre}>
                    {nombre}
                  </EnlaceRuta>
                  <span className={css.lineaMeta}>
                    {l.tienda_nombre ? `${l.tienda_nombre} · ` : ''}
                    {l.precio_centavos !== null ? T.detalle.cantidad(l.cantidad, formato.dinero(l.precio_centavos, { decimales: true })) : formato.numero(l.cantidad)}
                  </span>
                </div>
              </div>
              <dl className={css.lineaDatos}>
                {detalleLinea(l).map((d) => (
                  <div key={d.id}>
                    <dt>{d.etiqueta}</dt>
                    <dd>{d.valor}</dd>
                  </div>
                ))}
              </dl>
              {notas.length > 0 ? (
                <ul className={css.lineaNotas}>
                  {notas.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              ) : null}
              {l.content_id ? (
                <EnlaceRuta a={`/videos/${encodeURIComponent(l.content_id)}`} className={css.enlacePie}>
                  {T.detalle.verVideo}
                  <Icono nombre="ChevronRight" tamano={16} />
                </EnlaceRuta>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TarjetaPedido(p: { orden: C.OrdenVista; alAbrir: () => void }): ReactElement {
  const t = textoTarjetaPedido(p.orden);
  const l = p.orden.lineas[0];
  const extra = p.orden.lineas.length - 1;
  return (
    <button type="button" className={css.tarjetaPedido} onClick={p.alAbrir} aria-label={T.pedidos.abrir(t.producto, t.fecha)}>
      <Foto url={l?.imagen ?? null} alt="" anchoCss={48} proporcion="1:1" radio="sm" tienda={l?.tienda_nombre ?? null} />
      <span className={css.tarjetaPedidoTextos}>
        <span className={css.tarjetaPedidoProducto}>{t.producto}</span>
        <span className={css.tarjetaPedidoMeta}>
          {t.fecha}
          {extra > 0 ? ` · ${T.pedidos.masProductos(extra)}` : ''}
        </span>
      </span>
      <span className={css.tarjetaPedidoDerecha}>
        <span className={css.tarjetaPedidoCifra}>{t.comision}</span>
        <Chip tono={tonoEstado(p.orden.estado)}>{t.estado}</Chip>
      </span>
    </button>
  );
}

export interface PedidosProps {
  respuesta: C.OrdenesResponse | undefined;
  /** Pedidos ya filtrados (defensa de filtrarPedidos). */
  filas: C.OrdenVista[];
  filtro: FiltroPedidos;
  pagina: number;
  seleccionado: string | null;
  compacto: boolean;
  /** Lista de tarjetas en lugar de la tabla (celular y cualquier Android). */
  tarjetas?: boolean;
  panelDisponible: boolean;
  refrescando: boolean;
  error: ErrorHub | null;
  alCambiarFiltro: (f: FiltroPedidos) => void;
  alCambiarPagina: (n: number) => void;
  alSeleccionar: (id: string | null) => void;
  alReintentar: () => void;
}

export function Pedidos(p: PedidosProps): ReactElement {
  // Un clic (o toque) abre el detalle; J/K o ↑/↓ solo mueven la selección (con el panel abierto, el panel la sigue).
  const deClic = useRef(false);
  // Si la fuente no aplicó el filtro (filtrarPedidos quitó filas de la página), su `total` no corresponde al chip
  // elegido: se cuentan solo las filas que sí se ven y no se ofrece paginar. Con el hub es lo de siempre.
  const filtroIgnorado = !!p.respuesta && p.filas.length !== p.respuesta.items.length;
  const total = filtroIgnorado ? p.filas.length : (p.respuesta?.total ?? 0);
  const paginas = filtroIgnorado ? 1 : totalPaginas(total, p.respuesta?.por_pagina);
  const sel = p.seleccionado ? (p.filas.find((o) => o.order_id === p.seleccionado) ?? null) : null;

  let cuerpo: ReactElement;
  if (!p.respuesta && p.error) cuerpo = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.respuesta) cuerpo = <EsqueletoSeccion alto={320} />;
  else if (p.filas.length === 0) {
    cuerpo = (
      <EstadoVacio
        icono="Search"
        titulo={T.pedidos.vacio}
        texto={T.pedidos.vacioTexto}
        {...(p.filtro !== 'todos' ? { accion: { etiqueta: T.pedidos.verTodos, alPulsar: () => p.alCambiarFiltro('todos') } } : {})}
        className={css.vacioPedidos}
      />
    );
  } else if (p.compacto || p.tarjetas === true) {
    cuerpo = (
      <ul className={css.listaPedidos} aria-label={T.pedidos.lista}>
        {p.filas.map((o) => (
          <li key={o.order_id}>
            <TarjetaPedido orden={o} alAbrir={() => p.alSeleccionar(o.order_id)} />
          </li>
        ))}
      </ul>
    );
  } else {
    cuerpo = (
      <div
        className={css.tablaPedidos}
        onPointerDownCapture={() => {
          deClic.current = true;
        }}
      >
        <Tabla
          etiqueta={T.pedidos.tabla}
          filas={p.filas}
          columnas={COLUMNAS_PEDIDOS}
          idFila={(o) => o.order_id}
          seleccionada={p.seleccionado}
          alSeleccionar={(o) => {
            const clic = deClic.current;
            deClic.current = false;
            if (clic || p.panelDisponible) p.alSeleccionar(o.order_id);
          }}
          alAbrir={(o) => p.alSeleccionar(o.order_id)}
          claveScroll="ventas-pedidos"
          virtual
          className={css.tablaEnTarjeta}
        />
      </div>
    );
  }

  const detalle = sel ? (
    p.panelDisponible && !p.compacto ? (
      <PanelLateral abierto titulo={T.detalle.titulo(formato.fechaConDia(sel.fecha))} alCerrar={() => p.alSeleccionar(null)}>
        <DetallePedido orden={sel} />
      </PanelLateral>
    ) : (
      <Hoja abierta titulo={T.detalle.titulo(formato.fechaConDia(sel.fecha))} alCerrar={() => p.alSeleccionar(null)}>
        <DetallePedido orden={sel} />
      </Hoja>
    )
  ) : null;

  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      <section className={css.seccion} aria-labelledby="ventas-pedidos">
        <div className={css.pedidosCabeza}>
          <h3 className={css.tarjetaTitulo} id="ventas-pedidos">
            {T.pedidos.titulo}
          </h3>
          {p.respuesta ? <span className={css.pedidosTotal}>{T.pedidos.total(total, formato.numero(total))}</span> : null}
        </div>
        <div className={css.chipsPedidos} role="group" aria-label={T.pedidos.filtros}>
          {FILTROS_PEDIDOS.map((f) => (
            <ChipFiltro key={f} activo={p.filtro === f} alCambiar={() => p.alCambiarFiltro(f)}>
              {T.pedidos.chips[f]}
            </ChipFiltro>
          ))}
        </div>
        <div className={p.refrescando ? css.refrescando : undefined}>{cuerpo}</div>
        {p.respuesta && paginas > 1 ? (
          <nav className={css.paginacion} aria-label={T.pedidos.titulo}>
            <Boton variante="secundario" tamano="sm" icono="ChevronLeft" deshabilitado={p.pagina <= 1} alPulsar={() => p.alCambiarPagina(p.pagina - 1)}>
              {T.pedidos.anterior}
            </Boton>
            <span className={css.paginaTexto} aria-live="polite">
              {T.pedidos.pagina(formato.numero(p.pagina), formato.numero(paginas))}
            </span>
            <Boton variante="secundario" tamano="sm" iconoFinal="ChevronRight" deshabilitado={p.pagina >= paginas} alPulsar={() => p.alCambiarPagina(p.pagina + 1)}>
              {T.pedidos.siguiente}
            </Boton>
          </nav>
        ) : null}
      </section>
      {detalle}
    </Tarjeta>
  );
}
