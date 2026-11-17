/**
 * FIRMAS NORMATIVAS · módulo `@/componentes` (lo implementa ui-componentes en ui/src/componentes/). BUILD_SPEC §8.5.
 * Sistema de diseño de 02_visual.md, SIN lógica de negocio: reciben textos ya formateados (usa `formato` de @/dominio)
 * y solo usan tokens semánticos de tokens.css (nunca un hex suelto). Todos aceptan `className` opcional.
 * rev. 3.1: Foto/MiniaturaVideo/TarjetaProducto leen LQIP y color de `registroImagenes` (@/dominio) y aceptan `meta`
 * explícito (C47); nuevos ReproductorTikTok (C43, solo Windows) y BurbujaRecorrido (01 §4.15).
 */
import type { ReactNode, ReactElement } from 'react';
import type { UrlImagen, FechaLocal, EpochS, ImagenMeta } from '@/contrato';

// ============================================================================ íconos (02 §6, lucide-react 1.72.0)
export type NombreIcono =
  // navegación
  | 'House' | 'Package' | 'Store' | 'ChartColumn' | 'SquarePlay' | 'Shirt' | 'Ellipsis' | 'Settings'
  // acciones
  | 'Search' | 'RefreshCw' | 'Copy' | 'ExternalLink' | 'Download' | 'QrCode' | 'ArrowDownUp' | 'CalendarDays'
  | 'MessageCircle' | 'X' | 'ChevronLeft' | 'ChevronRight' | 'ChevronDown' | 'ArrowLeft' | 'ArrowRight' | 'Plus'
  | 'Pencil' | 'Trash2' | 'LayoutList' | 'LayoutGrid' | 'Camera' | 'Keyboard' | 'Bell' | 'Link' | 'Share2' | 'Pin'
  | 'Maximize2' | 'Undo2' | 'Moon' | 'Sun' | 'Eye' | 'EyeOff' | 'Lock' | 'CircleHelp' | 'Image' | 'Minus'
  // estados
  | 'CircleAlert' | 'History' | 'Clock' | 'Hourglass' | 'Check' | 'Info' | 'CircleMinus' | 'Ban' | 'Pause' | 'RotateCcw'
  // etapas
  | 'CircleDashed' | 'CalendarCheck' | 'Clapperboard' | 'CalendarClock' | 'CircleCheckBig' | 'MessageCircleWarning'
  // razones
  | 'Play' | 'Coins' | 'Flame' | 'TrendingUp' | 'Box'
  // categorías (respaldo de imagen) · 'Gorra' es el ícono propio de 02 §6
  | 'SportShoe' | 'Wallet' | 'Tag' | 'Gorra'
  // otros
  | 'Smartphone' | 'Monitor' | 'Wifi' | 'Sparkles' | 'Star';
export interface IconoProps {
  nombre: NombreIcono;
  /** px; 16/20/24 (táctil 22). Por omisión 20. */
  tamano?: 14 | 16 | 18 | 20 | 22 | 24;
  /** Si existe, el ícono no es decorativo (role=img + aria-label). Si no, aria-hidden. */
  etiqueta?: string;
  className?: string;
}
export function Icono(p: IconoProps): ReactElement;

// ============================================================================ botones (02 §7.1)
export type VarianteBoton = 'primario' | 'secundario' | 'fantasma' | 'peligro';
export interface BotonProps {
  children: ReactNode;
  variante?: VarianteBoton;
  tamano?: 'sm' | 'md' | 'lg';
  icono?: NombreIcono;
  iconoFinal?: NombreIcono;
  cargando?: boolean;
  deshabilitado?: boolean;
  anchoCompleto?: boolean;
  tipo?: 'button' | 'submit';
  /** Atajo que se muestra en el tooltip (Windows), p. ej. 'E'. No registra el atajo (usa useAtajos). */
  atajo?: string;
  alPulsar?: () => void;
  'aria-label'?: string;
  className?: string;
}
export function Boton(p: BotonProps): ReactElement;
export interface BotonIconoProps {
  icono: NombreIcono;
  /** aria-label y tooltip (obligatorio). */
  etiqueta: string;
  variante?: 'fantasma' | 'secundario';
  tamano?: 'sm' | 'md';
  activo?: boolean;
  /** Gira mientras sea true (único bucle permitido: sincronizando). */
  girando?: boolean;
  deshabilitado?: boolean;
  alPulsar?: () => void;
  className?: string;
}
export function BotonIcono(p: BotonIconoProps): ReactElement;
export function Kbd(p: { children: ReactNode; className?: string }): ReactElement;

// ============================================================================ chips, insignias, punto vivo (02 §7.2)
/** Tonos semánticos de tokens.css: ok · info · atencion (ámbar) · critico (rojo: solo riesgo real) · neutro · marca. */
export type TonoEstado = 'ok' | 'info' | 'atencion' | 'critico' | 'neutro' | 'marca';
export interface ChipProps {
  tono: TonoEstado;
  children: ReactNode;
  icono?: NombreIcono;
  /** 'TikTok:' · 'Tu avance:' — se pinta atenuado antes del texto. */
  prefijo?: string;
  tamano?: 'md' | 'lg';
  titulo?: string;
  className?: string;
}
export function Chip(p: ChipProps): ReactElement;
/** Chip de etapa con la escala lima de 02 §3.6 (paso 0 = pista vacía, 1..4 = lima, 'no' = gris oscuro). */
export function ChipEtapa(p: { paso: 0 | 1 | 2 | 3 | 4 | 'no'; icono: NombreIcono; children: ReactNode; prefijo?: string; className?: string }): ReactElement;
export interface ChipFiltroProps {
  activo: boolean;
  alCambiar: (activo: boolean) => void;
  children: ReactNode;
  conteo?: number;
  className?: string;
}
export function ChipFiltro(p: ChipFiltroProps): ReactElement;
export interface InsigniaProps {
  valor: number;
  variante: 'atencion' | 'critica' | 'discreta' | 'marca';
  /** '99+' por encima. Por omisión 99. */
  maximo?: number;
  /** aria-label completo: '12 muestras pendientes'. */
  etiqueta: string;
  className?: string;
}
export function Insignia(p: InsigniaProps): ReactElement;
/** `pulsos` cambia de valor → 3 halos y se detiene (02 §7.2). */
export function PuntoVivo(p: { estado: 'ok' | 'sincronizando' | 'error' | 'inactivo'; pulsos?: number; className?: string }): ReactElement;

// ============================================================================ superficies y estructura
export function Tarjeta(p: { children: ReactNode; padding?: 'ninguno' | 'normal' | 'amplio'; alPulsar?: () => void; etiqueta?: string; className?: string }): ReactElement;
/** Panel de firma "Ponte al día" (único con chaflán de 18 px, 02 §7.23). */
export function PanelFirma(p: { children: ReactNode; className?: string }): ReactElement;
/** Banda abierta sin tarjeta, con encabezado title3 y acción opcional "Ver todos ›". */
export function Banda(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; id?: string; className?: string }): ReactElement;
export interface EncabezadoPantallaProps {
  titulo: string;
  /** Línea de contexto bajo el título (body-sm, text-2). */
  contexto?: ReactNode;
  acciones?: ReactNode;
  volver?: { a: string; etiqueta?: string };
  className?: string;
}
/** Windows: 56 px pegajoso, vidrio al hacer scroll. Android: título grande que colapsa a 56 dp (02 §7.9). */
export function EncabezadoPantalla(p: EncabezadoPantallaProps): ReactElement;
export function Divisor(p: { vertical?: boolean; className?: string }): ReactElement;

// ============================================================================ KPI (02 §7.3)
export interface VariacionKpi {
  /** '−21 % vs. 30 días anteriores'. */
  texto: string;
  sentido: 'favorable' | 'desfavorable' | 'neutro';
  direccion: 'sube' | 'baja' | 'igual';
}
export interface KpiProps {
  /** ≤ 20 caracteres CON su periodo: 'Comisión · 30 días'. */
  etiqueta: string;
  valor: string;
  variacion?: VariacionKpi | null;
  nota?: string;
  /** Sparkline de 12 puntos (opcional). */
  serie?: number[];
  resumenSerie?: string;
  alPulsar?: () => void;
  className?: string;
}
export function Kpi(p: KpiProps): ReactElement;
/** Banda de dinero sin tarjeta, KPI separados por filetes verticales (subgrid). */
export function BandaKpi(p: { titulo: string; children: ReactNode; accion?: { etiqueta: string; a: string }; className?: string }): ReactElement;

// ============================================================================ imágenes (02 §8)
export type ProporcionFoto = '1:1' | '4:5' | '9:16';
export interface FotoProps {
  url: UrlImagen | null;
  alt: string;
  /** Ancho mostrado en px CSS: elige la variante con dominio.varianteParaAncho(ancho, devicePixelRatio). */
  anchoCss: number;
  proporcion?: ProporcionFoto;
  /** Para el mosaico de respaldo (tono e iniciales de la tienda). */
  tienda?: string | null;
  /** category_chains hoja o ruta: ícono del mosaico. */
  categoria?: string | null;
  radio?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Rótulo discreto sobre la foto, p. ej. 'Foto del producto'. */
  rotulo?: string;
  /** 'alta' = sin lazy (héroe del primer pliegue). */
  prioridad?: 'alta' | 'normal';
  /** Windows: se puede arrastrar a otra app (DownloadURL con la variante original). */
  arrastrable?: { nombreArchivo: string };
  /** rev. 3.1 · Metadatos explícitos (galería, pruebas). Si falta, se leen de registroImagenes (@/dominio) por `url`. */
  meta?: ImagenMeta;
  className?: string;
}
/** Pozo con color dominante + LQIP (meta explícito o registroImagenes) → foto con fundido de 120 ms → mosaico si no hay
 *  foto o falla. Con '?v=0' (imagen aún no descargada, C45) pinta el pozo neutro y la pide igual. */
export function Foto(p: FotoProps): ReactElement;
export function MosaicoTienda(p: { tienda: string; categoria?: string | null; anchoCss: number; proporcion?: ProporcionFoto; className?: string }): ReactElement;
/** Iniciales + color determinista (02 §7.17). Debajo de 20 px: cuadrado de 10 del tono. */
export function AvatarTienda(p: { nombre: string; tamano: 16 | 20 | 24 | 32 | 40 | 56; className?: string }): ReactElement;
export function AvatarCuenta(p: { url: UrlImagen | null; username: string; tamano: 32 | 40; className?: string }): ReactElement;
export interface MiniaturaVideoProps {
  /** Portada (foto del producto, contrato rev. 3). null → póster tipográfico. */
  url: UrlImagen | null;
  /** 'Foto del producto' cuando la portada es del producto. */
  rotulo?: string;
  ranking?: number;
  /** Ya formateados: '$12,345', '123 unidades', nombre corto del producto, '24 ago'. */
  comision: string;
  unidades: string;
  nombre: string;
  fechaPoster: string;
  tienda: string | null;
  anchoCss: number;
  /** aria-label completo del enlace (02 §8.5). */
  etiqueta: string;
  alPulsar?: () => void;
  /** rev. 3.1 · Como FotoProps.meta. */
  meta?: ImagenMeta;
  className?: string;
}
export function MiniaturaVideo(p: MiniaturaVideoProps): ReactElement;
export interface TarjetaProductoProps {
  imagen: UrlImagen | null;
  /** rev. 3.1 · Como FotoProps.meta. */
  meta?: ImagenMeta;
  nombre: string;
  tienda: string | null;
  categoria?: string | null;
  cifraPrincipal: string;
  cifraSecundaria?: string;
  chips?: ReactNode;
  ranking?: number;
  alPulsar?: () => void;
  className?: string;
}
export function TarjetaProducto(p: TarjetaProductoProps): ReactElement;
/**
 * rev. 3.1 (C4, C43) · Reproductor oficial bajo demanda, SOLO Windows (quien lo usa comprueba esWindows()). Muestra un
 * póster con [Reproducir aquí] y, al pulsar, un <iframe src="https://www.tiktok.com/player/v1/{contentId}"> con
 * sandbox="allow-scripts allow-same-origin allow-presentation" (sin popups ni top-navigation),
 * referrerpolicy="strict-origin-when-cross-origin", allow="autoplay; fullscreen" y title accesible. Si no carga en 8 s o
 * no hay internet: "No se pudo reproducir aquí" + [Abrir en TikTok] (alAbrirFuera).
 */
export function ReproductorTikTok(p: { contentId: string; titulo: string; alAbrirFuera: () => void; className?: string }): ReactElement;

// ============================================================================ tablas y listas (02 §7.5–7.6)
export interface ColumnaTabla<T> {
  id: string;
  titulo: string;
  /** px o fr ('2fr'). */
  ancho?: number | string;
  alineacion?: 'izquierda' | 'derecha' | 'centro';
  celda: (fila: T) => ReactNode;
  ordenable?: boolean;
  /** Se oculta en clase de ancho 'media'. */
  prescindible?: boolean;
}
export interface TablaProps<T> {
  filas: T[];
  columnas: ColumnaTabla<T>[];
  idFila: (fila: T) => string;
  /** Nombre accesible del grid. */
  etiqueta: string;
  seleccionada?: string | null;
  alSeleccionar?: (fila: T) => void;
  /** Enter o doble clic. */
  alAbrir?: (fila: T) => void;
  orden?: { columna: string; direccion: 'asc' | 'desc' };
  alOrdenar?: (columna: string) => void;
  /** Por omisión: virtual con ≥ 100 filas. */
  virtual?: boolean;
  /** Acciones que aparecen en hover/foco/selección. */
  accionesFila?: (fila: T) => ReactNode;
  esNueva?: (fila: T) => boolean;
  vacio?: ReactNode;
  /** Clave para restaurar el scroll al volver. */
  claveScroll?: string;
  className?: string;
}
/** role=grid, J/K y ↑/↓ mueven la selección, Enter abre (01_ux §3.6). */
export function Tabla<T>(p: TablaProps<T>): ReactElement;
export interface ListaVirtualProps<T> {
  items: T[];
  idItem: (item: T) => string;
  render: (item: T, indice: number) => ReactNode;
  etiqueta: string;
  /** px; por omisión lee --row-h (vuelve a medir si cambia --fs o la densidad). */
  altoEstimado?: number;
  claveScroll?: string;
  className?: string;
}
export function ListaVirtual<T>(p: ListaVirtualProps<T>): ReactElement;

// ============================================================================ controles (02 §7.10–7.11)
export interface OpcionSegmentado<V extends string> { valor: V; etiqueta: string; conteo?: number; icono?: NombreIcono }
export interface SegmentadoProps<V extends string> {
  opciones: OpcionSegmentado<V>[];
  valor: V;
  alCambiar: (valor: V) => void;
  etiqueta: string;
  anchoCompleto?: boolean;
  className?: string;
}
export function Segmentado<V extends string>(p: SegmentadoProps<V>): ReactElement;
export interface CampoTextoProps {
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  tipo?: 'text' | 'search' | 'url' | 'password';
  placeholder?: string;
  ayuda?: string;
  error?: string | null;
  /** Etiqueta solo para lectores de pantalla. */
  etiquetaOculta?: boolean;
  autoFoco?: boolean;
  maximo?: number;
  monoespaciado?: boolean;
  alEnter?: () => void;
  className?: string;
}
export function CampoTexto(p: CampoTextoProps): ReactElement;
export function AreaTexto(p: Omit<CampoTextoProps, 'tipo' | 'alEnter'> & { filas?: number; contador?: boolean }): ReactElement;
export function Interruptor(p: { activo: boolean; alCambiar: (activo: boolean) => void; etiqueta: string; descripcion?: string; deshabilitado?: boolean; className?: string }): ReactElement;
export function Casilla(p: { marcada: boolean; alCambiar: (marcada: boolean) => void; etiqueta: string; indeterminada?: boolean; deshabilitado?: boolean; className?: string }): ReactElement;
export function OpcionRadio<V extends string>(p: { opciones: { valor: V; etiqueta: string; descripcion?: string }[]; valor: V | null; alCambiar: (valor: V) => void; etiqueta: string; className?: string }): ReactElement;
export function SelectorNumero(p: { valor: number; min: number; max: number; alCambiar: (valor: number) => void; etiqueta: string; className?: string }): ReactElement;
/** Chips L M M J V S D; `dias` con 0 = lunes … 6 = domingo. */
export function ChipsDias(p: { dias: number[]; alCambiar: (dias: number[]) => void; etiqueta: string; className?: string }): ReactElement;
export interface SelectorFechaProps {
  etiqueta: string;
  valor: FechaLocal | null;
  alCambiar: (fecha: FechaLocal) => void;
  min?: FechaLocal;
  max?: FechaLocal;
  /** Chips rápidos: 'Hoy', 'Mañana', 'En 3 días (dom 15 nov)'. */
  atajos?: { etiqueta: string; fecha: FechaLocal }[];
  /** Capacidad por día para pintar '2/3' (Agenda, Planear). */
  ocupacion?: Record<FechaLocal, { usados: number; capacidad: number }>;
  className?: string;
}
export function SelectorFecha(p: SelectorFechaProps): ReactElement;
export function SelectorFechaHora(p: { etiqueta: string; valor: EpochS | null; alCambiar: (t: EpochS) => void; min?: EpochS; className?: string }): ReactElement;
export interface OpcionMenu { id: string; etiqueta: string; icono?: NombreIcono; peligro?: boolean; deshabilitado?: boolean; alPulsar: () => void }
/** Menú ⋯ (Windows: popover; Android: hoja inferior). */
export function Menu(p: { etiqueta: string; opciones: OpcionMenu[]; icono?: NombreIcono; disparador?: 'icono' | 'boton'; className?: string }): ReactElement;
/** Campo "Buscar" de la barra (Windows) que abre la paleta global de ui-base al enfocar. */
export function CampoBusqueda(p: { alAbrir: () => void; className?: string }): ReactElement;

// ============================================================================ capas (02 §7.12–7.14)
export interface ModalProps {
  abierto: boolean;
  titulo: string;
  descripcion?: string;
  alCerrar: () => void;
  children?: ReactNode;
  pie?: ReactNode;
  ancho?: 440 | 560 | 640 | 720;
  /** Ocupa toda la pantalla en compacta (Armar mi plan, Avisar). */
  completoEnCompacta?: boolean;
  className?: string;
}
/** role=dialog aria-modal, foco atrapado, Esc cierra, Enter confirma el botón primario del pie. */
export function Modal(p: ModalProps): ReactElement | null;
export interface HojaProps {
  abierta: boolean;
  titulo: string;
  alCerrar: () => void;
  children: ReactNode;
  pie?: ReactNode;
  /** Puntos de anclaje (fracción del alto). Por omisión [0.5, 0.92]. */
  anclas?: [number, number];
  className?: string;
}
/** Hoja inferior (Android; en Windows se muestra como Modal de 440). Se cierra arrastrando > 30 %. */
export function Hoja(p: HojaProps): ReactElement | null;
export interface PanelLateralProps {
  abierto: boolean;
  titulo: string;
  alCerrar: () => void;
  /** Botón ⤢ "Abrir en página completa". */
  alExpandir?: () => void;
  children: ReactNode;
  pie?: ReactNode;
  className?: string;
}
/** Panel derecho de 480 (02 §7.12). Quien lo usa decide si cabe (usePanelDisponible). */
export function PanelLateral(p: PanelLateralProps): ReactElement | null;
export function Tooltip(p: { contenido: ReactNode; children: ReactElement; className?: string }): ReactElement;
/** rev. 3.1 · Burbuja de recorrido anclada a `children` (01 §4.15): texto + [Siguiente] / [Entendido] y cerrar.
 *  Con visible = false solo pinta `children`. Foco al abrir, Esc = entendido. Úsala con useRecorrido() de @/app. */
export function BurbujaRecorrido(p: { visible: boolean; texto: string; esUltimo: boolean; alSiguiente: () => void; alEntendido: () => void; children: ReactElement; className?: string }): ReactElement;
export interface DatosToast {
  texto: string;
  detalle?: string;
  tono?: 'ok' | 'info' | 'error';
  /** "Deshacer" solo en lo reversible (02 §7.14). */
  accion?: { etiqueta: string; alPulsar: () => void };
  /** Por omisión 6000. */
  duracion_ms?: number;
}
export function useToast(): { mostrar(t: DatosToast): void; cerrar(): void };
/** Lo monta ui-base una vez en la raíz. */
export function ProveedorToasts(p: { children: ReactNode }): ReactElement;

// ============================================================================ carga, vacíos, progreso (02 §7.15–7.22)
export function Esqueleto(p: { forma: 'texto' | 'titulo' | 'bloque' | 'foto' | 'kpi' | 'fila' | 'circulo'; ancho?: number | string; alto?: number | string; lineas?: number; className?: string }): ReactElement;
/** Contenedor con UNA sola animación de opacidad para todos sus esqueletos; a los 3 s agrega el aviso de carga lenta. */
export function EsqueletoVista(p: { children: ReactNode; textoLento?: string; className?: string }): ReactElement;
export function EstadoVacio(p: { icono: NombreIcono; titulo: string; texto?: string; accion?: { etiqueta: string; alPulsar: () => void }; className?: string }): ReactElement;
/** Barra de 8 px con borde de avance a 45° (02 §7.20). valor 0..1. */
export function BarraProgreso(p: { valor: number; etiqueta: string; className?: string }): ReactElement;
export interface SegmentoEtapas { etapa: 'planeada' | 'video_listo' | 'programada' | 'publicada'; n: number }
/** Barra de "ponerse al día" con separadores a 45° (02 §3.6, §7.21). */
export function BarraEtapas(p: { segmentos: SegmentoEtapas[]; total: number; contador: string; tamano?: 'inicio' | 'muestras'; leyenda?: boolean; className?: string }): ReactElement;
export function BarraSegmentada(p: { partes: { id: string; etiqueta: string; n: number; tono: TonoEstado }[]; etiqueta: string; className?: string }): ReactElement;
export interface TicketProps {
  titulo: string;
  subtitulo: string;
  renglones: { concepto: string; cifra: string; rayado?: boolean }[];
  total: string;
  variante?: 'semana' | 'al_dia';
  className?: string;
}
/** Ticket de corte (02 §7.22): borde dentado, guías punteadas, total en cifras anchas. */
export function Ticket(p: TicketProps): ReactElement;
/** Palomita de 02 §10.2 (resorte 400 ms; sin rebote con movimiento reducido). */
export function Palomita(p: { tamano?: number; className?: string }): ReactElement;
/** Tile blanco de QR (02 §7.19); `png` = data URI de EmparejarResponse.qr_png. */
export function MosaicoQr(p: { png: string; alt: string; className?: string }): ReactElement;
/** 'ABCD-EFGH-JKMN' en Geist Mono en 3 grupos + anillo de cuenta regresiva hasta `expiraAt`. */
export function CodigoEmparejamiento(p: { codigo: string; expiraAt: EpochS; alVencer?: () => void; className?: string }): ReactElement;

// ============================================================================ gráficas SVG propias (02 §9)
export interface TablaGemela { columnas: string[]; filas: string[][] }
export interface PuntoGrafica {
  clave: string;
  etiqueta: string;
  valor: number;
  /** Periodo en curso: relleno al 35 % + contorno y etiqueta "en curso". */
  enCurso?: boolean;
  /** aria-label de la marca: 'marzo 2026: $1,234 de comisión, 56 unidades'. */
  aria: string;
}
export interface GraficaColumnasProps {
  titulo: string;
  puntos: PuntoGrafica[];
  /** Eje Y: '0 · $5 mil · $10 mil'. */
  formatoEje: (valor: number) => string;
  alto?: number;
  nota?: string;
  tablaGemela: TablaGemela;
  className?: string;
}
/** Una serie en --viz-mono; hover/foco en --viz-current. */
export function GraficaColumnas(p: GraficaColumnasProps): ReactElement;
export interface SerieApilada {
  id: string;
  etiqueta: string;
  /** solido/tenue = mismo tono (slot) sólido o al 35 % con contorno; rayado = reembolsos (45°, gris); neutro = "Otras". */
  estilo: 'solido' | 'tenue' | 'rayado' | 'neutro';
  slot?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}
export interface GraficaColumnasApiladasProps {
  titulo: string;
  series: SerieApilada[];
  puntos: { clave: string; etiqueta: string; valores: Record<string, number>; enCurso?: boolean; aria: string }[];
  formatoEje: (valor: number) => string;
  alto?: number;
  tablaGemela: TablaGemela;
  className?: string;
}
export function GraficaColumnasApiladas(p: GraficaColumnasApiladasProps): ReactElement;
export interface BarraApiladaProps {
  titulo: string;
  partes: { id: string; etiqueta: string; valor: number; texto: string; estilo: SerieApilada['estilo']; slot?: SerieApilada['slot'] }[];
  etiquetasDirectas?: boolean;
  tablaGemela: TablaGemela;
  className?: string;
}
/** Barra horizontal apilada ("¿Dónde está tu dinero?", "De quién depende tu comisión"). */
export function BarraApilada(p: BarraApiladaProps): ReactElement;
export interface BarrasHorizontalesProps {
  titulo: string;
  filas: { id: string; etiqueta: string; valor: number; texto: string; secundario?: string; alPulsar?: () => void }[];
  tablaGemela: TablaGemela;
  className?: string;
}
export function BarrasHorizontales(p: BarrasHorizontalesProps): ReactElement;
/** 12 puntos, línea --viz-mono y punto final lima; aria-hidden + `resumen` para lectores. */
export function Sparkline(p: { valores: number[]; resumen: string; ancho?: number; alto?: number; className?: string }): ReactElement;
export function CalendarioCalor(p: { titulo: string; dias: { fecha: FechaLocal; valor: number; texto: string }[]; tablaGemela: TablaGemela; className?: string }): ReactElement;
