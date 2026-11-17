/**
 * @/app · atajos de teclado (01 §3.6, 02 §11.1). Un solo oyente de `keydown` en la ventana y una pila de registros:
 * - teclas sueltas ('j', 'Enter', 'Escape'), combinaciones ('ctrl+k', 'shift+?') y secuencias ('g i', 1.5 s entre teclas);
 * - sin efecto con el foco en un campo (input, textarea, select o contenteditable);
 * - los del diálogo ganan: con un diálogo modal abierto ([role="dialog"][aria-modal="true"]) solo cuentan los atajos
 *   registrados desde dentro de un diálogo; sin diálogo, ante un empate gana el registro más reciente;
 * - el panel '?' lista los registros vivos (useAtajosRegistrados).
 */
import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { Atajo } from '@firmas/app';

export interface OpcionesRegistro {
  /** Grupo para el panel '?' ('Global', 'En esta pantalla'…). */
  grupo?: string;
  /** Funciona aunque el foco esté en un campo (solo para atajos globales seguros: Ctrl+K, Ctrl+R, F5). */
  enCampos?: boolean;
  /** Funciona aunque haya un diálogo abierto (Ctrl+R / F5 nunca deben recargar el WebView). */
  siempre?: boolean;
  /** No se lista en el panel '?'. */
  oculto?: boolean;
}

export interface RegistroAtajos {
  id: number;
  atajos: Atajo[];
  enDialogo: boolean;
  opciones: OpcionesRegistro;
}

const registros: RegistroAtajos[] = [];
const oyentes = new Set<() => void>();
let version = 0;
let siguienteId = 1;
let escuchando = false;
let previa: { tecla: string; t: number } | null = null;
const VENTANA_SECUENCIA_MS = 1500;

function avisar(): void {
  version++;
  for (const o of [...oyentes]) o();
}

function hayDialogoModal(): boolean {
  return typeof document !== 'undefined' && document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
}

export function esCampo(objetivo: EventTarget | null): boolean {
  if (!(objetivo instanceof HTMLElement)) return false;
  const t = objetivo.tagName;
  if (t === 'TEXTAREA' || t === 'SELECT') return true;
  if (t === 'INPUT') {
    const tipo = (objetivo as HTMLInputElement).type;
    return !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(tipo);
  }
  return objetivo.isContentEditable || objetivo.closest('[contenteditable="true"], [contenteditable=""]') !== null;
}

interface Combinacion {
  tecla: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
}

function leerCombinacion(definicion: string): Combinacion {
  const partes = definicion.split('+');
  // 'shift++' o 'ctrl++' (la tecla es '+').
  const tecla = definicion.endsWith('++') ? '+' : (partes[partes.length - 1] ?? '');
  const mods = partes.slice(0, definicion.endsWith('++') ? -2 : -1).map((m) => m.toLowerCase());
  return { tecla, ctrl: mods.includes('ctrl') || mods.includes('meta'), shift: mods.includes('shift'), alt: mods.includes('alt') };
}

/** ¿La pulsación corresponde a una combinación ('ctrl+k', 'shift+?', 'Enter', 'j', 'F5')? */
export function coincideTecla(definicion: string, e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'>): boolean {
  const c = leerCombinacion(definicion);
  if (c.ctrl !== (e.ctrlKey || e.metaKey) || c.alt !== e.altKey) return false;
  const tecla = c.tecla;
  if (tecla.length === 1 && !/[a-z0-9]/i.test(tecla)) {
    // Signos ('?', '/'): el Mayús depende del teclado (en español '?' es Mayús+'), así que no se exige.
    return e.key === tecla;
  }
  if (c.shift !== e.shiftKey) return false;
  return e.key.toLowerCase() === tecla.toLowerCase();
}

function pasos(teclas: string): string[] {
  return teclas.trim().split(/\s+/).filter((x) => x.length > 0);
}

function candidatos(enCampo: boolean): Array<{ registro: RegistroAtajos; atajo: Atajo }> {
  const dialogo = hayDialogoModal();
  const lista: Array<{ registro: RegistroAtajos; atajo: Atajo }> = [];
  for (let i = registros.length - 1; i >= 0; i--) {
    const r = registros[i];
    if (!r) continue;
    if (dialogo && !r.enDialogo && !r.opciones.siempre) continue;
    if (enCampo && !r.opciones.enCampos) continue;
    for (const a of r.atajos) lista.push({ registro: r, atajo: a });
  }
  return lista;
}

function alTecla(e: KeyboardEvent): void {
  if (e.defaultPrevented || e.isComposing) return;
  if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;
  const enCampo = esCampo(e.target);
  const ahora = Date.now();
  const lista = candidatos(enCampo);
  // 1) Secuencias de dos ('g i') primero: ganan a una tecla suelta igual a su segunda tecla.
  if (previa && ahora - previa.t <= VENTANA_SECUENCIA_MS) {
    for (const { atajo } of lista) {
      const ps = pasos(atajo.teclas);
      if (ps.length !== 2) continue;
      const [p1, p2] = ps;
      if (!p1 || !p2 || p1.toLowerCase() !== previa.tecla || !coincideTecla(p2, e)) continue;
      if (atajo.cuando && !atajo.cuando()) continue;
      e.preventDefault();
      previa = null;
      atajo.accion();
      return;
    }
  }
  // 2) Teclas sueltas y combinaciones.
  for (const { atajo } of lista) {
    const ps = pasos(atajo.teclas);
    if (ps.length !== 1 || !ps[0] || !coincideTecla(ps[0], e)) continue;
    if (atajo.cuando && !atajo.cuando()) continue;
    e.preventDefault();
    previa = null;
    atajo.accion();
    return;
  }
  // 3) Posible inicio de secuencia.
  previa = enCampo || e.ctrlKey || e.metaKey || e.altKey ? null : { tecla: e.key.toLowerCase(), t: ahora };
}

function asegurarEscucha(): void {
  if (escuchando || typeof window === 'undefined') return;
  escuchando = true;
  window.addEventListener('keydown', alTecla);
}

/** Registro imperativo (lo usan useAtajos y los atajos globales de la raíz). Devuelve la función para quitarlo. */
export function registrarAtajos(atajos: () => Atajo[], opciones: OpcionesRegistro = {}): { quitar: () => void; actualizar: () => void } {
  asegurarEscucha();
  const registro: RegistroAtajos = { id: siguienteId++, atajos: atajos(), enDialogo: hayDialogoModal(), opciones };
  registros.push(registro);
  avisar();
  return {
    quitar: () => {
      const i = registros.indexOf(registro);
      if (i >= 0) registros.splice(i, 1);
      avisar();
    },
    actualizar: () => {
      registro.atajos = atajos();
    },
  };
}

/** Atajos de la pantalla o del diálogo montado (los del diálogo ganan). Se listan en el panel '?'. */
export function useAtajos(atajos: Atajo[], activo: boolean = true): void {
  const ref = useRef(atajos);
  ref.current = atajos;
  const firma = atajos.map((a) => `${a.teclas}\u0000${a.descripcion}`).join('\u0001');
  useEffect(() => {
    if (!activo) return undefined;
    // Las acciones se leen en cada pulsación (ref), así que un registro sirve aunque cambien los cierres.
    const r = registrarAtajos(() =>
      ref.current.map((a, i) => ({
        teclas: a.teclas,
        descripcion: a.descripcion,
        accion: () => ref.current[i]?.accion(),
        cuando: () => {
          const actual = ref.current[i];
          return actual ? (actual.cuando ? actual.cuando() : true) : false;
        },
      })),
      { grupo: 'En esta pantalla' },
    );
    return r.quitar;
  }, [activo, firma]);
}

function suscribir(fn: () => void): () => void {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

/** Registros vivos (para el panel '?'): se vuelve a pintar cuando alguien registra o quita atajos. */
export function useAtajosRegistrados(): readonly RegistroAtajos[] {
  useSyncExternalStore(suscribir, () => version, () => 0);
  return registros.slice();
}

/** Solo pruebas. */
export function reiniciarAtajos(): void {
  registros.length = 0;
  previa = null;
  avisar();
}
