/**
 * La cola en secciones colapsables con conteo (01 §4.2 punto 3): TarjetaMuestra 'lista' de @/bloques en cada fila, con
 * su número en la cola (escritorio). «Promesas vencidas» lleva [Preparar mensaje] por tienda; «No se pueden etiquetar»,
 * [Avisar a la tienda]; «En revisión» es informativa (sin acción). En Android las tarjetas se deslizan y mantener
 * presionado entra a la selección múltiple; en escritorio la casilla aparece al pasar el cursor.
 */
import { useRef, useState, type FocusEvent, type PointerEvent, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { TarjetaMuestra, useControlMuestra } from '@/bloques';
import { Boton, BotonIcono } from '@/componentes';
import { formato } from '@/dominio';
import { vibrar } from '@/plataforma';
import type { Seccion } from './logica';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

const MANTENER_MS = 520;

function useMantener(alMantener: () => void, activo: boolean): {
  onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
  onPointerUp?: () => void;
  onPointerLeave?: () => void;
  onPointerCancel?: () => void;
  onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
} {
  const reloj = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inicio = useRef<{ x: number; y: number } | null>(null);
  if (!activo) return {};
  const cancelar = (): void => {
    if (reloj.current) clearTimeout(reloj.current);
    reloj.current = null;
    inicio.current = null;
  };
  return {
    onPointerDown: (e) => {
      if (e.pointerType === 'mouse') return;
      inicio.current = { x: e.clientX, y: e.clientY };
      reloj.current = setTimeout(() => {
        reloj.current = null;
        vibrar('confirmar');
        alMantener();
      }, MANTENER_MS);
    },
    onPointerMove: (e) => {
      const i = inicio.current;
      if (i && Math.hypot(e.clientX - i.x, e.clientY - i.y) > 10) cancelar();
    },
    onPointerUp: cancelar,
    onPointerLeave: cancelar,
    onPointerCancel: cancelar,
  };
}

function FilaCola(p: {
  m: C.MuestraVista;
  seccion: Seccion;
  seleccionada: boolean;
  marcada: boolean;
  modoSeleccion: boolean;
  movil: boolean;
  android: boolean;
  esNueva: boolean;
  alAbrir: (m: C.MuestraVista) => void;
  alMarcar: (id: string, si: boolean) => void;
  alMantener: (id: string) => void;
}): ReactElement {
  const { m } = p;
  const control = useControlMuestra();
  const mantener = useMantener(() => p.alMantener(m.application_id), p.android && !p.modoSeleccion);
  const informativa = p.seccion.tipo === 'informativa' || p.seccion.tipo === 'resuelta';
  // Escritorio: la casilla aparece al pasar el cursor o con el foco dentro de la fila (01 §4.2); con algo marcado, en
  // todas. Android: solo en el modo selección (mantener presionado). Fuera de eso la tarjeta muestra su Nº en la cola.
  const [cerca, setCerca] = useState(false);
  const marcable = p.android ? p.modoSeleccion : p.modoSeleccion || p.marcada || cerca;
  const alrededor = p.android
    ? {}
    : {
        onMouseEnter: () => setCerca(true),
        onMouseLeave: () => setCerca(false),
        onFocus: () => setCerca(true),
        onBlur: (e: FocusEvent<HTMLLIElement>) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setCerca(false);
        },
      };
  return (
    <li className={cx(p.movil ? css.filaMovil : css.fila)} data-muestra={m.application_id} data-seleccionada={p.seleccionada ? '' : undefined} {...mantener} {...alrededor}>
      <div className={cx(css.tarjetaCelda)}>
        <TarjetaMuestra
          muestra={m}
          variante="lista"
          seleccionada={p.seleccionada}
          marcable={marcable}
          marcada={p.marcada}
          alMarcar={(si) => p.alMarcar(m.application_id, si)}
          alAbrir={() => p.alAbrir(m)}
          esNueva={p.esNueva}
          conAccion={!informativa && !p.modoSeleccion}
          deslizable={p.android && !p.modoSeleccion && !informativa}
          className={cx(css.tarjeta)}
        />
        {p.seccion.tipo === 'etiquetar' ? (
          <div className={cx(css.filaExtra)}>
            <span className={cx(css.filaExtraTexto)}>{m.motivo}</span>
            <Boton variante="secundario" tamano="sm" icono="MessageCircle" alPulsar={() => control.abrirMensaje({ solicitud: m.application_id })}>
              {T.avisarTienda}
            </Boton>
          </div>
        ) : null}
      </div>
    </li>
  );
}

function TiendasPromesa(p: { muestras: C.MuestraVista[] }): ReactElement {
  const control = useControlMuestra();
  const tiendas = new Map<string, string>();
  for (const m of p.muestras) tiendas.set(m.tienda.tienda_key, m.tienda.nombre);
  return (
    <div className={cx(css.accionesSeccion)}>
      {[...tiendas.entries()].map(([key, nombre]) => (
        <Boton key={key} variante="secundario" tamano="sm" icono="MessageCircleWarning" alPulsar={() => control.abrirMensaje({ tienda: key })}>
          {T.prepararMensaje(nombre)}
        </Boton>
      ))}
    </div>
  );
}

export function ListaCola(p: {
  secciones: Seccion[];
  colapsada: (s: Seccion) => boolean;
  alColapsar: (s: Seccion, colapsada: boolean) => void;
  seleccionada: string | null;
  marcadas: ReadonlySet<string>;
  modoSeleccion: boolean;
  movil: boolean;
  android: boolean;
  esNueva: (m: C.MuestraVista) => boolean;
  alAbrir: (m: C.MuestraVista) => void;
  alMarcar: (id: string, si: boolean) => void;
  alMantener: (id: string) => void;
}): ReactElement {
  return (
    <div className={cx(css.secciones)} aria-label={T.listaEtiqueta} role="region">
      {p.secciones.map((s) => {
        const colapsada = p.colapsada(s);
        const idLista = `cola-${s.id.replace(/[^a-z0-9_-]/gi, '-')}`;
        return (
          <section key={s.id} className={cx(css.seccion)} aria-labelledby={`${idLista}-t`} data-seccion={s.id}>
            <header className={cx(css.seccionCabeza)}>
              <h2 className={cx(css.seccionTitulo)} id={`${idLista}-t`}>
                <span>{s.titulo}</span>
                <span className={cx(css.seccionConteo)}>{formato.numero(s.muestras.length)}</span>
              </h2>
              <BotonIcono
                icono={colapsada ? 'ChevronRight' : 'ChevronDown'}
                etiqueta={colapsada ? T.mostrarSeccion(s.titulo) : T.ocultarSeccion(s.titulo)}
                tamano="sm"
                alPulsar={() => p.alColapsar(s, !colapsada)}
              />
            </header>
            {!colapsada && s.tipo === 'promesas' ? <TiendasPromesa muestras={s.muestras} /> : null}
            {!colapsada ? (
              <ol className={cx(css.lista)} id={idLista}>
                {s.muestras.map((m) => (
                  <FilaCola
                    key={m.application_id}
                    m={m}
                    seccion={s}
                    seleccionada={p.seleccionada === m.application_id}
                    marcada={p.marcadas.has(m.application_id)}
                    modoSeleccion={p.modoSeleccion}
                    movil={p.movil}
                    android={p.android}
                    esNueva={p.esNueva(m)}
                    alAbrir={p.alAbrir}
                    alMarcar={p.alMarcar}
                    alMantener={p.alMantener}
                  />
                ))}
              </ol>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
