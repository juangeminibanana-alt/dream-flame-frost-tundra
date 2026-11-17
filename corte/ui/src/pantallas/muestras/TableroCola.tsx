/**
 * Vista Tablero de Pendientes (escritorio, 01 §4.2): columnas Por planear · Planeada · Video listo · (Programada, si se
 * usa) · Publicada con su conteo y tarjetas compactas (TarjetaMuestra 'tablero'). Arrastrar a otra columna pide los
 * datos de esa etapa con useControlMuestra().cambiarEtapa (la hoja de @/bloques: fecha, fecha y hora, enlace…).
 * Alternativa sin ratón: seleccionar la tarjeta y pulsar E (acción principal).
 */
import { useMemo, useState, type DragEvent, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { TarjetaMuestra, useControlMuestra } from '@/bloques';
import { useConsulta } from '@/datos';
import { ETIQUETA_ETAPA, esPendiente, formato } from '@/dominio';
import { T } from './textos';
import { cx, vars } from './util';
import css from './Muestras.module.css';

type EtapaTablero = Exclude<C.EtapaAvance, 'no_se_puede'>;
const TIPO_ARRASTRE = 'application/x-corte-muestra';

export function TableroCola(p: { muestras: C.MuestraVista[]; seleccionada: string | null; alAbrir: (m: C.MuestraVista) => void }): ReactElement {
  const control = useControlMuestra();
  const preferencias = useConsulta('preferencias', {});
  const [sobre, setSobre] = useState<EtapaTablero | null>(null);
  const enTablero = useMemo(() => p.muestras.filter((m) => esPendiente(m) || (m.avance.etapa === 'publicada' && m.grupo !== 'en_revision')), [p.muestras]);
  const conProgramada = (preferencias.datos?.programo_mis_videos ?? false) || enTablero.some((m) => m.avance.etapa === 'programada');
  const columnas: EtapaTablero[] = ['por_planear', 'planeada', 'video_listo', ...(conProgramada ? (['programada'] as const) : []), 'publicada'];
  const porId = useMemo(() => new Map(enTablero.map((m) => [m.application_id, m] as const)), [enTablero]);

  const soltar = (etapa: EtapaTablero) => (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    setSobre(null);
    // La TarjetaMuestra 'tablero' de @/bloques ya es arrastrable y pone su propio tipo; la fila agrega el nuestro.
    const id = e.dataTransfer.getData(TIPO_ARRASTRE) || e.dataTransfer.getData('text/x-corte-muestra') || e.dataTransfer.getData('text/plain');
    const m = porId.get(id);
    if (!m || m.avance.etapa === etapa) return;
    void control.cambiarEtapa(m, etapa);
  };

  return (
    <div className={cx(css.tablero)} role="region" aria-label={T.tableroEtiqueta} style={vars({ '--columnas': columnas.length })}>
      {columnas.map((etapa) => {
        const lista = enTablero.filter((m) => m.avance.etapa === etapa);
        return (
          <section
            key={etapa}
            className={cx(css.columnaTablero)}
            data-etapa={etapa}
            data-sobre={sobre === etapa ? '' : undefined}
            aria-label={`${ETIQUETA_ETAPA[etapa]} · ${lista.length}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (sobre !== etapa) setSobre(etapa);
            }}
            onDragLeave={() => setSobre((s) => (s === etapa ? null : s))}
            onDrop={soltar(etapa)}
          >
            <header className={cx(css.columnaCabeza)}>
              <span className={cx(css.puntoEtapa)} data-etapa={etapa} aria-hidden="true" />
              <h3 className={cx(css.columnaTitulo)}>{ETIQUETA_ETAPA[etapa]}</h3>
              <span className={cx(css.seccionConteo)}>{formato.numero(lista.length)}</span>
            </header>
            {lista.length === 0 ? (
              <p className={cx(css.columnaVacia)}>{sobre === etapa ? T.soltarAqui : T.columnaVacia}</p>
            ) : (
              <ul className={cx(css.columnaLista)}>
                {lista.map((m) => (
                  <li
                    key={m.application_id}
                    data-muestra={m.application_id}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(TIPO_ARRASTRE, m.application_id);
                      e.dataTransfer.setData('text/plain', m.application_id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <TarjetaMuestra muestra={m} variante="tablero" seleccionada={p.seleccionada === m.application_id} alAbrir={() => p.alAbrir(m)} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
