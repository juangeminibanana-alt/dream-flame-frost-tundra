/**
 * #/muestras/agenda · Agenda (01 §4.4). Semana (por omisión) y Mes. Cada día con su capacidad «2/3» (en rojo si se
 * excede: «4/3»), los días sin videos atenuados con «Sin videos», «Sin fecha ({n})» y la protección de promesas al
 * mover (useControlMuestra.planear abre «Le prometiste a {tienda}…» [Mover y preparar mensaje]).
 * Escritorio: columna «Sin fecha» con filtro a la izquierda y los 7 días en bandas; se arrastra entre días (soltar en
 * «Sin fecha» quita la fecha; soltar en un día sin videos pregunta «¿Hacer videos el domingo?»).
 * Celular: tira semanal arriba, lista por día con encabezados fijos, «Sin fecha ({n})» plegable al final; mover = ⋯ ›
 * «Cambiar fecha» (no se arrastra) y un botón flotante «Armar mi plan» o «Avisar a mis tiendas».
 * Atrasadas: «Tienes {2} videos atrasados de días anteriores.» [Mover a hoy] [Repartir en los próximos días].
 */
import { useMemo, useState, type DragEvent, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, Pantalla, useClaseAncho, useParametro, usePlataforma } from '@/app';
import { PestanasMuestras, TarjetaMuestra, useControlMuestra } from '@/bloques';
import { BarraProgreso, Boton, BotonIcono, CampoTexto, Chip, EncabezadoPantalla, EstadoVacio, Icono, Modal, Segmentado, useToast } from '@/componentes';
import { useAcciones, type ResultadoLote } from '@/datos';
import { coincide, contarTrabajo, formato, hoyLocal, opsDePlan, sumarDias, type OperacionPlan, type ResultadoPlan } from '@/dominio';
import { BarraFija, ReservaCapas } from '../BarraFija';
import { useDatosTrabajo } from '../datos';
import { Aviso, ErrorFlujo, EsqueletoFlujo } from '../Estados';
import { T } from '../textos';
import { capitalizar, cx, nombreDe } from '../util';
import comun from '../flujos.module.css';
import { aOpLocal, hayPlan } from '../plan/logica';
import {
  agruparPorDia, atrasadas, decidirSoltar, diasDeSemana, etiquetaDia, lunesDe, moverMes, ocupacionDia, opsMoverAHoy, primeroDelMes,
  repartirAtrasadas, semanasDelMes, sePuedeMover, sinFecha, textoMes, textoSemana, type OcupacionDia,
} from './logica';
import css from './Agenda.module.css';

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const LETRAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
type Vista = 'semana' | 'mes';

export function PantallaAgenda(): ReactElement {
  const datos = useDatosTrabajo();
  const control = useControlMuestra();
  const acciones = useAcciones();
  const toast = useToast();
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  // Composición por ancho (una tableta Android usa la de escritorio); lo táctil y lo nativo, por plataforma.
  const movil = clase === 'compacta';
  const hoy = hoyLocal();

  const [semanaParam, setSemana] = useParametro('semana');
  const [vistaParam, setVista] = useParametro('vista');
  const vista: Vista = vistaParam === 'mes' && !movil ? 'mes' : 'semana';
  const ancla = semanaParam !== null && FECHA.test(semanaParam) ? semanaParam : hoy;
  const lunes = lunesDe(ancla);
  const dias = diasDeSemana(lunes);

  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [destino, setDestino] = useState<C.FechaLocal | 'sin_fecha' | null>(null);
  const [confirmarDia, setConfirmarDia] = useState<{ m: C.MuestraVista; fecha: C.FechaLocal } | null>(null);
  const [diaAbierto, setDiaAbierto] = useState<C.FechaLocal | null>(null);
  const [reparto, setReparto] = useState<ResultadoPlan | null>(null);
  const [filtro, setFiltro] = useState('');
  const [sinFechaAbierta, setSinFechaAbierta] = useState(false);

  const porDia = useMemo(() => agruparPorDia(datos.items), [datos.items]);
  const listaSinFecha = useMemo(() => sinFecha(datos.pendientes), [datos.pendientes]);
  const filtradas = useMemo(() => listaSinFecha.filter((m) => coincide(filtro, nombreDe(m.producto), m.tienda.nombre, m.variante)), [listaSinFecha, filtro]);
  const listaAtrasadas = useMemo(() => atrasadas(datos.pendientes, hoy), [datos.pendientes, hoy]);
  const porId = useMemo(() => new Map(datos.items.map((m) => [m.application_id, m] as const)), [datos.items]);
  const conteo = useMemo(() => contarTrabajo(datos.pendientes, datos.avisos, hoy), [datos.pendientes, datos.avisos, hoy]);
  const planeados = useMemo(() => datos.pendientes.filter((m) => m.avance.fecha_planeada !== null && m.avance.etapa !== 'por_planear').length, [datos.pendientes]);
  const ocupacion = (f: C.FechaLocal): OcupacionDia => ocupacionDia(f, porDia.get(f), datos.ritmo.capacidad, datos.ritmo.dias);
  const conPlan = hayPlan(datos.pendientes);

  // ------------------------------------------------------------------ acciones
  const avisarLote = (r: ResultadoLote, texto: string): boolean => {
    if (r.estado === 'error' || r.estado === 'conflicto') {
      toast.mostrar({ texto: r.resultados.find((x) => x.error)?.error ?? T.errorTexto, tono: 'error' });
      return false;
    }
    toast.mostrar({
      texto,
      tono: 'ok',
      ...(r.estado === 'en_cola' ? { detalle: T.planEnCola } : {}),
      accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() },
      duracion_ms: 6000,
    });
    return true;
  };

  const aplicar = async (ops: OperacionPlan[], texto: string): Promise<boolean> => {
    if (ops.length === 0) return true;
    return avisarLote(await acciones.lote(ops.map(aOpLocal)), texto);
  };

  const moverAHoy = (): void => void aplicar(opsMoverAHoy(listaAtrasadas, hoy), T.movidasHoy(listaAtrasadas.length));

  const repartir = (): void => {
    const r = repartirAtrasadas({ pendientes: datos.pendientes, lista: listaAtrasadas, capacidad: datos.ritmo.capacidad, dias: datos.ritmo.dias, orden: datos.ritmo.orden, planes: datos.planes, hoy });
    if (r.asignaciones.length === 0) {
      toast.mostrar({ texto: T.noCabeRepartir, tono: 'info' });
      return;
    }
    if (r.rompe_promesa.length > 0) setReparto(r);
    else void aplicar(opsDePlan(r, datos.pendientes, datos.planes), T.repartidas(r.asignaciones.length));
  };

  const confirmarReparto = async (): Promise<void> => {
    const r = reparto;
    if (!r) return;
    setReparto(null);
    const ok = await aplicar(opsDePlan(r, datos.pendientes, datos.planes), T.repartidas(r.asignaciones.length));
    const primera = r.rompe_promesa[0];
    const m = primera ? porId.get(primera.application_id) : undefined;
    if (ok && m) navegar(`/muestras/agenda?mensaje=${encodeURIComponent(`t:${m.tienda.tienda_key}`)}&plantilla=nueva_fecha`);
  };

  const soltar = (id: string, lugar: C.FechaLocal | 'sin_fecha'): void => {
    const m = porId.get(id);
    if (!m) return;
    const d = decidirSoltar(m, lugar, datos.ritmo.dias, hoy);
    if (d.tipo === 'quitar_fecha') void control.cambiarEtapa(m, 'por_planear');
    else if (d.tipo === 'confirmar_dia') setConfirmarDia({ m, fecha: d.fecha });
    else if (d.tipo === 'planear') void control.planear(m, d.fecha);
  };

  // ------------------------------------------------------------------ arrastrar (solo escritorio con ratón: en Android
  // no se arrastra, ni en tableta; se mueve con ⋯ › «Mover a otro día»)
  const arrastrable = !movil && !android;
  const zona = (lugar: C.FechaLocal | 'sin_fecha') =>
    arrastrable
      ? {
          onDragOver: (ev: DragEvent<HTMLElement>) => {
            if (!arrastrando) return;
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'move';
            if (destino !== lugar) setDestino(lugar);
          },
          onDragLeave: (ev: DragEvent<HTMLElement>) => {
            if (ev.currentTarget.contains(ev.relatedTarget as Node | null)) return;
            if (destino === lugar) setDestino(null);
          },
          onDrop: (ev: DragEvent<HTMLElement>) => {
            ev.preventDefault();
            const id = ev.dataTransfer.getData('text/plain') || arrastrando;
            setDestino(null);
            setArrastrando(null);
            if (id) soltar(id, lugar);
          },
        }
      : {};

  const tarjeta = (m: C.MuestraVista): ReactElement => {
    const mueve = arrastrable && sePuedeMover(m);
    return (
      <li
        key={m.application_id}
        className={cx(css.item, mueve && css.itemArrastrable, arrastrando === m.application_id && css.itemArrastrando)}
        data-muestra={m.application_id}
        {...(mueve
          ? {
              draggable: true,
              onDragStart: (ev: DragEvent<HTMLLIElement>) => {
                ev.dataTransfer.setData('text/plain', m.application_id);
                ev.dataTransfer.effectAllowed = 'move';
                setArrastrando(m.application_id);
              },
              onDragEnd: () => {
                setArrastrando(null);
                setDestino(null);
              },
            }
          : {})}
      >
        <TarjetaMuestra muestra={m} variante="agenda" alAbrir={() => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)} />
      </li>
    );
  };

  // ------------------------------------------------------------------ piezas
  const irSemana = (delta: number): void => setSemana(delta === 0 ? null : sumarDias(lunes, delta * 7), { reemplazar: true });
  const irMes = (delta: number): void => setSemana(moverMes(primeroDelMes(ancla), delta), { reemplazar: true });
  const navegacion = (
    <div className={cx(css.navegacion)}>
      <div className={cx(css.flechas)}>
        <BotonIcono icono="ChevronLeft" etiqueta={vista === 'mes' ? T.mesAnterior : T.semanaAnterior} variante="secundario" alPulsar={() => (vista === 'mes' ? irMes(-1) : irSemana(-1))} />
        <Boton variante="secundario" alPulsar={() => setSemana(null, { reemplazar: true })} aria-label={T.irAHoy}>
          {T.hoy}
        </Boton>
        <BotonIcono icono="ChevronRight" etiqueta={vista === 'mes' ? T.mesSiguiente : T.semanaSiguiente} variante="secundario" alPulsar={() => (vista === 'mes' ? irMes(1) : irSemana(1))} />
      </div>
      <h2 className={cx(css.periodo)} aria-live="polite">
        {vista === 'mes' ? textoMes(ancla) : textoSemana(lunes)}
      </h2>
      {movil ? null : (
        <Segmentado<Vista>
          etiqueta={T.vistaAgenda}
          valor={vista}
          alCambiar={(v) => setVista(v === 'mes' ? 'mes' : null, { reemplazar: true })}
          opciones={[
            { valor: 'semana', etiqueta: T.semana },
            { valor: 'mes', etiqueta: T.mes },
          ]}
          className={cx(css.segmentado)}
        />
      )}
    </div>
  );

  const avisoAtrasadas = listaAtrasadas.length > 0 ? (
    reparto ? (
      <Aviso
        tono="atencion"
        icono="CalendarClock"
        rol="alert"
        acciones={
          <>
            <Boton variante="primario" tamano="sm" icono="MessageCircle" alPulsar={() => void confirmarReparto()}>
              {T.repartirYPreparar}
            </Boton>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => setReparto(null)}>
              {T.cancelar}
            </Boton>
          </>
        }
      >
        {T.repartirRompe(reparto.rompe_promesa.length, porId.get(reparto.rompe_promesa[0]?.application_id ?? '')?.tienda.nombre ?? T.muestras)}
      </Aviso>
    ) : (
      <Aviso
        tono="atencion"
        icono="History"
        acciones={
          <>
            <Boton variante="secundario" tamano="sm" alPulsar={moverAHoy}>
              {T.moverAHoy}
            </Boton>
            <Boton variante="secundario" tamano="sm" alPulsar={repartir}>
              {T.repartir}
            </Boton>
          </>
        }
      >
        {T.atrasados(listaAtrasadas.length)}
      </Aviso>
    )
  ) : null;

  const tira = (
    <ol className={cx(css.tira)} aria-label={T.semanaDe}>
      {dias.map((f, i) => {
        const o = ocupacion(f);
        const nombre = formato.fechaConDia(f);
        return (
          <li key={f}>
            <button
              type="button"
              className={cx(css.tiraDia, f === hoy && css.tiraHoy, !o.trabaja && css.tiraLibre, o.excedido && css.tiraExcedido)}
              aria-label={o.trabaja ? T.capacidadAria(nombre, o.usados, o.capacidad) : o.usados > 0 ? T.capacidadAria(nombre, o.usados, 0) : T.diaSinVideosAria(nombre)}
              onClick={() => document.getElementById(`agenda-dia-${f}`)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })}
            >
              <span className={cx(css.tiraLetra)} aria-hidden="true">
                {LETRAS[i]}
              </span>
              <span className={cx(css.tiraNumero)} aria-hidden="true">
                {Number(f.slice(8))}
              </span>
              {o.trabaja ? (
                <>
                  <BarraProgreso valor={Math.min(1, o.usados / Math.max(1, o.capacidad))} etiqueta={T.capacidadAria(nombre, o.usados, o.capacidad)} className={cx(css.tiraBarra)} />
                  <span className={cx(css.tiraConteo)} aria-hidden="true">
                    {T.capacidadDia(o.usados, o.capacidad)}
                  </span>
                </>
              ) : (
                <span className={cx(css.tiraSin)} aria-hidden="true">
                  {o.usados > 0 ? formato.numero(o.usados) : '—'}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );

  const capacidadChip = (o: OcupacionDia): ReactElement =>
    o.trabaja || o.usados > 0 ? (
      <Chip tono={o.excedido || (!o.trabaja && o.usados > 0) ? 'critico' : o.usados >= o.capacidad ? 'marca' : 'neutro'} className={cx(css.capacidad)}>
        {T.capacidadDia(o.usados, o.trabaja ? o.capacidad : 0)}
      </Chip>
    ) : (
      <span className={cx(css.sinVideos)}>{T.sinVideos}</span>
    );

  const bandas = (
    <div className={cx(css.dias, arrastrando !== null && css.diasArrastrando)}>
      {dias.map((f) => {
        const lista = porDia.get(f) ?? [];
        const o = ocupacion(f);
        const pasado = f < hoy;
        const vacia = lista.length === 0;
        // En el celular, un día que ya pasó sin nada no aporta: la lista empieza en lo que sí toca (01 §4.4 Celular).
        if (vacia && pasado && movil) return null;
        return (
          <section
            key={f}
            id={`agenda-dia-${f}`}
            className={cx(
              css.banda, f === hoy && css.bandaHoy, !o.trabaja && css.bandaLibre, pasado && css.bandaPasada, vacia && css.bandaVacia, destino === f && css.bandaDestino,
            )}
            aria-label={`${etiquetaDia(f, hoy)}: ${o.trabaja ? T.capacidadDia(o.usados, o.capacidad) : T.sinVideos}`}
            data-fecha={f}
            {...(pasado ? {} : zona(f))}
          >
            <header className={cx(css.bandaCabeza)}>
              <span className={cx(css.bandaNumero)} aria-hidden="true">
                {Number(f.slice(8))}
              </span>
              <span className={cx(css.bandaTextos)}>
                {/* Celular (01 §4.4): «Hoy · jue 12 nov», «Mañana · vie 13 nov»…; en escritorio el número grande ya marca el día. */}
                <span className={cx(css.bandaSemana)}>{movil ? etiquetaDia(f, hoy) : f === hoy ? `${T.hoyEtiqueta} · ${formato.fechaConDia(f)}` : capitalizar(formato.fechaConDia(f))}</span>
                {capacidadChip(o)}
              </span>
            </header>
            {lista.length > 0 ? (
              <ul className={cx(css.tarjetas)}>{lista.map(tarjeta)}</ul>
            ) : (
              <p className={cx(css.vacio)}>{arrastrando && !pasado ? T.soltarAqui : pasado ? T.diaPasadoVacio : o.trabaja ? T.diaVacio : T.diaLibre}</p>
            )}
          </section>
        );
      })}
    </div>
  );

  const columnaSinFecha = (
    <aside className={cx(css.sinFecha, destino === 'sin_fecha' && css.sinFechaDestino)} aria-label={T.pendientesSinFecha} {...zona('sin_fecha')}>
      <header className={cx(css.sinFechaCabeza)}>
        <h2 className={cx(css.sinFechaTitulo)}>{T.sinFechaConteo(listaSinFecha.length)}</h2>
        {listaSinFecha.length > 4 ? <CampoTexto etiqueta={T.sinFecha} etiquetaOculta tipo="search" placeholder={T.filtrar} valor={filtro} alCambiar={setFiltro} /> : null}
      </header>
      {filtradas.length > 0 ? (
        <ul className={cx(css.tarjetas, css.tarjetasSinFecha)}>{filtradas.map(tarjeta)}</ul>
      ) : (
        <p className={cx(css.vacio)}>{listaSinFecha.length === 0 ? T.sinFechaVacio : T.sinFechaAyuda}</p>
      )}
      {listaSinFecha.length > 0 ? <p className={cx(css.ayudaSinFecha)}>{T.sinFechaAyuda}</p> : null}
    </aside>
  );

  // ------------------------------------------------------------------ cuerpo
  let cuerpo: ReactElement;
  if (!datos.listo) {
    cuerpo = datos.error ? <ErrorFlujo error={datos.error} titulo={T.agendaError} alReintentar={datos.refrescar} /> : <EsqueletoFlujo filas={5} />;
  } else if (porDia.size === 0) {
    cuerpo = (
      <div className={cx(css.vacia)}>
        <div className={cx(comun.estadoCentro, css.vaciaEstado)}>
          <EstadoVacio icono="CalendarDays" titulo={T.agendaVaciaTitulo} texto={T.agendaVaciaTexto} accion={{ etiqueta: T.armarMiPlan, alPulsar: () => navegar('/muestras/plan') }} />
        </div>
        {listaSinFecha.length > 0 ? (
          <section className={cx(css.vaciaTira)} aria-label={T.pendientesSinFecha}>
            <h2 className={cx(css.sinFechaTitulo)}>{T.sinFechaConteo(listaSinFecha.length)}</h2>
            <ul className={cx(css.fotos)}>
              {listaSinFecha.map((m) => (
                <li key={m.application_id}>
                  <TarjetaMuestra muestra={m} variante="tira" alAbrir={() => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    );
  } else if (vista === 'mes') {
    cuerpo = (
      <>
        {navegacion}
        {avisoAtrasadas}
        <VistaMes ancla={ancla} hoy={hoy} porDia={porDia} capacidad={datos.ritmo.capacidad} dias={datos.ritmo.dias} alAbrir={setDiaAbierto} />
      </>
    );
  } else if (movil) {
    cuerpo = (
      <>
        {navegacion}
        {tira}
        {avisoAtrasadas}
        {bandas}
        <section className={cx(css.sinFechaMovil)} aria-label={T.pendientesSinFecha}>
          <button type="button" className={cx(css.plegable)} aria-expanded={sinFechaAbierta} onClick={() => setSinFechaAbierta((v) => !v)}>
            <span>{T.sinFechaConteo(listaSinFecha.length)}</span>
            <Icono nombre="ChevronDown" tamano={18} className={cx(sinFechaAbierta && css.girado)} />
          </button>
          {sinFechaAbierta ? listaSinFecha.length > 0 ? <ul className={cx(css.tarjetas)}>{listaSinFecha.map(tarjeta)}</ul> : <p className={cx(css.vacio)}>{T.sinFechaVacio}</p> : null}
        </section>
      </>
    );
  } else {
    cuerpo = (
      <>
        {navegacion}
        {avisoAtrasadas}
        {tira}
        <div className={cx(css.semana)}>
          {columnaSinFecha}
          {bandas}
        </div>
      </>
    );
  }

  // Botón flotante del celular (01 §4.4); con la agenda vacía no hace falta: el estado vacío ya ofrece «Armar mi plan».
  const fab = movil && datos.listo && porDia.size > 0 ? (!conPlan ? 'plan' : conteo.tiendas_por_avisar > 0 ? 'avisar' : null) : null;

  return (
    <Pantalla titulo={T.agenda} lista={datos.listo} className={cx(comun.pantalla, datos.refrescando && comun.refrescando)}>
      <EncabezadoPantalla titulo={T.agenda} contexto={datos.listo ? T.contextoAgenda(planeados, listaSinFecha.length) : T.cargando} />
      <PestanasMuestras activa="agenda" />
      {cuerpo}
      {fab ? (
        <BarraFija etiqueta={fab === 'plan' ? T.armarMiPlan : T.avisarMisTiendas} className={cx(css.fab)}>
          <Boton variante="primario" tamano="lg" icono={fab === 'plan' ? 'CalendarDays' : 'MessageCircle'} alPulsar={() => navegar(fab === 'plan' ? '/muestras/plan' : '/muestras/avisos')}>
            {fab === 'plan' ? T.armarMiPlan : T.avisarMisTiendas}
          </Boton>
        </BarraFija>
      ) : null}

      <Modal
        abierto={confirmarDia !== null}
        titulo={confirmarDia ? T.hacerVideosDia(formato.fechaLarga(confirmarDia.fecha).split(' ')[0] ?? '') : ''}
        descripcion={T.hacerVideosDiaTexto}
        ancho={440}
        alCerrar={() => setConfirmarDia(null)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setConfirmarDia(null)}>
              {T.cancelar}
            </Boton>
            <Boton
              variante="primario"
              alPulsar={() => {
                const c = confirmarDia;
                setConfirmarDia(null);
                if (c) void control.planear(c.m, c.fecha);
              }}
            >
              {T.siHacerVideos}
            </Boton>
          </>
        }
      />

      <Modal
        abierto={diaAbierto !== null}
        titulo={diaAbierto ? T.listaDelDia(etiquetaDia(diaAbierto, hoy), (porDia.get(diaAbierto) ?? []).length) : ''}
        ancho={560}
        completoEnCompacta
        alCerrar={() => setDiaAbierto(null)}
      >
        {diaAbierto && (porDia.get(diaAbierto) ?? []).length > 0 ? (
          <ul className={cx(css.tarjetas)}>{(porDia.get(diaAbierto) ?? []).map(tarjeta)}</ul>
        ) : (
          <p className={cx(css.vacio)}>{T.diaVacio}</p>
        )}
      </Modal>
      <ReservaCapas />
    </Pantalla>
  );
}

/** Vista Mes (01 §4.4): puntos por día con el número de videos; clic en un día = ventana con la lista. */
function VistaMes(p: {
  ancla: C.FechaLocal;
  hoy: C.FechaLocal;
  porDia: Map<C.FechaLocal, C.MuestraVista[]>;
  capacidad: number;
  dias: number[];
  alAbrir: (f: C.FechaLocal) => void;
}): ReactElement {
  const semanas = semanasDelMes(p.ancla);
  const clave = p.ancla.slice(0, 7);
  return (
    <div className={cx(css.mes)} role="grid" aria-label={T.mesDe}>
      <div className={cx(css.mesFila, css.mesCabeza)} role="row">
        {LETRAS.map((l, i) => (
          <span key={`${l}${i}`} role="columnheader" className={cx(css.mesLetra)}>
            {l}
          </span>
        ))}
      </div>
      {semanas.map((semana) => (
        <div key={semana[0]} className={cx(css.mesFila)} role="row">
          {semana.map((f) => {
            const lista = p.porDia.get(f) ?? [];
            const o = ocupacionDia(f, lista, p.capacidad, p.dias);
            const fuera = f.slice(0, 7) !== clave;
            const nombre = formato.fechaConDia(f);
            return (
              <span key={f} role="gridcell" className={cx(css.mesCeldaEnvoltura)}>
                <button
                  type="button"
                  className={cx(css.mesCelda, fuera && css.mesFuera, f === p.hoy && css.mesHoy, !o.trabaja && css.mesLibre, o.excedido && css.mesExcedido)}
                  aria-label={lista.length > 0 ? T.verDia(nombre, lista.length) : o.trabaja ? `${nombre}: ${T.diaVacio}` : T.diaSinVideosAria(nombre)}
                  onClick={() => p.alAbrir(f)}
                >
                  <span className={cx(css.mesNumero)}>{Number(f.slice(8))}</span>
                  {lista.length > 0 ? (
                    <span className={cx(css.mesContenido)}>
                      <span className={cx(css.mesPuntos)} aria-hidden="true">
                        {lista.slice(0, 6).map((m) => (
                          <span key={m.application_id} className={cx(css.mesPunto)} data-etapa={m.avance.etapa} />
                        ))}
                      </span>
                      <span className={cx(css.mesConteo)}>{formato.numero(lista.length)}</span>
                    </span>
                  ) : !o.trabaja && !fuera ? (
                    <span className={cx(css.mesSin)}>{T.sinVideos}</span>
                  ) : null}
                </button>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
