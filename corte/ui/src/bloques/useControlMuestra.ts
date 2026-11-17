/**
 * useControlMuestra (spec/ui_firmas/bloques.d.ts): las acciones de una muestra que comparten tarjetas, detalle,
 * Agenda y Sesión. Las que piden datos abren la hoja que monta ProveedorBloques (01 §2.4 «Datos que pide»); las demás
 * se aplican directo con Toast y Deshacer de 6 s. Respeta promesas (01 §2.5, §4.4) y muestra C26 en los conflictos.
 */
import { useContext, useMemo } from 'react';
import type * as C from '@/contrato';
import type { ControlMuestra } from '@firmas/bloques';
import { accionPrincipal as accionDe, hoyLocal, promesaEnRiesgo, type AccionEtapa } from '@/dominio';
import { ContextoHojas, abrirMensajeEn, type PeticionHoja } from './control/contexto';
import { useOperaciones, usePreferencias } from './control/operaciones';

const RESUELTA = Promise.resolve();

export function useControlMuestra(): ControlMuestra {
  const hojas = useContext(ContextoHojas);
  const ops = useOperaciones();
  const prefs = usePreferencias();

  return useMemo<ControlMuestra>(() => {
    const abrir = (p: PeticionHoja): Promise<void> => (hojas ? hojas.abrir(p) : RESUELTA);

    const planear = async (m: C.MuestraVista, fecha?: C.FechaLocal): Promise<void> => {
      if (fecha === undefined) return abrir({ tipo: 'planear', m, modo: 'planear' });
      // Con fecha (chips de la tarjeta, arrastrar en la Agenda, «Sí, agendar»): la promesa se confirma antes. Si ya tenía
      // día, es un cambio de día: la confirmación dice «Mover y preparar mensaje» (01 §4.4).
      if (promesaEnRiesgo(fecha, m.avisos.promesa)) return abrir({ tipo: 'promesa', m, fecha, modo: m.avance.fecha_planeada ? 'mover' : 'planear' });
      await ops.aplicarEtapa(m, 'planeada', { fecha_plan: fecha });
    };

    const cambiarEtapa = async (m: C.MuestraVista, etapa: C.EtapaAvance): Promise<void> => {
      switch (etapa) {
        case 'planeada':
          return abrir({ tipo: 'planear', m, modo: m.avance.fecha_planeada ? 'mover' : 'planear' });
        case 'programada':
          return abrir({ tipo: 'programar', m });
        case 'publicada':
          return abrir({ tipo: 'publicar', m, origen: 'etapa' });
        case 'no_se_puede':
          return abrir({ tipo: 'no_se_puede', m });
        case 'video_listo':
          // Fecha automática (hoy), editable después desde el detalle.
          await ops.aplicarEtapa(m, 'video_listo', { fecha_video_listo: hoyLocal() });
          return;
        case 'por_planear':
          await ops.aplicarEtapa(m, 'por_planear', {});
          return;
      }
    };

    const abrirMensaje = (destino: { solicitud: string } | { tienda: string }): void => abrirMensajeEn(destino);

    const ejecutar = async (m: C.MuestraVista, accion: AccionEtapa | null): Promise<void> => {
      switch (accion) {
        case 'planear':
          return planear(m);
        case 'marcar_publicada':
          return cambiarEtapa(m, 'publicada');
        case 'video_listo':
          return cambiarEtapa(m, 'video_listo');
        case 'marcar_programada':
          return cambiarEtapa(m, 'programada');
        case 'avisar':
          abrirMensaje({ solicitud: m.application_id });
          return;
        case 'cambiar_fecha':
          return abrir({ tipo: 'planear', m, modo: 'mover' });
        case null:
          return;
      }
    };

    return {
      planear,
      cambiarEtapa,
      accionPrincipal: (m) => ejecutar(m, accionDe(m, prefs.programo_mis_videos)),
      noSePuede: (m) => abrir({ tipo: 'no_se_puede', m }),
      vincularVideo: (m, sugerido) => abrir({ tipo: 'publicar', m, origen: 'vincular', ...(sugerido ? { sugerido } : {}) }),
      moverDia: (m) => abrir({ tipo: 'planear', m, modo: 'mover' }),
      fijar: async (m, fijada) => {
        // «Fijar arriba» no cambia la etapa: solo el campo fijada del plan vivo (01 §2.6).
        await ops.aplicarFijada(m, fijada);
      },
      abrirMensaje,
    };
  }, [hojas, ops, prefs.programo_mis_videos]);
}
