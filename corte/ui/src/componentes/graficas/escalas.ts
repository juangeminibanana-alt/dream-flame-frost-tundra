/** Escalas y medidas de las gráficas SVG propias (02 §9). Sin dependencias. */

/** Marcas "bonitas" del eje Y: 0 · paso · 2 pasos… con a lo más `objetivo` intervalos (pasos 1/2/2.5/5 × 10^k). */
export function marcasEje(maximo: number, objetivo = 4): number[] {
  if (!Number.isFinite(maximo) || maximo <= 0) return [0, 1];
  const crudo = maximo / objetivo;
  const potencia = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * potencia).find((p) => maximo / p <= objetivo) ?? 10 * potencia;
  const marcas: number[] = [];
  for (let v = 0; v < maximo + paso * 0.001; v += paso) marcas.push(Math.round(v * 1e6) / 1e6);
  if ((marcas[marcas.length - 1] ?? 0) < maximo) marcas.push(Math.round(((marcas[marcas.length - 1] ?? 0) + paso) * 1e6) / 1e6);
  return marcas;
}

/** Ancho aproximado de un texto de 11 px (para reservar el margen del eje y decidir qué etiquetas caben). */
export function anchoTexto(texto: string, px = 11): number {
  let a = 0;
  for (const ch of texto) a += /[0-9]/.test(ch) ? 0.58 : /[il.,:;'|!\s]/.test(ch) ? 0.3 : /[MW%$m]/.test(ch) ? 0.82 : 0.56;
  return a * px;
}

/** Trayecto de una barra vertical con el extremo de datos redondeado a 4 px y la base recta (02 §9.4.4). */
export function barraVertical(x: number, ancho: number, yBase: number, yTope: number, radio = 4, redondear = true): string {
  const alto = Math.max(0, yBase - yTope);
  if (alto <= 0) return '';
  const r = redondear ? Math.min(radio, alto, ancho / 2) : 0;
  const x1 = x + ancho;
  if (r <= 0) return `M${x} ${yBase}V${yTope}H${x1}V${yBase}Z`;
  return `M${x} ${yBase}V${yTope + r}Q${x} ${yTope} ${x + r} ${yTope}H${x1 - r}Q${x1} ${yTope} ${x1} ${yTope + r}V${yBase}Z`;
}

/** 'marzo 2026: $1,234 de comisión, 56 unidades' → ['$1,234 de comisión, 56 unidades', 'marzo 2026']. */
export function partirAria(aria: string, respaldo: string): { valor: string; etiqueta: string } {
  const i = aria.indexOf(': ');
  if (i <= 0) return { valor: aria, etiqueta: respaldo };
  return { valor: aria.slice(i + 2), etiqueta: aria.slice(0, i) };
}

/** Cada cuántas etiquetas del eje X se pinta una para que no se encimen (cota inferior; ver etiquetasEje). */
export function pasoEtiquetas(etiquetas: string[], anchoRanura: number): number {
  const mayor = Math.max(0, ...etiquetas.map((e) => anchoTexto(e)));
  if (anchoRanura <= 0) return 1;
  return Math.max(1, Math.ceil((mayor + 8) / anchoRanura));
}

export type AnclaTexto = 'start' | 'middle' | 'end';

/** Centra un texto en `centro` salvo que se salga de [min, max]: entonces se ancla al borde que cruza. */
export function anclarTexto(centro: number, ancho: number, min: number, max: number): { x: number; ancla: AnclaTexto } {
  if (centro + ancho / 2 > max) return { x: max, ancla: 'end' };
  if (centro - ancho / 2 < min) return { x: min, ancla: 'start' };
  return { x: centro, ancla: 'middle' };
}

/** Extremos [izquierdo, derecho] de un texto ya anclado. */
export function extremosTexto(x: number, ancho: number, ancla: AnclaTexto): [number, number] {
  const izq = ancla === 'start' ? x : ancla === 'end' ? x - ancho : x - ancho / 2;
  return [izq, izq + ancho];
}

/**
 * Ancho de barra como el lienzo aprobado: la ranura menos el gap del lienzo (Main: semanas con gap 10 y tope de 46;
 * Ventas: meses con gap 14 y tope de 64), así a 1280 y a 1440 da 46 y 64 como el lienzo. En ranuras angostas el gap
 * fijo dejaría barras de hilo (30 días a 600), así que nunca baja del 62 % de la ranura ni de 4 px.
 */
export function anchoBarra(ranura: number, medidaLienzo: number, gapLienzo = 10): number {
  return Math.min(medidaLienzo, Math.max(4, ranura * 0.62, ranura - gapLienzo));
}

/** Caja [izq, der, arriba, abajo] en coordenadas del SVG. */
export type Caja = readonly [number, number, number, number];

/** ¿Dos cajas se tocan (con `aire` px de margen)? */
export function seEnciman(a: Caja, b: Caja, aire = 3): boolean {
  return a[0] < b[1] + aire && b[0] < a[1] + aire && a[2] < b[3] + aire && b[2] < a[3] + aire;
}

/** Tamaño de los rótulos directos (micro, 02 §4.2) y su interlínea. */
export const PX_ROTULO = 11;
export const ALTO_RENGLON_ROTULO = 12;
/** La base del rótulo va 7 px sobre el tope de su barra. */
const SOBRE_TOPE = 7;
/** Margen mínimo entre un rótulo y cualquier barra u otro rótulo. */
const AIRE_ROTULO = 3;
/** Lo más que se sube el «en curso» sobre su sitio para librar una barra vecina (dos renglones); más lejos ya no se lee
 *  como de su columna y se quita (el periodo en curso sigue marcado por el contorno, la lectura y la tabla gemela). */
const ELEVACION_MAXIMA = 2 * ALTO_RENGLON_ROTULO;
/** Lo más que un rótulo puede asomar por arriba del SVG (el margen superior del área es de 22 px). */
const TECHO = -4;

/** Un rótulo listo para pintar: renglones, x y ancla (centrado y anclado al borde en [0, ancho]), base del ÚLTIMO
 *  renglón y su caja. */
export interface RotuloColocado {
  renglones: string[];
  x: number;
  ancla: AnclaTexto;
  yBase: number;
  caja: Caja;
}

/** Coloca un rótulo de uno o varios renglones centrado en `centro` (anclado al borde si se saldría de [0, ancho]). */
export function colocarRenglones(renglones: string[], centro: number, yBase: number, ancho: number): RotuloColocado {
  const w = Math.max(0, ...renglones.map((r) => anchoTexto(r, PX_ROTULO)));
  const { x, ancla } = anclarTexto(centro, w, 0, ancho);
  const [a, b] = extremosTexto(x, w, ancla);
  return { renglones, x, ancla, yBase, caja: [a, b, yBase - (renglones.length - 1) * ALTO_RENGLON_ROTULO - PX_ROTULO, yBase + 3] };
}

export interface ColumnaRotulable {
  centro: number;
  /** y del tope de la barra (igual a la línea base si la columna vale 0). */
  yTope: number;
  enCurso: boolean;
}

export interface EntradaRotulos {
  columnas: readonly ColumnaRotulable[];
  /** Ancho de barra. */
  barra: number;
  /** y de la línea base. */
  yBase: number;
  /** Ancho del SVG. */
  ancho: number;
  /** El máximo (02 §9.4.6); si su columna va en curso, va encima del «en curso» (y solo si cabe). */
  pico: { i: number; texto: string } | null;
  /** El valor del último periodo, el extremo; va encima del «en curso» si lo hay. */
  ultimo: { i: number; texto: string } | null;
}

export interface Rotulos {
  pico: RotuloColocado | null;
  enCurso: ReadonlyMap<number, RotuloColocado>;
  ultimo: RotuloColocado | null;
}

/**
 * Coloca los rótulos directos de una gráfica de columnas sin que ninguno pise una barra ajena ni a otro rótulo (con
 * 3 px de aire), contando el corrimiento del anclaje al borde del SVG:
 * 1. el pico se pinta siempre; si una barra vecina más alta lo alcanzaría (en las apiladas cuenta lo reembolsado), sube
 *    sobre ella. Si el pico es el periodo en curso, va encima de su «en curso» como el último valor (paso 3);
 * 2. el «en curso»: en un renglón si cabe a lo ancho entre las barras vecinas; si no, en dos ('en' / 'curso'); si ni así,
 *    el que libre a las vecinas por altura; si ninguno, sube sobre la vecina hasta dos renglones; si aun así no cabe,
 *    se quita;
 * 3. el último valor va encima del «en curso» (o 7 px sobre su barra) y solo si no toca ninguna barra ajena ni otro
 *    rótulo; si no cabe no se pinta: el valor sigue en la lectura y en la tabla gemela.
 */
export function colocarRotulos(e: EntradaRotulos): Rotulos {
  const barras: Array<Caja | null> = e.columnas.map((c) => (c.yTope < e.yBase - 0.5 ? [c.centro - e.barra / 2, c.centro + e.barra / 2, c.yTope, e.yBase] : null));
  const ajenas = (i: number): Caja[] => barras.filter((b, j): b is Caja => j !== i && b !== null);
  const cruzaEnX = (c: Caja, b: Caja): boolean => c[0] < b[1] + AIRE_ROTULO && b[0] < c[1] + AIRE_ROTULO;
  const libre = (c: Caja, i: number, otros: readonly Caja[]): boolean =>
    c[2] >= TECHO && ajenas(i).every((b) => !seEnciman(c, b, AIRE_ROTULO)) && otros.every((o) => !seEnciman(c, o, AIRE_ROTULO));
  /** El rótulo en su sitio o, si alguna barra ajena lo alcanza, subido justo sobre la más alta de las que cruza. */
  const subir = (renglones: string[], col: ColumnaRotulable, i: number): RotuloColocado => {
    const base = col.yTope - SOBRE_TOPE;
    const enSuSitio = colocarRenglones(renglones, col.centro, base, e.ancho);
    const tope = Math.min(base, ...ajenas(i).filter((b) => cruzaEnX(enSuSitio.caja, b)).map((b) => b[2] - AIRE_ROTULO - 3));
    return tope < base ? colocarRenglones(renglones, col.centro, tope, e.ancho) : enSuSitio;
  };

  const ocupadas: Caja[] = [];
  const colPico = e.pico ? e.columnas[e.pico.i] : undefined;
  let pico = e.pico && colPico && !colPico.enCurso ? subir([e.pico.texto], colPico, e.pico.i) : null;
  if (pico) ocupadas.push(pico.caja);

  const enCurso = new Map<number, RotuloColocado>();
  e.columnas.forEach((col, i) => {
    if (!col.enCurso) return;
    const base = col.yTope - SOBRE_TOPE;
    const uno = colocarRenglones(['en curso'], col.centro, base, e.ancho);
    const dos = colocarRenglones(['en', 'curso'], col.centro, base, e.ancho);
    const libreAloAncho = (r: RotuloColocado): boolean => ajenas(i).every((b) => !cruzaEnX(r.caja, b)) && libre(r.caja, i, ocupadas);
    const elegido =
      [uno, dos].find(libreAloAncho) ??
      [dos, uno].find((r) => libre(r.caja, i, ocupadas)) ??
      [subir(['en', 'curso'], col, i), subir(['en curso'], col, i)]
        .filter((r) => base - r.yBase <= ELEVACION_MAXIMA && libre(r.caja, i, ocupadas))
        .sort((a, b) => b.yBase - a.yBase)[0];
    if (elegido) {
      enCurso.set(i, elegido);
      ocupadas.push(elegido.caja);
    }
  });

  /** Un valor encima del «en curso» de su columna (o 7 px sobre su barra si no lo hay), solo si no toca nada ajeno. */
  const encima = (texto: string, i: number): RotuloColocado | null => {
    const col = e.columnas[i];
    if (!col) return null;
    const debajo = enCurso.get(i);
    const base = debajo ? debajo.yBase - debajo.renglones.length * ALTO_RENGLON_ROTULO : col.yTope - SOBRE_TOPE;
    const r = colocarRenglones([texto], col.centro, base, e.ancho);
    return libre(r.caja, i, ocupadas.filter((c) => c !== debajo?.caja)) ? r : null;
  };
  // El pico en curso (p. ej. la tasa de reembolso de noviembre) lleva su valor encima del «en curso», si cabe.
  if (e.pico && colPico?.enCurso) {
    pico = encima(e.pico.texto, e.pico.i);
    if (pico) ocupadas.push(pico.caja);
  }
  const ultimo = e.ultimo ? encima(e.ultimo.texto, e.ultimo.i) : null;
  return { pico, enCurso, ultimo };
}

export interface EtiquetaEje {
  i: number;
  x: number;
  ancla: AnclaTexto;
}

/**
 * Etiquetas del eje X que se pintan sin encimarse. Se cuentan DESDE EL FINAL con un paso uniforme (el periodo más
 * reciente siempre lleva la suya) y la que se saldría del área se ancla a su borde: 'end' a la derecha, 'start' a la
 * izquierda. Si al anclarla queda a menos de `separacion` px de su vecina, se prueba el paso siguiente; con paso = n
 * queda solo la última, así que siempre hay respuesta.
 * `obligatorias` (p. ej. la columna pico, que lleva el rótulo arriba) entran siempre que quepan junto a la última: se
 * suman al paso uniforme y se quitan las vecinas no obligatorias que se les enciman. Así a 390 «31 ago» queda debajo de
 * la barra iris en vez de perderse por el adelgazado.
 */
export function etiquetasEje(etiquetas: string[], centro: (i: number) => number, min: number, max: number, separacion = 6, obligatorias: readonly number[] = []): EtiquetaEje[] {
  const n = etiquetas.length;
  if (n === 0) return [];
  const anchos = etiquetas.map((e) => anchoTexto(e));
  const ranura = n > 1 ? Math.abs(centro(1) - centro(0)) : max - min;
  const etiqueta = (i: number): EtiquetaEje => ({ i, ...anclarTexto(centro(i), anchos[i] ?? 0, min, max) });
  const separadas = (a: EtiquetaEje, b: EtiquetaEje): boolean => {
    const [primera, segunda] = a.i < b.i ? [a, b] : [b, a];
    const [, finAqui] = extremosTexto(primera.x, anchos[primera.i] ?? 0, primera.ancla);
    const [inicioSiguiente] = extremosTexto(segunda.x, anchos[segunda.i] ?? 0, segunda.ancla);
    return inicioSiguiente - finAqui >= separacion;
  };
  const caben = (lista: EtiquetaEje[]): boolean => lista.every((e, k) => k === lista.length - 1 || separadas(e, lista[k + 1] as EtiquetaEje));
  const fijas = [...new Set(obligatorias.filter((i) => Number.isInteger(i) && i >= 0 && i < n - 1))];
  const protegidas = new Set([n - 1, ...fijas]);
  for (let paso = pasoEtiquetas(etiquetas, ranura); paso <= n; paso++) {
    const indices = new Set<number>(fijas);
    for (let i = n - 1; i >= 0; i -= paso) indices.add(i);
    const ordenadas = [...indices].sort((a, b) => a - b).map(etiqueta);
    const elegidas = fijas.length === 0 ? ordenadas : ordenadas.filter((e) => protegidas.has(e.i) || ordenadas.every((o) => o === e || !protegidas.has(o.i) || separadas(e, o)));
    if (caben(elegidas)) return elegidas;
  }
  const conFijas = [...protegidas].sort((a, b) => a - b).map(etiqueta);
  return caben(conFijas) ? conFijas : [etiqueta(n - 1)];
}
