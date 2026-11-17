/**
 * rev. 5 · Perfil de TikTok en Inicio (Display API, DashboardResponse.perfil_tiktok). Una franja discreta, sin tarjeta:
 * «@usuario en TikTok · 55.2 mil seguidores +420 en 7 días · 1.3 M likes +12.5 mil en 7 días · Ver vistas de tus videos ›».
 * Los cambios favorables van en --ok-fg y los desfavorables en --warn-fg (nunca en rojo, como los KPI); sin con qué
 * comparar (null), no se pintan. Si la Display API no está conectada (solo Windows), una invitación sutil que se puede
 * cerrar y no vuelve: «Conecta tus métricas de videos en Ajustes».
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { EnlaceRuta, navegar } from '@/app';
import { BotonIcono, Icono } from '@/componentes';
import { formato } from '@/dominio';
import { cambioConSigno, cifraCompacta } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

const CLAVE_CERRADA = 'corte.inicio.invitacion_metricas';

/** La invitación ya se cerró en este equipo (preferencia local: si el almacenamiento falla, se vuelve a ofrecer). */
export function invitacionCerrada(): boolean {
  try {
    return window.localStorage.getItem(CLAVE_CERRADA) === '1';
  } catch {
    return false;
  }
}

function cerrarInvitacion(): void {
  try {
    window.localStorage.setItem(CLAVE_CERRADA, '1');
  } catch {
    /* sin almacenamiento: se cierra mientras dure la vista */
  }
}

function Cambio(p: { valor: number | null; que: string }): ReactElement | null {
  if (p.valor === null || p.valor === 0) return null;
  const texto = cambioConSigno(p.valor);
  return (
    <span className={css.perfilCambio} data-sentido={p.valor > 0 ? 'sube' : 'baja'}>
      <span aria-hidden="true">{T.perfil.cambio(texto)}</span>
      <span className={css.srSolo}>{T.perfil.cambioLeido(texto, p.que)}</span>
    </span>
  );
}

export function PerfilTikTok(p: { perfil: C.ResumenPerfilTikTok }): ReactElement | null {
  const x = p.perfil;
  if (x.seguidores === null && x.likes_total === null) return null;
  return (
    <section className={css.perfil} aria-label={T.perfil.region} data-perfil-tiktok="">
      <span className={css.perfilIcono} aria-hidden="true">
        <Icono nombre="SquarePlay" tamano={18} />
      </span>
      <p className={css.perfilTexto}>
        <span className={css.perfilCuenta}>
          {x.username ? <b>{T.perfil.cuenta(x.username)}</b> : null} {T.perfil.enTikTok}
        </span>
        {x.seguidores !== null ? (
          <span className={css.perfilCifra} title={formato.numero(x.seguidores)}>
            <b>{cifraCompacta(x.seguidores)}</b> {T.perfil.seguidores(x.seguidores)} <Cambio valor={x.seguidores_cambio_7d} que={T.perfil.seguidores(2)} />
          </span>
        ) : null}
        {x.likes_total !== null ? (
          <span className={css.perfilCifra} title={formato.numero(x.likes_total)}>
            <b>{cifraCompacta(x.likes_total)}</b> {T.perfil.likes} <Cambio valor={x.likes_cambio_7d} que={T.perfil.likes} />
          </span>
        ) : null}
      </p>
      <EnlaceRuta a="/videos" className={css.enlaceChico}>
        {T.perfil.verVistas}
        <Icono nombre="ChevronRight" tamano={16} />
      </EnlaceRuta>
    </section>
  );
}

/** Invitación sutil (una sola vez): se cierra con ✕ o al seguir el enlace, y no vuelve en este equipo. */
export function InvitacionMetricas(): ReactElement | null {
  const [cerrada, setCerrada] = useState(() => invitacionCerrada());
  if (cerrada) return null;
  const cerrar = (): void => {
    cerrarInvitacion();
    setCerrada(true);
  };
  return (
    <aside className={css.invitacion} aria-label={T.perfil.region} data-invitacion-metricas="">
      <span className={css.perfilIcono} aria-hidden="true">
        <Icono nombre="TrendingUp" tamano={18} />
      </span>
      <button
        type="button"
        className={css.invitacionEnlace}
        onClick={() => {
          cerrarInvitacion();
          navegar('/ajustes/metricas');
        }}
      >
        {T.perfil.invitacion}
        <Icono nombre="ChevronRight" tamano={16} />
      </button>
      <BotonIcono icono="X" etiqueta={T.perfil.cerrarInvitacion} tamano="sm" alPulsar={cerrar} className={css.invitacionCerrar} />
    </aside>
  );
}
