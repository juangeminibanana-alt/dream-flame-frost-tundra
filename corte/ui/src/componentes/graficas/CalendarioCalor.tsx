/**
 * Calendario de calor (02 §9.3): comisión diaria en EXACTAMENTE 5 cubetas secuenciales (--viz-seq-1…5, un solo tono,
 * validadas con --ordinal en oscuro y claro); los días sin valor van en la pista. Columnas = semanas (lunes arriba),
 * celdas con 3 px de separación. Cada celda es enfocable (flechas: ←/→ semanas, ↑/↓ días) con aria-label y lectura;
 * leyenda "Menos … Más" y tabla gemela.
 */
import { useState, type ReactElement } from 'react';
import type { CalendarioCalor as _Firma } from '@firmas/componentes';
import { diaSemana, diasEntre, formato, sumarDias } from '@/dominio';
import { cx } from '../util/clases';
import { LecturaGrafica, MarcoGrafica } from './MarcoGrafica';
import { useRoving } from './roving';
import css from './graficas.module.css';

type Props = Parameters<typeof _Firma>[0];

/** Rótulos de fila (lunes arriba): uno sí y uno no, con 3 letras para que «mié» no se confunda con «mar». */
const DIAS = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

export function cubeta(valor: number, maximo: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (!(valor > 0) || !(maximo > 0)) return 0;
  return Math.min(5, Math.max(1, Math.ceil((valor / maximo) * 5))) as 1 | 2 | 3 | 4 | 5;
}

export function CalendarioCalor(p: Props): ReactElement {
  const ordenados = [...p.dias].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));
  const primero = ordenados[0]?.fecha;
  const inicio = primero ? sumarDias(primero, -diaSemana(primero)) : null;
  const ultimo = ordenados[ordenados.length - 1]?.fecha;
  const semanas = inicio && ultimo ? Math.floor(diasEntre(inicio, ultimo) / 7) + 1 : 0;
  const roving = useRoving(ordenados.length, 7);
  const [activa, setActiva] = useState<number | null>(null);
  const maximo = Math.max(0, ...ordenados.map((d) => d.valor));
  const leyenda = (
    <span className={css.calLeyenda} aria-hidden="true">
      Menos
      {[0, 1, 2, 3, 4, 5].map((c) => (
        <i key={c} className={cx(css.calMuestra, css[`q${c}`])} />
      ))}
      Más
    </span>
  );
  return (
    <MarcoGrafica titulo={p.titulo} tablaGemela={p.tablaGemela} className={p.className} leyenda={leyenda}>
      {({ ancho }) => {
        if (!inicio || semanas === 0) return <p className={css.calVacio}>Sin días en este periodo</p>;
        const W = ancho > 0 ? ancho : 640;
        // izq: «mié» a 11 px mide ~21; arriba: el mes (base en 12) cabe entero dentro de la caja, sin depender de
        // overflow visible. La celda crece hasta 24 para que en ancho de escritorio el calendario no quede chiquito.
        const izq = 30;
        const arriba = 20;
        const separacion = 3;
        const celda = Math.max(8, Math.min(24, Math.floor((W - izq) / semanas - separacion)));
        const anchoTotal = izq + semanas * (celda + separacion);
        const H = arriba + 7 * (celda + separacion);
        const meses: Array<{ x: number; texto: string }> = [];
        let mesPrevio = '';
        for (let s = 0; s < semanas; s++) {
          const lunes = sumarDias(inicio, s * 7);
          const mes = lunes.slice(0, 7);
          if (mes !== mesPrevio) {
            const texto = formato.fechaCorta(lunes).split(' ')[1] ?? '';
            const x = izq + s * (celda + separacion);
            // Un mes que empezaría a menos de 28 px del anterior se omite (nunca dos rótulos encimados).
            if (meses.length === 0 || x - (meses[meses.length - 1]?.x ?? 0) > 28) meses.push({ x, texto });
            mesPrevio = mes;
          }
        }
        const activo = activa !== null ? ordenados[activa] : undefined;
        const posicion = (fecha: string): { x: number; y: number } => {
          const d = diasEntre(inicio, fecha);
          return { x: izq + Math.floor(d / 7) * (celda + separacion), y: arriba + (d % 7) * (celda + separacion) };
        };
        return (
          <div className={css.calMarco}>
            <svg ref={roving.contenedor} className={css.svg} width={anchoTotal} height={H} viewBox={`0 0 ${anchoTotal} ${H}`} role="group" aria-label={p.titulo} onKeyDown={roving.alTecla}>
              {meses.map((m) =>
                // El mes de la última columna se ancla al borde derecho para no salirse de la caja.
                m.x + 24 > anchoTotal ? (
                  <text key={m.x} x={anchoTotal} y={12} textAnchor="end" className={css.eje}>
                    {m.texto}
                  </text>
                ) : (
                  <text key={m.x} x={m.x} y={12} className={css.eje}>
                    {m.texto}
                  </text>
                ),
              )}
              {DIAS.map((d, i) =>
                i % 2 === 0 ? (
                  <text key={i} x={1} y={arriba + i * (celda + separacion) + celda / 2} dominantBaseline="central" className={css.eje}>
                    {d}
                  </text>
                ) : null,
              )}
              {ordenados.map((d, i) => {
                const { x, y } = posicion(d.fecha);
                return (
                  <rect
                    key={d.fecha}
                    data-marca={i}
                    x={x}
                    y={y}
                    width={celda}
                    height={celda}
                    rx={Math.min(4, celda / 4)}
                    className={cx(css.celdaCal, css[`q${cubeta(d.valor, maximo)}`], activa === i && css.celdaActiva)}
                    tabIndex={i === roving.foco ? 0 : -1}
                    role="img"
                    aria-label={`${formato.fechaConDia(d.fecha)}: ${d.texto}`}
                    onMouseEnter={() => setActiva(i)}
                    onMouseLeave={() => setActiva(null)}
                    onFocus={() => {
                      setActiva(i);
                      roving.setFoco(i);
                    }}
                    onBlur={() => setActiva(null)}
                  />
                );
              })}
            </svg>
            {activo ? (
              <LecturaGrafica x={posicion(activo.fecha).x + celda / 2} y={posicion(activo.fecha).y} ancho={Math.max(anchoTotal, W)} valor={activo.texto} etiqueta={formato.fechaConDia(activo.fecha)} />
            ) : null}
          </div>
        );
      }}
    </MarcoGrafica>
  );
}
