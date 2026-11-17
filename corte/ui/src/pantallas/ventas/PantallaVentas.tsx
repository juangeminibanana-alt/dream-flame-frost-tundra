/**
 * #/ventas · Ventas (01_ux §4.11; lienzo Ventas.png; 02 §7.3, §9). Entender el dinero: cuánto genero, cuánto ya está
 * liquidado, cuánto falta, cuánto pierdo por reembolsos y hacia dónde va la tendencia. Controles arriba (periodo, que se
 * recuerda, y comparar) → 8 KPI → gráfica principal → ¿Dónde está tu dinero? + De quién depende tu comisión →
 * Reembolsos + Productos que más venden → Por mes → Pedidos con su detalle.
 * Parámetros: ?periodo=7d|30d|90d|12m|todo|YYYY-MM · ?estado=liquidados|por_liquidar|reembolsados · ?pedido=<order_id>.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ParamsOrdenes } from '@/datos';
import { Pantalla, useClaseAncho, usePanelDisponible, useParametro, usePlataforma } from '@/app';
import { useConsulta, useSesion, useSync } from '@/datos';
import { EncabezadoPantalla, EstadoVacio } from '@/componentes';
import { formato, hoyLocal } from '@/dominio';
import { useHolguraCapas } from './capas';
import { Controles } from './Controles';
import { Dependencia, DondeDinero } from './Composicion';
import { CargaVentas, FranjaTrayendo } from './Estados';
import { GraficaPrincipal } from './GraficaPrincipal';
import { Kpis } from './Kpis';
import {
  agruparMeses, agruparSemanas, diasDelRango, esFiltro, esPeriodo, estadosDe, filtrarPedidos, granularidadAuto, granularidadesPermitidas, hoyDelHub, pasoPedidosEnCurso,
  PERIODO_POR_OMISION, POR_PAGINA, puntosSerie, semanaQueTrae, textoRango, ventasTodaviaNo, type FiltroPedidos, type Metrica,
} from './logica';
import { Pedidos } from './Pedidos';
import { PorMes } from './PorMes';
import { ProductosTop } from './ProductosTop';
import { Reembolsos } from './Reembolsos';
import { T } from './textos';
import css from './Ventas.module.css';

const CLAVE_PERIODO = 'corte.ventas.periodo';

function periodoGuardado(): C.Periodo | null {
  try {
    const v = window.localStorage.getItem(CLAVE_PERIODO);
    return esPeriodo(v) ? v : null;
  } catch {
    return null;
  }
}

function guardarPeriodo(p: C.Periodo): void {
  try {
    window.localStorage.setItem(CLAVE_PERIODO, p);
  } catch {
    /* sin almacenamiento: solo no se recuerda */
  }
}

export function PantallaVentas(): ReactElement {
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  // El acomodo sigue al ancho (C5/C41): un Android de 600 o más (tableta) usa la composición ancha con densidad
  // táctil; los pedidos van en lista de tarjetas en cualquier Android (en Windows, tabla).
  const compacto = clase === 'compacta';
  const tarjetasPedidos = compacto || plataforma === 'android';
  const panelDisponible = usePanelDisponible();
  // Espacio al final para que la paginación suba por encima de la tarjeta fija «¿Le enviaste el mensaje…?» (capas.ts).
  const [raiz, setRaiz] = useState<HTMLDivElement | null>(null);
  const holgura = useHolguraCapas(raiz);
  const sesion = useSesion();
  const sync = useSync();

  const [periodoParam, setPeriodoParam] = useParametro('periodo');
  const [estadoParam, setEstadoParam] = useParametro('estado');
  const [pedidoParam, setPedidoParam] = useParametro('pedido');
  const [guardado] = useState(periodoGuardado);
  const periodo: C.Periodo = esPeriodo(periodoParam) ? periodoParam : (guardado ?? PERIODO_POR_OMISION);
  const filtro: FiltroPedidos = esFiltro(estadoParam) ? estadoParam : 'todos';
  const [comparar, setComparar] = useState(true);
  const [metrica, setMetrica] = useState<Metrica>('comision');
  const [granManual, setGranManual] = useState<C.Granularidad | null>(null);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    if (esPeriodo(periodoParam)) guardarPeriodo(periodoParam);
  }, [periodoParam]);

  const tablero = useConsulta('dashboard', { periodo });
  // Mientras llega el periodo nuevo se queda el anterior al 60 % (sin esqueleto ni salto, 02 §9.4 regla 11).
  const ultimo = useRef<C.DashboardResponse | undefined>(undefined);
  if (tablero.datos) ultimo.current = tablero.datos;
  const d = tablero.datos ?? (tablero.error ? undefined : ultimo.current);
  const cambiando = !tablero.datos && !!d;

  const rango = d ? { desde: d.periodo.desde, hasta: d.periodo.hasta } : null;
  const hoyHub = d ? hoyDelHub(d) : hoyLocal();
  const permitidas = rango ? granularidadesPermitidas(rango.desde, rango.hasta) : (['dia'] as C.Granularidad[]);
  const granDash = d?.serie.granularidad ?? (rango ? granularidadAuto(rango.desde, rango.hasta) : 'dia');
  // Celular: la gráfica va a todo lo ancho y con más de 12 barras quedaban columnas de 7 px (01 §4.11 pide no pasar
  // de 12 sin desplazar). Por omisión se agrupa entonces por semana; «Día» sigue a un toque en el segmentado.
  const granAuto: C.Granularidad = compacto && rango && granDash === 'dia' && diasDelRango(rango.desde, rango.hasta) > 12 && permitidas.includes('semana') ? 'semana' : granDash;
  const gran: C.Granularidad = granManual && permitidas.includes(granManual) ? granManual : permitidas.includes(granAuto) ? granAuto : (permitidas[0] ?? 'dia');
  // Semana sobre un tablero diario: se suma la serie del tablero (exacto, sin otra consulta; funciona con la copia).
  const semanasDeDias = !!d && gran === 'semana' && d.serie.granularidad === 'dia';
  const usaSerieTablero = !!d && (d.serie.granularidad === gran || semanasDeDias);
  const serie = useConsulta('serie', { granularidad: gran, desde: rango?.desde ?? '', hasta: rango?.hasta ?? '' }, { activa: !!rango && !usaSerieTablero && !cambiando });
  // Meses: los del tablero si ya vienen por mes; si el tablero es diario, se suman sus días (exacto, sin otra consulta;
  // así «Por mes» y la tasa por mes también salen con la copia del celular sin la PC). Si no, la serie mensual del hub.
  const mesesDelTablero = !!d && d.serie.granularidad === 'mes';
  const mesesDeDias = !!d && d.serie.granularidad === 'dia';
  const serieMes = useConsulta('serie', { granularidad: 'mes', desde: rango?.desde ?? '', hasta: rango?.hasta ?? '' }, { activa: !!rango && !mesesDelTablero && !mesesDeDias && !cambiando });
  const tiendas = useConsulta('tiendas', { desde: rango?.desde ?? '', hasta: rango?.hasta ?? '', orden: 'comision' }, { activa: !!rango && !cambiando });
  const productos = useConsulta('productos', { desde: rango?.desde ?? '', hasta: rango?.hasta ?? '' }, { activa: !!rango && !cambiando });

  const estados = estadosDe(filtro);
  const paramsOrdenes: ParamsOrdenes = {
    // «Todo» = sin rango (todos los pedidos); el resto, el rango que respondió el hub.
    ...(periodo === 'todo' || !rango ? {} : { desde: rango.desde, hasta: rango.hasta }),
    ...(estados ? { estado: estados } : {}),
    pagina,
    por_pagina: POR_PAGINA,
  };
  const ordenes = useConsulta('ordenes', paramsOrdenes, { activa: !!rango && !cambiando });
  const filasPedidos = useMemo(
    () => (ordenes.datos ? filtrarPedidos(ordenes.datos.items, estados, periodo === 'todo' ? null : (rango?.desde ?? null), periodo === 'todo' ? null : (rango?.hasta ?? null)) : []),
    [ordenes.datos, estados, periodo, rango?.desde, rango?.hasta],
  );

  const puntosTablero = d?.serie.puntos;
  const puntosBase = useMemo(
    () => (usaSerieTablero ? (semanasDeDias && puntosTablero ? agruparSemanas(puntosTablero) : puntosTablero) : serie.datos?.puntos),
    [usaSerieTablero, semanasDeDias, puntosTablero, serie.datos],
  );
  const puntos = useMemo(() => (puntosBase ? puntosSerie(puntosBase, gran, hoyHub, rango?.desde) : undefined), [puntosBase, gran, hoyHub, rango?.desde]);
  const mesesBase = useMemo(
    () => (mesesDelTablero ? puntosTablero : mesesDeDias && puntosTablero ? agruparMeses(puntosTablero) : serieMes.datos?.puntos),
    [mesesDelTablero, mesesDeDias, puntosTablero, serieMes.datos],
  );
  const errorMeses = mesesDelTablero || mesesDeDias ? null : serieMes.error;
  const meses = useMemo(() => (mesesBase ? puntosSerie(mesesBase, 'mes', hoyHub) : undefined), [mesesBase, hoyHub]);

  const cambiarPeriodo = (p: C.Periodo): void => {
    setPeriodoParam(p, { reemplazar: true });
    setPagina(1);
    setGranManual(null);
    setPedidoParam(null, { reemplazar: true });
  };
  const cambiarFiltro = (f: FiltroPedidos): void => {
    setEstadoParam(f === 'todos' ? null : f, { reemplazar: true });
    setPagina(1);
  };

  const estadoSync = sync.estado ?? sesion.datos?.sync ?? null;
  const pasoPedidos = pasoPedidosEnCurso(estadoSync);
  const todaviaNo = ventasTodaviaNo(estadoSync, sesion.datos?.datos.ultima_sync_ok_at);
  const semana = semanaQueTrae(pasoPedidos);
  const textoTrayendo = semana ? T.estados.trayendo(formato.numero(semana.n), formato.numero(semana.total)) : T.estados.trayendoSinSemana;
  const lista = !!d || !!tablero.error;
  const puedeComparar = !!d?.kpis_anterior;

  const encabezado = (
    <EncabezadoPantalla titulo={T.titulo} {...(d ? { contexto: T.contexto(textoRango(d.periodo)) } : {})} />
  );
  const controles = (
    <Controles
      periodo={periodo}
      hoy={hoyHub}
      compacto={compacto}
      comparar={comparar}
      puedeComparar={puedeComparar}
      alCambiarPeriodo={cambiarPeriodo}
      alCambiarComparar={setComparar}
    />
  );

  let cuerpo: ReactElement;
  if (todaviaNo && !tablero.error) {
    // Primera sincronización sin pedidos todavía: nunca «$0» ni «No hay pedidos en este periodo».
    cuerpo = (
      <div className={css.bloques}>
        <FranjaTrayendo texto={textoTrayendo} />
        <CargaVentas />
      </div>
    );
  } else if (!d && !tablero.error) {
    cuerpo = <CargaVentas />;
  } else if (!d) {
    const e = tablero.error;
    cuerpo =
      e?.codigo === 'necesita_pc' ? (
        <EstadoVacio
          icono="Monitor"
          titulo={T.estados.necesitaPc}
          texto={T.estados.necesitaPcTexto}
          accion={{ etiqueta: T.periodo['30d'], alPulsar: () => cambiarPeriodo('30d') }}
          className={css.estadoGlobal}
        />
      ) : (
        <EstadoVacio icono="CircleAlert" titulo={T.estados.errorTitulo} texto={e?.mensaje ?? ''} accion={{ etiqueta: T.estados.reintentar, alPulsar: () => void tablero.refrescar() }} className={css.estadoGlobal} />
      );
  } else {
    const sinPedidos = d.kpis.pedidos === 0;
    cuerpo = (
      <div className={cambiando || tablero.refrescando ? css.refrescando : undefined}>
        <div className={css.bloques}>
          {pasoPedidos ? <FranjaTrayendo texto={textoTrayendo} /> : null}
          <Kpis tablero={d} comparar={comparar} compacto={compacto} />
          {sinPedidos ? (
            <EstadoVacio
              icono="ChartColumn"
              titulo={T.estados.sinPedidos}
              texto={T.estados.sinPedidosTexto}
              {...(periodo !== '90d' && periodo !== 'todo' && periodo !== '12m' ? { accion: { etiqueta: T.estados.ver90, alPulsar: () => cambiarPeriodo('90d') } } : {})}
              className={css.estadoGlobal}
            />
          ) : (
            <>
              <GraficaPrincipal
                puntos={puntos}
                granularidad={gran}
                {...(rango ? { desde: rango.desde } : {})}
                permitidas={permitidas}
                metrica={metrica}
                error={usaSerieTablero ? null : serie.error}
                compacto={compacto}
                alCambiarMetrica={setMetrica}
                alCambiarGranularidad={setGranManual}
                alReintentar={() => void serie.refrescar()}
              />
              <div className={css.filaDos}>
                <DondeDinero kpis={d.kpis} />
                <Dependencia tiendas={tiendas.datos?.items} total={d.kpis.comision_total_centavos} error={tiendas.error} alReintentar={() => void tiendas.refrescar()} />
              </div>
              <div className={css.filaDos}>
                <Reembolsos kpis={d.kpis} meses={meses} error={errorMeses} compacto={compacto} alReintentar={() => void serieMes.refrescar()} />
                <ProductosTop productos={productos.datos?.items} error={productos.error} alReintentar={() => void productos.refrescar()} />
              </div>
              <PorMes puntos={mesesBase} hoyHub={hoyHub} compacto={compacto} error={errorMeses} alReintentar={() => void serieMes.refrescar()} />
            </>
          )}
          <Pedidos
            respuesta={ordenes.datos}
            filas={filasPedidos}
            filtro={filtro}
            pagina={pagina}
            seleccionado={pedidoParam}
            compacto={compacto}
            tarjetas={tarjetasPedidos}
            panelDisponible={panelDisponible}
            refrescando={ordenes.refrescando}
            error={ordenes.error}
            alCambiarFiltro={cambiarFiltro}
            alCambiarPagina={(n) => {
              setPagina(n);
              setPedidoParam(null, { reemplazar: true });
            }}
            alSeleccionar={(id) => setPedidoParam(id, { reemplazar: true })}
            alReintentar={() => void ordenes.refrescar()}
          />
        </div>
      </div>
    );
  }

  return (
    <Pantalla titulo={T.titulo} lista={lista} className={css.pantalla}>
      <div className={css.ventas} data-compacto={compacto ? '' : undefined} data-android={plataforma === 'android' ? '' : undefined} ref={setRaiz}>
        {encabezado}
        <div className={css.contenido}>
          {controles}
          {cuerpo}
          {holgura > 0 ? <div className={css.holgura} style={{ height: holgura }} aria-hidden="true" data-holgura-capas="" /> : null}
        </div>
      </div>
    </Pantalla>
  );
}
