/** Ancestro con scroll vertical (o el documento) para guardar y restaurar la posición al volver (02 §7.6). */
export function ancestroConScroll(el: HTMLElement | null): HTMLElement {
  let actual = el?.parentElement ?? null;
  while (actual && actual !== document.body) {
    const estilo = getComputedStyle(actual);
    if (/(auto|scroll|overlay)/.test(estilo.overflowY) && actual.scrollHeight > actual.clientHeight) return actual;
    actual = actual.parentElement;
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}

/**
 * Ancestro (o el propio elemento) que desplaza en horizontal, o null si ninguno lo hace antes de <body>. Sirve para
 * anclar algo al visor y no al ancho total de su contenido (p. ej. el vacío de una Tabla más ancha que su tarjeta).
 */
export function visorHorizontal(el: HTMLElement | null): HTMLElement | null {
  let actual = el;
  while (actual && actual !== document.body) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(actual).overflowX)) return actual;
    actual = actual.parentElement;
  }
  return null;
}

export function esCampoEditable(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const etiqueta = t.tagName;
  return etiqueta === 'INPUT' || etiqueta === 'TEXTAREA' || etiqueta === 'SELECT' || t.isContentEditable;
}
