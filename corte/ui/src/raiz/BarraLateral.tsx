/**
 * @/raiz · barra lateral de Windows (01 §3.2, 02 §7.7, lienzo Main.png): 248 px en expandida y amplia, riel de 80 en
 * media (ícono de 20 con etiqueta corta de 11 debajo). Grupos TU TRABAJO (Inicio · Muestras · Tiendas) y ESTADÍSTICAS
 * (Ventas · Videos · Productos); insignias de Muestras (pendientes) y Tiendas (por avisar), en rojo solo con riesgo
 * real (por vencer en < 48 h · promesas vencidas). El atajo «G I» aparece en kbd al pasar el cursor. Pie: indicador de
 * sincronización, celular y la cuenta (avatar + @usuario + ⚙, con punto rojo si hay problema de conexión).
 */
import type { MouseEvent, ReactElement } from 'react';
import { useSesion } from '@/datos';
import { AvatarCuenta, Icono, Insignia, Kbd } from '@/componentes';
import { navegar } from '../app/navegacion';
import { cx } from '../app/clases';
import type { ConteosTrabajo } from '@/dominio';
import { DESTINOS_LATERAL, type DestinoNav, type IdDestino } from './destinos';
import { IndicadorSync } from './IndicadorSync';
import { Logo } from './Logo';
import { T } from './textos';
import css from './BarraLateral.module.css';

export interface InsigniaNav {
  valor: number;
  variante: 'atencion' | 'critica';
  etiqueta: string;
}

/** Insignias de 01 §3.2: Muestras ámbar = pendientes, roja = por vencer (gana la roja); Tiendas ámbar = por avisar, roja = promesas vencidas. */
export function insigniasNav(c: ConteosTrabajo | null): Partial<Record<IdDestino, InsigniaNav>> {
  if (!c) return {};
  const r: Partial<Record<IdDestino, InsigniaNav>> = {};
  if (c.pendientes > 0) {
    r.muestras = c.por_vencer_48h > 0
      ? { valor: c.pendientes, variante: 'critica', etiqueta: T.insigniaMuestrasUrgente(c.pendientes, c.por_vencer_48h) }
      : { valor: c.pendientes, variante: 'atencion', etiqueta: T.insigniaMuestras(c.pendientes) };
  }
  if (c.tiendas_por_avisar > 0 || c.promesas_vencidas > 0) {
    r.tiendas = c.promesas_vencidas > 0
      ? { valor: c.tiendas_por_avisar > 0 ? c.tiendas_por_avisar : c.promesas_vencidas, variante: 'critica', etiqueta: T.insigniaTiendasPromesas(c.tiendas_por_avisar, c.promesas_vencidas) }
      : { valor: c.tiendas_por_avisar, variante: 'atencion', etiqueta: T.insigniaTiendas(c.tiendas_por_avisar) };
  }
  return r;
}

function irA(a: string) {
  return (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navegar(a);
  };
}

function Item(p: { d: DestinoNav; activo: boolean; riel: boolean; insignia: InsigniaNav | undefined }): ReactElement {
  const { d } = p;
  const atajo = d.atajo ? d.atajo.toUpperCase() : null;
  return (
    <li>
      <a
        href={`#${d.a}`}
        className={cx(css.item, p.activo && css.activo)}
        aria-current={p.activo ? 'page' : undefined}
        aria-keyshortcuts={atajo ?? undefined}
        title={p.riel ? d.etiqueta : undefined}
        onClick={irA(d.a)}
        data-destino={d.id}
      >
        <span className={css.icono}>
          <Icono nombre={d.icono} tamano={20} />
          {p.riel && p.insignia ? <Insignia {...p.insignia} className={cx(css.insigniaRiel)} /> : null}
        </span>
        <span className={css.etiqueta}>{d.etiqueta}</span>
        {!p.riel && atajo ? <Kbd className={cx(css.atajo)}>{atajo}</Kbd> : null}
        {!p.riel && p.insignia ? <Insignia {...p.insignia} className={cx(css.insignia)} /> : null}
      </a>
    </li>
  );
}

export function BarraLateral(p: {
  modo: 'lateral' | 'riel';
  activo: IdDestino | null;
  enAjustes: boolean;
  insignias: Partial<Record<IdDestino, InsigniaNav>>;
  demo: boolean;
}): ReactElement {
  const riel = p.modo === 'riel';
  const sesion = useSesion();
  const cuenta = sesion.datos?.cuenta ?? null;
  const conexion = sesion.datos?.conexion;
  const problema = !!conexion && (conexion.estado !== 'conectada' || conexion.scopes_faltantes.length > 0);
  const etiquetaCuenta = cuenta ? `${T.ajustes} · @${cuenta.username}` : T.ajustes;

  const grupo = (id: 'trabajo' | 'estadisticas', titulo: string): ReactElement => (
    <div className={css.grupo} role="group" aria-label={titulo}>
      {riel ? <span className={css.separador} aria-hidden="true" /> : <p className={css.overline} aria-hidden="true">{titulo}</p>}
      <ul className={css.lista} role="list">
        {DESTINOS_LATERAL.filter((d) => d.grupo === id).map((d) => (
          <Item key={d.id} d={d} activo={p.activo === d.id} riel={riel} insignia={p.insignias[d.id]} />
        ))}
      </ul>
    </div>
  );

  return (
    <nav className={cx(css.barra, riel ? css.riel : css.lateral)} aria-label={T.navPrincipal} data-nav={p.modo}>
      <div className={css.marca}>
        <Logo tamano={riel ? 32 : 30} />
        {riel ? null : <span className={css.wordmark}>{T.marca}</span>}
      </div>
      {p.demo ? (
        <p className={css.demo} title={T.demo}>
          <span className={css.demoPunto} aria-hidden="true" />
          <span className={riel ? css.sr : undefined}>{T.demo}</span>
          {riel ? <span aria-hidden="true">{T.demoCorto}</span> : null}
        </p>
      ) : null}

      {grupo('trabajo', T.grupoTrabajo)}
      {grupo('estadisticas', T.grupoEstadisticas)}

      <div className={css.relleno} />

      <div className={css.pie}>
        <IndicadorSync variante={riel ? 'riel' : 'lateral'} android={false} />
        <a
          href="#/ajustes"
          className={cx(css.item, css.cuenta, p.enAjustes && css.activo)}
          aria-current={p.enAjustes ? 'page' : undefined}
          aria-label={problema ? `${etiquetaCuenta}. ${T.cuentaProblema}` : etiquetaCuenta}
          title={riel ? etiquetaCuenta : undefined}
          onClick={irA('/ajustes')}
          data-destino="ajustes"
        >
          <span className={css.avatar}>
            {cuenta ? <AvatarCuenta url={cuenta.avatar} username={cuenta.username} tamano={32} /> : <Icono nombre="Settings" tamano={20} />}
            {problema ? <span className={cx(css.puntoProblema, 'fc-fill')} aria-hidden="true" /> : null}
          </span>
          {riel ? null : (
            <>
              <span className={css.etiqueta}>{cuenta ? `@${cuenta.username}` : T.ajustes}</span>
              {cuenta ? <Icono nombre="Settings" tamano={18} className={cx(css.engrane)} /> : null}
            </>
          )}
        </a>
      </div>
    </nav>
  );
}
