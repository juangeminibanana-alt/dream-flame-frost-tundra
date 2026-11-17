/**
 * Cuando una vista cambia sin navegar (éxito del plan, fin de la sesión, cierre de Avisar), el foco va a su título para
 * que el lector de pantalla lo anuncie y el teclado siga desde ahí (02 §12). El título lleva tabIndex={-1}.
 */
import { useEffect, useRef, type RefObject } from 'react';

export function useFocoAlMontar<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return ref;
}
