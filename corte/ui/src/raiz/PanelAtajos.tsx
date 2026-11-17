/**
 * @/raiz · panel '?' con todos los atajos (01 §3.6, 02 §11.1): los globales de la app y los que registró la pantalla o el
 * diálogo montado con useAtajos (useAtajosRegistrados). Modal de @/componentes (foco atrapado, Esc cierra).
 */
import type { ReactElement } from 'react';
import { Kbd, Modal } from '@/componentes';
import { useAtajosRegistrados } from '../app/atajos';
import { T } from './textos';
import css from './PanelAtajos.module.css';

/** 'ctrl+k' → ['Ctrl', 'K'] · 'g i' → ['G', 'I'] (secuencia) · 'shift+?' → ['?'] · 'Escape' → ['Esc']. */
export function teclasVisibles(teclas: string): { partes: string[][]; secuencia: boolean } {
  const pasos = teclas.trim().split(/\s+/).filter(Boolean);
  const nombre = (t: string): string => {
    const k = t.toLowerCase();
    if (k === 'ctrl' || k === 'meta') return 'Ctrl';
    if (k === 'shift') return 'Mayús';
    if (k === 'alt') return 'Alt';
    if (k === 'escape') return 'Esc';
    if (k === 'enter') return 'Enter';
    if (k === 'arrowup') return '↑';
    if (k === 'arrowdown') return '↓';
    return t.length === 1 ? t.toUpperCase() : t;
  };
  const partes = pasos.map((paso) => {
    const trozos = paso.endsWith('++') ? [...paso.slice(0, -2).split('+'), '+'] : paso.split('+');
    const tecla = trozos[trozos.length - 1] ?? '';
    // En los signos el Mayús depende del teclado: '?' se muestra solo.
    const mods = trozos.slice(0, -1).filter((m) => !(m.toLowerCase() === 'shift' && tecla.length === 1 && !/[a-z0-9]/i.test(tecla)));
    return [...mods, tecla].map(nombre);
  });
  return { partes, secuencia: pasos.length > 1 };
}

interface FilaAtajo {
  teclas: string[];
  descripcion: string;
}

/** Los globales de 01 §3.6 que monta el marco (se listan aunque el registro esté oculto). */
const GLOBALES: readonly FilaAtajo[] = [
  { teclas: ['ctrl+k'], descripcion: T.atajoBuscar },
  { teclas: ['g i'], descripcion: T.atajoIrInicio },
  { teclas: ['g m'], descripcion: T.atajoIrMuestras },
  { teclas: ['g t'], descripcion: T.atajoIrTiendas },
  { teclas: ['g v'], descripcion: T.atajoIrVentas },
  { teclas: ['g d'], descripcion: T.atajoIrVideos },
  { teclas: ['g p'], descripcion: T.atajoIrProductos },
  { teclas: ['ctrl+r', 'F5'], descripcion: T.atajoSincronizar },
  { teclas: ['ctrl+z'], descripcion: T.atajoDeshacer },
  { teclas: ['shift+?'], descripcion: T.atajoVerAtajos },
  { teclas: ['Escape'], descripcion: T.atajoCerrar },
];

function Combinacion(p: { teclas: string }): ReactElement {
  const v = teclasVisibles(p.teclas);
  return (
    <span className={css.combinacion}>
      {v.partes.map((paso, i) => (
        <span key={i} className={css.paso}>
          {i > 0 ? <span className={css.luego}>luego</span> : null}
          {paso.map((t, j) => (
            <Kbd key={j}>{t}</Kbd>
          ))}
        </span>
      ))}
    </span>
  );
}

function Lista(p: { titulo: string; filas: readonly FilaAtajo[] }): ReactElement {
  return (
    <section className={css.seccion} aria-label={p.titulo}>
      <h3 className={css.titulo}>{p.titulo}</h3>
      <dl className={css.lista}>
        {p.filas.map((f) => (
          <div key={`${f.teclas.join('|')}-${f.descripcion}`} className={css.fila}>
            <dt className={css.descripcion}>{f.descripcion}</dt>
            <dd className={css.teclas}>
              {f.teclas.map((t, i) => (
                <span key={t} className={css.alternativa}>
                  {i > 0 ? <span className={css.luego}>o</span> : null}
                  <Combinacion teclas={t} />
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function PanelAtajos(p: { abierto: boolean; alCerrar: () => void }): ReactElement | null {
  const registros = useAtajosRegistrados();
  const vistos = new Set<string>();
  const dePantalla: FilaAtajo[] = [];
  for (const r of registros) {
    if (r.opciones.oculto) continue;
    for (const a of r.atajos) {
      const clave = `${a.teclas}|${a.descripcion}`;
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      dePantalla.push({ teclas: [a.teclas], descripcion: a.descripcion });
    }
  }
  return (
    <Modal abierto={p.abierto} titulo={T.atajosTitulo} descripcion={T.atajosDescripcion} alCerrar={p.alCerrar} ancho={560}>
      <div className={css.panel}>
        <Lista titulo={T.atajosGlobales} filas={GLOBALES} />
        {dePantalla.length ? <Lista titulo={T.atajosPantalla} filas={dePantalla} /> : null}
      </div>
    </Modal>
  );
}
