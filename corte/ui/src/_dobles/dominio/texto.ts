/* __DOBLE_CORTE__ · doble de @/dominio: texto (nombre corto de 01_ux §6.0, normalizador de 02 §4.4, búsqueda). */

const PREFIJO = /^\s*(?:(?:BUEN FIN\s*)?(?:【[^】]{0,40}】|\[[^\]]{0,40}\])\s*)+/i;
const TALLA = /^(?:XXS|XS|S|M|L|XL|XXL|XXXL|\d?X{1,3}L)$/i;
const GENERICOS = new Set([
  'polo', 'playera', 'playeras', 'camisa', 'camisas', 'camiseta', 'camisetas', 'chamarra', 'chamarras', 'chaqueta',
  'sudadera', 'sudaderas', 'conjunto', 'conjuntos', 'paquete', 'gorra', 'gorras', 'sombrero', 'cartera', 'cinturón',
  'tenis', 'botas', 'suéter', 'chaleco', 'chalecos', 'pantalón', 'pantalones', 'short', 'shorts', 'jeans', 'set',
]);

export function sinAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize('NFC');
}

/** 02 §4.4 regla 1: si ≥ 60 % de las letras son mayúsculas y hay más de 12 letras, minúsculas con mayúscula inicial
 *  (se conservan los tokens cortos con dígitos y las tallas: 3D, XL, 2x). */
export function normalizarTitulo(titulo: string): string {
  const letras = titulo.match(/\p{L}/gu) ?? [];
  const mayusculas = titulo.match(/\p{Lu}/gu) ?? [];
  if (letras.length <= 12 || mayusculas.length / letras.length < 0.6) return titulo.trim();
  const tokens = titulo.trim().split(/(\s+)/);
  const salida = tokens.map((tk) => {
    if (/^\s+$/.test(tk)) return tk;
    if ((/\d/.test(tk) && tk.length <= 4) || TALLA.test(tk)) return tk;
    return tk.toLocaleLowerCase('es-MX');
  });
  const unido = salida.join('');
  const i = unido.search(/\p{L}/u);
  if (i < 0) return unido;
  return unido.slice(0, i) + unido.charAt(i).toLocaleUpperCase('es-MX') + unido.slice(i + 1);
}

function limpiar(titulo: string): string {
  const sinPrefijo = titulo.replace(PREFIJO, '').trim();
  return normalizarTitulo(sinPrefijo || titulo.trim());
}

/** Nombre corto (01_ux §6.0): sin prefijos 【…】, hasta la primera , . ; | o ' - ', cortado en palabra antes de 48
 *  caracteres con «…» (≤ 49; siempre ≤ 60 del contrato); si queda < 12, los primeros 48 del título limpio. */
export function nombreCorto(titulo: string | null, max: number = 48): string {
  if (!titulo) return '';
  const limite = Math.max(12, Math.min(max, 59));
  const limpio = limpiar(titulo);
  let t = (limpio.split(/[,.;|]| - /)[0] ?? '').trim();
  if (t.length > limite) {
    const corte = t.slice(0, limite);
    const espacio = corte.lastIndexOf(' ');
    t = (espacio > 0 ? corte.slice(0, espacio) : corte).trimEnd() + '…';
  }
  if (t.length < 12) t = limpio.slice(0, limite).trimEnd();
  return t;
}

/** {producto} de 01_ux §4.8: pasos 1 y 2 del nombre corto, sin «…», tope de 80 en palabra completa; minúscula inicial
 *  solo si empieza con un sustantivo genérico de la lista fija. */
export function nombreParaMensaje(titulo: string | null): string {
  if (!titulo) return '';
  const limpio = limpiar(titulo);
  let t = (limpio.split(/[,.;|]| - /)[0] ?? '').trim();
  if (t.length > 80) {
    const corte = t.slice(0, 80);
    const espacio = corte.lastIndexOf(' ');
    t = (espacio > 0 ? corte.slice(0, espacio) : corte).trimEnd();
  }
  const primera = (t.split(/\s+/)[0] ?? '').toLocaleLowerCase('es-MX');
  if (GENERICOS.has(primera)) t = t.charAt(0).toLocaleLowerCase('es-MX') + t.slice(1);
  return t;
}

function normalizarBusqueda(texto: string): string {
  return sinAcentos(texto.toLocaleLowerCase('es-MX'));
}

/** Búsqueda que ignora acentos y mayúsculas; true si TODAS las palabras aparecen en algún campo. */
export function coincide(busqueda: string, ...campos: Array<string | null | undefined>): boolean {
  const palabras = normalizarBusqueda(busqueda).split(/\s+/).filter((p) => p.length > 0);
  if (palabras.length === 0) return true;
  const normalizados = campos.filter((c): c is string => typeof c === 'string').map(normalizarBusqueda);
  return palabras.every((p) => normalizados.some((c) => c.includes(p)));
}

/** Rangos [inicio, fin) del texto ORIGINAL que coinciden con alguna palabra (sin acentos ni mayúsculas). */
export function resaltar(busqueda: string, texto: string): Array<[number, number]> {
  const palabras = normalizarBusqueda(busqueda).split(/\s+/).filter((p) => p.length > 0);
  if (palabras.length === 0 || texto.length === 0) return [];
  // Normaliza carácter por carácter para conservar el mapa de posiciones hacia el texto original.
  let normal = '';
  const origen: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    const n = normalizarBusqueda(texto.charAt(i));
    for (let k = 0; k < n.length; k++) origen.push(i);
    normal += n;
  }
  const rangos: Array<[number, number]> = [];
  for (const p of palabras) {
    let desde = normal.indexOf(p);
    while (desde >= 0) {
      const ini = origen[desde];
      const fin = origen[desde + p.length - 1];
      if (ini !== undefined && fin !== undefined) rangos.push([ini, fin + 1]);
      desde = normal.indexOf(p, desde + Math.max(1, p.length));
    }
  }
  rangos.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const unidos: Array<[number, number]> = [];
  for (const r of rangos) {
    const ultimo = unidos[unidos.length - 1];
    if (ultimo && r[0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], r[1]);
    else unidos.push([r[0], r[1]]);
  }
  return unidos;
}

export function nuevoId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  const hex = (n: number): string => Math.floor(Math.random() * 16 ** n).toString(16).padStart(n, '0');
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${hex(3)}-${hex(12)}`;
}
