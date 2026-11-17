/* __DOBLE_CORTE__ · doble de @/dominio: tablas de vocabulario con los textos exactos de 01_ux §1.5 y §2,
   tonos e íconos de 02 §3.4 y §3.6, y etiquetas de pasos de BUILD_SPEC §6.3.2. */
import type * as C from '@/contrato';
import type { NombreIcono, TonoEstado } from '@/componentes';
import type { AccionEtapa } from '@firmas/dominio';
import { formato } from './formato';

export const ETIQUETA_GRUPO: Readonly<Record<C.GrupoMuestra, string>> = {
  entregada: 'Entregada',
  exenta: 'Exenta',
  en_revision: 'En revisión',
  por_vencer: 'Por vencer',
  pausada: 'Pausada',
  vencida: 'Vencida',
  esperando_aprobacion: 'Esperando aprobación',
  en_camino: 'En camino',
  pedido_cancelado: 'Pedido de muestra cancelado',
  sin_envio: 'Sin envío',
};

/** 02 §3.4 (Por vencer pasa a 'critico' con menos de 48 h: lo decide quien pinta, con fecha_limite_at). */
export const TONO_GRUPO: Readonly<Record<C.GrupoMuestra, TonoEstado>> = {
  entregada: 'ok',
  exenta: 'neutro',
  en_revision: 'info',
  por_vencer: 'atencion',
  pausada: 'neutro',
  vencida: 'atencion',
  esperando_aprobacion: 'info',
  en_camino: 'info',
  pedido_cancelado: 'neutro',
  sin_envio: 'neutro',
};

export const ICONO_GRUPO: Readonly<Record<C.GrupoMuestra, NombreIcono>> = {
  entregada: 'Check',
  exenta: 'CircleMinus',
  en_revision: 'Hourglass',
  por_vencer: 'Clock',
  pausada: 'Pause',
  vencida: 'History',
  esperando_aprobacion: 'Clock',
  en_camino: 'Package',
  pedido_cancelado: 'Ban',
  sin_envio: 'Ban',
};

export const ETIQUETA_ETAPA: Readonly<Record<C.EtapaAvance, string>> = {
  por_planear: 'Por planear',
  planeada: 'Planeada',
  video_listo: 'Video listo',
  programada: 'Programada',
  publicada: 'Publicada',
  no_se_puede: 'No se puede',
};

export const PASO_ETAPA: Readonly<Record<C.EtapaAvance, 0 | 1 | 2 | 3 | 4 | 'no'>> = {
  por_planear: 0,
  planeada: 1,
  video_listo: 2,
  programada: 3,
  publicada: 4,
  no_se_puede: 'no',
};

export const ICONO_ETAPA: Readonly<Record<C.EtapaAvance, NombreIcono>> = {
  por_planear: 'CircleDashed',
  planeada: 'CalendarCheck',
  video_listo: 'Clapperboard',
  programada: 'CalendarClock',
  publicada: 'CircleCheckBig',
  no_se_puede: 'Ban',
};

export const ETIQUETA_SALUD: Readonly<Record<C.SaludTienda, string>> = {
  socio_con_pendientes: 'Socio con pendientes',
  con_pendientes: 'Con pendientes',
  con_plan: 'Con plan',
  socio: 'Socio',
  al_dia: 'Al día',
  vende_contigo: 'Vende contigo',
  solo_solicitudes: 'Solo solicitudes',
  solo_reembolsos: 'Solo reembolsos',
};

export const TONO_SALUD: Readonly<Record<C.SaludTienda, TonoEstado>> = {
  socio_con_pendientes: 'atencion',
  con_pendientes: 'atencion',
  con_plan: 'info',
  socio: 'ok',
  al_dia: 'ok',
  vende_contigo: 'neutro',
  solo_solicitudes: 'neutro',
  solo_reembolsos: 'neutro',
};

export const ETIQUETA_NIVEL: Readonly<Record<C.NivelPrioridad, string>> = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
  no_se_puede_etiquetar: 'No se puede etiquetar',
};

export const ETIQUETA_MOTIVO_NO_SE_PUEDE: Readonly<Record<C.MotivoNoSePuede, string>> = {
  agotado: 'Producto agotado',
  desactivado: 'Producto desactivado',
  no_llego: 'No me llegó',
  incompleta: 'Llegó incompleta',
  no_va_con_mi_contenido: 'No va con mi contenido',
  otro: 'Otro',
};

export const ETIQUETA_FUENTE_PRECIO: Readonly<Record<C.FuentePrecio, string>> = {
  variante: 'Precio de la variante que recibiste',
  vitrina: 'Precio en tu vitrina',
  comision: 'Precio de venta ≈ por comisión',
  lista: 'Precio de lista',
};

/** 01_ux §2.8 (columna UI). El comentario de EstadoOrden en contrato.ts dice 'Congelado'; manda la tabla de 01. */
export const ETIQUETA_ESTADO_ORDEN: Readonly<Record<C.EstadoOrden, string>> = {
  SETTLED: 'Liquidado',
  REFUNDED: 'Reembolsado',
  'To-SETTLE': 'Por liquidar',
  'AWAITING PAYMENT': 'Esperando pago',
  FROZEN: 'Congelado en revisión',
  UNSPECIFIED: 'Sin estado',
  NO_DEVUELTA: 'Ya no aparece en TikTok',
};

/** BUILD_SPEC §6.3.2: etiquetas de W3 y de Ajustes › Sincronización. */
export const ETIQUETA_PASO_SYNC: Readonly<Record<C.PasoSync, string>> = {
  perfil: 'Tu perfil',
  muestras: 'Tus muestras',
  cumplimientos: 'Estado de cada muestra',
  productos: 'Productos e imágenes',
  ordenes: 'Tus ventas recientes',
  vitrina: 'Tu vitrina',
  detalles: 'Detalles de muestras',
  ordenes_anteriores: 'Ventas anteriores',
  productos_ventas: 'Fichas de productos de tus ventas',
  videos: 'Portadas de tus videos',
  imagenes: 'Imágenes',
  clasificacion: 'Ordenando tus pendientes',
};

const CONTENIDO: Readonly<Record<string, string>> = {
  VIDEO: 'Video',
  LIVE: 'En vivo',
  PRE_LIVE: 'Antes del en vivo',
  SHOP: 'Vitrina',
  PROMOTION_PAGE: 'Página de promoción',
  LINKSHARE: 'Enlace compartido',
};

/** VIDEO → 'Video', SHOP → 'Vitrina', … (01_ux §2.8). Desconocido → tal cual. */
export function etiquetaContenido(tipo: string | null): string {
  if (tipo === null) return '—';
  return CONTENIDO[tipo] ?? tipo;
}

const TIPO_MUESTRA: Readonly<Record<string, string>> = {
  FREE_SAMPLE: 'Muestra gratis',
  SAMPLE_COUPON: 'Cupón de muestra',
  SAMPLE_CAMPAIGN: 'Muestra de campaña',
  PLATFORM_FREE_SAMPLE: 'Muestra de TikTok',
  REFUNDABLE_SAMPLE: 'Muestra reembolsable',
};

export function etiquetaTipoMuestra(tipo: string): string {
  return TIPO_MUESTRA[tipo] ?? tipo;
}

export const ICONO_RAZON: Readonly<Record<C.RazonPrioridad, NombreIcono>> = {
  promesa: 'CalendarClock',
  posible_video: 'Search',
  ya_vendes_con_esta_tienda: 'Store',
  ya_lo_vendes: 'Play',
  buena_comision: 'Coins',
  muy_vendido: 'Flame',
  se_vende_bien: 'TrendingUp',
  paquete: 'Box',
  tuvo_pausa: 'Pause',
};

/** Texto del chip de razón con sus cifras (01_ux §2.6). */
export function textoRazon(razon: C.RazonPrioridad, m: C.MuestraVista): string {
  const p = m.producto;
  switch (razon) {
    case 'promesa':
      return m.avisos.promesa ? `Le prometiste el ${formato.fechaConDia(m.avisos.promesa)}` : 'Le prometiste una fecha';
    case 'posible_video':
      return '¿Ya tienes video? Revisa';
    case 'ya_vendes_con_esta_tienda':
      return 'Ya vendes con esta tienda';
    case 'ya_lo_vendes': {
      const n = m.ventas_producto.videos;
      return `Ya lo vendes en ${formato.numero(n)} ${n === 1 ? 'video' : 'videos'}`;
    }
    case 'buena_comision':
      return `Te deja ${formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos)} por venta`;
    case 'muy_vendido':
      return `Muy vendido · ${formato.numero(Math.floor((p.unidades_vendidas_global ?? 0) / 1000))} mil vendidos`;
    case 'se_vende_bien':
      return `Se vende bien · ${formato.numero(p.unidades_vendidas_global ?? 0)} vendidos`;
    case 'paquete':
      // Literal de 01 §2.6 («1» fijo): MuestraVista no trae cuántas muestras comparten main_order_id.
      return 'Llegó junto con 1 muestra más';
    case 'tuvo_pausa':
      // 01 §2.6 pide «Tuvo pausa de {n} días», pero MuestraVista no trae los días de pausa (faltante del contrato).
      return 'Tuvo pausa';
  }
}

const PERMISOS: Readonly<Record<string, string>> = {
  'creator.affiliate.info': 'Ver tu perfil de creador',
  'creator.affiliate_collaboration.read': 'Ver tus colaboraciones de afiliado',
  'creator.showcase.read': 'Ver tu vitrina',
  'creator.showcase.write': 'Administrar tu vitrina',
  'creator.affiliate.link.write': 'Crear enlaces de afiliado',
};

/** Permiso → texto de 01_ux §4.14 A ('creator.showcase.read' → 'Ver tu vitrina'). */
export function textoPermiso(scope: string): string {
  return PERMISOS[scope] ?? scope;
}

export const ETIQUETA_ACCION: Readonly<Record<AccionEtapa, string>> = {
  planear: 'Planear',
  marcar_publicada: 'Marcar publicada',
  video_listo: 'Video listo',
  marcar_programada: 'Marcar programada',
  avisar: 'Avisar a la tienda',
  cambiar_fecha: 'Cambiar fecha',
};
