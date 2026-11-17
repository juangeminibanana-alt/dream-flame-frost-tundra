/**
 * FIRMAS NORMATIVAS · módulo `@/dominio` (lo implementa ui-dominio en ui/src/dominio/). BUILD_SPEC §8.2.
 * TypeScript PURO: sin React, sin DOM, sin red. Todo determinista con el reloj inyectable. Cobertura con vitest.
 * Hora: México centro = UTC−6 FIJO (sin horario de verano desde 2022); NUNCA usar la zona del dispositivo.
 * rev. 3.1: registroImagenes (almacén sin React de LQIP/color, C47) y recorrerPlan (01 §5.5).
 */
import type * as C from '@/contrato';
import type { NotificacionProgramada } from '@/plataforma';
import type { ClaveConsulta, ParamsDe, RespuestaDe } from '@/datos';
import type { NombreIcono, TonoEstado } from '@/componentes';

// ============================================================================ reloj y fechas
export const TZ_OFFSET_S: -21600;
/** Reloj de la app (epoch s). En pruebas: fijarReloj(() => 1794500100). */
export function ahoraS(): C.EpochS;
export function fijarReloj(fn: (() => C.EpochS) | null): void;
export function fechaLocalDe(t: C.EpochS): C.FechaLocal;
export function hoyLocal(ahora?: C.EpochS): C.FechaLocal;
export function sumarDias(fecha: C.FechaLocal, dias: number): C.FechaLocal;
/** b − a en días de calendario. */
export function diasEntre(a: C.FechaLocal, b: C.FechaLocal): number;
/** 0 = lunes … 6 = domingo. */
export function diaSemana(fecha: C.FechaLocal): number;
export function horaLocal(t: C.EpochS): { h: number; m: number };
/** Epoch del inicio (00:00 local) de una fecha, o de la hora indicada. */
export function epochDeFecha(fecha: C.FechaLocal, hora?: number, minuto?: number): C.EpochS;
/** Desde/hasta de un periodo ('7d','30d','90d','12m','todo','2026-10'); ventanas inclusivas de N días (01_ux §6.0). */
export function rangoDePeriodo(periodo: C.Periodo, hoy: C.FechaLocal, primeraFecha?: C.FechaLocal): { desde: C.FechaLocal; hasta: C.FechaLocal };

// ============================================================================ formato es-MX (01_ux §1.5, 02 §4.3)
export const formato: {
  /** $12,345 (sin decimales) · con decimales: $12.34 · signo: −$1,234 con menos tipográfico. */
  dinero(centavos: C.Centavos, opciones?: { decimales?: boolean }): string;
  /** '≈ $1,234'. */
  dineroAprox(centavos: C.Centavos): string;
  /** '$14 – $131' o '$14' si son iguales; '—' si ambos null. */
  rangoDinero(min: C.Centavos | null, max: C.Centavos | null, opciones?: { decimales?: boolean; aprox?: boolean }): string;
  /** 'desde ≈ $1,234' (suma aproximada con rangos). */
  desdeAprox(centavos: C.Centavos): string;
  numero(n: number): string;
  /** 0..1 → '42 %' (0 decimales) o '42.5 %'. */
  porcentaje(p: number, decimales?: 0 | 1): string;
  /** 800 → '8 %'. */
  tasaBp(bp: C.PuntosBase): string;
  /** '12 nov' · otro año: '28 dic 2025'. */
  fechaCorta(f: C.FechaLocal | C.EpochS): string;
  /** 'jue 12 nov'. */
  fechaConDia(f: C.FechaLocal | C.EpochS): string;
  /** 'viernes 20 de noviembre' (mensajes a tiendas). */
  fechaLarga(f: C.FechaLocal | C.EpochS): string;
  /** 'hoy' · 'ayer' · 'hace 3 días' · 'en 2 días' (hasta 7 días; después fechaCorta). Con hora: 'hace 4 min'. */
  relativa(t: C.EpochS, ahora?: C.EpochS): string;
  /** '6:30 p. m.'. */
  hora(t: C.EpochS): string;
  /** Eje Y: 0 · '$5 mil' · '$10 mil'. */
  ejeDinero(centavos: C.Centavos): string;
  /** '7677…3012'. */
  idCorto(id: string): string;
  /** 'hace 69 días' desde solicitada_at (nunca "días de atraso"). */
  haceDias(t: C.EpochS | null, ahora?: C.EpochS): string;
};

// ============================================================================ texto
/** Nombre corto (01_ux §6.0): sin prefijos 【…】, normalizado (02 §4.4), ≤ max caracteres (60). */
export function nombreCorto(titulo: string | null, max?: number): string;
/** {producto} de 01_ux §4.8: primera frase, minúscula inicial solo con sustantivos genéricos de la lista fija. */
export function nombreParaMensaje(titulo: string | null): string;
export function normalizarTitulo(titulo: string): string;
export function sinAcentos(texto: string): string;
/** Búsqueda que ignora acentos y mayúsculas; true si TODAS las palabras aparecen en algún campo. */
export function coincide(busqueda: string, ...campos: Array<string | null | undefined>): boolean;
/** Rangos [inicio, fin) para resaltar con <mark>. */
export function resaltar(busqueda: string, texto: string): Array<[number, number]>;
export function nuevoId(): string;

// ============================================================================ tiendas e imágenes (02 §7.17, §8)
export type TonoAvatar = 'iris' | 'coral' | 'aqua' | 'ambar' | 'rosa' | 'pizarra' | 'cielo' | 'verde';
export function tonoTienda(nombre: string): TonoAvatar;
export function inicialesTienda(nombre: string): string;
export function iconoCategoria(categoria: string | null | undefined): Extract<NombreIcono, 'Shirt' | 'SportShoe' | 'Wallet' | 'Gorra' | 'Tag'>;
export type VarianteImagen = 'xs' | 'sm' | 'md' | 'og';
/** ancho × dpr → siguiente variante hacia arriba (96/240/720; más grande = og). */
export function varianteParaAncho(anchoCss: number, dpr: number): VarianteImagen;
/** Agrega o reemplaza '&t=' conservando '?v='. 'og' quita t. */
export function urlConVariante(url: C.UrlImagen, variante: VarianteImagen): string;
/**
 * rev. 3.1 (C47) · Almacén en memoria de meta_imagenes, SIN React: @/datos registra lo que llega en cada respuesta (y la
 * copia de Android) y <Foto> de @/componentes lo lee con useSyncExternalStore. La clave es la URL sin '&t=…'; una URL
 * con '?v=0' nunca tiene entrada. Máx. 2000 entradas (expulsa las más viejas).
 */
export const registroImagenes: {
  registrar(meta: C.MetaImagenes | undefined): void;
  leer(url: C.UrlImagen | null | undefined): C.ImagenMeta | undefined;
  /** Devuelve la función para desuscribirse. Avisa una vez por cada registrar() que cambió algo. */
  suscribir(fn: () => void): () => void;
  /** Contador que sube en cada cambio (getSnapshot de useSyncExternalStore). */
  version(): number;
  vaciar(): void;
};

// ============================================================================ vocabulario (01_ux §1.5, §2) — textos exactos de 01
export const ETIQUETA_GRUPO: Readonly<Record<C.GrupoMuestra, string>>;
export const TONO_GRUPO: Readonly<Record<C.GrupoMuestra, TonoEstado>>;
export const ICONO_GRUPO: Readonly<Record<C.GrupoMuestra, NombreIcono>>;
export const ETIQUETA_ETAPA: Readonly<Record<C.EtapaAvance, string>>;
export const PASO_ETAPA: Readonly<Record<C.EtapaAvance, 0 | 1 | 2 | 3 | 4 | 'no'>>;
export const ICONO_ETAPA: Readonly<Record<C.EtapaAvance, NombreIcono>>;
export const ETIQUETA_SALUD: Readonly<Record<C.SaludTienda, string>>;
export const TONO_SALUD: Readonly<Record<C.SaludTienda, TonoEstado>>;
export const ETIQUETA_NIVEL: Readonly<Record<C.NivelPrioridad, string>>;
export const ETIQUETA_MOTIVO_NO_SE_PUEDE: Readonly<Record<C.MotivoNoSePuede, string>>;
export const ETIQUETA_FUENTE_PRECIO: Readonly<Record<C.FuentePrecio, string>>;
export const ETIQUETA_ESTADO_ORDEN: Readonly<Record<C.EstadoOrden, string>>;
export const ETIQUETA_PASO_SYNC: Readonly<Record<C.PasoSync, string>>;
/** VIDEO → 'Video', SHOP → 'Vitrina', … (01_ux §2.8). Desconocido → tal cual. */
export function etiquetaContenido(tipo: string | null): string;
export function etiquetaTipoMuestra(tipo: string): string;
/** Texto del chip de razón con sus cifras: 'Ya lo vendes en 12 videos', 'Te deja $40 – $45 por venta'. */
export function textoRazon(razon: C.RazonPrioridad, m: C.MuestraVista): string;
export const ICONO_RAZON: Readonly<Record<C.RazonPrioridad, NombreIcono>>;
/** Permiso → texto de 01_ux §4.14 A ('creator.showcase.read' → 'Ver tu vitrina'). */
export function textoPermiso(scope: string): string;

// ============================================================================ trabajo: pendientes, avance, promesas (01_ux §2.4–2.6)
/** Grupo ∈ {por_vencer, vencida, pausada} y etapa ∉ {publicada, no_se_puede}. */
export function esPendiente(m: C.MuestraVista): boolean;
export interface ConteosTrabajo {
  pendientes: number;
  /** Cohorte de "ponerse al día": pendientes + publicadas desde en_cohorte_desde_at. */
  total_cohorte: number;
  publicadas: number;
  por_etapa: Record<'planeada' | 'video_listo' | 'programada' | 'publicada', number>;
  tiendas_con_pendientes: number;
  tiendas_avisadas: number;
  tiendas_por_avisar: number;
  promesas_vencidas: number;
  /** Por vencer en < 48 h (rojo). */
  por_vencer_48h: number;
  no_se_puede: number;
}
/** Recalcula en la interfaz lo que cambia con el estado local (para que "Te faltan 32" baje al instante, también sin conexión). */
export function contarTrabajo(muestras: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): ConteosTrabajo;
/** Superposición optimista: recalcula `avance` (del PlanVideo vivo de esa solicitud) y `avisos` (promesa, vencida,
 *  copiado sin confirmar) con las mismas reglas que el hub (03 §5.10). No toca grupo, clase, prioridad ni salud. */
export function aplicarLocal(m: C.MuestraVista, planes: C.PlanVideo[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): C.MuestraVista;
export type AccionEtapa = 'planear' | 'marcar_publicada' | 'video_listo' | 'marcar_programada' | 'avisar' | 'cambiar_fecha';
/** Tabla "Acción principal visible por etapa" de 01_ux §2.4. null si la muestra no admite etapas. */
export function accionPrincipal(m: C.MuestraVista, programoMisVideos: boolean): AccionEtapa | null;
export function accionSecundaria(m: C.MuestraVista, programoMisVideos: boolean): AccionEtapa | null;
export const ETIQUETA_ACCION: Readonly<Record<AccionEtapa, string>>;
/** Datos que pide cada etapa (01_ux §2.4). */
export interface DatosEtapa {
  fecha_plan?: C.FechaLocal;
  fecha_video_listo?: C.FechaLocal;
  programada_para_at?: C.EpochS;
  fecha_publicada?: C.FechaLocal;
  content_id?: string | null;
  enlace_video?: string | null;
  vinculo_origen?: C.VinculoOrigen;
  motivo_no_se_puede?: C.MotivoNoSePuede;
  motivo_texto?: string | null;
}
/** Mensaje en español si faltan datos obligatorios (mismas reglas que el 422 del hub); null si está bien. */
export function validarEtapa(etapa: C.EtapaAvance, datos: DatosEtapa): string | null;
export type OperacionPlan =
  | { tipo: 'plan.crear'; datos: C.PlanVideoCrear }
  | { tipo: 'plan.editar'; id: string; cambios: C.PlanVideoCambios };
/** Crea o edita el PlanVideo de la muestra para pasarla a `etapa` (un solo plan vivo por solicitud). */
export function opCambioEtapa(m: C.MuestraVista, etapa: C.EtapaAvance, datos: DatosEtapa, hoy: C.FechaLocal): OperacionPlan;
/** content_id de 'https://www.tiktok.com/@x/video/<id>' (o el id suelto de 19 dígitos). Enlace corto (vm./vt.) → null:
 *  se guarda en enlace_video y el hub lo resuelve después (BUILD_SPEC §6.3). */
export function contentIdDeEnlace(texto: string): string | null;
export function esEnlaceTikTok(texto: string): boolean;
/** Fecha prometida por omisión (01_ux §4.8): programada; si no, planeada + 2; null si no hay fecha. */
export function fechaPrometidaPorOmision(avance: C.AvanceMuestra): C.FechaLocal | null;
/** Promesa en riesgo: fecha planeada (o programada) + 2 > promesa vigente. */
export function promesaEnRiesgo(fechaPlan: C.FechaLocal, promesa: C.FechaLocal | null): boolean;
/** Orden de "Avisar a mis tiendas" (01_ux §4.17): promesas vencidas → socio con pendientes → con pendientes por comisión
 *  180 d, nº de pendientes y valor recibido. Solo tiendas con pendientes por avisar o con promesa vencida. */
export function ordenTiendasAvisar(tiendas: C.FilaTienda[], muestras: C.MuestraVista[], avisos: C.AvisoTienda[], hoy: C.FechaLocal): C.FilaTienda[];

// ============================================================================ Armar mi plan (01_ux §4.5)
export interface EntradaPlan {
  /** Pendientes candidatas (incluye las que ya tienen fecha). */
  muestras: C.MuestraVista[];
  /** application_id incluidas en este plan. */
  incluidas: string[];
  capacidad: number;
  /** 0 = lunes … 6 = domingo. */
  dias: number[];
  desde: C.FechaLocal;
  respetarFechas: boolean;
  orden: 'sugerido' | 'por_tipo_de_prenda';
  planes: C.PlanVideo[];
  /** Promesa vigente por solicitud (de los avisos). */
  promesas: Record<string, C.FechaLocal>;
  hoy: C.FechaLocal;
}
export interface AsignacionPlan { application_id: string; fecha: C.FechaLocal; ya_tenia_fecha: boolean }
export interface ResultadoPlan {
  asignaciones: AsignacionPlan[];
  /** Último día con video. */
  termina: C.FechaLocal | null;
  /** termina + 2 (la fecha que se promete). */
  publica_a_mas_tardar: C.FechaLocal | null;
  por_dia: Record<C.FechaLocal, number>;
  /** Regla 1: por vencer que no alcanza antes de su fecha límite. */
  no_alcanza: { application_id: string; fecha_limite: C.FechaLocal }[];
  /** Regla 3: quedaría después de lo prometido. */
  rompe_promesa: { application_id: string; promesa: C.FechaLocal; fecha: C.FechaLocal }[];
}
/** Reglas 1–3 de 01_ux §4.5 (por vencer primero, capacidad contando lo ya planeado, días sin videos, promesas).
 *  Caso real: 32 pendientes, 3/día, L–S, desde jue 12 nov → termina mar 24 nov, publica jue 26 nov. */
export function armarPlan(entrada: EntradaPlan): ResultadoPlan;
/** 'Hoy' antes de las 6:00 p. m. local; si no, mañana. */
export function desdePorOmision(ahora: C.EpochS): C.FechaLocal;
/** Ops para crear/editar los PlanVideo del resultado (todas a 'planeada' con su fecha_plan). */
export function opsDePlan(resultado: ResultadoPlan, muestras: C.MuestraVista[], planes: C.PlanVideo[]): OperacionPlan[];
/** rev. 3.1 · "Agregar y recorrer las demás" (01 §5.5): mete `nueva` (por vencer) antes de su fecha límite respetando
 *  capacidad y días, recorre hacia adelante las planeadas NO fijadas que ya no caben y reporta las promesas que se
 *  romperían. `cambios` trae solo las asignaciones que cambian (para opsDePlan); `termina` es la nueva fecha de término. */
export interface ResultadoRecorrido extends ResultadoPlan {
  cambios: AsignacionPlan[];
  termina_antes: C.FechaLocal | null;
}
export function recorrerPlan(entrada: EntradaPlan, nueva: C.MuestraVista): ResultadoRecorrido;

// ============================================================================ mensajes a tiendas (01_ux §4.8)
export const IDS_PLANTILLAS: readonly [
  'disculpa_y_fecha', 'varias_muestras', 'nueva_fecha', 'ya_publique', 'ya_tengo_video', 'producto_no_disponible',
  'no_me_llego_completa', 'prefiero_otro_producto', 'disculpa_sin_fecha', 'ya_la_recibi', 'gracias_por_las_ventas',
];
export const VARIABLES_PLANTILLA: readonly string[];
export interface ContextoMensaje {
  tienda: { nombre: string; es_socio: boolean };
  muestras: C.MuestraVista[];
  /** Fecha prometida por solicitud. */
  compromisos: Record<string, C.FechaLocal>;
  fecha_anterior: C.FechaLocal | null;
  link_video: string | null;
  problema_envio: 'no_llego' | 'incompleta' | null;
  firma: string;
}
export type FaltanteMensaje =
  | { tipo: 'fecha'; solicitudes: string[] }
  | { tipo: 'plan'; solicitudes: string[] }
  | { tipo: 'link_video' };
export interface MensajeResuelto {
  texto: string;
  /** Si hay faltantes, Copiar va desactivado (nunca "fecha por confirmar"). */
  faltantes: FaltanteMensaje[];
  puede_copiar: boolean;
  /** Rangos de texto que vienen de variables (para resaltarlos en la vista previa). */
  resaltados: Array<{ inicio: number; fin: number; variable: string }>;
}
/** Resuelve {tienda} {producto} {fecha_compromiso} {fecha_anterior} {link_video} {lista_productos} {lista_fechas}
 *  {agradecimiento_socio} {problema_envio} {firma}. 'nueva_fecha' predeterminada sin editar con ≥ 2 muestras usa el
 *  texto "Varias" de 01_ux §4.8. */
export function resolverPlantilla(plantilla: Pick<C.PlantillaMensaje, 'id' | 'cuerpo' | 'predeterminada' | 'rev'>, ctx: ContextoMensaje): MensajeResuelto;
/** Respaldo SOLO si no hay plantilla_sugerida del hub ni en la copia (tabla de 01_ux §4.8). */
export function plantillaRecomendada(ctx: { muestras: C.MuestraVista[]; promesa_vencida: boolean; es_socio: boolean }): string;
/** Texto plano de "Copiar datos para tu guion" (01_ux §4.3). */
export function textoDatosGuion(m: C.MuestraVista): string;

// ============================================================================ recordatorios (01_ux §4.14 D)
/** Notificaciones locales de los próximos `dias` (7): plan diario, por vencer 48/24 h, promesas (un día antes),
 *  atrasados, resumen semanal y Recordatorio activos. Ids estables. */
export function calcularNotificaciones(e: {
  muestras: C.MuestraVista[];
  planes: C.PlanVideo[];
  avisos: C.AvisoTienda[];
  recordatorios: C.Recordatorio[];
  preferencias: C.PreferenciasSincronizadas;
  ahora: C.EpochS;
  dias?: number;
}): NotificacionProgramada[];

// ============================================================================ exportar
/** CSV de Muestras › Todas (01_ux §4.7), UTF-8 con BOM, separador coma, montos con punto decimal. */
export function csvMuestras(muestras: C.MuestraVista[], incluirLocal: boolean, extra?: { avisos: C.AvisoTienda[]; notas: C.Nota[] }): string;

// ============================================================================ copia sin conexión (Android)
/** Arma la respuesta de una consulta con la copia (SnapshotResponse + extras + ops pendientes ya aplicadas).
 *  null = no se puede sin la PC (la interfaz muestra "Necesita tu PC encendida"). Claves derivables: BUILD_SPEC §8.3. */
export function deCopia<K extends ClaveConsulta>(clave: K, params: ParamsDe<K>, copia: C.SnapshotResponse, hoy: C.FechaLocal): RespuestaDe<K> | null;
/** Aplica ops pendientes (cola de Android) al bloque `local` de la copia. */
export function aplicarOpsACopia(copia: C.SnapshotResponse, ops: C.OpLocal[], hoy: C.FechaLocal): C.SnapshotResponse;
