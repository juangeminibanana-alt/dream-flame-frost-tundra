import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, K as require_react_dom, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $n as usePanelDisponible, A as EnlaceRuta, B as ICONO_GRUPO, C as ETIQUETA_ETAPA, Dt as atras, En as promesaEnRiesgo, F as Foto, Fn as sumarDias, Gn as useClaseAncho, Gt as epochDeFecha, H as Icono, Hn as useAtajos, It as contarTrabajo, J as Menu, Jt as esPendiente, Ln as textoDatosGuion, M as Esqueleto, Mt as coincide, N as EsqueletoVista, P as EstadoVacio, Pn as sinAcentos, Pt as consultar, Q as OpcionRadio, Qn as useNovedades, Qt as fechaLocalDe, R as Hoja, Rt as copiarTexto, St as ahoraS, Vn as useAcciones, X as Modal, Xn as useListaEstable, Zn as useMetaImagen$1, Zt as etiquetaTipoMuestra, ar as useSesion, cr as useToast, ct as SelectorFecha, d as BotonIcono, dr as vibrar, dt as TONO_GRUPO, er as useParametro, f as BurbujaRecorrido, g as Chip, gn as nuevoId, gt as Ticket, h as Casilla, in as guardarImagen, ir as useRuta, k as EncabezadoPantalla, kn as registrarAtras, lr as validarEtapa, lt as SelectorFechaHora, m as CampoTexto, mn as nombreCorto, mt as Tarjeta, nn as formato, nr as usePrimeraVez, on as hoyLocal, or as useSync, pn as navegar, pt as Tabla, qn as useConsulta, r as AvatarTienda, rn as guardarArchivo, rr as useRecorrido, rt as Pantalla, s as BarraEtapas, st as Segmentado, tr as usePlataforma, u as Boton, v as ChipFiltro, vn as opCambioEtapa, vt as abrirExterno, w as ETIQUETA_GRUPO, yt as abrirTikTok, zt as csvMuestras } from "./app-CLiVRbtG.mjs";
import { C as BotonAccionMuestra, D as TarjetaVentasProducto, E as EditorMensaje, S as ChipsRazones, T as BotonGuardarImagen, _ as ChipCopiadoSinConfirmar, b as ChipTikTok, f as PestanasMuestras, g as ChipAvance, h as FichaPrecio, k as useControlMuestra, m as TarjetaMuestra, o as ListaNotas, p as columnasMuestras, v as ChipPromesa, w as BotonCopiarGuion, x as ChipVitrina } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/muestras-D0A9nVbZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
var plural = (n, uno, varios) => n === 1 ? uno : varios;
/** Espacio duro: la cifra nunca queda sola al final de un renglón («65 / sin envío»). */
var NB = "\xA0";
var T = {
	titulo: "Muestras",
	tituloTodas: "Todas las muestras",
	tituloDetalle: "Muestra",
	contexto: (pendientes, tiendas, entregadas, sinEnvio, nPend, nTiendas, nEnt) => `${pendientes}${NB}${plural(nPend, "pendiente", "pendientes")} de ${tiendas}${NB}${plural(nTiendas, "tienda", "tiendas")} · ${entregadas}${NB}${plural(nEnt, "entregada", "entregadas")} · ${sinEnvio}${NB}sin${NB}envío`,
	/** Celular: solo lo primero (el resto alarga el encabezado a dos renglones y baja la primera muestra). */
	contextoMovil: (pendientes, tiendas, nPend, nTiendas) => `${pendientes}${NB}${plural(nPend, "pendiente", "pendientes")} de ${tiendas}${NB}${plural(nTiendas, "tienda", "tiendas")}`,
	contextoCargando: "Estamos trayendo tus datos de TikTok Shop…",
	teFaltan: (n, cuantos) => ({
		antes: "Te faltan ",
		cifra: n,
		despues: cuantos === 1 ? " video" : " videos"
	}),
	contadorPublicados: (publicadas, total) => `${publicadas} de ${total} videos publicados`,
	tiendasAvisadas: (avisadas, total) => `Tiendas avisadas: ${avisadas} de ${total}`,
	planSin: "Plan: sin plan",
	planCon: (termina, publica) => `Plan: terminas el ${termina} · publicas a más tardar el ${publica}`,
	armarPlan: "Armar mi plan",
	avisarTiendas: "Avisar a mis tiendas",
	empezarSesion: "Empezar sesión de videos",
	sesionCorta: "Sesión de videos",
	rehacerPlan: "Rehacer mi plan",
	masAcciones: "Más acciones",
	buscarEtiqueta: "Buscar muestras",
	cerrarBusqueda: "Cerrar la búsqueda",
	buscarPlaceholder: "Buscar por producto, tienda o variante",
	agruparPor: "Agrupar por",
	agrupar: {
		prioridad: "Prioridad",
		tienda: "Tienda",
		tipo: "Tipo de prenda",
		etapa: "Etapa",
		mes: "Mes de solicitud"
	},
	ordenarEtiqueta: "Ordenar",
	ordenar: {
		sugerido: "Sugerido",
		antiguas: "Más antiguas primero",
		comision: "Más comisión por venta",
		vendidas: "Más vendidas en TikTok Shop",
		precio: "Precio de venta (≈)",
		tienda: "Tienda A–Z"
	},
	ordenActual: (o) => `Orden: ${o}`,
	agruparActual: (a) => `Agrupar por: ${a}`,
	filtrosEtiqueta: "Filtros",
	filtroGrupo: {
		por_vencer: "Por vencer",
		vencida: "Vencidas",
		pausada: "Pausadas",
		en_revision: "En revisión"
	},
	filtroYaLoVendo: "Ya lo vendo",
	filtroEtiquetable: "Se puede etiquetar",
	filtroConPromesa: "Con promesa",
	filtroFijadas: "Fijadas",
	filtrosActivos: (n) => `${n} ${plural(n, "filtro", "filtros")}`,
	limpiar: "Limpiar",
	vistaEtiqueta: "Vista",
	vista: {
		lista: "Lista",
		tabla: "Tabla",
		tablero: "Tablero"
	},
	ordenProvisional: "Orden provisional: faltan tus ventas",
	porQueOrden: "¿Por qué este orden?",
	porQueTexto: "Primero van las muestras que todavía cuentan para TikTok y las que le prometiste a una tienda. Después, las de tiendas con las que ya vendes, los productos que más se venden en TikTok Shop y los que te dejan más comisión. Dentro de cada grupo, las más antiguas primero. Puedes fijar cualquier muestra arriba.",
	pistaOrden: "Primero las tiendas con las que ya vendes",
	entendido: "Entendido",
	ordenNuevo: "Hay un orden nuevo",
	actualizar: "Actualizar",
	ofertaTitulo: "Ya llegaron tus ventas.",
	ofertaPregunta: "¿Reordenamos tu plan para empezar por las tiendas con las que ya vendes?",
	ofertaSinCambioFecha: "Tu fecha de término no cambia.",
	reordenar: "Reordenar",
	dejarAsi: "Dejar así",
	reordenado: "Reordenamos tu cola",
	reordenadoPlan: (n) => `Reordenamos tu plan · ${n} ${plural(n, "video cambió", "videos cambiaron")} de día`,
	deshacer: "Deshacer",
	seccion: {
		vencen_pronto: "Vencen pronto · todavía cuentan para TikTok",
		promesas_vencidas: "Promesas vencidas · le diste una fecha a la tienda y ya pasó",
		en_revision: "En revisión de TikTok",
		alta: "Prioridad alta",
		media: "Prioridad media",
		baja: "Prioridad baja",
		falta_avisar: "Falta avisar a la tienda",
		no_etiquetar: "No se pueden etiquetar",
		pausadas: "Pausadas",
		no_hacer: "Decidiste no hacerlas"
	},
	sinFechaSolicitud: "Sin fecha de solicitud",
	sinCategoria: "Sin tipo de prenda",
	prepararMensaje: (tienda) => `Preparar mensaje · ${tienda}`,
	mostrarSeccion: (titulo) => `Mostrar ${titulo}`,
	ocultarSeccion: (titulo) => `Ocultar ${titulo}`,
	posicion: (n) => `Nº ${n} en tu cola`,
	listaEtiqueta: "Cola de muestras pendientes",
	tablaEtiqueta: "Muestras pendientes",
	tableroEtiqueta: "Tablero de muestras por etapa",
	columnaVacia: "Nada aquí todavía",
	soltarAqui: "Suelta aquí",
	seleccionadas: (n) => `${n} ${plural(n, "seleccionada", "seleccionadas")}`,
	planearVarias: "Planear…",
	cambiarEtapa: "Cambiar etapa",
	avisarEstas: "Avisar a estas tiendas",
	quitarSeleccion: "Quitar selección",
	seleccionar: "Seleccionar",
	hojaPlanearTitulo: "¿Qué día haces estos videos?",
	hojaPlanearEtiqueta: "Día de los videos",
	hoy: "Hoy",
	manana: "Mañana",
	planearN: (n) => `Planear ${n} ${plural(n, "video", "videos")}`,
	riesgoPromesa: (n) => `Esto pasa ${n} ${plural(n, "muestra", "muestras")} después de lo que le prometiste a la tienda.`,
	planeadas: (n, fecha) => `${n} ${plural(n, "muestra planeada", "muestras planeadas")} para el ${fecha}`,
	hojaEtapaTitulo: "Cambiar etapa",
	hojaEtapaEtiqueta: "Nueva etapa",
	aplicar: "Aplicar",
	cancelar: "Cancelar",
	etapaCambiada: (n, etapa) => `${n} ${plural(n, "muestra", "muestras")} en «${etapa}»`,
	noSePudo: "No pudimos guardar el cambio. Inténtalo de nuevo.",
	alDiaTitulo: "¡Estás al día con tus muestras!",
	alDiaTexto: "No tienes videos pendientes. Te avisaremos antes de que venza cualquier muestra nueva.",
	verHistorial: "Ver historial",
	ticketAlDiaTitulo: "Al día",
	ticketAlDiaSub: "Tus muestras",
	ticketPublicados: "Videos publicados",
	ticketTiendas: "Tiendas avisadas",
	ticketTotal: (videos, tiendas) => `${videos} videos · ${tiendas} tiendas`,
	sinResultadosTitulo: "Ninguna muestra coincide con estos filtros",
	limpiarFiltros: "Limpiar filtros",
	nuncaTitulo: "Todavía no hay muestras",
	nuncaTexto: "Si ya pediste muestras en TikTok Shop, sincroniza para traerlas.",
	sincronizarAhora: "Sincronizar ahora",
	errorConCache: (fecha) => `No pudimos actualizar tus muestras. Te mostramos las del ${fecha}.`,
	reintentar: "Reintentar",
	errorTitulo: "No pudimos mostrar tus muestras",
	errorTexto: "Revisa tu conexión e inténtalo de nuevo.",
	necesitaPcTitulo: "Necesita tu PC encendida",
	necesitaPcTexto: "Abre Corte en tu PC y conecta este celular al mismo Wi‑Fi para ver esta información.",
	cargandoLento: "Sigue cargando… revisa tu conexión",
	cerrar: "Cerrar",
	expandir: "Abrir en página completa",
	volverMuestras: "Muestras",
	atras: "Atrás",
	noEncontradaTitulo: "No encontramos esta muestra",
	noEncontradaTexto: "Puede que ya no esté en TikTok Shop o que todavía no se sincronice.",
	volverALaCola: "Volver a Muestras",
	variante: (v) => `Variante: ${v}`,
	verTituloCompleto: "Ver título completo",
	ocultarTituloCompleto: "Ocultar título completo",
	editarNombre: "Editar nombre corto",
	nombrePlaceholder: "Un nombre que reconozcas rápido",
	nombreEtiqueta: "Nombre corto",
	guardar: "Guardar",
	nombreGuardado: "Nombre corto guardado",
	vendidosGlobal: (n) => `${n} vendidos en TikTok Shop (todas las cuentas)`,
	verTienda: "Ver tienda",
	abrirTikTokAndroid: "Abrir en la app de TikTok",
	abrirTikTokWindows: "Abrir en TikTok Shop",
	avisar: "Avisar",
	avisarTienda: "Avisar a la tienda",
	tiktokDice: "TikTok dice",
	explicacion: {
		vencida: "TikTok ya cerró esta muestra como incumplida. Publicar el video y avisarle a la tienda sigue ayudando a tu relación con ella.",
		por_vencer: (fecha) => `Tienes hasta el ${fecha} para publicar un video que etiquete este producto. Después, TikTok la marcará como incumplida.`,
		en_revision: "Publicaste un video y TikTok lo está revisando. Por ahora no tienes que hacer nada.",
		entregada: "TikTok confirmó tu video. ¡Cumpliste con esta tienda!",
		exenta: "TikTok te liberó de publicar un video para esta muestra.",
		pausada: "El plazo está en pausa porque el producto no se puede promocionar por ahora.",
		esperando_aprobacion: "La tienda todavía no aprueba tu solicitud. TikTok no informa más detalles.",
		en_camino: "La tienda aprobó tu solicitud. La muestra todavía no llega.",
		pedido_cancelado: "La tienda aprobó tu solicitud, pero el pedido de la muestra se canceló. No le debes video.",
		sin_envio_tienda: "La tienda no te envió esta muestra a tiempo. No le debes nada.",
		sin_envio: "Esta muestra no tiene envío. No le debes video."
	},
	datoSolicitada: "Solicitada",
	solicitadaValor: (fecha, hace) => `${fecha} (${hace})`,
	solicitadaPorVerificar: "fecha por verificar",
	datoVence: "Vence",
	datoRecibida: "Recibida (aprox.)",
	datoTipo: "Tipo",
	datoProducto: "Producto",
	seEtiqueta: "Se puede etiquetar",
	noSeEtiqueta: "No se puede etiquetar",
	datoEstado: "Estado",
	tuAvance: "Tu avance",
	promesa: (fecha) => `Le prometiste publicar a más tardar el ${fecha}`,
	pasoFecha: (fecha) => fecha,
	confirmadoTikTok: "Confirmado por TikTok",
	paraTuVideo: "Para tu video",
	verDescripcion: "Ver descripción del producto",
	ocultarDescripcion: "Ocultar descripción del producto",
	estaTienda: "Esta tienda contigo",
	comisionTienda: "comisión con la tienda",
	videosProducto: "videos tuyos lo venden",
	sinVideoTienda: "muestras sin video",
	mensajeTienda: "Mensaje a la tienda",
	unSoloMensaje: (tienda, n) => `${tienda} tiene ${n} muestras pendientes. ¿Un solo mensaje para ${n === 2 ? "las dos" : `las ${n}`}?`,
	siUnMensaje: "Sí, un mensaje",
	soloEsta: "Solo esta",
	avisosEnviados: "Avisos enviados",
	avisoLinea: (fecha, plantilla) => `${fecha} · ${plantilla}`,
	avisoPromesa: (fecha) => `le prometiste el ${fecha}`,
	avisoCopiado: "Mensaje copiado · sin confirmar",
	quitarAviso: "Quitar este aviso",
	avisoQuitado: "Aviso quitado",
	opcionesAviso: "Opciones del aviso",
	notas: "Notas",
	recordatorios: "Recordatorios",
	sinRecordatorios: "Sin recordatorios para esta muestra.",
	agregarRecordatorio: "Agregar recordatorio",
	cuandoRecordatorio: "¿Cuándo te lo recordamos?",
	tituloRecordatorio: (nombre) => `Video de ${nombre}`,
	recordatorioCreado: "Recordatorio guardado",
	recordatorioListo: "Marcar como hecho",
	recordatorioHecho: "Recordatorio hecho",
	recordatorioVence: (cuando) => `Te lo recordamos el ${cuando}`,
	plan: "Tu plan para este video",
	planLinea: (estado, fecha) => fecha ? `${estado} · ${fecha}` : estado,
	historial: "Historial",
	sinHistorial: "Sin cambios de TikTok todavía.",
	campoHistorial: {
		estado_api: "Estado de la muestra",
		cumplimiento: "Cumplimiento",
		clase: "Clasificación"
	},
	otrasTienda: (tienda) => `Otras muestras de ${tienda}`,
	datosTecnicos: "Datos técnicos",
	idSolicitud: "ID de la solicitud",
	idProducto: "ID del producto",
	categoria: "Categoría",
	enlaceProducto: "Enlace del producto",
	filtros: "Filtros que la devolvieron",
	estadoApi: "Estado en TikTok",
	ultimaActualizacion: "Última actualización de TikTok",
	hoyHora: (hora) => `hoy, ${hora}`,
	sinActualizar: "Todavía no se sincroniza",
	copiar: "Copiar",
	copiado: "Copiado",
	conflicto: "Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.",
	ver: "Ver",
	ocultar: "Ocultar",
	versionPc: "Versión que quedó en tu PC",
	datosCopia: (fecha) => `Datos de tu última copia · ${fecha}`,
	menuVideoListo: "Video listo",
	menuPlanear: "Planear",
	menuMover: "Mover a otro día",
	menuNoPuedo: "No puedo hacer este video",
	menuFijar: "Fijar arriba",
	menuQuitarFijar: "Quitar de arriba",
	menuVerTienda: "Ver tienda",
	menuVincular: "Vincular un video",
	grupoPlural: {
		vencida: "Vencidas",
		entregada: "Entregadas",
		exenta: "Exentas",
		sin_envio: "Sin envío",
		por_vencer: "Por vencer",
		en_revision: "En revisión",
		pausada: "Pausadas",
		esperando_aprobacion: "Esperando aprobación",
		en_camino: "En camino",
		pedido_cancelado: "Pedido de muestra cancelado"
	},
	contextoTodas: (n, tiendas, nTiendas) => `${n}${NB}solicitudes de ${tiendas}${NB}${plural(nTiendas, "tienda", "tiendas")}`,
	contextoFiltrado: (n, total) => `${n} de ${total}${NB}solicitudes`,
	sinEnvioTexto: (a, b, c, d) => `No debes nada de estas: TikTok no informa un pedido de muestra (${a}), la tienda la rechazó (${b}), no la envió a tiempo (${c}) o retiraste la solicitud (${d}).`,
	exportarCsv: "Exportar CSV",
	incluirLocal: "Incluir mis notas, mi avance y mis avisos",
	csvGuardado: "Guardamos tu archivo CSV",
	csvCompartido: "Listo: elige dónde compartir tu archivo",
	csvError: "No pudimos guardar el archivo. Inténtalo de nuevo.",
	nombreCsv: (hoy) => `corte-muestras-${hoy}.csv`,
	todasEtiqueta: "Historial de muestras",
	mostrando: (n, total) => `Mostrando ${n} de ${total}`,
	mostrarMas: "Mostrar más",
	gruposEtiqueta: "Estado en TikTok",
	ordenarYAgrupar: "Ordenar y agrupar",
	detalleEtiqueta: "Detalle de la muestra",
	accionesMuestra: "Acciones de la muestra",
	guardarImagen: "Guardar imagen del producto",
	copiarGuion: "Copiar datos para tu guion",
	guionCopiado: "Datos copiados · pégalos en tu herramienta",
	noSePudoCopiar: "No pudimos copiar. Inténtalo de nuevo.",
	agregarNota: "Agregar nota",
	irANotas: "Ir a notas",
	datoEtapa: "Etapa",
	datoPlaneada: "Planeada para",
	decidisteNo: "Decidiste no hacer este video. Puedes regresarla a tu cola cuando quieras.",
	etapas: "Etapas de tu avance",
	vendidosGlobalCorto: "vendidos en TikTok Shop",
	pedidosTienda: "pedidos con la tienda",
	porMiCuenta: "Por mi cuenta",
	plantillas: {
		disculpa_y_fecha: "Disculpa y fecha",
		varias_muestras: "Varias muestras",
		nueva_fecha: "Nueva fecha",
		ya_publique: "Ya publiqué",
		ya_tengo_video: "Ya tengo video",
		producto_no_disponible: "Producto no disponible",
		no_me_llego_completa: "No me llegó completa",
		prefiero_otro_producto: "Prefiero otro producto",
		disculpa_sin_fecha: "Disculpa sin fecha",
		ya_la_recibi: "Ya la recibí",
		gracias_por_las_ventas: "Gracias por las ventas"
	}
};
var AGRUPACIONES = [
	"prioridad",
	"tienda",
	"tipo",
	"etapa",
	"mes"
];
var ORDENES = [
	"sugerido",
	"antiguas",
	"comision",
	"vendidas",
	"precio",
	"tienda"
];
var VISTAS = [
	"lista",
	"tabla",
	"tablero"
];
/** Grupos de TikTok que pueden filtrarse en Pendientes (01 §4.2 «Estado en TikTok»). */
var GRUPOS_FILTRO = [
	"por_vencer",
	"vencida",
	"pausada",
	"en_revision"
];
var FILTROS_VACIOS = {
	q: "",
	grupos: [],
	yaLoVendo: false,
	etiquetable: false,
	conPromesa: false,
	fijadas: false
};
/** Cuántos filtros hay activos (la búsqueda cuenta como uno). */
function contarFiltros(f) {
	return (f.q.trim() ? 1 : 0) + (f.grupos.length > 0 ? 1 : 0) + [
		f.yaLoVendo,
		f.etiquetable,
		f.conPromesa,
		f.fijadas
	].filter(Boolean).length;
}
function nombreDe(m) {
	return m.producto.titulo_corto ?? m.producto.titulo ?? `Producto ${formato.idCorto(m.producto.product_id)}`;
}
function filtrar(muestras, f) {
	const q = f.q.trim();
	return muestras.filter((m) => {
		if (q && !coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante)) return false;
		if (f.grupos.length > 0 && !f.grupos.includes(m.grupo)) return false;
		if (f.yaLoVendo && !m.razones.includes("ya_lo_vendes") && m.ventas_producto.pedidos_validos <= 0) return false;
		if (f.etiquetable && m.prioridad === "no_se_puede_etiquetar") return false;
		if (f.conPromesa && m.avisos.promesa === null) return false;
		if (f.fijadas && !m.avance.fijada) return false;
		return true;
	});
}
var nulosAlFinal = (a, b, desc) => {
	if (a === null && b === null) return 0;
	if (a === null) return 1;
	if (b === null) return -1;
	return desc ? b - a : a - b;
};
/** Orden estable. 'sugerido' conserva el orden recibido (la cola del hub, ya estabilizada) con las fijadas arriba. */
function ordenar(muestras, orden) {
	const indice = new Map(muestras.map((m, i) => [m.application_id, i]));
	const desempate = (a, b) => (indice.get(a.application_id) ?? 0) - (indice.get(b.application_id) ?? 0);
	const f = {
		sugerido: (a, b) => Number(b.avance.fijada) - Number(a.avance.fijada),
		antiguas: (a, b) => (a.solicitada_at ?? -Infinity) - (b.solicitada_at ?? -Infinity),
		comision: (a, b) => nulosAlFinal(a.producto.comision_por_venta_centavos, b.producto.comision_por_venta_centavos, true),
		vendidas: (a, b) => nulosAlFinal(a.producto.unidades_vendidas_global, b.producto.unidades_vendidas_global, true),
		precio: (a, b) => nulosAlFinal(a.producto.precio_venta_min_centavos, b.producto.precio_venta_min_centavos, true),
		tienda: (a, b) => a.tienda.nombre.localeCompare(b.tienda.nombre, "es-MX", { sensitivity: "base" })
	}[orden];
	return [...muestras].sort((a, b) => f(a, b) || desempate(a, b));
}
/** Publicada sin un aviso posterior a la publicación (01 §2.5 «Falta avisar»). */
function faltaAvisar(m) {
	if (m.avance.etapa !== "publicada") return false;
	const publicada = m.avance.fecha_publicada;
	const ultimo = m.avisos.ultimo_enviado_at;
	if (ultimo === null) return true;
	return publicada !== null && ultimo < epochDeFecha(publicada);
}
/** Sección de 01 §4.2 a la que pertenece una muestra con la agrupación por prioridad (gana la primera regla). */
function seccionPrioridad(m, prioridad = m.prioridad) {
	if (m.avance.etapa === "no_se_puede") return "no_hacer";
	if (faltaAvisar(m)) return "falta_avisar";
	if (m.grupo === "en_revision") return "en_revision";
	if (!esPendiente(m)) return null;
	if (m.grupo === "por_vencer") return "vencen_pronto";
	if (m.avisos.promesa_vencida) return "promesas_vencidas";
	if (m.grupo === "pausada") return "pausadas";
	if (prioridad === "no_se_puede_etiquetar") return "no_etiquetar";
	if (prioridad === "media") return "media";
	if (prioridad === "baja") return "baja";
	return "alta";
}
var ORDEN_SECCIONES = [
	"vencen_pronto",
	"promesas_vencidas",
	"en_revision",
	"alta",
	"media",
	"baja",
	"falta_avisar",
	"no_etiquetar",
	"pausadas",
	"no_hacer"
];
var TIPO_SECCION = {
	vencen_pronto: "trabajo",
	promesas_vencidas: "promesas",
	en_revision: "informativa",
	alta: "trabajo",
	media: "trabajo",
	baja: "trabajo",
	falta_avisar: "trabajo",
	no_etiquetar: "etiquetar",
	pausadas: "trabajo",
	no_hacer: "resuelta"
};
/** Diccionario local de categorías frecuentes que llegan en inglés (01 §4.2). Lo desconocido se muestra tal cual. */
var DICCIONARIO_CATEGORIAS = {
	"men's wallets": "Carteras de hombre",
	"men's boots": "Botas de hombre",
	"men's t-shirts": "Camisetas",
	"men's shirts": "Camisas",
	"men's vests": "Chalecos",
	"men's hoodies & sweatshirts": "Sudaderas",
	"men's underwear": "Ropa interior",
	"men's jeans": "Jeans",
	"men's pants": "Pantalones",
	"men's sneakers": "Tenis",
	"men's coats & jackets": "Chamarras y abrigos"
};
/** Tipo de prenda = hoja de la categoría ('A > B > Camisetas' → 'Camisetas'), traducida si está en el diccionario. */
function tipoDePrenda(categoria) {
	if (!categoria) return T.sinCategoria;
	const hoja = categoria.split(">").map((s) => s.trim()).filter(Boolean).pop() ?? categoria.trim();
	return DICCIONARIO_CATEGORIAS[hoja.toLowerCase()] ?? hoja;
}
function agruparEn(muestras, clave, titulo, prefijo) {
	const mapa = /* @__PURE__ */ new Map();
	for (const m of muestras) {
		const k = clave(m);
		const l = mapa.get(k);
		if (l) l.push(m);
		else mapa.set(k, [m]);
	}
	return [...mapa.entries()].map(([k, l]) => ({
		id: `${prefijo}:${k}`,
		titulo: titulo(k),
		muestras: l,
		colapsadaPorOmision: false,
		tipo: "trabajo"
	}));
}
var ETAPAS_TRABAJO = [
	"por_planear",
	"planeada",
	"video_listo",
	"programada"
];
/**
* Secciones visibles. `prioridades` = prioridad «aceptada» por fila (la de la última vez que el usuario vio el orden):
* así una sincronización que cambia la prioridad no mueve filas de sección por su cuenta (01 §4.16).
*/
function seccionar(muestras, agrupar, etiquetaEtapa, prioridades) {
	const prio = (m) => prioridades?.has(m.application_id) ? prioridades.get(m.application_id) ?? null : m.prioridad;
	if (agrupar === "prioridad") {
		const porSeccion = /* @__PURE__ */ new Map();
		for (const m of muestras) {
			const s = seccionPrioridad(m, prio(m));
			if (s === null) continue;
			const l = porSeccion.get(s);
			if (l) l.push(m);
			else porSeccion.set(s, [m]);
		}
		return ORDEN_SECCIONES.filter((s) => (porSeccion.get(s)?.length ?? 0) > 0).map((s) => ({
			id: s,
			titulo: T.seccion[s],
			muestras: porSeccion.get(s) ?? [],
			colapsadaPorOmision: s === "no_hacer",
			tipo: TIPO_SECCION[s]
		}));
	}
	const trabajo = muestras.filter((m) => esPendiente(m) || m.grupo === "en_revision");
	const resto = muestras.filter((m) => !trabajo.includes(m));
	let grupos;
	if (agrupar === "tienda") grupos = agruparEn(trabajo, (m) => m.tienda.nombre, (k) => k, "tienda");
	else if (agrupar === "tipo") grupos = agruparEn(trabajo, (m) => tipoDePrenda(m.producto.categoria), (k) => k, "tipo");
	else if (agrupar === "mes") {
		const claveMes = (m) => m.solicitada_at === null ? "" : fechaLocalDe(m.solicitada_at).slice(0, 7);
		grupos = agruparEn(trabajo, claveMes, (k) => k === "" ? T.sinFechaSolicitud : tituloMes(k), "mes");
		grupos.sort((a, b) => a.id.localeCompare(b.id));
	} else grupos = ETAPAS_TRABAJO.map((e) => ({
		id: `etapa:${e}`,
		titulo: etiquetaEtapa[e],
		muestras: trabajo.filter((m) => m.avance.etapa === e),
		colapsadaPorOmision: false,
		tipo: "trabajo"
	})).filter((s) => s.muestras.length > 0);
	const fin = seccionar(resto, "prioridad", etiquetaEtapa, prioridades).filter((s) => s.id === "falta_avisar" || s.id === "no_hacer");
	return [...grupos, ...fin];
}
var MESES = [
	"enero",
	"febrero",
	"marzo",
	"abril",
	"mayo",
	"junio",
	"julio",
	"agosto",
	"septiembre",
	"octubre",
	"noviembre",
	"diciembre"
];
/** '2026-09' → 'Septiembre 2026'. */
function tituloMes(aaaamm) {
	const [a, m] = aaaamm.split("-");
	const nombre = MESES[Number(m) - 1] ?? aaaamm;
	return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${a ?? ""}`.trim();
}
function estadoPlan(muestras, hoy) {
	const conFecha = muestras.filter((m) => esPendiente(m) && m.avance.fecha_planeada !== null && m.avance.etapa !== "por_planear");
	const fechas = conFecha.map((m) => m.avance.fecha_planeada).filter((f) => f !== null).sort();
	const termina = fechas.length > 0 ? fechas[fechas.length - 1] ?? null : null;
	return {
		hayPlan: conFecha.length > 0,
		termina,
		publica: termina ? sumarDias(termina, 2) : null,
		paraHoy: conFecha.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada === hoy).length
	};
}
/** Una sola acción principal (01 §4.2): sin plan → Armar mi plan; con tiendas por avisar → Avisar; si no, Sesión. */
function accionPrincipalCola(plan, tiendasPorAvisar, pendientes) {
	if (pendientes === 0) return null;
	if (!plan.hayPlan) return "armar_plan";
	if (tiendasPorAvisar > 0) return "avisar";
	return plan.paraHoy > 0 ? "sesion" : "armar_plan";
}
function pasoOrdenes(e) {
	return e.pasos.find((p) => p.paso === "ordenes");
}
var TERMINADO = /* @__PURE__ */ new Set(["ok", "parcial"]);
/** Primera sincronización = nunca ha terminado una con éxito (ni según la sesión ni según el último SyncEstado). */
function esPrimeraSync(ultimaOkSesion, e) {
	return (ultimaOkSesion ?? null) === null && (e?.ultima_ok_at ?? null) === null;
}
/** ¿Faltan aún las ventas de 180 días de la PRIMERA sincronización? («Orden provisional: faltan tus ventas»). */
function faltanVentas(e, primeraSync) {
	if (!e || !e.en_curso || !primeraSync) return false;
	const p = pasoOrdenes(e);
	return p !== void 0 && !TERMINADO.has(p.estado) && p.estado !== "omitido";
}
/**
* ¿Ya pasó el punto de control 2 de la PRIMERA sincronización? Sí mientras esa sincronización sigue en curso y su paso
* 'ordenes' (ventas de 180 días) ya terminó (ok o parcial). Al terminar la primera sincronización la ventana se cierra:
* la oferta «¿Reordenamos tu plan?» es de ese momento (01 §4.5 regla 6) y no se arrastra a sincronizaciones posteriores.
*/
function pasoPuntoControl2(e, primeraSync) {
	if (!e || !e.en_curso || !primeraSync) return false;
	const p = pasoOrdenes(e);
	return p !== void 0 && TERMINADO.has(p.estado);
}
/** Avisos «enviados» (no quitados): con alguno, la oferta de reordenar ya no se ofrece (01 §4.5 regla 6). */
function hayAvisosEnviados(avisos) {
	return avisos.some((a) => a.marcado_enviado_at !== null && a.quitado_at === null);
}
/**
* Reacomoda el plan existente al orden nuevo SIN cambiar la fecha de término: se toman las fechas de las planeadas que
* se pueden mover (no fijadas y sin promesa), se ordenan, y se reparten en el orden nuevo de la cola. Solo devuelve
* las ediciones que cambian algo (un solo lote, un solo Deshacer).
*/
function opsReordenarPlan(enOrdenNuevo) {
	const movibles = enOrdenNuevo.filter((m) => esPendiente(m) && m.avance.etapa === "planeada" && m.avance.plan_id !== null && m.avance.fecha_planeada !== null && !m.avance.fijada && m.avisos.promesa === null);
	const fechas = movibles.map((m) => m.avance.fecha_planeada).filter((f) => f !== null).sort();
	const ops = [];
	movibles.forEach((m, i) => {
		const nueva = fechas[i];
		if (nueva === void 0 || nueva === m.avance.fecha_planeada || m.avance.plan_id === null) return;
		ops.push({
			tipo: "plan.editar",
			id: m.avance.plan_id,
			cambios: {
				fecha_plan: nueva,
				rev: m.avance.rev
			}
		});
	});
	return ops;
}
/** Conteo por grupo de TikTok (chips de filtro y de Todas: solo se muestran los que tienen más de 0). */
function contarPorGrupo(muestras) {
	const r = {};
	for (const m of muestras) r[m.grupo] = (r[m.grupo] ?? 0) + 1;
	return r;
}
var ORDEN_PASOS = [
	"por_planear",
	"planeada",
	"video_listo",
	"programada",
	"publicada"
];
/**
* Pasos de «Tu avance» (01 §4.3): Por planear → Planeada → Video listo → (Programada) → Publicada, con la fecha en los
* completados. Programada solo aparece si la preferencia está encendida o la muestra ya la usó (01 §2.4).
*/
function pasosAvance(m, programoMisVideos, plan) {
	const conProgramada = programoMisVideos || m.avance.etapa === "programada" || m.avance.programada_para_at !== null;
	const etapas = ORDEN_PASOS.filter((e) => e !== "programada" || conProgramada);
	const actual = etapas.indexOf(m.avance.etapa);
	const fechaDe = (e) => {
		if (e === "planeada") return m.avance.fecha_planeada ?? plan?.fecha_plan ?? null;
		if (e === "video_listo") return plan?.fecha_video_listo ?? null;
		if (e === "programada") return m.avance.programada_para_at ?? plan?.programada_para_at ?? null;
		if (e === "publicada") return m.avance.fecha_publicada ?? plan?.fecha_publicada ?? null;
		return null;
	};
	return etapas.map((e, i) => ({
		etapa: e,
		hecho: actual >= 0 && i <= actual,
		actual: i === actual,
		fecha: actual >= 0 && i <= actual && i > 0 ? fechaDe(e) : null
	}));
}
/** El PlanVideo vivo de la muestra (el que guarda su avance), si llegó en el detalle. */
function planVivo(m, planes) {
	if (m.avance.plan_id) return planes.find((p) => p.id === m.avance.plan_id) ?? null;
	return planes.find((p) => p.application_id === m.application_id) ?? null;
}
/** «Recibida (aprox.)»: solo en abiertas (01 §4.3): fecha límite − 14 días (sin la pausa: MuestraVista no la trae). */
function recibidaAprox(m) {
	if (m.fecha_limite_at === null || m.grupo !== "por_vencer" && m.grupo !== "en_revision") return null;
	return sumarDias(fechaLocalDe(m.fecha_limite_at), -14);
}
/** Otras pendientes de la misma tienda (para «¿Un solo mensaje para las dos?»), en el orden de la cola. */
function pendientesDeTienda(m, cola) {
	return cola.filter((x) => x.tienda.tienda_key === m.tienda.tienda_key && (esPendiente(x) || x.application_id === m.application_id));
}
/** Avisos enviados que siguen contando (no quitados), del más reciente al más antiguo. */
function avisosEnviados(avisos) {
	return avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null).sort((a, b) => (b.marcado_enviado_at ?? 0) - (a.marcado_enviado_at ?? 0));
}
var ORDEN_GRUPOS_TODAS = [
	"vencida",
	"entregada",
	"exenta",
	"sin_envio",
	"por_vencer",
	"en_revision",
	"pausada",
	"esperando_aprobacion",
	"en_camino",
	"pedido_cancelado"
];
/** Desglose del texto de «Sin envío»: sin pedido · rechazada · no la envió · retirada. */
function desgloseSinEnvio(muestras) {
	const s = muestras.filter((m) => m.grupo === "sin_envio");
	return {
		sinPedido: s.filter((m) => m.subestado === "sin_respuesta" || m.subestado === "esperando_respuesta").length,
		rechazada: s.filter((m) => m.subestado === "rechazada").length,
		noEnvio: s.filter((m) => m.subestado === "tienda_no_envio").length,
		retirada: s.filter((m) => m.subestado === "retirada").length
	};
}
/** Orden ordinal de «Tu avance» para ordenar la columna (no alfabético). */
var ORDEN_ETAPAS_TABLA = [
	"por_planear",
	"planeada",
	"video_listo",
	"programada",
	"publicada",
	"no_se_puede"
];
/** Valor para ordenar una columna de Todas por su id (columnasMuestras('todas') de @/bloques). */
function valorColumna(m, columna) {
	const id = columna.toLowerCase();
	if (id.includes("solicit")) return m.solicitada_at;
	if (id.includes("comision")) return m.producto.comision_por_venta_centavos;
	if (id.includes("precio")) return m.producto.precio_venta_min_centavos;
	if (id.includes("tienda")) return m.tienda.nombre.toLowerCase();
	if (id.includes("variante")) return (m.variante ?? "").toLowerCase();
	if (id.includes("vend")) return m.ventas_producto.pedidos_validos;
	if (id.includes("avance") || id.includes("etapa")) return ORDEN_ETAPAS_TABLA.indexOf(m.avance.etapa);
	if (id.includes("promesa")) return m.avisos.promesa;
	if (id.includes("estado") || id.includes("grupo") || id.includes("tiktok")) return m.grupo;
	if (id.includes("producto") || id.includes("nombre")) return nombreDe(m).toLowerCase();
	return null;
}
function ordenarPorColumna(muestras, columna, direccion) {
	const signo = direccion === "asc" ? 1 : -1;
	return [...muestras].map((m, i) => ({
		m,
		i,
		v: valorColumna(m, columna)
	})).sort((a, b) => {
		if (a.v === b.v) return a.i - b.i;
		if (a.v === null) return 1;
		if (b.v === null) return -1;
		return (typeof a.v === "number" && typeof b.v === "number" ? a.v - b.v : String(a.v).localeCompare(String(b.v), "es-MX")) * signo || a.i - b.i;
	}).map((x) => x.m);
}
/**
* «Filtros y agrupación se recuerdan por dispositivo» (01 §4.2): vista, agrupación, orden y filtros de la cola en
* localStorage, siempre con try/catch (ventana privada o almacenamiento bloqueado → solo en memoria).
*/
var CLAVE = "corte.muestras.cola.v1";
var PREFERENCIAS_INICIALES = {
	vista: null,
	agrupar: "prioridad",
	orden: "sugerido",
	filtros: FILTROS_VACIOS
};
var esUno = (lista, v) => typeof v === "string" && lista.includes(v);
function leerPreferencias() {
	try {
		const crudo = window.localStorage.getItem(CLAVE);
		if (!crudo) return PREFERENCIAS_INICIALES;
		const v = JSON.parse(crudo);
		if (v === null || typeof v !== "object") return PREFERENCIAS_INICIALES;
		const o = v;
		const f = o["filtros"] ?? {};
		const grupos = Array.isArray(f["grupos"]) ? f["grupos"].filter((g) => esUno(GRUPOS_FILTRO, g)) : [];
		return {
			vista: esUno(VISTAS, o["vista"]) ? o["vista"] : null,
			agrupar: esUno(AGRUPACIONES, o["agrupar"]) ? o["agrupar"] : "prioridad",
			orden: esUno(ORDENES, o["orden"]) ? o["orden"] : "sugerido",
			filtros: {
				...FILTROS_VACIOS,
				grupos,
				yaLoVendo: f["yaLoVendo"] === true,
				etiquetable: f["etiquetable"] === true,
				conPromesa: f["conPromesa"] === true,
				fijadas: f["fijadas"] === true
			}
		};
	} catch {
		return PREFERENCIAS_INICIALES;
	}
}
function guardarPreferencias(p) {
	try {
		window.localStorage.setItem(CLAVE, JSON.stringify({
			...p,
			filtros: {
				...p.filtros,
				q: ""
			}
		}));
	} catch {}
}
/** Estado de la barra de herramientas que se guarda solo en cada cambio. */
function usePreferenciasCola() {
	const [p, setP] = (0, import_react.useState)(leerPreferencias);
	return [p, (0, import_react.useCallback)((cambio) => {
		setP((previo) => {
			const siguiente = {
				...previo,
				...cambio
			};
			guardarPreferencias(siguiente);
			return siguiente;
		});
	}, [])];
}
/**
* Columnas de las tablas de Muestras que CABEN en el ancho disponible (Windows, 02 §7.5). columnasMuestras() de
* @/bloques da la lista completa de cada contexto, con anchos pensados para una ventana amplia: todas juntas no caben
* en la tabla de 968 px (ventana de 1280) ni en la de 816 (ventana mínima de 960) y, sin mínimos, sus columnas «fr»
* quedaban en 0 px. Aquí, sin tocar las celdas:
*   - cada columna cuenta con su mínimo: el px fijo, el de un minmax(<mín>px, …) o, si llega un «fr» pelón, uno
*     legible (Producto 208–220 px, el resto 110–150 px) que se escribe como minmax(<mín>px, <n>fr);
*   - si la suma de mínimos no cabe, se quitan columnas secundarias en un orden fijo (las prescindibles primero);
*   - si ni así caben, `caben` = false y la vista usa tarjetas (TarjetaMuestra) en lugar de la tabla.
* Funciona con cualquier lista: lo que no reconoce se trata por su `ancho` y su bandera `prescindible`.
*/
var ES_FR = /^\s*(\d+(?:\.\d+)?)fr\s*$/;
function minimoDe(c, primeraFr, ajuste) {
	const fijo = ajuste.anchos?.[c.id];
	if (fijo !== void 0) return fijo;
	const ancho = ajuste.pistas?.[c.id] ?? c.ancho;
	if (typeof ancho === "number") return ancho;
	if (typeof ancho === "string") {
		if (ES_FR.test(ancho)) return ajuste.minimos?.[c.id] ?? (primeraFr ? 208 : 110);
		const px = /^\s*(\d+)px\s*$/.exec(ancho);
		if (px) return Number(px[1]);
		const mm = /minmax\(\s*(\d+)px/.exec(ancho);
		return mm ? Number(mm[1]) : 0;
	}
	return ajuste.minimos?.[c.id] ?? 110;
}
/** Columna con su pista ajustada (fr → minmax(mín, fr); anchos fijos y pistas reemplazados). */
function ajustar(c, primeraFr, ajuste) {
	const fijo = ajuste.anchos?.[c.id];
	if (fijo !== void 0) return {
		...c,
		ancho: fijo
	};
	const pista = ajuste.pistas?.[c.id];
	if (pista !== void 0) return {
		...c,
		ancho: pista
	};
	if (typeof c.ancho === "string" && ES_FR.test(c.ancho)) return {
		...c,
		ancho: `minmax(${minimoDe(c, primeraFr, ajuste)}px, ${c.ancho.trim()})`
	};
	return c;
}
function sumaMinimos(columnas, ajuste = {}) {
	const primera = columnas.find((c) => typeof c.ancho === "string" && ES_FR.test(c.ancho))?.id;
	return columnas.reduce((s, c) => s + minimoDe(c, c.id === primera, ajuste), 0);
}
/**
* Las columnas que caben en `ancho` px. `ancho` ≤ 0 (aún sin medir) devuelve todas ajustadas y caben = true, para no
* cambiar de vista en el primer cuadro.
*/
function columnasQueCaben(columnas, ancho, ajuste = {}) {
	const primera = columnas.find((c) => typeof c.ancho === "string" && ES_FR.test(c.ancho))?.id;
	const minimo = (c) => minimoDe(c, c.id === primera, ajuste);
	let visibles = [...columnas];
	const quitadas = [];
	if (ancho > 0) {
		const fijas = new Set(ajuste.fijas ?? []);
		const orden = [...ajuste.descartar ?? [], ...[...columnas].reverse().filter((c) => c.prescindible).map((c) => c.id)].filter((id, i, l) => l.indexOf(id) === i && !fijas.has(id));
		const suma = () => visibles.reduce((s, c) => s + minimo(c), 0);
		for (const id of orden) {
			if (suma() <= ancho) break;
			if (!visibles.some((c) => c.id === id)) continue;
			visibles = visibles.filter((c) => c.id !== id);
			quitadas.push(id);
		}
		if (suma() > ancho) return {
			columnas: visibles.map((c) => ajustar(c, c.id === primera, ajuste)),
			caben: false,
			quitadas
		};
	}
	return {
		columnas: visibles.map((c) => ajustar(c, c.id === primera, ajuste)),
		caben: true,
		quitadas
	};
}
/** Ancho en px de un elemento (ResizeObserver) con una ref de función: mide aunque el elemento aparezca después de
*  cargar. 0 mientras no se mide. */
function useAncho() {
	const [el, setEl] = (0, import_react.useState)(null);
	const [ancho, setAncho] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!el) return void 0;
		const medir = () => setAncho(Math.floor(el.getBoundingClientRect().width));
		medir();
		if (typeof ResizeObserver === "undefined") return void 0;
		const o = new ResizeObserver(medir);
		o.observe(el);
		return () => o.disconnect();
	}, [el]);
	return [setEl, ancho];
}
/** Ajuste de «Todas» (01 §4.7): sin Variante, Promesa, ¿Vendió?, Tu avance ni Comisión si no caben (en ese orden).
*  «Estado en TikTok» (CeldaEstado: chip del grupo + motivo debajo) mide 196 y Tu avance 172; «Precio de venta (≈)» y
*  «Comisión por venta» suben a 160/164 para que su encabezado (con la flecha de orden) se lea completo, sin «…»; y
*  Producto y Tienda ceden un poco de mínimo: en 1280 (tabla de 968) caben las 6 esenciales, Comisión incluida, y en
*  1440 (1128) además Tu avance. Los mínimos solo se usan si una columna llega con un «fr» sin mínimo. */
var AJUSTE_TODAS = {
	anchos: {
		tiktok: 196,
		avance: 172,
		precio: 160,
		comision: 164
	},
	pistas: {
		producto: "minmax(204px, 2.4fr)",
		tienda: "minmax(120px, 1.3fr)"
	},
	minimos: {
		producto: 208,
		tienda: 110,
		variante: 110
	},
	descartar: [
		"variante",
		"promesa",
		"vendio",
		"avance",
		"comision"
	],
	fijas: [
		"producto",
		"tiktok",
		"solicitada",
		"precio"
	]
};
/** Columnas de Todas que se pliegan dentro de «Producto» (CeldaProductoPlegada) cuando no caben todas como propias. */
var PLEGADAS_EN_PRODUCTO = ["tienda", "variante"];
/** Ajuste de Todas con Tienda y Variante plegadas en Producto: Producto queda con 300 px de mínimo (el nombre corto se
*  lee completo) y salen primero Promesa, ¿Vendió?, Tu avance y Comisión. En 1280 (tabla de 968) caben Producto,
*  Estado, Solicitada, Precio y Comisión; en 1440 (1128) además Tu avance; en 960 (816), sin Comisión. */
var AJUSTE_TODAS_PLEGADA = {
	anchos: {
		tiktok: 196,
		avance: 172,
		precio: 160,
		comision: 164
	},
	pistas: { producto: "minmax(300px, 3fr)" },
	descartar: [
		"promesa",
		"vendio",
		"avance",
		"comision"
	],
	fijas: [
		"producto",
		"tiktok",
		"solicitada",
		"precio"
	]
};
/**
* Columnas de Todas (01 §4.7) para un ancho de tabla: si caben las 10 tal cual (AJUSTE_TODAS), van así; si no, Tienda y
* Variante pasan a la segunda línea de Producto (`celdaPlegada`) y del resto van las que caben (AJUSTE_TODAS_PLEGADA).
* Sin medir (0) se usa la forma plegada, que es la de casi todas las ventanas (la completa pide ~1480 px de tabla).
*/
function columnasTodas(columnas, ancho, celdaPlegada) {
	if (ancho > 0 && sumaMinimos(columnas, AJUSTE_TODAS) <= ancho) return {
		...columnasQueCaben(columnas, ancho, AJUSTE_TODAS),
		plegada: false
	};
	const r = columnasQueCaben(columnas.filter((c) => !PLEGADAS_EN_PRODUCTO.includes(c.id)).map((c) => c.id === "producto" ? {
		...c,
		celda: celdaPlegada
	} : c), ancho, AJUSTE_TODAS_PLEGADA);
	const plegadasIds = PLEGADAS_EN_PRODUCTO.filter((id) => columnas.some((c) => c.id === id));
	return {
		...r,
		quitadas: [...plegadasIds, ...r.quitadas],
		plegada: true
	};
}
/** Ajuste de la vista Tabla de Pendientes (01 §4.2): sin «Por qué», Comisión, Tu avance ni Tienda si no caben. */
var AJUSTE_PENDIENTES = {
	minimos: {
		producto: 220,
		tienda: 110,
		razones: 150
	},
	descartar: [
		"razones",
		"comision",
		"avance",
		"tienda"
	],
	fijas: [
		"producto",
		"tiktok",
		"precio",
		"accion"
	]
};
/**
* Datos de Muestras › Pendientes (ui-muestras-cola): la consulta de pendientes, la lista ESTABLE (nunca se reordena
* sola, 01 §4.16), la prioridad «aceptada» por fila (para que una sincronización no mueva filas de sección hasta
* «Actualizar»), conteos que bajan al instante (contarTrabajo) y la oferta única «¿Reordenamos tu plan?» al pasar el
* punto de control 2 de la primera sincronización (C34, 01 §4.5 regla 6, BUILD §8.5 (b)).
*/
/** Pendientes = Por vencer + Vencidas + Pausadas (01 §2.5), en el orden sugerido del hub. */
var PARAMS_PENDIENTES = {
	grupo: [
		"pausada",
		"por_vencer",
		"vencida"
	],
	orden: "prioridad"
};
/** «En revisión de TikTok» (sección informativa de 01 §4.2): no son pendientes, se piden aparte solo si existen. */
var PARAMS_EN_REVISION = {
	grupo: ["en_revision"],
	orden: "prioridad"
};
var idDe$1 = (m) => m.application_id;
var SIN_MUESTRAS = [];
function useCola() {
	const consulta = useConsulta("muestras", PARAMS_PENDIENTES);
	const porGrupo = consulta.datos?.por_grupo ?? {};
	const conRevision = (porGrupo.en_revision ?? 0) > 0;
	const revision = useConsulta("muestras", PARAMS_EN_REVISION, { activa: conRevision });
	const avisosQ = useConsulta("avisos", {});
	const sesion = useSesion();
	const { estado } = useSync();
	const hoy = hoyLocal();
	const entrantes = (0, import_react.useMemo)(() => {
		const pend = consulta.datos?.items;
		if (pend === void 0) return void 0;
		const permitidos = new Set(PARAMS_PENDIENTES.grupo ?? []);
		const base = pend.filter((m) => permitidos.has(m.grupo));
		const rev = conRevision ? (revision.datos?.items ?? SIN_MUESTRAS).filter((m) => m.grupo === "en_revision") : SIN_MUESTRAS;
		return rev.length > 0 ? [...base, ...rev] : base;
	}, [
		consulta.datos,
		revision.datos,
		conRevision
	]);
	const estable = useListaEstable(entrantes, idDe$1);
	const aceptadas = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const posiciones = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const [version, renovar] = (0, import_react.useReducer)((n) => n + 1, 0);
	for (const m of estable.items) {
		if (!aceptadas.current.has(m.application_id)) aceptadas.current.set(m.application_id, m.prioridad);
		if (!posiciones.current.has(m.application_id)) posiciones.current.set(m.application_id, m.posicion_cola);
	}
	const prioridadCambio = estable.items.some((m) => aceptadas.current.get(m.application_id) !== m.prioridad || posiciones.current.get(m.application_id) !== m.posicion_cola);
	const { aplicarOrdenNuevo: aplicarEstable } = estable;
	const aplicarOrdenNuevo = (0, import_react.useCallback)(() => {
		aceptadas.current = /* @__PURE__ */ new Map();
		posiciones.current = /* @__PURE__ */ new Map();
		aplicarEstable();
		renovar();
	}, [aplicarEstable]);
	const prioridades = (0, import_react.useMemo)(() => new Map(aceptadas.current), [estable.items, version]);
	const items = (0, import_react.useMemo)(() => estable.items.map((m) => {
		const pos = posiciones.current.get(m.application_id);
		return pos === void 0 || pos === m.posicion_cola ? m : {
			...m,
			posicion_cola: pos
		};
	}), [estable.items, version]);
	const avisos = avisosQ.datos?.items;
	const conteos = (0, import_react.useMemo)(() => contarTrabajo(items, avisos ?? [], hoy), [
		items,
		avisos,
		hoy
	]);
	const plan = (0, import_react.useMemo)(() => estadoPlan(items, hoy), [items, hoy]);
	const primeraSync = esPrimeraSync(sesion.datos?.datos.ultima_sync_ok_at, estado);
	return {
		consulta,
		items,
		entrantes: entrantes ?? SIN_MUESTRAS,
		hayOrdenNuevo: estable.hayOrdenNuevo || prioridadCambio,
		aplicarOrdenNuevo,
		prioridades,
		conteos,
		plan,
		avisos,
		hoy,
		ordenProvisional: faltanVentas(estado, primeraSync),
		primeraSync,
		syncEstado: estado,
		porGrupo,
		ultimaSyncAt: sesion.datos?.datos.ultima_sync_ok_at ?? estado?.ultima_ok_at ?? null
	};
}
/**
* Oferta única (01 §4.5 regla 6): ya pasó el punto de control 2 de la primera sincronización (las ventas de 180 días
* llegaron), el orden sugerido cambió (la lista visible tiene «un orden nuevo» o el plan quedaría distinto) y todavía no
* hay avisos enviados → se ofrece UNA vez en este equipo (usePrimeraVez('reordenar-ventas')). [Reordenar] aplica el
* orden nuevo y, si hay plan, reparte sus mismas fechas en el orden nuevo (la fecha de término no cambia) con un solo
* Deshacer. [Dejar así] la descarta (la lista conserva su orden y sigue el aviso «Hay un orden nuevo · Actualizar»).
*/
function useOfertaReordenar(cola) {
	const [esPrimera, marcarVisto] = usePrimeraVez("reordenar-ventas");
	const [visible, setVisible] = (0, import_react.useState)(false);
	const acciones = useAcciones();
	const toast = useToast();
	const { syncEstado, primeraSync, entrantes, aplicarOrdenNuevo } = cola;
	const opsPlan = (0, import_react.useMemo)(() => opsReordenarPlan(entrantes), [entrantes]);
	const sinAvisos = cola.avisos !== void 0 && !hayAvisosEnviados(cola.avisos);
	const cambioOrden = cola.hayOrdenNuevo || opsPlan.length > 0;
	const toca = esPrimera && sinAvisos && cambioOrden && pasoPuntoControl2(syncEstado, primeraSync);
	(0, import_react.useEffect)(() => {
		if (visible || !toca) return;
		setVisible(true);
		marcarVisto();
	}, [
		visible,
		toca,
		marcarVisto
	]);
	const reordenar = (0, import_react.useCallback)(async () => {
		setVisible(false);
		aplicarOrdenNuevo();
		if (opsPlan.length === 0) {
			toast.mostrar({
				texto: T.reordenado,
				tono: "ok"
			});
			return;
		}
		const r = await acciones.lote(opsPlan);
		if (r.estado === "error" || r.estado === "conflicto") {
			toast.mostrar({
				texto: T.noSePudo,
				tono: "error"
			});
			return;
		}
		toast.mostrar({
			texto: T.reordenadoPlan(opsPlan.length),
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
	}, [
		opsPlan,
		aplicarOrdenNuevo,
		acciones,
		toast
	]);
	const dejarAsi = (0, import_react.useCallback)(() => setVisible(false), []);
	return {
		visible,
		conPlan: cola.plan.hayPlan,
		reordenar,
		dejarAsi
	};
}
/** Variables CSS en línea ('--columnas', '--halo'…) con el tipo de `style`. */
function vars(valores) {
	const salida = {};
	for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === "number" ? String(v) : v;
	return salida;
}
/** Une clases de CSS Modules ignorando las vacías. */
function cx(...lista) {
	return lista.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
/** Las pestañas de Muestras (con su acción principal) van junto al título solo con la barra lateral completa (≥ 1180,
*  02 §5.1); en el riel y en el celular ocupan su propia fila. */
function pestanasArriba(movil, clase) {
	return !movil && (clase === "expandida" || clase === "amplia");
}
/** Color dominante de la foto (meta de la imagen, «#RRGGBB») → canal rgb para el halo (`rgb(r g b / 14%)`). Inválido → null. */
function rgbDeHex(hex) {
	if (!hex) return null;
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m || !m[1]) return null;
	const n = Number.parseInt(m[1], 16);
	return `${n >> 16 & 255} ${n >> 8 & 255} ${n & 255}`;
}
var Muestras_module_default = {
	pantalla: "_pantalla_1iavy_3",
	cuerpoVista: "_cuerpoVista_1iavy_16",
	refrescando: "_refrescando_1iavy_22",
	pestanasMovil: "_pestanasMovil_1iavy_26",
	pestanas: "_pestanas_1iavy_26",
	pestanasCabeza: "_pestanasCabeza_1iavy_36",
	selectorVista: "_selectorVista_1iavy_40",
	parrafo: "_parrafo_1iavy_45",
	aviso: "_aviso_1iavy_52",
	franja: "_franja_1iavy_64",
	franjaMovil: "_franjaMovil_1iavy_65",
	teFaltan: "_teFaltan_1iavy_81",
	barraEtapas: "_barraEtapas_1iavy_88",
	franjaDatos: "_franjaDatos_1iavy_91",
	teFaltanCifra: "_teFaltanCifra_1iavy_117",
	herramientas: "_herramientas_1iavy_145",
	filaHerramientas: "_filaHerramientas_1iavy_151",
	busqueda: "_busqueda_1iavy_159",
	chipsFiltro: "_chipsFiltro_1iavy_165",
	agrupar: "_agrupar_1iavy_173",
	rotulo: "_rotulo_1iavy_180",
	herramientasDerecha: "_herramientasDerecha_1iavy_186",
	filtrosActivos: "_filtrosActivos_1iavy_194",
	herramientasMovil: "_herramientasMovil_1iavy_202",
	botonOrdenMovil: "_botonOrdenMovil_1iavy_213",
	chipsDesplazables: "_chipsDesplazables_1iavy_216",
	filaMeta: "_filaMeta_1iavy_232",
	hojaCuerpo: "_hojaCuerpo_1iavy_238",
	ordenNuevo: "_ordenNuevo_1iavy_245",
	oferta: "_oferta_1iavy_270",
	ofertaIcono: "_ofertaIcono_1iavy_280",
	ofertaTextos: "_ofertaTextos_1iavy_289",
	ofertaTitulo: "_ofertaTitulo_1iavy_295",
	ofertaTexto: "_ofertaTexto_1iavy_289",
	ofertaAcciones: "_ofertaAcciones_1iavy_309",
	contenedorCuerpo: "_contenedorCuerpo_1iavy_329",
	cuerpo: "_cuerpo_1iavy_16",
	cuerpoConPanel: "_cuerpoConPanel_1iavy_337",
	columnaCola: "_columnaCola_1iavy_347",
	estadoCentro: "_estadoCentro_1iavy_353",
	secciones: "_secciones_1iavy_360",
	seccion: "_seccion_1iavy_360",
	seccionCabeza: "_seccionCabeza_1iavy_372",
	seccionTitulo: "_seccionTitulo_1iavy_380",
	seccionConteo: "_seccionConteo_1iavy_391",
	accionesSeccion: "_accionesSeccion_1iavy_398",
	lista: "_lista_1iavy_403",
	fila: "_fila_1iavy_151",
	filaMovil: "_filaMovil_1iavy_416",
	tarjetaCelda: "_tarjetaCelda_1iavy_422",
	tarjeta: "_tarjeta_1iavy_422",
	filaExtra: "_filaExtra_1iavy_431",
	filaExtraTexto: "_filaExtraTexto_1iavy_439",
	tablaCola: "_tablaCola_1iavy_446",
	tablero: "_tablero_1iavy_451",
	columnaTablero: "_columnaTablero_1iavy_459",
	columnaCabeza: "_columnaCabeza_1iavy_475",
	columnaTitulo: "_columnaTitulo_1iavy_480",
	puntoEtapa: "_puntoEtapa_1iavy_489",
	columnaVacia: "_columnaVacia_1iavy_514",
	columnaLista: "_columnaLista_1iavy_524",
	barraSeleccion: "_barraSeleccion_1iavy_540",
	barraSeleccionMovil: "_barraSeleccionMovil_1iavy_556",
	seleccionConteo: "_seleccionConteo_1iavy_573",
	seleccionAcciones: "_seleccionAcciones_1iavy_578",
	fab: "_fab_1iavy_585",
	esqueleto: "_esqueleto_1iavy_611",
	cargandoTexto: "_cargandoTexto_1iavy_616",
	esqueletoFranja: "_esqueletoFranja_1iavy_621",
	esqueletoFila: "_esqueletoFila_1iavy_629",
	esqueletoTextos: "_esqueletoTextos_1iavy_638",
	esqueletoPanel: "_esqueletoPanel_1iavy_645",
	bannerCache: "_bannerCache_1iavy_653",
	bannerTexto: "_bannerTexto_1iavy_668",
	alDia: "_alDia_1iavy_674",
	alDiaTicket: "_alDiaTicket_1iavy_682",
	alDiaTextos: "_alDiaTextos_1iavy_685",
	alDiaTitulo: "_alDiaTitulo_1iavy_692",
	alDiaTexto: "_alDiaTexto_1iavy_685"
};
/** Esqueleto de la cola: franja + 6 filas con foto, en una sola animación (02 §7.15). */
function EsqueletoCola(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.cargandoLento,
		className: cx(Muestras_module_default.esqueleto),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Muestras_module_default.cargandoTexto),
				children: T.contextoCargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.esqueletoFranja),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "titulo",
					ancho: "40%"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 12
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(p.conPanel ? Muestras_module_default.cuerpoConPanel : Muestras_module_default.cuerpo),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Muestras_module_default.lista),
					"aria-hidden": "true",
					children: [
						0,
						1,
						2,
						3,
						4,
						5
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cx(Muestras_module_default.esqueletoFila),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "foto",
							ancho: 64,
							alto: 64
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(Muestras_module_default.esqueletoTextos),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
									forma: "texto",
									ancho: "72%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
									forma: "texto",
									ancho: "48%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
									forma: "texto",
									ancho: "36%"
								})
							]
						})]
					}, i))
				}), p.conPanel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.esqueletoPanel),
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "foto",
							ancho: "100%",
							alto: 260
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "titulo",
							ancho: "80%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							lineas: 3
						})
					]
				}) : null]
			})
		]
	});
}
function NecesitaPc(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: p.className ?? Muestras_module_default.estadoCentro,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Monitor",
			titulo: T.necesitaPcTitulo,
			texto: T.necesitaPcTexto,
			accion: {
				etiqueta: T.reintentar,
				alPulsar: p.alReintentar
			}
		})
	});
}
/** Error sin datos que mostrar: necesita_pc tiene su propio estado. */
function ErrorVista(p) {
	if (p.error.codigo === "necesita_pc") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecesitaPc, {
		alReintentar: p.alReintentar,
		...p.className ? { className: p.className } : {}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: p.className ?? Muestras_module_default.estadoCentro,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleAlert",
			titulo: T.errorTitulo,
			texto: p.error.mensaje || T.errorTexto,
			accion: {
				etiqueta: T.reintentar,
				alPulsar: p.alReintentar
			}
		})
	});
}
/** «No pudimos actualizar tus muestras. Te mostramos las del {fecha}.» [Reintentar] (01 §4.2). */
function BannerCache(p) {
	const t = p.fechaAt ?? ahoraS();
	const fecha = `${formato.fechaCorta(t)}, ${formato.hora(t)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Muestras_module_default.bannerCache),
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "CircleAlert",
				tamano: 18
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Muestras_module_default.bannerTexto),
				children: T.errorConCache(fecha)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				alPulsar: p.alReintentar,
				children: T.reintentar
			})
		]
	});
}
/** Pendientes en cero: ticket «Estás al día» + texto de 01 §4.2 + [Ver historial]. */
function AlDia(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Muestras_module_default.alDia),
		"aria-label": T.alDiaTitulo,
		children: [p.publicadas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
			variante: "al_dia",
			titulo: T.ticketAlDiaTitulo,
			subtitulo: T.ticketAlDiaSub,
			renglones: [{
				concepto: T.ticketPublicados,
				cifra: formato.numero(p.publicadas)
			}, {
				concepto: T.ticketTiendas,
				cifra: formato.numero(p.tiendas)
			}],
			total: T.ticketTotal(formato.numero(p.publicadas), formato.numero(p.tiendas)),
			className: cx(Muestras_module_default.alDiaTicket)
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Muestras_module_default.alDiaTextos),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cx(Muestras_module_default.alDiaTitulo),
					children: T.alDiaTitulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Muestras_module_default.alDiaTexto),
					children: T.alDiaTexto
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					alPulsar: p.alVerHistorial,
					children: T.verHistorial
				})
			]
		})]
	});
}
/**
* `programo`: Ajustes › Recordatorios › «Programo mis videos en TikTok». Programada solo aparece (segmento y leyenda) si
* está encendido o si alguna muestra ya la usa (01 §2.4, §3.7 «Programada si se usa»).
*/
function FranjaProgreso(p) {
	const c = p.conteos;
	const conProgramada = p.programo || c.por_etapa.programada > 0;
	const segmentos = [
		{
			etapa: "planeada",
			n: c.por_etapa.planeada
		},
		{
			etapa: "video_listo",
			n: c.por_etapa.video_listo
		},
		...conProgramada ? [{
			etapa: "programada",
			n: c.por_etapa.programada
		}] : [],
		{
			etapa: "publicada",
			n: c.por_etapa.publicada
		}
	];
	const total = c.total_cohorte;
	const faltan = T.teFaltan(formato.numero(c.pendientes), c.pendientes);
	const planTexto = p.plan.hayPlan && p.plan.termina && p.plan.publica ? T.planCon(formato.fechaConDia(p.plan.termina), formato.fechaConDia(p.plan.publica)) : T.planSin;
	const tiendas = T.tiendasAvisadas(formato.numero(c.tiendas_avisadas), formato.numero(c.tiendas_con_pendientes));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(p.movil ? Muestras_module_default.franjaMovil : Muestras_module_default.franja),
		"aria-label": T.tuAvance,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Muestras_module_default.teFaltan),
				children: [
					faltan.antes,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: cx(Muestras_module_default.teFaltanCifra),
						children: faltan.cifra
					}),
					faltan.despues
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraEtapas, {
				segmentos,
				total,
				contador: T.contadorPublicados(formato.numero(c.publicadas), formato.numero(total)),
				tamano: "muestras",
				leyenda: !p.movil,
				className: cx(Muestras_module_default.barraEtapas)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: cx(Muestras_module_default.franjaDatos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tiendas }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: planTexto })]
			})
		]
	});
}
var INTERRUPTORES = [
	["yaLoVendo", T.filtroYaLoVendo],
	["etiquetable", T.filtroEtiquetable],
	["conPromesa", T.filtroConPromesa],
	["fijadas", T.filtroFijadas]
];
function ChipsFiltro(p) {
	const f = p.filtros;
	const presentes = GRUPOS_FILTRO.filter((g) => (p.conteos[g] ?? 0) > 0);
	const grupos = GRUPOS_FILTRO.filter((g) => f.grupos.includes(g) || presentes.length > 1 && presentes.includes(g));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [grupos.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
		activo: f.grupos.includes(g),
		conteo: p.conteos[g] ?? 0,
		alCambiar: (si) => p.alCambiar({
			...f,
			grupos: si ? [...f.grupos, g] : f.grupos.filter((x) => x !== g)
		}),
		children: T.filtroGrupo[g] ?? g
	}, g)), INTERRUPTORES.map(([k, texto]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
		activo: f[k],
		alCambiar: (si) => p.alCambiar({
			...f,
			[k]: si
		}),
		children: texto
	}, k))] });
}
function BarraHerramientas(p) {
	const [porQue, setPorQue] = (0, import_react.useState)(false);
	const [hoja, setHoja] = (0, import_react.useState)(false);
	const [buscando, setBuscando] = (0, import_react.useState)(false);
	const [refBarra, anchoBarra] = useAncho();
	const f = p.prefs.filtros;
	const conteos = (0, import_react.useMemo)(() => contarPorGrupo(p.items), [p.items]);
	const nFiltros = contarFiltros(f);
	const { alCambiar } = p;
	const cambiarFiltros = (0, import_react.useCallback)((nuevo) => alCambiar({ filtros: nuevo }), [alCambiar]);
	const cerrarBusqueda = (0, import_react.useCallback)(() => {
		setBuscando(false);
		if (f.q !== "") cambiarFiltros({
			...f,
			q: ""
		});
	}, [f, cambiarFiltros]);
	const busquedaAbiertaMovil = p.movil && (buscando || f.q.trim() !== "");
	(0, import_react.useEffect)(() => {
		if (!busquedaAbiertaMovil) return void 0;
		return registrarAtras(() => {
			cerrarBusqueda();
			return true;
		});
	}, [busquedaAbiertaMovil, cerrarBusqueda]);
	const busqueda = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
		etiqueta: T.buscarEtiqueta,
		etiquetaOculta: true,
		tipo: "search",
		valor: f.q,
		placeholder: T.buscarPlaceholder,
		alCambiar: (q) => cambiarFiltros({
			...f,
			q
		}),
		className: cx(Muestras_module_default.busqueda)
	});
	const limpiar = nFiltros > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Muestras_module_default.filtrosActivos),
		children: [
			T.filtrosActivos(nFiltros),
			" ·",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "sm",
				alPulsar: () => cambiarFiltros(FILTROS_VACIOS),
				children: T.limpiar
			})
		]
	}) : null;
	const provisional = p.ordenProvisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "info",
		icono: "Hourglass",
		children: T.ordenProvisional
	}) : null;
	const modalPorQue = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: porQue,
		titulo: T.porQueOrden,
		alCerrar: () => setPorQue(false),
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			alPulsar: () => setPorQue(false),
			children: T.entendido
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Muestras_module_default.parrafo),
			children: T.porQueTexto
		})
	});
	if (p.movil) {
		const abierta = buscando || f.q.trim() !== "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Muestras_module_default.herramientasMovil),
			children: [
				abierta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T.buscarEtiqueta,
					etiquetaOculta: true,
					tipo: "search",
					valor: f.q,
					placeholder: T.buscarPlaceholder,
					alCambiar: (q) => cambiarFiltros({
						...f,
						q
					}),
					autoFoco: buscando && f.q === "",
					className: cx(Muestras_module_default.busqueda)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.chipsDesplazables),
					role: "group",
					"aria-label": T.filtrosEtiqueta,
					children: [
						abierta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "X",
							etiqueta: T.cerrarBusqueda,
							variante: "secundario",
							tamano: "sm",
							alPulsar: cerrarBusqueda,
							className: cx(Muestras_module_default.botonOrdenMovil)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "Search",
							etiqueta: T.buscarEtiqueta,
							variante: "secundario",
							tamano: "sm",
							alPulsar: () => setBuscando(true),
							className: cx(Muestras_module_default.botonOrdenMovil)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "ArrowDownUp",
							etiqueta: T.ordenarYAgrupar,
							variante: "secundario",
							tamano: "sm",
							activo: p.prefs.agrupar !== "prioridad" || p.prefs.orden !== "sugerido",
							alPulsar: () => setHoja(true),
							className: cx(Muestras_module_default.botonOrdenMovil)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsFiltro, {
							filtros: f,
							conteos,
							alCambiar: cambiarFiltros
						})
					]
				}),
				limpiar || provisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.filaMeta),
					children: [provisional, limpiar]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
					abierta: hoja,
					titulo: T.ordenarYAgrupar,
					alCerrar: () => setHoja(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Muestras_module_default.hojaCuerpo),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
								etiqueta: T.agruparPor,
								opciones: AGRUPACIONES.map((a) => ({
									valor: a,
									etiqueta: T.agrupar[a]
								})),
								valor: p.prefs.agrupar,
								alCambiar: (agrupar) => p.alCambiar({ agrupar })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
								etiqueta: T.ordenarEtiqueta,
								opciones: ORDENES.map((o) => ({
									valor: o,
									etiqueta: T.ordenar[o]
								})),
								valor: p.prefs.orden,
								alCambiar: (orden) => p.alCambiar({ orden })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "fantasma",
								icono: "CircleHelp",
								alPulsar: () => setPorQue(true),
								children: T.porQueOrden
							})
						]
					})
				}),
				modalPorQue
			]
		});
	}
	const opcionesOrden = ORDENES.map((o) => ({
		id: o,
		etiqueta: T.ordenar[o],
		...o === p.prefs.orden ? { icono: "Check" } : {},
		alPulsar: () => p.alCambiar({ orden: o })
	}));
	const opcionesAgrupar = AGRUPACIONES.map((a) => ({
		id: a,
		etiqueta: T.agrupar[a],
		...a === p.prefs.agrupar ? { icono: "Check" } : {},
		alPulsar: () => p.alCambiar({ agrupar: a })
	}));
	const ancha = anchoBarra === 0 || anchoBarra >= 1080;
	const selector = p.selectorVista ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Muestras_module_default.selectorVista),
		children: p.selectorVista
	}) : null;
	const orden = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
		etiqueta: T.ordenActual(T.ordenar[p.prefs.orden]),
		opciones: opcionesOrden,
		disparador: "boton",
		icono: "ArrowDownUp"
	});
	const ayudaOrden = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
		icono: "CircleHelp",
		etiqueta: T.porQueOrden,
		alPulsar: () => setPorQue(true)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: refBarra,
		className: cx(Muestras_module_default.herramientas),
		"data-ancha": ancha ? "" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.filaHerramientas),
				children: [
					busqueda,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Muestras_module_default.chipsFiltro),
						role: "group",
						"aria-label": T.filtrosEtiqueta,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsFiltro, {
							filtros: f,
							conteos,
							alCambiar: cambiarFiltros
						}), limpiar]
					}),
					ancha ? selector : null
				]
			}),
			ancha ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.filaHerramientas),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.agrupar),
					role: "group",
					"aria-label": T.agruparPor,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Muestras_module_default.rotulo),
						children: T.agruparPor
					}), AGRUPACIONES.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
						activo: p.prefs.agrupar === a,
						alCambiar: () => p.alCambiar({ agrupar: a }),
						children: T.agrupar[a]
					}, a))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.herramientasDerecha),
					children: [
						provisional,
						orden,
						ayudaOrden
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.filaHerramientas),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Muestras_module_default.agrupar),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
							etiqueta: T.agruparActual(T.agrupar[p.prefs.agrupar]),
							opciones: opcionesAgrupar,
							disparador: "boton",
							icono: "LayoutList"
						}),
						orden,
						ayudaOrden,
						provisional
					]
				}), selector]
			}),
			modalPorQue
		]
	});
}
/**
* La cola en secciones colapsables con conteo (01 §4.2 punto 3): TarjetaMuestra 'lista' de @/bloques en cada fila, con
* su número en la cola (escritorio). «Promesas vencidas» lleva [Preparar mensaje] por tienda; «No se pueden etiquetar»,
* [Avisar a la tienda]; «En revisión» es informativa (sin acción). En Android las tarjetas se deslizan y mantener
* presionado entra a la selección múltiple; en escritorio la casilla aparece al pasar el cursor.
*/
var MANTENER_MS = 520;
function useMantener(alMantener, activo) {
	const reloj = (0, import_react.useRef)(null);
	const inicio = (0, import_react.useRef)(null);
	if (!activo) return {};
	const cancelar = () => {
		if (reloj.current) clearTimeout(reloj.current);
		reloj.current = null;
		inicio.current = null;
	};
	return {
		onPointerDown: (e) => {
			if (e.pointerType === "mouse") return;
			inicio.current = {
				x: e.clientX,
				y: e.clientY
			};
			reloj.current = setTimeout(() => {
				reloj.current = null;
				vibrar("confirmar");
				alMantener();
			}, MANTENER_MS);
		},
		onPointerMove: (e) => {
			const i = inicio.current;
			if (i && Math.hypot(e.clientX - i.x, e.clientY - i.y) > 10) cancelar();
		},
		onPointerUp: cancelar,
		onPointerLeave: cancelar,
		onPointerCancel: cancelar
	};
}
function FilaCola(p) {
	const { m } = p;
	const control = useControlMuestra();
	const mantener = useMantener(() => p.alMantener(m.application_id), p.android && !p.modoSeleccion);
	const informativa = p.seccion.tipo === "informativa" || p.seccion.tipo === "resuelta";
	const [cerca, setCerca] = (0, import_react.useState)(false);
	const marcable = p.android ? p.modoSeleccion : p.modoSeleccion || p.marcada || cerca;
	const alrededor = p.android ? {} : {
		onMouseEnter: () => setCerca(true),
		onMouseLeave: () => setCerca(false),
		onFocus: () => setCerca(true),
		onBlur: (e) => {
			if (!e.currentTarget.contains(e.relatedTarget)) setCerca(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: cx(p.movil ? Muestras_module_default.filaMovil : Muestras_module_default.fila),
		"data-muestra": m.application_id,
		"data-seleccionada": p.seleccionada ? "" : void 0,
		...mantener,
		...alrededor,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Muestras_module_default.tarjetaCelda),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
				muestra: m,
				variante: "lista",
				seleccionada: p.seleccionada,
				marcable,
				marcada: p.marcada,
				alMarcar: (si) => p.alMarcar(m.application_id, si),
				alAbrir: () => p.alAbrir(m),
				esNueva: p.esNueva,
				conAccion: !informativa && !p.modoSeleccion,
				deslizable: p.android && !p.modoSeleccion && !informativa,
				className: cx(Muestras_module_default.tarjeta)
			}), p.seccion.tipo === "etiquetar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.filaExtra),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Muestras_module_default.filaExtraTexto),
					children: m.motivo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "MessageCircle",
					alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }),
					children: T.avisarTienda
				})]
			}) : null]
		})
	});
}
function TiendasPromesa(p) {
	const control = useControlMuestra();
	const tiendas = /* @__PURE__ */ new Map();
	for (const m of p.muestras) tiendas.set(m.tienda.tienda_key, m.tienda.nombre);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Muestras_module_default.accionesSeccion),
		children: [...tiendas.entries()].map(([key, nombre]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			icono: "MessageCircleWarning",
			alPulsar: () => control.abrirMensaje({ tienda: key }),
			children: T.prepararMensaje(nombre)
		}, key))
	});
}
function ListaCola(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Muestras_module_default.secciones),
		"aria-label": T.listaEtiqueta,
		role: "region",
		children: p.secciones.map((s) => {
			const colapsada = p.colapsada(s);
			const idLista = `cola-${s.id.replace(/[^a-z0-9_-]/gi, "-")}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cx(Muestras_module_default.seccion),
				"aria-labelledby": `${idLista}-t`,
				"data-seccion": s.id,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: cx(Muestras_module_default.seccionCabeza),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: cx(Muestras_module_default.seccionTitulo),
							id: `${idLista}-t`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.titulo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Muestras_module_default.seccionConteo),
								children: formato.numero(s.muestras.length)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: colapsada ? "ChevronRight" : "ChevronDown",
							etiqueta: colapsada ? T.mostrarSeccion(s.titulo) : T.ocultarSeccion(s.titulo),
							tamano: "sm",
							alPulsar: () => p.alColapsar(s, !colapsada)
						})]
					}),
					!colapsada && s.tipo === "promesas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiendasPromesa, { muestras: s.muestras }) : null,
					!colapsada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: cx(Muestras_module_default.lista),
						id: idLista,
						children: s.muestras.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaCola, {
							m,
							seccion: s,
							seleccionada: p.seleccionada === m.application_id,
							marcada: p.marcadas.has(m.application_id),
							modoSeleccion: p.modoSeleccion,
							movil: p.movil,
							android: p.android,
							esNueva: p.esNueva(m),
							alAbrir: p.alAbrir,
							alMarcar: p.alMarcar,
							alMantener: p.alMantener
						}, m.application_id))
					}) : null
				]
			}, s.id);
		})
	});
}
function TablaCola(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
		filas: p.filas,
		columnas: p.columnas,
		idFila: (m) => m.application_id,
		etiqueta: T.tablaEtiqueta,
		seleccionada: p.seleccionada,
		alSeleccionar: p.alSeleccionar,
		alAbrir: p.alAbrir,
		esNueva: p.esNueva,
		claveScroll: "muestras-pendientes-tabla",
		className: cx(Muestras_module_default.tablaCola)
	});
}
/**
* Vista Tablero de Pendientes (escritorio, 01 §4.2): columnas Por planear · Planeada · Video listo · (Programada, si se
* usa) · Publicada con su conteo y tarjetas compactas (TarjetaMuestra 'tablero'). Arrastrar a otra columna pide los
* datos de esa etapa con useControlMuestra().cambiarEtapa (la hoja de @/bloques: fecha, fecha y hora, enlace…).
* Alternativa sin ratón: seleccionar la tarjeta y pulsar E (acción principal).
*/
var TIPO_ARRASTRE = "application/x-corte-muestra";
function TableroCola(p) {
	const control = useControlMuestra();
	const preferencias = useConsulta("preferencias", {});
	const [sobre, setSobre] = (0, import_react.useState)(null);
	const enTablero = (0, import_react.useMemo)(() => p.muestras.filter((m) => esPendiente(m) || m.avance.etapa === "publicada" && m.grupo !== "en_revision"), [p.muestras]);
	const columnas = [
		"por_planear",
		"planeada",
		"video_listo",
		...(preferencias.datos?.programo_mis_videos ?? false) || enTablero.some((m) => m.avance.etapa === "programada") ? ["programada"] : [],
		"publicada"
	];
	const porId = (0, import_react.useMemo)(() => new Map(enTablero.map((m) => [m.application_id, m])), [enTablero]);
	const soltar = (etapa) => (e) => {
		e.preventDefault();
		setSobre(null);
		const id = e.dataTransfer.getData(TIPO_ARRASTRE) || e.dataTransfer.getData("text/x-corte-muestra") || e.dataTransfer.getData("text/plain");
		const m = porId.get(id);
		if (!m || m.avance.etapa === etapa) return;
		control.cambiarEtapa(m, etapa);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Muestras_module_default.tablero),
		role: "region",
		"aria-label": T.tableroEtiqueta,
		style: vars({ "--columnas": columnas.length }),
		children: columnas.map((etapa) => {
			const lista = enTablero.filter((m) => m.avance.etapa === etapa);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cx(Muestras_module_default.columnaTablero),
				"data-etapa": etapa,
				"data-sobre": sobre === etapa ? "" : void 0,
				"aria-label": `${ETIQUETA_ETAPA[etapa]} · ${lista.length}`,
				onDragOver: (e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "move";
					if (sobre !== etapa) setSobre(etapa);
				},
				onDragLeave: () => setSobre((s) => s === etapa ? null : s),
				onDrop: soltar(etapa),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: cx(Muestras_module_default.columnaCabeza),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Muestras_module_default.puntoEtapa),
							"data-etapa": etapa,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: cx(Muestras_module_default.columnaTitulo),
							children: ETIQUETA_ETAPA[etapa]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Muestras_module_default.seccionConteo),
							children: formato.numero(lista.length)
						})
					]
				}), lista.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Muestras_module_default.columnaVacia),
					children: sobre === etapa ? T.soltarAqui : T.columnaVacia
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Muestras_module_default.columnaLista),
					children: lista.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						"data-muestra": m.application_id,
						onDragStart: (e) => {
							e.dataTransfer.setData(TIPO_ARRASTRE, m.application_id);
							e.dataTransfer.setData("text/plain", m.application_id);
							e.dataTransfer.effectAllowed = "move";
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
							muestra: m,
							variante: "tablero",
							seleccionada: p.seleccionada === m.application_id,
							alAbrir: () => p.alAbrir(m)
						})
					}, m.application_id))
				})]
			}, etapa);
		})
	});
}
/**
* Convivencia de las capas flotantes de Muestras (botón flotante, barra de acciones del detalle) con las capas
* globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, los avisos de @/componentes): si una
* de ellas tapa a la nuestra, la nuestra sube lo justo para quedar encima de ella (como un aviso empuja al botón
* flotante en Android). Las capas globales se reconocen por su marca común `data-capa-corte`; si no hay ninguna, no
* se mueve nada. Los diálogos y hojas a pantalla completa no cuentan (tapan todo a propósito).
*/
var SEPARACION = 12;
/** Altura (px desde el borde inferior) que debe dejar libre `propio` para no quedar debajo de otra capa fija. */
function holguraContra(propio, capas, altoVentana) {
	let holgura = 0;
	for (const r of capas) {
		if (r.width < 1 || r.height < 1) continue;
		if (r.height > altoVentana * .7) continue;
		if (r.bottom < altoVentana - 160) continue;
		const horizontal = r.left < propio.right && r.right > propio.left;
		const vertical = r.top < propio.bottom - 1 && r.bottom > propio.top + 1;
		if (horizontal && vertical) holgura = Math.max(holgura, Math.ceil(altoVentana - r.top + SEPARACION));
	}
	return holgura;
}
/**
* Alto (px desde el borde superior de la ventana) que ocupan, ya pegados, los encabezados pegajosos que quedan sobre
* `propio` (EncabezadoPantalla de @/componentes mide más que --header-h: título de 30 y un contexto que puede ir en dos
* renglones). 0 si no hay ninguno. Sirve para que lo pegajoso de la pantalla (panel de detalle, «Hay un orden nuevo»)
* se pegue DEBAJO del encabezado y no por detrás de él.
*/
function altoCabezaPegajosa(propio) {
	const r = propio.getBoundingClientRect();
	let alto = 0;
	for (const h of document.querySelectorAll("header")) {
		if (h.contains(propio) || propio.contains(h)) continue;
		const s = getComputedStyle(h);
		if (s.position !== "sticky" && s.position !== "fixed") continue;
		const rh = h.getBoundingClientRect();
		if (rh.height < 1 || rh.height > window.innerHeight * .4 || rh.left >= r.right || rh.right <= r.left) continue;
		alto = Math.max(alto, (Number.parseFloat(s.top) || 0) + rh.height);
	}
	return Math.ceil(alto);
}
/**
* Pega `el` (position: sticky) `separacion` px debajo de los encabezados pegajosos de la pantalla (altoCabezaPegajosa);
* sin encabezado deja el `top` de su CSS. Se recalcula al cambiar el tamaño de la ventana o el DOM, una vez por cuadro.
*/
function useTopeBajoCabeza(el, separacion) {
	(0, import_react.useEffect)(() => {
		if (!el || typeof window === "undefined") return void 0;
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const alto = altoCabezaPegajosa(el);
			if (alto > 0) el.style.top = `${alto + separacion}px`;
			else el.style.removeProperty("top");
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(medir);
		};
		medir();
		const o = typeof MutationObserver === "undefined" ? null : new MutationObserver(pedir);
		o?.observe(document.body, {
			childList: true,
			subtree: true
		});
		window.addEventListener("resize", pedir);
		return () => {
			o?.disconnect();
			window.removeEventListener("resize", pedir);
			if (cuadro) window.cancelAnimationFrame(cuadro);
		};
	}, [el, separacion]);
}
/** Rectángulos de las capas globales fijas visibles (marca `data-capa-corte`), sin contar las que contienen a `propio`. */
function capasFijas(propio) {
	const salida = [];
	for (const raiz of document.querySelectorAll("[data-capa-corte]")) {
		if (propio.contains(raiz) || raiz.contains(propio)) continue;
		const candidatos = [raiz, ...raiz.querySelectorAll(":scope > *")];
		for (const el of candidatos) {
			const s = getComputedStyle(el);
			if (s.visibility === "hidden" || s.display === "none") continue;
			if (el === raiz && s.position !== "fixed") continue;
			salida.push(el.getBoundingClientRect());
		}
	}
	return salida;
}
/**
* Cuánto (px) debe subir la capa `el` para no quedar debajo de otra capa fija anclada abajo: 0 si nada la tapa. Quien
* la usa lo aplica con `--holgura` (transform: translateY(-holgura)). Se recalcula cuando cambia el DOM de la página
* (aparece o se va una capa) y al cambiar el tamaño de la ventana, una vez por cuadro.
*/
function useHolguraInferior(el) {
	const [holgura, setHolgura] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!el || typeof window === "undefined" || typeof MutationObserver === "undefined") return void 0;
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const actual = el.getBoundingClientRect();
			const aplicada = Number.parseFloat(el.style.getPropertyValue("--holgura")) || 0;
			const reposo = new DOMRect(actual.left, actual.top + aplicada, actual.width, actual.height);
			const libre = holguraContra(reposo, capasFijas(el), window.innerHeight);
			const distancia = window.innerHeight - reposo.bottom;
			setHolgura(libre > 0 ? Math.max(0, libre - distancia) : 0);
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(medir);
		};
		pedir();
		const o = new MutationObserver(pedir);
		o.observe(document.body, {
			childList: true,
			subtree: true
		});
		window.addEventListener("resize", pedir);
		document.addEventListener("animationend", pedir, true);
		document.addEventListener("transitionend", pedir, true);
		return () => {
			o.disconnect();
			window.removeEventListener("resize", pedir);
			document.removeEventListener("animationend", pedir, true);
			document.removeEventListener("transitionend", pedir, true);
			if (cuadro) window.cancelAnimationFrame(cuadro);
		};
	}, [el]);
	return holgura;
}
/**
* Capa flotante de Muestras (botón flotante, barra de acciones fija del detalle y barra de selección del celular).
* Se pinta en document.body con un portal: un ancestro con transform (p. ej. la animación de entrada de la pantalla,
* que deja `transform` animado) convertiría `position: fixed` en relativo a ese ancestro y la barra quedaría al final de
* la página en vez de pegada abajo.
* Con `className`, la capa es un contenedor que reacciona si una capa global anclada abajo (la tarjeta «¿Le enviaste el
* mensaje…?», un aviso) la taparía (capas.ts), así nunca se enciman:
*   - 'subir' (por omisión): sube lo justo (`--holgura`) para quedar encima de ella (barras de acciones y de selección);
*   - 'ocultar': se oculta mientras la otra capa está ahí y vuelve cuando se va (el botón flotante: subirlo lo dejaba a
*     media pantalla, encima de la búsqueda; la tarjeta pide una respuesta de un toque y después el botón regresa).
*/
function Flotante(p) {
	const [el, setEl] = (0, import_react.useState)(null);
	const holgura = useHolguraInferior(p.className ? el : null);
	if (typeof document === "undefined") return null;
	if (!p.className) return (0, import_react_dom.createPortal)(p.children, document.body);
	const ocultar = p.alTaparse === "ocultar";
	const tapada = holgura > 0;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setEl,
		className: p.className,
		style: vars({ "--holgura": `${ocultar ? 0 : holgura}px` }),
		"data-holgura": tapada && !ocultar ? "" : void 0,
		"data-tapada": tapada && ocultar ? "" : void 0,
		...tapada && ocultar ? {
			inert: true,
			"aria-hidden": true
		} : {},
		...p.role ? { role: p.role } : {},
		...p["aria-label"] ? { "aria-label": p["aria-label"] } : {},
		children: p.children
	}), document.body);
}
/** Rutas hash que usan las vistas de Muestras (BUILD §8.6, 01 §3.1). */
var RUTA_PENDIENTES = "/muestras";
var RUTA_TODAS = "/muestras/todas";
var RUTA_PLAN = "/muestras/plan";
var RUTA_AVISOS = "/muestras/avisos";
var RUTA_SESION = "/muestras/sesion";
function rutaDetalle(id) {
	return `/muestras/m/${encodeURIComponent(id)}`;
}
function rutaTienda(tiendaKey) {
	return `/tiendas/${encodeURIComponent(tiendaKey)}`;
}
/** «Avisar a estas tiendas» (01 §4.2): Avisar a mis tiendas limitado a una selección (?tiendas=k1,k2). */
function rutaAvisarTiendas(claves) {
	return `${RUTA_AVISOS}?tiendas=${[...new Set(claves)].map((k) => encodeURIComponent(k)).join(",")}`;
}
/**
* Selección múltiple de Pendientes (01 §4.2): «{n} seleccionadas · [Planear…] [Cambiar etapa] [Avisar a estas tiendas]
* [Quitar selección]». Planear y Cambiar etapa se aplican en UN lote (acciones.lote) con un solo Deshacer; «Avisar a
* estas tiendas» abre Avisar a mis tiendas limitado a las tiendas de la selección (#/muestras/avisos?tiendas=…).
*/
var ETAPAS_LOTE = [
	"por_planear",
	"planeada",
	"video_listo",
	"publicada"
];
function BarraSeleccion(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const preferencias = useConsulta("preferencias", {});
	const [hoja, setHoja] = (0, import_react.useState)(null);
	const [fecha, setFecha] = (0, import_react.useState)(p.hoy);
	const [etapa, setEtapa] = (0, import_react.useState)("planeada");
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const n = p.muestras.length;
	const capacidad = preferencias.datos?.capacidad_videos_dia ?? 3;
	const ocupacion = (0, import_react.useMemo)(() => {
		const r = {};
		for (const m of p.todas) {
			const f = m.avance.fecha_planeada;
			if (f && m.avance.etapa !== "publicada" && m.avance.etapa !== "no_se_puede") r[f] = {
				usados: (r[f]?.usados ?? 0) + 1,
				capacidad
			};
		}
		return r;
	}, [p.todas, capacidad]);
	const enRiesgo = p.muestras.filter((m) => promesaEnRiesgo(fecha, m.avisos.promesa)).length;
	const aplicar = async (destino) => {
		const datos = destino === "planeada" ? { fecha_plan: fecha } : destino === "video_listo" ? { fecha_video_listo: p.hoy } : destino === "publicada" ? { fecha_publicada: p.hoy } : {};
		const error = validarEtapa(destino, datos);
		if (error) {
			toast.mostrar({
				texto: error,
				tono: "error"
			});
			return;
		}
		setGuardando(true);
		const ops = p.muestras.filter((m) => m.avance.etapa !== destino || destino === "planeada").map((m) => opCambioEtapa(m, destino, datos, p.hoy));
		const r = await acciones.lote(ops);
		setGuardando(false);
		setHoja(null);
		if (r.estado === "error" || r.estado === "conflicto") {
			toast.mostrar({
				texto: T.noSePudo,
				tono: "error"
			});
			return;
		}
		const texto = destino === "planeada" ? T.planeadas(ops.length, formato.fechaConDia(fecha)) : T.etapaCambiada(ops.length, ETIQUETA_ETAPA[destino]);
		toast.mostrar({
			texto,
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
		p.alQuitar();
	};
	const selectorFecha = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
		etiqueta: T.hojaPlanearEtiqueta,
		valor: fecha,
		alCambiar: setFecha,
		min: p.hoy,
		atajos: [{
			etiqueta: T.hoy,
			fecha: p.hoy
		}, {
			etiqueta: T.manana,
			fecha: sumarDias(p.hoy, 1)
		}],
		ocupacion
	});
	const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Muestras_module_default.seleccionConteo),
		"aria-live": "polite",
		children: T.seleccionadas(n)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Muestras_module_default.seleccionAcciones),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "CalendarDays",
				alPulsar: () => setHoja("planear"),
				children: T.planearVarias
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "CircleDashed",
				alPulsar: () => setHoja("etapa"),
				children: T.cambiarEtapa
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "MessageCircle",
				alPulsar: () => navegar(rutaAvisarTiendas(p.muestras.map((m) => m.tienda.tienda_key))),
				children: T.avisarEstas
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "sm",
				icono: "X",
				alPulsar: p.alQuitar,
				children: T.quitarSeleccion
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		p.movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flotante, {
			className: cx(Muestras_module_default.barraSeleccionMovil),
			role: "toolbar",
			"aria-label": T.seleccionadas(n),
			children: contenido
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Muestras_module_default.barraSeleccion),
			role: "toolbar",
			"aria-label": T.seleccionadas(n),
			children: contenido
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
			abierta: hoja === "planear",
			titulo: T.hojaPlanearTitulo,
			alCerrar: () => setHoja(null),
			pie: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				anchoCompleto: true,
				cargando: guardando,
				alPulsar: () => void aplicar("planeada"),
				children: T.planearN(n)
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.hojaCuerpo),
				children: [selectorFecha, enRiesgo > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Muestras_module_default.aviso),
					children: T.riesgoPromesa(enRiesgo)
				}) : null]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
			abierta: hoja === "etapa",
			titulo: T.hojaEtapaTitulo,
			alCerrar: () => setHoja(null),
			pie: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				anchoCompleto: true,
				cargando: guardando,
				alPulsar: () => void aplicar(etapa),
				children: T.aplicar
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.hojaCuerpo),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
					etiqueta: T.hojaEtapaEtiqueta,
					opciones: ETAPAS_LOTE.map((e) => ({
						valor: e,
						etiqueta: ETIQUETA_ETAPA[e]
					})),
					valor: etapa,
					alCambiar: setEtapa
				}), etapa === "planeada" ? selectorFecha : null]
			})
		})
	] });
}
function OfertaReordenar(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Muestras_module_default.oferta),
		role: "region",
		"aria-label": T.ofertaTitulo,
		"data-oferta": "reordenar-ventas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Muestras_module_default.ofertaIcono),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "TrendingUp",
					tamano: 20
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.ofertaTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Muestras_module_default.ofertaTitulo),
					children: T.ofertaTitulo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(Muestras_module_default.ofertaTexto),
					children: [
						T.ofertaPregunta,
						" ",
						T.ofertaSinCambioFecha
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Muestras_module_default.ofertaAcciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: p.alDejar,
					children: T.dejarAsi
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					icono: "ArrowDownUp",
					alPulsar: p.alReordenar,
					children: T.reordenar
				})]
			})
		]
	});
}
var Detalle_module_default = {
	panel: "_panel_11aib_4",
	entrarPanel: "_entrarPanel_11aib_1",
	panelCabeza: "_panelCabeza_11aib_43",
	panelControles: "_panelControles_11aib_64",
	panelMini: "_panelMini_11aib_82",
	panelNombre: "_panelNombre_11aib_86",
	panelScroll: "_panelScroll_11aib_98",
	panelHeroe: "_panelHeroe_11aib_121",
	panelFoto: "_panelFoto_11aib_127",
	panelFotoCaja: "_panelFotoCaja_11aib_142",
	panelFotoImg: "_panelFotoImg_11aib_150",
	panelFotoVelo: "_panelFotoVelo_11aib_154",
	panelFotoChip: "_panelFotoChip_11aib_161",
	encabezadoTexto: "_encabezadoTexto_11aib_203",
	rotuloTienda: "_rotuloTienda_11aib_206",
	overline: "_overline_11aib_209",
	panelPie: "_panelPie_11aib_221",
	pieAccion: "_pieAccion_11aib_230",
	panelEstado: "_panelEstado_11aib_234",
	panelEsqueleto: "_panelEsqueleto_11aib_241",
	fotoAncha: "_fotoAncha_11aib_271",
	titulo: "_titulo_11aib_283",
	tituloFila: "_tituloFila_11aib_289",
	tituloTexto: "_tituloTexto_11aib_295",
	tituloEdicion: "_tituloEdicion_11aib_310",
	tituloEdicionAcciones: "_tituloEdicionAcciones_11aib_315",
	tituloCompleto: "_tituloCompleto_11aib_320",
	enlaceTexto: "_enlaceTexto_11aib_329",
	lineaTienda: "_lineaTienda_11aib_350",
	enlaceTienda: "_enlaceTienda_11aib_357",
	atenuado: "_atenuado_11aib_367",
	copia: "_copia_11aib_370",
	cuerpoPanel: "_cuerpoPanel_11aib_378",
	cuerpoCompleto: "_cuerpoCompleto_11aib_379",
	chips: "_chips_11aib_390",
	texto: "_texto_11aib_398",
	vacio: "_vacio_11aib_405",
	mono: "_mono_11aib_410",
	bloque: "_bloque_11aib_416",
	bloqueInterno: "_bloqueInterno_11aib_422",
	bloqueCaja: "_bloqueCaja_11aib_428",
	bloqueCabeza: "_bloqueCabeza_11aib_435",
	bloqueTitulo: "_bloqueTitulo_11aib_442",
	bloqueMeta: "_bloqueMeta_11aib_458",
	enlaceAccion: "_enlaceAccion_11aib_462",
	subBloque: "_subBloque_11aib_473",
	subTitulo: "_subTitulo_11aib_480",
	listaSimple: "_listaSimple_11aib_486",
	filaAviso: "_filaAviso_11aib_494",
	filaAvisoTexto: "_filaAvisoTexto_11aib_501",
	cifras: "_cifras_11aib_516",
	fichaPrecio: "_fichaPrecio_11aib_522",
	stats: "_stats_11aib_525",
	statsTienda: "_statsTienda_11aib_526",
	stat: "_stat_11aib_525",
	statValor: "_statValor_11aib_558",
	statRotulo: "_statRotulo_11aib_569",
	porque: "_porque_11aib_574",
	promesa: "_promesa_11aib_582",
	promesaVencida: "_promesaVencida_11aib_599",
	pasos: "_pasos_11aib_606",
	paso: "_paso_11aib_606",
	pasoBarra: "_pasoBarra_11aib_619",
	pasoNombre: "_pasoNombre_11aib_627",
	pasoFecha: "_pasoFecha_11aib_640",
	confirmado: "_confirmado_11aib_646",
	datos: "_datos_11aib_657",
	cortado: "_cortado_11aib_680",
	botonesVideo: "_botonesVideo_11aib_688",
	botonBloque: "_botonBloque_11aib_694",
	pregunta: "_pregunta_11aib_700",
	preguntaAcciones: "_preguntaAcciones_11aib_708",
	editor: "_editor_11aib_713",
	historial: "_historial_11aib_718",
	historialFecha: "_historialFecha_11aib_738",
	otras: "_otras_11aib_742",
	otra: "_otra_11aib_742",
	otraFoto: "_otraFoto_11aib_764",
	otraTextos: "_otraTextos_11aib_768",
	otraNombre: "_otraNombre_11aib_775",
	tecnicos: "_tecnicos_11aib_784",
	tecnicosResumen: "_tecnicosResumen_11aib_788",
	tecnicosFlecha: "_tecnicosFlecha_11aib_802",
	hojaCuerpo: "_hojaCuerpo_11aib_811",
	conflicto: "_conflicto_11aib_818",
	conflictoTextos: "_conflictoTextos_11aib_833",
	conflictoTexto: "_conflictoTexto_11aib_833",
	conflictoVersion: "_conflictoVersion_11aib_845",
	pantallaMovil: "_pantallaMovil_11aib_853",
	completoMovil: "_completoMovil_11aib_859",
	heroe: "_heroe_11aib_864",
	heroeFoto: "_heroeFoto_11aib_872",
	heroeVelo: "_heroeVelo_11aib_879",
	heroeAtras: "_heroeAtras_11aib_885",
	heroeChip: "_heroeChip_11aib_900",
	completoMovilCuerpo: "_completoMovilCuerpo_11aib_909",
	barraAcciones: "_barraAcciones_11aib_918",
	barraPrincipal: "_barraPrincipal_11aib_933",
	barraMas: "_barraMas_11aib_937",
	esqueletoMovil: "_esqueletoMovil_11aib_945",
	pantallaAncha: "_pantallaAncha_11aib_952",
	completoAncho: "_completoAncho_11aib_959",
	columnaFoto: "_columnaFoto_11aib_966",
	columnaDatos: "_columnaDatos_11aib_983",
	accionesFila: "_accionesFila_11aib_990",
	accionAncha: "_accionAncha_11aib_996",
	estadoCompleto: "_estadoCompleto_11aib_1004",
	esqueletoAncho: "_esqueletoAncho_11aib_1009",
	esqueletoTextos: "_esqueletoTextos_11aib_1014"
};
/**
* Contenido del Detalle de muestra (01 §4.3, 02 §7.12), el mismo en el panel de 480 (Windows ≥ 1280) y a pantalla
* completa (Android y ventanas angostas): chips («TikTok:», «Tu avance:», promesa), precio (FichaPrecio), «Tu avance»
* con sus pasos, «TikTok dice», «Para tu video» (Copiar datos para tu guion, Guardar imagen), «Ventas de este
* producto» (TarjetaVentasProducto A/B/C), «Esta tienda contigo», «Mensaje a la tienda» con la plantilla sugerida
* (EditorMensaje) y los avisos enviados, recordatorios, notas, historial, otras muestras de la tienda, datos técnicos
* y el aviso de conflicto de C26 con [Ver].
*/
/** Ids de las plantillas predeterminadas de 01 §4.8 (PlantillaMensaje.id) que decide «¿Un solo mensaje…?». */
var PLANTILLA_VARIAS = "varias_muestras";
var PLANTILLA_UNA = "disculpa_y_fecha";
/** Conflicto de C26: la versión vigente del hub que llegó con un 409 o en OpsResultado.objeto. */
function useConflicto() {
	const [vigente, setVigente] = (0, import_react.useState)(null);
	return {
		vigente,
		anotar: (0, import_react.useCallback)((r) => {
			if (r.estado !== "conflicto") return false;
			if (r.objeto && typeof r.objeto === "object") setVigente(r.objeto);
			return true;
		}, []),
		limpiar: (0, import_react.useCallback)(() => setVigente(null), [])
	};
}
function resumenVigente(o) {
	if ("estado" in o && "fecha_plan" in o) {
		const plan = o;
		return [
			`${T.datoEtapa}: ${ETIQUETA_ETAPA[plan.estado]}`,
			...plan.fecha_plan ? [`${T.datoPlaneada}: ${formato.fechaConDia(plan.fecha_plan)}`] : [],
			...plan.nombre_corto ? [`${T.nombreEtiqueta}: ${plan.nombre_corto}`] : []
		];
	}
	if ("vence_at" in o) return [o.titulo, T.recordatorioVence(`${formato.fechaConDia(o.vence_at)}, ${formato.hora(o.vence_at)}`)];
	if ("solicitud_ids" in o) return [o.plantilla_id, ...Object.values(o.compromisos).map((f) => T.avisoPromesa(formato.fechaConDia(f)))];
	if ("texto" in o && "entidad" in o) return [o.texto];
	return [];
}
/** «Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.» [Ver]. */
function AvisoConflicto(p) {
	const [ver, setVer] = (0, import_react.useState)(false);
	const lineas = resumenVigente(p.vigente);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.conflicto),
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Info",
				tamano: 18
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.conflictoTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Detalle_module_default.conflictoTexto),
					children: T.conflicto
				}), ver && lineas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.conflictoVersion),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.overline),
						children: T.versionPc
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: lineas.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: l }, l)) })]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "sm",
				alPulsar: () => setVer((v) => !v),
				children: ver ? T.ocultar : T.ver
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "X",
				etiqueta: T.cerrar,
				tamano: "sm",
				alPulsar: p.alCerrar
			})
		]
	});
}
function Bloque(p) {
	const cabeza = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.bloqueCabeza),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: cx(Detalle_module_default.bloqueTitulo),
			children: p.titulo
		}), p.accion ?? null]
	});
	if (p.caja) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "normal",
		className: cx(Detalle_module_default.bloqueCaja, p.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": p.titulo,
			id: p.id,
			className: cx(Detalle_module_default.bloqueInterno),
			children: [cabeza, p.children]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": p.titulo,
		id: p.id,
		className: cx(Detalle_module_default.bloque, p.className),
		children: [cabeza, p.children]
	});
}
/** Nombre que se muestra: el nombre corto que puso el usuario (PlanVideo.nombre_corto) o el del producto. */
function nombreVisible(m, detalle) {
	return (detalle ? planVivo(m, detalle.planes) : null)?.nombre_corto?.trim() || nombreDe(m);
}
function Rotulo(p) {
	const pos = p.m.posicion_cola;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(Detalle_module_default.overline),
		children: [pos !== null ? T.posicion(pos) : ETIQUETA_GRUPO[p.m.grupo], p.conTienda ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Detalle_module_default.rotuloTienda),
			children: ` · ${p.m.tienda.nombre}`
		}) : null]
	});
}
/** Título (H2) con ✎ «Editar nombre corto» y «Ver título completo» (01 §4.3 punto 1). */
function TituloEditable(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const [editando, setEditando] = (0, import_react.useState)(false);
	const [completo, setCompleto] = (0, import_react.useState)(false);
	const nombre = nombreVisible(p.m, p.detalle);
	const [valor, setValor] = (0, import_react.useState)(nombre);
	const Etiqueta = p.nivel;
	const tituloLargo = p.m.producto.titulo;
	const guardar = async () => {
		const nuevo = valor.trim();
		setEditando(false);
		if (!nuevo || nuevo === nombre) return;
		const plan = p.detalle ? planVivo(p.m, p.detalle.planes) : null;
		const r = plan ? await acciones.editarPlan(plan.id, {
			nombre_corto: nuevo,
			rev: plan.rev
		}) : await acciones.crearPlan({
			id: nuevoId(),
			titulo: nombreCorto(p.m.producto.titulo),
			application_id: p.m.application_id,
			product_id: p.m.producto.product_id,
			tienda_key: p.m.tienda.tienda_key,
			estado: p.m.avance.etapa,
			nombre_corto: nuevo
		});
		if (p.alConflicto(r)) return;
		if (r.estado === "error") toast.mostrar({
			texto: T.noSePudo,
			tono: "error"
		});
		else toast.mostrar({
			texto: T.nombreGuardado,
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.titulo),
		children: [editando ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.tituloEdicion),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
				etiqueta: T.nombreEtiqueta,
				valor,
				alCambiar: setValor,
				placeholder: T.nombrePlaceholder,
				maximo: 60,
				autoFoco: true,
				alEnter: () => void guardar()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.tituloEdicionAcciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					alPulsar: () => setEditando(false),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					alPulsar: () => void guardar(),
					children: T.guardar
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.tituloFila),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Etiqueta, {
				className: cx(Detalle_module_default.tituloTexto),
				children: nombre
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "Pencil",
				etiqueta: T.editarNombre,
				tamano: "sm",
				alPulsar: () => {
					setValor(nombre);
					setEditando(true);
				}
			})]
		}), tituloLargo && tituloLargo !== nombre ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cx(Detalle_module_default.enlaceTexto),
			"aria-expanded": completo,
			onClick: () => setCompleto((c) => !c),
			children: completo ? T.ocultarTituloCompleto : T.verTituloCompleto
		}), completo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Detalle_module_default.tituloCompleto),
			children: tituloLargo
		}) : null] }) : null]
	});
}
function LineaTienda(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(Detalle_module_default.lineaTienda),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
			a: rutaTienda(p.m.tienda.tienda_key),
			className: cx(Detalle_module_default.enlaceTienda),
			children: p.m.tienda.nombre
		}), p.m.variante ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(Detalle_module_default.atenuado),
			children: [" · ", p.m.variante]
		}) : null]
	});
}
/** `I` = Guardar imagen del producto · `N` = Ir a notas (01 §3.6, en el detalle de Windows). */
function useAtajosDetalle(m, nombre, alNotas, activo) {
	useAtajos([{
		teclas: "i",
		descripcion: T.guardarImagen,
		accion: () => {
			if (m.producto.imagen) guardarImagen(m.producto.imagen, `${nombre}.jpg`);
		}
	}, {
		teclas: "n",
		descripcion: T.irANotas,
		accion: alNotas
	}], activo);
}
function useMenuMuestra(m, alNotas) {
	const control = useControlMuestra();
	const plataforma = usePlataforma();
	const toast = useToast();
	return (0, import_react.useMemo)(() => {
		const enlace = m.producto.enlace;
		const conFecha = m.avance.fecha_planeada !== null;
		return [
			{
				id: "planear",
				etiqueta: conFecha ? T.menuMover : T.menuPlanear,
				icono: "CalendarDays",
				alPulsar: () => void (conFecha ? control.moverDia(m) : control.planear(m))
			},
			{
				id: "listo",
				etiqueta: T.menuVideoListo,
				icono: "Clapperboard",
				alPulsar: () => void control.cambiarEtapa(m, "video_listo")
			},
			{
				id: "vincular",
				etiqueta: T.menuVincular,
				icono: "Link",
				alPulsar: () => void control.vincularVideo(m)
			},
			{
				id: "avisar",
				etiqueta: T.avisarTienda,
				icono: "MessageCircle",
				alPulsar: () => control.abrirMensaje({ solicitud: m.application_id })
			},
			{
				id: "imagen",
				etiqueta: T.guardarImagen,
				icono: "Download",
				deshabilitado: m.producto.imagen === null,
				alPulsar: () => {
					if (m.producto.imagen) guardarImagen(m.producto.imagen, `${nombreDe(m)}.jpg`);
				}
			},
			{
				id: "guion",
				etiqueta: T.copiarGuion,
				icono: "Copy",
				alPulsar: () => {
					copiarTexto(textoDatosGuion(m)).then((ok) => toast.mostrar({
						texto: ok ? T.guionCopiado : T.noSePudoCopiar,
						tono: ok ? "ok" : "error"
					}));
				}
			},
			{
				id: "tiktok",
				etiqueta: plataforma === "android" ? T.abrirTikTokAndroid : T.abrirTikTokWindows,
				icono: "ExternalLink",
				deshabilitado: enlace === null,
				alPulsar: () => {
					if (!enlace) return;
					plataforma === "android" ? abrirTikTok(enlace) : abrirExterno(enlace);
				}
			},
			{
				id: "tienda",
				etiqueta: T.menuVerTienda,
				icono: "Store",
				alPulsar: () => navegar(rutaTienda(m.tienda.tienda_key))
			},
			...alNotas ? [{
				id: "nota",
				etiqueta: T.agregarNota,
				icono: "Pencil",
				alPulsar: alNotas
			}] : [],
			{
				id: "fijar",
				etiqueta: m.avance.fijada ? T.menuQuitarFijar : T.menuFijar,
				icono: "Pin",
				alPulsar: () => void control.fijar(m, !m.avance.fijada)
			},
			{
				id: "no",
				etiqueta: T.menuNoPuedo,
				icono: "Ban",
				peligro: true,
				alPulsar: () => void control.noSePuede(m)
			}
		];
	}, [
		m,
		control,
		plataforma,
		toast,
		alNotas
	]);
}
function TuAvance(p) {
	const plan = p.detalle ? planVivo(p.m, p.detalle.planes) : null;
	const pasos = pasosAvance(p.m, p.programo, plan);
	const etapa = p.m.avance.etapa;
	const promesa = p.m.avisos.promesa;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.tuAvance,
		accion: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Detalle_module_default.bloqueMeta),
			children: ETIQUETA_ETAPA[etapa]
		}),
		caja: true,
		children: [
			promesa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Detalle_module_default.promesa, p.m.avisos.promesa_vencida && Detalle_module_default.promesaVencida),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CalendarClock",
					tamano: 16
				}), T.promesa(formato.fechaConDia(promesa))]
			}) : null,
			etapa === "no_se_puede" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Detalle_module_default.texto),
				children: T.decidisteNo
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: cx(Detalle_module_default.pasos),
				"aria-label": T.etapas,
				style: { gridTemplateColumns: `repeat(${pasos.length}, minmax(0, 1fr))` },
				children: pasos.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(Detalle_module_default.paso),
					"data-hecho": x.hecho ? "" : void 0,
					"data-actual": x.actual ? "" : void 0,
					"data-etapa": x.etapa,
					"aria-current": x.actual ? "step" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Detalle_module_default.pasoBarra),
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Detalle_module_default.pasoNombre),
							children: ETIQUETA_ETAPA[x.etapa]
						}),
						x.fecha !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Detalle_module_default.pasoFecha),
							children: formato.fechaCorta(x.fecha)
						}) : null
					]
				}, x.etapa))
			}),
			p.m.avance.vinculo_origen === "confirmado_por_tiktok" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Detalle_module_default.confirmado),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Check",
					tamano: 16
				}), T.confirmadoTikTok]
			}) : null,
			p.children
		]
	});
}
function TikTokDice(p) {
	const { m } = p;
	const explicacion = (() => {
		if (m.grupo === "por_vencer") return T.explicacion.por_vencer(m.fecha_limite_at !== null ? `${formato.fechaLarga(m.fecha_limite_at)}, ${formato.hora(m.fecha_limite_at)}` : "—");
		if (m.grupo === "sin_envio") return m.subestado === "tienda_no_envio" ? T.explicacion.sin_envio_tienda : `${T.explicacion.sin_envio} ${m.motivo}.`;
		const e = T.explicacion[m.grupo];
		return typeof e === "string" ? e : "";
	})();
	const recibida = recibidaAprox(m);
	const etiquetable = m.prioridad !== "no_se_puede_etiquetar";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.tiktokDice,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Detalle_module_default.chips),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTok, {
					muestra: m,
					conMotivo: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Detalle_module_default.texto),
				children: explicacion
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: cx(Detalle_module_default.datos),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.datoSolicitada }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.solicitada_at !== null ? T.solicitadaValor(formato.fechaCorta(m.solicitada_at), formato.haceDias(m.solicitada_at)) : T.solicitadaPorVerificar })] }),
					m.fecha_limite_at !== null && (m.grupo === "por_vencer" || m.grupo === "en_revision") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.datoVence }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: `${formato.fechaConDia(m.fecha_limite_at)}, ${formato.hora(m.fecha_limite_at)}` })] }) : null,
					recibida ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.datoRecibida }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.fechaCorta(recibida) })] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.datoTipo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: etiquetaTipoMuestra(m.tipo) })] }),
					m.grupo === "por_vencer" || m.grupo === "vencida" || m.grupo === "pausada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.datoProducto }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: etiquetable ? T.seEtiqueta : m.motivo || T.noSeEtiqueta })] }) : null
				]
			})
		]
	});
}
function ParaTuVideo(p) {
	const [desc, setDesc] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.paraTuVideo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.botonesVideo),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonCopiarGuion, {
				muestra: p.m,
				className: cx(Detalle_module_default.botonBloque)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonGuardarImagen, {
				producto: p.m.producto,
				className: cx(Detalle_module_default.botonBloque)
			})]
		}), p.m.producto.titulo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cx(Detalle_module_default.enlaceTexto),
			"aria-expanded": desc,
			onClick: () => setDesc((d) => !d),
			children: desc ? T.ocultarDescripcion : T.verDescripcion
		}), desc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Detalle_module_default.tituloCompleto),
			children: p.m.producto.titulo
		}) : null] }) : null]
	});
}
function Cifras(p) {
	const v = p.m.ventas_producto;
	const global = p.m.producto.unidades_vendidas_global;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.cifras),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FichaPrecio, {
			producto: p.m.producto,
			className: cx(Detalle_module_default.fichaPrecio)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.stats),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.stat),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Detalle_module_default.statValor),
					children: formato.numero(v.videos)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Detalle_module_default.statRotulo),
					children: T.videosProducto
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.stat),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Detalle_module_default.statValor),
					children: global !== null ? formato.numero(global) : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Detalle_module_default.statRotulo),
					children: T.vendidosGlobalCorto
				})]
			})]
		})]
	});
}
function EstaTienda(p) {
	const t = useConsulta("tienda", { key: p.m.tienda.tienda_key }).datos?.tienda;
	if (!t) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.estaTienda,
		caja: true,
		accion: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
			a: rutaTienda(t.tienda_key),
			className: cx(Detalle_module_default.enlaceAccion),
			children: T.verTienda
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.statsTienda),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.stat),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statValor),
						children: formato.dinero(t.ventas.comision_estimada_centavos)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statRotulo),
						children: T.comisionTienda
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.stat),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statValor),
						children: formato.numero(t.ventas.pedidos_validos)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statRotulo),
						children: T.pedidosTienda
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.stat),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statValor),
						children: formato.numero(t.muestras.pendientes)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.statRotulo),
						children: T.sinVideoTienda
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Detalle_module_default.porque),
			children: t.salud_porque
		})]
	});
}
function MensajeTienda(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const deLaTienda = (0, import_react.useMemo)(() => {
		const desdeCola = pendientesDeTienda(p.m, p.cola);
		if (desdeCola.length > 1) return desdeCola.map((x) => x.application_id);
		const otras = p.detalle.otras_de_la_tienda.filter((x) => x.grupo === "por_vencer" || x.grupo === "vencida" || x.grupo === "pausada").map((x) => x.application_id);
		return [p.m.application_id, ...otras];
	}, [
		p.m,
		p.cola,
		p.detalle
	]);
	const [juntas, setJuntas] = (0, import_react.useState)(null);
	const sugerida = p.detalle.plantilla_sugerida;
	const variasSugerida = sugerida === PLANTILLA_VARIAS;
	const solicitudes = deLaTienda.length > 1 && (juntas ?? variasSugerida) ? deLaTienda : [p.m.application_id];
	const plantilla = juntas === true && !variasSugerida ? PLANTILLA_VARIAS : juntas === false && variasSugerida ? PLANTILLA_UNA : sugerida;
	const enviados = avisosEnviados(p.detalle.avisos);
	const quitar = async (a) => {
		const r = await acciones.editarAviso(a.id, {
			quitado_at: ahoraS(),
			rev: a.rev
		});
		if (p.alConflicto(r)) return;
		if (r.estado === "error") toast.mostrar({
			texto: T.noSePudo,
			tono: "error"
		});
		else toast.mostrar({
			texto: T.avisoQuitado,
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.mensajeTienda,
		caja: true,
		id: "mensaje-tienda",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipCopiadoSinConfirmar, { avisos: p.m.avisos }),
			deLaTienda.length > 1 && juntas === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.pregunta),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Detalle_module_default.texto),
					children: T.unSoloMensaje(p.m.tienda.nombre, deLaTienda.length)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.preguntaAcciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "sm",
						alPulsar: () => setJuntas(true),
						children: T.siUnMensaje
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						alPulsar: () => setJuntas(false),
						children: T.soloEsta
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorMensaje, {
				tiendaKey: p.m.tienda.tienda_key,
				solicitudes,
				plantillaInicial: plantilla,
				modo: "dialogo",
				className: cx(Detalle_module_default.editor)
			}, `${plantilla}:${solicitudes.join(",")}`),
			enviados.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.subBloque),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: cx(Detalle_module_default.subTitulo),
					children: T.avisosEnviados
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Detalle_module_default.listaSimple),
					children: enviados.map((a) => {
						const promesa = a.compromisos[p.m.application_id] ?? null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cx(Detalle_module_default.filaAviso),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(Detalle_module_default.filaAvisoTexto),
								children: [T.avisoLinea(formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at), a.plantilla_id === "otro" ? T.porMiCuenta : etiquetaPlantilla(a.plantilla_id)), promesa ? ` · ${T.avisoPromesa(formato.fechaConDia(promesa))}` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								etiqueta: T.opcionesAviso,
								opciones: [{
									id: "quitar",
									etiqueta: T.quitarAviso,
									icono: "Trash2",
									peligro: true,
									alPulsar: () => void quitar(a)
								}]
							})]
						}, a.id);
					})
				})]
			}) : null
		]
	});
}
/** Nombre visible de una plantilla predeterminada (01 §4.8); las del usuario muestran su id tal cual. */
function etiquetaPlantilla(id) {
	return T.plantillas[id] ?? id;
}
function Recordatorios(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const [hoja, setHoja] = (0, import_react.useState)(false);
	const manana = epochDeFecha(sumarDias(hoyLocal(), 1), 10, 0);
	const [cuando, setCuando] = (0, import_react.useState)(manana);
	const activos = p.detalle.recordatorios.filter((r) => r.estado === "activo").sort((a, b) => a.vence_at - b.vence_at);
	const crear = async () => {
		setHoja(false);
		const r = await acciones.crearRecordatorio({
			id: nuevoId(),
			titulo: T.tituloRecordatorio(nombreDe(p.m)),
			vence_at: cuando,
			entidad: "muestra",
			entidad_id: p.m.application_id
		});
		if (p.alConflicto(r)) return;
		toast.mostrar(r.estado === "error" ? {
			texto: T.noSePudo,
			tono: "error"
		} : {
			texto: T.recordatorioCreado,
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
	};
	const hecho = async (rec) => {
		const r = await acciones.editarRecordatorio(rec.id, {
			estado: "hecho",
			rev: rec.rev
		});
		if (p.alConflicto(r)) return;
		toast.mostrar(r.estado === "error" ? {
			texto: T.noSePudo,
			tono: "error"
		} : {
			texto: T.recordatorioHecho,
			tono: "ok",
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Bloque, {
		titulo: T.recordatorios,
		accion: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			tamano: "sm",
			icono: "Bell",
			alPulsar: () => setHoja(true),
			children: T.agregarRecordatorio
		}),
		children: [activos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Detalle_module_default.vacio),
			children: T.sinRecordatorios
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(Detalle_module_default.listaSimple),
			children: activos.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cx(Detalle_module_default.filaAviso),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Detalle_module_default.filaAvisoTexto),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Bell",
							tamano: 16
						}),
						" ",
						r.titulo,
						" · ",
						T.recordatorioVence(`${formato.fechaConDia(r.vence_at)}, ${formato.hora(r.vence_at)}`)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
					icono: "Check",
					etiqueta: T.recordatorioListo,
					tamano: "sm",
					alPulsar: () => void hecho(r)
				})]
			}, r.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
			abierta: hoja,
			titulo: T.cuandoRecordatorio,
			alCerrar: () => setHoja(false),
			pie: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				anchoCompleto: true,
				alPulsar: () => void crear(),
				children: T.guardar
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Detalle_module_default.hojaCuerpo),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFechaHora, {
					etiqueta: T.cuandoRecordatorio,
					valor: cuando,
					alCambiar: setCuando,
					min: ahoraS()
				})
			})
		})]
	});
}
function Historial(p) {
	const items = [...p.detalle.historial].sort((a, b) => b.at - a.at);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bloque, {
		titulo: T.historial,
		children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Detalle_module_default.vacio),
			children: T.sinHistorial
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: cx(Detalle_module_default.historial),
			children: items.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Detalle_module_default.historialFecha),
				children: formato.fechaCorta(h.at)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				T.campoHistorial[h.campo],
				": ",
				h.antes ?? "—",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ArrowRight",
					tamano: 14
				}),
				" ",
				h.despues ?? "—"
			] })] }, `${h.campo}-${h.at}-${i}`))
		})
	});
}
function OtrasDeLaTienda(p) {
	const otras = p.detalle.otras_de_la_tienda;
	if (otras.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bloque, {
		titulo: T.otrasTienda(p.m.tienda.nombre),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(Detalle_module_default.otras),
			children: otras.map((o) => {
				const nombre = o.producto.titulo_corto ?? nombreCorto(o.producto.titulo);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: rutaDetalle(o.application_id),
					className: cx(Detalle_module_default.otra),
					reemplazar: true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: o.producto.imagen,
						alt: nombre,
						anchoCss: 48,
						tienda: p.m.tienda.nombre,
						categoria: o.producto.categoria,
						radio: "sm",
						className: cx(Detalle_module_default.otraFoto)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(Detalle_module_default.otraTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Detalle_module_default.otraNombre),
							children: nombre
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Detalle_module_default.atenuado),
							children: o.etiqueta
						})]
					})]
				}) }, o.application_id);
			})
		})
	});
}
/** «hoy, 6:04 p. m.» o «12 nov, 6:04 p. m.» (01 §4.3 punto 8). */
function cuandoSync(t) {
	if (t === null || t === void 0) return T.sinActualizar;
	return formato.fechaCorta(t) === formato.fechaCorta(ahoraS()) ? T.hoyHora(formato.hora(t)) : `${formato.fechaCorta(t)}, ${formato.hora(t)}`;
}
function DatosTecnicos(p) {
	const toast = useToast();
	const sesion = useConsulta("sesion", {});
	const copiar = (texto) => {
		copiarTexto(texto).then((ok) => toast.mostrar({
			texto: ok ? T.copiado : T.noSePudoCopiar,
			tono: ok ? "ok" : "error",
			duracion_ms: 2500
		}));
	};
	const filas = [
		[
			T.idSolicitud,
			p.m.application_id,
			true
		],
		[
			T.idProducto,
			p.m.producto.product_id,
			true
		],
		[
			T.categoria,
			p.m.producto.categoria ?? "—",
			false
		],
		[
			T.estadoApi,
			[p.m.estado_api, p.m.cumplimiento].filter(Boolean).join(" · "),
			false
		],
		[
			T.filtros,
			p.m.filtros_que_la_devolvieron.join(", ") || "—",
			false
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: cx(Detalle_module_default.tecnicos),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: cx(Detalle_module_default.tecnicosResumen),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "ChevronRight",
				tamano: 16,
				className: cx(Detalle_module_default.tecnicosFlecha)
			}), T.datosTecnicos]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: cx(Detalle_module_default.datos),
			children: [
				filas.map(([k, v, mono]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: k }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: mono ? Detalle_module_default.mono : void 0,
					children: [v, mono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
						icono: "Copy",
						etiqueta: `${T.copiar} ${k}`,
						tamano: "sm",
						alPulsar: () => copiar(v)
					}) : null]
				})] }, k)),
				p.m.producto.enlace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.enlaceProducto }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: cx(Detalle_module_default.mono),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.cortado),
						children: p.m.producto.enlace
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
						icono: "Copy",
						etiqueta: `${T.copiar} ${T.enlaceProducto}`,
						tamano: "sm",
						alPulsar: () => copiar(p.m.producto.enlace ?? "")
					})]
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.ultimaActualizacion }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: cuandoSync(sesion.datos?.datos.ultima_sync_ok_at) })] })
			]
		})]
	});
}
function CuerpoDetalle(p) {
	const { m, detalle } = p;
	const programo = useConsulta("preferencias", {}).datos?.programo_mis_videos ?? false;
	const compacto = p.modo === "panel";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(compacto ? Detalle_module_default.cuerpoPanel : Detalle_module_default.cuerpoCompleto),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.chips),
				children: [
					p.tiktokEnFoto ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTok, { muestra: m }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipAvance, { avance: m.avance }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipPromesa, {
						avisos: m.avisos,
						etapa: m.avance.etapa
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipVitrina, { enVitrina: m.producto.en_vitrina }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazones, {
						muestra: m,
						maximo: 2
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifras, { m }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TuAvance, {
				m,
				detalle,
				programo,
				children: p.accionesAvance
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TikTokDice, { m }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParaTuVideo, { m }),
			detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaVentasProducto, { detalle }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstaTienda, { m }),
			detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MensajeTienda, {
				m,
				detalle,
				cola: p.cola,
				alConflicto: p.alConflicto
			}) : null,
			detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recordatorios, {
				m,
				detalle,
				alConflicto: p.alConflicto
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "notas-muestra",
				className: cx(Detalle_module_default.bloque),
				"aria-label": T.notas,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
					entidad: "muestra",
					entidadId: m.application_id,
					titulo: T.notas
				})
			}),
			detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Historial, { detalle }) : null,
			detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtrasDeLaTienda, {
				m,
				detalle
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatosTecnicos, { m })
		]
	});
}
/**
* Panel de detalle de 480 a la derecha de la cola (Windows ≥ 1280, C5/C41; 01 §4.2 «Escritorio», 02 §7.12, lienzo
* Muestras.png). Va EN LÍNEA junto a la lista (no tapa la cola ni atrapa el foco) para que J/K cambien de muestra sin
* cerrarlo (01 §4.2). Arriba manda la foto (con el chip «TikTok:» sobre su velo) y flotan ⤢ «Abrir en página completa»
* y ✕; al hacer scroll aparece el encabezado fijo con miniatura y nombre corto (02 §7.12). Halo del color dominante
* detrás del título; pie fijo con la acción principal de la etapa, «Avisar a la tienda» y ⋯.
* El panel ocupa todo el alto libre (--panel-alto) y es un contenedor de tamaño («panel-detalle»): la foto toma el alto
* que sobra después del pie y del encabezado de texto, así el título nunca queda cortado por el borde del área de scroll.
*/
var MARGEN_INFERIOR = 16;
var SEPARACION_CABEZA = 12;
/**
* Con la tarjeta global abajo en una ventana de 800 de alto quedan ~300 px: pie y encabezado (miniatura, rótulo, título
* y tienda) a la vista, sin encimarse con la tarjeta.
*/
var ALTO_MINIMO = 280;
/**
* El panel es pegajoso (sticky) bajo el encabezado, pero en reposo empieza más abajo (debajo de la franja y la barra de
* herramientas): con un alto fijo de «toda la ventana», su pie con la acción principal quedaba fuera de la vista hasta
* desplazar la página. Aquí su alto máximo es lo que queda libre de su borde superior al fondo de la ventana (o de su
* tope pegajoso, una vez pegado): el pie siempre se ve y el contenido del panel se desplaza por dentro. Si una capa
* global anclada abajo (la tarjeta «¿Le enviaste el mensaje…?») cae sobre el panel, el panel termina encima de ella en
* vez de quedar con el pie tapado (se mide contra el panel «a todo lo alto», así no oscila al encogerse).
*/
function useAltoLibre(el) {
	(0, import_react.useEffect)(() => {
		if (!el || typeof window === "undefined") return void 0;
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const cabeza = altoCabezaPegajosa(el);
			if (cabeza > 0) el.style.top = `${cabeza + SEPARACION_CABEZA}px`;
			const tope = Number.parseFloat(getComputedStyle(el).top) || 0;
			const r = el.getBoundingClientRect();
			const arriba = Math.max(r.top, tope);
			const alto = window.innerHeight;
			const completo = new DOMRect(r.left, arriba, r.width, Math.max(0, alto - arriba - MARGEN_INFERIOR));
			const abajo = Math.max(MARGEN_INFERIOR, holguraContra(completo, capasFijas(el), alto));
			el.style.setProperty("--panel-alto", `${Math.max(ALTO_MINIMO, Math.floor(alto - arriba - abajo))}px`);
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(medir);
		};
		medir();
		const o = typeof MutationObserver === "undefined" ? null : new MutationObserver(pedir);
		o?.observe(document.body, {
			childList: true,
			subtree: true
		});
		document.addEventListener("scroll", pedir, {
			capture: true,
			passive: true
		});
		document.addEventListener("animationend", pedir, true);
		window.addEventListener("resize", pedir);
		return () => {
			o?.disconnect();
			document.removeEventListener("scroll", pedir, { capture: true });
			document.removeEventListener("animationend", pedir, true);
			window.removeEventListener("resize", pedir);
			if (cuadro) window.cancelAnimationFrame(cuadro);
		};
	}, [el]);
}
function irANotas$1() {
	const el = typeof document === "undefined" ? null : document.getElementById("notas-muestra");
	el?.scrollIntoView?.({
		block: "start",
		behavior: "smooth"
	});
	el?.querySelector("textarea, input, button")?.focus({ preventScroll: true });
}
function ContenidoPanel(p) {
	const { m, detalle } = p;
	const control = useControlMuestra();
	const conflicto = useConflicto();
	const halo = rgbDeHex(useMetaImagen$1(m.producto.imagen)?.color);
	const nombre = nombreVisible(m, detalle);
	const menu = useMenuMuestra(m, irANotas$1);
	useAtajosDetalle(m, nombre, irANotas$1, true);
	const scroll = (0, import_react.useRef)(null);
	const titulo = (0, import_react.useRef)(null);
	const [compacto, setCompacto] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		scroll.current?.scrollTo?.({ top: 0 });
		setCompacto(false);
		const el = titulo.current;
		const raiz = scroll.current;
		if (!el || !raiz || typeof IntersectionObserver === "undefined") return void 0;
		const o = new IntersectionObserver(([e]) => setCompacto(e ? !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0) : false), {
			root: raiz,
			threshold: 0
		});
		o.observe(el);
		return () => o.disconnect();
	}, [m.application_id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.panelCabeza),
			"data-visible": compacto ? "" : void 0,
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: m.producto.imagen,
				alt: "",
				anchoCss: 40,
				tienda: m.tienda.nombre,
				categoria: m.producto.categoria,
				radio: "sm",
				className: cx(Detalle_module_default.panelMini)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Detalle_module_default.panelNombre),
				children: nombre
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.panelControles, "glass"),
			"data-sobre-foto": compacto ? void 0 : "",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "Maximize2",
				etiqueta: T.expandir,
				tamano: "sm",
				alPulsar: () => navegar(`${rutaDetalle(m.application_id)}?completa=1`)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "X",
				etiqueta: T.cerrar,
				tamano: "sm",
				alPulsar: p.alCerrar
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: scroll,
			className: cx(Detalle_module_default.panelScroll),
			children: [
				conflicto.vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoConflicto, {
					vigente: conflicto.vigente,
					alCerrar: conflicto.limpiar
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.panelHeroe),
					style: halo ? vars({ "--halo": halo }) : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Detalle_module_default.panelFoto),
						"data-halo": halo ? "" : void 0,
						"data-foto-panel": "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cx(Detalle_module_default.panelFotoCaja),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
									url: m.producto.imagen,
									alt: nombre,
									anchoCss: 440,
									proporcion: "1:1",
									tienda: m.tienda.nombre,
									categoria: m.producto.categoria,
									radio: "lg",
									prioridad: "alta",
									arrastrable: { nombreArchivo: `${nombre}.jpg` },
									className: cx(Detalle_module_default.panelFotoImg)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Detalle_module_default.panelFotoVelo),
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Detalle_module_default.panelFotoChip),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTok, { muestra: m })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: titulo,
						className: cx(Detalle_module_default.encabezadoTexto),
						"data-halo": halo ? "" : void 0,
						"data-encabezado-panel": "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rotulo, {
								m,
								conTienda: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TituloEditable, {
								m,
								detalle,
								nivel: "h2",
								alConflicto: conflicto.anotar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineaTienda, { m }),
							p.fuente === "copia" && p.copiaAt !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(Detalle_module_default.copia),
								children: T.datosCopia(`${formato.fechaCorta(p.copiaAt)}, ${formato.hora(p.copiaAt)}`)
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuerpoDetalle, {
					m,
					detalle,
					modo: "panel",
					cola: p.cola,
					tiktokEnFoto: true,
					alConflicto: conflicto.anotar
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: cx(Detalle_module_default.panelPie),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
					muestra: m,
					tamano: "md",
					anchoCompleto: true,
					className: cx(Detalle_module_default.pieAccion)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					icono: "MessageCircle",
					alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }),
					children: T.avisarTienda
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
					etiqueta: T.masAcciones,
					opciones: menu
				})
			]
		})
	] });
}
function PanelDetalle(p) {
	const [aside, setAside] = (0, import_react.useState)(null);
	useAltoLibre(aside);
	const consulta = useConsulta("muestra", { id: p.id });
	const detalle = consulta.datos?.muestra.application_id === p.id ? consulta.datos : void 0;
	const m = detalle?.muestra ?? p.muestraLista;
	let contenido;
	if (m) contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoPanel, {
		m,
		detalle,
		cola: p.cola,
		fuente: consulta.fuente,
		copiaAt: consulta.copia_at,
		alCerrar: p.alCerrar
	});
	else if (consulta.error?.codigo === "necesita_pc") contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecesitaPc, {
		alReintentar: () => void consulta.refrescar(),
		className: cx(Detalle_module_default.panelEstado)
	});
	else if (consulta.error) contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Detalle_module_default.panelEstado),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleHelp",
			titulo: T.noEncontradaTitulo,
			texto: T.noEncontradaTexto,
			accion: {
				etiqueta: T.cerrar,
				alPulsar: p.alCerrar
			}
		})
	});
	else contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.panelEsqueleto),
		"aria-busy": "true",
		"aria-label": T.contextoCargando,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "foto",
				ancho: "100%",
				alto: 300
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				ancho: "40%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "85%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 3
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		ref: setAside,
		className: cx(Detalle_module_default.panel),
		"aria-label": T.detalleEtiqueta,
		"data-panel-muestra": p.id,
		children: contenido
	});
}
/**
* Muestras › Pendientes (01 §4.2): encabezado con pestañas, franja de progreso («Te faltan {n}»), barra de
* herramientas (búsqueda, filtros, agrupar, ordenar, vista), la cola en secciones con su lista ESTABLE («Hay un orden
* nuevo · Actualizar»), selección múltiple, la oferta única «¿Reordenamos tu plan?» y el paso de recorrido 'muestras'.
* Windows: lista | tabla | tablero, teclado J/K/E/P/L/C/Enter/Esc y panel de 480 a la derecha (≥ 1280).
* Android (y ventanas compactas): tarjetas a todo lo ancho, deslizables, mantener presionado = selección múltiple y
* un solo botón flotante extendido.
*/
var idDe = (m) => m.application_id;
var huellaDe = (m) => [
	m.grupo,
	m.avance.etapa,
	m.avance.fecha_planeada ?? "",
	m.avisos.promesa ?? "",
	m.prioridad ?? ""
].join("|");
function enGrid() {
	const a = typeof document === "undefined" ? null : document.activeElement;
	return a instanceof HTMLElement && a.closest("[role=\"grid\"]") !== null;
}
/** Enter abre la muestra del cursor solo si el foco no está en un control (un botón ya hace lo suyo con Enter). */
function focoLibre() {
	const a = typeof document === "undefined" ? null : document.activeElement;
	return !(a instanceof HTMLElement) || a === document.body || a.closest("button, a, input, select, textarea, [role=\"menu\"], [role=\"dialog\"]") === null;
}
function Pendientes(p) {
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const movil = android || clase === "compacta";
	const control = useControlMuestra();
	const sync = useSync();
	const recorrido = useRecorrido("muestras");
	const cola = useCola();
	const oferta = useOfertaReordenar(cola);
	const preferencias = useConsulta("preferencias", {});
	const [prefs, cambiarPrefs] = usePreferenciasCola();
	const [vistaEnlace, setVistaEnlace] = useParametro("vista");
	const vistaPedida = VISTAS.includes(vistaEnlace ?? "") ? vistaEnlace : null;
	const vista = movil ? "lista" : vistaPedida ?? prefs.vista ?? "lista";
	const cambiarVista = (0, import_react.useCallback)((v) => {
		cambiarPrefs({ vista: v });
		if (vistaEnlace !== null) setVistaEnlace(null, { reemplazar: true });
	}, [
		cambiarPrefs,
		vistaEnlace,
		setVistaEnlace
	]);
	const [refColumna, anchoColumna] = useAncho();
	const [pildoraOrden, setPildoraOrden] = (0, import_react.useState)(null);
	useTopeBajoCabeza(pildoraOrden, 8);
	const todasLasColumnas = (0, import_react.useMemo)(() => columnasMuestras("pendientes"), []);
	const ajuste = (0, import_react.useMemo)(() => columnasQueCaben(todasLasColumnas, anchoColumna, AJUSTE_PENDIENTES), [todasLasColumnas, anchoColumna]);
	const vistaEfectiva = vista === "tabla" && !ajuste.caben ? "lista" : vista;
	const [colapsadas, setColapsadas] = (0, import_react.useState)({});
	const [cursor, setCursor] = (0, import_react.useState)(null);
	const [marcadas, setMarcadas] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [modoSeleccion, setModoSeleccion] = (0, import_react.useState)(false);
	const seleccion = p.idAbierto ?? cursor;
	const novedades = useNovedades("muestras-pendientes", cola.consulta.datos ? cola.items : void 0, idDe, huellaDe);
	const { marcarVistos } = novedades;
	const marcarRef = (0, import_react.useRef)(marcarVistos);
	marcarRef.current = marcarVistos;
	(0, import_react.useEffect)(() => () => marcarRef.current(), []);
	const filtradas = (0, import_react.useMemo)(() => ordenar(filtrar(cola.items, prefs.filtros), prefs.orden), [
		cola.items,
		prefs.filtros,
		prefs.orden
	]);
	const secciones = (0, import_react.useMemo)(() => seccionar(filtradas, prefs.agrupar, ETIQUETA_ETAPA, cola.prioridades), [
		filtradas,
		prefs.agrupar,
		cola.prioridades
	]);
	/** Sin filtros: ¿queda algo de trabajo (falta avisar, en revisión…) aunque no haya pendientes? */
	const seccionesBase = (0, import_react.useMemo)(() => seccionar(cola.items, "prioridad", ETIQUETA_ETAPA, cola.prioridades), [cola.items, cola.prioridades]);
	const estaColapsada = (0, import_react.useCallback)((s) => colapsadas[s.id] ?? s.colapsadaPorOmision, [colapsadas]);
	/** Orden visible de arriba abajo (J/K, la tabla y «Nº en tu cola» del panel). */
	const plano = (0, import_react.useMemo)(() => secciones.flatMap((s) => estaColapsada(s) ? [] : s.muestras), [secciones, estaColapsada]);
	const abierta = (0, import_react.useMemo)(() => p.idAbierto ? cola.items.find((m) => m.application_id === p.idAbierto) ?? null : null, [cola.items, p.idAbierto]);
	const actual = (0, import_react.useMemo)(() => seleccion ? cola.items.find((m) => m.application_id === seleccion) ?? null : null, [cola.items, seleccion]);
	const abrir = (0, import_react.useCallback)((m, reemplazar = false) => {
		setCursor(m.application_id);
		navegar(rutaDetalle(m.application_id), reemplazar ? { reemplazar: true } : {});
	}, []);
	const cerrarPanel = (0, import_react.useCallback)(() => navegar("/muestras", { reemplazar: true }), []);
	const mover = (0, import_react.useCallback)((delta) => {
		if (plano.length === 0) return;
		const i = seleccion ? plano.findIndex((m) => m.application_id === seleccion) : -1;
		const destino = plano[Math.max(0, Math.min(plano.length - 1, i < 0 ? 0 : i + delta))];
		if (!destino) return;
		if (p.idAbierto && p.conPanel) abrir(destino, true);
		else setCursor(destino.application_id);
		if (typeof document !== "undefined") document.querySelector(`[data-muestra="${destino.application_id}"]`)?.scrollIntoView?.({ block: "nearest" });
	}, [
		plano,
		seleccion,
		p.idAbierto,
		p.conPanel,
		abrir
	]);
	const marcar = (0, import_react.useCallback)((id, si) => {
		setMarcadas((prev) => {
			const s = new Set(prev);
			if (si) s.add(id);
			else s.delete(id);
			return s;
		});
	}, []);
	const quitarSeleccion = (0, import_react.useCallback)(() => {
		setMarcadas(/* @__PURE__ */ new Set());
		setModoSeleccion(false);
	}, []);
	const entrarSeleccion = (0, import_react.useCallback)((id) => {
		setModoSeleccion(true);
		marcar(id, true);
	}, [marcar]);
	(0, import_react.useEffect)(() => {
		if (!modoSeleccion && marcadas.size === 0) return void 0;
		return registrarAtras(() => {
			quitarSeleccion();
			return true;
		});
	}, [
		modoSeleccion,
		marcadas.size,
		quitarSeleccion
	]);
	const elegidas = (0, import_react.useMemo)(() => cola.items.filter((m) => marcadas.has(m.application_id)), [cola.items, marcadas]);
	const conSeleccion = () => actual !== null;
	useAtajos([
		{
			teclas: "j",
			descripcion: "Siguiente muestra",
			accion: () => mover(1),
			cuando: () => !enGrid()
		},
		{
			teclas: "k",
			descripcion: "Muestra anterior",
			accion: () => mover(-1),
			cuando: () => !enGrid()
		},
		{
			teclas: "Enter",
			descripcion: "Abrir el detalle",
			accion: () => actual && abrir(actual),
			cuando: () => conSeleccion() && !enGrid() && focoLibre() && !p.idAbierto
		},
		{
			teclas: "e",
			descripcion: "Hacer la acción principal",
			accion: () => actual && void control.accionPrincipal(actual),
			cuando: conSeleccion
		},
		{
			teclas: "p",
			descripcion: "Planear la muestra",
			accion: () => actual && void control.planear(actual),
			cuando: conSeleccion
		},
		{
			teclas: "l",
			descripcion: "Video listo",
			accion: () => actual && void control.cambiarEtapa(actual, "video_listo"),
			cuando: conSeleccion
		},
		{
			teclas: "c",
			descripcion: "Abrir mensaje para la tienda",
			accion: () => actual && control.abrirMensaje({ solicitud: actual.application_id }),
			cuando: conSeleccion
		},
		{
			teclas: "Escape",
			descripcion: "Cerrar el panel",
			accion: cerrarPanel,
			cuando: () => p.idAbierto !== null && p.conPanel && document.querySelector("[role=\"dialog\"], [role=\"menu\"]") === null
		}
	], !android);
	const { consulta } = cola;
	const lista = consulta.datos !== void 0;
	const pendientes = cola.conteos.pendientes;
	const accion = accionPrincipalCola(cola.plan, cola.conteos.tiendas_por_avisar, pendientes);
	const irAccion = (a) => {
		if (a === "armar_plan") navegar(RUTA_PLAN);
		else if (a === "avisar") navegar(RUTA_AVISOS);
		else if (a === "sesion") navegar(RUTA_SESION);
	};
	const contexto = !lista ? T.contextoCargando : movil ? T.contextoMovil(formato.numero(pendientes), formato.numero(cola.conteos.tiendas_con_pendientes), pendientes, cola.conteos.tiendas_con_pendientes) : T.contexto(formato.numero(pendientes), formato.numero(cola.conteos.tiendas_con_pendientes), formato.numero(cola.porGrupo.entregada ?? 0), formato.numero(cola.porGrupo.sin_envio ?? 0), pendientes, cola.conteos.tiendas_con_pendientes, cola.porGrupo.entregada ?? 0);
	const pestanasEnCabeza = pestanasArriba(movil, clase);
	const pestanas = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PestanasMuestras, {
		activa: "pendientes",
		className: cx(pestanasEnCabeza ? Muestras_module_default.pestanasCabeza : movil ? Muestras_module_default.pestanasMovil : Muestras_module_default.pestanas)
	});
	const selectorVista = movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
		etiqueta: T.vistaEtiqueta,
		valor: vista,
		alCambiar: cambiarVista,
		opciones: [
			{
				valor: "lista",
				etiqueta: T.vista.lista
			},
			{
				valor: "tabla",
				etiqueta: T.vista.tabla
			},
			{
				valor: "tablero",
				etiqueta: T.vista.tablero
			}
		]
	});
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo: T.titulo,
		contexto,
		...pestanasEnCabeza ? { acciones: pestanas } : {}
	});
	let cuerpo;
	if (!lista) {
		if (consulta.error?.codigo === "necesita_pc") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecesitaPc, { alReintentar: () => void consulta.refrescar() });
		else if (consulta.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
			error: consulta.error,
			alReintentar: () => void consulta.refrescar()
		});
		else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoCola, { conPanel: p.conPanel && p.idAbierto !== null });
	} else if (cola.items.length === 0 && Object.values(cola.porGrupo).every((n) => !n)) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Muestras_module_default.estadoCentro),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Package",
			titulo: T.nuncaTitulo,
			texto: T.nuncaTexto,
			...sync.puede ? { accion: {
				etiqueta: T.sincronizarAhora,
				alPulsar: () => void sync.sincronizar()
			} } : {}
		})
	});
	else if (pendientes === 0 && seccionesBase.every((s) => s.id === "no_hacer")) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlDia, {
		publicadas: cola.conteos.publicadas,
		tiendas: cola.conteos.tiendas_avisadas,
		alVerHistorial: () => navegar(RUTA_TODAS)
	});
	else {
		const sinResultados = filtradas.length === 0;
		const colaVista = vistaEfectiva === "tabla" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablaCola, {
			filas: plano,
			columnas: ajuste.columnas,
			seleccionada: seleccion,
			esNueva: novedades.esNuevo,
			alSeleccionar: (m) => p.idAbierto && p.conPanel ? abrir(m, true) : setCursor(m.application_id),
			alAbrir: (m) => abrir(m)
		}) : vistaEfectiva === "tablero" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableroCola, {
			muestras: filtradas,
			seleccionada: seleccion,
			alAbrir: (m) => abrir(m)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaCola, {
			secciones,
			colapsada: estaColapsada,
			alColapsar: (s, c) => setColapsadas((prev) => ({
				...prev,
				[s.id]: c
			})),
			seleccionada: seleccion,
			marcadas,
			modoSeleccion: modoSeleccion || !android && marcadas.size > 0,
			movil,
			android,
			esNueva: novedades.esNuevo,
			alAbrir: (m) => modoSeleccion ? marcar(m.application_id, !marcadas.has(m.application_id)) : abrir(m),
			alMarcar: marcar,
			alMantener: entrarSeleccion
		});
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraHerramientas, {
				prefs,
				alCambiar: cambiarPrefs,
				items: cola.items,
				movil,
				ordenProvisional: cola.ordenProvisional,
				selectorVista
			}),
			cola.hayOrdenNuevo && !oferta.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: setPildoraOrden,
				className: cx(Muestras_module_default.ordenNuevo),
				role: "status",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "ArrowDownUp",
						tamano: 16
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.ordenNuevo }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						alPulsar: cola.aplicarOrdenNuevo,
						children: T.actualizar
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Muestras_module_default.contenedorCuerpo),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: p.conPanel && p.idAbierto ? Muestras_module_default.cuerpoConPanel : Muestras_module_default.cuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: refColumna,
						className: cx(Muestras_module_default.columnaCola),
						"data-vista": vistaEfectiva,
						children: sinResultados ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cx(Muestras_module_default.estadoCentro),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
								icono: "Search",
								titulo: T.sinResultadosTitulo,
								accion: {
									etiqueta: T.limpiarFiltros,
									alPulsar: () => cambiarPrefs({ filtros: FILTROS_VACIOS })
								}
							})
						}) : colaVista
					}), p.conPanel && p.idAbierto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelDetalle, {
						id: p.idAbierto,
						muestraLista: abierta,
						cola: plano.length > 0 ? plano : cola.items,
						alCerrar: cerrarPanel,
						alAbrir: (m) => abrir(m, true)
					}) : null]
				})
			})
		] });
	}
	const conBarraSel = marcadas.size > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo: T.titulo,
		lista,
		className: cx(Muestras_module_default.pantalla),
		children: [
			encabezado,
			pestanasEnCabeza ? null : pestanas,
			lista && consulta.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerCache, {
				fechaAt: cola.ultimaSyncAt,
				alReintentar: () => void consulta.refrescar()
			}) : null,
			oferta.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfertaReordenar, {
				alReordenar: () => void oferta.reordenar(),
				alDejar: oferta.dejarAsi
			}) : null,
			lista && pendientes > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BurbujaRecorrido, {
				visible: recorrido.visible,
				texto: recorrido.texto,
				esUltimo: recorrido.esUltimo,
				alSiguiente: recorrido.siguiente,
				alEntendido: recorrido.entendido,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FranjaProgreso, {
					conteos: cola.conteos,
					plan: cola.plan,
					movil,
					programo: preferencias.datos?.programo_mis_videos ?? false
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Muestras_module_default.cuerpoVista, consulta.refrescando && Muestras_module_default.refrescando),
				children: cuerpo
			}),
			conBarraSel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraSeleccion, {
				muestras: elegidas,
				todas: cola.items,
				hoy: cola.hoy,
				movil,
				alQuitar: quitarSeleccion
			}) : null,
			movil && accion && lista && !conBarraSel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flotante, {
				className: cx(Muestras_module_default.fab),
				alTaparse: "ocultar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: accion === "armar_plan" ? "CalendarDays" : accion === "avisar" ? "MessageCircle" : "Clapperboard",
					alPulsar: () => irAccion(accion),
					children: accion === "armar_plan" ? T.armarPlan : accion === "avisar" ? T.avisarTiendas : T.sesionCorta
				})
			}) : null
		]
	});
}
function volver() {
	if (typeof window !== "undefined" && window.history.length > 1) atras();
	else navegar(RUTA_PENDIENTES, { reemplazar: true });
}
function irANotas() {
	(typeof document === "undefined" ? null : document.getElementById("notas-muestra"))?.scrollIntoView?.({
		block: "start",
		behavior: "smooth"
	});
}
function Contenido(p) {
	const { m, detalle } = p;
	const control = useControlMuestra();
	const conflicto = useConflicto();
	const halo = rgbDeHex(useMetaImagen$1(m.producto.imagen)?.color);
	const nombre = nombreVisible(m, detalle);
	const menu = useMenuMuestra(m, irANotas);
	const cola = useConsulta("muestras", PARAMS_PENDIENTES).datos?.items ?? [];
	useAtajosDetalle(m, nombre, irANotas, !p.movil);
	const copia = p.fuente === "copia" && p.copiaAt !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cx(Detalle_module_default.copia),
		children: T.datosCopia(`${formato.fechaCorta(p.copiaAt)}, ${formato.hora(p.copiaAt)}`)
	}) : null;
	const acciones = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.accionesFila),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Detalle_module_default.accionAncha),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
					muestra: m,
					tamano: "md",
					anchoCompleto: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				icono: "MessageCircle",
				alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }),
				children: T.avisarTienda
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				etiqueta: T.masAcciones,
				opciones: menu
			})
		]
	});
	if (p.movil) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.completoMovil),
		"data-detalle-muestra": m.application_id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.heroe),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: m.producto.imagen,
						alt: nombre,
						anchoCss: 420,
						proporcion: "1:1",
						tienda: m.tienda.nombre,
						categoria: m.producto.categoria,
						radio: "xs",
						prioridad: "alta",
						className: cx(Detalle_module_default.heroeFoto)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.heroeVelo),
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cx(Detalle_module_default.heroeAtras),
						"aria-label": T.atras,
						onClick: volver,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronLeft",
							tamano: 22
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Detalle_module_default.heroeChip),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTok, { muestra: m })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Detalle_module_default.completoMovilCuerpo),
				children: [
					conflicto.vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoConflicto, {
						vigente: conflicto.vigente,
						alCerrar: conflicto.limpiar
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Detalle_module_default.encabezadoTexto),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rotulo, {
								m,
								conTienda: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TituloEditable, {
								m,
								detalle,
								nivel: "h1",
								alConflicto: conflicto.anotar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineaTienda, { m }),
							copia
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuerpoDetalle, {
						m,
						detalle,
						modo: "completo",
						cola,
						tiktokEnFoto: true,
						alConflicto: conflicto.anotar
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Flotante, {
				className: cx(Detalle_module_default.barraAcciones, "glass"),
				role: "toolbar",
				"aria-label": T.accionesMuestra,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
						muestra: m,
						tamano: "lg",
						anchoCompleto: true,
						className: cx(Detalle_module_default.barraPrincipal)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "lg",
						alPulsar: () => control.abrirMensaje({ solicitud: m.application_id }),
						children: T.avisar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
						etiqueta: T.masAcciones,
						opciones: menu,
						className: cx(Detalle_module_default.barraMas)
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Detalle_module_default.completoAncho),
		"data-detalle-muestra": m.application_id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Detalle_module_default.columnaFoto),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Detalle_module_default.fotoAncha),
				style: halo ? vars({ "--halo": halo }) : void 0,
				"data-halo": halo ? "" : void 0,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombre,
					anchoCss: 360,
					proporcion: "4:5",
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria,
					radio: "xl",
					prioridad: "alta",
					arrastrable: { nombreArchivo: `${nombre}.jpg` }
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.columnaDatos),
			children: [
				conflicto.vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoConflicto, {
					vigente: conflicto.vigente,
					alCerrar: conflicto.limpiar
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Detalle_module_default.encabezadoTexto),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rotulo, {
							m,
							conTienda: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TituloEditable, {
							m,
							detalle,
							nivel: "h2",
							alConflicto: conflicto.anotar
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineaTienda, { m }),
						copia
					]
				}),
				acciones,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CuerpoDetalle, {
					m,
					detalle,
					modo: "completo",
					cola,
					alConflicto: conflicto.anotar
				})
			]
		})]
	});
}
function DetalleCompleto(p) {
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const movil = plataforma === "android" || clase === "compacta";
	const consulta = useConsulta("muestra", { id: p.id });
	const detalle = consulta.datos?.muestra.application_id === p.id ? consulta.datos : void 0;
	const m = detalle?.muestra;
	const titulo = m ? nombreVisible(m, detalle) : T.tituloDetalle;
	let cuerpo;
	if (m) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contenido, {
		m,
		detalle,
		movil,
		fuente: consulta.fuente,
		copiaAt: consulta.copia_at
	});
	else if (consulta.error?.codigo === "necesita_pc") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecesitaPc, { alReintentar: () => void consulta.refrescar() });
	else if (consulta.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Detalle_module_default.estadoCompleto),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleHelp",
			titulo: T.noEncontradaTitulo,
			texto: T.noEncontradaTexto,
			accion: {
				etiqueta: T.volverALaCola,
				alPulsar: () => navegar(RUTA_PENDIENTES)
			}
		})
	});
	else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.cargandoLento,
		className: cx(movil ? Detalle_module_default.esqueletoMovil : Detalle_module_default.esqueletoAncho),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "foto",
			ancho: movil ? "100%" : 320,
			alto: movil ? 340 : 400
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Detalle_module_default.esqueletoTextos),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: "30%"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "titulo",
					ancho: "80%"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: "50%"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 88
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 120
				})
			]
		})]
	});
	const mostrarEncabezado = !movil || !m;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo,
		lista: m !== void 0 || consulta.error !== null,
		className: cx(movil ? Detalle_module_default.pantallaMovil : Detalle_module_default.pantallaAncha),
		children: [mostrarEncabezado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
			titulo: T.detalleEtiqueta,
			volver: {
				a: RUTA_PENDIENTES,
				etiqueta: T.volverMuestras
			},
			...!movil && m ? { acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "X",
				etiqueta: T.cerrar,
				alPulsar: volver
			}) } : {}
		}) : null, cuerpo]
	});
}
function PantallaMuestras() {
	const ruta = useRuta();
	const panel = usePanelDisponible();
	const plataforma = usePlataforma();
	const id = ruta.params["id"] ?? null;
	const conPanel = panel && plataforma !== "android";
	const completa = ruta.consulta.get("completa") === "1";
	if (id !== null && (!conPanel || completa)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetalleCompleto, { id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pendientes, {
		idAbierto: id,
		conPanel
	});
}
var Todas_module_default = {
	pantalla: "_pantalla_6sk23_3",
	pestanasMovil: "_pestanasMovil_6sk23_10",
	pestanas: "_pestanas_6sk23_10",
	pestanasCabeza: "_pestanasCabeza_6sk23_16",
	contenido: "_contenido_6sk23_21",
	refrescando: "_refrescando_6sk23_24",
	herramientas: "_herramientas_6sk23_28",
	busqueda: "_busqueda_6sk23_36",
	chips: "_chips_6sk23_40",
	chipsDesplazables: "_chipsDesplazables_6sk23_50",
	exportar: "_exportar_6sk23_67",
	nota: "_nota_6sk23_75",
	tabla: "_tabla_6sk23_86",
	celdaEstado: "_celdaEstado_6sk23_90",
	celdaMotivo: "_celdaMotivo_6sk23_98",
	celdaProducto: "_celdaProducto_6sk23_108",
	celdaFoto: "_celdaFoto_6sk23_115",
	celdaTextos: "_celdaTextos_6sk23_119",
	celdaNombre: "_celdaNombre_6sk23_125",
	celdaSub: "_celdaSub_6sk23_134",
	celdaAvatar: "_celdaAvatar_6sk23_143",
	celdaSubTexto: "_celdaSubTexto_6sk23_146",
	tarjetas: "_tarjetas_6sk23_152",
	tarjetaFila: "_tarjetaFila_6sk23_162",
	mas: "_mas_6sk23_168",
	masTexto: "_masTexto_6sk23_178",
	estado: "_estado_6sk23_183",
	esqueleto: "_esqueleto_6sk23_188",
	esqueletoChips: "_esqueletoChips_6sk23_193"
};
var HORAS_48 = 172800;
/** El motivo solo se agrega si dice algo más que el nombre del grupo. */
function motivoUtil(m) {
	const motivo = m.motivo.trim();
	if (!motivo) return null;
	const grupo = ETIQUETA_GRUPO[m.grupo];
	return sinAcentos(motivo).toLowerCase() === sinAcentos(grupo).toLowerCase() ? null : motivo;
}
function CeldaEstado(p) {
	const { m } = p;
	const urgente = m.grupo === "por_vencer" && m.fecha_limite_at !== null && m.fecha_limite_at - ahoraS() < HORAS_48;
	const motivo = motivoUtil(m);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Todas_module_default.celdaEstado),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			tono: urgente ? "critico" : TONO_GRUPO[m.grupo],
			icono: ICONO_GRUPO[m.grupo],
			children: ETIQUETA_GRUPO[m.grupo]
		}), motivo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Todas_module_default.celdaMotivo),
			title: motivo,
			children: motivo
		}) : null]
	});
}
function CeldaProductoPlegada(p) {
	const { m } = p;
	const nombre = nombreDe(m);
	const sub = m.variante ? `${m.tienda.nombre} · ${m.variante}` : m.tienda.nombre;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Todas_module_default.celdaProducto),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: m.producto.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: m.tienda.nombre,
			categoria: m.producto.categoria,
			className: cx(Todas_module_default.celdaFoto)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(Todas_module_default.celdaTextos),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Todas_module_default.celdaNombre),
				title: m.producto.titulo ?? nombre,
				children: nombre
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(Todas_module_default.celdaSub),
				title: sub,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
					nombre: m.tienda.nombre,
					tamano: 16,
					className: cx(Todas_module_default.celdaAvatar)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Todas_module_default.celdaSubTexto),
					children: sub
				})]
			})]
		})]
	});
}
/**
* Muestras › Todas (historial, 01 §4.7): chips de grupo con conteo (solo los que tienen más de 0), búsqueda, tabla
* completa en escritorio (columnasMuestras('todas'), ordenable por cualquier columna; por omisión Solicitada de la más
* reciente a la más antigua) y tarjetas en el celular (de 24 en 24, sin «Nº en tu cola»). Con «Sin envío»: el
* desglose de por qué no debes nada.
* [Exportar CSV] con csvMuestras (UTF-8 con BOM) y guardarArchivo: Windows abre el diálogo Guardar; Android comparte.
* Casilla «Incluir mis notas, mi avance y mis avisos».
*/
var SIN_PARAMS = {};
var PASO_TARJETAS = 24;
/** En el historial no hay «Nº en tu cola» (las tarjetas van por fecha de solicitud, no en el orden de la cola). */
function sinPosicion(m) {
	return m.posicion_cola === null ? m : {
		...m,
		posicion_cola: null
	};
}
/** Primera columna de fecha de solicitud (la que ordena por omisión, de la más reciente a la más antigua). */
function columnaSolicitada(columnas) {
	return columnas.find((c) => /solicit/i.test(c.id))?.id ?? "solicitada";
}
function PantallaMuestrasTodas() {
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const movil = android || clase === "compacta";
	const toast = useToast();
	const sync = useSync();
	const consulta = useConsulta("muestras", SIN_PARAMS);
	const columnas = (0, import_react.useMemo)(() => columnasMuestras("todas").map((c) => c.id === "tiktok" ? {
		...c,
		celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaEstado, { m })
	} : c), []);
	const [refTabla, anchoTabla] = useAncho();
	const ajuste = (0, import_react.useMemo)(() => columnasTodas(columnas, anchoTabla, (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaProductoPlegada, { m })), [columnas, anchoTabla]);
	const conTarjetas = movil || !ajuste.caben;
	const [grupos, setGrupos] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [orden, setOrden] = (0, import_react.useState)(null);
	const [incluirLocal, setIncluirLocal] = (0, import_react.useState)(false);
	const [exportando, setExportando] = (0, import_react.useState)(false);
	const [limite, setLimite] = (0, import_react.useState)(PASO_TARJETAS);
	const [centinela, setCentinela] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => setLimite(PASO_TARJETAS), [
		grupos,
		q,
		orden
	]);
	(0, import_react.useEffect)(() => {
		if (!centinela || typeof IntersectionObserver === "undefined") return void 0;
		const o = new IntersectionObserver(([e]) => {
			if (e?.isIntersecting) setLimite((l) => l + PASO_TARJETAS);
		}, { rootMargin: "600px 0px" });
		o.observe(centinela);
		return () => o.disconnect();
	}, [centinela, limite]);
	const todas = consulta.datos?.items;
	const conteos = (0, import_react.useMemo)(() => contarPorGrupo(todas ?? []), [todas]);
	const visibles = (0, import_react.useMemo)(() => {
		const base = (todas ?? []).filter((m) => (grupos.length === 0 || grupos.includes(m.grupo)) && (!q.trim() || coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante)));
		const o = orden ?? {
			columna: columnaSolicitada(columnas),
			direccion: "desc"
		};
		return ordenarPorColumna(base, o.columna, o.direccion);
	}, [
		todas,
		grupos,
		q,
		orden,
		columnas
	]);
	const tiendas = (0, import_react.useMemo)(() => new Set((todas ?? []).map((m) => m.tienda.tienda_key)).size, [todas]);
	const soloSinEnvio = grupos.length === 1 && grupos[0] === "sin_envio";
	const desglose = (0, import_react.useMemo)(() => desgloseSinEnvio(todas ?? []), [todas]);
	const alternarOrden = (columna) => {
		setOrden((o) => {
			const actual = o ?? {
				columna: columnaSolicitada(columnas),
				direccion: "desc"
			};
			if (actual.columna !== columna) return {
				columna,
				direccion: /solicit|comision|precio|vend/i.test(columna) ? "desc" : "asc"
			};
			return {
				columna,
				direccion: actual.direccion === "asc" ? "desc" : "asc"
			};
		});
	};
	const exportar = async () => {
		setExportando(true);
		try {
			let extra;
			if (incluirLocal) {
				const [avisos, notas] = await Promise.all([consultar("avisos", {}), consultar("notas", { entidad: "muestra" })]);
				extra = {
					avisos: avisos.items,
					notas: notas.items
				};
			}
			const contenido = csvMuestras(visibles, incluirLocal, extra);
			const r = await guardarArchivo(T.nombreCsv(hoyLocal()), "text/csv", contenido);
			if (r === "guardado") toast.mostrar({
				texto: T.csvGuardado,
				tono: "ok"
			});
			else if (r === "compartido") toast.mostrar({
				texto: T.csvCompartido,
				tono: "ok"
			});
			else if (r === "error") toast.mostrar({
				texto: T.csvError,
				tono: "error"
			});
		} catch {
			toast.mostrar({
				texto: T.csvError,
				tono: "error"
			});
		} finally {
			setExportando(false);
		}
	};
	const lista = todas !== void 0;
	const arriba = pestanasArriba(movil, clase);
	const pestanas = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PestanasMuestras, {
		activa: "todas",
		className: cx(arriba ? Todas_module_default.pestanasCabeza : movil ? Todas_module_default.pestanasMovil : Todas_module_default.pestanas)
	});
	const contexto = lista ? grupos.length > 0 || q.trim() ? T.contextoFiltrado(formato.numero(visibles.length), formato.numero(todas.length)) : T.contextoTodas(formato.numero(todas.length), formato.numero(tiendas), tiendas) : T.contextoCargando;
	let cuerpo;
	if (!lista) {
		if (consulta.error?.codigo === "necesita_pc") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NecesitaPc, { alReintentar: () => void consulta.refrescar() });
		else if (consulta.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
			error: consulta.error,
			alReintentar: () => void consulta.refrescar()
		});
		else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
			textoLento: T.cargandoLento,
			className: cx(Todas_module_default.esqueleto),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Todas_module_default.esqueletoChips),
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					ancho: 96,
					alto: 32
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "fila",
				lineas: 8
			})]
		});
	} else if (todas.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Todas_module_default.estado),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Package",
			titulo: T.nuncaTitulo,
			texto: T.nuncaTexto,
			...sync.puede ? { accion: {
				etiqueta: T.sincronizarAhora,
				alPulsar: () => void sync.sincronizar()
			} } : {}
		})
	});
	else {
		const vacio = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Todas_module_default.estado),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
				icono: "Search",
				titulo: T.sinResultadosTitulo,
				accion: {
					etiqueta: T.limpiarFiltros,
					alPulsar: () => {
						setGrupos([]);
						setQ("");
					}
				}
			})
		});
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Todas_module_default.herramientas),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
						etiqueta: T.buscarEtiqueta,
						etiquetaOculta: true,
						tipo: "search",
						valor: q,
						alCambiar: setQ,
						placeholder: T.buscarPlaceholder,
						className: cx(Todas_module_default.busqueda)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(movil ? Todas_module_default.chipsDesplazables : Todas_module_default.chips),
						role: "group",
						"aria-label": T.gruposEtiqueta,
						children: ORDEN_GRUPOS_TODAS.filter((g) => (conteos[g] ?? 0) > 0).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
							activo: grupos.includes(g),
							conteo: conteos[g] ?? 0,
							alCambiar: (si) => setGrupos((x) => si ? [...x, g] : x.filter((y) => y !== g)),
							children: T.grupoPlural[g]
						}, g))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Todas_module_default.exportar),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
							marcada: incluirLocal,
							alCambiar: setIncluirLocal,
							etiqueta: T.incluirLocal
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							icono: android ? "Share2" : "Download",
							cargando: exportando,
							alPulsar: () => void exportar(),
							children: T.exportarCsv
						})]
					})
				]
			}),
			soloSinEnvio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Todas_module_default.nota),
				children: T.sinEnvioTexto(formato.numero(desglose.sinPedido), formato.numero(desglose.rechazada), formato.numero(desglose.noEnvio), formato.numero(desglose.retirada))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: refTabla,
				className: cx(Todas_module_default.contenido),
				children: visibles.length === 0 ? vacio : conTarjetas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: cx(Todas_module_default.tarjetas),
					"aria-label": T.todasEtiqueta,
					children: visibles.slice(0, limite).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cx(Todas_module_default.tarjetaFila),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
							muestra: sinPosicion(m),
							variante: "lista",
							conAccion: false,
							alAbrir: () => navegar(rutaDetalle(m.application_id))
						})
					}, m.application_id))
				}), visibles.length > limite ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: setCentinela,
					className: cx(Todas_module_default.mas),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Todas_module_default.masTexto),
						children: T.mostrando(formato.numero(limite), formato.numero(visibles.length))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "sm",
						alPulsar: () => setLimite((l) => l + PASO_TARJETAS),
						children: T.mostrarMas
					})]
				}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
					filas: visibles,
					columnas: ajuste.columnas,
					idFila: (m) => m.application_id,
					etiqueta: T.todasEtiqueta,
					orden: orden ?? {
						columna: columnaSolicitada(columnas),
						direccion: "desc"
					},
					alOrdenar: alternarOrden,
					alAbrir: (m) => navegar(rutaDetalle(m.application_id)),
					claveScroll: "muestras-todas",
					vacio,
					className: cx(Todas_module_default.tabla)
				})
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo: T.tituloTodas,
		lista,
		className: cx(Todas_module_default.pantalla),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo: T.titulo,
				contexto,
				...arriba ? { acciones: pestanas } : {}
			}),
			arriba ? null : pestanas,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: consulta.refrescando ? Todas_module_default.refrescando : void 0,
				children: cuerpo
			})
		]
	});
}
//#endregion
export { PantallaMuestras, PantallaMuestrasTodas };
