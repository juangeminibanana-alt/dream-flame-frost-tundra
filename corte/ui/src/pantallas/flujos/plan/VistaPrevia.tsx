/**
 * Vista previa de Armar mi plan (01 §4.5): la fecha que se promete («Terminas el mar 24 nov · publicas a más tardar el
 * jue 26 nov»), los videos por día (GraficaColumnas de @/componentes, con hover y tabla gemela) y las fotos de los
 * primeros días. El calendario del paso 3 pinta cada día con su conteo y las fotos de lo que toca hacer.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Chip, Foto, GraficaColumnas } from '@/componentes';
import { formato, hoyLocal, sumarDias, type ResultadoPlan } from '@/dominio';
import { T } from '../textos';
import { capitalizar, cuenta, cx, nombreDe } from '../util';
import { diasDelPlan, primerosDias, semanasDelPlan, textoRitmo, textoTermina, type DiaPlan, type MotivoVacio } from './logica';
import comun from '../flujos.module.css';
import css from './Plan.module.css';

const LETRAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const NOMBRES_DIA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

/** «Hoy · jue 12 nov» · «Mañana · vie 13 nov» · «Sáb 14 nov». */
export function etiquetaDia(f: C.FechaLocal, hoy: C.FechaLocal, manana: C.FechaLocal): string {
  if (f === hoy) return `${T.hoyEtiqueta} · ${formato.fechaConDia(f)}`;
  if (f === manana) return `${T.mananaEtiqueta} · ${formato.fechaConDia(f)}`;
  return capitalizar(formato.fechaConDia(f));
}

/** Videos por día del plan con GraficaColumnas (una serie en --viz-mono, hover y tabla gemela para lectores). */
export function GraficaPlan(p: { dias: DiaPlan[]; capacidad: number; alto?: number; className?: string }): ReactElement | null {
  if (p.dias.length === 0) return null;
  const puntos = p.dias.map((d) => ({
    clave: d.fecha,
    etiqueta: formato.fechaCorta(d.fecha).replace(/ \S+$/, ''),
    valor: d.n,
    aria: `${formato.fechaConDia(d.fecha)}: ${d.trabaja ? `${formato.numero(d.n)} de ${formato.numero(p.capacidad)} videos` : 'no haces videos'}`,
  }));
  return (
    <GraficaColumnas
      titulo={T.videosPorDia}
      puntos={puntos}
      formatoEje={(v) => formato.numero(v)}
      alto={p.alto ?? 120}
      nota={T.maximoPorDia(p.capacidad)}
      tablaGemela={{ columnas: ['Día', 'Videos'], filas: p.dias.map((d) => [formato.fechaConDia(d.fecha), d.trabaja ? formato.numero(d.n) : T.sinVideos]) }}
      className={cx(css.grafica, p.className)}
    />
  );
}

/** Aside de los pasos 1 y 2: se actualiza en vivo con cada cambio del ritmo o de lo incluido. */
export function VistaPrevia(p: {
  resultado: ResultadoPlan;
  desde: C.FechaLocal;
  capacidad: number;
  dias: number[];
  muestras: C.MuestraVista[];
  provisional: boolean;
  /** Por qué no hay videos que repartir (el texto del aside vacío). */
  vacio?: MotivoVacio;
  className?: string;
}): ReactElement {
  const r = p.resultado;
  const termina = textoTermina(r);
  // «Terminas el mar 24 nov» (grande) + «publicas a más tardar el jue 26 nov» debajo: el texto sigue siendo UNO solo,
  // con su « · » (lo que lee un lector de pantalla y lo que se busca en las pruebas); el separador solo se oculta a la vista.
  const corte = termina ? termina.indexOf(' · ') : -1;
  const diasPlan = diasDelPlan(r, p.desde, p.dias);
  const hoy = hoyLocal();
  const porId = new Map(p.muestras.map((m) => [m.application_id, m] as const));
  return (
    <aside className={cx(css.previa, p.className)} aria-label={T.vistaPrevia} aria-live="polite">
      <p className={cx(css.previaRotulo)}>{T.vistaPrevia}</p>
      {termina ? (
        <>
          <p className={cx(css.previaTermina)} data-resumen-plan="">
            <span className={cx(css.previaTerminaFecha)}>{termina.slice(0, corte)}</span>
            <span className={cx(comun.lector)}> · </span>
            <span className={cx(css.previaPublica)}>{termina.slice(corte + 3)}</span>
          </p>
          <p className={cx(css.previaRitmo)}>{textoRitmo(r.asignaciones.length, p.capacidad, p.dias)}</p>
          {p.provisional ? (
            <Chip tono="info" icono="Hourglass" className={cx(css.previaChip)}>
              {T.provisionalCorto}
            </Chip>
          ) : null}
          <GraficaPlan dias={diasPlan} capacidad={p.capacidad} />
          <div className={cx(css.previaDias)}>
            <p className={cx(css.previaSubtitulo)}>{T.primerosDias}</p>
            {primerosDias(r, 2).map((d) => (
              <section key={d.fecha} className={cx(css.previaDia)} aria-label={formato.fechaConDia(d.fecha)}>
                <span className={cx(css.previaDiaTitulo)}>{etiquetaDia(d.fecha, hoy, sumarDias(hoy, 1))}</span>
                <ul className={cx(css.previaFotos)}>
                  {d.ids.slice(0, 3).map((id) => {
                    const m = porId.get(id);
                    if (!m) return null;
                    return (
                      <li key={id} className={cx(css.previaFoto)} title={`${nombreDe(m.producto)} · ${m.tienda.nombre}`}>
                        <Foto url={m.producto.imagen} alt={`${nombreDe(m.producto)}, ${m.tienda.nombre}`} anchoCss={88} proporcion="1:1" radio="md" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
                      </li>
                    );
                  })}
                  {d.ids.length > 3 ? <li className={cx(css.previaMas)}>{T.masVideos(d.ids.length - 3)}</li> : null}
                </ul>
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className={cx(css.previaVacia)}>
          <p className={cx(css.previaVaciaTitulo)}>{p.vacio === 'todas_con_fecha' ? T.todasConFecha : p.vacio === 'sin_dias' ? T.sinDiasPlan : T.sinVideosPlan}</p>
          <p className={cx(css.previaRitmo)}>{p.vacio === 'todas_con_fecha' ? T.todasConFechaTexto : p.vacio === 'sin_dias' ? T.sinDiasPlanTexto : T.sinVideosPlanTexto}</p>
        </div>
      )}
    </aside>
  );
}

/** Calendario del paso 3: semanas de lunes a domingo, cada día con su conteo y las fotos de lo que toca hacer. */
export function CalendarioPlan(p: { resultado: ResultadoPlan; desde: C.FechaLocal; dias: number[]; capacidad: number; muestras: C.MuestraVista[] }): ReactElement | null {
  const diasPlan = diasDelPlan(p.resultado, p.desde, p.dias);
  const semanas = semanasDelPlan(diasPlan);
  if (semanas.length === 0) return null;
  const hoy = hoyLocal();
  const porId = new Map(p.muestras.map((m) => [m.application_id, m] as const));
  return (
    <section className={cx(css.calendario)} aria-label={T.calendarioPlan}>
      <h3 className={cx(css.subtitulo)}>{T.calendarioPlan}</h3>
      <div className={cx(css.calRejilla)} role="table" aria-label={T.calendarioPlan}>
        <div className={cx(css.calFila, css.calCabeza)} role="row">
          {LETRAS.map((l, i) => (
            <span key={`${l}${i}`} className={cx(css.calLetra)} role="columnheader" aria-label={NOMBRES_DIA[i]}>
              {l}
            </span>
          ))}
        </div>
        {semanas.map((fila, i) => (
          <div key={i} className={cx(css.calFila)} role="row">
            {fila.map((d, j) => {
              if (d === null) return <span key={j} className={cx(css.calCelda, css.calFuera)} role="cell" aria-hidden="true" />;
              const lleno = d.trabaja && d.n >= p.capacidad;
              const fotos = d.ids.map((id) => porId.get(id)).filter((m): m is C.MuestraVista => m !== undefined);
              const etiqueta = d.trabaja ? `${formato.fechaConDia(d.fecha)}: ${cuenta(d.n, 'video')}` : `${formato.fechaConDia(d.fecha)}: ${T.sinVideos.toLowerCase()}`;
              return (
                <span
                  key={d.fecha}
                  role="cell"
                  className={cx(css.calCelda, !d.trabaja && css.calLibre, d.fecha === hoy && css.calHoy, lleno && css.calLleno)}
                  aria-label={etiqueta}
                  title={etiqueta}
                >
                  <span className={cx(css.calNumero)} aria-hidden="true">
                    {Number(d.fecha.slice(8))}
                  </span>
                  {d.trabaja ? (
                    <>
                      <span className={cx(css.calConteo)} aria-hidden="true">
                        {d.n}
                      </span>
                      {fotos.length > 0 ? (
                        <span className={cx(css.calFotos)} aria-hidden="true">
                          {fotos.slice(0, 3).map((m) => (
                            <Foto key={m.application_id} url={m.producto.imagen} alt="" anchoCss={28} proporcion="1:1" radio="xs" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.calFoto)} />
                          ))}
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <span className={cx(css.calSin)} aria-hidden="true">
                      {T.sinVideos}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

/** «Tus primeros días» del paso 3: los 2 primeros días con su lista (foto, nombre corto y tienda). */
export function PrimerosDias(p: { resultado: ResultadoPlan; muestras: C.MuestraVista[] }): ReactElement | null {
  const lista = primerosDias(p.resultado, 2);
  if (lista.length === 0) return null;
  const hoy = hoyLocal();
  const porId = new Map(p.muestras.map((m) => [m.application_id, m] as const));
  return (
    <section className={cx(css.primeros)} aria-label={T.primerosDias}>
      <h3 className={cx(css.subtitulo)}>{T.primerosDias}</h3>
      <div className={cx(css.primerosDias)}>
        {lista.map((d) => (
          <section key={d.fecha} className={cx(css.primerosDia)} aria-label={formato.fechaConDia(d.fecha)}>
            <span className={cx(css.primerosTitulo)}>{etiquetaDia(d.fecha, hoy, sumarDias(hoy, 1))}</span>
            <ul className={cx(css.primerosLista)}>
              {d.ids.map((id) => {
                const m = porId.get(id);
                if (!m) return null;
                return (
                  <li key={id} className={cx(css.primerosFila)}>
                    <Foto url={m.producto.imagen} alt="" anchoCss={44} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto44)} />
                    <span className={cx(css.primerosTextos)}>
                      <span className={cx(css.primerosNombre)}>{nombreDe(m.producto)}</span>
                      <span className={cx(css.primerosTienda)}>{m.tienda.nombre}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
