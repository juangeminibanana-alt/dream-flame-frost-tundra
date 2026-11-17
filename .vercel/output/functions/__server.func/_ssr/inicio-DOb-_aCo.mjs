import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as EnlaceRuta, Dn as rangoDePeriodo, F as Foto, Fn as sumarDias, Gn as useClaseAncho, H as Icono, I as GraficaColumnas, It as contarTrabajo, Jt as esPendiente, K as Kpi, M as Esqueleto, N as EsqueletoVista, P as EstadoVacio, Qt as fechaLocalDe, St as ahoraS, Vt as diasEntre, Xn as useListaEstable, Y as MiniaturaVideo, a as BandaKpi, ar as useSesion, d as BotonIcono, f as BurbujaRecorrido, g as Chip, gt as Ticket, i as Banda, k as EncabezadoPantalla, mn as nombreCorto, mt as Tarjeta, nn as formato, on as hoyLocal, or as useSync, p as CampoBusqueda, pn as navegar, qn as useConsulta, r as AvatarTienda, rr as useRecorrido, rt as Pantalla, s as BarraEtapas, tr as usePlataforma, tt as PanelFirma, u as Boton, zn as textoRazon } from "./app-CLiVRbtG.mjs";
import { S as ChipsRazones, k as useControlMuestra, y as ChipSalud } from "./routes-ewLcTzMi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inicio-DOb-_aCo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Inicio · textos visibles (español de México, vocabulario fijo de 01_ux §1.5). Los textos exactos salen de 01 §4.1
* (tablas «Textos» y «Estados»); los que 01 no fija siguen su tono. Las cifras llegan ya formateadas con `formato`.
*/
var plural = (n, uno, varios) => n === 1 ? uno : varios;
var T = {
	pantalla: "Inicio",
	saludo: (usuario) => `Hola, ${usuario}`,
	saludoSinCuenta: "Hola",
	actualizado: (cuando) => `Actualizado ${cuando}`,
	sincronizando: "Sincronizando con TikTok…",
	sinSincronizar: "Todavía sin sincronizar",
	desdeTuPc: "desde tu PC",
	/** 'Copia de hoy, 10:20 a. m.' · 'Copia de ayer, …' · 'Copia del 10 nov, 9:12 a. m.' (F2). */
	copiaDel: (cuando) => /^(hoy|ayer)\b/.test(cuando) ? `Copia de ${cuando}` : `Copia del ${cuando}`,
	buscar: "Buscar",
	sincronizar: "Sincronizar ahora",
	trayendo: "Estamos trayendo tus datos de TikTok Shop. Lo que llegue se mostrará al instante.",
	cargando: "Cargando tu inicio…",
	lento: "Sigue cargando… revisa la conexión con tu PC",
	heroe: {
		region: "Ponte al día",
		sobretitulo: "Ponte al día",
		antes: (n) => plural(n, "Te falta", "Te faltan"),
		despues: (n, corto) => corto ? plural(n, "video", "videos") : plural(n, "video de muestra", "videos de muestras"),
		/** Texto completo (lectores de pantalla y pruebas): «Te faltan 12 videos de muestras». */
		titulo: (n, cifra, corto) => `${plural(n, "Te falta", "Te faltan")} ${cifra} ${corto ? plural(n, "video", "videos") : plural(n, "video de muestra", "videos de muestras")}`,
		subtitulo: (tiendas, cifra) => `${cifra} ${plural(tiendas, "tienda espera", "tiendas esperan")} tu video`,
		progreso: (publicadas, total) => `${publicadas} de ${total} videos publicados`,
		siguiente: "Siguiente",
		abrirSiguiente: (producto, tienda) => `Siguiente: ${producto} de ${tienda}. Abrir el detalle`,
		/** «1 min» con espacio duro: con texto grande en un celular angosto el botón parte después del «·», nunca «1 / min». */
		armarPlan: "Armar mi plan · 1\xA0min",
		planearSoloEsta: "Planear solo esta",
		verAgenda: "Ver mi agenda",
		empezarSesion: "Empezar sesión",
		marcarPublicada: "Marcar publicada",
		ponermeAlCorriente: "Ponerme al corriente",
		verVentasVideos: "Ver las ventas de esos videos",
		conPlan: (termina, publica) => `Terminas el ${termina} · último video publicado a más tardar el ${publica}`,
		nadaHoy: (siguiente) => siguiente ? `Hoy no haces videos. El siguiente es el ${siguiente}.` : "Hoy no haces videos.",
		atraso: (n) => `Llevas ${n} ${plural(n, "video", "videos")} de retraso en tu plan`,
		alDiaTitulo: "¡Estás al día con todas tus muestras!",
		alDiaTexto: (videos, tiendas) => `${videos} videos publicados para ${tiendas} tiendas. Las tiendas lo notan.`,
		alDiaTicket: "Estás al día",
		alDiaTotal: (videos, tiendas) => `${videos} videos · ${tiendas} tiendas`,
		avisadas: "Tiendas avisadas",
		avisadasCifra: (avisadas, total) => `${avisadas} de ${total}`,
		avisar: "Avisar",
		noSePuede: (n) => `${n} no se puede etiquetar`,
		avisarTienda: "Avisar a la tienda",
		provisional: "Orden provisional: faltan tus ventas",
		ordenNuevo: "Hay un orden nuevo",
		actualizar: "Actualizar",
		tira: "Siguientes muestras de tu cola",
		tiraFoto: (producto, tienda) => `${producto} de ${tienda}`,
		tiraMas: (n) => `${n} ${plural(n, "muestra más", "muestras más")} en tu cola`
	},
	vencen: {
		titulo: "Vencen pronto · todavía cuentan para TikTok",
		fila: (producto, tienda) => `${producto} · ${tienda}`,
		vence: (cuando) => `vence ${cuando}`,
		planearHoy: "Planear hoy"
	},
	promesas: {
		titulo: "Promesas vencidas",
		fila: (tienda, fecha) => `Le prometiste a ${tienda} publicar el ${fecha}`,
		preparar: "Preparar mensaje"
	},
	hoy: {
		titulo: (fecha) => `Hoy · ${fecha}`,
		conteo: (hechos, total) => `${hechos} de ${total}`,
		completo: (hechos, total) => `¡Terminaste lo de hoy! ${hechos} de ${total}.`,
		verAgenda: "Ver mi agenda",
		videoListo: "Video listo",
		marcarPublicada: "Marcar publicada",
		publicada: "Publicada"
	},
	dinero: {
		titulo: "Tu dinero · últimos 30 días",
		verVentas: "Ver ventas",
		comision: "Comisión · 30 días",
		pedidos: "Pedidos · 30 días",
		reembolsos: "Reembolsos · 30 días",
		porLiquidar: "Por liquidar · total",
		vs30: "30 días anteriores",
		nuevo: "Nuevo",
		sinPedidos: "Sin pedidos en este periodo",
		pedidosReembolsados: (n, cifra) => `${cifra} ${plural(n, "pedido reembolsado", "pedidos reembolsados")}`,
		porLiquidarNota: "De todos tus pedidos",
		porLiquidarNota30: "De tus pedidos de 30 días",
		/** 01 §4.1 KPI 4 y Main.png: '45 pedidos · el más antiguo del 3 mar'. Sin la fecha: '45 pedidos por liquidar'. */
		porLiquidarPedidos: (n, cifra, masAntiguo) => {
			if (n === 0) return "Sin pedidos por liquidar";
			if (masAntiguo === null) return `${cifra} ${plural(n, "pedido por liquidar", "pedidos por liquidar")}`;
			return n === 1 ? `1 pedido · del ${masAntiguo}` : `${cifra} pedidos · el más antiguo del ${masAntiguo}`;
		},
		resumenSerie: (desde, hasta) => `Comisión por semana de las últimas 12 semanas, de ${desde} a ${hasta}`
	},
	tiendas: {
		titulo: "Tiendas que necesitan atención",
		enlace: (n) => `Ver las ${n} tiendas con pendientes`,
		abrir: (tienda, porque) => `${tienda}: ${porque}. Abrir la tienda`,
		vacio: "Ninguna tienda espera un video. Vas al día.",
		fotos: (n, tienda) => `${n} ${plural(n, "muestra pendiente", "muestras pendientes")} de ${tienda}`
	},
	avisos: { titulo: "Para tener en cuenta" },
	estrella: {
		titulo: "Tu video estrella de la semana",
		nota: (videos, cifra) => `en los últimos 7 días · ${cifra} ${plural(videos, "video vendió", "videos vendieron")} esta semana`,
		verVideos: "Ver videos",
		rotulo: "Foto del producto",
		unidades: (n, cifra) => `${cifra} ${plural(n, "unidad", "unidades")}`,
		sinVideo: "Esta semana todavía no vende ningún video.",
		sinVideoTexto: "Cuando un video tenga ventas en los últimos 7 días, lo verás aquí."
	},
	topVideos: {
		titulo: "Tus videos que más venden · 30 días",
		verTodos: "Ver videos",
		lista: "Videos con más comisión en los últimos 30 días"
	},
	video: {
		sinNombre: (idCorto) => `Video ${idCorto}`,
		etiqueta: (ranking, comision, unidades, producto) => `Video ${ranking}: ${comision} de comisión, ${unidades}. Producto: ${producto}`
	},
	tendencia: {
		titulo: "Comisión por semana · 12 semanas",
		estaSemana: "esta sem.",
		pico: (rango, monto) => `Semana pico: ${rango} · ${monto}`,
		aria: (rango, comision, pedidos, enCurso) => `Semana del ${rango}${enCurso ? " (en curso)" : ""}: ${comision} de comisión estimada, ${pedidos} pedidos`,
		columnas: [
			"Semana",
			"Comisión estimada",
			"Pedidos",
			"Reembolsados"
		],
		enCursoTabla: (rango) => `${rango} (en curso)`
	},
	perfil: {
		region: "Tu cuenta de TikTok",
		cuenta: (usuario) => `@${usuario}`,
		enTikTok: "en TikTok",
		seguidores: (n) => plural(n, "seguidor", "seguidores"),
		likes: "likes",
		cambio: (cifra) => `${cifra} en 7 días`,
		cambioLeido: (cifra, que) => `${cifra} ${que} en los últimos 7 días`,
		verVistas: "Ver vistas de tus videos",
		invitacion: "Conecta tus métricas de videos en Ajustes",
		cerrarInvitacion: "Cerrar este aviso"
	},
	pie: (momento) => `Datos de TikTok Shop · última sincronización ${momento}`,
	seccion: {
		necesitaPc: "Necesita tu PC encendida",
		necesitaPcTexto: "Abre Corte en tu PC y conéctate a la misma red para ver esta sección.",
		error: "No pudimos cargar esta sección.",
		reintentar: "Reintentar"
	},
	estados: {
		sinDatosAndroidTitulo: "Todavía no hay datos en este celular.",
		sinDatosAndroidTexto: "Empareja tu celular con Corte de tu PC para traer tu información.",
		emparejar: "Emparejar con mi PC",
		errorTitulo: "No pudimos cargar tu inicio",
		reintentar: "Reintentar",
		sinDatosTitulo: "Todavía no hay datos de TikTok Shop",
		sinDatosTexto: "Sincroniza para traer tus muestras, ventas y videos.",
		sinPendientesTitulo: "No tienes muestras pendientes",
		sinPendientesTexto: "Cuando recibas una muestra, aquí verás qué video toca primero."
	}
};
function porFecha(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}
/** Nombre corto del producto de una muestra (el que escribe el usuario gana, 01 §6.0). */
function nombreProducto(m) {
	return m.producto.titulo_corto ?? nombreCorto(m.producto.titulo);
}
/** Orden de la cola sugerida (posicion_cola); las que no tienen posición van al final en su orden original. */
function ordenarCola(items) {
	return items.map((m, i) => ({
		m,
		i
	})).sort((a, b) => (a.m.posicion_cola ?? Number.MAX_SAFE_INTEGER) - (b.m.posicion_cola ?? Number.MAX_SAFE_INTEGER) || a.i - b.i).map((x) => x.m);
}
/** Pendientes (01 §2.5) en orden de cola. */
function pendientesEnCola(items) {
	return ordenarCola(items.filter(esPendiente));
}
/** Segmentos de la barra de etapas: planeadas · listas · (programadas si se usan) · publicadas de la cohorte. */
function segmentosEtapas(c) {
	const s = [{
		etapa: "planeada",
		n: c.por_etapa.planeada
	}, {
		etapa: "video_listo",
		n: c.por_etapa.video_listo
	}];
	if (c.por_etapa.programada > 0) s.push({
		etapa: "programada",
		n: c.por_etapa.programada
	});
	s.push({
		etapa: "publicada",
		n: c.por_etapa.publicada
	});
	return s;
}
/** Total de la barra «{publicadas} de {total} videos publicados» (cohorte; nunca menor que lo publicado). */
function totalBarra(c) {
	return Math.max(c.total_cohorte, c.publicadas, c.pendientes);
}
var ETAPAS_CON_FECHA = /* @__PURE__ */ new Set([
	"planeada",
	"video_listo",
	"programada"
]);
function conFecha(m) {
	return ETAPAS_CON_FECHA.has(m.avance.etapa) && m.avance.fecha_planeada !== null;
}
/**
* Tabla «El héroe tiene una sola acción principal» de 01 §4.1. `cola` = pendientes en el orden que se muestra (la lista
* estable: si llega un orden nuevo, la nº 1 no cambia sola). `todas` = todas las muestras (para la celebración).
*/
function estadoHeroe(cola, todas, conteos, hoy) {
	const pendientes = cola.filter(esPendiente);
	if (pendientes.length === 0) {
		if (conteos.publicadas > 0) {
			const tiendas = new Set(todas.filter((m) => m.avance.etapa === "publicada").map((m) => m.tienda.tienda_key)).size;
			return {
				tipo: "al_dia",
				publicadas: conteos.publicadas,
				tiendas
			};
		}
		return { tipo: "nada" };
	}
	const planeadas = pendientes.filter(conFecha);
	if (planeadas.length === 0) return {
		tipo: "sin_plan",
		siguiente: pendientes[0] ?? null
	};
	const termina = planeadas.reduce((max, m) => m.avance.fecha_planeada > max ? m.avance.fecha_planeada : max, planeadas[0]?.avance.fecha_planeada ?? hoy);
	const publica = sumarDias(termina, 2);
	const atrasadas = planeadas.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada < hoy).sort((a, b) => porFecha(a.avance.fecha_planeada, b.avance.fecha_planeada));
	const primeraAtrasada = atrasadas[0];
	if (primeraAtrasada) return {
		tipo: "atrasado",
		n: atrasadas.length,
		termina,
		publica,
		primera: primeraAtrasada
	};
	const deHoy = planeadas.filter((m) => m.avance.fecha_planeada === hoy);
	const primero = deHoy.find((m) => m.avance.etapa === "planeada") ?? deHoy[0];
	if (primero) return {
		tipo: "hoy",
		termina,
		publica,
		primero,
		accion: primero.avance.etapa === "planeada" ? "empezar_sesion" : "marcar_publicada"
	};
	const proxima = planeadas.filter((m) => m.avance.fecha_planeada > hoy).sort((a, b) => porFecha(a.avance.fecha_planeada, b.avance.fecha_planeada))[0] ?? null;
	return {
		tipo: "nada_hoy",
		termina,
		publica,
		siguienteDia: proxima?.avance.fecha_planeada ?? null,
		proxima
	};
}
/** La muestra cuya foto protagoniza el héroe en cada estado (null en «al día»). */
function destacadaDe(e) {
	switch (e.tipo) {
		case "sin_plan": return e.siguiente;
		case "hoy": return e.primero;
		case "nada_hoy": return e.proxima;
		case "atrasado": return e.primera;
		default: return null;
	}
}
/** true si existe un plan (alguna pendiente con fecha): muestra «Hoy» y «Tiendas avisadas». */
function hayPlan(items) {
	return items.some((m) => esPendiente(m) && conFecha(m));
}
/** Tira de pendientes: de la 2.ª a la 13.ª de la cola (sin la destacada) y cuántas quedan para «+N» (02 §7.23). */
function tiraDe(cola, excluir, maximo = 12) {
	const resto = cola.filter((m) => esPendiente(m) && m.application_id !== excluir);
	const visibles = resto.slice(0, maximo);
	return {
		visibles,
		mas: resto.length - visibles.length
	};
}
/** «Vencen pronto · todavía cuentan para TikTok»: por vencer pendientes, por fecha límite. */
function vencenPronto(items, ahora) {
	return items.filter((m) => m.grupo === "por_vencer" && esPendiente(m) && m.fecha_limite_at !== null).sort((a, b) => (a.fecha_limite_at ?? 0) - (b.fecha_limite_at ?? 0)).map((m) => {
		const limite = m.fecha_limite_at ?? ahora;
		return {
			muestra: m,
			producto: nombreProducto(m),
			tienda: m.tienda.nombre,
			vence: `${formato.relativa(limite, ahora)} (${formato.fechaConDia(limite)})`,
			tono: limite - ahora < 172800 ? "critico" : "atencion"
		};
	});
}
/** «Promesas vencidas»: una fila por tienda (01 §4.1). */
function promesasVencidas(items) {
	const porTienda = /* @__PURE__ */ new Map();
	for (const m of items) {
		if (!m.avisos.promesa_vencida || !m.avisos.promesa || m.avance.etapa === "publicada") continue;
		const previa = porTienda.get(m.tienda.tienda_key);
		if (previa) {
			previa.solicitudes.push(m.application_id);
			if (m.avisos.promesa < previa.promesa) previa.promesa = m.avisos.promesa;
		} else porTienda.set(m.tienda.tienda_key, {
			tienda_key: m.tienda.tienda_key,
			tienda: m.tienda.nombre,
			promesa: m.avisos.promesa,
			solicitudes: [m.application_id]
		});
	}
	return [...porTienda.values()].sort((a, b) => porFecha(a.promesa, b.promesa) || a.tienda.localeCompare(b.tienda, "es"));
}
/** Pendientes que TikTok no deja etiquetar (prioridad 'no_se_puede_etiquetar'), en orden de cola. */
function noSePuedeEtiquetar(cola) {
	return cola.filter((m) => esPendiente(m) && m.prioridad === "no_se_puede_etiquetar");
}
/** «Hoy» (solo con plan): videos planeados para hoy; hecho = ya está en Video listo o más. */
function bloqueHoy(items, hoy) {
	const deHoy = ordenarCola(items.filter((m) => m.avance.fecha_planeada === hoy && m.avance.etapa !== "no_se_puede" && m.avance.etapa !== "por_planear"));
	if (deHoy.length === 0) return null;
	const hechos = deHoy.filter((m) => m.avance.etapa !== "planeada").length;
	return {
		fecha: hoy,
		items: deHoy,
		hechos,
		total: deHoy.length,
		completo: hechos === deHoy.length
	};
}
/** Tiendas que necesitan atención: las del orden 'atencion' del hub con pendientes o promesas vencidas (3 como máximo). */
function tiendasAtencion(tiendas, maximo = 3) {
	return tiendas.filter((t) => t.muestras.pendientes > 0 || t.promesas.vencidas > 0).slice(0, maximo);
}
/** Cuántas tiendas tienen pendientes (para «Ver las {n} tiendas con pendientes»). */
function tiendasConPendientes(tiendas) {
	return tiendas.filter((t) => t.muestras.pendientes > 0).length;
}
/** Pendientes de cada tienda, en orden de cola (fotos de las fichas de tienda). */
function pendientesPorTienda(cola) {
	const mapa = /* @__PURE__ */ new Map();
	for (const m of cola) {
		if (!esPendiente(m)) continue;
		const lista = mapa.get(m.tienda.tienda_key) ?? [];
		lista.push(m);
		mapa.set(m.tienda.tienda_key, lista);
	}
	return mapa;
}
/** product_id de una portada '/img/p/<id>?v=…' (C4: la portada es la foto del producto). */
function productoDePortada(url) {
	if (!url) return null;
	const m = /\/img\/p\/([^/?#&]+)/.exec(url);
	return m?.[1] ? decodeURIComponent(m[1]) : null;
}
/** Nombre que se muestra para un video (titulo siempre null, C4): nombre corto del producto de la portada o «Video 7677…3012». */
function nombreDeVideo(v, productos, muestras) {
	if (v.titulo) return nombreCorto(v.titulo);
	const id = productoDePortada(v.miniatura);
	if (id) {
		const p = productos.find((x) => x.product_id === id);
		if (p) return p.titulo_corto ?? nombreCorto(p.titulo);
		const m = muestras.find((x) => x.producto.product_id === id);
		if (m) return nombreProducto(m);
	}
	return T.video.sinNombre(formato.idCorto(v.content_id));
}
/** '123 unidades'. */
function textoUnidades(n) {
	return T.estrella.unidades(n, formato.numero(n));
}
/**
* rev. 5 · Portada a mostrar: la REAL del video ('/img/v/…', Display API) si existe; si no, la foto del producto que más
* vendió en él (C4), que lleva el rótulo «Foto del producto». Sin ninguna, null (póster tipográfico o mosaico).
*/
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
/** 9,876 · 55.2 mil · 482 mil · 1.3 M (seguidores y likes del perfil). */
function cifraCompacta(n) {
	const abs = Math.abs(n);
	const uno = (x) => (Math.round(x * 10) / 10).toLocaleString("es-MX", { maximumFractionDigits: 1 });
	if (abs < 1e4) return formato.numero(n);
	if (abs < 1e5) return `${uno(n / 1e3)} mil`;
	if (abs < 1e6) return `${formato.numero(Math.round(n / 1e3))} mil`;
	return `${uno(n / 1e6)} M`;
}
/** '+420' · '−35' · '0' (el cambio de 7 días del perfil, con su signo). */
function cambioConSigno(n) {
	const c = cifraCompacta(n);
	return n > 0 ? `+${c}` : c;
}
/**
* ¿Invitar a conectar las métricas de videos? Solo en Windows (en el celular no se puede hacer nada), sin perfil de
* TikTok en el tablero, con la Display API sin credenciales o sin conectar, y si la persona no la cerró antes.
*/
function invitarMetricas(android, perfil, estado, cerrada) {
	if (android || cerrada || perfil) return false;
	return estado === "sin_credenciales" || estado === "sin_conectar";
}
/** aria-label del enlace de un video (02 §8.5). */
function etiquetaVideo(ranking, v, nombre) {
	return T.video.etiqueta(ranking, formato.dinero(v.comision_estimada_centavos), textoUnidades(v.unidades), nombre);
}
/** Video estrella (VD9): máxima comisión estimada entre los videos con ventas válidas del rango de 7 días. */
function videoEstrella(videos) {
	let mejor = null;
	for (const v of videos) {
		if (v.pedidos_validos <= 0 || v.comision_estimada_centavos <= 0) continue;
		if (!mejor || v.comision_estimada_centavos > mejor.comision_estimada_centavos) mejor = v;
	}
	return mejor;
}
/**
* Los 7 días caben en los 30: si la suma de comisión de los videos de 7 días pasa la comisión estimada de 30 días, la
* respuesta no es del rango pedido (p. ej. una lista sin filtrar mientras la primera sincronización todavía arma los
* rangos) y no se presenta como «la semana». Con el hub siempre es coherente.
*/
function semanaCoherente(videos7, d30) {
	if (!d30) return true;
	return videos7.reduce((a, v) => a + Math.max(0, v.comision_estimada_centavos), 0) <= d30.kpis.comision_estimada_centavos + 100;
}
/** Videos que vendieron en el rango (VD5 con el rango de 7 días): con al menos una línea válida. */
function videosQueVendieron(videos) {
	return videos.filter((v) => v.pedidos_validos > 0).length;
}
/** Los N videos con más comisión (ya vienen ordenados del hub; se reordena por si acaso, sin mutar). */
function topVideos$1(videos, n = 5) {
	return [...videos].filter((v) => v.comision_estimada_centavos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, n);
}
/**
* Alertas que se muestran en «Para tener en cuenta». Se quitan las que repiten una cifra que ya está arriba (02 §5.2:
* sin repetir cifras): las pendientes (el héroe) y lo por liquidar (el KPI). El resto, por nivel.
*/
function alertasVisibles(alertas) {
	const orden = {
		critica: 0,
		aviso: 1,
		info: 2
	};
	return alertas.filter((a) => a.id !== "pendientes" && a.id !== "por_liquidar").sort((a, b) => orden[a.nivel] - orden[b.nivel]);
}
/**
* Color de un aviso en Inicio (02 §1 principio 5 y §3.4: el rojo solo marca riesgo real —por vencer, promesa vencida,
* conexión o error— y la deuda va en ámbar; «en Inicio no hay ningún rojo con los datos de hoy»). El hub marca como
* `critica` también la deuda (`pendientes`, `tienda_clave:*`, 03 §5.4): esas van en ámbar. Rojo solo para
* `limite:*` crítico (vence en ≤ 3 días) y `promesas_vencidas`.
*/
function tonoAlerta(a) {
	if (a.nivel === "info") return "info";
	if (a.nivel === "critica" && (a.id.startsWith("limite:") || a.id === "promesas_vencidas")) return "critico";
	return "atencion";
}
/** Une la cifra con «%» con espacio duro para que «71 %» nunca se parta entre renglones (textos que llegan del hub). */
function sinCortarPorcentaje(texto) {
	return texto.replace(/(\d) %/g, "$1\xA0%");
}
/**
* Variación contra el periodo anterior (V14): '21 % vs. 30 días anteriores' (la flecha la pone el KPI). null si no hay
* anterior. `menosEsMejor` invierte el color (reembolsos). Con anterior = 0 y actual > 0: 'Nuevo'. Con `vs` = null
* (celular, lienzo MovilInicio.png) solo la cifra: '21 %'; el periodo ya va en la etiqueta del KPI.
*/
function variacion(actual, anterior, vs, menosEsMejor = false) {
	if (anterior === null || anterior === void 0) return null;
	if (anterior === 0) return actual > 0 ? {
		texto: T.dinero.nuevo,
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
/** Estados que suman «Por liquidar» (V4 de 01 §6: To-SETTLE + AWAITING PAYMENT). */
var ESTADOS_POR_LIQUIDAR = ["To-SETTLE", "AWAITING PAYMENT"];
/**
* Respuesta de GET /api/ordenes?estado=To-SETTLE,AWAITING PAYMENT&por_pagina=1 SOLO si respetó el filtro y la página
* (1 pedido como máximo, todos por liquidar); si no, null. Así una respuesta que no filtró (p. ej. los datos de
* demostración, que no traen esa consulta y responden la primera página de todos los pedidos) nunca se presenta como
* «N pedidos por liquidar».
*/
function respuestaPorLiquidar(r) {
	if (!r || r.por_pagina !== 1 || r.items.length > 1 || r.total < 0) return null;
	return r.items.every((o) => ESTADOS_POR_LIQUIDAR.includes(o.estado)) ? r : null;
}
/**
* Cuenta y fecha del más antiguo a partir de las dos consultas de 1 por página: la primera da el total; la del más
* antiguo pide la última página (el hub ordena del más reciente al más antiguo). null si la cuenta no es confiable.
*/
function pedidosPorLiquidar(cuenta, ultimo) {
	const c = respuestaPorLiquidar(cuenta);
	if (c === null) return null;
	const u = respuestaPorLiquidar(ultimo);
	const masAntiguo = u !== null && u.total === c.total && u.pagina === c.total ? u.items[0]?.fecha ?? null : null;
	return {
		total: c.total,
		masAntiguo
	};
}
/**
* Las 4 tarjetas de «Tu dinero» (01 §4.1, 02 §5.2). Por liquidar sale del rango «Todo» (si aún no llega, del de 30
* días). `compacto` (celular): la variación sin «vs. 30 días anteriores», como el lienzo MovilInicio.png.
* `porLiquidar`: la nota «45 pedidos · el más antiguo del 3 mar» (01 §4.1 KPI 4); sin ella (o sin el rango «Todo»,
* del que sale la cifra), la nota dice de dónde sale la cifra.
*/
function kpisInicio(d30, dTodo, compacto = false, porLiquidar = null) {
	const k = d30.kpis;
	const a = d30.kpis_anterior;
	const vs = compacto ? null : T.dinero.vs30;
	const sinPedidos = k.pedidos === 0;
	return [
		{
			id: "comision",
			etiqueta: T.dinero.comision,
			valor: formato.dinero(k.comision_total_centavos),
			variacion: variacion(k.comision_total_centavos, a?.comision_total_centavos, vs),
			nota: sinPedidos ? T.dinero.sinPedidos : null,
			destino: "/ventas?periodo=30d"
		},
		{
			id: "pedidos",
			etiqueta: T.dinero.pedidos,
			valor: formato.numero(k.pedidos),
			variacion: variacion(k.pedidos, a?.pedidos, vs),
			nota: sinPedidos ? T.dinero.sinPedidos : null,
			destino: "/ventas?periodo=30d"
		},
		{
			id: "reembolsos",
			etiqueta: T.dinero.reembolsos,
			valor: formato.porcentaje(k.tasa_reembolso),
			variacion: null,
			nota: T.dinero.pedidosReembolsados(k.pedidos_reembolsados, formato.numero(k.pedidos_reembolsados)),
			destino: "/ventas?periodo=30d"
		},
		{
			id: "por_liquidar",
			etiqueta: T.dinero.porLiquidar,
			valor: formato.dinero((dTodo ?? d30).kpis.comision_por_liquidar_centavos),
			variacion: null,
			nota: !dTodo ? T.dinero.porLiquidarNota30 : porLiquidar ? T.dinero.porLiquidarPedidos(porLiquidar.total, formato.numero(porLiquidar.total), porLiquidar.masAntiguo ? formato.fechaCorta(porLiquidar.masAntiguo) : null) : T.dinero.porLiquidarNota,
			destino: "/ventas?periodo=todo&estado=por_liquidar"
		}
	];
}
/** Rango de una semana que empieza en `lunes`: '2 mar – 8 mar'. */
function rangoSemana(lunes) {
	return `${formato.fechaCorta(lunes)} – ${formato.fechaCorta(sumarDias(lunes, 6))}`;
}
/**
* Rango que se pide a /api/analitica/serie para las 12 semanas: los 90 días que terminan en `hasta` (la fecha del hub,
* dashboard.periodo.hasta). Trae 13–14 semanas y se usan las 12 últimas, así la primera siempre está completa.
*/
function rangoTendencia(hasta) {
	return rangoDePeriodo("90d", hasta);
}
/**
* Comisión por semana, últimas 12 semanas (01 §4.1 #10, 02 §9.4): la semana en curso (la que contiene `hasta` sin
* haber terminado) va marcada; no se extrapola.
*/
function tendenciaSemanal(serie, hasta, n = 12) {
	return serie.puntos.filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.clave) && p.clave <= hasta).slice(-n).map((p) => {
		const enCurso = sumarDias(p.clave, 6) > hasta;
		const rango = rangoSemana(p.clave);
		return {
			clave: p.clave,
			etiqueta: enCurso ? T.tendencia.estaSemana : formato.fechaCorta(p.clave),
			valor: p.comision_estimada_centavos,
			enCurso,
			aria: T.tendencia.aria(rango, formato.dinero(p.comision_estimada_centavos), formato.numero(p.pedidos), enCurso),
			pedidos: p.pedidos,
			reembolsados: p.pedidos_reembolsados,
			rango
		};
	});
}
/** «Semana pico: 2 mar – 8 mar · $1,234» (V16), solo entre semanas completas. */
function semanaPico(puntos) {
	const completas = puntos.filter((p) => !p.enCurso && p.valor > 0);
	if (completas.length === 0) return null;
	const pico = completas.reduce((a, b) => b.valor > a.valor ? b : a);
	return T.tendencia.pico(pico.rango, formato.dinero(pico.valor));
}
/** Tabla gemela de la tendencia (02 §9.4 regla 10). */
function tablaTendencia(puntos) {
	return {
		columnas: [...T.tendencia.columnas],
		filas: puntos.map((p) => [
			p.enCurso ? T.tendencia.enCursoTabla(p.rango) : p.rango,
			formato.dinero(p.valor),
			formato.numero(p.pedidos),
			formato.numero(p.reembolsados)
		])
	};
}
/** 'Jueves 12 de noviembre'. */
function fechaSaludo(hoy) {
	const larga = formato.fechaLarga(hoy);
	return larga.charAt(0).toUpperCase() + larga.slice(1);
}
/** 'hoy, 6:04 p. m.' · 'ayer, 2:41 p. m.' · '10 nov, 9:12 a. m.' (pie de Inicio, F1). */
function momentoSync(t, hoy) {
	const dias = diasEntre(fechaLocalDe(t), hoy);
	return `${dias === 0 ? "hoy" : dias === 1 ? "ayer" : formato.fechaCorta(t)}, ${formato.hora(t)}`;
}
/**
* La hora nunca se parte entre renglones: '10:15 a. m.' lleva espacios de no separación (NBSP) para que, en una
* línea angosta, no quede «10:15 a.» arriba y «m.» solo abajo. Lo mismo con 'hace 4 min' (a 360 con el texto al
* 130 % quedaba «hace 4» arriba y «min» abajo). Solo para pintar; la lógica conserva el texto normal.
*/
function horaSinCorte(texto) {
	return texto.replace(/\b(hace|en) (\d+) (min|h)\b/g, "$1\xA0$2\xA0$3").replace(/(\d{1,2}:\d{2}) ([ap])\. m\./g, "$1\xA0$2.\xA0m.");
}
/** 'hace 4 min' hasta 6 h; después 'ayer, 6:02 p. m.' (F1). */
function haceCuanto(t, ahora) {
	return ahora - t < 21600 ? formato.relativa(t, ahora) : momentoSync(t, fechaLocalDe(ahora));
}
/** Pasos de pedidos de la sincronización (los recientes; en la primera, los anteriores también cuentan para «trayendo»). */
function pasoOrdenes(sync) {
	return sync.pasos.find((p) => p.paso === "ordenes");
}
/** Primera sincronización en curso (sin ninguna sincronización completa antes). */
function primeraSincronizacion(sync, ultimaSyncOk) {
	return !!sync?.en_curso && (ultimaSyncOk ?? null) === null && sync.ultima_ok_at === null;
}
/** Primera sincronización antes del punto de control 2 (C34, F6): la cola aún no considera las ventas. */
function ordenProvisional(sync, ultimaSyncOk) {
	if (!sync || !primeraSincronizacion(sync, ultimaSyncOk)) return false;
	const ordenes = pasoOrdenes(sync);
	return !ordenes || ![
		"ok",
		"parcial",
		"omitido"
	].includes(ordenes.estado);
}
/** En la primera sincronización, las ventas todavía no llegan (el dinero y los videos se muestran como esqueleto). */
function ventasEnCamino(sync, ultimaSyncOk) {
	return ordenProvisional(sync, ultimaSyncOk);
}
var Inicio_module_default = {
	pantalla: "_pantalla_3jljd_3",
	inicio: "_inicio_3jljd_8",
	contenido: "_contenido_3jljd_7",
	holgura: "_holgura_3jljd_36",
	srSolo: "_srSolo_3jljd_41",
	recorte: "_recorte_3jljd_49",
	mono: "_mono_3jljd_55",
	empuje: "_empuje_3jljd_61",
	enlace: "_enlace_3jljd_66",
	enlaceChico: "_enlaceChico_3jljd_67",
	enlacePie: "_enlacePie_3jljd_68",
	tiraFoto: "_tiraFoto_3jljd_110",
	tiraMas: "_tiraMas_3jljd_111",
	tiendaFila: "_tiendaFila_3jljd_112",
	franjaEnlace: "_franjaEnlace_3jljd_113",
	hoyEnlace: "_hoyEnlace_3jljd_114",
	ordenNuevo: "_ordenNuevo_3jljd_115",
	saludo: "_saludo_3jljd_121",
	saludoTextos: "_saludoTextos_3jljd_129",
	saludoTitulo: "_saludoTitulo_3jljd_136",
	saludoContexto: "_saludoContexto_3jljd_145",
	saludoAcciones: "_saludoAcciones_3jljd_154",
	saludoBuscar: "_saludoBuscar_3jljd_169",
	holaCompacto: "_holaCompacto_3jljd_173",
	trayendo: "_trayendo_3jljd_182",
	trayendoIcono: "_trayendoIcono_3jljd_195",
	franja: "_franja_3jljd_113",
	franjaTitulo: "_franjaTitulo_3jljd_211",
	franjaLista: "_franjaLista_3jljd_227",
	franjaFila: "_franjaFila_3jljd_232",
	franjaTexto: "_franjaTexto_3jljd_252",
	filaHeroe: "_filaHeroe_3jljd_264",
	heroe: "_heroe_3jljd_280",
	heroeRejilla: "_heroeRejilla_3jljd_288",
	heroeFoto: "_heroeFoto_3jljd_312",
	heroeFotoEnlace: "_heroeFotoEnlace_3jljd_326",
	fotoLlena: "_fotoLlena_3jljd_338",
	velo: "_velo_3jljd_347",
	veloNombre: "_veloNombre_3jljd_368",
	veloSobre: "_veloSobre_3jljd_371",
	veloTienda: "_veloTienda_3jljd_379",
	chipsFoto: "_chipsFoto_3jljd_402",
	heroeTexto: "_heroeTexto_3jljd_414",
	accionesMarco: "_accionesMarco_3jljd_421",
	lineasAviso: "_lineasAviso_3jljd_428",
	separador: "_separador_3jljd_435",
	heroeCompacto: "_heroeCompacto_3jljd_439",
	heroeTitulos: "_heroeTitulos_3jljd_445",
	sobretitulo: "_sobretitulo_3jljd_448",
	heroeTitulo: "_heroeTitulo_3jljd_445",
	heroeDespues: "_heroeDespues_3jljd_474",
	heroeNumero: "_heroeNumero_3jljd_477",
	heroeSub: "_heroeSub_3jljd_483",
	heroeLinea: "_heroeLinea_3jljd_489",
	heroeLineaTenue: "_heroeLineaTenue_3jljd_490",
	atraso: "_atraso_3jljd_502",
	heroeBarra: "_heroeBarra_3jljd_511",
	acciones: "_acciones_3jljd_421",
	accionPrincipal: "_accionPrincipal_3jljd_551",
	lineaAvisoTexto: "_lineaAvisoTexto_3jljd_575",
	puntoAtencion: "_puntoAtencion_3jljd_580",
	tira: "_tira_3jljd_110",
	tiraSuelta: "_tiraSuelta_3jljd_621",
	tiraElemento: "_tiraElemento_3jljd_626",
	heroeAlDia: "_heroeAlDia_3jljd_654",
	heroeTicket: "_heroeTicket_3jljd_666",
	heroeTituloAlDia: "_heroeTituloAlDia_3jljd_670",
	hoy: "_hoy_3jljd_114",
	hoyConteo: "_hoyConteo_3jljd_699",
	hoyCompleto: "_hoyCompleto_3jljd_704",
	hoyLista: "_hoyLista_3jljd_709",
	hoyFila: "_hoyFila_3jljd_716",
	hoyTextos: "_hoyTextos_3jljd_736",
	hoyNombre: "_hoyNombre_3jljd_742",
	hoyTienda: "_hoyTienda_3jljd_751",
	dinero: "_dinero_3jljd_772",
	bandaTitulo: "_bandaTitulo_3jljd_778",
	filaDos: "_filaDos_3jljd_787",
	tarjetaSeccion: "_tarjetaSeccion_3jljd_798",
	seccionInterna: "_seccionInterna_3jljd_803",
	tarjetaCabeza: "_tarjetaCabeza_3jljd_810",
	tarjetaTitulo: "_tarjetaTitulo_3jljd_816",
	vacioSuave: "_vacioSuave_3jljd_824",
	vacioTarjeta: "_vacioTarjeta_3jljd_829",
	tiendasLista: "_tiendasLista_3jljd_834",
	tiendaTextos: "_tiendaTextos_3jljd_857",
	tiendaNombreLinea: "_tiendaNombreLinea_3jljd_863",
	tiendaNombre: "_tiendaNombre_3jljd_863",
	tiendaPorque: "_tiendaPorque_3jljd_880",
	tiendaFotos: "_tiendaFotos_3jljd_885",
	tiendaFoto: "_tiendaFoto_3jljd_885",
	tiendaChevron: "_tiendaChevron_3jljd_897",
	estrella: "_estrella_3jljd_910",
	estrellaPortada: "_estrellaPortada_3jljd_918",
	estrellaFoto: "_estrellaFoto_3jljd_935",
	estrellaRotulo: "_estrellaRotulo_3jljd_938",
	estrellaUnidades: "_estrellaUnidades_3jljd_957",
	estrellaTextos: "_estrellaTextos_3jljd_987",
	estrellaCifra: "_estrellaCifra_3jljd_993",
	estrellaNota: "_estrellaNota_3jljd_1003",
	estrellaVende: "_estrellaVende_3jljd_1004",
	estrellaProducto: "_estrellaProducto_3jljd_1010",
	estrellaNombre: "_estrellaNombre_3jljd_1017",
	esqEstrella: "_esqEstrella_3jljd_1027",
	topVideos: "_topVideos_3jljd_1037",
	rielVideos: "_rielVideos_3jljd_1040",
	rielElemento: "_rielElemento_3jljd_1048",
	rielMiniatura: "_rielMiniatura_3jljd_1051",
	alertas: "_alertas_3jljd_1082",
	alerta: "_alerta_3jljd_1082",
	alertaIcono: "_alertaIcono_3jljd_1101",
	alertaTextos: "_alertaTextos_3jljd_1118",
	alertaTitulo: "_alertaTitulo_3jljd_1124",
	alertaTexto: "_alertaTexto_3jljd_1118",
	pie: "_pie_3jljd_1146",
	avisoSeccion: "_avisoSeccion_3jljd_1156",
	avisoIcono: "_avisoIcono_3jljd_1165",
	avisoTextos: "_avisoTextos_3jljd_1175",
	estadoGlobal: "_estadoGlobal_3jljd_1190",
	carga: "_carga_3jljd_1195",
	esqSaludo: "_esqSaludo_3jljd_1200",
	esqHeroe: "_esqHeroe_3jljd_1205",
	esqHeroeFoto: "_esqHeroeFoto_3jljd_1215",
	esqHeroeTexto: "_esqHeroeTexto_3jljd_1220",
	esqHeroeFotoCompacta: "_esqHeroeFotoCompacta_3jljd_1227",
	esqTira: "_esqTira_3jljd_1232",
	esqKpis: "_esqKpis_3jljd_1237",
	esqDos: "_esqDos_3jljd_1242",
	esqFilas: "_esqFilas_3jljd_1247",
	esqGrafica: "_esqGrafica_3jljd_1248",
	perfil: "_perfil_3jljd_1266",
	invitacion: "_invitacion_3jljd_1267",
	perfilIcono: "_perfilIcono_3jljd_1281",
	perfilTexto: "_perfilTexto_3jljd_1292",
	perfilCuenta: "_perfilCuenta_3jljd_1302",
	perfilCifra: "_perfilCifra_3jljd_1303",
	perfilCambio: "_perfilCambio_3jljd_1313",
	invitacionEnlace: "_invitacionEnlace_3jljd_1334",
	invitacionCerrar: "_invitacionCerrar_3jljd_1364"
};
/** Ícono por tono; un aviso de tienda lleva la tienda (no un signo de alarma): es deuda, no urgencia. */
var ICONO = {
	critico: "CircleAlert",
	atencion: "MessageCircleWarning",
	info: "Info"
};
var icono = (a) => a.id.startsWith("tienda_clave:") ? "Store" : ICONO[tonoAlerta(a)];
function Alertas(p) {
	if (p.alertas.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Inicio_module_default.tarjetaSeccion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-labelledby": "inicio-alertas",
			className: Inicio_module_default.seccionInterna,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: Inicio_module_default.tarjetaTitulo,
				id: "inicio-alertas",
				children: T.avisos.titulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: Inicio_module_default.alertas,
				children: p.alertas.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: Inicio_module_default.alerta,
					"data-tono": tonoAlerta(a),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Inicio_module_default.alertaIcono,
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: icono(a),
								tamano: 18
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: Inicio_module_default.alertaTextos,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: Inicio_module_default.alertaTitulo,
								children: sinCortarPorcentaje(a.titulo)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Inicio_module_default.alertaTexto,
								children: sinCortarPorcentaje(a.texto)
							})]
						}),
						a.accion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
							a: a.accion.ruta,
							className: Inicio_module_default.enlaceChico,
							children: [a.accion.etiqueta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "ChevronRight",
								tamano: 14
							})]
						}) : null
					]
				}, a.id))
			})]
		})
	});
}
var rutaMuestra$1 = (m) => `/muestras/m/${encodeURIComponent(m.application_id)}`;
function VencenPronto(p) {
	const control = useControlMuestra();
	if (p.filas.length === 0) return null;
	const rojo = p.filas.some((f) => f.tono === "critico");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: Inicio_module_default.franja,
		"data-tono": rojo ? "critico" : "atencion",
		"aria-labelledby": "inicio-vencen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: Inicio_module_default.franjaTitulo,
			id: "inicio-vencen",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Clock",
				tamano: 18
			}), T.vencen.titulo]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: Inicio_module_default.franjaLista,
			children: p.filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: Inicio_module_default.franjaFila,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: rutaMuestra$1(f.muestra),
					className: Inicio_module_default.franjaEnlace,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: f.muestra.producto.imagen,
						alt: "",
						anchoCss: 40,
						proporcion: "1:1",
						radio: "sm",
						prioridad: "alta",
						tienda: f.tienda,
						categoria: f.muestra.producto.categoria
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Inicio_module_default.franjaTexto,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Inicio_module_default.recorte,
							children: T.vencen.fila(f.producto, f.tienda)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							tono: f.tono,
							icono: "Hourglass",
							children: T.vencen.vence(f.vence)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "CalendarDays",
					alPulsar: () => void control.planear(f.muestra, p.hoy),
					children: T.vencen.planearHoy
				})]
			}, f.muestra.application_id))
		})]
	});
}
function PromesasVencidas(p) {
	const control = useControlMuestra();
	if (p.filas.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: Inicio_module_default.franja,
		"data-tono": "atencion",
		"aria-labelledby": "inicio-promesas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: Inicio_module_default.franjaTitulo,
			id: "inicio-promesas",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "MessageCircleWarning",
				tamano: 18
			}), T.promesas.titulo]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: Inicio_module_default.franjaLista,
			children: p.filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: Inicio_module_default.franjaFila,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Inicio_module_default.franjaEnlace,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
						nombre: f.tienda,
						tamano: 40
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Inicio_module_default.franjaTexto,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.promesas.fila(f.tienda, formato.fechaConDia(f.promesa)) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "MessageCircle",
					alPulsar: () => control.abrirMensaje({ tienda: f.tienda_key }),
					children: T.promesas.preparar
				})]
			}, f.tienda_key))
		})]
	});
}
/**
* Acción de cada video de «Hoy» (01 §4.1: «Video listo ✓» o «Marcar publicada»): planeada → Video listo; lista o
* programada → Marcar publicada; publicada → chip «Publicada». Botón secundario: la primaria de la vista es la del
* héroe. El Toast «Video listo · Deshacer» lo da useControlMuestra().cambiarEtapa.
*/
function AccionHoy(p) {
	const control = useControlMuestra();
	const m = p.m;
	switch (m.avance.etapa) {
		case "planeada": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			icono: "Check",
			alPulsar: () => void control.cambiarEtapa(m, "video_listo"),
			children: T.hoy.videoListo
		});
		case "video_listo":
		case "programada": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			tamano: "sm",
			icono: "CircleCheckBig",
			alPulsar: () => void control.cambiarEtapa(m, "publicada"),
			children: T.hoy.marcarPublicada
		});
		case "publicada": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			tono: "ok",
			icono: "Check",
			children: T.hoy.publicada
		});
		default: return null;
	}
}
/** «Hoy · 12 nov» con «1 de 3» a la derecha; cada video con su acción principal (Video listo ✓ / Marcar publicada). */
function TarjetaHoy(p) {
	const b = p.bloque;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tarjeta, {
		padding: "amplio",
		className: Inicio_module_default.hoy,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: Inicio_module_default.tarjetaCabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: Inicio_module_default.tarjetaTitulo,
					children: T.hoy.titulo(formato.fechaCorta(b.fecha))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Inicio_module_default.hoyConteo,
					children: T.hoy.conteo(formato.numero(b.hechos), formato.numero(b.total))
				})]
			}),
			b.completo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Inicio_module_default.hoyCompleto,
				children: T.hoy.completo(formato.numero(b.hechos), formato.numero(b.total))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: Inicio_module_default.hoyLista,
				children: b.items.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: Inicio_module_default.hoyFila,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
						a: rutaMuestra$1(m),
						className: Inicio_module_default.hoyEnlace,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
							url: m.producto.imagen,
							alt: "",
							anchoCss: 56,
							proporcion: "1:1",
							radio: "sm",
							prioridad: "alta",
							tienda: m.tienda.nombre,
							categoria: m.producto.categoria
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: Inicio_module_default.hoyTextos,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Inicio_module_default.hoyNombre,
								children: nombreProducto(m)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Inicio_module_default.hoyTienda,
								children: m.tienda.nombre
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccionHoy, { m })]
				}, m.application_id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
				a: "/muestras/agenda",
				className: Inicio_module_default.enlacePie,
				children: [T.hoy.verAgenda, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 16
				})]
			})
		]
	});
}
/**
* Convivencia con las capas globales ancladas abajo (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, los avisos
* de @/componentes): todas llevan la marca común `data-capa-corte`. Mientras una está fija abajo, el final de Inicio
* deja un espacio de su mismo alto para que lo último de la página (el pie) pueda subir por encima de ella y nunca
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
/** Cajas de las capas fijas marcadas con `data-capa-corte` que no están dentro de `propio` (también las usa cabe.ts). */
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
/** Forma del héroe mientras carga: foto a la izquierda (o arriba en celular) y texto. */
function EsqueletoHeroe(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Inicio_module_default.esqHeroe,
		"data-compacto": p.compacto ? "" : void 0,
		children: [p.compacto ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "foto",
			className: Inicio_module_default.esqHeroeFoto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.esqHeroeTexto,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: 96,
					lineas: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "titulo",
					ancho: "80%",
					alto: 44
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: "55%",
					lineas: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 10
				}),
				p.compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "foto",
					className: Inicio_module_default.esqHeroeFotoCompacta
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					ancho: p.compacto ? "100%" : 220,
					alto: 44
				}),
				p.compacto ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: Inicio_module_default.esqTira,
					children: [
						0,
						1,
						2,
						3,
						4,
						5
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
						forma: "bloque",
						ancho: 64,
						alto: 64
					}, i))
				})
			]
		})]
	});
}
function EsqueletoKpis() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: Inicio_module_default.esqKpis,
		children: [
			0,
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }, i))
	});
}
/** Primera carga de toda la pantalla. */
function CargaInicio(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		textoLento: T.lento,
		className: Inicio_module_default.carga,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.srSolo,
				children: T.cargando
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.esqSaludo,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "titulo",
					ancho: 240
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: 320
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoHeroe, { compacto: p.compacto }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoKpis, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.esqDos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 260
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "bloque",
					alto: 260
				})]
			})
		]
	});
}
/** Aviso dentro de una sección que no se pudo armar (Android sin la PC) o que falló. */
function AvisoSeccion(p) {
	const necesitaPc = p.error.codigo === "necesita_pc";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${Inicio_module_default.avisoSeccion}${p.className ? ` ${p.className}` : ""}`,
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.avisoIcono,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: necesitaPc ? "Monitor" : "CircleAlert",
					tamano: 18
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.avisoTextos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: necesitaPc ? T.seccion.necesitaPc : T.seccion.error }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: necesitaPc ? T.seccion.necesitaPcTexto : p.error.mensaje })]
			}),
			!necesitaPc && p.alReintentar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "RotateCcw",
				alPulsar: p.alReintentar,
				children: T.seccion.reintentar
			}) : null
		]
	});
}
/**
* «Estamos trayendo tus datos de TikTok Shop. Lo que llegue se mostrará al instante.» (primera sincronización, texto
* exacto de 01 §4.1). El paso en curso no se repite aquí: lo muestra el indicador global de sincronización.
*/
function LineaTrayendo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: Inicio_module_default.trayendo,
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "RefreshCw",
			tamano: 16,
			className: Inicio_module_default.trayendoIcono
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.trayendo })]
	});
}
function Dinero(p) {
	const accion = {
		etiqueta: T.dinero.verVentas,
		a: "/ventas?periodo=30d"
	};
	if (p.enCamino || !p.d30 && !p.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: Inicio_module_default.dinero,
		"aria-label": T.dinero.titulo,
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: Inicio_module_default.bandaTitulo,
			children: T.dinero.titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoKpis, {})]
	});
	if (!p.d30) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: Inicio_module_default.dinero,
		"aria-label": T.dinero.titulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: Inicio_module_default.bandaTitulo,
			children: T.dinero.titulo
		}), p.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
			error: p.error,
			alReintentar: p.alReintentar
		}) : null]
	});
	const kpis = kpisInicio(p.d30, p.dTodo, p.compacto === true, p.porLiquidar ?? null);
	const serie = p.tendencia.map((x) => x.valor);
	const primera = p.tendencia[0];
	const ultima = p.tendencia[p.tendencia.length - 1];
	const resumen = primera && ultima ? T.dinero.resumenSerie(formato.dinero(primera.valor), formato.dinero(ultima.valor)) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BandaKpi, {
		titulo: T.dinero.titulo,
		accion,
		className: Inicio_module_default.dinero,
		children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
			etiqueta: k.etiqueta,
			valor: k.valor,
			variacion: k.variacion,
			...k.nota ? { nota: k.nota } : {},
			...k.id === "comision" && serie.length >= 2 ? {
				serie,
				resumenSerie: resumen
			} : {},
			alPulsar: () => navegar(k.destino)
		}, k.id))
	});
}
/** La foto nunca baja de este tanto de su ancho (≈ 196 px a 326 de ancho). */
var MINIMO_FOTO = .6;
/** Alto de la foto (px) para que el botón quepa; null = cabe 1:1, sin tocarla. */
function altoFotoQueCabe(g) {
	if (!(g.ancho > 0)) return null;
	const cabe = Math.floor(g.pliegue - 12 - g.topFoto - g.debajo);
	if (cabe >= g.ancho) return null;
	return Math.max(Math.round(g.ancho * MINIMO_FOTO), cabe);
}
/**
* Cómo se aprieta el velo «Siguiente» de una foto que cedió alto, para que nunca suba por encima de la foto:
* sin ajuste, 2 chips en total (02 §5.3: el provisional, si aplica, + 1 razón; si no, 2 razones); «media», 1 chip;
* «baja» (< 240 px), el nombre en un renglón y sin chips de razón. «Orden provisional: faltan tus ventas» nunca se
* esconde (01 §4.1): con 1 chip, es ese.
*/
function veloAjustado(alto, provisional) {
	if (alto === null) return {
		nivel: null,
		chips: 2
	};
	const nivel = alto >= 240 ? "media" : "baja";
	return {
		nivel,
		chips: nivel === "media" || provisional ? 1 : 0
	};
}
/**
* Pliegue efectivo: el borde superior de la barra inferior o, si está más arriba, el de una capa global anclada abajo
* que cubre el ancho (la tarjeta «¿Le enviaste el mensaje…?» de @/bloques, marcada con data-capa-corte). Así el botón
* principal queda a la vista también mientras esa tarjeta está abierta. Los diálogos y hojas a pantalla completa, las
* capas angostas y las que no están ancladas abajo no cuentan (mismo criterio que capas.ts).
*/
function pliegueConCapas(barra, capas, altoVentana, anchoVentana) {
	let pliegue = barra;
	for (const r of capas) {
		if (r.height < 1 || r.width < anchoVentana * .6) continue;
		if (r.height > altoVentana * .7) continue;
		if (r.bottom < altoVentana - 160) continue;
		pliegue = Math.min(pliegue, Math.floor(r.top));
	}
	return pliegue;
}
/** Borde superior de la barra fija que tapa el pie de la ventana (la barra inferior del celular); si no hay, el alto. */
function pliegueInferior() {
	const alto = window.innerHeight;
	const ancho = window.innerWidth;
	if (typeof document.elementsFromPoint !== "function") return alto;
	for (const el of document.elementsFromPoint(ancho / 2, alto - 2)) for (let p = el; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
		const posicion = getComputedStyle(p).position;
		if (posicion !== "fixed" && posicion !== "sticky") continue;
		const r = p.getBoundingClientRect();
		if (r.top > alto * .6 && r.width > ancho * .6) return r.top;
	}
	return alto;
}
/** Cuánto está desplazada la página (ventana y contenedores con scroll) por encima de `el`. */
function desplazamiento(el) {
	let s = window.scrollY;
	for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) s += p.scrollTop;
	return s;
}
/**
* Alto de la foto protagonista en celular. `contenedor` = el panel del héroe; dentro busca la foto
* (`[data-foto-heroe]`) y el botón principal (`[data-cta]`). Se recalcula al cambiar el tamaño de la ventana, al
* cambiar el alto de la página (avisos que aparecen arriba, escala de texto) y al cargar las fuentes, una vez por cuadro.
* El cálculo no depende del alto actual de la foto (solo de su borde superior y de lo que hay debajo), así que es estable.
*/
function useAltoFotoQueCabe(contenedor, activo) {
	const [alto, setAlto] = (0, import_react.useState)(null);
	(0, import_react.useLayoutEffect)(() => {
		if (!activo || !contenedor || typeof window === "undefined") {
			setAlto(null);
			return;
		}
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const foto = contenedor.querySelector("[data-foto-heroe]");
			const cta = contenedor.querySelector("[data-cta]");
			if (!foto || !cta) return;
			const rf = foto.getBoundingClientRect();
			const rc = cta.getBoundingClientRect();
			const nuevo = altoFotoQueCabe({
				pliegue: pliegueConCapas(pliegueInferior(), capasFijas(contenedor), window.innerHeight, window.innerWidth),
				topFoto: rf.top + desplazamiento(foto),
				debajo: rc.bottom - rf.bottom,
				ancho: rf.width
			});
			setAlto((previo) => previo === nuevo ? previo : nuevo);
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(medir);
		};
		medir();
		window.addEventListener("resize", pedir);
		const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(pedir);
		ro?.observe(document.documentElement);
		ro?.observe(contenedor);
		const mo = typeof MutationObserver === "undefined" ? null : new MutationObserver(pedir);
		mo?.observe(document.body, {
			childList: true,
			subtree: true
		});
		document.addEventListener("animationend", pedir, true);
		document.addEventListener("transitionend", pedir, true);
		document.fonts?.ready.then(pedir);
		return () => {
			window.removeEventListener("resize", pedir);
			ro?.disconnect();
			mo?.disconnect();
			document.removeEventListener("animationend", pedir, true);
			document.removeEventListener("transitionend", pedir, true);
			if (cuadro) window.cancelAnimationFrame(cuadro);
		};
	}, [contenedor, activo]);
	return alto;
}
/**
* Héroe «Ponte al día» (01 §4.1, 02 §7.23): el único panel con chaflán y el único número héroe («Te faltan 12 videos de
* muestras», con la cifra pareja como en el lienzo). La fotografía de la muestra que toca es la protagonista. PanelFirma
* conserva su relleno (28/30; 18 en celular):
*  - ancho (Windows): la foto es una tarjeta en la columna izquierda, dentro del relleno, con el bloque «Siguiente»
*    (tienda, nombre corto y hasta 2 chips) sobre su velo; a la derecha, título, barra de etapas, UNA acción principal
*    según la tabla de 01 §4.1 (con el paso de recorrido heroe_inicio) y la tira de pendientes con fotos y «+N»;
*  - compacto (celular, 02 §5.3): foto 1:1 a todo lo ancho con el velo, botón a todo lo ancho y la tira fuera del panel.
*/
var rutaMuestra = (m) => `/muestras/m/${encodeURIComponent(m.application_id)}`;
/**
* Bloque «Siguiente» sobre el velo de la foto: tienda (con variante), nombre corto y, sobre una franja de grafito al
* 72 % (02 §5.3), 2 chips como máximo. Es decorativo para los lectores: el enlace lleva todo el texto.
*/
function VeloSiguiente(p) {
	const maximo = p.chips ?? 2;
	const razones = Math.max(0, maximo - (p.provisional ? 1 : 0));
	const conChips = maximo > 0 && (p.provisional || p.m.razones.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: Inicio_module_default.velo,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.veloSobre,
				children: T.heroe.siguiente
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.veloTienda,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
					nombre: p.m.tienda.nombre,
					tamano: 24
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Inicio_module_default.recorte,
					children: [p.m.tienda.nombre, p.m.variante ? ` · ${p.m.variante}` : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.veloNombre,
				children: nombreProducto(p.m)
			}),
			conChips ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.chipsFoto,
				children: [p.provisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					tono: "info",
					icono: "Hourglass",
					children: T.heroe.provisional
				}) : null, razones > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazones, {
					muestra: p.m,
					maximo: razones
				}) : null]
			}) : null
		]
	});
}
/**
* Foto protagonista: a sangre en la columna (ancho) o 1:1 a todo lo ancho (compacto). Abre el detalle. En compacto,
* `alto` (useAltoFotoQueCabe) la baja de alto solo si el botón principal no cabría en el primer pliegue (02 §5.3).
*/
function FotoDestacada(p) {
	const nombre = nombreProducto(p.m);
	const razones = p.m.razones.slice(0, 2).map((r) => textoRazon(r, p.m));
	const etiqueta = [
		T.heroe.abrirSiguiente(nombre, p.m.tienda.nombre),
		...p.provisional ? [T.heroe.provisional] : [],
		...razones
	].join(". ");
	const alto = p.compacto && typeof p.alto === "number" ? p.alto : null;
	const { nivel, chips } = veloAjustado(alto, p.provisional);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: Inicio_module_default.heroeFoto,
		"data-compacto": p.compacto ? "" : void 0,
		"data-foto-heroe": "",
		"data-ajustada": nivel ?? void 0,
		style: alto !== null ? {
			height: alto,
			aspectRatio: "auto"
		} : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
			a: rutaMuestra(p.m),
			className: Inicio_module_default.heroeFotoEnlace,
			"aria-label": etiqueta,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: p.m.producto.imagen,
				alt: nombre,
				anchoCss: p.compacto ? 358 : 440,
				proporcion: p.compacto ? "1:1" : "4:5",
				radio: p.compacto ? "lg" : "xs",
				prioridad: "alta",
				tienda: p.m.tienda.nombre,
				categoria: p.m.producto.categoria,
				arrastrable: { nombreArchivo: `${p.m.producto.product_id}.jpg` },
				className: Inicio_module_default.fotoLlena
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VeloSiguiente, {
				m: p.m,
				provisional: p.provisional,
				chips
			})]
		})
	});
}
/**
* Tira de pendientes. `enPliegue` = cuántas de las primeras fotos caen en el primer pliegue (en Windows la tira vive
* dentro del héroe, a la vista): esas usan prioridad 'alta' (sin lazy), como la foto protagonista. En celular la tira
* va debajo del panel, fuera del pliegue, y todas cargan perezosas.
*/
function Tira(p) {
	const { visibles, mas } = tiraDe(p.cola, p.excluir);
	if (visibles.length === 0) return null;
	const enPliegue = p.enPliegue ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: `${Inicio_module_default.tira}${p.className ? ` ${p.className}` : ""}`,
		"aria-label": T.heroe.tira,
		children: [visibles.map((m, i) => {
			const nombre = nombreProducto(m);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: Inicio_module_default.tiraElemento,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
					a: rutaMuestra(m),
					className: Inicio_module_default.tiraFoto,
					"aria-label": T.heroe.tiraFoto(nombre, m.tienda.nombre),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: m.producto.imagen,
						alt: "",
						anchoCss: 64,
						proporcion: "1:1",
						radio: "md",
						prioridad: i < enPliegue ? "alta" : "normal",
						tienda: m.tienda.nombre,
						categoria: m.producto.categoria
					})
				})
			}, m.application_id);
		}), mas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: Inicio_module_default.tiraElemento,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
				a: "/muestras",
				className: Inicio_module_default.tiraMas,
				"aria-label": T.heroe.tiraMas(mas),
				children: ["+", formato.numero(mas)]
			})
		}) : null]
	});
}
function Titulo(p) {
	const cifra = formato.numero(p.n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: Inicio_module_default.heroeTitulo,
		"aria-label": T.heroe.titulo(p.n, cifra, p.compacto),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			"aria-hidden": "true",
			children: [
				T.heroe.antes(p.n),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Inicio_module_default.heroeNumero,
					children: cifra
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Inicio_module_default.heroeDespues,
					children: T.heroe.despues(p.n, p.compacto)
				})
			]
		})
	});
}
/** Acción principal + secundaria según el estado (una sola primaria por vista, 02 §7.1). */
function Acciones(p) {
	const control = useControlMuestra();
	const e = p.estado;
	let principal = null;
	let secundaria = null;
	const enlace = (texto, accion) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: Inicio_module_default.enlace,
		onClick: accion,
		children: [texto, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "ChevronRight",
			tamano: 16
		})]
	});
	switch (e.tipo) {
		case "sin_plan": {
			principal = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				iconoFinal: "ArrowRight",
				anchoCompleto: p.compacto,
				alPulsar: () => navegar("/muestras/plan"),
				children: T.heroe.armarPlan
			});
			const s = e.siguiente;
			if (s) secundaria = enlace(T.heroe.planearSoloEsta, () => void control.planear(s));
			break;
		}
		case "hoy": {
			const m = e.primero;
			principal = e.accion === "marcar_publicada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				icono: "CircleCheckBig",
				anchoCompleto: p.compacto,
				alPulsar: () => void control.cambiarEtapa(m, "publicada"),
				children: T.heroe.marcarPublicada
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				icono: "Clapperboard",
				anchoCompleto: p.compacto,
				alPulsar: () => navegar("/muestras/sesion"),
				children: T.heroe.empezarSesion
			});
			secundaria = enlace(T.heroe.verAgenda, () => navegar("/muestras/agenda"));
			break;
		}
		case "nada_hoy":
			principal = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				icono: "CalendarDays",
				anchoCompleto: p.compacto,
				alPulsar: () => navegar("/muestras/agenda"),
				children: T.heroe.verAgenda
			});
			break;
		case "atrasado":
			principal = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				iconoFinal: "ArrowRight",
				anchoCompleto: p.compacto,
				alPulsar: () => navegar("/muestras/agenda?atrasadas=1"),
				children: T.heroe.ponermeAlCorriente
			});
			break;
		case "al_dia":
			principal = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "lg",
				iconoFinal: "ArrowRight",
				anchoCompleto: p.compacto,
				alPulsar: () => navegar("/videos"),
				children: T.heroe.verVentasVideos
			});
			break;
		default: return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Inicio_module_default.acciones,
		"data-compacto": p.compacto ? "" : void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Inicio_module_default.accionPrincipal,
			"data-cta": "",
			children: principal
		}), secundaria]
	});
}
/** Líneas bajo el botón: «Tiendas avisadas 0 de 30 · Avisar» (solo con plan) y «1 no se puede etiquetar · Avisar a la tienda ›». */
function LineasAvisos(p) {
	const control = useControlMuestra();
	const primera = p.noSePuede[0];
	const avisadas = p.conPlan && p.conteos.tiendas_por_avisar > 0;
	if (!avisadas && !primera) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: Inicio_module_default.lineasAviso,
		"data-compacto": p.compacto ? "" : void 0,
		children: [avisadas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.lineaAvisoTexto,
				children: [
					T.heroe.avisadas,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: Inicio_module_default.mono,
						children: T.heroe.avisadasCifra(formato.numero(p.conteos.tiendas_avisadas), formato.numero(p.conteos.tiendas_con_pendientes))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.separador,
				"aria-hidden": "true",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
				a: "/muestras/avisos",
				className: Inicio_module_default.enlaceChico,
				children: [T.heroe.avisar, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 14
				})]
			})
		] }) : null, primera ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.lineaAvisoTexto,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Inicio_module_default.puntoAtencion,
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.heroe.noSePuede(p.noSePuede.length) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.separador,
				"aria-hidden": "true",
				children: "·"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: Inicio_module_default.enlaceChico,
				onClick: () => control.abrirMensaje({ solicitud: primera.application_id }),
				children: [T.heroe.avisarTienda, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 14
				})]
			})
		] }) : null]
	});
}
function OrdenNuevo(p) {
	if (!p.ordenNuevo.hay) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: Inicio_module_default.ordenNuevo,
		onClick: p.ordenNuevo.aplicar,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "RefreshCw",
			tamano: 14
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			T.heroe.ordenNuevo,
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: T.heroe.actualizar })
		] })]
	});
}
function Heroe(p) {
	const recorrido = useRecorrido("heroe_inicio");
	const e = p.estado;
	const destacada = e.tipo === "nada" ? null : destacadaDe(e);
	const [panelCompacto, setPanelCompacto] = (0, import_react.useState)(null);
	const altoFoto = useAltoFotoQueCabe(panelCompacto, p.compacto && destacada !== null);
	if (e.tipo === "nada") return null;
	const total = totalBarra(p.conteos);
	const contador = T.heroe.progreso(formato.numero(p.conteos.publicadas), formato.numero(total));
	const acciones = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BurbujaRecorrido, {
		visible: recorrido.visible,
		texto: recorrido.texto,
		esUltimo: recorrido.esUltimo,
		alSiguiente: recorrido.siguiente,
		alEntendido: recorrido.entendido,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.accionesMarco,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Acciones, {
				estado: e,
				compacto: p.compacto
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineasAvisos, {
				conteos: p.conteos,
				conPlan: p.conPlan,
				noSePuede: p.noSePuede,
				compacto: p.compacto
			})]
		})
	});
	if (e.tipo === "al_dia") {
		const videos = formato.numero(e.publicadas);
		const tiendas = formato.numero(e.tiendas);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelFirma, {
			className: Inicio_module_default.heroe,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.heroeAlDia,
				"data-compacto": p.compacto ? "" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
					variante: "al_dia",
					titulo: T.heroe.alDiaTicket,
					subtitulo: T.heroe.alDiaTexto(videos, tiendas),
					renglones: [],
					total: T.heroe.alDiaTotal(videos, tiendas),
					className: Inicio_module_default.heroeTicket
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Inicio_module_default.heroeTexto,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: Inicio_module_default.sobretitulo,
							children: T.heroe.sobretitulo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: Inicio_module_default.heroeTituloAlDia,
							children: T.heroe.alDiaTitulo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: Inicio_module_default.heroeSub,
							children: T.heroe.alDiaTexto(videos, tiendas)
						}),
						acciones
					]
				})]
			})
		});
	}
	const n = p.conteos.pendientes;
	const lineaPlan = e.tipo === "hoy" || e.tipo === "nada_hoy" || e.tipo === "atrasado" ? T.heroe.conPlan(formato.fechaConDia(e.termina), formato.fechaConDia(e.publica)) : null;
	const cabecera = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: Inicio_module_default.sobretitulo,
			children: T.heroe.sobretitulo
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.heroeTitulos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Titulo, {
				n,
				compacto: p.compacto
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Inicio_module_default.heroeSub,
				children: T.heroe.subtitulo(p.conteos.tiendas_con_pendientes, formato.numero(p.conteos.tiendas_con_pendientes))
			})]
		}),
		e.tipo === "atrasado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: Inicio_module_default.atraso,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "History",
				tamano: 16
			}), T.heroe.atraso(e.n)]
		}) : null,
		e.tipo === "nada_hoy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: Inicio_module_default.heroeLinea,
			children: T.heroe.nadaHoy(e.siguienteDia ? formato.fechaConDia(e.siguienteDia) : null)
		}) : null,
		lineaPlan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: Inicio_module_default.heroeLineaTenue,
			children: lineaPlan
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraEtapas, {
			segmentos: segmentosEtapas(p.conteos),
			total,
			contador,
			tamano: "inicio",
			leyenda: !p.compacto,
			className: Inicio_module_default.heroeBarra
		})
	] });
	if (p.compacto) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelFirma, {
		className: Inicio_module_default.heroe,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.heroeCompacto,
			ref: setPanelCompacto,
			children: [
				cabecera,
				destacada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoDestacada, {
					m: destacada,
					compacto: true,
					provisional: p.provisional,
					alto: altoFoto
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdenNuevo, { ordenNuevo: p.ordenNuevo }),
				acciones
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tira, {
		cola: p.cola,
		excluir: destacada?.application_id ?? null,
		className: Inicio_module_default.tiraSuelta
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelFirma, {
		className: Inicio_module_default.heroe,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.heroeRejilla,
			"data-con-foto": destacada ? "" : void 0,
			children: [destacada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoDestacada, {
				m: destacada,
				compacto: false,
				provisional: p.provisional
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.heroeTexto,
				children: [
					cabecera,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdenNuevo, { ordenNuevo: p.ordenNuevo }),
					acciones,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tira, {
						cola: p.cola,
						excluir: destacada?.application_id ?? null,
						enPliegue: 8
					})
				]
			})]
		})
	});
}
/**
* rev. 5 · Perfil de TikTok en Inicio (Display API, DashboardResponse.perfil_tiktok). Una franja discreta, sin tarjeta:
* «@usuario en TikTok · 55.2 mil seguidores +420 en 7 días · 1.3 M likes +12.5 mil en 7 días · Ver vistas de tus videos ›».
* Los cambios favorables van en --ok-fg y los desfavorables en --warn-fg (nunca en rojo, como los KPI); sin con qué
* comparar (null), no se pintan. Si la Display API no está conectada (solo Windows), una invitación sutil que se puede
* cerrar y no vuelve: «Conecta tus métricas de videos en Ajustes».
*/
var CLAVE_CERRADA = "corte.inicio.invitacion_metricas";
/** La invitación ya se cerró en este equipo (preferencia local: si el almacenamiento falla, se vuelve a ofrecer). */
function invitacionCerrada() {
	try {
		return window.localStorage.getItem(CLAVE_CERRADA) === "1";
	} catch {
		return false;
	}
}
function cerrarInvitacion() {
	try {
		window.localStorage.setItem(CLAVE_CERRADA, "1");
	} catch {}
}
function Cambio(p) {
	if (p.valor === null || p.valor === 0) return null;
	const texto = cambioConSigno(p.valor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: Inicio_module_default.perfilCambio,
		"data-sentido": p.valor > 0 ? "sube" : "baja",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: T.perfil.cambio(texto)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Inicio_module_default.srSolo,
			children: T.perfil.cambioLeido(texto, p.que)
		})]
	});
}
function PerfilTikTok(p) {
	const x = p.perfil;
	if (x.seguidores === null && x.likes_total === null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: Inicio_module_default.perfil,
		"aria-label": T.perfil.region,
		"data-perfil-tiktok": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.perfilIcono,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "SquarePlay",
					tamano: 18
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: Inicio_module_default.perfilTexto,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Inicio_module_default.perfilCuenta,
						children: [
							x.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: T.perfil.cuenta(x.username) }) : null,
							" ",
							T.perfil.enTikTok
						]
					}),
					x.seguidores !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Inicio_module_default.perfilCifra,
						title: formato.numero(x.seguidores),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cifraCompacta(x.seguidores) }),
							" ",
							T.perfil.seguidores(x.seguidores),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cambio, {
								valor: x.seguidores_cambio_7d,
								que: T.perfil.seguidores(2)
							})
						]
					}) : null,
					x.likes_total !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Inicio_module_default.perfilCifra,
						title: formato.numero(x.likes_total),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cifraCompacta(x.likes_total) }),
							" ",
							T.perfil.likes,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cambio, {
								valor: x.likes_cambio_7d,
								que: T.perfil.likes
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
				a: "/videos",
				className: Inicio_module_default.enlaceChico,
				children: [T.perfil.verVistas, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 16
				})]
			})
		]
	});
}
/** Invitación sutil (una sola vez): se cierra con ✕ o al seguir el enlace, y no vuelve en este equipo. */
function InvitacionMetricas() {
	const [cerrada, setCerrada] = (0, import_react.useState)(() => invitacionCerrada());
	if (cerrada) return null;
	const cerrar = () => {
		cerrarInvitacion();
		setCerrada(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: Inicio_module_default.invitacion,
		"aria-label": T.perfil.region,
		"data-invitacion-metricas": "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.perfilIcono,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "TrendingUp",
					tamano: 18
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: Inicio_module_default.invitacionEnlace,
				onClick: () => {
					cerrarInvitacion();
					navegar("/ajustes/metricas");
				},
				children: [T.perfil.invitacion, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 16
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "X",
				etiqueta: T.perfil.cerrarInvitacion,
				tamano: "sm",
				alPulsar: cerrar,
				className: Inicio_module_default.invitacionCerrar
			})
		]
	});
}
/**
* La paleta Ctrl+K la monta ui-marco y la firma de @/app no expone cómo abrirla: se le manda el mismo atajo que el
* usuario teclearía (keydown Ctrl+K que sube hasta document y window). Ver faltantes de contrato.
*/
function abrirPaleta() {
	if (typeof document === "undefined") return;
	document.body.dispatchEvent(new KeyboardEvent("keydown", {
		key: "k",
		code: "KeyK",
		ctrlKey: true,
		bubbles: true,
		cancelable: true
	}));
}
function Saludo(p) {
	const hola = p.usuario ? T.saludo(p.usuario) : T.saludoSinCuenta;
	const sincronizar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
		icono: "RefreshCw",
		etiqueta: T.sincronizar,
		variante: "secundario",
		girando: p.sincronizando,
		deshabilitado: !p.puedeSincronizar || p.sincronizando,
		alPulsar: p.alSincronizar
	});
	if (p.compacto) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncabezadoPantalla, {
		titulo: T.pantalla,
		contexto: p.contexto,
		acciones: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
			icono: "Search",
			etiqueta: T.buscar,
			variante: "secundario",
			alPulsar: abrirPaleta
		}), sincronizar] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: Inicio_module_default.saludo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.saludoTextos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: Inicio_module_default.saludoTitulo,
				children: hola
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Inicio_module_default.saludoContexto,
				children: p.contexto
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.saludoAcciones,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoBusqueda, {
				alAbrir: abrirPaleta,
				className: Inicio_module_default.saludoBuscar
			}), sincronizar]
		})]
	});
}
function Tendencia(p) {
	let cuerpo;
	if (p.cargando) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Inicio_module_default.esqGrafica,
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "titulo",
			ancho: 260
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "bloque",
			alto: 190
		})]
	});
	else if (p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: Inicio_module_default.tarjetaTitulo,
		children: T.tendencia.titulo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	})] });
	else if (p.puntos.length === 0) return null;
	else {
		const pico = semanaPico(p.puntos);
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
			titulo: T.tendencia.titulo,
			puntos: p.puntos.map((x) => ({
				clave: x.clave,
				etiqueta: x.etiqueta,
				valor: x.valor,
				enCurso: x.enCurso,
				aria: x.aria
			})),
			formatoEje: (v) => formato.ejeDinero(v),
			alto: p.compacto ? 180 : 220,
			...pico ? { nota: pico } : {},
			tablaGemela: tablaTendencia(p.puntos)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Inicio_module_default.tarjetaSeccion,
		children: cuerpo
	});
}
var FOTOS_POR_TIENDA = 3;
function FilaTiendaAtencion(p) {
	const t = p.tienda;
	const fotos = p.pendientes.slice(0, FOTOS_POR_TIENDA);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
		a: `/tiendas/${encodeURIComponent(t.tienda_key)}`,
		className: Inicio_module_default.tiendaFila,
		"aria-label": T.tiendas.abrir(t.nombre, t.salud_porque),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
				nombre: t.nombre,
				tamano: 40
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.tiendaTextos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Inicio_module_default.tiendaNombreLinea,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Inicio_module_default.tiendaNombre,
						children: t.nombre
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
						salud: t.salud,
						esSocio: t.es_socio
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Inicio_module_default.tiendaPorque,
					children: t.salud_porque
				})]
			}),
			fotos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.tiendaFotos,
				"aria-hidden": "true",
				children: fotos.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombreProducto(m),
					anchoCss: 40,
					proporcion: "1:1",
					radio: "sm",
					tienda: t.nombre,
					categoria: m.producto.categoria,
					className: Inicio_module_default.tiendaFoto
				}, m.application_id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "ChevronRight",
				tamano: 16,
				className: Inicio_module_default.tiendaChevron
			})
		]
	}) });
}
function TiendasAtencion(p) {
	let cuerpo;
	if (!p.tiendas && p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	});
	else if (!p.tiendas || p.cargando === true) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: Inicio_module_default.esqFilas,
		"aria-busy": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "fila",
			lineas: 3
		})
	});
	else if (p.tiendas.length === 0) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: Inicio_module_default.vacioSuave,
		children: T.tiendas.vacio
	});
	else cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: Inicio_module_default.tiendasLista,
		children: p.tiendas.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaTiendaAtencion, {
			tienda: t,
			pendientes: p.porTienda.get(t.tienda_key) ?? []
		}, t.tienda_key))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Inicio_module_default.tarjetaSeccion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-labelledby": "inicio-tiendas",
			className: Inicio_module_default.seccionInterna,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: Inicio_module_default.tarjetaTitulo,
					id: "inicio-tiendas",
					children: T.tiendas.titulo
				}),
				cuerpo,
				p.conPendientes > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
					a: "/tiendas?vista=atencion",
					className: Inicio_module_default.enlacePie,
					children: [T.tiendas.enlace(p.conPendientes), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "ChevronRight",
						tamano: 16
					})]
				}) : null
			]
		})
	});
}
var rutaVideo = (v) => `/videos/${encodeURIComponent(v.content_id)}`;
function Miniatura(p) {
	const v = p.v;
	const portada = portadaVideo(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniaturaVideo, {
		url: portada.url,
		...portada.delProducto ? { rotulo: T.estrella.rotulo } : {},
		...p.ranking !== void 0 ? { ranking: p.ranking } : {},
		comision: formato.dinero(v.comision_estimada_centavos),
		unidades: textoUnidades(v.unidades),
		nombre: p.nombre,
		fechaPoster: formato.fechaCorta(v.primera_venta),
		tienda: v.tienda_principal,
		anchoCss: p.ancho,
		etiqueta: etiquetaVideo(p.ranking ?? 1, v, p.nombre),
		alPulsar: () => navegar(rutaVideo(v)),
		...p.className ? { className: p.className } : {}
	});
}
/**
* Portada 9:16 del video estrella (lienzo Main.png / MovilInicio.png): la portada real del video o la foto del producto
* a sangre con su rótulo, y solo «▶ 8 unidades» encima. La comisión NO se repite sobre la foto: ya es la cifra grande de
* la tarjeta (con MiniaturaVideo saldría dos veces). Sin portada, el mosaico de la tienda de <Foto>.
*/
function PortadaEstrella(p) {
	const v = p.v;
	const { url, delProducto } = portadaVideo(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
		a: rutaVideo(v),
		className: Inicio_module_default.estrellaPortada,
		"aria-label": etiquetaVideo(1, v, p.nombre),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url,
				alt: "",
				anchoCss: p.ancho,
				proporcion: "9:16",
				radio: "lg",
				tienda: v.tienda_principal,
				className: Inicio_module_default.estrellaFoto
			}),
			delProducto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Inicio_module_default.estrellaRotulo,
				"aria-hidden": "true",
				children: T.estrella.rotulo
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Inicio_module_default.estrellaUnidades,
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Play",
					tamano: 14
				}), textoUnidades(v.unidades)]
			})
		]
	});
}
function VideoEstrella(p) {
	let cuerpo;
	if (p.cargando) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: Inicio_module_default.estrella,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "bloque",
			className: Inicio_module_default.esqEstrella
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.estrellaTextos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "70%"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 2
			})]
		})]
	});
	else if (p.error) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: Inicio_module_default.tarjetaTitulo,
		children: T.estrella.titulo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvisoSeccion, {
		error: p.error,
		alReintentar: p.alReintentar
	})] });
	else if (!p.video) cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: Inicio_module_default.tarjetaTitulo,
		children: T.estrella.titulo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "SquarePlay",
		titulo: T.estrella.sinVideo,
		texto: T.estrella.sinVideoTexto,
		className: Inicio_module_default.vacioTarjeta
	})] });
	else {
		const v = p.video;
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.estrella,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortadaEstrella, {
				v,
				nombre: p.nombre,
				ancho: p.compacto ? 120 : 168
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.estrellaTextos,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: Inicio_module_default.tarjetaTitulo,
						children: T.estrella.titulo
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: Inicio_module_default.estrellaCifra,
						children: formato.dinero(v.comision_estimada_centavos)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: Inicio_module_default.estrellaNota,
						children: T.estrella.nota(p.vendieron, formato.numero(p.vendieron))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: Inicio_module_default.estrellaProducto,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Inicio_module_default.estrellaNombre,
							children: p.nombre
						}), v.tienda_principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Inicio_module_default.estrellaVende,
							children: v.tienda_principal
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Inicio_module_default.empuje }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EnlaceRuta, {
						a: "/videos",
						className: Inicio_module_default.enlacePie,
						children: [T.estrella.verVideos, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronRight",
							tamano: 16
						})]
					})
				]
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
		padding: "amplio",
		className: Inicio_module_default.tarjetaSeccion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			"aria-label": T.estrella.titulo,
			className: Inicio_module_default.seccionInterna,
			children: cuerpo
		})
	});
}
function TopVideos(p) {
	if (p.videos.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banda, {
		titulo: T.topVideos.titulo,
		accion: {
			etiqueta: T.topVideos.verTodos,
			a: "/videos"
		},
		className: Inicio_module_default.topVideos,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: Inicio_module_default.rielVideos,
			"aria-label": T.topVideos.lista,
			"data-compacto": p.compacto ? "" : void 0,
			children: p.videos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: Inicio_module_default.rielElemento,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Miniatura, {
					v,
					ranking: i + 1,
					nombre: p.nombres.get(v.content_id) ?? T.video.sinNombre(formato.idCorto(v.content_id)),
					ancho: p.compacto ? 148 : 200,
					className: Inicio_module_default.rielMiniatura
				})
			}, v.content_id))
		})
	});
}
/**
* #/inicio · Inicio (01_ux §4.1; 02 §5.2 Windows y §5.3 celular). En 3 segundos: qué hago ahora, qué hay para hoy y
* cómo va el dinero. Orden: saludo → «Vencen pronto» → «Promesas vencidas» → héroe «Ponte al día» (+ «Hoy» con plan) →
* «Tu dinero» → tiendas que necesitan atención y video estrella → videos que más venden → avisos → tendencia → pie.
* Cada bloque aparece solo si aplica y cada sección degrada sola (esqueleto, error o «Necesita tu PC encendida»).
* rev. 5: antes de «Tus videos que más venden», el resumen discreto del perfil de TikTok (seguidores y likes) si la
* Display API ya lo trajo; si no está conectada (solo Windows), una invitación sutil que se puede cerrar y no vuelve.
*/
function PantallaInicio() {
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const android = plataforma === "android";
	const compacto = clase === "compacta";
	const [raiz, setRaiz] = (0, import_react.useState)(null);
	const holgura = useHolguraCapas(raiz);
	const sesion = useSesion();
	const sync = useSync();
	const muestras = useConsulta("muestras", {});
	const avisos = useConsulta("avisos", {});
	const d30 = useConsulta("dashboard", { periodo: "30d" });
	const dTodo = useConsulta("dashboard", { periodo: "todo" });
	const tiendas = useConsulta("tiendas", { orden: "atencion" });
	const hasta = d30.datos?.periodo?.hasta ?? null;
	const rTendencia = hasta ? rangoTendencia(hasta) : null;
	const serie = useConsulta("serie", {
		granularidad: "semana",
		desde: rTendencia?.desde ?? "",
		hasta: rTendencia?.hasta ?? ""
	}, { activa: rTendencia !== null });
	const r7 = hasta ? rangoDePeriodo("7d", hasta) : null;
	const videos7 = useConsulta("videos", r7 ? {
		desde: r7.desde,
		hasta: r7.hasta
	} : {}, { activa: r7 !== null });
	const cuentaPorLiquidar = useConsulta("ordenes", {
		estado: [...ESTADOS_POR_LIQUIDAR],
		por_pagina: 1
	}, { activa: dTodo.datos !== void 0 });
	const totalPorLiquidar = respuestaPorLiquidar(cuentaPorLiquidar.datos)?.total ?? 0;
	const ultimoPorLiquidar = useConsulta("ordenes", {
		estado: [...ESTADOS_POR_LIQUIDAR],
		pagina: totalPorLiquidar,
		por_pagina: 1
	}, { activa: totalPorLiquidar > 0 });
	const porLiquidar = (0, import_react.useMemo)(() => pedidosPorLiquidar(cuentaPorLiquidar.datos, ultimoPorLiquidar.datos), [cuentaPorLiquidar.datos, ultimoPorLiquidar.datos]);
	const ahora = ahoraS();
	const hoy = hoyLocal(ahora);
	const todas = (0, import_react.useMemo)(() => muestras.datos?.items ?? [], [muestras.datos]);
	const colaBruta = (0, import_react.useMemo)(() => pendientesEnCola(todas), [todas]);
	const estable = useListaEstable(muestras.datos ? colaBruta : void 0, (m) => m.application_id);
	const cola = estable.items;
	const listaAvisos = (0, import_react.useMemo)(() => avisos.datos?.items ?? [], [avisos.datos]);
	const conteos = (0, import_react.useMemo)(() => contarTrabajo(todas, listaAvisos, hoy), [
		todas,
		listaAvisos,
		hoy
	]);
	const estadoSync = sync.estado ?? sesion.datos?.sync ?? null;
	const ultimaOk = sesion.datos?.datos.ultima_sync_ok_at ?? null;
	const primera = primeraSincronizacion(estadoSync, ultimaOk);
	const provisional = ordenProvisional(estadoSync, ultimaOk);
	const enCamino = ventasEnCamino(estadoSync, ultimaOk);
	const heroe = (0, import_react.useMemo)(() => estadoHeroe(cola, todas, conteos, hoy), [
		cola,
		todas,
		conteos,
		hoy
	]);
	const conPlan = hayPlan(cola);
	const hoyBloque = conPlan ? bloqueHoy(cola, hoy) : null;
	const vencen = (0, import_react.useMemo)(() => vencenPronto(cola, ahora), [cola, ahora]);
	const promesas = (0, import_react.useMemo)(() => promesasVencidas(todas), [todas]);
	const noSePuede = (0, import_react.useMemo)(() => noSePuedeEtiquetar(cola), [cola]);
	const porTienda = (0, import_react.useMemo)(() => pendientesPorTienda(cola), [cola]);
	const tendencia = (0, import_react.useMemo)(() => serie.datos && hasta ? tendenciaSemanal(serie.datos, hasta) : [], [serie.datos, hasta]);
	const productos = (0, import_react.useMemo)(() => [...d30.datos?.top_productos ?? [], ...dTodo.datos?.top_productos ?? []], [d30.datos, dTodo.datos]);
	const semanaOk = !videos7.datos || semanaCoherente(videos7.datos.items, d30.datos);
	const estrella = videos7.datos && semanaOk ? videoEstrella(videos7.datos.items) : null;
	const vendieron = videos7.datos && semanaOk ? videosQueVendieron(videos7.datos.items) : 0;
	const top = (0, import_react.useMemo)(() => topVideos$1(d30.datos?.top_videos ?? []), [d30.datos]);
	const nombres = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const v of [...top, ...estrella ? [estrella] : []]) m.set(v.content_id, nombreDeVideo(v, productos, todas));
		return m;
	}, [
		top,
		estrella,
		productos,
		todas
	]);
	const perfil = d30.datos?.perfil_tiktok ?? dTodo.datos?.perfil_tiktok ?? null;
	const invitar = invitarMetricas(android, perfil, useConsulta("display", {}, { activa: !android && !perfil && d30.datos !== void 0 }).datos?.estado ?? null, false);
	const usuario = sesion.datos?.cuenta?.username ?? null;
	const frescura = ultimaOk !== null ? T.actualizado(haceCuanto(ultimaOk, ahora)) : estadoSync?.en_curso ? T.sincronizando : T.sinSincronizar;
	const origen = muestras.fuente === "copia" && muestras.copia_at !== null ? T.copiaDel(momentoSync(muestras.copia_at, hoy)) : T.desdeTuPc;
	const conOrigen = android ? `${frescura} · ${origen}` : frescura;
	const contexto = horaSinCorte(compacto ? conOrigen : `${fechaSaludo(hoy)} · ${conOrigen}`);
	const saludo = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Saludo, {
		usuario,
		contexto,
		compacto,
		sincronizando: !!estadoSync?.en_curso,
		puedeSincronizar: sync.puede,
		alSincronizar: () => void sync.sincronizar()
	});
	const lista = muestras.datos !== void 0 || muestras.error !== null;
	let contenido;
	if (!lista) contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CargaInicio, { compacto });
	else if (muestras.error && !muestras.datos) {
		const e = muestras.error;
		contenido = e.codigo === "necesita_pc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Smartphone",
			titulo: T.estados.sinDatosAndroidTitulo,
			texto: T.estados.sinDatosAndroidTexto,
			accion: {
				etiqueta: T.estados.emparejar,
				alPulsar: () => navegar("/emparejar")
			},
			className: Inicio_module_default.estadoGlobal
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleAlert",
			titulo: T.estados.errorTitulo,
			texto: e.mensaje,
			accion: {
				etiqueta: T.estados.reintentar,
				alPulsar: () => void muestras.refrescar()
			},
			className: Inicio_module_default.estadoGlobal
		});
	} else if (sesion.datos?.datos.hay_datos === false && !estadoSync?.en_curso && todas.length === 0) contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
		icono: "RefreshCw",
		titulo: T.estados.sinDatosTitulo,
		texto: T.estados.sinDatosTexto,
		...sync.puede ? { accion: {
			etiqueta: T.sincronizar,
			alPulsar: () => void sync.sincronizar()
		} } : {},
		className: Inicio_module_default.estadoGlobal
	});
	else {
		let bloqueHeroe;
		if (todas.length === 0 && primera) bloqueHeroe = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelFirma, {
			className: Inicio_module_default.heroe,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoHeroe, { compacto })
		});
		else if (heroe.tipo === "nada") bloqueHeroe = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarjeta, {
			padding: "amplio",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
				icono: "Package",
				titulo: T.estados.sinPendientesTitulo,
				texto: T.estados.sinPendientesTexto,
				className: Inicio_module_default.vacioTarjeta
			})
		});
		else bloqueHeroe = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heroe, {
			estado: heroe,
			conteos,
			cola,
			noSePuede,
			conPlan,
			compacto,
			provisional,
			ordenNuevo: {
				hay: estable.hayOrdenNuevo,
				aplicar: estable.aplicarOrdenNuevo
			}
		});
		const listaTiendas = tiendas.datos ? tiendasAtencion(tiendas.datos.items) : void 0;
		contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			primera ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineaTrayendo, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VencenPronto, {
				filas: vencen,
				hoy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromesasVencidas, { filas: promesas }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.filaHeroe,
				"data-con-hoy": hoyBloque && !compacto ? "" : void 0,
				children: [bloqueHeroe, hoyBloque ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaHoy, { bloque: hoyBloque }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dinero, {
				d30: d30.datos,
				dTodo: dTodo.datos,
				porLiquidar,
				error: d30.error,
				enCamino,
				tendencia,
				compacto,
				alReintentar: () => void d30.refrescar()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.filaDos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiendasAtencion, {
					tiendas: listaTiendas,
					cargando: primera && (listaTiendas?.length ?? 0) === 0,
					conPendientes: tiendas.datos ? tiendasConPendientes(tiendas.datos.items) : 0,
					porTienda,
					error: tiendas.error,
					alReintentar: () => void tiendas.refrescar()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoEstrella, {
					video: estrella,
					nombre: estrella ? nombres.get(estrella.content_id) ?? "" : "",
					vendieron,
					cargando: enCamino || !semanaOk || !videos7.datos && !videos7.error && !d30.error,
					error: videos7.datos ? null : videos7.error ?? (d30.datos ? null : d30.error),
					compacto,
					alReintentar: () => void videos7.refrescar()
				})]
			}),
			perfil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerfilTikTok, { perfil }) : invitar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvitacionMetricas, {}) : null,
			enCamino ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopVideos, {
				videos: top,
				nombres,
				compacto
			}),
			d30.datos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Alertas, { alertas: alertasVisibles(d30.datos.alertas) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tendencia, {
				puntos: tendencia,
				cargando: enCamino || !serie.datos && !serie.error && !d30.error,
				error: serie.datos ? null : serie.error ?? (d30.datos ? null : d30.error),
				compacto,
				alReintentar: () => void serie.refrescar()
			}),
			ultimaOk !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: Inicio_module_default.pie,
				children: horaSinCorte(T.pie(momentoSync(ultimaOk, hoy)))
			}) : null
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.pantalla,
		lista,
		className: Inicio_module_default.pantalla,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Inicio_module_default.inicio,
			"data-compacto": compacto ? "" : void 0,
			"data-android": android ? "" : void 0,
			ref: setRaiz,
			children: [saludo, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Inicio_module_default.contenido,
				children: [
					compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: Inicio_module_default.holaCompacto,
						children: usuario ? T.saludo(usuario) : T.saludoSinCuenta
					}) : null,
					contenido,
					holgura > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: Inicio_module_default.holgura,
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
export { PantallaInicio };
