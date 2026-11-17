/**
 * Código manual de emparejamiento (BUILD_SPEC C6, 04 §C.4): 12 caracteres Crockford base32 en 3 grupos de 4
 * ('K7QM-3XRA-9TPF'). La entrada tolera minúsculas, espacios y guiones, O→0 e I/L→1; lo demás se ignora.
 * También lee los enlaces creatorhub://pair?… que llegan de fuera (04 §B.9: nunca emparejan solos).
 */

/** Alfabeto de Crockford: sin I, L, O ni U. */
export const ALFABETO_CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const LARGO_CODIGO = 12;

/** Deja solo los caracteres válidos del código, en mayúsculas y con las equivalencias de C6 (máx. 12). */
export function normalizarCodigo(texto: string): string {
  let salida = '';
  for (const original of texto.toUpperCase()) {
    const c = original === 'O' ? '0' : original === 'I' || original === 'L' ? '1' : original;
    if (!ALFABETO_CROCKFORD.includes(c)) continue;
    salida += c;
    if (salida.length === LARGO_CODIGO) break;
  }
  return salida;
}

/** 'K7QM3XRA9TPF' → 'K7QM-3XRA-9TPF' (también con un código a medias: 'K7QM3' → 'K7QM-3'). */
export function agruparCodigo(normalizado: string): string {
  const grupos: string[] = [];
  for (let i = 0; i < normalizado.length; i += 4) grupos.push(normalizado.slice(i, i + 4));
  return grupos.join('-');
}

export function codigoCompleto(normalizado: string): boolean {
  return normalizado.length === LARGO_CODIGO && normalizarCodigo(normalizado) === normalizado;
}

/** IPv4 privada (10/8, 172.16/12, 192.168/16): las únicas que acepta el protocolo LAN. */
export function esIpPrivada(ip: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip.trim());
  if (!m) return false;
  const o = m.slice(1).map(Number);
  if (o.some((n) => n > 255)) return false;
  const [a = 0, b = 0] = o;
  return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

export interface EnlaceEmparejar {
  /** Texto completo, tal cual llegó (es lo que se le pasa a emparejarConQr). */
  texto: string;
  hostId: string;
  direcciones: string[];
}

/** Lee 'creatorhub://pair?v=1&h=…&a=ip,ip&p=…&s=…&f=…'. null si no es un enlace de Corte o no trae IP privada. */
export function leerEnlaceEmparejar(texto: string): EnlaceEmparejar | null {
  const limpio = texto.trim();
  if (!/^creatorhub:\/\/pair\?/i.test(limpio)) return null;
  const consulta = new URLSearchParams(limpio.slice(limpio.indexOf('?') + 1));
  const hostId = consulta.get('h') ?? '';
  const direcciones = (consulta.get('a') ?? '').split(',').map((x) => x.trim()).filter(esIpPrivada);
  if (consulta.get('v') !== '1' || !/^[0-9a-f]{32}$/i.test(hostId) || direcciones.length === 0 || !consulta.get('s')) return null;
  return { texto: limpio, hostId: hostId.toLowerCase(), direcciones };
}

/** ¿El texto leído de un QR es un enlace de emparejamiento de Corte? */
export function esQrDeCorte(texto: string): boolean {
  return leerEnlaceEmparejar(texto) !== null;
}
