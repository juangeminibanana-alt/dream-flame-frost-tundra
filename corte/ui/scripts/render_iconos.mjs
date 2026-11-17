#!/usr/bin/env node
/**
 * Corte · íconos (04 §A.11 y §D.4; BUILD_SPEC §3.1: build-empaquetado). Pillow no rasteriza SVG: resvg-js 2.6.2 hace
 * cada PNG a su tamaño nativo (más nítido que reducir uno grande) y Pillow (del .venv-hub) arma el .ico.
 *
 * Dos formas de uso:
 *
 *   node ui/scripts/render_iconos.mjs
 *     Regenera branding/ desde los SVG maestros de spec/assets/ (que nadie edita aquí):
 *       branding/icono.svg, icono_pequeno.svg, icono_capa_frontal.svg, icono_monocromo.svg  (copias con los nombres de 04)
 *       branding/png/icono-<t>.png      16, 20, 24, 32, 40, 48, 64, 96, 128, 256, 512, 1024 (16–32 px desde icono_pequeno)
 *       branding/CreatorHub.ico         16–256 px (10 capas) con tools/generar_ico.py y el Python del .venv-hub
 *       branding/android/res/mipmap-<densidad>/ic_launcher.png, ic_launcher_round.png (48 dp) e
 *         ic_launcher_foreground.png, ic_launcher_monochrome.png (capas adaptables de 108 dp) en mdpi…xxxhdpi
 *       branding/android/play_store_512.png
 *       branding/manifiesto.json        tamaño y SHA-256 de cada archivo y de cada SVG de origen
 *     Android usa en la app los VectorDrawable escritos a mano por android-shell (mipmap-anydpi-v26, minSdk 26: no hay
 *     conversor automático, 04 §A.11). Los PNG de branding/android son la referencia de esos XML, el respaldo si alguna
 *     vez se necesitan íconos de mapa de bits y el ícono de la tienda.
 *
 *   node ui/scripts/render_iconos.mjs <icono.svg> <salida> [icono_pequeno.svg]
 *     La forma literal de 04 §D.4 (la usa scripts/build_windows.ps1, paso 2): solo los 12 icono-<t>.png en <salida>.
 *
 * Al terminar comprueba el ancho y el alto de cada PNG (encabezado IHDR) y los tamaños del .ico (ICONDIR); si algo no
 * cuadra sale con código 1.
 */
import { Resvg } from '@resvg/resvg-js';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TAMANOS_PNG = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256, 512, 1024];
export const TAMANOS_ICO = [16, 20, 24, 32, 40, 48, 64, 96, 128, 256];
/** Densidades de Android: ícono clásico de 48 dp y capas adaptables de 108 dp (factor mdpi = 1). */
export const DENSIDADES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

const UI = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAIZ = resolve(UI, '..');

/** Renderiza un SVG (ruta o texto) a PNG cuadrado de `t` px con fondo transparente. */
function renderizar(svg, t) {
  const fuente = svg.trimStart().startsWith('<') ? svg : readFileSync(svg);
  return new Resvg(fuente, { fitTo: { mode: 'width', value: t }, background: 'rgba(0,0,0,0)' }).render().asPng();
}

/** Ancho y alto del encabezado IHDR de un PNG. */
export function medidasPng(bytes) {
  const firma = '89504e470d0a1a0a';
  if (bytes.subarray(0, 8).toString('hex') !== firma) throw new Error('no es un PNG');
  return { w: bytes.readUInt32BE(16), h: bytes.readUInt32BE(20) };
}

/** Tamaños declarados en el directorio de un .ico (0 = 256). */
export function tamanosIco(bytes) {
  if (bytes.readUInt16LE(0) !== 0 || bytes.readUInt16LE(2) !== 1) throw new Error('no es un .ico');
  const n = bytes.readUInt16LE(4);
  const salida = [];
  for (let i = 0; i < n; i++) {
    const w = bytes[6 + 16 * i] || 256;
    const h = bytes[7 + 16 * i] || 256;
    if (w !== h) throw new Error(`capa ${i} no cuadrada: ${w}x${h}`);
    salida.push(w);
  }
  return salida.sort((a, b) => a - b);
}

/** La forma literal de 04 §D.4: icono-<t>.png en `salida`, 16–32 px desde el SVG pequeño si existe. */
export function renderizarPngs(svgGrande, salida, svgChico) {
  mkdirSync(salida, { recursive: true });
  const hechos = [];
  for (const t of TAMANOS_PNG) {
    const fuente = t <= 32 && svgChico && existsSync(svgChico) ? svgChico : svgGrande;
    const ruta = join(salida, `icono-${t}.png`);
    writeFileSync(ruta, renderizar(fuente, t));
    hechos.push(ruta);
  }
  return hechos;
}

/** Ícono redondo de Android: el maestro recortado a un círculo inscrito (el círculo cae dentro del cuadrado redondeado). */
function svgRedondo(svgMaestro) {
  const interior = readFileSync(svgMaestro, 'utf8').replace(/<\?xml[^>]*>\s*/, '');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">' +
    '<defs><clipPath id="corte-circulo"><circle cx="512" cy="512" r="512"/></clipPath></defs>' +
    `<g clip-path="url(#corte-circulo)">${interior}</g></svg>`;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function listar(dir) {
  const salida = [];
  for (const nombre of readdirSync(dir)) {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) salida.push(...listar(ruta));
    else salida.push(ruta);
  }
  return salida;
}

function verificarPng(ruta, t, errores) {
  try {
    const { w, h } = medidasPng(readFileSync(ruta));
    if (w !== t || h !== t) errores.push(`${relative(RAIZ, ruta)} mide ${w}x${h} (esperado ${t}x${t})`);
  } catch (e) {
    errores.push(`${relative(RAIZ, ruta)}: ${e.message}`);
  }
}

/** Modo completo: spec/assets → branding/. */
function regenerarBranding() {
  const assets = join(RAIZ, 'spec', 'assets');
  const branding = join(RAIZ, 'branding');
  const fuentes = {
    'icono.svg': join(assets, 'icon.svg'),
    'icono_pequeno.svg': join(assets, 'icon-16.svg'),
    'icono_capa_frontal.svg': join(assets, 'icon-capa-frontal.svg'),
    'icono_monocromo.svg': join(assets, 'icon-monocromo.svg'),
  };
  for (const [nombre, ruta] of Object.entries(fuentes)) {
    if (!existsSync(ruta)) throw new Error(`Falta el SVG maestro ${relative(RAIZ, ruta)} (${nombre})`);
  }
  const py = join(RAIZ, '.venv-hub', 'Scripts', 'python.exe');
  if (!existsSync(py)) throw new Error(`Falta ${relative(RAIZ, py)}: corre scripts\\preparar_entorno.ps1 (Pillow arma el .ico)`);

  // Se regenera todo (las salidas son deterministas): nada viejo se queda en branding/.
  for (const sub of ['png', 'android']) rmSync(join(branding, sub), { recursive: true, force: true });
  mkdirSync(branding, { recursive: true });
  for (const [nombre, ruta] of Object.entries(fuentes)) copyFileSync(ruta, join(branding, nombre));
  const grande = join(branding, 'icono.svg');
  const chico = join(branding, 'icono_pequeno.svg');
  const frontal = join(branding, 'icono_capa_frontal.svg');
  const mono = join(branding, 'icono_monocromo.svg');

  const errores = [];
  const carpetaPng = join(branding, 'png');
  renderizarPngs(grande, carpetaPng, chico);
  for (const t of TAMANOS_PNG) verificarPng(join(carpetaPng, `icono-${t}.png`), t, errores);

  const ico = join(branding, 'CreatorHub.ico');
  execFileSync(py, ['-I', join(RAIZ, 'tools', 'generar_ico.py'), carpetaPng, ico], { stdio: 'inherit' });
  const capas = tamanosIco(readFileSync(ico));
  if (capas.join(',') !== TAMANOS_ICO.join(',')) errores.push(`CreatorHub.ico trae [${capas}] (esperado [${TAMANOS_ICO}])`);

  const redondo = svgRedondo(grande);
  for (const [densidad, f] of Object.entries(DENSIDADES)) {
    const carpeta = join(branding, 'android', 'res', `mipmap-${densidad}`);
    mkdirSync(carpeta, { recursive: true });
    const clasico = Math.round(48 * f);
    const adaptable = Math.round(108 * f);
    const piezas = [
      ['ic_launcher.png', grande, clasico],
      ['ic_launcher_round.png', redondo, clasico],
      ['ic_launcher_foreground.png', frontal, adaptable],
      ['ic_launcher_monochrome.png', mono, adaptable],
    ];
    for (const [nombre, fuente, t] of piezas) {
      const ruta = join(carpeta, nombre);
      writeFileSync(ruta, renderizar(fuente, t));
      verificarPng(ruta, t, errores);
    }
  }
  const tienda = join(branding, 'android', 'play_store_512.png');
  writeFileSync(tienda, renderizar(grande, 512));
  verificarPng(tienda, 512, errores);

  if (errores.length) return { errores };

  const archivos = listar(branding)
    .filter((r) => !r.endsWith(`${sep}manifiesto.json`))
    .map((r) => {
      const b = readFileSync(r);
      return { ruta: relative(branding, r).split(sep).join('/'), bytes: b.length, sha256: sha256(b) };
    })
    .sort((a, b) => a.ruta.localeCompare(b.ruta));
  const origen = Object.fromEntries(Object.entries(fuentes).map(([n, r]) => [relative(RAIZ, r).split(sep).join('/'), sha256(readFileSync(r))]));
  const manifiesto = {
    generado_por: 'ui/scripts/render_iconos.mjs (no editar a mano: se regenera desde spec/assets)',
    resvg_js: JSON.parse(readFileSync(join(UI, 'node_modules', '@resvg', 'resvg-js', 'package.json'), 'utf8')).version,
    origen,
    archivos,
  };
  writeFileSync(join(branding, 'manifiesto.json'), JSON.stringify(manifiesto, null, 2) + '\n');
  return { errores, archivos, capas };
}

function principal() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    const { errores, archivos, capas } = regenerarBranding();
    if (errores.length) {
      console.error(`render_iconos: FALLA (${errores.length})`);
      for (const e of errores) console.error(`  - ${e}`);
      process.exitCode = 1;
      return;
    }
    const androids = archivos.filter((a) => a.ruta.startsWith('android/')).length;
    console.log(`render_iconos: OK · branding/ con ${archivos.length} archivos · ${TAMANOS_PNG.length} PNG (16–1024) · ` +
      `CreatorHub.ico con ${capas.length} tamaños [${capas.join(', ')}] · ${androids} PNG de Android (mipmap mdpi–xxxhdpi + tienda)`);
    return;
  }
  const [svgGrande, salida, svgChico] = args;
  if (!svgGrande || !salida) {
    console.error('Uso: node render_iconos.mjs [<icono.svg> <salida> [icono_pequeno.svg]]');
    process.exitCode = 2;
    return;
  }
  const hechos = renderizarPngs(svgGrande, salida, svgChico);
  const errores = [];
  TAMANOS_PNG.forEach((t, i) => verificarPng(hechos[i], t, errores));
  if (errores.length) {
    console.error(`render_iconos: FALLA (${errores.length})`);
    for (const e of errores) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(`render_iconos: ${hechos.length} PNG en ${salida}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal();
