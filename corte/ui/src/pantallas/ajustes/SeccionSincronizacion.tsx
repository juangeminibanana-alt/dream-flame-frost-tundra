/**
 * B. Sincronización (01_ux §4.14 B; BUILD_SPEC C4, C23, C36). Solo Windows; en Android muestra la fecha de la copia.
 * - Última sincronización y [Sincronizar ahora] con el paso real en curso (nunca un tiempo estimado inventado).
 * - Automática: 15 / 30 / 60 min / Apagada, 30 por omisión (C36) → AjustesPc.sync_auto + sync_intervalo_min.
 * - Segundo plano e iniciar con Windows → AjustesPc (C23).
 * - Qué tienes en esta PC (CoberturaResponse): etiquetas de dominio.ETIQUETA_PASO_SYNC y «Portadas de videos con foto
 *   {n} de {total}» (C4), con medidores finos para lo parcial.
 * - Opciones avanzadas › [Volver a descargar todo] (revisión completa) e Historial reciente (últimas 10).
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useCapacidades, usePlataforma } from '@/app';
import { BarraProgreso, Boton, Icono, Interruptor, Modal, Segmentado, useToast } from '@/componentes';
import { ETIQUETA_PASO_SYNC, ahoraS, formato } from '@/dominio';
import { ErrorHub, hub, useConexionPc, useConsulta, useSesion, useSync } from '@/datos';
import { cambiosDeIntervalo, cuandoFue, cuandoFueTitulo, duracion, intervaloDe, resumenHistorial, type ValorIntervalo } from './logica';
import { Aviso, CargandoGrupo, Dato, ErrorCarga, FilaLibre, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

const OPCIONES_INTERVALO: { valor: ValorIntervalo; etiqueta: string }[] = [
  { valor: '15', etiqueta: T.sync.opciones['15'] },
  { valor: '30', etiqueta: T.sync.opciones['30'] },
  { valor: '60', etiqueta: T.sync.opciones['60'] },
  { valor: 'apagado', etiqueta: T.sync.opciones.apagado },
];

interface FilaCobertura {
  id: string;
  etiqueta: string;
  valor: string;
  /** 0..1 cuando es parcial (fichas, portadas). */
  fraccion?: number;
  ok: boolean;
  error?: string | null;
}

function filasCobertura(c: C.CoberturaResponse, pasos: C.SyncPaso[]): FilaCobertura[] {
  const n = formato.numero;
  const fallo = (p: C.PasoSync): string | null => {
    const x = pasos.find((y) => y.paso === p);
    return x && (x.estado === 'error' || x.estado === 'parcial') ? T.sync.noSeActualizo : null;
  };
  const fr = (a: number, b: number): number => (b > 0 ? a / b : 1);
  return [
    { id: 'perfil', etiqueta: ETIQUETA_PASO_SYNC.perfil, valor: '', ok: c.perfil, error: fallo('perfil') },
    { id: 'muestras', etiqueta: ETIQUETA_PASO_SYNC.muestras, valor: n(c.muestras), ok: c.muestras > 0, error: fallo('muestras') },
    { id: 'cumplimientos', etiqueta: ETIQUETA_PASO_SYNC.cumplimientos, valor: n(c.cumplimientos), ok: true, error: fallo('cumplimientos') },
    { id: 'productos', etiqueta: ETIQUETA_PASO_SYNC.productos, valor: n(c.productos_con_imagen), ok: true, error: fallo('productos') },
    {
      id: 'ordenes',
      etiqueta: T.sync.ventas,
      valor: c.pedidos_desde ? T.sync.pedidosDesde(n(c.pedidos), formato.fechaCorta(c.pedidos_desde)) : T.sync.pedidos(n(c.pedidos)),
      ok: true,
      error: fallo('ordenes') ?? fallo('ordenes_anteriores'),
    },
    { id: 'vitrina', etiqueta: ETIQUETA_PASO_SYNC.vitrina, valor: c.vitrina === null ? T.sync.vitrinaSinLeer : n(c.vitrina), ok: c.vitrina !== null, error: fallo('vitrina') },
    { id: 'detalles', etiqueta: ETIQUETA_PASO_SYNC.detalles, valor: n(c.detalles), ok: true, error: fallo('detalles') },
    {
      id: 'fichas',
      etiqueta: T.sync.fichas,
      valor: T.sync.deTotal(n(c.fichas_ventas.con_ficha), n(c.fichas_ventas.total)),
      fraccion: fr(c.fichas_ventas.con_ficha, c.fichas_ventas.total),
      ok: c.fichas_ventas.con_ficha >= c.fichas_ventas.total,
      error: fallo('productos_ventas'),
    },
    {
      id: 'portadas',
      etiqueta: T.sync.portadas,
      valor: T.sync.deTotal(n(c.portadas_videos.con_foto), n(c.portadas_videos.total)),
      fraccion: fr(c.portadas_videos.con_foto, c.portadas_videos.total),
      ok: c.portadas_videos.con_foto >= c.portadas_videos.total,
      error: fallo('videos'),
    },
  ];
}

function Cobertura(p: { pasos: C.SyncPaso[] }): ReactElement {
  const cob = useConsulta('sync_cobertura', {});
  if (cob.cargando && !cob.datos) return <CargandoGrupo filas={5} />;
  if (!cob.datos) return <ErrorCarga error={cob.error} alReintentar={() => void cob.refrescar()} />;
  const filas = filasCobertura(cob.datos, p.pasos);
  return (
    <Grupo titulo={T.sync.grupoModulos}>
      <ul className={cx(css.modulos)} aria-label={T.sync.grupoModulos}>
        {filas.map((f) => (
          <li key={f.id} className={cx(css.modulo)} data-modulo={f.id} data-ok={f.ok && !f.error ? '' : undefined}>
            <span className={cx(css.moduloMarca)} aria-hidden="true">
              <Icono nombre={f.error ? 'CircleAlert' : f.ok ? 'Check' : 'Minus'} tamano={14} />
            </span>
            <span className={cx(css.moduloEtiqueta)}>
              {f.etiqueta}
              {f.error ? <span className={cx(css.moduloError)}> · {f.error}</span> : null}
            </span>
            {f.fraccion !== undefined ? (
              <span className={cx(css.moduloMedidor)}>
                <BarraProgreso valor={f.fraccion} etiqueta={`${f.etiqueta}: ${f.valor}`} />
              </span>
            ) : null}
            <span className={cx(css.moduloValor)}>{f.valor}</span>
          </li>
        ))}
      </ul>
    </Grupo>
  );
}

function Historial(): ReactElement {
  const h = useConsulta('sync_historial', { limite: 10 });
  const ahora = ahoraS();
  if (h.cargando && !h.datos) return <CargandoGrupo filas={3} />;
  if (!h.datos) return <ErrorCarga error={h.error} alReintentar={() => void h.refrescar()} />;
  const items = h.datos.items.slice(0, 10);
  return (
    <Grupo titulo={T.sync.grupoHistorial}>
      {items.length === 0 ? (
        <p className={cx(css.vacioGrupo)}>{T.sync.historialVacio}</p>
      ) : (
        <ol className={cx(css.historial)}>
          {items.map((it) => {
            const r = resumenHistorial(it);
            const origen = it.tipo === 'completa' ? T.sync.tipoCompleta : T.sync.origenes[it.origen] ?? '';
            return (
              <li key={it.sync_id} className={cx(css.historialItem)} data-tono={r.tono}>
                <span className={cx(css.historialPunto)} aria-hidden="true" />
                <span className={cx(css.historialTextos)}>
                  <span className={cx(css.historialLinea)}>
                    <span className={cx(css.historialCuando)}>{cuandoFueTitulo(it.iniciada_at, ahora)}</span>
                    <span className={cx(css.historialSep)} aria-hidden="true">
                      ·
                    </span>
                    <span className={cx(css.historialEstado)}>{r.estado}</span>
                    {r.detalle ? (
                      <>
                        <span className={cx(css.historialSep)} aria-hidden="true">
                          ·
                        </span>
                        <span>{r.detalle}</span>
                      </>
                    ) : null}
                  </span>
                  <span className={cx(css.historialMeta)}>
                    {[origen, duracion(it.duracion_s)].filter((x) => x && x !== '').join(' · ')}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Grupo>
  );
}

function SincronizacionAndroid(): ReactElement {
  const pc = useConexionPc();
  const sesion = useSesion();
  const ahora = ahoraS();
  const copia = pc?.ultima_copia_at ?? sesion.copia_at ?? null;
  return (
    <Seccion titulo={T.secciones.sincronizacion.titulo} id="sincronizacion" descripcion={T.sync.androidTexto}>
      <Grupo>
        <Dato etiqueta={T.pc.ultimaCopia} valor={copia ? cuandoFue(copia, ahora) : T.sync.androidSinCopia} />
      </Grupo>
    </Seccion>
  );
}

export function SeccionSincronizacion(): ReactElement {
  const android = usePlataforma() === 'android';
  if (android) return <SincronizacionAndroid />;
  return <SincronizacionWindows />;
}

function SincronizacionWindows(): ReactElement {
  const cap = useCapacidades();
  const toast = useToast();
  const sesion = useSesion();
  const sync = useSync();
  const ajustes = useConsulta('ajustes_pc', {});
  const hist = useConsulta('sync_historial', { limite: 10 });
  const [guardando, setGuardando] = useState<keyof C.AjustesPcCambios | null>(null);
  const [verCompleta, setVerCompleta] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const ahora = ahoraS();

  const estado = sync.estado ?? sesion.datos?.sync ?? null;
  const enCurso = estado?.en_curso === true;
  const ultimaOk = estado?.ultima_ok_at ?? sesion.datos?.datos.ultima_sync_ok_at ?? null;
  const ultimaDur = hist.datos?.items.find((i) => i.estado === 'ok' || i.estado === 'parcial')?.duracion_s ?? null;
  const intervalo = intervaloDe(ajustes.datos);
  const a = ajustes.datos;

  const cambiar = async (cambios: C.AjustesPcCambios, campo: keyof C.AjustesPcCambios): Promise<void> => {
    setGuardando(campo);
    try {
      await hub.ajustesPc(cambios);
    } catch (e) {
      toast.mostrar({ texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico, tono: 'error' });
    } finally {
      setGuardando(null);
    }
  };

  const sincronizar = async (tipo?: C.TipoSync): Promise<void> => {
    setIniciando(true);
    try {
      await sync.sincronizar(tipo);
      toast.mostrar({ texto: tipo === 'completa' ? T.sync.completaIniciada : T.sync.sincronizando, tono: 'info' });
    } catch (e) {
      toast.mostrar({ texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico, tono: 'error' });
    } finally {
      setIniciando(false);
      setVerCompleta(false);
    }
  };

  return (
    <Seccion titulo={T.secciones.sincronizacion.titulo} id="sincronizacion" descripcion={T.sync.descripcion}>
      {/* Estado actual */}
      <div className={cx(css.syncEstado)} data-en-curso={enCurso ? '' : undefined}>
        <div className={cx(css.syncEstadoTextos)}>
          <p className={cx(css.syncUltima)}>
            {ultimaOk ? T.sync.ultima(cuandoFue(ultimaOk, ahora), duracion(ultimaDur)) : T.sync.nunca}
          </p>
          {enCurso && estado ? (
            <div className={cx(css.syncProgreso)}>
              <p className={cx(css.syncPaso)} aria-live="polite">
                {estado.texto}
              </p>
              <BarraProgreso valor={estado.progreso} etiqueta={estado.texto} />
            </div>
          ) : null}
          {!enCurso && estado?.ultimo_error ? (
            <p className={cx(css.syncError)}>
              <Icono nombre="CircleAlert" tamano={16} /> {estado.ultimo_error.mensaje}
            </p>
          ) : null}
        </div>
        <div className={cx(css.syncAcciones)}>
          {enCurso ? (
            <Boton variante="secundario" alPulsar={() => void sync.cancelar()}>
              {T.sync.cancelar}
            </Boton>
          ) : (
            <Boton variante="primario" icono="RefreshCw" cargando={iniciando} deshabilitado={!sync.puede || !cap.sincronizar} alPulsar={() => void sincronizar()}>
              {T.sync.ahora}
            </Boton>
          )}
        </div>
      </div>

      {/* Automática (C36) */}
      {ajustes.cargando && !a ? (
        <CargandoGrupo filas={3} />
      ) : !a ? (
        <ErrorCarga error={ajustes.error} alReintentar={() => void ajustes.refrescar()} />
      ) : (
        <Grupo titulo={T.sync.grupoAuto}>
          <div className={cx(css.fila)} data-control="intervalo">
            <div className={cx(css.filaTextos)}>
              <span className={cx(css.filaEtiqueta)}>{T.sync.intervalo}</span>
              <span className={cx(css.filaDesc)} aria-live="polite">
                {intervalo === 'apagado' ? T.sync.apagada : T.sync.cada(Number(intervalo))}
              </span>
            </div>
          </div>
          <FilaLibre className={cx(css.sinFiletePrevio)}>
            <Segmentado
              opciones={OPCIONES_INTERVALO}
              valor={intervalo}
              etiqueta={T.sync.intervalo}
              anchoCompleto
              className={cx(css.segmentadoIntervalo)}
              alCambiar={(v) => void cambiar(cambiosDeIntervalo(v), 'sync_intervalo_min')}
            />
            {intervalo !== '30' ? <span className={cx(css.notaChica)}>{T.sync.recomendado}</span> : null}
          </FilaLibre>
          <FilaLibre>
            <Interruptor
              etiqueta={T.sync.segundoPlano}
              descripcion={a.segundo_plano === null ? T.sync.segundoPlanoSinElegir : T.sync.segundoPlanoDesc}
              activo={a.segundo_plano === true}
              deshabilitado={guardando === 'segundo_plano'}
              alCambiar={(v) => void cambiar({ segundo_plano: v, ...(v ? {} : { iniciar_con_windows: false }) }, 'segundo_plano')}
            />
          </FilaLibre>
          <FilaLibre>
            <Interruptor
              etiqueta={T.sync.iniciarWindows}
              descripcion={a.iniciar_con_windows_bloqueado ? T.sync.iniciarBloqueado : T.sync.iniciarWindowsDesc}
              activo={a.iniciar_con_windows && !a.iniciar_con_windows_bloqueado}
              deshabilitado={a.iniciar_con_windows_bloqueado || guardando === 'iniciar_con_windows'}
              alCambiar={(v) => void cambiar({ iniciar_con_windows: v, ...(v && a.segundo_plano !== true ? { segundo_plano: true } : {}) }, 'iniciar_con_windows')}
            />
          </FilaLibre>
        </Grupo>
      )}

      <Cobertura pasos={estado?.pasos ?? []} />

      <Grupo titulo={T.sync.grupoAvanzado}>
        <div className={cx(css.fila)}>
          <div className={cx(css.filaTextos)}>
            <span className={cx(css.filaEtiqueta)}>{T.sync.completa}</span>
            <span className={cx(css.filaDesc)}>{T.sync.completaDesc}</span>
          </div>
          <div className={cx(css.filaControl)}>
            <Boton variante="secundario" icono="RotateCcw" deshabilitado={enCurso} alPulsar={() => setVerCompleta(true)}>
              {T.sync.completa}
            </Boton>
          </div>
        </div>
      </Grupo>

      <Historial />

      {estado?.ultimo_error?.codigo === 'reautorizar' ? <Aviso tono="critico">{T.tiktok.vencida}</Aviso> : null}

      <Modal
        abierto={verCompleta}
        titulo={T.sync.completaTitulo}
        alCerrar={() => setVerCompleta(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setVerCompleta(false)}>
              {T.cancelar}
            </Boton>
            <Boton variante="primario" cargando={iniciando} alPulsar={() => void sincronizar('completa')}>
              {T.sync.completa}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.sync.completaTexto}</p>
      </Modal>
    </Seccion>
  );
}
