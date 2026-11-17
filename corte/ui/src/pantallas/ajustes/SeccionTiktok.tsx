/**
 * A. TikTok Shop (01_ux §4.14 A). Dos cosas separadas: «Clave de la app (Partner Center)» y «Autorización de tu cuenta».
 * Windows: estado, permisos (dominio.textoPermiso), [Reautorizar] → DialogoReautorizar (?reautorizar=1, lo monta
 * ui-marco), [Importar desde archivo…] con elegirArchivo → hub.importarCredenciales({ruta}) (solo la ruta viaja al hub,
 * C46), [Pegar clave de la app] (campo enmascarado que nunca se vuelve a mostrar) y [Desconectar] con su confirmación.
 * Android (C35): SOLO LECTURA, con el texto «Para volver a conectar, abre Corte en tu PC › …» y sin botones.
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useCapacidades, useParametro, usePlataforma } from '@/app';
import { AvatarCuenta, Boton, CampoTexto, Chip, Icono, Modal, useToast, type TonoEstado } from '@/componentes';
import { ahoraS, formato, textoPermiso } from '@/dominio';
import { ErrorHub, hub, useConsulta, useSesion } from '@/datos';
import { elegirArchivo } from '@/plataforma';
import { diasParaVencer, estadoTiktok, listaPermisos, type EstadoTiktok } from './logica';
import { Aviso, CargandoGrupo, Dato, ErrorCarga, Grupo, ListaChequeo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

const PERMISOS_ESPERADOS = [
  'creator.affiliate.info',
  'creator.affiliate_collaboration.read',
  'creator.showcase.read',
  'creator.showcase.write',
  'creator.affiliate.link.write',
] as const;

function chipDe(e: EstadoTiktok): { tono: TonoEstado; texto: string } {
  switch (e) {
    case 'conectado':
    case 'vence_pronto':
    case 'faltan_permisos':
      return { tono: e === 'conectado' ? 'ok' : 'atencion', texto: T.tiktok.chipConectado };
    case 'vencida':
      return { tono: 'critico', texto: T.tiktok.chipReautorizar };
    case 'sin_region':
      return { tono: 'critico', texto: T.tiktok.chipSinRegion };
    default:
      return { tono: 'neutro', texto: T.tiktok.chipSinConectar };
  }
}

function mensajeError(e: unknown): string {
  return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}

/** Botones de clave: [Importar desde archivo…] y [Pegar clave de la app]. Exportado para las pruebas. */
export function useAccionesClave(): {
  importar: () => Promise<void>;
  importando: boolean;
  resultado: C.ImportarResponse | null;
  error: string | null;
  limpiar: () => void;
} {
  const toast = useToast();
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<C.ImportarResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const importar = async (): Promise<void> => {
    setError(null);
    const ruta = await elegirArchivo(T.tiktok.tituloElegir, ['json']);
    if (!ruta) return;
    setImportando(true);
    try {
      // Solo la RUTA viaja al hub (C46): el hub valida y lee el archivo; nunca devuelve su contenido.
      const r = await hub.importarCredenciales({ ruta });
      setResultado(r);
      toast.mostrar({ texto: r.importado.access_token ? T.tiktok.importado : T.tiktok.importadoClave, tono: 'ok' });
    } catch (e) {
      setError(mensajeError(e));
    } finally {
      setImportando(false);
    }
  };
  return { importar, importando, resultado, error, limpiar: () => setResultado(null) };
}

export function DialogoClave(p: { abierto: boolean; alCerrar: () => void; alGuardar?: () => void }): ReactElement | null {
  const toast = useToast();
  const [valor, setValor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const cerrar = (): void => {
    setValor('');
    setError(null);
    p.alCerrar();
  };
  const guardar = async (): Promise<void> => {
    const clave = valor.trim();
    if (clave === '') {
      setError(T.tiktok.claveVacia);
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await hub.guardarAppSecret(clave);
      setValor('');
      toast.mostrar({ texto: T.tiktok.claveGuardadaToast, tono: 'ok' });
      p.alGuardar?.();
      p.alCerrar();
    } catch (e) {
      setError(e instanceof ErrorHub && e.codigo === 'app_secret_invalido' ? T.reauth.errores.clave : mensajeError(e));
    } finally {
      setGuardando(false);
    }
  };
  return (
    <Modal
      abierto={p.abierto}
      titulo={T.tiktok.claveTitulo}
      descripcion={T.tiktok.claveDescripcion}
      alCerrar={cerrar}
      pie={
        <>
          <Boton variante="fantasma" alPulsar={cerrar}>
            {T.cancelar}
          </Boton>
          <Boton variante="primario" cargando={guardando} alPulsar={() => void guardar()}>
            {T.guardar}
          </Boton>
        </>
      }
    >
      <CampoTexto etiqueta={T.tiktok.claveEtiqueta} valor={valor} alCambiar={setValor} tipo="password" ayuda={T.tiktok.claveAyuda} error={error} monoespaciado autoFoco alEnter={() => void guardar()} />
    </Modal>
  );
}

export function SeccionTiktok(): ReactElement {
  const android = usePlataforma() === 'android';
  const cap = useCapacidades();
  const puedeAutorizar = !android && cap.auth;
  const sesion = useSesion();
  const cred = useConsulta('credenciales', {}, { activa: puedeAutorizar });
  const [, setReauth] = useParametro('reautorizar');
  const toast = useToast();
  const clave = useAccionesClave();
  const [verClave, setVerClave] = useState(false);
  const [verDesconectar, setVerDesconectar] = useState(false);
  const [desconectando, setDesconectando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  const titulo = android ? T.secciones.tiktok.tituloAndroid : T.secciones.tiktok.titulo;
  if (sesion.cargando && !sesion.datos) {
    return (
      <Seccion titulo={titulo} id="tiktok">
        <CargandoGrupo filas={3} />
      </Seccion>
    );
  }
  if (!sesion.datos) {
    return (
      <Seccion titulo={titulo} id="tiktok">
        <ErrorCarga error={sesion.error} alReintentar={() => void sesion.refrescar()} />
      </Seccion>
    );
  }

  const { cuenta, conexion } = sesion.datos;
  const ahora = ahoraS();
  const estado = estadoTiktok(conexion, puedeAutorizar ? cred.datos ?? null : null, ahora);
  const chip = chipDe(estado);
  const dias = diasParaVencer(conexion.refresh_expira_at, ahora);
  const reautorizar = (): void => setReauth('1');
  const conectada = conexion.estado === 'conectada' || conexion.estado === 'reautorizar';
  // «Se renueva sola… vigente hasta» solo si de verdad está vigente (vencida: lo contradiría).
  const vigente = estado === 'conectado' || estado === 'vence_pronto' || estado === 'faltan_permisos';

  const desconectar = async (): Promise<void> => {
    setDesconectando(true);
    try {
      await hub.authDesconectar({});
      toast.mostrar({ texto: T.tiktok.desconectado, tono: 'ok' });
      setVerDesconectar(false);
    } catch (e) {
      toast.mostrar({ texto: mensajeError(e), tono: 'error' });
    } finally {
      setDesconectando(false);
    }
  };

  const borrarAnterior = async (): Promise<void> => {
    setBorrando(true);
    try {
      const r = await hub.borrarLegado();
      toast.mostrar({ texto: r.resultado === 'papelera' ? T.datos.anteriorEnPapelera : T.datos.anteriorNoExiste, tono: 'ok' });
      clave.limpiar();
    } catch (e) {
      toast.mostrar({ texto: mensajeError(e), tono: 'error' });
    } finally {
      setBorrando(false);
    }
  };

  const botonesClave = puedeAutorizar ? (
    <>
      <Boton variante="secundario" icono="Download" cargando={clave.importando} alPulsar={() => void clave.importar()}>
        {T.tiktok.importar}
      </Boton>
      <Boton variante="secundario" icono="Lock" alPulsar={() => setVerClave(true)}>
        {T.tiktok.pegarClave}
      </Boton>
    </>
  ) : null;

  // ------------------------------------------------------------------ aviso principal según el estado
  let aviso: ReactElement | null = null;
  if (estado === 'vence_pronto' && dias !== null) {
    aviso = (
      <Aviso tono="atencion" icono="Clock" acciones={puedeAutorizar ? <Boton variante="primario" tamano="sm" alPulsar={reautorizar}>{T.tiktok.reautorizar}</Boton> : null}>
        {T.tiktok.venceEn(dias)}
      </Aviso>
    );
  } else if (estado === 'vencida') {
    // Un solo aviso con el texto de 01 §4.14 A. Conexion.aviso (incluido el de C42, «quizá porque el panel anterior…»)
    // ya lo muestra el banner P0 global de ui-marco arriba de todas las pantallas: aquí no se repite.
    aviso = (
      <Aviso tono="critico" acciones={puedeAutorizar ? <Boton variante="primario" tamano="sm" alPulsar={reautorizar}>{T.tiktok.reautorizarAhora}</Boton> : null}>
        {T.tiktok.vencida}
      </Aviso>
    );
  } else if (estado === 'faltan_permisos') {
    aviso = (
      <Aviso tono="atencion" acciones={puedeAutorizar ? <Boton variante="primario" tamano="sm" alPulsar={reautorizar}>{T.tiktok.reautorizar}</Boton> : null}>
        {T.tiktok.faltanPermisos(listaPermisos(conexion.scopes_faltantes))}
      </Aviso>
    );
  } else if (estado === 'falta_clave') {
    aviso = (
      <Aviso tono="atencion" icono="Lock" acciones={botonesClave}>
        {T.tiktok.faltaClave}
      </Aviso>
    );
  } else if (estado === 'sin_autorizar') {
    aviso = (
      <Aviso tono="info" acciones={puedeAutorizar ? <Boton variante="primario" tamano="sm" alPulsar={reautorizar}>{T.tiktok.conectar}</Boton> : null}>
        {T.tiktok.sinAutorizar}
      </Aviso>
    );
  } else if (estado === 'sin_region') {
    aviso = <Aviso tono="critico">{T.tiktok.sinRegion}</Aviso>;
  }

  const permisos = PERMISOS_ESPERADOS.map((s) => ({ id: s, texto: textoPermiso(s), ok: conexion.scopes.includes(s) && !conexion.scopes_faltantes.includes(s) }));
  const extras = conexion.scopes.filter((s) => !(PERMISOS_ESPERADOS as readonly string[]).includes(s)).map((s) => ({ id: s, texto: textoPermiso(s), ok: true }));
  const origen = cred.datos?.origen ?? conexion.origen;
  const fechaClave = cred.datos?.origen === 'importado' && cred.datos.legado.ya_importado_at ? formato.fechaCorta(cred.datos.legado.ya_importado_at) : null;

  return (
    <Seccion titulo={titulo} id="tiktok" descripcion={android ? T.tiktok.androidManeja : T.tiktok.descripcion}>
      {/* Identidad de la cuenta */}
      <div className={cx(css.cuenta)} data-estado-tiktok={estado}>
        <AvatarCuenta url={cuenta?.avatar ?? null} username={cuenta?.username ?? 'TikTok'} tamano={40} className={cx(css.cuentaAvatar)} />
        <div className={cx(css.cuentaTextos)}>
          <div className={cx(css.cuentaFila)}>
            <span className={cx(css.cuentaNombre)}>{cuenta ? `@${cuenta.username}` : T.tiktok.grupoCuenta}</span>
            <Chip tono={chip.tono} {...(chip.tono === 'ok' ? { icono: 'Check' as const } : chip.tono === 'critico' ? { icono: 'CircleAlert' as const } : {})}>
              {chip.texto}
            </Chip>
          </div>
          {vigente && conexion.refresh_expira_at ? <p className={cx(css.cuentaMeta)}>{T.tiktok.renueva(formato.fechaConDia(conexion.refresh_expira_at))}</p> : null}
        </div>
        {puedeAutorizar && conectada ? (
          <div className={cx(css.cuentaAcciones)}>
            {/* Si el aviso de abajo ya trae [Reautorizar], aquí no se repite. */}
            {aviso === null ? (
              <Boton variante="secundario" icono="RefreshCw" alPulsar={reautorizar}>
                {T.tiktok.reautorizar}
              </Boton>
            ) : null}
            <Boton variante="peligro" alPulsar={() => setVerDesconectar(true)}>
              {T.tiktok.desconectar}
            </Boton>
          </div>
        ) : null}
      </div>

      {conexion.aviso && estado !== 'vence_pronto' && estado !== 'vencida' ? (
        <Aviso tono="atencion" icono="Info">
          {conexion.aviso}
        </Aviso>
      ) : null}
      {aviso}

      {android ? (
        // Sin título: «La conexión con TikTok la maneja tu PC.» ya es la descripción de la sección (01 §4.14 A).
        <Aviso tono="neutro" icono="Monitor" vivo>
          <span data-texto-c35="">{T.tiktok.androidC35}</span>
        </Aviso>
      ) : null}

      {clave.error ? (
        <Aviso tono="critico" vivo>
          {clave.error}
        </Aviso>
      ) : null}
      {clave.resultado && cred.datos?.legado.disponible ? (
        <Aviso
          tono="info"
          icono="Trash2"
          titulo={T.tiktok.importado}
          acciones={
            <Boton variante="secundario" tamano="sm" icono="Trash2" cargando={borrando} alPulsar={() => void borrarAnterior()}>
              {T.tiktok.borrarAnterior}
            </Boton>
          }
        >
          {clave.resultado.aviso_archivo_original}
        </Aviso>
      ) : null}

      <Grupo titulo={T.tiktok.grupoCuenta}>
        <Dato etiqueta={T.tiktok.region} valor={cuenta?.region === 'MX' || !cuenta ? T.tiktok.regionMexico : cuenta.region} />
        <Dato etiqueta={T.tiktok.tipoCuenta} valor={T.tiktok.tipoCreador} />
      </Grupo>

      {/* Sin permisos registrados (p. ej. la copia del celular no los trae) no se pinta una lista de «faltan» falsa. */}
      {conexion.scopes.length > 0 ? (
        <Grupo titulo={T.tiktok.grupoPermisos}>
          <div className={cx(css.filaLibre)}>
            <ListaChequeo items={[...permisos, ...extras]} />
          </div>
        </Grupo>
      ) : null}

      {puedeAutorizar ? (
        cred.cargando && !cred.datos ? (
          <CargandoGrupo filas={1} />
        ) : (
          <Grupo titulo={T.tiktok.grupoClave}>
            <div className={cx(css.fila)}>
              <div className={cx(css.filaTextos)}>
                <span className={cx(css.filaEtiqueta)}>{cred.datos?.app_secret_configurado ? T.tiktok.claveGuardada : T.tiktok.claveFalta}</span>
                <span className={cx(css.filaDesc)}>{T.tiktok.claveAyuda}</span>
              </div>
              <Chip tono={cred.datos?.app_secret_configurado ? 'ok' : 'atencion'} icono={cred.datos?.app_secret_configurado ? 'Check' : 'CircleAlert'}>
                {cred.datos?.app_secret_configurado ? T.tiktok.chipGuardada : T.tiktok.chipFalta}
              </Chip>
            </div>
            <details className={cx(css.tecnicos)}>
              <summary className={cx(css.tecnicosResumen)}>
                <span>{T.tiktok.tecnicos}</span>
                <Icono nombre="ChevronDown" tamano={18} className={cx(css.preguntaFlecha)} />
              </summary>
              <div className={cx(css.tecnicosCuerpo)}>
                <p className={cx(css.filaDesc)}>{T.tiktok.tecnicosClaves}</p>
                <ul className={cx(css.claves)}>
                  {(conexion.scopes.length > 0 ? conexion.scopes : [...PERMISOS_ESPERADOS]).map((s) => (
                    <li key={s} className={cx(css.mono)}>
                      {s}
                    </li>
                  ))}
                </ul>
                {cred.datos?.app_secret_configurado ? <p className={cx(css.filaDesc)}>{T.tiktok.claveOrigen(T.tiktok.origenes[origen ?? 'manual'] ?? 'pegada', fechaClave)}</p> : null}
                <div className={cx(css.acciones)}>{botonesClave}</div>
              </div>
            </details>
          </Grupo>
        )
      ) : null}

      {puedeAutorizar ? (
        <>
          <DialogoClave abierto={verClave} alCerrar={() => setVerClave(false)} />
          <Modal
            abierto={verDesconectar}
            titulo={T.tiktok.desconectarTitulo}
            alCerrar={() => setVerDesconectar(false)}
            pie={
              <>
                <Boton variante="fantasma" alPulsar={() => setVerDesconectar(false)}>
                  {T.cancelar}
                </Boton>
                <Boton variante="peligro" cargando={desconectando} alPulsar={() => void desconectar()}>
                  {T.tiktok.desconectar}
                </Boton>
              </>
            }
          >
            <p className={cx(css.textoModal)}>{T.tiktok.desconectarTexto}</p>
          </Modal>
        </>
      ) : null}
    </Seccion>
  );
}
