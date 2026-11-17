/**
 * @/datos · acciones sobre el estado local (spec/ui_firmas/datos.d.ts `AccionesLocales`, BUILD_SPEC §8.3, C26).
 * Cada acción se convierte en una OpLocal con op_id (uuid4) y va por el transporte:
 * - Windows: ruta REST de la op; antes de enviarla la caché se actualiza al instante (optimista) y, si el hub responde
 *   409 o error, se revierte. 409 → estado 'conflicto' con la versión vigente (ErrorHub.vigente).
 * - Android: cola del puente (ops); la superposición la hace la lectura con opsPendientes. Sin la PC → 'en_cola'.
 * - Demo: estado en memoria sobre los fixtures.
 * Cada acción aplicada devuelve su deshacer() (op inversa con la rev nueva) y entra en la pila de Ctrl+Z (20 acciones,
 * válidas 10 min). `lote` = varias ops con UN solo Deshacer (Windows: POST /api/local/ops).
 */
import type * as C from '@/contrato';
import type { AccionesLocales, ClaveConsulta, OpSinId, ResultadoAccion, ResultadoLote } from '@firmas/datos';
import { entradasDe, invalidarClaves, parchearEntrada, revertirEntrada, type Entrada } from './almacen';
import { consultar } from './consultas';
import { dom } from './dominio';
import { ErrorHub, comoErrorHub } from './errores';
import {
  type ContextoOp, type EstadoLocalListas, ESTADO_VACIO, aplicarOpAEstado, conOpId, entraEnConsulta, guardas, idDeOp, inversaDe,
  listaDeOp, solicitudesTocadas,
} from './optimista';
import { clavesDeOp } from './rutas';
import { obtenerTransporte, type ResultadoOpTransporte } from './transporte';
import { esMuestra } from './transporte_android';

export const MAX_PILA = 20;
export const VIGENCIA_PILA_S = 600;
const DISPOSITIVO_LOCAL = 'interfaz';

// ---------------------------------------------------------------------------------------------- pila de Ctrl+Z

interface EntradaPila {
  deshacer: () => Promise<void>;
  at: C.EpochS;
}
const pila: EntradaPila[] = [];

function apilar(entrada: EntradaPila): void {
  pila.push(entrada);
  while (pila.length > MAX_PILA) pila.shift();
}

function sacarDePila(entrada: EntradaPila): void {
  const i = pila.indexOf(entrada);
  if (i >= 0) pila.splice(i, 1);
}

/** Solo pruebas. */
export function vaciarPila(): void {
  pila.length = 0;
}

/** Solo pruebas. */
export function tamanoPila(): number {
  return pila.length;
}

function contexto(): ContextoOp {
  return { ahora: dom.ahoraS(), dispositivo: DISPOSITIVO_LOCAL };
}

// ---------------------------------------------------------------------------------------------- objetos actuales

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function itemsDe(datos: unknown): unknown[] {
  return esObjeto(datos) && Array.isArray(datos['items']) ? datos['items'] : [];
}

function buscarEnCache(op: C.OpLocal): C.ObjetoLocal | null {
  const { lista, clave } = listaDeOp(op.tipo);
  const id = idDeOp(op);
  if (lista === 'preferencias') {
    for (const [, e] of entradasDe('preferencias')) {
      const d: unknown = e.datos;
      if (guardas.esPreferencias(d)) return d;
    }
    return null;
  }
  const candidatos: unknown[] = [];
  for (const [, e] of entradasDe(clave)) candidatos.push(...itemsDe(e.datos));
  // El detalle de muestra trae planes, avisos, notas y recordatorios de esa muestra.
  for (const [, e] of entradasDe('muestra')) {
    const sub: unknown = esObjeto(e.datos) ? e.datos[lista] : undefined;
    if (Array.isArray(sub)) candidatos.push(...sub);
  }
  for (const c of candidatos) if (guardas.esObjetoLocalConocido(c) && 'id' in c && c.id === id) return c;
  return null;
}

async function objetoActual(op: C.OpLocal): Promise<C.ObjetoLocal | null> {
  if (op.tipo === 'plan.crear' || op.tipo === 'nota.crear' || op.tipo === 'recordatorio.crear' || op.tipo === 'aviso.crear') return null;
  const enCache = buscarEnCache(op);
  if (enCache) return enCache;
  const { clave } = listaDeOp(op.tipo);
  try {
    const datos: unknown = clave === 'preferencias' ? await consultar('preferencias', {}) : await consultar(clave, {});
    if (clave === 'preferencias') return guardas.esPreferencias(datos) ? datos : null;
    const id = idDeOp(op);
    for (const c of itemsDe(datos)) if (guardas.esObjetoLocalConocido(c) && 'id' in c && c.id === id) return c;
  } catch {
    return null;
  }
  return null;
}

function estadoDesde(antes: C.ObjetoLocal | null): EstadoLocalListas {
  if (!antes) return ESTADO_VACIO;
  if (guardas.esPlan(antes)) return { ...ESTADO_VACIO, planes: [antes] };
  if (guardas.esAviso(antes)) return { ...ESTADO_VACIO, avisos: [antes] };
  if (guardas.esRecordatorio(antes)) return { ...ESTADO_VACIO, recordatorios: [antes] };
  if (guardas.esPlantilla(antes)) return { ...ESTADO_VACIO, plantillas: [antes] };
  if (guardas.esPreferencias(antes)) return { ...ESTADO_VACIO, preferencias: antes };
  if (guardas.esNota(antes)) return { ...ESTADO_VACIO, notas: [antes] };
  return ESTADO_VACIO;
}

/** Cómo queda el objeto si el hub aplica la op (mismas reglas: rev + 1, ids del cliente). */
function predecir(op: C.OpLocal, antes: C.ObjetoLocal | null, ctx: ContextoOp): C.ObjetoLocal | null {
  return aplicarOpAEstado(estadoDesde(antes), op, ctx).objeto;
}

// ---------------------------------------------------------------------------------------------- optimismo (Windows)

interface Parche {
  k: string;
  previa: Entrada;
  datos: unknown;
}

function parchear(k: string, datos: unknown, parches: Parche[]): void {
  const previa = parchearEntrada(k, datos);
  if (previa) parches.push({ k, previa, datos });
}

function conObjeto<T extends { id: string }>(lista: T[], id: string, objeto: T | null, entra: boolean): T[] {
  const sin = lista.filter((x) => x.id !== id);
  if (!objeto || !entra) return sin;
  const i = lista.findIndex((x) => x.id === id);
  if (i < 0) return [...sin, objeto];
  const salida = [...lista];
  salida[i] = objeto;
  return salida;
}

async function listasParaAvance(op: C.OpLocal, objeto: C.ObjetoLocal | null): Promise<{ planes: C.PlanVideo[]; avisos: C.AvisoTienda[] }> {
  const id = idDeOp(op);
  const leer = async <T extends { id: string }>(clave: 'plan' | 'avisos'): Promise<T[]> => {
    try {
      return itemsDe(await consultar(clave, {})).filter((x): x is T => esObjeto(x) && typeof x['id'] === 'string');
    } catch {
      return [];
    }
  };
  let planes = await leer<C.PlanVideo>('plan');
  let avisos = await leer<C.AvisoTienda>('avisos');
  if (op.tipo.startsWith('plan.')) planes = conObjeto(planes, id, guardas.esPlan(objeto) ? objeto : null, true);
  if (op.tipo.startsWith('aviso.')) avisos = conObjeto(avisos, id, guardas.esAviso(objeto) ? objeto : null, true);
  return { planes, avisos };
}

/** Aplica la op a la caché de inmediato (listas, preferencias y muestras tocadas). Devuelve cómo revertirlo. */
async function parchearOptimista(op: C.OpLocal, antes: C.ObjetoLocal | null, objeto: C.ObjetoLocal | null): Promise<() => void> {
  const parches: Parche[] = [];
  const { lista, clave } = listaDeOp(op.tipo);
  const id = idDeOp(op);
  if (lista === 'preferencias') {
    if (objeto) for (const [k] of entradasDe('preferencias')) parchear(k, objeto, parches);
  } else {
    for (const [k, e] of entradasDe(clave)) {
      if (!esObjeto(e.datos)) continue;
      const items = itemsDe(e.datos).filter((x): x is C.ObjetoLocal & { id: string } => esObjeto(x) && typeof x['id'] === 'string');
      const nuevos = conObjeto(items, id, objeto && 'id' in objeto ? objeto : null, objeto !== null && entraEnConsulta(clave, e.params, objeto));
      parchear(k, { ...e.datos, items: nuevos }, parches);
    }
  }
  const tocadas = solicitudesTocadas(antes, objeto);
  const notaOrecordatorio = op.tipo.startsWith('nota.') || op.tipo.startsWith('recordatorio.');
  const conMuestras = (['muestras', 'muestra', 'tienda', 'producto'] as const).some((c) => entradasDe(c).length > 0);
  if (conMuestras && (tocadas.size > 0 || notaOrecordatorio)) {
    // Solo si hay muestras en pantalla se piden (o se toman de la caché) las listas completas de planes y avisos.
    const { planes, avisos } = tocadas.size > 0 ? await listasParaAvance(op, objeto) : { planes: [], avisos: [] };
    const hoy = dom.hoyLocal();
    const recalcular = (m: unknown): unknown => (esMuestra(m) && tocadas.has(m.application_id) ? dom.aplicarLocal(m, planes, avisos, hoy) : m);
    if (tocadas.size > 0) {
      for (const [k, e] of entradasDe('muestras')) {
        if (esObjeto(e.datos)) parchear(k, { ...e.datos, items: itemsDe(e.datos).map(recalcular) }, parches);
      }
      for (const c of ['tienda', 'producto'] as const) {
        for (const [k, e] of entradasDe(c)) {
          if (esObjeto(e.datos) && Array.isArray(e.datos['muestras'])) parchear(k, { ...e.datos, muestras: (e.datos['muestras'] as unknown[]).map(recalcular) }, parches);
        }
      }
    }
    for (const [k, e] of entradasDe('muestra')) {
      if (!esObjeto(e.datos)) continue;
      const m: unknown = e.datos['muestra'];
      if (!esMuestra(m)) continue;
      const appId = m.application_id;
      const cambios: Record<string, unknown> = {};
      if (tocadas.has(appId)) {
        cambios['muestra'] = dom.aplicarLocal(m, planes, avisos, hoy);
        cambios['planes'] = planes.filter((p) => p.application_id === appId);
        cambios['avisos'] = avisos.filter((a) => a.solicitud_ids.includes(appId));
      }
      if (notaOrecordatorio) {
        const lista2 = op.tipo.startsWith('nota.') ? 'notas' : 'recordatorios';
        const sub: unknown = e.datos[lista2];
        const actuales = Array.isArray(sub) ? sub.filter((x): x is C.Nota | C.Recordatorio => guardas.esNota(x) || guardas.esRecordatorio(x)) : [];
        const nuevo = guardas.esNota(objeto) || guardas.esRecordatorio(objeto) ? objeto : null;
        const entra = nuevo !== null && nuevo.entidad === 'muestra' && nuevo.entidad_id === appId;
        cambios[lista2] = conObjeto<C.Nota | C.Recordatorio>(actuales, id, nuevo, entra);
      }
      if (Object.keys(cambios).length > 0) parchear(k, { ...e.datos, ...cambios }, parches);
    }
  }
  return () => {
    for (const p of [...parches].reverse()) revertirEntrada(p.k, p.previa, p.datos);
  };
}

// ---------------------------------------------------------------------------------------------- ejecución

interface Ejecucion {
  estado: ResultadoAccion<unknown>['estado'];
  objeto: C.ObjetoLocal | null;
  error: ErrorHub | null;
  deshacer: () => Promise<void>;
}

function clavesAfectadas(ops: readonly C.OpLocal[]): ClaveConsulta[] {
  return [...new Set(ops.flatMap((o) => clavesDeOp(o.tipo)))];
}

function sinDeshacer(): Promise<void> {
  return Promise.resolve();
}

/** Ejecuta ops (una o un lote), con optimismo en Windows, y arma su único deshacer. */
async function ejecutarOps(entrada: OpSinId[], modo: 'individual' | 'lote', alPila: boolean): Promise<{ resultados: ResultadoOpTransporte[]; objetos: Array<C.ObjetoLocal | null>; estado: Ejecucion['estado']; deshacer: () => Promise<void> }> {
  const t = await obtenerTransporte();
  const ctx = contexto();
  const ops = entrada.map((o) => conOpId(o, dom.nuevoId()));
  // Objeto previo y previsto de cada op (en un lote, una op ve lo que dejó la anterior sobre el mismo objeto).
  const vistos = new Map<string, C.ObjetoLocal | null>();
  const antes: Array<C.ObjetoLocal | null> = [];
  const previstos: Array<C.ObjetoLocal | null> = [];
  for (const op of ops) {
    const llave = `${listaDeOp(op.tipo).lista}:${idDeOp(op)}`;
    const previo = vistos.has(llave) ? (vistos.get(llave) ?? null) : await objetoActual(op);
    const previsto = predecir(op, previo, ctx);
    vistos.set(llave, previsto);
    antes.push(previo);
    previstos.push(previsto);
  }
  const reversiones: Array<() => void> = [];
  if (t.tipo === 'windows') {
    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];
      if (op) reversiones.push(await parchearOptimista(op, antes[i] ?? null, previstos[i] ?? null));
    }
  }
  let resultados: ResultadoOpTransporte[];
  try {
    resultados = await t.aplicarOps(ops, modo);
  } catch (e) {
    const error = comoErrorHub(e);
    resultados = ops.map((op) => ({ op_id: op.op_id, estado: 'error', estado_hub: null, objeto: null, error }));
  }
  const fallo = resultados.some((r) => r.estado === 'error' || r.estado === 'conflicto');
  if (fallo) for (const r of [...reversiones].reverse()) r();
  invalidarClaves(clavesAfectadas(ops));

  const objetos = resultados.map((r, i) => (r.estado === 'conflicto' ? r.objeto : (r.objeto ?? previstos[i] ?? null)));
  const estado: Ejecucion['estado'] = resultados.some((r) => r.estado === 'conflicto')
    ? 'conflicto'
    : resultados.some((r) => r.estado === 'error')
      ? 'error'
      : resultados.some((r) => r.estado === 'en_cola')
        ? 'en_cola'
        : 'aplicada';

  // Inversas de las ops que quedaron aplicadas (o en cola), en orden inverso.
  const inversas: OpSinId[] = [];
  resultados.forEach((r, i) => {
    const op = ops[i];
    if (!op || (r.estado !== 'aplicada' && r.estado !== 'en_cola')) return;
    const inv = inversaDe(op, antes[i] ?? null, objetos[i] ?? null, ctx, dom.nuevoId);
    if (inv) inversas.unshift(inv);
  });
  let deshacer: () => Promise<void> = sinDeshacer;
  if (inversas.length > 0) {
    const entradaPila: EntradaPila = { deshacer: sinDeshacer, at: ctx.ahora };
    let usado = false;
    deshacer = async (): Promise<void> => {
      if (usado) return;
      usado = true;
      sacarDePila(entradaPila);
      const r = await ejecutarOps(inversas, inversas.length > 1 ? 'lote' : 'individual', false);
      if (r.estado === 'error' || r.estado === 'conflicto') {
        throw r.resultados.find((x) => x.error)?.error ?? new ErrorHub('error_interno', 'No pudimos deshacer el cambio.', 0);
      }
    };
    entradaPila.deshacer = deshacer;
    if (alPila && (estado === 'aplicada' || estado === 'en_cola')) apilar(entradaPila);
  }
  return { resultados, objetos, estado, deshacer };
}

async function accion<T extends C.ObjetoLocal | null>(op: OpSinId, es: (o: C.ObjetoLocal | null) => o is Exclude<T, null>): Promise<ResultadoAccion<T>> {
  const r = await ejecutarOps([op], 'individual', true);
  const objeto = r.objetos[0] ?? null;
  const error = r.resultados[0]?.error ?? null;
  return { estado: r.estado, objeto: es(objeto) ? objeto : null, error, deshacer: r.deshacer };
}

const ninguno = (_o: C.ObjetoLocal | null): _o is never => false;

async function restaurarPlantilla(id: string): Promise<ResultadoAccion<C.PlantillaMensaje>> {
  const ctx = contexto();
  const antes = await objetoActual({ op_id: '', tipo: 'plantilla.editar', id, cambios: { rev: 0 } });
  let objeto: C.PlantillaMensaje | null = null;
  try {
    const t = await obtenerTransporte();
    const r: unknown = await t.pedir('POST', `/api/plantillas/${encodeURIComponent(id)}/restaurar`);
    objeto = guardas.esPlantilla(r) ? r : null;
  } catch (e) {
    return { estado: 'error', objeto: null, error: comoErrorHub(e), deshacer: sinDeshacer };
  } finally {
    invalidarClaves(['plantillas']);
  }
  let deshacer: () => Promise<void> = sinDeshacer;
  if (objeto && guardas.esPlantilla(antes)) {
    const inversa: OpSinId = { tipo: 'plantilla.editar', id, cambios: { nombre: antes.nombre, cuerpo: antes.cuerpo, rev: objeto.rev } };
    const entradaPila: EntradaPila = { deshacer: sinDeshacer, at: ctx.ahora };
    let usado = false;
    deshacer = async (): Promise<void> => {
      if (usado) return;
      usado = true;
      sacarDePila(entradaPila);
      const r = await ejecutarOps([inversa], 'individual', false);
      if (r.estado === 'error' || r.estado === 'conflicto') throw r.resultados[0]?.error ?? new ErrorHub('error_interno', 'No pudimos deshacer el cambio.', 0);
    };
    entradaPila.deshacer = deshacer;
    apilar(entradaPila);
  }
  return { estado: 'aplicada', objeto, error: null, deshacer };
}

function aOpsResultado(r: ResultadoOpTransporte, objeto: C.ObjetoLocal | null): C.OpsResultado {
  const estado: C.OpsResultado['estado'] =
    r.estado_hub ?? (r.estado === 'conflicto' ? 'conflicto' : r.estado === 'error' ? 'invalida' : 'aplicada');
  const fila: C.OpsResultado = { op_id: r.op_id, estado };
  if (objeto) fila.objeto = objeto;
  if (r.error) fila.error = r.error.mensaje;
  return fila;
}

async function lote(ops: OpSinId[]): Promise<ResultadoLote> {
  if (ops.length === 0) return { estado: 'aplicada', resultados: [], deshacer: sinDeshacer };
  const r = await ejecutarOps(ops, 'lote', true);
  return { estado: r.estado, resultados: r.resultados.map((x, i) => aOpsResultado(x, r.objetos[i] ?? null)), deshacer: r.deshacer };
}

/** Ctrl+Z global: deshace la última acción de esta sesión (pila de 20, válidas 10 min). false si no había nada. */
async function deshacerUltimo(): Promise<boolean> {
  const limite = dom.ahoraS() - VIGENCIA_PILA_S;
  while (pila.length > 0) {
    const ultima = pila[pila.length - 1];
    if (!ultima) break;
    if (ultima.at < limite) {
      pila.length = 0; // todo lo anterior es aún más viejo
      return false;
    }
    await ultima.deshacer(); // la saca de la pila
    return true;
  }
  return false;
}

const acciones: AccionesLocales = {
  crearPlan: (datos) => accion<C.PlanVideo>({ tipo: 'plan.crear', datos }, guardas.esPlan),
  editarPlan: (id, cambios) => accion<C.PlanVideo>({ tipo: 'plan.editar', id, cambios }, guardas.esPlan),
  borrarPlan: (id, rev) => accion<null>({ tipo: 'plan.borrar', id, rev }, ninguno),
  crearAviso: (datos) => accion<C.AvisoTienda>({ tipo: 'aviso.crear', datos }, guardas.esAviso),
  editarAviso: (id, cambios) => accion<C.AvisoTienda>({ tipo: 'aviso.editar', id, cambios }, guardas.esAviso),
  crearNota: (datos) => accion<C.Nota>({ tipo: 'nota.crear', datos }, guardas.esNota),
  editarNota: (id, cambios) => accion<C.Nota>({ tipo: 'nota.editar', id, cambios }, guardas.esNota),
  borrarNota: (id, rev) => accion<null>({ tipo: 'nota.borrar', id, rev }, ninguno),
  crearRecordatorio: (datos) => accion<C.Recordatorio>({ tipo: 'recordatorio.crear', datos }, guardas.esRecordatorio),
  editarRecordatorio: (id, cambios) => accion<C.Recordatorio>({ tipo: 'recordatorio.editar', id, cambios }, guardas.esRecordatorio),
  borrarRecordatorio: (id, rev) => accion<null>({ tipo: 'recordatorio.borrar', id, rev }, ninguno),
  editarPlantilla: (id, cambios) => accion<C.PlantillaMensaje>({ tipo: 'plantilla.editar', id, cambios }, guardas.esPlantilla),
  restaurarPlantilla,
  editarPreferencias: (cambios) => accion<C.PreferenciasSincronizadas>({ tipo: 'preferencias.editar', cambios }, guardas.esPreferencias),
  lote,
  deshacerUltimo,
};

export function useAcciones(): AccionesLocales {
  return acciones;
}
