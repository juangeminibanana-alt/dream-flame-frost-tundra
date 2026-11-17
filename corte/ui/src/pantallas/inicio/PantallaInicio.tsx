/**
 * #/inicio · Inicio (01_ux §4.1; 02 §5.2 Windows y §5.3 celular). En 3 segundos: qué hago ahora, qué hay para hoy y
 * cómo va el dinero. Orden: saludo → «Vencen pronto» → «Promesas vencidas» → héroe «Ponte al día» (+ «Hoy» con plan) →
 * «Tu dinero» → tiendas que necesitan atención y video estrella → videos que más venden → avisos → tendencia → pie.
 * Cada bloque aparece solo si aplica y cada sección degrada sola (esqueleto, error o «Necesita tu PC encendida»).
 * rev. 5: antes de «Tus videos que más venden», el resumen discreto del perfil de TikTok (seguidores y likes) si la
 * Display API ya lo trajo; si no está conectada (solo Windows), una invitación sutil que se puede cerrar y no vuelve.
 */
import { useMemo, useState, type ReactElement } from 'react';
import { Pantalla, navegar, useClaseAncho, usePlataforma } from '@/app';
import { useConsulta, useListaEstable, useSesion, useSync } from '@/datos';
import { EstadoVacio, PanelFirma, Tarjeta } from '@/componentes';
import { ahoraS, contarTrabajo, hoyLocal, rangoDePeriodo } from '@/dominio';
import { Alertas } from './Alertas';
import { PromesasVencidas, TarjetaHoy, VencenPronto } from './Arriba';
import { useHolguraCapas } from './capas';
import { Dinero } from './Dinero';
import { CargaInicio, EsqueletoHeroe, LineaTrayendo } from './Estados';
import { Heroe } from './Heroe';
import {
  alertasVisibles, bloqueHoy, ESTADOS_POR_LIQUIDAR, estadoHeroe, fechaSaludo, haceCuanto, hayPlan, horaSinCorte, invitarMetricas, momentoSync, nombreDeVideo,
  noSePuedeEtiquetar, ordenProvisional, pedidosPorLiquidar, pendientesEnCola, pendientesPorTienda, primeraSincronizacion, promesasVencidas,
  rangoTendencia, respuestaPorLiquidar, semanaCoherente,
  tendenciaSemanal, tiendasAtencion, tiendasConPendientes, topVideos, vencenPronto, ventasEnCamino, videoEstrella, videosQueVendieron,
} from './logica';
import { InvitacionMetricas, PerfilTikTok } from './PerfilTikTok';
import { Saludo } from './Saludo';
import { Tendencia } from './Tendencia';
import { TiendasAtencion } from './Tiendas';
import { TopVideos, VideoEstrella } from './Videos';
import { T } from './textos';
import css from './Inicio.module.css';

export function PantallaInicio(): ReactElement {
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  // El acomodo sigue al ancho (C5/C41): un Android de 600 o más (tableta) usa la composición ancha con densidad
  // táctil, no la foto 1:1 a todo lo ancho (a 1280 medía más de 1,100 px de alto).
  const compacto = clase === 'compacta';
  // Espacio al final para que el pie suba por encima de la tarjeta fija «¿Le enviaste el mensaje…?» (capas.ts).
  const [raiz, setRaiz] = useState<HTMLDivElement | null>(null);
  const holgura = useHolguraCapas(raiz);

  const sesion = useSesion();
  const sync = useSync();
  const muestras = useConsulta('muestras', {});
  const avisos = useConsulta('avisos', {});
  const d30 = useConsulta('dashboard', { periodo: '30d' });
  const dTodo = useConsulta('dashboard', { periodo: 'todo' });
  const tiendas = useConsulta('tiendas', { orden: 'atencion' });
  // Los rangos salen de la fecha del hub (dashboard.periodo.hasta), no del reloj del equipo: así coinciden con lo que
  // el hub ya calculó (y con la copia del celular).
  const hasta = d30.datos?.periodo?.hasta ?? null;
  const rTendencia = hasta ? rangoTendencia(hasta) : null;
  const serie = useConsulta('serie', { granularidad: 'semana', desde: rTendencia?.desde ?? '', hasta: rTendencia?.hasta ?? '' }, { activa: rTendencia !== null });
  const r7 = hasta ? rangoDePeriodo('7d', hasta) : null;
  const videos7 = useConsulta('videos', r7 ? { desde: r7.desde, hasta: r7.hasta } : {}, { activa: r7 !== null });
  // KPI 4 «45 pedidos · el más antiguo del 3 mar» (01 §4.1): cuántos pedidos hay por liquidar (total de una página de
  // 1) y el más antiguo (la última de esas páginas). Si la respuesta no respetó el filtro, la nota queda genérica.
  const cuentaPorLiquidar = useConsulta('ordenes', { estado: [...ESTADOS_POR_LIQUIDAR], por_pagina: 1 }, { activa: dTodo.datos !== undefined });
  const totalPorLiquidar = respuestaPorLiquidar(cuentaPorLiquidar.datos)?.total ?? 0;
  const ultimoPorLiquidar = useConsulta('ordenes', { estado: [...ESTADOS_POR_LIQUIDAR], pagina: totalPorLiquidar, por_pagina: 1 }, { activa: totalPorLiquidar > 0 });
  const porLiquidar = useMemo(() => pedidosPorLiquidar(cuentaPorLiquidar.datos, ultimoPorLiquidar.datos), [cuentaPorLiquidar.datos, ultimoPorLiquidar.datos]);

  const ahora = ahoraS();
  const hoy = hoyLocal(ahora);
  const todas = useMemo(() => muestras.datos?.items ?? [], [muestras.datos]);
  const colaBruta = useMemo(() => pendientesEnCola(todas), [todas]);
  const estable = useListaEstable(muestras.datos ? colaBruta : undefined, (m) => m.application_id);
  const cola = estable.items;
  const listaAvisos = useMemo(() => avisos.datos?.items ?? [], [avisos.datos]);
  const conteos = useMemo(() => contarTrabajo(todas, listaAvisos, hoy), [todas, listaAvisos, hoy]);

  const estadoSync = sync.estado ?? sesion.datos?.sync ?? null;
  const ultimaOk = sesion.datos?.datos.ultima_sync_ok_at ?? null;
  const primera = primeraSincronizacion(estadoSync, ultimaOk);
  const provisional = ordenProvisional(estadoSync, ultimaOk);
  const enCamino = ventasEnCamino(estadoSync, ultimaOk);

  const heroe = useMemo(() => estadoHeroe(cola, todas, conteos, hoy), [cola, todas, conteos, hoy]);
  const conPlan = hayPlan(cola);
  const hoyBloque = conPlan ? bloqueHoy(cola, hoy) : null;
  const vencen = useMemo(() => vencenPronto(cola, ahora), [cola, ahora]);
  const promesas = useMemo(() => promesasVencidas(todas), [todas]);
  const noSePuede = useMemo(() => noSePuedeEtiquetar(cola), [cola]);
  const porTienda = useMemo(() => pendientesPorTienda(cola), [cola]);

  const tendencia = useMemo(() => (serie.datos && hasta ? tendenciaSemanal(serie.datos, hasta) : []), [serie.datos, hasta]);
  const productos = useMemo(() => [...(d30.datos?.top_productos ?? []), ...(dTodo.datos?.top_productos ?? [])], [d30.datos, dTodo.datos]);
  // Una semana que no cabe en los 30 días no se presenta (semanaCoherente): se queda en esqueleto hasta que llegue la buena.
  const semanaOk = !videos7.datos || semanaCoherente(videos7.datos.items, d30.datos);
  const estrella = videos7.datos && semanaOk ? videoEstrella(videos7.datos.items) : null;
  const vendieron = videos7.datos && semanaOk ? videosQueVendieron(videos7.datos.items) : 0;
  const top = useMemo(() => topVideos(d30.datos?.top_videos ?? []), [d30.datos]);
  const nombres = useMemo(() => {
    const m = new Map<string, string>();
    for (const v of [...top, ...(estrella ? [estrella] : [])]) m.set(v.content_id, nombreDeVideo(v, productos, todas));
    return m;
  }, [top, estrella, productos, todas]);

  // rev. 5 · Perfil de TikTok (Display API): resumen si ya se trajo; si no, en Windows, una invitación sutil a conectarlo.
  const perfil = d30.datos?.perfil_tiktok ?? dTodo.datos?.perfil_tiktok ?? null;
  const display = useConsulta('display', {}, { activa: !android && !perfil && d30.datos !== undefined });
  const invitar = invitarMetricas(android, perfil, display.datos?.estado ?? null, false);

  const usuario = sesion.datos?.cuenta?.username ?? null;
  // El paso de la sincronización ya lo muestra el indicador global de ui-marco (barra lateral o franja en el celular):
  // aquí la línea dice qué tan frescos son los datos que se ven; solo sin ninguna sincronización previa, «Sincronizando…».
  const frescura = ultimaOk !== null ? T.actualizado(haceCuanto(ultimaOk, ahora)) : estadoSync?.en_curso ? T.sincronizando : T.sinSincronizar;
  const origen = muestras.fuente === 'copia' && muestras.copia_at !== null ? T.copiaDel(momentoSync(muestras.copia_at, hoy)) : T.desdeTuPc;
  const conOrigen = android ? `${frescura} · ${origen}` : frescura;
  const contexto = horaSinCorte(compacto ? conOrigen : `${fechaSaludo(hoy)} · ${conOrigen}`);

  const saludo = (
    <Saludo
      usuario={usuario}
      contexto={contexto}
      compacto={compacto}
      sincronizando={!!estadoSync?.en_curso}
      puedeSincronizar={sync.puede}
      alSincronizar={() => void sync.sincronizar()}
    />
  );
  const lista = muestras.datos !== undefined || muestras.error !== null;

  // ---------------------------------------------------------------------------------------------- estados globales
  let contenido: ReactElement;
  if (!lista) {
    contenido = <CargaInicio compacto={compacto} />;
  } else if (muestras.error && !muestras.datos) {
    const e = muestras.error;
    contenido =
      e.codigo === 'necesita_pc' ? (
        <EstadoVacio
          icono="Smartphone"
          titulo={T.estados.sinDatosAndroidTitulo}
          texto={T.estados.sinDatosAndroidTexto}
          accion={{ etiqueta: T.estados.emparejar, alPulsar: () => navegar('/emparejar') }}
          className={css.estadoGlobal}
        />
      ) : (
        <EstadoVacio icono="CircleAlert" titulo={T.estados.errorTitulo} texto={e.mensaje} accion={{ etiqueta: T.estados.reintentar, alPulsar: () => void muestras.refrescar() }} className={css.estadoGlobal} />
      );
  } else if (sesion.datos?.datos.hay_datos === false && !estadoSync?.en_curso && todas.length === 0) {
    contenido = (
      <EstadoVacio
        icono="RefreshCw"
        titulo={T.estados.sinDatosTitulo}
        texto={T.estados.sinDatosTexto}
        {...(sync.puede ? { accion: { etiqueta: T.sincronizar, alPulsar: () => void sync.sincronizar() } } : {})}
        className={css.estadoGlobal}
      />
    );
  } else {
    let bloqueHeroe: ReactElement | null;
    if (todas.length === 0 && primera) {
      bloqueHeroe = (
        <PanelFirma className={css.heroe}>
          <EsqueletoHeroe compacto={compacto} />
        </PanelFirma>
      );
    } else if (heroe.tipo === 'nada') {
      bloqueHeroe = (
        <Tarjeta padding="amplio">
          <EstadoVacio icono="Package" titulo={T.estados.sinPendientesTitulo} texto={T.estados.sinPendientesTexto} className={css.vacioTarjeta} />
        </Tarjeta>
      );
    } else {
      bloqueHeroe = (
        <Heroe
          estado={heroe}
          conteos={conteos}
          cola={cola}
          noSePuede={noSePuede}
          conPlan={conPlan}
          compacto={compacto}
          provisional={provisional}
          ordenNuevo={{ hay: estable.hayOrdenNuevo, aplicar: estable.aplicarOrdenNuevo }}
        />
      );
    }
    const listaTiendas = tiendas.datos ? tiendasAtencion(tiendas.datos.items) : undefined;
    contenido = (
      <>
        {primera ? <LineaTrayendo /> : null}
        <VencenPronto filas={vencen} hoy={hoy} />
        <PromesasVencidas filas={promesas} />
        <div className={css.filaHeroe} data-con-hoy={hoyBloque && !compacto ? '' : undefined}>
          {bloqueHeroe}
          {hoyBloque ? <TarjetaHoy bloque={hoyBloque} /> : null}
        </div>
        <Dinero d30={d30.datos} dTodo={dTodo.datos} porLiquidar={porLiquidar} error={d30.error} enCamino={enCamino} tendencia={tendencia} compacto={compacto} alReintentar={() => void d30.refrescar()} />
        <div className={css.filaDos}>
          <TiendasAtencion
            tiendas={listaTiendas}
            cargando={primera && (listaTiendas?.length ?? 0) === 0}
            conPendientes={tiendas.datos ? tiendasConPendientes(tiendas.datos.items) : 0}
            porTienda={porTienda}
            error={tiendas.error}
            alReintentar={() => void tiendas.refrescar()}
          />
          <VideoEstrella
            video={estrella}
            nombre={estrella ? (nombres.get(estrella.content_id) ?? '') : ''}
            vendieron={vendieron}
            cargando={enCamino || !semanaOk || (!videos7.datos && !videos7.error && !d30.error)}
            error={videos7.datos ? null : (videos7.error ?? (d30.datos ? null : d30.error))}
            compacto={compacto}
            alReintentar={() => void videos7.refrescar()}
          />
        </div>
        {perfil ? <PerfilTikTok perfil={perfil} /> : invitar ? <InvitacionMetricas /> : null}
        {enCamino ? null : <TopVideos videos={top} nombres={nombres} compacto={compacto} />}
        {d30.datos ? <Alertas alertas={alertasVisibles(d30.datos.alertas)} /> : null}
        <Tendencia
          puntos={tendencia}
          cargando={enCamino || (!serie.datos && !serie.error && !d30.error)}
          error={serie.datos ? null : (serie.error ?? (d30.datos ? null : d30.error))}
          compacto={compacto}
          alReintentar={() => void serie.refrescar()}
        />
        {ultimaOk !== null ? <p className={css.pie}>{horaSinCorte(T.pie(momentoSync(ultimaOk, hoy)))}</p> : null}
      </>
    );
  }

  return (
    <Pantalla titulo={T.pantalla} lista={lista} className={css.pantalla}>
      <div className={css.inicio} data-compacto={compacto ? '' : undefined} data-android={android ? '' : undefined} ref={setRaiz}>
        {saludo}
        <div className={css.contenido}>
          {compacto ? <p className={css.holaCompacto}>{usuario ? T.saludo(usuario) : T.saludoSinCuenta}</p> : null}
          {contenido}
          {holgura > 0 ? <div className={css.holgura} style={{ height: holgura }} aria-hidden="true" data-holgura-capas="" /> : null}
        </div>
      </div>
    </Pantalla>
  );
}
