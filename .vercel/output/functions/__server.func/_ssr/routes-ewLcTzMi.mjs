import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as PASO_ETAPA, $t as fechaPrometidaPorOmision, An as resaltar, At as calcularAtributos, B as ICONO_GRUPO, Bn as tituloPlan, Bt as diaSemana, C as ETIQUETA_ETAPA, Cn as plantillaRecomendada, D as ETIQUETA_PASO_SYNC, Dt as atras, E as ETIQUETA_NIVEL, En as promesaEnRiesgo, Et as aplicarAtributos, F as Foto, Fn as sumarDias, G as Kbd, Gn as useClaseAncho, Gt as epochDeFecha, H as Icono, I as GraficaColumnas, In as temaVisible, It as contarTrabajo, J as Menu, Jn as useEntradaAtributos, Jt as esPendiente, Kn as useConexionPc, Kt as esCampo, Ln as textoDatosGuion, Lt as contentIdDeEnlace, M as Esqueleto, Mn as resolverRuta, Mt as coincide, N as EsqueletoVista, Nn as rutaActual, Nt as compartirTexto, O as ETIQUETA_SALUD, On as registrarAtajos, Ot as avisarTemaNativo, P as EstadoVacio, Pt as consultar, Q as OpcionRadio, Qt as fechaLocalDe, R as Hoja, Rt as copiarTexto, S as ETIQUETA_ESTADO_ORDEN, Sn as planVivo, St as ahoraS, T as ETIQUETA_MOTIVO_NO_SE_PUEDE, Tn as programarNotificaciones, Tt as almacen, U as Insignia, Un as useAtajosRegistrados, V as ICONO_RAZON, Vn as useAcciones, Vt as diasEntre, W as Interruptor, Wn as useCapacidades, X as Modal, Yn as useEventoHub, Z as MosaicoQr, _ as ChipEtapa, an as horaLocal, ar as useSesion, at as PuntoVivo, b as CodigoEmparejamiento, bt as accionPrincipal, cr as useToast, ct as SelectorFecha, d as BotonIcono, dr as vibrar, dt as TONO_GRUPO, en as fijarParametro, er as useParametro, et as Palomita, f as BurbujaRecorrido, fn as modoDemo, ft as TONO_SALUD, g as Chip, gn as nuevoId, h as Casilla$1, in as guardarImagen, ir as useRuta, it as ProveedorToasts, j as ErrorHub, jn as resolverPlantilla, jt as calcularNotificaciones, kn as registrarAtras, lr as validarEtapa, lt as SelectorFechaHora, m as CampoTexto, mn as nombreCorto, n as AvatarCuenta, nn as formato, nr as usePrimeraVez, on as hoyLocal, or as useSync, pn as navegar, q as LimiteError, qn as useConsulta, qt as esEnlaceTikTok, r as AvatarTienda, rr as useRecorrido, sn as hub, st as Segmentado, t as AreaTexto, tn as fijarReloj, tr as usePlataforma, u as Boton, ur as ventana, ut as SelectorNumero, vn as opCambioEtapa, vt as abrirExterno, wn as profundidadHistorial, wt as alVolverAlFrente, x as ETIQUETA_ACCION, y as ChipsDias, yt as abrirTikTok, z as ICONO_ETAPA, zn as textoRazon } from "./app-CLiVRbtG.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ewLcTzMi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
/** Etapas cuyo día planeado ocupa capacidad (ya hay un video para ese día). */
var ESTADOS_OCUPAN = /* @__PURE__ */ new Set([
	"planeada",
	"video_listo",
	"programada"
]);
/** Tope de búsqueda de días (10 años): evita ciclos infinitos con entradas absurdas. */
var TOPE_DIAS = 3660;
function sumar(mapa, fecha, n = 1) {
	mapa.set(fecha, (mapa.get(fecha) ?? 0) + n);
}
function diasValidos(dias) {
	return new Set(dias.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6));
}
function capacidadDe(c) {
	return Number.isFinite(c) ? Math.max(1, Math.floor(c)) : 1;
}
function compararTexto(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}
function posicion$1(m) {
	return m.posicion_cola ?? Number.MAX_SAFE_INTEGER;
}
function compararSugerido(a, b) {
	return posicion$1(a) - posicion$1(b) || compararTexto(a.application_id, b.application_id);
}
/** Categoría hoja ('Ropa interior y de hombre > Camisas > Sudaderas' → 'sudaderas'). */
function categoriaHoja(m) {
	const partes = (m.producto.categoria ?? "").split(/\s*(?:›|>)\s*/).map((p) => p.trim()).filter((p) => p.length > 0);
	return (partes[partes.length - 1] ?? "").toLocaleLowerCase("es-MX");
}
/** "En lote por tipo de prenda": junta las de la misma categoría hoja en días seguidos; los lotes salen en el orden
*  sugerido de su primera muestra y, dentro de cada lote, en orden sugerido. */
function ordenarPorTipo(lista) {
	const sugerido = [...lista].sort(compararSugerido);
	const lotes = /* @__PURE__ */ new Map();
	for (const m of sugerido) {
		const clave = categoriaHoja(m) || `~${m.application_id}`;
		const lote = lotes.get(clave);
		if (lote) lote.push(m);
		else lotes.set(clave, [m]);
	}
	return [...lotes.values()].flat();
}
function fechaLimite(m) {
	return m.fecha_limite_at !== null ? fechaLocalDe(m.fecha_limite_at) : null;
}
function promesaPara(m, promesas) {
	return promesas[m.application_id] ?? m.avisos.promesa ?? null;
}
/** Fecha más tardía en la que se puede hacer el video sin romper la promesa (promesa − 2). */
function topePromesa(p) {
	return p === null ? null : sumarDias(p, -2);
}
function vacio$2() {
	return {
		asignaciones: [],
		termina: null,
		publica_a_mas_tardar: null,
		por_dia: {},
		no_alcanza: [],
		rompe_promesa: []
	};
}
/** Ocupación por día de lo que NO se reacomoda: planes (y avances de muestras) en etapas que ocupan, con fecha. */
function ocupacion(e, excluir) {
	const ocupado = /* @__PURE__ */ new Map();
	const vistos = /* @__PURE__ */ new Set();
	for (const p of e.planes) {
		if (p.fecha_plan === null || !ESTADOS_OCUPAN.has(p.estado)) continue;
		const clave = p.application_id ?? `plan:${p.id}`;
		if (vistos.has(clave) || p.application_id !== null && excluir.has(p.application_id)) continue;
		vistos.add(clave);
		sumar(ocupado, p.fecha_plan);
	}
	for (const m of e.muestras) {
		const f = m.avance.fecha_planeada;
		if (f === null || !ESTADOS_OCUPAN.has(m.avance.etapa) || excluir.has(m.application_id) || vistos.has(m.application_id)) continue;
		vistos.add(m.application_id);
		sumar(ocupado, f);
	}
	return ocupado;
}
function cerrar$1(asignaciones, ocupado, desde, no_alcanza, rompe_promesa) {
	const porDia = /* @__PURE__ */ new Map();
	for (const [f, n] of ocupado) if (f >= desde) sumar(porDia, f, n);
	for (const a of asignaciones) sumar(porDia, a.fecha);
	let termina = null;
	for (const a of asignaciones) if (termina === null || a.fecha > termina) termina = a.fecha;
	const por_dia = {};
	for (const f of [...porDia.keys()].sort()) {
		const n = porDia.get(f) ?? 0;
		if (n > 0) por_dia[f] = n;
	}
	return {
		asignaciones,
		termina,
		publica_a_mas_tardar: termina === null ? null : sumarDias(termina, 2),
		por_dia,
		no_alcanza,
		rompe_promesa
	};
}
/** Reglas 1–3 de 01_ux §4.5 (por vencer primero, capacidad contando lo ya planeado, días sin videos, promesas).
*  Caso real: 32 pendientes, 3/día, L–S, desde jue 12 nov → termina mar 24 nov, publica jue 26 nov. */
function armarPlan(entrada) {
	const dias = diasValidos(entrada.dias);
	const capacidad = capacidadDe(entrada.capacidad);
	const porId = new Map(entrada.muestras.map((m) => [m.application_id, m]));
	const vistos = /* @__PURE__ */ new Set();
	const incluidas = [];
	for (const id of entrada.incluidas) {
		const m = porId.get(id);
		if (!m || vistos.has(id) || !esPendiente(m)) continue;
		if (m.avance.etapa !== "por_planear" && m.avance.etapa !== "planeada") continue;
		vistos.add(id);
		incluidas.push(m);
	}
	if (incluidas.length === 0 || dias.size === 0) return vacio$2();
	const conservar = entrada.respetarFechas ? incluidas.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada !== null) : [];
	const idsConservar = new Set(conservar.map((m) => m.application_id));
	const asignar = incluidas.filter((m) => !idsConservar.has(m.application_id));
	const idsAsignar = new Set(asignar.map((m) => m.application_id));
	const ocupado = ocupacion(entrada, idsAsignar);
	const porVencer = asignar.filter((m) => m.grupo === "por_vencer").sort((a, b) => (a.fecha_limite_at ?? Number.MAX_SAFE_INTEGER) - (b.fecha_limite_at ?? Number.MAX_SAFE_INTEGER) || compararSugerido(a, b));
	const restoBase = asignar.filter((m) => m.grupo !== "por_vencer");
	const resto = entrada.orden === "por_tipo_de_prenda" ? ordenarPorTipo(restoBase) : [...restoBase].sort(compararSugerido);
	const orden = [...porVencer, ...resto];
	const lugares = [];
	let d = entrada.desde;
	for (let i = 0; i < TOPE_DIAS && lugares.length < orden.length; i++, d = sumarDias(d, 1)) {
		if (!dias.has(diaSemana(d))) continue;
		const libres = Math.max(0, capacidad - (ocupado.get(d) ?? 0));
		for (let k = 0; k < libres && lugares.length < orden.length; k++) lugares.push(d);
	}
	const ocupante = orden.slice(0, lugares.length);
	const indiceDe = (m) => ocupante.indexOf(m);
	const conPromesa = orden.filter((m) => promesaPara(m, entrada.promesas) !== null).sort((a, b) => compararTexto(promesaPara(a, entrada.promesas) ?? "", promesaPara(b, entrada.promesas) ?? ""));
	const rompe_promesa = [];
	const idsPorVencer = new Set(porVencer.map((m) => m.application_id));
	for (const m of conPromesa) {
		const p = promesaPara(m, entrada.promesas);
		const tope = topePromesa(p);
		const i = indiceDe(m);
		if (p === null || tope === null || i < 0) continue;
		const fecha = lugares[i];
		if (fecha === void 0 || fecha <= tope) continue;
		const mVence = idsPorVencer.has(m.application_id);
		let elegido = -1;
		for (let j = i - 1; j >= 0; j--) {
			const lugar = lugares[j];
			const otro = ocupante[j];
			if (lugar === void 0 || otro === void 0 || lugar > tope) continue;
			const otroVence = idsPorVencer.has(otro.application_id);
			if (otroVence !== mVence) continue;
			const limiteOtro = otroVence ? fechaLimite(otro) : null;
			if (limiteOtro !== null && fecha > limiteOtro) continue;
			const topeOtro = topePromesa(promesaPara(otro, entrada.promesas));
			if (topeOtro !== null && fecha > topeOtro) continue;
			elegido = j;
			break;
		}
		if (elegido >= 0) {
			const otro = ocupante[elegido];
			ocupante[elegido] = m;
			ocupante[i] = otro;
		} else rompe_promesa.push({
			application_id: m.application_id,
			promesa: p,
			fecha
		});
	}
	const no_alcanza = [];
	const asignaciones = [];
	conservar.forEach((m, k) => {
		const fecha = m.avance.fecha_planeada ?? entrada.desde;
		asignaciones.push({
			application_id: m.application_id,
			fecha,
			ya_tenia_fecha: true,
			_orden: -conservar.length + k
		});
		const limite = fechaLimite(m);
		if (m.grupo === "por_vencer" && limite !== null && fecha > limite) no_alcanza.push({
			application_id: m.application_id,
			fecha_limite: limite
		});
		const p = promesaPara(m, entrada.promesas);
		const tope = topePromesa(p);
		if (p !== null && tope !== null && fecha > tope) rompe_promesa.push({
			application_id: m.application_id,
			promesa: p,
			fecha
		});
	});
	ocupante.forEach((m, i) => {
		const fecha = lugares[i];
		if (m === void 0 || fecha === void 0) return;
		asignaciones.push({
			application_id: m.application_id,
			fecha,
			ya_tenia_fecha: m.avance.fecha_planeada !== null,
			_orden: i
		});
		const limite = fechaLimite(m);
		if (m.grupo === "por_vencer" && limite !== null && fecha > limite) no_alcanza.push({
			application_id: m.application_id,
			fecha_limite: limite
		});
	});
	asignaciones.sort((a, b) => compararTexto(a.fecha, b.fecha) || a._orden - b._orden);
	return cerrar$1(asignaciones.map(({ application_id, fecha, ya_tenia_fecha }) => ({
		application_id,
		fecha,
		ya_tenia_fecha
	})), ocupacion(entrada, /* @__PURE__ */ new Set([...idsAsignar, ...idsConservar])), entrada.desde, no_alcanza, rompe_promesa);
}
/** 'Hoy' antes de las 6:00 p. m. local; si no, mañana. */
function desdePorOmision(ahora) {
	const hoy = fechaLocalDe(ahora);
	return horaLocal(ahora).h < 18 ? hoy : sumarDias(hoy, 1);
}
function esRecorrido(r) {
	return "cambios" in r && Array.isArray(r.cambios);
}
/** Ops para crear/editar los PlanVideo del resultado (todas a 'planeada' con su fecha_plan). Con un ResultadoRecorrido
*  solo se generan las de `cambios`. Lo que ya está planeado en esa misma fecha no genera op. */
function opsDePlan(resultado, muestras, planes) {
	const lista = esRecorrido(resultado) ? resultado.cambios : resultado.asignaciones;
	const porId = new Map(muestras.map((m) => [m.application_id, m]));
	const ops = [];
	const hechos = /* @__PURE__ */ new Set();
	lista.forEach((a, i) => {
		if (hechos.has(a.application_id)) return;
		hechos.add(a.application_id);
		const m = porId.get(a.application_id);
		const plan = planVivo(a.application_id, planes);
		if (plan !== null) {
			if (plan.estado === "planeada" && plan.fecha_plan === a.fecha) return;
			ops.push({
				tipo: "plan.editar",
				id: plan.id,
				cambios: {
					estado: "planeada",
					fecha_plan: a.fecha,
					rev: plan.rev
				}
			});
			return;
		}
		if (m === void 0) return;
		if (m.avance.plan_id !== null) {
			if (m.avance.etapa === "planeada" && m.avance.fecha_planeada === a.fecha) return;
			ops.push({
				tipo: "plan.editar",
				id: m.avance.plan_id,
				cambios: {
					estado: "planeada",
					fecha_plan: a.fecha,
					rev: m.avance.rev
				}
			});
			return;
		}
		ops.push({
			tipo: "plan.crear",
			datos: {
				id: nuevoId(),
				titulo: tituloPlan(m),
				application_id: m.application_id,
				product_id: m.producto.product_id,
				tienda_key: m.tienda.tienda_key,
				estado: "planeada",
				fecha_plan: a.fecha,
				orden: i
			}
		});
	});
	return ops;
}
function compararElementos(a, b) {
	return a.orden - b.orden || a.posicion - b.posicion || compararTexto(a.clave, b.clave);
}
/**
* "Agregar y recorrer las demás" (01 §5.5): pone `nueva` (por vencer, prioridad urgente) en el primer día de videos
* desde `desde`, al frente de ese día; si el día ya estaba lleno, la última planeada NO fijada de ese día pasa al
* frente del siguiente día de videos, y así en cascada hasta que alguien cabe. Lo fijado (fijada, video listo,
* programada o planes sin muestra) no se mueve y cuenta para la capacidad. Reporta: no_alcanza si la nueva (o una
* por vencer recorrida) queda después de su fecha límite; rompe_promesa por cada muestra recorrida cuya fecha + 2
* supere lo prometido. `cambios` = solo lo que cambia de fecha (y la nueva); termina_antes = término antes de meterla.
* De la entrada se usan capacidad, dias, desde, muestras, planes y promesas (incluidas, orden y respetarFechas no
* aplican: todo lo que no se recorre conserva su fecha).
*/
function recorrerPlan(entrada, nueva) {
	const dias = diasValidos(entrada.dias);
	const capacidad = capacidadDe(entrada.capacidad);
	const porId = new Map(entrada.muestras.map((m) => [m.application_id, m]));
	const elementos = [];
	const vistos = /* @__PURE__ */ new Set([nueva.application_id]);
	const agregar = (clave, applicationId, fecha, etapa, fijada, orden) => {
		const m = applicationId !== null ? porId.get(applicationId) : void 0;
		const pendiente = m !== void 0 && esPendiente(m);
		elementos.push({
			clave,
			application_id: applicationId,
			fecha,
			orden,
			pendiente,
			m,
			movible: etapa === "planeada" && !fijada && fecha >= entrada.desde && pendiente,
			posicion: m !== void 0 ? posicion$1(m) : Number.MAX_SAFE_INTEGER
		});
	};
	for (const p of entrada.planes) {
		if (p.fecha_plan === null || !ESTADOS_OCUPAN.has(p.estado)) continue;
		const clave = p.application_id ?? `plan:${p.id}`;
		if (vistos.has(clave)) continue;
		vistos.add(clave);
		agregar(clave, p.application_id, p.fecha_plan, p.estado, p.fijada, p.orden);
	}
	for (const m of entrada.muestras) {
		const f = m.avance.fecha_planeada;
		if (f === null || !ESTADOS_OCUPAN.has(m.avance.etapa) || vistos.has(m.application_id)) continue;
		vistos.add(m.application_id);
		agregar(m.application_id, m.application_id, f, m.avance.etapa, m.avance.fijada, Number.MAX_SAFE_INTEGER);
	}
	const terminoDe = (lista) => {
		let t = null;
		for (const x of lista) if (x.pendiente && (t === null || x.fecha > t)) t = x.fecha;
		return t;
	};
	const termina_antes = terminoDe(elementos);
	const elementoNuevo = {
		clave: nueva.application_id,
		application_id: nueva.application_id,
		fecha: entrada.desde,
		movible: true,
		orden: Number.MIN_SAFE_INTEGER,
		posicion: 0,
		pendiente: true,
		m: nueva
	};
	const porDia = /* @__PURE__ */ new Map();
	for (const x of elementos) {
		const lista = porDia.get(x.fecha);
		if (lista) lista.push(x);
		else porDia.set(x.fecha, [x]);
	}
	for (const lista of porDia.values()) lista.sort(compararElementos);
	const nuevaFecha = /* @__PURE__ */ new Map();
	let arrastre = [elementoNuevo];
	let d = entrada.desde;
	for (let i = 0; i < TOPE_DIAS && arrastre.length > 0 && dias.size > 0; i++, d = sumarDias(d, 1)) {
		if (!dias.has(diaSemana(d))) continue;
		const existentes = porDia.get(d) ?? [];
		const fijos = existentes.filter((x) => !x.movible);
		const movibles = existentes.filter((x) => x.movible);
		const permitido = Math.max(capacidad, existentes.length);
		const cola = [...arrastre, ...movibles];
		const libres = Math.max(0, permitido - fijos.length);
		for (const x of cola.slice(0, libres)) nuevaFecha.set(x.clave, d);
		arrastre = cola.slice(libres);
	}
	for (const x of arrastre) nuevaFecha.set(x.clave, x === elementoNuevo ? entrada.desde : x.fecha);
	const despues = [...elementos, elementoNuevo].map((x) => ({
		...x,
		fechaFinal: nuevaFecha.get(x.clave) ?? x.fecha
	}));
	const cambios = [];
	const asignaciones = [];
	const no_alcanza = [];
	const rompe_promesa = [];
	for (const x of despues) {
		if (x.application_id === null) continue;
		const esNueva = x === despues[despues.length - 1];
		const ya = esNueva ? nueva.avance.fecha_planeada !== null : true;
		const asignacion = {
			application_id: x.application_id,
			fecha: x.fechaFinal,
			ya_tenia_fecha: ya
		};
		if (x.pendiente || esNueva) asignaciones.push(asignacion);
		if (!(esNueva || x.fechaFinal !== x.fecha)) continue;
		cambios.push(asignacion);
		const m = x.m;
		if (m === void 0) continue;
		const limite = fechaLimite(m);
		if ((esNueva || m.grupo === "por_vencer") && limite !== null && x.fechaFinal > limite) no_alcanza.push({
			application_id: x.application_id,
			fecha_limite: limite
		});
		const p = promesaPara(m, entrada.promesas);
		const tope = topePromesa(p);
		if (p !== null && tope !== null && x.fechaFinal > tope) rompe_promesa.push({
			application_id: x.application_id,
			promesa: p,
			fecha: x.fechaFinal
		});
	}
	const orden = (a, b) => compararTexto(a.fecha, b.fecha) || compararTexto(a.application_id, b.application_id);
	asignaciones.sort(orden);
	cambios.sort(orden);
	const ocupadoFijo = /* @__PURE__ */ new Map();
	for (const x of despues) if (x.application_id === null || !(x.pendiente || x === despues[despues.length - 1])) sumar(ocupadoFijo, x.fechaFinal);
	const base = cerrar$1(asignaciones, ocupadoFijo, entrada.desde, no_alcanza, rompe_promesa);
	const termina = terminoDe(despues.map((x) => ({
		fecha: x.fechaFinal,
		pendiente: x.pendiente || x.clave === nueva.application_id
	})));
	return {
		...base,
		termina,
		publica_a_mas_tardar: termina === null ? null : sumarDias(termina, 2),
		cambios,
		termina_antes
	};
}
/**
* @/bloques · contexto de las hojas de etapa que monta ProveedorBloques UNA vez (01 §3.3: hojas para cambiar etapa y
* elegir fecha). useControlMuestra pide una hoja y la promesa se resuelve cuando la hoja se cierra (con o sin cambio).
*/
/** null = no hay ProveedorBloques montado (las acciones directas siguen funcionando; las hojas no se abren). */
var ContextoHojas = (0, import_react.createContext)(null);
var RESUELTA$1 = Promise.resolve();
/** Abre una hoja de etapa directamente (p. ej. «Cambiar etapa…» del menú ⋯). Sin proveedor no hace nada. */
function useAbrirHoja() {
	const hojas = (0, import_react.useContext)(ContextoHojas);
	return (0, import_react.useCallback)((p) => hojas ? hojas.abrir(p) : RESUELTA$1, [hojas]);
}
/** Hash actual separado en ruta y consulta (rutas hash de BUILD_SPEC §8.6). */
function hashActual() {
	const h = typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, "");
	const i = h.indexOf("?");
	const ruta = (i >= 0 ? h.slice(0, i) : h) || "/";
	return {
		ruta: ruta.startsWith("/") ? ruta : `/${ruta}`,
		consulta: new URLSearchParams(i >= 0 ? h.slice(i + 1) : "")
	};
}
/** Abre el diálogo de 01 §4.8 con ?mensaje=<id> o ?mensaje=t:<tienda_key> (y la plantilla preseleccionada, si viene). */
function abrirMensajeEn(destino, extra) {
	const { ruta, consulta } = hashActual();
	consulta.set("mensaje", "solicitud" in destino ? destino.solicitud : `t:${destino.tienda}`);
	if (extra?.plantilla) consulta.set("plantilla", extra.plantilla);
	else consulta.delete("plantilla");
	navegar(`${ruta}?${consulta.toString()}`);
}
/** Quita ?mensaje y ?plantilla sin agregar otra entrada al historial. */
function cerrarMensaje() {
	const { ruta, consulta } = hashActual();
	if (!consulta.has("mensaje") && !consulta.has("plantilla")) return;
	consulta.delete("mensaje");
	consulta.delete("plantilla");
	const q = consulta.toString();
	navegar(q ? `${ruta}?${q}` : ruta, { reemplazar: true });
}
var T$1 = {
	solicitada: "Solicitada",
	solicitadaSinFecha: "Solicitada: fecha por verificar",
	menuMuestra: "Más acciones de esta muestra",
	marcar: "Seleccionar esta muestra",
	confirmadoTikTok: "Confirmado por TikTok",
	tiendaAvisada: "Tienda avisada",
	atrasado: "Atrasado",
	hoy: "Hoy",
	verDetalle: "Ver detalle",
	nueva: "Cambió desde tu última visita",
	prefijoVariante: "variante",
	promesaVencidaAnuncio: "Promesa vencida: ",
	lePrometisteEl: "le prometiste el",
	sinFechaAviso: "Sin fecha: dale una antes de copiar",
	venceEl: (f) => `Vence el ${f}`,
	promesaPasoTitulo: "La fecha que le diste a la tienda ya pasó",
	lePrometisteElFecha: (f) => `Le prometiste el ${f}`,
	promesaVencidaPrefijo: "Promesa vencida · ",
	promesaVencida: "Promesa vencida",
	porVerificar: "Por verificar",
	si: "Sí",
	noVolveremosSugerir: "No volveremos a sugerirte ese video para esta muestra",
	tusVideosQueMasVenden: "Tus videos que más lo venden",
	planeadaParaEl: (f) => `Planeada para el ${f}`,
	movidaAl: (f) => `Movida al ${f}`,
	programadaParaEl: (f, h) => `Programada para el ${f}, ${h}`,
	videoDeMuestra: "Video de muestra",
	/** Chip TikTok: por vencer con menos de 48 h (01 §2.2, §5.5 paso 9) y entregada. */
	venceHoy: "Vence hoy",
	venceEnHoras: (h) => `Vence en ${h} h`,
	cumplida: "Cumplida",
	/** Título del chip «Mensaje copiado · sin confirmar»: «Copiado hace 2 h». */
	copiadoHace: (cuando) => `Copiado ${cuando}`,
	planear: "Planear",
	cambiarFecha: "Cambiar fecha",
	videoListo: "Video listo",
	marcarPublicada: "Marcar publicada",
	cambiarEtapa: "Cambiar etapa…",
	avisarTienda: "Avisar a la tienda",
	guardarImagen: "Guardar imagen del producto",
	copiarGuion: "Copiar datos para tu guion",
	/** Renglón final de los datos para tu guion: «Tus notas: …». */
	tusNotas: "Tus notas:",
	abrirAppTikTok: "Abrir en la app de TikTok",
	abrirTikTokShop: "Abrir en TikTok Shop",
	verTienda: "Ver tienda",
	agregarNota: "Agregar nota",
	fijarArriba: "Fijar arriba",
	quitarArriba: "Quitar de arriba",
	noPuedo: "No puedo hacer este video",
	vincularVideo: "Vincular un video",
	prefijoTikTok: "TikTok:",
	prefijoAvance: "Tu avance:",
	copiadoSinConfirmar: "Mensaje copiado · sin confirmar",
	enVitrina: "En tu vitrina",
	noEnVitrina: "No está en tu vitrina",
	prioridad: "Prioridad",
	faltaAvisar: "Falta avisar",
	porAvisar: "Por avisar",
	avisada: "Avisada",
	vendiendoAhora: "Vendiendo ahora",
	fueMuestra: "Fue muestra",
	sinFicha: "Sin ficha",
	precioVenta: "precio de venta",
	precioLista: "precio de lista",
	precioVariante: "precio de la variante que recibiste",
	precioVitrina: "precio en tu vitrina",
	porVenta: "por venta",
	sinPrecio: "Sin precio publicado",
	/** «Te deja $40 – $45» (corto) y «Te deja ≈ $40 – $45 por venta». */
	teDeja: (rango) => `Te deja ${rango}`,
	teDejaPorVenta: (rango) => `Te deja ≈ ${rango} por venta`,
	/** «· comisión 8 %» junto a lo que te deja. */
	comisionTasa: (tasa) => `comisión ${tasa}`,
	deshacer: "Deshacer",
	ver: "Ver",
	toastVideoListo: "Video listo",
	toastPublicada: "Marcada como publicada",
	toastPorPlanear: "Quitamos la fecha",
	toastNoSePuede: "La pasamos a «Decidiste no hacerlas»",
	toastFijada: "Fijada arriba de tu cola",
	toastDesfijada: "Ya no está fijada",
	toastAvisoRegistrado: "Aviso registrado",
	toastAvisoQuitado: "Quitamos el aviso",
	toastMensajeCopiado: "Mensaje copiado",
	toastMensajeCopiadoDetalle: "Pégalo en el chat de la tienda",
	toastAbrirTikTok: "Abrir TikTok",
	toastNoCopiado: "No pudimos copiar el mensaje. Selecciónalo y cópialo a mano.",
	toastGuionCopiado: "Datos copiados",
	toastGuionCopiadoDetalle: "Pégalos en tu herramienta para el video",
	toastGuionNoCopiado: "No pudimos copiar los datos. Inténtalo de nuevo.",
	toastImagenGuardada: "Imagen guardada",
	toastImagenCompartida: "Elige dónde guardar la imagen",
	toastImagenError: "No pudimos guardar la imagen. Inténtalo de nuevo.",
	/** C26 (BUILD_SPEC §2): gana la versión del hub. */
	conflicto: "Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.",
	enCola: "Guardado en este celular · se enviará a tu PC",
	errorGenerico: "No pudimos guardar el cambio. Inténtalo de nuevo.",
	quePlanear: "¿Qué día haces este video?",
	moverOtroDia: "Mover a otro día",
	diaDelVideo: "Día del video",
	manana: "Mañana",
	siguienteLibre: "siguiente día libre",
	noHacesVideos: "Ese día no haces videos.",
	/** «Le prometiste a {tienda} publicar a más tardar el {vie 20 nov}. Si lo mueves, avísale.» */
	avisoMover: (tienda, f) => `Le prometiste a ${tienda} publicar a más tardar el ${f}. Si lo mueves, avísale.`,
	nuevoDia: "Nuevo día",
	diaElegido: "Día elegido",
	publicariasAMasTardar: "publicarías a más tardar el",
	yaTienesDe: (n, cap) => `ya tienes ${n} de ${cap}`,
	libre: "libre",
	conTuCalendario: "con tu calendario",
	cancelar: "Cancelar",
	mover: "Mover",
	planearBoton: "Planear",
	/** «Le prometiste a {tienda} publicar a más tardar el {vie 20 nov}. Si lo mueves, avísale.» */
	moverYPreparar: "Mover y preparar mensaje",
	planearYPreparar: "Planear y preparar mensaje",
	prometistePublicar: (f) => `Le prometiste publicar a más tardar el ${f}.`,
	elegirFecha: "Elegir fecha…",
	eseDiaYaTienes: (n, cap) => `Ese día ya tienes ${n} de ${cap}`,
	venceSinDiasPosteriores: (f) => `Vence el ${f}: no te mostramos días posteriores.`,
	tienesEnlace: "¿Tienes el enlace del video?",
	pegaEnlace: "Pega el enlace del video (opcional)",
	elegirDeMisVideos: "Elegir de mis videos",
	esEsteVideo: "¿Es este video?",
	siEsEste: "Sí, es este",
	no: "No",
	enlaceInvalido: "Ese enlace no parece de un video de TikTok. Cópialo desde Compartir › Copiar enlace.",
	usarDeTodosModos: "Usar de todos modos",
	cambiarEnlace: "Cambiar enlace",
	sinConexionEnlace: "Guardamos el enlace. La miniatura aparecerá cuando vuelvas a conectarte.",
	guardar: "Guardar",
	sinEnlace: "Sin enlace por ahora",
	sinVideosProducto: "Todavía no tienes videos que vendan este producto.",
	siVincularAmbas: "Sí, vincular ambas",
	soloEsta: "Solo esta",
	laTiendaAcepto: "La tienda aceptó este video",
	toastPublicadaPrevio: "La tienda aceptó tu video: marcada como publicada",
	/** «Este video también puede contar para: {productos}. ¿Cuenta para las dos?» */
	tambienCuentaPara: (productos, cuantas) => `Este video también puede contar para: ${productos}. ¿Cuenta para ${cuantas}?`,
	lasDos: "las dos",
	lasN: (n) => `las ${n}`,
	/** «Video 7677…3012». */
	videoId: (id) => `Video ${id}`,
	vendioDesdeEl: (f) => `Vendió desde el ${f}`,
	empezoAVenderEl: (f) => `Empezó a vender el ${f}`,
	vendeEsteProductoDesde: (f) => `Vende este producto desde el ${f}`,
	marcamosPublicadas: (cuantas) => `Marcamos publicadas ${cuantas}`,
	enlaceOtraCuenta: (usuario) => `Este enlace es de otra cuenta (@${usuario}). ¿Seguro que es el tuyo?`,
	placeholderEnlaceDe: (usuario) => `https://www.tiktok.com/@${usuario}/video/…`,
	cuandoSePublica: "¿Cuándo se publica?",
	fechaYHora: "Fecha y hora",
	mismaHora: "Usa la misma hora que programaste en TikTok.",
	porQueNoPuedes: "¿Por qué no puedes hacerlo?",
	cuentanosMas: "Cuéntanos más (opcional)",
	recomendacionAvisar: "Te recomendamos avisarle a la tienda",
	soloGuardar: "Solo guardar",
	guardarYPreparar: "Guardar y preparar mensaje",
	escribeMotivo: "Escribe el motivo para guardar.",
	saleDePendientes: "Sale de Pendientes y lo puedes deshacer.",
	tituloCambiarEtapa: "Cambiar etapa",
	etapaActual: "Etapa actual",
	subtituloMensaje: "Cópialo y pégalo en el chat con la tienda en la app de TikTok.",
	mensajePara: (tienda) => `Mensaje para ${tienda}`,
	mensajeParaLaTienda: "Mensaje para la tienda",
	/** «Tienda Ejemplo tiene 3 muestras pendientes. ¿Un solo mensaje para las 3?» */
	variasPendientesTienda: (tienda, n, cuantas) => `${tienda} tiene ${n} muestras pendientes. ¿Un solo mensaje para ${cuantas}?`,
	siUnMensaje: "Sí, un mensaje",
	dondePego: "¿Dónde lo pego?",
	plantilla: "Plantilla",
	fechaPrometida: "Fecha prometida",
	faltaFecha: "Falta la fecha",
	enTresDias: "En 3 días",
	enUnaSemana: "En una semana",
	elegir: "Elegir",
	siAgendar: "Sí, agendar",
	noPorAhora: "No por ahora",
	eligeFecha: "Elige una fecha",
	agregaEnlace: "Agrega el enlace del video",
	pegarEnlace: "Pegar enlace",
	caracteres: "caracteres",
	editarTexto: "Editar texto",
	restablecer: "Volver al texto de la plantilla",
	copiarMensaje: "Copiar mensaje",
	copiarYAbrir: "Copiar y abrir TikTok",
	compartir: "Compartir…",
	yaSeLoEnviaste: "¿Ya se lo enviaste a la tienda?",
	siYaSeLoEnvie: "Sí, ya se lo envié",
	siSiguiente: "Sí, siguiente",
	todaviaNo: "Todavía no",
	yaLeEscribi: "Ya le escribí por mi cuenta",
	yaLeEscribiCorto: "Ya le escribí",
	editarPlantillas: "Editar plantillas",
	avisosEnviados: "Avisos enviados",
	quitarAviso: "Quitar este aviso",
	queLeDijiste: "¿Qué mensaje le mandaste?",
	otroMensaje: "Otro mensaje",
	registrarAviso: "Registrar aviso",
	vistaPrevia: "Vista previa del mensaje",
	textoMensaje: "Texto del mensaje",
	lePrometes: "Le prometes",
	mensajeEditado: "Editaste el texto: los datos ya no se actualizan solos.",
	necesitaPc: "Necesita tu PC encendida",
	cargandoMensaje: "Preparando el mensaje…",
	cargandoVideos: "Cargando tus videos…",
	verVistaPrevia: "Ver vista previa",
	/** Solo para lectores de pantalla, junto al nombre de la plantilla sugerida. */
	sugeridaLector: ", sugerida",
	completaLoQueFalta: "Completa lo que falta para copiar el mensaje.",
	/** «Planea {2} muestras antes de copiar». */
	planeaAntesDeCopiar: (n, una) => `Planea ${n} ${una ? "muestra" : "muestras"} antes de copiar`,
	/** «¿Lo agendamos para el {fecha}?» (la fecha va en negritas entre las dos partes). */
	loAgendamosAntes: "¿Lo agendamos para el",
	sinFecha: "Sin fecha",
	opcional: "(opcional)",
	accionesDelAviso: "Acciones del aviso del",
	placeholderEnlace: "https://www.tiktok.com/@tu_usuario/video/…",
	/** Lector de pantalla del botón de la fecha prometida: «Fecha prometida: sáb 14 nov. Cambiar». */
	fechaPrometidaCambiar: (f) => `Fecha prometida: ${f}. Cambiar`,
	/** «Lo copiaste hace 2 h». */
	loCopiaste: (cuando) => `Lo copiaste ${cuando}`,
	/** «¿Le enviaste el mensaje a {tienda}?» */
	confirmarAvisoTitulo: (tienda) => `¿Le enviaste el mensaje a ${tienda}?`,
	/** Botón ⌄ de la banda: la deja como una pastilla con el nombre de la tienda. */
	minimizarConfirmarAviso: "Minimizar",
	/** Lector de pantalla y tooltip de la pastilla minimizada. */
	verConfirmarAviso: (tienda) => `Mostrar la pregunta: ¿Le enviaste el mensaje a ${tienda}?`,
	tuRitmo: "Tu ritmo",
	queIncluimos: "¿Qué incluimos?",
	revisaTuPlan: "Revisa tu plan",
	cuantosPorDia: "¿Cuántos videos puedes hacer por día?",
	queDias: "¿Qué días haces videos?",
	desdeCuando: "¿Desde cuándo?",
	otraFecha: "Otra fecha",
	respetarFechas: "Respetar las fechas que ya tienes",
	siemprePromesas: "Siempre respetamos lo que le prometiste a cada tienda.",
	orden: "Orden",
	sugerido: "Sugerido",
	porTipo: "En lote por tipo de prenda",
	crearMiPlan: "Crear mi plan",
	saltar: "Saltar",
	siguiente: "Siguiente",
	atras: "Atrás",
	provisionalCorto: "Orden provisional: faltan tus ventas.",
	provisionalLargo: "Orden provisional: faltan tus ventas. Cuando lleguen, te propondremos reordenar sin cambiar tu fecha de término.",
	dejarlasDespues: "Dejarlas para después",
	noPuedoEstos: "No puedo hacer estos videos",
	crearYPreparar: "Crear y preparar mensajes",
	sinPendientesPlan: "No tienes muestras pendientes para planear.",
	pasoDe: (n, total) => `Paso ${n} de ${total}`,
	sinDiasVideos: "sin días de videos",
	todosLosDias: "todos los días",
	deDiaADia: (a, b) => `de ${a} a ${b}`,
	losDia: (d) => `los ${d}`,
	y: "y",
	sinVideosPlan: "Sin videos para planear",
	/** «32 videos · Terminas el mar 24 nov · publicas a más tardar el jue 26 nov». */
	resumenPlan: (videos, termina, publica) => `${videos} · Terminas el ${termina} · publicas a más tardar el ${publica}`,
	planListo: (termina) => `Plan listo: terminas el ${termina}`,
	errorPendientes: "No pudimos leer tus pendientes",
	continuar: "Continuar",
	sinPendientesPlanTexto: "Cuando llegue una muestra nueva, la acomodamos en tus días de videos.",
	empiezasEl: (f) => `Empiezas el ${f}`,
	yaPasaronLas6: " · ya pasaron las 6:00 p. m., te sugerimos mañana",
	noAlcanzas: (producto, f) => `No alcanzas a hacer ${producto} antes de que venza el ${f}. Hazlo hoy o súbele la capacidad a ese día.`,
	unaMuestra: "una muestra",
	rompePromesa: (cuantas, una) => `${cuantas} ${una ? "quedaría" : "quedarían"} después de lo que prometiste.`,
	vistaPreviaPlan: "Vista previa de tu plan",
	queHacemosQuitadas: (n) => `¿Qué hacemos con las ${n} que quitaste?`,
	porDia: "por día",
	terminasEl: "Terminas el",
	ultimoPublicado: (f) => `Último video publicado a más tardar el ${f}`,
	videosDeCapacidad: (n, cap) => `${n} de ${cap} videos`,
	noHacesVideosCorto: "no haces videos",
	videosPorDia: "Videos por día",
	notaGraficaPlan: (cap) => `Máximo ${cap} por día · los días sin barra no haces videos`,
	dia: "Día",
	videosColumna: "Videos",
	/** Casilla de un grupo de la vista previa: «Prioridad alta (9)». */
	prioridadGrupo: (nivel, n) => `Prioridad ${nivel} (${n})`,
	llevaCorte: "Lleva Corte en tu celular",
	llevaCorteTexto: "Avisa a tus tiendas desde el celular, con tu plan y tus ventas, incluso sin internet. Se actualiza cuando tu celular y esta PC están en la misma red Wi‑Fi.",
	paso1: "Instala Corte en tu Android.",
	paso2: "Ábrelo y toca Emparejar con mi PC.",
	paso3: "Escanea este código.",
	noPuedesEscanear: "¿No puedes escanear? Escribe este código en tu celular:",
	direccionPc: "Dirección de esta PC",
	cambiaCada5: "El código cambia cada 5 minutos.",
	generandoCodigo: "Generando tu código…",
	errorCodigo: "No pudimos generar el código para emparejar.",
	reintentar: "Reintentar",
	soloEnPc: "El código para emparejar se genera en Corte de tu PC.",
	qrAlt: "Código QR para emparejar tu celular con esta PC",
	celularConectado: (d) => `${d} quedó conectado.`,
	tuCelular: "Tu celular",
	conectarCelular: "¿Conectar este celular?",
	quiereConectarse: (d) => `${d} quiere conectarse a Corte.`,
	verificaNumero: "Verifica que tu celular muestre este número:",
	permitir: "Permitir",
	rechazar: "Rechazar",
	caducaEn: "Caduca en",
	numeroConfirmacion: "Número de confirmación:",
	cierreTitulo: "¿Mantener Corte en segundo plano?",
	cierreTexto: "Así tu celular puede actualizarse y seguimos sincronizando con TikTok.",
	mantener: "Mantener en segundo plano",
	cerrarCompleto: "Cerrar por completo",
	iniciarConWindows: "Abrir Corte al iniciar Windows (minimizado)",
	cierreAyuda: "Lo puedes cambiar en Ajustes › Sincronización.",
	agregarYRecorrer: "Agregar y recorrer las demás",
	elegirDia: "Elegir día",
	recorrerYPreparar: "Recorrer y preparar mensajes",
	elegirOtroDia: "Elegir otro día",
	unaTienda: "una tienda",
	estoMueve: (cuantas, tiendas) => `Esto mueve ${cuantas} después de lo que le prometiste a ${tiendas}.`,
	llegoMuestraVence: (f) => `Llegó una muestra que vence el ${f}. ¿La metemos en tu plan?`,
	ahoraTerminasEl: "Ahora terminas el",
	antesEl: (f) => ` (antes, el ${f})`,
	recorremos: (cuantas) => `Recorremos ${cuantas} al siguiente día de videos; lo que fijaste no se mueve.`,
	noHayQueMover: "No hay que mover nada más.",
	ahoraTerminasElFecha: (f) => `Ahora terminas el ${f}`,
	agregamosMuestra: "Agregamos la muestra a tu plan",
	siguesTerminandoEl: "Sigues terminando el",
	noAlcanzasHacerla: (f) => `No alcanzas a hacerla antes de que venza el ${f}. Hazla hoy o súbele la capacidad a ese día.`,
	pendientes: "Pendientes",
	agenda: "Agenda",
	todas: "Todas",
	armarMiPlan: "Armar mi plan",
	armarMiPlanUnMinuto: "Armar mi plan · 1 min",
	rehacerMiPlan: "Rehacer mi plan",
	avisarMisTiendas: "Avisar a mis tiendas",
	empezarSesion: "Empezar sesión de videos",
	sesionDeVideos: "Sesión de videos",
	masAcciones: "Más acciones",
	vistasMuestras: "Vistas de muestras",
	ventasProducto: "Ventas de este producto",
	siVincular: "Sí, vincular",
	noEsEste: "No es este",
	usarloMensaje: "Usarlo en el mensaje",
	verTodos: "Ver todos",
	primeraVenta: "primera venta",
	antesDePedir: "Lo vendías desde antes de pedir la muestra.",
	vendeDesdeElFila: (f) => `Vende desde el ${f}`,
	/** A · «Este video empezó a vender el producto el {28 sep}, {17} días después de que pediste la muestra. ¿Es el video
	*  de esta muestra?» (la fecha va en negritas entre las dos partes). */
	posibleVideoAntes: "Este video empezó a vender el producto el",
	posibleVideoDespues: (n, uno) => `, ${n} ${uno ? "día" : "días"} después de que pediste la muestra. ¿Es el video de esta muestra?`,
	/** B · «Ya tienes un video que vende este producto (desde el {13 sep}). TikTok no lo contó para esta muestra.» */
	videoPrevioAntes: "Ya tienes un video que vende este producto (desde el",
	videoPrevioDespues: "). TikTok no lo contó para esta muestra.",
	noCambiaAvance: "No cambia tu avance ni cuenta como publicado hasta que la tienda lo acepte.",
	/** C · «Ya vendes este producto en {12 videos}: {120} pedidos, {$4,500} de comisión. Si uno lo hiciste para esta
	*  muestra, vincúlalo.» */
	yaVendesEn: "Ya vendes este producto en",
	nVideos: (n, uno) => `${n} ${uno ? "video" : "videos"}`,
	yaVendesResto: (pedidos, comision) => `: ${pedidos} pedidos, ${comision} de comisión. Si uno lo hiciste para esta muestra, vincúlalo.`,
	verTiendaDe: (t) => `Ver ${t}`,
	pedidos: "pedidos",
	reembolsos: "reembolsos",
	unidades: "unidades",
	videos: "videos",
	fotoDelProducto: "Foto del producto",
	porAvisarMinusculas: "por avisar",
	avisadaMinusculas: "avisada",
	pendienteUna: "pendiente",
	pendientesMinusculas: "pendientes",
	promesaVencidaUna: "promesa vencida",
	promesasVencidas: "promesas vencidas",
	deComision: (dinero) => `${dinero} de comisión`,
	comision: "Comisión",
	participacion90: "% 90 días",
	deReembolsos: (p) => `${p} de reembolsos`,
	vendeDesdeEl: (f) => `vende desde el ${f}`,
	/** «Producto 1729…5512» cuando no hay nombre. */
	productoId: (id) => `Producto ${id}`,
	/** Lugar en el ranking, para el lector de pantalla: «Lugar 3». */
	lugar: (n) => `Lugar ${n}`,
	muestra: "muestra",
	video: "video",
	unidad: "unidad",
	producto: "producto",
	productosMinusculas: "productos",
	programada: "Programada",
	notas: "Notas",
	agregarNotaBoton: "Agregar nota",
	editarNota: "Editar",
	fijarNota: "Fijar arriba",
	desfijarNota: "Quitar de arriba",
	borrarNota: "Borrar",
	notaBorrada: "Borramos la nota",
	guardado: "Guardado",
	guardando: "Guardando…",
	sinNotas: "Todavía no hay notas.",
	notaFijada: "Fijada",
	conflictoNota: "Esta nota también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.",
	nuevaNota: "Nueva nota",
	accionesNota: "Acciones de la nota",
	listoNota: "Listo"
};
/** Lo que significa cada etapa (01 §2.4, columna «Significa»). */
var DESCRIPCION_ETAPA = {
	por_planear: "Aún sin fecha",
	planeada: "Tiene día para hacer el video",
	video_listo: "Ya está grabado o generado; falta publicarlo",
	programada: "Publicación agendada en TikTok",
	publicada: "El video ya está en TikTok",
	no_se_puede: "Decidiste no hacerla"
};
/** Títulos de las columnas de las tablas de Windows (01 §4.2, §4.7, §4.9, §4.11–4.13). */
var TITULO_COLUMNA = {
	tienda: "Tienda",
	salud: "Salud",
	pendientes: "Pendientes",
	aviso: "Aviso",
	recibidas: "Recibidas",
	entregadas: "Entregadas",
	valorRecibido: "Valor recibido (≈)",
	comisionTotal: "Comisión total",
	participacion: "% de tu comisión (90 días)",
	ultimaVenta: "Última venta",
	productos: "Productos",
	video: "Video",
	comision: "Comisión",
	pedidos: "Pedidos",
	unidades: "Unidades",
	reembolsos: "Reembolsos",
	primeraVenta: "Primera venta",
	producto: "Producto",
	videos: "Videos",
	comisionPct: "Comisión %",
	vitrina: "Vitrina",
	pedido: "Pedido",
	estado: "Estado",
	total: "Total",
	comisionEstimada: "Comisión estimada",
	comisionLiquidada: "Comisión liquidada",
	estadoTikTok: "Estado en TikTok",
	tuAvance: "Tu avance",
	promesa: "Promesa",
	porQue: "Por qué",
	solicitada: "Solicitada",
	precioVenta: "Precio de venta (≈)",
	comisionPorVenta: "Comisión por venta",
	accion: "Acción",
	variante: "Variante",
	vendio: "¿Vendió?"
};
/** Placeholder del área de notas por entidad (01 §4.3, §4.10, §4.12). */
var PLACEHOLDER_NOTA = {
	muestra: "Ideas para el video, colores, prompt, lo que pidió la tienda…",
	tienda: "Cómo prefieren los videos, con quién hablas, acuerdos…",
	video: "Qué funcionó",
	producto: "Lo que quieras recordar de este producto…",
	orden: "Lo que quieras recordar de este pedido…",
	general: "Lo que quieras recordar…"
};
/** Plantilla que corresponde a cada motivo de «No se puede» (01 §4.8, tabla de plantilla recomendada). */
var PLANTILLA_DE_MOTIVO = {
	agotado: "producto_no_disponible",
	desactivado: "producto_no_disponible",
	no_llego: "no_me_llego_completa",
	incompleta: "no_me_llego_completa",
	no_va_con_mi_contenido: "prefiero_otro_producto",
	otro: "disculpa_sin_fecha"
};
/** Nombre de las 11 plantillas por omisión (respaldo si la lista de plantillas aún no llega). */
var NOMBRE_PLANTILLA = {
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
	gracias_por_las_ventas: "Gracias por las ventas",
	otro: "Otro mensaje"
};
/** Días de la semana en texto («de lunes a sábado»), 0 = lunes. */
var NOMBRE_DIA = [
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
	"domingo"
];
/**
* @/bloques · utilidades internas (no salen del barril): clases, parámetros de consulta compartidos, nombre de producto,
* enlaces de TikTok y la plataforma efectiva (la galería puede simular Android sin cambiar de transporte).
*/
/** Une nombres de clase e ignora los vacíos. */
function cx$1(...clases) {
	let salida = "";
	for (const c of clases) {
		if (!c) continue;
		salida = salida ? `${salida} ${c}` : c;
	}
	return salida;
}
/** Variables CSS en línea (medidas que dependen de datos; nunca colores sueltos). */
function vars(valores) {
	const salida = {};
	for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === "number" ? String(v) : v;
	return salida;
}
/** Consulta de la cola de pendientes (la misma clave que usan Inicio y Muestras). */
var PARAMS_PENDIENTES$1 = {
	grupo: [
		"pausada",
		"por_vencer",
		"vencida"
	],
	orden: "prioridad"
};
/** Nombre corto del producto (01 §6.0): el del hub o el que calcula @/dominio. */
function nombreDe(p) {
	return p.titulo_corto ?? nombreCorto(p.titulo);
}
/** Enlace público de un video: https://www.tiktok.com/@{username}/video/{content_id}. */
function enlaceVideo(username, contentId) {
	return `https://www.tiktok.com/@${username && username.length > 0 ? username : "tiktok"}/video/${contentId}`;
}
/** @usuario de un enlace largo de TikTok, o null (enlace corto o id suelto). */
function usuarioDeEnlace(texto) {
	return /tiktok\.com\/@([^/?#\s]+)\/video\//i.exec(texto.trim())?.[1] ?? null;
}
/** «Solicitada 11 sep (hace 62 días)» · «Solicitada: fecha por verificar». */
function textoSolicitada(m) {
	if (m.solicitada_at === null) return T$1.solicitadaSinFecha;
	return `${T$1.solicitada} ${formato.fechaCorta(m.solicitada_at)} (${formato.haceDias(m.solicitada_at)})`;
}
/** La galería y las pruebas pueden fijar la plataforma de los bloques (sin cambiar el transporte de datos). */
var ContextoPlataformaBloques = (0, import_react.createContext)(null);
/** Plataforma efectiva de los bloques: la fijada por ContextoPlataformaBloques o la de @/app. */
function usePlataformaBloques() {
	const fijada = (0, import_react.useContext)(ContextoPlataformaBloques);
	const real = usePlataforma();
	return fijada ?? real;
}
/** true en Android (copiar y abrir TikTok, hojas inferiores, deslizar). */
function useEsAndroid() {
	return usePlataformaBloques() === "android";
}
/** Texto del enlace externo según la plataforma (01 §3.5). */
function textoAbrirFuera(android) {
	return android ? T$1.abrirAppTikTok : T$1.abrirTikTokShop;
}
/** Primera palabra con mayúscula (para encabezados que arrancan con una fecha). */
function capitalizar(t) {
	return t.length > 0 ? `${t.charAt(0).toLocaleUpperCase("es-MX")}${t.slice(1)}` : t;
}
/** Plural sencillo: (1, 'muestra') → '1 muestra' · (2, 'muestra') → '2 muestras'. */
function cuenta$1(n, singular, plural) {
	return `${formato.numero(n)} ${n === 1 ? singular : plural ?? `${singular}s`}`;
}
/**
* @/bloques · operaciones sobre el avance de una muestra (01 §2.4): crea o edita su PlanVideo con opCambioEtapa, muestra
* el Toast con Deshacer de 6 s, el texto de C26 en los conflictos (409) y el de la cola en Android sin conexión.
* También la ocupación por día (Planear, Mover, Agenda) con la capacidad de las preferencias.
*/
/** Preferencias por omisión mientras llegan las del hub (01 §4.5: 3 por día, lunes a sábado). */
var PREFERENCIAS_OMISION = {
	capacidad_videos_dia: 3,
	dias_videos: [
		0,
		1,
		2,
		3,
		4,
		5
	],
	programo_mis_videos: false,
	firma: "",
	orden_plan: "sugerido"
};
function usePreferencias() {
	const d = useConsulta("preferencias", {}).datos;
	return (0, import_react.useMemo)(() => ({
		capacidad_videos_dia: d?.capacidad_videos_dia ?? PREFERENCIAS_OMISION.capacidad_videos_dia,
		dias_videos: d?.dias_videos ?? PREFERENCIAS_OMISION.dias_videos,
		programo_mis_videos: d?.programo_mis_videos ?? PREFERENCIAS_OMISION.programo_mis_videos,
		firma: d?.firma ?? PREFERENCIAS_OMISION.firma,
		orden_plan: d?.orden_plan ?? PREFERENCIAS_OMISION.orden_plan,
		rev: d?.rev ?? null
	}), [d]);
}
/** @usuario de la cuenta (para el placeholder del enlace y {link_video}). */
function useUsername() {
	return useSesion().datos?.cuenta?.username ?? null;
}
var OCUPAN = /* @__PURE__ */ new Set([
	"planeada",
	"video_listo",
	"programada"
]);
/** Ocupación por día desde el plan vivo (GET /api/plan) y la capacidad de las preferencias. */
function useOcupacion() {
	const plan = useConsulta("plan", {});
	const prefs = usePreferencias();
	const items = plan.datos?.items;
	return (0, import_react.useMemo)(() => {
		const porMuestra = /* @__PURE__ */ new Map();
		const sueltos = [];
		for (const p of items ?? []) {
			if (p.fecha_plan === null || !OCUPAN.has(p.estado)) continue;
			if (p.application_id === null) sueltos.push(p.fecha_plan);
			else porMuestra.set(p.application_id, p.fecha_plan);
		}
		const usados = (fecha, excluir) => {
			let n = 0;
			for (const [id, f] of porMuestra) if (f === fecha && id !== excluir) n += 1;
			for (const f of sueltos) if (f === fecha) n += 1;
			return n;
		};
		const porDia = {};
		for (const f of porMuestra.values()) porDia[f] = (porDia[f] ?? 0) + 1;
		for (const f of sueltos) porDia[f] = (porDia[f] ?? 0) + 1;
		const capacidad = Math.max(1, prefs.capacidad_videos_dia);
		const dias = prefs.dias_videos;
		return {
			porDia,
			capacidad,
			dias,
			usados,
			mapa(desde, n, excluir) {
				const salida = {};
				for (let i = 0; i < n; i++) {
					const f = sumarDias(desde, i);
					if (!dias.includes(diaSemana(f))) continue;
					salida[f] = {
						usados: usados(f, excluir),
						capacidad
					};
				}
				return salida;
			},
			siguienteLibre(desde, excluir, hasta) {
				for (let i = 0; i < 400; i++) {
					const f = sumarDias(desde, i);
					if (hasta && f > hasta) return null;
					if (!dias.includes(diaSemana(f))) continue;
					if (usados(f, excluir) < capacidad) return f;
				}
				return null;
			}
		};
	}, [
		items,
		prefs.capacidad_videos_dia,
		prefs.dias_videos
	]);
}
/** Texto del Toast de cada etapa (02 §7.14: «Video listo · Deshacer»). */
function textoToastEtapa(etapa, datos) {
	switch (etapa) {
		case "planeada": return datos.fecha_plan ? T$1.planeadaParaEl(formato.fechaConDia(datos.fecha_plan)) : ETIQUETA_ETAPA.planeada;
		case "video_listo": return T$1.toastVideoListo;
		case "programada": return datos.programada_para_at !== void 0 ? T$1.programadaParaEl(formato.fechaConDia(datos.programada_para_at), formato.hora(datos.programada_para_at)) : T$1.programada;
		case "publicada": return T$1.toastPublicada;
		case "no_se_puede": return T$1.toastNoSePuede;
		case "por_planear": return T$1.toastPorPlanear;
	}
}
/** De OperacionPlan (@/dominio) a la OpLocal sin op_id que recibe acciones.lote. */
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
function useOperaciones() {
	const acciones = useAcciones();
	const toast = useToast();
	const avisarResultado = (0, import_react.useCallback)((r, texto, opciones) => {
		if (r.estado === "conflicto") {
			const id = opciones?.solicitud;
			toast.mostrar({
				texto: T$1.conflicto,
				tono: "info",
				...id ? { accion: {
					etiqueta: T$1.ver,
					alPulsar: () => navegar(`/muestras/m/${encodeURIComponent(id)}`)
				} } : {}
			});
			return;
		}
		if (r.estado === "error") {
			toast.mostrar({
				texto: r.error?.mensaje ?? T$1.errorGenerico,
				tono: "error"
			});
			return;
		}
		if (opciones?.silencioso) return;
		const detalle = r.estado === "en_cola" ? T$1.enCola : opciones?.detalle;
		toast.mostrar({
			texto,
			tono: "ok",
			...detalle ? { detalle } : {},
			accion: {
				etiqueta: T$1.deshacer,
				alPulsar: () => void r.deshacer()
			},
			duracion_ms: 6e3
		});
	}, [toast]);
	const aplicarEtapa = (0, import_react.useCallback)(async (m, etapa, datos, opciones) => {
		const error = validarEtapa(etapa, datos);
		if (error) {
			toast.mostrar({
				texto: error,
				tono: "error"
			});
			return null;
		}
		const op = opCambioEtapa(m, etapa, datos, hoyLocal());
		const r = op.tipo === "plan.crear" ? await acciones.crearPlan(op.datos) : await acciones.editarPlan(op.id, op.cambios);
		avisarResultado(r, opciones?.texto ?? textoToastEtapa(etapa, datos), {
			solicitud: m.application_id,
			...opciones
		});
		return r;
	}, [
		acciones,
		avisarResultado,
		toast
	]);
	const aplicarFijada = (0, import_react.useCallback)(async (m, fijada) => {
		const a = m.avance;
		const r = a.plan_id ? await acciones.editarPlan(a.plan_id, {
			fijada,
			rev: a.rev
		}) : await acciones.crearPlan({
			id: nuevoId(),
			titulo: Array.from(nombreDe(m.producto) || T$1.videoDeMuestra).slice(0, 200).join(""),
			application_id: m.application_id,
			product_id: m.producto.product_id,
			tienda_key: m.tienda.tienda_key,
			estado: a.etapa,
			fijada
		});
		avisarResultado(r, fijada ? T$1.toastFijada : T$1.toastDesfijada, { solicitud: m.application_id });
		return r;
	}, [acciones, avisarResultado]);
	const aplicarLote = (0, import_react.useCallback)(async (ops, texto, opciones) => {
		if (ops.length === 0) return null;
		const r = await acciones.lote(ops.map(aOpLocal));
		const primerError = r.resultados.find((x) => x.estado === "invalida" || x.estado === "conflicto");
		avisarResultado({
			estado: r.estado,
			error: r.estado === "error" ? { mensaje: primerError?.error ?? T$1.errorGenerico } : null,
			deshacer: r.deshacer
		}, texto, opciones);
		return r;
	}, [acciones, avisarResultado]);
	return (0, import_react.useMemo)(() => ({
		aplicarFijada,
		aplicarEtapa,
		aplicarLote,
		avisarResultado
	}), [
		aplicarFijada,
		aplicarEtapa,
		aplicarLote,
		avisarResultado
	]);
}
var comun_module_default = {
	recorte1: "_recorte1_1x3ae_2",
	recorte2: "_recorte2_1x3ae_8",
	lector: "_lector_1x3ae_17",
	overline: "_overline_1x3ae_29",
	caption: "_caption_1x3ae_38",
	mono: "_mono_1x3ae_45",
	desplaza: "_desplaza_1x3ae_51",
	enlace: "_enlace_1x3ae_65",
	enlaceSuave: "_enlaceSuave_1x3ae_90 _enlace_1x3ae_65",
	aviso: "_aviso_1x3ae_96",
	avisoInfo: "_avisoInfo_1x3ae_113 _aviso_1x3ae_96",
	avisoCritico: "_avisoCritico_1x3ae_121 _aviso_1x3ae_96",
	botones: "_botones_1x3ae_129",
	pie: "_pie_1x3ae_134",
	pieEntre: "_pieEntre_1x3ae_141 _pie_1x3ae_134"
};
var hojas_module_default = {
	cuerpo: "_cuerpo_1pdbq_2",
	desvanecido: "_desvanecido_1pdbq_12",
	muestra: "_muestra_1pdbq_22",
	muestraTextos: "_muestraTextos_1pdbq_31",
	muestraNombre: "_muestraNombre_1pdbq_38 _recorte2_1x3ae_8",
	muestraMeta: "_muestraMeta_1pdbq_45 _recorte1_1x3ae_2",
	ayuda: "_ayuda_1pdbq_51",
	ayudaFuerte: "_ayudaFuerte_1pdbq_57 _ayuda_1pdbq_51",
	pregunta: "_pregunta_1pdbq_62",
	pie: "_pie_1pdbq_70",
	lista: "_lista_1pdbq_81",
	opcion: "_opcion_1pdbq_89",
	opcionTexto: "_opcionTexto_1pdbq_118",
	opcionTitulo: "_opcionTitulo_1pdbq_124 _recorte1_1x3ae_2",
	opcionMeta: "_opcionMeta_1pdbq_131 _recorte2_1x3ae_8",
	opcionIcono: "_opcionIcono_1pdbq_137",
	opcionMarca: "_opcionMarca_1pdbq_146",
	opcionFlecha: "_opcionFlecha_1pdbq_149",
	portada: "_portada_1pdbq_155",
	confirmar: "_confirmar_1pdbq_161",
	confirmarTextos: "_confirmarTextos_1pdbq_171",
	idVideo: "_idVideo_1pdbq_177 _mono_1x3ae_45",
	separador: "_separador_1pdbq_181"
};
function MuestraEnHoja(p) {
	const { m } = p;
	const nombre = nombreDe(m.producto);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: hojas_module_default.muestra,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: m.producto.imagen,
			alt: nombre,
			anchoCss: 48,
			proporcion: "1:1",
			radio: "sm",
			tienda: m.tienda.nombre,
			categoria: m.producto.categoria
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.muestraTextos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: hojas_module_default.muestraNombre,
				children: nombre
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: hojas_module_default.muestraMeta,
				children: [m.tienda.nombre, m.variante ? ` · ${m.variante}` : ""]
			})]
		})]
	});
}
var HojaPlanear_module_default = {
	atajos: "_atajos_1on38_2",
	atajo: "_atajo_1on38_2",
	atajoTitulo: "_atajoTitulo_1on38_40",
	atajoMeta: "_atajoMeta_1on38_48",
	lleno: "_lleno_1on38_54",
	actual: "_actual_1on38_57",
	otra: "_otra_1on38_60",
	ayudas: "_ayudas_1on38_63"
};
/**
* Hoja «¿Qué día haces este video?» / «Mover a otro día» (01 §4.3 Planear, §4.4, §5.5 paso 6). Chips que planean con
* un toque —«Hoy», «Mañana», «{lun 16 nov} (siguiente día libre)»— con la ocupación «Ese día ya tienes 2 de 3», y
* «Elegir fecha…» con el calendario. Nunca ofrece días después del vencimiento y protege las promesas: «Le prometiste a
* {tienda} publicar a más tardar el {vie 20 nov}. Si lo mueves, avísale.» [Mover y preparar mensaje] [Cancelar].
*/
function textoPromesaRota(tienda, promesa) {
	return T$1.avisoMover(tienda, formato.fechaConDia(promesa));
}
function HojaPlanear(p) {
	const { m } = p;
	const ocupacion = useOcupacion();
	const ops = useOperaciones();
	const hoy = hoyLocal();
	const limite = m.fecha_limite_at !== null ? fechaLocalDe(m.fecha_limite_at) : null;
	const promesa = m.avisos.promesa;
	const actual = m.avance.fecha_planeada;
	const libre = ocupacion.siguienteLibre(hoy, m.application_id, limite);
	const [confirmar, setConfirmar] = (0, import_react.useState)(p.fechaElegida ?? null);
	const [calendario, setCalendario] = (0, import_react.useState)(false);
	const [fecha, setFecha] = (0, import_react.useState)(actual);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const atajos = (0, import_react.useMemo)(() => {
		const lista = [{
			etiqueta: T$1.hoy,
			fecha: hoy
		}, {
			etiqueta: T$1.manana,
			fecha: sumarDias(hoy, 1)
		}];
		if (libre && libre !== hoy && libre !== sumarDias(hoy, 1)) lista.push({
			etiqueta: `${formato.fechaConDia(libre)} (${T$1.siguienteLibre})`,
			fecha: libre
		});
		return lista;
	}, [hoy, libre]);
	const mapa = (0, import_react.useMemo)(() => ocupacion.mapa(hoy, 70, m.application_id), [
		ocupacion,
		hoy,
		m.application_id
	]);
	const guardar = async (dia, prepararMensaje) => {
		setGuardando(true);
		const etapa = m.avance.etapa;
		const conservar = p.modo === "mover" && (etapa === "video_listo" || etapa === "programada");
		const r = await ops.aplicarEtapa(m, conservar ? etapa : "planeada", { fecha_plan: dia }, { texto: p.modo === "mover" ? T$1.movidaAl(formato.fechaConDia(dia)) : T$1.planeadaParaEl(formato.fechaConDia(dia)) });
		setGuardando(false);
		p.alTerminar();
		if (prepararMensaje && r && (r.estado === "aplicada" || r.estado === "en_cola")) abrirMensajeEn({ solicitud: m.application_id }, { plantilla: "nueva_fecha" });
	};
	/** Un toque: planea, o pide confirmación si rompe la promesa (01 §4.4). */
	const elegir = (dia) => {
		if (promesaEnRiesgo(dia, promesa)) setConfirmar(dia);
		else guardar(dia, false);
	};
	const titulo = p.modo === "mover" ? T$1.moverOtroDia : T$1.quePlanear;
	if (confirmar && promesa) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo,
		alCerrar: p.alTerminar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.pie,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				alPulsar: p.alTerminar,
				children: T$1.cancelar
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				icono: "MessageCircle",
				cargando: guardando,
				alPulsar: () => void guardar(confirmar, true),
				children: p.modo === "mover" ? T$1.moverYPreparar : T$1.planearYPreparar
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.aviso,
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarClock",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: textoPromesaRota(m.tienda.nombre, promesa) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: hojas_module_default.ayuda,
					children: [
						p.modo === "mover" ? T$1.nuevoDia : T$1.diaElegido,
						": ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaConDia(confirmar) }),
						" · ",
						T$1.publicariasAMasTardar,
						" ",
						formato.fechaConDia(sumarDias(confirmar, 2)),
						"."
					]
				})
			]
		})
	});
	const usados = fecha ? ocupacion.usados(fecha, m.application_id) : 0;
	const noEsDia = fecha !== null && !ocupacion.dias.includes(diaSemana(fecha));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo,
		alCerrar: p.alTerminar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.pie,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				alPulsar: p.alTerminar,
				children: T$1.cancelar
			}), calendario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				deshabilitado: fecha === null || fecha === actual,
				cargando: guardando,
				alPulsar: () => fecha && elegir(fecha),
				children: p.modo === "mover" ? T$1.mover : T$1.planearBoton
			}) : null]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }),
				promesa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.avisoInfo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarClock",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.prometistePublicar(formato.fechaConDia(promesa)) })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: HojaPlanear_module_default.atajos,
					role: "group",
					"aria-label": T$1.diaDelVideo,
					children: [atajos.map((a) => {
						const n = ocupacion.usados(a.fecha, m.application_id);
						const fueraDeDias = !ocupacion.dias.includes(diaSemana(a.fecha));
						const vencida = limite !== null && a.fecha > limite;
						const lleno = n >= ocupacion.capacidad;
						const detalle = fueraDeDias ? T$1.noHacesVideosCorto : n > 0 ? T$1.yaTienesDe(formato.numero(n), formato.numero(ocupacion.capacidad)) : T$1.libre;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cx$1(HojaPlanear_module_default.atajo, lleno && HojaPlanear_module_default.lleno, a.fecha === actual && HojaPlanear_module_default.actual),
							disabled: vencida || a.fecha === actual || guardando,
							onClick: () => elegir(a.fecha),
							"aria-label": `${a.etiqueta}: ${formato.fechaConDia(a.fecha)}, ${detalle}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: HojaPlanear_module_default.atajoTitulo,
								children: a.etiqueta
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: HojaPlanear_module_default.atajoMeta,
								children: [a.etiqueta === T$1.hoy || a.etiqueta === T$1.manana ? `${formato.fechaConDia(a.fecha)} · ` : "", detalle]
							})]
						}, a.etiqueta);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: cx$1(HojaPlanear_module_default.atajo, HojaPlanear_module_default.otra),
						"aria-expanded": calendario,
						onClick: () => setCalendario((v) => !v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: HojaPlanear_module_default.atajoTitulo,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "CalendarDays",
									tamano: 16
								}),
								" ",
								T$1.elegirFecha
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: HojaPlanear_module_default.atajoMeta,
							children: T$1.conTuCalendario
						})]
					})]
				}),
				calendario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
					etiqueta: T$1.diaDelVideo,
					valor: fecha,
					alCambiar: setFecha,
					min: hoy,
					...limite ? { max: limite } : {},
					ocupacion: mapa
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"aria-live": "polite",
					className: HojaPlanear_module_default.ayudas,
					children: [
						calendario && fecha && usados > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx$1(hojas_module_default.ayuda, usados >= ocupacion.capacidad && hojas_module_default.ayudaFuerte),
							children: T$1.eseDiaYaTienes(formato.numero(usados), formato.numero(ocupacion.capacidad))
						}) : null,
						calendario && noEsDia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: hojas_module_default.ayuda,
							children: T$1.noHacesVideos
						}) : null,
						limite ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: hojas_module_default.ayuda,
							children: T$1.venceSinDiasPosteriores(formato.fechaConDia(limite))
						}) : null
					]
				})
			]
		})
	});
}
/**
* Hoja «¿Tienes el enlace del video?» (Marcar publicada) y «Vincular un video» (01 §4.3 Publicar, §2.4 regla 3–4):
* pegar el enlace (con los errores exactos de 01), [Elegir de mis videos] (los que venden este producto, el más reciente
* primero), aceptar un «Posible video» o «La tienda aceptó este video», y paquetes: «Este video también puede contar
* para: …. ¿Cuenta para las dos?» [Sí, vincular ambas] [Solo esta] (un solo Deshacer).
*/
function VideoOpcion(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: hojas_module_default.opcion,
		"aria-pressed": p.elegido,
		onClick: p.alElegir,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: p.v.miniatura,
				alt: `${T$1.fotoDelProducto}: ${p.nombre}`,
				anchoCss: 40,
				proporcion: "1:1",
				radio: "sm",
				tienda: p.tienda,
				className: cx$1(hojas_module_default.portada)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: hojas_module_default.opcionTexto,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: hojas_module_default.opcionTitulo,
					children: T$1.videoId(formato.idCorto(p.v.content_id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: hojas_module_default.opcionMeta,
					children: [
						T$1.vendioDesdeEl(formato.fechaCorta(p.v.primera_venta)),
						" · ",
						T$1.deComision(formato.dinero(p.v.comision_estimada_centavos))
					]
				})]
			}),
			p.elegido ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Check",
				tamano: 18,
				className: cx$1(hojas_module_default.opcionMarca)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
		]
	}) });
}
function HojaPublicar(p) {
	const { m } = p;
	const ops = useOperaciones();
	const username = useUsername();
	const detalle = useConsulta("muestra", { id: m.application_id });
	const deTienda = useConsulta("muestras", { tienda: m.tienda.tienda_key });
	const videos = (0, import_react.useMemo)(() => detalle.datos?.videos_del_producto ?? [], [detalle.datos]);
	const nombre = nombreDe(m.producto);
	const [enlace, setEnlace] = (0, import_react.useState)("");
	const [elegido, setElegido] = (0, import_react.useState)(p.sugerido ?? null);
	const [otraCuentaOk, setOtraCuentaOk] = (0, import_react.useState)(false);
	const [paso, setPaso] = (0, import_react.useState)("enlace");
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const previo = m.tarjeta_video === "video_previo";
	const sugerido = p.sugerido ? videos.find((v) => v.content_id === p.sugerido) ?? null : null;
	const textoEnlace = enlace.trim();
	const enlaceMalo = textoEnlace !== "" && !esEnlaceTikTok(textoEnlace);
	const usuario = textoEnlace !== "" && !enlaceMalo ? usuarioDeEnlace(textoEnlace) : null;
	const otraCuenta = usuario !== null && username !== null && usuario.toLocaleLowerCase("es-MX") !== username.toLocaleLowerCase("es-MX") && !otraCuentaOk;
	const idPegado = textoEnlace !== "" && !enlaceMalo ? contentIdDeEnlace(textoEnlace) : null;
	const videoPegado = idPegado ? videos.find((v) => v.content_id === idPegado) ?? null : null;
	/** Otras pendientes de la misma tienda que el mismo video puede cumplir (paquete o mismo producto, 01 §4.3). */
	const paquete = (0, import_react.useMemo)(() => {
		return (deTienda.datos?.items ?? []).filter((x) => x.application_id !== m.application_id && x.tienda.tienda_key === m.tienda.tienda_key && esPendiente(x) && (x.producto.product_id === m.producto.product_id || m.razones.includes("paquete") && x.razones.includes("paquete")));
	}, [
		deTienda.datos,
		m.application_id,
		m.producto.product_id,
		m.razones
	]);
	const datos = () => {
		if (textoEnlace !== "") return {
			enlace_video: textoEnlace,
			vinculo_origen: "manual"
		};
		if (elegido) {
			const v = videos.find((x) => x.content_id === elegido);
			let origen = "manual";
			if (p.sugerido && elegido === p.sugerido) origen = previo ? "video_previo_aceptado" : m.tarjeta_video === "posible_video" ? "sugerido_por_ventas" : "manual";
			return {
				content_id: elegido,
				enlace_video: v?.enlace ?? null,
				vinculo_origen: origen
			};
		}
		return {};
	};
	const hayVideo = textoEnlace !== "" || elegido !== null;
	const guardar = async (conPaquete) => {
		setGuardando(true);
		const d = datos();
		if (conPaquete && paquete.length > 0) {
			const hoy = hoyLocal();
			const lista = [m, ...paquete].map((x) => opCambioEtapa(x, "publicada", d, hoy));
			await ops.aplicarLote(lista, T$1.marcamosPublicadas(cuenta$1(lista.length, T$1.muestra)), { solicitud: m.application_id });
		} else await ops.aplicarEtapa(m, "publicada", d, { texto: previo && d.vinculo_origen === "video_previo_aceptado" ? T$1.toastPublicadaPrevio : T$1.toastPublicada });
		setGuardando(false);
		p.alTerminar();
	};
	const continuar = () => {
		if (hayVideo && paquete.length > 0) setPaso("paquete");
		else guardar(false);
	};
	const titulo = p.sugerido && previo ? T$1.laTiendaAcepto : p.origen === "vincular" ? T$1.vincularVideo : T$1.tienesEnlace;
	if (paso === "paquete") {
		const otra = paquete[0];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
			abierta: p.abierta,
			titulo,
			alCerrar: p.alTerminar,
			pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: hojas_module_default.pie,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					cargando: guardando,
					alPulsar: () => void guardar(false),
					children: T$1.soloEsta
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					cargando: guardando,
					alPulsar: () => void guardar(true),
					children: T$1.siVincularAmbas
				})]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: hojas_module_default.cuerpo,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: hojas_module_default.pregunta,
						children: T$1.tambienCuentaPara(paquete.map((x) => nombreDe(x.producto)).join(", "), paquete.length === 1 ? T$1.lasDos : T$1.lasN(formato.numero(paquete.length + 1)))
					}),
					otra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m: otra }) : null
				]
			})
		});
	}
	const pieEnlace = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: hojas_module_default.pie,
		children: [p.origen === "etapa" && !p.sugerido ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "secundario",
			cargando: guardando,
			alPulsar: () => void guardar(false),
			deshabilitado: hayVideo,
			children: T$1.sinEnlace
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: p.alTerminar,
			children: T$1.cancelar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			cargando: guardando,
			deshabilitado: !hayVideo || enlaceMalo || otraCuenta,
			alPulsar: continuar,
			children: p.sugerido ? T$1.siEsEste : T$1.guardar
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo,
		alCerrar: p.alTerminar,
		pie: pieEnlace,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }), p.sugerido ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: hojas_module_default.confirmar,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: sugerido?.miniatura ?? m.producto.imagen,
					alt: `${T$1.fotoDelProducto}: ${nombre}`,
					anchoCss: 64,
					proporcion: "1:1",
					radio: "sm",
					tienda: m.tienda.nombre
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: hojas_module_default.confirmarTextos,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hojas_module_default.pregunta,
							children: T$1.esEsteVideo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hojas_module_default.idVideo,
							children: T$1.videoId(formato.idCorto(p.sugerido))
						}),
						sugerido ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: hojas_module_default.ayuda,
							children: [
								T$1.empezoAVenderEl(formato.fechaCorta(sugerido.primera_venta)),
								" · ",
								T$1.deComision(formato.dinero(sugerido.comision_estimada_centavos))
							]
						}) : null
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T$1.pegaEnlace,
					valor: enlace,
					alCambiar: (v) => {
						setEnlace(v);
						setOtraCuentaOk(false);
						if (v.trim() !== "") setElegido(null);
					},
					tipo: "url",
					placeholder: username !== null && username !== void 0 ? T$1.placeholderEnlaceDe(username) : T$1.placeholderEnlace,
					error: enlaceMalo ? T$1.enlaceInvalido : null,
					autoFoco: true
				}),
				otraCuenta && usuario ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.aviso,
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CircleAlert",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: hojas_module_default.cuerpo,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.enlaceOtraCuenta(usuario) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: comun_module_default.botones,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								tamano: "sm",
								variante: "secundario",
								alPulsar: () => setOtraCuentaOk(true),
								children: T$1.usarDeTodosModos
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								tamano: "sm",
								variante: "fantasma",
								alPulsar: () => setEnlace(""),
								children: T$1.cambiarEnlace
							})]
						})]
					})]
				}) : null,
				idPegado && !otraCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: hojas_module_default.confirmar,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: videoPegado?.miniatura ?? m.producto.imagen,
						alt: `${T$1.fotoDelProducto}: ${nombre}`,
						anchoCss: 64,
						proporcion: "1:1",
						radio: "sm",
						tienda: m.tienda.nombre
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: hojas_module_default.confirmarTextos,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hojas_module_default.pregunta,
								children: T$1.esEsteVideo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hojas_module_default.idVideo,
								children: T$1.videoId(formato.idCorto(idPegado))
							}),
							videoPegado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hojas_module_default.ayuda,
								children: T$1.vendeEsteProductoDesde(formato.fechaCorta(videoPegado.primera_venta))
							}) : null
						]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: hojas_module_default.separador }),
				paso === "lista" || videos.length <= 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": T$1.elegirDeMisVideos,
					className: hojas_module_default.cuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: comun_module_default.overline,
						children: T$1.elegirDeMisVideos
					}), videos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: hojas_module_default.ayuda,
						children: detalle.cargando ? T$1.cargandoVideos : T$1.sinVideosProducto
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: hojas_module_default.lista,
						children: videos.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOpcion, {
							v,
							nombre,
							tienda: m.tienda.nombre,
							elegido: elegido === v.content_id && textoEnlace === "",
							alElegir: () => {
								setEnlace("");
								setElegido((x) => x === v.content_id ? null : v.content_id);
							}
						}, v.content_id))
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Boton, {
					variante: "secundario",
					icono: "SquarePlay",
					alPulsar: () => setPaso("lista"),
					children: [
						T$1.elegirDeMisVideos,
						" (",
						formato.numero(videos.length),
						")"
					]
				})
			] })]
		})
	});
}
/**
* Hojas cortas de etapa (01 §2.4 «Datos que pide», §4.3 «Tu avance»):
*   HojaProgramar · «¿Cuándo se publica?» fecha y hora obligatorias · «Usa la misma hora que programaste en TikTok.»
*   HojaNoSePuede · «¿Por qué no puedes hacerlo?» motivo obligatorio + texto opcional + «Te recomendamos avisarle a la
*                   tienda» con la plantilla del motivo [Solo guardar] [Guardar y preparar mensaje]
*   HojaEtapa     · «Cambiar etapa» (menú ⋯ «Cambiar etapa…»): se puede avanzar saltando etapas y retroceder.
*/
function HojaProgramar(p) {
	const ops = useOperaciones();
	const { m } = p;
	const inicial = m.avance.programada_para_at ?? (m.avance.fecha_planeada ? epochDeFecha(m.avance.fecha_planeada, 18, 0) : epochDeFecha(sumarDias(hoyLocal(), 1), 18, 0));
	const [cuando, setCuando] = (0, import_react.useState)(inicial);
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const guardar = async () => {
		if (cuando === null) return;
		setGuardando(true);
		await ops.aplicarEtapa(m, "programada", { programada_para_at: cuando });
		setGuardando(false);
		p.alTerminar();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo: T$1.cuandoSePublica,
		alCerrar: p.alTerminar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.pie,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				alPulsar: p.alTerminar,
				children: T$1.cancelar
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				icono: "CalendarClock",
				deshabilitado: cuando === null,
				cargando: guardando,
				alPulsar: () => void guardar(),
				children: ETIQUETA_ACCION.marcar_programada
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFechaHora, {
					etiqueta: T$1.fechaYHora,
					valor: cuando,
					alCambiar: setCuando,
					min: ahoraS() - 3600
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: hojas_module_default.ayuda,
					children: T$1.mismaHora
				})
			]
		})
	});
}
var MOTIVOS = [
	"agotado",
	"desactivado",
	"no_llego",
	"incompleta",
	"no_va_con_mi_contenido",
	"otro"
];
/** Motivo precargado: si TikTok ya dice que no se puede etiquetar, «Producto desactivado» (01 §5.1 variante C). */
function motivoSugerido(m) {
	return m.prioridad === "no_se_puede_etiquetar" ? "desactivado" : null;
}
function HojaNoSePuede(p) {
	const ops = useOperaciones();
	const { m } = p;
	const [motivo, setMotivo] = (0, import_react.useState)(motivoSugerido(m));
	const [texto, setTexto] = (0, import_react.useState)("");
	const [guardando, setGuardando] = (0, import_react.useState)(false);
	const faltaTexto = motivo === "otro" && texto.trim() === "";
	const guardar = async (preparar) => {
		if (motivo === null || faltaTexto) return;
		setGuardando(true);
		const r = await ops.aplicarEtapa(m, "no_se_puede", {
			motivo_no_se_puede: motivo,
			motivo_texto: texto.trim() || null
		});
		setGuardando(false);
		p.alTerminar();
		if (preparar && r && (r.estado === "aplicada" || r.estado === "en_cola")) abrirMensajeEn({ solicitud: m.application_id }, { plantilla: PLANTILLA_DE_MOTIVO[motivo] });
	};
	const plantilla = motivo ? PLANTILLA_DE_MOTIVO[motivo] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo: T$1.noPuedo,
		alCerrar: p.alTerminar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.pie,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				deshabilitado: motivo === null || faltaTexto,
				cargando: guardando,
				alPulsar: () => void guardar(false),
				children: T$1.soloGuardar
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				icono: "MessageCircle",
				deshabilitado: motivo === null || faltaTexto,
				cargando: guardando,
				alPulsar: () => void guardar(true),
				children: T$1.guardarYPreparar
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpcionRadio, {
					etiqueta: T$1.porQueNoPuedes,
					opciones: MOTIVOS.map((x) => ({
						valor: x,
						etiqueta: ETIQUETA_MOTIVO_NO_SE_PUEDE[x]
					})),
					valor: motivo,
					alCambiar: setMotivo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTexto, {
					etiqueta: T$1.cuentanosMas,
					valor: texto,
					alCambiar: setTexto,
					filas: 2,
					maximo: 500,
					...faltaTexto ? { ayuda: T$1.escribeMotivo } : {}
				}),
				plantilla ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.avisoInfo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "MessageCircle",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						T$1.recomendacionAvisar,
						": ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: NOMBRE_PLANTILLA[plantilla] ?? plantilla }),
						". ",
						T$1.saleDePendientes
					] })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: hojas_module_default.desvanecido,
					"aria-hidden": "true"
				})
			]
		})
	});
}
function HojaEtapa(p) {
	const prefs = usePreferencias();
	const { m } = p;
	const actual = m.avance.etapa;
	const etapas = [
		"por_planear",
		"planeada",
		"video_listo",
		...prefs.programo_mis_videos || actual === "programada" ? ["programada"] : [],
		"publicada",
		"no_se_puede"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: p.abierta,
		titulo: T$1.tituloCambiarEtapa,
		alCerrar: p.alTerminar,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: hojas_module_default.cuerpo,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuestraEnHoja, { m }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: hojas_module_default.lista,
				"aria-label": T$1.tituloCambiarEtapa,
				children: etapas.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cx$1(hojas_module_default.opcion),
					"aria-current": e === actual ? "true" : void 0,
					disabled: e === actual,
					onClick: () => p.alElegir(e),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: hojas_module_default.opcionIcono,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: ICONO_ETAPA[e],
								tamano: 18
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: hojas_module_default.opcionTexto,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hojas_module_default.opcionTitulo,
								children: ETIQUETA_ETAPA[e]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hojas_module_default.opcionMeta,
								children: e === actual ? T$1.etapaActual : DESCRIPCION_ETAPA[e]
							})]
						}),
						e === actual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 18,
							className: cx$1(hojas_module_default.opcionMarca)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "ChevronRight",
							tamano: 18,
							className: cx$1(hojas_module_default.opcionFlecha)
						})
					]
				}) }, e))
			})]
		})
	});
}
/**
* useControlMuestra (spec/ui_firmas/bloques.d.ts): las acciones de una muestra que comparten tarjetas, detalle,
* Agenda y Sesión. Las que piden datos abren la hoja que monta ProveedorBloques (01 §2.4 «Datos que pide»); las demás
* se aplican directo con Toast y Deshacer de 6 s. Respeta promesas (01 §2.5, §4.4) y muestra C26 en los conflictos.
*/
var RESUELTA = Promise.resolve();
function useControlMuestra() {
	const hojas = (0, import_react.useContext)(ContextoHojas);
	const ops = useOperaciones();
	const prefs = usePreferencias();
	return (0, import_react.useMemo)(() => {
		const abrir = (p) => hojas ? hojas.abrir(p) : RESUELTA;
		const planear = async (m, fecha) => {
			if (fecha === void 0) return abrir({
				tipo: "planear",
				m,
				modo: "planear"
			});
			if (promesaEnRiesgo(fecha, m.avisos.promesa)) return abrir({
				tipo: "promesa",
				m,
				fecha,
				modo: m.avance.fecha_planeada ? "mover" : "planear"
			});
			await ops.aplicarEtapa(m, "planeada", { fecha_plan: fecha });
		};
		const cambiarEtapa = async (m, etapa) => {
			switch (etapa) {
				case "planeada": return abrir({
					tipo: "planear",
					m,
					modo: m.avance.fecha_planeada ? "mover" : "planear"
				});
				case "programada": return abrir({
					tipo: "programar",
					m
				});
				case "publicada": return abrir({
					tipo: "publicar",
					m,
					origen: "etapa"
				});
				case "no_se_puede": return abrir({
					tipo: "no_se_puede",
					m
				});
				case "video_listo":
					await ops.aplicarEtapa(m, "video_listo", { fecha_video_listo: hoyLocal() });
					return;
				case "por_planear":
					await ops.aplicarEtapa(m, "por_planear", {});
					return;
			}
		};
		const abrirMensaje = (destino) => abrirMensajeEn(destino);
		const ejecutar = async (m, accion) => {
			switch (accion) {
				case "planear": return planear(m);
				case "marcar_publicada": return cambiarEtapa(m, "publicada");
				case "video_listo": return cambiarEtapa(m, "video_listo");
				case "marcar_programada": return cambiarEtapa(m, "programada");
				case "avisar":
					abrirMensaje({ solicitud: m.application_id });
					return;
				case "cambiar_fecha": return abrir({
					tipo: "planear",
					m,
					modo: "mover"
				});
				case null: return;
			}
		};
		return {
			planear,
			cambiarEtapa,
			accionPrincipal: (m) => ejecutar(m, accionPrincipal(m, prefs.programo_mis_videos)),
			noSePuede: (m) => abrir({
				tipo: "no_se_puede",
				m
			}),
			vincularVideo: (m, sugerido) => abrir({
				tipo: "publicar",
				m,
				origen: "vincular",
				...sugerido ? { sugerido } : {}
			}),
			moverDia: (m) => abrir({
				tipo: "planear",
				m,
				modo: "mover"
			}),
			fijar: async (m, fijada) => {
				await ops.aplicarFijada(m, fijada);
			},
			abrirMensaje
		};
	}, [
		hojas,
		ops,
		prefs.programo_mis_videos
	]);
}
/**
* Anfitrión de las hojas de etapa (01 §3.3: hojas para cambiar etapa y elegir fecha). ProveedorBloques lo monta UNA
* vez: useControlMuestra pide una hoja con ContextoHojas.abrir() y la promesa se resuelve cuando la hoja se cierra.
* La hoja cerrada se queda montada con abierta=false hasta la siguiente para que su salida se anime.
*/
function HojaVigente(p) {
	const control = useControlMuestra();
	const { peticion, abierta } = p.activa;
	switch (peticion.tipo) {
		case "planear": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaPlanear, {
			m: peticion.m,
			modo: peticion.modo,
			abierta,
			alTerminar: p.alTerminar
		});
		case "promesa": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaPlanear, {
			m: peticion.m,
			modo: peticion.modo,
			fechaElegida: peticion.fecha,
			abierta,
			alTerminar: p.alTerminar
		});
		case "publicar": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaPublicar, {
			m: peticion.m,
			origen: peticion.origen,
			...peticion.sugerido ? { sugerido: peticion.sugerido } : {},
			abierta,
			alTerminar: p.alTerminar
		});
		case "programar": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaProgramar, {
			m: peticion.m,
			abierta,
			alTerminar: p.alTerminar
		});
		case "no_se_puede": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaNoSePuede, {
			m: peticion.m,
			abierta,
			alTerminar: p.alTerminar
		});
		case "etapa": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaEtapa, {
			m: peticion.m,
			abierta,
			alTerminar: p.alTerminar,
			alElegir: (etapa) => {
				p.alTerminar();
				control.cambiarEtapa(peticion.m, etapa);
			}
		});
	}
}
function AnfitrionHojas(p) {
	const [activa, setActiva] = (0, import_react.useState)(null);
	const api = (0, import_react.useMemo)(() => ({ abrir(peticion) {
		return new Promise((resolver) => {
			setActiva((previa) => {
				if (previa?.abierta) previa.resolver();
				return {
					peticion,
					resolver,
					clave: (previa?.clave ?? 0) + 1,
					abierta: true
				};
			});
		});
	} }), []);
	const cerrar = (0, import_react.useCallback)(() => {
		setActiva((previa) => {
			if (!previa || !previa.abierta) return previa;
			previa.resolver();
			return {
				...previa,
				abierta: false
			};
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ContextoHojas.Provider, {
		value: api,
		children: [p.children, activa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaVigente, {
			activa,
			alTerminar: cerrar
		}, activa.clave) : null]
	});
}
var celular_module_default = {
	contenedor: "_contenedor_1s0ig_3",
	panel: "_panel_1s0ig_7",
	compacto: "_compacto_1s0ig_14",
	lienzoQr: "_lienzoQr_1s0ig_23",
	qr: "_qr_1s0ig_38",
	tileVacio: "_tileVacio_1s0ig_41",
	conectado: "_conectado_1s0ig_56 _tileVacio_1s0ig_41",
	conectadoTexto: "_conectadoTexto_1s0ig_62",
	textos: "_textos_1s0ig_68",
	titulo: "_titulo_1s0ig_74",
	texto: "_texto_1s0ig_68",
	pasos: "_pasos_1s0ig_88",
	codigo: "_codigo_1s0ig_120",
	ayuda: "_ayuda_1s0ig_127",
	direccion: "_direccion_1s0ig_133",
	mono: "_mono_1s0ig_138",
	solicitud: "_solicitud_1s0ig_143",
	numero: "_numero_1s0ig_151",
	caduca: "_caduca_1s0ig_161"
};
/**
* PanelQrEmparejamiento (01 §4.14 C, §5.3, C6; 02 §7.19): «Lleva Corte en tu celular», los 3 pasos, el QR (tile
* blanco siempre oscuro sobre blanco), el código manual de 12 caracteres Crockford en 3 grupos con su anillo de cuenta
* regresiva, la dirección de la PC y «El código cambia cada 5 minutos.». Pide POST /api/lan/emparejar (hub.lanEmparejar)
* y lo renueva al vencer. Con «emparejamiento.fin» aprobado muestra «{celular} quedó conectado.» y avisa alEmparejado.
* DialogoSolicitudEmparejamiento (01 §4.14 C): modal global «¿Conectar este celular?» con el número de 4 dígitos.
*/
/** Solo galería y pruebas: reemplaza hub.lanEmparejar (p. ej. con un QR ficticio). */
var ContextoPedirEmparejamiento = (0, import_react.createContext)(null);
function PanelQrEmparejamiento(p) {
	const inyectado = (0, import_react.useContext)(ContextoPedirEmparejamiento);
	const [estado, setEstado] = (0, import_react.useState)({ tipo: "cargando" });
	const solicitante = (0, import_react.useRef)(null);
	const vivo = (0, import_react.useRef)(true);
	const alEmparejado = p.alEmparejado;
	const pedir = (0, import_react.useCallback)(async () => {
		try {
			const datos = await (inyectado ?? (() => hub.lanEmparejar()))();
			if (vivo.current) setEstado({
				tipo: "listo",
				datos
			});
		} catch (e) {
			if (!vivo.current) return;
			if (e instanceof ErrorHub && (e.codigo === "solo_en_pc" || e.codigo === "necesita_pc")) setEstado({ tipo: "solo_pc" });
			else setEstado({
				tipo: "error",
				texto: e instanceof ErrorHub ? e.mensaje : T$1.errorCodigo
			});
		}
	}, [inyectado]);
	(0, import_react.useEffect)(() => {
		vivo.current = true;
		pedir();
		return () => {
			vivo.current = false;
		};
	}, [pedir]);
	const pairId = estado.tipo === "listo" ? estado.datos.pair_id : null;
	useEventoHub((e) => {
		if (pairId === null) return;
		if (e.tipo === "emparejamiento.solicitud" && e.pair_id === pairId) solicitante.current = {
			pair_id: e.pair_id,
			dispositivo: e.dispositivo
		};
		if (e.tipo === "emparejamiento.fin" && e.pair_id === pairId) {
			if (e.resultado === "aprobado") {
				const dispositivo = solicitante.current?.pair_id === pairId ? solicitante.current.dispositivo : T$1.tuCelular;
				setEstado({
					tipo: "conectado",
					dispositivo
				});
				alEmparejado?.(dispositivo);
			} else {
				setEstado({ tipo: "cargando" });
				pedir();
			}
		}
	});
	const pasos = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
		className: celular_module_default.pasos,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: T$1.paso1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: T$1.paso2 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: T$1.paso3 })
		]
	});
	let tile;
	let codigo = null;
	if (estado.tipo === "listo") {
		tile = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MosaicoQr, {
			png: estado.datos.qr_png,
			alt: T$1.qrAlt,
			className: cx$1(celular_module_default.qr)
		});
		codigo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: celular_module_default.codigo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: celular_module_default.ayuda,
					children: T$1.noPuedesEscanear
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodigoEmparejamiento, {
					codigo: estado.datos.codigo_manual,
					expiraAt: estado.datos.expira_at,
					alVencer: () => {
						setEstado({ tipo: "cargando" });
						pedir();
					}
				}),
				estado.datos.direcciones[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: celular_module_default.direccion,
					children: [
						T$1.direccionPc,
						": ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: celular_module_default.mono,
							children: estado.datos.direcciones.join(" · ")
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: celular_module_default.ayuda,
					children: T$1.cambiaCada5
				})
			]
		});
	} else if (estado.tipo === "conectado") tile = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: celular_module_default.conectado,
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 56 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: celular_module_default.conectadoTexto,
			children: T$1.celularConectado(estado.dispositivo)
		})]
	});
	else if (estado.tipo === "cargando") tile = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: celular_module_default.tileVacio,
		"aria-busy": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
			forma: "bloque",
			ancho: 196,
			alto: 196
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: celular_module_default.ayuda,
			children: T$1.generandoCodigo
		})]
	});
	else tile = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: celular_module_default.tileVacio,
		role: estado.tipo === "error" ? "alert" : "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: estado.tipo === "error" ? "CircleAlert" : "Monitor",
				tamano: 24
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: celular_module_default.ayuda,
				children: estado.tipo === "error" ? estado.texto : T$1.soloEnPc
			}),
			estado.tipo === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				tamano: "sm",
				icono: "RefreshCw",
				alPulsar: () => {
					setEstado({ tipo: "cargando" });
					pedir();
				},
				children: T$1.reintentar
			}) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx$1(celular_module_default.contenedor, p.className),
		"aria-label": T$1.llevaCorte,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx$1(celular_module_default.panel, p.compacto && celular_module_default.compacto),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: celular_module_default.lienzoQr,
				children: tile
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: celular_module_default.textos,
				children: [
					!p.compacto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: celular_module_default.titulo,
						children: T$1.llevaCorte
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: celular_module_default.texto,
						children: T$1.llevaCorteTexto
					})] }) : null,
					pasos,
					codigo
				]
			})]
		})
	});
}
function segundosRestantes(expira) {
	return Math.max(0, Math.round(expira - ahoraS()));
}
/** El modal en sí (lo usa la galería con una solicitud de ejemplo). */
function VistaSolicitudEmparejamiento(p) {
	const [resta, setResta] = (0, import_react.useState)(() => p.solicitud ? segundosRestantes(p.solicitud.expira_at) : 0);
	const expira = p.solicitud?.expira_at ?? null;
	const alCerrar = p.alCerrar;
	(0, import_react.useEffect)(() => {
		if (expira === null) return void 0;
		setResta(segundosRestantes(expira));
		const t = window.setInterval(() => {
			const s = segundosRestantes(expira);
			setResta(s);
			if (s <= 0) {
				window.clearInterval(t);
				alCerrar();
			}
		}, 1e3);
		return () => window.clearInterval(t);
	}, [expira, alCerrar]);
	if (!p.solicitud) return null;
	const minutos = Math.floor(resta / 60);
	const segundos = String(resta % 60).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: true,
		titulo: T$1.conectarCelular,
		descripcion: T$1.quiereConectarse(p.solicitud.dispositivo),
		alCerrar: p.alCerrar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: p.alRechazar,
			children: T$1.rechazar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			icono: "Check",
			cargando: p.ocupado ?? false,
			alPulsar: p.alPermitir,
			children: T$1.permitir
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: celular_module_default.solicitud,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: celular_module_default.ayuda,
					children: T$1.verificaNumero
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: celular_module_default.numero,
					"aria-label": `${T$1.numeroConfirmacion} ${p.solicitud.codigo_verificacion.split("").join(" ")}`,
					children: p.solicitud.codigo_verificacion
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: celular_module_default.caduca,
					"aria-live": "off",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Clock",
							tamano: 14
						}),
						" ",
						T$1.caducaEn,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: celular_module_default.mono,
							children: [
								minutos,
								":",
								segundos
							]
						})
					]
				})
			]
		})
	});
}
function DialogoSolicitudEmparejamiento() {
	const [solicitud, setSolicitud] = (0, import_react.useState)(null);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	const toast = useToast();
	useEventoHub((e) => {
		if (e.tipo === "emparejamiento.solicitud") setSolicitud({
			pair_id: e.pair_id,
			dispositivo: e.dispositivo,
			codigo_verificacion: e.codigo_verificacion,
			expira_at: e.expira_at
		});
		if (e.tipo === "emparejamiento.fin") setSolicitud((s) => s && s.pair_id === e.pair_id ? null : s);
	});
	const cerrar = (0, import_react.useCallback)(() => setSolicitud(null), []);
	const decidir = async (aprobar) => {
		if (!solicitud) return;
		setOcupado(true);
		try {
			await hub.lanDecidir(solicitud.pair_id, aprobar ? {
				aprobar: true,
				permisos: "lectura_escritura"
			} : { aprobar: false });
			if (aprobar) toast.mostrar({
				texto: T$1.celularConectado(solicitud.dispositivo),
				tono: "ok"
			});
		} catch (e) {
			toast.mostrar({
				texto: e instanceof ErrorHub ? e.mensaje : T$1.errorGenerico,
				tono: "error"
			});
		} finally {
			setOcupado(false);
			setSolicitud(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaSolicitudEmparejamiento, {
		solicitud,
		ocupado,
		alPermitir: () => void decidir(true),
		alRechazar: () => void decidir(false),
		alCerrar: cerrar
	});
}
var globales_module_default = {
	cierre: "_cierre_15f8a_1",
	ayuda: "_ayuda_15f8a_6",
	nueva: "_nueva_15f8a_12",
	nuevaMuestra: "_nuevaMuestra_15f8a_17",
	foto72: "_foto72_15f8a_27",
	nuevaTextos: "_nuevaTextos_15f8a_30",
	nuevaNombre: "_nuevaNombre_15f8a_36",
	nuevaTienda: "_nuevaTienda_15f8a_46",
	vence: "_vence_15f8a_53"
};
/**
* DialogoCierre (01 §3.2, C23): la primera vez que se cierra la ventana sin preferencia, el hub emite
* «ventana.preguntar_cierre» y la interfaz pregunta «¿Mantener Corte en segundo plano? Así tu celular puede actualizarse
* y seguimos sincronizando con TikTok.» [Mantener en segundo plano] [Cerrar por completo]. La decisión se guarda con
* PATCH /api/ajustes/pc (hub.ajustesPc) y después se oculta o se cierra la ventana. Solo Windows.
*/
function VistaCierre(p) {
	const [iniciar, setIniciar] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: T$1.cierreTitulo,
		descripcion: T$1.cierreTexto,
		alCerrar: p.alCerrar,
		pie: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: () => p.alElegir(false, false),
			deshabilitado: p.ocupado ?? false,
			children: T$1.cerrarCompleto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			icono: "Moon",
			cargando: p.ocupado ?? false,
			alPulsar: () => p.alElegir(true, iniciar),
			children: T$1.mantener
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: globales_module_default.cierre,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla$1, {
				marcada: iniciar,
				alCambiar: setIniciar,
				etiqueta: T$1.iniciarConWindows
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: globales_module_default.ayuda,
				children: T$1.cierreAyuda
			})]
		})
	});
}
function DialogoCierre() {
	const [abierto, setAbierto] = (0, import_react.useState)(false);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	useEventoHub((e) => {
		if (e.tipo === "ventana.preguntar_cierre") setAbierto(true);
	});
	const elegir = async (mantener, iniciar) => {
		setOcupado(true);
		try {
			await hub.ajustesPc(mantener ? {
				segundo_plano: true,
				iniciar_con_windows: iniciar
			} : { segundo_plano: false });
		} catch {} finally {
			setOcupado(false);
			setAbierto(false);
			if (mantener) ventana.ocultar();
			else ventana.cerrarDelTodo();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaCierre, {
		abierto,
		ocupado,
		alElegir: (m, i) => void elegir(m, i),
		alCerrar: () => setAbierto(false)
	});
}
/**
* DialogoMuestraNueva (rev. 3.1 · 01 §5.5 paso 4): cuando llega una muestra nueva Por vencer y el plan ya no le deja
* lugar antes de su fecha límite: «Llegó una muestra que vence el {sáb 21 nov}. ¿La metemos en tu plan?»
* [Agregar y recorrer las demás] [Elegir día]. Recorrer usa dominio.recorrerPlan (respeta capacidad, días y lo fijado;
* pone la nueva antes de su vencimiento) y aplica TODO con un solo acciones.lote: un solo Deshacer. Si alguna recorrida
* pasa de su promesa lo dice antes de confirmar: «Esto mueve {1} muestra después de lo que le prometiste a {tienda}.»
* [Recorrer y preparar mensajes] [Elegir otro día]. Una vez por muestra (usePrimeraVez('muestra-nueva-<id>')).
*/
/** Calcula la propuesta (null si no hay plan, no hay muestra nueva por vencer sin fecha o todavía le cabe). Pura. */
function calcularPropuesta(e) {
	if (!e.pendientes.some((m) => m.avance.fecha_planeada !== null && m.avance.etapa !== "por_planear")) return null;
	const nueva = e.pendientes.filter((m) => m.grupo === "por_vencer" && m.avance.etapa === "por_planear" && m.fecha_limite_at !== null).sort((a, b) => (a.fecha_limite_at ?? 0) - (b.fecha_limite_at ?? 0))[0];
	if (!nueva || nueva.fecha_limite_at === null) return null;
	const limite = fechaLocalDe(nueva.fecha_limite_at);
	if (e.hayLugar(e.desde, nueva.application_id, limite)) return null;
	const resto = e.pendientes.filter((m) => m.application_id !== nueva.application_id);
	const promesas = {};
	for (const m of resto) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
	const resultado = recorrerPlan({
		muestras: resto,
		incluidas: [],
		capacidad: e.capacidad,
		dias: e.dias,
		desde: e.desde,
		respetarFechas: true,
		orden: e.orden,
		planes: e.planes,
		promesas,
		hoy: e.hoy
	}, nueva);
	return {
		nueva,
		limite,
		resultado,
		ops: opsDePlan(resultado, [...resto, nueva], e.planes),
		afectadas: resultado.rompe_promesa.map((r) => ({
			muestra: resto.find((m) => m.application_id === r.application_id),
			promesa: r.promesa
		})).filter((x) => x.muestra !== void 0)
	};
}
function usePropuestaMuestraNueva() {
	const consulta = useConsulta("muestras", PARAMS_PENDIENTES$1);
	const planes = useConsulta("plan", {});
	const prefs = usePreferencias();
	const ocupacion = useOcupacion();
	return (0, import_react.useMemo)(() => {
		if (!consulta.datos || !planes.datos) return null;
		const hoy = hoyLocal();
		return calcularPropuesta({
			pendientes: consulta.datos.items.filter(esPendiente),
			planes: planes.datos.items,
			capacidad: Math.max(1, prefs.capacidad_videos_dia),
			dias: prefs.dias_videos,
			orden: prefs.orden_plan,
			hayLugar: (desde, excluir, hasta) => ocupacion.siguienteLibre(desde, excluir, hasta) !== null,
			hoy,
			desde: desdePorOmision(ahoraS())
		});
	}, [
		consulta.datos,
		planes.datos,
		prefs.capacidad_videos_dia,
		prefs.dias_videos,
		prefs.orden_plan,
		ocupacion
	]);
}
/** «Esto mueve {1} muestra después de lo que le prometiste a {tienda}.» */
function textoAfectadas(afectadas) {
	const tiendas = [...new Set(afectadas.map((a) => a.muestra.tienda.nombre))];
	const lista = tiendas.length <= 1 ? tiendas[0] ?? T$1.unaTienda : `${tiendas.slice(0, -1).join(", ")} ${T$1.y} ${tiendas[tiendas.length - 1]}`;
	return T$1.estoMueve(cuenta$1(afectadas.length, T$1.muestra), lista);
}
function VistaMuestraNueva(p) {
	const { nueva, limite, resultado, afectadas } = p.propuesta;
	const [confirmar, setConfirmar] = (0, import_react.useState)(false);
	const nombre = nombreDe(nueva.producto);
	const recorridas = resultado.cambios.filter((c) => c.application_id !== nueva.application_id).length;
	const enConfirmacion = confirmar && afectadas.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: T$1.llegoMuestraVence(formato.fechaConDia(limite)),
		alCerrar: p.alCerrar,
		pie: enConfirmacion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			alPulsar: p.alElegirDia,
			children: T$1.elegirOtroDia
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			icono: "MessageCircle",
			cargando: p.ocupado ?? false,
			alPulsar: () => p.alRecorrer(true),
			children: T$1.recorrerYPreparar
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			icono: "CalendarDays",
			alPulsar: p.alElegirDia,
			children: T$1.elegirDia
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			icono: "CalendarCheck",
			cargando: p.ocupado ?? false,
			alPulsar: () => afectadas.length > 0 ? setConfirmar(true) : p.alRecorrer(false),
			children: T$1.agregarYRecorrer
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: globales_module_default.nueva,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: globales_module_default.nuevaMuestra,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: nueva.producto.imagen,
						alt: nombre,
						anchoCss: 72,
						proporcion: "1:1",
						radio: "md",
						tienda: nueva.tienda.nombre,
						categoria: nueva.producto.categoria,
						className: cx$1(globales_module_default.foto72)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: globales_module_default.nuevaTextos,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: globales_module_default.nuevaNombre,
								children: nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: globales_module_default.nuevaTienda,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
										nombre: nueva.tienda.nombre,
										tamano: 16
									}),
									" ",
									nueva.tienda.nombre
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: globales_module_default.vence,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
										nombre: "Clock",
										tamano: 14
									}),
									" ",
									T$1.venceEl(formato.fechaConDia(limite))
								]
							})
						]
					})]
				}),
				resultado.termina ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.avisoInfo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarCheck",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						resultado.termina !== resultado.termina_antes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							T$1.ahoraTerminasEl,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaConDia(resultado.termina) }),
							resultado.termina_antes ? T$1.antesEl(formato.fechaConDia(resultado.termina_antes)) : "",
							"."
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							T$1.siguesTerminandoEl,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaConDia(resultado.termina) }),
							"."
						] }),
						" ",
						recorridas > 0 ? T$1.recorremos(cuenta$1(recorridas, T$1.muestra)) : T$1.noHayQueMover
					] })]
				}) : null,
				resultado.no_alcanza.some((x) => x.application_id === nueva.application_id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.avisoCritico,
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CircleAlert",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.noAlcanzasHacerla(formato.fechaConDia(limite)) })]
				}) : null,
				enConfirmacion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.aviso,
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarClock",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: textoAfectadas(afectadas) })]
				}) : null
			]
		})
	});
}
function DialogoMuestraNueva() {
	const propuesta = usePropuestaMuestraNueva();
	const id = propuesta?.nueva.application_id ?? "ninguna";
	const [primera, marcarVista] = usePrimeraVez(`muestra-nueva-${id}`);
	const ops = useOperaciones();
	const control = useControlMuestra();
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	if (!propuesta || !primera) return null;
	const recorrer = async (prepararMensajes) => {
		setOcupado(true);
		const termina = propuesta.resultado.termina;
		const r = await ops.aplicarLote(propuesta.ops, termina ? T$1.ahoraTerminasElFecha(formato.fechaConDia(termina)) : T$1.agregamosMuestra, { solicitud: propuesta.nueva.application_id });
		setOcupado(false);
		marcarVista();
		const afectada = propuesta.afectadas[0];
		if (prepararMensajes && afectada && r && (r.estado === "aplicada" || r.estado === "en_cola")) abrirMensajeEn({ tienda: afectada.muestra.tienda.tienda_key }, { plantilla: "nueva_fecha" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaMuestraNueva, {
		propuesta,
		abierto: true,
		ocupado,
		alRecorrer: (preparar) => void recorrer(preparar),
		alElegirDia: () => {
			marcarVista();
			control.planear(propuesta.nueva);
		},
		alCerrar: marcarVista
	}, id);
}
var TarjetaVentasProducto_module_default = {
	tarjeta: "_tarjeta_s6rru_2",
	cabeza: "_cabeza_s6rru_13",
	titulo: "_titulo_s6rru_19",
	verTodos: "_verTodos_s6rru_26 _enlace_1x3ae_65",
	caso: "_caso_s6rru_29",
	texto: "_texto_s6rru_38",
	botones: "_botones_s6rru_47",
	nota: "_nota_s6rru_52",
	mejores: "_mejores_s6rru_65",
	subtitulo: "_subtitulo_s6rru_70 _overline_1x3ae_29",
	videos: "_videos_s6rru_73",
	video: "_video_s6rru_73",
	destacado: "_destacado_s6rru_89",
	miniatura: "_miniatura_s6rru_92",
	videoTextos: "_videoTextos_s6rru_95",
	videoId: "_videoId_s6rru_101",
	videoMeta: "_videoMeta_s6rru_107",
	videoCifra: "_videoCifra_s6rru_112"
};
/**
* TarjetaVentasProducto (01 §4.3 tarjeta 5, §2.4 reglas 3–4): solo si tus videos ya venden este producto.
*   A · Posible video     «Este video empezó a vender el producto el {28 sep}, {17} días después de que pediste la
*                         muestra. ¿Es el video de esta muestra?» [Sí, vincular] [No es este]
*   B · Ya tienes un video «Ya tienes un video que vende este producto (desde el {13 sep}). TikTok no lo contó para esta
*                         muestra.» [Usarlo en el mensaje] → después de avisar: [La tienda aceptó este video]. Nunca
*                         cambia la etapa por sí sola.
*   C · Sin fecha de solicitud «Ya vendes este producto en {12} videos…» [Elegir de mis videos]
* En todas: los 3 mejores videos (portada = foto del producto, comisión, primera venta) y «Ver todos».
*/
/** Video anterior a la muestra (tarjeta B): el que empezó a vender primero. */
function videoPrevio(videos) {
	let previo = null;
	for (const v of videos) if (previo === null || v.primera_venta < previo.primera_venta) previo = v;
	return previo;
}
/** «Posible video» (01 §2.6): empezó a vender en o después de la solicitud + 7 días (o de la solicitud si está por
*  vencer o en revisión) y no se descartó. Nunca sin fecha de solicitud. */
function posibleVideo(m, videos, descartados) {
	if (m.solicitada_at === null) return null;
	const solicitud = fechaLocalDe(m.solicitada_at);
	const desde = m.grupo === "por_vencer" || m.grupo === "en_revision" ? solicitud : sumarDias(solicitud, 7);
	const candidatos = videos.filter((v) => v.primera_venta >= desde && !descartados.includes(v.content_id));
	candidatos.sort((a, b) => a.primera_venta < b.primera_venta ? -1 : a.primera_venta > b.primera_venta ? 1 : 0);
	return candidatos[0] ?? null;
}
/** ¿Ya se envió un aviso «Ya tengo video» de esta muestra? (entonces aparece «La tienda aceptó este video»). */
function yaAvisoVideoPrevio(detalle) {
	return detalle.avisos.some((a) => a.plantilla_id === "ya_tengo_video" && a.marcado_enviado_at !== null && a.quitado_at === null && a.solicitud_ids.includes(detalle.muestra.application_id));
}
function FilaVideo(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cx$1(TarjetaVentasProducto_module_default.video, p.destacado && TarjetaVentasProducto_module_default.destacado),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: p.v.miniatura,
				alt: `${T$1.fotoDelProducto}: ${p.nombre}`,
				anchoCss: 44,
				proporcion: "1:1",
				radio: "sm",
				tienda: p.tienda,
				className: cx$1(TarjetaVentasProducto_module_default.miniatura)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaVentasProducto_module_default.videoTextos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaVentasProducto_module_default.videoId,
					children: T$1.videoId(formato.idCorto(p.v.content_id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaVentasProducto_module_default.videoMeta,
					children: T$1.vendeDesdeElFila(formato.fechaCorta(p.v.primera_venta))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: TarjetaVentasProducto_module_default.videoCifra,
				children: formato.dinero(p.v.comision_estimada_centavos)
			})
		]
	});
}
function TarjetaVentasProducto(p) {
	const { detalle } = p;
	const m = detalle.muestra;
	const control = useControlMuestra();
	const acciones = useAcciones();
	const toast = useToast();
	const [descartadosLocal, setDescartadosLocal] = (0, import_react.useState)([]);
	const videos = detalle.videos_del_producto;
	if (videos.length === 0) return null;
	const nombre = nombreDe(m.producto);
	const plan = detalle.planes.find((x) => x.application_id === m.application_id) ?? null;
	const descartados = [...plan?.sugerencias_descartadas ?? [], ...descartadosLocal];
	const mejores = [...videos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, 3);
	const solicitud = m.solicitada_at !== null ? fechaLocalDe(m.solicitada_at) : null;
	const publicada = m.avance.etapa === "publicada";
	const descartar = async (contentId) => {
		setDescartadosLocal((d) => [...d, contentId]);
		const r = plan ? await acciones.editarPlan(plan.id, {
			sugerencias_descartadas: [...plan.sugerencias_descartadas, contentId],
			rev: plan.rev
		}) : await acciones.crearPlan({
			id: nuevoId(),
			titulo: nombre.slice(0, 200),
			application_id: m.application_id,
			product_id: m.producto.product_id,
			tienda_key: m.tienda.tienda_key,
			estado: m.avance.etapa,
			sugerencias_descartadas: [contentId]
		});
		if (r.estado === "conflicto") toast.mostrar({
			texto: T$1.conflicto,
			tono: "info"
		});
		else if (r.estado === "error") toast.mostrar({
			texto: r.error?.mensaje ?? T$1.errorGenerico,
			tono: "error"
		});
		else toast.mostrar({
			texto: T$1.noVolveremosSugerir,
			tono: "ok",
			accion: {
				etiqueta: T$1.deshacer,
				alPulsar: () => {
					setDescartadosLocal((d) => d.filter((x) => x !== contentId));
					r.deshacer();
				}
			},
			duracion_ms: 6e3
		});
	};
	let cuerpo = null;
	const tipo = publicada ? null : m.tarjeta_video;
	if (tipo === "posible_video") {
		const v = posibleVideo(m, videos, descartados);
		if (v && solicitud) {
			const dias = diasEntre(solicitud, v.primera_venta);
			cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaVentasProducto_module_default.caso,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: TarjetaVentasProducto_module_default.texto,
						children: [
							T$1.posibleVideoAntes,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaCorta(v.primera_venta) }),
							T$1.posibleVideoDespues(formato.numero(dias), dias === 1)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: TarjetaVentasProducto_module_default.videos,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaVideo, {
							v,
							nombre,
							tienda: m.tienda.nombre,
							destacado: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaVentasProducto_module_default.botones,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							tamano: "sm",
							icono: "Link",
							alPulsar: () => void control.vincularVideo(m, v.content_id),
							children: T$1.siVincular
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							alPulsar: () => void descartar(v.content_id),
							children: T$1.noEsEste
						})]
					})
				]
			});
		}
	} else if (tipo === "video_previo") {
		const v = videoPrevio(videos);
		if (v) {
			const antes = solicitud !== null && v.primera_venta < solicitud;
			const aviso = yaAvisoVideoPrevio(detalle);
			cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaVentasProducto_module_default.caso,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: TarjetaVentasProducto_module_default.texto,
						children: [
							T$1.videoPrevioAntes,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaCorta(v.primera_venta) }),
							T$1.videoPrevioDespues,
							antes ? ` ${T$1.antesDePedir}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: TarjetaVentasProducto_module_default.videos,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaVideo, {
							v,
							nombre,
							tienda: m.tienda.nombre,
							destacado: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaVentasProducto_module_default.botones,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: aviso ? "secundario" : "primario",
							tamano: "sm",
							icono: "MessageCircle",
							alPulsar: () => abrirMensajeEn({ solicitud: m.application_id }, { plantilla: "ya_tengo_video" }),
							children: T$1.usarloMensaje
						}), aviso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							tamano: "sm",
							icono: "Check",
							alPulsar: () => void control.vincularVideo(m, v.content_id),
							children: T$1.laTiendaAcepto
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: TarjetaVentasProducto_module_default.nota,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Info",
								tamano: 14
							}),
							" ",
							T$1.noCambiaAvance
						]
					})
				]
			});
		}
	} else if (tipo === "sin_fecha") {
		const vp = m.ventas_producto;
		cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: TarjetaVentasProducto_module_default.caso,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: TarjetaVentasProducto_module_default.texto,
				children: [
					T$1.yaVendesEn,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: T$1.nVideos(formato.numero(vp.videos), vp.videos === 1) }),
					T$1.yaVendesResto(formato.numero(vp.pedidos_validos), formato.dinero(vp.comision_estimada_centavos))
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: TarjetaVentasProducto_module_default.botones,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "SquarePlay",
					alPulsar: () => void control.vincularVideo(m),
					children: T$1.elegirDeMisVideos
				})
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx$1(TarjetaVentasProducto_module_default.tarjeta, p.className),
		"aria-label": T$1.ventasProducto,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: TarjetaVentasProducto_module_default.cabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: TarjetaVentasProducto_module_default.titulo,
					children: T$1.ventasProducto
				}), videos.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: TarjetaVentasProducto_module_default.verTodos,
					onClick: () => navegar(`/productos/${encodeURIComponent(m.producto.product_id)}`),
					children: [
						T$1.verTodos,
						" (",
						formato.numero(videos.length),
						")"
					]
				}) : null]
			}),
			cuerpo,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaVentasProducto_module_default.mejores,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaVentasProducto_module_default.subtitulo,
					children: T$1.tusVideosQueMasVenden
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: TarjetaVentasProducto_module_default.videos,
					children: mejores.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilaVideo, {
						v,
						nombre,
						tienda: m.tienda.nombre
					}, v.content_id))
				})]
			})
		]
	});
}
/**
* Datos del mensaje a una tienda (01 §4.8): muestras incluidas, tienda, plantillas, firma, avisos, plantilla sugerida
* (la del hub o de la copia; respaldo plantillaRecomendada) y los valores por omisión de las variables.
*/
var SIETE_DIAS$1 = 604800;
/** Nombre visible de una tienda a partir de su clave cuando aún no hay datos (solo respaldo). */
function nombreDeClave(clave) {
	return clave.replace(/\b\p{L}/gu, (l) => l.toLocaleUpperCase("es-MX"));
}
function cubre(a, solicitudes) {
	if (solicitudes.length === 0) return a.solicitud_ids.length === 0;
	return solicitudes.every((s) => a.solicitud_ids.includes(s));
}
function useDatosMensaje(tiendaKey, solicitudes) {
	const deTienda = useConsulta("muestras", { tienda: tiendaKey });
	const una = solicitudes.length === 1 ? solicitudes[0] : void 0;
	const detalle = useConsulta("muestra", { id: una ?? "" }, { activa: una !== void 0 });
	const tiendaDetalle = useConsulta("tienda", { key: tiendaKey }, { activa: una === void 0 });
	const plantillas = useConsulta("plantillas", {});
	const avisos = useConsulta("avisos", { tienda: tiendaKey });
	const prefs = usePreferencias();
	const username = useUsername();
	return (0, import_react.useMemo)(() => {
		const items = (deTienda.datos?.items ?? tiendaDetalle.datos?.muestras ?? []).filter((m) => m.tienda.tienda_key === tiendaKey);
		const muestras = solicitudes.map((id) => items.find((m) => m.application_id === id) ?? (detalle.datos?.muestra.application_id === id ? detalle.datos.muestra : void 0)).filter((m) => m !== void 0);
		const otrasPendientes = items.filter((m) => !solicitudes.includes(m.application_id) && [
			"por_vencer",
			"vencida",
			"pausada"
		].includes(m.grupo) && m.avance.etapa !== "publicada" && m.avance.etapa !== "no_se_puede");
		const primera = muestras[0] ?? items[0];
		const filaTienda = tiendaDetalle.datos?.tienda;
		const tienda = {
			tienda_key: tiendaKey,
			nombre: primera?.tienda.nombre ?? filaTienda?.nombre ?? nombreDeClave(tiendaKey),
			es_socio: primera?.tienda.es_socio ?? filaTienda?.es_socio ?? false
		};
		const listaAvisos = (avisos.datos?.items ?? []).filter((a) => a.tienda_key === tiendaKey);
		const promesaVencida = muestras.some((m) => m.avisos.promesa_vencida);
		const sugerida = (una !== void 0 ? detalle.datos?.plantilla_sugerida : tiendaDetalle.datos?.plantilla_sugerida) ?? plantillaRecomendada({
			muestras,
			promesa_vencida: promesaVencida,
			es_socio: tienda.es_socio
		});
		const compromisosOmision = {};
		for (const m of muestras) {
			const f = fechaPrometidaPorOmision(m.avance);
			if (f !== null) compromisosOmision[m.application_id] = f;
		}
		const ahora = ahoraS();
		const copiadoPendiente = listaAvisos.filter((a) => a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS$1 && cubre(a, solicitudes)).sort((a, b) => (b.copiado_at ?? 0) - (a.copiado_at ?? 0))[0] ?? null;
		const contenido = muestras.find((m) => m.avance.content_id !== null)?.avance.content_id ?? null;
		const previo = detalle.datos ? videoPrevio(detalle.datos.videos_del_producto) : null;
		const planMuestra = detalle.datos?.planes.find((x) => x.application_id === una) ?? null;
		const motivo = planMuestra?.motivo_no_se_puede ?? null;
		return {
			cargando: solicitudes.length > 0 && muestras.length < solicitudes.length && (deTienda.cargando || detalle.cargando) || plantillas.cargando,
			errorTexto: plantillas.error?.mensaje ?? (muestras.length < solicitudes.length && !deTienda.cargando ? deTienda.error?.mensaje ?? null : null),
			tienda,
			muestras,
			otrasPendientes,
			plantillas: plantillas.datos?.items ?? [],
			sugerida,
			firma: prefs.firma,
			avisos: listaAvisos,
			copiadoPendiente,
			compromisosOmision,
			linkOmision: {
				ya_publique: contenido ? enlaceVideo(username, contenido) : planMuestra?.enlace_video ?? null,
				ya_tengo_video: previo?.enlace ?? null
			},
			problemaEnvio: motivo === "no_llego" || motivo === "incompleta" ? motivo : null,
			enlaceProducto: muestras[0]?.producto.enlace ?? null
		};
	}, [
		deTienda.datos,
		deTienda.cargando,
		deTienda.error,
		detalle.datos,
		detalle.cargando,
		tiendaDetalle.datos,
		plantillas.datos,
		plantillas.cargando,
		plantillas.error,
		avisos.datos,
		prefs.firma,
		username,
		solicitudes,
		tiendaKey,
		una
	]);
}
var EditorMensaje_module_default = {
	editor: "_editor_1e6t0_3",
	plantillas: "_plantillas_1e6t0_10",
	plantilla: "_plantilla_1e6t0_10",
	plantillaActiva: "_plantillaActiva_1e6t0_43",
	rotulo: "_rotulo_1e6t0_50 _overline_1x3ae_29",
	lePrometes: "_lePrometes_1e6t0_53",
	listaFechas: "_listaFechas_1e6t0_58",
	filaFecha: "_filaFecha_1e6t0_66",
	fechaNombre: "_fechaNombre_1e6t0_73",
	fechaValor: "_fechaValor_1e6t0_82",
	faltaCuerpo: "_faltaCuerpo_1e6t0_107",
	fechaFalta: "_fechaFalta_1e6t0_118",
	chipsFecha: "_chipsFecha_1e6t0_128",
	chipFecha: "_chipFecha_1e6t0_133",
	marco: "_marco_1e6t0_155",
	marcoCabeza: "_marcoCabeza_1e6t0_164",
	marcoPie: "_marcoPie_1e6t0_165",
	contador: "_contador_1e6t0_172",
	previa: "_previa_1e6t0_177",
	marca: "_marca_1e6t0_201",
	hueco: "_hueco_1e6t0_213",
	marcaFalta: "_marcaFalta_1e6t0_225",
	area: "_area_1e6t0_230",
	editadoNota: "_editadoNota_1e6t0_233",
	confirmar: "_confirmar_1e6t0_237",
	confirmarTexto: "_confirmarTexto_1e6t0_248",
	acciones: "_acciones_1e6t0_259",
	accionesFila: "_accionesFila_1e6t0_264",
	ayudaCopiar: "_ayudaCopiar_1e6t0_272",
	porMiCuenta: "_porMiCuenta_1e6t0_276",
	enviados: "_enviados_1e6t0_284",
	listaEnviados: "_listaEnviados_1e6t0_289",
	enviado: "_enviado_1e6t0_284",
	enviadoTexto: "_enviadoTexto_1e6t0_307",
	pie: "_pie_1e6t0_312",
	pieDerecha: "_pieDerecha_1e6t0_321",
	modoAvisar: "_modoAvisar_1e6t0_326"
};
/**
* EditorMensaje (01 §4.8, §4.17): chips de plantilla (preseleccionada la sugerida), fecha prometida (fecha de
* PUBLICACIÓN: programada; si no, planeada + 2), vista previa con las variables resaltadas y editable, contador de
* caracteres y Copiar. Si falta un dato (fecha, plan o enlace) Copiar va desactivado: nunca se copia «fecha por
* confirmar» ni una variable sin resolver. Al copiar se guarda el aviso «copiado, sin confirmar» y se pregunta «¿Ya se
* lo enviaste a la tienda?» [Sí, ya se lo envié] [Todavía no]; confirmar registra el aviso con Deshacer de 6 s.
* «Ya le escribí por mi cuenta» registra un aviso sin copiar (plantilla u «Otro» y la fecha prometida, si la hubo).
*/
var VARIABLE = /\{(tienda|producto|fecha_compromiso|fecha_anterior|link_video|lista_productos|lista_fechas|agradecimiento_socio|problema_envio|firma)\}/;
/** Plantillas que piden la fecha prometida (las que tienen {fecha_compromiso} o {lista_fechas}). */
function usaFecha(cuerpo) {
	return cuerpo.includes("{fecha_compromiso}") || cuerpo.includes("{lista_fechas}");
}
/** En {lista_fechas} una muestra sin fecha queda «… a más tardar el …» (dominio.resolverPlantilla): ese «…» final de
*  renglón es el hueco que impide copiar, y se pinta como faltante (ámbar) dentro del resaltado lima. */
var HUECO_FECHA = /…(?=\n|$)/g;
function ContenidoMarca(p) {
	if (p.variable !== "lista_fechas" || !p.valor.includes("…")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: p.valor });
	const partes = [];
	let i = 0;
	for (const m of p.valor.matchAll(HUECO_FECHA)) {
		const at = m.index ?? 0;
		if (at > i) partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.valor.slice(i, at) }, `t${at}`));
		partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: EditorMensaje_module_default.hueco,
			title: T$1.faltaFecha,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				children: "…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: comun_module_default.lector,
				children: T$1.faltaFecha
			})]
		}, `h${at}`));
		i = at + 1;
	}
	if (i < p.valor.length) partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.valor.slice(i) }, "fin"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: partes });
}
/** Marca en la fila de plantillas qué orillas tienen chips fuera de la vista (data-desborde; lo usa el CSS). */
function medirDesborde(fila) {
	const izq = fila.scrollLeft > 2;
	const der = fila.scrollLeft + fila.clientWidth < fila.scrollWidth - 2;
	const valor = izq && der ? "ambos" : izq ? "izq" : der ? "der" : "ninguno";
	if (fila.dataset.desborde !== valor) fila.dataset.desborde = valor;
}
/** Desplaza la fila de plantillas (solo la fila, nunca la página) hasta que la plantilla elegida quede a la vista. */
function traerActivaAVista(fila) {
	if (fila.scrollWidth > fila.clientWidth + 1) {
		const activa = fila.querySelector("[aria-checked=\"true\"]");
		if (activa) {
			const rf = fila.getBoundingClientRect();
			const ra = activa.getBoundingClientRect();
			const margen = 36;
			if (ra.left < rf.left + margen) fila.scrollLeft = Math.max(0, fila.scrollLeft + ra.left - rf.left - margen);
			else if (ra.right > rf.right - margen) fila.scrollLeft += ra.right - rf.right + margen;
		}
	}
	medirDesborde(fila);
}
/** Vista previa con los rangos de variables marcados (<mark>), sin innerHTML. */
function VistaPrevia(p) {
	const partes = [];
	let i = 0;
	[...p.mensaje.resaltados].sort((a, b) => a.inicio - b.inicio).forEach((r, n) => {
		if (r.inicio > i) partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.mensaje.texto.slice(i, r.inicio) }, `t${n}`));
		const valor = p.mensaje.texto.slice(r.inicio, r.fin);
		partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: cx$1(EditorMensaje_module_default.marca, VARIABLE.test(valor) && EditorMensaje_module_default.marcaFalta),
			"data-variable": r.variable,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContenidoMarca, {
				valor,
				variable: r.variable
			})
		}, `m${n}`));
		i = Math.max(i, r.fin);
	});
	if (i < p.mensaje.texto.length) partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.mensaje.texto.slice(i) }, "fin"));
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return void 0;
		const medir = () => medirDesbordeVertical(el);
		medir();
		let vivo = true;
		document.fonts?.ready.then(() => {
			if (vivo) medir();
		});
		const observador = typeof ResizeObserver === "function" ? new ResizeObserver(medir) : null;
		observador?.observe(el);
		return () => {
			vivo = false;
			observador?.disconnect();
		};
	}, [p.mensaje.texto]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		ref,
		className: cx$1(EditorMensaje_module_default.previa, p.className),
		"data-desborde": "ninguno",
		onScroll: (e) => medirDesbordeVertical(e.currentTarget),
		children: partes
	});
}
/** Marca en la vista previa qué orillas (arriba / abajo) tienen texto fuera de la vista. */
function medirDesbordeVertical(el) {
	const arriba = el.scrollTop > 2;
	const abajo = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
	const valor = arriba && abajo ? "ambos" : arriba ? "arriba" : abajo ? "abajo" : "ninguno";
	if (el.dataset.desborde !== valor) el.dataset.desborde = valor;
}
function ChipsFecha(p) {
	const hoy = hoyLocal();
	const [calendario, setCalendario] = (0, import_react.useState)(false);
	const tres = sumarDias(hoy, 3);
	const semana = sumarDias(hoy, 7);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: EditorMensaje_module_default.fechaFalta,
		children: [
			p.nombre ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: EditorMensaje_module_default.fechaNombre,
				children: p.nombre
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.chipsFecha,
				role: "group",
				"aria-label": T$1.fechaPrometida,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: EditorMensaje_module_default.chipFecha,
						onClick: () => p.alElegir(tres),
						children: [
							T$1.enTresDias,
							" (",
							formato.fechaConDia(tres),
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: EditorMensaje_module_default.chipFecha,
						onClick: () => p.alElegir(semana),
						children: [
							T$1.enUnaSemana,
							" (",
							formato.fechaConDia(semana),
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: EditorMensaje_module_default.chipFecha,
						"aria-expanded": calendario,
						onClick: () => setCalendario((v) => !v),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "CalendarDays",
								tamano: 14
							}),
							" ",
							T$1.elegir
						]
					})
				]
			}),
			calendario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
				etiqueta: T$1.fechaPrometida,
				valor: null,
				min: sumarDias(hoy, 1),
				alCambiar: (f) => {
					setCalendario(false);
					p.alElegir(f);
				}
			}) : null
		]
	});
}
function EditorMensaje(p) {
	const datos = useDatosMensaje(p.tiendaKey, p.solicitudes);
	const acciones = useAcciones();
	const control = useControlMuestra();
	const toast = useToast();
	const android = useEsAndroid();
	const [plantillaId, setPlantillaId] = (0, import_react.useState)(p.plantillaInicial ?? null);
	const [fechas, setFechas] = (0, import_react.useState)({});
	const [agendar, setAgendar] = (0, import_react.useState)(null);
	const [link, setLink] = (0, import_react.useState)(null);
	const [editado, setEditado] = (0, import_react.useState)(null);
	const [editando, setEditando] = (0, import_react.useState)(false);
	const [avisoCopiado, setAvisoCopiado] = (0, import_react.useState)(null);
	const [ocultarConfirmar, setOcultarConfirmar] = (0, import_react.useState)(false);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	const [porMiCuenta, setPorMiCuenta] = (0, import_react.useState)(false);
	const [cambiarFecha, setCambiarFecha] = (0, import_react.useState)(null);
	const campoLink = (0, import_react.useRef)(null);
	const filaPlantillas = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (plantillaId === null && !datos.cargando && datos.plantillas.length > 0) setPlantillaId(datos.sugerida);
	}, [
		plantillaId,
		datos.cargando,
		datos.plantillas.length,
		datos.sugerida
	]);
	const plantilla = datos.plantillas.find((x) => x.id === plantillaId) ?? null;
	const filaMontada = !datos.cargando && plantilla !== null;
	(0, import_react.useEffect)(() => {
		const fila = filaPlantillas.current;
		if (!filaMontada || !fila) return void 0;
		let vigente = true;
		traerActivaAVista(fila);
		document.fonts?.ready.then(() => {
			if (vigente && fila.isConnected) traerActivaAVista(fila);
		});
		return () => {
			vigente = false;
		};
	}, [
		plantillaId,
		datos.plantillas.length,
		filaMontada
	]);
	(0, import_react.useEffect)(() => {
		const fila = filaPlantillas.current;
		if (!filaMontada || !fila) return;
		const alCambiar = () => medirDesborde(fila);
		fila.addEventListener("scroll", alCambiar, { passive: true });
		window.addEventListener("resize", alCambiar);
		return () => {
			fila.removeEventListener("scroll", alCambiar);
			window.removeEventListener("resize", alCambiar);
		};
	}, [filaMontada]);
	const compromisos = (0, import_react.useMemo)(() => ({
		...datos.compromisosOmision,
		...fechas
	}), [datos.compromisosOmision, fechas]);
	const linkVideo = link ?? (plantillaId === "ya_publique" || plantillaId === "ya_tengo_video" ? datos.linkOmision[plantillaId] : null);
	const fechaAnterior = (0, import_react.useMemo)(() => {
		let f = null;
		for (const m of datos.muestras) if (m.avisos.promesa !== null && (f === null || m.avisos.promesa > f)) f = m.avisos.promesa;
		return f;
	}, [datos.muestras]);
	const resuelto = (0, import_react.useMemo)(() => {
		if (!plantilla) return null;
		return resolverPlantilla(plantilla, {
			tienda: {
				nombre: datos.tienda.nombre,
				es_socio: datos.tienda.es_socio
			},
			muestras: datos.muestras,
			compromisos,
			fecha_anterior: fechaAnterior,
			link_video: linkVideo,
			problema_envio: datos.problemaEnvio,
			firma: datos.firma
		});
	}, [
		plantilla,
		datos.tienda,
		datos.muestras,
		compromisos,
		fechaAnterior,
		linkVideo,
		datos.problemaEnvio,
		datos.firma
	]);
	const elegirPlantilla = (id) => {
		setPlantillaId(id);
		setEditado(null);
		setEditando(false);
	};
	const texto = editado ?? resuelto?.texto ?? "";
	const faltantes = editado !== null ? [] : resuelto?.faltantes ?? [];
	const puedeCopiar = texto.trim() !== "" && (editado !== null ? !VARIABLE.test(editado) : resuelto?.puede_copiar === true);
	const pendienteConfirmar = avisoCopiado ?? datos.copiadoPendiente;
	const mostrarConfirmar = pendienteConfirmar !== null && !ocultarConfirmar && pendienteConfirmar.marcado_enviado_at === null;
	const nombreDeSolicitud = (id) => {
		const m = datos.muestras.find((x) => x.application_id === id);
		return m ? nombreDe(m.producto) : id;
	};
	const fijarFecha = (id, fecha) => {
		setFechas((f) => ({
			...f,
			[id]: fecha
		}));
		setCambiarFecha(null);
		const m = datos.muestras.find((x) => x.application_id === id);
		if (m && m.avance.fecha_planeada === null && m.avance.etapa === "por_planear") {
			const dia = sumarDias(fecha, -2);
			setAgendar({
				m,
				fecha: dia < hoyLocal() ? hoyLocal() : dia
			});
		}
	};
	const compromisosDeAviso = () => {
		const salida = {};
		if (!plantilla || !usaFecha(plantilla.cuerpo)) return salida;
		for (const m of datos.muestras) {
			const f = compromisos[m.application_id];
			if (f !== void 0) salida[m.application_id] = f;
		}
		return salida;
	};
	const registrarCopia = async () => {
		if (!plantillaId) return null;
		const previo = avisoCopiado ?? datos.copiadoPendiente;
		if (previo && previo.marcado_enviado_at === null) return (await acciones.editarAviso(previo.id, {
			texto,
			compromisos: compromisosDeAviso(),
			rev: previo.rev
		})).objeto ?? previo;
		const r = await acciones.crearAviso({
			id: nuevoId(),
			tienda_key: p.tiendaKey,
			solicitud_ids: [...p.solicitudes],
			plantilla_id: plantillaId,
			texto,
			compromisos: compromisosDeAviso(),
			origen: "copiado",
			copiado_at: ahoraS(),
			fecha_anterior: plantillaId === "nueva_fecha" ? fechaAnterior : null
		});
		if (r.estado === "error") {
			toast.mostrar({
				texto: r.error?.mensaje ?? T$1.errorGenerico,
				tono: "error"
			});
			return null;
		}
		return r.objeto;
	};
	const copiar = async (modo) => {
		if (!puedeCopiar) return;
		setOcupado(true);
		if (!(modo === "compartir" ? await compartirTexto(texto) : await copiarTexto(texto))) {
			setOcupado(false);
			if (modo !== "compartir") toast.mostrar({
				texto: T$1.toastNoCopiado,
				tono: "error"
			});
			return;
		}
		const aviso = await registrarCopia();
		setOcupado(false);
		if (aviso) {
			setAvisoCopiado(aviso);
			setOcultarConfirmar(false);
			p.alCopiar?.(aviso);
		}
		if (modo === "tiktok") abrirTikTok(datos.enlaceProducto ?? void 0);
		if (modo !== "compartir") toast.mostrar({
			texto: T$1.toastMensajeCopiado,
			detalle: T$1.toastMensajeCopiadoDetalle,
			tono: "ok",
			...android && modo === "copiar" ? { accion: {
				etiqueta: T$1.toastAbrirTikTok,
				alPulsar: () => void abrirTikTok(datos.enlaceProducto ?? void 0)
			} } : {}
		});
	};
	const avisarRegistrado = (r) => {
		if (r.estado === "conflicto") {
			toast.mostrar({
				texto: T$1.conflicto,
				tono: "info"
			});
			return;
		}
		if (r.estado === "error") {
			toast.mostrar({
				texto: r.error?.mensaje ?? T$1.errorGenerico,
				tono: "error"
			});
			return;
		}
		toast.mostrar({
			texto: T$1.toastAvisoRegistrado,
			tono: "ok",
			...r.estado === "en_cola" ? { detalle: T$1.enCola } : {},
			accion: {
				etiqueta: T$1.deshacer,
				alPulsar: () => void r.deshacer()
			},
			duracion_ms: 6e3
		});
		if (r.objeto) p.alRegistrar?.(r.objeto);
	};
	const confirmarEnvio = async () => {
		const aviso = pendienteConfirmar;
		if (!aviso) return;
		setOcupado(true);
		const r = await acciones.editarAviso(aviso.id, {
			marcado_enviado_at: ahoraS(),
			rev: aviso.rev
		});
		setOcupado(false);
		setAvisoCopiado(null);
		setOcultarConfirmar(true);
		avisarRegistrado(r);
	};
	const quitarAviso = async (a) => {
		const r = await acciones.editarAviso(a.id, {
			quitado_at: ahoraS(),
			rev: a.rev
		});
		if (r.estado === "aplicada" || r.estado === "en_cola") toast.mostrar({
			texto: T$1.toastAvisoQuitado,
			tono: "ok",
			accion: {
				etiqueta: T$1.deshacer,
				alPulsar: () => void r.deshacer()
			},
			duracion_ms: 6e3
		});
		else toast.mostrar({
			texto: r.estado === "conflicto" ? T$1.conflicto : r.error?.mensaje ?? T$1.errorGenerico,
			tono: r.estado === "conflicto" ? "info" : "error"
		});
	};
	if (datos.cargando || plantilla === null && datos.errorTexto === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(EditorMensaje_module_default.editor, p.className),
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: comun_module_default.lector,
				children: T$1.cargandoMensaje
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 1,
				ancho: "60%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				alto: 140
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 1,
				ancho: "40%"
			})
		]
	});
	if (plantilla === null || resuelto === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx$1(EditorMensaje_module_default.editor, p.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: comun_module_default.avisoCritico,
			role: "alert",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "CircleAlert",
				tamano: 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: datos.errorTexto ?? T$1.necesitaPc })]
		})
	});
	const enviados = p.modo === "dialogo" ? datos.avisos.filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null && (p.solicitudes.length === 0 || a.solicitud_ids.some((s) => p.solicitudes.includes(s)))) : [];
	const conFecha = usaFecha(plantilla.cuerpo);
	const idsConFecha = datos.muestras.map((m) => m.application_id).filter((id) => compromisos[id] !== void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(EditorMensaje_module_default.editor, p.modo === "avisar" && EditorMensaje_module_default.modoAvisar, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: filaPlantillas,
				className: EditorMensaje_module_default.plantillas,
				role: "radiogroup",
				"aria-label": T$1.plantilla,
				children: datos.plantillas.map((pl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "radio",
					"aria-checked": pl.id === plantillaId,
					className: cx$1(EditorMensaje_module_default.plantilla, pl.id === plantillaId && EditorMensaje_module_default.plantillaActiva),
					onClick: () => elegirPlantilla(pl.id),
					children: [
						pl.id === datos.sugerida ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Sparkles",
							tamano: 14
						}) : null,
						pl.nombre || NOMBRE_PLANTILLA[pl.id] || pl.id,
						pl.id === datos.sugerida ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: comun_module_default.lector,
							children: T$1.sugeridaLector
						}) : null
					]
				}, pl.id))
			}),
			conFecha && idsConFecha.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.lePrometes,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: EditorMensaje_module_default.rotulo,
					children: T$1.lePrometes
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: EditorMensaje_module_default.listaFechas,
					children: idsConFecha.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: EditorMensaje_module_default.filaFecha,
						children: [
							datos.muestras.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: EditorMensaje_module_default.fechaNombre,
								children: nombreDeSolicitud(id)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: EditorMensaje_module_default.fechaValor,
								onClick: () => setCambiarFecha((x) => x === id ? null : id),
								"aria-expanded": cambiarFecha === id,
								"aria-label": T$1.fechaPrometidaCambiar(formato.fechaConDia(compromisos[id] ?? "")),
								children: [formato.fechaConDia(compromisos[id] ?? ""), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "Pencil",
									tamano: 14
								})]
							}),
							cambiarFecha === id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
								etiqueta: T$1.fechaPrometida,
								valor: compromisos[id] ?? null,
								min: hoyLocal(),
								alCambiar: (f) => fijarFecha(id, f)
							}) : null
						]
					}, id))
				})]
			}) : null,
			faltantes.map((f) => {
				if (f.tipo === "link_video") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.aviso,
					role: "status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Link",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: EditorMensaje_module_default.faltaCuerpo,
						ref: campoLink,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: T$1.agregaEnlace }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
								etiqueta: T$1.pegaEnlace,
								etiquetaOculta: true,
								tipo: "url",
								valor: link ?? "",
								alCambiar: (v) => {
									setLink(v);
									setEditado(null);
								},
								placeholder: T$1.placeholderEnlace
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "secundario",
								tamano: "sm",
								icono: "Link",
								alPulsar: () => campoLink.current?.querySelector("input")?.focus(),
								children: T$1.pegarEnlace
							})
						]
					})]
				}, "link");
				const n = f.solicitudes.length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.aviso,
					role: "status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarClock",
						tamano: 18
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: EditorMensaje_module_default.faltaCuerpo,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: f.tipo === "plan" ? T$1.planeaAntesDeCopiar(formato.numero(n), n === 1) : T$1.eligeFecha }),
							f.solicitudes.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsFecha, {
								...datos.muestras.length > 1 ? { nombre: nombreDeSolicitud(id) } : {},
								alElegir: (fecha) => fijarFecha(id, fecha)
							}, id)),
							f.tipo === "plan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
								variante: "secundario",
								tamano: "sm",
								icono: "CalendarDays",
								alPulsar: () => {
									const m = datos.muestras.find((x) => x.application_id === f.solicitudes[0]);
									if (m) control.planear(m);
								},
								children: T$1.planear
							}) : null
						]
					})]
				}, f.tipo);
			}),
			agendar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: comun_module_default.avisoInfo,
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CalendarCheck",
					tamano: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: EditorMensaje_module_default.faltaCuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						T$1.loAgendamosAntes,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaConDia(agendar.fecha) }),
						"?"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: comun_module_default.botones,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							alPulsar: () => {
								const a = agendar;
								setAgendar(null);
								control.planear(a.m, a.fecha);
							},
							children: T$1.siAgendar
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							alPulsar: () => setAgendar(null),
							children: T$1.noPorAhora
						})]
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.marco,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: EditorMensaje_module_default.marcoCabeza,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: EditorMensaje_module_default.rotulo,
							children: T$1.vistaPrevia
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: EditorMensaje_module_default.contador,
							"aria-live": "polite",
							children: [
								formato.numero(Array.from(texto).length),
								" ",
								T$1.caracteres
							]
						})]
					}),
					editando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTexto, {
						etiqueta: T$1.textoMensaje,
						etiquetaOculta: true,
						valor: texto,
						alCambiar: (v) => setEditado(v),
						filas: 8,
						autoFoco: true,
						className: cx$1(EditorMensaje_module_default.area)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaPrevia, { mensaje: editado !== null ? {
						texto: editado,
						resaltados: []
					} : resuelto }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: EditorMensaje_module_default.marcoPie,
						children: editado !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: EditorMensaje_module_default.editadoNota,
							children: T$1.mensajeEditado
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: comun_module_default.enlaceSuave,
							onClick: () => {
								setEditado(null);
								setEditando(false);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "RotateCcw",
									tamano: 14
								}),
								" ",
								T$1.restablecer
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: comun_module_default.enlaceSuave,
							onClick: () => setEditando((v) => !v),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "Pencil",
									tamano: 14
								}),
								" ",
								editando ? T$1.verVistaPrevia : T$1.editarTexto
							]
						})
					})
				]
			}),
			mostrarConfirmar && pendienteConfirmar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.confirmar,
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: EditorMensaje_module_default.confirmarTexto,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "MessageCircleWarning",
							tamano: 18
						}),
						" ",
						T$1.yaSeLoEnviaste
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: comun_module_default.botones,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "sm",
						icono: "Check",
						cargando: ocupado,
						alPulsar: () => void confirmarEnvio(),
						children: p.modo === "avisar" ? T$1.siSiguiente : T$1.siYaSeLoEnvie
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						alPulsar: () => setOcultarConfirmar(true),
						children: T$1.todaviaNo
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.acciones,
				children: [android ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					icono: "Copy",
					anchoCompleto: true,
					deshabilitado: !puedeCopiar,
					cargando: ocupado,
					alPulsar: () => void copiar("tiktok"),
					children: T$1.copiarYAbrir
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: EditorMensaje_module_default.accionesFila,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						icono: "Share2",
						deshabilitado: !puedeCopiar,
						alPulsar: () => void copiar("compartir"),
						children: T$1.compartir
					}), datos.enlaceProducto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						icono: "ExternalLink",
						alPulsar: () => void abrirExterno(datos.enlaceProducto ?? ""),
						children: textoAbrirFuera(true)
					}) : null]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: EditorMensaje_module_default.accionesFila,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "Copy",
						deshabilitado: !puedeCopiar,
						cargando: ocupado,
						atajo: "Enter",
						alPulsar: () => void copiar("copiar"),
						children: T$1.copiarMensaje
					}), datos.enlaceProducto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						icono: "ExternalLink",
						alPulsar: () => void abrirExterno(datos.enlaceProducto ?? ""),
						children: textoAbrirFuera(false)
					}) : null]
				}), !puedeCopiar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: EditorMensaje_module_default.ayudaCopiar,
					children: T$1.completaLoQueFalta
				}) : null]
			}),
			porMiCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PorMiCuenta, {
				plantillas: datos.plantillas,
				sugerida: plantillaId ?? datos.sugerida,
				alCancelar: () => setPorMiCuenta(false),
				alRegistrar: async (id, fecha) => {
					const compromisosCuenta = {};
					if (fecha) for (const s of p.solicitudes) compromisosCuenta[s] = fecha;
					const r = await acciones.crearAviso({
						id: nuevoId(),
						tienda_key: p.tiendaKey,
						solicitud_ids: [...p.solicitudes],
						plantilla_id: id,
						texto: "",
						compromisos: compromisosCuenta,
						origen: "por_mi_cuenta",
						marcado_enviado_at: ahoraS()
					});
					setPorMiCuenta(false);
					avisarRegistrado(r);
				}
			}) : null,
			enviados.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: EditorMensaje_module_default.enviados,
				"aria-label": T$1.avisosEnviados,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: EditorMensaje_module_default.rotulo,
					children: T$1.avisosEnviados
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: EditorMensaje_module_default.listaEnviados,
					children: enviados.map((a) => {
						const fechasA = Object.values(a.compromisos).sort();
						const promesa = fechasA[fechasA.length - 1];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: EditorMensaje_module_default.enviado,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: EditorMensaje_module_default.enviadoTexto,
								children: [
									formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at),
									" · ",
									datos.plantillas.find((x) => x.id === a.plantilla_id)?.nombre ?? NOMBRE_PLANTILLA[a.plantilla_id] ?? T$1.otroMensaje,
									promesa ? ` · ${T$1.lePrometisteEl} ${formato.fechaConDia(promesa)}` : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								etiqueta: `${T$1.accionesDelAviso} ${formato.fechaCorta(a.marcado_enviado_at ?? a.creado_at)}`,
								opciones: [{
									id: "quitar",
									etiqueta: T$1.quitarAviso,
									icono: "Trash2",
									peligro: true,
									alPulsar: () => void quitarAviso(a)
								}]
							})]
						}, a.id);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: EditorMensaje_module_default.pie,
				children: [!porMiCuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: comun_module_default.enlace,
					onClick: () => setPorMiCuenta(true),
					children: p.modo === "avisar" ? T$1.yaLeEscribiCorto : T$1.yaLeEscribi
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: EditorMensaje_module_default.pieDerecha,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: comun_module_default.enlaceSuave,
						onClick: () => navegar("/ajustes/ayuda"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "CircleHelp",
								tamano: 14
							}),
							" ",
							T$1.dondePego
						]
					}), p.modo === "dialogo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: comun_module_default.enlaceSuave,
						onClick: () => navegar("/ajustes/plantillas"),
						children: T$1.editarPlantillas
					}) : null]
				})]
			})
		]
	});
}
function PorMiCuenta(p) {
	const [elegida, setElegida] = (0, import_react.useState)(p.sugerida);
	const [fecha, setFecha] = (0, import_react.useState)(null);
	const [calendario, setCalendario] = (0, import_react.useState)(false);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	const opciones = [...p.plantillas.map((x) => ({
		id: x.id,
		nombre: x.nombre
	})), {
		id: "otro",
		nombre: T$1.otroMensaje
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: EditorMensaje_module_default.porMiCuenta,
		"aria-label": T$1.yaLeEscribi,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: EditorMensaje_module_default.rotulo,
				children: T$1.queLeDijiste
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: EditorMensaje_module_default.plantillas,
				role: "radiogroup",
				"aria-label": T$1.queLeDijiste,
				children: opciones.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "radio",
					"aria-checked": o.id === elegida,
					className: cx$1(EditorMensaje_module_default.plantilla, o.id === elegida && EditorMensaje_module_default.plantillaActiva),
					onClick: () => setElegida(o.id),
					children: o.nombre
				}, o.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EditorMensaje_module_default.filaFecha,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: EditorMensaje_module_default.fechaNombre,
					children: [
						T$1.fechaPrometida,
						" ",
						T$1.opcional
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: EditorMensaje_module_default.fechaValor,
					"aria-expanded": calendario,
					onClick: () => setCalendario((v) => !v),
					children: [fecha ? formato.fechaConDia(fecha) : T$1.sinFecha, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CalendarDays",
						tamano: 14
					})]
				})]
			}),
			calendario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
				etiqueta: T$1.fechaPrometida,
				valor: fecha,
				min: hoyLocal(),
				alCambiar: (f) => {
					setFecha(f);
					setCalendario(false);
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: comun_module_default.pie,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					alPulsar: p.alCancelar,
					children: T$1.cancelar
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "sm",
					icono: "Check",
					cargando: ocupado,
					alPulsar: () => {
						setOcupado(true);
						p.alRegistrar(elegida, fecha).finally(() => setOcupado(false));
					},
					children: T$1.registrarAviso
				})]
			})
		]
	});
}
/**
* Convivencia de la banda fija «¿Le enviaste el mensaje a {tienda}?» (TarjetaConfirmarAviso, 01 §3.5) con el resto de
* la app:
*   · no sale en las rutas a pantalla completa (bienvenida y emparejar): ahí no hay nada que confirmar todavía y
*     tapaba el botón «Conectar»;
*   · mientras se ve, declara su alto en --avisos-extra (en el celular y en ventanas de menos de 600, los avisos de
*     @/componentes suben sobre ella en vez de encimarse; tokens de Toasts.module.css);
*   · si un aviso u otra capa global anclada abajo (marca común `data-capa-corte`, fuera de diálogos, menús y tooltips)
*     cae encima de ella —Windows angosto, donde la banda y los avisos se acercan—, la banda sube lo justo (--subir).
*/
/** Rutas a pantalla completa donde la banda no se muestra (tabla de rutas de BUILD_SPEC §8.6: `completa`). */
var RUTAS_SIN_BANDA = ["/bienvenida", "/emparejar"];
function rutaSinBanda(ruta) {
	return RUTAS_SIN_BANDA.some((r) => ruta === r || ruta.startsWith(`${r}/`));
}
/** Capas que tapan a propósito o que flotan junto a un elemento (no empujan a la banda). */
var NO_EMPUJAN = "[role=\"dialog\"], [role=\"alertdialog\"], [role=\"menu\"], [role=\"tooltip\"], [role=\"listbox\"]";
/**
* Cuánto (px) debe subir `banda` (medida en reposo) para no quedar debajo de otra capa fija anclada abajo. 0 si nada la
* tapa. Se exporta para las pruebas.
*/
function subidaContra(banda, capas, altoVentana) {
	let subir = 0;
	for (const c of capas) {
		if (c.width < 1 || c.height < 1) continue;
		if (c.height > altoVentana * .5) continue;
		if (c.bottom < altoVentana - 200) continue;
		const horizontal = c.left < banda.right && c.right > banda.left;
		const vertical = c.top < banda.bottom - 1 && c.bottom > banda.top + 1;
		if (horizontal && vertical) subir = Math.max(subir, Math.ceil(banda.bottom - c.top + 8));
	}
	return subir;
}
function capasQueEmpujan(propia) {
	const salida = [];
	for (const capa of document.querySelectorAll("[data-capa-corte]")) {
		if (capa === propia || capa.contains(propia) || propia.contains(capa)) continue;
		if (capa.matches(NO_EMPUJAN) || capa.querySelector(NO_EMPUJAN)) continue;
		const s = getComputedStyle(capa);
		if (s.position !== "fixed" || s.display === "none" || s.visibility === "hidden") continue;
		salida.push(capa.getBoundingClientRect());
	}
	return salida;
}
/** Aplica --avisos-extra (en <html>) y --subir (en la banda) mientras `banda` está montada y `activa`. */
function useConvivenciaBanda(banda, activa) {
	(0, import_react.useEffect)(() => {
		if (!banda || !activa || typeof window === "undefined") return void 0;
		const raiz = document.documentElement;
		let cuadro = 0;
		const medir = () => {
			cuadro = 0;
			const aplicada = Number.parseFloat(banda.style.getPropertyValue("--subir")) || 0;
			const r = banda.getBoundingClientRect();
			if (r.height > 0) raiz.style.setProperty("--avisos-extra", `${Math.ceil(r.height + 8)}px`);
			const subir = subidaContra({
				top: r.top + aplicada,
				bottom: r.bottom + aplicada,
				left: r.left,
				right: r.right
			}, capasQueEmpujan(banda), window.innerHeight);
			if (subir !== aplicada) banda.style.setProperty("--subir", `${subir}px`);
		};
		const pedir = () => {
			if (!cuadro) cuadro = window.requestAnimationFrame(medir);
		};
		medir();
		const mutaciones = typeof MutationObserver === "undefined" ? null : new MutationObserver(pedir);
		mutaciones?.observe(document.body, {
			childList: true,
			subtree: true
		});
		const tamano = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(pedir);
		tamano?.observe(banda);
		window.addEventListener("resize", pedir);
		document.addEventListener("animationend", pedir, true);
		document.addEventListener("transitionend", pedir, true);
		return () => {
			mutaciones?.disconnect();
			tamano?.disconnect();
			window.removeEventListener("resize", pedir);
			document.removeEventListener("animationend", pedir, true);
			document.removeEventListener("transitionend", pedir, true);
			if (cuadro) window.cancelAnimationFrame(cuadro);
			raiz.style.removeProperty("--avisos-extra");
			banda.style.removeProperty("--subir");
		};
	}, [banda, activa]);
}
var DialogoMensaje_module_default = {
	cuerpo: "_cuerpo_21zto_1",
	subtitulo: "_subtitulo_21zto_7",
	pregunta: "_pregunta_21zto_13",
	banda: "_banda_21zto_27",
	entra: "_entra_21zto_1",
	android: "_android_21zto_53",
	contenido: "_contenido_21zto_68",
	icono: "_icono_21zto_80",
	texto: "_texto_21zto_90",
	titulo: "_titulo_21zto_102",
	detalle: "_detalle_21zto_116",
	botones: "_botones_21zto_124",
	minimizar: "_minimizar_21zto_132",
	minimizada: "_minimizada_21zto_177",
	pastilla: "_pastilla_21zto_191",
	pastillaIcono: "_pastillaIcono_21zto_226",
	pastillaTexto: "_pastillaTexto_21zto_236",
	reserva: "_reserva_21zto_248",
	reservaAndroid: "_reservaAndroid_21zto_257",
	enLinea: "_enLinea_21zto_262"
};
/**
* DialogoMensaje (01 §4.8): lo abre ?mensaje=<application_id> o ?mensaje=t:<tienda_key> (y ?plantilla=<id>). Windows:
* diálogo de 560 «Mensaje para {tienda}»; Android: hoja inferior que se expande al editar. Si la tienda tiene 2 o más
* pendientes: «{tienda} tiene {2} muestras pendientes. ¿Un solo mensaje para las dos?» [Sí, un mensaje] [Solo esta].
* TarjetaConfirmarAviso (01 §3.5): banda fija «¿Le enviaste el mensaje a {tienda}?» al volver la app al frente
* (compacta, minimizable y fuera de bienvenida y emparejar; ver TarjetaConfirmarAvisoBase y capaConfirmar.ts).
*/
var SIETE_DIAS = 604800;
/** Destino de ?mensaje=: una solicitud o una tienda («t:<tienda_key>»). */
function leerDestinoMensaje(valor) {
	if (valor === null || valor.trim() === "") return null;
	return valor.startsWith("t:") ? { tienda: valor.slice(2) } : { solicitud: valor };
}
function contarPalabra(n) {
	return n === 2 ? T$1.lasDos : T$1.lasN(formato.numero(n));
}
function DialogoMensaje() {
	const ruta = useRuta();
	const destino = leerDestinoMensaje(ruta.consulta.get("mensaje"));
	const plantilla = ruta.consulta.get("plantilla");
	if (destino === null) return null;
	const clave = "solicitud" in destino ? `s:${destino.solicitud}` : `t:${destino.tienda}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoAbierto, {
		destino,
		plantilla
	}, clave);
}
function DialogoAbierto(p) {
	const android = useEsAndroid();
	const id = "solicitud" in p.destino ? p.destino.solicitud : null;
	const detalle = useConsulta("muestra", { id: id ?? "" }, { activa: id !== null });
	const tiendaKey = "tienda" in p.destino ? p.destino.tienda : detalle.datos?.muestra.tienda.tienda_key ?? null;
	const deTienda = useConsulta("muestras", { tienda: tiendaKey ?? "" }, { activa: tiendaKey !== null });
	const [juntas, setJuntas] = (0, import_react.useState)(null);
	const pendientes = (0, import_react.useMemo)(() => (deTienda.datos?.items ?? []).filter((m) => esPendiente(m) && m.tienda.tienda_key === tiendaKey), [deTienda.datos, tiendaKey]);
	const nombreTienda = detalle.datos?.muestra.tienda.nombre ?? pendientes[0]?.tienda.nombre ?? deTienda.datos?.items[0]?.tienda.nombre ?? "";
	const otras = id !== null ? pendientes.filter((m) => m.application_id !== id) : [];
	const solicitudes = id === null ? pendientes.map((m) => m.application_id) : juntas ? [id, ...otras.map((m) => m.application_id)] : [id];
	const titulo = nombreTienda ? T$1.mensajePara(nombreTienda) : T$1.mensajeParaLaTienda;
	const listo = tiendaKey !== null && (id === null ? !deTienda.cargando : true);
	const cuerpo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: DialogoMensaje_module_default.cuerpo,
		children: [
			android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: DialogoMensaje_module_default.subtitulo,
				children: T$1.subtituloMensaje
			}) : null,
			id !== null && otras.length > 0 && juntas === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: comun_module_default.avisoInfo,
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Store",
					tamano: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: DialogoMensaje_module_default.pregunta,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.variasPendientesTienda(nombreTienda ?? "", formato.numero(otras.length + 1), contarPalabra(otras.length + 1)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: comun_module_default.botones,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							alPulsar: () => setJuntas(true),
							children: T$1.siUnMensaje
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							alPulsar: () => setJuntas(false),
							children: T$1.soloEsta
						})]
					})]
				})]
			}) : null,
			listo && tiendaKey !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorMensaje, {
				tiendaKey,
				solicitudes,
				modo: "dialogo",
				...p.plantilla ? { plantillaInicial: p.plantilla } : juntas ? { plantillaInicial: "varias_muestras" } : {},
				alRegistrar: () => cerrarMensaje()
			}, solicitudes.join(",")) : detalle.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: comun_module_default.avisoCritico,
				role: "alert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CircleAlert",
					tamano: 18
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detalle.error.mensaje })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: DialogoMensaje_module_default.subtitulo,
				children: T$1.cargandoMensaje
			})
		]
	});
	return android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
		abierta: true,
		titulo,
		alCerrar: cerrarMensaje,
		anclas: [.92, .96],
		children: cuerpo
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: true,
		titulo,
		descripcion: T$1.subtituloMensaje,
		ancho: 560,
		completoEnCompacta: true,
		alCerrar: cerrarMensaje,
		children: cuerpo
	});
}
/** Aviso copiado y sin confirmar más reciente (menos de 7 días). */
function avisoPorConfirmar(avisos, ahora = ahoraS()) {
	return avisos.filter((a) => a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS).sort((a, b) => (b.copiado_at ?? 0) - (a.copiado_at ?? 0))[0] ?? null;
}
var suprimida = false;
var oyentesSupresion = /* @__PURE__ */ new Set();
function useSuprimida() {
	return (0, import_react.useSyncExternalStore)((fn) => {
		oyentesSupresion.add(fn);
		return () => {
			oyentesSupresion.delete(fn);
		};
	}, () => suprimida, () => false);
}
function TarjetaConfirmarAviso() {
	return useSuprimida() ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaConfirmarAvisoBase, { enLinea: false });
}
/** «Minimizada» al montar (la galería la muestra así); se marca con este valor hasta que se expande. */
var MINIMIZADA_AL_MONTAR = "*";
/**
* Banda compacta de confirmación (01 §3.5; revisión del coordinador del 15 nov: la tarjeta de 4 renglones tapaba ~20 %
* del celular y salía también en Emparejar):
*   · Windows ≥ 900: UNA línea abajo a la derecha —ícono, pregunta (con «Lo copiaste hace… · plantilla» si cabe),
*     [Sí, ya se lo envié] [Todavía no] y ⌄—, 48 px de alto; los avisos van abajo a la izquierda.
*   · Celular y ventanas de menos de 900: pregunta en un renglón y los botones debajo, ≈ 64 px; en el celular, encima de
*     la barra inferior, y los avisos suben sobre ella (--avisos-extra).
*   · ⌄ la minimiza a una pastilla con el nombre de la tienda (a la izquierda en el celular, para no tapar el botón
*     flotante de Muestras); al volver la app al frente se expande otra vez.
*   · No sale en bienvenida ni en emparejar, ni mientras está abierto el diálogo del mensaje (?mensaje=).
*/
function TarjetaConfirmarAvisoBase(p) {
	const ruta = useRuta();
	const avisos = useConsulta("avisos", {});
	const pendientes = useConsulta("muestras", PARAMS_PENDIENTES$1);
	const acciones = useAcciones();
	const toast = useToast();
	const android = useEsAndroid();
	const compacta = useClaseAncho() === "compacta";
	const [ocultos, setOcultos] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [minimizado, setMinimizado] = (0, import_react.useState)(p.minimizadaInicial ? MINIMIZADA_AL_MONTAR : null);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	const [banda, setBanda] = (0, import_react.useState)(null);
	const enfocar = (0, import_react.useRef)(null);
	const [corte, setCorte] = (0, import_react.useState)(() => ahoraS());
	(0, import_react.useEffect)(() => alVolverAlFrente(() => {
		setOcultos(/* @__PURE__ */ new Set());
		setMinimizado(null);
		setCorte(ahoraS());
	}), []);
	const aviso = avisoPorConfirmar((avisos.datos?.items ?? []).filter((a) => a.copiado_at !== null && a.copiado_at < corte));
	const tiendaFila = aviso ? (pendientes.datos?.items ?? []).find((m) => m.tienda.tienda_key === aviso.tienda_key)?.tienda : void 0;
	const sinNombre = aviso !== null && tiendaFila === void 0;
	const tienda = useConsulta("tienda", { key: aviso?.tienda_key ?? "" }, { activa: sinNombre });
	const nombre = tiendaFila?.nombre ?? tienda.datos?.tienda.nombre ?? null;
	const visible = aviso !== null && nombre !== null && !ocultos.has(aviso.id) && (p.enLinea || !ruta.consulta.has("mensaje") && !rutaSinBanda(ruta.ruta));
	const minimizada = visible && (minimizado === MINIMIZADA_AL_MONTAR || minimizado === aviso?.id);
	useConvivenciaBanda(banda, visible && !p.enLinea);
	(0, import_react.useEffect)(() => {
		if (!banda || enfocar.current === null) return;
		const destino = enfocar.current === "pastilla" ? banda.querySelector("[aria-expanded]") : banda.querySelector("button");
		enfocar.current = null;
		destino?.focus();
	}, [banda, minimizada]);
	if (!visible || aviso === null || nombre === null) return null;
	const titulo = T$1.confirmarAvisoTitulo(nombre);
	const fija = p.enLinea ? {} : { "data-capa-corte": "" };
	const clases = (extra) => cx$1(DialogoMensaje_module_default.banda, android && DialogoMensaje_module_default.android, p.enLinea && DialogoMensaje_module_default.enLinea, extra);
	const reserva = p.enLinea ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx$1(DialogoMensaje_module_default.reserva, android && DialogoMensaje_module_default.reservaAndroid),
		"aria-hidden": "true",
		"data-reserva-confirmar": ""
	});
	if (minimizada) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		ref: setBanda,
		className: clases(DialogoMensaje_module_default.minimizada),
		role: "region",
		"aria-label": titulo,
		...fija,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: DialogoMensaje_module_default.pastilla,
			"aria-expanded": false,
			"aria-label": T$1.verConfirmarAviso(nombre),
			title: android ? void 0 : T$1.verConfirmarAviso(nombre),
			onClick: () => {
				enfocar.current = "banda";
				setMinimizado(null);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: DialogoMensaje_module_default.pastillaIcono,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "MessageCircleWarning",
					tamano: 16
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: DialogoMensaje_module_default.pastillaTexto,
				children: nombre
			})]
		})
	}), reserva] });
	const confirmar = async () => {
		setOcupado(true);
		const r = await acciones.editarAviso(aviso.id, {
			marcado_enviado_at: ahoraS(),
			rev: aviso.rev
		});
		setOcupado(false);
		if (r.estado === "conflicto") toast.mostrar({
			texto: T$1.conflicto,
			tono: "info"
		});
		else if (r.estado === "error") toast.mostrar({
			texto: r.error?.mensaje ?? T$1.errorGenerico,
			tono: "error"
		});
		else toast.mostrar({
			texto: T$1.toastAvisoRegistrado,
			tono: "ok",
			...r.estado === "en_cola" ? { detalle: T$1.enCola } : {},
			accion: {
				etiqueta: T$1.deshacer,
				alPulsar: () => void r.deshacer()
			},
			duracion_ms: 6e3
		});
	};
	const detalle = `${T$1.loCopiaste(formato.relativa(aviso.copiado_at ?? aviso.creado_at))} · ${NOMBRE_PLANTILLA[aviso.plantilla_id] ?? T$1.otroMensaje}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		ref: setBanda,
		className: clases(),
		role: "region",
		"aria-label": titulo,
		...fija,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: DialogoMensaje_module_default.contenido,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: DialogoMensaje_module_default.icono,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "MessageCircleWarning",
						tamano: 16
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: DialogoMensaje_module_default.texto,
					title: android ? void 0 : `${titulo} · ${detalle}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: DialogoMensaje_module_default.titulo,
						children: titulo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: DialogoMensaje_module_default.detalle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: " · "
						}), detalle]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: DialogoMensaje_module_default.botones,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "primario",
							tamano: "sm",
							...android || compacta ? {} : { icono: "Check" },
							cargando: ocupado,
							alPulsar: () => void confirmar(),
							children: T$1.siYaSeLoEnvie
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							alPulsar: () => setOcultos((s) => /* @__PURE__ */ new Set([...s, aviso.id])),
							children: T$1.todaviaNo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "ChevronDown",
							tamano: "sm",
							etiqueta: T$1.minimizarConfirmarAviso,
							className: cx$1(DialogoMensaje_module_default.minimizar),
							alPulsar: () => {
								enfocar.current = "pastilla";
								setMinimizado(aviso.id);
							}
						})
					]
				})
			]
		})
	}), reserva] });
}
function ProveedorBloques(p) {
	const android = useEsAndroid();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnfitrionHojas, { children: [
		p.children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoMensaje, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaConfirmarAviso, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoMuestraNueva, {}),
		!android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoSolicitudEmparejamiento, {}) : null,
		!android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoCierre, {}) : null
	] });
}
/**
* Botones de una muestra: acción principal de la etapa (01 §2.4, tecla E), «Guardar imagen del producto» y «Copiar
* datos para tu guion» (01 §4.3 «Para tu video»). Nunca hablan con la red: usan useControlMuestra y @/plataforma.
*/
var ICONO_ACCION = {
	planear: "CalendarDays",
	marcar_publicada: "CircleCheckBig",
	video_listo: "Clapperboard",
	marcar_programada: "CalendarClock",
	avisar: "MessageCircle",
	cambiar_fecha: "CalendarDays"
};
/** Acción principal visible de la muestra (null si la muestra no admite etapas). */
function useAccionPrincipal(m) {
	const prefs = usePreferencias();
	return accionPrincipal(m, prefs.programo_mis_videos);
}
function BotonAccionMuestra(p) {
	const control = useControlMuestra();
	const accion = useAccionPrincipal(p.muestra);
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	if (accion === null) return null;
	const principal = p.anchoCompleto === true || p.tamano === "lg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: principal ? "primario" : "secundario",
		tamano: p.tamano ?? "md",
		anchoCompleto: p.anchoCompleto ?? false,
		cargando: ocupado,
		atajo: "E",
		...principal ? { icono: ICONO_ACCION[accion] } : {},
		"aria-label": `${ETIQUETA_ACCION[accion]}: ${nombreDe(p.muestra.producto)}`,
		alPulsar: () => {
			setOcupado(true);
			control.accionPrincipal(p.muestra).finally(() => setOcupado(false));
		},
		className: cx$1(p.className),
		children: ETIQUETA_ACCION[accion]
	});
}
/** Nombre de archivo seguro: «chaqueta-casual-para-hombre». */
function nombreArchivoProducto(p) {
	return (p.titulo_corto ?? nombreCorto(p.titulo, 48)).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || `producto-${p.product_id}`;
}
/** Guarda la imagen ORIGINAL (Windows: diálogo Guardar; Android: compartir). */
function useGuardarImagen() {
	const toast = useToast();
	return (0, import_react.useCallback)(async (producto) => {
		if (!producto.imagen) return;
		const r = await guardarImagen(producto.imagen, nombreArchivoProducto(producto));
		if (r === "guardado") toast.mostrar({
			texto: T$1.toastImagenGuardada,
			tono: "ok"
		});
		else if (r === "error") toast.mostrar({
			texto: T$1.toastImagenError,
			tono: "error"
		});
	}, [toast]);
}
function BotonGuardarImagen(p) {
	const guardar = useGuardarImagen();
	const [ocupado, setOcupado] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		icono: "Download",
		atajo: "I",
		cargando: ocupado,
		deshabilitado: p.producto.imagen === null,
		alPulsar: () => {
			setOcupado(true);
			guardar(p.producto).finally(() => setOcupado(false));
		},
		className: cx$1(p.className),
		children: T$1.guardarImagen
	});
}
/** Texto de «Copiar datos para tu guion» con las notas de la muestra al final (01 §4.3). */
function textoGuionConNotas(m, notas) {
	const base = textoDatosGuion(m);
	const propias = notas.filter((n) => n.entidad === "muestra" && n.entidad_id === m.application_id && n.texto.trim() !== "");
	if (propias.length === 0) return base;
	return `${base}\n${T$1.tusNotas} ${propias.map((n) => n.texto.trim()).join(" · ")}`;
}
function useCopiarGuion(m) {
	const toast = useToast();
	return (0, import_react.useCallback)(async () => {
		let notas = [];
		try {
			notas = (await consultar("notas", {
				entidad: "muestra",
				entidad_id: m.application_id
			})).items;
		} catch {
			notas = [];
		}
		const ok = await copiarTexto(textoGuionConNotas(m, notas));
		toast.mostrar(ok ? {
			texto: T$1.toastGuionCopiado,
			detalle: T$1.toastGuionCopiadoDetalle,
			tono: "ok"
		} : {
			texto: T$1.toastGuionNoCopiado,
			tono: "error"
		});
	}, [m, toast]);
}
function BotonCopiarGuion(p) {
	const copiar = useCopiarGuion(p.muestra);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "secundario",
		icono: "Copy",
		alPulsar: () => void copiar(),
		className: cx$1(p.className),
		children: T$1.copiarGuion
	});
}
var HORAS_48 = 172800;
/** Por vencer con menos de 48 h: rojo y «Vence en {20} h» (01 §2.2, §5.5 paso 9). */
function horasParaVencer(m, ahora = ahoraS()) {
	if (m.grupo !== "por_vencer" || m.fecha_limite_at === null) return null;
	const s = m.fecha_limite_at - ahora;
	return s < HORAS_48 ? Math.max(0, Math.floor(s / 3600)) : null;
}
/** Texto del chip TikTok (también lo usa el anuncio para lectores de pantalla). */
function textoTikTok(m, conMotivo = false) {
	const horas = horasParaVencer(m);
	if (horas !== null) return horas <= 0 ? T$1.venceHoy : T$1.venceEnHoras(formato.numero(horas));
	if (m.grupo === "por_vencer" && m.fecha_limite_at !== null) return T$1.venceEl(formato.fechaConDia(m.fecha_limite_at));
	if (m.grupo === "entregada") return T$1.cumplida;
	const base = m.etiqueta || m.motivo;
	if (conMotivo && m.motivo && m.motivo !== base) return `${base} · ${m.motivo}`;
	return base;
}
/** Base de ChipTikTok. `sinPrefijo`: dentro de una columna «Estado en TikTok» el encabezado ya da el contexto. */
function ChipTikTokBase(p) {
	const m = p.muestra;
	const urgente = horasParaVencer(m) !== null;
	const tono = urgente ? "critico" : TONO_GRUPO[m.grupo];
	const icono = urgente ? "CircleAlert" : ICONO_GRUPO[m.grupo];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono,
		icono,
		...p.sinPrefijo ? {} : { prefijo: T$1.prefijoTikTok },
		titulo: m.motivo,
		className: cx$1(p.className),
		children: textoTikTok(m, p.conMotivo ?? false)
	});
}
function ChipTikTok(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTokBase, {
		muestra: p.muestra,
		...p.conMotivo !== void 0 ? { conMotivo: p.conMotivo } : {},
		...p.className ? { className: p.className } : {}
	});
}
/** «Tu avance: Planeada · vie 13 nov»: la fecha acompaña a las etapas que la tienen. */
function textoAvance(a) {
	const base = ETIQUETA_ETAPA[a.etapa];
	if (a.etapa === "planeada" && a.fecha_planeada) return `${base} · ${formato.fechaConDia(a.fecha_planeada)}`;
	if (a.etapa === "programada" && a.programada_para_at !== null) return `${base} · ${formato.fechaConDia(a.programada_para_at)}`;
	if (a.etapa === "publicada" && a.fecha_publicada) return `${base} · ${formato.fechaCorta(a.fecha_publicada)}`;
	return base;
}
/** Base de ChipAvance. `sinPrefijo`: dentro de una columna «Tu avance» el encabezado ya da el contexto. */
function ChipAvanceBase(p) {
	const a = p.avance;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipEtapa, {
		paso: PASO_ETAPA[a.etapa],
		icono: ICONO_ETAPA[a.etapa],
		...p.sinPrefijo ? {} : { prefijo: T$1.prefijoAvance },
		className: cx$1(p.className),
		children: textoAvance(a)
	});
}
function ChipAvance(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipAvanceBase, {
		avance: p.avance,
		...p.className ? { className: p.className } : {}
	});
}
/** Tono de cada razón: lo que ya vende va en verde (como el lienzo aprobado); la promesa, en azul o rojo si venció. */
function tonoRazon(r, m) {
	switch (r) {
		case "promesa": return m.avisos.promesa_vencida ? "critico" : "info";
		case "posible_video": return "marca";
		case "ya_vendes_con_esta_tienda":
		case "ya_lo_vendes": return "ok";
		default: return "neutro";
	}
}
/** Razones visibles (01 §2.6: las 2 primeras que apliquen). `sinPromesa` evita repetirla junto a ChipPromesa. */
function razonesVisibles(m, maximo, sinPromesa = false) {
	return m.razones.filter((r) => !(sinPromesa && r === "promesa")).slice(0, Math.max(0, maximo));
}
function ChipsRazonesBase(p) {
	const m = p.muestra;
	const razones = razonesVisibles(m, p.maximo ?? 2, p.sinPromesa ?? false);
	if (razones.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: razones.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: tonoRazon(r, m),
		icono: ICONO_RAZON[r],
		className: cx$1(p.className),
		children: textoRazon(r, m)
	}, r)) });
}
function ChipsRazones(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazonesBase, {
		muestra: p.muestra,
		...p.maximo !== void 0 ? { maximo: p.maximo } : {},
		...p.className ? { className: p.className } : {}
	});
}
/** «Le prometiste el {vie 20 nov}» (azul) · rojo si venció (01 §2.5). Sin promesa o ya publicada: nada. */
function ChipPromesa(p) {
	const promesa = p.avisos.promesa;
	if (promesa === null || p.etapa === "publicada" || p.etapa === "no_se_puede") return null;
	const vencida = p.avisos.promesa_vencida;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: vencida ? "critico" : "info",
		icono: "CalendarClock",
		className: cx$1(p.className),
		...vencida ? { titulo: T$1.promesaPasoTitulo } : {},
		children: T$1.lePrometisteElFecha(formato.fechaConDia(promesa))
	});
}
function ChipCopiadoSinConfirmar(p) {
	const c = p.avisos.copiado_sin_confirmar;
	if (c === null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "atencion",
		icono: "MessageCircleWarning",
		titulo: T$1.copiadoHace(formato.relativa(c.copiado_at)),
		className: cx$1(p.className),
		children: T$1.copiadoSinConfirmar
	});
}
function ChipVitrina(p) {
	if (p.enVitrina === null) return null;
	return p.enVitrina ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "ok",
		icono: "Check",
		className: cx$1(p.className),
		children: T$1.enVitrina
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: "neutro",
		icono: "Store",
		className: cx$1(p.className),
		children: T$1.noEnVitrina
	});
}
var TONO_NIVEL = {
	urgente: "critico",
	alta: "marca",
	media: "info",
	baja: "neutro",
	no_se_puede_etiquetar: "atencion"
};
var ICONO_NIVEL = {
	urgente: "CircleAlert",
	alta: "TrendingUp",
	media: "Minus",
	baja: "Minus",
	no_se_puede_etiquetar: "Ban"
};
function ChipPrioridad(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: TONO_NIVEL[p.nivel],
		icono: ICONO_NIVEL[p.nivel],
		...p.nivel === "no_se_puede_etiquetar" ? {} : { prefijo: `${T$1.prioridad}:` },
		className: cx$1(p.className),
		children: ETIQUETA_NIVEL[p.nivel]
	});
}
var ICONO_SALUD = {
	socio_con_pendientes: "Star",
	con_pendientes: "CircleAlert",
	con_plan: "CalendarCheck",
	socio: "Star",
	al_dia: "Check",
	vende_contigo: "Coins",
	solo_solicitudes: "Clock",
	solo_reembolsos: "RotateCcw"
};
/** Salud con nombre (01 §2.7); los socios llevan estrella (también «Con plan» si es socio). */
function ChipSalud(p) {
	const icono = p.esSocio && p.salud === "con_plan" ? "Star" : ICONO_SALUD[p.salud];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: TONO_SALUD[p.salud],
		icono,
		className: cx$1(p.className),
		children: ETIQUETA_SALUD[p.salud]
	});
}
var FichaPrecio_module_default = {
	compacta: "_compacta_e6yuu_2",
	cifra: "_cifra_e6yuu_10",
	rotuloLista: "_rotuloLista_e6yuu_18",
	deja: "_deja_e6yuu_23",
	sinPrecio: "_sinPrecio_e6yuu_31",
	ficha: "_ficha_e6yuu_37",
	linea: "_linea_e6yuu_43",
	cifraGrande: "_cifraGrande_e6yuu_50",
	rotulo: "_rotulo_e6yuu_18",
	lineaDeja: "_lineaDeja_e6yuu_64"
};
var ROTULO = {
	variante: T$1.precioVariante,
	vitrina: T$1.precioVitrina,
	comision: T$1.precioVenta,
	lista: T$1.precioLista
};
/** Precio que se muestra y su rótulo; null si no hay ningún precio publicado. */
function precioVisible(p) {
	const fuente = p.precio_fuente;
	if (fuente !== null && (p.precio_venta_min_centavos !== null || p.precio_venta_max_centavos !== null)) return {
		texto: formato.rangoDinero(p.precio_venta_min_centavos, p.precio_venta_max_centavos, { aprox: fuente === "comision" }),
		rotulo: ROTULO[fuente],
		fuente
	};
	if (p.precio_min_centavos !== null || p.precio_max_centavos !== null) return {
		texto: formato.rangoDinero(p.precio_min_centavos, p.precio_max_centavos),
		rotulo: T$1.precioLista,
		fuente: "lista"
	};
	return null;
}
/** «Te deja ≈ $40 – $45 por venta» (el mínimo manda; el rango solo si son distintos). */
function textoTeDeja(p, corto = false) {
	if (p.comision_por_venta_centavos === null && p.comision_por_venta_max_centavos === null) return null;
	const rango = formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos);
	return corto ? T$1.teDeja(rango) : T$1.teDejaPorVenta(rango);
}
function FichaPrecio(p) {
	const precio = precioVisible(p.producto);
	const deja = textoTeDeja(p.producto, p.compacta === true);
	const tasa = p.producto.comision_bp !== null ? formato.tasaBp(p.producto.comision_bp) : null;
	if (p.compacta) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(FichaPrecio_module_default.compacta, p.className),
		children: [precio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: FichaPrecio_module_default.cifra,
			title: precio.rotulo,
			children: [precio.texto, precio.fuente === "lista" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: FichaPrecio_module_default.rotuloLista,
				children: [" · ", T$1.precioLista]
			}) : null]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: FichaPrecio_module_default.sinPrecio,
			children: T$1.sinPrecio
		}), deja ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: FichaPrecio_module_default.deja,
			children: deja
		}) : tasa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: FichaPrecio_module_default.deja,
			children: T$1.deComision(tasa)
		}) : null]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(FichaPrecio_module_default.ficha, p.className),
		children: [precio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: FichaPrecio_module_default.linea,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: FichaPrecio_module_default.cifraGrande,
				children: precio.texto
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: FichaPrecio_module_default.rotulo,
				children: precio.rotulo
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: FichaPrecio_module_default.sinPrecio,
			children: T$1.sinPrecio
		}), deja ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: FichaPrecio_module_default.lineaDeja,
			children: [deja, tasa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: FichaPrecio_module_default.rotulo,
				children: [" · ", T$1.comisionTasa(tasa)]
			}) : null]
		}) : null]
	});
}
/**
* Opciones del menú ⋯ de una muestra (01 §4.2): «Planear» / «Cambiar fecha» · «Video listo» · «Cambiar etapa…» ·
* «Avisar a la tienda» · «Guardar imagen del producto» · «Copiar datos para tu guion» · «Abrir en la app de TikTok»
* (Android) / «Abrir en TikTok Shop» (Windows) · «Ver tienda» · «Agregar nota» · «Fijar arriba» / «Quitar de arriba» ·
* «No puedo hacer este video». Toda acción por gesto también existe aquí (01 §3.3).
*/
/** Etapas que admiten avance local (01 §2.4: por vencer, vencida, pausada, esperando aprobación y en camino). */
var GRUPOS_CON_ETAPAS = /* @__PURE__ */ new Set([
	"por_vencer",
	"vencida",
	"pausada",
	"esperando_aprobacion",
	"en_camino"
]);
function admiteEtapas(m) {
	return GRUPOS_CON_ETAPAS.has(m.grupo);
}
function useOpcionesMuestra(m) {
	const control = useControlMuestra();
	const guardar = useGuardarImagen();
	const copiar = useCopiarGuion(m);
	const android = useEsAndroid();
	const abrirHoja = useAbrirHoja();
	return (0, import_react.useMemo)(() => {
		const etapa = m.avance.etapa;
		const conEtapas = admiteEtapas(m);
		const opciones = [];
		if (conEtapas && etapa !== "publicada" && etapa !== "no_se_puede") {
			opciones.push(m.avance.fecha_planeada ? {
				id: "mover",
				etiqueta: T$1.cambiarFecha,
				icono: "CalendarDays",
				alPulsar: () => void control.moverDia(m)
			} : {
				id: "planear",
				etiqueta: T$1.planear,
				icono: "CalendarDays",
				alPulsar: () => void control.planear(m)
			});
			if (etapa !== "video_listo") opciones.push({
				id: "listo",
				etiqueta: T$1.videoListo,
				icono: "Clapperboard",
				alPulsar: () => void control.cambiarEtapa(m, "video_listo")
			});
		}
		if (conEtapas) opciones.push({
			id: "etapa",
			etiqueta: T$1.cambiarEtapa,
			icono: "ArrowDownUp",
			alPulsar: () => void abrirHoja({
				tipo: "etapa",
				m
			})
		});
		opciones.push({
			id: "avisar",
			etiqueta: T$1.avisarTienda,
			icono: "MessageCircle",
			alPulsar: () => control.abrirMensaje({ solicitud: m.application_id })
		});
		opciones.push({
			id: "imagen",
			etiqueta: T$1.guardarImagen,
			icono: "Download",
			deshabilitado: m.producto.imagen === null,
			alPulsar: () => void guardar(m.producto)
		});
		opciones.push({
			id: "guion",
			etiqueta: T$1.copiarGuion,
			icono: "Copy",
			alPulsar: () => void copiar()
		});
		const enlace = m.producto.enlace;
		if (enlace) opciones.push({
			id: "fuera",
			etiqueta: textoAbrirFuera(android),
			icono: "ExternalLink",
			alPulsar: () => void abrirExterno(enlace)
		});
		opciones.push({
			id: "tienda",
			etiqueta: T$1.verTienda,
			icono: "Store",
			alPulsar: () => navegar(`/tiendas/${encodeURIComponent(m.tienda.tienda_key)}`)
		});
		opciones.push({
			id: "nota",
			etiqueta: T$1.agregarNota,
			icono: "Pencil",
			alPulsar: () => navegar(`/muestras/m/${encodeURIComponent(m.application_id)}?seccion=notas`)
		});
		if (conEtapas) {
			opciones.push(m.avance.fijada ? {
				id: "desfijar",
				etiqueta: T$1.quitarArriba,
				icono: "Pin",
				alPulsar: () => void control.fijar(m, false)
			} : {
				id: "fijar",
				etiqueta: T$1.fijarArriba,
				icono: "Pin",
				alPulsar: () => void control.fijar(m, true)
			});
			if (etapa !== "no_se_puede") opciones.push({
				id: "no",
				etiqueta: T$1.noPuedo,
				icono: "Ban",
				peligro: true,
				alPulsar: () => void control.noSePuede(m)
			});
		}
		return opciones;
	}, [
		m,
		control,
		guardar,
		copiar,
		android,
		abrirHoja
	]);
}
var TarjetaMuestra_module_default = {
	carril: "_carril_12qms_6",
	carrilDeslizable: "_carrilDeslizable_12qms_12",
	tarjeta: "_tarjeta_12qms_16",
	abrir: "_abrir_12qms_29",
	seleccionada: "_seleccionada_12qms_32",
	marcada: "_marcada_12qms_40",
	lista: "_lista_12qms_47",
	arrastrando: "_arrastrando_12qms_57",
	lado: "_lado_12qms_60",
	posicion: "_posicion_12qms_66",
	foto: "_foto_12qms_75",
	cuerpo: "_cuerpo_12qms_78",
	precio: "_precio_12qms_87",
	acciones: "_acciones_12qms_90",
	filaNombre: "_filaNombre_12qms_99",
	nombre: "_nombre_12qms_105",
	partes: "_partes_12qms_138",
	partesFila: "_partesFila_12qms_146",
	sep: "_sep_12qms_153",
	meta: "_meta_12qms_159",
	grupoTienda: "_grupoTienda_12qms_165",
	avatar: "_avatar_12qms_174",
	tienda: "_tienda_12qms_177",
	grupoVariante: "_grupoVariante_12qms_187",
	variante: "_variante_12qms_194",
	chips: "_chips_12qms_202",
	chipsLista: "_chipsLista_12qms_209",
	solicitada: "_solicitada_12qms_212",
	boton: "_boton_12qms_219",
	menu: "_menu_12qms_222",
	punto: "_punto_12qms_226",
	pie: "_pie_12qms_236",
	casilla: "_casilla_12qms_247",
	casillaDibujo: "_casillaDibujo_12qms_256",
	caja: "_caja_12qms_267",
	cajaMarcada: "_cajaMarcada_12qms_278",
	fondoGesto: "_fondoGesto_12qms_288",
	fondoDerecha: "_fondoDerecha_12qms_298",
	fondoIzquierda: "_fondoIzquierda_12qms_303",
	gestoTexto: "_gestoTexto_12qms_308",
	conLado: "_conLado_12qms_326",
	tablero: "_tablero_12qms_470",
	tableroArriba: "_tableroArriba_12qms_480",
	tiendaTablero: "_tiendaTablero_12qms_486",
	tableroPie: "_tableroPie_12qms_495",
	tableroMenu: "_tableroMenu_12qms_501",
	foto48: "_foto48_12qms_505",
	foto40: "_foto40_12qms_508",
	nombre2: "_nombre2_12qms_511",
	chipPartible: "_chipPartible_12qms_528",
	avisada: "_avisada_12qms_533",
	botonTablero: "_botonTablero_12qms_539",
	agenda: "_agenda_12qms_546",
	aviso: "_aviso_12qms_547",
	contenedorAviso: "_contenedorAviso_12qms_557",
	chipAviso: "_chipAviso_12qms_569",
	nombre1: "_nombre1_12qms_570",
	metaAgenda: "_metaAgenda_12qms_577",
	partePrimera: "_partePrimera_12qms_582",
	recorte: "_recorte_12qms_588",
	parteTexto: "_parteTexto_12qms_595",
	textoParte: "_textoParte_12qms_602",
	sinPartir: "_sinPartir_12qms_605",
	sinFecha: "_sinFecha_12qms_608",
	estadoAgenda: "_estadoAgenda_12qms_612",
	atrasado: "_atrasado_12qms_619",
	atrasadoChip: "_atrasadoChip_12qms_622",
	hecho: "_hecho_12qms_632",
	contenedorSesion: "_contenedorSesion_12qms_663",
	sesion: "_sesion_12qms_662",
	fotoSesion: "_fotoSesion_12qms_674",
	sesionDatos: "_sesionDatos_12qms_677",
	sesionTienda: "_sesionTienda_12qms_683",
	sesionNombre: "_sesionNombre_12qms_693",
	sesionVariante: "_sesionVariante_12qms_705",
	sesionBotones: "_sesionBotones_12qms_712",
	tira: "_tira_12qms_736",
	fotoTira: "_fotoTira_12qms_752"
};
/**
* TarjetaMuestra (01 §3.7, §4.2, §4.4, §4.6, §4.17; 02 §7.23; lienzo Muestras.png): foto real del producto como
* protagonista, nombre corto, tienda, variante, chips (TikTok, Tu avance, promesa, copiado sin confirmar, vitrina y hasta
* 2 razones), fecha de solicitud, precio ≈ y comisión por venta, y la acción principal. Seis variantes:
*   lista   · fila de la cola (en angosto se apila; Android: deslizar = acción principal / mover o no se puede)
*   tablero · tarjeta compacta arrastrable de la vista Tablero
*   agenda  · renglón compacto del día (foto de 48, «Atrasado», ✓)
*   sesion  · bloque grande de la Sesión de videos (foto arrastrable en Windows)
*   aviso   · renglón de una muestra dentro de «Avisar a mis tiendas» (lo que se le promete)
*   tira    · miniatura de 64 de la tira de pendientes del panel «Ponte al día»
* El nombre accesible del botón principal lleva el anuncio completo para lectores de pantalla (01 §8).
*/
/** Anuncio completo de la muestra para lectores de pantalla (01 §8). */
function anuncioMuestra(m) {
	const partes = [nombreDe(m.producto), m.tienda.nombre];
	if (m.variante) partes.push(`${T$1.prefijoVariante} ${m.variante}`);
	partes.push(`${T$1.prefijoTikTok} ${textoTikTok(m, true)}`);
	if (m.prioridad === "no_se_puede_etiquetar") partes.push(ETIQUETA_NIVEL.no_se_puede_etiquetar);
	partes.push(`${T$1.prefijoAvance} ${textoAvance(m.avance)}`);
	if (m.avisos.promesa) partes.push(`${m.avisos.promesa_vencida ? T$1.promesaVencidaAnuncio : ""}${T$1.lePrometisteEl} ${formato.fechaConDia(m.avisos.promesa)}`);
	if (m.avisos.copiado_sin_confirmar) partes.push(T$1.copiadoSinConfirmar);
	for (const r of razonesVisibles(m, 2, true)) partes.push(textoRazon(r, m));
	partes.push(textoSolicitada(m));
	const precio = precioVisible(m.producto);
	if (precio) partes.push(`${precio.texto} ${precio.rotulo}`);
	const deja = textoTeDeja(m.producto);
	if (deja) partes.push(deja);
	return `${partes.join(". ")}.`;
}
function Nueva() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: TarjetaMuestra_module_default.punto,
		role: "img",
		"aria-label": T$1.nueva,
		title: T$1.nueva
	});
}
/** Casilla de escritorio: aparece al pasar el cursor; marca sin abrir (clic en la tarjeta = abrir el detalle). */
function Casilla(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: TarjetaMuestra_module_default.casilla,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: p.marcada,
			onChange: (e) => p.alMarcar?.(e.currentTarget.checked),
			"aria-label": `${T$1.marcar}: ${p.nombre}`
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: TarjetaMuestra_module_default.caja,
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Check",
				tamano: 14
			})
		})]
	});
}
/**
* Modo selección de Android (mantener presionado, 01 §3.3 y §4.2): toda la tarjeta es la casilla. Un solo objetivo de
* foco y de toque (el botón estirado, con rol de casilla) que marca o desmarca en vez de abrir; la caja de la izquierda
* solo lo dibuja.
*/
function TocarParaMarcar(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": p.marcada,
		className: cx$1(TarjetaMuestra_module_default.nombre, TarjetaMuestra_module_default.abrir),
		"aria-label": `${T$1.marcar}: ${nombreDe(p.m.producto)}, ${p.m.tienda.nombre}`,
		onClick: () => p.alMarcar?.(!p.marcada),
		"data-abrir": "",
		children: p.children
	});
}
function CajaMarca(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx$1(TarjetaMuestra_module_default.casilla, TarjetaMuestra_module_default.casillaDibujo),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx$1(TarjetaMuestra_module_default.caja, p.marcada && TarjetaMuestra_module_default.cajaMarcada),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Check",
				tamano: 14
			})
		})
	});
}
function MenuMuestra(p) {
	const opciones = useOpcionesMuestra(p.m);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
		etiqueta: `${T$1.menuMuestra}: ${nombreDe(p.m.producto)}`,
		opciones,
		className: cx$1(TarjetaMuestra_module_default.menu)
	});
}
/** Botón estirado sobre toda la tarjeta: un solo objetivo de foco que abre el detalle (con el anuncio completo). */
function Abrir(p) {
	if (!p.alAbrir) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx$1(TarjetaMuestra_module_default.nombre, p.className),
		children: p.children
	});
	const alAbrir = p.alAbrir;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cx$1(TarjetaMuestra_module_default.nombre, TarjetaMuestra_module_default.abrir, p.className),
		"aria-label": anuncioMuestra(p.m),
		onClick: () => alAbrir(),
		"data-abrir": "",
		children: p.children
	});
}
/**
* Tienda · variante. La tienda va siempre en el primer renglón, pegada a su avatar (los dos son una sola pieza que no
* se parte) y recortada con «…» si no cabe. La variante la acompaña si junto a la tienda le caben unas 10 letras (o
* completa, si es más corta); si no, baja entera a un segundo renglón visible, recortada con «…» solo si tampoco cabe
* ahí. El «·» que quedaría al inicio de ese segundo renglón se esconde (ver .partes en el CSS).
*/
function Meta(p) {
	const { m } = p;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx$1(TarjetaMuestra_module_default.partes, TarjetaMuestra_module_default.meta),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: TarjetaMuestra_module_default.partesFila,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaMuestra_module_default.grupoTienda,
				children: [p.conAvatar !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
					nombre: m.tienda.nombre,
					tamano: 16,
					className: cx$1(TarjetaMuestra_module_default.avatar)
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.tienda,
					children: m.tienda.nombre
				})]
			}), m.variante ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaMuestra_module_default.grupoVariante,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.sep,
					"aria-hidden": "true",
					children: "·"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.variante,
					children: m.variante
				})]
			}) : null]
		})
	});
}
/** TikTok no deja etiquetar el producto (01 §2.3: desactivado o sin inventario): no se planea sola ni se le ofrece «Planear». */
function noEtiquetable(m) {
	return m.prioridad === "no_se_puede_etiquetar";
}
/** Chips de la fila en el orden de 01 §3.7. */
function Chips(p) {
	const { m } = p;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx$1(TarjetaMuestra_module_default.chips, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTok, { muestra: m }),
			noEtiquetable(m) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipPrioridad, { nivel: "no_se_puede_etiquetar" }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipAvance, { avance: m.avance }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipPromesa, {
				avisos: m.avisos,
				etapa: m.avance.etapa
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipCopiadoSinConfirmar, { avisos: m.avisos }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipVitrina, { enVitrina: m.producto.en_vitrina }),
			p.conRazones !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazonesBase, {
				muestra: m,
				maximo: 2,
				sinPromesa: true
			}) : null,
			p.conFecha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: TarjetaMuestra_module_default.solicitada,
				children: textoSolicitada(m)
			}) : null
		]
	});
}
var UMBRAL_PX = 88;
function useDeslizar(m, activo) {
	const control = useControlMuestra();
	const [estado, setEstado] = (0, import_react.useState)(null);
	const ref = (0, import_react.useRef)(null);
	const deslizo = (0, import_react.useRef)(false);
	const fijar = (e) => {
		ref.current = e;
		setEstado(e);
	};
	if (!activo) return {
		dx: 0,
		manejadores: {},
		arrastrando: false
	};
	return {
		dx: estado?.horizontal ? estado.dx : 0,
		arrastrando: estado?.horizontal === true,
		manejadores: {
			onClickCapture: (e) => {
				if (!deslizo.current) return;
				deslizo.current = false;
				e.preventDefault();
				e.stopPropagation();
			},
			onPointerDown: (e) => {
				if (e.pointerType === "mouse" || e.target.closest("button:not([data-abrir]), input, a")) return;
				fijar({
					x0: e.clientX,
					y0: e.clientY,
					dx: 0,
					horizontal: null,
					id: e.pointerId,
					avisado: false
				});
			},
			onPointerMove: (e) => {
				const a = ref.current;
				if (!a || a.id !== e.pointerId) return;
				const dx = e.clientX - a.x0;
				const dy = e.clientY - a.y0;
				let horizontal = a.horizontal;
				if (horizontal === null && Math.hypot(dx, dy) > 8) {
					horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
					if (horizontal) e.currentTarget.setPointerCapture(e.pointerId);
				}
				if (!horizontal) {
					if (horizontal === false) fijar(null);
					return;
				}
				const pasa = Math.abs(dx) >= UMBRAL_PX;
				if (pasa && !a.avisado) vibrar("umbral");
				fijar({
					...a,
					dx,
					horizontal,
					avisado: pasa
				});
			},
			onPointerUp: (e) => {
				const a = ref.current;
				if (!a || a.id !== e.pointerId) return;
				fijar(null);
				if (a.horizontal) deslizo.current = true;
				if (!a.horizontal || Math.abs(a.dx) < UMBRAL_PX) return;
				vibrar("confirmar");
				if (a.dx > 0) control.accionPrincipal(m);
				else if (m.avance.fecha_planeada) control.moverDia(m);
				else control.noSePuede(m);
			},
			onPointerCancel: () => fijar(null)
		}
	};
}
function VarianteLista(p) {
	const m = p.muestra;
	const android = useEsAndroid();
	const accionEtapa = useAccionPrincipal(m);
	const accion = accionEtapa === "planear" && noEtiquetable(m) ? null : accionEtapa;
	const marcable = p.marcable === true;
	const marcada = p.marcada ?? false;
	const tocarMarca = marcable && android;
	const conLado = marcable || !android;
	const deslizable = (p.deslizable ?? android) && accion !== null && !tocarMarca;
	const { dx, manejadores, arrastrando } = useDeslizar(m, deslizable);
	const conAccion = p.conAccion ?? true;
	const nombre = nombreDe(m.producto);
	const izquierda = m.avance.fecha_planeada ? T$1.moverOtroDia : T$1.noPuedo;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(TarjetaMuestra_module_default.carril, deslizable && TarjetaMuestra_module_default.carrilDeslizable),
		children: [deslizable && dx !== 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx$1(TarjetaMuestra_module_default.fondoGesto, dx > 0 ? TarjetaMuestra_module_default.fondoDerecha : TarjetaMuestra_module_default.fondoIzquierda),
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaMuestra_module_default.gestoTexto,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: dx > 0 ? "Check" : m.avance.fecha_planeada ? "CalendarDays" : "Ban",
					tamano: 18
				}), dx > 0 && accion ? ETIQUETA_ACCION[accion] : izquierda]
			})
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: cx$1(TarjetaMuestra_module_default.tarjeta, TarjetaMuestra_module_default.lista, conLado && TarjetaMuestra_module_default.conLado, p.seleccionada && TarjetaMuestra_module_default.seleccionada, marcable && marcada && TarjetaMuestra_module_default.marcada, arrastrando && TarjetaMuestra_module_default.arrastrando, p.className),
			style: dx !== 0 ? vars({ "--dx": `${Math.max(-140, Math.min(140, dx))}px` }) : void 0,
			"aria-current": p.seleccionada ? "true" : void 0,
			"data-solicitud": m.application_id,
			"data-marcada": marcable ? String(marcada) : void 0,
			...manejadores,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: TarjetaMuestra_module_default.lado,
					children: tocarMarca ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CajaMarca, { marcada }) : marcable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla, {
						marcada,
						nombre,
						...p.alMarcar ? { alMarcar: p.alMarcar } : {}
					}) : m.posicion_cola !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: TarjetaMuestra_module_default.posicion,
						"aria-hidden": "true",
						children: m.avance.fijada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Pin",
							tamano: 14
						}) : formato.numero(m.posicion_cola)
					}) : null
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombre,
					anchoCss: 64,
					proporcion: "1:1",
					radio: "md",
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria,
					className: cx$1(TarjetaMuestra_module_default.foto)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: TarjetaMuestra_module_default.cuerpo,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: TarjetaMuestra_module_default.filaNombre,
							children: [p.esNueva ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nueva, {}) : null, tocarMarca ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TocarParaMarcar, {
								m,
								marcada,
								...p.alMarcar ? { alMarcar: p.alMarcar } : {},
								children: nombre
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abrir, {
								m,
								...p.alAbrir ? { alAbrir: p.alAbrir } : {},
								children: nombre
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, { m }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chips, {
							m,
							conFecha: true,
							className: cx$1(TarjetaMuestra_module_default.chipsLista)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: TarjetaMuestra_module_default.pie,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FichaPrecio, {
						producto: m.producto,
						compacta: true,
						className: cx$1(TarjetaMuestra_module_default.precio)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaMuestra_module_default.acciones,
						children: [conAccion && accion !== null && !tocarMarca ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
							muestra: m,
							tamano: "md",
							className: cx$1(TarjetaMuestra_module_default.boton)
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMuestra, { m })]
					})]
				})
			]
		})]
	});
}
/** Fecha que acompaña a la etapa en la vista Tablero (la columna ya dice la etapa): «jue 12 nov», «sáb 14 nov, 6:30 p. m.». */
function fechaDeEtapa(a) {
	switch (a.etapa) {
		case "planeada":
		case "video_listo": return a.fecha_planeada ? formato.fechaConDia(a.fecha_planeada) : null;
		case "programada": return a.programada_para_at !== null ? `${formato.fechaConDia(a.programada_para_at)}, ${formato.hora(a.programada_para_at)}` : null;
		case "publicada": return a.fecha_publicada ? formato.fechaConDia(a.fecha_publicada) : null;
		default: return null;
	}
}
/**
* Tablero (01 §4.2 «Vista Tablero»): tarjeta compacta de columna angosta —imagen de 48, nombre corto en 2 líneas, tienda,
* chip de fecha y de promesa—. La etapa la dice la columna; el menú ⋯ va abajo junto a la acción para que el nombre
* tenga todo el ancho junto a la foto.
*/
function VarianteTablero(p) {
	const m = p.muestra;
	const nombre = nombreDe(m.producto);
	const avisada = m.avance.etapa === "publicada" && m.avisos.ultimo_enviado_at !== null;
	const fecha = fechaDeEtapa(m.avance);
	const conAccion = p.conAccion ?? true;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cx$1(TarjetaMuestra_module_default.tarjeta, TarjetaMuestra_module_default.tablero, p.seleccionada && TarjetaMuestra_module_default.seleccionada, p.className),
		draggable: true,
		onDragStart: (e) => {
			e.dataTransfer.setData("text/x-corte-muestra", m.application_id);
			e.dataTransfer.effectAllowed = "move";
		},
		"aria-current": p.seleccionada ? "true" : void 0,
		"data-solicitud": m.application_id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaMuestra_module_default.tableroArriba,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombre,
					anchoCss: 48,
					proporcion: "1:1",
					radio: "sm",
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria,
					className: cx$1(TarjetaMuestra_module_default.foto48)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: TarjetaMuestra_module_default.cuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: TarjetaMuestra_module_default.filaNombre,
						children: [p.esNueva ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nueva, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abrir, {
							m,
							className: cx$1(TarjetaMuestra_module_default.nombre2),
							...p.alAbrir ? { alAbrir: p.alAbrir } : {},
							children: nombre
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: TarjetaMuestra_module_default.tiendaTablero,
						children: m.tienda.nombre
					})]
				})]
			}),
			fecha || m.avisos.promesa || avisada ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaMuestra_module_default.chips,
				children: [
					fecha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						tono: "neutro",
						icono: ICONO_ETAPA[m.avance.etapa],
						titulo: `${T$1.prefijoAvance} ${textoAvance(m.avance)}`,
						children: fecha
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipPromesa, {
						avisos: m.avisos,
						etapa: m.avance.etapa,
						className: cx$1(TarjetaMuestra_module_default.chipPartible)
					}),
					avisada ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: TarjetaMuestra_module_default.avisada,
						title: T$1.tiendaAvisada,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "MessageCircle",
							tamano: 14,
							etiqueta: T$1.tiendaAvisada
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 14
						})]
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaMuestra_module_default.tableroPie,
				children: [conAccion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
					muestra: m,
					tamano: "sm",
					anchoCompleto: false,
					className: cx$1(TarjetaMuestra_module_default.botonTablero)
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.tableroMenu,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMuestra, { m })
				})]
			})
		]
	});
}
function VarianteAgenda(p) {
	const m = p.muestra;
	const nombre = nombreDe(m.producto);
	const hoy = hoyLocal();
	const etapa = m.avance.etapa;
	const atrasado = etapa === "planeada" && m.avance.fecha_planeada !== null && m.avance.fecha_planeada < hoy;
	const hecho = etapa === "video_listo" || etapa === "programada" || etapa === "publicada";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cx$1(TarjetaMuestra_module_default.tarjeta, TarjetaMuestra_module_default.agenda, p.seleccionada && TarjetaMuestra_module_default.seleccionada, atrasado && TarjetaMuestra_module_default.atrasado, p.className),
		"data-solicitud": m.application_id,
		"aria-current": p.seleccionada ? "true" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: m.producto.imagen,
				alt: nombre,
				anchoCss: 48,
				proporcion: "1:1",
				radio: "sm",
				tienda: m.tienda.nombre,
				categoria: m.producto.categoria,
				className: cx$1(TarjetaMuestra_module_default.foto48)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaMuestra_module_default.cuerpo,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abrir, {
					m,
					className: cx$1(TarjetaMuestra_module_default.nombre1),
					...p.alAbrir ? { alAbrir: p.alAbrir } : {},
					children: nombre
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx$1(TarjetaMuestra_module_default.partes, TarjetaMuestra_module_default.metaAgenda),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: TarjetaMuestra_module_default.partesFila,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx$1(TarjetaMuestra_module_default.partePrimera, TarjetaMuestra_module_default.recorte),
							children: m.tienda.nombre
						}), m.avisos.promesa && !m.avisos.promesa_vencida ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: TarjetaMuestra_module_default.parteTexto,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: TarjetaMuestra_module_default.sep,
								"aria-hidden": "true",
								children: "·"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: TarjetaMuestra_module_default.textoParte,
								children: [
									T$1.lePrometisteEl,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: TarjetaMuestra_module_default.sinPartir,
										children: formato.fechaConDia(m.avisos.promesa)
									})
								]
							})]
						}) : null]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: TarjetaMuestra_module_default.estadoAgenda,
				children: [atrasado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.atrasadoChip,
					children: T$1.atrasado
				}) : hecho ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: TarjetaMuestra_module_default.hecho,
					title: ETIQUETA_ETAPA[etapa],
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Check",
						tamano: 16,
						etiqueta: ETIQUETA_ETAPA[etapa]
					})
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMuestra, { m })]
			})
		]
	});
}
function VarianteSesion(p) {
	const m = p.muestra;
	const nombre = nombreDe(m.producto);
	const android = useEsAndroid();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: TarjetaMuestra_module_default.contenedorSesion,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: cx$1(TarjetaMuestra_module_default.sesion, p.className),
			"data-solicitud": m.application_id,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: m.producto.imagen,
				alt: nombre,
				anchoCss: 520,
				proporcion: android ? "4:5" : "1:1",
				radio: "xl",
				prioridad: "alta",
				tienda: m.tienda.nombre,
				categoria: m.producto.categoria,
				...!android ? { arrastrable: { nombreArchivo: nombre } } : {},
				className: cx$1(TarjetaMuestra_module_default.fotoSesion)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaMuestra_module_default.sesionDatos,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: TarjetaMuestra_module_default.sesionTienda,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
							nombre: m.tienda.nombre,
							tamano: 24
						}), m.tienda.nombre]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abrir, {
						m,
						className: cx$1(TarjetaMuestra_module_default.sesionNombre),
						...p.alAbrir ? { alAbrir: p.alAbrir } : {},
						children: nombre
					}),
					m.variante ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: TarjetaMuestra_module_default.sesionVariante,
						children: m.variante.split(" / ").join(" · ")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: TarjetaMuestra_module_default.chips,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipVitrina, { enVitrina: m.producto.en_vitrina }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipPromesa, {
								avisos: m.avisos,
								etapa: m.avance.etapa
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazonesBase, {
								muestra: m,
								maximo: 2,
								sinPromesa: true
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FichaPrecio, { producto: m.producto }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaMuestra_module_default.sesionBotones,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonGuardarImagen, { producto: m.producto }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonCopiarGuion, { muestra: m })]
					})
				]
			})]
		})
	});
}
function VarianteAviso(p) {
	const m = p.muestra;
	const nombre = nombreDe(m.producto);
	const fecha = fechaPrometidaPorOmision(m.avance);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: TarjetaMuestra_module_default.contenedorAviso,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: cx$1(TarjetaMuestra_module_default.tarjeta, TarjetaMuestra_module_default.aviso, p.seleccionada && TarjetaMuestra_module_default.seleccionada, p.className),
			"data-solicitud": m.application_id,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: m.producto.imagen,
					alt: nombre,
					anchoCss: 40,
					proporcion: "1:1",
					radio: "sm",
					tienda: m.tienda.nombre,
					categoria: m.producto.categoria,
					className: cx$1(TarjetaMuestra_module_default.foto40)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: TarjetaMuestra_module_default.cuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Abrir, {
						m,
						className: cx$1(TarjetaMuestra_module_default.nombre1),
						...p.alAbrir ? { alAbrir: p.alAbrir } : {},
						children: nombre
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx$1(TarjetaMuestra_module_default.partes, TarjetaMuestra_module_default.metaAgenda, fecha === null && TarjetaMuestra_module_default.sinFecha),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: TarjetaMuestra_module_default.partesFila,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: TarjetaMuestra_module_default.partePrimera,
								children: fecha ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									T$1.lePrometes,
									": ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: TarjetaMuestra_module_default.sinPartir,
										children: formato.fechaConDia(fecha)
									})
								] }) : T$1.sinFechaAviso
							}), m.variante ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: TarjetaMuestra_module_default.grupoVariante,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: TarjetaMuestra_module_default.sep,
									"aria-hidden": "true",
									children: "·"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: TarjetaMuestra_module_default.variante,
									children: m.variante
								})]
							}) : null]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipAvance, {
					avance: m.avance,
					className: cx$1(TarjetaMuestra_module_default.chipAviso, TarjetaMuestra_module_default.chipPartible)
				})
			]
		})
	});
}
function VarianteTira(p) {
	const m = p.muestra;
	const nombre = nombreDe(m.producto);
	const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
		url: m.producto.imagen,
		alt: "",
		anchoCss: 64,
		proporcion: "1:1",
		radio: "md",
		tienda: m.tienda.nombre,
		categoria: m.producto.categoria,
		className: cx$1(TarjetaMuestra_module_default.fotoTira)
	});
	return p.alAbrir ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cx$1(TarjetaMuestra_module_default.tira, p.seleccionada && TarjetaMuestra_module_default.seleccionada, p.className),
		onClick: p.alAbrir,
		"aria-label": `${nombre}, ${m.tienda.nombre}`,
		title: `${nombre} · ${m.tienda.nombre}`,
		"data-solicitud": m.application_id,
		children: [contenido, p.esNueva ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nueva, {}) : null]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx$1(TarjetaMuestra_module_default.tira, p.className),
		role: "img",
		"aria-label": `${nombre}, ${m.tienda.nombre}`,
		"data-solicitud": m.application_id,
		children: contenido
	});
}
function TarjetaMuestra(p) {
	switch (p.variante) {
		case "lista": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteLista, { ...p });
		case "tablero": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteTablero, { ...p });
		case "agenda": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteAgenda, { ...p });
		case "sesion": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteSesion, { ...p });
		case "aviso": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteAviso, { ...p });
		case "tira": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VarianteTira, { ...p });
	}
}
var columnas_module_default = {
	producto: "_producto_15ytu_2",
	tienda: "_tienda_15ytu_3",
	miniatura: "_miniatura_15ytu_12",
	miniaturaVideo: "_miniaturaVideo_15ytu_16",
	textos: "_textos_15ytu_20",
	apilada: "_apilada_15ytu_21",
	apiladaDerecha: "_apiladaDerecha_15ytu_22",
	principal: "_principal_15ytu_31",
	principalNormal: "_principalNormal_15ytu_32",
	secundario: "_secundario_15ytu_46",
	cifra: "_cifra_15ytu_54",
	cifraFuerte: "_cifraFuerte_15ytu_62 _cifra_15ytu_54",
	chips: "_chips_15ytu_66",
	si: "_si_15ytu_72",
	aviso: "_aviso_15ytu_78",
	avisoOk: "_avisoOk_15ytu_87 _aviso_15ytu_78",
	avisoPendiente: "_avisoPendiente_15ytu_91 _aviso_15ytu_78",
	avisoCritico: "_avisoCritico_15ytu_95 _aviso_15ytu_78",
	estado: "_estado_15ytu_99",
	punto: "_punto_15ytu_107",
	puntoOk: "_puntoOk_15ytu_113 _punto_15ytu_107",
	puntoInfo: "_puntoInfo_15ytu_117 _punto_15ytu_107",
	puntoAtencion: "_puntoAtencion_15ytu_121 _punto_15ytu_107",
	puntoCritico: "_puntoCritico_15ytu_125 _punto_15ytu_107",
	puntoNeutro: "_puntoNeutro_15ytu_129 _punto_15ytu_107"
};
function CeldaProducto(p) {
	const { m } = p;
	const nombre = nombreDe(m.producto);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.producto,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: m.producto.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: m.tienda.nombre,
			categoria: m.producto.categoria,
			className: cx$1(columnas_module_default.miniatura)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: columnas_module_default.textos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.principal,
				title: m.producto.titulo ?? nombre,
				children: nombre
			}), p.conVariante !== false && m.variante ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.secundario,
				children: m.variante
			}) : null]
		})]
	});
}
function CeldaTienda(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.tienda,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
			nombre: p.nombre,
			tamano: 20
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.principalNormal,
			children: p.nombre
		})]
	});
}
function CeldaSolicitada(p) {
	const t = p.m.solicitada_at;
	if (t === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.secundario,
		children: T$1.porVerificar
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.apilada,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.principalNormal,
			children: formato.fechaCorta(t)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.secundario,
			children: formato.haceDias(t)
		})]
	});
}
function CeldaPrecio(p) {
	const v = precioVisible(p.m.producto);
	if (!v) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.secundario,
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.apiladaDerecha,
		title: v.rotulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.cifra,
			children: v.texto
		}), v.fuente === "lista" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.secundario,
			children: T$1.precioLista
		}) : null]
	});
}
function CeldaComision(p) {
	const pr = p.m.producto;
	if (pr.comision_por_venta_centavos === null && pr.comision_por_venta_max_centavos === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.secundario,
		children: "—"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.apiladaDerecha,
		title: textoTeDeja(pr) ?? void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.cifra,
			children: formato.rangoDinero(pr.comision_por_venta_centavos, pr.comision_por_venta_max_centavos, { decimales: true })
		}), pr.comision_bp !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.secundario,
			children: formato.tasaBp(pr.comision_bp)
		}) : null]
	});
}
var columnaProducto = (conVariante = true) => ({
	id: "producto",
	titulo: TITULO_COLUMNA.producto,
	ancho: "minmax(232px, 2.4fr)",
	ordenable: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaProducto, {
		m,
		conVariante
	})
});
var columnaTienda = {
	id: "tienda",
	titulo: TITULO_COLUMNA.tienda,
	ancho: "minmax(148px, 1.3fr)",
	ordenable: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaTienda, { nombre: m.tienda.nombre })
};
var columnaTikTok = (conMotivo = false) => ({
	id: "tiktok",
	titulo: TITULO_COLUMNA.estadoTikTok,
	ancho: 184,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipTikTokBase, {
		muestra: m,
		conMotivo,
		sinPrefijo: true
	})
});
var columnaAvance = {
	id: "avance",
	titulo: TITULO_COLUMNA.tuAvance,
	ancho: 212,
	ordenable: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipAvanceBase, {
		avance: m.avance,
		sinPrefijo: true
	})
};
function CeldaPromesa(p) {
	const { m } = p;
	const promesa = m.avisos.promesa;
	if (promesa === null || m.avance.etapa === "publicada" || m.avance.etapa === "no_se_puede") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.secundario,
		children: "—"
	});
	const vencida = m.avisos.promesa_vencida;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
		tono: vencida ? "critico" : "info",
		icono: "CalendarClock",
		titulo: `${vencida ? T$1.promesaVencidaPrefijo : ""}${T$1.lePrometisteElFecha(formato.fechaConDia(promesa))}`,
		children: formato.fechaConDia(promesa)
	});
}
var columnaPromesa = {
	id: "promesa",
	titulo: TITULO_COLUMNA.promesa,
	ancho: 136,
	prescindible: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaPromesa, { m })
};
var columnaRazones = {
	id: "razones",
	titulo: TITULO_COLUMNA.porQue,
	ancho: "minmax(200px, 1.6fr)",
	prescindible: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.chips,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsRazonesBase, {
			muestra: m,
			maximo: 1,
			sinPromesa: true
		})
	})
};
var columnaSolicitada = {
	id: "solicitada",
	titulo: TITULO_COLUMNA.solicitada,
	ancho: 112,
	ordenable: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaSolicitada, { m })
};
var columnaPrecio = {
	id: "precio",
	titulo: TITULO_COLUMNA.precioVenta,
	ancho: 140,
	alineacion: "derecha",
	ordenable: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaPrecio, { m })
};
var columnaComision = {
	id: "comision",
	titulo: TITULO_COLUMNA.comisionPorVenta,
	ancho: 140,
	alineacion: "derecha",
	ordenable: true,
	prescindible: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaComision, { m })
};
var columnaAccion = {
	id: "accion",
	titulo: TITULO_COLUMNA.accion,
	ancho: 172,
	alineacion: "derecha",
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonAccionMuestra, {
		muestra: m,
		tamano: "sm"
	})
};
var columnaVariante = {
	id: "variante",
	titulo: TITULO_COLUMNA.variante,
	ancho: "minmax(120px, 1fr)",
	prescindible: true,
	celda: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.principalNormal,
		children: m.variante ?? "—"
	})
};
var columnaVendio = {
	id: "vendio",
	titulo: TITULO_COLUMNA.vendio,
	ancho: 96,
	alineacion: "centro",
	prescindible: true,
	celda: (m) => m.ventas_producto.pedidos_validos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.si,
		children: [
			T$1.si,
			" · ",
			formato.numero(m.ventas_producto.pedidos_validos)
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.secundario,
		children: T$1.no
	})
};
/** Columnas de la tabla de muestras (Windows) para cada contexto. */
function columnasMuestras(contexto) {
	switch (contexto) {
		case "pendientes": return [
			columnaProducto(),
			columnaTienda,
			columnaTikTok(),
			columnaAvance,
			columnaRazones,
			columnaPrecio,
			columnaComision,
			columnaAccion
		];
		case "todas": return [
			columnaProducto(false),
			columnaTienda,
			columnaVariante,
			columnaTikTok(true),
			columnaSolicitada,
			columnaPrecio,
			columnaComision,
			columnaVendio,
			columnaAvance,
			columnaPromesa
		];
		case "tienda": return [
			columnaProducto(),
			columnaTikTok(),
			columnaAvance,
			columnaPromesa,
			columnaSolicitada,
			columnaPrecio,
			columnaAccion
		];
		case "producto": return [
			columnaTienda,
			columnaVariante,
			columnaTikTok(true),
			columnaAvance,
			columnaSolicitada
		];
	}
}
var PestanasMuestras_module_default = {
	raiz: "_raiz_tuk34_2",
	pestanas: "_pestanas_tuk34_13",
	pestana: "_pestana_tuk34_13",
	activa: "_activa_tuk34_47",
	conteo: "_conteo_tuk34_53",
	conteoAtencion: "_conteoAtencion_tuk34_60",
	acciones: "_acciones_tuk34_63"
};
/**
* PestanasMuestras (01 §4.2 encabezado): «Pendientes 12 · Agenda · Todas 80» + UNA acción principal según el estado
* del plan —sin plan [Armar mi plan]; con plan y tiendas por avisar [Avisar a mis tiendas]; con plan, todas avisadas y
* videos para hoy [Empezar sesión de videos]— y las otras en ⋯ junto con «Rehacer mi plan». En angosto (celular) solo
* las pestañas a todo el ancho: la acción va en el botón flotante de la pantalla (01 §4.2 Celular).
*/
var RUTA = {
	pendientes: "/muestras",
	agenda: "/muestras/agenda",
	todas: "/muestras/todas"
};
/** Cuál es LA acción principal (01 §4.2). */
function accionPrincipalMuestras(e) {
	if (e.pendientes === 0) return null;
	if (!e.conPlan) return "plan";
	if (e.tiendasPorAvisar > 0) return "avisar";
	if (e.paraHoy > 0) return "sesion";
	return null;
}
function useEstadoAccionesMuestras() {
	const pendientes = useConsulta("muestras", PARAMS_PENDIENTES$1);
	const avisos = useConsulta("avisos", {});
	const tablero = useConsulta("dashboard", { periodo: "30d" });
	return (0, import_react.useMemo)(() => {
		const items = (pendientes.datos?.items ?? []).filter(esPendiente);
		const hoy = hoyLocal();
		const conteo = contarTrabajo(items, avisos.datos?.items ?? [], hoy);
		const conPlan = items.some((m) => m.avance.etapa !== "por_planear");
		const paraHoy = items.filter((m) => m.avance.etapa === "planeada" && m.avance.fecha_planeada !== null && m.avance.fecha_planeada <= hoy).length;
		return {
			conPlan,
			tiendasPorAvisar: conteo.tiendas_por_avisar,
			paraHoy,
			pendientes: items.length,
			total: tablero.datos?.muestras.total ?? null
		};
	}, [
		pendientes.datos,
		avisos.datos,
		tablero.datos
	]);
}
function PestanasMuestras(p) {
	const e = useEstadoAccionesMuestras();
	const principal = accionPrincipalMuestras(e);
	const acciones = {
		plan: {
			etiqueta: e.conPlan ? T$1.rehacerMiPlan : T$1.armarMiPlan,
			ir: () => navegar("/muestras/plan")
		},
		avisar: {
			etiqueta: T$1.avisarMisTiendas,
			ir: () => navegar("/muestras/avisos")
		},
		sesion: {
			etiqueta: T$1.empezarSesion,
			ir: () => navegar("/muestras/sesion")
		}
	};
	const otras = [
		"plan",
		"avisar",
		"sesion"
	].filter((a) => a !== principal).map((a) => ({
		id: a,
		etiqueta: acciones[a].etiqueta,
		icono: a === "plan" ? "CalendarDays" : a === "avisar" ? "MessageCircle" : "Clapperboard",
		alPulsar: acciones[a].ir
	}));
	const pestanas = [
		{
			id: "pendientes",
			etiqueta: T$1.pendientes,
			conteo: e.pendientes
		},
		{
			id: "agenda",
			etiqueta: T$1.agenda,
			conteo: null
		},
		{
			id: "todas",
			etiqueta: T$1.todas,
			conteo: e.total
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(PestanasMuestras_module_default.raiz, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: PestanasMuestras_module_default.pestanas,
			"aria-label": T$1.vistasMuestras,
			children: pestanas.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: `#${RUTA[t.id]}`,
				className: cx$1(PestanasMuestras_module_default.pestana, t.id === p.activa && PestanasMuestras_module_default.activa),
				"aria-current": t.id === p.activa ? "page" : void 0,
				onClick: (ev) => {
					ev.preventDefault();
					navegar(RUTA[t.id]);
				},
				children: [t.etiqueta, t.conteo !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx$1(PestanasMuestras_module_default.conteo, t.id === "pendientes" && t.conteo > 0 && PestanasMuestras_module_default.conteoAtencion),
					children: formato.numero(t.conteo)
				}) : null]
			}, t.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: PestanasMuestras_module_default.acciones,
			children: [principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				icono: principal === "plan" ? "CalendarDays" : principal === "avisar" ? "MessageCircle" : "Clapperboard",
				alPulsar: acciones[principal].ir,
				children: principal === "plan" && !e.conPlan ? T$1.armarMiPlanUnMinuto : acciones[principal].etiqueta
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				etiqueta: T$1.masAcciones,
				opciones: otras
			})]
		})]
	});
}
var TarjetaTienda_module_default = {
	tarjeta: "_tarjeta_17eqk_2",
	pulsable: "_pulsable_17eqk_12",
	ficha: "_ficha_17eqk_15",
	abrir: "_abrir_17eqk_22",
	nombre: "_nombre_17eqk_25",
	fila: "_fila_17eqk_56",
	cuerpo: "_cuerpo_17eqk_63",
	titulo: "_titulo_17eqk_69",
	chip: "_chip_17eqk_79",
	linea: "_linea_17eqk_82",
	foto48: "_foto48_17eqk_88",
	chevron: "_chevron_17eqk_91",
	contenedorFila: "_contenedorFila_17eqk_94",
	fotoFicha: "_fotoFicha_17eqk_113",
	fotoLlena: "_fotoLlena_17eqk_116",
	avatarSobre: "_avatarSobre_17eqk_120",
	cuerpoFicha: "_cuerpoFicha_17eqk_127",
	porque: "_porque_17eqk_138",
	cifras: "_cifras_17eqk_144"
};
/** «2 pendientes · por avisar · $1,234 de comisión» (01 §4.9). */
function lineaTienda(t) {
	const partes = [];
	const n = t.muestras.pendientes;
	if (n > 0) partes.push(`${formato.numero(n)} ${n === 1 ? T$1.pendienteUna : T$1.pendientesMinusculas}`);
	if (t.promesas.vencidas > 0) partes.push(`${formato.numero(t.promesas.vencidas)} ${t.promesas.vencidas === 1 ? T$1.promesaVencidaUna : T$1.promesasVencidas}`);
	else if (t.por_avisar) partes.push(T$1.porAvisarMinusculas);
	else if (n > 0 && t.promesas.vigentes > 0) partes.push(T$1.avisadaMinusculas);
	partes.push(T$1.deComision(formato.dinero(t.ventas.comision_estimada_centavos)));
	return partes.join(" · ");
}
function TarjetaTienda(p) {
	const t = p.tienda;
	const alAbrir = p.alAbrir;
	const etiqueta = `${t.nombre}. ${t.salud_porque}. ${lineaTienda(t)}`;
	const nombre = alAbrir ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cx$1(TarjetaTienda_module_default.nombre, TarjetaTienda_module_default.abrir),
		onClick: () => alAbrir(),
		"aria-label": etiqueta,
		children: t.nombre
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: TarjetaTienda_module_default.nombre,
		children: t.nombre
	});
	if (p.variante === "fila") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: TarjetaTienda_module_default.contenedorFila,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: cx$1(TarjetaTienda_module_default.tarjeta, TarjetaTienda_module_default.fila, alAbrir && TarjetaTienda_module_default.pulsable, p.className),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
					nombre: t.nombre,
					tamano: 40
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: TarjetaTienda_module_default.cuerpo,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaTienda_module_default.titulo,
						children: [nombre, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
							salud: t.salud,
							esSocio: t.es_socio,
							className: cx$1(TarjetaTienda_module_default.chip)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: TarjetaTienda_module_default.linea,
						children: lineaTienda(t)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
					url: t.imagen,
					alt: "",
					anchoCss: 48,
					proporcion: "1:1",
					radio: "sm",
					tienda: t.nombre,
					className: cx$1(TarjetaTienda_module_default.foto48)
				}),
				alAbrir ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 18,
					className: cx$1(TarjetaTienda_module_default.chevron)
				}) : null
			]
		})
	});
	const v = t.ventas;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cx$1(TarjetaTienda_module_default.tarjeta, TarjetaTienda_module_default.ficha, alAbrir && TarjetaTienda_module_default.pulsable, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: TarjetaTienda_module_default.fotoFicha,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: t.imagen,
				alt: "",
				anchoCss: 320,
				proporcion: "1:1",
				radio: "md",
				tienda: t.nombre,
				className: cx$1(TarjetaTienda_module_default.fotoLlena)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
				nombre: t.nombre,
				tamano: 32,
				className: cx$1(TarjetaTienda_module_default.avatarSobre)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: TarjetaTienda_module_default.cuerpoFicha,
			children: [
				nombre,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
					salud: t.salud,
					esSocio: t.es_socio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: TarjetaTienda_module_default.porque,
					children: t.salud_porque
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: TarjetaTienda_module_default.cifras,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T$1.pendientes }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.numero(t.muestras.pendientes) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T$1.comision }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formato.dinero(v.comision_estimada_centavos) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: T$1.participacion90 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v.participacion_90d > 0 ? formato.porcentaje(v.participacion_90d, 1) : "—" })] })
					]
				})
			]
		})]
	});
}
/** Última venta válida en los últimos 7 días (01 §4.12 «Vendiendo ahora»). */
function vendiendoAhora(v, hoy = hoyLocal()) {
	return v.pedidos_validos > 0 && v.ultima_venta >= sumarDias(hoy, -6);
}
/** Nombre visible de un video: título (siempre null desde C4) → producto principal → «Video 7677…3012». */
function nombreVideo(v, nombreProducto) {
	return v.titulo ?? (nombreProducto && nombreProducto.length > 0 ? nombreProducto : T$1.videoId(formato.idCorto(v.content_id)));
}
var guion = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: columnas_module_default.secundario,
	children: "—"
});
function Cifra(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.apiladaDerecha,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: p.fuerte ? columnas_module_default.cifraFuerte : columnas_module_default.cifra,
			children: p.texto
		}), p.secundario ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: columnas_module_default.secundario,
			children: p.secundario
		}) : null]
	});
}
function Fecha(p) {
	return p.valor === null ? guion() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.principalNormal,
		children: formato.fechaCorta(p.valor)
	});
}
function CeldaAviso(p) {
	const t = p.t;
	if (t.promesas.vencidas > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.avisoCritico,
		children: T$1.promesaVencida
	});
	if (t.por_avisar) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: columnas_module_default.avisoPendiente,
		children: T$1.porAvisar
	});
	if (t.muestras.pendientes > 0 && t.promesas.vigentes > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.avisoOk,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Check",
				tamano: 14
			}),
			" ",
			T$1.avisada
		]
	});
	return guion();
}
function columnasTiendas() {
	return [
		{
			id: "tienda",
			titulo: TITULO_COLUMNA.tienda,
			ancho: "minmax(200px, 1.6fr)",
			ordenable: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaTienda, { nombre: t.nombre })
		},
		{
			id: "salud",
			titulo: TITULO_COLUMNA.salud,
			ancho: 196,
			ordenable: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				title: t.salud_porque,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSalud, {
					salud: t.salud,
					esSocio: t.es_socio
				})
			})
		},
		{
			id: "pendientes",
			titulo: TITULO_COLUMNA.pendientes,
			ancho: 104,
			alineacion: "derecha",
			ordenable: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, {
				texto: formato.numero(t.muestras.pendientes),
				fuerte: t.muestras.pendientes > 0
			})
		},
		{
			id: "aviso",
			titulo: TITULO_COLUMNA.aviso,
			ancho: 136,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaAviso, { t })
		},
		{
			id: "recibidas",
			titulo: TITULO_COLUMNA.recibidas,
			ancho: 96,
			alineacion: "derecha",
			prescindible: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(t.muestras.recibidas) })
		},
		{
			id: "entregadas",
			titulo: TITULO_COLUMNA.entregadas,
			ancho: 104,
			alineacion: "derecha",
			prescindible: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(t.muestras.entregadas) })
		},
		{
			id: "valor",
			titulo: TITULO_COLUMNA.valorRecibido,
			ancho: 152,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (t) => t.muestras.recibidas > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.rangoDinero(t.muestras.valor_recibido_min_centavos, t.muestras.valor_recibido_max_centavos, { aprox: true }) }) : guion()
		},
		{
			id: "comision",
			titulo: TITULO_COLUMNA.comisionTotal,
			ancho: 128,
			alineacion: "derecha",
			ordenable: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, {
				texto: formato.dinero(t.ventas.comision_estimada_centavos),
				fuerte: true
			})
		},
		{
			id: "participacion",
			titulo: TITULO_COLUMNA.participacion,
			ancho: 132,
			alineacion: "derecha",
			prescindible: true,
			celda: (t) => t.ventas.participacion_90d > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.porcentaje(t.ventas.participacion_90d, 1) }) : guion()
		},
		{
			id: "ultima",
			titulo: TITULO_COLUMNA.ultimaVenta,
			ancho: 108,
			ordenable: true,
			prescindible: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fecha, { valor: t.ventas.ultima_venta_at })
		},
		{
			id: "productos",
			titulo: TITULO_COLUMNA.productos,
			ancho: 72,
			prescindible: true,
			celda: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
				url: t.imagen,
				alt: "",
				anchoCss: 32,
				proporcion: "1:1",
				radio: "xs",
				tienda: t.nombre,
				className: cx$1(columnas_module_default.miniatura)
			})
		}
	];
}
function CeldaVideo(p) {
	const v = p.v;
	const nombre = nombreVideo(v);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.producto,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: v.miniatura,
			alt: "",
			anchoCss: 30,
			proporcion: "9:16",
			radio: "xs",
			tienda: v.tienda_principal,
			className: cx$1(columnas_module_default.miniaturaVideo)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: columnas_module_default.textos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.principal,
				children: nombre
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.secundario,
				children: v.miniatura_origen === "producto" ? T$1.fotoDelProducto : T$1.videoId(formato.idCorto(v.content_id))
			})]
		})]
	});
}
function columnasVideos() {
	return [
		{
			id: "video",
			titulo: TITULO_COLUMNA.video,
			ancho: "minmax(220px, 2fr)",
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaVideo, { v })
		},
		{
			id: "comision",
			titulo: TITULO_COLUMNA.comision,
			ancho: 120,
			alineacion: "derecha",
			ordenable: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, {
				texto: formato.dinero(v.comision_estimada_centavos),
				fuerte: true
			})
		},
		{
			id: "pedidos",
			titulo: TITULO_COLUMNA.pedidos,
			ancho: 96,
			alineacion: "derecha",
			ordenable: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(v.pedidos) })
		},
		{
			id: "unidades",
			titulo: TITULO_COLUMNA.unidades,
			ancho: 96,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(v.unidades) })
		},
		{
			id: "reembolsos",
			titulo: TITULO_COLUMNA.reembolsos,
			ancho: 108,
			alineacion: "derecha",
			ordenable: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.porcentaje(v.tasa_reembolso, 1) })
		},
		{
			id: "primera",
			titulo: TITULO_COLUMNA.primeraVenta,
			ancho: 116,
			ordenable: true,
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fecha, { valor: v.primera_venta })
		},
		{
			id: "ultima",
			titulo: TITULO_COLUMNA.ultimaVenta,
			ancho: 128,
			ordenable: true,
			celda: (v) => vendiendoAhora(v) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: columnas_module_default.estado,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: columnas_module_default.puntoOk,
					"aria-hidden": "true"
				}), formato.fechaCorta(v.ultima_venta)]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fecha, { valor: v.ultima_venta })
		},
		{
			id: "tienda",
			titulo: TITULO_COLUMNA.tienda,
			ancho: "minmax(150px, 1.2fr)",
			prescindible: true,
			celda: (v) => v.tienda_principal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaTienda, { nombre: v.tienda_principal }) : guion()
		},
		{
			id: "productos",
			titulo: TITULO_COLUMNA.productos,
			ancho: 96,
			alineacion: "derecha",
			prescindible: true,
			celda: (v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(v.productos) })
		}
	];
}
function CeldaProductoFila(p) {
	const f = p.f;
	const nombre = f.titulo_corto ?? nombreCorto(f.titulo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.producto,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: f.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: f.tienda_nombre,
			className: cx$1(columnas_module_default.miniatura)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: columnas_module_default.textos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.principal,
				title: f.titulo ?? nombre,
				children: nombre || T$1.productoId(formato.idCorto(f.product_id))
			}), f.es_muestra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.secundario,
				children: T$1.fueMuestra
			}) : null]
		})]
	});
}
function columnasProductos() {
	return [
		{
			id: "producto",
			titulo: TITULO_COLUMNA.producto,
			ancho: "minmax(240px, 2.2fr)",
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaProductoFila, { f })
		},
		{
			id: "tienda",
			titulo: TITULO_COLUMNA.tienda,
			ancho: "minmax(150px, 1.2fr)",
			prescindible: true,
			celda: (f) => f.tienda_nombre ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaTienda, { nombre: f.tienda_nombre }) : guion()
		},
		{
			id: "unidades",
			titulo: TITULO_COLUMNA.unidades,
			ancho: 96,
			alineacion: "derecha",
			ordenable: true,
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(f.unidades) })
		},
		{
			id: "comision",
			titulo: TITULO_COLUMNA.comision,
			ancho: 120,
			alineacion: "derecha",
			ordenable: true,
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, {
				texto: formato.dinero(f.comision_estimada_centavos),
				fuerte: true
			})
		},
		{
			id: "pedidos",
			titulo: TITULO_COLUMNA.pedidos,
			ancho: 92,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(f.pedidos) })
		},
		{
			id: "videos",
			titulo: TITULO_COLUMNA.videos,
			ancho: 84,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.numero(f.videos) })
		},
		{
			id: "reembolsos",
			titulo: TITULO_COLUMNA.reembolsos,
			ancho: 108,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.porcentaje(f.tasa_reembolso, 1) })
		},
		{
			id: "tasa",
			titulo: TITULO_COLUMNA.comisionPct,
			ancho: 104,
			alineacion: "derecha",
			prescindible: true,
			celda: (f) => f.con_ficha && f.comision_bp !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.tasaBp(f.comision_bp) }) : guion()
		},
		{
			id: "vitrina",
			titulo: TITULO_COLUMNA.vitrina,
			ancho: 96,
			alineacion: "centro",
			prescindible: true,
			celda: (f) => f.en_vitrina === null ? guion() : f.en_vitrina ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.si,
				children: T$1.si
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.secundario,
				children: T$1.no
			})
		}
	];
}
var PUNTO_ESTADO = {
	SETTLED: columnas_module_default.puntoOk,
	"To-SETTLE": columnas_module_default.puntoInfo,
	"AWAITING PAYMENT": columnas_module_default.puntoInfo,
	REFUNDED: columnas_module_default.puntoNeutro,
	FROZEN: columnas_module_default.puntoAtencion,
	UNSPECIFIED: columnas_module_default.puntoAtencion,
	NO_DEVUELTA: columnas_module_default.puntoNeutro
};
function CeldaPedidoProducto(p) {
	const linea = p.o.lineas[0];
	if (!linea) return guion();
	const nombre = nombreCorto(linea.producto) || T$1.productoId(formato.idCorto(linea.product_id));
	const mas = p.o.lineas.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: columnas_module_default.producto,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: linea.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: linea.tienda_nombre,
			className: cx$1(columnas_module_default.miniatura)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: columnas_module_default.textos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: columnas_module_default.principal,
				title: linea.producto ?? nombre,
				children: nombre
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: columnas_module_default.secundario,
				children: [linea.tienda_nombre ?? "—", mas > 0 ? ` · +${formato.numero(mas)} ${mas === 1 ? T$1.producto : T$1.productosMinusculas}` : ""]
			})]
		})]
	});
}
function columnasPedidos() {
	return [
		{
			id: "fecha",
			titulo: TITULO_COLUMNA.pedido,
			ancho: 132,
			ordenable: true,
			celda: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: columnas_module_default.apilada,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: columnas_module_default.principalNormal,
					children: formato.fechaCorta(o.fecha)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: columnas_module_default.secundario,
					children: formato.idCorto(o.order_id)
				})]
			})
		},
		{
			id: "producto",
			titulo: TITULO_COLUMNA.producto,
			ancho: "minmax(240px, 2.4fr)",
			celda: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CeldaPedidoProducto, { o })
		},
		{
			id: "estado",
			titulo: TITULO_COLUMNA.estado,
			ancho: 172,
			ordenable: true,
			celda: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: columnas_module_default.estado,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx$1(PUNTO_ESTADO[o.estado]),
					"aria-hidden": "true"
				}), ETIQUETA_ESTADO_ORDEN[o.estado]]
			})
		},
		{
			id: "total",
			titulo: TITULO_COLUMNA.total,
			ancho: 112,
			alineacion: "derecha",
			ordenable: true,
			prescindible: true,
			celda: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.dinero(o.total_centavos, { decimales: true }) })
		},
		{
			id: "estimada",
			titulo: TITULO_COLUMNA.comisionEstimada,
			ancho: 148,
			alineacion: "derecha",
			ordenable: true,
			celda: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, {
				texto: formato.dinero(o.comision_estimada_centavos, { decimales: true }),
				fuerte: true
			})
		},
		{
			id: "liquidada",
			titulo: TITULO_COLUMNA.comisionLiquidada,
			ancho: 148,
			alineacion: "derecha",
			prescindible: true,
			celda: (o) => o.estado === "SETTLED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cifra, { texto: formato.dinero(o.comision_real_centavos, { decimales: true }) }) : guion()
		}
	];
}
var ListaNotas_module_default = {
	raiz: "_raiz_g8lo2_2",
	cabeza: "_cabeza_g8lo2_12",
	titulo: "_titulo_g8lo2_18",
	estado: "_estado_g8lo2_25",
	estadoError: "_estadoError_g8lo2_31",
	nueva: "_nueva_g8lo2_34",
	area: "_area_g8lo2_40",
	agregar: "_agregar_g8lo2_43",
	lista: "_lista_g8lo2_46",
	nota: "_nota_g8lo2_54",
	fijada: "_fijada_g8lo2_62",
	texto: "_texto_g8lo2_65",
	pieNota: "_pieNota_g8lo2_73",
	fecha: "_fecha_g8lo2_79",
	marcaFijada: "_marcaFijada_g8lo2_86",
	vacio: "_vacio_g8lo2_93"
};
/**
* ListaNotas (01 §4.3 tarjeta 7, §4.10, §4.12, §7.2): notas locales de una entidad —crear, editar con guardado
* automático, fijar arriba y borrar con Deshacer—. Funciona sin conexión: en Android las ops van a la cola y el estado
* dice «Guardado en este celular · se enviará a tu PC».
*/
function textoEstado(e) {
	if (e === null) return null;
	if (e.tipo === "guardando") return T$1.guardando;
	if (e.tipo === "error") return e.texto;
	return e.enCola ? T$1.enCola : T$1.guardado;
}
function estadoDe(r) {
	if (r.estado === "conflicto") return {
		tipo: "error",
		texto: T$1.conflictoNota
	};
	if (r.estado === "error") return {
		tipo: "error",
		texto: r.error?.mensaje ?? T$1.errorGenerico
	};
	return {
		tipo: "guardado",
		enCola: r.estado === "en_cola"
	};
}
/** Orden: fijadas primero y luego la más reciente. */
function ordenarNotas(notas) {
	return [...notas].sort((a, b) => a.fijada !== b.fijada ? a.fijada ? -1 : 1 : b.actualizado_at - a.actualizado_at);
}
function Nota(p) {
	const acciones = useAcciones();
	const toast = useToast();
	const { nota } = p;
	const [editando, setEditando] = (0, import_react.useState)(false);
	const [texto, setTexto] = (0, import_react.useState)(nota.texto);
	const temporizador = (0, import_react.useRef)(null);
	const rev = (0, import_react.useRef)(nota.rev);
	rev.current = nota.rev;
	(0, import_react.useEffect)(() => {
		if (!editando) setTexto(nota.texto);
	}, [nota.texto, editando]);
	(0, import_react.useEffect)(() => () => {
		if (temporizador.current !== null) window.clearTimeout(temporizador.current);
	}, []);
	const guardar = (valor) => {
		if (temporizador.current !== null) window.clearTimeout(temporizador.current);
		temporizador.current = window.setTimeout(() => {
			const limpio = valor.trim();
			if (limpio === "" || limpio === nota.texto.trim()) return;
			p.alEstado({ tipo: "guardando" });
			acciones.editarNota(nota.id, {
				texto: limpio,
				rev: rev.current
			}).then((r) => p.alEstado(estadoDe(r)));
		}, 700);
	};
	const opciones = [
		{
			id: "editar",
			etiqueta: T$1.editarNota,
			icono: "Pencil",
			alPulsar: () => setEditando(true)
		},
		nota.fijada ? {
			id: "desfijar",
			etiqueta: T$1.desfijarNota,
			icono: "Pin",
			alPulsar: () => void acciones.editarNota(nota.id, {
				fijada: false,
				rev: nota.rev
			}).then((r) => p.alEstado(estadoDe(r)))
		} : {
			id: "fijar",
			etiqueta: T$1.fijarNota,
			icono: "Pin",
			alPulsar: () => void acciones.editarNota(nota.id, {
				fijada: true,
				rev: nota.rev
			}).then((r) => p.alEstado(estadoDe(r)))
		},
		{
			id: "borrar",
			etiqueta: T$1.borrarNota,
			icono: "Trash2",
			peligro: true,
			alPulsar: () => void acciones.borrarNota(nota.id, nota.rev).then((r) => {
				if (r.estado === "aplicada" || r.estado === "en_cola") toast.mostrar({
					texto: T$1.notaBorrada,
					tono: "ok",
					accion: {
						etiqueta: T$1.deshacer,
						alPulsar: () => void r.deshacer()
					},
					duracion_ms: 6e3
				});
				else p.alEstado(estadoDe(r));
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: cx$1(ListaNotas_module_default.nota, nota.fijada && ListaNotas_module_default.fijada),
		children: [editando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTexto, {
			etiqueta: T$1.editarNota,
			etiquetaOculta: true,
			valor: texto,
			autoFoco: true,
			filas: 3,
			alCambiar: (v) => {
				setTexto(v);
				guardar(v);
			},
			className: cx$1(ListaNotas_module_default.area)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: ListaNotas_module_default.texto,
			children: nota.texto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: ListaNotas_module_default.pieNota,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: ListaNotas_module_default.fecha,
				children: [nota.fijada ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: ListaNotas_module_default.marcaFijada,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Pin",
							tamano: 14
						}),
						" ",
						T$1.notaFijada
					]
				}) : null, formato.relativa(nota.actualizado_at)]
			}), editando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "sm",
				alPulsar: () => setEditando(false),
				children: T$1.listoNota
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				etiqueta: T$1.accionesNota,
				opciones
			})]
		})]
	});
}
function ListaNotas(p) {
	const params = p.entidadId !== null ? {
		entidad: p.entidad,
		entidad_id: p.entidadId
	} : { entidad: p.entidad };
	const consulta = useConsulta("notas", params);
	const acciones = useAcciones();
	const [borrador, setBorrador] = (0, import_react.useState)("");
	const [estado, setEstado] = (0, import_react.useState)(null);
	const [creando, setCreando] = (0, import_react.useState)(false);
	const notas = (0, import_react.useMemo)(() => ordenarNotas((consulta.datos?.items ?? []).filter((n) => n.entidad === p.entidad && n.entidad_id === p.entidadId)), [
		consulta.datos,
		p.entidad,
		p.entidadId
	]);
	const agregar = async () => {
		const texto = borrador.trim();
		if (texto === "") return;
		setCreando(true);
		setEstado({ tipo: "guardando" });
		const r = await acciones.crearNota({
			id: nuevoId(),
			entidad: p.entidad,
			entidad_id: p.entidadId,
			texto
		});
		setCreando(false);
		setEstado(estadoDe(r));
		if (r.estado === "aplicada" || r.estado === "en_cola") setBorrador("");
	};
	const textoGuardado = textoEstado(estado);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx$1(ListaNotas_module_default.raiz, p.className),
		"aria-label": p.titulo ?? T$1.notas,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: ListaNotas_module_default.cabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: ListaNotas_module_default.titulo,
					children: p.titulo ?? T$1.notas
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx$1(ListaNotas_module_default.estado, estado?.tipo === "error" && ListaNotas_module_default.estadoError),
					"aria-live": "polite",
					children: textoGuardado
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ListaNotas_module_default.nueva,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AreaTexto, {
					etiqueta: T$1.nuevaNota,
					etiquetaOculta: true,
					valor: borrador,
					alCambiar: setBorrador,
					placeholder: PLACEHOLDER_NOTA[p.entidad],
					filas: 2,
					maximo: 2e3,
					className: cx$1(ListaNotas_module_default.area)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "Plus",
					deshabilitado: borrador.trim() === "",
					cargando: creando,
					alPulsar: () => void agregar(),
					className: cx$1(ListaNotas_module_default.agregar),
					children: T$1.agregarNotaBoton
				})]
			}),
			consulta.cargando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 2
			}) : notas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: ListaNotas_module_default.vacio,
				children: T$1.sinNotas
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: ListaNotas_module_default.lista,
				children: notas.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nota, {
					nota: n,
					alEstado: setEstado
				}, n.id))
			})
		]
	});
}
var PanelPlan_module_default = {
	panel: "_panel_1wehk_2",
	columnas: "_columnas_1wehk_9",
	ritmo: "_ritmo_1wehk_21",
	campo: "_campo_1wehk_27",
	etiqueta: "_etiqueta_1wehk_33",
	desde: "_desde_1wehk_39",
	ayuda: "_ayuda_1wehk_42",
	lado: "_lado_1wehk_48",
	previa: "_previa_1wehk_54",
	resumen: "_resumen_1wehk_63",
	grafica: "_grafica_1wehk_72",
	pie: "_pie_1wehk_75",
	pasos: "_pasos_1wehk_88",
	paso: "_paso_1wehk_88",
	pasoActual: "_pasoActual_1wehk_107",
	pasoHecho: "_pasoHecho_1wehk_112",
	pasoNumero: "_pasoNumero_1wehk_116",
	pasoTitulo: "_pasoTitulo_1wehk_131",
	tituloPaso: "_tituloPaso_1wehk_144",
	incluir: "_incluir_1wehk_151",
	opcionesIncluir: "_opcionesIncluir_1wehk_156",
	grupos: "_grupos_1wehk_162",
	grupo: "_grupo_1wehk_162",
	grupoCabeza: "_grupoCabeza_1wehk_172",
	grupoLista: "_grupoLista_1wehk_176",
	incluirFila: "_incluirFila_1wehk_184",
	incluirCasilla: "_incluirCasilla_1wehk_191",
	foto40: "_foto40_1wehk_194",
	pregunta: "_pregunta_1wehk_197",
	revisar: "_revisar_1wehk_202",
	ritmoTexto: "_ritmoTexto_1wehk_207",
	termina: "_termina_1wehk_212",
	publica: "_publica_1wehk_223",
	primeros: "_primeros_1wehk_228",
	dia: "_dia_1wehk_233",
	diaTitulo: "_diaTitulo_1wehk_241",
	diaLista: "_diaLista_1wehk_246",
	diaFila: "_diaFila_1wehk_254",
	diaTextos: "_diaTextos_1wehk_260",
	diaNombre: "_diaNombre_1wehk_265",
	diaTienda: "_diaTienda_1wehk_272"
};
/**
* PanelPlan (01 §4.5 «Armar mi plan» y §4.15 W4). Reparte las pendientes en fechas realistas con dominio.armarPlan
* (reglas 1–3: por vencer primero, capacidad contando lo ya planeado, días sin videos, promesas) y crea el plan con UN
* solo acciones.lote (un solo Deshacer).
*   'compacto' · W4: ritmo + vista previa en vivo «{32} videos · Terminas el {mar 24 nov} · publicas a más tardar el
*                {jue 26 nov}» en una pantalla · [Crear mi plan] [Saltar]
*   'completo' · pasos 1 «Tu ritmo» → 2 «¿Qué incluimos?» → 3 «Revisa tu plan»
* Antes del punto de control 2 de la primera sincronización: «Orden provisional: faltan tus ventas.»
*/
/** «de lunes a sábado» · «lunes, miércoles y viernes» (0 = lunes). */
function textoDias(dias) {
	const orden = [...new Set(dias)].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
	if (orden.length === 0) return T$1.sinDiasVideos;
	if (orden.length === 7) return T$1.todosLosDias;
	if (orden.every((d, i) => i === 0 || d === (orden[i - 1] ?? -2) + 1) && orden.length >= 3) return T$1.deDiaADia(NOMBRE_DIA[orden[0] ?? 0] ?? "", NOMBRE_DIA[orden[orden.length - 1] ?? 0] ?? "");
	const nombres = orden.map((d) => NOMBRE_DIA[d] ?? "");
	return nombres.length === 1 ? T$1.losDia(nombres[0] ?? "") : `${nombres.slice(0, -1).join(", ")} ${T$1.y} ${nombres[nombres.length - 1]}`;
}
/** Vista previa en vivo de W4 y del paso 3: «32 videos · Terminas el mar 24 nov · publicas a más tardar el jue 26 nov». */
function textoResumenPlan(r) {
	const n = r.asignaciones.length;
	if (n === 0 || r.termina === null || r.publica_a_mas_tardar === null) return T$1.sinVideosPlan;
	return T$1.resumenPlan(cuenta$1(n, T$1.video), formato.fechaConDia(r.termina), formato.fechaConDia(r.publica_a_mas_tardar));
}
/** La primera sincronización todavía no termina las ventas de 180 días (punto de control 2, C34). */
function ordenProvisional(estado) {
	if (!estado || estado.ultima_ok_at !== null) return false;
	const ordenes = estado.pasos.find((p) => p.paso === "ordenes");
	return estado.en_curso && (ordenes === void 0 || ordenes.estado === "pendiente" || ordenes.estado === "en_curso");
}
/** Promocionable = TikTok deja etiquetarlo (01 §2.3); las que no, van a su propia sección y no se planean solas. */
function promocionable(m) {
	return m.prioridad !== "no_se_puede_etiquetar";
}
function PanelPlan(p) {
	const consulta = useConsulta("muestras", PARAMS_PENDIENTES$1);
	const planes = useConsulta("plan", {});
	const avisos = useConsulta("avisos", {});
	const prefs = usePreferencias();
	const sync = useSync();
	const ops = useOperaciones();
	const acciones = useAcciones();
	const control = useControlMuestra();
	const pendientes = (0, import_react.useMemo)(() => (consulta.datos?.items ?? []).filter(esPendiente), [consulta.datos]);
	const hoy = hoyLocal();
	const desdeOmision = desdePorOmision(ahoraS());
	const [capacidad, setCapacidad] = (0, import_react.useState)(null);
	const [dias, setDias] = (0, import_react.useState)(null);
	const [desde, setDesde] = (0, import_react.useState)(null);
	const [otraFecha, setOtraFecha] = (0, import_react.useState)(false);
	const [respetar, setRespetar] = (0, import_react.useState)(true);
	const [orden, setOrden] = (0, import_react.useState)(null);
	const [quitadas, setQuitadas] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [paso, setPaso] = (0, import_react.useState)(1);
	const [preguntarQuitadas, setPreguntarQuitadas] = (0, import_react.useState)(false);
	const [creando, setCreando] = (0, import_react.useState)(false);
	const cap = capacidad ?? prefs.capacidad_videos_dia;
	const diasEf = dias ?? prefs.dias_videos;
	const desdeEf = desde ?? desdeOmision;
	const ordenEf = orden ?? prefs.orden_plan;
	/** Candidatas por omisión: promocionables que aún no tienen el video hecho (por planear o planeadas). */
	const candidatas = (0, import_react.useMemo)(() => pendientes.filter((m) => promocionable(m) && (m.avance.etapa === "por_planear" || m.avance.etapa === "planeada")), [pendientes]);
	const incluidas = (0, import_react.useMemo)(() => candidatas.filter((m) => !quitadas.has(m.application_id)).map((m) => m.application_id), [candidatas, quitadas]);
	const entrada = (0, import_react.useMemo)(() => {
		const promesas = {};
		for (const m of pendientes) if (m.avisos.promesa) promesas[m.application_id] = m.avisos.promesa;
		return {
			muestras: pendientes,
			incluidas,
			capacidad: Math.max(1, Math.min(10, cap)),
			dias: diasEf,
			desde: desdeEf,
			respetarFechas: respetar,
			orden: ordenEf,
			planes: planes.datos?.items ?? [],
			promesas,
			hoy
		};
	}, [
		pendientes,
		incluidas,
		cap,
		diasEf,
		desdeEf,
		respetar,
		ordenEf,
		planes.datos,
		hoy
	]);
	const resultado = (0, import_react.useMemo)(() => armarPlan(entrada), [entrada]);
	const provisional = ordenProvisional(sync.estado);
	const resumen = textoResumenPlan(resultado);
	const crear = async (prepararMensajes) => {
		if (resultado.asignaciones.length === 0 || resultado.termina === null || resultado.publica_a_mas_tardar === null) return;
		setCreando(true);
		const opsPlan = opsDePlan(resultado, pendientes, planes.datos?.items ?? []);
		const cambiosPrefs = {};
		if (cap !== prefs.capacidad_videos_dia) cambiosPrefs.capacidad_videos_dia = cap;
		if (diasEf.join(",") !== prefs.dias_videos.join(",")) cambiosPrefs.dias_videos = diasEf;
		if (ordenEf !== prefs.orden_plan) cambiosPrefs.orden_plan = ordenEf;
		const r = await ops.aplicarLote(opsPlan, T$1.planListo(formato.fechaConDia(resultado.termina)));
		if (prefs.rev !== null && Object.keys(cambiosPrefs).length > 0 && r && (r.estado === "aplicada" || r.estado === "en_cola")) acciones.editarPreferencias({
			...cambiosPrefs,
			rev: prefs.rev
		});
		setCreando(false);
		if (!r || r.estado === "error" || r.estado === "conflicto") return;
		const planeadas = new Set(resultado.asignaciones.map((a) => a.application_id));
		const conteo = contarTrabajo(pendientes, avisos.datos?.items ?? [], hoy);
		p.alCrear({
			videos: planeadas.size,
			termina: resultado.termina,
			publica_a_mas_tardar: resultado.publica_a_mas_tardar,
			tiendas_por_avisar: conteo.tiendas_por_avisar
		});
		if (prepararMensajes) {
			const primera = resultado.rompe_promesa[0];
			const m = primera ? pendientes.find((x) => x.application_id === primera.application_id) : void 0;
			if (m) control.abrirMensaje({ tienda: m.tienda.tienda_key });
		}
	};
	if (consulta.cargando || planes.cargando) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(PanelPlan_module_default.panel, p.className),
		"aria-busy": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "titulo",
				ancho: "50%"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				alto: 120
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "texto",
				lineas: 2
			})
		]
	});
	if (consulta.error && !consulta.datos) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx$1(PanelPlan_module_default.panel, p.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleAlert",
			titulo: T$1.errorPendientes,
			texto: consulta.error.mensaje,
			accion: {
				etiqueta: T$1.reintentar,
				alPulsar: () => void consulta.refrescar()
			}
		})
	});
	if (candidatas.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx$1(PanelPlan_module_default.panel, p.className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CalendarCheck",
			titulo: T$1.sinPendientesPlan,
			texto: T$1.sinPendientesPlanTexto,
			...p.alSaltar ? { accion: {
				etiqueta: T$1.continuar,
				alPulsar: p.alSaltar
			} } : {}
		})
	});
	const ritmo = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: PanelPlan_module_default.ritmo,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: PanelPlan_module_default.campo,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorNumero, {
					etiqueta: T$1.cuantosPorDia,
					valor: cap,
					min: 1,
					max: 10,
					alCambiar: setCapacidad
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: PanelPlan_module_default.campo,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsDias, {
					etiqueta: T$1.queDias,
					dias: diasEf,
					alCambiar: (d) => setDias(d)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.campo,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: PanelPlan_module_default.etiqueta,
						"aria-hidden": "true",
						children: T$1.desdeCuando
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: PanelPlan_module_default.desde,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
							etiqueta: T$1.desdeCuando,
							anchoCompleto: true,
							valor: otraFecha ? "otra" : desdeEf === hoy ? "hoy" : desdeEf === sumarDias(hoy, 1) ? "manana" : "otra",
							alCambiar: (v) => {
								if (v === "otra") {
									setOtraFecha(true);
									return;
								}
								setOtraFecha(false);
								setDesde(v === "hoy" ? hoy : sumarDias(hoy, 1));
							},
							opciones: [
								{
									valor: "hoy",
									etiqueta: T$1.hoy
								},
								{
									valor: "manana",
									etiqueta: T$1.manana
								},
								{
									valor: "otra",
									etiqueta: T$1.otraFecha
								}
							]
						})
					}),
					otraFecha ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
						etiqueta: T$1.desdeCuando,
						valor: desdeEf,
						min: hoy,
						alCambiar: (f) => setDesde(f)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: PanelPlan_module_default.ayuda,
						children: [T$1.empiezasEl(formato.fechaConDia(desdeEf)), desdeEf === hoy && desdeOmision !== hoy ? T$1.yaPasaronLas6 : ""]
					})
				]
			})
		]
	});
	const avisoProvisional = provisional ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: comun_module_default.avisoInfo,
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "Hourglass",
			tamano: 18
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.modo === "compacto" ? T$1.provisionalCorto : T$1.provisionalLargo })]
	}) : null;
	const avisosReglas = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [resultado.no_alcanza.map((x) => {
		const m = pendientes.find((y) => y.application_id === x.application_id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: comun_module_default.avisoCritico,
			role: "alert",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "CircleAlert",
				tamano: 18
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.noAlcanzas(m ? nombreDe(m.producto) : T$1.unaMuestra, formato.fechaConDia(x.fecha_limite)) })]
		}, `na-${x.application_id}`);
	}), resultado.rompe_promesa.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: comun_module_default.aviso,
		role: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: "CalendarClock",
			tamano: 18
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.rompePromesa(cuenta$1(resultado.rompe_promesa.length, T$1.muestra), resultado.rompe_promesa.length === 1) })]
	}) : null] });
	const vistaPrevia = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: PanelPlan_module_default.previa,
		"aria-label": T$1.vistaPreviaPlan,
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: PanelPlan_module_default.resumen,
			"data-resumen-plan": "",
			children: resumen
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarioPlan, {
			resultado,
			desde: desdeEf,
			dias: diasEf,
			capacidad: cap
		})]
	});
	const botonCrear = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
		variante: "primario",
		tamano: "lg",
		icono: resultado.rompe_promesa.length > 0 ? "MessageCircle" : "CalendarCheck",
		cargando: creando,
		deshabilitado: resultado.asignaciones.length === 0,
		alPulsar: () => void crear(resultado.rompe_promesa.length > 0),
		children: resultado.rompe_promesa.length > 0 ? T$1.crearYPreparar : T$1.crearMiPlan
	});
	if (p.modo === "compacto") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(PanelPlan_module_default.panel, PanelPlan_module_default.compacto, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: PanelPlan_module_default.columnas,
			children: [ritmo, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.lado,
				children: [
					vistaPrevia,
					avisoProvisional,
					avisosReglas
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: PanelPlan_module_default.pie,
			children: [p.alSaltar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "fantasma",
				tamano: "lg",
				alPulsar: p.alSaltar,
				children: T$1.saltar
			}) : null, botonCrear]
		})]
	});
	const titulos = {
		1: T$1.tuRitmo,
		2: T$1.queIncluimos,
		3: T$1.revisaTuPlan
	};
	const siguiente = () => {
		if (paso === 1) setPaso(2);
		else if (paso === 2) {
			if (quitadas.size > 0 && !preguntarQuitadas) setPreguntarQuitadas(true);
			else setPaso(3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx$1(PanelPlan_module_default.panel, PanelPlan_module_default.completo, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: PanelPlan_module_default.pasos,
				"aria-label": T$1.pasoDe(paso, 3),
				children: [
					1,
					2,
					3
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cx$1(PanelPlan_module_default.paso, n === paso && PanelPlan_module_default.pasoActual, n < paso && PanelPlan_module_default.pasoHecho),
					"aria-current": n === paso ? "step" : void 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: PanelPlan_module_default.pasoNumero,
						children: n < paso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Check",
							tamano: 14
						}) : n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: PanelPlan_module_default.pasoTitulo,
						children: titulos[n]
					})]
				}, n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: PanelPlan_module_default.tituloPaso,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: comun_module_default.lector,
					children: [T$1.pasoDe(paso, 3), ": "]
				}), titulos[paso]]
			}),
			paso === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.columnas,
				children: [ritmo, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: PanelPlan_module_default.lado,
					children: vistaPrevia
				})]
			}) : null,
			paso === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.incluir,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: PanelPlan_module_default.opcionesIncluir,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Interruptor, {
							activo: respetar,
							alCambiar: setRespetar,
							etiqueta: T$1.respetarFechas,
							descripcion: T$1.siemprePromesas
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: PanelPlan_module_default.campo,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: PanelPlan_module_default.etiqueta,
								children: T$1.orden
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
								etiqueta: T$1.orden,
								valor: ordenEf,
								alCambiar: setOrden,
								opciones: [{
									valor: "sugerido",
									etiqueta: T$1.sugerido
								}, {
									valor: "por_tipo_de_prenda",
									etiqueta: T$1.porTipo
								}]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListaIncluir, {
						candidatas,
						quitadas,
						alCambiar: setQuitadas
					}),
					preguntarQuitadas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: comun_module_default.aviso,
						role: "alert",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "CircleHelp",
							tamano: 18
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: PanelPlan_module_default.pregunta,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T$1.queHacemosQuitadas(formato.numero(quitadas.size)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: comun_module_default.botones,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
									variante: "secundario",
									tamano: "sm",
									alPulsar: () => {
										setPreguntarQuitadas(false);
										setPaso(3);
									},
									children: T$1.dejarlasDespues
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
									variante: "fantasma",
									tamano: "sm",
									alPulsar: () => {
										const m = candidatas.find((x) => quitadas.has(x.application_id));
										setPreguntarQuitadas(false);
										setPaso(3);
										if (m) control.noSePuede(m);
									},
									children: T$1.noPuedoEstos
								})]
							})]
						})]
					}) : null
				]
			}) : null,
			paso === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.revisar,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: PanelPlan_module_default.ritmoTexto,
						children: [
							cuenta$1(resultado.asignaciones.length, T$1.video),
							" · ",
							formato.numero(cap),
							" ",
							T$1.porDia,
							" · ",
							textoDias(diasEf)
						]
					}),
					resultado.termina ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: PanelPlan_module_default.termina,
						children: [
							T$1.terminasEl,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formato.fechaLarga(resultado.termina) })
						]
					}) : null,
					resultado.publica_a_mas_tardar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: PanelPlan_module_default.publica,
						children: T$1.ultimoPublicado(formato.fechaLarga(resultado.publica_a_mas_tardar))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarioPlan, {
						resultado,
						desde: desdeEf,
						dias: diasEf,
						capacidad: cap
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimerosDias, {
						resultado,
						muestras: pendientes
					}),
					avisoProvisional,
					avisosReglas
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelPlan_module_default.pie,
				children: [paso > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "lg",
					icono: "ArrowLeft",
					alPulsar: () => {
						setPreguntarQuitadas(false);
						setPaso((x) => x === 3 ? 2 : 1);
					},
					children: T$1.atras
				}) : p.alSaltar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "lg",
					alPulsar: p.alSaltar,
					children: T$1.cancelar
				}) : null, paso < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					iconoFinal: "ArrowRight",
					deshabilitado: paso === 2 && incluidas.length === 0,
					alPulsar: siguiente,
					children: T$1.siguiente
				}) : botonCrear]
			})
		]
	});
}
/** Videos por día del plan con GraficaColumnas (@/componentes, una serie, tabla gemela para lectores). */
function CalendarioPlan(p) {
	const fin = p.resultado.termina;
	if (fin === null) return null;
	const puntos = [];
	for (let f = p.desde, i = 0; f <= fin && i < 70; f = sumarDias(f, 1), i++) {
		const n = p.resultado.por_dia[f] ?? 0;
		const trabaja = p.dias.includes(diaSemana(f));
		puntos.push({
			clave: f,
			etiqueta: formato.fechaConDia(f).replace(/ \S+$/, ""),
			valor: n,
			aria: `${formato.fechaConDia(f)}: ${trabaja ? T$1.videosDeCapacidad(formato.numero(n), formato.numero(p.capacidad)) : T$1.noHacesVideosCorto}`
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraficaColumnas, {
		titulo: T$1.videosPorDia,
		puntos,
		formatoEje: (v) => formato.numero(v),
		alto: 132,
		nota: T$1.notaGraficaPlan(formato.numero(p.capacidad)),
		tablaGemela: {
			columnas: [T$1.dia, T$1.videosColumna],
			filas: puntos.map((x) => [formato.fechaConDia(x.clave), formato.numero(x.valor)])
		},
		className: cx$1(PanelPlan_module_default.grafica)
	});
}
/** «La lista de los primeros días» del paso 3 (01 §4.5). */
function PrimerosDias(p) {
	const porFecha = /* @__PURE__ */ new Map();
	for (const a of p.resultado.asignaciones) {
		const m = p.muestras.find((x) => x.application_id === a.application_id);
		if (!m) continue;
		porFecha.set(a.fecha, [...porFecha.get(a.fecha) ?? [], m]);
	}
	const fechas = [...porFecha.keys()].sort().slice(0, 2);
	if (fechas.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: PanelPlan_module_default.primeros,
		children: fechas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: PanelPlan_module_default.dia,
			"aria-label": formato.fechaConDia(f),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: PanelPlan_module_default.diaTitulo,
				children: capitalizar(formato.fechaConDia(f))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: PanelPlan_module_default.diaLista,
				children: (porFecha.get(f) ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: PanelPlan_module_default.diaFila,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
						url: m.producto.imagen,
						alt: "",
						anchoCss: 40,
						proporcion: "1:1",
						radio: "sm",
						tienda: m.tienda.nombre,
						categoria: m.producto.categoria,
						className: cx$1(PanelPlan_module_default.foto40)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: PanelPlan_module_default.diaTextos,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: PanelPlan_module_default.diaNombre,
							children: nombreDe(m.producto)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: PanelPlan_module_default.diaTienda,
							children: m.tienda.nombre
						})]
					})]
				}, m.application_id))
			})]
		}, f))
	});
}
/** Paso 2: lista agrupada por prioridad con casillas (por omisión, todas las promocionables sin video hecho). */
function ListaIncluir(p) {
	const grupos = [
		"urgente",
		"alta",
		"media",
		"baja"
	].map((n) => ({
		nivel: n,
		items: p.candidatas.filter((m) => (m.prioridad ?? "baja") === n)
	})).filter((g) => g.items.length > 0);
	const alternar = (id, incluir) => {
		const s = new Set(p.quitadas);
		if (incluir) s.delete(id);
		else s.add(id);
		p.alCambiar(s);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: PanelPlan_module_default.grupos,
		children: grupos.map((g) => {
			const marcadas = g.items.filter((m) => !p.quitadas.has(m.application_id)).length;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: PanelPlan_module_default.grupo,
				"aria-label": `${T$1.prioridad} ${ETIQUETA_NIVEL[g.nivel].toLowerCase()}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: PanelPlan_module_default.grupoCabeza,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla$1, {
						etiqueta: T$1.prioridadGrupo(ETIQUETA_NIVEL[g.nivel].toLowerCase(), g.items.length),
						marcada: marcadas === g.items.length,
						indeterminada: marcadas > 0 && marcadas < g.items.length,
						alCambiar: (v) => {
							const s = new Set(p.quitadas);
							for (const m of g.items) if (v) s.delete(m.application_id);
							else s.add(m.application_id);
							p.alCambiar(s);
						}
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: PanelPlan_module_default.grupoLista,
					children: g.items.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: PanelPlan_module_default.incluirFila,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Casilla$1, {
							etiqueta: `${nombreDe(m.producto)} · ${m.tienda.nombre}`,
							marcada: !p.quitadas.has(m.application_id),
							alCambiar: (v) => alternar(m.application_id, v),
							className: cx$1(PanelPlan_module_default.incluirCasilla)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
							url: m.producto.imagen,
							alt: "",
							anchoCss: 40,
							proporcion: "1:1",
							radio: "sm",
							tienda: m.tienda.nombre,
							categoria: m.producto.categoria,
							className: cx$1(PanelPlan_module_default.foto40)
						})]
					}, m.application_id))
				})]
			}, g.nivel);
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "POST" }).validator((input) => {
	const name = input?.name?.trim().slice(0, 80) ?? "";
	if (name.length < 2) throw new Error("Falta el nombre del producto.");
	return {
		name,
		vibe: input?.vibe?.trim().slice(0, 240) ?? "",
		fondo: input?.fondo?.trim().slice(0, 80) || "Negro mate"
	};
}).handler(createSsrRpc("951ec8db5b5d1bbfd56241d2b7174582e0b30eb02f3fb78350973e8958649bbd"));
createServerFn({ method: "POST" }).validator((input) => {
	const requestId = input?.requestId?.trim() ?? "";
	if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
	return { requestId };
}).handler(createSsrRpc("e30fb84d6b43c1b6c3c987cf4334505cc987ceb18d40668c7474f210f153c5be"));
var startPack = createServerFn({ method: "POST" }).validator((input) => {
	const color = input?.color?.trim() || "signal-black";
	if (![
		"signal-black",
		"royal-blue",
		"burgundy",
		"white",
		"lilac"
	].includes(color)) throw new Error("Ese color no está en la pieza.");
	return { color };
}).handler(createSsrRpc("f0ab62d1e8fff318d921825b60a5cee05fc4b42c4009a5b0e5c620dc3a74dd36"));
var pollPack = createServerFn({ method: "POST" }).validator((input) => {
	const requestId = input?.requestId?.trim() ?? "";
	if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
	return { requestId };
}).handler(createSsrRpc("4e6d8ecc971f79d80cc2550162ab908ebe0e8187f12ad2f67e6e9660a7e327f7"));
var estadoPack = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(createSsrRpc("57ed82bf473082399decdc5987f46f69931206a58aa28a72cef375d394b78f43"));
/**
* @/raiz · estado de las capas globales que se abren desde cualquier parte: la paleta de búsqueda (Ctrl+K) y el panel
* de atajos ('?'). Un almacén mínimo sin React (useSyncExternalStore).
*
* Abrir la paleta desde una pantalla: spec/ui_firmas/app.d.ts no tiene una función para eso (CampoBusqueda solo recibe
* `alAbrir`), así que el marco también la abre con el evento `corte:buscar` en window, con `?buscar=1` en el hash o
* con un Ctrl+K sintético. `?buscar=<texto>` la abre ya con esa búsqueda. Se anota como faltante de contrato.
*/
var EVENTO_BUSCAR = "corte:buscar";
var estado$1 = {
	paleta: false,
	atajos: false
};
var oyentes = /* @__PURE__ */ new Set();
/** Texto con el que abre la paleta (`?buscar=chaqueta`); vacío con Ctrl+K o `?buscar=1`. */
var textoInicial = "";
function fijar(nuevo) {
	const siguiente = {
		...estado$1,
		...nuevo
	};
	if (siguiente.paleta === estado$1.paleta && siguiente.atajos === estado$1.atajos) return;
	estado$1 = siguiente;
	for (const o of [...oyentes]) o();
}
function suscribir(fn) {
	oyentes.add(fn);
	return () => oyentes.delete(fn);
}
function abrirPaleta(texto = "") {
	textoInicial = texto;
	fijar({
		paleta: true,
		atajos: false
	});
}
function cerrarPaleta() {
	textoInicial = "";
	fijar({ paleta: false });
}
function alternarPaleta() {
	textoInicial = "";
	fijar({
		paleta: !estado$1.paleta,
		atajos: false
	});
}
/** Lo lee la paleta al abrirse (no es reactivo: solo cuenta en la apertura). */
function textoInicialPaleta() {
	return textoInicial;
}
function abrirAtajos() {
	fijar({
		atajos: true,
		paleta: false
	});
}
function cerrarAtajos() {
	fijar({ atajos: false });
}
function usePaletaAbierta() {
	return (0, import_react.useSyncExternalStore)(suscribir, () => estado$1.paleta, () => false);
}
function useAtajosAbiertos() {
	return (0, import_react.useSyncExternalStore)(suscribir, () => estado$1.atajos, () => false);
}
/**
* @/raiz · datos que el marco lee de @/datos: pendientes y avisos (insignias de Muestras y Tiendas, banner de promesa
* vencida) y un reloj que avanza cada 30 s (para «Actualizado hace 4 min»). Las consultas usan los MISMOS parámetros
* que las pantallas, así que comparten caché y se actualizan al instante con el estado local (dominio.contarTrabajo).
*/
/** Pendientes por prioridad: los mismos parámetros que la cola de Muestras (spec/ui_firmas/ejemplo_uso.tsx). */
var PARAMS_PENDIENTES = {
	grupo: [
		"vencida",
		"por_vencer",
		"pausada"
	],
	orden: "prioridad"
};
var SIN_PARAMS$1 = {};
function useTrabajo(activa) {
	const muestras = useConsulta("muestras", PARAMS_PENDIENTES, { activa });
	const avisos = useConsulta("avisos", SIN_PARAMS$1, { activa });
	const items = muestras.datos?.items;
	const listaAvisos = avisos.datos?.items;
	return (0, import_react.useMemo)(() => {
		if (!items) return {
			pendientes: [],
			conteos: null
		};
		return {
			pendientes: items,
			conteos: contarTrabajo(items, listaAvisos ?? [], hoyLocal())
		};
	}, [items, listaAvisos]);
}
/**
* Epoch actual (reloj de @/dominio) para los textos relativos: se lee en cada render y, además, se vuelve a pintar cada
* `cadaMs`. Así, si el reloj cambia (reloj de demostración anclado al llegar la sesión), el siguiente render ya lo usa.
*/
function useAhora(cadaMs = 3e4) {
	const [, setPulso] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const t = window.setInterval(() => setPulso((n) => n + 1), cadaMs);
		return () => window.clearInterval(t);
	}, [cadaMs]);
	return ahoraS();
}
/**
* @/raiz · textos visibles del marco (español de México, vocabulario de 01 §1.5). Los que vienen literales de la spec
* llevan su sección: 01 §3.2–3.6 (navegación y elementos globales), §4.16 (banner y estados transversales), C35, C36.
*/
var T = {
	navPrincipal: "Navegación principal",
	saltar: "Ir al contenido",
	grupoTrabajo: "Tu trabajo",
	grupoEstadisticas: "Estadísticas",
	inicio: "Inicio",
	generar: "Generar",
	muestras: "Muestras",
	tiendas: "Tiendas",
	ventas: "Ventas",
	videos: "Videos",
	productos: "Productos",
	mas: "Más",
	ajustes: "Conexión y ajustes",
	marca: "Corte",
	demo: "Datos de demostración",
	demoCorto: "Demo",
	insigniaMuestras: (n) => n === 1 ? "1 muestra pendiente" : `${n} muestras pendientes`,
	insigniaMuestrasUrgente: (n, urgentes) => `${n === 1 ? "1 muestra pendiente" : `${n} muestras pendientes`}, ${urgentes === 1 ? "1 vence" : `${urgentes} vencen`} en menos de 48 horas`,
	insigniaTiendas: (n) => n === 1 ? "1 tienda por avisar" : `${n} tiendas por avisar`,
	insigniaTiendasPromesas: (n, promesas) => `${n === 1 ? "1 tienda por avisar" : `${n} tiendas por avisar`}, ${promesas === 1 ? "1 promesa vencida" : `${promesas} promesas vencidas`}`,
	segmentoVentas: "Sección de ventas",
	resumen: "Resumen",
	actualizadoHace: (t) => `Actualizado ${t}`,
	sinSincronizar: "Aún sin sincronizar",
	sincronizando: "Sincronizando…",
	sinInternet: "Sin conexión a internet",
	conexionVencida: "Conexión con TikTok vencida",
	sincronizarAhora: "Sincronizar ahora",
	verCelulares: "Ver tus celulares",
	celularConectado: "Celular conectado",
	celularesConectados: (n) => `${n} celulares conectados`,
	sinCelular: "Sin celular",
	emparejarCelular: "Emparejar celular",
	cuentaProblema: "Hay un problema con tu conexión con TikTok",
	pcSincronizando: (paso) => `Tu PC está sincronizando con TikTok (${paso})…`,
	pcSincronizandoSinPaso: "Tu PC está sincronizando con TikTok…",
	actualizandoDesdePc: "Actualizando desde tu PC…",
	desdeTuPc: "desde tu PC",
	bannerReautorizar: "Tu conexión con TikTok se venció. Reautoriza para seguir actualizando tus datos.",
	/** C35: en Android no se reautoriza. */
	bannerReautorizarAndroid: "Tu conexión con TikTok venció. Vuelve a conectar desde Corte en tu PC.",
	bannerPermiso: (que) => `Falta un permiso para actualizar ${que}. Vuelve a autorizar y deja activados todos los permisos.`,
	bannerPermisoAndroid: (que) => `Falta un permiso para actualizar ${que}. Vuelve a autorizar desde Corte en tu PC y deja activados todos los permisos.`,
	bannerClave: "Para conectar con TikTok falta la clave de tu app de Partner Center.",
	bannerSinRegion: "Tu cuenta aún no tiene región de venta en TikTok Shop, así que no podemos leer tus datos. Revísalo en la app de TikTok.",
	bannerRevocado: "Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.",
	bannerPromesa: (tienda, fecha) => `Le prometiste a ${tienda} publicar el ${fecha} y ya pasó.`,
	bannerSinInternet: (cuando) => `Sin conexión a internet. Te mostramos tus últimos datos (${cuando}).`,
	bannerDatosViejos: (fecha) => `Tus datos son del ${fecha}. Sincroniza para ver lo más reciente.`,
	/** 01 §4.16 en dos renglones: la franja de 02 §7.9 («Sin conexión con tu PC · datos del 12 nov, 6:04 p. m.») y debajo
	*  «Tus cambios se guardan y se enviarán al reconectar.» con los cambios por enviar. */
	bannerSinPc: (cuando) => `Sin conexión con tu PC · datos del ${cuando}`,
	bannerSinPcSinFecha: "Sin conexión con tu PC",
	bannerSinPcDetalle: "Tus cambios se guardan y se enviarán al reconectar.",
	cambiosPorEnviar: (n) => n === 1 ? "1 cambio por enviar" : `${n} cambios por enviar`,
	accReautorizar: "Reautorizar",
	accImportar: "Importar desde archivo…",
	accPegarClave: "Pegar clave de la app",
	accReintentar: "Reintentar",
	accEmparejar: "Emparejar de nuevo",
	accPrepararMensaje: "Preparar mensaje",
	accSincronizar: "Sincronizar",
	descartar: "Ocultar este aviso por hoy",
	paletaTitulo: "Buscar",
	paletaPlaceholder: "Busca muestras, tiendas, productos, videos o acciones",
	paletaSinResultados: (q) => `No encontramos “${q}”. Prueba con el nombre de la tienda o del producto.`,
	paletaCargando: "Buscando…",
	paletaNecesitaPc: "Algunos resultados necesitan tu PC encendida.",
	paletaCerrar: "Cerrar la búsqueda",
	paletaAyuda: "Usa ↑ y ↓ para moverte y Enter para abrir",
	grupoAcciones: "Acciones",
	grupoMuestras: "Muestras",
	grupoTiendas: "Tiendas",
	grupoProductos: "Productos",
	grupoVideos: "Videos",
	accionSincronizar: "Sincronizar ahora",
	accionPlan: "Armar mi plan",
	accionAvisar: "Avisar a mis tiendas",
	accionSesion: "Empezar sesión de videos",
	accionGenerar: "Generar video de 10s",
	accionEmparejar: "Emparejar celular",
	accionReautorizar: "Reautorizar TikTok",
	accionVentas: "Ir a Ventas",
	videoSinTitulo: (id) => `Video ${id}`,
	atajosTitulo: "Atajos de teclado",
	atajosDescripcion: "Funcionan cuando no estás escribiendo en un campo.",
	atajosGlobales: "En toda la app",
	atajosPantalla: "En esta pantalla",
	atajoBuscar: "Buscar o ejecutar acción",
	atajoIrInicio: "Ir a Inicio",
	atajoIrGenerar: "Ir a Generar video",
	atajoIrMuestras: "Ir a Muestras",
	atajoIrTiendas: "Ir a Tiendas",
	atajoIrVentas: "Ir a Ventas",
	atajoIrVideos: "Ir a Videos",
	atajoIrProductos: "Ir a Productos",
	atajoSincronizar: "Sincronizar ahora",
	atajoDeshacer: "Deshacer el último cambio de etapa, plan o aviso",
	atajoVerAtajos: "Ver todos los atajos",
	atajoCerrar: "Cerrar panel, diálogo o búsqueda",
	cerrar: "Cerrar",
	deshecho: "Listo: deshicimos tu último cambio",
	nadaQueDeshacer: "No hay cambios recientes para deshacer",
	noSeDeshizo: "No pudimos deshacer el último cambio",
	finSync: (pedidos, muestras) => {
		const partes = [];
		if (pedidos > 0) partes.push(pedidos === 1 ? "1 pedido nuevo" : `${pedidos} pedidos nuevos`);
		if (muestras > 0) partes.push(muestras === 1 ? "1 muestra cambió de estado" : `${muestras} muestras cambiaron de estado`);
		return partes.length ? `Listo: ${partes.join(", ")}.` : "Listo: tus datos están al día.";
	},
	verCambios: "Ver cambios",
	recordatorio: "Recordatorio"
};
/**
* @/raiz · comportamientos globales que monta la App una sola vez (BUILD_SPEC §8.4):
* - atributos de <html> con la tabla EXACTA de §8.4 (C48) + avisarTemaNativo;
* - atajos globales de 01 §3.6 (G + letra, Ctrl+K, '?', Ctrl+R/F5, Ctrl+Z → deshacerUltimo con Toast);
* - notificaciones locales: calcularNotificaciones → programarNotificaciones con antirrebote de 2 s (C32/C44);
* - eventos del hub: ventana.mostrar_ruta, fin de sincronización (aviso con resumen) y recordatorio.vencido (Toast si la
*   ventana está visible, C44);
* - aperturas de la paleta desde fuera (evento corte:buscar, ?buscar=1) y el botón Atrás de Android;
* - reloj de demostración (solo `npm run dev:demo`).
*/
function useAtributosHtml() {
	const entrada = useEntradaAtributos();
	const a = calcularAtributos(entrada);
	const visible = temaVisible(a, entrada.sistemaOscuro);
	const firma = [
		a["data-theme"],
		a["data-density"],
		a["data-platform"],
		a["data-glass"],
		a["data-reduced-motion"],
		a["data-motion"],
		a.guardar
	].join("|");
	const ultimo = (0, import_react.useRef)(a);
	ultimo.current = a;
	(0, import_react.useLayoutEffect)(() => {
		aplicarAtributos(document.documentElement, ultimo.current);
	}, [firma]);
	(0, import_react.useEffect)(() => {
		avisarTemaNativo(visible);
	}, [visible]);
}
/** Ctrl+Z global (01 §3.6, BUILD §8.5 (d)): deshacerUltimo() y un Toast con el resultado. El rechazo (conflicto) se avisa. */
async function deshacerConAviso(deshacerUltimo, mostrar) {
	try {
		mostrar(await deshacerUltimo() ? {
			texto: T.deshecho,
			tono: "ok"
		} : {
			texto: T.nadaQueDeshacer,
			tono: "info"
		});
	} catch (e) {
		mostrar({
			texto: e instanceof ErrorHub ? e.mensaje : T.noSeDeshizo,
			tono: "error"
		});
	}
}
var IR_A = [
	[
		"g i",
		"/inicio",
		T.atajoIrInicio
	],
	[
		"g g",
		"/videos/generar",
		T.atajoIrGenerar
	],
	[
		"g m",
		"/muestras",
		T.atajoIrMuestras
	],
	[
		"g t",
		"/tiendas",
		T.atajoIrTiendas
	],
	[
		"g v",
		"/ventas",
		T.atajoIrVentas
	],
	[
		"g d",
		"/videos",
		T.atajoIrVideos
	],
	[
		"g p",
		"/productos",
		T.atajoIrProductos
	]
];
function useAtajosGlobales(e) {
	const ref = (0, import_react.useRef)(e);
	ref.current = e;
	(0, import_react.useEffect)(() => {
		const navegacion = registrarAtajos(() => [
			...IR_A.map(([teclas, a, descripcion]) => ({
				teclas,
				descripcion,
				accion: () => navegar(a)
			})),
			{
				teclas: "shift+?",
				descripcion: T.atajoVerAtajos,
				accion: abrirAtajos
			},
			{
				teclas: "ctrl+z",
				descripcion: T.atajoDeshacer,
				accion: () => ref.current.deshacer()
			}
		], {
			grupo: "Global",
			oculto: true
		});
		const busqueda = registrarAtajos(() => [{
			teclas: "ctrl+k",
			descripcion: T.atajoBuscar,
			accion: alternarPaleta
		}], {
			grupo: "Global",
			oculto: true,
			enCampos: true
		});
		const recarga = registrarAtajos(() => [{
			teclas: "ctrl+r",
			descripcion: T.atajoSincronizar,
			accion: () => ref.current.sincronizar()
		}, {
			teclas: "F5",
			descripcion: T.atajoSincronizar,
			accion: () => ref.current.sincronizar()
		}], {
			grupo: "Global",
			oculto: true,
			enCampos: true,
			siempre: true
		});
		return () => {
			navegacion.quitar();
			busqueda.quitar();
			recarga.quitar();
		};
	}, []);
}
/** Sincronizar desde un atajo o una acción global: si no se puede (Android sin la PC), no hace nada. */
function useSincronizarConAviso() {
	const sync = useSync();
	const toast = useToast();
	const ref = (0, import_react.useRef)({
		sync,
		toast
	});
	ref.current = {
		sync,
		toast
	};
	return (0, import_react.useRef)(() => {
		const { sync: s, toast: t } = ref.current;
		if (!s.puede || s.estado?.en_curso) return;
		s.sincronizar().catch((err) => t.mostrar({
			texto: err instanceof ErrorHub ? err.mensaje : "No pudimos empezar a sincronizar.",
			tono: "error"
		}));
	}).current;
}
function useDeshacerGlobal() {
	const acciones = useAcciones();
	const toast = useToast();
	const ref = (0, import_react.useRef)({
		acciones,
		toast
	});
	ref.current = {
		acciones,
		toast
	};
	return (0, import_react.useRef)(() => {
		deshacerConAviso(() => ref.current.acciones.deshacerUltimo(), (t) => ref.current.toast.mostrar(t));
	}).current;
}
var ANTIRREBOTE_NOTIFICACIONES_MS = 2e3;
var SIN_PARAMS = {};
var ACTIVOS = { estado: "activo" };
/**
* Recalcula las notificaciones locales cuando cambian muestras, plan, avisos, recordatorios o preferencias y las
* entrega a la plataforma 2 s después del último cambio (reemplaza TODO lo programado). Una lista idéntica no se vuelve
* a mandar.
*/
function useNotificaciones(activa) {
	const muestras = useConsulta("muestras", PARAMS_PENDIENTES, { activa });
	const plan = useConsulta("plan", SIN_PARAMS, { activa });
	const avisos = useConsulta("avisos", SIN_PARAMS, { activa });
	const recordatorios = useConsulta("recordatorios", ACTIVOS, { activa });
	const preferencias = useConsulta("preferencias", SIN_PARAMS, { activa });
	const enviada = (0, import_react.useRef)(null);
	const m = muestras.datos?.items;
	const pl = plan.datos?.items;
	const av = avisos.datos?.items;
	const re = recordatorios.datos?.items;
	const pr = preferencias.datos;
	(0, import_react.useEffect)(() => {
		if (!activa || !m || !pr) return void 0;
		const t = window.setTimeout(() => {
			let lista;
			try {
				lista = calcularNotificaciones({
					muestras: m,
					planes: pl ?? [],
					avisos: av ?? [],
					recordatorios: re ?? [],
					preferencias: pr,
					ahora: ahoraS()
				});
			} catch {
				return;
			}
			const firma = JSON.stringify(lista);
			if (firma === enviada.current) return;
			enviada.current = firma;
			programarNotificaciones(lista).catch(() => {
				enviada.current = null;
			});
		}, ANTIRREBOTE_NOTIFICACIONES_MS);
		return () => window.clearTimeout(t);
	}, [
		activa,
		m,
		pl,
		av,
		re,
		pr
	]);
}
/** Pedidos nuevos y muestras que cambiaron de estado en una sincronización (01 §4.16 «Fin de sincronización»). */
function resumenSync(estado) {
	let pedidos = 0;
	let muestras = 0;
	for (const p of estado.pasos) {
		if (p.paso === "ordenes" || p.paso === "ordenes_anteriores") pedidos += p.nuevos;
		if (p.paso === "muestras" || p.paso === "cumplimientos") muestras = Math.max(muestras, p.cambiados);
	}
	return {
		pedidos,
		muestras
	};
}
function useEventosGlobales() {
	const toast = useToast();
	const ref = (0, import_react.useRef)(toast);
	ref.current = toast;
	useEventoHub((e) => {
		if (e.tipo === "ventana.mostrar_ruta") navegar(e.ruta);
		else if (e.tipo === "recordatorio.vencido") {
			if (typeof document === "undefined" || document.visibilityState === "visible") ref.current.mostrar({
				texto: e.recordatorio.titulo,
				detalle: T.recordatorio,
				tono: "info"
			});
		} else if (e.tipo === "sync.fin") {
			const s = e.estado;
			if (s.ultima_estado !== "ok" && s.ultima_estado !== "parcial") return;
			const r = resumenSync(s);
			const hubo = r.pedidos > 0 || r.muestras > 0;
			if (!hubo && s.origen !== "usuario" && s.origen !== "telefono") return;
			ref.current.mostrar({
				texto: T.finSync(r.pedidos, r.muestras),
				tono: "ok",
				...hubo ? { accion: {
					etiqueta: T.verCambios,
					alPulsar: () => navegar(r.muestras > 0 ? "/muestras" : "/ventas")
				} } : {}
			});
		}
	});
}
function useAperturasPaleta() {
	const pedir = useRuta().consulta.get("buscar");
	(0, import_react.useEffect)(() => {
		const alPedir = () => abrirPaleta();
		window.addEventListener(EVENTO_BUSCAR, alPedir);
		return () => window.removeEventListener(EVENTO_BUSCAR, alPedir);
	}, []);
	(0, import_react.useEffect)(() => {
		if (pedir === null) return;
		abrirPaleta(pedir === "1" ? "" : pedir);
		fijarParametro("buscar", null, { reemplazar: true });
	}, [pedir]);
}
/**
* Último eslabón de la pila de Atrás: vuelve al nivel anterior → a Inicio → deja que la app pase a segundo plano.
* Las hojas, la búsqueda y la selección registran sus propios manejadores encima (el último decide primero).
*/
function useAtrasAndroid(plataforma, paletaAbierta) {
	(0, import_react.useEffect)(() => {
		if (plataforma !== "android") return void 0;
		return registrarAtras(() => {
			if (rutaActual() === "/inicio" && profundidadHistorial() === 0) return false;
			atras();
			return true;
		});
	}, [plataforma]);
	(0, import_react.useEffect)(() => {
		if (plataforma !== "android" || !paletaAbierta) return void 0;
		return registrarAtras(() => {
			cerrarPaleta();
			return true;
		});
	}, [plataforma, paletaAbierta]);
}
var relojAnclado = false;
/**
* Solo en `npm run dev:demo`: los fixtures son una foto del 12 nov 2026 (01 §6.7). Para que «hoy», «Actualizado hace
* 4 min», el plan y los vencimientos cuadren con esos datos, el reloj de @/dominio arranca 4 minutos después de la
* última sincronización de la sesión de demostración y avanza con el tiempo real. Nunca en `vite build` ni con el hub.
*/
function anclarRelojDemo(sesion) {
	if (relojAnclado || !modoDemo() || !sesion) return relojAnclado;
	const ultima = sesion.datos.ultima_sync_ok_at ?? sesion.sync.iniciada_at;
	if (ultima === null) return false;
	const ancla = ultima + 240;
	const inicio = Date.now();
	fijarReloj(() => ancla + Math.floor((Date.now() - inicio) / 1e3));
	relojAnclado = true;
	return true;
}
/**
* @/app · une nombres de clase (los de CSS Modules son `string | undefined` con noUncheckedIndexedAccess) e ignora los
* vacíos. Interno del paquete ui-marco (app/ y raiz/); no sale en el barril.
*/
function cx(...clases) {
	let salida = "";
	for (const c of clases) {
		if (!c) continue;
		salida = salida ? `${salida} ${c}` : c;
	}
	return salida;
}
var rutas_module_default = {
	respaldo: "_respaldo_1i6gb_2",
	esqueleto: "_esqueleto_1i6gb_9",
	esqTitulo: "_esqTitulo_1i6gb_16",
	esqFila: "_esqFila_1i6gb_22"
};
/**
* @/app · carga de pantallas de la tabla de BUILD_SPEC §8.6 SIN acoplar paquetes: las pantallas se descubren con
* import.meta.glob('../pantallas/*\/index.ts') + React.lazy (nunca un import estático), tipadas con las interfaces de
* spec/ui_firmas/pantallas.d.ts (tablaRutas.ts). Las galerías (#/dev/galeria, #/dev/bloques) solo existen con
* import.meta.env.DEV: en `vite build` esa rama es código muerto y no llega al manifiesto (verificar_dist). En
* desarrollo, una pantalla que falta muestra «Pantalla en construcción»; en el build la falta la detecta verificar_dist.
*/
var PANTALLAS = /* #__PURE__ */ Object.assign({
	"../pantallas/ajustes/index.ts": () => import("./ajustes-1Op5sX-B.mjs"),
	"../pantallas/bienvenida/index.ts": () => import("./bienvenida-CV4-ox7m.mjs"),
	"../pantallas/emparejar/index.ts": () => import("./emparejar-C7Wmv5Hb.mjs"),
	"../pantallas/flujos/index.ts": () => import("./flujos-DsXGUdWI.mjs"),
	"../pantallas/inicio/index.ts": () => import("./inicio-DOb-_aCo.mjs"),
	"../pantallas/muestras/index.ts": () => import("./muestras-D0A9nVbZ.mjs"),
	"../pantallas/productos/index.ts": () => import("./productos-Cimyiqzd.mjs"),
	"../pantallas/tiendas/index.ts": () => import("./tiendas-DgRu-YZX.mjs"),
	"../pantallas/ventas/index.ts": () => import("./ventas-C15mq0Vb.mjs"),
	"../pantallas/videos/index.ts": () => import("./videos-D6rOOTo0.mjs")
});
/** Solo en desarrollo: en `vite build` import.meta.env.DEV es `false` y este glob es código muerto. */
var GALERIAS = {};
var CARGADORES$1 = {
	...PANTALLAS,
	...GALERIAS
};
function archivoDeModulo(modulo) {
	if (modulo === "galeria-componentes") return "../componentes/galeria/index.ts";
	if (modulo === "galeria-bloques") return "../bloques/galeria/index.ts";
	return `../pantallas/${modulo}/index.ts`;
}
/** Un lazy por (juego de cargadores, módulo, exportación): las pruebas pasan sus propios cargadores. */
var perezosas = /* @__PURE__ */ new WeakMap();
function componenteDe(m, exporta) {
	if (m === null || typeof m !== "object" || !(exporta in m)) return null;
	const valor = m[exporta];
	return typeof valor === "function" ? valor : null;
}
function pantallaPerezosa(def, cargadores = CARGADORES$1) {
	const cargar = cargadores[archivoDeModulo(def.modulo)];
	if (!cargar) return null;
	let mapa = perezosas.get(cargadores);
	if (!mapa) {
		mapa = /* @__PURE__ */ new Map();
		perezosas.set(cargadores, mapa);
	}
	const clave = `${def.modulo}#${def.exporta}`;
	let c = mapa.get(clave);
	if (!c) {
		c = (0, import_react.lazy)(async () => {
			return { default: componenteDe(await cargar(), def.exporta) ?? (() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnConstruccion, {
				titulo: def.titulo,
				detalle: `Su módulo todavía no exporta ${def.exporta}.`
			})) };
		});
		mapa.set(clave, c);
	}
	return c;
}
/** Desarrollo: la carpeta de la pantalla todavía no existe (o no exporta lo que pide pantallas.d.ts). */
function EnConstruccion(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: rutas_module_default.respaldo,
		"aria-label": p.titulo,
		"data-en-construccion": "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "Clapperboard",
			titulo: "Pantalla en construcción",
			texto: `${p.titulo}: ${p.detalle ?? "esta sección todavía se está armando."}`
		})
	});
}
function RutaDesconocida(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: rutas_module_default.respaldo,
		"aria-label": "Sección no encontrada",
		"data-ruta-desconocida": p.ruta,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstadoVacio, {
			icono: "CircleHelp",
			titulo: "Esta sección no existe",
			texto: "Revisa el enlace o vuelve a Inicio.",
			accion: {
				etiqueta: "Ir a Inicio",
				alPulsar: () => navegar("/inicio")
			}
		})
	});
}
/** Esqueleto con la forma de una pantalla típica mientras llega el código de la pantalla (primera visita). */
function EsqueletoPantalla() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EsqueletoVista, {
		className: cx(rutas_module_default.esqueleto),
		textoLento: "Sigue cargando… revisa la conexión con tu PC",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: rutas_module_default.esqTitulo,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "titulo",
					ancho: "38%"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
					forma: "texto",
					ancho: "24%"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "bloque",
				alto: 220
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: rutas_module_default.esqFila,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, { forma: "kpi" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Esqueleto, {
				forma: "fila",
				lineas: 4
			})
		]
	});
}
/** Pinta la pantalla de la ruta actual (perezosa) con su esqueleto de carga. */
function VistaRuta(p) {
	const r = resolverRuta(p.ruta.ruta);
	if (!r.def) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RutaDesconocida, { ruta: r.ruta });
	const Perezosa = pantallaPerezosa(r.def, p.cargadores ?? CARGADORES$1);
	if (!Perezosa) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnConstruccion, { titulo: r.def.titulo });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoPantalla, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perezosa, {})
	});
}
/** ¿La ruta es la raíz (`#/`, `#`, vacío)? */
function esRaiz(ruta) {
	return ruta === "" || ruta === "/";
}
function decidirArranque(e) {
	if (e.plataforma === "android") {
		if (e.conexionPc && !e.conexionPc.emparejado) return "bienvenida";
		if (e.conexionPc) return "inicio";
	}
	if (e.sesion) return (e.sesion.conexion.estado === "sin_credenciales" || e.sesion.conexion.estado === "sin_autorizar") && !e.sesion.datos.hay_datos ? "bienvenida" : "inicio";
	return e.sesionFallo ? "inicio" : "esperar";
}
var Banner_module_default = {
	banner: "_banner_1smuw_3",
	entrar: "_entrar_1smuw_1",
	cuerpo: "_cuerpo_1smuw_11",
	critico: "_critico_1smuw_19",
	atencion: "_atencion_1smuw_23",
	neutro: "_neutro_1smuw_27",
	icono: "_icono_1smuw_32",
	textos: "_textos_1smuw_53",
	texto: "_texto_1smuw_53",
	detalle: "_detalle_1smuw_69",
	acciones: "_acciones_1smuw_76",
	cerrar: "_cerrar_1smuw_83",
	franja: "_franja_1smuw_108"
};
var ICONO = {
	critico: "CircleAlert",
	atencion: "CircleAlert",
	neutro: "Info"
};
/**
* `franja`: en el celular y la ventana compacta, los avisos neutros (sin conexión con la PC, sin internet) van como una
* franja delgada de estado (02 §7.9) y no como tarjeta: no empujan el encabezado de la pantalla. Los de bloqueo y los de
* atención conservan la tarjeta.
*/
function Banner(p) {
	const b = p.banner;
	const urgente = b.prioridad === 0;
	const franja = !!p.franja && b.tono === "neutro";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Banner_module_default.banner, Banner_module_default[b.tono], franja && Banner_module_default.franja, p.className),
		role: urgente ? "alert" : "status",
		"data-banner": b.id,
		"data-prioridad": b.prioridad,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Banner_module_default.cuerpo,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Banner_module_default.icono,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: ICONO[b.tono],
						tamano: franja ? 16 : 18
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Banner_module_default.textos,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: Banner_module_default.texto,
						children: b.texto
					}), b.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: Banner_module_default.detalle,
						children: b.detalle
					}) : null]
				}),
				b.acciones.length || b.descartable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Banner_module_default.acciones,
					children: [b.acciones.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						tamano: "sm",
						variante: i === 0 && b.tono !== "neutro" ? "secundario" : "fantasma",
						alPulsar: () => p.alAccion(a.accion),
						children: a.etiqueta
					}, a.etiqueta)), b.descartable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: Banner_module_default.cerrar,
						onClick: p.alDescartar,
						"aria-label": T.descartar,
						title: T.descartar,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "X",
							tamano: 16
						})
					}) : null]
				}) : null
			]
		})
	});
}
var VIEJOS_S = 86400;
/** «tus muestras», «tu vitrina»… a partir de los permisos que faltan (01 §4.14 A). */
var QUE_ACTUALIZA = {
	"creator.affiliate_collaboration.read": "tus muestras",
	"creator.showcase.read": "tu vitrina",
	"creator.showcase.write": "tu vitrina",
	"creator.affiliate.info": "tu perfil",
	"creator.affiliate.link.write": "tus enlaces de afiliado"
};
function queActualiza(scopes) {
	const nombres = [];
	for (const s of scopes) {
		const n = QUE_ACTUALIZA[s] ?? "tus datos";
		if (!nombres.includes(n)) nombres.push(n);
	}
	if (nombres.length === 0) return "tus datos";
	if (nombres.length === 1) return nombres[0] ?? "tus datos";
	return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1] ?? ""}`;
}
/** «12 nov, 6:04 p. m.» con espacios duros: la fecha y la hora nunca se parten entre dos renglones. */
function fechaYHora(t) {
	return `${formato.fechaCorta(t)}, ${formato.hora(t)}`.replace(/ /g, "\xA0");
}
/** Todos los banners que aplican, del más prioritario al menos (sin quitar los descartados). */
function calcularBanners(e) {
	const lista = [];
	const android = e.plataforma === "android";
	const s = e.sesion;
	const conexion = s?.conexion;
	if (conexion?.estado === "reautorizar") lista.push(android ? {
		id: "reautorizar",
		prioridad: 0,
		tono: "critico",
		texto: T.bannerReautorizarAndroid,
		acciones: [],
		descartable: false
	} : {
		id: "reautorizar",
		prioridad: 0,
		tono: "critico",
		texto: conexion.aviso ?? T.bannerReautorizar,
		acciones: [{
			etiqueta: T.accReautorizar,
			accion: { tipo: "reautorizar" }
		}],
		descartable: false
	});
	else if (conexion?.estado === "cuenta_sin_region") lista.push({
		id: "sin_region",
		prioridad: 0,
		tono: "critico",
		texto: T.bannerSinRegion,
		acciones: s?.capacidades.sincronizar ? [{
			etiqueta: T.accReintentar,
			accion: { tipo: "sincronizar" }
		}] : [],
		descartable: false
	});
	else if (conexion?.estado === "conectada" && conexion.scopes_faltantes.length > 0) {
		const que = queActualiza(conexion.scopes_faltantes);
		lista.push({
			id: `permiso:${conexion.scopes_faltantes.join(",")}`,
			prioridad: 0,
			tono: "atencion",
			texto: android ? T.bannerPermisoAndroid(que) : T.bannerPermiso(que),
			acciones: android ? [] : [{
				etiqueta: T.accReautorizar,
				accion: { tipo: "reautorizar" }
			}],
			descartable: false
		});
	} else if (!android && conexion?.estado === "sin_credenciales" && s?.datos.hay_datos) lista.push({
		id: "sin_clave",
		prioridad: 0,
		tono: "atencion",
		texto: T.bannerClave,
		acciones: [{
			etiqueta: T.accImportar,
			accion: {
				tipo: "navegar",
				a: "/ajustes/tiktok"
			}
		}, {
			etiqueta: T.accPegarClave,
			accion: {
				tipo: "navegar",
				a: "/ajustes/tiktok"
			}
		}],
		descartable: false
	});
	if (android && e.conexionPc?.revocado) lista.push({
		id: "revocado",
		prioridad: 0,
		tono: "critico",
		texto: T.bannerRevocado,
		acciones: [{
			etiqueta: T.accEmparejar,
			accion: {
				tipo: "navegar",
				a: "/emparejar"
			}
		}],
		descartable: false
	});
	let vencida = null;
	for (const m of e.pendientes) {
		const promesa = m.avisos.promesa;
		if (!m.avisos.promesa_vencida || !promesa) continue;
		if (!vencida || promesa < vencida.promesa) vencida = {
			tienda_key: m.tienda.tienda_key,
			tienda: m.tienda.nombre,
			promesa
		};
	}
	if (vencida) lista.push({
		id: `promesa:${vencida.tienda_key}:${vencida.promesa}`,
		prioridad: 2,
		tono: "critico",
		texto: T.bannerPromesa(vencida.tienda, formato.fechaConDia(vencida.promesa)),
		acciones: [{
			etiqueta: T.accPrepararMensaje,
			accion: {
				tipo: "mensaje_tienda",
				tienda_key: vencida.tienda_key
			}
		}],
		descartable: true
	});
	const sync = s?.sync;
	const ultimaOk = s?.datos.ultima_sync_ok_at ?? sync?.ultima_ok_at ?? null;
	if (android && e.conexionPc?.emparejado && !e.conexionPc.conectado && !e.conexionPc.revocado) {
		const cuando = e.conexionPc.ultima_copia_at ?? e.copiaAt ?? ultimaOk;
		const n = e.conexionPc.cambios_pendientes;
		lista.push({
			id: "sin_pc",
			prioridad: 3,
			tono: "neutro",
			texto: cuando ? T.bannerSinPc(fechaYHora(cuando)) : T.bannerSinPcSinFecha,
			detalle: n > 0 ? `${T.bannerSinPcDetalle} ${T.cambiosPorEnviar(n)}.` : T.bannerSinPcDetalle,
			acciones: [],
			descartable: false
		});
	} else if (!android && sync && !sync.en_curso && sync.ultimo_error?.codigo === "sin_internet") lista.push({
		id: `sin_internet:${sync.ultimo_error.at}`,
		prioridad: 3,
		tono: "neutro",
		texto: T.bannerSinInternet(ultimaOk ? fechaYHora(ultimaOk) : formato.fechaCorta(e.ahora)),
		acciones: [],
		descartable: true
	});
	else if (ultimaOk !== null && e.ahora - ultimaOk > VIEJOS_S && !sync?.en_curso && s?.datos.hay_datos) lista.push({
		id: `datos_viejos:${ultimaOk}`,
		prioridad: 3,
		tono: "atencion",
		texto: T.bannerDatosViejos(formato.fechaCorta(ultimaOk)),
		acciones: s.capacidades.sincronizar ? [{
			etiqueta: T.accSincronizar,
			accion: { tipo: "sincronizar" }
		}] : [],
		descartable: true
	});
	return lista.sort((a, b) => a.prioridad - b.prioridad);
}
/** El único banner visible: el de mayor prioridad que no se descartó en las últimas 24 h (los P0 nunca se descartan). */
function elegirBanner(e) {
	for (const b of calcularBanners(e)) {
		const at = e.descartados[b.id];
		if (b.descartable && at !== void 0 && e.ahora - at < 86400) continue;
		return b;
	}
	return null;
}
var DESTINOS_LATERAL = [
	{
		id: "generar",
		a: "/videos/generar",
		etiqueta: T.generar,
		icono: "Clapperboard",
		atajo: "g g",
		grupo: "trabajo"
	},
	{
		id: "inicio",
		a: "/inicio",
		etiqueta: T.inicio,
		icono: "House",
		atajo: "g i",
		grupo: "trabajo"
	},
	{
		id: "muestras",
		a: "/muestras",
		etiqueta: T.muestras,
		icono: "Package",
		atajo: "g m",
		grupo: "trabajo"
	},
	{
		id: "tiendas",
		a: "/tiendas",
		etiqueta: T.tiendas,
		icono: "Store",
		atajo: "g t",
		grupo: "trabajo"
	},
	{
		id: "ventas",
		a: "/ventas",
		etiqueta: T.ventas,
		icono: "ChartColumn",
		atajo: "g v",
		grupo: "estadisticas"
	},
	{
		id: "videos",
		a: "/videos",
		etiqueta: T.videos,
		icono: "SquarePlay",
		atajo: "g d",
		grupo: "estadisticas"
	},
	{
		id: "productos",
		a: "/productos",
		etiqueta: T.productos,
		icono: "Shirt",
		atajo: "g p",
		grupo: "estadisticas"
	}
];
var DESTINOS_INFERIOR = [
	{
		id: "inicio",
		a: "/inicio",
		etiqueta: T.inicio,
		icono: "House",
		atajo: null,
		grupo: "trabajo"
	},
	{
		id: "generar",
		a: "/videos/generar",
		etiqueta: T.generar,
		icono: "Clapperboard",
		atajo: null,
		grupo: "trabajo"
	},
	{
		id: "muestras",
		a: "/muestras",
		etiqueta: T.muestras,
		icono: "Package",
		atajo: null,
		grupo: "trabajo"
	},
	{
		id: "tiendas",
		a: "/tiendas",
		etiqueta: T.tiendas,
		icono: "Store",
		atajo: null,
		grupo: "trabajo"
	},
	{
		id: "ventas",
		a: "/ventas",
		etiqueta: T.ventas,
		icono: "ChartColumn",
		atajo: null,
		grupo: "estadisticas"
	},
	{
		id: "mas",
		a: "/ajustes",
		etiqueta: T.mas,
		icono: "Ellipsis",
		atajo: null,
		grupo: "estadisticas"
	}
];
/** Qué destino queda activo para una ruta (con o sin barra inferior: ahí Videos y Productos cuentan como Ventas). */
function destinoActivo(ruta, inferior) {
	if (ruta === "/videos/generar") return "generar";
	switch (ruta.split("/")[1] ?? "") {
		case "inicio": return "inicio";
		case "muestras": return "muestras";
		case "tiendas": return "tiendas";
		case "ventas": return "ventas";
		case "videos": return inferior ? "ventas" : "videos";
		case "productos": return inferior ? "ventas" : "productos";
		case "ajustes": return inferior ? "mas" : null;
		default: return null;
	}
}
/**
* C5 · compacta < 600 → barra inferior; media 600–1179 → riel de 80; expandida y amplia → lateral de 248. Android
* siempre barra inferior en teléfono (C41: la tableta, de 600 a 1279, usa el riel). Las pantallas completas
* (Bienvenida, Emparejar) van sin navegación; el detalle de muestra en Android trae su propia barra de acciones.
*/
function modoNav(e) {
	if (e.completa) return "ninguna";
	if (e.clase === "compacta") return e.plataforma === "android" && e.detalleMuestra ? "ninguna" : "inferior";
	if (e.clase === "media") return "riel";
	return e.plataforma === "android" ? "riel" : "lateral";
}
function segmentoVentas(ruta) {
	if (ruta === "/ventas") return "ventas";
	if (ruta === "/videos") return "videos";
	if (ruta === "/productos") return "productos";
	return null;
}
var BarraInferior_module_default = {
	barra: "_barra_1pyou_2",
	oculta: "_oculta_1pyou_13",
	lista: "_lista_1pyou_17",
	celda: "_celda_1pyou_25",
	destino: "_destino_1pyou_28",
	pildora: "_pildora_1pyou_41",
	activo: "_activo_1pyou_57",
	etiqueta: "_etiqueta_1pyou_62",
	insignia: "_insignia_1pyou_75"
};
function BarraInferior(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cx(BarraInferior_module_default.barra, "glass", p.oculta && BarraInferior_module_default.oculta),
		"aria-label": T.navPrincipal,
		"data-nav": "inferior",
		"aria-hidden": p.oculta ? true : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: BarraInferior_module_default.lista,
			role: "list",
			children: DESTINOS_INFERIOR.map((d) => {
				const activo = p.activo === d.id;
				const insignia = p.insignias[d.id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: BarraInferior_module_default.celda,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `#${d.a}`,
						className: cx(BarraInferior_module_default.destino, activo && BarraInferior_module_default.activo),
						"aria-current": activo ? "page" : void 0,
						tabIndex: p.oculta ? -1 : void 0,
						onClick: (e) => {
							e.preventDefault();
							navegar(d.a);
						},
						"data-destino": d.id,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cx(BarraInferior_module_default.pildora, activo && "fc-fill"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: d.icono,
								tamano: 22
							}), insignia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Insignia, {
								...insignia,
								className: cx(BarraInferior_module_default.insignia)
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: BarraInferior_module_default.etiqueta,
							children: d.etiqueta
						})]
					})
				}, d.id);
			})
		})
	});
}
/** Texto del paso actual: el del hub ('Tus ventas recientes: semana 5 de 26…') o la etiqueta del paso. */
function textoPaso(sync) {
	if (!sync) return null;
	const texto = sync.texto.trim().replace(/…$/, "").trim();
	if (texto) return texto;
	return sync.paso_actual ? ETIQUETA_PASO_SYNC[sync.paso_actual] : null;
}
/** 'hace 4 min', 'hoy', 'ayer' o 'el 12 nov'. */
function cuandoRelativo(t, ahora) {
	const r = formato.relativa(t, ahora);
	return /^(hace|hoy|ayer|en )/.test(r) ? r : `el ${r}`;
}
function vistaIndicador(e) {
	const paso = textoPaso(e.sync);
	if (e.android && e.conexionPc?.sync_en_curso) return {
		estado: "sincronizando",
		texto: paso ? T.pcSincronizando(paso.charAt(0).toLowerCase() + paso.slice(1)) : T.pcSincronizandoSinPaso,
		detalle: null
	};
	if (!e.android && e.sync?.en_curso) return {
		estado: "sincronizando",
		texto: T.sincronizando,
		detalle: paso
	};
	if (e.conexion?.estado === "reautorizar") return {
		estado: "error",
		texto: T.conexionVencida,
		detalle: null
	};
	if (!e.android && e.sync?.ultimo_error?.codigo === "sin_internet") return {
		estado: "inactivo",
		texto: T.sinInternet,
		detalle: null
	};
	if (e.ultimaOk !== null) {
		const base = T.actualizadoHace(cuandoRelativo(e.ultimaOk, e.ahora));
		return {
			estado: "ok",
			texto: e.android ? `${base} · ${T.desdeTuPc}` : base,
			detalle: null
		};
	}
	return {
		estado: "inactivo",
		texto: T.sinSincronizar,
		detalle: null
	};
}
var IndicadorSync_module_default = {
	tarjeta: "_tarjeta_1t2jl_4",
	filaSync: "_filaSync_1t2jl_15",
	filaCelular: "_filaCelular_1t2jl_16",
	punto: "_punto_1t2jl_39",
	textoSync: "_textoSync_1t2jl_47",
	accion: "_accion_1t2jl_54",
	error: "_error_1t2jl_64",
	paso: "_paso_1t2jl_76",
	pista: "_pista_1t2jl_90",
	relleno: "_relleno_1t2jl_98",
	riel: "_riel_1t2jl_110",
	botonRiel: "_botonRiel_1t2jl_116",
	puntoRiel: "_puntoRiel_1t2jl_133",
	marcaCelular: "_marcaCelular_1t2jl_143",
	franja: "_franja_1t2jl_155",
	entrar: "_entrar_1t2jl_1",
	franjaActiva: "_franjaActiva_1t2jl_169",
	franjaIcono: "_franjaIcono_1t2jl_172",
	franjaTexto: "_franjaTexto_1t2jl_180",
	franjaPaso: "_franjaPaso_1t2jl_187",
	gira: "_gira_1t2jl_193",
	girar: "_girar_1t2jl_1"
};
function textoCelular(n) {
	if (n <= 0) return T.sinCelular;
	return n === 1 ? T.celularConectado : T.celularesConectados(n);
}
function IndicadorSync(p) {
	const sesion = useSesion();
	const sync = useSync();
	const conexionPc = useConexionPc();
	const toast = useToast();
	const recorrido = useRecorrido("indicador_sync");
	const ahora = useAhora();
	const s = sesion.datos;
	const estadoSync = sync.estado ?? s?.sync ?? null;
	const ultimaOk = s?.datos.ultima_sync_ok_at ?? estadoSync?.ultima_ok_at ?? null;
	const vista = vistaIndicador({
		android: p.android,
		sync: estadoSync,
		conexion: s?.conexion ?? null,
		conexionPc,
		ultimaOk,
		ahora
	});
	const sincronizando = vista.estado === "sincronizando";
	const reautorizar = s?.conexion.estado === "reautorizar";
	const dispositivos = s?.lan?.dispositivos_activos ?? 0;
	const progreso = Math.max(0, Math.min(1, estadoSync?.progreso ?? 0));
	const alPulsar = () => {
		if (reautorizar && !p.android) {
			fijarParametro("reautorizar", "1");
			return;
		}
		if (!sync.puede || sincronizando) return;
		sync.sincronizar().catch((e) => {
			toast.mostrar({
				texto: e instanceof ErrorHub ? e.mensaje : "No pudimos empezar a sincronizar.",
				tono: "error"
			});
		});
	};
	const etiquetaSync = sincronizando ? [vista.texto, vista.detalle].filter(Boolean).join(" ") : reautorizar ? `${vista.texto}. ${T.accReautorizar}` : sync.puede ? `${vista.texto}. ${T.sincronizarAhora}` : vista.texto;
	const burbuja = (hijo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BurbujaRecorrido, {
		visible: recorrido.visible,
		texto: recorrido.texto,
		esUltimo: recorrido.esUltimo,
		alSiguiente: recorrido.siguiente,
		alEntendido: recorrido.entendido,
		children: hijo
	});
	if (p.variante === "franja") {
		if (!sincronizando && !recorrido.visible) return null;
		return burbuja(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(IndicadorSync_module_default.franja, sincronizando && IndicadorSync_module_default.franjaActiva),
			role: "status",
			"data-indicador-sync": "franja",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: IndicadorSync_module_default.franjaIcono,
				"aria-hidden": "true",
				children: sincronizando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "RefreshCw",
					tamano: 16,
					className: cx(IndicadorSync_module_default.gira, "anim-loop")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, { estado: "ok" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: IndicadorSync_module_default.franjaTexto,
				children: [vista.texto, vista.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: IndicadorSync_module_default.franjaPaso,
					children: [" ", vista.detalle]
				}) : null]
			})]
		}));
	}
	if (p.variante === "riel") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: IndicadorSync_module_default.riel,
		"data-indicador-sync": "riel",
		children: [burbuja(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: IndicadorSync_module_default.botonRiel,
			onClick: alPulsar,
			"aria-label": etiquetaSync,
			title: etiquetaSync,
			"aria-disabled": !sync.puede && !reautorizar ? true : void 0,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "RefreshCw",
				tamano: 20,
				className: cx(sincronizando && IndicadorSync_module_default.gira, sincronizando && "anim-loop")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: IndicadorSync_module_default.puntoRiel,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, {
					estado: vista.estado,
					...ultimaOk !== null ? { pulsos: ultimaOk } : {}
				})
			})]
		})), p.android ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: IndicadorSync_module_default.botonRiel,
			onClick: () => navegar("/ajustes/celular"),
			"aria-label": textoCelular(dispositivos),
			title: textoCelular(dispositivos),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Smartphone",
				tamano: 20
			}), dispositivos > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: IndicadorSync_module_default.marcaCelular,
				"aria-hidden": "true"
			}) : null]
		})]
	});
	return burbuja(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(IndicadorSync_module_default.tarjeta, IndicadorSync_module_default[vista.estado]),
		"data-indicador-sync": "lateral",
		"data-estado": vista.estado,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: IndicadorSync_module_default.filaSync,
				onClick: alPulsar,
				"aria-label": etiquetaSync,
				"aria-disabled": !sync.puede && !reautorizar ? true : void 0,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: IndicadorSync_module_default.punto,
						"aria-hidden": "true",
						children: sincronizando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "RefreshCw",
							tamano: 14,
							className: cx(IndicadorSync_module_default.gira, "anim-loop")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuntoVivo, {
							estado: vista.estado,
							...ultimaOk !== null ? { pulsos: ultimaOk } : {}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: IndicadorSync_module_default.textoSync,
						children: vista.texto
					}),
					!sincronizando && (sync.puede || reautorizar) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: reautorizar ? "ArrowRight" : "RefreshCw",
						tamano: 14,
						className: cx(IndicadorSync_module_default.accion)
					}) : null
				]
			}),
			sincronizando ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [vista.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: IndicadorSync_module_default.paso,
				title: vista.detalle,
				children: vista.detalle
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: IndicadorSync_module_default.pista,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(IndicadorSync_module_default.relleno, "fc-fill"),
					style: { "--avance": String(progreso) }
				})
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: IndicadorSync_module_default.filaCelular,
				onClick: () => navegar("/ajustes/celular"),
				"aria-label": `${textoCelular(dispositivos)}. ${dispositivos > 0 ? T.verCelulares : T.emparejarCelular}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Smartphone",
					tamano: 14
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: textoCelular(dispositivos) })]
			})
		]
	}));
}
var Logo_module_default = {
	logo: "_logo_fnv6k_2",
	fondo: "_fondo_fnv6k_6",
	lima: "_lima_fnv6k_9",
	papel: "_papel_fnv6k_12"
};
function Logo(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: Logo_module_default.logo,
		width: p.tamano,
		height: p.tamano,
		viewBox: "0 0 1024 1024",
		"aria-hidden": "true",
		focusable: "false",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			className: Logo_module_default.fondo,
			width: "1024",
			height: "1024",
			rx: "232"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: "translate(18 -6)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: Logo_module_default.lima,
				d: "M741.81 319.16A300 300 0 0 0 278.45 700.29L398.82 579.93A132 132 0 0 1 613.12 427.15Z"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: Logo_module_default.papel,
				d: "M323.71 745.55A300 300 0 0 0 741.81 704.84L613.12 596.85A132 132 0 0 1 444.07 625.18Z",
				transform: "translate(-15.56 15.56)"
			})]
		})]
	});
}
var BarraLateral_module_default = {
	barra: "_barra_1non8_2",
	lateral: "_lateral_1non8_18",
	riel: "_riel_1non8_22",
	marca: "_marca_1non8_29",
	wordmark: "_wordmark_1non8_38",
	demo: "_demo_1non8_46",
	demoPunto: "_demoPunto_1non8_67",
	grupo: "_grupo_1non8_75",
	overline: "_overline_1non8_78",
	separador: "_separador_1non8_88",
	lista: "_lista_1non8_98",
	item: "_item_1non8_108",
	activo: "_activo_1non8_130",
	icono: "_icono_1non8_136",
	etiqueta: "_etiqueta_1non8_148",
	atajo: "_atajo_1non8_155",
	insignia: "_insignia_1non8_164",
	insigniaRiel: "_insigniaRiel_1non8_194",
	relleno: "_relleno_1non8_202",
	pie: "_pie_1non8_206",
	cuenta: "_cuenta_1non8_216",
	avatar: "_avatar_1non8_226",
	puntoProblema: "_puntoProblema_1non8_235",
	engrane: "_engrane_1non8_245",
	sr: "_sr_1non8_253"
};
/** Insignias de 01 §3.2: Muestras ámbar = pendientes, roja = por vencer (gana la roja); Tiendas ámbar = por avisar, roja = promesas vencidas. */
function insigniasNav(c) {
	if (!c) return {};
	const r = {};
	if (c.pendientes > 0) r.muestras = c.por_vencer_48h > 0 ? {
		valor: c.pendientes,
		variante: "critica",
		etiqueta: T.insigniaMuestrasUrgente(c.pendientes, c.por_vencer_48h)
	} : {
		valor: c.pendientes,
		variante: "atencion",
		etiqueta: T.insigniaMuestras(c.pendientes)
	};
	if (c.tiendas_por_avisar > 0 || c.promesas_vencidas > 0) r.tiendas = c.promesas_vencidas > 0 ? {
		valor: c.tiendas_por_avisar > 0 ? c.tiendas_por_avisar : c.promesas_vencidas,
		variante: "critica",
		etiqueta: T.insigniaTiendasPromesas(c.tiendas_por_avisar, c.promesas_vencidas)
	} : {
		valor: c.tiendas_por_avisar,
		variante: "atencion",
		etiqueta: T.insigniaTiendas(c.tiendas_por_avisar)
	};
	return r;
}
function irA(a) {
	return (e) => {
		e.preventDefault();
		navegar(a);
	};
}
function Item(p) {
	const { d } = p;
	const atajo = d.atajo ? d.atajo.toUpperCase() : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: `#${d.a}`,
		className: cx(BarraLateral_module_default.item, p.activo && BarraLateral_module_default.activo),
		"aria-current": p.activo ? "page" : void 0,
		"aria-keyshortcuts": atajo ?? void 0,
		title: p.riel ? d.etiqueta : void 0,
		onClick: irA(d.a),
		"data-destino": d.id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: BarraLateral_module_default.icono,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: d.icono,
					tamano: 20
				}), p.riel && p.insignia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Insignia, {
					...p.insignia,
					className: cx(BarraLateral_module_default.insigniaRiel)
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: BarraLateral_module_default.etiqueta,
				children: d.etiqueta
			}),
			!p.riel && atajo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, {
				className: cx(BarraLateral_module_default.atajo),
				children: atajo
			}) : null,
			!p.riel && p.insignia ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Insignia, {
				...p.insignia,
				className: cx(BarraLateral_module_default.insignia)
			}) : null
		]
	}) });
}
function BarraLateral(p) {
	const riel = p.modo === "riel";
	const sesion = useSesion();
	const cuenta = sesion.datos?.cuenta ?? null;
	const conexion = sesion.datos?.conexion;
	const problema = !!conexion && (conexion.estado !== "conectada" || conexion.scopes_faltantes.length > 0);
	const etiquetaCuenta = cuenta ? `${T.ajustes} · @${cuenta.username}` : T.ajustes;
	const grupo = (id, titulo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: BarraLateral_module_default.grupo,
		role: "group",
		"aria-label": titulo,
		children: [riel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: BarraLateral_module_default.separador,
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: BarraLateral_module_default.overline,
			"aria-hidden": "true",
			children: titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: BarraLateral_module_default.lista,
			role: "list",
			children: DESTINOS_LATERAL.filter((d) => d.grupo === id).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
				d,
				activo: p.activo === d.id,
				riel,
				insignia: p.insignias[d.id]
			}, d.id))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: cx(BarraLateral_module_default.barra, riel ? BarraLateral_module_default.riel : BarraLateral_module_default.lateral),
		"aria-label": T.navPrincipal,
		"data-nav": p.modo,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: BarraLateral_module_default.marca,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { tamano: riel ? 32 : 30 }), riel ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: BarraLateral_module_default.wordmark,
					children: T.marca
				})]
			}),
			p.demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: BarraLateral_module_default.demo,
				title: T.demo,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: BarraLateral_module_default.demoPunto,
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: riel ? BarraLateral_module_default.sr : void 0,
						children: T.demo
					}),
					riel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: T.demoCorto
					}) : null
				]
			}) : null,
			grupo("trabajo", T.grupoTrabajo),
			grupo("estadisticas", T.grupoEstadisticas),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: BarraLateral_module_default.relleno }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: BarraLateral_module_default.pie,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicadorSync, {
					variante: riel ? "riel" : "lateral",
					android: false
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#/ajustes",
					className: cx(BarraLateral_module_default.item, BarraLateral_module_default.cuenta, p.enAjustes && BarraLateral_module_default.activo),
					"aria-current": p.enAjustes ? "page" : void 0,
					"aria-label": problema ? `${etiquetaCuenta}. ${T.cuentaProblema}` : etiquetaCuenta,
					title: riel ? etiquetaCuenta : void 0,
					onClick: irA("/ajustes"),
					"data-destino": "ajustes",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: BarraLateral_module_default.avatar,
						children: [cuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarCuenta, {
							url: cuenta.avatar,
							username: cuenta.username,
							tamano: 32
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Settings",
							tamano: 20
						}), problema ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(BarraLateral_module_default.puntoProblema, "fc-fill"),
							"aria-hidden": "true"
						}) : null]
					}), riel ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: BarraLateral_module_default.etiqueta,
						children: cuenta ? `@${cuenta.username}` : T.ajustes
					}), cuenta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Settings",
						tamano: 18,
						className: cx(BarraLateral_module_default.engrane)
					}) : null] })]
				})]
			})
		]
	});
}
/** Acciones de 01 §3.5, en su orden. Reautorizar no existe en Android (C35); emparejar va a la pantalla del celular. */
function accionesPaleta(e) {
	return [
		e.puedeSincronizar ? {
			id: "sincronizar",
			etiqueta: T.accionSincronizar,
			icono: "RefreshCw",
			claves: "actualizar tiktok datos"
		} : null,
		{
			id: "plan",
			etiqueta: T.accionPlan,
			icono: "CalendarDays",
			claves: "plan agenda fechas"
		},
		{
			id: "avisar",
			etiqueta: T.accionAvisar,
			icono: "MessageCircle",
			claves: "mensaje tiendas aviso"
		},
		{
			id: "sesion",
			etiqueta: T.accionSesion,
			icono: "Clapperboard",
			claves: "grabar videos enfoque"
		},
		{
			id: "generar",
			etiqueta: T.accionGenerar,
			icono: "Sparkles",
			claves: "generar video ugc product hold corte 10s"
		},
		{
			id: "emparejar",
			etiqueta: T.accionEmparejar,
			icono: "Smartphone",
			claves: "celular telefono qr pc"
		},
		e.puedeReautorizar && !e.android ? {
			id: "reautorizar",
			etiqueta: T.accionReautorizar,
			icono: "Link",
			claves: "conexion autorizacion cuenta"
		} : null,
		{
			id: "ventas",
			etiqueta: T.accionVentas,
			icono: "ChartColumn",
			claves: "comision pedidos dinero"
		}
	].filter((a) => a !== null);
}
function enc(s) {
	return encodeURIComponent(s);
}
/** Muestras: producto (título corto o completo), tienda y variante. */
function deMuestra(m) {
	const nombre = m.producto.titulo_corto ?? nombreCorto(m.producto.titulo);
	return {
		id: `muestra-${m.application_id}`,
		tipo: "muestra",
		titulo: nombre || formato.idCorto(m.application_id),
		detalle: [
			m.tienda.nombre,
			m.variante,
			m.etiqueta
		].filter((x) => !!x).join(" · "),
		imagen: m.producto.imagen,
		tienda: m.tienda.nombre,
		categoria: m.producto.categoria,
		icono: null,
		destino: {
			tipo: "ruta",
			a: `/muestras/m/${enc(m.application_id)}`
		}
	};
}
function deTienda(t) {
	return {
		id: `tienda-${t.tienda_key}`,
		tipo: "tienda",
		titulo: t.nombre,
		detalle: t.salud_porque,
		imagen: null,
		tienda: t.nombre,
		categoria: null,
		icono: null,
		destino: {
			tipo: "ruta",
			a: `/tiendas/${enc(t.tienda_key)}`
		}
	};
}
function deProducto(p) {
	const nombre = p.titulo_corto ?? nombreCorto(p.titulo);
	return {
		id: `producto-${p.product_id}`,
		tipo: "producto",
		titulo: nombre || formato.idCorto(p.product_id),
		detalle: [p.tienda_nombre, `${formato.dinero(p.comision_estimada_centavos)} de comisión`].filter((x) => !!x).join(" · "),
		imagen: p.imagen,
		tienda: p.tienda_nombre,
		categoria: null,
		icono: null,
		destino: {
			tipo: "ruta",
			a: `/productos/${enc(p.product_id)}`
		}
	};
}
function deVideo(v, nombreProducto) {
	return {
		id: `video-${v.content_id}`,
		tipo: "video",
		titulo: v.titulo ?? nombreProducto ?? T.videoSinTitulo(formato.idCorto(v.content_id)),
		detalle: [v.tienda_principal, `${formato.dinero(v.comision_estimada_centavos)} de comisión`].filter((x) => !!x).join(" · "),
		imagen: v.miniatura,
		tienda: v.tienda_principal,
		categoria: null,
		icono: null,
		destino: {
			tipo: "ruta",
			a: `/videos/${enc(v.content_id)}`
		}
	};
}
function deAccion(a) {
	return {
		id: `accion-${a.id}`,
		tipo: "accion",
		titulo: a.etiqueta,
		detalle: "",
		imagen: null,
		tienda: null,
		categoria: null,
		icono: a.icono,
		destino: {
			tipo: "accion",
			accion: a.id
		}
	};
}
/**
* Resultados agrupados para `consulta`. Sin texto: solo las acciones. Con texto: acciones que coinciden y hasta
* `max` resultados por grupo, en el orden de las listas (las muestras ya vienen por prioridad; tiendas, productos y
* videos por comisión). Grupos vacíos se omiten.
*/
function buscarEnPaleta(consulta, fuentes, acciones, max = 5) {
	const q = consulta.trim();
	const grupos = [];
	const accionesQ = q ? acciones.filter((a) => coincide(q, a.etiqueta, a.claves)) : acciones.slice();
	if (!q) return accionesQ.length ? [{
		id: "accion",
		titulo: T.grupoAcciones,
		resultados: accionesQ.map(deAccion)
	}] : [];
	const muestras = [];
	for (const m of fuentes.muestras) {
		if (muestras.length >= max) break;
		if (coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante, m.application_id)) muestras.push(deMuestra(m));
	}
	const tiendas = [];
	for (const t of fuentes.tiendas) {
		if (tiendas.length >= max) break;
		if (coincide(q, t.nombre, t.tienda_key)) tiendas.push(deTienda(t));
	}
	const productos = [];
	const nombrePorImagen = /* @__PURE__ */ new Map();
	for (const p of fuentes.productos) {
		const nombre = p.titulo_corto ?? nombreCorto(p.titulo);
		if (p.imagen && nombre) nombrePorImagen.set(p.imagen, nombre);
		if (productos.length >= max) continue;
		if (coincide(q, p.titulo_corto, p.titulo, p.tienda_nombre, p.product_id)) productos.push(deProducto(p));
	}
	const videos = [];
	for (const v of fuentes.videos) {
		if (videos.length >= max) break;
		const producto = v.miniatura ? nombrePorImagen.get(v.miniatura) ?? null : null;
		if (coincide(q, v.titulo, producto, v.content_id, v.tienda_principal)) videos.push(deVideo(v, producto));
	}
	if (accionesQ.length) grupos.push({
		id: "accion",
		titulo: T.grupoAcciones,
		resultados: accionesQ.map(deAccion)
	});
	if (muestras.length) grupos.push({
		id: "muestra",
		titulo: T.grupoMuestras,
		resultados: muestras
	});
	if (tiendas.length) grupos.push({
		id: "tienda",
		titulo: T.grupoTiendas,
		resultados: tiendas
	});
	if (productos.length) grupos.push({
		id: "producto",
		titulo: T.grupoProductos,
		resultados: productos
	});
	if (videos.length) grupos.push({
		id: "video",
		titulo: T.grupoVideos,
		resultados: videos
	});
	return grupos;
}
/** Lista plana en el orden en que se pintan (para ↑/↓). */
function aplanar(grupos) {
	return grupos.flatMap((g) => g.resultados);
}
var Paleta_module_default = {
	velo: "_velo_vycsn_2",
	aparecer: "_aparecer_vycsn_1",
	paleta: "_paleta_vycsn_14",
	crecer: "_crecer_vycsn_1",
	campo: "_campo_vycsn_28",
	lupa: "_lupa_vycsn_40",
	entrada: "_entrada_vycsn_44",
	borrar: "_borrar_vycsn_68",
	volver: "_volver_vycsn_69",
	kbd: "_kbd_vycsn_88",
	resultados: "_resultados_vycsn_93",
	grupo: "_grupo_vycsn_102",
	grupoTitulo: "_grupoTitulo_vycsn_107",
	opcion: "_opcion_vycsn_117",
	activa: "_activa_vycsn_128",
	icono: "_icono_vycsn_143",
	foto: "_foto_vycsn_157",
	avatar: "_avatar_vycsn_161",
	textos: "_textos_vycsn_164",
	titulo: "_titulo_vycsn_171",
	detalle: "_detalle_vycsn_172",
	marca: "_marca_vycsn_187",
	enter: "_enter_vycsn_193",
	vacio: "_vacio_vycsn_197",
	vacioIcono: "_vacioIcono_vycsn_209",
	estado: "_estado_vycsn_218",
	pie: "_pie_vycsn_227",
	sr: "_sr_vycsn_244",
	veloCompleta: "_veloCompleta_vycsn_254",
	completa: "_completa_vycsn_259",
	entrarPantalla: "_entrarPantalla_vycsn_1",
	pista: "_pista_vycsn_280"
};
/**
* @/raiz · paleta de búsqueda global (01 §3.5, 02 §7.10). Windows: popover de 560 arriba al centro (surface-3, radio 14,
* shadow-3) con resultados agrupados, miniaturas y avatares; la coincidencia va en <mark>. Android y ventana compacta:
* ocupa la pantalla. Combobox accesible: ↑/↓ mueven, Enter abre, Esc cierra y el foco vuelve a donde estaba.
*/
var VACIAS = {
	muestras: [],
	tiendas: [],
	productos: [],
	videos: []
};
/** Trae las 4 listas una vez por apertura (comparten la caché de @/datos con las pantallas). */
function useFuentes(abierta) {
	const [carga, setCarga] = (0, import_react.useState)({
		fuentes: VACIAS,
		cargando: false,
		necesitaPc: false
	});
	(0, import_react.useEffect)(() => {
		if (!abierta) return void 0;
		let vigente = true;
		setCarga((c) => ({
			...c,
			cargando: true
		}));
		const leer = (p) => p.catch((e) => e instanceof ErrorHub ? e : null);
		Promise.all([
			leer(consultar("muestras", { orden: "prioridad" })),
			leer(consultar("tiendas", {})),
			leer(consultar("productos", {})),
			leer(consultar("videos", {}))
		]).then(([m, t, p, v]) => {
			if (!vigente) return;
			const lista = (r) => r && !(r instanceof ErrorHub) ? r.items : [];
			const necesitaPc = [
				m,
				t,
				p,
				v
			].some((r) => r instanceof ErrorHub && r.codigo === "necesita_pc");
			setCarga({
				fuentes: {
					muestras: lista(m),
					tiendas: lista(t),
					productos: lista(p),
					videos: lista(v)
				},
				cargando: false,
				necesitaPc
			});
		});
		return () => {
			vigente = false;
		};
	}, [abierta]);
	return carga;
}
function Resaltado(p) {
	const rangos = p.busqueda.trim() ? resaltar(p.busqueda, p.texto) : [];
	if (rangos.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: p.texto });
	const partes = [];
	let i = 0;
	rangos.forEach(([a, b], k) => {
		if (a > i) partes.push(p.texto.slice(i, a));
		partes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {
			className: Paleta_module_default.marca,
			children: p.texto.slice(a, b)
		}, k));
		i = b;
	});
	if (i < p.texto.length) partes.push(p.texto.slice(i));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: partes });
}
function Miniatura(p) {
	const r = p.r;
	if (r.tipo === "accion") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: Paleta_module_default.icono,
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: r.icono ?? "ArrowRight",
			tamano: 18
		})
	});
	if (r.tipo === "tienda") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
		nombre: r.titulo,
		tamano: 40,
		className: cx(Paleta_module_default.avatar)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: Paleta_module_default.foto,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Foto, {
			url: r.imagen,
			alt: "",
			anchoCss: 40,
			proporcion: "1:1",
			radio: "sm",
			tienda: r.tienda,
			categoria: r.categoria
		})
	});
}
function Paleta(p) {
	const [texto, setTexto] = (0, import_react.useState)("");
	const [activo, setActivo] = (0, import_react.useState)(0);
	const campo = (0, import_react.useRef)(null);
	const lista = (0, import_react.useRef)(null);
	const previo = (0, import_react.useRef)(null);
	const idLista = (0, import_react.useId)();
	const idTitulo = (0, import_react.useId)();
	const carga = useFuentes(p.abierta);
	const grupos = (0, import_react.useMemo)(() => buscarEnPaleta(texto, carga.fuentes, p.acciones), [
		texto,
		carga.fuentes,
		p.acciones
	]);
	const planos = (0, import_react.useMemo)(() => aplanar(grupos), [grupos]);
	(0, import_react.useEffect)(() => {
		if (!p.abierta) return void 0;
		previo.current = document.activeElement;
		setTexto(textoInicialPaleta());
		setActivo(0);
		const t = window.setTimeout(() => campo.current?.focus(), 0);
		return () => {
			window.clearTimeout(t);
			const antes = previo.current;
			if (antes instanceof HTMLElement && antes.isConnected) antes.focus({ preventScroll: true });
		};
	}, [p.abierta]);
	(0, import_react.useEffect)(() => {
		setActivo(0);
	}, [texto]);
	(0, import_react.useEffect)(() => {
		const el = lista.current?.querySelector("[aria-selected=\"true\"]");
		if (el instanceof HTMLElement && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
	}, [activo]);
	if (!p.abierta) return null;
	const actual = planos[Math.min(activo, planos.length - 1)];
	const alTecla = (e) => {
		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			p.alCerrar();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (planos.length) setActivo((i) => (i + 1) % planos.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (planos.length) setActivo((i) => (i - 1 + planos.length) % planos.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (actual) p.alElegir(actual);
		} else if (e.key === "Tab") {
			const enfocables = Array.from(e.currentTarget.querySelectorAll("input, button"));
			const siguiente = enfocables[(enfocables.indexOf(document.activeElement) + (e.shiftKey ? -1 : 1) + enfocables.length) % enfocables.length];
			e.preventDefault();
			siguiente?.focus();
		}
	};
	const vacia = texto.trim() !== "" && planos.length === 0 && !carga.cargando;
	let indice = -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Paleta_module_default.velo, p.completa && Paleta_module_default.veloCompleta),
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) p.alCerrar();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": idTitulo,
			className: cx(Paleta_module_default.paleta, p.completa && Paleta_module_default.completa),
			onKeyDown: alTecla,
			"data-paleta": "",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: idTitulo,
					className: Paleta_module_default.sr,
					children: T.paletaTitulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Paleta_module_default.campo,
					children: [
						p.completa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: Paleta_module_default.volver,
							onClick: p.alCerrar,
							"aria-label": T.paletaCerrar,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "ArrowLeft",
								tamano: 22
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Search",
							tamano: 18,
							className: cx(Paleta_module_default.lupa)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: campo,
							className: Paleta_module_default.entrada,
							type: "search",
							role: "combobox",
							"aria-expanded": "true",
							"aria-controls": idLista,
							"aria-autocomplete": "list",
							"aria-activedescendant": actual ? `${idLista}-${actual.id}` : void 0,
							"aria-label": T.paletaPlaceholder,
							placeholder: p.completa ? T.paletaTitulo : T.paletaPlaceholder,
							value: texto,
							onChange: (e) => setTexto(e.target.value),
							autoComplete: "off",
							spellCheck: false
						}),
						texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: Paleta_module_default.borrar,
							onClick: () => {
								setTexto("");
								campo.current?.focus();
							},
							"aria-label": "Borrar la búsqueda",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "X",
								tamano: 16
							})
						}) : null,
						p.completa ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, {
							className: cx(Paleta_module_default.kbd),
							children: "Esc"
						})
					]
				}),
				p.completa && !texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: Paleta_module_default.pista,
					"aria-hidden": "true",
					children: T.paletaPlaceholder
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: lista,
					id: idLista,
					role: "listbox",
					"aria-label": T.paletaTitulo,
					className: Paleta_module_default.resultados,
					children: [
						grupos.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "group",
							"aria-label": g.titulo,
							className: Paleta_module_default.grupo,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: Paleta_module_default.grupoTitulo,
								"aria-hidden": "true",
								children: g.titulo
							}), g.resultados.map((r) => {
								indice += 1;
								const i = indice;
								const sel = actual?.id === r.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									id: `${idLista}-${r.id}`,
									role: "option",
									"aria-selected": sel,
									className: cx(Paleta_module_default.opcion, sel && Paleta_module_default.activa),
									onMouseMove: () => {
										if (activo !== i) setActivo(i);
									},
									onMouseDown: (e) => e.preventDefault(),
									onClick: () => p.alElegir(r),
									"data-tipo": r.tipo,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Miniatura, { r }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: Paleta_module_default.textos,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: Paleta_module_default.titulo,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resaltado, {
													busqueda: texto,
													texto: r.titulo
												})
											}), r.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: Paleta_module_default.detalle,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resaltado, {
													busqueda: texto,
													texto: r.detalle
												})
											}) : null]
										}),
										sel && !p.completa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: Paleta_module_default.enter,
											"aria-hidden": "true",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
												nombre: "ArrowRight",
												tamano: 16
											})
										}) : null
									]
								}, r.id);
							})]
						}, g.id)),
						vacia ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: Paleta_module_default.vacio,
							role: "status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: Paleta_module_default.vacioIcono,
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
									nombre: "Search",
									tamano: 20
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: T.paletaSinResultados(texto.trim()) })]
						}) : null,
						carga.cargando && texto.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: Paleta_module_default.estado,
							role: "status",
							children: T.paletaCargando
						}) : null,
						carga.necesitaPc && texto.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: Paleta_module_default.estado,
							children: T.paletaNecesitaPc
						}) : null
					]
				}),
				p.completa ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Paleta_module_default.pie,
					"aria-hidden": "true",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "↑" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "↓" }),
							" para moverte"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "Enter" }), " para abrir"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: "Esc" }), " para cerrar"] })
					]
				})
			]
		})
	});
}
var PanelAtajos_module_default = {
	panel: "_panel_do451_2",
	seccion: "_seccion_do451_12",
	titulo: "_titulo_do451_17",
	lista: "_lista_do451_26",
	fila: "_fila_do451_31",
	descripcion: "_descripcion_do451_43",
	teclas: "_teclas_do451_49",
	alternativa: "_alternativa_do451_58",
	combinacion: "_combinacion_do451_59",
	paso: "_paso_do451_60",
	luego: "_luego_do451_65"
};
/** 'ctrl+k' → ['Ctrl', 'K'] · 'g i' → ['G', 'I'] (secuencia) · 'shift+?' → ['?'] · 'Escape' → ['Esc']. */
function teclasVisibles(teclas) {
	const pasos = teclas.trim().split(/\s+/).filter(Boolean);
	const nombre = (t) => {
		const k = t.toLowerCase();
		if (k === "ctrl" || k === "meta") return "Ctrl";
		if (k === "shift") return "Mayús";
		if (k === "alt") return "Alt";
		if (k === "escape") return "Esc";
		if (k === "enter") return "Enter";
		if (k === "arrowup") return "↑";
		if (k === "arrowdown") return "↓";
		return t.length === 1 ? t.toUpperCase() : t;
	};
	return {
		partes: pasos.map((paso) => {
			const trozos = paso.endsWith("++") ? [...paso.slice(0, -2).split("+"), "+"] : paso.split("+");
			const tecla = trozos[trozos.length - 1] ?? "";
			return [...trozos.slice(0, -1).filter((m) => !(m.toLowerCase() === "shift" && tecla.length === 1 && !/[a-z0-9]/i.test(tecla))), tecla].map(nombre);
		}),
		secuencia: pasos.length > 1
	};
}
/** Los globales de 01 §3.6 que monta el marco (se listan aunque el registro esté oculto). */
var GLOBALES = [
	{
		teclas: ["ctrl+k"],
		descripcion: T.atajoBuscar
	},
	{
		teclas: ["g i"],
		descripcion: T.atajoIrInicio
	},
	{
		teclas: ["g m"],
		descripcion: T.atajoIrMuestras
	},
	{
		teclas: ["g t"],
		descripcion: T.atajoIrTiendas
	},
	{
		teclas: ["g v"],
		descripcion: T.atajoIrVentas
	},
	{
		teclas: ["g d"],
		descripcion: T.atajoIrVideos
	},
	{
		teclas: ["g p"],
		descripcion: T.atajoIrProductos
	},
	{
		teclas: ["ctrl+r", "F5"],
		descripcion: T.atajoSincronizar
	},
	{
		teclas: ["ctrl+z"],
		descripcion: T.atajoDeshacer
	},
	{
		teclas: ["shift+?"],
		descripcion: T.atajoVerAtajos
	},
	{
		teclas: ["Escape"],
		descripcion: T.atajoCerrar
	}
];
function Combinacion(p) {
	const v = teclasVisibles(p.teclas);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: PanelAtajos_module_default.combinacion,
		children: v.partes.map((paso, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: PanelAtajos_module_default.paso,
			children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: PanelAtajos_module_default.luego,
				children: "luego"
			}) : null, paso.map((t, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: t }, j))]
		}, i))
	});
}
function Lista(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: PanelAtajos_module_default.seccion,
		"aria-label": p.titulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: PanelAtajos_module_default.titulo,
			children: p.titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: PanelAtajos_module_default.lista,
			children: p.filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: PanelAtajos_module_default.fila,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: PanelAtajos_module_default.descripcion,
					children: f.descripcion
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: PanelAtajos_module_default.teclas,
					children: f.teclas.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: PanelAtajos_module_default.alternativa,
						children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: PanelAtajos_module_default.luego,
							children: "o"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Combinacion, { teclas: t })]
					}, t))
				})]
			}, `${f.teclas.join("|")}-${f.descripcion}`))
		})]
	});
}
function PanelAtajos(p) {
	const registros = useAtajosRegistrados();
	const vistos = /* @__PURE__ */ new Set();
	const dePantalla = [];
	for (const r of registros) {
		if (r.opciones.oculto) continue;
		for (const a of r.atajos) {
			const clave = `${a.teclas}|${a.descripcion}`;
			if (vistos.has(clave)) continue;
			vistos.add(clave);
			dePantalla.push({
				teclas: [a.teclas],
				descripcion: a.descripcion
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierto,
		titulo: T.atajosTitulo,
		descripcion: T.atajosDescripcion,
		alCerrar: p.alCerrar,
		ancho: 560,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: PanelAtajos_module_default.panel,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lista, {
				titulo: T.atajosGlobales,
				filas: GLOBALES
			}), dePantalla.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lista, {
				titulo: T.atajosPantalla,
				filas: dePantalla
			}) : null]
		})
	});
}
/**
* @/raiz · DialogoReautorizar (01 §5.4, ?reautorizar=1) cargado SIN import estático: import.meta.glob del módulo de
* ajustes + React.lazy (BUILD_SPEC §8.2). Solo se pide el módulo cuando la URL trae ?reautorizar=1; el diálogo lee el
* parámetro por su cuenta (pantallas.d.ts). En Android muestra el estado sin reautorizar (C35, lo resuelve ui-ajustes).
*/
var AJUSTES = "../pantallas/ajustes/index.ts";
var CARGADORES = /* #__PURE__ */ Object.assign({ "../pantallas/ajustes/index.ts": () => import("./ajustes-1Op5sX-B.mjs") });
var perezosos = /* @__PURE__ */ new WeakMap();
function Nada() {
	return null;
}
function perezosoDe(cargadores) {
	const cargar = cargadores[AJUSTES];
	if (!cargar) return null;
	let c = perezosos.get(cargadores);
	if (!c) {
		c = (0, import_react.lazy)(async () => {
			const m = await cargar();
			const d = m !== null && typeof m === "object" && "DialogoReautorizar" in m ? m.DialogoReautorizar : void 0;
			return { default: typeof d === "function" ? d : Nada };
		});
		perezosos.set(cargadores, c);
	}
	return c;
}
function DialogoReautorizarPerezoso(p) {
	const [valor] = useParametro("reautorizar");
	if (valor !== "1") return null;
	const Perezoso = perezosoDe(p.cargadores ?? CARGADORES);
	if (!Perezoso) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimiteError, {
		seccion: "Reautorizar TikTok",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Perezoso, {})
		})
	});
}
var Marco_module_default = {
	marco: "_marco_ke2ee_3",
	lateral: "_lateral_ke2ee_10",
	riel: "_riel_ke2ee_13",
	columna: "_columna_ke2ee_17",
	contenido: "_contenido_ke2ee_24",
	inferior: "_inferior_ke2ee_34",
	ninguna: "_ninguna_ke2ee_37",
	lienzo: "_lienzo_ke2ee_42",
	bannerWin: "_bannerWin_ke2ee_55",
	superior: "_superior_ke2ee_58",
	franjaDemo: "_franjaDemo_ke2ee_65",
	franjaDemoPunto: "_franjaDemoPunto_ke2ee_80",
	indicador: "_indicador_ke2ee_86",
	segmentado: "_segmentado_ke2ee_92",
	segmentadoControl: "_segmentadoControl_ke2ee_95",
	arranque: "_arranque_ke2ee_98",
	saltar: "_saltar_ke2ee_103"
};
var OPCIONES = [
	{
		valor: "ventas",
		etiqueta: T.resumen
	},
	{
		valor: "videos",
		etiqueta: T.videos
	},
	{
		valor: "productos",
		etiqueta: T.productos
	}
];
function SegmentadoVentas(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: Marco_module_default.segmentado,
		"data-segmentado-ventas": "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmentado, {
			opciones: OPCIONES,
			valor: p.valor,
			alCambiar: (v) => navegar(`/${v}`, { reemplazar: true }),
			etiqueta: T.segmentoVentas,
			anchoCompleto: true,
			className: cx(Marco_module_default.segmentadoControl)
		})
	});
}
/**
* @/raiz · marco por plataforma (BUILD_SPEC §8.4, 01 §3.2–3.4, 02 §5 y §7.7–7.9, lienzos Main.png y MovilInicio.png):
* - Windows (y el navegador de desarrollo): barra lateral de 248 en expandida/amplia, riel de 80 en media y barra
*   inferior si la ventana es compacta. El encabezado de cada pantalla (EncabezadoPantalla) es pegajoso y pasa a vidrio
*   con el scroll de la página, que es el de la ventana.
* - Android: barra inferior y, en #/ventas · #/videos · #/productos, el segmentado Resumen · Videos · Productos.
* - Arriba del contenido, el banner único; en Android además la franja de demostración y la del indicador de sync.
* - Rutas con reglas de arranque (§8.6) y, encima de todo, la paleta Ctrl+K, el panel '?' y DialogoReautorizar.
*/
var CLAVE_DESCARTES = "corte.banners";
function leerDescartes() {
	try {
		const v = JSON.parse(almacen.leer(CLAVE_DESCARTES) ?? "{}");
		if (v === null || typeof v !== "object" || Array.isArray(v)) return {};
		const salida = {};
		for (const [k, t] of Object.entries(v)) if (typeof t === "number") salida[k] = t;
		return salida;
	} catch {
		return {};
	}
}
/** Android: con el teclado abierto (foco en un campo) la barra inferior se esconde (02 §7.8). */
function useTecladoAbierto(activo) {
	const [abierto, setAbierto] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!activo) return void 0;
		let t = 0;
		const revisar = () => setAbierto(esCampo(document.activeElement));
		const alSalir = () => {
			window.clearTimeout(t);
			t = window.setTimeout(revisar, 0);
		};
		document.addEventListener("focusin", revisar);
		document.addEventListener("focusout", alSalir);
		return () => {
			window.clearTimeout(t);
			document.removeEventListener("focusin", revisar);
			document.removeEventListener("focusout", alSalir);
		};
	}, [activo]);
	return activo && abierto;
}
function Marco(p) {
	const r = useRuta();
	const plataforma = usePlataforma();
	const clase = useClaseAncho();
	const sesion = useSesion();
	const conexionPc = useConexionPc();
	const capacidades = useCapacidades();
	const sync = useSync();
	const demoNavegador = modoDemo();
	const relojListo = !demoNavegador || anclarRelojDemo(sesion.datos) || sesion.error !== null || sesion.datos !== void 0 && sesion.datos.datos.ultima_sync_ok_at === null && sesion.datos.sync.iniciada_at === null;
	const ahora = useAhora();
	const android = plataforma === "android";
	const principal = (0, import_react.useRef)(null);
	const enRaiz = esRaiz(r.ruta);
	const decision = decidirArranque({
		plataforma,
		sesion: sesion.datos,
		sesionFallo: sesion.error !== null,
		conexionPc
	});
	const consultaActual = r.consulta.toString();
	(0, import_react.useEffect)(() => {
		if (!enRaiz || decision === "esperar") return;
		const destino = decision === "bienvenida" ? "/bienvenida" : "/inicio";
		navegar(consultaActual ? `${destino}?${consultaActual}` : destino, { reemplazar: true });
	}, [
		enRaiz,
		decision,
		consultaActual
	]);
	const def = resolverRuta(r.ruta).def;
	const completa = !!def?.completa;
	const detalleMuestra = def?.patron === "/muestras/m/:id";
	const modo = enRaiz ? "ninguna" : modoNav({
		plataforma,
		clase,
		completa,
		detalleMuestra
	});
	const inferior = modo === "inferior";
	const activo = destinoActivo(r.ruta, inferior || android);
	const teclado = useTecladoAbierto(android && inferior);
	const segmento = android ? segmentoVentas(r.ruta) : null;
	const demo = demoNavegador || sesion.datos?.modo === "demo";
	const trabajo = useTrabajo(!completa && !enRaiz);
	const insignias = insigniasNav(trabajo.conteos);
	const [descartes, setDescartes] = (0, import_react.useState)(leerDescartes);
	const banner = completa || enRaiz ? null : elegirBanner({
		plataforma,
		sesion: sesion.datos,
		conexionPc,
		copiaAt: sesion.copia_at,
		pendientes: trabajo.pendientes,
		ahora,
		descartados: descartes
	});
	const sincronizar = useSincronizarConAviso();
	const deshacer = useDeshacerGlobal();
	const alAccionBanner = (a) => {
		if (a.tipo === "reautorizar") fijarParametro("reautorizar", "1");
		else if (a.tipo === "navegar") navegar(a.a);
		else if (a.tipo === "sincronizar") sincronizar();
		else fijarParametro("mensaje", `t:${a.tienda_key}`);
	};
	const descartar = (id) => {
		const nuevos = {
			...descartes,
			[id]: ahora
		};
		setDescartes(nuevos);
		almacen.escribir(CLAVE_DESCARTES, JSON.stringify(nuevos));
	};
	const paletaAbierta = usePaletaAbierta();
	const atajosAbiertos = useAtajosAbiertos();
	useAtajosGlobales({
		sincronizar,
		deshacer
	});
	useAperturasPaleta();
	useAtrasAndroid(plataforma, paletaAbierta);
	useNotificaciones(!enRaiz && (sesion.datos?.datos.hay_datos ?? android));
	const acciones = accionesPaleta({
		android,
		puedeSincronizar: sync.puede,
		puedeReautorizar: capacidades.auth
	});
	const elegir = (res) => {
		cerrarPaleta();
		const d = res.destino;
		if (d.tipo === "ruta") {
			navegar(d.a);
			return;
		}
		switch (d.accion) {
			case "sincronizar":
				sincronizar();
				break;
			case "plan":
				navegar("/muestras/plan");
				break;
			case "avisar":
				navegar("/muestras/avisos");
				break;
			case "sesion":
				navegar("/muestras/sesion");
				break;
			case "generar":
				navegar("/videos/generar");
				break;
			case "emparejar":
				navegar(android ? "/emparejar" : "/ajustes/celular");
				break;
			case "reautorizar":
				fijarParametro("reautorizar", "1");
				break;
			case "ventas": navegar("/ventas");
		}
	};
	const listo = !enRaiz && relojListo;
	const claveVista = def ? `${def.modulo}#${def.exporta}` : r.ruta;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Marco_module_default.marco, Marco_module_default[modo], android && Marco_module_default.android),
		"data-nav": modo,
		"data-plataforma": android ? "android" : "windows",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#contenido",
				className: Marco_module_default.saltar,
				onClick: (e) => {
					e.preventDefault();
					principal.current?.focus();
				},
				children: T.saltar
			}),
			modo === "lateral" || modo === "riel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraLateral, {
				modo,
				activo,
				enAjustes: r.ruta.startsWith("/ajustes"),
				insignias,
				demo
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: Marco_module_default.columna,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "contenido",
					ref: principal,
					tabIndex: -1,
					className: Marco_module_default.contenido,
					"data-completa": completa ? "" : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: Marco_module_default.lienzo,
						children: [
							(inferior || android && modo !== "ninguna") && (demo || banner || segmento) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: Marco_module_default.superior,
								children: [
									demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: Marco_module_default.franjaDemo,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: Marco_module_default.franjaDemoPunto,
											"aria-hidden": "true"
										}), T.demo]
									}) : null,
									banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, {
										banner,
										alAccion: alAccionBanner,
										alDescartar: () => descartar(banner.id),
										franja: true
									}) : null,
									segmento ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SegmentadoVentas, { valor: segmento }) : null
								]
							}) : banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banner, {
								banner,
								alAccion: alAccionBanner,
								alDescartar: () => descartar(banner.id),
								className: cx(Marco_module_default.bannerWin)
							}) : null,
							inferior || android ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: Marco_module_default.indicador,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndicadorSync, {
									variante: "franja",
									android
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimiteError, {
								seccion: def?.titulo ?? T.inicio,
								children: listo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VistaRuta, {
									ruta: r,
									...p.cargadores ? { cargadores: p.cargadores } : {}
								}) : enRaiz ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: Marco_module_default.arranque,
									"aria-busy": "true"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EsqueletoPantalla, {})
							}, claveVista)
						]
					})
				})
			}),
			inferior ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarraInferior, {
				activo,
				insignias,
				oculta: teclado
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paleta, {
				abierta: paletaAbierta,
				completa: inferior || android,
				acciones,
				alCerrar: cerrarPaleta,
				alElegir: elegir
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelAtajos, {
				abierto: atajosAbiertos,
				alCerrar: cerrarAtajos
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogoReautorizarPerezoso, { ...p.cargadoresReautorizar ? { cargadores: p.cargadoresReautorizar } : {} })
		]
	});
}
function Raiz(p) {
	useAtributosHtml();
	useEventosGlobales();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marco, { ...p });
}
/** La App con cargadores inyectables (las pruebas no dependen de qué pantallas existan). */
function AppConPantallas(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProveedorToasts, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProveedorBloques, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Raiz, { ...p }) }) });
}
/** Raíz de la interfaz: proveedores, marco por plataforma, rutas y capas globales (BUILD_SPEC §8.4). */
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppConPantallas, {});
}
function CorteRaiz() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "raiz",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {})
	});
}
function CorteApp() {
	const [listo, setListo] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setListo(true);
	}, []);
	if (!listo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			minHeight: "100dvh",
			display: "grid",
			placeItems: "center",
			background: "#070a08",
			color: "#d7ddd8",
			fontFamily: "system-ui, sans-serif"
		},
		children: "Abriendo Corte…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorteRaiz, {});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CorteApp, {});
}
//#endregion
export { armarPlan as A, BotonAccionMuestra as C, TarjetaVentasProducto as D, EditorMensaje as E, opsDePlan as M, PanelQrEmparejamiento as O, ChipsRazones as S, BotonGuardarImagen as T, ChipCopiadoSinConfirmar as _, PanelPlan as a, ChipTikTok as b, columnasProductos as c, TarjetaTienda as d, PestanasMuestras as f, ChipAvance as g, FichaPrecio as h, startPack as i, desdePorOmision as j, useControlMuestra as k, columnasTiendas as l, TarjetaMuestra as m, estadoPack as n, ListaNotas as o, columnasMuestras as p, pollPack as r, columnasPedidos as s, routes_exports as t, columnasVideos as u, ChipPromesa as v, BotonCopiarGuion as w, ChipVitrina as x, ChipSalud as y };
