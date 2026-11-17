/* @/dominio · texto: nombre corto (01_ux §6.0), normalizador de títulos (02 §4.4), {producto} de los mensajes
   (01_ux §4.8) y búsqueda sin acentos ni mayúsculas. Los largos se miden en caracteres (puntos de código), como el hub. */

/** Prefijos promocionales entre 【】 o [] (con o sin "BUEN FIN" delante): el mismo patrón que el hub (analitica_ref). */
const PREFIJO = /^\s*(?:(?:BUEN FIN\s*)?(?:【[^】]{0,40}】|\[[^\]]{0,40}\])\s*)+/i;
const TALLA = /^(?:XXS|XS|S|M|L|XL|XXL|XXXL|\d?X{1,3}L)$/i;
/** Corte del paso 2 de 01_ux §6.0: primera coma, punto, punto y coma, barra vertical o " - ". */
const CORTE = /[,.;|]| - /;
/** Sustantivos genéricos de 01_ux §4.8 (lista fija), comparados sin acentos y en minúsculas. */
const GENERICOS: ReadonlySet<string> = new Set([
  'playera', 'camiseta', 'camisa', 'polo', 'chaqueta', 'chamarra', 'sudadera', 'sueter', 'chaleco', 'pantalon', 'jeans',
  'gorra', 'sombrero', 'cartera', 'tenis', 'botas', 'botin', 'conjunto', 'paquete', 'pack', 'boxer', 'toalla',
]);

function cp(texto: string): string[] {
  return Array.from(texto);
}

function largo(texto: string): number {
  return cp(texto).length;
}

function primeros(texto: string, n: number): string {
  return cp(texto).slice(0, n).join('');
}

export function sinAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').normalize('NFC');
}

/** 02 §4.4 regla 1: si ≥ 60 % de las letras son mayúsculas y hay más de 12 letras, minúsculas con mayúscula inicial
 *  (se conservan los tokens cortos con dígitos y las tallas: 3D, XL, 2x). Si no, el título tal cual (sin espacios a
 *  los lados). Los nombres de tienda nunca pasan por aquí. */
export function normalizarTitulo(titulo: string): string {
  const letras = titulo.match(/\p{L}/gu) ?? [];
  const mayusculas = titulo.match(/\p{Lu}/gu) ?? [];
  if (letras.length <= 12 || mayusculas.length / letras.length < 0.6) return titulo.trim();
  const tokens = titulo.trim().split(/(\s+)/);
  const salida = tokens.map((tk) => {
    if (/^\s+$/.test(tk)) return tk;
    if ((/\d/.test(tk) && largo(tk) <= 4) || TALLA.test(tk)) return tk;
    return tk.toLocaleLowerCase('es-MX');
  });
  const unido = salida.join('');
  const i = unido.search(/\p{L}/u);
  if (i < 0) return unido;
  return unido.slice(0, i) + unido.charAt(i).toLocaleUpperCase('es-MX') + unido.slice(i + 1);
}

/** Pasos 1 y 2 de 01_ux §6.0 sobre el título ya normalizado: [título limpio, primera frase]. */
function limpioYFrase(titulo: string): [string, string] {
  const sinPrefijo = titulo.replace(PREFIJO, '').trim();
  const limpio = normalizarTitulo(sinPrefijo || titulo.trim());
  const frase = (limpio.split(CORTE)[0] ?? '').trim();
  return [limpio, frase];
}

function cortarEnPalabra(texto: string, n: number): string {
  if (largo(texto) <= n) return texto;
  const corte = primeros(texto, n);
  const espacio = corte.lastIndexOf(' ');
  return (espacio > 0 ? corte.slice(0, espacio) : corte).trimEnd();
}

/**
 * Nombre corto (01_ux §6.0), normalizado (02 §4.4): 1) sin prefijos 【…】/[…]; 2) hasta la primera , . ; | o " - ";
 * 3) si pasa de `max` (48) caracteres, se corta en el último espacio antes de `max` y se agrega «…»; 4) si queda en
 * menos de 12, los primeros `max` del título limpio. `max` se acota a 12..59, así que el resultado cabe en los 60 del
 * contrato. El nombre corto que escriba el usuario siempre gana: quien lo tenga lo usa en lugar de llamar aquí.
 */
export function nombreCorto(titulo: string | null, max: number = 48): string {
  if (!titulo || !titulo.trim()) return '';
  const limite = Math.max(12, Math.min(Math.floor(max), 59));
  const [limpio, frase] = limpioYFrase(titulo);
  let t = frase;
  if (largo(t) > limite) t = cortarEnPalabra(t, limite) + '…';
  if (largo(t) < 12) t = primeros(limpio, limite).trimEnd();
  return t;
}

/** {producto} de 01_ux §4.8 ("Nombre para mensajes" de §6.0): pasos 1 y 2 del nombre corto, sin «…», tope de 80
 *  caracteres en palabra completa; la primera letra pasa a minúscula solo si la primera palabra es un sustantivo
 *  genérico de la lista fija ("polo de hombre…"); las marcas quedan igual ("AcmeFit 4 Camisetas…"). */
export function nombreParaMensaje(titulo: string | null): string {
  if (!titulo || !titulo.trim()) return '';
  const [limpio, frase] = limpioYFrase(titulo);
  let t = cortarEnPalabra(frase || limpio, 80);
  const primera = sinAcentos((t.split(/\s+/)[0] ?? '').toLocaleLowerCase('es-MX'));
  if (GENERICOS.has(primera)) t = t.charAt(0).toLocaleLowerCase('es-MX') + t.slice(1);
  return t;
}

function normalizarBusqueda(texto: string): string {
  return sinAcentos(texto.toLocaleLowerCase('es-MX'));
}

function palabrasDe(busqueda: string): string[] {
  return normalizarBusqueda(busqueda).split(/\s+/).filter((p) => p.length > 0);
}

/** Búsqueda que ignora acentos y mayúsculas; true si TODAS las palabras aparecen en algún campo. */
export function coincide(busqueda: string, ...campos: Array<string | null | undefined>): boolean {
  const palabras = palabrasDe(busqueda);
  if (palabras.length === 0) return true;
  const normalizados = campos.filter((c): c is string => typeof c === 'string').map(normalizarBusqueda);
  return palabras.every((p) => normalizados.some((c) => c.includes(p)));
}

/** Rangos [inicio, fin) del texto ORIGINAL (índices de JavaScript) que coinciden con alguna palabra, sin acentos ni
 *  mayúsculas, ordenados y sin traslapes (para <mark>). */
export function resaltar(busqueda: string, texto: string): Array<[number, number]> {
  const palabras = palabrasDe(busqueda);
  if (palabras.length === 0 || texto.length === 0) return [];
  // Se normaliza carácter por carácter para conservar el mapa de posiciones hacia el texto original.
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
      desde = normal.indexOf(p, desde + 1);
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

/** uuid4 (crypto.randomUUID del entorno; respaldo con crypto.getRandomValues). */
export function nuevoId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  const b = new Uint8Array(16);
  if (typeof c?.getRandomValues === 'function') c.getRandomValues(b);
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = ((b[6] ?? 0) & 0x0f) | 0x40;
  b[8] = ((b[8] ?? 0) & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
