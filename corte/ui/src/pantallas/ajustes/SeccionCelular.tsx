/**
 * C. Celular (Windows, 01_ux §4.14 C; 04 §C.10; BUILD_SPEC C25, C38).
 * - [Permitir que mis celulares se conecten] → hub.lanActivar. La primera vez, antes de la ventana de Windows:
 *   «Windows te preguntará si Corte puede usar la red. Elige “Redes privadas”.»
 * - Firewall (04 §C.10): diagnóstico sin administrador; bloqueado → [Arreglar]; red pública → dos opciones
 *   excluyentes, ninguna marcada, y [Configurar] deshabilitado hasta elegir; después de la UAC se repite el diagnóstico
 *   y «Listo» solo si ya cubre la red; si se cancela la UAC, camino B.
 * - PanelQrEmparejamiento (ui-bloques) sin celulares o con [Emparejar otro celular].
 * - Celulares emparejados: permisos (Solo ver / Ver y editar), [Renombrar] y [Olvidar] con su confirmación.
 * - Alias de la PC («PC 3F2A», nunca el nombre de Windows) → hub.lanCambiar.
 */
import { useEffect, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { useCapacidades, useClaseAncho, usePrimeraVez } from '@/app';
import { Boton, CampoTexto, Icono, Interruptor, Modal, OpcionRadio, Segmentado, useToast } from '@/componentes';
import { PanelQrEmparejamiento } from '@/bloques';
import { ahoraS, formato } from '@/dominio';
import { ErrorHub, hub, invalidar, useConsulta } from '@/datos';
import { aliasValido } from './logica';
import { Aviso, CargandoGrupo, ErrorCarga, FilaLibre, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

function mensaje(e: unknown): string {
  return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}

type Resultado = { tipo: 'listo' } | { tipo: 'cancelado' } | { tipo: 'fallo' } | null;

/** Flujo del firewall de Windows (04 §C.10). Exportado para las pruebas. */
export function PanelFirewall(): ReactElement | null {
  const diag = useConsulta('firewall', {});
  // En angosto los botones largos («… (pide permiso de Windows)») ocupan el ancho y parten renglón en vez de salirse.
  const angosto = useClaseAncho() === 'compacta';
  const [opcion, setOpcion] = useState<'privada' | 'publica_subred' | null>(null);
  const [trabajando, setTrabajando] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);
  const [ultimo, setUltimo] = useState<C.DiagnosticoFirewall | null>(null);
  const d = ultimo ?? diag.datos ?? null;

  const configurar = async (req: C.FirewallRequest): Promise<void> => {
    setTrabajando(true);
    setResultado(null);
    try {
      const r = await hub.firewallConfigurar(req);
      setUltimo(r.diagnostico);
      // «Listo» SOLO si después de la UAC el diagnóstico ya cubre la red actual.
      setResultado(r.resultado === 'listo' && r.diagnostico.estado === 'bien' ? { tipo: 'listo' } : r.resultado === 'cancelado' ? { tipo: 'cancelado' } : { tipo: 'fallo' });
    } catch {
      setResultado({ tipo: 'fallo' });
    } finally {
      setTrabajando(false);
    }
  };
  const revisar = async (): Promise<void> => {
    setUltimo(null);
    setResultado(null);
    invalidar('firewall');
    await diag.refrescar();
  };

  if (diag.cargando && !d) {
    return (
      <Aviso tono="neutro" icono="Clock" vivo>
        {T.celular.firewallRevisando}
      </Aviso>
    );
  }
  if (!d) return <ErrorCarga error={diag.error} alReintentar={() => void revisar()} />;

  const pieResultado =
    resultado?.tipo === 'cancelado' ? (
      <Aviso tono="info" vivo>
        {T.celular.firewallCancelado}
      </Aviso>
    ) : resultado?.tipo === 'fallo' ? (
      <Aviso tono="atencion" vivo>
        {T.celular.firewallFallo}
      </Aviso>
    ) : null;

  if (d.estado === 'bien') {
    return (
      <div data-firewall="bien">
        <Aviso tono="ok" icono="Check" vivo={resultado?.tipo === 'listo'}>
          {resultado?.tipo === 'listo' ? T.celular.firewallListo : T.celular.firewallBien}
        </Aviso>
      </div>
    );
  }
  if (d.estado === 'bloqueado') {
    return (
      <div className={cx(css.pila)} data-firewall="bloqueado">
        <Aviso
          tono="critico"
          icono="Ban"
          acciones={
            <Boton variante="primario" tamano="sm" icono="Lock" anchoCompleto={angosto} cargando={trabajando} alPulsar={() => void configurar({ opcion: 'arreglar' })}>
              {T.celular.firewallArreglar}
            </Boton>
          }
        >
          {T.celular.firewallBloqueado}
        </Aviso>
        {pieResultado}
      </div>
    );
  }
  if (d.estado === 'red_publica') {
    return (
      <div className={cx(css.pila)} data-firewall="red_publica">
        <Aviso tono="atencion" icono="Wifi">
          <p className={cx(css.parrafo)}>{T.celular.firewallPublica}</p>
          <OpcionRadio
            etiqueta={T.celular.firewallOpciones}
            valor={opcion}
            alCambiar={setOpcion}
            className={cx(css.opcionesFirewall)}
            opciones={[
              { valor: 'privada', etiqueta: T.celular.firewallOpcionPrivada, descripcion: T.celular.firewallOpcionPrivadaDesc },
              { valor: 'publica_subred', etiqueta: T.celular.firewallOpcionPublica, descripcion: T.celular.firewallOpcionPublicaDesc },
            ]}
          />
          <div className={cx(css.acciones)}>
            <Boton variante="primario" icono="Lock" anchoCompleto={angosto} deshabilitado={opcion === null} cargando={trabajando} alPulsar={() => (opcion ? void configurar({ opcion }) : undefined)}>
              {T.celular.firewallConfigurar}
            </Boton>
          </div>
        </Aviso>
        {pieResultado}
      </div>
    );
  }
  return (
    <div className={cx(css.pila)} data-firewall="desconocido">
      <Aviso
        tono="atencion"
        acciones={
          <Boton variante="secundario" tamano="sm" icono="RefreshCw" alPulsar={() => void revisar()}>
            {T.celular.firewallRevisar}
          </Boton>
        }
      >
        {d.mensaje ?? T.celular.firewallDesconocido}
        <span className={cx(css.notaChica)}>{T.celular.firewallAyuda}</span>
      </Aviso>
      {pieResultado}
    </div>
  );
}

function Dispositivo(p: { d: C.Dispositivo }): ReactElement {
  const toast = useToast();
  const ahora = ahoraS();
  const [renombrar, setRenombrar] = useState(false);
  const [olvidar, setOlvidar] = useState(false);
  const [nombre, setNombre] = useState(p.d.nombre);
  const [trabajando, setTrabajando] = useState(false);
  const cambiar = async (cambios: C.DispositivoCambios): Promise<boolean> => {
    setTrabajando(true);
    try {
      await hub.lanCambiarDispositivo(p.d.device_id, cambios);
      return true;
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
      return false;
    } finally {
      setTrabajando(false);
    }
  };
  const revocar = async (): Promise<void> => {
    setTrabajando(true);
    try {
      await hub.lanRevocar(p.d.device_id);
      toast.mostrar({ texto: T.celular.olvidado(p.d.nombre), tono: 'ok' });
      setOlvidar(false);
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setTrabajando(false);
    }
  };
  const meta = [
    p.d.ultimo_uso_at ? T.celular.ultimaConexion(formato.relativa(p.d.ultimo_uso_at, ahora)) : T.celular.nuncaConectado,
    T.celular.emparejadoEl(formato.fechaCorta(p.d.creado_at)),
  ].join(' · ');
  const nombreOk = aliasValido(nombre);
  return (
    <li className={cx(css.dispositivo)} data-dispositivo={p.d.device_id}>
      <span className={cx(css.dispositivoIcono)} aria-hidden="true">
        <Icono nombre="Smartphone" tamano={20} />
      </span>
      <div className={cx(css.dispositivoTextos)}>
        <span className={cx(css.dispositivoNombre)}>{p.d.nombre}</span>
        <span className={cx(css.filaDesc)}>{meta}</span>
      </div>
      <div className={cx(css.dispositivoPermisos)}>
        <Segmentado
          etiqueta={`${T.celular.permisos}: ${p.d.nombre}`}
          valor={p.d.permisos}
          opciones={[
            { valor: 'lectura', etiqueta: T.celular.soloVer },
            { valor: 'lectura_escritura', etiqueta: T.celular.verEditar },
          ]}
          alCambiar={(v) => void cambiar({ permisos: v })}
        />
      </div>
      <div className={cx(css.dispositivoAcciones)}>
        <Boton variante="fantasma" tamano="sm" icono="Pencil" alPulsar={() => setRenombrar(true)}>
          {T.celular.renombrar}
        </Boton>
        <Boton variante="fantasma" tamano="sm" icono="Trash2" alPulsar={() => setOlvidar(true)}>
          {T.celular.olvidar}
        </Boton>
      </div>
      <Modal
        abierto={renombrar}
        titulo={T.celular.renombrarTitulo}
        alCerrar={() => setRenombrar(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setRenombrar(false)}>
              {T.cancelar}
            </Boton>
            <Boton
              variante="primario"
              cargando={trabajando}
              deshabilitado={!nombreOk}
              alPulsar={() =>
                void cambiar({ nombre: nombre.trim() }).then((ok) => {
                  if (ok) setRenombrar(false);
                })
              }
            >
              {T.guardar}
            </Boton>
          </>
        }
      >
        <CampoTexto etiqueta={T.celular.nombreCelular} valor={nombre} alCambiar={setNombre} maximo={40} autoFoco error={nombreOk ? null : T.celular.aliasError} />
      </Modal>
      <Modal
        abierto={olvidar}
        titulo={T.celular.olvidarTitulo(p.d.nombre)}
        alCerrar={() => setOlvidar(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setOlvidar(false)}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" cargando={trabajando} alPulsar={() => void revocar()}>
              {T.celular.olvidar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.celular.olvidarTexto}</p>
      </Modal>
    </li>
  );
}

function AliasPc(p: { lan: C.LanEstado }): ReactElement {
  const toast = useToast();
  const [valor, setValor] = useState(p.lan.nombre_equipo);
  const [guardando, setGuardando] = useState(false);
  useEffect(() => setValor(p.lan.nombre_equipo), [p.lan.nombre_equipo]);
  const ok = aliasValido(valor);
  const cambiado = valor.trim() !== p.lan.nombre_equipo;
  const guardar = async (): Promise<void> => {
    if (!ok || !cambiado) return;
    setGuardando(true);
    try {
      await hub.lanCambiar({ nombre_equipo: valor.trim() });
      toast.mostrar({ texto: T.celular.aliasGuardado, tono: 'ok' });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setGuardando(false);
    }
  };
  return (
    <FilaLibre className={cx(css.alias)}>
      <CampoTexto etiqueta={T.celular.alias} valor={valor} alCambiar={setValor} maximo={40} ayuda={T.celular.aliasAyuda} error={ok ? null : T.celular.aliasError} alEnter={() => void guardar()} className={cx(css.aliasCampo)} />
      <Boton variante="secundario" deshabilitado={!ok || !cambiado} cargando={guardando} alPulsar={() => void guardar()} className={cx(css.aliasBoton)}>
        {T.guardar}
      </Boton>
    </FilaLibre>
  );
}

export function SeccionCelular(): ReactElement {
  const cap = useCapacidades();
  const toast = useToast();
  const lan = useConsulta('lan', {});
  const [primeraVez, marcarAviso] = usePrimeraVez('lan-aviso-redes-privadas');
  const [verAviso, setVerAviso] = useState(false);
  const [activando, setActivando] = useState(false);
  const [verQr, setVerQr] = useState(false);

  const activar = async (activo: boolean): Promise<void> => {
    setActivando(true);
    try {
      await hub.lanActivar(activo);
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setActivando(false);
    }
  };
  const alCambiar = (activo: boolean): void => {
    // La primera vez que se enciende: explicar la ventana de Windows ANTES de que salga (01 §4.14 C).
    if (activo && primeraVez) {
      setVerAviso(true);
      return;
    }
    void activar(activo);
  };

  if (lan.cargando && !lan.datos) {
    return (
      <Seccion titulo={T.secciones.celular.titulo} id="celular" descripcion={T.celular.descripcion}>
        <CargandoGrupo filas={3} />
      </Seccion>
    );
  }
  if (!lan.datos) {
    return (
      <Seccion titulo={T.secciones.celular.titulo} id="celular" descripcion={T.celular.descripcion}>
        <ErrorCarga error={lan.error} alReintentar={() => void lan.refrescar()} />
      </Seccion>
    );
  }
  const l = lan.datos;
  const activos = l.dispositivos.filter((d) => d.revocado_at === null);
  const mostrarQr = l.activo && cap.lan_admin && (activos.length === 0 || verQr);

  return (
    <Seccion titulo={activos.length === 0 ? T.celular.titulo : T.secciones.celular.titulo} id="celular" descripcion={T.celular.descripcion}>
      <Grupo>
        <FilaLibre>
          <Interruptor etiqueta={T.celular.permitir} descripcion={l.activo ? T.celular.permitirDesc : T.celular.apagado} activo={l.activo} deshabilitado={activando || !cap.lan_admin} alCambiar={alCambiar} />
        </FilaLibre>
      </Grupo>

      {l.activo ? <PanelFirewall /> : null}

      {mostrarQr ? (
        <div className={cx(css.panelQr)}>
          {/* compacto: el título «Lleva Corte en tu celular» y su texto ya los pone la sección arriba (sin repetirlos). */}
          <PanelQrEmparejamiento
            compacto
            alEmparejado={(n) => {
              toast.mostrar({ texto: T.celular.emparejado(n), tono: 'ok' });
              setVerQr(false);
              invalidar('lan');
            }}
          />
        </div>
      ) : null}

      {activos.length > 0 ? (
        <Grupo
          titulo={T.celular.grupoCelulares}
          acciones={
            l.activo && cap.lan_admin ? (
              <Boton variante="fantasma" tamano="sm" icono={verQr ? 'X' : 'QrCode'} alPulsar={() => setVerQr((v) => !v)}>
                {verQr ? T.celular.ocultarQr : T.celular.emparejarOtro}
              </Boton>
            ) : null
          }
        >
          <ul className={cx(css.dispositivos)}>
            {activos.map((d) => (
              <Dispositivo key={d.device_id} d={d} />
            ))}
          </ul>
        </Grupo>
      ) : null}

      <Grupo titulo={T.celular.grupoPc}>
        <AliasPc lan={l} />
        <div className={cx(css.dato)}>
          <span className={cx(css.datoEtiqueta)}>{T.celular.direccion}</span>
          <span className={`${css.datoValor} ${css.mono}`}>{l.direcciones[0] ? `${l.direcciones[0]}${l.puerto ? ` · ${l.puerto}` : ''}` : T.celular.sinDireccion}</span>
        </div>
      </Grupo>

      <Modal
        abierto={verAviso}
        titulo={T.celular.avisoRedesTitulo}
        alCerrar={() => setVerAviso(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setVerAviso(false)}>
              {T.cancelar}
            </Boton>
            <Boton
              variante="primario"
              cargando={activando}
              alPulsar={() => {
                marcarAviso();
                setVerAviso(false);
                void activar(true);
              }}
            >
              {T.celular.activar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.celular.avisoRedes}</p>
      </Modal>
    </Seccion>
  );
}
