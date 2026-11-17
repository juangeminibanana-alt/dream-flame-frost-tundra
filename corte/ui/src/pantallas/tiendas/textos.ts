/**
 * Textos de Tiendas y Detalle de tienda (01_ux §4.9, §4.10, §4.16; vocabulario de §1.5). Español de México.
 * Las cifras se arman aquí con `formato` de @/dominio para que la pantalla nunca escriba números a mano.
 */
import { formato } from '@/dominio';

const n = (x: number): string => formato.numero(x);
const plural = (x: number, uno: string, varios: string): string => `${n(x)} ${x === 1 ? uno : varios}`;

export const T = {
  titulo: 'Tiendas',
  tituloDetalle: 'Tienda',
  contexto: (relacion: number, conPendientes: number, socios: number): string =>
    `${plural(relacion, 'tienda con la que tienes relación', 'tiendas con las que tienes relación')} · ${n(conPendientes)} con pendientes · ${plural(socios, 'socio', 'socios')}`,
  avisarTiendas: 'Avisar a mis tiendas',
  buscar: 'Buscar tienda',
  vistas: 'Vista de tiendas',
  ordenar: 'Ordenar',
  ordenarCon: (etiqueta: string): string => `Ordenar: ${etiqueta}`,
  /** Celular: el orden va como ícono; si no es el de siempre, se dice en la línea de abajo. */
  ordenActivo: (etiqueta: string): string => `Orden: ${etiqueta}`,
  orden: {
    atencion: 'Atención primero',
    comision: 'Comisión generada',
    deuda: 'Muestras pendientes',
    nombre: 'Nombre A–Z',
  },
  modo: 'Cómo ver las tiendas',
  modoTabla: 'Tabla',
  modoFichas: 'Fichas',
  tablaEtiqueta: 'Tiendas',
  mostrando: (visibles: number, total: number): string => `Mostrando ${n(visibles)} de ${n(total)}`,

  // Estados (01 §4.9 y §4.16)
  vacioTitulo: 'Aún no hay tiendas',
  vacioTexto: 'Aparecerán cuando sincronices tus muestras y ventas.',
  vacioAccion: 'Sincronizar ahora',
  sinResultados: 'Ninguna tienda en esta vista.',
  sinResultadosTexto: 'Prueba con otra vista o borra la búsqueda.',
  verTodas: 'Ver todas',
  cargando: 'Estamos trayendo tus datos de TikTok Shop…',
  lento: 'Sigue cargando… revisa la conexión con tu PC',
  necesitaPc: 'Necesita tu PC encendida',
  necesitaPcTexto: 'Esta vista se arma en Corte de tu PC. Ábrelo y conéctate al mismo Wi‑Fi.',
  errorTitulo: 'No pudimos mostrar tus tiendas',
  errorDetalleTitulo: 'No pudimos mostrar esta tienda',
  reintentar: 'Reintentar',
  noExiste: 'No encontramos esta tienda',
  noExisteTexto: 'Puede que ya no tenga muestras ni ventas contigo.',
  verTiendas: 'Ver mis tiendas',
  volverTiendas: 'Tiendas',

  // Panel (≥ 1280)
  panelTitulo: 'Tienda',
  verFicha: 'Ver ficha completa',

  // Detalle (01 §4.10)
  idTienda: 'ID de tienda',
  copiarId: 'Copiar ID de tienda',
  idCopiado: 'ID de tienda copiado',
  avisarTienda: 'Avisar a esta tienda',
  planearPendientes: 'Planear sus pendientes',
  masAcciones: 'Más acciones',
  agregarNota: 'Agregar nota',
  kpiTitulo: 'Tu relación con esta tienda',
  porAvisar: 'Por avisar',
  promesasVencidas: (x: number): string => plural(x, 'promesa vencida', 'promesas vencidas'),
  promesasVigentes: (x: number): string => plural(x, 'fecha prometida', 'fechas prometidas'),
  ultimaVenta: (fecha: string): string => `Última venta: ${fecha}`,
  mensajeSugerido: (plantilla: string): string => `Mensaje sugerido: «${plantilla}»`,
  kpiComision: 'Comisión · total',
  kpiComision90: (dinero: string): string => `${dinero} en 90 días`,
  kpiParte: '% de tu comisión',
  kpiParteNota: 'en los últimos 90 días',
  kpiPedidos: 'Pedidos · total',
  kpiPedidosValidos: 'Pedidos válidos',
  kpiPedidosNota: (tasa: string, reembolsados: number): string => `${tasa} reembolsados · ${plural(reembolsados, 'pedido', 'pedidos')}`,
  kpiPedidosNotaSinSerie: 'sin contar reembolsos',
  kpiValor: 'Valor recibido',
  // Espacio duro entre cifra y palabra: si no cabe, el renglón se parte en un «·», nunca «0 / entregadas».
  kpiValorNota: (recibidas: number): string =>
    recibidas > 0 ? `de ${plural(recibidas, 'muestra recibida', 'muestras recibidas')}` : 'sin muestras recibidas',
  /** T4 de 01 §6.2 (en los hechos del héroe). */
  muestrasResumen: (recibidas: number, pendientes: number, entregadas: number): string => 'Muestras: ' +
    [plural(recibidas, 'recibida', 'recibidas'), plural(pendientes, 'pendiente', 'pendientes'), plural(entregadas, 'entregada', 'entregadas')]
      .map((s) => s.replace(' ', ' '))
      .join(' · '),
  sinDato: '—',
  leDebes: (x: number): string => `Lo que le debes (${n(x)})`,
  planearLas: (x: number): string => (x === 1 ? 'Planear la muestra' : `Planear las ${n(x)}`),
  leDebesVacio: 'No le debes videos a esta tienda.',
  tablaPendientes: 'Muestras pendientes de esta tienda',
  prometiste: 'Lo que le prometiste',
  prometisteVacio: 'Todavía no le has enviado avisos a esta tienda.',
  avisoEnviado: (fecha: string): string => `Aviso enviado el ${fecha}`,
  quitarAviso: 'Quitar este aviso',
  avisoQuitado: 'Aviso quitado',
  deshacer: 'Deshacer',
  prepararNuevaFecha: 'Preparar mensaje "Nueva fecha"',
  promesa: (fecha: string): string => `Le prometiste el ${fecha}`,
  promesaVigente: 'Vigente',
  promesaVencida: 'Vencida',
  promesaCumplida: (fecha: string): string => `Cumplida el ${fecha}`,
  muestraDesconocida: 'Muestra',
  cumpliste: 'Lo que ya cumpliste',
  cumplisteVacio: 'Todavía no hay videos cumplidos para esta tienda.',
  ventas: 'Ventas con esta tienda',
  graficaMes: 'Comisión por mes',
  graficaNota: (etiqueta: string, dinero: string): string => `Mejor mes: ${etiqueta} · ${dinero}`,
  /** En el celular la gráfica muestra solo los últimos meses (la tabla gemela, todos). */
  graficaUltimos: (meses: number, mejor: string | null): string => `Últimos ${n(meses)} meses${mejor ? ` · ${mejor.charAt(0).toLocaleLowerCase('es-MX')}${mejor.slice(1)}` : ''}`,
  ariaMes: (etiqueta: string, dinero: string, pedidos: number): string => `${etiqueta}: ${dinero} de comisión, ${plural(pedidos, 'pedido', 'pedidos')}`,
  colMes: 'Mes',
  colComision: 'Comisión estimada',
  colPedidos: 'Pedidos',
  enCurso: 'en curso',
  /** Una sola columna no es gráfica (02 §9): con ventas solo en el mes en curso se dice la cifra. */
  unSoloMes: (mes: string, dinero: string, pedidos: number): string =>
    `Todas sus ventas son de ${mes} (en curso): ${dinero} de comisión · ${plural(pedidos, 'pedido', 'pedidos')}.`,
  meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  productosTop: 'Productos que más te vende',
  productoCifra: (unidades: number): string => plural(unidades, 'unidad', 'unidades'),
  videosTop: 'Videos que más venden sus productos',
  videoNombre: (id: string): string => `Video ${id}`,
  videoUnidades: (u: number): string => plural(u, 'unidad', 'unidades'),
  videoEtiqueta: (lugar: number, dinero: string, unidades: number, producto: string): string =>
    `Video ${n(lugar)}: ${dinero} de comisión, ${plural(unidades, 'unidad', 'unidades')}. Producto: ${producto}`,
  fotoDelProducto: 'Foto del producto',
  sinVentas: 'Esta tienda todavía no te ha generado ventas.',
  historial: 'Historial de solicitudes',
  historialVacio: 'No hay solicitudes a esta tienda.',
  tablaHistorial: 'Solicitudes a esta tienda',
  verMas: (x: number): string => `Ver ${plural(x, 'solicitud más', 'solicitudes más')}`,
  notas: 'Notas sobre la tienda',
  notasPlaceholder: 'Cómo prefieren los videos, con quién hablas, acuerdos…',
  tiendaNombre: (nombre: string): string => nombre,
} as const;

/** Etiqueta corta de cada vista (chips de 01 §4.9). */
export const ETIQUETA_VISTA = {
  con_relacion: 'Con relación',
  atencion: 'Necesitan atención',
  por_avisar: 'Por avisar',
  promesas_vencidas: 'Promesas vencidas',
  con_plan: 'Con plan',
  socios: 'Socios',
  al_dia: 'Al día',
  vende_contigo: 'Vende contigo',
  solo_solicitudes: 'Solo solicitudes',
  solo_reembolsos: 'Solo reembolsos',
} as const;
