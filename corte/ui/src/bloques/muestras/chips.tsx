/**
 * Chips con significado de @/bloques (01 §3.7 «Chip de estado», 02 §7.2): texto + color semántico + ícono, nunca solo
 * color. Los textos salen de @/dominio (vocabulario de 01 §2) y las fechas de `formato`.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Chip, ChipEtapa, type NombreIcono, type TonoEstado } from '@/componentes';
import {
  ahoraS, ETIQUETA_ETAPA, ETIQUETA_NIVEL, ETIQUETA_SALUD, ICONO_ETAPA, ICONO_GRUPO, ICONO_RAZON, PASO_ETAPA, TONO_GRUPO,
  TONO_SALUD, formato, textoRazon,
} from '@/dominio';
import { T } from '../textos';
import { cx } from '../util/comun';

const HORAS_48 = 48 * 3600;

/** Por vencer con menos de 48 h: rojo y «Vence en {20} h» (01 §2.2, §5.5 paso 9). */
export function horasParaVencer(m: Pick<C.MuestraVista, 'grupo' | 'fecha_limite_at'>, ahora: C.EpochS = ahoraS()): number | null {
  if (m.grupo !== 'por_vencer' || m.fecha_limite_at === null) return null;
  const s = m.fecha_limite_at - ahora;
  return s < HORAS_48 ? Math.max(0, Math.floor(s / 3600)) : null;
}

/** Texto del chip TikTok (también lo usa el anuncio para lectores de pantalla). */
export function textoTikTok(m: C.MuestraVista, conMotivo = false): string {
  const horas = horasParaVencer(m);
  if (horas !== null) return horas <= 0 ? T.venceHoy : T.venceEnHoras(formato.numero(horas));
  if (m.grupo === 'por_vencer' && m.fecha_limite_at !== null) return T.venceEl(formato.fechaConDia(m.fecha_limite_at));
  if (m.grupo === 'entregada') return T.cumplida;
  const base = m.etiqueta || m.motivo;
  if (conMotivo && m.motivo && m.motivo !== base) return `${base} · ${m.motivo}`;
  return base;
}

/** Base de ChipTikTok. `sinPrefijo`: dentro de una columna «Estado en TikTok» el encabezado ya da el contexto. */
export function ChipTikTokBase(p: { muestra: C.MuestraVista; conMotivo?: boolean; sinPrefijo?: boolean; className?: string }): ReactElement {
  const m = p.muestra;
  const urgente = horasParaVencer(m) !== null;
  const tono: TonoEstado = urgente ? 'critico' : TONO_GRUPO[m.grupo];
  const icono: NombreIcono = urgente ? 'CircleAlert' : ICONO_GRUPO[m.grupo];
  return (
    <Chip tono={tono} icono={icono} {...(p.sinPrefijo ? {} : { prefijo: T.prefijoTikTok })} titulo={m.motivo} className={cx(p.className)}>
      {textoTikTok(m, p.conMotivo ?? false)}
    </Chip>
  );
}

export function ChipTikTok(p: { muestra: C.MuestraVista; conMotivo?: boolean; className?: string }): ReactElement {
  return <ChipTikTokBase muestra={p.muestra} {...(p.conMotivo !== undefined ? { conMotivo: p.conMotivo } : {})} {...(p.className ? { className: p.className } : {})} />;
}

/** «Tu avance: Planeada · vie 13 nov»: la fecha acompaña a las etapas que la tienen. */
export function textoAvance(a: C.AvanceMuestra): string {
  const base = ETIQUETA_ETAPA[a.etapa];
  if (a.etapa === 'planeada' && a.fecha_planeada) return `${base} · ${formato.fechaConDia(a.fecha_planeada)}`;
  if (a.etapa === 'programada' && a.programada_para_at !== null) return `${base} · ${formato.fechaConDia(a.programada_para_at)}`;
  if (a.etapa === 'publicada' && a.fecha_publicada) return `${base} · ${formato.fechaCorta(a.fecha_publicada)}`;
  return base;
}

/** Base de ChipAvance. `sinPrefijo`: dentro de una columna «Tu avance» el encabezado ya da el contexto. */
export function ChipAvanceBase(p: { avance: C.AvanceMuestra; sinPrefijo?: boolean; className?: string }): ReactElement {
  const a = p.avance;
  return (
    <ChipEtapa paso={PASO_ETAPA[a.etapa]} icono={ICONO_ETAPA[a.etapa]} {...(p.sinPrefijo ? {} : { prefijo: T.prefijoAvance })} className={cx(p.className)}>
      {textoAvance(a)}
    </ChipEtapa>
  );
}

export function ChipAvance(p: { avance: C.AvanceMuestra; className?: string }): ReactElement {
  return <ChipAvanceBase avance={p.avance} {...(p.className ? { className: p.className } : {})} />;
}

/** Tono de cada razón: lo que ya vende va en verde (como el lienzo aprobado); la promesa, en azul o rojo si venció. */
function tonoRazon(r: C.RazonPrioridad, m: C.MuestraVista): TonoEstado {
  switch (r) {
    case 'promesa':
      return m.avisos.promesa_vencida ? 'critico' : 'info';
    case 'posible_video':
      return 'marca';
    case 'ya_vendes_con_esta_tienda':
    case 'ya_lo_vendes':
      return 'ok';
    default:
      return 'neutro';
  }
}

/** Razones visibles (01 §2.6: las 2 primeras que apliquen). `sinPromesa` evita repetirla junto a ChipPromesa. */
export function razonesVisibles(m: C.MuestraVista, maximo: number, sinPromesa = false): C.RazonPrioridad[] {
  return m.razones.filter((r) => !(sinPromesa && r === 'promesa')).slice(0, Math.max(0, maximo));
}

export function ChipsRazonesBase(p: { muestra: C.MuestraVista; maximo?: number; sinPromesa?: boolean; className?: string }): ReactElement | null {
  const m = p.muestra;
  const razones = razonesVisibles(m, p.maximo ?? 2, p.sinPromesa ?? false);
  if (razones.length === 0) return null;
  return (
    <>
      {razones.map((r) => (
        <Chip key={r} tono={tonoRazon(r, m)} icono={ICONO_RAZON[r]} className={cx(p.className)}>
          {textoRazon(r, m)}
        </Chip>
      ))}
    </>
  );
}

export function ChipsRazones(p: { muestra: C.MuestraVista; maximo?: number; className?: string }): ReactElement | null {
  return <ChipsRazonesBase muestra={p.muestra} {...(p.maximo !== undefined ? { maximo: p.maximo } : {})} {...(p.className ? { className: p.className } : {})} />;
}

/** «Le prometiste el {vie 20 nov}» (azul) · rojo si venció (01 §2.5). Sin promesa o ya publicada: nada. */
export function ChipPromesa(p: { avisos: C.ResumenAvisosMuestra; etapa: C.EtapaAvance; className?: string }): ReactElement | null {
  const promesa = p.avisos.promesa;
  if (promesa === null || p.etapa === 'publicada' || p.etapa === 'no_se_puede') return null;
  const vencida = p.avisos.promesa_vencida;
  return (
    <Chip tono={vencida ? 'critico' : 'info'} icono="CalendarClock" className={cx(p.className)} {...(vencida ? { titulo: T.promesaPasoTitulo } : {})}>
      {T.lePrometisteElFecha(formato.fechaConDia(promesa))}
    </Chip>
  );
}

export function ChipCopiadoSinConfirmar(p: { avisos: C.ResumenAvisosMuestra; className?: string }): ReactElement | null {
  const c = p.avisos.copiado_sin_confirmar;
  if (c === null) return null;
  return (
    <Chip tono="atencion" icono="MessageCircleWarning" titulo={T.copiadoHace(formato.relativa(c.copiado_at))} className={cx(p.className)}>
      {T.copiadoSinConfirmar}
    </Chip>
  );
}

export function ChipVitrina(p: { enVitrina: boolean | null; className?: string }): ReactElement | null {
  if (p.enVitrina === null) return null;
  return p.enVitrina ? (
    <Chip tono="ok" icono="Check" className={cx(p.className)}>
      {T.enVitrina}
    </Chip>
  ) : (
    <Chip tono="neutro" icono="Store" className={cx(p.className)}>
      {T.noEnVitrina}
    </Chip>
  );
}

const TONO_NIVEL: Readonly<Record<C.NivelPrioridad, TonoEstado>> = {
  urgente: 'critico',
  alta: 'marca',
  media: 'info',
  baja: 'neutro',
  no_se_puede_etiquetar: 'atencion',
};
const ICONO_NIVEL: Readonly<Record<C.NivelPrioridad, NombreIcono>> = {
  urgente: 'CircleAlert',
  alta: 'TrendingUp',
  media: 'Minus',
  baja: 'Minus',
  no_se_puede_etiquetar: 'Ban',
};

export function ChipPrioridad(p: { nivel: C.NivelPrioridad; className?: string }): ReactElement {
  return (
    <Chip tono={TONO_NIVEL[p.nivel]} icono={ICONO_NIVEL[p.nivel]} {...(p.nivel === 'no_se_puede_etiquetar' ? {} : { prefijo: `${T.prioridad}:` })} className={cx(p.className)}>
      {ETIQUETA_NIVEL[p.nivel]}
    </Chip>
  );
}

const ICONO_SALUD: Readonly<Record<C.SaludTienda, NombreIcono>> = {
  socio_con_pendientes: 'Star',
  con_pendientes: 'CircleAlert',
  con_plan: 'CalendarCheck',
  socio: 'Star',
  al_dia: 'Check',
  vende_contigo: 'Coins',
  solo_solicitudes: 'Clock',
  solo_reembolsos: 'RotateCcw',
};

/** Salud con nombre (01 §2.7); los socios llevan estrella (también «Con plan» si es socio). */
export function ChipSalud(p: { salud: C.SaludTienda; esSocio: boolean; className?: string }): ReactElement {
  const icono: NombreIcono = p.esSocio && p.salud === 'con_plan' ? 'Star' : ICONO_SALUD[p.salud];
  return (
    <Chip tono={TONO_SALUD[p.salud]} icono={icono} className={cx(p.className)}>
      {ETIQUETA_SALUD[p.salud]}
    </Chip>
  );
}
