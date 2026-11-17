import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $n as usePanelDisponible, A as EnlaceRuta, Bt as diaSemana, F as Foto, Fn as sumarDias, Gn as useClaseAncho, H as Icono, I as GraficaColumnas, J as Menu, K as Kpi, L as GraficaColumnasApiladas, M as Esqueleto, N as EsqueletoVista, P as EstadoVacio, Qt as fechaLocalDe, R as Hoja, S as ETIQUETA_ESTADO_ORDEN, W as Interruptor, Xt as etiquetaContenido, a as BandaKpi, ar as useSesion, er as useParametro, g as Chip, k as EncabezadoPantalla, mn as nombreCorto, mt as Tarjeta, nn as formato, nt as PanelLateral, o as BarraApilada, on as hoyLocal, or as useSync, pt as Tabla, qn as useConsulta, rt as Pantalla, st as Segmentado, tr as usePlataforma, u as Boton, v as ChipFiltro } from "./app-CLiVRbtG.mjs";
import { s as columnasPedidos } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ventas-C15mq0Vb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Convivencia con las capas globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, los avisos
* de @/componentes): todas llevan la marca común `data-capa-corte`. Mientras una está fija abajo, el final de Ventas
* deja un espacio de su mismo alto para que lo último de la página (la paginación de pedidos) pueda subir por encima de ella y nunca
* quede tapado. Sin capas, el espacio es 0. Los diálogos y hojas a pantalla completa no cuentan (tapan a propósito).
*/
/** Alto (px) que hay que dejar libre al final de la página: el de la capa anclada abajo más alta; 0 si no hay. */
function holguraCapas(capas, altoVentana) {
	let holgura = 0;
	for (const r of capas) {
		if (r.width < 1 || r.height < 1) continue;
		if (r.height > altoVentana * .7) continue;
		if (r.bottom < altoVentana - 160) continue;
		holgura = Math.max(holgura, Math.ceil(r.height));
	}
	return holgura;
}
function capasFijas(propio) {
	const salida = [];
	for (const el of document.querySelectorAll("[data-capa-corte]")) {
		if (propio.contains(el)) continue;
		for (const c of [el, ...el.querySelectorAll(":scope > *")]) {
			const s = getComputedStyle(c);
			if (s.visibility === "hidden" || s.display === "none" || s.position !== "fixed") continue;
			salida.push(c.getBoundingClientRect());
		}
	}
	return salida;
}
/**
* Holgura inferior para el elemento `el` (la raíz de la pantalla). Se recalcula cuando cambia el DOM (aparece o se va
* una capa), al cambiar el tamaño de la ventana y al terminar una animación, una vez por cuadro.
*/
function useHolguraCapas(el) {
	const [holgura, setHolgura] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!el || typeof window === "undefined" || typeof MutationObserver === "undefined") return void 0;
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const nueva = holguraCapas(capasFijas(el), window.innerHeight);
			setHolgura((previa) => previa === nueva ? previa : nueva);
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
* Ventas · textos visibles (español de México, vocabulario fijo de 01_ux §1.5: «liquidada», «por liquidar»,
* «reembolsado», «pedido»). Textos exactos de 01 §4.11 donde existen. Las cifras llegan ya formateadas con `formato`.
*/
var plural = (n, uno, varios) => n === 1 ? uno : varios;
var T = {
	titulo: "Ventas",
	contexto: (rango) => `${rango} · por fecha del pedido · hora de la Ciudad de México · montos en MXN`,
	cargando: "Cargando tus ventas…",
	lento: "Sigue cargando… revisa la conexión con tu PC",
	periodo: {
		etiqueta: "Periodo",
		otro: "Otro periodo",
		"7d": "7 días",
		"30d": "30 días",
		"90d": "90 días",
		"12m": "12 meses",
		todo: "Todo",
		largo: {
			"7d": "Últimos 7 días",
			"30d": "Últimos 30 días",
			"90d": "Últimos 90 días",
			"12m": "Últimos 12 meses",
			todo: "Todo"
		},
		esteMes: (mes) => `Este mes (${mes})`,
		mesPasado: (mes) => `Mes pasado (${mes})`,
		mes: (mes) => mes,
		comparar: "Comparar con el periodo anterior",
		vs: {
			"7d": "7 días anteriores",
			"30d": "30 días anteriores",
			"90d": "90 días anteriores",
			mes: "el mes anterior",
			otro: "el periodo anterior"
		}
	},
	kpi: {
		banda: (periodo) => `Tu dinero · ${periodo.charAt(0).toLocaleLowerCase("es-MX")}${periodo.slice(1)}`,
		comision: "Comisión estimada",
		liquidada: "Liquidada",
		porLiquidar: "Por liquidar",
		congelada: "Congelada",
		perdida: "Perdida (reembolsos)",
		pedidos: "Pedidos",
		tasa: "Tasa de reembolso",
		unidades: "Unidades vendidas",
		ventas: "Ventas generadas",
		deEstePeriodo: "De pedidos hechos en este periodo",
		sinReembolsos: "Sin contar reembolsos",
		enRevision: "En revisión de TikTok",
		pedidosReembolsados: (n, cifra) => `${cifra} ${plural(n, "pedido", "pedidos")}`,
		aprox: "Aproximado, con el precio de venta",
		nuevo: "Nuevo",
		pts: (cifra) => `${cifra} pts`
	},
	grafica: {
		metrica: "Métrica",
		agrupar: "Agrupar por",
		metricas: {
			comision: "Comisión",
			pedidos: "Pedidos",
			unidades: "Unidades",
			tasa: "Tasa de reembolso"
		},
		granularidades: {
			dia: "Día",
			semana: "Semana",
			mes: "Mes"
		},
		titulo: (metrica, gran) => {
			return `${metrica === "comision" ? "Comisión" : metrica === "pedidos" ? "Pedidos" : metrica === "unidades" ? "Unidades" : "Tasa de reembolso"} por ${gran === "dia" ? "día" : gran === "semana" ? "semana" : "mes"}`;
		},
		liquidada: "Liquidada",
		porLiquidar: "Por liquidar",
		mejor: (gran, cuando, monto) => `Tu mejor ${gran === "dia" ? "día" : gran === "semana" ? "semana" : "mes"} del periodo: ${cuando} (${monto})`,
		aria: (cuando, comision, pedidos, reembolsados, tasa, enCurso) => `${cuando}${enCurso ? " (en curso)" : ""}: ${comision} de comisión estimada · ${pedidos} pedidos · ${reembolsados} reembolsados (${tasa})`,
		ariaSimple: (cuando, valor, enCurso) => `${cuando}${enCurso ? " (en curso)" : ""}: ${valor}`,
		semanaDel: (desde, hasta) => `Semana del ${desde} al ${hasta}`,
		enCurso: (texto) => `${texto} (en curso)`,
		columnas: {
			comision: [
				"Periodo",
				"Liquidada",
				"Por liquidar",
				"Comisión estimada",
				"Pedidos",
				"Reembolsados"
			],
			pedidos: ["Periodo", "Pedidos"],
			unidades: ["Periodo", "Unidades"],
			tasa: [
				"Periodo",
				"Tasa de reembolso",
				"Reembolsados",
				"Pedidos"
			]
		}
	},
	dinero: {
		titulo: "¿Dónde está tu dinero?",
		liquidada: "Liquidada",
		porLiquidar: "Por liquidar",
		congelada: "Congelada",
		perdida: "Perdida por reembolsos",
		ayudaLiquidada: "Comisión que TikTok ya confirmó para estos pedidos. Si TikTok reporta retenciones (ISR, IVA), las verás aparte.",
		ayudaPorLiquidar: "Pedidos que esperan pago o que todavía pueden devolverse.",
		ayudaCongelada: "Comisión que TikTok tiene en revisión.",
		ayudaPerdida: "Comisión que se canceló porque el comprador devolvió o canceló.",
		total: (monto) => `Tu corte: ${monto} de comisión estimada`,
		columnas: [
			"Concepto",
			"Monto",
			"Parte"
		]
	},
	dependencia: {
		titulo: "De quién depende tu comisión",
		otras: "Otras",
		texto: (tienda, pct) => `${tienda} genera el ${pct} de tu comisión en este periodo.`,
		riesgo: "Depender de una sola tienda es un riesgo.",
		columnas: [
			"Tienda",
			"Comisión estimada",
			"Parte"
		],
		sinVentas: "Sin comisión en este periodo."
	},
	reembolsos: {
		titulo: "Reembolsos",
		texto: (monto) => `Los reembolsos te quitaron ${monto} de comisión en este periodo.`,
		detalle: (reemb, pedidos, tasa) => `${reemb} de ${pedidos} pedidos (${tasa})`,
		grafica: "Tasa de reembolso por mes",
		aria: (mes, tasa, reemb, pedidos) => `${mes}: ${tasa} de reembolso, ${reemb} de ${pedidos} pedidos`,
		columnas: [
			"Mes",
			"Tasa de reembolso",
			"Reembolsados",
			"Pedidos"
		]
	},
	productos: {
		titulo: "Productos que más venden",
		linea: (tienda, unidades) => tienda ? `${tienda} · ${unidades}` : unidades,
		unidades: (n, cifra) => `${cifra} ${plural(n, "unidad", "unidades")}`,
		abrir: (nombre, comision) => `${nombre}: ${comision} de comisión. Abrir el producto`,
		verTodos: "Ver productos",
		vacio: "Ningún producto vendió en este periodo."
	},
	porMes: {
		titulo: "Por mes",
		columnas: [
			"Mes",
			"Pedidos",
			"Reembolsados",
			"Tasa",
			"Comisión estimada",
			"Liquidada"
		],
		alDia: (mes, dia) => `${mes} (al ${dia})`,
		resumen: (pedidos, comision) => `${pedidos} pedidos · ${comision}`
	},
	pedidos: {
		titulo: "Pedidos",
		filtros: "Filtrar pedidos por estado",
		chips: {
			todos: "Todos",
			liquidados: "Liquidados",
			por_liquidar: "Por liquidar",
			reembolsados: "Reembolsados"
		},
		tabla: "Pedidos del periodo",
		lista: "Pedidos del periodo",
		pagina: (actual, total) => `Página ${actual} de ${total}`,
		total: (n, cifra) => `${cifra} ${plural(n, "pedido", "pedidos")}`,
		anterior: "Anterior",
		siguiente: "Siguiente",
		vacio: "No hay pedidos con este filtro",
		vacioTexto: "Prueba con otro estado o con un rango más amplio.",
		verTodos: "Ver todos",
		tarjeta: (fecha, producto, estado, comision) => `${fecha} · ${producto} · ${estado} · ${comision}`,
		masProductos: (n) => `y ${n} ${plural(n, "producto más", "productos más")}`,
		abrir: (producto, fecha) => `Pedido del ${fecha}: ${producto}. Ver el detalle`
	},
	detalle: {
		titulo: (fecha) => `Pedido del ${fecha}`,
		pedido: "Pedido",
		total: "Total del pedido",
		comisionEstimada: "Comisión estimada",
		comisionLiquidada: "Comisión liquidada",
		baseEstimada: "Base de comisión estimada",
		baseReal: "Base de comisión real",
		tasa: "Tasa de comisión",
		estandar: "Estándar",
		anuncios: "Anuncios de la tienda",
		bono: "Bono",
		cantidad: (n, precio) => `${n} × ${precio}`,
		reembolsadas: (n) => `${n} ${plural(n, "unidad reembolsada", "unidades reembolsadas")}`,
		devueltas: (n) => `${n} ${plural(n, "unidad devuelta", "unidades devueltas")}`,
		isr: "ISR",
		iva: "IVA",
		agencia: "Compartido con tu agencia",
		actualizado: (fecha) => `Actualizado por TikTok el ${fecha}`,
		carrusel: "Video carrusel (puede tener comisión menor)",
		contenido: "Contenido",
		verVideo: "Ver el video",
		verProducto: "Ver el producto",
		cerrar: "Cerrar",
		productoSinNombre: "Producto sin nombre"
	},
	estados: {
		sinPedidos: "No hay pedidos en este periodo",
		sinPedidosTexto: "Prueba con un rango más amplio.",
		ver90: "Ver últimos 90 días",
		trayendo: (hechos, total) => `Todavía estamos trayendo tus pedidos (semana ${hechos} de ${total}). Las cifras pueden cambiar.`,
		trayendoSinSemana: "Todavía estamos trayendo tus pedidos. Las cifras pueden cambiar.",
		errorTitulo: "No pudimos cargar tus ventas",
		reintentar: "Reintentar",
		necesitaPc: "Necesita tu PC encendida",
		necesitaPcTexto: "Este periodo no está en la copia de tu celular. Abre Corte en tu PC y conéctate a la misma red, o elige 30 días o Todo.",
		necesitaPcSeccion: "Abre Corte en tu PC y conéctate a la misma red para ver esta sección.",
		errorSeccion: "No pudimos cargar esta sección."
	}
};
var PERIODOS_FIJOS = [
	"7d",
	"30d",
	"90d",
	"12m",
	"todo"
];
function esPeriodoFijo(v) {
	return v !== null && v !== void 0 && PERIODOS_FIJOS.includes(v);
}
/** '7d' · '30d' · '90d' · '12m' · 'todo' · 'YYYY-MM' (01 §4.11: «Este mes», «Mes pasado»). */
function esPeriodo(v) {
	if (esPeriodoFijo(v)) return true;
	if (!v) return false;
	const m = /^(\d{4})-(\d{2})$/.exec(v);
	return !!m && Number(m[2]) >= 1 && Number(m[2]) <= 12;
}
/** Mes 'YYYY-MM' de una fecha y el anterior. */
function mesesRapidos(hoy) {
	const esteMes = hoy.slice(0, 7);
	return {
		esteMes,
		mesPasado: sumarDias(`${esteMes}-01`, -1).slice(0, 7)
	};
}
/** 'feb' · 'feb 2025' (otro año) · largo: 'feb 2026'. */
function etiquetaMes(clave, largo = false) {
	const corto = formato.fechaCorta(`${clave.slice(0, 7)}-01`).replace(/^1 /, "");
	return largo && !/\d{4}$/.test(corto) ? `${corto} ${clave.slice(0, 4)}` : corto;
}
/** Nombre del periodo para el encabezado y la banda: 'Últimos 30 días' · 'nov 2026'. */
function nombrePeriodo(p) {
	if (esPeriodoFijo(p)) return T.periodo.largo[p];
	return etiquetaMes(p, true);
}
/** 'vs. 30 días anteriores' (texto de la variación). */
function textoVs(p) {
	if (p === "7d" || p === "30d" || p === "90d") return T.periodo.vs[p];
	if (!esPeriodoFijo(p)) return T.periodo.vs.mes;
	return T.periodo.vs.otro;
}
/** '14 oct – 12 nov' (rango real que respondió el hub). */
function textoRango(periodo) {
	return periodo.desde === periodo.hasta ? formato.fechaCorta(periodo.desde) : `${formato.fechaCorta(periodo.desde)} – ${formato.fechaCorta(periodo.hasta)}`;
}
/** Fecha del hub («hoy» con que calculó la respuesta): marca el periodo en curso sin depender del reloj del equipo. */
function hoyDelHub(d) {
	return fechaLocalDe(d.generado_at);
}
/** Días del rango, inclusivo: 14 oct – 12 nov = 30. */
function diasDelRango(desde, hasta) {
	return Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 864e5) + 1;
}
/** Agrupar por (01 §4.11): Día ≤ 31 días · Semana ≤ 180 · Mes > 180. */
function granularidadAuto(desde, hasta) {
	const dias = diasDelRango(desde, hasta);
	if (dias <= 31) return "dia";
	if (dias <= 180) return "semana";
	return "mes";
}
/** Granularidades que tienen sentido para el rango (sin cientos de barras diarias). */
function granularidadesPermitidas(desde, hasta) {
	const dias = Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / 864e5) + 1;
	const lista = [];
	if (dias <= 92) lista.push("dia");
	if (dias >= 14 && dias <= 400) lista.push("semana");
	if (dias >= 45) lista.push("mes");
	return lista.length > 0 ? lista : ["dia"];
}
/**
* V14: (actual − anterior) ÷ anterior; anterior 0 → «Nuevo»; `menosEsMejor` invierte el color. Con `vs` = null
* (celular) solo la cifra, '21 %': el interruptor «Comparar con el periodo anterior» está justo arriba.
*/
function variacion(actual, anterior, vs, menosEsMejor = false) {
	if (anterior === null || anterior === void 0) return null;
	if (anterior === 0) return actual > 0 ? {
		texto: T.kpi.nuevo,
		sentido: menosEsMejor ? "desfavorable" : "favorable",
		direccion: "sube"
	} : null;
	const cambio = (actual - anterior) / anterior;
	const direccion = Math.abs(cambio) < .005 ? "igual" : cambio > 0 ? "sube" : "baja";
	const sentido = direccion === "igual" ? "neutro" : direccion === "baja" === menosEsMejor ? "favorable" : "desfavorable";
	const cifra = formato.porcentaje(Math.abs(cambio));
	return {
		texto: vs === null ? cifra : `${cifra} vs. ${vs}`,
		sentido,
		direccion
	};
}
/** La tasa de reembolso varía en puntos porcentuales: '2.4 pts vs. 30 días anteriores' (bajar es bueno). */
function variacionPts(actual, anterior, vs) {
	if (anterior === null || anterior === void 0) return null;
	if (actual === 0 && anterior === 0) return null;
	const pts = Math.round((actual - anterior) * 1e3) / 10;
	const direccion = Math.abs(pts) < .05 ? "igual" : pts > 0 ? "sube" : "baja";
	const sentido = direccion === "igual" ? "neutro" : direccion === "baja" ? "favorable" : "desfavorable";
	const cifra = T.kpi.pts(formato.numero(Math.abs(pts)));
	return {
		texto: vs === null ? cifra : `${cifra} vs. ${vs}`,
		sentido,
		direccion
	};
}
/** Comisión total = liquidada + por liquidar + retenida (Kpis.comision_total_centavos, «número principal»). */
function totalComision(k) {
	return k.comision_liquidada_centavos + k.comision_por_liquidar_centavos + k.comision_retenida_centavos;
}
/**
* Los 8 KPI de 01 §4.11 (+ «Congelada» si hay comisión en revisión, V5). `compacto` (celular): variaciones cortas
* («▼ 21 %»). La tasa lleva «48 pedidos» salvo en Windows con comparación, donde «▼ 2.4 pts vs. 30 días anteriores ·
* 48 pedidos» se partía en dos renglones y desalineaba la banda: los pedidos reembolsados se leen en «Reembolsos».
*/
function kpisVentas(d, comparar, compacto = false) {
	const k = d.kpis;
	const a = comparar ? d.kpis_anterior : null;
	const vs = compacto ? null : textoVs(d.periodo.clave);
	const tasa = variacionPts(k.tasa_reembolso, a?.tasa_reembolso, vs);
	const lista = [
		{
			id: "comision",
			etiqueta: T.kpi.comision,
			valor: formato.dinero(k.comision_total_centavos),
			variacion: variacion(k.comision_total_centavos, a?.comision_total_centavos, vs),
			nota: a ? null : T.kpi.sinReembolsos
		},
		{
			id: "liquidada",
			etiqueta: T.kpi.liquidada,
			valor: formato.dinero(k.comision_liquidada_centavos),
			variacion: null,
			nota: T.kpi.deEstePeriodo
		},
		{
			id: "por_liquidar",
			etiqueta: T.kpi.porLiquidar,
			valor: formato.dinero(k.comision_por_liquidar_centavos),
			variacion: null,
			nota: T.kpi.deEstePeriodo
		},
		{
			id: "perdida",
			etiqueta: T.kpi.perdida,
			valor: formato.dinero(k.comision_perdida_reembolsos_centavos),
			variacion: variacion(k.comision_perdida_reembolsos_centavos, a?.comision_perdida_reembolsos_centavos, vs, true),
			nota: null
		},
		{
			id: "pedidos",
			etiqueta: T.kpi.pedidos,
			valor: formato.numero(k.pedidos),
			variacion: variacion(k.pedidos, a?.pedidos, vs),
			nota: null
		},
		{
			id: "tasa",
			etiqueta: T.kpi.tasa,
			valor: formato.porcentaje(k.tasa_reembolso, 1),
			variacion: tasa,
			nota: tasa && !compacto ? null : T.kpi.pedidosReembolsados(k.pedidos_reembolsados, formato.numero(k.pedidos_reembolsados))
		},
		{
			id: "unidades",
			etiqueta: T.kpi.unidades,
			valor: formato.numero(k.unidades),
			variacion: variacion(k.unidades, a?.unidades, vs),
			nota: null
		},
		{
			id: "ventas",
			etiqueta: T.kpi.ventas,
			valor: formato.dineroAprox(k.ventas_centavos),
			variacion: variacion(k.ventas_centavos, a?.ventas_centavos, vs),
			nota: a ? null : T.kpi.aprox
		}
	];
	if (k.comision_retenida_centavos > 0) lista.splice(3, 0, {
		id: "congelada",
		etiqueta: T.kpi.congelada,
		valor: formato.dinero(k.comision_retenida_centavos),
		variacion: null,
		nota: T.kpi.enRevision
	});
	return lista;
}
var METRICAS = [
	"comision",
	"pedidos",
	"unidades",
	"tasa"
];
/** Periodo en curso (02 §9.4 regla 9): el que contiene la fecha del hub y todavía no termina. */
function enCursoDe(clave, gran, hoyHub) {
	if (gran === "dia") return clave === hoyHub;
	if (gran === "semana") return clave <= hoyHub && sumarDias(clave, 6) > hoyHub;
	const mes = clave.slice(0, 7);
	if (mes !== hoyHub.slice(0, 7)) return false;
	return sumarDias(hoyHub, 1).slice(0, 7) === mes;
}
/**
* Semanas (lunes a domingo, 01 §6.0) a partir de la serie diaria del tablero: todos los campos de PuntoSerie son
* sumas, así que la semana es exacta y no hace falta otra consulta (en el celular sin la PC, la copia solo trae la
* serie del tablero). La clave es el lunes, como la que manda el hub.
*/
function agruparSemanas(puntos) {
	const semanas = /* @__PURE__ */ new Map();
	for (const p of puntos) {
		const lunes = sumarDias(p.clave, -diaSemana(p.clave));
		const s = semanas.get(lunes);
		if (s) {
			s.pedidos += p.pedidos;
			s.pedidos_reembolsados += p.pedidos_reembolsados;
			s.unidades += p.unidades;
			s.ventas_centavos += p.ventas_centavos;
			s.comision_estimada_centavos += p.comision_estimada_centavos;
			s.comision_liquidada_centavos += p.comision_liquidada_centavos;
		} else semanas.set(lunes, {
			...p,
			clave: lunes,
			etiqueta: formato.fechaCorta(lunes)
		});
	}
	return [...semanas.values()].sort((a, b) => a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0);
}
/**
* Meses a partir de la serie diaria del tablero, con la misma clave que manda el hub ('2026-10'). Como en
* agruparSemanas, todos los campos son sumas: el resultado es el mismo que GET /api/serie?granularidad=mes del mismo
* rango (el primer mes trae solo los días del rango, igual que la serie del hub). Así «Por mes» y «Tasa de reembolso
* por mes» funcionan en el celular sin la PC (la copia solo trae la serie del tablero) y no hace falta otra consulta.
*/
function agruparMeses(puntos) {
	const meses = /* @__PURE__ */ new Map();
	for (const p of puntos) {
		const clave = p.clave.slice(0, 7);
		const m = meses.get(clave);
		if (m) {
			m.pedidos += p.pedidos;
			m.pedidos_reembolsados += p.pedidos_reembolsados;
			m.unidades += p.unidades;
			m.ventas_centavos += p.ventas_centavos;
			m.comision_estimada_centavos += p.comision_estimada_centavos;
			m.comision_liquidada_centavos += p.comision_liquidada_centavos;
		} else meses.set(clave, {
			...p,
			clave,
			etiqueta: etiquetaMes(clave)
		});
	}
	return [...meses.values()].sort((a, b) => a.clave < b.clave ? -1 : a.clave > b.clave ? 1 : 0);
}
/**
* `desde` = inicio del rango pedido: una semana que empezó antes (la del 12 oct en «Últimos 30 días», que arranca el
* 14) se nombra desde ahí («Semana del 14 oct al 18 oct»), porque solo trae esos días.
*/
function puntosSerie(puntos, gran, hoyHub, desde) {
	return puntos.map((p) => {
		const inicioSemana = desde && p.clave < desde ? desde : p.clave;
		const etiqueta = gran === "mes" ? etiquetaMes(p.clave) : formato.fechaCorta(gran === "semana" ? inicioSemana : p.clave);
		const cuando = gran === "mes" ? etiquetaMes(p.clave, true) : gran === "semana" ? T.grafica.semanaDel(formato.fechaCorta(inicioSemana), formato.fechaCorta(sumarDias(p.clave, 6))) : formato.fechaConDia(p.clave);
		return {
			clave: p.clave,
			etiqueta,
			cuando,
			enCurso: enCursoDe(p.clave, gran, hoyHub),
			liquidada: p.comision_liquidada_centavos,
			porLiquidar: Math.max(0, p.comision_estimada_centavos - p.comision_liquidada_centavos),
			estimada: p.comision_estimada_centavos,
			pedidos: p.pedidos,
			reembolsados: p.pedidos_reembolsados,
			unidades: p.unidades,
			tasa: p.pedidos > 0 ? p.pedidos_reembolsados / p.pedidos : 0
		};
	});
}
function cuandoTabla(p) {
	return p.enCurso ? T.grafica.enCurso(p.cuando) : p.cuando;
}
/** «Comisión por …»: Liquidada (sólido) + Por liquidar (mismo tono al 35 % con contorno), 02 §9.1. */
function datosApiladas(puntos) {
	return {
		series: [{
			id: "liquidada",
			etiqueta: T.grafica.liquidada,
			estilo: "solido",
			slot: 1
		}, {
			id: "por_liquidar",
			etiqueta: T.grafica.porLiquidar,
			estilo: "tenue",
			slot: 1
		}],
		puntos: puntos.map((p) => ({
			clave: p.clave,
			etiqueta: p.etiqueta,
			valores: {
				liquidada: p.liquidada,
				por_liquidar: p.porLiquidar
			},
			enCurso: p.enCurso,
			aria: T.grafica.aria(p.cuando, formato.dinero(p.estimada), formato.numero(p.pedidos), formato.numero(p.reembolsados), formato.porcentaje(p.tasa), p.enCurso)
		})),
		tabla: {
			columnas: [...T.grafica.columnas.comision],
			filas: puntos.map((p) => [
				cuandoTabla(p),
				formato.dinero(p.liquidada),
				formato.dinero(p.porLiquidar),
				formato.dinero(p.estimada),
				formato.numero(p.pedidos),
				formato.numero(p.reembolsados)
			])
		}
	};
}
/** Pedidos · Unidades · Tasa de reembolso: UNA serie en --viz-mono (02 §9.4 catálogo). */
function datosSimple(puntos, metrica) {
	const valor = (p) => metrica === "pedidos" ? p.pedidos : metrica === "unidades" ? p.unidades : Math.round(p.tasa * 1e3) / 10;
	const texto = (p) => metrica === "pedidos" ? `${formato.numero(p.pedidos)} pedidos` : metrica === "unidades" ? `${formato.numero(p.unidades)} unidades` : `${formato.porcentaje(p.tasa, 1)} de reembolso`;
	const filas = puntos.map((p) => metrica === "tasa" ? [
		cuandoTabla(p),
		formato.porcentaje(p.tasa, 1),
		formato.numero(p.reembolsados),
		formato.numero(p.pedidos)
	] : [cuandoTabla(p), formato.numero(valor(p))]);
	return {
		puntos: puntos.map((p) => ({
			clave: p.clave,
			etiqueta: p.etiqueta,
			valor: valor(p),
			enCurso: p.enCurso,
			aria: T.grafica.ariaSimple(p.cuando, texto(p), p.enCurso)
		})),
		tabla: {
			columnas: [...T.grafica.columnas[metrica]],
			filas
		},
		formatoEje: metrica === "tasa" ? (v) => `${formato.numero(Math.round(v))} %` : (v) => formato.numero(Math.round(v))
	};
}
/** «Tu mejor semana del periodo: 2 mar – 8 mar ($1,234)» (V16, solo hechos; sin el periodo en curso). */
function mejorPeriodo(puntos, gran, desde) {
	const completos = puntos.filter((p) => !p.enCurso && p.estimada > 0);
	if (completos.length < 2) return null;
	const mejor = completos.reduce((a, b) => b.estimada > a.estimada ? b : a);
	const inicio = desde && mejor.clave < desde ? desde : mejor.clave;
	const cuando = gran === "semana" ? `${formato.fechaCorta(inicio)} – ${formato.fechaCorta(sumarDias(mejor.clave, 6))}` : mejor.cuando;
	return T.grafica.mejor(gran, cuando, formato.dinero(mejor.estimada));
}
/** «¿Dónde está tu dinero?»: Liquidada · Por liquidar · (Congelada) · Perdida por reembolsos (rayado). */
function partesDinero(k) {
	const partes = [{
		id: "liquidada",
		etiqueta: T.dinero.liquidada,
		valor: k.comision_liquidada_centavos,
		texto: formato.dinero(k.comision_liquidada_centavos),
		estilo: "solido",
		slot: 1
	}, {
		id: "por_liquidar",
		etiqueta: T.dinero.porLiquidar,
		valor: k.comision_por_liquidar_centavos,
		texto: formato.dinero(k.comision_por_liquidar_centavos),
		estilo: "tenue",
		slot: 1
	}];
	if (k.comision_retenida_centavos > 0) partes.push({
		id: "congelada",
		etiqueta: T.dinero.congelada,
		valor: k.comision_retenida_centavos,
		texto: formato.dinero(k.comision_retenida_centavos),
		estilo: "neutro"
	});
	partes.push({
		id: "perdida",
		etiqueta: T.dinero.perdida,
		valor: k.comision_perdida_reembolsos_centavos,
		texto: formato.dinero(k.comision_perdida_reembolsos_centavos),
		estilo: "rayado"
	});
	const suma = partes.reduce((a, x) => a + Math.max(0, x.valor), 0);
	const ayudas = [
		{
			id: "liquidada",
			titulo: T.dinero.liquidada,
			texto: T.dinero.ayudaLiquidada
		},
		{
			id: "por_liquidar",
			titulo: T.dinero.porLiquidar,
			texto: T.dinero.ayudaPorLiquidar
		},
		...k.comision_retenida_centavos > 0 ? [{
			id: "congelada",
			titulo: T.dinero.congelada,
			texto: T.dinero.ayudaCongelada
		}] : [],
		{
			id: "perdida",
			titulo: T.dinero.perdida,
			texto: T.dinero.ayudaPerdida
		}
	];
	return {
		partes,
		tabla: {
			columnas: [...T.dinero.columnas],
			filas: partes.map((x) => [
				x.etiqueta,
				x.texto,
				formato.porcentaje(suma > 0 ? x.valor / suma : 0, 1)
			])
		},
		ayudas
	};
}
/** «De quién depende tu comisión»: las 5 tiendas con más comisión del periodo (slots 1–5) + «Otras» (neutro). */
function partesDependencia(tiendas, total) {
	const top = [...tiendas].filter((t) => t.ventas.comision_estimada_centavos > 0).sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos).slice(0, 5);
	const suma = top.reduce((a, t) => a + t.ventas.comision_estimada_centavos, 0);
	const otras = Math.max(0, total - suma);
	const base = Math.max(total, suma);
	const slots = [
		1,
		2,
		3,
		4,
		5
	];
	const partes = top.map((t, i) => ({
		id: t.tienda_key,
		etiqueta: t.nombre,
		valor: t.ventas.comision_estimada_centavos,
		texto: formato.dinero(t.ventas.comision_estimada_centavos),
		estilo: "solido",
		slot: slots[i] ?? 5
	}));
	if (otras > 0) partes.push({
		id: "otras",
		etiqueta: T.dependencia.otras,
		valor: otras,
		texto: formato.dinero(otras),
		estilo: "neutro"
	});
	const pct = (v) => formato.porcentaje(base > 0 ? v / base : 0, 1);
	const primera = top[0];
	return {
		partes,
		tabla: {
			columnas: [...T.dependencia.columnas],
			filas: partes.map((x) => [
				x.etiqueta,
				x.texto,
				pct(x.valor)
			])
		},
		principal: primera && base > 0 ? {
			nombre: primera.nombre,
			pct: formato.porcentaje(primera.ventas.comision_estimada_centavos / base),
			fraccion: primera.ventas.comision_estimada_centavos / base
		} : null
	};
}
function puntosReembolsoMes(puntos) {
	return {
		puntos: puntos.map((p) => ({
			clave: p.clave,
			etiqueta: p.etiqueta,
			valor: Math.round(p.tasa * 1e3) / 10,
			enCurso: p.enCurso,
			aria: T.reembolsos.aria(p.cuando, formato.porcentaje(p.tasa, 1), formato.numero(p.reembolsados), formato.numero(p.pedidos))
		})),
		tabla: {
			columnas: [...T.reembolsos.columnas],
			filas: puntos.map((p) => [
				cuandoTabla(p),
				formato.porcentaje(p.tasa, 1),
				formato.numero(p.reembolsados),
				formato.numero(p.pedidos)
			])
		}
	};
}
/** Tabla «Por mes» (01 §4.11 #6): el mes en curso dice «nov (al 12)»; el primero y los de enero llevan año. */
function filasPorMes(puntos, hoyHub) {
	return puntos.map((p, i) => {
		const enCurso = enCursoDe(p.clave, "mes", hoyHub);
		const conAnio = i === 0 || p.clave.endsWith("-01");
		const base = etiquetaMes(p.clave, conAnio);
		return {
			clave: p.clave,
			mes: enCurso ? T.porMes.alDia(base, String(Number(hoyHub.slice(8, 10)))) : base,
			pedidos: formato.numero(p.pedidos),
			reembolsados: formato.numero(p.pedidos_reembolsados),
			tasa: formato.porcentaje(p.pedidos > 0 ? p.pedidos_reembolsados / p.pedidos : 0),
			comision: formato.dinero(p.comision_estimada_centavos),
			liquidada: formato.dinero(p.comision_liquidada_centavos),
			enCurso
		};
	});
}
var FILTROS_PEDIDOS = [
	"todos",
	"liquidados",
	"por_liquidar",
	"reembolsados"
];
function esFiltro(v) {
	return v !== null && v !== void 0 && FILTROS_PEDIDOS.includes(v);
}
/** Chip → estados de la consulta (01 §4.11 #7). 'todos' = sin filtro. */
function estadosDe(f) {
	switch (f) {
		case "liquidados": return ["SETTLED"];
		case "por_liquidar": return ["To-SETTLE", "AWAITING PAYMENT"];
		case "reembolsados": return ["REFUNDED"];
		default: return null;
	}
}
/**
* Defensa: si la fuente devolvió pedidos que no corresponden al filtro o al rango pedidos (no debería con el hub), no
* se muestran. Con el hub es la identidad.
*/
function filtrarPedidos(items, estados, desde, hasta) {
	return items.filter((o) => (!estados || estados.includes(o.estado)) && (!desde || o.fecha >= desde) && (!hasta || o.fecha <= hasta));
}
function totalPaginas(total, porPagina = 50) {
	return Math.max(1, Math.ceil(Math.max(0, total) / porPagina));
}
/** Tono del chip de estado: liquidado ok · por liquidar/esperando info · congelado ámbar · el resto neutro (reembolsado no es riesgo). */
function tonoEstado(e) {
	if (e === "SETTLED") return "ok";
	if (e === "To-SETTLE" || e === "AWAITING PAYMENT") return "info";
	if (e === "FROZEN") return "atencion";
	return "neutro";
}
function etiquetaEstado(e) {
	return ETIQUETA_ESTADO_ORDEN[e];
}
function nombreLinea(l) {
	return l.producto ? nombreCorto(l.producto) : T.detalle.productoSinNombre;
}
/** Tarjeta de celular: '12 nov · Gorra Ejemplo · Por liquidar · $12.34'. */
function textoTarjetaPedido(o) {
	const l = o.lineas[0];
	return {
		fecha: formato.fechaCorta(o.fecha),
		producto: l ? nombreLinea(l) : T.detalle.productoSinNombre,
		estado: etiquetaEstado(o.estado),
		comision: formato.dinero(o.estado === "SETTLED" ? o.comision_real_centavos : o.comision_estimada_centavos, { decimales: true })
	};
}
/** Detalle de una línea (01 §4.11 #7, al expandir): bases, desglose, unidades reembolsadas o devueltas, ISR/IVA y
*  agencia solo si vienen, fecha de actualización y carrusel. */
function detalleLinea(l) {
	const d = [];
	const dinero = (c) => formato.dinero(c, { decimales: true });
	d.push({
		id: "estimada",
		etiqueta: T.detalle.comisionEstimada,
		valor: dinero(l.com_estimada_centavos)
	});
	d.push({
		id: "real",
		etiqueta: T.detalle.comisionLiquidada,
		valor: dinero(l.com_real_centavos)
	});
	if (l.base_estimada_centavos !== null) d.push({
		id: "base_est",
		etiqueta: T.detalle.baseEstimada,
		valor: dinero(l.base_estimada_centavos)
	});
	if (l.base_real_centavos !== null) d.push({
		id: "base_real",
		etiqueta: T.detalle.baseReal,
		valor: dinero(l.base_real_centavos)
	});
	if (l.comision_bp !== null) d.push({
		id: "tasa",
		etiqueta: T.detalle.tasa,
		valor: formato.tasaBp(l.comision_bp)
	});
	if (l.comision_std_bp !== null) d.push({
		id: "std",
		etiqueta: T.detalle.estandar,
		valor: formato.tasaBp(l.comision_std_bp)
	});
	if (l.comision_ads_bp !== null && l.comision_ads_bp > 0) d.push({
		id: "ads",
		etiqueta: T.detalle.anuncios,
		valor: formato.tasaBp(l.comision_ads_bp)
	});
	if (l.comision_bono_bp !== null && l.comision_bono_bp > 0) d.push({
		id: "bono",
		etiqueta: T.detalle.bono,
		valor: formato.tasaBp(l.comision_bono_bp)
	});
	if (l.isr_centavos !== null) d.push({
		id: "isr",
		etiqueta: T.detalle.isr,
		valor: dinero(l.isr_centavos)
	});
	if (l.iva_centavos !== null) d.push({
		id: "iva",
		etiqueta: T.detalle.iva,
		valor: dinero(l.iva_centavos)
	});
	if (l.compartido_agencia_centavos !== null && l.compartido_agencia_centavos > 0) d.push({
		id: "agencia",
		etiqueta: T.detalle.agencia,
		valor: dinero(l.compartido_agencia_centavos)
	});
	if (l.tipo_contenido) d.push({
		id: "contenido",
		etiqueta: T.detalle.contenido,
		valor: etiquetaContenido(l.tipo_contenido)
	});
	return d;
}
/** Notas de la línea: unidades reembolsadas/devueltas, actualización de TikTok y carrusel. */
function notasLinea(l) {
	const n = [];
	if (l.reembolsadas > 0) n.push(T.detalle.reembolsadas(l.reembolsadas));
	if (l.devueltas > 0) n.push(T.detalle.devueltas(l.devueltas));
	if (l.actualizada_at !== null) n.push(T.detalle.actualizado(formato.fechaCorta(l.actualizada_at)));
	if (l.es_carrusel === true) n.push(T.detalle.carrusel);
	return n;
}
/**
* Primera sincronización antes de que lleguen los pedidos recientes (C34, antes del punto de control 2): el tablero
* todavía dice $0 y 0 pedidos, y eso no es «sin ventas». La pantalla muestra «Todavía estamos trayendo tus pedidos…» y
* esqueletos en lugar de cifras.
*/
function ventasTodaviaNo(sync, ultimaSyncOk) {
	if (!sync?.en_curso || (ultimaSyncOk ?? null) !== null || sync.ultima_ok_at !== null) return false;
	const ordenes = sync.pasos.find((p) => p.paso === "ordenes");
	return !ordenes || ![
		"ok",
		"parcial",
		"omitido"
	].includes(ordenes.estado);
}
/** Paso de pedidos de la sincronización en curso (para «Todavía estamos trayendo tus pedidos…»). */
function pasoPedidosEnCurso(sync) {
	if (!sync?.en_curso) return null;
	return sync.pasos.find((p) => (p.paso === "ordenes" || p.paso === "ordenes_anteriores") && p.estado === "en_curso") ?? null;
}
/**
* Semana que se está trayendo (la que sigue a las `hechos` terminadas), como la cuenta el texto del hub en el indicador
* global («Tus ventas recientes: semana 5 de 26…» con 4 hechas): así la franja y el indicador dicen la misma semana.
*/
function semanaQueTrae(paso) {
	if (!paso || !paso.total) return null;
	return {
		n: Math.min(paso.hechos + 1, paso.total),
		total: paso.total
	};
}
var Ventas_module_default = {
	pantalla: "_pantalla_qtqrd_3",
	ventas: "_ventas_qtqrd_8",
	contenido: "_contenido_qtqrd_7",
	bloques: "_bloques_qtqrd_28",
	holgura: "_holgura_qtqrd_35",
	refrescando: "_refrescando_qtqrd_39",
	srSolo: "_srSolo_qtqrd_43",
	estadoGlobal: "_estadoGlobal_qtqrd_51",
	controles: "_controles_qtqrd_56",
	segmentoPeriodo: "_segmentoPeriodo_qtqrd_62",
	comparar: "_comparar_qtqrd_65",
	controlesCompactos: "_controlesCompactos_qtqrd_68",
	chipsPeriodo: "_chipsPeriodo_qtqrd_74",
	kpis: "_kpis_qtqrd_93",
	filaDos: "_filaDos_qtqrd_98",
	tarjeta: "_tarjeta_qtqrd_109",
	seccion: "_seccion_qtqrd_115",
	tarjetaTitulo: "_tarjetaTitulo_qtqrd_122",
	vacioSuave: "_vacioSuave_qtqrd_130",
	textoNota: "_textoNota_qtqrd_135",
	enlacePie: "_enlacePie_qtqrd_141",
	producto: "_producto_qtqrd_158",
	tarjetaPedido: "_tarjetaPedido_qtqrd_159",
	lineaNombre: "_lineaNombre_qtqrd_160",
	mesResumen: "_mesResumen_qtqrd_161",
	graficaControles: "_graficaControles_qtqrd_167",
	segmentoMetrica: "_segmentoMetrica_qtqrd_174",
	graficaControlesCompactos: "_graficaControlesCompactos_qtqrd_177",
	chipsMetrica: "_chipsMetrica_qtqrd_183",
	segmentoGran: "_segmentoGran_qtqrd_197",
	notaGrafica: "_notaGrafica_qtqrd_200",
	corte: "_corte_qtqrd_208",
	ayudas: "_ayudas_qtqrd_214",
	ayuda: "_ayuda_qtqrd_214",
	reembolsoTexto: "_reembolsoTexto_qtqrd_244",
	productos: "_productos_qtqrd_253",
	productoRanking: "_productoRanking_qtqrd_278",
	productoFotoGrande: "_productoFotoGrande_qtqrd_284",
	productoFoto: "_productoFoto_qtqrd_284",
	productoTextos: "_productoTextos_qtqrd_288",
	productoNombre: "_productoNombre_qtqrd_294",
	productoLinea: "_productoLinea_qtqrd_303",
	productoCifra: "_productoCifra_qtqrd_310",
	tablaDesplaza: "_tablaDesplaza_qtqrd_319",
	tablaMeses: "_tablaMeses_qtqrd_324",
	num: "_num_qtqrd_364",
	mesesLista: "_mesesLista_qtqrd_370",
	mesDetalle: "_mesDetalle_qtqrd_375",
	mesNombre: "_mesNombre_qtqrd_391",
	mesCifra: "_mesCifra_qtqrd_394",
	mesDatos: "_mesDatos_qtqrd_398",
	pedidosCabeza: "_pedidosCabeza_qtqrd_418",
	pedidosTotal: "_pedidosTotal_qtqrd_424",
	chipsPedidos: "_chipsPedidos_qtqrd_429",
	tablaPedidos: "_tablaPedidos_qtqrd_447",
	tablaEnTarjeta: "_tablaEnTarjeta_qtqrd_454",
	vacioPedidos: "_vacioPedidos_qtqrd_457",
	listaPedidos: "_listaPedidos_qtqrd_460",
	tarjetaPedidoTextos: "_tarjetaPedidoTextos_qtqrd_486",
	tarjetaPedidoProducto: "_tarjetaPedidoProducto_qtqrd_492",
	tarjetaPedidoMeta: "_tarjetaPedidoMeta_qtqrd_501",
	tarjetaPedidoDerecha: "_tarjetaPedidoDerecha_qtqrd_505",
	tarjetaPedidoCifra: "_tarjetaPedidoCifra_qtqrd_511",
	paginacion: "_paginacion_qtqrd_516",
	paginaTexto: "_paginaTexto_qtqrd_523",
	detalle: "_detalle_qtqrd_530",
	detalleCabeza: "_detalleCabeza_qtqrd_536",
	detalleId: "_detalleId_qtqrd_542",
	detalleTotales: "_detalleTotales_qtqrd_547",
	lineas: "_lineas_qtqrd_571",
	linea: "_linea_qtqrd_160",
	lineaCabeza: "_lineaCabeza_qtqrd_586",
	lineaTextos: "_lineaTextos_qtqrd_592",
	lineaMeta: "_lineaMeta_qtqrd_608",
	lineaDatos: "_lineaDatos_qtqrd_612",
	lineaNotas: "_lineaNotas_qtqrd_634",
	avisoSeccion: "_avisoSeccion_qtqrd_646",
	avisoIcono: "_avisoIcono_qtqrd_655",
	avisoTextos: "_avisoTextos_qtqrd_665",
	trayendo: "_trayendo_qtqrd_680",
	trayendoIcono: "_trayendoIcono_qtqrd_692",
	carga: "_carga_qtqrd_697",
	esqKpis: "_esqKpis_qtqrd_702",
	esqDos: "_esqDos_qtqrd_707",
	esqSeccion: "_esqSeccion_qtqrd_712"
};
function Controles(p) {
	const { esteMes, mesPasado } = mesesRapidos(p.hoy);
	const opcionesMes = [{
		id: esteMes,
		etiqueta: T.periodo.esteMes(etiquetaMes(esteMes))
	}, {
		id: mesPasado,
		etiqueta: T.periodo.mesPasado(etiquetaMes(mesPasado))
	}];
	const menuMeses = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
		etiqueta: T.periodo.otro,
		icono: "CalendarDays",
		disparador: "boton",
		opciones: opcionesMes.map((o) => ({
			id: o.id,
			etiqueta: o.etiqueta,
			...o.id === p.periodo ? { icono: "Check" } : {},
			alPulsar: () => p.alCambiarPeriodo(o.id)
		}))
	});
	const comparar = p.puedeComparar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
		activo: p.comparar,
		alCambiar: p.alCambiarComparar,
		etiqueta: T.periodo.comparar,
		className: Ventas_module_default.comparar
	}) : null;
	if (p.compacto) {
		const mesActivo = !esPeriodoFijo(p.periodo);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Ventas_module_default.controlesCompactos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.chipsPeriodo,
				role: "group",
				"aria-label": T.periodo.etiqueta,
				children: [PERIODOS_FIJOS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
					activo: p.periodo === x,
					alCambiar: () => p.alCambiarPeriodo(x),
					children: T.periodo[x]
				}, x)), opcionesMes.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
					activo: mesActivo && p.periodo === o.id,
					alCambiar: () => p.alCambiarPeriodo(o.id),
					children: etiquetaMes(o.id, true)
				}, o.id))]
			}), comparar]
		});
	}
	const opciones = PERIODOS_FIJOS.map((x) => ({
		valor: x,
		etiqueta: T.periodo[x]
	}));
	if (!esPeriodoFijo(p.periodo)) opciones.push({
		valor: p.periodo,
		etiqueta: etiquetaMes(p.periodo, true)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Ventas_module_default.controles,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
				etiqueta: T.periodo.etiqueta,
				opciones,
				valor: p.periodo,
				alCambiar: (v) => {
					if (esPeriodo(v)) p.alCambiarPeriodo(v);
				},
				className: Ventas_module_default.segmentoPeriodo
			}),
			menuMeses,
			comparar
		]
	});
}
function CargaVentas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: Ventas_module_default.carga,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Ventas_module_default.srSolo,
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: Ventas_module_default.esqKpis,
				children: [
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				alto: 300
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.esqDos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 200
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 200
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "fila",
				lineas: 6
			})
		]
	});
}
function EsqueletoSeccion(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Ventas_module_default.esqSeccion,
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "titulo",
			ancho: 220
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "bloque",
			alto: p.alto ?? 160
		})]
	});
}
function AvisoSeccion(p) {
	const necesitaPc = p.error.codigo === "necesita_pc";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Ventas_module_default.avisoSeccion,
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Ventas_module_default.avisoIcono,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: necesitaPc ? "Monitor" : "CircleAlert",
					tamano: 18
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Ventas_module_default.avisoTextos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: necesitaPc ? T.estados.necesitaPc : T.estados.errorSeccion }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: necesitaPc ? T.estados.necesitaPcSeccion : p.error.mensaje })]
			}),
			!necesitaPc && p.alReintentar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "RotateCcw",
				alPulsar: p.alReintentar,
				children: T.estados.reintentar
			}) : null
		]
	});
}
function FranjaTrayendo(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: Ventas_module_default.trayendo,
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "RefreshCw",
			tamano: 16,
			className: Ventas_module_default.trayendoIcono
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.texto })]
	});
}
function DondeDinero(p) {
	const d = partesDinero(p.kpis);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraApilada, {
				titulo: T.dinero.titulo,
				partes: d.partes,
				tablaGemela: d.tabla
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Ventas_module_default.corte,
				children: T.dinero.total(formato.dinero(totalComision(p.kpis)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: Ventas_module_default.ayudas,
				children: d.ayudas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Ventas_module_default.ayuda,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: a.titulo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: a.texto })]
				}, a.id))
			})
		]
	});
}
function Dependencia(p) {
	let cuerpo;
	if (!p.tiendas && p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: Ventas_module_default.tarjetaTitulo,
		children: T.dependencia.titulo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	})] });
	else if (!p.tiendas) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto: 120 });
	else {
		const d = partesDependencia(p.tiendas, p.total);
		cuerpo = d.partes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: Ventas_module_default.tarjetaTitulo,
			children: T.dependencia.titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: Ventas_module_default.vacioSuave,
			children: T.dependencia.sinVentas
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraApilada, {
			titulo: T.dependencia.titulo,
			partes: d.partes,
			etiquetasDirectas: true,
			tablaGemela: d.tabla
		}), d.principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: Ventas_module_default.textoNota,
			children: [T.dependencia.texto(d.principal.nombre, d.principal.pct), d.principal.fraccion >= .5 ? ` ${T.dependencia.riesgo}` : ""]
		}) : null] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: cuerpo
	});
}
function GraficaPrincipal(p) {
	const alto = p.compacto ? 200 : 260;
	let grafica;
	if (!p.puntos && p.error) grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.puntos) grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto });
	else if (p.metrica === "comision") {
		const d = datosApiladas(p.puntos);
		grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnasApiladas, {
			titulo: T.grafica.titulo("comision", p.granularidad),
			series: d.series,
			puntos: d.puntos,
			formatoEje: (v) => formato.ejeDinero(v),
			alto,
			tablaGemela: d.tabla
		});
	} else {
		const d = datosSimple(p.puntos, p.metrica);
		grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
			titulo: T.grafica.titulo(p.metrica, p.granularidad),
			puntos: d.puntos,
			formatoEje: d.formatoEje,
			alto,
			tablaGemela: d.tabla
		});
	}
	const mejor = p.puntos && p.metrica === "comision" ? mejorPeriodo(p.puntos, p.granularidad, p.desde) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: [
			p.compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.graficaControlesCompactos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: Ventas_module_default.chipsMetrica,
					role: "group",
					"aria-label": T.grafica.metrica,
					children: METRICAS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
						activo: p.metrica === m,
						alCambiar: () => p.alCambiarMetrica(m),
						children: T.grafica.metricas[m]
					}, m))
				}), p.permitidas.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
					etiqueta: T.grafica.agrupar,
					opciones: p.permitidas.map((g) => ({
						valor: g,
						etiqueta: T.grafica.granularidades[g]
					})),
					valor: p.granularidad,
					alCambiar: p.alCambiarGranularidad,
					anchoCompleto: true
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.graficaControles,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
					etiqueta: T.grafica.metrica,
					opciones: METRICAS.map((m) => ({
						valor: m,
						etiqueta: T.grafica.metricas[m]
					})),
					valor: p.metrica,
					alCambiar: p.alCambiarMetrica,
					className: Ventas_module_default.segmentoMetrica
				}), p.permitidas.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
					etiqueta: T.grafica.agrupar,
					opciones: p.permitidas.map((g) => ({
						valor: g,
						etiqueta: T.grafica.granularidades[g]
					})),
					valor: p.granularidad,
					alCambiar: p.alCambiarGranularidad,
					className: Ventas_module_default.segmentoGran
				}) : null]
			}),
			grafica,
			mejor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Ventas_module_default.notaGrafica,
				children: mejor
			}) : null
		]
	});
}
function Kpis(p) {
	const kpis = kpisVentas(p.tablero, p.comparar, p.compacto === true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandaKpi, {
		titulo: T.kpi.banda(nombrePeriodo(p.tablero.periodo.clave)),
		className: Ventas_module_default.kpis,
		children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
			etiqueta: k.etiqueta,
			valor: k.valor,
			variacion: k.variacion,
			...k.nota ? { nota: k.nota } : {}
		}, k.id))
	});
}
/**
* Pedidos (01 §4.11 #7): chips «Todos · Liquidados · Por liquidar · Reembolsados», tabla con las columnas de
* columnasPedidos() en Windows (fila seleccionada → panel de 480 desde 1280; si no, hoja) y tarjetas «12 nov · Gorra
* Ejemplo · Por liquidar · $12.34» en celular, paginación de 50 y el detalle de cada línea (bases, desglose, unidades
* reembolsadas o devueltas, ISR/IVA y agencia si vienen, actualización de TikTok y carrusel).
*/
/**
* Anchos de las columnas de columnasPedidos() dentro de la tarjeta: con los de omisión (952 px fijos) la tabla pasaba
* de los 928 px útiles a 1280×800 y «Comisión liquidada» quedaba cortada en el borde. Solo se ajusta `ancho` de las
* columnas que existan; el resto de la definición (celdas, orden, prescindibles) es la de @/bloques.
*/
var ANCHOS_PEDIDOS = {
	fecha: 108,
	estado: 152,
	total: 108,
	estimada: 144,
	liquidada: 144
};
var COLUMNAS_PEDIDOS = columnasPedidos().map((c) => {
	const ancho = ANCHOS_PEDIDOS[c.id];
	return ancho !== void 0 && typeof c.ancho === "number" ? {
		...c,
		ancho
	} : c;
});
/** Contenido del detalle de un pedido (panel de 480 o hoja). */
function DetallePedido(p) {
	const o = p.orden;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Ventas_module_default.detalle,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.detalleCabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: tonoEstado(o.estado),
					children: etiquetaEstado(o.estado)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Ventas_module_default.detalleId,
					children: [
						T.detalle.pedido,
						" ",
						formato.idCorto(o.order_id)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: Ventas_module_default.detalleTotales,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.detalle.total }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.dinero(o.total_centavos, { decimales: true }) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.detalle.comisionEstimada }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.dinero(o.comision_estimada_centavos, { decimales: true }) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T.detalle.comisionLiquidada }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.dinero(o.comision_real_centavos, { decimales: true }) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: Ventas_module_default.lineas,
				children: o.lineas.map((l, i) => {
					const nombre = nombreLinea(l);
					const notas = notasLinea(l);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: Ventas_module_default.linea,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: Ventas_module_default.lineaCabeza,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
									url: l.imagen,
									alt: nombre,
									anchoCss: 56,
									proporcion: "1:1",
									radio: "sm",
									tienda: l.tienda_nombre
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: Ventas_module_default.lineaTextos,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
										a: `/productos/${encodeURIComponent(l.product_id)}`,
										className: Ventas_module_default.lineaNombre,
										children: nombre
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: Ventas_module_default.lineaMeta,
										children: [l.tienda_nombre ? `${l.tienda_nombre} · ` : "", l.precio_centavos !== null ? T.detalle.cantidad(l.cantidad, formato.dinero(l.precio_centavos, { decimales: true })) : formato.numero(l.cantidad)]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: Ventas_module_default.lineaDatos,
								children: detalleLinea(l).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: d.etiqueta }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.valor })] }, d.id))
							}),
							notas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: Ventas_module_default.lineaNotas,
								children: notas.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
							}) : null,
							l.content_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
								a: `/videos/${encodeURIComponent(l.content_id)}`,
								className: Ventas_module_default.enlacePie,
								children: [T.detalle.verVideo, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "ChevronRight",
									tamano: 16
								})]
							}) : null
						]
					}, `${l.sku_id}-${i}`);
				})
			})
		]
	});
}
function TarjetaPedido(p) {
	const t = textoTarjetaPedido(p.orden);
	const l = p.orden.lineas[0];
	const extra = p.orden.lineas.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: Ventas_module_default.tarjetaPedido,
		onClick: p.alAbrir,
		"aria-label": T.pedidos.abrir(t.producto, t.fecha),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: l?.imagen ?? null,
				alt: "",
				anchoCss: 48,
				proporcion: "1:1",
				radio: "sm",
				tienda: l?.tienda_nombre ?? null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Ventas_module_default.tarjetaPedidoTextos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Ventas_module_default.tarjetaPedidoProducto,
					children: t.producto
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Ventas_module_default.tarjetaPedidoMeta,
					children: [t.fecha, extra > 0 ? ` · ${T.pedidos.masProductos(extra)}` : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Ventas_module_default.tarjetaPedidoDerecha,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Ventas_module_default.tarjetaPedidoCifra,
					children: t.comision
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: tonoEstado(p.orden.estado),
					children: t.estado
				})]
			})
		]
	});
}
function Pedidos(p) {
	const deClic = (0, import_react.useRef)(false);
	const filtroIgnorado = !!p.respuesta && p.filas.length !== p.respuesta.items.length;
	const total = filtroIgnorado ? p.filas.length : p.respuesta?.total ?? 0;
	const paginas = filtroIgnorado ? 1 : totalPaginas(total, p.respuesta?.por_pagina);
	const sel = p.seleccionado ? p.filas.find((o) => o.order_id === p.seleccionado) ?? null : null;
	let cuerpo;
	if (!p.respuesta && p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.respuesta) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto: 320 });
	else if (p.filas.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "Search",
		titulo: T.pedidos.vacio,
		texto: T.pedidos.vacioTexto,
		...p.filtro !== "todos" ? { accion: {
			etiqueta: T.pedidos.verTodos,
			alPulsar: () => p.alCambiarFiltro("todos")
		} } : {},
		className: Ventas_module_default.vacioPedidos
	});
	else if (p.compacto || p.tarjetas === true) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: Ventas_module_default.listaPedidos,
		"aria-label": T.pedidos.lista,
		children: p.filas.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaPedido, {
			orden: o,
			alAbrir: () => p.alSeleccionar(o.order_id)
		}) }, o.order_id))
	});
	else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: Ventas_module_default.tablaPedidos,
		onPointerDownCapture: () => {
			deClic.current = true;
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabla, {
			etiqueta: T.pedidos.tabla,
			filas: p.filas,
			columnas: COLUMNAS_PEDIDOS,
			idFila: (o) => o.order_id,
			seleccionada: p.seleccionado,
			alSeleccionar: (o) => {
				const clic = deClic.current;
				deClic.current = false;
				if (clic || p.panelDisponible) p.alSeleccionar(o.order_id);
			},
			alAbrir: (o) => p.alSeleccionar(o.order_id),
			claveScroll: "ventas-pedidos",
			virtual: true,
			className: Ventas_module_default.tablaEnTarjeta
		})
	});
	const detalle = sel ? p.panelDisponible && !p.compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLateral, {
		abierto: true,
		titulo: T.detalle.titulo(formato.fechaConDia(sel.fecha)),
		alCerrar: () => p.alSeleccionar(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetallePedido, { orden: sel })
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: true,
		titulo: T.detalle.titulo(formato.fechaConDia(sel.fecha)),
		alCerrar: () => p.alSeleccionar(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetallePedido, { orden: sel })
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: Ventas_module_default.seccion,
			"aria-labelledby": "ventas-pedidos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Ventas_module_default.pedidosCabeza,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: Ventas_module_default.tarjetaTitulo,
						id: "ventas-pedidos",
						children: T.pedidos.titulo
					}), p.respuesta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Ventas_module_default.pedidosTotal,
						children: T.pedidos.total(total, formato.numero(total))
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: Ventas_module_default.chipsPedidos,
					role: "group",
					"aria-label": T.pedidos.filtros,
					children: FILTROS_PEDIDOS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipFiltro, {
						activo: p.filtro === f,
						alCambiar: () => p.alCambiarFiltro(f),
						children: T.pedidos.chips[f]
					}, f))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: p.refrescando ? Ventas_module_default.refrescando : void 0,
					children: cuerpo
				}),
				p.respuesta && paginas > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: Ventas_module_default.paginacion,
					"aria-label": T.pedidos.titulo,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							icono: "ChevronLeft",
							deshabilitado: p.pagina <= 1,
							alPulsar: () => p.alCambiarPagina(p.pagina - 1),
							children: T.pedidos.anterior
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Ventas_module_default.paginaTexto,
							"aria-live": "polite",
							children: T.pedidos.pagina(formato.numero(p.pagina), formato.numero(paginas))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							iconoFinal: "ChevronRight",
							deshabilitado: p.pagina >= paginas,
							alPulsar: () => p.alCambiarPagina(p.pagina + 1),
							children: T.pedidos.siguiente
						})
					]
				}) : null
			]
		}), detalle]
	});
}
function PorMes(p) {
	let cuerpo;
	if (!p.puntos && p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.puntos) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto: 160 });
	else {
		const filas = filasPorMes(p.puntos, p.hoyHub);
		if (filas.length === 0) return null;
		const [cMes, cPedidos, cReemb, cTasa, cComision, cLiquidada] = T.porMes.columnas;
		cuerpo = p.compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: Ventas_module_default.mesesLista,
			children: filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: Ventas_module_default.mesDetalle,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: Ventas_module_default.mesResumen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Ventas_module_default.mesNombre,
						children: f.mes
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Ventas_module_default.mesCifra,
						children: f.comision
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: Ventas_module_default.mesDatos,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: cPedidos }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: f.pedidos })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: cReemb }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
							f.reembolsados,
							" · ",
							f.tasa
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: cLiquidada }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: f.liquidada })] })
					]
				})]
			}) }, f.clave))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: Ventas_module_default.tablaDesplaza,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: Ventas_module_default.tablaMeses,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
						className: Ventas_module_default.srSolo,
						children: T.porMes.titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							children: cMes
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: Ventas_module_default.num,
							children: cPedidos
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: Ventas_module_default.num,
							children: cReemb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: Ventas_module_default.num,
							children: cTasa
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: Ventas_module_default.num,
							children: cComision
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: Ventas_module_default.num,
							children: cLiquidada
						})
					] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						"data-en-curso": f.enCurso ? "" : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "row",
								children: f.mes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: Ventas_module_default.num,
								children: f.pedidos
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: Ventas_module_default.num,
								children: f.reembolsados
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: Ventas_module_default.num,
								children: f.tasa
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: Ventas_module_default.num,
								children: f.comision
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: Ventas_module_default.num,
								children: f.liquidada
							})
						]
					}, f.clave)) })
				]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: Ventas_module_default.seccion,
			"aria-labelledby": "ventas-por-mes",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: Ventas_module_default.tarjetaTitulo,
				id: "ventas-por-mes",
				children: T.porMes.titulo
			}), cuerpo]
		})
	});
}
var MAXIMO = 5;
function ProductosTop(p) {
	let cuerpo;
	if (!p.productos && p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.productos) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto: 220 });
	else {
		const top = [...p.productos].filter((x) => x.comision_estimada_centavos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, MAXIMO);
		cuerpo = top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: Ventas_module_default.vacioSuave,
			children: T.productos.vacio
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: Ventas_module_default.productos,
			children: top.map((x, i) => {
				const nombre = x.titulo_corto ?? nombreCorto(x.titulo);
				const comision = formato.dinero(x.comision_estimada_centavos);
				const primero = i === 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: `/productos/${encodeURIComponent(x.product_id)}`,
					className: Ventas_module_default.producto,
					"aria-label": T.productos.abrir(nombre, comision),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Ventas_module_default.productoRanking,
							"aria-hidden": "true",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
							url: x.imagen,
							alt: "",
							anchoCss: primero ? 72 : 48,
							proporcion: "1:1",
							radio: primero ? "md" : "sm",
							tienda: x.tienda_nombre,
							className: primero ? Ventas_module_default.productoFotoGrande : Ventas_module_default.productoFoto
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: Ventas_module_default.productoTextos,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Ventas_module_default.productoNombre,
								children: nombre
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Ventas_module_default.productoLinea,
								children: T.productos.linea(x.tienda_nombre, T.productos.unidades(x.unidades, formato.numero(x.unidades)))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Ventas_module_default.productoCifra,
							children: comision
						})
					]
				}) }, x.product_id);
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: Ventas_module_default.seccion,
			"aria-labelledby": "ventas-productos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: Ventas_module_default.tarjetaTitulo,
					id: "ventas-productos",
					children: T.productos.titulo
				}),
				cuerpo,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: "/productos",
					className: Ventas_module_default.enlacePie,
					children: [T.productos.verTodos, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "ChevronRight",
						tamano: 16
					})]
				})
			]
		})
	});
}
function Reembolsos(p) {
	const k = p.kpis;
	let grafica;
	if (!p.meses && p.error) grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.meses) grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoSeccion, { alto: 140 });
	else if (p.meses.length < 2) grafica = null;
	else {
		const d = puntosReembolsoMes(p.meses);
		grafica = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
			titulo: T.reembolsos.grafica,
			puntos: d.puntos,
			formatoEje: (v) => `${formato.numero(Math.round(v))} %`,
			alto: p.compacto ? 160 : 260,
			tablaGemela: d.tabla
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Ventas_module_default.tarjeta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: Ventas_module_default.seccion,
			"aria-labelledby": "ventas-reembolsos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: Ventas_module_default.tarjetaTitulo,
					id: "ventas-reembolsos",
					children: T.reembolsos.titulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: Ventas_module_default.reembolsoTexto,
					children: T.reembolsos.texto(formato.dinero(k.comision_perdida_reembolsos_centavos))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: Ventas_module_default.textoNota,
					children: T.reembolsos.detalle(formato.numero(k.pedidos_reembolsados), formato.numero(k.pedidos), formato.porcentaje(k.tasa_reembolso, 1))
				}),
				grafica
			]
		})
	});
}
/**
* #/ventas · Ventas (01_ux §4.11; lienzo Ventas.png; 02 §7.3, §9). Entender el dinero: cuánto genero, cuánto ya está
* liquidado, cuánto falta, cuánto pierdo por reembolsos y hacia dónde va la tendencia. Controles arriba (periodo, que se
* recuerda, y comparar) → 8 KPI → gráfica principal → ¿Dónde está tu dinero? + De quién depende tu comisión →
* Reembolsos + Productos que más venden → Por mes → Pedidos con su detalle.
* Parámetros: ?periodo=7d|30d|90d|12m|todo|YYYY-MM · ?estado=liquidados|por_liquidar|reembolsados · ?pedido=<order_id>.
*/
var CLAVE_PERIODO = "corte.ventas.periodo";
function periodoGuardado() {
	try {
		const v = window.localStorage.getItem(CLAVE_PERIODO);
		return esPeriodo(v) ? v : null;
	} catch {
		return null;
	}
}
function guardarPeriodo(p) {
	try {
		window.localStorage.setItem(CLAVE_PERIODO, p);
	} catch {}
}
function PantallaVentas() {
	const plataforma = usePlataforma();
	const compacto = useClaseAncho() === "compacta";
	const tarjetasPedidos = compacto || plataforma === "android";
	const panelDisponible = usePanelDisponible();
	const [raiz, setRaiz] = (0, import_react.useState)(null);
	const holgura = useHolguraCapas(raiz);
	const sesion = useSesion();
	const sync = useSync();
	const [periodoParam, setPeriodoParam] = useParametro("periodo");
	const [estadoParam, setEstadoParam] = useParametro("estado");
	const [pedidoParam, setPedidoParam] = useParametro("pedido");
	const [guardado] = (0, import_react.useState)(periodoGuardado);
	const periodo = esPeriodo(periodoParam) ? periodoParam : guardado ?? "30d";
	const filtro = esFiltro(estadoParam) ? estadoParam : "todos";
	const [comparar, setComparar] = (0, import_react.useState)(true);
	const [metrica, setMetrica] = (0, import_react.useState)("comision");
	const [granManual, setGranManual] = (0, import_react.useState)(null);
	const [pagina, setPagina] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		if (esPeriodo(periodoParam)) guardarPeriodo(periodoParam);
	}, [periodoParam]);
	const tablero = useConsulta("dashboard", { periodo });
	const ultimo = (0, import_react.useRef)(void 0);
	if (tablero.datos) ultimo.current = tablero.datos;
	const d = tablero.datos ?? (tablero.error ? void 0 : ultimo.current);
	const cambiando = !tablero.datos && !!d;
	const rango = d ? {
		desde: d.periodo.desde,
		hasta: d.periodo.hasta
	} : null;
	const hoyHub = d ? hoyDelHub(d) : hoyLocal();
	const permitidas = rango ? granularidadesPermitidas(rango.desde, rango.hasta) : ["dia"];
	const granDash = d?.serie.granularidad ?? (rango ? granularidadAuto(rango.desde, rango.hasta) : "dia");
	const granAuto = compacto && rango && granDash === "dia" && diasDelRango(rango.desde, rango.hasta) > 12 && permitidas.includes("semana") ? "semana" : granDash;
	const gran = granManual && permitidas.includes(granManual) ? granManual : permitidas.includes(granAuto) ? granAuto : permitidas[0] ?? "dia";
	const semanasDeDias = !!d && gran === "semana" && d.serie.granularidad === "dia";
	const usaSerieTablero = !!d && (d.serie.granularidad === gran || semanasDeDias);
	const serie = useConsulta("serie", {
		granularidad: gran,
		desde: rango?.desde ?? "",
		hasta: rango?.hasta ?? ""
	}, { activa: !!rango && !usaSerieTablero && !cambiando });
	const mesesDelTablero = !!d && d.serie.granularidad === "mes";
	const mesesDeDias = !!d && d.serie.granularidad === "dia";
	const serieMes = useConsulta("serie", {
		granularidad: "mes",
		desde: rango?.desde ?? "",
		hasta: rango?.hasta ?? ""
	}, { activa: !!rango && !mesesDelTablero && !mesesDeDias && !cambiando });
	const tiendas = useConsulta("tiendas", {
		desde: rango?.desde ?? "",
		hasta: rango?.hasta ?? "",
		orden: "comision"
	}, { activa: !!rango && !cambiando });
	const productos = useConsulta("productos", {
		desde: rango?.desde ?? "",
		hasta: rango?.hasta ?? ""
	}, { activa: !!rango && !cambiando });
	const estados = estadosDe(filtro);
	const paramsOrdenes = {
		...periodo === "todo" || !rango ? {} : {
			desde: rango.desde,
			hasta: rango.hasta
		},
		...estados ? { estado: estados } : {},
		pagina,
		por_pagina: 50
	};
	const ordenes = useConsulta("ordenes", paramsOrdenes, { activa: !!rango && !cambiando });
	const filasPedidos = (0, import_react.useMemo)(() => ordenes.datos ? filtrarPedidos(ordenes.datos.items, estados, periodo === "todo" ? null : rango?.desde ?? null, periodo === "todo" ? null : rango?.hasta ?? null) : [], [
		ordenes.datos,
		estados,
		periodo,
		rango?.desde,
		rango?.hasta
	]);
	const puntosTablero = d?.serie.puntos;
	const puntosBase = (0, import_react.useMemo)(() => usaSerieTablero ? semanasDeDias && puntosTablero ? agruparSemanas(puntosTablero) : puntosTablero : serie.datos?.puntos, [
		usaSerieTablero,
		semanasDeDias,
		puntosTablero,
		serie.datos
	]);
	const puntos = (0, import_react.useMemo)(() => puntosBase ? puntosSerie(puntosBase, gran, hoyHub, rango?.desde) : void 0, [
		puntosBase,
		gran,
		hoyHub,
		rango?.desde
	]);
	const mesesBase = (0, import_react.useMemo)(() => mesesDelTablero ? puntosTablero : mesesDeDias && puntosTablero ? agruparMeses(puntosTablero) : serieMes.datos?.puntos, [
		mesesDelTablero,
		mesesDeDias,
		puntosTablero,
		serieMes.datos
	]);
	const errorMeses = mesesDelTablero || mesesDeDias ? null : serieMes.error;
	const meses = (0, import_react.useMemo)(() => mesesBase ? puntosSerie(mesesBase, "mes", hoyHub) : void 0, [mesesBase, hoyHub]);
	const cambiarPeriodo = (p) => {
		setPeriodoParam(p, { reemplazar: true });
		setPagina(1);
		setGranManual(null);
		setPedidoParam(null, { reemplazar: true });
	};
	const cambiarFiltro = (f) => {
		setEstadoParam(f === "todos" ? null : f, { reemplazar: true });
		setPagina(1);
	};
	const estadoSync = sync.estado ?? sesion.datos?.sync ?? null;
	const pasoPedidos = pasoPedidosEnCurso(estadoSync);
	const todaviaNo = ventasTodaviaNo(estadoSync, sesion.datos?.datos.ultima_sync_ok_at);
	const semana = semanaQueTrae(pasoPedidos);
	const textoTrayendo = semana ? T.estados.trayendo(formato.numero(semana.n), formato.numero(semana.total)) : T.estados.trayendoSinSemana;
	const lista = !!d || !!tablero.error;
	const puedeComparar = !!d?.kpis_anterior;
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo: T.titulo,
		...d ? { contexto: T.contexto(textoRango(d.periodo)) } : {}
	});
	const controles = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controles, {
		periodo,
		hoy: hoyHub,
		compacto,
		comparar,
		puedeComparar,
		alCambiarPeriodo: cambiarPeriodo,
		alCambiarComparar: setComparar
	});
	let cuerpo;
	if (todaviaNo && !tablero.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Ventas_module_default.bloques,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FranjaTrayendo, { texto: textoTrayendo }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaVentas, {})]
	});
	else if (!d && !tablero.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaVentas, {});
	else if (!d) {
		const e = tablero.error;
		cuerpo = e?.codigo === "necesita_pc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Monitor",
			titulo: T.estados.necesitaPc,
			texto: T.estados.necesitaPcTexto,
			accion: {
				etiqueta: T.periodo["30d"],
				alPulsar: () => cambiarPeriodo("30d")
			},
			className: Ventas_module_default.estadoGlobal
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleAlert",
			titulo: T.estados.errorTitulo,
			texto: e?.mensaje ?? "",
			accion: {
				etiqueta: T.estados.reintentar,
				alPulsar: () => void tablero.refrescar()
			},
			className: Ventas_module_default.estadoGlobal
		});
	} else {
		const sinPedidos = d.kpis.pedidos === 0;
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cambiando || tablero.refrescando ? Ventas_module_default.refrescando : void 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.bloques,
				children: [
					pasoPedidos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FranjaTrayendo, { texto: textoTrayendo }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpis, {
						tablero: d,
						comparar,
						compacto
					}),
					sinPedidos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
						icono: "ChartColumn",
						titulo: T.estados.sinPedidos,
						texto: T.estados.sinPedidosTexto,
						...periodo !== "90d" && periodo !== "todo" && periodo !== "12m" ? { accion: {
							etiqueta: T.estados.ver90,
							alPulsar: () => cambiarPeriodo("90d")
						} } : {},
						className: Ventas_module_default.estadoGlobal
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaPrincipal, {
							puntos,
							granularidad: gran,
							...rango ? { desde: rango.desde } : {},
							permitidas,
							metrica,
							error: usaSerieTablero ? null : serie.error,
							compacto,
							alCambiarMetrica: setMetrica,
							alCambiarGranularidad: setGranManual,
							alReintentar: () => void serie.refrescar()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: Ventas_module_default.filaDos,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DondeDinero, { kpis: d.kpis }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dependencia, {
								tiendas: tiendas.datos?.items,
								total: d.kpis.comision_total_centavos,
								error: tiendas.error,
								alReintentar: () => void tiendas.refrescar()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: Ventas_module_default.filaDos,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reembolsos, {
								kpis: d.kpis,
								meses,
								error: errorMeses,
								compacto,
								alReintentar: () => void serieMes.refrescar()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductosTop, {
								productos: productos.datos?.items,
								error: productos.error,
								alReintentar: () => void productos.refrescar()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PorMes, {
							puntos: mesesBase,
							hoyHub,
							compacto,
							error: errorMeses,
							alReintentar: () => void serieMes.refrescar()
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pedidos, {
						respuesta: ordenes.datos,
						filas: filasPedidos,
						filtro,
						pagina,
						seleccionado: pedidoParam,
						compacto,
						tarjetas: tarjetasPedidos,
						panelDisponible,
						refrescando: ordenes.refrescando,
						error: ordenes.error,
						alCambiarFiltro: cambiarFiltro,
						alCambiarPagina: (n) => {
							setPagina(n);
							setPedidoParam(null, { reemplazar: true });
						},
						alSeleccionar: (id) => setPedidoParam(id, { reemplazar: true }),
						alReintentar: () => void ordenes.refrescar()
					})
				]
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.titulo,
		lista,
		className: Ventas_module_default.pantalla,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Ventas_module_default.ventas,
			"data-compacto": compacto ? "" : void 0,
			"data-android": plataforma === "android" ? "" : void 0,
			ref: setRaiz,
			children: [encabezado, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ventas_module_default.contenido,
				children: [
					controles,
					cuerpo,
					holgura > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: Ventas_module_default.holgura,
						style: { height: holgura },
						"aria-hidden": "true",
						"data-holgura-capas": ""
					}) : null
				]
			})]
		})
	});
}
//#endregion
export { PantallaVentas };
