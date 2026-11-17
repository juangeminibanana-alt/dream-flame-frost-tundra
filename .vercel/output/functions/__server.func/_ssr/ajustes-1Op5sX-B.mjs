import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as fechaPrometidaPorOmision, A as EnlaceRuta, D as ETIQUETA_PASO_SYNC, Fn as sumarDias, Gn as useClaseAncho, H as Icono, Ht as elegirArchivo, J as Menu, Jt as esPendiente, Kn as useConexionPc, M as Esqueleto, N as EsqueletoVista, P as EstadoVacio, Q as OpcionRadio, Rn as textoPermiso, Rt as copiarTexto, St as ahoraS, Vn as useAcciones, W as Interruptor, Wn as useCapacidades, X as Modal, _n as olvidarPc, _t as VARIABLES_PLANTILLA, ar as useSesion, at as PuntoVivo, bn as pedirPermisoNotificaciones, c as BarraProgreso, cn as infoPlataforma, cr as useToast, d as BotonIcono, er as useParametro, et as Palomita, g as Chip, h as Casilla, ir as useRuta, j as ErrorHub, jn as resolverPlantilla, k as EncabezadoPantalla, m as CampoTexto, n as AvatarCuenta, nn as formato, nr as usePrimeraVez, o as BarraApilada, on as hoyLocal, or as useSync, pn as navegar, qn as useConsulta, rn as guardarArchivo, rt as Pantalla, sn as hub, sr as useTema, st as Segmentado, t as AreaTexto, tr as usePlataforma, u as Boton, un as invalidar, vt as abrirExterno, xn as permisoNotificaciones, xt as actualizarCopiaAhora } from "./app-CLiVRbtG.mjs";
import { O as PanelQrEmparejamiento } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajustes-1Op5sX-B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Textos de Conexión y ajustes (01_ux §4.14, §5.4 A, §7.5; BUILD_SPEC C10, C35, C36, C37, C42; 04 §C.10).
* Español de México, vocabulario de 01 §1.5: nunca «token», «scope», «sample» ni «seller».
*/
var T = {
	tituloPantalla: "Conexión y ajustes",
	tituloMas: "Más",
	contexto: "Tu cuenta de TikTok Shop, tu celular y cómo se comporta Corte en esta PC.",
	contextoAndroid: "Tu conexión con la PC, tus recordatorios y cómo se ve Corte en este celular.",
	navegacion: "Secciones de ajustes",
	noExiste: "Esta sección no existe",
	noExisteTexto: "Elige una de la lista para ver sus ajustes.",
	irAlInicio: "Ver todos los ajustes",
	volverMas: "Más",
	cargando: "Cargando tus ajustes…",
	errorCarga: "No pudimos leer estos ajustes.",
	reintentar: "Reintentar",
	necesitaPc: "Necesita tu PC encendida",
	necesitaPcTexto: "Este ajuste vive en Corte de tu PC. Conéctate al mismo Wi‑Fi para verlo.",
	cancelar: "Cancelar",
	guardar: "Guardar",
	cerrar: "Cerrar",
	entendido: "Entendido",
	secciones: {
		tiktok: {
			titulo: "TikTok Shop",
			tituloAndroid: "Cuenta de TikTok",
			resumen: "Clave de la app y autorización de tu cuenta",
			resumenAndroid: "El estado de tu conexión; se maneja desde tu PC"
		},
		metricas: {
			titulo: "Métricas de tus videos",
			resumen: "Vistas, likes y pedidos por cada 1,000 vistas",
			resumenAndroid: "Se configura en la PC"
		},
		sincronizacion: {
			titulo: "Sincronización",
			resumen: "Cada cuánto se actualizan tus datos"
		},
		celular: {
			titulo: "Celular",
			tituloAndroid: "Conexión con la PC",
			resumen: "Empareja y administra tus celulares",
			resumenAndroid: "Tu PC, la copia y los cambios por enviar"
		},
		recordatorios: {
			titulo: "Recordatorios",
			resumen: "Plan diario, muestras por vencer y promesas"
		},
		plantillas: {
			titulo: "Plantillas de mensajes",
			resumen: "Los textos que copias para tus tiendas"
		},
		apariencia: {
			titulo: "Apariencia",
			resumen: "Tema, densidad y animaciones",
			resumenAndroid: "Tema y animaciones"
		},
		datos: {
			titulo: "Privacidad y datos",
			resumen: "Qué se guarda, exportar, importar y borrar"
		},
		ayuda: {
			titulo: "Ayuda",
			resumen: "Respuestas cortas a las dudas comunes"
		},
		acerca: {
			titulo: "Acerca de",
			resumen: "Versión, licencias y puerto"
		}
	},
	mas: {
		copiaDe: (hace) => `Última copia ${hace}`,
		datosDel: (cuando) => `Trabajas con los datos del ${cuando}`,
		sinCopia: "Todavía no hay datos en este celular",
		cuentaConectada: "Conectado a TikTok Shop",
		cuentaRevisar: "Revisa tu conexión con TikTok"
	},
	tiktok: {
		descripcion: "Corte usa la API oficial de TikTok Shop con tu autorización. Son dos cosas separadas: la clave de tu app de Partner Center y la autorización de tu cuenta.",
		grupoCuenta: "Autorización de tu cuenta",
		grupoClave: "Clave de la app (Partner Center)",
		grupoPermisos: "Permisos que otorgaste",
		chipConectado: "Conectado",
		chipReautorizar: "Necesita reautorización",
		chipSinConectar: "Sin conectar",
		chipSinRegion: "Sin región de venta",
		region: "Región de venta",
		regionMexico: "México",
		tipoCuenta: "Tipo de cuenta",
		tipoCreador: "Creador de TikTok Shop",
		renueva: (fecha) => `La conexión se renueva sola. Autorización vigente hasta el ${fecha}.`,
		claveGuardada: "Clave de la app: guardada",
		claveFalta: "Clave de la app: falta",
		chipGuardada: "Guardada",
		chipFalta: "Falta",
		venceEn: (dias) => dias <= 1 ? "Tu autorización vence mañana. Renuévala ahora; tarda menos de un minuto." : `Tu autorización vence en ${dias} días. Renuévala ahora; tarda menos de un minuto.`,
		vencida: "Tu autorización venció o la retiraste en TikTok. Tus datos guardados siguen aquí, pero no se actualizarán hasta que reautorices.",
		faltanPermisos: (lista) => `Faltan permisos: ${lista}. Algunas secciones no se actualizarán. Vuelve a autorizar y deja activados todos los permisos.`,
		faltaClave: "Para conectar, Corte necesita la clave de tu app de Partner Center (una sola vez).",
		sinAutorizar: "La clave de la app ya está guardada. Falta que autorices tu cuenta en TikTok Shop; tarda menos de un minuto.",
		sinRegion: "Tu cuenta aún no tiene región de venta en TikTok Shop, así que no podemos leer tus datos. Revísalo en la app de TikTok.",
		reautorizar: "Reautorizar",
		reautorizarAhora: "Reautorizar ahora",
		conectar: "Conectar con TikTok Shop",
		desconectar: "Desconectar",
		importar: "Importar desde archivo…",
		pegarClave: "Pegar clave de la app",
		tituloElegir: "Elige el archivo de tu conexión anterior",
		importando: "Importando…",
		importado: "Importamos tu conexión anterior",
		importadoClave: "Importamos la clave de la app",
		importadoTexto: (aviso) => aviso,
		borrarAnterior: "Mandar el archivo anterior a la Papelera",
		androidManeja: "La conexión con TikTok la maneja tu PC.",
		androidC35: "Para volver a conectar, abre Corte en tu PC › Conexión y ajustes › TikTok.",
		tecnicos: "Datos técnicos",
		tecnicosClaves: "Claves de los permisos",
		claveOrigen: (origen, fecha) => `Clave de la app: guardada${fecha ? ` el ${fecha}` : ""} (${origen})`,
		origenes: {
			importado: "importada",
			manual: "pegada",
			oauth: "pegada",
			demo: "de demostración"
		},
		desconectarTitulo: "¿Desconectar tu cuenta de TikTok?",
		desconectarTexto: "Borraremos de esta PC la autorización de tu cuenta. La clave de la app se conserva para que puedas volver a conectar cuando quieras. Tus datos y tu plan se conservan, pero dejarán de actualizarse.",
		desconectado: "Desconectamos tu cuenta de TikTok",
		claveTitulo: "Pegar clave de la app",
		claveDescripcion: "Cópiala de Partner Center › tu app › App key y App secret.",
		claveEtiqueta: "Clave secreta de la app (App secret)",
		claveAyuda: "Se guarda cifrada en esta PC y nunca se vuelve a mostrar.",
		claveVacia: "Pega la clave secreta de tu app.",
		claveGuardadaToast: "Guardamos la clave de la app"
	},
	metricas: {
		descripcion: "Corte puede traer las vistas, likes, comentarios y compartidos de tus videos públicos para que veas cuántos pedidos te deja cada 1,000 vistas. Solo lee: no publica ni cambia nada en tu cuenta.",
		queEs: "Usa una app aparte, que creas tú en TikTok for Developers en modo Sandbox. No es la de TikTok Shop.",
		chipConectada: "Conectada",
		chipSinConectar: "Sin conectar",
		chipSinConfigurar: "Sin configurar",
		chipEsperando: "Esperando a TikTok",
		chipReautorizar: "Vuelve a conectar",
		chipFaltaPermiso: (n) => n === 1 ? "Falta un permiso" : "Faltan permisos",
		/** Título de la tarjeta cuando aún no hay cuenta conectada. */
		titulos: {
			sin_configurar: "Trae las vistas de tus videos",
			sin_conectar: "Tu app ya está guardada",
			esperando: "Conectando con TikTok",
			conectada: "Tu cuenta de TikTok",
			reautorizar: "Tu cuenta de TikTok"
		},
		grupoApp: "Tu app de TikTok for Developers",
		comoCrear: "¿Cómo creo la app?",
		pasos: [
			"Entra a developers.tiktok.com con tu cuenta de TikTok y crea una app nueva.",
			"Déjala en modo Sandbox y agrega Login Kit para escritorio (Desktop).",
			"Activa los permisos: user.info.basic, user.info.profile, user.info.stats y video.list.",
			"Como dirección de regreso (Redirect URI) escribe la de abajo.",
			"Copia el Client key y el Client secret de tu app y pégalos aquí."
		],
		redirect: "http://127.0.0.1:*/oauth/tiktok",
		copiarRedirect: "Copiar la dirección de regreso",
		redirectCopiado: "Dirección de regreso copiada",
		clientKey: "Client key",
		clientKeyAyuda: "De 8 a 64 letras y números.",
		clientSecret: "Client secret",
		clientSecretAyuda: "Se guarda cifrado en esta PC y nunca se vuelve a mostrar.",
		faltaKey: "Escribe el Client key de tu app.",
		faltaSecret: "Escribe el Client secret de tu app.",
		formatoKey: "El Client key debe tener de 8 a 64 letras y números, sin espacios.",
		formatoSecret: "El Client secret debe tener de 16 a 128 letras, números, guiones o guiones bajos, sin espacios.",
		reescribeSecret: "Por seguridad, vuelve a escribir el Client secret.",
		guardar: "Guardar",
		guardadas: "Guardamos los datos de tu app",
		listaParaConectar: "Falta que autorices tu cuenta de TikTok; tarda menos de un minuto.",
		conectar: "Conectar con TikTok",
		autorizaYVuelve: "Autoriza en el navegador y vuelve aquí.",
		cambiarCredenciales: "Cambiar los datos de tu app",
		cambiar: "Cambiar",
		cambiarSinCuenta: "Por si te equivocaste al escribirlos o creaste otra app.",
		cambiarTitulo: "Cambiar los datos de tu app",
		cambiarDescripcion: "Si cambias el Client key, la conexión actual se borra y tendrás que volver a conectar.",
		esperandoTitulo: "Esperando a que autorices en TikTok…",
		esperandoTexto: "Abrimos TikTok en tu navegador. Autoriza a Corte y vuelve aquí: esto se actualiza solo.",
		caducaEn: (tiempo) => `El enlace vence en ${tiempo}`,
		abrirOtraVez: "Abrir TikTok otra vez",
		noAbrio: "No pudimos abrir tu navegador. Copia el enlace y ábrelo tú.",
		copiarEnlace: "Copiar enlace",
		enlaceCopiado: "Enlace copiado",
		vencio: "El enlace para autorizar venció. Vuelve a intentarlo.",
		dejarDeEsperar: "Dejar de esperar",
		conectadaToast: "Listo: ya traemos las vistas de tus videos",
		grupoCuenta: "Tu cuenta de TikTok",
		verificada: "Verificada",
		seguidores: "Seguidores",
		siguiendo: "Siguiendo",
		likes: "Likes en total",
		videos: "Videos públicos",
		grupoPermisos: "Permisos que otorgaste",
		permisos: {
			"user.info.basic": "Tu nombre y foto",
			"user.info.profile": "Los datos de tu perfil",
			"user.info.stats": "Tus seguidores y likes",
			"video.list": "La lista de tus videos y sus vistas"
		},
		grupoSync: "Sincronización de tus videos",
		ultimaSync: (cuando) => `Última: ${cuando}`,
		sinSync: "Todavía no se han traído tus videos. Se traen en la siguiente sincronización.",
		resumenSync: (videos, nuevos, cambiados) => [
			`${videos} ${videos === "1" ? "video" : "videos"}`,
			...nuevos > 0 ? [`${nuevos} ${nuevos === 1 ? "nuevo" : "nuevos"}`] : [],
			...cambiados > 0 ? [`${cambiados} con cifras nuevas`] : []
		].join(" · "),
		syncIncompleta: "Llegamos al tope de 1,000 videos: los más viejos no se actualizan.",
		estadosSync: {
			ok: "Listo",
			parcial: "Listo, con avisos",
			error: "No se pudo",
			sin_permiso: "Sin permiso"
		},
		sincronizar: "Sincronizar ahora",
		sincronizando: "Sincronizando…",
		desconectar: "Desconectar",
		tecnicos: "Datos técnicos",
		conectadaDesde: "Conectada desde",
		accesoRenueva: "El acceso se renueva solo",
		autorizacionHasta: "Autorización vigente hasta",
		desconectarTitulo: "¿Desconectar las métricas de tus videos?",
		desconectarTexto: "Corte dejará de traer las vistas de tus videos y le pedirá a TikTok que retire el acceso. Tus ventas no cambian.",
		borrarDatos: "Borrar también las vistas, la tendencia y las portadas que ya se trajeron",
		olvidarApp: "Olvidar el Client key y el Client secret",
		desconectada: "Desconectamos las métricas de tus videos",
		desconectadaSinInternet: "Se desconectó de esta PC. No pudimos avisar a TikTok porque no hay internet; puedes retirar el acceso desde la app de TikTok.",
		reautorizar: "TikTok pide que vuelvas a autorizar a Corte. Mientras tanto, las vistas que ya tienes se quedan como están.",
		volverAConectar: "Volver a conectar",
		faltanPermisos: (lista, n) => n === 1 ? `Falta un permiso: ${lista}. Sin él algunas cifras no se actualizan. Vuelve a conectar y deja activados todos los permisos.` : `Faltan ${n} permisos: ${lista}. Sin ellos algunas cifras no se actualizan. Vuelve a conectar y deja activados todos los permisos.`,
		errorDesde: (cuando) => `Pasó ${cuando}.`,
		reintentarLuego: "Lo volvemos a intentar en la siguiente sincronización.",
		androidTitulo: "Se configura en la PC",
		androidTexto: "Para conectar las métricas de tus videos, abre Corte en tu PC › Conexión y ajustes › Métricas de tus videos. El celular verá las vistas en cuanto la PC las traiga.",
		androidConectada: (usuario) => `Tu PC ya trae las vistas de @${usuario}.`,
		demo: "En el modo de demostración la conexión ya viene lista con datos de ejemplo."
	},
	sync: {
		descripcion: "Corte trae tus muestras, pedidos y productos de TikTok Shop. Tu plan, tus avisos y tus notas nunca se tocan.",
		ultima: (cuando, tardo) => `Última sincronización: ${cuando}${tardo ? ` (tardó ${tardo})` : ""}`,
		nunca: "Todavía no se ha sincronizado",
		ahora: "Sincronizar ahora",
		enCurso: "Sincronizando…",
		cancelar: "Cancelar",
		grupoAuto: "Automática",
		intervalo: "Sincronizar automáticamente",
		opciones: {
			"15": "15 min",
			"30": "30 min",
			"60": "60 min",
			apagado: "Apagada"
		},
		cada: (min) => `Cada ${min} minutos mientras Corte está abierto o en segundo plano.`,
		apagada: "No sincronizamos solos. Usa Sincronizar ahora cuando quieras.",
		recomendado: "Recomendado: 30 min",
		segundoPlano: "Mantener en segundo plano al cerrar la ventana",
		segundoPlanoDesc: "Así tu celular puede actualizarse y seguimos sincronizando con TikTok.",
		segundoPlanoSinElegir: "Te lo preguntaremos la primera vez que cierres la ventana.",
		iniciarWindows: "Abrir Corte al iniciar Windows (minimizado)",
		iniciarWindowsDesc: "Corte arranca en la bandeja del sistema, sin abrir la ventana.",
		iniciarBloqueado: "Lo apagaste desde el Administrador de tareas de Windows. Vuelve a activarlo ahí.",
		grupoModulos: "Qué tienes en esta PC",
		ventas: "Tus ventas",
		pedidosDesde: (n, desde) => `${n} pedidos (desde el ${desde})`,
		pedidos: (n) => `${n} pedidos`,
		vitrinaSinLeer: "No se pudo leer",
		fichas: "Fichas de productos de tus ventas",
		portadas: "Portadas de videos con foto",
		deTotal: (n, total) => `${n} de ${total}`,
		noSeActualizo: "no se pudo actualizar",
		grupoAvanzado: "Opciones avanzadas",
		completa: "Volver a descargar todo",
		completaDesc: "Revisión completa: vuelve a pedir a TikTok tus muestras, productos y pedidos.",
		completaTitulo: "¿Volver a descargar todo?",
		completaTexto: "Esto vuelve a pedir a TikTok hasta 400 días de pedidos. Puede tardar varios minutos. Tu plan, tus avisos y tus notas no se tocan.",
		completaIniciada: "Empezamos la revisión completa",
		grupoHistorial: "Historial reciente",
		historialVacio: "Aquí verás cada sincronización: cuándo fue y qué cambió.",
		listo: "Listo",
		listoAvisos: "Listo con avisos",
		noSePudo: (m) => `No se pudo: ${m.replace(/\.$/, "").replace(/^./, (c) => c.toLowerCase())}`,
		cancelada: "Cancelada",
		enCursoHist: "En curso",
		sinCambios: "Sin cambios",
		pedidosNuevos: (n) => n === 1 ? "1 pedido nuevo" : `${n} pedidos nuevos`,
		muestrasNuevas: (n) => n === 1 ? "1 muestra nueva" : `${n} muestras nuevas`,
		muestrasCambiaron: (n) => n === 1 ? "1 muestra cambió de estado" : `${n} muestras cambiaron de estado`,
		productosNuevos: (n) => n === 1 ? "1 producto nuevo" : `${n} productos nuevos`,
		origenes: {
			auto: "automática",
			usuario: "tú la pediste",
			arranque: "al abrir Corte",
			telefono: "desde tu celular",
			demo: "demostración"
		},
		tipoCompleta: "revisión completa",
		androidCopia: (cuando) => `Última copia de tu PC: ${cuando}`,
		androidSinCopia: "Todavía no hay copia en este celular.",
		androidTexto: "La sincronización con TikTok la hace Corte en tu PC. Tu celular trae una copia cada vez que se conecta.",
		sincronizando: "Empezamos a sincronizar"
	},
	celular: {
		descripcion: "Avisa a tus tiendas desde el celular, con tu plan y tus ventas, incluso sin internet. Se actualiza cuando tu celular y esta PC están en la misma red Wi‑Fi.",
		titulo: "Lleva Corte en tu celular",
		permitir: "Permitir que mis celulares se conecten",
		permitirDesc: "Tu celular solo se conecta dentro de tu red Wi‑Fi. Nunca recibe tu acceso a TikTok.",
		avisoRedesTitulo: "Antes de activar",
		avisoRedes: "Windows te preguntará si Corte puede usar la red. Elige “Redes privadas”.",
		activar: "Activar",
		apagado: "Mientras esté apagado, tus celulares se quedan con su última copia.",
		grupoPc: "Esta PC",
		alias: "Nombre de esta PC en tu celular",
		aliasAyuda: "Lo verás al emparejar. Nunca usamos el nombre de tu Windows.",
		aliasError: "Usa de 1 a 40 caracteres, sin saltos de línea.",
		aliasGuardado: "Cambiamos el nombre de esta PC",
		direccion: "Dirección de esta PC",
		sinDireccion: "Sin red local",
		grupoCelulares: "Celulares emparejados",
		sinCelulares: "Todavía no emparejas ningún celular.",
		ultimaConexion: (hace) => `Última conexión ${hace}`,
		nuncaConectado: "Aún no se conecta",
		emparejadoEl: (fecha) => `Emparejado el ${fecha}`,
		permisos: "Qué puede hacer",
		soloVer: "Solo ver",
		verEditar: "Ver y editar",
		renombrar: "Renombrar",
		renombrarTitulo: "Renombrar celular",
		nombreCelular: "Nombre del celular",
		olvidar: "Olvidar",
		olvidarTitulo: (n) => `¿Olvidar ${n}?`,
		olvidarTexto: "Ese celular conservará su última copia, pero no podrá actualizarse hasta que lo vuelvas a emparejar.",
		olvidado: (n) => `Olvidamos ${n}`,
		emparejarOtro: "Emparejar otro celular",
		ocultarQr: "Ocultar código",
		emparejado: (n) => `${n} quedó emparejado`,
		firewallRevisando: "Revisando el firewall de Windows…",
		firewallBien: "Windows deja que tu celular encuentre esta PC en esta red.",
		firewallBloqueado: "Windows está bloqueando a Corte en esta red.",
		firewallArreglar: "Arreglar (pide permiso de Windows)",
		firewallPublica: "Tu Wi‑Fi está marcada como Pública. Para que tu celular encuentre esta PC, elige una opción:",
		firewallOpcionPrivada: "Es mi red de casa: márcala como privada",
		firewallOpcionPrivadaDesc: "Windows confía en esta red y deja pasar a tu celular.",
		firewallOpcionPublica: "Dejarla como pública y permitir solo mi red local",
		firewallOpcionPublicaDesc: "En redes públicas de verdad (café, aeropuerto) apaga «Permitir celulares».",
		firewallOpciones: "Cómo dejar pasar a tu celular",
		firewallConfigurar: "Configurar (pide permiso de Windows)",
		firewallListo: "Listo. Tu celular ya puede encontrar esta PC.",
		firewallCancelado: "Está bien. Cuando Windows te pregunte, elige “Redes privadas”.",
		firewallFallo: "No pudimos cambiar el firewall. Revisa lo que falta y vuelve a intentarlo.",
		firewallDesconocido: "No pudimos revisar el firewall de Windows.",
		firewallRevisar: "Revisar otra vez",
		firewallAyuda: "Si Windows preguntó por la red, elige Redes privadas. Las redes de invitados o públicas suelen bloquear esta conexión."
	},
	pc: {
		conectado: (pc) => `Conectado a ${pc}`,
		sinConexion: "Sin conexión con tu PC",
		metaConectado: "Se actualiza sola mientras tu celular y tu PC están en el mismo Wi‑Fi.",
		metaSinConexion: "Trabajas con tu última copia. Tus cambios se envían al reconectar.",
		sinEmparejar: "Todavía no emparejas este celular",
		sinEmparejarTexto: "Empareja tu celular con Corte de tu PC para traer tu información.",
		emparejar: "Emparejar con mi PC",
		ultimaCopia: "Última copia",
		sinCopia: "Todavía no hay copia",
		cambios: "Cambios por enviar",
		permisos: "Este celular puede",
		verEditar: "Ver y editar",
		soloVer: "Solo ver",
		direccion: "Dirección de tu PC",
		sincronizando: "Tu PC está sincronizando con TikTok",
		actualizar: "Actualizar ahora",
		actualizado: "Copia actualizada",
		otraPc: "Emparejar con otra PC",
		olvidar: "Olvidar esta PC",
		olvidarTitulo: "¿Olvidar esta PC?",
		olvidarTexto: (n) => `Se borrará la copia de este celular y tus cambios que aún no se envían (${n}).`,
		revocado: "Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.",
		emparejarDeNuevo: "Emparejar de nuevo",
		actualizaPc: "Actualiza Corte en tu PC: tiene una versión más vieja que la de este celular.",
		actualizaApp: "Actualiza Corte en este celular: tu PC tiene una versión más nueva.",
		ayuda: "Tu celular se actualiza desde Corte de tu PC por Wi‑Fi. Mientras tanto, puedes seguir trabajando con la última copia."
	},
	recordatorios: {
		descripcion: "Avisos en tu celular o en Windows para que no se te pase un video ni una promesa. Funcionan sin internet.",
		grupoPermiso: "Notificaciones",
		permisoConcedido: "Las notificaciones están activadas.",
		permisoDenegado: "Las notificaciones están desactivadas para Corte. Actívalas para recibir tus recordatorios.",
		permisoNoAplica: "Los recordatorios salen como globos de Windows mientras Corte está abierto o en segundo plano.",
		permisoExplicacion: "Para recordarte tus videos y tus promesas necesitamos permiso para mostrar notificaciones.",
		pedirPermiso: "Permitir notificaciones",
		grupoAvisos: "Qué te recordamos",
		diario: "Recordatorio diario del plan",
		diarioDesc: "Solo los días que haces videos.",
		hora: (h) => `Hora: ${h}`,
		horaEtiqueta: "Hora del recordatorio diario",
		porVencer: "Muestras por vencer",
		porVencerDesc: "Te avisamos 48 h y 24 h antes.",
		promesas: "Promesas a tiendas",
		promesasDesc: "Te avisamos un día antes de la fecha que prometiste.",
		atrasados: "Videos atrasados",
		atrasadosDesc: "Si te quedan videos de ayer, te avisamos para moverlos a hoy.",
		semanal: "Resumen semanal",
		semanalDesc: "Los lunes a las 9:00 a. m.",
		grupoAvance: "Tu avance",
		programo: "Programo mis videos en TikTok",
		programoDesc: "Agrega el paso Programada antes de Publicada.",
		ejemplo: "Así se ve:",
		ejemplos: {
			diario: "«Hoy toca: 3 videos de muestras»",
			porVencer: "«Una muestra vence mañana»",
			promesas: "«Mañana vence lo que le prometiste a tu tienda»",
			atrasados: "«Te quedaron 2 videos de ayer»",
			semanal: "«Tu semana: comisión, pedidos y videos publicados»"
		},
		guardado: "Guardamos tus recordatorios"
	},
	plantillas: {
		descripcion: "Corte arma el mensaje para cada tienda con estas plantillas. Las variables entre llaves se llenan solas con tus datos.",
		lista: "Tus plantillas",
		editada: "Editada",
		original: "Original",
		editar: "Editar",
		cuerpo: "Texto de la plantilla",
		variables: "Insertar variable",
		vistaPrevia: "Vista previa con una muestra real",
		sinMuestra: "Cuando tengas una muestra pendiente verás aquí cómo queda el mensaje.",
		faltan: "Faltan datos para esta muestra: el mensaje se copiaría incompleto.",
		restaurar: "Restaurar original",
		restaurada: "Restauramos la plantilla original",
		guardada: "Guardamos la plantilla",
		firma: "Tu firma",
		firmaPlaceholder: (u) => `Ej. Tu nombre · @${u}`,
		firmaAyuda: "Se agrega al final de tus mensajes con la variable {firma}.",
		firmaGuardada: "Guardamos tu firma",
		volver: "Todas las plantillas"
	},
	apariencia: {
		descripcion: "Cómo se ve Corte en este equipo. El tema y las animaciones también llegan a tu celular.",
		descripcionAndroid: "Cómo se ve Corte en este celular.",
		tema: "Tema",
		temas: {
			sistema: "Según el sistema",
			claro: "Claro",
			oscuro: "Oscuro"
		},
		densidad: "Densidad",
		densidadDesc: "Compacta muestra más filas en las tablas.",
		densidades: {
			comoda: "Cómoda",
			compacta: "Compacta"
		},
		animaciones: "Reducir animaciones",
		animacionesOpc: {
			sistema: "Según el sistema",
			si: "Sí",
			no: "No"
		},
		animacionesDesc: "Con «Sí» quitamos los movimientos y dejamos solo fundidos cortos.",
		idioma: "Idioma",
		idiomaValor: "Español (México)",
		guardado: "Guardamos tu apariencia"
	},
	datos: {
		privacidad: "Tus datos de TikTok Shop se guardan solo en esta PC, dentro de tu usuario de Windows, y en tu celular si lo emparejas. Tus llaves de TikTok van cifradas y nunca salen de esta PC. Corte no los envía a ningún servidor que no sea de TikTok.",
		grupoEspacio: "Espacio usado",
		espacio: (datos, imagenes) => `Espacio usado: datos ${datos} · imágenes ${imagenes}`,
		espacioTitulo: "Espacio que ocupa Corte en esta PC",
		partes: {
			datos: "Datos",
			imagenes: "Imágenes",
			registros: "Registros"
		},
		columnaQue: "Qué",
		columnaEspacio: "Espacio",
		borrarImagenes: "Borrar caché de imágenes",
		borrarImagenesTitulo: "¿Borrar la caché de imágenes?",
		borrarImagenesTexto: "Las fotos de tus productos se vuelven a descargar poco a poco cuando las necesites. Tus datos y tu plan no se tocan.",
		imagenesBorradas: "Borramos la caché de imágenes",
		grupoTuyo: "Tu plan, avisos y notas",
		exportar: "Exportar mi plan, avisos y notas",
		exportarDesc: "Un archivo JSON con tu plan, avisos, notas, recordatorios, plantillas y preferencias.",
		exportarCorto: "Exportar",
		importarCorto: "Importar",
		borrarTodoDesc: "Incluye la autorización, la clave de la app, tu plan, avisos, notas, plantillas y celulares emparejados. No se puede deshacer.",
		exportado: "Guardamos tu archivo",
		exportadoCancelado: "No se guardó el archivo",
		importar: "Importar plan, avisos y notas",
		importarDesc: "Desde un archivo que exportaste de Corte. Lo que ya tienes no se duplica.",
		tituloElegir: "Elige tu archivo de Corte",
		importado: (p, a, n) => `Importamos ${p} ${p === 1 ? "video del plan" : "videos del plan"}, ${a} ${a === 1 ? "aviso" : "avisos"} y ${n} ${n === 1 ? "nota" : "notas"}`,
		importadoOmitidos: (o) => o === 1 ? "1 ya lo tenías." : `${o} ya los tenías.`,
		grupoAnterior: "Archivo de tu conexión anterior",
		anteriorTexto: (ruta) => `Sigue en ${ruta} y guarda tus claves sin cifrar. Corte ya tiene la suya.`,
		anteriorBorrar: "Mandar a la Papelera",
		anteriorEnPapelera: "Mandamos el archivo anterior a la Papelera",
		anteriorNoExiste: "El archivo anterior ya no estaba",
		grupoBorrar: "Borrar",
		borrarTiktok: "Borrar datos de TikTok de este equipo",
		borrarTiktokTitulo: "¿Borrar datos de TikTok de este equipo?",
		borrarTiktokTexto: "Se borrarán muestras, pedidos, productos e imágenes guardados. Tu plan, tus avisos y tus notas se conservan. Podrás volver a descargarlos sincronizando.",
		borrar: "Borrar",
		tiktokBorrado: "Borramos tus datos de TikTok de este equipo",
		borrarTodo: "Borrar todo y desconectar",
		borrarTodoTitulo: "¿Borrar todo y desconectar?",
		borrarTodoTexto1: "Se borrará todo: datos de TikTok, la autorización de tu cuenta, ",
		borrarTodoClave: "la clave de la app",
		borrarTodoTexto2: ", plan, avisos, notas, plantillas y celulares emparejados. Para volver a conectar necesitarás el archivo anterior o la clave de Partner Center. No se puede deshacer. Escribe BORRAR para confirmar.",
		borrarTodoCampo: "Escribe BORRAR",
		borrarTodoBoton: "Borrar todo",
		todoBorrado: "Borramos todo de esta PC",
		androidPrivacidad: "Tu celular guarda una copia de tus datos para verla sin conexión. Tus llaves de TikTok se quedan en tu PC y nunca llegan al celular.",
		borrarCopia: "Borrar la copia de este celular",
		borrarCopiaTitulo: "¿Borrar la copia de este celular?",
		borrarCopiaTexto: (n) => `Se borrará la copia, sus imágenes y tus cambios que aún no se envían (${n}). Para volver a ver tus datos tendrás que emparejar este celular con tu PC.`,
		copiaBorrada: "Borramos la copia de este celular"
	},
	acerca: {
		version: (v) => `Corte ${v}`,
		hecho: "Hecho para creadores de TikTok Shop México.",
		api: "Usa la API oficial de TikTok Shop con tu autorización. No es una app de TikTok.",
		grupoTecnico: "Datos técnicos",
		versionEtiqueta: "Versión",
		puerto: "Puerto de la interfaz",
		puertoRespaldo: (p) => `Corte usa el puerto ${p} porque el 39229 estaba ocupado por otra app. Todo funciona igual; si algo no carga, cierra la otra app y vuelve a abrir Corte.`,
		plataforma: "Plataforma",
		plataformas: {
			windows: "Windows",
			android: "Android",
			navegador: "Navegador de desarrollo"
		},
		licencias: "Licencias de terceros",
		licenciasCargando: "Buscando las licencias…",
		licenciasNoDisponibles: "Disponible en la versión instalada",
		licenciasN: (n) => `${n} componentes de código abierto`,
		verTexto: "Ver licencia"
	},
	ayuda: [
		{
			pregunta: "¿Qué pasa con las muestras vencidas?",
			respuesta: "TikTok ya las cerró como incumplidas. No sabemos si publicar tarde cambia algo en TikTok. Lo que sí ayuda es publicar el video y avisarle a la tienda con una fecha que cumplas."
		},
		{
			pregunta: "¿Dónde pego el mensaje?",
			respuesta: "En la app de TikTok abre el chat con la tienda y pega el mensaje que copiaste en Corte. Cuando lo envíes, vuelve a Corte y toca «Sí, ya se lo envié»."
		},
		{
			pregunta: "¿Cómo copio el enlace del video?",
			respuesta: "En TikTok abre tu video, toca Compartir y luego Copiar enlace. Pégalo en Corte; también aceptamos enlaces cortos."
		},
		{
			pregunta: "¿Por qué mi celular no se actualiza?",
			respuesta: "Tu celular se actualiza desde Corte de tu PC por Wi‑Fi. Revisa que la PC esté encendida con Corte abierto o en segundo plano y que ambos estén en la misma red. Mientras tanto, puedes seguir trabajando con la última copia."
		},
		{
			pregunta: "¿Mis datos salen de mi PC?",
			respuesta: "Tus datos de TikTok Shop se guardan solo en esta PC, dentro de tu usuario de Windows, y en tu celular si lo emparejas. Tus llaves de TikTok van cifradas y nunca salen de esta PC. Corte no los envía a ningún servidor que no sea de TikTok."
		}
	],
	ayudaDescripcion: "Respuestas cortas a lo que más se pregunta.",
	reauth: {
		titulo: "Conectar con TikTok Shop",
		tituloReautorizar: "Reautorizar TikTok",
		pasos: [
			"Abre TikTok Shop",
			"Pega el enlace de regreso",
			"Listo"
		],
		pasoDe: (n) => `Paso ${n} de 3`,
		clave: "Antes de empezar",
		claveTexto: "Para conectar, Corte necesita la clave de tu app de Partner Center (una sola vez).",
		abrirTexto: "Vamos a abrir TikTok Shop en tu navegador. Inicia sesión con tu cuenta de creador, deja activados todos los permisos y toca Autorizar.",
		abrir: "Abrir TikTok Shop",
		volverAbrir: "Volver a abrir TikTok Shop",
		abriendo: "Abriendo…",
		noAbrio: "No pudimos abrir tu navegador. Copia el enlace y pégalo en tu navegador.",
		copiarEnlace: "Copiar enlace",
		enlaceCopiado: "Enlace copiado",
		pegarTexto: "Al terminar llegarás a una página nueva. Copia el enlace completo de la barra de direcciones (contiene “code=”) y pégalo aquí. Hazlo pronto: el enlace caduca en unos minutos.",
		campo: "Enlace de regreso",
		placeholder: "https://…?code=…",
		pegar: "Pegar",
		conectar: "Conectar",
		caducaEn: (t) => `El enlace caduca en ${t}`,
		vigilando: "Cuando copies el enlace, lo detectamos solos mientras esta ventana esté abierta.",
		detectado: "Detectamos el enlace de autorización. Conectando…",
		conectando: "Conectando…",
		errores: {
			noEsEnlace: "Eso no parece el enlace de regreso. Debe contener “code=”. Copia la dirección completa de la página a la que llegaste.",
			cancelado: "Cancelaste la autorización en TikTok. Puedes intentarlo cuando quieras.",
			state: "Este enlace no corresponde a este intento de conexión. Usa el de la autorización que acabas de hacer.",
			vencido: "El enlace ya caducó o ya se usó. Vuelve a autorizar (tarda menos de un minuto).",
			noCreador: "La cuenta que autorizaste no es de creador de TikTok Shop. Cierra sesión en TikTok Shop y vuelve a intentarlo con tu cuenta de creador.",
			clave: "TikTok no reconoció la clave de la app. Revisa que sea la de Partner Center de esta app.",
			internet: "No pudimos hablar con TikTok. Revisa tu internet e inténtalo de nuevo. Tu enlace caduca en unos minutos."
		},
		cambioTitulo: "Esta autorización es de otra cuenta",
		cambioTexto: "Autorizaste una cuenta de TikTok distinta a la que usabas en Corte. Si continúas, cambiamos a la cuenta nueva y borramos de esta PC los datos de TikTok de la anterior.",
		cambiar: "Cambiar de cuenta",
		eresTu: "¿Eres tú?",
		eresTuTexto: "Conectamos esta cuenta de TikTok Shop. Revisa que sea la tuya antes de traer tus datos.",
		siSoyYo: "Sí, soy yo",
		noSoyYo: "No soy yo",
		noEraTexto: "Desconectamos esa cuenta. Vuelve a autorizar con tu cuenta de creador.",
		listo: (u) => `¡Listo! Conectado como @${u}.`,
		listoSinNombre: "¡Listo! Conectado.",
		sincronizando: "Sincronizando tus datos…",
		faltan: (lista) => `Conectado, pero faltan permisos: ${lista}. Algunas secciones no se actualizarán.`,
		autorizarTodos: "Autorizar de nuevo con todos los permisos",
		continuarAsi: "Continuar así",
		terminar: "Listo",
		reintentar: "Reintentar",
		android: "Tu conexión con TikTok la maneja tu PC"
	},
	errorGenerico: "Algo no salió bien. Inténtalo de nuevo."
};
/** Orden de 01 §3.1 (Windows) y de «Más» en Android (01 §3.3: Conexión con la PC primero, sin Sincronización). */
function seccionesPara(android) {
	const s = T.secciones;
	const tiktok = {
		id: "tiktok",
		titulo: android ? s.tiktok.tituloAndroid : s.tiktok.titulo,
		resumen: android ? s.tiktok.resumenAndroid : s.tiktok.resumen,
		icono: "Store"
	};
	const celular = {
		id: "celular",
		titulo: android ? s.celular.tituloAndroid : s.celular.titulo,
		resumen: android ? s.celular.resumenAndroid : s.celular.resumen,
		icono: android ? "Monitor" : "Smartphone"
	};
	const metricas = {
		id: "metricas",
		titulo: s.metricas.titulo,
		resumen: android ? s.metricas.resumenAndroid : s.metricas.resumen,
		icono: "TrendingUp"
	};
	const resto = [
		{
			id: "recordatorios",
			titulo: s.recordatorios.titulo,
			resumen: s.recordatorios.resumen,
			icono: "Bell"
		},
		{
			id: "plantillas",
			titulo: s.plantillas.titulo,
			resumen: s.plantillas.resumen,
			icono: "MessageCircle"
		},
		{
			id: "apariencia",
			titulo: s.apariencia.titulo,
			resumen: android ? s.apariencia.resumenAndroid : s.apariencia.resumen,
			icono: "Sun"
		},
		{
			id: "datos",
			titulo: s.datos.titulo,
			resumen: s.datos.resumen,
			icono: "Lock"
		},
		{
			id: "ayuda",
			titulo: s.ayuda.titulo,
			resumen: s.ayuda.resumen,
			icono: "CircleHelp"
		},
		{
			id: "acerca",
			titulo: s.acerca.titulo,
			resumen: s.acerca.resumen,
			icono: "Info"
		}
	];
	if (android) return [
		celular,
		tiktok,
		metricas,
		...resto
	];
	return [
		tiktok,
		metricas,
		{
			id: "sincronizacion",
			titulo: s.sincronizacion.titulo,
			resumen: s.sincronizacion.resumen,
			icono: "RefreshCw"
		},
		celular,
		...resto
	];
}
var IDS = /* @__PURE__ */ new Set([
	"tiktok",
	"metricas",
	"sincronizacion",
	"celular",
	"recordatorios",
	"plantillas",
	"apariencia",
	"datos",
	"ayuda",
	"acerca"
]);
function esSeccion(v) {
	return typeof v === "string" && IDS.has(v);
}
var DIA_S = 86400;
/** Días completos que le quedan a la autorización (refresh). null si no hay fecha. */
function diasParaVencer(refreshExpiraAt, ahora) {
	if (refreshExpiraAt === null) return null;
	return Math.max(0, Math.ceil((refreshExpiraAt - ahora) / DIA_S));
}
/**
* Estado visible de 01 §4.14 A. `credenciales` es null en Android o mientras carga (entonces solo manda la conexión).
* Prioridad: sin región > falta la clave > vencida > sin autorizar > faltan permisos > vence pronto (< 7 días) > conectado.
*/
function estadoTiktok(conexion, credenciales, ahora) {
	if (conexion.estado === "cuenta_sin_region") return "sin_region";
	if ((credenciales ? !credenciales.app_secret_configurado : conexion.estado === "sin_credenciales") || conexion.estado === "sin_credenciales") return "falta_clave";
	if (conexion.estado === "reautorizar") return "vencida";
	if (conexion.estado === "sin_autorizar") return "sin_autorizar";
	if (conexion.scopes_faltantes.length > 0) return "faltan_permisos";
	const dias = diasParaVencer(conexion.refresh_expira_at, ahora);
	if (dias !== null && dias < 7) return "vence_pronto";
	return "conectado";
}
/** 'Ver tu vitrina, Crear enlaces de afiliado' (textos de 01 §4.14 A vía dominio.textoPermiso). */
function listaPermisos(scopes) {
	return scopes.map((s) => textoPermiso(s)).join(", ");
}
/** Documentos › PROJECTS › API de Affiliate Creator (sin el usuario de Windows ni el nombre del archivo). */
function rutaAmigable(ruta) {
	const partes = ruta.split(/[\\/]+/).filter((p) => p !== "" && !/^[a-z]:$/i.test(p));
	partes.pop();
	const i = partes.findIndex((p) => /^(documents|documentos|mis documentos)$/i.test(p));
	if (i >= 0) return ["Documentos", ...partes.slice(i + 1)].join(" › ");
	return partes.slice(-2).join(" › ") || ruta;
}
/**
* `pendienteLocal`: el intento que ESTA ventana abrió (expira_at de ConectarDisplayResponse) por si el estado del hub aún
* no trae conexion_pendiente. Un intento vencido ya no cuenta como espera.
*/
function vistaMetricas(e, pendienteLocal, ahora) {
	if (e.estado === "conectada") return "conectada";
	if (e.estado === "sin_credenciales" || !e.configurada) return "sin_configurar";
	if (Math.max(e.conexion_pendiente?.expira_at ?? 0, pendienteLocal ?? 0) > ahora) return "esperando";
	return e.estado === "reautorizar" ? "reautorizar" : "sin_conectar";
}
/** Mismas reglas de formato que el hub (tiktok_dev/servicio.py): se revisan antes de mandar nada. */
function revisarClientKey(v) {
	const t = v.trim();
	if (t === "") return "vacio";
	return /^[A-Za-z0-9]{8,64}$/.test(t) ? null : "formato";
}
function revisarClientSecret(v) {
	const t = v.trim();
	if (t === "") return "vacio";
	return /^[A-Za-z0-9_-]{16,128}$/.test(t) ? null : "formato";
}
/** Los 4 permisos que pide Corte, con su nombre en español. */
var PERMISOS_DISPLAY = [
	"user.info.basic",
	"user.info.profile",
	"user.info.stats",
	"video.list"
];
function nombrePermisoDisplay(scope) {
	return T.metricas.permisos[scope] ?? scope;
}
/** 'la lista de tus videos y sus vistas' (en minúsculas para ir dentro de una frase). */
function listaPermisosDisplay(scopes) {
	return scopes.map((s) => {
		const n = nombrePermisoDisplay(s);
		return n.charAt(0).toLocaleLowerCase("es-MX") + n.slice(1);
	}).join(", ");
}
/** 48,200 · 51.9 mil · 1.2 M (cifras grandes de un perfil). */
function cifraCompacta(n) {
	const abs = Math.abs(n);
	if (abs < 1e4) return formato.numero(n);
	if (abs < 1e6) {
		const mil = n / 1e3;
		return `${abs < 1e5 ? (Math.round(mil * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 }) : formato.numero(Math.round(mil))} mil`;
	}
	return `${(Math.round(n / 1e6 * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 })} M`;
}
/** Revisión local antes de mandar al hub (el hub vuelve a validar y es quien decide). */
function revisarEnlace(texto) {
	const t = texto.trim();
	if (t === "") return "vacio";
	const tieneCode = /[?&#]code=[^&\s]+/i.test(t);
	if (!tieneCode && /[?&#]error(_description)?=/i.test(t)) return "cancelado";
	if (tieneCode) return "ok";
	if (/^[A-Za-z0-9._~-]{16,}$/.test(t) && !/^https?:/i.test(t)) return "ok";
	return "no_es_enlace";
}
/** '9:41' a partir de segundos. */
function cuentaRegresiva(segundos) {
	const s = Math.max(0, Math.floor(segundos));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
/** C36: 30 por omisión; apagado = sync_auto false (se conserva el intervalo elegido). */
function intervaloDe(ajustes) {
	if (!ajustes) return "30";
	if (!ajustes.sync_auto) return "apagado";
	return String(ajustes.sync_intervalo_min);
}
function cambiosDeIntervalo(v) {
	if (v === "apagado") return { sync_auto: false };
	return {
		sync_auto: true,
		sync_intervalo_min: Number(v)
	};
}
/** '2 min' · '45 s' · '1 h 5 min'. */
function duracion(seg) {
	if (seg === null || !Number.isFinite(seg) || seg < 0) return null;
	if (seg < 60) return `${Math.max(1, Math.round(seg))} s`;
	const min = Math.round(seg / 60);
	if (min < 60) return `${min} min`;
	const h = Math.floor(min / 60);
	const resto = min % 60;
	return resto === 0 ? `${h} h` : `${h} h ${resto} min`;
}
/** 'hoy, 6:04 p. m.' · 'ayer, 5:34 p. m.' · '10 nov, 8:00 a. m.'. */
function cuandoFue(t, ahora) {
	const dia = formato.fechaCorta(t);
	return `${dia === formato.fechaCorta(ahora) ? "hoy" : dia === formato.fechaCorta(ahora - DIA_S) ? "ayer" : dia}, ${formato.hora(t)}`;
}
/** 'Hoy 6:04 p. m.' (como en 01 §4.14 B). */
function cuandoFueTitulo(t, ahora) {
	const s = cuandoFue(t, ahora).replace(", ", " ");
	return s.charAt(0).toUpperCase() + s.slice(1);
}
/** Resumen del historial en lenguaje simple: 'Listo · 3 pedidos nuevos, 1 muestra cambió de estado'. */
function resumenHistorial(item) {
	const H = T.sync;
	if (item.estado === "error") return {
		estado: H.noSePudo(item.error?.mensaje ?? T.errorGenerico),
		detalle: "",
		tono: "critico"
	};
	if (item.estado === "cancelada") return {
		estado: H.cancelada,
		detalle: "",
		tono: "neutro"
	};
	if (item.estado === "en_curso") return {
		estado: H.enCursoHist,
		detalle: "",
		tono: "neutro"
	};
	const r = item.resumen;
	const partes = [];
	const pedidos = r.ordenes?.nuevos ?? 0;
	const muestrasNuevas = r.muestras?.nuevos ?? 0;
	const cambiaron = (r.cumplimientos?.cambiados ?? 0) + (r.muestras?.cambiados ?? 0);
	if (pedidos > 0) partes.push(H.pedidosNuevos(pedidos));
	if (muestrasNuevas > 0) partes.push(H.muestrasNuevas(muestrasNuevas));
	if (cambiaron > 0) partes.push(H.muestrasCambiaron(cambiaron));
	const detalle = partes.length > 0 ? partes.join(", ") : item.cambios > 0 ? "" : H.sinCambios;
	return {
		estado: item.estado === "parcial" ? H.listoAvisos : H.listo,
		detalle,
		tono: item.estado === "parcial" ? "atencion" : "ok"
	};
}
/** 4.2 MB · 38 MB · 820 KB · 1.3 GB (separador decimal de es-MX: punto). */
function tamano(bytes) {
	const b = Math.max(0, bytes);
	const KB = 1024;
	const MB = KB * 1024;
	const GB = MB * 1024;
	const uno = (v) => v < 10 ? v.toFixed(1).replace(/\.0$/, "") : formato.numero(Math.round(v));
	if (b >= GB) return `${uno(b / GB)} GB`;
	if (b >= MB) return `${uno(b / MB)} MB`;
	if (b >= KB) return `${uno(b / KB)} KB`;
	return `${formato.numero(b)} B`;
}
/** Nombre del archivo de exportación: corte-plan-avisos-notas-2026-11-13.json. */
function nombreExportacion(hoy) {
	return `corte-plan-avisos-notas-${hoy}.json`;
}
function leerLicencias(v) {
	const lista = Array.isArray(v) ? v : v !== null && typeof v === "object" && Array.isArray(v.componentes) ? v.componentes : null;
	if (!lista) return null;
	const salida = [];
	for (const x of lista) {
		if (x === null || typeof x !== "object") continue;
		const o = x;
		const nombre = typeof o["nombre"] === "string" ? o["nombre"] : null;
		if (!nombre) continue;
		salida.push({
			nombre,
			version: typeof o["version"] === "string" ? o["version"] : "",
			licencia: typeof o["licencia"] === "string" ? o["licencia"] : "",
			texto: typeof o["texto"] === "string" ? o["texto"] : ""
		});
	}
	return salida.length > 0 ? salida : null;
}
/** Horas que ofrece el recordatorio diario: de 6:00 a 22:00, cada hora ('HH:MM'). */
var HORAS_RECORDATORIO = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, "0")}:00`);
/** '10:00' → '10:00 a. m.' (es-MX, 12 h). */
function horaLegible(hhmm) {
	const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
	if (!m) return hhmm;
	const h = Number(m[1]);
	const sufijo = h < 12 ? "a. m." : "p. m.";
	return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${sufijo}`;
}
/** Alias de la PC (LanCambios): 1–40 caracteres imprimibles, sin saltos de línea. */
function aliasValido(v) {
	const t = v.trim();
	return t.length >= 1 && t.length <= 40 && !/[\u0000-\u001f\u007f]/.test(t);
}
var ajustes_module_default = {
	raiz: "_raiz_1a380_7",
	oculto: "_oculto_1a380_13",
	mono: "_mono_1a380_25",
	enlace: "_enlace_1a380_31",
	columnas: "_columnas_1a380_48",
	subnav: "_subnav_1a380_56",
	subnavLista: "_subnavLista_1a380_62",
	subnavItem: "_subnavItem_1a380_71",
	subnavActivo: "_subnavActivo_1a380_94",
	subnavTexto: "_subnavTexto_1a380_102",
	contenido: "_contenido_1a380_109",
	contenidoCompacto: "_contenidoCompacto_1a380_142",
	seccionTitulo: "_seccionTitulo_1a380_146",
	seccionCabeza: "_seccionCabeza_1a380_155",
	seccionDesc: "_seccionDesc_1a380_155",
	mas: "_mas_1a380_159",
	estadoMas: "_estadoMas_1a380_166",
	estadoMasInactivo: "_estadoMasInactivo_1a380_179",
	estadoMasIcono: "_estadoMasIcono_1a380_182",
	masItem: "_masItem_1a380_186",
	masIcono: "_masIcono_1a380_191",
	pcIcono: "_pcIcono_1a380_192",
	estadoMasTexto: "_estadoMasTexto_1a380_206",
	masTextos: "_masTextos_1a380_207",
	estadoMasTitulo: "_estadoMasTitulo_1a380_214",
	estadoMasDesc: "_estadoMasDesc_1a380_222",
	estadoMasFlecha: "_estadoMasFlecha_1a380_230",
	masFlecha: "_masFlecha_1a380_231",
	masLista: "_masLista_1a380_236",
	masTitulo: "_masTitulo_1a380_260",
	masResumen: "_masResumen_1a380_265",
	noExiste: "_noExiste_1a380_278",
	seccion: "_seccion_1a380_146",
	seccionCuerpo: "_seccionCuerpo_1a380_314",
	pila: "_pila_1a380_321",
	parrafo: "_parrafo_1a380_327",
	textoModal: "_textoModal_1a380_334",
	notaChica: "_notaChica_1a380_344",
	acciones: "_acciones_1a380_351",
	accionesPila: "_accionesPila_1a380_356",
	grupo: "_grupo_1a380_364",
	grupoCabeza: "_grupoCabeza_1a380_370",
	grupoTitulo: "_grupoTitulo_1a380_378",
	grupoAcciones: "_grupoAcciones_1a380_390",
	grupoCaja: "_grupoCaja_1a380_402",
	sinFiletePrevio: "_sinFiletePrevio_1a380_412",
	grupoPie: "_grupoPie_1a380_416",
	grupoPeligro: "_grupoPeligro_1a380_423",
	fila: "_fila_1a380_427",
	filaApilada: "_filaApilada_1a380_435",
	filaIcono: "_filaIcono_1a380_439",
	filaTextos: "_filaTextos_1a380_449",
	filaEtiqueta: "_filaEtiqueta_1a380_456",
	filaDesc: "_filaDesc_1a380_463",
	filaControl: "_filaControl_1a380_469",
	filaLibre: "_filaLibre_1a380_477",
	subfila: "_subfila_1a380_484",
	vacioGrupo: "_vacioGrupo_1a380_490",
	dato: "_dato_1a380_501",
	datoEtiqueta: "_datoEtiqueta_1a380_509",
	datoValor: "_datoValor_1a380_515",
	aviso: "_aviso_1a380_545",
	avisoIcono: "_avisoIcono_1a380_575",
	avisoCuerpo: "_avisoCuerpo_1a380_596",
	avisoTitulo: "_avisoTitulo_1a380_603",
	avisoTexto: "_avisoTexto_1a380_609",
	avisoAcciones: "_avisoAcciones_1a380_617",
	avisoPlano: "_avisoPlano_1a380_623",
	cuenta: "_cuenta_1a380_631",
	cuentaAvatar: "_cuentaAvatar_1a380_650",
	cuentaTextos: "_cuentaTextos_1a380_653",
	cuentaFila: "_cuentaFila_1a380_659",
	cuentaNombre: "_cuentaNombre_1a380_665",
	cuentaMeta: "_cuentaMeta_1a380_673",
	cuentaAcciones: "_cuentaAcciones_1a380_679",
	chequeo: "_chequeo_1a380_686",
	chequeoItem: "_chequeoItem_1a380_694",
	chequeoMarca: "_chequeoMarca_1a380_706",
	tecnicos: "_tecnicos_1a380_721",
	tecnicosResumen: "_tecnicosResumen_1a380_724",
	preguntaFlecha: "_preguntaFlecha_1a380_741",
	tecnicosCuerpo: "_tecnicosCuerpo_1a380_751",
	claves: "_claves_1a380_757",
	syncEstado: "_syncEstado_1a380_775",
	syncEstadoTextos: "_syncEstadoTextos_1a380_786",
	syncUltima: "_syncUltima_1a380_793",
	syncProgreso: "_syncProgreso_1a380_800",
	syncPaso: "_syncPaso_1a380_805",
	syncError: "_syncError_1a380_812",
	syncAcciones: "_syncAcciones_1a380_821",
	modulos: "_modulos_1a380_826",
	modulo: "_modulo_1a380_826",
	moduloMarca: "_moduloMarca_1a380_846",
	moduloEtiqueta: "_moduloEtiqueta_1a380_860",
	moduloError: "_moduloError_1a380_867",
	moduloMedidor: "_moduloMedidor_1a380_871",
	moduloValor: "_moduloValor_1a380_877",
	historial: "_historial_1a380_886",
	historialItem: "_historialItem_1a380_891",
	historialPunto: "_historialPunto_1a380_906",
	historialTextos: "_historialTextos_1a380_923",
	historialLinea: "_historialLinea_1a380_929",
	historialCuando: "_historialCuando_1a380_937",
	historialSep: "_historialSep_1a380_940",
	historialEstado: "_historialEstado_1a380_943",
	historialMeta: "_historialMeta_1a380_946",
	panelQr: "_panelQr_1a380_954",
	opcionesFirewall: "_opcionesFirewall_1a380_957",
	dispositivos: "_dispositivos_1a380_960",
	dispositivo: "_dispositivo_1a380_960",
	dispositivoIcono: "_dispositivoIcono_1a380_979",
	dispositivoTextos: "_dispositivoTextos_1a380_990",
	dispositivoNombre: "_dispositivoNombre_1a380_997",
	dispositivoPermisos: "_dispositivoPermisos_1a380_1004",
	dispositivoAcciones: "_dispositivoAcciones_1a380_1008",
	alias: "_alias_1a380_1029",
	aliasCampo: "_aliasCampo_1a380_1034",
	aliasBoton: "_aliasBoton_1a380_1038",
	vacioPc: "_vacioPc_1a380_1056",
	vacioPcIcono: "_vacioPcIcono_1a380_1066",
	vacioPcTitulo: "_vacioPcTitulo_1a380_1075",
	ejemplo: "_ejemplo_1a380_1084",
	ejemploRotulo: "_ejemploRotulo_1a380_1091",
	plantillas: "_plantillas_1a380_1098",
	plantilla: "_plantilla_1a380_1098",
	plantillaTextos: "_plantillaTextos_1a380_1125",
	plantillaNombre: "_plantillaNombre_1a380_1132",
	plantillaExtracto: "_plantillaExtracto_1a380_1140",
	extractoVariable: "_extractoVariable_1a380_1149",
	volverEnlace: "_volverEnlace_1a380_1155",
	variables: "_variables_1a380_1176",
	variablesRotulo: "_variablesRotulo_1a380_1182",
	variable: "_variable_1a380_1176",
	vistaPrevia: "_vistaPrevia_1a380_1206",
	marca: "_marca_1a380_1217",
	temas: "_temas_1a380_1227",
	temasFila: "_temasFila_1a380_1242",
	tema: "_tema_1a380_1227",
	temaVista: "_temaVista_1a380_1255",
	temaMarcado: "_temaMarcado_1a380_1267",
	temaNombre: "_temaNombre_1a380_1274",
	mini: "_mini_1a380_1286",
	miniMitad: "_miniMitad_1a380_1291",
	miniBarra: "_miniBarra_1a380_1302",
	miniTarjeta: "_miniTarjeta_1a380_1308",
	miniLinea: "_miniLinea_1a380_1317",
	miniLineaCorta: "_miniLineaCorta_1a380_1323",
	miniBoton: "_miniBoton_1a380_1329",
	segmentadoAncho: "_segmentadoAncho_1a380_1357",
	segmentadoIntervalo: "_segmentadoIntervalo_1a380_1362",
	privacidad: "_privacidad_1a380_1374",
	privacidadTexto: "_privacidadTexto_1a380_1383",
	acerca: "_acerca_1a380_1393",
	acercaVersion: "_acercaVersion_1a380_1403",
	acercaTexto: "_acercaTexto_1a380_1409",
	logo: "_logo_1a380_1415",
	logoIcono: "_logoIcono_1a380_1420",
	logoFondo: "_logoFondo_1a380_1424",
	logoC: "_logoC_1a380_1427",
	logoTexto: "_logoTexto_1a380_1430",
	licencia: "_licencia_1a380_1438",
	pregunta: "_pregunta_1a380_741",
	preguntaResumen: "_preguntaResumen_1a380_1458",
	preguntaRespuesta: "_preguntaRespuesta_1a380_1491",
	reauth: "_reauth_1a380_1502",
	pasosReauth: "_pasosReauth_1a380_1508",
	pasoReauth: "_pasoReauth_1a380_1516",
	pasoReauthNumero: "_pasoReauthNumero_1a380_1535",
	pasoReauthTexto: "_pasoReauthTexto_1a380_1553",
	tituloReauth: "_tituloReauth_1a380_1556",
	notaReauth: "_notaReauth_1a380_1563",
	errorReauth: "_errorReauth_1a380_1573",
	campoEnlace: "_campoEnlace_1a380_1594",
	campoEnlaceTexto: "_campoEnlaceTexto_1a380_1600",
	campoEnlaceBoton: "_campoEnlaceBoton_1a380_1604",
	detectado: "_detectado_1a380_1607",
	listoReauth: "_listoReauth_1a380_1622",
	cuentaReauth: "_cuentaReauth_1a380_1627",
	pieReauth: "_pieReauth_1a380_1635",
	giradorChico: "_giradorChico_1a380_1650",
	girar: "_girar_1a380_1",
	formularioApp: "_formularioApp_1a380_1691",
	pasosApp: "_pasosApp_1a380_1703",
	redirect: "_redirect_1a380_1720",
	esperando: "_esperando_1a380_1736",
	cifrasPerfil: "_cifrasPerfil_1a380_1742",
	cifraPerfil: "_cifraPerfil_1a380_1749",
	cifraPerfilValor: "_cifraPerfilValor_1a380_1756",
	cifraPerfilEtiqueta: "_cifraPerfilEtiqueta_1a380_1765"
};
/** Une clases de CSS Modules (con noUncheckedIndexedAccess cada clase es string | undefined) en un string. */
function cx(...xs) {
	return xs.filter((x) => typeof x === "string" && x !== "").join(" ");
}
/**
* Piezas de maquetación de Conexión y ajustes: sección con título, grupos (rótulo + tarjeta con filas separadas por
* filetes), filas de dato, avisos con tono semántico y estados de carga y error. Solo tokens (ajustes.module.css).
*/
function Seccion(p) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(ajustes_module_default.seccion),
		"aria-labelledby": id,
		"data-seccion": p.id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cx(ajustes_module_default.seccionCabeza),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id,
				className: cx(ajustes_module_default.seccionTitulo),
				children: p.titulo
			}), p.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.seccionDesc),
				children: p.descripcion
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(ajustes_module_default.seccionCuerpo),
			children: p.children
		})]
	});
}
function Grupo(p) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${ajustes_module_default.grupo} ${p.className ?? ""}`,
		role: "group",
		...p.titulo ? { "aria-labelledby": id } : {},
		children: [
			p.titulo || p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.grupoCabeza),
				children: [p.titulo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					id,
					className: cx(ajustes_module_default.grupoTitulo),
					children: p.titulo
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.grupoAcciones),
					children: p.acciones
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.grupoCaja),
				children: p.children
			}),
			p.pie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.grupoPie),
				children: p.pie
			}) : null
		]
	});
}
/** Fila con etiqueta, descripción opcional y un control a la derecha (en angosto, el control baja). */
function Fila(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${ajustes_module_default.fila} ${p.apilada ? ajustes_module_default.filaApilada : ""} ${p.className ?? ""}`,
		children: [
			p.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(ajustes_module_default.filaIcono),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: p.icono,
					tamano: 18
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.filaTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaEtiqueta),
					children: p.etiqueta
				}), p.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: p.descripcion
				}) : null]
			}),
			p.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.filaControl),
				children: p.children
			}) : null
		]
	});
}
/** Contenedor de una fila cuyo control ya trae su propio acomodo (Interruptor, OpcionRadio, Segmentado). */
function FilaLibre(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${ajustes_module_default.filaLibre} ${p.className ?? ""}`,
		children: p.children
	});
}
/** Dato de solo lectura: etiqueta a la izquierda y valor a la derecha. */
function Dato(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.dato),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(ajustes_module_default.datoEtiqueta),
			children: p.etiqueta
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${ajustes_module_default.datoValor} ${p.mono ? ajustes_module_default.mono : ""}`,
			children: p.valor
		})]
	});
}
var ICONO_TONO = {
	info: "Info",
	atencion: "CircleAlert",
	critico: "CircleAlert",
	ok: "Check",
	neutro: "Info"
};
function Aviso(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${ajustes_module_default.aviso} ${p.className ?? ""}`,
		"data-tono": p.tono,
		role: p.vivo ? p.tono === "critico" ? "alert" : "status" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(ajustes_module_default.avisoIcono),
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: p.icono ?? ICONO_TONO[p.tono],
				tamano: 18
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.avisoCuerpo),
			children: [
				p.titulo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.avisoTitulo),
					children: p.titulo
				}) : null,
				p.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.avisoTexto),
					children: p.children
				}) : null,
				p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.avisoAcciones),
					children: p.acciones
				}) : null
			]
		})]
	});
}
/** Esqueleto con la forma de un grupo de filas (primera carga, 02 §7.15). */
function CargandoGrupo(p) {
	const n = p.filas ?? 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoVista, {
		textoLento: T.cargando,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.grupo),
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				ancho: 120
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.grupoCaja),
				children: Array.from({ length: n }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.fila),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.filaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							ancho: "45%"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							ancho: "70%"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "bloque",
						ancho: 44,
						alto: 24
					})]
				}, i))
			})]
		})
	});
}
function ErrorCarga(p) {
	const necesitaPc = p.error?.codigo === "necesita_pc" || p.error?.codigo === "solo_en_pc";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: necesitaPc ? "neutro" : "atencion",
		icono: necesitaPc ? "Monitor" : "CircleAlert",
		titulo: necesitaPc ? T.necesitaPc : T.errorCarga,
		acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			icono: "RefreshCw",
			alPulsar: p.alReintentar,
			children: T.reintentar
		}),
		children: necesitaPc ? T.necesitaPcTexto : p.error?.mensaje ?? null
	});
}
/** Lista de permisos con palomita (01 §4.14 A). */
function ListaChequeo(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cx(ajustes_module_default.chequeo),
		children: p.items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: cx(ajustes_module_default.chequeoItem),
			"data-ok": x.ok ? "" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.chequeoMarca),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: x.ok ? "Check" : "Minus",
						tamano: 14
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x.texto }),
				x.ok ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.oculto),
					children: " (falta)"
				})
			]
		}, x.id))
	});
}
/**
* A. TikTok Shop (01_ux §4.14 A). Dos cosas separadas: «Clave de la app (Partner Center)» y «Autorización de tu cuenta».
* Windows: estado, permisos (dominio.textoPermiso), [Reautorizar] → DialogoReautorizar (?reautorizar=1, lo monta
* ui-marco), [Importar desde archivo…] con elegirArchivo → hub.importarCredenciales({ruta}) (solo la ruta viaja al hub,
* C46), [Pegar clave de la app] (campo enmascarado que nunca se vuelve a mostrar) y [Desconectar] con su confirmación.
* Android (C35): SOLO LECTURA, con el texto «Para volver a conectar, abre Corte en tu PC › …» y sin botones.
*/
var PERMISOS_ESPERADOS = [
	"creator.affiliate.info",
	"creator.affiliate_collaboration.read",
	"creator.showcase.read",
	"creator.showcase.write",
	"creator.affiliate.link.write"
];
function chipDe(e) {
	switch (e) {
		case "conectado":
		case "vence_pronto":
		case "faltan_permisos": return {
			tono: e === "conectado" ? "ok" : "atencion",
			texto: T.tiktok.chipConectado
		};
		case "vencida": return {
			tono: "critico",
			texto: T.tiktok.chipReautorizar
		};
		case "sin_region": return {
			tono: "critico",
			texto: T.tiktok.chipSinRegion
		};
		default: return {
			tono: "neutro",
			texto: T.tiktok.chipSinConectar
		};
	}
}
function mensajeError$1(e) {
	return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}
/** Botones de clave: [Importar desde archivo…] y [Pegar clave de la app]. Exportado para las pruebas. */
function useAccionesClave() {
	const toast = useToast();
	const [importando, setImportando] = (0, import_react.useState)(false);
	const [resultado, setResultado] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const importar = async () => {
		setError(null);
		const ruta = await elegirArchivo(T.tiktok.tituloElegir, ["json"]);
		if (!ruta) return;
		setImportando(true);
		try {
			const r = await hub.importarCredenciales({ ruta });
			setResultado(r);
			toast.mostrar({
				texto: r.importado.access_token ? T.tiktok.importado : T.tiktok.importadoClave,
				tono: "ok"
			});
		} catch (e) {
			setError(mensajeError$1(e));
		} finally {
			setImportando(false);
		}
	};
	return {
		importar,
		importando,
		resultado,
		error,
		limpiar: () => setResultado(null)
	};
}
function DialogoClave(p) {
	const toast = useToast();
	const [valor, setValor] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const cerrar = () => {
		setValor("");
		setError(null);
		p.alCerrar();
	};
	const guardar = async () => {
		const clave = valor.trim();
		if (clave === "") {
			setError(T.tiktok.claveVacia);
			return;
		}
		setGuardando(true);
		setError(null);
		try {
			await hub.guardarAppSecret(clave);
			setValor("");
			toast.mostrar({
				texto: T.tiktok.claveGuardadaToast,
				tono: "ok"
			});
			p.alGuardar?.();
			p.alCerrar();
		} catch (e) {
			setError(e instanceof ErrorHub && e.codigo === "app_secret_invalido" ? T.reauth.errores.clave : mensajeError$1(e));
		} finally {
			setGuardando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: T.tiktok.claveTitulo,
		descripcion: T.tiktok.claveDescripcion,
		alCerrar: cerrar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: cerrar,
			children: T.cancelar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			cargando: guardando,
			alPulsar: () => void guardar(),
			children: T.guardar
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
			etiqueta: T.tiktok.claveEtiqueta,
			valor,
			alCambiar: setValor,
			tipo: "password",
			ayuda: T.tiktok.claveAyuda,
			error,
			monoespaciado: true,
			autoFoco: true,
			alEnter: () => void guardar()
		})
	});
}
function SeccionTiktok() {
	const android = usePlataforma() === "android";
	const cap = useCapacidades();
	const puedeAutorizar = !android && cap.auth;
	const sesion = useSesion();
	const cred = useConsulta("credenciales", {}, { activa: puedeAutorizar });
	const [, setReauth] = useParametro("reautorizar");
	const toast = useToast();
	const clave = useAccionesClave();
	const [verClave, setVerClave] = (0, import_react.useState)(false);
	const [verDesconectar, setVerDesconectar] = (0, import_react.useState)(false);
	const [desconectando, setDesconectando] = (0, import_react.useState)(false);
	const [borrando, setBorrando] = (0, import_react.useState)(false);
	const titulo = android ? T.secciones.tiktok.tituloAndroid : T.secciones.tiktok.titulo;
	if (sesion.cargando && !sesion.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "tiktok",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 })
	});
	if (!sesion.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "tiktok",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: sesion.error,
			alReintentar: () => void sesion.refrescar()
		})
	});
	const { cuenta, conexion } = sesion.datos;
	const ahora = ahoraS();
	const estado = estadoTiktok(conexion, puedeAutorizar ? cred.datos ?? null : null, ahora);
	const chip = chipDe(estado);
	const dias = diasParaVencer(conexion.refresh_expira_at, ahora);
	const reautorizar = () => setReauth("1");
	const conectada = conexion.estado === "conectada" || conexion.estado === "reautorizar";
	const vigente = estado === "conectado" || estado === "vence_pronto" || estado === "faltan_permisos";
	const desconectar = async () => {
		setDesconectando(true);
		try {
			await hub.authDesconectar({});
			toast.mostrar({
				texto: T.tiktok.desconectado,
				tono: "ok"
			});
			setVerDesconectar(false);
		} catch (e) {
			toast.mostrar({
				texto: mensajeError$1(e),
				tono: "error"
			});
		} finally {
			setDesconectando(false);
		}
	};
	const borrarAnterior = async () => {
		setBorrando(true);
		try {
			const r = await hub.borrarLegado();
			toast.mostrar({
				texto: r.resultado === "papelera" ? T.datos.anteriorEnPapelera : T.datos.anteriorNoExiste,
				tono: "ok"
			});
			clave.limpiar();
		} catch (e) {
			toast.mostrar({
				texto: mensajeError$1(e),
				tono: "error"
			});
		} finally {
			setBorrando(false);
		}
	};
	const botonesClave = puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		icono: "Download",
		cargando: clave.importando,
		alPulsar: () => void clave.importar(),
		children: T.tiktok.importar
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		icono: "Lock",
		alPulsar: () => setVerClave(true),
		children: T.tiktok.pegarClave
	})] }) : null;
	let aviso = null;
	if (estado === "vence_pronto" && dias !== null) aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		icono: "Clock",
		acciones: puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "sm",
			alPulsar: reautorizar,
			children: T.tiktok.reautorizar
		}) : null,
		children: T.tiktok.venceEn(dias)
	});
	else if (estado === "vencida") aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "critico",
		acciones: puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "sm",
			alPulsar: reautorizar,
			children: T.tiktok.reautorizarAhora
		}) : null,
		children: T.tiktok.vencida
	});
	else if (estado === "faltan_permisos") aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		acciones: puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "sm",
			alPulsar: reautorizar,
			children: T.tiktok.reautorizar
		}) : null,
		children: T.tiktok.faltanPermisos(listaPermisos(conexion.scopes_faltantes))
	});
	else if (estado === "falta_clave") aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		icono: "Lock",
		acciones: botonesClave,
		children: T.tiktok.faltaClave
	});
	else if (estado === "sin_autorizar") aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "info",
		acciones: puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "sm",
			alPulsar: reautorizar,
			children: T.tiktok.conectar
		}) : null,
		children: T.tiktok.sinAutorizar
	});
	else if (estado === "sin_region") aviso = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "critico",
		children: T.tiktok.sinRegion
	});
	const permisos = PERMISOS_ESPERADOS.map((s) => ({
		id: s,
		texto: textoPermiso(s),
		ok: conexion.scopes.includes(s) && !conexion.scopes_faltantes.includes(s)
	}));
	const extras = conexion.scopes.filter((s) => !PERMISOS_ESPERADOS.includes(s)).map((s) => ({
		id: s,
		texto: textoPermiso(s),
		ok: true
	}));
	const origen = cred.datos?.origen ?? conexion.origen;
	const fechaClave = cred.datos?.origen === "importado" && cred.datos.legado.ya_importado_at ? formato.fechaCorta(cred.datos.legado.ya_importado_at) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "tiktok",
		descripcion: android ? T.tiktok.androidManeja : T.tiktok.descripcion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.cuenta),
				"data-estado-tiktok": estado,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCuenta, {
						url: cuenta?.avatar ?? null,
						username: cuenta?.username ?? "TikTok",
						tamano: 40,
						className: cx(ajustes_module_default.cuentaAvatar)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.cuentaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(ajustes_module_default.cuentaFila),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.cuentaNombre),
								children: cuenta ? `@${cuenta.username}` : T.tiktok.grupoCuenta
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: chip.tono,
								...chip.tono === "ok" ? { icono: "Check" } : chip.tono === "critico" ? { icono: "CircleAlert" } : {},
								children: chip.texto
							})]
						}), vigente && conexion.refresh_expira_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(ajustes_module_default.cuentaMeta),
							children: T.tiktok.renueva(formato.fechaConDia(conexion.refresh_expira_at))
						}) : null]
					}),
					puedeAutorizar && conectada ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.cuentaAcciones),
						children: [aviso === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							icono: "RefreshCw",
							alPulsar: reautorizar,
							children: T.tiktok.reautorizar
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "peligro",
							alPulsar: () => setVerDesconectar(true),
							children: T.tiktok.desconectar
						})]
					}) : null
				]
			}),
			conexion.aviso && estado !== "vence_pronto" && estado !== "vencida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				icono: "Info",
				children: conexion.aviso
			}) : null,
			aviso,
			android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "neutro",
				icono: "Monitor",
				vivo: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"data-texto-c35": "",
					children: T.tiktok.androidC35
				})
			}) : null,
			clave.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "critico",
				vivo: true,
				children: clave.error
			}) : null,
			clave.resultado && cred.datos?.legado.disponible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "Trash2",
				titulo: T.tiktok.importado,
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "Trash2",
					cargando: borrando,
					alPulsar: () => void borrarAnterior(),
					children: T.tiktok.borrarAnterior
				}),
				children: clave.resultado.aviso_archivo_original
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.tiktok.grupoCuenta,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.tiktok.region,
					valor: cuenta?.region === "MX" || !cuenta ? T.tiktok.regionMexico : cuenta.region
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.tiktok.tipoCuenta,
					valor: T.tiktok.tipoCreador
				})]
			}),
			conexion.scopes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.tiktok.grupoPermisos,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.filaLibre),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaChequeo, { items: [...permisos, ...extras] })
				})
			}) : null,
			puedeAutorizar ? cred.cargando && !cred.datos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 1 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.tiktok.grupoClave,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.fila),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.filaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.filaEtiqueta),
							children: cred.datos?.app_secret_configurado ? T.tiktok.claveGuardada : T.tiktok.claveFalta
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.filaDesc),
							children: T.tiktok.claveAyuda
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: cred.datos?.app_secret_configurado ? "ok" : "atencion",
						icono: cred.datos?.app_secret_configurado ? "Check" : "CircleAlert",
						children: cred.datos?.app_secret_configurado ? T.tiktok.chipGuardada : T.tiktok.chipFalta
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: cx(ajustes_module_default.tecnicos),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: cx(ajustes_module_default.tecnicosResumen),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.tiktok.tecnicos }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronDown",
							tamano: 18,
							className: cx(ajustes_module_default.preguntaFlecha)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.tecnicosCuerpo),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(ajustes_module_default.filaDesc),
								children: T.tiktok.tecnicosClaves
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: cx(ajustes_module_default.claves),
								children: (conexion.scopes.length > 0 ? conexion.scopes : [...PERMISOS_ESPERADOS]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: cx(ajustes_module_default.mono),
									children: s
								}, s))
							}),
							cred.datos?.app_secret_configurado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(ajustes_module_default.filaDesc),
								children: T.tiktok.claveOrigen(T.tiktok.origenes[origen ?? "manual"] ?? "pegada", fechaClave)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cx(ajustes_module_default.acciones),
								children: botonesClave
							})
						]
					})]
				})]
			}) : null,
			puedeAutorizar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoClave, {
				abierto: verClave,
				alCerrar: () => setVerClave(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: verDesconectar,
				titulo: T.tiktok.desconectarTitulo,
				alCerrar: () => setVerDesconectar(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setVerDesconectar(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: desconectando,
					alPulsar: () => void desconectar(),
					children: T.tiktok.desconectar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.tiktok.desconectarTexto
				})
			})] }) : null
		]
	});
}
/**
* A2. Métricas de tus videos (contrato rev. 5, Display API de TikTok for Developers; notas/pendientes/display_api_contrato.md).
* Estados (logica.vistaMetricas sobre EstadoDisplay de la consulta 'display'):
* - sin_configurar: qué hace, que es una app APARTE en modo Sandbox, cómo crearla, y el Client key + Client secret.
*   El secreto es de tipo password, se manda UNA vez al hub (hub.displayCredenciales) y se borra del estado en cuanto sale;
*   nunca se registra, nunca se vuelve a mostrar y nunca toca el almacenamiento del navegador.
* - sin_conectar / reautorizar: [Conectar con TikTok] pide la URL (hub.displayConectar) y la abre con abrirExterno de
*   @/plataforma (el mismo camino de los enlaces a TikTok de la app). «Autoriza en el navegador y vuelve aquí».
* - esperando: hasta que llega 'display.cambio' (lo escribe @/datos en la consulta: no hay sondeo) o vence el intento.
* - conectada: usuario, permisos, última sincronización, [Sincronizar ahora], [Desconectar] con confirmación y
*   [Cambiar los datos de tu app] (el Client key y el Client secret).
* - Errores (ultimo_error, ya en español) y permisos faltantes con su acción. En Android: solo informa («Se configura en la PC»).
*/
var M = T.metricas;
function mensajeError(e) {
	return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}
var CHIP = {
	sin_configurar: {
		tono: "neutro",
		texto: M.chipSinConfigurar
	},
	sin_conectar: {
		tono: "neutro",
		texto: M.chipSinConectar
	},
	esperando: {
		tono: "info",
		texto: M.chipEsperando
	},
	conectada: {
		tono: "ok",
		texto: M.chipConectada
	},
	reautorizar: {
		tono: "critico",
		texto: M.chipReautorizar
	}
};
/**
* Client key + Client secret. El secreto NO entra al estado de React: el campo de contraseña de CampoTexto no es
* controlado (el atributo `value` del DOM siempre queda vacío) y lo escrito se guarda en una ref de este formulario. Al
* mandarlo se copia a una constante local, la ref se vacía y viaja una vez al hub; al terminar, el campo se vuelve a
* montar vacío (`key`). Si el hub lo rechaza, hay que volver a escribirlo (nunca se conserva para «reintentar»).
*/
function FormularioApp(p) {
	const toast = useToast();
	const [clave, setClave] = (0, import_react.useState)("");
	const secreto = (0, import_react.useRef)("");
	/** Cambia la `key` del campo del secreto: React lo vuelve a montar vacío. */
	const [vueltaSecreto, setVueltaSecreto] = (0, import_react.useState)(0);
	const [focoSecreto, setFocoSecreto] = (0, import_react.useState)(false);
	const [errorClave, setErrorClave] = (0, import_react.useState)(null);
	const [errorSecreto, setErrorSecreto] = (0, import_react.useState)(null);
	const [errorGeneral, setErrorGeneral] = (0, import_react.useState)(null);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const vivo = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		vivo.current = true;
		return () => {
			vivo.current = false;
			secreto.current = "";
		};
	}, []);
	const guardar = async () => {
		if (guardando) return;
		const k = revisarClientKey(clave);
		const s = revisarClientSecret(secreto.current);
		setErrorClave(k === "vacio" ? M.faltaKey : k === "formato" ? M.formatoKey : null);
		setErrorSecreto(s === "vacio" ? M.faltaSecret : s === "formato" ? M.formatoSecret : null);
		setErrorGeneral(null);
		if (k !== null || s !== null) return;
		const enviar = {
			client_key: clave.trim(),
			client_secret: secreto.current.trim()
		};
		secreto.current = "";
		setGuardando(true);
		try {
			await hub.displayCredenciales(enviar);
			if (!vivo.current) return;
			setClave("");
			setFocoSecreto(false);
			setVueltaSecreto((n) => n + 1);
			toast.mostrar({
				texto: M.guardadas,
				tono: "ok"
			});
			p.alGuardado();
		} catch (e) {
			if (!vivo.current) return;
			const campo = e instanceof ErrorHub ? e.detalle?.["campo"] : void 0;
			if (campo === "client_key") {
				setErrorClave(mensajeError(e));
				setErrorSecreto(M.reescribeSecret);
			} else if (campo === "client_secret") setErrorSecreto(mensajeError(e));
			else {
				setErrorGeneral(mensajeError(e));
				setErrorSecreto(M.reescribeSecret);
			}
			setFocoSecreto(campo !== "client_key");
			setVueltaSecreto((n) => n + 1);
		} finally {
			enviar.client_secret = "";
			if (vivo.current) setGuardando(false);
		}
	};
	const disparar = () => void guardar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.formularioApp),
		"data-formulario-display": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
				etiqueta: M.clientKey,
				valor: clave,
				alCambiar: setClave,
				ayuda: M.clientKeyAyuda,
				error: errorClave,
				monoespaciado: true,
				maximo: 64,
				...p.autoFoco ? { autoFoco: true } : {},
				alEnter: disparar
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
				etiqueta: M.clientSecret,
				valor: "",
				alCambiar: (v) => {
					secreto.current = v;
				},
				tipo: "password",
				ayuda: M.clientSecretAyuda,
				error: errorSecreto,
				monoespaciado: true,
				maximo: 128,
				...focoSecreto ? { autoFoco: true } : {},
				alEnter: disparar
			}, vueltaSecreto),
			errorGeneral ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "critico",
				vivo: true,
				children: errorGeneral
			}) : null,
			p.pie ? p.pie(disparar, guardando) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.acciones),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					icono: "Lock",
					cargando: guardando,
					alPulsar: disparar,
					children: M.guardar
				})
			})
		]
	});
}
/** Pasos para crear la app en TikTok for Developers (plegados), con la dirección de regreso copiable. */
function ComoCrear() {
	const toast = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: cx(ajustes_module_default.tecnicos),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: cx(ajustes_module_default.tecnicosResumen),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: M.comoCrear }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "ChevronDown",
				tamano: 18,
				className: cx(ajustes_module_default.preguntaFlecha)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.tecnicosCuerpo),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: cx(ajustes_module_default.pasosApp),
				children: M.pasos.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: x }, x))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(ajustes_module_default.redirect),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: cx(ajustes_module_default.mono),
					children: M.redirect
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
					icono: "Copy",
					etiqueta: M.copiarRedirect,
					tamano: "sm",
					alPulsar: () => void copiarTexto(M.redirect).then((ok) => ok && toast.mostrar({
						texto: M.redirectCopiado,
						tono: "ok"
					}))
				})]
			})]
		})]
	});
}
function AvisoError(p) {
	const err = p.e.ultimo_error;
	if (!err) return null;
	if (err.codigo === "reautorizar" && p.vista === "reautorizar") return null;
	if (err.codigo === "permiso_faltante" && p.e.scopes_faltantes.length > 0) return null;
	const s = p.e.ultima_sync;
	if (p.vista === "conectada" && s && s.estado === "ok" && s.at > err.at) return null;
	const pasajero = [
		"sin_internet",
		"limite",
		"tiktok_no_disponible",
		"respuesta_invalida",
		"error_interno"
	].includes(err.codigo);
	const credenciales = err.codigo === "credenciales_rechazadas";
	const reconectar = !pasajero && !credenciales && p.vista !== "conectada";
	const accion = credenciales ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		tamano: "sm",
		icono: "Pencil",
		alPulsar: p.alCambiar,
		children: M.cambiarCredenciales
	}) : reconectar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "primario",
		tamano: "sm",
		alPulsar: p.alConectar,
		children: M.conectar
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: pasajero ? "atencion" : "critico",
		titulo: err.mensaje,
		acciones: accion,
		vivo: true,
		children: [M.errorDesde(formato.relativa(err.at, p.ahora)), pasajero ? M.reintentarLuego : null].filter(Boolean).join(" ")
	});
}
function GrupoSync(p) {
	const sync = useSync();
	const s = p.e.ultima_sync;
	const enCurso = !!sync.estado?.en_curso;
	const descripcion = s ? [
		`${M.estadosSync[s.estado] ?? s.estado} · ${M.resumenSync(formato.numero(s.videos), s.nuevos, s.cambiados)}`,
		s.error?.mensaje ?? null,
		s.estado === "ok" && !s.completa ? M.syncIncompleta : null
	].filter(Boolean).join(". ") : M.sinSync;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
		titulo: M.grupoSync,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
			etiqueta: s ? M.ultimaSync(cuandoFue(s.at, p.ahora)) : M.sinSync,
			...s ? { descripcion } : {},
			icono: "RefreshCw",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				icono: "RefreshCw",
				cargando: enCurso,
				deshabilitado: !sync.puede || enCurso,
				alPulsar: () => void sync.sincronizar(),
				children: enCurso ? M.sincronizando : M.sincronizar
			})
		})
	});
}
function DialogoDesconectar(p) {
	const toast = useToast();
	const [borrar, setBorrar] = (0, import_react.useState)(false);
	const [olvidar, setOlvidar] = (0, import_react.useState)(false);
	const [trabajando, setTrabajando] = (0, import_react.useState)(false);
	const cerrar = () => {
		setBorrar(false);
		setOlvidar(false);
		p.alCerrar();
	};
	const desconectar = async () => {
		setTrabajando(true);
		try {
			const r = await hub.displayDesconectar({
				borrar_datos: borrar,
				olvidar_app: olvidar
			});
			toast.mostrar({
				texto: r.revocado ? M.desconectada : M.desconectadaSinInternet,
				tono: r.revocado ? "ok" : "info"
			});
			cerrar();
		} catch (e) {
			toast.mostrar({
				texto: mensajeError(e),
				tono: "error"
			});
		} finally {
			setTrabajando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: M.desconectarTitulo,
		alCerrar: cerrar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: cerrar,
			children: T.cancelar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "peligro",
			cargando: trabajando,
			alPulsar: () => void desconectar(),
			children: M.desconectar
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.pila),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: M.desconectarTexto
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
					marcada: borrar,
					alCambiar: setBorrar,
					etiqueta: M.borrarDatos
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
					marcada: olvidar,
					alCambiar: setOlvidar,
					etiqueta: M.olvidarApp
				})
			]
		})
	});
}
function DialogoCambiar(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: M.cambiarTitulo,
		descripcion: M.cambiarDescripcion,
		alCerrar: p.alCerrar,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormularioApp, {
			alGuardado: () => {
				p.alGuardado();
				p.alCerrar();
			},
			autoFoco: true,
			pie: (guardar, guardando) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.acciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alCerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					icono: "Lock",
					cargando: guardando,
					alPulsar: guardar,
					children: M.guardar
				})]
			})
		})
	});
}
function SoloInformativa() {
	const usuario = useConsulta("dashboard", { periodo: "30d" }).datos?.perfil_tiktok?.username ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.secciones.metricas.titulo,
		id: "metricas",
		descripcion: M.descripcion,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
			tono: "neutro",
			icono: "Monitor",
			titulo: M.androidTitulo,
			vivo: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"data-solo-pc": "",
				children: M.androidTexto
			})
		}), usuario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
			tono: "ok",
			icono: "Check",
			children: M.androidConectada(usuario)
		}) : null]
	});
}
function SeccionMetricas() {
	return usePlataforma() === "android" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoloInformativa, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionWindows, {});
}
function SeccionWindows() {
	const toast = useToast();
	const sesion = useSesion();
	const consulta = useConsulta("display", {});
	const [pendiente, setPendiente] = (0, import_react.useState)(null);
	const [ignorarPendiente, setIgnorarPendiente] = (0, import_react.useState)(false);
	const [noAbrio, setNoAbrio] = (0, import_react.useState)(false);
	const [vencio, setVencio] = (0, import_react.useState)(false);
	const [conectando, setConectando] = (0, import_react.useState)(false);
	const [verCambiar, setVerCambiar] = (0, import_react.useState)(false);
	const [verDesconectar, setVerDesconectar] = (0, import_react.useState)(false);
	const [ahora, setAhora] = (0, import_react.useState)(() => ahoraS());
	const e = consulta.datos;
	const pendienteHub = ignorarPendiente ? null : e?.conexion_pendiente?.expira_at ?? null;
	const vista = e ? vistaMetricas({
		...e,
		conexion_pendiente: pendienteHub === null ? null : { expira_at: pendienteHub }
	}, pendiente?.expira ?? null, ahora) : null;
	(0, import_react.useEffect)(() => {
		if (vista !== "esperando") return;
		const t = setInterval(() => setAhora(ahoraS()), 1e3);
		return () => clearInterval(t);
	}, [vista]);
	const anterior = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const previa = anterior.current;
		anterior.current = vista;
		if (previa !== "esperando" || vista === "esperando" || vista === null) return;
		if (vista === "conectada") {
			toast.mostrar({
				texto: M.conectadaToast,
				tono: "ok"
			});
			setVencio(false);
		} else if (!e?.ultimo_error || pendiente && e.ultimo_error.at < pendiente.expira - 600) setVencio(true);
		setPendiente(null);
		setNoAbrio(false);
	}, [
		vista,
		e,
		pendiente,
		toast
	]);
	const titulo = T.secciones.metricas.titulo;
	if (consulta.cargando && !e) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "metricas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 })
	});
	if (!e || !vista) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "metricas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: consulta.error,
			alReintentar: () => void consulta.refrescar()
		})
	});
	const conectar = async () => {
		if (conectando) return;
		setConectando(true);
		setVencio(false);
		setNoAbrio(false);
		try {
			const r = await hub.displayConectar({});
			setIgnorarPendiente(false);
			setPendiente({
				url: r.url,
				expira: r.expira_at
			});
			setAhora(ahoraS());
			if (!(r.abierto || await abrirExterno(r.url))) setNoAbrio(true);
		} catch (err) {
			toast.mostrar({
				texto: mensajeError(err),
				tono: "error"
			});
		} finally {
			setConectando(false);
		}
	};
	const abrirOtraVez = () => {
		if (!pendiente) {
			conectar();
			return;
		}
		abrirExterno(pendiente.url).then((ok) => setNoAbrio(!ok));
	};
	const dejarDeEsperar = () => {
		setPendiente(null);
		setIgnorarPendiente(true);
		setNoAbrio(false);
	};
	const credencialesCambiadas = () => {
		anterior.current = null;
		dejarDeEsperar();
		setVencio(false);
	};
	const u = e.usuario;
	const chip = vista === "conectada" && e.scopes_faltantes.length > 0 ? {
		tono: "atencion",
		texto: M.chipFaltaPermiso(e.scopes_faltantes.length)
	} : CHIP[vista];
	const conCuenta = (vista === "conectada" || vista === "reautorizar") && e.conectada;
	const demo = sesion.datos?.modo === "demo";
	const expira = Math.max(pendiente?.expira ?? 0, pendienteHub ?? 0);
	const botonConectar = (variante, texto = M.conectar) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante,
		iconoFinal: "ExternalLink",
		cargando: conectando,
		alPulsar: () => void conectar(),
		children: texto
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "metricas",
		descripcion: M.descripcion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.cuenta),
				"data-estado-metricas": vista,
				children: [
					conCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCuenta, {
						url: null,
						username: u?.username ?? "TikTok",
						tamano: 40,
						className: cx(ajustes_module_default.cuentaAvatar)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.pcIcono),
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "TrendingUp",
							tamano: 20
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.cuentaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(ajustes_module_default.cuentaFila),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(ajustes_module_default.cuentaNombre),
									children: conCuenta && u?.username ? `@${u.username}` : M.titulos[vista]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									tono: chip.tono,
									...chip.tono === "ok" ? { icono: "Check" } : chip.tono === "critico" ? { icono: "CircleAlert" } : {},
									children: chip.texto
								}),
								conCuenta && u?.verificada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									tono: "info",
									icono: "Check",
									children: M.verificada
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(ajustes_module_default.cuentaMeta),
							children: conCuenta ? u?.nombre ?? M.grupoCuenta : M.queEs
						})]
					}),
					conCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(ajustes_module_default.cuentaAcciones),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "peligro",
							alPulsar: () => setVerDesconectar(true),
							children: M.desconectar
						})
					}) : null
				]
			}),
			demo && vista === "conectada" && e.scopes_faltantes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "neutro",
				icono: "Info",
				children: M.demo
			}) : null,
			vista === "reautorizar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "critico",
				acciones: botonConectar("primario", M.volverAConectar),
				vivo: true,
				children: M.reautorizar
			}) : null,
			e.scopes_faltantes.length > 0 && conCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				acciones: botonConectar("primario", M.volverAConectar),
				children: M.faltanPermisos(listaPermisosDisplay(e.scopes_faltantes), e.scopes_faltantes.length)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoError, {
				e,
				vista,
				ahora,
				alConectar: () => void conectar(),
				alCambiar: () => setVerCambiar(true)
			}),
			vencio && vista === "sin_conectar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				icono: "Clock",
				vivo: true,
				children: M.vencio
			}) : null,
			vista === "sin_configurar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: M.grupoApp,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComoCrear, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormularioApp, { alGuardado: () => setVencio(false) })]
			}) : null,
			vista === "sin_conectar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "ExternalLink",
				titulo: M.listaParaConectar,
				acciones: botonConectar("primario"),
				children: M.autorizaYVuelve
			}) : null,
			vista === "esperando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aviso, {
				tono: "info",
				icono: "Hourglass",
				titulo: M.esperandoTitulo,
				vivo: true,
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					iconoFinal: "ExternalLink",
					alPulsar: abrirOtraVez,
					children: M.abrirOtraVez
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					alPulsar: dejarDeEsperar,
					children: M.dejarDeEsperar
				})] }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(ajustes_module_default.esperando),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, { estado: "sincronizando" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: M.esperandoTexto })]
				}), expira > ahora ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.notaChica, ajustes_module_default.mono),
					"data-cuenta-regresiva": "",
					children: M.caducaEn(cuentaRegresiva(expira - ahora))
				}) : null]
			}) : null,
			noAbrio && pendiente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				vivo: true,
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "Copy",
					alPulsar: () => void copiarTexto(pendiente.url).then((ok) => ok && toast.mostrar({
						texto: M.enlaceCopiado,
						tono: "ok"
					})),
					children: M.copiarEnlace
				}),
				children: M.noAbrio
			}) : null,
			conCuenta && u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: M.grupoCuenta,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.cifrasPerfil),
					children: [
						[
							"seguidores",
							M.seguidores,
							u.seguidores
						],
						[
							"siguiendo",
							M.siguiendo,
							u.siguiendo
						],
						[
							"likes",
							M.likes,
							u.likes_total
						],
						[
							"videos",
							M.videos,
							u.videos_total
						]
					].filter(([, , valor]) => valor !== null).map(([id, etiqueta, valor]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.cifraPerfil),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.cifraPerfilValor),
							title: formato.numero(valor ?? 0),
							children: cifraCompacta(valor ?? 0)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.cifraPerfilEtiqueta),
							children: etiqueta
						})]
					}, id))
				})
			}) : null,
			conCuenta && e.scopes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: M.grupoPermisos,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.filaLibre),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaChequeo, { items: PERMISOS_DISPLAY.map((s) => ({
						id: s,
						texto: nombrePermisoDisplay(s),
						ok: e.scopes.includes(s) && !e.scopes_faltantes.includes(s)
					})) })
				})
			}) : null,
			conCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrupoSync, {
				e,
				ahora
			}) : null,
			e.configurada && vista !== "sin_configurar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
				etiqueta: M.cambiarCredenciales,
				descripcion: conCuenta ? M.cambiarDescripcion : M.cambiarSinCuenta,
				icono: "Lock",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					icono: "Pencil",
					alPulsar: () => setVerCambiar(true),
					children: M.cambiar
				})
			}), conCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: cx(ajustes_module_default.tecnicos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: cx(ajustes_module_default.tecnicosResumen),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: M.tecnicos }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "ChevronDown",
						tamano: 18,
						className: cx(ajustes_module_default.preguntaFlecha)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.tecnicosCuerpo),
					children: [
						e.conectada_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
							etiqueta: M.conectadaDesde,
							valor: formato.fechaConDia(e.conectada_at)
						}) : null,
						e.refresh_expira_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
							etiqueta: M.autorizacionHasta,
							valor: formato.fechaConDia(e.refresh_expira_at)
						}) : null,
						vista === "conectada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(ajustes_module_default.notaChica),
							children: M.accesoRenueva
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: cx(ajustes_module_default.claves),
							children: (e.scopes.length > 0 ? e.scopes : [...PERMISOS_DISPLAY]).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: cx(ajustes_module_default.mono),
								children: s
							}, s))
						})
					]
				})]
			}) : null] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoCambiar, {
				abierto: verCambiar,
				alCerrar: () => setVerCambiar(false),
				alGuardado: credencialesCambiadas
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoDesconectar, {
				abierto: verDesconectar,
				alCerrar: () => setVerDesconectar(false)
			})
		]
	});
}
/**
* B. Sincronización (01_ux §4.14 B; BUILD_SPEC C4, C23, C36). Solo Windows; en Android muestra la fecha de la copia.
* - Última sincronización y [Sincronizar ahora] con el paso real en curso (nunca un tiempo estimado inventado).
* - Automática: 15 / 30 / 60 min / Apagada, 30 por omisión (C36) → AjustesPc.sync_auto + sync_intervalo_min.
* - Segundo plano e iniciar con Windows → AjustesPc (C23).
* - Qué tienes en esta PC (CoberturaResponse): etiquetas de dominio.ETIQUETA_PASO_SYNC y «Portadas de videos con foto
*   {n} de {total}» (C4), con medidores finos para lo parcial.
* - Opciones avanzadas › [Volver a descargar todo] (revisión completa) e Historial reciente (últimas 10).
*/
var OPCIONES_INTERVALO = [
	{
		valor: "15",
		etiqueta: T.sync.opciones["15"]
	},
	{
		valor: "30",
		etiqueta: T.sync.opciones["30"]
	},
	{
		valor: "60",
		etiqueta: T.sync.opciones["60"]
	},
	{
		valor: "apagado",
		etiqueta: T.sync.opciones.apagado
	}
];
function filasCobertura(c, pasos) {
	const n = formato.numero;
	const fallo = (p) => {
		const x = pasos.find((y) => y.paso === p);
		return x && (x.estado === "error" || x.estado === "parcial") ? T.sync.noSeActualizo : null;
	};
	const fr = (a, b) => b > 0 ? a / b : 1;
	return [
		{
			id: "perfil",
			etiqueta: ETIQUETA_PASO_SYNC.perfil,
			valor: "",
			ok: c.perfil,
			error: fallo("perfil")
		},
		{
			id: "muestras",
			etiqueta: ETIQUETA_PASO_SYNC.muestras,
			valor: n(c.muestras),
			ok: c.muestras > 0,
			error: fallo("muestras")
		},
		{
			id: "cumplimientos",
			etiqueta: ETIQUETA_PASO_SYNC.cumplimientos,
			valor: n(c.cumplimientos),
			ok: true,
			error: fallo("cumplimientos")
		},
		{
			id: "productos",
			etiqueta: ETIQUETA_PASO_SYNC.productos,
			valor: n(c.productos_con_imagen),
			ok: true,
			error: fallo("productos")
		},
		{
			id: "ordenes",
			etiqueta: T.sync.ventas,
			valor: c.pedidos_desde ? T.sync.pedidosDesde(n(c.pedidos), formato.fechaCorta(c.pedidos_desde)) : T.sync.pedidos(n(c.pedidos)),
			ok: true,
			error: fallo("ordenes") ?? fallo("ordenes_anteriores")
		},
		{
			id: "vitrina",
			etiqueta: ETIQUETA_PASO_SYNC.vitrina,
			valor: c.vitrina === null ? T.sync.vitrinaSinLeer : n(c.vitrina),
			ok: c.vitrina !== null,
			error: fallo("vitrina")
		},
		{
			id: "detalles",
			etiqueta: ETIQUETA_PASO_SYNC.detalles,
			valor: n(c.detalles),
			ok: true,
			error: fallo("detalles")
		},
		{
			id: "fichas",
			etiqueta: T.sync.fichas,
			valor: T.sync.deTotal(n(c.fichas_ventas.con_ficha), n(c.fichas_ventas.total)),
			fraccion: fr(c.fichas_ventas.con_ficha, c.fichas_ventas.total),
			ok: c.fichas_ventas.con_ficha >= c.fichas_ventas.total,
			error: fallo("productos_ventas")
		},
		{
			id: "portadas",
			etiqueta: T.sync.portadas,
			valor: T.sync.deTotal(n(c.portadas_videos.con_foto), n(c.portadas_videos.total)),
			fraccion: fr(c.portadas_videos.con_foto, c.portadas_videos.total),
			ok: c.portadas_videos.con_foto >= c.portadas_videos.total,
			error: fallo("videos")
		}
	];
}
function Cobertura(p) {
	const cob = useConsulta("sync_cobertura", {});
	if (cob.cargando && !cob.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 5 });
	if (!cob.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
		error: cob.error,
		alReintentar: () => void cob.refrescar()
	});
	const filas = filasCobertura(cob.datos, p.pasos);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
		titulo: T.sync.grupoModulos,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(ajustes_module_default.modulos),
			"aria-label": T.sync.grupoModulos,
			children: filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cx(ajustes_module_default.modulo),
				"data-modulo": f.id,
				"data-ok": f.ok && !f.error ? "" : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.moduloMarca),
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: f.error ? "CircleAlert" : f.ok ? "Check" : "Minus",
							tamano: 14
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(ajustes_module_default.moduloEtiqueta),
						children: [f.etiqueta, f.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(ajustes_module_default.moduloError),
							children: [" · ", f.error]
						}) : null]
					}),
					f.fraccion !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.moduloMedidor),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraProgreso, {
							valor: f.fraccion,
							etiqueta: `${f.etiqueta}: ${f.valor}`
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.moduloValor),
						children: f.valor
					})
				]
			}, f.id))
		})
	});
}
function Historial() {
	const h = useConsulta("sync_historial", { limite: 10 });
	const ahora = ahoraS();
	if (h.cargando && !h.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 });
	if (!h.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
		error: h.error,
		alReintentar: () => void h.refrescar()
	});
	const items = h.datos.items.slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
		titulo: T.sync.grupoHistorial,
		children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(ajustes_module_default.vacioGrupo),
			children: T.sync.historialVacio
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: cx(ajustes_module_default.historial),
			children: items.map((it) => {
				const r = resumenHistorial(it);
				const origen = it.tipo === "completa" ? T.sync.tipoCompleta : T.sync.origenes[it.origen] ?? "";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(ajustes_module_default.historialItem),
					"data-tono": r.tono,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.historialPunto),
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(ajustes_module_default.historialTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(ajustes_module_default.historialLinea),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(ajustes_module_default.historialCuando),
									children: cuandoFueTitulo(it.iniciada_at, ahora)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(ajustes_module_default.historialSep),
									"aria-hidden": "true",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(ajustes_module_default.historialEstado),
									children: r.estado
								}),
								r.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(ajustes_module_default.historialSep),
									"aria-hidden": "true",
									children: "·"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.detalle })] }) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.historialMeta),
							children: [origen, duracion(it.duracion_s)].filter((x) => x && x !== "").join(" · ")
						})]
					})]
				}, it.sync_id);
			})
		})
	});
}
function SincronizacionAndroid() {
	const pc = useConexionPc();
	const sesion = useSesion();
	const ahora = ahoraS();
	const copia = pc?.ultima_copia_at ?? sesion.copia_at ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.secciones.sincronizacion.titulo,
		id: "sincronizacion",
		descripcion: T.sync.androidTexto,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
			etiqueta: T.pc.ultimaCopia,
			valor: copia ? cuandoFue(copia, ahora) : T.sync.androidSinCopia
		}) })
	});
}
function SeccionSincronizacion() {
	if (usePlataforma() === "android") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SincronizacionAndroid, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SincronizacionWindows, {});
}
function SincronizacionWindows() {
	const cap = useCapacidades();
	const toast = useToast();
	const sesion = useSesion();
	const sync = useSync();
	const ajustes = useConsulta("ajustes_pc", {});
	const hist = useConsulta("sync_historial", { limite: 10 });
	const [guardando, setGuardando] = (0, import_react.useState)(null);
	const [verCompleta, setVerCompleta] = (0, import_react.useState)(false);
	const [iniciando, setIniciando] = (0, import_react.useState)(false);
	const ahora = ahoraS();
	const estado = sync.estado ?? sesion.datos?.sync ?? null;
	const enCurso = estado?.en_curso === true;
	const ultimaOk = estado?.ultima_ok_at ?? sesion.datos?.datos.ultima_sync_ok_at ?? null;
	const ultimaDur = hist.datos?.items.find((i) => i.estado === "ok" || i.estado === "parcial")?.duracion_s ?? null;
	const intervalo = intervaloDe(ajustes.datos);
	const a = ajustes.datos;
	const cambiar = async (cambios, campo) => {
		setGuardando(campo);
		try {
			await hub.ajustesPc(cambios);
		} catch (e) {
			toast.mostrar({
				texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico,
				tono: "error"
			});
		} finally {
			setGuardando(null);
		}
	};
	const sincronizar = async (tipo) => {
		setIniciando(true);
		try {
			await sync.sincronizar(tipo);
			toast.mostrar({
				texto: tipo === "completa" ? T.sync.completaIniciada : T.sync.sincronizando,
				tono: "info"
			});
		} catch (e) {
			toast.mostrar({
				texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico,
				tono: "error"
			});
		} finally {
			setIniciando(false);
			setVerCompleta(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.secciones.sincronizacion.titulo,
		id: "sincronizacion",
		descripcion: T.sync.descripcion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.syncEstado),
				"data-en-curso": enCurso ? "" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.syncEstadoTextos),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(ajustes_module_default.syncUltima),
							children: ultimaOk ? T.sync.ultima(cuandoFue(ultimaOk, ahora), duracion(ultimaDur)) : T.sync.nunca
						}),
						enCurso && estado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(ajustes_module_default.syncProgreso),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(ajustes_module_default.syncPaso),
								"aria-live": "polite",
								children: estado.texto
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraProgreso, {
								valor: estado.progreso,
								etiqueta: estado.texto
							})]
						}) : null,
						!enCurso && estado?.ultimo_error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cx(ajustes_module_default.syncError),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "CircleAlert",
									tamano: 16
								}),
								" ",
								estado.ultimo_error.mensaje
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.syncAcciones),
					children: enCurso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						alPulsar: () => void sync.cancelar(),
						children: T.sync.cancelar
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "RefreshCw",
						cargando: iniciando,
						deshabilitado: !sync.puede || !cap.sincronizar,
						alPulsar: () => void sincronizar(),
						children: T.sync.ahora
					})
				})]
			}),
			ajustes.cargando && !a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 }) : !a ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
				error: ajustes.error,
				alReintentar: () => void ajustes.refrescar()
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.sync.grupoAuto,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(ajustes_module_default.fila),
						"data-control": "intervalo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(ajustes_module_default.filaTextos),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.filaEtiqueta),
								children: T.sync.intervalo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.filaDesc),
								"aria-live": "polite",
								children: intervalo === "apagado" ? T.sync.apagada : T.sync.cada(Number(intervalo))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, {
						className: cx(ajustes_module_default.sinFiletePrevio),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
							opciones: OPCIONES_INTERVALO,
							valor: intervalo,
							etiqueta: T.sync.intervalo,
							anchoCompleto: true,
							className: cx(ajustes_module_default.segmentadoIntervalo),
							alCambiar: (v) => void cambiar(cambiosDeIntervalo(v), "sync_intervalo_min")
						}), intervalo !== "30" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.notaChica),
							children: T.sync.recomendado
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.sync.segundoPlano,
						descripcion: a.segundo_plano === null ? T.sync.segundoPlanoSinElegir : T.sync.segundoPlanoDesc,
						activo: a.segundo_plano === true,
						deshabilitado: guardando === "segundo_plano",
						alCambiar: (v) => void cambiar({
							segundo_plano: v,
							...v ? {} : { iniciar_con_windows: false }
						}, "segundo_plano")
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.sync.iniciarWindows,
						descripcion: a.iniciar_con_windows_bloqueado ? T.sync.iniciarBloqueado : T.sync.iniciarWindowsDesc,
						activo: a.iniciar_con_windows && !a.iniciar_con_windows_bloqueado,
						deshabilitado: a.iniciar_con_windows_bloqueado || guardando === "iniciar_con_windows",
						alCambiar: (v) => void cambiar({
							iniciar_con_windows: v,
							...v && a.segundo_plano !== true ? { segundo_plano: true } : {}
						}, "iniciar_con_windows")
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cobertura, { pasos: estado?.pasos ?? [] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.sync.grupoAvanzado,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.fila),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.filaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.filaEtiqueta),
							children: T.sync.completa
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.filaDesc),
							children: T.sync.completaDesc
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(ajustes_module_default.filaControl),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							icono: "RotateCcw",
							deshabilitado: enCurso,
							alPulsar: () => setVerCompleta(true),
							children: T.sync.completa
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Historial, {}),
			estado?.ultimo_error?.codigo === "reautorizar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "critico",
				children: T.tiktok.vencida
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: verCompleta,
				titulo: T.sync.completaTitulo,
				alCerrar: () => setVerCompleta(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setVerCompleta(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					cargando: iniciando,
					alPulsar: () => void sincronizar("completa"),
					children: T.sync.completa
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.sync.completaTexto
				})
			})
		]
	});
}
/**
* C. Celular (Windows, 01_ux §4.14 C; 04 §C.10; BUILD_SPEC C25, C38).
* - [Permitir que mis celulares se conecten] → hub.lanActivar. La primera vez, antes de la ventana de Windows:
*   «Windows te preguntará si Corte puede usar la red. Elige “Redes privadas”.»
* - Firewall (04 §C.10): diagnóstico sin administrador; bloqueado → [Arreglar]; red pública → dos opciones
*   excluyentes, ninguna marcada, y [Configurar] deshabilitado hasta elegir; después de la UAC se repite el diagnóstico
*   y «Listo» solo si ya cubre la red; si se cancela la UAC, camino B.
* - PanelQrEmparejamiento (ui-bloques) sin celulares o con [Emparejar otro celular].
* - Celulares emparejados: permisos (Solo ver / Ver y editar), [Renombrar] y [Olvidar] con su confirmación.
* - Alias de la PC («PC 3F2A», nunca el nombre de Windows) → hub.lanCambiar.
*/
function mensaje$1(e) {
	return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}
/** Flujo del firewall de Windows (04 §C.10). Exportado para las pruebas. */
function PanelFirewall() {
	const diag = useConsulta("firewall", {});
	const angosto = useClaseAncho() === "compacta";
	const [opcion, setOpcion] = (0, import_react.useState)(null);
	const [trabajando, setTrabajando] = (0, import_react.useState)(false);
	const [resultado, setResultado] = (0, import_react.useState)(null);
	const [ultimo, setUltimo] = (0, import_react.useState)(null);
	const d = ultimo ?? diag.datos ?? null;
	const configurar = async (req) => {
		setTrabajando(true);
		setResultado(null);
		try {
			const r = await hub.firewallConfigurar(req);
			setUltimo(r.diagnostico);
			setResultado(r.resultado === "listo" && r.diagnostico.estado === "bien" ? { tipo: "listo" } : r.resultado === "cancelado" ? { tipo: "cancelado" } : { tipo: "fallo" });
		} catch {
			setResultado({ tipo: "fallo" });
		} finally {
			setTrabajando(false);
		}
	};
	const revisar = async () => {
		setUltimo(null);
		setResultado(null);
		invalidar("firewall");
		await diag.refrescar();
	};
	if (diag.cargando && !d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "neutro",
		icono: "Clock",
		vivo: true,
		children: T.celular.firewallRevisando
	});
	if (!d) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
		error: diag.error,
		alReintentar: () => void revisar()
	});
	const pieResultado = resultado?.tipo === "cancelado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "info",
		vivo: true,
		children: T.celular.firewallCancelado
	}) : resultado?.tipo === "fallo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		vivo: true,
		children: T.celular.firewallFallo
	}) : null;
	if (d.estado === "bien") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-firewall": "bien",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
			tono: "ok",
			icono: "Check",
			vivo: resultado?.tipo === "listo",
			children: resultado?.tipo === "listo" ? T.celular.firewallListo : T.celular.firewallBien
		})
	});
	if (d.estado === "bloqueado") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.pila),
		"data-firewall": "bloqueado",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
			tono: "critico",
			icono: "Ban",
			acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "sm",
				icono: "Lock",
				anchoCompleto: angosto,
				cargando: trabajando,
				alPulsar: () => void configurar({ opcion: "arreglar" }),
				children: T.celular.firewallArreglar
			}),
			children: T.celular.firewallBloqueado
		}), pieResultado]
	});
	if (d.estado === "red_publica") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.pila),
		"data-firewall": "red_publica",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aviso, {
			tono: "atencion",
			icono: "Wifi",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.parrafo),
					children: T.celular.firewallPublica
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
					etiqueta: T.celular.firewallOpciones,
					valor: opcion,
					alCambiar: setOpcion,
					className: cx(ajustes_module_default.opcionesFirewall),
					opciones: [{
						valor: "privada",
						etiqueta: T.celular.firewallOpcionPrivada,
						descripcion: T.celular.firewallOpcionPrivadaDesc
					}, {
						valor: "publica_subred",
						etiqueta: T.celular.firewallOpcionPublica,
						descripcion: T.celular.firewallOpcionPublicaDesc
					}]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.acciones),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "Lock",
						anchoCompleto: angosto,
						deshabilitado: opcion === null,
						cargando: trabajando,
						alPulsar: () => opcion ? void configurar({ opcion }) : void 0,
						children: T.celular.firewallConfigurar
					})
				})
			]
		}), pieResultado]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.pila),
		"data-firewall": "desconocido",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aviso, {
			tono: "atencion",
			acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "RefreshCw",
				alPulsar: () => void revisar(),
				children: T.celular.firewallRevisar
			}),
			children: [d.mensaje ?? T.celular.firewallDesconocido, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(ajustes_module_default.notaChica),
				children: T.celular.firewallAyuda
			})]
		}), pieResultado]
	});
}
function Dispositivo(p) {
	const toast = useToast();
	const ahora = ahoraS();
	const [renombrar, setRenombrar] = (0, import_react.useState)(false);
	const [olvidar, setOlvidar] = (0, import_react.useState)(false);
	const [nombre, setNombre] = (0, import_react.useState)(p.d.nombre);
	const [trabajando, setTrabajando] = (0, import_react.useState)(false);
	const cambiar = async (cambios) => {
		setTrabajando(true);
		try {
			await hub.lanCambiarDispositivo(p.d.device_id, cambios);
			return true;
		} catch (e) {
			toast.mostrar({
				texto: mensaje$1(e),
				tono: "error"
			});
			return false;
		} finally {
			setTrabajando(false);
		}
	};
	const revocar = async () => {
		setTrabajando(true);
		try {
			await hub.lanRevocar(p.d.device_id);
			toast.mostrar({
				texto: T.celular.olvidado(p.d.nombre),
				tono: "ok"
			});
			setOlvidar(false);
		} catch (e) {
			toast.mostrar({
				texto: mensaje$1(e),
				tono: "error"
			});
		} finally {
			setTrabajando(false);
		}
	};
	const meta = [p.d.ultimo_uso_at ? T.celular.ultimaConexion(formato.relativa(p.d.ultimo_uso_at, ahora)) : T.celular.nuncaConectado, T.celular.emparejadoEl(formato.fechaCorta(p.d.creado_at))].join(" · ");
	const nombreOk = aliasValido(nombre);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cx(ajustes_module_default.dispositivo),
		"data-dispositivo": p.d.device_id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(ajustes_module_default.dispositivoIcono),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Smartphone",
					tamano: 20
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.dispositivoTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.dispositivoNombre),
					children: p.d.nombre
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: meta
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.dispositivoPermisos),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
					etiqueta: `${T.celular.permisos}: ${p.d.nombre}`,
					valor: p.d.permisos,
					opciones: [{
						valor: "lectura",
						etiqueta: T.celular.soloVer
					}, {
						valor: "lectura_escritura",
						etiqueta: T.celular.verEditar
					}],
					alCambiar: (v) => void cambiar({ permisos: v })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.dispositivoAcciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: "Pencil",
					alPulsar: () => setRenombrar(true),
					children: T.celular.renombrar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: "Trash2",
					alPulsar: () => setOlvidar(true),
					children: T.celular.olvidar
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: renombrar,
				titulo: T.celular.renombrarTitulo,
				alCerrar: () => setRenombrar(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setRenombrar(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					cargando: trabajando,
					deshabilitado: !nombreOk,
					alPulsar: () => void cambiar({ nombre: nombre.trim() }).then((ok) => {
						if (ok) setRenombrar(false);
					}),
					children: T.guardar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T.celular.nombreCelular,
					valor: nombre,
					alCambiar: setNombre,
					maximo: 40,
					autoFoco: true,
					error: nombreOk ? null : T.celular.aliasError
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: olvidar,
				titulo: T.celular.olvidarTitulo(p.d.nombre),
				alCerrar: () => setOlvidar(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setOlvidar(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: trabajando,
					alPulsar: () => void revocar(),
					children: T.celular.olvidar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.celular.olvidarTexto
				})
			})
		]
	});
}
function AliasPc(p) {
	const toast = useToast();
	const [valor, setValor] = (0, import_react.useState)(p.lan.nombre_equipo);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setValor(p.lan.nombre_equipo), [p.lan.nombre_equipo]);
	const ok = aliasValido(valor);
	const cambiado = valor.trim() !== p.lan.nombre_equipo;
	const guardar = async () => {
		if (!ok || !cambiado) return;
		setGuardando(true);
		try {
			await hub.lanCambiar({ nombre_equipo: valor.trim() });
			toast.mostrar({
				texto: T.celular.aliasGuardado,
				tono: "ok"
			});
		} catch (e) {
			toast.mostrar({
				texto: mensaje$1(e),
				tono: "error"
			});
		} finally {
			setGuardando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, {
		className: cx(ajustes_module_default.alias),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
			etiqueta: T.celular.alias,
			valor,
			alCambiar: setValor,
			maximo: 40,
			ayuda: T.celular.aliasAyuda,
			error: ok ? null : T.celular.aliasError,
			alEnter: () => void guardar(),
			className: cx(ajustes_module_default.aliasCampo)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			deshabilitado: !ok || !cambiado,
			cargando: guardando,
			alPulsar: () => void guardar(),
			className: cx(ajustes_module_default.aliasBoton),
			children: T.guardar
		})]
	});
}
function SeccionCelular() {
	const cap = useCapacidades();
	const toast = useToast();
	const lan = useConsulta("lan", {});
	const [primeraVez, marcarAviso] = usePrimeraVez("lan-aviso-redes-privadas");
	const [verAviso, setVerAviso] = (0, import_react.useState)(false);
	const [activando, setActivando] = (0, import_react.useState)(false);
	const [verQr, setVerQr] = (0, import_react.useState)(false);
	const activar = async (activo) => {
		setActivando(true);
		try {
			await hub.lanActivar(activo);
		} catch (e) {
			toast.mostrar({
				texto: mensaje$1(e),
				tono: "error"
			});
		} finally {
			setActivando(false);
		}
	};
	const alCambiar = (activo) => {
		if (activo && primeraVez) {
			setVerAviso(true);
			return;
		}
		activar(activo);
	};
	if (lan.cargando && !lan.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.secciones.celular.titulo,
		id: "celular",
		descripcion: T.celular.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 })
	});
	if (!lan.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.secciones.celular.titulo,
		id: "celular",
		descripcion: T.celular.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: lan.error,
			alReintentar: () => void lan.refrescar()
		})
	});
	const l = lan.datos;
	const activos = l.dispositivos.filter((d) => d.revocado_at === null);
	const mostrarQr = l.activo && cap.lan_admin && (activos.length === 0 || verQr);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: activos.length === 0 ? T.celular.titulo : T.secciones.celular.titulo,
		id: "celular",
		descripcion: T.celular.descripcion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
				etiqueta: T.celular.permitir,
				descripcion: l.activo ? T.celular.permitirDesc : T.celular.apagado,
				activo: l.activo,
				deshabilitado: activando || !cap.lan_admin,
				alCambiar
			}) }) }),
			l.activo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelFirewall, {}) : null,
			mostrarQr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.panelQr),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelQrEmparejamiento, {
					compacto: true,
					alEmparejado: (n) => {
						toast.mostrar({
							texto: T.celular.emparejado(n),
							tono: "ok"
						});
						setVerQr(false);
						invalidar("lan");
					}
				})
			}) : null,
			activos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.celular.grupoCelulares,
				acciones: l.activo && cap.lan_admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: verQr ? "X" : "QrCode",
					alPulsar: () => setVerQr((v) => !v),
					children: verQr ? T.celular.ocultarQr : T.celular.emparejarOtro
				}) : null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(ajustes_module_default.dispositivos),
					children: activos.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dispositivo, { d }, d.device_id))
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.celular.grupoPc,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AliasPc, { lan: l }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.dato),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.datoEtiqueta),
						children: T.celular.direccion
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `${ajustes_module_default.datoValor} ${ajustes_module_default.mono}`,
						children: l.direcciones[0] ? `${l.direcciones[0]}${l.puerto ? ` · ${l.puerto}` : ""}` : T.celular.sinDireccion
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: verAviso,
				titulo: T.celular.avisoRedesTitulo,
				alCerrar: () => setVerAviso(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setVerAviso(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					cargando: activando,
					alPulsar: () => {
						marcarAviso();
						setVerAviso(false);
						activar(true);
					},
					children: T.celular.activar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.celular.avisoRedes
				})
			})
		]
	});
}
/**
* C'. Conexión con la PC (Android, 01_ux §4.14 C'; §4.16): «Conectado a {PC 3F2A}» o «Sin conexión con tu PC», última
* copia, cambios por enviar, permisos del celular, [Actualizar ahora], [Emparejar con otra PC] y [Olvidar esta PC] con
* la confirmación de 01. Revocado e incompatible muestran su aviso y la acción para salir del problema.
*/
function SeccionConexionPc() {
	const pc = useConexionPc();
	const sesion = useSesion();
	const toast = useToast();
	const [actualizando, setActualizando] = (0, import_react.useState)(false);
	const [verOlvidar, setVerOlvidar] = (0, import_react.useState)(false);
	const [olvidando, setOlvidando] = (0, import_react.useState)(false);
	const ahora = ahoraS();
	const titulo = T.secciones.celular.tituloAndroid;
	if (!pc || !pc.emparejado) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "celular",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.vacioPc),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.vacioPcIcono),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "QrCode",
						tamano: 24
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.vacioPcTitulo),
					children: T.pc.sinEmparejar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.filaDesc),
					children: T.pc.sinEmparejarTexto
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "QrCode",
					alPulsar: () => navegar("/emparejar?desde=ajustes"),
					children: T.pc.emparejar
				})
			]
		})
	});
	const nombre = pc.nombre_equipo ?? "tu PC";
	const copia = pc.ultima_copia_at ?? sesion.copia_at ?? null;
	const actualizar = async () => {
		setActualizando(true);
		try {
			await actualizarCopiaAhora();
			toast.mostrar({
				texto: T.pc.actualizado,
				tono: "ok"
			});
		} catch (e) {
			toast.mostrar({
				texto: e instanceof Error ? e.message : T.errorGenerico,
				tono: "error"
			});
		} finally {
			setActualizando(false);
		}
	};
	const olvidar = async () => {
		setOlvidando(true);
		try {
			await olvidarPc();
			setVerOlvidar(false);
			navegar("/bienvenida", { reemplazar: true });
		} catch (e) {
			toast.mostrar({
				texto: e instanceof Error ? e.message : T.errorGenerico,
				tono: "error"
			});
		} finally {
			setOlvidando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "celular",
		descripcion: T.pc.ayuda,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.cuenta),
				"data-pc": pc.conectado ? "conectada" : "sin_conexion",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.pcIcono),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Monitor",
						tamano: 22
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.cuentaTextos),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.cuentaFila),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, { estado: pc.revocado ? "error" : pc.conectado ? pc.sync_en_curso ? "sincronizando" : "ok" : "inactivo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.cuentaNombre),
							children: pc.conectado ? T.pc.conectado(nombre) : T.pc.sinConexion
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(ajustes_module_default.cuentaMeta),
						children: pc.sync_en_curso ? T.pc.sincronizando : !copia ? T.pc.sinCopia : pc.conectado ? T.pc.metaConectado : T.pc.metaSinConexion
					})]
				})]
			}),
			pc.revocado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "critico",
				vivo: true,
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "sm",
					icono: "QrCode",
					alPulsar: () => navegar("/emparejar?desde=ajustes"),
					children: T.pc.emparejarDeNuevo
				}),
				children: T.pc.revocado
			}) : null,
			pc.incompatible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				children: pc.incompatible === "actualiza_pc" ? T.pc.actualizaPc : T.pc.actualizaApp
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.pc.ultimaCopia,
					valor: copia ? cuandoFue(copia, ahora) : T.pc.sinCopia
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.pc.cambios,
					valor: formato.numero(pc.cambios_pendientes)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.pc.permisos,
					valor: pc.permisos === "lectura" ? T.pc.soloVer : T.pc.verEditar
				}),
				pc.ip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
					etiqueta: T.pc.direccion,
					valor: pc.ip,
					mono: true
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.accionesPila),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "lg",
						icono: "RefreshCw",
						anchoCompleto: true,
						cargando: actualizando,
						deshabilitado: pc.revocado,
						alPulsar: () => void actualizar(),
						children: T.pc.actualizar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "lg",
						icono: "QrCode",
						anchoCompleto: true,
						alPulsar: () => navegar("/emparejar?desde=ajustes"),
						children: T.pc.otraPc
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "peligro",
						tamano: "lg",
						anchoCompleto: true,
						alPulsar: () => setVerOlvidar(true),
						children: T.pc.olvidar
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: verOlvidar,
				titulo: T.pc.olvidarTitulo,
				alCerrar: () => setVerOlvidar(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setVerOlvidar(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: olvidando,
					alPulsar: () => void olvidar(),
					children: T.pc.olvidar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.pc.olvidarTexto(pc.cambios_pendientes)
				})
			})
		]
	});
}
/**
* D. Recordatorios (01_ux §4.14 D; BUILD_SPEC C32, C44). Permiso de notificaciones (@/plataforma) y preferencias
* sincronizadas (PreferenciasSincronizadas, PATCH con su rev; en Android van por la cola y funcionan sin conexión).
* En Android 13+ se explica antes de pedir el permiso: «Para recordarte tus videos y tus promesas…».
*/
function usePermiso() {
	const [permiso, setPermiso] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let vivo = true;
		permisoNotificaciones().then((p) => {
			if (vivo) setPermiso(p);
		}).catch(() => {
			if (vivo) setPermiso("no_aplica");
		});
		return () => {
			vivo = false;
		};
	}, []);
	const pedir = async () => {
		try {
			setPermiso(await pedirPermisoNotificaciones());
		} catch {
			setPermiso("denegado");
		}
	};
	return [permiso, pedir];
}
function Ejemplo(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(ajustes_module_default.ejemplo),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(ajustes_module_default.ejemploRotulo),
				children: T.recordatorios.ejemplo
			}),
			" ",
			p.texto
		]
	});
}
function SeccionRecordatorios() {
	const android = usePlataforma() === "android";
	const prefs = useConsulta("preferencias", {});
	const acciones = useAcciones();
	const toast = useToast();
	const [permiso, pedir] = usePermiso();
	const [pidiendo, setPidiendo] = (0, import_react.useState)(false);
	const titulo = T.secciones.recordatorios.titulo;
	if (prefs.cargando && !prefs.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "recordatorios",
		descripcion: T.recordatorios.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 5 })
	});
	if (!prefs.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "recordatorios",
		descripcion: T.recordatorios.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: prefs.error,
			alReintentar: () => void prefs.refrescar()
		})
	});
	const p = prefs.datos;
	const guardar = async (cambios) => {
		const r = await acciones.editarPreferencias({
			...cambios,
			rev: p.rev
		});
		if (r.estado === "error" || r.estado === "conflicto") toast.mostrar({
			texto: r.error?.mensaje ?? T.errorGenerico,
			tono: "error"
		});
	};
	const alternar = (clave) => (v) => {
		const cambios = {};
		cambios[clave] = v;
		guardar(cambios);
		if (v && android && permiso === "denegado") pedir();
	};
	const pedirConExplicacion = async () => {
		setPidiendo(true);
		await pedir();
		setPidiendo(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "recordatorios",
		descripcion: T.recordatorios.descripcion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.recordatorios.grupoPermiso,
				children: permiso === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: "…"
				}) }) : permiso === "concedido" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "ok",
					icono: "Bell",
					className: cx(ajustes_module_default.avisoPlano),
					children: T.recordatorios.permisoConcedido
				}) }) : permiso === "denegado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "atencion",
					icono: "Bell",
					className: cx(ajustes_module_default.avisoPlano),
					acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "sm",
						icono: "Bell",
						cargando: pidiendo,
						alPulsar: () => void pedirConExplicacion(),
						children: T.recordatorios.pedirPermiso
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.parrafo),
						children: android ? T.recordatorios.permisoExplicacion : T.recordatorios.permisoDenegado
					})
				}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "neutro",
					icono: "Bell",
					className: cx(ajustes_module_default.avisoPlano),
					children: T.recordatorios.permisoNoAplica
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.recordatorios.grupoAvisos,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.recordatorios.diario,
						descripcion: T.recordatorios.diarioDesc,
						activo: p.recordatorio_diario,
						alCambiar: alternar("recordatorio_diario")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(ajustes_module_default.subfila),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
							disparador: "boton",
							icono: "Clock",
							etiqueta: T.recordatorios.hora(horaLegible(p.hora_recordatorio)),
							opciones: HORAS_RECORDATORIO.map((h) => ({
								id: h,
								etiqueta: horaLegible(h),
								alPulsar: () => void guardar({ hora_recordatorio: h })
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ejemplo, { texto: T.recordatorios.ejemplos.diario })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.recordatorios.porVencer,
						descripcion: T.recordatorios.porVencerDesc,
						activo: p.aviso_por_vencer,
						alCambiar: alternar("aviso_por_vencer")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ejemplo, { texto: T.recordatorios.ejemplos.porVencer })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.recordatorios.promesas,
						descripcion: T.recordatorios.promesasDesc,
						activo: p.aviso_promesas,
						alCambiar: alternar("aviso_promesas")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ejemplo, { texto: T.recordatorios.ejemplos.promesas })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.recordatorios.atrasados,
						descripcion: T.recordatorios.atrasadosDesc,
						activo: p.aviso_atrasados,
						alCambiar: alternar("aviso_atrasados")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ejemplo, { texto: T.recordatorios.ejemplos.atrasados })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
						etiqueta: T.recordatorios.semanal,
						descripcion: T.recordatorios.semanalDesc,
						activo: p.resumen_semanal,
						alCambiar: alternar("resumen_semanal")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ejemplo, { texto: T.recordatorios.ejemplos.semanal })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.recordatorios.grupoAvance,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
					etiqueta: T.recordatorios.programo,
					descripcion: T.recordatorios.programoDesc,
					activo: p.programo_mis_videos,
					alCambiar: alternar("programo_mis_videos")
				}) })
			})
		]
	});
}
/**
* E. Plantillas de mensajes (01_ux §4.14 E, §4.8): las 11 plantillas, editor con chips de variables que se insertan
* donde está el cursor, vista previa con una muestra real (dominio.resolverPlantilla, variables resaltadas),
* [Restaurar original] y el campo «Tu firma». Todo es estado local (PATCH con rev; en Android va por la cola).
*/
function Resaltado(p) {
	const partes = [];
	let i = 0;
	[...p.rangos].sort((a, b) => a.inicio - b.inicio).forEach((r, k) => {
		if (r.inicio > i) partes.push(p.texto.slice(i, r.inicio));
		partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: cx(ajustes_module_default.marca),
			children: p.texto.slice(r.inicio, r.fin)
		}, k));
		i = Math.max(i, r.fin);
	});
	if (i < p.texto.length) partes.push(p.texto.slice(i));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: partes });
}
/**
* Extracto de una línea del cuerpo crudo: las variables ({tienda}, {agradecimiento_socio}…) van en mono y con su propio
* color, para que «{agradecimiento_socio}Me retrasé» no se lea como una sola palabra (la variable ya trae su espacio).
*/
function Extracto(p) {
	const partes = p.cuerpo.replace(/\s+/g, " ").split(/(\{[a-z_]+\})/g).filter((x) => x !== "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: partes.map((x, k) => /^\{[a-z_]+\}$/.test(x) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(ajustes_module_default.extractoVariable),
		children: x
	}, k) : x) });
}
function Editor(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const [cuerpo, setCuerpo] = (0, import_react.useState)(p.plantilla.cuerpo);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const caja = (0, import_react.useRef)(null);
	const cambiado = cuerpo !== p.plantilla.cuerpo;
	const insertar = (variable) => {
		const area = caja.current?.querySelector("textarea");
		const token = `{${variable}}`;
		const ini = area?.selectionStart ?? cuerpo.length;
		const fin = area?.selectionEnd ?? cuerpo.length;
		const nuevo = cuerpo.slice(0, ini) + token + cuerpo.slice(fin);
		setCuerpo(nuevo);
		requestAnimationFrame(() => {
			if (!area) return;
			area.focus();
			area.setSelectionRange(ini + token.length, ini + token.length);
		});
	};
	const vista = (0, import_react.useMemo)(() => {
		if (!p.muestra) return null;
		const m = p.muestra;
		const fecha = fechaPrometidaPorOmision(m.avance) ?? sumarDias(hoyLocal(), 3);
		return resolverPlantilla({
			id: p.plantilla.id,
			cuerpo,
			predeterminada: p.plantilla.predeterminada && !cambiado,
			rev: p.plantilla.rev
		}, {
			tienda: {
				nombre: m.tienda.nombre,
				es_socio: m.tienda.es_socio
			},
			muestras: [m],
			compromisos: { [m.application_id]: fecha },
			fecha_anterior: m.avisos.promesa,
			link_video: m.avance.content_id ? `https://www.tiktok.com/video/${m.avance.content_id}` : null,
			problema_envio: null,
			firma: p.firma
		});
	}, [
		p.muestra,
		p.plantilla,
		cuerpo,
		cambiado,
		p.firma
	]);
	const guardar = async () => {
		setGuardando(true);
		const r = await acciones.editarPlantilla(p.plantilla.id, {
			cuerpo,
			rev: p.plantilla.rev
		});
		setGuardando(false);
		if (r.estado === "aplicada" || r.estado === "en_cola") {
			toast.mostrar({
				texto: T.plantillas.guardada,
				tono: "ok",
				accion: {
					etiqueta: "Deshacer",
					alPulsar: () => void r.deshacer()
				}
			});
			p.alVolver();
		} else toast.mostrar({
			texto: r.error?.mensaje ?? T.errorGenerico,
			tono: "error"
		});
	};
	const restaurar = async () => {
		setGuardando(true);
		const r = await acciones.restaurarPlantilla(p.plantilla.id);
		setGuardando(false);
		if (r.estado === "aplicada" || r.estado === "en_cola") {
			if (r.objeto) setCuerpo(r.objeto.cuerpo);
			toast.mostrar({
				texto: T.plantillas.restaurada,
				tono: "ok"
			});
		} else toast.mostrar({
			texto: r.error?.mensaje ?? T.errorGenerico,
			tono: "error"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.pila),
		"data-editor-plantilla": p.plantilla.id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cx(ajustes_module_default.volverEnlace),
				onClick: p.alVolver,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronLeft",
					tamano: 16
				}), T.plantillas.volver]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: p.plantilla.nombre,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: caja,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTexto, {
						etiqueta: T.plantillas.cuerpo,
						valor: cuerpo,
						alCambiar: setCuerpo,
						filas: 8,
						contador: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.variables),
					role: "group",
					"aria-label": T.plantillas.variables,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.variablesRotulo),
						children: T.plantillas.variables
					}), VARIABLES_PLANTILLA.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cx(ajustes_module_default.variable),
						onClick: () => insertar(v),
						children: `{${v}}`
					}, v))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaEtiqueta),
					children: T.plantillas.vistaPrevia
				}), vista ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.vistaPrevia),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resaltado, {
						texto: vista.texto,
						rangos: vista.resaltados
					})
				}), vista.faltantes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.notaChica),
					children: T.plantillas.faltan
				}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: T.plantillas.sinMuestra
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.acciones),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						deshabilitado: !cambiado,
						cargando: guardando,
						alPulsar: () => void guardar(),
						children: T.guardar
					}),
					!p.plantilla.predeterminada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						icono: "RotateCcw",
						alPulsar: () => void restaurar(),
						children: T.plantillas.restaurar
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						alPulsar: p.alVolver,
						children: T.cancelar
					})
				]
			})
		]
	});
}
function Firma(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const [valor, setValor] = (0, import_react.useState)(p.prefs.firma);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const guardar = async () => {
		if (valor === p.prefs.firma) return;
		setGuardando(true);
		const r = await acciones.editarPreferencias({
			firma: valor.trim(),
			rev: p.prefs.rev
		});
		setGuardando(false);
		toast.mostrar(r.estado === "aplicada" || r.estado === "en_cola" ? {
			texto: T.plantillas.firmaGuardada,
			tono: "ok"
		} : {
			texto: r.error?.mensaje ?? T.errorGenerico,
			tono: "error"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, {
		className: cx(ajustes_module_default.alias),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
			etiqueta: T.plantillas.firma,
			valor,
			alCambiar: setValor,
			placeholder: T.plantillas.firmaPlaceholder(p.username),
			ayuda: T.plantillas.firmaAyuda,
			maximo: 80,
			alEnter: () => void guardar(),
			className: cx(ajustes_module_default.aliasCampo)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			deshabilitado: valor === p.prefs.firma,
			cargando: guardando,
			alPulsar: () => void guardar(),
			className: cx(ajustes_module_default.aliasBoton),
			children: T.guardar
		})]
	});
}
function SeccionPlantillas() {
	const plantillas = useConsulta("plantillas", {});
	const prefs = useConsulta("preferencias", {});
	const muestras = useConsulta("muestras", { orden: "prioridad" });
	const sesion = useSesion();
	const [editando, setEditando] = (0, import_react.useState)(null);
	const titulo = T.secciones.plantillas.titulo;
	const muestra = muestras.datos?.items.find((m) => esPendiente(m)) ?? muestras.datos?.items[0] ?? null;
	if (plantillas.cargando && !plantillas.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "plantillas",
		descripcion: T.plantillas.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 6 })
	});
	if (!plantillas.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "plantillas",
		descripcion: T.plantillas.descripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: plantillas.error,
			alReintentar: () => void plantillas.refrescar()
		})
	});
	const actual = editando ? plantillas.datos.items.find((x) => x.id === editando) ?? null : null;
	if (actual) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "plantillas",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Editor, {
			plantilla: actual,
			muestra,
			firma: prefs.datos?.firma ?? "",
			alVolver: () => setEditando(null)
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "plantillas",
		descripcion: T.plantillas.descripcion,
		children: [prefs.datos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Firma, {
			prefs: prefs.datos,
			username: sesion.datos?.cuenta?.username ?? "tu_usuario"
		}) }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
			titulo: T.plantillas.lista,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(ajustes_module_default.plantillas),
				children: plantillas.datos.items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cx(ajustes_module_default.plantilla),
					onClick: () => setEditando(x.id),
					"aria-label": `${T.plantillas.editar}: ${x.nombre}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(ajustes_module_default.plantillaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(ajustes_module_default.plantillaNombre),
							children: [x.nombre, !x.predeterminada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: "marca",
								tamano: "md",
								children: T.plantillas.editada
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.plantillaExtracto),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Extracto, { cuerpo: x.cuerpo })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "ChevronRight",
						tamano: 18,
						className: cx(ajustes_module_default.masFlecha)
					})]
				}) }, x.id))
			})
		})]
	});
}
/**
* F. Apariencia (01_ux §4.14 F; BUILD_SPEC C24, C48). Tema (Según el sistema · Claro · Oscuro) y reducir animaciones
* (Según el sistema · Sí · No) son preferencias sincronizadas; la densidad (Cómoda / Compacta, solo escritorio) vive en
* AjustesPc. Los atributos de <html> los aplica ui-marco al cambiar las preferencias. Idioma fijo: Español (México).
*/
/** Miniatura del tema (dibujada con la rampa grafito primitiva: se ve igual en cualquier tema). */
function Miniatura(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(ajustes_module_default.mini),
		"data-mini": p.tipo,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(ajustes_module_default.miniMitad),
			"data-lado": "oscuro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniBarra) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(ajustes_module_default.miniTarjeta),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniLinea) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniLineaCorta) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniBoton) })
				]
			})]
		}), p.tipo === "sistema" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(ajustes_module_default.miniMitad),
			"data-lado": "claro",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniBarra) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(ajustes_module_default.miniTarjeta),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniLinea) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniLineaCorta) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(ajustes_module_default.miniBoton) })
				]
			})]
		}) : null]
	});
}
function SelectorTema(p) {
	const nombre = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: cx(ajustes_module_default.temas),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: cx(ajustes_module_default.filaEtiqueta),
			children: T.apariencia.tema
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(ajustes_module_default.temasFila),
			children: [
				"sistema",
				"claro",
				"oscuro"
			].map((o) => {
				const id = `${nombre}-${o}`;
				const marcada = o === p.valor;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: id,
					className: `${ajustes_module_default.tema} ${marcada ? ajustes_module_default.temaMarcado : ""}`,
					"data-tema": o,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id,
							type: "radio",
							name: nombre,
							className: cx(ajustes_module_default.oculto),
							checked: marcada,
							onChange: () => p.alCambiar(o)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.temaVista),
							"data-claro": o === "claro" ? "" : void 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Miniatura, { tipo: o })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.temaNombre),
							children: T.apariencia.temas[o]
						})
					]
				}, o);
			})
		})]
	});
}
function SeccionApariencia() {
	const android = usePlataforma() === "android";
	const tema = useTema();
	const prefs = useConsulta("preferencias", {});
	const ajustes = useConsulta("ajustes_pc", {}, { activa: !android });
	const acciones = useAcciones();
	const toast = useToast();
	const titulo = T.secciones.apariencia.titulo;
	const desc = android ? T.apariencia.descripcionAndroid : T.apariencia.descripcion;
	if (prefs.cargando && !prefs.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "apariencia",
		descripcion: desc,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 3 })
	});
	if (!prefs.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo,
		id: "apariencia",
		descripcion: desc,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
			error: prefs.error,
			alReintentar: () => void prefs.refrescar()
		})
	});
	const p = prefs.datos;
	const guardar = async (cambios) => {
		const r = await acciones.editarPreferencias({
			...cambios,
			rev: p.rev
		});
		if (r.estado === "error" || r.estado === "conflicto") toast.mostrar({
			texto: r.error?.mensaje ?? T.errorGenerico,
			tono: "error"
		});
	};
	const densidad = async (d) => {
		try {
			await hub.ajustesPc({ densidad: d });
		} catch (e) {
			toast.mostrar({
				texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico,
				tono: "error"
			});
		}
	};
	const valorTema = p.tema ?? tema.preferencia;
	const valorAnim = p.reducir_animaciones ?? "sistema";
	const valorDensidad = ajustes.datos?.densidad ?? (tema.densidad === "compacta" ? "compacta" : "comoda");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo,
		id: "apariencia",
		descripcion: desc,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaLibre, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorTema, {
				valor: valorTema,
				alCambiar: (t) => void guardar({ tema: t })
			}) }),
			!android ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.filaTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaEtiqueta),
					children: T.apariencia.densidad
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: T.apariencia.densidadDesc
				})]
			}), ajustes.error && !ajustes.datos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
				error: ajustes.error,
				alReintentar: () => void ajustes.refrescar()
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
				etiqueta: T.apariencia.densidad,
				valor: valorDensidad,
				opciones: [{
					valor: "comoda",
					etiqueta: T.apariencia.densidades.comoda
				}, {
					valor: "compacta",
					etiqueta: T.apariencia.densidades.compacta
				}],
				alCambiar: (d) => void densidad(d),
				className: cx(ajustes_module_default.segmentadoAncho)
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilaLibre, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.filaTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaEtiqueta),
					children: T.apariencia.animaciones
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.filaDesc),
					children: T.apariencia.animacionesDesc
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
				etiqueta: T.apariencia.animaciones,
				valor: valorAnim,
				opciones: [
					{
						valor: "sistema",
						etiqueta: T.apariencia.animacionesOpc.sistema
					},
					{
						valor: "si",
						etiqueta: T.apariencia.animacionesOpc.si
					},
					{
						valor: "no",
						etiqueta: T.apariencia.animacionesOpc.no
					}
				],
				alCambiar: (v) => void guardar({ reducir_animaciones: v }),
				className: cx(ajustes_module_default.segmentadoAncho)
			})] })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
			etiqueta: T.apariencia.idioma,
			valor: T.apariencia.idiomaValor
		}) })]
	});
}
/**
* G. Privacidad y datos (01_ux §4.14 G y §7.5; BUILD_SPEC C10, C19, C25, C46).
* - Texto EXACTO de C10.
* - Espacio usado (GET /api/datos/uso) como barra apilada con su tabla gemela, y [Borrar caché de imágenes].
* - [Exportar mi plan, avisos y notas] = hub.exportarLocal() + guardarArchivo (JSON) · [Importar plan, avisos y notas] =
*   elegirArchivo() + hub.importarLocal(ruta): solo la RUTA viaja al hub (C46).
* - Archivo de la conexión anterior → hub.borrarLegado() (a la Papelera, recuperable).
* - [Borrar datos de TikTok de este equipo] y [Borrar todo y desconectar] (activo solo al escribir BORRAR).
* - Android: aviso de la copia y [Borrar la copia de este celular].
*/
function mensaje(e) {
	return e instanceof ErrorHub ? e.mensaje : e instanceof Error ? e.message : T.errorGenerico;
}
function Espacio(p) {
	const uso = useConsulta("uso_datos", {});
	if (uso.cargando && !uso.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargandoGrupo, { filas: 1 });
	if (!uso.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorCarga, {
		error: uso.error,
		alReintentar: () => void uso.refrescar()
	});
	const u = uso.datos;
	const partes = [
		{
			id: "datos",
			etiqueta: T.datos.partes.datos,
			valor: u.datos_bytes,
			texto: tamano(u.datos_bytes),
			estilo: "solido",
			slot: 1
		},
		{
			id: "imagenes",
			etiqueta: T.datos.partes.imagenes,
			valor: u.imagenes_bytes,
			texto: tamano(u.imagenes_bytes),
			estilo: "solido",
			slot: 2
		},
		...u.registros_bytes > 0 ? [{
			id: "registros",
			etiqueta: T.datos.partes.registros,
			valor: u.registros_bytes,
			texto: tamano(u.registros_bytes),
			estilo: "solido",
			slot: 3
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
		titulo: T.datos.grupoEspacio,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.filaLibre),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.oculto),
				children: T.datos.espacio(tamano(u.datos_bytes), tamano(u.imagenes_bytes))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraApilada, {
				titulo: T.datos.espacioTitulo,
				partes,
				tablaGemela: {
					columnas: [T.datos.columnaQue, T.datos.columnaEspacio],
					filas: partes.map((x) => [x.etiqueta, x.texto])
				}
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
			etiqueta: T.datos.borrarImagenes,
			descripcion: T.datos.borrarImagenesTexto,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				icono: "Trash2",
				deshabilitado: u.imagenes_bytes === 0,
				alPulsar: p.alBorrar,
				children: T.datos.borrarImagenes
			})
		})]
	});
}
function ArchivoAnterior() {
	const cred = useConsulta("credenciales", {});
	const toast = useToast();
	const [borrando, setBorrando] = (0, import_react.useState)(false);
	const l = cred.datos?.legado;
	if (!l || !l.disponible || !l.ruta) return null;
	const borrar = async () => {
		setBorrando(true);
		try {
			const r = await hub.borrarLegado();
			toast.mostrar({
				texto: r.resultado === "papelera" ? T.datos.anteriorEnPapelera : T.datos.anteriorNoExiste,
				tono: "ok"
			});
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setBorrando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
		titulo: T.datos.grupoAnterior,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
			etiqueta: rutaAmigable(l.ruta),
			descripcion: T.datos.anteriorTexto(rutaAmigable(l.ruta)),
			icono: "Lock",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				icono: "Trash2",
				cargando: borrando,
				alPulsar: () => void borrar(),
				children: T.datos.anteriorBorrar
			})
		})
	});
}
function PrivacidadAndroid() {
	const pc = useConexionPc();
	const toast = useToast();
	const [ver, setVer] = (0, import_react.useState)(false);
	const [borrando, setBorrando] = (0, import_react.useState)(false);
	const borrar = async () => {
		setBorrando(true);
		try {
			await olvidarPc();
			toast.mostrar({
				texto: T.datos.copiaBorrada,
				tono: "ok"
			});
			setVer(false);
			navegar("/bienvenida", { reemplazar: true });
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setBorrando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.secciones.datos.titulo,
		id: "datos",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.privacidad),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.privacidadTexto),
					"data-texto-c10": "",
					children: T.datos.privacidad
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.filaDesc),
					children: T.datos.androidPrivacidad
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.datos.grupoBorrar,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
					etiqueta: T.datos.borrarCopia,
					descripcion: T.datos.borrarCopiaTexto(pc?.cambios_pendientes ?? 0),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "peligro",
						alPulsar: () => setVer(true),
						children: T.datos.borrar
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: ver,
				titulo: T.datos.borrarCopiaTitulo,
				alCerrar: () => setVer(false),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setVer(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: borrando,
					alPulsar: () => void borrar(),
					children: T.datos.borrar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.datos.borrarCopiaTexto(pc?.cambios_pendientes ?? 0)
				})
			})
		]
	});
}
function SeccionPrivacidad() {
	if (usePlataforma() === "android") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacidadAndroid, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacidadWindows, {});
}
function PrivacidadWindows() {
	const cap = useCapacidades();
	const toast = useToast();
	const [confirmar, setConfirmar] = (0, import_react.useState)(null);
	const [texto, setTexto] = (0, import_react.useState)("");
	const [trabajando, setTrabajando] = (0, import_react.useState)(null);
	const exportar = async () => {
		setTrabajando("exportar");
		try {
			const datos = await hub.exportarLocal();
			const r = await guardarArchivo(nombreExportacion(hoyLocal()), "application/json", JSON.stringify(datos, null, 2));
			if (r === "guardado" || r === "compartido") toast.mostrar({
				texto: T.datos.exportado,
				tono: "ok"
			});
			else if (r === "error") toast.mostrar({
				texto: T.errorGenerico,
				tono: "error"
			});
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setTrabajando(null);
		}
	};
	const importar = async () => {
		const ruta = await elegirArchivo(T.datos.tituloElegir, ["json"]);
		if (!ruta) return;
		setTrabajando("importar");
		try {
			const r = await hub.importarLocal(ruta);
			const i = r.importados;
			toast.mostrar({
				texto: T.datos.importado(i.planes, i.avisos, i.notas),
				tono: "ok",
				...r.omitidos > 0 ? { detalle: T.datos.importadoOmitidos(r.omitidos) } : {}
			});
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setTrabajando(null);
		}
	};
	const borrar = async (alcance) => {
		setTrabajando(alcance);
		try {
			await hub.borrarDatos({
				alcance,
				confirmacion: "BORRAR"
			});
			toast.mostrar({
				texto: alcance === "imagenes" ? T.datos.imagenesBorradas : alcance === "tiktok" ? T.datos.tiktokBorrado : T.datos.todoBorrado,
				tono: "ok"
			});
			setConfirmar(null);
			setTexto("");
			if (alcance === "todo") navegar("/bienvenida", { reemplazar: true });
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setTrabajando(null);
		}
	};
	const cerrar = () => {
		setConfirmar(null);
		setTexto("");
	};
	const escribioBorrar = texto.trim() === "BORRAR";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.secciones.datos.titulo,
		id: "datos",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.privacidad),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.privacidadTexto),
					"data-texto-c10": "",
					children: T.datos.privacidad
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Espacio, { alBorrar: () => setConfirmar("imagenes") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.datos.grupoTuyo,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
					etiqueta: T.datos.exportar,
					descripcion: T.datos.exportarDesc,
					icono: "Download",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						cargando: trabajando === "exportar",
						alPulsar: () => void exportar(),
						children: T.datos.exportarCorto
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
					etiqueta: T.datos.importar,
					descripcion: T.datos.importarDesc,
					icono: "ArrowDownUp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						cargando: trabajando === "importar",
						deshabilitado: !cap.escribir,
						alPulsar: () => void importar(),
						children: T.datos.importarCorto
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArchivoAnterior, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.datos.grupoBorrar,
				className: cx(ajustes_module_default.grupoPeligro),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
					etiqueta: T.datos.borrarTiktok,
					descripcion: T.datos.borrarTiktokTexto,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						alPulsar: () => setConfirmar("tiktok"),
						children: T.datos.borrar
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fila, {
					etiqueta: T.datos.borrarTodo,
					descripcion: T.datos.borrarTodoDesc,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "peligro",
						alPulsar: () => setConfirmar("todo"),
						children: T.datos.borrarTodoBoton
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: confirmar === "imagenes",
				titulo: T.datos.borrarImagenesTitulo,
				alCerrar: cerrar,
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: cerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: trabajando === "imagenes",
					alPulsar: () => void borrar("imagenes"),
					children: T.datos.borrar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.datos.borrarImagenesTexto
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: confirmar === "tiktok",
				titulo: T.datos.borrarTiktokTitulo,
				alCerrar: cerrar,
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: cerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: trabajando === "tiktok",
					alPulsar: () => void borrar("tiktok"),
					children: T.datos.borrar
				})] }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: T.datos.borrarTiktokTexto
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
				abierto: confirmar === "todo",
				titulo: T.datos.borrarTodoTitulo,
				alCerrar: cerrar,
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: cerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					deshabilitado: !escribioBorrar,
					cargando: trabajando === "todo",
					alPulsar: () => escribioBorrar ? void borrar("todo") : void 0,
					children: T.datos.borrarTodoBoton
				})] }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(ajustes_module_default.textoModal),
					children: [
						T.datos.borrarTodoTexto1,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: T.datos.borrarTodoClave }),
						T.datos.borrarTodoTexto2
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T.datos.borrarTodoCampo,
					valor: texto,
					alCambiar: setTexto,
					monoespaciado: true,
					placeholder: "BORRAR",
					autoFoco: true
				})]
			})
		]
	});
}
function SeccionAyuda() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.secciones.ayuda.titulo,
		id: "ayuda",
		descripcion: T.ayudaDescripcion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, { children: T.ayuda.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
			className: cx(ajustes_module_default.pregunta),
			...i === 0 ? { open: true } : {},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
				className: cx(ajustes_module_default.preguntaResumen),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x.pregunta }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronDown",
					tamano: 18,
					className: cx(ajustes_module_default.preguntaFlecha)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.preguntaRespuesta),
				children: x.respuesta
			})]
		}, x.pregunta)) })
	});
}
/**
* H. Acerca de (01_ux §4.14 H; 02 §2.1): logotipo «corte», «Corte {versión}», textos de 01, puerto real de la interfaz
* con el aviso de respaldo (SessionResponse.servidor, 04 §1) y licencias de terceros desde /licencias.json (lo genera
* build-empaquetado y lo sirve el hub); si no existe: «Disponible en la versión instalada».
*/
/** Logotipo: ícono C con el corte a 45° + «corte» (02 §2.2). Colores de tokens. */
function Logotipo(p) {
	const t = p.tamano ?? 40;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(ajustes_module_default.logo),
		style: { ["--logo"]: `${t}px` },
		"aria-label": "Corte",
		role: "img",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 1024 1024",
			width: t,
			height: t,
			"aria-hidden": "true",
			className: cx(ajustes_module_default.logoIcono),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "1024",
				height: "1024",
				rx: "232",
				className: cx(ajustes_module_default.logoFondo)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				transform: "translate(18 -6)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M742 330A300 300 0 1 0 742 694L645 625A132 132 0 1 1 645 399Z",
					className: cx(ajustes_module_default.logoC)
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(ajustes_module_default.logoTexto),
			"aria-hidden": "true",
			children: "corte"
		})]
	});
}
function useLicencias() {
	const [e, setE] = (0, import_react.useState)({ tipo: "cargando" });
	(0, import_react.useEffect)(() => {
		let vivo = true;
		const c = typeof AbortController !== "undefined" ? new AbortController() : null;
		(async () => {
			try {
				const r = await fetch("/licencias.json", {
					cache: "no-store",
					...c ? { signal: c.signal } : {}
				});
				const tipo = r.headers.get("content-type") ?? "";
				if (!r.ok || !tipo.includes("json")) throw new Error("sin licencias");
				const items = leerLicencias(await r.json());
				if (vivo) setE(items ? {
					tipo: "lista",
					items
				} : { tipo: "no" });
			} catch {
				if (vivo) setE({ tipo: "no" });
			}
		})();
		return () => {
			vivo = false;
			c?.abort();
		};
	}, []);
	return e;
}
function SeccionAcerca() {
	const sesion = useSesion();
	const plataforma = usePlataforma();
	const info = infoPlataforma();
	const lic = useLicencias();
	const servidor = sesion.datos?.servidor;
	const version = servidor?.version ?? info.version_app;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.secciones.acerca.titulo,
		id: "acerca",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.acerca),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 44 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(ajustes_module_default.acercaVersion),
						children: T.acerca.version(version)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(ajustes_module_default.acercaTexto),
						children: T.acerca.hecho
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(ajustes_module_default.filaDesc),
						children: T.acerca.api
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Grupo, {
				titulo: T.acerca.grupoTecnico,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
						etiqueta: T.acerca.versionEtiqueta,
						valor: version,
						mono: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
						etiqueta: T.acerca.plataforma,
						valor: T.acerca.plataformas[plataforma] ?? plataforma
					}),
					servidor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dato, {
						etiqueta: T.acerca.puerto,
						valor: `127.0.0.1:${servidor.puerto_ui}`,
						mono: true
					}) : null
				]
			}),
			servidor?.puerto_respaldo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "Info",
				children: T.acerca.puertoRespaldo(servidor.puerto_ui)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grupo, {
				titulo: T.acerca.licencias,
				children: lic.tipo === "cargando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.vacioGrupo),
					children: T.acerca.licenciasCargando
				}) : lic.tipo === "no" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(ajustes_module_default.vacioGrupo),
					"data-licencias": "no",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Info",
							tamano: 16
						}),
						" ",
						T.acerca.licenciasNoDisponibles
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.vacioGrupo),
					children: T.acerca.licenciasN(lic.items.length)
				}), lic.items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: cx(ajustes_module_default.pregunta),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: cx(ajustes_module_default.preguntaResumen),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							x.nombre,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.filaDesc),
								children: [x.version, x.licencia].filter(Boolean).join(" · ")
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronDown",
							tamano: 18,
							className: cx(ajustes_module_default.preguntaFlecha)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: cx(ajustes_module_default.licencia),
						children: x.texto
					})]
				}, `${x.nombre}-${x.version}`))] })
			})
		]
	});
}
function Contenido(p) {
	switch (p.id) {
		case "tiktok": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionTiktok, {});
		case "metricas": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionMetricas, {});
		case "sincronizacion": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionSincronizacion, {});
		case "celular": return p.android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionConexionPc, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionCelular, {});
		case "recordatorios": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionRecordatorios, {});
		case "plantillas": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionPlantillas, {});
		case "apariencia": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionApariencia, {});
		case "datos": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionPrivacidad, {});
		case "ayuda": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionAyuda, {});
		case "acerca": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionAcerca, {});
	}
}
function NoExiste() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.noExiste),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleHelp",
			titulo: T.noExiste,
			texto: T.noExisteTexto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
			a: "/ajustes",
			className: cx(ajustes_module_default.enlace),
			children: T.irAlInicio
		})]
	});
}
/** Subnavegación de 240 (escritorio) — en anchos medianos se acomoda en varias filas de pastillas. */
function Subnav(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cx(ajustes_module_default.subnav),
		"aria-label": T.navegacion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(ajustes_module_default.subnavLista),
			children: p.secciones.map((s) => {
				const activa = s.id === p.activa;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: `/ajustes/${s.id}`,
					reemplazar: true,
					className: `${ajustes_module_default.subnavItem} ${activa ? ajustes_module_default.subnavActivo : ""}`,
					...activa ? { "aria-label": `${s.titulo} (sección actual)` } : {},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: s.icono,
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.subnavTexto),
						children: s.titulo
					})]
				}) }, s.id);
			})
		})
	});
}
/** Tarjeta de estado de «Más» (01 §3.3): conexión con la PC en Android; cuenta de TikTok en Windows compacta. */
function TarjetaEstado(p) {
	const sesion = useSesion();
	const pc = useConexionPc();
	const ahora = ahoraS();
	if (p.android) {
		const copia = pc?.ultima_copia_at ?? sesion.copia_at ?? null;
		const conectado = pc?.conectado === true;
		const texto = !copia ? T.mas.sinCopia : conectado ? T.mas.copiaDe(formato.relativa(copia, ahora)) : T.mas.datosDel(`${formato.fechaCorta(copia)}, ${formato.hora(copia)}`);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
			a: "/ajustes/celular",
			className: cx(ajustes_module_default.estadoMas, !conectado && ajustes_module_default.estadoMasInactivo),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.estadoMasIcono),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Monitor",
						tamano: 20
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(ajustes_module_default.estadoMasTexto),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(ajustes_module_default.estadoMasTitulo),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, { estado: conectado ? "ok" : "inactivo" }),
							" ",
							conectado ? T.pc.conectado(pc?.nombre_equipo ?? "tu PC") : T.pc.sinConexion
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.estadoMasDesc),
						children: texto
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 18,
					className: cx(ajustes_module_default.estadoMasFlecha)
				})
			]
		});
	}
	const s = sesion.datos;
	if (!s) return null;
	const ok = s.conexion.estado === "conectada";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
		a: "/ajustes/tiktok",
		className: cx(ajustes_module_default.estadoMas),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCuenta, {
				url: s.cuenta?.avatar ?? null,
				username: s.cuenta?.username ?? "tu cuenta",
				tamano: 40
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(ajustes_module_default.estadoMasTexto),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.estadoMasTitulo),
					children: s.cuenta ? `@${s.cuenta.username}` : T.secciones.tiktok.titulo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(ajustes_module_default.estadoMasDesc),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, { estado: ok ? "ok" : "error" }),
						" ",
						ok ? T.mas.cuentaConectada : T.mas.cuentaRevisar
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "ChevronRight",
				tamano: 18,
				className: cx(ajustes_module_default.estadoMasFlecha)
			})
		]
	});
}
function ListaMas(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.mas),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaEstado, { android: p.android }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": T.navegacion,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(ajustes_module_default.masLista),
				children: p.secciones.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: `/ajustes/${s.id}`,
					className: cx(ajustes_module_default.masItem),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.masIcono),
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: s.icono,
								tamano: 20
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(ajustes_module_default.masTextos),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.masTitulo),
								children: s.titulo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(ajustes_module_default.masResumen),
								children: s.resumen
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronRight",
							tamano: 18,
							className: cx(ajustes_module_default.masFlecha)
						})
					]
				}) }, s.id))
			})
		})]
	});
}
function PantallaAjustes() {
	const r = useRuta();
	const clase = useClaseAncho();
	const android = usePlataforma() === "android";
	const secciones = seccionesPara(android);
	const pedida = r.params["seccion"] ?? null;
	const compacta = clase === "compacta";
	const valida = pedida === null ? null : esSeccion(pedida) && secciones.some((s) => s.id === pedida) ? pedida : "invalida";
	const titulo = compacta && android ? T.tituloMas : T.tituloPantalla;
	if (compacta) {
		if (valida === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
			titulo,
			lista: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.raiz),
				"data-vista": "mas",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, { titulo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaMas, {
					secciones,
					android
				})]
			})
		});
		const def = secciones.find((s) => s.id === valida);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
			titulo: def?.titulo ?? titulo,
			lista: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.raiz),
				"data-vista": "seccion",
				"data-seccion-activa": valida,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
					titulo: def?.titulo ?? T.noExiste,
					volver: {
						a: "/ajustes",
						etiqueta: T.volverMas
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.contenidoCompacto),
					children: valida === "invalida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoExiste, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contenido, {
						id: valida,
						android
					})
				})]
			})
		});
	}
	const activa = valida ?? secciones[0]?.id ?? "tiktok";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.tituloPantalla,
		lista: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.raiz),
			"data-vista": "dos-columnas",
			"data-seccion-activa": activa,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo: T.tituloPantalla,
				contexto: android ? T.contextoAndroid : T.contexto
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.columnas),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Subnav, {
					secciones,
					activa: activa === "invalida" ? null : activa
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(ajustes_module_default.contenido),
					children: activa === "invalida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoExiste, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contenido, {
						id: activa,
						android
					})
				})]
			})]
		})
	});
}
/**
* Diálogo de reautorización (01_ux §5.4 A; BUILD_SPEC C35, C37). Lo monta ui-marco con import.meta.glob + lazy y se
* abre con ?reautorizar=1. 3 pasos en un Modal de 560:
*  0 (solo si falta) · la clave de la app: [Importar desde archivo…] (elegirArchivo → solo la ruta) o pegarla.
*  1 · «Abre TikTok Shop»: hub.authLink(true) crea un `state` de un solo uso que vive 10 min (C37) y abre el navegador.
*  2 · «Pega el enlace de regreso»: campo + [Pegar]. Mientras ESTE diálogo está abierto en el paso 2 (y solo entonces),
*      se consulta GET /api/auth/portapapeles cada 1.5 s y al volver el foco; si hay un enlace con `state` que coincide:
*      «Detectamos el enlace de autorización. Conectando…» y se canjea (con [Cancelar]). Errores con los textos de 01.
*  3 · «Listo»: «¡Listo! Conectado como @…» + permisos con ✓ + «Sincronizando tus datos…». En la primera conexión
*      (confirmar_cuenta) primero «¿Eres tú?»; solo si confirma se pide la sincronización completa.
* Android (C35): no reautoriza; muestra el estado y «Para volver a conectar, abre Corte en tu PC › …».
*/
/** Cada cuánto se revisa el portapapeles mientras el diálogo está en el paso 2 (03 §2.2). */
var INTERVALO_PORTAPAPELES_MS = 1500;
/** ErrorHub del canje → texto y acción de la tabla «Errores del paso 2» (01 §5.4 A). */
function errorDeCanje(e) {
	const R = T.reauth.errores;
	if (!(e instanceof ErrorHub)) return {
		texto: R.internet,
		accion: "reintentar"
	};
	switch (e.codigo) {
		case "state_invalido": return {
			texto: R.state,
			accion: "volver_abrir"
		};
		case "codigo_vencido": return {
			texto: R.vencido,
			accion: "volver_abrir"
		};
		case "no_es_creador": return {
			texto: R.noCreador,
			accion: "volver_abrir"
		};
		case "app_secret_invalido": return {
			texto: R.clave,
			accion: "clave"
		};
		case "cuenta_distinta": return "cuenta_distinta";
		case "sin_internet":
		case "red":
		case "tiktok_no_disponible": return {
			texto: R.internet,
			accion: "reintentar"
		};
		default: return {
			texto: e.mensaje || T.errorGenerico,
			accion: "volver_abrir"
		};
	}
}
function Pasos(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: cx(ajustes_module_default.pasosReauth),
		"aria-label": T.reauth.pasoDe(p.actual),
		children: T.reauth.pasos.map((t, i) => {
			const n = i + 1;
			const estado = n < p.actual ? "hecho" : n === p.actual ? "actual" : "pendiente";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cx(ajustes_module_default.pasoReauth),
				"data-estado": estado,
				"aria-current": estado === "actual" ? "step" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.pasoReauthNumero),
					"aria-hidden": "true",
					children: estado === "hecho" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Check",
						tamano: 14
					}) : n
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ajustes_module_default.pasoReauthTexto),
					children: t
				})]
			}, t);
		})
	});
}
function Cuenta(p) {
	if (!p.cuenta) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.cuentaReauth),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCuenta, {
			url: p.cuenta.avatar,
			username: p.cuenta.username,
			tamano: 40
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(ajustes_module_default.cuentaNombre),
			children: ["@", p.cuenta.username]
		})]
	});
}
/** Contenido del diálogo (exportado para las pruebas: se monta abierto sin depender de la URL). */
function ContenidoReautorizar(p) {
	const cap = useCapacidades();
	const toast = useToast();
	const cred = useConsulta("credenciales", {});
	const [paso, setPaso] = (0, import_react.useState)({
		tipo: "abrir",
		error: null,
		nota: null
	});
	const [valor, setValor] = (0, import_react.useState)("");
	const [clave, setClave] = (0, import_react.useState)("");
	const [trabajando, setTrabajando] = (0, import_react.useState)(false);
	const [ahora, setAhora] = (0, import_react.useState)(ahoraS());
	const tocado = (0, import_react.useRef)(false);
	const vivo = (0, import_react.useRef)(true);
	const canjeando = (0, import_react.useRef)(false);
	const vistaRechazada = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		vivo.current = true;
		return () => {
			vivo.current = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!tocado.current && cred.datos && !cred.datos.app_secret_configurado) setPaso({
			tipo: "clave",
			error: null
		});
	}, [cred.datos]);
	const abrir = async () => {
		tocado.current = true;
		setTrabajando(true);
		try {
			const link = await hub.authLink(true);
			if (!vivo.current) return;
			setValor("");
			vistaRechazada.current = null;
			setPaso({
				tipo: "pegar",
				link,
				error: null,
				detectado: false,
				canjeando: false
			});
		} catch (e) {
			if (vivo.current) setPaso({
				tipo: "abrir",
				error: {
					texto: e instanceof ErrorHub ? e.mensaje : T.reauth.errores.internet,
					accion: null
				},
				nota: null
			});
		} finally {
			if (vivo.current) setTrabajando(false);
		}
	};
	const terminar = (0, import_react.useCallback)(async (resp) => {
		if (resp.confirmar_cuenta) {
			setPaso({
				tipo: "cuenta",
				resp
			});
			return;
		}
		setPaso({
			tipo: "listo",
			resp
		});
		try {
			await hub.sincronizar();
		} catch {}
	}, []);
	const canjear = (0, import_react.useCallback)(async (entrada) => {
		if (canjeando.current) return;
		canjeando.current = true;
		setPaso((x) => x.tipo === "pegar" ? {
			...x,
			canjeando: true,
			detectado: entrada.desde_portapapeles === true,
			error: null
		} : x);
		try {
			const resp = await hub.authCanjear(entrada);
			if (vivo.current) await terminar(resp);
		} catch (e) {
			if (!vivo.current) return;
			const r = errorDeCanje(e);
			if (r === "cuenta_distinta") setPaso({
				tipo: "cambio_cuenta",
				entrada
			});
			else setPaso((x) => x.tipo === "pegar" ? {
				...x,
				canjeando: false,
				detectado: false,
				error: r
			} : x);
		} finally {
			canjeando.current = false;
		}
	}, [terminar]);
	const enPegar = paso.tipo === "pegar";
	const pegarCanjeando = paso.tipo === "pegar" && paso.canjeando;
	(0, import_react.useEffect)(() => {
		if (!enPegar || pegarCanjeando || !cap.portapapeles) return void 0;
		let activo = true;
		const revisar = async () => {
			try {
				const r = await hub.authPortapapeles();
				if (!activo || !vivo.current || !r.detectado) return;
				if (r.state_coincide === false) {
					if (vistaRechazada.current === r.vista_previa) return;
					vistaRechazada.current = r.vista_previa;
					setPaso((x) => x.tipo === "pegar" ? {
						...x,
						error: {
							texto: T.reauth.errores.state,
							accion: "volver_abrir"
						}
					} : x);
					return;
				}
				canjear({ desde_portapapeles: true });
			} catch {}
		};
		const t = setInterval(() => void revisar(), INTERVALO_PORTAPAPELES_MS);
		const alFoco = () => void revisar();
		window.addEventListener("focus", alFoco);
		return () => {
			activo = false;
			clearInterval(t);
			window.removeEventListener("focus", alFoco);
		};
	}, [
		enPegar,
		pegarCanjeando,
		cap.portapapeles,
		canjear
	]);
	const expira = paso.tipo === "pegar" ? paso.link?.expira_at ?? null : null;
	(0, import_react.useEffect)(() => {
		if (expira === null) return void 0;
		const t = setInterval(() => setAhora(ahoraS()), 1e3);
		return () => clearInterval(t);
	}, [expira]);
	const restante = expira === null ? null : expira - ahora;
	const vencido = restante !== null && restante <= 0;
	const conectarManual = () => {
		const r = revisarEnlace(valor);
		if (r === "vacio") return;
		if (r === "cancelado") {
			setPaso((x) => x.tipo === "pegar" ? {
				...x,
				error: {
					texto: T.reauth.errores.cancelado,
					accion: "volver_abrir"
				}
			} : x);
			return;
		}
		if (r === "no_es_enlace") {
			setPaso((x) => x.tipo === "pegar" ? {
				...x,
				error: {
					texto: T.reauth.errores.noEsEnlace,
					accion: null
				}
			} : x);
			return;
		}
		canjear({ url_o_codigo: valor.trim() });
	};
	const pegar = async () => {
		if (cap.portapapeles) try {
			const r = await hub.authPortapapeles();
			if (r.detectado && r.state_coincide !== false) {
				canjear({ desde_portapapeles: true });
				return;
			}
		} catch {}
		try {
			const t = await navigator.clipboard?.readText?.();
			if (t) setValor(t.trim());
		} catch {}
	};
	const guardarClave = async () => {
		const c = clave.trim();
		if (c === "") {
			setPaso({
				tipo: "clave",
				error: T.tiktok.claveVacia
			});
			return;
		}
		setTrabajando(true);
		try {
			await hub.guardarAppSecret(c);
			setClave("");
			tocado.current = true;
			setPaso({
				tipo: "abrir",
				error: null,
				nota: null
			});
		} catch (e) {
			setPaso({
				tipo: "clave",
				error: e instanceof ErrorHub && e.codigo === "app_secret_invalido" ? T.reauth.errores.clave : e instanceof ErrorHub ? e.mensaje : T.errorGenerico
			});
		} finally {
			setTrabajando(false);
		}
	};
	const importarClave = async () => {
		const ruta = await elegirArchivo(T.tiktok.tituloElegir, ["json"]);
		if (!ruta) return;
		setTrabajando(true);
		try {
			const r = await hub.importarCredenciales({ ruta });
			tocado.current = true;
			if (r.conexion.estado === "conectada") {
				toast.mostrar({
					texto: T.tiktok.importado,
					tono: "ok"
				});
				p.alCerrar();
				return;
			}
			setPaso({
				tipo: "abrir",
				error: null,
				nota: null
			});
		} catch (e) {
			setPaso({
				tipo: "clave",
				error: e instanceof ErrorHub ? e.mensaje : T.errorGenerico
			});
		} finally {
			setTrabajando(false);
		}
	};
	const accionError = (a) => {
		if (a === "volver_abrir") abrir();
		else if (a === "clave") setPaso({
			tipo: "clave",
			error: null
		});
		else if (a === "reintentar") conectarManual();
	};
	const etiquetaAccion = (a) => a === "volver_abrir" ? T.reauth.volverAbrir : a === "clave" ? T.tiktok.pegarClave : a === "reintentar" ? T.reauth.reintentar : null;
	if (paso.tipo === "clave") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "clave",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				children: T.reauth.claveTexto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				icono: "Download",
				cargando: trabajando,
				alPulsar: () => void importarClave(),
				children: T.tiktok.importar
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
				etiqueta: T.tiktok.claveEtiqueta,
				valor: clave,
				alCambiar: setClave,
				tipo: "password",
				ayuda: T.tiktok.claveAyuda,
				error: paso.error,
				monoespaciado: true,
				alEnter: () => void guardarClave()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alCerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					cargando: trabajando,
					alPulsar: () => void guardarClave(),
					children: T.guardar
				})]
			})
		]
	});
	if (paso.tipo === "abrir") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pasos, { actual: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				children: T.reauth.abrirTexto
			}),
			paso.nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.notaReauth),
				children: paso.nota
			}) : null,
			paso.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(ajustes_module_default.errorReauth),
				role: "alert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CircleAlert",
					tamano: 16
				}), paso.error.texto]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alCerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ExternalLink",
					cargando: trabajando,
					alPulsar: () => void abrir(),
					children: T.reauth.abrir
				})]
			})
		]
	});
	if (paso.tipo === "pegar") {
		const err = vencido ? {
			texto: T.reauth.errores.vencido,
			accion: "volver_abrir"
		} : paso.error;
		const etiqueta = err ? etiquetaAccion(err.accion) : null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(ajustes_module_default.reauth),
			"data-paso": "2",
			"data-portapapeles": cap.portapapeles ? "vigilando" : "no",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pasos, { actual: 2 }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.parrafo),
					children: T.reauth.pegarTexto
				}),
				paso.link && !paso.link.abierto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.notaReauth),
					children: [
						T.reauth.noAbrio,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							icono: "Copy",
							alPulsar: () => void copiarTexto(paso.link?.url ?? "").then((ok) => {
								if (ok) toast.mostrar({
									texto: T.reauth.enlaceCopiado,
									tono: "ok"
								});
							}),
							children: T.reauth.copiarEnlace
						})
					]
				}) : null,
				paso.detectado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.detectado),
					role: "status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(ajustes_module_default.giradorChico),
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.reauth.detectado }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							alPulsar: () => setPaso({
								...paso,
								detectado: false,
								canjeando: false
							}),
							children: T.cancelar
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.campoEnlace),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
						etiqueta: T.reauth.campo,
						valor,
						alCambiar: setValor,
						placeholder: T.reauth.placeholder,
						tipo: "url",
						monoespaciado: true,
						autoFoco: true,
						alEnter: conectarManual,
						className: cx(ajustes_module_default.campoEnlaceTexto)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						icono: "Copy",
						alPulsar: () => void pegar(),
						className: cx(ajustes_module_default.campoEnlaceBoton),
						children: T.reauth.pegar
					})]
				}),
				err ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.errorReauth),
					role: "alert",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "CircleAlert",
							tamano: 16
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: err.texto }),
						etiqueta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							alPulsar: () => accionError(err.accion),
							children: etiqueta
						}) : null
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(ajustes_module_default.notaReauth),
					children: [cap.portapapeles ? T.reauth.vigilando : null, restante !== null && restante > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(ajustes_module_default.mono),
						children: [" ", T.reauth.caducaEn(cuentaRegresiva(restante))]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(ajustes_module_default.pieReauth),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						alPulsar: p.alCerrar,
						children: T.cancelar
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						cargando: paso.canjeando,
						deshabilitado: revisarEnlace(valor) === "vacio" || vencido,
						alPulsar: conectarManual,
						children: T.reauth.conectar
					})]
				})
			]
		});
	}
	if (paso.tipo === "cambio_cuenta") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "cambio",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.tituloReauth),
				children: T.reauth.cambioTitulo
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				children: T.reauth.cambioTexto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alCerrar,
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "peligro",
					cargando: trabajando,
					alPulsar: () => {
						setTrabajando(true);
						hub.authCanjear({
							...paso.entrada,
							confirmar_cambio_cuenta: true
						}).then((r) => terminar(r)).catch((e) => {
							const r = errorDeCanje(e);
							setPaso({
								tipo: "pegar",
								link: null,
								detectado: false,
								canjeando: false,
								error: r === "cuenta_distinta" ? {
									texto: T.errorGenerico,
									accion: "volver_abrir"
								} : r
							});
						}).finally(() => setTrabajando(false));
					},
					children: T.reauth.cambiar
				})]
			})
		]
	});
	if (paso.tipo === "cuenta") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "eres-tu",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pasos, { actual: 3 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.tituloReauth),
				children: T.reauth.eresTu
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cuenta, { cuenta: paso.resp.cuenta }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				children: T.reauth.eresTuTexto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					cargando: trabajando,
					alPulsar: () => {
						setTrabajando(true);
						hub.authDesconectar({ borrar_datos: true }).catch(() => void 0).finally(() => {
							setTrabajando(false);
							setPaso({
								tipo: "abrir",
								error: null,
								nota: T.reauth.noEraTexto
							});
						});
					},
					children: T.reauth.noSoyYo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					alPulsar: () => {
						setPaso({
							tipo: "listo",
							resp: paso.resp
						});
						hub.sincronizar("completa").catch(() => void 0);
					},
					children: T.reauth.siSoyYo
				})]
			})
		]
	});
	const resp = paso.resp;
	const faltan = resp.conexion.scopes_faltantes;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pasos, { actual: 3 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(ajustes_module_default.listoReauth),
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 48 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(ajustes_module_default.tituloReauth),
					children: resp.cuenta ? T.reauth.listo(resp.cuenta.username) : T.reauth.listoSinNombre
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaChequeo, { items: [...resp.conexion.scopes.map((s) => ({
				id: s,
				texto: textoPermiso(s),
				ok: true
			})), ...faltan.map((s) => ({
				id: s,
				texto: textoPermiso(s),
				ok: false
			}))] }),
			faltan.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.errorReauth),
				children: T.reauth.faltan(listaPermisos(faltan))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(ajustes_module_default.notaReauth),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(ajustes_module_default.giradorChico),
						"aria-hidden": "true"
					}),
					" ",
					T.reauth.sincronizando
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: faltan.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alCerrar,
					children: T.reauth.continuarAsi
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					alPulsar: () => void abrir(),
					children: T.reauth.autorizarTodos
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					alPulsar: p.alCerrar,
					children: T.reauth.terminar
				})
			})
		]
	});
}
/** Android (C35): estado en solo lectura y el texto para reautorizar desde la PC. Sin botón de reautorizar. */
function ContenidoAndroid(p) {
	const sesion = useSesion();
	const c = sesion.datos?.conexion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ajustes_module_default.reauth),
		"data-paso": "android",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cuenta, { cuenta: sesion.datos?.cuenta ?? null }),
			c?.aviso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				children: c.aviso
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(ajustes_module_default.parrafo),
				"data-texto-c35": "",
				children: T.tiktok.androidC35
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(ajustes_module_default.pieReauth),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					alPulsar: p.alCerrar,
					children: T.entendido
				})
			})
		]
	});
}
function DialogoReautorizar() {
	const [param, setParam] = useParametro("reautorizar");
	const android = usePlataforma() === "android";
	const cap = useCapacidades();
	const sesion = useSesion();
	if (!(param === "1")) return null;
	const cerrar = () => setParam(null, { reemplazar: true });
	const soloLectura = android || !cap.auth && sesion.datos?.plataforma === "android";
	const reautorizar = sesion.datos?.conexion.estado === "reautorizar";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: true,
		titulo: soloLectura ? T.reauth.android : reautorizar ? T.reauth.tituloReautorizar : T.reauth.titulo,
		ancho: 560,
		alCerrar: cerrar,
		children: soloLectura ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoAndroid, { alCerrar: cerrar }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoReautorizar, { alCerrar: cerrar })
	});
}
//#endregion
export { DialogoReautorizar, PantallaAjustes };
