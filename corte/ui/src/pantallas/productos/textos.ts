/**
 * Textos de Productos y Detalle de producto (01_ux §4.13, §4.16, §6.5; vocabulario de §1.5). Español de México.
 * Las cifras se arman aquí con `formato` de @/dominio: la pantalla nunca escribe números a mano.
 */
import { formato } from '@/dominio';

const n = (x: number): string => formato.numero(x);
const plural = (x: number, uno: string, varios: string): string => `${n(x)} ${x === 1 ? uno : varios}`;

export const T = {
  titulo: 'Productos',
  contexto: (conVentas: number, deMuestra: number | null, sinVentas: number | null): string =>
    [
      plural(conVentas, 'producto con ventas', 'productos con ventas'),
      ...(deMuestra !== null ? [plural(deMuestra, 'producto de muestra recibido', 'productos de muestra recibidos')] : []),
      ...(sinVentas !== null ? [`${n(sinVentas)} todavía sin ventas`] : []),
    ].join(' · '),

  // Segmentos (01 §4.13)
  segmentos: 'Qué productos ver',
  segVendidos: 'Más vendidos',
  segSinVentas: 'Muestras sin ventas',
  segTodos: 'Todos',
  segVendidosCorto: 'Vendidos',
  segSinVentasCorto: 'Sin ventas',
  vista: 'Cómo ver los productos',
  vistaCuadricula: 'Cuadrícula',
  vistaTabla: 'Tabla',
  tablaEtiqueta: 'Productos con ventas',
  rejillaVendidos: 'Productos con ventas, de más a menos comisión',
  rejillaSinVentas: 'Muestras recibidas que todavía no venden',
  rejillaTodos: 'Todos tus productos',
  buscar: 'Buscar producto o tienda',
  filtros: 'Filtros de productos',
  filtroConVentas: 'Con ventas',
  filtroSinVentas: 'Sin ventas',
  filtroFueMuestra: 'Fue muestra',
  filtroVitrina: 'En tu vitrina',
  mostrando: (visibles: number, total: number): string => `Mostrando ${n(visibles)} de ${n(total)}`,
  sinVentasResumen: (recibidos: number, vendieron: number): string =>
    `De ${plural(recibidos, 'producto de muestra que recibiste', 'productos de muestra que recibiste')}, ${n(vendieron)} ya ${vendieron === 1 ? 'vendió' : 'vendieron'} contigo.`,

  // Tarjeta
  unidades: (u: number): string => plural(u, 'unidad', 'unidades'),
  videos: (v: number): string => plural(v, 'video', 'videos'),
  fueMuestra: 'Fue muestra',
  enVitrina: 'En tu vitrina',
  sinVentas: 'Sin ventas',
  sinVentasTodavia: 'Sin ventas todavía',
  publicadoSinVentas: (dias: number): string => `Publicado hace ${plural(dias, 'día', 'días')} sin ventas`,
  planearVideo: 'Planear video',
  tuAvance: 'Tu avance:',

  // Estados (01 §4.13 y §4.16)
  nadaTitulo: 'Aún no hay productos',
  nadaTexto: 'Aparecerán con su foto cuando sincronices tus muestras y ventas.',
  sincronizar: 'Sincronizar ahora',
  vacioTitulo: 'Aún no hay productos con ventas',
  vacioTexto: 'Cuando vendas un producto con tus videos, aparecerá aquí con su foto.',
  sinVentasVacioTitulo: 'Todas tus muestras ya vendieron',
  sinVentasVacioTexto: 'Cada producto que te enviaron ya generó al menos una venta.',
  sinResultados: 'Ningún producto con estos filtros',
  sinResultadosTexto: 'Prueba con otro filtro o borra la búsqueda.',
  quitarFiltros: 'Quitar filtros',
  cargando: 'Estamos trayendo tus datos de TikTok Shop…',
  lento: 'Sigue cargando… revisa la conexión con tu PC',
  necesitaPc: 'Necesita tu PC encendida',
  necesitaPcTexto: 'Esta vista se arma en Corte de tu PC. Ábrelo y conéctate al mismo Wi‑Fi.',
  errorTitulo: 'No pudimos mostrar tus productos',
  errorDetalleTitulo: 'No pudimos mostrar este producto',
  noExiste: 'No encontramos este producto',
  noExisteTexto: 'Puede que ya no tenga ventas ni muestras contigo.',
  verProductos: 'Ver mis productos',
  reintentar: 'Reintentar',

  // Detalle (01 §4.13)
  volver: 'Productos',
  sinFicha: 'Sin ficha de TikTok Shop para este producto (puede que ya no esté en colaboración abierta).',
  comisionAnuncios: (tasa: string): string => `Comisión por anuncios de la tienda: ${tasa}`,
  vendidosGlobal: (u: number): string => `${plural(u, 'vendido', 'vendidos')} en TikTok Shop (todas las cuentas)`,
  conInventario: 'Con inventario',
  sinInventario: 'Sin inventario',
  abrirTikTokShop: 'Abrir en TikTok Shop',
  abrirAppTikTok: 'Abrir en la app de TikTok',
  abrirFallo: 'No se pudo abrir TikTok',
  idProducto: 'ID del producto',
  copiarId: 'Copiar ID del producto',
  idCopiado: 'ID del producto copiado',
  categoria: 'Categoría',
  tusVentas: 'Tus ventas',
  tusVentasVacio: 'Este producto todavía no se vende con tus videos.',
  kpiComision: 'Comisión · total',
  kpiUnidades: 'Unidades',
  kpiPedidos: 'Pedidos',
  kpiReembolsos: 'Reembolsos',
  kpiVideos: 'Videos que lo venden',
  kpiPedidosNota: (validos: number): string => plural(validos, 'válido', 'válidos'),
  kpiReembolsosNota: (r: number): string => plural(r, 'pedido', 'pedidos'),
  kpiVentas: (dinero: string): string => `≈ ${dinero} en ventas`,
  graficaMes: 'Comisión por mes',
  graficaNota: (etiqueta: string, dinero: string): string => `Mejor mes: ${etiqueta} · ${dinero}`,
  ariaMes: (etiqueta: string, dinero: string, unidades: number): string => `${etiqueta}: ${dinero} de comisión, ${plural(unidades, 'unidad', 'unidades')}`,
  colMes: 'Mes',
  colComision: 'Comisión estimada',
  colUnidades: 'Unidades',
  enCurso: 'en curso',
  /** Una sola columna no es gráfica (02 §9): con ventas solo en el mes en curso se dice la cifra. */
  unSoloMes: (mes: string, dinero: string, unidades: number): string =>
    `Todas sus ventas son de ${mes} (en curso): ${dinero} de comisión · ${plural(unidades, 'unidad', 'unidades')}.`,
  meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  sinSerie: 'La gráfica por mes necesita tu PC encendida.',
  videos_: 'Videos que lo venden',
  videosNota: 'Cifras totales de cada video, con todos sus productos.',
  // rev. 5 · Con las métricas de TikTok: vistas y conversión de cada video (del video completo).
  videosNotaMetricas: 'Cifras totales de cada video, con todos sus productos. Las vistas son de TikTok.',
  vistas: (cifra: string): string => `${cifra} vistas`,
  porMilPedidos: 'pedidos',
  porMilResto: 'por 1,000 vistas',
  sinCifrasTikTok: 'Sin cifras de TikTok',
  sinCifrasTikTokAyuda: 'TikTok no da cifras de este video: puede ser privado, estar borrado o ser de otra cuenta.',
  metricasDe: (vistas: string, porMil: string | null): string => `${vistas} vistas${porMil ? `, ${porMil} pedidos por 1,000 vistas` : ''}`,
  videosVacio: 'Ningún video tuyo vende este producto todavía.',
  listaCorta: (visibles: number, total: number): string => `Mostrando ${n(visibles)} de ${n(total)} · el resto con tu PC encendida`,
  muestras: 'Muestras de este producto',
  muestrasVacio: 'No pediste muestras de este producto.',
  notas: 'Notas del producto',
  notasAyuda: 'Tallas, colores, ideas para tu video…',
  nombreVideo: (idCorto: string): string => `Video ${idCorto}`,
  /** Contexto del encabezado del detalle cuando el título se acortó: el nombre completo y la tienda. */
  contextoDetalle: (nombre: string, tienda: string | null): string => (tienda ? `${nombre} · ${tienda}` : nombre),
  fotoDelProducto: 'Foto del producto',
  etiquetaVideo: (dinero: string, unidades: number, nombre: string): string =>
    `${dinero} de comisión, ${plural(unidades, 'unidad', 'unidades')}. Producto: ${nombre}`,

  // ------------------------------------------------------------------ ficha completa (contrato rev. 4, 15/11)
  // Galería de tu vitrina
  galeria: 'Fotos de tu vitrina',
  galeriaCuenta: (n: number): string => `${plural(n, 'foto', 'fotos')} de tu vitrina`,
  verFoto: (i: number, total: number): string => `Ver la foto ${n(i)} de ${n(total)}`,
  fotoDe: (i: number, total: number, nombre: string): string => `${nombre}, foto ${n(i)} de ${n(total)}`,

  // Comisión
  comision: 'Comisión',
  comisionNota: 'Cuánto te paga cada venta de este producto',
  enTusPedidos: 'En tus pedidos',
  enTusPedidosNota: (participacion: string, lineas: number): string => `Así se pagó el ${participacion} de tus ${plural(lineas, 'pedido válido', 'pedidos válidos')}`,
  enTusPedidosUnica: (lineas: number): string => `Así se pagaron tus ${plural(lineas, 'pedido válido', 'pedidos válidos')}`,
  laMasComun: 'La más común',
  planAbierto: 'Plan abierto',
  planAbiertoNota: 'Lo que paga a cualquier creador',
  planDirigido: 'Plan dirigido',
  porVentaAprox: (dinero: string): string => `≈ ${dinero} por venta`,
  masPlanes: (k: number): string => `y ${plural(k, 'plan dirigido más', 'planes dirigidos más')}`,
  diferenciaMas: (real: string, puntos: number, plan: string): string =>
    `Tus ventas pagan ${real}: ${n(puntos)} ${puntos === 1 ? 'punto' : 'puntos'} más que el plan abierto (${plan}).`,
  diferenciaMenos: (real: string, puntos: number, plan: string): string =>
    `Tus ventas pagan ${real}: ${n(puntos)} ${puntos === 1 ? 'punto' : 'puntos'} menos que el plan abierto (${plan}).`,
  diferenciaIgual: (plan: string): string => `Tus ventas pagan lo mismo que el plan abierto (${plan}).`,
  tasasTitulo: 'Tasas que pagaron tus pedidos',
  tasaPedidos: (lineas: number): string => plural(lineas, 'pedido', 'pedidos'),
  colTasa: 'Tasa',
  colPedidos: 'Pedidos',
  colParte: 'Parte',
  conCampana: (lineas: number, campanas: number): string =>
    `${plural(lineas, 'pedido llegó', 'pedidos llegaron')} con ${campanas === 1 ? 'una campaña' : `${n(campanas)} campañas`} de la tienda: por eso la tasa puede ser distinta a la del plan.`,

  // Precio
  precio: 'Precio',
  precioNotaVitrina: 'Lo que dice tu vitrina hoy',
  precioNotaFicha: 'De su ficha en TikTok Shop',
  precioLista: 'Precio de lista',
  precioVenta: 'Precio de venta',
  precioVentaAprox: 'Precio de venta aproximado',
  precioPlataforma: 'Con descuento de TikTok Shop',
  precioPromedio: 'Tus compradores pagaron',
  precioPromedioNota: (unidades: number): string => `Promedio por unidad de ${plural(unidades, 'unidad vendida', 'unidades vendidas')}`,
  descuento: (pct: string): string => `Hoy se vende ${pct} abajo del precio de lista.`,
  agotadoVitrina: 'Agotado en tu vitrina',
  ocultoVitrina: 'Oculto en tu vitrina',

  // Muestra
  tusSolicitudes: 'Tus solicitudes',
  anteriores: 'Solicitudes anteriores',
  anterioresNota: 'TikTok ya no las muestra en tu lista de muestras; las encontramos por su entrega.',
  pedidaEl: (fecha: string): string => `Pedida el ${fecha}`,
  sinVariante: 'Sin variante',
  revisado: (cuando: string): string => `TikTok lo revisó ${cuando}`,
  puedesPedirOtra: 'Puedes pedir otra',
  skusTitulo: 'Variantes para pedir muestra',
  skusResumen: (disponibles: number, total: number): string => `${n(disponibles)} de ${n(total)} disponibles`,
  disponible: 'Disponible',
  unica: 'Única',
  verTodas: (k: number): string => `Ver las ${n(k)}`,
  verMenos: 'Ver menos',
  listaSkus: 'Variantes y si puedes pedirlas',

  // Origen de las ventas
  origen: 'De dónde vienen tus ventas',
  origenNota: (lineas: number): string => `${plural(lineas, 'pedido', 'pedidos')} con su origen registrado`,
  origenContenido: 'Tipo de contenido',
  origenEnlace: 'Tipo de enlace',
  colOrigen: 'Origen',
  origenSinPermiso: 'Origen de cada venta: requiere un permiso extra en Partner Center',

  // Parecidos en el marketplace
  parecidos: 'Parecidos en el marketplace',
  parecidosNota: (palabras: readonly string[]): string =>
    palabras.length > 0
      ? `Parecidos por palabras del título (${palabras.map((p) => `«${p}»`).join(', ')}). La relevancia la decide TikTok.`
      : 'Parecidos por palabras del título. La relevancia la decide TikTok.',
  ordenParecidos: 'Ordenar parecidos',
  porComision: 'Mejor comisión',
  porVendidos: 'Más vendidos',
  rejillaParecidos: 'Productos parecidos del marketplace',
  esteProducto: (partes: readonly string[]): string => `Este producto: ${partes.join(' · ')}`,
  esteProductoComision: (tasa: string): string => `${tasa} de comisión`,
  vendidosCorto: (u: number): string => `${n(u)} vendidos`,
  enCorte: 'En Corte',
  pagaMas: 'Paga más',
  sinTasa: 'Sin dato',
  verTodosParecidos: (k: number): string => `Ver los ${n(k)}`,
  verMenosParecidos: 'Ver menos',
  consultadoEl: (fecha: string): string => `Consultado el ${fecha}`,
} as const;
