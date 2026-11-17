/* @/dominio · tiendas e imágenes (02 §7.17, §8): tono e iniciales del avatar de tienda, ícono de categoría del mosaico,
   variantes por ancho y registroImagenes, el almacén de meta_imagenes sin componentes ni DOM (C47). */
import type * as C from '@/contrato';
import type { TonoAvatar, VarianteImagen } from '@firmas/dominio';

// ---------------------------------------------------------------- avatar de tienda (02 §7.17, literal)
const TONOS: readonly TonoAvatar[] = ['iris', 'coral', 'aqua', 'ambar', 'rosa', 'pizarra', 'cielo', 'verde'];
const norm = (t: string): string => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();

function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0) ?? 0;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Mismo nombre, mismo tono en todas las pantallas y en ambos equipos. */
export function tonoTienda(nombre: string): TonoAvatar {
  return TONOS[fnv1a(norm(nombre)) % 8] ?? 'iris';
}

const STOP: ReadonlySet<string> = new Set(['MX', 'SHOP', 'STORE', 'OFFICIAL', 'OFICIAL', 'MEXICO', 'TIENDA', 'US', 'THE', 'DE', 'LA', 'EL']);

/** Moda Clara Boutique → MC · tienda10001 → TI · Águila Norte Sport → ÁN · LUMEQI MX → LU. */
export function inicialesTienda(nombre: string): string {
  const w = nombre.replace(/[_\-.&|/]+/g, ' ').split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
  const s = w.filter((x) => !STOP.has(x.toUpperCase()));
  const ws = s.length ? s : w;
  const c = (x: string): string => x.replace(/[^\p{L}\p{N}]/gu, '');
  const primerCaracter = (x: string): string => Array.from(c(x))[0] ?? '';
  const a = ws[0];
  const b = ws[1];
  if (a !== undefined && b !== undefined) return (primerCaracter(a) + primerCaracter(b)).toUpperCase();
  return Array.from(c(a ?? '?')).slice(0, 2).join('').toUpperCase() || '?';
}

// ---------------------------------------------------------------- ícono de categoría (02 §6, §8.4)
type IconoCategoria = 'Shirt' | 'SportShoe' | 'Wallet' | 'Gorra' | 'Tag';
const REGLAS_CATEGORIA: ReadonlyArray<[RegExp, IconoCategoria]> = [
  [/sombrer|gorra|\bhats?\b|\bcaps?\b/, 'Gorra'],
  [/calzado|tenis|bota|\bboots?\b|zapat|sandalia|chancla|sneaker|\bshoes?\b/, 'SportShoe'],
  [/cartera|billetera|wallet|cinturon|\bbelts?\b/, 'Wallet'],
  [/camis|playera|sudadera|chamarra|chaqueta|abrigo|chaleco|\bpolos?\b|sueter|\bropa\b|\btops?\b|conjunto|\bsets?\b|jean|pantalon|\bshorts?\b|jersey|hoodie|shirt|jacket|\bvests?\b|boxer/, 'Shirt'],
];

function iconoDe(texto: string): IconoCategoria | null {
  for (const [patron, icono] of REGLAS_CATEGORIA) if (patron.test(texto)) return icono;
  return null;
}

/** category_chains (hoja o ruta 'Ropa interior y de hombre > Camisas y abrigos > Sudaderas'). Manda la hoja; si la
 *  hoja no dice nada, la ruta completa; si tampoco, 'Tag'. */
export function iconoCategoria(categoria: string | null | undefined): IconoCategoria {
  if (!categoria) return 'Tag';
  const n = norm(categoria);
  const partes = n.split(/\s*(?:›|>|\/)\s*/).filter((p) => p.length > 0);
  const hoja = partes[partes.length - 1] ?? n;
  return iconoDe(hoja) ?? iconoDe(n) ?? 'Tag';
}

// ---------------------------------------------------------------- variantes (02 §8.2)
/** ancho × dpr → siguiente variante hacia arriba (96/240/720; más grande = og). */
export function varianteParaAncho(anchoCss: number, dpr: number): VarianteImagen {
  const px = anchoCss * (dpr > 0 ? dpr : 1);
  if (px <= 96) return 'xs';
  if (px <= 240) return 'sm';
  if (px <= 720) return 'md';
  return 'og';
}

function partirUrl(url: string): [string, string[]] {
  const i = url.indexOf('?');
  const base = i < 0 ? url : url.slice(0, i);
  const params = (i < 0 ? '' : url.slice(i + 1)).split('&').filter((p) => p.length > 0 && !p.startsWith('t='));
  return [base, params];
}

/** Agrega o reemplaza '&t=' conservando '?v='. 'og' quita t. */
export function urlConVariante(url: C.UrlImagen, variante: VarianteImagen): string {
  const [base, params] = partirUrl(url);
  if (variante !== 'og') params.push(`t=${variante}`);
  return params.length > 0 ? `${base}?${params.join('&')}` : base;
}

/** Clave de registroImagenes: la URL sin '&t=…'. Una URL con '?v=0' (imagen aún no descargada, C45) no tiene clave. */
export function claveImagen(url: string): string | null {
  const [base, params] = partirUrl(url);
  if (params.includes('v=0')) return null;
  return params.length > 0 ? `${base}?${params.join('&')}` : base;
}

// ---------------------------------------------------------------- registro de meta_imagenes (C47)
export const MAXIMO_REGISTRO_IMAGENES = 2000;
const mapa = new Map<string, C.ImagenMeta>();
const suscriptores = new Set<() => void>();
let contador = 0;

function iguales(a: C.ImagenMeta, b: C.ImagenMeta): boolean {
  return a.w === b.w && a.h === b.h && a.lqip === b.lqip && a.color === b.color;
}

function avisar(): void {
  contador += 1;
  for (const fn of [...suscriptores]) fn();
}

/**
 * Almacén en memoria de meta_imagenes, sin componentes: @/datos registra lo que llega en cada respuesta (y la copia de
 * Android) y <Foto> lo lee con useSyncExternalStore. Clave = URL sin '&t=…'; '?v=0' nunca tiene entrada. Máx. 2000
 * entradas: registrar de nuevo una URL la vuelve la más reciente y se expulsan las más viejas.
 */
export const registroImagenes = {
  registrar(meta: C.MetaImagenes | undefined): void {
    if (!meta) return;
    let cambio = false;
    for (const [url, im] of Object.entries(meta)) {
      const clave = claveImagen(url);
      if (clave === null) continue;
      const previa = mapa.get(clave);
      mapa.delete(clave);
      mapa.set(clave, { w: im.w, h: im.h, lqip: im.lqip, color: im.color });
      if (!previa || !iguales(previa, im)) cambio = true;
    }
    while (mapa.size > MAXIMO_REGISTRO_IMAGENES) {
      const masVieja = mapa.keys().next();
      if (masVieja.done === true) break;
      mapa.delete(masVieja.value);
    }
    if (cambio) avisar();
  },
  leer(url: C.UrlImagen | null | undefined): C.ImagenMeta | undefined {
    if (!url) return undefined;
    const clave = claveImagen(url);
    return clave === null ? undefined : mapa.get(clave);
  },
  /** Devuelve la función para desuscribirse. Avisa una vez por cada registrar() que cambió algo. */
  suscribir(fn: () => void): () => void {
    suscriptores.add(fn);
    return () => {
      suscriptores.delete(fn);
    };
  },
  /** Contador que sube en cada cambio (getSnapshot de useSyncExternalStore). */
  version(): number {
    return contador;
  },
  vaciar(): void {
    if (mapa.size === 0) return;
    mapa.clear();
    avisar();
  },
};
