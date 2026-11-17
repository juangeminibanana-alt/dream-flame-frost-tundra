/**
 * Datos del mensaje a una tienda (01 §4.8): muestras incluidas, tienda, plantillas, firma, avisos, plantilla sugerida
 * (la del hub o de la copia; respaldo plantillaRecomendada) y los valores por omisión de las variables.
 */
import { useMemo } from 'react';
import type * as C from '@/contrato';
import { useConsulta } from '@/datos';
import { ahoraS, fechaPrometidaPorOmision, plantillaRecomendada } from '@/dominio';
import { usePreferencias, useUsername } from '../control/operaciones';
import { videoPrevio } from '../muestras/TarjetaVentasProducto';
import { enlaceVideo } from '../util/comun';

const SIETE_DIAS = 7 * 86400;

export interface DatosMensaje {
  cargando: boolean;
  errorTexto: string | null;
  tienda: { nombre: string; es_socio: boolean; tienda_key: string };
  muestras: C.MuestraVista[];
  /** Pendientes de la tienda que no están incluidas (para «¿Un solo mensaje para las dos?»). */
  otrasPendientes: C.MuestraVista[];
  plantillas: C.PlantillaMensaje[];
  sugerida: string;
  firma: string;
  avisos: C.AvisoTienda[];
  /** Aviso copiado y sin confirmar (< 7 días) de estas muestras (o de la tienda si no hay muestras). */
  copiadoPendiente: C.AvisoTienda | null;
  compromisosOmision: Record<string, C.FechaLocal>;
  linkOmision: Record<'ya_publique' | 'ya_tengo_video', string | null>;
  problemaEnvio: 'no_llego' | 'incompleta' | null;
  enlaceProducto: string | null;
}

/** Nombre visible de una tienda a partir de su clave cuando aún no hay datos (solo respaldo). */
function nombreDeClave(clave: string): string {
  return clave.replace(/\b\p{L}/gu, (l) => l.toLocaleUpperCase('es-MX'));
}

export function cubre(a: C.AvisoTienda, solicitudes: readonly string[]): boolean {
  if (solicitudes.length === 0) return a.solicitud_ids.length === 0;
  return solicitudes.every((s) => a.solicitud_ids.includes(s));
}

export function useDatosMensaje(tiendaKey: string, solicitudes: readonly string[]): DatosMensaje {
  const deTienda = useConsulta('muestras', { tienda: tiendaKey });
  const una = solicitudes.length === 1 ? solicitudes[0] : undefined;
  const detalle = useConsulta('muestra', { id: una ?? '' }, { activa: una !== undefined });
  const tiendaDetalle = useConsulta('tienda', { key: tiendaKey }, { activa: una === undefined });
  const plantillas = useConsulta('plantillas', {});
  const avisos = useConsulta('avisos', { tienda: tiendaKey });
  const prefs = usePreferencias();
  const username = useUsername();

  return useMemo<DatosMensaje>(() => {
    // El hub ya filtra por tienda; se vuelve a filtrar aquí por si la fuente no aplicó el filtro (transporte de
    // demostración, copia del celular): nunca se mezclan muestras ni avisos de otra tienda en el mensaje.
    const items = (deTienda.datos?.items ?? tiendaDetalle.datos?.muestras ?? []).filter((m) => m.tienda.tienda_key === tiendaKey);
    const muestras = solicitudes.map((id) => items.find((m) => m.application_id === id) ?? (detalle.datos?.muestra.application_id === id ? detalle.datos.muestra : undefined)).filter((m): m is C.MuestraVista => m !== undefined);
    const otrasPendientes = items.filter((m) => !solicitudes.includes(m.application_id) && ['por_vencer', 'vencida', 'pausada'].includes(m.grupo) && m.avance.etapa !== 'publicada' && m.avance.etapa !== 'no_se_puede');
    const primera = muestras[0] ?? items[0];
    const filaTienda = tiendaDetalle.datos?.tienda;
    const tienda = {
      tienda_key: tiendaKey,
      nombre: primera?.tienda.nombre ?? filaTienda?.nombre ?? nombreDeClave(tiendaKey),
      es_socio: primera?.tienda.es_socio ?? filaTienda?.es_socio ?? false,
    };
    const listaAvisos = (avisos.datos?.items ?? []).filter((a) => a.tienda_key === tiendaKey);
    const promesaVencida = muestras.some((m) => m.avisos.promesa_vencida);
    const sugeridaHub = una !== undefined ? detalle.datos?.plantilla_sugerida : tiendaDetalle.datos?.plantilla_sugerida;
    const sugerida = sugeridaHub ?? plantillaRecomendada({ muestras, promesa_vencida: promesaVencida, es_socio: tienda.es_socio });
    const compromisosOmision: Record<string, C.FechaLocal> = {};
    for (const m of muestras) {
      const f = fechaPrometidaPorOmision(m.avance);
      if (f !== null) compromisosOmision[m.application_id] = f;
    }
    const ahora = ahoraS();
    const copiadoPendiente = listaAvisos
      .filter((a) => a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS && cubre(a, solicitudes))
      .sort((a, b) => (b.copiado_at ?? 0) - (a.copiado_at ?? 0))[0] ?? null;
    const contenido = muestras.find((m) => m.avance.content_id !== null)?.avance.content_id ?? null;
    const previo = detalle.datos ? videoPrevio(detalle.datos.videos_del_producto) : null;
    const planMuestra = detalle.datos?.planes.find((x) => x.application_id === una) ?? null;
    const motivo = planMuestra?.motivo_no_se_puede ?? null;
    return {
      cargando: (solicitudes.length > 0 && muestras.length < solicitudes.length && (deTienda.cargando || detalle.cargando)) || plantillas.cargando,
      errorTexto: plantillas.error?.mensaje ?? (muestras.length < solicitudes.length && !deTienda.cargando ? deTienda.error?.mensaje ?? null : null),
      tienda,
      muestras,
      otrasPendientes,
      plantillas: plantillas.datos?.items ?? [],
      sugerida,
      firma: prefs.firma,
      avisos: listaAvisos,
      copiadoPendiente,
      compromisosOmision,
      linkOmision: {
        ya_publique: contenido ? enlaceVideo(username, contenido) : planMuestra?.enlace_video ?? null,
        ya_tengo_video: previo?.enlace ?? null,
      },
      problemaEnvio: motivo === 'no_llego' || motivo === 'incompleta' ? motivo : null,
      enlaceProducto: muestras[0]?.producto.enlace ?? null,
    };
  }, [deTienda.datos, deTienda.cargando, deTienda.error, detalle.datos, detalle.cargando, tiendaDetalle.datos, plantillas.datos, plantillas.cargando, plantillas.error, avisos.datos, prefs.firma, username, solicitudes, tiendaKey, una]);
}
