/**
 * FIRMAS NORMATIVAS · módulo `@/datos` (lo implementa ui-datos en ui/src/datos/). BUILD_SPEC §8.3.
 * Única puerta de las pantallas a los datos: consultas tipadas (con copia sin conexión en Android), acciones sobre el
 * estado local (optimistas, con Deshacer y cola en Android) y acciones del hub (solo Windows salvo sincronizar).
 * rev. 3.1: ErrorHub.vigente (409), AccionesLocales.deshacerUltimo (Ctrl+Z global), importarLocal(ruta) (C46) y el
 * registro de metadatos de imagen delegado en dominio.registroImagenes (C47).
 * rev. 5 (15/11, solo agregados): consulta 'display' y hub.display* (Display API, métricas de tus videos).
 */
import type * as C from '@/contrato';
import type { EstadoConexionPc } from '@/plataforma';

// ============================================================================ errores
export type CodigoErrorUi =
  | C.CodigoError
  /** Android sin la PC y la vista no se puede armar con la copia. */
  | 'necesita_pc'
  /** La acción solo existe en la app de Windows. */
  | 'solo_en_pc'
  /** fetch falló sin respuesta. */
  | 'red';
export declare class ErrorHub extends Error {
  readonly codigo: CodigoErrorUi;
  /** 0 si no hubo respuesta HTTP. */
  readonly http: number;
  /** Texto listo para mostrar (español de México). */
  readonly mensaje: string;
  readonly detalle: Record<string, string | number | boolean | null> | undefined;
  readonly reintentar_en_s: number | undefined;
  /** rev. 3.1 · Solo con codigo 'conflicto': la versión vigente del hub (ErrorRespuesta.error.vigente). */
  readonly vigente: C.ObjetoLocal | undefined;
  constructor(codigo: CodigoErrorUi, mensaje: string, http?: number, detalle?: Record<string, string | number | boolean | null>, reintentar_en_s?: number, vigente?: C.ObjetoLocal);
}

// ============================================================================ consultas
export type OrdenTiendas = 'atencion' | 'comision' | 'deuda' | 'nombre';
export interface ParamsMuestras {
  grupo?: C.GrupoMuestra[];
  clase?: C.ClaseMuestra[];
  tienda?: string;
  q?: string;
  orden?: C.OrdenMuestras;
  recibidas?: boolean;
}
export interface ParamsRango { desde?: C.FechaLocal; hasta?: C.FechaLocal }
export interface ParamsOrdenes extends ParamsRango {
  estado?: C.EstadoOrden[];
  tienda?: string;
  producto?: string;
  video?: string;
  q?: string;
  pagina?: number;
  por_pagina?: number;
}
type SinParams = Record<string, never>;

/** Mapa clave → (parámetros, respuesta). Cada clave corresponde a UNA ruta GET de BUILD_SPEC §5. */
export interface Consultas {
  sesion: { params: SinParams; respuesta: C.SessionResponse };
  dashboard: { params: { periodo: C.Periodo }; respuesta: C.DashboardResponse };
  muestras: { params: ParamsMuestras; respuesta: C.MuestrasResponse };
  muestra: { params: { id: string }; respuesta: C.MuestraDetalleResponse };
  tiendas: { params: ParamsRango & { orden?: OrdenTiendas }; respuesta: C.TiendasResponse };
  tienda: { params: ParamsRango & { key: string }; respuesta: C.TiendaDetalleResponse };
  serie: { params: { granularidad: C.Granularidad; desde: C.FechaLocal; hasta: C.FechaLocal }; respuesta: C.SerieResponse };
  videos: { params: ParamsRango & { limite?: number }; respuesta: C.VideosResponse };
  video: { params: { id: string }; respuesta: C.VideoDetalleResponse };
  productos: { params: ParamsRango & { limite?: number }; respuesta: C.ProductosResponse };
  producto: { params: { id: string }; respuesta: C.ProductoDetalleResponse };
  ordenes: { params: ParamsOrdenes; respuesta: C.OrdenesResponse };
  plan: { params: ParamsRango; respuesta: C.PlanResponse };
  avisos: { params: { tienda?: string; solicitud?: string }; respuesta: C.AvisosResponse };
  plantillas: { params: SinParams; respuesta: C.PlantillasResponse };
  preferencias: { params: SinParams; respuesta: C.PreferenciasSincronizadas };
  notas: { params: { entidad?: C.EntidadNota; entidad_id?: string }; respuesta: C.NotasResponse };
  recordatorios: { params: { estado?: 'activo' | 'hecho' | 'cancelado' }; respuesta: C.RecordatoriosResponse };
  sync_historial: { params: { limite?: number }; respuesta: C.SyncHistorialResponse };
  sync_cobertura: { params: SinParams; respuesta: C.CoberturaResponse };
  credenciales: { params: SinParams; respuesta: C.CredencialesEstado };
  lan: { params: SinParams; respuesta: C.LanEstado };
  firewall: { params: SinParams; respuesta: C.DiagnosticoFirewall };
  ajustes_pc: { params: SinParams; respuesta: C.AjustesPc };
  uso_datos: { params: SinParams; respuesta: C.UsoDatosResponse };
  /** rev. 5 · GET /api/display/estado (SOLO la ventana de Windows; Android → ErrorHub('solo_en_pc')). Se actualiza sola
   *  con el evento 'display.cambio' (trae el EstadoDisplay completo: no hay sondeo). */
  display: { params: SinParams; respuesta: C.EstadoDisplay };
}
export type ClaveConsulta = keyof Consultas;
export type ParamsDe<K extends ClaveConsulta> = Consultas[K]['params'];
export type RespuestaDe<K extends ClaveConsulta> = Consultas[K]['respuesta'];
/** hub = respuesta en vivo · copia = armada con la copia sin conexión del celular · demo = fixtures de desarrollo. */
export type FuenteDatos = 'hub' | 'copia' | 'demo';

export interface EstadoConsulta<T> {
  datos: T | undefined;
  /** Primera carga sin datos (mostrar esqueleto). */
  cargando: boolean;
  /** Hay datos y se están pidiendo otra vez (atenuar al 60 %, sin esqueleto). */
  refrescando: boolean;
  error: ErrorHub | null;
  fuente: FuenteDatos;
  /** Solo con fuente 'copia': instante de la copia. */
  copia_at: C.EpochS | null;
  /** Los datos ya incluyen cambios locales que el hub aún no confirma. */
  con_cambios_pendientes: boolean;
  refrescar(): Promise<void>;
}
export interface OpcionesConsulta {
  /** false = no pedir (p. ej. sin id todavía). Por omisión true. */
  activa?: boolean;
}
/**
 * Lee una ruta GET. Se vuelve a pedir sola con 'datos.cambiaron' (Windows: SSE) o 'creatorhub-copia' (Android).
 * Las respuestas con meta_imagenes se registran solas para <Foto>. Las muestras llegan con el avance y los avisos
 * locales pendientes ya superpuestos (dominio.aplicarLocal).
 */
export function useConsulta<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, opciones?: OpcionesConsulta): EstadoConsulta<RespuestaDe<K>>;
/** Igual que useConsulta pero fuera de React (búsqueda global, exportar CSV). */
export function consultar<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>): Promise<RespuestaDe<K>>;
/** Marca como viejas las consultas indicadas (todas si no se pasa ninguna). */
export function invalidar(...claves: ClaveConsulta[]): void;

// ============================================================================ sesión, sincronización y eventos
export function useSesion(): EstadoConsulta<C.SessionResponse>;
export interface EstadoSync {
  estado: C.SyncEstado | null;
  /** false sin capacidad 'sincronizar' o en Android sin la PC. */
  puede: boolean;
  sincronizar(tipo?: C.TipoSync): Promise<void>;
  cancelar(): Promise<void>;
}
export function useSync(): EstadoSync;
/** Windows: SSE /api/events. Android: los eventos que traduce la capa nativa. Se desuscribe al desmontar. */
export function useEventoHub(manejador: (e: C.EventoHub) => void): void;
/** null en Windows y en el navegador. */
export function useConexionPc(): EstadoConexionPc | null;

// ============================================================================ imágenes
/** rev. 3.1 (C47) · Atajos sobre `registroImagenes` de @/dominio (el almacén vive ahí para que <Foto> de @/componentes lo
 *  lea sin importar @/datos). useConsulta registra solo el meta_imagenes de cada respuesta. */
export function useMetaImagen(url: C.UrlImagen | null | undefined): C.ImagenMeta | undefined;
export function registrarMetaImagenes(meta: C.MetaImagenes | undefined): void;

// ============================================================================ listas estables y novedades
export interface ListaEstable<T> {
  items: T[];
  /** Llegó un orden distinto y no se aplicó (01_ux §4.16 "Hay un orden nuevo · Actualizar"). */
  hayOrdenNuevo: boolean;
  aplicarOrdenNuevo(): void;
}
/** Nunca reordena sola la lista visible: conserva el orden y solo actualiza el contenido de cada fila. */
export function useListaEstable<T>(items: T[] | undefined, id: (t: T) => string): ListaEstable<T>;
/** "Nuevo desde tu última visita" (punto azul, 01_ux §3.5). La huella es por equipo (caché local). */
export function useNovedades<T>(seccion: string, items: T[] | undefined, id: (t: T) => string, huella: (t: T) => string): {
  esNuevo(t: T): boolean;
  marcarVistos(): void;
};

// ============================================================================ acciones sobre el estado local
export type EstadoAccion = 'aplicada' | 'en_cola' | 'conflicto' | 'error';
export interface ResultadoAccion<T> {
  /** en_cola = Android sin la PC: se guardó en la cola y se verá aplicada en la interfaz. */
  estado: EstadoAccion;
  /** Lo guardado; en 'conflicto', la versión vigente del hub. */
  objeto: T | null;
  error: ErrorHub | null;
  /** Revierte (crea la op inversa con la rev nueva). Para el "Deshacer" de 6 s. */
  deshacer(): Promise<void>;
}
type SinOpId<U> = U extends unknown ? Omit<U, 'op_id'> : never;
/** Una OpLocal sin op_id: la capa de datos genera el op_id (uuid4). */
export type OpSinId = SinOpId<C.OpLocal>;
export interface ResultadoLote {
  estado: EstadoAccion;
  resultados: C.OpsResultado[];
  deshacer(): Promise<void>;
}
export interface AccionesLocales {
  crearPlan(datos: C.PlanVideoCrear): Promise<ResultadoAccion<C.PlanVideo>>;
  editarPlan(id: string, cambios: C.PlanVideoCambios): Promise<ResultadoAccion<C.PlanVideo>>;
  borrarPlan(id: string, rev: number): Promise<ResultadoAccion<null>>;
  crearAviso(datos: C.AvisoCrear): Promise<ResultadoAccion<C.AvisoTienda>>;
  editarAviso(id: string, cambios: C.AvisoCambios): Promise<ResultadoAccion<C.AvisoTienda>>;
  crearNota(datos: C.NotaCrear): Promise<ResultadoAccion<C.Nota>>;
  editarNota(id: string, cambios: C.NotaCambios): Promise<ResultadoAccion<C.Nota>>;
  borrarNota(id: string, rev: number): Promise<ResultadoAccion<null>>;
  crearRecordatorio(datos: C.RecordatorioCrear): Promise<ResultadoAccion<C.Recordatorio>>;
  editarRecordatorio(id: string, cambios: C.RecordatorioCambios): Promise<ResultadoAccion<C.Recordatorio>>;
  borrarRecordatorio(id: string, rev: number): Promise<ResultadoAccion<null>>;
  editarPlantilla(id: string, cambios: { nombre?: string; cuerpo?: string; rev: number }): Promise<ResultadoAccion<C.PlantillaMensaje>>;
  /** Android sin la PC: error 'necesita_pc' (no existe op de restaurar). */
  restaurarPlantilla(id: string): Promise<ResultadoAccion<C.PlantillaMensaje>>;
  editarPreferencias(cambios: Partial<Omit<C.PreferenciasSincronizadas, 'rev'>> & { rev: number }): Promise<ResultadoAccion<C.PreferenciasSincronizadas>>;
  /** Varias operaciones en orden con UN solo Deshacer ("Crear mi plan", repartir, mover). Windows: POST /api/local/ops. */
  lote(ops: OpSinId[]): Promise<ResultadoLote>;
  /** rev. 3.1 · Ctrl+Z global (01 §3.6): deshace la última acción local de ESTA sesión (pila de 20, válidas 10 min).
   *  false si no había nada que deshacer. ui-marco lo engancha al atajo; el Toast de cada acción usa su propio deshacer(). */
  deshacerUltimo(): Promise<boolean>;
}
export function useAcciones(): AccionesLocales;

// ============================================================================ acciones del hub (no son estado local)
/** Todas fallan con ErrorHub('solo_en_pc') en Android, salvo sincronizar/cancelarSync. */
export interface AccionesHub {
  sincronizar(tipo?: C.TipoSync): Promise<C.SyncIniciarResponse>;
  cancelarSync(): Promise<C.SyncEstado>;
  authLink(abrirNavegador: boolean): Promise<C.AuthLinkResponse>;
  authPortapapeles(): Promise<C.PortapapelesResponse>;
  authCanjear(req: C.AuthCanjearRequest): Promise<C.AuthCanjearResponse>;
  authRefrescar(): Promise<C.AuthEstadoResponse>;
  authDesconectar(req: C.DesconectarRequest): Promise<C.AuthEstadoResponse>;
  importarCredenciales(req: C.ImportarRequest): Promise<C.ImportarResponse>;
  guardarAppSecret(appSecret: string): Promise<C.CredencialesEstado>;
  borrarLegado(): Promise<C.BorrarLegadoResponse>;
  lanActivar(activo: boolean): Promise<C.LanEstado>;
  lanCambiar(cambios: C.LanCambios): Promise<C.LanEstado>;
  lanEmparejar(): Promise<C.EmparejarResponse>;
  lanEstadoEmparejamiento(pairId: string): Promise<C.EmparejamientoEstado>;
  lanDecidir(pairId: string, decision: C.DecisionRequest): Promise<C.EmparejamientoEstado>;
  lanCambiarDispositivo(deviceId: string, cambios: C.DispositivoCambios): Promise<C.Dispositivo>;
  lanRevocar(deviceId: string): Promise<void>;
  firewallDiagnostico(): Promise<C.DiagnosticoFirewall>;
  firewallConfigurar(req: C.FirewallRequest): Promise<C.FirewallResponse>;
  ajustesPc(cambios: C.AjustesPcCambios): Promise<C.AjustesPc>;
  borrarDatos(req: C.BorrarDatosRequest): Promise<void>;
  exportarLocal(): Promise<C.ExportacionLocal>;
  /** rev. 3.1 (C46) · `ruta` = la que devolvió elegirArchivo(); el hub lee y valida el archivo. */
  importarLocal(ruta: string): Promise<C.ImportacionLocalResponse>;
  /** rev. 5 · Display API (métricas de tus videos), solo Windows. PUT /api/display/credenciales: el Client secret viaja
   *  UNA vez al hub y nunca se guarda en la interfaz. Deja el EstadoDisplay nuevo en la consulta 'display'. */
  displayCredenciales(req: C.CredencialesDisplayRequest): Promise<C.EstadoDisplay>;
  /** rev. 5 · POST /api/display/conectar → la URL de autorización (la interfaz la abre con abrirExterno). */
  displayConectar(req?: C.ConectarDisplayRequest): Promise<C.ConectarDisplayResponse>;
  /** rev. 5 · POST /api/display/desconectar. */
  displayDesconectar(req: C.DesconectarDisplayRequest): Promise<C.DesconectarDisplayResponse>;
}
export const hub: AccionesHub;
