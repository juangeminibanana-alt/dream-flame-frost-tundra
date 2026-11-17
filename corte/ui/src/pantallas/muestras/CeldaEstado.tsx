/**
 * Celda «Estado en TikTok» de Todas (01 §4.7: «grupo + motivo»). En una sola píldora el motivo largo («La tienda
 * rechazó la solicitud») no cabe y se cortaba con «…»; aquí el grupo va en el chip de color (con su ícono: nunca solo
 * color) y el motivo debajo, en una línea discreta con su texto completo en la ayuda. Por vencer en menos de 48 h va en
 * rojo (02 §3.4); el resto con el tono del grupo.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Chip } from '@/componentes';
import { ahoraS, ETIQUETA_GRUPO, ICONO_GRUPO, sinAcentos, TONO_GRUPO } from '@/dominio';
import { cx } from './util';
import css from './Todas.module.css';

const HORAS_48 = 48 * 3600;

/** El motivo solo se agrega si dice algo más que el nombre del grupo. */
function motivoUtil(m: C.MuestraVista): string | null {
  const motivo = m.motivo.trim();
  if (!motivo) return null;
  const grupo = ETIQUETA_GRUPO[m.grupo];
  return sinAcentos(motivo).toLowerCase() === sinAcentos(grupo).toLowerCase() ? null : motivo;
}

export function CeldaEstado(p: { m: C.MuestraVista }): ReactElement {
  const { m } = p;
  const urgente = m.grupo === 'por_vencer' && m.fecha_limite_at !== null && m.fecha_limite_at - ahoraS() < HORAS_48;
  const motivo = motivoUtil(m);
  return (
    <span className={cx(css.celdaEstado)}>
      <Chip tono={urgente ? 'critico' : TONO_GRUPO[m.grupo]} icono={ICONO_GRUPO[m.grupo]}>
        {ETIQUETA_GRUPO[m.grupo]}
      </Chip>
      {motivo ? (
        <span className={cx(css.celdaMotivo)} title={motivo}>
          {motivo}
        </span>
      ) : null}
    </span>
  );
}
