/**
 * #/muestras/avisos · Avisar a mis tiendas, modo enfoque (01 §4.17). Una tienda por pantalla en el orden de
 * dominio.ordenTiendasAvisar, con el mensaje ya armado (EditorMensaje de @/bloques en modo 'avisar': plantilla elegida
 * sola, fechas del plan, agradecimiento de socio) y 2 toques por tienda: Android [Copiar y abrir TikTok] (copia,
 * guarda «copiado, sin confirmar» y abre la app de TikTok) → [Sí, siguiente]; Windows [Copiar mensaje] → [Sí,
 * siguiente]. Ninguna tienda queda avisada sin esa confirmación. Progreso «{5} de {30} tiendas avisadas»; al reabrir
 * continúa en la primera por avisar. Sin conexión funciona completo en el celular con la copia (los avisos viajan a la
 * PC al reconectar; el aviso «Sin conexión con tu PC…» es el banner global de ui-marco, no se repite aquí). Escritorio: lista de tiendas a la izquierda (✓ avisadas) y la tienda actual a la derecha;
 * Enter = Copiar · S = Sí, siguiente · → = Saltar.
 */
import { useEffect, useMemo, useReducer, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, Pantalla, useAtajos, useClaseAncho, usePlataforma, usePrimeraVez } from '@/app';
import { ChipSalud, EditorMensaje, TarjetaMuestra } from '@/bloques';
import { AvatarTienda, BarraProgreso, Boton, EncabezadoPantalla, EstadoVacio, Foto, Icono, Palomita, Ticket } from '@/componentes';
import { useConsulta } from '@/datos';
import { contarTrabajo, formato, hoyLocal } from '@/dominio';
import { ReservaCapas } from '../BarraFija';
import { useDatosTrabajo } from '../datos';
import { Aviso, ErrorFlujo, EsqueletoFlujo } from '../Estados';
import { useFocoAlMontar } from '../foco';
import { T } from '../textos';
import { cx, nombreDe } from '../util';
import comun from '../flujos.module.css';
import { armarRecorrido, AVISAR_VACIO, pendientesPorTienda, posicionEnRecorrido, reducirAvisar, sinPlan, tiendaAvisada, tiendasPrevias } from './logica';
import css from './Avisar.module.css';

/** Textos fijos de los botones del editor (01 §4.8/§4.17) para los atajos de teclado del escritorio. */
const BOTON_COPIAR = 'Copiar mensaje';
const BOTON_SI_SIGUIENTE = 'Sí, siguiente';

function pulsarBoton(raiz: HTMLElement | null, texto: string): boolean {
  const boton = raiz ? [...raiz.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent?.trim() === texto && !b.disabled) : undefined;
  if (!boton) return false;
  boton.click();
  return true;
}

function focoLibre(): boolean {
  const a = typeof document === 'undefined' ? null : document.activeElement;
  return !(a instanceof HTMLElement) || a === document.body || a.closest('button, a, input, select, textarea, [role="menu"], [role="dialog"], [role="radio"]') === null;
}

export function PantallaAvisar(): ReactElement {
  const datos = useDatosTrabajo();
  const tiendas = useConsulta('tiendas', {});
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  // Composición por ancho: en una tableta Android caben las dos columnas de escritorio; lo nativo, por plataforma.
  const movil = clase === 'compacta';
  const [mostrarNotaPc, marcarNotaPc] = usePrimeraVez('avisar-nota-pc');
  const [introSinPlan, setIntroSinPlan] = useState(true);
  const [e, despachar] = useReducer(reducirAvisar, AVISAR_VACIO);
  const editor = useRef<HTMLDivElement>(null);
  const hoy = hoyLocal();

  const porTienda = useMemo(() => pendientesPorTienda(datos.pendientes), [datos.pendientes]);
  const filas = useMemo(() => new Map((tiendas.datos?.items ?? []).map((t) => [t.tienda_key, t] as const)), [tiendas.datos]);
  const avisadas = useMemo(() => {
    const previas = new Set(e.previas);
    return e.recorrido.filter((k) => previas.has(k) || tiendaAvisada(porTienda.get(k)));
  }, [e.recorrido, e.previas, porTienda]);
  const conteo = useMemo(() => contarTrabajo(datos.pendientes, datos.avisos, hoy), [datos.pendientes, datos.avisos, hoy]);
  const listo = datos.listo && tiendas.datos !== undefined;

  // El recorrido se congela al abrir y continúa en la primera tienda por avisar (01 §4.17 «Al reabrir»).
  useEffect(() => {
    if (!listo || e.iniciado) return;
    const filasTiendas = tiendas.datos?.items ?? [];
    const recorrido = armarRecorrido(filasTiendas, datos.pendientes, datos.avisos, hoy);
    const previas = tiendasPrevias(filasTiendas, datos.pendientes, recorrido, hoy);
    despachar({ tipo: 'iniciar', recorrido, previas, avisadas: recorrido.filter((k) => tiendaAvisada(porTienda.get(k))) });
  }, [listo, e.iniciado, tiendas.datos, datos.pendientes, datos.avisos, hoy, porTienda]);

  // Si la tienda actual queda avisada por otra vía (la tarjeta fija «¿Le enviaste el mensaje…?»), pasa a la siguiente.
  const actual = e.actual;
  const actualAvisada = actual !== null && avisadas.includes(actual);
  useEffect(() => {
    if (actual !== null && actualAvisada) despachar({ tipo: 'avisada', tienda: actual, avisadas });
  }, [actual, actualAvisada, avisadas]);

  const saltar = (): void => {
    if (actual) despachar({ tipo: 'saltar', tienda: actual, avisadas });
  };

  useAtajos(
    [
      { teclas: 'Enter', descripcion: BOTON_COPIAR, accion: () => void pulsarBoton(editor.current, BOTON_COPIAR), cuando: () => actual !== null && focoLibre() },
      { teclas: 's', descripcion: BOTON_SI_SIGUIENTE, accion: () => void pulsarBoton(editor.current, BOTON_SI_SIGUIENTE), cuando: () => actual !== null },
      { teclas: 'ArrowRight', descripcion: T.saltarTienda, accion: saltar, cuando: () => actual !== null && focoLibre() },
    ],
    !android,
  );

  const total = conteo.tiendas_con_pendientes;
  const nAvisadas = conteo.tiendas_avisadas;
  const progreso = total > 0 ? nAvisadas / total : 1;

  const encabezado = (
    <EncabezadoPantalla
      titulo={T.avisarTitulo}
      // En el celular se omite la línea de contexto: «Tienda 1 de 10» justo abajo ya dice qué es, y el mensaje sube.
      {...(movil ? {} : { contexto: T.avisarContexto })}
      {...(!movil || android ? { volver: { a: '/muestras', etiqueta: T.muestras } } : {})}
      // En Android el encabezado lleva la flecha de regreso y no deja lugar a la derecha: «Tienda 1 de 10» va en la fila del progreso.
      {...(listo && actual !== null && !movil && !android ? { acciones: <span className={cx(css.posicion)}>{T.tiendaDe(posicionEnRecorrido(e), e.recorrido.length)}</span> } : {})}
    />
  );

  let cuerpo: ReactElement;
  if (!listo) {
    const error = datos.error ?? (tiendas.datos === undefined ? tiendas.error : null);
    cuerpo = error ? <ErrorFlujo error={error} titulo={T.avisarError} alReintentar={() => { datos.refrescar(); void tiendas.refrescar(); }} /> : <EsqueletoFlujo filas={3} />;
  } else if (e.iniciado && e.recorrido.length === 0) {
    cuerpo = (
      <div className={cx(comun.estadoCentro)}>
        <EstadoVacio icono="CircleCheckBig" titulo={T.avisadasTodasTitulo} texto={T.avisadasTodasTexto} accion={{ etiqueta: T.volverInicio, alPulsar: () => navegar('/inicio') }} />
      </div>
    );
  } else if (e.iniciado && actual === null) {
    cuerpo = (
      <Cierre
        avisadas={nAvisadas}
        total={total}
        saltadas={e.saltadas.filter((k) => !avisadas.includes(k)).length}
        alVolverASaltadas={() => despachar({ tipo: 'volverASaltadas', avisadas })}
      />
    );
  } else if (!e.iniciado || actual === null) {
    cuerpo = <EsqueletoFlujo filas={3} />;
  } else if (introSinPlan && sinPlan(datos.pendientes)) {
    const intro = (
      <section className={cx(css.intro)} aria-labelledby="flujos-avisar-intro">
        <span className={cx(css.introIcono)} aria-hidden="true">
          <Icono nombre="CalendarDays" tamano={24} />
        </span>
        <h2 id="flujos-avisar-intro" className={cx(css.introTitulo)}>
          {T.sinPlanTitulo}
        </h2>
        <p className={cx(css.introTexto)}>{T.sinPlanTexto}</p>
        <div className={cx(css.introAcciones)}>
          <Boton variante="primario" tamano="lg" icono="CalendarDays" alPulsar={() => navegar('/muestras/plan')}>
            {T.armarPlanUnMinuto}
          </Boton>
          <Boton variante="secundario" tamano="lg" alPulsar={() => setIntroSinPlan(false)}>
            {T.elegirFechasMano}
          </Boton>
        </div>
        <ul className={cx(css.introTiendas)} aria-label={T.primerasTiendas}>
          {e.recorrido.slice(0, 5).map((k) => {
            const pend = porTienda.get(k) ?? [];
            const m = pend[0];
            const nombre = filas.get(k)?.nombre ?? m?.tienda.nombre ?? k;
            return (
              <li key={k} className={cx(css.introTienda)}>
                {m ? <Foto url={m.producto.imagen} alt="" anchoCss={120} proporcion="1:1" radio="md" tienda={nombre} categoria={m.producto.categoria} /> : null}
                <span className={cx(css.introTiendaNombre)}>
                  <AvatarTienda nombre={nombre} tamano={16} />
                  <span className={cx(css.introTiendaTexto)}>{nombre}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    );
    cuerpo = movil ? (
      intro
    ) : (
      <div className={cx(css.dosColumnas)}>
        <ListaTiendas recorrido={e.recorrido} actual={actual} avisadas={avisadas} saltadas={e.saltadas} filas={filas} porTienda={porTienda} alElegir={(k) => { setIntroSinPlan(false); despachar({ tipo: 'elegir', tienda: k }); }} />
        {intro}
      </div>
    );
  } else {
    const fila = filas.get(actual);
    const pend = porTienda.get(actual) ?? [];
    const nombre = fila?.nombre ?? pend[0]?.tienda.nombre ?? actual;
    const esSocio = fila?.es_socio ?? pend[0]?.tienda.es_socio ?? false;
    const vencida = pend.some((m) => m.avisos.promesa_vencida);
    // «Socio · 40 % de tu comisión en 90 días» → la segunda parte (el «Socio» ya va con su estrella).
    const porque = fila?.salud_porque && fila.salud_porque.includes('·') ? fila.salud_porque.split('·').slice(1).join('·').trim() : null;
    const tienda = (
      <section className={cx(css.tienda)} aria-label={nombre} data-tienda={actual} key={actual}>
        <header className={cx(css.tiendaCabeza)}>
          <AvatarTienda nombre={nombre} tamano={movil ? 40 : 56} />
          <div className={cx(css.tiendaTextos)}>
            <h2 className={cx(css.tiendaNombre)}>{nombre}</h2>
            <p className={cx(css.tiendaMeta)}>
              {esSocio ? (
                <span className={cx(css.socio)}>
                  <Icono nombre="Star" tamano={14} /> {T.socio}
                </span>
              ) : null}
              <span>{T.muestrasSinVideo(pend.length)}</span>
            </p>
            {porque && !movil ? <p className={cx(css.porque)}>{porque}</p> : null}
          </div>
          {fila && !movil ? <ChipSalud salud={fila.salud} esSocio={esSocio} className={cx(css.chipSalud)} /> : null}
          {movil ? (
            // Celular (01 §4.17: «[img][img]»): las fotos de sus muestras, encimadas a la derecha del nombre, para que el
            // mensaje y «Copiar y abrir TikTok» suban al primer pliegue.
            <ul className={cx(css.fotosTienda)} aria-label={T.muestrasDeTienda}>
              {pend.slice(0, 3).map((m) => (
                <li key={m.application_id} className={cx(css.fotoTienda)}>
                  <Foto url={m.producto.imagen} alt={`${nombreDe(m.producto)}${m.variante ? ` (${m.variante})` : ''}`} anchoCss={48} proporcion="1:1" radio="sm" tienda={nombre} categoria={m.producto.categoria} />
                </li>
              ))}
              {pend.length > 3 ? <li className={cx(css.fotoTienda, css.fotoMas)}>{`+${formato.numero(pend.length - 3)}`}</li> : null}
            </ul>
          ) : null}
        </header>
        {vencida ? (
          <Aviso tono="critico" icono="CalendarClock">
            {T.promesaVencida}
          </Aviso>
        ) : null}
        {movil ? null : (
          <ul className={cx(css.muestras)} aria-label={T.muestrasDeTienda}>
            {pend.map((m) => (
              <li key={m.application_id}>
                <TarjetaMuestra muestra={m} variante="aviso" />
              </li>
            ))}
          </ul>
        )}
        <div ref={editor} className={cx(css.editor)}>
          <EditorMensaje
            key={`${actual}:${pend.map((m) => m.application_id).join(',')}`}
            tiendaKey={actual}
            solicitudes={pend.map((m) => m.application_id)}
            modo="avisar"
            alRegistrar={() => despachar({ tipo: 'avisada', tienda: actual, avisadas })}
          />
        </div>
        <div className={cx(css.otras)}>
          <Boton variante="fantasma" iconoFinal="ArrowRight" alPulsar={saltar}>
            {T.saltarTienda}
          </Boton>
          <Boton variante="fantasma" alPulsar={() => navegar('/inicio')}>
            {T.despuesAvisar}
          </Boton>
        </div>
      </section>
    );
    cuerpo = movil ? (
      tienda
    ) : (
      <div className={cx(css.dosColumnas)}>
        <ListaTiendas recorrido={e.recorrido} actual={actual} avisadas={avisadas} saltadas={e.saltadas} filas={filas} porTienda={porTienda} alElegir={(k) => despachar({ tipo: 'elegir', tienda: k })} />
        {tienda}
      </div>
    );
  }

  return (
    <Pantalla titulo={T.avisarTitulo} lista={listo} className={cx(comun.pantalla, css.pantalla, datos.refrescando && comun.refrescando)}>
      {encabezado}
      {listo && total > 0 && e.recorrido.length > 0 ? (
        <div className={cx(css.progreso)}>
          <div className={cx(css.progresoFila)}>
            {(movil || android) && actual !== null ? <span className={cx(css.posicionMovil)}>{T.tiendaDe(posicionEnRecorrido(e), e.recorrido.length)}</span> : null}
            <span className={cx(css.progresoTexto)} aria-live="polite">
              {T.avisadasDe(nAvisadas, total)}
            </span>
          </div>
          <BarraProgreso valor={progreso} etiqueta={T.avisadasDe(nAvisadas, total)} className={cx(css.barra)} />
        </div>
      ) : null}
      {!android && listo && actual !== null && mostrarNotaPc ? (
        <Aviso tono="info" icono="Smartphone" acciones={<Boton variante="secundario" tamano="sm" alPulsar={marcarNotaPc}>{T.seguirEnPc}</Boton>}>
          {T.notaPc}
        </Aviso>
      ) : null}
      {cuerpo}
      <ReservaCapas />
    </Pantalla>
  );
}

/** Escritorio: columna izquierda con las tiendas del recorrido (✓ avisadas, la actual resaltada). */
function ListaTiendas(p: {
  recorrido: string[];
  actual: string;
  avisadas: string[];
  saltadas: string[];
  filas: Map<string, C.FilaTienda>;
  porTienda: Map<string, C.MuestraVista[]>;
  alElegir: (k: string) => void;
}): ReactElement {
  const avisadas = new Set(p.avisadas);
  const saltadas = new Set(p.saltadas);
  const refActual = useRef<HTMLLIElement>(null);
  useEffect(() => {
    refActual.current?.scrollIntoView?.({ block: 'nearest' });
  }, [p.actual]);
  return (
    <nav className={cx(css.lista)} aria-label={T.listaTiendas}>
      <p className={cx(comun.overline, css.listaTitulo)}>{T.listaTiendas}</p>
      <ol className={cx(css.listaItems)}>
        {p.recorrido.map((k) => {
          const fila = p.filas.get(k);
          const pend = p.porTienda.get(k) ?? [];
          const nombre = fila?.nombre ?? pend[0]?.tienda.nombre ?? k;
          const estado = avisadas.has(k) ? 'avisada' : k === p.actual ? 'actual' : saltadas.has(k) ? 'saltada' : 'pendiente';
          return (
            <li key={k} ref={k === p.actual ? refActual : undefined}>
              <button
                type="button"
                className={cx(css.listaItem)}
                data-estado={estado}
                data-nombre={nombre}
                aria-current={k === p.actual ? 'step' : undefined}
                aria-disabled={estado === 'avisada' ? true : undefined}
                onClick={() => {
                  if (estado !== 'avisada') p.alElegir(k);
                }}
              >
                <AvatarTienda nombre={nombre} tamano={24} />
                <span className={cx(css.listaNombre)}>{nombre}</span>
                <span className={cx(css.listaEstado)}>
                  {estado === 'avisada' ? <Icono nombre="Check" tamano={16} etiqueta={T.tiendaAvisada} /> : estado === 'saltada' ? <Icono nombre="ArrowRight" tamano={14} etiqueta={T.tiendaSaltada} /> : <span className={cx(css.listaConteo)}>{formato.numero(pend.length)}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** «¡Avisaste a tus {30} tiendas!» con el ticket de corte en su variante «Estás al día» (02 §7.22). */
function Cierre(p: { avisadas: number; total: number; saltadas: number; alVolverASaltadas: () => void }): ReactElement {
  const titulo = useFocoAlMontar<HTMLHeadingElement>();
  return (
    <section className={cx(css.cierre)} aria-labelledby="flujos-avisar-cierre">
      {p.saltadas === 0 ? (
        <Ticket
          variante="al_dia"
          titulo={T.avisarTitulo}
          subtitulo={formato.fechaConDia(hoyLocal())}
          renglones={[{ concepto: T.tiendaAvisada, cifra: formato.numero(p.avisadas) }]}
          total={T.avisadasDe(p.avisadas, p.total)}
          className={cx(css.cierreTicket)}
        />
      ) : (
        <Palomita tamano={56} />
      )}
      <h2 id="flujos-avisar-cierre" ref={titulo} tabIndex={-1} className={cx(css.cierreTitulo)}>
        {p.saltadas > 0 ? T.faltanSaltadas(p.saltadas) : T.cierreAvisar(p.avisadas)}
      </h2>
      <p className={cx(css.cierreTexto)}>{T.avisadasTodasTexto}</p>
      <div className={cx(css.cierreAcciones)}>
        {p.saltadas > 0 ? (
          <Boton variante="primario" tamano="lg" icono="RotateCcw" alPulsar={p.alVolverASaltadas}>
            {T.volverSaltadas}
          </Boton>
        ) : null}
        <Boton variante={p.saltadas > 0 ? 'secundario' : 'primario'} tamano="lg" alPulsar={() => navegar('/inicio')}>
          {T.volverInicio}
        </Boton>
      </div>
    </section>
  );
}
