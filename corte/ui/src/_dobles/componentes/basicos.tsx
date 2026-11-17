/* __DOBLE_CORTE__ · doble de @/componentes: íconos, botones, chips, superficies y KPI (cajas con borde punteado;
   los interactivos funcionan). Agrupados por familia: es una herramienta temporal, no el sistema de diseño. */
import type { ReactElement, ReactNode } from 'react';
import type {
  BotonIconoProps, BotonProps, ChipFiltroProps, ChipProps, EncabezadoPantallaProps, IconoProps, InsigniaProps, KpiProps,
  NombreIcono,
} from '@firmas/componentes';
import { Caja, clases, estilosDoble as css } from '../comun/Caja';

export function Icono(p: IconoProps): ReactElement {
  const accesible = p.etiqueta ? { role: 'img', 'aria-label': p.etiqueta } : { 'aria-hidden': true };
  return (
    <span className={clases(css.caja, css.enLinea, p.className)} data-componente="Icono" data-icono={p.nombre} {...accesible}>
      <span className={css.nombre}>{p.nombre}</span>
    </span>
  );
}

function marcaIcono(nombre: NombreIcono | undefined): ReactNode {
  return nombre ? <span className={css.nombre}>[{nombre}]</span> : null;
}

export function Boton(p: BotonProps): ReactElement {
  return (
    <button
      type={p.tipo ?? 'button'}
      className={clases(
        css.boton,
        p.variante === 'primario' && css.primario,
        p.variante === 'peligro' && css.peligro,
        p.anchoCompleto && css.anchoCompleto,
        p.className,
      )}
      data-componente="Boton"
      data-variante={p.variante ?? 'secundario'}
      disabled={p.deshabilitado === true || p.cargando === true}
      aria-busy={p.cargando === true ? true : undefined}
      aria-label={p['aria-label']}
      title={p.atajo ? `Atajo: ${p.atajo}` : undefined}
      onClick={p.alPulsar}
    >
      {marcaIcono(p.icono)}
      {p.children}
      {marcaIcono(p.iconoFinal)}
    </button>
  );
}

export function BotonIcono(p: BotonIconoProps): ReactElement {
  return (
    <button
      type="button"
      className={clases(css.boton, p.activo && css.activo, p.className)}
      data-componente="BotonIcono"
      aria-label={p.etiqueta}
      title={p.etiqueta}
      aria-pressed={p.activo === undefined ? undefined : p.activo}
      aria-busy={p.girando === true ? true : undefined}
      disabled={p.deshabilitado === true}
      onClick={p.alPulsar}
    >
      <span className={css.nombre}>{p.icono}</span>
    </button>
  );
}

export function Kbd(p: { children: ReactNode; className?: string }): ReactElement {
  return (
    <kbd className={clases(css.caja, css.enLinea, p.className)} data-componente="Kbd">
      {p.children}
    </kbd>
  );
}

export function Chip(p: ChipProps): ReactElement {
  return (
    <Caja nombre="Chip" props={{ tono: p.tono, icono: p.icono }} enLinea className={p.className} etiqueta={p.titulo}>
      <span>
        {p.prefijo ? <span className={css.atenuado}>{p.prefijo} </span> : null}
        {p.children}
      </span>
    </Caja>
  );
}

export function ChipEtapa(p: { paso: 0 | 1 | 2 | 3 | 4 | 'no'; icono: NombreIcono; children: ReactNode; prefijo?: string; className?: string }): ReactElement {
  return (
    <Caja nombre="ChipEtapa" props={{ paso: p.paso, icono: p.icono }} enLinea className={p.className}>
      <span>
        {p.prefijo ? <span className={css.atenuado}>{p.prefijo} </span> : null}
        {p.children}
      </span>
    </Caja>
  );
}

export function ChipFiltro(p: ChipFiltroProps): ReactElement {
  return (
    <button
      type="button"
      className={clases(css.boton, p.activo && css.activo, p.className)}
      data-componente="ChipFiltro"
      aria-pressed={p.activo}
      onClick={() => p.alCambiar(!p.activo)}
    >
      {p.children}
      {p.conteo !== undefined ? <span className={css.atenuado}> {p.conteo}</span> : null}
    </button>
  );
}

export function Insignia(p: InsigniaProps): ReactElement {
  const maximo = p.maximo ?? 99;
  return (
    <span className={clases(css.caja, css.enLinea, p.className)} data-componente="Insignia" data-variante={p.variante} aria-label={p.etiqueta}>
      {p.valor > maximo ? `${maximo}+` : String(p.valor)}
    </span>
  );
}

export function PuntoVivo(p: { estado: 'ok' | 'sincronizando' | 'error' | 'inactivo'; pulsos?: number; className?: string }): ReactElement {
  return <Caja nombre="PuntoVivo" props={{ estado: p.estado, pulsos: p.pulsos }} enLinea className={p.className} />;
}

export function Tarjeta(p: { children: ReactNode; padding?: 'ninguno' | 'normal' | 'amplio'; alPulsar?: () => void; etiqueta?: string; className?: string }): ReactElement {
  return (
    <Caja nombre="Tarjeta" props={{ padding: p.padding }} className={p.className} alPulsar={p.alPulsar} etiqueta={p.etiqueta}>
      {p.children}
    </Caja>
  );
}

export function PanelFirma(p: { children: ReactNode; className?: string }): ReactElement {
  return (
    <Caja nombre="PanelFirma" className={p.className}>
      {p.children}
    </Caja>
  );
}

export function Banda(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; id?: string; className?: string }): ReactElement {
  return (
    <Caja nombre="Banda" props={{ titulo: p.titulo, id: p.id }} className={p.className}>
      <div className={css.fila}>
        <h2 className={css.titulo}>{p.titulo}</h2>
        {p.accion ? <a href={`#${p.accion.a}`}>{p.accion.etiqueta}</a> : null}
      </div>
      {p.children}
    </Caja>
  );
}

export function EncabezadoPantalla(p: EncabezadoPantallaProps): ReactElement {
  return (
    <Caja nombre="EncabezadoPantalla" className={p.className}>
      <div className={css.fila}>
        {p.volver ? <a href={`#${p.volver.a}`}>{p.volver.etiqueta ?? 'Volver'}</a> : null}
        <h1 className={css.titulo}>{p.titulo}</h1>
        {p.acciones}
      </div>
      {p.contexto ? <div className={css.atenuado}>{p.contexto}</div> : null}
    </Caja>
  );
}

export function Divisor(p: { vertical?: boolean; className?: string }): ReactElement {
  return <hr className={p.className} data-componente="Divisor" aria-orientation={p.vertical ? 'vertical' : 'horizontal'} />;
}

export function Kpi(p: KpiProps): ReactElement {
  return (
    <Caja nombre="Kpi" props={{ serie: p.serie }} className={p.className} alPulsar={p.alPulsar}>
      <span className={css.atenuado}>{p.etiqueta}</span>
      <span className={css.cifra}>{p.valor}</span>
      {p.variacion ? <span className={css.atenuado}>{p.variacion.texto}</span> : null}
      {p.nota ? <span className={css.atenuado}>{p.nota}</span> : null}
    </Caja>
  );
}

export function BandaKpi(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; className?: string }): ReactElement {
  return (
    <Caja nombre="BandaKpi" props={{ titulo: p.titulo }} className={p.className}>
      <div className={css.fila}>
        <h2 className={css.titulo}>{p.titulo}</h2>
        {p.accion ? <a href={`#${p.accion.a}`}>{p.accion.etiqueta}</a> : null}
      </div>
      <div className={css.fila}>{p.children}</div>
    </Caja>
  );
}
