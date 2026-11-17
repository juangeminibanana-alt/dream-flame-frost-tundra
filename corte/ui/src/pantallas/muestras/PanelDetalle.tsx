/**
 * Panel de detalle de 480 a la derecha de la cola (Windows ≥ 1280, C5/C41; 01 §4.2 «Escritorio», 02 §7.12, lienzo
 * Muestras.png). Va EN LÍNEA junto a la lista (no tapa la cola ni atrapa el foco) para que J/K cambien de muestra sin
 * cerrarlo (01 §4.2). Arriba manda la foto (con el chip «TikTok:» sobre su velo) y flotan ⤢ «Abrir en página completa»
 * y ✕; al hacer scroll aparece el encabezado fijo con miniatura y nombre corto (02 §7.12). Halo del color dominante
 * detrás del título; pie fijo con la acción principal de la etapa, «Avisar a la tienda» y ⋯.
 * El panel ocupa todo el alto libre (--panel-alto) y es un contenedor de tamaño («panel-detalle»): la foto toma el alto
 * que sobra después del pie y del encabezado de texto, así el título nunca queda cortado por el borde del área de scroll.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar } from '@/app';
import { BotonAccionMuestra, ChipTikTok, useControlMuestra } from '@/bloques';
import { Boton, BotonIcono, EstadoVacio, Esqueleto, Foto, Menu } from '@/componentes';
import { useConsulta, useMetaImagen } from '@/datos';
import { formato } from '@/dominio';
import { AvisoConflicto, CuerpoDetalle, LineaTienda, Rotulo, TituloEditable, nombreVisible, useAtajosDetalle, useConflicto, useMenuMuestra } from './Detalle';
import { NecesitaPc } from './Estados';
import { altoCabezaPegajosa, capasFijas, holguraContra } from './capas';
import { rutaDetalle } from './rutas';
import { T } from './textos';
import { cx, rgbDeHex, vars } from './util';
import css from './Detalle.module.css';

const MARGEN_INFERIOR = 16;
const SEPARACION_CABEZA = 12;
/**
 * Con la tarjeta global abajo en una ventana de 800 de alto quedan ~300 px: pie y encabezado (miniatura, rótulo, título
 * y tienda) a la vista, sin encimarse con la tarjeta.
 */
const ALTO_MINIMO = 280;

/**
 * El panel es pegajoso (sticky) bajo el encabezado, pero en reposo empieza más abajo (debajo de la franja y la barra de
 * herramientas): con un alto fijo de «toda la ventana», su pie con la acción principal quedaba fuera de la vista hasta
 * desplazar la página. Aquí su alto máximo es lo que queda libre de su borde superior al fondo de la ventana (o de su
 * tope pegajoso, una vez pegado): el pie siempre se ve y el contenido del panel se desplaza por dentro. Si una capa
 * global anclada abajo (la tarjeta «¿Le enviaste el mensaje…?») cae sobre el panel, el panel termina encima de ella en
 * vez de quedar con el pie tapado (se mide contra el panel «a todo lo alto», así no oscila al encogerse).
 */
function useAltoLibre(el: HTMLElement | null): void {
  useEffect(() => {
    if (!el || typeof window === 'undefined') return undefined;
    let cuadro = 0;
    const medir = (): void => {
      cuadro = 0;
      // Se pega 12 px debajo del encabezado de la pantalla (que puede medir más que --header-h), no por detrás de él.
      const cabeza = altoCabezaPegajosa(el);
      if (cabeza > 0) el.style.top = `${cabeza + SEPARACION_CABEZA}px`;
      const tope = Number.parseFloat(getComputedStyle(el).top) || 0;
      const r = el.getBoundingClientRect();
      const arriba = Math.max(r.top, tope);
      const alto = window.innerHeight;
      const completo = new DOMRect(r.left, arriba, r.width, Math.max(0, alto - arriba - MARGEN_INFERIOR));
      const abajo = Math.max(MARGEN_INFERIOR, holguraContra(completo, capasFijas(el), alto));
      el.style.setProperty('--panel-alto', `${Math.max(ALTO_MINIMO, Math.floor(alto - arriba - abajo))}px`);
    };
    const pedir = (): void => {
      if (!cuadro) cuadro = window.requestAnimationFrame(medir);
    };
    medir();
    const o = typeof MutationObserver === 'undefined' ? null : new MutationObserver(pedir);
    o?.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('scroll', pedir, { capture: true, passive: true });
    document.addEventListener('animationend', pedir, true);
    window.addEventListener('resize', pedir);
    return () => {
      o?.disconnect();
      document.removeEventListener('scroll', pedir, { capture: true });
      document.removeEventListener('animationend', pedir, true);
      window.removeEventListener('resize', pedir);
      if (cuadro) window.cancelAnimationFrame(cuadro);
    };
  }, [el]);
}

function irANotas(): void {
  const el = typeof document === 'undefined' ? null : document.getElementById('notas-muestra');
  el?.scrollIntoView?.({ block: 'start', behavior: 'smooth' });
  el?.querySelector<HTMLElement>('textarea, input, button')?.focus({ preventScroll: true });
}

function ContenidoPanel(p: { m: C.MuestraVista; detalle: C.MuestraDetalleResponse | undefined; cola: readonly C.MuestraVista[]; fuente: string; copiaAt: C.EpochS | null; alCerrar: () => void }): ReactElement {
  const { m, detalle } = p;
  const control = useControlMuestra();
  const conflicto = useConflicto();
  const meta = useMetaImagen(m.producto.imagen);
  const halo = rgbDeHex(meta?.color);
  const nombre = nombreVisible(m, detalle);
  const menu = useMenuMuestra(m, irANotas);
  useAtajosDetalle(m, nombre, irANotas, true);
  const scroll = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLDivElement>(null);
  // 02 §7.12: el encabezado con miniatura y nombre corto aparece AL HACER SCROLL (cuando el título sale de vista); en
  // reposo, la foto manda arriba (lienzo Muestras.png) y solo flotan ⤢ y ✕.
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    scroll.current?.scrollTo?.({ top: 0 });
    setCompacto(false);
    const el = titulo.current;
    const raiz = scroll.current;
    if (!el || !raiz || typeof IntersectionObserver === 'undefined') return undefined;
    const o = new IntersectionObserver(
      ([e]) => setCompacto(e ? !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0) : false),
      { root: raiz, threshold: 0 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [m.application_id]);

  return (
    <>
      <div className={cx(css.panelCabeza)} data-visible={compacto ? '' : undefined} aria-hidden="true">
        <Foto url={m.producto.imagen} alt="" anchoCss={40} tienda={m.tienda.nombre} categoria={m.producto.categoria} radio="sm" className={cx(css.panelMini)} />
        <p className={cx(css.panelNombre)}>{nombre}</p>
      </div>
      <div className={cx(css.panelControles, 'glass')} data-sobre-foto={compacto ? undefined : ''}>
        <BotonIcono icono="Maximize2" etiqueta={T.expandir} tamano="sm" alPulsar={() => navegar(`${rutaDetalle(m.application_id)}?completa=1`)} />
        <BotonIcono icono="X" etiqueta={T.cerrar} tamano="sm" alPulsar={p.alCerrar} />
      </div>
      <div ref={scroll} className={cx(css.panelScroll)}>
        {conflicto.vigente ? <AvisoConflicto vigente={conflicto.vigente} alCerrar={conflicto.limpiar} /> : null}
        {/* Encabezado: foto + rótulo, título y tienda. El alto de la foto sale del alto libre del panel (Detalle.module.css,
            container query «panel-detalle»): rótulo, título y tienda siempre quedan a la vista en reposo; con muy poco
            alto (la tarjeta global «¿Le enviaste el mensaje…?» abajo en una ventana de 800) la foto pasa a miniatura de
            112 a la izquierda del título, sin recortar el producto. */}
        <div className={cx(css.panelHeroe)} style={halo ? vars({ '--halo': halo }) : undefined}>
          <div className={cx(css.panelFoto)} data-halo={halo ? '' : undefined} data-foto-panel="">
            <div className={cx(css.panelFotoCaja)}>
              <Foto
                url={m.producto.imagen}
                alt={nombre}
                anchoCss={440}
                proporcion="1:1"
                tienda={m.tienda.nombre}
                categoria={m.producto.categoria}
                radio="lg"
                prioridad="alta"
                arrastrable={{ nombreArchivo: `${nombre}.jpg` }}
                className={cx(css.panelFotoImg)}
              />
            </div>
            {/* 02 §7.12: el chip «TikTok:» sobre el velo de la foto, abajo a la izquierda. */}
            <span className={cx(css.panelFotoVelo)} aria-hidden="true" />
            <span className={cx(css.panelFotoChip)}>
              <ChipTikTok muestra={m} />
            </span>
          </div>
          <div ref={titulo} className={cx(css.encabezadoTexto)} data-halo={halo ? '' : undefined} data-encabezado-panel="">
            <Rotulo m={m} conTienda />
            <TituloEditable m={m} detalle={detalle} nivel="h2" alConflicto={conflicto.anotar} />
            <LineaTienda m={m} />
            {p.fuente === 'copia' && p.copiaAt !== null ? <p className={cx(css.copia)}>{T.datosCopia(`${formato.fechaCorta(p.copiaAt)}, ${formato.hora(p.copiaAt)}`)}</p> : null}
          </div>
        </div>
        <CuerpoDetalle m={m} detalle={detalle} modo="panel" cola={p.cola} tiktokEnFoto alConflicto={conflicto.anotar} />
      </div>
      <footer className={cx(css.panelPie)}>
        <BotonAccionMuestra muestra={m} tamano="md" anchoCompleto className={cx(css.pieAccion)} />
        <Boton variante="secundario" icono="MessageCircle" alPulsar={() => control.abrirMensaje({ solicitud: m.application_id })}>
          {T.avisarTienda}
        </Boton>
        <Menu etiqueta={T.masAcciones} opciones={menu} />
      </footer>
    </>
  );
}

export function PanelDetalle(p: { id: string; muestraLista: C.MuestraVista | null; cola: readonly C.MuestraVista[]; alCerrar: () => void; alAbrir: (m: C.MuestraVista) => void }): ReactElement {
  const [aside, setAside] = useState<HTMLElement | null>(null);
  useAltoLibre(aside);
  const consulta = useConsulta('muestra', { id: p.id });
  const detalle = consulta.datos?.muestra.application_id === p.id ? consulta.datos : undefined;
  const m = detalle?.muestra ?? p.muestraLista;
  let contenido: ReactElement;
  if (m) {
    contenido = <ContenidoPanel m={m} detalle={detalle} cola={p.cola} fuente={consulta.fuente} copiaAt={consulta.copia_at} alCerrar={p.alCerrar} />;
  } else if (consulta.error?.codigo === 'necesita_pc') {
    contenido = <NecesitaPc alReintentar={() => void consulta.refrescar()} className={cx(css.panelEstado)} />;
  } else if (consulta.error) {
    contenido = (
      <div className={cx(css.panelEstado)}>
        <EstadoVacio icono="CircleHelp" titulo={T.noEncontradaTitulo} texto={T.noEncontradaTexto} accion={{ etiqueta: T.cerrar, alPulsar: p.alCerrar }} />
      </div>
    );
  } else {
    contenido = (
      <div className={cx(css.panelEsqueleto)} aria-busy="true" aria-label={T.contextoCargando}>
        <Esqueleto forma="foto" ancho="100%" alto={300} />
        <Esqueleto forma="texto" ancho="40%" />
        <Esqueleto forma="titulo" ancho="85%" />
        <Esqueleto forma="texto" lineas={3} />
      </div>
    );
  }
  return (
    <aside ref={setAside} className={cx(css.panel)} aria-label={T.detalleEtiqueta} data-panel-muestra={p.id}>
      {contenido}
    </aside>
  );
}
