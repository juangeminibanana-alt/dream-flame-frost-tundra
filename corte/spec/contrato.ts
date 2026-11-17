/**
 * Creator Hub · contrato REST del hub (spec 03_datos_api.md rev. 2, protocolo 1)
 * CONSOLIDADO rev. 3 por spec/BUILD_SPEC.md (12/11/2026): manda sobre 01–04 donde difieran. Agregados de la rev. 3
 * (todos opcionales o tipos nuevos, para no romper los ejemplos verificados): ServidorInfo, eventos ventana.*,
 * FilaVideo.miniatura_origen (oEmbed ya no da miniaturas: portada = foto del producto), tema y reducir_animaciones
 * en preferencias, ProductoDetalleResponse, ExportacionLocal, AjustesPc, UsoDatosResponse, CoberturaResponse,
 * firewall, legado, LanCambios y SnapshotResponse.extras (vistas sin conexión del celular). Ver BUILD_SPEC §4.
 * ERRATA rev. 3.1 (12/11/2026, auditoría del BUILD_SPEC): ObjetoLocal + ErrorRespuesta.error.vigente (409 con la versión
 * vigente), PasoSync 'productos_ventas' y 'ordenes_anteriores' (primera sync con puntos de control, C34), img_rev en
 * datos.cambiaron / CambiosResponse / SnapshotResponse (imágenes versionadas, C45), regla de URL '?v=0' para imágenes
 * aún no descargadas, ImportarLocalRequest {ruta} (selector de archivo nativo, C46) y comentarios de C36–C38.
 * rev. 4 (15/11/2026, ficha completa de producto con la API oficial de afiliados): SOLO agregados opcionales o tipos
 * nuevos — ProductoDetalleResponse.extendido?: ProductoExtendido (galería de vitrina, precio con descuento de la
 * plataforma e inventario, elegibilidad de muestra con sus SKU, solicitudes recuperadas desde su cumplimiento, planes
 * dirigidos, comisión real por tasa, parecidos del marketplace y origen de cada venta) y las imágenes '/img/g/…'
 * (galería) y '/img/m/…' (parecidos). PasoSync NO cambia: las fases nuevas corren dentro de 'productos_ventas'.
 * rev. 5 (15/11/2026, «Display API»: métricas de TUS videos con TikTok for Developers): SOLO agregados opcionales o
 * tipos nuevos — FilaVideo y VideoDeProducto agregan vistas, likes, comentarios, compartidos, portada ('/img/v/…') y
 * conversión por 1,000 vistas (ausentes si nunca se conectó la Display API; null si el video no está en ella),
 * VideoDetalleResponse.tendencia?, DashboardResponse.perfil_tiktok?, EstadoDisplay y las rutas LOCALES /api/display/*,
 * el evento 'display.cambio' y el callback GET /oauth/tiktok. PasoSync NO cambia: el paso «videos_tiktok» corre dentro
 * de 'videos'.
 *
 * Fuente de verdad de los tipos que intercambian el hub (Python, Windows) y la interfaz
 * (React + TypeScript, compartida por Windows y Android). El frontend la importa tal cual:
 *   import type { DashboardResponse } from '@/contrato';
 *
 * Convenciones (no negociables):
 *  - Claves JSON en español, snake_case.
 *  - Dinero: enteros en CENTAVOS MXN, sufijo `_centavos`. Nunca float.
 *  - Tasas de comisión: puntos base, sufijo `_bp` (800 = 8 %). Proporciones 0..1 sin sufijo (`participacion`).
 *  - Instantes: epoch UTC en segundos, sufijo `_at`. Fechas de calendario: 'YYYY-MM-DD' en hora de México.
 *  - Imágenes: URL relativa servida por el hub desde su caché, ya versionada: '/img/p/<id>?v=<ver>'.
 *    rev. 3.1 (C45): '?v=<8 hex>' SOLO si la imagen ya está descargada (imagenes.estado = 'ok'); entonces trae su entrada
 *    en meta_imagenes. Si el hub conoce la URL de origen pero aún no la descarga: '?v=0' (sin meta_imagenes; el hub la
 *    baja en el momento con tope de 5 s y responde 'no-cache'). Sin URL de origen: null (la interfaz pinta el mosaico).
 *    Cuando termina un lote de descargas sube img_rev y publica datos.cambiaron: la interfaz vuelve a pedir y recibe '?v=<ver>'.
 *    Variantes por ancho: agregar '&t=xs' (96 px), '&t=sm' (240 px), '&t=md' (720 px) u omitir (original).
 *    '/img/v/*' quedó reservado hasta la rev. 4 (oEmbed ya no entrega miniaturas, CONTEXTO 12/11 14:45).
 *    rev. 5 (15/11): '/img/v/<content_id>?v=…' = portada REAL del video (cover_image_url de la Display API, que caduca en
 *    ~6 h: el hub la baja y la cachea en cuanto la sync la conoce). Misma regla C45; sin portada conocida: 404.
 *    rev. 4 (15/11): '/img/g/<product_id>-<n>?v=…' = foto n (0–11) de la galería de tu vitrina y '/img/m/<product_id>?v=…'
 *    = foto de un producto parecido del marketplace. Misma regla C45; se descargan solo cuando la interfaz las pide.
 *  - Errores: HTTP 4xx/5xx con cuerpo ErrorRespuesta. Éxito: el objeto directamente (sin envoltorio).
 *  - Todas las rutas son relativas al origen de la interfaz. En Windows: http://127.0.0.1:39229 (spec 04 §1).
 *    En Android, la capa nativa intercepta '/api/*' e '/img/*' y los reenvía firmados (CH1) al hub por LAN
 *    con HTTPS y certificado fijado por huella ('https://<ip>:39230/lan/v1/api/*', '/lan/v1/img/*') o responde
 *    desde la copia sin conexión.
 *  - Comisión: el número principal es `Kpis.comision_total_centavos` = liquidada (actual_commission de SETTLED) +
 *    por liquidar (estimada de To-SETTLE / AWAITING PAYMENT) + retenida (estimada de FROZEN). UNSPECIFIED no suma
 *    (01_ux §2.8: se cuenta y se avisa). Línea válida = SETTLED, To-SETTLE o AWAITING PAYMENT (01_ux §6.0). Las filas
 *    (tiendas, videos, productos, series) siguen en `comision_estimada_centavos` = Σ estimada de líneas válidas.
 *
 * Verificado con tsc --strict contra ejemplos reales: spec/verificacion/ejemplos/*.json (v05, desde la base de la sync)
 * y spec/verificacion/ejemplos_ux/ejemplos_ux.check.ts (v07_contrato_ux, desde los JSON crudos).
 *
 * Campos que ve el usuario alineados con spec/01_ux.md v1.1 (12/11/2026): grupo de muestra (§2.2), etapas de
 * "Tu avance" (§2.4), promesas y avisos (§2.5, §7.2), prioridad con nombre y razones (§2.6), salud con nombre
 * (§2.7), precio de venta ≈ y comisión por venta mínima (§6.0), detalle de línea (§4.11). `clase`/`subestado`
 * siguen siendo la clasificación interna del hub (03 §4.3); `grupo` y `motivo` son función pura del subestado.
 * El hub los produce con spec/verificacion/analitica_ref.py (prototipo de hub/analitica.py), que v05 compara contra
 * spec/verificacion/ux_reglas.py (referencia de 01) sobre el conjunto de datos privado de desarrollo (no se publica).
 */

// ============================================================================ primitivos
export type EpochS = number;
/** 'YYYY-MM-DD' en America/Mexico_City (UTC-6 fijo). */
export type FechaLocal = string;
export type Centavos = number;
export type PuntosBase = number;
/** URL relativa al hub, p. ej. '/img/p/1731250336559629401?v=3f2a91c0'. */
export type UrlImagen = string;
/**
 * Metadatos visuales de una imagen de la caché (02_visual.md §8.2–8.3): la interfaz pinta el pozo con `color` y el
 * `lqip` ampliado antes de que llegue la foto. Columnas `imagenes.lqip` e `imagenes.color` (03 §2.3).
 */
export interface ImagenMeta {
  /** Ancho y alto del original, en px. */
  w: number;
  h: number;
  /** WebP de 16 px de ancho como data URI base64 (≤ 600 B); null mientras no se genera. */
  lqip: string | null;
  /** Color dominante '#rrggbb' (promedio de 8×8); null mientras no se genera. */
  color: string | null;
}
/** Tabla lateral OPCIONAL: la misma URL que traen los campos imagen / miniatura / avatar → sus metadatos. */
export type MetaImagenes = Record<UrlImagen, ImagenMeta>;
export type Plataforma = 'windows' | 'android';
export type ModoHub = 'real' | 'demo';

export interface Paginado<T> {
  items: T[];
  total: number;
  pagina: number;       // 1-based
  por_pagina: number;   // máx. 200
  data_version: number;
}

// ============================================================================ errores
export type CodigoError =
  | 'no_encontrado' | 'parametros_invalidos' | 'cuerpo_demasiado_grande'
  | 'sesion_invalida' | 'prohibido' | 'solo_local' | 'conflicto' | 'demasiadas_solicitudes'
  | 'sin_credenciales' | 'reautorizar' | 'sin_permiso_tiktok' | 'tiktok_no_disponible' | 'sin_internet'
  | 'state_invalido' | 'codigo_vencido' | 'cuenta_distinta' | 'no_es_creador'
  | 'archivo_no_encontrado' | 'archivo_invalido' | 'app_secret_invalido'
  | 'firma_invalida' | 'reloj_desfasado' | 'repetida' | 'dispositivo_revocado' | 'dispositivo_desconocido'
  | 'emparejamiento_vencido' | 'emparejamiento_rechazado' | 'emparejamiento_ocupado'
  | 'base_de_version_nueva'
  | 'error_interno';

export interface ErrorRespuesta {
  error: {
    codigo: CodigoError;
    /** Texto listo para mostrar, español de México, sin jerga. */
    mensaje: string;
    /** Nunca trae texto de excepciones ni secretos (pasa por limpiar()). En 500: { ref: '<id del registro>' }. */
    detalle?: Record<string, string | number | boolean | null>;
    /** Para 429 / 503: segundos sugeridos antes de reintentar (también va en Retry-After). */
    reintentar_en_s?: number;
    /** rev. 3.1 · Solo con codigo = 'conflicto' (409 por `rev` viejo en PATCH/DELETE/PUT del estado local): la versión
     *  vigente en el hub, para el mensaje de C26 ("Conservamos el cambio de tu PC") y para reintentar con su `rev`. */
    vigente?: ObjetoLocal;
  };
}

// ============================================================================ salud y sesión
/** GET /api/health — sin sesión (útil para que pywebview sepa que el hub arrancó). */
export interface HealthResponse {
  ok: true;
  version: string;
  protocolo: 1;
  modo: ModoHub;
  hora_servidor: EpochS;
  uptime_s: number;
  db_ok: boolean;
}

export type EstadoConexion = 'sin_credenciales' | 'sin_autorizar' | 'conectada' | 'reautorizar' | 'cuenta_sin_region';
export type OrigenCredenciales = 'importado' | 'oauth' | 'manual' | 'demo';

export interface Cuenta {
  username: string;
  avatar: UrlImagen | null;
  region: string;            // selection_region, 'MX'
  permisos: string[];        // LIVE_STREAM_PERMISSION, ADD_AFFILIATE_PERMISSION, ...
}

export interface Conexion {
  estado: EstadoConexion;
  access_expira_at: EpochS | null;
  refresh_expira_at: EpochS | null;
  scopes: string[];
  scopes_faltantes: string[];
  /** Aviso para la interfaz, p. ej. 'Tu conexión con TikTok vence en 5 días. Vuelve a conectar.' */
  aviso: string | null;
  origen: OrigenCredenciales | null;
}

export interface Capacidades {
  auth: boolean;           // puede conectar/desconectar TikTok (solo Windows)
  lan_admin: boolean;      // puede emparejar/revocar teléfonos (solo Windows)
  portapapeles: boolean;   // detectar URL de autorización en el portapapeles (solo Windows)
  escribir: boolean;       // puede crear notas/plan/recordatorios (Android: según permisos del dispositivo)
  sincronizar: boolean;    // puede disparar /api/sync
}

/** GET /api/session */
export interface SessionResponse {
  cuenta: Cuenta | null;
  conexion: Conexion;
  sync: SyncEstado;
  datos: { data_version: number; local_rev: number; ultima_sync_ok_at: EpochS | null; hay_datos: boolean };
  plataforma: Plataforma;
  modo: ModoHub;
  capacidades: Capacidades;
  /** Solo en Windows (UI local). */
  lan?: LanResumen;
  /** rev. 3 · Solo en Windows: versión y puerto real de la interfaz ("Acerca de", 04 §1). El hub siempre lo envía. */
  servidor?: ServidorInfo;
}

/** rev. 3 · Puerto real de la interfaz local; respaldo = true si 39229 estaba ocupado (el origen cambió). */
export interface ServidorInfo { version: string; puerto_ui: number; puerto_respaldo: boolean }

// ============================================================================ sincronización
export type TipoSync = 'incremental' | 'completa';
export type OrigenSync = 'auto' | 'usuario' | 'arranque' | 'telefono' | 'demo';
/**
 * rev. 3.1 · Orden fijo de ejecución (BUILD_SPEC C34, manda sobre 03 §4.1):
 *   perfil → muestras → cumplimientos → productos (de las muestras) → [punto de control 1: clasificación parcial,
 *   data_version += 1, datos.cambiaron] → ordenes (recientes: 180 días, 26 ventanas semanales, de la más reciente a la más
 *   antigua) → [punto de control 2] → vitrina → detalles → ordenes_anteriores (el resto hasta 400 días, 32 ventanas; en
 *   incremental: 'omitido') → productos_ventas (fichas de productos de tus ventas) → videos (portadas, sin red) → imagenes
 *   → clasificacion (final).
 * 'productos' y 'ordenes' conservan su nombre para que los ejemplos verificados sigan pasando.
 */
export type PasoSync =
  | 'perfil' | 'muestras' | 'cumplimientos' | 'detalles' | 'ordenes' | 'productos'
  | 'vitrina' | 'videos' | 'imagenes' | 'clasificacion'
  | 'productos_ventas' | 'ordenes_anteriores';
export type EstadoPaso = 'pendiente' | 'en_curso' | 'ok' | 'parcial' | 'error' | 'omitido';
export type EstadoEjecucion = 'en_curso' | 'ok' | 'parcial' | 'error' | 'cancelada';

export interface SyncPaso {
  paso: PasoSync;
  estado: EstadoPaso;
  hechos: number;
  total: number | null;
  nuevos: number;
  cambiados: number;
  error: { codigo: string; mensaje: string } | null;
}

export interface SyncEstado {
  en_curso: boolean;
  sync_id: number | null;
  tipo: TipoSync | null;
  origen: OrigenSync | null;
  /** 0..1, ponderado por paso (órdenes pesa más). */
  progreso: number;
  paso_actual: PasoSync | null;
  /** Texto humano: 'Tus ventas recientes: semana 5 de 26…' · 'Ventas anteriores: semana 3 de 32…' (rev. 3.1, C34). */
  texto: string;
  pasos: SyncPaso[];
  iniciada_at: EpochS | null;
  ultima_ok_at: EpochS | null;
  ultima_estado: Exclude<EstadoEjecucion, 'en_curso'> | null;
  proxima_auto_at: EpochS | null;
  /** codigo: sin_internet | reautorizar | renovacion_pendiente | token_rechazado | credenciales_cambiaron |
   *  interrumpida | cuenta_sin_region | <código de TikTok>. `en_curso` se calcula en memoria, nunca de la tabla. */
  ultimo_error: { codigo: string; mensaje: string; at: EpochS } | null;
}

/** POST /api/sync */
export interface SyncIniciarRequest { tipo?: TipoSync }
/** 202 Accepted (también si ya había una en curso: ya_en_curso = true, mismo sync_id). */
export interface SyncIniciarResponse { sync_id: number; ya_en_curso: boolean; estado: SyncEstado }

export interface SyncHistorialItem {
  sync_id: number;
  tipo: TipoSync | 'reparacion';
  origen: OrigenSync;
  estado: EstadoEjecucion;
  iniciada_at: EpochS;
  terminada_at: EpochS | null;
  duracion_s: number | null;
  llamadas_api: number;
  reintentos: number;
  cambios: number;
  resumen: Partial<Record<PasoSync, { nuevos: number; cambiados: number; hechos: number }>>;
  error: { codigo: string; mensaje: string } | null;
}
/** GET /api/sync/historial?limite=20 */
export interface SyncHistorialResponse { items: SyncHistorialItem[] }

/** Mensajes del canal GET /api/events (text/event-stream). `event:` = tipo, `data:` = JSON. */
export type EventoHub =
  | { tipo: 'sync.progreso'; estado: SyncEstado }
  | { tipo: 'sync.fin'; estado: SyncEstado }
  /** rev. 3.1 · img_rev sube cuando termina un lote de descargas de imágenes (C45). Opcional en el tipo; el hub siempre lo envía. */
  | { tipo: 'datos.cambiaron'; data_version: number; local_rev: number; secciones: Seccion[]; img_rev?: number }
  | { tipo: 'conexion.cambio'; conexion: Conexion }
  | { tipo: 'emparejamiento.solicitud'; pair_id: string; dispositivo: string; codigo_verificacion: string; expira_at: EpochS }
  | { tipo: 'emparejamiento.fin'; pair_id: string; resultado: 'aprobado' | 'rechazado' | 'expirado' }
  | { tipo: 'recordatorio.vencido'; recordatorio: Recordatorio }
  /** rev. 3 · Primera vez que se cierra la ventana sin preferencia: la interfaz pregunta "¿Mantener Corte en segundo plano?". */
  | { tipo: 'ventana.preguntar_cierre' }
  /** rev. 3 · Clic en una notificación o en la bandeja: la interfaz navega a esa ruta hash ('#/muestras', …). */
  | { tipo: 'ventana.mostrar_ruta'; ruta: string }
  /** rev. 5 · Solo la ventana de Windows: cambió la conexión de la Display API (credenciales, conexión, desconexión,
   *  vencimiento o fin de su paso en la sync). Trae el EstadoDisplay completo: la interfaz no necesita sondear. */
  | { tipo: 'display.cambio'; display: EstadoDisplay }
  | { tipo: 'ping'; t: EpochS };
export type Seccion = 'muestras' | 'ordenes' | 'productos' | 'tiendas' | 'videos' | 'cuenta' | 'local';

/**
 * GET /api/cambios?data_version=N&local_rev=M&img_rev=K&espera_s=25 — long-poll (lo hace la capa nativa de Android, C27).
 * 200 en cuanto algo cambie (o de inmediato si ya es distinto); 204 sin cuerpo al agotar la espera.
 * rev. 3.1 · img_rev (C45): opcional en el tipo y en la query (sin ella no se compara); el hub siempre lo envía.
 */
export interface CambiosResponse { data_version: number; local_rev: number; secciones: Seccion[]; sync_en_curso: boolean; img_rev?: number }

/** POST /api/sistema/abrir — abre un enlace externo en el navegador del sistema (solo dominios permitidos). */
export interface AbrirEnlaceRequest { url: string }

/**
 * POST /api/datos/borrar (solo Windows) — 'tiktok' borra lo descargado (conserva plan, avisos y notas); 'todo' borra
 * además plan, avisos, notas, plantillas, celulares, la autorización Y la clave de la app (01_ux.md §4.14 G).
 */
export interface BorrarDatosRequest { alcance: 'tiktok' | 'todo' | 'imagenes'; confirmacion: 'BORRAR' }

// ============================================================================ autorización con TikTok (solo Windows)
/** POST /api/auth/link — rev. 3.1 (C37): el `state` vive 10 min (01 §5.4 manda sobre los 30 de 03 §2.2), un solo uso. */
export interface AuthLinkRequest { abrir_navegador?: boolean }
export interface AuthLinkResponse { url: string; state: string; expira_at: EpochS; abierto: boolean }

/** POST /api/auth/canjear — pegar la URL completa '...web.app/?code=...&state=...' o solo el code. */
export interface AuthCanjearRequest {
  url_o_codigo?: string;
  desde_portapapeles?: boolean;
  /** Requerido (true) si el code pertenece a OTRA cuenta de TikTok: se borran los datos de la anterior. */
  confirmar_cambio_cuenta?: boolean;
}
export interface AuthCanjearResponse {
  ok: true;
  conexion: Conexion;
  cuenta: Cuenta | null;
  cuenta_cambio: boolean;
  /** true en la PRIMERA conexión: la interfaz muestra username y avatar ("¿Eres tú?") y solo si el usuario confirma
   *  llama POST /api/sync {tipo:'completa'}; si no, POST /api/auth/desconectar {borrar_datos:true}. El canje no sincroniza. */
  confirmar_cuenta: boolean;
  avisos: string[];
}

/** GET /api/auth/portapapeles — nunca devuelve el code, solo si hay algo canjeable. */
export interface PortapapelesResponse { detectado: boolean; vista_previa: string | null; state_coincide: boolean | null }

/** POST /api/auth/refrescar · POST /api/auth/desconectar */
export interface AuthEstadoResponse { conexion: Conexion }
/** Desconectar borra SOLO la autorización (tokens); la clave de la app se conserva para poder volver a conectar. */
export interface DesconectarRequest { borrar_datos?: boolean }

// ============================================================================ credenciales (solo Windows)
export interface CredencialesEstado {
  app_key: string;
  app_secret_configurado: boolean;
  tokens_configurados: boolean;
  origen: OrigenCredenciales | null;
  legado: { disponible: boolean; ruta: string; ya_importado_at: EpochS | null };
}
/** POST /api/credenciales/importar — `ruta` omitida = el archivo anterior conocido (CredencialesEstado.legado.ruta);
 *  rev. 3.1: si viene, es la ruta absoluta que devolvió el selector nativo (`elegirArchivo`, C46). El hub valida (local,
 *  sin UNC, archivo regular, .json, ≤ 1 MB) y lee; nunca devuelve el contenido. */
export interface ImportarRequest { ruta?: string; verificar?: boolean }
export interface ImportarResponse {
  importado: { app_secret: boolean; access_token: boolean; refresh_token: boolean; scopes: number };
  conexion: Conexion;
  verificacion: 'ok' | 'fallo' | 'omitida';
  aviso_archivo_original: string;
}
/** PUT /api/credenciales/app-secret */
export interface AppSecretRequest { app_secret: string }

// ============================================================================ dominio: muestras
export type ClaseMuestra = 'debe_video' | 'entregada' | 'exenta' | 'cancelada' | 'nunca_enviada' | 'pendiente_abierta';
export type SubestadoMuestra =
  | 'vencida_sin_video' | 'video_no_cumplio' | 'video_borrado'
  | 'video_aprobado'
  | 'exenta_por_tiktok'
  | 'tienda_no_envio' | 'cancelada_sin_detalle' | 'cumplimiento_cancelado'
  | 'rechazada' | 'retirada' | 'cancelada_antes_de_enviar' | 'sin_respuesta'
  | 'esperando_aprobacion' | 'por_enviar' | 'en_camino' | 'por_grabar' | 'video_en_revision' | 'pausada'
  /** estado_api POST_FAILED (borraste el video) pero el cumplimiento sigue PENDING: todavía hay plazo. */
  | 'video_borrado_con_plazo'
  /** UNKNOWN sin pedido de muestra y solicitada hace < 30 días: "La tienda todavía no responde". */
  | 'esperando_respuesta'
  /** UNKNOWN con pedido de muestra y sin cumplimiento: "Aprobada: esperando el envío". */
  | 'aprobada_esperando_envio';

/** Grupo que ve el usuario (01_ux.md §2.2). Recibida = hay cumplimiento o el grupo es uno de los 6 primeros. */
export type GrupoMuestra =
  | 'entregada' | 'exenta' | 'en_revision' | 'por_vencer' | 'pausada' | 'vencida'
  | 'esperando_aprobacion' | 'en_camino' | 'pedido_cancelado' | 'sin_envio';
/** Etapas de "Tu avance" (01_ux.md §2.4). 'programada' es opcional (preferencia programo_mis_videos). */
export type EtapaAvance = 'por_planear' | 'planeada' | 'video_listo' | 'programada' | 'publicada' | 'no_se_puede';
export type MotivoNoSePuede = 'agotado' | 'desactivado' | 'no_llego' | 'incompleta' | 'no_va_con_mi_contenido' | 'otro';
/** 'video_previo' = video anterior a la muestra: NO cambia la etapa ni cuenta como publicado (01_ux.md §2.4 regla 4). */
export type VinculoOrigen = 'manual' | 'sugerido_por_ventas' | 'confirmado_por_tiktok' | 'video_previo' | 'video_previo_aceptado';
/** Salud de la relación con la tienda (01_ux.md §2.7): semáforo con nombre, nunca un puntaje. */
export type SaludTienda =
  | 'socio_con_pendientes' | 'con_pendientes' | 'con_plan' | 'socio' | 'al_dia'
  | 'vende_contigo' | 'solo_solicitudes' | 'solo_reembolsos';
/** Prioridad sugerida (01_ux.md §2.6). Las reglas usan la comisión por venta MÍNIMA. */
export type NivelPrioridad = 'urgente' | 'alta' | 'media' | 'baja' | 'no_se_puede_etiquetar';
/** Razones (chips) en orden de preferencia; la interfaz muestra las 2 primeras. */
export type RazonPrioridad =
  | 'promesa' | 'posible_video' | 'ya_vendes_con_esta_tienda' | 'ya_lo_vendes' | 'buena_comision'
  | 'muy_vendido' | 'se_vende_bien' | 'paquete' | 'tuvo_pausa';
/** Tarjeta "Ventas de este producto" (01_ux.md §4.3): A sugerir vínculo · B video previo (sin vínculo) · C sin fecha de solicitud. */
export type TarjetaVideo = 'posible_video' | 'video_previo' | 'sin_fecha';
/** De dónde sale el precio que se muestra (01_ux.md §6.0), en orden de preferencia. */
export type FuentePrecio = 'variante' | 'vitrina' | 'comision' | 'lista';

export interface ProductoResumen {
  product_id: string;
  titulo: string | null;
  /** Sin prefijos promocionales ('【Buen Fin】'), máx. 60 caracteres. */
  titulo_corto: string | null;
  imagen: UrlImagen | null;
  enlace: string | null;
  /** original_price: precio de LISTA (sobrestima; solo se muestra rotulado "precio de lista"). */
  precio_min_centavos: Centavos | null;
  precio_max_centavos: Centavos | null;
  /** Precio que se muestra con "≈": samples/labels (variante) → vitrina → commission.amount ÷ tasa → lista. */
  precio_venta_min_centavos: Centavos | null;
  precio_venta_max_centavos: Centavos | null;
  precio_fuente: FuentePrecio | null;
  comision_bp: PuntosBase | null;
  /** MÍNIMO de commission.amount (umbrales y prioridad usan este). Respaldo: precio de lista mín × tasa. */
  comision_por_venta_centavos: Centavos | null;
  /** Máximo de commission.amount (la interfaz muestra el rango si es distinto del mínimo). */
  comision_por_venta_max_centavos: Centavos | null;
  /** units_sold global del producto en TikTok Shop (no son tus ventas). */
  unidades_vendidas_global: number | null;
  en_colaboracion_abierta: boolean;
  /** true/false si se sincronizó la vitrina (showcases/products); null si no se sabe. */
  en_vitrina: boolean | null;
  categoria: string | null;
}

/** "Tu avance" de una muestra (01_ux.md §2.4), derivado del PlanVideo con ese application_id. */
export interface AvanceMuestra {
  /** PlanVideo que guarda el avance; null = 'por_planear' sin registro local. */
  plan_id: string | null;
  etapa: EtapaAvance;
  fecha_planeada: FechaLocal | null;
  programada_para_at: EpochS | null;
  fecha_publicada: FechaLocal | null;
  content_id: string | null;
  vinculo_origen: VinculoOrigen | null;
  fijada: boolean;
  rev: number;
}

/** Promesas y avisos de una muestra (01_ux.md §2.5). */
export interface ResumenAvisosMuestra {
  /** Fecha prometida vigente: la del aviso más reciente marcado como enviado (no quitado) que incluye la muestra. */
  promesa: FechaLocal | null;
  /** Hoy > promesa y etapa ≠ publicada. */
  promesa_vencida: boolean;
  /** Aviso copiado y no confirmado, de menos de 7 días. */
  copiado_sin_confirmar: { aviso_id: string; copiado_at: EpochS } | null;
  ultimo_enviado_at: EpochS | null;
}

export interface MuestraVista {
  application_id: string;
  grupo: GrupoMuestra;
  /** Texto del motivo del grupo: 'Vencida sin video', 'La tienda no la envió a tiempo', 'Sin pedido de muestra', ... */
  motivo: string;
  /** Clasificación interna del hub (03); la interfaz usa `grupo`. */
  clase: ClaseMuestra;
  subestado: SubestadoMuestra;
  etiqueta: string;
  estado_api: string;
  cumplimiento: string | null;
  tipo: string;                       // FREE_SAMPLE | SAMPLE_COUPON | ...
  variante: string | null;
  solicitada_at: EpochS | null;
  /** Solo en cumplimientos PENDING/ONGOING (01_ux.md §2.3). En cerrados y en SUSPEND, SIEMPRE null. */
  fecha_limite_at: EpochS | null;
  dias_restantes: number | null;
  /** Hay cumplimiento o el grupo implica recepción. main_order_id por sí solo NO cuenta (se genera al aprobar). */
  recibida: boolean;
  /** Filtros NO comodín de sample_applications/search que la devolvieron (p. ej. 'SELLER_NOT_SHIP_CANCELLED'). */
  filtros_que_la_devolvieron: string[];
  producto: ProductoResumen;
  tienda: { tienda_key: string; nombre: string; shop_id: string | null; salud: SaludTienda; es_socio: boolean };
  /** Solo en pendientes (grupo por_vencer, vencida o pausada); null en las demás. */
  prioridad: NivelPrioridad | null;
  razones: RazonPrioridad[];
  /** Posición 1-based en la cola sugerida de pendientes (ordinal, no puntaje); null fuera de la cola. */
  posicion_cola: number | null;
  tarjeta_video: TarjetaVideo | null;
  avance: AvanceMuestra;
  avisos: ResumenAvisosMuestra;
  ventas_producto: { pedidos_validos: number; comision_estimada_centavos: Centavos; videos: number };
}

export type OrdenMuestras = 'prioridad' | 'solicitud_asc' | 'solicitud_desc' | 'valor_desc' | 'tienda';
/** GET /api/muestras?grupo=vencida,por_vencer&tienda=<key>&q=texto&orden=prioridad&recibidas=1 */
export interface MuestrasResponse {
  /** 02_visual §8.2: LQIP y color de las imágenes de esta respuesta. */
  meta_imagenes?: MetaImagenes;
  items: MuestraVista[];
  total: number;
  conteos: Record<ClaseMuestra, number>;
  por_grupo: Record<GrupoMuestra, number>;
  data_version: number;
}

export interface CambioHistorial { campo: 'estado_api' | 'cumplimiento' | 'clase'; antes: string | null; despues: string | null; at: EpochS }
export interface VideoDeProducto {
  content_id: string;
  miniatura: UrlImagen | null;
  enlace: string;
  primera_venta: FechaLocal;
  comision_estimada_centavos: Centavos;
  /** rev. 5 · Display API (ver FilaVideo): AUSENTES si nunca se conectó; null si el video no está en ella. */
  vistas?: number | null;
  likes?: number | null;
  comentarios?: number | null;
  compartidos?: number | null;
  portada?: UrlImagen | null;
  /** rev. 5 · Pedidos válidos de ESTE producto en el video ÷ vistas del video × 1,000 (2 decimales); null sin vistas. */
  pedidos_por_mil_vistas?: number | null;
  /** rev. 5 · comision_estimada_centavos de esta fila ÷ vistas del video × 1,000 (entero, centavos); null sin vistas. */
  comision_por_mil_vistas_centavos?: Centavos | null;
}
/** GET /api/muestras/{application_id} */
export interface MuestraDetalleResponse {
  meta_imagenes?: MetaImagenes;
  muestra: MuestraVista;
  historial: CambioHistorial[];
  notas: Nota[];
  planes: PlanVideo[];
  recordatorios: Recordatorio[];
  avisos: AvisoTienda[];
  /** Id de la plantilla recomendada (01_ux.md §4.8); la interfaz resuelve las variables con PlantillaMensaje. */
  plantilla_sugerida: string;
  /** Videos que venden este producto, el más reciente primero (tarjetas A/B/C y "Elegir de mis videos"). */
  videos_del_producto: VideoDeProducto[];
  otras_de_la_tienda: Array<Pick<MuestraVista, 'application_id' | 'grupo' | 'etiqueta' | 'producto'>>;
}

// ============================================================================ dominio: ventas y analítica
/** 'NO_DEVUELTA' es local: la orden estaba en la base y TikTok dejó de devolverla al bajar COMPLETA su ventana
 *  (p. ej. un pedido sin pagar que se canceló). Es final y no cuenta como válida. */
export type EstadoOrden = 'SETTLED' | 'REFUNDED' | 'To-SETTLE' | 'AWAITING PAYMENT' | 'FROZEN' | 'UNSPECIFIED' | 'NO_DEVUELTA';

export interface Kpis {
  pedidos: number;
  pedidos_reembolsados: number;
  pedidos_validos: number;
  /** pedidos_reembolsados / pedidos (0..1). */
  tasa_reembolso: number;
  /** Σ max(0, cantidad − max(reembolsadas, devueltas)) en líneas válidas (misma base que ventas). */
  unidades: number;
  /** Σ precio × unidades netas en líneas válidas. */
  ventas_centavos: Centavos;
  /** NÚMERO PRINCIPAL: liquidada + por liquidar + retenida. */
  comision_total_centavos: Centavos;
  /** Lo que TikTok estima en líneas válidas (informativo; en SETTLED la final es la real). */
  comision_estimada_centavos: Centavos;
  /** actual_commission de SETTLED, de pedidos CREADOS en el periodo (no es "lo que te pagaron en el periodo"). */
  comision_liquidada_centavos: Centavos;
  /** Estimada de To-SETTLE + AWAITING PAYMENT (UNSPECIFIED no cuenta: alerta 'sin_estado'). */
  comision_por_liquidar_centavos: Centavos;
  /** Estimada de FROZEN. */
  comision_retenida_centavos: Centavos;
  comision_perdida_reembolsos_centavos: Centavos;
  ticket_promedio_centavos: Centavos | null;
  /** comision_total / Σ base (estimated_commission_base; si falta, precio × unidades netas). 0..1. */
  tasa_comision_efectiva: number | null;
  videos_con_venta: number;
  tiendas_con_venta: number;
  productos_con_venta: number;
}

export type Granularidad = 'dia' | 'semana' | 'mes';
export interface PuntoSerie {
  /** 'YYYY-MM-DD' (día o lunes de la semana) o 'YYYY-MM'. */
  clave: string;
  /** 'nov 26', 'sem 10 nov', '12 nov'. */
  etiqueta: string;
  pedidos: number;
  pedidos_reembolsados: number;
  unidades: number;
  ventas_centavos: Centavos;
  comision_estimada_centavos: Centavos;
  comision_liquidada_centavos: Centavos;
}
/** GET /api/analitica/serie?granularidad=mes&desde=2026-02-01&hasta=2026-11-30 */
export interface SerieResponse { granularidad: Granularidad; desde: FechaLocal; hasta: FechaLocal; puntos: PuntoSerie[] }

export interface FilaTienda {
  tienda_key: string;
  nombre: string;
  shop_id: string | null;
  /** Imagen del producto más relevante de la tienda (la API no da logotipos). */
  imagen: UrlImagen | null;
  /** Semáforo con nombre (01_ux.md §2.7). */
  salud: SaludTienda;
  /** "Por qué" listo para mostrar: '2 muestras sin video · 40 % de tu comisión en 90 días'. */
  salud_porque: string;
  /** ≥ $1,000 o ≥ 5 % de tu comisión en los últimos 90 días. */
  es_socio: boolean;
  /** Tiene pendientes que no aparecen en ningún aviso enviado. */
  por_avisar: boolean;
  promesas: { vigentes: number; vencidas: number; cumplidas: number };
  /** debidas = vencidas según TikTok · pendientes = 01_ux §2.5 · debidas_con_plan = pendientes con etapa ≥ Planeada ·
   *  abiertas = clase pendiente_abierta · canceladas = clase cancelada · nunca_enviadas = clase nunca_enviada · sin_envio = grupo. */
  muestras: {
    recibidas: number; pendientes: number; entregadas: number; debidas: number; debidas_con_plan: number; exentas: number;
    abiertas: number; canceladas: number; nunca_enviadas: number; sin_envio: number;
    /** Σ precio de venta MÍNIMO (≈) de las pendientes. */
    valor_debido_centavos: Centavos;
    /** Σ precio de venta mínimo / máximo (≈) de las recibidas. */
    valor_recibido_min_centavos: Centavos;
    valor_recibido_max_centavos: Centavos;
  };
  ventas: {
    pedidos_validos: number;
    comision_estimada_centavos: Centavos;
    /** Parte de tu comisión total del periodo pedido (0..1). */
    participacion: number;
    /** Parte de tu comisión de los últimos 90 días (0..1), para la columna "% 90 d" y la regla de socio. */
    participacion_90d: number;
    /** Comisión de los últimos 180 días (orden de la cola y razón 'ya_vendes_con_esta_tienda'). */
    comision_180d_centavos: Centavos;
    /** Última línea VÁLIDA (no reembolsada). */
    ultima_venta_at: EpochS | null;
  };
}
/** GET /api/tiendas?orden=atencion|comision|deuda|nombre&desde&hasta (atencion = promesas vencidas, salud, comisión 180 d) */
export interface TiendasResponse { items: FilaTienda[]; total: number; data_version: number; meta_imagenes?: MetaImagenes }
/** GET /api/tiendas/{tienda_key} */
export interface TiendaDetalleResponse {
  meta_imagenes?: MetaImagenes;
  tienda: FilaTienda;
  muestras: MuestraVista[];
  serie: PuntoSerie[];
  productos: FilaProducto[];
  notas: Nota[];
  avisos: AvisoTienda[];
  /** Id de la plantilla recomendada para "Avisar a esta tienda". */
  plantilla_sugerida: string | null;
}

export interface FilaVideo {
  content_id: string;
  /** rev. 3 · Siempre null: oEmbed ya no devuelve `title` (CONTEXTO 12/11). La interfaz muestra el nombre corto del
   *  producto principal o "Video 7677…3012". */
  titulo: string | null;
  /** rev. 3 · Portada = imagen del producto con más pedidos válidos en ese content_id ('/img/p/<id>?v=…'). */
  miniatura: UrlImagen | null;
  /** rev. 3 · 'producto' = la portada es la foto del producto (rotular "Foto del producto"); null = sin imagen. */
  miniatura_origen?: 'producto' | null;
  /** https://www.tiktok.com/@<username>/video/<content_id> */
  enlace: string;
  pedidos: number;
  pedidos_validos: number;
  unidades: number;
  ventas_centavos: Centavos;
  comision_estimada_centavos: Centavos;
  tasa_reembolso: number;
  participacion: number;
  primera_venta: FechaLocal;
  ultima_venta: FechaLocal;
  productos: number;
  tienda_principal: string | null;
  /** application_id de las muestras vinculadas a este video (puede haber varias). */
  muestras_vinculadas: string[];
  /** rev. 5 · Métricas de la Display API (video_id de la Display API = content_id de orders/search). TODOS estos campos
   *  van AUSENTES si nunca se conectó la Display API y en null si este video no está en ella (privado, borrado o de otra
   *  cuenta). Las cifras son las que TikTok dio en `metricas_at`. */
  vistas?: number | null;
  likes?: number | null;
  comentarios?: number | null;
  compartidos?: number | null;
  /** rev. 5 · Portada REAL del video: '/img/v/<content_id>?v=…' (regla C45). `miniatura` sigue siendo la foto del producto. */
  portada?: UrlImagen | null;
  /** rev. 5 · title (o video_description) del video en TikTok. `titulo` sigue en null por compatibilidad. */
  descripcion?: string | null;
  duracion_s?: number | null;
  /** rev. 5 · create_time del video en TikTok. */
  publicado_at?: EpochS | null;
  /** rev. 5 · Última sync en la que la Display API devolvió este video (cuándo se leyeron las cifras). */
  metricas_at?: EpochS | null;
  /** rev. 5 · «Pedidos por 1,000 vistas»: pedidos_validos de TODA la vida del video ÷ vistas × 1,000 (2 decimales). Con la
   *  lista filtrada por periodo se usan igual las cifras de toda la vida (las vistas no tienen periodo). null sin vistas. */
  pedidos_por_mil_vistas?: number | null;
  /** rev. 5 · «Comisión por 1,000 vistas»: comision_estimada de TODA la vida del video ÷ vistas × 1,000, en centavos
   *  (entero). null sin vistas. */
  comision_por_mil_vistas_centavos?: Centavos | null;
}
/** GET /api/analitica/videos?desde&hasta&limite=50 */
export interface VideosResponse { items: FilaVideo[]; total: number; data_version: number; meta_imagenes?: MetaImagenes }
/** GET /api/videos/{content_id} */
export interface VideoDetalleResponse {
  video: FilaVideo; serie: PuntoSerie[]; productos: FilaProducto[]; meta_imagenes?: MetaImagenes;
  /** rev. 5 · Fotos diarias de la Display API, de la más vieja a la más nueva (máx. 400). Escalonada: un día solo
   *  aparece si alguna cifra cambió. AUSENTE si nunca se conectó la Display API; [] si este video no tiene fotos. */
  tendencia?: PuntoTendenciaVideo[];
}

export interface FilaProducto {
  product_id: string;
  titulo: string | null;
  titulo_corto: string | null;
  imagen: UrlImagen | null;
  tienda_key: string | null;
  tienda_nombre: string | null;
  pedidos: number;
  pedidos_validos: number;
  unidades: number;
  ventas_centavos: Centavos;
  comision_estimada_centavos: Centavos;
  tasa_reembolso: number;
  comision_bp: PuntosBase | null;
  videos: number;
  es_muestra: boolean;
  clase_muestra: ClaseMuestra | null;
  /** Tiene ficha de open_collaborations/products (si no, se ocultan precio, comisión, categoría e inventario). */
  con_ficha: boolean;
  en_vitrina: boolean | null;
}
/** GET /api/analitica/productos?desde&hasta&limite=50 */
export interface ProductosResponse { items: FilaProducto[]; total: number; data_version: number; meta_imagenes?: MetaImagenes }

/**
 * rev. 3 · GET /api/productos/{product_id} — Detalle de producto (01_ux §4.13). Faltaba en 03 §6.2.
 * `ficha` = null si el producto no tiene ficha de open_collaborations/products (se ocultan precio, comisión, categoría,
 * vendidos e inventario). `fila` = null si nunca vendió contigo (p. ej. muestra sin ventas).
 */
export interface ProductoDetalleResponse {
  meta_imagenes?: MetaImagenes;
  product_id: string;
  ficha: ProductoResumen | null;
  /** has_inventory de la ficha; null sin ficha. */
  con_inventario: boolean | null;
  /** Ruta de categoría ya unida: 'Ropa interior y de hombre › Camisas y abrigos › Sudaderas'; null sin ficha. */
  categoria_ruta: string | null;
  /** shop_ads_commission en puntos base, solo si viene (falta en 28 de 101). */
  comision_anuncios_bp: PuntosBase | null;
  fila: FilaProducto | null;
  serie: PuntoSerie[];
  videos: FilaVideo[];
  muestras: MuestraVista[];
  notas: Nota[];
  /** rev. 4 (15/11) · Ficha completa con la API oficial de afiliados. Opcional en el tipo; el hub siempre lo envía. */
  extendido?: ProductoExtendido;
}

// ============================================================================ rev. 4 (15/11) · ficha completa de producto
/**
 * rev. 4 (15/11) · Todo lo que la API OFICIAL de afiliados da de un producto (solo endpoints de LECTURA; no hay
 * scraper). Cada parte es null o [] mientras su fase de la sincronización no haya traído datos (corren dentro del paso
 * 'productos_ventas', con TTL y topes por sync). Lo que ningún endpoint de creador da (descripción del vendedor,
 * reseñas, guía de tallas, envío, stock exacto por SKU, datos de la tienda) no está aquí.
 */
export interface ProductoExtendido {
  /** Galería de tu vitrina (showcases/products main_images[], hasta 12 fotos, en su orden): '/img/g/<product_id>-<n>?v=…'
   *  ('?v=0' si aún no se descarga: el hub la baja al pedirla, tope 5 s). [] si el producto no está en tu vitrina. */
  galeria: UrlImagen[];
  /** Lo que tu vitrina dice del producto; null si no está en tu vitrina. */
  vitrina: VitrinaProducto | null;
  /** samples/labels: si puedes pedir muestra y sus SKU (TTL 72 h). null si aún no se consulta. */
  muestra: ElegibilidadMuestra | null;
  /** Solicitudes que NO salen en la búsqueda de solicitudes y se recuperaron con su cumplimiento (single_query): así se
   *  conocen su SKU y su variante. Las que sí salen están en ProductoDetalleResponse.muestras. */
  solicitudes_recuperadas: SolicitudRecuperada[];
  /** target_collaborations de las tiendas con shop_id (semanal): planes dirigidos que incluyen este producto, activos
   *  primero y de mayor comisión a menor. */
  planes_dirigidos: PlanDirigido[];
  /** Tasa que de verdad pagaron tus ventas (commission_rate de cada línea válida, sin pedidos de muestra) agrupada por
   *  tasa, contra el plan abierto. null si no hay ventas válidas. */
  comision_real: ComisionReal | null;
  /** Productos parecidos del marketplace por palabras del título (TTL 7 días). La relevancia la decide TikTok:
   *  rotular «parecidos por palabras del título». null si aún no se consulta. */
  parecidos: ParecidosProducto | null;
  /** orders/trace/search: de dónde vino cada venta de este producto. null si no hay datos. */
  origen_ventas: OrigenVentas | null;
  /** 'sin_permiso' = la app aún no tiene el permiso de orders/trace/search (código 105005) y no hay datos: mostrar la
   *  nota discreta «Origen de cada venta: requiere un permiso extra en Partner Center». null en cualquier otro caso. */
  origen_ventas_aviso: 'sin_permiso' | null;
}

/** rev. 4 · Datos de showcases/products (precios de tu vitrina; las tres fuentes de precio vienen como rango). */
export interface VitrinaProducto {
  /** status.inventory_status tal cual ('IN_STOCK', 'SOLD_OUT', …); null si no vino. */
  inventario: string | null;
  /** true = IN_STOCK · false = SOLD_OUT/OUT_OF_STOCK · null = sin dato. */
  con_existencias: boolean | null;
  /** original_price (precio de lista). */
  precio_lista_min_centavos: Centavos | null;
  precio_lista_max_centavos: Centavos | null;
  /** seller_discount_price (precio de venta del vendedor). */
  precio_venta_min_centavos: Centavos | null;
  precio_venta_max_centavos: Centavos | null;
  /** platform_discount_price (con el descuento de la plataforma). */
  precio_plataforma_min_centavos: Centavos | null;
  precio_plataforma_max_centavos: Centavos | null;
  /** commission.rate que muestra tu vitrina. */
  comision_bp: PuntosBase | null;
  /** status.is_hidden. */
  oculto: boolean | null;
}

/** rev. 4 · Propiedad de venta de una SKU (sale_properties): p. ej. { nombre: 'Color', valor: 'Negro' }. */
export interface PropiedadSku { nombre: string; valor: string }

/** rev. 4 · SKU de samples/labels (sample_sku_list). */
export interface SkuMuestra {
  sku_id: string;
  propiedades: PropiedadSku[];
  /** Valores de las propiedades unidos con ' / ' ('Negro / M'); null si no trae. */
  variante: string | null;
  precio_centavos: Centavos | null;
  /** is_available: si puedes pedir esta SKU como muestra. */
  disponible: boolean | null;
  /** unavailable_reason SOLO si disponible = false: IS_PREORDER · IS_GIFT · OUT_OF_STOCK · EXCEED_CB_PRICE_THRESHOLD ·
   *  ALREADY_APPLYED · UNKNOWN. */
  motivo_no_disponible: string | null;
  /** Texto listo para mostrar del motivo ('Agotado', 'Ya pediste esta variante', …); null si está disponible. */
  motivo_texto: string | null;
}

/** rev. 4 · Elegibilidad de muestra (GET /affiliate_creator/202412/samples/labels). */
export interface ElegibilidadMuestra {
  /** label.can_apply. */
  puede_solicitar: boolean | null;
  /** label.status: 'UNKNOWN' | 'TO_APPLY' | 'ONGOING' | 'COMPLETE' (tal cual). */
  estado: string | null;
  /** 'Puedes pedir muestra' · 'Ya la pediste; sigue en proceso' · 'Llegaste al límite de solicitudes de muestra' · … */
  estado_texto: string;
  /** Solo si ya la pediste. */
  application_id: string | null;
  /** label.reach_limit. */
  limite_alcanzado: boolean | null;
  skus: SkuMuestra[];
  /** Cuándo se revisó (última respuesta buena). */
  consultado_at: EpochS;
}

/** rev. 4 · Solicitud recuperada desde su cumplimiento (no sale en sample_applications/search). */
export interface SolicitudRecuperada {
  application_id: string;
  sku_id: string | null;
  /** sku_sale_property_value_names unidos con ' / ' ('Café Marrón / L'). */
  variante: string | null;
  /** 'FREE_SAMPLE' | 'SAMPLE_COUPON' (tal cual). */
  tipo: string | null;
  /** 'Muestra gratis' · 'Cupón de muestra'. */
  tipo_texto: string | null;
  solicitada_at: EpochS | null;
  /** Estado del cumplimiento vigente (PENDING, SUCCEED, OVERDUE, …). */
  cumplimiento: string | null;
  /** 'Video entregado' · 'Venció el plazo para publicar' · … */
  cumplimiento_texto: string | null;
}

/** rev. 4 · Plan dirigido (target collaboration) de una tienda que incluye el producto. */
export interface PlanDirigido {
  collab_id: string;
  nombre: string | null;
  /** 'LIVE' | 'EXPIRED' | 'DELETED' | 'ENDED' (tal cual). */
  estado: string | null;
  /** 'Activo' · 'Vencido' · 'Eliminado' · 'Terminado'. */
  estado_texto: string;
  activo: boolean;
  /** commission.rate (centésimas de % = puntos base). */
  comision_bp: PuntosBase | null;
  /** commission.amount: comisión estimada sobre el precio mínimo. */
  comision_monto_centavos: Centavos | null;
  tienda_nombre: string | null;
}

/** rev. 4 · Una tasa de comisión que pagaron tus ventas de este producto. */
export interface TasaComisionReal {
  comision_bp: PuntosBase;
  /** Líneas válidas (SETTLED, To-SETTLE, AWAITING PAYMENT) con esta tasa. */
  lineas: number;
  unidades: number;
  comision_estimada_centavos: Centavos;
  /** lineas / ComisionReal.lineas (0..1). */
  participacion: number;
  /** Cuántas de esas líneas llegaron con una campaña (campaign_id). */
  lineas_con_campana: number;
}

/** rev. 4 · «Comisión real»: la chaqueta de ejemplo paga 12 % en tus ventas contra 8 % del plan abierto. */
export interface ComisionReal {
  lineas: number;
  /** De la tasa con más líneas a la de menos. */
  por_tasa: TasaComisionReal[];
  /** La tasa con más líneas (= por_tasa[0].comision_bp). */
  tasa_principal_bp: PuntosBase;
  /** commission.rate del plan abierto vigente; null si el producto no está en colaboración abierta. */
  plan_abierto_bp: PuntosBase | null;
  /** Campañas distintas (campaign_id) en esas líneas. */
  campanas: number;
}

/** rev. 4 · Producto parecido del marketplace (open_collaborations/products/search). */
export interface ProductoParecido {
  product_id: string;
  titulo: string | null;
  titulo_corto: string | null;
  tienda_nombre: string | null;
  /** '/img/m/<product_id>?v=…' ('?v=0' si aún no se descarga); null sin foto. */
  imagen: UrlImagen | null;
  /** original_price (precio de lista). */
  precio_min_centavos: Centavos | null;
  precio_max_centavos: Centavos | null;
  /** Precio de venta ≈: commission.amount ÷ tasa ('comision') o, si no, el de lista ('lista'). */
  precio_venta_min_centavos: Centavos | null;
  precio_venta_max_centavos: Centavos | null;
  precio_fuente: FuentePrecio | null;
  comision_bp: PuntosBase | null;
  /** commission.amount (mínimo y máximo). */
  comision_por_venta_centavos: Centavos | null;
  comision_por_venta_max_centavos: Centavos | null;
  /** units_sold global (no son tus ventas). */
  unidades_vendidas_global: number | null;
  /** detail_link: ver el producto en TikTok Shop (abrir con /api/sistema/abrir). null si no vino. */
  enlace: string | null;
  /** true = Corte tiene la ficha de ese producto (#/productos/<product_id> existe: está en tu vitrina, ventas o
   *  muestras). false = solo existe en el marketplace: no enlazar a la ficha interna (respondería 404). */
  tiene_ficha: boolean;
}

/** rev. 4 · «Parecidos por palabras del título» (hasta 20, en el orden en que los devolvió TikTok). */
export interface ParecidosProducto {
  /** Palabras del título con las que se buscó. */
  palabras: string[];
  consultado_at: EpochS;
  items: ProductoParecido[];
}

/** rev. 4 · Un conteo del origen de las ventas. `tipo` null = sin dato (o sin enlace compartido). */
export interface CuentaOrigen {
  /** content_type ('VIDEO', 'LIVE', 'SHOP', 'PRE_LIVE', 'PROMOTION_PAGE', 'LINKSHARE') o trace.type ('GENERAL',
   *  'SPECIFIC'), tal cual. */
  tipo: string | null;
  /** 'Video' · 'En vivo' · 'Tienda' · 'Enlace general' · 'Sin enlace compartido' · … */
  texto: string;
  lineas: number;
}

/** rev. 4 · Origen de cada venta (orders/trace/search, pide un permiso extra en Partner Center). */
export interface OrigenVentas {
  lineas: number;
  por_tipo_contenido: CuentaOrigen[];
  por_tipo_enlace: CuentaOrigen[];
}

export interface LineaVista {
  sku_id: string;
  product_id: string;
  producto: string | null;
  imagen: UrlImagen | null;
  tienda_nombre: string | null;
  precio_centavos: Centavos | null;
  /** quantity (incluye unidades reembolsadas). */
  cantidad: number;
  reembolsadas: number;
  devueltas: number;
  comision_bp: PuntosBase | null;
  /** Desglose: standard_commission_rate · shop_ads_commission_rate · commission_bonus_rate. */
  comision_std_bp: PuntosBase | null;
  comision_ads_bp: PuntosBase | null;
  comision_bono_bp: PuntosBase | null;
  com_estimada_centavos: Centavos;
  com_real_centavos: Centavos;
  /** estimated_commission_base / actual_commission_base (base de V9 "Ventas generadas"). */
  base_estimada_centavos: Centavos | null;
  base_real_centavos: Centavos | null;
  /** Solo México. Se muestran en el detalle del pedido si vienen. */
  isr_centavos: Centavos | null;
  iva_centavos: Centavos | null;
  /** shared_with_partner: parte compartida con tu agencia. */
  compartido_agencia_centavos: Centavos | null;
  tipo_contenido: string | null;
  content_id: string | null;
  /** last_update_time. */
  actualizada_at: EpochS | null;
  /** is_carousel: "Video carrusel (puede tener comisión menor)". */
  es_carrusel: boolean | null;
}
export interface OrdenVista {
  order_id: string;
  creada_at: EpochS;
  fecha: FechaLocal;
  estado: EstadoOrden;
  /** 'Liquidado', 'Reembolsado', 'Por liquidar', 'Esperando pago', 'Congelado', 'Sin estado' (01_ux.md §2.8). */
  estado_etiqueta: string;
  total_centavos: Centavos;
  comision_estimada_centavos: Centavos;
  comision_real_centavos: Centavos;
  lineas: LineaVista[];
}
/** GET /api/ordenes?desde&hasta&estado=SETTLED,To-SETTLE&tienda=<key>&producto=<id>&video=<id>&q&pagina=1&por_pagina=50 */
export type OrdenesResponse = Paginado<OrdenVista> & { meta_imagenes?: MetaImagenes };

// ============================================================================ tablero
export type Periodo = '7d' | '30d' | '90d' | '12m' | 'todo' | `${number}-${number}`;   // o 'YYYY-MM'

export interface ResumenMuestras {
  total: number;
  por_clase: Record<ClaseMuestra, number>;
  por_grupo: Record<GrupoMuestra, number>;
  recibidas: number;
  tiendas_recibidas: number;
  /**
   * n = muestras que TikTok marca vencidas (clase debe_video; NO baja aunque publiques tarde: es la verdad de TikTok).
   * saldadas = de esas, las que ya publicaste (etapa Publicada, sin contar un video previo no aceptado).
   * valor_* = Σ precio de venta mínimo / máximo (≈, 01_ux.md §6.0) de las NO saldadas ni "No se puede"; el cupón de
   * muestra vale precio − lo que pagaste. Nunca precio de lista salvo respaldo. con_plan = no saldadas con etapa ≥ Planeada.
   */
  debe_video: { n: number; tiendas: number; valor_min_centavos: Centavos; valor_max_centavos: Centavos; con_plan: number; saldadas: number };
  /** 01_ux.md §2.5: grupo Por vencer / Vencida / Pausada y etapa ∉ {Publicada, No se puede}. Es el número que baja. */
  pendientes: number;
  tiendas_por_avisar: number;
  promesas_vencidas: number;
  /** (entregadas + saldadas) / (entregadas + debidas); null si no hay compromisos. */
  cumplimiento: number | null;
  proxima_fecha_limite: { application_id: string; fecha_limite_at: EpochS } | null;
  /**
   * Muestra → venta: productos de muestras RECIBIDAS con ≥ 1 venta válida desde la fecha de solicitud (sin contar el
   * pedido de la propia muestra). activados = además sin ventas válidas anteriores a la solicitud. Real: 5 y 4 de 42.
   */
  conversion: { productos_recibidos: number; productos_con_venta: number; productos_activados: number };
}

export interface Alerta {
  id: string;
  nivel: 'critica' | 'aviso' | 'info';
  titulo: string;
  texto: string;
  accion: { etiqueta: string; ruta: string } | null;
}

/** GET /api/dashboard?periodo=30d */
export interface DashboardResponse {
  meta_imagenes?: MetaImagenes;
  periodo: { clave: Periodo; desde: FechaLocal; hasta: FechaLocal; anterior_desde: FechaLocal | null; anterior_hasta: FechaLocal | null };
  kpis: Kpis;
  kpis_anterior: Kpis | null;
  muestras: ResumenMuestras;
  serie: { granularidad: Granularidad; puntos: PuntoSerie[] };
  top_tiendas: FilaTienda[];
  top_videos: FilaVideo[];
  top_productos: FilaProducto[];
  alertas: Alerta[];
  data_version: number;
  generado_at: EpochS;
  /** rev. 5 · Resumen de tu perfil de TikTok para Inicio (Display API). AUSENTE si nunca se trajo el perfil. */
  perfil_tiktok?: ResumenPerfilTikTok;
}

// ============================================================================ rev. 5 (15/11) · Display API (tus videos)
/**
 * rev. 5 (15/11) · Métricas de TUS videos con la Display API de TikTok for Developers: OTRA app, distinta de la de
 * TikTok Shop (Login Kit de escritorio con PKCE; scopes user.info.basic, user.info.profile, user.info.stats y
 * video.list). El Client key y el Client secret se guardan cifrados con DPAPI y NUNCA salen del hub (el client_key solo
 * viaja, inevitablemente, dentro de la URL de autorización). Ningún tipo trae tokens.
 *
 * Rutas SOLO LOCALES (ventana de Windows; mismas protecciones que /api/*: cookie de sesión, `X-CH-Hub: 1` en mutaciones,
 * Host y Origin propios). Por la LAN NO existen (404): el celular solo ve las cifras dentro de FilaVideo, VideoDeProducto,
 * VideoDetalleResponse y DashboardResponse.
 *   GET  /api/display/estado        → EstadoDisplay
 *   PUT  /api/display/credenciales  CredencialesDisplayRequest → EstadoDisplay
 *        (422 parametros_invalidos con detalle.campo 'client_key' | 'client_secret' · 403 prohibido en demo)
 *   POST /api/display/conectar      ConectarDisplayRequest → ConectarDisplayResponse
 *        (409 sin_credenciales · 403 prohibido en demo)
 *   POST /api/display/desconectar   DesconectarDisplayRequest → DesconectarDisplayResponse (403 prohibido en demo)
 *   GET  /oauth/tiktok?code&state   callback que abre el navegador DEL SISTEMA al volver de TikTok: responde una página
 *        HTML mínima («Listo, ya puedes volver a Corte» o el error), nunca JSON. La interfaz no la llama.
 * Flujo: POST conectar → la interfaz abre `url` en el navegador del sistema con POST /api/sistema/abrir (www.tiktok.com
 * está en la lista) o pide { abrir_navegador: true } → la persona autoriza → TikTok redirige a
 * http://127.0.0.1:<puerto real del hub>/oauth/tiktok → el hub canjea el code (PKCE), guarda la conexión, lee el perfil,
 * pide una sincronización y publica { tipo: 'display.cambio', display } por /api/events. El intento vale 10 min y un uso.
 * Sincronización: el paso «videos_tiktok» corre dentro de 'videos' (PasoSync no cambia) y se salta en silencio sin
 * credenciales o sin conexión. Sus errores nunca vuelven parcial la sync de TikTok Shop: quedan en EstadoDisplay.
 */
export type EstadoConexionDisplay = 'sin_credenciales' | 'sin_conectar' | 'conectada' | 'reautorizar';
export type ScopeDisplay = 'user.info.basic' | 'user.info.profile' | 'user.info.stats' | 'video.list';
/** Códigos propios de la Display API (EstadoDisplay.ultimo_error y UltimaSyncDisplay.error). Los mensajes vienen listos. */
export type CodigoErrorDisplay =
  | 'sin_credenciales' | 'sin_conexion' | 'reautorizar' | 'credenciales_rechazadas' | 'codigo_vencido'
  | 'solicitud_rechazada' | 'token_invalido' | 'permiso_faltante' | 'limite' | 'sin_internet' | 'tiktok_no_disponible'
  | 'respuesta_invalida' | 'error_interno';

/** Cuenta conectada a la Display API (GET /v2/user/info/). Cada campo depende de su permiso: puede venir null. */
export interface UsuarioDisplay {
  username: string | null;
  /** display_name */
  nombre: string | null;
  verificada: boolean | null;
  /** profile_deep_link */
  enlace_perfil: string | null;
  seguidores: number | null;
  siguiendo: number | null;
  likes_total: number | null;
  videos_total: number | null;
  actualizado_at: EpochS;
}

/** Última pasada del paso «videos_tiktok». quitados = videos que dejaron de ser públicos (solo con completa = true). */
export interface UltimaSyncDisplay {
  at: EpochS;
  estado: 'ok' | 'parcial' | 'error' | 'sin_permiso';
  videos: number;
  nuevos: number;
  cambiados: number;
  quitados: number;
  /** true = se llegó al final de la lista de videos públicos (tope prudente: 1,000). */
  completa: boolean;
  error: { codigo: CodigoErrorDisplay; mensaje: string } | null;
}

/** GET /api/display/estado (y evento 'display.cambio'). Nunca trae el client_key, el client_secret ni tokens. */
export interface EstadoDisplay {
  /** Hay Client key y Client secret guardados (cifrados). */
  configurada: boolean;
  /** Hay conexión guardada (también si hay que volver a autorizarla: estado 'reautorizar'). */
  conectada: boolean;
  estado: EstadoConexionDisplay;
  usuario: UsuarioDisplay | null;
  /** Permisos concedidos en TikTok (los de ScopeDisplay; TikTok podría agregar otros). */
  scopes: string[];
  /** De los cuatro que pide Corte, los que la persona no concedió (vacío si no hay conexión). */
  scopes_faltantes: ScopeDisplay[];
  access_expira_at: EpochS | null;
  refresh_expira_at: EpochS | null;
  conectada_at: EpochS | null;
  ultima_sync: UltimaSyncDisplay | null;
  ultimo_error: { codigo: CodigoErrorDisplay; mensaje: string; at: EpochS } | null;
  /** Hay un intento de conexión abierto (se esperaba el regreso de TikTok hasta `expira_at`). */
  conexion_pendiente: { expira_at: EpochS } | null;
}

/** PUT /api/display/credenciales. client_key: 8–64 letras y números · client_secret: 16–128 letras, números, - o _.
 *  Si cambia el client_key se borra la conexión anterior (pertenecía a la otra app). */
export interface CredencialesDisplayRequest { client_key: string; client_secret: string }
/** POST /api/display/conectar. abrir_navegador (omisión false): el hub abre la URL con el navegador del sistema. */
export interface ConectarDisplayRequest { abrir_navegador?: boolean }
/** url = https://www.tiktok.com/v2/auth/authorize/?client_key…&code_challenge_method=S256 (state y PKCE nuevos). */
export interface ConectarDisplayResponse { url: string; expira_at: EpochS; abierto: boolean }
/** POST /api/display/desconectar: revoca en TikTok (si se puede) y borra la conexión. borrar_datos: también lo
 *  descargado de la Display API (videos, historial, perfil y portadas). olvidar_app: también el Client key/secret. */
export interface DesconectarDisplayRequest { borrar_datos?: boolean; olvidar_app?: boolean }
/** revocado = TikTok confirmó la revocación (false sin internet: la conexión se borra de la PC igual). */
export interface DesconectarDisplayResponse { display: EstadoDisplay; revocado: boolean }

/** Una foto diaria de las cifras de un video (VideoDetalleResponse.tendencia). */
export interface PuntoTendenciaVideo {
  fecha: FechaLocal;
  vistas: number | null;
  likes: number | null;
  comentarios: number | null;
  compartidos: number | null;
}

/** DashboardResponse.perfil_tiktok: cifras de tu perfil y su cambio contra la foto de hace 7 días (si aún no hay 7 días
 *  de historial, contra la más vieja; null mientras no haya con qué comparar). */
export interface ResumenPerfilTikTok {
  username: string | null;
  nombre: string | null;
  seguidores: number | null;
  siguiendo: number | null;
  likes_total: number | null;
  videos_total: number | null;
  seguidores_cambio_7d: number | null;
  likes_cambio_7d: number | null;
  actualizado_at: EpochS;
}

// ============================================================================ estado local del usuario
/** Estado de un PlanVideo = etapa de "Tu avance" (01_ux.md §2.4). */
export type EstadoPlan = EtapaAvance;
interface Versionado { creado_at: EpochS; actualizado_at: EpochS; rev: number; dispositivo_id: string }

/**
 * Guarda el avance de UNA muestra (PlanMuestra de 01_ux.md §7.2). El hub garantiza un solo PlanVideo vivo por
 * application_id; un mismo content_id puede estar en varios (paquetes).
 */
export interface PlanVideo extends Versionado {
  id: string;                         // uuid4 del cliente
  application_id: string | null;
  product_id: string | null;
  tienda_key: string | null;
  titulo: string;
  /** Fecha planeada ("¿Qué día haces este video?"). Obligatoria en 'planeada'. */
  fecha_plan: FechaLocal | null;
  estado: EstadoPlan;
  fecha_video_listo: FechaLocal | null;
  /** Obligatoria en 'programada'. */
  programada_para_at: EpochS | null;
  fecha_publicada: FechaLocal | null;
  content_id: string | null;
  enlace_video: string | null;
  vinculo_origen: VinculoOrigen | null;
  /** content_id que el usuario descartó como "Posible video". */
  sugerencias_descartadas: string[];
  motivo_no_se_puede: MotivoNoSePuede | null;
  motivo_texto: string | null;
  fijada: boolean;
  nombre_corto: string | null;
  notas: string | null;
  orden: number;
  /** Primera vez que la muestra se vio como pendiente (base de "videos publicados" y "tiendas avisadas"). */
  en_cohorte_desde_at: EpochS | null;
}
export type PlanVideoCrear = Pick<PlanVideo, 'id' | 'titulo'> & Partial<Pick<PlanVideo,
  'application_id' | 'product_id' | 'tienda_key' | 'fecha_plan' | 'estado' | 'fecha_video_listo' | 'programada_para_at'
  | 'fecha_publicada' | 'content_id' | 'enlace_video' | 'vinculo_origen' | 'sugerencias_descartadas' | 'motivo_no_se_puede'
  | 'motivo_texto' | 'fijada' | 'nombre_corto' | 'notas' | 'orden'>>;
export type PlanVideoCambios = Partial<Omit<PlanVideoCrear, 'id'>> & { rev: number };
/** GET /api/plan?desde&hasta · POST /api/plan (PlanVideoCrear) · PATCH /api/plan/{id} (PlanVideoCambios) · DELETE /api/plan/{id}?rev=N */
export interface PlanResponse { items: PlanVideo[]; local_rev: number }

/** Aviso a una tienda (AvisoTienda de 01_ux.md §7.2). Solo se agrega; se "quita" con quitado_at, nunca se borra. */
export type OrigenAviso = 'copiado' | 'por_mi_cuenta';
export interface AvisoTienda extends Versionado {
  id: string;                         // uuid4 del cliente
  tienda_key: string;
  solicitud_ids: string[];
  /** Id de PlantillaMensaje, u 'otro' si se registró con "Ya le escribí por mi cuenta". */
  plantilla_id: string;
  /** Texto final copiado (vacío si fue por su cuenta). */
  texto: string;
  /** Fecha prometida de PUBLICACIÓN por muestra (Varias muestras promete una por muestra). */
  compromisos: Record<string, FechaLocal>;
  /** Solo en la plantilla "Nueva fecha": la promesa que se rompió. */
  fecha_anterior: FechaLocal | null;
  origen: OrigenAviso;
  /** Con marcado_enviado_at vacío = "copiado, sin confirmar". */
  copiado_at: EpochS | null;
  marcado_enviado_at: EpochS | null;
  /** "Quitar este aviso" o Deshacer: deja de contar para promesas y tiendas avisadas. */
  quitado_at: EpochS | null;
}
export type AvisoCrear = Pick<AvisoTienda, 'id' | 'tienda_key' | 'solicitud_ids' | 'plantilla_id' | 'texto' | 'compromisos' | 'origen'>
  & Partial<Pick<AvisoTienda, 'fecha_anterior' | 'copiado_at' | 'marcado_enviado_at'>>;
export type AvisoCambios = Partial<Pick<AvisoTienda, 'texto' | 'compromisos' | 'marcado_enviado_at' | 'quitado_at'>> & { rev: number };
/** GET /api/avisos?tienda=<key>&solicitud=<id> · POST /api/avisos (AvisoCrear) · PATCH /api/avisos/{id} (AvisoCambios). Sin DELETE. */
export interface AvisosResponse { items: AvisoTienda[]; local_rev: number }

/** Plantillas de mensajes (01_ux.md §4.8): 11 predeterminadas, editables y restaurables. */
export interface PlantillaMensaje extends Versionado {
  id: string;                         // 'disculpa_y_fecha', 'varias_muestras', 'nueva_fecha', ... o uuid si la crea el usuario
  nombre: string;
  /** Con variables {tienda} {producto} {fecha_compromiso} {fecha_anterior} {link_video} {lista_productos} {lista_fechas} {agradecimiento_socio} {problema_envio} {firma}. */
  cuerpo: string;
  predeterminada: boolean;
}
/** GET /api/plantillas · PUT /api/plantillas/{id} · POST /api/plantillas/{id}/restaurar */
export interface PlantillasResponse { items: PlantillaMensaje[]; local_rev: number }

/** Preferencias que se sincronizan entre PC y celular (01_ux.md §7.2). GET /api/preferencias · PATCH /api/preferencias */
export interface PreferenciasSincronizadas {
  capacidad_videos_dia: number;       // 1..10
  /** 0 = lunes … 6 = domingo. */
  dias_videos: number[];
  programo_mis_videos: boolean;
  firma: string;
  recordatorio_diario: boolean;
  hora_recordatorio: string;          // 'HH:MM' local
  aviso_por_vencer: boolean;
  aviso_promesas: boolean;
  aviso_atrasados: boolean;
  resumen_semanal: boolean;
  orden_plan: 'sugerido' | 'por_tipo_de_prenda';
  umbral_publicado_sin_ventas_dias: number;
  /** rev. 3 · Apariencia (01_ux §4.14 F). Viaja al celular en la copia (02 §11.2). El hub siempre los envía. */
  tema?: 'sistema' | 'claro' | 'oscuro';
  reducir_animaciones?: 'sistema' | 'si' | 'no';
  rev: number;
}

export type EntidadNota = 'muestra' | 'tienda' | 'producto' | 'video' | 'orden' | 'general';
export interface Nota extends Versionado { id: string; entidad: EntidadNota; entidad_id: string | null; texto: string; fijada: boolean }
export type NotaCrear = Pick<Nota, 'id' | 'entidad' | 'entidad_id' | 'texto'> & { fijada?: boolean };
export type NotaCambios = { texto?: string; fijada?: boolean; rev: number };
/** GET /api/notas?entidad=muestra&entidad_id=... · POST · PATCH /api/notas/{id} · DELETE /api/notas/{id}?rev=N */
export interface NotasResponse { items: Nota[]; local_rev: number }

export type EntidadRecordatorio = 'muestra' | 'tienda' | 'plan' | 'general';
export interface Recordatorio extends Versionado {
  id: string;
  entidad: EntidadRecordatorio;
  entidad_id: string | null;
  titulo: string;
  vence_at: EpochS;
  repetir: 'no' | 'diario' | 'semanal';
  estado: 'activo' | 'hecho' | 'cancelado';
  pospuesto_hasta: EpochS | null;
  /** Última vez que el hub emitió 'recordatorio.vencido' (evita avisar dos veces). */
  notificado_at: EpochS | null;
}
export type RecordatorioCrear = Pick<Recordatorio, 'id' | 'titulo' | 'vence_at'> &
  Partial<Pick<Recordatorio, 'entidad' | 'entidad_id' | 'repetir'>>;
export type RecordatorioCambios = Partial<Pick<Recordatorio, 'titulo' | 'vence_at' | 'repetir' | 'estado' | 'pospuesto_hasta'>> & { rev: number };
/** GET /api/recordatorios?estado=activo · POST · PATCH /api/recordatorios/{id} · DELETE /api/recordatorios/{id}?rev=N */
export interface RecordatoriosResponse { items: Recordatorio[]; local_rev: number }

/** POST /api/local/ops — cola de cambios hechos sin conexión (Android). Idempotente por op_id. */
export type OpLocal =
  | { op_id: string; tipo: 'plan.crear'; datos: PlanVideoCrear }
  | { op_id: string; tipo: 'plan.editar'; id: string; cambios: PlanVideoCambios }
  | { op_id: string; tipo: 'plan.borrar'; id: string; rev: number }
  | { op_id: string; tipo: 'nota.crear'; datos: NotaCrear }
  | { op_id: string; tipo: 'nota.editar'; id: string; cambios: NotaCambios }
  | { op_id: string; tipo: 'nota.borrar'; id: string; rev: number }
  | { op_id: string; tipo: 'recordatorio.crear'; datos: RecordatorioCrear }
  | { op_id: string; tipo: 'recordatorio.editar'; id: string; cambios: RecordatorioCambios }
  | { op_id: string; tipo: 'recordatorio.borrar'; id: string; rev: number }
  | { op_id: string; tipo: 'aviso.crear'; datos: AvisoCrear }
  | { op_id: string; tipo: 'aviso.editar'; id: string; cambios: AvisoCambios }
  | { op_id: string; tipo: 'plantilla.editar'; id: string; cambios: { nombre?: string; cuerpo?: string; rev: number } }
  | { op_id: string; tipo: 'preferencias.editar'; cambios: Partial<Omit<PreferenciasSincronizadas, 'rev'>> & { rev: number } };
export interface OpsRequest { ops: OpLocal[] }      // máx. 200 por lote, se aplican en orden
/** rev. 3.1 · Cualquier objeto versionado del estado local (OpsResultado.objeto y ErrorRespuesta.error.vigente). */
export type ObjetoLocal = PlanVideo | Nota | Recordatorio | AvisoTienda | PlantillaMensaje | PreferenciasSincronizadas;
export interface OpsResultado {
  op_id: string;
  estado: 'aplicada' | 'duplicada' | 'conflicto' | 'invalida';
  /** En 'conflicto': la versión vigente en el hub para que el cliente la muestre. */
  objeto?: ObjetoLocal;
  error?: string;
}
export interface OpsResponse { resultados: OpsResultado[]; local_rev: number }

// ============================================================================ copia sin conexión (Android)
/** GET /api/snapshot — ETag "dv<data_version>-lr<local_rev>-ir<img_rev>" (rev. 3.1, C45); If-None-Match -> 304; gzip. */
export interface SnapshotResponse {
  /** 02_visual §8.2: el celular guarda LQIP y color junto con la copia para pintar sin conexión. */
  meta_imagenes?: MetaImagenes;
  version_esquema: 1;
  data_version: number;
  local_rev: number;
  /** rev. 3.1 · Versión de la caché de imágenes con la que se armó (C45). Opcional en el tipo; el hub siempre lo envía. */
  img_rev?: number;
  generado_at: EpochS;
  cuenta: Cuenta | null;
  conexion: Pick<Conexion, 'estado' | 'aviso'>;
  sync: Pick<SyncEstado, 'ultima_ok_at' | 'ultima_estado'>;
  dashboard: { '30d': DashboardResponse; todo: DashboardResponse };
  muestras: MuestraVista[];
  tiendas: FilaTienda[];
  videos: FilaVideo[];             // top 100 por comisión
  productos: FilaProducto[];
  ordenes_recientes: OrdenVista[]; // últimos 90 días, máx. 500 pedidos (los más recientes)
  series: { mes: PuntoSerie[]; semana: PuntoSerie[] };
  local: {
    planes: PlanVideo[]; notas: Nota[]; recordatorios: Recordatorio[];
    avisos: AvisoTienda[]; plantillas: PlantillaMensaje[]; preferencias: PreferenciasSincronizadas;
  };
  /** Imágenes a precargar en el teléfono (variante sm). */
  imagenes: UrlImagen[];
  /** rev. 3 · Lo que el celular necesita para armar SIN conexión el detalle de muestra, el de tienda y "Avisar a mis
   *  tiendas" (01_ux §4.17). Solo para muestras pendientes y tiendas con pendientes o avisos. El hub siempre lo envía. */
  extras?: ExtrasSinConexion;
}

/** rev. 3 · Datos derivados que la interfaz no recalcula (las reglas viven en el hub, 03 §5.8–5.10). */
export interface ExtrasSinConexion {
  muestras: Record<string, {
    plantilla_sugerida: string;
    videos_del_producto: VideoDeProducto[];
    historial: CambioHistorial[];
  }>;
  tiendas: Record<string, { plantilla_sugerida: string | null; serie: PuntoSerie[] }>;
}

// ============================================================================ rev. 3 · ajustes de la PC y datos
/** rev. 3 · GET /api/ajustes/pc · PATCH /api/ajustes/pc (AjustesPcCambios) — solo Windows (— por LAN).
 *  Viven en config.json del hub (04 §A.10): no se sincronizan con el celular. */
export interface AjustesPc {
  /** false = sincronización automática apagada (equivale al "0 = apagado" de 03 §4.4). */
  sync_auto: boolean;
  /** rev. 3.1 (C36): 30 por omisión (01 §5.6 manda sobre los 60 de 03 §4.4); sin 180. */
  sync_intervalo_min: 15 | 30 | 60;
  /** null = todavía no se preguntó (la primera X dispara 'ventana.preguntar_cierre'). */
  segundo_plano: boolean | null;
  iniciar_con_windows: boolean;
  /** true si el usuario lo apagó desde el Administrador de tareas (StartupApproved, 04 §A.7). */
  iniciar_con_windows_bloqueado: boolean;
  /** En <html data-density>: comoda → comfortable, compacta → compact (tabla de BUILD_SPEC §8.4). */
  densidad: 'comoda' | 'compacta';
}
export type AjustesPcCambios = Partial<Omit<AjustesPc, 'iniciar_con_windows_bloqueado'>>;

/** rev. 3 · GET /api/datos/uso — "Espacio usado" en Privacidad y datos (solo Windows). */
export interface UsoDatosResponse { datos_bytes: number; imagenes_bytes: number; registros_bytes: number }

/** rev. 3 · GET /api/sync/cobertura — estado por módulo de Ajustes › Sincronización (01_ux §4.14 B). */
export interface CoberturaResponse {
  perfil: boolean;
  muestras: number;
  cumplimientos: number;
  detalles: number;
  productos_con_imagen: number;
  /** "Fichas de productos de tus ventas {con_ficha} de {total}". */
  fichas_ventas: { con_ficha: number; total: number };
  pedidos: number;
  pedidos_desde: FechaLocal | null;
  /** null si la vitrina no se pudo leer (permiso o error). */
  vitrina: number | null;
  /** Videos cuya portada ya tiene foto del producto. */
  portadas_videos: { con_foto: number; total: number };
}

/** rev. 3 · GET /api/local/exportar — "Exportar mi plan, avisos y notas" (01_ux §4.14 G). Solo Windows. */
export interface ExportacionLocal {
  formato: 'corte-local';
  version: 1;
  exportado_at: EpochS;
  planes: PlanVideo[];
  avisos: AvisoTienda[];
  notas: Nota[];
  recordatorios: Recordatorio[];
  plantillas: PlantillaMensaje[];
  preferencias: PreferenciasSincronizadas;
}
/** rev. 3.1 · POST /api/local/importar — cuerpo {ruta}: ruta absoluta que devolvió el selector nativo (`elegirArchivo`,
 *  C46). El hub valida (local, sin UNC, archivo regular, .json, ≤ 20 MB), lee y comprueba formato = 'corte-local'.
 *  Así un plan grande no choca con el límite de 256 KB de cuerpo (03 §7.3). Solo Windows. */
export interface ImportarLocalRequest { ruta: string }
/** rev. 3 · Respuesta de POST /api/local/importar. Idempotente por id: lo que ya existe con rev ≥ no se toca. */
export interface ImportacionLocalResponse {
  importados: { planes: number; avisos: number; notas: number; recordatorios: number; plantillas: number };
  omitidos: number;
  local_rev: number;
}

/** rev. 3 · POST /api/credenciales/legado/borrar — W2a' "Borrar archivo anterior": lo manda a la Papelera (recuperable). */
export interface BorrarLegadoRequest { confirmar: true }
export interface BorrarLegadoResponse { resultado: 'papelera' | 'no_existe' }

// ============================================================================ rev. 3 · firewall (04 §C.10, solo Windows)
export type EstadoFirewall = 'bien' | 'bloqueado' | 'red_publica' | 'desconocido';
/** GET /api/lan/firewall — diagnóstico sin administrador (4–7 s). */
export interface DiagnosticoFirewall {
  estado: EstadoFirewall;
  red: 'Public' | 'Private' | 'DomainAuthenticated' | null;
  /** Texto listo para mostrar (el mismo que LanEstado.aviso_firewall); null si está bien. */
  mensaje: string | null;
}
/** POST /api/lan/firewall — una UAC. 'privada' = (a) marcar la red como privada; 'publica_subred' = (b) permitir también
 *  la red pública solo para la subred; 'arreglar' = estado 'bloqueado' (quitar bloqueos y crear reglas). */
export interface FirewallRequest { opcion: 'privada' | 'publica_subred' | 'arreglar' }
export interface FirewallResponse { resultado: 'listo' | 'cancelado' | 'fallo'; diagnostico: DiagnosticoFirewall }

// ============================================================================ teléfono: administración (solo UI de Windows)
export interface Dispositivo {
  device_id: string;
  nombre: string;
  plataforma: 'android';
  permisos: 'lectura' | 'lectura_escritura';
  creado_at: EpochS;
  ultimo_uso_at: EpochS | null;
  ultima_ip: string | null;
  clave_rotada_at: EpochS;
  revocado_at: EpochS | null;
}
/** puerto = el LAN realmente enlazado (39230 preferido; si está ocupado, el siguiente libre de 39232–39239). */
export interface LanResumen { activo: boolean; dispositivos_activos: number; puerto: number | null }
/** GET /api/lan/estado */
export interface LanEstado {
  activo: boolean;
  puerto: number | null;
  direcciones: string[];           // IPv4 privadas, Wi-Fi primero
  host_id: string;
  /** Alias que el usuario elige (rev. 3: por omisión 'PC ' + 4 primeros hex de host_id en mayúsculas, p. ej. 'PC 3F2A').
   *  NUNCA el nombre de Windows ni del usuario. Se cambia con PATCH /api/lan/estado (LanCambios). */
  nombre_equipo: string;
  /** SHA-256 (hex) del DER del certificado TLS del hub: es la identidad que el celular fija. */
  huella_tls: string;
  dispositivos: Dispositivo[];
  aviso_firewall: string | null;
}
/** POST /api/lan/activar */
export interface LanActivarRequest { activo: boolean }
/** rev. 3 · PATCH /api/lan/estado — 1–40 caracteres imprimibles, sin saltos de línea. Responde LanEstado. */
export interface LanCambios { nombre_equipo?: string }
/** POST /api/lan/emparejar — contiene secretos de un solo uso: no-store, nunca se registra. */
export interface EmparejarResponse {
  pair_id: string;
  /** creatorhub://pair?v=1&h=<host_id>&a=<ip>,<ip>&p=<puerto>&s=<código 12 sin guiones>&f=<huella b64url 43> (spec 04 §C.4) */
  qr_texto: string;
  qr_png: string;                  // data:image/png;base64,...
  codigo_manual: string;           // 'ABCD-EFGH-JKMN' (60 bits Crockford)
  /** creado + 300 s; un solo uso. */
  expira_at: EpochS;
  direcciones: string[];
}
/** GET /api/lan/emparejar/{pair_id} */
export interface EmparejamientoEstado {
  pair_id: string;
  estado: 'esperando' | 'pendiente_aprobacion' | 'aprobado' | 'rechazado' | 'expirado';
  dispositivo: string | null;
  codigo_verificacion: string | null;
  expira_at: EpochS;
}
/** POST /api/lan/emparejar/{pair_id}/decision */
export interface DecisionRequest { aprobar: boolean; permisos?: 'lectura' | 'lectura_escritura' }
/** PATCH /api/lan/dispositivos/{device_id} · DELETE (revoca) */
export interface DispositivoCambios { nombre?: string; permisos?: 'lectura' | 'lectura_escritura' }

// ============================================================================ protocolo LAN (lo implementa la capa nativa de Android)
// Transporte: HTTPS (TLS 1.2+) con el certificado autofirmado del hub, fijado por huella (spec 04 §C, spec 03 §6.6).
// Cada petición fuera de hello/pair lleva 'Authorization: CH1-HMAC-SHA256 device=…, ts=…, nonce=…, sig=…'.
// ---- Protocolo LAN 1 · NORMATIVO (03, 04 y Android lo implementan igual; donde un texto difiera, manda este bloque) ----
//  Puertos: interfaz Windows http://127.0.0.1:39229 (respaldo 39228…39220, solo loopback) · LAN https://<IPv4 privada>:39230
//    (respaldo 39232–39239) · descubrimiento UDP 39231. Solo IPs 10/8, 172.16/12, 192.168/16. SO_EXCLUSIVEADDRUSE.
//  Huella = SHA-256 del DER del certificado: hex minúsculas (64) en JSON; b64url sin relleno (43) en el QR (`f`).
//  UDP: pregunta ASCII 'CREATORHUB_DESCUBRIR 1 <nonce 32 hex minúsculas>' (≤160 B) -> respuesta unicast JSON UTF-8 (≤512 B)
//    {"app":"creator-hub","v":1,"host_id":"<32 hex>","nombre_equipo":"<alias>","puerto":<int>,"huella":"<64 hex>","nonce":"<eco>"}
//    (nombre_equipo = el alias de LanEstado, NUNCA el nombre de Windows). La huella del UDP es solo una pista.
//  CH1: k_mac = HKDF-SHA256(ikm = device_key (32 B), salt = "creatorhub/lan/v1", info = "mac", 32)
//    canónico = "CH1\n" + MÉTODO + "\n" + canon(ruta?query) + "\n" + ts + "\n" + nonce + "\n" + hex(SHA-256(cuerpo en el cable))
//    canon = RFC 3986 (segmentos decodificados y recodificados; query como formulario, '+' = espacio, ordenada por
//    (clave, valor)); sig = b64url(HMAC-SHA256(k_mac, UTF-8(canónico))); nonce = b64url de 16 B; todo b64url SIN relleno.
//    Ventana de reloj ±300 s (401 reloj_desfasado con detalle.hora_servidor; el celular guarda el desfase y reintenta 1 vez);
//    nonces recordados 600 s (≥ 2 × ventana) por dispositivo (401 repetida). Sin cifrado extra de cuerpos: TLS fijado da
//    confidencialidad y CH1 autenticidad y anti-repetición.
//  QR: creatorhub://pair?v=1&h=<host_id>&a=<ip>[,<ip>…≤3]&p=<puerto>&s=<código 12 normalizado>&f=<huella b64url>.
//  Vectores (Python = Java byte a byte): spec/verificacion/vectores_ch1.json (CH1) y
//    spec/pruebas/protocolo_lan/vectores_emparejamiento.json (código, K_pair, prueba, SAS, K_enc, paquete, QR, UDP).
//  Referencias: spec/pruebas/protocolo_lan/protocolo_lan.py (hub) · spec/pruebas/android_min/app/src/main/java/
//    app/creatorhub/prueba/ProtocoloLan.java (el mismo archivo del APK) · canal probado en spec/pruebas/tls_hub_min.
/** GET /lan/v1/hello — sin autenticación, sin secretos. nombre_equipo = alias (nunca el nombre de Windows); rev. 3.1
 *  (C38): el MISMO alias en hello, UDP, LanPaquete y LanEstado; por omisión 'PC ' + host_id[0:4] en mayúsculas. */
export interface LanHello { app: 'creator-hub'; protocolo: 1; host_id: string; nombre_equipo: string; version: string; auth: 'CH1-HMAC-SHA256'; hora_servidor: EpochS; huella_tls: string }
/** POST /lan/v1/pair/start — pair_id null: el hub tiene un solo emparejamiento activo y lo identifica por la prueba.
 *  prueba = b64url(HMAC-SHA256(K_pair, "CH1-PAIR|" + nonce_c + "|" + huella_observada_hex + "|" + nombre)),
 *  K_pair = PBKDF2-HMAC-SHA256(código normalizado, "creatorhub-pair-v1|" + host_id, 200 000, 32) (spec 04 §C.6). */
export interface LanPairStartRequest { pair_id: string | null; nonce_c: string; nombre: string; plataforma: 'android'; prueba: string }
export interface LanPairStartResponse { pair_id: string; nonce_s: string; expira_at: EpochS; estado: 'pendiente_aprobacion' }
/** GET /lan/v1/pair/{pair_id}?nonce_c=... (long-poll máx. 25 s). Tras aprobar, el mismo paquete se vuelve a entregar
 *  durante 120 s a sondeos con el nonce_c correcto (si se pierde la respuesta, el celular no queda huérfano). */
export interface LanPairPollResponse { estado: 'pendiente_aprobacion' | 'aprobado' | 'rechazado' | 'expirado'; paquete?: string }
/** Contenido descifrado de `paquete`: b64url(iv(12) ‖ AES-256-GCM(K_enc, iv, JSON, aad = pair_id)),
 *  K_enc = HKDF-SHA256(K_pair, salt = nonce_c ‖ nonce_s, info = "CH1-PAQUETE"). El celular exige huella_tls == la observada. */
export interface LanPaquete {
  device_id: string; device_key: string; host_id: string; nombre_equipo: string;
  puerto: number; protocolo: 1; permisos: 'lectura' | 'lectura_escritura'; huella_tls: string;
}
/** POST /lan/v1/rotar (firmado; viaja dentro de TLS). Rotación en dos fases: la clave anterior sigue valiendo SIN plazo
 *  hasta la primera petición válida firmada con la nueva; si la nueva no se usa en `gracia_s` (7 días) se descarta la nueva. */
export interface LanRotarResponse { device_key: string; vigente_desde: EpochS; gracia_s: number }
