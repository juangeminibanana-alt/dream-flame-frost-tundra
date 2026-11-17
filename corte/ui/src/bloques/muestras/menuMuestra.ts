/**
 * Opciones del menú ⋯ de una muestra (01 §4.2): «Planear» / «Cambiar fecha» · «Video listo» · «Cambiar etapa…» ·
 * «Avisar a la tienda» · «Guardar imagen del producto» · «Copiar datos para tu guion» · «Abrir en la app de TikTok»
 * (Android) / «Abrir en TikTok Shop» (Windows) · «Ver tienda» · «Agregar nota» · «Fijar arriba» / «Quitar de arriba» ·
 * «No puedo hacer este video». Toda acción por gesto también existe aquí (01 §3.3).
 */
import { useMemo } from 'react';
import type * as C from '@/contrato';
import type { OpcionMenu } from '@/componentes';
import { navegar } from '@/app';
import { abrirExterno } from '@/plataforma';
import { useAbrirHoja } from '../control/contexto';
import { T } from '../textos';
import { textoAbrirFuera, useEsAndroid } from '../util/comun';
import { useControlMuestra } from '../useControlMuestra';
import { useCopiarGuion, useGuardarImagen } from './botones';

/** Etapas que admiten avance local (01 §2.4: por vencer, vencida, pausada, esperando aprobación y en camino). */
const GRUPOS_CON_ETAPAS: ReadonlySet<C.GrupoMuestra> = new Set<C.GrupoMuestra>(['por_vencer', 'vencida', 'pausada', 'esperando_aprobacion', 'en_camino']);

export function admiteEtapas(m: C.MuestraVista): boolean {
  return GRUPOS_CON_ETAPAS.has(m.grupo);
}

export function useOpcionesMuestra(m: C.MuestraVista): OpcionMenu[] {
  const control = useControlMuestra();
  const guardar = useGuardarImagen();
  const copiar = useCopiarGuion(m);
  const android = useEsAndroid();
  const abrirHoja = useAbrirHoja();
  return useMemo(() => {
    const etapa = m.avance.etapa;
    const conEtapas = admiteEtapas(m);
    const opciones: OpcionMenu[] = [];
    if (conEtapas && etapa !== 'publicada' && etapa !== 'no_se_puede') {
      opciones.push(
        m.avance.fecha_planeada
          ? { id: 'mover', etiqueta: T.cambiarFecha, icono: 'CalendarDays', alPulsar: () => void control.moverDia(m) }
          : { id: 'planear', etiqueta: T.planear, icono: 'CalendarDays', alPulsar: () => void control.planear(m) },
      );
      if (etapa !== 'video_listo') {
        opciones.push({ id: 'listo', etiqueta: T.videoListo, icono: 'Clapperboard', alPulsar: () => void control.cambiarEtapa(m, 'video_listo') });
      }
    }
    if (conEtapas) {
      opciones.push({ id: 'etapa', etiqueta: T.cambiarEtapa, icono: 'ArrowDownUp', alPulsar: () => void abrirHoja({ tipo: 'etapa', m }) });
    }
    opciones.push({ id: 'avisar', etiqueta: T.avisarTienda, icono: 'MessageCircle', alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }) });
    opciones.push({ id: 'imagen', etiqueta: T.guardarImagen, icono: 'Download', deshabilitado: m.producto.imagen === null, alPulsar: () => void guardar(m.producto) });
    opciones.push({ id: 'guion', etiqueta: T.copiarGuion, icono: 'Copy', alPulsar: () => void copiar() });
    const enlace = m.producto.enlace;
    if (enlace) opciones.push({ id: 'fuera', etiqueta: textoAbrirFuera(android), icono: 'ExternalLink', alPulsar: () => void abrirExterno(enlace) });
    opciones.push({ id: 'tienda', etiqueta: T.verTienda, icono: 'Store', alPulsar: () => navegar(`/tiendas/${encodeURIComponent(m.tienda.tienda_key)}`) });
    opciones.push({ id: 'nota', etiqueta: T.agregarNota, icono: 'Pencil', alPulsar: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}?seccion=notas`) });
    if (conEtapas) {
      opciones.push(
        m.avance.fijada
          ? { id: 'desfijar', etiqueta: T.quitarArriba, icono: 'Pin', alPulsar: () => void control.fijar(m, false) }
          : { id: 'fijar', etiqueta: T.fijarArriba, icono: 'Pin', alPulsar: () => void control.fijar(m, true) },
      );
      if (etapa !== 'no_se_puede') opciones.push({ id: 'no', etiqueta: T.noPuedo, icono: 'Ban', peligro: true, alPulsar: () => void control.noSePuede(m) });
    }
    return opciones;
  }, [m, control, guardar, copiar, android, abrirHoja]);
}
