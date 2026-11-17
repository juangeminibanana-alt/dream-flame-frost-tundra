/// <reference types="vitest/config" />
/**
 * Configuración de Vite 8 / vitest 5 de la interfaz de Corte (BUILD_SPEC §8.1, ui-andamio).
 * - respaldoDobles: `@/<módulo>` → ui/src/<módulo>/index.ts si existe; si no, el doble de ui/src/_dobles/<módulo>/
 *   (§8.1.1). En `vite build` un módulo que falta es un error: nunca se compila con dobles.
 * - imagenesDemo: en `--mode demo` sirve /img/{p|a}/<id>?v&t desde ui/fixtures/img (§8.1.2), sin caché; rev. 4: también
 *   /img/m/<id> (parecidos) y /img/g/<id>-<n> (galería de vitrina sintética: SVG con la foto del producto encuadrada);
 *   rev. 5: /img/v/<content_id> (portada sintética 9:16 del video, SVG).
 * - infoDesarrollo: GET /__corte/modo (solo `vite dev`) para que scripts/capturas.mjs sepa si puede reutilizar
 *   un servidor ya levantado.
 *
 * Cachés y respaldo (ronda de corrección 1): la resolución de `@/<m>` depende de si existe src/<m>/index.ts, y eso
 * NO forma parte de ninguna clave de caché de Vite/vitest. Por eso:
 * - `test.fsModuleCache: false` (vitest 5 la enciende por omisión y guardaba en node_modules/.vitest-cache cada
 *   módulo con el import ya resuelto al doble, aunque después llegara el real);
 * - si alguien la vuelve a encender (`--fsModuleCache`), el plugin mete en la clave la lista de módulos reales;
 * - en `vite dev`, cuando aparece o desaparece un src/<m>/index.ts, se invalida todo el grafo y se recarga.
 * vitest corre dos proyectos: «modulos» (todo src/**, menos src/pruebas) con el respaldo normal, y «andamio»
 * (src/pruebas, las pruebas de los dobles) donde `@/<m>` es SIEMPRE el doble, para que esas pruebas no dependan de
 * qué módulos reales existan en cada oleada.
 */
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const r = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export const MODULOS = ['plataforma', 'datos', 'app', 'raiz', 'componentes', 'dominio', 'bloques'] as const;
export type ModuloUi = (typeof MODULOS)[number];
const PATRON_MODULO = /^@\/(plataforma|datos|app|raiz|componentes|dominio|bloques)$/;

/** Ruta comparable (barras normales; sin distinguir mayúsculas en Windows). */
function rutaComparable(p: string): string {
  const b = p.replace(/\\/g, '/');
  return process.platform === 'win32' ? b.toLowerCase() : b;
}

/** Módulos que hoy tienen su real en <dirSrc>/<m>/index.ts, en el orden de MODULOS. */
export function modulosReales(dirSrc: string = r('./src')): ModuloUi[] {
  return MODULOS.filter((m) => existsSync(join(dirSrc, m, 'index.ts')));
}

export interface OpcionesRespaldo {
  /**
   * Solo para vitest (proyecto «andamio»): `@/<m>` siempre resuelve al doble, exista o no el real. Así las pruebas
   * de los dobles prueban los dobles juntos y no una mezcla de dobles y módulos reales. Se ignora en `vite build`.
   */
  soloDobles?: boolean;
}

/** version.json de la raíz (lo crea hub-andamio en la oleada 0). null si falta o no es válido. */
export function leerVersion(ruta: string = r('../version.json')): string | null {
  try {
    const datos: unknown = JSON.parse(readFileSync(ruta, 'utf8'));
    if (datos !== null && typeof datos === 'object' && 'version' in datos && typeof datos.version === 'string') {
      return datos.version;
    }
  } catch {
    return null;
  }
  return null;
}

/** Mensaje exacto con el que falla `vite build` si falta un módulo real (§8.1.1). */
export function mensajeFaltaModulo(modulo: string): string {
  return `Falta ui/src/${modulo}/index.ts: no se compila con dobles`;
}

/**
 * §8.1.1: real si existe <dirSrc>/<m>/index.ts; si no, el doble de <dirSrc>/_dobles/<m>/index.ts.
 * En `vite build` (esBuild = true) la falta es un error. `dirSrc` existe para las pruebas (por omisión, ui/src).
 */
export function respaldoDobles(esBuild: boolean, dirSrc: string = r('./src'), opciones: OpcionesRespaldo = {}): Plugin {
  const soloDobles = opciones.soloDobles === true && !esBuild;
  const indices = new Set(MODULOS.map((m) => rutaComparable(join(dirSrc, m, 'index.ts'))));
  return {
    name: 'corte-respaldo-dobles',
    enforce: 'pre',
    resolveId(id) {
      const coincidencia = PATRON_MODULO.exec(id);
      const modulo = coincidencia?.[1];
      if (!modulo) return null;
      if (!soloDobles) {
        const real = join(dirSrc, modulo, 'index.ts');
        if (existsSync(real)) return real;
      }
      if (esBuild) this.error(mensajeFaltaModulo(modulo));
      return join(dirSrc, '_dobles', modulo, 'index.ts');
    },
    // vite dev (y vitest en modo watch): las resoluciones ya transformadas siguen apuntando al doble aunque aparezca
    // el real (o al real aunque lo borren). Al crear o borrar un src/<m>/index.ts se invalida todo y se recarga.
    configureServer(server) {
      if (soloDobles) return;
      const alCambiar = (archivo: string): void => {
        if (!indices.has(rutaComparable(archivo))) return;
        for (const entorno of Object.values(server.environments)) entorno.moduleGraph.invalidateAll();
        server.ws.send({ type: 'full-reload', path: '*' });
      };
      server.watcher.on('add', alCambiar);
      server.watcher.on('unlink', alCambiar);
    },
    // vitest con fsModuleCache encendida (aquí va apagada, pero se puede encender con --fsModuleCache): la caché en
    // disco no sabe qué módulos reales existen, así que esa lista entra en la clave de cada archivo.
    configureVitest(contexto) {
      contexto.defineCacheKeyGenerator(() => `corte-respaldo:${soloDobles ? 'solo-dobles' : modulosReales(dirSrc).join(',') || 'sin-reales'}`);
    },
  };
}

// ---------------------------------------------------------------------------------------------- imágenes de demo

const TIPOS_MIME: Readonly<Record<string, string>> = {
  webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', avif: 'image/avif',
};

export interface RespuestaImagenDemo {
  estado: 200 | 404 | 405;
  /** Archivo a enviar (solo con 200). En la galería (g) es la foto de origen del SVG. */
  archivo: string | null;
  tipo: string | null;
  /** rev. 4 · Cuerpo ya armado (galería de demo: un SVG que encuadra la foto del producto). Si falta, se envía `archivo`. */
  cuerpo?: string;
}

/** Archivo de una variante dentro de la carpeta de una imagen (`xs|sm|md` → .webp; null → og.<ext>), o null. */
function archivoVariante(carpeta: string, t: string | null): string | null {
  let archivo: string | null = null;
  if (t === 'xs' || t === 'sm' || t === 'md') {
    archivo = join(carpeta, `${t}.webp`);
  } else if (t === null) {
    let nombres: string[] = [];
    try {
      nombres = readdirSync(carpeta);
    } catch {
      return null;
    }
    const og = nombres.find((n) => /^og\.(webp|jpe?g|png|gif|avif)$/i.test(n));
    archivo = og ? join(carpeta, og) : null;
  }
  if (!archivo) return null;
  try {
    return statSync(archivo).isFile() ? archivo : null;
  } catch {
    return null;
  }
}

/**
 * rev. 4 · Encuadres de la galería sintética del demo (los fixtures solo tienen UNA foto por producto): la foto n de
 * `/img/g/<id>-<n>` es la foto del producto completa, acercada a una zona o reflejada, como las tomas de detalle de una
 * vitrina. [x, y, lado] sobre un cuadro de 720 y si va reflejada.
 */
const ENCUADRES_GALERIA: ReadonlyArray<readonly [number, number, number, boolean]> = [
  [0, 0, 720, false], [135, 40, 450, false], [160, 170, 400, false], [0, 0, 720, true], [40, 220, 480, false],
  [300, 200, 330, false], [85, 60, 550, true], [150, 280, 420, false], [20, 20, 510, false], [180, 120, 360, true],
  [72, 72, 576, false], [210, 30, 300, false],
];

/** SVG de 720×720 con la foto (data URI) encuadrada según la foto n de la galería. */
export function svgGaleriaDemo(foto: Buffer, mime: string, n: number): string {
  const [x, y, lado, reflejada] = ENCUADRES_GALERIA[n % ENCUADRES_GALERIA.length] ?? [0, 0, 720, false];
  const giro = reflejada ? ' transform="translate(720 0) scale(-1 1)"' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="${x} ${y} ${lado} ${lado}">`
    + '<rect width="720" height="720" fill="#eeeeec"/>'
    + `<g${giro}><image href="data:${mime};base64,${foto.toString('base64')}" width="720" height="720" preserveAspectRatio="xMidYMid slice"/></g></svg>`;
}

/**
 * rev. 5 · Portada «real» de un video en la demo (/img/v/<content_id>): los fixtures no traen portadas de TikTok, así que
 * se dibuja una de 720×1280 con la foto del producto que más vendió en ese video (fondo desenfocado + foto al centro),
 * como la portada de un video vertical. Sin texto ni franjas: MiniaturaVideo ya pone sus cifras abajo. Sin foto:
 * degradado del tono del id.
 */
export function svgPortadaDemo(foto: Buffer | null, mime: string, id: string): string {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const tono = h % 360;
  const franjas = '';
  const cabeza = '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">';
  if (!foto) {
    return `${cabeza}<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${tono} 38% 34%)"/>`
      + `<stop offset="1" stop-color="hsl(${(tono + 40) % 360} 42% 16%)"/></linearGradient></defs>`
      + '<rect width="720" height="1280" fill="url(#g)"/>'
      + `<circle cx="560" cy="300" r="220" fill="hsl(${(tono + 20) % 360} 50% 60%)" fill-opacity=".18"/>`
      + `<circle cx="140" cy="760" r="160" fill="hsl(${(tono + 60) % 360} 50% 70%)" fill-opacity=".12"/>${franjas}</svg>`;
  }
  const datos = `data:${mime};base64,${foto.toString('base64')}`;
  // Tres encuadres (según el id) para que portadas del mismo producto no salgan idénticas.
  const encuadre = [
    'translate(60 268) scale(0.8333)',   // foto al centro
    'translate(110 150) scale(0.6944)',  // foto chica, arriba
    'translate(20 360) scale(0.9444)',   // foto grande, abajo
  ][h % 3] ?? 'translate(60 268) scale(0.8333)';
  return `${cabeza}<defs><image id="f" href="${datos}" width="720" height="720" preserveAspectRatio="xMidYMid slice"/>`
    + '<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="36"/></filter>'
    + '<clipPath id="r"><rect width="720" height="720" rx="34"/></clipPath></defs>'
    + `<rect width="720" height="1280" fill="hsl(${tono} 18% 22%)"/>`
    + '<use href="#f" transform="translate(-280 0) scale(1.7778)" filter="url(#b)"/>'
    + `<rect width="720" height="1280" fill="hsl(${tono} 30% 8%)" fill-opacity=".38"/>`
    + `<use href="#f" transform="${encuadre}" clip-path="url(#r)"/>${franjas}</svg>`;
}

const portadasDemo = new Map<string, ReadonlyMap<string, string | null>>();

/** content_id → product_id de su foto (miniatura '/img/p/<id>?v=…') según <dirDatos>/videos.json (la lista de «Todo»). */
function mapaPortadas(dirDatos: string): ReadonlyMap<string, string | null> {
  const previo = portadasDemo.get(dirDatos);
  if (previo) return previo;
  const mapa = new Map<string, string | null>();
  try {
    const v: unknown = JSON.parse(readFileSync(join(dirDatos, 'videos.json'), 'utf8'));
    const items = v !== null && typeof v === 'object' && 'items' in v && Array.isArray(v.items) ? (v.items as unknown[]) : [];
    for (const x of items) {
      if (x === null || typeof x !== 'object') continue;
      const o = x as Record<string, unknown>;
      if (typeof o['content_id'] !== 'string') continue;
      const m = typeof o['miniatura'] === 'string' ? /\/img\/p\/(\d{1,25})/.exec(o['miniatura']) : null;
      mapa.set(o['content_id'], m?.[1] ?? null);
    }
  } catch {
    /* sin fixtures de datos: ninguna portada */
  }
  portadasDemo.set(dirDatos, mapa);
  return mapa;
}

/** Parecido «del marketplace» del demo (id sintético '9…' = otro vendedor del mismo artículo): foto del fixture '1…'. */
function carpetaParecido(dirImg: string, id: string): string {
  const propia = join(dirImg, 'p', id);
  if (existsSync(propia) || !/^9\d{18}$/.test(id)) return propia;
  return join(dirImg, 'p', `1${id.slice(1)}`);
}

/**
 * Resuelve una petición de imagen del modo demo contra ui/fixtures/img (§8.1.2):
 * `/img/{p|a}/<id>?v=<ver>&t=xs|sm|md` → `<dirImg>/<p|a>/<id>/{xs,sm,md}.webp`; sin `t` → `og.<ext>`.
 * rev. 4: `/img/m/<id>` (parecidos) sale de la carpeta `p` del mismo producto (o del '1…' de un id sintético '9…') y
 * `/img/g/<id>-<n>` (galería, n 0–11) es un SVG que encuadra la foto del producto (sm para xs/sm, md para md/original).
 * rev. 5: `/img/v/<content_id>` (portada de la Display API) es un SVG 9:16 con la foto del producto de ese video
 * (svgPortadaDemo); solo para los content_id de `<dirDatos>/videos.json` (los demás, 404 como el hub sin portada).
 * `urlImg` es la ruta completa (con o sin el prefijo /img). Cualquier otra cosa → 404.
 */
export function resolverImagenDemo(dirImg: string, urlImg: string, metodo: string = 'GET', dirDatos: string = join(dirImg, '..', 'datos')): RespuestaImagenDemo {
  const no: RespuestaImagenDemo = { estado: 404, archivo: null, tipo: null };
  if (metodo !== 'GET' && metodo !== 'HEAD') return { estado: 405, archivo: null, tipo: null };
  const url = new URL(urlImg.startsWith('/img/') ? urlImg : `/img${urlImg.startsWith('/') ? '' : '/'}${urlImg}`, 'http://demo.invalid');
  const partes = /^\/img\/(p|a|g|m|v)\/([A-Za-z0-9_-]{1,64})$/.exec(url.pathname);
  const tipo = partes?.[1];
  const id = partes?.[2];
  if (!tipo || !id) return no;
  const t = url.searchParams.get('t');
  if (t !== null && t !== 'xs' && t !== 'sm' && t !== 'md') return no;
  if (tipo === 'v') {
    if (!/^\d{1,25}$/.test(id)) return no;
    const mapa = mapaPortadas(dirDatos);
    if (!mapa.has(id)) return no;
    const pid = mapa.get(id) ?? null;
    const carpeta = pid ? join(dirImg, 'p', pid) : null;
    const origen = carpeta ? archivoVariante(carpeta, 'md') ?? archivoVariante(carpeta, 'sm') ?? archivoVariante(carpeta, null) : null;
    let foto: Buffer | null = null;
    let mime = 'image/webp';
    if (origen) {
      try {
        foto = readFileSync(origen);
        mime = TIPOS_MIME[origen.slice(origen.lastIndexOf('.') + 1).toLowerCase()] ?? 'image/webp';
      } catch {
        foto = null;
      }
    }
    return { estado: 200, archivo: origen ?? join(dirDatos, 'videos.json'), tipo: 'image/svg+xml', cuerpo: svgPortadaDemo(foto, mime, id) };
  }
  if (tipo === 'g') {
    const g = /^(\d{1,25})-(\d{1,2})$/.exec(id);
    const n = Number(g?.[2]);
    if (!g?.[1] || !(n >= 0 && n <= 11)) return no;
    const carpeta = join(dirImg, 'p', g[1]);
    const origen = archivoVariante(carpeta, t === 'md' || t === null ? 'md' : 'sm') ?? archivoVariante(carpeta, null);
    if (!origen) return no;
    const ext = origen.slice(origen.lastIndexOf('.') + 1).toLowerCase();
    let foto: Buffer;
    try {
      foto = readFileSync(origen);
    } catch {
      return no;
    }
    return { estado: 200, archivo: origen, tipo: 'image/svg+xml', cuerpo: svgGaleriaDemo(foto, TIPOS_MIME[ext] ?? 'image/webp', n) };
  }
  const carpeta = tipo === 'm' ? carpetaParecido(dirImg, id) : join(dirImg, tipo, id);
  const archivo = archivoVariante(carpeta, t);
  if (!archivo) return no;
  const ext = archivo.slice(archivo.lastIndexOf('.') + 1).toLowerCase();
  return { estado: 200, archivo, tipo: TIPOS_MIME[ext] ?? 'application/octet-stream' };
}

/** §8.1.2: en modo demo sirve /img/* desde ui/fixtures/img (si no hay archivo: 404 no-store). rev. 5: las portadas
 *  /img/v salen de `dirDatos`/videos.json + la foto del producto. */
export function imagenesDemo(dirImg: string = r('./fixtures/img'), dirDatos: string = join(dirImg, '..', 'datos')): Plugin {
  return {
    name: 'corte-img-demo',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, siguiente: () => void) => {
        const url = req.url ?? '';
        if (!url.startsWith('/img/')) {
          siguiente();
          return;
        }
        const r0 = resolverImagenDemo(dirImg, url, req.method ?? 'GET', dirDatos);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (r0.estado !== 200 || !r0.archivo) {
          res.statusCode = r0.estado;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(r0.estado === 405 ? 'Método no permitido' : 'No encontrada');
          return;
        }
        const cuerpo = r0.cuerpo !== undefined ? Buffer.from(r0.cuerpo, 'utf8') : readFileSync(r0.archivo);
        res.statusCode = 200;
        res.setHeader('Content-Type', r0.tipo ?? 'application/octet-stream');
        res.setHeader('Content-Length', String(cuerpo.length));
        res.end(req.method === 'HEAD' ? undefined : cuerpo);
      });
    },
  };
}

/** GET /__corte/modo → {"app":"corte","modo":"demo"|…} (solo `vite dev`; lo usa scripts/capturas.mjs). */
export function infoDesarrollo(modo: string, version: string): Plugin {
  return {
    name: 'corte-info-desarrollo',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__corte/modo', (_req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ app: 'corte', modo, version }));
      });
    },
  };
}

/**
 * Opciones de vitest comunes a los dos proyectos (BUILD_SPEC §8.1: happy-dom + src/pruebas/setup.ts).
 * fsModuleCache va aquí también: es opción POR PROYECTO y un proyecto con `extends: false` no hereda la de la raíz.
 */
const PRUEBAS_COMUNES = { environment: 'happy-dom', setupFiles: ['src/pruebas/setup.ts'], fsModuleCache: false } as const;
/** Pruebas de ui-andamio (dobles, scripts, plugins): se corren con `@/<m>` fijo al doble. */
export const INCLUYE_ANDAMIO = ['src/pruebas/**/*.test.{ts,tsx}'];
/** Pruebas de los demás paquetes (src/<módulo>/**, src/pantallas/**…): respaldo normal, real si existe. */
export const INCLUYE_MODULOS = ['src/**/*.test.{ts,tsx}'];
export const EXCLUYE_MODULOS = ['src/pruebas/**', '**/node_modules/**', '**/dist/**'];

export default defineConfig(({ mode, command }) => {
  const esBuild = command === 'build';
  const leida = leerVersion();
  if (esBuild && leida === null) throw new Error('Falta version.json en la raíz del proyecto (o no tiene "version")');
  const version = leida ?? '0.0.0-dev';
  const define = { __VERSION_APP__: JSON.stringify(version) };
  const resolve = {
    alias: [
      { find: '@/contrato', replacement: r('../spec/contrato.ts') },
      { find: /^@\/pantallas\/(.+)$/, replacement: r('./src/pantallas') + '/$1/index.ts' },
    ],
  };
  // Cada proyecto de vitest arma sus propios plugins (extends: false): así cada uno tiene su servidor de Vite y su
  // propia resolución de `@/<m>`, y ninguno hereda el respaldoDobles del otro.
  const proyecto = (nombre: 'andamio' | 'modulos', soloDobles: boolean, include: string[], exclude?: string[]) => ({
    extends: false,
    plugins: [respaldoDobles(false, r('./src'), { soloDobles }), react()] as PluginOption[],
    define,
    resolve,
    test: { ...PRUEBAS_COMUNES, setupFiles: [...PRUEBAS_COMUNES.setupFiles], name: nombre, include, ...(exclude ? { exclude } : {}) },
  });
  return {
    base: '/',
    plugins: [
      respaldoDobles(esBuild),
      react(),
      ...(mode === 'demo' ? [imagenesDemo()] : []),
      infoDesarrollo(mode, version),
    ],
    define,
    resolve,
    server: {
      port: 5173,
      strictPort: true,
      fs: { allow: ['.', '../spec', '../version.json'] },
      // Fuera de demo, /api, /img y /boot van al hub levantado con --dev (C31).
      ...(mode === 'demo'
        ? {}
        : { proxy: Object.fromEntries(['/api', '/img', '/boot'].map((p) => [p, { target: 'http://127.0.0.1:39229', changeOrigin: true }])) }),
    },
    build: {
      target: ['chrome111', 'edge111'],
      manifest: true,
      modulePreload: { polyfill: false },
      sourcemap: false,
      assetsInlineLimit: 0,
    },
    test: {
      // Sin caché persistente de módulos transformados (ver el encabezado): la resolución a dobles no entra en su clave.
      fsModuleCache: false,
      projects: [
        proyecto('andamio', true, INCLUYE_ANDAMIO),
        proyecto('modulos', false, INCLUYE_MODULOS, EXCLUYE_MODULOS),
      ],
    },
  };
});
