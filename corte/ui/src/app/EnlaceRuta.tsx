/**
 * @/app · enlace interno accesible (01 §3.1). Es un <a href="#/…"> de verdad (se anuncia como enlace, se puede copiar),
 * pero navega con navegar(): cuenta en el historial propio y la vista nueva empieza arriba. Ctrl+clic, Mayús+clic y el
 * clic central no abren otra ventana: se ignora el modificador y se navega aquí mismo. Si el destino es la ruta actual,
 * lleva aria-current="page".
 */
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import { navegar, normalizarDestino, useRuta } from './navegacion';
import { partirHash } from './tablaRutas';

export function EnlaceRuta(p: { a: string; children: ReactNode; className?: string; 'aria-label'?: string; reemplazar?: boolean }): ReactElement {
  const destino = normalizarDestino(p.a);
  const r = useRuta();
  const actual = partirHash(destino).ruta === r.ruta;
  const ir = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navegar(destino, p.reemplazar ? { reemplazar: true } : {});
  };
  const auxiliar = (e: MouseEvent<HTMLAnchorElement>): void => {
    // Clic central: nunca otra ventana.
    if (e.button === 1) ir(e);
  };
  return (
    <a
      href={`#${destino}`}
      className={p.className}
      aria-label={p['aria-label']}
      aria-current={actual ? 'page' : undefined}
      onClick={ir}
      onAuxClick={auxiliar}
    >
      {p.children}
    </a>
  );
}
