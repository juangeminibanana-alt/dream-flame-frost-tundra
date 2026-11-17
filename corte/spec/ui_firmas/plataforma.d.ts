/**
 * FIRMAS NORMATIVAS · módulo `@/plataforma` (lo implementa el paquete ui-base en ui/src/plataforma/).
 * Fuente: spec/BUILD_SPEC.md §8. Ninguna pantalla habla con window.pywebview ni window.CreatorHubAndroid directo:
 * todo pasa por estas funciones. Mientras ui/src/plataforma/index.ts no exista, tsconfig resuelve `@/plataforma`
 * a este archivo (paths con respaldo) y Vite/vitest al doble de ejecución ui/src/_dobles/plataforma (BUILD_SPEC §8.1).
 * rev. 3.1: elegirArchivo / ApiPywebview.elegir_archivo (C46), EstadoConexionPc.sync_en_curso y img_rev en la copia.
 */
import type { EpochS, UrlImagen, OpLocal, OpsResultado } from '@/contrato';

// ============================================================================ detección
export type PlataformaUi = 'windows' | 'android' | 'navegador';
export interface InfoPlataforma {
  plataforma: PlataformaUi;
  /** version.json del build ('1.0.0'); en el navegador de desarrollo, '0.0.0-dev'. */
  version_app: string;
  /** true con window.pywebview (Windows) o window.CreatorHubAndroid (Android). */
  tiene_puente: boolean;
  /** Vite dev con VITE_DEMO=1: datos de ui/fixtures. NUNCA true en `vite build`. */
  modo_demo_navegador: boolean;
}
export function infoPlataforma(): InfoPlataforma;
export function esAndroid(): boolean;
export function esWindows(): boolean;

// ============================================================================ acciones del sistema
/** Abre fuera de la app (Windows: navegador; Android: Intent ACTION_VIEW, lo toma la app de TikTok si existe).
 *  Solo https y hosts permitidos (BUILD_SPEC §6.4). false si se rechazó. */
export function abrirExterno(url: string): Promise<boolean>;
/** Android: abre la app de TikTok (o `urlRespaldo` si no está instalada). Windows/navegador: abre urlRespaldo si viene. */
export function abrirTikTok(urlRespaldo?: string): Promise<boolean>;
export function copiarTexto(texto: string): Promise<boolean>;
export function compartirTexto(texto: string): Promise<boolean>;
export type ResultadoGuardar = 'guardado' | 'compartido' | 'cancelado' | 'error';
/** Windows: diálogo Guardar con la imagen ORIGINAL de la caché del hub. Android: compartir (ContentProvider propio). */
export function guardarImagen(url: UrlImagen, nombreSugerido: string): Promise<ResultadoGuardar>;
/** Windows: diálogo Guardar. Android: compartir el archivo. */
export function guardarArchivo(nombreSugerido: string, mime: 'application/json' | 'text/csv', contenido: string): Promise<ResultadoGuardar>;
/** rev. 3.1 (C46) · Solo Windows: diálogo Abrir nativo (js_api elegir_archivo). Devuelve la RUTA absoluta elegida, que
 *  solo viaja al hub (ImportarRequest.ruta, ImportarLocalRequest.ruta); null si canceló. Android y navegador: null
 *  siempre (la interfaz no muestra el botón: Capacidades.auth = false). */
export function elegirArchivo(titulo: string, filtros: Array<'json'>): Promise<string | null>;
export type TipoVibracion = 'confirmar' | 'tecla' | 'umbral';
/** Android: performHapticFeedback (CONFIRM / KEYBOARD_TAP / CLOCK_TICK). Windows: no hace nada. */
export function vibrar(tipo: TipoVibracion): void;
/** Android: FLAG_KEEP_SCREEN_ON (Sesión de videos). */
export function mantenerPantalla(encendida: boolean): void;
/** Windows: color de la barra de título (DWM). Android: íconos de las barras del sistema. */
export function avisarTemaNativo(modo: 'claro' | 'oscuro'): void;
/** La interfaz pintó su primera vista con datos (Windows `--medir`, Android retira el splash). */
export function avisarInterfazLista(): void;

// ============================================================================ notificaciones locales
export interface NotificacionProgramada {
  /** Estable: 'plan-2026-11-13', 'promesa-<aviso>-<solicitud>', 'vence-<solicitud>-48'… (reprogramar = reemplazar). */
  id: string;
  titulo: string;
  texto: string;
  at: EpochS;
  /** Ruta hash que se abre al tocarla ('#/muestras/sesion'). */
  ruta: string;
}
/** Reemplaza TODO lo programado. Windows: js_api programar_notificaciones (globo de la bandeja). Android: AlarmManager. */
export function programarNotificaciones(lista: NotificacionProgramada[]): Promise<void>;
export type PermisoNotificaciones = 'concedido' | 'denegado' | 'no_aplica';
export function permisoNotificaciones(): Promise<PermisoNotificaciones>;
export function pedirPermisoNotificaciones(): Promise<PermisoNotificaciones>;

// ============================================================================ ciclo de vida
/** Pila de manejadores del botón Atrás (Android). El último registrado decide primero; true = lo consumió. */
export function registrarAtras(manejador: () => boolean): () => void;
/** visibilitychange→visible (todas) + evento nativo creatorhub-reanudar (Android onResume). */
export function alVolverAlFrente(fn: () => void): () => void;
/** Solo Windows (js_api). */
export const ventana: {
  ocultar(): void;
  /** Cierre real (no a la bandeja). */
  cerrarDelTodo(): void;
};

// ============================================================================ Android: la PC emparejada
export interface EstadoConexionPc {
  emparejado: boolean;
  host_id: string | null;
  /** Alias de la PC (LanEstado.nombre_equipo), nunca el nombre de Windows. */
  nombre_equipo: string | null;
  conectado: boolean;
  ip: string | null;
  ultima_copia_at: EpochS | null;
  cambios_pendientes: number;
  permisos: 'lectura' | 'lectura_escritura' | null;
  /** La PC respondió 401 dispositivo_revocado/desconocido: hay que emparejar de nuevo. */
  revocado: boolean;
  /** El hub tiene protocolo mayor ('actualiza_app') o menor ('actualiza_pc'); null si son compatibles. */
  incompatible: 'actualiza_app' | 'actualiza_pc' | null;
  /** rev. 3.1 · La PC está sincronizando con TikTok (CambiosResponse.sync_en_curso): la interfaz muestra
   *  "Tu PC está sincronizando con TikTok ({paso})…" consultando /api/sync/estado cada 1.5 s (01 §4.16, C27). */
  sync_en_curso: boolean;
}
/** En Windows y en el navegador devuelve null. */
export function estadoConexionPc(): EstadoConexionPc | null;
export function alCambiarConexionPc(fn: (e: EstadoConexionPc) => void): () => void;
export interface PcEncontrada { host_id: string; nombre_equipo: string; ip: string; puerto: number }
/** Descubrimiento UDP 39231 (1.5 s). */
export function buscarPcs(): Promise<PcEncontrada[]>;
export type CodigoErrorEmparejamiento =
  | 'qr_invalido' | 'codigo_invalido' | 'pc_no_encontrada' | 'huella_distinta' | 'rechazado' | 'vencido'
  | 'ocupado' | 'red' | 'version_incompatible' | 'cancelado';
export type EventoEmparejamiento =
  | { fase: 'conectando' }
  | { fase: 'verifica'; codigo_verificacion: string }
  | { fase: 'aprobado'; nombre_equipo: string }
  | { fase: 'error'; error: CodigoErrorEmparejamiento; mensaje: string };
/** Devuelve la función para cancelar. `textoQr` = 'creatorhub://pair?v=1&…' (04 §C.4). */
export function emparejarConQr(textoQr: string, alEvento: (e: EventoEmparejamiento) => void): () => void;
/** `codigo` = 12 caracteres Crockford con o sin guiones; `ip` null = usar el descubrimiento. */
export function emparejarConCodigo(codigo: string, ip: string | null, alEvento: (e: EventoEmparejamiento) => void): () => void;
/** Borra credencial, copia, cola de cambios e imágenes del celular. */
export function olvidarPc(): Promise<void>;
/** Copia + envío de la cola ahora mismo. rev. 3.1: si la última sync OK de la PC tiene más de 30 min y el permiso es
 *  lectura_escritura, la capa nativa pide antes POST /lan/v1/api/sync (01 §5.6) y la copia llega al terminar. */
export function actualizarCopiaAhora(): Promise<void>;
/** Enlace creatorhub://pair?… recibido de fuera (Intent) y aún no usado; '' → null. Nunca empareja solo. */
export function consumirEnlacePendiente(): string | null;
export function alEnlace(fn: (url: string) => void): () => void;

// ============================================================================ puentes crudos (los implementan windows-shell y android-app)
/** window.pywebview.api (04 §A.4 + BUILD_SPEC §6.6). Todos devuelven Promesa: SIEMPRE con await. */
export interface ApiPywebview {
  tema(modo: 'claro' | 'oscuro'): Promise<void>;
  abrir_externo(url: string): Promise<boolean>;
  copiar(texto: string): Promise<boolean>;
  notificar(titulo: string, texto: string, ruta: string): Promise<void>;
  /** JSON de NotificacionProgramada[]. */
  programar_notificaciones(lista_json: string): Promise<void>;
  ventana_ocultar(): Promise<void>;
  ventana_cerrar(): Promise<void>;
  /** ruta_img = '/img/p/<id>?v=…' (el shell pide al hub la variante og). */
  guardar_imagen(ruta_img: string, nombre: string): Promise<'guardado' | 'cancelado' | 'error'>;
  guardar_archivo(nombre: string, mime: string, contenido: string): Promise<'guardado' | 'cancelado' | 'error'>;
  /** rev. 3.1 (C46) · create_file_dialog(OPEN_DIALOG); filtros = extensiones sin punto ('json'). null si canceló. */
  elegir_archivo(titulo: string, filtros: string[]): Promise<string | null>;
  lista(): Promise<void>;
}

/** window.CreatorHubAndroid (@JavascriptInterface; 04 §B.5 + BUILD_SPEC §7.4). Solo tipos primitivos y JSON en texto. */
export interface PuenteAndroid {
  version(): string;
  /** JSON {app, sdk, modelo, webview, idioma}. */
  info(): string;
  /** JSON EstadoConexionPc. */
  estadoConexion(): string;
  emparejarQr(texto: string, idPedido: string): void;
  emparejarCodigo(codigo: string, ip: string, idPedido: string): void;
  cancelarEmparejamiento(idPedido: string): void;
  buscarPcs(idPedido: string): void;
  olvidarPc(): boolean;
  actualizarAhora(idPedido: string): void;
  /** JSON OpLocal[] → JSON {aceptadas: number}. Persiste en la cola antes de responder. */
  ops(json: string): string;
  /** JSON OpLocal[] aún no confirmados por el hub (la interfaz los superpone a la copia). */
  opsPendientes(): string;
  /** Peticiones directas que no son ops (POST /api/sync, /api/plantillas/{id}/restaurar). Respuesta: creatorhub-respuesta. */
  peticion(metodo: string, ruta: string, cuerpo: string, idPedido: string): void;
  abrirExterno(url: string): boolean;
  abrirTikTok(urlRespaldo: string): boolean;
  copiar(texto: string): boolean;
  compartir(texto: string): boolean;
  compartirImagen(rutaImg: string, titulo: string): boolean;
  compartirArchivo(nombre: string, mime: string, contenido: string): boolean;
  mantenerPantalla(encendida: boolean): void;
  vibrar(tipo: string): void;
  tema(modo: string): void;
  /** JSON NotificacionProgramada[]. */
  programarRecordatorios(json: string): void;
  /** 'concedido' | 'denegado' | 'no_aplica'. */
  permisoNotificaciones(): string;
  pedirPermisoNotificaciones(idPedido: string): void;
  consumirEnlace(): string;
  lista(): void;
}

/** CustomEvent que la capa nativa de Android despacha en window (detail = este objeto). */
export interface EventosAndroid {
  'creatorhub-emparejamiento': { id: string } & EventoEmparejamiento;
  'creatorhub-descubrimiento': { id: string; pcs: PcEncontrada[] };
  'creatorhub-copia': { data_version: number; local_rev: number; img_rev: number; copia_at: EpochS; sync_en_curso: boolean };
  'creatorhub-ops': { resultados: OpsResultado[]; pendientes: OpLocal[] };
  'creatorhub-respuesta': { id: string; status: number; cuerpo: string };
  'creatorhub-conexion': EstadoConexionPc;
  'creatorhub-enlace': { url: string };
  'creatorhub-reanudar': Record<string, never>;
  'creatorhub-imagenes': { hechas: number; total: number };
  'creatorhub-permiso': { id: string; resultado: PermisoNotificaciones };
  'creatorhub-actualizar': { id: string; ok: boolean };
}
