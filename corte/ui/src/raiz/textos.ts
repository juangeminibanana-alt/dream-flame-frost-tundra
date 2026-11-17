/**
 * @/raiz · textos visibles del marco (español de México, vocabulario de 01 §1.5). Los que vienen literales de la spec
 * llevan su sección: 01 §3.2–3.6 (navegación y elementos globales), §4.16 (banner y estados transversales), C35, C36.
 */

export const T = {
  // -------------------------------------------------------------------------------------------- navegación (01 §3.2–3.3)
  navPrincipal: 'Navegación principal',
  saltar: 'Ir al contenido',
  grupoTrabajo: 'Tu trabajo',
  grupoEstadisticas: 'Estadísticas',
  inicio: 'Inicio',
  generar: 'Generar',
  muestras: 'Muestras',
  tiendas: 'Tiendas',
  ventas: 'Ventas',
  videos: 'Videos',
  productos: 'Productos',
  mas: 'Más',
  ajustes: 'Conexión y ajustes',
  marca: 'Corte',
  demo: 'Datos de demostración',
  demoCorto: 'Demo',
  insigniaMuestras: (n: number): string => (n === 1 ? '1 muestra pendiente' : `${n} muestras pendientes`),
  insigniaMuestrasUrgente: (n: number, urgentes: number): string =>
    `${n === 1 ? '1 muestra pendiente' : `${n} muestras pendientes`}, ${urgentes === 1 ? '1 vence' : `${urgentes} vencen`} en menos de 48 horas`,
  insigniaTiendas: (n: number): string => (n === 1 ? '1 tienda por avisar' : `${n} tiendas por avisar`),
  insigniaTiendasPromesas: (n: number, promesas: number): string =>
    `${n === 1 ? '1 tienda por avisar' : `${n} tiendas por avisar`}, ${promesas === 1 ? '1 promesa vencida' : `${promesas} promesas vencidas`}`,

  // -------------------------------------------------------------------------------------------- Android: Ventas (01 §3.3)
  segmentoVentas: 'Sección de ventas',
  resumen: 'Resumen',

  // -------------------------------------------------------------------------------------------- sincronización (01 §3.5)
  actualizadoHace: (t: string): string => `Actualizado ${t}`,
  sinSincronizar: 'Aún sin sincronizar',
  sincronizando: 'Sincronizando…',
  sinInternet: 'Sin conexión a internet',
  conexionVencida: 'Conexión con TikTok vencida',
  sincronizarAhora: 'Sincronizar ahora',
  verCelulares: 'Ver tus celulares',
  celularConectado: 'Celular conectado',
  celularesConectados: (n: number): string => `${n} celulares conectados`,
  sinCelular: 'Sin celular',
  emparejarCelular: 'Emparejar celular',
  cuentaProblema: 'Hay un problema con tu conexión con TikTok',
  pcSincronizando: (paso: string): string => `Tu PC está sincronizando con TikTok (${paso})…`,
  pcSincronizandoSinPaso: 'Tu PC está sincronizando con TikTok…',
  actualizandoDesdePc: 'Actualizando desde tu PC…',
  desdeTuPc: 'desde tu PC',

  // -------------------------------------------------------------------------------------------- banner (01 §4.16)
  bannerReautorizar: 'Tu conexión con TikTok se venció. Reautoriza para seguir actualizando tus datos.',
  /** C35: en Android no se reautoriza. */
  bannerReautorizarAndroid: 'Tu conexión con TikTok venció. Vuelve a conectar desde Corte en tu PC.',
  bannerPermiso: (que: string): string => `Falta un permiso para actualizar ${que}. Vuelve a autorizar y deja activados todos los permisos.`,
  bannerPermisoAndroid: (que: string): string =>
    `Falta un permiso para actualizar ${que}. Vuelve a autorizar desde Corte en tu PC y deja activados todos los permisos.`,
  bannerClave: 'Para conectar con TikTok falta la clave de tu app de Partner Center.',
  bannerSinRegion: 'Tu cuenta aún no tiene región de venta en TikTok Shop, así que no podemos leer tus datos. Revísalo en la app de TikTok.',
  bannerRevocado: 'Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.',
  bannerPromesa: (tienda: string, fecha: string): string => `Le prometiste a ${tienda} publicar el ${fecha} y ya pasó.`,
  bannerSinInternet: (cuando: string): string => `Sin conexión a internet. Te mostramos tus últimos datos (${cuando}).`,
  bannerDatosViejos: (fecha: string): string => `Tus datos son del ${fecha}. Sincroniza para ver lo más reciente.`,
  /** 01 §4.16 en dos renglones: la franja de 02 §7.9 («Sin conexión con tu PC · datos del 12 nov, 6:04 p. m.») y debajo
   *  «Tus cambios se guardan y se enviarán al reconectar.» con los cambios por enviar. */
  bannerSinPc: (cuando: string): string => `Sin conexión con tu PC · datos del ${cuando}`,
  bannerSinPcSinFecha: 'Sin conexión con tu PC',
  bannerSinPcDetalle: 'Tus cambios se guardan y se enviarán al reconectar.',
  cambiosPorEnviar: (n: number): string => (n === 1 ? '1 cambio por enviar' : `${n} cambios por enviar`),
  accReautorizar: 'Reautorizar',
  accImportar: 'Importar desde archivo…',
  accPegarClave: 'Pegar clave de la app',
  accReintentar: 'Reintentar',
  accEmparejar: 'Emparejar de nuevo',
  accPrepararMensaje: 'Preparar mensaje',
  accSincronizar: 'Sincronizar',
  descartar: 'Ocultar este aviso por hoy',

  // -------------------------------------------------------------------------------------------- paleta (01 §3.5)
  paletaTitulo: 'Buscar',
  paletaPlaceholder: 'Busca muestras, tiendas, productos, videos o acciones',
  paletaSinResultados: (q: string): string => `No encontramos “${q}”. Prueba con el nombre de la tienda o del producto.`,
  paletaCargando: 'Buscando…',
  paletaNecesitaPc: 'Algunos resultados necesitan tu PC encendida.',
  paletaCerrar: 'Cerrar la búsqueda',
  paletaAyuda: 'Usa ↑ y ↓ para moverte y Enter para abrir',
  grupoAcciones: 'Acciones',
  grupoMuestras: 'Muestras',
  grupoTiendas: 'Tiendas',
  grupoProductos: 'Productos',
  grupoVideos: 'Videos',
  accionSincronizar: 'Sincronizar ahora',
  accionPlan: 'Armar mi plan',
  accionAvisar: 'Avisar a mis tiendas',
  accionSesion: 'Empezar sesión de videos',
  accionGenerar: 'Generar video de 10s',
  accionEmparejar: 'Emparejar celular',
  accionReautorizar: 'Reautorizar TikTok',
  accionVentas: 'Ir a Ventas',
  videoSinTitulo: (id: string): string => `Video ${id}`,

  // -------------------------------------------------------------------------------------------- atajos (01 §3.6)
  atajosTitulo: 'Atajos de teclado',
  atajosDescripcion: 'Funcionan cuando no estás escribiendo en un campo.',
  atajosGlobales: 'En toda la app',
  atajosPantalla: 'En esta pantalla',
  atajoBuscar: 'Buscar o ejecutar acción',
  atajoIrInicio: 'Ir a Inicio',
  atajoIrGenerar: 'Ir a Generar video',
  atajoIrMuestras: 'Ir a Muestras',
  atajoIrTiendas: 'Ir a Tiendas',
  atajoIrVentas: 'Ir a Ventas',
  atajoIrVideos: 'Ir a Videos',
  atajoIrProductos: 'Ir a Productos',
  atajoSincronizar: 'Sincronizar ahora',
  atajoDeshacer: 'Deshacer el último cambio de etapa, plan o aviso',
  atajoVerAtajos: 'Ver todos los atajos',
  atajoCerrar: 'Cerrar panel, diálogo o búsqueda',
  cerrar: 'Cerrar',

  // -------------------------------------------------------------------------------------------- deshacer (01 §3.6)
  deshecho: 'Listo: deshicimos tu último cambio',
  nadaQueDeshacer: 'No hay cambios recientes para deshacer',
  noSeDeshizo: 'No pudimos deshacer el último cambio',

  // -------------------------------------------------------------------------------------------- fin de sincronización (01 §4.16)
  finSync: (pedidos: number, muestras: number): string => {
    const partes: string[] = [];
    if (pedidos > 0) partes.push(pedidos === 1 ? '1 pedido nuevo' : `${pedidos} pedidos nuevos`);
    if (muestras > 0) partes.push(muestras === 1 ? '1 muestra cambió de estado' : `${muestras} muestras cambiaron de estado`);
    return partes.length ? `Listo: ${partes.join(', ')}.` : 'Listo: tus datos están al día.';
  },
  verCambios: 'Ver cambios',
  recordatorio: 'Recordatorio',
} as const;
