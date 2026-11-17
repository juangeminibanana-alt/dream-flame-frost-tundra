import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as diaSemana, E as ETIQUETA_NIVEL, F as Foto, Fn as sumarDias, G as Kbd, Gn as useClaseAncho, H as Icono, Hn as useAtajos, I as GraficaColumnas, It as contarTrabajo, Jt as esPendiente, Ln as textoDatosGuion, M as Esqueleto, Mt as coincide, N as EsqueletoVista, P as EstadoVacio, Q as OpcionRadio, Rt as copiarTexto, St as ahoraS, Vn as useAcciones, W as Interruptor, X as Modal, an as horaLocal, ar as useSesion, c as BarraProgreso, cr as useToast, ct as SelectorFecha, d as BotonIcono, dn as mantenerPantalla, dr as vibrar, er as useParametro, et as Palomita, g as Chip, gt as Ticket, h as Casilla, ht as TarjetaProducto, in as guardarImagen, k as EncabezadoPantalla, m as CampoTexto, mn as nombreCorto, nn as formato, nr as usePrimeraVez, on as hoyLocal, or as useSync, pn as navegar, qn as useConsulta, r as AvatarTienda, rt as Pantalla, st as Segmentado, tr as usePlataforma, u as Boton, ut as SelectorNumero, vn as opCambioEtapa, vt as abrirExterno, y as ChipsDias, yn as ordenTiendasAvisar, yt as abrirTikTok } from "./app-CLiVRbtG.mjs";
import { A as armarPlan, E as EditorMensaje, M as opsDePlan, f as PestanasMuestras, j as desdePorOmision, k as useControlMuestra, m as TarjetaMuestra, o as ListaNotas, y as ChipSalud } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flujos-DsXGUdWI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Une clases de CSS Modules ignorando las vacías (las clases de un módulo llegan como string | undefined). */
function cx(...lista) {
	return lista.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}
/** Variables CSS en línea ('--p', '--holgura'…) con el tipo de `style`: medidas que dependen de datos, nunca colores. */
function vars(valores) {
	const salida = {};
	for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === "number" ? String(v) : v;
	return salida;
}
/** Plural sencillo con separador de miles: (1, 'muestra') → '1 muestra' · (2, 'tienda') → '2 tiendas'. */
function cuenta(n, singular, plural) {
	return `${formato.numero(n)} ${n === 1 ? singular : plural ?? `${singular}s`}`;
}
/** Primera letra en mayúscula (encabezados que empiezan con una fecha: «Hoy · jue 12 nov», «Vie 13 nov»). */
function capitalizar(t) {
	return t.length > 0 ? `${t.charAt(0).toLocaleUpperCase("es-MX")}${t.slice(1)}` : t;
}
/** Nombre corto del producto (01 §6.0): el del hub o el que calcula @/dominio. */
function nombreDe(p) {
	return p.titulo_corto ?? nombreCorto(p.titulo);
}
var flujos_module_default = {
	pantalla: "_pantalla_jj94u_3",
	reserva: "_reserva_jj94u_13",
	refrescando: "_refrescando_jj94u_18",
	estadoCentro: "_estadoCentro_jj94u_24",
	cargandoTexto: "_cargandoTexto_jj94u_32",
	esqueleto: "_esqueleto_jj94u_38",
	esqueletoFila: "_esqueletoFila_jj94u_44",
	esqueletoTextos: "_esqueletoTextos_jj94u_54",
	aviso: "_aviso_jj94u_62",
	avisoIcono: "_avisoIcono_jj94u_80",
	avisoCuerpo: "_avisoCuerpo_jj94u_102",
	avisoTexto: "_avisoTexto_jj94u_108",
	avisoAcciones: "_avisoAcciones_jj94u_112",
	barraFija: "_barraFija_jj94u_119",
	repisa: "_repisa_jj94u_144",
	barraFijaEspacio: "_barraFijaEspacio_jj94u_154",
	overline: "_overline_jj94u_159",
	lector: "_lector_jj94u_168",
	enlace: "_enlace_jj94u_179"
};
var SIN_HOLGURA = {
	arriba: 0,
	izquierda: 0,
	derecha: 0
};
/** La capa cuenta: visible, anclada abajo y no casi de pantalla completa (un diálogo u hoja tapan todo a propósito). */
function capaAnclada(r, altoVentana) {
	if (r.width < 1 || r.height < 1) return false;
	if (r.height > altoVentana * .7) return false;
	return r.bottom >= altoVentana - 200;
}
/**
* `propio` = la barra en reposo; `minimo` = el ancho que necesitan sus botones (con sus huecos y su relleno base).
* Una capa que no está anclada abajo, que es casi de pantalla completa (diálogo u hoja) o que no se cruza con la barra
* no cuenta.
*/
function holguraContra(propio, capas, altoVentana, minimo = Number.POSITIVE_INFINITY) {
	const h = { ...SIN_HOLGURA };
	let subida = 0;
	for (const r of capas) {
		if (!capaAnclada(r, altoVentana)) continue;
		const horizontal = r.left < propio.right && r.right > propio.left;
		const vertical = r.top < propio.bottom - 1 && r.bottom > propio.top + 1;
		if (!horizontal || !vertical) continue;
		subida = Math.max(subida, Math.ceil(propio.bottom - r.top + 12));
		const libreIzquierda = r.left - propio.left - 12;
		const libreDerecha = propio.right - r.right - 12;
		if (libreIzquierda >= minimo) h.derecha = Math.max(h.derecha, Math.ceil(propio.right - r.left + 12));
		else if (libreDerecha >= minimo) h.izquierda = Math.max(h.izquierda, Math.ceil(r.right - propio.left + 12));
		else h.arriba = subida;
	}
	if (h.arriba > 0 || h.izquierda > 0 && h.derecha > 0 && propio.right - propio.left - h.izquierda - h.derecha < minimo) return {
		arriba: subida,
		izquierda: 0,
		derecha: 0
	};
	return h;
}
/**
* La holgura final: primero con la barra PEGADA ABAJO (su sitio fijo en la ventana, `pegada`), que no depende del
* desplazamiento; si ahí la capa obliga a subir, manda eso. Si no, el relleno lateral se calcula con la posición real
* (`actual`), para no recorrer los botones mientras la barra todavía descansa arriba de la capa.
*/
function holguraBarra(actual, pegada, capas, altoVentana, minimo) {
	const enSuSitio = holguraContra(pegada, capas, altoVentana, minimo);
	if (enSuSitio.arriba > 0) return {
		arriba: enSuSitio.arriba,
		izquierda: 0,
		derecha: 0
	};
	return holguraContra(actual, capas, altoVentana, minimo);
}
/**
* Alto del espaciador del final de la pantalla (px). `columna` = lo ancho de la pantalla; `finContenido` = dónde termina
* su contenido (coordenadas del documento, sin el espaciador); `despues` = lo que el documento sigue después de él
* (rellenos inferiores de la pantalla y del marco). El contenido tiene que poder terminar 12 px arriba de la capa
* anclada abajo más alta que se cruce con la pantalla; si ya termina ahí sin desplazar, no hace falta nada.
*/
function reservaContra(capas, altoVentana, columna, finContenido, despues) {
	let tope = Number.POSITIVE_INFINITY;
	for (const r of capas) {
		if (!capaAnclada(r, altoVentana)) continue;
		if (!(r.left < columna.right && r.right > columna.left)) continue;
		tope = Math.min(tope, r.top);
	}
	if (!Number.isFinite(tope)) return 0;
	const limite = tope - 12;
	if (finContenido - Math.max(0, finContenido + despues - altoVentana) <= limite) return 0;
	return Math.max(0, Math.ceil(altoVentana - despues - limite));
}
/** Rectángulos de las capas globales visibles (la marca puede ir en la capa o en su contenedor fijo, como los avisos).
*  Los menús, globos de ayuda y burbujas de recorrido van pegados a su botón: no son capas ancladas. */
function capasFijas(propio) {
	const salida = [];
	for (const raiz of document.querySelectorAll("[data-capa-corte]")) {
		if (propio.contains(raiz) || raiz.contains(propio)) continue;
		if (raiz.matches("[role=\"menu\"], [role=\"tooltip\"], [aria-modal=\"false\"]")) continue;
		for (const el of [raiz, ...raiz.querySelectorAll(":scope > *")]) {
			const s = getComputedStyle(el);
			if (s.visibility === "hidden" || s.display === "none") continue;
			if (el === raiz && s.position !== "fixed") continue;
			salida.push(el.getBoundingClientRect());
		}
	}
	return salida;
}
/** Ancho que necesitan los botones de la barra: sus anchos + los huecos + el relleno base (sin el espaciador). */
function anchoMinimo(el) {
	const s = getComputedStyle(el);
	const hueco = Number.parseFloat(s.columnGap) || 0;
	const hijos = [...el.children].filter((h) => h instanceof HTMLElement && !h.classList.contains(flujos_module_default.barraFijaEspacio ?? "") && h.getClientRects().length > 0);
	return hijos.reduce((suma, h) => suma + h.getBoundingClientRect().width, 0) + hueco * Math.max(0, hijos.length - 1) + 24;
}
/** Vuelve a medir cuando cambia el DOM (aparece o se va una capa), la ventana, el desplazamiento o termina una animación;
*  una vez por cuadro. */
function useRemedir(el, medir, conScroll) {
	const ultima = (0, import_react.useRef)(medir);
	ultima.current = medir;
	(0, import_react.useEffect)(() => {
		if (!el || typeof window === "undefined" || typeof MutationObserver === "undefined") return void 0;
		let cuadro = 0;
		const correr = () => {
			cuadro = 0;
			ultima.current(el);
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(correr);
		};
		pedir();
		const o = new MutationObserver(pedir);
		o.observe(document.body, {
			childList: true,
			subtree: true
		});
		window.addEventListener("resize", pedir);
		if (conScroll) window.addEventListener("scroll", pedir, { passive: true });
		document.addEventListener("animationend", pedir, true);
		document.addEventListener("transitionend", pedir, true);
		return () => {
			o.disconnect();
			window.removeEventListener("resize", pedir);
			window.removeEventListener("scroll", pedir);
			document.removeEventListener("animationend", pedir, true);
			document.removeEventListener("transitionend", pedir, true);
			if (cuadro) window.cancelAnimationFrame(cuadro);
		};
	}, [el, conScroll]);
}
function useHolgura(el) {
	const [estado, setEstado] = (0, import_react.useState)({
		holgura: SIN_HOLGURA,
		pegada: false
	});
	useRemedir(el, (barra) => {
		const aplicada = Number.parseFloat(barra.style.getPropertyValue("--holgura")) || 0;
		const bottomCss = Number.parseFloat(getComputedStyle(barra).bottom) || 0;
		const fondo = bottomCss - aplicada;
		const r = barra.getBoundingClientRect();
		const alto = window.innerHeight;
		const abajo = alto - fondo;
		const enSuSitio = {
			top: abajo - r.height,
			bottom: abajo,
			left: r.left,
			right: r.right
		};
		const nueva = holguraBarra({
			top: r.top,
			bottom: r.bottom,
			left: r.left,
			right: r.right
		}, enSuSitio, capasFijas(barra), alto, anchoMinimo(barra));
		const pegada = r.height > 0 && r.bottom >= alto - bottomCss - 1.5;
		setEstado((previa) => previa.pegada === pegada && previa.holgura.arriba === nueva.arriba && previa.holgura.izquierda === nueva.izquierda && previa.holgura.derecha === nueva.derecha ? previa : {
			holgura: nueva,
			pegada
		});
	}, true);
	return estado;
}
function BarraFija(p) {
	const [el, setEl] = (0, import_react.useState)(null);
	const { holgura, pegada } = useHolgura(el);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setEl,
		role: "group",
		"aria-label": p.etiqueta,
		className: cx(flujos_module_default.barraFija, p.className),
		style: vars({
			"--holgura": `${holgura.arriba}px`,
			"--holgura-izquierda": `${holgura.izquierda}px`,
			"--holgura-derecha": `${holgura.derecha}px`
		}),
		"data-barra-fija": "",
		...holgura.arriba > 0 ? { "data-esquiva": "subir" } : {},
		...pegada ? { "data-pegada": "" } : {},
		children: p.children
	});
}
/** Lo que el documento sigue después del espaciador: rellenos, bordes y márgenes inferiores de sus contenedores. */
function despuesDe(el) {
	let suma = 0;
	for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
		const s = getComputedStyle(a);
		suma += (Number.parseFloat(s.paddingBottom) || 0) + (Number.parseFloat(s.borderBottomWidth) || 0) + Math.max(0, Number.parseFloat(s.marginBottom) || 0);
	}
	return suma;
}
/** Alto del espaciador del final de la pantalla (ver reservaContra). */
function useReservaCapas(el) {
	const [reserva, setReserva] = (0, import_react.useState)(0);
	useRemedir(el, (espaciador) => {
		const r = espaciador.getBoundingClientRect();
		const columna = espaciador.parentElement?.getBoundingClientRect() ?? r;
		const nueva = reservaContra(capasFijas(espaciador), window.innerHeight, columna, r.top + window.scrollY, despuesDe(espaciador));
		setReserva((previa) => previa === nueva ? previa : nueva);
	}, false);
	return reserva;
}
/** Espaciador del final de cada pantalla de flujos (va como su último hijo). Sin capas no ocupa lugar: su margen
*  negativo se come el hueco de la columna. */
function ReservaCapas() {
	const [el, setEl] = (0, import_react.useState)(null);
	const reserva = useReservaCapas(el);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: setEl,
		"aria-hidden": "true",
		className: cx(flujos_module_default.reserva),
		style: { height: reserva },
		"data-reserva-capas": reserva
	});
}
/** La cola de pendientes: la misma clave que usan Inicio, Muestras y los bloques. */
var PARAMS_PENDIENTES = {
	grupo: [
		"pausada",
		"por_vencer",
		"vencida"
	],
	orden: "prioridad"
};
/** Preferencias por omisión mientras llegan las del hub (01 §4.5: 3 por día, de lunes a sábado). */
var RITMO_OMISION = {
	capacidad: 3,
	dias: [
		0,
		1,
		2,
		3,
		4,
		5
	],
	orden: "sugerido"
};
function ritmoDe(p) {
	return {
		capacidad: Math.max(1, Math.min(10, p?.capacidad_videos_dia ?? RITMO_OMISION.capacidad)),
		dias: p?.dias_videos ?? RITMO_OMISION.dias,
		orden: p?.orden_plan ?? RITMO_OMISION.orden,
		programo: p?.programo_mis_videos ?? false,
		rev: p?.rev ?? null
	};
}
/** Muestras de trabajo + plan + avisos + preferencias (lo que necesitan Agenda, Armar mi plan, Sesión y Avisar). */
function useDatosTrabajo() {
	const muestras = useConsulta("muestras", PARAMS_PENDIENTES);
	const plan = useConsulta("plan", {});
	const avisos = useConsulta("avisos", {});
	const prefs = useConsulta("preferencias", {});
	return (0, import_react.useMemo)(() => {
		const items = muestras.datos?.items ?? [];
		return {
			items,
			pendientes: items.filter(esPendiente),
			planes: plan.datos?.items ?? [],
			avisos: avisos.datos?.items ?? [],
			ritmo: ritmoDe(prefs.datos),
			preferencias: prefs.datos,
			cargando: muestras.datos === void 0 && muestras.error === null,
			refrescando: muestras.refrescando,
			error: muestras.datos === void 0 ? muestras.error : null,
			listo: muestras.datos !== void 0,
			refrescar: () => {
				muestras.refrescar();
				plan.refrescar();
				avisos.refrescar();
			}
		};
	}, [
		muestras,
		plan,
		avisos,
		prefs
	]);
}
/**
* Textos visibles de los flujos de Muestras (español de México, vocabulario de 01 §1.5). Los textos exactos salen de
* 01 §4.4 (Agenda), §4.5 (Armar mi plan), §4.6 (Sesión de videos), §4.17 (Avisar a mis tiendas) y §4.16 (estados).
*/
var T = {
	muestras: "Muestras",
	volverMuestras: "Volver a Muestras",
	volverInicio: "Volver a Inicio",
	reintentar: "Reintentar",
	cargando: "Estamos trayendo tus datos de TikTok Shop…",
	cargandoLento: "Sigue cargando… revisa tu conexión",
	necesitaPcTitulo: "Necesita tu PC encendida",
	necesitaPcTexto: "Abre Corte en tu PC y conecta este celular al mismo Wi‑Fi para ver esta información.",
	errorTexto: "Revisa tu conexión e inténtalo de nuevo.",
	armarMiPlan: "Armar mi plan",
	armarMiPlanMinuto: "Armar mi plan · 1 min",
	rehacerMiPlan: "Rehacer mi plan",
	avisarMisTiendas: "Avisar a mis tiendas",
	empezarSesion: "Empezar sesión de videos",
	siguiente: "Siguiente",
	atras: "Atrás",
	cancelar: "Cancelar",
	despues: "Después",
	deshacer: "Deshacer",
	hoy: "Hoy",
	manana: "Mañana",
	agenda: "Agenda",
	agendaError: "No pudimos mostrar tu agenda",
	semana: "Semana",
	mes: "Mes",
	vistaAgenda: "Vista de la agenda",
	semanaAnterior: "Semana anterior",
	semanaSiguiente: "Semana siguiente",
	mesAnterior: "Mes anterior",
	mesSiguiente: "Mes siguiente",
	irAHoy: "Ir a hoy",
	sinFecha: "Sin fecha",
	sinFechaConteo: (n) => `Sin fecha (${formato.numero(n)})`,
	sinFechaAyuda: "Arrastra una muestra aquí para quitarle la fecha.",
	filtrar: "Filtrar",
	sinFechaVacio: "Todas tus pendientes ya tienen día.",
	sinVideos: "Sin videos",
	hoyEtiqueta: "Hoy",
	mananaEtiqueta: "Mañana",
	soltarAqui: "Suelta aquí",
	capacidadDia: (usados, capacidad) => `${formato.numero(usados)}/${formato.numero(capacidad)}`,
	capacidadAria: (dia, usados, capacidad) => `${dia}: ${formato.numero(usados)} de ${formato.numero(capacidad)} videos${usados > capacidad ? ", pasa tu capacidad" : ""}`,
	diaSinVideosAria: (dia) => `${dia}: no haces videos ese día`,
	contextoAgenda: (planeados, sinFecha) => `${cuenta(planeados, "video planeado", "videos planeados")} · ${formato.numero(sinFecha)} sin fecha`,
	agendaVaciaTitulo: "Tu agenda está vacía",
	agendaVaciaTexto: "Arma tu plan y repartimos tus muestras en los días que haces videos.",
	atrasados: (n) => `Tienes ${cuenta(n, "video atrasado", "videos atrasados")} de días anteriores.`,
	moverAHoy: "Mover a hoy",
	repartir: "Repartir en los próximos días",
	repartirRompe: (n, tienda) => `Esto pasa ${cuenta(n, "muestra")} después de lo que le prometiste a ${tienda}.`,
	repartirYPreparar: "Repartir y preparar mensajes",
	repartidas: (n) => `${cuenta(n, "video repartido", "videos repartidos")} en los próximos días`,
	movidasHoy: (n) => `${cuenta(n, "video movido", "videos movidos")} a hoy`,
	noCabeRepartir: "No hay lugar en tus próximos días de videos. Súbele la capacidad o agrega un día.",
	hacerVideosDia: (dia) => `¿Hacer videos el ${dia}?`,
	hacerVideosDiaTexto: "Ese día no está en tus días de videos. Lo movemos solo esta vez.",
	siHacerVideos: "Sí, hacer videos ese día",
	listaDelDia: (dia, n) => `${dia} · ${cuenta(n, "video")}`,
	diaVacio: "Nada planeado para este día.",
	diaPasadoVacio: "Sin videos planeados.",
	diaLibre: "No haces videos este día.",
	verDia: (dia, n) => `${dia}: ${cuenta(n, "video")}. Ver la lista`,
	semanaDe: "Días de la semana",
	mesDe: "Días del mes",
	pendientesSinFecha: "Pendientes sin fecha",
	planTitulo: "Armar mi plan",
	planContexto: "Reparte tus pendientes en fechas realistas y termina con una fecha que puedas prometer.",
	planContextoRehacer: "Vuelve a repartir tus pendientes sin pasar ninguna promesa.",
	planError: "No pudimos leer tus pendientes",
	pasos: "Pasos de Armar mi plan",
	pasoDe: (n, total) => `Paso ${n} de ${total}`,
	tuRitmo: "Tu ritmo",
	queIncluimos: "¿Qué incluimos?",
	revisaTuPlan: "Revisa tu plan",
	cuantosPorDia: "¿Cuántos videos puedes hacer por día?",
	queDias: "¿Qué días haces videos?",
	desdeCuando: "¿Desde cuándo?",
	otraFecha: "Otra fecha",
	empiezasEl: (f) => `Empiezas el ${f}`,
	quedanHoy: (n) => n > 0 ? `hoy te ${n === 1 ? "queda 1 lugar" : `quedan ${formato.numero(n)} lugares`}` : "hoy ya no te quedan lugares",
	yaPasaron6: "ya pasaron las 6:00 p. m., te sugerimos mañana",
	rehacerPregunta: "Ya tienes un plan. ¿Qué repartimos?",
	rehacerSoloSinFecha: "Solo las que no tienen fecha",
	rehacerSoloSinFechaAyuda: "Las que ya tienen día se quedan donde están.",
	rehacerTodo: "Repartir todo de nuevo",
	rehacerTodoAyuda: "Vuelve a acomodar todas, siempre respetando tus promesas.",
	respetarFechas: "Respetar las fechas que ya tienes",
	siemprePromesas: "Siempre se respetan las promesas que ya les hiciste a tus tiendas.",
	orden: "Orden",
	sugerido: "Sugerido",
	porTipo: "En lote por tipo de prenda",
	porTipoAyuda: "Junta las de la misma categoría en días seguidos.",
	sugeridoAyuda: "Primero las por vencer y las tiendas con las que ya vendes.",
	incluidasDe: (n, total) => `${formato.numero(n)} de ${formato.numero(total)} incluidas`,
	prioridad: (nivel, n) => `Prioridad ${nivel} (${formato.numero(n)})`,
	yaTieneFecha: (f) => `Ya tiene fecha: ${f}`,
	venceEl: (f) => `Vence el ${f}`,
	quitadasPregunta: (n) => `¿Qué hacemos con las ${formato.numero(n)} que quitaste?`,
	quitadaPregunta: "¿Qué hacemos con la que quitaste?",
	dejarlasDespues: "Dejarlas para después",
	dejarlaDespues: "Dejarla para después",
	noPuedoEstos: "No puedo hacer estos videos",
	noPuedoEste: "No puedo hacer este video",
	vistaPrevia: "Vista previa",
	ritmoTexto: (videos, capacidad, dias) => `${cuenta(videos, "video")} · ${formato.numero(capacidad)} por día · ${dias}`,
	terminasLargo: "Terminas el",
	publicaLargo: (f) => `Último video publicado a más tardar el ${f}`,
	sinVideosPlan: "No hay muestras incluidas",
	sinVideosPlanTexto: "Marca al menos una muestra en «¿Qué incluimos?».",
	sinDiasPlan: "Elige tus días de videos",
	sinDiasPlanTexto: "Marca al menos un día para repartir tus muestras.",
	todasConFecha: "Todas tus pendientes ya tienen día",
	todasConFechaTexto: "Elige «Repartir todo de nuevo» para volver a acomodarlas, siempre respetando tus promesas.",
	provisional: "Orden provisional: faltan tus ventas. Cuando lleguen, te propondremos reordenar sin cambiar tu fecha de término.",
	provisionalCorto: "Orden provisional: faltan tus ventas",
	noAlcanza: (producto, fecha) => `No alcanzas a hacer ${producto} antes de que venza el ${fecha}. Hazlo hoy o súbele la capacidad a ese día.`,
	rompePromesa: (n) => `${cuenta(n, "muestra")} ${n === 1 ? "quedaría" : "quedarían"} después de lo que prometiste.`,
	rompePromesaDetalle: (producto, tienda, promesa) => `${producto} · le prometiste a ${tienda} el ${promesa}`,
	crearMiPlan: "Crear mi plan",
	crearYPreparar: "Crear y preparar mensajes",
	calendarioPlan: "Tu plan día por día",
	videosPorDia: "Videos por día",
	maximoPorDia: (n) => `Máximo ${formato.numero(n)} por día · los días sin barra no haces videos`,
	primerosDias: "Tus primeros días",
	masVideos: (n) => `+${formato.numero(n)}`,
	creando: "Creando tu plan…",
	planListo: (termina, tiendas) => tiendas > 0 ? `Plan listo: terminas el ${termina}. Ahora avisa a tus ${cuenta(tiendas, "tienda")}.` : `Plan listo: terminas el ${termina}.`,
	planListoDetalle: (videos, publica) => `${cuenta(videos, "video planeado", "videos planeados")} · publicas a más tardar el ${publica}`,
	empiezasCon: (dia, n) => n === 1 ? `Empiezas ${dia} con esta` : `Empiezas ${dia} con estas ${formato.numero(n)}`,
	planDeshecho: "Deshicimos tu plan. Tus muestras quedaron como estaban.",
	planEnCola: "Se guardó en tu celular y se enviará a tu PC al reconectar.",
	planErrorCrear: "No pudimos crear tu plan. Inténtalo de nuevo.",
	dondeAvisar: "¿Desde dónde quieres avisar?",
	desdeCelular: "Desde mi celular",
	desdeCelularTexto: "Abre Corte en tu celular › Avisar a mis tiendas. La lista ya está ahí.",
	desdeEstaPc: "Desde esta PC",
	sinPendientesPlan: "No hay muestras para planear",
	sinPendientesPlanTexto: "Todas tus pendientes ya tienen el video hecho o no se pueden etiquetar.",
	verAgenda: "Ver mi agenda",
	sesionTitulo: "Sesión de videos",
	sesionContexto: (fecha) => `Una muestra a la vez · ${fecha}`,
	sesionError: "No pudimos preparar tu sesión",
	progresoSesion: (actual, total) => `${formato.numero(actual)} de ${formato.numero(total)}`,
	progresoSesionAria: (actual, total, listos) => `Muestra ${formato.numero(actual)} de ${formato.numero(total)} · ${cuenta(listos, "video listo", "videos listos")}`,
	nadaHoy: (n) => `No tienes nada planeado para hoy. ¿Hacemos las ${formato.numero(n)} siguientes de tu cola?`,
	nadaHoyUna: "No tienes nada planeado para hoy. ¿Hacemos la siguiente de tu cola?",
	siEmpezar: "Sí, empezar",
	planearPrimero: "Planear primero",
	nadaEnCola: "No hay videos por hacer",
	nadaEnColaTexto: "Todas tus pendientes ya tienen el video hecho. Márcalas como publicadas cuando las subas.",
	videoListo: "Video listo",
	saltar: "Saltar",
	abrirAppTikTok: "Abrir en la app de TikTok",
	abrirTikTokShop: "Abrir en TikTok Shop",
	verDescripcion: "Ver descripción del producto",
	antesDePublicar: "Antes de publicar",
	pasoVitrina: "Agrega el producto a tu vitrina",
	pasoVitrinaYaEsta: "El producto ya está en tu vitrina",
	pasoEtiqueta: "Etiquétalo al publicar",
	pasoEnlace: "Copia el enlace del video",
	tusNotas: "Tus notas para este video",
	atajoGuardar: "Guardar imagen",
	atajoCopiar: "Copiar datos",
	atajoGuardarLargo: "Guardar imagen del producto",
	atajoCopiarLargo: "Copiar datos para tu guion",
	notaArrastre: "Arrastra la foto directo a tu herramienta de IA: se lleva la imagen original.",
	sesionTerminada: "¡Sesión terminada!",
	sesionTerminadaListos: (n) => n === 0 ? "Esta vez no marcaste videos listos." : `Tienes ${cuenta(n, "video listo", "videos listos")}.`,
	sesionTerminadaTexto: "Cuando los publiques, márcalos y avísale a cada tienda.",
	videosListosSesion: "Videos listos en esta sesión",
	verListos: "Ver videos listos para publicar",
	hacerSaltadas: (n) => n === 1 ? "Hacer la que saltaste" : `Hacer las ${formato.numero(n)} que saltaste`,
	imagenGuardada: "Imagen guardada",
	imagenCompartida: "Imagen lista para compartir",
	imagenError: "No pudimos guardar la imagen",
	datosCopiados: "Datos copiados",
	datosCopiadosDetalle: "Pégalos en tu herramienta para el guion.",
	noSeCopio: "No pudimos copiar. Inténtalo de nuevo.",
	sinImagen: "Este producto no tiene foto para guardar",
	avisarTitulo: "Avisar a mis tiendas",
	avisarContexto: "Una tienda a la vez, con el mensaje ya armado.",
	tiendaDe: (actual, total) => `Tienda ${formato.numero(actual)} de ${formato.numero(total)}`,
	avisarError: "No pudimos preparar tus avisos",
	progresoAvisar: (actual, total) => `${formato.numero(actual)} de ${formato.numero(total)}`,
	avisadasDe: (n, total) => `${formato.numero(n)} de ${cuenta(total, "tienda")} avisadas`,
	notaPc: "Los mensajes se pegan en el chat con la tienda, que está en la app de TikTok. Si tu celular está emparejado, la lista ya está ahí: abre Corte › Avisar a mis tiendas.",
	seguirEnPc: "Seguir en esta PC",
	sinPlanTitulo: "Arma tu plan para darles fechas reales",
	sinPlanTexto: "Así cada mensaje lleva la fecha en que publicas, sin prometer de más.",
	armarPlanUnMinuto: "Armar mi plan · 1 min",
	elegirFechasMano: "Elegir fechas a mano",
	primerasTiendas: "Las primeras tiendas de tu lista",
	muestrasSinVideo: (n) => cuenta(n, "muestra sin video", "muestras sin video"),
	socio: "Socio",
	saltarTienda: "Saltar",
	despuesAvisar: "Después",
	listaTiendas: "Tiendas por avisar",
	tiendaAvisada: "Avisada",
	tiendaSaltada: "La saltaste",
	tiendaActual: "Tienda actual",
	avisadasTodasTitulo: "¡Avisaste a todas tus tiendas!",
	avisadasTodasTexto: "Te recordaremos un día antes de cada fecha que prometiste.",
	cierreAvisar: (n) => `¡Avisaste a tus ${cuenta(n, "tienda")}!`,
	faltanSaltadas: (n) => `Te ${n === 1 ? "falta 1 tienda" : `faltan ${cuenta(n, "tienda")}`} que saltaste.`,
	volverSaltadas: "Volver a las que salté",
	promesaVencida: "Promesa vencida",
	atajosAvisar: "Enter: Copiar · S: Sí, siguiente · →: Saltar",
	muestrasDeTienda: "Muestras de esta tienda"
};
/** Esqueleto genérico de un flujo: título de sección + filas con foto (la forma de las tarjetas de muestra). */
function EsqueletoFlujo(p) {
	const filas = Array.from({ length: p.filas ?? 5 }, (_, i) => i);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.cargandoLento,
		className: cx(flujos_module_default.esqueleto, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(flujos_module_default.cargandoTexto),
				children: T.cargando
			}),
			p.conFoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "foto",
				ancho: "100%",
				alto: 280
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "38%"
			}),
			filas.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(flujos_module_default.esqueletoFila),
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "foto",
					ancho: 56,
					alto: 56
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(flujos_module_default.esqueletoTextos),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "texto",
						ancho: `${72 - i % 3 * 12}%`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "texto",
						ancho: "44%"
					})]
				})]
			}, i))
		]
	});
}
/** Error sin datos. `necesita_pc` tiene su propio texto (Android sin la PC y la vista no se arma con la copia). */
function ErrorFlujo(p) {
	const necesita = p.error.codigo === "necesita_pc";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(flujos_module_default.estadoCentro),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: necesita ? "Monitor" : "CircleAlert",
			titulo: necesita ? T.necesitaPcTitulo : p.titulo,
			texto: necesita ? T.necesitaPcTexto : p.error.mensaje || T.errorTexto,
			accion: {
				etiqueta: T.reintentar,
				alPulsar: p.alReintentar
			}
		})
	});
}
var ICONO_TONO = {
	info: "Info",
	atencion: "CircleAlert",
	critico: "CircleAlert",
	neutro: "Info"
};
/** Aviso en línea con ícono + texto (nunca solo color) y acciones opcionales. */
function Aviso(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(flujos_module_default.aviso, p.className),
		"data-tono": p.tono,
		role: p.rol ?? "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(flujos_module_default.avisoIcono),
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: p.icono ?? ICONO_TONO[p.tono],
				tamano: 18
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(flujos_module_default.avisoCuerpo),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(flujos_module_default.avisoTexto),
				children: p.children
			}), p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(flujos_module_default.avisoAcciones),
				children: p.acciones
			}) : null]
		})]
	});
}
/** De OperacionPlan (@/dominio) a la op sin op_id que recibe acciones.lote (un solo Deshacer para todas). */
function aOpLocal(op) {
	return op.tipo === "plan.crear" ? {
		tipo: "plan.crear",
		datos: op.datos
	} : {
		tipo: "plan.editar",
		id: op.id,
		cambios: op.cambios
	};
}
/** Etapas que ocupan un lugar en un día (01 §4.5 regla 2: la capacidad cuenta lo ya planeado). */
var OCUPAN$1 = /* @__PURE__ */ new Set([
	"planeada",
	"video_listo",
	"programada"
]);
/** Promocionable = TikTok deja etiquetarlo (01 §2.3): las que no, van a su sección y no se planean solas. */
function promocionable(m) {
	return m.prioridad !== "no_se_puede_etiquetar";
}
/** Candidatas del paso 2: pendientes promocionables que aún no tienen el video hecho (por planear o planeadas). */
function candidatasPlan(pendientes) {
	return pendientes.filter((m) => promocionable(m) && (m.avance.etapa === "por_planear" || m.avance.etapa === "planeada"));
}
/** Ya hay plan si alguna pendiente tiene día (planeada, video listo o programada): la acción se llama «Rehacer mi plan». */
function hayPlan(pendientes) {
	return pendientes.some((m) => OCUPAN$1.has(m.avance.etapa) && m.avance.fecha_planeada !== null);
}
/**
* Por omisión (01 §4.5 paso 2): todas las pendientes promocionables sin fecha (hoy 32). Al rehacer y «Repartir todo
* de nuevo», también las planeadas. Devuelve los application_id incluidos en el orden de las candidatas.
*/
function incluidasPorOmision(candidatas, modo, quitadas) {
	return candidatas.filter((m) => !quitadas.has(m.application_id)).filter((m) => modo === "todo" || m.avance.etapa === "por_planear" || m.avance.fecha_planeada === null).map((m) => m.application_id);
}
/** Entrada de dominio.armarPlan con las promesas vigentes de cada muestra (sus avisos ya superpuestos). */
function entradaPlan(e) {
	const promesas = {};
	for (const m of e.pendientes) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
	return {
		muestras: e.pendientes,
		incluidas: e.incluidas,
		capacidad: Math.max(1, Math.min(10, Math.round(e.capacidad))),
		dias: e.dias,
		desde: e.desde,
		respetarFechas: e.respetarFechas,
		orden: e.orden,
		planes: e.planes,
		promesas,
		hoy: e.hoy
	};
}
/**
* Lugares que le quedan a `fecha` (capacidad − lo que ya ocupa ese día); 0 si ese día no se hacen videos. `repartir` =
* las que el plan va a volver a repartir («Repartir todo de nuevo»): no ocupan su día actual, porque se mueven.
*/
function lugaresLibres(fecha, capacidad, dias, muestras, repartir = /* @__PURE__ */ new Set()) {
	if (!dias.includes(diaSemana(fecha))) return 0;
	const ocupados = muestras.filter((m) => OCUPAN$1.has(m.avance.etapa) && m.avance.fecha_planeada === fecha && !repartir.has(m.application_id)).length;
	return Math.max(0, capacidad - ocupados);
}
/** Grupos por prioridad del paso 2 (urgente → baja), con las muestras en el orden de la cola. */
function gruposIncluir(candidatas) {
	const niveles = [
		"urgente",
		"alta",
		"media",
		"baja"
	];
	const porCola = [...candidatas].sort((a, b) => (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER));
	return niveles.map((nivel) => ({
		nivel,
		items: porCola.filter((m) => (m.prioridad ?? "baja") === nivel)
	})).filter((g) => g.items.length > 0);
}
var NOMBRE_DIA = [
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
	"domingo"
];
/** «de lunes a sábado» · «lunes, miércoles y viernes» · «todos los días» (0 = lunes). */
function textoDias(dias) {
	const orden = [...new Set(dias)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
	if (orden.length === 0) return "sin días de videos";
	if (orden.length === 7) return "todos los días";
	if (orden.every((d, i) => i === 0 || d === (orden[i - 1] ?? -2) + 1) && orden.length >= 3) return `de ${NOMBRE_DIA[orden[0] ?? 0]} a ${NOMBRE_DIA[orden[orden.length - 1] ?? 0]}`;
	const nombres = orden.map((d) => NOMBRE_DIA[d] ?? "");
	if (nombres.length === 1) return `los ${nombres[0]}`;
	return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}
/** «Terminas el mar 24 nov · publicas a más tardar el jue 26 nov» (01 §5.1 paso 1); null sin videos. */
function textoTermina(r) {
	if (r.termina === null || r.publica_a_mas_tardar === null) return null;
	return `Terminas el ${formato.fechaConDia(r.termina)} · publicas a más tardar el ${formato.fechaConDia(r.publica_a_mas_tardar)}`;
}
/** «32 videos · 3 por día · de lunes a sábado». */
function textoRitmo(videos, capacidad, dias) {
	return `${cuenta(videos, "video")} · ${formato.numero(capacidad)} por día · ${textoDias(dias)}`;
}
/** La primera sincronización todavía no trae las ventas de 180 días (antes del punto de control 2, C34). */
function ordenProvisional(estado) {
	if (!estado || estado.ultima_ok_at !== null) return false;
	const ordenes = estado.pasos.find((p) => p.paso === "ordenes");
	return ordenes === void 0 || ordenes.estado === "pendiente" || ordenes.estado === "en_curso";
}
/** Días del plan desde `desde` hasta la fecha de término (máximo 70), con su conteo y las muestras de cada uno. */
function diasDelPlan(r, desde, dias) {
	if (r.termina === null) return [];
	const porFecha = /* @__PURE__ */ new Map();
	for (const a of r.asignaciones) porFecha.set(a.fecha, [...porFecha.get(a.fecha) ?? [], a.application_id]);
	const salida = [];
	for (let f = desde, i = 0; f <= r.termina && i < 70; f = sumarDias(f, 1), i++) salida.push({
		fecha: f,
		n: r.por_dia[f] ?? 0,
		trabaja: dias.includes(diaSemana(f)),
		ids: porFecha.get(f) ?? []
	});
	return salida;
}
/** Semanas (lunes a domingo) que cubren los días del plan; las celdas fuera del rango van en null. */
function semanasDelPlan(diasPlan) {
	const primero = diasPlan[0];
	if (!primero) return [];
	const porFecha = new Map(diasPlan.map((d) => [d.fecha, d]));
	const ultimo = diasPlan[diasPlan.length - 1]?.fecha ?? primero.fecha;
	const semanas = [];
	for (let lunes = sumarDias(primero.fecha, -diaSemana(primero.fecha)); lunes <= ultimo; lunes = sumarDias(lunes, 7)) {
		const fila = [];
		for (let i = 0; i < 7; i++) fila.push(porFecha.get(sumarDias(lunes, i)) ?? null);
		semanas.push(fila);
	}
	return semanas;
}
/** Los primeros `n` días con videos asignados (la «lista de los primeros días» del paso 3). */
function primerosDias$1(r, n = 2) {
	const porFecha = /* @__PURE__ */ new Map();
	for (const a of r.asignaciones) porFecha.set(a.fecha, [...porFecha.get(a.fecha) ?? [], a.application_id]);
	return [...porFecha.keys()].sort().slice(0, n).map((fecha) => ({
		fecha,
		ids: porFecha.get(fecha) ?? []
	}));
}
var ESTADO_INICIAL = {
	paso: 1,
	capacidad: null,
	dias: null,
	modoDesde: null,
	desde: null,
	modoRehacer: "sin_fecha",
	orden: null,
	quitadas: [],
	preguntarQuitadas: false
};
function reducirAsistente(e, a) {
	switch (a.tipo) {
		case "capacidad": return {
			...e,
			capacidad: Math.max(1, Math.min(10, Math.round(a.valor)))
		};
		case "dias": return {
			...e,
			dias: [...new Set(a.valor)].filter((d) => d >= 0 && d <= 6).sort((x, y) => x - y)
		};
		case "desde": return {
			...e,
			modoDesde: a.modo,
			desde: a.fecha
		};
		case "rehacer": return {
			...e,
			modoRehacer: a.modo
		};
		case "orden": return {
			...e,
			orden: a.valor
		};
		case "incluir": {
			const s = new Set(e.quitadas);
			for (const id of a.ids) if (a.incluir) s.delete(id);
			else s.add(id);
			return {
				...e,
				quitadas: [...s],
				preguntarQuitadas: false
			};
		}
		case "siguiente":
			if (e.paso === 1) return {
				...e,
				paso: 2
			};
			if (e.paso === 2) {
				if (e.quitadas.length > 0 && !e.preguntarQuitadas) return {
					...e,
					preguntarQuitadas: true
				};
				return {
					...e,
					paso: 3,
					preguntarQuitadas: false
				};
			}
			return e;
		case "dejarDespues": return e.paso === 2 ? {
			...e,
			paso: 3,
			preguntarQuitadas: false
		} : e;
		case "atras": return {
			...e,
			paso: e.paso === 3 ? 2 : 1,
			preguntarQuitadas: false
		};
		case "ir": return a.paso < e.paso ? {
			...e,
			paso: a.paso,
			preguntarQuitadas: false
		} : e;
	}
}
/** Desde efectivo: lo elegido o, por omisión, dominio.desdePorOmision («Hoy» antes de las 6 p. m.; si no, mañana). */
function desdeEfectivo(e, hoy, omision) {
	if (e.modoDesde === "hoy") return hoy;
	if (e.modoDesde === "manana") return sumarDias(hoy, 1);
	if (e.modoDesde === "otra" && e.desde !== null) return e.desde < hoy ? hoy : e.desde;
	return omision;
}
/** Valor del segmentado «¿Desde cuándo?» para el desde efectivo. */
function modoDeDesde(e, desde, hoy) {
	if (e.modoDesde === "otra") return "otra";
	if (desde === hoy) return "hoy";
	if (desde === sumarDias(hoy, 1)) return "manana";
	return "otra";
}
function motivoVacio(dias, modo, candidatas, incluidas) {
	if (dias.length === 0) return "sin_dias";
	if (incluidas > 0) return null;
	if (modo === "sin_fecha" && candidatas.length > 0 && candidatas.every((m) => m.avance.fecha_planeada !== null)) return "todas_con_fecha";
	return "sin_incluidas";
}
/** Al abrir «Rehacer mi plan» sin ninguna candidata sin fecha, la opción útil es «Repartir todo de nuevo». */
function modoRehacerInicial(candidatas) {
	return candidatas.length > 0 && candidatas.every((m) => m.avance.fecha_planeada !== null) ? "todo" : "sin_fecha";
}
/** Se puede pasar del paso actual: con días de videos (paso 1) y con al menos una incluida (paso 2). */
function puedeSeguir(e, dias, incluidas) {
	if (e.paso === 1) return dias.length > 0 && incluidas > 0;
	if (e.paso === 2) return incluidas > 0;
	return incluidas > 0;
}
/** Cambios de preferencias que se recuerdan al crear (ritmo de 01 §4.5): solo lo que cambió. */
function cambiosRitmo(actual, elegido) {
	const salida = {};
	if (elegido.capacidad !== actual.capacidad) salida.capacidad_videos_dia = elegido.capacidad;
	if ([...elegido.dias].sort().join(",") !== [...actual.dias].sort().join(",")) salida.dias_videos = [...elegido.dias].sort((a, b) => a - b);
	if (elegido.orden !== actual.orden) salida.orden_plan = elegido.orden;
	return salida;
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
/** Etapas que ocupan lugar en un día (la capacidad las cuenta). */
var OCUPAN = /* @__PURE__ */ new Set([
	"planeada",
	"video_listo",
	"programada"
]);
function dia(f) {
	return Number(f.slice(8, 10));
}
function mes$1(f) {
	return MESES[Number(f.slice(5, 7)) - 1] ?? "";
}
function anio(f) {
	return f.slice(0, 4);
}
function lunesDe(f) {
	return sumarDias(f, -diaSemana(f));
}
function diasDeSemana(lunes) {
	return Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
}
/** «Semana del 9 al 15 de noviembre» · «Semana del 30 de noviembre al 6 de diciembre» · con año si cambia. */
function textoSemana(lunes) {
	const domingo = sumarDias(lunes, 6);
	if (anio(lunes) !== anio(domingo)) return `Semana del ${dia(lunes)} de ${mes$1(lunes)} de ${anio(lunes)} al ${dia(domingo)} de ${mes$1(domingo)} de ${anio(domingo)}`;
	if (mes$1(lunes) !== mes$1(domingo)) return `Semana del ${dia(lunes)} de ${mes$1(lunes)} al ${dia(domingo)} de ${mes$1(domingo)}`;
	return `Semana del ${dia(lunes)} al ${dia(domingo)} de ${mes$1(lunes)}`;
}
/** «Noviembre de 2026». */
function textoMes(f) {
	return capitalizar(`${mes$1(f)} de ${anio(f)}`);
}
function primeroDelMes(f) {
	return `${f.slice(0, 7)}-01`;
}
/** Semanas (lunes a domingo) que cubren el mes de `f`. */
function semanasDelMes(f) {
	const primero = primeroDelMes(f);
	const clave = primero.slice(0, 7);
	const semanas = [];
	let lunes = lunesDe(primero);
	for (let i = 0; i < 6; i++, lunes = sumarDias(lunes, 7)) {
		const semana = diasDeSemana(lunes);
		if (!semana.some((d) => d.slice(0, 7) === clave)) break;
		semanas.push(semana);
	}
	return semanas;
}
/** Mes siguiente o anterior (primer día). */
function moverMes(f, delta) {
	const a = Number(f.slice(0, 4));
	const m = Number(f.slice(5, 7)) - 1 + delta;
	const anioNuevo = a + Math.floor(m / 12);
	const mesNuevo = (m % 12 + 12) % 12;
	return `${anioNuevo}-${String(mesNuevo + 1).padStart(2, "0")}-01`;
}
/** «Hoy · jue 12 nov» · «Mañana · vie 13 nov» · «Sáb 14 nov». */
function etiquetaDia$1(f, hoy) {
	if (f === hoy) return `Hoy · ${formato.fechaConDia(f)}`;
	if (f === sumarDias(hoy, 1)) return `Mañana · ${formato.fechaConDia(f)}`;
	return capitalizar(formato.fechaConDia(f));
}
/** Va en la agenda: tiene día y no está por planear ni descartada. */
function enAgenda(m) {
	return m.avance.fecha_planeada !== null && m.avance.etapa !== "por_planear" && m.avance.etapa !== "no_se_puede";
}
function porCola$1(a, b) {
	return (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER) || (a.application_id < b.application_id ? -1 : 1);
}
/** Muestras de cada día (en el orden de la cola). */
function agruparPorDia(items) {
	const salida = /* @__PURE__ */ new Map();
	for (const m of [...items].filter(enAgenda).sort(porCola$1)) {
		const f = m.avance.fecha_planeada;
		if (f === null) continue;
		salida.set(f, [...salida.get(f) ?? [], m]);
	}
	return salida;
}
function ocupacionDia(fecha, lista, capacidad, dias) {
	const usados = (lista ?? []).filter((m) => OCUPAN.has(m.avance.etapa)).length;
	return {
		usados,
		capacidad,
		trabaja: dias.includes(diaSemana(fecha)),
		excedido: usados > capacidad
	};
}
/** «Sin fecha»: pendientes por planear, en el orden de la cola. */
function sinFecha$1(pendientes) {
	return pendientes.filter((m) => m.avance.etapa === "por_planear" || m.avance.etapa === "planeada" && m.avance.fecha_planeada === null).sort(porCola$1);
}
/** Atrasadas: planeadas para un día que ya pasó y sin avanzar (01 §4.4). */
function atrasadas(pendientes, hoy) {
	return pendientes.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada !== null && m.avance.fecha_planeada < hoy).sort(porCola$1);
}
/** Solo se arrastra lo que aún no tiene el video hecho (mover una «video listo» la regresaría a planeada). */
function sePuedeMover(m) {
	return m.avance.etapa === "planeada" || m.avance.etapa === "por_planear";
}
/** `hoy`: un día que ya pasó no recibe tarjetas (se volvería atrasada al soltarla). */
function decidirSoltar(m, destino, dias, hoy) {
	if (!sePuedeMover(m)) return { tipo: "nada" };
	if (destino === "sin_fecha") return m.avance.fecha_planeada === null ? { tipo: "nada" } : { tipo: "quitar_fecha" };
	if (destino === m.avance.fecha_planeada || destino < hoy) return { tipo: "nada" };
	if (!dias.includes(diaSemana(destino))) return {
		tipo: "confirmar_dia",
		fecha: destino
	};
	return {
		tipo: "planear",
		fecha: destino
	};
}
/** «Mover a hoy»: todas a hoy (decisión explícita, aunque pase la capacidad). */
function opsMoverAHoy(lista, hoy) {
	return lista.map((m) => opCambioEtapa(m, "planeada", { fecha_plan: hoy }, hoy));
}
/** «Repartir en los próximos días»: las atrasadas desde hoy con dominio.armarPlan (capacidad, días y promesas). */
function repartirAtrasadas(e) {
	return armarPlan(entradaPlan({
		pendientes: e.pendientes,
		incluidas: e.lista.map((m) => m.application_id),
		capacidad: e.capacidad,
		dias: e.dias,
		desde: e.hoy,
		respetarFechas: false,
		orden: e.orden,
		planes: e.planes,
		hoy: e.hoy
	}));
}
var Agenda_module_default = {
	navegacion: "_navegacion_5p3cu_4",
	flechas: "_flechas_5p3cu_11",
	periodo: "_periodo_5p3cu_16",
	segmentado: "_segmentado_5p3cu_26",
	tira: "_tira_5p3cu_31",
	tiraDia: "_tiraDia_5p3cu_39",
	tiraHoy: "_tiraHoy_5p3cu_65",
	tiraLibre: "_tiraLibre_5p3cu_69",
	tiraLetra: "_tiraLetra_5p3cu_73",
	tiraNumero: "_tiraNumero_5p3cu_79",
	tiraBarra: "_tiraBarra_5p3cu_89",
	tiraConteo: "_tiraConteo_5p3cu_93",
	tiraSin: "_tiraSin_5p3cu_94",
	tiraExcedido: "_tiraExcedido_5p3cu_106",
	semana: "_semana_5p3cu_112",
	sinFecha: "_sinFecha_5p3cu_119",
	sinFechaDestino: "_sinFechaDestino_5p3cu_132",
	sinFechaCabeza: "_sinFechaCabeza_5p3cu_136",
	sinFechaTitulo: "_sinFechaTitulo_5p3cu_142",
	tarjetasSinFecha: "_tarjetasSinFecha_5p3cu_149",
	ayudaSinFecha: "_ayudaSinFecha_5p3cu_154",
	dias: "_dias_5p3cu_162",
	banda: "_banda_5p3cu_168",
	bandaHoy: "_bandaHoy_5p3cu_180",
	bandaLibre: "_bandaLibre_5p3cu_184",
	bandaPasada: "_bandaPasada_5p3cu_189",
	bandaNumero: "_bandaNumero_5p3cu_189",
	bandaDestino: "_bandaDestino_5p3cu_192",
	bandaCabeza: "_bandaCabeza_5p3cu_196",
	bandaTextos: "_bandaTextos_5p3cu_215",
	bandaSemana: "_bandaSemana_5p3cu_222",
	capacidad: "_capacidad_5p3cu_232",
	sinVideos: "_sinVideos_5p3cu_235",
	tarjetas: "_tarjetas_5p3cu_149",
	item: "_item_5p3cu_252",
	itemArrastrable: "_itemArrastrable_5p3cu_255",
	itemArrastrando: "_itemArrastrando_5p3cu_261",
	vacio: "_vacio_5p3cu_264",
	bandaVacia: "_bandaVacia_5p3cu_283",
	diasArrastrando: "_diasArrastrando_5p3cu_314",
	vacia: "_vacia_5p3cu_321",
	vaciaEstado: "_vaciaEstado_5p3cu_326",
	vaciaTira: "_vaciaTira_5p3cu_329",
	fotos: "_fotos_5p3cu_340",
	mes: "_mes_5p3cu_359",
	mesFila: "_mesFila_5p3cu_364",
	mesCabeza: "_mesCabeza_5p3cu_369",
	mesLetra: "_mesLetra_5p3cu_372",
	mesCeldaEnvoltura: "_mesCeldaEnvoltura_5p3cu_378",
	mesCelda: "_mesCelda_5p3cu_378",
	mesFuera: "_mesFuera_5p3cu_403",
	mesLibre: "_mesLibre_5p3cu_406",
	mesHoy: "_mesHoy_5p3cu_410",
	mesNumero: "_mesNumero_5p3cu_414",
	mesContenido: "_mesContenido_5p3cu_422",
	mesPuntos: "_mesPuntos_5p3cu_428",
	mesPunto: "_mesPunto_5p3cu_428",
	mesConteo: "_mesConteo_5p3cu_449",
	mesExcedido: "_mesExcedido_5p3cu_455",
	mesSin: "_mesSin_5p3cu_458",
	sinFechaMovil: "_sinFechaMovil_5p3cu_465",
	plegable: "_plegable_5p3cu_470",
	girado: "_girado_5p3cu_489",
	fab: "_fab_5p3cu_492"
};
/**
* #/muestras/agenda · Agenda (01 §4.4). Semana (por omisión) y Mes. Cada día con su capacidad «2/3» (en rojo si se
* excede: «4/3»), los días sin videos atenuados con «Sin videos», «Sin fecha ({n})» y la protección de promesas al
* mover (useControlMuestra.planear abre «Le prometiste a {tienda}…» [Mover y preparar mensaje]).
* Escritorio: columna «Sin fecha» con filtro a la izquierda y los 7 días en bandas; se arrastra entre días (soltar en
* «Sin fecha» quita la fecha; soltar en un día sin videos pregunta «¿Hacer videos el domingo?»).
* Celular: tira semanal arriba, lista por día con encabezados fijos, «Sin fecha ({n})» plegable al final; mover = ⋯ ›
* «Cambiar fecha» (no se arrastra) y un botón flotante «Armar mi plan» o «Avisar a mis tiendas».
* Atrasadas: «Tienes {2} videos atrasados de días anteriores.» [Mover a hoy] [Repartir en los próximos días].
*/
var FECHA = /^\d{4}-\d{2}-\d{2}$/;
var LETRAS$1 = [
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
	"D"
];
function PantallaAgenda() {
	const datos = useDatosTrabajo();
	const control = useControlMuestra();
	const acciones = useAcciones();
	const toast = useToast();
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const movil = clase === "compacta";
	const hoy = hoyLocal();
	const [semanaParam, setSemana] = useParametro("semana");
	const [vistaParam, setVista] = useParametro("vista");
	const vista = vistaParam === "mes" && !movil ? "mes" : "semana";
	const ancla = semanaParam !== null && FECHA.test(semanaParam) ? semanaParam : hoy;
	const lunes = lunesDe(ancla);
	const dias = diasDeSemana(lunes);
	const [arrastrando, setArrastrando] = (0, import_react.useState)(null);
	const [destino, setDestino] = (0, import_react.useState)(null);
	const [confirmarDia, setConfirmarDia] = (0, import_react.useState)(null);
	const [diaAbierto, setDiaAbierto] = (0, import_react.useState)(null);
	const [reparto, setReparto] = (0, import_react.useState)(null);
	const [filtro, setFiltro] = (0, import_react.useState)("");
	const [sinFechaAbierta, setSinFechaAbierta] = (0, import_react.useState)(false);
	const porDia = (0, import_react.useMemo)(() => agruparPorDia(datos.items), [datos.items]);
	const listaSinFecha = (0, import_react.useMemo)(() => sinFecha$1(datos.pendientes), [datos.pendientes]);
	const filtradas = (0, import_react.useMemo)(() => listaSinFecha.filter((m) => coincide(filtro, nombreDe(m.producto), m.tienda.nombre, m.variante)), [listaSinFecha, filtro]);
	const listaAtrasadas = (0, import_react.useMemo)(() => atrasadas(datos.pendientes, hoy), [datos.pendientes, hoy]);
	const porId = (0, import_react.useMemo)(() => new Map(datos.items.map((m) => [m.application_id, m])), [datos.items]);
	const conteo = (0, import_react.useMemo)(() => contarTrabajo(datos.pendientes, datos.avisos, hoy), [
		datos.pendientes,
		datos.avisos,
		hoy
	]);
	const planeados = (0, import_react.useMemo)(() => datos.pendientes.filter((m) => m.avance.fecha_planeada !== null && m.avance.etapa !== "por_planear").length, [datos.pendientes]);
	const ocupacion = (f) => ocupacionDia(f, porDia.get(f), datos.ritmo.capacidad, datos.ritmo.dias);
	const conPlan = hayPlan(datos.pendientes);
	const avisarLote = (r, texto) => {
		if (r.estado === "error" || r.estado === "conflicto") {
			toast.mostrar({
				texto: r.resultados.find((x) => x.error)?.error ?? T.errorTexto,
				tono: "error"
			});
			return false;
		}
		toast.mostrar({
			texto,
			tono: "ok",
			...r.estado === "en_cola" ? { detalle: T.planEnCola } : {},
			accion: {
				etiqueta: T.deshacer,
				alPulsar: () => void r.deshacer()
			},
			duracion_ms: 6e3
		});
		return true;
	};
	const aplicar = async (ops, texto) => {
		if (ops.length === 0) return true;
		return avisarLote(await acciones.lote(ops.map(aOpLocal)), texto);
	};
	const moverAHoy = () => void aplicar(opsMoverAHoy(listaAtrasadas, hoy), T.movidasHoy(listaAtrasadas.length));
	const repartir = () => {
		const r = repartirAtrasadas({
			pendientes: datos.pendientes,
			lista: listaAtrasadas,
			capacidad: datos.ritmo.capacidad,
			dias: datos.ritmo.dias,
			orden: datos.ritmo.orden,
			planes: datos.planes,
			hoy
		});
		if (r.asignaciones.length === 0) {
			toast.mostrar({
				texto: T.noCabeRepartir,
				tono: "info"
			});
			return;
		}
		if (r.rompe_promesa.length > 0) setReparto(r);
		else aplicar(opsDePlan(r, datos.pendientes, datos.planes), T.repartidas(r.asignaciones.length));
	};
	const confirmarReparto = async () => {
		const r = reparto;
		if (!r) return;
		setReparto(null);
		const ok = await aplicar(opsDePlan(r, datos.pendientes, datos.planes), T.repartidas(r.asignaciones.length));
		const primera = r.rompe_promesa[0];
		const m = primera ? porId.get(primera.application_id) : void 0;
		if (ok && m) navegar(`/muestras/agenda?mensaje=${encodeURIComponent(`t:${m.tienda.tienda_key}`)}&plantilla=nueva_fecha`);
	};
	const soltar = (id, lugar) => {
		const m = porId.get(id);
		if (!m) return;
		const d = decidirSoltar(m, lugar, datos.ritmo.dias, hoy);
		if (d.tipo === "quitar_fecha") control.cambiarEtapa(m, "por_planear");
		else if (d.tipo === "confirmar_dia") setConfirmarDia({
			m,
			fecha: d.fecha
		});
		else if (d.tipo === "planear") control.planear(m, d.fecha);
	};
	const arrastrable = !movil && !android;
	const zona = (lugar) => arrastrable ? {
		onDragOver: (ev) => {
			if (!arrastrando) return;
			ev.preventDefault();
			ev.dataTransfer.dropEffect = "move";
			if (destino !== lugar) setDestino(lugar);
		},
		onDragLeave: (ev) => {
			if (ev.currentTarget.contains(ev.relatedTarget)) return;
			if (destino === lugar) setDestino(null);
		},
		onDrop: (ev) => {
			ev.preventDefault();
			const id = ev.dataTransfer.getData("text/plain") || arrastrando;
			setDestino(null);
			setArrastrando(null);
			if (id) soltar(id, lugar);
		}
	} : {};
	const tarjeta = (m) => {
		const mueve = arrastrable && sePuedeMover(m);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: cx(Agenda_module_default.item, mueve && Agenda_module_default.itemArrastrable, arrastrando === m.application_id && Agenda_module_default.itemArrastrando),
			"data-muestra": m.application_id,
			...mueve ? {
				draggable: true,
				onDragStart: (ev) => {
					ev.dataTransfer.setData("text/plain", m.application_id);
					ev.dataTransfer.effectAllowed = "move";
					setArrastrando(m.application_id);
				},
				onDragEnd: () => {
					setArrastrando(null);
					setDestino(null);
				}
			} : {},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
				muestra: m,
				variante: "agenda",
				alAbrir: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)
			})
		}, m.application_id);
	};
	const irSemana = (delta) => setSemana(delta === 0 ? null : sumarDias(lunes, delta * 7), { reemplazar: true });
	const irMes = (delta) => setSemana(moverMes(primeroDelMes(ancla), delta), { reemplazar: true });
	const navegacion = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Agenda_module_default.navegacion),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Agenda_module_default.flechas),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
						icono: "ChevronLeft",
						etiqueta: vista === "mes" ? T.mesAnterior : T.semanaAnterior,
						variante: "secundario",
						alPulsar: () => vista === "mes" ? irMes(-1) : irSemana(-1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						alPulsar: () => setSemana(null, { reemplazar: true }),
						"aria-label": T.irAHoy,
						children: T.hoy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
						icono: "ChevronRight",
						etiqueta: vista === "mes" ? T.mesSiguiente : T.semanaSiguiente,
						variante: "secundario",
						alPulsar: () => vista === "mes" ? irMes(1) : irSemana(1)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cx(Agenda_module_default.periodo),
				"aria-live": "polite",
				children: vista === "mes" ? textoMes(ancla) : textoSemana(lunes)
			}),
			movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
				etiqueta: T.vistaAgenda,
				valor: vista,
				alCambiar: (v) => setVista(v === "mes" ? "mes" : null, { reemplazar: true }),
				opciones: [{
					valor: "semana",
					etiqueta: T.semana
				}, {
					valor: "mes",
					etiqueta: T.mes
				}],
				className: cx(Agenda_module_default.segmentado)
			})
		]
	});
	const avisoAtrasadas = listaAtrasadas.length > 0 ? reparto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		icono: "CalendarClock",
		rol: "alert",
		acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "sm",
			icono: "MessageCircle",
			alPulsar: () => void confirmarReparto(),
			children: T.repartirYPreparar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			tamano: "sm",
			alPulsar: () => setReparto(null),
			children: T.cancelar
		})] }),
		children: T.repartirRompe(reparto.rompe_promesa.length, porId.get(reparto.rompe_promesa[0]?.application_id ?? "")?.tienda.nombre ?? T.muestras)
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
		tono: "atencion",
		icono: "History",
		acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			alPulsar: moverAHoy,
			children: T.moverAHoy
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			alPulsar: repartir,
			children: T.repartir
		})] }),
		children: T.atrasados(listaAtrasadas.length)
	}) : null;
	const tira = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: cx(Agenda_module_default.tira),
		"aria-label": T.semanaDe,
		children: dias.map((f, i) => {
			const o = ocupacion(f);
			const nombre = formato.fechaConDia(f);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cx(Agenda_module_default.tiraDia, f === hoy && Agenda_module_default.tiraHoy, !o.trabaja && Agenda_module_default.tiraLibre, o.excedido && Agenda_module_default.tiraExcedido),
				"aria-label": o.trabaja ? T.capacidadAria(nombre, o.usados, o.capacidad) : o.usados > 0 ? T.capacidadAria(nombre, o.usados, 0) : T.diaSinVideosAria(nombre),
				onClick: () => document.getElementById(`agenda-dia-${f}`)?.scrollIntoView?.({
					behavior: "smooth",
					block: "start"
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Agenda_module_default.tiraLetra),
						"aria-hidden": "true",
						children: LETRAS$1[i]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Agenda_module_default.tiraNumero),
						"aria-hidden": "true",
						children: Number(f.slice(8))
					}),
					o.trabaja ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraProgreso, {
						valor: Math.min(1, o.usados / Math.max(1, o.capacidad)),
						etiqueta: T.capacidadAria(nombre, o.usados, o.capacidad),
						className: cx(Agenda_module_default.tiraBarra)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Agenda_module_default.tiraConteo),
						"aria-hidden": "true",
						children: T.capacidadDia(o.usados, o.capacidad)
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Agenda_module_default.tiraSin),
						"aria-hidden": "true",
						children: o.usados > 0 ? formato.numero(o.usados) : "—"
					})
				]
			}) }, f);
		})
	});
	const capacidadChip = (o) => o.trabaja || o.usados > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: o.excedido || !o.trabaja && o.usados > 0 ? "critico" : o.usados >= o.capacidad ? "marca" : "neutro",
		className: cx(Agenda_module_default.capacidad),
		children: T.capacidadDia(o.usados, o.trabaja ? o.capacidad : 0)
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Agenda_module_default.sinVideos),
		children: T.sinVideos
	});
	const bandas = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Agenda_module_default.dias, arrastrando !== null && Agenda_module_default.diasArrastrando),
		children: dias.map((f) => {
			const lista = porDia.get(f) ?? [];
			const o = ocupacion(f);
			const pasado = f < hoy;
			const vacia = lista.length === 0;
			if (vacia && pasado && movil) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: `agenda-dia-${f}`,
				className: cx(Agenda_module_default.banda, f === hoy && Agenda_module_default.bandaHoy, !o.trabaja && Agenda_module_default.bandaLibre, pasado && Agenda_module_default.bandaPasada, vacia && Agenda_module_default.bandaVacia, destino === f && Agenda_module_default.bandaDestino),
				"aria-label": `${etiquetaDia$1(f, hoy)}: ${o.trabaja ? T.capacidadDia(o.usados, o.capacidad) : T.sinVideos}`,
				"data-fecha": f,
				...pasado ? {} : zona(f),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: cx(Agenda_module_default.bandaCabeza),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Agenda_module_default.bandaNumero),
						"aria-hidden": "true",
						children: Number(f.slice(8))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cx(Agenda_module_default.bandaTextos),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Agenda_module_default.bandaSemana),
							children: movil ? etiquetaDia$1(f, hoy) : f === hoy ? `${T.hoyEtiqueta} · ${formato.fechaConDia(f)}` : capitalizar(formato.fechaConDia(f))
						}), capacidadChip(o)]
					})]
				}), lista.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Agenda_module_default.tarjetas),
					children: lista.map(tarjeta)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Agenda_module_default.vacio),
					children: arrastrando && !pasado ? T.soltarAqui : pasado ? T.diaPasadoVacio : o.trabaja ? T.diaVacio : T.diaLibre
				})]
			}, f);
		})
	});
	const columnaSinFecha = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cx(Agenda_module_default.sinFecha, destino === "sin_fecha" && Agenda_module_default.sinFechaDestino),
		"aria-label": T.pendientesSinFecha,
		...zona("sin_fecha"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cx(Agenda_module_default.sinFechaCabeza),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: cx(Agenda_module_default.sinFechaTitulo),
					children: T.sinFechaConteo(listaSinFecha.length)
				}), listaSinFecha.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T.sinFecha,
					etiquetaOculta: true,
					tipo: "search",
					placeholder: T.filtrar,
					valor: filtro,
					alCambiar: setFiltro
				}) : null]
			}),
			filtradas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(Agenda_module_default.tarjetas, Agenda_module_default.tarjetasSinFecha),
				children: filtradas.map(tarjeta)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Agenda_module_default.vacio),
				children: listaSinFecha.length === 0 ? T.sinFechaVacio : T.sinFechaAyuda
			}),
			listaSinFecha.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Agenda_module_default.ayudaSinFecha),
				children: T.sinFechaAyuda
			}) : null
		]
	});
	let cuerpo;
	if (!datos.listo) cuerpo = datos.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorFlujo, {
		error: datos.error,
		titulo: T.agendaError,
		alReintentar: datos.refrescar
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, { filas: 5 });
	else if (porDia.size === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Agenda_module_default.vacia),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(flujos_module_default.estadoCentro, Agenda_module_default.vaciaEstado),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
				icono: "CalendarDays",
				titulo: T.agendaVaciaTitulo,
				texto: T.agendaVaciaTexto,
				accion: {
					etiqueta: T.armarMiPlan,
					alPulsar: () => navegar("/muestras/plan")
				}
			})
		}), listaSinFecha.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: cx(Agenda_module_default.vaciaTira),
			"aria-label": T.pendientesSinFecha,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: cx(Agenda_module_default.sinFechaTitulo),
				children: T.sinFechaConteo(listaSinFecha.length)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(Agenda_module_default.fotos),
				children: listaSinFecha.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
					muestra: m,
					variante: "tira",
					alAbrir: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)
				}) }, m.application_id))
			})]
		}) : null]
	});
	else if (vista === "mes") cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		navegacion,
		avisoAtrasadas,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaMes, {
			ancla,
			hoy,
			porDia,
			capacidad: datos.ritmo.capacidad,
			dias: datos.ritmo.dias,
			alAbrir: setDiaAbierto
		})
	] });
	else if (movil) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		navegacion,
		tira,
		avisoAtrasadas,
		bandas,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: cx(Agenda_module_default.sinFechaMovil),
			"aria-label": T.pendientesSinFecha,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cx(Agenda_module_default.plegable),
				"aria-expanded": sinFechaAbierta,
				onClick: () => setSinFechaAbierta((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.sinFechaConteo(listaSinFecha.length) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronDown",
					tamano: 18,
					className: cx(sinFechaAbierta && Agenda_module_default.girado)
				})]
			}), sinFechaAbierta ? listaSinFecha.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(Agenda_module_default.tarjetas),
				children: listaSinFecha.map(tarjeta)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Agenda_module_default.vacio),
				children: T.sinFechaVacio
			}) : null]
		})
	] });
	else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		navegacion,
		avisoAtrasadas,
		tira,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Agenda_module_default.semana),
			children: [columnaSinFecha, bandas]
		})
	] });
	const fab = movil && datos.listo && porDia.size > 0 ? !conPlan ? "plan" : conteo.tiendas_por_avisar > 0 ? "avisar" : null : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo: T.agenda,
		lista: datos.listo,
		className: cx(flujos_module_default.pantalla, datos.refrescando && flujos_module_default.refrescando),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
				titulo: T.agenda,
				contexto: datos.listo ? T.contextoAgenda(planeados, listaSinFecha.length) : T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PestanasMuestras, { activa: "agenda" }),
			cuerpo,
			fab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraFija, {
				etiqueta: fab === "plan" ? T.armarMiPlan : T.avisarMisTiendas,
				className: cx(Agenda_module_default.fab),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: fab === "plan" ? "CalendarDays" : "MessageCircle",
					alPulsar: () => navegar(fab === "plan" ? "/muestras/plan" : "/muestras/avisos"),
					children: fab === "plan" ? T.armarMiPlan : T.avisarMisTiendas
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: confirmarDia !== null,
				titulo: confirmarDia ? T.hacerVideosDia(formato.fechaLarga(confirmarDia.fecha).split(" ")[0] ?? "") : "",
				descripcion: T.hacerVideosDiaTexto,
				ancho: 440,
				alCerrar: () => setConfirmarDia(null),
				pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					alPulsar: () => setConfirmarDia(null),
					children: T.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					alPulsar: () => {
						const c = confirmarDia;
						setConfirmarDia(null);
						if (c) control.planear(c.m, c.fecha);
					},
					children: T.siHacerVideos
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				abierto: diaAbierto !== null,
				titulo: diaAbierto ? T.listaDelDia(etiquetaDia$1(diaAbierto, hoy), (porDia.get(diaAbierto) ?? []).length) : "",
				ancho: 560,
				completoEnCompacta: true,
				alCerrar: () => setDiaAbierto(null),
				children: diaAbierto && (porDia.get(diaAbierto) ?? []).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Agenda_module_default.tarjetas),
					children: (porDia.get(diaAbierto) ?? []).map(tarjeta)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Agenda_module_default.vacio),
					children: T.diaVacio
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservaCapas, {})
		]
	});
}
/** Vista Mes (01 §4.4): puntos por día con el número de videos; clic en un día = ventana con la lista. */
function VistaMes(p) {
	const semanas = semanasDelMes(p.ancla);
	const clave = p.ancla.slice(0, 7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Agenda_module_default.mes),
		role: "grid",
		"aria-label": T.mesDe,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Agenda_module_default.mesFila, Agenda_module_default.mesCabeza),
			role: "row",
			children: LETRAS$1.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				role: "columnheader",
				className: cx(Agenda_module_default.mesLetra),
				children: l
			}, `${l}${i}`))
		}), semanas.map((semana) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Agenda_module_default.mesFila),
			role: "row",
			children: semana.map((f) => {
				const lista = p.porDia.get(f) ?? [];
				const o = ocupacionDia(f, lista, p.capacidad, p.dias);
				const fuera = f.slice(0, 7) !== clave;
				const nombre = formato.fechaConDia(f);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					role: "gridcell",
					className: cx(Agenda_module_default.mesCeldaEnvoltura),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cx(Agenda_module_default.mesCelda, fuera && Agenda_module_default.mesFuera, f === p.hoy && Agenda_module_default.mesHoy, !o.trabaja && Agenda_module_default.mesLibre, o.excedido && Agenda_module_default.mesExcedido),
						"aria-label": lista.length > 0 ? T.verDia(nombre, lista.length) : o.trabaja ? `${nombre}: ${T.diaVacio}` : T.diaSinVideosAria(nombre),
						onClick: () => p.alAbrir(f),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Agenda_module_default.mesNumero),
							children: Number(f.slice(8))
						}), lista.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(Agenda_module_default.mesContenido),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Agenda_module_default.mesPuntos),
								"aria-hidden": "true",
								children: lista.slice(0, 6).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Agenda_module_default.mesPunto),
									"data-etapa": m.avance.etapa
								}, m.application_id))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Agenda_module_default.mesConteo),
								children: formato.numero(lista.length)
							})]
						}) : !o.trabaja && !fuera ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Agenda_module_default.mesSin),
							children: T.sinVideos
						}) : null]
					})
				}, f);
			})
		}, semana[0]))]
	});
}
/**
* Cuando una vista cambia sin navegar (éxito del plan, fin de la sesión, cierre de Avisar), el foco va a su título para
* que el lector de pantalla lo anuncie y el teclado siga desde ahí (02 §12). El título lleva tabIndex={-1}.
*/
function useFocoAlMontar() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		ref.current?.focus({ preventScroll: true });
	}, []);
	return ref;
}
var Plan_module_default = {
	asistente: "_asistente_1txha_3",
	asistenteExito: "_asistenteExito_1txha_10",
	tarjeta: "_tarjeta_1txha_15",
	asistenteRevisar: "_asistenteRevisar_1txha_28",
	aside: "_aside_1txha_31",
	pasos: "_pasos_1txha_37",
	paso: "_paso_1txha_37",
	pasoHecho: "_pasoHecho_1txha_60",
	pasoActual: "_pasoActual_1txha_61",
	pasoBoton: "_pasoBoton_1txha_67",
	pasoNumero: "_pasoNumero_1txha_95",
	pasoTitulo: "_pasoTitulo_1txha_117",
	cabezaPaso: "_cabezaPaso_1txha_125",
	pasoDe: "_pasoDe_1txha_131",
	tituloPaso: "_tituloPaso_1txha_141",
	campos: "_campos_1txha_151",
	campo: "_campo_1txha_151",
	campoFila: "_campoFila_1txha_163",
	campoDias: "_campoDias_1txha_170",
	diasAjustados: "_diasAjustados_1txha_174",
	etiqueta: "_etiqueta_1txha_178",
	ayuda: "_ayuda_1txha_184",
	incluir: "_incluir_1txha_192",
	opcionesIncluir: "_opcionesIncluir_1txha_198",
	conteoIncluidas: "_conteoIncluidas_1txha_209",
	grupos: "_grupos_1txha_216",
	grupo: "_grupo_1txha_216",
	grupoCabeza: "_grupoCabeza_1txha_228",
	grupoCasilla: "_grupoCasilla_1txha_236",
	grupoLista: "_grupoLista_1txha_239",
	fila: "_fila_1txha_246",
	filaQuitada: "_filaQuitada_1txha_258",
	foto48: "_foto48_1txha_261",
	foto44: "_foto44_1txha_264",
	filaTextos: "_filaTextos_1txha_267",
	filaCasilla: "_filaCasilla_1txha_273",
	filaMeta: "_filaMeta_1txha_279",
	filaTienda: "_filaTienda_1txha_290",
	filaEstado: "_filaEstado_1txha_298",
	filaVence: "_filaVence_1txha_311",
	revisar: "_revisar_1txha_317",
	terminaBloque: "_terminaBloque_1txha_323",
	ritmoTexto: "_ritmoTexto_1txha_332",
	termina: "_termina_1txha_323",
	terminaRotulo: "_terminaRotulo_1txha_343",
	terminaFecha: "_terminaFecha_1txha_349",
	publica: "_publica_1txha_358",
	listaAviso: "_listaAviso_1txha_364",
	subtitulo: "_subtitulo_1txha_368",
	calendario: "_calendario_1txha_377",
	calRejilla: "_calRejilla_1txha_383",
	calFila: "_calFila_1txha_389",
	calCabeza: "_calCabeza_1txha_394",
	calLetra: "_calLetra_1txha_397",
	calCelda: "_calCelda_1txha_403",
	calFuera: "_calFuera_1txha_415",
	calLibre: "_calLibre_1txha_419",
	calHoy: "_calHoy_1txha_423",
	calNumero: "_calNumero_1txha_427",
	calConteo: "_calConteo_1txha_437",
	calLleno: "_calLleno_1txha_447",
	calFotos: "_calFotos_1txha_450",
	calFoto: "_calFoto_1txha_450",
	calSin: "_calSin_1txha_459",
	primeros: "_primeros_1txha_484",
	primerosDias: "_primerosDias_1txha_489",
	primerosDia: "_primerosDia_1txha_489",
	primerosTitulo: "_primerosTitulo_1txha_500",
	primerosLista: "_primerosLista_1txha_505",
	primerosFila: "_primerosFila_1txha_513",
	primerosTextos: "_primerosTextos_1txha_519",
	primerosNombre: "_primerosNombre_1txha_524",
	primerosTienda: "_primerosTienda_1txha_533",
	pie: "_pie_1txha_543",
	pieMovil: "_pieMovil_1txha_546",
	botonPrincipalMovil: "_botonPrincipalMovil_1txha_549",
	previa: "_previa_1txha_554",
	previaRotulo: "_previaRotulo_1txha_567",
	previaTermina: "_previaTermina_1txha_576",
	previaTerminaFecha: "_previaTerminaFecha_1txha_582",
	previaPublica: "_previaPublica_1txha_590",
	previaVaciaTitulo: "_previaVaciaTitulo_1txha_599",
	previaRitmo: "_previaRitmo_1txha_607",
	previaChip: "_previaChip_1txha_613",
	grafica: "_grafica_1txha_616",
	previaDias: "_previaDias_1txha_619",
	previaSubtitulo: "_previaSubtitulo_1txha_626",
	previaDia: "_previaDia_1txha_619",
	previaDiaTitulo: "_previaDiaTitulo_1txha_637",
	previaFotos: "_previaFotos_1txha_643",
	previaFoto: "_previaFoto_1txha_643",
	previaMas: "_previaMas_1txha_654",
	previaVacia: "_previaVacia_1txha_599",
	exito: "_exito_1txha_669",
	exitoPalomita: "_exitoPalomita_1txha_683",
	exitoTitulo: "_exitoTitulo_1txha_686",
	exitoDetalle: "_exitoDetalle_1txha_699",
	exitoAviso: "_exitoAviso_1txha_705",
	exitoPrimeras: "_exitoPrimeras_1txha_710",
	exitoFotos: "_exitoFotos_1txha_717",
	exitoFoto: "_exitoFoto_1txha_717",
	exitoFotosTexto: "_exitoFotosTexto_1txha_729",
	exitoAcciones: "_exitoAcciones_1txha_739",
	exitoDeshacerLugar: "_exitoDeshacerLugar_1txha_746",
	dondeAvisar: "_dondeAvisar_1txha_752",
	dondeTitulo: "_dondeTitulo_1txha_761",
	dondeOpciones: "_dondeOpciones_1txha_766"
};
/**
* Pantalla de éxito de Armar mi plan (01 §4.5: reemplaza al aviso flotante). «Plan listo: terminas el {mar 24 nov}.
* Ahora avisa a tus {30} tiendas.» [Avisar a mis tiendas] [Después], con Deshacer durante 6 s (el deshacer del lote:
* UN solo Deshacer para todo el plan). En Windows con celular emparejado, [Avisar a mis tiendas] ofrece «Desde mi
* celular» o «Desde esta PC».
*/
/** «hoy» · «mañana» · «el sáb 14 nov» (para «Empiezas hoy con estas 3»). */
function etiquetaDiaCorta(f) {
	const hoy = hoyLocal();
	if (f === hoy) return "hoy";
	if (f === sumarDias(hoy, 1)) return "mañana";
	return `el ${formato.fechaConDia(f)}`;
}
var DURACION_DESHACER_MS = 6e3;
function ExitoPlan(p) {
	const [puedeDeshacer, setPuedeDeshacer] = (0, import_react.useState)(p.exito.deshacer !== null);
	const [dondeAvisar, setDondeAvisar] = (0, import_react.useState)(null);
	const titulo = useFocoAlMontar();
	(0, import_react.useEffect)(() => {
		if (!puedeDeshacer) return void 0;
		const t = setTimeout(() => setPuedeDeshacer(false), DURACION_DESHACER_MS);
		return () => clearTimeout(t);
	}, [puedeDeshacer]);
	const avisar = () => {
		if (p.celularEmparejado && dondeAvisar === null) setDondeAvisar("preguntar");
		else p.alAvisar();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Plan_module_default.exito),
		"aria-labelledby": "flujos-plan-exito",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, {
				tamano: 56,
				className: cx(Plan_module_default.exitoPalomita)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "flujos-plan-exito",
				ref: titulo,
				tabIndex: -1,
				className: cx(Plan_module_default.exitoTitulo),
				children: T.planListo(formato.fechaConDia(p.exito.termina), p.exito.tiendasPorAvisar)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Plan_module_default.exitoDetalle),
				children: T.planListoDetalle(p.exito.videos, formato.fechaConDia(p.exito.publica))
			}),
			p.exito.deshacer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.exitoDeshacerLugar),
				children: puedeDeshacer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: "Undo2",
					alPulsar: p.alDeshacer,
					children: T.deshacer
				}) : null
			}) : null,
			p.exito.primerDia && p.exito.primerDia.muestras.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: cx(Plan_module_default.exitoPrimeras),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: cx(Plan_module_default.exitoFotos),
					children: [p.exito.primerDia.muestras.slice(0, 4).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cx(Plan_module_default.exitoFoto),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
							url: m.producto.imagen,
							alt: `${nombreDe(m.producto)}, ${m.tienda.nombre}`,
							anchoCss: 96,
							proporcion: "1:1",
							radio: "md",
							tienda: m.tienda.nombre,
							categoria: m.producto.categoria
						})
					}, m.application_id)), p.exito.primerDia.muestras.length > 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cx(Plan_module_default.exitoFoto, Plan_module_default.previaMas),
						children: T.masVideos(p.exito.primerDia.muestras.length - 4)
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: cx(Plan_module_default.exitoFotosTexto),
					children: T.empiezasCon(etiquetaDiaCorta(p.exito.primerDia.fecha), p.exito.primerDia.muestras.length)
				})]
			}) : null,
			p.exito.enCola ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "Smartphone",
				className: cx(Plan_module_default.exitoAviso),
				children: T.planEnCola
			}) : null,
			dondeAvisar === "preguntar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.dondeAvisar),
				role: "group",
				"aria-label": T.dondeAvisar,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Plan_module_default.dondeTitulo),
					children: T.dondeAvisar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Plan_module_default.dondeOpciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "lg",
						icono: "Smartphone",
						alPulsar: () => setDondeAvisar("celular"),
						children: T.desdeCelular
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "lg",
						icono: "Monitor",
						alPulsar: p.alAvisar,
						children: T.desdeEstaPc
					})]
				})]
			}) : dondeAvisar === "celular" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.dondeAvisar),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "info",
					icono: "Smartphone",
					children: T.desdeCelularTexto
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Plan_module_default.exitoAcciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						alPulsar: p.alAvisar,
						children: T.desdeEstaPc
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						alPulsar: p.alDespues,
						children: T.volverInicio
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.exitoAcciones),
				children: [p.exito.tiendasPorAvisar > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "MessageCircle",
					alPulsar: avisar,
					children: T.avisarMisTiendas
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: p.exito.tiendasPorAvisar > 0 ? "secundario" : "primario",
					tamano: "lg",
					alPulsar: p.alDespues,
					children: p.exito.tiendasPorAvisar > 0 ? T.despues : T.volverInicio
				})]
			})
		]
	});
}
var LETRAS = [
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
	"D"
];
var NOMBRES_DIA = [
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
	"domingo"
];
/** «Hoy · jue 12 nov» · «Mañana · vie 13 nov» · «Sáb 14 nov». */
function etiquetaDia(f, hoy, manana) {
	if (f === hoy) return `${T.hoyEtiqueta} · ${formato.fechaConDia(f)}`;
	if (f === manana) return `${T.mananaEtiqueta} · ${formato.fechaConDia(f)}`;
	return capitalizar(formato.fechaConDia(f));
}
/** Videos por día del plan con GraficaColumnas (una serie en --viz-mono, hover y tabla gemela para lectores). */
function GraficaPlan(p) {
	if (p.dias.length === 0) return null;
	const puntos = p.dias.map((d) => ({
		clave: d.fecha,
		etiqueta: formato.fechaCorta(d.fecha).replace(/ \S+$/, ""),
		valor: d.n,
		aria: `${formato.fechaConDia(d.fecha)}: ${d.trabaja ? `${formato.numero(d.n)} de ${formato.numero(p.capacidad)} videos` : "no haces videos"}`
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
		titulo: T.videosPorDia,
		puntos,
		formatoEje: (v) => formato.numero(v),
		alto: p.alto ?? 120,
		nota: T.maximoPorDia(p.capacidad),
		tablaGemela: {
			columnas: ["Día", "Videos"],
			filas: p.dias.map((d) => [formato.fechaConDia(d.fecha), d.trabaja ? formato.numero(d.n) : T.sinVideos])
		},
		className: cx(Plan_module_default.grafica, p.className)
	});
}
/** Aside de los pasos 1 y 2: se actualiza en vivo con cada cambio del ritmo o de lo incluido. */
function VistaPrevia(p) {
	const r = p.resultado;
	const termina = textoTermina(r);
	const corte = termina ? termina.indexOf(" · ") : -1;
	const diasPlan = diasDelPlan(r, p.desde, p.dias);
	const hoy = hoyLocal();
	const porId = new Map(p.muestras.map((m) => [m.application_id, m]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cx(Plan_module_default.previa, p.className),
		"aria-label": T.vistaPrevia,
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Plan_module_default.previaRotulo),
			children: T.vistaPrevia
		}), termina ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Plan_module_default.previaTermina),
				"data-resumen-plan": "",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Plan_module_default.previaTerminaFecha),
						children: termina.slice(0, corte)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(flujos_module_default.lector),
						children: " · "
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Plan_module_default.previaPublica),
						children: termina.slice(corte + 3)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Plan_module_default.previaRitmo),
				children: textoRitmo(r.asignaciones.length, p.capacidad, p.dias)
			}),
			p.provisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				tono: "info",
				icono: "Hourglass",
				className: cx(Plan_module_default.previaChip),
				children: T.provisionalCorto
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaPlan, {
				dias: diasPlan,
				capacidad: p.capacidad
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.previaDias),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Plan_module_default.previaSubtitulo),
					children: T.primerosDias
				}), primerosDias$1(r, 2).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: cx(Plan_module_default.previaDia),
					"aria-label": formato.fechaConDia(d.fecha),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Plan_module_default.previaDiaTitulo),
						children: etiquetaDia(d.fecha, hoy, sumarDias(hoy, 1))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: cx(Plan_module_default.previaFotos),
						children: [d.ids.slice(0, 3).map((id) => {
							const m = porId.get(id);
							if (!m) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: cx(Plan_module_default.previaFoto),
								title: `${nombreDe(m.producto)} · ${m.tienda.nombre}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
									url: m.producto.imagen,
									alt: `${nombreDe(m.producto)}, ${m.tienda.nombre}`,
									anchoCss: 88,
									proporcion: "1:1",
									radio: "md",
									tienda: m.tienda.nombre,
									categoria: m.producto.categoria
								})
							}, id);
						}), d.ids.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: cx(Plan_module_default.previaMas),
							children: T.masVideos(d.ids.length - 3)
						}) : null]
					})]
				}, d.fecha))]
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Plan_module_default.previaVacia),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Plan_module_default.previaVaciaTitulo),
				children: p.vacio === "todas_con_fecha" ? T.todasConFecha : p.vacio === "sin_dias" ? T.sinDiasPlan : T.sinVideosPlan
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Plan_module_default.previaRitmo),
				children: p.vacio === "todas_con_fecha" ? T.todasConFechaTexto : p.vacio === "sin_dias" ? T.sinDiasPlanTexto : T.sinVideosPlanTexto
			})]
		})]
	});
}
/** Calendario del paso 3: semanas de lunes a domingo, cada día con su conteo y las fotos de lo que toca hacer. */
function CalendarioPlan(p) {
	const semanas = semanasDelPlan(diasDelPlan(p.resultado, p.desde, p.dias));
	if (semanas.length === 0) return null;
	const hoy = hoyLocal();
	const porId = new Map(p.muestras.map((m) => [m.application_id, m]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Plan_module_default.calendario),
		"aria-label": T.calendarioPlan,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: cx(Plan_module_default.subtitulo),
			children: T.calendarioPlan
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Plan_module_default.calRejilla),
			role: "table",
			"aria-label": T.calendarioPlan,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.calFila, Plan_module_default.calCabeza),
				role: "row",
				children: LETRAS.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Plan_module_default.calLetra),
					role: "columnheader",
					"aria-label": NOMBRES_DIA[i],
					children: l
				}, `${l}${i}`))
			}), semanas.map((fila, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.calFila),
				role: "row",
				children: fila.map((d, j) => {
					if (d === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Plan_module_default.calCelda, Plan_module_default.calFuera),
						role: "cell",
						"aria-hidden": "true"
					}, j);
					const lleno = d.trabaja && d.n >= p.capacidad;
					const fotos = d.ids.map((id) => porId.get(id)).filter((m) => m !== void 0);
					const etiqueta = d.trabaja ? `${formato.fechaConDia(d.fecha)}: ${cuenta(d.n, "video")}` : `${formato.fechaConDia(d.fecha)}: ${T.sinVideos.toLowerCase()}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						role: "cell",
						className: cx(Plan_module_default.calCelda, !d.trabaja && Plan_module_default.calLibre, d.fecha === hoy && Plan_module_default.calHoy, lleno && Plan_module_default.calLleno),
						"aria-label": etiqueta,
						title: etiqueta,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.calNumero),
							"aria-hidden": "true",
							children: Number(d.fecha.slice(8))
						}), d.trabaja ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.calConteo),
							"aria-hidden": "true",
							children: d.n
						}), fotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.calFotos),
							"aria-hidden": "true",
							children: fotos.slice(0, 3).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
								url: m.producto.imagen,
								alt: "",
								anchoCss: 28,
								proporcion: "1:1",
								radio: "xs",
								tienda: m.tienda.nombre,
								categoria: m.producto.categoria,
								className: cx(Plan_module_default.calFoto)
							}, m.application_id))
						}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.calSin),
							"aria-hidden": "true",
							children: T.sinVideos
						})]
					}, d.fecha);
				})
			}, i))]
		})]
	});
}
/** «Tus primeros días» del paso 3: los 2 primeros días con su lista (foto, nombre corto y tienda). */
function PrimerosDias(p) {
	const lista = primerosDias$1(p.resultado, 2);
	if (lista.length === 0) return null;
	const hoy = hoyLocal();
	const porId = new Map(p.muestras.map((m) => [m.application_id, m]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Plan_module_default.primeros),
		"aria-label": T.primerosDias,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: cx(Plan_module_default.subtitulo),
			children: T.primerosDias
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Plan_module_default.primerosDias),
			children: lista.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cx(Plan_module_default.primerosDia),
				"aria-label": formato.fechaConDia(d.fecha),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Plan_module_default.primerosTitulo),
					children: etiquetaDia(d.fecha, hoy, sumarDias(hoy, 1))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Plan_module_default.primerosLista),
					children: d.ids.map((id) => {
						const m = porId.get(id);
						if (!m) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cx(Plan_module_default.primerosFila),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
								url: m.producto.imagen,
								alt: "",
								anchoCss: 44,
								proporcion: "1:1",
								radio: "sm",
								tienda: m.tienda.nombre,
								categoria: m.producto.categoria,
								className: cx(Plan_module_default.foto44)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(Plan_module_default.primerosTextos),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.primerosNombre),
									children: nombreDe(m.producto)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.primerosTienda),
									children: m.tienda.nombre
								})]
							})]
						}, id);
					})
				})]
			}, d.fecha))
		})]
	});
}
function PasoRitmo(p) {
	const ayudaDesde = [
		T.empiezasEl(formato.fechaConDia(p.desde)),
		p.desde === p.hoy ? T.quedanHoy(p.lugaresHoy) : null,
		p.desde === p.hoy && p.despuesDeLas6 ? T.yaPasaron6 : null
	].filter((x) => x !== null).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Plan_module_default.campos),
		children: [
			p.conPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.campo),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
					etiqueta: T.rehacerPregunta,
					valor: p.modoRehacer,
					alCambiar: p.alRehacer,
					opciones: [{
						valor: "sin_fecha",
						etiqueta: T.rehacerSoloSinFecha,
						descripcion: T.rehacerSoloSinFechaAyuda
					}, {
						valor: "todo",
						etiqueta: T.rehacerTodo,
						descripcion: T.rehacerTodoAyuda
					}]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.campo, Plan_module_default.campoFila),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorNumero, {
					etiqueta: T.cuantosPorDia,
					valor: p.capacidad,
					min: 1,
					max: 10,
					alCambiar: p.alCapacidad
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.campo, Plan_module_default.campoDias),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsDias, {
					etiqueta: T.queDias,
					dias: p.dias,
					alCambiar: p.alDias,
					className: cx(Plan_module_default.diasAjustados)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.campo),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Plan_module_default.etiqueta),
						id: "flujos-plan-desde",
						children: T.desdeCuando
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
						etiqueta: T.desdeCuando,
						anchoCompleto: true,
						valor: p.modoDesde,
						alCambiar: (v) => p.alDesde(v, v === "otra" ? p.desde : null),
						opciones: [
							{
								valor: "hoy",
								etiqueta: T.hoy
							},
							{
								valor: "manana",
								etiqueta: T.manana
							},
							p.compacta ? {
								valor: "otra",
								etiqueta: T.otraFecha
							} : {
								valor: "otra",
								etiqueta: T.otraFecha,
								icono: "CalendarDays"
							}
						]
					}),
					p.modoDesde === "otra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
						etiqueta: T.desdeCuando,
						valor: p.desde,
						min: p.hoy,
						alCambiar: (f) => p.alDesde("otra", f)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(Plan_module_default.ayuda),
						children: ayudaDesde
					})
				]
			})
		]
	});
}
function PasoIncluir(p) {
	const grupos = gruposIncluir(p.visibles);
	const incluidas = p.visibles.filter((m) => !p.quitadas.has(m.application_id)).length;
	const quitadas = p.visibles.length - incluidas;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Plan_module_default.incluir),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.opcionesIncluir),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
					activo: p.modoRehacer === "sin_fecha",
					alCambiar: p.alRespetar,
					etiqueta: T.respetarFechas,
					descripcion: T.siemprePromesas
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Plan_module_default.campo),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.etiqueta),
							children: T.orden
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
							etiqueta: T.orden,
							anchoCompleto: true,
							valor: p.orden,
							alCambiar: p.alOrden,
							opciones: [{
								valor: "sugerido",
								etiqueta: T.sugerido
							}, {
								valor: "por_tipo_de_prenda",
								etiqueta: T.porTipo
							}]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(Plan_module_default.ayuda),
							children: p.orden === "sugerido" ? T.sugeridoAyuda : T.porTipoAyuda
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Plan_module_default.conteoIncluidas),
				"aria-live": "polite",
				children: [T.incluidasDe(incluidas, p.visibles.length), p.conFechaFuera > 0 ? ` · ${cuenta(p.conFechaFuera, "ya tiene fecha y se queda", "ya tienen fecha y se quedan")} donde está${p.conFechaFuera === 1 ? "" : "n"}` : ""]
			}),
			p.preguntarQuitadas && quitadas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "atencion",
				icono: "CircleHelp",
				rol: "alert",
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					alPulsar: p.alDejarDespues,
					children: quitadas === 1 ? T.dejarlaDespues : T.dejarlasDespues
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					alPulsar: p.alNoPuedo,
					children: quitadas === 1 ? T.noPuedoEste : T.noPuedoEstos
				})] }),
				children: quitadas === 1 ? T.quitadaPregunta : T.quitadasPregunta(quitadas)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Plan_module_default.grupos),
				children: grupos.map((g) => {
					const marcadas = g.items.filter((m) => !p.quitadas.has(m.application_id)).length;
					const nivel = ETIQUETA_NIVEL[g.nivel].toLowerCase();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: cx(Plan_module_default.grupo),
						"aria-label": T.prioridad(nivel, g.items.length),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cx(Plan_module_default.grupoCabeza),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
								etiqueta: T.prioridad(nivel, g.items.length),
								marcada: marcadas === g.items.length,
								indeterminada: marcadas > 0 && marcadas < g.items.length,
								alCambiar: (v) => p.alIncluir(g.items.map((m) => m.application_id), v),
								className: cx(Plan_module_default.grupoCasilla)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: cx(Plan_module_default.grupoLista),
							children: g.items.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaIncluir, {
								m,
								incluida: !p.quitadas.has(m.application_id),
								alCambiar: (v) => p.alIncluir([m.application_id], v)
							}, m.application_id))
						})]
					}, g.nivel);
				})
			})
		]
	});
}
function FilaIncluir(p) {
	const m = p.m;
	const nombre = nombreDe(m.producto);
	const meta = m.avance.fecha_planeada ? T.yaTieneFecha(formato.fechaConDia(m.avance.fecha_planeada)) : m.grupo === "por_vencer" && m.fecha_limite_at !== null ? T.venceEl(formato.fechaConDia(m.fecha_limite_at)) : m.motivo;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cx(Plan_module_default.fila, !p.incluida && Plan_module_default.filaQuitada),
		"data-incluir": m.application_id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: m.producto.imagen,
			alt: "",
			anchoCss: 48,
			proporcion: "1:1",
			radio: "sm",
			tienda: m.tienda.nombre,
			categoria: m.producto.categoria,
			className: cx(Plan_module_default.foto48)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Plan_module_default.filaTextos),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
				etiqueta: nombre,
				marcada: p.incluida,
				alCambiar: p.alCambiar,
				className: cx(Plan_module_default.filaCasilla)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(Plan_module_default.filaMeta),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Plan_module_default.filaTienda),
					children: [m.tienda.nombre, m.variante ? ` · ${m.variante}` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Plan_module_default.filaEstado, m.grupo === "por_vencer" && Plan_module_default.filaVence),
					children: meta
				})]
			})]
		})]
	});
}
function PasoRevisar(p) {
	const r = p.resultado;
	const porId = new Map(p.pendientes.map((m) => [m.application_id, m]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Plan_module_default.revisar),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Plan_module_default.terminaBloque),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(Plan_module_default.ritmoTexto),
						children: textoRitmo(r.asignaciones.length, p.capacidad, p.dias)
					}),
					r.termina ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cx(Plan_module_default.termina),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.terminaRotulo),
							children: T.terminasLargo
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Plan_module_default.terminaFecha),
							children: formato.fechaLarga(r.termina)
						})]
					}) : null,
					r.publica_a_mas_tardar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cx(Plan_module_default.publica),
						children: T.publicaLargo(formato.fechaLarga(r.publica_a_mas_tardar))
					}) : null
				]
			}),
			p.provisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "Hourglass",
				children: T.provisional
			}) : null,
			r.no_alcanza.map((x) => {
				const m = porId.get(x.application_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "critico",
					rol: "alert",
					children: T.noAlcanza(m ? nombreDe(m.producto) : "una muestra", formato.fechaConDia(x.fecha_limite))
				}, `na-${x.application_id}`);
			}),
			r.rompe_promesa.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Aviso, {
				tono: "atencion",
				icono: "CalendarClock",
				rol: "alert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: T.rompePromesa(r.rompe_promesa.length) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Plan_module_default.listaAviso),
					children: r.rompe_promesa.map((x) => {
						const m = porId.get(x.application_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: T.rompePromesaDetalle(m ? nombreDe(m.producto) : "Una muestra", m?.tienda.nombre ?? "la tienda", formato.fechaConDia(x.promesa)) }, x.application_id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarioPlan, {
				resultado: r,
				desde: p.desde,
				dias: p.dias,
				capacidad: p.capacidad,
				muestras: p.pendientes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimerosDias, {
				resultado: r,
				muestras: p.pendientes
			})
		]
	});
}
/**
* #/muestras/plan · Armar mi plan (01 §4.5, §5.2). Asistente de 3 pasos con indicador: escritorio = superficie de 640
* con la vista previa en vivo al lado; celular (o ventana compacta) = pantalla completa con el botón inferior fijo
* «Siguiente». El reparto lo hace dominio.armarPlan (reglas 1–3) y «Crear mi plan» manda TODO con UN solo
* acciones.lote (opsDePlan) → un solo Deshacer, en la pantalla de éxito (y con Ctrl+Z). Si ya hay plan, la acción se
* llama «Rehacer mi plan» y ofrece «Solo las que no tienen fecha» o «Repartir todo de nuevo».
*/
var TITULOS = {
	1: T.tuRitmo,
	2: T.queIncluimos,
	3: T.revisaTuPlan
};
function PantallaArmarPlan() {
	const datos = useDatosTrabajo();
	const sync = useSync();
	const sesion = useSesion();
	const acciones = useAcciones();
	const control = useControlMuestra();
	const toast = useToast();
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const movil = clase === "compacta";
	const [e, despachar] = (0, import_react.useReducer)(reducirAsistente, ESTADO_INICIAL);
	const [exito, setExito] = (0, import_react.useState)(null);
	const [creando, setCreando] = (0, import_react.useState)(false);
	const conPlanAlAbrir = (0, import_react.useRef)(null);
	if (conPlanAlAbrir.current === null && datos.listo) conPlanAlAbrir.current = hayPlan(datos.pendientes);
	const conPlan = conPlanAlAbrir.current === true;
	const ahora = ahoraS();
	const hoy = hoyLocal(ahora);
	const omision = desdePorOmision(ahora);
	const capacidad = e.capacidad ?? datos.ritmo.capacidad;
	const dias = e.dias ?? datos.ritmo.dias;
	const orden = e.orden ?? datos.ritmo.orden;
	const desde = desdeEfectivo(e, hoy, omision);
	const modoDesde = modoDeDesde(e, desde, hoy);
	const candidatas = (0, import_react.useMemo)(() => candidatasPlan(datos.pendientes), [datos.pendientes]);
	const modoAjustado = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (modoAjustado.current || !datos.listo) return;
		modoAjustado.current = true;
		if (conPlan && modoRehacerInicial(candidatas) === "todo") despachar({
			tipo: "rehacer",
			modo: "todo"
		});
	}, [
		datos.listo,
		conPlan,
		candidatas
	]);
	const quitadas = (0, import_react.useMemo)(() => new Set(e.quitadas), [e.quitadas]);
	const visibles = (0, import_react.useMemo)(() => e.modoRehacer === "todo" ? candidatas : candidatas.filter((m) => m.avance.fecha_planeada === null), [candidatas, e.modoRehacer]);
	const incluidas = (0, import_react.useMemo)(() => incluidasPorOmision(candidatas, e.modoRehacer, quitadas), [
		candidatas,
		e.modoRehacer,
		quitadas
	]);
	const resultado = (0, import_react.useMemo)(() => armarPlan(entradaPlan({
		pendientes: datos.pendientes,
		incluidas,
		capacidad,
		dias,
		desde,
		respetarFechas: e.modoRehacer === "sin_fecha",
		orden,
		planes: datos.planes,
		hoy
	})), [
		datos.pendientes,
		incluidas,
		capacidad,
		dias,
		desde,
		e.modoRehacer,
		orden,
		datos.planes,
		hoy
	]);
	const provisional = ordenProvisional(sync.estado);
	const titulo = conPlan ? T.rehacerMiPlan : T.planTitulo;
	const celularEmparejado = plataforma !== "android" && (sesion.datos?.lan?.dispositivos_activos ?? 0) > 0;
	const crear = async () => {
		if (resultado.termina === null || resultado.publica_a_mas_tardar === null || creando) return;
		setCreando(true);
		const cambios = cambiosRitmo(datos.ritmo, {
			capacidad,
			dias,
			orden
		});
		if (datos.ritmo.rev !== null && Object.keys(cambios).length > 0) await acciones.editarPreferencias({
			...cambios,
			rev: datos.ritmo.rev
		});
		const ops = opsDePlan(resultado, datos.pendientes, datos.planes).map(aOpLocal);
		const r = ops.length > 0 ? await acciones.lote(ops) : null;
		setCreando(false);
		if (r && (r.estado === "error" || r.estado === "conflicto")) {
			toast.mostrar({
				texto: r.estado === "conflicto" ? r.resultados.find((x) => x.error)?.error ?? T.planErrorCrear : T.planErrorCrear,
				tono: "error"
			});
			return;
		}
		const conteo = contarTrabajo(datos.pendientes, datos.avisos, hoy);
		const primero = primerosDias$1(resultado, 1)[0];
		const porId = new Map(datos.pendientes.map((m) => [m.application_id, m]));
		setExito({
			videos: new Set(resultado.asignaciones.map((a) => a.application_id)).size,
			termina: resultado.termina,
			publica: resultado.publica_a_mas_tardar,
			tiendasPorAvisar: conteo.tiendas_por_avisar,
			primerDia: primero ? {
				fecha: primero.fecha,
				muestras: primero.ids.map((id) => porId.get(id)).filter((m) => m !== void 0)
			} : null,
			deshacer: r ? r.deshacer : null,
			enCola: r?.estado === "en_cola"
		});
		const afectada = resultado.rompe_promesa[0];
		const m = afectada ? datos.pendientes.find((x) => x.application_id === afectada.application_id) : void 0;
		if (m) navegar(`/muestras/plan?mensaje=${encodeURIComponent(`t:${m.tienda.tienda_key}`)}&plantilla=nueva_fecha`);
	};
	const deshacer = async () => {
		const d = exito?.deshacer;
		if (!d) return;
		try {
			await d();
			setExito(null);
			despachar({
				tipo: "ir",
				paso: 3
			});
			toast.mostrar({
				texto: T.planDeshecho,
				tono: "ok"
			});
		} catch (err) {
			toast.mostrar({
				texto: err instanceof Error && err.message ? err.message : T.planErrorCrear,
				tono: "error"
			});
		}
	};
	const noPuedo = async () => {
		const lista = visibles.filter((m) => quitadas.has(m.application_id));
		despachar({ tipo: "dejarDespues" });
		for (const m of lista) await control.noSePuede(m);
	};
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo,
		contexto: movil ? void 0 : conPlan ? T.planContextoRehacer : T.planContexto,
		...!movil || plataforma === "android" ? { volver: {
			a: "/muestras",
			etiqueta: T.muestras
		} } : {}
	});
	let cuerpo;
	if (!datos.listo) cuerpo = datos.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorFlujo, {
		error: datos.error,
		titulo: T.planError,
		alReintentar: datos.refrescar
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, { filas: 4 });
	else if (exito) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Plan_module_default.asistente, Plan_module_default.asistenteExito),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExitoPlan, {
			exito,
			celularEmparejado,
			alAvisar: () => navegar("/muestras/avisos"),
			alDespues: () => navegar("/inicio"),
			alDeshacer: () => void deshacer()
		})
	});
	else if (candidatas.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(flujos_module_default.estadoCentro),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CalendarCheck",
			titulo: T.sinPendientesPlan,
			texto: T.sinPendientesPlanTexto,
			accion: {
				etiqueta: T.verAgenda,
				alPulsar: () => navegar("/muestras/agenda")
			}
		})
	});
	else {
		const n = incluidas.length;
		const lugaresHoy = lugaresLibres(hoy, capacidad, dias, datos.pendientes, e.modoRehacer === "todo" ? new Set(incluidas) : void 0);
		const despuesDeLas6 = horaLocal(ahora).h >= 18;
		const rompe = resultado.rompe_promesa.length > 0;
		const vacio = resultado.termina === null ? motivoVacio(dias, e.modoRehacer, candidatas, n) : null;
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Plan_module_default.asistente, e.paso === 3 && Plan_module_default.asistenteRevisar),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: cx(Plan_module_default.tarjeta),
				"aria-labelledby": "flujos-plan-paso",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: cx(Plan_module_default.pasos),
						"aria-label": T.pasos,
						children: [
							1,
							2,
							3
						].map((paso) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: cx(Plan_module_default.paso, paso === e.paso && Plan_module_default.pasoActual, paso < e.paso && Plan_module_default.pasoHecho),
							"aria-current": paso === e.paso ? "step" : void 0,
							children: paso < e.paso ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cx(Plan_module_default.pasoBoton),
								onClick: () => despachar({
									tipo: "ir",
									paso
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.pasoNumero),
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
										nombre: "Check",
										tamano: 14
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.pasoTitulo),
									children: TITULOS[paso]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(Plan_module_default.pasoBoton),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.pasoNumero),
									"aria-hidden": "true",
									children: paso
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Plan_module_default.pasoTitulo),
									children: TITULOS[paso]
								})]
							})
						}, paso))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Plan_module_default.cabezaPaso),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(Plan_module_default.pasoDe),
							"aria-hidden": "true",
							children: T.pasoDe(e.paso, 3)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "flujos-plan-paso",
							className: cx(Plan_module_default.tituloPaso),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(flujos_module_default.lector),
								children: [T.pasoDe(e.paso, 3), ": "]
							}), TITULOS[e.paso]]
						})]
					}),
					e.paso === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoRitmo, {
						compacta: clase === "compacta",
						conPlan,
						modoRehacer: e.modoRehacer,
						capacidad,
						dias,
						desde,
						modoDesde,
						hoy,
						lugaresHoy,
						despuesDeLas6,
						alRehacer: (modo) => despachar({
							tipo: "rehacer",
							modo
						}),
						alCapacidad: (valor) => despachar({
							tipo: "capacidad",
							valor
						}),
						alDias: (valor) => despachar({
							tipo: "dias",
							valor
						}),
						alDesde: (modo, fecha) => despachar({
							tipo: "desde",
							modo,
							fecha
						})
					}) : null,
					e.paso === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoIncluir, {
						visibles,
						conFechaFuera: e.modoRehacer === "sin_fecha" ? candidatas.length - visibles.length : 0,
						quitadas,
						modoRehacer: e.modoRehacer,
						orden,
						preguntarQuitadas: e.preguntarQuitadas,
						alRespetar: (respetar) => despachar({
							tipo: "rehacer",
							modo: respetar ? "sin_fecha" : "todo"
						}),
						alOrden: (valor) => despachar({
							tipo: "orden",
							valor
						}),
						alIncluir: (ids, incluir) => despachar({
							tipo: "incluir",
							ids,
							incluir
						}),
						alDejarDespues: () => despachar({ tipo: "dejarDespues" }),
						alNoPuedo: () => void noPuedo()
					}) : null,
					e.paso === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasoRevisar, {
						resultado,
						desde,
						capacidad,
						dias,
						pendientes: datos.pendientes,
						provisional
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarraFija, {
						etiqueta: T.pasoDe(e.paso, 3),
						className: cx(Plan_module_default.pie, movil && Plan_module_default.pieMovil, flujos_module_default.repisa),
						children: [
							e.paso > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "fantasma",
								tamano: "lg",
								icono: "ArrowLeft",
								alPulsar: () => despachar({ tipo: "atras" }),
								children: T.atras
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "fantasma",
								tamano: "lg",
								alPulsar: () => navegar("/muestras"),
								children: T.cancelar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(flujos_module_default.barraFijaEspacio),
								"aria-hidden": "true"
							}),
							e.paso < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "primario",
								tamano: "lg",
								iconoFinal: "ArrowRight",
								deshabilitado: !puedeSeguir(e, dias, n),
								alPulsar: () => despachar({ tipo: "siguiente" }),
								className: cx(movil && Plan_module_default.botonPrincipalMovil),
								children: T.siguiente
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "primario",
								tamano: "lg",
								icono: rompe ? "MessageCircle" : "CalendarCheck",
								cargando: creando,
								deshabilitado: resultado.asignaciones.length === 0,
								alPulsar: () => void crear(),
								className: cx(movil && Plan_module_default.botonPrincipalMovil),
								children: rompe ? T.crearYPreparar : T.crearMiPlan
							})
						]
					})
				]
			}), e.paso < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaPrevia, {
				resultado,
				desde,
				capacidad,
				dias,
				muestras: datos.pendientes,
				provisional,
				...vacio ? { vacio } : {},
				className: cx(Plan_module_default.aside)
			}) : null]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo,
		lista: datos.listo,
		className: cx(flujos_module_default.pantalla, datos.refrescando && flujos_module_default.refrescando),
		children: [
			encabezado,
			cuerpo,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservaCapas, {})
		]
	});
}
function porCola(a, b) {
	return (a.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.posicion_cola ?? Number.MAX_SAFE_INTEGER) || (a.application_id < b.application_id ? -1 : 1);
}
/** «Toma las planeadas para hoy» (01 §4.6), en el orden de la cola. */
function planeadasParaHoy(pendientes, hoy) {
	return pendientes.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada === hoy).sort(porCola);
}
/** «¿Hacemos las {3} siguientes de tu cola?»: promocionables sin video hecho (por planear o planeadas más adelante). */
function siguientesDeCola(pendientes, n, hoy) {
	return pendientes.filter((m) => promocionable(m) && (m.avance.etapa === "por_planear" || m.avance.etapa === "planeada" && (m.avance.fecha_planeada ?? hoy) >= hoy)).sort(porCola).slice(0, Math.max(0, n));
}
var SESION_VACIA = {
	ids: [],
	indice: 0,
	listos: [],
	saltadas: []
};
function siguienteIndice(ids, desde, hechos) {
	let i = desde;
	while (i < ids.length && hechos.has(ids[i] ?? "")) i++;
	return i;
}
function reducirSesion(e, a) {
	switch (a.tipo) {
		case "empezar": return {
			ids: [...new Set(a.ids)],
			indice: 0,
			listos: [],
			saltadas: []
		};
		case "listo": {
			if (!e.ids.includes(a.id) || e.listos.includes(a.id)) return e;
			const listos = [...e.listos, a.id];
			const saltadas = e.saltadas.filter((x) => x !== a.id);
			const indice = e.ids[e.indice] === a.id ? siguienteIndice(e.ids, e.indice + 1, new Set(listos)) : e.indice;
			return {
				...e,
				listos,
				saltadas,
				indice
			};
		}
		case "saltar": {
			if (e.ids[e.indice] !== a.id) return e;
			const saltadas = e.saltadas.includes(a.id) ? e.saltadas : [...e.saltadas, a.id];
			return {
				...e,
				saltadas,
				indice: siguienteIndice(e.ids, e.indice + 1, new Set(e.listos))
			};
		}
		case "deshacerListo": {
			const i = e.ids.indexOf(a.id);
			if (i < 0 || !e.listos.includes(a.id)) return e;
			return {
				...e,
				listos: e.listos.filter((x) => x !== a.id),
				indice: Math.min(e.indice, i)
			};
		}
		case "volverASaltadas":
			if (e.saltadas.length === 0) return e;
			return {
				ids: e.saltadas,
				indice: 0,
				listos: [],
				saltadas: []
			};
	}
}
function sesionTerminada(e) {
	return e.ids.length > 0 && e.indice >= e.ids.length;
}
/** Posición 1-based de la actual y total («2 de 3»); los puntos de progreso (hecha, actual, saltada, pendiente). */
function progresoSesion(e) {
	const listos = new Set(e.listos);
	const saltadas = new Set(e.saltadas);
	return {
		actual: Math.min(e.indice + 1, e.ids.length),
		total: e.ids.length,
		puntos: e.ids.map((id, i) => listos.has(id) ? "listo" : i === e.indice ? "actual" : saltadas.has(id) ? "saltada" : "pendiente")
	};
}
var Sesion_module_default = {
	pantalla: "_pantalla_6qr14_3",
	sesion: "_sesion_6qr14_7",
	tarjeta: "_tarjeta_6qr14_14",
	progreso: "_progreso_6qr14_19",
	progresoLinea: "_progresoLinea_6qr14_28",
	progresoTexto: "_progresoTexto_6qr14_31",
	puntos: "_puntos_6qr14_39",
	punto: "_punto_6qr14_39",
	extras: "_extras_6qr14_63",
	antes: "_antes_6qr14_70",
	notas: "_notas_6qr14_71",
	extrasTitulo: "_extrasTitulo_6qr14_84",
	antesLista: "_antesLista_6qr14_91",
	antesPaso: "_antesPaso_6qr14_99",
	antesNumero: "_antesNumero_6qr14_108",
	antesHecho: "_antesHecho_6qr14_120",
	verDescripcion: "_verDescripcion_6qr14_128",
	notaArrastre: "_notaArrastre_6qr14_132",
	atajos: "_atajos_6qr14_141",
	barra: "_barra_6qr14_149",
	principalMovil: "_principalMovil_6qr14_152",
	abrirMovil: "_abrirMovil_6qr14_155",
	entrada: "_entrada_6qr14_161",
	entradaTextos: "_entradaTextos_6qr14_172",
	entradaIcono: "_entradaIcono_6qr14_177",
	entradaTitulo: "_entradaTitulo_6qr14_187",
	entradaLista: "_entradaLista_6qr14_195",
	entradaListaMovil: "_entradaListaMovil_6qr14_206",
	entradaBarraMovil: "_entradaBarraMovil_6qr14_211",
	planearMovil: "_planearMovil_6qr14_214",
	entradaBarraAncha: "_entradaBarraAncha_6qr14_220",
	cierre: "_cierre_6qr14_228",
	cierreFotos: "_cierreFotos_6qr14_244",
	cierreFoto: "_cierreFoto_6qr14_244",
	cierreSello: "_cierreSello_6qr14_258",
	cierreMas: "_cierreMas_6qr14_271",
	cierreTitulo: "_cierreTitulo_6qr14_279",
	cierreTexto: "_cierreTexto_6qr14_290",
	cierreAcciones: "_cierreAcciones_6qr14_297"
};
/**
* #/muestras/sesion · Sesión de videos, modo enfoque (01 §4.6). Una muestra por pantalla con su foto grande
* (TarjetaMuestra 'sesion': Guardar imagen y Copiar datos para tu guion), progreso «2 de 3» con puntos, notas
* editables, la lista «Antes de publicar» y [Video listo] (principal) · [Saltar] · [Abrir en la app de TikTok].
* Toma las planeadas para hoy; si no hay: «¿Hacemos las {3} siguientes de tu cola?». En Android la pantalla no se
* apaga (mantenerPantalla) y Video listo vibra; todo funciona sin conexión (las acciones van a la cola del celular).
* Escritorio: Enter = Video listo · → = Saltar · I = Guardar imagen · C = Copiar datos.
*/
/** Enter/C/I solo si el foco no está en un control (un botón ya hace lo suyo con Enter). */
function focoLibre$1() {
	const a = typeof document === "undefined" ? null : document.activeElement;
	return !(a instanceof HTMLElement) || a === document.body || a.closest("button, a, input, select, textarea, [role=\"menu\"], [role=\"dialog\"]") === null;
}
function PantallaSesion() {
	const datos = useDatosTrabajo();
	const control = useControlMuestra();
	const toast = useToast();
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const movil = clase === "compacta";
	const [e, despachar] = (0, import_react.useReducer)(reducirSesion, SESION_VACIA);
	const hoy = hoyLocal();
	const paraHoy = (0, import_react.useMemo)(() => planeadasParaHoy(datos.pendientes, hoy), [datos.pendientes, hoy]);
	const siguientes = (0, import_react.useMemo)(() => siguientesDeCola(datos.pendientes, datos.ritmo.capacidad, hoy), [
		datos.pendientes,
		datos.ritmo.capacidad,
		hoy
	]);
	const autoInicio = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (autoInicio.current || !datos.listo) return;
		autoInicio.current = true;
		if (paraHoy.length > 0) despachar({
			tipo: "empezar",
			ids: paraHoy.map((m) => m.application_id)
		});
	}, [datos.listo, paraHoy]);
	(0, import_react.useEffect)(() => {
		mantenerPantalla(true);
		return () => mantenerPantalla(false);
	}, []);
	const porId = (0, import_react.useMemo)(() => new Map(datos.items.map((m) => [m.application_id, m])), [datos.items]);
	const actualId = e.ids[e.indice] ?? null;
	const actual = actualId ? porId.get(actualId) ?? null : null;
	const terminada = sesionTerminada(e);
	const progreso = progresoSesion(e);
	const vistosListos = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		for (const id of e.listos) {
			const m = porId.get(id);
			if (!m) continue;
			if (m.avance.etapa === "video_listo" || m.avance.etapa === "programada" || m.avance.etapa === "publicada") vistosListos.current.add(id);
			else if (vistosListos.current.has(id) && (m.avance.etapa === "planeada" || m.avance.etapa === "por_planear")) {
				vistosListos.current.delete(id);
				despachar({
					tipo: "deshacerListo",
					id
				});
			}
		}
	}, [e.listos, porId]);
	(0, import_react.useEffect)(() => {
		if (datos.listo && actualId !== null && !porId.has(actualId)) despachar({
			tipo: "saltar",
			id: actualId
		});
	}, [
		datos.listo,
		actualId,
		porId
	]);
	const videoListo = async (m) => {
		vibrar("confirmar");
		despachar({
			tipo: "listo",
			id: m.application_id
		});
		await control.cambiarEtapa(m, "video_listo");
	};
	const guardar = async (m) => {
		if (!m.producto.imagen) {
			toast.mostrar({
				texto: T.sinImagen,
				tono: "info"
			});
			return;
		}
		const r = await guardarImagen(m.producto.imagen, nombreDe(m.producto));
		if (r === "guardado") toast.mostrar({
			texto: T.imagenGuardada,
			tono: "ok"
		});
		else if (r === "compartido") toast.mostrar({
			texto: T.imagenCompartida,
			tono: "ok"
		});
		else if (r === "error") toast.mostrar({
			texto: T.imagenError,
			tono: "error"
		});
	};
	const copiarDatos = async (m) => {
		const ok = await copiarTexto(textoDatosGuion(m));
		toast.mostrar(ok ? {
			texto: T.datosCopiados,
			detalle: T.datosCopiadosDetalle,
			tono: "ok"
		} : {
			texto: T.noSeCopio,
			tono: "error"
		});
	};
	const abrirFuera = (m) => {
		const enlace = m.producto.enlace ?? void 0;
		if (android) abrirTikTok(enlace);
		else if (enlace) abrirExterno(enlace);
	};
	const enCurso = actual !== null && !terminada;
	useAtajos([
		{
			teclas: "Enter",
			descripcion: T.videoListo,
			accion: () => actual && void videoListo(actual),
			cuando: () => enCurso && focoLibre$1()
		},
		{
			teclas: "ArrowRight",
			descripcion: T.saltar,
			accion: () => actual && despachar({
				tipo: "saltar",
				id: actual.application_id
			}),
			cuando: () => enCurso && focoLibre$1()
		},
		{
			teclas: "i",
			descripcion: T.atajoGuardarLargo,
			accion: () => actual && void guardar(actual),
			cuando: () => enCurso
		},
		{
			teclas: "c",
			descripcion: T.atajoCopiarLargo,
			accion: () => actual && void copiarDatos(actual),
			cuando: () => enCurso
		}
	], !android);
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo: T.sesionTitulo,
		contexto: T.sesionContexto(formato.fechaConDia(hoy)),
		...!movil || android ? { volver: {
			a: "/muestras",
			etiqueta: T.muestras
		} } : {},
		...enCurso && !movil && !android ? { acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progreso, {
			puntos: progreso.puntos,
			actual: progreso.actual,
			total: progreso.total,
			listos: e.listos.length
		}) } : {}
	});
	let cuerpo;
	if (!datos.listo) cuerpo = datos.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorFlujo, {
		error: datos.error,
		titulo: T.sesionError,
		alReintentar: datos.refrescar
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, {
		filas: 2,
		conFoto: true
	});
	else if (terminada) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CierreSesion, {
		listos: e.listos.length,
		fotos: e.listos.map((id) => porId.get(id)).filter((m) => m !== void 0),
		saltadas: e.saltadas.length,
		alVolverASaltadas: () => despachar({ tipo: "volverASaltadas" })
	});
	else if (e.ids.length === 0) cuerpo = siguientes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Sesion_module_default.entrada),
		"aria-labelledby": "flujos-sesion-entrada",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Sesion_module_default.entradaTextos),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Sesion_module_default.entradaIcono),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Clapperboard",
						tamano: 24
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "flujos-sesion-entrada",
					className: cx(Sesion_module_default.entradaTitulo),
					children: siguientes.length === 1 ? T.nadaHoyUna : T.nadaHoy(siguientes.length)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: cx(Sesion_module_default.entradaLista, movil && Sesion_module_default.entradaListaMovil),
				children: siguientes.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
					muestra: m,
					variante: "agenda",
					alAbrir: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaProducto, {
					imagen: m.producto.imagen,
					nombre: nombreDe(m.producto),
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria,
					ranking: i + 1,
					cifraPrincipal: formato.rangoDinero(m.producto.precio_venta_min_centavos, m.producto.precio_venta_max_centavos, { aprox: true }),
					...m.variante ? { cifraSecundaria: m.variante } : {},
					alPulsar: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}`)
				}) }, m.application_id))
			}),
			movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: cx(flujos_module_default.enlace, Sesion_module_default.planearMovil),
				onClick: () => navegar("/muestras/plan"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarDays",
						tamano: 16
					}),
					" ",
					T.planearPrimero
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarraFija, {
				etiqueta: T.sesionTitulo,
				className: movil ? cx(Sesion_module_default.entradaBarraMovil, flujos_module_default.repisa) : cx(Sesion_module_default.entradaBarraAncha),
				children: [movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "lg",
					icono: "CalendarDays",
					alPulsar: () => navegar("/muestras/plan"),
					children: T.planearPrimero
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "Play",
					alPulsar: () => despachar({
						tipo: "empezar",
						ids: siguientes.map((m) => m.application_id)
					}),
					children: T.siEmpezar
				})]
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(flujos_module_default.estadoCentro),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleCheckBig",
			titulo: T.nadaEnCola,
			texto: T.nadaEnColaTexto,
			accion: {
				etiqueta: T.volverMuestras,
				alPulsar: () => navegar("/muestras")
			}
		})
	});
	else if (actual === null) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, {
		filas: 1,
		conFoto: true
	});
	else {
		const m = actual;
		const yaListo = e.listos.includes(m.application_id);
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Sesion_module_default.sesion),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
					muestra: m,
					variante: "sesion",
					className: cx(Sesion_module_default.tarjeta)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Sesion_module_default.extras),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: cx(Sesion_module_default.antes),
						"aria-labelledby": "flujos-sesion-antes",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								id: "flujos-sesion-antes",
								className: cx(Sesion_module_default.extrasTitulo),
								children: T.antesDePublicar
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: cx(Sesion_module_default.antesLista),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: cx(Sesion_module_default.antesPaso, m.producto.en_vitrina === true && Sesion_module_default.antesHecho),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx(Sesion_module_default.antesNumero),
											"aria-hidden": "true",
											children: m.producto.en_vitrina === true ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
												nombre: "Check",
												tamano: 14
											}) : 1
										}), m.producto.en_vitrina === true ? T.pasoVitrinaYaEsta : T.pasoVitrina]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: cx(Sesion_module_default.antesPaso),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx(Sesion_module_default.antesNumero),
											"aria-hidden": "true",
											children: "2"
										}), T.pasoEtiqueta]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: cx(Sesion_module_default.antesPaso),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx(Sesion_module_default.antesNumero),
											"aria-hidden": "true",
											children: "3"
										}), T.pasoEnlace]
									})
								]
							}),
							m.producto.enlace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: cx(flujos_module_default.enlace, Sesion_module_default.verDescripcion),
								onClick: () => void abrirExterno(m.producto.enlace ?? ""),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
										nombre: "ExternalLink",
										tamano: 16
									}),
									" ",
									T.verDescripcion
								]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaNotas, {
						entidad: "muestra",
						entidadId: m.application_id,
						titulo: T.tusNotas,
						className: cx(Sesion_module_default.notas)
					})]
				}),
				android ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(Sesion_module_default.notaArrastre),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Image",
							tamano: 16
						}),
						" ",
						T.notaArrastre
					]
				}),
				!movil && !android ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(Sesion_module_default.atajos),
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "Enter" }),
						" ",
						T.videoListo,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "→" }),
						" ",
						T.saltar,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "I" }),
						" ",
						T.atajoGuardar,
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "C" }),
						" ",
						T.atajoCopiar
					]
				}) : null,
				movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cx(flujos_module_default.enlace, Sesion_module_default.abrirMovil),
					onClick: () => abrirFuera(m),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ExternalLink",
							tamano: 16
						}),
						" ",
						android ? T.abrirAppTikTok : T.abrirTikTokShop
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarraFija, {
					etiqueta: T.sesionTitulo,
					className: cx(Sesion_module_default.barra, flujos_module_default.repisa),
					children: [
						movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "lg",
							icono: "ExternalLink",
							deshabilitado: !android && !m.producto.enlace,
							alPulsar: () => abrirFuera(m),
							children: android ? T.abrirAppTikTok : T.abrirTikTokShop
						}),
						movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(flujos_module_default.barraFijaEspacio),
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "lg",
							iconoFinal: "ArrowRight",
							alPulsar: () => despachar({
								tipo: "saltar",
								id: m.application_id
							}),
							children: T.saltar
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							tamano: "lg",
							icono: "Clapperboard",
							deshabilitado: yaListo,
							atajo: "Enter",
							alPulsar: () => void videoListo(m),
							className: cx(movil && Sesion_module_default.principalMovil),
							children: T.videoListo
						})
					]
				})
			]
		}, m.application_id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo: T.sesionTitulo,
		lista: datos.listo,
		className: cx(flujos_module_default.pantalla, Sesion_module_default.pantalla, datos.refrescando && flujos_module_default.refrescando),
		children: [
			encabezado,
			enCurso && (movil || android) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progreso, {
				puntos: progreso.puntos,
				actual: progreso.actual,
				total: progreso.total,
				listos: e.listos.length,
				enLinea: true
			}) : null,
			cuerpo,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservaCapas, {})
		]
	});
}
/** Cierre (01 §4.6): «¡Sesión terminada! Tienes {3} videos listos.» [Ver videos listos para publicar] [Volver a Inicio]. */
function CierreSesion(p) {
	const titulo = useFocoAlMontar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Sesion_module_default.cierre),
		"aria-labelledby": "flujos-sesion-cierre",
		children: [
			p.fotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: cx(Sesion_module_default.cierreFotos),
				"aria-label": T.videosListosSesion,
				children: [p.fotos.slice(0, 5).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx(Sesion_module_default.cierreFoto),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: m.producto.imagen,
						alt: `${nombreDe(m.producto)}, ${m.tienda.nombre}`,
						anchoCss: 88,
						proporcion: "1:1",
						radio: "md",
						tienda: m.tienda.nombre,
						categoria: m.producto.categoria
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Sesion_module_default.cierreSello),
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 14
						})
					})]
				}, m.application_id)), p.fotos.length > 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: cx(Sesion_module_default.cierreFoto, Sesion_module_default.cierreMas),
					children: `+${formato.numero(p.fotos.length - 5)}`
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 56 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "flujos-sesion-cierre",
				ref: titulo,
				tabIndex: -1,
				className: cx(Sesion_module_default.cierreTitulo),
				children: T.sesionTerminada
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Sesion_module_default.cierreTexto),
				children: [
					T.sesionTerminadaListos(p.listos),
					" ",
					p.listos > 0 ? T.sesionTerminadaTexto : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Sesion_module_default.cierreAcciones),
				children: [
					p.saltadas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "lg",
						icono: "RotateCcw",
						alPulsar: p.alVolverASaltadas,
						children: T.hacerSaltadas(p.saltadas)
					}) : null,
					p.listos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "lg",
						icono: "Clapperboard",
						alPulsar: () => navegar("/muestras"),
						children: T.verListos
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: p.listos > 0 ? "secundario" : "primario",
						tamano: "lg",
						alPulsar: () => navegar("/inicio"),
						children: T.volverInicio
					})
				]
			})
		]
	});
}
/** «2 de 3» con puntos: lima = listo, anillo = actual, ámbar tenue = saltada. */
function Progreso(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Sesion_module_default.progreso, p.enLinea && Sesion_module_default.progresoLinea),
		role: "status",
		"aria-label": T.progresoSesionAria(p.actual, p.total, p.listos),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Sesion_module_default.progresoTexto),
			"aria-hidden": "true",
			children: T.progresoSesion(p.actual, p.total)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Sesion_module_default.puntos),
			"aria-hidden": "true",
			children: p.puntos.map((estado, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Sesion_module_default.punto),
				"data-estado": estado
			}, i))
		})]
	});
}
/** Pendientes agrupadas por tienda, en el orden en que llegan (el de la cola). */
function pendientesPorTienda(pendientes) {
	const salida = /* @__PURE__ */ new Map();
	for (const m of pendientes) {
		const lista = salida.get(m.tienda.tienda_key);
		if (lista) lista.push(m);
		else salida.set(m.tienda.tienda_key, [m]);
	}
	return salida;
}
/** Todas sus pendientes aparecen en un aviso enviado y ninguna tiene la promesa vencida. */
function tiendaAvisada(pendientes) {
	if (!pendientes || pendientes.length === 0) return true;
	return pendientes.every((m) => m.avisos.ultimo_enviado_at !== null && !m.avisos.promesa_vencida);
}
/**
* Orden de 01 §4.17 que NO cambia al crear el plan. Qué tiendas entran (con pendientes por avisar o con una promesa
* vencida) lo decide dominio.ordenTiendasAvisar; el orden se recalcula aquí porque el de dominio ordena por la salud
* recalculada (`socio_con_pendientes` → `con_pendientes` → `con_plan`), y esa salud baja a «con plan» toda tienda cuyas
* pendientes ya tienen fecha: tras «Crear mi plan» una tienda con una pendiente sin fecha (p. ej. «Tienda B», cuya
* única pendiente no se puede etiquetar y no entra al plan) se adelantaba a todas y el recorrido dejaba de empezar en
* «1 de 10 · Tienda Ejemplo» (01 §5.1 paso 3). Aquí «socio con pendientes» es socio con pendientes sin video,
* planeadas o no: promesas vencidas → socio → comisión de 180 días → nº de pendientes → valor recibido (máx. y mín.)
* → tienda_key.
*/
function ordenAvisar(tiendas, pendientes, avisos, hoy) {
	const porTienda = pendientesPorTienda(pendientes);
	const filas = ordenTiendasAvisar(tiendas, pendientes, avisos, hoy).map((t) => {
		const pend = porTienda.get(t.tienda_key) ?? [];
		return {
			t,
			vencidas: pend.filter((m) => m.avisos.promesa_vencida || m.avisos.promesa !== null && hoy > m.avisos.promesa && m.avance.etapa !== "publicada").length,
			socio: t.es_socio && pend.length > 0 ? 0 : 1,
			pendientes: pend.length
		};
	});
	filas.sort((a, b) => (b.vencidas > 0 ? 1 : 0) - (a.vencidas > 0 ? 1 : 0) || b.vencidas - a.vencidas || a.socio - b.socio || b.t.ventas.comision_180d_centavos - a.t.ventas.comision_180d_centavos || b.pendientes - a.pendientes || b.t.muestras.valor_recibido_max_centavos - a.t.muestras.valor_recibido_max_centavos || b.t.muestras.valor_recibido_min_centavos - a.t.muestras.valor_recibido_min_centavos || (a.t.tienda_key < b.t.tienda_key ? -1 : a.t.tienda_key > b.t.tienda_key ? 1 : 0));
	return filas.map((f) => f.t);
}
/** Claves de las tiendas por avisar en el orden de 01 §4.17 (ordenAvisar). */
function armarRecorrido(tiendas, pendientes, avisos, hoy) {
	return ordenAvisar(tiendas, pendientes, avisos, hoy).map((t) => t.tienda_key);
}
/**
* Tiendas con pendientes que YA estaban avisadas al abrir (no se recorren, pero cuentan en «Tienda 3 de 30» y se ven con
* ✓ en la lista). Van en el mismo orden de atención, calculado como si nadie estuviera avisado.
*/
function tiendasPrevias(tiendas, pendientes, porAvisar, hoy) {
	const enRecorrido = new Set(porAvisar);
	return ordenAvisar(tiendas, pendientes, [], hoy).map((t) => t.tienda_key).filter((k) => !enRecorrido.has(k));
}
/** Sin ningún plan: ninguna pendiente tiene día ni hora programada (01 §4.17: «Arma tu plan para darles fechas reales»). */
function sinPlan(pendientes) {
	return pendientes.every((m) => m.avance.fecha_planeada === null && m.avance.programada_para_at === null);
}
var AVISAR_VACIO = {
	recorrido: [],
	previas: [],
	actual: null,
	saltadas: [],
	iniciado: false
};
/** La siguiente tienda por avisar después de `desde` (sin las avisadas ni las saltadas); null si no queda ninguna. */
function siguientePorAvisar(recorrido, desde, avisadas, saltadas) {
	const inicio = desde === null ? 0 : recorrido.indexOf(desde) + 1;
	for (let i = 0; i < recorrido.length; i++) {
		const k = recorrido[(inicio + i) % recorrido.length];
		if (k !== void 0 && k !== desde && !avisadas.has(k) && !saltadas.has(k)) return k;
	}
	return null;
}
function reducirAvisar(e, a) {
	switch (a.tipo) {
		case "iniciar": {
			if (e.iniciado) return e;
			const previas = [...new Set(a.previas ?? [])].filter((k) => !a.recorrido.includes(k));
			const recorrido = [.../* @__PURE__ */ new Set([...previas, ...a.recorrido])];
			return {
				recorrido,
				previas,
				actual: siguientePorAvisar(recorrido, null, /* @__PURE__ */ new Set([...a.avisadas, ...previas]), /* @__PURE__ */ new Set()),
				saltadas: [],
				iniciado: true
			};
		}
		case "avisada": {
			if (e.actual !== a.tienda) return e;
			const avisadas = /* @__PURE__ */ new Set([...a.avisadas, a.tienda]);
			const saltadas = e.saltadas.filter((k) => k !== a.tienda);
			return {
				...e,
				saltadas,
				actual: siguientePorAvisar(e.recorrido, a.tienda, avisadas, new Set(saltadas))
			};
		}
		case "saltar": {
			if (e.actual !== a.tienda) return e;
			const saltadas = e.saltadas.includes(a.tienda) ? e.saltadas : [...e.saltadas, a.tienda];
			return {
				...e,
				saltadas,
				actual: siguientePorAvisar(e.recorrido, a.tienda, new Set(a.avisadas), new Set(saltadas))
			};
		}
		case "elegir": return e.recorrido.includes(a.tienda) ? {
			...e,
			actual: a.tienda,
			saltadas: e.saltadas.filter((k) => k !== a.tienda)
		} : e;
		case "volverASaltadas": return {
			...e,
			saltadas: [],
			actual: siguientePorAvisar(e.recorrido, null, new Set(a.avisadas), /* @__PURE__ */ new Set())
		};
	}
}
/** Posición 1-based de la tienda actual dentro del recorrido («1 de 10»). */
function posicionEnRecorrido(e) {
	return e.actual === null ? e.recorrido.length : e.recorrido.indexOf(e.actual) + 1;
}
var Avisar_module_default = {
	pantalla: "_pantalla_11mq4_3",
	progreso: "_progreso_11mq4_9",
	progresoFila: "_progresoFila_11mq4_15",
	barra: "_barra_11mq4_21",
	progresoTexto: "_progresoTexto_11mq4_24",
	posicion: "_posicion_11mq4_32",
	posicionMovil: "_posicionMovil_11mq4_33",
	dosColumnas: "_dosColumnas_11mq4_49",
	lista: "_lista_11mq4_56",
	listaTitulo: "_listaTitulo_11mq4_70",
	listaItems: "_listaItems_11mq4_73",
	listaItem: "_listaItem_11mq4_73",
	listaNombre: "_listaNombre_11mq4_121",
	listaEstado: "_listaEstado_11mq4_126",
	listaConteo: "_listaConteo_11mq4_136",
	tienda: "_tienda_11mq4_149",
	entrarTienda: "_entrarTienda_11mq4_1",
	tiendaCabeza: "_tiendaCabeza_11mq4_171",
	tiendaTextos: "_tiendaTextos_11mq4_177",
	tiendaNombre: "_tiendaNombre_11mq4_183",
	tiendaMeta: "_tiendaMeta_11mq4_194",
	socio: "_socio_11mq4_219",
	porque: "_porque_11mq4_226",
	fotosTienda: "_fotosTienda_11mq4_233",
	fotoTienda: "_fotoTienda_11mq4_240",
	fotoMas: "_fotoMas_11mq4_250",
	chipSalud: "_chipSalud_11mq4_258",
	muestras: "_muestras_11mq4_261",
	editor: "_editor_11mq4_269",
	otras: "_otras_11mq4_274",
	intro: "_intro_11mq4_284",
	introIcono: "_introIcono_11mq4_299",
	introTitulo: "_introTitulo_11mq4_308",
	introTexto: "_introTexto_11mq4_316",
	introAcciones: "_introAcciones_11mq4_323",
	introTiendas: "_introTiendas_11mq4_329",
	introTienda: "_introTienda_11mq4_329",
	introTiendaNombre: "_introTiendaNombre_11mq4_346",
	introTiendaTexto: "_introTiendaTexto_11mq4_359",
	cierre: "_cierre_11mq4_377",
	cierreTicket: "_cierreTicket_11mq4_389",
	cierreTitulo: "_cierreTitulo_11mq4_392",
	cierreTexto: "_cierreTexto_11mq4_404",
	cierreAcciones: "_cierreAcciones_11mq4_411"
};
/**
* #/muestras/avisos · Avisar a mis tiendas, modo enfoque (01 §4.17). Una tienda por pantalla en el orden de
* dominio.ordenTiendasAvisar, con el mensaje ya armado (EditorMensaje de @/bloques en modo 'avisar': plantilla elegida
* sola, fechas del plan, agradecimiento de socio) y 2 toques por tienda: Android [Copiar y abrir TikTok] (copia,
* guarda «copiado, sin confirmar» y abre la app de TikTok) → [Sí, siguiente]; Windows [Copiar mensaje] → [Sí,
* siguiente]. Ninguna tienda queda avisada sin esa confirmación. Progreso «{5} de {30} tiendas avisadas»; al reabrir
* continúa en la primera por avisar. Sin conexión funciona completo en el celular con la copia (los avisos viajan a la
* PC al reconectar; el aviso «Sin conexión con tu PC…» es el banner global de ui-marco, no se repite aquí). Escritorio: lista de tiendas a la izquierda (✓ avisadas) y la tienda actual a la derecha;
* Enter = Copiar · S = Sí, siguiente · → = Saltar.
*/
/** Textos fijos de los botones del editor (01 §4.8/§4.17) para los atajos de teclado del escritorio. */
var BOTON_COPIAR = "Copiar mensaje";
var BOTON_SI_SIGUIENTE = "Sí, siguiente";
function pulsarBoton(raiz, texto) {
	const boton = raiz ? [...raiz.querySelectorAll("button")].find((b) => b.textContent?.trim() === texto && !b.disabled) : void 0;
	if (!boton) return false;
	boton.click();
	return true;
}
function focoLibre() {
	const a = typeof document === "undefined" ? null : document.activeElement;
	return !(a instanceof HTMLElement) || a === document.body || a.closest("button, a, input, select, textarea, [role=\"menu\"], [role=\"dialog\"], [role=\"radio\"]") === null;
}
function PantallaAvisar() {
	const datos = useDatosTrabajo();
	const tiendas = useConsulta("tiendas", {});
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const movil = clase === "compacta";
	const [mostrarNotaPc, marcarNotaPc] = usePrimeraVez("avisar-nota-pc");
	const [introSinPlan, setIntroSinPlan] = (0, import_react.useState)(true);
	const [e, despachar] = (0, import_react.useReducer)(reducirAvisar, AVISAR_VACIO);
	const editor = (0, import_react.useRef)(null);
	const hoy = hoyLocal();
	const porTienda = (0, import_react.useMemo)(() => pendientesPorTienda(datos.pendientes), [datos.pendientes]);
	const filas = (0, import_react.useMemo)(() => new Map((tiendas.datos?.items ?? []).map((t) => [t.tienda_key, t])), [tiendas.datos]);
	const avisadas = (0, import_react.useMemo)(() => {
		const previas = new Set(e.previas);
		return e.recorrido.filter((k) => previas.has(k) || tiendaAvisada(porTienda.get(k)));
	}, [
		e.recorrido,
		e.previas,
		porTienda
	]);
	const conteo = (0, import_react.useMemo)(() => contarTrabajo(datos.pendientes, datos.avisos, hoy), [
		datos.pendientes,
		datos.avisos,
		hoy
	]);
	const listo = datos.listo && tiendas.datos !== void 0;
	(0, import_react.useEffect)(() => {
		if (!listo || e.iniciado) return;
		const filasTiendas = tiendas.datos?.items ?? [];
		const recorrido = armarRecorrido(filasTiendas, datos.pendientes, datos.avisos, hoy);
		const previas = tiendasPrevias(filasTiendas, datos.pendientes, recorrido, hoy);
		despachar({
			tipo: "iniciar",
			recorrido,
			previas,
			avisadas: recorrido.filter((k) => tiendaAvisada(porTienda.get(k)))
		});
	}, [
		listo,
		e.iniciado,
		tiendas.datos,
		datos.pendientes,
		datos.avisos,
		hoy,
		porTienda
	]);
	const actual = e.actual;
	const actualAvisada = actual !== null && avisadas.includes(actual);
	(0, import_react.useEffect)(() => {
		if (actual !== null && actualAvisada) despachar({
			tipo: "avisada",
			tienda: actual,
			avisadas
		});
	}, [
		actual,
		actualAvisada,
		avisadas
	]);
	const saltar = () => {
		if (actual) despachar({
			tipo: "saltar",
			tienda: actual,
			avisadas
		});
	};
	useAtajos([
		{
			teclas: "Enter",
			descripcion: BOTON_COPIAR,
			accion: () => void pulsarBoton(editor.current, BOTON_COPIAR),
			cuando: () => actual !== null && focoLibre()
		},
		{
			teclas: "s",
			descripcion: BOTON_SI_SIGUIENTE,
			accion: () => void pulsarBoton(editor.current, BOTON_SI_SIGUIENTE),
			cuando: () => actual !== null
		},
		{
			teclas: "ArrowRight",
			descripcion: T.saltarTienda,
			accion: saltar,
			cuando: () => actual !== null && focoLibre()
		}
	], !android);
	const total = conteo.tiendas_con_pendientes;
	const nAvisadas = conteo.tiendas_avisadas;
	const progreso = total > 0 ? nAvisadas / total : 1;
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo: T.avisarTitulo,
		...movil ? {} : { contexto: T.avisarContexto },
		...!movil || android ? { volver: {
			a: "/muestras",
			etiqueta: T.muestras
		} } : {},
		...listo && actual !== null && !movil && !android ? { acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Avisar_module_default.posicion),
			children: T.tiendaDe(posicionEnRecorrido(e), e.recorrido.length)
		}) } : {}
	});
	let cuerpo;
	if (!listo) {
		const error = datos.error ?? (tiendas.datos === void 0 ? tiendas.error : null);
		cuerpo = error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorFlujo, {
			error,
			titulo: T.avisarError,
			alReintentar: () => {
				datos.refrescar();
				tiendas.refrescar();
			}
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, { filas: 3 });
	} else if (e.iniciado && e.recorrido.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(flujos_module_default.estadoCentro),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleCheckBig",
			titulo: T.avisadasTodasTitulo,
			texto: T.avisadasTodasTexto,
			accion: {
				etiqueta: T.volverInicio,
				alPulsar: () => navegar("/inicio")
			}
		})
	});
	else if (e.iniciado && actual === null) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cierre, {
		avisadas: nAvisadas,
		total,
		saltadas: e.saltadas.filter((k) => !avisadas.includes(k)).length,
		alVolverASaltadas: () => despachar({
			tipo: "volverASaltadas",
			avisadas
		})
	});
	else if (!e.iniciado || actual === null) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoFlujo, { filas: 3 });
	else if (introSinPlan && sinPlan(datos.pendientes)) {
		const intro = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: cx(Avisar_module_default.intro),
			"aria-labelledby": "flujos-avisar-intro",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Avisar_module_default.introIcono),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarDays",
						tamano: 24
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "flujos-avisar-intro",
					className: cx(Avisar_module_default.introTitulo),
					children: T.sinPlanTitulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx(Avisar_module_default.introTexto),
					children: T.sinPlanTexto
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Avisar_module_default.introAcciones),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "lg",
						icono: "CalendarDays",
						alPulsar: () => navegar("/muestras/plan"),
						children: T.armarPlanUnMinuto
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						tamano: "lg",
						alPulsar: () => setIntroSinPlan(false),
						children: T.elegirFechasMano
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Avisar_module_default.introTiendas),
					"aria-label": T.primerasTiendas,
					children: e.recorrido.slice(0, 5).map((k) => {
						const m = (porTienda.get(k) ?? [])[0];
						const nombre = filas.get(k)?.nombre ?? m?.tienda.nombre ?? k;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cx(Avisar_module_default.introTienda),
							children: [m ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
								url: m.producto.imagen,
								alt: "",
								anchoCss: 120,
								proporcion: "1:1",
								radio: "md",
								tienda: nombre,
								categoria: m.producto.categoria
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cx(Avisar_module_default.introTiendaNombre),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
									nombre,
									tamano: 16
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Avisar_module_default.introTiendaTexto),
									children: nombre
								})]
							})]
						}, k);
					})
				})
			]
		});
		cuerpo = movil ? intro : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Avisar_module_default.dosColumnas),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaTiendas, {
				recorrido: e.recorrido,
				actual,
				avisadas,
				saltadas: e.saltadas,
				filas,
				porTienda,
				alElegir: (k) => {
					setIntroSinPlan(false);
					despachar({
						tipo: "elegir",
						tienda: k
					});
				}
			}), intro]
		});
	} else {
		const fila = filas.get(actual);
		const pend = porTienda.get(actual) ?? [];
		const nombre = fila?.nombre ?? pend[0]?.tienda.nombre ?? actual;
		const esSocio = fila?.es_socio ?? pend[0]?.tienda.es_socio ?? false;
		const vencida = pend.some((m) => m.avisos.promesa_vencida);
		const porque = fila?.salud_porque && fila.salud_porque.includes("·") ? fila.salud_porque.split("·").slice(1).join("·").trim() : null;
		const tienda = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: cx(Avisar_module_default.tienda),
			"aria-label": nombre,
			"data-tienda": actual,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: cx(Avisar_module_default.tiendaCabeza),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
							nombre,
							tamano: movil ? 40 : 56
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cx(Avisar_module_default.tiendaTextos),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: cx(Avisar_module_default.tiendaNombre),
									children: nombre
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: cx(Avisar_module_default.tiendaMeta),
									children: [esSocio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cx(Avisar_module_default.socio),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
												nombre: "Star",
												tamano: 14
											}),
											" ",
											T.socio
										]
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.muestrasSinVideo(pend.length) })]
								}),
								porque && !movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cx(Avisar_module_default.porque),
									children: porque
								}) : null
							]
						}),
						fila && !movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
							salud: fila.salud,
							esSocio,
							className: cx(Avisar_module_default.chipSalud)
						}) : null,
						movil ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: cx(Avisar_module_default.fotosTienda),
							"aria-label": T.muestrasDeTienda,
							children: [pend.slice(0, 3).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: cx(Avisar_module_default.fotoTienda),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
									url: m.producto.imagen,
									alt: `${nombreDe(m.producto)}${m.variante ? ` (${m.variante})` : ""}`,
									anchoCss: 48,
									proporcion: "1:1",
									radio: "sm",
									tienda: nombre,
									categoria: m.producto.categoria
								})
							}, m.application_id)), pend.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: cx(Avisar_module_default.fotoTienda, Avisar_module_default.fotoMas),
								children: `+${formato.numero(pend.length - 3)}`
							}) : null]
						}) : null
					]
				}),
				vencida ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
					tono: "critico",
					icono: "CalendarClock",
					children: T.promesaVencida
				}) : null,
				movil ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cx(Avisar_module_default.muestras),
					"aria-label": T.muestrasDeTienda,
					children: pend.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaMuestra, {
						muestra: m,
						variante: "aviso"
					}) }, m.application_id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: editor,
					className: cx(Avisar_module_default.editor),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorMensaje, {
						tiendaKey: actual,
						solicitudes: pend.map((m) => m.application_id),
						modo: "avisar",
						alRegistrar: () => despachar({
							tipo: "avisada",
							tienda: actual,
							avisadas
						})
					}, `${actual}:${pend.map((m) => m.application_id).join(",")}`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Avisar_module_default.otras),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						iconoFinal: "ArrowRight",
						alPulsar: saltar,
						children: T.saltarTienda
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						alPulsar: () => navegar("/inicio"),
						children: T.despuesAvisar
					})]
				})
			]
		}, actual);
		cuerpo = movil ? tienda : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Avisar_module_default.dosColumnas),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaTiendas, {
				recorrido: e.recorrido,
				actual,
				avisadas,
				saltadas: e.saltadas,
				filas,
				porTienda,
				alElegir: (k) => despachar({
					tipo: "elegir",
					tienda: k
				})
			}), tienda]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pantalla, {
		titulo: T.avisarTitulo,
		lista: listo,
		className: cx(flujos_module_default.pantalla, Avisar_module_default.pantalla, datos.refrescando && flujos_module_default.refrescando),
		children: [
			encabezado,
			listo && total > 0 && e.recorrido.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Avisar_module_default.progreso),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Avisar_module_default.progresoFila),
					children: [(movil || android) && actual !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Avisar_module_default.posicionMovil),
						children: T.tiendaDe(posicionEnRecorrido(e), e.recorrido.length)
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Avisar_module_default.progresoTexto),
						"aria-live": "polite",
						children: T.avisadasDe(nAvisadas, total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraProgreso, {
					valor: progreso,
					etiqueta: T.avisadasDe(nAvisadas, total),
					className: cx(Avisar_module_default.barra)
				})]
			}) : null,
			!android && listo && actual !== null && mostrarNotaPc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aviso, {
				tono: "info",
				icono: "Smartphone",
				acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					alPulsar: marcarNotaPc,
					children: T.seguirEnPc
				}),
				children: T.notaPc
			}) : null,
			cuerpo,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservaCapas, {})
		]
	});
}
/** Escritorio: columna izquierda con las tiendas del recorrido (✓ avisadas, la actual resaltada). */
function ListaTiendas(p) {
	const avisadas = new Set(p.avisadas);
	const saltadas = new Set(p.saltadas);
	const refActual = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		refActual.current?.scrollIntoView?.({ block: "nearest" });
	}, [p.actual]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: cx(Avisar_module_default.lista),
		"aria-label": T.listaTiendas,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(flujos_module_default.overline, Avisar_module_default.listaTitulo),
			children: T.listaTiendas
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: cx(Avisar_module_default.listaItems),
			children: p.recorrido.map((k) => {
				const fila = p.filas.get(k);
				const pend = p.porTienda.get(k) ?? [];
				const nombre = fila?.nombre ?? pend[0]?.tienda.nombre ?? k;
				const estado = avisadas.has(k) ? "avisada" : k === p.actual ? "actual" : saltadas.has(k) ? "saltada" : "pendiente";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					ref: k === p.actual ? refActual : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cx(Avisar_module_default.listaItem),
						"data-estado": estado,
						"data-nombre": nombre,
						"aria-current": k === p.actual ? "step" : void 0,
						"aria-disabled": estado === "avisada" ? true : void 0,
						onClick: () => {
							if (estado !== "avisada") p.alElegir(k);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
								nombre,
								tamano: 24
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Avisar_module_default.listaNombre),
								children: nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cx(Avisar_module_default.listaEstado),
								children: estado === "avisada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "Check",
									tamano: 16,
									etiqueta: T.tiendaAvisada
								}) : estado === "saltada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "ArrowRight",
									tamano: 14,
									etiqueta: T.tiendaSaltada
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cx(Avisar_module_default.listaConteo),
									children: formato.numero(pend.length)
								})
							})
						]
					})
				}, k);
			})
		})]
	});
}
/** «¡Avisaste a tus {30} tiendas!» con el ticket de corte en su variante «Estás al día» (02 §7.22). */
function Cierre(p) {
	const titulo = useFocoAlMontar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Avisar_module_default.cierre),
		"aria-labelledby": "flujos-avisar-cierre",
		children: [
			p.saltadas === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
				variante: "al_dia",
				titulo: T.avisarTitulo,
				subtitulo: formato.fechaConDia(hoyLocal()),
				renglones: [{
					concepto: T.tiendaAvisada,
					cifra: formato.numero(p.avisadas)
				}],
				total: T.avisadasDe(p.avisadas, p.total),
				className: cx(Avisar_module_default.cierreTicket)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 56 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "flujos-avisar-cierre",
				ref: titulo,
				tabIndex: -1,
				className: cx(Avisar_module_default.cierreTitulo),
				children: p.saltadas > 0 ? T.faltanSaltadas(p.saltadas) : T.cierreAvisar(p.avisadas)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Avisar_module_default.cierreTexto),
				children: T.avisadasTodasTexto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Avisar_module_default.cierreAcciones),
				children: [p.saltadas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "RotateCcw",
					alPulsar: p.alVolverASaltadas,
					children: T.volverSaltadas
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: p.saltadas > 0 ? "secundario" : "primario",
					tamano: "lg",
					alPulsar: () => navegar("/inicio"),
					children: T.volverInicio
				})]
			})
		]
	});
}
//#endregion
export { PantallaAgenda, PantallaArmarPlan, PantallaAvisar, PantallaSesion };
