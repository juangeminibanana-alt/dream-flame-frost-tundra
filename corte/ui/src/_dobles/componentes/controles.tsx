/* __DOBLE_CORTE__ · doble de @/componentes: controles de formulario que funcionan (con los elementos nativos). */
import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import type { EpochS } from '@/contrato';
import type { CampoTextoProps, NombreIcono, OpcionMenu, SegmentadoProps, SelectorFechaProps } from '@firmas/componentes';
import { epochDeFecha, fechaLocalDe, horaLocal } from '@/dominio';
import { Caja, clases, estilosDoble as css } from '../comun/Caja';

export function Segmentado<V extends string>(p: SegmentadoProps<V>): ReactElement {
  return (
    <div role="radiogroup" aria-label={p.etiqueta} className={clases(css.fila, p.className)} data-componente="Segmentado">
      {p.opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={o.valor === p.valor}
          className={clases(css.boton, o.valor === p.valor && css.activo, p.anchoCompleto && css.anchoCompleto)}
          onClick={() => p.alCambiar(o.valor)}
        >
          {o.etiqueta}
          {o.conteo !== undefined ? <span className={css.atenuado}> {o.conteo}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function CampoTexto(p: CampoTextoProps): ReactElement {
  const id = useId();
  return (
    <div className={clases(css.campo, p.className)} data-componente="CampoTexto">
      {p.etiquetaOculta ? null : <label htmlFor={id}>{p.etiqueta}</label>}
      <input
        id={id}
        className={css.entrada}
        type={p.tipo ?? 'text'}
        value={p.valor}
        placeholder={p.placeholder}
        maxLength={p.maximo}
        autoFocus={p.autoFoco}
        aria-label={p.etiquetaOculta ? p.etiqueta : undefined}
        aria-invalid={p.error ? true : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => p.alCambiar(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') p.alEnter?.();
        }}
      />
      {p.ayuda ? <span className={css.ayuda}>{p.ayuda}</span> : null}
      {p.error ? <span role="alert" className={css.error}>{p.error}</span> : null}
    </div>
  );
}

export function AreaTexto(p: Omit<CampoTextoProps, 'tipo' | 'alEnter'> & { filas?: number; contador?: boolean }): ReactElement {
  const id = useId();
  return (
    <div className={clases(css.campo, p.className)} data-componente="AreaTexto">
      {p.etiquetaOculta ? null : <label htmlFor={id}>{p.etiqueta}</label>}
      <textarea
        id={id}
        className={css.entrada}
        rows={p.filas ?? 4}
        value={p.valor}
        placeholder={p.placeholder}
        maxLength={p.maximo}
        aria-label={p.etiquetaOculta ? p.etiqueta : undefined}
        onChange={(e) => p.alCambiar(e.target.value)}
      />
      {p.contador ? <span className={css.ayuda}>{p.maximo !== undefined ? `${p.valor.length}/${p.maximo}` : String(p.valor.length)}</span> : null}
      {p.ayuda ? <span className={css.ayuda}>{p.ayuda}</span> : null}
      {p.error ? <span role="alert" className={css.error}>{p.error}</span> : null}
    </div>
  );
}

export function Interruptor(p: { activo: boolean; alCambiar: (activo: boolean) => void; etiqueta: string; descripcion?: string; deshabilitado?: boolean; className?: string }): ReactElement {
  return (
    <div className={clases(css.fila, p.className)} data-componente="Interruptor">
      <button
        type="button"
        role="switch"
        aria-checked={p.activo}
        aria-label={p.etiqueta}
        disabled={p.deshabilitado === true}
        className={clases(css.boton, p.activo && css.activo)}
        onClick={() => p.alCambiar(!p.activo)}
      >
        {p.activo ? 'Sí' : 'No'}
      </button>
      <span>{p.etiqueta}</span>
      {p.descripcion ? <span className={css.ayuda}>{p.descripcion}</span> : null}
    </div>
  );
}

export function Casilla(p: { marcada: boolean; alCambiar: (marcada: boolean) => void; etiqueta: string; indeterminada?: boolean; deshabilitado?: boolean; className?: string }): ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = p.indeterminada === true;
  }, [p.indeterminada]);
  return (
    <label className={clases(css.fila, p.className)} data-componente="Casilla">
      <input ref={ref} type="checkbox" checked={p.marcada} disabled={p.deshabilitado === true} onChange={(e) => p.alCambiar(e.target.checked)} />
      {p.etiqueta}
    </label>
  );
}

export function OpcionRadio<V extends string>(p: { opciones: { valor: V; etiqueta: string; descripcion?: string }[]; valor: V | null; alCambiar: (valor: V) => void; etiqueta: string; className?: string }): ReactElement {
  const nombre = useId();
  return (
    <fieldset className={clases(css.caja, p.className)} data-componente="OpcionRadio">
      <legend>{p.etiqueta}</legend>
      {p.opciones.map((o) => (
        <label key={o.valor} className={css.fila}>
          <input type="radio" name={nombre} value={o.valor} checked={p.valor === o.valor} onChange={() => p.alCambiar(o.valor)} />
          {o.etiqueta}
          {o.descripcion ? <span className={css.ayuda}>{o.descripcion}</span> : null}
        </label>
      ))}
    </fieldset>
  );
}

export function SelectorNumero(p: { valor: number; min: number; max: number; alCambiar: (valor: number) => void; etiqueta: string; className?: string }): ReactElement {
  const fijar = (v: number): void => p.alCambiar(Math.min(p.max, Math.max(p.min, v)));
  return (
    <div role="group" aria-label={p.etiqueta} className={clases(css.fila, p.className)} data-componente="SelectorNumero">
      <button type="button" className={css.boton} aria-label="Menos" disabled={p.valor <= p.min} onClick={() => fijar(p.valor - 1)}>
        −
      </button>
      <output aria-live="polite">{p.valor}</output>
      <button type="button" className={css.boton} aria-label="Más" disabled={p.valor >= p.max} onClick={() => fijar(p.valor + 1)}>
        +
      </button>
    </div>
  );
}

const LETRAS_DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const NOMBRES_DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

/** Chips L M M J V S D; `dias` con 0 = lunes … 6 = domingo. */
export function ChipsDias(p: { dias: number[]; alCambiar: (dias: number[]) => void; etiqueta: string; className?: string }): ReactElement {
  const alternar = (d: number): void => {
    const nuevos = p.dias.includes(d) ? p.dias.filter((x) => x !== d) : [...p.dias, d].sort((a, b) => a - b);
    p.alCambiar(nuevos);
  };
  return (
    <div role="group" aria-label={p.etiqueta} className={clases(css.fila, p.className)} data-componente="ChipsDias">
      {LETRAS_DIAS.map((letra, d) => (
        <button
          key={NOMBRES_DIAS[d]}
          type="button"
          aria-pressed={p.dias.includes(d)}
          aria-label={NOMBRES_DIAS[d]}
          className={clases(css.boton, p.dias.includes(d) && css.activo)}
          onClick={() => alternar(d)}
        >
          {letra}
        </button>
      ))}
    </div>
  );
}

export function SelectorFecha(p: SelectorFechaProps): ReactElement {
  const id = useId();
  return (
    <div className={clases(css.campo, p.className)} data-componente="SelectorFecha">
      <label htmlFor={id}>{p.etiqueta}</label>
      <input
        id={id}
        className={css.entrada}
        type="date"
        value={p.valor ?? ''}
        min={p.min}
        max={p.max}
        onChange={(e) => {
          if (e.target.value) p.alCambiar(e.target.value);
        }}
      />
      {p.atajos && p.atajos.length > 0 ? (
        <div className={css.fila}>
          {p.atajos.map((a) => (
            <button key={a.fecha} type="button" className={css.boton} onClick={() => p.alCambiar(a.fecha)}>
              {a.etiqueta}
            </button>
          ))}
        </div>
      ) : null}
      {p.ocupacion && p.valor && p.ocupacion[p.valor] ? (
        <span className={css.ayuda}>
          {p.ocupacion[p.valor]?.usados}/{p.ocupacion[p.valor]?.capacidad}
        </span>
      ) : null}
    </div>
  );
}

function aLocal(t: EpochS): string {
  const { h, m } = horaLocal(t);
  return `${fechaLocalDe(t)}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function SelectorFechaHora(p: { etiqueta: string; valor: EpochS | null; alCambiar: (t: EpochS) => void; min?: EpochS; className?: string }): ReactElement {
  const id = useId();
  return (
    <div className={clases(css.campo, p.className)} data-componente="SelectorFechaHora">
      <label htmlFor={id}>{p.etiqueta}</label>
      <input
        id={id}
        className={css.entrada}
        type="datetime-local"
        value={p.valor === null ? '' : aLocal(p.valor)}
        min={p.min === undefined ? undefined : aLocal(p.min)}
        onChange={(e) => {
          const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(e.target.value);
          if (m?.[1] && m[2] && m[3]) p.alCambiar(epochDeFecha(m[1], Number(m[2]), Number(m[3])));
        }}
      />
    </div>
  );
}

/** Menú ⋯: un botón que despliega las opciones. */
export function Menu(p: { etiqueta: string; opciones: OpcionMenu[]; icono?: NombreIcono; disparador?: 'icono' | 'boton'; className?: string }): ReactElement {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className={p.className} data-componente="Menu">
      <button type="button" className={css.boton} aria-haspopup="menu" aria-expanded={abierto} aria-label={p.etiqueta} onClick={() => setAbierto((a) => !a)}>
        {p.disparador === 'boton' ? p.etiqueta : '…'}
      </button>
      {abierto ? (
        <ul role="menu" className={clases(css.caja, css.lista)}>
          {p.opciones.map((o) => (
            <li key={o.id} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={o.deshabilitado === true}
                className={clases(css.boton, o.peligro && css.peligro, css.anchoCompleto)}
                onClick={() => {
                  setAbierto(false);
                  o.alPulsar();
                }}
              >
                {o.etiqueta}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CampoBusqueda(p: { alAbrir: () => void; className?: string }): ReactElement {
  return (
    <Caja nombre="CampoBusqueda" className={p.className}>
      <button type="button" className={css.boton} onClick={p.alAbrir} onFocus={p.alAbrir}>
        Buscar
      </button>
    </Caja>
  );
}
