/**
 * Capa flotante de Muestras (botón flotante, barra de acciones fija del detalle y barra de selección del celular).
 * Se pinta en document.body con un portal: un ancestro con transform (p. ej. la animación de entrada de la pantalla,
 * que deja `transform` animado) convertiría `position: fixed` en relativo a ese ancestro y la barra quedaría al final de
 * la página en vez de pegada abajo.
 * Con `className`, la capa es un contenedor que reacciona si una capa global anclada abajo (la tarjeta «¿Le enviaste el
 * mensaje…?», un aviso) la taparía (capas.ts), así nunca se enciman:
 *   - 'subir' (por omisión): sube lo justo (`--holgura`) para quedar encima de ella (barras de acciones y de selección);
 *   - 'ocultar': se oculta mientras la otra capa está ahí y vuelve cuando se va (el botón flotante: subirlo lo dejaba a
 *     media pantalla, encima de la búsqueda; la tarjeta pide una respuesta de un toque y después el botón regresa).
 */
import { useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useHolguraInferior } from './capas';
import { vars } from './util';

export function Flotante(p: { children: ReactNode; className?: string; role?: string; 'aria-label'?: string; alTaparse?: 'subir' | 'ocultar' }): ReactElement | null {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const holgura = useHolguraInferior(p.className ? el : null);
  if (typeof document === 'undefined') return null;
  if (!p.className) return createPortal(p.children, document.body);
  const ocultar = p.alTaparse === 'ocultar';
  const tapada = holgura > 0;
  return createPortal(
    <div
      ref={setEl}
      className={p.className}
      style={vars({ '--holgura': `${ocultar ? 0 : holgura}px` })}
      data-holgura={tapada && !ocultar ? '' : undefined}
      data-tapada={tapada && ocultar ? '' : undefined}
      {...(tapada && ocultar ? { inert: true, 'aria-hidden': true } : {})}
      {...(p.role ? { role: p.role } : {})}
      {...(p['aria-label'] ? { 'aria-label': p['aria-label'] } : {})}
    >
      {p.children}
    </div>,
    document.body,
  );
}
