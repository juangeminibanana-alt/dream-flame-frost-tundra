/** Textos de Emparejar (01_ux §4.15 A2/A2'/A3, §5.3; BUILD_SPEC C6; 04 §B.9). Español de México. */
export const T = {
  tituloPantalla: 'Emparejar con tu PC',
  atras: 'Atrás',

  // A2 · cámara
  tituloA2: 'Escanea el código de tu PC',
  textoA2Antes: 'En tu PC abre ',
  textoA2Ruta: 'Conexión y ajustes › Celular',
  textoA2Despues: ' y escanea el código que aparece.',
  camaraAntes: 'Usamos la cámara solo para leer el código QR.',
  activarCamara: 'Activar cámara',
  camaraPidiendo: 'Esperando el permiso de la cámara…',
  camaraApunta: 'Apunta la cámara al código de tu PC',
  camaraDenegada: 'Sin la cámara puedes escribir el código que aparece en tu PC.',
  camaraNoDisponible: 'Este celular no nos deja usar la cámara. Escribe el código que aparece en tu PC.',
  qrNoEsDeCorte: 'Ese código QR no es de Corte. Escanea el que aparece en tu PC.',
  escribirCodigo: 'Escribir código',
  etiquetaVisor: 'Visor de la cámara',

  // A2' · código
  tituloA2b: 'Escribe el código',
  textoA2b: 'Es el código de 12 caracteres que aparece en tu PC, en Conexión y ajustes › Celular.',
  sinCamara: '¿Sin cámara? Escribe el código de tu PC',
  etiquetaCodigo: 'Código de tu PC',
  ayudaCodigo: (n: number) => (n === 12 ? 'Código completo' : `${n} de 12 caracteres · da igual mayúsculas o minúsculas`),
  usarCamara: 'Usar la cámara',
  buscandoPc: 'Buscando Corte en tu Wi‑Fi…',
  encontramos: 'Encontramos Corte en tu Wi‑Fi',
  encontramosVarias: 'Encontramos Corte en estas PC de tu Wi‑Fi',
  mismoWifi: 'mismo Wi‑Fi',
  pcElegida: 'Nos conectaremos a esta PC',
  noEncontramos: 'No vimos tu PC en esta red. Escribe su dirección o déjala vacía para seguir buscando.',
  etiquetaDireccion: 'Dirección de la PC',
  ayudaDireccion: 'Aparece en tu PC debajo del código, por ejemplo 192.168.1.20.',
  direccionInvalida: 'Escribe una dirección de tu red, como 192.168.1.20.',
  conectar: 'Conectar',
  faltaCodigo: 'Escribe los 12 caracteres del código que aparece en tu PC.',
  buscarOtraVez: 'Buscar otra vez',
  seguro: 'Tus datos viajan cifrados solo por tu Wi‑Fi. Tu acceso a TikTok se queda en tu PC; el celular guarda una copia para verla sin conexión.',

  // Enlace de fuera (04 §B.9)
  enlaceTitulo: (nombre: string, ip: string) => `¿Emparejar con ${nombre} (${ip})?`,
  enlaceTexto: 'Abriste un enlace de emparejamiento. Solo nos conectamos si tú lo confirmas.',
  enlaceTuPc: 'tu PC',
  emparejar: 'Emparejar',
  cancelar: 'Cancelar',

  // Progreso
  conectando: 'Conectando con tu PC…',
  conectandoTexto: 'Esto tarda unos segundos. Mantén Corte abierto en tu PC.',
  tituloA3: 'Confirma en tu PC',
  textoA3: 'Revisa que tu PC muestre el mismo número y toca Permitir.',
  etiquetaNumero: (n: string) => `Número de confirmación: ${n.split('').join(' ')}`,
  conectado: (pc: string) => (pc ? `Conectado a ${pc}` : 'Conectado'),
  copiando: 'Copiando tus datos…',

  // Errores (01 §5.3)
  errores: {
    vencido: 'Ese código ya caducó. Escanea el código nuevo que aparece en tu PC.',
    sinRespuesta: 'No confirmaste en tu PC a tiempo. Vuelve a intentarlo.',
    rechazado: 'Tu PC rechazó la conexión.',
    red: 'No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.',
    redAyuda: 'Si Windows preguntó por la red, elige Redes privadas. Las redes de invitados o públicas suelen bloquear esta conexión.',
    huella: 'La PC respondió con una identidad distinta. Por seguridad no nos conectamos. Escanea el código otra vez desde tu PC.',
    ocupado: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
    enlaceInvalido: 'Ese enlace no apunta a una PC de tu red. Escanea el código desde tu PC.',
    qrInvalido: 'Ese código QR no es de Corte. Escanea el que aparece en tu PC.',
    codigoInvalido: 'Ese código no es válido. Revisa los 12 caracteres que aparecen en tu PC.',
    version: 'Corte de tu PC y el de este celular tienen versiones distintas. Actualiza el que sea más viejo.',
    cancelado: 'Se canceló el emparejamiento.',
  },
  escanearDeNuevo: 'Escanear de nuevo',
  intentarDeNuevo: 'Intentar de nuevo',
  reintentar: 'Reintentar',
  tituloError: 'No pudimos emparejar',

  // Windows
  soloAndroidTitulo: 'El emparejamiento se hace desde tu celular',
  soloAndroidTexto: 'Abre Corte en tu Android y toca Emparejar con mi PC. En esta PC, el código está en Conexión y ajustes › Celular.',
  irACelular: 'Ir a Celular',
} as const;
