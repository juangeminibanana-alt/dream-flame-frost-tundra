/* __DOBLE_CORTE__ · caja genérica de los dobles: borde punteado, nombre del componente y resumen de sus props. */
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import css from './caja.module.css';
import { resumirProps } from './resumen';

export interface CajaProps {
  nombre: string;
  props?: object;
  children?: ReactNode;
  enLinea?: boolean;
  className?: string | undefined;
  /** Si existe, la caja se comporta como botón (clic, Enter o Espacio). */
  alPulsar?: (() => void) | undefined;
  etiqueta?: string | undefined;
}

export function clases(...lista: Array<string | false | null | undefined>): string {
  return lista.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

export function Caja(p: CajaProps): ReactElement {
  const resumen = p.props ? resumirProps(p.props) : '';
  const pulsar = p.alPulsar;
  const alTecla = (e: KeyboardEvent<HTMLElement>): void => {
    if (pulsar && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      pulsar();
    }
  };
  const interactivo = pulsar
    ? { role: 'button', tabIndex: 0, onClick: () => pulsar(), onKeyDown: alTecla }
    : {};
  return (
    <div
      className={clases(css.caja, p.enLinea && css.enLinea, pulsar && css.interactivo, p.className)}
      data-componente={p.nombre}
      data-doble="si"
      aria-label={p.etiqueta}
      {...interactivo}
    >
      <span className={css.nombre}>{p.nombre}</span>
      {resumen ? <span className={css.props}>{resumen}</span> : null}
      {p.children !== undefined && p.children !== null && p.children !== false ? (
        <div className={css.contenido}>{p.children}</div>
      ) : null}
    </div>
  );
}

export { css as estilosDoble };
