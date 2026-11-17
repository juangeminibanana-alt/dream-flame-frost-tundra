/* @/dominio (paquete ui-dominio, BUILD_SPEC §8.2 y §8.5): TypeScript puro, sin componentes, sin DOM y sin red. Reloj
   inyectable (fijarReloj) y hora de México centro UTC−6 fija. Firma normativa: spec/ui_firmas/dominio.d.ts rev. 3.1
   (la comprueba _firma.check.ts). Solo depende de tipos (contrato, plataforma, datos, componentes). */
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
  contentIdDeEnlace, esEnlaceTikTok, fechaPrometidaPorOmision, promesaEnRiesgo, ordenTiendasAvisar,
} from './trabajo';
export { armarPlan, desdePorOmision, opsDePlan, recorrerPlan } from './plan';
export { IDS_PLANTILLAS, VARIABLES_PLANTILLA, resolverPlantilla, plantillaRecomendada, textoDatosGuion } from './plantillas';
export { calcularNotificaciones } from './notificaciones';
export { csvMuestras } from './csv';
export { deCopia, aplicarOpsACopia } from './copia';
