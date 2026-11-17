/**
 * Ventas · textos visibles (español de México, vocabulario fijo de 01_ux §1.5: «liquidada», «por liquidar»,
 * «reembolsado», «pedido»). Textos exactos de 01 §4.11 donde existen. Las cifras llegan ya formateadas con `formato`.
 */
const plural = (n: number, uno: string, varios: string): string => (n === 1 ? uno : varios);

export const T = {
  titulo: 'Ventas',
  contexto: (rango: string): string => `${rango} · por fecha del pedido · hora de la Ciudad de México · montos en MXN`,
  cargando: 'Cargando tus ventas…',
  lento: 'Sigue cargando… revisa la conexión con tu PC',

  periodo: {
    etiqueta: 'Periodo',
    otro: 'Otro periodo',
    '7d': '7 días',
    '30d': '30 días',
    '90d': '90 días',
    '12m': '12 meses',
    todo: 'Todo',
    largo: {
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días',
      '12m': 'Últimos 12 meses',
      todo: 'Todo',
    },
    esteMes: (mes: string): string => `Este mes (${mes})`,
    mesPasado: (mes: string): string => `Mes pasado (${mes})`,
    mes: (mes: string): string => mes,
    comparar: 'Comparar con el periodo anterior',
    vs: {
      '7d': '7 días anteriores',
      '30d': '30 días anteriores',
      '90d': '90 días anteriores',
      mes: 'el mes anterior',
      otro: 'el periodo anterior',
    },
  },

  kpi: {
    // Tras el «·» el periodo va en minúscula, como en Inicio y 02 §7.3: «Tu dinero · últimos 30 días».
    banda: (periodo: string): string => `Tu dinero · ${periodo.charAt(0).toLocaleLowerCase('es-MX')}${periodo.slice(1)}`,
    comision: 'Comisión estimada',
    liquidada: 'Liquidada',
    porLiquidar: 'Por liquidar',
    congelada: 'Congelada',
    perdida: 'Perdida (reembolsos)',
    pedidos: 'Pedidos',
    tasa: 'Tasa de reembolso',
    unidades: 'Unidades vendidas',
    ventas: 'Ventas generadas',
    deEstePeriodo: 'De pedidos hechos en este periodo',
    sinReembolsos: 'Sin contar reembolsos',
    enRevision: 'En revisión de TikTok',
    pedidosReembolsados: (n: number, cifra: string): string => `${cifra} ${plural(n, 'pedido', 'pedidos')}`,
    aprox: 'Aproximado, con el precio de venta',
    nuevo: 'Nuevo',
    pts: (cifra: string): string => `${cifra} pts`,
  },

  grafica: {
    metrica: 'Métrica',
    agrupar: 'Agrupar por',
    metricas: { comision: 'Comisión', pedidos: 'Pedidos', unidades: 'Unidades', tasa: 'Tasa de reembolso' },
    granularidades: { dia: 'Día', semana: 'Semana', mes: 'Mes' },
    titulo: (metrica: 'comision' | 'pedidos' | 'unidades' | 'tasa', gran: 'dia' | 'semana' | 'mes'): string => {
      const por = gran === 'dia' ? 'día' : gran === 'semana' ? 'semana' : 'mes';
      const que = metrica === 'comision' ? 'Comisión' : metrica === 'pedidos' ? 'Pedidos' : metrica === 'unidades' ? 'Unidades' : 'Tasa de reembolso';
      return `${que} por ${por}`;
    },
    liquidada: 'Liquidada',
    porLiquidar: 'Por liquidar',
    mejor: (gran: 'dia' | 'semana' | 'mes', cuando: string, monto: string): string =>
      `Tu mejor ${gran === 'dia' ? 'día' : gran === 'semana' ? 'semana' : 'mes'} del periodo: ${cuando} (${monto})`,
    aria: (cuando: string, comision: string, pedidos: string, reembolsados: string, tasa: string, enCurso: boolean): string =>
      `${cuando}${enCurso ? ' (en curso)' : ''}: ${comision} de comisión estimada · ${pedidos} pedidos · ${reembolsados} reembolsados (${tasa})`,
    ariaSimple: (cuando: string, valor: string, enCurso: boolean): string => `${cuando}${enCurso ? ' (en curso)' : ''}: ${valor}`,
    semanaDel: (desde: string, hasta: string): string => `Semana del ${desde} al ${hasta}`,
    enCurso: (texto: string): string => `${texto} (en curso)`,
    columnas: {
      comision: ['Periodo', 'Liquidada', 'Por liquidar', 'Comisión estimada', 'Pedidos', 'Reembolsados'],
      pedidos: ['Periodo', 'Pedidos'],
      unidades: ['Periodo', 'Unidades'],
      tasa: ['Periodo', 'Tasa de reembolso', 'Reembolsados', 'Pedidos'],
    },
  },

  dinero: {
    titulo: '¿Dónde está tu dinero?',
    liquidada: 'Liquidada',
    porLiquidar: 'Por liquidar',
    congelada: 'Congelada',
    perdida: 'Perdida por reembolsos',
    ayudaLiquidada: 'Comisión que TikTok ya confirmó para estos pedidos. Si TikTok reporta retenciones (ISR, IVA), las verás aparte.',
    ayudaPorLiquidar: 'Pedidos que esperan pago o que todavía pueden devolverse.',
    ayudaCongelada: 'Comisión que TikTok tiene en revisión.',
    ayudaPerdida: 'Comisión que se canceló porque el comprador devolvió o canceló.',
    total: (monto: string): string => `Tu corte: ${monto} de comisión estimada`,
    columnas: ['Concepto', 'Monto', 'Parte'],
  },

  dependencia: {
    titulo: 'De quién depende tu comisión',
    otras: 'Otras',
    texto: (tienda: string, pct: string): string => `${tienda} genera el ${pct} de tu comisión en este periodo.`,
    riesgo: 'Depender de una sola tienda es un riesgo.',
    columnas: ['Tienda', 'Comisión estimada', 'Parte'],
    sinVentas: 'Sin comisión en este periodo.',
  },

  reembolsos: {
    titulo: 'Reembolsos',
    texto: (monto: string): string => `Los reembolsos te quitaron ${monto} de comisión en este periodo.`,
    detalle: (reemb: string, pedidos: string, tasa: string): string => `${reemb} de ${pedidos} pedidos (${tasa})`,
    grafica: 'Tasa de reembolso por mes',
    aria: (mes: string, tasa: string, reemb: string, pedidos: string): string => `${mes}: ${tasa} de reembolso, ${reemb} de ${pedidos} pedidos`,
    columnas: ['Mes', 'Tasa de reembolso', 'Reembolsados', 'Pedidos'],
  },

  productos: {
    titulo: 'Productos que más venden',
    linea: (tienda: string | null, unidades: string): string => (tienda ? `${tienda} · ${unidades}` : unidades),
    unidades: (n: number, cifra: string): string => `${cifra} ${plural(n, 'unidad', 'unidades')}`,
    abrir: (nombre: string, comision: string): string => `${nombre}: ${comision} de comisión. Abrir el producto`,
    verTodos: 'Ver productos',
    vacio: 'Ningún producto vendió en este periodo.',
  },

  porMes: {
    titulo: 'Por mes',
    columnas: ['Mes', 'Pedidos', 'Reembolsados', 'Tasa', 'Comisión estimada', 'Liquidada'],
    alDia: (mes: string, dia: string): string => `${mes} (al ${dia})`,
    resumen: (pedidos: string, comision: string): string => `${pedidos} pedidos · ${comision}`,
  },

  pedidos: {
    titulo: 'Pedidos',
    filtros: 'Filtrar pedidos por estado',
    chips: { todos: 'Todos', liquidados: 'Liquidados', por_liquidar: 'Por liquidar', reembolsados: 'Reembolsados' },
    tabla: 'Pedidos del periodo',
    lista: 'Pedidos del periodo',
    pagina: (actual: string, total: string): string => `Página ${actual} de ${total}`,
    total: (n: number, cifra: string): string => `${cifra} ${plural(n, 'pedido', 'pedidos')}`,
    anterior: 'Anterior',
    siguiente: 'Siguiente',
    vacio: 'No hay pedidos con este filtro',
    vacioTexto: 'Prueba con otro estado o con un rango más amplio.',
    verTodos: 'Ver todos',
    tarjeta: (fecha: string, producto: string, estado: string, comision: string): string => `${fecha} · ${producto} · ${estado} · ${comision}`,
    masProductos: (n: number): string => `y ${n} ${plural(n, 'producto más', 'productos más')}`,
    abrir: (producto: string, fecha: string): string => `Pedido del ${fecha}: ${producto}. Ver el detalle`,
  },

  detalle: {
    titulo: (fecha: string): string => `Pedido del ${fecha}`,
    pedido: 'Pedido',
    total: 'Total del pedido',
    comisionEstimada: 'Comisión estimada',
    comisionLiquidada: 'Comisión liquidada',
    baseEstimada: 'Base de comisión estimada',
    baseReal: 'Base de comisión real',
    tasa: 'Tasa de comisión',
    estandar: 'Estándar',
    anuncios: 'Anuncios de la tienda',
    bono: 'Bono',
    cantidad: (n: number, precio: string): string => `${n} × ${precio}`,
    reembolsadas: (n: number): string => `${n} ${plural(n, 'unidad reembolsada', 'unidades reembolsadas')}`,
    devueltas: (n: number): string => `${n} ${plural(n, 'unidad devuelta', 'unidades devueltas')}`,
    isr: 'ISR',
    iva: 'IVA',
    agencia: 'Compartido con tu agencia',
    actualizado: (fecha: string): string => `Actualizado por TikTok el ${fecha}`,
    carrusel: 'Video carrusel (puede tener comisión menor)',
    contenido: 'Contenido',
    verVideo: 'Ver el video',
    verProducto: 'Ver el producto',
    cerrar: 'Cerrar',
    productoSinNombre: 'Producto sin nombre',
  },

  estados: {
    sinPedidos: 'No hay pedidos en este periodo',
    sinPedidosTexto: 'Prueba con un rango más amplio.',
    ver90: 'Ver últimos 90 días',
    trayendo: (hechos: string, total: string): string => `Todavía estamos trayendo tus pedidos (semana ${hechos} de ${total}). Las cifras pueden cambiar.`,
    trayendoSinSemana: 'Todavía estamos trayendo tus pedidos. Las cifras pueden cambiar.',
    errorTitulo: 'No pudimos cargar tus ventas',
    reintentar: 'Reintentar',
    necesitaPc: 'Necesita tu PC encendida',
    necesitaPcTexto: 'Este periodo no está en la copia de tu celular. Abre Corte en tu PC y conéctate a la misma red, o elige 30 días o Todo.',
    necesitaPcSeccion: 'Abre Corte en tu PC y conéctate a la misma red para ver esta sección.',
    errorSeccion: 'No pudimos cargar esta sección.',
  },
} as const;
