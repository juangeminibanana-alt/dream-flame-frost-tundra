/**
 * Burbuja de recorrido anclada a `children` (01 §4.15, BUILD §8.5): texto + [Siguiente] / [Entendido] y cerrar. Con
 * visible = false solo pinta `children`. Al abrir toma el foco; Esc = Entendido. Se coloca debajo del ancla (o arriba si
 * no cabe) en un portal con posición fija y se recoloca con el scroll y el tamaño de la ventana.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { Boton } from './Boton';
import { BotonIcono } from './BotonIcono';
import { useCapa } from './util/capas';
import { cx, vars } from './util/clases';
import css from './BurbujaRecorrido.module.css';

const MARGEN = 12;

interface Lugar {
  x: number;
  y: number;
  flechaX: number;
  arriba: boolean;
}

export function BurbujaRecorrido(p: { visible: boolean; texto: string; esUltimo: boolean; alSiguiente: () => void; alEntendido: () => void; children: ReactElement; className?: string }): ReactElement {
  const ancla = useRef<HTMLSpanElement>(null);
  const burbuja = useRef<HTMLDivElement>(null);
  const idTexto = useId();
  const [lugar, setLugar] = useState<Lugar | null>(null);
  useCapa(p.visible, false, p.alEntendido);

  const colocar = useCallback((): void => {
    const destino = ancla.current?.firstElementChild;
    const b = burbuja.current;
    if (!destino || !b) return;
    const r = destino.getBoundingClientRect();
    const ancho = b.offsetWidth;
    const alto = b.offsetHeight;
    const centro = r.left + r.width / 2;
    const x = Math.max(MARGEN, Math.min(window.innerWidth - ancho - MARGEN, centro - ancho / 2));
    let y = r.bottom + MARGEN;
    let arriba = false;
    if (y + alto > window.innerHeight - MARGEN && r.top - alto - MARGEN > MARGEN) {
      y = r.top - alto - MARGEN;
      arriba = true;
    }
    setLugar({ x, y, flechaX: Math.max(16, Math.min(ancho - 16, centro - x)), arriba });
  }, []);

  useLayoutEffect(() => {
    if (!p.visible) {
      setLugar(null);
      return undefined;
    }
    // Si el ancla está fuera de la ventana, primero se trae al centro: la burbuja se coloca junto a ella y, de otro
    // modo, quedaría fuera de vista (y el foco, con preventScroll, no desplaza nada). Se revisa otra vez en el cuadro
    // siguiente por si el diseño se movió al montar (fuentes, densidad).
    const traerAncla = (): void => {
      const destino = ancla.current?.firstElementChild;
      if (!destino || typeof destino.scrollIntoView !== 'function') return;
      const r = destino.getBoundingClientRect();
      const fuera = r.bottom < MARGEN || r.top > window.innerHeight - MARGEN || r.right < 0 || r.left > window.innerWidth;
      if (fuera) destino.scrollIntoView({ block: 'center', inline: 'nearest' });
    };
    traerAncla();
    colocar();
    const cuadro = window.requestAnimationFrame(() => {
      traerAncla();
      colocar();
    });
    window.addEventListener('resize', colocar);
    window.addEventListener('scroll', colocar, { capture: true, passive: true });
    return () => {
      window.cancelAnimationFrame(cuadro);
      window.removeEventListener('resize', colocar);
      window.removeEventListener('scroll', colocar, { capture: true });
    };
  }, [p.visible, p.texto, colocar]);

  useEffect(() => {
    if (p.visible) burbuja.current?.focus({ preventScroll: true });
  }, [p.visible, p.texto]);

  return (
    <span ref={ancla} className={css.ancla}>
      {p.children}
      {p.visible && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={burbuja}
              role="dialog"
              aria-modal="false"
              aria-label="Recorrido"
              aria-describedby={idTexto}
              tabIndex={-1}
              data-capa-corte=""
              data-arriba={lugar?.arriba ? '' : undefined}
              className={cx(css.burbuja, lugar && css.colocada, p.className)}
              style={lugar ? { left: lugar.x, top: lugar.y, ...vars({ '--flecha-x': `${lugar.flechaX}px` }) } : { left: -9999, top: -9999 }}
            >
              <span className={css.flecha} aria-hidden="true" />
              <div className={css.fila}>
                <span className={css.marca} aria-hidden="true" />
                <p className={css.texto} id={idTexto}>
                  {p.texto}
                </p>
                <BotonIcono icono="X" etiqueta="Cerrar recorrido" tamano="sm" alPulsar={p.alEntendido} className={cx(css.cerrar)} />
              </div>
              <div className={css.acciones}>
                {p.esUltimo ? (
                  <Boton variante="primario" tamano="sm" alPulsar={p.alEntendido}>
                    Entendido
                  </Boton>
                ) : (
                  <>
                    <Boton variante="fantasma" tamano="sm" alPulsar={p.alEntendido}>
                      Entendido
                    </Boton>
                    <Boton variante="primario" tamano="sm" iconoFinal="ArrowRight" alPulsar={p.alSiguiente}>
                      Siguiente
                    </Boton>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
