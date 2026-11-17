/* __DOBLE_CORTE__ · DOBLE DE EJECUCIÓN de @/dominio (BUILD_SPEC §8.1.1). Vite y vitest lo usan mientras falta
   ui/src/dominio/index.ts (paquete ui-dominio). Implementación real: reloj y fechas UTC−6, formato es-MX,
   varianteParaAncho, urlConVariante, tonoTienda, inicialesTienda, iconoCategoria, nombreCorto, registroImagenes,
   esPendiente y el vocabulario de 01_ux §2. El resto es neutro. TypeScript puro: sin React ni DOM. */
import { marcarDoble } from '../comun/marca';

export type * from '@firmas/dominio';

export {
  TZ_OFFSET_S, ahoraS, fijarReloj, fechaLocalDe, hoyLocal, sumarDias, diasEntre, diaSemana, horaLocal, epochDeFecha,
  rangoDePeriodo,
} from './fechas';
export { formato } from './formato';
export { nombreCorto, nombreParaMensaje, normalizarTitulo, sinAcentos, coincide, resaltar, nuevoId } from './texto';
export { tonoTienda, inicialesTienda, iconoCategoria, varianteParaAncho, urlConVariante, registroImagenes } from './imagenes';
export {
  ETIQUETA_GRUPO, TONO_GRUPO, ICONO_GRUPO, ETIQUETA_ETAPA, PASO_ETAPA, ICONO_ETAPA, ETIQUETA_SALUD, TONO_SALUD,
  ETIQUETA_NIVEL, ETIQUETA_MOTIVO_NO_SE_PUEDE, ETIQUETA_FUENTE_PRECIO, ETIQUETA_ESTADO_ORDEN, ETIQUETA_PASO_SYNC,
  etiquetaContenido, etiquetaTipoMuestra, textoRazon, ICONO_RAZON, textoPermiso, ETIQUETA_ACCION,
} from './vocabulario';
export {
  esPendiente, contarTrabajo, aplicarLocal, accionPrincipal, accionSecundaria, validarEtapa, opCambioEtapa,
  contentIdDeEnlace, esEnlaceTikTok, fechaPrometidaPorOmision, promesaEnRiesgo, ordenTiendasAvisar, armarPlan,
  desdePorOmision, opsDePlan, recorrerPlan, IDS_PLANTILLAS, VARIABLES_PLANTILLA, resolverPlantilla,
  plantillaRecomendada, textoDatosGuion, calcularNotificaciones, csvMuestras, deCopia, aplicarOpsACopia,
} from './trabajo';

marcarDoble('dominio');
