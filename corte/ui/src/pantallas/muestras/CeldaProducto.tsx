/**
 * Celda «Producto» de Todas cuando Tienda y Variante no caben como columnas propias (columnasTodas, columnas.ts): foto
 * de 40 + nombre corto en una línea y, debajo, la tienda (con su cuadro de color, 02 §7.17) y la variante en text-3.
 * Así el nombre del producto se lee completo en 1280 en vez de quedar en «Conjunto deportivo …» junto a una columna de
 * tienda también cortada («SHINE O…»).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { AvatarTienda, Foto } from '@/componentes';
import { nombreDe } from './logica';
import { cx } from './util';
import css from './Todas.module.css';

export function CeldaProductoPlegada(p: { m: C.MuestraVista }): ReactElement {
  const { m } = p;
  const nombre = nombreDe(m);
  const sub = m.variante ? `${m.tienda.nombre} · ${m.variante}` : m.tienda.nombre;
  return (
    <span className={cx(css.celdaProducto)}>
      <Foto url={m.producto.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.celdaFoto)} />
      <span className={cx(css.celdaTextos)}>
        <span className={cx(css.celdaNombre)} title={m.producto.titulo ?? nombre}>
          {nombre}
        </span>
        <span className={cx(css.celdaSub)} title={sub}>
          <AvatarTienda nombre={m.tienda.nombre} tamano={16} className={cx(css.celdaAvatar)} />
          <span className={cx(css.celdaSubTexto)}>{sub}</span>
        </span>
      </span>
    </span>
  );
}
