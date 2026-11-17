/**
 * Inicio · textos visibles (español de México, vocabulario fijo de 01_ux §1.5). Los textos exactos salen de 01 §4.1
 * (tablas «Textos» y «Estados»); los que 01 no fija siguen su tono. Las cifras llegan ya formateadas con `formato`.
 */
const plural = (n: number, uno: string, varios: string): string => (n === 1 ? uno : varios);

export const T = {
  pantalla: 'Inicio',
  saludo: (usuario: string): string => `Hola, ${usuario}`,
  saludoSinCuenta: 'Hola',
  actualizado: (cuando: string): string => `Actualizado ${cuando}`,
  sincronizando: 'Sincronizando con TikTok…',
  sinSincronizar: 'Todavía sin sincronizar',
  desdeTuPc: 'desde tu PC',
  /** 'Copia de hoy, 10:20 a. m.' · 'Copia de ayer, …' · 'Copia del 10 nov, 9:12 a. m.' (F2). */
  copiaDel: (cuando: string): string => (/^(hoy|ayer)\b/.test(cuando) ? `Copia de ${cuando}` : `Copia del ${cuando}`),
  buscar: 'Buscar',
  sincronizar: 'Sincronizar ahora',
  trayendo: 'Estamos trayendo tus datos de TikTok Shop. Lo que llegue se mostrará al instante.',
  cargando: 'Cargando tu inicio…',
  lento: 'Sigue cargando… revisa la conexión con tu PC',

  heroe: {
    region: 'Ponte al día',
    sobretitulo: 'Ponte al día',
    antes: (n: number): string => plural(n, 'Te falta', 'Te faltan'),
    despues: (n: number, corto: boolean): string => (corto ? plural(n, 'video', 'videos') : plural(n, 'video de muestra', 'videos de muestras')),
    /** Texto completo (lectores de pantalla y pruebas): «Te faltan 12 videos de muestras». */
    titulo: (n: number, cifra: string, corto: boolean): string =>
      `${plural(n, 'Te falta', 'Te faltan')} ${cifra} ${corto ? plural(n, 'video', 'videos') : plural(n, 'video de muestra', 'videos de muestras')}`,
    subtitulo: (tiendas: number, cifra: string): string => `${cifra} ${plural(tiendas, 'tienda espera', 'tiendas esperan')} tu video`,
    progreso: (publicadas: string, total: string): string => `${publicadas} de ${total} videos publicados`,
    siguiente: 'Siguiente',
    abrirSiguiente: (producto: string, tienda: string): string => `Siguiente: ${producto} de ${tienda}. Abrir el detalle`,
    /** «1 min» con espacio duro: con texto grande en un celular angosto el botón parte después del «·», nunca «1 / min». */
    armarPlan: 'Armar mi plan · 1 min',
    planearSoloEsta: 'Planear solo esta',
    verAgenda: 'Ver mi agenda',
    empezarSesion: 'Empezar sesión',
    marcarPublicada: 'Marcar publicada',
    ponermeAlCorriente: 'Ponerme al corriente',
    verVentasVideos: 'Ver las ventas de esos videos',
    conPlan: (termina: string, publica: string): string => `Terminas el ${termina} · último video publicado a más tardar el ${publica}`,
    nadaHoy: (siguiente: string | null): string => (siguiente ? `Hoy no haces videos. El siguiente es el ${siguiente}.` : 'Hoy no haces videos.'),
    atraso: (n: number): string => `Llevas ${n} ${plural(n, 'video', 'videos')} de retraso en tu plan`,
    alDiaTitulo: '¡Estás al día con todas tus muestras!',
    alDiaTexto: (videos: string, tiendas: string): string => `${videos} videos publicados para ${tiendas} tiendas. Las tiendas lo notan.`,
    alDiaTicket: 'Estás al día',
    alDiaTotal: (videos: string, tiendas: string): string => `${videos} videos · ${tiendas} tiendas`,
    avisadas: 'Tiendas avisadas',
    avisadasCifra: (avisadas: string, total: string): string => `${avisadas} de ${total}`,
    avisar: 'Avisar',
    noSePuede: (n: number): string => `${n} no se puede etiquetar`,
    avisarTienda: 'Avisar a la tienda',
    provisional: 'Orden provisional: faltan tus ventas',
    ordenNuevo: 'Hay un orden nuevo',
    actualizar: 'Actualizar',
    tira: 'Siguientes muestras de tu cola',
    tiraFoto: (producto: string, tienda: string): string => `${producto} de ${tienda}`,
    tiraMas: (n: number): string => `${n} ${plural(n, 'muestra más', 'muestras más')} en tu cola`,
  },

  vencen: {
    titulo: 'Vencen pronto · todavía cuentan para TikTok',
    fila: (producto: string, tienda: string): string => `${producto} · ${tienda}`,
    vence: (cuando: string): string => `vence ${cuando}`,
    planearHoy: 'Planear hoy',
  },
  promesas: {
    titulo: 'Promesas vencidas',
    fila: (tienda: string, fecha: string): string => `Le prometiste a ${tienda} publicar el ${fecha}`,
    preparar: 'Preparar mensaje',
  },
  hoy: {
    titulo: (fecha: string): string => `Hoy · ${fecha}`,
    conteo: (hechos: string, total: string): string => `${hechos} de ${total}`,
    completo: (hechos: string, total: string): string => `¡Terminaste lo de hoy! ${hechos} de ${total}.`,
    verAgenda: 'Ver mi agenda',
    videoListo: 'Video listo',
    marcarPublicada: 'Marcar publicada',
    publicada: 'Publicada',
  },

  dinero: {
    titulo: 'Tu dinero · últimos 30 días',
    verVentas: 'Ver ventas',
    comision: 'Comisión · 30 días',
    pedidos: 'Pedidos · 30 días',
    reembolsos: 'Reembolsos · 30 días',
    porLiquidar: 'Por liquidar · total',
    vs30: '30 días anteriores',
    nuevo: 'Nuevo',
    sinPedidos: 'Sin pedidos en este periodo',
    pedidosReembolsados: (n: number, cifra: string): string => `${cifra} ${plural(n, 'pedido reembolsado', 'pedidos reembolsados')}`,
    porLiquidarNota: 'De todos tus pedidos',
    porLiquidarNota30: 'De tus pedidos de 30 días',
    /** 01 §4.1 KPI 4 y Main.png: '45 pedidos · el más antiguo del 3 mar'. Sin la fecha: '45 pedidos por liquidar'. */
    porLiquidarPedidos: (n: number, cifra: string, masAntiguo: string | null): string => {
      if (n === 0) return 'Sin pedidos por liquidar';
      if (masAntiguo === null) return `${cifra} ${plural(n, 'pedido por liquidar', 'pedidos por liquidar')}`;
      return n === 1 ? `1 pedido · del ${masAntiguo}` : `${cifra} pedidos · el más antiguo del ${masAntiguo}`;
    },
    resumenSerie: (desde: string, hasta: string): string => `Comisión por semana de las últimas 12 semanas, de ${desde} a ${hasta}`,
  },

  tiendas: {
    titulo: 'Tiendas que necesitan atención',
    enlace: (n: number): string => `Ver las ${n} tiendas con pendientes`,
    abrir: (tienda: string, porque: string): string => `${tienda}: ${porque}. Abrir la tienda`,
    vacio: 'Ninguna tienda espera un video. Vas al día.',
    fotos: (n: number, tienda: string): string => `${n} ${plural(n, 'muestra pendiente', 'muestras pendientes')} de ${tienda}`,
  },
  avisos: {
    titulo: 'Para tener en cuenta',
  },
  estrella: {
    titulo: 'Tu video estrella de la semana',
    nota: (videos: number, cifra: string): string =>
      `en los últimos 7 días · ${cifra} ${plural(videos, 'video vendió', 'videos vendieron')} esta semana`,
    verVideos: 'Ver videos',
    rotulo: 'Foto del producto',
    unidades: (n: number, cifra: string): string => `${cifra} ${plural(n, 'unidad', 'unidades')}`,
    sinVideo: 'Esta semana todavía no vende ningún video.',
    sinVideoTexto: 'Cuando un video tenga ventas en los últimos 7 días, lo verás aquí.',
  },
  topVideos: {
    titulo: 'Tus videos que más venden · 30 días',
    verTodos: 'Ver videos',
    lista: 'Videos con más comisión en los últimos 30 días',
  },
  video: {
    sinNombre: (idCorto: string): string => `Video ${idCorto}`,
    etiqueta: (ranking: number, comision: string, unidades: string, producto: string): string =>
      `Video ${ranking}: ${comision} de comisión, ${unidades}. Producto: ${producto}`,
  },
  tendencia: {
    titulo: 'Comisión por semana · 12 semanas',
    estaSemana: 'esta sem.',
    pico: (rango: string, monto: string): string => `Semana pico: ${rango} · ${monto}`,
    aria: (rango: string, comision: string, pedidos: string, enCurso: boolean): string =>
      `Semana del ${rango}${enCurso ? ' (en curso)' : ''}: ${comision} de comisión estimada, ${pedidos} pedidos`,
    columnas: ['Semana', 'Comisión estimada', 'Pedidos', 'Reembolsados'],
    enCursoTabla: (rango: string): string => `${rango} (en curso)`,
  },
  // rev. 5 · Display API: resumen discreto del perfil de TikTok (o una invitación, una sola vez, a conectarlo).
  perfil: {
    region: 'Tu cuenta de TikTok',
    cuenta: (usuario: string): string => `@${usuario}`,
    enTikTok: 'en TikTok',
    seguidores: (n: number): string => plural(n, 'seguidor', 'seguidores'),
    likes: 'likes',
    cambio: (cifra: string): string => `${cifra} en 7 días`,
    cambioLeido: (cifra: string, que: string): string => `${cifra} ${que} en los últimos 7 días`,
    verVistas: 'Ver vistas de tus videos',
    invitacion: 'Conecta tus métricas de videos en Ajustes',
    cerrarInvitacion: 'Cerrar este aviso',
  },
  pie: (momento: string): string => `Datos de TikTok Shop · última sincronización ${momento}`,

  seccion: {
    necesitaPc: 'Necesita tu PC encendida',
    necesitaPcTexto: 'Abre Corte en tu PC y conéctate a la misma red para ver esta sección.',
    error: 'No pudimos cargar esta sección.',
    reintentar: 'Reintentar',
  },

  estados: {
    sinDatosAndroidTitulo: 'Todavía no hay datos en este celular.',
    sinDatosAndroidTexto: 'Empareja tu celular con Corte de tu PC para traer tu información.',
    emparejar: 'Emparejar con mi PC',
    errorTitulo: 'No pudimos cargar tu inicio',
    reintentar: 'Reintentar',
    sinDatosTitulo: 'Todavía no hay datos de TikTok Shop',
    sinDatosTexto: 'Sincroniza para traer tus muestras, ventas y videos.',
    sinPendientesTitulo: 'No tienes muestras pendientes',
    sinPendientesTexto: 'Cuando recibas una muestra, aquí verás qué video toca primero.',
  },
} as const;
