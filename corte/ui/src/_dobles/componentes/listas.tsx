/* __DOBLE_CORTE__ · doble de @/componentes: Tabla (pinta filas y columnas, selecciona y abre) y ListaVirtual
   (pinta todos los elementos, sin virtualizar). */
import type { KeyboardEvent, ReactElement } from 'react';
import type { ListaVirtualProps, TablaProps } from '@firmas/componentes';
import { Caja, estilosDoble as css } from '../comun/Caja';

export function Tabla<T>(p: TablaProps<T>): ReactElement {
  const resumen = { etiqueta: p.etiqueta, filas: p.filas, columnas: p.columnas, seleccionada: p.seleccionada };
  if (p.filas.length === 0 && p.vacio !== undefined) {
    return (
      <Caja nombre="Tabla" props={resumen} className={p.className}>
        {p.vacio}
      </Caja>
    );
  }
  const alTecla = (fila: T) => (e: KeyboardEvent<HTMLTableRowElement>): void => {
    if (e.key === 'Enter') p.alAbrir?.(fila);
  };
  return (
    <Caja nombre="Tabla" props={resumen} className={p.className}>
      <table role="grid" aria-label={p.etiqueta} className={css.tabla}>
        <thead>
          <tr>
            {p.columnas.map((c) => (
              <th
                key={c.id}
                scope="col"
                aria-sort={p.orden?.columna === c.id ? (p.orden.direccion === 'asc' ? 'ascending' : 'descending') : undefined}
                onClick={c.ordenable && p.alOrdenar ? () => p.alOrdenar?.(c.id) : undefined}
              >
                {c.titulo}
              </th>
            ))}
            {p.accionesFila ? <th scope="col">Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {p.filas.map((fila) => {
            const id = p.idFila(fila);
            return (
              <tr
                key={id}
                aria-selected={p.seleccionada === id}
                data-nueva={p.esNueva?.(fila) ? 'si' : undefined}
                tabIndex={0}
                onClick={() => p.alSeleccionar?.(fila)}
                onDoubleClick={() => p.alAbrir?.(fila)}
                onKeyDown={alTecla(fila)}
              >
                {p.columnas.map((c) => (
                  <td key={c.id}>{c.celda(fila)}</td>
                ))}
                {p.accionesFila ? <td>{p.accionesFila(fila)}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Caja>
  );
}

export function ListaVirtual<T>(p: ListaVirtualProps<T>): ReactElement {
  return (
    <Caja nombre="ListaVirtual" props={{ etiqueta: p.etiqueta, items: p.items }} className={p.className}>
      <ul aria-label={p.etiqueta} className={css.lista}>
        {p.items.map((item, i) => (
          <li key={p.idItem(item)}>{p.render(item, i)}</li>
        ))}
      </ul>
    </Caja>
  );
}
