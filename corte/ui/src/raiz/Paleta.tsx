/**
 * @/raiz · paleta de búsqueda global (01 §3.5, 02 §7.10). Windows: popover de 560 arriba al centro (surface-3, radio 14,
 * shadow-3) con resultados agrupados, miniaturas y avatares; la coincidencia va en <mark>. Android y ventana compacta:
 * ocupa la pantalla. Combobox accesible: ↑/↓ mueven, Enter abre, Esc cierra y el foco vuelve a donde estaba.
 */
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactElement, type ReactNode } from 'react';
import type { FilaProducto, FilaTienda, FilaVideo, MuestraVista } from '@/contrato';
import { consultar, ErrorHub } from '@/datos';
import { AvatarTienda, Foto, Icono, Kbd } from '@/componentes';
import { resaltar } from '@/dominio';
import { cx } from '../app/clases';
import { aplanar, buscarEnPaleta, type AccionPaleta, type FuentesPaleta, type ResultadoPaleta } from './busqueda';
import { textoInicialPaleta } from './capasGlobales';
import { T } from './textos';
import css from './Paleta.module.css';

const VACIAS: FuentesPaleta = { muestras: [], tiendas: [], productos: [], videos: [] };

interface Carga {
  fuentes: FuentesPaleta;
  cargando: boolean;
  necesitaPc: boolean;
}

/** Trae las 4 listas una vez por apertura (comparten la caché de @/datos con las pantallas). */
function useFuentes(abierta: boolean): Carga {
  const [carga, setCarga] = useState<Carga>({ fuentes: VACIAS, cargando: false, necesitaPc: false });
  useEffect(() => {
    if (!abierta) return undefined;
    let vigente = true;
    setCarga((c) => ({ ...c, cargando: true }));
    const leer = <T,>(p: Promise<T>): Promise<T | ErrorHub | null> =>
      p.catch((e: unknown) => (e instanceof ErrorHub ? e : null));
    void Promise.all([
      leer(consultar('muestras', { orden: 'prioridad' })),
      leer(consultar('tiendas', {})),
      leer(consultar('productos', {})),
      leer(consultar('videos', {})),
    ]).then(([m, t, p, v]) => {
      if (!vigente) return;
      const lista = <X,>(r: { items: X[] } | ErrorHub | null): X[] => (r && !(r instanceof ErrorHub) ? r.items : []);
      const necesitaPc = [m, t, p, v].some((r) => r instanceof ErrorHub && r.codigo === 'necesita_pc');
      setCarga({
        fuentes: {
          muestras: lista<MuestraVista>(m),
          tiendas: lista<FilaTienda>(t),
          productos: lista<FilaProducto>(p),
          videos: lista<FilaVideo>(v),
        },
        cargando: false,
        necesitaPc,
      });
    });
    return () => {
      vigente = false;
    };
  }, [abierta]);
  return carga;
}

function Resaltado(p: { busqueda: string; texto: string }): ReactElement {
  const rangos = p.busqueda.trim() ? resaltar(p.busqueda, p.texto) : [];
  if (rangos.length === 0) return <>{p.texto}</>;
  const partes: ReactNode[] = [];
  let i = 0;
  rangos.forEach(([a, b], k) => {
    if (a > i) partes.push(p.texto.slice(i, a));
    partes.push(
      <mark key={k} className={css.marca}>
        {p.texto.slice(a, b)}
      </mark>,
    );
    i = b;
  });
  if (i < p.texto.length) partes.push(p.texto.slice(i));
  return <>{partes}</>;
}

function Miniatura(p: { r: ResultadoPaleta }): ReactElement {
  const r = p.r;
  if (r.tipo === 'accion') {
    return (
      <span className={css.icono} aria-hidden="true">
        <Icono nombre={r.icono ?? 'ArrowRight'} tamano={18} />
      </span>
    );
  }
  if (r.tipo === 'tienda') return <AvatarTienda nombre={r.titulo} tamano={40} className={cx(css.avatar)} />;
  return (
    <span className={css.foto}>
      <Foto url={r.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" tienda={r.tienda} categoria={r.categoria} />
    </span>
  );
}

export function Paleta(p: {
  abierta: boolean;
  /** Pantalla completa (Android y ventana compacta). */
  completa: boolean;
  acciones: readonly AccionPaleta[];
  alCerrar: () => void;
  alElegir: (r: ResultadoPaleta) => void;
}): ReactElement | null {
  const [texto, setTexto] = useState('');
  const [activo, setActivo] = useState(0);
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const previo = useRef<Element | null>(null);
  const idLista = useId();
  const idTitulo = useId();
  const carga = useFuentes(p.abierta);

  const grupos = useMemo(() => buscarEnPaleta(texto, carga.fuentes, p.acciones), [texto, carga.fuentes, p.acciones]);
  const planos = useMemo(() => aplanar(grupos), [grupos]);

  useEffect(() => {
    if (!p.abierta) return undefined;
    previo.current = document.activeElement;
    setTexto(textoInicialPaleta());
    setActivo(0);
    const t = window.setTimeout(() => campo.current?.focus(), 0);
    return () => {
      window.clearTimeout(t);
      const antes = previo.current;
      if (antes instanceof HTMLElement && antes.isConnected) antes.focus({ preventScroll: true });
    };
  }, [p.abierta]);

  useEffect(() => {
    setActivo(0);
  }, [texto]);

  useEffect(() => {
    const el = lista.current?.querySelector('[aria-selected="true"]');
    if (el instanceof HTMLElement && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }, [activo]);

  if (!p.abierta) return null;

  const actual = planos[Math.min(activo, planos.length - 1)];
  const alTecla = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      p.alCerrar();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (planos.length) setActivo((i) => (i + 1) % planos.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (planos.length) setActivo((i) => (i - 1 + planos.length) % planos.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (actual) p.alElegir(actual);
    } else if (e.key === 'Tab') {
      // El foco se queda en la paleta: solo el campo y el botón de borrar son tabulables.
      const enfocables = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('input, button'));
      const i = enfocables.indexOf(document.activeElement as HTMLElement);
      const siguiente = enfocables[(i + (e.shiftKey ? -1 : 1) + enfocables.length) % enfocables.length];
      e.preventDefault();
      siguiente?.focus();
    }
  };

  const vacia = texto.trim() !== '' && planos.length === 0 && !carga.cargando;
  let indice = -1;

  return (
    <div
      className={cx(css.velo, p.completa && css.veloCompleta)}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) p.alCerrar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={cx(css.paleta, p.completa && css.completa)}
        onKeyDown={alTecla}
        data-paleta=""
      >
        <h2 id={idTitulo} className={css.sr}>
          {T.paletaTitulo}
        </h2>
        <div className={css.campo}>
          {p.completa ? (
            <button type="button" className={css.volver} onClick={p.alCerrar} aria-label={T.paletaCerrar}>
              <Icono nombre="ArrowLeft" tamano={22} />
            </button>
          ) : (
            <Icono nombre="Search" tamano={18} className={cx(css.lupa)} />
          )}
          <input
            ref={campo}
            className={css.entrada}
            type="search"
            role="combobox"
            aria-expanded="true"
            aria-controls={idLista}
            aria-autocomplete="list"
            aria-activedescendant={actual ? `${idLista}-${actual.id}` : undefined}
            aria-label={T.paletaPlaceholder}
            placeholder={p.completa ? T.paletaTitulo : T.paletaPlaceholder}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {texto ? (
            <button type="button" className={css.borrar} onClick={() => { setTexto(''); campo.current?.focus(); }} aria-label="Borrar la búsqueda">
              <Icono nombre="X" tamano={16} />
            </button>
          ) : null}
          {p.completa ? null : <Kbd className={cx(css.kbd)}>Esc</Kbd>}
        </div>

        {p.completa && !texto ? (
          // En el celular el campo es angosto: el texto completo de 01 §3.5 va como ayuda debajo (nunca cortado).
          <p className={css.pista} aria-hidden="true">
            {T.paletaPlaceholder}
          </p>
        ) : null}
        <div ref={lista} id={idLista} role="listbox" aria-label={T.paletaTitulo} className={css.resultados}>
          {grupos.map((g) => (
            <div key={g.id} role="group" aria-label={g.titulo} className={css.grupo}>
              <p className={css.grupoTitulo} aria-hidden="true">
                {g.titulo}
              </p>
              {g.resultados.map((r) => {
                indice += 1;
                const i = indice;
                const sel = actual?.id === r.id;
                return (
                  <div
                    key={r.id}
                    id={`${idLista}-${r.id}`}
                    role="option"
                    aria-selected={sel}
                    className={cx(css.opcion, sel && css.activa)}
                    onMouseMove={() => {
                      if (activo !== i) setActivo(i);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => p.alElegir(r)}
                    data-tipo={r.tipo}
                  >
                    <Miniatura r={r} />
                    <span className={css.textos}>
                      <span className={css.titulo}>
                        <Resaltado busqueda={texto} texto={r.titulo} />
                      </span>
                      {r.detalle ? (
                        <span className={css.detalle}>
                          <Resaltado busqueda={texto} texto={r.detalle} />
                        </span>
                      ) : null}
                    </span>
                    {sel && !p.completa ? (
                      <span className={css.enter} aria-hidden="true">
                        <Icono nombre="ArrowRight" tamano={16} />
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
          {vacia ? (
            <div className={css.vacio} role="status">
              <span className={css.vacioIcono} aria-hidden="true">
                <Icono nombre="Search" tamano={20} />
              </span>
              <p>{T.paletaSinResultados(texto.trim())}</p>
            </div>
          ) : null}
          {carga.cargando && texto.trim() ? (
            <p className={css.estado} role="status">
              {T.paletaCargando}
            </p>
          ) : null}
          {carga.necesitaPc && texto.trim() ? <p className={css.estado}>{T.paletaNecesitaPc}</p> : null}
        </div>

        {p.completa ? null : (
          <div className={css.pie} aria-hidden="true">
            <span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> para moverte
            </span>
            <span>
              <Kbd>Enter</Kbd> para abrir
            </span>
            <span>
              <Kbd>Esc</Kbd> para cerrar
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
