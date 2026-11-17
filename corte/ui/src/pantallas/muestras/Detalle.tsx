/**
 * Contenido del Detalle de muestra (01 §4.3, 02 §7.12), el mismo en el panel de 480 (Windows ≥ 1280) y a pantalla
 * completa (Android y ventanas angostas): chips («TikTok:», «Tu avance:», promesa), precio (FichaPrecio), «Tu avance»
 * con sus pasos, «TikTok dice», «Para tu video» (Copiar datos para tu guion, Guardar imagen), «Ventas de este
 * producto» (TarjetaVentasProducto A/B/C), «Esta tienda contigo», «Mensaje a la tienda» con la plantilla sugerida
 * (EditorMensaje) y los avisos enviados, recordatorios, notas, historial, otras muestras de la tienda, datos técnicos
 * y el aviso de conflicto de C26 con [Ver].
 */
import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { EnlaceRuta, navegar, useAtajos, usePlataforma } from '@/app';
import {
  BotonCopiarGuion, BotonGuardarImagen, ChipAvance, ChipCopiadoSinConfirmar, ChipPromesa, ChipTikTok, ChipVitrina, ChipsRazones, EditorMensaje,
  FichaPrecio, ListaNotas, TarjetaVentasProducto, useControlMuestra,
} from '@/bloques';
import { Boton, BotonIcono, CampoTexto, Foto, Icono, Menu, SelectorFechaHora, Tarjeta, Hoja, useToast, type OpcionMenu } from '@/componentes';
import { useAcciones, useConsulta } from '@/datos';
import {
  ahoraS, epochDeFecha, ETIQUETA_ETAPA, ETIQUETA_GRUPO, etiquetaTipoMuestra, formato, hoyLocal, nombreCorto, nuevoId, sumarDias, textoDatosGuion,
} from '@/dominio';
import { abrirExterno, abrirTikTok, copiarTexto, guardarImagen } from '@/plataforma';
import { avisosEnviados, nombreDe, pasosAvance, pendientesDeTienda, planVivo, recibidaAprox } from './logica';
import { rutaDetalle, rutaTienda } from './rutas';
import { T } from './textos';
import { cx } from './util';
import css from './Detalle.module.css';

export type ModoDetalle = 'panel' | 'completo';

/** Ids de las plantillas predeterminadas de 01 §4.8 (PlantillaMensaje.id) que decide «¿Un solo mensaje…?». */
const PLANTILLA_VARIAS = 'varias_muestras';
const PLANTILLA_UNA = 'disculpa_y_fecha';

/** Conflicto de C26: la versión vigente del hub que llegó con un 409 o en OpsResultado.objeto. */
export function useConflicto(): { vigente: C.ObjetoLocal | null; anotar: (r: { estado: string; objeto: unknown }) => boolean; limpiar: () => void } {
  const [vigente, setVigente] = useState<C.ObjetoLocal | null>(null);
  const anotar = useCallback((r: { estado: string; objeto: unknown }): boolean => {
    if (r.estado !== 'conflicto') return false;
    if (r.objeto && typeof r.objeto === 'object') setVigente(r.objeto as C.ObjetoLocal);
    return true;
  }, []);
  const limpiar = useCallback(() => setVigente(null), []);
  return { vigente, anotar, limpiar };
}

function resumenVigente(o: C.ObjetoLocal): string[] {
  if ('estado' in o && 'fecha_plan' in o) {
    const plan = o;
    return [
      `${T.datoEtapa}: ${ETIQUETA_ETAPA[plan.estado]}`,
      ...(plan.fecha_plan ? [`${T.datoPlaneada}: ${formato.fechaConDia(plan.fecha_plan)}`] : []),
      ...(plan.nombre_corto ? [`${T.nombreEtiqueta}: ${plan.nombre_corto}`] : []),
    ];
  }
  if ('vence_at' in o) return [o.titulo, T.recordatorioVence(`${formato.fechaConDia(o.vence_at)}, ${formato.hora(o.vence_at)}`)];
  if ('solicitud_ids' in o) return [o.plantilla_id, ...Object.values(o.compromisos).map((f) => T.avisoPromesa(formato.fechaConDia(f)))];
  if ('texto' in o && 'entidad' in o) return [o.texto];
  return [];
}

/** «Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.» [Ver]. */
export function AvisoConflicto(p: { vigente: C.ObjetoLocal; alCerrar: () => void }): ReactElement {
  const [ver, setVer] = useState(false);
  const lineas = resumenVigente(p.vigente);
  return (
    <div className={cx(css.conflicto)} role="status">
      <Icono nombre="Info" tamano={18} />
      <div className={cx(css.conflictoTextos)}>
        <p className={cx(css.conflictoTexto)}>{T.conflicto}</p>
        {ver && lineas.length > 0 ? (
          <div className={cx(css.conflictoVersion)}>
            <span className={cx(css.overline)}>{T.versionPc}</span>
            <ul>
              {lineas.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <Boton variante="fantasma" tamano="sm" alPulsar={() => setVer((v) => !v)}>
        {ver ? T.ocultar : T.ver}
      </Boton>
      <BotonIcono icono="X" etiqueta={T.cerrar} tamano="sm" alPulsar={p.alCerrar} />
    </div>
  );
}

function Bloque(p: { titulo: string; children: ReactNode; caja?: boolean; accion?: ReactNode; id?: string; className?: string }): ReactElement {
  const cabeza = (
    <div className={cx(css.bloqueCabeza)}>
      <h3 className={cx(css.bloqueTitulo)}>{p.titulo}</h3>
      {p.accion ?? null}
    </div>
  );
  if (p.caja) {
    return (
      <Tarjeta padding="normal" className={cx(css.bloqueCaja, p.className)}>
        <section aria-label={p.titulo} id={p.id} className={cx(css.bloqueInterno)}>
          {cabeza}
          {p.children}
        </section>
      </Tarjeta>
    );
  }
  return (
    <section aria-label={p.titulo} id={p.id} className={cx(css.bloque, p.className)}>
      {cabeza}
      {p.children}
    </section>
  );
}

// ------------------------------------------------------------------------------------------------ encabezado
/** Nombre que se muestra: el nombre corto que puso el usuario (PlanVideo.nombre_corto) o el del producto. */
export function nombreVisible(m: C.MuestraVista, detalle: C.MuestraDetalleResponse | undefined): string {
  const plan = detalle ? planVivo(m, detalle.planes) : null;
  return plan?.nombre_corto?.trim() || nombreDe(m);
}

export function Rotulo(p: { m: C.MuestraVista; conTienda: boolean }): ReactElement {
  const pos = p.m.posicion_cola;
  return (
    <p className={cx(css.overline)}>
      {pos !== null ? T.posicion(pos) : ETIQUETA_GRUPO[p.m.grupo]}
      {/* En el panel con poco alto (foto en miniatura) la tienda se oculta aquí: ya va en la línea de la tienda. */}
      {p.conTienda ? <span className={cx(css.rotuloTienda)}>{` · ${p.m.tienda.nombre}`}</span> : null}
    </p>
  );
}

/** Título (H2) con ✎ «Editar nombre corto» y «Ver título completo» (01 §4.3 punto 1). */
export function TituloEditable(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse | undefined; nivel: 'h1' | 'h2'; alConflicto: (r: { estado: string; objeto: unknown }) => boolean }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const [editando, setEditando] = useState(false);
  const [completo, setCompleto] = useState(false);
  const nombre = nombreVisible(p.m, p.detalle);
  const [valor, setValor] = useState(nombre);
  const Etiqueta = p.nivel;
  const tituloLargo = p.m.producto.titulo;

  const guardar = async (): Promise<void> => {
    const nuevo = valor.trim();
    setEditando(false);
    if (!nuevo || nuevo === nombre) return;
    const plan = p.detalle ? planVivo(p.m, p.detalle.planes) : null;
    const r = plan
      ? await acciones.editarPlan(plan.id, { nombre_corto: nuevo, rev: plan.rev })
      : await acciones.crearPlan({
          id: nuevoId(),
          titulo: nombreCorto(p.m.producto.titulo),
          application_id: p.m.application_id,
          product_id: p.m.producto.product_id,
          tienda_key: p.m.tienda.tienda_key,
          estado: p.m.avance.etapa,
          nombre_corto: nuevo,
        });
    if (p.alConflicto(r)) return;
    if (r.estado === 'error') toast.mostrar({ texto: T.noSePudo, tono: 'error' });
    else toast.mostrar({ texto: T.nombreGuardado, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
  };

  return (
    <div className={cx(css.titulo)}>
      {editando ? (
        <div className={cx(css.tituloEdicion)}>
          <CampoTexto etiqueta={T.nombreEtiqueta} valor={valor} alCambiar={setValor} placeholder={T.nombrePlaceholder} maximo={60} autoFoco alEnter={() => void guardar()} />
          <div className={cx(css.tituloEdicionAcciones)}>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => setEditando(false)}>
              {T.cancelar}
            </Boton>
            <Boton variante="secundario" tamano="sm" alPulsar={() => void guardar()}>
              {T.guardar}
            </Boton>
          </div>
        </div>
      ) : (
        <div className={cx(css.tituloFila)}>
          <Etiqueta className={cx(css.tituloTexto)}>{nombre}</Etiqueta>
          <BotonIcono
            icono="Pencil"
            etiqueta={T.editarNombre}
            tamano="sm"
            alPulsar={() => {
              setValor(nombre);
              setEditando(true);
            }}
          />
        </div>
      )}
      {tituloLargo && tituloLargo !== nombre ? (
        <>
          <button type="button" className={cx(css.enlaceTexto)} aria-expanded={completo} onClick={() => setCompleto((c) => !c)}>
            {completo ? T.ocultarTituloCompleto : T.verTituloCompleto}
          </button>
          {completo ? <p className={cx(css.tituloCompleto)}>{tituloLargo}</p> : null}
        </>
      ) : null}
    </div>
  );
}

export function LineaTienda(p: { m: C.MuestraVista }): ReactElement {
  return (
    <p className={cx(css.lineaTienda)}>
      <EnlaceRuta a={rutaTienda(p.m.tienda.tienda_key)} className={cx(css.enlaceTienda)}>
        {p.m.tienda.nombre}
      </EnlaceRuta>
      {p.m.variante ? <span className={cx(css.atenuado)}> · {p.m.variante}</span> : null}
    </p>
  );
}

// ------------------------------------------------------------------------------------------------ teclado
/** `I` = Guardar imagen del producto · `N` = Ir a notas (01 §3.6, en el detalle de Windows). */
export function useAtajosDetalle(m: C.MuestraVista, nombre: string, alNotas: () => void, activo: boolean): void {
  useAtajos(
    [
      {
        teclas: 'i',
        descripcion: T.guardarImagen,
        accion: () => {
          if (m.producto.imagen) void guardarImagen(m.producto.imagen, `${nombre}.jpg`);
        },
      },
      { teclas: 'n', descripcion: T.irANotas, accion: alNotas },
    ],
    activo,
  );
}

// ------------------------------------------------------------------------------------------------ menú ⋯
export function useMenuMuestra(m: C.MuestraVista, alNotas?: () => void): OpcionMenu[] {
  const control = useControlMuestra();
  const plataforma = usePlataforma();
  const toast = useToast();
  return useMemo((): OpcionMenu[] => {
    const enlace = m.producto.enlace;
    const conFecha = m.avance.fecha_planeada !== null;
    const opciones: OpcionMenu[] = [
      { id: 'planear', etiqueta: conFecha ? T.menuMover : T.menuPlanear, icono: 'CalendarDays', alPulsar: () => void (conFecha ? control.moverDia(m) : control.planear(m)) },
      { id: 'listo', etiqueta: T.menuVideoListo, icono: 'Clapperboard', alPulsar: () => void control.cambiarEtapa(m, 'video_listo') },
      { id: 'vincular', etiqueta: T.menuVincular, icono: 'Link', alPulsar: () => void control.vincularVideo(m) },
      { id: 'avisar', etiqueta: T.avisarTienda, icono: 'MessageCircle', alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }) },
      {
        id: 'imagen',
        etiqueta: T.guardarImagen,
        icono: 'Download',
        deshabilitado: m.producto.imagen === null,
        alPulsar: () => {
          if (m.producto.imagen) void guardarImagen(m.producto.imagen, `${nombreDe(m)}.jpg`);
        },
      },
      {
        id: 'guion',
        etiqueta: T.copiarGuion,
        icono: 'Copy',
        alPulsar: () => {
          void copiarTexto(textoDatosGuion(m)).then((ok) => toast.mostrar({ texto: ok ? T.guionCopiado : T.noSePudoCopiar, tono: ok ? 'ok' : 'error' }));
        },
      },
      {
        id: 'tiktok',
        etiqueta: plataforma === 'android' ? T.abrirTikTokAndroid : T.abrirTikTokWindows,
        icono: 'ExternalLink',
        deshabilitado: enlace === null,
        alPulsar: () => {
          if (!enlace) return;
          void (plataforma === 'android' ? abrirTikTok(enlace) : abrirExterno(enlace));
        },
      },
      { id: 'tienda', etiqueta: T.menuVerTienda, icono: 'Store', alPulsar: () => navegar(rutaTienda(m.tienda.tienda_key)) },
      ...(alNotas ? [{ id: 'nota', etiqueta: T.agregarNota, icono: 'Pencil' as const, alPulsar: alNotas }] : []),
      { id: 'fijar', etiqueta: m.avance.fijada ? T.menuQuitarFijar : T.menuFijar, icono: 'Pin', alPulsar: () => void control.fijar(m, !m.avance.fijada) },
      { id: 'no', etiqueta: T.menuNoPuedo, icono: 'Ban', peligro: true, alPulsar: () => void control.noSePuede(m) },
    ];
    return opciones;
  }, [m, control, plataforma, toast, alNotas]);
}

// ------------------------------------------------------------------------------------------------ secciones
function TuAvance(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse | undefined; programo: boolean; children?: ReactNode }): ReactElement {
  const plan = p.detalle ? planVivo(p.m, p.detalle.planes) : null;
  const pasos = pasosAvance(p.m, p.programo, plan);
  const etapa = p.m.avance.etapa;
  const promesa = p.m.avisos.promesa;
  return (
    <Bloque titulo={T.tuAvance} accion={<span className={cx(css.bloqueMeta)}>{ETIQUETA_ETAPA[etapa]}</span>} caja>
      {promesa ? (
        <p className={cx(css.promesa, p.m.avisos.promesa_vencida && css.promesaVencida)}>
          <Icono nombre="CalendarClock" tamano={16} />
          {T.promesa(formato.fechaConDia(promesa))}
        </p>
      ) : null}
      {etapa === 'no_se_puede' ? (
        <p className={cx(css.texto)}>{T.decidisteNo}</p>
      ) : (
        <ol className={cx(css.pasos)} aria-label={T.etapas} style={{ gridTemplateColumns: `repeat(${pasos.length}, minmax(0, 1fr))` }}>
          {pasos.map((x) => (
            <li key={x.etapa} className={cx(css.paso)} data-hecho={x.hecho ? '' : undefined} data-actual={x.actual ? '' : undefined} data-etapa={x.etapa} aria-current={x.actual ? 'step' : undefined}>
              <span className={cx(css.pasoBarra)} aria-hidden="true" />
              <span className={cx(css.pasoNombre)}>{ETIQUETA_ETAPA[x.etapa]}</span>
              {x.fecha !== null ? <span className={cx(css.pasoFecha)}>{formato.fechaCorta(x.fecha)}</span> : null}
            </li>
          ))}
        </ol>
      )}
      {p.m.avance.vinculo_origen === 'confirmado_por_tiktok' ? (
        <p className={cx(css.confirmado)}>
          <Icono nombre="Check" tamano={16} />
          {T.confirmadoTikTok}
        </p>
      ) : null}
      {p.children}
    </Bloque>
  );
}

function TikTokDice(p: { m: C.MuestraVista }): ReactElement {
  const { m } = p;
  const explicacion = (() => {
    if (m.grupo === 'por_vencer') return T.explicacion.por_vencer(m.fecha_limite_at !== null ? `${formato.fechaLarga(m.fecha_limite_at)}, ${formato.hora(m.fecha_limite_at)}` : '—');
    if (m.grupo === 'sin_envio') return m.subestado === 'tienda_no_envio' ? T.explicacion.sin_envio_tienda : `${T.explicacion.sin_envio} ${m.motivo}.`;
    const e = T.explicacion[m.grupo];
    return typeof e === 'string' ? e : '';
  })();
  const recibida = recibidaAprox(m);
  const etiquetable = m.prioridad !== 'no_se_puede_etiquetar';
  return (
    <Bloque titulo={T.tiktokDice}>
      <div className={cx(css.chips)}>
        <ChipTikTok muestra={m} conMotivo />
      </div>
      <p className={cx(css.texto)}>{explicacion}</p>
      <dl className={cx(css.datos)}>
        <div>
          <dt>{T.datoSolicitada}</dt>
          <dd>{m.solicitada_at !== null ? T.solicitadaValor(formato.fechaCorta(m.solicitada_at), formato.haceDias(m.solicitada_at)) : T.solicitadaPorVerificar}</dd>
        </div>
        {m.fecha_limite_at !== null && (m.grupo === 'por_vencer' || m.grupo === 'en_revision') ? (
          <div>
            <dt>{T.datoVence}</dt>
            <dd>{`${formato.fechaConDia(m.fecha_limite_at)}, ${formato.hora(m.fecha_limite_at)}`}</dd>
          </div>
        ) : null}
        {recibida ? (
          <div>
            <dt>{T.datoRecibida}</dt>
            <dd>{formato.fechaCorta(recibida)}</dd>
          </div>
        ) : null}
        <div>
          <dt>{T.datoTipo}</dt>
          <dd>{etiquetaTipoMuestra(m.tipo)}</dd>
        </div>
        {m.grupo === 'por_vencer' || m.grupo === 'vencida' || m.grupo === 'pausada' ? (
          <div>
            <dt>{T.datoProducto}</dt>
            <dd>{etiquetable ? T.seEtiqueta : m.motivo || T.noSeEtiqueta}</dd>
          </div>
        ) : null}
      </dl>
    </Bloque>
  );
}

function ParaTuVideo(p: { m: C.MuestraVista }): ReactElement {
  const [desc, setDesc] = useState(false);
  return (
    <Bloque titulo={T.paraTuVideo}>
      {/* Lado a lado si caben con su texto completo; si no, uno debajo del otro (nunca se salen ni se cortan). */}
      <div className={cx(css.botonesVideo)}>
        <BotonCopiarGuion muestra={p.m} className={cx(css.botonBloque)} />
        <BotonGuardarImagen producto={p.m.producto} className={cx(css.botonBloque)} />
      </div>
      {p.m.producto.titulo ? (
        <>
          <button type="button" className={cx(css.enlaceTexto)} aria-expanded={desc} onClick={() => setDesc((d) => !d)}>
            {desc ? T.ocultarDescripcion : T.verDescripcion}
          </button>
          {desc ? <p className={cx(css.tituloCompleto)}>{p.m.producto.titulo}</p> : null}
        </>
      ) : null}
    </Bloque>
  );
}

function Cifras(p: { m: C.MuestraVista }): ReactElement {
  const v = p.m.ventas_producto;
  const global = p.m.producto.unidades_vendidas_global;
  return (
    <div className={cx(css.cifras)}>
      <FichaPrecio producto={p.m.producto} className={cx(css.fichaPrecio)} />
      <div className={cx(css.stats)}>
        <div className={cx(css.stat)}>
          <span className={cx(css.statValor)}>{formato.numero(v.videos)}</span>
          <span className={cx(css.statRotulo)}>{T.videosProducto}</span>
        </div>
        <div className={cx(css.stat)}>
          <span className={cx(css.statValor)}>{global !== null ? formato.numero(global) : '—'}</span>
          <span className={cx(css.statRotulo)}>{T.vendidosGlobalCorto}</span>
        </div>
      </div>
    </div>
  );
}

function EstaTienda(p: { m: C.MuestraVista }): ReactElement | null {
  const tienda = useConsulta('tienda', { key: p.m.tienda.tienda_key });
  const t = tienda.datos?.tienda;
  if (!t) return null;
  return (
    <Bloque titulo={T.estaTienda} caja accion={<EnlaceRuta a={rutaTienda(t.tienda_key)} className={cx(css.enlaceAccion)}>{T.verTienda}</EnlaceRuta>}>
      <div className={cx(css.statsTienda)}>
        <div className={cx(css.stat)}>
          <span className={cx(css.statValor)}>{formato.dinero(t.ventas.comision_estimada_centavos)}</span>
          <span className={cx(css.statRotulo)}>{T.comisionTienda}</span>
        </div>
        <div className={cx(css.stat)}>
          <span className={cx(css.statValor)}>{formato.numero(t.ventas.pedidos_validos)}</span>
          <span className={cx(css.statRotulo)}>{T.pedidosTienda}</span>
        </div>
        <div className={cx(css.stat)}>
          <span className={cx(css.statValor)}>{formato.numero(t.muestras.pendientes)}</span>
          <span className={cx(css.statRotulo)}>{T.sinVideoTienda}</span>
        </div>
      </div>
      <p className={cx(css.porque)}>{t.salud_porque}</p>
    </Bloque>
  );
}

function MensajeTienda(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse; cola: readonly C.MuestraVista[]; alConflicto: (r: { estado: string; objeto: unknown }) => boolean }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const deLaTienda = useMemo(() => {
    const desdeCola = pendientesDeTienda(p.m, p.cola);
    if (desdeCola.length > 1) return desdeCola.map((x) => x.application_id);
    const otras = p.detalle.otras_de_la_tienda.filter((x) => x.grupo === 'por_vencer' || x.grupo === 'vencida' || x.grupo === 'pausada').map((x) => x.application_id);
    return [p.m.application_id, ...otras];
  }, [p.m, p.cola, p.detalle]);
  const [juntas, setJuntas] = useState<boolean | null>(null);
  // Mientras no contesta «¿Un solo mensaje para las dos?», el editor sigue la sugerencia del hub: con «Varias muestras»
  // ya incluye las de la tienda (antes mostraba esa plantilla con una sola muestra). Al contestar, la plantilla sigue a la
  // respuesta: «Solo esta» → «Disculpa y fecha»; «Sí, un mensaje» → «Varias muestras».
  const sugerida = p.detalle.plantilla_sugerida;
  const variasSugerida = sugerida === PLANTILLA_VARIAS;
  const incluirTodas = deLaTienda.length > 1 && (juntas ?? variasSugerida);
  const solicitudes = incluirTodas ? deLaTienda : [p.m.application_id];
  const plantilla = juntas === true && !variasSugerida ? PLANTILLA_VARIAS : juntas === false && variasSugerida ? PLANTILLA_UNA : sugerida;
  const enviados = avisosEnviados(p.detalle.avisos);

  const quitar = async (a: C.AvisoTienda): Promise<void> => {
    const r = await acciones.editarAviso(a.id, { quitado_at: ahoraS(), rev: a.rev });
    if (p.alConflicto(r)) return;
    if (r.estado === 'error') toast.mostrar({ texto: T.noSePudo, tono: 'error' });
    else toast.mostrar({ texto: T.avisoQuitado, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
  };

  return (
    <Bloque titulo={T.mensajeTienda} caja id="mensaje-tienda">
      <ChipCopiadoSinConfirmar avisos={p.m.avisos} />
      {deLaTienda.length > 1 && juntas === null ? (
        <div className={cx(css.pregunta)}>
          <p className={cx(css.texto)}>{T.unSoloMensaje(p.m.tienda.nombre, deLaTienda.length)}</p>
          <div className={cx(css.preguntaAcciones)}>
            <Boton variante="secundario" tamano="sm" alPulsar={() => setJuntas(true)}>
              {T.siUnMensaje}
            </Boton>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => setJuntas(false)}>
              {T.soloEsta}
            </Boton>
          </div>
        </div>
      ) : null}
      <EditorMensaje
        key={`${plantilla}:${solicitudes.join(',')}`}
        tiendaKey={p.m.tienda.tienda_key}
        solicitudes={solicitudes}
        plantillaInicial={plantilla}
        modo="dialogo"
        className={cx(css.editor)}
      />
      {enviados.length > 0 ? (
        <div className={cx(css.subBloque)}>
          <h4 className={cx(css.subTitulo)}>{T.avisosEnviados}</h4>
          <ul className={cx(css.listaSimple)}>
            {enviados.map((a) => {
              const promesa = a.compromisos[p.m.application_id] ?? null;
              return (
                <li key={a.id} className={cx(css.filaAviso)}>
                  <span className={cx(css.filaAvisoTexto)}>
                    {T.avisoLinea(formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at), a.plantilla_id === 'otro' ? T.porMiCuenta : etiquetaPlantilla(a.plantilla_id))}
                    {promesa ? ` · ${T.avisoPromesa(formato.fechaConDia(promesa))}` : ''}
                  </span>
                  <Menu etiqueta={T.opcionesAviso} opciones={[{ id: 'quitar', etiqueta: T.quitarAviso, icono: 'Trash2', peligro: true, alPulsar: () => void quitar(a) }]} />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </Bloque>
  );
}

/** Nombre visible de una plantilla predeterminada (01 §4.8); las del usuario muestran su id tal cual. */
export function etiquetaPlantilla(id: string): string {
  return T.plantillas[id as keyof typeof T.plantillas] ?? id;
}

function Recordatorios(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse; alConflicto: (r: { estado: string; objeto: unknown }) => boolean }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const [hoja, setHoja] = useState(false);
  // Por omisión: mañana a las 10:00 a. m. (hora de México, UTC−6 fija).
  const manana = epochDeFecha(sumarDias(hoyLocal(), 1), 10, 0);
  const [cuando, setCuando] = useState<C.EpochS>(manana);
  const activos = p.detalle.recordatorios.filter((r) => r.estado === 'activo').sort((a, b) => a.vence_at - b.vence_at);

  const crear = async (): Promise<void> => {
    setHoja(false);
    const r = await acciones.crearRecordatorio({ id: nuevoId(), titulo: T.tituloRecordatorio(nombreDe(p.m)), vence_at: cuando, entidad: 'muestra', entidad_id: p.m.application_id });
    if (p.alConflicto(r)) return;
    toast.mostrar(r.estado === 'error' ? { texto: T.noSePudo, tono: 'error' } : { texto: T.recordatorioCreado, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
  };
  const hecho = async (rec: C.Recordatorio): Promise<void> => {
    const r = await acciones.editarRecordatorio(rec.id, { estado: 'hecho', rev: rec.rev });
    if (p.alConflicto(r)) return;
    toast.mostrar(r.estado === 'error' ? { texto: T.noSePudo, tono: 'error' } : { texto: T.recordatorioHecho, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
  };

  return (
    <Bloque
      titulo={T.recordatorios}
      accion={
        <Boton variante="fantasma" tamano="sm" icono="Bell" alPulsar={() => setHoja(true)}>
          {T.agregarRecordatorio}
        </Boton>
      }
    >
      {activos.length === 0 ? (
        <p className={cx(css.vacio)}>{T.sinRecordatorios}</p>
      ) : (
        <ul className={cx(css.listaSimple)}>
          {activos.map((r) => (
            <li key={r.id} className={cx(css.filaAviso)}>
              <span className={cx(css.filaAvisoTexto)}>
                <Icono nombre="Bell" tamano={16} /> {r.titulo} · {T.recordatorioVence(`${formato.fechaConDia(r.vence_at)}, ${formato.hora(r.vence_at)}`)}
              </span>
              <BotonIcono icono="Check" etiqueta={T.recordatorioListo} tamano="sm" alPulsar={() => void hecho(r)} />
            </li>
          ))}
        </ul>
      )}
      <Hoja
        abierta={hoja}
        titulo={T.cuandoRecordatorio}
        alCerrar={() => setHoja(false)}
        pie={
          <Boton variante="primario" anchoCompleto alPulsar={() => void crear()}>
            {T.guardar}
          </Boton>
        }
      >
        <div className={cx(css.hojaCuerpo)}>
          <SelectorFechaHora etiqueta={T.cuandoRecordatorio} valor={cuando} alCambiar={setCuando} min={ahoraS()} />
        </div>
      </Hoja>
    </Bloque>
  );
}

function Historial(p: { detalle: C.MuestraDetalleResponse }): ReactElement {
  const items = [...p.detalle.historial].sort((a, b) => b.at - a.at);
  return (
    <Bloque titulo={T.historial}>
      {items.length === 0 ? (
        <p className={cx(css.vacio)}>{T.sinHistorial}</p>
      ) : (
        <ol className={cx(css.historial)}>
          {items.map((h, i) => (
            <li key={`${h.campo}-${h.at}-${i}`}>
              <span className={cx(css.historialFecha)}>{formato.fechaCorta(h.at)}</span>
              <span>
                {T.campoHistorial[h.campo]}: {h.antes ?? '—'} <Icono nombre="ArrowRight" tamano={14} /> {h.despues ?? '—'}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Bloque>
  );
}

function OtrasDeLaTienda(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse; alAbrir?: (id: string) => void }): ReactElement | null {
  const otras = p.detalle.otras_de_la_tienda;
  if (otras.length === 0) return null;
  return (
    <Bloque titulo={T.otrasTienda(p.m.tienda.nombre)}>
      <ul className={cx(css.otras)}>
        {otras.map((o) => {
          const nombre = o.producto.titulo_corto ?? nombreCorto(o.producto.titulo);
          return (
            <li key={o.application_id}>
              <EnlaceRuta a={rutaDetalle(o.application_id)} className={cx(css.otra)} reemplazar>
                <Foto url={o.producto.imagen} alt={nombre} anchoCss={48} tienda={p.m.tienda.nombre} categoria={o.producto.categoria} radio="sm" className={cx(css.otraFoto)} />
                <span className={cx(css.otraTextos)}>
                  <span className={cx(css.otraNombre)}>{nombre}</span>
                  <span className={cx(css.atenuado)}>{o.etiqueta}</span>
                </span>
              </EnlaceRuta>
            </li>
          );
        })}
      </ul>
    </Bloque>
  );
}

/** «hoy, 6:04 p. m.» o «12 nov, 6:04 p. m.» (01 §4.3 punto 8). */
function cuandoSync(t: C.EpochS | null | undefined): string {
  if (t === null || t === undefined) return T.sinActualizar;
  return formato.fechaCorta(t) === formato.fechaCorta(ahoraS()) ? T.hoyHora(formato.hora(t)) : `${formato.fechaCorta(t)}, ${formato.hora(t)}`;
}

function DatosTecnicos(p: { m: C.MuestraVista }): ReactElement {
  const toast = useToast();
  const sesion = useConsulta('sesion', {});
  const copiar = (texto: string): void => {
    void copiarTexto(texto).then((ok) => toast.mostrar({ texto: ok ? T.copiado : T.noSePudoCopiar, tono: ok ? 'ok' : 'error', duracion_ms: 2500 }));
  };
  // 01 §4.3 punto 8 pide también el SKU: MuestraVista no lo trae (contrato congelado; ver faltantes de la entrega).
  const filas: Array<[string, string, boolean]> = [
    [T.idSolicitud, p.m.application_id, true],
    [T.idProducto, p.m.producto.product_id, true],
    [T.categoria, p.m.producto.categoria ?? '—', false],
    [T.estadoApi, [p.m.estado_api, p.m.cumplimiento].filter(Boolean).join(' · '), false],
    [T.filtros, p.m.filtros_que_la_devolvieron.join(', ') || '—', false],
  ];
  return (
    <details className={cx(css.tecnicos)}>
      <summary className={cx(css.tecnicosResumen)}>
        <Icono nombre="ChevronRight" tamano={16} className={cx(css.tecnicosFlecha)} />
        {T.datosTecnicos}
      </summary>
      <dl className={cx(css.datos)}>
        {filas.map(([k, v, mono]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd className={mono ? css.mono : undefined}>
              {v}
              {mono ? <BotonIcono icono="Copy" etiqueta={`${T.copiar} ${k}`} tamano="sm" alPulsar={() => copiar(v)} /> : null}
            </dd>
          </div>
        ))}
        {p.m.producto.enlace ? (
          <div>
            <dt>{T.enlaceProducto}</dt>
            <dd className={cx(css.mono)}>
              <span className={cx(css.cortado)}>{p.m.producto.enlace}</span>
              <BotonIcono icono="Copy" etiqueta={`${T.copiar} ${T.enlaceProducto}`} tamano="sm" alPulsar={() => copiar(p.m.producto.enlace ?? '')} />
            </dd>
          </div>
        ) : null}
        <div>
          <dt>{T.ultimaActualizacion}</dt>
          <dd>{cuandoSync(sesion.datos?.datos.ultima_sync_ok_at)}</dd>
        </div>
      </dl>
    </details>
  );
}

// ------------------------------------------------------------------------------------------------ cuerpo
export interface CuerpoDetalleProps {
  m: C.MuestraVista;
  detalle: C.MuestraDetalleResponse | undefined;
  modo: ModoDetalle;
  cola: readonly C.MuestraVista[];
  /** Fila de acciones bajo «Tu avance» (panel: Copiar/Guardar; completo: acción + Avisar). */
  accionesAvance?: ReactNode;
  /** Celular: el chip «TikTok:» ya va sobre la foto (lienzo MovilMuestra.png); en el resto encabeza la fila de chips. */
  tiktokEnFoto?: boolean;
  alConflicto: (r: { estado: string; objeto: unknown }) => boolean;
}

export function CuerpoDetalle(p: CuerpoDetalleProps): ReactElement {
  const { m, detalle } = p;
  const preferencias = useConsulta('preferencias', {});
  const programo = preferencias.datos?.programo_mis_videos ?? false;
  const compacto = p.modo === 'panel';
  return (
    <div className={cx(compacto ? css.cuerpoPanel : css.cuerpoCompleto)}>
      <div className={cx(css.chips)}>
        {p.tiktokEnFoto ? null : <ChipTikTok muestra={m} />}
        <ChipAvance avance={m.avance} />
        <ChipPromesa avisos={m.avisos} etapa={m.avance.etapa} />
        <ChipVitrina enVitrina={m.producto.en_vitrina} />
        <ChipsRazones muestra={m} maximo={2} />
      </div>
      <Cifras m={m} />
      <TuAvance m={m} detalle={detalle} programo={programo}>
        {p.accionesAvance}
      </TuAvance>
      <TikTokDice m={m} />
      <ParaTuVideo m={m} />
      {detalle ? <TarjetaVentasProducto detalle={detalle} /> : null}
      <EstaTienda m={m} />
      {detalle ? <MensajeTienda m={m} detalle={detalle} cola={p.cola} alConflicto={p.alConflicto} /> : null}
      {detalle ? <Recordatorios m={m} detalle={detalle} alConflicto={p.alConflicto} /> : null}
      <section id="notas-muestra" className={cx(css.bloque)} aria-label={T.notas}>
        <ListaNotas entidad="muestra" entidadId={m.application_id} titulo={T.notas} />
      </section>
      {detalle ? <Historial detalle={detalle} /> : null}
      {detalle ? <OtrasDeLaTienda m={m} detalle={detalle} /> : null}
      <DatosTecnicos m={m} />
    </div>
  );
}
