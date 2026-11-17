/**
 * @/raiz · Android: Ventas contiene un control segmentado fijo Resumen · Videos · Productos (01 §3.3). Las rutas
 * #/ventas, #/videos y #/productos abren la pestaña con su segmento; cambiar de segmento reemplaza la entrada del
 * historial (Atrás no recorre los segmentos). A todo el ancho (02 §7.11).
 */
import type { ReactElement } from 'react';
import { Segmentado } from '@/componentes';
import { navegar } from '../app/navegacion';
import { cx } from '../app/clases';
import type { SegmentoVentas as Id } from './destinos';
import { T } from './textos';
import css from './Marco.module.css';

const OPCIONES: Array<{ valor: Id; etiqueta: string }> = [
  { valor: 'ventas', etiqueta: T.resumen },
  { valor: 'videos', etiqueta: T.videos },
  { valor: 'productos', etiqueta: T.productos },
];

export function SegmentadoVentas(p: { valor: Id }): ReactElement {
  return (
    <div className={css.segmentado} data-segmentado-ventas="">
      <Segmentado
        opciones={OPCIONES}
        valor={p.valor}
        alCambiar={(v) => navegar(`/${v}`, { reemplazar: true })}
        etiqueta={T.segmentoVentas}
        anchoCompleto
        className={cx(css.segmentadoControl)}
      />
    </div>
  );
}
