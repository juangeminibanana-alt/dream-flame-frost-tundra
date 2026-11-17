/**
 * FIRMAS NORMATIVAS · módulo `@/app` (lo implementa ui-marco en ui/src/app/). BUILD_SPEC §8.4.
 * Navegación hash, tamaño de ventana, tema, atajos de teclado, recorridos y utilidades de pantalla.
 * rev. 3.1: `App` sale de este barril (vive en `@/raiz`, spec/ui_firmas/raiz.d.ts) para cortar el ciclo
 * app → bloques → app; se agregan useRecorrido / iniciarRecorridos (01 §4.15).
 */
import type { ReactNode, ReactElement } from 'react';
import type { Capacidades } from '@/contrato';
import type { PlataformaUi } from '@/plataforma';

// ============================================================================ rutas (hash, 01_ux §3.1)
export interface Ruta {
  /** Sin '#', p. ej. '/muestras/m/5770000000000000001'. */
  ruta: string;
  /** Parámetros con nombre de la tabla de rutas de BUILD_SPEC §8.6 (':id', ':key', ':seccion'). */
  params: Readonly<Record<string, string>>;
  /** Consulta después de '?' dentro del hash ('#/muestras?vista=tablero&mensaje=…'). */
  consulta: URLSearchParams;
}
export function useRuta(): Ruta;
/** `destino` con o sin '#': '/tiendas/value%20chic%20clothes'. Conserva el scroll de la vista anterior. */
export function navegar(destino: string, opciones?: { reemplazar?: boolean }): void;
export function atras(): void;
/** Lee/escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). */
export function useParametro(nombre: string): [string | null, (valor: string | null, opciones?: { reemplazar?: boolean }) => void];
/** Enlace interno accesible (Ctrl+clic no abre otra ventana: se ignora). */
export function EnlaceRuta(p: { a: string; children: ReactNode; className?: string; 'aria-label'?: string; reemplazar?: boolean }): ReactElement;

// ============================================================================ tamaño y plataforma (02 §5.1)
/** compacta < 600 · media 600–1179 (riel de 80) · expandida 1180–1439 · amplia ≥ 1440. */
export type ClaseAncho = 'compacta' | 'media' | 'expandida' | 'amplia';
export function useClaseAncho(): ClaseAncho;
/** true si cabe el panel de detalle de 480 px (ancho ≥ 1280 y no es compacta). */
export function usePanelDisponible(): boolean;
export function usePlataforma(): PlataformaUi;
/** Capacidades de SessionResponse (todas false mientras carga). */
export function useCapacidades(): Capacidades;

// ============================================================================ tema (02 §13: atributos en <html>)
/** Valores en español; en <html> van en inglés según la tabla de BUILD_SPEC §8.4 (oscuro → data-theme="dark", …). */
export interface EstadoTema {
  /** Tema aplicado. */
  tema: 'claro' | 'oscuro';
  /** Preferencia guardada en el hub (PreferenciasSincronizadas.tema; 'sistema' por omisión). */
  preferencia: 'sistema' | 'claro' | 'oscuro';
  densidad: 'comoda' | 'compacta' | 'tactil';
  reducirMovimiento: boolean;
}
export function useTema(): EstadoTema;

// ============================================================================ teclado (01_ux §3.6)
export interface Atajo {
  /** 'Enter' · 'Escape' · 'j' · 'shift+?' · 'ctrl+k' · 'g i' (secuencia). Sin efecto si el foco está en un campo. */
  teclas: string;
  descripcion: string;
  accion: () => void;
  /** Se evalúa en cada pulsación; false = ignorar. */
  cuando?: () => boolean;
}
/** Atajos de la pantalla o del diálogo montado (los del diálogo ganan). Se listan en el panel '?'. */
export function useAtajos(atajos: Atajo[], activo?: boolean): void;

// ============================================================================ utilidades de pantalla
/** Primera vez en ESTE equipo (caché local: recorridos, notas descartables). [esPrimera, marcarVisto]. */
export function usePrimeraVez(clave: string): [boolean, () => void];

// ============================================================================ recorridos breves (01 §4.15, rev. 3.1)
/** Secuencia FIJA: heroe_inicio → muestras → indicador_sync. Textos exactos de 01 §4.15 (los tiene ui-marco). */
export type PasoRecorrido = 'heroe_inicio' | 'muestras' | 'indicador_sync';
export interface EstadoRecorrido {
  /** true solo si el recorrido está activo y este es el paso actual (máximo uno visible a la vez). */
  visible: boolean;
  texto: string;
  esUltimo: boolean;
  /** "Siguiente": pasa al siguiente paso y navega a su pantalla si hace falta. */
  siguiente(): void;
  /** "Entendido" o cerrar: termina el recorrido completo (clave 'recorridos-v1' de usePrimeraVez). */
  entendido(): void;
}
/** Cada pantalla dueña de un paso lo pinta con <BurbujaRecorrido> de @/componentes junto al elemento que explica. */
export function useRecorrido(paso: PasoRecorrido): EstadoRecorrido;
/** Lo llama Bienvenida cuando el usuario salta W4 ("Saltar"). Si se creó el plan en W4, nunca se llama. */
export function iniciarRecorridos(): void;
/** Contenedor de cada pantalla: título accesible, restauración de scroll, límite de error por sección y
 *  `avisarInterfazLista()` la primera vez que `lista` es true. */
export function Pantalla(p: { titulo: string; lista: boolean; children: ReactNode; className?: string }): ReactElement;
/** "Algo salió mal al mostrar esta sección." [Reintentar] — nunca tumba la app completa (01_ux §4.16). */
export function LimiteError(p: { children: ReactNode; seccion: string }): ReactElement;
