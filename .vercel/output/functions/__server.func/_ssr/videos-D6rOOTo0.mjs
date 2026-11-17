import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as EnlaceRuta, Bt as diaSemana, F as Foto, Fn as sumarDias, Gn as useClaseAncho, H as Icono, I as GraficaColumnas, J as Menu, K as Kpi, M as Esqueleto, Mt as coincide, N as EsqueletoVista, P as EstadoVacio, Q as OpcionRadio, Rt as copiarTexto, Y as MiniaturaVideo, Yt as esWindows, a as BandaKpi, at as PuntoVivo, cr as useToast, d as BotonIcono, er as useParametro, g as Chip, hn as normalizarTitulo, ht as TarjetaProducto, ir as useRuta, k as EncabezadoPantalla, m as CampoTexto, mn as nombreCorto, mt as Tarjeta, nn as formato, on as hoyLocal, or as useSync, ot as ReproductorTikTok, pn as navegar, pt as Tabla, qn as useConsulta, r as AvatarTienda, rt as Pantalla, st as Segmentado, tr as usePlataforma, u as Boton, v as ChipFiltro, vt as abrirExterno } from "./app-CLiVRbtG.mjs";
import { i as startPack, m as TarjetaMuestra, n as estadoPack, o as ListaNotas, r as pollPack, u as columnasVideos } from "./routes-ewLcTzMi.mjs";
import { r as guionPack, t as COLORES_PACK } from "./pack-meta-D3P2eMbw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/videos-D6rOOTo0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Textos de Videos y Detalle de video (01_ux §4.12, §4.16, §6.4; vocabulario de §1.5). Español de México.
* Las cifras se arman aquí con `formato` de @/dominio: la pantalla nunca escribe números a mano.
*/
var n = (x) => formato.numero(x);
var plural = (x, uno, varios) => `${n(x)} ${x === 1 ? uno : varios}`;
var T = {
	titulo: "Videos",
	contexto: (conPedidos, conVentas, ultimos7) => [
		plural(conPedidos, "video con pedidos", "videos con pedidos"),
		`${n(conVentas)} con ventas`,
		...ultimos7 !== null ? [`${n(ultimos7)} ${ultimos7 === 1 ? "vendió" : "vendieron"} en los últimos 7 días`] : []
	].join(" · "),
	notaFecha: "TikTok Shop no da la fecha de publicación; usamos la fecha de la primera venta.",
	rango: "Rango",
	rangoCon: (etiqueta) => `Rango: ${etiqueta}`,
	rangos: {
		"7d": "7 días",
		"30d": "30 días",
		"90d": "90 días",
		"12m": "12 meses",
		todo: "Todo"
	},
	ordenarCon: (etiqueta) => `Ordenar: ${etiqueta}`,
	/** Chip del celular cuando el orden no es el de siempre (al quitarlo vuelve a «Más comisión»). */
	ordenActivo: (etiqueta) => `Orden: ${etiqueta}`,
	orden: {
		comision: "Más comisión",
		pedidos: "Más pedidos",
		unidades: "Más unidades",
		reciente: "Vendió más recientemente",
		nuevos: "Más nuevos (primera venta)",
		reembolso: "Mayor % de reembolso",
		vistas: "Más vistas",
		conversion: "Más pedidos por 1,000 vistas"
	},
	filtros: "Filtros de videos",
	vendiendoAhora: "Vendiendo ahora",
	vendiendoAhoraAyuda: "Con una venta válida en los últimos 7 días",
	soloConVentas: "Solo con ventas",
	reembolsoAlto: "Reembolso alto",
	reembolsoAltoAyuda: "Más de 30 % de pedidos reembolsados",
	buscar: "Buscar por tienda o producto",
	vista: "Cómo ver los videos",
	vistaCuadricula: "Cuadrícula",
	vistaTabla: "Tabla",
	tablaEtiqueta: "Videos con pedidos",
	rejillaEtiqueta: "Videos con pedidos, de más a menos según el orden elegido",
	mostrando: (visibles, total) => `Mostrando ${n(visibles)} de ${n(total)}`,
	nombreVideo: (idCorto) => `Video ${idCorto}`,
	/** Contexto del encabezado cuando el título se acortó: el nombre completo y el ID corto del video. */
	contextoDetalle: (nombre, idCorto) => idCorto ? `${nombre} · ${idCorto}` : nombre,
	fotoDelProducto: "Foto del producto",
	unidades: (u) => plural(u, "unidad", "unidades"),
	pedidosReembolsos: (pedidos, tasa) => `${plural(pedidos, "pedido", "pedidos")} · ${tasa} reembolsos`,
	pedidos: (pedidos) => plural(pedidos, "pedido", "pedidos"),
	reembolsos: (tasa) => `${tasa} reembolsos`,
	etiquetaVideo: (lugar, dinero, unidades, producto) => `${lugar !== null ? `Video ${n(lugar)}: ` : ""}${dinero} de comisión, ${plural(unidades, "unidad", "unidades")}. Producto: ${producto}`,
	vacioTitulo: "Aún no hay videos con ventas en este periodo",
	vacioTexto: "Cuando un video tuyo venda, aparecerá aquí con su miniatura.",
	verTodo: "Ver todo el historial",
	sincronizar: "Sincronizar ahora",
	sinResultados: "Ningún video con estos filtros",
	sinResultadosTexto: "Prueba con otro filtro o borra la búsqueda.",
	quitarFiltros: "Quitar filtros",
	cargando: "Estamos trayendo tus datos de TikTok Shop…",
	lento: "Sigue cargando… revisa la conexión con tu PC",
	necesitaPc: "Necesita tu PC encendida",
	necesitaPcTexto: "Esta vista se arma en Corte de tu PC. Ábrelo y conéctate al mismo Wi‑Fi.",
	necesitaPcRango: "Sin conexión con tu PC solo está «Todo». Elige ese rango o abre Corte en tu PC.",
	errorTitulo: "No pudimos mostrar tus videos",
	errorDetalleTitulo: "No pudimos mostrar este video",
	noExiste: "No encontramos este video",
	noExisteTexto: "Puede que ya no tenga pedidos registrados.",
	verVideos: "Ver mis videos",
	reintentar: "Reintentar",
	volver: "Videos",
	abrirEnTikTok: "Abrir en TikTok",
	abrirFallo: "No se pudo abrir TikTok",
	idVideo: "ID del video",
	copiarId: "Copiar ID del video",
	idCopiado: "ID del video copiado",
	overline: (participacion) => `${participacion} de tu comisión total`,
	vendiendoDesde: (fecha) => `Vendiendo desde ${fecha.replace(/ /g, "\xA0")}`,
	ultimaVenta: (fecha) => `Última venta ${fecha.replace(/ /g, "\xA0")}`,
	kpisTitulo: "Lo que dejó este video",
	kpiComision: "Comisión",
	kpiPedidos: "Pedidos",
	kpiUnidades: "Unidades",
	kpiReembolsos: "Reembolsos",
	kpiPedidosNota: (validos) => `${plural(validos, "válido", "válidos")}`,
	kpiReembolsosNota: (reembolsados) => plural(reembolsados, "pedido", "pedidos"),
	kpiVentas: (dinero) => `≈ ${dinero} en ventas`,
	graficaSemana: "Comisión por semana",
	graficaNota: (etiqueta, dinero) => `Mejor semana: ${etiqueta} · ${dinero}`,
	ariaSemana: (etiqueta, dinero, pedidos) => `${etiqueta}: ${dinero} de comisión, ${plural(pedidos, "pedido", "pedidos")}`,
	colSemana: "Semana",
	colComision: "Comisión estimada",
	colPedidos: "Pedidos",
	enCurso: "en curso",
	/** Una sola columna no es gráfica (02 §9): con ventas solo en la semana en curso se dice la cifra. */
	unaSolaSemana: (semana, dinero, pedidos) => `Todas sus ventas son de la semana del ${semana} (en curso): ${dinero} de comisión · ${plural(pedidos, "pedido", "pedidos")}.`,
	etiquetaSemana: (fecha) => `sem ${fecha}`,
	sinSerie: "La gráfica por semana necesita tu PC encendida.",
	productos: "Productos que vendió este video",
	productosNota: "Cifras totales de cada producto, en todos tus videos.",
	productosCuenta: (x) => plural(x, "producto", "productos"),
	productoCifra: (unidades) => plural(unidades, "unidad", "unidades"),
	listaCorta: (visibles, total) => `Mostrando ${n(visibles)} de ${n(total)} · el resto con tu PC encendida`,
	sinProductos: "No hay productos registrados para este video.",
	muestras: "Muestras vinculadas",
	muestrasVacio: "Ninguna muestra está vinculada a este video.",
	muestraSinDatos: (idCorto) => `Muestra ${idCorto}`,
	verMuestra: "Ver muestra",
	notas: "Notas del video",
	notasAyuda: "Qué funcionó, qué repetirías…",
	notaMetricas: (fecha) => `Vistas de TikTok al ${fecha.replace(/ /g, "\xA0")} · pedidos y comisión de TikTok Shop.`,
	vistas: (cifra) => `${cifra} vistas`,
	likes: (cifra) => `${cifra} likes`,
	comentarios: (cifra, x) => `${cifra} ${x === 1 ? "comentario" : "comentarios"}`,
	compartidos: (cifra) => `${cifra} compartidos`,
	porMil: "pedidos por 1,000 vistas",
	porMilPedidos: "pedidos",
	porMilResto: "por 1,000 vistas",
	metricasDe: (nombre) => `Cifras de TikTok de ${nombre}`,
	sinCifras: "Sin cifras de TikTok",
	sinCifrasAyuda: "TikTok no da cifras de este video: puede ser privado, estar borrado o ser de otra cuenta.",
	sinVentasConVistas: "Sin ventas válidas",
	sinVentasConVistasAyuda: "Tiene vistas en TikTok, pero todos sus pedidos se reembolsaron o se cancelaron.",
	colVistas: "Vistas",
	colLikes: "Likes",
	colComentarios: "Comentarios",
	colCompartidos: "Compartidos",
	colPorMil: "Pedidos por 1,000 vistas",
	publicadoEl: (fecha) => `Publicado el ${fecha.replace(/ /g, "\xA0")}`,
	tiktokTitulo: "En TikTok",
	tiktokNota: (fecha, publicado) => [`Cifras que dio TikTok el ${fecha.replace(/ /g, "\xA0")}`, ...publicado ? [`publicado el ${publicado.replace(/ /g, "\xA0")}`] : []].join(" · "),
	kpiVistas: "Vistas",
	kpiLikes: "Likes",
	kpiComentarios: "Comentarios",
	kpiCompartidos: "Compartidos",
	kpiVistasResumen: (desde, hasta, total) => `Vistas acumuladas del ${desde} al ${hasta}: ${total}`,
	kpiVistasNota: (exacto) => exacto,
	kpiLikesNota: (tasa) => `${tasa} de las vistas`,
	conversionTitulo: "Conversión",
	conversionEtiqueta: "pedidos por cada 1,000 vistas",
	conversionComision: (dinero) => `≈ ${dinero} de comisión por cada 1,000 vistas`,
	conversionTipico: (cifra) => `Tu video típico: ${cifra}`,
	conversionNota: "Con los pedidos válidos de toda la vida del video.",
	conversionSinVistas: "Todavía no hay vistas para calcularla.",
	tendenciaTitulo: "Vistas nuevas por día",
	tendenciaNota: (fecha, cifra) => `Mejor día: ${fecha.replace(/ /g, "\xA0")} · ${cifra} vistas`,
	ariaDia: (fecha, nuevas, total) => `${fecha}: ${nuevas} vistas nuevas, ${total} en total`,
	colDia: "Día",
	colNuevas: "Vistas nuevas",
	colTotal: "Vistas en total",
	tendenciaPoca: "La tendencia aparece cuando Corte guarde las cifras de dos días distintos.",
	tendenciaSinPc: "Las vistas por día necesitan tu PC encendida.",
	tendenciaHuecos: "Si Corte no se abrió algún día, sus vistas se suman al día siguiente.",
	sinCifrasDetalle: "TikTok no da cifras de este video: puede ser privado, estar borrado o ser de otra cuenta. Las ventas sí se cuentan.",
	reproductorTitulo: (nombre) => `Video de TikTok: ${nombre}`,
	reproducirEn: "Se reproduce aquí con el reproductor oficial de TikTok",
	fueraDeLaApp: "Se abre fuera de Corte, en TikTok."
};
/**
* Utilidades de interacción de Videos. `useClicReciente` distingue el clic (abre) de J/K (solo mueve la selección):
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
/** Une clases (las de CSS Modules llegan como string | undefined con noUncheckedIndexedAccess). */
function cx(...clases) {
	return clases.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
var rutaVideo = (id) => `/videos/${encodeURIComponent(id)}`;
var rutaProducto = (id) => `/productos/${encodeURIComponent(id)}`;
var rutaMuestra = (id) => `/muestras/m/${encodeURIComponent(id)}`;
var rutaTienda = (key) => `/tiendas/${encodeURIComponent(key)}`;
var videos_module_default = {
	pantalla: "_pantalla_1grzb_3",
	accionesEncabezado: "_accionesEncabezado_1grzb_10",
	trasEncabezado: "_trasEncabezado_1grzb_23",
	refrescando: "_refrescando_1grzb_29",
	srSolo: "_srSolo_1grzb_33",
	estado: "_estado_1grzb_41",
	mono: "_mono_1grzb_44",
	recorte: "_recorte_1grzb_51",
	sinCorte: "_sinCorte_1grzb_57",
	notaFecha: "_notaFecha_1grzb_60",
	carga: "_carga_1grzb_66",
	cargaControles: "_cargaControles_1grzb_71",
	cargaTarjeta: "_cargaTarjeta_1grzb_78",
	cargaPoster: "_cargaPoster_1grzb_83",
	cargaHeroe: "_cargaHeroe_1grzb_87",
	cargaPosterGrande: "_cargaPosterGrande_1grzb_92",
	cargaHeroeTexto: "_cargaHeroeTexto_1grzb_97",
	cargaKpis: "_cargaKpis_1grzb_104",
	controles: "_controles_1grzb_117",
	filaControles: "_filaControles_1grzb_123",
	filaFiltros: "_filaFiltros_1grzb_124",
	segmentoRango: "_segmentoRango_1grzb_131",
	segmentoVista: "_segmentoVista_1grzb_135",
	chips: "_chips_1grzb_139",
	buscador: "_buscador_1grzb_145",
	mostrando: "_mostrando_1grzb_150",
	menuRango: "_menuRango_1grzb_161",
	ordenIcono: "_ordenIcono_1grzb_165",
	rejilla: "_rejilla_1grzb_208",
	celda: "_celda_1grzb_223",
	miniatura: "_miniatura_1grzb_229",
	pie: "_pie_1grzb_232",
	pieTienda: "_pieTienda_1grzb_240",
	pieCifras: "_pieCifras_1grzb_251",
	pieChip: "_pieChip_1grzb_257",
	punto: "_punto_1grzb_264",
	celdaVideo: "_celdaVideo_1grzb_268",
	celdaVideoFoto: "_celdaVideoFoto_1grzb_274",
	celdaVideoTextos: "_celdaVideoTextos_1grzb_278",
	celdaVideoNombre: "_celdaVideoNombre_1grzb_283",
	celdaVideoId: "_celdaVideoId_1grzb_292",
	tablaMarco: "_tablaMarco_1grzb_300",
	detalle: "_detalle_1grzb_309",
	heroe: "_heroe_1grzb_319",
	heroePortada: "_heroePortada_1grzb_341",
	heroeTexto: "_heroeTexto_1grzb_345",
	kpis: "_kpis_1grzb_353",
	heroeGrafica: "_heroeGrafica_1grzb_356",
	id: "_id_1grzb_360",
	overline: "_overline_1grzb_377",
	tienda: "_tienda_1grzb_386",
	fechas: "_fechas_1grzb_405",
	fecha: "_fecha_1grzb_405",
	soloVentanaAngosta: "_soloVentanaAngosta_1grzb_432",
	soloVentanaAncha: "_soloVentanaAncha_1grzb_437",
	marco: "_marco_1grzb_459",
	marcoPortada: "_marcoPortada_1grzb_464",
	reproductor: "_reproductor_1grzb_467",
	notasPagina: "_notasPagina_1grzb_478",
	notasTarjeta: "_notasTarjeta_1grzb_481",
	seccion: "_seccion_1grzb_487",
	seccionInterior: "_seccionInterior_1grzb_490",
	seccionCabeza: "_seccionCabeza_1grzb_496",
	seccionTitulo: "_seccionTitulo_1grzb_501",
	seccionNota: "_seccionNota_1grzb_509",
	vacioCorto: "_vacioCorto_1grzb_515",
	listaCorta: "_listaCorta_1grzb_521",
	columnas: "_columnas_1grzb_529",
	columnaAncha: "_columnaAncha_1grzb_535",
	columnaLateral: "_columnaLateral_1grzb_536",
	rejillaProductos: "_rejillaProductos_1grzb_549",
	listaMuestras: "_listaMuestras_1grzb_559",
	enlaceMuestra: "_enlaceMuestra_1grzb_567",
	pieMetricas: "_pieMetricas_1grzb_588",
	piePorMil: "_piePorMil_1grzb_595",
	piePorMilCifra: "_piePorMilCifra_1grzb_601",
	pieSinCifras: "_pieSinCifras_1grzb_606",
	celdaCifra: "_celdaCifra_1grzb_613",
	celdaCifraFuerte: "_celdaCifraFuerte_1grzb_618",
	celdaCifraVacia: "_celdaCifraVacia_1grzb_621",
	tiktok: "_tiktok_1grzb_626",
	tiktokCabeza: "_tiktokCabeza_1grzb_632",
	tiktokFila: "_tiktokFila_1grzb_637",
	conversion: "_conversion_1grzb_649",
	conversionCifra: "_conversionCifra_1grzb_655",
	conversionValor: "_conversionValor_1grzb_663",
	conversionEtiqueta: "_conversionEtiqueta_1grzb_670",
	conversionDato: "_conversionDato_1grzb_675",
	pieRenglon: "_pieRenglon_1grzb_682"
};
function CargaRejilla(p) {
	const n = p.n ?? 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: cx(videos_module_default.carga),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.srSolo),
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(videos_module_default.cargaControles),
				children: [
					220,
					96,
					132,
					112
				].map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					ancho: a,
					alto: 36
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(videos_module_default.rejilla),
				children: Array.from({ length: n }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(videos_module_default.cargaTarjeta),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "bloque",
						alto: "100%",
						className: cx(videos_module_default.cargaPoster)
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
		className: cx(videos_module_default.carga),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(videos_module_default.srSolo),
			children: T.cargando
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(videos_module_default.cargaHeroe),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				className: cx(videos_module_default.cargaPosterGrande)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(videos_module_default.cargaHeroeTexto),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "texto",
						ancho: "40%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "titulo",
						ancho: "70%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(videos_module_default.cargaKpis),
						children: [
							0,
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "bloque",
						alto: 180
					})
				]
			})]
		})]
	});
}
function ErrorVista(p) {
	if (p.error.codigo === "necesita_pc") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Monitor",
		titulo: T.necesitaPc,
		texto: p.textoNecesitaPc ?? T.necesitaPcTexto,
		...p.accionNecesitaPc ? { accion: p.accionNecesitaPc } : {},
		className: cx(videos_module_default.estado)
	});
	if (p.error.codigo === "no_encontrado") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "SquarePlay",
		titulo: T.noExiste,
		texto: T.noExisteTexto,
		accion: {
			etiqueta: T.verVideos,
			alPulsar: () => navegar("/videos")
		},
		className: cx(videos_module_default.estado)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "CircleAlert",
		titulo: p.titulo,
		texto: p.error.mensaje,
		accion: {
			etiqueta: T.reintentar,
			alPulsar: p.alReintentar
		},
		className: cx(videos_module_default.estado)
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
/** Columnas de columnasVideos() que se quedan cuando no caben todas en la tabla (video y comisión siempre). rev. 5:
*  con métricas de TikTok, vistas y «pedidos por 1,000 vistas» van justo después de la comisión. */
var REGLA_COLUMNAS = {
	prioridad: [
		"video",
		"comision",
		"vistas",
		"porMil",
		"pedidos",
		"ultima",
		"reembolsos",
		"likes",
		"unidades",
		"comentarios",
		"compartidos",
		"tienda",
		"primera",
		"productos"
	],
	fijas: ["video", "comision"],
	minimos: {
		video: 240,
		tienda: 160
	}
};
var ORDENES = [
	"comision",
	"pedidos",
	"unidades",
	"reciente",
	"nuevos",
	"reembolso",
	"vistas",
	"conversion"
];
/** rev. 5 · Órdenes que necesitan las cifras de la Display API. */
var ORDENES_METRICAS = ["vistas", "conversion"];
/** Órdenes que se ofrecen: sin métricas de TikTok no hay «Más vistas» ni «Más pedidos por 1,000 vistas». */
function ordenesPara(conMetricas) {
	return ORDENES.filter((o) => conMetricas || !ORDENES_METRICAS.includes(o));
}
/** ¿La lista trae las cifras de la Display API? (AUSENTES si nunca se conectó; null por video si no está en ella). */
function hayMetricas(items) {
	return !!items && items.some((v) => v.vistas !== void 0);
}
/** Portada a mostrar: la REAL del video ('/img/v/…') si existe; si no, la de siempre (foto del producto, rotulada). */
function portadaDe(v) {
	if (v.portada) return {
		url: v.portada,
		delProducto: false
	};
	return {
		url: v.miniatura,
		delProducto: portadaEsDelProducto(v)
	};
}
/** Tiene vistas en TikTok pero ninguna venta válida (todo se reembolsó o se canceló). */
function sinVentasConVistas(v) {
	return v.pedidos_validos === 0 && (v.vistas ?? 0) > 0;
}
/** 9,876 · 48.2 mil · 482 mil · 1.3 M (vistas, likes…). El número exacto va en el title/tabla gemela. */
function cifraCompacta(n) {
	const abs = Math.abs(n);
	const uno = (x) => (Math.round(x * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 });
	if (abs < 1e4) return formato.numero(n);
	if (abs < 1e5) return `${uno(n / 1e3)} mil`;
	if (abs < 1e6) return `${formato.numero(Math.round(n / 1e3))} mil`;
	return `${uno(n / 1e6)} M`;
}
/** Eje de una gráfica de vistas: 0 · 500 · 1 mil · 1.5 mil · 2 M. */
function ejeVistas(n) {
	const abs = Math.abs(n);
	const uno = (x) => (Math.round(x * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 });
	if (abs === 0) return "0";
	if (abs < 1e3) return formato.numero(Math.round(n));
	if (abs < 1e6) return `${uno(n / 1e3)} mil`;
	return `${uno(n / 1e6)} M`;
}
/** «Pedidos por 1,000 vistas» con 2 decimales (como lo manda el hub). */
function textoPorMil(x) {
	return x.toLocaleString("es-MX", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
/** Mediana de «pedidos por 1,000 vistas» de los videos con cifra (tu video típico); null con menos de 3. */
function porMilTipico(items) {
	const xs = items.map((v) => v.pedidos_por_mil_vistas).filter((x) => typeof x === "number").sort((a, b) => a - b);
	if (xs.length < 3) return null;
	const m = Math.floor(xs.length / 2);
	return xs.length % 2 === 1 ? xs[m] ?? null : ((xs[m - 1] ?? 0) + (xs[m] ?? 0)) / 2;
}
/** La lectura más reciente de las cifras de TikTok (para «Vistas de TikTok al …»). */
function metricasAl(items) {
	let max = null;
	for (const v of items) if (typeof v.metricas_at === "number" && (max === null || v.metricas_at > max)) max = v.metricas_at;
	return max;
}
/**
* «Vistas nuevas por día» de los últimos `dias` días a partir de la tendencia ESCALONADA del hub (un día solo aparece si
* alguna cifra cambió; un día sin foto suma lo suyo al siguiente). Empieza en la primera foto si es más reciente que la
* ventana. Con menos de 2 fotos con vistas no hay con qué comparar: [].
*/
function vistasPorDia(tendencia, hoy, dias = 30) {
	const fotos = tendencia.filter((p) => typeof p.vistas === "number" && p.fecha <= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
	const primera = fotos[0];
	if (!primera || fotos.length < 2) return [];
	const desdeVentana = sumarDias(hoy, -(dias - 1));
	const inicio = sumarDias(primera.fecha, 1) > desdeVentana ? sumarDias(primera.fecha, 1) : desdeVentana;
	const salida = [];
	let i = 0;
	let previa = primera.vistas;
	while (i + 1 < fotos.length && (fotos[i + 1]?.fecha ?? "") < inicio) {
		i += 1;
		previa = fotos[i]?.vistas ?? previa;
	}
	for (let f = inicio; f <= hoy && salida.length < dias; f = sumarDias(f, 1)) {
		const foto = fotos.find((p) => p.fecha === f);
		if (foto) {
			salida.push({
				fecha: f,
				nuevas: Math.max(0, foto.vistas - previa),
				total: foto.vistas
			});
			previa = foto.vistas;
		} else salida.push({
			fecha: f,
			nuevas: 0,
			total: previa
		});
	}
	return salida;
}
/** 12 puntos de vistas acumuladas, repartidos a lo largo de la tendencia (sparkline del KPI). */
function serieAcumulada(tendencia) {
	const vistas = tendencia.map((p) => p.vistas).filter((x) => typeof x === "number");
	if (vistas.length < 2) return [];
	if (vistas.length <= 12) return vistas;
	return Array.from({ length: 12 }, (_, k) => vistas[Math.round(k * (vistas.length - 1) / 11)] ?? 0);
}
var RANGOS = [
	"7d",
	"30d",
	"90d",
	"12m",
	"todo"
];
function esOrden(v) {
	return v !== null && ORDENES.includes(v);
}
function esRango(v) {
	return v !== null && RANGOS.includes(v);
}
/** product_id de la portada '/img/p/<id>?v=…' (también bajo /lan/v1/img/…); null si no es de producto. */
function productoDePortada(url) {
	if (!url) return null;
	return /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url)?.[1] ?? null;
}
/**
* Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
* en MAYÚSCULAS); normalizarTitulo es de la capa de vista, así que se aplica aquí. Sin corto, el nombre corto del título.
*/
function nombreVisible(corto, titulo) {
	const c = corto?.replace(/\s+/g, " ").trim();
	return c ? normalizarTitulo(c) : nombreCorto(titulo);
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
/** product_id → nombre corto, de cualquier lista de productos que ya se tenga. */
function mapaNombres(productos) {
	const mapa = /* @__PURE__ */ new Map();
	for (const x of productos ?? []) mapa.set(x.product_id, nombreVisible(x.titulo_corto, x.titulo));
	return mapa;
}
/**
* tienda_key de la tienda principal de un video para el enlace: la de sus productos (que la trae el hub, también las
* 'shop:<id>'); si no hay, el nombre normalizado, que es la regla del hub para las tiendas sin shop_id.
*/
function claveTiendaVideo(tienda, productos) {
	if (!tienda || !tienda.trim()) return null;
	const nombre = tienda.trim().toLocaleLowerCase("es-MX").replace(/\s+/g, " ");
	return productos.find((x) => x.tienda_nombre && x.tienda_nombre.trim().toLocaleLowerCase("es-MX").replace(/\s+/g, " ") === nombre)?.tienda_key ?? nombre;
}
/**
* Nombre visible de un video (C4): el nombre corto del producto de su portada (el que más vendió en ese video) o,
* si no se conoce, «Video 7677…3012». `titulo` no se usa: el hub siempre lo manda en null.
*/
function nombreVideo(v, nombres) {
	const id = productoDePortada(v.miniatura);
	const nombre = id ? nombres.get(id) : void 0;
	return nombre && nombre.trim() ? nombre : T.nombreVideo(formato.idCorto(v.content_id));
}
/** ¿La portada es la foto del producto? (C4: con imagen, siempre lo es salvo que el hub diga lo contrario). */
function portadaEsDelProducto(v) {
	return v.miniatura !== null && v.miniatura_origen !== null;
}
/** «40 videos con pedidos · 35 con ventas · 6 vendieron en los últimos 7 días» (01 §4.12, VD1 y VD5). */
function resumenVideos(items, vendiendo) {
	return {
		conPedidos: items.length,
		conVentas: items.filter((v) => v.pedidos_validos > 0).length,
		ultimos7: vendiendo ? vendiendo.size : null
	};
}
/** Videos con al menos una venta válida en la respuesta de 7 días (VD5 «Vendiendo ahora»). */
function idsVendiendo(semana) {
	if (!semana) return null;
	return new Set(semana.filter((v) => v.pedidos_validos > 0).map((v) => v.content_id));
}
function filtrarVideos(items, f, vendiendo, nombres) {
	const q = f.q.trim();
	return items.filter((v) => {
		if (f.soloConVentas && v.pedidos_validos === 0) return false;
		if (f.vendiendoAhora && !(vendiendo?.has(v.content_id) ?? false)) return false;
		if (f.reembolsoAlto && !(v.tasa_reembolso > .3)) return false;
		if (q && !coincide(q, nombreVideo(v, nombres), v.tienda_principal, v.content_id)) return false;
		return true;
	});
}
var porComision = (a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos || a.content_id.localeCompare(b.content_id);
function ordenarVideos(items, orden) {
	const copia = [...items];
	switch (orden) {
		case "comision": return copia.sort(porComision);
		case "pedidos": return copia.sort((a, b) => b.pedidos - a.pedidos || porComision(a, b));
		case "unidades": return copia.sort((a, b) => b.unidades - a.unidades || porComision(a, b));
		case "reciente": return copia.sort((a, b) => b.ultima_venta.localeCompare(a.ultima_venta) || porComision(a, b));
		case "nuevos": return copia.sort((a, b) => b.primera_venta.localeCompare(a.primera_venta) || porComision(a, b));
		case "reembolso": return copia.sort((a, b) => b.tasa_reembolso - a.tasa_reembolso || b.pedidos - a.pedidos || porComision(a, b));
		case "vistas": return copia.sort((a, b) => (b.vistas ?? -1) - (a.vistas ?? -1) || porComision(a, b));
		case "conversion": return copia.sort((a, b) => (b.pedidos_por_mil_vistas ?? -1) - (a.pedidos_por_mil_vistas ?? -1) || (b.vistas ?? -1) - (a.vistas ?? -1) || porComision(a, b));
	}
}
/** Lugar de cada video por comisión dentro del rango (la insignia «#1»), solo para los que vendieron. */
function rankingPorComision(items) {
	const mapa = /* @__PURE__ */ new Map();
	[...items].filter((v) => v.comision_estimada_centavos > 0).sort(porComision).forEach((v, i) => mapa.set(v.content_id, i + 1));
	return mapa;
}
/** Clave ('YYYY-MM-DD' del lunes) de la semana que contiene `hoy`. */
function lunesDe(hoy) {
	return sumarDias(hoy, -diaSemana(hoy));
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
/**
* Serie semanal CONTINUA para la gráfica: el hub solo manda las semanas con pedidos, y un video que vendió el 10 y el
* 24 de agosto saldría con dos columnas juntas, como si fueran semanas seguidas. Rellena con ceros las semanas sin
* pedidos desde la primera hasta la semana en curso (así también se ve cuándo dejó de vender). Si alguna clave no es
* el lunes 'YYYY-MM-DD' de su semana, no la toca. Tope de 10 años.
*/
function serieSemanalContinua(serie, lunesActual) {
	const esLunes = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && diaSemana(k) === 0;
	if (serie.length === 0 || !esLunes(lunesActual) || serie.some((p) => !esLunes(p.clave))) return [...serie];
	const porClave = new Map(serie.map((p) => [p.clave, p]));
	const claves = [...porClave.keys()].sort();
	const primera = claves[0] ?? lunesActual;
	const ultima = claves[claves.length - 1] ?? lunesActual;
	const fin = ultima > lunesActual ? ultima : lunesActual;
	const salida = [];
	for (let k = primera; k <= fin && salida.length < 530; k = sumarDias(k, 7)) salida.push(porClave.get(k) ?? puntoVacio(k, T.etiquetaSemana(formato.fechaCorta(k))));
	return salida;
}
/** Punto con más comisión (nota de la gráfica); null sin ventas. */
function mejorPunto(serie) {
	let mejor = null;
	for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
	return mejor;
}
/** 'sem 24 ago' → '24 ago' para el eje (la gráfica ya dice «por semana»). */
function etiquetaEje(etiqueta) {
	return etiqueta.replace(/^sem\s+/i, "");
}
/** Reembolsados de un video: pedidos − válidos no es exacto (FROZEN/UNSPECIFIED); se usa la tasa del hub. */
function reembolsados(v) {
	return Math.round(v.pedidos * v.tasa_reembolso);
}
/**
* #/videos · Galería de videos (01_ux §4.12, C4). Encabezado con «40 videos con pedidos · 35 con ventas · 6 vendieron
* en los últimos 7 días» y la nota de la fecha. Controles en una fila arriba de lo que filtran (02 §7.11): rango (por
* omisión «Todo», se recuerda aparte de Ventas), orden, filtros y vista. La galería es de MiniaturaVideo: portada = foto
* del producto con el rótulo «Foto del producto» (o póster tipográfico si no hay foto). En Windows también hay tabla.
* rev. 5 (Display API): con las métricas de TikTok, la portada es la REAL del video ('/img/v') cuando existe; tarjetas y
* tabla llevan vistas, likes, comentarios, compartidos y «pedidos por 1,000 vistas», y se puede ordenar por vistas y por
* conversión. Un video sin cifras de TikTok (privado o borrado) lo dice; uno con vistas y sin ventas válidas se marca.
* La lista sale de tus ventas: los videos que nunca vendieron no llegan en el contrato (ver notas/pendientes).
*/
var CLAVE_RANGO = "corte.videos.rango";
var CLAVE_VISTA = "corte.videos.vista";
/** Rango pedido: «Todo» va sin fechas (lo arma también la copia del celular); los demás con las fechas del hub. */
function useRangoVideos(rango) {
	const tablero = useConsulta("dashboard", { periodo: rango === "todo" ? "30d" : rango }, { activa: rango !== "todo" });
	if (rango === "todo") return {
		params: {},
		tablero
	};
	const p = tablero.datos?.periodo;
	return {
		params: p ? {
			desde: p.desde,
			hasta: p.hasta
		} : null,
		tablero
	};
}
/** Celda «Video» de la tabla: portada 9:16 (la real de TikTok o la foto del producto) + nombre corto del producto + «Video 7677…3012». */
function CeldaVideo(p) {
	const v = p.video;
	const idCorto = T.nombreVideo(formato.idCorto(v.content_id));
	const portada = portadaDe(v);
	const detalle = [portada.delProducto ? T.fotoDelProducto : null, p.nombre !== idCorto ? idCorto : null].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(videos_module_default.celdaVideo),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: portada.url,
			alt: "",
			anchoCss: 28,
			proporcion: "9:16",
			radio: "xs",
			tienda: v.tienda_principal,
			className: cx(videos_module_default.celdaVideoFoto)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(videos_module_default.celdaVideoTextos),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.celdaVideoNombre),
				title: p.nombre,
				children: p.nombre
			}), detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.celdaVideoId),
				children: detalle
			}) : null]
		})]
	});
}
/** Cifra de la tabla alineada a la derecha y tabular; la exacta en el title. «—» sin cifra de TikTok. */
function CeldaCifra(p) {
	if (p.valor === null || p.valor === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(videos_module_default.celdaCifraVacia),
		title: T.sinCifrasAyuda,
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(videos_module_default.celdaCifra, p.fuerte && videos_module_default.celdaCifraFuerte),
		title: formato.numero(p.valor),
		children: p.texto ?? cifraCompacta(p.valor)
	});
}
/** rev. 5 · Columnas de TikTok para la tabla (solo si la lista trae las cifras de la Display API). */
function columnasMetricas() {
	return [
		{
			id: "vistas",
			titulo: T.colVistas,
			ancho: 96,
			alineacion: "derecha",
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaCifra, {
				valor: v.vistas,
				fuerte: true
			})
		},
		{
			id: "porMil",
			titulo: T.colPorMil,
			ancho: 168,
			alineacion: "derecha",
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaCifra, {
				valor: v.pedidos_por_mil_vistas,
				...typeof v.pedidos_por_mil_vistas === "number" ? { texto: textoPorMil(v.pedidos_por_mil_vistas) } : {}
			})
		},
		{
			id: "likes",
			titulo: T.colLikes,
			ancho: 96,
			alineacion: "derecha",
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaCifra, { valor: v.likes })
		},
		{
			id: "comentarios",
			titulo: T.colComentarios,
			ancho: 120,
			alineacion: "derecha",
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaCifra, { valor: v.comentarios })
		},
		{
			id: "compartidos",
			titulo: T.colCompartidos,
			ancho: 120,
			alineacion: "derecha",
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaCifra, { valor: v.compartidos })
		}
	];
}
/** Pie de la tarjeta con las cifras de TikTok: «48.2 mil vistas · 2.1 mil likes · …» y «7.10 pedidos por 1,000 vistas». */
function MetricasTarjeta(p) {
	const v = p.video;
	if (v.vistas === void 0) return null;
	if (v.vistas === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(videos_module_default.pieSinCifras),
		title: T.sinCifrasAyuda,
		children: T.sinCifras
	});
	const renglones = [[T.vistas(cifraCompacta(v.vistas)), ...typeof v.likes === "number" ? [T.likes(cifraCompacta(v.likes))] : []], [...typeof v.comentarios === "number" ? [T.comentarios(cifraCompacta(v.comentarios), v.comentarios)] : [], ...typeof v.compartidos === "number" ? [T.compartidos(cifraCompacta(v.compartidos))] : []]].filter((r) => r.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [typeof v.pedidos_por_mil_vistas === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(videos_module_default.piePorMil),
		"data-por-mil": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(videos_module_default.sinCorte),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(videos_module_default.piePorMilCifra),
						children: textoPorMil(v.pedidos_por_mil_vistas)
					}),
					" ",
					T.porMilPedidos
				]
			}),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.sinCorte),
				children: T.porMilResto
			})
		]
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(videos_module_default.pieMetricas),
		"data-metricas": "",
		children: renglones.map((r, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(videos_module_default.pieRenglon),
			children: [r.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i > 0 ? " · " : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.sinCorte),
				children: x
			})] }, x)), j < renglones.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(videos_module_default.srSolo),
				children: " · "
			}) : null]
		}, j))
	})] });
}
function TarjetaGaleria(p) {
	const v = p.video;
	const dinero = formato.dinero(v.comision_estimada_centavos);
	const portada = portadaDe(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cx(videos_module_default.celda),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniaturaVideo, {
			url: portada.url,
			...portada.delProducto ? { rotulo: T.fotoDelProducto } : {},
			...p.lugar !== null && p.lugar <= 10 ? { ranking: p.lugar } : {},
			comision: dinero,
			unidades: T.unidades(v.unidades),
			nombre: p.nombre,
			fechaPoster: formato.fechaCorta(v.primera_venta),
			tienda: v.tienda_principal,
			anchoCss: 220,
			etiqueta: T.etiquetaVideo(p.lugar, dinero, v.unidades, p.nombre),
			alPulsar: () => navegar(rutaVideo(v.content_id)),
			className: cx(videos_module_default.miniatura)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(videos_module_default.pie),
			children: [
				v.tienda_principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(videos_module_default.pieTienda),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
						nombre: v.tienda_principal,
						tamano: 20
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(videos_module_default.recorte),
						children: v.tienda_principal
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(videos_module_default.pieCifras),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(videos_module_default.sinCorte),
							children: T.pedidos(v.pedidos)
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(videos_module_default.sinCorte),
							children: T.reembolsos(formato.porcentaje(v.tasa_reembolso))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricasTarjeta, { video: v }),
				sinVentasConVistas(v) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: "neutro",
					icono: "Eye",
					className: cx(videos_module_default.pieChip),
					titulo: T.sinVentasConVistasAyuda,
					children: T.sinVentasConVistas
				}) : null,
				p.vendiendo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
					tono: "ok",
					className: cx(videos_module_default.pieChip),
					titulo: T.vendiendoAhoraAyuda,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, {
						estado: "ok",
						className: cx(videos_module_default.punto)
					}), T.vendiendoAhora]
				}) : null
			]
		})]
	});
}
function PantallaVideos() {
	const [rango, setRangoEstado] = (0, import_react.useState)(() => {
		const r = leerLocal(CLAVE_RANGO);
		return esRango(r) ? r : "todo";
	});
	const [vista, setVistaEstado] = (0, import_react.useState)(() => leerLocal(CLAVE_VISTA) === "tabla" ? "tabla" : "cuadricula");
	const [ordenParam, setOrden] = useParametro("orden");
	const [filtros, setFiltros] = (0, import_react.useState)({
		soloConVentas: true,
		vendiendoAhora: false,
		reembolsoAlto: false,
		q: ""
	});
	const ancho = useClaseAncho();
	const angosta = usePlataforma() === "android" || ancho === "compacta";
	const conTabla = !angosta;
	const clic = useClicReciente();
	const sync = useSync();
	const { params, tablero } = useRangoVideos(rango);
	const videos = useConsulta("videos", params ?? {}, { activa: params !== null });
	const p7 = useConsulta("dashboard", { periodo: "7d" }).datos?.periodo;
	const semana = useConsulta("videos", p7 ? {
		desde: p7.desde,
		hasta: p7.hasta
	} : {}, { activa: !!p7 });
	const productos = useConsulta("productos", {});
	const errorRango = rango !== "todo" ? tablero.error : null;
	const items = params !== null && !errorRango ? videos.datos?.items : void 0;
	const conMetricas = hayMetricas(items);
	const ordenPedido = esOrden(ordenParam) ? ordenParam : "comision";
	const orden = !conMetricas && ORDENES_METRICAS.includes(ordenPedido) ? "comision" : ordenPedido;
	const nombres = (0, import_react.useMemo)(() => mapaNombres(productos.datos?.items), [productos.datos]);
	const vendiendo = (0, import_react.useMemo)(() => p7 && semana.datos ? idsVendiendo(semana.datos.items) : null, [p7, semana.datos]);
	const resumen = (0, import_react.useMemo)(() => resumenVideos(items ?? [], vendiendo), [items, vendiendo]);
	const ranking = (0, import_react.useMemo)(() => rankingPorComision(items ?? []), [items]);
	const visibles = (0, import_react.useMemo)(() => ordenarVideos(filtrarVideos(items ?? [], filtros, vendiendo, nombres), orden), [
		items,
		filtros,
		vendiendo,
		nombres,
		orden
	]);
	const reembolsoAltos = (0, import_react.useMemo)(() => filtrarVideos(items ?? [], {
		...filtros,
		reembolsoAlto: true,
		q: ""
	}, vendiendo, nombres).length, [
		items,
		filtros,
		vendiendo,
		nombres
	]);
	const ajuste = useColumnasQueCaben((0, import_react.useMemo)(() => {
		const base = columnasVideos().map((c) => c.id === "video" ? {
			...c,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaVideo, {
				video: v,
				nombre: nombreVideo(v, nombres)
			})
		} : c);
		if (!conMetricas) return base;
		const extra = columnasMetricas();
		const salida = [];
		for (const c of base) {
			salida.push(c);
			if (c.id === "comision") salida.push(...extra.filter((x) => x.id === "vistas" || x.id === "porMil"));
			if (c.id === "reembolsos") salida.push(...extra.filter((x) => x.id !== "vistas" && x.id !== "porMil"));
		}
		return salida;
	}, [nombres, conMetricas]), REGLA_COLUMNAS);
	const setRango = (r) => {
		setRangoEstado(r);
		guardarLocal(CLAVE_RANGO, r);
	};
	const setVista = (v) => {
		setVistaEstado(v);
		guardarLocal(CLAVE_VISTA, v);
	};
	const cambiar = (c) => setFiltros((f) => ({
		...f,
		...c
	}));
	const hayFiltros = filtros.vendiendoAhora || filtros.reembolsoAlto || filtros.q.trim() !== "" || !filtros.soloConVentas;
	const error = errorRango ?? videos.error;
	const cargando = !error && (params === null || videos.cargando || !items && !videos.error);
	let cuerpo;
	if (cargando) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaRejilla, {});
	else if (error && !items) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
		error,
		titulo: T.errorTitulo,
		alReintentar: () => void (errorRango ? tablero.refrescar() : videos.refrescar()),
		...rango !== "todo" ? {
			textoNecesitaPc: T.necesitaPcRango,
			accionNecesitaPc: {
				etiqueta: T.verTodo,
				alPulsar: () => setRango("todo")
			}
		} : {}
	});
	else if (!items || items.length === 0 || resumen.conVentas === 0 && filtros.soloConVentas && !hayFiltros) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "SquarePlay",
		titulo: T.vacioTitulo,
		texto: T.vacioTexto,
		...rango !== "todo" ? { accion: {
			etiqueta: T.verTodo,
			alPulsar: () => setRango("todo")
		} } : sync.puede ? { accion: {
			etiqueta: T.sincronizar,
			alPulsar: () => void sync.sincronizar()
		} } : {},
		className: cx(videos_module_default.estado)
	});
	else if (visibles.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Search",
		titulo: T.sinResultados,
		texto: T.sinResultadosTexto,
		accion: {
			etiqueta: T.quitarFiltros,
			alPulsar: () => setFiltros({
				soloConVentas: true,
				vendiendoAhora: false,
				reembolsoAlto: false,
				q: ""
			})
		},
		className: cx(videos_module_default.estado)
	});
	else if (conTabla && vista === "tabla") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(videos_module_default.tablaMarco),
		ref: ajuste.ref,
		onPointerDownCapture: clic.alPuntero,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
			etiqueta: T.tablaEtiqueta,
			filas: visibles,
			columnas: ajuste.columnas,
			idFila: (v) => v.content_id,
			alAbrir: (v) => navegar(rutaVideo(v.content_id)),
			alSeleccionar: (v) => {
				if (clic.fueClic()) navegar(rutaVideo(v.content_id));
			},
			claveScroll: `videos-${rango}-${orden}`
		})
	});
	else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cx(videos_module_default.rejilla),
		"aria-label": T.rejillaEtiqueta,
		children: visibles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaGaleria, {
			video: v,
			nombre: nombreVideo(v, nombres),
			lugar: ranking.get(v.content_id) ?? null,
			vendiendo: vendiendo?.has(v.content_id) ?? false
		}, v.content_id))
	});
	const metricasAt = conMetricas && items ? metricasAl(items) : null;
	const contexto = items && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.contexto(resumen.conPedidos, resumen.conVentas, resumen.ultimos7) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(videos_module_default.notaFecha),
		children: metricasAt !== null ? T.notaMetricas(formato.fechaCorta(metricasAt)) : T.notaFecha
	})] }) : void 0;
	const sinNada = rango === "todo" && !!items && items.length === 0;
	const vistaControl = conTabla ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
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
		className: cx(videos_module_default.segmentoVista)
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.titulo,
		lista: !!items || !!error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(videos_module_default.pantalla),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
					titulo: T.titulo,
					...contexto ? { contexto } : {},
					acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(videos_module_default.accionesEncabezado),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							icono: "Clapperboard",
							alPulsar: () => navegar("/videos/generar"),
							children: "Generar video"
						}), vistaControl && !sinNada ? vistaControl : null]
					})
				}),
				sinNada ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(videos_module_default.controles, videos_module_default.trasEncabezado),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(videos_module_default.filaControles),
							"data-angosta": angosta ? "" : void 0,
							children: [angosta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								etiqueta: T.rangoCon(T.rangos[rango]),
								icono: "CalendarDays",
								disparador: "boton",
								opciones: RANGOS.map((r) => ({
									id: r,
									etiqueta: T.rangos[r],
									...r === rango ? { icono: "Check" } : {},
									alPulsar: () => setRango(r)
								})),
								className: cx(videos_module_default.menuRango)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
								etiqueta: T.rango,
								valor: rango,
								alCambiar: setRango,
								opciones: RANGOS.map((r) => ({
									valor: r,
									etiqueta: T.rangos[r]
								})),
								className: cx(videos_module_default.segmentoRango)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								etiqueta: T.ordenarCon(T.orden[orden]),
								icono: "ArrowDownUp",
								disparador: angosta ? "icono" : "boton",
								opciones: ordenesPara(conMetricas).map((o) => ({
									id: o,
									etiqueta: T.orden[o],
									...o === orden ? { icono: "Check" } : {},
									alPulsar: () => setOrden(o === "comision" ? null : o, { reemplazar: true })
								})),
								className: cx(angosta ? videos_module_default.ordenIcono : videos_module_default.menuControl)
							})]
						}),
						items && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(videos_module_default.filaFiltros),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(videos_module_default.chips),
								role: "group",
								"aria-label": T.filtros,
								children: [
									angosta && orden !== "comision" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
										activo: true,
										alCambiar: () => setOrden(null, { reemplazar: true }),
										children: T.ordenActivo(T.orden[orden])
									}) : null,
									vendiendo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
										activo: filtros.vendiendoAhora,
										conteo: vendiendo.size,
										alCambiar: (a) => cambiar({ vendiendoAhora: a }),
										children: T.vendiendoAhora
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
										activo: filtros.soloConVentas,
										conteo: resumen.conVentas,
										alCambiar: (a) => cambiar({ soloConVentas: a }),
										children: T.soloConVentas
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
										activo: filtros.reembolsoAlto,
										conteo: reembolsoAltos,
										alCambiar: (a) => cambiar({ reembolsoAlto: a }),
										children: T.reembolsoAlto
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
								etiqueta: T.buscar,
								etiquetaOculta: true,
								tipo: "search",
								placeholder: T.buscar,
								valor: filtros.q,
								alCambiar: (q) => cambiar({ q }),
								className: cx(videos_module_default.buscador)
							})]
						}) : null,
						items && hayFiltros && visibles.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(videos_module_default.mostrando),
							"aria-live": "polite",
							children: T.mostrando(visibles.length, items.length)
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(videos_module_default.trasEncabezado, videos.refrescando && videos_module_default.refrescando),
					children: cuerpo
				})
			]
		})
	});
}
function useAbrirVideo(enlace) {
	const toast = useToast();
	return () => {
		abrirExterno(enlace).then((ok) => {
			if (!ok) toast.mostrar({
				texto: T.abrirFallo,
				tono: "error"
			});
		});
	};
}
/** [Abrir en TikTok] (fuera de la app). */
function BotonAbrirVideo(p) {
	const abrir = useAbrirVideo(p.enlace);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: p.variante,
		tamano: p.tamano ?? "md",
		iconoFinal: "ExternalLink",
		alPulsar: abrir,
		...p.anchoCompleto ? { anchoCompleto: true } : {},
		...p.className ? { className: p.className } : {},
		children: T.abrirEnTikTok
	});
}
/** `lugar`: su lugar por comisión en todo tu historial (el mismo «#4» de la galería; solo del 1 al 10). */
function PortadaVideo(p) {
	const v = p.video;
	const abrir = useAbrirVideo(v.enlace);
	const windows = esWindows();
	const dinero = formato.dinero(v.comision_estimada_centavos);
	const portada = portadaDe(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${videos_module_default.marco} ${p.className ?? ""}`,
		...windows ? { "data-reproductor": "" } : {},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniaturaVideo, {
			url: portada.url,
			...portada.delProducto ? { rotulo: T.fotoDelProducto } : {},
			...p.lugar && p.lugar <= 10 ? { ranking: p.lugar } : {},
			comision: dinero,
			unidades: T.unidades(v.unidades),
			nombre: p.nombre,
			fechaPoster: formato.fechaCorta(v.primera_venta),
			tienda: v.tienda_principal,
			anchoCss: p.anchoCss,
			etiqueta: T.etiquetaVideo(p.lugar ?? null, dinero, v.unidades, p.nombre),
			className: cx(videos_module_default.marcoPortada)
		}), windows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReproductorTikTok, {
			contentId: v.content_id,
			titulo: T.reproductorTitulo(p.nombre),
			alAbrirFuera: abrir,
			className: cx(videos_module_default.reproductor)
		}) : null]
	});
}
function Conversion(p) {
	const v = p.video;
	const x = v.pedidos_por_mil_vistas;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": T.conversionTitulo,
		className: cx(videos_module_default.conversion),
		"data-conversion": "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cx(videos_module_default.seccionTitulo),
			children: T.conversionTitulo
		}), typeof x === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(videos_module_default.conversionCifra),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(videos_module_default.conversionValor),
					children: textoPorMil(x)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(videos_module_default.conversionEtiqueta),
					children: T.conversionEtiqueta
				})]
			}),
			typeof v.comision_por_mil_vistas_centavos === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(videos_module_default.conversionDato),
				children: T.conversionComision(formato.dinero(v.comision_por_mil_vistas_centavos))
			}) : null,
			p.tipico !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(videos_module_default.conversionDato),
				children: T.conversionTipico(textoPorMil(p.tipico))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(videos_module_default.seccionNota),
				children: T.conversionNota
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(videos_module_default.vacioCorto),
			children: T.conversionSinVistas
		})]
	});
}
function VistasPorDia(p) {
	const hoy = hoyLocal();
	const dias = vistasPorDia(p.tendencia ?? [], hoy, p.compacta ? 14 : 30);
	if (dias.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": T.tendenciaTitulo,
		className: cx(videos_module_default.seccionInterior),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cx(videos_module_default.seccionTitulo),
			children: T.tendenciaTitulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(videos_module_default.vacioCorto),
			"data-tendencia-vacia": "",
			children: p.tendencia === void 0 ? T.tendenciaSinPc : T.tendenciaPoca
		})]
	});
	let mejor = null;
	for (const d of dias) if (d.nuevas > 0 && (!mejor || d.nuevas > mejor.nuevas)) mejor = d;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
		titulo: T.tendenciaTitulo,
		alto: p.compacta ? 160 : 188,
		...mejor ? { nota: T.tendenciaNota(formato.fechaCorta(mejor.fecha), formato.numero(mejor.nuevas)) } : {},
		puntos: dias.map((d) => ({
			clave: d.fecha,
			etiqueta: formato.fechaCorta(d.fecha),
			valor: d.nuevas,
			aria: T.ariaDia(d.fecha === hoy ? `${formato.fechaCorta(d.fecha)} (${T.enCurso})` : formato.fechaCorta(d.fecha), formato.numero(d.nuevas), formato.numero(d.total))
		})),
		formatoEje: ejeVistas,
		tablaGemela: {
			columnas: [
				T.colDia,
				T.colNuevas,
				T.colTotal
			],
			filas: dias.map((d) => [
				d.fecha === hoy ? `${formato.fechaCorta(d.fecha)} (${T.enCurso})` : formato.fechaCorta(d.fecha),
				formato.numero(d.nuevas),
				formato.numero(d.total)
			])
		}
	});
}
function EnTikTok(p) {
	const v = p.detalle.video;
	if (v.vistas === void 0) return null;
	if (v.vistas === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: cx(videos_module_default.seccion),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": T.tiktokTitulo,
			className: cx(videos_module_default.seccionInterior),
			"data-sin-cifras": "",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cx(videos_module_default.seccionTitulo),
				children: T.tiktokTitulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(videos_module_default.vacioCorto),
				children: T.sinCifrasDetalle
			})]
		})
	});
	const tendencia = p.detalle.tendencia ?? [];
	const serie = serieAcumulada(tendencia);
	const primera = tendencia[0]?.fecha;
	const ultima = tendencia[tendencia.length - 1]?.fecha;
	const vistas = v.vistas;
	const nota = typeof v.metricas_at === "number" ? T.tiktokNota(formato.fechaCorta(v.metricas_at), typeof v.publicado_at === "number" ? formato.fechaCorta(v.publicado_at) : null) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(videos_module_default.tiktok),
		"data-en-tiktok": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BandaKpi, {
				titulo: T.tiktokTitulo,
				className: cx(videos_module_default.kpis),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						etiqueta: T.kpiVistas,
						valor: formato.numero(vistas),
						...serie.length >= 2 && primera && ultima ? {
							serie,
							resumenSerie: T.kpiVistasResumen(formato.fechaCorta(primera), formato.fechaCorta(ultima), formato.numero(vistas))
						} : {}
					}),
					typeof v.likes === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						etiqueta: T.kpiLikes,
						valor: formato.numero(v.likes),
						...vistas > 0 ? { nota: T.kpiLikesNota(formato.porcentaje(v.likes / vistas, 1)) } : {}
					}) : null,
					typeof v.comentarios === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						etiqueta: T.kpiComentarios,
						valor: formato.numero(v.comentarios)
					}) : null,
					typeof v.compartidos === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						etiqueta: T.kpiCompartidos,
						valor: formato.numero(v.compartidos)
					}) : null
				]
			}),
			nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(videos_module_default.seccionNota),
				children: nota
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(videos_module_default.tiktokFila),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
					padding: "amplio",
					className: cx(videos_module_default.seccion),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Conversion, {
						video: v,
						tipico: p.tipico
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
					padding: "amplio",
					className: cx(videos_module_default.seccion),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistasPorDia, {
						tendencia: p.detalle.tendencia,
						compacta: p.compacta
					})
				})]
			})
		]
	});
}
/**
* #/videos/:id · Detalle de video a página completa (01_ux §4.12, C4, C43). Portada grande (foto del producto, rotulada)
* con el ReproductorTikTok SOLO en Windows; en Android, [Abrir en TikTok] fuera de la app. KPI (comisión, pedidos,
* unidades, reembolsos), «Vendiendo desde» y «Última venta», comisión por semana, productos que vendió (con foto),
* muestras vinculadas, notas del video e ID con [Copiar]. Nombre = nombre corto del producto o «Video 7677…3012».
* Sin la PC (Android) se arma con la copia (sin serie, lista de productos que puede venir corta: se rotula).
* rev. 5 (Display API): portada REAL cuando existe, «Publicado el …» y la banda «En TikTok» (MetricasVideo.tsx) con
* vistas, likes, comentarios, compartidos, conversión y vistas nuevas por día. Sin métricas, nada de eso aparece.
*/
function Seccion(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: `${videos_module_default.seccion} ${p.className ?? ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": p.titulo,
			className: cx(videos_module_default.seccionInterior),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cx(videos_module_default.seccionCabeza),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cx(videos_module_default.seccionTitulo),
					children: p.titulo
				}), p.nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(videos_module_default.seccionNota),
					children: p.nota
				}) : null]
			}), p.children]
		})
	});
}
function IdVideo(p) {
	const toast = useToast();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(videos_module_default.id),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.idVideo }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: cx(videos_module_default.mono),
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
function GraficaSemanas(p) {
	const enCurso = lunesDe(hoyLocal());
	const serie = serieSemanalContinua(p.serie, enCurso);
	const mejor = mejorPunto(serie);
	const unico = serie.length === 1 ? serie[0] : void 0;
	if (unico) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": T.graficaSemana,
		className: cx(videos_module_default.seccionInterior),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: cx(videos_module_default.seccionTitulo),
			children: T.graficaSemana
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(videos_module_default.vacioCorto),
			"data-un-solo-periodo": "",
			children: T.unaSolaSemana(etiquetaEje(unico.etiqueta), formato.dinero(unico.comision_estimada_centavos), unico.pedidos)
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
		titulo: T.graficaSemana,
		alto: p.compacta ? 168 : 196,
		...mejor ? { nota: T.graficaNota(etiquetaEje(mejor.etiqueta), formato.dinero(mejor.comision_estimada_centavos)) } : {},
		puntos: serie.map((x) => ({
			clave: x.clave,
			etiqueta: etiquetaEje(x.etiqueta),
			valor: x.comision_estimada_centavos,
			enCurso: x.clave === enCurso,
			aria: T.ariaSemana(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.pedidos)
		})),
		formatoEje: (v) => formato.ejeDinero(v),
		tablaGemela: {
			columnas: [
				T.colSemana,
				T.colComision,
				T.colPedidos
			],
			filas: serie.map((x) => [
				x.clave === enCurso ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta,
				formato.dinero(x.comision_estimada_centavos),
				formato.numero(x.pedidos)
			])
		}
	});
}
function Contenido(p) {
	const v = p.detalle.video;
	const productos = [...p.detalle.productos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
	const vinculadas = v.muestras_vinculadas;
	const muestras = useConsulta("muestras", {}, { activa: vinculadas.length > 0 });
	const porId = (0, import_react.useMemo)(() => new Map((muestras.datos?.items ?? []).map((m) => [m.application_id, m])), [muestras.datos]);
	const r = reembolsados(v);
	const kpis = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BandaKpi, {
		titulo: T.kpisTitulo,
		className: cx(videos_module_default.kpis),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiComision,
				valor: formato.dinero(v.comision_estimada_centavos),
				nota: T.kpiVentas(formato.dinero(v.ventas_centavos))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiPedidos,
				valor: formato.numero(v.pedidos),
				nota: T.kpiPedidosNota(v.pedidos_validos)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiUnidades,
				valor: formato.numero(v.unidades)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiReembolsos,
				valor: formato.porcentaje(v.tasa_reembolso),
				nota: T.kpiReembolsosNota(r)
			})
		]
	});
	const fechas = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(videos_module_default.fechas),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(videos_module_default.fecha),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CalendarDays",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.vendiendoDesde(formato.fechaCorta(v.primera_venta)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(videos_module_default.fecha),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "History",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.ultimaVenta(formato.fechaCorta(v.ultima_venta)) })]
			}),
			typeof v.publicado_at === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(videos_module_default.fecha),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Clapperboard",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.publicadoEl(formato.fechaCorta(v.publicado_at)) })]
			}) : null,
			p.vendiendo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
				tono: "ok",
				titulo: T.vendiendoAhoraAyuda,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, {
					estado: "ok",
					className: cx(videos_module_default.punto)
				}), T.vendiendoAhora]
			}) : null
		]
	});
	const claveTienda = claveTiendaVideo(v.tienda_principal, p.detalle.productos);
	const tienda = v.tienda_principal && claveTienda ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
		a: rutaTienda(claveTienda),
		className: cx(videos_module_default.tienda),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
			nombre: v.tienda_principal,
			tamano: 24
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: v.tienda_principal })]
	}) : null;
	const grafica = p.detalle.serie.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: cx(videos_module_default.seccion, !p.compacta && videos_module_default.heroeGrafica),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaSemanas, {
			serie: p.detalle.serie,
			compacta: p.compacta
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.graficaSemana,
		...p.compacta ? {} : { className: videos_module_default.heroeGrafica },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(videos_module_default.vacioCorto),
			children: T.sinSerie
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(videos_module_default.detalle),
		"data-compacta": p.compacta ? "" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(videos_module_default.heroe),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortadaVideo, {
						video: v,
						nombre: p.nombre,
						lugar: p.lugar,
						anchoCss: p.compacta ? 150 : 300,
						className: cx(videos_module_default.heroePortada)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(videos_module_default.heroeTexto),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(videos_module_default.overline),
								children: T.overline(formato.porcentaje(v.participacion, v.participacion < .1 ? 1 : 0))
							}),
							tienda,
							fechas,
							p.android && !p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAbrirVideo, {
								enlace: v.enlace,
								variante: "primario",
								tamano: "lg",
								anchoCompleto: true
							}) : null,
							!p.android && !p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAbrirVideo, {
								enlace: v.enlace,
								variante: "secundario",
								className: cx(videos_module_default.soloVentanaAngosta)
							}) : null
						]
					}),
					!p.compacta ? kpis : null,
					!p.compacta ? grafica : null,
					!p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdVideo, { id: v.content_id }) : null
				]
			}),
			p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAbrirVideo, {
				enlace: v.enlace,
				variante: "primario",
				tamano: "lg",
				anchoCompleto: true
			}) : null,
			p.compacta ? kpis : null,
			p.compacta ? grafica : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnTikTok, {
				detalle: p.detalle,
				tipico: p.tipico,
				compacta: p.compacta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(videos_module_default.columnas),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
					titulo: T.productos,
					nota: T.productosNota,
					className: cx(videos_module_default.columnaAncha),
					children: productos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cx(videos_module_default.rejillaProductos),
						children: productos.map((x, i) => {
							const nombre = nombreVisible(x.titulo_corto, x.titulo);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
								imagen: x.imagen,
								nombre,
								tienda: x.tienda_nombre,
								cifraPrincipal: formato.dinero(x.comision_estimada_centavos),
								cifraSecundaria: T.productoCifra(x.unidades),
								...i === 0 ? { ranking: 1 } : {},
								alPulsar: () => navegar(rutaProducto(x.product_id))
							}, x.product_id);
						})
					}), productos.length < v.productos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(videos_module_default.listaCorta),
						children: T.listaCorta(productos.length, v.productos)
					}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(videos_module_default.vacioCorto),
						children: T.sinProductos
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(videos_module_default.columnaLateral),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
							titulo: T.muestras,
							children: vinculadas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cx(videos_module_default.vacioCorto),
								children: T.muestrasVacio
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: cx(videos_module_default.listaMuestras),
								children: vinculadas.map((id) => {
									const m = porId.get(id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: m ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
										muestra: muestraConNombre(m),
										variante: "lista",
										conAccion: false,
										alAbrir: () => navegar(rutaMuestra(id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
										a: rutaMuestra(id),
										className: cx(videos_module_default.enlaceMuestra),
										children: [T.muestraSinDatos(formato.idCorto(id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
											nombre: "ChevronRight",
											tamano: 16
										})]
									}) }, id);
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cx(videos_module_default.notasPagina),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
								entidad: "video",
								entidadId: v.content_id,
								titulo: T.notas,
								className: cx(videos_module_default.notasTarjeta)
							})
						}),
						p.compacta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdVideo, { id: v.content_id }) : null
					]
				})]
			})
		]
	});
}
/** En el celular el título va junto a «‹ Videos»: con 20 caracteres cabe en un renglón a 360–390 («Chaqueta con
*  cuello…»); el nombre completo sigue en la portada y en el lector de pantalla (título de la página). */
var TITULO_CELULAR = 20;
/** En la ventana el título va en 30/700 junto a [Abrir en TikTok]: con más de ~32 caracteres bajaba a dos renglones a
*  960–1280. Se corta en palabra y el nombre completo pasa al contexto. */
var TITULO_VENTANA = 32;
function PantallaVideo() {
	const { params } = useRuta();
	const id = params["id"] ?? "";
	const consulta = useConsulta("video", { id }, { activa: id !== "" });
	const productos = useConsulta("productos", {});
	const p7 = useConsulta("dashboard", { periodo: "7d" }).datos?.periodo;
	const semana = useConsulta("videos", p7 ? {
		desde: p7.desde,
		hasta: p7.hasta
	} : {}, { activa: !!p7 });
	const historial = useConsulta("videos", {});
	const ancho = useClaseAncho();
	const android = usePlataforma() === "android";
	const compacta = ancho === "compacta";
	const d = consulta.datos;
	const lugar = (0, import_react.useMemo)(() => d && historial.datos ? rankingPorComision(historial.datos.items).get(d.video.content_id) ?? null : null, [d, historial.datos]);
	const tipico = (0, import_react.useMemo)(() => historial.datos ? porMilTipico(historial.datos.items) : null, [historial.datos]);
	const nombres = (0, import_react.useMemo)(() => {
		const m = mapaNombres(productos.datos?.items);
		for (const [k, valor] of mapaNombres(d?.productos)) m.set(k, valor);
		return m;
	}, [productos.datos, d]);
	const nombre = d ? nombreVideo(d.video, nombres) : T.titulo;
	const vendiendo = d && p7 && semana.datos ? idsVendiendo(semana.datos.items)?.has(d.video.content_id) ?? false : false;
	const idCorto = d ? T.nombreVideo(formato.idCorto(d.video.content_id)) : null;
	const titulo = (compacta ? nombreCorto(nombre, TITULO_CELULAR) : nombreCorto(nombre, TITULO_VENTANA)) || nombre;
	const contexto = !d ? void 0 : nombre === idCorto ? d.video.tienda_principal ?? void 0 : !compacta && titulo !== nombre ? T.contextoDetalle(nombre, idCorto ?? "") : idCorto ?? void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: nombre,
		lista: !!d || !!consulta.error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(videos_module_default.pantalla),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo,
				volver: {
					a: "/videos",
					etiqueta: T.volver
				},
				...contexto ? { contexto } : {},
				...d && !android && !compacta ? { acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAbrirVideo, {
					enlace: d.video.enlace,
					variante: "secundario",
					className: cx(videos_module_default.soloVentanaAncha)
				}) } : {}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(videos_module_default.trasEncabezado, consulta.refrescando && videos_module_default.refrescando),
				children: [
					consulta.cargando || !d && !consulta.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaDetalle, {}) : null,
					consulta.error && !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
						error: consulta.error,
						titulo: T.errorDetalleTitulo,
						alReintentar: () => void consulta.refrescar()
					}) : null,
					d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contenido, {
						detalle: d,
						nombre,
						lugar,
						vendiendo,
						compacta,
						android,
						tipico
					}) : null
				]
			})]
		})
	});
}
var generar_module_default = {
	pagina: "_pagina_8fwyk_1",
	cuerpo: "_cuerpo_8fwyk_8",
	form: "_form_8fwyk_14",
	preview: "_preview_8fwyk_20",
	medio: "_medio_8fwyk_27",
	aviso: "_aviso_8fwyk_33",
	nota: "_nota_8fwyk_39",
	refs: "_refs_8fwyk_45",
	ref: "_ref_8fwyk_45",
	guion: "_guion_8fwyk_67",
	ficha: "_ficha_8fwyk_75",
	notaPie: "_notaPie_8fwyk_81"
};
/**
* #/videos/generar · el mismo avatar, el mismo espejo, la sudadera de cuello Perkins.
* Una foto 9:16 y un video de 10s, solo cuando tú lo pides.
*/
var REFS = [
	{
		src: "/ugc/avatar/01_retrato_frontal.jpg",
		etiqueta: "Cara"
	},
	{
		src: "/ugc/avatar/02_cuerpo_completo_frente.jpg",
		etiqueta: "Cuerpo"
	},
	{
		src: "/ugc/avatar/03_cuerpo_completo_espaldas.jpg",
		etiqueta: "Espalda"
	},
	{
		src: "/ugc/habitacion/01_habitacion.jpg",
		etiqueta: "Espejo"
	}
];
function PantallaGenerar() {
	const [color, setColor] = (0, import_react.useState)("signal-black");
	const [fase, setFase] = (0, import_react.useState)("idle");
	const [aviso, setAviso] = (0, import_react.useState)(null);
	const [still, setStill] = (0, import_react.useState)(null);
	const [videoUrl, setVideoUrl] = (0, import_react.useState)(null);
	const [colorListo, setColorListo] = (0, import_react.useState)(null);
	const [requestId, setRequestId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let vivo = true;
		estadoPack({ data: {} }).then((res) => {
			if (!vivo || !res) return;
			if (res.still) setStill(res.still);
			if (res.video) {
				setVideoUrl(res.video);
				setFase("listo");
			}
			if (res.color) setColorListo(res.color);
		}).catch(() => void 0);
		return () => {
			vivo = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!requestId || fase !== "video") return void 0;
		let vivo = true;
		let timer = 0;
		let intentos = 0;
		const revisar = async () => {
			intentos += 1;
			const res = await pollPack({ data: { requestId } });
			if (!vivo) return;
			if (!res.ok) {
				setFase("idle");
				setAviso(res.error);
				return;
			}
			if (res.status === "done") {
				setVideoUrl(res.videoUrl);
				setColorListo(color);
				setFase("listo");
				return;
			}
			if (intentos >= 36) {
				setFase("idle");
				setAviso("El video tardó demasiado. La foto sí quedó.");
				return;
			}
			timer = window.setTimeout(() => void revisar(), 5e3);
		};
		timer = window.setTimeout(() => void revisar(), 4e3);
		return () => {
			vivo = false;
			window.clearTimeout(timer);
		};
	}, [
		requestId,
		fase,
		color
	]);
	const ocupado = fase === "foto" || fase === "video";
	const prenda = COLORES_PACK.find((c) => c.id === color) ?? COLORES_PACK[0];
	const nombreListo = COLORES_PACK.find((c) => c.id === colorListo)?.etiqueta;
	const generar = async () => {
		setAviso(null);
		setVideoUrl(null);
		setStill(null);
		setRequestId(null);
		setFase("foto");
		const res = await startPack({ data: { color } });
		if (!res.ok) {
			setFase("idle");
			if (res.still) setStill(res.still);
			setAviso(res.error);
			return;
		}
		setStill(res.still);
		setRequestId(res.requestId);
		setFase("video");
	};
	let etiqueta = "Generar corte de 10s";
	if (fase === "foto") etiqueta = "Armando la foto…";
	if (fase === "video") etiqueta = "Armando el video…";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: "Generar video",
		lista: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: generar_module_default.pagina,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo: "Generar video",
				contexto: "El mismo hombre, el mismo espejo, la sudadera de cuello Perkins.",
				volver: {
					a: "/videos",
					etiqueta: "Videos"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: generar_module_default.cuerpo,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: generar_module_default.form,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: generar_module_default.refs,
							children: [REFS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
								className: generar_module_default.ref,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: r.src,
									alt: r.etiqueta
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: r.etiqueta })]
							}, r.etiqueta)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
								className: generar_module_default.ref,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/${prenda.archivo}`,
									alt: prenda.etiqueta
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: "Prenda" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
							etiqueta: "Color",
							opciones: COLORES_PACK.map((c) => ({
								valor: c.id,
								etiqueta: c.etiqueta,
								descripcion: c.muestra ? "La muestra pedida es XL" : "Mismo corte"
							})),
							valor: color,
							alCambiar: setColor
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: generar_module_default.guion,
							children: guionPack(color)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: generar_module_default.ficha,
							children: "Cuello Perkins, media cremallera, jalador metálico, paneles más oscuros en hombros y manga. Tallas S a XXL, sin centímetros. Vitrina con descuento: 226 a 227 MXN. Tela según el vendedor: 95% poliéster y 5% elastano, afelpada; no es prueba de laboratorio. Tres reseñas de cinco estrellas: afelpada, viene gruesa y en su talla, la tela muy buena."
						}),
						aviso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: generar_module_default.aviso,
							role: "alert",
							children: aviso
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							icono: "Clapperboard",
							tipo: "button",
							anchoCompleto: true,
							cargando: ocupado,
							deshabilitado: ocupado,
							alPulsar: () => void generar(),
							children: etiqueta
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: generar_module_default.nota,
							children: "El video no habla: el guion es para que lo grabes tú. Cada clic gasta tu cupo. No abre TikTok, no quita marcas de agua y no deja el archivo en 1080."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: generar_module_default.preview,
					"aria-live": "polite",
					children: [videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						className: generar_module_default.medio,
						src: videoUrl,
						poster: still ?? void 0,
						controls: true,
						playsInline: true
					}) : still ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						className: generar_module_default.medio,
						src: still,
						alt: `Sudadera ${prenda.etiqueta} en el espejo`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
						icono: "Clapperboard",
						titulo: ocupado ? "Se está armando" : "Todavía no hay video",
						texto: ocupado ? "Primero la foto 9:16 en ese espejo y después el video de 10 segundos." : "Genera el corte con este avatar y esta habitación."
					}), videoUrl && nombreListo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: generar_module_default.notaPie,
						children: [
							"Corte en ",
							nombreListo,
							"."
						]
					}) : null]
				})]
			})]
		})
	});
}
//#endregion
export { PantallaGenerar, PantallaVideo, PantallaVideos };
