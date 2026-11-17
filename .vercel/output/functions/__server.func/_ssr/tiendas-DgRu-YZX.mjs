import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $n as usePanelDisponible, F as Foto, Gn as useClaseAncho, H as Icono, I as GraficaColumnas, J as Menu, Jt as esPendiente, K as Kpi, M as Esqueleto, Mt as coincide, N as EsqueletoVista, P as EstadoVacio, Rt as copiarTexto, St as ahoraS, Vn as useAcciones, Y as MiniaturaVideo, a as BandaKpi, cr as useToast, d as BotonIcono, er as useParametro, g as Chip, hn as normalizarTitulo, ht as TarjetaProducto, ir as useRuta, k as EncabezadoPantalla, m as CampoTexto, mn as nombreCorto, mt as Tarjeta, nn as formato, nt as PanelLateral, on as hoyLocal, or as useSync, pn as navegar, pt as Tabla, qn as useConsulta, r as AvatarTienda, rt as Pantalla, st as Segmentado, tr as usePlataforma, u as Boton, v as ChipFiltro } from "./app-CLiVRbtG.mjs";
import { d as TarjetaTienda, k as useControlMuestra, l as columnasTiendas, m as TarjetaMuestra, o as ListaNotas, p as columnasMuestras, y as ChipSalud } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tiendas-DgRu-YZX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Textos de Tiendas y Detalle de tienda (01_ux §4.9, §4.10, §4.16; vocabulario de §1.5). Español de México.
* Las cifras se arman aquí con `formato` de @/dominio para que la pantalla nunca escriba números a mano.
*/
var n = (x) => formato.numero(x);
var plural = (x, uno, varios) => `${n(x)} ${x === 1 ? uno : varios}`;
var T = {
	titulo: "Tiendas",
	tituloDetalle: "Tienda",
	contexto: (relacion, conPendientes, socios) => `${plural(relacion, "tienda con la que tienes relación", "tiendas con las que tienes relación")} · ${n(conPendientes)} con pendientes · ${plural(socios, "socio", "socios")}`,
	avisarTiendas: "Avisar a mis tiendas",
	buscar: "Buscar tienda",
	vistas: "Vista de tiendas",
	ordenar: "Ordenar",
	ordenarCon: (etiqueta) => `Ordenar: ${etiqueta}`,
	/** Celular: el orden va como ícono; si no es el de siempre, se dice en la línea de abajo. */
	ordenActivo: (etiqueta) => `Orden: ${etiqueta}`,
	orden: {
		atencion: "Atención primero",
		comision: "Comisión generada",
		deuda: "Muestras pendientes",
		nombre: "Nombre A–Z"
	},
	modo: "Cómo ver las tiendas",
	modoTabla: "Tabla",
	modoFichas: "Fichas",
	tablaEtiqueta: "Tiendas",
	mostrando: (visibles, total) => `Mostrando ${n(visibles)} de ${n(total)}`,
	vacioTitulo: "Aún no hay tiendas",
	vacioTexto: "Aparecerán cuando sincronices tus muestras y ventas.",
	vacioAccion: "Sincronizar ahora",
	sinResultados: "Ninguna tienda en esta vista.",
	sinResultadosTexto: "Prueba con otra vista o borra la búsqueda.",
	verTodas: "Ver todas",
	cargando: "Estamos trayendo tus datos de TikTok Shop…",
	lento: "Sigue cargando… revisa la conexión con tu PC",
	necesitaPc: "Necesita tu PC encendida",
	necesitaPcTexto: "Esta vista se arma en Corte de tu PC. Ábrelo y conéctate al mismo Wi‑Fi.",
	errorTitulo: "No pudimos mostrar tus tiendas",
	errorDetalleTitulo: "No pudimos mostrar esta tienda",
	reintentar: "Reintentar",
	noExiste: "No encontramos esta tienda",
	noExisteTexto: "Puede que ya no tenga muestras ni ventas contigo.",
	verTiendas: "Ver mis tiendas",
	volverTiendas: "Tiendas",
	panelTitulo: "Tienda",
	verFicha: "Ver ficha completa",
	idTienda: "ID de tienda",
	copiarId: "Copiar ID de tienda",
	idCopiado: "ID de tienda copiado",
	avisarTienda: "Avisar a esta tienda",
	planearPendientes: "Planear sus pendientes",
	masAcciones: "Más acciones",
	agregarNota: "Agregar nota",
	kpiTitulo: "Tu relación con esta tienda",
	porAvisar: "Por avisar",
	promesasVencidas: (x) => plural(x, "promesa vencida", "promesas vencidas"),
	promesasVigentes: (x) => plural(x, "fecha prometida", "fechas prometidas"),
	ultimaVenta: (fecha) => `Última venta: ${fecha}`,
	mensajeSugerido: (plantilla) => `Mensaje sugerido: «${plantilla}»`,
	kpiComision: "Comisión · total",
	kpiComision90: (dinero) => `${dinero} en 90 días`,
	kpiParte: "% de tu comisión",
	kpiParteNota: "en los últimos 90 días",
	kpiPedidos: "Pedidos · total",
	kpiPedidosValidos: "Pedidos válidos",
	kpiPedidosNota: (tasa, reembolsados) => `${tasa} reembolsados · ${plural(reembolsados, "pedido", "pedidos")}`,
	kpiPedidosNotaSinSerie: "sin contar reembolsos",
	kpiValor: "Valor recibido",
	kpiValorNota: (recibidas) => recibidas > 0 ? `de ${plural(recibidas, "muestra recibida", "muestras recibidas")}` : "sin muestras recibidas",
	/** T4 de 01 §6.2 (en los hechos del héroe). */
	muestrasResumen: (recibidas, pendientes, entregadas) => "Muestras: " + [
		plural(recibidas, "recibida", "recibidas"),
		plural(pendientes, "pendiente", "pendientes"),
		plural(entregadas, "entregada", "entregadas")
	].map((s) => s.replace(" ", "\xA0")).join(" · "),
	sinDato: "—",
	leDebes: (x) => `Lo que le debes (${n(x)})`,
	planearLas: (x) => x === 1 ? "Planear la muestra" : `Planear las ${n(x)}`,
	leDebesVacio: "No le debes videos a esta tienda.",
	tablaPendientes: "Muestras pendientes de esta tienda",
	prometiste: "Lo que le prometiste",
	prometisteVacio: "Todavía no le has enviado avisos a esta tienda.",
	avisoEnviado: (fecha) => `Aviso enviado el ${fecha}`,
	quitarAviso: "Quitar este aviso",
	avisoQuitado: "Aviso quitado",
	deshacer: "Deshacer",
	prepararNuevaFecha: "Preparar mensaje \"Nueva fecha\"",
	promesa: (fecha) => `Le prometiste el ${fecha}`,
	promesaVigente: "Vigente",
	promesaVencida: "Vencida",
	promesaCumplida: (fecha) => `Cumplida el ${fecha}`,
	muestraDesconocida: "Muestra",
	cumpliste: "Lo que ya cumpliste",
	cumplisteVacio: "Todavía no hay videos cumplidos para esta tienda.",
	ventas: "Ventas con esta tienda",
	graficaMes: "Comisión por mes",
	graficaNota: (etiqueta, dinero) => `Mejor mes: ${etiqueta} · ${dinero}`,
	/** En el celular la gráfica muestra solo los últimos meses (la tabla gemela, todos). */
	graficaUltimos: (meses, mejor) => `Últimos ${n(meses)} meses${mejor ? ` · ${mejor.charAt(0).toLocaleLowerCase("es-MX")}${mejor.slice(1)}` : ""}`,
	ariaMes: (etiqueta, dinero, pedidos) => `${etiqueta}: ${dinero} de comisión, ${plural(pedidos, "pedido", "pedidos")}`,
	colMes: "Mes",
	colComision: "Comisión estimada",
	colPedidos: "Pedidos",
	enCurso: "en curso",
	/** Una sola columna no es gráfica (02 §9): con ventas solo en el mes en curso se dice la cifra. */
	unSoloMes: (mes, dinero, pedidos) => `Todas sus ventas son de ${mes} (en curso): ${dinero} de comisión · ${plural(pedidos, "pedido", "pedidos")}.`,
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
	productosTop: "Productos que más te vende",
	productoCifra: (unidades) => plural(unidades, "unidad", "unidades"),
	videosTop: "Videos que más venden sus productos",
	videoNombre: (id) => `Video ${id}`,
	videoUnidades: (u) => plural(u, "unidad", "unidades"),
	videoEtiqueta: (lugar, dinero, unidades, producto) => `Video ${n(lugar)}: ${dinero} de comisión, ${plural(unidades, "unidad", "unidades")}. Producto: ${producto}`,
	fotoDelProducto: "Foto del producto",
	sinVentas: "Esta tienda todavía no te ha generado ventas.",
	historial: "Historial de solicitudes",
	historialVacio: "No hay solicitudes a esta tienda.",
	tablaHistorial: "Solicitudes a esta tienda",
	verMas: (x) => `Ver ${plural(x, "solicitud más", "solicitudes más")}`,
	notas: "Notas sobre la tienda",
	notasPlaceholder: "Cómo prefieren los videos, con quién hablas, acuerdos…",
	tiendaNombre: (nombre) => nombre
};
/** Etiqueta corta de cada vista (chips de 01 §4.9). */
var ETIQUETA_VISTA = {
	con_relacion: "Con relación",
	atencion: "Necesitan atención",
	por_avisar: "Por avisar",
	promesas_vencidas: "Promesas vencidas",
	con_plan: "Con plan",
	socios: "Socios",
	al_dia: "Al día",
	vende_contigo: "Vende contigo",
	solo_solicitudes: "Solo solicitudes",
	solo_reembolsos: "Solo reembolsos"
};
/**
* Utilidades de interacción de Tiendas. `useClicReciente` distingue el clic (abre) de J/K (solo mueve la selección):
* la Tabla llama alSeleccionar en ambos casos y la pantalla solo abre cuando hubo un puntero hace un momento.
*/
/** Qué lados de una fila desplazable quedan fuera de vista (para desvanecer solo esos). Sin medida (happy-dom): null. */
function ladoDesbordado(scrollLeft, clientWidth, scrollWidth) {
	if (!(clientWidth > 0) || scrollWidth - clientWidth <= 1) return null;
	const izquierda = scrollLeft > 1;
	const derecha = scrollLeft + clientWidth < scrollWidth - 1;
	return izquierda && derecha ? "ambos" : izquierda ? "izquierda" : derecha ? "derecha" : null;
}
/** Mide la fila (ResizeObserver + scroll) y devuelve `ref` y el lado desbordado para `data-desborde`. `clave` cambia
*  cuando cambian los hijos (p. ej. los conteos de los chips) para volver a medir. */
function useDesborde(clave) {
	const [el, setEl] = (0, import_react.useState)(null);
	const [desborde, setDesborde] = (0, import_react.useState)(null);
	const ref = (0, import_react.useCallback)((nodo) => setEl(nodo), []);
	(0, import_react.useLayoutEffect)(() => {
		if (!el) return void 0;
		const medir = () => setDesborde(ladoDesbordado(el.scrollLeft, el.clientWidth, el.scrollWidth));
		medir();
		el.addEventListener("scroll", medir, { passive: true });
		const o = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medir);
		o?.observe(el);
		for (const hijo of Array.from(el.children)) o?.observe(hijo);
		return () => {
			el.removeEventListener("scroll", medir);
			o?.disconnect();
		};
	}, [el, clave]);
	return {
		ref,
		desborde
	};
}
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
var tiendas_module_default = {
	pantalla: "_pantalla_1yl9y_3",
	trasEncabezado: "_trasEncabezado_1yl9y_16",
	refrescando: "_refrescando_1yl9y_22",
	srSolo: "_srSolo_1yl9y_26",
	estado: "_estado_1yl9y_34",
	mono: "_mono_1yl9y_37",
	carga: "_carga_1yl9y_45",
	cargaChips: "_cargaChips_1yl9y_50",
	cargaTarjetas: "_cargaTarjetas_1yl9y_55",
	cargaHeroe: "_cargaHeroe_1yl9y_59",
	cargaHeroeTexto: "_cargaHeroeTexto_1yl9y_64",
	cargaKpis: "_cargaKpis_1yl9y_72",
	controles: "_controles_1yl9y_79",
	chips: "_chips_1yl9y_86",
	herramientas: "_herramientas_1yl9y_92",
	buscador: "_buscador_1yl9y_99",
	segmentoModo: "_segmentoModo_1yl9y_103",
	mostrando: "_mostrando_1yl9y_107",
	ordenIcono: "_ordenIcono_1yl9y_134",
	celdaTienda: "_celdaTienda_1yl9y_174",
	celdaTiendaFoto: "_celdaTiendaFoto_1yl9y_180",
	celdaTiendaNombre: "_celdaTiendaNombre_1yl9y_184",
	tablaMarco: "_tablaMarco_1yl9y_194",
	listaTarjetas: "_listaTarjetas_1yl9y_201",
	rejillaFichas: "_rejillaFichas_1yl9y_210",
	panelPie: "_panelPie_1yl9y_232",
	detalle: "_detalle_1yl9y_245",
	heroeTarjeta: "_heroeTarjeta_1yl9y_256",
	heroe: "_heroe_1yl9y_256",
	heroeTexto: "_heroeTexto_1yl9y_266",
	heroePorque: "_heroePorque_1yl9y_271",
	heroeFotos: "_heroeFotos_1yl9y_280",
	heroeIdentidad: "_heroeIdentidad_1yl9y_304",
	heroeFotosChicas: "_heroeFotosChicas_1yl9y_310",
	heroeFila: "_heroeFila_1yl9y_316",
	heroeFoto: "_heroeFoto_1yl9y_280",
	heroeId: "_heroeId_1yl9y_304",
	kpis: "_kpis_1yl9y_385",
	hechos: "_hechos_1yl9y_392",
	hechosChips: "_hechosChips_1yl9y_398",
	hecho: "_hecho_1yl9y_392",
	seccionTarjeta: "_seccionTarjeta_1yl9y_419",
	seccion: "_seccion_1yl9y_419",
	seccionCabeza: "_seccionCabeza_1yl9y_432",
	seccionTitulo: "_seccionTitulo_1yl9y_440",
	seccionAcciones: "_seccionAcciones_1yl9y_448",
	vacioCorto: "_vacioCorto_1yl9y_453",
	listaMuestras: "_listaMuestras_1yl9y_459",
	avisos: "_avisos_1yl9y_477",
	aviso: "_aviso_1yl9y_477",
	avisoCabeza: "_avisoCabeza_1yl9y_493",
	avisoFecha: "_avisoFecha_1yl9y_500",
	avisoTexto: "_avisoTexto_1yl9y_506",
	promesas: "_promesas_1yl9y_516",
	promesa: "_promesa_1yl9y_516",
	promesaProducto: "_promesaProducto_1yl9y_532",
	promesaFecha: "_promesaFecha_1yl9y_541",
	ventas: "_ventas_1yl9y_546",
	grafica: "_grafica_1yl9y_552",
	subseccion: "_subseccion_1yl9y_555",
	subtitulo: "_subtitulo_1yl9y_561",
	rejillaProductos: "_rejillaProductos_1yl9y_570",
	rejillaVideos: "_rejillaVideos_1yl9y_578",
	miniatura: "_miniatura_1yl9y_583",
	columnas: "_columnas_1yl9y_594",
	columnaPrincipal: "_columnaPrincipal_1yl9y_600",
	columnaLateral: "_columnaLateral_1yl9y_601",
	barraFija: "_barraFija_1yl9y_634",
	notasPagina: "_notasPagina_1yl9y_647",
	notasTarjeta: "_notasTarjeta_1yl9y_650",
	notasPanel: "_notasPanel_1yl9y_656"
};
function CargaLista(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: cx(tiendas_module_default.carga),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(tiendas_module_default.srSolo),
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.cargaChips),
				children: [
					96,
					132,
					92,
					72,
					80
				].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					ancho: a,
					alto: 32
				}, a))
			}),
			p.tarjetas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.cargaTarjetas),
				children: [
					0,
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 96
				}, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "fila",
				lineas: 10
			})
		]
	});
}
function CargaDetalle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: cx(tiendas_module_default.carga),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(tiendas_module_default.srSolo),
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.cargaHeroe),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "foto",
					ancho: 180,
					alto: 225
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(tiendas_module_default.cargaHeroeTexto),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "titulo",
							ancho: "60%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "texto",
							lineas: 2,
							ancho: "80%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
							forma: "bloque",
							ancho: 220,
							alto: 36
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.cargaKpis),
				children: [
					0,
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "fila",
				lineas: 4
			})
		]
	});
}
function ErrorVista(p) {
	if (p.error.codigo === "necesita_pc") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Monitor",
		titulo: T.necesitaPc,
		texto: T.necesitaPcTexto,
		className: cx(tiendas_module_default.estado)
	});
	if (p.error.codigo === "no_encontrado") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Store",
		titulo: T.noExiste,
		texto: T.noExisteTexto,
		accion: {
			etiqueta: T.verTiendas,
			alPulsar: () => navegar("/tiendas")
		},
		className: cx(tiendas_module_default.estado)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "CircleAlert",
		titulo: p.titulo,
		texto: p.error.mensaje,
		accion: {
			etiqueta: T.reintentar,
			alPulsar: p.alReintentar
		},
		className: cx(tiendas_module_default.estado)
	});
}
function CeldaTienda(p) {
	const t = p.tienda;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(tiendas_module_default.celdaTienda),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: t.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: t.nombre,
			className: cx(tiendas_module_default.celdaTiendaFoto)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(tiendas_module_default.celdaTiendaNombre),
			title: t.nombre,
			children: t.nombre
		})]
	});
}
/** Qué columnas de columnasTiendas() se quedan cuando no caben todas (01 §4.9: tienda, salud y pendientes siempre). */
var REGLA_COLUMNAS = {
	prioridad: [
		"tienda",
		"salud",
		"pendientes",
		"comision",
		"aviso",
		"participacion",
		"productos",
		"ultima",
		"valor",
		"recibidas",
		"entregadas"
	],
	fijas: [
		"tienda",
		"salud",
		"pendientes"
	],
	minimos: { tienda: 200 }
};
/** columnasMuestras('tienda') cuando no caben todas: producto, estado en TikTok, tu avance y promesa primero (el botón
*  de la acción ya está en «Planear las {n}» y la fila abre la muestra). */
var REGLA_MUESTRAS = {
	prioridad: [
		"producto",
		"tiktok",
		"avance",
		"promesa",
		"solicitada",
		"accion",
		"precio"
	],
	fijas: ["producto"],
	minimos: { producto: 220 }
};
/** Anchos para que el encabezado se lea completo (02 §7.5): «% de tu comisión (90 días)» lleva su periodo (01 §1.5). */
var ANCHOS_ENCABEZADO = {
	participacion: 188,
	productos: 96
};
function conAnchosDeEncabezado(columnas) {
	return columnas.map((c) => {
		const ancho = ANCHOS_ENCABEZADO[c.id];
		return ancho !== void 0 ? {
			...c,
			ancho
		} : c;
	});
}
/** Orden de la salud (01 §2.7, el mismo con que el hub ordena por atención). */
var ORDEN_SALUD = [
	"socio_con_pendientes",
	"con_pendientes",
	"con_plan",
	"socio",
	"al_dia",
	"vende_contigo",
	"solo_solicitudes",
	"solo_reembolsos"
];
var SIN_RELACION = /* @__PURE__ */ new Set(["solo_solicitudes", "solo_reembolsos"]);
/** Chips de vista en el orden de 01 §4.9. */
var VISTAS = [
	{
		id: "con_relacion",
		incluye: (t) => !SIN_RELACION.has(t.salud),
		soloSiHay: false
	},
	{
		id: "atencion",
		incluye: (t) => t.salud === "socio_con_pendientes" || t.salud === "con_pendientes",
		soloSiHay: false
	},
	{
		id: "por_avisar",
		incluye: (t) => t.por_avisar,
		soloSiHay: false
	},
	{
		id: "promesas_vencidas",
		incluye: (t) => t.promesas.vencidas > 0,
		soloSiHay: true
	},
	{
		id: "con_plan",
		incluye: (t) => t.salud === "con_plan",
		soloSiHay: true
	},
	{
		id: "socios",
		incluye: (t) => t.es_socio,
		soloSiHay: false
	},
	{
		id: "al_dia",
		incluye: (t) => t.salud === "al_dia",
		soloSiHay: false
	},
	{
		id: "vende_contigo",
		incluye: (t) => t.salud === "vende_contigo",
		soloSiHay: false
	},
	{
		id: "solo_solicitudes",
		incluye: (t) => t.salud === "solo_solicitudes",
		soloSiHay: false
	},
	{
		id: "solo_reembolsos",
		incluye: (t) => t.salud === "solo_reembolsos",
		soloSiHay: false
	}
];
function esVista(v) {
	return v !== null && VISTAS.some((d) => d.id === v);
}
function esOrden(v) {
	return v === "atencion" || v === "comision" || v === "deuda" || v === "nombre";
}
/** Conteo de cada vista; quita las de «solo si > 0» que no tienen tiendas (salvo la activa). */
function conteosVistas(tiendas, activa) {
	return VISTAS.map((d) => ({
		id: d.id,
		n: tiendas.filter(d.incluye).length,
		soloSiHay: d.soloSiHay
	})).filter((c) => !c.soloSiHay || c.n > 0 || c.id === activa).map(({ id, n }) => ({
		id,
		n
	}));
}
function filtrarVista(tiendas, vista) {
	const def = VISTAS.find((d) => d.id === vista) ?? VISTAS[0];
	return def ? tiendas.filter(def.incluye) : [...tiendas];
}
function buscarTiendas(tiendas, q) {
	const texto = q.trim();
	if (!texto) return [...tiendas];
	return tiendas.filter((t) => coincide(texto, t.nombre, t.tienda_key));
}
var porNombre = (a, b) => a.nombre.localeCompare(b.nombre, "es-MX", { sensitivity: "base" });
/** Orden estable de 01 §4.9 y 03 §5.9 (atención = promesas vencidas → salud → comisión de 180 días). */
function ordenarTiendas(tiendas, orden) {
	const copia = [...tiendas];
	const salud = (t) => ORDEN_SALUD.indexOf(t.salud);
	switch (orden) {
		case "atencion": return copia.sort((a, b) => b.promesas.vencidas - a.promesas.vencidas || salud(a) - salud(b) || b.ventas.comision_180d_centavos - a.ventas.comision_180d_centavos || porNombre(a, b));
		case "comision": return copia.sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos || porNombre(a, b));
		case "deuda": return copia.sort((a, b) => b.muestras.pendientes - a.muestras.pendientes || b.muestras.valor_debido_centavos - a.muestras.valor_debido_centavos || porNombre(a, b));
		case "nombre": return copia.sort(porNombre);
	}
}
/** Contexto del encabezado: «24 tiendas con las que tienes relación · 10 con pendientes · 3 socios». */
function resumenTiendas(tiendas) {
	return {
		relacion: tiendas.filter((t) => !SIN_RELACION.has(t.salud)).length,
		conPendientes: tiendas.filter((t) => t.muestras.pendientes > 0).length,
		socios: tiendas.filter((t) => t.es_socio).length,
		porAvisar: tiendas.filter((t) => t.por_avisar).length
	};
}
/**
* Nombre visible de un producto (01 §6.0 y 02 §4.4). El hub manda `titulo_corto` tal como lo trae TikTok Shop (a veces
* en MAYÚSCULAS); normalizarTitulo es de la capa de vista, así que se aplica aquí. Sin corto, el nombre corto del título.
*/
function nombreVisible(corto, titulo) {
	const c = corto?.replace(/\s+/g, " ").trim();
	return c ? normalizarTitulo(c) : nombreCorto(titulo);
}
/** La muestra con el nombre corto del producto normalizado, para los bloques que lo pintan tal cual (TarjetaMuestra y
*  columnasMuestras de la tabla). */
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
/** Los últimos `n` puntos (la tabla gemela conserva todos). */
function ultimosPuntos(serie, n) {
	return serie.length > n ? serie.slice(serie.length - n) : [...serie];
}
/**
* «% de tu comisión · 90 días» del KPI (T2 de 01 §6.2). Entero en KPI (01 §1.5) salvo que redondeado diera «0 %» a una
* tienda que sí te generó comisión ($8 de $10,000 = 0.08 %): debajo del 10 % lleva un decimal y, si ni así llega a
* 0.1 %, «< 0.1 %». null si no te generó nada en 90 días (la pantalla pone «—»).
*/
function participacionKpi(p) {
	if (!(p > 0)) return null;
	if (p < 5e-4) return `< ${formato.porcentaje(.001, 1)}`;
	return formato.porcentaje(p, p < .1 ? 1 : 0);
}
/** T3 de 01 §6.2: pedidos distintos con alguna línea de la tienda y cuántos se reembolsaron (de la serie mensual). */
function pedidosTienda(detalle) {
	if (detalle.serie.length === 0) return {
		pedidos: detalle.tienda.ventas.pedidos_validos,
		reembolsados: 0,
		completos: false
	};
	let pedidos = 0;
	let reembolsados = 0;
	for (const p of detalle.serie) {
		pedidos += p.pedidos;
		reembolsados += p.pedidos_reembolsados;
	}
	return {
		pedidos,
		reembolsados,
		completos: true
	};
}
/** «Lo que le debes» (pendientes en orden de cola), «Lo que ya cumpliste» y el historial completo (más reciente primero). */
function seccionesMuestras(muestras) {
	return {
		pendientes: muestras.filter(esPendiente).sort((a, b) => (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER)),
		cumplidas: muestras.filter((m) => m.grupo === "entregada" || m.grupo === "exenta" || m.avance.etapa === "publicada"),
		historial: [...muestras].sort((a, b) => (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0))
	};
}
/** «Lo que le prometiste» (01 §4.10 punto 4): avisos enviados y no quitados, cada fecha con su estado. */
function avisosConPromesas(avisos, muestras, hoy) {
	const porId = new Map(muestras.map((m) => [m.application_id, m]));
	return avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null).sort((a, b) => (b.marcado_enviado_at ?? 0) - (a.marcado_enviado_at ?? 0)).map((aviso) => ({
		aviso,
		promesas: Object.entries(aviso.compromisos).map(([solicitud, fecha]) => {
			const m = porId.get(solicitud) ?? null;
			const publicada = m?.avance.etapa === "publicada" ? m.avance.fecha_publicada ?? fecha : null;
			const estado = publicada !== null ? "cumplida" : hoy > fecha ? "vencida" : "vigente";
			return {
				avisoId: aviso.id,
				solicitud,
				fecha,
				estado,
				cumplidaEl: publicada,
				muestra: m
			};
		})
	}));
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
* Serie mensual CONTINUA para la gráfica: el hub solo manda los meses con pedidos, y una tienda que vendió en febrero
* y en septiembre saldría con dos columnas juntas, como si fueran meses seguidos. Rellena con ceros los meses sin
* pedidos desde el primero hasta el mes en curso (así también se ve que dejó de vender). Si la serie no trae claves
* 'YYYY-MM' no la toca. Tope de 10 años para no generar de más con una clave rara.
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
/** Mes con más comisión (para la nota de la gráfica); null sin serie o sin ventas. */
function mejorMes(serie) {
	let mejor = null;
	for (const p of serie) if (p.comision_estimada_centavos > 0 && (!mejor || p.comision_estimada_centavos > mejor.comision_estimada_centavos)) mejor = p;
	return mejor;
}
/** Videos cuya tienda principal es esta (por comisión), para «Videos que más venden sus productos». */
function videosDeTienda(videos, nombre, limite = 6) {
	const clave = nombre.trim().toLocaleLowerCase("es-MX");
	return videos.filter((v) => (v.tienda_principal ?? "").trim().toLocaleLowerCase("es-MX") === clave && v.pedidos_validos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, limite);
}
/** C4: con imagen, la portada de un video siempre es la foto del producto (miniatura_origen 'producto' u omitido). */
function portadaDelProducto(v) {
	return v.miniatura !== null && v.miniatura_origen !== null;
}
/** product_id de la portada '/img/p/<id>?v=…' (también bajo /lan/v1/img/…); null si no es de producto. */
function productoDePortada(url) {
	if (!url) return null;
	return /\/img\/p\/([A-Za-z0-9_-]+)/.exec(url)?.[1] ?? null;
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
/**
* Contenido del Detalle de tienda (01_ux §4.10). Lo usan la página completa (#/tiendas/:key) y el panel de 480 de la
* lista (≥ 1280). Orden de 01: salud y su porqué, KPI, lo que le debes, lo que le prometiste, lo que ya cumpliste,
* ventas (comisión por mes, productos y videos con foto), historial de solicitudes y notas. En la página, columna
* principal (8) y lateral (4) desde 1180; en el panel y en el celular, una sola columna.
*/
var rutaMuestra = (id) => `/muestras/m/${encodeURIComponent(id)}`;
var rutaProducto = (id) => `/productos/${encodeURIComponent(id)}`;
var rutaVideo = (id) => `/videos/${encodeURIComponent(id)}`;
var rutaPlanTienda = (key) => `/muestras/plan?tienda=${encodeURIComponent(key)}`;
var ID_NOTAS = "notas-tienda";
/** Bloque con título (17/24, 600). En la página va en Tarjeta (ritmo de 02 §5); en el panel, abierto con filete. */
function Seccion(p) {
	const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(tiendas_module_default.seccion),
		id: p.id,
		"aria-label": p.titulo,
		"data-en-tarjeta": p.enTarjeta ? "" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cx(tiendas_module_default.seccionCabeza),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cx(tiendas_module_default.seccionTitulo),
				children: p.titulo
			}), p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.seccionAcciones),
				children: p.acciones
			}) : null]
		}), p.children]
	});
	return p.enTarjeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: cx(tiendas_module_default.seccionTarjeta),
		children: contenido
	}) : contenido;
}
/** Hasta 3 fotos de la tienda: su imagen, la de sus productos con más comisión y la de sus muestras. */
function fotosDeTienda(d) {
	const vistas = /* @__PURE__ */ new Set();
	const salida = [];
	const agregar = (url, nombre, id) => {
		if (!url) return;
		const clave = productoDePortada(url) ?? url;
		if (vistas.has(clave) || salida.length >= 3) return;
		vistas.add(clave);
		salida.push({
			url,
			nombre,
			id
		});
	};
	const productos = [...d.productos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos);
	for (const x of productos) agregar(x.imagen, nombreVisible(x.titulo_corto, x.titulo), x.product_id);
	for (const m of d.muestras) agregar(m.producto.imagen, nombreVisible(m.producto.titulo_corto, m.producto.titulo), m.producto.product_id);
	agregar(d.tienda.imagen, d.tienda.nombre, productoDePortada(d.tienda.imagen));
	return salida;
}
/** Foto de producto pulsable (lleva a su detalle). Sin product_id queda como imagen fija. */
function FotoProductoTienda(p) {
	const foto = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
		url: p.foto.url,
		alt: "",
		anchoCss: p.anchoCss,
		proporcion: p.proporcion,
		tienda: p.tienda,
		radio: p.radio,
		...p.prioridad ? { prioridad: p.prioridad } : {}
	});
	const id = p.foto.id;
	if (!id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(tiendas_module_default.heroeFoto),
		role: "img",
		"aria-label": p.foto.nombre,
		children: foto
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cx(tiendas_module_default.heroeFoto),
		onClick: () => navegar(rutaProducto(id)),
		"aria-label": p.foto.nombre,
		children: foto
	});
}
function IdTienda(p) {
	const toast = useToast();
	const copiar = () => {
		copiarTexto(p.shopId).then((ok) => {
			if (ok) toast.mostrar({
				texto: T.idCopiado,
				tono: "ok"
			});
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: cx(tiendas_module_default.heroeId),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [T.idTienda, ":"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: cx(tiendas_module_default.mono),
				title: p.shopId,
				children: formato.idCorto(p.shopId)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "Copy",
				etiqueta: T.copiarId,
				tamano: "sm",
				alPulsar: copiar
			})
		]
	});
}
/**
* Héroe: la fotografía de sus productos manda (02 §1). Página ancha: foto 4:5 + dos cuadradas apiladas a la
* izquierda; en el panel y en el celular, una fila de hasta 3 cuadradas arriba. A la derecha (o debajo): chip de
* salud, su porqué, ID de tienda y la banda de KPI.
*/
/** Lo que pide atención de un vistazo: por avisar, promesas, última venta y el mensaje que sugerimos. */
function Hechos(p) {
	const t = p.detalle.tienda;
	const plantillas = useConsulta("plantillas", {}, { activa: p.detalle.plantilla_sugerida !== null });
	const sugerida = p.detalle.plantilla_sugerida ? plantillas.datos?.items.find((x) => x.id === p.detalle.plantilla_sugerida) : void 0;
	const m = t.muestras;
	const conMuestras = m.recibidas > 0 || m.pendientes > 0 || m.entregadas > 0;
	if (!(t.por_avisar || t.promesas.vencidas > 0 || t.promesas.vigentes > 0 || t.ventas.ultima_venta_at !== null || !!sugerida || conMuestras)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.hechos),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.hechosChips),
				children: [
					t.promesas.vencidas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "critico",
						icono: "CircleAlert",
						children: T.promesasVencidas(t.promesas.vencidas)
					}) : null,
					t.por_avisar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "atencion",
						icono: "Bell",
						children: T.porAvisar
					}) : null,
					t.promesas.vigentes > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "info",
						icono: "CalendarCheck",
						children: T.promesasVigentes(t.promesas.vigentes)
					}) : null,
					t.ventas.ultima_venta_at !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(tiendas_module_default.hecho),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "History",
							tamano: 16
						}), T.ultimaVenta(formato.fechaCorta(t.ventas.ultima_venta_at))]
					}) : null
				]
			}),
			conMuestras ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(tiendas_module_default.hecho),
				"data-hecho": "muestras",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Package",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.muestrasResumen(m.recibidas, m.pendientes, m.entregadas) })]
			}) : null,
			sugerida ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(tiendas_module_default.hecho),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "MessageCircle",
					tamano: 16
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.mensajeSugerido(sugerida.nombre) })]
			}) : null
		]
	});
}
function Heroe(p) {
	const t = p.detalle.tienda;
	const fotos = fotosDeTienda(p.detalle);
	const [principal, ...resto] = fotos;
	const pareja = !p.fila && fotos.length === 2;
	const fotosHtml = p.fila ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(tiendas_module_default.heroeFila),
		"data-n": Math.max(1, fotos.length),
		children: fotos.length > 0 ? fotos.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoProductoTienda, {
			foto: f,
			tienda: t.nombre,
			anchoCss: 160,
			proporcion: "1:1",
			radio: "md",
			...i === 0 ? { prioridad: "alta" } : {}
		}, f.url)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: null,
			alt: "",
			anchoCss: 160,
			proporcion: "1:1",
			tienda: t.nombre,
			radio: "md"
		})
	}) : pareja ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(tiendas_module_default.heroeFotos),
		"data-n": 2,
		children: fotos.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoProductoTienda, {
			foto: f,
			tienda: t.nombre,
			anchoCss: 210,
			proporcion: "4:5",
			radio: "lg",
			...i === 0 ? { prioridad: "alta" } : {}
		}, f.url))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.heroeFotos),
		"data-n": fotos.length,
		children: [principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoProductoTienda, {
			foto: principal,
			tienda: t.nombre,
			anchoCss: 264,
			proporcion: "4:5",
			radio: "lg",
			prioridad: "alta"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: null,
			alt: "",
			anchoCss: 264,
			proporcion: "4:5",
			tienda: t.nombre,
			radio: "lg"
		}), resto.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(tiendas_module_default.heroeFotosChicas),
			children: resto.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoProductoTienda, {
				foto: f,
				tienda: t.nombre,
				anchoCss: 164,
				proporcion: "1:1",
				radio: "md"
			}, f.url))
		}) : null]
	});
	const texto = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.heroeTexto),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.heroeIdentidad),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
					nombre: t.nombre,
					tamano: 40
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
					salud: t.salud,
					esSocio: t.es_socio
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(tiendas_module_default.heroePorque),
				children: t.salud_porque
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hechos, { detalle: p.detalle }),
			t.shop_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdTienda, { shopId: t.shop_id }) : null
		]
	});
	const cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.heroe),
		"data-modo": p.modo,
		"data-fila": p.fila ? "" : void 0,
		children: [p.fila ? fotosHtml : texto, p.fila ? texto : fotosHtml]
	});
	return p.modo === "pagina" && !p.fila ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: cx(tiendas_module_default.heroeTarjeta),
		children: cuerpo
	}) : cuerpo;
}
function Kpis(p) {
	const t = p.detalle.tienda;
	const ped = pedidosTienda(p.detalle);
	const valor = t.muestras.valor_recibido_min_centavos > 0 || t.muestras.valor_recibido_max_centavos > 0 ? formato.rangoDinero(t.muestras.valor_recibido_min_centavos, t.muestras.valor_recibido_max_centavos, { aprox: true }) : T.sinDato;
	const tasa = ped.pedidos > 0 ? formato.porcentaje(ped.reembolsados / ped.pedidos) : formato.porcentaje(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BandaKpi, {
		titulo: T.kpiTitulo,
		className: cx(tiendas_module_default.kpis),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiComision,
				valor: formato.dinero(t.ventas.comision_estimada_centavos),
				...p.comision90 !== null ? { nota: T.kpiComision90(formato.dinero(p.comision90)) } : {}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiParte,
				valor: participacionKpi(t.ventas.participacion_90d) ?? T.sinDato,
				nota: T.kpiParteNota
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: ped.completos ? T.kpiPedidos : T.kpiPedidosValidos,
				valor: formato.numero(ped.pedidos),
				nota: ped.completos ? T.kpiPedidosNota(tasa, ped.reembolsados) : T.kpiPedidosNotaSinSerie
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
				etiqueta: T.kpiValor,
				valor,
				nota: T.kpiValorNota(t.muestras.recibidas)
			})
		]
	});
}
function TablaMuestras(p) {
	const clic = useClicReciente();
	const ajuste = useColumnasQueCaben((0, import_react.useMemo)(() => columnasMuestras("tienda"), []), REGLA_MUESTRAS);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(tiendas_module_default.tablaMarco),
		ref: ajuste.ref,
		onPointerDownCapture: clic.alPuntero,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
			etiqueta: p.etiqueta,
			filas: p.muestras,
			columnas: ajuste.columnas,
			idFila: (m) => m.application_id,
			alAbrir: (m) => navegar(rutaMuestra(m.application_id)),
			alSeleccionar: (m) => {
				if (clic.fueClic()) navegar(rutaMuestra(m.application_id));
			}
		})
	});
}
function ListaMuestras(p) {
	if (p.tabla) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablaMuestras, {
		muestras: p.muestras,
		etiqueta: p.etiqueta
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cx(tiendas_module_default.listaMuestras),
		children: p.muestras.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
			muestra: m,
			variante: "lista",
			conAccion: p.conAccion,
			alAbrir: () => navegar(rutaMuestra(m.application_id))
		}) }, m.application_id))
	});
}
var TONO_PROMESA = {
	vigente: "info",
	vencida: "critico",
	cumplida: "ok"
};
function Promesas(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const control = useControlMuestra();
	if (p.avisos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cx(tiendas_module_default.vacioCorto),
		children: T.prometisteVacio
	});
	const quitar = (a) => {
		acciones.editarAviso(a.id, {
			quitado_at: ahoraS(),
			rev: a.rev
		}).then((r) => {
			if (r.estado === "error" || r.estado === "conflicto") {
				if (r.error) toast.mostrar({
					texto: r.error.mensaje,
					tono: "error"
				});
				return;
			}
			toast.mostrar({
				texto: T.avisoQuitado,
				accion: {
					etiqueta: T.deshacer,
					alPulsar: () => void r.deshacer()
				}
			});
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: cx(tiendas_module_default.avisos),
		children: p.avisos.map(({ aviso, promesas }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: cx(tiendas_module_default.aviso),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(tiendas_module_default.avisoCabeza),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(tiendas_module_default.avisoFecha),
						children: T.avisoEnviado(formato.fechaCorta(aviso.marcado_enviado_at ?? ahoraS()))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						icono: "Trash2",
						alPulsar: () => quitar(aviso),
						children: T.quitarAviso
					})]
				}),
				aviso.texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(tiendas_module_default.avisoTexto),
					children: aviso.texto
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(tiendas_module_default.promesas),
					children: promesas.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cx(tiendas_module_default.promesa),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(tiendas_module_default.promesaProducto),
								children: x.muestra ? nombreVisible(x.muestra.producto.titulo_corto, x.muestra.producto.titulo) : T.muestraDesconocida
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(tiendas_module_default.promesaFecha),
								children: T.promesa(formato.fechaConDia(x.fecha))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								tono: TONO_PROMESA[x.estado],
								children: x.estado === "cumplida" && x.cumplidaEl ? T.promesaCumplida(formato.fechaCorta(x.cumplidaEl)) : x.estado === "vencida" ? T.promesaVencida : T.promesaVigente
							}),
							x.estado === "vencida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "secundario",
								tamano: "sm",
								alPulsar: () => control.abrirMensaje({ tienda: p.tiendaKey }),
								children: T.prepararNuevaFecha
							}) : null
						]
					}, `${x.avisoId}-${x.solicitud}`))
				})
			]
		}, aviso.id))
	});
}
/** Etiqueta del eje: sin el año si toda la serie es del mismo año ('feb 26' → 'feb'). */
function etiquetasMes(serie) {
	const anios = new Set(serie.map((x) => x.clave.slice(0, 4)));
	return serie.map((x) => anios.size <= 1 ? x.etiqueta.replace(/\s+\d{2,4}$/, "") : x.etiqueta);
}
function Ventas(p) {
	const d = p.detalle;
	const hoyMes = hoyLocal().slice(0, 7);
	const serieCompleta = serieMensualContinua(d.serie, hoyMes);
	const serie = p.angosta ? ultimosPuntos(serieCompleta, 6) : serieCompleta;
	const recortada = serie.length < serieCompleta.length;
	const etiquetas = etiquetasMes(serie);
	const mejor = mejorMes(serie);
	const unico = serieCompleta.length === 1 ? serieCompleta[0] : void 0;
	const notaMejor = mejor ? T.graficaNota(etiquetasMes([mejor])[0] ?? mejor.etiqueta, formato.dinero(mejor.comision_estimada_centavos)) : null;
	const nota = recortada ? T.graficaUltimos(serie.length, notaMejor) : notaMejor;
	const productos = [...d.productos].filter((x) => x.pedidos_validos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, 4);
	const nombres = new Map(d.productos.map((x) => [x.product_id, nombreVisible(x.titulo_corto, x.titulo)]));
	const videos = p.modo === "pagina" && p.videos ? videosDeTienda(p.videos, d.tienda.nombre, 4) : [];
	if (serie.length === 0 && productos.length === 0 && videos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cx(tiendas_module_default.vacioCorto),
		children: T.sinVentas
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.ventas),
		children: [
			unico ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.subseccion),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cx(tiendas_module_default.subtitulo),
					children: T.graficaMes
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(tiendas_module_default.vacioCorto),
					"data-un-solo-periodo": "",
					children: T.unSoloMes(etiquetasMes([unico])[0] ?? unico.etiqueta, formato.dinero(unico.comision_estimada_centavos), unico.pedidos)
				})]
			}) : serie.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.grafica),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
					titulo: T.graficaMes,
					alto: p.modo === "panel" ? 160 : 200,
					...nota ? { nota } : {},
					puntos: serie.map((x, i) => ({
						clave: x.clave,
						etiqueta: etiquetas[i] ?? x.etiqueta,
						valor: x.comision_estimada_centavos,
						enCurso: x.clave === hoyMes,
						aria: T.ariaMes(x.etiqueta, formato.dinero(x.comision_estimada_centavos), x.pedidos)
					})),
					formatoEje: (v) => formato.ejeDinero(v),
					tablaGemela: {
						columnas: [
							T.colMes,
							T.colComision,
							T.colPedidos
						],
						filas: serieCompleta.map((x) => [
							x.clave === hoyMes ? `${x.etiqueta} (${T.enCurso})` : x.etiqueta,
							formato.dinero(x.comision_estimada_centavos),
							formato.numero(x.pedidos)
						])
					}
				})
			}) : null,
			productos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.subseccion),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cx(tiendas_module_default.subtitulo),
					children: T.productosTop
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(tiendas_module_default.rejillaProductos),
					"data-modo": p.modo,
					children: productos.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
						imagen: x.imagen,
						nombre: nombreVisible(x.titulo_corto, x.titulo),
						tienda: x.tienda_nombre ?? d.tienda.nombre,
						cifraPrincipal: formato.dinero(x.comision_estimada_centavos),
						cifraSecundaria: T.productoCifra(x.unidades),
						ranking: i + 1,
						alPulsar: () => navegar(rutaProducto(x.product_id))
					}, x.product_id))
				})]
			}) : null,
			videos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.subseccion),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: cx(tiendas_module_default.subtitulo),
					children: T.videosTop
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(tiendas_module_default.rejillaVideos),
					children: videos.map((v, i) => {
						const idProducto = productoDePortada(v.miniatura);
						const nombre = (idProducto ? nombres.get(idProducto) : void 0) ?? T.videoNombre(formato.idCorto(v.content_id));
						const dinero = formato.dinero(v.comision_estimada_centavos);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniaturaVideo, {
							url: v.miniatura,
							...portadaDelProducto(v) ? { rotulo: T.fotoDelProducto } : {},
							ranking: i + 1,
							comision: dinero,
							unidades: T.videoUnidades(v.unidades),
							nombre,
							fechaPoster: formato.fechaCorta(v.primera_venta),
							tienda: v.tienda_principal,
							anchoCss: 160,
							etiqueta: T.videoEtiqueta(i + 1, dinero, v.unidades, nombre),
							alPulsar: () => navegar(rutaVideo(v.content_id)),
							className: cx(tiendas_module_default.miniatura)
						}, v.content_id);
					})
				})]
			}) : null
		]
	});
}
function ContenidoTienda(p) {
	const d = p.detalle;
	const ancho = useClaseAncho();
	const android = usePlataforma() === "android";
	const hoy = hoyLocal();
	const control = useControlMuestra();
	const rango = useConsulta("dashboard", { periodo: "90d" }).datos?.periodo;
	const tiendas90 = useConsulta("tiendas", rango ? {
		desde: rango.desde,
		hasta: rango.hasta
	} : {}, { activa: !!rango });
	const videos = useConsulta("videos", {}, { activa: p.modo === "pagina" });
	const comision90 = (0, import_react.useMemo)(() => {
		if (!rango || !tiendas90.datos) return null;
		const fila = tiendas90.datos.items.find((t) => t.tienda_key === d.tienda.tienda_key);
		return fila ? fila.ventas.comision_estimada_centavos : 0;
	}, [
		rango,
		tiendas90.datos,
		d.tienda.tienda_key
	]);
	const secciones = (0, import_react.useMemo)(() => seccionesMuestras(d.muestras.map(muestraConNombre)), [d.muestras]);
	const avisos = (0, import_react.useMemo)(() => avisosConPromesas(d.avisos, d.muestras, hoy), [
		d.avisos,
		d.muestras,
		hoy
	]);
	const angosta = android || ancho === "compacta";
	const tabla = p.modo === "pagina" && !angosta;
	const dosColumnas = p.modo === "pagina" && (ancho === "expandida" || ancho === "amplia");
	const enTarjeta = p.modo === "pagina";
	const n = secciones.pendientes.length;
	const prometiste = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.prometiste,
		enTarjeta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Promesas, {
			avisos,
			tiendaKey: d.tienda.tienda_key
		})
	});
	const notas = enTarjeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: ID_NOTAS,
		className: cx(tiendas_module_default.notasPagina),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
			entidad: "tienda",
			entidadId: d.tienda.tienda_key,
			titulo: T.notas,
			className: cx(tiendas_module_default.notasTarjeta)
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: ID_NOTAS,
		className: cx(tiendas_module_default.notasPanel),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
			entidad: "tienda",
			entidadId: d.tienda.tienda_key,
			titulo: T.notas
		})
	});
	const leDebes = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.leDebes(n),
		enTarjeta,
		acciones: n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			icono: "CalendarDays",
			alPulsar: () => navegar(rutaPlanTienda(d.tienda.tienda_key)),
			children: T.planearLas(n)
		}) : void 0,
		children: n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaMuestras, {
			muestras: secciones.pendientes,
			tabla,
			etiqueta: T.tablaPendientes,
			conAccion: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(tiendas_module_default.vacioCorto),
			children: T.leDebesVacio
		})
	});
	const cumpliste = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.cumpliste,
		enTarjeta,
		children: secciones.cumplidas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaMuestras, {
			muestras: secciones.cumplidas,
			tabla: false,
			etiqueta: T.cumpliste,
			conAccion: false
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(tiendas_module_default.vacioCorto),
			children: T.cumplisteVacio
		})
	});
	const ventas = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.ventas,
		enTarjeta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ventas, {
			detalle: d,
			videos: videos.datos?.items,
			modo: p.modo,
			angosta
		})
	});
	const historial = p.modo === "pagina" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seccion, {
		titulo: T.historial,
		enTarjeta,
		children: secciones.historial.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaMuestras, {
			muestras: secciones.historial,
			tabla,
			etiqueta: T.tablaHistorial,
			conAccion: false
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(tiendas_module_default.vacioCorto),
			children: T.historialVacio
		})
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(tiendas_module_default.detalle),
		"data-modo": p.modo,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heroe, {
				detalle: d,
				modo: p.modo,
				fila: p.modo === "panel" || angosta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpis, {
				detalle: d,
				comision90
			}),
			dosColumnas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				leDebes,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(tiendas_module_default.columnas),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(tiendas_module_default.columnaPrincipal),
						children: [cumpliste, ventas]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cx(tiendas_module_default.columnaLateral),
						"aria-label": T.prometiste,
						children: [prometiste, notas]
					})]
				}),
				historial
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				leDebes,
				prometiste,
				cumpliste,
				ventas,
				historial,
				notas
			] }),
			p.modo === "pagina" && angosta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(tiendas_module_default.barraFija),
				"data-barra-fija": "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					icono: "MessageCircle",
					alPulsar: () => control.abrirMensaje({ tienda: d.tienda.tienda_key }),
					children: T.avisarTienda
				})
			}) : null
		]
	});
}
/**
* #/tiendas · Lista de tiendas (01_ux §4.9). Chips de vista con conteo · búsqueda · ordenar (atención, comisión,
* pendientes, nombre) · tabla (Windows) o tarjetas (celular). En Windows también «Fichas» con foto. Desde 1280 la
* tienda se abre en el panel de 480 (?sel=<key>, con ⤢ a página completa); debajo, a página completa.
*/
var ORDENES = [
	"atencion",
	"comision",
	"deuda",
	"nombre"
];
var CLAVE_MODO = "corte.tiendas.modo";
var rutaTienda = (key) => `/tiendas/${encodeURIComponent(key)}`;
function PanelTienda(p) {
	const consulta = useConsulta("tienda", { key: p.clave });
	const control = useControlMuestra();
	const d = consulta.datos;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PanelLateral, {
		abierto: true,
		titulo: d?.tienda.nombre ?? p.fila?.nombre ?? T.panelTitulo,
		alCerrar: p.alCerrar,
		alExpandir: () => navegar(rutaTienda(p.clave)),
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(tiendas_module_default.panelPie),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				icono: "MessageCircle",
				alPulsar: () => control.abrirMensaje({ tienda: p.clave }),
				children: T.avisarTienda
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				iconoFinal: "ArrowRight",
				alPulsar: () => navegar(rutaTienda(p.clave)),
				children: T.verFicha
			})]
		}),
		children: [
			consulta.cargando || !d && !consulta.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaDetalle, {}) : null,
			consulta.error && !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
				error: consulta.error,
				titulo: T.errorDetalleTitulo,
				alReintentar: () => void consulta.refrescar()
			}) : null,
			d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoTienda, {
				detalle: d,
				modo: "panel"
			}) : null
		]
	});
}
function PantallaTiendas() {
	const consulta = useConsulta("tiendas", {});
	const sync = useSync();
	const [vistaParam, setVista] = useParametro("vista");
	const [ordenParam, setOrden] = useParametro("orden");
	const [sel, setSel] = useParametro("sel");
	const [busqueda, setBusqueda] = (0, import_react.useState)("");
	const [modo, setModoEstado] = (0, import_react.useState)(() => leerLocal(CLAVE_MODO) === "fichas" ? "fichas" : "tabla");
	const clic = useClicReciente();
	const ancho = useClaseAncho();
	const android = usePlataforma() === "android";
	const conPanel = usePanelDisponible() && !android;
	const tarjetas = android || ancho === "compacta";
	const vista = esVista(vistaParam) ? vistaParam : "con_relacion";
	const orden = esOrden(ordenParam) ? ordenParam : "atencion";
	const todas = consulta.datos?.items;
	const conteos = (0, import_react.useMemo)(() => conteosVistas(todas ?? [], vista), [todas, vista]);
	const resumen = (0, import_react.useMemo)(() => resumenTiendas(todas ?? []), [todas]);
	const visibles = (0, import_react.useMemo)(() => ordenarTiendas(buscarTiendas(filtrarVista(todas ?? [], vista), busqueda), orden), [
		todas,
		vista,
		busqueda,
		orden
	]);
	const filaSel = sel ? todas?.find((t) => t.tienda_key === sel) : void 0;
	const ajuste = useColumnasQueCaben((0, import_react.useMemo)(() => conAnchosDeEncabezado(columnasTiendas()).filter((c) => c.id !== "productos").map((c) => c.id === "tienda" ? {
		...c,
		celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaTienda, { tienda: t })
	} : c), []), REGLA_COLUMNAS);
	const filaChips = useDesborde(conteos.map((c) => `${c.id}${c.n}`).join());
	const setModo = (m) => {
		setModoEstado(m);
		guardarLocal(CLAVE_MODO, m);
	};
	const abrir = (t) => {
		if (conPanel) setSel(t.tienda_key);
		else navegar(rutaTienda(t.tienda_key));
	};
	const avisar = resumen.porAvisar > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: tarjetas ? "secundario" : "primario",
		icono: "MessageCircle",
		...tarjetas ? {
			anchoCompleto: true,
			className: cx(tiendas_module_default.trasEncabezado)
		} : {},
		alPulsar: () => navegar("/muestras/avisos"),
		children: T.avisarTiendas
	}) : null;
	const acciones = avisar && !tarjetas ? avisar : void 0;
	let cuerpo;
	if (consulta.cargando || !todas && !consulta.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaLista, { tarjetas });
	else if (consulta.error && !todas) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
		error: consulta.error,
		titulo: T.errorTitulo,
		alReintentar: () => void consulta.refrescar()
	});
	else if (!todas || todas.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Store",
		titulo: T.vacioTitulo,
		texto: T.vacioTexto,
		...sync.puede ? { accion: {
			etiqueta: T.vacioAccion,
			alPulsar: () => void sync.sincronizar()
		} } : {},
		className: cx(tiendas_module_default.estado)
	});
	else {
		const sinResultados = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Search",
			titulo: T.sinResultados,
			texto: T.sinResultadosTexto,
			accion: {
				etiqueta: T.verTodas,
				alPulsar: () => {
					setBusqueda("");
					setVista(null, { reemplazar: true });
				}
			},
			className: cx(tiendas_module_default.estado)
		});
		if (visibles.length === 0) cuerpo = sinResultados;
		else if (tarjetas) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(tiendas_module_default.listaTarjetas),
			"aria-label": T.tablaEtiqueta,
			children: visibles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaTienda, {
				tienda: t,
				variante: "fila",
				alAbrir: () => abrir(t)
			}) }, t.tienda_key))
		});
		else if (modo === "fichas") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: cx(tiendas_module_default.rejillaFichas),
			"aria-label": T.tablaEtiqueta,
			children: visibles.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaTienda, {
				tienda: t,
				variante: "ficha",
				alAbrir: () => abrir(t)
			}) }, t.tienda_key))
		});
		else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(tiendas_module_default.tablaMarco),
			ref: ajuste.ref,
			onPointerDownCapture: clic.alPuntero,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
				etiqueta: T.tablaEtiqueta,
				filas: visibles,
				columnas: ajuste.columnas,
				idFila: (t) => t.tienda_key,
				seleccionada: conPanel ? sel : null,
				alSeleccionar: (t) => {
					if (clic.fueClic()) abrir(t);
				},
				alAbrir: abrir,
				claveScroll: `tiendas-${vista}-${orden}`,
				vacio: sinResultados
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.titulo,
		lista: !!todas || !!consulta.error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(tiendas_module_default.pantalla),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
					titulo: T.titulo,
					...todas && todas.length > 0 ? { contexto: T.contexto(resumen.relacion, resumen.conPendientes, resumen.socios) } : {},
					...acciones ? { acciones } : {}
				}),
				avisar && tarjetas ? avisar : null,
				todas && todas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(tiendas_module_default.controles, tiendas_module_default.trasEncabezado),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: filaChips.ref,
							className: cx(tiendas_module_default.chips),
							role: "group",
							"aria-label": T.vistas,
							"data-fila-unica": "",
							...filaChips.desborde ? { "data-desborde": filaChips.desborde } : {},
							children: conteos.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
								activo: c.id === vista,
								conteo: c.n,
								alCambiar: (activo) => setVista(activo && c.id !== "con_relacion" ? c.id : null, { reemplazar: true }),
								children: ETIQUETA_VISTA[c.id]
							}, c.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(tiendas_module_default.herramientas),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
									etiqueta: T.buscar,
									etiquetaOculta: true,
									tipo: "search",
									placeholder: T.buscar,
									valor: busqueda,
									alCambiar: setBusqueda,
									className: cx(tiendas_module_default.buscador)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
									etiqueta: T.ordenarCon(T.orden[orden]),
									icono: "ArrowDownUp",
									disparador: tarjetas ? "icono" : "boton",
									opciones: ORDENES.map((o) => ({
										id: o,
										etiqueta: T.orden[o],
										...o === orden ? { icono: "Check" } : {},
										alPulsar: () => setOrden(o === "atencion" ? null : o, { reemplazar: true })
									})),
									className: cx(tarjetas ? tiendas_module_default.ordenIcono : tiendas_module_default.menuControl)
								}),
								!tarjetas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
									etiqueta: T.modo,
									valor: modo,
									alCambiar: setModo,
									opciones: [{
										valor: "tabla",
										etiqueta: T.modoTabla,
										icono: "LayoutList"
									}, {
										valor: "fichas",
										etiqueta: T.modoFichas,
										icono: "LayoutGrid"
									}],
									className: cx(tiendas_module_default.segmentoModo)
								}) : null
							]
						}),
						busqueda.trim() || vista !== "con_relacion" || tarjetas && orden !== "atencion" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(tiendas_module_default.mostrando),
							"aria-live": "polite",
							children: [busqueda.trim() || vista !== "con_relacion" ? T.mostrando(visibles.length, todas.length) : null, tarjetas && orden !== "atencion" ? T.ordenActivo(T.orden[orden]) : null].filter(Boolean).join(" · ")
						}) : null
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(tiendas_module_default.trasEncabezado, consulta.refrescando && tiendas_module_default.refrescando),
					children: cuerpo
				}),
				conPanel && sel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelTienda, {
					clave: sel,
					fila: filaSel,
					alCerrar: () => setSel(null, { reemplazar: true })
				}) : null
			]
		})
	});
}
function irANotas() {
	const seccion = document.getElementById(ID_NOTAS);
	if (!seccion) return;
	seccion.scrollIntoView({
		block: "start",
		behavior: "smooth"
	});
	seccion.querySelector("textarea, input, button")?.focus({ preventScroll: true });
}
function PantallaTienda() {
	const { params } = useRuta();
	const clave = params["key"] ?? "";
	const consulta = useConsulta("tienda", { key: clave }, { activa: clave !== "" });
	const plataforma = usePlataforma();
	const ancho = useClaseAncho();
	const angosta = plataforma === "android" || ancho === "compacta";
	const planearEnMenu = angosta || ancho === "media";
	const control = useControlMuestra();
	const d = consulta.datos;
	const nombre = d?.tienda.nombre ?? T.tituloDetalle;
	const pendientes = d ? d.tienda.muestras.pendientes : 0;
	const menu = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
		etiqueta: T.masAcciones,
		icono: "Ellipsis",
		opciones: [...planearEnMenu && pendientes > 0 ? [{
			id: "planear",
			etiqueta: T.planearPendientes,
			icono: "CalendarDays",
			alPulsar: () => navegar(rutaPlanTienda(clave))
		}] : [], {
			id: "nota",
			etiqueta: T.agregarNota,
			icono: "Pencil",
			alPulsar: irANotas
		}]
	});
	const acciones = d ? angosta ? menu : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			icono: "MessageCircle",
			alPulsar: () => control.abrirMensaje({ tienda: d.tienda.tienda_key }),
			children: T.avisarTienda
		}),
		pendientes > 0 && !planearEnMenu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			icono: "CalendarDays",
			alPulsar: () => navegar(rutaPlanTienda(d.tienda.tienda_key)),
			children: T.planearPendientes
		}) : null,
		menu
	] }) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: nombre,
		lista: !!d || !!consulta.error,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(tiendas_module_default.pantalla),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo: nombre,
				volver: {
					a: "/tiendas",
					etiqueta: T.volverTiendas
				},
				...acciones ? { acciones } : {}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(tiendas_module_default.trasEncabezado, consulta.refrescando && tiendas_module_default.refrescando),
				children: [
					consulta.cargando || !d && !consulta.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaDetalle, {}) : null,
					consulta.error && !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorVista, {
						error: consulta.error,
						titulo: T.errorDetalleTitulo,
						alReintentar: () => void consulta.refrescar()
					}) : null,
					d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoTienda, {
						detalle: d,
						modo: "pagina"
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { PantallaTienda, PantallaTiendas };
