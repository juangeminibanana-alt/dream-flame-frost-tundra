/**
 * EditorMensaje (01 §4.8, §4.17): chips de plantilla (preseleccionada la sugerida), fecha prometida (fecha de
 * PUBLICACIÓN: programada; si no, planeada + 2), vista previa con las variables resaltadas y editable, contador de
 * caracteres y Copiar. Si falta un dato (fecha, plan o enlace) Copiar va desactivado: nunca se copia «fecha por
 * confirmar» ni una variable sin resolver. Al copiar se guarda el aviso «copiado, sin confirmar» y se pregunta «¿Ya se
 * lo enviaste a la tienda?» [Sí, ya se lo envié] [Todavía no]; confirmar registra el aviso con Deshacer de 6 s.
 * «Ya le escribí por mi cuenta» registra un aviso sin copiar (plantilla u «Otro» y la fecha prometida, si la hubo).
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import type { EditorMensajeProps } from '@firmas/bloques';
import { AreaTexto, Boton, CampoTexto, Esqueleto, Icono, Menu, SelectorFecha, useToast } from '@/componentes';
import { navegar } from '@/app';
import { useAcciones } from '@/datos';
import { abrirExterno, abrirTikTok, compartirTexto, copiarTexto } from '@/plataforma';
import { ahoraS, formato, hoyLocal, nuevoId, resolverPlantilla, sumarDias, type MensajeResuelto } from '@/dominio';
import { useControlMuestra } from '../useControlMuestra';
import { NOMBRE_PLANTILLA, T } from '../textos';
import { cx, nombreDe, textoAbrirFuera, useEsAndroid } from '../util/comun';
import comun from '../util/comun.module.css';
import { useDatosMensaje } from './contextoMensaje';
import css from './EditorMensaje.module.css';

const VARIABLE = /\{(tienda|producto|fecha_compromiso|fecha_anterior|link_video|lista_productos|lista_fechas|agradecimiento_socio|problema_envio|firma)\}/;

/** Plantillas que piden la fecha prometida (las que tienen {fecha_compromiso} o {lista_fechas}). */
export function usaFecha(cuerpo: string): boolean {
  return cuerpo.includes('{fecha_compromiso}') || cuerpo.includes('{lista_fechas}');
}

/** En {lista_fechas} una muestra sin fecha queda «… a más tardar el …» (dominio.resolverPlantilla): ese «…» final de
 *  renglón es el hueco que impide copiar, y se pinta como faltante (ámbar) dentro del resaltado lima. */
const HUECO_FECHA = /…(?=\n|$)/g;

function ContenidoMarca(p: { valor: string; variable: string }): ReactElement {
  if (p.variable !== 'lista_fechas' || !p.valor.includes('…')) return <>{p.valor}</>;
  const partes: ReactElement[] = [];
  let i = 0;
  for (const m of p.valor.matchAll(HUECO_FECHA)) {
    const at = m.index ?? 0;
    if (at > i) partes.push(<span key={`t${at}`}>{p.valor.slice(i, at)}</span>);
    partes.push(
      <span key={`h${at}`} className={css.hueco} title={T.faltaFecha}>
        <span aria-hidden="true">…</span>
        <span className={comun.lector}>{T.faltaFecha}</span>
      </span>,
    );
    i = at + 1;
  }
  if (i < p.valor.length) partes.push(<span key="fin">{p.valor.slice(i)}</span>);
  return <>{partes}</>;
}

/** Marca en la fila de plantillas qué orillas tienen chips fuera de la vista (data-desborde; lo usa el CSS). */
function medirDesborde(fila: HTMLElement): void {
  const izq = fila.scrollLeft > 2;
  const der = fila.scrollLeft + fila.clientWidth < fila.scrollWidth - 2;
  const valor = izq && der ? 'ambos' : izq ? 'izq' : der ? 'der' : 'ninguno';
  if (fila.dataset.desborde !== valor) fila.dataset.desborde = valor;
}

/** Desplaza la fila de plantillas (solo la fila, nunca la página) hasta que la plantilla elegida quede a la vista. */
function traerActivaAVista(fila: HTMLElement): void {
  if (fila.scrollWidth > fila.clientWidth + 1) {
    const activa = fila.querySelector<HTMLElement>('[aria-checked="true"]');
    if (activa) {
      const rf = fila.getBoundingClientRect();
      const ra = activa.getBoundingClientRect();
      const margen = 36; // los desvanecidos de las orillas miden 28
      if (ra.left < rf.left + margen) fila.scrollLeft = Math.max(0, fila.scrollLeft + ra.left - rf.left - margen);
      else if (ra.right > rf.right - margen) fila.scrollLeft += ra.right - rf.right + margen;
    }
  }
  medirDesborde(fila);
}

/** Vista previa con los rangos de variables marcados (<mark>), sin innerHTML. */
export function VistaPrevia(p: { mensaje: Pick<MensajeResuelto, 'texto' | 'resaltados'>; className?: string }): ReactElement {
  const partes: ReactElement[] = [];
  let i = 0;
  const rangos = [...p.mensaje.resaltados].sort((a, b) => a.inicio - b.inicio);
  rangos.forEach((r, n) => {
    if (r.inicio > i) partes.push(<span key={`t${n}`}>{p.mensaje.texto.slice(i, r.inicio)}</span>);
    const valor = p.mensaje.texto.slice(r.inicio, r.fin);
    partes.push(
      <mark key={`m${n}`} className={cx(css.marca, VARIABLE.test(valor) && css.marcaFalta)} data-variable={r.variable}>
        <ContenidoMarca valor={valor} variable={r.variable} />
      </mark>,
    );
    i = Math.max(i, r.fin);
  });
  if (i < p.mensaje.texto.length) partes.push(<span key="fin">{p.mensaje.texto.slice(i)}</span>);
  const ref = useRef<HTMLParagraphElement>(null);
  // Con texto largo la vista previa se desplaza: la orilla que tiene más texto se desvanece (data-desborde, en el CSS)
  // para que no se lea cortada a media línea, también en Android, donde la barra de desplazamiento no se ve.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const medir = (): void => medirDesbordeVertical(el);
    medir();
    let vivo = true;
    void document.fonts?.ready.then(() => {
      if (vivo) medir();
    });
    const observador = typeof ResizeObserver === 'function' ? new ResizeObserver(medir) : null;
    observador?.observe(el);
    return () => {
      vivo = false;
      observador?.disconnect();
    };
  }, [p.mensaje.texto]);
  return (
    <p ref={ref} className={cx(css.previa, p.className)} data-desborde="ninguno" onScroll={(e) => medirDesbordeVertical(e.currentTarget)}>
      {partes}
    </p>
  );
}

/** Marca en la vista previa qué orillas (arriba / abajo) tienen texto fuera de la vista. */
function medirDesbordeVertical(el: HTMLElement): void {
  const arriba = el.scrollTop > 2;
  const abajo = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  const valor = arriba && abajo ? 'ambos' : arriba ? 'arriba' : abajo ? 'abajo' : 'ninguno';
  if (el.dataset.desborde !== valor) el.dataset.desborde = valor;
}

function ChipsFecha(p: { nombre?: string; alElegir: (f: C.FechaLocal) => void }): ReactElement {
  const hoy = hoyLocal();
  const [calendario, setCalendario] = useState(false);
  const tres = sumarDias(hoy, 3);
  const semana = sumarDias(hoy, 7);
  return (
    <div className={css.fechaFalta}>
      {p.nombre ? <span className={css.fechaNombre}>{p.nombre}</span> : null}
      <div className={css.chipsFecha} role="group" aria-label={T.fechaPrometida}>
        <button type="button" className={css.chipFecha} onClick={() => p.alElegir(tres)}>
          {T.enTresDias} ({formato.fechaConDia(tres)})
        </button>
        <button type="button" className={css.chipFecha} onClick={() => p.alElegir(semana)}>
          {T.enUnaSemana} ({formato.fechaConDia(semana)})
        </button>
        <button type="button" className={css.chipFecha} aria-expanded={calendario} onClick={() => setCalendario((v) => !v)}>
          <Icono nombre="CalendarDays" tamano={14} /> {T.elegir}
        </button>
      </div>
      {calendario ? <SelectorFecha etiqueta={T.fechaPrometida} valor={null} min={sumarDias(hoy, 1)} alCambiar={(f) => { setCalendario(false); p.alElegir(f); }} /> : null}
    </div>
  );
}

export function EditorMensaje(p: EditorMensajeProps): ReactElement {
  const datos = useDatosMensaje(p.tiendaKey, p.solicitudes);
  const acciones = useAcciones();
  const control = useControlMuestra();
  const toast = useToast();
  const android = useEsAndroid();

  const [plantillaId, setPlantillaId] = useState<string | null>(p.plantillaInicial ?? null);
  const [fechas, setFechas] = useState<Record<string, C.FechaLocal>>({});
  const [agendar, setAgendar] = useState<{ m: C.MuestraVista; fecha: C.FechaLocal } | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [editado, setEditado] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);
  const [avisoCopiado, setAvisoCopiado] = useState<C.AvisoTienda | null>(null);
  const [ocultarConfirmar, setOcultarConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [porMiCuenta, setPorMiCuenta] = useState(false);
  const [cambiarFecha, setCambiarFecha] = useState<string | null>(null);
  const campoLink = useRef<HTMLDivElement>(null);
  const filaPlantillas = useRef<HTMLDivElement>(null);

  // La plantilla sugerida llega con los datos: se elige una sola vez (el usuario puede cambiarla después).
  useEffect(() => {
    if (plantillaId === null && !datos.cargando && datos.plantillas.length > 0) setPlantillaId(datos.sugerida);
  }, [plantillaId, datos.cargando, datos.plantillas.length, datos.sugerida]);

  const plantilla = datos.plantillas.find((x) => x.id === plantillaId) ?? null;
  // La fila de plantillas existe solo cuando ya hay datos y plantilla (antes se pinta el esqueleto). Con `plantillaInicial`
  // la plantilla puede quedar elegida mientras aún cargan las muestras: los efectos de la fila esperan a que se monte.
  const filaMontada = !datos.cargando && plantilla !== null;

  // En angosto los chips de plantilla van en una fila que se desplaza: la elegida (p. ej. «Ya tengo video», la 5.ª) se
  // trae a la vista dentro de la fila, sin mover la página, para que siempre se vea cuál está puesta.
  useEffect(() => {
    const fila = filaPlantillas.current;
    if (!filaMontada || !fila) return undefined;
    let vigente = true;
    traerActivaAVista(fila);
    // Con la fuente definitiva los chips cambian de ancho: se vuelve a acomodar cuando termina de cargar.
    void document.fonts?.ready.then(() => {
      if (vigente && fila.isConnected) traerActivaAVista(fila);
    });
    return () => {
      vigente = false;
    };
  }, [plantillaId, datos.plantillas.length, filaMontada]);

  // La fila que se desplaza se desvanece solo en la orilla que tiene más chips (izquierda, derecha o ambas): así un
  // chip a medias siempre se lee como «hay más», nunca como texto cortado.
  useEffect(() => {
    const fila = filaPlantillas.current;
    if (!filaMontada || !fila) return;
    const alCambiar = (): void => medirDesborde(fila);
    fila.addEventListener('scroll', alCambiar, { passive: true });
    window.addEventListener('resize', alCambiar);
    return () => {
      fila.removeEventListener('scroll', alCambiar);
      window.removeEventListener('resize', alCambiar);
    };
  }, [filaMontada]);
  const compromisos = useMemo(() => ({ ...datos.compromisosOmision, ...fechas }), [datos.compromisosOmision, fechas]);
  const linkVideo = link ?? (plantillaId === 'ya_publique' || plantillaId === 'ya_tengo_video' ? datos.linkOmision[plantillaId] : null);
  const fechaAnterior = useMemo(() => {
    let f: C.FechaLocal | null = null;
    for (const m of datos.muestras) if (m.avisos.promesa !== null && (f === null || m.avisos.promesa > f)) f = m.avisos.promesa;
    return f;
  }, [datos.muestras]);

  const resuelto = useMemo<MensajeResuelto | null>(() => {
    if (!plantilla) return null;
    return resolverPlantilla(plantilla, {
      tienda: { nombre: datos.tienda.nombre, es_socio: datos.tienda.es_socio },
      muestras: datos.muestras,
      compromisos,
      fecha_anterior: fechaAnterior,
      link_video: linkVideo,
      problema_envio: datos.problemaEnvio,
      firma: datos.firma,
    });
  }, [plantilla, datos.tienda, datos.muestras, compromisos, fechaAnterior, linkVideo, datos.problemaEnvio, datos.firma]);

  // Cambiar de plantilla descarta el texto editado (los datos vuelven a actualizarse solos).
  const elegirPlantilla = (id: string): void => {
    setPlantillaId(id);
    setEditado(null);
    setEditando(false);
  };

  const texto = editado ?? resuelto?.texto ?? '';
  const faltantes = editado !== null ? [] : resuelto?.faltantes ?? [];
  const puedeCopiar = texto.trim() !== '' && (editado !== null ? !VARIABLE.test(editado) : resuelto?.puede_copiar === true);
  const pendienteConfirmar = (avisoCopiado ?? datos.copiadoPendiente);
  const mostrarConfirmar = pendienteConfirmar !== null && !ocultarConfirmar && pendienteConfirmar.marcado_enviado_at === null;

  const nombreDeSolicitud = (id: string): string => {
    const m = datos.muestras.find((x) => x.application_id === id);
    return m ? nombreDe(m.producto) : id;
  };

  const fijarFecha = (id: string, fecha: C.FechaLocal): void => {
    setFechas((f) => ({ ...f, [id]: fecha }));
    setCambiarFecha(null);
    const m = datos.muestras.find((x) => x.application_id === id);
    // Sin fecha planeada: «¿Lo agendamos para el {promesa − 2}?» (01 §4.8 punto 3).
    if (m && m.avance.fecha_planeada === null && m.avance.etapa === 'por_planear') {
      const dia = sumarDias(fecha, -2);
      setAgendar({ m, fecha: dia < hoyLocal() ? hoyLocal() : dia });
    }
  };

  const compromisosDeAviso = (): Record<string, C.FechaLocal> => {
    const salida: Record<string, C.FechaLocal> = {};
    if (!plantilla || !usaFecha(plantilla.cuerpo)) return salida;
    for (const m of datos.muestras) {
      const f = compromisos[m.application_id];
      if (f !== undefined) salida[m.application_id] = f;
    }
    return salida;
  };

  const registrarCopia = async (): Promise<C.AvisoTienda | null> => {
    if (!plantillaId) return null;
    const previo = avisoCopiado ?? datos.copiadoPendiente;
    if (previo && previo.marcado_enviado_at === null) {
      const r = await acciones.editarAviso(previo.id, { texto, compromisos: compromisosDeAviso(), rev: previo.rev });
      return r.objeto ?? previo;
    }
    const r = await acciones.crearAviso({
      id: nuevoId(),
      tienda_key: p.tiendaKey,
      solicitud_ids: [...p.solicitudes],
      plantilla_id: plantillaId,
      texto,
      compromisos: compromisosDeAviso(),
      origen: 'copiado',
      copiado_at: ahoraS(),
      fecha_anterior: plantillaId === 'nueva_fecha' ? fechaAnterior : null,
    });
    if (r.estado === 'error') {
      toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
      return null;
    }
    return r.objeto;
  };

  const copiar = async (modo: 'copiar' | 'tiktok' | 'compartir'): Promise<void> => {
    if (!puedeCopiar) return;
    setOcupado(true);
    const ok = modo === 'compartir' ? await compartirTexto(texto) : await copiarTexto(texto);
    if (!ok) {
      setOcupado(false);
      if (modo !== 'compartir') toast.mostrar({ texto: T.toastNoCopiado, tono: 'error' });
      return;
    }
    const aviso = await registrarCopia();
    setOcupado(false);
    if (aviso) {
      setAvisoCopiado(aviso);
      setOcultarConfirmar(false);
      p.alCopiar?.(aviso);
    }
    if (modo === 'tiktok') void abrirTikTok(datos.enlaceProducto ?? undefined);
    if (modo !== 'compartir') {
      toast.mostrar({
        texto: T.toastMensajeCopiado,
        detalle: T.toastMensajeCopiadoDetalle,
        tono: 'ok',
        ...(android && modo === 'copiar' ? { accion: { etiqueta: T.toastAbrirTikTok, alPulsar: () => void abrirTikTok(datos.enlaceProducto ?? undefined) } } : {}),
      });
    }
  };

  const avisarRegistrado = (r: { estado: string; objeto: C.AvisoTienda | null; error: { mensaje: string } | null; deshacer(): Promise<void> }): void => {
    if (r.estado === 'conflicto') {
      toast.mostrar({ texto: T.conflicto, tono: 'info' });
      return;
    }
    if (r.estado === 'error') {
      toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
      return;
    }
    toast.mostrar({ texto: T.toastAvisoRegistrado, tono: 'ok', ...(r.estado === 'en_cola' ? { detalle: T.enCola } : {}), accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() }, duracion_ms: 6000 });
    if (r.objeto) p.alRegistrar?.(r.objeto);
  };

  const confirmarEnvio = async (): Promise<void> => {
    const aviso = pendienteConfirmar;
    if (!aviso) return;
    setOcupado(true);
    const r = await acciones.editarAviso(aviso.id, { marcado_enviado_at: ahoraS(), rev: aviso.rev });
    setOcupado(false);
    setAvisoCopiado(null);
    setOcultarConfirmar(true);
    avisarRegistrado(r);
  };

  const quitarAviso = async (a: C.AvisoTienda): Promise<void> => {
    const r = await acciones.editarAviso(a.id, { quitado_at: ahoraS(), rev: a.rev });
    if (r.estado === 'aplicada' || r.estado === 'en_cola') toast.mostrar({ texto: T.toastAvisoQuitado, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() }, duracion_ms: 6000 });
    else toast.mostrar({ texto: r.estado === 'conflicto' ? T.conflicto : r.error?.mensaje ?? T.errorGenerico, tono: r.estado === 'conflicto' ? 'info' : 'error' });
  };

  if (datos.cargando || (plantilla === null && datos.errorTexto === null)) {
    return (
      <div className={cx(css.editor, p.className)} aria-busy="true">
        <span className={comun.lector}>{T.cargandoMensaje}</span>
        <Esqueleto forma="texto" lineas={1} ancho="60%" />
        <Esqueleto forma="bloque" alto={140} />
        <Esqueleto forma="texto" lineas={1} ancho="40%" />
      </div>
    );
  }
  if (plantilla === null || resuelto === null) {
    return (
      <div className={cx(css.editor, p.className)}>
        <div className={comun.avisoCritico} role="alert">
          <Icono nombre="CircleAlert" tamano={18} />
          <span>{datos.errorTexto ?? T.necesitaPc}</span>
        </div>
      </div>
    );
  }

  const enviados = p.modo === 'dialogo'
    ? datos.avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null && (p.solicitudes.length === 0 || a.solicitud_ids.some((s) => p.solicitudes.includes(s))))
    : [];
  const conFecha = usaFecha(plantilla.cuerpo);
  const idsConFecha = datos.muestras.map((m) => m.application_id).filter((id) => compromisos[id] !== undefined);

  return (
    <div className={cx(css.editor, p.modo === 'avisar' && css.modoAvisar, p.className)}>
      <div ref={filaPlantillas} className={css.plantillas} role="radiogroup" aria-label={T.plantilla}>
        {datos.plantillas.map((pl) => (
          <button
            key={pl.id}
            type="button"
            role="radio"
            aria-checked={pl.id === plantillaId}
            className={cx(css.plantilla, pl.id === plantillaId && css.plantillaActiva)}
            onClick={() => elegirPlantilla(pl.id)}
          >
            {pl.id === datos.sugerida ? <Icono nombre="Sparkles" tamano={14} /> : null}
            {pl.nombre || NOMBRE_PLANTILLA[pl.id] || pl.id}
            {pl.id === datos.sugerida ? <span className={comun.lector}>{T.sugeridaLector}</span> : null}
          </button>
        ))}
      </div>

      {conFecha && idsConFecha.length > 0 ? (
        <div className={css.lePrometes}>
          <span className={css.rotulo}>{T.lePrometes}</span>
          <ul className={css.listaFechas}>
            {idsConFecha.map((id) => (
              <li key={id} className={css.filaFecha}>
                {datos.muestras.length > 1 ? <span className={css.fechaNombre}>{nombreDeSolicitud(id)}</span> : null}
                <button type="button" className={css.fechaValor} onClick={() => setCambiarFecha((x) => (x === id ? null : id))} aria-expanded={cambiarFecha === id} aria-label={T.fechaPrometidaCambiar(formato.fechaConDia(compromisos[id] ?? ''))}>
                  {formato.fechaConDia(compromisos[id] ?? '')}
                  <Icono nombre="Pencil" tamano={14} />
                </button>
                {cambiarFecha === id ? <SelectorFecha etiqueta={T.fechaPrometida} valor={compromisos[id] ?? null} min={hoyLocal()} alCambiar={(f) => fijarFecha(id, f)} /> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {faltantes.map((f) => {
        if (f.tipo === 'link_video') {
          return (
            <div key="link" className={comun.aviso} role="status">
              <Icono nombre="Link" tamano={18} />
              <div className={css.faltaCuerpo} ref={campoLink}>
                <strong>{T.agregaEnlace}</strong>
                <CampoTexto etiqueta={T.pegaEnlace} etiquetaOculta tipo="url" valor={link ?? ''} alCambiar={(v) => { setLink(v); setEditado(null); }} placeholder={T.placeholderEnlace} />
                <Boton variante="secundario" tamano="sm" icono="Link" alPulsar={() => campoLink.current?.querySelector('input')?.focus()}>
                  {T.pegarEnlace}
                </Boton>
              </div>
            </div>
          );
        }
        const n = f.solicitudes.length;
        return (
          <div key={f.tipo} className={comun.aviso} role="status">
            <Icono nombre="CalendarClock" tamano={18} />
            <div className={css.faltaCuerpo}>
              <strong>{f.tipo === 'plan' ? T.planeaAntesDeCopiar(formato.numero(n), n === 1) : T.eligeFecha}</strong>
              {f.solicitudes.map((id) => (
                <ChipsFecha key={id} {...(datos.muestras.length > 1 ? { nombre: nombreDeSolicitud(id) } : {})} alElegir={(fecha) => fijarFecha(id, fecha)} />
              ))}
              {f.tipo === 'plan' ? (
                <Boton variante="secundario" tamano="sm" icono="CalendarDays" alPulsar={() => { const m = datos.muestras.find((x) => x.application_id === f.solicitudes[0]); if (m) void control.planear(m); }}>
                  {T.planear}
                </Boton>
              ) : null}
            </div>
          </div>
        );
      })}

      {agendar ? (
        <div className={comun.avisoInfo} role="status">
          <Icono nombre="CalendarCheck" tamano={18} />
          <div className={css.faltaCuerpo}>
            <span>
              {T.loAgendamosAntes} <strong>{formato.fechaConDia(agendar.fecha)}</strong>?
            </span>
            <div className={comun.botones}>
              <Boton variante="secundario" tamano="sm" alPulsar={() => { const a = agendar; setAgendar(null); void control.planear(a.m, a.fecha); }}>
                {T.siAgendar}
              </Boton>
              <Boton variante="fantasma" tamano="sm" alPulsar={() => setAgendar(null)}>
                {T.noPorAhora}
              </Boton>
            </div>
          </div>
        </div>
      ) : null}

      <div className={css.marco}>
        <div className={css.marcoCabeza}>
          <span className={css.rotulo}>{T.vistaPrevia}</span>
          <span className={css.contador} aria-live="polite">
            {formato.numero(Array.from(texto).length)} {T.caracteres}
          </span>
        </div>
        {editando ? (
          <AreaTexto etiqueta={T.textoMensaje} etiquetaOculta valor={texto} alCambiar={(v) => setEditado(v)} filas={8} autoFoco className={cx(css.area)} />
        ) : (
          <VistaPrevia mensaje={editado !== null ? { texto: editado, resaltados: [] } : resuelto} />
        )}
        <div className={css.marcoPie}>
          {editado !== null ? (
            <>
              <span className={css.editadoNota}>{T.mensajeEditado}</span>
              <button type="button" className={comun.enlaceSuave} onClick={() => { setEditado(null); setEditando(false); }}>
                <Icono nombre="RotateCcw" tamano={14} /> {T.restablecer}
              </button>
            </>
          ) : (
            <button type="button" className={comun.enlaceSuave} onClick={() => setEditando((v) => !v)}>
              <Icono nombre="Pencil" tamano={14} /> {editando ? T.verVistaPrevia : T.editarTexto}
            </button>
          )}
        </div>
      </div>

      {mostrarConfirmar && pendienteConfirmar ? (
        <div className={css.confirmar} role="status">
          <span className={css.confirmarTexto}>
            <Icono nombre="MessageCircleWarning" tamano={18} /> {T.yaSeLoEnviaste}
          </span>
          <div className={comun.botones}>
            <Boton variante="primario" tamano="sm" icono="Check" cargando={ocupado} alPulsar={() => void confirmarEnvio()}>
              {p.modo === 'avisar' ? T.siSiguiente : T.siYaSeLoEnvie}
            </Boton>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => setOcultarConfirmar(true)}>
              {T.todaviaNo}
            </Boton>
          </div>
        </div>
      ) : null}

      <div className={css.acciones}>
        {android ? (
          <>
            <Boton variante="primario" tamano="lg" icono="Copy" anchoCompleto deshabilitado={!puedeCopiar} cargando={ocupado} alPulsar={() => void copiar('tiktok')}>
              {T.copiarYAbrir}
            </Boton>
            <div className={css.accionesFila}>
              <Boton variante="secundario" icono="Share2" deshabilitado={!puedeCopiar} alPulsar={() => void copiar('compartir')}>
                {T.compartir}
              </Boton>
              {datos.enlaceProducto ? (
                <Boton variante="secundario" icono="ExternalLink" alPulsar={() => void abrirExterno(datos.enlaceProducto ?? '')}>
                  {textoAbrirFuera(true)}
                </Boton>
              ) : null}
            </div>
          </>
        ) : (
          <div className={css.accionesFila}>
            <Boton variante="primario" icono="Copy" deshabilitado={!puedeCopiar} cargando={ocupado} atajo="Enter" alPulsar={() => void copiar('copiar')}>
              {T.copiarMensaje}
            </Boton>
            {datos.enlaceProducto ? (
              <Boton variante="secundario" icono="ExternalLink" alPulsar={() => void abrirExterno(datos.enlaceProducto ?? '')}>
                {textoAbrirFuera(false)}
              </Boton>
            ) : null}
          </div>
        )}
        {!puedeCopiar ? <span className={css.ayudaCopiar}>{T.completaLoQueFalta}</span> : null}
      </div>

      {porMiCuenta ? (
        <PorMiCuenta
          plantillas={datos.plantillas}
          sugerida={plantillaId ?? datos.sugerida}
          alCancelar={() => setPorMiCuenta(false)}
          alRegistrar={async (id, fecha) => {
            const compromisosCuenta: Record<string, C.FechaLocal> = {};
            if (fecha) for (const s of p.solicitudes) compromisosCuenta[s] = fecha;
            const r = await acciones.crearAviso({ id: nuevoId(), tienda_key: p.tiendaKey, solicitud_ids: [...p.solicitudes], plantilla_id: id, texto: '', compromisos: compromisosCuenta, origen: 'por_mi_cuenta', marcado_enviado_at: ahoraS() });
            setPorMiCuenta(false);
            avisarRegistrado(r);
          }}
        />
      ) : null}

      {enviados.length > 0 ? (
        <section className={css.enviados} aria-label={T.avisosEnviados}>
          <span className={css.rotulo}>{T.avisosEnviados}</span>
          <ul className={css.listaEnviados}>
            {enviados.map((a) => {
              const fechasA = Object.values(a.compromisos).sort();
              const promesa = fechasA[fechasA.length - 1];
              return (
                <li key={a.id} className={css.enviado}>
                  <span className={css.enviadoTexto}>
                    {formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at)} · {datos.plantillas.find((x) => x.id === a.plantilla_id)?.nombre ?? NOMBRE_PLANTILLA[a.plantilla_id] ?? T.otroMensaje}
                    {promesa ? ` · ${T.lePrometisteEl} ${formato.fechaConDia(promesa)}` : ''}
                  </span>
                  <Menu etiqueta={`${T.accionesDelAviso} ${formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at)}`} opciones={[{ id: 'quitar', etiqueta: T.quitarAviso, icono: 'Trash2', peligro: true, alPulsar: () => void quitarAviso(a) }]} />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <footer className={css.pie}>
        {!porMiCuenta ? (
          <button type="button" className={comun.enlace} onClick={() => setPorMiCuenta(true)}>
            {p.modo === 'avisar' ? T.yaLeEscribiCorto : T.yaLeEscribi}
          </button>
        ) : <span />}
        <span className={css.pieDerecha}>
          <button type="button" className={comun.enlaceSuave} onClick={() => navegar('/ajustes/ayuda')}>
            <Icono nombre="CircleHelp" tamano={14} /> {T.dondePego}
          </button>
          {p.modo === 'dialogo' ? (
            <button type="button" className={comun.enlaceSuave} onClick={() => navegar('/ajustes/plantillas')}>
              {T.editarPlantillas}
            </button>
          ) : null}
        </span>
      </footer>
    </div>
  );
}

function PorMiCuenta(p: { plantillas: C.PlantillaMensaje[]; sugerida: string; alCancelar: () => void; alRegistrar: (plantilla: string, fecha: C.FechaLocal | null) => Promise<void> }): ReactElement {
  const [elegida, setElegida] = useState<string>(p.sugerida);
  const [fecha, setFecha] = useState<C.FechaLocal | null>(null);
  const [calendario, setCalendario] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const opciones = [...p.plantillas.map((x) => ({ id: x.id, nombre: x.nombre })), { id: 'otro', nombre: T.otroMensaje }];
  return (
    <section className={css.porMiCuenta} aria-label={T.yaLeEscribi}>
      <span className={css.rotulo}>{T.queLeDijiste}</span>
      <div className={css.plantillas} role="radiogroup" aria-label={T.queLeDijiste}>
        {opciones.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={o.id === elegida} className={cx(css.plantilla, o.id === elegida && css.plantillaActiva)} onClick={() => setElegida(o.id)}>
            {o.nombre}
          </button>
        ))}
      </div>
      <div className={css.filaFecha}>
        <span className={css.fechaNombre}>
          {T.fechaPrometida} {T.opcional}
        </span>
        <button type="button" className={css.fechaValor} aria-expanded={calendario} onClick={() => setCalendario((v) => !v)}>
          {fecha ? formato.fechaConDia(fecha) : T.sinFecha}
          <Icono nombre="CalendarDays" tamano={14} />
        </button>
      </div>
      {calendario ? <SelectorFecha etiqueta={T.fechaPrometida} valor={fecha} min={hoyLocal()} alCambiar={(f) => { setFecha(f); setCalendario(false); }} /> : null}
      <div className={comun.pie}>
        <Boton variante="fantasma" tamano="sm" alPulsar={p.alCancelar}>
          {T.cancelar}
        </Boton>
        <Boton variante="primario" tamano="sm" icono="Check" cargando={ocupado} alPulsar={() => { setOcupado(true); void p.alRegistrar(elegida, fecha).finally(() => setOcupado(false)); }}>
          {T.registrarAviso}
        </Boton>
      </div>
    </section>
  );
}
