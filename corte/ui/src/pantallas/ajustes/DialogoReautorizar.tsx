/**
 * Diálogo de reautorización (01_ux §5.4 A; BUILD_SPEC C35, C37). Lo monta ui-marco con import.meta.glob + lazy y se
 * abre con ?reautorizar=1. 3 pasos en un Modal de 560:
 *  0 (solo si falta) · la clave de la app: [Importar desde archivo…] (elegirArchivo → solo la ruta) o pegarla.
 *  1 · «Abre TikTok Shop»: hub.authLink(true) crea un `state` de un solo uso que vive 10 min (C37) y abre el navegador.
 *  2 · «Pega el enlace de regreso»: campo + [Pegar]. Mientras ESTE diálogo está abierto en el paso 2 (y solo entonces),
 *      se consulta GET /api/auth/portapapeles cada 1.5 s y al volver el foco; si hay un enlace con `state` que coincide:
 *      «Detectamos el enlace de autorización. Conectando…» y se canjea (con [Cancelar]). Errores con los textos de 01.
 *  3 · «Listo»: «¡Listo! Conectado como @…» + permisos con ✓ + «Sincronizando tus datos…». En la primera conexión
 *      (confirmar_cuenta) primero «¿Eres tú?»; solo si confirma se pide la sincronización completa.
 * Android (C35): no reautoriza; muestra el estado y «Para volver a conectar, abre Corte en tu PC › …».
 */
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useCapacidades, useParametro, usePlataforma } from '@/app';
import { AvatarCuenta, Boton, CampoTexto, Icono, Modal, Palomita, useToast } from '@/componentes';
import { ahoraS, textoPermiso } from '@/dominio';
import { ErrorHub, hub, useConsulta, useSesion } from '@/datos';
import { copiarTexto, elegirArchivo } from '@/plataforma';
import { cuentaRegresiva, listaPermisos, revisarEnlace } from './logica';
import { ListaChequeo } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

/** Cada cuánto se revisa el portapapeles mientras el diálogo está en el paso 2 (03 §2.2). */
export const INTERVALO_PORTAPAPELES_MS = 1500;

type AccionError = 'volver_abrir' | 'clave' | 'reintentar' | null;
interface ErrorPaso {
  texto: string;
  accion: AccionError;
}
type Paso =
  | { tipo: 'clave'; error: string | null }
  | { tipo: 'abrir'; error: ErrorPaso | null; nota: string | null }
  | { tipo: 'pegar'; link: C.AuthLinkResponse | null; error: ErrorPaso | null; detectado: boolean; canjeando: boolean }
  | { tipo: 'cambio_cuenta'; entrada: C.AuthCanjearRequest }
  | { tipo: 'cuenta'; resp: C.AuthCanjearResponse }
  | { tipo: 'listo'; resp: C.AuthCanjearResponse };

/** ErrorHub del canje → texto y acción de la tabla «Errores del paso 2» (01 §5.4 A). */
export function errorDeCanje(e: unknown): ErrorPaso | 'cuenta_distinta' {
  const R = T.reauth.errores;
  if (!(e instanceof ErrorHub)) return { texto: R.internet, accion: 'reintentar' };
  switch (e.codigo) {
    case 'state_invalido':
      return { texto: R.state, accion: 'volver_abrir' };
    case 'codigo_vencido':
      return { texto: R.vencido, accion: 'volver_abrir' };
    case 'no_es_creador':
      return { texto: R.noCreador, accion: 'volver_abrir' };
    case 'app_secret_invalido':
      return { texto: R.clave, accion: 'clave' };
    case 'cuenta_distinta':
      return 'cuenta_distinta';
    case 'sin_internet':
    case 'red':
    case 'tiktok_no_disponible':
      return { texto: R.internet, accion: 'reintentar' };
    default:
      return { texto: e.mensaje || T.errorGenerico, accion: 'volver_abrir' };
  }
}

function Pasos(p: { actual: 1 | 2 | 3 }): ReactElement {
  return (
    <ol className={cx(css.pasosReauth)} aria-label={T.reauth.pasoDe(p.actual)}>
      {T.reauth.pasos.map((t, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const estado = n < p.actual ? 'hecho' : n === p.actual ? 'actual' : 'pendiente';
        return (
          <li key={t} className={cx(css.pasoReauth)} data-estado={estado} aria-current={estado === 'actual' ? 'step' : undefined}>
            <span className={cx(css.pasoReauthNumero)} aria-hidden="true">
              {estado === 'hecho' ? <Icono nombre="Check" tamano={14} /> : n}
            </span>
            <span className={cx(css.pasoReauthTexto)}>{t}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Cuenta(p: { cuenta: C.Cuenta | null }): ReactElement | null {
  if (!p.cuenta) return null;
  return (
    <div className={cx(css.cuentaReauth)}>
      <AvatarCuenta url={p.cuenta.avatar} username={p.cuenta.username} tamano={40} />
      <span className={cx(css.cuentaNombre)}>@{p.cuenta.username}</span>
    </div>
  );
}

/** Contenido del diálogo (exportado para las pruebas: se monta abierto sin depender de la URL). */
export function ContenidoReautorizar(p: { alCerrar: () => void }): ReactElement {
  const cap = useCapacidades();
  const toast = useToast();
  const cred = useConsulta('credenciales', {});
  const [paso, setPaso] = useState<Paso>({ tipo: 'abrir', error: null, nota: null });
  const [valor, setValor] = useState('');
  const [clave, setClave] = useState('');
  const [trabajando, setTrabajando] = useState(false);
  const [ahora, setAhora] = useState(ahoraS());
  const tocado = useRef(false);
  const vivo = useRef(true);
  const canjeando = useRef(false);
  const vistaRechazada = useRef<string | null>(null);

  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
    };
  }, []);

  // Paso 0 solo si falta la clave de la app (y el usuario aún no se movió).
  useEffect(() => {
    if (!tocado.current && cred.datos && !cred.datos.app_secret_configurado) setPaso({ tipo: 'clave', error: null });
  }, [cred.datos]);

  const abrir = async (): Promise<void> => {
    tocado.current = true;
    setTrabajando(true);
    try {
      const link = await hub.authLink(true);
      if (!vivo.current) return;
      setValor('');
      vistaRechazada.current = null;
      setPaso({ tipo: 'pegar', link, error: null, detectado: false, canjeando: false });
    } catch (e) {
      if (vivo.current) setPaso({ tipo: 'abrir', error: { texto: e instanceof ErrorHub ? e.mensaje : T.reauth.errores.internet, accion: null }, nota: null });
    } finally {
      if (vivo.current) setTrabajando(false);
    }
  };

  const terminar = useCallback(
    async (resp: C.AuthCanjearResponse): Promise<void> => {
      if (resp.confirmar_cuenta) {
        setPaso({ tipo: 'cuenta', resp });
        return;
      }
      setPaso({ tipo: 'listo', resp });
      try {
        await hub.sincronizar();
      } catch {
        /* El indicador de sincronización avisará si no se pudo. */
      }
    },
    [],
  );

  const canjear = useCallback(
    async (entrada: C.AuthCanjearRequest): Promise<void> => {
      if (canjeando.current) return;
      canjeando.current = true;
      setPaso((x) => (x.tipo === 'pegar' ? { ...x, canjeando: true, detectado: entrada.desde_portapapeles === true, error: null } : x));
      try {
        const resp = await hub.authCanjear(entrada);
        if (vivo.current) await terminar(resp);
      } catch (e) {
        if (!vivo.current) return;
        const r = errorDeCanje(e);
        if (r === 'cuenta_distinta') setPaso({ tipo: 'cambio_cuenta', entrada });
        else setPaso((x) => (x.tipo === 'pegar' ? { ...x, canjeando: false, detectado: false, error: r } : x));
      } finally {
        canjeando.current = false;
      }
    },
    [terminar],
  );

  // Portapapeles: SOLO con el diálogo abierto en el paso 2, cada 1.5 s y al volver el foco a la ventana.
  const enPegar = paso.tipo === 'pegar';
  const pegarCanjeando = paso.tipo === 'pegar' && paso.canjeando;
  useEffect(() => {
    if (!enPegar || pegarCanjeando || !cap.portapapeles) return undefined;
    let activo = true;
    const revisar = async (): Promise<void> => {
      try {
        const r = await hub.authPortapapeles();
        if (!activo || !vivo.current || !r.detectado) return;
        if (r.state_coincide === false) {
          if (vistaRechazada.current === r.vista_previa) return;
          vistaRechazada.current = r.vista_previa;
          setPaso((x) => (x.tipo === 'pegar' ? { ...x, error: { texto: T.reauth.errores.state, accion: 'volver_abrir' } } : x));
          return;
        }
        void canjear({ desde_portapapeles: true });
      } catch {
        /* Sin portapapeles: el usuario puede pegar a mano. */
      }
    };
    const t = setInterval(() => void revisar(), INTERVALO_PORTAPAPELES_MS);
    const alFoco = (): void => void revisar();
    window.addEventListener('focus', alFoco);
    return () => {
      activo = false;
      clearInterval(t);
      window.removeEventListener('focus', alFoco);
    };
  }, [enPegar, pegarCanjeando, cap.portapapeles, canjear]);

  // Cuenta regresiva del `state` (10 min, C37).
  const expira = paso.tipo === 'pegar' ? paso.link?.expira_at ?? null : null;
  useEffect(() => {
    if (expira === null) return undefined;
    const t = setInterval(() => setAhora(ahoraS()), 1000);
    return () => clearInterval(t);
  }, [expira]);
  const restante = expira === null ? null : expira - ahora;
  const vencido = restante !== null && restante <= 0;

  const conectarManual = (): void => {
    const r = revisarEnlace(valor);
    if (r === 'vacio') return;
    if (r === 'cancelado') {
      setPaso((x) => (x.tipo === 'pegar' ? { ...x, error: { texto: T.reauth.errores.cancelado, accion: 'volver_abrir' } } : x));
      return;
    }
    if (r === 'no_es_enlace') {
      setPaso((x) => (x.tipo === 'pegar' ? { ...x, error: { texto: T.reauth.errores.noEsEnlace, accion: null } } : x));
      return;
    }
    void canjear({ url_o_codigo: valor.trim() });
  };

  const pegar = async (): Promise<void> => {
    if (cap.portapapeles) {
      try {
        const r = await hub.authPortapapeles();
        if (r.detectado && r.state_coincide !== false) {
          void canjear({ desde_portapapeles: true });
          return;
        }
      } catch {
        /* sigue con el portapapeles del navegador */
      }
    }
    try {
      const t = await navigator.clipboard?.readText?.();
      if (t) setValor(t.trim());
    } catch {
      /* el navegador no dejó leer: el usuario pega con Ctrl+V */
    }
  };

  const guardarClave = async (): Promise<void> => {
    const c = clave.trim();
    if (c === '') {
      setPaso({ tipo: 'clave', error: T.tiktok.claveVacia });
      return;
    }
    setTrabajando(true);
    try {
      await hub.guardarAppSecret(c);
      setClave('');
      tocado.current = true;
      setPaso({ tipo: 'abrir', error: null, nota: null });
    } catch (e) {
      setPaso({ tipo: 'clave', error: e instanceof ErrorHub && e.codigo === 'app_secret_invalido' ? T.reauth.errores.clave : e instanceof ErrorHub ? e.mensaje : T.errorGenerico });
    } finally {
      setTrabajando(false);
    }
  };
  const importarClave = async (): Promise<void> => {
    const ruta = await elegirArchivo(T.tiktok.tituloElegir, ['json']);
    if (!ruta) return;
    setTrabajando(true);
    try {
      const r = await hub.importarCredenciales({ ruta });
      tocado.current = true;
      if (r.conexion.estado === 'conectada') {
        toast.mostrar({ texto: T.tiktok.importado, tono: 'ok' });
        p.alCerrar();
        return;
      }
      setPaso({ tipo: 'abrir', error: null, nota: null });
    } catch (e) {
      setPaso({ tipo: 'clave', error: e instanceof ErrorHub ? e.mensaje : T.errorGenerico });
    } finally {
      setTrabajando(false);
    }
  };

  const accionError = (a: AccionError): void => {
    if (a === 'volver_abrir') void abrir();
    else if (a === 'clave') setPaso({ tipo: 'clave', error: null });
    else if (a === 'reintentar') conectarManual();
  };
  const etiquetaAccion = (a: AccionError): string | null =>
    a === 'volver_abrir' ? T.reauth.volverAbrir : a === 'clave' ? T.tiktok.pegarClave : a === 'reintentar' ? T.reauth.reintentar : null;

  // ------------------------------------------------------------------ vistas
  if (paso.tipo === 'clave') {
    return (
      <div className={cx(css.reauth)} data-paso="clave">
        <p className={cx(css.parrafo)}>{T.reauth.claveTexto}</p>
        <Boton variante="secundario" icono="Download" cargando={trabajando} alPulsar={() => void importarClave()}>
          {T.tiktok.importar}
        </Boton>
        <CampoTexto etiqueta={T.tiktok.claveEtiqueta} valor={clave} alCambiar={setClave} tipo="password" ayuda={T.tiktok.claveAyuda} error={paso.error} monoespaciado alEnter={() => void guardarClave()} />
        <div className={cx(css.pieReauth)}>
          <Boton variante="fantasma" alPulsar={p.alCerrar}>
            {T.cancelar}
          </Boton>
          <Boton variante="primario" cargando={trabajando} alPulsar={() => void guardarClave()}>
            {T.guardar}
          </Boton>
        </div>
      </div>
    );
  }

  if (paso.tipo === 'abrir') {
    return (
      <div className={cx(css.reauth)} data-paso="1">
        <Pasos actual={1} />
        <p className={cx(css.parrafo)}>{T.reauth.abrirTexto}</p>
        {paso.nota ? <p className={cx(css.notaReauth)}>{paso.nota}</p> : null}
        {paso.error ? (
          <p className={cx(css.errorReauth)} role="alert">
            <Icono nombre="CircleAlert" tamano={16} />
            {paso.error.texto}
          </p>
        ) : null}
        <div className={cx(css.pieReauth)}>
          <Boton variante="fantasma" alPulsar={p.alCerrar}>
            {T.cancelar}
          </Boton>
          <Boton variante="primario" tamano="lg" iconoFinal="ExternalLink" cargando={trabajando} alPulsar={() => void abrir()}>
            {T.reauth.abrir}
          </Boton>
        </div>
      </div>
    );
  }

  if (paso.tipo === 'pegar') {
    const err = vencido ? { texto: T.reauth.errores.vencido, accion: 'volver_abrir' as const } : paso.error;
    const etiqueta = err ? etiquetaAccion(err.accion) : null;
    return (
      <div className={cx(css.reauth)} data-paso="2" data-portapapeles={cap.portapapeles ? 'vigilando' : 'no'}>
        <Pasos actual={2} />
        <p className={cx(css.parrafo)}>{T.reauth.pegarTexto}</p>
        {paso.link && !paso.link.abierto ? (
          <div className={cx(css.notaReauth)}>
            {T.reauth.noAbrio}{' '}
            <Boton
              variante="fantasma"
              tamano="sm"
              icono="Copy"
              alPulsar={() =>
                void copiarTexto(paso.link?.url ?? '').then((ok) => {
                  if (ok) toast.mostrar({ texto: T.reauth.enlaceCopiado, tono: 'ok' });
                })
              }
            >
              {T.reauth.copiarEnlace}
            </Boton>
          </div>
        ) : null}
        {paso.detectado ? (
          <div className={cx(css.detectado)} role="status">
            <span className={cx(css.giradorChico)} aria-hidden="true" />
            <span>{T.reauth.detectado}</span>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => setPaso({ ...paso, detectado: false, canjeando: false })}>
              {T.cancelar}
            </Boton>
          </div>
        ) : (
          <div className={cx(css.campoEnlace)}>
            <CampoTexto etiqueta={T.reauth.campo} valor={valor} alCambiar={setValor} placeholder={T.reauth.placeholder} tipo="url" monoespaciado autoFoco alEnter={conectarManual} className={cx(css.campoEnlaceTexto)} />
            <Boton variante="secundario" icono="Copy" alPulsar={() => void pegar()} className={cx(css.campoEnlaceBoton)}>
              {T.reauth.pegar}
            </Boton>
          </div>
        )}
        {err ? (
          <div className={cx(css.errorReauth)} role="alert">
            <Icono nombre="CircleAlert" tamano={16} />
            <span>{err.texto}</span>
            {etiqueta ? (
              <Boton variante="secundario" tamano="sm" alPulsar={() => accionError(err.accion)}>
                {etiqueta}
              </Boton>
            ) : null}
          </div>
        ) : (
          <p className={cx(css.notaReauth)}>
            {cap.portapapeles ? T.reauth.vigilando : null}
            {restante !== null && restante > 0 ? <span className={cx(css.mono)}> {T.reauth.caducaEn(cuentaRegresiva(restante))}</span> : null}
          </p>
        )}
        <div className={cx(css.pieReauth)}>
          <Boton variante="fantasma" alPulsar={p.alCerrar}>
            {T.cancelar}
          </Boton>
          <Boton variante="primario" cargando={paso.canjeando} deshabilitado={revisarEnlace(valor) === 'vacio' || vencido} alPulsar={conectarManual}>
            {T.reauth.conectar}
          </Boton>
        </div>
      </div>
    );
  }

  if (paso.tipo === 'cambio_cuenta') {
    return (
      <div className={cx(css.reauth)} data-paso="cambio">
        <p className={cx(css.tituloReauth)}>{T.reauth.cambioTitulo}</p>
        <p className={cx(css.parrafo)}>{T.reauth.cambioTexto}</p>
        <div className={cx(css.pieReauth)}>
          <Boton variante="fantasma" alPulsar={p.alCerrar}>
            {T.cancelar}
          </Boton>
          <Boton
            variante="peligro"
            cargando={trabajando}
            alPulsar={() => {
              setTrabajando(true);
              void hub
                .authCanjear({ ...paso.entrada, confirmar_cambio_cuenta: true })
                .then((r) => terminar(r))
                .catch((e: unknown) => {
                  const r = errorDeCanje(e);
                  setPaso({ tipo: 'pegar', link: null, detectado: false, canjeando: false, error: r === 'cuenta_distinta' ? { texto: T.errorGenerico, accion: 'volver_abrir' } : r });
                })
                .finally(() => setTrabajando(false));
            }}
          >
            {T.reauth.cambiar}
          </Boton>
        </div>
      </div>
    );
  }

  if (paso.tipo === 'cuenta') {
    return (
      <div className={cx(css.reauth)} data-paso="eres-tu">
        <Pasos actual={3} />
        <p className={cx(css.tituloReauth)}>{T.reauth.eresTu}</p>
        <Cuenta cuenta={paso.resp.cuenta} />
        <p className={cx(css.parrafo)}>{T.reauth.eresTuTexto}</p>
        <div className={cx(css.pieReauth)}>
          <Boton
            variante="fantasma"
            cargando={trabajando}
            alPulsar={() => {
              setTrabajando(true);
              void hub
                .authDesconectar({ borrar_datos: true })
                .catch(() => undefined)
                .finally(() => {
                  setTrabajando(false);
                  setPaso({ tipo: 'abrir', error: null, nota: T.reauth.noEraTexto });
                });
            }}
          >
            {T.reauth.noSoyYo}
          </Boton>
          <Boton
            variante="primario"
            alPulsar={() => {
              setPaso({ tipo: 'listo', resp: paso.resp });
              void hub.sincronizar('completa').catch(() => undefined);
            }}
          >
            {T.reauth.siSoyYo}
          </Boton>
        </div>
      </div>
    );
  }

  // Paso 3 · Listo
  const resp = paso.resp;
  const faltan = resp.conexion.scopes_faltantes;
  return (
    <div className={cx(css.reauth)} data-paso="3">
      <Pasos actual={3} />
      <div className={cx(css.listoReauth)} role="status">
        <Palomita tamano={48} />
        <p className={cx(css.tituloReauth)}>{resp.cuenta ? T.reauth.listo(resp.cuenta.username) : T.reauth.listoSinNombre}</p>
      </div>
      <ListaChequeo items={[...resp.conexion.scopes.map((s) => ({ id: s, texto: textoPermiso(s), ok: true })), ...faltan.map((s) => ({ id: s, texto: textoPermiso(s), ok: false }))]} />
      {faltan.length > 0 ? <p className={cx(css.errorReauth)}>{T.reauth.faltan(listaPermisos(faltan))}</p> : null}
      <p className={cx(css.notaReauth)}>
        <span className={cx(css.giradorChico)} aria-hidden="true" /> {T.reauth.sincronizando}
      </p>
      <div className={cx(css.pieReauth)}>
        {faltan.length > 0 ? (
          <>
            <Boton variante="fantasma" alPulsar={p.alCerrar}>
              {T.reauth.continuarAsi}
            </Boton>
            <Boton variante="primario" alPulsar={() => void abrir()}>
              {T.reauth.autorizarTodos}
            </Boton>
          </>
        ) : (
          <Boton variante="primario" alPulsar={p.alCerrar}>
            {T.reauth.terminar}
          </Boton>
        )}
      </div>
    </div>
  );
}

/** Android (C35): estado en solo lectura y el texto para reautorizar desde la PC. Sin botón de reautorizar. */
function ContenidoAndroid(p: { alCerrar: () => void }): ReactElement {
  const sesion = useSesion();
  const c = sesion.datos?.conexion;
  return (
    <div className={cx(css.reauth)} data-paso="android">
      <Cuenta cuenta={sesion.datos?.cuenta ?? null} />
      {c?.aviso ? <p className={cx(css.parrafo)}>{c.aviso}</p> : null}
      <p className={cx(css.parrafo)} data-texto-c35="">
        {T.tiktok.androidC35}
      </p>
      <div className={cx(css.pieReauth)}>
        <Boton variante="primario" alPulsar={p.alCerrar}>
          {T.entendido}
        </Boton>
      </div>
    </div>
  );
}

export function DialogoReautorizar(): ReactElement | null {
  const [param, setParam] = useParametro('reautorizar');
  const android = usePlataforma() === 'android';
  const cap = useCapacidades();
  const sesion = useSesion();
  const abierto = param === '1';
  if (!abierto) return null;
  const cerrar = (): void => setParam(null, { reemplazar: true });
  const soloLectura = android || (!cap.auth && sesion.datos?.plataforma === 'android');
  const reautorizar = sesion.datos?.conexion.estado === 'reautorizar';
  return (
    // Diálogo de 560 (01 §5.4 A). Su contenido es corto en los 3 pasos, así que en compacta tampoco va a pantalla
    // completa (eso queda para los flujos largos, como Armar mi plan): se ve como tarjeta centrada sin hueco abajo.
    <Modal abierto titulo={soloLectura ? T.reauth.android : reautorizar ? T.reauth.tituloReautorizar : T.reauth.titulo} ancho={560} alCerrar={cerrar}>
      {soloLectura ? <ContenidoAndroid alCerrar={cerrar} /> : <ContenidoReautorizar alCerrar={cerrar} />}
    </Modal>
  );
}
