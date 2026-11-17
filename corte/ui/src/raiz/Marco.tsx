/**
 * @/raiz · marco por plataforma (BUILD_SPEC §8.4, 01 §3.2–3.4, 02 §5 y §7.7–7.9, lienzos Main.png y MovilInicio.png):
 * - Windows (y el navegador de desarrollo): barra lateral de 248 en expandida/amplia, riel de 80 en media y barra
 *   inferior si la ventana es compacta. El encabezado de cada pantalla (EncabezadoPantalla) es pegajoso y pasa a vidrio
 *   con el scroll de la página, que es el de la ventana.
 * - Android: barra inferior y, en #/ventas · #/videos · #/productos, el segmentado Resumen · Videos · Productos.
 * - Arriba del contenido, el banner único; en Android además la franja de demostración y la del indicador de sync.
 * - Rutas con reglas de arranque (§8.6) y, encima de todo, la paleta Ctrl+K, el panel '?' y DialogoReautorizar.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useConexionPc, useSesion, useSync } from '@/datos';
import { useCapacidades, useClaseAncho, usePlataforma } from '../app/entornoUi';
import { almacen, modoDemo } from '../app/entorno';
import { esCampo } from '../app/atajos';
import { LimiteError } from '../app/LimiteError';
import { fijarParametro, navegar, useRuta } from '../app/navegacion';
import { EsqueletoPantalla, VistaRuta, type Cargadores } from '../app/rutas';
import { resolverRuta } from '../app/tablaRutas';
import { cx } from '../app/clases';
import { decidirArranque, esRaiz } from './arranque';
import { Banner } from './Banner';
import { elegirBanner, type AccionBanner } from './banners';
import { BarraInferior } from './BarraInferior';
import { BarraLateral, insigniasNav } from './BarraLateral';
import { cerrarAtajos, cerrarPaleta, usePaletaAbierta, useAtajosAbiertos } from './capasGlobales';
import { useAhora, useTrabajo } from './datosMarco';
import { destinoActivo, modoNav, segmentoVentas } from './destinos';
import {
  anclarRelojDemo, useAperturasPaleta, useAtajosGlobales, useAtrasAndroid, useDeshacerGlobal, useNotificaciones,
  useSincronizarConAviso,
} from './globales';
import { IndicadorSync } from './IndicadorSync';
import { Paleta } from './Paleta';
import { accionesPaleta, type ResultadoPaleta } from './busqueda';
import { PanelAtajos } from './PanelAtajos';
import { DialogoReautorizarPerezoso } from './Reautorizar';
import { SegmentadoVentas } from './SegmentadoVentas';
import { T } from './textos';
import css from './Marco.module.css';

const CLAVE_DESCARTES = 'corte.banners';

function leerDescartes(): Record<string, number> {
  try {
    const v: unknown = JSON.parse(almacen.leer(CLAVE_DESCARTES) ?? '{}');
    if (v === null || typeof v !== 'object' || Array.isArray(v)) return {};
    const salida: Record<string, number> = {};
    for (const [k, t] of Object.entries(v)) if (typeof t === 'number') salida[k] = t;
    return salida;
  } catch {
    return {};
  }
}

/** Android: con el teclado abierto (foco en un campo) la barra inferior se esconde (02 §7.8). */
function useTecladoAbierto(activo: boolean): boolean {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!activo) return undefined;
    let t = 0;
    const revisar = (): void => setAbierto(esCampo(document.activeElement));
    const alSalir = (): void => {
      window.clearTimeout(t);
      t = window.setTimeout(revisar, 0);
    };
    document.addEventListener('focusin', revisar);
    document.addEventListener('focusout', alSalir);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('focusin', revisar);
      document.removeEventListener('focusout', alSalir);
    };
  }, [activo]);
  return activo && abierto;
}

export function Marco(p: { cargadores?: Cargadores; cargadoresReautorizar?: Cargadores }): ReactElement {
  const r = useRuta();
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const sesion = useSesion();
  const conexionPc = useConexionPc();
  const capacidades = useCapacidades();
  const sync = useSync();
  // Reloj de la demostración: se ancla antes de leer «ahora» y de pintar la primera pantalla (solo en dev:demo).
  const demoNavegador = modoDemo();
  const relojListo =
    !demoNavegador ||
    anclarRelojDemo(sesion.datos) ||
    sesion.error !== null ||
    (sesion.datos !== undefined && sesion.datos.datos.ultima_sync_ok_at === null && sesion.datos.sync.iniciada_at === null);
  const ahora = useAhora();
  const android = plataforma === 'android';
  const principal = useRef<HTMLElement>(null);

  // ---------------------------------------------------------------- arranque (§8.6)
  const enRaiz = esRaiz(r.ruta);
  const decision = decidirArranque({ plataforma, sesion: sesion.datos, sesionFallo: sesion.error !== null, conexionPc });
  const consultaActual = r.consulta.toString();
  useEffect(() => {
    if (!enRaiz || decision === 'esperar') return;
    const destino = decision === 'bienvenida' ? '/bienvenida' : '/inicio';
    navegar(consultaActual ? `${destino}?${consultaActual}` : destino, { reemplazar: true });
  }, [enRaiz, decision, consultaActual]);

  // ---------------------------------------------------------------- navegación
  const def = resolverRuta(r.ruta).def;
  const completa = !!def?.completa;
  const detalleMuestra = def?.patron === '/muestras/m/:id';
  const modo = enRaiz ? 'ninguna' : modoNav({ plataforma, clase, completa, detalleMuestra });
  const inferior = modo === 'inferior';
  const activo = destinoActivo(r.ruta, inferior || android);
  const teclado = useTecladoAbierto(android && inferior);
  const segmento = android ? segmentoVentas(r.ruta) : null;
  const demo = demoNavegador || sesion.datos?.modo === 'demo';

  const trabajo = useTrabajo(!completa && !enRaiz);
  const insignias = insigniasNav(trabajo.conteos);

  // ---------------------------------------------------------------- banner único
  const [descartes, setDescartes] = useState<Record<string, number>>(leerDescartes);
  const banner = completa || enRaiz
    ? null
    : elegirBanner({
        plataforma,
        sesion: sesion.datos,
        conexionPc,
        copiaAt: sesion.copia_at,
        pendientes: trabajo.pendientes,
        ahora,
        descartados: descartes,
      });
  const sincronizar = useSincronizarConAviso();
  const deshacer = useDeshacerGlobal();
  const alAccionBanner = (a: AccionBanner): void => {
    if (a.tipo === 'reautorizar') fijarParametro('reautorizar', '1');
    else if (a.tipo === 'navegar') navegar(a.a);
    else if (a.tipo === 'sincronizar') sincronizar();
    else fijarParametro('mensaje', `t:${a.tienda_key}`);
  };
  const descartar = (id: string): void => {
    const nuevos = { ...descartes, [id]: ahora };
    setDescartes(nuevos);
    almacen.escribir(CLAVE_DESCARTES, JSON.stringify(nuevos));
  };

  // ---------------------------------------------------------------- capas y comportamientos globales
  const paletaAbierta = usePaletaAbierta();
  const atajosAbiertos = useAtajosAbiertos();
  useAtajosGlobales({ sincronizar, deshacer });
  useAperturasPaleta();
  useAtrasAndroid(plataforma, paletaAbierta);
  useNotificaciones(!enRaiz && (sesion.datos?.datos.hay_datos ?? android));

  const acciones = accionesPaleta({ android, puedeSincronizar: sync.puede, puedeReautorizar: capacidades.auth });
  const elegir = (res: ResultadoPaleta): void => {
    cerrarPaleta();
    const d = res.destino;
    if (d.tipo === 'ruta') {
      navegar(d.a);
      return;
    }
    switch (d.accion) {
      case 'sincronizar':
        sincronizar();
        break;
      case 'plan':
        navegar('/muestras/plan');
        break;
      case 'avisar':
        navegar('/muestras/avisos');
        break;
      case 'sesion':
        navegar('/muestras/sesion');
        break;
      case 'generar':
        navegar('/videos/generar');
        break;
      case 'emparejar':
        navegar(android ? '/emparejar' : '/ajustes/celular');
        break;
      case 'reautorizar':
        fijarParametro('reautorizar', '1');
        break;
      case 'ventas':
        navegar('/ventas');
        break;
    }
  };

  const listo = !enRaiz && relojListo;
  const claveVista = def ? `${def.modulo}#${def.exporta}` : r.ruta;

  return (
    <div className={cx(css.marco, css[modo], android && css.android)} data-nav={modo} data-plataforma={android ? 'android' : 'windows'}>
      <a
        href="#contenido"
        className={css.saltar}
        onClick={(e) => {
          e.preventDefault();
          principal.current?.focus();
        }}
      >
        {T.saltar}
      </a>
      {modo === 'lateral' || modo === 'riel' ? (
        <BarraLateral modo={modo} activo={activo} enAjustes={r.ruta.startsWith('/ajustes')} insignias={insignias} demo={demo} />
      ) : null}

      <div className={css.columna}>
        <main id="contenido" ref={principal} tabIndex={-1} className={css.contenido} data-completa={completa ? '' : undefined}>
          <div className={css.lienzo}>
            {(inferior || (android && modo !== 'ninguna')) && (demo || banner || segmento) ? (
              <div className={css.superior}>
                {demo ? (
                  <p className={css.franjaDemo}>
                    <span className={css.franjaDemoPunto} aria-hidden="true" />
                    {T.demo}
                  </p>
                ) : null}
                {banner ? <Banner banner={banner} alAccion={alAccionBanner} alDescartar={() => descartar(banner.id)} franja /> : null}
                {segmento ? <SegmentadoVentas valor={segmento} /> : null}
              </div>
            ) : banner ? (
              <Banner banner={banner} alAccion={alAccionBanner} alDescartar={() => descartar(banner.id)} className={cx(css.bannerWin)} />
            ) : null}
            {inferior || android ? (
              <div className={css.indicador}>
                <IndicadorSync variante="franja" android={android} />
              </div>
            ) : null}
            <LimiteError key={claveVista} seccion={def?.titulo ?? T.inicio}>
              {listo ? <VistaRuta ruta={r} {...(p.cargadores ? { cargadores: p.cargadores } : {})} /> : enRaiz ? <div className={css.arranque} aria-busy="true" /> : <EsqueletoPantalla />}
            </LimiteError>
          </div>
        </main>
      </div>

      {inferior ? <BarraInferior activo={activo} insignias={insignias} oculta={teclado} /> : null}

      <Paleta abierta={paletaAbierta} completa={inferior || android} acciones={acciones} alCerrar={cerrarPaleta} alElegir={elegir} />
      <PanelAtajos abierto={atajosAbiertos} alCerrar={cerrarAtajos} />
      <DialogoReautorizarPerezoso {...(p.cargadoresReautorizar ? { cargadores: p.cargadoresReautorizar } : {})} />
    </div>
  );
}
