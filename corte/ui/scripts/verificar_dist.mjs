#!/usr/bin/env node
/**
 * Corte · verificación de ui/dist después de `vite build` (BUILD_SPEC §8.1.4, ui-andamio).
 *
 * Falla (exit 1) si dist/ contiene:
 *   - un archivo .map;
 *   - cualquier ruta o cadena «fixtures» (datos de desarrollo);
 *   - «creador_demo» o el marcador «__DOBLE_CORTE__» de los dobles de ejecución;
 *   - <script> en línea o <meta http-equiv="Content-Security-Policy"> en index.html (C9, C47b);
 *   - un patrón de secreto: "(app_secret|access_token|refresh_token)": "<8 o más caracteres>";
 *   - JS inicial > 250 KB gzip (entrada + sus imports estáticos según el manifiesto);
 *   - .woff2 emitidos > 125 KB en suma;
 *   - un manifiesto (dist/.vite/manifest.json) sin las 10 entradas src/pantallas/<p>/index.ts o con la galería de
 *     componentes o de bloques.
 * Al terminar borra dist/.vite/ (pase o no).
 *
 * Uso: node scripts/verificar_dist.mjs [--dist <carpeta>] [--conservar-vite]
 */
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const UI = join(dirname(fileURLToPath(import.meta.url)), '..');

export const KB = 1000;
export const LIMITE_JS_INICIAL_GZIP = 250 * KB;
export const LIMITE_WOFF2 = 125 * KB;
export const PANTALLAS = ['inicio', 'ventas', 'muestras', 'flujos', 'tiendas', 'videos', 'productos', 'ajustes', 'bienvenida', 'emparejar'];
export const PROHIBIDAS_EN_MANIFIESTO = ['src/componentes/galeria/index.ts', 'src/bloques/galeria/index.ts'];
const EXT_TEXTO = new Set(['.js', '.mjs', '.cjs', '.css', '.html', '.htm', '.json', '.txt', '.svg', '.webmanifest', '.xml', '.map', '.md']);
const PATRON_SECRETO = /"(app_secret|access_token|refresh_token)"\s*:\s*"[^"]{8,}"/;
const MARCADORES = ['creador_demo', '__DOBLE_CORTE__'];

function listar(dir) {
  const salida = [];
  const pila = [dir];
  while (pila.length) {
    const actual = pila.pop();
    for (const nombre of readdirSync(actual)) {
      const ruta = join(actual, nombre);
      const st = statSync(ruta);
      if (st.isDirectory()) pila.push(ruta);
      else salida.push({ ruta, rel: relative(dir, ruta).split(sep).join('/'), bytes: st.size });
    }
  }
  return salida.sort((a, b) => a.rel.localeCompare(b.rel));
}

function kb(bytes) {
  return `${(bytes / KB).toFixed(1)} KB`;
}

function revisarIndexHtml(texto, errores) {
  for (const m of texto.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const atributos = m[1] ?? '';
    const cuerpo = m[2] ?? '';
    if (!/\bsrc\s*=/i.test(atributos) || cuerpo.trim() !== '') errores.push('index.html tiene un <script> en línea (solo se permiten <script src="…">)');
  }
  if (/http-equiv\s*=\s*["']?\s*content-security-policy/i.test(texto)) {
    errores.push('index.html declara la CSP en <meta http-equiv="Content-Security-Policy"> (debe ir solo como cabecera HTTP, C9)');
  }
}

function jsInicial(manifiesto) {
  const entradas = Object.entries(manifiesto).filter(([, v]) => v && v.isEntry);
  const visitados = new Set();
  const archivos = new Set();
  const pila = entradas.map(([k]) => k);
  while (pila.length) {
    const clave = pila.pop();
    if (visitados.has(clave)) continue;
    visitados.add(clave);
    const e = manifiesto[clave];
    if (!e) continue;
    if (typeof e.file === 'string' && /\.(m?js)$/.test(e.file)) archivos.add(e.file);
    for (const imp of e.imports ?? []) pila.push(imp);
  }
  return { entradas: entradas.map(([k]) => k), archivos: [...archivos] };
}

/**
 * Revisa una carpeta dist. Devuelve { errores, resumen }. No escribe nada salvo borrar dist/.vite si se pide.
 */
export function verificarDist(dir, opciones = {}) {
  const borrarVite = opciones.borrarVite ?? true;
  const errores = [];
  const resumen = { archivos: 0, js_inicial_gzip: 0, woff2: 0, entradas: [] };
  try {
    if (!existsSync(dir) || !statSync(dir).isDirectory()) {
      errores.push(`No existe la carpeta ${dir} (corre antes vite build)`);
      return { errores, resumen };
    }
    const archivos = listar(dir);
    resumen.archivos = archivos.length;

    // 1-4 · rutas y contenido
    for (const a of archivos) {
      const ext = extname(a.rel).toLowerCase();
      if (ext === '.map') errores.push(`Hay un mapa de código fuente: ${a.rel}`);
      if (/fixtures/i.test(a.rel)) errores.push(`Ruta con «fixtures» (datos de desarrollo): ${a.rel}`);
      const contenido = readFileSync(a.ruta);
      const latin = contenido.toString('latin1');
      for (const marcador of MARCADORES) {
        if (latin.includes(marcador)) errores.push(`«${marcador}» aparece en ${a.rel}`);
      }
      if (EXT_TEXTO.has(ext)) {
        const texto = contenido.toString('utf8');
        if (/fixtures/i.test(texto)) errores.push(`La cadena «fixtures» aparece en ${a.rel}`);
        const secreto = PATRON_SECRETO.exec(texto);
        if (secreto) errores.push(`Posible secreto («${secreto[1]}») en ${a.rel}`);
      }
      if (ext === '.woff2') resumen.woff2 += a.bytes;
    }

    // 5 · index.html
    const index = join(dir, 'index.html');
    if (!existsSync(index)) errores.push('Falta dist/index.html');
    else revisarIndexHtml(readFileSync(index, 'utf8'), errores);

    // 6 · fuentes
    if (resumen.woff2 > LIMITE_WOFF2) errores.push(`Las fuentes .woff2 suman ${kb(resumen.woff2)} (máximo ${kb(LIMITE_WOFF2)})`);

    // 7-8 · manifiesto, pantallas y JS inicial
    const rutaManifiesto = join(dir, '.vite', 'manifest.json');
    if (!existsSync(rutaManifiesto)) {
      errores.push('Falta dist/.vite/manifest.json (build.manifest debe ser true)');
    } else {
      let manifiesto = null;
      try {
        manifiesto = JSON.parse(readFileSync(rutaManifiesto, 'utf8'));
      } catch {
        errores.push('dist/.vite/manifest.json no es JSON válido');
      }
      if (manifiesto) {
        for (const p of PANTALLAS) {
          const clave = `src/pantallas/${p}/index.ts`;
          if (!(clave in manifiesto)) errores.push(`Falta la pantalla ${clave} en el manifiesto`);
        }
        for (const clave of PROHIBIDAS_EN_MANIFIESTO) {
          if (clave in manifiesto) errores.push(`La galería ${clave} no debe estar en el build`);
        }
        const inicial = jsInicial(manifiesto);
        resumen.entradas = inicial.entradas;
        if (inicial.entradas.length === 0) errores.push('El manifiesto no tiene ninguna entrada (isEntry)');
        for (const f of inicial.archivos) {
          const ruta = join(dir, f);
          if (!existsSync(ruta)) {
            errores.push(`El manifiesto menciona ${f} pero no existe`);
            continue;
          }
          resumen.js_inicial_gzip += gzipSync(readFileSync(ruta), { level: 9 }).length;
        }
        if (resumen.js_inicial_gzip > LIMITE_JS_INICIAL_GZIP) {
          errores.push(`El JS inicial pesa ${kb(resumen.js_inicial_gzip)} gzip (máximo ${kb(LIMITE_JS_INICIAL_GZIP)})`);
        }
      }
    }
    return { errores, resumen };
  } finally {
    if (borrarVite) rmSync(join(dir, '.vite'), { recursive: true, force: true });
  }
}

function principal() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--dist');
  const dir = resolve(i >= 0 && args[i + 1] ? args[i + 1] : join(UI, 'dist'));
  const { errores, resumen } = verificarDist(dir, { borrarVite: !args.includes('--conservar-vite') });
  if (errores.length) {
    console.error(`verificar_dist: FALLA (${errores.length})`);
    for (const e of errores) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(`verificar_dist: OK · ${resumen.archivos} archivos · JS inicial ${kb(resumen.js_inicial_gzip)} gzip · fuentes ${kb(resumen.woff2)} · 10 pantallas, sin galerías`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) principal();
