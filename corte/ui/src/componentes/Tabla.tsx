/**
 * Tabla densa (02 §7.5, 01 §3.6): role=grid con aria-rowcount/aria-rowindex. Filas de --row-h (52 cómoda · 40
 * compacta), encabezado de 36 pegajoso, columnas numéricas a la derecha. Teclado: J/K y ↑/↓ mueven la selección,
 * Inicio/Fin y RePág/AvPág saltan, Enter (o doble clic) abre. Seleccionada: surface-selected + barra interior de 3 px.
 * Las acciones de fila aparecen con hover, foco o selección. Virtual con @tanstack/react-virtual desde 100 filas
 * (overscan 6) y restauración del scroll con `claveScroll`. Las columnas `prescindible` se ocultan en ancho 'media'.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ColumnaTabla, TablaProps } from '@firmas/componentes';
import { Icono } from './Icono';
import { cx, vars } from './util/clases';
import { MEDIA_MEDIA, useFirmaDensidad, useMedia } from './util/entorno';
import { guardarScroll, leerScroll, pxDeVariable } from './util/medidas';
import { ancestroConScroll, esCampoEditable, visorHorizontal } from './util/scroll';
import css from './Tabla.module.css';

const UMBRAL_VIRTUAL = 100;

function pista<T>(c: ColumnaTabla<T>): string {
  if (typeof c.ancho === 'number') return `${c.ancho}px`;
  if (typeof c.ancho === 'string') return /fr$/.test(c.ancho) ? `minmax(0, ${c.ancho})` : c.ancho;
  return 'minmax(0, 1fr)';
}

export function Tabla<T>(p: TablaProps<T>): ReactElement {
  const enMedia = useMedia(MEDIA_MEDIA);
  const firmaDensidad = useFirmaDensidad();
  const columnas = p.columnas.filter((c) => !(c.prescindible && enMedia));
  const virtual = p.virtual ?? p.filas.length >= UMBRAL_VIRTUAL;
  const raiz = useRef<HTMLDivElement>(null);
  const desplazable = useRef<HTMLDivElement>(null);
  const vacio = useRef<HTMLDivElement>(null);
  const ids = useMemo(() => p.filas.map((f) => p.idFila(f)), [p.filas, p.idFila]);
  const [activa, setActiva] = useState<string | null>(p.seleccionada ?? null);
  const focoPendiente = useRef<string | null>(null);
  const [altoFila, setAltoFila] = useState(52);
  // Cada fila es su propia rejilla: una pista 'auto' para las acciones mediría distinto en el encabezado y en cada
  // fila y desalinearía las columnas. Se mide el contenido de las acciones y la pista queda en px fijos para todas.
  const [anchoAcciones, setAnchoAcciones] = useState<number | null>(null);

  useEffect(() => {
    if (p.seleccionada !== undefined) setActiva(p.seleccionada);
  }, [p.seleccionada]);

  useLayoutEffect(() => {
    if (!p.accionesFila) return;
    const celdas = raiz.current?.querySelectorAll<HTMLElement>('[data-acciones-contenido]');
    if (!celdas || celdas.length === 0) return;
    let maximo = 0;
    for (const c of celdas) maximo = Math.max(maximo, c.offsetWidth);
    const ancho = Math.ceil(maximo) + 16;
    if (maximo > 0 && (anchoAcciones === null || Math.abs(ancho - anchoAcciones) > 1)) setAnchoAcciones(ancho);
  });

  useLayoutEffect(() => {
    setAltoFila(pxDeVariable(raiz.current, '--row-h', 52));
  }, [firmaDensidad]);

  // Vacío anclado al visor: si la tabla es más ancha que el contenedor que la desplaza (tarjeta angosta, ventana
  // mínima), el estado vacío se centra en lo que se ve (sticky left:0 + ancho del visor), no en el ancho total.
  const sinFilas = p.filas.length === 0;
  useLayoutEffect(() => {
    const el = vacio.current;
    if (!sinFilas || !el) return undefined;
    const visor = visorHorizontal(el.parentElement);
    if (!visor) {
      el.style.removeProperty('--vacio-ancho');
      return undefined;
    }
    const medir = (): void => {
      const e = getComputedStyle(visor);
      const util = visor.clientWidth - (parseFloat(e.paddingLeft) || 0) - (parseFloat(e.paddingRight) || 0);
      el.style.setProperty('--vacio-ancho', `${Math.max(0, Math.round(util))}px`);
    };
    medir();
    const o = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(medir);
    o?.observe(visor);
    return () => o?.disconnect();
  }, [sinFilas]);

  const virtualizador = useVirtualizer({
    count: virtual ? p.filas.length : 0,
    getScrollElement: () => desplazable.current,
    estimateSize: () => altoFila,
    overscan: 6,
    initialRect: { width: 960, height: 560 },
  });

  useEffect(() => {
    virtualizador.measure();
  }, [altoFila, virtualizador]);

  // Restaurar el scroll al volver (virtual: el propio contenedor; normal: el ancestro con scroll).
  useLayoutEffect(() => {
    const y = leerScroll(p.claveScroll);
    if (y === null) return undefined;
    const destino = virtual ? desplazable.current : ancestroConScroll(raiz.current);
    if (destino) destino.scrollTop = y;
    return undefined;
  }, [p.claveScroll, virtual]);
  useEffect(() => {
    if (!p.claveScroll) return undefined;
    const clave = p.claveScroll;
    const destino = virtual ? desplazable.current : ancestroConScroll(raiz.current);
    if (!destino) return undefined;
    return () => guardarScroll(clave, destino.scrollTop);
  }, [p.claveScroll, virtual]);

  const indiceActivo = activa ? ids.indexOf(activa) : -1;
  const visibles: number[] = virtual ? virtualizador.getVirtualItems().map((v) => v.index) : ids.map((_, i) => i);
  const idRoving = activa && visibles.some((i) => ids[i] === activa) ? activa : (ids[visibles[0] ?? 0] ?? null);

  useLayoutEffect(() => {
    const id = focoPendiente.current;
    if (!id) return;
    const el = raiz.current?.querySelector<HTMLElement>(`[data-fila="${id.replace(/["\\]/g, '\\$&')}"]`);
    if (el) {
      focoPendiente.current = null;
      el.focus({ preventScroll: virtual });
    }
  });

  const irA = (i: number): void => {
    const n = p.filas.length;
    if (n === 0) return;
    const destino = Math.max(0, Math.min(n - 1, i));
    const fila = p.filas[destino];
    const id = ids[destino];
    if (fila === undefined || id === undefined) return;
    setActiva(id);
    focoPendiente.current = id;
    if (virtual) virtualizador.scrollToIndex(destino, { align: 'auto' });
    p.alSeleccionar?.(fila);
  };

  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (esCampoEditable(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    const actual = indiceActivo >= 0 ? indiceActivo : -1;
    const k = e.key;
    if (k === 'j' || k === 'J' || k === 'ArrowDown') {
      e.preventDefault();
      irA(actual + 1);
    } else if (k === 'k' || k === 'K' || k === 'ArrowUp') {
      e.preventDefault();
      irA(actual < 0 ? 0 : actual - 1);
    } else if (k === 'Home') {
      e.preventDefault();
      irA(0);
    } else if (k === 'End') {
      e.preventDefault();
      irA(p.filas.length - 1);
    } else if (k === 'PageDown') {
      e.preventDefault();
      irA(actual + 10);
    } else if (k === 'PageUp') {
      e.preventDefault();
      irA(actual - 10);
    } else if (k === 'Enter') {
      const enFila = e.target instanceof HTMLElement && e.target.getAttribute('role') === 'row';
      const fila = actual >= 0 ? p.filas[actual] : undefined;
      if (enFila && fila !== undefined && p.alAbrir) {
        e.preventDefault();
        p.alAbrir(fila);
      }
    }
  };

  const plantilla = [...columnas.map(pista), ...(p.accionesFila ? [anchoAcciones !== null ? `${anchoAcciones}px` : 'max-content'] : [])].join(' ');

  const pintarFila = (i: number, estilo?: { top: number; alto: number }): ReactElement | null => {
    const fila = p.filas[i];
    const id = ids[i];
    if (fila === undefined || id === undefined) return null;
    const seleccionada = id === (p.seleccionada !== undefined ? p.seleccionada : activa);
    const nueva = p.esNueva?.(fila) ?? false;
    return (
      <div
        key={id}
        role="row"
        aria-rowindex={i + 2}
        aria-selected={seleccionada}
        tabIndex={id === idRoving ? 0 : -1}
        data-fila={id}
        data-index={i}
        className={cx(css.fila, seleccionada && css.seleccionada, seleccionada && 'fc-selected', virtual && css.filaVirtual)}
        style={estilo ? vars({ '--y': `${estilo.top}px` }) : undefined}
        onClick={() => {
          setActiva(id);
          p.alSeleccionar?.(fila);
        }}
        onDoubleClick={() => p.alAbrir?.(fila)}
        onFocus={(e) => {
          if (e.target === e.currentTarget) setActiva(id);
        }}
      >
        {columnas.map((c, ci) => (
          <div key={c.id} role="gridcell" className={cx(css.celda, c.alineacion === 'derecha' && css.derecha, c.alineacion === 'centro' && css.centro)}>
            {ci === 0 && nueva ? (
              <span className={css.nueva} title="Cambió desde tu última visita">
                <span className={css.sr}>Cambió desde tu última visita</span>
              </span>
            ) : null}
            {c.celda(fila)}
          </div>
        ))}
        {p.accionesFila ? (
          <div role="gridcell" className={css.acciones}>
            <span className={css.accionesContenido} data-acciones-contenido="">
              {p.accionesFila(fila)}
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  const encabezado = (
    <div role="row" aria-rowindex={1} className={css.encabezado}>
      {columnas.map((c) => {
        const ordenada = p.orden?.columna === c.id ? p.orden.direccion : null;
        const ariaSort = ordenada === 'asc' ? 'ascending' : ordenada === 'desc' ? 'descending' : c.ordenable ? 'none' : undefined;
        return (
          <div key={c.id} role="columnheader" aria-sort={ariaSort} className={cx(css.th, c.alineacion === 'derecha' && css.derecha, c.alineacion === 'centro' && css.centro)}>
            {c.ordenable && p.alOrdenar ? (
              <button type="button" className={cx(css.ordenar, ordenada && css.ordenActivo)} onClick={() => p.alOrdenar?.(c.id)}>
                <span className={css.thTexto} title={c.titulo}>{c.titulo}</span>
                <Icono nombre={ordenada ? 'ChevronDown' : 'ArrowDownUp'} tamano={14} className={cx(css.flechaOrden, ordenada === 'asc' && css.asc)} />
              </button>
            ) : (
              <span className={css.thTexto} title={c.titulo}>
                {c.titulo}
              </span>
            )}
          </div>
        );
      })}
      {p.accionesFila ? (
        <div role="columnheader" className={css.th}>
          <span className={css.sr}>Acciones</span>
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      ref={raiz}
      role="grid"
      aria-label={p.etiqueta}
      aria-rowcount={p.filas.length + 1}
      aria-colcount={columnas.length + (p.accionesFila ? 1 : 0)}
      className={cx(css.tabla, virtual && css.virtual, p.className)}
      style={vars({ '--plantilla': plantilla })}
      onKeyDown={alTecla}
    >
      <div
        ref={desplazable}
        className={css.desplazable}
        onScroll={virtual && p.claveScroll ? (e) => guardarScroll(p.claveScroll, e.currentTarget.scrollTop) : undefined}
      >
        {encabezado}
        {sinFilas ? (
          <div ref={vacio} className={css.vacio}>
            {p.vacio ?? null}
          </div>
        ) : virtual ? (
          <div role="rowgroup" className={css.cuerpoVirtual} style={{ height: virtualizador.getTotalSize() }}>
            {virtualizador.getVirtualItems().map((v) => pintarFila(v.index, { top: v.start, alto: v.size }))}
          </div>
        ) : (
          <div role="rowgroup">{p.filas.map((_, i) => pintarFila(i))}</div>
        )}
      </div>
    </div>
  );
}
