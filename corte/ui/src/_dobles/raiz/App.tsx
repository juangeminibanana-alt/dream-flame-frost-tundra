/* __DOBLE_CORTE__ · doble de @/raiz: App mínima que pinta la ruta actual con import.meta.glob sobre
   ui/src/pantallas/<carpeta>/index.ts + lazy (y las galerías de desarrollo). Monta ProveedorToasts y
   ProveedorBloques para que las pantallas y galerías reales funcionen antes de que exista ui/src/raiz/. */
import { Suspense, lazy, useEffect, type ComponentType, type LazyExoticComponent, type ReactElement } from 'react';
import { EnlaceRuta, useRuta, useTema } from '@/app';
import { ProveedorToasts } from '@/componentes';
import { ProveedorBloques } from '@/bloques';
import { useConsulta, useSesion } from '@/datos';
import { doblesActivos } from '../comun/marca';
import { esModoDemo, simulaAndroid } from '../comun/entorno';
import { resolverHash, type DefRuta } from '../comun/rutas';
import css from './raiz.module.css';

/** Ruta relativa a este archivo (como las da import.meta.glob) → función que carga el módulo. */
export type CargadoresPantalla = Readonly<Record<string, () => Promise<unknown>>>;

const MODULOS: CargadoresPantalla = import.meta.glob(['../../pantallas/*/index.ts', '../../componentes/galeria/index.ts', '../../bloques/galeria/index.ts']);

function cargadorDe(cargadores: CargadoresPantalla, modulo: string): (() => Promise<unknown>) | undefined {
  if (modulo === 'galeria-componentes') return cargadores['../../componentes/galeria/index.ts'];
  if (modulo === 'galeria-bloques') return cargadores['../../bloques/galeria/index.ts'];
  return cargadores[`../../pantallas/${modulo}/index.ts`];
}

/** Una línea con datos reales de los fixtures (vía @/datos) para ver que los dobles ya leen ui/fixtures. */
function ResumenFixtures(): ReactElement | null {
  const tablero = useConsulta('dashboard', { periodo: '30d' });
  const m = tablero.datos?.muestras;
  if (tablero.error) return <p className={css.info}>Sin datos de demostración todavía ({tablero.error.mensaje})</p>;
  if (!m) return null;
  return (
    <p className={css.info} data-resumen-demo="si">
      Datos de demostración: {m.pendientes} muestras pendientes · {m.tiendas_por_avisar} tiendas por avisar
    </p>
  );
}

export function EnConstruccion(p: { titulo: string; ruta: string; detalle?: string }): ReactElement {
  return (
    <section className={css.aviso} aria-label={p.titulo} data-en-construccion="si">
      <h1>Pantalla en construcción</h1>
      <p>
        {p.titulo}: todavía no existe su módulo. {p.detalle ?? ''}
      </p>
      <span className={css.ruta}>#{p.ruta}</span>
      <ResumenFixtures />
    </section>
  );
}

/** Un lazy por pantalla y por juego de cargadores (las pruebas pasan los suyos). */
const perezosasPor = new WeakMap<CargadoresPantalla, Map<string, LazyExoticComponent<ComponentType>>>();

function pantallaPerezosa(cargadores: CargadoresPantalla, def: DefRuta): LazyExoticComponent<ComponentType> | null {
  const cargar = cargadorDe(cargadores, def.modulo);
  if (!cargar) return null;
  let perezosas = perezosasPor.get(cargadores);
  if (!perezosas) {
    perezosas = new Map();
    perezosasPor.set(cargadores, perezosas);
  }
  const clave = `${def.modulo}#${def.exporta}`;
  let c = perezosas.get(clave);
  if (!c) {
    c = lazy(async () => {
      const m = await cargar();
      const exportado = m !== null && typeof m === 'object' && def.exporta in m ? (m as Record<string, unknown>)[def.exporta] : undefined;
      if (typeof exportado === 'function') return { default: exportado as ComponentType };
      return { default: () => <EnConstruccion titulo={def.titulo} ruta={def.patron} detalle={`El módulo no exporta ${def.exporta}.`} /> };
    });
    perezosas.set(clave, c);
  }
  return c;
}

const ENLACES: ReadonlyArray<[string, string]> = [
  ['/inicio', 'Inicio'],
  ['/muestras', 'Muestras'],
  ['/tiendas', 'Tiendas'],
  ['/ventas', 'Ventas'],
  ['/videos', 'Videos'],
  ['/productos', 'Productos'],
  ['/ajustes', 'Ajustes'],
  ['/bienvenida', 'Bienvenida'],
];
const ENLACES_DEV: ReadonlyArray<[string, string]> = [
  ['/dev/galeria', 'Galería de componentes'],
  ['/dev/bloques', 'Galería de bloques'],
];

const DENSIDAD = { comoda: 'comfortable', compacta: 'compact', tactil: 'touch' } as const;

/** Atributos de <html> (tabla de BUILD_SPEC §8.4) en su versión mínima para el doble. */
function useAtributosHtml(): void {
  const tema = useTema();
  const android = simulaAndroid();
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-platform', android ? 'android' : 'windows');
    html.setAttribute('data-density', android ? 'touch' : DENSIDAD[tema.densidad]);
    if (android) html.removeAttribute('data-glass');
    else html.setAttribute('data-glass', 'on');
    if (tema.preferencia !== 'sistema') html.setAttribute('data-theme', tema.tema === 'claro' ? 'light' : 'dark');
  }, [tema.densidad, tema.preferencia, tema.tema, android]);
}

function Contenido(p: { cargadores: CargadoresPantalla }): ReactElement {
  const r = useRuta();
  const def = resolverHash(`#${r.ruta}`).def;
  if (!def) {
    return (
      <section className={css.aviso} aria-label="Sección no encontrada">
        <h1>Esta sección no existe</h1>
        <span className={css.ruta}>#{r.ruta}</span>
        <EnlaceRuta a="/inicio">Ir a Inicio</EnlaceRuta>
      </section>
    );
  }
  const Perezosa = pantallaPerezosa(p.cargadores, def);
  if (!Perezosa) return <EnConstruccion titulo={def.titulo} ruta={r.ruta} />;
  return (
    <Suspense fallback={<p className={css.info}>Cargando {def.titulo}…</p>}>
      <Perezosa />
    </Suspense>
  );
}

function Marco(p: { cargadores: CargadoresPantalla }): ReactElement {
  const r = useRuta();
  const sesion = useSesion();
  const enlaces = import.meta.env.DEV ? [...ENLACES, ...ENLACES_DEV] : ENLACES;
  const demo = esModoDemo() || sesion.datos?.modo === 'demo';
  return (
    <div className={css.marco} data-app-doble="si">
      {demo ? <div className={css.franja}>Datos de demostración</div> : <div />}
      <header className={css.encabezado}>
        <span className={css.marca}>corte</span>
        <span className={css.info}>
          Interfaz de desarrollo · dobles activos: {doblesActivos().join(', ') || 'ninguno'}
          {sesion.datos?.cuenta ? ` · @${sesion.datos.cuenta.username}` : ''}
        </span>
        <nav aria-label="Secciones" className={css.nav}>
          {enlaces.map(([a, texto]) => (
            <EnlaceRuta key={a} a={a} {...(r.ruta === a ? { 'aria-label': `${texto} (actual)` } : {})}>
              {texto}
            </EnlaceRuta>
          ))}
        </nav>
      </header>
      <main className={css.contenido}>
        <Contenido cargadores={p.cargadores} />
      </main>
    </div>
  );
}

/**
 * La App doble con los cargadores de pantallas que se le pasen (rutas relativas a este archivo, como las da
 * import.meta.glob). Las pruebas la usan con cargadores propios para no depender de qué pantallas existan.
 */
export function AppConPantallas(p: { cargadores: CargadoresPantalla }): ReactElement {
  useAtributosHtml();
  return (
    <ProveedorToasts>
      <ProveedorBloques>
        <Marco cargadores={p.cargadores} />
      </ProveedorBloques>
    </ProveedorToasts>
  );
}

/** Raíz doble: proveedores + marco + pantalla de la ruta actual (las que existan en ui/src/pantallas/). */
export function App(): ReactElement {
  return <AppConPantallas cargadores={MODULOS} />;
}
