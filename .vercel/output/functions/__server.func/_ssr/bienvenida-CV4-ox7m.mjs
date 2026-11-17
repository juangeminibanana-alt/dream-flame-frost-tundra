import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ETIQUETA_PASO_SYNC, F as Foto, Gn as useClaseAncho, H as Icono, Ht as elegirArchivo, Jt as esPendiente, Kn as useConexionPc, M as Esqueleto, R as Hoja, ar as useSesion, bn as pedirPermisoNotificaciones, c as BarraProgreso, cr as useToast, er as useParametro, et as Palomita, j as ErrorHub, ln as iniciarRecorridos, m as CampoTexto, mn as nombreCorto, nn as formato, or as useSync, pn as navegar, qn as useConsulta, r as AvatarTienda, rt as Pantalla, sn as hub, tr as usePlataforma, u as Boton, un as invalidar } from "./app-CLiVRbtG.mjs";
import { O as PanelQrEmparejamiento, a as PanelPlan } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bienvenida-CV4-ox7m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Textos de la Bienvenida (01_ux §4.15 W1–W6 y A1–A6; BUILD_SPEC C35, C36, C42; 02 §2.1). Español de México.
* W2a' usa el texto NUEVO de C42 (ya no dice «Si todavía usas el panel anterior, consérvalo»).
*/
var T = {
	tituloPantalla: "Bienvenida",
	pasoDe: (n, total) => `Paso ${n} de ${total}`,
	progreso: "Avance de la bienvenida",
	rail: [
		"Bienvenida",
		"Conexión",
		"Tus datos",
		"Tu plan",
		"Celular",
		"Avisa"
	],
	cargando: "Preparando Corte…",
	w1Titulo: "Bienvenido a Corte",
	w1Texto: "Ponte al día con tus muestras, cuida a tus tiendas y entiende tus ventas de TikTok Shop. En tu PC y en tu celular.",
	w1Lista: "Lo que vamos a hacer",
	w1Pasos: [
		{
			titulo: "Conectar tu cuenta de TikTok Shop",
			texto: "Una sola vez, con tu autorización."
		},
		{
			titulo: "Traer tus datos",
			texto: "Muestras, ventas y productos. Lo que llega se ve al instante."
		},
		{
			titulo: "Armar tu plan",
			texto: "Te decimos cuándo terminas tus videos."
		},
		{
			titulo: "Emparejar tu celular",
			texto: "Para avisar a tus tiendas desde ahí."
		},
		{
			titulo: "Avisar a tus tiendas",
			texto: "Les dices qué día publicas, con una fecha que sí cumples."
		}
	],
	w1Duracion: "Tarda unos 2 minutos, sin contar la descarga de tus datos.",
	empezar: "Empezar",
	w2aTitulo: "Encontramos tu conexión anterior",
	w2aTexto: (ruta) => `Hay una conexión de TikTok Shop guardada en ${ruta}. Podemos importarla para que no tengas que autorizar de nuevo. Se guardará cifrada con tu usuario de Windows.`,
	importarSeguro: "Importar de forma segura",
	otraForma: "Conectar de otra forma",
	importando: "Importando…",
	w2a1Titulo: (u) => `Listo: conectado como @${u}`,
	w2a1TituloSinNombre: "Listo: ya estás conectado",
	w2a1Texto: "El archivo anterior guarda tus claves sin cifrar. Si lo borras, Corte será el único lugar con tu clave (también puedes volver a copiarla de Partner Center).",
	/** BUILD_SPEC C42 · texto nuevo de W2a'. */
	w2a1C42: "Desde ahora usa solo Corte: si el panel anterior también se conecta a TikTok, la conexión puede vencerse.",
	borrarAnterior: "Borrar archivo anterior",
	conservarlo: "Conservarlo",
	enPapelera: "Mandamos el archivo anterior a la Papelera.",
	w2a2Titulo: "Encontramos tu conexión anterior, pero ya venció",
	w2a2Texto: "Autoriza de nuevo (tarda menos de un minuto). La clave de la app ya quedó guardada.",
	abrirTikTok: "Abrir TikTok Shop",
	w2bTitulo: "Conecta tu cuenta de TikTok Shop",
	w2bTexto: "Necesitamos dos cosas, una sola vez: la clave de tu app de Partner Center y tu autorización. Tarda menos de un minuto.",
	claveApp: "Clave de la app",
	claveGuardada: "Guardada en esta PC, cifrada.",
	claveFalta: "De Partner Center › tu app › App secret.",
	autorizacion: "Autorización de tu cuenta",
	autorizacionTexto: "Se abre TikTok Shop en tu navegador: inicias sesión y tocas Autorizar.",
	autorizacionLista: "Lista.",
	importarArchivo: "Importar desde archivo…",
	tituloElegir: "Elige el archivo de tu conexión anterior",
	pegarClave: "Pegar clave de la app",
	claveEtiqueta: "Clave secreta de la app (App secret)",
	claveAyuda: "Se guarda cifrada en esta PC y nunca se vuelve a mostrar.",
	claveVacia: "Pega la clave secreta de tu app.",
	claveInvalida: "TikTok no reconoció la clave de la app. Revisa que sea la de Partner Center de esta app.",
	guardarClave: "Guardar clave",
	continuar: "Continuar",
	conectadoComo: (u) => `Conectado como @${u}`,
	w3Titulo: "Trayendo tus datos de TikTok Shop",
	w3Texto: "Puedes seguir: lo que ya llegó se muestra al instante.",
	w3Pista: "Se activa cuando terminan muestras, estado y productos",
	w3Lista: "Pasos de la primera sincronización",
	w3Llego: (n) => n === 1 ? "Ya llegó 1 muestra pendiente" : `Ya llegaron ${n} muestras pendientes`,
	w3Mas: (n) => `+${n}`,
	semana: (n, total) => `semana ${n} de ${total}`,
	deTotal: (n, total) => `${n} de ${total}`,
	pedidos: (n) => `${n} pedidos`,
	omitido: "no hizo falta",
	w3Error: "No pudimos traer tus muestras.",
	reintentar: "Reintentar",
	irInicioIgual: "Ir a Inicio de todos modos",
	enCursoEtiqueta: "en curso",
	hecho: "listo",
	pendiente: "pendiente",
	conError: "con error",
	w4Titulo: "Arma tu plan en 30 segundos",
	w4Texto: "Te decimos cuándo terminas y qué fecha prometer a tus tiendas.",
	saltar: "Saltar",
	w5Titulo: "Los mensajes a tus tiendas se mandan desde tu celular",
	w5Texto: "Empareja ahora para tener la lista ahí.",
	w5Deteccion: "Se detecta solo cuando el celular termina.",
	w5AvisoRedes: "Windows te preguntará si Corte puede usar la red. Elige “Redes privadas”.",
	w5MostrarCodigo: "Mostrar el código",
	ahoraNo: "Ahora no",
	emparejado: (n) => `${n} quedó emparejado`,
	w6Titulo: (fecha, n) => `Plan listo: terminas el ${fecha}. Ahora avisa a tus ${n} ${n === 1 ? "tienda" : "tiendas"}.`,
	w6TituloSinTiendas: (fecha) => `Plan listo: terminas el ${fecha}.`,
	w6TituloSinPlan: "Todo listo para empezar",
	w6TextoSinPlan: "Cuando quieras, arma tu plan desde Inicio y te decimos cuándo terminas.",
	w6ConCelular: "Abre Corte en tu celular › Avisar a mis tiendas. La lista ya está ahí.",
	w6SinCelular: "Puedes avisar desde esta PC o emparejar tu celular después.",
	w6Tiendas: "Tiendas por avisar",
	w6Mas: (n) => `y ${n} más`,
	irInicio: "Ir a Inicio",
	avisarPc: "Avisar desde esta PC",
	a1Titulo: "Corte en tu celular",
	a1Texto: "Avisa a tus tiendas, revisa tu plan y tus ventas, siempre contigo. Se conecta con Corte de tu PC.",
	a1Emparejar: "Emparejar con mi PC",
	a1SinPc: "¿Aún no lo tienes en tu PC?",
	a1SinPcTitulo: "Primero, Corte en tu PC",
	a1SinPcTexto: "Corte se instala en tu PC con Windows. Ábrelo, conecta tu cuenta de TikTok Shop y entra a Conexión y ajustes › Celular: ahí aparece el código para emparejar este celular.",
	a1Puntos: [
		{
			icono: "MessageCircle",
			texto: "Avisa a tus tiendas en 2 toques"
		},
		{
			icono: "CalendarDays",
			texto: "Tu plan y tus promesas, siempre contigo"
		},
		{
			icono: "Wifi",
			texto: "Funciona sin internet con tu última copia"
		}
	],
	a4Titulo: "Copiando tus datos…",
	a4Muestras: (n) => `${n} muestras`,
	a4Pedidos: (n) => `${n} pedidos`,
	a4Imagenes: (h, t) => `imágenes ${h} de ${t}`,
	a4Esperando: "Esperando la primera copia de tu PC…",
	a4TituloListo: "Tus datos ya están aquí",
	a4DesdePc: (pc) => `Desde ${pc}`,
	a4Listo: "Ya puedes usar Corte en este celular, incluso sin internet.",
	a4ImagenesSiguen: "Ya puedes seguir: las fotos de tus productos terminan de llegar solas.",
	a4Seguir: "Seguir",
	a5Titulo: "¿Te recordamos tus videos y tus promesas?",
	a5Texto: "Te avisamos los días que haces videos, antes de que venza una muestra y un día antes de lo que prometiste.",
	a5Activar: "Activar recordatorios",
	a5Ejemplo: "Hoy toca: 3 videos de muestras",
	a5EjemploDe: "Corte · ahora",
	a6Titulo: (n) => `Avisa a tus ${n} ${n === 1 ? "tienda" : "tiendas"} desde aquí`,
	a6Texto: "Tu plan ya tiene fechas. Te llevamos tienda por tienda: copias, pegas en TikTok y listo.",
	a6SinAvisarTitulo: "Listo: tus datos ya están en tu celular",
	a6SinAvisarTexto: "Revisa tu plan, tus muestras y tus ventas cuando quieras, incluso sin internet.",
	a6Pendientes: (n, tiendas) => `Tienes ${n} ${n === 1 ? "muestra pendiente" : "muestras pendientes"} de ${tiendas} ${tiendas === 1 ? "tienda" : "tiendas"}`,
	a6PlanDesdePc: "Cuando armes tu plan, aquí tendrás la lista para avisar a cada tienda.",
	a6Empezar: "Empezar",
	a6Despues: "Después",
	errorGenerico: "Algo no salió bien. Inténtalo de nuevo."
};
var PASOS_W = [
	"w1",
	"w2",
	"w3",
	"w4",
	"w5",
	"w6"
];
var PASOS_A = [
	"a1",
	"a2",
	"a3",
	"a4",
	"a5",
	"a6"
];
function esPasoW(v) {
	return v !== null && PASOS_W.includes(v);
}
function esPasoA(v) {
	return v !== null && PASOS_A.includes(v);
}
/** Los 9 primeros pasos de §6.3.2, en el orden de C34 (W3 los lista con sus conteos). */
var PASOS_W3 = [
	"perfil",
	"muestras",
	"cumplimientos",
	"productos",
	"ordenes",
	"vitrina",
	"detalles",
	"ordenes_anteriores",
	"productos_ventas"
];
function conteoDe(p, paso) {
	if (!p || p.estado === "pendiente") return "";
	const n = formato.numero;
	if (p.estado === "omitido") return T.omitido;
	if (paso === "perfil") return "";
	if (paso === "ordenes" || paso === "ordenes_anteriores") {
		if (p.estado === "ok" && p.nuevos > 0) return T.pedidos(n(p.nuevos));
		if (p.total !== null && p.total > 0) return T.semana(Math.min(p.hechos + (p.estado === "en_curso" ? 1 : 0), p.total), p.total);
		return "";
	}
	if (p.estado === "en_curso" && p.total !== null && p.total > 0) return T.deTotal(n(p.hechos), n(p.total));
	if (p.estado === "ok" || p.estado === "parcial") return p.hechos > 0 ? n(p.hechos) : "";
	return p.hechos > 0 ? n(p.hechos) : "";
}
function estadoDe(p) {
	if (!p) return "pendiente";
	switch (p.estado) {
		case "ok":
		case "parcial": return "ok";
		case "en_curso": return "en_curso";
		case "error": return "error";
		case "omitido": return "omitido";
		default: return "pendiente";
	}
}
function filasW3(estado) {
	const pasos = estado?.pasos ?? [];
	return PASOS_W3.map((paso) => {
		const p = pasos.find((x) => x.paso === paso);
		return {
			paso,
			etiqueta: ETIQUETA_PASO_SYNC[paso],
			estado: estadoDe(p),
			conteo: conteoDe(p, paso)
		};
	});
}
/** [Continuar] de W3: cuando muestras, cumplimientos y productos están 'ok' (punto de control 1 publicado, C34). */
function continuarActivo(estado) {
	if (!estado) return false;
	const ok = (paso) => {
		const p = estado.pasos.find((x) => x.paso === paso);
		return p !== void 0 && (p.estado === "ok" || p.estado === "parcial");
	};
	if (ok("muestras") && ok("cumplimientos") && ok("productos")) return true;
	return !estado.en_curso && estado.ultima_estado === "ok" && estado.ultima_ok_at !== null;
}
/** «No pudimos traer tus muestras»: la sincronización terminó sin traer muestras, estado o productos. */
function fallaronMuestras(estado) {
	if (!estado || estado.en_curso) return false;
	const p = estado.pasos.find((x) => x.paso === "muestras");
	const malo = (x) => x !== void 0 && x.estado === "error";
	return malo(p) || malo(estado.pasos.find((x) => x.paso === "cumplimientos")) || malo(estado.pasos.find((x) => x.paso === "productos"));
}
/** Paso inicial de Windows si la URL no trae ?paso. */
function pasoInicialW(s) {
	if (!s) return "w1";
	if (s.conexion.estado === "conectada" && (s.sync.en_curso || !s.datos.hay_datos)) return "w3";
	return "w1";
}
/**
* Sub-vista de W2 (01 §4.15): W2a (hay archivo anterior sin importar) · W2a' (importada y vigente, el archivo sigue ahí) ·
* W2a'' (importada pero vencida) · W2b (sin configuración).
*/
function vistaW2(cred, conexion, importadaAhora) {
	const estado = conexion?.estado;
	const importada = importadaAhora || cred?.origen === "importado" || (cred?.legado.ya_importado_at ?? null) !== null;
	if (importada && (estado === "reautorizar" || estado === "sin_autorizar")) return "vencida";
	if (importada && estado === "conectada" && cred?.legado.disponible) return "importada";
	if (!importada && cred?.legado.disponible && estado !== "conectada") return "importar";
	return "conectar";
}
/** Documentos › PROJECTS › API de Affiliate Creator (sin el usuario de Windows ni el nombre del archivo). */
function rutaAmigable(ruta) {
	const partes = ruta.split(/[\\/]+/).filter((p) => p !== "" && !/^[a-z]:$/i.test(p));
	partes.pop();
	const i = partes.findIndex((p) => /^(documents|documentos|mis documentos)$/i.test(p));
	if (i >= 0) return ["Documentos", ...partes.slice(i + 1)].join(" › ");
	return partes.slice(-2).join(" › ") || ruta;
}
var bienvenida_module_default = {
	oculto: "_oculto_1lpv2_7",
	raiz: "_raiz_1lpv2_18",
	lado: "_lado_1lpv2_26",
	ladoTextos: "_ladoTextos_1lpv2_72",
	ladoTitulo: "_ladoTitulo_1lpv2_78",
	display: "_display_1lpv2_79",
	ladoTexto: "_ladoTexto_1lpv2_72",
	textoGrande: "_textoGrande_1lpv2_90",
	rail: "_rail_1lpv2_98",
	railItem: "_railItem_1lpv2_106",
	railNumero: "_railNumero_1lpv2_122",
	railTexto: "_railTexto_1lpv2_133",
	railCompacto: "_railCompacto_1lpv2_136",
	railSegmento: "_railSegmento_1lpv2_144",
	punto: "_punto_1lpv2_145",
	principal: "_principal_1lpv2_156",
	paso: "_paso_1lpv2_163",
	cabeza: "_cabeza_1lpv2_172",
	overline: "_overline_1lpv2_177",
	tituloPaso: "_tituloPaso_1lpv2_185",
	textoPaso: "_textoPaso_1lpv2_194",
	acciones: "_acciones_1lpv2_202",
	accionesChicas: "_accionesChicas_1lpv2_209",
	pista: "_pista_1lpv2_215",
	error: "_error_1lpv2_222",
	errorBloque: "_errorBloque_1lpv2_231",
	aviso: "_aviso_1lpv2_240",
	panel: "_panel_1lpv2_259",
	plan: "_plan_1lpv2_267",
	planItem: "_planItem_1lpv2_274",
	planNumero: "_planNumero_1lpv2_281",
	planTextos: "_planTextos_1lpv2_294",
	planTitulo: "_planTitulo_1lpv2_300",
	planTexto: "_planTexto_1lpv2_294",
	archivo: "_archivo_1lpv2_312",
	archivoIcono: "_archivoIcono_1lpv2_321",
	archivoTextos: "_archivoTextos_1lpv2_331",
	archivoRuta: "_archivoRuta_1lpv2_337",
	archivoNota: "_archivoNota_1lpv2_343",
	c42: "_c42_1lpv2_348",
	requisitos: "_requisitos_1lpv2_368",
	requisito: "_requisito_1lpv2_368",
	requisitoMarca: "_requisitoMarca_1lpv2_388",
	requisitoCuerpo: "_requisitoCuerpo_1lpv2_404",
	requisitoTitulo: "_requisitoTitulo_1lpv2_411",
	requisitoTexto: "_requisitoTexto_1lpv2_416",
	campoClave: "_campoClave_1lpv2_421",
	campoClaveTexto: "_campoClaveTexto_1lpv2_428",
	campoClaveBoton: "_campoClaveBoton_1lpv2_432",
	sync: "_sync_1lpv2_437",
	syncFila: "_syncFila_1lpv2_444",
	syncMarca: "_syncMarca_1lpv2_453",
	girar: "_girar_1lpv2_1",
	syncEtiqueta: "_syncEtiqueta_1lpv2_481",
	syncConteo: "_syncConteo_1lpv2_488",
	tira: "_tira_1lpv2_500",
	tiraTitulo: "_tiraTitulo_1lpv2_505",
	tiraLista: "_tiraLista_1lpv2_512",
	tiraItem: "_tiraItem_1lpv2_520",
	llegar: "_llegar_1lpv2_1",
	tiraMas: "_tiraMas_1lpv2_531",
	mosaico: "_mosaico_1lpv2_555",
	mosaicoLista: "_mosaicoLista_1lpv2_561",
	mosaicoItem: "_mosaicoItem_1lpv2_569",
	mosaicoFoto: "_mosaicoFoto_1lpv2_575",
	mosaicoPie: "_mosaicoPie_1lpv2_578",
	mosaicoNombre: "_mosaicoNombre_1lpv2_584",
	mosaicoMas: "_mosaicoMas_1lpv2_593",
	logo: "_logo_1lpv2_599",
	logoIcono: "_logoIcono_1lpv2_604",
	logoFondo: "_logoFondo_1lpv2_608",
	logoC: "_logoC_1lpv2_611",
	logoTexto: "_logoTexto_1lpv2_614",
	girador: "_girador_1lpv2_623",
	raizCompacta: "_raizCompacta_1lpv2_661",
	raizAndroid: "_raizAndroid_1lpv2_705",
	pasoAndroid: "_pasoAndroid_1lpv2_712",
	androidArriba: "_androidArriba_1lpv2_720",
	puntos: "_puntos_1lpv2_727",
	androidCentro: "_androidCentro_1lpv2_732",
	androidAbajo: "_androidAbajo_1lpv2_740",
	enlaceBoton: "_enlaceBoton_1lpv2_746",
	beneficios: "_beneficios_1lpv2_749",
	beneficio: "_beneficio_1lpv2_749",
	beneficioIcono: "_beneficioIcono_1lpv2_769",
	copiaIcono: "_copiaIcono_1lpv2_792",
	conteos: "_conteos_1lpv2_798",
	conteo: "_conteo_1lpv2_798",
	barraCopia: "_barraCopia_1lpv2_808",
	pcCopia: "_pcCopia_1lpv2_811",
	resumenCopia: "_resumenCopia_1lpv2_821",
	notificacion: "_notificacion_1lpv2_831",
	notificacionIcono: "_notificacionIcono_1lpv2_842",
	notificacionTextos: "_notificacionTextos_1lpv2_847",
	notificacionDe: "_notificacionDe_1lpv2_854",
	notificacionTitulo: "_notificacionTitulo_1lpv2_859",
	notificacionCampana: "_notificacionCampana_1lpv2_864"
};
/** Une clases de CSS Modules (con noUncheckedIndexedAccess cada clase es string | undefined) en un string. */
function cx(...xs) {
	return xs.filter((x) => typeof x === "string" && x !== "").join(" ");
}
function Logotipo(p) {
	const t = p.tamano ?? 44;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(bienvenida_module_default.logo),
		style: { ["--logo"]: `${t}px` },
		role: "img",
		"aria-label": "Corte",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 1024 1024",
			width: t,
			height: t,
			"aria-hidden": "true",
			className: cx(bienvenida_module_default.logoIcono),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "1024",
				height: "1024",
				rx: "232",
				className: cx(bienvenida_module_default.logoFondo)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
				transform: "translate(18 -6)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M742 330A300 300 0 1 0 742 694L645 625A132 132 0 1 1 645 399Z",
					className: cx(bienvenida_module_default.logoC)
				})
			})]
		}), p.conTexto === false ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(bienvenida_module_default.logoTexto),
			"aria-hidden": "true",
			children: "corte"
		})]
	});
}
function CabezaPaso(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cx(bienvenida_module_default.cabeza),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(bienvenida_module_default.overline),
				children: T.pasoDe(p.paso, p.total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: cx(bienvenida_module_default.tituloPaso),
				id: p.id,
				children: p.titulo
			}),
			p.texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(bienvenida_module_default.textoPaso),
				children: p.texto
			}) : null
		]
	});
}
/**
* Mosaico de tiendas por avisar (W6 y A6): foto real del producto de cada tienda + avatar + nombre. Siempre en filas
* completas: `columnas` fijas (4 en ancho, 2 en angosto) y `maximo` múltiplo de ellas, sin huecos al final.
*/
function MosaicoTiendas(p) {
	const columnas = p.columnas ?? 2;
	const max = p.maximo ?? columnas * 2;
	const disponibles = Math.min(max, p.tiendas.length);
	const llenas = disponibles >= columnas ? disponibles - disponibles % columnas : disponibles;
	const visibles = p.tiendas.slice(0, llenas);
	if (visibles.length === 0) return null;
	const resto = Math.max(0, p.total - visibles.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cx(bienvenida_module_default.mosaico),
		"aria-label": T.w6Tiendas,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(bienvenida_module_default.mosaicoLista),
			style: { ["--columnas"]: String(columnas) },
			children: visibles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cx(bienvenida_module_default.mosaicoItem),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: t.imagen,
					alt: "",
					anchoCss: 160,
					proporcion: "1:1",
					radio: "md",
					tienda: t.nombre,
					className: cx(bienvenida_module_default.mosaicoFoto)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(bienvenida_module_default.mosaicoPie),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
						nombre: t.nombre,
						tamano: 20
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.mosaicoNombre),
						children: t.nombre
					})]
				})]
			}, t.tienda_key))
		}), resto > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: cx(bienvenida_module_default.mosaicoMas),
			children: T.w6Mas(resto)
		}) : null]
	});
}
/** Tira de fotos de las muestras pendientes que ya llegaron (W3): «lo que ya llegó se muestra al instante». */
function TiraMuestras(p) {
	const max = p.maximo ?? 7;
	if (p.muestras.length === 0) return null;
	const visibles = p.muestras.slice(0, max);
	const resto = p.muestras.length - visibles.length;
	const columnas = visibles.length + (resto > 0 ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.tira),
		"data-tira-muestras": p.muestras.length,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(bienvenida_module_default.tiraTitulo),
			children: p.titulo ?? T.w3Llego(p.muestras.length)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: cx(bienvenida_module_default.tiraLista),
			style: { ["--columnas"]: String(columnas) },
			children: [visibles.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cx(bienvenida_module_default.tiraItem),
				title: `${nombreCorto(m.producto.titulo_corto ?? m.producto.titulo, 40)} · ${m.tienda.nombre}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombreCorto(m.producto.titulo_corto ?? m.producto.titulo, 60),
					anchoCss: 56,
					proporcion: "1:1",
					radio: "sm",
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria
				})
			}, m.application_id)), resto > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cx(bienvenida_module_default.tiraMas),
				"aria-label": `${resto} más`,
				children: T.w3Mas(resto)
			}) : null]
		})]
	});
}
/**
* Bienvenida en Windows, W1–W6 (01_ux §4.15; BUILD_SPEC C34, C42, C46; 02 lámina «win-bienvenida»).
* El paso vive en la URL (?paso=w3) para que Atrás funcione y se pueda volver a un paso.
*/
var ORDEN = [
	"w1",
	"w2",
	"w3",
	"w4",
	"w5",
	"w6"
];
var CLAVE_MEMORIA = "corte.bienvenida";
function leerMemoria() {
	try {
		const v = JSON.parse(window.sessionStorage.getItem(CLAVE_MEMORIA) ?? "null");
		if (v !== null && typeof v === "object") {
			const o = v;
			const plan = o["plan"];
			const celular = o["celular"];
			return {
				plan: plan !== null && typeof plan === "object" && typeof plan["termina"] === "string" ? plan : null,
				celular: typeof celular === "string" ? celular : null
			};
		}
	} catch {}
	return {
		plan: null,
		celular: null
	};
}
function guardarMemoria(m) {
	try {
		window.sessionStorage.setItem(CLAVE_MEMORIA, JSON.stringify(m));
	} catch {}
}
function mensaje(e) {
	return e instanceof ErrorHub ? e.mensaje : T.errorGenerico;
}
function Lado(p) {
	const i = ORDEN.indexOf(p.paso);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cx(bienvenida_module_default.lado),
		"aria-label": T.progreso,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: p.compacta ? 32 : 44 }),
			p.compacta ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.ladoTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(bienvenida_module_default.ladoTitulo),
					children: T.w1Titulo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(bienvenida_module_default.ladoTexto),
					children: T.w1Texto
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: cx(bienvenida_module_default.rail),
				children: T.rail.map((r, k) => {
					const estado = k < i ? "hecho" : k === i ? "actual" : "pendiente";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cx(bienvenida_module_default.railItem),
						"data-estado": estado,
						"aria-current": estado === "actual" ? "step" : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.railNumero),
								children: String(k + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.railTexto),
								children: r
							}),
							estado === "hecho" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Check",
								tamano: 14,
								etiqueta: "listo"
							}) : null
						]
					}, r);
				})
			}),
			p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.railCompacto),
				role: "progressbar",
				"aria-label": T.progreso,
				"aria-valuemin": 1,
				"aria-valuemax": 6,
				"aria-valuenow": i + 1,
				children: ORDEN.map((x, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(bienvenida_module_default.railSegmento),
					"data-lleno": k <= i ? "" : void 0
				}, x))
			}) : null
		]
	});
}
function PasoW1(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w1",
		children: [
			p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cx(bienvenida_module_default.cabeza),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.overline),
						children: T.pasoDe(1, 6)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cx(bienvenida_module_default.display),
						children: T.w1Titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.textoGrande),
						children: T.w1Texto
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 1,
				total: 6,
				titulo: T.w1Lista
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: cx(bienvenida_module_default.plan),
				children: T.w1Pasos.map((x, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(bienvenida_module_default.planItem),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.planNumero),
						children: String(k + 2).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(bienvenida_module_default.planTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.planTitulo),
							children: x.titulo
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.planTexto),
							children: x.texto
						})]
					})]
				}, x.titulo))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ArrowRight",
					alPulsar: () => p.ir("w2"),
					children: T.empezar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(bienvenida_module_default.pista),
					children: T.w1Duracion
				})]
			})
		]
	});
}
function CampoClave(p) {
	const [valor, setValor] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const guardar = async () => {
		const c = valor.trim();
		if (c === "") {
			setError(T.claveVacia);
			return;
		}
		setGuardando(true);
		setError(null);
		try {
			await hub.guardarAppSecret(c);
			setValor("");
			p.alGuardada();
		} catch (e) {
			setError(e instanceof ErrorHub && e.codigo === "app_secret_invalido" ? T.claveInvalida : mensaje(e));
		} finally {
			setGuardando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.campoClave),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
			etiqueta: T.claveEtiqueta,
			valor,
			alCambiar: setValor,
			tipo: "password",
			ayuda: T.claveAyuda,
			error,
			monoespaciado: true,
			autoFoco: true,
			alEnter: () => void guardar(),
			className: cx(bienvenida_module_default.campoClaveTexto)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			cargando: guardando,
			alPulsar: () => void guardar(),
			className: cx(bienvenida_module_default.campoClaveBoton),
			children: T.guardarClave
		})]
	});
}
function PasoW2(p) {
	const sesion = useSesion();
	const cred = useConsulta("credenciales", {});
	const toast = useToast();
	const [, setReauth] = useParametro("reautorizar");
	const [importada, setImportada] = (0, import_react.useState)(null);
	const [otraForma, setOtraForma] = (0, import_react.useState)(false);
	const [trabajando, setTrabajando] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [verClave, setVerClave] = (0, import_react.useState)(false);
	const conexion = sesion.datos?.conexion.estado === "conectada" ? sesion.datos.conexion : importada?.conexion ?? sesion.datos?.conexion;
	const vista = otraForma ? "conectar" : vistaW2(cred.datos, conexion, importada !== null);
	const cuenta = sesion.datos?.cuenta ?? null;
	const conectada = conexion?.estado === "conectada";
	const claveLista = cred.datos?.app_secret_configurado === true || conectada;
	const abrirTikTok = () => setReauth("1");
	const importar = async (req) => {
		setTrabajando("importar");
		setError(null);
		try {
			const r = await hub.importarCredenciales(req);
			setImportada(r);
			setOtraForma(false);
			invalidar("credenciales", "sesion");
		} catch (e) {
			setError(mensaje(e));
		} finally {
			setTrabajando(null);
		}
	};
	const importarArchivo = async () => {
		const ruta = await elegirArchivo(T.tituloElegir, ["json"]);
		if (ruta) await importar({ ruta });
	};
	const borrarAnterior = async () => {
		setTrabajando("borrar");
		try {
			await hub.borrarLegado();
			toast.mostrar({
				texto: T.enPapelera,
				tono: "ok"
			});
			p.ir("w3");
		} catch (e) {
			setError(mensaje(e));
		} finally {
			setTrabajando(null);
		}
	};
	const errorVista = error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(bienvenida_module_default.error),
		role: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "CircleAlert",
			tamano: 16
		}), error]
	}) : null;
	if (vista === "importar") {
		const ruta = rutaAmigable(cred.datos?.legado.ruta ?? "");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(bienvenida_module_default.paso),
			"data-paso": "w2",
			"data-vista": "w2a",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
					paso: 2,
					total: 6,
					titulo: T.w2aTitulo,
					texto: T.w2aTexto(ruta)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(bienvenida_module_default.archivo),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.archivoIcono),
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Lock",
							tamano: 20
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(bienvenida_module_default.archivoTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.archivoRuta),
							children: ruta
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.archivoNota),
							children: "config.json"
						})]
					})]
				}),
				errorVista,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(bienvenida_module_default.acciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "lg",
						icono: "Download",
						cargando: trabajando === "importar",
						alPulsar: () => void importar({}),
						children: T.importarSeguro
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "lg",
						alPulsar: () => setOtraForma(true),
						children: T.otraForma
					})]
				})
			]
		});
	}
	if (vista === "importada") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w2",
		"data-vista": "w2a1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 2,
				total: 6,
				titulo: cuenta ? T.w2a1Titulo(cuenta.username) : T.w2a1TituloSinNombre,
				texto: T.w2a1Texto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.c42),
				"data-texto-c42": "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CircleAlert",
					tamano: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: T.w2a1C42 })]
			}),
			errorVista,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "Trash2",
					cargando: trabajando === "borrar",
					alPulsar: () => void borrarAnterior(),
					children: T.borrarAnterior
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "lg",
					alPulsar: () => p.ir("w3"),
					children: T.conservarlo
				})]
			})
		]
	});
	if (vista === "vencida" && !conectada) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w2",
		"data-vista": "w2a2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 2,
				total: 6,
				titulo: T.w2a2Titulo,
				texto: T.w2a2Texto
			}),
			errorVista,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ExternalLink",
					alPulsar: abrirTikTok,
					children: T.abrirTikTok
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w2",
		"data-vista": "w2b",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 2,
				total: 6,
				titulo: T.w2bTitulo,
				texto: T.w2bTexto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: cx(bienvenida_module_default.requisitos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(bienvenida_module_default.requisito),
					"data-listo": claveLista ? "" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.requisitoMarca),
						"aria-hidden": "true",
						children: claveLista ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 14
						}) : "1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(bienvenida_module_default.requisitoCuerpo),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.requisitoTitulo),
								children: T.claveApp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.requisitoTexto),
								children: claveLista ? T.claveGuardada : T.claveFalta
							}),
							claveLista ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(bienvenida_module_default.accionesChicas),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
									variante: "secundario",
									icono: "Download",
									cargando: trabajando === "importar",
									alPulsar: () => void importarArchivo(),
									children: T.importarArchivo
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
									variante: "secundario",
									icono: "Lock",
									alPulsar: () => setVerClave((v) => !v),
									children: T.pegarClave
								})]
							}), verClave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoClave, { alGuardada: () => setVerClave(false) }) : null] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(bienvenida_module_default.requisito),
					"data-listo": conectada ? "" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.requisitoMarca),
						"aria-hidden": "true",
						children: conectada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 14
						}) : "2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(bienvenida_module_default.requisitoCuerpo),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.requisitoTitulo),
							children: T.autorizacion
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.requisitoTexto),
							children: conectada ? cuenta ? T.conectadoComo(cuenta.username) : T.autorizacionLista : T.autorizacionTexto
						})]
					})]
				})]
			}),
			errorVista,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: conectada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ArrowRight",
					alPulsar: () => p.ir("w3"),
					children: T.continuar
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ExternalLink",
					deshabilitado: !claveLista,
					alPulsar: abrirTikTok,
					children: T.abrirTikTok
				})
			})
		]
	});
}
function PasoW3(p) {
	const sync = useSync();
	const sesion = useSesion();
	const estado = sync.estado ?? sesion.datos?.sync ?? null;
	const activo = continuarActivo(estado);
	const fallo = fallaronMuestras(estado);
	const filas = filasW3(estado);
	const pendientes = (useConsulta("muestras", {}, { activa: activo }).datos?.items ?? []).filter((m) => esPendiente(m));
	const pedida = (0, import_react.useRef)(false);
	const compacta = useClaseAncho() === "compacta";
	(0, import_react.useEffect)(() => {
		const s = sesion.datos;
		if (pedida.current || !s || s.conexion.estado !== "conectada" || s.datos.hay_datos || estado?.en_curso || !sync.puede) return;
		pedida.current = true;
		sync.sincronizar("completa").catch(() => void 0);
	}, [
		sesion.datos,
		estado?.en_curso,
		sync
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w3",
		"data-continuar": activo ? "activo" : "inactivo",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 3,
				total: 6,
				titulo: T.w3Titulo,
				texto: T.w3Texto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: cx(bienvenida_module_default.sync),
				"aria-label": T.w3Lista,
				children: filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(bienvenida_module_default.syncFila),
					"data-estado": f.estado,
					"data-paso-sync": f.paso,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.syncMarca),
							"aria-hidden": "true",
							children: f.estado === "ok" || f.estado === "omitido" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Check",
								tamano: 14
							}) : f.estado === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "CircleAlert",
								tamano: 14
							}) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(bienvenida_module_default.syncEtiqueta),
							children: [f.etiqueta, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(bienvenida_module_default.oculto),
								children: [" · ", f.estado === "ok" || f.estado === "omitido" ? T.hecho : f.estado === "en_curso" ? T.enCursoEtiqueta : f.estado === "error" ? T.conError : T.pendiente]
							})]
						}),
						f.conteo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.syncConteo),
							children: f.conteo
						}) : null
					]
				}, f.paso))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiraMuestras, {
				muestras: pendientes,
				maximo: compacta ? 4 : 7
			}),
			fallo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.errorBloque),
				role: "alert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(bienvenida_module_default.error),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CircleAlert",
						tamano: 16
					}), T.w3Error]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(bienvenida_module_default.acciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "RefreshCw",
						alPulsar: () => void sync.sincronizar("completa").catch(() => void 0),
						children: T.reintentar
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						alPulsar: () => navegar("/inicio"),
						children: T.irInicioIgual
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ChevronRight",
					deshabilitado: !activo,
					alPulsar: () => p.ir("w4"),
					children: T.continuar
				}), activo ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(bienvenida_module_default.pista),
					children: T.w3Pista
				})]
			})
		]
	});
}
function PasoW4(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
			paso: 4,
			total: 6,
			titulo: T.w4Titulo,
			texto: T.w4Texto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(bienvenida_module_default.panel),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelPlan, {
				modo: "compacto",
				alCrear: p.alCrear,
				alSaltar: p.alSaltar
			})
		})]
	});
}
function PasoW5(p) {
	const lan = useConsulta("lan", {});
	const toast = useToast();
	const [activando, setActivando] = (0, import_react.useState)(false);
	const activo = lan.datos?.activo === true;
	const activar = async () => {
		setActivando(true);
		try {
			await hub.lanActivar(true);
		} catch (e) {
			toast.mostrar({
				texto: mensaje(e),
				tono: "error"
			});
		} finally {
			setActivando(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 5,
				total: 6,
				titulo: T.w5Titulo,
				texto: T.w5Texto
			}),
			lan.datos && !activo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.aviso),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Wifi",
						tamano: 18
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: T.w5AvisoRedes }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "QrCode",
						cargando: activando,
						alPulsar: () => void activar(),
						children: T.w5MostrarCodigo
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.panel),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelQrEmparejamiento, {
					compacto: true,
					alEmparejado: p.alEmparejado
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(bienvenida_module_default.pista),
					children: T.w5Deteccion
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "lg",
					alPulsar: p.alAhoraNo,
					children: T.ahoraNo
				})
			})
		]
	});
}
function PasoW6(p) {
	const plan = useConsulta("plan", {}, { activa: p.plan === null });
	const tablero = useConsulta("dashboard", { periodo: "30d" });
	const porAvisar = (useConsulta("tiendas", { orden: "atencion" }).datos?.items ?? []).filter((t) => t.por_avisar);
	const compacta = useClaseAncho() === "compacta";
	const termina = p.plan?.termina ?? (plan.datos?.items ?? []).map((x) => x.estado === "planeada" ? x.fecha_plan : null).filter((f) => f !== null).sort().at(-1) ?? null;
	const n = p.plan?.tiendas_por_avisar ?? tablero.datos?.muestras.tiendas_por_avisar ?? porAvisar.length;
	const titulo = termina ? n > 0 ? T.w6Titulo(formato.fechaConDia(termina), n) : T.w6TituloSinTiendas(formato.fechaConDia(termina)) : T.w6TituloSinPlan;
	const texto = termina ? p.celular ? T.w6ConCelular : T.w6SinCelular : T.w6TextoSinPlan;
	if (p.plan === null && plan.datos === void 0 && plan.error === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w6",
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(bienvenida_module_default.overline),
				children: T.pasoDe(6, 6)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "70%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 2
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.paso),
		"data-paso": "w6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabezaPaso, {
				paso: 6,
				total: 6,
				titulo,
				texto
			}),
			n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MosaicoTiendas, {
				tiendas: porAvisar,
				total: n,
				columnas: compacta ? 2 : 4,
				maximo: compacta ? 4 : 8
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.acciones),
				children: p.celular || !termina ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ArrowRight",
					alPulsar: () => navegar("/inicio"),
					children: T.irInicio
				}), n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "lg",
					icono: "MessageCircle",
					alPulsar: () => navegar("/muestras/avisos"),
					children: T.avisarPc
				}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "MessageCircle",
					alPulsar: () => navegar("/muestras/avisos"),
					children: T.avisarPc
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "lg",
					alPulsar: () => navegar("/inicio"),
					children: T.irInicio
				})] })
			})
		]
	});
}
function BienvenidaWindows() {
	const [param, setParam] = useParametro("paso");
	const sesion = useSesion();
	const compacta = useClaseAncho() === "compacta";
	const toast = useToast();
	const [memoria, setMemoria] = (0, import_react.useState)(leerMemoria);
	const paso = esPasoW(param) ? param : pasoInicialW(sesion.datos);
	const ir = (x) => setParam(x);
	const recordar = (m) => {
		setMemoria((previa) => {
			const nueva = {
				...previa,
				...m
			};
			guardarMemoria(nueva);
			return nueva;
		});
	};
	let contenido;
	switch (paso) {
		case "w1":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW1, {
				ir,
				compacta
			});
			break;
		case "w2":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW2, { ir });
			break;
		case "w3":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW3, { ir });
			break;
		case "w4":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW4, {
				alCrear: (r) => {
					recordar({ plan: r });
					ir("w5");
				},
				alSaltar: () => {
					iniciarRecorridos();
					recordar({ plan: null });
					ir("w5");
				}
			});
			break;
		case "w5":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW5, {
				alEmparejado: (n) => {
					toast.mostrar({
						texto: T.emparejado(n),
						tono: "ok"
					});
					recordar({ celular: n });
					ir("w6");
				},
				alAhoraNo: () => ir("w6")
			});
			break;
		case "w6": contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoW6, {
			plan: memoria.plan,
			celular: memoria.celular
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.tituloPantalla,
		lista: !sesion.cargando,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(bienvenida_module_default.raiz, compacta && bienvenida_module_default.raizCompacta),
			"data-vista": "bienvenida-windows",
			"data-paso-actual": paso,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lado, {
				paso,
				compacta
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.principal),
				children: contenido
			})]
		})
	});
}
/**
* Bienvenida en Android, A1–A6 (01_ux §4.15 y §5.3). A2/A2'/A3 (cámara, código y número de 4 dígitos) viven en
* #/emparejar; aquí: A1 (presentación), A4 «Copiando tus datos…» (con la copia que trae la capa nativa), A5 (permiso de
* notificaciones, explicado antes de pedirlo) y A6 «Avisa a tus {30} tiendas desde aquí».
*/
function Puntos(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(bienvenida_module_default.puntos),
		role: "progressbar",
		"aria-label": T.progreso,
		"aria-valuemin": 1,
		"aria-valuemax": 6,
		"aria-valuenow": p.paso,
		children: [
			1,
			2,
			3,
			4,
			5,
			6
		].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(bienvenida_module_default.punto),
			"data-lleno": n <= p.paso ? "" : void 0
		}, n))
	});
}
function PasoA1() {
	const [ayuda, setAyuda] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.pasoAndroid),
		"data-paso": "a1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidArriba),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 40 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puntos, { paso: 1 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidCentro),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cx(bienvenida_module_default.display),
						children: T.a1Titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.textoGrande),
						children: T.a1Texto
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: cx(bienvenida_module_default.beneficios),
						children: T.a1Puntos.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cx(bienvenida_module_default.beneficio),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.beneficioIcono),
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: x.icono,
									tamano: 20
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x.texto })]
						}, x.texto))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidAbajo),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					icono: "QrCode",
					alPulsar: () => navegar("/emparejar"),
					children: T.a1Emparejar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cx(bienvenida_module_default.enlaceBoton),
					onClick: () => setAyuda(true),
					children: T.a1SinPc
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
				abierta: ayuda,
				titulo: T.a1SinPcTitulo,
				alCerrar: () => setAyuda(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(bienvenida_module_default.textoPaso),
					children: T.a1SinPcTexto
				})
			})
		]
	});
}
function useImagenesCopia() {
	const [v, setV] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const f = (e) => {
			const d = e.detail;
			if (d && typeof d.hechas === "number" && typeof d.total === "number") setV({
				hechas: d.hechas,
				total: d.total
			});
		};
		window.addEventListener("creatorhub-imagenes", f);
		return () => window.removeEventListener("creatorhub-imagenes", f);
	}, []);
	return v;
}
function PasoA4(p) {
	const pc = useConexionPc();
	const tablero = useConsulta("dashboard", { periodo: "todo" });
	const imagenes = useImagenesCopia();
	const d = tablero.datos;
	const hayCopia = d !== void 0;
	const imagenesPendientes = imagenes !== null && imagenes.total > 0 && imagenes.hechas < imagenes.total;
	const copiando = !hayCopia || imagenesPendientes;
	const fr = imagenes && imagenes.total > 0 ? imagenes.hechas / imagenes.total : hayCopia ? 1 : 0;
	const conteos = [
		d ? T.a4Muestras(formato.numero(d.muestras.total)) : null,
		d ? T.a4Pedidos(formato.numero(d.kpis.pedidos)) : null,
		imagenes ? T.a4Imagenes(formato.numero(imagenes.hechas), formato.numero(imagenes.total)) : null
	].filter((x) => x !== null);
	const titulo = copiando ? T.a4Titulo : T.a4TituloListo;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.pasoAndroid),
		"data-paso": "a4",
		"data-copia": hayCopia ? "lista" : "esperando",
		"data-imagenes": imagenesPendientes ? "llegando" : "listas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidArriba),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 40 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puntos, { paso: 4 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidCentro),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(bienvenida_module_default.copiaIcono),
						"aria-hidden": "true",
						children: copiando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(bienvenida_module_default.girador) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 56 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cx(bienvenida_module_default.display),
						children: titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.conteos),
						"aria-live": "polite",
						children: conteos.length > 0 ? conteos.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [i > 0 ? " · " : "", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(bienvenida_module_default.conteo),
							children: c
						})] }, c)) : T.a4Esperando
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraProgreso, {
						valor: fr,
						etiqueta: titulo,
						className: cx(bienvenida_module_default.barraCopia)
					}),
					pc?.nombre_equipo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cx(bienvenida_module_default.pcCopia),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Monitor",
							tamano: 16
						}), T.a4DesdePc(pc.nombre_equipo)]
					}) : null,
					hayCopia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.textoPaso),
						children: imagenesPendientes ? T.a4ImagenesSiguen : T.a4Listo
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.androidAbajo),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					iconoFinal: "ArrowRight",
					deshabilitado: !hayCopia,
					alPulsar: () => p.ir("a5"),
					children: T.a4Seguir
				})
			})
		]
	});
}
function PasoA5(p) {
	const [pidiendo, setPidiendo] = (0, import_react.useState)(false);
	const activar = async () => {
		setPidiendo(true);
		try {
			await pedirPermisoNotificaciones();
		} catch {} finally {
			setPidiendo(false);
			p.ir("a6");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.pasoAndroid),
		"data-paso": "a5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidArriba),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 40 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puntos, { paso: 5 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidCentro),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(bienvenida_module_default.notificacion),
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(bienvenida_module_default.notificacionIcono),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, {
									tamano: 28,
									conTexto: false
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(bienvenida_module_default.notificacionTextos),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(bienvenida_module_default.notificacionDe),
									children: T.a5EjemploDe
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(bienvenida_module_default.notificacionTitulo),
									children: T.a5Ejemplo
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Bell",
								tamano: 18,
								className: cx(bienvenida_module_default.notificacionCampana)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cx(bienvenida_module_default.display),
						children: T.a5Titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.textoGrande),
						children: T.a5Texto
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidAbajo),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					icono: "Bell",
					cargando: pidiendo,
					alPulsar: () => void activar(),
					children: T.a5Activar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "lg",
					anchoCompleto: true,
					alPulsar: () => p.ir("a6"),
					children: T.ahoraNo
				})]
			})
		]
	});
}
function PasoA6() {
	const plan = useConsulta("plan", {});
	const tablero = useConsulta("dashboard", { periodo: "30d" });
	const tiendas = useConsulta("tiendas", { orden: "atencion" });
	const muestras = useConsulta("muestras", {});
	const hayPlan = (plan.datos?.items ?? []).some((x) => x.fecha_plan !== null && x.estado !== "no_se_puede");
	const porAvisar = (tiendas.datos?.items ?? []).filter((t) => t.por_avisar);
	const n = tablero.datos?.muestras.tiendas_por_avisar ?? porAvisar.length;
	const avisar = hayPlan && n > 0;
	const pendientes = (muestras.datos?.items ?? []).filter((m) => esPendiente(m));
	const nTiendas = new Set(pendientes.map((m) => m.tienda.tienda_key)).size;
	if (plan.datos === void 0 && plan.error === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.pasoAndroid),
		"data-paso": "a6",
		"data-avisar": "cargando",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(bienvenida_module_default.androidArriba),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 40 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puntos, { paso: 6 })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(bienvenida_module_default.androidCentro),
			"aria-busy": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "80%"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 2
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(bienvenida_module_default.pasoAndroid),
		"data-paso": "a6",
		"data-avisar": avisar ? "si" : "no",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidArriba),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logotipo, { tamano: 40 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puntos, { paso: 6 })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(bienvenida_module_default.androidCentro),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: cx(bienvenida_module_default.display),
						children: avisar ? T.a6Titulo(n) : T.a6SinAvisarTitulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(bienvenida_module_default.textoGrande),
						children: avisar ? T.a6Texto : T.a6SinAvisarTexto
					}),
					avisar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MosaicoTiendas, {
						tiendas: porAvisar,
						total: n,
						maximo: 4
					}) : null,
					!avisar && pendientes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(bienvenida_module_default.resumenCopia),
						"data-resumen-copia": "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiraMuestras, {
							muestras: pendientes,
							maximo: 4,
							titulo: T.a6Pendientes(pendientes.length, nTiendas)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(bienvenida_module_default.pista),
							children: T.a6PlanDesdePc
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(bienvenida_module_default.androidAbajo),
				children: avisar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					icono: "MessageCircle",
					alPulsar: () => navegar("/muestras/avisos"),
					children: T.a6Empezar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "lg",
					anchoCompleto: true,
					alPulsar: () => navegar("/inicio"),
					children: T.a6Despues
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					iconoFinal: "ArrowRight",
					alPulsar: () => navegar("/inicio"),
					children: T.irInicio
				})
			})
		]
	});
}
function BienvenidaAndroid() {
	const [param, setParam] = useParametro("paso");
	const inicial = useConexionPc()?.emparejado ? "a4" : "a1";
	const paso = esPasoA(param) ? param : inicial;
	const ir = (x) => setParam(x);
	(0, import_react.useEffect)(() => {
		if (paso === "a2" || paso === "a3") navegar("/emparejar", { reemplazar: true });
	}, [paso]);
	let contenido;
	switch (paso) {
		case "a4":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoA4, { ir });
			break;
		case "a5":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoA5, { ir });
			break;
		case "a6":
			contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoA6, {});
			break;
		default: contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoA1, {});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.tituloPantalla,
		lista: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(bienvenida_module_default.raizAndroid),
			"data-vista": "bienvenida-android",
			"data-paso-actual": paso,
			children: contenido
		})
	});
}
function PantallaBienvenida() {
	return usePlataforma() === "android" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BienvenidaAndroid, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BienvenidaWindows, {});
}
//#endregion
export { PantallaBienvenida };
