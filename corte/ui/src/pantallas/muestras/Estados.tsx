/**
 * Estados de las vistas de Muestras (01 §4.2 «Textos de estado», §4.16): primera carga con esqueletos de la forma
 * final, «Necesita tu PC encendida» (Android sin la PC y la vista no sale de la copia), error sin datos, error con
 * datos en caché (banner) y «¡Estás al día!» con el ticket de corte en variante al día (02 §7.16, §7.22).
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { Boton, EstadoVacio, Esqueleto, EsqueletoVista, Icono, Ticket } from '@/componentes';
import { ahoraS, formato } from '@/dominio';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

/** Esqueleto de la cola: franja + 6 filas con foto, en una sola animación (02 §7.15). */
export function EsqueletoCola(p: { conPanel: boolean }): ReactElement {
  return (
    <EsqueletoVista textoLento={T.cargandoLento} className={cx(css.esqueleto)}>
      <p className={cx(css.cargandoTexto)}>{T.contextoCargando}</p>
      <div className={cx(css.esqueletoFranja)}>
        <Esqueleto forma="titulo" ancho="40%" />
        <Esqueleto forma="bloque" alto={12} />
      </div>
      <div className={cx(p.conPanel ? css.cuerpoConPanel : css.cuerpo)}>
        <ul className={cx(css.lista)} aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i} className={cx(css.esqueletoFila)}>
              <Esqueleto forma="foto" ancho={64} alto={64} />
              <div className={cx(css.esqueletoTextos)}>
                <Esqueleto forma="texto" ancho="72%" />
                <Esqueleto forma="texto" ancho="48%" />
                <Esqueleto forma="texto" ancho="36%" />
              </div>
            </li>
          ))}
        </ul>
        {p.conPanel ? (
          <div className={cx(css.esqueletoPanel)} aria-hidden="true">
            <Esqueleto forma="foto" ancho="100%" alto={260} />
            <Esqueleto forma="titulo" ancho="80%" />
            <Esqueleto forma="texto" lineas={3} />
          </div>
        ) : null}
      </div>
    </EsqueletoVista>
  );
}

export function NecesitaPc(p: { alReintentar: () => void; className?: string }): ReactElement {
  return (
    <div className={p.className ?? css.estadoCentro}>
      <EstadoVacio icono="Monitor" titulo={T.necesitaPcTitulo} texto={T.necesitaPcTexto} accion={{ etiqueta: T.reintentar, alPulsar: p.alReintentar }} />
    </div>
  );
}

/** Error sin datos que mostrar: necesita_pc tiene su propio estado. */
export function ErrorVista(p: { error: ErrorHub; alReintentar: () => void; className?: string }): ReactElement {
  if (p.error.codigo === 'necesita_pc') return <NecesitaPc alReintentar={p.alReintentar} {...(p.className ? { className: p.className } : {})} />;
  return (
    <div className={p.className ?? css.estadoCentro}>
      <EstadoVacio icono="CircleAlert" titulo={T.errorTitulo} texto={p.error.mensaje || T.errorTexto} accion={{ etiqueta: T.reintentar, alPulsar: p.alReintentar }} />
    </div>
  );
}

/** «No pudimos actualizar tus muestras. Te mostramos las del {fecha}.» [Reintentar] (01 §4.2). */
export function BannerCache(p: { fechaAt: number | null; alReintentar: () => void }): ReactElement {
  const t = p.fechaAt ?? ahoraS();
  const fecha = `${formato.fechaCorta(t)}, ${formato.hora(t)}`;
  return (
    <div className={cx(css.bannerCache)} role="status">
      <Icono nombre="CircleAlert" tamano={18} />
      <span className={cx(css.bannerTexto)}>{T.errorConCache(fecha)}</span>
      <Boton variante="secundario" tamano="sm" alPulsar={p.alReintentar}>
        {T.reintentar}
      </Boton>
    </div>
  );
}

/** Pendientes en cero: ticket «Estás al día» + texto de 01 §4.2 + [Ver historial]. */
export function AlDia(p: { publicadas: number; tiendas: number; alVerHistorial: () => void }): ReactElement {
  return (
    <section className={cx(css.alDia)} aria-label={T.alDiaTitulo}>
      {p.publicadas > 0 ? (
        <Ticket
          variante="al_dia"
          titulo={T.ticketAlDiaTitulo}
          subtitulo={T.ticketAlDiaSub}
          renglones={[
            { concepto: T.ticketPublicados, cifra: formato.numero(p.publicadas) },
            { concepto: T.ticketTiendas, cifra: formato.numero(p.tiendas) },
          ]}
          total={T.ticketTotal(formato.numero(p.publicadas), formato.numero(p.tiendas))}
          className={cx(css.alDiaTicket)}
        />
      ) : null}
      <div className={cx(css.alDiaTextos)}>
        <h2 className={cx(css.alDiaTitulo)}>{T.alDiaTitulo}</h2>
        <p className={cx(css.alDiaTexto)}>{T.alDiaTexto}</p>
        <Boton variante="secundario" alPulsar={p.alVerHistorial}>
          {T.verHistorial}
        </Boton>
      </div>
    </section>
  );
}
