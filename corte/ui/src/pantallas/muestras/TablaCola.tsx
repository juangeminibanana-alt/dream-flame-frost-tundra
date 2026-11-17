/**
 * Vista Tabla de Pendientes (Windows, 01 §3.7 «Tabla densa ↔ lista de tarjetas», 02 §7.5): Tabla de @/componentes con
 * columnasMuestras('pendientes') de @/bloques (trae su columna «Acción»), ajustadas al ancho (columnas.ts), en el orden
 * visible de la cola. J/K y ↑/↓ mueven la selección (con el panel abierto cambian de muestra sin cerrarlo), Enter abre
 * y E hace la acción principal. Si las columnas no caben (panel abierto), Pendientes usa la lista de tarjetas.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Tabla, type ColumnaTabla } from '@/componentes';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

export function TablaCola(p: {
  filas: C.MuestraVista[];
  columnas: ColumnaTabla<C.MuestraVista>[];
  seleccionada: string | null;
  esNueva: (m: C.MuestraVista) => boolean;
  alSeleccionar: (m: C.MuestraVista) => void;
  alAbrir: (m: C.MuestraVista) => void;
}): ReactElement {
  return (
    <Tabla<C.MuestraVista>
      filas={p.filas}
      columnas={p.columnas}
      idFila={(m) => m.application_id}
      etiqueta={T.tablaEtiqueta}
      seleccionada={p.seleccionada}
      alSeleccionar={p.alSeleccionar}
      alAbrir={p.alAbrir}
      esNueva={p.esNueva}
      claveScroll="muestras-pendientes-tabla"
      className={cx(css.tablaCola)}
    />
  );
}
