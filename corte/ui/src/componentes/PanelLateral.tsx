/**
 * Panel lateral de 480 (02 §7.12): a la derecha, alto completo, surface-3, borde izquierdo y sombra 4. Entra deslizando
 * 24 px con fundido en 280 ms y sale en 200. Velo --overlay-scrim, foco atrapado, Esc cierra y el foco vuelve a quien lo
 * abrió (la fila). Encabezado con ⤢ "Abrir en página completa" (si hay alExpandir) y ✕; pie fijo surface-3.
 * Quien lo usa decide si cabe (usePanelDisponible de @/app).
 */
import { useId, useRef, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import type { PanelLateralProps } from '@firmas/componentes';
import { BotonIcono } from './BotonIcono';
import { useCapa } from './util/capas';
import { cx } from './util/clases';
import { useAtraparFoco } from './util/foco';
import { usePresencia } from './util/presencia';
import css from './PanelLateral.module.css';

export function PanelLateral(p: PanelLateralProps): ReactElement | null {
  const { montada, saliendo } = usePresencia(p.abierto);
  const panel = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  useCapa(p.abierto, true, p.alCerrar);
  useAtraparFoco(panel, p.abierto && montada);
  if (!montada || typeof document === 'undefined') return null;
  const alExpandir = p.alExpandir;
  return createPortal(
    <div className={cx(css.raiz, saliendo && css.saliendo)} data-capa-corte="">
      <div className={css.velo} aria-hidden="true" onClick={() => p.alCerrar()} />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={idTitulo} tabIndex={-1} className={cx(css.panel, p.className)}>
        <header className={css.cabeza}>
          <h2 className={css.titulo} id={idTitulo}>
            {p.titulo}
          </h2>
          <div className={css.acciones}>
            {alExpandir ? <BotonIcono icono="Maximize2" etiqueta="Abrir en página completa" tamano="sm" alPulsar={() => alExpandir()} /> : null}
            <BotonIcono icono="X" etiqueta="Cerrar" tamano="sm" alPulsar={() => p.alCerrar()} />
          </div>
        </header>
        <div className={css.cuerpo}>{p.children}</div>
        {p.pie ? <footer className={css.pie}>{p.pie}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
