#!/usr/bin/env node
/**
 * Corte · glifos de las fuentes empaquetadas (BUILD_SPEC §8.1.3, ui-andamio).
 *
 * Lee la tabla `cmap` de los .woff2 (WOFF2 = Brotli + directorio de tablas; `cmap` nunca va transformada) y comprueba
 * que «≈» U+2248, «→» U+2192, «✓» U+2713 y «★» U+2605 están en los archivos que usa src/estilos/fuentes.css.
 * Decide el plan de §8.1.3:
 *   1. si están en los archivos latin → nada que hacer;
 *   2. si faltan pero algún otro woff2 del paquete los tiene → hay que generar un subconjunto propio con
 *      subset-font@2.9.0 (latin + esos puntos) y este script lo dice (exit 2) para instalarlo y generarlo;
 *   3. si ningún woff2 de los paquetes los tiene → respaldo: los componentes usan íconos (Check, Star, ArrowRight)
 *      y «≈» cae a la fuente del sistema; se informa (exit 0).
 *
 * Uso: node scripts/subconjunto_fuentes.mjs [--json]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { brotliDecompressSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const UI = join(dirname(fileURLToPath(import.meta.url)), '..');

export const GLIFOS = [
  { cp: 0x2248, texto: '≈', nombre: 'casi igual' },
  { cp: 0x2192, texto: '→', nombre: 'flecha derecha' },
  { cp: 0x2713, texto: '✓', nombre: 'palomita' },
  { cp: 0x2605, texto: '★', nombre: 'estrella' },
];

/** Archivos que referencia src/estilos/fuentes.css (rutas relativas a ui/). */
export const ARCHIVOS_USADOS = [
  'node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2',
  'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
];
const PAQUETES = ['node_modules/@fontsource-variable/mona-sans/files', 'node_modules/@fontsource-variable/geist-mono/files'];

const ETIQUETAS_WOFF2 = [
  'cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG',
  'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC',
  'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc',
  'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat',
  'Gloc', 'Feat', 'Sill',
];

function leerBase128(buf, pos) {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos.p++];
    if (i === 0 && b === 0x80) throw new Error('UIntBase128 con cero inicial');
    v = (v * 128) + (b & 0x7f);
    if ((b & 0x80) === 0) return v;
  }
  throw new Error('UIntBase128 demasiado largo');
}

/** Devuelve el conjunto de puntos de código con glifo según la tabla cmap de un WOFF2. */
export function leerCmapWoff2(buf) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('No es un archivo WOFF2');
  const numTablas = buf.readUInt16BE(12);
  const comprimido = buf.readUInt32BE(20);
  const pos = { p: 48 };
  const tablas = [];
  for (let i = 0; i < numTablas; i++) {
    const banderas = buf[pos.p++];
    let etiqueta;
    if ((banderas & 0x3f) === 0x3f) {
      etiqueta = buf.toString('latin1', pos.p, pos.p + 4);
      pos.p += 4;
    } else {
      etiqueta = ETIQUETAS_WOFF2[banderas & 0x3f];
    }
    const version = (banderas >> 6) & 3;
    const largo = leerBase128(buf, pos);
    const transformada = etiqueta === 'glyf' || etiqueta === 'loca' ? version !== 3 : version !== 0;
    const largoGuardado = transformada ? leerBase128(buf, pos) : largo;
    tablas.push({ etiqueta, largo, largoGuardado });
  }
  const datos = brotliDecompressSync(buf.subarray(pos.p, pos.p + comprimido));
  let desplazamiento = 0;
  let cmap = null;
  for (const t of tablas) {
    if (t.etiqueta === 'cmap') cmap = datos.subarray(desplazamiento, desplazamiento + t.largo);
    desplazamiento += t.largoGuardado;
  }
  if (!cmap) throw new Error('El WOFF2 no tiene tabla cmap');
  return puntosDeCmap(cmap);
}

function puntosDeCmap(c) {
  const puntos = new Set();
  const subtablas = c.readUInt16BE(2);
  for (let i = 0; i < subtablas; i++) {
    const off = c.readUInt32BE(4 + i * 8 + 4);
    const formato = c.readUInt16BE(off);
    if (formato === 4) {
      const segX2 = c.readUInt16BE(off + 6);
      const finales = off + 14;
      const iniciales = finales + segX2 + 2;
      const deltas = iniciales + segX2;
      const rangos = deltas + segX2;
      for (let s = 0; s < segX2 / 2; s++) {
        const fin = c.readUInt16BE(finales + s * 2);
        const ini = c.readUInt16BE(iniciales + s * 2);
        const delta = c.readInt16BE(deltas + s * 2);
        const rango = c.readUInt16BE(rangos + s * 2);
        for (let cp = ini; cp <= fin && cp !== 0xffff; cp++) {
          let glifo;
          if (rango === 0) glifo = (cp + delta) & 0xffff;
          else {
            glifo = c.readUInt16BE(rangos + s * 2 + rango + (cp - ini) * 2);
            if (glifo) glifo = (glifo + delta) & 0xffff;
          }
          if (glifo) puntos.add(cp);
        }
      }
    } else if (formato === 12) {
      const grupos = c.readUInt32BE(off + 12);
      for (let g = 0; g < grupos; g++) {
        const base = off + 16 + g * 12;
        const ini = c.readUInt32BE(base);
        const fin = c.readUInt32BE(base + 4);
        for (let cp = ini; cp <= fin; cp++) puntos.add(cp);
      }
    }
  }
  return puntos;
}

/** Revisa los glifos en los archivos usados y en el resto de woff2 de los paquetes. */
export function revisarGlifos(raiz = UI) {
  const usados = ARCHIVOS_USADOS.map((rel) => {
    const ruta = join(raiz, rel);
    if (!existsSync(ruta)) return { archivo: rel, existe: false, faltan: GLIFOS.map((g) => g.texto) };
    const puntos = leerCmapWoff2(readFileSync(ruta));
    return { archivo: rel, existe: true, faltan: GLIFOS.filter((g) => !puntos.has(g.cp)).map((g) => g.texto) };
  });
  const otros = [];
  for (const dir of PAQUETES) {
    const abs = join(raiz, dir);
    if (!existsSync(abs)) continue;
    for (const nombre of readdirSync(abs).filter((n) => n.endsWith('.woff2'))) {
      const rel = `${dir}/${nombre}`;
      if (ARCHIVOS_USADOS.includes(rel)) continue;
      const puntos = leerCmapWoff2(readFileSync(join(abs, nombre)));
      const tiene = GLIFOS.filter((g) => puntos.has(g.cp)).map((g) => g.texto);
      if (tiene.length) otros.push({ archivo: rel, tiene });
    }
  }
  const faltanEnUsados = [...new Set(usados.flatMap((u) => u.faltan))];
  let plan;
  if (faltanEnUsados.length === 0) plan = 'completo';
  else if (otros.some((o) => o.tiene.some((t) => faltanEnUsados.includes(t)))) plan = 'subconjunto';
  else plan = 'respaldo_iconos';
  return { usados, otros, faltanEnUsados, plan };
}

function principal() {
  const r = revisarGlifos();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    for (const u of r.usados) {
      console.log(`${u.archivo}: ${u.existe ? (u.faltan.length ? `faltan ${u.faltan.join(' ')}` : 'tiene los 4 glifos') : 'NO EXISTE'}`);
    }
    if (r.otros.length) for (const o of r.otros) console.log(`  otro archivo con glifos: ${o.archivo} (${o.tiene.join(' ')})`);
    if (r.plan === 'completo') console.log('Plan §8.1.3: nada que hacer, los archivos latin ya traen ≈ → ✓ ★.');
    if (r.plan === 'subconjunto') console.log('Plan §8.1.3: generar un subconjunto propio con subset-font@2.9.0 (latin + ≈ → ✓ ★).');
    if (r.plan === 'respaldo_iconos') {
      console.log('Plan §8.1.3: ningún woff2 de los paquetes trae esos glifos → respaldo: íconos Check, Star y ArrowRight;');
      console.log('«≈» cae a la fuente del sistema (Segoe UI / Roboto) desde --font-sans y --font-mono. Sin subset-font.');
    }
  }
  if (r.usados.some((u) => !u.existe)) process.exitCode = 1;
  else if (r.plan === 'subconjunto') process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) principal();
