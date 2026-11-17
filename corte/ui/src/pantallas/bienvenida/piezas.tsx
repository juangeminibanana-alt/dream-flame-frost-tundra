/**
 * Piezas de la Bienvenida: logotipo (02 §2.2, solo en Bienvenida, Acerca de y el ticket), encabezado de paso, mosaico de
 * las tiendas por avisar con la foto real de su producto y tira de fotos de las muestras que ya llegaron.
 */
import { type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { AvatarTienda, Foto } from '@/componentes';
import { nombreCorto } from '@/dominio';
import { T } from './textos';
import css from './bienvenida.module.css';
import { cx } from './clases';

export function Logotipo(p: { tamano?: number; conTexto?: boolean }): ReactElement {
  const t = p.tamano ?? 44;
  return (
    <span className={cx(css.logo)} style={{ ['--logo' as string]: `${t}px` }} role="img" aria-label="Corte">
      <svg viewBox="0 0 1024 1024" width={t} height={t} aria-hidden="true" className={cx(css.logoIcono)}>
        <rect width="1024" height="1024" rx="232" className={cx(css.logoFondo)} />
        <g transform="translate(18 -6)">
          <path d="M742 330A300 300 0 1 0 742 694L645 625A132 132 0 1 1 645 399Z" className={cx(css.logoC)} />
        </g>
      </svg>
      {p.conTexto === false ? null : (
        <span className={cx(css.logoTexto)} aria-hidden="true">
          corte
        </span>
      )}
    </span>
  );
}

export function CabezaPaso(p: { paso: number; total: number; titulo: string; texto?: ReactNode; id?: string }): ReactElement {
  return (
    <header className={cx(css.cabeza)}>
      <span className={cx(css.overline)}>{T.pasoDe(p.paso, p.total)}</span>
      <h1 className={cx(css.tituloPaso)} id={p.id}>
        {p.titulo}
      </h1>
      {p.texto ? <p className={cx(css.textoPaso)}>{p.texto}</p> : null}
    </header>
  );
}

/**
 * Mosaico de tiendas por avisar (W6 y A6): foto real del producto de cada tienda + avatar + nombre. Siempre en filas
 * completas: `columnas` fijas (4 en ancho, 2 en angosto) y `maximo` múltiplo de ellas, sin huecos al final.
 */
export function MosaicoTiendas(p: { tiendas: C.FilaTienda[]; total: number; maximo?: number; columnas?: number }): ReactElement | null {
  const columnas = p.columnas ?? 2;
  const max = p.maximo ?? columnas * 2;
  const disponibles = Math.min(max, p.tiendas.length);
  // Si no alcanzan para llenar la última fila, se muestran solo las filas completas (con al menos una fila).
  const llenas = disponibles >= columnas ? disponibles - (disponibles % columnas) : disponibles;
  const visibles = p.tiendas.slice(0, llenas);
  if (visibles.length === 0) return null;
  const resto = Math.max(0, p.total - visibles.length);
  return (
    <figure className={cx(css.mosaico)} aria-label={T.w6Tiendas}>
      <ul className={cx(css.mosaicoLista)} style={{ ['--columnas' as string]: String(columnas) }}>
        {visibles.map((t) => (
          <li key={t.tienda_key} className={cx(css.mosaicoItem)}>
            <Foto url={t.imagen} alt="" anchoCss={160} proporcion="1:1" radio="md" tienda={t.nombre} className={cx(css.mosaicoFoto)} />
            <span className={cx(css.mosaicoPie)}>
              <AvatarTienda nombre={t.nombre} tamano={20} />
              <span className={cx(css.mosaicoNombre)}>{t.nombre}</span>
            </span>
          </li>
        ))}
      </ul>
      {resto > 0 ? <figcaption className={cx(css.mosaicoMas)}>{T.w6Mas(resto)}</figcaption> : null}
    </figure>
  );
}

/** Tira de fotos de las muestras pendientes que ya llegaron (W3): «lo que ya llegó se muestra al instante». */
export function TiraMuestras(p: { muestras: C.MuestraVista[]; maximo?: number; titulo?: string }): ReactElement | null {
  const max = p.maximo ?? 7;
  if (p.muestras.length === 0) return null;
  const visibles = p.muestras.slice(0, max);
  const resto = p.muestras.length - visibles.length;
  // Siempre en UNA fila: tantas columnas como fotos (+ la de «+N»); cada casilla mide 56 como máximo y se encoge en
  // ventanas angostas en lugar de partir la tira en dos renglones.
  const columnas = visibles.length + (resto > 0 ? 1 : 0);
  return (
    <div className={cx(css.tira)} data-tira-muestras={p.muestras.length}>
      <p className={cx(css.tiraTitulo)}>{p.titulo ?? T.w3Llego(p.muestras.length)}</p>
      <ul className={cx(css.tiraLista)} style={{ ['--columnas' as string]: String(columnas) }}>
        {visibles.map((m) => (
          <li key={m.application_id} className={cx(css.tiraItem)} title={`${nombreCorto(m.producto.titulo_corto ?? m.producto.titulo, 40)} · ${m.tienda.nombre}`}>
            <Foto url={m.producto.imagen} alt={nombreCorto(m.producto.titulo_corto ?? m.producto.titulo, 60)} anchoCss={56} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
          </li>
        ))}
        {resto > 0 ? (
          <li className={cx(css.tiraMas)} aria-label={`${resto} más`}>
            {T.w3Mas(resto)}
          </li>
        ) : null}
      </ul>
    </div>
  );
}
