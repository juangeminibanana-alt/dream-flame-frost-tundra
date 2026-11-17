/**
 * Avisos flotantes (02 §7.14, 01 §3.5): surface-4, borde, sombra 3, radio 10, alto mínimo 48, ancho máximo 420; círculo
 * de estado de 24, texto de 14 (+ línea de 12) y acción opcional en --brand-ink. Abajo a la izquierda en Windows y abajo
 * al centro en Android (sobre la barra inferior + 12). 6 s por omisión; se pausa con hover o foco; uno a la vez.
 * role=status (errores: role=alert). "Deshacer" solo en lo reversible: lo decide quien llama.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { DatosToast } from '@firmas/componentes';
import { BotonIcono } from './BotonIcono';
import { Icono } from './Icono';
import { cx } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import { SALIDA_MS } from './util/presencia';
import css from './Toasts.module.css';

interface ApiToast {
  mostrar(t: DatosToast): void;
  cerrar(): void;
}

const ContextoToasts = createContext<ApiToast | null>(null);

const SIN_PROVEEDOR: ApiToast = {
  mostrar: () => undefined,
  cerrar: () => undefined,
};

export function useToast(): ApiToast {
  return useContext(ContextoToasts) ?? SIN_PROVEEDOR;
}

interface ToastVivo extends DatosToast {
  id: number;
}

function TarjetaToast(p: { toast: ToastVivo; saliendo: boolean; alCerrar: () => void }): ReactElement {
  const { toast } = p;
  const [pausado, setPausado] = useState(false);
  const restante = useRef(toast.duracion_ms ?? 6000);
  const inicio = useRef(0);

  useEffect(() => {
    if (pausado || p.saliendo) return undefined;
    inicio.current = performance.now();
    const t = window.setTimeout(p.alCerrar, restante.current);
    return () => {
      window.clearTimeout(t);
      restante.current = Math.max(800, restante.current - (performance.now() - inicio.current));
    };
  }, [pausado, p.saliendo, p.alCerrar]);

  const tono = toast.tono ?? 'ok';
  const accion = toast.accion;
  return (
    <div
      className={cx(css.toast, p.saliendo && css.saliendo)}
      role={tono === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <span className={cx(css.circulo, css[tono])} aria-hidden="true">
        <Icono nombre={tono === 'error' ? 'CircleAlert' : tono === 'info' ? 'Info' : 'Check'} tamano={14} />
      </span>
      <span className={css.textos}>
        <span className={css.texto}>{toast.texto}</span>
        {toast.detalle ? <span className={css.detalle}>{toast.detalle}</span> : null}
      </span>
      {accion ? (
        <button
          type="button"
          className={css.accion}
          onClick={() => {
            accion.alPulsar();
            p.alCerrar();
          }}
        >
          {accion.etiqueta}
        </button>
      ) : null}
      <BotonIcono icono="X" etiqueta="Cerrar aviso" tamano="sm" alPulsar={p.alCerrar} className={cx(css.cerrar)} />
    </div>
  );
}

/** Lo monta ui-marco una vez en la raíz. */
export function ProveedorToasts(p: { children: ReactNode }): ReactElement {
  const plataforma = usePlataformaHtml();
  const [toast, setToast] = useState<ToastVivo | null>(null);
  const [saliendo, setSaliendo] = useState(false);
  const siguiente = useRef(1);
  const salida = useRef<number | null>(null);

  const cerrar = useCallback((): void => {
    setSaliendo(true);
    if (salida.current !== null) window.clearTimeout(salida.current);
    salida.current = window.setTimeout(() => {
      setToast(null);
      setSaliendo(false);
      salida.current = null;
    }, SALIDA_MS);
  }, []);

  const mostrar = useCallback((t: DatosToast): void => {
    if (salida.current !== null) window.clearTimeout(salida.current);
    salida.current = null;
    setSaliendo(false);
    setToast({ ...t, id: siguiente.current++ });
  }, []);

  useEffect(
    () => () => {
      if (salida.current !== null) window.clearTimeout(salida.current);
    },
    [],
  );

  const api = useMemo<ApiToast>(() => ({ mostrar, cerrar }), [mostrar, cerrar]);

  return (
    <ContextoToasts.Provider value={api}>
      {p.children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div className={cx(css.region, plataforma === 'android' && css.android)} data-capa-corte="">
              {toast ? <TarjetaToast key={toast.id} toast={toast} saliendo={saliendo} alCerrar={cerrar} /> : null}
            </div>,
            document.body,
          )
        : null}
    </ContextoToasts.Provider>
  );
}
