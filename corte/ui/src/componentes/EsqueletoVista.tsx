/**
 * Contenedor de la primera carga (02 §7.15): UNA sola animación de opacidad (1.4 s, alternada) para todos sus
 * esqueletos; estático con movimiento reducido (.anim-loop). A los 3 s agrega el aviso de carga lenta.
 */
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './EsqueletoVista.module.css';

export const TEXTO_LENTO = 'Sigue cargando… revisa la conexión con tu PC';

export function EsqueletoVista(p: { children: ReactNode; textoLento?: string; className?: string }): ReactElement {
  const [lento, setLento] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLento(true), 3000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div className={cx(css.vista, p.className)} role="status" aria-busy="true" aria-live="polite">
      <span className={css.sr}>Cargando…</span>
      <div className={cx(css.formas, 'anim-loop')} aria-hidden="true">
        {p.children}
      </div>
      {lento ? (
        <p className={css.lento}>
          <Icono nombre="Clock" tamano={16} />
          {p.textoLento ?? TEXTO_LENTO}
        </p>
      ) : null}
    </div>
  );
}
