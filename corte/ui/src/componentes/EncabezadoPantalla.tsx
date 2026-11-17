/**
 * Encabezado de pantalla (02 §7.9).
 * - Windows: 56 px pegajoso (mínimo); transparente en reposo y, al hacer scroll, capa .glass con borde inferior sutil
 *   (fundido de 200 ms solo de opacidad). Título de 30/700 y contexto de 14 en text-3, como el lienzo aprobado (manda
 *   sobre title2 de 02 §7.9 en jerarquía, LEEME.md:17); acciones a la derecha con buscador de 40 y botones de 40×40.
 * - Android: barra pegajosa de 56 dp (+ inset superior) con el título grande (title1) que, al hacer scroll, se reduce
 *   a 17 con transform (sin animar alturas) y la barra pasa a .glass. El contexto queda debajo y se va con el scroll.
 * El scroll se detecta con un centinela de 1 px e IntersectionObserver (sirve con cualquier contenedor de scroll).
 */
import { useEffect, useRef, useState, type ReactElement, type RefObject } from 'react';
import type { EncabezadoPantallaProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { cx } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import { hrefDeRuta } from './util/rutas';
import css from './EncabezadoPantalla.module.css';

function useConScroll(): [RefObject<HTMLDivElement | null>, boolean] {
  const centinela = useRef<HTMLDivElement>(null);
  const [conScroll, setConScroll] = useState(false);
  useEffect(() => {
    const el = centinela.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const o = new IntersectionObserver(([e]) => setConScroll(e ? !e.isIntersecting && e.boundingClientRect.top < 0 : false), { threshold: [0, 1] });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [centinela, conScroll];
}

export function EncabezadoPantalla(p: EncabezadoPantallaProps): ReactElement {
  const plataforma = usePlataformaHtml();
  const [centinela, conScroll] = useConScroll();
  const volver = p.volver ? (
    <a className={css.volver} href={hrefDeRuta(p.volver.a)} aria-label={p.volver.etiqueta ?? 'Volver'}>
      <Icono nombre={plataforma === 'android' ? 'ArrowLeft' : 'ChevronLeft'} tamano={plataforma === 'android' ? 22 : 18} />
      {plataforma === 'android' ? null : <span>{p.volver.etiqueta ?? 'Volver'}</span>}
    </a>
  ) : null;

  if (plataforma === 'android') {
    return (
      <>
        <div ref={centinela} className={css.centinela} aria-hidden="true" />
        <header className={cx(css.and, conScroll && css.colapsado, p.className)} data-con-scroll={conScroll ? '' : undefined}>
          <div className={cx(css.fondo, 'glass')} aria-hidden="true" />
          {volver}
          <h1 className={css.tituloAnd}>
            <span className={css.tituloEscala}>{p.titulo}</span>
          </h1>
          {p.acciones ? <div className={css.acciones}>{p.acciones}</div> : null}
        </header>
        {p.contexto ? <p className={css.contextoAnd}>{p.contexto}</p> : null}
      </>
    );
  }

  return (
    <>
      <div ref={centinela} className={css.centinela} aria-hidden="true" />
      <header className={cx(css.win, conScroll && css.colapsado, p.className)} data-con-scroll={conScroll ? '' : undefined}>
        <div className={cx(css.fondo, 'glass')} aria-hidden="true" />
        {volver}
        <div className={css.textos}>
          <h1 className={css.titulo}>{p.titulo}</h1>
          {p.contexto ? <p className={css.contexto}>{p.contexto}</p> : null}
        </div>
        {p.acciones ? <div className={css.acciones}>{p.acciones}</div> : null}
      </header>
    </>
  );
}
