/**
 * Columnas de la tabla que CABEN en su marco (02 §7.5: sin texto cortado ni scroll horizontal). La Tabla de
 * @/componentes solo quita las `prescindible` en ancho 'media'; en expandida (1180–1439, ~968 px útiles) las columnas
 * fijas de @/bloques suman más que el marco y la columna flexible del nombre (minmax(0, fr)) se queda en 0.
 * (Copia por carpeta: las pantallas no importan de otra carpeta de pantallas, BUILD_SPEC §8.2.)
 * Aquí se mide el marco y se quitan columnas de menor a mayor prioridad hasta que cada columna flexible tenga su
 * mínimo. El orden de las que quedan no cambia. Sin medida (happy-dom, primer cuadro sin layout) no se quita nada.
 */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ColumnaTabla } from '@/componentes';

/** Holgura para el borde del marco y el redondeo de las pistas. */
const HOLGURA = 8;

export interface ReglaColumnas {
  /** Ids de mayor a menor prioridad. Las que no estén en la lista se quitan primero. */
  prioridad: readonly string[];
  /** Ids que nunca se quitan. */
  fijas: readonly string[];
  /** Ancho mínimo (px) de cada columna flexible ('fr'); por omisión 160. */
  minimos?: Readonly<Record<string, number>>;
}

/** px fijos; 'minmax(200px, 1.6fr)' → 200 (o el mínimo de la regla si es mayor); '2fr' → el de la regla o 160. */
export function anchoMinimo<T>(c: ColumnaTabla<T>, minimos: Readonly<Record<string, number>> | undefined): number {
  if (typeof c.ancho === 'number') return c.ancho;
  const propio = typeof c.ancho === 'string' ? /^\s*minmax\(\s*(\d+(?:\.\d+)?)px/.exec(c.ancho)?.[1] : undefined;
  const deRegla = minimos?.[c.id];
  if (propio !== undefined) return Math.max(Number(propio), deRegla ?? 0);
  if (typeof c.ancho === 'string' && /^\s*\d+(?:\.\d+)?px\s*$/.test(c.ancho)) return parseFloat(c.ancho);
  return deRegla ?? 160;
}

/** Función pura (probada aparte): columnas que caben en `ancho` px según la regla. */
export function columnasQueCaben<T>(columnas: readonly ColumnaTabla<T>[], ancho: number, regla: ReglaColumnas): ColumnaTabla<T>[] {
  if (!(ancho > 0)) return [...columnas];
  const rango = (id: string): number => {
    const i = regla.prioridad.indexOf(id);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  const quedan = new Set(columnas.map((c) => c.id));
  const suma = (): number => columnas.filter((c) => quedan.has(c.id)).reduce((s, c) => s + anchoMinimo(c, regla.minimos), 0);
  const candidatas = columnas
    .filter((c) => !regla.fijas.includes(c.id))
    .sort((a, b) => rango(b.id) - rango(a.id));
  for (const c of candidatas) {
    if (suma() + HOLGURA <= ancho) break;
    quedan.delete(c.id);
  }
  return columnas.filter((c) => quedan.has(c.id));
}

/** Mide el marco (ResizeObserver) y devuelve las columnas que caben; `ref` va en el contenedor de la Tabla. */
export function useColumnasQueCaben<T>(columnas: readonly ColumnaTabla<T>[], regla: ReglaColumnas): {
  ref: (el: HTMLDivElement | null) => void;
  columnas: ColumnaTabla<T>[];
} {
  const [ancho, setAncho] = useState(0);
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const reglaRef = useRef(regla);
  reglaRef.current = regla;
  const ref = useCallback((nodo: HTMLDivElement | null) => setEl(nodo), []);

  useLayoutEffect(() => {
    if (!el) return undefined;
    const medir = (): void => setAncho(Math.floor(el.clientWidth));
    medir();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const o = new ResizeObserver(medir);
    o.observe(el);
    return () => o.disconnect();
  }, [el]);

  const visibles = useMemo(() => sinPrescindibles(columnasQueCaben(columnas, ancho, reglaRef.current)), [columnas, ancho]);
  return { ref, columnas: visibles };
}

/**
 * Quien decide qué columnas caben es la medida, no la clase de ancho: la Tabla quita TODAS las `prescindible` en 'media'
 * (600–1179) aunque sobre espacio (a 960 la de Productos se quedaba con 3 columnas en 816 px). Las que ya pasaron por
 * columnasQueCaben caben, así que se entregan sin esa marca.
 */
export function sinPrescindibles<T>(columnas: readonly ColumnaTabla<T>[]): ColumnaTabla<T>[] {
  return columnas.map((c) => (c.prescindible ? { ...c, prescindible: false } : c));
}
