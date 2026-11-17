/**
 * «Comisión por semana · 12 semanas» (01 §4.1 #10, 02 §9.4): columnas de UNA serie en --viz-mono, la semana en curso
 * con contorno y «en curso» (no se extrapola), nota «Semana pico: …», lectura con hover/foco por columna y tabla gemela.
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { Esqueleto, GraficaColumnas, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion } from './Estados';
import { semanaPico, tablaTendencia, type PuntoTendencia } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

export interface TendenciaProps {
  puntos: PuntoTendencia[];
  cargando: boolean;
  error: ErrorHub | null;
  compacto: boolean;
  alReintentar: () => void;
}

export function Tendencia(p: TendenciaProps): ReactElement | null {
  let cuerpo: ReactElement;
  if (p.cargando) {
    cuerpo = (
      <div className={css.esqGrafica} aria-busy="true">
        <Esqueleto forma="titulo" ancho={260} />
        <Esqueleto forma="bloque" alto={190} />
      </div>
    );
  } else if (p.error) {
    cuerpo = (
      <>
        <h2 className={css.tarjetaTitulo}>{T.tendencia.titulo}</h2>
        <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />
      </>
    );
  } else if (p.puntos.length === 0) {
    return null;
  } else {
    const pico = semanaPico(p.puntos);
    cuerpo = (
      <GraficaColumnas
        titulo={T.tendencia.titulo}
        puntos={p.puntos.map((x) => ({ clave: x.clave, etiqueta: x.etiqueta, valor: x.valor, enCurso: x.enCurso, aria: x.aria }))}
        formatoEje={(v) => formato.ejeDinero(v)}
        alto={p.compacto ? 180 : 220}
        {...(pico ? { nota: pico } : {})}
        tablaGemela={tablaTendencia(p.puntos)}
      />
    );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjetaSeccion}>
      {cuerpo}
    </Tarjeta>
  );
}
