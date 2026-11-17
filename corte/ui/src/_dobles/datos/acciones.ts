/* __DOBLE_CORTE__ · doble de @/datos: acciones en memoria que responden 'aplicada' (con su deshacer y la pila de
   Ctrl+Z de 20 acciones / 10 min) y hub.* que resuelve con fixtures o falla con ErrorHub('solo_en_pc'). */
import type * as C from '@/contrato';
import type { AccionesHub, AccionesLocales, ClaveConsulta, OpSinId, ResultadoAccion, ResultadoLote } from '@firmas/datos';
import { ahoraS, nuevoId } from '@/dominio';
import { ErrorHub, comoErrorHub, soloEnPc } from './errores';
import { consultar, invalidar } from './consultas';
import { leerRuta } from './fixtures';
import { memoria } from './memoria';

const DISPOSITIVO = 'doble-navegador';
const MAX_PILA = 20;
const VIGENCIA_PILA_S = 600;

interface EntradaPila {
  deshacer: () => Promise<void>;
  at: C.EpochS;
}
const pila: EntradaPila[] = [];

function apilar(deshacer: () => Promise<void>): void {
  pila.push({ deshacer, at: ahoraS() });
  while (pila.length > MAX_PILA) pila.shift();
}

function versionado(previo?: { creado_at: C.EpochS; rev: number }): { creado_at: C.EpochS; actualizado_at: C.EpochS; rev: number; dispositivo_id: string } {
  const ahora = ahoraS();
  return { creado_at: previo?.creado_at ?? ahora, actualizado_at: ahora, rev: (previo?.rev ?? 0) + 1, dispositivo_id: DISPOSITIVO };
}

function tocar(...claves: ClaveConsulta[]): void {
  memoria.local_rev += 1;
  invalidar(...claves);
}

function aplicada<T>(objeto: T | null, deshacer: () => Promise<void>): ResultadoAccion<T> {
  apilar(deshacer);
  return { estado: 'aplicada', objeto, error: null, deshacer };
}

function fallida<T>(e: unknown): ResultadoAccion<T> {
  return { estado: 'error', objeto: null, error: comoErrorHub(e), deshacer: async () => undefined };
}

// ---------------------------------------------------------------------------------------------- objetos completos

function planCompleto(datos: C.PlanVideoCrear, previo?: C.PlanVideo): C.PlanVideo {
  return {
    application_id: null, product_id: null, tienda_key: null, fecha_plan: null, estado: 'por_planear',
    fecha_video_listo: null, programada_para_at: null, fecha_publicada: null, content_id: null, enlace_video: null,
    vinculo_origen: null, sugerencias_descartadas: [], motivo_no_se_puede: null, motivo_texto: null, fijada: false,
    nombre_corto: null, notas: null, orden: 0, en_cohorte_desde_at: null,
    ...previo,
    ...datos,
    ...versionado(previo),
  };
}

async function planBase(id: string): Promise<C.PlanVideo | undefined> {
  const enMemoria = memoria.planes.get(id);
  if (enMemoria) return enMemoria;
  try {
    return (await consultar('plan', {})).items.find((p) => p.id === id);
  } catch {
    return undefined;
  }
}

function restaurarEn<T>(mapa: Map<string, T | null>, id: string, tenia: boolean, previo: T | null | undefined): void {
  if (tenia) mapa.set(id, previo ?? null);
  else mapa.delete(id);
}

async function crearPlan(datos: C.PlanVideoCrear): Promise<ResultadoAccion<C.PlanVideo>> {
  const plan = planCompleto(datos);
  memoria.planes.set(plan.id, plan);
  tocar('plan', 'muestras', 'muestra');
  return aplicada(plan, async () => {
    memoria.planes.delete(plan.id);
    tocar('plan', 'muestras', 'muestra');
  });
}

async function editarPlan(id: string, cambios: C.PlanVideoCambios): Promise<ResultadoAccion<C.PlanVideo>> {
  const tenia = memoria.planes.has(id);
  const anterior = memoria.planes.get(id);
  const base = await planBase(id);
  const { rev: _rev, ...resto } = cambios;
  const plan = planCompleto({ titulo: base?.titulo ?? '', ...resto, id }, base);
  memoria.planes.set(id, plan);
  tocar('plan', 'muestras', 'muestra');
  return aplicada(plan, async () => {
    restaurarEn(memoria.planes, id, tenia, anterior);
    tocar('plan', 'muestras', 'muestra');
  });
}

async function borrarPlan(id: string, _rev: number): Promise<ResultadoAccion<null>> {
  const tenia = memoria.planes.has(id);
  const anterior = memoria.planes.get(id);
  memoria.planes.set(id, null);
  tocar('plan', 'muestras', 'muestra');
  return aplicada<null>(null, async () => {
    restaurarEn(memoria.planes, id, tenia, anterior);
    tocar('plan', 'muestras', 'muestra');
  });
}

function avisoCompleto(datos: C.AvisoCrear, previo?: C.AvisoTienda): C.AvisoTienda {
  return {
    fecha_anterior: null, copiado_at: null, marcado_enviado_at: null, quitado_at: null,
    ...previo,
    ...datos,
    ...versionado(previo),
  };
}

async function crearAviso(datos: C.AvisoCrear): Promise<ResultadoAccion<C.AvisoTienda>> {
  const aviso = avisoCompleto(datos);
  memoria.avisos.set(aviso.id, aviso);
  tocar('avisos', 'muestras', 'tiendas');
  return aplicada(aviso, async () => {
    memoria.avisos.delete(aviso.id);
    tocar('avisos', 'muestras', 'tiendas');
  });
}

async function editarAviso(id: string, cambios: C.AvisoCambios): Promise<ResultadoAccion<C.AvisoTienda>> {
  let base: C.AvisoTienda | undefined = memoria.avisos.get(id);
  if (!base) {
    try {
      base = (await consultar('avisos', {})).items.find((a) => a.id === id);
    } catch {
      base = undefined;
    }
  }
  if (!base) return fallida(new ErrorHub('no_encontrado', 'No encontramos ese aviso.', 404));
  const anterior = memoria.avisos.get(id);
  const { rev: _rev, ...resto } = cambios;
  const aviso: C.AvisoTienda = { ...base, ...resto, ...versionado(base) };
  memoria.avisos.set(id, aviso);
  tocar('avisos', 'muestras', 'tiendas');
  return aplicada(aviso, async () => {
    if (anterior) memoria.avisos.set(id, anterior);
    else memoria.avisos.delete(id);
    tocar('avisos', 'muestras', 'tiendas');
  });
}

async function crearNota(datos: C.NotaCrear): Promise<ResultadoAccion<C.Nota>> {
  const nota: C.Nota = { fijada: false, ...datos, ...versionado() };
  memoria.notas.set(nota.id, nota);
  tocar('notas');
  return aplicada(nota, async () => {
    memoria.notas.delete(nota.id);
    tocar('notas');
  });
}

async function editarNota(id: string, cambios: C.NotaCambios): Promise<ResultadoAccion<C.Nota>> {
  const tenia = memoria.notas.has(id);
  const anterior = memoria.notas.get(id);
  let base: C.Nota | undefined = anterior ?? undefined;
  if (!base) {
    try {
      base = (await consultar('notas', {})).items.find((n) => n.id === id);
    } catch {
      base = undefined;
    }
  }
  if (!base) return fallida(new ErrorHub('no_encontrado', 'No encontramos esa nota.', 404));
  const { rev: _rev, ...resto } = cambios;
  const nota: C.Nota = { ...base, ...resto, ...versionado(base) };
  memoria.notas.set(id, nota);
  tocar('notas');
  return aplicada(nota, async () => {
    restaurarEn(memoria.notas, id, tenia, anterior);
    tocar('notas');
  });
}

async function borrarNota(id: string, _rev: number): Promise<ResultadoAccion<null>> {
  const tenia = memoria.notas.has(id);
  const anterior = memoria.notas.get(id);
  memoria.notas.set(id, null);
  tocar('notas');
  return aplicada<null>(null, async () => {
    restaurarEn(memoria.notas, id, tenia, anterior);
    tocar('notas');
  });
}

async function crearRecordatorio(datos: C.RecordatorioCrear): Promise<ResultadoAccion<C.Recordatorio>> {
  const r: C.Recordatorio = {
    entidad: 'general', entidad_id: null, repetir: 'no', estado: 'activo', pospuesto_hasta: null, notificado_at: null,
    ...datos,
    ...versionado(),
  };
  memoria.recordatorios.set(r.id, r);
  tocar('recordatorios');
  return aplicada(r, async () => {
    memoria.recordatorios.delete(r.id);
    tocar('recordatorios');
  });
}

async function editarRecordatorio(id: string, cambios: C.RecordatorioCambios): Promise<ResultadoAccion<C.Recordatorio>> {
  const tenia = memoria.recordatorios.has(id);
  const anterior = memoria.recordatorios.get(id);
  let base: C.Recordatorio | undefined = anterior ?? undefined;
  if (!base) {
    try {
      base = (await consultar('recordatorios', {})).items.find((r) => r.id === id);
    } catch {
      base = undefined;
    }
  }
  if (!base) return fallida(new ErrorHub('no_encontrado', 'No encontramos ese recordatorio.', 404));
  const { rev: _rev, ...resto } = cambios;
  const r: C.Recordatorio = { ...base, ...resto, ...versionado(base) };
  memoria.recordatorios.set(id, r);
  tocar('recordatorios');
  return aplicada(r, async () => {
    restaurarEn(memoria.recordatorios, id, tenia, anterior);
    tocar('recordatorios');
  });
}

async function borrarRecordatorio(id: string, _rev: number): Promise<ResultadoAccion<null>> {
  const tenia = memoria.recordatorios.has(id);
  const anterior = memoria.recordatorios.get(id);
  memoria.recordatorios.set(id, null);
  tocar('recordatorios');
  return aplicada<null>(null, async () => {
    restaurarEn(memoria.recordatorios, id, tenia, anterior);
    tocar('recordatorios');
  });
}

async function plantillaBase(id: string): Promise<C.PlantillaMensaje | undefined> {
  const m = memoria.plantillas.get(id);
  if (m) return m;
  try {
    return (await consultar('plantillas', {})).items.find((p) => p.id === id);
  } catch {
    return undefined;
  }
}

async function editarPlantilla(id: string, cambios: { nombre?: string; cuerpo?: string; rev: number }): Promise<ResultadoAccion<C.PlantillaMensaje>> {
  const base = await plantillaBase(id);
  if (!base) return fallida(new ErrorHub('no_encontrado', 'No encontramos esa plantilla.', 404));
  const anterior = memoria.plantillas.get(id);
  const { rev: _rev, ...resto } = cambios;
  const p: C.PlantillaMensaje = { ...base, ...resto, ...versionado(base) };
  memoria.plantillas.set(id, p);
  tocar('plantillas');
  return aplicada(p, async () => {
    if (anterior) memoria.plantillas.set(id, anterior);
    else memoria.plantillas.delete(id);
    tocar('plantillas');
  });
}

async function restaurarPlantilla(id: string): Promise<ResultadoAccion<C.PlantillaMensaje>> {
  const anterior = memoria.plantillas.get(id);
  memoria.plantillas.delete(id);
  tocar('plantillas');
  const original = await plantillaBase(id);
  return aplicada(original ?? null, async () => {
    if (anterior) memoria.plantillas.set(id, anterior);
    tocar('plantillas');
  });
}

async function editarPreferencias(
  cambios: Partial<Omit<C.PreferenciasSincronizadas, 'rev'>> & { rev: number },
): Promise<ResultadoAccion<C.PreferenciasSincronizadas>> {
  let base = memoria.preferencias;
  if (!base) {
    try {
      base = await consultar('preferencias', {});
    } catch (e) {
      return fallida(e);
    }
  }
  const anterior = memoria.preferencias;
  const { rev: _rev, ...resto } = cambios;
  const nuevas: C.PreferenciasSincronizadas = { ...base, ...resto, rev: base.rev + 1 };
  memoria.preferencias = nuevas;
  tocar('preferencias');
  return aplicada(nuevas, async () => {
    memoria.preferencias = anterior;
    tocar('preferencias');
  });
}

async function aplicarOp(op: OpSinId): Promise<ResultadoAccion<C.ObjetoLocal | null>> {
  switch (op.tipo) {
    case 'plan.crear': return crearPlan(op.datos);
    case 'plan.editar': return editarPlan(op.id, op.cambios);
    case 'plan.borrar': return borrarPlan(op.id, op.rev);
    case 'nota.crear': return crearNota(op.datos);
    case 'nota.editar': return editarNota(op.id, op.cambios);
    case 'nota.borrar': return borrarNota(op.id, op.rev);
    case 'recordatorio.crear': return crearRecordatorio(op.datos);
    case 'recordatorio.editar': return editarRecordatorio(op.id, op.cambios);
    case 'recordatorio.borrar': return borrarRecordatorio(op.id, op.rev);
    case 'aviso.crear': return crearAviso(op.datos);
    case 'aviso.editar': return editarAviso(op.id, op.cambios);
    case 'plantilla.editar': return editarPlantilla(op.id, op.cambios);
    case 'preferencias.editar': return editarPreferencias(op.cambios);
  }
}

/** Varias operaciones en orden con UN solo Deshacer. */
async function lote(ops: OpSinId[]): Promise<ResultadoLote> {
  const resultados: C.OpsResultado[] = [];
  const deshaceres: Array<() => Promise<void>> = [];
  let estado: ResultadoLote['estado'] = 'aplicada';
  for (const op of ops) {
    const r = await aplicarOp(op);
    pila.pop(); // cada acción se apiló sola: en un lote cuenta como una
    if (r.estado === 'aplicada') deshaceres.push(r.deshacer);
    else estado = 'error';
    const fila: C.OpsResultado = { op_id: nuevoId(), estado: r.estado === 'aplicada' ? 'aplicada' : 'invalida' };
    if (r.objeto) fila.objeto = r.objeto;
    if (r.error) fila.error = r.error.mensaje;
    resultados.push(fila);
  }
  const deshacer = async (): Promise<void> => {
    for (const d of [...deshaceres].reverse()) await d();
  };
  apilar(deshacer);
  return { estado, resultados, deshacer };
}

/** Ctrl+Z global: deshace la última acción de esta sesión (pila de 20, válidas 10 min). */
async function deshacerUltimo(): Promise<boolean> {
  const limite = ahoraS() - VIGENCIA_PILA_S;
  while (pila.length > 0) {
    const ultima = pila.pop();
    if (ultima && ultima.at >= limite) {
      await ultima.deshacer();
      return true;
    }
  }
  return false;
}

const acciones: AccionesLocales = {
  crearPlan, editarPlan, borrarPlan, crearAviso, editarAviso, crearNota, editarNota, borrarNota, crearRecordatorio,
  editarRecordatorio, borrarRecordatorio, editarPlantilla, restaurarPlantilla, editarPreferencias, lote, deshacerUltimo,
};

export function useAcciones(): AccionesLocales {
  return acciones;
}

/** Solo pruebas: vacía la pila de Ctrl+Z. */
export function vaciarPila(): void {
  pila.length = 0;
}

// ---------------------------------------------------------------------------------------------- hub.*

async function deFixtureO<T>(ruta: string): Promise<T> {
  try {
    return (await leerRuta({ ruta, query: [] })) as T;
  } catch {
    throw soloEnPc();
  }
}

export const hub: AccionesHub = {
  async sincronizar(_tipo?: C.TipoSync): Promise<C.SyncIniciarResponse> {
    const estado = (await consultar('sesion', {})).sync;
    return { sync_id: estado.sync_id ?? 1, ya_en_curso: estado.en_curso, estado };
  },
  async cancelarSync(): Promise<C.SyncEstado> {
    const estado = (await consultar('sesion', {})).sync;
    return { ...estado, en_curso: false };
  },
  async authLink(): Promise<C.AuthLinkResponse> {
    throw soloEnPc();
  },
  async authPortapapeles(): Promise<C.PortapapelesResponse> {
    return { detectado: false, vista_previa: null, state_coincide: null };
  },
  async authCanjear(): Promise<C.AuthCanjearResponse> {
    throw soloEnPc();
  },
  async authRefrescar(): Promise<C.AuthEstadoResponse> {
    return { conexion: (await consultar('sesion', {})).conexion };
  },
  async authDesconectar(): Promise<C.AuthEstadoResponse> {
    return { conexion: (await consultar('sesion', {})).conexion };
  },
  async importarCredenciales(): Promise<C.ImportarResponse> {
    throw soloEnPc();
  },
  async guardarAppSecret(_appSecret: string): Promise<C.CredencialesEstado> {
    return consultar('credenciales', {});
  },
  async borrarLegado(): Promise<C.BorrarLegadoResponse> {
    return { resultado: 'no_existe' };
  },
  async lanActivar(activo: boolean): Promise<C.LanEstado> {
    return { ...(await consultar('lan', {})), activo };
  },
  async lanCambiar(cambios: C.LanCambios): Promise<C.LanEstado> {
    return { ...(await consultar('lan', {})), ...cambios };
  },
  async lanEmparejar(): Promise<C.EmparejarResponse> {
    return deFixtureO<C.EmparejarResponse>('/api/lan/emparejar');
  },
  async lanEstadoEmparejamiento(pairId: string): Promise<C.EmparejamientoEstado> {
    return deFixtureO<C.EmparejamientoEstado>(`/api/lan/emparejar/${encodeURIComponent(pairId)}`);
  },
  async lanDecidir(): Promise<C.EmparejamientoEstado> {
    throw soloEnPc();
  },
  async lanCambiarDispositivo(deviceId: string, cambios: C.DispositivoCambios): Promise<C.Dispositivo> {
    const d = (await consultar('lan', {})).dispositivos.find((x) => x.device_id === deviceId);
    if (!d) throw new ErrorHub('no_encontrado', 'No encontramos ese celular.', 404);
    return { ...d, ...cambios };
  },
  async lanRevocar(_deviceId: string): Promise<void> {
    /* En memoria no hay nada que revocar. */
  },
  async firewallDiagnostico(): Promise<C.DiagnosticoFirewall> {
    return consultar('firewall', {});
  },
  async firewallConfigurar(_req: C.FirewallRequest): Promise<C.FirewallResponse> {
    return { resultado: 'listo', diagnostico: await consultar('firewall', {}) };
  },
  async ajustesPc(cambios: C.AjustesPcCambios): Promise<C.AjustesPc> {
    return { ...(await consultar('ajustes_pc', {})), ...cambios };
  },
  async borrarDatos(_req: C.BorrarDatosRequest): Promise<void> {
    throw soloEnPc();
  },
  async exportarLocal(): Promise<C.ExportacionLocal> {
    return deFixtureO<C.ExportacionLocal>('/api/local/exportar');
  },
  async importarLocal(_ruta: string): Promise<C.ImportacionLocalResponse> {
    throw soloEnPc();
  },
  // rev. 5 · Display API: necesita el hub real.
  async displayCredenciales(_req: C.CredencialesDisplayRequest): Promise<C.EstadoDisplay> {
    throw soloEnPc();
  },
  async displayConectar(_req?: C.ConectarDisplayRequest): Promise<C.ConectarDisplayResponse> {
    throw soloEnPc();
  },
  async displayDesconectar(_req: C.DesconectarDisplayRequest): Promise<C.DesconectarDisplayResponse> {
    throw soloEnPc();
  },
};
