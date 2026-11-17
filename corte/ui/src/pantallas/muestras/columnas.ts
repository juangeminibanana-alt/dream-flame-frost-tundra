/**
 * Columnas de las tablas de Muestras que CABEN en el ancho disponible (Windows, 02 §7.5). columnasMuestras() de
 * @/bloques da la lista completa de cada contexto, con anchos pensados para una ventana amplia: todas juntas no caben
 * en la tabla de 968 px (ventana de 1280) ni en la de 816 (ventana mínima de 960) y, sin mínimos, sus columnas «fr»
 * quedaban en 0 px. Aquí, sin tocar las celdas:
 *   - cada columna cuenta con su mínimo: el px fijo, el de un minmax(<mín>px, …) o, si llega un «fr» pelón, uno
 *     legible (Producto 208–220 px, el resto 110–150 px) que se escribe como minmax(<mín>px, <n>fr);
 *   - si la suma de mínimos no cabe, se quitan columnas secundarias en un orden fijo (las prescindibles primero);
 *   - si ni así caben, `caben` = false y la vista usa tarjetas (TarjetaMuestra) en lugar de la tabla.
 * Funciona con cualquier lista: lo que no reconoce se trata por su `ancho` y su bandera `prescindible`.
 */
import { useEffect, useState } from 'react';
import type { ColumnaTabla } from '@/componentes';

export interface AjusteColumnas {
  /** Ancho fijo (px) que reemplaza el de la columna: chips que de otro modo se cortan con «…». */
  anchos?: Readonly<Record<string, number>>;
  /** Pista que reemplaza la de la columna (p. ej. 'minmax(200px, 2.4fr)'): su mínimo es el px del minmax. */
  pistas?: Readonly<Record<string, string>>;
  /** Mínimo (px) de cada columna fr por id; sin dato: 208 la primera fr y 110 las demás. */
  minimos?: Readonly<Record<string, number>>;
  /** Ids que se quitan primero, en este orden, si no cabe todo. Después, cualquier otra prescindible (de la última a la primera). */
  descartar?: readonly string[];
  /** Ids que nunca se quitan. */
  fijas?: readonly string[];
}

const ES_FR = /^\s*(\d+(?:\.\d+)?)fr\s*$/;

function minimoDe<T>(c: ColumnaTabla<T>, primeraFr: boolean, ajuste: AjusteColumnas): number {
  const fijo = ajuste.anchos?.[c.id];
  if (fijo !== undefined) return fijo;
  const ancho = ajuste.pistas?.[c.id] ?? c.ancho;
  if (typeof ancho === 'number') return ancho;
  if (typeof ancho === 'string') {
    if (ES_FR.test(ancho)) return ajuste.minimos?.[c.id] ?? (primeraFr ? 208 : 110);
    const px = /^\s*(\d+)px\s*$/.exec(ancho);
    if (px) return Number(px[1]);
    const mm = /minmax\(\s*(\d+)px/.exec(ancho);
    return mm ? Number(mm[1]) : 0;
  }
  return ajuste.minimos?.[c.id] ?? 110;
}

/** Columna con su pista ajustada (fr → minmax(mín, fr); anchos fijos y pistas reemplazados). */
function ajustar<T>(c: ColumnaTabla<T>, primeraFr: boolean, ajuste: AjusteColumnas): ColumnaTabla<T> {
  const fijo = ajuste.anchos?.[c.id];
  if (fijo !== undefined) return { ...c, ancho: fijo };
  const pista = ajuste.pistas?.[c.id];
  if (pista !== undefined) return { ...c, ancho: pista };
  if (typeof c.ancho === 'string' && ES_FR.test(c.ancho)) return { ...c, ancho: `minmax(${minimoDe(c, primeraFr, ajuste)}px, ${c.ancho.trim()})` };
  return c;
}

export function sumaMinimos<T>(columnas: readonly ColumnaTabla<T>[], ajuste: AjusteColumnas = {}): number {
  const primera = columnas.find((c) => typeof c.ancho === 'string' && ES_FR.test(c.ancho))?.id;
  return columnas.reduce((s, c) => s + minimoDe(c, c.id === primera, ajuste), 0);
}

/**
 * Las columnas que caben en `ancho` px. `ancho` ≤ 0 (aún sin medir) devuelve todas ajustadas y caben = true, para no
 * cambiar de vista en el primer cuadro.
 */
export function columnasQueCaben<T>(columnas: readonly ColumnaTabla<T>[], ancho: number, ajuste: AjusteColumnas = {}): { columnas: ColumnaTabla<T>[]; caben: boolean; quitadas: string[] } {
  const primera = columnas.find((c) => typeof c.ancho === 'string' && ES_FR.test(c.ancho))?.id;
  const minimo = (c: ColumnaTabla<T>): number => minimoDe(c, c.id === primera, ajuste);
  let visibles = [...columnas];
  const quitadas: string[] = [];
  if (ancho > 0) {
    const fijas = new Set(ajuste.fijas ?? []);
    const orden = [
      ...(ajuste.descartar ?? []),
      ...[...columnas].reverse().filter((c) => c.prescindible).map((c) => c.id),
    ].filter((id, i, l) => l.indexOf(id) === i && !fijas.has(id));
    const suma = (): number => visibles.reduce((s, c) => s + minimo(c), 0);
    for (const id of orden) {
      if (suma() <= ancho) break;
      if (!visibles.some((c) => c.id === id)) continue;
      visibles = visibles.filter((c) => c.id !== id);
      quitadas.push(id);
    }
    if (suma() > ancho) return { columnas: visibles.map((c) => ajustar(c, c.id === primera, ajuste)), caben: false, quitadas };
  }
  return { columnas: visibles.map((c) => ajustar(c, c.id === primera, ajuste)), caben: true, quitadas };
}

/** Ancho en px de un elemento (ResizeObserver) con una ref de función: mide aunque el elemento aparezca después de
 *  cargar. 0 mientras no se mide. */
export function useAncho<E extends HTMLElement>(): [(el: E | null) => void, number] {
  const [el, setEl] = useState<E | null>(null);
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    if (!el) return undefined;
    const medir = (): void => setAncho(Math.floor(el.getBoundingClientRect().width));
    medir();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const o = new ResizeObserver(medir);
    o.observe(el);
    return () => o.disconnect();
  }, [el]);
  return [setEl, ancho];
}

/** Ajuste de «Todas» (01 §4.7): sin Variante, Promesa, ¿Vendió?, Tu avance ni Comisión si no caben (en ese orden).
 *  «Estado en TikTok» (CeldaEstado: chip del grupo + motivo debajo) mide 196 y Tu avance 172; «Precio de venta (≈)» y
 *  «Comisión por venta» suben a 160/164 para que su encabezado (con la flecha de orden) se lea completo, sin «…»; y
 *  Producto y Tienda ceden un poco de mínimo: en 1280 (tabla de 968) caben las 6 esenciales, Comisión incluida, y en
 *  1440 (1128) además Tu avance. Los mínimos solo se usan si una columna llega con un «fr» sin mínimo. */
export const AJUSTE_TODAS: AjusteColumnas = {
  anchos: { tiktok: 196, avance: 172, precio: 160, comision: 164 },
  pistas: { producto: 'minmax(204px, 2.4fr)', tienda: 'minmax(120px, 1.3fr)' },
  minimos: { producto: 208, tienda: 110, variante: 110 },
  descartar: ['variante', 'promesa', 'vendio', 'avance', 'comision'],
  fijas: ['producto', 'tiktok', 'solicitada', 'precio'],
};

/** Columnas de Todas que se pliegan dentro de «Producto» (CeldaProductoPlegada) cuando no caben todas como propias. */
export const PLEGADAS_EN_PRODUCTO: readonly string[] = ['tienda', 'variante'];

/** Ajuste de Todas con Tienda y Variante plegadas en Producto: Producto queda con 300 px de mínimo (el nombre corto se
 *  lee completo) y salen primero Promesa, ¿Vendió?, Tu avance y Comisión. En 1280 (tabla de 968) caben Producto,
 *  Estado, Solicitada, Precio y Comisión; en 1440 (1128) además Tu avance; en 960 (816), sin Comisión. */
export const AJUSTE_TODAS_PLEGADA: AjusteColumnas = {
  anchos: { tiktok: 196, avance: 172, precio: 160, comision: 164 },
  pistas: { producto: 'minmax(300px, 3fr)' },
  descartar: ['promesa', 'vendio', 'avance', 'comision'],
  fijas: ['producto', 'tiktok', 'solicitada', 'precio'],
};

/**
 * Columnas de Todas (01 §4.7) para un ancho de tabla: si caben las 10 tal cual (AJUSTE_TODAS), van así; si no, Tienda y
 * Variante pasan a la segunda línea de Producto (`celdaPlegada`) y del resto van las que caben (AJUSTE_TODAS_PLEGADA).
 * Sin medir (0) se usa la forma plegada, que es la de casi todas las ventanas (la completa pide ~1480 px de tabla).
 */
export function columnasTodas<T>(columnas: readonly ColumnaTabla<T>[], ancho: number, celdaPlegada: ColumnaTabla<T>['celda']): { columnas: ColumnaTabla<T>[]; caben: boolean; quitadas: string[]; plegada: boolean } {
  if (ancho > 0 && sumaMinimos(columnas, AJUSTE_TODAS) <= ancho) return { ...columnasQueCaben(columnas, ancho, AJUSTE_TODAS), plegada: false };
  const plegadas = columnas.filter((c) => !PLEGADAS_EN_PRODUCTO.includes(c.id)).map((c) => (c.id === 'producto' ? { ...c, celda: celdaPlegada } : c));
  const r = columnasQueCaben(plegadas, ancho, AJUSTE_TODAS_PLEGADA);
  const plegadasIds = PLEGADAS_EN_PRODUCTO.filter((id) => columnas.some((c) => c.id === id));
  return { ...r, quitadas: [...plegadasIds, ...r.quitadas], plegada: true };
}

/** Ajuste de la vista Tabla de Pendientes (01 §4.2): sin «Por qué», Comisión, Tu avance ni Tienda si no caben. */
export const AJUSTE_PENDIENTES: AjusteColumnas = {
  minimos: { producto: 220, tienda: 110, razones: 150 },
  descartar: ['razones', 'comision', 'avance', 'tienda'],
  fijas: ['producto', 'tiktok', 'precio', 'accion'],
};
