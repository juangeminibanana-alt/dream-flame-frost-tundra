/**
 * @/app · carga de pantallas de la tabla de BUILD_SPEC §8.6 SIN acoplar paquetes: las pantallas se descubren con
 * import.meta.glob('../pantallas/*\/index.ts') + React.lazy (nunca un import estático), tipadas con las interfaces de
 * spec/ui_firmas/pantallas.d.ts (tablaRutas.ts). Las galerías (#/dev/galeria, #/dev/bloques) solo existen con
 * import.meta.env.DEV: en `vite build` esa rama es código muerto y no llega al manifiesto (verificar_dist). En
 * desarrollo, una pantalla que falta muestra «Pantalla en construcción»; en el build la falta la detecta verificar_dist.
 */
import { Suspense, lazy, type ComponentType, type LazyExoticComponent, type ReactElement } from 'react';
import type { Ruta } from '@firmas/app';
import { EstadoVacio, Esqueleto, EsqueletoVista } from '@/componentes';
import { cx } from './clases';
import { navegar } from './navegacion';
import { resolverRuta, type DefRuta, type NombreModulo } from './tablaRutas';
import css from './rutas.module.css';

export { TABLA_RUTAS, partirHash, resolverRuta } from './tablaRutas';
export type { DefRuta, NombreModulo, RutaResuelta } from './tablaRutas';

/** Ruta relativa a este archivo (como la da import.meta.glob) → función que carga el módulo. */
export type Cargadores = Readonly<Record<string, () => Promise<unknown>>>;

const PANTALLAS: Cargadores = import.meta.glob('../pantallas/*/index.ts');
/** Solo en desarrollo: en `vite build` import.meta.env.DEV es `false` y este glob es código muerto. */
const GALERIAS: Cargadores = import.meta.env.DEV ? import.meta.glob(['../componentes/galeria/index.ts', '../bloques/galeria/index.ts']) : {};
export const CARGADORES: Cargadores = { ...PANTALLAS, ...GALERIAS };

export function archivoDeModulo(modulo: NombreModulo): string {
  if (modulo === 'galeria-componentes') return '../componentes/galeria/index.ts';
  if (modulo === 'galeria-bloques') return '../bloques/galeria/index.ts';
  return `../pantallas/${modulo}/index.ts`;
}

/** Un lazy por (juego de cargadores, módulo, exportación): las pruebas pasan sus propios cargadores. */
const perezosas = new WeakMap<Cargadores, Map<string, LazyExoticComponent<ComponentType>>>();

function componenteDe(m: unknown, exporta: string): ComponentType | null {
  if (m === null || typeof m !== 'object' || !(exporta in m)) return null;
  const valor: unknown = (m as Record<string, unknown>)[exporta];
  return typeof valor === 'function' ? (valor as ComponentType) : null;
}

export function pantallaPerezosa(def: DefRuta, cargadores: Cargadores = CARGADORES): LazyExoticComponent<ComponentType> | null {
  const cargar = cargadores[archivoDeModulo(def.modulo)];
  if (!cargar) return null;
  let mapa = perezosas.get(cargadores);
  if (!mapa) {
    mapa = new Map();
    perezosas.set(cargadores, mapa);
  }
  const clave = `${def.modulo}#${def.exporta}`;
  let c = mapa.get(clave);
  if (!c) {
    c = lazy(async () => {
      const componente = componenteDe(await cargar(), def.exporta);
      return { default: componente ?? (() => <EnConstruccion titulo={def.titulo} detalle={`Su módulo todavía no exporta ${def.exporta}.`} />) };
    });
    mapa.set(clave, c);
  }
  return c;
}

// ---------------------------------------------------------------------------------------------- vistas de respaldo

/** Desarrollo: la carpeta de la pantalla todavía no existe (o no exporta lo que pide pantallas.d.ts). */
export function EnConstruccion(p: { titulo: string; detalle?: string }): ReactElement {
  return (
    <section className={css.respaldo} aria-label={p.titulo} data-en-construccion="">
      <EstadoVacio icono="Clapperboard" titulo="Pantalla en construcción" texto={`${p.titulo}: ${p.detalle ?? 'esta sección todavía se está armando.'}`} />
    </section>
  );
}

function RutaDesconocida(p: { ruta: string }): ReactElement {
  return (
    <section className={css.respaldo} aria-label="Sección no encontrada" data-ruta-desconocida={p.ruta}>
      <EstadoVacio icono="CircleHelp" titulo="Esta sección no existe" texto="Revisa el enlace o vuelve a Inicio." accion={{ etiqueta: 'Ir a Inicio', alPulsar: () => navegar('/inicio') }} />
    </section>
  );
}

/** Esqueleto con la forma de una pantalla típica mientras llega el código de la pantalla (primera visita). */
export function EsqueletoPantalla(): ReactElement {
  return (
    <EsqueletoVista className={cx(css.esqueleto)} textoLento="Sigue cargando… revisa la conexión con tu PC">
      <div className={css.esqTitulo}>
        <Esqueleto forma="titulo" ancho="38%" />
        <Esqueleto forma="texto" ancho="24%" />
      </div>
      <Esqueleto forma="bloque" alto={220} />
      <div className={css.esqFila}>
        <Esqueleto forma="kpi" />
        <Esqueleto forma="kpi" />
        <Esqueleto forma="kpi" />
      </div>
      <Esqueleto forma="fila" lineas={4} />
    </EsqueletoVista>
  );
}

/** Pinta la pantalla de la ruta actual (perezosa) con su esqueleto de carga. */
export function VistaRuta(p: { ruta: Ruta; cargadores?: Cargadores }): ReactElement {
  const r = resolverRuta(p.ruta.ruta);
  if (!r.def) return <RutaDesconocida ruta={r.ruta} />;
  const Perezosa = pantallaPerezosa(r.def, p.cargadores ?? CARGADORES);
  if (!Perezosa) return <EnConstruccion titulo={r.def.titulo} />;
  return (
    <Suspense fallback={<EsqueletoPantalla />}>
      <Perezosa />
    </Suspense>
  );
}
