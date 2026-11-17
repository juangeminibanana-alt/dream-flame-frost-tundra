/**
 * @/plataforma · Android y la PC emparejada (04 §B.4–B.5, §C; BUILD_SPEC §7.4). Cada pedido largo lleva un idPedido
 * y la capa nativa responde con un CustomEvent (EventosAndroid) que trae el mismo id. En Windows y en el navegador
 * estas funciones no hacen nada (o devuelven null / []). En el modo demo con ?simular=android, estadoConexionPc()
 * devuelve una PC emparejada de demostración (sin conexión; `?pc=conectada` la muestra conectada).
 */
import type { EstadoConexionPc, EventoEmparejamiento, PcEncontrada, CodigoErrorEmparejamiento } from '@firmas/plataforma';
import { parametroUrl, simulaAndroid } from './entorno';
import { escucharAndroid, nuevoIdPedido, pedirAndroid, puenteAndroid } from './puentes';

// ---------------------------------------------------------------------------------------------- lectura segura

function texto(v: unknown): string | null {
  return typeof v === 'string' && v !== '' ? v : null;
}
function numero(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/** Convierte el JSON de estadoConexion() / creatorhub-conexion en un EstadoConexionPc completo (faltantes → neutros). */
export function normalizarConexion(v: unknown): EstadoConexionPc | null {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return null;
  const d: Record<string, unknown> = { ...v };
  const permisos = d['permisos'] === 'lectura' || d['permisos'] === 'lectura_escritura' ? d['permisos'] : null;
  const incompatible = d['incompatible'] === 'actualiza_app' || d['incompatible'] === 'actualiza_pc' ? d['incompatible'] : null;
  return {
    emparejado: d['emparejado'] === true,
    host_id: texto(d['host_id']),
    nombre_equipo: texto(d['nombre_equipo']),
    conectado: d['conectado'] === true,
    ip: texto(d['ip']),
    ultima_copia_at: numero(d['ultima_copia_at']),
    cambios_pendientes: Math.max(0, Math.trunc(numero(d['cambios_pendientes']) ?? 0)),
    permisos,
    revocado: d['revocado'] === true,
    incompatible,
    sync_en_curso: d['sync_en_curso'] === true,
  };
}

function conexionDemo(): EstadoConexionPc {
  const conectada = parametroUrl('pc') === 'conectada';
  return {
    emparejado: true,
    host_id: '3f2a0000000000000000000000000000',
    nombre_equipo: 'PC 3F2A',
    conectado: conectada,
    ip: '192.168.1.20',
    ultima_copia_at: null,
    cambios_pendientes: 0,
    permisos: 'lectura_escritura',
    revocado: false,
    incompatible: null,
    sync_en_curso: false,
  };
}

/** En Windows y en el navegador devuelve null. */
export function estadoConexionPc(): EstadoConexionPc | null {
  const android = puenteAndroid();
  if (android) {
    try {
      const v: unknown = JSON.parse(android.estadoConexion());
      return normalizarConexion(v) ?? normalizarConexion({});
    } catch {
      return normalizarConexion({});
    }
  }
  return simulaAndroid() ? conexionDemo() : null;
}

export function alCambiarConexionPc(fn: (e: EstadoConexionPc) => void): () => void {
  if (!puenteAndroid()) return () => undefined;
  let ultimo = '';
  const avisar = (e: EstadoConexionPc): void => {
    const huella = JSON.stringify(e);
    if (huella === ultimo) return;
    ultimo = huella;
    fn(e);
  };
  const quitarConexion = escucharAndroid('creatorhub-conexion', (d) => normalizarConexion(d), avisar);
  // La copia trae sync_en_curso (C27): se relee el estado completo por si cambió.
  const quitarCopia = escucharAndroid('creatorhub-copia', () => estadoConexionPc(), avisar);
  return () => {
    quitarConexion();
    quitarCopia();
  };
}

// ---------------------------------------------------------------------------------------------- descubrimiento

const TOPE_BUSQUEDA_MS = 5000;

function leerPcs(d: Record<string, unknown>): PcEncontrada[] | null {
  const lista = d['pcs'];
  if (!Array.isArray(lista)) return null;
  const pcs: PcEncontrada[] = [];
  for (const x of lista) {
    if (x === null || typeof x !== 'object') continue;
    const p: Record<string, unknown> = { ...x };
    const host_id = texto(p['host_id']);
    const nombre_equipo = texto(p['nombre_equipo']);
    const ip = texto(p['ip']);
    const puerto = numero(p['puerto']);
    if (host_id && nombre_equipo && ip && puerto !== null) pcs.push({ host_id, nombre_equipo, ip, puerto });
  }
  return pcs;
}

/** Descubrimiento UDP 39231 (1.5 s en la capa nativa). Sin puente o sin respuesta: []. */
export async function buscarPcs(): Promise<PcEncontrada[]> {
  const android = puenteAndroid();
  if (!android) return [];
  return (await pedirAndroid('creatorhub-descubrimiento', (id) => android.buscarPcs(id), leerPcs, TOPE_BUSQUEDA_MS)) ?? [];
}

// ---------------------------------------------------------------------------------------------- emparejamiento

const ERRORES_EMPAREJAMIENTO: ReadonlySet<string> = new Set([
  'qr_invalido', 'codigo_invalido', 'pc_no_encontrada', 'huella_distinta', 'rechazado', 'vencido', 'ocupado', 'red',
  'version_incompatible', 'cancelado',
]);

const MENSAJE_ERROR: Readonly<Record<CodigoErrorEmparejamiento, string>> = {
  qr_invalido: 'Ese código QR no es de Corte. Escanea el que aparece en tu PC.',
  codigo_invalido: 'Ese código no es válido. Revisa que tenga 12 caracteres.',
  pc_no_encontrada: 'No encontramos tu PC en esta red. Revisa que Corte esté abierto en tu PC y que ambos estén en el mismo Wi‑Fi.',
  huella_distinta: 'La PC no es la que emparejaste.',
  rechazado: 'Se rechazó el emparejamiento en tu PC.',
  vencido: 'El código venció. Genera uno nuevo en tu PC.',
  ocupado: 'Tu PC ya está emparejando otro celular. Inténtalo en unos minutos.',
  red: 'No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.',
  version_incompatible: 'Tu PC y tu celular tienen versiones de Corte que no se entienden. Actualiza la que sea más vieja.',
  cancelado: 'Cancelaste el emparejamiento.',
};

/** Valida un detail de creatorhub-emparejamiento y lo convierte en EventoEmparejamiento (sin el id). */
export function leerEventoEmparejamiento(d: Record<string, unknown>): EventoEmparejamiento | null {
  switch (d['fase']) {
    case 'conectando':
      return { fase: 'conectando' };
    case 'verifica': {
      const codigo = texto(d['codigo_verificacion']);
      return codigo ? { fase: 'verifica', codigo_verificacion: codigo } : null;
    }
    case 'aprobado':
      return { fase: 'aprobado', nombre_equipo: texto(d['nombre_equipo']) ?? '' };
    case 'error': {
      const e = d['error'];
      const error: CodigoErrorEmparejamiento = typeof e === 'string' && ERRORES_EMPAREJAMIENTO.has(e) ? (e as CodigoErrorEmparejamiento) : 'red';
      return { fase: 'error', error, mensaje: texto(d['mensaje']) ?? MENSAJE_ERROR[error] };
    }
    default:
      return null;
  }
}

function emparejar(llamar: (id: string) => void, alEvento: (e: EventoEmparejamiento) => void): () => void {
  const android = puenteAndroid();
  if (!android) {
    let cancelado = false;
    const t = setTimeout(() => {
      if (!cancelado) alEvento({ fase: 'error', error: 'red', mensaje: 'Para emparejar abre Corte en tu celular Android.' });
    }, 0);
    return () => {
      cancelado = true;
      clearTimeout(t);
    };
  }
  const id = nuevoIdPedido();
  let terminado = false;
  const quitar = escucharAndroid(
    'creatorhub-emparejamiento',
    (d) => (d['id'] === id ? leerEventoEmparejamiento(d) : null),
    (e) => {
      if (terminado) return;
      if (e.fase === 'aprobado' || e.fase === 'error') {
        terminado = true;
        quitar();
      }
      alEvento(e);
    },
  );
  try {
    llamar(id);
  } catch {
    terminado = true;
    quitar();
    setTimeout(() => alEvento({ fase: 'error', error: 'red', mensaje: MENSAJE_ERROR.red }), 0);
  }
  return () => {
    if (terminado) return;
    terminado = true;
    quitar();
    try {
      android.cancelarEmparejamiento(id);
    } catch {
      /* ya no había nada que cancelar */
    }
  };
}

/** `textoQr` = 'creatorhub://pair?v=1&…' (04 §C.4). Devuelve la función para cancelar. */
export function emparejarConQr(textoQr: string, alEvento: (e: EventoEmparejamiento) => void): () => void {
  return emparejar((id) => puenteAndroid()?.emparejarQr(textoQr, id), alEvento);
}

/** `codigo` = 12 caracteres Crockford con o sin guiones; `ip` null = usar el descubrimiento. */
export function emparejarConCodigo(codigo: string, ip: string | null, alEvento: (e: EventoEmparejamiento) => void): () => void {
  return emparejar((id) => puenteAndroid()?.emparejarCodigo(codigo, ip ?? '', id), alEvento);
}

/** Borra credencial, copia, cola de cambios e imágenes del celular. */
export async function olvidarPc(): Promise<void> {
  const android = puenteAndroid();
  if (!android) return;
  let ok = false;
  try {
    ok = android.olvidarPc() === true;
  } catch {
    ok = false;
  }
  if (!ok) throw new Error('No pudimos olvidar tu PC en este celular. Inténtalo de nuevo.');
}

const TOPE_ACTUALIZAR_MS = 30_000;

/** Copia + envío de la cola ahora mismo. Rechaza con un Error (texto listo para mostrar) si no se pudo. */
export async function actualizarCopiaAhora(): Promise<void> {
  const android = puenteAndroid();
  if (!android) return;
  const ok = await pedirAndroid(
    'creatorhub-actualizar',
    (id) => android.actualizarAhora(id),
    (d) => (typeof d['ok'] === 'boolean' ? d['ok'] : null),
    TOPE_ACTUALIZAR_MS,
  );
  if (ok !== true) throw new Error('No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.');
}

/** Enlace creatorhub://pair?… recibido de fuera y aún no usado; '' → null. Nunca empareja solo. */
export function consumirEnlacePendiente(): string | null {
  const android = puenteAndroid();
  if (!android) return null;
  try {
    return texto(android.consumirEnlace());
  } catch {
    return null;
  }
}

export function alEnlace(fn: (url: string) => void): () => void {
  if (!puenteAndroid()) return () => undefined;
  return escucharAndroid('creatorhub-enlace', (d) => texto(d['url']), fn);
}
