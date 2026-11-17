/**
 * Lista virtual (02 §7.6): @tanstack/react-virtual con overscan 6; alto de fila leído de --row-h (52 / 40 / 72 + escala
 * de texto) y vuelve a medir si cambian --fs o la densidad. role=grid con aria-rowcount y aria-rowindex; teclado ↑ ↓,
 * Inicio/Fin, RePág/AvPág. Restaura el scroll al volver y después de 3 pantallas aparece "Ir arriba".
 */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUp } from 'lucide-react';
import type { ListaVirtualProps } from '@firmas/componentes';
import { cx, vars } from './util/clases';
import { useFirmaDensidad } from './util/entorno';
import { guardarScroll, leerScroll, pxDeVariable } from './util/medidas';
import { esCampoEditable } from './util/scroll';
import css from './ListaVirtual.module.css';

export function ListaVirtual<T>(p: ListaVirtualProps<T>): ReactElement {
  const contenedor = useRef<HTMLDivElement>(null);
  const firmaDensidad = useFirmaDensidad();
  const [alto, setAlto] = useState(p.altoEstimado ?? 52);
  const [foco, setFoco] = useState(0);
  const [irArriba, setIrArriba] = useState(false);
  const focoPendiente = useRef<number | null>(null);

  useLayoutEffect(() => {
    setAlto(p.altoEstimado ?? pxDeVariable(contenedor.current, '--row-h', 52));
  }, [firmaDensidad, p.altoEstimado]);

  const virtualizador = useVirtualizer({
    count: p.items.length,
    getScrollElement: () => contenedor.current,
    estimateSize: () => alto,
    overscan: 6,
    initialRect: { width: 600, height: 560 },
  });

  useEffect(() => {
    virtualizador.measure();
  }, [alto, virtualizador]);

  useLayoutEffect(() => {
    const y = leerScroll(p.claveScroll);
    if (y !== null && contenedor.current) contenedor.current.scrollTop = y;
  }, [p.claveScroll]);

  useLayoutEffect(() => {
    const i = focoPendiente.current;
    if (i === null) return;
    const el = contenedor.current?.querySelector<HTMLElement>(`[data-index="${i}"]`);
    if (el) {
      focoPendiente.current = null;
      el.focus({ preventScroll: true });
    }
  });

  const irA = (i: number): void => {
    if (p.items.length === 0) return;
    const destino = Math.max(0, Math.min(p.items.length - 1, i));
    setFoco(destino);
    focoPendiente.current = destino;
    virtualizador.scrollToIndex(destino, { align: 'auto' });
  };

  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (esCampoEditable(e.target)) return;
    const pantalla = Math.max(1, Math.floor((contenedor.current?.clientHeight ?? alto * 8) / alto) - 1);
    const saltos: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: pantalla, PageUp: -pantalla };
    if (e.key in saltos) {
      e.preventDefault();
      irA(foco + (saltos[e.key] ?? 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      irA(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      irA(p.items.length - 1);
    }
  };

  const items = virtualizador.getVirtualItems();
  const focoVisible = items.some((v) => v.index === foco) ? foco : (items[0]?.index ?? 0);

  return (
    <div className={cx(css.marco, p.className)}>
      <div
        ref={contenedor}
        role="grid"
        aria-label={p.etiqueta}
        aria-rowcount={p.items.length}
        className={css.lista}
        onKeyDown={alTecla}
        onScroll={(e) => {
          const el = e.currentTarget;
          guardarScroll(p.claveScroll, el.scrollTop);
          setIrArriba(el.scrollTop > el.clientHeight * 3);
        }}
      >
        <div role="rowgroup" className={css.cuerpo} style={{ height: virtualizador.getTotalSize() }}>
          {items.map((v) => {
            const item = p.items[v.index];
            if (item === undefined) return null;
            return (
              <div
                key={p.idItem(item)}
                role="row"
                aria-rowindex={v.index + 1}
                data-index={v.index}
                ref={virtualizador.measureElement}
                tabIndex={v.index === focoVisible ? 0 : -1}
                className={css.fila}
                style={vars({ '--y': `${v.start}px` })}
                onFocus={(e) => {
                  if (e.target === e.currentTarget) setFoco(v.index);
                }}
              >
                <div role="gridcell" className={css.celda}>
                  {p.render(item, v.index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {irArriba ? (
        <button
          type="button"
          className={css.arriba}
          onClick={() => {
            contenedor.current?.scrollTo({ top: 0 });
            setFoco(0);
          }}
        >
          <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
          Ir arriba
        </button>
      ) : null}
    </div>
  );
}
