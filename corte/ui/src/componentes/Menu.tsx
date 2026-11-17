/**
 * Menú ⋯ (02 §7, 01 §3.3). Windows: popover surface-3 con role=menu (flechas, Inicio/Fin, Esc devuelve el foco al
 * disparador, clic fuera o Tab lo cierran). Android: hoja inferior con las mismas opciones a 48 dp.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import type { NombreIcono, OpcionMenu } from '@firmas/componentes';
import { Hoja } from './Hoja';
import { Icono } from './Icono';
import { Tooltip } from './Tooltip';
import { useCapa } from './util/capas';
import { cx } from './util/clases';
import { usePlataformaHtml } from './util/entorno';
import cssBoton from './Boton.module.css';
import cssIcono from './BotonIcono.module.css';
import css from './Menu.module.css';

interface Lugar {
  x: number;
  y: number;
}

export function Menu(p: { etiqueta: string; opciones: OpcionMenu[]; icono?: NombreIcono; disparador?: 'icono' | 'boton'; className?: string }): ReactElement {
  const plataforma = usePlataformaHtml();
  const [abierto, setAbierto] = useState(false);
  const [lugar, setLugar] = useState<Lugar | null>(null);
  const disparador = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const idMenu = useId();
  const esPopover = plataforma !== 'android';

  const cerrar = useCallback((devolverFoco: boolean): void => {
    setAbierto(false);
    setLugar(null);
    if (devolverFoco) disparador.current?.focus();
  }, []);

  useCapa(abierto && esPopover, false, () => cerrar(true));

  useLayoutEffect(() => {
    if (!abierto || !esPopover) return;
    const d = disparador.current?.getBoundingClientRect();
    const l = lista.current;
    if (!d || !l) return;
    const ancho = l.offsetWidth;
    const alto = l.offsetHeight;
    let x = d.right - ancho;
    if (x < 8) x = Math.min(d.left, window.innerWidth - ancho - 8);
    let y = d.bottom + 6;
    if (y + alto > window.innerHeight - 8 && d.top - alto - 6 > 8) y = d.top - alto - 6;
    setLugar({ x: Math.max(8, x), y });
    l.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();
  }, [abierto, esPopover]);

  useEffect(() => {
    if (!abierto || !esPopover) return undefined;
    const fuera = (e: PointerEvent): void => {
      const t = e.target as Node;
      if (lista.current?.contains(t) || disparador.current?.contains(t)) return;
      cerrar(false);
    };
    const alScroll = (e: Event): void => {
      if (lista.current?.contains(e.target as Node)) return;
      cerrar(false);
    };
    document.addEventListener('pointerdown', fuera, true);
    window.addEventListener('scroll', alScroll, { capture: true, passive: true });
    window.addEventListener('resize', () => cerrar(false), { once: true });
    return () => {
      document.removeEventListener('pointerdown', fuera, true);
      window.removeEventListener('scroll', alScroll, { capture: true });
    };
  }, [abierto, esPopover, cerrar]);

  const alTeclaMenu = (e: KeyboardEvent<HTMLDivElement>): void => {
    const items = Array.from(lista.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
    const i = items.findIndex((x) => x === document.activeElement);
    const ir = (k: number): void => items[(k + items.length) % items.length]?.focus();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      ir(i + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      ir(i - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      ir(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      ir(items.length - 1);
    } else if (e.key === 'Tab') {
      cerrar(false);
    }
  };

  const elegir = (o: OpcionMenu): void => {
    if (o.deshabilitado) return;
    cerrar(esPopover);
    o.alPulsar();
  };

  const modo = p.disparador ?? 'icono';
  const boton = (
    <button
      ref={disparador}
      type="button"
      className={modo === 'icono' ? cx(cssIcono.boton, cssIcono.fantasma, abierto && cssIcono.activo, p.className) : cx(cssBoton.boton, cssBoton.secundario, cssBoton.md, p.className)}
      aria-haspopup="menu"
      aria-expanded={abierto}
      aria-controls={abierto ? idMenu : undefined}
      aria-label={modo === 'icono' ? p.etiqueta : undefined}
      onClick={() => (abierto ? cerrar(false) : setAbierto(true))}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' && !abierto) {
          e.preventDefault();
          setAbierto(true);
        }
      }}
    >
      {modo === 'icono' ? (
        <Icono nombre={p.icono ?? 'Ellipsis'} tamano={18} />
      ) : (
        <span className={cssBoton.contenido}>
          {p.icono ? <Icono nombre={p.icono} tamano={18} /> : null}
          <span>{p.etiqueta}</span>
          <Icono nombre="ChevronDown" tamano={16} />
        </span>
      )}
    </button>
  );

  const opciones = (enHoja: boolean): ReactElement[] =>
    p.opciones.map((o) => (
      <button
        key={o.id}
        type="button"
        role="menuitem"
        className={cx(css.opcion, enHoja && css.opcionHoja, o.peligro && css.peligro)}
        disabled={!!o.deshabilitado}
        onClick={() => elegir(o)}
      >
        {o.icono ? <Icono nombre={o.icono} tamano={enHoja ? 22 : 18} /> : <span className={css.sinIcono} aria-hidden="true" />}
        <span className={css.texto}>{o.etiqueta}</span>
      </button>
    ));

  return (
    <>
      <Tooltip contenido={p.etiqueta} desactivado={modo !== 'icono' || !esPopover || abierto}>
        {boton}
      </Tooltip>
      {abierto && esPopover && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={lista}
              id={idMenu}
              role="menu"
              aria-label={p.etiqueta}
              data-capa-corte=""
              className={cx(css.menu, lugar && css.colocado)}
              style={lugar ? { left: lugar.x, top: lugar.y } : { left: -9999, top: -9999 }}
              onKeyDown={alTeclaMenu}
            >
              {opciones(false)}
            </div>,
            document.body,
          )
        : null}
      {!esPopover ? (
        <Hoja abierta={abierto} titulo={p.etiqueta} alCerrar={() => cerrar(true)}>
          <div role="menu" aria-label={p.etiqueta} className={css.listaHoja} onKeyDown={alTeclaMenu} ref={lista}>
            {opciones(true)}
          </div>
        </Hoja>
      ) : null}
    </>
  );
}
