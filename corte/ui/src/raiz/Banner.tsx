/**
 * @/raiz · el banner superior único (01 §4.16). Rojo = bloqueo o riesgo real, ámbar = atención, neutro = estado. Ícono +
 * texto (el color nunca va solo), acciones a la derecha y, en los informativos, «Ocultar por hoy» (24 h en este equipo).
 */
import type { ReactElement } from 'react';
import { Boton, Icono, type NombreIcono } from '@/componentes';
import { cx } from '../app/clases';
import type { AccionBanner, DefBanner } from './banners';
import { T } from './textos';
import css from './Banner.module.css';

const ICONO: Readonly<Record<DefBanner['tono'], NombreIcono>> = { critico: 'CircleAlert', atencion: 'CircleAlert', neutro: 'Info' };

/**
 * `franja`: en el celular y la ventana compacta, los avisos neutros (sin conexión con la PC, sin internet) van como una
 * franja delgada de estado (02 §7.9) y no como tarjeta: no empujan el encabezado de la pantalla. Los de bloqueo y los de
 * atención conservan la tarjeta.
 */
export function Banner(p: { banner: DefBanner; alAccion: (a: AccionBanner) => void; alDescartar: () => void; className?: string; franja?: boolean }): ReactElement {
  const b = p.banner;
  const urgente = b.prioridad === 0;
  const franja = !!p.franja && b.tono === 'neutro';
  return (
    <div
      className={cx(css.banner, css[b.tono], franja && css.franja, p.className)}
      role={urgente ? 'alert' : 'status'}
      data-banner={b.id}
      data-prioridad={b.prioridad}
    >
      <div className={css.cuerpo}>
        <span className={css.icono} aria-hidden="true">
          <Icono nombre={ICONO[b.tono]} tamano={franja ? 16 : 18} />
        </span>
        <div className={css.textos}>
          <p className={css.texto}>{b.texto}</p>
          {b.detalle ? <p className={css.detalle}>{b.detalle}</p> : null}
        </div>
        {b.acciones.length || b.descartable ? (
          <div className={css.acciones}>
            {b.acciones.map((a, i) => (
              <Boton key={a.etiqueta} tamano="sm" variante={i === 0 && b.tono !== 'neutro' ? 'secundario' : 'fantasma'} alPulsar={() => p.alAccion(a.accion)}>
                {a.etiqueta}
              </Boton>
            ))}
            {b.descartable ? (
              <button type="button" className={css.cerrar} onClick={p.alDescartar} aria-label={T.descartar} title={T.descartar}>
                <Icono nombre="X" tamano={16} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
