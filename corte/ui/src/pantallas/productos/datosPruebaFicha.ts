/**
 * Datos SINTÉTICOS para las pruebas de la ficha completa (contrato rev. 4): un producto inventado («Sudadera de algodón
 * con capucha» de «Tienda Ejemplo»), sin nada de los fixtures ni de datos reales. Solo lo importan las pruebas.
 */
import type * as C from '@/contrato';

export const FICHA: C.ProductoResumen = {
  product_id: '100', titulo: 'Sudadera de algodón con capucha', titulo_corto: 'Sudadera de algodón con capucha', imagen: '/img/p/100?v=aa11bb22',
  enlace: null, precio_min_centavos: 89_900, precio_max_centavos: 89_900, precio_venta_min_centavos: 59_900, precio_venta_max_centavos: 59_900,
  precio_fuente: 'comision', comision_bp: 1000, comision_por_venta_centavos: 5_990, comision_por_venta_max_centavos: 5_990,
  unidades_vendidas_global: 4_200, en_colaboracion_abierta: true, en_vitrina: true, categoria: 'Ropa > Sudaderas',
};

export const FILA: C.FilaProducto = {
  product_id: '100', titulo: FICHA.titulo, titulo_corto: FICHA.titulo_corto, imagen: FICHA.imagen, tienda_key: 'tienda ejemplo',
  tienda_nombre: 'Tienda Ejemplo', pedidos: 120, pedidos_validos: 100, unidades: 110, ventas_centavos: 5_500_000, comision_estimada_centavos: 700_000,
  tasa_reembolso: 0.1, comision_bp: 1300, videos: 4, es_muestra: true, clase_muestra: null, con_ficha: true, en_vitrina: true,
};

export const VITRINA: C.VitrinaProducto = {
  inventario: 'IN_STOCK', con_existencias: true, precio_lista_min_centavos: 89_900, precio_lista_max_centavos: 89_900,
  precio_venta_min_centavos: 59_900, precio_venta_max_centavos: 59_900, precio_plataforma_min_centavos: 54_900, precio_plataforma_max_centavos: 54_900,
  comision_bp: 1000, oculto: false,
};

export const sku = (i: number, variante: string, motivo: string | null = null, texto: string | null = null): C.SkuMuestra => ({
  sku_id: `sku${i}`, propiedades: variante.split(' / ').map((valor, k) => ({ nombre: k === 0 ? 'Color' : 'Talla', valor })), variante,
  precio_centavos: 59_900, disponible: motivo === null, motivo_no_disponible: motivo, motivo_texto: texto,
});

export const MUESTRA: C.ElegibilidadMuestra = {
  puede_solicitar: true, estado: 'COMPLETE', estado_texto: 'Ya la pediste y se completó', application_id: 'app1', limite_alcanzado: false,
  consultado_at: 1_794_490_000,
  skus: [
    sku(1, 'Negro / S'), sku(2, 'Negro / M', 'ALREADY_APPLYED', 'Ya pediste esta variante'), sku(3, 'Negro / L', 'OUT_OF_STOCK', 'Agotado'),
    sku(4, 'Gris / S'), sku(5, 'Gris / M'), sku(6, 'Gris / L'), sku(7, 'Arena / M'), sku(8, 'Arena / L', 'OUT_OF_STOCK', 'Agotado'),
  ],
};

export const parecido = (id: string, bp: number | null, vendidos: number | null, tieneFicha = false, enlace: string | null = null): C.ProductoParecido => ({
  product_id: id, titulo: `Sudadera parecida ${id}`, titulo_corto: `Sudadera parecida ${id}`, tienda_nombre: 'Otra Tienda', imagen: `/img/m/${id}?v=0`,
  precio_min_centavos: 79_900, precio_max_centavos: 79_900, precio_venta_min_centavos: 49_900, precio_venta_max_centavos: 49_900, precio_fuente: 'comision',
  comision_bp: bp, comision_por_venta_centavos: bp !== null ? Math.round((49_900 * bp) / 10_000) : null,
  comision_por_venta_max_centavos: bp !== null ? Math.round((49_900 * bp) / 10_000) : null, unidades_vendidas_global: vendidos, enlace, tiene_ficha: tieneFicha,
});

export const EXTENDIDO: C.ProductoExtendido = {
  galeria: Array.from({ length: 7 }, (_, i) => `/img/g/100-${i}?v=0`),
  vitrina: VITRINA,
  muestra: MUESTRA,
  solicitudes_recuperadas: [{
    application_id: 'rec1', sku_id: 'sku5', variante: 'Gris / M', tipo: 'FREE_SAMPLE', tipo_texto: 'Muestra gratis', solicitada_at: 1_790_000_000,
    cumplimiento: 'SUCCEED', cumplimiento_texto: 'Video entregado',
  }],
  planes_dirigidos: [
    { collab_id: 'c1', nombre: 'Creadores de otoño', estado: 'LIVE', estado_texto: 'Activo', activo: true, comision_bp: 1400, comision_monto_centavos: 8_386, tienda_nombre: 'Tienda Ejemplo' },
    { collab_id: 'c2', nombre: 'Lanzamiento', estado: 'EXPIRED', estado_texto: 'Vencido', activo: false, comision_bp: 1200, comision_monto_centavos: null, tienda_nombre: 'Tienda Ejemplo' },
  ],
  comision_real: {
    lineas: 100, tasa_principal_bp: 1400, plan_abierto_bp: 1000, campanas: 1,
    por_tasa: [
      { comision_bp: 1400, lineas: 75, unidades: 82, comision_estimada_centavos: 560_000, participacion: 0.75, lineas_con_campana: 30 },
      { comision_bp: 1000, lineas: 25, unidades: 28, comision_estimada_centavos: 140_000, participacion: 0.25, lineas_con_campana: 0 },
    ],
  },
  parecidos: {
    palabras: ['sudadera', 'algodón', 'capucha'], consultado_at: 1_794_400_000,
    items: [parecido('201', 900, 5_000), parecido('202', 1500, 300, true), parecido('203', 1200, 9_000, false, 'https://shop.tiktok.com/view/product/203'), parecido('204', null, 50)],
  },
  origen_ventas: {
    lineas: 100,
    por_tipo_contenido: [{ tipo: 'VIDEO', texto: 'Video', lineas: 80 }, { tipo: 'SHOP', texto: 'Tienda', lineas: 15 }, { tipo: null, texto: 'Sin dato', lineas: 5 }],
    por_tipo_enlace: [{ tipo: 'SPECIFIC', texto: 'Enlace para un publicador', lineas: 70 }, { tipo: 'GENERAL', texto: 'Enlace general', lineas: 30 }],
  },
  origen_ventas_aviso: null,
};

export const EXTENDIDO_VACIO: C.ProductoExtendido = {
  galeria: [], vitrina: null, muestra: null, solicitudes_recuperadas: [], planes_dirigidos: [], comision_real: null, parecidos: null,
  origen_ventas: null, origen_ventas_aviso: null,
};

export function detalle(cambios: Partial<C.ProductoDetalleResponse> = {}): C.ProductoDetalleResponse {
  return {
    product_id: '100', ficha: FICHA, con_inventario: true, categoria_ruta: 'Ropa › Sudaderas', comision_anuncios_bp: null, fila: FILA,
    serie: [], videos: [], muestras: [], notas: [], extendido: EXTENDIDO, ...cambios,
  };
}
