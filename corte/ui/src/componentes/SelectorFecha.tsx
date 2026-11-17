/**
 * Selector de fecha: chips rápidos ('Hoy', 'Mañana', 'En 3 días (dom 15 nov)') y un calendario mensual que empieza en
 * lunes, con la capacidad por día ('2/3', Agenda y Planear). Teclado: flechas entre días, RePág/AvPág cambian de mes,
 * Inicio/Fin van al inicio o fin de la semana, Enter/Espacio eligen. Fechas siempre en UTC−6 con @/dominio.
 */
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import type { FechaLocal } from '@/contrato';
import type { SelectorFechaProps } from '@firmas/componentes';
import { diaSemana, formato, hoyLocal, sumarDias } from '@/dominio';
import { BotonIcono } from './BotonIcono';
import { cx } from './util/clases';
import css from './SelectorFecha.module.css';

const INICIALES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function primeroDelMes(f: FechaLocal): FechaLocal {
  return `${f.slice(0, 7)}-01`;
}
function moverMes(primero: FechaLocal, delta: number): FechaLocal {
  const a = Number(primero.slice(0, 4));
  const m = Number(primero.slice(5, 7)) - 1 + delta;
  const anio = a + Math.floor(m / 12);
  const mes = ((m % 12) + 12) % 12;
  return `${String(anio).padStart(4, '0')}-${String(mes + 1).padStart(2, '0')}-01`;
}
function tituloMes(primero: FechaLocal): string {
  const partes = formato.fechaLarga(primero).split(' de ');
  const mes = partes[1] ?? '';
  return `${mes.charAt(0).toLocaleUpperCase('es-MX')}${mes.slice(1)} ${primero.slice(0, 4)}`;
}
function fuera(f: FechaLocal, min?: FechaLocal, max?: FechaLocal): boolean {
  return (min !== undefined && f < min) || (max !== undefined && f > max);
}

export function SelectorFecha(p: SelectorFechaProps): ReactElement {
  const hoy = hoyLocal();
  const idEtiqueta = useId();
  const [mes, setMes] = useState(() => primeroDelMes(p.valor ?? p.min ?? hoy));
  const [foco, setFoco] = useState<FechaLocal>(p.valor ?? (p.min && p.min > hoy ? p.min : hoy));
  const rejilla = useRef<HTMLDivElement>(null);
  const moverFoco = useRef(false);

  useEffect(() => {
    if (p.valor) {
      setMes(primeroDelMes(p.valor));
      setFoco(p.valor);
    }
  }, [p.valor]);

  useEffect(() => {
    if (!moverFoco.current) return;
    moverFoco.current = false;
    rejilla.current?.querySelector<HTMLButtonElement>(`[data-fecha="${foco}"]`)?.focus();
  }, [foco, mes]);

  const inicio = sumarDias(mes, -diaSemana(mes));
  const ultimo = sumarDias(moverMes(mes, 1), -1);
  const semanas = Math.ceil((diaSemana(mes) + Number(ultimo.slice(8, 10))) / 7);
  const dias: FechaLocal[] = Array.from({ length: semanas * 7 }, (_, i) => sumarDias(inicio, i));

  const elegir = (f: FechaLocal): void => {
    if (fuera(f, p.min, p.max)) return;
    setFoco(f);
    p.alCambiar(f);
  };
  const enfocar = (f: FechaLocal): void => {
    moverFoco.current = true;
    setFoco(f);
    if (primeroDelMes(f) !== mes) setMes(primeroDelMes(f));
  };
  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    const saltos: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
    if (e.key in saltos) {
      e.preventDefault();
      enfocar(sumarDias(foco, saltos[e.key] ?? 0));
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      const destino = moverMes(primeroDelMes(foco), e.key === 'PageDown' ? 1 : -1);
      enfocar(sumarDias(destino, Math.min(Number(foco.slice(8, 10)) - 1, 27)));
    } else if (e.key === 'Home') {
      e.preventDefault();
      enfocar(sumarDias(foco, -diaSemana(foco)));
    } else if (e.key === 'End') {
      e.preventDefault();
      enfocar(sumarDias(foco, 6 - diaSemana(foco)));
    }
  };

  return (
    <div className={cx(css.selector, p.className)} role="group" aria-labelledby={idEtiqueta}>
      <div className={css.cabeza}>
        <span className={css.etiqueta} id={idEtiqueta}>
          {p.etiqueta}
        </span>
        <span className={css.elegida} aria-live="polite">
          {p.valor ? formato.fechaConDia(p.valor) : 'Sin fecha'}
        </span>
      </div>
      {p.atajos && p.atajos.length > 0 ? (
        <div className={css.atajos}>
          {p.atajos.map((a) => (
            <button
              key={a.etiqueta}
              type="button"
              className={cx(css.atajo, 'hit')}
              aria-pressed={p.valor === a.fecha}
              disabled={fuera(a.fecha, p.min, p.max)}
              onClick={() => elegir(a.fecha)}
            >
              {a.etiqueta}
            </button>
          ))}
        </div>
      ) : null}
      <div className={css.calendario}>
        <div className={css.mes}>
          <BotonIcono icono="ChevronLeft" etiqueta="Mes anterior" tamano="sm" alPulsar={() => setMes(moverMes(mes, -1))} />
          <span className={css.tituloMes} aria-live="polite">
            {tituloMes(mes)}
          </span>
          <BotonIcono icono="ChevronRight" etiqueta="Mes siguiente" tamano="sm" alPulsar={() => setMes(moverMes(mes, 1))} />
        </div>
        <div className={css.semana} aria-hidden="true">
          {INICIALES.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div ref={rejilla} className={css.dias} onKeyDown={alTecla}>
          {dias.map((f) => {
            const otroMes = primeroDelMes(f) !== mes;
            const deshabilitado = fuera(f, p.min, p.max);
            const ocupacion = p.ocupacion?.[f];
            const lleno = !!ocupacion && ocupacion.usados >= ocupacion.capacidad;
            const elegido = p.valor === f;
            const etiqueta = `${formato.fechaConDia(f)}${f === hoy ? ', hoy' : ''}${ocupacion ? `, ${ocupacion.usados} de ${ocupacion.capacidad} videos` : ''}`;
            return (
              <button
                key={f}
                type="button"
                data-fecha={f}
                className={cx(css.dia, otroMes && css.otroMes, f === hoy && css.hoy, elegido && css.elegido, elegido && 'fc-selected')}
                aria-pressed={elegido}
                aria-label={etiqueta}
                tabIndex={f === foco ? 0 : -1}
                disabled={deshabilitado}
                onClick={() => elegir(f)}
                onFocus={() => setFoco(f)}
              >
                <span className={css.numero}>{Number(f.slice(8, 10))}</span>
                {ocupacion ? (
                  <span className={cx(css.ocupacion, lleno && css.lleno)} aria-hidden="true">
                    {ocupacion.usados}/{ocupacion.capacidad}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
