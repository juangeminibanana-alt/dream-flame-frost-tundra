import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as PASO_ETAPA, A as EnlaceRuta, B as ICONO_GRUPO, C as ETIQUETA_ETAPA, F as Foto, Gn as useClaseAncho, H as Icono, I as GraficaColumnas, Jt as esPendiente, K as Kpi, M as Esqueleto, Mt as coincide, N as EsqueletoVista, P as EstadoVacio, Rt as copiarTexto, Vt as diasEntre, Y as MiniaturaVideo, _ as ChipEtapa, a as BandaKpi, cr as useToast, d as BotonIcono, dt as TONO_GRUPO, er as useParametro, g as Chip, hn as normalizarTitulo, ht as TarjetaProducto, ir as useRuta, k as EncabezadoPantalla, l as BarrasHorizontales, m as CampoTexto, mn as nombreCorto, mt as Tarjeta, nn as formato, o as BarraApilada, on as hoyLocal, or as useSync, pn as navegar, pt as Tabla, qn as useConsulta, r as AvatarTienda, rt as Pantalla, st as Segmentado, tr as usePlataforma, u as Boton, v as ChipFiltro, vt as abrirExterno, w as ETIQUETA_GRUPO, z as ICONO_ETAPA } from "./app-CLiVRbtG.mjs";
import { T as BotonGuardarImagen, c as columnasProductos, h as FichaPrecio, k as useControlMuestra, m as TarjetaMuestra, o as ListaNotas } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/productos-Cimyiqzd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Textos de Productos y Detalle de producto (01_ux §4.13, §4.16, §6.5; vocabulario de §1.5). Español de México.
* Las cifras se arman aquí con `formato` de @/dominio: la pantalla nunca escribe números a mano.
*/
var n = (x) => formato.numero(x);
var plural = (x, uno, varios) => `${n(x)} ${x === 1 ? uno : varios}`;
var T = {
	titulo: "Productos",
	contexto: (conVentas, deMuestra, sinVentas) => [
		plural(conVentas, "producto con ventas", "productos con ventas"),
		...deMuestra !== null ? [plural(deMuestra, "producto de muestra recibido", "productos de muestra recibidos")] : [],
		...sinVentas !== null ? [`${n(sinVentas)} todavía sin ventas`] : []
	].join(" · "),
	segmentos: "Qué productos ver",
	segVendidos: "Más vendidos",
	segSinVentas: "Muestras sin ventas",
	segTodos: "Todos",
	segVendidosCorto: "Vendidos",
	segSinVentasCorto: "Sin ventas",
	vista: "Cómo ver los productos",
	vistaCuadricula: "Cuadrícula",
	vistaTabla: "Tabla",
	tablaEtiqueta: "Productos con ventas",
	rejillaVendidos: "Productos con ventas, de más a menos comisión",
	rejillaSinVentas: "Muestras recibidas que todavía no venden",
	rejillaTodos: "Todos tus productos",
	buscar: "Buscar producto o tienda",
	filtros: "Filtros de productos",
	filtroConVentas: "Con ventas",
	filtroSinVentas: "Sin ventas",
	filtroFueMuestra: "Fue muestra",
	filtroVitrina: "En tu vitrina",
	mostrando: (visibles, total) => `Mostrando ${n(visibles)} de ${n(total)}`,
	sinVentasResumen: (recibidos, vendieron) => `De ${plural(recibidos, "producto de muestra que recibiste", "productos de muestra que recibiste")}, ${n(vendieron)} ya ${vendieron === 1 ? "vendió" : "vendieron"} contigo.`,
	unidades: (u) => plural(u, "unidad", "unidades"),
	videos: (v) => plural(v, "video", "videos"),
	fueMuestra: "Fue muestra",
	enVitrina: "En tu vitrina",
	sinVentas: "Sin ventas",
	sinVentasTodavia: "Sin ventas todavía",
	publicadoSinVentas: (dias) => `Publicado hace ${plural(dias, "día", "días")} sin ventas`,
	planearVideo: "Planear video",
	tuAvance: "Tu avance:",
	nadaTitulo: "Aún no hay productos",
	nadaTexto: "Aparecerán con su foto cuando sincronices tus muestras y ventas.",
	sincronizar: "Sincronizar ahora",
	vacioTitulo: "Aún no hay productos con ventas",
	vacioTexto: "Cuando vendas un producto con tus videos, aparecerá aquí con su foto.",
	sinVentasVacioTitulo: "Todas tus muestras ya vendieron",
	sinVentasVacioTexto: "Cada producto que te enviaron ya generó al menos una venta.",
	sinResultados: "Ningún producto con estos filtros",
	sinResultadosTexto: "Prueba con otro filtro o borra la búsqueda.",
	quitarFiltros: "Quitar filtros",
	cargando: "Estamos trayendo tus datos de TikTok Shop…",
	lento: "Sigue cargando… revisa la conexión con tu PC",
	necesitaPc: "Necesita tu PC encendida",
	necesitaPcTexto: "Esta vista se arma en Corte de tu PC. Ábrelo y conéctate al mismo Wi‑Fi.",
	errorTitulo: "No pudimos mostrar tus productos",
	errorDetalleTitulo: "No pudimos mostrar este producto",
	noExiste: "No encontramos este producto",
	noExisteTexto: "Puede que ya no tenga ventas ni muestras contigo.",
	verProductos: "Ver mis productos",
	reintentar: "Reintentar",
	volver: "Productos",
	sinFicha: "Sin ficha de TikTok Shop para este producto (puede que ya no esté en colaboración abierta).",
	comisionAnuncios: (tasa) => `Comisión por anuncios de la tienda: ${tasa}`,
	vendidosGlobal: (u) => `${plural(u, "vendido", "vendidos")} en TikTok Shop (todas las cuentas)`,
	conInventario: "Con inventario",
	sinInventario: "Sin inventario",
	abrirTikTokShop: "Abrir en TikTok Shop",
	abrirAppTikTok: "Abrir en la app de TikTok",
	abrirFallo: "No se pudo abrir TikTok",
	idProducto: "ID del producto",
	copiarId: "Copiar ID del producto",
	idCopiado: "ID del producto copiado",
	categoria: "Categoría",
	tusVentas: "Tus ventas",
	tusVentasVacio: "Este producto todavía no se vende con tus videos.",
	kpiComision: "Comisión · total",
	kpiUnidades: "Unidades",
	kpiPedidos: "Pedidos",
	kpiReembolsos: "Reembolsos",
	kpiVideos: "Videos que lo venden",
	kpiPedidosNota: (validos) => plural(validos, "válido", "válidos"),
	kpiReembolsosNota: (r) => plural(r, "pedido", "pedidos"),
	kpiVentas: (dinero) => `≈ ${dinero} en ventas`,
	graficaMes: "Comisión por mes",
	graficaNota: (etiqueta, dinero) => `Mejor mes: ${etiqueta} · ${dinero}`,
	ariaMes: (etiqueta, dinero, unidades) => `${etiqueta}: ${dinero} de comisión, ${plural(unidades, "unidad", "unidades")}`,
	colMes: "Mes",
	colComision: "Comisión estimada",
	colUnidades: "Unidades",
	enCurso: "en curso",
	/** Una sola columna no es gráfica (02 §9): con ventas solo en el mes en curso se dice la cifra. */
	unSoloMes: (mes, dinero, unidades) => `Todas sus ventas son de ${mes} (en curso): ${dinero} de comisión · ${plural(unidades, "unidad", "unidades")}.`,
	meses: [
		"ene",
		"feb",
		"mar",
		"abr",
		"may",
		"jun",
		"jul",
		"ago",
		"sep",
		"oct",
		"nov",
		"dic"
	],
	sinSerie: "La gráfica por mes necesita tu PC encendida.",
	videos_: "Videos que lo venden",
	videosNota: "Cifras totales de cada video, con todos sus productos.",
	videosNotaMetricas: "Cifras totales de cada video, con todos sus productos. Las vistas son de TikTok.",
	vistas: (cifra) => `${cifra} vistas`,
	porMilPedidos: "pedidos",
	porMilResto: "por 1,000 vistas",
	sinCifrasTikTok: "Sin cifras de TikTok",
	sinCifrasTikTokAyuda: "TikTok no da cifras de este video: puede ser privado, estar borrado o ser de otra cuenta.",
	metricasDe: (vistas, porMil) => `${vistas} vistas${porMil ? `, ${porMil} pedidos por 1,000 vistas` : ""}`,
	videosVacio: "Ningún video tuyo vende este producto todavía.",
	listaCorta: (visibles, total) => `Mostrando ${n(visibles)} de ${n(total)} · el resto con tu PC encendida`,
	muestras: "Muestras de este producto",
	muestrasVacio: "No pediste muestras de este producto.",
	notas: "Notas del producto",
	notasAyuda: "Tallas, colores, ideas para tu video…",
	nombreVideo: (idCorto) => `Video ${idCorto}`,
	/** Contexto del encabezado del detalle cuando el título se acortó: el nombre completo y la tienda. */
	contextoDetalle: (nombre, tienda) => tienda ? `${nombre} · ${tienda}` : nombre,
	fotoDelProducto: "Foto del producto",
	etiquetaVideo: (dinero, unidades, nombre) => `${dinero} de comisión, ${plural(unidades, "unidad", "unidades")}. Producto: ${nombre}`,
	galeria: "Fotos de tu vitrina",
	galeriaCuenta: (n) => `${plural(n, "foto", "fotos")} de tu vitrina`,
	verFoto: (i, total) => `Ver la foto ${n(i)} de ${n(total)}`,
	fotoDe: (i, total, nombre) => `${nombre}, foto ${n(i)} de ${n(total)}`,
	comision: "Comisión",
	comisionNota: "Cuánto te paga cada venta de este producto",
	enTusPedidos: "En tus pedidos",
	enTusPedidosNota: (participacion, lineas) => `Así se pagó el ${participacion} de tus ${plural(lineas, "pedido válido", "pedidos válidos")}`,
	enTusPedidosUnica: (lineas) => `Así se pagaron tus ${plural(lineas, "pedido válido", "pedidos válidos")}`,
	laMasComun: "La más común",
	planAbierto: "Plan abierto",
	planAbiertoNota: "Lo que paga a cualquier creador",
	planDirigido: "Plan dirigido",
	porVentaAprox: (dinero) => `≈ ${dinero} por venta`,
	masPlanes: (k) => `y ${plural(k, "plan dirigido más", "planes dirigidos más")}`,
	diferenciaMas: (real, puntos, plan) => `Tus ventas pagan ${real}: ${n(puntos)} ${puntos === 1 ? "punto" : "puntos"} más que el plan abierto (${plan}).`,
	diferenciaMenos: (real, puntos, plan) => `Tus ventas pagan ${real}: ${n(puntos)} ${puntos === 1 ? "punto" : "puntos"} menos que el plan abierto (${plan}).`,
	diferenciaIgual: (plan) => `Tus ventas pagan lo mismo que el plan abierto (${plan}).`,
	tasasTitulo: "Tasas que pagaron tus pedidos",
	tasaPedidos: (lineas) => plural(lineas, "pedido", "pedidos"),
	colTasa: "Tasa",
	colPedidos: "Pedidos",
	colParte: "Parte",
	conCampana: (lineas, campanas) => `${plural(lineas, "pedido llegó", "pedidos llegaron")} con ${campanas === 1 ? "una campaña" : `${n(campanas)} campañas`} de la tienda: por eso la tasa puede ser distinta a la del plan.`,
	precio: "Precio",
	precioNotaVitrina: "Lo que dice tu vitrina hoy",
	precioNotaFicha: "De su ficha en TikTok Shop",
	precioLista: "Precio de lista",
	precioVenta: "Precio de venta",
	precioVentaAprox: "Precio de venta aproximado",
	precioPlataforma: "Con descuento de TikTok Shop",
	precioPromedio: "Tus compradores pagaron",
	precioPromedioNota: (unidades) => `Promedio por unidad de ${plural(unidades, "unidad vendida", "unidades vendidas")}`,
	descuento: (pct) => `Hoy se vende ${pct} abajo del precio de lista.`,
	agotadoVitrina: "Agotado en tu vitrina",
	ocultoVitrina: "Oculto en tu vitrina",
	tusSolicitudes: "Tus solicitudes",
	anteriores: "Solicitudes anteriores",
	anterioresNota: "TikTok ya no las muestra en tu lista de muestras; las encontramos por su entrega.",
	pedidaEl: (fecha) => `Pedida el ${fecha}`,
	sinVariante: "Sin variante",
	revisado: (cuando) => `TikTok lo revisó ${cuando}`,
	puedesPedirOtra: "Puedes pedir otra",
	skusTitulo: "Variantes para pedir muestra",
	skusResumen: (disponibles, total) => `${n(disponibles)} de ${n(total)} disponibles`,
	disponible: "Disponible",
	unica: "Única",
	verTodas: (k) => `Ver las ${n(k)}`,
	verMenos: "Ver menos",
	listaSkus: "Variantes y si puedes pedirlas",
	origen: "De dónde vienen tus ventas",
	origenNota: (lineas) => `${plural(lineas, "pedido", "pedidos")} con su origen registrado`,
	origenContenido: "Tipo de contenido",
	origenEnlace: "Tipo de enlace",
	colOrigen: "Origen",
	origenSinPermiso: "Origen de cada venta: requiere un permiso extra en Partner Center",
	parecidos: "Parecidos en el marketplace",
	parecidosNota: (palabras) => palabras.length > 0 ? `Parecidos por palabras del título (${palabras.map((p) => `«${p}»`).join(", ")}). La relevancia la decide TikTok.` : "Parecidos por palabras del título. La relevancia la decide TikTok.",
	ordenParecidos: "Ordenar parecidos",
	porComision: "Mejor comisión",
	porVendidos: "Más vendidos",
	rejillaParecidos: "Productos parecidos del marketplace",
	esteProducto: (partes) => `Este producto: ${partes.join(" · ")}`,
	esteProductoComision: (tasa) => `${tasa} de comisión`,
	vendidosCorto: (u) => `${n(u)} vendidos`,
	enCorte: "En Corte",
	pagaMas: "Paga más",
	sinTasa: "Sin dato",
	verTodosParecidos: (k) => `Ver los ${n(k)}`,
	verMenosParecidos: "Ver menos",
	consultadoEl: (fecha) => `Consultado el ${fecha}`
};
/**
* Utilidades de interacción de Productos. `useClicReciente` distingue el clic (abre) de J/K (solo mueve la selección):
* la Tabla llama alSeleccionar en ambos casos y la pantalla solo abre cuando hubo un puntero hace un momento.
*/
var VENTANA_MS = 700;
function useClicReciente() {
	const ultimo = (0, import_react.useRef)(0);
	return {
		alPuntero: (0, import_react.useCallback)(() => {
			ultimo.current = Date.now();
		}, []),
		fueClic: (0, import_react.useCallback)(() => Date.now() - ultimo.current < VENTANA_MS, [])
	};
}
/** Une clases (las de CSS Modules llegan como string | undefined con noUncheckedIndexedAccess). */
function cx(...clases) {
	return clases.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
/** Lee y escribe en localStorage sin romper si no hay almacenamiento (ventana privada, vista previa). */
function leerLocal(clave) {
	try {
		return window.localStorage.getItem(clave);
	} catch {
		return null;
	}
}
function guardarLocal(clave, valor) {
	try {
		window.localStorage.setItem(clave, valor);
	} catch {}
}
var rutaProducto = (id) => `/productos/${encodeURIComponent(id)}`;
var rutaVideo = (id) => `/videos/${encodeURIComponent(id)}`;
var rutaMuestra = (id) => `/muestras/m/${encodeURIComponent(id)}`;
var rutaTienda = (key) => `/tiendas/${encodeURIComponent(key)}`;
var productos_module_default = {
	pantalla: "_pantalla_1koo9_3",
	trasEncabezado: "_trasEncabezado_1koo9_16",
	refrescando: "_refrescando_1koo9_22",
	srSolo: "_srSolo_1koo9_26",
	estado: "_estado_1koo9_34",
	mono: "_mono_1koo9_37",
	bloque: "_bloque_1koo9_44",
	resumen: "_resumen_1koo9_50",
	mostrando: "_mostrando_1koo9_51",
	carga: "_carga_1koo9_64",
	cargaTarjeta: "_cargaTarjeta_1koo9_69",
	cargaFoto: "_cargaFoto_1koo9_74",
	cargaHeroe: "_cargaHeroe_1koo9_79",
	cargaFotoGrande: "_cargaFotoGrande_1koo9_84",
	cargaHeroeTexto: "_cargaHeroeTexto_1koo9_89",
	cargaKpis: "_cargaKpis_1koo9_96",
	controles: "_controles_1koo9_111",
	filaControles: "_filaControles_1koo9_117",
	filaFiltros: "_filaFiltros_1koo9_118",
	segmentos: "_segmentos_1koo9_125",
	segmentoVista: "_segmentoVista_1koo9_129",
	buscador: "_buscador_1koo9_133",
	chips: "_chips_1koo9_136",
	rejilla: "_rejilla_1koo9_176",
	celda: "_celda_1koo9_191",
	tarjeta: "_tarjeta_1koo9_195",
	chipsFila: "_chipsFila_1koo9_200",
	planear: "_planear_1koo9_211",
	tablaMarco: "_tablaMarco_1koo9_214",
	detalle: "_detalle_1koo9_223",
	heroe: "_heroe_1koo9_229",
	heroeFoto: "_heroeFoto_1koo9_248",
	guardar: "_guardar_1koo9_257",
	heroeTexto: "_heroeTexto_1koo9_260",
	tienda: "_tienda_1koo9_268",
	tituloCompleto: "_tituloCompleto_1koo9_287",
	ficha: "_ficha_1koo9_296",
	fichaPrecio: "_fichaPrecio_1koo9_306",
	dato: "_dato_1koo9_310",
	chipsFicha: "_chipsFicha_1koo9_325",
	sinFicha: "_sinFicha_1koo9_331",
	acciones: "_acciones_1koo9_349",
	id: "_id_1koo9_356",
	kpis: "_kpis_1koo9_366",
	notasPagina: "_notasPagina_1koo9_371",
	notasTarjeta: "_notasTarjeta_1koo9_374",
	seccion: "_seccion_1koo9_380",
	seccionInterior: "_seccionInterior_1koo9_383",
	seccionCabeza: "_seccionCabeza_1koo9_389",
	seccionTitulos: "_seccionTitulos_1koo9_394",
	seccionCabezaConAcciones: "_seccionCabezaConAcciones_1koo9_402",
	seccionAcciones: "_seccionAcciones_1koo9_412",
	seccionTitulo: "_seccionTitulo_1koo9_394",
	seccionNota: "_seccionNota_1koo9_427",
	listaCorta: "_listaCorta_1koo9_428",
	vacioCorto: "_vacioCorto_1koo9_434",
	columnas: "_columnas_1koo9_442",
	columnaAncha: "_columnaAncha_1koo9_448",
	columnaLateral: "_columnaLateral_1koo9_449",
	rejillaVideos: "_rejillaVideos_1koo9_462",
	miniatura: "_miniatura_1koo9_475",
	listaMuestras: "_listaMuestras_1koo9_478",
	galeria: "_galeria_1koo9_491",
	galeriaCuenta: "_galeriaCuenta_1koo9_497",
	tira: "_tira_1koo9_507",
	tiraElemento: "_tiraElemento_1koo9_516",
	miniFoto: "_miniFoto_1koo9_520",
	miniFotoImagen: "_miniFotoImagen_1koo9_533",
	dosTarjetas: "_dosTarjetas_1koo9_565",
	seccionDato: "_seccionDato_1koo9_581",
	destacado: "_destacado_1koo9_586",
	destacadoTexto: "_destacadoTexto_1koo9_597",
	destacadoEtiqueta: "_destacadoEtiqueta_1koo9_603",
	destacadoNota: "_destacadoNota_1koo9_613",
	cifraGrande: "_cifraGrande_1koo9_618",
	renglones: "_renglones_1koo9_631",
	renglon: "_renglon_1koo9_631",
	renglonTexto: "_renglonTexto_1koo9_653",
	renglonEtiqueta: "_renglonEtiqueta_1koo9_659",
	renglonDetalle: "_renglonDetalle_1koo9_666",
	renglonValor: "_renglonValor_1koo9_672",
	renglonCifra: "_renglonCifra_1koo9_682",
	tachada: "_tachada_1koo9_690",
	diferencia: "_diferencia_1koo9_696",
	barras: "_barras_1koo9_713",
	notaChica: "_notaChica_1koo9_716",
	subnota: "_subnota_1koo9_717",
	bloqueMuestra: "_bloqueMuestra_1koo9_725",
	estadoMuestra: "_estadoMuestra_1koo9_731",
	subbloque: "_subbloque_1koo9_740",
	subcabeza: "_subcabeza_1koo9_746",
	subtitulo: "_subtitulo_1koo9_751",
	listaRecuperadas: "_listaRecuperadas_1koo9_758",
	listaSkus: "_listaSkus_1koo9_759",
	recuperada: "_recuperada_1koo9_773",
	recuperadaTexto: "_recuperadaTexto_1koo9_787",
	recuperadaVariante: "_recuperadaVariante_1koo9_793",
	sku: "_sku_1koo9_799",
	skuVariante: "_skuVariante_1koo9_808",
	skuPrecio: "_skuPrecio_1koo9_817",
	skuEstado: "_skuEstado_1koo9_824",
	skuDisponible: "_skuDisponible_1koo9_829",
	verMas: "_verMas_1koo9_843",
	origenBarras: "_origenBarras_1koo9_848",
	notaPermiso: "_notaPermiso_1koo9_854",
	esteProducto: "_esteProducto_1koo9_869",
	rejillaParecidos: "_rejillaParecidos_1koo9_875",
	parecidosPie: "_parecidosPie_1koo9_887",
	videoCelda: "_videoCelda_1koo9_896",
	videoMetricas: "_videoMetricas_1koo9_902",
	videoVistas: "_videoVistas_1koo9_913",
	videoPorMilCifra: "_videoPorMilCifra_1koo9_917",
	videoSinCifras: "_videoSinCifras_1koo9_921",
	sinCorte: "_sinCorte_1koo9_924",
	videoPorMil: "_videoPorMil_1koo9_917"
};
function CargaRejilla(p) {
	const n = p.n ?? 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: cx(productos_module_default.carga),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(productos_module_default.srSolo),
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				ancho: 360,
				alto: 36
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(productos_module_default.rejilla),
				children: Array.from({ length: n }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.cargaTarjeta),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "foto",
						className: cx(productos_module_default.cargaFoto)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "texto",
						lineas: 2
					})]
				}, i))
			})
		]
	});
}
function CargaDetalle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: cx(productos_module_default.carga),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(productos_module_default.srSolo),
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.cargaHeroe),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "foto",
					className: cx(productos_module_default.cargaFotoGrande)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.cargaHeroeTexto),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							ancho: "35%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "titulo",
							ancho: "80%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							lineas: 3,
							ancho: "70%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "bloque",
							ancho: 260,
							alto: 44
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(productos_module_default.cargaKpis),
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }, i))
			})
		]
	});
}
function ErrorVista(p) {
	if (p.error.codigo === "necesita_pc") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Monitor",
		titulo: T.necesitaPc,
		texto: T.necesitaPcTexto,
		className: cx(productos_module_default.estado)
	});
	if (p.error.codigo === "no_encontrado") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Tag",
		titulo: T.noExiste,
		texto: T.noExisteTexto,
		accion: {
			etiqueta: T.verProductos,
			alPulsar: () => navegar("/productos")
		},
		className: cx(productos_module_default.estado)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "CircleAlert",
		titulo: p.titulo,
		texto: p.error.mensaje,
		accion: {
			etiqueta: T.reintentar,
			alPulsar: p.alReintentar
		},
		className: cx(productos_module_default.estado)
	});
}
/**
* Columnas de la tabla que CABEN en su marco (02 §7.5: sin texto cortado ni scroll horizontal). La Tabla de
* @/componentes solo quita las `prescindible` en ancho 'media'; en expandida (1180–1439, ~968 px útiles) las columnas
* fijas de @/bloques suman más que el marco y la columna flexible del nombre (minmax(0, fr)) se queda en 0.
* (Copia por carpeta: las pantallas no importan de otra carpeta de pantallas, BUILD_SPEC §8.2.)
* Aquí se mide el marco y se quitan columnas de menor a mayor prioridad hasta que cada columna flexible tenga su
* mínimo. El orden de las que quedan no cambia. Sin medida (happy-dom, primer cuadro sin layout) no se quita nada.
*/
/** Holgura para el borde del marco y el redondeo de las pistas. */
var HOLGURA = 8;
/** px fijos; 'minmax(200px, 1.6fr)' → 200 (o el mínimo de la regla si es mayor); '2fr' → el de la regla o 160. */
function anchoMinimo(c, minimos) {
	if (typeof c.ancho === "number") return c.ancho;
	const propio = typeof c.ancho === "string" ? /^\s*minmax\(\s*(\d+(?:\.\d+)?)px/.exec(c.ancho)?.[1] : void 0;
	const deRegla = minimos?.[c.id];
	if (propio !== void 0) return Math.max(Number(propio), deRegla ?? 0);
	if (typeof c.ancho === "string" && /^\s*\d+(?:\.\d+)?px\s*$/.test(c.ancho)) return parseFloat(c.ancho);
	return deRegla ?? 160;
}
/** Función pura (probada aparte): columnas que caben en `ancho` px según la regla. */
function columnasQueCaben(columnas, ancho, regla) {
	if (!(ancho > 0)) return [...columnas];
	const rango = (id) => {
		const i = regla.prioridad.indexOf(id);
		return i < 0 ? Number.MAX_SAFE_INTEGER : i;
	};
	const quedan = new Set(columnas.map((c) => c.id));
	const suma = () => columnas.filter((c) => quedan.has(c.id)).reduce((s, c) => s + anchoMinimo(c, regla.minimos), 0);
	const candidatas = columnas.filter((c) => !regla.fijas.includes(c.id)).sort((a, b) => rango(b.id) - rango(a.id));
	for (const c of candidatas) {
		if (suma() + HOLGURA <= ancho) break;
		quedan.delete(c.id);
	}
	return columnas.filter((c) => quedan.has(c.id));
}
/** Mide el marco (ResizeObserver) y devuelve las columnas que caben; `ref` va en el contenedor de la Tabla. */
function useColumnasQueCaben(columnas, regla) {
	const [ancho, setAncho] = (0, import_react.useState)(0);
	const [el, setEl] = (0, import_react.useState)(null);
	const reglaRef = (0, import_react.useRef)(regla);
	reglaRef.current = regla;
	const ref = (0, import_react.useCallback)((nodo) => setEl(nodo), []);
	(0, import_react.useLayoutEffect)(() => {
		if (!el) return void 0;
		const medir = () => setAncho(Math.floor(el.clientWidth));
		medir();
		if (typeof ResizeObserver === "undefined") return void 0;
		const o = new ResizeObserver(medir);
		o.observe(el);
		return () => o.disconnect();
	}, [el]);
	return {
		ref,
		columnas: (0, import_react.useMemo)(() => sinPrescindibles(columnasQueCaben(columnas, ancho, reglaRef.current)), [columnas, ancho])
	};
}
/**
* Quien decide qué columnas caben es la medida, no la clase de ancho: la Tabla quita TODAS las `prescindible` en 'media'
* (600–1179) aunque sobre espacio (a 960 la de Productos se quedaba con 3 columnas en 816 px). Las que ya pasaron por
* columnasQueCaben caben, así que se entregan sin esa marca.
*/
function sinPrescindibles(columnas) {
	return columnas.map((c) => c.prescindible ? {
		...c,
		prescindible: false
	} : c);
}
/** Columnas de columnasProductos() que se quedan cuando no caben todas en la tabla (producto y comisión siempre). */
var REGLA_COLUMNAS = {
	prioridad: [
		"producto",
		"comision",
		"unidades",
		"tienda",
		"videos",
		"pedidos",
		"reembolsos",
		"tasa",
		"vitrina"
	],
	fijas: ["producto", "comision"],
	minimos: {
		producto: 240,
		tienda: 160
	}
};
/**
* Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
* en MAYÚSCULAS: «BOTA CASUAL DE PIEL PARA HOMBRE…»); normalizarTitulo es de la capa de vista, así que se aplica aquí.
* Un nombre corto en mayúsculas y minúsculas (el que escribió el usuario, o uno normal) no cambia. Sin corto, el
* nombre corto del título.
*/
function nombreVisible(corto, titulo) {
	const c = corto?.replace(/\s+/g, " ").trim();
	return c ? normalizarTitulo(c) : nombreCorto(titulo);
}
/** La fila con su nombre corto normalizado, para los bloques que lo pintan tal cual (columnasProductos de la tabla). */
function filaConNombre(f) {
	const c = f.titulo_corto;
	if (!c || !c.trim()) return f;
	const n = nombreVisible(c, f.titulo);
	return n === c ? f : {
		...f,
		titulo_corto: n
	};
}
/** La muestra con el nombre corto del producto normalizado, para TarjetaMuestra (que lo pinta tal cual). */
function muestraConNombre(m) {
	const c = m.producto.titulo_corto;
	if (!c || !c.trim()) return m;
	const n = nombreVisible(c, m.producto.titulo);
	return n === c ? m : {
		...m,
		producto: {
			...m.producto,
			titulo_corto: n
		}
	};
}
var SEGMENTOS = [
	"vendidos",
	"sin_ventas",
	"todos"
];
function esSegmento(v) {
	return v !== null && SEGMENTOS.includes(v);
}
/** P1: productos con al menos una línea válida, de más a menos comisión. */
function productosVendidos(items) {
	return items.filter((x) => x.pedidos_validos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos || b.unidades - a.unidades || a.product_id.localeCompare(b.product_id));
}
/** P5: productos de muestras RECIBIDAS cuyo product_id no aparece en líneas válidas. */
function muestrasSinVentas(recibidas, productos) {
	const vendidos = new Set(productos.filter((x) => x.pedidos_validos > 0).map((x) => x.product_id));
	const porProducto = /* @__PURE__ */ new Map();
	for (const m of recibidas) {
		if (!m.recibida) continue;
		const id = m.producto.product_id;
		if (vendidos.has(id)) continue;
		const lista = porProducto.get(id);
		if (lista) lista.push(m);
		else porProducto.set(id, [m]);
	}
	const salida = [];
	for (const lista of porProducto.values()) {
		const muestra = [...lista].sort((a, b) => Number(esPendiente(b)) - Number(esPendiente(a)) || (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0))[0];
		if (muestra) salida.push({
			producto: muestra.producto,
			muestra,
			muestras: lista.length
		});
	}
	return salida.sort((a, b) => Number(esPendiente(b.muestra)) - Number(esPendiente(a.muestra)) || (a.muestra.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.muestra.posicion_cola ?? Number.MAX_SAFE_INTEGER) || (b.muestra.solicitada_at ?? 0) - (a.muestra.solicitada_at ?? 0));
}
/** «20 productos con ventas · 15 productos de muestra recibidos · 10 todavía sin ventas» (01 §4.13, P1, P5, P6). */
function resumenProductos(productos, recibidas) {
	const conVentas = productos.filter((x) => x.pedidos_validos > 0).length;
	if (!recibidas) return {
		conVentas,
		deMuestra: null,
		sinVentas: null,
		yaVendieron: null
	};
	const deMuestra = new Set(recibidas.filter((m) => m.recibida).map((m) => m.producto.product_id)).size;
	const sinVentas = muestrasSinVentas(recibidas, productos).length;
	return {
		conVentas,
		deMuestra,
		sinVentas,
		yaVendieron: deMuestra - sinVentas
	};
}
/** P7: días desde que se publicó el video de la muestra, si pasan de 14 (y la muestra sigue sin ventas). */
function diasPublicadoSinVentas(m, hoy) {
	if (m.avance.etapa !== "publicada" || !m.avance.fecha_publicada) return null;
	const dias = diasEntre(m.avance.fecha_publicada, hoy);
	return dias > 14 ? dias : null;
}
/** Etapas anteriores a Publicada (las que todavía se pueden planear). */
function puedePlanear(m) {
	return m.avance.etapa === "por_planear" || m.avance.etapa === "planeada" || m.avance.etapa === "video_listo" || m.avance.etapa === "programada";
}
/** Muestras recibidas y productos de pedidos, sin repetir (01 §4.13 «Todos»). */
function todosLosProductos(productos, recibidas) {
	const porId = /* @__PURE__ */ new Map();
	for (const x of productos) porId.set(x.product_id, {
		product_id: x.product_id,
		nombre: nombreVisible(x.titulo_corto, x.titulo),
		imagen: x.imagen,
		tienda: x.tienda_nombre,
		categoria: null,
		fila: x,
		muestra: null,
		conVentas: x.pedidos_validos > 0,
		fueMuestra: x.es_muestra,
		enVitrina: x.en_vitrina === true
	});
	for (const m of recibidas) {
		if (!m.recibida) continue;
		const id = m.producto.product_id;
		const previo = porId.get(id);
		if (previo) {
			if (!previo.muestra) porId.set(id, {
				...previo,
				muestra: m,
				fueMuestra: true,
				categoria: previo.categoria ?? m.producto.categoria,
				imagen: previo.imagen ?? m.producto.imagen
			});
			continue;
		}
		porId.set(id, {
			product_id: id,
			nombre: nombreVisible(m.producto.titulo_corto, m.producto.titulo),
			imagen: m.producto.imagen,
			tienda: m.tienda.nombre,
			categoria: m.producto.categoria,
			fila: null,
			muestra: m,
			conVentas: false,
			fueMuestra: true,
			enVitrina: m.producto.en_vitrina === true
		});
	}
	return [...porId.values()].sort((a, b) => (b.fila?.comision_estimada_centavos ?? 0) - (a.fila?.comision_estimada_centavos ?? 0) || a.nombre.localeCompare(b.nombre, "es-MX"));
}
function filtrarTodos(items, f) {
	const q = f.q.trim();
	return items.filter((x) => {
		if (f.conVentas && !x.conVentas) return false;
		if (f.sinVentas && x.conVentas) return false;
		if (f.fueMuestra && !x.fueMuestra) return false;
		if (f.enVitrina && !x.enVitrina) return false;
		if (q && !coincide(q, x.nombre, x.tienda)) return false;
		return true;
	});
}
function buscarFilas(items, q) {
	const t = q.trim();
	if (!t) return [...items];
	return items.filter((x) => coincide(t, nombreVisible(x.titulo_corto, x.titulo), x.titulo, x.tienda_nombre));
}
/** Lo que muestra el detalle, venga o no la ficha (la cascada de imagen ya la resolvió el hub, C39). */
function vistaDetalle(d) {
	const ficha = d.ficha;
	const fila = d.fila;
	const muestra = d.muestras[0] ?? null;
	const titulo = ficha?.titulo ?? fila?.titulo ?? muestra?.producto.titulo ?? null;
	const corto = nombreVisible(ficha?.titulo_corto ?? fila?.titulo_corto ?? muestra?.producto.titulo_corto, titulo);
	const imagen = ficha?.imagen ?? fila?.imagen ?? muestra?.producto.imagen ?? null;
	const tienda = fila?.tienda_nombre ?? muestra?.tienda.nombre ?? null;
	const tiendaKey = fila?.tienda_key ?? muestra?.tienda.tienda_key ?? null;
	const resumen = (ficha && ficha.titulo_corto && ficha.titulo_corto !== corto ? {
		...ficha,
		titulo_corto: corto
	} : ficha) ?? (imagen ? {
		product_id: d.product_id,
		titulo,
		titulo_corto: corto,
		imagen,
		enlace: null,
		precio_min_centavos: null,
		precio_max_centavos: null,
		precio_venta_min_centavos: null,
		precio_venta_max_centavos: null,
		precio_fuente: null,
		comision_bp: null,
		comision_por_venta_centavos: null,
		comision_por_venta_max_centavos: null,
		unidades_vendidas_global: null,
		en_colaboracion_abierta: false,
		en_vitrina: fila?.en_vitrina ?? null,
		categoria: null
	} : null);
	const { prefijo, resto } = partirPromocion(titulo);
	return {
		nombre: corto,
		tituloCompleto: resto,
		promocion: prefijo,
		imagen,
		tienda,
		tiendaKey,
		conFicha: ficha !== null,
		resumen
	};
}
/** 02 §4.4: «【Buen Fin】Chaqueta…» → prefijo 'Buen Fin' y el título normalizado sin él. */
function partirPromocion(titulo) {
	if (!titulo || !titulo.trim()) return {
		prefijo: null,
		resto: null
	};
	const m = /^\s*[【\[]([^】\]]{1,40})[】\]]\s*/u.exec(titulo);
	const resto = normalizarTitulo(m ? titulo.slice(m[0].length) : titulo);
	return {
		prefijo: m?.[1]?.trim() || null,
		resto: resto || null
	};
}
var puntoVacio = (clave, etiqueta) => ({
	clave,
	etiqueta,
	pedidos: 0,
	pedidos_reembolsados: 0,
	unidades: 0,
	ventas_centavos: 0,
	comision_estimada_centavos: 0,
	comision_liquidada_centavos: 0
});
function mesSiguiente(clave) {
	const anio = Number(clave.slice(0, 4));
	const mes = Number(clave.slice(5, 7));
	return mes >= 12 ? `${anio + 1}-01` : `${anio}-${String(mes + 1).padStart(2, "0")}`;
}
/** 'ago 26', como las etiquetas del hub. */
function etiquetaMes(clave) {
	return `${T.meses[Number(clave.slice(5, 7)) - 1] ?? clave.slice(5, 7)} ${clave.slice(2, 4)}`;
}
/**
* Serie mensual CONTINUA para la gráfica: el hub solo manda los meses con pedidos, y un producto que vendió en marzo y
* en octubre saldría con dos columnas juntas, como si fueran meses seguidos. Rellena con ceros los meses sin pedidos
* desde el primero hasta el mes en curso. Si la serie no trae claves 'YYYY-MM' no la toca. Tope de 10 años.
*/
function serieMensualContinua(serie, mesActual) {
	if (serie.length === 0 || serie.some((p) => !/^\d{4}-(0[1-9]|1[0-2])$/.test(p.clave)) || !/^\d{4}-\d{2}$/.test(mesActual)) return [...serie];
	const porClave = new Map(serie.map((p) => [p.clave, p]));
	const claves = [...porClave.keys()].sort();
	const primera = claves[0] ?? mesActual;
	const ultima = claves[claves.length - 1] ?? mesActual;
	const fin = ultima > mesActual ? ultima : mesActual;
	const salida = [];
	for (let k = primera; k <= fin && salida.length < 120; k = mesSiguiente(k)) salida.push(porClave.get(k) ?? puntoVacio(k, etiquetaMes(k)));
	return salida;
}
/** Mes con más comisión (nota de la gráfica); null sin ventas. */
function mejorMes(serie) {
	let mejor = null;
	for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
	return mejor;
}
/** Etiqueta del eje: sin el año si toda la serie es del mismo año ('feb 26' → 'feb'). */
function etiquetasMes(serie) {
	const anios = new Set(serie.map((x) => x.clave.slice(0, 4)));
	return serie.map((x) => anios.size <= 1 ? x.etiqueta.replace(/\s+\d{2,4}$/, "") : x.etiqueta);
}
/** product_id de una portada '/img/p/<id>?v=…'; null si no es de producto. */
function productoDePortada(url) {
	if (!url) return null;
	return /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url)?.[1] ?? null;
}
/** Portada de un video: la REAL de TikTok ('/img/v/…') si existe; si no, la foto del producto (rotulada). */
function portadaVideo(v) {
	if (v.portada) return {
		url: v.portada,
		delProducto: false
	};
	return {
		url: v.miniatura,
		delProducto: v.miniatura !== null && v.miniatura_origen !== null
	};
}
/** 9,876 · 48.2 mil · 482 mil · 1.3 M. */
function cifraCompacta(n) {
	const abs = Math.abs(n);
	const uno = (x) => (Math.round(x * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 });
	if (abs < 1e4) return n.toLocaleString("es-MX", { maximumFractionDigits: 0 });
	if (abs < 1e5) return `${uno(n / 1e3)} mil`;
	if (abs < 1e6) return `${Math.round(n / 1e3).toLocaleString("es-MX")} mil`;
	return `${uno(n / 1e6)} M`;
}
/** «Pedidos por 1,000 vistas» con 2 decimales. */
function textoPorMil(x) {
	return x.toLocaleString("es-MX", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
/**
* #/productos · Productos con foto (01_ux §4.13). Encabezado «20 productos con ventas · 15 productos de muestra
* recibidos · 10 todavía sin ventas». Segmentos: Más vendidos (por omisión; cuadrícula o tabla en Windows) · Muestras sin
* ventas (grupo, etapa, «Sin ventas todavía», [Planear video] y «Publicado hace {n} días sin ventas») · Todos (muestras
* y productos de pedidos, con filtros). La foto ya viene resuelta por el hub (cascada de 3 pasos, C39); sin foto, Foto
* pinta el mosaico de la tienda.
*/
var CLAVE_VISTA = "corte.productos.vista";
var SIN_FILTROS = {
	conVentas: false,
	sinVentas: false,
	fueMuestra: false,
	enVitrina: false,
	q: ""
};
function ChipsProducto(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(productos_module_default.chipsFila),
		"data-renglones": p.renglones,
		children: [
			p.videos && p.videos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				tono: "neutro",
				icono: "Play",
				children: T.videos(p.videos)
			}) : null,
			p.fueMuestra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				tono: "marca",
				icono: "Package",
				children: T.fueMuestra
			}) : null,
			p.enVitrina ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				tono: "info",
				icono: "Store",
				children: T.enVitrina
			}) : null
		]
	});
}
function TarjetaVendido(p) {
	const x = p.fila;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: cx(productos_module_default.celda),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
			imagen: x.imagen,
			nombre: nombreVisible(x.titulo_corto, x.titulo),
			tienda: x.tienda_nombre,
			cifraPrincipal: formato.dinero(x.comision_estimada_centavos),
			cifraSecundaria: T.unidades(x.unidades),
			...p.lugar <= 10 ? { ranking: p.lugar } : {},
			chips: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsProducto, {
				videos: x.videos,
				fueMuestra: x.es_muestra,
				enVitrina: x.en_vitrina === true,
				renglones: 2
			}),
			alPulsar: () => navegar(rutaProducto(x.product_id)),
			className: cx(productos_module_default.tarjeta)
		})
	});
}
function TarjetaSinVentas(p) {
	const m = p.item.muestra;
	const producto = p.item.producto;
	const dias = diasPublicadoSinVentas(m, p.hoy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: cx(productos_module_default.celda),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
			imagen: producto.imagen,
			nombre: nombreVisible(producto.titulo_corto, producto.titulo),
			tienda: m.tienda.nombre,
			categoria: producto.categoria,
			cifraPrincipal: formato.dinero(0),
			cifraSecundaria: T.sinVentasTodavia,
			chips: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: TONO_GRUPO[m.grupo],
					icono: ICONO_GRUPO[m.grupo],
					children: ETIQUETA_GRUPO[m.grupo]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipEtapa, {
					paso: PASO_ETAPA[m.avance.etapa],
					icono: ICONO_ETAPA[m.avance.etapa],
					children: ETIQUETA_ETAPA[m.avance.etapa]
				}),
				dias !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: "atencion",
					icono: "Clock",
					children: T.publicadoSinVentas(dias)
				}) : null,
				puedePlanear(m) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					anchoCompleto: true,
					alPulsar: () => p.alPlanear(m),
					className: cx(productos_module_default.planear),
					children: T.planearVideo
				}) : null
			] }),
			alPulsar: () => navegar(rutaProducto(producto.product_id)),
			className: cx(productos_module_default.tarjeta)
		})
	});
}
function TarjetaTodos(p) {
	const x = p.item;
	const vendio = x.fila !== null && x.conVentas;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: cx(productos_module_default.celda),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
			imagen: x.imagen,
			nombre: x.nombre,
			tienda: x.tienda,
			categoria: x.categoria,
			cifraPrincipal: formato.dinero(vendio && x.fila ? x.fila.comision_estimada_centavos : 0),
			cifraSecundaria: vendio && x.fila ? T.unidades(x.fila.unidades) : T.sinVentas,
			chips: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsProducto, {
				fueMuestra: x.fueMuestra,
				enVitrina: x.enVitrina,
				renglones: 1
			}),
			alPulsar: () => navegar(rutaProducto(x.product_id)),
			className: cx(productos_module_default.tarjeta)
		})
	});
}
function PantallaProductos() {
	const [segParam, setSegmento] = useParametro("segmento");
	const segmento = esSegmento(segParam) ? segParam : "vendidos";
	const [vista, setVistaEstado] = (0, import_react.useState)(() => leerLocal(CLAVE_VISTA) === "tabla" ? "tabla" : "cuadricula");
	const [q, setQ] = (0, import_react.useState)("");
	const [filtros, setFiltros] = (0, import_react.useState)(SIN_FILTROS);
	const ancho = useClaseAncho();
	const angosta = usePlataforma() === "android" || ancho === "compacta";
	const conTabla = !angosta;
	const clic = useClicReciente();
	const control = useControlMuestra();
	const sync = useSync();
	const hoy = hoyLocal();
	const productos = useConsulta("productos", {});
	const recibidas = useConsulta("muestras", { recibidas: true });
	const filas = productos.datos?.items;
	const muestras = recibidas.datos?.items;
	const vendidos = (0, import_react.useMemo)(() => productosVendidos(filas ?? []), [filas]);
	const sinVentas = (0, import_react.useMemo)(() => muestras ? muestrasSinVentas(muestras, filas ?? []) : [], [muestras, filas]);
	const todos = (0, import_react.useMemo)(() => todosLosProductos(filas ?? [], muestras ?? []), [filas, muestras]);
	const resumen = (0, import_react.useMemo)(() => resumenProductos(filas ?? [], muestras), [filas, muestras]);
	const ajuste = useColumnasQueCaben((0, import_react.useMemo)(() => columnasProductos(), []), REGLA_COLUMNAS);
	const setVista = (v) => {
		setVistaEstado(v);
		guardarLocal(CLAVE_VISTA, v);
	};
	const quitarFiltros = () => {
		setQ("");
		setFiltros(SIN_FILTROS);
	};
	const consultaPrincipal = segmento === "sin_ventas" ? recibidas : productos;
	const necesitaMuestras = segmento !== "vendidos";
	const cargando = productos.cargando || !filas && !productos.error || necesitaMuestras && (recibidas.cargando || !muestras && !recibidas.error);
	const error = productos.error && !filas ? productos.error : necesitaMuestras && recibidas.error && !muestras ? recibidas.error : null;
	const sinNada = !!filas && filas.length === 0 && !!muestras && !muestras.some((m) => m.recibida);
	let cuerpo;
	if (error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
		error,
		titulo: T.errorTitulo,
		alReintentar: () => void consultaPrincipal.refrescar()
	});
	else if (cargando) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaRejilla, {});
	else if (sinNada) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Shirt",
		titulo: T.nadaTitulo,
		texto: T.nadaTexto,
		...sync.puede ? { accion: {
			etiqueta: T.sincronizar,
			alPulsar: () => void sync.sincronizar()
		} } : {},
		className: cx(productos_module_default.estado)
	});
	else if (segmento === "vendidos") {
		const visibles = buscarFilas(vendidos, q);
		if (vendidos.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Tag",
			titulo: T.vacioTitulo,
			texto: T.vacioTexto,
			className: cx(productos_module_default.estado)
		});
		else if (visibles.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Search",
			titulo: T.sinResultados,
			texto: T.sinResultadosTexto,
			accion: {
				etiqueta: T.quitarFiltros,
				alPulsar: quitarFiltros
			},
			className: cx(productos_module_default.estado)
		});
		else if (conTabla && vista === "tabla") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(productos_module_default.tablaMarco),
			ref: ajuste.ref,
			onPointerDownCapture: clic.alPuntero,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
				etiqueta: T.tablaEtiqueta,
				filas: visibles.map(filaConNombre),
				columnas: ajuste.columnas,
				idFila: (x) => x.product_id,
				alAbrir: (x) => navegar(rutaProducto(x.product_id)),
				alSeleccionar: (x) => {
					if (clic.fueClic()) navegar(rutaProducto(x.product_id));
				},
				claveScroll: "productos-vendidos"
			})
		});
		else {
			const lugar = new Map(vendidos.map((x, i) => [x.product_id, i + 1]));
			cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(productos_module_default.rejilla),
				"aria-label": T.rejillaVendidos,
				children: visibles.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaVendido, {
					fila: x,
					lugar: lugar.get(x.product_id) ?? 99
				}, x.product_id))
			});
		}
	} else if (segmento === "sin_ventas") cuerpo = sinVentas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "CircleCheckBig",
		titulo: T.sinVentasVacioTitulo,
		texto: T.sinVentasVacioTexto,
		className: cx(productos_module_default.estado)
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.bloque),
		children: [resumen.deMuestra !== null && resumen.yaVendieron !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.resumen),
			children: T.sinVentasResumen(resumen.deMuestra, resumen.yaVendieron)
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(productos_module_default.rejilla),
			"aria-label": T.rejillaSinVentas,
			children: sinVentas.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaSinVentas, {
				item: x,
				hoy,
				alPlanear: (m) => void control.planear(m)
			}, x.producto.product_id))
		})]
	});
	else {
		const visibles = filtrarTodos(todos, {
			...filtros,
			q
		});
		cuerpo = visibles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Search",
			titulo: T.sinResultados,
			texto: T.sinResultadosTexto,
			accion: {
				etiqueta: T.quitarFiltros,
				alPulsar: quitarFiltros
			},
			className: cx(productos_module_default.estado)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(productos_module_default.bloque),
			children: [visibles.length !== todos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(productos_module_default.mostrando),
				"aria-live": "polite",
				children: T.mostrando(visibles.length, todos.length)
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(productos_module_default.rejilla),
				"aria-label": T.rejillaTodos,
				children: visibles.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaTodos, { item: x }, x.product_id))
			})]
		});
	}
	const conteoVitrina = todos.filter((x) => x.enVitrina).length;
	const buscador = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
		etiqueta: T.buscar,
		etiquetaOculta: true,
		tipo: "search",
		placeholder: T.buscar,
		valor: q,
		alCambiar: setQ,
		className: cx(productos_module_default.buscador)
	});
	const contexto = filas && !sinNada ? T.contexto(resumen.conVentas, resumen.deMuestra, resumen.sinVentas) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.titulo,
		lista: !!filas || !!productos.error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(productos_module_default.pantalla),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
					titulo: T.titulo,
					...contexto ? { contexto } : {},
					...segmento === "vendidos" && conTabla && !sinNada && filas ? { acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
						etiqueta: T.vista,
						valor: vista,
						alCambiar: setVista,
						opciones: [{
							valor: "cuadricula",
							etiqueta: T.vistaCuadricula,
							icono: "LayoutGrid"
						}, {
							valor: "tabla",
							etiqueta: T.vistaTabla,
							icono: "LayoutList"
						}],
						className: cx(productos_module_default.segmentoVista)
					}) } : {}
				}),
				sinNada ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.controles, productos_module_default.trasEncabezado),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(productos_module_default.filaControles),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
							etiqueta: T.segmentos,
							valor: segmento,
							alCambiar: (s) => setSegmento(s === "vendidos" ? null : s, { reemplazar: true }),
							opciones: [
								{
									valor: "vendidos",
									etiqueta: angosta ? T.segVendidosCorto : T.segVendidos,
									...filas && !angosta ? { conteo: resumen.conVentas } : {}
								},
								{
									valor: "sin_ventas",
									etiqueta: angosta ? T.segSinVentasCorto : T.segSinVentas,
									...resumen.sinVentas !== null && !angosta ? { conteo: resumen.sinVentas } : {}
								},
								{
									valor: "todos",
									etiqueta: T.segTodos
								}
							],
							...angosta ? { anchoCompleto: true } : {},
							className: cx(productos_module_default.segmentos)
						})
					}), segmento !== "sin_ventas" && filas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(productos_module_default.filaFiltros),
						"data-solo-busqueda": segmento === "vendidos" ? "" : void 0,
						children: [segmento === "todos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(productos_module_default.chips),
							role: "group",
							"aria-label": T.filtros,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
									activo: filtros.conVentas,
									alCambiar: (a) => setFiltros((f) => ({
										...f,
										conVentas: a,
										sinVentas: a ? false : f.sinVentas
									})),
									children: T.filtroConVentas
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
									activo: filtros.sinVentas,
									alCambiar: (a) => setFiltros((f) => ({
										...f,
										sinVentas: a,
										conVentas: a ? false : f.conVentas
									})),
									children: T.filtroSinVentas
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
									activo: filtros.fueMuestra,
									alCambiar: (a) => setFiltros((f) => ({
										...f,
										fueMuestra: a
									})),
									children: T.filtroFueMuestra
								}),
								conteoVitrina > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
									activo: filtros.enVitrina,
									conteo: conteoVitrina,
									alCambiar: (a) => setFiltros((f) => ({
										...f,
										enVitrina: a
									})),
									children: T.filtroVitrina
								}) : null
							]
						}) : null, buscador]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(productos_module_default.trasEncabezado, (productos.refrescando || recibidas.refrescando) && productos_module_default.refrescando),
					children: cuerpo
				})
			]
		})
	});
}
function extendidoDe(d) {
	return d.extendido ?? null;
}
function vistaComision(d) {
	const x = extendidoDe(d);
	const ficha = d.ficha;
	const real = x?.comision_real ?? null;
	const principal = real?.por_tasa[0] ?? null;
	let abierto = null;
	if (ficha && ficha.en_colaboracion_abierta && ficha.comision_bp !== null) abierto = {
		bp: ficha.comision_bp,
		porVentaMin: ficha.comision_por_venta_centavos,
		porVentaMax: ficha.comision_por_venta_max_centavos
	};
	else if (real?.plan_abierto_bp != null) abierto = {
		bp: real.plan_abierto_bp,
		porVentaMin: null,
		porVentaMax: null
	};
	const todos = x?.planes_dirigidos ?? [];
	if (!abierto && todos.length === 0 && !real) return null;
	return {
		abierto,
		dirigidos: todos.slice(0, 3),
		dirigidosOcultos: Math.max(0, todos.length - 3),
		real,
		principal,
		diferenciaBp: real && abierto ? real.tasa_principal_bp - abierto.bp : null,
		conCampana: real ? real.por_tasa.reduce((s, t) => s + t.lineas_con_campana, 0) : 0
	};
}
/** Puntos porcentuales de una diferencia en puntos base: 400 → 4 · 250 → 2.5. */
function puntosDe(bp) {
	return Math.round(Math.abs(bp)) / 100;
}
function rango(min, max) {
	if (min === null && max === null) return null;
	const a = min ?? max ?? 0;
	const b = max ?? min ?? 0;
	return a <= b ? [a, b] : [b, a];
}
function vistaPrecio(d) {
	const v = extendidoDe(d)?.vitrina ?? null;
	const ficha = d.ficha;
	if (!v && !ficha) return null;
	const lista = v ? rango(v.precio_lista_min_centavos, v.precio_lista_max_centavos) ?? (ficha ? rango(ficha.precio_min_centavos, ficha.precio_max_centavos) : null) : ficha ? rango(ficha.precio_min_centavos, ficha.precio_max_centavos) : null;
	const venta = v ? rango(v.precio_venta_min_centavos, v.precio_venta_max_centavos) : ficha ? rango(ficha.precio_venta_min_centavos, ficha.precio_venta_max_centavos) : null;
	const ventaUtil = !v && venta && lista && venta[0] === lista[0] && venta[1] === lista[1] ? null : venta;
	const plataforma = v ? rango(v.precio_plataforma_min_centavos, v.precio_plataforma_max_centavos) : null;
	const plataformaUtil = plataforma && ventaUtil && plataforma[0] >= ventaUtil[0] && plataforma[1] >= ventaUtil[1] ? null : plataforma;
	const fila = d.fila;
	const promedio = fila && fila.unidades > 0 && fila.ventas_centavos > 0 ? Math.round(fila.ventas_centavos / fila.unidades) : null;
	const final = plataformaUtil?.[0] ?? ventaUtil?.[0] ?? null;
	const descuento = lista && final !== null && lista[0] > 0 && final < lista[0] ? 1 - final / lista[0] : null;
	if (!lista && !ventaUtil && !plataformaUtil) return null;
	return {
		deVitrina: !!v,
		lista,
		venta: ventaUtil,
		plataforma: plataformaUtil,
		descuento: descuento !== null && descuento >= .05 ? descuento : null,
		promedio,
		unidades: fila?.unidades ?? 0,
		existencias: v?.con_existencias ?? null,
		oculto: v?.oculto === true
	};
}
/** Chip del estado de samples/labels: en proceso (info), puedes pedir (ok), límite (ámbar), no se puede (neutro). */
function estiloElegibilidad(m) {
	if (m.estado === "ONGOING") return {
		tono: "info",
		icono: "Hourglass"
	};
	if (m.estado === "COMPLETE") return {
		tono: "neutro",
		icono: "CircleCheckBig"
	};
	if (m.limite_alcanzado) return {
		tono: "atencion",
		icono: "CircleAlert"
	};
	if (m.puede_solicitar === true) return {
		tono: "ok",
		icono: "Check"
	};
	if (m.puede_solicitar === false) return {
		tono: "neutro",
		icono: "Ban"
	};
	return {
		tono: "neutro",
		icono: "CircleHelp"
	};
}
/** «Puedes pedir otra»: ya la pediste (o se completó) y TikTok dice que puedes volver a pedir. */
function puedePedirOtra(m) {
	return m.puede_solicitar === true && (m.estado === "COMPLETE" || m.application_id !== null);
}
/** Tono del motivo de una variante que no se puede pedir: agotado en ámbar, «ya la pediste» en info, lo demás neutro. */
function estiloSku(s) {
	if (s.disponible !== false) return null;
	if (s.motivo_no_disponible === "OUT_OF_STOCK") return {
		tono: "atencion",
		icono: "CircleMinus"
	};
	if (s.motivo_no_disponible === "ALREADY_APPLYED") return {
		tono: "info",
		icono: "Check"
	};
	return {
		tono: "neutro",
		icono: "Ban"
	};
}
/** Tono del cumplimiento de una solicitud recuperada. */
function estiloCumplimiento(c) {
	switch (c) {
		case "SUCCEED":
		case "REPEATED":
		case "EXEMPTED": return {
			tono: "ok",
			icono: "CircleCheckBig"
		};
		case "OVERDUE":
		case "FAILED": return {
			tono: "atencion",
			icono: "CircleAlert"
		};
		case "PENDING":
		case "ONGOING": return {
			tono: "info",
			icono: "Clock"
		};
		default: return {
			tono: "neutro",
			icono: "CircleMinus"
		};
	}
}
function resumenSkus(skus) {
	return {
		disponibles: skus.filter((s) => s.disponible === true).length,
		total: skus.length
	};
}
/** ¿Hay algo de la muestra que decir (además de las muestras de la búsqueda)? */
function hayMuestraExtendida(d) {
	const x = extendidoDe(d);
	return !!x && (x.muestra !== null || x.solicitudes_recuperadas.length > 0);
}
/** 'datos' = hay origen de ventas · 'aviso' = falta el permiso (solo se dice si el producto tiene ventas) · null. */
function estadoOrigen(d) {
	const x = extendidoDe(d);
	if (!x) return null;
	if (x.origen_ventas && x.origen_ventas.lineas > 0) return "datos";
	if (x.origen_ventas_aviso === "sin_permiso" && (d.fila?.pedidos ?? 0) > 0) return "aviso";
	return null;
}
var menosInfinito = (n) => n === null ? Number.NEGATIVE_INFINITY : n;
/** Copia ordenada: por comisión (tasa, luego monto por venta, luego vendidos) o por vendidos (luego tasa). Estable. */
function ordenarParecidos(items, criterio) {
	const conIndice = items.map((x, i) => ({
		x,
		i
	}));
	conIndice.sort((a, b) => {
		const porComision = menosInfinito(b.x.comision_bp) - menosInfinito(a.x.comision_bp) || menosInfinito(b.x.comision_por_venta_centavos) - menosInfinito(a.x.comision_por_venta_centavos);
		const porVendidos = menosInfinito(b.x.unidades_vendidas_global) - menosInfinito(a.x.unidades_vendidas_global);
		const d = criterio === "comision" ? porComision || porVendidos : porVendidos || porComision;
		return Number.isNaN(d) || d === 0 ? a.i - b.i : d;
	});
	return conIndice.map((c) => c.x);
}
/**
* Ficha completa de producto (contrato rev. 4, 15/11: ProductoDetalleResponse.extendido, solo endpoints de LECTURA de
* la API oficial de afiliados). Secciones de #/productos/:id, cada una se oculta entera si no hay datos:
*  - GaleriaProducto: foto grande + tira de las fotos de tu vitrina ('/img/g/…'); Guardar imagen guarda la que ves;
*  - SeccionComision: la tasa que de verdad pagaron tus pedidos (la más común destacada), plan abierto y planes
*    dirigidos, y las tasas por pedido;
*  - SeccionPrecio: lista, venta en tu vitrina, con descuento de TikTok Shop y lo que pagaron tus compradores;
*  - BloqueMuestraExtendida: si puedes pedir muestra, solicitudes anteriores con su variante y las variantes (SKU);
*  - SeccionOrigen / NotaPermisoOrigen: de dónde vienen tus ventas, o la nota discreta del permiso que falta;
*  - SeccionParecidos: parecidos del marketplace por palabras del título, por mejor comisión o más vendidos.
* Solo componentes de @/componentes y @/bloques; textos en ./textos y cifras con `formato`.
*/
function Seccion(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: cx(productos_module_default.seccion, p.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": p.titulo,
			className: cx(productos_module_default.seccionInterior),
			...p.id ? { id: p.id } : {},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cx(productos_module_default.seccionCabeza, p.acciones ? productos_module_default.seccionCabezaConAcciones : null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.seccionTitulos),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: cx(productos_module_default.seccionTitulo),
						children: p.titulo
					}), p.nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(productos_module_default.seccionNota),
						children: p.nota
					}) : null]
				}), p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(productos_module_default.seccionAcciones),
					children: p.acciones
				}) : null]
			}), p.children]
		})
	});
}
/** Renglón etiqueta / cifra de las secciones de comisión y precio. */
function Renglon(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.renglon),
		...p.dato ? { "data-renglon": p.dato } : {},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
			className: cx(productos_module_default.renglonTexto),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(productos_module_default.renglonEtiqueta),
				children: p.etiqueta
			}), p.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(productos_module_default.renglonDetalle),
				children: p.detalle
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: cx(productos_module_default.renglonValor),
			children: [p.chip, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(productos_module_default.renglonCifra, p.tachada && productos_module_default.tachada),
				children: p.cifra
			})]
		})]
	});
}
var dineroDe = (r) => formato.rangoDinero(r[0], r[1]);
/** Foto grande (la del producto o la de la vitrina que elegiste) y la tira de fotos de tu vitrina. */
function GaleriaProducto(p) {
	const [elegida, setElegida] = (0, import_react.useState)(null);
	const total = p.fotos.length;
	const indice = elegida !== null && elegida < total ? elegida : null;
	const actual = indice !== null ? p.fotos[indice] ?? p.principal : p.principal;
	const alt = indice !== null ? T.fotoDe(indice + 1, total, p.nombre) : p.nombre;
	const nombreArchivo = indice !== null ? `${p.nombre} ${indice + 1}.jpg` : `${p.nombre}.jpg`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.heroeFoto),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: actual,
				alt,
				anchoCss: p.compacta ? 360 : 340,
				proporcion: p.compacta ? "4:5" : "1:1",
				radio: "xl",
				prioridad: "alta",
				tienda: p.tienda,
				categoria: p.categoria,
				arrastrable: { nombreArchivo }
			}),
			total > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.galeria),
				"data-galeria": "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(productos_module_default.galeriaCuenta),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Image",
						tamano: 14
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.galeriaCuenta(total) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(productos_module_default.tira),
					role: "list",
					"aria-label": T.galeria,
					children: p.fotos.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cx(productos_module_default.tiraElemento),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cx(productos_module_default.miniFoto),
							"aria-pressed": indice === i,
							"aria-label": T.verFoto(i + 1, total),
							onClick: () => setElegida(i),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
								url: u,
								alt: "",
								anchoCss: p.compacta ? 64 : 56,
								radio: "md",
								tienda: p.tienda,
								categoria: p.categoria,
								className: cx(productos_module_default.miniFotoImagen)
							})
						})
					}, `${p.productoId}-${i}`))
				})]
			}) : null,
			p.resumen && actual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonGuardarImagen, {
				producto: {
					...p.resumen,
					imagen: actual
				},
				className: cx(productos_module_default.guardar)
			}) : null
		]
	});
}
/** «Agotado en tu vitrina» · «Oculto en tu vitrina» (el «En tu vitrina» lo pone el héroe). null si no aplica. */
function ChipsVitrina(p) {
	const v = p.vitrina;
	if (!v || v.con_existencias !== false && !v.oculto) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [v.con_existencias === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "atencion",
		icono: "CircleAlert",
		children: T.agotadoVitrina
	}) : null, v.oculto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "neutro",
		icono: "EyeOff",
		children: T.ocultoVitrina
	}) : null] });
}
function SeccionComision(p) {
	const v = vistaComision(p.d);
	if (!v) return null;
	const real = v.real;
	const principal = v.principal;
	const varias = !!real && real.por_tasa.length > 1;
	const dif = v.diferenciaBp;
	const tasaPlan = v.abierto ? formato.tasaBp(v.abierto.bp) : "";
	const tasaReal = real ? formato.tasaBp(real.tasa_principal_bp) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.comision,
		nota: T.comisionNota,
		id: "ficha-comision",
		className: cx(productos_module_default.seccionDato),
		children: [
			real && principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.destacado),
				"data-destacado": "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.destacadoTexto),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(productos_module_default.destacadoEtiqueta),
						children: [T.enTusPedidos, varias ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							tono: "marca",
							icono: "Star",
							children: T.laMasComun
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(productos_module_default.destacadoNota),
						children: varias ? T.enTusPedidosNota(formato.porcentaje(principal.participacion), real.lineas) : T.enTusPedidosUnica(real.lineas)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(productos_module_default.cifraGrande),
					children: tasaReal
				})]
			}) : null,
			v.abierto || v.dirigidos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: cx(productos_module_default.renglones),
				children: [v.abierto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "abierto",
					etiqueta: T.planAbierto,
					detalle: v.abierto.porVentaMin !== null ? T.porVentaAprox(formato.rangoDinero(v.abierto.porVentaMin, v.abierto.porVentaMax)) : T.planAbiertoNota,
					cifra: tasaPlan
				}) : null, v.dirigidos.map((pl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "dirigido",
					etiqueta: pl.nombre ? `${T.planDirigido} · ${pl.nombre}` : T.planDirigido,
					detalle: [pl.tienda_nombre, pl.comision_monto_centavos !== null ? T.porVentaAprox(formato.dinero(pl.comision_monto_centavos)) : null].filter(Boolean).join(" · ") || void 0,
					chip: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: pl.activo ? "ok" : "neutro",
						icono: pl.activo ? "Check" : "History",
						children: pl.estado_texto
					}),
					cifra: pl.comision_bp !== null ? formato.tasaBp(pl.comision_bp) : T.sinTasa,
					tachada: !pl.activo
				}, pl.collab_id))]
			}) : null,
			v.dirigidosOcultos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(productos_module_default.notaChica),
				children: T.masPlanes(v.dirigidosOcultos)
			}) : null,
			real && dif !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(productos_module_default.diferencia),
				"data-sentido": dif > 0 ? "mas" : dif < 0 ? "menos" : "igual",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: dif > 0 ? "TrendingUp" : dif < 0 ? "Info" : "Check",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dif > 0 ? T.diferenciaMas(tasaReal, puntosDe(dif), tasaPlan) : dif < 0 ? T.diferenciaMenos(tasaReal, puntosDe(dif), tasaPlan) : T.diferenciaIgual(tasaPlan) })]
			}) : null,
			real && varias ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarrasHorizontales, {
				titulo: T.tasasTitulo,
				className: cx(productos_module_default.barras),
				filas: real.por_tasa.map((t) => ({
					id: String(t.comision_bp),
					etiqueta: formato.tasaBp(t.comision_bp),
					valor: t.lineas,
					texto: T.tasaPedidos(t.lineas),
					secundario: formato.porcentaje(t.participacion)
				})),
				tablaGemela: {
					columnas: [
						T.colTasa,
						T.colPedidos,
						T.colParte
					],
					filas: real.por_tasa.map((t) => [
						formato.tasaBp(t.comision_bp),
						formato.numero(t.lineas),
						formato.porcentaje(t.participacion)
					])
				}
			}) : null,
			real && v.conCampana > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(productos_module_default.notaChica),
				children: T.conCampana(v.conCampana, Math.max(1, real.campanas))
			}) : null
		]
	});
}
function SeccionPrecio(p) {
	const v = vistaPrecio(p.d);
	if (!v) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.precio,
		nota: v.deVitrina ? T.precioNotaVitrina : T.precioNotaFicha,
		id: "ficha-precio",
		className: cx(productos_module_default.seccionDato),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: cx(productos_module_default.renglones),
			children: [
				v.lista ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "lista",
					etiqueta: T.precioLista,
					cifra: dineroDe(v.lista),
					tachada: !!(v.venta || v.plataforma)
				}) : null,
				v.venta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "venta",
					etiqueta: v.deVitrina ? T.precioVenta : T.precioVentaAprox,
					cifra: v.deVitrina ? dineroDe(v.venta) : formato.rangoDinero(v.venta[0], v.venta[1], { aprox: true })
				}) : null,
				v.plataforma ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "plataforma",
					etiqueta: T.precioPlataforma,
					cifra: dineroDe(v.plataforma)
				}) : null,
				v.promedio !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Renglon, {
					dato: "promedio",
					etiqueta: T.precioPromedio,
					detalle: T.precioPromedioNota(v.unidades),
					cifra: formato.dineroAprox(v.promedio)
				}) : null
			]
		}), v.descuento !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: cx(productos_module_default.diferencia),
			"data-sentido": "mas",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Tag",
				tamano: 16
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.descuento(formato.porcentaje(v.descuento)) })]
		}) : null]
	});
}
function ListaSkus(p) {
	const [todas, setTodas] = (0, import_react.useState)(false);
	const visibles = todas ? p.skus : p.skus.slice(0, 6);
	const { disponibles, total } = resumenSkus(p.skus);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.subbloque),
		"data-skus": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.subcabeza),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cx(productos_module_default.subtitulo),
					children: T.skusTitulo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(productos_module_default.subnota),
					children: T.skusResumen(disponibles, total)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(productos_module_default.listaSkus),
				role: "list",
				"aria-label": T.listaSkus,
				children: visibles.map((s) => {
					const estilo = estiloSku(s);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cx(productos_module_default.sku),
						"data-disponible": s.disponible === false ? "no" : "si",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(productos_module_default.skuVariante),
								children: s.variante ?? T.unica
							}),
							s.precio_centavos !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(productos_module_default.skuPrecio),
								children: formato.dinero(s.precio_centavos)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(productos_module_default.skuEstado),
								children: estilo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
									tono: estilo.tono,
									icono: estilo.icono,
									children: s.motivo_texto ?? T.disponible
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cx(productos_module_default.skuDisponible),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
										nombre: "Check",
										tamano: 14
									}), T.disponible]
								})
							})
						]
					}, s.sku_id);
				})
			}),
			p.skus.length > 6 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "sm",
				iconoFinal: todas ? "ChevronLeft" : "ChevronDown",
				alPulsar: () => setTodas((x) => !x),
				className: cx(productos_module_default.verMas),
				children: todas ? T.verMenos : T.verTodas(p.skus.length)
			}) : null
		]
	});
}
/** Elegibilidad (samples/labels), solicitudes anteriores recuperadas y variantes. `antes` = las solicitudes que sí
*  salen en la búsqueda (TarjetaMuestra), que van entre el estado y las anteriores. */
function BloqueMuestraExtendida(p) {
	const x = extendidoDe(p.d);
	const m = x?.muestra ?? null;
	const recuperadas = x?.solicitudes_recuperadas ?? [];
	if (!m && recuperadas.length === 0) return null;
	const estilo = m ? estiloElegibilidad(m) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.bloqueMuestra),
		"data-muestra-extendida": "",
		children: [
			m && estilo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.estadoMuestra),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.chipsFicha),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: estilo.tono,
						icono: estilo.icono,
						tamano: "lg",
						children: m.estado_texto
					}), puedePedirOtra(m) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "ok",
						icono: "Plus",
						tamano: "lg",
						children: T.puedesPedirOtra
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(productos_module_default.subnota),
					children: T.revisado(formato.relativa(m.consultado_at))
				})]
			}) : null,
			p.antes,
			recuperadas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.subbloque),
				"data-recuperadas": "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.subcabeza),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: cx(productos_module_default.subtitulo),
						children: T.anteriores
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(productos_module_default.subnota),
						children: T.anterioresNota
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(productos_module_default.listaRecuperadas),
					role: "list",
					"aria-label": T.anteriores,
					children: recuperadas.map((s) => {
						const ec = estiloCumplimiento(s.cumplimiento);
						const partes = [s.tipo_texto, s.solicitada_at !== null ? T.pedidaEl(formato.fechaCorta(s.solicitada_at)) : null].filter(Boolean);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cx(productos_module_default.recuperada),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(productos_module_default.recuperadaTexto),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(productos_module_default.recuperadaVariante),
									children: s.variante ?? T.sinVariante
								}), partes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(productos_module_default.subnota),
									children: partes.join(" · ")
								}) : null]
							}), s.cumplimiento_texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: ec.tono,
								icono: ec.icono,
								children: s.cumplimiento_texto
							}) : null]
						}, s.application_id);
					})
				})]
			}) : null,
			m && m.skus.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaSkus, { skus: m.skus }) : null
		]
	});
}
function partesOrigen(cuentas) {
	let slot = 0;
	return cuentas.map((c, i) => {
		const neutro = c.tipo === null;
		if (!neutro) slot = Math.min(8, slot + 1);
		return {
			id: `${c.tipo ?? "sin"}-${i}`,
			etiqueta: c.texto,
			valor: c.lineas,
			texto: formato.numero(c.lineas),
			estilo: neutro ? "neutro" : "solido",
			...neutro ? {} : { slot }
		};
	});
}
function SeccionOrigen(p) {
	const o = extendidoDe(p.d)?.origen_ventas ?? null;
	if (estadoOrigen(p.d) !== "datos" || !o) return null;
	const tabla = (cuentas) => ({
		columnas: [
			T.colOrigen,
			T.colPedidos,
			T.colParte
		],
		filas: cuentas.map((c) => [
			c.texto,
			formato.numero(c.lineas),
			formato.porcentaje(o.lineas > 0 ? c.lineas / o.lineas : 0)
		])
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.origen,
		nota: T.origenNota(o.lineas),
		id: "ficha-origen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(productos_module_default.origenBarras),
			children: [o.por_tipo_contenido.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraApilada, {
				titulo: T.origenContenido,
				etiquetasDirectas: true,
				partes: partesOrigen(o.por_tipo_contenido),
				tablaGemela: tabla(o.por_tipo_contenido)
			}) : null, o.por_tipo_enlace.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraApilada, {
				titulo: T.origenEnlace,
				etiquetasDirectas: true,
				partes: partesOrigen(o.por_tipo_enlace),
				tablaGemela: tabla(o.por_tipo_enlace)
			}) : null]
		})
	});
}
/** Nota discreta cuando la app aún no tiene el permiso de orders/trace/search (código 105005) y el producto vende. */
function NotaPermisoOrigen(p) {
	if (estadoOrigen(p.d) !== "aviso") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(productos_module_default.notaPermiso),
		"data-nota-permiso": "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "Lock",
			tamano: 14
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.origenSinPermiso })]
	});
}
/** Columnas de la rejilla de parecidos por clase de ancho; a la vista van dos filas completas (tres en el celular). */
var COLUMNAS_PARECIDOS = {
	compacta: 2,
	media: 3,
	expandida: 4,
	amplia: 5
};
function SeccionParecidos(p) {
	const par = extendidoDe(p.d)?.parecidos ?? null;
	const toast = useToast();
	const [criterio, setCriterio] = (0, import_react.useState)("comision");
	const [todos, setTodos] = (0, import_react.useState)(false);
	const ordenados = (0, import_react.useMemo)(() => par ? ordenarParecidos(par.items, criterio) : [], [par, criterio]);
	if (!par || par.items.length === 0) return null;
	const compacta = p.ancho === "compacta";
	const columnas = COLUMNAS_PARECIDOS[p.ancho];
	const tope = columnas * (compacta ? 3 : 2);
	const visibles = todos ? ordenados : ordenados.slice(0, tope);
	const ficha = p.d.ficha;
	const propia = ficha?.comision_bp ?? null;
	const contexto = [...propia !== null ? [T.esteProductoComision(formato.tasaBp(propia))] : [], ...ficha?.unidades_vendidas_global != null ? [T.vendidosCorto(ficha.unidades_vendidas_global)] : []];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Seccion, {
		titulo: T.parecidos,
		nota: T.parecidosNota(par.palabras),
		id: "ficha-parecidos",
		acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
			etiqueta: T.ordenParecidos,
			valor: criterio,
			alCambiar: setCriterio,
			opciones: [{
				valor: "comision",
				etiqueta: T.porComision
			}, {
				valor: "vendidos",
				etiqueta: T.porVendidos
			}],
			...compacta ? { anchoCompleto: true } : {}
		}),
		children: [
			contexto.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(productos_module_default.esteProducto),
				children: T.esteProducto(contexto)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(productos_module_default.rejillaParecidos),
				role: "list",
				"aria-label": T.rejillaParecidos,
				style: { "--columnas": columnas },
				children: visibles.map((x) => {
					const nombre = nombreVisible(x.titulo_corto, x.titulo);
					const enlace = x.enlace;
					const alPulsar = x.tiene_ficha ? () => navegar(rutaProducto(x.product_id)) : enlace ? () => void abrirExterno(enlace).then((ok) => !ok && toast.mostrar({
						texto: T.abrirFallo,
						tono: "error"
					})) : void 0;
					const porVenta = x.comision_por_venta_centavos !== null ? T.porVentaAprox(formato.rangoDinero(x.comision_por_venta_centavos, x.comision_por_venta_max_centavos)) : void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cx(productos_module_default.celda),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
							imagen: x.imagen,
							nombre,
							tienda: x.tienda_nombre,
							cifraPrincipal: x.comision_bp !== null ? formato.tasaBp(x.comision_bp) : T.sinTasa,
							...porVenta ? { cifraSecundaria: porVenta } : {},
							chips: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [x.unidades_vendidas_global !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: "neutro",
								children: T.vendidosCorto(x.unidades_vendidas_global)
							}) : null, x.tiene_ficha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: "info",
								icono: "Package",
								children: T.enCorte
							}) : null] }),
							...alPulsar ? { alPulsar } : {},
							className: cx(productos_module_default.tarjeta)
						})
					}, x.product_id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.parecidosPie),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(productos_module_default.subnota),
					children: T.consultadoEl(formato.fechaCorta(par.consultado_at))
				}), ordenados.length > tope ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					iconoFinal: todos ? "ChevronLeft" : "ChevronDown",
					alPulsar: () => setTodos((v) => !v),
					children: todos ? T.verMenosParecidos : T.verTodosParecidos(ordenados.length)
				}) : null]
			})
		]
	});
}
/**
* #/productos/:id · Detalle de producto (01_ux §4.13, C18, C39). Foto grande con [Guardar imagen], título completo,
* tienda, precio ≈ y comisión (FichaPrecio), comisión por anuncios, categoría en ruta, vendidos en TikTok Shop,
* inventario, vitrina y [Abrir en TikTok Shop | la app de TikTok]; después «Tus ventas» (KPI y comisión por mes),
* «Videos que lo venden», «Muestras de este producto» y notas.
* SIN FICHA (ficha = null): se ocultan precio, comisión, categoría, vendidos e inventario y se dice por qué.
* rev. 4 (15/11) · FICHA COMPLETA con `extendido` (./FichaCompleta): galería de tu vitrina bajo la foto, tarjetas de
* Comisión (la tasa real de tus pedidos contra el plan abierto y los dirigidos) y Precio (lista, vitrina, descuento de
* TikTok Shop y lo que pagaron tus compradores), origen de las ventas (o la nota del permiso), elegibilidad de muestra
* con sus variantes y solicitudes anteriores, y parecidos del marketplace. Cada parte se oculta si no hay datos.
* rev. 5 (15/11) · Display API: en «Videos que lo venden», la portada REAL de cada video y sus vistas y pedidos por 1,000
* vistas (del video completo); sin métricas, todo queda como antes.
*/
function IdProducto(p) {
	const toast = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(productos_module_default.id),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.idProducto }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: cx(productos_module_default.mono),
				title: p.id,
				children: p.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "Copy",
				etiqueta: T.copiarId,
				tamano: "sm",
				alPulsar: () => void copiarTexto(p.id).then((ok) => ok && toast.mostrar({
					texto: T.idCopiado,
					tono: "ok"
				}))
			})
		]
	});
}
function BotonAbrir(p) {
	const toast = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		iconoFinal: "ExternalLink",
		...p.anchoCompleto ? {
			anchoCompleto: true,
			tamano: "lg"
		} : {},
		alPulsar: () => void abrirExterno(p.enlace).then((ok) => !ok && toast.mostrar({
			texto: T.abrirFallo,
			tono: "error"
		})),
		children: p.android ? T.abrirAppTikTok : T.abrirTikTokShop
	});
}
/** Lo que solo se sabe con la ficha de TikTok Shop. Sin ficha, este bloque NO se pinta (C18). */
function DatosFicha(p) {
	const d = p.d;
	const vitrina = extendidoDe(d)?.vitrina ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.ficha),
		"data-ficha": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FichaPrecio, {
				producto: p.ficha,
				className: cx(productos_module_default.fichaPrecio)
			}),
			d.comision_anuncios_bp !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(productos_module_default.dato),
				children: T.comisionAnuncios(formato.tasaBp(d.comision_anuncios_bp))
			}) : null,
			d.categoria_ruta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(productos_module_default.dato),
				"data-dato": "categoria",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Tag",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(productos_module_default.srSolo),
					children: [T.categoria, ": "]
				}), d.categoria_ruta] })]
			}) : null,
			p.ficha.unidades_vendidas_global !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(productos_module_default.dato),
				"data-dato": "vendidos",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "TrendingUp",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.vendidosGlobal(p.ficha.unidades_vendidas_global) })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.chipsFicha),
				children: [
					d.con_inventario !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: d.con_inventario ? "ok" : "atencion",
						icono: d.con_inventario ? "Check" : "CircleAlert",
						children: d.con_inventario ? T.conInventario : T.sinInventario
					}) : null,
					p.ficha.en_vitrina || vitrina ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "info",
						icono: "Store",
						children: T.enVitrina
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsVitrina, { vitrina: vitrina && d.con_inventario === false ? {
						...vitrina,
						con_existencias: null
					} : vitrina })
				]
			})
		]
	});
}
function GraficaMeses(p) {
	const mes = hoyLocal().slice(0, 7);
	const serie = serieMensualContinua(p.serie, mes);
	const etiquetas = etiquetasMes(serie);
	const mejor = mejorMes(serie);
	const unico = serie.length === 1 ? serie[0] : void 0;
	if (unico) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": T.graficaMes,
		className: cx(productos_module_default.seccionInterior),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cx(productos_module_default.seccionTitulo),
			children: T.graficaMes
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.vacioCorto),
			"data-un-solo-periodo": "",
			children: T.unSoloMes(etiquetas[0] ?? unico.etiqueta, formato.dinero(unico.comision_estimada_centavos), unico.unidades)
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
		titulo: T.graficaMes,
		alto: p.compacta ? 168 : 196,
		...mejor ? { nota: T.graficaNota(etiquetasMes([mejor])[0] ?? mejor.etiqueta, formato.dinero(mejor.comision_estimada_centavos)) } : {},
		puntos: serie.map((x, i) => ({
			clave: x.clave,
			etiqueta: etiquetas[i] ?? x.etiqueta,
			valor: x.comision_estimada_centavos,
			enCurso: x.clave === mes,
			aria: T.ariaMes(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.unidades)
		})),
		formatoEje: (v) => formato.ejeDinero(v),
		tablaGemela: {
			columnas: [
				T.colMes,
				T.colComision,
				T.colUnidades
			],
			filas: serie.map((x) => [
				x.clave === mes ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta,
				formato.dinero(x.comision_estimada_centavos),
				formato.numero(x.unidades)
			])
		}
	});
}
function Contenido(p) {
	const d = p.d;
	const vista = vistaDetalle(d);
	const fila = d.fila;
	const productos = useConsulta("productos", {});
	const nombres = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const x of productos.datos?.items ?? []) m.set(x.product_id, nombreVisible(x.titulo_corto, x.titulo));
		m.set(d.product_id, vista.nombre);
		return m;
	}, [
		productos.datos,
		d.product_id,
		vista.nombre
	]);
	const videos = [...d.videos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
	const r = fila ? Math.round(fila.pedidos * fila.tasa_reembolso) : 0;
	const enlace = d.ficha?.enlace ?? null;
	const extendido = extendidoDe(d);
	const foto = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GaleriaProducto, {
		productoId: d.product_id,
		principal: vista.imagen,
		fotos: extendido?.galeria ?? [],
		nombre: vista.nombre,
		compacta: p.compacta,
		tienda: vista.tienda,
		categoria: d.ficha?.categoria ?? null,
		resumen: vista.resumen
	}, d.product_id);
	const conComision = vistaComision(d) !== null;
	const conPrecio = vistaPrecio(d) !== null;
	const ventas = fila && fila.pedidos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BandaKpi, {
			titulo: T.tusVentas,
			className: cx(productos_module_default.kpis),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					etiqueta: T.kpiComision,
					valor: formato.dinero(fila.comision_estimada_centavos),
					nota: T.kpiVentas(formato.dinero(fila.ventas_centavos))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					etiqueta: T.kpiUnidades,
					valor: formato.numero(fila.unidades)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					etiqueta: T.kpiPedidos,
					valor: formato.numero(fila.pedidos),
					nota: T.kpiPedidosNota(fila.pedidos_validos)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					etiqueta: T.kpiReembolsos,
					valor: formato.porcentaje(fila.tasa_reembolso),
					nota: T.kpiReembolsosNota(r)
				})
			]
		}),
		d.serie.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
			padding: "amplio",
			className: cx(productos_module_default.seccion),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaMeses, {
				serie: d.serie,
				compacta: p.compacta
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.vacioCorto),
			children: T.sinSerie
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotaPermisoOrigen, { d }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionOrigen, { d })
	] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.tusVentas,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.vacioCorto),
			children: T.tusVentasVacio
		})
	});
	const conMetricas = videos.some((v) => v.vistas !== void 0);
	const seccionVideos = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.videos_,
		...videos.length > 0 ? { nota: conMetricas ? T.videosNotaMetricas : T.videosNota } : {},
		children: videos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(productos_module_default.rejillaVideos),
			children: videos.slice(0, 8).map((v) => {
				const idPortada = productoDePortada(v.miniatura);
				const nombre = (idPortada ? nombres.get(idPortada) : void 0) ?? T.nombreVideo(formato.idCorto(v.content_id));
				const dinero = formato.dinero(v.comision_estimada_centavos);
				const portada = portadaVideo(v);
				const porMil = typeof v.pedidos_por_mil_vistas === "number" ? textoPorMil(v.pedidos_por_mil_vistas) : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(productos_module_default.videoCelda),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniaturaVideo, {
						url: portada.url,
						...portada.delProducto ? { rotulo: T.fotoDelProducto } : {},
						comision: dinero,
						unidades: T.unidades(v.unidades),
						nombre,
						fechaPoster: formato.fechaCorta(v.primera_venta),
						tienda: v.tienda_principal,
						anchoCss: 132,
						etiqueta: T.etiquetaVideo(dinero, v.unidades, nombre),
						alPulsar: () => navegar(rutaVideo(v.content_id)),
						className: cx(productos_module_default.miniatura)
					}), typeof v.vistas === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cx(productos_module_default.videoMetricas),
						"data-metricas": "",
						title: T.metricasDe(formato.numero(v.vistas), porMil),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(productos_module_default.videoVistas),
							children: T.vistas(cifraCompacta(v.vistas))
						}), porMil ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(productos_module_default.videoPorMil),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cx(productos_module_default.sinCorte),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx(productos_module_default.videoPorMilCifra),
											children: porMil
										}),
										" ",
										T.porMilPedidos
									]
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(productos_module_default.sinCorte),
									children: T.porMilResto
								})
							]
						}) : null]
					}) : v.vistas === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(productos_module_default.videoMetricas, productos_module_default.videoSinCifras),
						title: T.sinCifrasTikTokAyuda,
						children: T.sinCifrasTikTok
					}) : null]
				}, v.content_id);
			})
		}), fila && videos.length < fila.videos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.listaCorta),
			children: T.listaCorta(videos.length, fila.videos)
		}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.vacioCorto),
			children: T.videosVacio
		})
	});
	const listaMuestras = d.muestras.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cx(productos_module_default.listaMuestras),
		"aria-label": T.tusSolicitudes,
		children: d.muestras.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
			muestra: muestraConNombre(m),
			variante: "lista",
			alAbrir: () => navegar(rutaMuestra(m.application_id))
		}) }, m.application_id))
	}) : null;
	const seccionMuestras = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.muestras,
		children: hayMuestraExtendida(d) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BloqueMuestraExtendida, {
			d,
			antes: listaMuestras ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.subbloque),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cx(productos_module_default.subtitulo),
					children: T.tusSolicitudes
				}), listaMuestras]
			}) : null
		}) : listaMuestras ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(productos_module_default.vacioCorto),
			children: T.muestrasVacio
		})
	});
	const notas = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(productos_module_default.notasPagina),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
			entidad: "producto",
			entidadId: d.product_id,
			titulo: T.notas,
			className: cx(productos_module_default.notasTarjeta)
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(productos_module_default.detalle),
		"data-compacta": p.compacta ? "" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.heroe),
				children: [foto, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.heroeTexto),
					children: [
						vista.tienda ? vista.tiendaKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
							a: rutaTienda(vista.tiendaKey),
							className: cx(productos_module_default.tienda),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
								nombre: vista.tienda,
								tamano: 24
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vista.tienda })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(productos_module_default.tienda),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
								nombre: vista.tienda,
								tamano: 24
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vista.tienda })]
						}) : null,
						vista.promocion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							tono: "marca",
							icono: "Sparkles",
							children: vista.promocion
						}) : null,
						vista.tituloCompleto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(productos_module_default.tituloCompleto),
							children: vista.tituloCompleto
						}) : null,
						d.ficha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatosFicha, {
							d,
							ficha: d.ficha
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cx(productos_module_default.sinFicha),
							"data-sin-ficha": "",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Info",
								tamano: 18
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.sinFicha })]
						}),
						enlace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cx(productos_module_default.acciones),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAbrir, {
								enlace,
								android: p.android,
								...p.compacta ? { anchoCompleto: true } : {}
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdProducto, { id: d.product_id })
					]
				})]
			}),
			conComision || conPrecio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.dosTarjetas),
				"data-solo": conComision && conPrecio ? void 0 : "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionComision, { d }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionPrecio, { d })]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.columnas),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.columnaAncha),
					children: [ventas, seccionVideos]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(productos_module_default.columnaLateral),
					children: [seccionMuestras, notas]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeccionParecidos, {
				d,
				ancho: p.ancho
			})
		]
	});
}
/** En el celular el título va junto a «‹ Productos»: con 20 caracteres cabe en un renglón a 360–390; el título
*  completo se lee debajo de la foto. */
var TITULO_CELULAR = 20;
/** En la ventana el título va en 30/700: con más de ~36 caracteres bajaba a dos renglones a 960–1280. Se corta en
*  palabra; el nombre completo va en el contexto (y el título completo, debajo de la tienda). */
var TITULO_VENTANA = 36;
function PantallaProducto() {
	const { params } = useRuta();
	const id = params["id"] ?? "";
	const consulta = useConsulta("producto", { id }, { activa: id !== "" });
	const ancho = useClaseAncho();
	const android = usePlataforma() === "android";
	const compacta = ancho === "compacta";
	const d = consulta.datos;
	const vista = d ? vistaDetalle(d) : null;
	const nombre = vista?.nombre ?? T.titulo;
	const titulo = !vista ? nombre : compacta ? nombreCorto(vista.tituloCompleto ?? nombre, TITULO_CELULAR) || nombre : nombreCorto(nombre, TITULO_VENTANA) || nombre;
	const tienda = vista?.tienda ?? null;
	const contexto = vista && !compacta && titulo !== nombre ? T.contextoDetalle(nombre, tienda) : tienda ?? void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: nombre,
		lista: !!d || !!consulta.error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(productos_module_default.pantalla),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo,
				volver: {
					a: "/productos",
					etiqueta: T.volver
				},
				...contexto ? { contexto } : {}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(productos_module_default.trasEncabezado, consulta.refrescando && productos_module_default.refrescando),
				children: [
					consulta.cargando || !d && !consulta.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaDetalle, {}) : null,
					consulta.error && !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
						error: consulta.error,
						titulo: T.errorDetalleTitulo,
						alReintentar: () => void consulta.refrescar()
					}) : null,
					d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contenido, {
						d,
						compacta,
						ancho,
						android
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { PantallaProducto, PantallaProductos };
