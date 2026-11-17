/**
 * Botones de una muestra: acción principal de la etapa (01 §2.4, tecla E), «Guardar imagen del producto» y «Copiar
 * datos para tu guion» (01 §4.3 «Para tu video»). Nunca hablan con la red: usan useControlMuestra y @/plataforma.
 */
import { useCallback, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, useToast } from '@/componentes';
import { consultar } from '@/datos';
import { copiarTexto, guardarImagen } from '@/plataforma';
import { ETIQUETA_ACCION, accionPrincipal, nombreCorto, textoDatosGuion, type AccionEtapa } from '@/dominio';
import { usePreferencias } from '../control/operaciones';
import { useControlMuestra } from '../useControlMuestra';
import { T } from '../textos';
import { cx, nombreDe } from '../util/comun';
import type { NombreIcono } from '@/componentes';

const ICONO_ACCION: Readonly<Record<AccionEtapa, NombreIcono>> = {
  planear: 'CalendarDays',
  marcar_publicada: 'CircleCheckBig',
  video_listo: 'Clapperboard',
  marcar_programada: 'CalendarClock',
  avisar: 'MessageCircle',
  cambiar_fecha: 'CalendarDays',
};

/** Acción principal visible de la muestra (null si la muestra no admite etapas). */
export function useAccionPrincipal(m: C.MuestraVista): AccionEtapa | null {
  const prefs = usePreferencias();
  return accionPrincipal(m, prefs.programo_mis_videos);
}

export function BotonAccionMuestra(p: { muestra: C.MuestraVista; tamano?: 'sm' | 'md' | 'lg'; anchoCompleto?: boolean; className?: string }): ReactElement | null {
  const control = useControlMuestra();
  const accion = useAccionPrincipal(p.muestra);
  const [ocupado, setOcupado] = useState(false);
  if (accion === null) return null;
  // En barras de acción (ancho completo) es la acción principal de la vista; en listas, secundaria (lienzo aprobado).
  const principal = p.anchoCompleto === true || p.tamano === 'lg';
  return (
    <Boton
      variante={principal ? 'primario' : 'secundario'}
      tamano={p.tamano ?? 'md'}
      anchoCompleto={p.anchoCompleto ?? false}
      cargando={ocupado}
      atajo="E"
      {...(principal ? { icono: ICONO_ACCION[accion] } : {})}
      aria-label={`${ETIQUETA_ACCION[accion]}: ${nombreDe(p.muestra.producto)}`}
      alPulsar={() => {
        setOcupado(true);
        void control.accionPrincipal(p.muestra).finally(() => setOcupado(false));
      }}
      className={cx(p.className)}
    >
      {ETIQUETA_ACCION[accion]}
    </Boton>
  );
}

/** Nombre de archivo seguro: «chaqueta-casual-para-hombre». */
export function nombreArchivoProducto(p: Pick<C.ProductoResumen, 'titulo' | 'titulo_corto' | 'product_id'>): string {
  const base = (p.titulo_corto ?? nombreCorto(p.titulo, 48))
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || `producto-${p.product_id}`;
}

/** Guarda la imagen ORIGINAL (Windows: diálogo Guardar; Android: compartir). */
export function useGuardarImagen(): (producto: C.ProductoResumen) => Promise<void> {
  const toast = useToast();
  return useCallback(async (producto: C.ProductoResumen) => {
    if (!producto.imagen) return;
    const r = await guardarImagen(producto.imagen, nombreArchivoProducto(producto));
    if (r === 'guardado') toast.mostrar({ texto: T.toastImagenGuardada, tono: 'ok' });
    else if (r === 'error') toast.mostrar({ texto: T.toastImagenError, tono: 'error' });
  }, [toast]);
}

export function BotonGuardarImagen(p: { producto: C.ProductoResumen; className?: string }): ReactElement {
  const guardar = useGuardarImagen();
  const [ocupado, setOcupado] = useState(false);
  return (
    <Boton
      variante="secundario"
      icono="Download"
      atajo="I"
      cargando={ocupado}
      deshabilitado={p.producto.imagen === null}
      alPulsar={() => {
        setOcupado(true);
        void guardar(p.producto).finally(() => setOcupado(false));
      }}
      className={cx(p.className)}
    >
      {T.guardarImagen}
    </Boton>
  );
}

/** Texto de «Copiar datos para tu guion» con las notas de la muestra al final (01 §4.3). */
export function textoGuionConNotas(m: C.MuestraVista, notas: C.Nota[]): string {
  const base = textoDatosGuion(m);
  const propias = notas.filter((n) => n.entidad === 'muestra' && n.entidad_id === m.application_id && n.texto.trim() !== '');
  if (propias.length === 0) return base;
  return `${base}\n${T.tusNotas} ${propias.map((n) => n.texto.trim()).join(' · ')}`;
}

export function useCopiarGuion(m: C.MuestraVista): () => Promise<void> {
  const toast = useToast();
  return useCallback(async () => {
    // Las notas se leen al copiar (no al pintar): una lista de N tarjetas no dispara N consultas.
    let notas: C.Nota[] = [];
    try {
      notas = (await consultar('notas', { entidad: 'muestra', entidad_id: m.application_id })).items;
    } catch {
      notas = [];
    }
    const ok = await copiarTexto(textoGuionConNotas(m, notas));
    toast.mostrar(ok ? { texto: T.toastGuionCopiado, detalle: T.toastGuionCopiadoDetalle, tono: 'ok' } : { texto: T.toastGuionNoCopiado, tono: 'error' });
  }, [m, toast]);
}

export function BotonCopiarGuion(p: { muestra: C.MuestraVista; className?: string }): ReactElement {
  const copiar = useCopiarGuion(p.muestra);
  return (
    <Boton variante="secundario" icono="Copy" alPulsar={() => void copiar()} className={cx(p.className)}>
      {T.copiarGuion}
    </Boton>
  );
}
