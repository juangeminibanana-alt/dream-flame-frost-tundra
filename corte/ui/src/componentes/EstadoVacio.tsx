/**
 * Estado vacío (02 §7.16): ícono de 24 en un círculo surface-2 de 56, título title3, cuerpo de 14 en text-2 (máx. 34
 * ch) y UNA acción secundaria. Los textos vienen de 01 §4.16. "Estás al día" usa el Ticket, no este componente.
 */
import type { ReactElement } from 'react';
import type { NombreIcono } from '@firmas/componentes';
import { Boton } from './Boton';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './EstadoVacio.module.css';

export function EstadoVacio(p: { icono: NombreIcono; titulo: string; texto?: string; accion?: { etiqueta: string; alPulsar: () => void }; className?: string }): ReactElement {
  return (
    <div className={cx(css.vacio, p.className)}>
      <span className={css.circulo} aria-hidden="true">
        <Icono nombre={p.icono} tamano={24} />
      </span>
      <h3 className={css.titulo}>{p.titulo}</h3>
      {p.texto ? <p className={css.texto}>{p.texto}</p> : null}
      {p.accion ? (
        <Boton variante="secundario" alPulsar={p.accion.alPulsar} className={cx(css.accion)}>
          {p.accion.etiqueta}
        </Boton>
      ) : null}
    </div>
  );
}
