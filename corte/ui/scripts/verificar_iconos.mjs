#!/usr/bin/env node
/**
 * Corte · íconos de la interfaz contra lucide-react instalado (BUILD_SPEC §8.1, ui-andamio).
 *
 * Extrae `NombreIcono` de spec/ui_firmas/componentes.d.ts y comprueba cada nombre (salvo «Gorra», el ícono propio de
 * 02 §6) en dos lugares de lucide-react: (1) la lista de exportaciones de su .d.ts y (2) en ejecución: la entrada ESM
 * lo reexporta desde ./icons/<archivo>.mjs y ese módulo, importado de verdad, exporta un componente de React.
 * Versión esperada: 1.63.0. La única excepción registrada es 1.72.0 (02 §6 verificó los
 * nombres contra su tgz): si está instalada, el script lo dice como excepción.
 *
 * Uso: node scripts/verificar_iconos.mjs [--json]     exit 0 = todos existen · 1 = falta alguno o versión no prevista
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const UI = join(dirname(fileURLToPath(import.meta.url)), '..');
export const VERSION_ESPERADA = '1.63.0';
export const VERSION_EXCEPCION = '1.72.0';
export const PROPIOS = new Set(['Gorra']);

/** Nombres de `export type NombreIcono = …;` (sin comentarios). */
export function nombresIcono(textoDts) {
  const inicio = textoDts.indexOf('export type NombreIcono');
  if (inicio < 0) throw new Error('No se encontró `export type NombreIcono` en componentes.d.ts');
  const fin = textoDts.indexOf(';', inicio);
  const bloque = textoDts
    .slice(inicio, fin)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  return [...new Set([...bloque.matchAll(/'([A-Za-z0-9]+)'/g)].map((m) => m[1]))];
}

/** Nombres exportados por el .d.ts de lucide-react (`export { A, B as C, … }` y `declare const X`). */
export function exportacionesDts(textoDts) {
  const salida = new Set();
  for (const m of textoDts.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const parte of m[1].split(',')) {
      const t = parte.trim().split(/\s+as\s+/);
      const nombre = (t[1] ?? t[0] ?? '').trim();
      if (nombre) salida.add(nombre);
    }
  }
  for (const m of textoDts.matchAll(/export\s+declare\s+const\s+([A-Za-z0-9_$]+)/g)) salida.add(m[1]);
  return salida;
}

/** Nombre → archivo del ícono según la entrada ESM (`export { default as X, … } from './icons/x.mjs'`). */
export function mapaEsm(textoEsm) {
  const mapa = new Map();
  for (const m of textoEsm.matchAll(/export\s*\{([^}]*)\}\s*from\s*['"](\.\/icons\/[^'"]+)['"]/g)) {
    for (const parte of m[1].split(',')) {
      const t = parte.trim().split(/\s+as\s+/);
      const nombre = (t[1] ?? t[0] ?? '').trim();
      if (nombre) mapa.set(nombre, m[2]);
    }
  }
  return mapa;
}

export async function verificarIconos(raiz = UI) {
  const firmas = readFileSync(join(raiz, '..', 'spec', 'ui_firmas', 'componentes.d.ts'), 'utf8');
  const nombres = nombresIcono(firmas);
  const requerir = createRequire(join(raiz, 'package.json'));
  const rutaPaquete = requerir.resolve('lucide-react/package.json');
  const dirPaquete = dirname(rutaPaquete);
  const paquete = JSON.parse(readFileSync(rutaPaquete, 'utf8'));
  const dts = readFileSync(join(dirPaquete, paquete.typings ?? paquete.types ?? 'dist/lucide-react.d.ts'), 'utf8');
  const exportados = exportacionesDts(dts);
  const entradaEsm = join(dirPaquete, paquete.module ?? 'dist/esm/lucide-react.mjs');
  const archivos = mapaEsm(readFileSync(entradaEsm, 'utf8'));
  const revisados = nombres.filter((n) => !PROPIOS.has(n));
  const faltan = [];
  // En ejecución se carga SOLO el módulo de cada ícono (no los ~6,500 del paquete) y se comprueba que exporta un
  // componente de React (forwardRef/memo = objeto con $$typeof, o función).
  for (const n of revisados) {
    const archivo = archivos.get(n);
    if (!exportados.has(n) || !archivo) {
      faltan.push(n);
      continue;
    }
    const modulo = await import(pathToFileURL(join(dirname(entradaEsm), archivo)).href);
    const v = modulo.default;
    const esComponente = typeof v === 'function' || (typeof v === 'object' && v !== null && '$$typeof' in v);
    if (!esComponente) faltan.push(n);
  }
  return { version: paquete.version, total: nombres.length, revisados: revisados.length, propios: nombres.filter((n) => PROPIOS.has(n)), faltan };
}

async function principal() {
  const r = await verificarIconos();
  if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
  const excepcion = r.version === VERSION_EXCEPCION;
  if (r.version !== VERSION_ESPERADA && !excepcion) {
    console.error(`verificar_iconos: lucide-react ${r.version} instalado; se esperaba ${VERSION_ESPERADA} (o la excepción ${VERSION_EXCEPCION})`);
    process.exitCode = 1;
  }
  if (r.faltan.length) {
    console.error(`verificar_iconos: faltan ${r.faltan.length} de ${r.revisados} en lucide-react ${r.version}: ${r.faltan.join(', ')}`);
    if (!excepcion) console.error(`Aplica la excepción registrada: lucide-react@${VERSION_EXCEPCION} (BUILD_SPEC §8.1) y anótala.`);
    process.exitCode = 1;
    return;
  }
  const nota = excepcion ? ` (excepción registrada ${VERSION_EXCEPCION}, BUILD_SPEC §8.1)` : '';
  console.log(`verificar_iconos: OK · los ${r.revisados} nombres de NombreIcono existen en lucide-react ${r.version}${nota}; propio sin lucide: ${r.propios.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await principal();
