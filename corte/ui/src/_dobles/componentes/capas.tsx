/* __DOBLE_CORTE__ · doble de @/componentes: capas. Modal, Hoja y PanelLateral muestran `children` si están
   abiertos (Esc cierra); los Toasts muestran el texto y su acción. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { DatosToast, HojaProps, ModalProps, PanelLateralProps } from '@firmas/componentes';
import { Caja, clases, estilosDoble as css } from '../comun/Caja';

function useEscape(activo: boolean, alCerrar: () => void): void {
  const ref = useRef(alCerrar);
  ref.current = alCerrar;
  useEffect(() => {
    if (!activo) return undefined;
    const alTecla = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') ref.current();
    };
    window.addEventListener('keydown', alTecla);
    return () => window.removeEventListener('keydown', alTecla);
  }, [activo]);
}

function Dialogo(p: { nombre: string; abierto: boolean; titulo: string; descripcion?: string | undefined; alCerrar: () => void; children?: ReactNode; pie?: ReactNode; className?: string | undefined }): ReactElement | null {
  useEscape(p.abierto, p.alCerrar);
  if (!p.abierto) return null;
  return (
    <div className={css.capa} data-componente={`${p.nombre}-capa`} onClick={(e) => e.target === e.currentTarget && p.alCerrar()}>
      <div role="dialog" aria-modal="true" aria-label={p.titulo} className={clases(css.caja, css.dialogo, p.className)} data-componente={p.nombre}>
        <div className={css.fila}>
          <span className={css.nombre}>{p.nombre}</span>
          <h2 className={css.titulo}>{p.titulo}</h2>
          <button type="button" className={css.boton} aria-label="Cerrar" onClick={p.alCerrar}>
            Cerrar
          </button>
        </div>
        {p.descripcion ? <p className={css.atenuado}>{p.descripcion}</p> : null}
        {p.children}
        {p.pie ? <div className={css.fila}>{p.pie}</div> : null}
      </div>
    </div>
  );
}

export function Modal(p: ModalProps): ReactElement | null {
  return (
    <Dialogo nombre="Modal" abierto={p.abierto} titulo={p.titulo} descripcion={p.descripcion} alCerrar={p.alCerrar} pie={p.pie} className={p.className}>
      {p.children}
    </Dialogo>
  );
}

export function Hoja(p: HojaProps): ReactElement | null {
  return (
    <Dialogo nombre="Hoja" abierto={p.abierta} titulo={p.titulo} alCerrar={p.alCerrar} pie={p.pie} className={p.className}>
      {p.children}
    </Dialogo>
  );
}

export function PanelLateral(p: PanelLateralProps): ReactElement | null {
  useEscape(p.abierto, p.alCerrar);
  if (!p.abierto) return null;
  return (
    <aside role="dialog" aria-label={p.titulo} className={clases(css.caja, css.panel, p.className)} data-componente="PanelLateral">
      <div className={css.fila}>
        <span className={css.nombre}>PanelLateral</span>
        <h2 className={css.titulo}>{p.titulo}</h2>
        {p.alExpandir ? (
          <button type="button" className={css.boton} onClick={p.alExpandir}>
            Abrir en página completa
          </button>
        ) : null}
        <button type="button" className={css.boton} aria-label="Cerrar" onClick={p.alCerrar}>
          Cerrar
        </button>
      </div>
      {p.children}
      {p.pie ? <div className={css.fila}>{p.pie}</div> : null}
    </aside>
  );
}

export function Tooltip(p: { contenido: ReactNode; children: ReactElement; className?: string }): ReactElement {
  return (
    <span className={p.className} data-componente="Tooltip" title={typeof p.contenido === 'string' ? p.contenido : undefined}>
      {p.children}
    </span>
  );
}

export function BurbujaRecorrido(p: { visible: boolean; texto: string; esUltimo: boolean; alSiguiente: () => void; alEntendido: () => void; children: ReactElement; className?: string }): ReactElement {
  useEscape(p.visible, p.alEntendido);
  if (!p.visible) return p.children;
  return (
    <span className={p.className} data-componente="BurbujaRecorrido">
      {p.children}
      <Caja nombre="BurbujaRecorrido">
        <span>{p.texto}</span>
        <div className={css.fila}>
          {p.esUltimo ? null : (
            <button type="button" className={css.boton} onClick={p.alSiguiente}>
              Siguiente
            </button>
          )}
          <button type="button" className={css.boton} onClick={p.alEntendido}>
            Entendido
          </button>
        </div>
      </Caja>
    </span>
  );
}

interface ApiToast {
  mostrar(t: DatosToast): void;
  cerrar(): void;
}

const ContextoToast = createContext<ApiToast | null>(null);
const SIN_PROVEEDOR: ApiToast = {
  mostrar: () => undefined,
  cerrar: () => undefined,
};

export function useToast(): ApiToast {
  return useContext(ContextoToast) ?? SIN_PROVEEDOR;
}

/** Lo monta la raíz una vez. */
export function ProveedorToasts(p: { children: ReactNode }): ReactElement {
  const [toast, setToast] = useState<DatosToast | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cerrar = useCallback(() => {
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = null;
    setToast(null);
  }, []);
  const mostrar = useCallback(
    (t: DatosToast) => {
      if (temporizador.current) clearTimeout(temporizador.current);
      setToast(t);
      temporizador.current = setTimeout(cerrar, t.duracion_ms ?? 6000);
    },
    [cerrar],
  );
  useEffect(() => () => {
    if (temporizador.current) clearTimeout(temporizador.current);
  }, []);
  const api = useMemo(() => ({ mostrar, cerrar }), [mostrar, cerrar]);
  return (
    <ContextoToast.Provider value={api}>
      {p.children}
      {toast ? (
        <div role="status" aria-live="polite" className={clases(css.caja, css.toast)} data-componente="Toast" data-tono={toast.tono ?? 'info'}>
          <span>{toast.texto}</span>
          {toast.detalle ? <span className={css.atenuado}>{toast.detalle}</span> : null}
          <div className={css.fila}>
            {toast.accion ? (
              <button
                type="button"
                className={css.boton}
                onClick={() => {
                  toast.accion?.alPulsar();
                  cerrar();
                }}
              >
                {toast.accion.etiqueta}
              </button>
            ) : null}
            <button type="button" className={css.boton} aria-label="Cerrar aviso" onClick={cerrar}>
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </ContextoToast.Provider>
  );
}
