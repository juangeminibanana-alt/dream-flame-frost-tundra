/**
 * FIRMAS NORMATIVAS · módulo `@/bloques` (lo implementa ui-bloques en ui/src/bloques/). BUILD_SPEC §8.5.
 * Bloques de dominio que comparten varias pantallas: tarjetas de muestra, chips con significado, flujos cortos de
 * etapa (hojas y diálogos), editor de mensaje, plan rápido, QR de emparejamiento y diálogos globales.
 * Usan @/componentes, @/dominio, @/datos, @/plataforma y @/app; nunca hablan con la red directo.
 * rev. 3.1: DialogoMuestraNueva (01 §5.5) dentro de ProveedorBloques.
 */
import type { ReactNode, ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ColumnaTabla } from '@/componentes';

// ============================================================================ proveedor (lo monta ui-base en la raíz)
/** Monta UNA vez: hojas de etapa/fecha/no se puede/vincular video, DialogoMensaje (?mensaje=), TarjetaConfirmarAviso,
 *  DialogoSolicitudEmparejamiento (Windows), DialogoCierre (Windows, evento ventana.preguntar_cierre) y
 *  DialogoMuestraNueva (rev. 3.1). */
export function ProveedorBloques(p: { children: ReactNode }): ReactElement;
/** rev. 3.1 · 01 §5.5 paso 4: al llegar datos.cambiaron con una muestra nueva Por vencer y un plan que ya la deja sin
 *  lugar: "Llegó una muestra que vence el {fecha}. ¿La metemos en tu plan?" [Agregar y recorrer las demás] [Elegir día].
 *  Usa dominio.recorrerPlan + acciones.lote (un solo Deshacer). Una vez por muestra (usePrimeraVez('muestra-nueva-<id>')).
 *  Lo monta ProveedorBloques; se exporta para pruebas y para la galería. */
export function DialogoMuestraNueva(): ReactElement | null;

// ============================================================================ control de una muestra
export interface ControlMuestra {
  /** Sin fecha abre "¿Qué día haces este video?" con la ocupación por día; respeta promesas (01_ux §2.5). */
  planear(m: C.MuestraVista, fecha?: C.FechaLocal): Promise<void>;
  /** Abre la hoja con los datos que pide la etapa; Toast con Deshacer de 6 s. */
  cambiarEtapa(m: C.MuestraVista, etapa: C.EtapaAvance): Promise<void>;
  /** La acción principal visible (botón de la tarjeta, deslizar a la derecha, tecla E). */
  accionPrincipal(m: C.MuestraVista): Promise<void>;
  noSePuede(m: C.MuestraVista): Promise<void>;
  /** Pegar enlace / elegir de mis videos / aceptar "Posible video" / "La tienda aceptó este video". */
  vincularVideo(m: C.MuestraVista, sugerido?: string): Promise<void>;
  /** "Mover a otro día": si queda después de la promesa pide confirmación [Mover y preparar mensaje]. */
  moverDia(m: C.MuestraVista): Promise<void>;
  fijar(m: C.MuestraVista, fijada: boolean): Promise<void>;
  /** Abre el diálogo §4.8 vía ?mensaje=<id> o ?mensaje=t:<tienda_key>. */
  abrirMensaje(destino: { solicitud: string } | { tienda: string }): void;
}
export function useControlMuestra(): ControlMuestra;

// ============================================================================ muestras
export type VarianteTarjetaMuestra = 'lista' | 'tablero' | 'agenda' | 'sesion' | 'aviso' | 'tira';
export interface TarjetaMuestraProps {
  muestra: C.MuestraVista;
  variante: VarianteTarjetaMuestra;
  seleccionada?: boolean;
  /** Modo selección múltiple (mantener presionado en Android). */
  marcable?: boolean;
  marcada?: boolean;
  alMarcar?: (marcada: boolean) => void;
  alAbrir?: () => void;
  esNueva?: boolean;
  /** Botón de la acción principal visible (por omisión true en 'lista' y 'tablero'). */
  conAccion?: boolean;
  /** Android: deslizar → acción principal / mover o no se puede (01_ux §3.3). */
  deslizable?: boolean;
  className?: string;
}
/** Contenido de 01_ux §3.7 "Tarjeta de muestra"; anuncio completo para lectores de pantalla (01_ux §8). */
export function TarjetaMuestra(p: TarjetaMuestraProps): ReactElement;
/** Columnas de la tabla de muestras (Windows) para cada contexto. */
export function columnasMuestras(contexto: 'pendientes' | 'todas' | 'tienda' | 'producto'): ColumnaTabla<C.MuestraVista>[];
export function ChipTikTok(p: { muestra: C.MuestraVista; conMotivo?: boolean; className?: string }): ReactElement;
export function ChipAvance(p: { avance: C.AvanceMuestra; className?: string }): ReactElement;
export function ChipsRazones(p: { muestra: C.MuestraVista; maximo?: number; className?: string }): ReactElement | null;
export function ChipPromesa(p: { avisos: C.ResumenAvisosMuestra; etapa: C.EtapaAvance; className?: string }): ReactElement | null;
export function ChipCopiadoSinConfirmar(p: { avisos: C.ResumenAvisosMuestra; className?: string }): ReactElement | null;
export function ChipVitrina(p: { enVitrina: boolean | null; className?: string }): ReactElement | null;
export function ChipPrioridad(p: { nivel: C.NivelPrioridad; className?: string }): ReactElement;
/** Botón de la acción principal de la etapa (texto de dominio.ETIQUETA_ACCION). */
export function BotonAccionMuestra(p: { muestra: C.MuestraVista; tamano?: 'sm' | 'md' | 'lg'; anchoCompleto?: boolean; className?: string }): ReactElement | null;
/** "≈ $632 – $663 · por comisión" + "Te deja ≈ $63 por venta"; precio de lista siempre rotulado (01_ux §6.0). */
export function FichaPrecio(p: { producto: C.ProductoResumen; compacta?: boolean; className?: string }): ReactElement;
/** Tarjetas A/B/C de "Ventas de este producto" (01_ux §4.3). */
export function TarjetaVentasProducto(p: { detalle: C.MuestraDetalleResponse; className?: string }): ReactElement | null;
export function BotonGuardarImagen(p: { producto: C.ProductoResumen; className?: string }): ReactElement;
export function BotonCopiarGuion(p: { muestra: C.MuestraVista; className?: string }): ReactElement;
/** Pestañas Pendientes · Agenda · Todas (+ acciones Armar mi plan, Sesión, Avisar) que comparten las pantallas de Muestras. */
export function PestanasMuestras(p: { activa: 'pendientes' | 'agenda' | 'todas'; className?: string }): ReactElement;

// ============================================================================ tiendas, videos, productos
export function ChipSalud(p: { salud: C.SaludTienda; esSocio: boolean; className?: string }): ReactElement;
export function TarjetaTienda(p: { tienda: C.FilaTienda; variante: 'ficha' | 'fila'; alAbrir?: () => void; className?: string }): ReactElement;
export function columnasTiendas(): ColumnaTabla<C.FilaTienda>[];
export function TarjetaVideo(p: { video: C.FilaVideo; ranking?: number; nombreProducto?: string | null; anchoCss: number; alAbrir?: () => void; className?: string }): ReactElement;
export function columnasVideos(): ColumnaTabla<C.FilaVideo>[];
export function TarjetaProductoFila(p: { producto: C.FilaProducto; ranking?: number; alAbrir?: () => void; className?: string }): ReactElement;
export function columnasProductos(): ColumnaTabla<C.FilaProducto>[];
export function columnasPedidos(): ColumnaTabla<C.OrdenVista>[];
/** Notas locales de una entidad (crear, editar, fijar, borrar), funciona sin conexión. */
export function ListaNotas(p: { entidad: C.EntidadNota; entidadId: string | null; titulo?: string; className?: string }): ReactElement;

// ============================================================================ mensajes y avisos (01_ux §4.8, §2.5, §3.5)
export interface EditorMensajeProps {
  tiendaKey: string;
  /** Solicitudes incluidas (vacío = mensaje sin muestras, p. ej. "Gracias por las ventas"). */
  solicitudes: string[];
  /** Por omisión, la plantilla_sugerida del hub (o de la copia). */
  plantillaInicial?: string;
  /** 'dialogo' = §4.8 · 'avisar' = pantalla de una tienda en §4.17. */
  modo: 'dialogo' | 'avisar';
  /** Después de copiar: el aviso quedó "copiado, sin confirmar". */
  alCopiar?: (aviso: C.AvisoTienda) => void;
  /** Después de "Sí, ya se lo envié" o "Ya le escribí por mi cuenta". */
  alRegistrar?: (aviso: C.AvisoTienda) => void;
  className?: string;
}
export function EditorMensaje(p: EditorMensajeProps): ReactElement;
/** Lee ?mensaje= de la URL. Lo monta ProveedorBloques; se exporta para pruebas. */
export function DialogoMensaje(): ReactElement | null;
/** Tarjeta fija "¿Le enviaste el mensaje a {tienda}?" al volver al frente (§3.5). */
export function TarjetaConfirmarAviso(): ReactElement | null;

// ============================================================================ plan (01_ux §4.5 y W4)
export interface ResumenPlanCreado { videos: number; termina: C.FechaLocal; publica_a_mas_tardar: C.FechaLocal; tiendas_por_avisar: number }
/** 'compacto' = W4 (pasos 1 y 3 en una pantalla) · 'completo' = pasos 1–3 de Armar mi plan. Crea con acciones.lote. */
export function PanelPlan(p: { modo: 'compacto' | 'completo'; alCrear: (r: ResumenPlanCreado) => void; alSaltar?: () => void; className?: string }): ReactElement;

// ============================================================================ celular (Windows)
/** QR + código + pasos de 01_ux §4.14 C (W5 y Ajustes › Celular). Pide POST /api/lan/emparejar y renueva a los 5 min. */
export function PanelQrEmparejamiento(p: { compacto?: boolean; alEmparejado?: (dispositivo: string) => void; className?: string }): ReactElement;
/** Modal global "¿Conectar este celular?" con el número de 4 dígitos (evento emparejamiento.solicitud). */
export function DialogoSolicitudEmparejamiento(): ReactElement | null;
