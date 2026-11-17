/* @/dominio · exportar CSV de Muestras › Todas (01_ux §4.7): UTF-8 con BOM (Excel lo abre con acentos), separador coma,
   montos en pesos con punto decimal, fechas 'YYYY-MM-DD' en hora de México, fin de línea CRLF. Con la casilla
   "Incluir mis notas, mi avance y mis avisos" se agregan las columnas del estado local. */
import type * as C from '@/contrato';
import { fechaLocalDe } from './fechas';
import { nombreCorto } from './texto';
import { avisosDe } from './trabajo';
import { ETIQUETA_ETAPA, ETIQUETA_FUENTE_PRECIO, ETIQUETA_GRUPO } from './vocabulario';

export const BOM = '﻿';

const COLUMNAS = [
  'ID de la solicitud', 'Producto', 'Título completo', 'Tienda', 'Variante', 'Estado en TikTok', 'Solicitada',
  'Precio de venta mín (MXN)', 'Precio de venta máx (MXN)', 'Fuente del precio', 'Comisión por venta mín (MXN)',
  'Comisión por venta máx (MXN)', '¿Vendió?', 'ID del producto',
] as const;
const COLUMNAS_LOCALES = ['Tu avance', 'Fecha planeada', 'Fecha publicada', 'ID del video', 'Promesa', 'Avisos enviados', 'Notas'] as const;

/** Celda de texto: entre comillas si lleva coma, comillas o saltos; con apóstrofo delante si empieza como fórmula. */
function texto(v: string | null | undefined): string {
  let t = (v ?? '').replace(/\r\n?/g, '\n');
  if (/^[=+\-@\t]/.test(t)) t = `'${t}`;
  return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
}

/** Monto en pesos con punto decimal y dos decimales (sin separador de miles); vacío si no hay dato. */
function monto(centavos: C.Centavos | null): string {
  if (centavos === null) return '';
  const negativo = centavos < 0;
  const abs = Math.abs(Math.round(centavos));
  return `${negativo ? '-' : ''}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** CSV de Muestras › Todas (01_ux §4.7), UTF-8 con BOM, separador coma, montos con punto decimal. */
export function csvMuestras(muestras: C.MuestraVista[], incluirLocal: boolean, extra?: { avisos: C.AvisoTienda[]; notas: C.Nota[] }): string {
  const encabezado: string[] = [...COLUMNAS, ...(incluirLocal ? COLUMNAS_LOCALES : [])];
  const filas: string[] = [encabezado.map(texto).join(',')];
  for (const m of muestras) {
    const p = m.producto;
    const celdas: string[] = [
      texto(m.application_id),
      texto(p.titulo_corto ?? nombreCorto(p.titulo)),
      texto(p.titulo),
      texto(m.tienda.nombre),
      texto(m.variante),
      texto(`${ETIQUETA_GRUPO[m.grupo]} · ${m.motivo}`),
      m.solicitada_at !== null ? fechaLocalDe(m.solicitada_at) : '',
      monto(p.precio_venta_min_centavos),
      monto(p.precio_venta_max_centavos),
      texto(p.precio_fuente ? ETIQUETA_FUENTE_PRECIO[p.precio_fuente] : ''),
      monto(p.comision_por_venta_centavos),
      monto(p.comision_por_venta_max_centavos),
      m.ventas_producto.pedidos_validos > 0 ? 'sí' : 'no',
      texto(p.product_id),
    ];
    if (incluirLocal) {
      const avisos = extra ? avisosDe(m.application_id, extra.avisos).filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null) : [];
      const notas = extra ? extra.notas.filter((n) => n.entidad === 'muestra' && n.entidad_id === m.application_id).map((n) => n.texto) : [];
      celdas.push(
        texto(ETIQUETA_ETAPA[m.avance.etapa]),
        m.avance.fecha_planeada ?? '',
        m.avance.fecha_publicada ?? '',
        texto(m.avance.content_id),
        m.avisos.promesa ?? '',
        String(avisos.length),
        texto(notas.join(' | ')),
      );
    }
    filas.push(celdas.join(','));
  }
  return BOM + filas.join('\r\n') + '\r\n';
}
