/** Enlaces a rutas hash (BUILD_SPEC §8.6) sin depender de @/app: '/ventas' → '#/ventas'. */
export function hrefDeRuta(a: string): string {
  if (a.startsWith('#')) return a;
  return `#${a.startsWith('/') ? a : `/${a}`}`;
}

/** Quita un "›" final del texto (el componente pone su propio chevrón). */
export function sinChevron(texto: string): string {
  return texto.replace(/\s*›\s*$/, '');
}
