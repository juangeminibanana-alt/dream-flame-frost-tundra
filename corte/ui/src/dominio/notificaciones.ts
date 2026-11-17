/* @/dominio · recordatorios locales (01_ux §4.14 D; BUILD_SPEC C32 y C44). La lógica vive solo aquí: la interfaz entrega
   la lista a programarNotificaciones (que reemplaza todo lo programado). Los ids son estables (mismo evento, mismo id),
   así reprogramar nunca duplica: 'plan-<fecha>', 'vence-<solicitud>-48|24', 'promesa-<aviso>-<solicitud>',
   'atrasados-<fecha>', 'resumen-<fecha>', 'recordatorio-<id>' o 'recordatorio-<id>-<fecha>' si se repite. */
import type * as C from '@/contrato';
import type { NotificacionProgramada } from '@/plataforma';
import { diaSemana, epochDeFecha, fechaLocalDe, hoyLocal, sumarDias } from './fechas';
import { formato } from './formato';
import { nombreCorto } from './texto';
import { esPendiente, esPublicadaValida, promesaDe } from './trabajo';

const DIA_S = 86_400;
const SEMANA_S = 7 * DIA_S;

function horaRecordatorio(texto: string): { h: number; m: number } {
  const r = /^(\d{1,2}):(\d{2})$/.exec(texto.trim());
  const h = r ? Number(r[1]) : NaN;
  const m = r ? Number(r[2]) : NaN;
  return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59 ? { h, m } : { h: 10, m: 0 };
}

function nombreDe(m: C.MuestraVista | undefined, plan?: C.PlanVideo): string {
  if (plan?.nombre_corto) return plan.nombre_corto;
  if (m) return m.producto.titulo_corto ?? (nombreCorto(m.producto.titulo) || 'Tu muestra');
  return plan?.titulo ?? 'Tu muestra';
}

/** Notificaciones locales de los próximos `dias` (7): plan diario, por vencer 48/24 h, promesas (un día antes),
 *  atrasados, resumen semanal y Recordatorio activos. Solo instantes en (ahora, ahora + dias]. Ids estables. */
export function calcularNotificaciones(e: {
  muestras: C.MuestraVista[];
  planes: C.PlanVideo[];
  avisos: C.AvisoTienda[];
  recordatorios: C.Recordatorio[];
  preferencias: C.PreferenciasSincronizadas;
  ahora: C.EpochS;
  dias?: number;
}): NotificacionProgramada[] {
  const { muestras, planes, avisos, recordatorios, preferencias: pref, ahora } = e;
  const dias = Math.max(1, Math.floor(e.dias ?? 7));
  const fin = ahora + dias * DIA_S;
  const hoy = hoyLocal(ahora);
  const { h, m: min } = horaRecordatorio(pref.hora_recordatorio);
  const porId = new Map(muestras.map((m) => [m.application_id, m] as const));
  const salida = new Map<string, NotificacionProgramada>();
  const poner = (n: NotificacionProgramada): void => {
    if (n.at > ahora && n.at <= fin && !salida.has(n.id)) salida.set(n.id, n);
  };
  // Un plan cuenta si sigue Planeada y su muestra (si la conocemos) sigue pendiente.
  const planVigente = (p: C.PlanVideo): boolean => {
    if (p.estado !== 'planeada' || p.fecha_plan === null) return false;
    const m = p.application_id !== null ? porId.get(p.application_id) : undefined;
    return m === undefined || esPendiente(m);
  };
  const ordenPlan = (a: C.PlanVideo, b: C.PlanVideo): number =>
    a.orden - b.orden || (porId.get(a.application_id ?? '')?.posicion_cola ?? 1e9) - (porId.get(b.application_id ?? '')?.posicion_cola ?? 1e9)
    || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

  // 1) Plan diario ("Solo los días que haces videos"), a la hora elegida.
  if (pref.recordatorio_diario) {
    for (let k = 0; k <= dias; k++) {
      const dia = sumarDias(hoy, k);
      if (!pref.dias_videos.includes(diaSemana(dia))) continue;
      const delDia = planes.filter((p) => planVigente(p) && p.fecha_plan === dia).sort(ordenPlan);
      const primero = delDia[0];
      if (!primero) continue;
      const n = delDia.length;
      const mu = primero.application_id !== null ? porId.get(primero.application_id) : undefined;
      const tienda = mu?.tienda.nombre;
      const quien = `${nombreDe(mu, primero)}${tienda ? ` (${tienda})` : ''}`;
      poner({
        id: `plan-${dia}`,
        titulo: n === 1 ? 'Hoy toca: 1 video de muestra' : `Hoy toca: ${n} videos de muestras`,
        texto: n === 1 ? `${quien}.` : `${quien} y ${n - 1} más.`,
        at: epochDeFecha(dia, h, min),
        ruta: '#/muestras/sesion',
      });
    }
  }

  // 2) Muestras por vencer: 48 h y 24 h antes de la fecha límite.
  if (pref.aviso_por_vencer) {
    for (const m of muestras) {
      if (m.grupo !== 'por_vencer' || m.fecha_limite_at === null || !esPendiente(m)) continue;
      for (const horas of [48, 24] as const) {
        const at = m.fecha_limite_at - horas * 3600;
        poner({
          id: `vence-${m.application_id}-${horas}`,
          titulo: `Una muestra vence ${formato.relativa(m.fecha_limite_at, at)}`,
          texto: `${nombreDe(m)} de ${m.tienda.nombre}. Publica el video para que cuente en TikTok.`,
          at,
          ruta: `#/muestras/m/${m.application_id}`,
        });
      }
    }
  }

  // 3) Promesas a tiendas: un día antes de la fecha prometida, a la hora del recordatorio.
  if (pref.aviso_promesas) {
    for (const m of muestras) {
      if (m.avance.etapa === 'publicada' || m.avance.etapa === 'no_se_puede') continue;
      const promesa = promesaDe(m.application_id, avisos);
      if (promesa === null) continue;
      poner({
        id: `promesa-${promesa.aviso_id}-${m.application_id}`,
        titulo: `Mañana vence lo que le prometiste a ${m.tienda.nombre}`,
        texto: `${nombreDe(m)}: le dijiste que lo publicabas a más tardar el ${formato.fechaConDia(promesa.fecha)}.`,
        at: epochDeFecha(sumarDias(promesa.fecha, -1), h, min),
        ruta: `#/muestras/m/${m.application_id}`,
      });
    }
  }

  // 4) Videos atrasados: en el siguiente horario del recordatorio, lo planeado antes de ese día que sigue sin avanzar.
  if (pref.aviso_atrasados) {
    const hoyAt = epochDeFecha(hoy, h, min);
    const dia = hoyAt > ahora ? hoy : sumarDias(hoy, 1);
    const atrasados = planes.filter((p) => planVigente(p) && p.fecha_plan !== null && p.fecha_plan < dia);
    const n = atrasados.length;
    if (n > 0) {
      const ayer = sumarDias(dia, -1);
      const deAyer = atrasados.every((p) => p.fecha_plan === ayer);
      const cuando = deAyer ? 'de ayer' : 'de días anteriores';
      poner({
        id: `atrasados-${dia}`,
        titulo: n === 1 ? `Te quedó 1 video ${cuando}` : `Te quedaron ${n} videos ${cuando}`,
        texto: n === 1 ? 'Toca para moverlo a hoy.' : 'Toca para moverlos a hoy.',
        at: epochDeFecha(dia, h, min),
        ruta: '#/muestras/agenda',
      });
    }
  }

  // 5) Resumen semanal: los lunes a las 9:00 a. m. (la comisión de la semana no llega a esta función: ver la entrega).
  if (pref.resumen_semanal) {
    for (let k = 0; k <= dias; k++) {
      const dia = sumarDias(hoy, k);
      if (diaSemana(dia) !== 0) continue;
      const inicio = sumarDias(dia, -7);
      const publicados = planes.filter((p) => esPublicadaValida({ etapa: p.estado, vinculo_origen: p.vinculo_origen })
        && p.fecha_publicada !== null && p.fecha_publicada >= inicio && p.fecha_publicada < dia).length;
      poner({
        id: `resumen-${dia}`,
        titulo: 'Tu resumen de la semana',
        texto: `${publicados === 1 ? '1 video de muestra publicado' : `${publicados} videos de muestras publicados`} la semana pasada. Toca para ver tus ventas.`,
        at: epochDeFecha(dia, 9, 0),
        ruta: '#/ventas',
      });
    }
  }

  // 6) Recordatorio activos (los globos salen SOLO de esta lista, C44).
  for (const r of recordatorios) {
    if (r.estado !== 'activo') continue;
    const base = r.pospuesto_hasta !== null && r.pospuesto_hasta > r.vence_at ? r.pospuesto_hasta : r.vence_at;
    const mu = r.entidad === 'muestra' && r.entidad_id !== null ? porId.get(r.entidad_id) : undefined;
    let texto = 'Toca para verlo.';
    let ruta = '#/inicio';
    if (r.entidad === 'muestra' && r.entidad_id !== null) {
      ruta = `#/muestras/m/${r.entidad_id}`;
      if (mu) texto = `${nombreDe(mu)} de ${mu.tienda.nombre}.`;
    } else if (r.entidad === 'tienda' && r.entidad_id !== null) {
      ruta = `#/tiendas/${encodeURIComponent(r.entidad_id)}`;
      const nombre = muestras.find((m) => m.tienda.tienda_key === r.entidad_id)?.tienda.nombre;
      if (nombre) texto = `${nombre}.`;
    } else if (r.entidad === 'plan') {
      ruta = '#/muestras/agenda';
      texto = 'Revisa tu agenda.';
    }
    if (r.repetir === 'no') {
      poner({ id: `recordatorio-${r.id}`, titulo: r.titulo, texto, at: base, ruta });
      continue;
    }
    const paso = r.repetir === 'diario' ? DIA_S : SEMANA_S;
    let at = base;
    if (at <= ahora) at += (Math.floor((ahora - at) / paso) + 1) * paso;
    for (; at <= fin; at += paso) poner({ id: `recordatorio-${r.id}-${fechaLocalDe(at)}`, titulo: r.titulo, texto, at, ruta });
  }

  return [...salida.values()].sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
