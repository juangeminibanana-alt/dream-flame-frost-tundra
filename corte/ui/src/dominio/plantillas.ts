/* @/dominio · mensajes a tiendas (01_ux §4.8): resolver las variables de una plantilla, la recomendada de respaldo y el
   texto de "Copiar datos para tu guion" (01_ux §4.3). Nunca se copia un mensaje con variables sin resolver ni con
   "fecha por confirmar": si falta un dato, se reporta en `faltantes` y Copiar va desactivado. */
import type * as C from '@/contrato';
import type { ContextoMensaje, FaltanteMensaje, MensajeResuelto } from '@firmas/dominio';
import { formato } from './formato';
import { nombreCorto, nombreParaMensaje } from './texto';
import { esPendiente, plantillaSugeridaDe } from './trabajo';
import { ETIQUETA_FUENTE_PRECIO } from './vocabulario';

export const IDS_PLANTILLAS = [
  'disculpa_y_fecha', 'varias_muestras', 'nueva_fecha', 'ya_publique', 'ya_tengo_video', 'producto_no_disponible',
  'no_me_llego_completa', 'prefiero_otro_producto', 'disculpa_sin_fecha', 'ya_la_recibi', 'gracias_por_las_ventas',
] as const;

/** Las 10 variables de 01_ux §4.8, sin llaves. */
export const VARIABLES_PLANTILLA: readonly string[] = [
  'tienda', 'producto', 'fecha_compromiso', 'fecha_anterior', 'link_video', 'lista_productos', 'lista_fechas',
  'agradecimiento_socio', 'problema_envio', 'firma',
];

/** "Nueva fecha" (01_ux §4.8): el texto predeterminado de una muestra y el de varias. */
export const NUEVA_FECHA_UNA = 'Hola, equipo de {tienda}. Les dije que publicaba el video de {producto} el {fecha_anterior} y no lo cumplí; una disculpa. Ya lo tengo para el {fecha_compromiso}. Gracias por la paciencia.{firma}';
export const NUEVA_FECHA_VARIAS = 'Hola, equipo de {tienda}. Les dije que publicaba los videos el {fecha_anterior} y no lo cumplí; una disculpa. Ya los tengo así:\n{lista_fechas}\nGracias por la paciencia.{firma}';

const AGRADECIMIENTO_SOCIO = 'También gracias por todo lo que hemos vendido juntos con sus productos. ';
const PROBLEMA_ENVIO: Readonly<Record<'no_llego' | 'incompleta', string>> = { no_llego: 'no me llegó', incompleta: 'llegó incompleta' };
/** Sin motivo conocido se usa el primero de los dos valores de 01_ux §4.8 ("no me llegó"): nunca un texto fuera de la
 *  tabla. La pantalla que conoce el motivo (no_llego/incompleta) lo pasa en `problema_envio`. */
const PROBLEMA_ENVIO_GENERICO = PROBLEMA_ENVIO.no_llego;

function mismoTexto(a: string, b: string): boolean {
  const n = (t: string): string => t.replace(/\r\n?/g, '\n').trim();
  return n(a) === n(b);
}

function productoDe(m: C.MuestraVista): string {
  return nombreParaMensaje(m.producto.titulo ?? m.producto.titulo_corto) || nombreParaMensaje(m.producto.titulo_corto) || 'su producto';
}

type Valor = { texto: string; faltante?: FaltanteMensaje };

/**
 * Resuelve {tienda} {producto} {fecha_compromiso} {fecha_anterior} {link_video} {lista_productos} {lista_fechas}
 * {agradecimiento_socio} {problema_envio} {firma} con las reglas de 01_ux §4.8. 'nueva_fecha' predeterminada sin editar
 * con ≥ 2 muestras usa el texto "Varias". Una variable sin dato se deja escrita tal cual (con su resaltado) y entra en
 * `faltantes`. Las llaves que no son variables se respetan (texto del usuario).
 */
export function resolverPlantilla(plantilla: Pick<C.PlantillaMensaje, 'id' | 'cuerpo' | 'predeterminada' | 'rev'>, ctx: ContextoMensaje): MensajeResuelto {
  const muestras = ctx.muestras;
  const primera = muestras[0];
  const varias = plantilla.id === 'nueva_fecha' && plantilla.predeterminada && muestras.length >= 2 && mismoTexto(plantilla.cuerpo, NUEVA_FECHA_UNA);
  const cuerpo = varias ? NUEVA_FECHA_VARIAS : plantilla.cuerpo;
  const ids = muestras.map((m) => m.application_id);

  const valor = (variable: string): Valor | null => {
    switch (variable) {
      case 'tienda':
        return { texto: ctx.tienda.nombre };
      case 'producto':
        return { texto: primera ? productoDe(primera) : 'su producto' };
      case 'fecha_compromiso': {
        const f = primera ? ctx.compromisos[primera.application_id] : undefined;
        return f !== undefined ? { texto: formato.fechaLarga(f) } : { texto: '', faltante: { tipo: 'fecha', solicitudes: primera ? [primera.application_id] : [] } };
      }
      case 'fecha_anterior': {
        let f = ctx.fecha_anterior;
        if (f === null) for (const m of muestras) if (m.avisos.promesa !== null && (f === null || m.avisos.promesa > f)) f = m.avisos.promesa;
        return f !== null ? { texto: formato.fechaLarga(f) } : { texto: '', faltante: { tipo: 'fecha', solicitudes: ids } };
      }
      case 'link_video': {
        const l = ctx.link_video?.trim() ?? '';
        return l ? { texto: l } : { texto: '', faltante: { tipo: 'link_video' } };
      }
      case 'lista_productos':
        return { texto: muestras.map((m) => `• ${productoDe(m)}${m.variante ? ` (${m.variante})` : ''}`).join('\n') };
      case 'lista_fechas': {
        const sinFecha = muestras.filter((m) => ctx.compromisos[m.application_id] === undefined).map((m) => m.application_id);
        const texto = muestras.map((m) => {
          const f = ctx.compromisos[m.application_id];
          return `• ${productoDe(m)}: a más tardar el ${f !== undefined ? formato.fechaLarga(f) : '…'}`;
        }).join('\n');
        return sinFecha.length > 0 ? { texto, faltante: { tipo: 'plan', solicitudes: sinFecha } } : { texto };
      }
      case 'agradecimiento_socio':
        return { texto: ctx.tienda.es_socio ? AGRADECIMIENTO_SOCIO : '' };
      case 'problema_envio':
        return { texto: ctx.problema_envio ? PROBLEMA_ENVIO[ctx.problema_envio] : PROBLEMA_ENVIO_GENERICO };
      case 'firma': {
        const f = ctx.firma.trim();
        return { texto: f ? `\n— ${f}` : '' };
      }
      default:
        return null;
    }
  };

  let texto = '';
  const resaltados: MensajeResuelto['resaltados'] = [];
  const faltantes: FaltanteMensaje[] = [];
  const agregarFaltante = (f: FaltanteMensaje): void => {
    const previo = faltantes.find((x) => x.tipo === f.tipo);
    if (!previo) {
      faltantes.push(f.tipo === 'link_video' ? f : { tipo: f.tipo, solicitudes: [...f.solicitudes] });
      return;
    }
    if (previo.tipo !== 'link_video' && f.tipo !== 'link_video') {
      for (const s of f.solicitudes) if (!previo.solicitudes.includes(s)) previo.solicitudes.push(s);
    }
  };
  const patron = /\{([a-z_]+)\}/g;
  let ultimo = 0;
  for (let r = patron.exec(cuerpo); r !== null; r = patron.exec(cuerpo)) {
    const variable = r[1] ?? '';
    const v = valor(variable);
    texto += cuerpo.slice(ultimo, r.index);
    ultimo = r.index + r[0].length;
    if (v === null) {
      texto += r[0];
      continue;
    }
    if (v.faltante) agregarFaltante(v.faltante);
    const insertado = v.texto === '' && v.faltante ? r[0] : v.texto;
    if (insertado.length > 0) resaltados.push({ inicio: texto.length, fin: texto.length + insertado.length, variable });
    texto += insertado;
  }
  texto += cuerpo.slice(ultimo);
  return { texto, faltantes, puede_copiar: faltantes.length === 0, resaltados };
}

/** Respaldo SOLO si no hay plantilla_sugerida del hub ni en la copia (tabla de 01_ux §4.8 con la precedencia de 03
 *  §5.10). Sin el motivo de "No se puede" (MuestraVista no lo trae) se usa "Disculpa sin fecha". */
export function plantillaRecomendada(ctx: { muestras: C.MuestraVista[]; promesa_vencida: boolean; es_socio: boolean }): string {
  if (ctx.promesa_vencida || ctx.muestras.some((m) => m.avisos.promesa_vencida)) return 'nueva_fecha';
  const pendientes = ctx.muestras.filter(esPendiente);
  // 2 o más pendientes de la misma tienda incluidas → un solo mensaje (01_ux §4.8 y §4.17; 03 §5.10 en la tienda).
  if (pendientes.length >= 2) return 'varias_muestras';
  const m = pendientes[0] ?? ctx.muestras[0];
  if (!m) return ctx.es_socio ? 'gracias_por_las_ventas' : 'disculpa_y_fecha';
  const s = plantillaSugeridaDe(m, pendientes.length, null);
  // Sin pendientes ni otro caso especial: socio → "Gracias por las ventas".
  if (pendientes.length === 0 && (s === 'disculpa_y_fecha' || s === 'gracias_por_las_ventas')) {
    return ctx.es_socio ? 'gracias_por_las_ventas' : 'disculpa_y_fecha';
  }
  return s;
}

/** Texto plano de "Copiar datos para tu guion" (01_ux §4.3): nombre corto, título completo, variante, categoría, precio
 *  de venta ≈ y comisión por venta (las notas no llegan en la firma: quien copia las agrega). */
export function textoDatosGuion(m: C.MuestraVista): string {
  const p = m.producto;
  const lineas: string[] = [];
  const corto = p.titulo_corto ?? nombreCorto(p.titulo);
  if (corto) lineas.push(`Producto: ${corto}`);
  if (p.titulo) lineas.push(`Título completo: ${p.titulo.trim()}`);
  if (m.variante) lineas.push(`Variante: ${m.variante}`);
  if (p.categoria) lineas.push(`Categoría: ${p.categoria.split(/\s*>\s*/).join(' › ')}`);
  if (p.precio_venta_min_centavos !== null || p.precio_venta_max_centavos !== null) {
    const fuente = p.precio_fuente ?? 'comision';
    const rango = formato.rangoDinero(p.precio_venta_min_centavos, p.precio_venta_max_centavos, { aprox: fuente === 'comision' });
    lineas.push(`${fuente === 'comision' ? 'Precio de venta' : ETIQUETA_FUENTE_PRECIO[fuente]}: ${rango}`);
  }
  if (p.comision_por_venta_centavos !== null || p.comision_por_venta_max_centavos !== null) {
    const tasa = p.comision_bp !== null ? ` (comisión ${formato.tasaBp(p.comision_bp)})` : '';
    lineas.push(`Comisión por venta: ${formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos)}${tasa}`);
  }
  return lineas.join('\n');
}
