/**
 * Modal (02 §7.13): solo confirmaciones y formularios cortos. 440 de ancho (312–560 en Android), surface-3, radio 20,
 * sombra 4, padding 20. Título title2 y descripción de 14 en text-2. Pie a la derecha (Cancelar fantasma + acción
 * primaria o peligro). Entra con scale(.96→1) y fundido en 200 ms. role=dialog aria-modal, foco atrapado, Esc cierra y
 * Enter confirma el botón primario del pie. `completoEnCompacta` ocupa toda la pantalla por debajo de 600.
 */
import { useId, useRef, type KeyboardEvent, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import type { ModalProps } from '@firmas/componentes';
import { BotonIcono } from './BotonIcono';
import { useCapa } from './util/capas';
import { cx } from './util/clases';
import { useAtraparFoco } from './util/foco';
import { usePresencia } from './util/presencia';
import css from './Modal.module.css';

const NO_CONFIRMA = 'textarea, button, a[href], select, [role="button"], [role="radio"], [role="switch"], [role="checkbox"], [contenteditable="true"]';

export function Modal(p: ModalProps): ReactElement | null {
  const { montada, saliendo } = usePresencia(p.abierto);
  const dialogo = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  const idDescripcion = useId();
  useCapa(p.abierto, true, p.alCerrar);
  useAtraparFoco(dialogo, p.abierto && montada);

  if (!montada || typeof document === 'undefined') return null;

  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== 'Enter' || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.nativeEvent.isComposing) return;
    const destino = e.target as HTMLElement;
    if (destino.closest(NO_CONFIRMA)) return;
    const primario = dialogo.current?.querySelector<HTMLButtonElement>('[data-pie-modal] button[data-variante="primario"]:not(:disabled), [data-pie-modal] button[data-variante="peligro"]:not(:disabled)');
    if (!primario) return;
    e.preventDefault();
    primario.click();
  };

  return createPortal(
    <div className={cx(css.raiz, saliendo && css.saliendo)} data-capa-corte="">
      <div className={css.velo} aria-hidden="true" onClick={() => p.alCerrar()} />
      <div
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        {...(p.descripcion ? { 'aria-describedby': idDescripcion } : {})}
        tabIndex={-1}
        className={cx(css.dialogo, css[`a${p.ancho ?? 440}`], p.completoEnCompacta && css.completo, p.className)}
        onKeyDown={alTecla}
      >
        <header className={css.cabeza}>
          <div className={css.textos}>
            <h2 className={css.titulo} id={idTitulo}>
              {p.titulo}
            </h2>
            {p.descripcion ? (
              <p className={css.descripcion} id={idDescripcion}>
                {p.descripcion}
              </p>
            ) : null}
          </div>
          <BotonIcono icono="X" etiqueta="Cerrar" tamano="sm" alPulsar={() => p.alCerrar()} className={cx(css.cerrar)} />
        </header>
        {p.children ? <div className={css.cuerpo}>{p.children}</div> : null}
        {p.pie ? (
          <footer className={css.pie} data-pie-modal="">
            {p.pie}
          </footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
