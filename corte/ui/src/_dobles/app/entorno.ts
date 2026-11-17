/* __DOBLE_CORTE__ · doble de @/app: tamaño de ventana con matchMedia, plataforma, capacidades, tema, atajos,
   primera vez (en memoria) y recorridos inactivos. */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Capacidades } from '@/contrato';
import type { PlataformaUi } from '@/plataforma';
import type { Atajo, ClaseAncho, EstadoRecorrido, EstadoTema, PasoRecorrido } from '@firmas/app';
import { parametroDesarrollo, simulaAndroid } from '../comun/entorno';

function consulta(q: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

function suscribirMedios(consultas: readonly string[]): (avisar: () => void) => () => void {
  return (avisar) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
    const listas = consultas.map((q) => window.matchMedia(q));
    for (const l of listas) l.addEventListener('change', avisar);
    window.addEventListener('resize', avisar);
    return () => {
      for (const l of listas) l.removeEventListener('change', avisar);
      window.removeEventListener('resize', avisar);
    };
  };
}

const MEDIOS_ANCHO = ['(min-width: 600px)', '(min-width: 1180px)', '(min-width: 1280px)', '(min-width: 1440px)'] as const;
const suscribirAncho = suscribirMedios(MEDIOS_ANCHO);

function claseActual(): ClaseAncho {
  if (consulta('(min-width: 1440px)')) return 'amplia';
  if (consulta('(min-width: 1180px)')) return 'expandida';
  if (consulta('(min-width: 600px)')) return 'media';
  return 'compacta';
}

/** compacta < 600 · media 600–1179 · expandida 1180–1439 · amplia ≥ 1440. */
export function useClaseAncho(): ClaseAncho {
  return useSyncExternalStore(suscribirAncho, claseActual, () => 'expandida');
}

/** true si cabe el panel de detalle de 480 px (ancho ≥ 1280 y no es compacta). */
export function usePanelDisponible(): boolean {
  const clase = useClaseAncho();
  const ancho = useSyncExternalStore(suscribirAncho, () => consulta('(min-width: 1280px)'), () => true);
  return ancho && clase !== 'compacta';
}

export function usePlataforma(): PlataformaUi {
  return simulaAndroid() ? 'android' : 'navegador';
}

const TODAS: Capacidades = { auth: true, lan_admin: true, portapapeles: true, escribir: true, sincronizar: true };

/** En el doble (demo) todas las capacidades valen true. */
export function useCapacidades(): Capacidades {
  return TODAS;
}

const MEDIOS_TEMA = ['(prefers-color-scheme: light)', '(prefers-reduced-motion: reduce)'] as const;
const suscribirTema = suscribirMedios(MEDIOS_TEMA);

function preferenciaTema(): EstadoTema['preferencia'] {
  const p = parametroDesarrollo('tema');
  return p === 'claro' || p === 'oscuro' ? p : 'sistema';
}

function densidadPedida(): EstadoTema['densidad'] {
  const d = parametroDesarrollo('densidad');
  if (d === 'comoda' || d === 'compacta' || d === 'tactil') return d;
  return simulaAndroid() ? 'tactil' : 'comoda';
}

function firmaTema(): string {
  return [preferenciaTema(), densidadPedida(), consulta('(prefers-color-scheme: light)'), consulta('(prefers-reduced-motion: reduce)')].join('|');
}

function suscribirTemaYHash(avisar: () => void): () => void {
  const quitar = suscribirTema(avisar);
  window.addEventListener('hashchange', avisar);
  return () => {
    quitar();
    window.removeEventListener('hashchange', avisar);
  };
}

/** Preferencia desde ?tema=claro|oscuro (si no, 'sistema'), densidad desde ?densidad= o la plataforma. */
export function useTema(): EstadoTema {
  const firma = useSyncExternalStore(suscribirTemaYHash, firmaTema, () => 'sistema|comoda|false|false');
  const [preferencia, densidad, claroSistema, reducir] = firma.split('|');
  const pref: EstadoTema['preferencia'] = preferencia === 'claro' || preferencia === 'oscuro' ? preferencia : 'sistema';
  const dens: EstadoTema['densidad'] = densidad === 'compacta' || densidad === 'tactil' ? densidad : 'comoda';
  const tema: EstadoTema['tema'] = pref === 'sistema' ? (claroSistema === 'true' ? 'claro' : 'oscuro') : pref;
  return { tema, preferencia: pref, densidad: dens, reducirMovimiento: reducir === 'true' };
}

// ---------------------------------------------------------------------------------------------- atajos

function enCampo(objetivo: EventTarget | null): boolean {
  if (!(objetivo instanceof HTMLElement)) return false;
  const etiqueta = objetivo.tagName;
  return etiqueta === 'INPUT' || etiqueta === 'TEXTAREA' || etiqueta === 'SELECT' || objetivo.isContentEditable;
}

function coincideTecla(definicion: string, e: KeyboardEvent): boolean {
  const partes = definicion.toLowerCase().split('+');
  const tecla = partes[partes.length - 1] ?? '';
  const ctrl = partes.includes('ctrl');
  const shift = partes.includes('shift');
  const alt = partes.includes('alt');
  if (ctrl !== (e.ctrlKey || e.metaKey) || alt !== e.altKey) return false;
  if (shift && !e.shiftKey) return false;
  return e.key.toLowerCase() === tecla;
}

/** Atajos básicos: teclas sueltas, modificadores ('ctrl+k', 'shift+?') y secuencias de dos ('g i'). */
export function useAtajos(atajos: Atajo[], activo: boolean = true): void {
  const ref = useRef(atajos);
  ref.current = atajos;
  useEffect(() => {
    if (!activo) return undefined;
    let previa: { tecla: string; t: number } | null = null;
    const alTecla = (e: KeyboardEvent): void => {
      if (enCampo(e.target)) return;
      for (const a of ref.current) {
        if (a.cuando && !a.cuando()) continue;
        const pasos = a.teclas.split(' ').filter((x) => x.length > 0);
        if (pasos.length === 2) {
          const [p1, p2] = pasos;
          if (p1 && p2 && previa && previa.tecla === p1.toLowerCase() && Date.now() - previa.t < 1000 && coincideTecla(p2, e)) {
            e.preventDefault();
            previa = null;
            a.accion();
            return;
          }
        } else if (pasos[0] && coincideTecla(pasos[0], e)) {
          e.preventDefault();
          a.accion();
          return;
        }
      }
      previa = { tecla: e.key.toLowerCase(), t: Date.now() };
    };
    window.addEventListener('keydown', alTecla);
    return () => window.removeEventListener('keydown', alTecla);
  }, [activo]);
}

// ---------------------------------------------------------------------------------------------- primera vez y recorridos

const vistos = new Set<string>();

/** Primera vez en ESTE equipo (en el doble, en memoria). [esPrimera, marcarVisto]. */
export function usePrimeraVez(clave: string): [boolean, () => void] {
  const [, forzar] = useState(0);
  const marcar = useCallback(() => {
    vistos.add(clave);
    forzar((n) => n + 1);
  }, [clave]);
  return [!vistos.has(clave), marcar];
}

/** Recorridos inactivos en el doble. */
export function useRecorrido(paso: PasoRecorrido): EstadoRecorrido {
  return {
    visible: false,
    texto: '',
    esUltimo: paso === 'indicador_sync',
    siguiente: () => undefined,
    entendido: () => undefined,
  };
}

export function iniciarRecorridos(): void {
  /* Recorridos inactivos en el doble. */
}
