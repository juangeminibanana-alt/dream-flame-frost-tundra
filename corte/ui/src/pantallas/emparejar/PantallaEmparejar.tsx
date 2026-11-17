/**
 * #/emparejar · Android A2 / A2' / A3 (01_ux §4.15 y §5.3; lienzo MovilEmparejar.png).
 * - A2: visor de cámara (jsQR en un Web Worker) + la PC encontrada por descubrimiento + el código manual debajo.
 * - A2' (?modo=codigo): solo el código de 12 caracteres (C6) y la dirección (precargada si se descubrió la PC).
 * - A3: número de 4 dígitos de EventoEmparejamiento 'verifica' + [Cancelar].
 * - Errores de EventoEmparejamiento con los textos y acciones de 01 §5.3.
 * Al aprobarse pasa a la Bienvenida A4 («Copiando tus datos…»). Un enlace creatorhub://pair que llega de fuera nunca
 * empareja solo: se pregunta «¿Emparejar con {nombre} ({ip})?» (04 §B.9).
 */
import { useCallback, useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { EnlaceRuta, Pantalla, navegar, useParametro, usePlataforma } from '@/app';
import { Boton, BotonIcono, CampoTexto, Icono, Palomita } from '@/componentes';
import {
  alEnlace, buscarPcs, consumirEnlacePendiente, emparejarConCodigo, emparejarConQr, registrarAtras, vibrar,
  type CodigoErrorEmparejamiento, type EventoEmparejamiento, type PcEncontrada,
} from '@/plataforma';
import { CampoCodigo } from './CampoCodigo';
import { codigoCompleto, esIpPrivada, leerEnlaceEmparejar, type EnlaceEmparejar } from './codigo';
import { errorVisible, etiquetaAccion, type AccionError } from './errores';
import { Visor } from './Visor';
import { T } from './textos';
import css from './Emparejar.module.css';
import { cx } from './clases';

type Fase =
  | { tipo: 'inicio' }
  | { tipo: 'conectando' }
  | { tipo: 'verifica'; numero: string }
  | { tipo: 'aprobado'; equipo: string }
  | { tipo: 'error'; error: CodigoErrorEmparejamiento; mensaje: string; trasVerificar: boolean };

type Intento = { tipo: 'qr'; texto: string } | { tipo: 'codigo'; codigo: string; ip: string | null };

/** Espera breve para que se lea «Conectado» antes de pasar a A4. */
export const ESPERA_APROBADO_MS = 1100;

export function PantallaEmparejar(): ReactElement {
  const plataforma = usePlataforma();
  if (plataforma === 'windows') return <SoloAndroid />;
  return <Emparejar />;
}

function SoloAndroid(): ReactElement {
  return (
    <Pantalla titulo={T.tituloPantalla} lista>
      <div className={cx(css.raiz)} data-vista="solo-android">
        <div className={cx(css.columna)}>
          <div className={cx(css.estadoCentro)}>
            <span className={cx(css.circuloIcono)} aria-hidden="true">
              <Icono nombre="Smartphone" tamano={24} />
            </span>
            <h1 className={cx(css.titulo)}>{T.soloAndroidTitulo}</h1>
            <p className={cx(css.texto)}>{T.soloAndroidTexto}</p>
            <EnlaceRuta a="/ajustes/celular" className={cx(css.enlace)}>
              {T.irACelular}
            </EnlaceRuta>
          </div>
        </div>
      </div>
    </Pantalla>
  );
}

function Emparejar(): ReactElement {
  const [modo, setModo] = useParametro('modo');
  const [desde] = useParametro('desde');
  const soloCodigo = modo === 'codigo';
  const [fase, setFase] = useState<Fase>({ tipo: 'inicio' });
  const [codigo, setCodigo] = useState('');
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);
  const [pcs, setPcs] = useState<PcEncontrada[] | null>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [ipManual, setIpManual] = useState('');
  const [errorIp, setErrorIp] = useState<string | null>(null);
  const [enlace, setEnlace] = useState<EnlaceEmparejar | null>(null);
  const [enlaceInvalido, setEnlaceInvalido] = useState(false);
  const idCodigo = useId();
  const cancelar = useRef<(() => void) | null>(null);
  const vioNumero = useRef(false);
  const ultimo = useRef<Intento | null>(null);
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
      cancelar.current?.();
      cancelar.current = null;
    };
  }, []);

  // Descubrimiento en la red (UDP 39231): precarga la dirección de la PC.
  const buscar = useCallback(() => {
    setPcs(null);
    void buscarPcs()
      .catch(() => [] as PcEncontrada[])
      .then((lista) => {
        if (!vivo.current) return;
        setPcs(lista);
        setElegida((previa) => (previa && lista.some((x) => x.host_id === previa) ? previa : lista[0]?.host_id ?? null));
      });
  }, []);
  useEffect(() => buscar(), [buscar]);

  // Enlaces que llegan de fuera: se confirman, nunca emparejan solos (04 §B.9).
  useEffect(() => {
    const recibir = (url: string): void => {
      const leido = leerEnlaceEmparejar(url);
      setEnlace(leido);
      setEnlaceInvalido(leido === null);
    };
    const pendiente = consumirEnlacePendiente();
    if (pendiente) recibir(pendiente);
    return alEnlace(recibir);
  }, []);

  const alEvento = useCallback((e: EventoEmparejamiento) => {
    if (!vivo.current) return;
    switch (e.fase) {
      case 'conectando':
        setFase({ tipo: 'conectando' });
        return;
      case 'verifica':
        vioNumero.current = true;
        vibrar('umbral');
        setFase({ tipo: 'verifica', numero: e.codigo_verificacion });
        return;
      case 'aprobado':
        cancelar.current = null;
        vibrar('confirmar');
        setFase({ tipo: 'aprobado', equipo: e.nombre_equipo });
        setTimeout(() => {
          if (vivo.current) navegar('/bienvenida?paso=a4', { reemplazar: true });
        }, ESPERA_APROBADO_MS);
        return;
      case 'error':
        cancelar.current = null;
        if (e.error === 'cancelado') {
          setFase({ tipo: 'inicio' });
          return;
        }
        setFase({ tipo: 'error', error: e.error, mensaje: e.mensaje, trasVerificar: vioNumero.current });
        return;
    }
  }, []);

  const lanzar = useCallback(
    (intento: Intento) => {
      cancelar.current?.();
      ultimo.current = intento;
      vioNumero.current = false;
      setFase({ tipo: 'conectando' });
      cancelar.current = intento.tipo === 'qr' ? emparejarConQr(intento.texto, alEvento) : emparejarConCodigo(intento.codigo, intento.ip, alEvento);
    },
    [alEvento],
  );

  const pcElegida = pcs?.find((x) => x.host_id === elegida) ?? null;

  const conectarConCodigo = (): void => {
    if (!codigoCompleto(codigo)) {
      setErrorCodigo(T.faltaCodigo);
      document.getElementById(idCodigo)?.focus();
      return;
    }
    let ip: string | null = pcElegida?.ip ?? null;
    if (!ip) {
      const manual = ipManual.trim();
      if (manual !== '' && !esIpPrivada(manual)) {
        setErrorIp(T.direccionInvalida);
        return;
      }
      ip = manual === '' ? null : manual;
    }
    setErrorIp(null);
    setErrorCodigo(null);
    lanzar({ tipo: 'codigo', codigo, ip });
  };

  const cancelarEnCurso = useCallback(() => {
    cancelar.current?.();
    cancelar.current = null;
    setFase({ tipo: 'inicio' });
  }, []);

  // Atrás del sistema: durante la conexión cancela en lugar de salir.
  useEffect(() => {
    if (fase.tipo !== 'conectando' && fase.tipo !== 'verifica') return undefined;
    return registrarAtras(() => {
      cancelarEnCurso();
      return true;
    });
  }, [fase.tipo, cancelarEnCurso]);

  const volver = (): void => {
    if (fase.tipo === 'conectando' || fase.tipo === 'verifica') {
      cancelarEnCurso();
      return;
    }
    if (soloCodigo) {
      setModo(null, { reemplazar: true });
      return;
    }
    navegar(desde === 'ajustes' ? '/ajustes/celular' : '/bienvenida?paso=a1');
  };

  const accionError = (a: AccionError): void => {
    if (a === 'escanear') {
      setCodigo('');
      setFase({ tipo: 'inicio' });
      setModo(null, { reemplazar: true });
      return;
    }
    if (a === 'reintentar' && ultimo.current) {
      lanzar(ultimo.current);
      return;
    }
    setFase({ tipo: 'inicio' });
  };

  return (
    <Pantalla titulo={T.tituloPantalla} lista>
      <div className={cx(css.raiz)} data-vista="emparejar" data-fase={fase.tipo} data-modo={soloCodigo ? 'codigo' : 'camara'}>
        <div className={cx(css.columna)}>
          <header className={cx(css.barra)}>
            <BotonIcono icono="ChevronLeft" etiqueta={T.atras} variante="secundario" alPulsar={volver} className={cx(css.botonAtras)} />
            <span className={cx(css.barraTitulo)}>{T.tituloPantalla}</span>
          </header>

          <div className={cx(css.cuerpo)} aria-live="polite">
            {fase.tipo === 'inicio' ? (
              <Inicio
                soloCodigo={soloCodigo}
                codigo={codigo}
                setCodigo={(c) => {
                  setCodigo(c);
                  setErrorCodigo(null);
                }}
                errorCodigo={errorCodigo}
                idCodigo={idCodigo}
                pcs={pcs}
                elegida={elegida}
                setElegida={setElegida}
                ipManual={ipManual}
                setIpManual={(v) => {
                  setIpManual(v);
                  setErrorIp(null);
                }}
                errorIp={errorIp}
                alConectar={conectarConCodigo}
                alLeerQr={(texto) => lanzar({ tipo: 'qr', texto })}
                alEscribirCodigo={() => setModo('codigo')}
                alUsarCamara={() => setModo(null, { reemplazar: true })}
                alBuscar={buscar}
                enlace={enlace}
                enlaceInvalido={enlaceInvalido}
                alConfirmarEnlace={() => {
                  if (!enlace) return;
                  const texto = enlace.texto;
                  setEnlace(null);
                  lanzar({ tipo: 'qr', texto });
                }}
                alDescartarEnlace={() => {
                  setEnlace(null);
                  setEnlaceInvalido(false);
                }}
              />
            ) : null}

            {fase.tipo === 'conectando' ? (
              <div className={cx(css.estadoCentro)} data-estado="conectando">
                <span className={cx(css.girador)} aria-hidden="true" />
                <h1 className={cx(css.titulo)}>{T.conectando}</h1>
                <p className={cx(css.texto)}>{T.conectandoTexto}</p>
                <Boton variante="secundario" alPulsar={cancelarEnCurso}>
                  {T.cancelar}
                </Boton>
              </div>
            ) : null}

            {fase.tipo === 'verifica' ? (
              <div className={cx(css.estadoCentro)} data-estado="verifica">
                <div className={cx(css.dispositivos)} aria-hidden="true">
                  <span className={cx(css.dispositivo)}>
                    <Icono nombre="Smartphone" tamano={20} />
                  </span>
                  <span className={cx(css.enlaceDispositivos)} />
                  <span className={cx(css.dispositivo)}>
                    <Icono nombre="Monitor" tamano={20} />
                  </span>
                </div>
                <h1 className={cx(css.titulo)}>{T.tituloA3}</h1>
                <p className={cx(css.numero)} aria-label={T.etiquetaNumero(fase.numero)} data-numero={fase.numero}>
                  {fase.numero.split('').map((d, i) => (
                    <span key={i} className={cx(css.digito)} aria-hidden="true">
                      {d}
                    </span>
                  ))}
                </p>
                <p className={cx(css.texto)}>{T.textoA3}</p>
                <Boton variante="secundario" tamano="lg" anchoCompleto alPulsar={cancelarEnCurso}>
                  {T.cancelar}
                </Boton>
              </div>
            ) : null}

            {fase.tipo === 'aprobado' ? (
              <div className={cx(css.estadoCentro)} data-estado="aprobado" role="status">
                <Palomita tamano={64} />
                <h1 className={cx(css.titulo)}>{T.conectado(fase.equipo)}</h1>
                <p className={cx(css.texto)}>{T.copiando}</p>
              </div>
            ) : null}

            {fase.tipo === 'error' ? <ErrorEmparejamiento fase={fase} alAccion={accionError} /> : null}
          </div>

          <p className={cx(css.seguro)}>
            <Icono nombre="Lock" tamano={16} className={cx(css.seguroIcono)} />
            <span>{T.seguro}</span>
          </p>
        </div>
      </div>
    </Pantalla>
  );
}

function ErrorEmparejamiento(p: { fase: Extract<Fase, { tipo: 'error' }>; alAccion: (a: AccionError) => void }): ReactElement {
  const v = errorVisible(p.fase.error, p.fase.mensaje, p.fase.trasVerificar);
  const etiqueta = etiquetaAccion(v.accion);
  return (
    <div className={cx(css.estadoCentro)} data-estado="error" data-error={p.fase.error} role="alert">
      <span className={cx(css.circuloIcono, css.circuloAtencion)} aria-hidden="true">
        <Icono nombre="CircleAlert" tamano={24} />
      </span>
      <h1 className={cx(css.titulo)}>{T.tituloError}</h1>
      <p className={cx(css.texto)}>{v.texto}</p>
      {v.ayuda ? <p className={cx(css.ayudaError)}>{v.ayuda}</p> : null}
      <div className={cx(css.accionesError)}>
        {etiqueta ? (
          <Boton variante="primario" anchoCompleto tamano="lg" alPulsar={() => p.alAccion(v.accion)}>
            {etiqueta}
          </Boton>
        ) : null}
        <Boton variante="fantasma" anchoCompleto alPulsar={() => p.alAccion(null)}>
          {T.cancelar}
        </Boton>
      </div>
    </div>
  );
}

function TarjetaPc(p: { pc: PcEncontrada; varias: boolean; activa: boolean; conBoton: boolean; alElegir: () => void; alConectar: () => void }): ReactElement {
  return (
    <div className={cx(css.tarjetaPc)} data-activa={p.activa ? '' : undefined} data-pc={p.pc.host_id}>
      <span className={cx(css.iconoPc)} aria-hidden="true">
        <Icono nombre="Monitor" tamano={20} />
      </span>
      {p.varias ? (
        <button type="button" role="radio" aria-checked={p.activa} className={cx(css.textoPcBoton)} onClick={p.alElegir}>
          <span className={cx(css.nombrePc)}>{p.pc.nombre_equipo}</span>
          <span className={cx(css.detallePc)}>
            {p.pc.ip} · {T.mismoWifi}
          </span>
        </button>
      ) : (
        <span className={cx(css.textoPc)}>
          <span className={cx(css.nombrePc)}>{T.encontramos}</span>
          <span className={cx(css.detallePc)}>
            {p.pc.nombre_equipo} · {T.mismoWifi}
          </span>
        </span>
      )}
      {p.activa && p.conBoton ? (
        <Boton variante="primario" tamano="md" alPulsar={p.alConectar} className={cx(css.botonPc)}>
          {T.conectar}
        </Boton>
      ) : p.activa ? (
        <Icono nombre="CircleCheckBig" tamano={20} etiqueta={T.pcElegida} className={cx(css.marcaPc)} />
      ) : null}
    </div>
  );
}

function Inicio(p: {
  soloCodigo: boolean;
  codigo: string;
  setCodigo: (c: string) => void;
  errorCodigo: string | null;
  idCodigo: string;
  pcs: PcEncontrada[] | null;
  elegida: string | null;
  setElegida: (id: string) => void;
  ipManual: string;
  setIpManual: (v: string) => void;
  errorIp: string | null;
  alConectar: () => void;
  alLeerQr: (texto: string) => void;
  alEscribirCodigo: () => void;
  alUsarCamara: () => void;
  alBuscar: () => void;
  enlace: EnlaceEmparejar | null;
  enlaceInvalido: boolean;
  alConfirmarEnlace: () => void;
  alDescartarEnlace: () => void;
}): ReactElement {
  const listo = codigoCompleto(p.codigo);
  const nombreEnlace = p.enlace ? (p.pcs?.find((x) => x.host_id === p.enlace?.hostId)?.nombre_equipo ?? T.enlaceTuPc) : '';
  const varias = (p.pcs?.length ?? 0) > 1;

  return (
    <>
      <div className={cx(css.intro)}>
        <h1 className={cx(css.titulo)}>{p.soloCodigo ? T.tituloA2b : T.tituloA2}</h1>
        {p.soloCodigo ? (
          <p className={cx(css.texto)}>{T.textoA2b}</p>
        ) : (
          <p className={cx(css.texto)}>
            {T.textoA2Antes}
            <b className={cx(css.ruta)}>{T.textoA2Ruta}</b>
            {T.textoA2Despues}
          </p>
        )}
      </div>

      {p.enlace ? (
        <div className={cx(css.tarjetaPc, css.tarjetaEnlace)} data-enlace="">
          <span className={cx(css.iconoPc)} aria-hidden="true">
            <Icono nombre="Link" tamano={20} />
          </span>
          <span className={cx(css.textoPc)}>
            <span className={cx(css.nombrePc)}>{T.enlaceTitulo(nombreEnlace, p.enlace.direcciones[0] ?? '')}</span>
            <span className={cx(css.detallePc)}>{T.enlaceTexto}</span>
          </span>
          <span className={cx(css.accionesEnlace)}>
            <Boton variante="primario" tamano="sm" alPulsar={p.alConfirmarEnlace}>
              {T.emparejar}
            </Boton>
            <Boton variante="fantasma" tamano="sm" alPulsar={p.alDescartarEnlace}>
              {T.cancelar}
            </Boton>
          </span>
        </div>
      ) : null}
      {p.enlaceInvalido ? (
        <p className={cx(css.avisoEnlace)} role="alert">
          {T.errores.enlaceInvalido}
        </p>
      ) : null}

      {p.soloCodigo ? null : <Visor alLeer={p.alLeerQr} alEscribirCodigo={p.alEscribirCodigo} activo />}

      {p.pcs === null ? (
        <p className={cx(css.buscando)} role="status">
          <span className={cx(css.giradorChico)} aria-hidden="true" />
          {T.buscandoPc}
        </p>
      ) : p.pcs.length > 0 ? (
        <div className={cx(css.pcs)} role={varias ? 'radiogroup' : undefined} aria-label={varias ? T.encontramosVarias : undefined}>
          {varias ? <p className={cx(css.etiquetaCampo)}>{T.encontramosVarias}</p> : null}
          {p.pcs.map((x) => (
            // En A2' el botón grande de abajo conecta: la tarjeta solo dice a qué PC (sin un segundo «Conectar»).
            <TarjetaPc key={x.host_id} pc={x} varias={varias} activa={x.host_id === p.elegida} conBoton={!p.soloCodigo} alElegir={() => p.setElegida(x.host_id)} alConectar={p.alConectar} />
          ))}
        </div>
      ) : null}

      <CampoCodigo
        id={p.idCodigo}
        valor={p.codigo}
        alCambiar={p.setCodigo}
        etiqueta={p.soloCodigo ? T.etiquetaCodigo : T.sinCamara}
        error={p.errorCodigo}
        grande={p.soloCodigo}
        autoFoco={p.soloCodigo}
        alCompletar={p.alConectar}
      />

      {p.pcs !== null && p.pcs.length === 0 ? (
        <div className={cx(css.manual)} data-sin-pc="">
          <p className={cx(css.ayudaCampo)}>
            {T.noEncontramos}{' '}
            <button type="button" className={cx(css.enlaceBoton)} onClick={p.alBuscar}>
              {T.buscarOtraVez}
            </button>
          </p>
          <CampoTexto
            etiqueta={T.etiquetaDireccion}
            valor={p.ipManual}
            alCambiar={p.setIpManual}
            placeholder="192.168.1.20"
            ayuda={T.ayudaDireccion}
            error={p.errorIp}
            monoespaciado
            alEnter={p.alConectar}
          />
          <Boton variante="primario" tamano="lg" anchoCompleto deshabilitado={!listo} alPulsar={p.alConectar}>
            {T.conectar}
          </Boton>
        </div>
      ) : null}

      {p.soloCodigo && p.pcs !== null && p.pcs.length > 0 ? (
        <Boton variante="primario" tamano="lg" anchoCompleto deshabilitado={!listo} alPulsar={p.alConectar}>
          {T.conectar}
        </Boton>
      ) : null}

      {p.soloCodigo ? (
        <Boton variante="fantasma" icono="Camera" alPulsar={p.alUsarCamara}>
          {T.usarCamara}
        </Boton>
      ) : null}
    </>
  );
}
