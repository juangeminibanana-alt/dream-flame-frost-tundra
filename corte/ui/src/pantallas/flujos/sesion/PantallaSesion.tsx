/**
 * #/muestras/sesion · Sesión de videos, modo enfoque (01 §4.6). Una muestra por pantalla con su foto grande
 * (TarjetaMuestra 'sesion': Guardar imagen y Copiar datos para tu guion), progreso «2 de 3» con puntos, notas
 * editables, la lista «Antes de publicar» y [Video listo] (principal) · [Saltar] · [Abrir en la app de TikTok].
 * Toma las planeadas para hoy; si no hay: «¿Hacemos las {3} siguientes de tu cola?». En Android la pantalla no se
 * apaga (mantenerPantalla) y Video listo vibra; todo funciona sin conexión (las acciones van a la cola del celular).
 * Escritorio: Enter = Video listo · → = Saltar · I = Guardar imagen · C = Copiar datos.
 */
import { useEffect, useMemo, useReducer, useRef, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, Pantalla, useAtajos, useClaseAncho, usePlataforma } from '@/app';
import { ListaNotas, TarjetaMuestra, useControlMuestra } from '@/bloques';
import { Boton, EncabezadoPantalla, EstadoVacio, Foto, Icono, Kbd, Palomita, TarjetaProducto, useToast } from '@/componentes';
import { formato, hoyLocal, textoDatosGuion } from '@/dominio';
import { abrirExterno, abrirTikTok, copiarTexto, guardarImagen, mantenerPantalla, vibrar } from '@/plataforma';
import { BarraFija, ReservaCapas } from '../BarraFija';
import { useDatosTrabajo } from '../datos';
import { ErrorFlujo, EsqueletoFlujo } from '../Estados';
import { useFocoAlMontar } from '../foco';
import { T } from '../textos';
import { cx, nombreDe } from '../util';
import comun from '../flujos.module.css';
import { planeadasParaHoy, progresoSesion, reducirSesion, SESION_VACIA, sesionTerminada, siguientesDeCola } from './logica';
import css from './Sesion.module.css';

/** Enter/C/I solo si el foco no está en un control (un botón ya hace lo suyo con Enter). */
function focoLibre(): boolean {
  const a = typeof document === 'undefined' ? null : document.activeElement;
  return !(a instanceof HTMLElement) || a === document.body || a.closest('button, a, input, select, textarea, [role="menu"], [role="dialog"]') === null;
}

export function PantallaSesion(): ReactElement {
  const datos = useDatosTrabajo();
  const control = useControlMuestra();
  const toast = useToast();
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  // Composición por ancho (una tableta Android usa la de escritorio); lo nativo y el teclado, por plataforma.
  const movil = clase === 'compacta';
  const [e, despachar] = useReducer(reducirSesion, SESION_VACIA);
  const hoy = hoyLocal();

  const paraHoy = useMemo(() => planeadasParaHoy(datos.pendientes, hoy), [datos.pendientes, hoy]);
  const siguientes = useMemo(() => siguientesDeCola(datos.pendientes, datos.ritmo.capacidad, hoy), [datos.pendientes, datos.ritmo.capacidad, hoy]);

  // Con planeadas para hoy, la sesión empieza sola la primera vez que llegan los datos.
  const autoInicio = useRef(false);
  useEffect(() => {
    if (autoInicio.current || !datos.listo) return;
    autoInicio.current = true;
    if (paraHoy.length > 0) despachar({ tipo: 'empezar', ids: paraHoy.map((m) => m.application_id) });
  }, [datos.listo, paraHoy]);

  // En Android la pantalla no se apaga durante la sesión (01 §4.6 Detalles).
  useEffect(() => {
    mantenerPantalla(true);
    return () => mantenerPantalla(false);
  }, []);

  const porId = useMemo(() => new Map(datos.items.map((m) => [m.application_id, m] as const)), [datos.items]);
  const actualId = e.ids[e.indice] ?? null;
  const actual = actualId ? (porId.get(actualId) ?? null) : null;
  const terminada = sesionTerminada(e);
  const progreso = progresoSesion(e);

  // «Deshacer» del aviso de Video listo: si una que ya se vio como «video listo» vuelve atrás, la sesión regresa a ella.
  const vistosListos = useRef(new Set<string>());
  useEffect(() => {
    for (const id of e.listos) {
      const m = porId.get(id);
      if (!m) continue;
      if (m.avance.etapa === 'video_listo' || m.avance.etapa === 'programada' || m.avance.etapa === 'publicada') vistosListos.current.add(id);
      else if (vistosListos.current.has(id) && (m.avance.etapa === 'planeada' || m.avance.etapa === 'por_planear')) {
        vistosListos.current.delete(id);
        despachar({ tipo: 'deshacerListo', id });
      }
    }
  }, [e.listos, porId]);

  // Una muestra que ya no viene en los datos (se sincronizó y cambió de grupo) se salta sola.
  useEffect(() => {
    if (datos.listo && actualId !== null && !porId.has(actualId)) despachar({ tipo: 'saltar', id: actualId });
  }, [datos.listo, actualId, porId]);

  const videoListo = async (m: C.MuestraVista): Promise<void> => {
    vibrar('confirmar');
    despachar({ tipo: 'listo', id: m.application_id });
    await control.cambiarEtapa(m, 'video_listo');
  };

  const guardar = async (m: C.MuestraVista): Promise<void> => {
    if (!m.producto.imagen) {
      toast.mostrar({ texto: T.sinImagen, tono: 'info' });
      return;
    }
    const r = await guardarImagen(m.producto.imagen, nombreDe(m.producto));
    if (r === 'guardado') toast.mostrar({ texto: T.imagenGuardada, tono: 'ok' });
    else if (r === 'compartido') toast.mostrar({ texto: T.imagenCompartida, tono: 'ok' });
    else if (r === 'error') toast.mostrar({ texto: T.imagenError, tono: 'error' });
  };

  const copiarDatos = async (m: C.MuestraVista): Promise<void> => {
    const ok = await copiarTexto(textoDatosGuion(m));
    toast.mostrar(ok ? { texto: T.datosCopiados, detalle: T.datosCopiadosDetalle, tono: 'ok' } : { texto: T.noSeCopio, tono: 'error' });
  };

  const abrirFuera = (m: C.MuestraVista): void => {
    const enlace = m.producto.enlace ?? undefined;
    if (android) void abrirTikTok(enlace);
    else if (enlace) void abrirExterno(enlace);
  };

  const enCurso = actual !== null && !terminada;
  useAtajos(
    [
      { teclas: 'Enter', descripcion: T.videoListo, accion: () => actual && void videoListo(actual), cuando: () => enCurso && focoLibre() },
      { teclas: 'ArrowRight', descripcion: T.saltar, accion: () => actual && despachar({ tipo: 'saltar', id: actual.application_id }), cuando: () => enCurso && focoLibre() },
      { teclas: 'i', descripcion: T.atajoGuardarLargo, accion: () => actual && void guardar(actual), cuando: () => enCurso },
      { teclas: 'c', descripcion: T.atajoCopiarLargo, accion: () => actual && void copiarDatos(actual), cuando: () => enCurso },
    ],
    !android,
  );

  const encabezado = (
    <EncabezadoPantalla
      titulo={T.sesionTitulo}
      contexto={T.sesionContexto(formato.fechaConDia(hoy))}
      {...(!movil || android ? { volver: { a: '/muestras', etiqueta: T.muestras } } : {})}
      {...(enCurso && !movil && !android ? { acciones: <Progreso puntos={progreso.puntos} actual={progreso.actual} total={progreso.total} listos={e.listos.length} /> } : {})}
    />
  );

  let cuerpo: ReactElement;
  if (!datos.listo) {
    cuerpo = datos.error ? <ErrorFlujo error={datos.error} titulo={T.sesionError} alReintentar={datos.refrescar} /> : <EsqueletoFlujo filas={2} conFoto />;
  } else if (terminada) {
    cuerpo = (
      <CierreSesion
        listos={e.listos.length}
        fotos={e.listos.map((id) => porId.get(id)).filter((m): m is C.MuestraVista => m !== undefined)}
        saltadas={e.saltadas.length}
        alVolverASaltadas={() => despachar({ tipo: 'volverASaltadas' })}
      />
    );
  } else if (e.ids.length === 0) {
    // Nada planeado para hoy: se ofrecen las siguientes de la cola (01 §4.6 Entrada).
    cuerpo = siguientes.length > 0 ? (
      <section className={cx(css.entrada)} aria-labelledby="flujos-sesion-entrada">
        <div className={cx(css.entradaTextos)}>
          <span className={cx(css.entradaIcono)} aria-hidden="true">
            <Icono nombre="Clapperboard" tamano={24} />
          </span>
          <h2 id="flujos-sesion-entrada" className={cx(css.entradaTitulo)}>
            {siguientes.length === 1 ? T.nadaHoyUna : T.nadaHoy(siguientes.length)}
          </h2>
        </div>
        <ul className={cx(css.entradaLista, movil && css.entradaListaMovil)}>
          {siguientes.map((m, i) => (
            <li key={m.application_id}>
              {movil ? (
                // Celular: renglones con foto de 48 (como la Agenda) para que «Sí, empezar» quede en el primer pliegue.
                <TarjetaMuestra muestra={m} variante="agenda" alAbrir={() => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)} />
              ) : (
                <TarjetaProducto
                  imagen={m.producto.imagen}
                  nombre={nombreDe(m.producto)}
                  tienda={m.tienda.nombre}
                  categoria={m.producto.categoria}
                  ranking={i + 1}
                  cifraPrincipal={formato.rangoDinero(m.producto.precio_venta_min_centavos, m.producto.precio_venta_max_centavos, { aprox: true })}
                  {...(m.variante ? { cifraSecundaria: m.variante } : {})}
                  alPulsar={() => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)}
                />
              )}
            </li>
          ))}
        </ul>
        {movil ? (
          // Celular: «Planear primero» va en el contenido, justo arriba de la barra; así la barra fija es un solo renglón
          // («Sí, empezar») y cabe apilada encima de la tarjeta global sin tapar la lista.
          <button type="button" className={cx(comun.enlace, css.planearMovil)} onClick={() => navegar('/muestras/plan')}>
            <Icono nombre="CalendarDays" tamano={16} /> {T.planearPrimero}
          </button>
        ) : null}
        {/* Botón inferior fijo, como el de la sesión en curso: «Sí, empezar» queda a un toque aunque la lista no quepa o la
            tarjeta global esté abierta (se apila encima de ella). En escritorio se funde con la tarjeta de la entrada. */}
        <BarraFija etiqueta={T.sesionTitulo} className={movil ? cx(css.entradaBarraMovil, comun.repisa) : cx(css.entradaBarraAncha)}>
          {movil ? null : (
            <Boton variante="secundario" tamano="lg" icono="CalendarDays" alPulsar={() => navegar('/muestras/plan')}>
              {T.planearPrimero}
            </Boton>
          )}
          <Boton variante="primario" tamano="lg" icono="Play" alPulsar={() => despachar({ tipo: 'empezar', ids: siguientes.map((m) => m.application_id) })}>
            {T.siEmpezar}
          </Boton>
        </BarraFija>
      </section>
    ) : (
      <div className={cx(comun.estadoCentro)}>
        <EstadoVacio icono="CircleCheckBig" titulo={T.nadaEnCola} texto={T.nadaEnColaTexto} accion={{ etiqueta: T.volverMuestras, alPulsar: () => navegar('/muestras') }} />
      </div>
    );
  } else if (actual === null) {
    // La muestra ya no está en los datos (p. ej. se sincronizó y cambió de grupo): se salta sola.
    cuerpo = <EsqueletoFlujo filas={1} conFoto />;
  } else {
    const m = actual;
    const yaListo = e.listos.includes(m.application_id);
    cuerpo = (
      <div className={cx(css.sesion)} key={m.application_id}>
        <TarjetaMuestra muestra={m} variante="sesion" className={cx(css.tarjeta)} />

        <div className={cx(css.extras)}>
          <section className={cx(css.antes)} aria-labelledby="flujos-sesion-antes">
            <h3 id="flujos-sesion-antes" className={cx(css.extrasTitulo)}>
              {T.antesDePublicar}
            </h3>
            <ol className={cx(css.antesLista)}>
              <li className={cx(css.antesPaso, m.producto.en_vitrina === true && css.antesHecho)}>
                <span className={cx(css.antesNumero)} aria-hidden="true">
                  {m.producto.en_vitrina === true ? <Icono nombre="Check" tamano={14} /> : 1}
                </span>
                {m.producto.en_vitrina === true ? T.pasoVitrinaYaEsta : T.pasoVitrina}
              </li>
              <li className={cx(css.antesPaso)}>
                <span className={cx(css.antesNumero)} aria-hidden="true">
                  2
                </span>
                {T.pasoEtiqueta}
              </li>
              <li className={cx(css.antesPaso)}>
                <span className={cx(css.antesNumero)} aria-hidden="true">
                  3
                </span>
                {T.pasoEnlace}
              </li>
            </ol>
            {m.producto.enlace ? (
              <button type="button" className={cx(comun.enlace, css.verDescripcion)} onClick={() => void abrirExterno(m.producto.enlace ?? '')}>
                <Icono nombre="ExternalLink" tamano={16} /> {T.verDescripcion}
              </button>
            ) : null}
          </section>
          <ListaNotas entidad="muestra" entidadId={m.application_id} titulo={T.tusNotas} className={cx(css.notas)} />
        </div>
        {android ? null : (
          <p className={cx(css.notaArrastre)}>
            <Icono nombre="Image" tamano={16} /> {T.notaArrastre}
          </p>
        )}

        {!movil && !android ? (
          <p className={cx(css.atajos)} aria-hidden="true">
            <Kbd>Enter</Kbd> {T.videoListo} · <Kbd>→</Kbd> {T.saltar} · <Kbd>I</Kbd> {T.atajoGuardar} · <Kbd>C</Kbd> {T.atajoCopiar}
          </p>
        ) : null}
        {movil ? (
          // Celular: el enlace va en el contenido, justo arriba de la barra; así la barra fija es un solo renglón
          // («Saltar» · «Video listo») y cabe apilada encima de la tarjeta global sin tapar la foto.
          <button type="button" className={cx(comun.enlace, css.abrirMovil)} onClick={() => abrirFuera(m)}>
            <Icono nombre="ExternalLink" tamano={16} /> {android ? T.abrirAppTikTok : T.abrirTikTokShop}
          </button>
        ) : null}

        <BarraFija etiqueta={T.sesionTitulo} className={cx(css.barra, comun.repisa)}>
          {movil ? null : (
            <Boton variante="secundario" tamano="lg" icono="ExternalLink" deshabilitado={!android && !m.producto.enlace} alPulsar={() => abrirFuera(m)}>
              {android ? T.abrirAppTikTok : T.abrirTikTokShop}
            </Boton>
          )}
          {/* Celular: sin espaciador, «Saltar» y «Video listo» llenan el renglón (el principal se estira). */}
          {movil ? null : <span className={cx(comun.barraFijaEspacio)} aria-hidden="true" />}
          <Boton variante="secundario" tamano="lg" iconoFinal="ArrowRight" alPulsar={() => despachar({ tipo: 'saltar', id: m.application_id })}>
            {T.saltar}
          </Boton>
          <Boton variante="primario" tamano="lg" icono="Clapperboard" deshabilitado={yaListo} atajo="Enter" alPulsar={() => void videoListo(m)} className={cx(movil && css.principalMovil)}>
            {T.videoListo}
          </Boton>
        </BarraFija>
      </div>
    );
  }

  return (
    <Pantalla titulo={T.sesionTitulo} lista={datos.listo} className={cx(comun.pantalla, css.pantalla, datos.refrescando && comun.refrescando)}>
      {encabezado}
      {enCurso && (movil || android) ? <Progreso puntos={progreso.puntos} actual={progreso.actual} total={progreso.total} listos={e.listos.length} enLinea /> : null}
      {cuerpo}
      <ReservaCapas />
    </Pantalla>
  );
}

/** Cierre (01 §4.6): «¡Sesión terminada! Tienes {3} videos listos.» [Ver videos listos para publicar] [Volver a Inicio]. */
function CierreSesion(p: { listos: number; fotos: C.MuestraVista[]; saltadas: number; alVolverASaltadas: () => void }): ReactElement {
  const titulo = useFocoAlMontar<HTMLHeadingElement>();
  return (
    <section className={cx(css.cierre)} aria-labelledby="flujos-sesion-cierre">
      {p.fotos.length > 0 ? (
        // Los videos que quedaron listos, con su palomita: la foto del producto es la protagonista del cierre.
        <ul className={cx(css.cierreFotos)} aria-label={T.videosListosSesion}>
          {p.fotos.slice(0, 5).map((m) => (
            <li key={m.application_id} className={cx(css.cierreFoto)}>
              <Foto url={m.producto.imagen} alt={`${nombreDe(m.producto)}, ${m.tienda.nombre}`} anchoCss={88} proporcion="1:1" radio="md" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
              <span className={cx(css.cierreSello)} aria-hidden="true">
                <Icono nombre="Check" tamano={14} />
              </span>
            </li>
          ))}
          {p.fotos.length > 5 ? <li className={cx(css.cierreFoto, css.cierreMas)}>{`+${formato.numero(p.fotos.length - 5)}`}</li> : null}
        </ul>
      ) : (
        <Palomita tamano={56} />
      )}
      <h2 id="flujos-sesion-cierre" ref={titulo} tabIndex={-1} className={cx(css.cierreTitulo)}>
        {T.sesionTerminada}
      </h2>
      <p className={cx(css.cierreTexto)}>
        {T.sesionTerminadaListos(p.listos)} {p.listos > 0 ? T.sesionTerminadaTexto : ''}
      </p>
      <div className={cx(css.cierreAcciones)}>
        {p.saltadas > 0 ? (
          <Boton variante="secundario" tamano="lg" icono="RotateCcw" alPulsar={p.alVolverASaltadas}>
            {T.hacerSaltadas(p.saltadas)}
          </Boton>
        ) : null}
        {p.listos > 0 ? (
          <Boton variante="primario" tamano="lg" icono="Clapperboard" alPulsar={() => navegar('/muestras')}>
            {T.verListos}
          </Boton>
        ) : null}
        <Boton variante={p.listos > 0 ? 'secundario' : 'primario'} tamano="lg" alPulsar={() => navegar('/inicio')}>
          {T.volverInicio}
        </Boton>
      </div>
    </section>
  );
}

/** «2 de 3» con puntos: lima = listo, anillo = actual, ámbar tenue = saltada. */
function Progreso(p: { puntos: Array<'listo' | 'actual' | 'saltada' | 'pendiente'>; actual: number; total: number; listos: number; enLinea?: boolean }): ReactElement {
  return (
    <div className={cx(css.progreso, p.enLinea && css.progresoLinea)} role="status" aria-label={T.progresoSesionAria(p.actual, p.total, p.listos)}>
      <span className={cx(css.progresoTexto)} aria-hidden="true">
        {T.progresoSesion(p.actual, p.total)}
      </span>
      <span className={cx(css.puntos)} aria-hidden="true">
        {p.puntos.map((estado, i) => (
          <span key={i} className={cx(css.punto)} data-estado={estado} />
        ))}
      </span>
    </div>
  );
}
