/**
 * Hoja inferior (02 §7.12, solo Android; en Windows se muestra como Modal de 440). surface-3, radio 28 arriba, asa de
 * 36×4, puntos de anclaje (por omisión 50 % y 92 % del alto). Sigue al dedo 1:1 con transform; se cierra arrastrando
 * hacia abajo más del 30 % de lo visible o a más de 0.5 px/ms. role=dialog aria-modal, foco atrapado, Esc cierra y
 * <html data-overlay> apaga el vidrio mientras está abierta.
 */
import { useId, useLayoutEffect, useRef, useState, type PointerEvent, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import type { HojaProps } from '@firmas/componentes';
import { BotonIcono } from './BotonIcono';
import { Modal } from './Modal';
import { useCapa } from './util/capas';
import { cx, vars } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import { useAtraparFoco } from './util/foco';
import { usePresencia } from './util/presencia';
import css from './Hoja.module.css';

interface Arrastre {
  inicioY: number;
  inicioT: number;
  dy: number;
  id: number;
}

function HojaAndroid(p: HojaProps): ReactElement | null {
  const { montada, saliendo } = usePresencia(p.abierta);
  const hoja = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  const [baja, setBaja] = useState(0);
  const [alta, setAlta] = useState(true);
  const [arrastre, setArrastre] = useState<Arrastre | null>(null);
  const anclas = p.anclas ?? [0.5, 0.92];
  useCapa(p.abierta, true, p.alCerrar);
  useAtraparFoco(hoja, p.abierta && montada);

  // Si el contenido pasa del primer ancla, la hoja abre en ese ancla y se puede subir hasta el segundo.
  // Ancla al abrir: si el contenido pasa del primer ancla, la hoja abre en ese ancla y se sube hasta el segundo.
  // Con pie (acción principal) abre siempre completa (hasta el segundo ancla): la acción nunca queda fuera de la vista.
  const conPie = !!p.pie;
  useLayoutEffect(() => {
    if (!montada || !hoja.current) return;
    const altoHoja = hoja.current.offsetHeight;
    const altoVentana = window.innerHeight || 0;
    const desplazamiento = Math.max(0, Math.round(altoHoja - anclas[0] * altoVentana));
    setBaja(conPie ? 0 : desplazamiento);
    setAlta(conPie || desplazamiento === 0);
  }, [montada, anclas[0], anclas[1], conPie]);

  if (!montada || typeof document === 'undefined') return null;

  const base = alta ? 0 : baja;
  const dy = arrastre?.dy ?? 0;
  const traslado = Math.max(alta ? 0 : -baja, dy) + base;

  const alBajar = (e: PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrastre({ inicioY: e.clientY, inicioT: performance.now(), dy: 0, id: e.pointerId });
  };
  const alMover = (e: PointerEvent<HTMLDivElement>): void => {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    setArrastre({ ...arrastre, dy: e.clientY - arrastre.inicioY });
  };
  const alSoltar = (e: PointerEvent<HTMLDivElement>): void => {
    if (!arrastre || arrastre.id !== e.pointerId) return;
    const visible = (hoja.current?.offsetHeight ?? 0) - base;
    const t = Math.max(1, performance.now() - arrastre.inicioT);
    const velocidad = arrastre.dy / t;
    setArrastre(null);
    if (arrastre.dy > 0 && (arrastre.dy > visible * 0.3 || velocidad > 0.5)) {
      p.alCerrar();
    } else if (arrastre.dy < -40 && !alta) {
      setAlta(true);
    } else if (arrastre.dy > 40 && alta && baja > 0) {
      setAlta(false);
    }
  };

  const manejadores = { onPointerDown: alBajar, onPointerMove: alMover, onPointerUp: alSoltar, onPointerCancel: alSoltar };

  return createPortal(
    <div className={cx(css.raiz, saliendo && css.saliendo)} data-capa-corte="">
      <div className={css.velo} aria-hidden="true" onClick={() => p.alCerrar()} />
      <div className={css.marco}>
        <div
          ref={hoja}
          role="dialog"
          aria-modal="true"
          aria-labelledby={idTitulo}
          tabIndex={-1}
          className={cx(css.hoja, arrastre && css.arrastrando, p.className)}
          style={vars({ '--alto-max': `${Math.round(anclas[1] * 100)}dvh`, '--traslado': `${traslado}px` })}
        >
          <div className={css.asa} {...manejadores} aria-hidden="true">
            <span className={css.asaBarra} />
          </div>
          <header className={css.cabeza} {...manejadores}>
            <h2 className={css.titulo} id={idTitulo}>
              {p.titulo}
            </h2>
            <BotonIcono icono="X" etiqueta="Cerrar" alPulsar={() => p.alCerrar()} />
          </header>
          <div className={css.cuerpo}>{p.children}</div>
          {p.pie ? (
            <footer className={css.pie} data-pie-modal="">
              {p.pie}
            </footer>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Hoja(p: HojaProps): ReactElement | null {
  const plataforma = usePlataformaHtml();
  if (plataforma !== 'android') {
    return (
      <Modal abierto={p.abierta} titulo={p.titulo} alCerrar={p.alCerrar} ancho={440} {...(p.pie ? { pie: p.pie } : {})} {...(p.className ? { className: p.className } : {})}>
        {p.children}
      </Modal>
    );
  }
  return <HojaAndroid {...p} />;
}
