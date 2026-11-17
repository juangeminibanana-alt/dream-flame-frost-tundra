/** Encabezado compacto de la muestra dentro de una hoja: foto de 48, nombre corto, tienda y variante. */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Foto } from '@/componentes';
import { nombreDe } from '../util/comun';
import css from './hojas.module.css';

export function MuestraEnHoja(p: { m: C.MuestraVista }): ReactElement {
  const { m } = p;
  const nombre = nombreDe(m.producto);
  return (
    <div className={css.muestra}>
      <Foto url={m.producto.imagen} alt={nombre} anchoCss={48} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
      <div className={css.muestraTextos}>
        <span className={css.muestraNombre}>{nombre}</span>
        <span className={css.muestraMeta}>
          {m.tienda.nombre}
          {m.variante ? ` · ${m.variante}` : ''}
        </span>
      </div>
    </div>
  );
}
