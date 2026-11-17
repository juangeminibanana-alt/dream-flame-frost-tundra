/**
 * @/datos · transporte de Windows (y del navegador con el proxy de `vite` hacia el hub `--dev`, C31). BUILD_SPEC §5,
 * §6.4, 03 §6.1 y §6.4:
 * - GET con la cookie de sesión (`credentials: 'same-origin'`); ETag/If-None-Match propio: un 304 devuelve el cuerpo
 *   guardado de esa URL.
 * - Mutaciones con `X-CH-Hub: 1`. Errores con ErrorRespuesta → ErrorHub (409 trae `vigente`).
 * - Eventos: SSE /api/events (`event: <tipo>` + `data: <json>`). Al reconectarse tras un corte se invalida todo.
 * - Estado local: cada op va a su ruta REST (POST/PATCH/PUT/DELETE); los lotes, a POST /api/local/ops.
 */
import type * as C from '@/contrato';
import type { ClaveConsulta, ParamsDe } from '@firmas/datos';
import { ErrorHub, TEXTO_CONFLICTO, comoErrorHub, errorDeRed, errorDesdeRespuesta, esObjetoLocal } from './errores';
import { rutaDeConsulta, urlDe } from './rutas';
import type { Lectura, MetodoMutacion, ResultadoOpTransporte, SumideroEventos, Transporte } from './transporte';

const MAX_ETAGS = 200;
/** Tope de OpsRequest (contrato: «máx. 200 por lote»). */
export const MAX_OPS_POR_LOTE = 200;

interface Guardado {
  etag: string;
  cuerpo: unknown;
}

async function leerCuerpo(resp: Response): Promise<unknown> {
  if (resp.status === 204) return null;
  const texto = await resp.text();
  if (texto === '') return null;
  try {
    const v: unknown = JSON.parse(texto);
    return v;
  } catch {
    throw new ErrorHub('error_interno', 'Corte respondió algo que no esperábamos. Inténtalo de nuevo.', resp.status);
  }
}

export const TIPOS_EVENTO: readonly C.EventoHub['tipo'][] = [
  'sync.progreso', 'sync.fin', 'datos.cambiaron', 'conexion.cambio', 'emparejamiento.solicitud', 'emparejamiento.fin',
  'recordatorio.vencido', 'ventana.preguntar_cierre', 'ventana.mostrar_ruta', 'ping',
  // rev. 5 · Display API: cambió la conexión (trae el EstadoDisplay completo).
  'display.cambio',
];
const CONJUNTO_TIPOS: ReadonlySet<string> = new Set(TIPOS_EVENTO);

/** rev. 5 · Forma mínima de EstadoDisplay (lo que la interfaz lee para decidir el estado de Ajustes). */
export function esEstadoDisplay(v: unknown): v is C.EstadoDisplay {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o['configurada'] === 'boolean' && typeof o['conectada'] === 'boolean' && typeof o['estado'] === 'string'
    && Array.isArray(o['scopes']) && Array.isArray(o['scopes_faltantes']);
}

/** Convierte un mensaje SSE (nombre del evento + data JSON) en EventoHub; null si no se reconoce. */
export function leerEventoSse(nombre: string, data: string): C.EventoHub | null {
  let v: unknown;
  try {
    v = data === '' ? {} : JSON.parse(data);
  } catch {
    return null;
  }
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return null;
  const tipo = 'tipo' in v && typeof v.tipo === 'string' ? v.tipo : nombre;
  if (!CONJUNTO_TIPOS.has(tipo)) return null;
  const evento: Record<string, unknown> = { ...v, tipo };
  if (tipo === 'datos.cambiaron' && !Array.isArray(evento['secciones'])) return null;
  if ((tipo === 'sync.progreso' || tipo === 'sync.fin') && (evento['estado'] === null || typeof evento['estado'] !== 'object')) return null;
  if (tipo === 'display.cambio' && !esEstadoDisplay(evento['display'])) return null;
  return evento as C.EventoHub;
}

function rutaDeOp(op: C.OpLocal): { metodo: MetodoMutacion; ruta: string; cuerpo?: unknown } {
  const e = (s: string): string => encodeURIComponent(s);
  switch (op.tipo) {
    case 'plan.crear': return { metodo: 'POST', ruta: '/api/plan', cuerpo: op.datos };
    case 'plan.editar': return { metodo: 'PATCH', ruta: `/api/plan/${e(op.id)}`, cuerpo: op.cambios };
    case 'plan.borrar': return { metodo: 'DELETE', ruta: `/api/plan/${e(op.id)}?rev=${op.rev}` };
    case 'nota.crear': return { metodo: 'POST', ruta: '/api/notas', cuerpo: op.datos };
    case 'nota.editar': return { metodo: 'PATCH', ruta: `/api/notas/${e(op.id)}`, cuerpo: op.cambios };
    case 'nota.borrar': return { metodo: 'DELETE', ruta: `/api/notas/${e(op.id)}?rev=${op.rev}` };
    case 'recordatorio.crear': return { metodo: 'POST', ruta: '/api/recordatorios', cuerpo: op.datos };
    case 'recordatorio.editar': return { metodo: 'PATCH', ruta: `/api/recordatorios/${e(op.id)}`, cuerpo: op.cambios };
    case 'recordatorio.borrar': return { metodo: 'DELETE', ruta: `/api/recordatorios/${e(op.id)}?rev=${op.rev}` };
    case 'aviso.crear': return { metodo: 'POST', ruta: '/api/avisos', cuerpo: op.datos };
    case 'aviso.editar': return { metodo: 'PATCH', ruta: `/api/avisos/${e(op.id)}`, cuerpo: op.cambios };
    case 'plantilla.editar': return { metodo: 'PUT', ruta: `/api/plantillas/${e(op.id)}`, cuerpo: op.cambios };
    case 'preferencias.editar': return { metodo: 'PATCH', ruta: '/api/preferencias', cuerpo: op.cambios };
  }
}

/** Resultado de /api/local/ops → resultado del transporte. */
export function desdeOpsResultado(r: C.OpsResultado): ResultadoOpTransporte {
  const objeto = r.objeto ?? null;
  switch (r.estado) {
    case 'aplicada':
    case 'duplicada':
      return { op_id: r.op_id, estado: 'aplicada', estado_hub: r.estado, objeto, error: null };
    case 'conflicto':
      return {
        op_id: r.op_id, estado: 'conflicto', estado_hub: r.estado, objeto,
        error: new ErrorHub('conflicto', TEXTO_CONFLICTO, 409, undefined, undefined, objeto ?? undefined),
      };
    case 'invalida':
      return {
        op_id: r.op_id, estado: 'error', estado_hub: r.estado, objeto: null,
        error: new ErrorHub('parametros_invalidos', r.error && r.error.trim() !== '' ? r.error : 'No pudimos guardar ese cambio. Revisa los datos.', 422),
      };
  }
}

function esOpsResponse(v: unknown): v is C.OpsResponse {
  return v !== null && typeof v === 'object' && 'resultados' in v && Array.isArray(v.resultados);
}

export function crearTransporteWindows(): Transporte {
  const etags = new Map<string, Guardado>();

  async function getJson(url: string): Promise<unknown> {
    const previo = etags.get(url);
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (previo) headers['If-None-Match'] = previo.etag;
    let resp: Response;
    try {
      resp = await fetch(url, { method: 'GET', credentials: 'same-origin', cache: 'no-store', headers });
    } catch {
      throw errorDeRed();
    }
    if (resp.status === 304 && previo) return previo.cuerpo;
    if (!resp.ok) throw await errorDesdeRespuesta(resp);
    const cuerpo = await leerCuerpo(resp);
    const etag = resp.headers.get('ETag');
    if (etag) {
      etags.delete(url);
      etags.set(url, { etag, cuerpo });
      if (etags.size > MAX_ETAGS) {
        const primera = etags.keys().next();
        if (!primera.done) etags.delete(primera.value);
      }
    } else {
      etags.delete(url);
    }
    return cuerpo;
  }

  async function mutar(metodo: MetodoMutacion, ruta: string, cuerpo?: unknown): Promise<unknown> {
    const headers: Record<string, string> = { Accept: 'application/json', 'X-CH-Hub': '1' };
    const init: RequestInit = { method: metodo, credentials: 'same-origin', cache: 'no-store', headers };
    if (cuerpo !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(cuerpo);
    }
    let resp: Response;
    try {
      resp = await fetch(ruta, init);
    } catch {
      throw errorDeRed();
    }
    if (!resp.ok) throw await errorDesdeRespuesta(resp);
    return leerCuerpo(resp);
  }

  async function aplicarUna(op: C.OpLocal): Promise<ResultadoOpTransporte> {
    const { metodo, ruta, cuerpo } = rutaDeOp(op);
    try {
      const r = await mutar(metodo, ruta, cuerpo);
      return { op_id: op.op_id, estado: 'aplicada', estado_hub: 'aplicada', objeto: esObjetoLocal(r) ? r : null, error: null };
    } catch (e) {
      const error = comoErrorHub(e);
      if (error.codigo === 'conflicto') {
        return { op_id: op.op_id, estado: 'conflicto', estado_hub: 'conflicto', objeto: error.vigente ?? null, error };
      }
      return { op_id: op.op_id, estado: 'error', estado_hub: null, objeto: null, error };
    }
  }

  return {
    tipo: 'windows',

    async leer<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<Lectura> {
      const datos = await getJson(urlDe(rutaDeConsulta(clave, params)));
      return { datos, fuente: 'hub', copia_at: null, con_cambios_pendientes: false };
    },

    obtener(ruta: string): Promise<unknown> {
      return getJson(ruta);
    },

    pedir(metodo: MetodoMutacion, ruta: string, cuerpo?: unknown): Promise<unknown> {
      return mutar(metodo, ruta, cuerpo);
    },

    async aplicarOps(ops: C.OpLocal[], modo: 'individual' | 'lote'): Promise<ResultadoOpTransporte[]> {
      if (modo === 'individual') {
        const salida: ResultadoOpTransporte[] = [];
        for (const op of ops) salida.push(await aplicarUna(op));
        return salida;
      }
      // OpsRequest admite hasta 200 ops por lote (03 §6.2): uno tras otro, en orden; si uno falla, los siguientes no van.
      const salida: ResultadoOpTransporte[] = [];
      for (let i = 0; i < ops.length; i += MAX_OPS_POR_LOTE) {
        const tramo = ops.slice(i, i + MAX_OPS_POR_LOTE);
        try {
          const r = await mutar('POST', '/api/local/ops', { ops: tramo } satisfies C.OpsRequest);
          if (!esOpsResponse(r)) throw new ErrorHub('error_interno', 'Corte respondió algo que no esperábamos. Inténtalo de nuevo.', 200);
          const porId = new Map(r.resultados.map((x) => [x.op_id, x] as const));
          for (const op of tramo) {
            const x = porId.get(op.op_id);
            salida.push(
              x
                ? desdeOpsResultado(x)
                : { op_id: op.op_id, estado: 'error', estado_hub: null, objeto: null, error: new ErrorHub('error_interno', 'Corte no confirmó este cambio. Inténtalo de nuevo.', 200) },
            );
          }
        } catch (e) {
          const error = comoErrorHub(e);
          for (const op of ops.slice(i)) salida.push({ op_id: op.op_id, estado: 'error', estado_hub: null, objeto: null, error });
          break;
        }
      }
      return salida;
    },

    conectarEventos(sumidero: SumideroEventos): () => void {
      if (typeof EventSource === 'undefined') return () => undefined;
      const fuente = new EventSource('/api/events');
      let huboCorte = false;
      const recibir = (nombre: string) => (ev: Event): void => {
        const data = ev instanceof MessageEvent && typeof ev.data === 'string' ? ev.data : '';
        const e = leerEventoSse(nombre, data);
        if (e) sumidero.evento(e);
      };
      const oyentes = TIPOS_EVENTO.map((t) => [t, recibir(t)] as const);
      for (const [t, fn] of oyentes) fuente.addEventListener(t, fn);
      const sinNombre = recibir('message');
      fuente.addEventListener('message', sinNombre);
      const alError = (): void => {
        huboCorte = true;
      };
      const alAbrir = (): void => {
        if (!huboCorte) return;
        huboCorte = false;
        sumidero.invalidar([]); // pudo perderse un datos.cambiaron mientras estuvo cortado
      };
      fuente.addEventListener('error', alError);
      fuente.addEventListener('open', alAbrir);
      return () => {
        for (const [t, fn] of oyentes) fuente.removeEventListener(t, fn);
        fuente.removeEventListener('message', sinNombre);
        fuente.removeEventListener('error', alError);
        fuente.removeEventListener('open', alAbrir);
        fuente.close();
      };
    },

    vigilarSync(): void {
      /* Windows recibe sync.progreso / sync.fin por SSE. */
    },
  };
}
