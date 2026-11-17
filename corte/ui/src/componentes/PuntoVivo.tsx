/**
 * Punto vivo (02 §7.2): 8 px. Cuando `pulsos` cambia de valor, el halo hace scale(1→2.2) y opacity(.5→0) 3 veces y se
 * detiene. Nunca anima box-shadow; se pausa con la pestaña oculta y no anima con movimiento reducido (.anim-loop).
 * Es decorativo: el texto de estado va al lado.
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { cx } from './util/clases';
import css from './PuntoVivo.module.css';

export function PuntoVivo(p: { estado: 'ok' | 'sincronizando' | 'error' | 'inactivo'; pulsos?: number; className?: string }): ReactElement {
  const previo = useRef(p.pulsos);
  const [ronda, setRonda] = useState(0);
  const [oculto, setOculto] = useState(() => typeof document !== 'undefined' && document.hidden);

  useEffect(() => {
    if (p.pulsos !== undefined && previo.current !== undefined && p.pulsos !== previo.current) setRonda((r) => r + 1);
    previo.current = p.pulsos;
  }, [p.pulsos]);

  useEffect(() => {
    const alCambiar = (): void => setOculto(document.hidden);
    document.addEventListener('visibilitychange', alCambiar);
    return () => document.removeEventListener('visibilitychange', alCambiar);
  }, []);

  return (
    <span className={cx(css.punto, css[p.estado], 'fc-fill', p.className)} aria-hidden="true" data-estado={p.estado}>
      {ronda > 0 ? <span key={ronda} className={cx(css.halo, 'anim-loop')} data-pausado={oculto ? '' : undefined} /> : null}
    </span>
  );
}
