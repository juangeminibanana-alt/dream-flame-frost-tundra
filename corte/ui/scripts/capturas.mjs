#!/usr/bin/env node
/**
 * Corte · capturas para la revisión visual (BUILD_SPEC §8.7, ui-andamio).
 *
 *   npm run capturas -- <paquete> <ruta…> [--tamanos 390x844,1280x800] [--tema oscuro|claro|ambos]
 *                       [--simular android|primera_vez|sincronizando|sin_fotos|reautorizar] [--densidad comoda|compacta|tactil]
 *                       [--espera 6000]
 *
 * Reutiliza `npm run dev:demo` si ya escucha en http://localhost:5173 (lo reconoce por GET /__corte/modo); si no,
 * levanta uno propio en un puerto libre y lo apaga al terminar. Fotografía con Edge sin ventana (msedge --headless=new).
 * El viewport se fija con DevTools (Emulation.setDeviceMetricsOverride) porque `--window-size` solo no baja de ~492 px
 * de ancho en Edge sin ventana: con 390×844 el diseño salía a 492 px y la imagen lo recortaba. Si DevTools no está
 * disponible, cae a `msedge --window-size=W,H --virtual-time-budget=… --screenshot=…` y lo avisa.
 * Deja los PNG en ui/capturas/<paquete>/<ruta>_<W>x<H>_<tema>[_<simular>][_<densidad>].png. Por omisión: 390×844 y
 * 1280×800, en oscuro y claro (?tema=claro). El tema también se emula en el navegador (prefers-color-scheme), por si
 * la interfaz aún no lee ?tema. `--espera` = tope en ms para que la red quede en reposo (6000 por omisión).
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const UI = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUERTO_DEMO = 5173;
const RUTAS_EDGE = [
  process.env.CORTE_EDGE,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const ESCENARIOS = ['android', 'primera_vez', 'sincronizando', 'sin_fotos', 'reautorizar'];
const DENSIDADES = ['comoda', 'compacta', 'tactil'];

export function analizarArgumentos(argv) {
  const op = { paquete: null, rutas: [], tamanos: [[390, 844], [1280, 800]], temas: ['oscuro', 'claro'], simular: null, densidad: null, espera: 6000 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const valor = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Falta el valor de ${a}`);
      return v;
    };
    if (a === '--tamanos') {
      op.tamanos = valor().split(',').map((t) => {
        const m = /^(\d{2,5})x(\d{2,5})$/.exec(t.trim());
        if (!m) throw new Error(`Tamaño inválido: ${t} (usa 390x844)`);
        return [Number(m[1]), Number(m[2])];
      });
    } else if (a === '--tema') {
      const t = valor();
      if (t === 'ambos') op.temas = ['oscuro', 'claro'];
      else if (t === 'oscuro' || t === 'claro') op.temas = [t];
      else throw new Error(`Tema inválido: ${t} (oscuro, claro o ambos)`);
    } else if (a === '--simular') {
      const s = valor();
      if (!ESCENARIOS.includes(s)) throw new Error(`Escenario inválido: ${s} (${ESCENARIOS.join(', ')})`);
      op.simular = s;
    } else if (a === '--densidad') {
      const d = valor();
      if (!DENSIDADES.includes(d)) throw new Error(`Densidad inválida: ${d} (${DENSIDADES.join(', ')})`);
      op.densidad = d;
    } else if (a === '--espera') {
      op.espera = Math.max(500, Number(valor()) || 6000);
    } else if (a.startsWith('--')) {
      throw new Error(`Opción desconocida: ${a}`);
    } else if (op.paquete === null) {
      op.paquete = a;
    } else {
      op.rutas.push(a);
    }
  }
  if (!op.paquete || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(op.paquete)) throw new Error('Primer argumento: el id del paquete (p. ej. ui-andamio)');
  if (op.rutas.length === 0) throw new Error('Indica al menos una ruta (p. ej. /#/ o #/inicio)');
  return op;
}

/** '/#/muestras?x=1' · '#/muestras' · '/muestras' → '#/muestras?x=1'. */
export function hashDe(ruta) {
  const i = ruta.indexOf('#');
  if (i >= 0) {
    const h = ruta.slice(i);
    return h === '#' ? '#/' : h;
  }
  return `#${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
}

export function nombreArchivo(hash, ancho, alto, tema, simular, densidad) {
  const camino = hash.replace(/^#/, '').split('?')[0];
  let slug = camino.replace(/^\/+|\/+$/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) slug = 'raiz';
  return [slug, `${ancho}x${alto}`, tema, simular, densidad].filter(Boolean).join('_') + '.png';
}

export function urlCaptura(base, hash, tema, simular, densidad) {
  const q = new URLSearchParams();
  if (simular) q.set('simular', simular);
  q.set('tema', tema);
  if (densidad) q.set('densidad', densidad);
  return `${base}/?${q.toString()}${hash}`;
}

/** Ancho y alto de un PNG (cabecera IHDR). */
export function tamanoPng(ruta) {
  const b = readFileSync(ruta);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

async function modoDe(base) {
  try {
    const r = await fetch(`${base}/__corte/modo`, { signal: AbortSignal.timeout(1500) });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.app === 'corte' ? j.modo : null;
  } catch {
    return null;
  }
}

function puertoLibre() {
  return new Promise((ok, mal) => {
    const s = createServer();
    s.unref();
    s.on('error', mal);
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => ok(p));
    });
  });
}

function matarArbol(pid) {
  if (!pid) return;
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
  else {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      /* ya terminó */
    }
  }
}

async function levantarDemo() {
  const puerto = await puertoLibre();
  const vite = join(UI, 'node_modules', 'vite', 'bin', 'vite.js');
  if (!existsSync(vite)) throw new Error('Falta node_modules/vite (corre npm ci en ui/)');
  const hijo = spawn(process.execPath, [vite, '--mode', 'demo', '--port', String(puerto), '--strictPort'], { cwd: UI, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  let salida = '';
  hijo.stdout.on('data', (d) => (salida += d));
  hijo.stderr.on('data', (d) => (salida += d));
  const base = `http://localhost:${puerto}`;
  const limite = Date.now() + 60_000;
  while (Date.now() < limite) {
    if (hijo.exitCode !== null) throw new Error(`vite terminó antes de tiempo:\n${salida}`);
    if ((await modoDe(base)) === 'demo') {
      await calentar(base);
      return { base, hijo };
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  matarArbol(hijo.pid);
  throw new Error(`vite no respondió en 60 s:\n${salida}`);
}

/** Pide el HTML y la entrada para que Vite optimice dependencias ANTES de que llegue Edge (con la caché fría, Vite
 *  recarga la página al terminar de optimizar y la primera carga puede no terminar nunca). */
async function calentar(base) {
  for (const ruta of ['/', '/src/main.tsx', '/@vite/client']) {
    try {
      await fetch(`${base}${ruta}`, { signal: AbortSignal.timeout(30_000) }).then((r) => r.arrayBuffer());
    } catch {
      /* solo es calentamiento */
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
}

function borrarPerfil(perfil) {
  for (let i = 0; i < 10; i++) {
    try {
      rmSync(perfil, { recursive: true, force: true });
      return;
    } catch {
      // Edge aún suelta archivos: espera breve (síncrona) y reintenta.
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
    }
  }
  console.log(`capturas: no se pudo borrar el perfil temporal ${perfil}`);
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Cliente mínimo del protocolo DevTools sobre el WebSocket nativo de Node (≥ 22). */
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.siguiente = 0;
    this.pendientes = new Map();
    this.oyentes = new Set();
    ws.addEventListener('message', (ev) => {
      const m = JSON.parse(typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8'));
      if (m.id !== undefined && this.pendientes.has(m.id)) {
        const p = this.pendientes.get(m.id);
        this.pendientes.delete(m.id);
        if (m.error) p.mal(new Error(`${m.error.message} (${m.error.code})`));
        else p.ok(m.result);
      } else if (m.method) {
        for (const o of [...this.oyentes]) o(m);
      }
    });
  }

  static conectar(url) {
    return new Promise((ok, mal) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => ok(new Cdp(ws)), { once: true });
      ws.addEventListener('error', () => mal(new Error(`No se pudo conectar a DevTools en ${url}`)), { once: true });
    });
  }

  enviar(metodo, params = {}) {
    const id = ++this.siguiente;
    return new Promise((ok, mal) => {
      this.pendientes.set(id, { ok, mal });
      this.ws.send(JSON.stringify({ id, method: metodo, params }));
    });
  }

  esperar(metodo, ms) {
    return new Promise((ok, mal) => {
      const f = (m) => {
        if (m.method !== metodo) return;
        clearTimeout(t);
        this.oyentes.delete(f);
        ok(m.params);
      };
      const t = setTimeout(() => {
        this.oyentes.delete(f);
        mal(new Error(`Edge no emitió ${metodo} en ${ms} ms`));
      }, ms);
      this.oyentes.add(f);
    });
  }

  cerrar() {
    try {
      this.ws.close();
    } catch {
      /* ya cerrado */
    }
  }
}

/** Abre Edge sin ventana con DevTools en un puerto libre; devuelve { hijo, perfil, pagina } (WebSocket de la pestaña). */
async function abrirEdgeDevTools(edge) {
  const perfil = mkdtempSync(join(tmpdir(), 'corte-capturas-'));
  const args = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-sync', '--mute-audio', '--lang=es-MX', `--user-data-dir=${perfil}`,
    '--remote-debugging-port=0', '--window-size=1440,900', 'about:blank',
  ];
  const hijo = spawn(edge, args, { stdio: 'ignore', windowsHide: true });
  const archivoPuerto = join(perfil, 'DevToolsActivePort');
  const limite = Date.now() + 20_000;
  let puerto = null;
  while (Date.now() < limite && puerto === null) {
    if (existsSync(archivoPuerto)) {
      const linea = readFileSync(archivoPuerto, 'utf8').split(/\r?\n/)[0];
      if (linea && /^\d+$/.test(linea.trim())) puerto = Number(linea.trim());
    }
    if (puerto === null) await dormir(150);
  }
  if (puerto === null) {
    matarArbol(hijo.pid);
    borrarPerfil(perfil);
    throw new Error('Edge no abrió DevTools en 20 s');
  }
  let pagina = null;
  for (let i = 0; i < 40 && !pagina; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${puerto}/json/list`)).json();
      pagina = lista.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)?.webSocketDebuggerUrl ?? null;
    } catch {
      pagina = null;
    }
    if (!pagina) await dormir(150);
  }
  if (!pagina) {
    matarArbol(hijo.pid);
    borrarPerfil(perfil);
    throw new Error('Edge no expuso ninguna pestaña por DevTools');
  }
  return { hijo, perfil, pagina };
}

/**
 * Captura con viewport EXACTO: Emulation.setDeviceMetricsOverride (W×H, dpr 1, móvil si W < 600) y
 * prefers-color-scheme emulado. (--window-size solo no sirve: Edge sin ventana no baja de ~492 px de ancho.)
 * Espera la carga, la red en reposo 600 ms (máximo `espera`), las fuentes y las imágenes.
 */
async function capturarDevTools(cdp, url, ancho, alto, tema, archivo, espera) {
  await cdp.enviar('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: 1, mobile: ancho < 600, screenWidth: ancho, screenHeight: alto });
  await cdp.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: tema === 'claro' ? 'light' : 'dark' }] });
  const enVuelo = new Set();
  let ultimoCambio = Date.now();
  const red = (m) => {
    if (m.method === 'Network.requestWillBeSent') enVuelo.add(m.params.requestId);
    else if (m.method === 'Network.loadingFinished' || m.method === 'Network.loadingFailed') enVuelo.delete(m.params.requestId);
    else return;
    ultimoCambio = Date.now();
  };
  cdp.oyentes.add(red);
  try {
    // Primero a about:blank: navegar otra vez a la misma URL con '#' sería un cambio de fragmento sin evento load.
    const vacia = cdp.esperar('Page.loadEventFired', 15_000);
    await cdp.enviar('Page.navigate', { url: 'about:blank' });
    await vacia.catch(() => undefined);
    const carga = cdp.esperar('Page.loadEventFired', 45_000);
    await cdp.enviar('Page.navigate', { url });
    await carga;
    const limite = Date.now() + espera;
    while (Date.now() < limite && !(enVuelo.size === 0 && Date.now() - ultimoCambio >= 600)) await dormir(100);
    await cdp.enviar('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => {
        await document.fonts.ready;
        const pendientes = [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }));
        await Promise.race([Promise.all(pendientes), new Promise((r) => setTimeout(r, 4000))]);
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return true;
      })()`,
    });
    const { data } = await cdp.enviar('Page.captureScreenshot', { format: 'png', fromSurface: true });
    writeFileSync(archivo, Buffer.from(data, 'base64'));
  } finally {
    cdp.oyentes.delete(red);
  }
}

/** Respaldo sin DevTools: msedge --screenshot (ojo: por debajo de ~500 px el diseño sale más ancho que la imagen). */
function capturarConBandera(edge, url, ancho, alto, tema, archivo, espera) {
  const perfil = mkdtempSync(join(tmpdir(), 'corte-capturas-'));
  const args = [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-sync', '--mute-audio', '--lang=es-MX', `--user-data-dir=${perfil}`,
    `--window-size=${ancho},${alto}`, '--force-device-scale-factor=1', `--virtual-time-budget=${espera}`,
    `--blink-settings=preferredColorScheme=${tema === 'claro' ? 1 : 0}`, `--screenshot=${archivo}`, url,
  ];
  return new Promise((ok) => {
    const hijo = spawn(edge, args, { stdio: 'ignore', windowsHide: true });
    const reloj = setTimeout(() => matarArbol(hijo.pid), espera + 25_000);
    const terminar = () => {
      clearTimeout(reloj);
      matarArbol(hijo.pid);
      borrarPerfil(perfil);
      ok();
    };
    hijo.on('exit', terminar);
    hijo.on('error', terminar);
  });
}

export async function principal(argv = process.argv.slice(2)) {
  const op = analizarArgumentos(argv);
  const edge = RUTAS_EDGE.find((r) => existsSync(r));
  if (!edge) throw new Error('No se encontró Microsoft Edge (msedge.exe). Define CORTE_EDGE con su ruta.');
  const destino = join(UI, 'capturas', op.paquete);
  mkdirSync(destino, { recursive: true });

  let servidor = null;
  let base = `http://localhost:${PUERTO_DEMO}`;
  if ((await modoDe(base)) === 'demo') {
    console.log(`capturas: reutilizo dev:demo en ${base}`);
    await calentar(base);
  } else {
    servidor = await levantarDemo();
    base = servidor.base;
    console.log(`capturas: levanté dev:demo en ${base}`);
  }
  const hechas = [];
  let navegador = null;
  let cdp = null;
  try {
    try {
      navegador = await abrirEdgeDevTools(edge);
      cdp = await Cdp.conectar(navegador.pagina);
      await cdp.enviar('Page.enable');
      await cdp.enviar('Network.enable');
    } catch (e) {
      console.log(`capturas: sin DevTools (${e.message}); uso msedge --screenshot (anchos < 500 px salen aproximados)`);
      cdp?.cerrar();
      cdp = null;
    }
    for (const ruta of op.rutas) {
      const hash = hashDe(ruta);
      for (const tema of op.temas) {
        for (const [ancho, alto] of op.tamanos) {
          const archivo = join(destino, nombreArchivo(hash, ancho, alto, tema, op.simular, op.densidad));
          rmSync(archivo, { force: true });
          const url = urlCaptura(base, hash, tema, op.simular, op.densidad);
          if (cdp) {
            try {
              await capturarDevTools(cdp, url, ancho, alto, tema, archivo, op.espera);
            } catch (e) {
              // Primera carga con Vite en frío (optimiza dependencias y recarga): un reintento basta.
              console.log(`  (reintento: ${e.message})`);
              await capturarDevTools(cdp, url, ancho, alto, tema, archivo, op.espera);
            }
          } else {
            await capturarConBandera(edge, url, ancho, alto, tema, archivo, op.espera);
            if (!existsSync(archivo)) await capturarConBandera(edge, url, ancho, alto, tema, archivo, op.espera);
          }
          const medida = existsSync(archivo) ? tamanoPng(archivo) : null;
          if (!medida || statSync(archivo).size === 0) throw new Error(`Edge no dejó la captura ${archivo}`);
          hechas.push({ archivo, medida });
          console.log(`  ${relative(UI, archivo)}  ${medida[0]}×${medida[1]}  ← ${url}`);
        }
      }
    }
  } finally {
    cdp?.cerrar();
    if (navegador) {
      matarArbol(navegador.hijo.pid);
      await dormir(300);
      borrarPerfil(navegador.perfil);
    }
    if (servidor) matarArbol(servidor.hijo.pid);
  }
  console.log(`capturas: ${hechas.length} PNG en ${relative(UI, destino)}`);
  return hechas;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  principal().catch((e) => {
    console.error(`capturas: ${e.message}`);
    process.exitCode = 1;
  });
}
