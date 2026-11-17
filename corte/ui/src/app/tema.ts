/**
 * @/app · tema, densidad y movimiento (02 §11–13, BUILD_SPEC §8.4 · C24 · C48). Los valores viven en español en los
 * contratos y van en inglés en <html> con la tabla EXACTA de §8.4:
 *
 * | Origen (contrato)                          | Atributo               | Valor en <html>                                      |
 * |--------------------------------------------|------------------------|------------------------------------------------------|
 * | EstadoTema.tema oscuro · claro             | data-theme             | dark · light (+ localStorage['corte.tema'])          |
 * |   (sin preferencia cargada)                | data-theme             | system (o lo que dejó tema-inicial.js)               |
 * | preferencia sistema                        | data-theme             | system hasta resolverlo con matchMedia → dark/light  |
 * | densidad comoda · compacta · tactil        | data-density           | comfortable · compact · touch (Android siempre touch)|
 * | plataforma                                 | data-platform          | windows · android                                    |
 * | vidrio                                     | data-glass             | on en Windows; en Android lo pone Java               |
 * | reducir_animaciones si                     | data-reduced-motion    | presente (sin data-motion)                           |
 * | reducir_animaciones no                     | data-motion            | full (sin data-reduced-motion)                       |
 * | reducir_animaciones sistema                | data-reduced-motion    | presente si prefers-reduced-motion o Java puso       |
 * |                                            |                        | data-system-reduced-motion; si no, ninguno           |
 *
 * calcularAtributos() es pura (la prueba recorre la tabla); aplicarAtributos() escribe <html> y la clave de
 * tema-inicial.js. useTema() lee la preferencia del hub (PreferenciasSincronizadas, también en la copia del celular),
 * la densidad de AjustesPc (Windows) y el sistema (matchMedia + dato de Java).
 */
import { useSyncExternalStore } from 'react';
import { useConsulta } from '@/datos';
import type { PlataformaUi } from '@/plataforma';
import type { EstadoTema } from '@firmas/app';
import { almacen, parametroDesarrollo } from './entorno';
import { usePlataforma } from './entornoUi';

export type PreferenciaTema = EstadoTema['preferencia'];
export type PreferenciaMovimiento = 'sistema' | 'si' | 'no';
export type Densidad = EstadoTema['densidad'];

/** Clave que lee public/tema-inicial.js antes de pintar (sin destello oscuro → claro). */
export const CLAVE_TEMA = 'corte.tema';

export interface EntradaAtributos {
  /** null = la preferencia todavía no llega del hub (o de la copia). */
  preferencia: PreferenciaTema | null;
  /** prefers-color-scheme: true = oscuro, false = claro, null = sin dato del sistema. */
  sistemaOscuro: boolean | null;
  densidad: Densidad;
  plataforma: PlataformaUi;
  reducir: PreferenciaMovimiento;
  /** prefers-reduced-motion: reduce. */
  sistemaReduce: boolean;
  /** <html data-system-reduced-motion> (lo escribe Java si las animaciones del sistema están apagadas). */
  javaReduce: boolean;
  /** Lo que dejó tema-inicial.js (localStorage['corte.tema']) mientras no hay preferencia. */
  temaGuardado: string | null;
}

export interface AtributosHtml {
  'data-theme': 'dark' | 'light' | 'system';
  'data-density': 'comfortable' | 'compact' | 'touch';
  'data-platform': 'windows' | 'android';
  /** 'on' en Windows; null = no lo toca la interfaz (Android: Java decide). */
  'data-glass': 'on' | null;
  /** true = atributo presente. */
  'data-reduced-motion': boolean;
  'data-motion': 'full' | null;
  /** Valor para localStorage['corte.tema']; null = no escribir (todavía no hay preferencia). */
  guardar: 'dark' | 'light' | 'system' | null;
}

const DENSIDAD_HTML: Readonly<Record<Densidad, AtributosHtml['data-density']>> = { comoda: 'comfortable', compacta: 'compact', tactil: 'touch' };

function temaDeSistema(sistemaOscuro: boolean | null): AtributosHtml['data-theme'] {
  if (sistemaOscuro === null) return 'system';
  return sistemaOscuro ? 'dark' : 'light';
}

/** Tabla de BUILD_SPEC §8.4 (C48). Pura. */
export function calcularAtributos(e: EntradaAtributos): AtributosHtml {
  let tema: AtributosHtml['data-theme'];
  let guardar: AtributosHtml['guardar'];
  if (e.preferencia === null) {
    tema = e.temaGuardado === 'dark' || e.temaGuardado === 'light' || e.temaGuardado === 'system' ? e.temaGuardado : 'system';
    guardar = null;
  } else if (e.preferencia === 'sistema') {
    tema = temaDeSistema(e.sistemaOscuro);
    guardar = 'system';
  } else {
    tema = e.preferencia === 'oscuro' ? 'dark' : 'light';
    guardar = tema;
  }
  const android = e.plataforma === 'android';
  const reducido = e.reducir === 'si' || (e.reducir === 'sistema' && (e.sistemaReduce || e.javaReduce));
  return {
    'data-theme': tema,
    'data-density': android ? 'touch' : DENSIDAD_HTML[e.densidad],
    'data-platform': android ? 'android' : 'windows',
    'data-glass': android ? null : 'on',
    'data-reduced-motion': reducido,
    'data-motion': e.reducir === 'no' ? 'full' : null,
    guardar,
  };
}

/** Escribe los atributos en <html> y la clave de tema-inicial.js. */
export function aplicarAtributos(html: HTMLElement, a: AtributosHtml): void {
  const fijar = (nombre: string, valor: string): void => {
    if (html.getAttribute(nombre) !== valor) html.setAttribute(nombre, valor);
  };
  fijar('data-theme', a['data-theme']);
  fijar('data-density', a['data-density']);
  fijar('data-platform', a['data-platform']);
  if (a['data-glass'] !== null) fijar('data-glass', a['data-glass']);
  if (a['data-reduced-motion']) fijar('data-reduced-motion', '');
  else html.removeAttribute('data-reduced-motion');
  if (a['data-motion'] !== null) fijar('data-motion', a['data-motion']);
  else html.removeAttribute('data-motion');
  if (a.guardar !== null && almacen.leer(CLAVE_TEMA) !== a.guardar) almacen.escribir(CLAVE_TEMA, a.guardar);
}

/** Tema que de verdad se ve ('system' sin dato del sistema = oscuro, C24). */
export function temaVisible(a: AtributosHtml, sistemaOscuro: boolean | null): EstadoTema['tema'] {
  if (a['data-theme'] === 'light') return 'claro';
  if (a['data-theme'] === 'dark') return 'oscuro';
  return sistemaOscuro === false ? 'claro' : 'oscuro';
}

// ---------------------------------------------------------------------------------------------- sistema

function suscribirSistema(avisar: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const listas = typeof window.matchMedia === 'function'
    ? ['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)', '(prefers-reduced-motion: reduce)'].map((q) => window.matchMedia(q))
    : [];
  for (const l of listas) l.addEventListener('change', avisar);
  const o = typeof MutationObserver === 'undefined' ? null : new MutationObserver(avisar);
  o?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-system-reduced-motion'] });
  window.addEventListener('hashchange', avisar);
  return () => {
    for (const l of listas) l.removeEventListener('change', avisar);
    o?.disconnect();
    window.removeEventListener('hashchange', avisar);
  };
}

function media(q: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;
}

/** 'o|c|-' (oscuro, claro o sin dato) · reduce · Java · parámetros de desarrollo. */
function firmaSistema(): string {
  const oscuro = media('(prefers-color-scheme: dark)');
  const claro = media('(prefers-color-scheme: light)');
  const esquema = oscuro ? 'o' : claro ? 'c' : '-';
  const java = typeof document !== 'undefined' && document.documentElement.hasAttribute('data-system-reduced-motion');
  return [esquema, media('(prefers-reduced-motion: reduce)') ? '1' : '0', java ? '1' : '0', parametroDesarrollo('tema') ?? '', parametroDesarrollo('densidad') ?? ''].join('|');
}

const DENSIDADES: readonly Densidad[] = ['comoda', 'compacta', 'tactil'];
const PREFERENCIAS: readonly PreferenciaTema[] = ['sistema', 'claro', 'oscuro'];

/** Todo lo que entra a la tabla de §8.4, leído del hub, del sistema y (solo en dev:demo) de ?tema= / ?densidad=. */
export function useEntradaAtributos(): EntradaAtributos {
  const plataforma = usePlataforma();
  const preferencias = useConsulta('preferencias', {});
  const ajustes = useConsulta('ajustes_pc', {}, { activa: plataforma !== 'android' });
  const firma = useSyncExternalStore(suscribirSistema, firmaSistema, () => '-|0|0||');
  const [esquema, reduce, java, temaDev, densidadDev] = firma.split('|');

  let preferencia: PreferenciaTema | null = null;
  const temaPedido = PREFERENCIAS.find((t) => t === temaDev);
  if (temaPedido) preferencia = temaPedido;
  else if (preferencias.datos) preferencia = preferencias.datos.tema ?? 'sistema';
  else if (preferencias.error) preferencia = 'sistema';

  const densidadPedida = DENSIDADES.find((d) => d === densidadDev);
  const densidad: Densidad = plataforma === 'android' ? 'tactil' : (densidadPedida ?? ajustes.datos?.densidad ?? 'comoda');

  return {
    preferencia,
    sistemaOscuro: esquema === 'o' ? true : esquema === 'c' ? false : null,
    densidad,
    plataforma,
    reducir: preferencias.datos?.reducir_animaciones ?? 'sistema',
    sistemaReduce: reduce === '1',
    javaReduce: java === '1',
    temaGuardado: almacen.leer(CLAVE_TEMA),
  };
}

/** Tema aplicado, preferencia guardada en el hub, densidad y si hay que reducir el movimiento. */
export function useTema(): EstadoTema {
  const e = useEntradaAtributos();
  const a = calcularAtributos(e);
  return {
    tema: temaVisible(a, e.sistemaOscuro),
    preferencia: e.preferencia ?? 'sistema',
    densidad: e.plataforma === 'android' ? 'tactil' : e.densidad,
    reducirMovimiento: a['data-reduced-motion'],
  };
}
