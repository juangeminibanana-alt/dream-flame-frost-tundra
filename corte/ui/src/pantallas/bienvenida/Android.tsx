/**
 * Bienvenida en Android, A1–A6 (01_ux §4.15 y §5.3). A2/A2'/A3 (cámara, código y número de 4 dígitos) viven en
 * #/emparejar; aquí: A1 (presentación), A4 «Copiando tus datos…» (con la copia que trae la capa nativa), A5 (permiso de
 * notificaciones, explicado antes de pedirlo) y A6 «Avisa a tus {30} tiendas desde aquí».
 */
import { Fragment, useEffect, useState, type ReactElement } from 'react';
import type { EventosAndroid } from '@/plataforma';
import { Pantalla, navegar, useParametro } from '@/app';
import { BarraProgreso, Boton, Esqueleto, Hoja, Icono, Palomita } from '@/componentes';
import { esPendiente, formato } from '@/dominio';
import { useConexionPc, useConsulta } from '@/datos';
import { pedirPermisoNotificaciones } from '@/plataforma';
import { esPasoA, type PasoA } from './logica';
import { Logotipo, MosaicoTiendas, TiraMuestras } from './piezas';
import { T } from './textos';
import css from './bienvenida.module.css';
import { cx } from './clases';

function Puntos(p: { paso: 1 | 4 | 5 | 6 }): ReactElement {
  const orden = [1, 2, 3, 4, 5, 6];
  return (
    <div className={cx(css.puntos)} role="progressbar" aria-label={T.progreso} aria-valuemin={1} aria-valuemax={6} aria-valuenow={p.paso}>
      {orden.map((n) => (
        <span key={n} className={cx(css.punto)} data-lleno={n <= p.paso ? '' : undefined} />
      ))}
    </div>
  );
}

function PasoA1(): ReactElement {
  const [ayuda, setAyuda] = useState(false);
  return (
    <div className={cx(css.pasoAndroid)} data-paso="a1">
      <div className={cx(css.androidArriba)}>
        <Logotipo tamano={40} />
        <Puntos paso={1} />
      </div>
      <div className={cx(css.androidCentro)}>
        <h1 className={cx(css.display)}>{T.a1Titulo}</h1>
        <p className={cx(css.textoGrande)}>{T.a1Texto}</p>
        <ul className={cx(css.beneficios)}>
          {T.a1Puntos.map((x) => (
            <li key={x.texto} className={cx(css.beneficio)}>
              <span className={cx(css.beneficioIcono)} aria-hidden="true">
                <Icono nombre={x.icono} tamano={20} />
              </span>
              <span>{x.texto}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={cx(css.androidAbajo)}>
        <Boton variante="primario" tamano="lg" anchoCompleto icono="QrCode" alPulsar={() => navegar('/emparejar')}>
          {T.a1Emparejar}
        </Boton>
        <button type="button" className={cx(css.enlaceBoton)} onClick={() => setAyuda(true)}>
          {T.a1SinPc}
        </button>
      </div>
      <Hoja abierta={ayuda} titulo={T.a1SinPcTitulo} alCerrar={() => setAyuda(false)}>
        <p className={cx(css.textoPaso)}>{T.a1SinPcTexto}</p>
      </Hoja>
    </div>
  );
}

function useImagenesCopia(): { hechas: number; total: number } | null {
  const [v, setV] = useState<{ hechas: number; total: number } | null>(null);
  useEffect(() => {
    // Evento de la capa nativa (EventosAndroid['creatorhub-imagenes']); no hay función de @/plataforma para él.
    const f = (e: Event): void => {
      const d = (e as CustomEvent<EventosAndroid['creatorhub-imagenes']>).detail;
      if (d && typeof d.hechas === 'number' && typeof d.total === 'number') setV({ hechas: d.hechas, total: d.total });
    };
    window.addEventListener('creatorhub-imagenes', f);
    return () => window.removeEventListener('creatorhub-imagenes', f);
  }, []);
  return v;
}

function PasoA4(p: { ir: (x: PasoA) => void }): ReactElement {
  const pc = useConexionPc();
  const tablero = useConsulta('dashboard', { periodo: 'todo' });
  const imagenes = useImagenesCopia();
  const d = tablero.datos;
  const hayCopia = d !== undefined;
  // Mientras falte la copia o sigan llegando imágenes, es «Copiando…» (con girador); al terminar, la palomita.
  const imagenesPendientes = imagenes !== null && imagenes.total > 0 && imagenes.hechas < imagenes.total;
  const copiando = !hayCopia || imagenesPendientes;
  const fr = imagenes && imagenes.total > 0 ? imagenes.hechas / imagenes.total : hayCopia ? 1 : 0;
  const conteos = [
    d ? T.a4Muestras(formato.numero(d.muestras.total)) : null,
    d ? T.a4Pedidos(formato.numero(d.kpis.pedidos)) : null,
    imagenes ? T.a4Imagenes(formato.numero(imagenes.hechas), formato.numero(imagenes.total)) : null,
  ].filter((x): x is string => x !== null);
  const titulo = copiando ? T.a4Titulo : T.a4TituloListo;
  return (
    <div className={cx(css.pasoAndroid)} data-paso="a4" data-copia={hayCopia ? 'lista' : 'esperando'} data-imagenes={imagenesPendientes ? 'llegando' : 'listas'}>
      <div className={cx(css.androidArriba)}>
        <Logotipo tamano={40} />
        <Puntos paso={4} />
      </div>
      <div className={cx(css.androidCentro)}>
        <span className={cx(css.copiaIcono)} aria-hidden="true">
          {copiando ? <span className={cx(css.girador)} /> : <Palomita tamano={56} />}
        </span>
        <h1 className={cx(css.display)}>{titulo}</h1>
        <p className={cx(css.conteos)} aria-live="polite">
          {conteos.length > 0
            ? conteos.map((c, i) => (
                // Cada conteo en un solo renglón («imágenes 120 de 312» nunca se parte a la mitad); el renglón se
                // corta solo en los separadores, que van fuera del <span> sin cortes.
                <Fragment key={c}>
                  {i > 0 ? ' · ' : ''}
                  <span className={cx(css.conteo)}>{c}</span>
                </Fragment>
              ))
            : T.a4Esperando}
        </p>
        <BarraProgreso valor={fr} etiqueta={titulo} className={cx(css.barraCopia)} />
        {pc?.nombre_equipo ? (
          <p className={cx(css.pcCopia)}>
            <Icono nombre="Monitor" tamano={16} />
            {T.a4DesdePc(pc.nombre_equipo)}
          </p>
        ) : null}
        {hayCopia ? <p className={cx(css.textoPaso)}>{imagenesPendientes ? T.a4ImagenesSiguen : T.a4Listo}</p> : null}
      </div>
      <div className={cx(css.androidAbajo)}>
        <Boton variante="primario" tamano="lg" anchoCompleto iconoFinal="ArrowRight" deshabilitado={!hayCopia} alPulsar={() => p.ir('a5')}>
          {T.a4Seguir}
        </Boton>
      </div>
    </div>
  );
}

function PasoA5(p: { ir: (x: PasoA) => void }): ReactElement {
  const [pidiendo, setPidiendo] = useState(false);
  const activar = async (): Promise<void> => {
    setPidiendo(true);
    try {
      await pedirPermisoNotificaciones();
    } catch {
      /* si no se pudo, se activan después en Más › Recordatorios */
    } finally {
      setPidiendo(false);
      p.ir('a6');
    }
  };
  return (
    <div className={cx(css.pasoAndroid)} data-paso="a5">
      <div className={cx(css.androidArriba)}>
        <Logotipo tamano={40} />
        <Puntos paso={5} />
      </div>
      <div className={cx(css.androidCentro)}>
        <div className={cx(css.notificacion)} aria-hidden="true">
          <span className={cx(css.notificacionIcono)}>
            <Logotipo tamano={28} conTexto={false} />
          </span>
          <span className={cx(css.notificacionTextos)}>
            <span className={cx(css.notificacionDe)}>{T.a5EjemploDe}</span>
            <span className={cx(css.notificacionTitulo)}>{T.a5Ejemplo}</span>
          </span>
          <Icono nombre="Bell" tamano={18} className={cx(css.notificacionCampana)} />
        </div>
        <h1 className={cx(css.display)}>{T.a5Titulo}</h1>
        <p className={cx(css.textoGrande)}>{T.a5Texto}</p>
      </div>
      <div className={cx(css.androidAbajo)}>
        <Boton variante="primario" tamano="lg" anchoCompleto icono="Bell" cargando={pidiendo} alPulsar={() => void activar()}>
          {T.a5Activar}
        </Boton>
        <Boton variante="fantasma" tamano="lg" anchoCompleto alPulsar={() => p.ir('a6')}>
          {T.ahoraNo}
        </Boton>
      </div>
    </div>
  );
}

function PasoA6(): ReactElement {
  const plan = useConsulta('plan', {});
  const tablero = useConsulta('dashboard', { periodo: '30d' });
  const tiendas = useConsulta('tiendas', { orden: 'atencion' });
  const muestras = useConsulta('muestras', {});
  const hayPlan = (plan.datos?.items ?? []).some((x) => x.fecha_plan !== null && x.estado !== 'no_se_puede');
  const porAvisar = (tiendas.datos?.items ?? []).filter((t) => t.por_avisar);
  const n = tablero.datos?.muestras.tiendas_por_avisar ?? porAvisar.length;
  const avisar = hayPlan && n > 0;
  const pendientes = (muestras.datos?.items ?? []).filter((m) => esPendiente(m));
  const nTiendas = new Set(pendientes.map((m) => m.tienda.tienda_key)).size;
  // Sin el plan todavía no se sabe qué cierre toca: nada de títulos que cambian a medio camino.
  if (plan.datos === undefined && plan.error === null) {
    return (
      <div className={cx(css.pasoAndroid)} data-paso="a6" data-avisar="cargando">
        <div className={cx(css.androidArriba)}>
          <Logotipo tamano={40} />
          <Puntos paso={6} />
        </div>
        <div className={cx(css.androidCentro)} aria-busy="true">
          <Esqueleto forma="titulo" ancho="80%" />
          <Esqueleto forma="texto" lineas={2} />
        </div>
      </div>
    );
  }
  return (
    <div className={cx(css.pasoAndroid)} data-paso="a6" data-avisar={avisar ? 'si' : 'no'}>
      <div className={cx(css.androidArriba)}>
        <Logotipo tamano={40} />
        <Puntos paso={6} />
      </div>
      <div className={cx(css.androidCentro)}>
        <h1 className={cx(css.display)}>{avisar ? T.a6Titulo(n) : T.a6SinAvisarTitulo}</h1>
        <p className={cx(css.textoGrande)}>{avisar ? T.a6Texto : T.a6SinAvisarTexto}</p>
        {avisar ? <MosaicoTiendas tiendas={porAvisar} total={n} maximo={4} /> : null}
        {!avisar && pendientes.length > 0 ? (
          <div className={cx(css.resumenCopia)} data-resumen-copia="">
            <TiraMuestras muestras={pendientes} maximo={4} titulo={T.a6Pendientes(pendientes.length, nTiendas)} />
            <p className={cx(css.pista)}>{T.a6PlanDesdePc}</p>
          </div>
        ) : null}
      </div>
      <div className={cx(css.androidAbajo)}>
        {avisar ? (
          <>
            <Boton variante="primario" tamano="lg" anchoCompleto icono="MessageCircle" alPulsar={() => navegar('/muestras/avisos')}>
              {T.a6Empezar}
            </Boton>
            <Boton variante="fantasma" tamano="lg" anchoCompleto alPulsar={() => navegar('/inicio')}>
              {T.a6Despues}
            </Boton>
          </>
        ) : (
          <Boton variante="primario" tamano="lg" anchoCompleto iconoFinal="ArrowRight" alPulsar={() => navegar('/inicio')}>
            {T.irInicio}
          </Boton>
        )}
      </div>
    </div>
  );
}

export function BienvenidaAndroid(): ReactElement {
  const [param, setParam] = useParametro('paso');
  const pc = useConexionPc();
  const inicial: PasoA = pc?.emparejado ? 'a4' : 'a1';
  const paso: PasoA = esPasoA(param) ? param : inicial;
  const ir = (x: PasoA): void => setParam(x);

  // A2/A2'/A3 son la pantalla de emparejar. A3 («Confirma en tu PC») solo existe con un emparejamiento en curso, así
  // que ?paso=a3 lleva al inicio de #/emparejar (cámara y código), no a un número que todavía no hay.
  useEffect(() => {
    if (paso === 'a2' || paso === 'a3') navegar('/emparejar', { reemplazar: true });
  }, [paso]);

  let contenido: ReactElement;
  switch (paso) {
    case 'a4':
      contenido = <PasoA4 ir={ir} />;
      break;
    case 'a5':
      contenido = <PasoA5 ir={ir} />;
      break;
    case 'a6':
      contenido = <PasoA6 />;
      break;
    default:
      contenido = <PasoA1 />;
  }
  return (
    <Pantalla titulo={T.tituloPantalla} lista>
      <div className={cx(css.raizAndroid)} data-vista="bienvenida-android" data-paso-actual={paso}>
        {contenido}
      </div>
    </Pantalla>
  );
}
