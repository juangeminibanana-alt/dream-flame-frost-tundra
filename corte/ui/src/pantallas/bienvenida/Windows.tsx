/**
 * Bienvenida en Windows, W1–W6 (01_ux §4.15; BUILD_SPEC C34, C42, C46; 02 lámina «win-bienvenida»).
 * El paso vive en la URL (?paso=w3) para que Atrás funcione y se pueda volver a un paso.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Pantalla, iniciarRecorridos, navegar, useClaseAncho, useParametro } from '@/app';
import { Boton, CampoTexto, Esqueleto, Icono, useToast } from '@/componentes';
import { PanelPlan, PanelQrEmparejamiento, type ResumenPlanCreado } from '@/bloques';
import { esPendiente, formato } from '@/dominio';
import { ErrorHub, hub, invalidar, useConsulta, useSesion, useSync } from '@/datos';
import { elegirArchivo } from '@/plataforma';
import { continuarActivo, esPasoW, fallaronMuestras, filasW3, pasoInicialW, rutaAmigable, vistaW2, type PasoW } from './logica';
import { CabezaPaso, Logotipo, MosaicoTiendas, TiraMuestras } from './piezas';
import { T } from './textos';
import css from './bienvenida.module.css';
import { cx } from './clases';

const ORDEN: readonly PasoW[] = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
const CLAVE_MEMORIA = 'corte.bienvenida';

interface Memoria {
  plan: ResumenPlanCreado | null;
  celular: string | null;
}
function leerMemoria(): Memoria {
  try {
    const v: unknown = JSON.parse(window.sessionStorage.getItem(CLAVE_MEMORIA) ?? 'null');
    if (v !== null && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      const plan = o['plan'];
      const celular = o['celular'];
      return {
        plan: plan !== null && typeof plan === 'object' && typeof (plan as Record<string, unknown>)['termina'] === 'string' ? (plan as ResumenPlanCreado) : null,
        celular: typeof celular === 'string' ? celular : null,
      };
    }
  } catch {
    /* sin almacenamiento: se queda en memoria */
  }
  return { plan: null, celular: null };
}
function guardarMemoria(m: Memoria): void {
  try {
    window.sessionStorage.setItem(CLAVE_MEMORIA, JSON.stringify(m));
  } catch {
    /* sin almacenamiento */
  }
}

function mensaje(e: unknown): string {
  return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}

// ---------------------------------------------------------------------------------------------- panel izquierdo

function Lado(p: { paso: PasoW; compacta: boolean }): ReactElement {
  const i = ORDEN.indexOf(p.paso);
  return (
    <aside className={cx(css.lado)} aria-label={T.progreso}>
      <Logotipo tamano={p.compacta ? 32 : 44} />
      {p.compacta ? null : (
        <div className={cx(css.ladoTextos)}>
          <p className={cx(css.ladoTitulo)}>{T.w1Titulo}</p>
          <p className={cx(css.ladoTexto)}>{T.w1Texto}</p>
        </div>
      )}
      <ol className={cx(css.rail)}>
        {T.rail.map((r, k) => {
          const estado = k < i ? 'hecho' : k === i ? 'actual' : 'pendiente';
          return (
            <li key={r} className={cx(css.railItem)} data-estado={estado} aria-current={estado === 'actual' ? 'step' : undefined}>
              <span className={cx(css.railNumero)}>{String(k + 1).padStart(2, '0')}</span>
              <span className={cx(css.railTexto)}>{r}</span>
              {estado === 'hecho' ? <Icono nombre="Check" tamano={14} etiqueta="listo" /> : null}
            </li>
          );
        })}
      </ol>
      {p.compacta ? (
        <div className={cx(css.railCompacto)} role="progressbar" aria-label={T.progreso} aria-valuemin={1} aria-valuemax={6} aria-valuenow={i + 1}>
          {ORDEN.map((x, k) => (
            <span key={x} className={cx(css.railSegmento)} data-lleno={k <= i ? '' : undefined} />
          ))}
        </div>
      ) : null}
    </aside>
  );
}

// ---------------------------------------------------------------------------------------------- W1

function PasoW1(p: { ir: (x: PasoW) => void; compacta: boolean }): ReactElement {
  return (
    <div className={cx(css.paso)} data-paso="w1">
      {p.compacta ? (
        <header className={cx(css.cabeza)}>
          <span className={cx(css.overline)}>{T.pasoDe(1, 6)}</span>
          <h1 className={cx(css.display)}>{T.w1Titulo}</h1>
          <p className={cx(css.textoGrande)}>{T.w1Texto}</p>
        </header>
      ) : (
        <CabezaPaso paso={1} total={6} titulo={T.w1Lista} />
      )}
      <ol className={cx(css.plan)}>
        {T.w1Pasos.map((x, k) => (
          <li key={x.titulo} className={cx(css.planItem)}>
            <span className={cx(css.planNumero)}>{String(k + 2).padStart(2, '0')}</span>
            <span className={cx(css.planTextos)}>
              <span className={cx(css.planTitulo)}>{x.titulo}</span>
              <span className={cx(css.planTexto)}>{x.texto}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className={cx(css.acciones)}>
        <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" alPulsar={() => p.ir('w2')}>
          {T.empezar}
        </Boton>
        <span className={cx(css.pista)}>{T.w1Duracion}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------- W2

function CampoClave(p: { alGuardada: () => void }): ReactElement {
  const [valor, setValor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const guardar = async (): Promise<void> => {
    const c = valor.trim();
    if (c === '') {
      setError(T.claveVacia);
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await hub.guardarAppSecret(c);
      setValor('');
      p.alGuardada();
    } catch (e) {
      setError(e instanceof ErrorHub && e.codigo === 'app_secret_invalido' ? T.claveInvalida : mensaje(e));
    } finally {
      setGuardando(false);
    }
  };
  return (
    <div className={cx(css.campoClave)}>
      <CampoTexto etiqueta={T.claveEtiqueta} valor={valor} alCambiar={setValor} tipo="password" ayuda={T.claveAyuda} error={error} monoespaciado autoFoco alEnter={() => void guardar()} className={cx(css.campoClaveTexto)} />
      <Boton variante="secundario" cargando={guardando} alPulsar={() => void guardar()} className={cx(css.campoClaveBoton)}>
        {T.guardarClave}
      </Boton>
    </div>
  );
}

function PasoW2(p: { ir: (x: PasoW) => void }): ReactElement {
  const sesion = useSesion();
  const cred = useConsulta('credenciales', {});
  const toast = useToast();
  const [, setReauth] = useParametro('reautorizar');
  const [importada, setImportada] = useState<C.ImportarResponse | null>(null);
  const [otraForma, setOtraForma] = useState(false);
  const [trabajando, setTrabajando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verClave, setVerClave] = useState(false);

  const conexion = sesion.datos?.conexion.estado === 'conectada' ? sesion.datos.conexion : importada?.conexion ?? sesion.datos?.conexion;
  const vista = otraForma ? 'conectar' : vistaW2(cred.datos, conexion, importada !== null);
  const cuenta = sesion.datos?.cuenta ?? null;
  const conectada = conexion?.estado === 'conectada';
  const claveLista = cred.datos?.app_secret_configurado === true || conectada;
  const abrirTikTok = (): void => setReauth('1');

  // Solo la RUTA viaja al hub (C46). Sin ruta = el archivo anterior conocido (CredencialesEstado.legado.ruta).
  const importar = async (req: C.ImportarRequest): Promise<void> => {
    setTrabajando('importar');
    setError(null);
    try {
      const r = await hub.importarCredenciales(req);
      setImportada(r);
      setOtraForma(false);
      invalidar('credenciales', 'sesion');
    } catch (e) {
      setError(mensaje(e));
    } finally {
      setTrabajando(null);
    }
  };
  const importarArchivo = async (): Promise<void> => {
    const ruta = await elegirArchivo(T.tituloElegir, ['json']);
    if (ruta) await importar({ ruta });
  };
  const borrarAnterior = async (): Promise<void> => {
    setTrabajando('borrar');
    try {
      await hub.borrarLegado();
      toast.mostrar({ texto: T.enPapelera, tono: 'ok' });
      p.ir('w3');
    } catch (e) {
      setError(mensaje(e));
    } finally {
      setTrabajando(null);
    }
  };

  const errorVista = error ? (
    <p className={cx(css.error)} role="alert">
      <Icono nombre="CircleAlert" tamano={16} />
      {error}
    </p>
  ) : null;

  if (vista === 'importar') {
    const ruta = rutaAmigable(cred.datos?.legado.ruta ?? '');
    return (
      <div className={cx(css.paso)} data-paso="w2" data-vista="w2a">
        <CabezaPaso paso={2} total={6} titulo={T.w2aTitulo} texto={T.w2aTexto(ruta)} />
        <div className={cx(css.archivo)}>
          <span className={cx(css.archivoIcono)} aria-hidden="true">
            <Icono nombre="Lock" tamano={20} />
          </span>
          <span className={cx(css.archivoTextos)}>
            <span className={cx(css.archivoRuta)}>{ruta}</span>
            <span className={cx(css.archivoNota)}>config.json</span>
          </span>
        </div>
        {errorVista}
        <div className={cx(css.acciones)}>
          <Boton variante="primario" tamano="lg" icono="Download" cargando={trabajando === 'importar'} alPulsar={() => void importar({})}>
            {T.importarSeguro}
          </Boton>
          <Boton variante="fantasma" tamano="lg" alPulsar={() => setOtraForma(true)}>
            {T.otraForma}
          </Boton>
        </div>
      </div>
    );
  }

  if (vista === 'importada') {
    return (
      <div className={cx(css.paso)} data-paso="w2" data-vista="w2a1">
        <CabezaPaso paso={2} total={6} titulo={cuenta ? T.w2a1Titulo(cuenta.username) : T.w2a1TituloSinNombre} texto={T.w2a1Texto} />
        <div className={cx(css.c42)} data-texto-c42="">
          <Icono nombre="CircleAlert" tamano={18} />
          <p>{T.w2a1C42}</p>
        </div>
        {errorVista}
        <div className={cx(css.acciones)}>
          <Boton variante="primario" tamano="lg" icono="Trash2" cargando={trabajando === 'borrar'} alPulsar={() => void borrarAnterior()}>
            {T.borrarAnterior}
          </Boton>
          <Boton variante="secundario" tamano="lg" alPulsar={() => p.ir('w3')}>
            {T.conservarlo}
          </Boton>
        </div>
      </div>
    );
  }

  if (vista === 'vencida' && !conectada) {
    return (
      <div className={cx(css.paso)} data-paso="w2" data-vista="w2a2">
        <CabezaPaso paso={2} total={6} titulo={T.w2a2Titulo} texto={T.w2a2Texto} />
        {errorVista}
        <div className={cx(css.acciones)}>
          <Boton variante="primario" tamano="lg" iconoFinal="ExternalLink" alPulsar={abrirTikTok}>
            {T.abrirTikTok}
          </Boton>
        </div>
      </div>
    );
  }

  // W2b · Sin configuración (o ya conectada desde el diálogo de autorización).
  return (
    <div className={cx(css.paso)} data-paso="w2" data-vista="w2b">
      <CabezaPaso paso={2} total={6} titulo={T.w2bTitulo} texto={T.w2bTexto} />
      <ol className={cx(css.requisitos)}>
        <li className={cx(css.requisito)} data-listo={claveLista ? '' : undefined}>
          <span className={cx(css.requisitoMarca)} aria-hidden="true">
            {claveLista ? <Icono nombre="Check" tamano={14} /> : '1'}
          </span>
          <div className={cx(css.requisitoCuerpo)}>
            <span className={cx(css.requisitoTitulo)}>{T.claveApp}</span>
            <span className={cx(css.requisitoTexto)}>{claveLista ? T.claveGuardada : T.claveFalta}</span>
            {claveLista ? null : (
              <>
                <div className={cx(css.accionesChicas)}>
                  <Boton variante="secundario" icono="Download" cargando={trabajando === 'importar'} alPulsar={() => void importarArchivo()}>
                    {T.importarArchivo}
                  </Boton>
                  <Boton variante="secundario" icono="Lock" alPulsar={() => setVerClave((v) => !v)}>
                    {T.pegarClave}
                  </Boton>
                </div>
                {verClave ? <CampoClave alGuardada={() => setVerClave(false)} /> : null}
              </>
            )}
          </div>
        </li>
        <li className={cx(css.requisito)} data-listo={conectada ? '' : undefined}>
          <span className={cx(css.requisitoMarca)} aria-hidden="true">
            {conectada ? <Icono nombre="Check" tamano={14} /> : '2'}
          </span>
          <div className={cx(css.requisitoCuerpo)}>
            <span className={cx(css.requisitoTitulo)}>{T.autorizacion}</span>
            <span className={cx(css.requisitoTexto)}>{conectada ? (cuenta ? T.conectadoComo(cuenta.username) : T.autorizacionLista) : T.autorizacionTexto}</span>
          </div>
        </li>
      </ol>
      {errorVista}
      <div className={cx(css.acciones)}>
        {conectada ? (
          <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" alPulsar={() => p.ir('w3')}>
            {T.continuar}
          </Boton>
        ) : (
          <Boton variante="primario" tamano="lg" iconoFinal="ExternalLink" deshabilitado={!claveLista} alPulsar={abrirTikTok}>
            {T.abrirTikTok}
          </Boton>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------- W3

function PasoW3(p: { ir: (x: PasoW) => void }): ReactElement {
  const sync = useSync();
  const sesion = useSesion();
  const estado = sync.estado ?? sesion.datos?.sync ?? null;
  const activo = continuarActivo(estado);
  const fallo = fallaronMuestras(estado);
  const filas = filasW3(estado);
  const muestras = useConsulta('muestras', {}, { activa: activo });
  const pendientes = (muestras.datos?.items ?? []).filter((m) => esPendiente(m));
  const pedida = useRef(false);
  const compacta = useClaseAncho() === 'compacta';

  // La primera sincronización arranca sola si la cuenta ya está conectada y aún no hay datos (completa).
  useEffect(() => {
    const s = sesion.datos;
    if (pedida.current || !s || s.conexion.estado !== 'conectada' || s.datos.hay_datos || estado?.en_curso || !sync.puede) return;
    pedida.current = true;
    void sync.sincronizar('completa').catch(() => undefined);
  }, [sesion.datos, estado?.en_curso, sync]);

  return (
    <div className={cx(css.paso)} data-paso="w3" data-continuar={activo ? 'activo' : 'inactivo'}>
      <CabezaPaso paso={3} total={6} titulo={T.w3Titulo} texto={T.w3Texto} />
      <ol className={cx(css.sync)} aria-label={T.w3Lista}>
        {filas.map((f) => (
          <li key={f.paso} className={cx(css.syncFila)} data-estado={f.estado} data-paso-sync={f.paso}>
            <span className={cx(css.syncMarca)} aria-hidden="true">
              {f.estado === 'ok' || f.estado === 'omitido' ? <Icono nombre="Check" tamano={14} /> : f.estado === 'error' ? <Icono nombre="CircleAlert" tamano={14} /> : null}
            </span>
            <span className={cx(css.syncEtiqueta)}>
              {f.etiqueta}
              <span className={cx(css.oculto)}>
                {' · '}
                {f.estado === 'ok' || f.estado === 'omitido' ? T.hecho : f.estado === 'en_curso' ? T.enCursoEtiqueta : f.estado === 'error' ? T.conError : T.pendiente}
              </span>
            </span>
            {f.conteo ? <span className={cx(css.syncConteo)}>{f.conteo}</span> : null}
          </li>
        ))}
      </ol>
      <TiraMuestras muestras={pendientes} maximo={compacta ? 4 : 7} />
      {fallo ? (
        <div className={cx(css.errorBloque)} role="alert">
          <p className={cx(css.error)}>
            <Icono nombre="CircleAlert" tamano={16} />
            {T.w3Error}
          </p>
          <div className={cx(css.acciones)}>
            <Boton variante="primario" icono="RefreshCw" alPulsar={() => void sync.sincronizar('completa').catch(() => undefined)}>
              {T.reintentar}
            </Boton>
            <Boton variante="fantasma" alPulsar={() => navegar('/inicio')}>
              {T.irInicioIgual}
            </Boton>
          </div>
        </div>
      ) : (
        <div className={cx(css.acciones)}>
          <Boton variante="primario" tamano="lg" iconoFinal="ChevronRight" deshabilitado={!activo} alPulsar={() => p.ir('w4')}>
            {T.continuar}
          </Boton>
          {activo ? null : <span className={cx(css.pista)}>{T.w3Pista}</span>}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------- W4 · W5 · W6

function PasoW4(p: { alCrear: (r: ResumenPlanCreado) => void; alSaltar: () => void }): ReactElement {
  return (
    <div className={cx(css.paso)} data-paso="w4">
      <CabezaPaso paso={4} total={6} titulo={T.w4Titulo} texto={T.w4Texto} />
      <div className={cx(css.panel)}>
        <PanelPlan modo="compacto" alCrear={p.alCrear} alSaltar={p.alSaltar} />
      </div>
    </div>
  );
}

function PasoW5(p: { alEmparejado: (n: string) => void; alAhoraNo: () => void }): ReactElement {
  const lan = useConsulta('lan', {});
  const toast = useToast();
  const [activando, setActivando] = useState(false);
  const activo = lan.datos?.activo === true;
  const activar = async (): Promise<void> => {
    setActivando(true);
    try {
      await hub.lanActivar(true);
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setActivando(false);
    }
  };
  return (
    <div className={cx(css.paso)} data-paso="w5">
      <CabezaPaso paso={5} total={6} titulo={T.w5Titulo} texto={T.w5Texto} />
      {lan.datos && !activo ? (
        <div className={cx(css.aviso)}>
          <Icono nombre="Wifi" tamano={18} />
          <p>{T.w5AvisoRedes}</p>
          <Boton variante="primario" icono="QrCode" cargando={activando} alPulsar={() => void activar()}>
            {T.w5MostrarCodigo}
          </Boton>
        </div>
      ) : (
        <div className={cx(css.panel)}>
          <PanelQrEmparejamiento compacto alEmparejado={p.alEmparejado} />
          <p className={cx(css.pista)}>{T.w5Deteccion}</p>
        </div>
      )}
      <div className={cx(css.acciones)}>
        <Boton variante="secundario" tamano="lg" alPulsar={p.alAhoraNo}>
          {T.ahoraNo}
        </Boton>
      </div>
    </div>
  );
}

function PasoW6(p: { plan: ResumenPlanCreado | null; celular: string | null }): ReactElement {
  const plan = useConsulta('plan', {}, { activa: p.plan === null });
  const tablero = useConsulta('dashboard', { periodo: '30d' });
  const tiendas = useConsulta('tiendas', { orden: 'atencion' });
  const porAvisar = (tiendas.datos?.items ?? []).filter((t) => t.por_avisar);
  const compacta = useClaseAncho() === 'compacta';
  const termina =
    p.plan?.termina ??
    (plan.datos?.items ?? [])
      .map((x) => (x.estado === 'planeada' ? x.fecha_plan : null))
      .filter((f): f is string => f !== null)
      .sort()
      .at(-1) ??
    null;
  const n = p.plan?.tiendas_por_avisar ?? tablero.datos?.muestras.tiendas_por_avisar ?? porAvisar.length;
  const titulo = termina ? (n > 0 ? T.w6Titulo(formato.fechaConDia(termina), n) : T.w6TituloSinTiendas(formato.fechaConDia(termina))) : T.w6TituloSinPlan;
  const texto = termina ? (p.celular ? T.w6ConCelular : T.w6SinCelular) : T.w6TextoSinPlan;
  if (p.plan === null && plan.datos === undefined && plan.error === null) {
    return (
      <div className={cx(css.paso)} data-paso="w6" aria-busy="true">
        <span className={cx(css.overline)}>{T.pasoDe(6, 6)}</span>
        <Esqueleto forma="titulo" ancho="70%" />
        <Esqueleto forma="texto" lineas={2} />
      </div>
    );
  }
  return (
    <div className={cx(css.paso)} data-paso="w6">
      <CabezaPaso paso={6} total={6} titulo={titulo} texto={texto} />
      {n > 0 ? <MosaicoTiendas tiendas={porAvisar} total={n} columnas={compacta ? 2 : 4} maximo={compacta ? 4 : 8} /> : null}
      <div className={cx(css.acciones)}>
        {p.celular || !termina ? (
          <>
            <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" alPulsar={() => navegar('/inicio')}>
              {T.irInicio}
            </Boton>
            {n > 0 ? (
              <Boton variante="secundario" tamano="lg" icono="MessageCircle" alPulsar={() => navegar('/muestras/avisos')}>
                {T.avisarPc}
              </Boton>
            ) : null}
          </>
        ) : (
          <>
            <Boton variante="primario" tamano="lg" icono="MessageCircle" alPulsar={() => navegar('/muestras/avisos')}>
              {T.avisarPc}
            </Boton>
            <Boton variante="secundario" tamano="lg" alPulsar={() => navegar('/inicio')}>
              {T.irInicio}
            </Boton>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------- pantalla

export function BienvenidaWindows(): ReactElement {
  const [param, setParam] = useParametro('paso');
  const sesion = useSesion();
  const clase = useClaseAncho();
  const compacta = clase === 'compacta';
  const toast = useToast();
  const [memoria, setMemoria] = useState<Memoria>(leerMemoria);
  const paso: PasoW = esPasoW(param) ? param : pasoInicialW(sesion.datos);
  const ir = (x: PasoW): void => setParam(x);
  const recordar = (m: Partial<Memoria>): void => {
    setMemoria((previa) => {
      const nueva = { ...previa, ...m };
      guardarMemoria(nueva);
      return nueva;
    });
  };

  let contenido: ReactElement;
  switch (paso) {
    case 'w1':
      contenido = <PasoW1 ir={ir} compacta={compacta} />;
      break;
    case 'w2':
      contenido = <PasoW2 ir={ir} />;
      break;
    case 'w3':
      contenido = <PasoW3 ir={ir} />;
      break;
    case 'w4':
      contenido = (
        <PasoW4
          alCrear={(r) => {
            recordar({ plan: r });
            ir('w5');
          }}
          alSaltar={() => {
            // 01 §4.15: si se salta W4, al llegar a Inicio se muestran los 3 recorridos breves.
            iniciarRecorridos();
            recordar({ plan: null });
            ir('w5');
          }}
        />
      );
      break;
    case 'w5':
      contenido = (
        <PasoW5
          alEmparejado={(n) => {
            toast.mostrar({ texto: T.emparejado(n), tono: 'ok' });
            recordar({ celular: n });
            ir('w6');
          }}
          alAhoraNo={() => ir('w6')}
        />
      );
      break;
    case 'w6':
      contenido = <PasoW6 plan={memoria.plan} celular={memoria.celular} />;
      break;
  }

  return (
    <Pantalla titulo={T.tituloPantalla} lista={!sesion.cargando}>
      <div className={cx(css.raiz, compacta && css.raizCompacta)} data-vista="bienvenida-windows" data-paso-actual={paso}>
        <Lado paso={paso} compacta={compacta} />
        <div className={cx(css.principal)}>{contenido}</div>
      </div>
    </Pantalla>
  );
}
