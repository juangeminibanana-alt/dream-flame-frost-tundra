/**
 * A2. Métricas de tus videos (contrato rev. 5, Display API de TikTok for Developers; notas/pendientes/display_api_contrato.md).
 * Estados (logica.vistaMetricas sobre EstadoDisplay de la consulta 'display'):
 * - sin_configurar: qué hace, que es una app APARTE en modo Sandbox, cómo crearla, y el Client key + Client secret.
 *   El secreto es de tipo password, se manda UNA vez al hub (hub.displayCredenciales) y se borra del estado en cuanto sale;
 *   nunca se registra, nunca se vuelve a mostrar y nunca toca el almacenamiento del navegador.
 * - sin_conectar / reautorizar: [Conectar con TikTok] pide la URL (hub.displayConectar) y la abre con abrirExterno de
 *   @/plataforma (el mismo camino de los enlaces a TikTok de la app). «Autoriza en el navegador y vuelve aquí».
 * - esperando: hasta que llega 'display.cambio' (lo escribe @/datos en la consulta: no hay sondeo) o vence el intento.
 * - conectada: usuario, permisos, última sincronización, [Sincronizar ahora], [Desconectar] con confirmación y
 *   [Cambiar los datos de tu app] (el Client key y el Client secret).
 * - Errores (ultimo_error, ya en español) y permisos faltantes con su acción. En Android: solo informa («Se configura en la PC»).
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { usePlataforma } from '@/app';
import { AvatarCuenta, Boton, BotonIcono, CampoTexto, Casilla, Chip, Icono, Modal, PuntoVivo, useToast, type TonoEstado } from '@/componentes';
import { ahoraS, formato } from '@/dominio';
import { ErrorHub, hub, useConsulta, useSesion, useSync } from '@/datos';
import { abrirExterno, copiarTexto } from '@/plataforma';
import {
  PERMISOS_DISPLAY, cifraCompacta, cuandoFue, cuentaRegresiva, listaPermisosDisplay, nombrePermisoDisplay, revisarClientKey,
  revisarClientSecret, vistaMetricas, type VistaMetricas,
} from './logica';
import { Aviso, CargandoGrupo, Dato, ErrorCarga, Fila, Grupo, ListaChequeo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

const M = T.metricas;

function mensajeError(e: unknown): string {
  return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}

const CHIP: Record<VistaMetricas, { tono: TonoEstado; texto: string }> = {
  sin_configurar: { tono: 'neutro', texto: M.chipSinConfigurar },
  sin_conectar: { tono: 'neutro', texto: M.chipSinConectar },
  esperando: { tono: 'info', texto: M.chipEsperando },
  conectada: { tono: 'ok', texto: M.chipConectada },
  reautorizar: { tono: 'critico', texto: M.chipReautorizar },
};

// ---------------------------------------------------------------------------------------------- formulario de la app

/**
 * Client key + Client secret. El secreto NO entra al estado de React: el campo de contraseña de CampoTexto no es
 * controlado (el atributo `value` del DOM siempre queda vacío) y lo escrito se guarda en una ref de este formulario. Al
 * mandarlo se copia a una constante local, la ref se vacía y viaja una vez al hub; al terminar, el campo se vuelve a
 * montar vacío (`key`). Si el hub lo rechaza, hay que volver a escribirlo (nunca se conserva para «reintentar»).
 */
export function FormularioApp(p: { alGuardado: () => void; autoFoco?: boolean; pie?: (guardar: () => void, guardando: boolean) => ReactElement }): ReactElement {
  const toast = useToast();
  const [clave, setClave] = useState('');
  const secreto = useRef('');
  /** Cambia la `key` del campo del secreto: React lo vuelve a montar vacío. */
  const [vueltaSecreto, setVueltaSecreto] = useState(0);
  const [focoSecreto, setFocoSecreto] = useState(false);
  const [errorClave, setErrorClave] = useState<string | null>(null);
  const [errorSecreto, setErrorSecreto] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const vivo = useRef(true);
  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
      secreto.current = '';
    };
  }, []);

  const guardar = async (): Promise<void> => {
    if (guardando) return;
    const k = revisarClientKey(clave);
    const s = revisarClientSecret(secreto.current);
    setErrorClave(k === 'vacio' ? M.faltaKey : k === 'formato' ? M.formatoKey : null);
    setErrorSecreto(s === 'vacio' ? M.faltaSecret : s === 'formato' ? M.formatoSecret : null);
    setErrorGeneral(null);
    if (k !== null || s !== null) return;
    const enviar: C.CredencialesDisplayRequest = { client_key: clave.trim(), client_secret: secreto.current.trim() };
    secreto.current = ''; // ya no se guarda en la interfaz: solo viaja en esta petición
    setGuardando(true);
    try {
      await hub.displayCredenciales(enviar);
      if (!vivo.current) return;
      setClave('');
      setFocoSecreto(false);
      setVueltaSecreto((n) => n + 1);
      toast.mostrar({ texto: M.guardadas, tono: 'ok' });
      p.alGuardado();
    } catch (e) {
      if (!vivo.current) return;
      const campo = e instanceof ErrorHub ? e.detalle?.['campo'] : undefined;
      if (campo === 'client_key') {
        setErrorClave(mensajeError(e));
        setErrorSecreto(M.reescribeSecret);
      } else if (campo === 'client_secret') {
        setErrorSecreto(mensajeError(e));
      } else {
        setErrorGeneral(mensajeError(e));
        setErrorSecreto(M.reescribeSecret);
      }
      // El campo vuelve vacío; si el problema no es el Client key, con el foco listo para escribir el secreto otra vez.
      setFocoSecreto(campo !== 'client_key');
      setVueltaSecreto((n) => n + 1);
    } finally {
      enviar.client_secret = '';
      if (vivo.current) setGuardando(false);
    }
  };

  const disparar = (): void => void guardar();
  return (
    <div className={cx(css.formularioApp)} data-formulario-display="">
      <CampoTexto etiqueta={M.clientKey} valor={clave} alCambiar={setClave} ayuda={M.clientKeyAyuda} error={errorClave} monoespaciado maximo={64} {...(p.autoFoco ? { autoFoco: true } : {})} alEnter={disparar} />
      <CampoTexto
        key={vueltaSecreto}
        etiqueta={M.clientSecret}
        valor=""
        alCambiar={(v) => {
          secreto.current = v;
        }}
        tipo="password"
        ayuda={M.clientSecretAyuda}
        error={errorSecreto}
        monoespaciado
        maximo={128}
        {...(focoSecreto ? { autoFoco: true } : {})}
        alEnter={disparar}
      />
      {errorGeneral ? (
        <Aviso tono="critico" vivo>
          {errorGeneral}
        </Aviso>
      ) : null}
      {p.pie ? p.pie(disparar, guardando) : (
        <div className={cx(css.acciones)}>
          <Boton variante="primario" icono="Lock" cargando={guardando} alPulsar={disparar}>
            {M.guardar}
          </Boton>
        </div>
      )}
    </div>
  );
}

/** Pasos para crear la app en TikTok for Developers (plegados), con la dirección de regreso copiable. */
function ComoCrear(): ReactElement {
  const toast = useToast();
  return (
    <details className={cx(css.tecnicos)}>
      <summary className={cx(css.tecnicosResumen)}>
        <span>{M.comoCrear}</span>
        <Icono nombre="ChevronDown" tamano={18} className={cx(css.preguntaFlecha)} />
      </summary>
      <div className={cx(css.tecnicosCuerpo)}>
        <ol className={cx(css.pasosApp)}>
          {M.pasos.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <p className={cx(css.redirect)}>
          <code className={cx(css.mono)}>{M.redirect}</code>
          <BotonIcono icono="Copy" etiqueta={M.copiarRedirect} tamano="sm" alPulsar={() => void copiarTexto(M.redirect).then((ok) => ok && toast.mostrar({ texto: M.redirectCopiado, tono: 'ok' }))} />
        </p>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------------------------- piezas del estado

function AvisoError(p: { e: C.EstadoDisplay; vista: VistaMetricas; ahora: C.EpochS; alConectar: () => void; alCambiar: () => void }): ReactElement | null {
  const err = p.e.ultimo_error;
  if (!err) return null;
  if (err.codigo === 'reautorizar' && p.vista === 'reautorizar') return null; // ya lo dice su aviso
  if (err.codigo === 'permiso_faltante' && p.e.scopes_faltantes.length > 0) return null;
  // Conectada y con una sincronización buena después del error: ese error ya pasó.
  const s = p.e.ultima_sync;
  if (p.vista === 'conectada' && s && s.estado === 'ok' && s.at > err.at) return null;
  const pasajero = ['sin_internet', 'limite', 'tiktok_no_disponible', 'respuesta_invalida', 'error_interno'].includes(err.codigo);
  const credenciales = err.codigo === 'credenciales_rechazadas';
  const reconectar = !pasajero && !credenciales && p.vista !== 'conectada';
  const accion = credenciales ? (
    <Boton variante="secundario" tamano="sm" icono="Pencil" alPulsar={p.alCambiar}>{M.cambiarCredenciales}</Boton>
  ) : reconectar ? (
    <Boton variante="primario" tamano="sm" alPulsar={p.alConectar}>{M.conectar}</Boton>
  ) : null;
  return (
    <Aviso tono={pasajero ? 'atencion' : 'critico'} titulo={err.mensaje} acciones={accion} vivo>
      {/* El mensaje del hub ya dice qué revisar: aquí solo cuándo pasó y, si es pasajero, que se reintenta solo. */}
      {[M.errorDesde(formato.relativa(err.at, p.ahora)), pasajero ? M.reintentarLuego : null].filter(Boolean).join(' ')}
    </Aviso>
  );
}

function GrupoSync(p: { e: C.EstadoDisplay; ahora: C.EpochS }): ReactElement {
  const sync = useSync();
  const s = p.e.ultima_sync;
  const enCurso = !!sync.estado?.en_curso;
  const descripcion = s
    ? [
        `${M.estadosSync[s.estado] ?? s.estado} · ${M.resumenSync(formato.numero(s.videos), s.nuevos, s.cambiados)}`,
        s.error?.mensaje ?? null,
        s.estado === 'ok' && !s.completa ? M.syncIncompleta : null,
      ].filter(Boolean).join('. ')
    : M.sinSync;
  return (
    <Grupo titulo={M.grupoSync}>
      <Fila etiqueta={s ? M.ultimaSync(cuandoFue(s.at, p.ahora)) : M.sinSync} {...(s ? { descripcion } : {})} icono="RefreshCw">
        <Boton variante="secundario" icono="RefreshCw" cargando={enCurso} deshabilitado={!sync.puede || enCurso} alPulsar={() => void sync.sincronizar()}>
          {enCurso ? M.sincronizando : M.sincronizar}
        </Boton>
      </Fila>
    </Grupo>
  );
}

function DialogoDesconectar(p: { abierto: boolean; alCerrar: () => void }): ReactElement {
  const toast = useToast();
  const [borrar, setBorrar] = useState(false);
  const [olvidar, setOlvidar] = useState(false);
  const [trabajando, setTrabajando] = useState(false);
  const cerrar = (): void => {
    setBorrar(false);
    setOlvidar(false);
    p.alCerrar();
  };
  const desconectar = async (): Promise<void> => {
    setTrabajando(true);
    try {
      const r = await hub.displayDesconectar({ borrar_datos: borrar, olvidar_app: olvidar });
      toast.mostrar({ texto: r.revocado ? M.desconectada : M.desconectadaSinInternet, tono: r.revocado ? 'ok' : 'info' });
      cerrar();
    } catch (e) {
      toast.mostrar({ texto: mensajeError(e), tono: 'error' });
    } finally {
      setTrabajando(false);
    }
  };
  return (
    <Modal
      abierto={p.abierto}
      titulo={M.desconectarTitulo}
      alCerrar={cerrar}
      pie={
        <>
          <Boton variante="fantasma" alPulsar={cerrar}>{T.cancelar}</Boton>
          <Boton variante="peligro" cargando={trabajando} alPulsar={() => void desconectar()}>{M.desconectar}</Boton>
        </>
      }
    >
      <div className={cx(css.pila)}>
        <p className={cx(css.textoModal)}>{M.desconectarTexto}</p>
        <Casilla marcada={borrar} alCambiar={setBorrar} etiqueta={M.borrarDatos} />
        <Casilla marcada={olvidar} alCambiar={setOlvidar} etiqueta={M.olvidarApp} />
      </div>
    </Modal>
  );
}

function DialogoCambiar(p: { abierto: boolean; alCerrar: () => void; alGuardado: () => void }): ReactElement {
  return (
    <Modal abierto={p.abierto} titulo={M.cambiarTitulo} descripcion={M.cambiarDescripcion} alCerrar={p.alCerrar}>
      {/* Se monta solo abierto (Modal devuelve null cerrado): al cerrarlo, el secreto a medio escribir desaparece. */}
      <FormularioApp
        alGuardado={() => {
          p.alGuardado();
          p.alCerrar();
        }}
        autoFoco
        pie={(guardar, guardando) => (
          <div className={cx(css.acciones)}>
            <Boton variante="fantasma" alPulsar={p.alCerrar}>{T.cancelar}</Boton>
            <Boton variante="primario" icono="Lock" cargando={guardando} alPulsar={guardar}>{M.guardar}</Boton>
          </div>
        )}
      />
    </Modal>
  );
}

// ---------------------------------------------------------------------------------------------- Android

function SoloInformativa(): ReactElement {
  const d30 = useConsulta('dashboard', { periodo: '30d' });
  const usuario = d30.datos?.perfil_tiktok?.username ?? null;
  return (
    <Seccion titulo={T.secciones.metricas.titulo} id="metricas" descripcion={M.descripcion}>
      <Aviso tono="neutro" icono="Monitor" titulo={M.androidTitulo} vivo>
        <span data-solo-pc="">{M.androidTexto}</span>
      </Aviso>
      {usuario ? (
        <Aviso tono="ok" icono="Check">
          {M.androidConectada(usuario)}
        </Aviso>
      ) : null}
    </Seccion>
  );
}

// ---------------------------------------------------------------------------------------------- sección

export function SeccionMetricas(): ReactElement {
  const android = usePlataforma() === 'android';
  return android ? <SoloInformativa /> : <SeccionWindows />;
}

function SeccionWindows(): ReactElement {
  const toast = useToast();
  const sesion = useSesion();
  const consulta = useConsulta('display', {});
  const [pendiente, setPendiente] = useState<{ url: string; expira: C.EpochS } | null>(null);
  const [ignorarPendiente, setIgnorarPendiente] = useState(false);
  const [noAbrio, setNoAbrio] = useState(false);
  const [vencio, setVencio] = useState(false);
  const [conectando, setConectando] = useState(false);
  const [verCambiar, setVerCambiar] = useState(false);
  const [verDesconectar, setVerDesconectar] = useState(false);
  const [ahora, setAhora] = useState(() => ahoraS());

  const e = consulta.datos;
  const pendienteHub = ignorarPendiente ? null : e?.conexion_pendiente?.expira_at ?? null;
  const vista: VistaMetricas | null = e ? vistaMetricas({ ...e, conexion_pendiente: pendienteHub === null ? null : { expira_at: pendienteHub } }, pendiente?.expira ?? null, ahora) : null;

  // Mientras se espera el regreso: un reloj de 1 s para la cuenta regresiva (la conexión llega por 'display.cambio').
  useEffect(() => {
    if (vista !== 'esperando') return;
    const t = setInterval(() => setAhora(ahoraS()), 1000);
    return () => clearInterval(t);
  }, [vista]);

  // Transiciones desde «esperando»: conectada → aviso; vencido sin respuesta → «venció».
  const anterior = useRef<VistaMetricas | null>(null);
  useEffect(() => {
    const previa = anterior.current;
    anterior.current = vista;
    if (previa !== 'esperando' || vista === 'esperando' || vista === null) return;
    if (vista === 'conectada') {
      toast.mostrar({ texto: M.conectadaToast, tono: 'ok' });
      setVencio(false);
    } else if (!e?.ultimo_error || (pendiente && e.ultimo_error.at < pendiente.expira - 600)) {
      setVencio(true);
    }
    setPendiente(null);
    setNoAbrio(false);
  }, [vista, e, pendiente, toast]);

  const titulo = T.secciones.metricas.titulo;
  if (consulta.cargando && !e) {
    return (
      <Seccion titulo={titulo} id="metricas">
        <CargandoGrupo filas={3} />
      </Seccion>
    );
  }
  if (!e || !vista) {
    return (
      <Seccion titulo={titulo} id="metricas">
        <ErrorCarga error={consulta.error} alReintentar={() => void consulta.refrescar()} />
      </Seccion>
    );
  }

  const conectar = async (): Promise<void> => {
    if (conectando) return;
    setConectando(true);
    setVencio(false);
    setNoAbrio(false);
    try {
      const r = await hub.displayConectar({});
      setIgnorarPendiente(false);
      setPendiente({ url: r.url, expira: r.expira_at });
      setAhora(ahoraS());
      // El mismo camino que los demás enlaces a TikTok (lista de hosts de @/plataforma).
      const ok = r.abierto || (await abrirExterno(r.url));
      if (!ok) setNoAbrio(true);
    } catch (err) {
      toast.mostrar({ texto: mensajeError(err), tono: 'error' });
    } finally {
      setConectando(false);
    }
  };
  const abrirOtraVez = (): void => {
    if (!pendiente) {
      void conectar();
      return;
    }
    void abrirExterno(pendiente.url).then((ok) => setNoAbrio(!ok));
  };
  const dejarDeEsperar = (): void => {
    setPendiente(null);
    setIgnorarPendiente(true);
    setNoAbrio(false);
  };
  // Credenciales nuevas: el enlace pendiente lleva el Client key ANTERIOR (el hub ya borró ese intento). Se olvida sin
  // pasar por «venció», para que [Abrir TikTok otra vez] no reabra un enlace que TikTok rechaza con «client_key».
  const credencialesCambiadas = (): void => {
    anterior.current = null;
    dejarDeEsperar();
    setVencio(false);
  };

  const u = e.usuario;
  // Conectada pero con un permiso de menos: el chip no puede decir «Conectada» en verde.
  const chip = vista === 'conectada' && e.scopes_faltantes.length > 0 ? { tono: 'atencion' as const, texto: M.chipFaltaPermiso(e.scopes_faltantes.length) } : CHIP[vista];
  const conCuenta = (vista === 'conectada' || vista === 'reautorizar') && e.conectada;
  const demo = sesion.datos?.modo === 'demo';
  const expira = Math.max(pendiente?.expira ?? 0, pendienteHub ?? 0);

  const botonConectar = (variante: 'primario' | 'secundario', texto: string = M.conectar): ReactElement => (
    <Boton variante={variante} iconoFinal="ExternalLink" cargando={conectando} alPulsar={() => void conectar()}>
      {texto}
    </Boton>
  );

  return (
    <Seccion titulo={titulo} id="metricas" descripcion={M.descripcion}>
      {/* Identidad: la cuenta de TikTok conectada o, sin cuenta, qué falta (con el ícono de la sección, sin avatar). */}
      <div className={cx(css.cuenta)} data-estado-metricas={vista}>
        {conCuenta ? (
          <AvatarCuenta url={null} username={u?.username ?? 'TikTok'} tamano={40} className={cx(css.cuentaAvatar)} />
        ) : (
          <span className={cx(css.pcIcono)} aria-hidden="true">
            <Icono nombre="TrendingUp" tamano={20} />
          </span>
        )}
        <div className={cx(css.cuentaTextos)}>
          <div className={cx(css.cuentaFila)}>
            <span className={cx(css.cuentaNombre)}>{conCuenta && u?.username ? `@${u.username}` : M.titulos[vista]}</span>
            <Chip tono={chip.tono} {...(chip.tono === 'ok' ? { icono: 'Check' as const } : chip.tono === 'critico' ? { icono: 'CircleAlert' as const } : {})}>
              {chip.texto}
            </Chip>
            {conCuenta && u?.verificada ? <Chip tono="info" icono="Check">{M.verificada}</Chip> : null}
          </div>
          <p className={cx(css.cuentaMeta)}>{conCuenta ? u?.nombre ?? M.grupoCuenta : M.queEs}</p>
        </div>
        {conCuenta ? (
          <div className={cx(css.cuentaAcciones)}>
            <Boton variante="peligro" alPulsar={() => setVerDesconectar(true)}>{M.desconectar}</Boton>
          </div>
        ) : null}
      </div>

      {demo && vista === 'conectada' && e.scopes_faltantes.length === 0 ? <Aviso tono="neutro" icono="Info">{M.demo}</Aviso> : null}

      {/* Avisos según el estado */}
      {vista === 'reautorizar' ? (
        <Aviso tono="critico" acciones={botonConectar('primario', M.volverAConectar)} vivo>
          {M.reautorizar}
        </Aviso>
      ) : null}
      {e.scopes_faltantes.length > 0 && conCuenta ? (
        <Aviso tono="atencion" acciones={botonConectar('primario', M.volverAConectar)}>
          {M.faltanPermisos(listaPermisosDisplay(e.scopes_faltantes), e.scopes_faltantes.length)}
        </Aviso>
      ) : null}
      <AvisoError e={e} vista={vista} ahora={ahora} alConectar={() => void conectar()} alCambiar={() => setVerCambiar(true)} />
      {vencio && vista === 'sin_conectar' ? <Aviso tono="atencion" icono="Clock" vivo>{M.vencio}</Aviso> : null}

      {vista === 'sin_configurar' ? (
        <Grupo titulo={M.grupoApp}>
          <ComoCrear />
          <FormularioApp alGuardado={() => setVencio(false)} />
        </Grupo>
      ) : null}

      {vista === 'sin_conectar' ? (
        <Aviso tono="info" icono="ExternalLink" titulo={M.listaParaConectar} acciones={botonConectar('primario')}>
          {M.autorizaYVuelve}
        </Aviso>
      ) : null}

      {vista === 'esperando' ? (
        <Aviso
          tono="info"
          icono="Hourglass"
          titulo={M.esperandoTitulo}
          vivo
          acciones={
            <>
              <Boton variante="secundario" tamano="sm" iconoFinal="ExternalLink" alPulsar={abrirOtraVez}>{M.abrirOtraVez}</Boton>
              <Boton variante="fantasma" tamano="sm" alPulsar={dejarDeEsperar}>{M.dejarDeEsperar}</Boton>
            </>
          }
        >
          <span className={cx(css.esperando)}>
            <PuntoVivo estado="sincronizando" />
            <span>{M.esperandoTexto}</span>
          </span>
          {expira > ahora ? <span className={cx(css.notaChica, css.mono)} data-cuenta-regresiva="">{M.caducaEn(cuentaRegresiva(expira - ahora))}</span> : null}
        </Aviso>
      ) : null}
      {noAbrio && pendiente ? (
        <Aviso
          tono="atencion"
          vivo
          acciones={
            <Boton variante="secundario" tamano="sm" icono="Copy" alPulsar={() => void copiarTexto(pendiente.url).then((ok) => ok && toast.mostrar({ texto: M.enlaceCopiado, tono: 'ok' }))}>
              {M.copiarEnlace}
            </Boton>
          }
        >
          {M.noAbrio}
        </Aviso>
      ) : null}

      {conCuenta && u ? (
        <Grupo titulo={M.grupoCuenta}>
          <div className={cx(css.cifrasPerfil)}>
            {([
              ['seguidores', M.seguidores, u.seguidores],
              ['siguiendo', M.siguiendo, u.siguiendo],
              ['likes', M.likes, u.likes_total],
              ['videos', M.videos, u.videos_total],
            ] as const).filter(([, , valor]) => valor !== null).map(([id, etiqueta, valor]) => (
              <div key={id} className={cx(css.cifraPerfil)}>
                <span className={cx(css.cifraPerfilValor)} title={formato.numero(valor ?? 0)}>{cifraCompacta(valor ?? 0)}</span>
                <span className={cx(css.cifraPerfilEtiqueta)}>{etiqueta}</span>
              </div>
            ))}
          </div>
        </Grupo>
      ) : null}

      {conCuenta && e.scopes.length > 0 ? (
        <Grupo titulo={M.grupoPermisos}>
          <div className={cx(css.filaLibre)}>
            <ListaChequeo items={PERMISOS_DISPLAY.map((s) => ({ id: s, texto: nombrePermisoDisplay(s), ok: e.scopes.includes(s) && !e.scopes_faltantes.includes(s) }))} />
          </div>
        </Grupo>
      ) : null}

      {conCuenta ? <GrupoSync e={e} ahora={ahora} /> : null}

      {e.configurada && vista !== 'sin_configurar' ? (
        <Grupo>
          <Fila etiqueta={M.cambiarCredenciales} descripcion={conCuenta ? M.cambiarDescripcion : M.cambiarSinCuenta} icono="Lock">
            <Boton variante="secundario" icono="Pencil" alPulsar={() => setVerCambiar(true)}>{M.cambiar}</Boton>
          </Fila>
          {conCuenta ? (
            <details className={cx(css.tecnicos)}>
              <summary className={cx(css.tecnicosResumen)}>
                <span>{M.tecnicos}</span>
                <Icono nombre="ChevronDown" tamano={18} className={cx(css.preguntaFlecha)} />
              </summary>
              <div className={cx(css.tecnicosCuerpo)}>
                {e.conectada_at ? <Dato etiqueta={M.conectadaDesde} valor={formato.fechaConDia(e.conectada_at)} /> : null}
                {e.refresh_expira_at ? <Dato etiqueta={M.autorizacionHasta} valor={formato.fechaConDia(e.refresh_expira_at)} /> : null}
                {vista === 'conectada' ? <p className={cx(css.notaChica)}>{M.accesoRenueva}</p> : null}
                <ul className={cx(css.claves)}>
                  {(e.scopes.length > 0 ? e.scopes : [...PERMISOS_DISPLAY]).map((s) => (
                    <li key={s} className={cx(css.mono)}>{s}</li>
                  ))}
                </ul>
              </div>
            </details>
          ) : null}
        </Grupo>
      ) : null}

      <DialogoCambiar abierto={verCambiar} alCerrar={() => setVerCambiar(false)} alGuardado={credencialesCambiadas} />
      <DialogoDesconectar abierto={verDesconectar} alCerrar={() => setVerDesconectar(false)} />
    </Seccion>
  );
}
