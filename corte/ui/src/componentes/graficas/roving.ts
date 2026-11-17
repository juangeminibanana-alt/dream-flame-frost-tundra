/**
 * Foco itinerante entre las marcas de una gráfica: una sola parada de Tab y las flechas recorren las marcas (02 §12.2:
 * cada marca es enfocable y tiene aria-label, sin llenar la página de paradas de Tab).
 */
import { useRef, useState, type KeyboardEvent, type RefObject } from 'react';

export interface Roving {
  foco: number;
  setFoco: (i: number) => void;
  contenedor: RefObject<SVGSVGElement | null>;
  alTecla: (e: KeyboardEvent<SVGSVGElement>) => void;
}

/** `filas` > 1 = rejilla (calendario: ↑/↓ saltan 1 y ←/→ saltan `filas`). */
export function useRoving(n: number, filas = 1): Roving {
  const [foco, setFocoEstado] = useState(0);
  const contenedor = useRef<SVGSVGElement>(null);
  const ir = (i: number): void => {
    if (n <= 0) return;
    const d = Math.max(0, Math.min(n - 1, i));
    setFocoEstado(d);
    contenedor.current?.querySelector<SVGElement>(`[data-marca="${d}"]`)?.focus();
  };
  const alTecla = (e: KeyboardEvent<SVGSVGElement>): void => {
    const horizontal = filas > 1 ? filas : 1;
    const vertical = 1;
    const mapa: Record<string, number> = filas > 1
      ? { ArrowRight: horizontal, ArrowLeft: -horizontal, ArrowDown: vertical, ArrowUp: -vertical }
      : { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 };
    if (e.key in mapa) {
      e.preventDefault();
      ir(foco + (mapa[e.key] ?? 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      ir(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      ir(n - 1);
    }
  };
  return { foco: Math.min(foco, Math.max(0, n - 1)), setFoco: setFocoEstado, contenedor, alTecla };
}
