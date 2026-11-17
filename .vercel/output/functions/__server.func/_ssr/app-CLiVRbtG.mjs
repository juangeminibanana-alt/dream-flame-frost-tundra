import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, K as require_react_dom, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as require_lucide_react } from "../_libs/lucide-react.mjs";
import { t as useVirtualizer } from "../_libs/@tanstack/react-virtual+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CLiVRbtG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lucide_react = require_lucide_react();
var import_react_dom = require_react_dom();
/** BUILD_SPEC §8.6. */
var TABLA_RUTAS = [
	{
		patron: "/inicio",
		modulo: "inicio",
		exporta: "PantallaInicio",
		titulo: "Inicio"
	},
	{
		patron: "/muestras",
		modulo: "muestras",
		exporta: "PantallaMuestras",
		titulo: "Muestras"
	},
	{
		patron: "/muestras/m/:id",
		modulo: "muestras",
		exporta: "PantallaMuestras",
		titulo: "Muestra"
	},
	{
		patron: "/muestras/todas",
		modulo: "muestras",
		exporta: "PantallaMuestrasTodas",
		titulo: "Todas tus muestras"
	},
	{
		patron: "/muestras/agenda",
		modulo: "flujos",
		exporta: "PantallaAgenda",
		titulo: "Agenda"
	},
	{
		patron: "/muestras/plan",
		modulo: "flujos",
		exporta: "PantallaArmarPlan",
		titulo: "Armar mi plan"
	},
	{
		patron: "/muestras/sesion",
		modulo: "flujos",
		exporta: "PantallaSesion",
		titulo: "Sesión de videos"
	},
	{
		patron: "/muestras/avisos",
		modulo: "flujos",
		exporta: "PantallaAvisar",
		titulo: "Avisar a mis tiendas"
	},
	{
		patron: "/tiendas",
		modulo: "tiendas",
		exporta: "PantallaTiendas",
		titulo: "Tiendas"
	},
	{
		patron: "/tiendas/:key",
		modulo: "tiendas",
		exporta: "PantallaTienda",
		titulo: "Tienda"
	},
	{
		patron: "/ventas",
		modulo: "ventas",
		exporta: "PantallaVentas",
		titulo: "Ventas"
	},
	{
		patron: "/videos",
		modulo: "videos",
		exporta: "PantallaVideos",
		titulo: "Videos"
	},
	{
		patron: "/videos/generar",
		modulo: "videos",
		exporta: "PantallaGenerar",
		titulo: "Generar video"
	},
	{
		patron: "/videos/:id",
		modulo: "videos",
		exporta: "PantallaVideo",
		titulo: "Video"
	},
	{
		patron: "/productos",
		modulo: "productos",
		exporta: "PantallaProductos",
		titulo: "Productos"
	},
	{
		patron: "/productos/:id",
		modulo: "productos",
		exporta: "PantallaProducto",
		titulo: "Producto"
	},
	{
		patron: "/ajustes",
		modulo: "ajustes",
		exporta: "PantallaAjustes",
		titulo: "Conexión y ajustes"
	},
	{
		patron: "/ajustes/:seccion",
		modulo: "ajustes",
		exporta: "PantallaAjustes",
		titulo: "Conexión y ajustes"
	},
	{
		patron: "/bienvenida",
		modulo: "bienvenida",
		exporta: "PantallaBienvenida",
		titulo: "Bienvenida",
		completa: true
	},
	{
		patron: "/emparejar",
		modulo: "emparejar",
		exporta: "PantallaEmparejar",
		titulo: "Emparejar con tu PC",
		completa: true
	},
	{
		patron: "/dev/galeria",
		modulo: "galeria-componentes",
		exporta: "GaleriaComponentes",
		titulo: "Galería de componentes",
		soloDev: true
	},
	{
		patron: "/dev/bloques",
		modulo: "galeria-bloques",
		exporta: "GaleriaBloques",
		titulo: "Galería de bloques",
		soloDev: true
	}
];
function decodificar(s) {
	try {
		return decodeURIComponent(s);
	} catch {
		return s;
	}
}
/** Separa '#/muestras/m/8071?vista=tablero' en ruta normalizada y consulta. */
function partirHash(hash) {
	let h = hash.startsWith("#") ? hash.slice(1) : hash;
	const i = h.indexOf("?");
	const consulta = new URLSearchParams(i >= 0 ? h.slice(i + 1) : "");
	h = i >= 0 ? h.slice(0, i) : h;
	if (!h.startsWith("/")) h = `/${h}`;
	h = h.replace(/\/{2,}/g, "/");
	if (h.length > 1 && h.endsWith("/")) h = h.slice(0, -1);
	return {
		ruta: h,
		consulta
	};
}
/** Empareja una ruta con la tabla de §8.6 y saca los parámetros con nombre (decodificados). */
function resolverRuta(hash, tabla = TABLA_RUTAS) {
	const { ruta, consulta } = partirHash(hash);
	const segmentos = ruta.split("/").slice(1);
	for (const def of tabla) {
		if (def.soloDev && true) continue;
		const partes = def.patron.split("/").slice(1);
		if (partes.length !== segmentos.length) continue;
		const params = {};
		let ok = true;
		for (let k = 0; k < partes.length; k++) {
			const p = partes[k] ?? "";
			const s = segmentos[k] ?? "";
			if (p.startsWith(":")) {
				if (s === "") {
					ok = false;
					break;
				}
				params[p.slice(1)] = decodificar(s);
			} else if (p !== s) {
				ok = false;
				break;
			}
		}
		if (ok) return {
			ruta,
			def,
			params,
			consulta
		};
	}
	return {
		ruta,
		def: null,
		params: {},
		consulta
	};
}
/**
* @/app · navegación hash (01 §3.1, BUILD_SPEC §8.6): useRuta con los parámetros con nombre de la tabla, navegar con
* el scroll recordado de la vista anterior, atras y useParametro. Un solo almacén (useSyncExternalStore) que escucha
* hashchange/popstate y los cambios propios (pushState no emite hashchange).
*
* Scroll: se recuerda la posición de cada ruta (sin la consulta). Al ir a otra ruta con navegar() la nueva empieza
* arriba; al volver con Atrás (popstate) se restaura la que tenía. Cambiar solo la consulta (?mensaje=, ?vista=) no
* toca el scroll. <Pantalla> termina la restauración cuando su contenido ya está listo (la página ya tiene su alto).
*/
var oyentes$4 = /* @__PURE__ */ new Set();
var escuchando$3 = false;
/** Ruta vigente (sin consulta) y posiciones recordadas. */
var rutaVigente = null;
var posiciones = /* @__PURE__ */ new Map();
/** Qué hacer con el scroll la próxima vez que cambie la ruta: 'arriba' (navegar) o 'restaurar' (Atrás/Adelante). */
var intencion = "restaurar";
/** Ruta con restauración pendiente → posición a recuperar cuando la pantalla esté lista. */
var pendiente = null;
function hashActual() {
	return typeof window === "undefined" ? "" : window.location.hash;
}
function rutaDe(hash) {
	return partirHash(hash).ruta;
}
function guardarScroll$1() {
	if (rutaVigente !== null && typeof window !== "undefined") posiciones.set(rutaVigente, window.scrollY);
}
/** Se llama en cada cambio de hash (propio o externo): decide el scroll de la ruta nueva. */
function alCambiarHash() {
	const nueva = rutaDe(hashActual());
	if (rutaVigente !== null && nueva !== rutaVigente) {
		const y = intencion === "restaurar" ? posiciones.get(nueva) ?? 0 : 0;
		pendiente = {
			ruta: nueva,
			y
		};
		if (y === 0 && typeof window !== "undefined" && typeof window.scrollTo === "function") try {
			window.scrollTo(0, 0);
		} catch {}
	}
	rutaVigente = nueva;
	intencion = "restaurar";
	for (const o of [...oyentes$4]) o();
}
var marcoScroll = 0;
function alScroll$1() {
	if (marcoScroll) return;
	marcoScroll = window.requestAnimationFrame(() => {
		marcoScroll = 0;
		guardarScroll$1();
	});
}
/**
* Los enlaces internos que no son <EnlaceRuta> (p. ej. `<a href="#/tiendas">` de un componente) también pasan por
* navegar(): así cuentan en el historial propio (atras) y la vista nueva empieza arriba.
*/
function alClic(e) {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey) return;
	const destino = e.target instanceof Element ? e.target.closest("a[href^=\"#/\"]") : null;
	if (!(destino instanceof HTMLAnchorElement) || destino.hasAttribute("download") || destino.target && destino.target !== "_self") return;
	e.preventDefault();
	navegar(destino.getAttribute("href") ?? "#/inicio");
}
/** Clic central en un enlace interno: nunca abre otra ventana (01 §3.1); navega aquí mismo. */
function alClicAuxiliar(e) {
	if (e.defaultPrevented || e.button !== 1) return;
	const destino = e.target instanceof Element ? e.target.closest("a[href^=\"#/\"]") : null;
	if (!(destino instanceof HTMLAnchorElement)) return;
	e.preventDefault();
	navegar(destino.getAttribute("href") ?? "#/inicio");
}
function asegurarEscucha$3() {
	if (escuchando$3 || typeof window === "undefined") return;
	escuchando$3 = true;
	rutaVigente = rutaDe(hashActual());
	window.addEventListener("hashchange", alCambiarHash);
	window.addEventListener("popstate", alCambiarHash);
	window.addEventListener("scroll", alScroll$1, { passive: true });
	document.addEventListener("click", alClic);
	document.addEventListener("auxclick", alClicAuxiliar);
}
function suscribir$3(avisar) {
	asegurarEscucha$3();
	oyentes$4.add(avisar);
	return () => oyentes$4.delete(avisar);
}
function useRuta() {
	const hash = (0, import_react.useSyncExternalStore)(suscribir$3, hashActual, () => "");
	return (0, import_react.useMemo)(() => {
		const r = resolverRuta(hash);
		return {
			ruta: r.ruta,
			params: r.params,
			consulta: r.consulta
		};
	}, [hash]);
}
/** '#/x', '/x' o 'x' → '/x' (con su consulta). */
function normalizarDestino(destino) {
	let d = destino.trim();
	if (d.startsWith("#")) d = d.slice(1);
	if (!d.startsWith("/")) d = `/${d}`;
	return d;
}
function profundidad() {
	if (typeof window === "undefined") return 0;
	const e = window.history.state;
	if (e !== null && typeof e === "object" && "corte" in e && typeof e.corte === "number") return e.corte;
	return 0;
}
/** `destino` con o sin '#': '/tiendas/value%20chic%20clothes'. Conserva el scroll de la vista anterior. */
function navegar(destino, opciones) {
	if (typeof window === "undefined") return;
	asegurarEscucha$3();
	const d = normalizarDestino(destino);
	if (hashActual() === `#${d}`) return;
	guardarScroll$1();
	intencion = "arriba";
	if (opciones?.reemplazar) window.history.replaceState({ corte: profundidad() }, "", `#${d}`);
	else window.history.pushState({ corte: profundidad() + 1 }, "", `#${d}`);
	alCambiarHash();
}
/** Atrás dentro de la app; sin historial propio (se abrió directo en esta vista) va a Inicio. */
function atras() {
	if (typeof window === "undefined") return;
	if (profundidad() > 0) {
		window.history.back();
		return;
	}
	navegar("/inicio", { reemplazar: true });
}
/** Escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). Versión sin React de useParametro. */
function fijarParametro(nombre, nuevo, opciones) {
	const actual = partirHash(hashActual());
	const consulta = new URLSearchParams(actual.consulta);
	if (nuevo === null) consulta.delete(nombre);
	else consulta.set(nombre, nuevo);
	const q = consulta.toString();
	navegar(q ? `${actual.ruta}?${q}` : actual.ruta, opciones?.reemplazar ? { reemplazar: true } : {});
}
/** Lee/escribe UN parámetro de la consulta del hash sin cambiar la ruta (null lo quita). */
function useParametro(nombre) {
	return [useRuta().consulta.get(nombre), (0, import_react.useMemo)(() => (nuevo, opciones) => {
		fijarParametro(nombre, nuevo, opciones);
	}, [nombre])];
}
/** Ruta vigente sin '#' ni consulta (fuera de React). */
function rutaActual() {
	return rutaDe(hashActual());
}
/** Cuántos pasos de historial propio hay detrás de la vista actual (0 = se abrió directo aquí). */
function profundidadHistorial() {
	return profundidad();
}
/**
* Restauración pendiente de la ruta indicada (la toma una sola vez). La llama <Pantalla> cuando `lista` es true:
* el contenido ya tiene su alto y el scroll de antes se puede recuperar.
*/
function restaurarScrollPendiente(ruta) {
	if (!pendiente || pendiente.ruta !== ruta || typeof window === "undefined") return;
	const { y } = pendiente;
	pendiente = null;
	if (y > 0 && typeof window.scrollTo === "function") try {
		window.scrollTo(0, y);
	} catch {}
}
function EnlaceRuta(p) {
	const destino = normalizarDestino(p.a);
	const r = useRuta();
	const actual = partirHash(destino).ruta === r.ruta;
	const ir = (e) => {
		e.preventDefault();
		navegar(destino, p.reemplazar ? { reemplazar: true } : {});
	};
	const auxiliar = (e) => {
		if (e.button === 1) ir(e);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: `#${destino}`,
		className: p.className,
		"aria-label": p["aria-label"],
		"aria-current": actual ? "page" : void 0,
		onClick: ir,
		onAuxClick: auxiliar,
		children: p.children
	});
}
/**
* @/plataforma · entorno de ejecución (BUILD_SPEC §8.1, §8.3). Los parámetros de desarrollo (`?simular=android`,
* `?pc=conectada`) SOLO cuentan en `npm run dev:demo` (import.meta.env.DEV && VITE_DEMO === '1'); en `vite build`
* import.meta.env.DEV es `false` y esas ramas se eliminan.
*/
/** true en `npm run dev:demo` (ui/.env.demo → VITE_DEMO=1). Nunca en `vite build`. */
function modoDemo$1() {
	return false;
}
/** Lee un parámetro de la URL antes del hash (`/?simular=android#/inicio`) o dentro del hash (`#/inicio?simular=android`). */
function parametroUrl$1(nombre) {
	if (typeof window === "undefined") return null;
	const listas = [new URLSearchParams(window.location.search)];
	const hash = window.location.hash;
	const i = hash.indexOf("?");
	if (i >= 0) listas.push(new URLSearchParams(hash.slice(i + 1)));
	for (const p of listas) {
		const v = p.get(nombre);
		if (v !== null && v !== "") return v;
	}
	return null;
}
/** `?simular=android` en el modo demo: la interfaz se comporta como Android sin puente nativo (datos de la copia). */
function simulaAndroid() {
	return modoDemo$1() && parametroUrl$1("simular") === "android";
}
function ventanaCorte() {
	return typeof window === "undefined" ? null : window;
}
/** El puente de Android, o null (Windows, navegador o modo demo con ?simular=android). */
function puenteAndroid() {
	const p = ventanaCorte()?.CreatorHubAndroid;
	return p !== void 0 && p !== null && typeof p === "object" ? p : null;
}
/** true si corre dentro de la ventana de pywebview (Windows), aunque la js_api aún no esté publicada. */
function hayPywebview() {
	const p = ventanaCorte()?.pywebview;
	return p !== void 0 && p !== null && typeof p === "object";
}
/** window.pywebview existe pero su api todavía no: tope para 'pywebviewready'. */
var ESPERA_API_MS = 3e3;
/** Sin window.pywebview: cuánto se espera después de load a que pywebview se inyecte (navegador = nunca llega). */
var GRACIA_TRAS_CARGA_MS = 2500;
/** En el origen del propio hub (solo lo abre la ventana de Windows) se espera más antes de darlo por perdido. */
var GRACIA_ORIGEN_HUB_MS = 1e4;
/** Tope absoluto de cualquier espera (por si load nunca llega). */
var TOPE_ESPERA_MS = 15e3;
var apiLista = false;
var graciaTerminada = false;
if (typeof window !== "undefined") window.addEventListener("pywebviewready", () => {
	apiLista = true;
});
function apiPublicada() {
	const api = ventanaCorte()?.pywebview?.api;
	return api !== void 0 && api !== null && typeof api === "object";
}
/**
* La ventana de Windows carga la interfaz desde el propio hub: http://127.0.0.1:39229 (respaldo 39228…39220, C8).
* Ningún otro origen sirve esa interfaz con sesión (la cookie solo sale de /boot?t=, que abre el shell).
*/
function esOrigenDelHub() {
	if (typeof location === "undefined") return false;
	const p = Number(location.port);
	return location.protocol === "http:" && location.hostname === "127.0.0.1" && Number.isInteger(p) && p >= 39220 && p <= 39229;
}
/**
* Resuelve cuando ya se sabe si la interfaz corre con puente: al instante con Android o con la js_api publicada; si no,
* con 'pywebviewready' o al vencer la gracia (2.5 s después de load; 10 s en el origen del hub). Después de una gracia
* vencida en el navegador ya no se vuelve a esperar. Nunca rechaza.
*/
function esperarPuente() {
	const w = ventanaCorte();
	if (!w || apiLista || puenteAndroid() !== null || apiPublicada()) return Promise.resolve();
	const objetoSinApi = hayPywebview();
	if (!objetoSinApi && graciaTerminada) return Promise.resolve();
	return new Promise((resolve) => {
		const relojes = [];
		let hecho = false;
		const fin = () => {
			if (hecho) return;
			hecho = true;
			for (const t of relojes) clearTimeout(t);
			w.removeEventListener("pywebviewready", fin);
			w.removeEventListener("load", alCargar);
			resolve();
		};
		const vencio = () => {
			if (!hayPywebview() && !esOrigenDelHub()) graciaTerminada = true;
			fin();
		};
		const alCargar = () => {
			relojes.push(setTimeout(vencio, esOrigenDelHub() ? GRACIA_ORIGEN_HUB_MS : GRACIA_TRAS_CARGA_MS));
		};
		w.addEventListener("pywebviewready", fin);
		relojes.push(setTimeout(vencio, objetoSinApi ? ESPERA_API_MS : TOPE_ESPERA_MS));
		if (!objetoSinApi) {
			if (typeof document === "undefined" || document.readyState === "complete") alCargar();
			else w.addEventListener("load", alCargar, { once: true });
		}
	});
}
/**
* La js_api de pywebview con el método pedido listo para llamarse (con await), o null si no corre en Windows o el
* shell no expone ese método. Si la js_api aún no está publicada, primero espera (esperarPuente).
*/
async function apiPywebview(metodo) {
	if (typeof ventanaCorte()?.pywebview?.api?.[metodo] !== "function") await esperarPuente();
	const api = ventanaCorte()?.pywebview?.api;
	return api && typeof api[metodo] === "function" ? api : null;
}
function esObjeto$4(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
/** Lee el `detail` de un CustomEvent como objeto (o null si no lo es). */
function detalleDe(e) {
	if (!("detail" in e)) return null;
	const d = e.detail;
	if (typeof d === "string") try {
		const v = JSON.parse(d);
		return esObjeto$4(v) ? v : null;
	} catch {
		return null;
	}
	return esObjeto$4(d) ? d : null;
}
/** Escucha un CustomEvent de la capa nativa; `leer` valida y convierte el detail (null = se ignora). */
function escucharAndroid(nombre, leer, fn) {
	const w = ventanaCorte();
	if (!w) return () => void 0;
	const escucha = (e) => {
		const d = detalleDe(e);
		if (!d) return;
		const v = leer(d);
		if (v !== null) fn(v);
	};
	w.addEventListener(nombre, escucha);
	return () => w.removeEventListener(nombre, escucha);
}
var contadorPedidos = 0;
/** idPedido único de esta sesión de la interfaz. */
function nuevoIdPedido() {
	contadorPedidos += 1;
	return `corte-${Date.now().toString(36)}-${contadorPedidos}`;
}
/**
* Llama al puente con un idPedido y espera el CustomEvent `nombre` cuyo detail.id coincide. El oyente se registra
* ANTES de llamar al puente. `tope_ms` vencido o error del puente → null.
*/
function pedirAndroid(nombre, llamar, leer, tope_ms) {
	return new Promise((resolve) => {
		const id = nuevoIdPedido();
		let hecho = false;
		const terminar = (v) => {
			if (hecho) return;
			hecho = true;
			clearTimeout(t);
			quitar();
			resolve(v);
		};
		const quitar = escucharAndroid(nombre, (d) => d["id"] === id ? leer(d) : null, (v) => terminar(v));
		const t = setTimeout(() => terminar(null), tope_ms);
		try {
			llamar(id);
		} catch {
			terminar(null);
		}
	});
}
function plataformaActual$1() {
	if (puenteAndroid() !== null || simulaAndroid()) return "android";
	if (hayPywebview() || esOrigenDelHub()) return "windows";
	return "navegador";
}
function infoPlataforma() {
	const tiene_puente = puenteAndroid() !== null || hayPywebview();
	return {
		plataforma: plataformaActual$1(),
		version_app: "1.0.3",
		tiene_puente,
		modo_demo_navegador: modoDemo$1()
	};
}
function esAndroid() {
	return plataformaActual$1() === "android";
}
function esWindows() {
	return plataformaActual$1() === "windows";
}
/** Hosts permitidos para abrir fuera de la app (BUILD_SPEC §6.4). Solo https. */
var HOSTS_PERMITIDOS = /* @__PURE__ */ new Set([
	"shop.tiktok.com",
	"www.tiktok.com",
	"affiliate.tiktok.com",
	"seller-mx.tiktok.com",
	"partner.tiktokshop.com"
]);
function urlPermitida(url) {
	try {
		const u = new URL(url);
		return u.protocol === "https:" && HOSTS_PERMITIDOS.has(u.hostname) && u.username === "" && u.password === "";
	} catch {
		return false;
	}
}
function abrirEnNavegador(url) {
	if (typeof window === "undefined" || typeof window.open !== "function") return false;
	window.open(url, "_blank", "noopener,noreferrer");
	return true;
}
async function abrirExterno(url) {
	if (!urlPermitida(url)) return false;
	const android = puenteAndroid();
	if (android) try {
		return android.abrirExterno(url) === true;
	} catch {
		return false;
	}
	await esperarPuente();
	if (hayPywebview()) {
		const api = await apiPywebview("abrir_externo");
		if (api?.abrir_externo) try {
			return await api.abrir_externo(url) === true;
		} catch {
			return false;
		}
	}
	return abrirEnNavegador(url);
}
async function abrirTikTok(urlRespaldo) {
	const respaldo = urlRespaldo !== void 0 && urlPermitida(urlRespaldo) ? urlRespaldo : "";
	const android = puenteAndroid();
	if (android) try {
		return android.abrirTikTok(respaldo) === true;
	} catch {
		return false;
	}
	return respaldo ? abrirExterno(respaldo) : false;
}
async function copiarConNavegador(texto) {
	try {
		if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
			await navigator.clipboard.writeText(texto);
			return true;
		}
	} catch {}
	if (typeof document === "undefined") return false;
	try {
		const area = document.createElement("textarea");
		area.value = texto;
		area.setAttribute("readonly", "");
		area.style.position = "fixed";
		area.style.opacity = "0";
		document.body.appendChild(area);
		area.select();
		const ok = typeof document.execCommand === "function" && document.execCommand("copy");
		area.remove();
		return ok;
	} catch {
		return false;
	}
}
async function copiarTexto(texto) {
	const android = puenteAndroid();
	if (android) try {
		return android.copiar(texto) === true;
	} catch {
		return false;
	}
	await esperarPuente();
	if (hayPywebview()) {
		const api = await apiPywebview("copiar");
		if (api?.copiar) try {
			return await api.copiar(texto) === true;
		} catch {
			return copiarConNavegador(texto);
		}
	}
	return copiarConNavegador(texto);
}
async function compartirTexto(texto) {
	const android = puenteAndroid();
	if (android) try {
		return android.compartir(texto) === true;
	} catch {
		return false;
	}
	await esperarPuente();
	if (!hayPywebview() && typeof navigator !== "undefined" && typeof navigator.share === "function") try {
		await navigator.share({ text: texto });
		return true;
	} catch {
		return false;
	}
	return copiarTexto(texto);
}
var RESULTADOS_PC = /* @__PURE__ */ new Set([
	"guardado",
	"cancelado",
	"error"
]);
function comoResultado(v) {
	return typeof v === "string" && RESULTADOS_PC.has(v) ? v : "error";
}
function descargar(href, nombre) {
	const a = document.createElement("a");
	a.href = href;
	a.download = nombre;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
}
/** Windows: diálogo Guardar con el ORIGINAL de la caché del hub. Android: compartir. Navegador: descarga. */
async function guardarImagen(url, nombreSugerido) {
	const android = puenteAndroid();
	if (android) try {
		return android.compartirImagen(url, nombreSugerido) === true ? "compartido" : "error";
	} catch {
		return "error";
	}
	await esperarPuente();
	if (hayPywebview()) {
		const api = await apiPywebview("guardar_imagen");
		if (!api?.guardar_imagen) return "error";
		try {
			return comoResultado(await api.guardar_imagen(url, nombreSugerido));
		} catch {
			return "error";
		}
	}
	if (typeof document === "undefined") return "error";
	try {
		descargar(url, nombreSugerido);
		return "guardado";
	} catch {
		return "error";
	}
}
async function guardarArchivo(nombreSugerido, mime, contenido) {
	const android = puenteAndroid();
	if (android) try {
		return android.compartirArchivo(nombreSugerido, mime, contenido) === true ? "compartido" : "error";
	} catch {
		return "error";
	}
	await esperarPuente();
	if (hayPywebview()) {
		const api = await apiPywebview("guardar_archivo");
		if (!api?.guardar_archivo) return "error";
		try {
			return comoResultado(await api.guardar_archivo(nombreSugerido, mime, contenido));
		} catch {
			return "error";
		}
	}
	if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") return "error";
	try {
		const url = URL.createObjectURL(new Blob([contenido], { type: `${mime};charset=utf-8` }));
		descargar(url, nombreSugerido);
		setTimeout(() => URL.revokeObjectURL(url), 1e3);
		return "guardado";
	} catch {
		return "error";
	}
}
/**
* C46 · Solo Windows: diálogo Abrir nativo (js_api elegir_archivo). Devuelve la RUTA absoluta, que solo viaja al hub
* (ImportarRequest.ruta, ImportarLocalRequest.ruta). Android y navegador: null SIEMPRE (no se toca el puente).
*/
async function elegirArchivo(titulo, filtros) {
	if (puenteAndroid() !== null) return null;
	await esperarPuente();
	if (!hayPywebview()) return null;
	const api = await apiPywebview("elegir_archivo");
	if (!api?.elegir_archivo) return null;
	try {
		const ruta = await api.elegir_archivo(titulo, [...filtros]);
		return typeof ruta === "string" && ruta.trim() !== "" ? ruta : null;
	} catch {
		return null;
	}
}
function vibrar(tipo) {
	try {
		puenteAndroid()?.vibrar(tipo);
	} catch {}
}
function mantenerPantalla(encendida) {
	try {
		puenteAndroid()?.mantenerPantalla(encendida);
	} catch {}
}
/** Ejecuta una llamada a la js_api sin bloquear a quien llama (pero con await adentro, 04 §A.4). */
function enSegundoPlano(fn) {
	fn().catch(() => void 0);
}
function avisarTemaNativo(modo) {
	const android = puenteAndroid();
	if (android) {
		try {
			android.tema(modo);
		} catch {}
		return;
	}
	enSegundoPlano(async () => {
		const api = await apiPywebview("tema");
		if (api?.tema) await api.tema(modo);
	});
}
var interfazLista = false;
/** La interfaz pintó su primera vista con datos (Windows `--medir`, Android retira el splash). Solo la primera vez. */
function avisarInterfazLista() {
	if (interfazLista) return;
	interfazLista = true;
	if (typeof document !== "undefined") document.documentElement.setAttribute("data-interfaz-lista", "");
	const android = puenteAndroid();
	if (android) {
		try {
			android.lista();
		} catch {}
		return;
	}
	enSegundoPlano(async () => {
		const api = await apiPywebview("lista");
		if (api?.lista) await api.lista();
	});
}
var PERMISOS$1 = /* @__PURE__ */ new Set([
	"concedido",
	"denegado",
	"no_aplica"
]);
function comoPermiso(v) {
	return typeof v === "string" && PERMISOS$1.has(v) ? v : null;
}
function limpiar(lista) {
	return lista.filter((n) => typeof n.id === "string" && n.id !== "" && Number.isFinite(n.at)).map((n) => ({
		id: n.id,
		titulo: n.titulo,
		texto: n.texto,
		at: Math.trunc(n.at),
		ruta: n.ruta
	}));
}
async function programarNotificaciones(lista) {
	const limpia = limpiar(lista);
	const json = JSON.stringify(limpia);
	const android = puenteAndroid();
	if (android) {
		try {
			android.programarRecordatorios(json);
		} catch {}
		return;
	}
	await esperarPuente();
	if (hayPywebview()) {
		const api = await apiPywebview("programar_notificaciones");
		if (api?.programar_notificaciones) try {
			await api.programar_notificaciones(json);
		} catch {}
		return;
	}
}
async function permisoNotificaciones() {
	const android = puenteAndroid();
	if (!android) return "no_aplica";
	try {
		return comoPermiso(android.permisoNotificaciones()) ?? "no_aplica";
	} catch {
		return "no_aplica";
	}
}
var TOPE_PERMISO_MS = 6e4;
async function pedirPermisoNotificaciones() {
	const android = puenteAndroid();
	if (!android) return "no_aplica";
	return await pedirAndroid("creatorhub-permiso", (id) => android.pedirPermisoNotificaciones(id), (d) => comoPermiso(d["resultado"]), TOPE_PERMISO_MS) ?? permisoNotificaciones();
}
/**
* @/plataforma · ciclo de vida (04 §B.10, §A.6). Atrás de Android: la capa nativa llama window.creatorHubBack(), que
* recorre la pila de manejadores del último al primero (true = lo consumió; si nadie lo consume, la app pasa a segundo
* plano). Volver al frente: visibilitychange → visible y el evento nativo creatorhub-reanudar (onResume).
*/
var pilaAtras = [];
function manejarAtras() {
	for (let i = pilaAtras.length - 1; i >= 0; i -= 1) {
		const r = pilaAtras[i];
		if (!r) continue;
		try {
			if (r.fn()) return true;
		} catch {}
	}
	return false;
}
function instalarAtras() {
	const w = ventanaCorte();
	if (w && w.creatorHubBack !== manejarAtras) w.creatorHubBack = manejarAtras;
}
instalarAtras();
/** El último registrado decide primero; devuelve la función para quitarlo (idempotente). */
function registrarAtras(manejador) {
	instalarAtras();
	const registro = { fn: manejador };
	pilaAtras.push(registro);
	return () => {
		const i = pilaAtras.indexOf(registro);
		if (i >= 0) pilaAtras.splice(i, 1);
	};
}
function alVolverAlFrente(fn) {
	if (typeof document === "undefined") return () => void 0;
	const visible = () => {
		if (document.visibilityState === "visible") fn();
	};
	document.addEventListener("visibilitychange", visible);
	const w = ventanaCorte();
	const reanudar = () => fn();
	w?.addEventListener("creatorhub-reanudar", reanudar);
	return () => {
		document.removeEventListener("visibilitychange", visible);
		w?.removeEventListener("creatorhub-reanudar", reanudar);
	};
}
/** Solo Windows (js_api). En Android y en el navegador no hace nada. */
var ventana = {
	ocultar() {
		if (puenteAndroid() !== null) return;
		enSegundoPlano(async () => {
			const api = await apiPywebview("ventana_ocultar");
			if (api?.ventana_ocultar) await api.ventana_ocultar();
		});
	},
	/** Cierre real (no a la bandeja). */
	cerrarDelTodo() {
		if (puenteAndroid() !== null) return;
		enSegundoPlano(async () => {
			const api = await apiPywebview("ventana_cerrar");
			if (api?.ventana_cerrar) await api.ventana_cerrar();
		});
	}
};
function texto$13(v) {
	return typeof v === "string" && v !== "" ? v : null;
}
function numero$3(v) {
	return typeof v === "number" && Number.isFinite(v) ? v : null;
}
/** Convierte el JSON de estadoConexion() / creatorhub-conexion en un EstadoConexionPc completo (faltantes → neutros). */
function normalizarConexion(v) {
	if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
	const d = { ...v };
	const permisos = d["permisos"] === "lectura" || d["permisos"] === "lectura_escritura" ? d["permisos"] : null;
	const incompatible = d["incompatible"] === "actualiza_app" || d["incompatible"] === "actualiza_pc" ? d["incompatible"] : null;
	return {
		emparejado: d["emparejado"] === true,
		host_id: texto$13(d["host_id"]),
		nombre_equipo: texto$13(d["nombre_equipo"]),
		conectado: d["conectado"] === true,
		ip: texto$13(d["ip"]),
		ultima_copia_at: numero$3(d["ultima_copia_at"]),
		cambios_pendientes: Math.max(0, Math.trunc(numero$3(d["cambios_pendientes"]) ?? 0)),
		permisos,
		revocado: d["revocado"] === true,
		incompatible,
		sync_en_curso: d["sync_en_curso"] === true
	};
}
function conexionDemo() {
	return {
		emparejado: true,
		host_id: "3f2a0000000000000000000000000000",
		nombre_equipo: "PC 3F2A",
		conectado: parametroUrl$1("pc") === "conectada",
		ip: "192.168.1.20",
		ultima_copia_at: null,
		cambios_pendientes: 0,
		permisos: "lectura_escritura",
		revocado: false,
		incompatible: null,
		sync_en_curso: false
	};
}
/** En Windows y en el navegador devuelve null. */
function estadoConexionPc() {
	const android = puenteAndroid();
	if (android) try {
		return normalizarConexion(JSON.parse(android.estadoConexion())) ?? normalizarConexion({});
	} catch {
		return normalizarConexion({});
	}
	return simulaAndroid() ? conexionDemo() : null;
}
function alCambiarConexionPc(fn) {
	if (!puenteAndroid()) return () => void 0;
	let ultimo = "";
	const avisar = (e) => {
		const huella = JSON.stringify(e);
		if (huella === ultimo) return;
		ultimo = huella;
		fn(e);
	};
	const quitarConexion = escucharAndroid("creatorhub-conexion", (d) => normalizarConexion(d), avisar);
	const quitarCopia = escucharAndroid("creatorhub-copia", () => estadoConexionPc(), avisar);
	return () => {
		quitarConexion();
		quitarCopia();
	};
}
var TOPE_BUSQUEDA_MS = 5e3;
function leerPcs(d) {
	const lista = d["pcs"];
	if (!Array.isArray(lista)) return null;
	const pcs = [];
	for (const x of lista) {
		if (x === null || typeof x !== "object") continue;
		const p = { ...x };
		const host_id = texto$13(p["host_id"]);
		const nombre_equipo = texto$13(p["nombre_equipo"]);
		const ip = texto$13(p["ip"]);
		const puerto = numero$3(p["puerto"]);
		if (host_id && nombre_equipo && ip && puerto !== null) pcs.push({
			host_id,
			nombre_equipo,
			ip,
			puerto
		});
	}
	return pcs;
}
/** Descubrimiento UDP 39231 (1.5 s en la capa nativa). Sin puente o sin respuesta: []. */
async function buscarPcs() {
	const android = puenteAndroid();
	if (!android) return [];
	return await pedirAndroid("creatorhub-descubrimiento", (id) => android.buscarPcs(id), leerPcs, TOPE_BUSQUEDA_MS) ?? [];
}
var ERRORES_EMPAREJAMIENTO = /* @__PURE__ */ new Set([
	"qr_invalido",
	"codigo_invalido",
	"pc_no_encontrada",
	"huella_distinta",
	"rechazado",
	"vencido",
	"ocupado",
	"red",
	"version_incompatible",
	"cancelado"
]);
var MENSAJE_ERROR = {
	qr_invalido: "Ese código QR no es de Corte. Escanea el que aparece en tu PC.",
	codigo_invalido: "Ese código no es válido. Revisa que tenga 12 caracteres.",
	pc_no_encontrada: "No encontramos tu PC en esta red. Revisa que Corte esté abierto en tu PC y que ambos estén en el mismo Wi‑Fi.",
	huella_distinta: "La PC no es la que emparejaste.",
	rechazado: "Se rechazó el emparejamiento en tu PC.",
	vencido: "El código venció. Genera uno nuevo en tu PC.",
	ocupado: "Tu PC ya está emparejando otro celular. Inténtalo en unos minutos.",
	red: "No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.",
	version_incompatible: "Tu PC y tu celular tienen versiones de Corte que no se entienden. Actualiza la que sea más vieja.",
	cancelado: "Cancelaste el emparejamiento."
};
/** Valida un detail de creatorhub-emparejamiento y lo convierte en EventoEmparejamiento (sin el id). */
function leerEventoEmparejamiento(d) {
	switch (d["fase"]) {
		case "conectando": return { fase: "conectando" };
		case "verifica": {
			const codigo = texto$13(d["codigo_verificacion"]);
			return codigo ? {
				fase: "verifica",
				codigo_verificacion: codigo
			} : null;
		}
		case "aprobado": return {
			fase: "aprobado",
			nombre_equipo: texto$13(d["nombre_equipo"]) ?? ""
		};
		case "error": {
			const e = d["error"];
			const error = typeof e === "string" && ERRORES_EMPAREJAMIENTO.has(e) ? e : "red";
			return {
				fase: "error",
				error,
				mensaje: texto$13(d["mensaje"]) ?? MENSAJE_ERROR[error]
			};
		}
		default: return null;
	}
}
function emparejar(llamar, alEvento) {
	const android = puenteAndroid();
	if (!android) {
		let cancelado = false;
		const t = setTimeout(() => {
			if (!cancelado) alEvento({
				fase: "error",
				error: "red",
				mensaje: "Para emparejar abre Corte en tu celular Android."
			});
		}, 0);
		return () => {
			cancelado = true;
			clearTimeout(t);
		};
	}
	const id = nuevoIdPedido();
	let terminado = false;
	const quitar = escucharAndroid("creatorhub-emparejamiento", (d) => d["id"] === id ? leerEventoEmparejamiento(d) : null, (e) => {
		if (terminado) return;
		if (e.fase === "aprobado" || e.fase === "error") {
			terminado = true;
			quitar();
		}
		alEvento(e);
	});
	try {
		llamar(id);
	} catch {
		terminado = true;
		quitar();
		setTimeout(() => alEvento({
			fase: "error",
			error: "red",
			mensaje: MENSAJE_ERROR.red
		}), 0);
	}
	return () => {
		if (terminado) return;
		terminado = true;
		quitar();
		try {
			android.cancelarEmparejamiento(id);
		} catch {}
	};
}
/** `textoQr` = 'creatorhub://pair?v=1&…' (04 §C.4). Devuelve la función para cancelar. */
function emparejarConQr(textoQr, alEvento) {
	return emparejar((id) => puenteAndroid()?.emparejarQr(textoQr, id), alEvento);
}
/** `codigo` = 12 caracteres Crockford con o sin guiones; `ip` null = usar el descubrimiento. */
function emparejarConCodigo(codigo, ip, alEvento) {
	return emparejar((id) => puenteAndroid()?.emparejarCodigo(codigo, ip ?? "", id), alEvento);
}
/** Borra credencial, copia, cola de cambios e imágenes del celular. */
async function olvidarPc() {
	const android = puenteAndroid();
	if (!android) return;
	let ok = false;
	try {
		ok = android.olvidarPc() === true;
	} catch {
		ok = false;
	}
	if (!ok) throw new Error("No pudimos olvidar tu PC en este celular. Inténtalo de nuevo.");
}
var TOPE_ACTUALIZAR_MS = 3e4;
/** Copia + envío de la cola ahora mismo. Rechaza con un Error (texto listo para mostrar) si no se pudo. */
async function actualizarCopiaAhora() {
	const android = puenteAndroid();
	if (!android) return;
	if (await pedirAndroid("creatorhub-actualizar", (id) => android.actualizarAhora(id), (d) => typeof d["ok"] === "boolean" ? d["ok"] : null, TOPE_ACTUALIZAR_MS) !== true) throw new Error("No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.");
}
/** Enlace creatorhub://pair?… recibido de fuera y aún no usado; '' → null. Nunca empareja solo. */
function consumirEnlacePendiente() {
	const android = puenteAndroid();
	if (!android) return null;
	try {
		return texto$13(android.consumirEnlace());
	} catch {
		return null;
	}
}
function alEnlace(fn) {
	if (!puenteAndroid()) return () => void 0;
	return escucharAndroid("creatorhub-enlace", (d) => texto$13(d["url"]), fn);
}
var ErrorHub = class extends Error {
	codigo;
	/** 0 si no hubo respuesta HTTP. */
	http;
	mensaje;
	detalle;
	reintentar_en_s;
	/** Solo con codigo 'conflicto': la versión vigente del hub. */
	vigente;
	constructor(codigo, mensaje, http = 0, detalle, reintentar_en_s, vigente) {
		super(mensaje);
		this.name = "ErrorHub";
		this.codigo = codigo;
		this.mensaje = mensaje;
		this.http = http;
		this.detalle = detalle;
		this.reintentar_en_s = reintentar_en_s;
		this.vigente = vigente;
	}
};
/** Texto del conflicto de edición (BUILD_SPEC C26). */
var TEXTO_CONFLICTO = "Esta muestra también se cambió en tu PC mientras estabas sin conexión. Conservamos el cambio de tu PC.";
/** Android sin la PC y la vista no se arma con la copia (02 §11, BUILD_SPEC §8.3). */
var TEXTO_NECESITA_PC = "Necesita tu PC encendida";
/** Android: la PC no responde (01 §5.3 B). */
var TEXTO_RED_ANDROID = "No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.";
/** Respaldo por código cuando la respuesta no trae `mensaje`. */
var MENSAJES = {
	no_encontrado: "No encontramos lo que buscas. Puede que ya no exista.",
	parametros_invalidos: "Algo no cuadró con lo que pediste. Revisa los datos e inténtalo de nuevo.",
	cuerpo_demasiado_grande: "Es demasiado grande para guardarlo de una vez.",
	sesion_invalida: "Tu sesión en Corte se cerró. Cierra y vuelve a abrir Corte.",
	prohibido: "No tienes permiso para hacer este cambio.",
	solo_local: "Esto solo se puede hacer desde Corte en tu PC.",
	conflicto: TEXTO_CONFLICTO,
	demasiadas_solicitudes: "Vamos muy rápido. Espera un momento e inténtalo de nuevo.",
	sin_credenciales: "Falta conectar Corte con TikTok.",
	reautorizar: "Tu conexión con TikTok se venció. Reautoriza para seguir actualizando tus datos.",
	sin_permiso_tiktok: "Falta un permiso de TikTok. Vuelve a autorizar y deja activados todos los permisos.",
	tiktok_no_disponible: "TikTok Shop tuvo un problema temporal. Reintentaremos automáticamente.",
	sin_internet: "Sin conexión a internet. Revísala e inténtalo de nuevo.",
	state_invalido: "Ese enlace de autorización ya no sirve. Genera uno nuevo.",
	codigo_vencido: "La autorización tardó demasiado y venció. Vuelve a autorizar.",
	cuenta_distinta: "Autorizaste otra cuenta de TikTok distinta de la que ya estaba conectada.",
	no_es_creador: "La cuenta que autorizaste no es de creador de TikTok Shop. Cierra sesión en TikTok Shop y vuelve a intentarlo con tu cuenta de creador.",
	archivo_no_encontrado: "No encontramos ese archivo. Revisa que siga en su lugar.",
	archivo_invalido: "Ese archivo no es válido para Corte.",
	app_secret_invalido: "La clave de la app no es válida. Revísala en Partner Center.",
	firma_invalida: "No pudimos verificar la conexión con tu PC. Inténtalo de nuevo.",
	reloj_desfasado: "La hora de tu celular no coincide con la de tu PC. Revisa la fecha y hora del celular.",
	repetida: "No pudimos verificar la conexión con tu PC. Inténtalo de nuevo.",
	dispositivo_revocado: "Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.",
	dispositivo_desconocido: "Tu PC ya no reconoce este celular. Vuelve a emparejarlo para actualizarte.",
	emparejamiento_vencido: "El código para emparejar venció. Genera uno nuevo.",
	emparejamiento_rechazado: "Se rechazó el emparejamiento.",
	emparejamiento_ocupado: "Ya hay otro emparejamiento en curso. Termínalo o espera unos minutos.",
	base_de_version_nueva: "Tus datos son de una versión más nueva de Corte. Actualiza Corte en esta PC.",
	error_interno: "Algo salió mal en Corte. Inténtalo de nuevo.",
	necesita_pc: TEXTO_NECESITA_PC,
	solo_en_pc: "Esto solo se puede hacer desde Corte en tu PC.",
	red: "No pudimos conectar con Corte. Inténtalo de nuevo."
};
var CODIGOS_HUB = /* @__PURE__ */ new Set([
	"no_encontrado",
	"parametros_invalidos",
	"cuerpo_demasiado_grande",
	"sesion_invalida",
	"prohibido",
	"solo_local",
	"conflicto",
	"demasiadas_solicitudes",
	"sin_credenciales",
	"reautorizar",
	"sin_permiso_tiktok",
	"tiktok_no_disponible",
	"sin_internet",
	"state_invalido",
	"codigo_vencido",
	"cuenta_distinta",
	"no_es_creador",
	"archivo_no_encontrado",
	"archivo_invalido",
	"app_secret_invalido",
	"firma_invalida",
	"reloj_desfasado",
	"repetida",
	"dispositivo_revocado",
	"dispositivo_desconocido",
	"emparejamiento_vencido",
	"emparejamiento_rechazado",
	"emparejamiento_ocupado",
	"base_de_version_nueva",
	"error_interno"
]);
function esCodigoHub(v) {
	return typeof v === "string" && CODIGOS_HUB.has(v);
}
/** Código por estado HTTP cuando el cuerpo no es un ErrorRespuesta (proxy, HTML, vacío). */
function codigoPorHttp(http) {
	if (http === 401) return "sesion_invalida";
	if (http === 403) return "prohibido";
	if (http === 404) return "no_encontrado";
	if (http === 409) return "conflicto";
	if (http === 413) return "cuerpo_demasiado_grande";
	if (http === 400 || http === 422) return "parametros_invalidos";
	if (http === 429) return "demasiadas_solicitudes";
	return "error_interno";
}
function esObjeto$3(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
function leerDetalle(v) {
	if (!esObjeto$3(v)) return void 0;
	const salida = {};
	for (const [k, x] of Object.entries(v)) if (x === null || typeof x === "string" || typeof x === "number" || typeof x === "boolean") salida[k] = x;
	return salida;
}
/** ¿Parece un objeto del estado local (PlanVideo, Nota, …, PreferenciasSincronizadas)? */
function esObjetoLocal(v) {
	return esObjeto$3(v) && typeof v["rev"] === "number";
}
/**
* ErrorHub desde el estado HTTP y el cuerpo ya leído (texto JSON o valor). Acepta ErrorRespuesta completo; si no lo es,
* usa el código por estado. `reintentarCabecera` = Retry-After en segundos, si vino.
*/
function errorDesdeCuerpo(http, cuerpo, reintentarCabecera) {
	let valor = cuerpo;
	if (typeof cuerpo === "string") try {
		valor = cuerpo === "" ? null : JSON.parse(cuerpo);
	} catch {
		valor = null;
	}
	const e = esObjeto$3(valor) && esObjeto$3(valor["error"]) ? valor["error"] : null;
	const codigo = e ? e["codigo"] : void 0;
	if (e && esCodigoHub(codigo)) {
		const textoHub = e["mensaje"];
		const mensaje = typeof textoHub === "string" && textoHub.trim() !== "" ? textoHub : MENSAJES[codigo];
		const r = e["reintentar_en_s"];
		const reintentar = typeof r === "number" ? r : reintentarCabecera;
		const v = e["vigente"];
		const vigente = codigo === "conflicto" && esObjetoLocal(v) ? v : void 0;
		return new ErrorHub(codigo, mensaje, http, leerDetalle(e["detalle"]), reintentar, vigente);
	}
	const porHttp = codigoPorHttp(http);
	return new ErrorHub(porHttp, MENSAJES[porHttp], http, void 0, reintentarCabecera);
}
/** ErrorHub desde una Response de fetch que no fue 2xx/304. */
async function errorDesdeRespuesta(resp) {
	let cuerpo = "";
	try {
		cuerpo = await resp.text();
	} catch {
		cuerpo = "";
	}
	const ra = Number(resp.headers.get("Retry-After"));
	return errorDesdeCuerpo(resp.status, cuerpo, Number.isFinite(ra) && ra > 0 ? ra : void 0);
}
function errorDeRed(mensaje = MENSAJES.red) {
	return new ErrorHub("red", mensaje, 0);
}
function necesitaPc$1() {
	return new ErrorHub("necesita_pc", TEXTO_NECESITA_PC, 0);
}
function soloEnPc() {
	return new ErrorHub("solo_en_pc", MENSAJES.solo_en_pc, 0);
}
/** Cualquier error → ErrorHub (los inesperados como error_interno, sin texto técnico). */
function comoErrorHub(e) {
	if (e instanceof ErrorHub) return e;
	return new ErrorHub("error_interno", MENSAJES.error_interno, 0);
}
var TZ_OFFSET_S = -21600;
var DIA_MS = 864e5;
var DIA_S$1 = 86400;
var relojFijo = null;
/** Reloj de la app (epoch s). En pruebas: fijarReloj(() => 1794500100). */
function ahoraS() {
	return relojFijo ? Math.floor(relojFijo()) : Math.floor(Date.now() / 1e3);
}
function fijarReloj(fn) {
	relojFijo = fn;
}
/** [año, mes 1..12, día]. Lanza RangeError si no es 'YYYY-MM-DD' o la fecha no existe (31 feb). */
function partesFecha(fecha) {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
	if (!m) throw new RangeError(`Fecha local inválida: ${fecha}`);
	const a = Number(m[1]);
	const mes = Number(m[2]);
	const d = Number(m[3]);
	const prueba = new Date(Date.UTC(a, mes - 1, d));
	if (prueba.getUTCFullYear() !== a || prueba.getUTCMonth() !== mes - 1 || prueba.getUTCDate() !== d) throw new RangeError(`Fecha local inválida: ${fecha}`);
	return [
		a,
		mes,
		d
	];
}
/** true si es una fecha 'YYYY-MM-DD' que existe. */
function esFechaLocal(fecha) {
	if (typeof fecha !== "string") return false;
	try {
		partesFecha(fecha);
		return true;
	} catch {
		return false;
	}
}
function msUtcDe(fecha) {
	const [a, m, d] = partesFecha(fecha);
	return Date.UTC(a, m - 1, d);
}
function fechaDeMsUtc(ms) {
	return new Date(ms).toISOString().slice(0, 10);
}
function fechaLocalDe(t) {
	return fechaDeMsUtc((Math.floor(t) + TZ_OFFSET_S) * 1e3);
}
function hoyLocal(ahora = ahoraS()) {
	return fechaLocalDe(ahora);
}
function sumarDias(fecha, dias) {
	return fechaDeMsUtc(msUtcDe(fecha) + Math.trunc(dias) * DIA_MS);
}
/** b − a en días de calendario. */
function diasEntre(a, b) {
	return Math.round((msUtcDe(b) - msUtcDe(a)) / DIA_MS);
}
/** 0 = lunes … 6 = domingo. */
function diaSemana(fecha) {
	return (new Date(msUtcDe(fecha)).getUTCDay() + 6) % 7;
}
function horaLocal(t) {
	const s = ((Math.floor(t) + TZ_OFFSET_S) % DIA_S$1 + DIA_S$1) % DIA_S$1;
	return {
		h: Math.floor(s / 3600),
		m: Math.floor(s % 3600 / 60)
	};
}
/** Epoch del inicio (00:00 local) de una fecha, o de la hora indicada. */
function epochDeFecha(fecha, hora = 0, minuto = 0) {
	return msUtcDe(fecha) / 1e3 + hora * 3600 + minuto * 60 - TZ_OFFSET_S;
}
/**
* Instante de referencia para las reglas que necesitan "ahora" pero solo reciben `hoy` (copiado sin confirmar de menos
* de 7 días, por vencer en < 48 h, marcas de tiempo de las ops de la copia): el reloj de la app si cae en ese día; si no,
* el mediodía local de `hoy`. Así el resultado es determinista con fijarReloj() y coherente con la fecha que se pasa.
*/
function instanteDe(hoy) {
	const t = ahoraS();
	return fechaLocalDe(t) === hoy ? t : epochDeFecha(hoy, 12);
}
function primeroDeMes(anio, mes) {
	return `${String(anio).padStart(4, "0")}-${String(mes).padStart(2, "0")}-01`;
}
/** Desde/hasta de un periodo ('7d','30d','90d','12m','todo','2026-10'); ventanas inclusivas de N días (01_ux §6.0):
*  "últimos N días" = hoy − (N − 1) … hoy. 12m = 12 meses calendario incluyendo el actual (03 §6.2, analitica_ref).
*  'todo' empieza en `primeraFecha` (o hoy si falta). Un mes 'YYYY-MM' va del día 1 al último día de ese mes.
*  Ojo con 'todo' sin `primeraFecha`: queda desde = hasta = hoy, un rango de UN día. Para "Todo" pasa la primera fecha
*  del historial (dashboard.todo.periodo.desde; sin conexión, copia.dashboard.todo.periodo.desde) o pide sin rango;
*  si no, deCopia de videos, productos, tiendas y tienda devuelve null porque ese día no cubre el historial. */
function rangoDePeriodo(periodo, hoy, primeraFecha) {
	const dias = /^(\d+)d$/.exec(periodo);
	if (dias) return {
		desde: sumarDias(hoy, -(Math.max(1, Number(dias[1])) - 1)),
		hasta: hoy
	};
	if (periodo === "12m") {
		const [a, m] = partesFecha(hoy);
		const indice = a * 12 + (m - 1) - 11;
		return {
			desde: primeroDeMes(Math.floor(indice / 12), indice % 12 + 1),
			hasta: hoy
		};
	}
	if (periodo === "todo") return {
		desde: primeraFecha !== void 0 && primeraFecha <= hoy ? primeraFecha : hoy,
		hasta: hoy
	};
	const mes = /^(\d{4})-(\d{1,2})$/.exec(periodo);
	if (mes) {
		const a = Number(mes[1]);
		const m = Math.min(12, Math.max(1, Number(mes[2])));
		return {
			desde: primeroDeMes(a, m),
			hasta: sumarDias(m === 12 ? primeroDeMes(a + 1, 1) : primeroDeMes(a, m + 1), -1)
		};
	}
	return {
		desde: sumarDias(hoy, -29),
		hasta: hoy
	};
}
var MESES = [
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
];
var MESES_LARGOS = [
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
var DIAS$1 = [
	"lun",
	"mar",
	"mié",
	"jue",
	"vie",
	"sáb",
	"dom"
];
var DIAS_LARGOS = [
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado",
	"domingo"
];
var nfEntero = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
var nfDos = new Intl.NumberFormat("es-MX", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
var nfUno = new Intl.NumberFormat("es-MX", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});
var nfHastaUno = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
var nfHastaDos = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 });
var nfLibre = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 3 });
/** Antepone el menos tipográfico solo si la cifra mostrada no es cero ("−$0" no existe). */
function conSigno(negativo, texto) {
	return negativo && /[1-9]/.test(texto) ? `−${texto}` : texto;
}
function aFecha(f) {
	return typeof f === "number" ? fechaLocalDe(f) : f;
}
function esOtroAnio(anio) {
	return anio !== partesFecha(hoyLocal())[0];
}
function mesCorto(m) {
	return MESES[m - 1] ?? "";
}
function dinero(centavos, opciones) {
	const pesos = Math.abs(centavos) / 100;
	const cifra = opciones?.decimales === true ? nfDos.format(pesos) : nfEntero.format(pesos);
	return conSigno(centavos < 0, `$${cifra}`);
}
function numero$2(n) {
	return conSigno(n < 0, nfLibre.format(Math.abs(n)));
}
function fechaCorta(f) {
	const [a, m, d] = partesFecha(aFecha(f));
	const base = `${d} ${mesCorto(m)}`;
	return esOtroAnio(a) ? `${base} ${a}` : base;
}
function fechaConDia(f) {
	const fecha = aFecha(f);
	const [a, m, d] = partesFecha(fecha);
	const base = `${DIAS$1[diaSemana(fecha)] ?? ""} ${d} ${mesCorto(m)}`;
	return esOtroAnio(a) ? `${base} ${a}` : base;
}
function fechaLarga(f) {
	const fecha = aFecha(f);
	const [a, m, d] = partesFecha(fecha);
	const base = `${DIAS_LARGOS[diaSemana(fecha)] ?? ""} ${d} de ${MESES_LARGOS[m - 1] ?? ""}`;
	return esOtroAnio(a) ? `${base} de ${a}` : base;
}
/**
* Relativa (01_ux §1.5): con hora cerca del instante ('hace unos segundos', 'hace 4 min', 'hace 2 h', 'en 20 min') y,
* después, por días de calendario: 'hoy', 'ayer', 'mañana', 'hace 3 días', 'en 2 días' (hasta 7); más lejos, fechaCorta.
*/
function relativa(t, ahora = ahoraS()) {
	const diferencia = ahora - t;
	const abs = Math.abs(diferencia);
	const pasado = diferencia >= 0;
	if (abs < 60) return pasado ? "hace unos segundos" : "en unos segundos";
	if (abs < 3600) {
		const n = Math.floor(abs / 60);
		return pasado ? `hace ${n} min` : `en ${n} min`;
	}
	if (abs < 21600) {
		const n = Math.floor(abs / 3600);
		return pasado ? `hace ${n} h` : `en ${n} h`;
	}
	const dias = diasEntre(fechaLocalDe(t), fechaLocalDe(ahora));
	if (dias === 0) return "hoy";
	if (dias === 1) return "ayer";
	if (dias === -1) return "mañana";
	if (dias > 1 && dias <= 7) return `hace ${dias} días`;
	if (dias < -1 && dias >= -7) return `en ${-dias} días`;
	return fechaCorta(t);
}
var formato = {
	/** $12,345 (sin decimales) · con decimales: $12.34 · signo: −$1,234 con menos tipográfico. */
	dinero,
	/** '≈ $1,234'. */
	dineroAprox(centavos) {
		return `≈ ${dinero(centavos)}`;
	},
	/** '$14 – $131' o '$14' si son iguales; '—' si ambos null. */
	rangoDinero(min, max, opciones) {
		const a = min ?? max;
		const b = max ?? min;
		if (a === null || b === null) return "—";
		const op = opciones?.decimales === true ? { decimales: true } : {};
		const ta = dinero(Math.min(a, b), op);
		const tb = dinero(Math.max(a, b), op);
		const texto = ta === tb ? ta : `${ta} – ${tb}`;
		return opciones?.aprox === true ? `≈ ${texto}` : texto;
	},
	/** 'desde ≈ $1,234' (suma aproximada con rangos). */
	desdeAprox(centavos) {
		return `desde ≈ ${dinero(centavos)}`;
	},
	/** '1,234'. */
	numero: numero$2,
	/** 0..1 → '42 %' (0 decimales) o '42.5 %'. */
	porcentaje(p, decimales = 0) {
		const valor = Math.abs(p) * 100;
		const cifra = decimales === 1 ? nfUno.format(valor) : nfEntero.format(valor);
		return `${conSigno(p < 0, cifra)} %`;
	},
	/** 800 → '8 %' · 850 → '8.5 %'. */
	tasaBp(bp) {
		return `${conSigno(bp < 0, nfHastaDos.format(Math.abs(bp) / 100))} %`;
	},
	/** '12 nov' · otro año: '28 dic 2025'. */
	fechaCorta,
	/** 'jue 12 nov'. */
	fechaConDia,
	/** 'viernes 20 de noviembre' (mensajes a tiendas). */
	fechaLarga,
	relativa,
	/** '6:30 p. m.'. */
	hora(t) {
		const { h, m } = horaLocal(t);
		return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`;
	},
	/** Eje Y: 0 · '$5 mil' · '$10 mil' · '$1.2 M' (02 §4.3, sin "$0"). */
	ejeDinero(centavos) {
		const pesos = Math.abs(centavos) / 100;
		if (pesos === 0) return "0";
		let texto;
		if (pesos >= 1e6) texto = `$${nfHastaUno.format(pesos / 1e6)} M`;
		else if (pesos >= 1e3) texto = `$${nfHastaUno.format(pesos / 1e3)} mil`;
		else texto = `$${nfEntero.format(pesos)}`;
		return conSigno(centavos < 0, texto);
	},
	/** '7677…3012'. */
	idCorto(id) {
		return id.length > 10 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id;
	},
	/** 'hace 69 días' desde solicitada_at (nunca "días de atraso"). Sin fecha: '—'. */
	haceDias(t, ahora = ahoraS()) {
		if (t === null) return "—";
		const dias = diasEntre(fechaLocalDe(t), hoyLocal(ahora));
		if (dias <= 0) return "hoy";
		if (dias === 1) return "hace 1 día";
		return `hace ${numero$2(dias)} días`;
	}
};
/** Prefijos promocionales entre 【】 o [] (con o sin "BUEN FIN" delante): el mismo patrón que el hub (analitica_ref). */
var PREFIJO$2 = /^\s*(?:(?:BUEN FIN\s*)?(?:【[^】]{0,40}】|\[[^\]]{0,40}\])\s*)+/i;
var TALLA = /^(?:XXS|XS|S|M|L|XL|XXL|XXXL|\d?X{1,3}L)$/i;
/** Corte del paso 2 de 01_ux §6.0: primera coma, punto, punto y coma, barra vertical o " - ". */
var CORTE = /[,.;|]| - /;
/** Sustantivos genéricos de 01_ux §4.8 (lista fija), comparados sin acentos y en minúsculas. */
var GENERICOS = /* @__PURE__ */ new Set([
	"playera",
	"camiseta",
	"camisa",
	"polo",
	"chaqueta",
	"chamarra",
	"sudadera",
	"sueter",
	"chaleco",
	"pantalon",
	"jeans",
	"gorra",
	"sombrero",
	"cartera",
	"tenis",
	"botas",
	"botin",
	"conjunto",
	"paquete",
	"pack",
	"boxer",
	"toalla"
]);
function cp(texto) {
	return Array.from(texto);
}
function largo(texto) {
	return cp(texto).length;
}
function primeros(texto, n) {
	return cp(texto).slice(0, n).join("");
}
function sinAcentos(texto) {
	return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").normalize("NFC");
}
/** 02 §4.4 regla 1: si ≥ 60 % de las letras son mayúsculas y hay más de 12 letras, minúsculas con mayúscula inicial
*  (se conservan los tokens cortos con dígitos y las tallas: 3D, XL, 2x). Si no, el título tal cual (sin espacios a
*  los lados). Los nombres de tienda nunca pasan por aquí. */
function normalizarTitulo(titulo) {
	const letras = titulo.match(/\p{L}/gu) ?? [];
	const mayusculas = titulo.match(/\p{Lu}/gu) ?? [];
	if (letras.length <= 12 || mayusculas.length / letras.length < .6) return titulo.trim();
	const unido = titulo.trim().split(/(\s+)/).map((tk) => {
		if (/^\s+$/.test(tk)) return tk;
		if (/\d/.test(tk) && largo(tk) <= 4 || TALLA.test(tk)) return tk;
		return tk.toLocaleLowerCase("es-MX");
	}).join("");
	const i = unido.search(/\p{L}/u);
	if (i < 0) return unido;
	return unido.slice(0, i) + unido.charAt(i).toLocaleUpperCase("es-MX") + unido.slice(i + 1);
}
/** Pasos 1 y 2 de 01_ux §6.0 sobre el título ya normalizado: [título limpio, primera frase]. */
function limpioYFrase(titulo) {
	const limpio = normalizarTitulo(titulo.replace(PREFIJO$2, "").trim() || titulo.trim());
	return [limpio, (limpio.split(CORTE)[0] ?? "").trim()];
}
function cortarEnPalabra(texto, n) {
	if (largo(texto) <= n) return texto;
	const corte = primeros(texto, n);
	const espacio = corte.lastIndexOf(" ");
	return (espacio > 0 ? corte.slice(0, espacio) : corte).trimEnd();
}
/**
* Nombre corto (01_ux §6.0), normalizado (02 §4.4): 1) sin prefijos 【…】/[…]; 2) hasta la primera , . ; | o " - ";
* 3) si pasa de `max` (48) caracteres, se corta en el último espacio antes de `max` y se agrega «…»; 4) si queda en
* menos de 12, los primeros `max` del título limpio. `max` se acota a 12..59, así que el resultado cabe en los 60 del
* contrato. El nombre corto que escriba el usuario siempre gana: quien lo tenga lo usa en lugar de llamar aquí.
*/
function nombreCorto(titulo, max = 48) {
	if (!titulo || !titulo.trim()) return "";
	const limite = Math.max(12, Math.min(Math.floor(max), 59));
	const [limpio, frase] = limpioYFrase(titulo);
	let t = frase;
	if (largo(t) > limite) t = cortarEnPalabra(t, limite) + "…";
	if (largo(t) < 12) t = primeros(limpio, limite).trimEnd();
	return t;
}
/** {producto} de 01_ux §4.8 ("Nombre para mensajes" de §6.0): pasos 1 y 2 del nombre corto, sin «…», tope de 80
*  caracteres en palabra completa; la primera letra pasa a minúscula solo si la primera palabra es un sustantivo
*  genérico de la lista fija ("polo de hombre…"); las marcas quedan igual ("AcmeFit 4 Camisetas…"). */
function nombreParaMensaje(titulo) {
	if (!titulo || !titulo.trim()) return "";
	const [limpio, frase] = limpioYFrase(titulo);
	let t = cortarEnPalabra(frase || limpio, 80);
	const primera = sinAcentos((t.split(/\s+/)[0] ?? "").toLocaleLowerCase("es-MX"));
	if (GENERICOS.has(primera)) t = t.charAt(0).toLocaleLowerCase("es-MX") + t.slice(1);
	return t;
}
function normalizarBusqueda(texto) {
	return sinAcentos(texto.toLocaleLowerCase("es-MX"));
}
function palabrasDe(busqueda) {
	return normalizarBusqueda(busqueda).split(/\s+/).filter((p) => p.length > 0);
}
/** Búsqueda que ignora acentos y mayúsculas; true si TODAS las palabras aparecen en algún campo. */
function coincide(busqueda, ...campos) {
	const palabras = palabrasDe(busqueda);
	if (palabras.length === 0) return true;
	const normalizados = campos.filter((c) => typeof c === "string").map(normalizarBusqueda);
	return palabras.every((p) => normalizados.some((c) => c.includes(p)));
}
/** Rangos [inicio, fin) del texto ORIGINAL (índices de JavaScript) que coinciden con alguna palabra, sin acentos ni
*  mayúsculas, ordenados y sin traslapes (para <mark>). */
function resaltar(busqueda, texto) {
	const palabras = palabrasDe(busqueda);
	if (palabras.length === 0 || texto.length === 0) return [];
	let normal = "";
	const origen = [];
	for (let i = 0; i < texto.length; i++) {
		const n = normalizarBusqueda(texto.charAt(i));
		for (let k = 0; k < n.length; k++) origen.push(i);
		normal += n;
	}
	const rangos = [];
	for (const p of palabras) {
		let desde = normal.indexOf(p);
		while (desde >= 0) {
			const ini = origen[desde];
			const fin = origen[desde + p.length - 1];
			if (ini !== void 0 && fin !== void 0) rangos.push([ini, fin + 1]);
			desde = normal.indexOf(p, desde + 1);
		}
	}
	rangos.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const unidos = [];
	for (const r of rangos) {
		const ultimo = unidos[unidos.length - 1];
		if (ultimo && r[0] <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], r[1]);
		else unidos.push([r[0], r[1]]);
	}
	return unidos;
}
/** uuid4 (crypto.randomUUID del entorno; respaldo con crypto.getRandomValues). */
function nuevoId() {
	const c = globalThis.crypto;
	if (typeof c?.randomUUID === "function") return c.randomUUID();
	const b = /* @__PURE__ */ new Uint8Array(16);
	if (typeof c?.getRandomValues === "function") c.getRandomValues(b);
	else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
	b[6] = (b[6] ?? 0) & 15 | 64;
	b[8] = (b[8] ?? 0) & 63 | 128;
	const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
	return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
var TONOS = [
	"iris",
	"coral",
	"aqua",
	"ambar",
	"rosa",
	"pizarra",
	"cielo",
	"verde"
];
var norm = (t) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
function fnv1a(s) {
	let h = 2166136261;
	for (const ch of s) {
		h ^= ch.codePointAt(0) ?? 0;
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
/** Mismo nombre, mismo tono en todas las pantallas y en ambos equipos. */
function tonoTienda(nombre) {
	return TONOS[fnv1a(norm(nombre)) % 8] ?? "iris";
}
var STOP = /* @__PURE__ */ new Set([
	"MX",
	"SHOP",
	"STORE",
	"OFFICIAL",
	"OFICIAL",
	"MEXICO",
	"TIENDA",
	"US",
	"THE",
	"DE",
	"LA",
	"EL"
]);
/** Moda Clara Boutique → MC · tienda10001 → TI · Águila Norte Sport → ÁN · LUMEQI MX → LU. */
function inicialesTienda(nombre) {
	const w = nombre.replace(/[_\-.&|/]+/g, " ").split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
	const s = w.filter((x) => !STOP.has(x.toUpperCase()));
	const ws = s.length ? s : w;
	const c = (x) => x.replace(/[^\p{L}\p{N}]/gu, "");
	const primerCaracter = (x) => Array.from(c(x))[0] ?? "";
	const a = ws[0];
	const b = ws[1];
	if (a !== void 0 && b !== void 0) return (primerCaracter(a) + primerCaracter(b)).toUpperCase();
	return Array.from(c(a ?? "?")).slice(0, 2).join("").toUpperCase() || "?";
}
var REGLAS_CATEGORIA = [
	[/sombrer|gorra|\bhats?\b|\bcaps?\b/, "Gorra"],
	[/calzado|tenis|bota|\bboots?\b|zapat|sandalia|chancla|sneaker|\bshoes?\b/, "SportShoe"],
	[/cartera|billetera|wallet|cinturon|\bbelts?\b/, "Wallet"],
	[/camis|playera|sudadera|chamarra|chaqueta|abrigo|chaleco|\bpolos?\b|sueter|\bropa\b|\btops?\b|conjunto|\bsets?\b|jean|pantalon|\bshorts?\b|jersey|hoodie|shirt|jacket|\bvests?\b|boxer/, "Shirt"]
];
function iconoDe(texto) {
	for (const [patron, icono] of REGLAS_CATEGORIA) if (patron.test(texto)) return icono;
	return null;
}
/** category_chains (hoja o ruta 'Ropa interior y de hombre > Camisas y abrigos > Sudaderas'). Manda la hoja; si la
*  hoja no dice nada, la ruta completa; si tampoco, 'Tag'. */
function iconoCategoria(categoria) {
	if (!categoria) return "Tag";
	const n = norm(categoria);
	const partes = n.split(/\s*(?:›|>|\/)\s*/).filter((p) => p.length > 0);
	return iconoDe(partes[partes.length - 1] ?? n) ?? iconoDe(n) ?? "Tag";
}
/** ancho × dpr → siguiente variante hacia arriba (96/240/720; más grande = og). */
function varianteParaAncho(anchoCss, dpr) {
	const px = anchoCss * (dpr > 0 ? dpr : 1);
	if (px <= 96) return "xs";
	if (px <= 240) return "sm";
	if (px <= 720) return "md";
	return "og";
}
function partirUrl(url) {
	const i = url.indexOf("?");
	return [i < 0 ? url : url.slice(0, i), (i < 0 ? "" : url.slice(i + 1)).split("&").filter((p) => p.length > 0 && !p.startsWith("t="))];
}
/** Agrega o reemplaza '&t=' conservando '?v='. 'og' quita t. */
function urlConVariante(url, variante) {
	const [base, params] = partirUrl(url);
	if (variante !== "og") params.push(`t=${variante}`);
	return params.length > 0 ? `${base}?${params.join("&")}` : base;
}
/** Clave de registroImagenes: la URL sin '&t=…'. Una URL con '?v=0' (imagen aún no descargada, C45) no tiene clave. */
function claveImagen(url) {
	const [base, params] = partirUrl(url);
	if (params.includes("v=0")) return null;
	return params.length > 0 ? `${base}?${params.join("&")}` : base;
}
var MAXIMO_REGISTRO_IMAGENES = 2e3;
var mapa = /* @__PURE__ */ new Map();
var suscriptores = /* @__PURE__ */ new Set();
var contador$2 = 0;
function iguales(a, b) {
	return a.w === b.w && a.h === b.h && a.lqip === b.lqip && a.color === b.color;
}
function avisar$1() {
	contador$2 += 1;
	for (const fn of [...suscriptores]) fn();
}
/**
* Almacén en memoria de meta_imagenes, sin componentes: @/datos registra lo que llega en cada respuesta (y la copia de
* Android) y <Foto> lo lee con useSyncExternalStore. Clave = URL sin '&t=…'; '?v=0' nunca tiene entrada. Máx. 2000
* entradas: registrar de nuevo una URL la vuelve la más reciente y se expulsan las más viejas.
*/
var registroImagenes = {
	registrar(meta) {
		if (!meta) return;
		let cambio = false;
		for (const [url, im] of Object.entries(meta)) {
			const clave = claveImagen(url);
			if (clave === null) continue;
			const previa = mapa.get(clave);
			mapa.delete(clave);
			mapa.set(clave, {
				w: im.w,
				h: im.h,
				lqip: im.lqip,
				color: im.color
			});
			if (!previa || !iguales(previa, im)) cambio = true;
		}
		while (mapa.size > MAXIMO_REGISTRO_IMAGENES) {
			const masVieja = mapa.keys().next();
			if (masVieja.done === true) break;
			mapa.delete(masVieja.value);
		}
		if (cambio) avisar$1();
	},
	leer(url) {
		if (!url) return void 0;
		const clave = claveImagen(url);
		return clave === null ? void 0 : mapa.get(clave);
	},
	/** Devuelve la función para desuscribirse. Avisa una vez por cada registrar() que cambió algo. */
	suscribir(fn) {
		suscriptores.add(fn);
		return () => {
			suscriptores.delete(fn);
		};
	},
	/** Contador que sube en cada cambio (getSnapshot de useSyncExternalStore). */
	version() {
		return contador$2;
	},
	vaciar() {
		if (mapa.size === 0) return;
		mapa.clear();
		avisar$1();
	}
};
/** 01_ux §2.2 (columna "Grupo UI"). */
var ETIQUETA_GRUPO = {
	entregada: "Entregada",
	exenta: "Exenta",
	en_revision: "En revisión",
	por_vencer: "Por vencer",
	pausada: "Pausada",
	vencida: "Vencida",
	esperando_aprobacion: "Esperando aprobación",
	en_camino: "En camino",
	pedido_cancelado: "Pedido de muestra cancelado",
	sin_envio: "Sin envío"
};
/** 02 §3.4. Por vencer pasa a 'critico' con menos de 48 h: lo decide quien pinta, con fecha_limite_at. */
var TONO_GRUPO = {
	entregada: "ok",
	exenta: "neutro",
	en_revision: "info",
	por_vencer: "atencion",
	pausada: "neutro",
	vencida: "atencion",
	esperando_aprobacion: "info",
	en_camino: "info",
	pedido_cancelado: "neutro",
	sin_envio: "neutro"
};
/** 02 §3.4 (Por vencer con menos de 48 h usa 'CircleAlert'). */
var ICONO_GRUPO = {
	entregada: "Check",
	exenta: "CircleMinus",
	en_revision: "Hourglass",
	por_vencer: "Clock",
	pausada: "Pause",
	vencida: "History",
	esperando_aprobacion: "Clock",
	en_camino: "Package",
	pedido_cancelado: "Ban",
	sin_envio: "Ban"
};
/** 01_ux §2.4. */
var ETIQUETA_ETAPA = {
	por_planear: "Por planear",
	planeada: "Planeada",
	video_listo: "Video listo",
	programada: "Programada",
	publicada: "Publicada",
	no_se_puede: "No se puede"
};
/** Escala lima de 02 §3.6: 0 = pista vacía, 1..4 = lima, 'no' = fuera del denominador. */
var PASO_ETAPA = {
	por_planear: 0,
	planeada: 1,
	video_listo: 2,
	programada: 3,
	publicada: 4,
	no_se_puede: "no"
};
/** 02 §3.6. */
var ICONO_ETAPA = {
	por_planear: "CircleDashed",
	planeada: "CalendarCheck",
	video_listo: "Clapperboard",
	programada: "CalendarClock",
	publicada: "CircleCheckBig",
	no_se_puede: "Ban"
};
/** 01_ux §2.7. */
var ETIQUETA_SALUD = {
	socio_con_pendientes: "Socio con pendientes",
	con_pendientes: "Con pendientes",
	con_plan: "Con plan",
	socio: "Socio",
	al_dia: "Al día",
	vende_contigo: "Vende contigo",
	solo_solicitudes: "Solo solicitudes",
	solo_reembolsos: "Solo reembolsos"
};
/** 02 §3.4 (Socio con pendientes = atención sólido; Con plan = info; Socio y Al día = ok; el resto neutro). */
var TONO_SALUD = {
	socio_con_pendientes: "atencion",
	con_pendientes: "atencion",
	con_plan: "info",
	socio: "ok",
	al_dia: "ok",
	vende_contigo: "neutro",
	solo_solicitudes: "neutro",
	solo_reembolsos: "neutro"
};
/** 01_ux §2.6. */
var ETIQUETA_NIVEL = {
	urgente: "Urgente",
	alta: "Alta",
	media: "Media",
	baja: "Baja",
	no_se_puede_etiquetar: "No se puede etiquetar"
};
/** 01_ux §2.4 ("No puedo hacer este video"). */
var ETIQUETA_MOTIVO_NO_SE_PUEDE = {
	agotado: "Producto agotado",
	desactivado: "Producto desactivado",
	no_llego: "No me llegó",
	incompleta: "Llegó incompleta",
	no_va_con_mi_contenido: "No va con mi contenido",
	otro: "Otro"
};
/** 01_ux §6.0 y §1.5: de dónde sale el precio que se muestra. */
var ETIQUETA_FUENTE_PRECIO = {
	variante: "Precio de la variante que recibiste",
	vitrina: "Precio en tu vitrina",
	comision: "Precio de venta (≈)",
	lista: "Precio de lista"
};
/** 01_ux §2.8 (columna UI). El comentario de OrdenVista.estado_etiqueta en contrato.ts abrevia FROZEN como
*  'Congelado'; aquí va el texto exacto de 01 (anotado como faltante de contrato en la entrega). */
var ETIQUETA_ESTADO_ORDEN = {
	SETTLED: "Liquidado",
	REFUNDED: "Reembolsado",
	"To-SETTLE": "Por liquidar",
	"AWAITING PAYMENT": "Esperando pago",
	FROZEN: "Congelado en revisión",
	UNSPECIFIED: "Sin estado",
	NO_DEVUELTA: "Ya no aparece en TikTok"
};
/** BUILD_SPEC §6.3.2: etiquetas de W3 y de Ajustes › Sincronización, en el orden de ejecución (C34). */
var ETIQUETA_PASO_SYNC = {
	perfil: "Tu perfil",
	muestras: "Tus muestras",
	cumplimientos: "Estado de cada muestra",
	productos: "Productos e imágenes",
	ordenes: "Tus ventas recientes",
	vitrina: "Tu vitrina",
	detalles: "Detalles de muestras",
	ordenes_anteriores: "Ventas anteriores",
	productos_ventas: "Fichas de productos de tus ventas",
	videos: "Portadas de tus videos",
	imagenes: "Imágenes",
	clasificacion: "Ordenando tus pendientes"
};
var CONTENIDO = {
	VIDEO: "Video",
	LIVE: "En vivo",
	PRE_LIVE: "Antes del en vivo",
	SHOP: "Vitrina",
	PROMOTION_PAGE: "Página de promoción",
	LINKSHARE: "Enlace compartido"
};
/** VIDEO → 'Video', SHOP → 'Vitrina', … (01_ux §2.8). Desconocido → tal cual; null → '—'. */
function etiquetaContenido(tipo) {
	if (tipo === null) return "—";
	return CONTENIDO[tipo] ?? tipo;
}
var TIPO_MUESTRA = {
	FREE_SAMPLE: "Muestra gratis",
	SAMPLE_COUPON: "Cupón de muestra",
	SAMPLE_CAMPAIGN: "Muestra de campaña",
	PLATFORM_FREE_SAMPLE: "Muestra de TikTok",
	REFUNDABLE_SAMPLE: "Muestra reembolsable"
};
/** FREE_SAMPLE → 'Muestra gratis', … (01_ux §2.8). Desconocido → tal cual. */
function etiquetaTipoMuestra(tipo) {
	return TIPO_MUESTRA[tipo] ?? tipo;
}
/** 02 §3.6 (chips de razón). */
var ICONO_RAZON = {
	promesa: "CalendarClock",
	posible_video: "Search",
	ya_vendes_con_esta_tienda: "Store",
	ya_lo_vendes: "Play",
	buena_comision: "Coins",
	muy_vendido: "Flame",
	se_vende_bien: "TrendingUp",
	paquete: "Box",
	tuvo_pausa: "Pause"
};
/** Texto del chip de razón con sus cifras (01_ux §2.6): 'Ya lo vendes en 12 videos', 'Te deja $40 – $45 por venta'. */
function textoRazon(razon, m) {
	const p = m.producto;
	switch (razon) {
		case "promesa": return m.avisos.promesa ? `Le prometiste el ${formato.fechaConDia(m.avisos.promesa)}` : "Le prometiste una fecha";
		case "posible_video": return "¿Ya tienes video? Revisa";
		case "ya_vendes_con_esta_tienda": return "Ya vendes con esta tienda";
		case "ya_lo_vendes": {
			const n = m.ventas_producto.videos;
			return `Ya lo vendes en ${formato.numero(n)} ${n === 1 ? "video" : "videos"}`;
		}
		case "buena_comision": return `Te deja ${formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos)} por venta`;
		case "muy_vendido": return `Muy vendido · ${formato.numero(Math.floor((p.unidades_vendidas_global ?? 0) / 1e3))} mil vendidos`;
		case "se_vende_bien": return `Se vende bien · ${formato.numero(p.unidades_vendidas_global ?? 0)} vendidos`;
		case "paquete": return "Llegó junto con 1 muestra más";
		case "tuvo_pausa": return "Tuvo pausa";
	}
}
var PERMISOS = {
	"creator.affiliate.info": "Ver tu perfil de creador",
	"creator.affiliate_collaboration.read": "Ver tus colaboraciones de afiliado",
	"creator.showcase.read": "Ver tu vitrina",
	"creator.showcase.write": "Administrar tu vitrina",
	"creator.affiliate.link.write": "Crear enlaces de afiliado"
};
/** Permiso → texto de 01_ux §4.14 A ('creator.showcase.read' → 'Ver tu vitrina'). Desconocido → tal cual. */
function textoPermiso(scope) {
	return PERMISOS[scope] ?? scope;
}
/** Botones de la tabla "Acción principal visible por etapa" (01_ux §2.4). */
var ETIQUETA_ACCION = {
	planear: "Planear",
	marcar_publicada: "Marcar publicada",
	video_listo: "Video listo",
	marcar_programada: "Marcar programada",
	avisar: "Avisar a la tienda",
	cambiar_fecha: "Cambiar fecha"
};
var GRUPOS_PENDIENTES = /* @__PURE__ */ new Set([
	"por_vencer",
	"vencida",
	"pausada"
]);
/** 01_ux §2.4: las etapas aplican en estos grupos (en los dos últimos solo se puede planear con anticipación). */
var GRUPOS_CON_ETAPAS = /* @__PURE__ */ new Set([
	"por_vencer",
	"vencida",
	"pausada",
	"esperando_aprobacion",
	"en_camino"
]);
var GRUPOS_ANTICIPADOS = /* @__PURE__ */ new Set(["esperando_aprobacion", "en_camino"]);
var SIETE_DIAS_S = 604800;
/** Grupo ∈ {por_vencer, vencida, pausada} y etapa ∉ {publicada, no_se_puede}. Igual que el hub: un plan "publicada"
*  con vinculo_origen 'video_previo' SIGUE pendiente (un video anterior a la muestra no salda, 01_ux §2.4 regla 4). */
function esPendiente(m) {
	if (!GRUPOS_PENDIENTES.has(m.grupo)) return false;
	const e = m.avance.etapa;
	if (e === "no_se_puede") return false;
	return !(e === "publicada" && m.avance.vinculo_origen !== "video_previo");
}
/** Publicada que cuenta como video publicado (sin video previo no aceptado). */
function esPublicadaValida(a) {
	return a.etapa === "publicada" && a.vinculo_origen !== "video_previo";
}
/** Avisos que mencionan la solicitud (en solicitud_ids o en compromisos), en el orden recibido. */
function avisosDe(applicationId, avisos) {
	return avisos.filter((a) => a.solicitud_ids.includes(applicationId) || Object.prototype.hasOwnProperty.call(a.compromisos, applicationId));
}
function enviado(a) {
	return a.marcado_enviado_at !== null && a.quitado_at === null;
}
/** Promesa vigente: la fecha de `compromisos` del aviso más reciente marcado como enviado (no quitado) que incluye la
*  muestra. null si no hay. Con empate de marcado_enviado_at gana el primero (como el `max` del hub). */
function promesaDe(applicationId, avisos) {
	let mejor = null;
	for (const a of avisosDe(applicationId, avisos)) {
		if (!enviado(a) || !Object.prototype.hasOwnProperty.call(a.compromisos, applicationId)) continue;
		if (mejor === null || (a.marcado_enviado_at ?? 0) > (mejor.marcado_enviado_at ?? 0)) mejor = a;
	}
	const fecha = mejor?.compromisos[applicationId];
	return mejor && fecha !== void 0 ? {
		fecha,
		aviso_id: mejor.id
	} : null;
}
/** Hoy > promesa y etapa ≠ publicada. */
function esPromesaVencida(promesa, etapa, hoy) {
	return promesa !== null && hoy > promesa && etapa !== "publicada";
}
/** La solicitud aparece en algún aviso enviado y no quitado. */
function estaAvisada(applicationId, avisos) {
	return avisosDe(applicationId, avisos).some(enviado);
}
function resumenAvisos(applicationId, etapa, avisos, hoy) {
	const ahora = instanteDe(hoy);
	const propios = avisosDe(applicationId, avisos);
	let copiado = null;
	let ultimo = null;
	for (const a of propios) {
		if (a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS_S) {
			if (copiado === null || a.copiado_at > (copiado.copiado_at ?? 0)) copiado = a;
		}
		if (enviado(a) && a.marcado_enviado_at !== null && (ultimo === null || a.marcado_enviado_at > ultimo)) ultimo = a.marcado_enviado_at;
	}
	const promesa = promesaDe(applicationId, avisos)?.fecha ?? null;
	return {
		promesa,
		promesa_vencida: esPromesaVencida(promesa, etapa, hoy),
		copiado_sin_confirmar: copiado && copiado.copiado_at !== null ? {
			aviso_id: copiado.id,
			copiado_at: copiado.copiado_at
		} : null,
		ultimo_enviado_at: ultimo
	};
}
/** El PlanVideo vivo de la solicitud (el hub garantiza uno; si llegan varios, el editado más recientemente). */
function planVivo(applicationId, planes) {
	let mejor = null;
	for (const p of planes) {
		if (p.application_id !== applicationId) continue;
		if (mejor === null || p.actualizado_at > mejor.actualizado_at || p.actualizado_at === mejor.actualizado_at && p.rev > mejor.rev) mejor = p;
	}
	return mejor;
}
var AVANCE_SIN_PLAN = {
	plan_id: null,
	etapa: "por_planear",
	fecha_planeada: null,
	programada_para_at: null,
	fecha_publicada: null,
	content_id: null,
	vinculo_origen: null,
	fijada: false,
	rev: 0
};
function avanceDe(plan) {
	if (plan === null) return { ...AVANCE_SIN_PLAN };
	return {
		plan_id: plan.id,
		etapa: plan.estado,
		fecha_planeada: plan.fecha_plan,
		programada_para_at: plan.programada_para_at,
		fecha_publicada: plan.fecha_publicada,
		content_id: plan.content_id,
		vinculo_origen: plan.vinculo_origen,
		fijada: plan.fijada,
		rev: plan.rev
	};
}
/**
* Superposición optimista: recalcula `avance` (del PlanVideo vivo de esa solicitud dentro de `planes`) y `avisos`
* (promesa, vencida, copiado sin confirmar, último enviado) con las mismas reglas que el hub (03 §5.10), y la razón
* 'promesa'. `planes` y `avisos` son TODOS los conocidos (los del hub o de la copia + los cambios locales pendientes):
* una solicitud sin plan en `planes` queda en 'por_planear'. No toca grupo, clase, prioridad ni salud. No muta `m`.
*/
function aplicarLocal(m, planes, avisos, hoy) {
	const avance = avanceDe(planVivo(m.application_id, planes));
	const resumen = resumenAvisos(m.application_id, avance.etapa, avisos, hoy);
	const sinPromesa = m.razones.filter((r) => r !== "promesa");
	const razones = resumen.promesa !== null ? ["promesa", ...sinPromesa] : sinPromesa;
	return {
		...m,
		avance,
		avisos: resumen,
		razones
	};
}
function enCohorte(m) {
	if (GRUPOS_PENDIENTES.has(m.grupo)) return true;
	return (m.grupo === "en_revision" || m.grupo === "entregada" || m.grupo === "exenta") && m.avance.plan_id !== null;
}
function cuentaComoPublicada(m) {
	if (m.avance.etapa === "no_se_puede") return false;
	return esPublicadaValida(m.avance) || m.grupo === "entregada" || m.grupo === "exenta" || m.grupo === "en_revision";
}
/**
* Recalcula en la interfaz lo que cambia con el estado local, para que "Te faltan 11" baje al instante (también sin
* conexión). Cohorte = pendientes + las que ya publicaste (sin "No se puede"): grupos de trabajo y las que TikTok ya
* movió a revisión/entregada/exenta y tienen plan local. Promesas y avisos se recalculan con `avisos` y `hoy`.
*/
function contarTrabajo(muestras, avisos, hoy) {
	const ahora = instanteDe(hoy);
	const pendientes = muestras.filter(esPendiente);
	const publicadas = muestras.filter((m) => enCohorte(m) && m.avance.etapa !== "no_se_puede").filter((m) => !esPendiente(m) && cuentaComoPublicada(m));
	const porEtapa = {
		planeada: 0,
		video_listo: 0,
		programada: 0,
		publicada: 0
	};
	for (const m of pendientes) {
		const e = m.avance.etapa;
		if (e === "planeada" || e === "video_listo" || e === "programada") porEtapa[e] += 1;
	}
	porEtapa.publicada = publicadas.length;
	const porTienda = /* @__PURE__ */ new Map();
	for (const m of pendientes) {
		const lista = porTienda.get(m.tienda.tienda_key);
		if (lista) lista.push(m);
		else porTienda.set(m.tienda.tienda_key, [m]);
	}
	let avisadas = 0;
	for (const lista of porTienda.values()) if (lista.every((m) => estaAvisada(m.application_id, avisos))) avisadas += 1;
	const promesasVencidas = muestras.filter((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy)).length;
	return {
		pendientes: pendientes.length,
		total_cohorte: pendientes.length + publicadas.length,
		publicadas: publicadas.length,
		por_etapa: porEtapa,
		tiendas_con_pendientes: porTienda.size,
		tiendas_avisadas: avisadas,
		tiendas_por_avisar: porTienda.size - avisadas,
		promesas_vencidas: promesasVencidas,
		por_vencer_48h: pendientes.filter((m) => m.grupo === "por_vencer" && m.fecha_limite_at !== null && m.fecha_limite_at - ahora < 172800).length,
		no_se_puede: muestras.filter((m) => GRUPOS_PENDIENTES.has(m.grupo) && m.avance.etapa === "no_se_puede").length
	};
}
/** "Publicada sin aviso posterior a la publicación": se usa el último aviso enviado (MuestraVista no dice qué
*  plantilla llevaba; 03 §5.10 sugiere "Ya publiqué" para toda publicada). */
function faltaAvisarPublicada(m) {
	const publicada = m.avance.fecha_publicada;
	const avisado = m.avisos.ultimo_enviado_at;
	if (avisado === null) return true;
	return publicada !== null && avisado < epochDeFecha(publicada);
}
/** Tabla "Acción principal visible por etapa" de 01_ux §2.4. null si la muestra no admite etapas. */
function accionPrincipal(m, programoMisVideos) {
	const etapa = m.avance.etapa;
	if (etapa === "publicada") return faltaAvisarPublicada(m) ? "avisar" : null;
	if (!GRUPOS_CON_ETAPAS.has(m.grupo)) return null;
	if (GRUPOS_ANTICIPADOS.has(m.grupo)) {
		if (etapa === "por_planear") return "planear";
		return etapa === "no_se_puede" ? null : "cambiar_fecha";
	}
	switch (etapa) {
		case "por_planear": return "planear";
		case "planeada": return "marcar_publicada";
		case "video_listo": return programoMisVideos ? "marcar_programada" : "marcar_publicada";
		case "programada": return "marcar_publicada";
		case "no_se_puede": return null;
	}
}
/** Mensaje en español si faltan datos obligatorios (las reglas del 422 del hub: CHECK de plan_videos y 03 §6.2); null
*  si está bien. */
function validarEtapa(etapa, datos) {
	const fechaInvalida = (f) => f !== void 0 && !esFechaLocal(f);
	if (fechaInvalida(datos.fecha_plan) || fechaInvalida(datos.fecha_video_listo) || fechaInvalida(datos.fecha_publicada)) return "Esa fecha no es válida.";
	switch (etapa) {
		case "planeada": return datos.fecha_plan === void 0 ? "Elige qué día haces este video." : null;
		case "programada": return datos.programada_para_at === void 0 || !Number.isFinite(datos.programada_para_at) ? "Elige la fecha y la hora en que se publica." : null;
		case "publicada":
			if (datos.vinculo_origen === "video_previo") return "Un video anterior a la muestra no cuenta como publicado. Si la tienda lo aceptó, usa «La tienda aceptó este video».";
			if (datos.enlace_video !== void 0 && datos.enlace_video !== null && datos.enlace_video.trim() !== "" && !esEnlaceTikTok(datos.enlace_video)) return "Ese enlace no parece de un video de TikTok. Cópialo desde Compartir › Copiar enlace.";
			if (datos.content_id !== void 0 && datos.content_id !== null && !/^\d{15,21}$/.test(datos.content_id)) return "Ese enlace no parece de un video de TikTok. Cópialo desde Compartir › Copiar enlace.";
			return null;
		case "no_se_puede":
			if (datos.motivo_no_se_puede === void 0) return "Elige por qué no puedes hacer este video.";
			if (datos.motivo_texto !== void 0 && datos.motivo_texto !== null && datos.motivo_texto.length > 300) return "El motivo puede tener hasta 300 caracteres.";
			return null;
		default: return null;
	}
}
function limpiarDesde(campos, desde) {
	if (desde === "video_listo") campos.fecha_video_listo = null;
	if (desde === "video_listo" || desde === "programada") campos.programada_para_at = null;
	campos.fecha_publicada = null;
	campos.content_id = null;
	campos.enlace_video = null;
	campos.vinculo_origen = null;
}
/**
* Crea o edita el PlanVideo de la muestra para pasarla a `etapa` (un solo plan vivo por solicitud). Se puede avanzar
* saltando etapas y retroceder (01_ux §2.4 regla 1): al retroceder se limpian los datos de las etapas posteriores.
* Video listo y Publicada ponen su fecha automática (hoy) si no viene. Publicada toma el content_id del enlace
* (contentIdDeEnlace; un enlace corto queda en enlace_video con content_id null y el hub lo resuelve, C30).
*/
function opCambioEtapa(m, etapa, datos, hoy) {
	const a = m.avance;
	const campos = { estado: etapa };
	if (etapa !== "no_se_puede") {
		campos.motivo_no_se_puede = null;
		campos.motivo_texto = null;
	}
	switch (etapa) {
		case "por_planear":
			campos.fecha_plan = null;
			limpiarDesde(campos, "video_listo");
			break;
		case "planeada":
			campos.fecha_plan = datos.fecha_plan ?? a.fecha_planeada ?? hoy;
			limpiarDesde(campos, "video_listo");
			break;
		case "video_listo":
			if (datos.fecha_plan !== void 0) campos.fecha_plan = datos.fecha_plan;
			campos.fecha_video_listo = datos.fecha_video_listo ?? hoy;
			limpiarDesde(campos, "programada");
			break;
		case "programada":
			if (datos.fecha_plan !== void 0) campos.fecha_plan = datos.fecha_plan;
			if (datos.fecha_video_listo !== void 0) campos.fecha_video_listo = datos.fecha_video_listo;
			campos.programada_para_at = datos.programada_para_at ?? a.programada_para_at;
			limpiarDesde(campos, "publicada");
			break;
		case "publicada": {
			const enlace = datos.enlace_video !== void 0 && datos.enlace_video !== null && datos.enlace_video.trim() !== "" ? datos.enlace_video.trim() : null;
			let contentId;
			if (datos.content_id !== void 0) contentId = datos.content_id;
			else if (enlace !== null) contentId = contentIdDeEnlace(enlace);
			else if (a.vinculo_origen === "video_previo" && datos.vinculo_origen !== "video_previo_aceptado") contentId = null;
			else contentId = a.content_id;
			const conservaOrigen = a.vinculo_origen !== null && a.vinculo_origen !== "video_previo" && contentId === a.content_id;
			campos.fecha_publicada = datos.fecha_publicada ?? hoy;
			if (datos.fecha_plan !== void 0) campos.fecha_plan = datos.fecha_plan;
			campos.content_id = contentId;
			campos.enlace_video = enlace;
			campos.vinculo_origen = datos.vinculo_origen ?? (contentId !== null || enlace !== null ? conservaOrigen ? a.vinculo_origen : "manual" : null);
			break;
		}
		case "no_se_puede":
			if (datos.motivo_no_se_puede !== void 0) campos.motivo_no_se_puede = datos.motivo_no_se_puede;
			campos.motivo_texto = datos.motivo_texto !== void 0 && datos.motivo_texto !== null && datos.motivo_texto.trim() !== "" ? datos.motivo_texto.trim() : null;
	}
	if (a.plan_id) return {
		tipo: "plan.editar",
		id: a.plan_id,
		cambios: {
			...campos,
			rev: a.rev
		}
	};
	return {
		tipo: "plan.crear",
		datos: {
			...campos,
			id: nuevoId(),
			titulo: tituloPlan(m),
			application_id: m.application_id,
			product_id: m.producto.product_id,
			tienda_key: m.tienda.tienda_key
		}
	};
}
/** Título de un PlanVideo nuevo (1..200 caracteres): el nombre corto del producto o "Video de muestra" (como el hub). */
function tituloPlan(m) {
	const t = (m.producto.titulo_corto ?? nombreCorto(m.producto.titulo)).trim();
	return t ? Array.from(t).slice(0, 200).join("") : "Video de muestra";
}
var ENLACE_VIDEO = /^(?:https?:\/\/)?(?:www\.|m\.)?tiktok\.com\/@[^/?#\s]+\/video\/(\d{15,21})(?:[/?#]\S*)?$/i;
/** content_id de 'https://www.tiktok.com/@x/video/<id>' (o el id suelto de 19 dígitos). Enlace corto (vm./vt.) → null:
*  se guarda en enlace_video y el hub lo resuelve después (BUILD_SPEC §6.3). */
function contentIdDeEnlace(texto) {
	const t = texto.trim();
	if (/^\d{19}$/.test(t)) return t;
	return ENLACE_VIDEO.exec(t)?.[1] ?? null;
}
/** Enlace de TikTok (www, m, vm o vt), con o sin https://. */
function esEnlaceTikTok(texto) {
	return /^(?:https?:\/\/)?(?:www\.|m\.|vm\.|vt\.)?tiktok\.com\/\S+$/i.test(texto.trim());
}
/** Fecha prometida por omisión (01_ux §4.8): programada; si no, planeada + 2; null si no hay fecha. */
function fechaPrometidaPorOmision(avance) {
	if (avance.programada_para_at !== null) return fechaLocalDe(avance.programada_para_at);
	if (avance.fecha_planeada !== null) return sumarDias(avance.fecha_planeada, 2);
	return null;
}
/** Promesa en riesgo: fecha planeada (o programada) + 2 > promesa vigente. */
function promesaEnRiesgo(fechaPlan, promesa) {
	return promesa !== null && diasEntre(promesa, sumarDias(fechaPlan, 2)) > 0;
}
/** Orden de salud de "Tiendas que necesitan atención" (01_ux §2.7, en el orden en que se evalúan). */
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
/** Salud recalculada para una tienda CON pendientes (las tres primeras filas de 01_ux §2.7, regla del hub). */
function saludConPendientes(pendientes, esSocio, avisos, hoy) {
	const urgentes = pendientes.some((m) => m.avance.etapa === "por_planear") || pendientes.some((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy));
	if (esSocio && urgentes) return "socio_con_pendientes";
	return urgentes ? "con_pendientes" : "con_plan";
}
/** Orden de "Avisar a mis tiendas" (01_ux §4.17): promesas vencidas → socio con pendientes → con pendientes, por
*  comisión de 180 días, nº de pendientes y valor recibido. Solo tiendas con pendientes por avisar o con promesa
*  vencida. La salud se recalcula con el estado local (las tiendas que entran aquí siempre tienen pendientes). */
function ordenTiendasAvisar(tiendas, muestras, avisos, hoy) {
	const pendientesDe = /* @__PURE__ */ new Map();
	for (const m of muestras) {
		if (!esPendiente(m)) continue;
		const lista = pendientesDe.get(m.tienda.tienda_key);
		if (lista) lista.push(m);
		else pendientesDe.set(m.tienda.tienda_key, [m]);
	}
	const filas = [];
	for (const t of tiendas) {
		const pend = pendientesDe.get(t.tienda_key) ?? [];
		if (pend.length === 0) continue;
		const vencidas = pend.filter((m) => esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy)).length;
		if (!pend.some((m) => !estaAvisada(m.application_id, avisos)) && vencidas === 0) continue;
		const salud = ORDEN_SALUD.indexOf(saludConPendientes(pend, t.es_socio, avisos, hoy));
		filas.push({
			t,
			vencidas,
			salud,
			pendientes: pend.length
		});
	}
	filas.sort((a, b) => (b.vencidas > 0 ? 1 : 0) - (a.vencidas > 0 ? 1 : 0) || b.vencidas - a.vencidas || a.salud - b.salud || b.t.ventas.comision_180d_centavos - a.t.ventas.comision_180d_centavos || b.pendientes - a.pendientes || b.t.muestras.valor_recibido_max_centavos - a.t.muestras.valor_recibido_max_centavos || b.t.muestras.valor_recibido_min_centavos - a.t.muestras.valor_recibido_min_centavos || (a.t.tienda_key < b.t.tienda_key ? -1 : a.t.tienda_key > b.t.tienda_key ? 1 : 0));
	return filas.map((f) => f.t);
}
/** Precedencia de 03 §5.10 para una muestra: promesa vencida > publicada > "No se puede" según el motivo (o no
*  promocionable) > tarjeta "Ya tienes un video" > por vencer > varias pendientes de la tienda > una > socio. */
function plantillaSugeridaDe(m, pendientesTienda, motivo) {
	if (m.avisos.promesa_vencida) return "nueva_fecha";
	if (m.avance.etapa === "publicada") return "ya_publique";
	if (m.avance.etapa === "no_se_puede") {
		if (motivo === "agotado" || motivo === "desactivado") return "producto_no_disponible";
		if (motivo === "no_llego" || motivo === "incompleta") return "no_me_llego_completa";
		if (motivo === "no_va_con_mi_contenido") return "prefiero_otro_producto";
		return "disculpa_sin_fecha";
	}
	const pendiente = esPendiente(m);
	if (pendiente && m.prioridad === "no_se_puede_etiquetar") return "producto_no_disponible";
	if (pendiente && m.tarjeta_video === "video_previo") return "ya_tengo_video";
	if (m.grupo === "por_vencer") return "ya_la_recibi";
	if (pendiente) return pendientesTienda >= 2 ? "varias_muestras" : "disculpa_y_fecha";
	if (m.tienda.es_socio) return "gracias_por_las_ventas";
	return "disculpa_y_fecha";
}
/** Las 10 variables de 01_ux §4.8, sin llaves. */
var VARIABLES_PLANTILLA = [
	"tienda",
	"producto",
	"fecha_compromiso",
	"fecha_anterior",
	"link_video",
	"lista_productos",
	"lista_fechas",
	"agradecimiento_socio",
	"problema_envio",
	"firma"
];
var NUEVA_FECHA_VARIAS = "Hola, equipo de {tienda}. Les dije que publicaba los videos el {fecha_anterior} y no lo cumplí; una disculpa. Ya los tengo así:\n{lista_fechas}\nGracias por la paciencia.{firma}";
var AGRADECIMIENTO_SOCIO = "También gracias por todo lo que hemos vendido juntos con sus productos. ";
var PROBLEMA_ENVIO = {
	no_llego: "no me llegó",
	incompleta: "llegó incompleta"
};
/** Sin motivo conocido se usa el primero de los dos valores de 01_ux §4.8 ("no me llegó"): nunca un texto fuera de la
*  tabla. La pantalla que conoce el motivo (no_llego/incompleta) lo pasa en `problema_envio`. */
var PROBLEMA_ENVIO_GENERICO = PROBLEMA_ENVIO.no_llego;
function mismoTexto(a, b) {
	const n = (t) => t.replace(/\r\n?/g, "\n").trim();
	return n(a) === n(b);
}
function productoDe(m) {
	return nombreParaMensaje(m.producto.titulo ?? m.producto.titulo_corto) || nombreParaMensaje(m.producto.titulo_corto) || "su producto";
}
/**
* Resuelve {tienda} {producto} {fecha_compromiso} {fecha_anterior} {link_video} {lista_productos} {lista_fechas}
* {agradecimiento_socio} {problema_envio} {firma} con las reglas de 01_ux §4.8. 'nueva_fecha' predeterminada sin editar
* con ≥ 2 muestras usa el texto "Varias". Una variable sin dato se deja escrita tal cual (con su resaltado) y entra en
* `faltantes`. Las llaves que no son variables se respetan (texto del usuario).
*/
function resolverPlantilla(plantilla, ctx) {
	const muestras = ctx.muestras;
	const primera = muestras[0];
	const cuerpo = plantilla.id === "nueva_fecha" && plantilla.predeterminada && muestras.length >= 2 && mismoTexto(plantilla.cuerpo, "Hola, equipo de {tienda}. Les dije que publicaba el video de {producto} el {fecha_anterior} y no lo cumplí; una disculpa. Ya lo tengo para el {fecha_compromiso}. Gracias por la paciencia.{firma}") ? NUEVA_FECHA_VARIAS : plantilla.cuerpo;
	const ids = muestras.map((m) => m.application_id);
	const valor = (variable) => {
		switch (variable) {
			case "tienda": return { texto: ctx.tienda.nombre };
			case "producto": return { texto: primera ? productoDe(primera) : "su producto" };
			case "fecha_compromiso": {
				const f = primera ? ctx.compromisos[primera.application_id] : void 0;
				return f !== void 0 ? { texto: formato.fechaLarga(f) } : {
					texto: "",
					faltante: {
						tipo: "fecha",
						solicitudes: primera ? [primera.application_id] : []
					}
				};
			}
			case "fecha_anterior": {
				let f = ctx.fecha_anterior;
				if (f === null) {
					for (const m of muestras) if (m.avisos.promesa !== null && (f === null || m.avisos.promesa > f)) f = m.avisos.promesa;
				}
				return f !== null ? { texto: formato.fechaLarga(f) } : {
					texto: "",
					faltante: {
						tipo: "fecha",
						solicitudes: ids
					}
				};
			}
			case "link_video": {
				const l = ctx.link_video?.trim() ?? "";
				return l ? { texto: l } : {
					texto: "",
					faltante: { tipo: "link_video" }
				};
			}
			case "lista_productos": return { texto: muestras.map((m) => `• ${productoDe(m)}${m.variante ? ` (${m.variante})` : ""}`).join("\n") };
			case "lista_fechas": {
				const sinFecha = muestras.filter((m) => ctx.compromisos[m.application_id] === void 0).map((m) => m.application_id);
				const texto = muestras.map((m) => {
					const f = ctx.compromisos[m.application_id];
					return `• ${productoDe(m)}: a más tardar el ${f !== void 0 ? formato.fechaLarga(f) : "…"}`;
				}).join("\n");
				return sinFecha.length > 0 ? {
					texto,
					faltante: {
						tipo: "plan",
						solicitudes: sinFecha
					}
				} : { texto };
			}
			case "agradecimiento_socio": return { texto: ctx.tienda.es_socio ? AGRADECIMIENTO_SOCIO : "" };
			case "problema_envio": return { texto: ctx.problema_envio ? PROBLEMA_ENVIO[ctx.problema_envio] : PROBLEMA_ENVIO_GENERICO };
			case "firma": {
				const f = ctx.firma.trim();
				return { texto: f ? `\n— ${f}` : "" };
			}
			default: return null;
		}
	};
	let texto = "";
	const resaltados = [];
	const faltantes = [];
	const agregarFaltante = (f) => {
		const previo = faltantes.find((x) => x.tipo === f.tipo);
		if (!previo) {
			faltantes.push(f.tipo === "link_video" ? f : {
				tipo: f.tipo,
				solicitudes: [...f.solicitudes]
			});
			return;
		}
		if (previo.tipo !== "link_video" && f.tipo !== "link_video") {
			for (const s of f.solicitudes) if (!previo.solicitudes.includes(s)) previo.solicitudes.push(s);
		}
	};
	const patron = /\{([a-z_]+)\}/g;
	let ultimo = 0;
	for (let r = patron.exec(cuerpo); r !== null; r = patron.exec(cuerpo)) {
		const variable = r[1] ?? "";
		const v = valor(variable);
		texto += cuerpo.slice(ultimo, r.index);
		ultimo = r.index + r[0].length;
		if (v === null) {
			texto += r[0];
			continue;
		}
		if (v.faltante) agregarFaltante(v.faltante);
		const insertado = v.texto === "" && v.faltante ? r[0] : v.texto;
		if (insertado.length > 0) resaltados.push({
			inicio: texto.length,
			fin: texto.length + insertado.length,
			variable
		});
		texto += insertado;
	}
	texto += cuerpo.slice(ultimo);
	return {
		texto,
		faltantes,
		puede_copiar: faltantes.length === 0,
		resaltados
	};
}
/** Respaldo SOLO si no hay plantilla_sugerida del hub ni en la copia (tabla de 01_ux §4.8 con la precedencia de 03
*  §5.10). Sin el motivo de "No se puede" (MuestraVista no lo trae) se usa "Disculpa sin fecha". */
function plantillaRecomendada(ctx) {
	if (ctx.promesa_vencida || ctx.muestras.some((m) => m.avisos.promesa_vencida)) return "nueva_fecha";
	const pendientes = ctx.muestras.filter(esPendiente);
	if (pendientes.length >= 2) return "varias_muestras";
	const m = pendientes[0] ?? ctx.muestras[0];
	if (!m) return ctx.es_socio ? "gracias_por_las_ventas" : "disculpa_y_fecha";
	const s = plantillaSugeridaDe(m, pendientes.length, null);
	if (pendientes.length === 0 && (s === "disculpa_y_fecha" || s === "gracias_por_las_ventas")) return ctx.es_socio ? "gracias_por_las_ventas" : "disculpa_y_fecha";
	return s;
}
/** Texto plano de "Copiar datos para tu guion" (01_ux §4.3): nombre corto, título completo, variante, categoría, precio
*  de venta ≈ y comisión por venta (las notas no llegan en la firma: quien copia las agrega). */
function textoDatosGuion(m) {
	const p = m.producto;
	const lineas = [];
	const corto = p.titulo_corto ?? nombreCorto(p.titulo);
	if (corto) lineas.push(`Producto: ${corto}`);
	if (p.titulo) lineas.push(`Título completo: ${p.titulo.trim()}`);
	if (m.variante) lineas.push(`Variante: ${m.variante}`);
	if (p.categoria) lineas.push(`Categoría: ${p.categoria.split(/\s*>\s*/).join(" › ")}`);
	if (p.precio_venta_min_centavos !== null || p.precio_venta_max_centavos !== null) {
		const fuente = p.precio_fuente ?? "comision";
		const rango = formato.rangoDinero(p.precio_venta_min_centavos, p.precio_venta_max_centavos, { aprox: fuente === "comision" });
		lineas.push(`${fuente === "comision" ? "Precio de venta" : ETIQUETA_FUENTE_PRECIO[fuente]}: ${rango}`);
	}
	if (p.comision_por_venta_centavos !== null || p.comision_por_venta_max_centavos !== null) {
		const tasa = p.comision_bp !== null ? ` (comisión ${formato.tasaBp(p.comision_bp)})` : "";
		lineas.push(`Comisión por venta: ${formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos)}${tasa}`);
	}
	return lineas.join("\n");
}
var DIA_S = 86400;
var SEMANA_S = 7 * DIA_S;
function horaRecordatorio(texto) {
	const r = /^(\d{1,2}):(\d{2})$/.exec(texto.trim());
	const h = r ? Number(r[1]) : NaN;
	const m = r ? Number(r[2]) : NaN;
	return Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59 ? {
		h,
		m
	} : {
		h: 10,
		m: 0
	};
}
function nombreDe(m, plan) {
	if (plan?.nombre_corto) return plan.nombre_corto;
	if (m) return m.producto.titulo_corto ?? (nombreCorto(m.producto.titulo) || "Tu muestra");
	return plan?.titulo ?? "Tu muestra";
}
/** Notificaciones locales de los próximos `dias` (7): plan diario, por vencer 48/24 h, promesas (un día antes),
*  atrasados, resumen semanal y Recordatorio activos. Solo instantes en (ahora, ahora + dias]. Ids estables. */
function calcularNotificaciones(e) {
	const { muestras, planes, avisos, recordatorios, preferencias: pref, ahora } = e;
	const dias = Math.max(1, Math.floor(e.dias ?? 7));
	const fin = ahora + dias * DIA_S;
	const hoy = hoyLocal(ahora);
	const { h, m: min } = horaRecordatorio(pref.hora_recordatorio);
	const porId = new Map(muestras.map((m) => [m.application_id, m]));
	const salida = /* @__PURE__ */ new Map();
	const poner = (n) => {
		if (n.at > ahora && n.at <= fin && !salida.has(n.id)) salida.set(n.id, n);
	};
	const planVigente = (p) => {
		if (p.estado !== "planeada" || p.fecha_plan === null) return false;
		const m = p.application_id !== null ? porId.get(p.application_id) : void 0;
		return m === void 0 || esPendiente(m);
	};
	const ordenPlan = (a, b) => a.orden - b.orden || (porId.get(a.application_id ?? "")?.posicion_cola ?? 1e9) - (porId.get(b.application_id ?? "")?.posicion_cola ?? 1e9) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
	if (pref.recordatorio_diario) for (let k = 0; k <= dias; k++) {
		const dia = sumarDias(hoy, k);
		if (!pref.dias_videos.includes(diaSemana(dia))) continue;
		const delDia = planes.filter((p) => planVigente(p) && p.fecha_plan === dia).sort(ordenPlan);
		const primero = delDia[0];
		if (!primero) continue;
		const n = delDia.length;
		const mu = primero.application_id !== null ? porId.get(primero.application_id) : void 0;
		const tienda = mu?.tienda.nombre;
		const quien = `${nombreDe(mu, primero)}${tienda ? ` (${tienda})` : ""}`;
		poner({
			id: `plan-${dia}`,
			titulo: n === 1 ? "Hoy toca: 1 video de muestra" : `Hoy toca: ${n} videos de muestras`,
			texto: n === 1 ? `${quien}.` : `${quien} y ${n - 1} más.`,
			at: epochDeFecha(dia, h, min),
			ruta: "#/muestras/sesion"
		});
	}
	if (pref.aviso_por_vencer) for (const m of muestras) {
		if (m.grupo !== "por_vencer" || m.fecha_limite_at === null || !esPendiente(m)) continue;
		for (const horas of [48, 24]) {
			const at = m.fecha_limite_at - horas * 3600;
			poner({
				id: `vence-${m.application_id}-${horas}`,
				titulo: `Una muestra vence ${formato.relativa(m.fecha_limite_at, at)}`,
				texto: `${nombreDe(m)} de ${m.tienda.nombre}. Publica el video para que cuente en TikTok.`,
				at,
				ruta: `#/muestras/m/${m.application_id}`
			});
		}
	}
	if (pref.aviso_promesas) for (const m of muestras) {
		if (m.avance.etapa === "publicada" || m.avance.etapa === "no_se_puede") continue;
		const promesa = promesaDe(m.application_id, avisos);
		if (promesa === null) continue;
		poner({
			id: `promesa-${promesa.aviso_id}-${m.application_id}`,
			titulo: `Mañana vence lo que le prometiste a ${m.tienda.nombre}`,
			texto: `${nombreDe(m)}: le dijiste que lo publicabas a más tardar el ${formato.fechaConDia(promesa.fecha)}.`,
			at: epochDeFecha(sumarDias(promesa.fecha, -1), h, min),
			ruta: `#/muestras/m/${m.application_id}`
		});
	}
	if (pref.aviso_atrasados) {
		const dia = epochDeFecha(hoy, h, min) > ahora ? hoy : sumarDias(hoy, 1);
		const atrasados = planes.filter((p) => planVigente(p) && p.fecha_plan !== null && p.fecha_plan < dia);
		const n = atrasados.length;
		if (n > 0) {
			const ayer = sumarDias(dia, -1);
			const cuando = atrasados.every((p) => p.fecha_plan === ayer) ? "de ayer" : "de días anteriores";
			poner({
				id: `atrasados-${dia}`,
				titulo: n === 1 ? `Te quedó 1 video ${cuando}` : `Te quedaron ${n} videos ${cuando}`,
				texto: n === 1 ? "Toca para moverlo a hoy." : "Toca para moverlos a hoy.",
				at: epochDeFecha(dia, h, min),
				ruta: "#/muestras/agenda"
			});
		}
	}
	if (pref.resumen_semanal) for (let k = 0; k <= dias; k++) {
		const dia = sumarDias(hoy, k);
		if (diaSemana(dia) !== 0) continue;
		const inicio = sumarDias(dia, -7);
		const publicados = planes.filter((p) => esPublicadaValida({
			etapa: p.estado,
			vinculo_origen: p.vinculo_origen
		}) && p.fecha_publicada !== null && p.fecha_publicada >= inicio && p.fecha_publicada < dia).length;
		poner({
			id: `resumen-${dia}`,
			titulo: "Tu resumen de la semana",
			texto: `${publicados === 1 ? "1 video de muestra publicado" : `${publicados} videos de muestras publicados`} la semana pasada. Toca para ver tus ventas.`,
			at: epochDeFecha(dia, 9, 0),
			ruta: "#/ventas"
		});
	}
	for (const r of recordatorios) {
		if (r.estado !== "activo") continue;
		const base = r.pospuesto_hasta !== null && r.pospuesto_hasta > r.vence_at ? r.pospuesto_hasta : r.vence_at;
		const mu = r.entidad === "muestra" && r.entidad_id !== null ? porId.get(r.entidad_id) : void 0;
		let texto = "Toca para verlo.";
		let ruta = "#/inicio";
		if (r.entidad === "muestra" && r.entidad_id !== null) {
			ruta = `#/muestras/m/${r.entidad_id}`;
			if (mu) texto = `${nombreDe(mu)} de ${mu.tienda.nombre}.`;
		} else if (r.entidad === "tienda" && r.entidad_id !== null) {
			ruta = `#/tiendas/${encodeURIComponent(r.entidad_id)}`;
			const nombre = muestras.find((m) => m.tienda.tienda_key === r.entidad_id)?.tienda.nombre;
			if (nombre) texto = `${nombre}.`;
		} else if (r.entidad === "plan") {
			ruta = "#/muestras/agenda";
			texto = "Revisa tu agenda.";
		}
		if (r.repetir === "no") {
			poner({
				id: `recordatorio-${r.id}`,
				titulo: r.titulo,
				texto,
				at: base,
				ruta
			});
			continue;
		}
		const paso = r.repetir === "diario" ? DIA_S : SEMANA_S;
		let at = base;
		if (at <= ahora) at += (Math.floor((ahora - at) / paso) + 1) * paso;
		for (; at <= fin; at += paso) poner({
			id: `recordatorio-${r.id}-${fechaLocalDe(at)}`,
			titulo: r.titulo,
			texto,
			at,
			ruta
		});
	}
	return [...salida.values()].sort((a, b) => a.at - b.at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
var COLUMNAS = [
	"ID de la solicitud",
	"Producto",
	"Título completo",
	"Tienda",
	"Variante",
	"Estado en TikTok",
	"Solicitada",
	"Precio de venta mín (MXN)",
	"Precio de venta máx (MXN)",
	"Fuente del precio",
	"Comisión por venta mín (MXN)",
	"Comisión por venta máx (MXN)",
	"¿Vendió?",
	"ID del producto"
];
var COLUMNAS_LOCALES = [
	"Tu avance",
	"Fecha planeada",
	"Fecha publicada",
	"ID del video",
	"Promesa",
	"Avisos enviados",
	"Notas"
];
/** Celda de texto: entre comillas si lleva coma, comillas o saltos; con apóstrofo delante si empieza como fórmula. */
function texto$12(v) {
	let t = (v ?? "").replace(/\r\n?/g, "\n");
	if (/^[=+\-@\t]/.test(t)) t = `'${t}`;
	return /[",\n]/.test(t) ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
/** Monto en pesos con punto decimal y dos decimales (sin separador de miles); vacío si no hay dato. */
function monto(centavos) {
	if (centavos === null) return "";
	const negativo = centavos < 0;
	const abs = Math.abs(Math.round(centavos));
	return `${negativo ? "-" : ""}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}
/** CSV de Muestras › Todas (01_ux §4.7), UTF-8 con BOM, separador coma, montos con punto decimal. */
function csvMuestras(muestras, incluirLocal, extra) {
	const filas = [[...COLUMNAS, ...incluirLocal ? COLUMNAS_LOCALES : []].map(texto$12).join(",")];
	for (const m of muestras) {
		const p = m.producto;
		const celdas = [
			texto$12(m.application_id),
			texto$12(p.titulo_corto ?? nombreCorto(p.titulo)),
			texto$12(p.titulo),
			texto$12(m.tienda.nombre),
			texto$12(m.variante),
			texto$12(`${ETIQUETA_GRUPO[m.grupo]} · ${m.motivo}`),
			m.solicitada_at !== null ? fechaLocalDe(m.solicitada_at) : "",
			monto(p.precio_venta_min_centavos),
			monto(p.precio_venta_max_centavos),
			texto$12(p.precio_fuente ? ETIQUETA_FUENTE_PRECIO[p.precio_fuente] : ""),
			monto(p.comision_por_venta_centavos),
			monto(p.comision_por_venta_max_centavos),
			m.ventas_producto.pedidos_validos > 0 ? "sí" : "no",
			texto$12(p.product_id)
		];
		if (incluirLocal) {
			const avisos = extra ? avisosDe(m.application_id, extra.avisos).filter((a) => a.marcado_enviado_at !== null && a.quitado_at === null) : [];
			const notas = extra ? extra.notas.filter((n) => n.entidad === "muestra" && n.entidad_id === m.application_id).map((n) => n.texto) : [];
			celdas.push(texto$12(ETIQUETA_ETAPA[m.avance.etapa]), m.avance.fecha_planeada ?? "", m.avance.fecha_publicada ?? "", texto$12(m.avance.content_id), m.avisos.promesa ?? "", String(avisos.length), texto$12(notas.join(" | ")));
		}
		filas.push(celdas.join(","));
	}
	return "﻿" + filas.join("\r\n") + "\r\n";
}
var CLASES = [
	"debe_video",
	"entregada",
	"exenta",
	"cancelada",
	"nunca_enviada",
	"pendiente_abierta"
];
var GRUPOS = [
	"entregada",
	"exenta",
	"en_revision",
	"por_vencer",
	"pausada",
	"vencida",
	"esperando_aprobacion",
	"en_camino",
	"pedido_cancelado",
	"sin_envio"
];
var SALUD_CON_PENDIENTES = /* @__PURE__ */ new Set([
	"socio_con_pendientes",
	"con_pendientes",
	"con_plan"
]);
var SIN_FIN = Number.MAX_SAFE_INTEGER;
var MAX_ORDENES_COPIA = 500;
/** SnapshotResponse.videos: top 100 por comisión. */
var TOPE_VIDEOS_COPIA = 100;
function compararTexto(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}
/** Igualdad estructural sin depender del orden de las claves (el JSON del hub y lo que arma aplicarLocal pueden
*  traerlas en otro orden). */
function igual(a, b) {
	if (a === b) return true;
	if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
	if (Array.isArray(a) !== Array.isArray(b)) return false;
	const ra = a;
	const rb = b;
	const ka = Object.keys(ra);
	if (ka.length !== Object.keys(rb).length) return false;
	return ka.every((k) => Object.prototype.hasOwnProperty.call(rb, k) && igual(ra[k], rb[k]));
}
/** El estado local de la muestra sigue como lo vio el hub al armar la copia: mismo avance (plan, etapa, fechas, rev)
*  y mismos avisos (promesa, vencida —depende de hoy—, copiado sin confirmar, último enviado). */
function sinCambiosLocales(m, original) {
	return original !== void 0 && igual(m.avance, original.avance) && igual(m.avisos, original.avisos);
}
/** Ningún cambio local en las muestras de la tienda (de eso dependen la plantilla de cada una y la de la tienda). */
function tiendaSinCambios(muestrasTienda, originales) {
	return muestrasTienda.every((m) => sinCambiosLocales(m, originales.get(m.application_id)));
}
/** La copia trae videos, productos y tiendas de TODO el historial (dashboard.todo.periodo; el hub los arma sin rango).
*  Sirve sin desde/hasta o con un rango que cubre ese historial completo (p. ej. "Todo" o 12 meses); otro rango daría
*  cifras de otro periodo sin aviso → null ("Necesita tu PC encendida"), como dashboard fuera de 30d y todo. */
function rangoEnLaCopia(p, copia) {
	const { desde, hasta } = copia.dashboard.todo.periodo;
	return (p.desde === void 0 || p.desde <= desde) && (p.hasta === void 0 || p.hasta >= hasta);
}
/** Primer día desde el que la copia trae TODOS los pedidos que tenía el hub al armarla. Si se llenó el tope de 500, el
*  día más antiguo de la lista puede venir cortado (el hub corta por creada_at, no por día): completa desde el día
*  siguiente. Si no se llenó, la ventana de 90 días del hub (hoy − 89 de generado_at). */
function ordenesCompletasDesde(copia) {
	const ventana = sumarDias(fechaLocalDe(copia.generado_at), -89);
	if (copia.ordenes_recientes.length < MAX_ORDENES_COPIA) return ventana;
	let masAntigua = null;
	for (const o of copia.ordenes_recientes) if (masAntigua === null || o.fecha < masAntigua) masAntigua = o.fecha;
	const corte = masAntigua === null ? ventana : sumarDias(masAntigua, 1);
	return corte > ventana ? corte : ventana;
}
/** La copia trae videos completos solo si no llenó el top 100 (con 100 o más pudo quedar fuera alguno y el total
*  real no se conoce). */
function videosCompletos(copia) {
	return copia.videos.length < TOPE_VIDEOS_COPIA;
}
/** tienda_key de 01_ux §6.0: sin espacios a los lados, espacios repetidos colapsados y en minúsculas. */
function claveTienda(nombre) {
	return (nombre ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase("es-MX");
}
function recorrerUrls(v, salida) {
	if (typeof v === "string") {
		if (v.startsWith("/img/")) salida.add(v.split("&t=")[0] ?? v);
		return;
	}
	if (Array.isArray(v)) {
		for (const x of v) recorrerUrls(x, salida);
		return;
	}
	if (v !== null && typeof v === "object") for (const x of Object.values(v)) recorrerUrls(x, salida);
}
/** meta_imagenes de la copia restringido a las URLs que aparecen en la respuesta (como con_meta del hub). */
function metaDe(obj, copia) {
	const fuente = copia.meta_imagenes;
	if (!fuente) return null;
	const urls = /* @__PURE__ */ new Set();
	recorrerUrls(obj, urls);
	const meta = {};
	for (const u of [...urls].sort()) {
		const im = fuente[u];
		if (im) meta[u] = im;
	}
	return Object.keys(meta).length > 0 ? meta : null;
}
function conMeta(obj, copia) {
	const meta = metaDe(obj, copia);
	return meta ? {
		...obj,
		meta_imagenes: meta
	} : obj;
}
/** Muestras de la copia con el estado local superpuesto (planes y avisos de copia.local). */
function vistaMuestras(copia, hoy) {
	return copia.muestras.map((m) => aplicarLocal(m, copia.local.planes, copia.local.avisos, hoy));
}
function ordenarMuestras(items, orden) {
	const pos = (m) => m.posicion_cola ?? SIN_FIN;
	const id = (a, b) => compararTexto(a.application_id, b.application_id);
	const copia = [...items];
	switch (orden) {
		case "solicitud_asc": return copia.sort((a, b) => (a.solicitada_at ?? 0) - (b.solicitada_at ?? 0) || id(a, b));
		case "solicitud_desc": return copia.sort((a, b) => (b.solicitada_at ?? 0) - (a.solicitada_at ?? 0) || id(a, b));
		case "valor_desc": return copia.sort((a, b) => (b.producto.precio_venta_min_centavos ?? 0) - (a.producto.precio_venta_min_centavos ?? 0) || pos(a) - pos(b) || id(a, b));
		case "tienda": return copia.sort((a, b) => compararTexto(a.tienda.nombre.toLocaleLowerCase("es-MX"), b.tienda.nombre.toLocaleLowerCase("es-MX")) || pos(a) - pos(b) || id(a, b));
		default: return copia.sort((a, b) => pos(a) - pos(b) || id(a, b));
	}
}
function muestras$1(p, copia, hoy) {
	const vista = vistaMuestras(copia, hoy);
	let items = vista;
	const grupos = p.grupo;
	if (grupos && grupos.length > 0) items = items.filter((m) => grupos.includes(m.grupo));
	const clases = p.clase;
	if (clases && clases.length > 0) items = items.filter((m) => clases.includes(m.clase));
	if (p.tienda !== void 0) items = items.filter((m) => m.tienda.tienda_key === p.tienda);
	const q = p.q?.trim();
	if (q) items = items.filter((m) => coincide(q, m.producto.titulo, m.producto.titulo_corto, m.tienda.nombre, m.variante, m.application_id));
	if (p.recibidas !== void 0) items = items.filter((m) => m.recibida === p.recibidas);
	items = ordenarMuestras(items, p.orden ?? "prioridad");
	const conteos = Object.fromEntries(CLASES.map((c) => [c, 0]));
	const porGrupo = Object.fromEntries(GRUPOS.map((g) => [g, 0]));
	for (const m of vista) {
		conteos[m.clase] += 1;
		porGrupo[m.grupo] += 1;
	}
	return conMeta({
		items,
		total: items.length,
		conteos,
		por_grupo: porGrupo,
		data_version: copia.data_version
	}, copia);
}
function pendientesPorTienda(vista) {
	const mapa = /* @__PURE__ */ new Map();
	for (const m of vista) {
		if (!esPendiente(m)) continue;
		const lista = mapa.get(m.tienda.tienda_key);
		if (lista) lista.push(m);
		else mapa.set(m.tienda.tienda_key, [m]);
	}
	return mapa;
}
function motivoDe(m, copia) {
	return planVivo(m.application_id, copia.local.planes)?.motivo_no_se_puede ?? null;
}
function muestra$2(p, copia, hoy) {
	const vista = vistaMuestras(copia, hoy);
	const m = vista.find((x) => x.application_id === p.id);
	if (!m) return null;
	const extra = copia.extras?.muestras[p.id];
	const pendTienda = pendientesPorTienda(vista).get(m.tienda.tienda_key)?.length ?? 0;
	const originales = new Map(copia.muestras.map((x) => [x.application_id, x]));
	const deLaTienda = vista.filter((x) => x.tienda.tienda_key === m.tienda.tienda_key);
	const sugerida = extra !== void 0 && tiendaSinCambios(deLaTienda, originales) ? extra.plantilla_sugerida : plantillaSugeridaDe(m, pendTienda, motivoDe(m, copia));
	return conMeta({
		muestra: m,
		historial: extra?.historial ?? [],
		notas: copia.local.notas.filter((n) => n.entidad_id === p.id),
		planes: copia.local.planes.filter((x) => x.application_id === p.id),
		recordatorios: copia.local.recordatorios.filter((r) => r.entidad_id === p.id),
		avisos: copia.local.avisos.filter((a) => a.solicitud_ids.includes(p.id)),
		plantilla_sugerida: sugerida,
		videos_del_producto: extra?.videos_del_producto ?? [],
		otras_de_la_tienda: deLaTienda.filter((x) => x.application_id !== p.id).map((x) => ({
			application_id: x.application_id,
			grupo: x.grupo,
			etiqueta: x.etiqueta,
			producto: x.producto
		}))
	}, copia);
}
function firmaPendientes(lista, hoy, avisos) {
	return lista.map((m) => {
		const vencida = avisos === null ? m.avisos.promesa_vencida : esPromesaVencida(promesaDe(m.application_id, avisos)?.fecha ?? null, m.avance.etapa, hoy);
		return `${m.application_id}:${m.avance.etapa === "por_planear" ? "p" : "f"}:${vencida ? "v" : "-"}`;
	}).sort().join("|");
}
function porcentaje90(t) {
	return Math.round(t.ventas.participacion_90d * 100);
}
/** FilaTienda con el estado local: avisos y promesas siempre; pendientes, salud y su "por qué" solo si el estado local
*  cambió las pendientes de la tienda respecto de lo que calculó el hub (si no, se conserva lo del hub). */
function filaConLocal(t, todas, originales, avisos, hoy) {
	const pend = todas.filter(esPendiente);
	let vigentes = 0;
	let vencidas = 0;
	let cumplidas = 0;
	for (const m of todas) {
		const p = promesaDe(m.application_id, avisos)?.fecha ?? null;
		if (p === null) continue;
		const e = m.avance.etapa;
		if (e !== "publicada" && hoy <= p) vigentes += 1;
		if (esPromesaVencida(p, e, hoy)) vencidas += 1;
		if (e === "publicada" && m.avance.fecha_publicada !== null && m.avance.fecha_publicada <= p) cumplidas += 1;
	}
	const fila = {
		...t,
		por_avisar: pend.some((m) => !estaAvisada(m.application_id, avisos)),
		promesas: {
			vigentes,
			vencidas,
			cumplidas
		}
	};
	const antes = todas.map((m) => originales.get(m.application_id)).filter((o) => o !== void 0 && esPendiente(o));
	if (firmaPendientes(antes, hoy, null) === firmaPendientes(pend, hoy, avisos)) return fila;
	const idsAhora = new Set(pend.map((m) => m.application_id));
	const idsAntes = new Set(antes.map((m) => m.application_id));
	let valor = t.muestras.valor_debido_centavos;
	for (const m of antes) if (!idsAhora.has(m.application_id)) valor -= m.producto.precio_venta_min_centavos ?? 0;
	for (const m of pend) if (!idsAntes.has(m.application_id)) valor += m.producto.precio_venta_min_centavos ?? 0;
	valor = Math.max(0, valor);
	const n = pend.length;
	const s = n === 1 ? "" : "s";
	let salud = t.salud;
	let porque = t.salud_porque;
	if (n > 0) {
		salud = saludConPendientes(pend, t.es_socio, avisos, hoy);
		if (salud === "con_plan") {
			const fechas = pend.map((m) => m.avance.fecha_planeada).filter((f) => f !== null).sort();
			porque = fechas[0] ? `Todo planeado · siguiente video el ${formato.fechaCorta(fechas[0])}` : "Todo planeado";
		} else porque = t.es_socio ? `${n} muestra${s} sin video · ${porcentaje90(t)} % de tu comisión en 90 días` : `${n} muestra${s} sin video · ${formato.dineroAprox(valor)} en producto recibido`;
	} else if (SALUD_CON_PENDIENTES.has(t.salud)) {
		const publicadas = todas.filter((m) => esPublicadaValida(m.avance)).length;
		const cumplidasTotal = t.muestras.entregadas + t.muestras.exentas + publicadas;
		if (t.es_socio) {
			salud = "socio";
			porque = t.ventas.ultima_venta_at !== null ? `${porcentaje90(t)} % de tu comisión en 90 días · última venta ${formato.fechaCorta(t.ventas.ultima_venta_at)}` : `${porcentaje90(t)} % de tu comisión en 90 días`;
		} else if (cumplidasTotal > 0) {
			salud = "al_dia";
			porque = `Cumpliste con ${cumplidasTotal} muestras`;
		}
	}
	return {
		...fila,
		salud,
		salud_porque: porque,
		muestras: {
			...t.muestras,
			pendientes: n,
			debidas_con_plan: pend.filter((m) => m.avance.etapa !== "por_planear").length,
			valor_debido_centavos: valor
		}
	};
}
function filasTiendas(copia, vista, hoy) {
	const originales = new Map(copia.muestras.map((m) => [m.application_id, m]));
	const porTienda = /* @__PURE__ */ new Map();
	for (const m of vista) {
		const lista = porTienda.get(m.tienda.tienda_key);
		if (lista) lista.push(m);
		else porTienda.set(m.tienda.tienda_key, [m]);
	}
	return copia.tiendas.map((t) => filaConLocal(t, porTienda.get(t.tienda_key) ?? [], originales, copia.local.avisos, hoy));
}
function ordenarTiendas(filas, orden) {
	const k = (a, b) => compararTexto(a.tienda_key, b.tienda_key);
	const copia = [...filas];
	switch (orden) {
		case "comision": return copia.sort((a, b) => b.ventas.comision_estimada_centavos - a.ventas.comision_estimada_centavos || k(a, b));
		case "deuda": return copia.sort((a, b) => b.muestras.pendientes - a.muestras.pendientes || b.muestras.valor_debido_centavos - a.muestras.valor_debido_centavos || k(a, b));
		case "nombre": return copia.sort((a, b) => compararTexto(a.nombre.toLocaleLowerCase("es-MX"), b.nombre.toLocaleLowerCase("es-MX")));
		default: return copia.sort((a, b) => b.promesas.vencidas - a.promesas.vencidas || ORDEN_SALUD.indexOf(a.salud) - ORDEN_SALUD.indexOf(b.salud) || b.ventas.comision_180d_centavos - a.ventas.comision_180d_centavos || k(a, b));
	}
}
/** Plantilla sugerida para "Avisar a esta tienda" (03 §5.10): ≥ 2 pendientes → Varias muestras; 1 → la de esa
*  muestra; sin pendientes y socio → Gracias por las ventas; si no, null. */
function plantillaTienda(t, pend, copia) {
	if (pend.length >= 2) return "varias_muestras";
	const unica = pend[0];
	if (unica) return plantillaSugeridaDe(unica, 1, motivoDe(unica, copia));
	return t.es_socio ? "gracias_por_las_ventas" : null;
}
function round4(x) {
	return Math.round(x * 1e4) / 1e4;
}
function resumenConLocal(r, copia, vista, hoy) {
	const conteos = contarTrabajo([...vista], copia.local.avisos, hoy);
	const originales = new Map(copia.muestras.map((m) => [m.application_id, m]));
	const abierta = (m) => !esPublicadaValida(m.avance) && m.avance.etapa !== "no_se_puede";
	const deb = vista.filter((m) => m.clase === "debe_video");
	const saldadas = deb.filter((m) => esPublicadaValida(m.avance)).length;
	const conPlan = deb.filter((m) => abierta(m) && m.avance.etapa !== "por_planear").length;
	let vmin = r.debe_video.valor_min_centavos;
	let vmax = r.debe_video.valor_max_centavos;
	for (const m of deb) {
		const o = originales.get(m.application_id);
		if (!o || abierta(o) === abierta(m)) continue;
		const signo = abierta(m) ? 1 : -1;
		vmin += signo * (m.producto.precio_venta_min_centavos ?? 0);
		vmax += signo * (m.producto.precio_venta_max_centavos ?? m.producto.precio_venta_min_centavos ?? 0);
	}
	const ahora = instanteDe(hoy);
	let proxima = null;
	for (const m of vista) {
		if (!esPendiente(m) || m.fecha_limite_at === null || m.fecha_limite_at <= ahora) continue;
		if (proxima === null || m.fecha_limite_at < proxima.fecha_limite_at) proxima = {
			application_id: m.application_id,
			fecha_limite_at: m.fecha_limite_at
		};
	}
	const e = r.por_clase.entregada;
	const den = e + r.debe_video.n;
	return {
		...r,
		debe_video: {
			...r.debe_video,
			valor_min_centavos: Math.max(0, vmin),
			valor_max_centavos: Math.max(0, vmax),
			con_plan: conPlan,
			saldadas
		},
		pendientes: conteos.pendientes,
		tiendas_por_avisar: conteos.tiendas_por_avisar,
		promesas_vencidas: conteos.promesas_vencidas,
		cumplimiento: den > 0 ? round4((e + saldadas) / den) : null,
		proxima_fecha_limite: proxima
	};
}
/** Rehace las alertas que dependen del estado local ("pendientes" y "promesas_vencidas") con los textos del hub. */
function alertasConLocal(alertas, r, tiendasConPendientes) {
	const resto = alertas.filter((a) => a.id !== "pendientes" && a.id !== "promesas_vencidas");
	const salida = [];
	const pend = r.pendientes;
	if (pend > 0) {
		const sald = r.debe_video.saldadas;
		const t = tiendasConPendientes;
		salida.push({
			id: "pendientes",
			nivel: "critica",
			titulo: sald > 0 ? `Te faltan ${pend} de ${r.debe_video.n}; ya publicaste ${sald}` : `Tienes ${pend} muestra${pend !== 1 ? "s" : ""} sin video de ${t} tienda${t !== 1 ? "s" : ""}`,
			texto: "TikTok ya las marca como vencidas. Empieza por las de arriba y avísale a cada tienda cuándo publicarás.",
			accion: {
				etiqueta: "Ver pendientes",
				ruta: "/muestras"
			}
		});
	}
	const antes = resto.filter((a) => a.id.startsWith("tienda_clave:") || a.id.startsWith("limite:"));
	const despues = resto.filter((a) => !(a.id.startsWith("tienda_clave:") || a.id.startsWith("limite:")));
	salida.push(...antes);
	if (r.promesas_vencidas > 0) salida.push({
		id: "promesas_vencidas",
		nivel: "critica",
		titulo: `${r.promesas_vencidas} promesas vencidas`,
		texto: "Le dijiste a la tienda una fecha que ya pasó. Avísale la nueva fecha.",
		accion: {
			etiqueta: "Avisar a mis tiendas",
			ruta: "/muestras/avisos"
		}
	});
	salida.push(...despues);
	return salida;
}
function dashboard(p, copia, hoy) {
	const d = p.periodo === "30d" ? copia.dashboard["30d"] : p.periodo === "todo" ? copia.dashboard.todo : null;
	if (!d) return null;
	const vista = vistaMuestras(copia, hoy);
	const resumen = resumenConLocal(d.muestras, copia, vista, hoy);
	const tiendasConPendientes = pendientesPorTienda(vista).size;
	return conMeta({
		...d,
		muestras: resumen,
		alertas: alertasConLocal(d.alertas, resumen, tiendasConPendientes)
	}, copia);
}
/** content_id de video que vendieron cada producto, según los pedidos recientes y los extras de las muestras. */
function videosPorProducto(copia) {
	const mapa = /* @__PURE__ */ new Map();
	const poner = (pid, cid) => {
		const s = mapa.get(pid);
		if (s) s.add(cid);
		else mapa.set(pid, /* @__PURE__ */ new Set([cid]));
	};
	for (const o of copia.ordenes_recientes) for (const l of o.lineas) if (l.tipo_contenido === "VIDEO" && l.content_id) poner(l.product_id, l.content_id);
	const pidDe = new Map(copia.muestras.map((m) => [m.application_id, m.producto.product_id]));
	for (const [aid, ex] of Object.entries(copia.extras?.muestras ?? {})) {
		const pid = pidDe.get(aid);
		if (pid !== void 0) for (const v of ex.videos_del_producto) poner(pid, v.content_id);
	}
	return mapa;
}
/** Pedidos de la copia. Solo con un `desde` cubierto (ordenesCompletasDesde): p. ej. "Últimos 7 días" o "Últimos 30
*  días". Sin `desde` (todo el historial, o por tienda, producto o video sin rango) o con uno anterior, la lista y el
*  total saldrían recortados sin aviso → null ("Necesita tu PC encendida"). Un `desde` posterior al día en que se armó
*  la copia tampoco: de esos días la copia no sabe nada (no es que haya 0 pedidos). */
function ordenes(p, copia) {
	const { desde, hasta, estado, tienda, producto, video } = p;
	if (desde === void 0 || desde < ordenesCompletasDesde(copia) || desde > fechaLocalDe(copia.generado_at)) return null;
	let items = copia.ordenes_recientes.filter((o) => o.fecha >= desde);
	if (hasta !== void 0) items = items.filter((o) => o.fecha <= hasta);
	if (estado && estado.length > 0) items = items.filter((o) => estado.includes(o.estado));
	if (tienda !== void 0) items = items.filter((o) => o.lineas.some((l) => claveTienda(l.tienda_nombre) === tienda));
	if (producto !== void 0) items = items.filter((o) => o.lineas.some((l) => l.product_id === producto));
	if (video !== void 0) items = items.filter((o) => o.lineas.some((l) => l.content_id === video));
	const q = p.q?.trim();
	if (q) items = items.filter((o) => coincide(q, o.order_id, ...o.lineas.flatMap((l) => [
		l.producto,
		l.tienda_nombre,
		l.product_id
	])));
	items = [...items].sort((a, b) => b.creada_at - a.creada_at || compararTexto(a.order_id, b.order_id));
	const porPagina = Math.min(200, Math.max(1, Math.floor(p.por_pagina ?? 50)));
	const pagina = Math.max(1, Math.floor(p.pagina ?? 1));
	return conMeta({
		items: items.slice((pagina - 1) * porPagina, pagina * porPagina),
		total: items.length,
		pagina,
		por_pagina: porPagina,
		data_version: copia.data_version
	}, copia);
}
var necesitaPc = () => null;
var ARMADORES = {
	sesion: (_p, copia) => ({
		cuenta: copia.cuenta,
		conexion: {
			estado: copia.conexion.estado,
			access_expira_at: null,
			refresh_expira_at: null,
			scopes: [],
			scopes_faltantes: [],
			aviso: copia.conexion.aviso,
			origen: null
		},
		sync: {
			en_curso: false,
			sync_id: null,
			tipo: null,
			origen: null,
			progreso: copia.sync.ultima_ok_at !== null ? 1 : 0,
			paso_actual: null,
			texto: "",
			pasos: [],
			iniciada_at: null,
			ultima_ok_at: copia.sync.ultima_ok_at,
			ultima_estado: copia.sync.ultima_estado,
			proxima_auto_at: null,
			ultimo_error: null
		},
		datos: {
			data_version: copia.data_version,
			local_rev: copia.local_rev,
			ultima_sync_ok_at: copia.sync.ultima_ok_at,
			hay_datos: copia.muestras.length > 0 || copia.ordenes_recientes.length > 0 || copia.sync.ultima_ok_at !== null
		},
		plataforma: "android",
		modo: "real",
		capacidades: {
			auth: false,
			lan_admin: false,
			portapapeles: false,
			escribir: true,
			sincronizar: false
		}
	}),
	dashboard,
	muestras: muestras$1,
	muestra: muestra$2,
	tiendas: (p, copia, hoy) => {
		if (!rangoEnLaCopia(p, copia)) return null;
		const filas = ordenarTiendas(filasTiendas(copia, vistaMuestras(copia, hoy), hoy), p.orden ?? "atencion");
		return conMeta({
			items: filas,
			total: filas.length,
			data_version: copia.data_version
		}, copia);
	},
	tienda: (p, copia, hoy) => {
		if (!rangoEnLaCopia(p, copia)) return null;
		const base = copia.tiendas.find((x) => x.tienda_key === p.key);
		if (!base) return null;
		const ms = copia.muestras.filter((m) => m.tienda.tienda_key === p.key).map((m) => aplicarLocal(m, copia.local.planes, copia.local.avisos, hoy));
		const originales = new Map(copia.muestras.map((m) => [m.application_id, m]));
		const t = filaConLocal(base, ms, originales, copia.local.avisos, hoy);
		const extra = copia.extras?.tiendas[p.key];
		const sugerida = extra !== void 0 && tiendaSinCambios(ms, originales) ? extra.plantilla_sugerida : plantillaTienda(t, ms.filter(esPendiente), copia);
		return conMeta({
			tienda: t,
			muestras: ms,
			serie: extra?.serie ?? [],
			productos: copia.productos.filter((x) => x.tienda_key === p.key),
			notas: copia.local.notas.filter((n) => n.entidad === "tienda" && n.entidad_id === p.key),
			avisos: copia.local.avisos.filter((a) => a.tienda_key === p.key),
			plantilla_sugerida: sugerida
		}, copia);
	},
	serie: necesitaPc,
	videos: (p, copia) => {
		if (!rangoEnLaCopia(p, copia) || !videosCompletos(copia)) return null;
		return conMeta({
			items: p.limite !== void 0 ? copia.videos.slice(0, Math.max(0, Math.floor(p.limite))) : copia.videos,
			total: copia.videos.length,
			data_version: copia.data_version
		}, copia);
	},
	video: (p, copia) => {
		const v = copia.videos.find((x) => x.content_id === p.id);
		if (!v) return null;
		const productos = /* @__PURE__ */ new Set();
		for (const [pid, cids] of videosPorProducto(copia)) if (cids.has(p.id)) productos.add(pid);
		return conMeta({
			video: v,
			serie: [],
			productos: copia.productos.filter((x) => productos.has(x.product_id))
		}, copia);
	},
	productos: (p, copia) => {
		if (!rangoEnLaCopia(p, copia)) return null;
		return conMeta({
			items: p.limite !== void 0 ? copia.productos.slice(0, Math.max(0, Math.floor(p.limite))) : copia.productos,
			total: copia.productos.length,
			data_version: copia.data_version
		}, copia);
	},
	producto: (p, copia, hoy) => {
		const fila = copia.productos.find((x) => x.product_id === p.id) ?? null;
		const ms = vistaMuestras(copia, hoy).filter((m) => m.producto.product_id === p.id);
		if (fila === null && ms.length === 0) return null;
		const ficha = ms[0] !== void 0 && (fila === null || fila.con_ficha) ? ms[0].producto : null;
		const cids = videosPorProducto(copia).get(p.id) ?? /* @__PURE__ */ new Set();
		return conMeta({
			product_id: p.id,
			ficha,
			con_inventario: null,
			categoria_ruta: ficha?.categoria ? ficha.categoria.split(/\s*>\s*/).join(" › ") : null,
			comision_anuncios_bp: null,
			fila,
			serie: [],
			videos: copia.videos.filter((v) => cids.has(v.content_id)),
			muestras: ms,
			notas: copia.local.notas.filter((n) => n.entidad === "producto" && n.entidad_id === p.id)
		}, copia);
	},
	ordenes: (p, copia) => ordenes(p, copia),
	plan: (p, copia) => {
		const { desde, hasta } = p;
		const conRango = desde !== void 0 || hasta !== void 0;
		return {
			items: copia.local.planes.filter((x) => {
				if (!conRango) return true;
				if (x.fecha_plan === null) return false;
				return (desde === void 0 || x.fecha_plan >= desde) && (hasta === void 0 || x.fecha_plan <= hasta);
			}),
			local_rev: copia.local_rev
		};
	},
	avisos: (p, copia) => ({
		items: copia.local.avisos.filter((a) => (p.tienda === void 0 || a.tienda_key === p.tienda) && (p.solicitud === void 0 || a.solicitud_ids.includes(p.solicitud))),
		local_rev: copia.local_rev
	}),
	plantillas: (_p, copia) => ({
		items: copia.local.plantillas,
		local_rev: copia.local_rev
	}),
	preferencias: (_p, copia) => copia.local.preferencias,
	notas: (p, copia) => ({
		items: copia.local.notas.filter((n) => (p.entidad === void 0 || n.entidad === p.entidad) && (p.entidad_id === void 0 || n.entidad_id === p.entidad_id)),
		local_rev: copia.local_rev
	}),
	recordatorios: (p, copia) => ({
		items: copia.local.recordatorios.filter((r) => p.estado === void 0 || r.estado === p.estado),
		local_rev: copia.local_rev
	}),
	sync_historial: necesitaPc,
	sync_cobertura: necesitaPc,
	credenciales: necesitaPc,
	lan: necesitaPc,
	firewall: necesitaPc,
	ajustes_pc: necesitaPc,
	uso_datos: necesitaPc,
	display: necesitaPc
};
/** Arma la respuesta de una consulta con la copia (SnapshotResponse + extras + ops pendientes ya aplicadas).
*  null = no se puede sin la PC (la interfaz muestra "Necesita tu PC encendida"). Claves derivables: BUILD_SPEC §8.3. */
function deCopia(clave, params, copia, hoy) {
	const armar = ARMADORES[clave];
	if (typeof armar !== "function") return null;
	return armar(params, copia, hoy);
}
function versionado(ahora) {
	return {
		creado_at: ahora,
		actualizado_at: ahora,
		rev: 1,
		dispositivo_id: "android"
	};
}
function aplicarOp(local, op, ahora) {
	switch (op.tipo) {
		case "plan.crear": {
			const d = op.datos;
			if (local.planes.some((p) => p.id === d.id)) return local;
			const previo = d.application_id ? planVivo(d.application_id, local.planes) : null;
			const plan = {
				id: d.id,
				application_id: d.application_id ?? null,
				product_id: d.product_id ?? null,
				tienda_key: d.tienda_key ?? null,
				titulo: d.titulo,
				fecha_plan: d.fecha_plan ?? null,
				estado: d.estado ?? "por_planear",
				fecha_video_listo: d.fecha_video_listo ?? null,
				programada_para_at: d.programada_para_at ?? null,
				fecha_publicada: d.fecha_publicada ?? null,
				content_id: d.content_id ?? null,
				enlace_video: d.enlace_video ?? null,
				vinculo_origen: d.vinculo_origen ?? null,
				sugerencias_descartadas: d.sugerencias_descartadas ?? [],
				motivo_no_se_puede: d.motivo_no_se_puede ?? null,
				motivo_texto: d.motivo_texto ?? null,
				fijada: d.fijada ?? false,
				nombre_corto: d.nombre_corto ?? null,
				notas: d.notas ?? null,
				orden: d.orden ?? 0,
				en_cohorte_desde_at: previo?.en_cohorte_desde_at ?? null,
				...versionado(ahora)
			};
			const planes = previo ? local.planes.filter((p) => p.id !== previo.id) : [...local.planes];
			return {
				...local,
				planes: [...planes, plan]
			};
		}
		case "plan.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				planes: local.planes.map((p) => p.id === op.id ? {
					...p,
					...cambios,
					rev: p.rev + 1,
					actualizado_at: ahora
				} : p)
			};
		}
		case "plan.borrar": return {
			...local,
			planes: local.planes.filter((p) => p.id !== op.id)
		};
		case "nota.crear": {
			const d = op.datos;
			if (local.notas.some((n) => n.id === d.id)) return local;
			const nota = {
				id: d.id,
				entidad: d.entidad,
				entidad_id: d.entidad_id,
				texto: d.texto,
				fijada: d.fijada ?? false,
				...versionado(ahora)
			};
			return {
				...local,
				notas: [...local.notas, nota]
			};
		}
		case "nota.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				notas: local.notas.map((n) => n.id === op.id ? {
					...n,
					...cambios,
					rev: n.rev + 1,
					actualizado_at: ahora
				} : n)
			};
		}
		case "nota.borrar": return {
			...local,
			notas: local.notas.filter((n) => n.id !== op.id)
		};
		case "recordatorio.crear": {
			const d = op.datos;
			if (local.recordatorios.some((r) => r.id === d.id)) return local;
			const rec = {
				id: d.id,
				entidad: d.entidad ?? "general",
				entidad_id: d.entidad_id ?? null,
				titulo: d.titulo,
				vence_at: d.vence_at,
				repetir: d.repetir ?? "no",
				estado: "activo",
				pospuesto_hasta: null,
				notificado_at: null,
				...versionado(ahora)
			};
			return {
				...local,
				recordatorios: [...local.recordatorios, rec]
			};
		}
		case "recordatorio.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				recordatorios: local.recordatorios.map((r) => r.id === op.id ? {
					...r,
					...cambios,
					rev: r.rev + 1,
					actualizado_at: ahora
				} : r)
			};
		}
		case "recordatorio.borrar": return {
			...local,
			recordatorios: local.recordatorios.filter((r) => r.id !== op.id)
		};
		case "aviso.crear": {
			const d = op.datos;
			if (local.avisos.some((a) => a.id === d.id)) return local;
			const aviso = {
				id: d.id,
				tienda_key: d.tienda_key,
				solicitud_ids: [...d.solicitud_ids],
				plantilla_id: d.plantilla_id,
				texto: d.texto,
				compromisos: { ...d.compromisos },
				fecha_anterior: d.fecha_anterior ?? null,
				origen: d.origen,
				copiado_at: d.copiado_at ?? null,
				marcado_enviado_at: d.marcado_enviado_at ?? null,
				quitado_at: null,
				...versionado(ahora)
			};
			return {
				...local,
				avisos: [...local.avisos, aviso]
			};
		}
		case "aviso.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				avisos: local.avisos.map((a) => a.id === op.id ? {
					...a,
					...cambios,
					rev: a.rev + 1,
					actualizado_at: ahora
				} : a)
			};
		}
		case "plantilla.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				plantillas: local.plantillas.map((p) => p.id === op.id ? {
					...p,
					...cambios,
					rev: p.rev + 1,
					actualizado_at: ahora
				} : p)
			};
		}
		case "preferencias.editar": {
			const { rev: _rev, ...cambios } = op.cambios;
			return {
				...local,
				preferencias: {
					...local.preferencias,
					...cambios,
					rev: local.preferencias.rev + 1
				}
			};
		}
	}
}
/** Aplica ops pendientes (cola de Android) al bloque `local` de la copia, en orden y sin mutar la copia. Optimista: una
*  edición se aplica aunque su `rev` ya no coincida (el hub decide al recibirla; si hay conflicto gana la PC, C26).
*  Crear con un id que ya existe no hace nada (idempotente por id, como el hub). */
function aplicarOpsACopia(copia, ops, hoy) {
	if (ops.length === 0) return copia;
	const ahora = instanteDe(hoy);
	let local = copia.local;
	for (const op of ops) local = aplicarOp(local, op, ahora);
	return {
		...copia,
		local
	};
}
function reales() {
	return {
		ahoraS: () => ahoraS(),
		hoyLocal: () => hoyLocal(),
		nuevoId: () => nuevoId(),
		deCopia,
		aplicarOpsACopia,
		aplicarLocal,
		registroImagenes
	};
}
var dom = reales();
/** Registra el meta_imagenes de cualquier respuesta (C47: el almacén vive en dominio.registroImagenes). */
function registrarMetaDe(datos) {
	if (datos === null || typeof datos !== "object" || !("meta_imagenes" in datos)) return;
	const meta = datos.meta_imagenes;
	if (meta === null || typeof meta !== "object" || Array.isArray(meta)) return;
	dom.registroImagenes.registrar(meta);
}
var RUTAS_CONSULTA = {
	sesion: { ruta: "/api/session" },
	dashboard: { ruta: "/api/dashboard" },
	muestras: { ruta: "/api/muestras" },
	muestra: {
		ruta: "/api/muestras",
		enRuta: "id"
	},
	tiendas: { ruta: "/api/tiendas" },
	tienda: {
		ruta: "/api/tiendas",
		enRuta: "key"
	},
	serie: { ruta: "/api/analitica/serie" },
	videos: { ruta: "/api/analitica/videos" },
	video: {
		ruta: "/api/videos",
		enRuta: "id"
	},
	productos: { ruta: "/api/analitica/productos" },
	producto: {
		ruta: "/api/productos",
		enRuta: "id"
	},
	ordenes: { ruta: "/api/ordenes" },
	plan: { ruta: "/api/plan" },
	avisos: { ruta: "/api/avisos" },
	plantillas: { ruta: "/api/plantillas" },
	preferencias: { ruta: "/api/preferencias" },
	notas: { ruta: "/api/notas" },
	recordatorios: { ruta: "/api/recordatorios" },
	sync_historial: { ruta: "/api/sync/historial" },
	sync_cobertura: { ruta: "/api/sync/cobertura" },
	credenciales: { ruta: "/api/credenciales/estado" },
	lan: { ruta: "/api/lan/estado" },
	firewall: { ruta: "/api/lan/firewall" },
	ajustes_pc: { ruta: "/api/ajustes/pc" },
	uso_datos: { ruta: "/api/datos/uso" },
	display: { ruta: "/api/display/estado" }
};
var TODAS_LAS_CLAVES = Object.keys(RUTAS_CONSULTA).filter((k) => k in RUTAS_CONSULTA);
function valorQuery(v) {
	if (v === void 0 || v === null) return null;
	if (Array.isArray(v)) return v.length ? v.map(String).sort().join(",") : null;
	if (typeof v === "boolean") return v ? "1" : "0";
	if (typeof v === "string") return v === "" ? null : v;
	if (typeof v === "number") return Number.isFinite(v) ? String(v) : null;
	return null;
}
function rutaDeConsulta(clave, params) {
	const def = RUTAS_CONSULTA[clave];
	let ruta = def.ruta;
	const query = [];
	for (const [k, v] of Object.entries(params)) {
		const texto = valorQuery(v);
		if (texto === null) continue;
		if (def.enRuta === k) ruta = `${def.ruta}/${encodeURIComponent(texto)}`;
		else query.push([k, texto]);
	}
	query.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
	return {
		ruta,
		query
	};
}
/** URL relativa lista para fetch ('/api/muestras?grupo=pausada,vencida&orden=prioridad'). */
function urlDe(r) {
	if (r.query.length === 0) return r.ruta;
	return `${r.ruta}?${r.query.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v).replace(/%2C/gi, ",")}`).join("&")}`;
}
/** Clave de la caché: clave + URL canónica. */
function claveCache(clave, params) {
	return `${clave}|${urlDe(rutaDeConsulta(clave, params))}`;
}
/** Claves que dependen del estado local (plan, avisos, notas…): se superponen con las ops pendientes. */
var CLAVES_LOCALES = [
	"plan",
	"avisos",
	"notas",
	"recordatorios",
	"plantillas",
	"preferencias"
];
/** Claves que traen imágenes versionadas (C45): se vuelven a pedir cuando sube img_rev. */
var CLAVES_CON_IMAGENES = [
	"sesion",
	"dashboard",
	"muestras",
	"muestra",
	"tiendas",
	"tienda",
	"videos",
	"video",
	"productos",
	"producto",
	"ordenes"
];
var POR_SECCION = {
	muestras: [
		"muestras",
		"muestra",
		"dashboard",
		"tiendas",
		"tienda",
		"producto",
		"sync_cobertura"
	],
	ordenes: [
		"ordenes",
		"dashboard",
		"serie",
		"tiendas",
		"tienda",
		"videos",
		"video",
		"productos",
		"producto",
		"muestras",
		"muestra",
		"sync_cobertura"
	],
	productos: [
		"productos",
		"producto",
		"muestras",
		"muestra",
		"tiendas",
		"tienda",
		"videos",
		"video",
		"dashboard",
		"ordenes",
		"sync_cobertura"
	],
	tiendas: [
		"tiendas",
		"tienda",
		"muestras",
		"muestra",
		"dashboard"
	],
	videos: [
		"videos",
		"video",
		"producto",
		"dashboard",
		"sync_cobertura"
	],
	cuenta: [
		"sesion",
		"credenciales",
		"lan"
	],
	local: [
		"plan",
		"avisos",
		"notas",
		"recordatorios",
		"plantillas",
		"preferencias",
		"muestras",
		"muestra",
		"tiendas",
		"tienda",
		"dashboard",
		"producto"
	]
};
/** Claves a invalidar por las secciones de `datos.cambiaron` (siempre incluye 'sesion': cambia data_version/local_rev). */
function clavesDeSecciones(secciones) {
	const salida = /* @__PURE__ */ new Set(["sesion"]);
	for (const s of secciones) for (const k of POR_SECCION[s] ?? []) salida.add(k);
	return [...salida];
}
/** Claves que tocan las ops de cada tipo (invalidación inmediata tras una acción propia). */
function clavesDeOp(tipo) {
	if (tipo.startsWith("plan.")) return [
		"plan",
		"muestras",
		"muestra",
		"tiendas",
		"tienda",
		"producto",
		"dashboard"
	];
	if (tipo.startsWith("aviso.")) return [
		"avisos",
		"muestras",
		"muestra",
		"tiendas",
		"tienda",
		"dashboard"
	];
	if (tipo.startsWith("nota.")) return [
		"notas",
		"muestra",
		"tienda",
		"producto"
	];
	if (tipo.startsWith("recordatorio.")) return ["recordatorios", "muestra"];
	if (tipo.startsWith("plantilla.")) return ["plantillas"];
	return [
		"preferencias",
		"dashboard",
		"muestras"
	];
}
var ESTADO_VACIO = {
	planes: [],
	avisos: [],
	notas: [],
	recordatorios: [],
	plantillas: [],
	preferencias: null
};
/** Lista del estado local que toca una op y la clave de Consultas que la lee. */
function listaDeOp(tipo) {
	if (tipo.startsWith("plan.")) return {
		lista: "planes",
		clave: "plan"
	};
	if (tipo.startsWith("aviso.")) return {
		lista: "avisos",
		clave: "avisos"
	};
	if (tipo.startsWith("nota.")) return {
		lista: "notas",
		clave: "notas"
	};
	if (tipo.startsWith("recordatorio.")) return {
		lista: "recordatorios",
		clave: "recordatorios"
	};
	if (tipo.startsWith("plantilla.")) return {
		lista: "plantillas",
		clave: "plantillas"
	};
	return {
		lista: "preferencias",
		clave: "preferencias"
	};
}
/** Id del objeto que toca la op ('preferencias' para las preferencias). */
function idDeOp(op) {
	switch (op.tipo) {
		case "plan.crear":
		case "nota.crear":
		case "recordatorio.crear":
		case "aviso.crear": return op.datos.id;
		case "preferencias.editar": return "preferencias";
		default: return op.id;
	}
}
/** La op con su op_id (uuid4 que genera la capa de datos). */
function conOpId(op, op_id) {
	switch (op.tipo) {
		case "plan.crear": return {
			op_id,
			tipo: op.tipo,
			datos: op.datos
		};
		case "plan.editar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			cambios: op.cambios
		};
		case "plan.borrar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			rev: op.rev
		};
		case "nota.crear": return {
			op_id,
			tipo: op.tipo,
			datos: op.datos
		};
		case "nota.editar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			cambios: op.cambios
		};
		case "nota.borrar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			rev: op.rev
		};
		case "recordatorio.crear": return {
			op_id,
			tipo: op.tipo,
			datos: op.datos
		};
		case "recordatorio.editar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			cambios: op.cambios
		};
		case "recordatorio.borrar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			rev: op.rev
		};
		case "aviso.crear": return {
			op_id,
			tipo: op.tipo,
			datos: op.datos
		};
		case "aviso.editar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			cambios: op.cambios
		};
		case "plantilla.editar": return {
			op_id,
			tipo: op.tipo,
			id: op.id,
			cambios: op.cambios
		};
		case "preferencias.editar": return {
			op_id,
			tipo: op.tipo,
			cambios: op.cambios
		};
	}
}
function versionNueva(ctx) {
	return {
		creado_at: ctx.ahora,
		actualizado_at: ctx.ahora,
		rev: 1,
		dispositivo_id: ctx.dispositivo
	};
}
function planCompleto(datos, ctx) {
	return {
		application_id: null,
		product_id: null,
		tienda_key: null,
		fecha_plan: null,
		estado: "por_planear",
		fecha_video_listo: null,
		programada_para_at: null,
		fecha_publicada: null,
		content_id: null,
		enlace_video: null,
		vinculo_origen: null,
		sugerencias_descartadas: [],
		motivo_no_se_puede: null,
		motivo_texto: null,
		fijada: false,
		nombre_corto: null,
		notas: null,
		orden: 0,
		en_cohorte_desde_at: null,
		...datos,
		...versionNueva(ctx)
	};
}
function avisoCompleto(datos, ctx) {
	return {
		fecha_anterior: null,
		copiado_at: null,
		marcado_enviado_at: null,
		quitado_at: null,
		...datos,
		...versionNueva(ctx)
	};
}
function notaCompleta(datos, ctx) {
	return {
		fijada: false,
		...datos,
		...versionNueva(ctx)
	};
}
function recordatorioCompleto(datos, ctx) {
	return {
		entidad: "general",
		entidad_id: null,
		repetir: "no",
		estado: "activo",
		pospuesto_hasta: null,
		notificado_at: null,
		...datos,
		...versionNueva(ctx)
	};
}
function sinRev(cambios) {
	const { rev: _rev, ...resto } = cambios;
	return resto;
}
function editado(base, cambios, ctx) {
	return {
		...base,
		...cambios,
		rev: base.rev + 1,
		actualizado_at: ctx.ahora,
		dispositivo_id: ctx.dispositivo
	};
}
function reemplazar(lista, objeto) {
	let hubo = false;
	const salida = lista.map((x) => {
		if (x.id !== objeto.id) return x;
		hubo = true;
		return objeto;
	});
	if (!hubo) salida.push(objeto);
	return salida;
}
function quitar(lista, id) {
	return lista.filter((x) => x.id !== id);
}
/** Aplica una op al estado local (no muta la entrada). */
function aplicarOpAEstado(estado, op, ctx) {
	switch (op.tipo) {
		case "plan.crear": {
			const objeto = estado.planes.find((p) => p.id === op.datos.id) ?? planCompleto(op.datos, ctx);
			return {
				estado: {
					...estado,
					planes: reemplazar(estado.planes, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "plan.editar": {
			const base = estado.planes.find((p) => p.id === op.id);
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = editado(base, sinRev(op.cambios), ctx);
			return {
				estado: {
					...estado,
					planes: reemplazar(estado.planes, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "plan.borrar": {
			const encontrada = estado.planes.some((p) => p.id === op.id);
			return {
				estado: {
					...estado,
					planes: quitar(estado.planes, op.id)
				},
				objeto: null,
				encontrada
			};
		}
		case "nota.crear": {
			const objeto = estado.notas.find((n) => n.id === op.datos.id) ?? notaCompleta(op.datos, ctx);
			return {
				estado: {
					...estado,
					notas: reemplazar(estado.notas, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "nota.editar": {
			const base = estado.notas.find((n) => n.id === op.id);
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = editado(base, sinRev(op.cambios), ctx);
			return {
				estado: {
					...estado,
					notas: reemplazar(estado.notas, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "nota.borrar": {
			const encontrada = estado.notas.some((n) => n.id === op.id);
			return {
				estado: {
					...estado,
					notas: quitar(estado.notas, op.id)
				},
				objeto: null,
				encontrada
			};
		}
		case "recordatorio.crear": {
			const objeto = estado.recordatorios.find((r) => r.id === op.datos.id) ?? recordatorioCompleto(op.datos, ctx);
			return {
				estado: {
					...estado,
					recordatorios: reemplazar(estado.recordatorios, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "recordatorio.editar": {
			const base = estado.recordatorios.find((r) => r.id === op.id);
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = editado(base, sinRev(op.cambios), ctx);
			return {
				estado: {
					...estado,
					recordatorios: reemplazar(estado.recordatorios, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "recordatorio.borrar": {
			const encontrada = estado.recordatorios.some((r) => r.id === op.id);
			return {
				estado: {
					...estado,
					recordatorios: quitar(estado.recordatorios, op.id)
				},
				objeto: null,
				encontrada
			};
		}
		case "aviso.crear": {
			const objeto = estado.avisos.find((a) => a.id === op.datos.id) ?? avisoCompleto(op.datos, ctx);
			return {
				estado: {
					...estado,
					avisos: reemplazar(estado.avisos, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "aviso.editar": {
			const base = estado.avisos.find((a) => a.id === op.id);
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = editado(base, sinRev(op.cambios), ctx);
			return {
				estado: {
					...estado,
					avisos: reemplazar(estado.avisos, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "plantilla.editar": {
			const base = estado.plantillas.find((p) => p.id === op.id);
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = editado(base, sinRev(op.cambios), ctx);
			return {
				estado: {
					...estado,
					plantillas: reemplazar(estado.plantillas, objeto)
				},
				objeto,
				encontrada: true
			};
		}
		case "preferencias.editar": {
			const base = estado.preferencias;
			if (!base) return {
				estado,
				objeto: null,
				encontrada: false
			};
			const objeto = {
				...base,
				...sinRev(op.cambios),
				rev: base.rev + 1
			};
			return {
				estado: {
					...estado,
					preferencias: objeto
				},
				objeto,
				encontrada: true
			};
		}
	}
}
function camposPrevios(antes, cambios) {
	const salida = {};
	for (const k of Object.keys(cambios)) {
		if (k === "rev" || !(k in antes)) continue;
		const clave = k;
		salida[clave] = antes[clave];
	}
	return salida;
}
function esVersionado(o) {
	return o !== null && typeof o === "object" && !Array.isArray(o) && "id" in o && typeof o.id === "string" && "rev" in o && typeof o.rev === "number";
}
function esPlan(o) {
	return esVersionado(o) && "fecha_plan" in o && "titulo" in o;
}
function esAviso(o) {
	return esVersionado(o) && Array.isArray(o["solicitud_ids"]) && "compromisos" in o;
}
function esRecordatorio(o) {
	return esVersionado(o) && "vence_at" in o && "titulo" in o;
}
function esNota(o) {
	return esVersionado(o) && "entidad" in o && "texto" in o && !("vence_at" in o) && !("solicitud_ids" in o);
}
function esPlantilla(o) {
	return esVersionado(o) && "cuerpo" in o && "predeterminada" in o;
}
function esPreferencias(o) {
	return o !== null && typeof o === "object" && "capacidad_videos_dia" in o && "rev" in o && typeof o.rev === "number";
}
/** Cualquier objeto del estado local reconocible. */
function esObjetoLocalConocido(o) {
	return esPlan(o) || esAviso(o) || esRecordatorio(o) || esNota(o) || esPlantilla(o) || esPreferencias(o);
}
var guardas = {
	esPlan,
	esAviso,
	esRecordatorio,
	esNota,
	esPlantilla,
	esPreferencias,
	esObjetoLocalConocido
};
function datosPlan(p, id) {
	return {
		id,
		titulo: p.titulo,
		application_id: p.application_id,
		product_id: p.product_id,
		tienda_key: p.tienda_key,
		fecha_plan: p.fecha_plan,
		estado: p.estado,
		fecha_video_listo: p.fecha_video_listo,
		programada_para_at: p.programada_para_at,
		fecha_publicada: p.fecha_publicada,
		content_id: p.content_id,
		enlace_video: p.enlace_video,
		vinculo_origen: p.vinculo_origen,
		sugerencias_descartadas: [...p.sugerencias_descartadas],
		motivo_no_se_puede: p.motivo_no_se_puede,
		motivo_texto: p.motivo_texto,
		fijada: p.fijada,
		nombre_corto: p.nombre_corto,
		notas: p.notas,
		orden: p.orden
	};
}
/**
* Op inversa para "Deshacer" (con la rev NUEVA del objeto: `despues`). Crear → borrar (aviso: quitar con quitado_at,
* no hay DELETE); editar → editar con los valores previos de los campos tocados; borrar → crear una copia con id nuevo.
* null = no se puede armar (falta el objeto previo o el resultante).
*/
function inversaDe(op, antes, despues, ctx, nuevoId) {
	switch (op.tipo) {
		case "plan.crear": return esPlan(despues) ? {
			tipo: "plan.borrar",
			id: despues.id,
			rev: despues.rev
		} : null;
		case "plan.editar": return esPlan(antes) && esPlan(despues) ? {
			tipo: "plan.editar",
			id: op.id,
			cambios: {
				...camposPrevios(antes, op.cambios),
				rev: despues.rev
			}
		} : null;
		case "plan.borrar": return esPlan(antes) ? {
			tipo: "plan.crear",
			datos: datosPlan(antes, nuevoId())
		} : null;
		case "nota.crear": return esNota(despues) ? {
			tipo: "nota.borrar",
			id: despues.id,
			rev: despues.rev
		} : null;
		case "nota.editar": return esNota(antes) && esNota(despues) ? {
			tipo: "nota.editar",
			id: op.id,
			cambios: {
				...camposPrevios(antes, op.cambios),
				rev: despues.rev
			}
		} : null;
		case "nota.borrar": return esNota(antes) ? {
			tipo: "nota.crear",
			datos: {
				id: nuevoId(),
				entidad: antes.entidad,
				entidad_id: antes.entidad_id,
				texto: antes.texto,
				fijada: antes.fijada
			}
		} : null;
		case "recordatorio.crear": return esRecordatorio(despues) ? {
			tipo: "recordatorio.borrar",
			id: despues.id,
			rev: despues.rev
		} : null;
		case "recordatorio.editar": return esRecordatorio(antes) && esRecordatorio(despues) ? {
			tipo: "recordatorio.editar",
			id: op.id,
			cambios: {
				...camposPrevios(antes, op.cambios),
				rev: despues.rev
			}
		} : null;
		case "recordatorio.borrar": return esRecordatorio(antes) ? {
			tipo: "recordatorio.crear",
			datos: {
				id: nuevoId(),
				titulo: antes.titulo,
				vence_at: antes.vence_at,
				entidad: antes.entidad,
				entidad_id: antes.entidad_id,
				repetir: antes.repetir
			}
		} : null;
		case "aviso.crear": return esAviso(despues) ? {
			tipo: "aviso.editar",
			id: despues.id,
			cambios: {
				quitado_at: ctx.ahora,
				rev: despues.rev
			}
		} : null;
		case "aviso.editar": return esAviso(antes) && esAviso(despues) ? {
			tipo: "aviso.editar",
			id: op.id,
			cambios: {
				...camposPrevios(antes, op.cambios),
				rev: despues.rev
			}
		} : null;
		case "plantilla.editar": return esPlantilla(antes) && esPlantilla(despues) ? {
			tipo: "plantilla.editar",
			id: op.id,
			cambios: {
				nombre: antes.nombre,
				cuerpo: antes.cuerpo,
				rev: despues.rev
			}
		} : null;
		case "preferencias.editar": return esPreferencias(antes) && esPreferencias(despues) ? {
			tipo: "preferencias.editar",
			cambios: {
				...camposPrevios(antes, op.cambios),
				rev: despues.rev
			}
		} : null;
	}
}
function texto$11(params, k) {
	const v = k in params ? Object.getOwnPropertyDescriptor(params, k)?.value : void 0;
	return typeof v === "string" && v !== "" ? v : void 0;
}
/** ¿El objeto entra en la lista que devuelve la consulta `clave` con `params`? (mismo criterio que el hub). */
function entraEnConsulta(clave, params, o) {
	switch (clave) {
		case "plan": {
			if (!esPlan(o)) return false;
			const desde = texto$11(params, "desde");
			const hasta = texto$11(params, "hasta");
			if (!desde && !hasta) return true;
			if (o.fecha_plan === null) return false;
			return (!desde || o.fecha_plan >= desde) && (!hasta || o.fecha_plan <= hasta);
		}
		case "avisos": {
			if (!esAviso(o)) return false;
			const tienda = texto$11(params, "tienda");
			const solicitud = texto$11(params, "solicitud");
			return (!tienda || o.tienda_key === tienda) && (!solicitud || o.solicitud_ids.includes(solicitud));
		}
		case "notas": {
			if (!esNota(o)) return false;
			const entidad = texto$11(params, "entidad");
			const entidadId = texto$11(params, "entidad_id");
			return (!entidad || o.entidad === entidad) && (!entidadId || o.entidad_id === entidadId);
		}
		case "recordatorios": {
			if (!esRecordatorio(o)) return false;
			const estado = texto$11(params, "estado");
			return !estado || o.estado === estado;
		}
		case "plantillas": return esPlantilla(o);
		default: return false;
	}
}
/** application_id cuyo avance o avisos cambia con la op (para recalcular esas muestras con dominio.aplicarLocal). */
function solicitudesTocadas(antes, despues) {
	const salida = /* @__PURE__ */ new Set();
	for (const o of [antes, despues]) {
		if (esPlan(o) && o.application_id) salida.add(o.application_id);
		if (esAviso(o)) for (const s of o.solicitud_ids) salida.add(s);
	}
	return salida;
}
var MAX_ETAGS = 200;
async function leerCuerpo(resp) {
	if (resp.status === 204) return null;
	const texto = await resp.text();
	if (texto === "") return null;
	try {
		return JSON.parse(texto);
	} catch {
		throw new ErrorHub("error_interno", "Corte respondió algo que no esperábamos. Inténtalo de nuevo.", resp.status);
	}
}
var TIPOS_EVENTO = [
	"sync.progreso",
	"sync.fin",
	"datos.cambiaron",
	"conexion.cambio",
	"emparejamiento.solicitud",
	"emparejamiento.fin",
	"recordatorio.vencido",
	"ventana.preguntar_cierre",
	"ventana.mostrar_ruta",
	"ping",
	"display.cambio"
];
var CONJUNTO_TIPOS = new Set(TIPOS_EVENTO);
/** rev. 5 · Forma mínima de EstadoDisplay (lo que la interfaz lee para decidir el estado de Ajustes). */
function esEstadoDisplay(v) {
	if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
	const o = v;
	return typeof o["configurada"] === "boolean" && typeof o["conectada"] === "boolean" && typeof o["estado"] === "string" && Array.isArray(o["scopes"]) && Array.isArray(o["scopes_faltantes"]);
}
/** Convierte un mensaje SSE (nombre del evento + data JSON) en EventoHub; null si no se reconoce. */
function leerEventoSse(nombre, data) {
	let v;
	try {
		v = data === "" ? {} : JSON.parse(data);
	} catch {
		return null;
	}
	if (v === null || typeof v !== "object" || Array.isArray(v)) return null;
	const tipo = "tipo" in v && typeof v.tipo === "string" ? v.tipo : nombre;
	if (!CONJUNTO_TIPOS.has(tipo)) return null;
	const evento = {
		...v,
		tipo
	};
	if (tipo === "datos.cambiaron" && !Array.isArray(evento["secciones"])) return null;
	if ((tipo === "sync.progreso" || tipo === "sync.fin") && (evento["estado"] === null || typeof evento["estado"] !== "object")) return null;
	if (tipo === "display.cambio" && !esEstadoDisplay(evento["display"])) return null;
	return evento;
}
function rutaDeOp(op) {
	const e = (s) => encodeURIComponent(s);
	switch (op.tipo) {
		case "plan.crear": return {
			metodo: "POST",
			ruta: "/api/plan",
			cuerpo: op.datos
		};
		case "plan.editar": return {
			metodo: "PATCH",
			ruta: `/api/plan/${e(op.id)}`,
			cuerpo: op.cambios
		};
		case "plan.borrar": return {
			metodo: "DELETE",
			ruta: `/api/plan/${e(op.id)}?rev=${op.rev}`
		};
		case "nota.crear": return {
			metodo: "POST",
			ruta: "/api/notas",
			cuerpo: op.datos
		};
		case "nota.editar": return {
			metodo: "PATCH",
			ruta: `/api/notas/${e(op.id)}`,
			cuerpo: op.cambios
		};
		case "nota.borrar": return {
			metodo: "DELETE",
			ruta: `/api/notas/${e(op.id)}?rev=${op.rev}`
		};
		case "recordatorio.crear": return {
			metodo: "POST",
			ruta: "/api/recordatorios",
			cuerpo: op.datos
		};
		case "recordatorio.editar": return {
			metodo: "PATCH",
			ruta: `/api/recordatorios/${e(op.id)}`,
			cuerpo: op.cambios
		};
		case "recordatorio.borrar": return {
			metodo: "DELETE",
			ruta: `/api/recordatorios/${e(op.id)}?rev=${op.rev}`
		};
		case "aviso.crear": return {
			metodo: "POST",
			ruta: "/api/avisos",
			cuerpo: op.datos
		};
		case "aviso.editar": return {
			metodo: "PATCH",
			ruta: `/api/avisos/${e(op.id)}`,
			cuerpo: op.cambios
		};
		case "plantilla.editar": return {
			metodo: "PUT",
			ruta: `/api/plantillas/${e(op.id)}`,
			cuerpo: op.cambios
		};
		case "preferencias.editar": return {
			metodo: "PATCH",
			ruta: "/api/preferencias",
			cuerpo: op.cambios
		};
	}
}
/** Resultado de /api/local/ops → resultado del transporte. */
function desdeOpsResultado(r) {
	const objeto = r.objeto ?? null;
	switch (r.estado) {
		case "aplicada":
		case "duplicada": return {
			op_id: r.op_id,
			estado: "aplicada",
			estado_hub: r.estado,
			objeto,
			error: null
		};
		case "conflicto": return {
			op_id: r.op_id,
			estado: "conflicto",
			estado_hub: r.estado,
			objeto,
			error: new ErrorHub("conflicto", TEXTO_CONFLICTO, 409, void 0, void 0, objeto ?? void 0)
		};
		case "invalida": return {
			op_id: r.op_id,
			estado: "error",
			estado_hub: r.estado,
			objeto: null,
			error: new ErrorHub("parametros_invalidos", r.error && r.error.trim() !== "" ? r.error : "No pudimos guardar ese cambio. Revisa los datos.", 422)
		};
	}
}
function esOpsResponse(v) {
	return v !== null && typeof v === "object" && "resultados" in v && Array.isArray(v.resultados);
}
function crearTransporteWindows() {
	const etags = /* @__PURE__ */ new Map();
	async function getJson(url) {
		const previo = etags.get(url);
		const headers = { Accept: "application/json" };
		if (previo) headers["If-None-Match"] = previo.etag;
		let resp;
		try {
			resp = await fetch(url, {
				method: "GET",
				credentials: "same-origin",
				cache: "no-store",
				headers
			});
		} catch {
			throw errorDeRed();
		}
		if (resp.status === 304 && previo) return previo.cuerpo;
		if (!resp.ok) throw await errorDesdeRespuesta(resp);
		const cuerpo = await leerCuerpo(resp);
		const etag = resp.headers.get("ETag");
		if (etag) {
			etags.delete(url);
			etags.set(url, {
				etag,
				cuerpo
			});
			if (etags.size > MAX_ETAGS) {
				const primera = etags.keys().next();
				if (!primera.done) etags.delete(primera.value);
			}
		} else etags.delete(url);
		return cuerpo;
	}
	async function mutar(metodo, ruta, cuerpo) {
		const headers = {
			Accept: "application/json",
			"X-CH-Hub": "1"
		};
		const init = {
			method: metodo,
			credentials: "same-origin",
			cache: "no-store",
			headers
		};
		if (cuerpo !== void 0) {
			headers["Content-Type"] = "application/json";
			init.body = JSON.stringify(cuerpo);
		}
		let resp;
		try {
			resp = await fetch(ruta, init);
		} catch {
			throw errorDeRed();
		}
		if (!resp.ok) throw await errorDesdeRespuesta(resp);
		return leerCuerpo(resp);
	}
	async function aplicarUna(op) {
		const { metodo, ruta, cuerpo } = rutaDeOp(op);
		try {
			const r = await mutar(metodo, ruta, cuerpo);
			return {
				op_id: op.op_id,
				estado: "aplicada",
				estado_hub: "aplicada",
				objeto: esObjetoLocal(r) ? r : null,
				error: null
			};
		} catch (e) {
			const error = comoErrorHub(e);
			if (error.codigo === "conflicto") return {
				op_id: op.op_id,
				estado: "conflicto",
				estado_hub: "conflicto",
				objeto: error.vigente ?? null,
				error
			};
			return {
				op_id: op.op_id,
				estado: "error",
				estado_hub: null,
				objeto: null,
				error
			};
		}
	}
	return {
		tipo: "windows",
		async leer(clave, params) {
			return {
				datos: await getJson(urlDe(rutaDeConsulta(clave, params))),
				fuente: "hub",
				copia_at: null,
				con_cambios_pendientes: false
			};
		},
		obtener(ruta) {
			return getJson(ruta);
		},
		pedir(metodo, ruta, cuerpo) {
			return mutar(metodo, ruta, cuerpo);
		},
		async aplicarOps(ops, modo) {
			if (modo === "individual") {
				const salida = [];
				for (const op of ops) salida.push(await aplicarUna(op));
				return salida;
			}
			const salida = [];
			for (let i = 0; i < ops.length; i += 200) {
				const tramo = ops.slice(i, i + 200);
				try {
					const r = await mutar("POST", "/api/local/ops", { ops: tramo });
					if (!esOpsResponse(r)) throw new ErrorHub("error_interno", "Corte respondió algo que no esperábamos. Inténtalo de nuevo.", 200);
					const porId = new Map(r.resultados.map((x) => [x.op_id, x]));
					for (const op of tramo) {
						const x = porId.get(op.op_id);
						salida.push(x ? desdeOpsResultado(x) : {
							op_id: op.op_id,
							estado: "error",
							estado_hub: null,
							objeto: null,
							error: new ErrorHub("error_interno", "Corte no confirmó este cambio. Inténtalo de nuevo.", 200)
						});
					}
				} catch (e) {
					const error = comoErrorHub(e);
					for (const op of ops.slice(i)) salida.push({
						op_id: op.op_id,
						estado: "error",
						estado_hub: null,
						objeto: null,
						error
					});
					break;
				}
			}
			return salida;
		},
		conectarEventos(sumidero) {
			if (typeof EventSource === "undefined") return () => void 0;
			const fuente = new EventSource("/api/events");
			let huboCorte = false;
			const recibir = (nombre) => (ev) => {
				const e = leerEventoSse(nombre, ev instanceof MessageEvent && typeof ev.data === "string" ? ev.data : "");
				if (e) sumidero.evento(e);
			};
			const oyentes = TIPOS_EVENTO.map((t) => [t, recibir(t)]);
			for (const [t, fn] of oyentes) fuente.addEventListener(t, fn);
			const sinNombre = recibir("message");
			fuente.addEventListener("message", sinNombre);
			const alError = () => {
				huboCorte = true;
			};
			const alAbrir = () => {
				if (!huboCorte) return;
				huboCorte = false;
				sumidero.invalidar([]);
			};
			fuente.addEventListener("error", alError);
			fuente.addEventListener("open", alAbrir);
			return () => {
				for (const [t, fn] of oyentes) fuente.removeEventListener(t, fn);
				fuente.removeEventListener("message", sinNombre);
				fuente.removeEventListener("error", alError);
				fuente.removeEventListener("open", alAbrir);
				fuente.close();
			};
		},
		vigilarSync() {}
	};
}
var INTERVALO_SYNC_MS = 1500;
var ESPERA_OPS_MS = 2e3;
var TOPE_PETICION_MS = 3e4;
var TIPOS_OP = /* @__PURE__ */ new Set([
	"plan.crear",
	"plan.editar",
	"plan.borrar",
	"nota.crear",
	"nota.editar",
	"nota.borrar",
	"recordatorio.crear",
	"recordatorio.editar",
	"recordatorio.borrar",
	"aviso.crear",
	"aviso.editar",
	"plantilla.editar",
	"preferencias.editar"
]);
function esObjeto$2(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
function esOp(v) {
	return esObjeto$2(v) && typeof v["op_id"] === "string" && typeof v["tipo"] === "string" && TIPOS_OP.has(v["tipo"]);
}
function esSnapshot(v) {
	return esObjeto$2(v) && v["version_esquema"] === 1 && Array.isArray(v["muestras"]) && esObjeto$2(v["local"]);
}
/** MuestraVista mínima (lo necesario para dominio.aplicarLocal). */
function esMuestra(v) {
	return esObjeto$2(v) && typeof v["application_id"] === "string" && esObjeto$2(v["avance"]) && esObjeto$2(v["avisos"]);
}
function esSyncEstado(v) {
	return esObjeto$2(v) && typeof v["en_curso"] === "boolean" && Array.isArray(v["pasos"]);
}
function leerResultadoOps(v) {
	if (!esObjeto$2(v) || typeof v["op_id"] !== "string") return null;
	const estado = v["estado"];
	if (estado !== "aplicada" && estado !== "duplicada" && estado !== "conflicto" && estado !== "invalida") return null;
	const r = {
		op_id: v["op_id"],
		estado
	};
	if (esObjetoLocal(v["objeto"])) r.objeto = v["objeto"];
	if (typeof v["error"] === "string") r.error = v["error"];
	return r;
}
function puenteObligatorio() {
	const p = puenteAndroid();
	if (!p) throw new ErrorHub("error_interno", "Falta la capa de Android de Corte.", 0);
	return p;
}
/** Ops que la capa nativa aún no confirma con el hub. */
function leerPendientes() {
	const p = puenteAndroid();
	if (!p) return [];
	try {
		const v = JSON.parse(p.opsPendientes());
		return Array.isArray(v) ? v.filter(esOp) : [];
	} catch {
		return [];
	}
}
/** Superpone la copia con ops (ya aplicadas por aplicarOpsACopia) a una respuesta del hub. */
function superponerPendientes(clave, params, datos, local, hoy) {
	if (!esObjeto$2(datos)) return datos;
	const recalcular = (m) => dom.aplicarLocal(m, local.planes, local.avisos, hoy);
	const filtrar = (lista) => lista.filter((o) => entraEnConsulta(clave, params, o));
	switch (clave) {
		case "muestras": {
			const items = datos["items"];
			return Array.isArray(items) ? {
				...datos,
				items: items.map((m) => esMuestra(m) ? recalcular(m) : m)
			} : datos;
		}
		case "muestra": {
			const m = datos["muestra"];
			if (!esMuestra(m)) return datos;
			const id = m.application_id;
			return {
				...datos,
				muestra: recalcular(m),
				planes: local.planes.filter((p) => p.application_id === id),
				avisos: local.avisos.filter((a) => a.solicitud_ids.includes(id)),
				notas: local.notas.filter((n) => n.entidad === "muestra" && n.entidad_id === id),
				recordatorios: local.recordatorios.filter((r) => r.entidad === "muestra" && r.entidad_id === id)
			};
		}
		case "plan": return {
			...datos,
			items: filtrar(local.planes)
		};
		case "avisos": return {
			...datos,
			items: filtrar(local.avisos)
		};
		case "notas": return {
			...datos,
			items: filtrar(local.notas)
		};
		case "recordatorios": return {
			...datos,
			items: filtrar(local.recordatorios)
		};
		case "plantillas": return {
			...datos,
			items: local.plantillas
		};
		case "preferencias": return local.preferencias;
		default: return datos;
	}
}
var CLAVES_SUPERPUESTAS = /* @__PURE__ */ new Set([
	...CLAVES_LOCALES,
	"muestras",
	"muestra"
]);
function crearTransporteAndroid() {
	let copia = null;
	let etagCopia = null;
	let copiaVieja = true;
	let pidiendoCopia = null;
	let sumideroActual = null;
	let sondeo = null;
	async function pedirCopia() {
		const headers = { Accept: "application/json" };
		if (etagCopia && copia) headers["If-None-Match"] = etagCopia;
		let resp;
		try {
			resp = await fetch("/api/snapshot", {
				method: "GET",
				cache: "no-store",
				headers
			});
		} catch {
			return copia;
		}
		if (resp.status === 304 && copia) {
			copiaVieja = false;
			return copia;
		}
		if (!resp.ok || resp.headers.get("X-CH-Fuente") === "sin_conexion") return copia;
		try {
			const v = await resp.json();
			if (!esSnapshot(v)) return copia;
			copia = v;
			etagCopia = resp.headers.get("ETag");
			copiaVieja = false;
			registrarMetaDe(v);
			return v;
		} catch {
			return copia;
		}
	}
	/** La copia sin conexión (en memoria; se revalida con If-None-Match cuando llega creatorhub-copia). */
	function obtenerCopia() {
		if (copia && !copiaVieja) return Promise.resolve(copia);
		if (!pidiendoCopia) pidiendoCopia = pedirCopia().finally(() => {
			pidiendoCopia = null;
		});
		return pidiendoCopia;
	}
	async function desdeCopia(clave, params, pendientes) {
		const c = await obtenerCopia();
		if (!c) throw necesitaPc$1();
		const hoy = dom.hoyLocal();
		const conOps = pendientes.length > 0 ? dom.aplicarOpsACopia(c, pendientes, hoy) : c;
		const armada = dom.deCopia(clave, params, conOps, hoy);
		if (armada === null) throw necesitaPc$1();
		return {
			datos: armada,
			fuente: "copia",
			copia_at: c.generado_at,
			con_cambios_pendientes: pendientes.length > 0
		};
	}
	async function getHub(url) {
		try {
			const resp = await fetch(url, {
				method: "GET",
				cache: "no-store",
				headers: { Accept: "application/json" }
			});
			return {
				resp,
				sinConexion: resp.headers.get("X-CH-Fuente") === "sin_conexion"
			};
		} catch {
			return {
				resp: null,
				sinConexion: true
			};
		}
	}
	function conectado() {
		return estadoConexionPc()?.conectado === true;
	}
	async function peticion(metodo, ruta, cuerpo) {
		if (!conectado()) throw necesitaPc$1();
		const p = puenteObligatorio();
		const id = nuevoIdPedido();
		const respuesta = await new Promise((resolve) => {
			let hecho = false;
			const fin = (v) => {
				if (hecho) return;
				hecho = true;
				clearTimeout(t);
				quitar();
				resolve(v);
			};
			const quitar = escucharAndroid("creatorhub-respuesta", (d) => d["id"] === id && typeof d["status"] === "number" ? {
				status: d["status"],
				cuerpo: typeof d["cuerpo"] === "string" ? d["cuerpo"] : ""
			} : null, fin);
			const t = setTimeout(() => fin(null), TOPE_PETICION_MS);
			try {
				p.peticion(metodo, ruta, cuerpo === void 0 ? "" : JSON.stringify(cuerpo), id);
			} catch {
				fin(null);
			}
		});
		if (!respuesta || respuesta.status === 0) throw new ErrorHub("red", TEXTO_RED_ANDROID, 0);
		if (respuesta.status >= 200 && respuesta.status < 300) {
			if (respuesta.cuerpo === "") return null;
			try {
				return JSON.parse(respuesta.cuerpo);
			} catch {
				return null;
			}
		}
		const error = errorDesdeCuerpo(respuesta.status, respuesta.cuerpo);
		if (respuesta.status === 503 && (error.codigo === "error_interno" || error.codigo === "sin_internet")) throw necesitaPc$1();
		throw error;
	}
	function esperarResultados(ids, tope_ms) {
		const encontrados = /* @__PURE__ */ new Map();
		let quitar = () => void 0;
		let t = null;
		let resolver = () => void 0;
		const promesa = new Promise((resolve) => {
			resolver = resolve;
		});
		const fin = () => {
			if (t) clearTimeout(t);
			quitar();
			resolver(encontrados);
		};
		quitar = escucharAndroid("creatorhub-ops", (d) => Array.isArray(d["resultados"]) ? d["resultados"].map(leerResultadoOps).filter((r) => r !== null) : null, (lista) => {
			for (const r of lista) if (ids.has(r.op_id)) encontrados.set(r.op_id, r);
			if (encontrados.size >= ids.size) fin();
		});
		t = setTimeout(fin, tope_ms);
		return {
			promesa,
			cancelar: fin
		};
	}
	async function sondearSync() {
		const { resp, sinConexion } = await getHub("/api/sync/estado");
		if (!resp || sinConexion || !resp.ok) return;
		let v;
		try {
			v = await resp.json();
		} catch {
			return;
		}
		if (!esSyncEstado(v)) return;
		sumideroActual?.evento({
			tipo: v.en_curso ? "sync.progreso" : "sync.fin",
			estado: v
		});
		if (!v.en_curso) detenerSondeo();
	}
	function detenerSondeo() {
		if (sondeo) clearInterval(sondeo);
		sondeo = null;
	}
	function vigilarSync() {
		if (sondeo) return;
		sondeo = setInterval(() => void sondearSync(), INTERVALO_SYNC_MS);
		sondearSync();
	}
	return {
		tipo: "android",
		async leer(clave, params) {
			if (clave === "display") throw soloEnPc();
			const pendientes = leerPendientes();
			const { resp, sinConexion } = await getHub(urlDe(rutaDeConsulta(clave, params)));
			if (!resp || sinConexion) return desdeCopia(clave, params, pendientes);
			if (!resp.ok) throw await errorDesdeRespuesta(resp);
			let datos;
			try {
				datos = await resp.json();
			} catch {
				throw new ErrorHub("error_interno", "Tu PC respondió algo que no esperábamos. Inténtalo de nuevo.", resp.status);
			}
			const desdeArchivo = resp.headers.get("X-CH-Fuente") === "copia";
			const copiaAtCabecera = Number(resp.headers.get("X-CH-Copia-At"));
			let conPendientes = false;
			if (pendientes.length > 0 && CLAVES_SUPERPUESTAS.has(clave)) {
				const c = await obtenerCopia();
				if (c) {
					const hoy = dom.hoyLocal();
					const base = {
						...c,
						local: {
							...c.local,
							...listasDe(clave, datos)
						}
					};
					const conOps = dom.aplicarOpsACopia(base, pendientes, hoy);
					datos = superponerPendientes(clave, params, datos, conOps.local, hoy);
					conPendientes = true;
				}
			}
			return {
				datos,
				fuente: desdeArchivo ? "copia" : "hub",
				copia_at: desdeArchivo && Number.isFinite(copiaAtCabecera) && copiaAtCabecera > 0 ? copiaAtCabecera : null,
				con_cambios_pendientes: conPendientes
			};
		},
		async obtener(ruta) {
			if (ruta !== "/api/sync/estado") throw soloEnPc();
			const { resp, sinConexion } = await getHub(ruta);
			if (!resp || sinConexion) throw necesitaPc$1();
			if (!resp.ok) throw await errorDesdeRespuesta(resp);
			return await resp.json();
		},
		async pedir(metodo, ruta, cuerpo) {
			if (!(metodo === "POST" && (ruta === "/api/sync" || /^\/api\/plantillas\/[^/]+\/restaurar$/.test(ruta)))) throw soloEnPc();
			return peticion(metodo, ruta, cuerpo);
		},
		async aplicarOps(ops) {
			const p = puenteObligatorio();
			const espera = conectado() ? esperarResultados(new Set(ops.map((o) => o.op_id)), ESPERA_OPS_MS) : null;
			let aceptadas = 0;
			try {
				const v = JSON.parse(p.ops(JSON.stringify(ops)));
				aceptadas = esObjeto$2(v) && typeof v["aceptadas"] === "number" ? v["aceptadas"] : 0;
			} catch {
				aceptadas = 0;
			}
			if (aceptadas < ops.length) {
				espera?.cancelar();
				const error = new ErrorHub("error_interno", "No pudimos guardar el cambio en tu celular. Inténtalo de nuevo.", 0);
				return ops.map((op) => ({
					op_id: op.op_id,
					estado: "error",
					estado_hub: null,
					objeto: null,
					error
				}));
			}
			const resultados = espera ? await espera.promesa : /* @__PURE__ */ new Map();
			return ops.map((op) => {
				const r = resultados.get(op.op_id);
				if (!r) return {
					op_id: op.op_id,
					estado: "en_cola",
					estado_hub: null,
					objeto: null,
					error: null
				};
				const t = desdeOpsResultado(r);
				if (t.estado === "conflicto" && t.error) return {
					...t,
					error: new ErrorHub("conflicto", TEXTO_CONFLICTO, 409, void 0, void 0, t.objeto ?? void 0)
				};
				return t;
			});
		},
		conectarEventos(sumidero) {
			sumideroActual = sumidero;
			let versiones = null;
			let estabaConectado = conectado();
			const quitarCopia = escucharAndroid("creatorhub-copia", (d) => typeof d["data_version"] === "number" && typeof d["local_rev"] === "number" ? {
				dv: d["data_version"],
				lr: d["local_rev"],
				ir: typeof d["img_rev"] === "number" ? d["img_rev"] : 0,
				sync: d["sync_en_curso"] === true
			} : null, (c) => {
				copiaVieja = true;
				const previo = versiones;
				versiones = {
					dv: c.dv,
					lr: c.lr,
					ir: c.ir
				};
				const secciones = [];
				if (!previo || previo.dv !== c.dv) secciones.push("muestras", "ordenes", "productos", "tiendas", "videos", "cuenta");
				if (!previo || previo.lr !== c.lr) secciones.push("local");
				if (!previo || previo.ir !== c.ir) secciones.push("productos", "videos", "tiendas", "muestras");
				if (secciones.length > 0) sumidero.evento({
					tipo: "datos.cambiaron",
					data_version: c.dv,
					local_rev: c.lr,
					secciones: [...new Set(secciones)],
					img_rev: c.ir
				});
				if (c.sync) vigilarSync();
			});
			const quitarOps = escucharAndroid("creatorhub-ops", (d) => Array.isArray(d["resultados"]) ? true : null, () => sumidero.invalidar([...CLAVES_LOCALES, ...clavesDeSecciones(["local"])]));
			const quitarConexion = escucharAndroid("creatorhub-conexion", (d) => ({
				conectado: d["conectado"] === true,
				sync: d["sync_en_curso"] === true
			}), (c) => {
				if (c.sync) vigilarSync();
				if (c.conectado !== estabaConectado) {
					estabaConectado = c.conectado;
					copiaVieja = true;
					sumidero.invalidar(TODAS_LAS_CLAVES);
				}
			});
			if (estadoConexionPc()?.sync_en_curso) vigilarSync();
			return () => {
				quitarCopia();
				quitarOps();
				quitarConexion();
				detenerSondeo();
				sumideroActual = null;
			};
		},
		vigilarSync
	};
}
/** Listas del bloque `local` de la copia que trae una respuesta del hub (para superponer la cola encima). */
function listasDe(clave, datos) {
	if (!esObjeto$2(datos)) return {};
	const items = datos["items"];
	switch (clave) {
		case "plan": return Array.isArray(items) ? { planes: items.filter((x) => esObjetoLocal(x)) } : {};
		case "avisos": return Array.isArray(items) ? { avisos: items.filter((x) => esObjetoLocal(x)) } : {};
		case "notas": return Array.isArray(items) ? { notas: items.filter((x) => esObjetoLocal(x)) } : {};
		case "recordatorios": return Array.isArray(items) ? { recordatorios: items.filter((x) => esObjetoLocal(x)) } : {};
		case "plantillas": return Array.isArray(items) ? { plantillas: items.filter((x) => esObjetoLocal(x)) } : {};
		case "preferencias": return esObjetoLocal(datos) && "capacidad_videos_dia" in datos ? { preferencias: datos } : {};
		default: return {};
	}
}
var actual = null;
async function crearTransporte() {
	if (puenteAndroid() !== null) return crearTransporteAndroid();
	return crearTransporteWindows();
}
function obtenerTransporte() {
	if (!actual) actual = crearTransporte();
	return actual;
}
var entradas = /* @__PURE__ */ new Map();
var oyentes$3 = /* @__PURE__ */ new Map();
var enCurso$1 = /* @__PURE__ */ new Map();
var generaciones = /* @__PURE__ */ new Map();
function emitir(k) {
	for (const fn of [...oyentes$3.get(k) ?? []]) fn();
}
function nueva$1(clave, params) {
	return {
		clave,
		params,
		datos: void 0,
		error: null,
		fuente: "hub",
		copia_at: null,
		pendientes: false,
		pidiendo: false,
		vieja: false
	};
}
function fijar$1(k, clave, params, cambios) {
	const previa = entradas.get(k) ?? nueva$1(clave, params);
	entradas.set(k, {
		...previa,
		...cambios
	});
	emitir(k);
}
function leerEntrada(k) {
	return entradas.get(k);
}
function suscribirEntrada(k, fn) {
	let set = oyentes$3.get(k);
	if (!set) {
		set = /* @__PURE__ */ new Set();
		oyentes$3.set(k, set);
	}
	set.add(fn);
	return () => {
		const s = oyentes$3.get(k);
		s?.delete(fn);
		if (s && s.size === 0) oyentes$3.delete(k);
	};
}
function tieneOyentes(k) {
	return (oyentes$3.get(k)?.size ?? 0) > 0;
}
function siguienteGeneracion(k) {
	const g = (generaciones.get(k) ?? 0) + 1;
	generaciones.set(k, g);
	return g;
}
/** Pide (o reutiliza el pedido en curso de) una consulta. Nunca rechaza: el error queda en la entrada. */
function ejecutar(clave, params) {
	const k = claveCache(clave, params);
	const actual = enCurso$1.get(k);
	if (actual) return actual;
	const gen = siguienteGeneracion(k);
	fijar$1(k, clave, params, {
		pidiendo: true,
		vieja: false
	});
	const pedir = async () => {
		try {
			const l = await (await obtenerTransporte()).leer(clave, params);
			registrarMetaDe(l.datos);
			if (generaciones.get(k) !== gen) return;
			fijar$1(k, clave, params, {
				datos: l.datos,
				error: null,
				fuente: l.fuente,
				copia_at: l.copia_at,
				pendientes: l.con_cambios_pendientes,
				pidiendo: false
			});
		} catch (e) {
			if (generaciones.get(k) !== gen) return;
			fijar$1(k, clave, params, {
				error: comoErrorHub(e),
				pidiendo: false
			});
		}
	};
	const promesa = pedir().finally(() => {
		if (enCurso$1.get(k) === promesa) enCurso$1.delete(k);
	});
	enCurso$1.set(k, promesa);
	return promesa;
}
/** Marca viejas las entradas de esas claves (todas si la lista está vacía). */
function invalidarClaves(claves) {
	const filtro = claves.length > 0 ? new Set(claves) : null;
	for (const [k, e] of [...entradas]) {
		if (filtro && !filtro.has(e.clave)) continue;
		if (tieneOyentes(k)) {
			if (!e.vieja) fijar$1(k, e.clave, e.params, { vieja: true });
		} else {
			siguienteGeneracion(k);
			enCurso$1.delete(k);
			entradas.delete(k);
		}
	}
}
/** Entradas con datos de una clave (para la superposición optimista y para buscar objetos del estado local). */
function entradasDe(clave) {
	return [...entradas].filter(([, e]) => e.clave === clave && e.datos !== void 0);
}
/**
* Reemplaza los datos de una entrada sin pedirlos (optimismo). Descarta la respuesta en vuelo (si la hay) y deja la
* entrada marcada para volver a pedirse cuando se invalide. Devuelve la entrada previa para revertir.
*/
function parchearEntrada(k, datos) {
	const previa = entradas.get(k);
	if (!previa) return null;
	if (previa.pidiendo) {
		siguienteGeneracion(k);
		enCurso$1.delete(k);
	}
	entradas.set(k, {
		...previa,
		datos,
		pendientes: true,
		pidiendo: false,
		vieja: previa.vieja || previa.pidiendo
	});
	emitir(k);
	return previa;
}
/**
* rev. 5 · Escribe datos FRESCOS que llegaron completos por otro camino (evento 'display.cambio', respuesta de una
* acción del hub): descarta la lectura en vuelo y deja la entrada al día, sin volver a pedirla.
*/
function escribirEntrada(clave, params, datos) {
	const k = claveCache(clave, params);
	siguienteGeneracion(k);
	enCurso$1.delete(k);
	fijar$1(k, clave, params, {
		datos,
		error: null,
		fuente: "hub",
		copia_at: null,
		pendientes: false,
		pidiendo: false,
		vieja: false
	});
}
/** Revierte un parche si nadie volvió a escribir esa entrada desde entonces. */
function revertirEntrada(k, previa, parchados) {
	const actual = entradas.get(k);
	if (!actual || actual.datos !== parchados) return;
	entradas.set(k, {
		...actual,
		datos: previa.datos,
		pendientes: previa.pendientes
	});
	emitir(k);
}
/**
* @/datos · motor de eventos y refresco (BUILD_SPEC §8.3, §6.3.3). Se enciende con la primera consulta o suscripción:
* Windows = SSE /api/events; Android = eventos de la capa nativa (creatorhub-copia → datos.cambiaron, sondeo de
* /api/sync/estado durante una sync); demo = secuencia del escenario.
* `datos.cambiaron` (también por img_rev) invalida SOLO las claves de sus secciones, con antirrebote de 2 s (y como
* máximo 10 s de espera si los avisos no paran), para que un lote de imágenes no provoque una ola de peticiones.
*/
var ANTIRREBOTE_MS = 2e3;
var ESPERA_MAXIMA_MS = 1e4;
var pendientes = null;
var temporizador = null;
var primeraAt = null;
function vaciarPendientes() {
	const p = pendientes;
	pendientes = null;
	primeraAt = null;
	if (temporizador) clearTimeout(temporizador);
	temporizador = null;
	if (p === "todas") invalidarClaves([]);
	else if (p && p.size > 0) invalidarClaves([...p]);
}
/** Junta claves a invalidar y las invalida juntas 2 s después del último aviso (máx. 10 s desde el primero). [] = todas. */
function programarInvalidacion(claves) {
	if (claves.length === 0) pendientes = "todas";
	else if (pendientes !== "todas") {
		const set = pendientes ?? /* @__PURE__ */ new Set();
		for (const c of claves) set.add(c);
		pendientes = set;
	}
	const t = Date.now();
	if (primeraAt === null) primeraAt = t;
	if (temporizador) clearTimeout(temporizador);
	const espera = Math.max(0, Math.min(ANTIRREBOTE_MS, primeraAt + ESPERA_MAXIMA_MS - t));
	temporizador = setTimeout(vaciarPendientes, espera);
}
var estadoSync = null;
var oyentesSync = /* @__PURE__ */ new Set();
function fijarEstadoSync(e) {
	estadoSync = e;
	for (const fn of [...oyentesSync]) fn();
}
function suscribirSync(fn) {
	oyentesSync.add(fn);
	return () => {
		oyentesSync.delete(fn);
	};
}
function leerSync() {
	return estadoSync;
}
/** Último SyncEstado que llegó por eventos (null si aún no llega ninguno). */
function useEstadoSyncEventos() {
	return (0, import_react.useSyncExternalStore)(suscribirSync, leerSync, leerSync);
}
var manejadores = /* @__PURE__ */ new Set();
var encendido = null;
var ultimoImgRev = null;
function recibirEvento(e) {
	for (const m of [...manejadores]) try {
		m(e);
	} catch {}
	switch (e.tipo) {
		case "datos.cambiaron": {
			const claves = clavesDeSecciones(e.secciones);
			if (e.img_rev !== void 0 && e.img_rev !== ultimoImgRev) {
				ultimoImgRev = e.img_rev;
				claves.push(...CLAVES_CON_IMAGENES);
			}
			programarInvalidacion(claves);
			break;
		}
		case "sync.progreso":
			fijarEstadoSync(e.estado);
			break;
		case "sync.fin":
			fijarEstadoSync(e.estado);
			programarInvalidacion([
				"sesion",
				"sync_historial",
				"sync_cobertura"
			]);
			break;
		case "conexion.cambio":
			programarInvalidacion(["sesion", "credenciales"]);
			break;
		case "display.cambio": escribirEntrada("display", {}, e.display);
	}
}
/** Enciende el motor una sola vez (idempotente). */
function iniciarMotor() {
	if (encendido) return;
	encendido = obtenerTransporte().then((t) => {
		t.conectarEventos({
			evento: recibirEvento,
			invalidar: programarInvalidacion
		});
	}).catch(() => {
		encendido = null;
	});
}
/** Windows: SSE /api/events. Android: los eventos que traduce la capa nativa. Se desuscribe al desmontar. */
function useEventoHub(manejador) {
	const ref = (0, import_react.useRef)(manejador);
	ref.current = manejador;
	(0, import_react.useEffect)(() => {
		iniciarMotor();
		const m = (e) => ref.current(e);
		manejadores.add(m);
		return () => {
			manejadores.delete(m);
		};
	}, []);
}
function esObjeto$1(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
function respuestaInvalida() {
	return new ErrorHub("error_interno", "Corte respondió algo que no esperábamos. Inténtalo de nuevo.", 0);
}
/** Valida lo mínimo de la respuesta (objeto con las claves indicadas) y la tipa. */
function como(v, ...claves) {
	if (!esObjeto$1(v) || !claves.every((k) => k in v)) throw respuestaInvalida();
	return v;
}
async function pedir(metodo, ruta, cuerpo, invalida) {
	const t = await obtenerTransporte();
	try {
		return await t.pedir(metodo, ruta, cuerpo);
	} finally {
		if (invalida.length > 0) invalidarClaves(invalida);
	}
}
async function obtener(ruta) {
	return (await obtenerTransporte()).obtener(ruta);
}
var e = (s) => encodeURIComponent(s);
var hub = {
	async sincronizar(tipo) {
		const r = como(await pedir("POST", "/api/sync", tipo ? { tipo } : {}, ["sesion"]), "sync_id", "estado");
		(await obtenerTransporte()).vigilarSync();
		return r;
	},
	async cancelarSync() {
		return como(await pedir("POST", "/api/sync/cancelar", void 0, ["sesion"]), "en_curso");
	},
	async authLink(abrirNavegador) {
		return como(await pedir("POST", "/api/auth/link", { abrir_navegador: abrirNavegador }, []), "url", "state");
	},
	async authPortapapeles() {
		return como(await obtener("/api/auth/portapapeles"), "detectado");
	},
	async authCanjear(req) {
		return como(await pedir("POST", "/api/auth/canjear", req, ["sesion", "credenciales"]), "conexion");
	},
	async authRefrescar() {
		return como(await pedir("POST", "/api/auth/refrescar", void 0, ["sesion"]), "conexion");
	},
	async authDesconectar(req) {
		const r = como(await pedir("POST", "/api/auth/desconectar", req, ["sesion", "credenciales"]), "conexion");
		if (req.borrar_datos) invalidarClaves([]);
		return r;
	},
	async importarCredenciales(req) {
		return como(await pedir("POST", "/api/credenciales/importar", req, ["sesion", "credenciales"]), "importado");
	},
	async guardarAppSecret(appSecret) {
		return como(await pedir("PUT", "/api/credenciales/app-secret", { app_secret: appSecret }, ["sesion", "credenciales"]), "app_key");
	},
	async borrarLegado() {
		return como(await pedir("POST", "/api/credenciales/legado/borrar", { confirmar: true }, ["credenciales"]), "resultado");
	},
	async lanActivar(activo) {
		return como(await pedir("POST", "/api/lan/activar", { activo }, [
			"lan",
			"sesion",
			"firewall"
		]), "activo");
	},
	async lanCambiar(cambios) {
		return como(await pedir("PATCH", "/api/lan/estado", cambios, ["lan"]), "activo");
	},
	async lanEmparejar() {
		return como(await pedir("POST", "/api/lan/emparejar", void 0, []), "pair_id");
	},
	async lanEstadoEmparejamiento(pairId) {
		return como(await obtener(`/api/lan/emparejar/${e(pairId)}`), "pair_id", "estado");
	},
	async lanDecidir(pairId, decision) {
		return como(await pedir("POST", `/api/lan/emparejar/${e(pairId)}/decision`, decision, ["lan", "sesion"]), "pair_id", "estado");
	},
	async lanCambiarDispositivo(deviceId, cambios) {
		return como(await pedir("PATCH", `/api/lan/dispositivos/${e(deviceId)}`, cambios, ["lan"]), "device_id");
	},
	async lanRevocar(deviceId) {
		await pedir("DELETE", `/api/lan/dispositivos/${e(deviceId)}`, void 0, ["lan", "sesion"]);
	},
	async firewallDiagnostico() {
		return como(await obtener("/api/lan/firewall"), "estado");
	},
	async firewallConfigurar(req) {
		return como(await pedir("POST", "/api/lan/firewall", req, ["firewall", "lan"]), "resultado");
	},
	async ajustesPc(cambios) {
		return como(await pedir("PATCH", "/api/ajustes/pc", cambios, ["ajustes_pc"]), "sync_auto");
	},
	async borrarDatos(req) {
		await pedir("POST", "/api/datos/borrar", req, []);
		invalidarClaves([]);
	},
	async exportarLocal() {
		return como(await obtener("/api/local/exportar"), "formato", "planes");
	},
	async importarLocal(ruta) {
		if (typeof ruta !== "string" || ruta.trim() === "") throw new ErrorHub("archivo_no_encontrado", "Elige un archivo para importar.", 0);
		return como(await pedir("POST", "/api/local/importar", { ruta }, [
			"plan",
			"avisos",
			"notas",
			"recordatorios",
			"plantillas",
			"preferencias",
			"muestras",
			"muestra",
			"tiendas",
			"tienda",
			"dashboard"
		]), "importados");
	},
	async displayCredenciales(req) {
		const r = await pedir("PUT", "/api/display/credenciales", {
			client_key: req.client_key,
			client_secret: req.client_secret
		}, []);
		if (!esEstadoDisplay(r)) throw respuestaInvalida();
		escribirEntrada("display", {}, r);
		return r;
	},
	async displayConectar(req) {
		return como(await pedir("POST", "/api/display/conectar", req?.abrir_navegador ? { abrir_navegador: true } : {}, ["display"]), "url", "expira_at");
	},
	async displayDesconectar(req) {
		const r = como(await pedir("POST", "/api/display/desconectar", {
			...req.borrar_datos ? { borrar_datos: true } : {},
			...req.olvidar_app ? { olvidar_app: true } : {}
		}, req.borrar_datos ? [
			"videos",
			"video",
			"producto",
			"muestra",
			"dashboard"
		] : []), "display", "revocado");
		if (esEstadoDisplay(r.display)) escribirEntrada("display", {}, r.display);
		return r;
	}
};
/**
* @/datos · consultas tipadas (spec/ui_firmas/datos.d.ts): useConsulta / consultar / invalidar, useSesion, useSync,
* useConexionPc y los atajos de imágenes sobre dominio.registroImagenes (C47).
*/
var SIN_ENTRADA = void 0;
function estaFresca(e) {
	return e !== void 0 && e.datos !== void 0 && e.error === null && !e.vieja && !e.pidiendo;
}
/**
* Lee una ruta GET. Se vuelve a pedir sola con 'datos.cambiaron' (Windows: SSE) o 'creatorhub-copia' (Android).
* Las respuestas con meta_imagenes se registran solas para <Foto>.
*/
function useConsulta(clave, params, opciones) {
	const activa = opciones?.activa ?? true;
	const k = claveCache(clave, params);
	const ultimos = (0, import_react.useRef)({
		clave,
		params
	});
	ultimos.current = {
		clave,
		params
	};
	const suscribir = (0, import_react.useCallback)((fn) => suscribirEntrada(k, fn), [k]);
	const leer = (0, import_react.useCallback)(() => leerEntrada(k), [k]);
	const e = (0, import_react.useSyncExternalStore)(suscribir, leer, () => SIN_ENTRADA);
	const necesita = activa && (e === void 0 || !e.pidiendo && (e.vieja || e.datos === void 0 && e.error === null));
	(0, import_react.useEffect)(() => {
		iniciarMotor();
	}, []);
	(0, import_react.useEffect)(() => {
		if (necesita) ejecutar(ultimos.current.clave, ultimos.current.params);
	}, [k, necesita]);
	const refrescar = (0, import_react.useCallback)(() => ejecutar(ultimos.current.clave, ultimos.current.params), [k]);
	return (0, import_react.useMemo)(() => {
		const datos = e?.datos;
		const sinDatos = datos === void 0;
		return {
			datos,
			cargando: activa && sinDatos && (e?.error ?? null) === null,
			refrescando: (e?.pidiendo ?? false) && !sinDatos,
			error: e?.error ?? null,
			fuente: e?.fuente ?? "hub",
			copia_at: e?.fuente === "copia" ? e.copia_at : null,
			con_cambios_pendientes: e?.pendientes ?? false,
			refrescar
		};
	}, [
		e,
		activa,
		refrescar
	]);
}
/** Igual que useConsulta pero fuera de React (búsqueda global, exportar CSV). Rechaza con ErrorHub. */
async function consultar(clave, params) {
	iniciarMotor();
	const k = claveCache(clave, params);
	for (let intento = 0; intento < 3; intento += 1) {
		if (!estaFresca(leerEntrada(k))) await ejecutar(clave, params);
		const e = leerEntrada(k);
		if (!e || e.datos === void 0 && e.error === null) continue;
		if (e.error) throw e.error;
		return e.datos;
	}
	throw new ErrorHub("error_interno", "No pudimos leer tus datos. Inténtalo de nuevo.", 0);
}
/** Marca como viejas las consultas indicadas (todas si no se pasa ninguna). */
function invalidar(...claves) {
	invalidarClaves(claves);
}
function useSesion() {
	return useConsulta("sesion", {});
}
function useSync() {
	const sesion = useSesion();
	const deEventos = useEstadoSyncEventos();
	const conexion = useConexionPc();
	const android = esAndroid();
	const estado = deEventos ?? sesion.datos?.sync ?? null;
	const puede = (sesion.datos?.capacidades.sincronizar ?? false) && (!android || conexion !== null && conexion.conectado && !conexion.revocado);
	const sincronizar = (0, import_react.useCallback)(async (tipo) => {
		fijarEstadoSync((await hub.sincronizar(tipo)).estado);
	}, []);
	const cancelar = (0, import_react.useCallback)(async () => {
		fijarEstadoSync(await hub.cancelarSync());
	}, []);
	return (0, import_react.useMemo)(() => ({
		estado,
		puede,
		sincronizar,
		cancelar
	}), [
		estado,
		puede,
		sincronizar,
		cancelar
	]);
}
var conexion;
function leerConexion() {
	if (conexion === void 0) conexion = estadoConexionPc();
	return conexion;
}
function suscribirConexion(fn) {
	leerConexion();
	return alCambiarConexionPc((e) => {
		conexion = e;
		fn();
	});
}
/** null en Windows y en el navegador. */
function useConexionPc() {
	return (0, import_react.useSyncExternalStore)(suscribirConexion, leerConexion, leerConexion);
}
function suscribirRegistro(fn) {
	return dom.registroImagenes.suscribir(fn);
}
function versionRegistro() {
	return dom.registroImagenes.version();
}
/** Atajo sobre dominio.registroImagenes: se vuelve a pintar cuando llega el meta de esa URL. */
function useMetaImagen$1(url) {
	(0, import_react.useSyncExternalStore)(suscribirRegistro, versionRegistro, versionRegistro);
	return dom.registroImagenes.leer(url);
}
/**
* @/datos · listas estables y novedades (01 §3.5 y §4.16).
* - useListaEstable: la lista visible NUNCA se reordena sola. Conserva el orden que el usuario ya ve, actualiza el
*   contenido de cada fila, quita las que desaparecen y agrega al final las nuevas; si el orden que llegó es otro,
*   `hayOrdenNuevo` ("Hay un orden nuevo · Actualizar") hasta aplicarOrdenNuevo().
* - useNovedades: "Nuevo desde tu última visita" (punto azul) con una huella por fila guardada en este equipo
*   (localStorage, siempre con try/catch; si no hay almacenamiento, en memoria).
*/
function mismoOrden(a, b) {
	return a.length === b.length && a.every((x, i) => x === b[i]);
}
/** Nunca reordena sola la lista visible: conserva el orden y solo actualiza el contenido de cada fila. */
function useListaEstable(items, id) {
	const orden = (0, import_react.useRef)(null);
	const [version, forzar] = (0, import_react.useReducer)((n) => n + 1, 0);
	const idRef = (0, import_react.useRef)(id);
	idRef.current = id;
	const { visibles, entrantes } = (0, import_react.useMemo)(() => {
		const lista = items ?? [];
		const ids = lista.map((t) => idRef.current(t));
		if (items === void 0) return {
			visibles: [],
			entrantes: ids
		};
		const previo = orden.current;
		if (previo === null) return {
			visibles: lista,
			entrantes: ids
		};
		const porId = new Map(lista.map((t, i) => [ids[i] ?? "", t]));
		const conocidos = new Set(previo);
		const salida = [];
		for (const i of previo) {
			const t = porId.get(i);
			if (t !== void 0) salida.push(t);
		}
		lista.forEach((t, i) => {
			if (!conocidos.has(ids[i] ?? "")) salida.push(t);
		});
		return {
			visibles: salida,
			entrantes: ids
		};
	}, [items, version]);
	const idsVisibles = visibles.map((t) => idRef.current(t));
	if (items !== void 0) orden.current = idsVisibles;
	return {
		items: visibles,
		hayOrdenNuevo: items !== void 0 && !mismoOrden(idsVisibles, entrantes),
		aplicarOrdenNuevo: (0, import_react.useCallback)(() => {
			orden.current = null;
			forzar();
		}, [])
	};
}
var PREFIJO$1 = "corte.novedades.";
var MAX_HUELLAS = 2e3;
var enMemoria$1 = /* @__PURE__ */ new Map();
function leerHuellas(seccion) {
	try {
		const crudo = window.localStorage.getItem(PREFIJO$1 + seccion);
		if (crudo !== null) {
			const v = JSON.parse(crudo);
			if (v !== null && typeof v === "object" && !Array.isArray(v)) {
				const salida = {};
				for (const [k, x] of Object.entries(v)) if (typeof x === "string") salida[k] = x;
				return salida;
			}
		}
	} catch {}
	return enMemoria$1.get(seccion) ?? null;
}
function guardarHuellas(seccion, huellas) {
	const claves = Object.keys(huellas);
	const recortadas = claves.length > MAX_HUELLAS ? Object.fromEntries(claves.slice(-2e3).map((k) => [k, huellas[k] ?? ""])) : huellas;
	enMemoria$1.set(seccion, recortadas);
	try {
		window.localStorage.setItem(PREFIJO$1 + seccion, JSON.stringify(recortadas));
	} catch {}
}
/** "Nuevo desde tu última visita" (punto azul, 01_ux §3.5). La huella es por equipo (caché local). */
function useNovedades(seccion, items, id, huella) {
	const [vistas, setVistas] = (0, import_react.useState)(() => leerHuellas(seccion));
	const fn = (0, import_react.useRef)({
		id,
		huella
	});
	fn.current = {
		id,
		huella
	};
	(0, import_react.useEffect)(() => {
		setVistas(leerHuellas(seccion));
	}, [seccion]);
	(0, import_react.useEffect)(() => {
		if (vistas !== null || items === void 0) return;
		const base = {};
		for (const t of items) base[fn.current.id(t)] = fn.current.huella(t);
		guardarHuellas(seccion, base);
		setVistas(base);
	}, [
		vistas,
		items,
		seccion
	]);
	const esNuevo = (0, import_react.useCallback)((t) => {
		if (vistas === null) return false;
		return vistas[fn.current.id(t)] !== fn.current.huella(t);
	}, [vistas]);
	const marcarVistos = (0, import_react.useCallback)(() => {
		if (items === void 0) return;
		const siguiente = { ...leerHuellas(seccion) ?? {} };
		for (const t of items) {
			const k = fn.current.id(t);
			delete siguiente[k];
			siguiente[k] = fn.current.huella(t);
		}
		guardarHuellas(seccion, siguiente);
		setVistas(siguiente);
	}, [items, seccion]);
	return (0, import_react.useMemo)(() => ({
		esNuevo,
		marcarVistos
	}), [esNuevo, marcarVistos]);
}
var DISPOSITIVO_LOCAL = "interfaz";
var pila$1 = [];
function apilar(entrada) {
	pila$1.push(entrada);
	while (pila$1.length > 20) pila$1.shift();
}
function sacarDePila(entrada) {
	const i = pila$1.indexOf(entrada);
	if (i >= 0) pila$1.splice(i, 1);
}
function contexto$1() {
	return {
		ahora: dom.ahoraS(),
		dispositivo: DISPOSITIVO_LOCAL
	};
}
function esObjeto(v) {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}
function itemsDe(datos) {
	return esObjeto(datos) && Array.isArray(datos["items"]) ? datos["items"] : [];
}
function buscarEnCache(op) {
	const { lista, clave } = listaDeOp(op.tipo);
	const id = idDeOp(op);
	if (lista === "preferencias") {
		for (const [, e] of entradasDe("preferencias")) {
			const d = e.datos;
			if (guardas.esPreferencias(d)) return d;
		}
		return null;
	}
	const candidatos = [];
	for (const [, e] of entradasDe(clave)) candidatos.push(...itemsDe(e.datos));
	for (const [, e] of entradasDe("muestra")) {
		const sub = esObjeto(e.datos) ? e.datos[lista] : void 0;
		if (Array.isArray(sub)) candidatos.push(...sub);
	}
	for (const c of candidatos) if (guardas.esObjetoLocalConocido(c) && "id" in c && c.id === id) return c;
	return null;
}
async function objetoActual(op) {
	if (op.tipo === "plan.crear" || op.tipo === "nota.crear" || op.tipo === "recordatorio.crear" || op.tipo === "aviso.crear") return null;
	const enCache = buscarEnCache(op);
	if (enCache) return enCache;
	const { clave } = listaDeOp(op.tipo);
	try {
		const datos = clave === "preferencias" ? await consultar("preferencias", {}) : await consultar(clave, {});
		if (clave === "preferencias") return guardas.esPreferencias(datos) ? datos : null;
		const id = idDeOp(op);
		for (const c of itemsDe(datos)) if (guardas.esObjetoLocalConocido(c) && "id" in c && c.id === id) return c;
	} catch {
		return null;
	}
	return null;
}
function estadoDesde(antes) {
	if (!antes) return ESTADO_VACIO;
	if (guardas.esPlan(antes)) return {
		...ESTADO_VACIO,
		planes: [antes]
	};
	if (guardas.esAviso(antes)) return {
		...ESTADO_VACIO,
		avisos: [antes]
	};
	if (guardas.esRecordatorio(antes)) return {
		...ESTADO_VACIO,
		recordatorios: [antes]
	};
	if (guardas.esPlantilla(antes)) return {
		...ESTADO_VACIO,
		plantillas: [antes]
	};
	if (guardas.esPreferencias(antes)) return {
		...ESTADO_VACIO,
		preferencias: antes
	};
	if (guardas.esNota(antes)) return {
		...ESTADO_VACIO,
		notas: [antes]
	};
	return ESTADO_VACIO;
}
/** Cómo queda el objeto si el hub aplica la op (mismas reglas: rev + 1, ids del cliente). */
function predecir(op, antes, ctx) {
	return aplicarOpAEstado(estadoDesde(antes), op, ctx).objeto;
}
function parchear(k, datos, parches) {
	const previa = parchearEntrada(k, datos);
	if (previa) parches.push({
		k,
		previa,
		datos
	});
}
function conObjeto(lista, id, objeto, entra) {
	const sin = lista.filter((x) => x.id !== id);
	if (!objeto || !entra) return sin;
	const i = lista.findIndex((x) => x.id === id);
	if (i < 0) return [...sin, objeto];
	const salida = [...lista];
	salida[i] = objeto;
	return salida;
}
async function listasParaAvance(op, objeto) {
	const id = idDeOp(op);
	const leer = async (clave) => {
		try {
			return itemsDe(await consultar(clave, {})).filter((x) => esObjeto(x) && typeof x["id"] === "string");
		} catch {
			return [];
		}
	};
	let planes = await leer("plan");
	let avisos = await leer("avisos");
	if (op.tipo.startsWith("plan.")) planes = conObjeto(planes, id, guardas.esPlan(objeto) ? objeto : null, true);
	if (op.tipo.startsWith("aviso.")) avisos = conObjeto(avisos, id, guardas.esAviso(objeto) ? objeto : null, true);
	return {
		planes,
		avisos
	};
}
/** Aplica la op a la caché de inmediato (listas, preferencias y muestras tocadas). Devuelve cómo revertirlo. */
async function parchearOptimista(op, antes, objeto) {
	const parches = [];
	const { lista, clave } = listaDeOp(op.tipo);
	const id = idDeOp(op);
	if (lista === "preferencias") {
		if (objeto) for (const [k] of entradasDe("preferencias")) parchear(k, objeto, parches);
	} else for (const [k, e] of entradasDe(clave)) {
		if (!esObjeto(e.datos)) continue;
		const nuevos = conObjeto(itemsDe(e.datos).filter((x) => esObjeto(x) && typeof x["id"] === "string"), id, objeto && "id" in objeto ? objeto : null, objeto !== null && entraEnConsulta(clave, e.params, objeto));
		parchear(k, {
			...e.datos,
			items: nuevos
		}, parches);
	}
	const tocadas = solicitudesTocadas(antes, objeto);
	const notaOrecordatorio = op.tipo.startsWith("nota.") || op.tipo.startsWith("recordatorio.");
	if ([
		"muestras",
		"muestra",
		"tienda",
		"producto"
	].some((c) => entradasDe(c).length > 0) && (tocadas.size > 0 || notaOrecordatorio)) {
		const { planes, avisos } = tocadas.size > 0 ? await listasParaAvance(op, objeto) : {
			planes: [],
			avisos: []
		};
		const hoy = dom.hoyLocal();
		const recalcular = (m) => esMuestra(m) && tocadas.has(m.application_id) ? dom.aplicarLocal(m, planes, avisos, hoy) : m;
		if (tocadas.size > 0) {
			for (const [k, e] of entradasDe("muestras")) if (esObjeto(e.datos)) parchear(k, {
				...e.datos,
				items: itemsDe(e.datos).map(recalcular)
			}, parches);
			for (const c of ["tienda", "producto"]) for (const [k, e] of entradasDe(c)) if (esObjeto(e.datos) && Array.isArray(e.datos["muestras"])) parchear(k, {
				...e.datos,
				muestras: e.datos["muestras"].map(recalcular)
			}, parches);
		}
		for (const [k, e] of entradasDe("muestra")) {
			if (!esObjeto(e.datos)) continue;
			const m = e.datos["muestra"];
			if (!esMuestra(m)) continue;
			const appId = m.application_id;
			const cambios = {};
			if (tocadas.has(appId)) {
				cambios["muestra"] = dom.aplicarLocal(m, planes, avisos, hoy);
				cambios["planes"] = planes.filter((p) => p.application_id === appId);
				cambios["avisos"] = avisos.filter((a) => a.solicitud_ids.includes(appId));
			}
			if (notaOrecordatorio) {
				const lista2 = op.tipo.startsWith("nota.") ? "notas" : "recordatorios";
				const sub = e.datos[lista2];
				const actuales = Array.isArray(sub) ? sub.filter((x) => guardas.esNota(x) || guardas.esRecordatorio(x)) : [];
				const nuevo = guardas.esNota(objeto) || guardas.esRecordatorio(objeto) ? objeto : null;
				cambios[lista2] = conObjeto(actuales, id, nuevo, nuevo !== null && nuevo.entidad === "muestra" && nuevo.entidad_id === appId);
			}
			if (Object.keys(cambios).length > 0) parchear(k, {
				...e.datos,
				...cambios
			}, parches);
		}
	}
	return () => {
		for (const p of [...parches].reverse()) revertirEntrada(p.k, p.previa, p.datos);
	};
}
function clavesAfectadas(ops) {
	return [...new Set(ops.flatMap((o) => clavesDeOp(o.tipo)))];
}
function sinDeshacer() {
	return Promise.resolve();
}
/** Ejecuta ops (una o un lote), con optimismo en Windows, y arma su único deshacer. */
async function ejecutarOps(entrada, modo, alPila) {
	const t = await obtenerTransporte();
	const ctx = contexto$1();
	const ops = entrada.map((o) => conOpId(o, dom.nuevoId()));
	const vistos = /* @__PURE__ */ new Map();
	const antes = [];
	const previstos = [];
	for (const op of ops) {
		const llave = `${listaDeOp(op.tipo).lista}:${idDeOp(op)}`;
		const previo = vistos.has(llave) ? vistos.get(llave) ?? null : await objetoActual(op);
		const previsto = predecir(op, previo, ctx);
		vistos.set(llave, previsto);
		antes.push(previo);
		previstos.push(previsto);
	}
	const reversiones = [];
	if (t.tipo === "windows") for (let i = 0; i < ops.length; i += 1) {
		const op = ops[i];
		if (op) reversiones.push(await parchearOptimista(op, antes[i] ?? null, previstos[i] ?? null));
	}
	let resultados;
	try {
		resultados = await t.aplicarOps(ops, modo);
	} catch (e) {
		const error = comoErrorHub(e);
		resultados = ops.map((op) => ({
			op_id: op.op_id,
			estado: "error",
			estado_hub: null,
			objeto: null,
			error
		}));
	}
	if (resultados.some((r) => r.estado === "error" || r.estado === "conflicto")) for (const r of [...reversiones].reverse()) r();
	invalidarClaves(clavesAfectadas(ops));
	const objetos = resultados.map((r, i) => r.estado === "conflicto" ? r.objeto : r.objeto ?? previstos[i] ?? null);
	const estado = resultados.some((r) => r.estado === "conflicto") ? "conflicto" : resultados.some((r) => r.estado === "error") ? "error" : resultados.some((r) => r.estado === "en_cola") ? "en_cola" : "aplicada";
	const inversas = [];
	resultados.forEach((r, i) => {
		const op = ops[i];
		if (!op || r.estado !== "aplicada" && r.estado !== "en_cola") return;
		const inv = inversaDe(op, antes[i] ?? null, objetos[i] ?? null, ctx, dom.nuevoId);
		if (inv) inversas.unshift(inv);
	});
	let deshacer = sinDeshacer;
	if (inversas.length > 0) {
		const entradaPila = {
			deshacer: sinDeshacer,
			at: ctx.ahora
		};
		let usado = false;
		deshacer = async () => {
			if (usado) return;
			usado = true;
			sacarDePila(entradaPila);
			const r = await ejecutarOps(inversas, inversas.length > 1 ? "lote" : "individual", false);
			if (r.estado === "error" || r.estado === "conflicto") throw r.resultados.find((x) => x.error)?.error ?? new ErrorHub("error_interno", "No pudimos deshacer el cambio.", 0);
		};
		entradaPila.deshacer = deshacer;
		if (alPila && (estado === "aplicada" || estado === "en_cola")) apilar(entradaPila);
	}
	return {
		resultados,
		objetos,
		estado,
		deshacer
	};
}
async function accion$4(op, es) {
	const r = await ejecutarOps([op], "individual", true);
	const objeto = r.objetos[0] ?? null;
	const error = r.resultados[0]?.error ?? null;
	return {
		estado: r.estado,
		objeto: es(objeto) ? objeto : null,
		error,
		deshacer: r.deshacer
	};
}
var ninguno$1 = (_o) => false;
async function restaurarPlantilla(id) {
	const ctx = contexto$1();
	const antes = await objetoActual({
		op_id: "",
		tipo: "plantilla.editar",
		id,
		cambios: { rev: 0 }
	});
	let objeto = null;
	try {
		const r = await (await obtenerTransporte()).pedir("POST", `/api/plantillas/${encodeURIComponent(id)}/restaurar`);
		objeto = guardas.esPlantilla(r) ? r : null;
	} catch (e) {
		return {
			estado: "error",
			objeto: null,
			error: comoErrorHub(e),
			deshacer: sinDeshacer
		};
	} finally {
		invalidarClaves(["plantillas"]);
	}
	let deshacer = sinDeshacer;
	if (objeto && guardas.esPlantilla(antes)) {
		const inversa = {
			tipo: "plantilla.editar",
			id,
			cambios: {
				nombre: antes.nombre,
				cuerpo: antes.cuerpo,
				rev: objeto.rev
			}
		};
		const entradaPila = {
			deshacer: sinDeshacer,
			at: ctx.ahora
		};
		let usado = false;
		deshacer = async () => {
			if (usado) return;
			usado = true;
			sacarDePila(entradaPila);
			const r = await ejecutarOps([inversa], "individual", false);
			if (r.estado === "error" || r.estado === "conflicto") throw r.resultados[0]?.error ?? new ErrorHub("error_interno", "No pudimos deshacer el cambio.", 0);
		};
		entradaPila.deshacer = deshacer;
		apilar(entradaPila);
	}
	return {
		estado: "aplicada",
		objeto,
		error: null,
		deshacer
	};
}
function aOpsResultado(r, objeto) {
	const estado = r.estado_hub ?? (r.estado === "conflicto" ? "conflicto" : r.estado === "error" ? "invalida" : "aplicada");
	const fila = {
		op_id: r.op_id,
		estado
	};
	if (objeto) fila.objeto = objeto;
	if (r.error) fila.error = r.error.mensaje;
	return fila;
}
async function lote(ops) {
	if (ops.length === 0) return {
		estado: "aplicada",
		resultados: [],
		deshacer: sinDeshacer
	};
	const r = await ejecutarOps(ops, "lote", true);
	return {
		estado: r.estado,
		resultados: r.resultados.map((x, i) => aOpsResultado(x, r.objetos[i] ?? null)),
		deshacer: r.deshacer
	};
}
/** Ctrl+Z global: deshace la última acción de esta sesión (pila de 20, válidas 10 min). false si no había nada. */
async function deshacerUltimo() {
	const limite = dom.ahoraS() - 600;
	while (pila$1.length > 0) {
		const ultima = pila$1[pila$1.length - 1];
		if (!ultima) break;
		if (ultima.at < limite) {
			pila$1.length = 0;
			return false;
		}
		await ultima.deshacer();
		return true;
	}
	return false;
}
var acciones$4 = {
	crearPlan: (datos) => accion$4({
		tipo: "plan.crear",
		datos
	}, guardas.esPlan),
	editarPlan: (id, cambios) => accion$4({
		tipo: "plan.editar",
		id,
		cambios
	}, guardas.esPlan),
	borrarPlan: (id, rev) => accion$4({
		tipo: "plan.borrar",
		id,
		rev
	}, ninguno$1),
	crearAviso: (datos) => accion$4({
		tipo: "aviso.crear",
		datos
	}, guardas.esAviso),
	editarAviso: (id, cambios) => accion$4({
		tipo: "aviso.editar",
		id,
		cambios
	}, guardas.esAviso),
	crearNota: (datos) => accion$4({
		tipo: "nota.crear",
		datos
	}, guardas.esNota),
	editarNota: (id, cambios) => accion$4({
		tipo: "nota.editar",
		id,
		cambios
	}, guardas.esNota),
	borrarNota: (id, rev) => accion$4({
		tipo: "nota.borrar",
		id,
		rev
	}, ninguno$1),
	crearRecordatorio: (datos) => accion$4({
		tipo: "recordatorio.crear",
		datos
	}, guardas.esRecordatorio),
	editarRecordatorio: (id, cambios) => accion$4({
		tipo: "recordatorio.editar",
		id,
		cambios
	}, guardas.esRecordatorio),
	borrarRecordatorio: (id, rev) => accion$4({
		tipo: "recordatorio.borrar",
		id,
		rev
	}, ninguno$1),
	editarPlantilla: (id, cambios) => accion$4({
		tipo: "plantilla.editar",
		id,
		cambios
	}, guardas.esPlantilla),
	restaurarPlantilla,
	editarPreferencias: (cambios) => accion$4({
		tipo: "preferencias.editar",
		cambios
	}, guardas.esPreferencias),
	lote,
	deshacerUltimo
};
function useAcciones() {
	return acciones$4;
}
/**
* @/app · tamaño de ventana y plataforma (02 §5.1, BUILD_SPEC C5/C41).
* compacta < 600 · media 600–1179 (riel de 80) · expandida 1180–1439 (lateral de 248) · amplia ≥ 1440.
* El panel de detalle de 480 cabe desde 1280 (también en tabletas: de 600 a 1279, detalle a pantalla completa).
*/
var CORTES = {
	media: 600,
	expandida: 1180,
	panel: 1280,
	amplia: 1440
};
function coincideMedia(q) {
	return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(q).matches;
}
function suscribirAncho(avisar) {
	if (typeof window === "undefined") return () => void 0;
	const listas = typeof window.matchMedia === "function" ? [
		CORTES.media,
		CORTES.expandida,
		CORTES.panel,
		CORTES.amplia
	].map((c) => window.matchMedia(`(min-width: ${c}px)`)) : [];
	for (const l of listas) l.addEventListener("change", avisar);
	window.addEventListener("resize", avisar);
	return () => {
		for (const l of listas) l.removeEventListener("change", avisar);
		window.removeEventListener("resize", avisar);
	};
}
/** Clase de ancho actual (sin React, para pruebas y para la raíz). */
function claseDeAncho() {
	if (coincideMedia(`(min-width: ${CORTES.amplia}px)`)) return "amplia";
	if (coincideMedia(`(min-width: ${CORTES.expandida}px)`)) return "expandida";
	if (coincideMedia(`(min-width: ${CORTES.media}px)`)) return "media";
	return "compacta";
}
/** compacta < 600 · media 600–1179 (riel de 80) · expandida 1180–1439 · amplia ≥ 1440. */
function useClaseAncho() {
	return (0, import_react.useSyncExternalStore)(suscribirAncho, claseDeAncho, () => "expandida");
}
function panelCabe() {
	return coincideMedia(`(min-width: ${CORTES.panel}px)`);
}
/** true si cabe el panel de detalle de 480 px (ancho ≥ 1280 y no es compacta). */
function usePanelDisponible() {
	const clase = useClaseAncho();
	return (0, import_react.useSyncExternalStore)(suscribirAncho, panelCabe, () => true) && clase !== "compacta";
}
/** pywebview 6 publica su objeto después de cargar la interfaz ('pywebviewready'): la plataforma puede cambiar. */
function suscribirPlataforma(avisar) {
	if (typeof window === "undefined") return () => void 0;
	window.addEventListener("pywebviewready", avisar);
	window.addEventListener("hashchange", avisar);
	return () => {
		window.removeEventListener("pywebviewready", avisar);
		window.removeEventListener("hashchange", avisar);
	};
}
function plataformaActual() {
	return infoPlataforma().plataforma;
}
function usePlataforma() {
	return (0, import_react.useSyncExternalStore)(suscribirPlataforma, plataformaActual, () => "navegador");
}
var SIN_CAPACIDADES = Object.freeze({
	auth: false,
	lan_admin: false,
	portapapeles: false,
	escribir: false,
	sincronizar: false
});
/** Capacidades de SessionResponse (todas false mientras carga). */
function useCapacidades() {
	return useSesion().datos?.capacidades ?? SIN_CAPACIDADES;
}
/**
* @/app · entorno de desarrollo (BUILD_SPEC §8.1, §8.7). Los parámetros `?tema=`, `?densidad=` y `?buscar=` de la
* URL se aceptan antes del hash (`/?tema=claro#/inicio`) o dentro de él (`#/inicio?tema=claro`). Los de apariencia
* (`tema`, `densidad`) solo cuentan en `npm run dev:demo` (import.meta.env.DEV && VITE_DEMO === '1'): en `vite build`
* esa rama desaparece.
*/
/** true en `npm run dev:demo`. Nunca en `vite build`. */
function modoDemo() {
	return false;
}
/** Valor de un parámetro de la URL (antes del hash o dentro de él), o null. */
function parametroUrl(nombre) {
	if (typeof window === "undefined") return null;
	const listas = [new URLSearchParams(window.location.search)];
	const hash = window.location.hash;
	const i = hash.indexOf("?");
	if (i >= 0) listas.push(new URLSearchParams(hash.slice(i + 1)));
	for (const p of listas) {
		const v = p.get(nombre);
		if (v !== null && v !== "") return v;
	}
	return null;
}
/** Parámetro de desarrollo: solo en el modo demo; si no, siempre null. */
function parametroDesarrollo(nombre) {
	return modoDemo() ? parametroUrl(nombre) : null;
}
/** localStorage que nunca truena (ventana privada, almacenamiento bloqueado o pruebas sin DOM). */
var almacen = {
	leer(clave) {
		try {
			return typeof window === "undefined" ? null : window.localStorage.getItem(clave);
		} catch {
			return null;
		}
	},
	escribir(clave, valor) {
		try {
			if (typeof window !== "undefined") window.localStorage.setItem(clave, valor);
		} catch {}
	},
	borrar(clave) {
		try {
			if (typeof window !== "undefined") window.localStorage.removeItem(clave);
		} catch {}
	}
};
/**
* @/app · tema, densidad y movimiento (02 §11–13, BUILD_SPEC §8.4 · C24 · C48). Los valores viven en español en los
* contratos y van en inglés en <html> con la tabla EXACTA de §8.4:
*
* | Origen (contrato)                          | Atributo               | Valor en <html>                                      |
* |--------------------------------------------|------------------------|------------------------------------------------------|
* | EstadoTema.tema oscuro · claro             | data-theme             | dark · light (+ localStorage['corte.tema'])          |
* |   (sin preferencia cargada)                | data-theme             | system (o lo que dejó tema-inicial.js)               |
* | preferencia sistema                        | data-theme             | system hasta resolverlo con matchMedia → dark/light  |
* | densidad comoda · compacta · tactil        | data-density           | comfortable · compact · touch (Android siempre touch)|
* | plataforma                                 | data-platform          | windows · android                                    |
* | vidrio                                     | data-glass             | on en Windows; en Android lo pone Java               |
* | reducir_animaciones si                     | data-reduced-motion    | presente (sin data-motion)                           |
* | reducir_animaciones no                     | data-motion            | full (sin data-reduced-motion)                       |
* | reducir_animaciones sistema                | data-reduced-motion    | presente si prefers-reduced-motion o Java puso       |
* |                                            |                        | data-system-reduced-motion; si no, ninguno           |
*
* calcularAtributos() es pura (la prueba recorre la tabla); aplicarAtributos() escribe <html> y la clave de
* tema-inicial.js. useTema() lee la preferencia del hub (PreferenciasSincronizadas, también en la copia del celular),
* la densidad de AjustesPc (Windows) y el sistema (matchMedia + dato de Java).
*/
/** Clave que lee public/tema-inicial.js antes de pintar (sin destello oscuro → claro). */
var CLAVE_TEMA = "corte.tema";
var DENSIDAD_HTML = {
	comoda: "comfortable",
	compacta: "compact",
	tactil: "touch"
};
function temaDeSistema(sistemaOscuro) {
	if (sistemaOscuro === null) return "system";
	return sistemaOscuro ? "dark" : "light";
}
/** Tabla de BUILD_SPEC §8.4 (C48). Pura. */
function calcularAtributos(e) {
	let tema;
	let guardar;
	if (e.preferencia === null) {
		tema = e.temaGuardado === "dark" || e.temaGuardado === "light" || e.temaGuardado === "system" ? e.temaGuardado : "system";
		guardar = null;
	} else if (e.preferencia === "sistema") {
		tema = temaDeSistema(e.sistemaOscuro);
		guardar = "system";
	} else {
		tema = e.preferencia === "oscuro" ? "dark" : "light";
		guardar = tema;
	}
	const android = e.plataforma === "android";
	const reducido = e.reducir === "si" || e.reducir === "sistema" && (e.sistemaReduce || e.javaReduce);
	return {
		"data-theme": tema,
		"data-density": android ? "touch" : DENSIDAD_HTML[e.densidad],
		"data-platform": android ? "android" : "windows",
		"data-glass": android ? null : "on",
		"data-reduced-motion": reducido,
		"data-motion": e.reducir === "no" ? "full" : null,
		guardar
	};
}
/** Escribe los atributos en <html> y la clave de tema-inicial.js. */
function aplicarAtributos(html, a) {
	const fijar = (nombre, valor) => {
		if (html.getAttribute(nombre) !== valor) html.setAttribute(nombre, valor);
	};
	fijar("data-theme", a["data-theme"]);
	fijar("data-density", a["data-density"]);
	fijar("data-platform", a["data-platform"]);
	if (a["data-glass"] !== null) fijar("data-glass", a["data-glass"]);
	if (a["data-reduced-motion"]) fijar("data-reduced-motion", "");
	else html.removeAttribute("data-reduced-motion");
	if (a["data-motion"] !== null) fijar("data-motion", a["data-motion"]);
	else html.removeAttribute("data-motion");
	if (a.guardar !== null && almacen.leer("corte.tema") !== a.guardar) almacen.escribir(CLAVE_TEMA, a.guardar);
}
/** Tema que de verdad se ve ('system' sin dato del sistema = oscuro, C24). */
function temaVisible(a, sistemaOscuro) {
	if (a["data-theme"] === "light") return "claro";
	if (a["data-theme"] === "dark") return "oscuro";
	return sistemaOscuro === false ? "claro" : "oscuro";
}
function suscribirSistema(avisar) {
	if (typeof window === "undefined") return () => void 0;
	const listas = typeof window.matchMedia === "function" ? [
		"(prefers-color-scheme: dark)",
		"(prefers-color-scheme: light)",
		"(prefers-reduced-motion: reduce)"
	].map((q) => window.matchMedia(q)) : [];
	for (const l of listas) l.addEventListener("change", avisar);
	const o = typeof MutationObserver === "undefined" ? null : new MutationObserver(avisar);
	o?.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-system-reduced-motion"]
	});
	window.addEventListener("hashchange", avisar);
	return () => {
		for (const l of listas) l.removeEventListener("change", avisar);
		o?.disconnect();
		window.removeEventListener("hashchange", avisar);
	};
}
function media(q) {
	return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(q).matches;
}
/** 'o|c|-' (oscuro, claro o sin dato) · reduce · Java · parámetros de desarrollo. */
function firmaSistema() {
	const oscuro = media("(prefers-color-scheme: dark)");
	const claro = media("(prefers-color-scheme: light)");
	const esquema = oscuro ? "o" : claro ? "c" : "-";
	const java = typeof document !== "undefined" && document.documentElement.hasAttribute("data-system-reduced-motion");
	return [
		esquema,
		media("(prefers-reduced-motion: reduce)") ? "1" : "0",
		java ? "1" : "0",
		parametroDesarrollo("tema") ?? "",
		parametroDesarrollo("densidad") ?? ""
	].join("|");
}
var DENSIDADES = [
	"comoda",
	"compacta",
	"tactil"
];
var PREFERENCIAS = [
	"sistema",
	"claro",
	"oscuro"
];
/** Todo lo que entra a la tabla de §8.4, leído del hub, del sistema y (solo en dev:demo) de ?tema= / ?densidad=. */
function useEntradaAtributos() {
	const plataforma = usePlataforma();
	const preferencias = useConsulta("preferencias", {});
	const ajustes = useConsulta("ajustes_pc", {}, { activa: plataforma !== "android" });
	const [esquema, reduce, java, temaDev, densidadDev] = (0, import_react.useSyncExternalStore)(suscribirSistema, firmaSistema, () => "-|0|0||").split("|");
	let preferencia = null;
	const temaPedido = PREFERENCIAS.find((t) => t === temaDev);
	if (temaPedido) preferencia = temaPedido;
	else if (preferencias.datos) preferencia = preferencias.datos.tema ?? "sistema";
	else if (preferencias.error) preferencia = "sistema";
	const densidadPedida = DENSIDADES.find((d) => d === densidadDev);
	const densidad = plataforma === "android" ? "tactil" : densidadPedida ?? ajustes.datos?.densidad ?? "comoda";
	return {
		preferencia,
		sistemaOscuro: esquema === "o" ? true : esquema === "c" ? false : null,
		densidad,
		plataforma,
		reducir: preferencias.datos?.reducir_animaciones ?? "sistema",
		sistemaReduce: reduce === "1",
		javaReduce: java === "1",
		temaGuardado: almacen.leer(CLAVE_TEMA)
	};
}
/** Tema aplicado, preferencia guardada en el hub, densidad y si hay que reducir el movimiento. */
function useTema() {
	const e = useEntradaAtributos();
	const a = calcularAtributos(e);
	return {
		tema: temaVisible(a, e.sistemaOscuro),
		preferencia: e.preferencia ?? "sistema",
		densidad: e.plataforma === "android" ? "tactil" : e.densidad,
		reducirMovimiento: a["data-reduced-motion"]
	};
}
/**
* @/app · atajos de teclado (01 §3.6, 02 §11.1). Un solo oyente de `keydown` en la ventana y una pila de registros:
* - teclas sueltas ('j', 'Enter', 'Escape'), combinaciones ('ctrl+k', 'shift+?') y secuencias ('g i', 1.5 s entre teclas);
* - sin efecto con el foco en un campo (input, textarea, select o contenteditable);
* - los del diálogo ganan: con un diálogo modal abierto ([role="dialog"][aria-modal="true"]) solo cuentan los atajos
*   registrados desde dentro de un diálogo; sin diálogo, ante un empate gana el registro más reciente;
* - el panel '?' lista los registros vivos (useAtajosRegistrados).
*/
var registros = [];
var oyentes$2 = /* @__PURE__ */ new Set();
var version = 0;
var siguienteId$1 = 1;
var escuchando$2 = false;
var previa = null;
var VENTANA_SECUENCIA_MS = 1500;
function avisar() {
	version++;
	for (const o of [...oyentes$2]) o();
}
function hayDialogoModal() {
	return typeof document !== "undefined" && document.querySelector("[role=\"dialog\"][aria-modal=\"true\"]") !== null;
}
function esCampo(objetivo) {
	if (!(objetivo instanceof HTMLElement)) return false;
	const t = objetivo.tagName;
	if (t === "TEXTAREA" || t === "SELECT") return true;
	if (t === "INPUT") {
		const tipo = objetivo.type;
		return ![
			"checkbox",
			"radio",
			"button",
			"submit",
			"reset",
			"range",
			"color",
			"file"
		].includes(tipo);
	}
	return objetivo.isContentEditable || objetivo.closest("[contenteditable=\"true\"], [contenteditable=\"\"]") !== null;
}
function leerCombinacion(definicion) {
	const partes = definicion.split("+");
	const tecla = definicion.endsWith("++") ? "+" : partes[partes.length - 1] ?? "";
	const mods = partes.slice(0, definicion.endsWith("++") ? -2 : -1).map((m) => m.toLowerCase());
	return {
		tecla,
		ctrl: mods.includes("ctrl") || mods.includes("meta"),
		shift: mods.includes("shift"),
		alt: mods.includes("alt")
	};
}
/** ¿La pulsación corresponde a una combinación ('ctrl+k', 'shift+?', 'Enter', 'j', 'F5')? */
function coincideTecla(definicion, e) {
	const c = leerCombinacion(definicion);
	if (c.ctrl !== (e.ctrlKey || e.metaKey) || c.alt !== e.altKey) return false;
	const tecla = c.tecla;
	if (tecla.length === 1 && !/[a-z0-9]/i.test(tecla)) return e.key === tecla;
	if (c.shift !== e.shiftKey) return false;
	return e.key.toLowerCase() === tecla.toLowerCase();
}
function pasos(teclas) {
	return teclas.trim().split(/\s+/).filter((x) => x.length > 0);
}
function candidatos(enCampo) {
	const dialogo = hayDialogoModal();
	const lista = [];
	for (let i = registros.length - 1; i >= 0; i--) {
		const r = registros[i];
		if (!r) continue;
		if (dialogo && !r.enDialogo && !r.opciones.siempre) continue;
		if (enCampo && !r.opciones.enCampos) continue;
		for (const a of r.atajos) lista.push({
			registro: r,
			atajo: a
		});
	}
	return lista;
}
function alTecla$1(e) {
	if (e.defaultPrevented || e.isComposing) return;
	if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;
	const enCampo = esCampo(e.target);
	const ahora = Date.now();
	const lista = candidatos(enCampo);
	if (previa && ahora - previa.t <= VENTANA_SECUENCIA_MS) for (const { atajo } of lista) {
		const ps = pasos(atajo.teclas);
		if (ps.length !== 2) continue;
		const [p1, p2] = ps;
		if (!p1 || !p2 || p1.toLowerCase() !== previa.tecla || !coincideTecla(p2, e)) continue;
		if (atajo.cuando && !atajo.cuando()) continue;
		e.preventDefault();
		previa = null;
		atajo.accion();
		return;
	}
	for (const { atajo } of lista) {
		const ps = pasos(atajo.teclas);
		if (ps.length !== 1 || !ps[0] || !coincideTecla(ps[0], e)) continue;
		if (atajo.cuando && !atajo.cuando()) continue;
		e.preventDefault();
		previa = null;
		atajo.accion();
		return;
	}
	previa = enCampo || e.ctrlKey || e.metaKey || e.altKey ? null : {
		tecla: e.key.toLowerCase(),
		t: ahora
	};
}
function asegurarEscucha$2() {
	if (escuchando$2 || typeof window === "undefined") return;
	escuchando$2 = true;
	window.addEventListener("keydown", alTecla$1);
}
/** Registro imperativo (lo usan useAtajos y los atajos globales de la raíz). Devuelve la función para quitarlo. */
function registrarAtajos(atajos, opciones = {}) {
	asegurarEscucha$2();
	const registro = {
		id: siguienteId$1++,
		atajos: atajos(),
		enDialogo: hayDialogoModal(),
		opciones
	};
	registros.push(registro);
	avisar();
	return {
		quitar: () => {
			const i = registros.indexOf(registro);
			if (i >= 0) registros.splice(i, 1);
			avisar();
		},
		actualizar: () => {
			registro.atajos = atajos();
		}
	};
}
/** Atajos de la pantalla o del diálogo montado (los del diálogo ganan). Se listan en el panel '?'. */
function useAtajos(atajos, activo = true) {
	const ref = (0, import_react.useRef)(atajos);
	ref.current = atajos;
	const firma = atajos.map((a) => `${a.teclas}\u0000${a.descripcion}`).join("");
	(0, import_react.useEffect)(() => {
		if (!activo) return void 0;
		return registrarAtajos(() => ref.current.map((a, i) => ({
			teclas: a.teclas,
			descripcion: a.descripcion,
			accion: () => ref.current[i]?.accion(),
			cuando: () => {
				const actual = ref.current[i];
				return actual ? actual.cuando ? actual.cuando() : true : false;
			}
		})), { grupo: "En esta pantalla" }).quitar;
	}, [activo, firma]);
}
function suscribir$2(fn) {
	oyentes$2.add(fn);
	return () => oyentes$2.delete(fn);
}
/** Registros vivos (para el panel '?'): se vuelve a pintar cuando alguien registra o quita atajos. */
function useAtajosRegistrados() {
	(0, import_react.useSyncExternalStore)(suscribir$2, () => version, () => 0);
	return registros.slice();
}
/**
* @/app · «primera vez en ESTE equipo» (01 §4.15, §7.4): recorridos, notas que se descartan, la oferta única de
* reordenar el plan. Se guarda en localStorage (con try/catch: si el almacenamiento está bloqueado se recuerda solo en
* memoria durante la sesión) y todos los componentes con la misma clave se enteran al instante.
*/
var PREFIJO = "corte.visto.";
/** Respaldo en memoria por si localStorage no está disponible. */
var enMemoria = /* @__PURE__ */ new Set();
var oyentes$1 = /* @__PURE__ */ new Set();
function yaVisto(clave) {
	return enMemoria.has(clave) || almacen.leer(PREFIJO + clave) === "1";
}
function marcarVisto(clave) {
	enMemoria.add(clave);
	almacen.escribir(PREFIJO + clave, "1");
	for (const o of [...oyentes$1]) o();
}
function suscribir$1(fn) {
	oyentes$1.add(fn);
	const alAlmacen = (e) => {
		if (e.key === null || e.key.startsWith(PREFIJO)) fn();
	};
	if (typeof window !== "undefined") window.addEventListener("storage", alAlmacen);
	return () => {
		oyentes$1.delete(fn);
		if (typeof window !== "undefined") window.removeEventListener("storage", alAlmacen);
	};
}
/** Primera vez en ESTE equipo (caché local: recorridos, notas descartables). [esPrimera, marcarVisto]. */
function usePrimeraVez(clave) {
	const visto = (0, import_react.useSyncExternalStore)(suscribir$1, () => yaVisto(clave), () => true);
	const marcar = (0, import_react.useCallback)(() => marcarVisto(clave), [clave]);
	return [!visto, marcar];
}
/**
* @/app · recorridos breves (01 §4.15 con el texto de C36, BUILD_SPEC §8.5 (c)). Secuencia FIJA:
* heroe_inicio (Inicio) → muestras (Muestras) → indicador_sync (indicador de sincronización de la raíz).
* - Solo se activan si Bienvenida llama iniciarRecorridos() (el usuario saltó W4); si se creó el plan, nunca.
* - Máximo uno visible a la vez: el paso actual. «Siguiente» pasa al siguiente y navega a su pantalla si hace falta.
* - «Entendido» (o cerrar) termina el recorrido completo y marca la clave 'recorridos-v1' de usePrimeraVez.
* El estado (activo y paso) se guarda en localStorage['corte.recorridos'] para sobrevivir a una recarga.
*/
var CLAVE_RECORRIDOS = "recorridos-v1";
var CLAVE_ESTADO = "corte.recorridos";
var SECUENCIA_RECORRIDO = [
	"heroe_inicio",
	"muestras",
	"indicador_sync"
];
/** Textos exactos de 01 §4.15 (el tercero con C36: 30 minutos). */
var TEXTOS_RECORRIDO = {
	heroe_inicio: "Arma tu plan y te decimos cuándo terminas.",
	muestras: "Planea, marca tu avance y avisa a cada tienda.",
	indicador_sync: "Tus datos se actualizan solos cada 30 minutos."
};
/** Pantalla de cada paso (el indicador de sincronización está en todas: no navega). */
var RUTA_DEL_PASO = {
	heroe_inicio: "/inicio",
	muestras: "/muestras"
};
var estado = leer();
var oyentes = /* @__PURE__ */ new Set();
function leer() {
	const crudo = almacen.leer(CLAVE_ESTADO);
	if (!crudo) return {
		activo: false,
		paso: 0
	};
	try {
		const v = JSON.parse(crudo);
		if (v !== null && typeof v === "object" && "activo" in v && "paso" in v && typeof v.activo === "boolean" && typeof v.paso === "number") return {
			activo: v.activo,
			paso: Math.max(0, Math.min(SECUENCIA_RECORRIDO.length - 1, Math.floor(v.paso)))
		};
	} catch {}
	return {
		activo: false,
		paso: 0
	};
}
function fijar(nuevo) {
	estado = nuevo;
	almacen.escribir(CLAVE_ESTADO, JSON.stringify(nuevo));
	for (const o of [...oyentes]) o();
}
function suscribir(fn) {
	oyentes.add(fn);
	return () => oyentes.delete(fn);
}
/** Paso visible ahora (null si no hay recorrido activo o ya se terminó en este equipo). */
function pasoActual() {
	if (!estado.activo || yaVisto("recorridos-v1")) return null;
	return SECUENCIA_RECORRIDO[estado.paso] ?? null;
}
/** Lo llama Bienvenida cuando el usuario salta W4 ("Saltar"). Si se creó el plan en W4, nunca se llama. */
function iniciarRecorridos() {
	if (yaVisto("recorridos-v1")) return;
	fijar({
		activo: true,
		paso: 0
	});
}
function entendido() {
	marcarVisto(CLAVE_RECORRIDOS);
	fijar({
		activo: false,
		paso: 0
	});
}
function siguiente() {
	const proximo = estado.paso + 1;
	const paso = SECUENCIA_RECORRIDO[proximo];
	if (!paso) {
		entendido();
		return;
	}
	fijar({
		activo: true,
		paso: proximo
	});
	const ruta = RUTA_DEL_PASO[paso];
	if (ruta && typeof window !== "undefined" && partirHash(window.location.hash).ruta !== ruta) navegar(ruta);
}
function useRecorrido(paso) {
	return {
		visible: (0, import_react.useSyncExternalStore)(suscribir, pasoActual, () => null) === paso,
		texto: TEXTOS_RECORRIDO[paso],
		esUltimo: paso === SECUENCIA_RECORRIDO[SECUENCIA_RECORRIDO.length - 1],
		siguiente,
		entendido
	};
}
/** Une nombres de clase e ignora los vacíos (false, null, undefined, ''). */
function cx(...clases) {
	let salida = "";
	for (const c of clases) {
		if (!c) continue;
		salida = salida ? `${salida} ${c}` : c;
	}
	return salida;
}
/** Variables CSS en línea (`--foto-ancho: 40px`). Los valores vienen de datos o medidas, nunca colores sueltos. */
function vars(valores) {
	const salida = {};
	for (const [k, v] of Object.entries(valores)) salida[k] = typeof v === "number" ? String(v) : v;
	return salida;
}
var Icono_module_default = {
	icono: "_icono_30mm9_1",
	md: "_md_30mm9_7",
	t14: "_t14_30mm9_8",
	t16: "_t16_30mm9_9",
	t18: "_t18_30mm9_10",
	t20: "_t20_30mm9_11",
	t22: "_t22_30mm9_12",
	t24: "_t24_30mm9_13"
};
var LUCIDE = {
	House: import_lucide_react.House,
	Package: import_lucide_react.Package,
	Store: import_lucide_react.Store,
	ChartColumn: import_lucide_react.ChartColumn,
	SquarePlay: import_lucide_react.SquarePlay,
	Shirt: import_lucide_react.Shirt,
	Ellipsis: import_lucide_react.Ellipsis,
	Settings: import_lucide_react.Settings,
	Search: import_lucide_react.Search,
	RefreshCw: import_lucide_react.RefreshCw,
	Copy: import_lucide_react.Copy,
	ExternalLink: import_lucide_react.ExternalLink,
	Download: import_lucide_react.Download,
	QrCode: import_lucide_react.QrCode,
	ArrowDownUp: import_lucide_react.ArrowDownUp,
	CalendarDays: import_lucide_react.CalendarDays,
	MessageCircle: import_lucide_react.MessageCircle,
	X: import_lucide_react.X,
	ChevronLeft: import_lucide_react.ChevronLeft,
	ChevronRight: import_lucide_react.ChevronRight,
	ChevronDown: import_lucide_react.ChevronDown,
	ArrowLeft: import_lucide_react.ArrowLeft,
	ArrowRight: import_lucide_react.ArrowRight,
	Plus: import_lucide_react.Plus,
	Pencil: import_lucide_react.Pencil,
	Trash2: import_lucide_react.Trash2,
	LayoutList: import_lucide_react.LayoutList,
	LayoutGrid: import_lucide_react.LayoutGrid,
	Camera: import_lucide_react.Camera,
	Keyboard: import_lucide_react.Keyboard,
	Bell: import_lucide_react.Bell,
	Link: import_lucide_react.Link,
	Share2: import_lucide_react.Share2,
	Pin: import_lucide_react.Pin,
	Maximize2: import_lucide_react.Maximize2,
	Undo2: import_lucide_react.Undo2,
	Moon: import_lucide_react.Moon,
	Sun: import_lucide_react.Sun,
	Eye: import_lucide_react.Eye,
	EyeOff: import_lucide_react.EyeOff,
	Lock: import_lucide_react.Lock,
	CircleHelp: import_lucide_react.CircleHelp,
	Image: import_lucide_react.Image,
	Minus: import_lucide_react.Minus,
	CircleAlert: import_lucide_react.CircleAlert,
	History: import_lucide_react.History,
	Clock: import_lucide_react.Clock,
	Hourglass: import_lucide_react.Hourglass,
	Check: import_lucide_react.Check,
	Info: import_lucide_react.Info,
	CircleMinus: import_lucide_react.CircleMinus,
	Ban: import_lucide_react.Ban,
	Pause: import_lucide_react.Pause,
	RotateCcw: import_lucide_react.RotateCcw,
	CircleDashed: import_lucide_react.CircleDashed,
	CalendarCheck: import_lucide_react.CalendarCheck,
	Clapperboard: import_lucide_react.Clapperboard,
	CalendarClock: import_lucide_react.CalendarClock,
	CircleCheckBig: import_lucide_react.CircleCheckBig,
	MessageCircleWarning: import_lucide_react.MessageCircleWarning,
	Play: import_lucide_react.Play,
	Coins: import_lucide_react.Coins,
	Flame: import_lucide_react.Flame,
	TrendingUp: import_lucide_react.TrendingUp,
	Box: import_lucide_react.Box,
	SportShoe: import_lucide_react.SportShoe,
	Wallet: import_lucide_react.Wallet,
	Tag: import_lucide_react.Tag,
	Smartphone: import_lucide_react.Smartphone,
	Monitor: import_lucide_react.Monitor,
	Wifi: import_lucide_react.Wifi,
	Sparkles: import_lucide_react.Sparkles,
	Star: import_lucide_react.Star
};
/** Trazo de 02 §6 (1.75) y de los chips (2 a 14 px, §7.2). */
function trazo$1(tamano) {
	return tamano !== void 0 && tamano <= 14 ? 2 : 1.75;
}
/** Gorra de béisbol de perfil: copa asimétrica (más alta atrás) con la costura del panel y una visera larga hacia la
*  derecha, sin el botón de arriba (con él se leía como campana de servicio). Llena la retícula como los lucide
*  (x 2.5–22, y 4.5–19.3), para que no se vea más chica que Shirt o Tag. */
function Gorra(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: p.strokeWidth,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: p.className,
		...p.a11y,
		"data-icono": "Gorra",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 16c0-6.6 3.4-11.5 8.4-11.5 4.4 0 7.6 3.9 7.6 9V16" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10.9 4.5c-1.8 3-2.4 7.3-2 11.5" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 16h16c2.2 0 3.5.8 3.5 1.8 0 .9-1.3 1.5-3.4 1.5H12.6c-1.6 0-2.6-1.2-2.6-3.3" })
		]
	});
}
function Icono(p) {
	const clase = cx(Icono_module_default.icono, p.tamano === void 0 ? Icono_module_default.md : Icono_module_default[`t${p.tamano}`], p.className);
	const a11y = p.etiqueta ? {
		role: "img",
		"aria-label": p.etiqueta
	} : {
		"aria-hidden": true,
		focusable: "false"
	};
	const sw = trazo$1(p.tamano);
	if (p.nombre === "Gorra") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gorra, {
		className: clase,
		strokeWidth: sw,
		a11y
	});
	const Componente = LUCIDE[p.nombre];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Componente, {
		className: clase,
		strokeWidth: sw,
		absoluteStrokeWidth: false,
		"data-icono": p.nombre,
		...a11y
	});
}
var Kbd_module_default = { kbd: "_kbd_tpjpa_1" };
function Kbd(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
		className: cx(Kbd_module_default.kbd, p.className),
		children: p.children
	});
}
var Tooltip_module_default = {
	ancla: "_ancla_4uuza_1",
	globo: "_globo_4uuza_5",
	visible: "_visible_4uuza_31"
};
/**
* Tooltip de 02 §7.20 / §11.1: surface-4, borde, sombra 3, radio 8. Aparece a los 500 ms con el puntero, al instante
* con el foco de teclado y con toque largo. Nunca es la única forma de leer algo (el texto ya está en aria-label o en
* la tabla gemela). Se pinta en un portal con posición fija (no lo recorta un overflow).
*/
var RETRASO_PUNTERO_MS = 500;
var MARGEN$1 = 8;
function esFocoVisible(el) {
	if (!el) return false;
	try {
		return el.matches(":focus-visible");
	} catch {
		return true;
	}
}
function Tooltip(p) {
	const id = (0, import_react.useId)();
	const ancla = (0, import_react.useRef)(null);
	const globo = (0, import_react.useRef)(null);
	const reloj = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [pos, setPos] = (0, import_react.useState)(null);
	const limpiar = (0, import_react.useCallback)(() => {
		if (reloj.current !== null) window.clearTimeout(reloj.current);
		reloj.current = null;
	}, []);
	const mostrar = (0, import_react.useCallback)((retraso) => {
		limpiar();
		if (retraso <= 0) setVisible(true);
		else reloj.current = window.setTimeout(() => setVisible(true), retraso);
	}, [limpiar]);
	const ocultar = (0, import_react.useCallback)(() => {
		limpiar();
		setVisible(false);
		setPos(null);
	}, [limpiar]);
	(0, import_react.useEffect)(() => limpiar, [limpiar]);
	(0, import_react.useEffect)(() => {
		if (p.desactivado) ocultar();
	}, [p.desactivado, ocultar]);
	(0, import_react.useEffect)(() => {
		if (!visible) return void 0;
		const alTecla = (e) => {
			if (e.key === "Escape") ocultar();
		};
		const alScroll = () => ocultar();
		document.addEventListener("keydown", alTecla);
		window.addEventListener("scroll", alScroll, {
			capture: true,
			passive: true
		});
		return () => {
			document.removeEventListener("keydown", alTecla);
			window.removeEventListener("scroll", alScroll, { capture: true });
		};
	}, [visible, ocultar]);
	(0, import_react.useLayoutEffect)(() => {
		if (!visible) return;
		const destino = ancla.current?.firstElementChild;
		const g = globo.current;
		if (!destino || !g) return;
		const r = destino.getBoundingClientRect();
		const ancho = g.offsetWidth;
		const alto = g.offsetHeight;
		let x = r.left + r.width / 2 - ancho / 2;
		x = Math.max(MARGEN$1, Math.min(window.innerWidth - ancho - MARGEN$1, x));
		let y = r.top - alto - MARGEN$1;
		let abajo = false;
		if (y < MARGEN$1) {
			y = r.bottom + MARGEN$1;
			abajo = true;
		}
		setPos({
			x,
			y,
			abajo
		});
	}, [visible, p.contenido]);
	const activo = !p.desactivado;
	const hijo = (0, import_react.cloneElement)(p.children, visible && activo ? { "aria-describedby": id } : {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: ancla,
		className: Tooltip_module_default.ancla,
		onMouseEnter: activo ? () => mostrar(RETRASO_PUNTERO_MS) : void 0,
		onMouseLeave: activo ? ocultar : void 0,
		onFocus: activo ? (e) => {
			if (esFocoVisible(e.target)) mostrar(0);
		} : void 0,
		onBlur: activo ? ocultar : void 0,
		onPointerDown: activo ? (e) => {
			if (e.pointerType === "mouse") ocultar();
		} : void 0,
		onTouchStart: activo ? () => mostrar(RETRASO_PUNTERO_MS) : void 0,
		onTouchEnd: activo ? () => {
			limpiar();
			if (visible) reloj.current = window.setTimeout(ocultar, 1500);
		} : void 0,
		children: [hijo, visible && activo && typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: globo,
			id,
			role: "tooltip",
			"data-capa-corte": "",
			"data-abajo": pos?.abajo ? "" : void 0,
			className: cx(Tooltip_module_default.globo, pos && Tooltip_module_default.visible, p.className),
			style: pos ? {
				left: pos.x,
				top: pos.y
			} : {
				left: -9999,
				top: -9999
			},
			children: p.contenido
		}), document.body) : null]
	});
}
/**
* Lectura del entorno SIN depender de @/app (la capa componentes solo importa @/dominio, BUILD_SPEC §8.2):
* - plataforma: atributo data-platform de <html> (lo pone ui-marco o Java; nunca el user-agent, 02 §13);
* - clases de ancho de 02 §5.1 con matchMedia;
* - devicePixelRatio para elegir la variante de imagen (02 §8.2).
*/
var hayDom = () => typeof window !== "undefined" && typeof document !== "undefined";
function suscribirHtml(avisar) {
	if (!hayDom() || typeof MutationObserver === "undefined") return () => void 0;
	const o = new MutationObserver(avisar);
	o.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [
			"data-platform",
			"data-density",
			"data-theme",
			"style"
		]
	});
	return () => o.disconnect();
}
function plataformaHtml() {
	if (!hayDom()) return "windows";
	return document.documentElement.getAttribute("data-platform") === "android" ? "android" : "windows";
}
/** 'android' si <html data-platform="android">; si no, 'windows' (también en el navegador de desarrollo). */
function usePlataformaHtml() {
	return (0, import_react.useSyncExternalStore)(suscribirHtml, plataformaHtml, () => "windows");
}
function densidadHtml() {
	if (!hayDom()) return "comfortable";
	return document.documentElement.getAttribute("data-density") ?? "comfortable";
}
/** Cambia cuando cambian data-density o el estilo en línea de <html> (Java escribe ahí --fs). */
function useFirmaDensidad() {
	return (0, import_react.useSyncExternalStore)(suscribirHtml, () => `${densidadHtml()}|${hayDom() ? document.documentElement.style.getPropertyValue("--fs") : ""}`, () => "comfortable|");
}
function consulta(q) {
	return hayDom() && typeof window.matchMedia === "function" && window.matchMedia(q).matches;
}
function useMedia(q, servidor = false) {
	return (0, import_react.useSyncExternalStore)((avisar) => {
		if (!hayDom() || typeof window.matchMedia !== "function") return () => void 0;
		const l = window.matchMedia(q);
		l.addEventListener("change", avisar);
		window.addEventListener("resize", avisar);
		return () => {
			l.removeEventListener("change", avisar);
			window.removeEventListener("resize", avisar);
		};
	}, () => consulta(q), () => servidor);
}
/** Media 600–1179 (riel de 80). */
var MEDIA_MEDIA = "(min-width: 600px) and (max-width: 1179px)";
function dprActual() {
	if (!hayDom()) return 1;
	const d = window.devicePixelRatio;
	return typeof d === "number" && d > 0 ? d : 1;
}
/** devicePixelRatio con aviso al cambiar de pantalla o de zoom. */
function useDpr() {
	return (0, import_react.useSyncExternalStore)((avisar) => {
		if (!hayDom()) return () => void 0;
		window.addEventListener("resize", avisar);
		return () => window.removeEventListener("resize", avisar);
	}, dprActual, () => 1);
}
var Boton_module_default = {
	boton: "_boton_1ng6u_2",
	contenido: "_contenido_1ng6u_32",
	texto: "_texto_1ng6u_39",
	sm: "_sm_1ng6u_46",
	md: "_md_1ng6u_56",
	lg: "_lg_1ng6u_59",
	completo: "_completo_1ng6u_65",
	primario: "_primario_1ng6u_87",
	secundario: "_secundario_1ng6u_98",
	fantasma: "_fantasma_1ng6u_107",
	peligro: "_peligro_1ng6u_118",
	cargando: "_cargando_1ng6u_137",
	spinner: "_spinner_1ng6u_143",
	girar: "_girar_1ng6u_1"
};
function Boton(p) {
	const plataforma = usePlataformaHtml();
	const variante = p.variante ?? "secundario";
	const tamano = p.tamano ?? "md";
	const inactivo = !!p.deshabilitado || !!p.cargando;
	const tamIcono = tamano === "sm" ? 16 : 18;
	const boton = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: p.tipo ?? "button",
		className: cx(Boton_module_default.boton, Boton_module_default[variante], Boton_module_default[tamano], p.anchoCompleto && Boton_module_default.completo, p.cargando && Boton_module_default.cargando, p.className),
		"data-variante": variante,
		disabled: !!p.deshabilitado,
		"aria-disabled": p.cargando ? true : void 0,
		"aria-busy": p.cargando ? true : void 0,
		"aria-label": p["aria-label"],
		"aria-keyshortcuts": p.atajo,
		onClick: () => {
			if (!inactivo) p.alPulsar?.();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Boton_module_default.contenido,
			children: [
				p.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: p.icono,
					tamano: tamIcono
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Boton_module_default.texto,
					children: p.children
				}),
				p.iconoFinal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: p.iconoFinal,
					tamano: tamIcono
				}) : null
			]
		}), p.cargando ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Boton_module_default.spinner, "anim-loop"),
			"aria-hidden": "true"
		}) : null]
	});
	if (!p.atajo) return boton;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
		desactivado: plataforma === "android",
		contenido: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atajo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, { children: p.atajo })] }),
		children: boton
	});
}
var BotonIcono_module_default = {
	boton: "_boton_1m9rd_1",
	sm: "_sm_1m9rd_20",
	fantasma: "_fantasma_1m9rd_25",
	secundario: "_secundario_1m9rd_32",
	activo: "_activo_1m9rd_41",
	girando: "_girando_1m9rd_76",
	girar: "_girar_1m9rd_1"
};
function BotonIcono(p) {
	const plataforma = usePlataformaHtml();
	const tamano = p.tamano ?? "md";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
		contenido: p.etiqueta,
		desactivado: plataforma === "android",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cx(BotonIcono_module_default.boton, BotonIcono_module_default[p.variante ?? "fantasma"], BotonIcono_module_default[tamano], p.activo && BotonIcono_module_default.activo, p.className),
			"aria-label": p.etiqueta,
			"aria-pressed": p.activo === void 0 ? void 0 : p.activo,
			disabled: !!p.deshabilitado,
			onClick: () => p.alPulsar?.(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: p.icono,
				tamano: tamano === "sm" ? 16 : 18,
				className: cx(p.girando && BotonIcono_module_default.girando, p.girando && "anim-loop")
			})
		})
	});
}
var Chip_module_default = {
	chip: "_chip_plgwq_2",
	conIcono: "_conIcono_plgwq_23",
	texto: "_texto_plgwq_26",
	prefijo: "_prefijo_plgwq_32",
	lg: "_lg_plgwq_35",
	ok: "_ok_plgwq_44",
	info: "_info_plgwq_45",
	atencion: "_atencion_plgwq_46",
	critico: "_critico_plgwq_47",
	neutro: "_neutro_plgwq_48",
	marca: "_marca_plgwq_49",
	etapa: "_etapa_plgwq_53",
	punto: "_punto_plgwq_59",
	paso0: "_paso0_plgwq_68",
	paso1: "_paso1_plgwq_69",
	paso2: "_paso2_plgwq_70",
	paso3: "_paso3_plgwq_71",
	paso4: "_paso4_plgwq_72",
	pasoNo: "_pasoNo_plgwq_73"
};
function Chip(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Chip_module_default.chip, Chip_module_default[p.tono], p.tamano === "lg" && Chip_module_default.lg, p.icono && Chip_module_default.conIcono, p.className),
		title: p.titulo,
		children: [p.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: p.icono,
			tamano: 14
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Chip_module_default.texto,
			children: [p.prefijo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Chip_module_default.prefijo,
				children: [p.prefijo, " "]
			}) : null, p.children]
		})]
	});
}
var CLASE_PASO = {
	0: "paso0",
	1: "paso1",
	2: "paso2",
	3: "paso3",
	4: "paso4",
	no: "pasoNo"
};
function ChipEtapa(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Chip_module_default.chip, Chip_module_default.etapa, Chip_module_default.conIcono, p.className),
		"data-paso": String(p.paso),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: p.icono,
				tamano: 14
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: cx(Chip_module_default.punto, Chip_module_default[CLASE_PASO[p.paso]], "fc-keep"),
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Chip_module_default.texto,
				children: [p.prefijo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Chip_module_default.prefijo,
					children: [p.prefijo, " "]
				}) : null, p.children]
			})
		]
	});
}
var ChipFiltro_module_default = {
	chip: "_chip_1kf1o_1",
	texto: "_texto_1kf1o_38",
	conteo: "_conteo_1kf1o_41"
};
function ChipFiltro(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cx(ChipFiltro_module_default.chip, "hit", p.activo && "fc-selected", p.className),
		"aria-pressed": p.activo,
		onClick: () => p.alCambiar(!p.activo),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: ChipFiltro_module_default.texto,
			children: p.children
		}), p.conteo !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: ChipFiltro_module_default.conteo,
			children: formato.numero(p.conteo)
		}) : null]
	});
}
var Insignia_module_default = {
	insignia: "_insignia_nqzwq_1",
	atencion: "_atencion_nqzwq_17",
	critica: "_critica_nqzwq_18",
	discreta: "_discreta_nqzwq_19",
	marca: "_marca_nqzwq_20",
	sr: "_sr_nqzwq_21 _sr_1r6wq_4"
};
function Insignia(p) {
	const maximo = p.maximo ?? 99;
	const texto = p.valor > maximo ? `${formato.numero(maximo)}+` : formato.numero(p.valor);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Insignia_module_default.insignia, Insignia_module_default[p.variante], "fc-fill", p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-hidden": "true",
			children: texto
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Insignia_module_default.sr,
			children: p.etiqueta
		})]
	});
}
var PuntoVivo_module_default = {
	punto: "_punto_1n71l_1",
	ok: "_ok_1n71l_10",
	sincronizando: "_sincronizando_1n71l_11",
	error: "_error_1n71l_12",
	inactivo: "_inactivo_1n71l_13",
	halo: "_halo_1n71l_15"
};
/**
* Punto vivo (02 §7.2): 8 px. Cuando `pulsos` cambia de valor, el halo hace scale(1→2.2) y opacity(.5→0) 3 veces y se
* detiene. Nunca anima box-shadow; se pausa con la pestaña oculta y no anima con movimiento reducido (.anim-loop).
* Es decorativo: el texto de estado va al lado.
*/
function PuntoVivo(p) {
	const previo = (0, import_react.useRef)(p.pulsos);
	const [ronda, setRonda] = (0, import_react.useState)(0);
	const [oculto, setOculto] = (0, import_react.useState)(() => typeof document !== "undefined" && document.hidden);
	(0, import_react.useEffect)(() => {
		if (p.pulsos !== void 0 && previo.current !== void 0 && p.pulsos !== previo.current) setRonda((r) => r + 1);
		previo.current = p.pulsos;
	}, [p.pulsos]);
	(0, import_react.useEffect)(() => {
		const alCambiar = () => setOculto(document.hidden);
		document.addEventListener("visibilitychange", alCambiar);
		return () => document.removeEventListener("visibilitychange", alCambiar);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(PuntoVivo_module_default.punto, PuntoVivo_module_default[p.estado], "fc-fill", p.className),
		"aria-hidden": "true",
		"data-estado": p.estado,
		children: ronda > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(PuntoVivo_module_default.halo, "anim-loop"),
			"data-pausado": oculto ? "" : void 0
		}, ronda) : null
	});
}
var Tarjeta_module_default = {
	tarjeta: "_tarjeta_12stm_1",
	ninguno: "_ninguno_12stm_9",
	normal: "_normal_12stm_10",
	amplio: "_amplio_12stm_11",
	pulsable: "_pulsable_12stm_14"
};
function Tarjeta(p) {
	const relleno = Tarjeta_module_default[p.padding ?? "normal"];
	if (!p.alPulsar) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Tarjeta_module_default.tarjeta, relleno, p.className),
		...p.etiqueta ? {
			role: "group",
			"aria-label": p.etiqueta
		} : {},
		children: p.children
	});
	const alPulsar = p.alPulsar;
	const alTecla = (e) => {
		if (e.target !== e.currentTarget) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			alPulsar();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "button",
		tabIndex: 0,
		"aria-label": p.etiqueta,
		className: cx(Tarjeta_module_default.tarjeta, relleno, Tarjeta_module_default.pulsable, p.className),
		onClick: () => alPulsar(),
		onKeyDown: alTecla,
		children: p.children
	});
}
var PanelFirma_module_default = { panel: "_panel_deivf_5" };
function PanelFirma(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cx(PanelFirma_module_default.panel, p.className),
		children: p.children
	});
}
/** Enlaces a rutas hash (BUILD_SPEC §8.6) sin depender de @/app: '/ventas' → '#/ventas'. */
function hrefDeRuta(a) {
	if (a.startsWith("#")) return a;
	return `#${a.startsWith("/") ? a : `/${a}`}`;
}
/** Quita un "›" final del texto (el componente pone su propio chevrón). */
function sinChevron(texto) {
	return texto.replace(/\s*›\s*$/, "");
}
var Banda_module_default = {
	banda: "_banda_1ptwn_1",
	encabezado: "_encabezado_1ptwn_4",
	titulo: "_titulo_1ptwn_12 _titulo3_1r6wq_57",
	accion: "_accion_1ptwn_18 _enlace_1r6wq_33"
};
/**
* Banda abierta sobre el lienzo, sin tarjeta (02 §5 ritmo de superficies): encabezado title3 y acción opcional
* "Ver todos ›" (enlace de la ruta hash, sin depender de @/app).
*/
function Banda(p) {
	const idTitulo = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(Banda_module_default.banda, p.className),
		id: p.id,
		"aria-labelledby": idTitulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: Banda_module_default.encabezado,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: Banda_module_default.titulo,
				id: idTitulo,
				children: p.titulo
			}), p.accion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: Banda_module_default.accion,
				href: hrefDeRuta(p.accion.a),
				children: [sinChevron(p.accion.etiqueta), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 16
				})]
			}) : null]
		}), p.children]
	});
}
var EncabezadoPantalla_module_default = {
	centinela: "_centinela_yyyu0_1",
	fondo: "_fondo_yyyu0_8",
	colapsado: "_colapsado_yyyu0_17",
	win: "_win_yyyu0_25",
	textos: "_textos_yyyu0_41",
	titulo: "_titulo_yyyu0_50",
	contexto: "_contexto_yyyu0_59",
	acciones: "_acciones_yyyu0_65",
	volver: "_volver_yyyu0_100",
	and: "_and_yyyu0_121",
	tituloAnd: "_tituloAnd_yyyu0_141",
	tituloEscala: "_tituloEscala_yyyu0_151",
	contextoAnd: "_contextoAnd_yyyu0_163"
};
/**
* Encabezado de pantalla (02 §7.9).
* - Windows: 56 px pegajoso (mínimo); transparente en reposo y, al hacer scroll, capa .glass con borde inferior sutil
*   (fundido de 200 ms solo de opacidad). Título de 30/700 y contexto de 14 en text-3, como el lienzo aprobado (manda
*   sobre title2 de 02 §7.9 en jerarquía, LEEME.md:17); acciones a la derecha con buscador de 40 y botones de 40×40.
* - Android: barra pegajosa de 56 dp (+ inset superior) con el título grande (title1) que, al hacer scroll, se reduce
*   a 17 con transform (sin animar alturas) y la barra pasa a .glass. El contexto queda debajo y se va con el scroll.
* El scroll se detecta con un centinela de 1 px e IntersectionObserver (sirve con cualquier contenedor de scroll).
*/
function useConScroll() {
	const centinela = (0, import_react.useRef)(null);
	const [conScroll, setConScroll] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = centinela.current;
		if (!el || typeof IntersectionObserver === "undefined") return void 0;
		const o = new IntersectionObserver(([e]) => setConScroll(e ? !e.isIntersecting && e.boundingClientRect.top < 0 : false), { threshold: [0, 1] });
		o.observe(el);
		return () => o.disconnect();
	}, []);
	return [centinela, conScroll];
}
function EncabezadoPantalla(p) {
	const plataforma = usePlataformaHtml();
	const [centinela, conScroll] = useConScroll();
	const volver = p.volver ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		className: EncabezadoPantalla_module_default.volver,
		href: hrefDeRuta(p.volver.a),
		"aria-label": p.volver.etiqueta ?? "Volver",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: plataforma === "android" ? "ArrowLeft" : "ChevronLeft",
			tamano: plataforma === "android" ? 22 : 18
		}), plataforma === "android" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.volver.etiqueta ?? "Volver" })]
	}) : null;
	if (plataforma === "android") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: centinela,
			className: EncabezadoPantalla_module_default.centinela,
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cx(EncabezadoPantalla_module_default.and, conScroll && EncabezadoPantalla_module_default.colapsado, p.className),
			"data-con-scroll": conScroll ? "" : void 0,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx(EncabezadoPantalla_module_default.fondo, "glass"),
					"aria-hidden": "true"
				}),
				volver,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: EncabezadoPantalla_module_default.tituloAnd,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: EncabezadoPantalla_module_default.tituloEscala,
						children: p.titulo
					})
				}),
				p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: EncabezadoPantalla_module_default.acciones,
					children: p.acciones
				}) : null
			]
		}),
		p.contexto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: EncabezadoPantalla_module_default.contextoAnd,
			children: p.contexto
		}) : null
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: centinela,
		className: EncabezadoPantalla_module_default.centinela,
		"aria-hidden": "true"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cx(EncabezadoPantalla_module_default.win, conScroll && EncabezadoPantalla_module_default.colapsado, p.className),
		"data-con-scroll": conScroll ? "" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(EncabezadoPantalla_module_default.fondo, "glass"),
				"aria-hidden": "true"
			}),
			volver,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: EncabezadoPantalla_module_default.textos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: EncabezadoPantalla_module_default.titulo,
					children: p.titulo
				}), p.contexto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: EncabezadoPantalla_module_default.contexto,
					children: p.contexto
				}) : null]
			}),
			p.acciones ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: EncabezadoPantalla_module_default.acciones,
				children: p.acciones
			}) : null
		]
	})] });
}
var graficas_module_default = {
	grafica: "_grafica_1cmyh_2",
	cabeza: "_cabeza_1cmyh_9",
	titulo: "_titulo_1cmyh_16 _titulo3_1r6wq_57",
	nota: "_nota_1cmyh_22",
	notaCifra: "_notaCifra_1cmyh_28",
	verTabla: "_verTabla_1cmyh_32",
	leyenda: "_leyenda_1cmyh_36",
	area: "_area_1cmyh_39",
	aparece: "_aparece_1cmyh_44",
	trazar: "_trazar_1cmyh_1",
	apareceFundido: "_apareceFundido_1cmyh_47",
	fundir: "_fundir_1cmyh_1",
	sr: "_sr_1cmyh_58 _sr_1r6wq_4",
	svg: "_svg_1cmyh_61",
	reticula: "_reticula_1cmyh_69",
	base: "_base_1cmyh_74",
	eje: "_eje_1cmyh_79",
	ejeActivo: "_ejeActivo_1cmyh_84",
	pico: "_pico_1cmyh_87",
	enCursoTexto: "_enCursoTexto_1cmyh_93",
	ultimoValor: "_ultimoValor_1cmyh_99",
	marca: "_marca_1cmyh_106",
	objetivo: "_objetivo_1cmyh_110",
	marcaActiva: "_marcaActiva_1cmyh_113",
	barra: "_barra_1cmyh_121",
	marcaPico: "_marcaPico_1cmyh_126",
	enCurso: "_enCurso_1cmyh_93",
	segmento: "_segmento_1cmyh_141",
	tenue: "_tenue_1cmyh_144",
	s1: "_s1_1cmyh_148",
	s2: "_s2_1cmyh_149",
	s3: "_s3_1cmyh_150",
	s4: "_s4_1cmyh_151",
	s5: "_s5_1cmyh_152",
	s6: "_s6_1cmyh_153",
	s7: "_s7_1cmyh_154",
	s8: "_s8_1cmyh_155",
	neutroSerie: "_neutroSerie_1cmyh_156",
	rayadoFondo: "_rayadoFondo_1cmyh_157",
	rayadoLinea: "_rayadoLinea_1cmyh_158",
	muestra: "_muestra_1cmyh_161",
	m1: "_m1_1cmyh_167",
	m2: "_m2_1cmyh_168",
	m3: "_m3_1cmyh_169",
	m4: "_m4_1cmyh_170",
	m5: "_m5_1cmyh_171",
	m6: "_m6_1cmyh_172",
	m7: "_m7_1cmyh_173",
	m8: "_m8_1cmyh_174",
	t1: "_t1_1cmyh_175",
	t2: "_t2_1cmyh_176",
	t3: "_t3_1cmyh_177",
	t4: "_t4_1cmyh_178",
	t5: "_t5_1cmyh_179",
	t6: "_t6_1cmyh_180",
	t7: "_t7_1cmyh_181",
	t8: "_t8_1cmyh_182",
	mRayado: "_mRayado_1cmyh_183",
	mNeutro: "_mNeutro_1cmyh_187",
	mono: "_mono_1cmyh_188",
	leyendaLista: "_leyendaLista_1cmyh_190",
	leyendaElemento: "_leyendaElemento_1cmyh_201",
	leyendaValor: "_leyendaValor_1cmyh_207",
	leyendaPct: "_leyendaPct_1cmyh_211",
	lectura: "_lectura_1cmyh_216",
	lecturaValor: "_lecturaValor_1cmyh_233",
	lecturaEtiqueta: "_lecturaEtiqueta_1cmyh_238",
	lecturaFilas: "_lecturaFilas_1cmyh_243",
	lecturaFila: "_lecturaFila_1cmyh_243",
	lecturaFilaEtiqueta: "_lecturaFilaEtiqueta_1cmyh_265",
	clave: "_clave_1cmyh_269",
	apilada: "_apilada_1cmyh_283",
	bloque: "_bloque_1cmyh_289",
	bloqueActivo: "_bloqueActivo_1cmyh_296",
	bloqueVacio: "_bloqueVacio_1cmyh_302",
	directas: "_directas_1cmyh_307",
	directasDos: "_directasDos_1cmyh_312",
	directa: "_directa_1cmyh_307",
	directaSegunda: "_directaSegunda_1cmyh_326",
	lecturaLinea: "_lecturaLinea_1cmyh_330",
	horizontales: "_horizontales_1cmyh_342",
	hElemento: "_hElemento_1cmyh_350",
	hContenido: "_hContenido_1cmyh_353",
	hPulsable: "_hPulsable_1cmyh_366",
	hFila: "_hFila_1cmyh_372",
	hEtiqueta: "_hEtiqueta_1cmyh_381",
	hValor: "_hValor_1cmyh_389",
	hSecundario: "_hSecundario_1cmyh_397",
	hPista: "_hPista_1cmyh_400",
	hBarra: "_hBarra_1cmyh_407",
	calMarco: "_calMarco_1cmyh_422",
	celdaCal: "_celdaCal_1cmyh_427",
	celdaActiva: "_celdaActiva_1cmyh_432",
	q0: "_q0_1cmyh_436",
	q1: "_q1_1cmyh_437",
	q2: "_q2_1cmyh_438",
	q3: "_q3_1cmyh_439",
	q4: "_q4_1cmyh_440",
	q5: "_q5_1cmyh_441",
	calLeyenda: "_calLeyenda_1cmyh_442",
	calMuestra: "_calMuestra_1cmyh_449",
	calVacio: "_calVacio_1cmyh_454",
	sparkline: "_sparkline_1cmyh_461",
	sparkSvg: "_sparkSvg_1cmyh_465",
	sparkLinea: "_sparkLinea_1cmyh_469",
	sparkVacia: "_sparkVacia_1cmyh_476",
	sparkAhora: "_sparkAhora_1cmyh_480",
	tablaGemela: "_tablaGemela_1cmyh_487",
	tabla: "_tabla_1cmyh_487",
	num: "_num_1cmyh_519"
};
function Sparkline(p) {
	const W = p.ancho ?? 96;
	const H = p.alto ?? 32;
	const valores = p.valores.filter((v) => Number.isFinite(v));
	const margen = 4.5;
	let linea = "";
	let fin = null;
	if (valores.length >= 2) {
		const max = Math.max(...valores);
		const min = Math.min(...valores);
		const rango = max - min || 1;
		const puntos = valores.map((v, i) => [margen + i * (W - margen * 2) / (valores.length - 1), margen + (1 - (v - min) / rango) * (H - margen * 2)]);
		linea = puntos.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
		fin = puntos[puntos.length - 1] ?? null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(graficas_module_default.sparkline, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: W,
			height: H,
			viewBox: `0 0 ${W} ${H}`,
			"aria-hidden": "true",
			focusable: "false",
			className: cx(graficas_module_default.sparkSvg, "fc-keep"),
			children: [linea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: linea,
				className: graficas_module_default.sparkLinea
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: margen,
				x2: W - margen,
				y1: H / 2,
				y2: H / 2,
				className: graficas_module_default.sparkVacia
			}), fin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: fin[0],
				cy: fin[1],
				r: 3,
				className: graficas_module_default.sparkAhora
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: graficas_module_default.sr,
			children: p.resumen
		})]
	});
}
var Kpi_module_default = {
	kpi: "_kpi_1vmo8_1",
	pulsable: "_pulsable_1vmo8_19",
	etiqueta: "_etiqueta_1vmo8_36",
	filaValor: "_filaValor_1vmo8_10",
	valor: "_valor_1vmo8_57",
	chispa: "_chispa_1vmo8_73",
	meta: "_meta_1vmo8_89",
	variacion: "_variacion_1vmo8_97",
	sr: "_sr_1vmo8_100 _sr_1r6wq_4",
	flecha: "_flecha_1vmo8_103",
	favorable: "_favorable_1vmo8_111",
	desfavorable: "_desfavorable_1vmo8_112",
	neutro: "_neutro_1vmo8_113",
	restoVariacion: "_restoVariacion_1vmo8_114",
	nota: "_nota_1vmo8_118"
};
function Flecha(p) {
	if (p.direccion === "igual") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: Kpi_module_default.flecha,
		viewBox: "0 0 10 10",
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "1.5",
			y: "4.25",
			width: "7",
			height: "1.5",
			rx: "0.75"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: Kpi_module_default.flecha,
		viewBox: "0 0 10 10",
		"aria-hidden": "true",
		focusable: "false",
		children: p.direccion === "sube" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 1.6 9 8.4H1z" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 8.4 1 1.6h8z" })
	});
}
var DIRECCION_LEIDA = {
	sube: "sube",
	baja: "baja",
	igual: "sin cambio"
};
/** '−21 % vs. 30 días anteriores' → cifra con color y el resto atenuado. */
function partirVariacion(texto) {
	const i = texto.indexOf(" vs.");
	if (i <= 0) return [texto, ""];
	return [texto.slice(0, i), texto.slice(i)];
}
function Kpi(p) {
	const v = p.variacion ?? null;
	const [cifra, resto] = v ? partirVariacion(v.texto) : ["", ""];
	const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Kpi_module_default.etiqueta,
			title: p.etiqueta,
			children: p.etiqueta
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Kpi_module_default.filaValor,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Kpi_module_default.valor,
				children: p.valor
			}), p.serie && p.serie.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
				valores: p.serie,
				resumen: p.resumenSerie ?? "",
				ancho: 96,
				alto: 32,
				className: cx(Kpi_module_default.chispa)
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Kpi_module_default.meta,
			children: [v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(Kpi_module_default.variacion, Kpi_module_default[v.sentido]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flecha, { direccion: v.direccion }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Kpi_module_default.sr,
						children: [DIRECCION_LEIDA[v.direccion], " "]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cifra }),
					resto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Kpi_module_default.restoVariacion,
						children: resto
					}) : null
				]
			}) : null, p.nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Kpi_module_default.nota,
				children: v ? ` · ${p.nota}` : p.nota
			}) : null]
		})
	] });
	if (p.alPulsar) {
		const alPulsar = p.alPulsar;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cx(Kpi_module_default.kpi, Kpi_module_default.pulsable, p.className),
			onClick: () => alPulsar(),
			children: contenido
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(Kpi_module_default.kpi, p.className),
		children: contenido
	});
}
var BandaKpi_module_default = {
	banda: "_banda_vbd2b_1",
	encabezado: "_encabezado_vbd2b_5",
	titulo: "_titulo_vbd2b_13 _titulo3_1r6wq_57",
	accion: "_accion_vbd2b_17 _enlace_1r6wq_33",
	rejilla: "_rejilla_vbd2b_44"
};
/**
* Banda de dinero: encabezado title3 con "Ver ventas ›" y los KPI como 4 tarjetas (surface-1, borde de 1 px, radio de
* tarjeta, relleno 18, separación 14), como el lienzo aprobado (Main.png, Ventas.png, MovilInicio.png). La composición
* del lienzo manda sobre 02 §7.3 «sin tarjeta» (LEEME.md:17); la firma no cambia. Los valores comparten línea base
* (subgrid). Con poco ancho (Android o una columna angosta) pasa a 2×2 con 10 de separación y a una sola columna cuando
* la escala de texto ya no deja caber la etiqueta (minmax en em, que crece con --fs).
*/
function BandaKpi(p) {
	const idTitulo = (0, import_react.useId)();
	const n = import_react.Children.toArray(p.children).filter(import_react.isValidElement).length;
	const columnas = Math.min(Math.max(n, 1), 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cx(BandaKpi_module_default.banda, p.className),
		"aria-labelledby": idTitulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: BandaKpi_module_default.encabezado,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: BandaKpi_module_default.titulo,
				id: idTitulo,
				children: p.titulo
			}), p.accion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: BandaKpi_module_default.accion,
				href: hrefDeRuta(p.accion.a),
				children: [sinChevron(p.accion.etiqueta), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronRight",
					tamano: 16
				})]
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: BandaKpi_module_default.rejilla,
			"data-cols": columnas,
			children: p.children
		})]
	});
}
var MosaicoTienda_module_default = {
	mosaico: "_mosaico_18bol_1",
	relleno: "_relleno_18bol_14",
	p11: "_p11_18bol_25",
	p45: "_p45_18bol_26",
	p916: "_p916_18bol_27",
	iniciales: "_iniciales_18bol_29",
	icono: "_icono_18bol_38",
	iconoSolo: "_iconoSolo_18bol_46"
};
var CLASE_PROPORCION = {
	"1:1": "p11",
	"4:5": "p45",
	"9:16": "p916"
};
function MosaicoTienda(p) {
	const nombre = p.tienda.trim();
	const tono = nombre ? tonoTienda(nombre) : "pizarra";
	const iniciales = nombre ? inicialesTienda(nombre) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(MosaicoTienda_module_default.mosaico, p.relleno ? MosaicoTienda_module_default.relleno : MosaicoTienda_module_default[CLASE_PROPORCION[p.proporcion ?? "1:1"]], p.className),
		"data-tono": tono,
		style: p.relleno ? void 0 : vars({ "--mosaico-ancho": `${p.anchoCss}px` }),
		"aria-hidden": "true",
		children: [iniciales ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
			className: MosaicoTienda_module_default.iniciales,
			children: iniciales
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: iconoCategoria(p.categoria),
			className: cx(MosaicoTienda_module_default.icono, !iniciales && MosaicoTienda_module_default.iconoSolo)
		})]
	});
}
/**
* Presupuesto de fundidos de imagen (02 §8.3, §10.3): como máximo 6 fundidos a la vez (los demás aparecen al
* instante) y ninguno mientras el scroll va a más de 1 px/ms.
*/
var MAXIMO = 6;
var activos = 0;
var escuchando$1 = false;
var ultimo = {
	t: 0,
	y: 0,
	objetivo: null
};
var rapidoHasta = 0;
function posicion(objetivo) {
	if (objetivo instanceof Element) return objetivo.scrollTop;
	return typeof window !== "undefined" ? window.scrollY : 0;
}
function alScroll(e) {
	const ahora = performance.now();
	const y = posicion(e.target === document ? null : e.target);
	if (ultimo.objetivo === e.target && ahora > ultimo.t) {
		if (Math.abs(y - ultimo.y) / (ahora - ultimo.t) > 1) rapidoHasta = ahora + 150;
	}
	ultimo = {
		t: ahora,
		y,
		objetivo: e.target
	};
}
function asegurarEscucha$1() {
	if (escuchando$1 || typeof window === "undefined") return;
	window.addEventListener("scroll", alScroll, {
		capture: true,
		passive: true
	});
	escuchando$1 = true;
}
/** true = este fundido puede animarse (y debe soltarse con soltarFundido). */
function pedirFundido() {
	asegurarEscucha$1();
	if (activos >= MAXIMO) return false;
	if (typeof performance !== "undefined" && performance.now() < rapidoHasta) return false;
	activos += 1;
	return true;
}
function soltarFundido() {
	activos = Math.max(0, activos - 1);
}
var Foto_module_default = {
	foto: "_foto_1eu2h_2",
	llenar: "_llenar_1eu2h_16",
	p11: "_p11_1eu2h_22",
	p45: "_p45_1eu2h_23",
	p916: "_p916_1eu2h_24",
	rxs: "_rxs_1eu2h_26",
	rsm: "_rsm_1eu2h_27",
	rmd: "_rmd_1eu2h_28",
	rlg: "_rlg_1eu2h_29",
	rxl: "_rxl_1eu2h_30",
	lqip: "_lqip_1eu2h_32",
	img: "_img_1eu2h_33",
	contener: "_contener_1eu2h_47",
	visible: "_visible_1eu2h_50",
	fundido: "_fundido_1eu2h_53",
	rotulo: "_rotulo_1eu2h_73"
};
/**
* Foto con carga progresiva (02 §8, C45, C47). Cuatro estados (data-estado):
*  - 'pozo'    → color dominante (meta) o --media-bg mientras carga, sin LQIP. Con '?v=0' (imagen aún no descargada en
*                el hub, C45) el pozo es SIEMPRE neutro (--media-bg, aunque llegue meta) y la foto se pide igual;
*  - 'lqip'    → pozo + LQIP a tamaño completo (ya es borroso: sin filter) mientras carga la foto;
*  - 'foto'    → la foto, con fundido de 120 ms solo de opacidad (sin fundido si ya estaba en caché, si hay 6
*                fundidos en curso o si el scroll va rápido);
*  - 'mosaico' → no hay URL o la foto falló: mosaico de la tienda con el ícono de la categoría.
* Meta: `meta` explícito o registroImagenes.leer(url) (@/dominio) con useSyncExternalStore. La variante sale de
* varianteParaAncho(anchoCss, devicePixelRatio). lazy salvo prioridad 'alta'. En Windows se puede arrastrar a otra app
* (DownloadURL con la variante original).
*/
/** Lee los metadatos de la URL del registro de @/dominio y se vuelve a pintar cuando cambian. */
function useMetaImagen(url) {
	(0, import_react.useSyncExternalStore)(registroImagenes.suscribir, registroImagenes.version, registroImagenes.version);
	return registroImagenes.leer(url);
}
function esVersionCero(url) {
	return !!url && /[?&]v=0(?:&|$)/.test(url);
}
function radioPorOmision(anchoCss) {
	if (anchoCss <= 32) return "xs";
	if (anchoCss <= 56) return "sm";
	if (anchoCss <= 96) return "md";
	return "lg";
}
var MIME = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	avif: "image/avif"
};
function FotoBase(p) {
	const plataforma = usePlataformaHtml();
	const dpr = useDpr();
	const metaRegistro = useMetaImagen(p.url);
	const versionCero = esVersionCero(p.url);
	const meta = versionCero ? void 0 : p.meta ?? metaRegistro;
	const src = p.url ? urlConVariante(p.url, varianteParaAncho(p.anchoCss, dpr)) : null;
	const pequena = !!meta && meta.w > 0 && p.anchoCss * dpr > meta.w * 2;
	const [estadoCarga, setEstadoCarga] = (0, import_react.useState)(src ? "cargando" : "error");
	const [fundido, setFundido] = (0, import_react.useState)(false);
	const [srcEstado, setSrcEstado] = (0, import_react.useState)(src);
	const imgRef = (0, import_react.useRef)(null);
	const srcPrevio = (0, import_react.useRef)(src);
	if (srcEstado !== src) {
		setSrcEstado(src);
		setEstadoCarga(src ? "cargando" : "error");
		setFundido(false);
	}
	(0, import_react.useEffect)(() => {
		srcPrevio.current = src;
	}, [src]);
	(0, import_react.useLayoutEffect)(() => {
		const img = imgRef.current;
		if (p.retenerCarga) return;
		if (img && img.complete && img.naturalWidth > 0 && estadoCarga === "cargando") setEstadoCarga("lista");
	}, [
		src,
		estadoCarga,
		p.retenerCarga
	]);
	const alCargar = (0, import_react.useCallback)(() => {
		const img = imgRef.current;
		if (p.retenerCarga) return;
		const mostrar = () => {
			if (srcPrevio.current !== src) return;
			if (pedirFundido()) {
				setFundido(true);
				window.setTimeout(soltarFundido, 180);
			}
			setEstadoCarga("lista");
		};
		if (img && typeof img.decode === "function") img.decode().then(mostrar, mostrar);
		else mostrar();
	}, [src, p.retenerCarga]);
	const estado = estadoCarga === "error" ? "mosaico" : estadoCarga === "lista" ? "foto" : meta?.lqip ? "lqip" : "pozo";
	const conLqip = !!meta?.lqip && estado !== "mosaico";
	const arrastrable = !!p.arrastrable && plataforma === "windows" && estado === "foto" && !!p.url;
	const alArrastrar = (e) => {
		if (!p.arrastrable || !p.url) return;
		const original = new URL(urlConVariante(p.url, "og"), window.location.href).href;
		const nombre = p.arrastrable.nombreArchivo.replace(/[:\r\n]/g, " ");
		const ext = (nombre.split(".").pop() ?? "").toLowerCase();
		e.dataTransfer.setData("DownloadURL", `${MIME[ext] ?? "application/octet-stream"}:${nombre}:${original}`);
		e.dataTransfer.setData("text/uri-list", original);
		e.dataTransfer.effectAllowed = "copy";
	};
	const radio = p.radio ?? radioPorOmision(p.anchoCss);
	const directo = !!p.url && /^https?:\/\//i.test(p.url);
	const respaldo = p.respaldo ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MosaicoTienda, {
		tienda: p.tienda ?? "",
		categoria: p.categoria,
		anchoCss: p.anchoCss,
		relleno: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Foto_module_default.foto, p.llenar ? Foto_module_default.llenar : Foto_module_default[CLASE_PROPORCION[p.proporcion ?? "1:1"]], Foto_module_default[`r${radio}`], p.className),
		"data-estado": estado,
		"data-version-cero": versionCero ? "" : void 0,
		style: vars({
			"--foto-ancho": `${p.anchoCss}px`,
			...meta?.color ? { "--foto-color": meta.color } : {}
		}),
		...estado === "mosaico" && p.alt ? {
			role: "img",
			"aria-label": p.alt
		} : {},
		children: [
			conLqip && meta?.lqip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				className: Foto_module_default.lqip,
				src: meta.lqip,
				alt: "",
				"aria-hidden": "true",
				decoding: "async",
				draggable: false
			}) : null,
			src && estadoCarga !== "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imgRef,
				className: cx(Foto_module_default.img, (p.ajuste === "contain" || pequena) && Foto_module_default.contener, estado === "foto" && Foto_module_default.visible, fundido && Foto_module_default.fundido),
				src,
				alt: p.alt,
				loading: p.prioridad === "alta" ? "eager" : "lazy",
				decoding: "async",
				...p.prioridad === "alta" ? { fetchPriority: "high" } : {},
				...directo ? { referrerPolicy: "no-referrer" } : {},
				draggable: arrastrable,
				onDragStart: arrastrable ? alArrastrar : void 0,
				onLoad: alCargar,
				onError: () => {
					if (srcPrevio.current === src) setEstadoCarga("error");
				}
			}, src) : null,
			estado === "mosaico" ? respaldo : null,
			p.rotulo && estado !== "mosaico" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Foto_module_default.rotulo,
				children: p.rotulo
			}) : null
		]
	});
}
function Foto(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoBase, { ...p });
}
var AvatarTienda_module_default = {
	avatar: "_avatar_ydr01_1",
	punto: "_punto_ydr01_21"
};
function AvatarTienda(p) {
	const tono = tonoTienda(p.nombre || "?");
	if (p.tamano < 20) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(AvatarTienda_module_default.avatar, AvatarTienda_module_default.punto, p.className),
		"data-tono": tono,
		title: p.nombre,
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(AvatarTienda_module_default.avatar, p.className),
		"data-tono": tono,
		title: p.nombre,
		"aria-hidden": "true",
		style: vars({ "--lado": `${p.tamano}px` }),
		children: inicialesTienda(p.nombre || "?")
	});
}
var AvatarCuenta_module_default = {
	avatar: "_avatar_h2z08_1",
	foto: "_foto_h2z08_17",
	iniciales: "_iniciales_h2z08_21"
};
function AvatarCuenta(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(AvatarCuenta_module_default.avatar, p.className),
		style: vars({ "--lado": `${p.tamano}px` }),
		title: `@${p.username}`,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: AvatarCuenta_module_default.iniciales,
			children: inicialesTienda(p.username || "?")
		}), p.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoBase, {
			url: p.url,
			alt: "",
			anchoCss: p.tamano,
			llenar: true,
			respaldo: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, {}),
			className: cx(AvatarCuenta_module_default.foto)
		}) : null]
	});
}
var MiniaturaVideo_module_default = {
	miniatura: "_miniatura_xixe7_1",
	pulsable: "_pulsable_xixe7_24",
	fondo: "_fondo_xixe7_37",
	producto: "_producto_xixe7_51",
	rotulo: "_rotulo_xixe7_61",
	ranking: "_ranking_xixe7_100",
	rankingUno: "_rankingUno_xixe7_116",
	play: "_play_xixe7_121",
	datos: "_datos_xixe7_139",
	comision: "_comision_xixe7_149",
	unidades: "_unidades_xixe7_159",
	nombre: "_nombre_xixe7_160",
	conPoster: "_conPoster_xixe7_211",
	poster: "_poster_xixe7_214",
	posterFecha: "_posterFecha_xixe7_221",
	posterNota: "_posterNota_xixe7_229",
	posterRanking: "_posterRanking_xixe7_235"
};
function MiniaturaVideo(p) {
	const metaRegistro = useMetaImagen(p.url);
	const meta = p.meta ?? metaRegistro;
	const tono = p.tienda ? tonoTienda(p.tienda) : "pizarra";
	const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		p.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: MiniaturaVideo_module_default.fondo,
				style: meta?.color ? vars({ "--fondo-color": meta.color }) : void 0,
				"aria-hidden": "true",
				children: meta?.lqip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: meta.lqip,
					alt: "",
					decoding: "async",
					draggable: false
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoBase, {
				url: p.url,
				alt: "",
				anchoCss: Math.round(p.anchoCss * 16 / 9),
				proporcion: "1:1",
				radio: "xs",
				tienda: p.tienda,
				className: cx(MiniaturaVideo_module_default.producto),
				...p.meta ? { meta: p.meta } : {}
			}),
			p.rotulo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: MiniaturaVideo_module_default.rotulo,
				children: p.rotulo
			}) : null
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: MiniaturaVideo_module_default.poster,
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: MiniaturaVideo_module_default.posterFecha,
					children: p.fechaPoster
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
					className: MiniaturaVideo_module_default.posterNota,
					children: "primera venta"
				}),
				p.ranking !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: MiniaturaVideo_module_default.posterRanking,
					children: ["#", p.ranking]
				}) : null
			]
		}),
		p.ranking !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cx(MiniaturaVideo_module_default.ranking, p.ranking === 1 && MiniaturaVideo_module_default.rankingUno),
			"aria-hidden": "true",
			children: ["#", p.ranking]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: MiniaturaVideo_module_default.play,
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 12 12",
				focusable: "false",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3.2 1.9v8.2a.6.6 0 0 0 .9.5l6.5-4.1a.6.6 0 0 0 0-1L4.1 1.4a.6.6 0 0 0-.9.5z" })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: MiniaturaVideo_module_default.datos,
			"aria-hidden": "true",
			children: [
				p.comision ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: MiniaturaVideo_module_default.comision,
					children: p.comision
				}) : null,
				p.unidades ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: MiniaturaVideo_module_default.unidades,
					children: p.unidades
				}) : null,
				p.nombre ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: MiniaturaVideo_module_default.nombre,
					children: p.nombre
				}) : null
			]
		})
	] });
	const clase = cx(MiniaturaVideo_module_default.miniatura, !p.url && MiniaturaVideo_module_default.conPoster, p.className);
	const estilo = vars({ "--ancho": `${p.anchoCss}px` });
	if (p.alPulsar) {
		const alPulsar = p.alPulsar;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: cx(clase, MiniaturaVideo_module_default.pulsable),
			"data-tono": tono,
			style: estilo,
			"aria-label": p.etiqueta,
			onClick: () => alPulsar(),
			children: contenido
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: clase,
		"data-tono": tono,
		style: estilo,
		role: "img",
		"aria-label": p.etiqueta,
		children: contenido
	});
}
var TarjetaProducto_module_default = {
	tarjeta: "_tarjeta_1erjl_1",
	pulsable: "_pulsable_1erjl_25",
	nombreBoton: "_nombreBoton_1erjl_36",
	foto: "_foto_1erjl_40",
	ranking: "_ranking_1erjl_45",
	rankingUno: "_rankingUno_1erjl_62",
	cuerpo: "_cuerpo_1erjl_68",
	tienda: "_tienda_1erjl_76",
	tiendaNombre: "_tiendaNombre_1erjl_86 _recorte1_1r6wq_17",
	nombre: "_nombre_1erjl_36 _recorte2_1r6wq_24",
	cifras: "_cifras_1erjl_119",
	principal: "_principal_1erjl_128",
	secundaria: "_secundaria_1erjl_136",
	chips: "_chips_1erjl_142"
};
function TarjetaProducto(p) {
	const alPulsar = p.alPulsar;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cx(TarjetaProducto_module_default.tarjeta, alPulsar && TarjetaProducto_module_default.pulsable, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FotoBase, {
				url: p.imagen,
				alt: p.nombre,
				anchoCss: 240,
				proporcion: "1:1",
				tienda: p.tienda,
				categoria: p.categoria ?? null,
				className: cx(TarjetaProducto_module_default.foto),
				...p.meta ? { meta: p.meta } : {}
			}),
			p.ranking !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(TarjetaProducto_module_default.ranking, p.ranking === 1 && TarjetaProducto_module_default.rankingUno),
				"aria-label": `Lugar ${p.ranking}`,
				children: ["#", p.ranking]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: TarjetaProducto_module_default.cuerpo,
				children: [
					p.tienda ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaProducto_module_default.tienda,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarTienda, {
							nombre: p.tienda,
							tamano: 20
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: TarjetaProducto_module_default.tiendaNombre,
							children: p.tienda
						})]
					}) : null,
					alPulsar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cx(TarjetaProducto_module_default.nombre, TarjetaProducto_module_default.nombreBoton),
						onClick: () => alPulsar(),
						title: p.nombre,
						children: p.nombre
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: TarjetaProducto_module_default.nombre,
						title: p.nombre,
						children: p.nombre
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: TarjetaProducto_module_default.cifras,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: TarjetaProducto_module_default.principal,
							children: p.cifraPrincipal
						}), p.cifraSecundaria ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: TarjetaProducto_module_default.secundaria,
							children: p.cifraSecundaria
						}) : null]
					}),
					p.chips ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: TarjetaProducto_module_default.chips,
						children: p.chips
					}) : null
				]
			})
		]
	});
}
var ReproductorTikTok_module_default = {
	reproductor: "_reproductor_avio7_1",
	iframe: "_iframe_avio7_14",
	iframeListo: "_iframeListo_avio7_23",
	capa: "_capa_avio7_26",
	glifo: "_glifo_avio7_38",
	glifoFallo: "_glifoFallo_avio7_47",
	texto: "_texto_avio7_56",
	textoFuerte: "_textoFuerte_avio7_63",
	spinner: "_spinner_avio7_70",
	girar: "_girar_avio7_1"
};
/**
* Reproductor oficial de TikTok bajo demanda (C4, C43). SOLO Windows: quien lo usa comprueba esWindows().
* Póster con [Reproducir aquí]; al pulsar, un <iframe> endurecido:
*   src="https://www.tiktok.com/player/v1/{contentId}"
*   sandbox="allow-scripts allow-same-origin allow-presentation"   (sin popups ni navegación superior)
*   referrerpolicy="strict-origin-when-cross-origin"               (solo en el iframe)
*   allow="autoplay; fullscreen"
* Si no carga en 8 s, si no hay internet o si el id no es válido: "No se pudo reproducir aquí" + [Abrir en TikTok].
*/
var TOPE_CARGA_MS = 8e3;
var SANDBOX_REPRODUCTOR = "allow-scripts allow-same-origin allow-presentation";
var REFERRER_REPRODUCTOR = "strict-origin-when-cross-origin";
var ALLOW_REPRODUCTOR = "autoplay; fullscreen";
function ReproductorTikTok(p) {
	const [estado, setEstado] = (0, import_react.useState)(p.estadoInicial ?? "poster");
	const [idPrevio, setIdPrevio] = (0, import_react.useState)(p.contentId);
	const reloj = (0, import_react.useRef)(null);
	const valido = /^\d{6,32}$/.test(p.contentId);
	if (idPrevio !== p.contentId) {
		setIdPrevio(p.contentId);
		setEstado("poster");
	}
	(0, import_react.useEffect)(() => {
		if (estado !== "cargando") return void 0;
		reloj.current = window.setTimeout(() => setEstado((e) => e === "cargando" ? "fallo" : e), TOPE_CARGA_MS);
		const sinRed = () => setEstado("fallo");
		window.addEventListener("offline", sinRed);
		return () => {
			if (reloj.current !== null) window.clearTimeout(reloj.current);
			window.removeEventListener("offline", sinRed);
		};
	}, [estado]);
	const reproducir = () => {
		if (!valido || typeof navigator !== "undefined" && navigator.onLine === false) {
			setEstado("fallo");
			return;
		}
		setEstado("cargando");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(ReproductorTikTok_module_default.reproductor, p.className),
		"data-estado": estado,
		children: [
			estado === "cargando" || estado === "listo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
				className: cx(ReproductorTikTok_module_default.iframe, estado === "listo" && ReproductorTikTok_module_default.iframeListo),
				src: `https://www.tiktok.com/player/v1/${p.contentId}`,
				title: p.titulo,
				sandbox: SANDBOX_REPRODUCTOR,
				referrerPolicy: REFERRER_REPRODUCTOR,
				allow: ALLOW_REPRODUCTOR,
				onLoad: () => setEstado((e) => e === "cargando" ? "listo" : e)
			}) : null,
			estado === "poster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ReproductorTikTok_module_default.capa,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: ReproductorTikTok_module_default.glifo,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Play",
							tamano: 24
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: ReproductorTikTok_module_default.texto,
						children: "Se reproduce con el reproductor oficial de TikTok."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						icono: "Play",
						alPulsar: reproducir,
						children: "Reproducir aquí"
					})
				]
			}) : null,
			estado === "cargando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ReproductorTikTok_module_default.capa,
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(ReproductorTikTok_module_default.spinner, "anim-loop"),
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: ReproductorTikTok_module_default.texto,
					children: "Cargando el video…"
				})]
			}) : null,
			estado === "fallo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ReproductorTikTok_module_default.capa,
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: ReproductorTikTok_module_default.glifoFallo,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "CircleAlert",
							tamano: 24
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: ReproductorTikTok_module_default.textoFuerte,
						children: "No se pudo reproducir aquí"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: ReproductorTikTok_module_default.texto,
						children: "Revisa tu conexión o míralo en TikTok."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "secundario",
						iconoFinal: "ExternalLink",
						alPulsar: p.alAbrirFuera,
						children: "Abrir en TikTok"
					})
				]
			}) : null
		]
	});
}
/** Medición de elementos con ResizeObserver y memoria de scroll por clave (02 §7.6). */
/**
* Ancho y alto del elemento (0 mientras no se mide). Además de la primera medida síncrona y del ResizeObserver, vuelve
* a medir dos cuadros después del montaje: si el contenedor todavía no tenía su ancho final al montarse (ruta perezosa,
* fuentes, una captura con captureBeyondViewport) y el observador no llegó a avisar, la gráfica no se queda con el
* ancho de respaldo dentro de un área más ancha.
*/
function useTamano(ref) {
	const [t, setT] = (0, import_react.useState)({
		ancho: 0,
		alto: 0
	});
	(0, import_react.useLayoutEffect)(() => {
		const el = ref.current;
		if (!el) return void 0;
		const medir = () => {
			const r = el.getBoundingClientRect();
			setT((previo) => previo.ancho === r.width && previo.alto === r.height ? previo : {
				ancho: r.width,
				alto: r.height
			});
		};
		medir();
		let cuadro = 0;
		if (typeof requestAnimationFrame === "function") cuadro = requestAnimationFrame(() => {
			medir();
			cuadro = requestAnimationFrame(medir);
		});
		const o = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medir);
		o?.observe(el);
		return () => {
			if (cuadro && typeof cancelAnimationFrame === "function") cancelAnimationFrame(cuadro);
			o?.disconnect();
		};
	}, [ref]);
	return t;
}
var memoriaScroll = /* @__PURE__ */ new Map();
function guardarScroll(clave, y) {
	if (!clave) return;
	memoriaScroll.set(clave, y);
	if (memoriaScroll.size > 100) {
		const vieja = memoriaScroll.keys().next();
		if (!vieja.done) memoriaScroll.delete(vieja.value);
	}
}
function leerScroll(clave) {
	if (!clave) return null;
	return memoriaScroll.get(clave) ?? null;
}
/** Valor en px de una variable CSS (p. ej. --row-h, que puede ser calc()) medido en el elemento. */
function pxDeVariable(el, variable, respaldo) {
	if (!el || typeof getComputedStyle === "undefined") return respaldo;
	const sonda = document.createElement("div");
	sonda.style.position = "absolute";
	sonda.style.visibility = "hidden";
	sonda.style.height = `var(${variable})`;
	el.appendChild(sonda);
	const alto = sonda.getBoundingClientRect().height;
	el.removeChild(sonda);
	if (alto > 0) return alto;
	const crudo = Number.parseFloat(getComputedStyle(el).getPropertyValue(variable));
	return Number.isFinite(crudo) && crudo > 0 ? crudo : respaldo;
}
/** Ancestro con scroll vertical (o el documento) para guardar y restaurar la posición al volver (02 §7.6). */
function ancestroConScroll(el) {
	let actual = el?.parentElement ?? null;
	while (actual && actual !== document.body) {
		const estilo = getComputedStyle(actual);
		if (/(auto|scroll|overlay)/.test(estilo.overflowY) && actual.scrollHeight > actual.clientHeight) return actual;
		actual = actual.parentElement;
	}
	return document.scrollingElement ?? document.documentElement;
}
/**
* Ancestro (o el propio elemento) que desplaza en horizontal, o null si ninguno lo hace antes de <body>. Sirve para
* anclar algo al visor y no al ancho total de su contenido (p. ej. el vacío de una Tabla más ancha que su tarjeta).
*/
function visorHorizontal(el) {
	let actual = el;
	while (actual && actual !== document.body) {
		if (/(auto|scroll|overlay)/.test(getComputedStyle(actual).overflowX)) return actual;
		actual = actual.parentElement;
	}
	return null;
}
function esCampoEditable(t) {
	if (!(t instanceof HTMLElement)) return false;
	const etiqueta = t.tagName;
	return etiqueta === "INPUT" || etiqueta === "TEXTAREA" || etiqueta === "SELECT" || t.isContentEditable;
}
var Tabla_module_default = {
	tabla: "_tabla_1wind_2",
	desplazable: "_desplazable_1wind_9",
	virtual: "_virtual_1wind_12",
	encabezado: "_encabezado_1wind_19",
	fila: "_fila_1wind_20",
	th: "_th_1wind_33",
	thTexto: "_thTexto_1wind_47",
	ordenar: "_ordenar_1wind_54",
	ordenActivo: "_ordenActivo_1wind_77",
	flechaOrden: "_flechaOrden_1wind_80",
	asc: "_asc_1wind_84",
	filaVirtual: "_filaVirtual_1wind_96",
	cuerpoVirtual: "_cuerpoVirtual_1wind_106",
	seleccionada: "_seleccionada_1wind_112",
	celda: "_celda_1wind_123",
	derecha: "_derecha_1wind_132",
	centro: "_centro_1wind_136",
	acciones: "_acciones_1wind_140",
	accionesContenido: "_accionesContenido_1wind_149",
	nueva: "_nueva_1wind_166",
	sr: "_sr_1wind_175 _sr_1r6wq_4",
	vacio: "_vacio_1wind_180"
};
/**
* Tabla densa (02 §7.5, 01 §3.6): role=grid con aria-rowcount/aria-rowindex. Filas de --row-h (52 cómoda · 40
* compacta), encabezado de 36 pegajoso, columnas numéricas a la derecha. Teclado: J/K y ↑/↓ mueven la selección,
* Inicio/Fin y RePág/AvPág saltan, Enter (o doble clic) abre. Seleccionada: surface-selected + barra interior de 3 px.
* Las acciones de fila aparecen con hover, foco o selección. Virtual con @tanstack/react-virtual desde 100 filas
* (overscan 6) y restauración del scroll con `claveScroll`. Las columnas `prescindible` se ocultan en ancho 'media'.
*/
var UMBRAL_VIRTUAL = 100;
function pista$3(c) {
	if (typeof c.ancho === "number") return `${c.ancho}px`;
	if (typeof c.ancho === "string") return /fr$/.test(c.ancho) ? `minmax(0, ${c.ancho})` : c.ancho;
	return "minmax(0, 1fr)";
}
function Tabla(p) {
	const enMedia = useMedia(MEDIA_MEDIA);
	const firmaDensidad = useFirmaDensidad();
	const columnas = p.columnas.filter((c) => !(c.prescindible && enMedia));
	const virtual = p.virtual ?? p.filas.length >= UMBRAL_VIRTUAL;
	const raiz = (0, import_react.useRef)(null);
	const desplazable = (0, import_react.useRef)(null);
	const vacio = (0, import_react.useRef)(null);
	const ids = (0, import_react.useMemo)(() => p.filas.map((f) => p.idFila(f)), [p.filas, p.idFila]);
	const [activa, setActiva] = (0, import_react.useState)(p.seleccionada ?? null);
	const focoPendiente = (0, import_react.useRef)(null);
	const [altoFila, setAltoFila] = (0, import_react.useState)(52);
	const [anchoAcciones, setAnchoAcciones] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (p.seleccionada !== void 0) setActiva(p.seleccionada);
	}, [p.seleccionada]);
	(0, import_react.useLayoutEffect)(() => {
		if (!p.accionesFila) return;
		const celdas = raiz.current?.querySelectorAll("[data-acciones-contenido]");
		if (!celdas || celdas.length === 0) return;
		let maximo = 0;
		for (const c of celdas) maximo = Math.max(maximo, c.offsetWidth);
		const ancho = Math.ceil(maximo) + 16;
		if (maximo > 0 && (anchoAcciones === null || Math.abs(ancho - anchoAcciones) > 1)) setAnchoAcciones(ancho);
	});
	(0, import_react.useLayoutEffect)(() => {
		setAltoFila(pxDeVariable(raiz.current, "--row-h", 52));
	}, [firmaDensidad]);
	const sinFilas = p.filas.length === 0;
	(0, import_react.useLayoutEffect)(() => {
		const el = vacio.current;
		if (!sinFilas || !el) return void 0;
		const visor = visorHorizontal(el.parentElement);
		if (!visor) {
			el.style.removeProperty("--vacio-ancho");
			return;
		}
		const medir = () => {
			const e = getComputedStyle(visor);
			const util = visor.clientWidth - (parseFloat(e.paddingLeft) || 0) - (parseFloat(e.paddingRight) || 0);
			el.style.setProperty("--vacio-ancho", `${Math.max(0, Math.round(util))}px`);
		};
		medir();
		const o = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(medir);
		o?.observe(visor);
		return () => o?.disconnect();
	}, [sinFilas]);
	const virtualizador = useVirtualizer({
		count: virtual ? p.filas.length : 0,
		getScrollElement: () => desplazable.current,
		estimateSize: () => altoFila,
		overscan: 6,
		initialRect: {
			width: 960,
			height: 560
		}
	});
	(0, import_react.useEffect)(() => {
		virtualizador.measure();
	}, [altoFila, virtualizador]);
	(0, import_react.useLayoutEffect)(() => {
		const y = leerScroll(p.claveScroll);
		if (y === null) return void 0;
		const destino = virtual ? desplazable.current : ancestroConScroll(raiz.current);
		if (destino) destino.scrollTop = y;
	}, [p.claveScroll, virtual]);
	(0, import_react.useEffect)(() => {
		if (!p.claveScroll) return void 0;
		const clave = p.claveScroll;
		const destino = virtual ? desplazable.current : ancestroConScroll(raiz.current);
		if (!destino) return void 0;
		return () => guardarScroll(clave, destino.scrollTop);
	}, [p.claveScroll, virtual]);
	const indiceActivo = activa ? ids.indexOf(activa) : -1;
	const visibles = virtual ? virtualizador.getVirtualItems().map((v) => v.index) : ids.map((_, i) => i);
	const idRoving = activa && visibles.some((i) => ids[i] === activa) ? activa : ids[visibles[0] ?? 0] ?? null;
	(0, import_react.useLayoutEffect)(() => {
		const id = focoPendiente.current;
		if (!id) return;
		const el = raiz.current?.querySelector(`[data-fila="${id.replace(/["\\]/g, "\\$&")}"]`);
		if (el) {
			focoPendiente.current = null;
			el.focus({ preventScroll: virtual });
		}
	});
	const irA = (i) => {
		const n = p.filas.length;
		if (n === 0) return;
		const destino = Math.max(0, Math.min(n - 1, i));
		const fila = p.filas[destino];
		const id = ids[destino];
		if (fila === void 0 || id === void 0) return;
		setActiva(id);
		focoPendiente.current = id;
		if (virtual) virtualizador.scrollToIndex(destino, { align: "auto" });
		p.alSeleccionar?.(fila);
	};
	const alTecla = (e) => {
		if (esCampoEditable(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
		const actual = indiceActivo >= 0 ? indiceActivo : -1;
		const k = e.key;
		if (k === "j" || k === "J" || k === "ArrowDown") {
			e.preventDefault();
			irA(actual + 1);
		} else if (k === "k" || k === "K" || k === "ArrowUp") {
			e.preventDefault();
			irA(actual < 0 ? 0 : actual - 1);
		} else if (k === "Home") {
			e.preventDefault();
			irA(0);
		} else if (k === "End") {
			e.preventDefault();
			irA(p.filas.length - 1);
		} else if (k === "PageDown") {
			e.preventDefault();
			irA(actual + 10);
		} else if (k === "PageUp") {
			e.preventDefault();
			irA(actual - 10);
		} else if (k === "Enter") {
			const enFila = e.target instanceof HTMLElement && e.target.getAttribute("role") === "row";
			const fila = actual >= 0 ? p.filas[actual] : void 0;
			if (enFila && fila !== void 0 && p.alAbrir) {
				e.preventDefault();
				p.alAbrir(fila);
			}
		}
	};
	const plantilla = [...columnas.map(pista$3), ...p.accionesFila ? [anchoAcciones !== null ? `${anchoAcciones}px` : "max-content"] : []].join(" ");
	const pintarFila = (i, estilo) => {
		const fila = p.filas[i];
		const id = ids[i];
		if (fila === void 0 || id === void 0) return null;
		const seleccionada = id === (p.seleccionada !== void 0 ? p.seleccionada : activa);
		const nueva = p.esNueva?.(fila) ?? false;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "row",
			"aria-rowindex": i + 2,
			"aria-selected": seleccionada,
			tabIndex: id === idRoving ? 0 : -1,
			"data-fila": id,
			"data-index": i,
			className: cx(Tabla_module_default.fila, seleccionada && Tabla_module_default.seleccionada, seleccionada && "fc-selected", virtual && Tabla_module_default.filaVirtual),
			style: estilo ? vars({ "--y": `${estilo.top}px` }) : void 0,
			onClick: () => {
				setActiva(id);
				p.alSeleccionar?.(fila);
			},
			onDoubleClick: () => p.alAbrir?.(fila),
			onFocus: (e) => {
				if (e.target === e.currentTarget) setActiva(id);
			},
			children: [columnas.map((c, ci) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "gridcell",
				className: cx(Tabla_module_default.celda, c.alineacion === "derecha" && Tabla_module_default.derecha, c.alineacion === "centro" && Tabla_module_default.centro),
				children: [ci === 0 && nueva ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Tabla_module_default.nueva,
					title: "Cambió desde tu última visita",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Tabla_module_default.sr,
						children: "Cambió desde tu última visita"
					})
				}) : null, c.celda(fila)]
			}, c.id)), p.accionesFila ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "gridcell",
				className: Tabla_module_default.acciones,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Tabla_module_default.accionesContenido,
					"data-acciones-contenido": "",
					children: p.accionesFila(fila)
				})
			}) : null]
		}, id);
	};
	const encabezado = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "row",
		"aria-rowindex": 1,
		className: Tabla_module_default.encabezado,
		children: [columnas.map((c) => {
			const ordenada = p.orden?.columna === c.id ? p.orden.direccion : null;
			const ariaSort = ordenada === "asc" ? "ascending" : ordenada === "desc" ? "descending" : c.ordenable ? "none" : void 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "columnheader",
				"aria-sort": ariaSort,
				className: cx(Tabla_module_default.th, c.alineacion === "derecha" && Tabla_module_default.derecha, c.alineacion === "centro" && Tabla_module_default.centro),
				children: c.ordenable && p.alOrdenar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: cx(Tabla_module_default.ordenar, ordenada && Tabla_module_default.ordenActivo),
					onClick: () => p.alOrdenar?.(c.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Tabla_module_default.thTexto,
						title: c.titulo,
						children: c.titulo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: ordenada ? "ChevronDown" : "ArrowDownUp",
						tamano: 14,
						className: cx(Tabla_module_default.flechaOrden, ordenada === "asc" && Tabla_module_default.asc)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Tabla_module_default.thTexto,
					title: c.titulo,
					children: c.titulo
				})
			}, c.id);
		}), p.accionesFila ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "columnheader",
			className: Tabla_module_default.th,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Tabla_module_default.sr,
				children: "Acciones"
			})
		}) : null]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: raiz,
		role: "grid",
		"aria-label": p.etiqueta,
		"aria-rowcount": p.filas.length + 1,
		"aria-colcount": columnas.length + (p.accionesFila ? 1 : 0),
		className: cx(Tabla_module_default.tabla, virtual && Tabla_module_default.virtual, p.className),
		style: vars({ "--plantilla": plantilla }),
		onKeyDown: alTecla,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: desplazable,
			className: Tabla_module_default.desplazable,
			onScroll: virtual && p.claveScroll ? (e) => guardarScroll(p.claveScroll, e.currentTarget.scrollTop) : void 0,
			children: [encabezado, sinFilas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: vacio,
				className: Tabla_module_default.vacio,
				children: p.vacio ?? null
			}) : virtual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "rowgroup",
				className: Tabla_module_default.cuerpoVirtual,
				style: { height: virtualizador.getTotalSize() },
				children: virtualizador.getVirtualItems().map((v) => pintarFila(v.index, {
					top: v.start,
					alto: v.size
				}))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "rowgroup",
				children: p.filas.map((_, i) => pintarFila(i))
			})]
		})
	});
}
var Segmentado_module_default = {
	segmentado: "_segmentado_1clvo_5",
	completo: "_completo_1clvo_17",
	pulgar: "_pulgar_1clvo_21",
	opcion: "_opcion_1clvo_33",
	etiqueta: "_etiqueta_1clvo_67",
	conteo: "_conteo_1clvo_80"
};
/**
* Segmentado (02 §7.11): rejilla de columnas iguales, contenedor surface-2. Medidas del lienzo aprobado: 44 de alto
* (48 en táctil), relleno 4 y radio 12 (LEEME.md:17). El pulgar mide calc(100%/n) fijo y SOLO se mueve con
* translateX(calc(var(--i) * 100%)) en 200 ms. role=radiogroup con flechas ← →.
*/
function Segmentado(p) {
	const grupo = (0, import_react.useRef)(null);
	const indice = Math.max(0, p.opciones.findIndex((o) => o.valor === p.valor));
	const elegir = (i) => {
		const o = p.opciones[i];
		if (!o) return;
		if (o.valor !== p.valor) p.alCambiar(o.valor);
		grupo.current?.querySelectorAll("[role=\"radio\"]")[i]?.focus();
	};
	const alTecla = (e) => {
		const n = p.opciones.length;
		if (n === 0) return;
		if (e.key === "ArrowRight" || e.key === "ArrowDown") {
			e.preventDefault();
			elegir((indice + 1) % n);
		} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
			e.preventDefault();
			elegir((indice - 1 + n) % n);
		} else if (e.key === "Home") {
			e.preventDefault();
			elegir(0);
		} else if (e.key === "End") {
			e.preventDefault();
			elegir(n - 1);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: grupo,
		role: "radiogroup",
		"aria-label": p.etiqueta,
		className: cx(Segmentado_module_default.segmentado, p.anchoCompleto && Segmentado_module_default.completo, p.className),
		style: vars({
			"--n": Math.max(1, p.opciones.length),
			"--i": indice
		}),
		onKeyDown: alTecla,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(Segmentado_module_default.pulgar, "fc-fill"),
			"aria-hidden": "true"
		}), p.opciones.map((o, i) => {
			const activa = i === indice;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": activa,
				tabIndex: activa ? 0 : -1,
				className: Segmentado_module_default.opcion,
				onClick: () => elegir(i),
				children: [
					o.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: o.icono,
						tamano: 16
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Segmentado_module_default.etiqueta,
						children: o.etiqueta
					}),
					o.conteo !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: Segmentado_module_default.conteo,
						children: formato.numero(o.conteo)
					}) : null
				]
			}, o.valor);
		})]
	});
}
var Campo_module_default = {
	campo: "_campo_qk2hm_1",
	etiqueta: "_etiqueta_qk2hm_7",
	sr: "_sr_qk2hm_13 _sr_1r6wq_4",
	caja: "_caja_qk2hm_16",
	conError: "_conError_qk2hm_36",
	input: "_input_qk2hm_46",
	area: "_area_qk2hm_47",
	mono: "_mono_qk2hm_85",
	cajaCodigo: "_cajaCodigo_qk2hm_95",
	codigo: "_codigo_qk2hm_100",
	lupa: "_lupa_qk2hm_111",
	accionCaja: "_accionCaja_qk2hm_114",
	cajaArea: "_cajaArea_qk2hm_137",
	ayuda: "_ayuda_qk2hm_146",
	error: "_error_qk2hm_147",
	pieArea: "_pieArea_qk2hm_163",
	contador: "_contador_qk2hm_168"
};
/**
* Campo de texto (02 §7.10): fondo surface-2, borde --border-control, radio 8, alto --control-h-md. Foco: borde
* --border-focus, halo --brand-subtle de 3 px y fondo surface-1. Búsqueda con lupa y ✕ para borrar; contraseña con
* ojo para mostrar. Ayuda y error ligados con aria-describedby (error con aria-invalid y role=alert).
* Contraseña = campo NO controlado: en un campo controlado React copia lo escrito al atributo `value` del DOM, que
* cualquiera puede serializar (outerHTML, inspector, capturas del árbol). Aquí lo escrito vive solo en la propiedad del
* campo; `valor` se aplica al montar y cada vez que cambia (p. ej. la pantalla lo vacía tras mandarlo).
*/
function CampoTexto(p) {
	const id = (0, import_react.useId)();
	const idNota = (0, import_react.useId)();
	const [ver, setVer] = (0, import_react.useState)(false);
	const tipo = p.tipo ?? "text";
	const esClave = tipo === "password";
	const entrada = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const el = entrada.current;
		if (esClave && el && el.value !== p.valor) el.value = p.valor;
	}, [esClave, p.valor]);
	const nota = p.error ? p.error : p.ayuda;
	const codigo = !!p.monoespaciado && tipo === "text" && p.maximo !== void 0 && p.maximo <= 16;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Campo_module_default.campo, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: cx(Campo_module_default.etiqueta, p.etiquetaOculta && Campo_module_default.sr),
				children: p.etiqueta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Campo_module_default.caja, codigo && Campo_module_default.cajaCodigo, p.error && Campo_module_default.conError),
				children: [
					tipo === "search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Search",
						tamano: 16,
						className: cx(Campo_module_default.lupa)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: entrada,
						id,
						className: cx(Campo_module_default.input, p.monoespaciado && Campo_module_default.mono, codigo && Campo_module_default.codigo),
						type: tipo === "password" && ver ? "text" : tipo,
						...esClave ? { defaultValue: "" } : { value: p.valor },
						placeholder: p.placeholder,
						maxLength: p.maximo,
						autoFocus: p.autoFoco,
						...p.autoFoco ? { "data-autofoco": "" } : {},
						spellCheck: tipo === "text" && !p.monoespaciado,
						autoComplete: tipo === "password" ? "off" : void 0,
						"aria-invalid": p.error ? true : void 0,
						"aria-describedby": nota ? idNota : void 0,
						onChange: (e) => p.alCambiar(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && p.alEnter && !e.nativeEvent.isComposing) {
								e.preventDefault();
								p.alEnter();
							} else if (e.key === "Escape" && tipo === "search" && p.valor) {
								e.preventDefault();
								e.stopPropagation();
								p.alCambiar("");
							}
						}
					}),
					tipo === "search" && p.valor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: Campo_module_default.accionCaja,
						"aria-label": "Borrar búsqueda",
						onClick: () => p.alCambiar(""),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "X",
							tamano: 16
						})
					}) : null,
					tipo === "password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: Campo_module_default.accionCaja,
						"aria-label": `Mostrar ${p.etiqueta.charAt(0).toLocaleLowerCase("es-MX")}${p.etiqueta.slice(1)}`,
						"aria-pressed": ver,
						onClick: () => setVer((v) => !v),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: ver ? "EyeOff" : "Eye",
							tamano: 16
						})
					}) : null
				]
			}),
			p.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				id: idNota,
				className: Campo_module_default.error,
				role: "alert",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CircleAlert",
					tamano: 14
				}), p.error]
			}) : p.ayuda ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: idNota,
				className: Campo_module_default.ayuda,
				children: p.ayuda
			}) : null
		]
	});
}
/** Área de texto con contador opcional ("124/500") y los mismos estados del campo (02 §7.10). */
function AreaTexto(p) {
	const id = (0, import_react.useId)();
	const idNota = (0, import_react.useId)();
	const nota = p.error ?? p.ayuda;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Campo_module_default.campo, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: cx(Campo_module_default.etiqueta, p.etiquetaOculta && Campo_module_default.sr),
				children: p.etiqueta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Campo_module_default.caja, Campo_module_default.cajaArea, p.error && Campo_module_default.conError),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id,
					className: cx(Campo_module_default.input, Campo_module_default.area, p.monoespaciado && Campo_module_default.mono),
					rows: p.filas ?? 4,
					value: p.valor,
					placeholder: p.placeholder,
					maxLength: p.maximo,
					autoFocus: p.autoFoco,
					...p.autoFoco ? { "data-autofoco": "" } : {},
					"aria-invalid": p.error ? true : void 0,
					"aria-describedby": nota ? idNota : void 0,
					onChange: (e) => p.alCambiar(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Campo_module_default.pieArea,
				children: [p.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					id: idNota,
					className: Campo_module_default.error,
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CircleAlert",
						tamano: 14
					}), p.error]
				}) : p.ayuda ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: idNota,
					className: Campo_module_default.ayuda,
					children: p.ayuda
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), p.contador ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Campo_module_default.contador,
					"aria-live": "polite",
					children: [formato.numero(p.valor.length), p.maximo !== void 0 ? `/${formato.numero(p.maximo)}` : ""]
				}) : null]
			})
		]
	});
}
var Controles_module_default = {
	fila: "_fila_1iqgd_2",
	inactiva: "_inactiva_1iqgd_10",
	textos: "_textos_1iqgd_14",
	etiqueta: "_etiqueta_1iqgd_20",
	descripcion: "_descripcion_1iqgd_26",
	nativo: "_nativo_1iqgd_39",
	interruptor: "_interruptor_1iqgd_49",
	pistaInterruptor: "_pistaInterruptor_1iqgd_62",
	perilla: "_perilla_1iqgd_71",
	casilla: "_casilla_1iqgd_98",
	caja: "_caja_1iqgd_106",
	aro: "_aro_1iqgd_123",
	grupoRadio: "_grupoRadio_1iqgd_133",
	leyenda: "_leyenda_1iqgd_142",
	radio: "_radio_1iqgd_150",
	radioMarcada: "_radioMarcada_1iqgd_164",
	numero: "_numero_1iqgd_192",
	numeroControl: "_numeroControl_1iqgd_199",
	paso: "_paso_1iqgd_208",
	valor: "_valor_1iqgd_225",
	dias: "_dias_1iqgd_238",
	diasFila: "_diasFila_1iqgd_244",
	dia: "_dia_1iqgd_238"
};
/** Interruptor (role=switch): pista de 36×20 con perilla que se desliza con transform; activo en lima. */
function Interruptor(p) {
	const idEtiqueta = (0, import_react.useId)();
	const idDescripcion = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Controles_module_default.fila, p.deshabilitado && Controles_module_default.inactiva, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Controles_module_default.textos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Controles_module_default.etiqueta,
				id: idEtiqueta,
				children: p.etiqueta
			}), p.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Controles_module_default.descripcion,
				id: idDescripcion,
				children: p.descripcion
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "switch",
			"aria-checked": p.activo,
			"aria-labelledby": idEtiqueta,
			...p.descripcion ? { "aria-describedby": idDescripcion } : {},
			disabled: !!p.deshabilitado,
			className: cx(Controles_module_default.interruptor, "hit"),
			onClick: () => p.alCambiar(!p.activo),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Controles_module_default.pistaInterruptor, p.activo && "fc-fill"),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Controles_module_default.perilla })
			})
		})]
	});
}
/** Casilla de verificación nativa con caja propia (18 px, radio 5); marcada en lima con ✓, indeterminada con −. */
function Casilla(p) {
	const id = (0, import_react.useId)();
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) ref.current.indeterminate = !!p.indeterminada;
	}, [p.indeterminada]);
	const estado = p.indeterminada ? "mixta" : p.marcada ? "si" : "no";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: cx(Controles_module_default.casilla, p.deshabilitado && Controles_module_default.inactiva, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref,
				id,
				type: "checkbox",
				className: Controles_module_default.nativo,
				checked: p.marcada,
				disabled: !!p.deshabilitado,
				onChange: (e) => p.alCambiar(e.target.checked)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Controles_module_default.caja, estado !== "no" && "fc-fill"),
				"data-estado": estado,
				"aria-hidden": "true",
				children: estado === "si" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Check",
					tamano: 14
				}) : estado === "mixta" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Minus",
					tamano: 14
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: Controles_module_default.etiqueta,
				children: p.etiqueta
			})
		]
	});
}
/** Grupo de opciones (radios nativos con aro propio y descripción opcional), dentro de un fieldset con leyenda. */
function OpcionRadio(p) {
	const nombre = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: cx(Controles_module_default.grupoRadio, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: Controles_module_default.leyenda,
			children: p.etiqueta
		}), p.opciones.map((o) => {
			const id = `${nombre}-${o.valor}`;
			const marcada = o.valor === p.valor;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: id,
				className: cx(Controles_module_default.radio, marcada && Controles_module_default.radioMarcada),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id,
						type: "radio",
						name: nombre,
						className: Controles_module_default.nativo,
						checked: marcada,
						onChange: () => p.alCambiar(o.valor)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Controles_module_default.aro, marcada && "fc-fill"),
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: Controles_module_default.textos,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Controles_module_default.etiqueta,
							children: o.etiqueta
						}), o.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Controles_module_default.descripcion,
							children: o.descripcion
						}) : null]
					})
				]
			}, o.valor);
		})]
	});
}
/** Selector de número (− valor +) con role=spinbutton: ↑/↓ y RePág/AvPág cambian el valor entre min y max. */
function SelectorNumero(p) {
	const idEtiqueta = (0, import_react.useId)();
	const fijar = (v) => {
		const c = Math.min(p.max, Math.max(p.min, Math.round(v)));
		if (c !== p.valor) p.alCambiar(c);
	};
	const alTecla = (e) => {
		const pasos = {
			ArrowUp: 1,
			ArrowRight: 1,
			ArrowDown: -1,
			ArrowLeft: -1,
			PageUp: 5,
			PageDown: -5
		};
		if (e.key in pasos) {
			e.preventDefault();
			fijar(p.valor + (pasos[e.key] ?? 0));
		} else if (e.key === "Home") {
			e.preventDefault();
			fijar(p.min);
		} else if (e.key === "End") {
			e.preventDefault();
			fijar(p.max);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Controles_module_default.numero, p.className),
		role: "group",
		"aria-labelledby": idEtiqueta,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Controles_module_default.etiqueta,
			id: idEtiqueta,
			children: p.etiqueta
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: Controles_module_default.numeroControl,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cx(Controles_module_default.paso, "hit"),
					"aria-label": "Menos",
					disabled: p.valor <= p.min,
					onClick: () => fijar(p.valor - 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Minus",
						tamano: 16
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Controles_module_default.valor,
					role: "spinbutton",
					tabIndex: 0,
					"aria-labelledby": idEtiqueta,
					"aria-valuenow": p.valor,
					"aria-valuemin": p.min,
					"aria-valuemax": p.max,
					onKeyDown: alTecla,
					children: formato.numero(p.valor)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cx(Controles_module_default.paso, "hit"),
					"aria-label": "Más",
					disabled: p.valor >= p.max,
					onClick: () => fijar(p.valor + 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Plus",
						tamano: 16
					})
				})
			]
		})]
	});
}
/** Chips L M M J V S D (0 = lunes … 6 = domingo) con aria-pressed y el nombre completo del día para lectores. */
var DIAS = [
	["L", "lunes"],
	["M", "martes"],
	["M", "miércoles"],
	["J", "jueves"],
	["V", "viernes"],
	["S", "sábado"],
	["D", "domingo"]
];
function ChipsDias(p) {
	const idEtiqueta = (0, import_react.useId)();
	const activos = new Set(p.dias);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Controles_module_default.dias, p.className),
		role: "group",
		"aria-labelledby": idEtiqueta,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Controles_module_default.etiqueta,
			id: idEtiqueta,
			children: p.etiqueta
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: Controles_module_default.diasFila,
			children: DIAS.map(([corta, larga], i) => {
				const activo = activos.has(i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cx(Controles_module_default.dia, "hit"),
					"aria-pressed": activo,
					"aria-label": larga,
					onClick: () => {
						const s = new Set(p.dias);
						if (activo) s.delete(i);
						else s.add(i);
						p.alCambiar([...s].sort((a, b) => a - b));
					},
					children: corta
				}, larga);
			})
		})]
	});
}
var SelectorFecha_module_default = {
	selector: "_selector_1x7bn_1",
	cabeza: "_cabeza_1x7bn_8",
	etiqueta: "_etiqueta_1x7bn_14",
	elegida: "_elegida_1x7bn_20",
	atajos: "_atajos_1x7bn_26",
	atajo: "_atajo_1x7bn_26",
	calendario: "_calendario_1x7bn_57",
	mes: "_mes_1x7bn_63",
	tituloMes: "_tituloMes_1x7bn_69",
	semana: "_semana_1x7bn_74",
	dias: "_dias_1x7bn_75",
	dia: "_dia_1x7bn_75",
	otroMes: "_otroMes_1x7bn_105",
	hoy: "_hoy_1x7bn_109",
	numero: "_numero_1x7bn_112",
	elegido: "_elegido_1x7bn_115",
	ocupacion: "_ocupacion_1x7bn_127",
	lleno: "_lleno_1x7bn_137"
};
/**
* Selector de fecha: chips rápidos ('Hoy', 'Mañana', 'En 3 días (dom 15 nov)') y un calendario mensual que empieza en
* lunes, con la capacidad por día ('2/3', Agenda y Planear). Teclado: flechas entre días, RePág/AvPág cambian de mes,
* Inicio/Fin van al inicio o fin de la semana, Enter/Espacio eligen. Fechas siempre en UTC−6 con @/dominio.
*/
var INICIALES = [
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
	"D"
];
function primeroDelMes(f) {
	return `${f.slice(0, 7)}-01`;
}
function moverMes(primero, delta) {
	const a = Number(primero.slice(0, 4));
	const m = Number(primero.slice(5, 7)) - 1 + delta;
	const anio = a + Math.floor(m / 12);
	const mes = (m % 12 + 12) % 12;
	return `${String(anio).padStart(4, "0")}-${String(mes + 1).padStart(2, "0")}-01`;
}
function tituloMes(primero) {
	const mes = formato.fechaLarga(primero).split(" de ")[1] ?? "";
	return `${mes.charAt(0).toLocaleUpperCase("es-MX")}${mes.slice(1)} ${primero.slice(0, 4)}`;
}
function fuera(f, min, max) {
	return min !== void 0 && f < min || max !== void 0 && f > max;
}
function SelectorFecha(p) {
	const hoy = hoyLocal();
	const idEtiqueta = (0, import_react.useId)();
	const [mes, setMes] = (0, import_react.useState)(() => primeroDelMes(p.valor ?? p.min ?? hoy));
	const [foco, setFoco] = (0, import_react.useState)(p.valor ?? (p.min && p.min > hoy ? p.min : hoy));
	const rejilla = (0, import_react.useRef)(null);
	const moverFoco = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (p.valor) {
			setMes(primeroDelMes(p.valor));
			setFoco(p.valor);
		}
	}, [p.valor]);
	(0, import_react.useEffect)(() => {
		if (!moverFoco.current) return;
		moverFoco.current = false;
		rejilla.current?.querySelector(`[data-fecha="${foco}"]`)?.focus();
	}, [foco, mes]);
	const inicio = sumarDias(mes, -diaSemana(mes));
	const ultimo = sumarDias(moverMes(mes, 1), -1);
	const semanas = Math.ceil((diaSemana(mes) + Number(ultimo.slice(8, 10))) / 7);
	const dias = Array.from({ length: semanas * 7 }, (_, i) => sumarDias(inicio, i));
	const elegir = (f) => {
		if (fuera(f, p.min, p.max)) return;
		setFoco(f);
		p.alCambiar(f);
	};
	const enfocar = (f) => {
		moverFoco.current = true;
		setFoco(f);
		if (primeroDelMes(f) !== mes) setMes(primeroDelMes(f));
	};
	const alTecla = (e) => {
		const saltos = {
			ArrowRight: 1,
			ArrowLeft: -1,
			ArrowDown: 7,
			ArrowUp: -7
		};
		if (e.key in saltos) {
			e.preventDefault();
			enfocar(sumarDias(foco, saltos[e.key] ?? 0));
		} else if (e.key === "PageDown" || e.key === "PageUp") {
			e.preventDefault();
			const destino = moverMes(primeroDelMes(foco), e.key === "PageDown" ? 1 : -1);
			enfocar(sumarDias(destino, Math.min(Number(foco.slice(8, 10)) - 1, 27)));
		} else if (e.key === "Home") {
			e.preventDefault();
			enfocar(sumarDias(foco, -diaSemana(foco)));
		} else if (e.key === "End") {
			e.preventDefault();
			enfocar(sumarDias(foco, 6 - diaSemana(foco)));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(SelectorFecha_module_default.selector, p.className),
		role: "group",
		"aria-labelledby": idEtiqueta,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: SelectorFecha_module_default.cabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: SelectorFecha_module_default.etiqueta,
					id: idEtiqueta,
					children: p.etiqueta
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: SelectorFecha_module_default.elegida,
					"aria-live": "polite",
					children: p.valor ? formato.fechaConDia(p.valor) : "Sin fecha"
				})]
			}),
			p.atajos && p.atajos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: SelectorFecha_module_default.atajos,
				children: p.atajos.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cx(SelectorFecha_module_default.atajo, "hit"),
					"aria-pressed": p.valor === a.fecha,
					disabled: fuera(a.fecha, p.min, p.max),
					onClick: () => elegir(a.fecha),
					children: a.etiqueta
				}, a.etiqueta))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: SelectorFecha_module_default.calendario,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: SelectorFecha_module_default.mes,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
								icono: "ChevronLeft",
								etiqueta: "Mes anterior",
								tamano: "sm",
								alPulsar: () => setMes(moverMes(mes, -1))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: SelectorFecha_module_default.tituloMes,
								"aria-live": "polite",
								children: tituloMes(mes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
								icono: "ChevronRight",
								etiqueta: "Mes siguiente",
								tamano: "sm",
								alPulsar: () => setMes(moverMes(mes, 1))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: SelectorFecha_module_default.semana,
						"aria-hidden": "true",
						children: INICIALES.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: rejilla,
						className: SelectorFecha_module_default.dias,
						onKeyDown: alTecla,
						children: dias.map((f) => {
							const otroMes = primeroDelMes(f) !== mes;
							const deshabilitado = fuera(f, p.min, p.max);
							const ocupacion = p.ocupacion?.[f];
							const lleno = !!ocupacion && ocupacion.usados >= ocupacion.capacidad;
							const elegido = p.valor === f;
							const etiqueta = `${formato.fechaConDia(f)}${f === hoy ? ", hoy" : ""}${ocupacion ? `, ${ocupacion.usados} de ${ocupacion.capacidad} videos` : ""}`;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-fecha": f,
								className: cx(SelectorFecha_module_default.dia, otroMes && SelectorFecha_module_default.otroMes, f === hoy && SelectorFecha_module_default.hoy, elegido && SelectorFecha_module_default.elegido, elegido && "fc-selected"),
								"aria-pressed": elegido,
								"aria-label": etiqueta,
								tabIndex: f === foco ? 0 : -1,
								disabled: deshabilitado,
								onClick: () => elegir(f),
								onFocus: () => setFoco(f),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: SelectorFecha_module_default.numero,
									children: Number(f.slice(8, 10))
								}), ocupacion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cx(SelectorFecha_module_default.ocupacion, lleno && SelectorFecha_module_default.lleno),
									"aria-hidden": "true",
									children: [
										ocupacion.usados,
										"/",
										ocupacion.capacidad
									]
								}) : null]
							}, f);
						})
					})
				]
			})
		]
	});
}
var SelectorFechaHora_module_default = {
	raiz: "_raiz_r58j1_1",
	hora: "_hora_r58j1_8"
};
/** Fecha y hora (Programada, recordatorios): calendario + hora en 24 h, siempre en UTC−6 con @/dominio. */
var HORA_POR_OMISION = {
	h: 18,
	m: 0
};
function SelectorFechaHora(p) {
	const idHora = (0, import_react.useId)();
	const fecha = p.valor !== null ? fechaLocalDe(p.valor) : null;
	const hora = p.valor !== null ? horaLocal(p.valor) : HORA_POR_OMISION;
	const valorHora = `${String(hora.h).padStart(2, "0")}:${String(hora.m).padStart(2, "0")}`;
	const minFecha = p.min !== void 0 ? fechaLocalDe(p.min) : void 0;
	const emitir = (t) => p.alCambiar(p.min !== void 0 ? Math.max(p.min, t) : t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(SelectorFechaHora_module_default.raiz, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectorFecha, {
			etiqueta: p.etiqueta,
			valor: fecha,
			...minFecha ? { min: minFecha } : {},
			alCambiar: (f) => emitir(epochDeFecha(f, hora.h, hora.m))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Campo_module_default.campo, SelectorFechaHora_module_default.hora),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: idHora,
					className: Campo_module_default.etiqueta,
					children: "Hora"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: Campo_module_default.caja,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: idHora,
						type: "time",
						step: 300,
						className: Campo_module_default.input,
						value: valorHora,
						onChange: (e) => {
							const m = /^(\d{2}):(\d{2})$/.exec(e.target.value);
							if (!m) return;
							emitir(epochDeFecha(fecha ?? hoyLocal(), Number(m[1]), Number(m[2])));
						}
					})
				}),
				p.valor !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: Campo_module_default.ayuda,
					children: `${formato.fechaConDia(p.valor)}, ${formato.hora(p.valor)}`
				}) : null
			]
		})]
	});
}
/**
* Pila de capas abiertas (Modal, Hoja, PanelLateral, Menú, BurbujaRecorrido):
* - Esc cierra SOLO la capa de arriba (un menú dentro de un modal se cierra primero);
* - mientras hay una capa modal abierta, <html data-overlay> apaga el vidrio y bloquea el scroll del fondo
*   (02 §7.12, tokens.css §14.2, base.css). Solo se quita el atributo si lo puso esta pila.
*/
var pila = [];
var siguienteId = 1;
var puseOverlay = false;
var escuchando = false;
function actualizarOverlay() {
	if (typeof document === "undefined") return;
	const html = document.documentElement;
	const hayModal = pila.some((c) => c.modal);
	if (hayModal && !html.hasAttribute("data-overlay")) {
		html.setAttribute("data-overlay", "");
		puseOverlay = true;
	} else if (!hayModal && puseOverlay) {
		html.removeAttribute("data-overlay");
		puseOverlay = false;
	}
}
function alTecla(e) {
	if (e.key !== "Escape" || e.defaultPrevented) return;
	const cima = pila[pila.length - 1];
	if (!cima?.alEsc) return;
	e.preventDefault();
	e.stopPropagation();
	cima.alEsc();
}
function asegurarEscucha() {
	if (escuchando || typeof document === "undefined") return;
	document.addEventListener("keydown", alTecla, true);
	escuchando = true;
}
function apilarCapa(modal, alEsc) {
	asegurarEscucha();
	const id = siguienteId++;
	pila.push({
		id,
		modal,
		alEsc
	});
	actualizarOverlay();
	return id;
}
function quitarCapa(id) {
	const i = pila.findIndex((c) => c.id === id);
	if (i >= 0) pila.splice(i, 1);
	actualizarOverlay();
}
/** Registra la capa mientras `activa` sea true. `alEsc` siempre es la versión más reciente. */
function useCapa(activa, modal, alEsc) {
	const ref = (0, import_react.useRef)(alEsc);
	ref.current = alEsc;
	(0, import_react.useEffect)(() => {
		if (!activa) return void 0;
		const id = apilarCapa(modal, () => ref.current?.());
		return () => quitarCapa(id);
	}, [activa, modal]);
}
/**
* Foco atrapado para capas modales (02 §7.12–7.13, §12.2): al abrir enfoca [data-autofoco] o el contenedor; Tab y
* Mayús+Tab dan la vuelta dentro de la capa; un foco que escapa (clic fuera, lector de pantalla) vuelve adentro; al
* cerrar, el foco regresa al elemento que lo tenía (la fila, el botón que abrió el diálogo).
*/
var SELECTOR_ENFOCABLE = [
	"a[href]",
	"area[href]",
	"button:not([disabled])",
	"input:not([disabled]):not([type=\"hidden\"])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"audio[controls]",
	"video[controls]",
	"[contenteditable=\"true\"]",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(",");
function enfocables(contenedor) {
	return Array.from(contenedor.querySelectorAll(SELECTOR_ENFOCABLE)).filter((el) => !el.closest("[hidden],[inert],[aria-hidden=\"true\"]") && el.tabIndex >= 0);
}
/** Maneja Tab dentro de `contenedor`: true si movió el foco (para preventDefault). */
function ciclarFoco(contenedor, e) {
	if (e.key !== "Tab") return;
	const lista = enfocables(contenedor);
	const primero = lista[0];
	const ultimo = lista[lista.length - 1];
	const activo = document.activeElement;
	if (!primero || !ultimo) {
		e.preventDefault();
		contenedor.focus();
		return;
	}
	if (e.shiftKey && (activo === primero || activo === contenedor || !contenedor.contains(activo))) {
		e.preventDefault();
		ultimo.focus();
	} else if (!e.shiftKey && (activo === ultimo || !contenedor.contains(activo))) {
		e.preventDefault();
		primero.focus();
	}
}
/** Atrapa el foco en `ref` mientras `activo`. Devuelve nada: el contenedor necesita tabIndex={-1}. */
function useAtraparFoco(ref, activo) {
	const previo = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!activo) return void 0;
		const c = ref.current;
		if (!c) return void 0;
		previo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		(c.querySelector("[data-autofoco]") ?? c).focus({ preventScroll: true });
		const alTecla = (e) => ciclarFoco(c, e);
		const alEntrarFoco = (e) => {
			const destino = e.target;
			if (!(destino instanceof Node) || c.contains(destino)) return;
			if (destino instanceof HTMLElement && destino.closest("[data-capa-corte]")) return;
			c.focus({ preventScroll: true });
		};
		c.addEventListener("keydown", alTecla);
		document.addEventListener("focusin", alEntrarFoco);
		return () => {
			c.removeEventListener("keydown", alTecla);
			document.removeEventListener("focusin", alEntrarFoco);
			const p = previo.current;
			if (p && p.isConnected) p.focus({ preventScroll: true });
		};
	}, [activo, ref]);
}
function usePresencia(abierta, salidaMs = 200) {
	const [montada, setMontada] = (0, import_react.useState)(abierta);
	const [saliendo, setSaliendo] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (abierta) {
			setMontada(true);
			setSaliendo(false);
			return;
		}
		if (!montada) return void 0;
		setSaliendo(true);
		const t = window.setTimeout(() => {
			setMontada(false);
			setSaliendo(false);
		}, salidaMs);
		return () => window.clearTimeout(t);
	}, [
		abierta,
		montada,
		salidaMs
	]);
	return {
		montada: montada || abierta,
		saliendo: saliendo && !abierta
	};
}
var Modal_module_default = {
	raiz: "_raiz_1dchd_1",
	velo: "_velo_1dchd_11",
	aparecer: "_aparecer_1dchd_1",
	dialogo: "_dialogo_1dchd_17",
	entrar: "_entrar_1dchd_1",
	a440: "_a440_1dchd_35",
	a560: "_a560_1dchd_36",
	a640: "_a640_1dchd_37",
	a720: "_a720_1dchd_38",
	saliendo: "_saliendo_1dchd_43",
	desaparecer: "_desaparecer_1dchd_1",
	salir: "_salir_1dchd_1",
	cabeza: "_cabeza_1dchd_50",
	textos: "_textos_1dchd_55",
	titulo: "_titulo_1dchd_59",
	descripcion: "_descripcion_1dchd_67",
	cerrar: "_cerrar_1dchd_74",
	cuerpo: "_cuerpo_1dchd_77",
	pie: "_pie_1dchd_85",
	completo: "_completo_1dchd_94"
};
/**
* Modal (02 §7.13): solo confirmaciones y formularios cortos. 440 de ancho (312–560 en Android), surface-3, radio 20,
* sombra 4, padding 20. Título title2 y descripción de 14 en text-2. Pie a la derecha (Cancelar fantasma + acción
* primaria o peligro). Entra con scale(.96→1) y fundido en 200 ms. role=dialog aria-modal, foco atrapado, Esc cierra y
* Enter confirma el botón primario del pie. `completoEnCompacta` ocupa toda la pantalla por debajo de 600.
*/
var NO_CONFIRMA = "textarea, button, a[href], select, [role=\"button\"], [role=\"radio\"], [role=\"switch\"], [role=\"checkbox\"], [contenteditable=\"true\"]";
function Modal(p) {
	const { montada, saliendo } = usePresencia(p.abierto);
	const dialogo = (0, import_react.useRef)(null);
	const idTitulo = (0, import_react.useId)();
	const idDescripcion = (0, import_react.useId)();
	useCapa(p.abierto, true, p.alCerrar);
	useAtraparFoco(dialogo, p.abierto && montada);
	if (!montada || typeof document === "undefined") return null;
	const alTecla = (e) => {
		if (e.key !== "Enter" || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || e.nativeEvent.isComposing) return;
		if (e.target.closest(NO_CONFIRMA)) return;
		const primario = dialogo.current?.querySelector("[data-pie-modal] button[data-variante=\"primario\"]:not(:disabled), [data-pie-modal] button[data-variante=\"peligro\"]:not(:disabled)");
		if (!primario) return;
		e.preventDefault();
		primario.click();
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Modal_module_default.raiz, saliendo && Modal_module_default.saliendo),
		"data-capa-corte": "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: Modal_module_default.velo,
			"aria-hidden": "true",
			onClick: () => p.alCerrar()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogo,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": idTitulo,
			...p.descripcion ? { "aria-describedby": idDescripcion } : {},
			tabIndex: -1,
			className: cx(Modal_module_default.dialogo, Modal_module_default[`a${p.ancho ?? 440}`], p.completoEnCompacta && Modal_module_default.completo, p.className),
			onKeyDown: alTecla,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: Modal_module_default.cabeza,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: Modal_module_default.textos,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: Modal_module_default.titulo,
							id: idTitulo,
							children: p.titulo
						}), p.descripcion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: Modal_module_default.descripcion,
							id: idDescripcion,
							children: p.descripcion
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
						icono: "X",
						etiqueta: "Cerrar",
						tamano: "sm",
						alPulsar: () => p.alCerrar(),
						className: cx(Modal_module_default.cerrar)
					})]
				}),
				p.children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: Modal_module_default.cuerpo,
					children: p.children
				}) : null,
				p.pie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: Modal_module_default.pie,
					"data-pie-modal": "",
					children: p.pie
				}) : null
			]
		})]
	}), document.body);
}
var Hoja_module_default = {
	raiz: "_raiz_1dotm_1",
	velo: "_velo_1dotm_6",
	aparecer: "_aparecer_1dotm_1",
	marco: "_marco_1dotm_12",
	subir: "_subir_1dotm_1",
	hoja: "_hoja_1dotm_22",
	arrastrando: "_arrastrando_1dotm_44",
	saliendo: "_saliendo_1dotm_47",
	desaparecer: "_desaparecer_1dotm_1",
	bajar: "_bajar_1dotm_1",
	asa: "_asa_1dotm_54",
	asaBarra: "_asaBarra_1dotm_61",
	cabeza: "_cabeza_1dotm_67",
	titulo: "_titulo_1dotm_74",
	cuerpo: "_cuerpo_1dotm_83",
	pie: "_pie_1dotm_91"
};
/**
* Hoja inferior (02 §7.12, solo Android; en Windows se muestra como Modal de 440). surface-3, radio 28 arriba, asa de
* 36×4, puntos de anclaje (por omisión 50 % y 92 % del alto). Sigue al dedo 1:1 con transform; se cierra arrastrando
* hacia abajo más del 30 % de lo visible o a más de 0.5 px/ms. role=dialog aria-modal, foco atrapado, Esc cierra y
* <html data-overlay> apaga el vidrio mientras está abierta.
*/
function HojaAndroid(p) {
	const { montada, saliendo } = usePresencia(p.abierta);
	const hoja = (0, import_react.useRef)(null);
	const idTitulo = (0, import_react.useId)();
	const [baja, setBaja] = (0, import_react.useState)(0);
	const [alta, setAlta] = (0, import_react.useState)(true);
	const [arrastre, setArrastre] = (0, import_react.useState)(null);
	const anclas = p.anclas ?? [.5, .92];
	useCapa(p.abierta, true, p.alCerrar);
	useAtraparFoco(hoja, p.abierta && montada);
	const conPie = !!p.pie;
	(0, import_react.useLayoutEffect)(() => {
		if (!montada || !hoja.current) return;
		const altoHoja = hoja.current.offsetHeight;
		const altoVentana = window.innerHeight || 0;
		const desplazamiento = Math.max(0, Math.round(altoHoja - anclas[0] * altoVentana));
		setBaja(conPie ? 0 : desplazamiento);
		setAlta(conPie || desplazamiento === 0);
	}, [
		montada,
		anclas[0],
		anclas[1],
		conPie
	]);
	if (!montada || typeof document === "undefined") return null;
	const base = alta ? 0 : baja;
	const dy = arrastre?.dy ?? 0;
	const traslado = Math.max(alta ? 0 : -baja, dy) + base;
	const alBajar = (e) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		if (e.target.closest("button")) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		setArrastre({
			inicioY: e.clientY,
			inicioT: performance.now(),
			dy: 0,
			id: e.pointerId
		});
	};
	const alMover = (e) => {
		if (!arrastre || arrastre.id !== e.pointerId) return;
		setArrastre({
			...arrastre,
			dy: e.clientY - arrastre.inicioY
		});
	};
	const alSoltar = (e) => {
		if (!arrastre || arrastre.id !== e.pointerId) return;
		const visible = (hoja.current?.offsetHeight ?? 0) - base;
		const t = Math.max(1, performance.now() - arrastre.inicioT);
		const velocidad = arrastre.dy / t;
		setArrastre(null);
		if (arrastre.dy > 0 && (arrastre.dy > visible * .3 || velocidad > .5)) p.alCerrar();
		else if (arrastre.dy < -40 && !alta) setAlta(true);
		else if (arrastre.dy > 40 && alta && baja > 0) setAlta(false);
	};
	const manejadores = {
		onPointerDown: alBajar,
		onPointerMove: alMover,
		onPointerUp: alSoltar,
		onPointerCancel: alSoltar
	};
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Hoja_module_default.raiz, saliendo && Hoja_module_default.saliendo),
		"data-capa-corte": "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: Hoja_module_default.velo,
			"aria-hidden": "true",
			onClick: () => p.alCerrar()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: Hoja_module_default.marco,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: hoja,
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": idTitulo,
				tabIndex: -1,
				className: cx(Hoja_module_default.hoja, arrastre && Hoja_module_default.arrastrando, p.className),
				style: vars({
					"--alto-max": `${Math.round(anclas[1] * 100)}dvh`,
					"--traslado": `${traslado}px`
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: Hoja_module_default.asa,
						...manejadores,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: Hoja_module_default.asaBarra })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: Hoja_module_default.cabeza,
						...manejadores,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: Hoja_module_default.titulo,
							id: idTitulo,
							children: p.titulo
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "X",
							etiqueta: "Cerrar",
							alPulsar: () => p.alCerrar()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: Hoja_module_default.cuerpo,
						children: p.children
					}),
					p.pie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: Hoja_module_default.pie,
						"data-pie-modal": "",
						children: p.pie
					}) : null
				]
			})
		})]
	}), document.body);
}
function Hoja(p) {
	if (usePlataformaHtml() !== "android") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		abierto: p.abierta,
		titulo: p.titulo,
		alCerrar: p.alCerrar,
		ancho: 440,
		...p.pie ? { pie: p.pie } : {},
		...p.className ? { className: p.className } : {},
		children: p.children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HojaAndroid, { ...p });
}
var Menu_module_default = {
	menu: "_menu_5n6ax_1",
	colocado: "_colocado_5n6ax_15",
	opcion: "_opcion_5n6ax_19",
	peligro: "_peligro_5n6ax_50",
	sinIcono: "_sinIcono_5n6ax_54",
	texto: "_texto_5n6ax_58",
	listaHoja: "_listaHoja_5n6ax_62",
	opcionHoja: "_opcionHoja_5n6ax_67"
};
/**
* Menú ⋯ (02 §7, 01 §3.3). Windows: popover surface-3 con role=menu (flechas, Inicio/Fin, Esc devuelve el foco al
* disparador, clic fuera o Tab lo cierran). Android: hoja inferior con las mismas opciones a 48 dp.
*/
function Menu(p) {
	const plataforma = usePlataformaHtml();
	const [abierto, setAbierto] = (0, import_react.useState)(false);
	const [lugar, setLugar] = (0, import_react.useState)(null);
	const disparador = (0, import_react.useRef)(null);
	const lista = (0, import_react.useRef)(null);
	const idMenu = (0, import_react.useId)();
	const esPopover = plataforma !== "android";
	const cerrar = (0, import_react.useCallback)((devolverFoco) => {
		setAbierto(false);
		setLugar(null);
		if (devolverFoco) disparador.current?.focus();
	}, []);
	useCapa(abierto && esPopover, false, () => cerrar(true));
	(0, import_react.useLayoutEffect)(() => {
		if (!abierto || !esPopover) return;
		const d = disparador.current?.getBoundingClientRect();
		const l = lista.current;
		if (!d || !l) return;
		const ancho = l.offsetWidth;
		const alto = l.offsetHeight;
		let x = d.right - ancho;
		if (x < 8) x = Math.min(d.left, window.innerWidth - ancho - 8);
		let y = d.bottom + 6;
		if (y + alto > window.innerHeight - 8 && d.top - alto - 6 > 8) y = d.top - alto - 6;
		setLugar({
			x: Math.max(8, x),
			y
		});
		l.querySelector("[role=\"menuitem\"]:not(:disabled)")?.focus();
	}, [abierto, esPopover]);
	(0, import_react.useEffect)(() => {
		if (!abierto || !esPopover) return void 0;
		const fuera = (e) => {
			const t = e.target;
			if (lista.current?.contains(t) || disparador.current?.contains(t)) return;
			cerrar(false);
		};
		const alScroll = (e) => {
			if (lista.current?.contains(e.target)) return;
			cerrar(false);
		};
		document.addEventListener("pointerdown", fuera, true);
		window.addEventListener("scroll", alScroll, {
			capture: true,
			passive: true
		});
		window.addEventListener("resize", () => cerrar(false), { once: true });
		return () => {
			document.removeEventListener("pointerdown", fuera, true);
			window.removeEventListener("scroll", alScroll, { capture: true });
		};
	}, [
		abierto,
		esPopover,
		cerrar
	]);
	const alTeclaMenu = (e) => {
		const items = Array.from(lista.current?.querySelectorAll("[role=\"menuitem\"]:not(:disabled)") ?? []);
		const i = items.findIndex((x) => x === document.activeElement);
		const ir = (k) => items[(k + items.length) % items.length]?.focus();
		if (e.key === "ArrowDown") {
			e.preventDefault();
			ir(i + 1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			ir(i - 1);
		} else if (e.key === "Home") {
			e.preventDefault();
			ir(0);
		} else if (e.key === "End") {
			e.preventDefault();
			ir(items.length - 1);
		} else if (e.key === "Tab") cerrar(false);
	};
	const elegir = (o) => {
		if (o.deshabilitado) return;
		cerrar(esPopover);
		o.alPulsar();
	};
	const modo = p.disparador ?? "icono";
	const boton = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref: disparador,
		type: "button",
		className: modo === "icono" ? cx(BotonIcono_module_default.boton, BotonIcono_module_default.fantasma, abierto && BotonIcono_module_default.activo, p.className) : cx(Boton_module_default.boton, Boton_module_default.secundario, Boton_module_default.md, p.className),
		"aria-haspopup": "menu",
		"aria-expanded": abierto,
		"aria-controls": abierto ? idMenu : void 0,
		"aria-label": modo === "icono" ? p.etiqueta : void 0,
		onClick: () => abierto ? cerrar(false) : setAbierto(true),
		onKeyDown: (e) => {
			if (e.key === "ArrowDown" && !abierto) {
				e.preventDefault();
				setAbierto(true);
			}
		},
		children: modo === "icono" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: p.icono ?? "Ellipsis",
			tamano: 18
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Boton_module_default.contenido,
			children: [
				p.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: p.icono,
					tamano: 18
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.etiqueta }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "ChevronDown",
					tamano: 16
				})
			]
		})
	});
	const opciones = (enHoja) => p.opciones.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "menuitem",
		className: cx(Menu_module_default.opcion, enHoja && Menu_module_default.opcionHoja, o.peligro && Menu_module_default.peligro),
		disabled: !!o.deshabilitado,
		onClick: () => elegir(o),
		children: [o.icono ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
			nombre: o.icono,
			tamano: enHoja ? 22 : 18
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Menu_module_default.sinIcono,
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: Menu_module_default.texto,
			children: o.etiqueta
		})]
	}, o.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
			contenido: p.etiqueta,
			desactivado: modo !== "icono" || !esPopover || abierto,
			children: boton
		}),
		abierto && esPopover && typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: lista,
			id: idMenu,
			role: "menu",
			"aria-label": p.etiqueta,
			"data-capa-corte": "",
			className: cx(Menu_module_default.menu, lugar && Menu_module_default.colocado),
			style: lugar ? {
				left: lugar.x,
				top: lugar.y
			} : {
				left: -9999,
				top: -9999
			},
			onKeyDown: alTeclaMenu,
			children: opciones(false)
		}), document.body) : null,
		!esPopover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hoja, {
			abierta: abierto,
			titulo: p.etiqueta,
			alCerrar: () => cerrar(true),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "menu",
				"aria-label": p.etiqueta,
				className: Menu_module_default.listaHoja,
				onKeyDown: alTeclaMenu,
				ref: lista,
				children: opciones(true)
			})
		}) : null
	] });
}
var CampoBusqueda_module_default = {
	campo: "_campo_10tfx_1",
	lupa: "_lupa_10tfx_33",
	placeholder: "_placeholder_10tfx_36",
	kbd: "_kbd_10tfx_41"
};
function CampoBusqueda(p) {
	const alTecla = (e) => {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key.length === 1 && e.key !== " ") {
			e.preventDefault();
			p.alAbrir();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: cx(CampoBusqueda_module_default.campo, p.className),
		"aria-label": "Buscar",
		"aria-keyshortcuts": "Control+K",
		"aria-haspopup": "dialog",
		onClick: () => p.alAbrir(),
		onKeyDown: alTecla,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "Search",
				tamano: 16,
				className: cx(CampoBusqueda_module_default.lupa)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: CampoBusqueda_module_default.placeholder,
				children: "Buscar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kbd, {
				className: cx(CampoBusqueda_module_default.kbd),
				children: "Ctrl K"
			})
		]
	});
}
var PanelLateral_module_default = {
	raiz: "_raiz_1qdh7_1",
	velo: "_velo_1qdh7_6",
	aparecer: "_aparecer_1qdh7_1",
	panel: "_panel_1qdh7_12",
	entrar: "_entrar_1qdh7_1",
	saliendo: "_saliendo_1qdh7_30",
	desaparecer: "_desaparecer_1qdh7_1",
	salir: "_salir_1qdh7_1",
	cabeza: "_cabeza_1qdh7_36",
	titulo: "_titulo_1qdh7_45",
	acciones: "_acciones_1qdh7_57",
	cuerpo: "_cuerpo_1qdh7_62",
	pie: "_pie_1qdh7_70"
};
/**
* Panel lateral de 480 (02 §7.12): a la derecha, alto completo, surface-3, borde izquierdo y sombra 4. Entra deslizando
* 24 px con fundido en 280 ms y sale en 200. Velo --overlay-scrim, foco atrapado, Esc cierra y el foco vuelve a quien lo
* abrió (la fila). Encabezado con ⤢ "Abrir en página completa" (si hay alExpandir) y ✕; pie fijo surface-3.
* Quien lo usa decide si cabe (usePanelDisponible de @/app).
*/
function PanelLateral(p) {
	const { montada, saliendo } = usePresencia(p.abierto);
	const panel = (0, import_react.useRef)(null);
	const idTitulo = (0, import_react.useId)();
	useCapa(p.abierto, true, p.alCerrar);
	useAtraparFoco(panel, p.abierto && montada);
	if (!montada || typeof document === "undefined") return null;
	const alExpandir = p.alExpandir;
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(PanelLateral_module_default.raiz, saliendo && PanelLateral_module_default.saliendo),
		"data-capa-corte": "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: PanelLateral_module_default.velo,
			"aria-hidden": "true",
			onClick: () => p.alCerrar()
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: panel,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": idTitulo,
			tabIndex: -1,
			className: cx(PanelLateral_module_default.panel, p.className),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: PanelLateral_module_default.cabeza,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: PanelLateral_module_default.titulo,
						id: idTitulo,
						children: p.titulo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: PanelLateral_module_default.acciones,
						children: [alExpandir ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "Maximize2",
							etiqueta: "Abrir en página completa",
							tamano: "sm",
							alPulsar: () => alExpandir()
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "X",
							etiqueta: "Cerrar",
							tamano: "sm",
							alPulsar: () => p.alCerrar()
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: PanelLateral_module_default.cuerpo,
					children: p.children
				}),
				p.pie ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: PanelLateral_module_default.pie,
					children: p.pie
				}) : null
			]
		})]
	}), document.body);
}
var BurbujaRecorrido_module_default = {
	ancla: "_ancla_1h9og_1",
	burbuja: "_burbuja_1h9og_4",
	colocada: "_colocada_1h9og_22",
	flecha: "_flecha_1h9og_30",
	fila: "_fila_1h9og_46",
	marca: "_marca_1h9og_51",
	texto: "_texto_1h9og_60",
	cerrar: "_cerrar_1h9og_67",
	acciones: "_acciones_1h9og_70"
};
/**
* Burbuja de recorrido anclada a `children` (01 §4.15, BUILD §8.5): texto + [Siguiente] / [Entendido] y cerrar. Con
* visible = false solo pinta `children`. Al abrir toma el foco; Esc = Entendido. Se coloca debajo del ancla (o arriba si
* no cabe) en un portal con posición fija y se recoloca con el scroll y el tamaño de la ventana.
*/
var MARGEN = 12;
function BurbujaRecorrido(p) {
	const ancla = (0, import_react.useRef)(null);
	const burbuja = (0, import_react.useRef)(null);
	const idTexto = (0, import_react.useId)();
	const [lugar, setLugar] = (0, import_react.useState)(null);
	useCapa(p.visible, false, p.alEntendido);
	const colocar = (0, import_react.useCallback)(() => {
		const destino = ancla.current?.firstElementChild;
		const b = burbuja.current;
		if (!destino || !b) return;
		const r = destino.getBoundingClientRect();
		const ancho = b.offsetWidth;
		const alto = b.offsetHeight;
		const centro = r.left + r.width / 2;
		const x = Math.max(MARGEN, Math.min(window.innerWidth - ancho - MARGEN, centro - ancho / 2));
		let y = r.bottom + MARGEN;
		let arriba = false;
		if (y + alto > window.innerHeight - MARGEN && r.top - alto - MARGEN > MARGEN) {
			y = r.top - alto - MARGEN;
			arriba = true;
		}
		setLugar({
			x,
			y,
			flechaX: Math.max(16, Math.min(ancho - 16, centro - x)),
			arriba
		});
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		if (!p.visible) {
			setLugar(null);
			return;
		}
		const traerAncla = () => {
			const destino = ancla.current?.firstElementChild;
			if (!destino || typeof destino.scrollIntoView !== "function") return;
			const r = destino.getBoundingClientRect();
			if (r.bottom < MARGEN || r.top > window.innerHeight - MARGEN || r.right < 0 || r.left > window.innerWidth) destino.scrollIntoView({
				block: "center",
				inline: "nearest"
			});
		};
		traerAncla();
		colocar();
		const cuadro = window.requestAnimationFrame(() => {
			traerAncla();
			colocar();
		});
		window.addEventListener("resize", colocar);
		window.addEventListener("scroll", colocar, {
			capture: true,
			passive: true
		});
		return () => {
			window.cancelAnimationFrame(cuadro);
			window.removeEventListener("resize", colocar);
			window.removeEventListener("scroll", colocar, { capture: true });
		};
	}, [
		p.visible,
		p.texto,
		colocar
	]);
	(0, import_react.useEffect)(() => {
		if (p.visible) burbuja.current?.focus({ preventScroll: true });
	}, [p.visible, p.texto]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref: ancla,
		className: BurbujaRecorrido_module_default.ancla,
		children: [p.children, p.visible && typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: burbuja,
			role: "dialog",
			"aria-modal": "false",
			"aria-label": "Recorrido",
			"aria-describedby": idTexto,
			tabIndex: -1,
			"data-capa-corte": "",
			"data-arriba": lugar?.arriba ? "" : void 0,
			className: cx(BurbujaRecorrido_module_default.burbuja, lugar && BurbujaRecorrido_module_default.colocada, p.className),
			style: lugar ? {
				left: lugar.x,
				top: lugar.y,
				...vars({ "--flecha-x": `${lugar.flechaX}px` })
			} : {
				left: -9999,
				top: -9999
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: BurbujaRecorrido_module_default.flecha,
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: BurbujaRecorrido_module_default.fila,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: BurbujaRecorrido_module_default.marca,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: BurbujaRecorrido_module_default.texto,
							id: idTexto,
							children: p.texto
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "X",
							etiqueta: "Cerrar recorrido",
							tamano: "sm",
							alPulsar: p.alEntendido,
							className: cx(BurbujaRecorrido_module_default.cerrar)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: BurbujaRecorrido_module_default.acciones,
					children: p.esUltimo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "sm",
						alPulsar: p.alEntendido,
						children: "Entendido"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						alPulsar: p.alEntendido,
						children: "Entendido"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "sm",
						iconoFinal: "ArrowRight",
						alPulsar: p.alSiguiente,
						children: "Siguiente"
					})] })
				})
			]
		}), document.body) : null]
	});
}
var Toasts_module_default = {
	region: "_region_16e2q_1",
	android: "_android_16e2q_15",
	toast: "_toast_16e2q_33",
	entrar: "_entrar_16e2q_1",
	saliendo: "_saliendo_16e2q_48",
	salir: "_salir_16e2q_1",
	circulo: "_circulo_16e2q_51",
	ok: "_ok_16e2q_59",
	info: "_info_16e2q_60",
	error: "_error_16e2q_61",
	textos: "_textos_16e2q_62",
	texto: "_texto_16e2q_62",
	detalle: "_detalle_16e2q_74",
	accion: "_accion_16e2q_79",
	cerrar: "_cerrar_16e2q_103"
};
/**
* Avisos flotantes (02 §7.14, 01 §3.5): surface-4, borde, sombra 3, radio 10, alto mínimo 48, ancho máximo 420; círculo
* de estado de 24, texto de 14 (+ línea de 12) y acción opcional en --brand-ink. Abajo a la izquierda en Windows y abajo
* al centro en Android (sobre la barra inferior + 12). 6 s por omisión; se pausa con hover o foco; uno a la vez.
* role=status (errores: role=alert). "Deshacer" solo en lo reversible: lo decide quien llama.
*/
var ContextoToasts = (0, import_react.createContext)(null);
var SIN_PROVEEDOR = {
	mostrar: () => void 0,
	cerrar: () => void 0
};
function useToast() {
	return (0, import_react.useContext)(ContextoToasts) ?? SIN_PROVEEDOR;
}
function TarjetaToast(p) {
	const { toast } = p;
	const [pausado, setPausado] = (0, import_react.useState)(false);
	const restante = (0, import_react.useRef)(toast.duracion_ms ?? 6e3);
	const inicio = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (pausado || p.saliendo) return void 0;
		inicio.current = performance.now();
		const t = window.setTimeout(p.alCerrar, restante.current);
		return () => {
			window.clearTimeout(t);
			restante.current = Math.max(800, restante.current - (performance.now() - inicio.current));
		};
	}, [
		pausado,
		p.saliendo,
		p.alCerrar
	]);
	const tono = toast.tono ?? "ok";
	const accion = toast.accion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Toasts_module_default.toast, p.saliendo && Toasts_module_default.saliendo),
		role: tono === "error" ? "alert" : "status",
		onMouseEnter: () => setPausado(true),
		onMouseLeave: () => setPausado(false),
		onFocus: () => setPausado(true),
		onBlur: () => setPausado(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Toasts_module_default.circulo, Toasts_module_default[tono]),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: tono === "error" ? "CircleAlert" : tono === "info" ? "Info" : "Check",
					tamano: 14
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: Toasts_module_default.textos,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Toasts_module_default.texto,
					children: toast.texto
				}), toast.detalle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Toasts_module_default.detalle,
					children: toast.detalle
				}) : null]
			}),
			accion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: Toasts_module_default.accion,
				onClick: () => {
					accion.alPulsar();
					p.alCerrar();
				},
				children: accion.etiqueta
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
				icono: "X",
				etiqueta: "Cerrar aviso",
				tamano: "sm",
				alPulsar: p.alCerrar,
				className: cx(Toasts_module_default.cerrar)
			})
		]
	});
}
/** Lo monta ui-marco una vez en la raíz. */
function ProveedorToasts(p) {
	const plataforma = usePlataformaHtml();
	const [toast, setToast] = (0, import_react.useState)(null);
	const [saliendo, setSaliendo] = (0, import_react.useState)(false);
	const siguiente = (0, import_react.useRef)(1);
	const salida = (0, import_react.useRef)(null);
	const cerrar = (0, import_react.useCallback)(() => {
		setSaliendo(true);
		if (salida.current !== null) window.clearTimeout(salida.current);
		salida.current = window.setTimeout(() => {
			setToast(null);
			setSaliendo(false);
			salida.current = null;
		}, 200);
	}, []);
	const mostrar = (0, import_react.useCallback)((t) => {
		if (salida.current !== null) window.clearTimeout(salida.current);
		salida.current = null;
		setSaliendo(false);
		setToast({
			...t,
			id: siguiente.current++
		});
	}, []);
	(0, import_react.useEffect)(() => () => {
		if (salida.current !== null) window.clearTimeout(salida.current);
	}, []);
	const api = (0, import_react.useMemo)(() => ({
		mostrar,
		cerrar
	}), [mostrar, cerrar]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ContextoToasts.Provider, {
		value: api,
		children: [p.children, typeof document !== "undefined" ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Toasts_module_default.region, plataforma === "android" && Toasts_module_default.android),
			"data-capa-corte": "",
			children: toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaToast, {
				toast,
				saliendo,
				alCerrar: cerrar
			}, toast.id) : null
		}), document.body) : null]
	});
}
var Esqueleto_module_default = {
	base: "_base_6qvu6_2",
	linea: "_linea_6qvu6_3",
	valor: "_valor_6qvu6_4",
	miniatura: "_miniatura_6qvu6_5",
	titulo: "_titulo_6qvu6_13",
	bloque: "_bloque_6qvu6_17",
	foto: "_foto_6qvu6_21",
	circulo: "_circulo_6qvu6_25",
	texto: "_texto_6qvu6_31",
	kpi: "_kpi_6qvu6_40",
	filas: "_filas_6qvu6_52",
	fila: "_fila_6qvu6_52",
	filaTextos: "_filaTextos_6qvu6_71"
};
function medida(v) {
	if (v === void 0) return void 0;
	return typeof v === "number" ? `${v}px` : v;
}
function Esqueleto(p) {
	const estilo = {};
	const ancho = medida(p.ancho);
	const alto = medida(p.alto);
	if (ancho) estilo.width = ancho;
	if (alto) estilo.height = alto;
	const lineas = Math.max(1, p.lineas ?? (p.forma === "texto" ? 3 : p.forma === "fila" ? 4 : 1));
	if (p.forma === "texto") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Esqueleto_module_default.texto, p.className),
		style: ancho ? { width: ancho } : void 0,
		"aria-hidden": "true",
		children: Array.from({ length: lineas }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
			className: Esqueleto_module_default.linea,
			style: { width: i === lineas - 1 && lineas > 1 ? "62%" : "100%" }
		}, i))
	});
	if (p.forma === "kpi") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cx(Esqueleto_module_default.kpi, p.className),
		style: estilo,
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: Esqueleto_module_default.linea,
				style: { width: "58%" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: Esqueleto_module_default.valor }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: Esqueleto_module_default.linea,
				style: {
					width: "72%",
					height: 10
				}
			})
		]
	});
	if (p.forma === "fila") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Esqueleto_module_default.filas, p.className),
		style: ancho ? { width: ancho } : void 0,
		"aria-hidden": "true",
		children: Array.from({ length: lineas }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: Esqueleto_module_default.fila,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: Esqueleto_module_default.miniatura }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Esqueleto_module_default.filaTextos,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: Esqueleto_module_default.linea,
						style: { width: `${78 - i * 17 % 30}%` }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
						className: Esqueleto_module_default.linea,
						style: {
							width: `${44 - i * 11 % 16}%`,
							height: 10
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: Esqueleto_module_default.linea,
					style: { width: 64 }
				})
			]
		}, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
		className: cx(Esqueleto_module_default.base, Esqueleto_module_default[p.forma], p.className),
		style: estilo,
		"aria-hidden": "true"
	});
}
var EsqueletoVista_module_default = {
	vista: "_vista_1laz3_1",
	sr: "_sr_1laz3_7 _sr_1r6wq_4",
	formas: "_formas_1laz3_10",
	pulso: "_pulso_1laz3_1",
	lento: "_lento_1laz3_21"
};
function EsqueletoVista(p) {
	const [lento, setLento] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = window.setTimeout(() => setLento(true), 3e3);
		return () => window.clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(EsqueletoVista_module_default.vista, p.className),
		role: "status",
		"aria-busy": "true",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: EsqueletoVista_module_default.sr,
				children: "Cargando…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(EsqueletoVista_module_default.formas, "anim-loop"),
				"aria-hidden": "true",
				children: p.children
			}),
			lento ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: EsqueletoVista_module_default.lento,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Clock",
					tamano: 16
				}), p.textoLento ?? "Sigue cargando… revisa la conexión con tu PC"]
			}) : null
		]
	});
}
var EstadoVacio_module_default = {
	vacio: "_vacio_qojwa_1",
	circulo: "_circulo_qojwa_10",
	titulo: "_titulo_qojwa_21 _titulo3_1r6wq_57",
	texto: "_texto_qojwa_27",
	accion: "_accion_qojwa_34"
};
function EstadoVacio(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(EstadoVacio_module_default.vacio, p.className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: EstadoVacio_module_default.circulo,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: p.icono,
					tamano: 24
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: EstadoVacio_module_default.titulo,
				children: p.titulo
			}),
			p.texto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: EstadoVacio_module_default.texto,
				children: p.texto
			}) : null,
			p.accion ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "secundario",
				alPulsar: p.accion.alPulsar,
				className: cx(EstadoVacio_module_default.accion),
				children: p.accion.etiqueta
			}) : null
		]
	});
}
var BarraProgreso_module_default = {
	pista: "_pista_qd2si_1",
	relleno: "_relleno_qd2si_9"
};
function BarraProgreso(p) {
	const v = Number.isFinite(p.valor) ? Math.min(1, Math.max(0, p.valor)) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(BarraProgreso_module_default.pista, p.className),
		role: "progressbar",
		"aria-label": p.etiqueta,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		"aria-valuenow": Math.round(v * 100),
		style: vars({ "--p": v }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(BarraProgreso_module_default.relleno, "fc-fill", "anim-grow"),
			"data-completo": v >= 1 ? "" : void 0
		})
	});
}
var BarraEtapas_module_default = {
	barra: "_barra_qdviw_1",
	inicio: "_inicio_qdviw_9",
	muestras: "_muestras_qdviw_13",
	progreso: "_progreso_qdviw_17",
	dibujo: "_dibujo_qdviw_21",
	pista: "_pista_qdviw_24",
	segmento: "_segmento_qdviw_32",
	primero: "_primero_qdviw_43",
	medio: "_medio_qdviw_44",
	final: "_final_qdviw_45",
	completo: "_completo_qdviw_46",
	celdas: "_celdas_qdviw_49",
	celda: "_celda_qdviw_49",
	conCeldas: "_conCeldas_qdviw_61",
	publicada: "_publicada_qdviw_75",
	programada: "_programada_qdviw_76",
	video_listo: "_video_listo_qdviw_77",
	planeada: "_planeada_qdviw_78",
	textos: "_textos_qdviw_80",
	contador: "_contador_qdviw_88",
	cifra: "_cifra_qdviw_100",
	leyenda: "_leyenda_qdviw_106",
	elemento: "_elemento_qdviw_116",
	punto: "_punto_qdviw_122",
	muestra: "_muestra_qdviw_13"
};
var ORDEN_BARRA = [
	"publicada",
	"programada",
	"video_listo",
	"planeada"
];
var ORDEN_LEYENDA = [
	"planeada",
	"video_listo",
	"programada",
	"publicada"
];
var PALABRA = {
	planeada: "planeados",
	video_listo: "listos",
	programada: "programados",
	publicada: "publicados"
};
/** Más de esto, las celdas quedarían de menos de 4 px a 560: vuelve la pista continua. */
var MAX_CELDAS = 60;
/** '0 de 12 videos publicados' → ['0 de 12', ' videos publicados'] para resaltar la cifra. */
function partirContador(texto) {
	const m = /^(\S+\s+de\s+\S+)(.*)$/.exec(texto);
	return m ? [m[1] ?? texto, m[2] ?? ""] : ["", texto];
}
/** '1,250 de 2,000' → 1250 (la primera cifra del contador), o null si no hay. */
function primeraCifra(cifra) {
	const m = /^[^\d]*([\d.,\s]+)/.exec(cifra);
	if (!m?.[1]) return null;
	const n = Number(m[1].replace(/[^\d]/g, ""));
	return Number.isFinite(n) ? n : null;
}
function BarraEtapas(p) {
	const tamano = p.tamano ?? "inicio";
	const total = Math.max(0, Math.floor(p.total));
	const conteo = (etapa) => p.segmentos.filter((s) => s.etapa === etapa).reduce((a, s) => a + Math.max(0, s.n), 0);
	let acumulado = 0;
	const visibles = ORDEN_BARRA.map((etapa) => {
		const n = Math.min(conteo(etapa), Math.max(0, total - acumulado));
		acumulado += n;
		return {
			etapa,
			n
		};
	}).filter((s) => s.n > 0);
	const suma = visibles.reduce((a, s) => a + s.n, 0);
	const lleno = total > 0 && suma >= total;
	const [cifra, resto] = partirContador(p.contador);
	const usaProgramada = p.segmentos.some((s) => s.etapa === "programada");
	const leyenda = ORDEN_LEYENDA.filter((e) => e !== "programada" || usaProgramada);
	const conCeldas = tamano === "inicio" && total > 0 && total <= MAX_CELDAS;
	const ahora = Math.min(total, Math.max(0, primeraCifra(cifra) ?? conteo("publicada")));
	const desglose = leyenda.map((e) => `${formato.numero(conteo(e))} ${PALABRA[e]}`).join(", ");
	const contador = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: BarraEtapas_module_default.contador,
		children: [cifra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
			className: BarraEtapas_module_default.cifra,
			children: cifra
		}) : null, resto]
	});
	const textoLeyenda = p.leyenda === false ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: BarraEtapas_module_default.leyenda,
		children: leyenda.map((etapa, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: BarraEtapas_module_default.elemento,
			children: [
				i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: BarraEtapas_module_default.punto,
					"aria-hidden": "true",
					children: "·"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: cx(BarraEtapas_module_default.muestra, BarraEtapas_module_default[etapa], "fc-keep"),
					"aria-hidden": "true"
				}),
				formato.numero(conteo(etapa)),
				" ",
				PALABRA[etapa]
			]
		}, etapa))
	});
	const pista = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(BarraEtapas_module_default.pista, "fc-keep"),
		children: total > 0 ? visibles.map((s, i) => {
			const primero = i === 0;
			const ultimo = i === visibles.length - 1;
			const forma = visibles.length === 1 && lleno ? "completo" : primero ? "primero" : ultimo && lleno ? "final" : "medio";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
				className: cx(BarraEtapas_module_default.segmento, BarraEtapas_module_default[s.etapa], BarraEtapas_module_default[forma], "fc-fill"),
				style: vars({ "--parte": `${Math.min(s.n, total) / total * 100}%` }),
				"data-primero": primero ? "" : void 0
			}, s.etapa);
		}) : null
	});
	const etapaDeCelda = [];
	if (conCeldas) {
		for (const s of visibles) for (let k = 0; k < s.n; k++) etapaDeCelda.push(s.etapa);
		while (etapaDeCelda.length < total) etapaDeCelda.push(null);
	}
	const celdas = conCeldas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(BarraEtapas_module_default.celdas, "fc-keep"),
		style: vars({ "--n": total }),
		children: etapaDeCelda.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: cx(BarraEtapas_module_default.celda, e && BarraEtapas_module_default[e], e && "fc-fill") }, i))
	}) : null;
	const barra = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(BarraEtapas_module_default.progreso, conCeldas && BarraEtapas_module_default.conCeldas),
		role: "progressbar",
		"aria-label": p.contador,
		"aria-valuemin": 0,
		"aria-valuemax": total,
		"aria-valuenow": ahora,
		"aria-valuetext": desglose || p.contador,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: BarraEtapas_module_default.dibujo,
			role: "img",
			"aria-label": p.contador,
			children: [celdas, pista]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(BarraEtapas_module_default.barra, BarraEtapas_module_default[tamano], p.className),
		children: tamano === "muestras" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: BarraEtapas_module_default.textos,
			children: [contador, textoLeyenda]
		}), barra] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [barra, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: BarraEtapas_module_default.textos,
			children: [contador, textoLeyenda]
		})] })
	});
}
var Palomita_module_default = {
	palomita: "_palomita_1ho8u_1",
	circulo: "_circulo_1ho8u_11",
	crecer: "_crecer_1ho8u_1",
	trazo: "_trazo_1ho8u_17",
	trazar: "_trazar_1ho8u_1"
};
function Palomita(p) {
	const t = p.tamano ?? 48;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cx(Palomita_module_default.palomita, "fc-keep", p.className),
		style: vars({ "--t": `${t}px` }),
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 48",
			width: t,
			height: t,
			focusable: "false",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				className: Palomita_module_default.circulo,
				cx: "24",
				cy: "24",
				r: "22"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: Palomita_module_default.trazo,
				d: "M14.5 24.5 21 31l12.5-13",
				pathLength: 1
			})]
		})
	});
}
var Ticket_module_default = {
	ticket: "_ticket_l9pu7_1",
	cabeza: "_cabeza_l9pu7_23",
	marca: "_marca_l9pu7_33",
	subtitulo: "_subtitulo_l9pu7_41",
	ilustracion: "_ilustracion_l9pu7_50",
	diagonal: "_diagonal_l9pu7_58",
	palomita: "_palomita_l9pu7_68",
	renglones: "_renglones_l9pu7_71",
	renglon: "_renglon_l9pu7_71",
	concepto: "_concepto_l9pu7_83",
	guia: "_guia_l9pu7_90",
	cifra: "_cifra_l9pu7_96",
	rayado: "_rayado_l9pu7_102",
	total: "_total_l9pu7_109",
	totalEtiqueta: "_totalEtiqueta_l9pu7_119",
	totalCifra: "_totalCifra_l9pu7_125",
	totalLargo: "_totalLargo_l9pu7_134"
};
/**
* Ticket de corte (02 §2.3 regla 4, §7.22): tira surface-1 con borde inferior dentado (máscara zigzag de 8 px), filetes
* punteados de 1 px entre secciones, renglones "concepto ··· cifra" con guía punteada y el total en cifras anchas
* (display al 125 %). Variante 'al_dia': diagonal a 45° exactos (M24 112 L128 8) y palomita en círculo ok.
*/
function Ticket(p) {
	const variante = p.variante ?? "semana";
	const idTitulo = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cx(Ticket_module_default.ticket, p.className),
		"aria-labelledby": idTitulo,
		"data-variante": variante,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: Ticket_module_default.cabeza,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Ticket_module_default.marca,
					"aria-hidden": "true",
					children: "corte"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: Ticket_module_default.subtitulo,
					id: idTitulo,
					children: [p.titulo, p.subtitulo ? ` · ${p.subtitulo}` : ""]
				})]
			}),
			variante === "al_dia" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ticket_module_default.ilustracion,
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					viewBox: "0 0 152 120",
					width: "152",
					height: "120",
					focusable: "false",
					className: Ticket_module_default.diagonal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M24 112 L128 8" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, {
					tamano: 52,
					className: cx(Ticket_module_default.palomita)
				})]
			}) : null,
			p.renglones.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: Ticket_module_default.renglones,
				children: p.renglones.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: Ticket_module_default.renglon,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
							className: Ticket_module_default.concepto,
							children: [r.rayado ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
								className: cx(Ticket_module_default.rayado, "fc-keep"),
								"aria-hidden": "true"
							}) : null, r.concepto]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: Ticket_module_default.guia,
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: Ticket_module_default.cifra,
							children: r.cifra
						})
					]
				}, r.concepto))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: Ticket_module_default.total,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: Ticket_module_default.totalEtiqueta,
					children: variante === "al_dia" ? "Estás al día" : "Total de la semana"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Ticket_module_default.totalCifra, p.total.length > 9 && Ticket_module_default.totalLargo),
					children: p.total
				})]
			})
		]
	});
}
var MosaicoQr_module_default = {
	tile: "_tile_1xby8_1",
	qr: "_qr_1xby8_16",
	vacio: "_vacio_1xby8_22",
	logo: "_logo_1xby8_28",
	marca: "_marca_1xby8_40",
	marcaFondo: "_marcaFondo_1xby8_44",
	marcaLima: "_marcaLima_1xby8_45",
	marcaPieza: "_marcaPieza_1xby8_46"
};
function MarcaCorte(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 1024 1024",
		className: p.className,
		"aria-hidden": "true",
		focusable: "false",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "1024",
			height: "1024",
			rx: "270",
			className: MosaicoQr_module_default.marcaFondo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			transform: "translate(18 -6)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M741.81 319.16A300 300 0 0 0 278.45 700.29L398.82 579.93A132 132 0 0 1 613.12 427.15Z",
				className: MosaicoQr_module_default.marcaLima
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M323.71 745.55A300 300 0 0 0 741.81 704.84L613.12 596.85A132 132 0 0 1 444.07 625.18Z",
				className: MosaicoQr_module_default.marcaPieza,
				transform: "translate(-15.56 15.56)"
			})]
		})]
	});
}
function MosaicoQr(p) {
	const valido = /^data:image\/(png|svg\+xml|webp);base64,[A-Za-z0-9+/=]+$/.test(p.png);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cx(MosaicoQr_module_default.tile, p.className),
		children: [valido ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			className: MosaicoQr_module_default.qr,
			src: p.png,
			alt: p.alt,
			draggable: false
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: MosaicoQr_module_default.vacio,
			role: "img",
			"aria-label": p.alt
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: MosaicoQr_module_default.logo,
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarcaCorte, { className: cx(MosaicoQr_module_default.marca) })
		})]
	});
}
var CodigoEmparejamiento_module_default = {
	codigo: "_codigo_12vk9_1",
	sr: "_sr_12vk9_8 _sr_1r6wq_4",
	grupos: "_grupos_12vk9_11",
	grupo: "_grupo_12vk9_11",
	cuenta: "_cuenta_12vk9_40",
	anillo: "_anillo_12vk9_45",
	pista: "_pista_12vk9_51",
	avance: "_avance_12vk9_56",
	texto: "_texto_12vk9_65",
	vencido: "_vencido_12vk9_72"
};
/**
* Código manual de emparejamiento (C6, 02 §7.19): 12 caracteres Crockford 'ABCD-EFGH-JKMN' en Geist Mono 30/36, 600,
* en 3 grupos de 4, y un anillo de cuenta regresiva de 36 (5 min, trazo --brand-ink) con "Caduca en 4:52" en mono.
* El reloj es el de @/dominio (ahoraS, inyectable en pruebas). Llama alVencer una sola vez al llegar a cero.
*/
var VENTANA_S = 300;
function gruposDeCodigo(codigo) {
	const limpio = codigo.toUpperCase().replace(/[^0-9A-Z]/g, "");
	const grupos = [];
	for (let i = 0; i < limpio.length; i += 4) grupos.push(limpio.slice(i, i + 4));
	return grupos;
}
function mmss(s) {
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function CodigoEmparejamiento(p) {
	const [ahora, setAhora] = (0, import_react.useState)(() => ahoraS());
	const avisado = (0, import_react.useRef)(false);
	const alVencer = (0, import_react.useRef)(p.alVencer);
	alVencer.current = p.alVencer;
	const restante = Math.max(0, Math.round(p.expiraAt - ahora));
	(0, import_react.useEffect)(() => {
		avisado.current = false;
		setAhora(ahoraS());
		const t = window.setInterval(() => setAhora(ahoraS()), 1e3);
		return () => window.clearInterval(t);
	}, [p.expiraAt]);
	(0, import_react.useEffect)(() => {
		if (restante === 0 && !avisado.current) {
			avisado.current = true;
			alVencer.current?.();
		}
	}, [restante]);
	const grupos = gruposDeCodigo(p.codigo);
	const fraccion = Math.min(1, restante / VENTANA_S);
	const vencido = restante === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(CodigoEmparejamiento_module_default.codigo, vencido && CodigoEmparejamiento_module_default.vencido, p.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: CodigoEmparejamiento_module_default.grupos,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: CodigoEmparejamiento_module_default.sr,
				children: `Código: ${grupos.map((g) => g.split("").join(" ")).join(", ")}`
			}), grupos.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: CodigoEmparejamiento_module_default.grupo,
				"aria-hidden": "true",
				children: g
			}, i))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: CodigoEmparejamiento_module_default.cuenta,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: cx(CodigoEmparejamiento_module_default.anillo, "fc-keep"),
				viewBox: "0 0 36 36",
				"aria-hidden": "true",
				focusable: "false",
				style: vars({ "--f": fraccion }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					className: CodigoEmparejamiento_module_default.pista,
					cx: "18",
					cy: "18",
					r: "15"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					className: CodigoEmparejamiento_module_default.avance,
					cx: "18",
					cy: "18",
					r: "15",
					pathLength: 1
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: CodigoEmparejamiento_module_default.texto,
				role: "timer",
				"aria-live": "off",
				children: vencido ? "Código vencido" : `Caduca en ${mmss(restante)}`
			})]
		})]
	});
}
/** Escalas y medidas de las gráficas SVG propias (02 §9). Sin dependencias. */
/** Marcas "bonitas" del eje Y: 0 · paso · 2 pasos… con a lo más `objetivo` intervalos (pasos 1/2/2.5/5 × 10^k). */
function marcasEje(maximo, objetivo = 4) {
	if (!Number.isFinite(maximo) || maximo <= 0) return [0, 1];
	const crudo = maximo / objetivo;
	const potencia = 10 ** Math.floor(Math.log10(crudo));
	const paso = [
		1,
		2,
		2.5,
		5,
		10
	].map((m) => m * potencia).find((p) => maximo / p <= objetivo) ?? 10 * potencia;
	const marcas = [];
	for (let v = 0; v < maximo + paso * .001; v += paso) marcas.push(Math.round(v * 1e6) / 1e6);
	if ((marcas[marcas.length - 1] ?? 0) < maximo) marcas.push(Math.round(((marcas[marcas.length - 1] ?? 0) + paso) * 1e6) / 1e6);
	return marcas;
}
/** Ancho aproximado de un texto de 11 px (para reservar el margen del eje y decidir qué etiquetas caben). */
function anchoTexto(texto, px = 11) {
	let a = 0;
	for (const ch of texto) a += /[0-9]/.test(ch) ? .58 : /[il.,:;'|!\s]/.test(ch) ? .3 : /[MW%$m]/.test(ch) ? .82 : .56;
	return a * px;
}
/** Trayecto de una barra vertical con el extremo de datos redondeado a 4 px y la base recta (02 §9.4.4). */
function barraVertical(x, ancho, yBase, yTope, radio = 4, redondear = true) {
	const alto = Math.max(0, yBase - yTope);
	if (alto <= 0) return "";
	const r = redondear ? Math.min(radio, alto, ancho / 2) : 0;
	const x1 = x + ancho;
	if (r <= 0) return `M${x} ${yBase}V${yTope}H${x1}V${yBase}Z`;
	return `M${x} ${yBase}V${yTope + r}Q${x} ${yTope} ${x + r} ${yTope}H${x1 - r}Q${x1} ${yTope} ${x1} ${yTope + r}V${yBase}Z`;
}
/** 'marzo 2026: $1,234 de comisión, 56 unidades' → ['$1,234 de comisión, 56 unidades', 'marzo 2026']. */
function partirAria(aria, respaldo) {
	const i = aria.indexOf(": ");
	if (i <= 0) return {
		valor: aria,
		etiqueta: respaldo
	};
	return {
		valor: aria.slice(i + 2),
		etiqueta: aria.slice(0, i)
	};
}
/** Cada cuántas etiquetas del eje X se pinta una para que no se encimen (cota inferior; ver etiquetasEje). */
function pasoEtiquetas(etiquetas, anchoRanura) {
	const mayor = Math.max(0, ...etiquetas.map((e) => anchoTexto(e)));
	if (anchoRanura <= 0) return 1;
	return Math.max(1, Math.ceil((mayor + 8) / anchoRanura));
}
/** Centra un texto en `centro` salvo que se salga de [min, max]: entonces se ancla al borde que cruza. */
function anclarTexto(centro, ancho, min, max) {
	if (centro + ancho / 2 > max) return {
		x: max,
		ancla: "end"
	};
	if (centro - ancho / 2 < min) return {
		x: min,
		ancla: "start"
	};
	return {
		x: centro,
		ancla: "middle"
	};
}
/** Extremos [izquierdo, derecho] de un texto ya anclado. */
function extremosTexto(x, ancho, ancla) {
	const izq = ancla === "start" ? x : ancla === "end" ? x - ancho : x - ancho / 2;
	return [izq, izq + ancho];
}
/**
* Ancho de barra como el lienzo aprobado: la ranura menos el gap del lienzo (Main: semanas con gap 10 y tope de 46;
* Ventas: meses con gap 14 y tope de 64), así a 1280 y a 1440 da 46 y 64 como el lienzo. En ranuras angostas el gap
* fijo dejaría barras de hilo (30 días a 600), así que nunca baja del 62 % de la ranura ni de 4 px.
*/
function anchoBarra(ranura, medidaLienzo, gapLienzo = 10) {
	return Math.min(medidaLienzo, Math.max(4, ranura * .62, ranura - gapLienzo));
}
/** ¿Dos cajas se tocan (con `aire` px de margen)? */
function seEnciman(a, b, aire = 3) {
	return a[0] < b[1] + aire && b[0] < a[1] + aire && a[2] < b[3] + aire && b[2] < a[3] + aire;
}
/** La base del rótulo va 7 px sobre el tope de su barra. */
var SOBRE_TOPE = 7;
/** Margen mínimo entre un rótulo y cualquier barra u otro rótulo. */
var AIRE_ROTULO = 3;
/** Lo más que se sube el «en curso» sobre su sitio para librar una barra vecina (dos renglones); más lejos ya no se lee
*  como de su columna y se quita (el periodo en curso sigue marcado por el contorno, la lectura y la tabla gemela). */
var ELEVACION_MAXIMA = 24;
/** Lo más que un rótulo puede asomar por arriba del SVG (el margen superior del área es de 22 px). */
var TECHO = -4;
/** Coloca un rótulo de uno o varios renglones centrado en `centro` (anclado al borde si se saldría de [0, ancho]). */
function colocarRenglones(renglones, centro, yBase, ancho) {
	const w = Math.max(0, ...renglones.map((r) => anchoTexto(r, 11)));
	const { x, ancla } = anclarTexto(centro, w, 0, ancho);
	const [a, b] = extremosTexto(x, w, ancla);
	return {
		renglones,
		x,
		ancla,
		yBase,
		caja: [
			a,
			b,
			yBase - (renglones.length - 1) * 12 - 11,
			yBase + 3
		]
	};
}
/**
* Coloca los rótulos directos de una gráfica de columnas sin que ninguno pise una barra ajena ni a otro rótulo (con
* 3 px de aire), contando el corrimiento del anclaje al borde del SVG:
* 1. el pico se pinta siempre; si una barra vecina más alta lo alcanzaría (en las apiladas cuenta lo reembolsado), sube
*    sobre ella. Si el pico es el periodo en curso, va encima de su «en curso» como el último valor (paso 3);
* 2. el «en curso»: en un renglón si cabe a lo ancho entre las barras vecinas; si no, en dos ('en' / 'curso'); si ni así,
*    el que libre a las vecinas por altura; si ninguno, sube sobre la vecina hasta dos renglones; si aun así no cabe,
*    se quita;
* 3. el último valor va encima del «en curso» (o 7 px sobre su barra) y solo si no toca ninguna barra ajena ni otro
*    rótulo; si no cabe no se pinta: el valor sigue en la lectura y en la tabla gemela.
*/
function colocarRotulos(e) {
	const barras = e.columnas.map((c) => c.yTope < e.yBase - .5 ? [
		c.centro - e.barra / 2,
		c.centro + e.barra / 2,
		c.yTope,
		e.yBase
	] : null);
	const ajenas = (i) => barras.filter((b, j) => j !== i && b !== null);
	const cruzaEnX = (c, b) => c[0] < b[1] + AIRE_ROTULO && b[0] < c[1] + AIRE_ROTULO;
	const libre = (c, i, otros) => c[2] >= TECHO && ajenas(i).every((b) => !seEnciman(c, b, AIRE_ROTULO)) && otros.every((o) => !seEnciman(c, o, AIRE_ROTULO));
	/** El rótulo en su sitio o, si alguna barra ajena lo alcanza, subido justo sobre la más alta de las que cruza. */
	const subir = (renglones, col, i) => {
		const base = col.yTope - SOBRE_TOPE;
		const enSuSitio = colocarRenglones(renglones, col.centro, base, e.ancho);
		const tope = Math.min(base, ...ajenas(i).filter((b) => cruzaEnX(enSuSitio.caja, b)).map((b) => b[2] - AIRE_ROTULO - 3));
		return tope < base ? colocarRenglones(renglones, col.centro, tope, e.ancho) : enSuSitio;
	};
	const ocupadas = [];
	const colPico = e.pico ? e.columnas[e.pico.i] : void 0;
	let pico = e.pico && colPico && !colPico.enCurso ? subir([e.pico.texto], colPico, e.pico.i) : null;
	if (pico) ocupadas.push(pico.caja);
	const enCurso = /* @__PURE__ */ new Map();
	e.columnas.forEach((col, i) => {
		if (!col.enCurso) return;
		const base = col.yTope - SOBRE_TOPE;
		const uno = colocarRenglones(["en curso"], col.centro, base, e.ancho);
		const dos = colocarRenglones(["en", "curso"], col.centro, base, e.ancho);
		const libreAloAncho = (r) => ajenas(i).every((b) => !cruzaEnX(r.caja, b)) && libre(r.caja, i, ocupadas);
		const elegido = [uno, dos].find(libreAloAncho) ?? [dos, uno].find((r) => libre(r.caja, i, ocupadas)) ?? [subir(["en", "curso"], col, i), subir(["en curso"], col, i)].filter((r) => base - r.yBase <= ELEVACION_MAXIMA && libre(r.caja, i, ocupadas)).sort((a, b) => b.yBase - a.yBase)[0];
		if (elegido) {
			enCurso.set(i, elegido);
			ocupadas.push(elegido.caja);
		}
	});
	/** Un valor encima del «en curso» de su columna (o 7 px sobre su barra si no lo hay), solo si no toca nada ajeno. */
	const encima = (texto, i) => {
		const col = e.columnas[i];
		if (!col) return null;
		const debajo = enCurso.get(i);
		const base = debajo ? debajo.yBase - debajo.renglones.length * 12 : col.yTope - SOBRE_TOPE;
		const r = colocarRenglones([texto], col.centro, base, e.ancho);
		return libre(r.caja, i, ocupadas.filter((c) => c !== debajo?.caja)) ? r : null;
	};
	if (e.pico && colPico?.enCurso) {
		pico = encima(e.pico.texto, e.pico.i);
		if (pico) ocupadas.push(pico.caja);
	}
	const ultimo = e.ultimo ? encima(e.ultimo.texto, e.ultimo.i) : null;
	return {
		pico,
		enCurso,
		ultimo
	};
}
/**
* Etiquetas del eje X que se pintan sin encimarse. Se cuentan DESDE EL FINAL con un paso uniforme (el periodo más
* reciente siempre lleva la suya) y la que se saldría del área se ancla a su borde: 'end' a la derecha, 'start' a la
* izquierda. Si al anclarla queda a menos de `separacion` px de su vecina, se prueba el paso siguiente; con paso = n
* queda solo la última, así que siempre hay respuesta.
* `obligatorias` (p. ej. la columna pico, que lleva el rótulo arriba) entran siempre que quepan junto a la última: se
* suman al paso uniforme y se quitan las vecinas no obligatorias que se les enciman. Así a 390 «31 ago» queda debajo de
* la barra iris en vez de perderse por el adelgazado.
*/
function etiquetasEje(etiquetas, centro, min, max, separacion = 6, obligatorias = []) {
	const n = etiquetas.length;
	if (n === 0) return [];
	const anchos = etiquetas.map((e) => anchoTexto(e));
	const ranura = n > 1 ? Math.abs(centro(1) - centro(0)) : max - min;
	const etiqueta = (i) => ({
		i,
		...anclarTexto(centro(i), anchos[i] ?? 0, min, max)
	});
	const separadas = (a, b) => {
		const [primera, segunda] = a.i < b.i ? [a, b] : [b, a];
		const [, finAqui] = extremosTexto(primera.x, anchos[primera.i] ?? 0, primera.ancla);
		const [inicioSiguiente] = extremosTexto(segunda.x, anchos[segunda.i] ?? 0, segunda.ancla);
		return inicioSiguiente - finAqui >= separacion;
	};
	const caben = (lista) => lista.every((e, k) => k === lista.length - 1 || separadas(e, lista[k + 1]));
	const fijas = [...new Set(obligatorias.filter((i) => Number.isInteger(i) && i >= 0 && i < n - 1))];
	const protegidas = /* @__PURE__ */ new Set([n - 1, ...fijas]);
	for (let paso = pasoEtiquetas(etiquetas, ranura); paso <= n; paso++) {
		const indices = new Set(fijas);
		for (let i = n - 1; i >= 0; i -= paso) indices.add(i);
		const ordenadas = [...indices].sort((a, b) => a - b).map(etiqueta);
		const elegidas = fijas.length === 0 ? ordenadas : ordenadas.filter((e) => protegidas.has(e.i) || ordenadas.every((o) => o === e || !protegidas.has(o.i) || separadas(e, o)));
		if (caben(elegidas)) return elegidas;
	}
	const conFijas = [...protegidas].sort((a, b) => a - b).map(etiqueta);
	return caben(conFijas) ? conFijas : [etiqueta(n - 1)];
}
/**
* Marco común de las gráficas (02 §9.4): título (title3) con su nota, "Ver como tabla" (tabla gemela accesible en todas
* las gráficas), leyenda opcional y el área de trazado con UNA sola animación de aparición (clip-path en Windows,
* fundido en Android; nada con movimiento reducido).
*/
var NUMERICA = /^[−\-+≈$]?\s?\$?[\d.,]+(\s?(%|mil|M))?$/;
var MONTO_FINAL = /^[−\-+≈]?\s?\$[\d.,]+(\s?(mil|M))?$/;
/** Nota de texto que termina en « · $monto»: el monto va resaltado (text-1, 600) y el resto se queda en text-2. */
function notaConCifra(nota) {
	if (typeof nota !== "string") return nota;
	const i = nota.lastIndexOf(" · ");
	const cola = i >= 0 ? nota.slice(i + 3) : "";
	if (!MONTO_FINAL.test(cola.trim())) return nota;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [nota.slice(0, i + 3), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
		className: graficas_module_default.notaCifra,
		children: cola
	})] });
}
function TablaGemelaVista(p) {
	const derecha = p.tabla.columnas.map((_, ci) => p.tabla.filas.length > 0 && p.tabla.filas.every((f) => NUMERICA.test((f[ci] ?? "").trim())));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: graficas_module_default.tablaGemela,
		id: p.id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: graficas_module_default.tabla,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
					className: graficas_module_default.sr,
					children: p.titulo
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: p.tabla.columnas.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "col",
					className: cx(derecha[i] && graficas_module_default.num),
					children: c
				}, c)) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: p.tabla.filas.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: f.map((celda, ci) => ci === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					scope: "row",
					children: celda
				}, ci) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: cx(derecha[ci] && graficas_module_default.num),
					children: celda
				}, ci)) }, i)) })
			]
		})
	});
}
function MarcoGrafica(p) {
	const plataforma = usePlataformaHtml();
	const idTitulo = (0, import_react.useId)();
	const idTabla = (0, import_react.useId)();
	const [verTabla, setVerTabla] = (0, import_react.useState)(false);
	const area = (0, import_react.useRef)(null);
	const tamano = useTamano(area);
	const [primera, setPrimera] = (0, import_react.useState)(true);
	(0, import_react.useLayoutEffect)(() => {
		const t = window.setTimeout(() => setPrimera(false), 600);
		return () => window.clearTimeout(t);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cx(graficas_module_default.grafica, p.className),
		"aria-labelledby": idTitulo,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: graficas_module_default.cabeza,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: graficas_module_default.titulo,
						id: idTitulo,
						children: p.titulo
					}),
					p.nota ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: graficas_module_default.nota,
						children: notaConCifra(p.nota)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: graficas_module_default.verTabla,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "fantasma",
							tamano: "sm",
							icono: verTabla ? "ChartColumn" : "LayoutList",
							alPulsar: () => setVerTabla((v) => !v),
							"aria-label": verTabla ? `Ver gráfica: ${p.titulo}` : `Ver como tabla: ${p.titulo}`,
							children: verTabla ? "Ver gráfica" : "Ver como tabla"
						})
					})
				]
			}),
			p.leyenda && !verTabla ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: graficas_module_default.leyenda,
				children: p.leyenda
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: area,
				className: cx(graficas_module_default.area, primera && (plataforma === "android" ? graficas_module_default.apareceFundido : graficas_module_default.aparece), "anim-grow", "fc-keep"),
				hidden: verTabla,
				children: p.children(tamano)
			}),
			verTabla ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablaGemelaVista, {
				titulo: p.titulo,
				tabla: p.tablaGemela,
				id: idTabla
			}) : null
		]
	});
}
/** Lectura flotante de la marca con hover o foco: el valor manda y la etiqueta acompaña (02 §7.20). */
function LecturaGrafica(p) {
	const ref = (0, import_react.useRef)(null);
	const [anchoGlobo, setAnchoGlobo] = (0, import_react.useState)(160);
	const [altoGlobo, setAltoGlobo] = (0, import_react.useState)(48);
	(0, import_react.useLayoutEffect)(() => {
		if (!ref.current) return;
		setAnchoGlobo(ref.current.offsetWidth || 160);
		setAltoGlobo(ref.current.offsetHeight || 48);
	}, [
		p.valor,
		p.etiqueta,
		p.filas
	]);
	const x = Math.max(0, Math.min(p.ancho - anchoGlobo, p.x - anchoGlobo / 2));
	const arriba = p.y - altoGlobo - 10;
	const y = arriba < -8 ? p.y + 14 : arriba;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: graficas_module_default.lectura,
		style: {
			left: x,
			top: y
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
				className: graficas_module_default.lecturaValor,
				children: p.valor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: graficas_module_default.lecturaEtiqueta,
				children: p.etiqueta
			}),
			p.filas && p.filas.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: graficas_module_default.lecturaFilas,
				children: p.filas.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: graficas_module_default.lecturaFila,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: cx(graficas_module_default.clave, graficas_module_default[f.muestra]) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: graficas_module_default.lecturaFilaEtiqueta,
							children: f.etiqueta
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.valor })
					]
				}, f.clave))
			}) : null
		]
	});
}
function RotuloArriba(p) {
	const { renglones, x, ancla, yBase } = p.rotulo;
	const y0 = yBase - (renglones.length - 1) * 12;
	const clase = p.tipo === "en_curso" ? graficas_module_default.enCursoTexto : p.tipo === "pico" ? graficas_module_default.pico : graficas_module_default.ultimoValor;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y: y0,
		textAnchor: ancla,
		className: clase,
		children: renglones.length === 1 ? renglones[0] : renglones.map((r, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tspan", {
			x,
			dy: k === 0 ? 0 : 12,
			children: r
		}, r))
	});
}
/**
* Foco itinerante entre las marcas de una gráfica: una sola parada de Tab y las flechas recorren las marcas (02 §12.2:
* cada marca es enfocable y tiene aria-label, sin llenar la página de paradas de Tab).
*/
/** `filas` > 1 = rejilla (calendario: ↑/↓ saltan 1 y ←/→ saltan `filas`). */
function useRoving(n, filas = 1) {
	const [foco, setFocoEstado] = (0, import_react.useState)(0);
	const contenedor = (0, import_react.useRef)(null);
	const ir = (i) => {
		if (n <= 0) return;
		const d = Math.max(0, Math.min(n - 1, i));
		setFocoEstado(d);
		contenedor.current?.querySelector(`[data-marca="${d}"]`)?.focus();
	};
	const alTecla = (e) => {
		const horizontal = filas > 1 ? filas : 1;
		const mapa = filas > 1 ? {
			ArrowRight: horizontal,
			ArrowLeft: -horizontal,
			ArrowDown: 1,
			ArrowUp: -1
		} : {
			ArrowRight: 1,
			ArrowLeft: -1,
			ArrowDown: 1,
			ArrowUp: -1
		};
		if (e.key in mapa) {
			e.preventDefault();
			ir(foco + (mapa[e.key] ?? 0));
		} else if (e.key === "Home") {
			e.preventDefault();
			ir(0);
		} else if (e.key === "End") {
			e.preventDefault();
			ir(n - 1);
		}
	};
	return {
		foco: Math.min(foco, Math.max(0, n - 1)),
		setFoco: setFocoEstado,
		contenedor,
		alTecla
	};
}
/**
* Columnas de UNA serie (02 §9.1, §9.4): --viz-mono; hover/foco/selección en --viz-current con transición de fill.
* Barras como el lienzo aprobado (Main.png: 46 px en semanas, gap 10), nunca bajo el 62 % de la ranura (anchoBarra; el lienzo
* manda sobre los 24 px de 02 §9.4.4, LEEME.md:17), extremo de datos redondeado a 4 px y base recta. Retícula fina
* --viz-grid y línea base --viz-axis. Etiquetas directas selectivas: el máximo (en reposo esa columna va en
* --viz-current, Main.png) y el último valor, el extremo; colocarRotulos los pone sin pisar ninguna barra ajena ni a otro
* rótulo, contando el anclaje al borde (el último se quita si no cabe). Periodo en curso: relleno al 35 % con contorno de
* 1.5 px y "en curso". Eje X con etiquetasEje (desde el final, sin encimarse y ancladas al borde). Cada
* columna es su objetivo (la ranura completa), enfocable con aria-label. Tabla gemela.
*/
var ANCHO_RESPALDO$1 = 640;
/** Ancho de barra del lienzo aprobado para columnas semanales (Main.html: max-width 46px). */
var BARRA_LIENZO$1 = 46;
function GraficaColumnas(p) {
	const [activa, setActiva] = (0, import_react.useState)(null);
	const roving = useRoving(p.puntos.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarcoGrafica, {
		titulo: p.titulo,
		nota: p.nota,
		tablaGemela: p.tablaGemela,
		className: p.className,
		children: ({ ancho }) => {
			const W = ancho > 0 ? ancho : ANCHO_RESPALDO$1;
			const H = p.alto ?? 200;
			const valores = p.puntos.map((x) => Math.max(0, x.valor));
			const maximo = Math.max(0, ...valores);
			const marcas = marcasEje(maximo);
			const tope = marcas[marcas.length - 1] ?? 1;
			const textosEje = marcas.map((m) => p.formatoEje(m));
			const izq = Math.ceil(Math.max(...textosEje.map((t) => anchoTexto(t)), 12)) + 10;
			const arriba = 22;
			const abajo = 24;
			const anchoUtil = Math.max(1, W - izq - 4);
			const altoUtil = Math.max(1, H - arriba - abajo);
			const ranura = anchoUtil / Math.max(1, p.puntos.length);
			const barra = anchoBarra(ranura, BARRA_LIENZO$1);
			const y = (v) => arriba + altoUtil - v / tope * altoUtil;
			const centro = (i) => izq + (i + .5) * ranura;
			const iMax = valores.indexOf(maximo);
			const yTopeDe = (v) => Math.min(y(v), y(0) - (v > 0 ? 1 : 0));
			const iUltimo = p.puntos.length - 1;
			const ultimo = p.puntos[iUltimo];
			const rotulos = colocarRotulos({
				columnas: p.puntos.map((pt, i) => ({
					centro: centro(i),
					yTope: yTopeDe(Math.max(0, pt.valor)),
					enCurso: !!pt.enCurso
				})),
				barra,
				yBase: y(0),
				ancho: W,
				pico: maximo > 0 && iMax >= 0 ? {
					i: iMax,
					texto: p.formatoEje(maximo)
				} : null,
				ultimo: ultimo && iUltimo > 0 && iUltimo !== iMax && ultimo.valor > 0 ? {
					i: iUltimo,
					texto: p.formatoEje(ultimo.valor)
				} : null
			});
			const visibles = new Map(etiquetasEje(p.puntos.map((x) => x.etiqueta), centro, 0, W - 4, 6, maximo > 0 ? [iMax] : []).map((e) => [e.i, e]));
			const puntoActivo = activa !== null ? p.puntos[activa] : void 0;
			const lectura = puntoActivo ? partirAria(puntoActivo.aria, puntoActivo.etiqueta) : null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				ref: roving.contenedor,
				className: graficas_module_default.svg,
				width: W,
				height: H,
				viewBox: `0 0 ${W} ${H}`,
				role: "group",
				"aria-label": p.titulo,
				onKeyDown: roving.alTecla,
				children: [marcas.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: izq,
					x2: W - 4,
					y1: y(m),
					y2: y(m),
					className: m === 0 ? graficas_module_default.base : graficas_module_default.reticula
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: izq - 8,
					y: y(m) + 4,
					textAnchor: "end",
					className: graficas_module_default.eje,
					children: textosEje[i]
				})] }, m)), p.puntos.map((pt, i) => {
					const cx0 = izq + (i + .5) * ranura;
					const d = barraVertical(cx0 - barra / 2, barra, y(0), yTopeDe(Math.max(0, pt.valor)));
					const rotuloEnCurso = rotulos.enCurso.get(i);
					const etiquetaX = visibles.get(i);
					const picoEnReposo = activa === null && i === iMax && maximo > 0 && !pt.enCurso;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						"data-marca": i,
						className: cx(graficas_module_default.marca, activa === i && graficas_module_default.marcaActiva, picoEnReposo && graficas_module_default.marcaPico, pt.enCurso && graficas_module_default.enCurso),
						tabIndex: i === roving.foco ? 0 : -1,
						role: "img",
						"aria-label": pt.aria,
						onMouseEnter: () => setActiva(i),
						onMouseLeave: () => setActiva(null),
						onFocus: () => {
							setActiva(i);
							roving.setFoco(i);
						},
						onBlur: () => setActiva(null),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: cx0 - ranura / 2,
								y: arriba,
								width: ranura,
								height: altoUtil,
								className: graficas_module_default.objetivo
							}),
							d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d,
								className: graficas_module_default.barra
							}) : null,
							etiquetaX ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
								x: etiquetaX.x,
								y: H - 7,
								textAnchor: etiquetaX.ancla,
								className: cx(graficas_module_default.eje, activa === i && graficas_module_default.ejeActivo),
								children: pt.etiqueta
							}) : null,
							rotuloEnCurso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
								tipo: "en_curso",
								rotulo: rotuloEnCurso
							}) : null,
							i === iMax && rotulos.pico ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
								tipo: "pico",
								rotulo: rotulos.pico
							}) : null,
							i === iUltimo && rotulos.ultimo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
								tipo: "actual",
								rotulo: rotulos.ultimo
							}) : null
						]
					}, pt.clave);
				})]
			}), lectura && activa !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LecturaGrafica, {
				x: izq + (activa + .5) * ranura,
				y: y(Math.max(0, puntoActivo?.valor ?? 0)),
				ancho: W,
				valor: lectura.valor,
				etiqueta: `${lectura.etiqueta}${puntoActivo?.enCurso ? " · en curso" : ""}`
			}) : null] });
		}
	});
}
function slotsDeSeries(series) {
	const usados = new Set(series.map((s) => s.slot).filter((x) => x !== void 0));
	const salida = {};
	let siguiente = 1;
	for (const s of series) {
		if (s.estilo === "rayado" || s.estilo === "neutro") continue;
		if (s.slot !== void 0) {
			salida[s.id] = s.slot;
			continue;
		}
		while (usados.has(siguiente) && siguiente < 8) siguiente += 1;
		salida[s.id] = Math.min(8, siguiente);
		usados.add(Math.min(8, siguiente));
	}
	return salida;
}
/** Clase de la muestra (cuadro en la leyenda, línea en la lectura). */
function claseMuestra(s, slots) {
	if (s.estilo === "rayado") return "mRayado";
	if (s.estilo === "neutro") return "mNeutro";
	return `${s.estilo === "tenue" ? "t" : "m"}${slots[s.id] ?? 1}`;
}
function Leyenda(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: graficas_module_default.leyendaLista,
		role: "list",
		children: p.series.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: graficas_module_default.leyendaElemento,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
					className: cx(graficas_module_default.muestra, graficas_module_default[claseMuestra(s, p.slots)]),
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.etiqueta }),
				p.textos?.[s.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: graficas_module_default.leyendaValor,
					children: p.textos[s.id]
				}) : null
			]
		}, s.id))
	});
}
/**
* Columnas apiladas (02 §9.1–9.4, 01 §4.11): series en orden fijo de la paleta categórica (la misma entidad, el mismo
* slot); 'tenue' = mismo tono al 35 % con contorno de 1.5 px; 'rayado' = perdido por reembolsos (45°, gris); 'neutro' =
* "Otras". Barras como el lienzo aprobado (Ventas.png: 64 px en meses, gap 14), nunca bajo el 62 % de la ranura (el lienzo manda
* sobre los 24 px de 02 §9.4.4, LEEME.md:17); 2 px de separación real entre segmentos, extremo superior redondeado a
* 4 px y base recta en la línea base. Leyenda siempre (≥ 2 series), una lectura con todas las series por columna y
* tabla gemela. Etiquetas directas selectivas: lo ganado en el pico y en el último periodo (el extremo); colocarRotulos
* los pone sin pisar ninguna barra ajena ni a otro rótulo, contando el anclaje al borde. Periodo en curso al 35 % con contorno y "en curso". Eje X con etiquetasEje: se cuentan desde el final, nunca
* se enciman y la que se saldría se ancla al borde.
*/
var ANCHO_RESPALDO = 640;
var SEPARACION = 2;
/** Ancho de barra del lienzo aprobado para columnas mensuales (Ventas.html: max-width 64px). */
var BARRA_LIENZO = 64;
/** Separación entre columnas del lienzo (Ventas.html: gap 14px). */
var GAP_LIENZO = 14;
/** La lectura muestra el monto exacto de la tabla gemela (fila = columna de la gráfica, columna = nombre de la serie)
*  cuando la tabla trae una fila por punto; si no, cae al formato del eje ('$X.X mil'). */
function valorExacto(tabla, fila, puntos, serie) {
	if (tabla.filas.length !== puntos) return null;
	const columna = tabla.columnas.indexOf(serie);
	if (columna <= 0) return null;
	return tabla.filas[fila]?.[columna] ?? null;
}
function GraficaColumnasApiladas(p) {
	const [activa, setActiva] = (0, import_react.useState)(null);
	const roving = useRoving(p.puntos.length);
	const idPatron = (0, import_react.useId)().replace(/[^a-zA-Z0-9_-]/g, "");
	const slots = slotsDeSeries(p.series);
	const leyenda = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leyenda, {
		series: p.series,
		slots
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarcoGrafica, {
		titulo: p.titulo,
		tablaGemela: p.tablaGemela,
		className: p.className,
		leyenda,
		children: ({ ancho }) => {
			const W = ancho > 0 ? ancho : ANCHO_RESPALDO;
			const H = p.alto ?? 220;
			const totales = p.puntos.map((pt) => p.series.reduce((a, s) => a + Math.max(0, pt.valores[s.id] ?? 0), 0));
			const maximo = Math.max(0, ...totales);
			const ganados = p.puntos.map((pt) => p.series.reduce((a, s) => s.estilo === "rayado" ? a : a + Math.max(0, pt.valores[s.id] ?? 0), 0));
			const maximoGanado = Math.max(0, ...ganados);
			const marcas = marcasEje(maximo);
			const tope = marcas[marcas.length - 1] ?? 1;
			const textosEje = marcas.map((m) => p.formatoEje(m));
			const izq = Math.ceil(Math.max(...textosEje.map((t) => anchoTexto(t)), 12)) + 10;
			const arriba = 22;
			const abajo = 24;
			const anchoUtil = Math.max(1, W - izq - 4);
			const altoUtil = Math.max(1, H - arriba - abajo);
			const ranura = anchoUtil / Math.max(1, p.puntos.length);
			const barra = anchoBarra(ranura, BARRA_LIENZO, GAP_LIENZO);
			const y = (v) => arriba + altoUtil - v / tope * altoUtil;
			const centro = (i) => izq + (i + .5) * ranura;
			const iMax = maximoGanado > 0 ? ganados.indexOf(maximoGanado) : -1;
			const iUltimo = p.puntos.length - 1;
			const ultimo = p.puntos[iUltimo];
			const ganadoUltimo = ganados[iUltimo] ?? 0;
			const rotulos = colocarRotulos({
				columnas: p.puntos.map((pt, i) => ({
					centro: centro(i),
					yTope: y(totales[i] ?? 0),
					enCurso: !!pt.enCurso
				})),
				barra,
				yBase: y(0),
				ancho: W,
				pico: iMax >= 0 ? {
					i: iMax,
					texto: p.formatoEje(maximoGanado)
				} : null,
				ultimo: ultimo && iUltimo > 0 && iUltimo !== iMax && ganadoUltimo > 0 ? {
					i: iUltimo,
					texto: p.formatoEje(ganadoUltimo)
				} : null
			});
			const visibles = new Map(etiquetasEje(p.puntos.map((x) => x.etiqueta), centro, 0, W - 4, 6, iMax >= 0 ? [iMax] : []).map((e) => [e.i, e]));
			const puntoActivo = activa !== null ? p.puntos[activa] : void 0;
			const lectura = puntoActivo ? partirAria(puntoActivo.aria, puntoActivo.etiqueta) : null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				ref: roving.contenedor,
				className: graficas_module_default.svg,
				width: W,
				height: H,
				viewBox: `0 0 ${W} ${H}`,
				role: "group",
				"aria-label": p.titulo,
				onKeyDown: roving.alTecla,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
						id: `rayado-${idPatron}`,
						width: "6",
						height: "6",
						patternUnits: "userSpaceOnUse",
						patternTransform: "rotate(45)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: "6",
							height: "6",
							className: graficas_module_default.rayadoFondo
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							width: "1",
							height: "6",
							className: graficas_module_default.rayadoLinea
						})]
					}) }),
					marcas.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: izq,
						x2: W - 4,
						y1: y(m),
						y2: y(m),
						className: m === 0 ? graficas_module_default.base : graficas_module_default.reticula
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: izq - 8,
						y: y(m) + 4,
						textAnchor: "end",
						className: graficas_module_default.eje,
						children: textosEje[i]
					})] }, m)),
					p.puntos.map((pt, i) => {
						const cx0 = izq + (i + .5) * ranura;
						const conValor = p.series.filter((s) => (pt.valores[s.id] ?? 0) > 0);
						const ultima = conValor[conValor.length - 1];
						let acumulado = 0;
						const segmentos = conValor.map((s) => {
							const v = Math.max(0, pt.valores[s.id] ?? 0);
							const y0 = y(acumulado);
							acumulado += v;
							const esTope = s.id === ultima?.id;
							const y1 = y(acumulado) + (esTope ? 0 : SEPARACION);
							if (y0 - y1 < .5) return null;
							const d = barraVertical(cx0 - barra / 2, barra, y0, y1, 4, esTope);
							const tenue = s.estilo === "tenue" || !!pt.enCurso && s.estilo !== "rayado";
							const color = s.estilo === "rayado" ? null : s.estilo === "neutro" ? graficas_module_default.neutroSerie : graficas_module_default[`s${slots[s.id] ?? 1}`];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d,
								className: cx(graficas_module_default.segmento, color, tenue && graficas_module_default.tenue),
								...s.estilo === "rayado" ? { fill: `url(#rayado-${idPatron})` } : {}
							}, s.id);
						});
						const etiquetaX = visibles.get(i);
						const rotuloEnCurso = rotulos.enCurso.get(i);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							"data-marca": i,
							className: cx(graficas_module_default.marca, graficas_module_default.marcaApilada, activa === i && graficas_module_default.marcaActiva),
							tabIndex: i === roving.foco ? 0 : -1,
							role: "img",
							"aria-label": pt.aria,
							onMouseEnter: () => setActiva(i),
							onMouseLeave: () => setActiva(null),
							onFocus: () => {
								setActiva(i);
								roving.setFoco(i);
							},
							onBlur: () => setActiva(null),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: cx0 - ranura / 2,
									y: arriba,
									width: ranura,
									height: altoUtil,
									className: graficas_module_default.objetivo
								}),
								segmentos,
								etiquetaX ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: etiquetaX.x,
									y: H - 7,
									textAnchor: etiquetaX.ancla,
									className: cx(graficas_module_default.eje, activa === i && graficas_module_default.ejeActivo),
									children: pt.etiqueta
								}) : null,
								rotuloEnCurso ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
									tipo: "en_curso",
									rotulo: rotuloEnCurso
								}) : null,
								i === iMax && rotulos.pico ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
									tipo: "pico",
									rotulo: rotulos.pico
								}) : null,
								i === iUltimo && rotulos.ultimo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotuloArriba, {
									tipo: "actual",
									rotulo: rotulos.ultimo
								}) : null
							]
						}, pt.clave);
					})
				]
			}), lectura && puntoActivo && activa !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LecturaGrafica, {
				x: izq + (activa + .5) * ranura,
				y: y(totales[activa] ?? 0),
				ancho: W,
				valor: lectura.valor,
				etiqueta: `${lectura.etiqueta}${puntoActivo.enCurso ? " · en curso" : ""}`,
				filas: [...p.series].reverse().map((s) => ({
					clave: s.id,
					etiqueta: s.etiqueta,
					valor: valorExacto(p.tablaGemela, activa, p.puntos.length, s.etiqueta) ?? p.formatoEje(Math.max(0, puntoActivo.valores[s.id] ?? 0)),
					muestra: claseMuestra(s, slots)
				}))
			}) : null] });
		}
	});
}
/**
* Barra horizontal apilada (02 §9.4 catálogo): "¿Dónde está tu dinero?" (Liquidada iris · Por liquidar iris 35 % con
* contorno · Perdida por reembolsos rayada a 45°) y "De quién depende tu comisión" (5 tiendas en slots 1–5 con etiquetas
* directas + "Otras" en neutro). 24 px de alto, bloques con radio 4 y 2 px de separación; la leyenda lleva montos y
* porcentajes. Etiquetas directas (02 §9.2: coral y aqua juntos las exigen): «Tienda · 60 %» si cabe en el bloque, si
* no solo el porcentaje y, si tampoco cabe, el porcentaje en un segundo renglón centrado en su bloque cuando no pisa
* al de al lado. Lo que no cabe queda en la leyenda y la tabla gemela.
*/
function BarraApilada(p) {
	const barra = (0, import_react.useRef)(null);
	const { ancho } = useTamano(barra);
	const [activa, setActiva] = (0, import_react.useState)(null);
	const [foco, setFoco] = (0, import_react.useState)(0);
	const [verTabla, setVerTabla] = (0, import_react.useState)(false);
	const partes = p.partes.filter((x) => x.valor > 0);
	const total = partes.reduce((a, x) => a + x.valor, 0);
	const slots = slotsDeSeries(p.partes);
	const W = ancho > 0 ? ancho : 560;
	const util = W - Math.max(0, partes.length - 1) * 2;
	const pct = (v) => formato.porcentaje(total > 0 ? v / total : 0, total > 0 && v / total < .1 ? 1 : 0);
	let acumulado = 0;
	const posiciones = partes.map((x) => {
		const izquierda = acumulado;
		const px = total > 0 ? x.valor / total * util : 0;
		acumulado += px + 2;
		return {
			id: x.id,
			izquierda,
			px
		};
	});
	const alTecla = (e) => {
		if (![
			"ArrowRight",
			"ArrowLeft",
			"Home",
			"End"
		].includes(e.key) || partes.length === 0) return;
		e.preventDefault();
		let i = foco;
		if (e.key === "ArrowRight") i = Math.min(partes.length - 1, foco + 1);
		if (e.key === "ArrowLeft") i = Math.max(0, foco - 1);
		if (e.key === "Home") i = 0;
		if (e.key === "End") i = partes.length - 1;
		setFoco(i);
		barra.current?.querySelectorAll("[data-parte]")[i]?.focus();
	};
	const parteActiva = partes.find((x) => x.id === activa);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cx(graficas_module_default.grafica, p.className),
		"aria-label": p.titulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
			className: graficas_module_default.cabeza,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: graficas_module_default.titulo,
				children: p.titulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: graficas_module_default.verTabla,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: verTabla ? "ChartColumn" : "LayoutList",
					alPulsar: () => setVerTabla((v) => !v),
					"aria-label": verTabla ? `Ver gráfica: ${p.titulo}` : `Ver como tabla: ${p.titulo}`,
					children: verTabla ? "Ver gráfica" : "Ver como tabla"
				})
			})]
		}), verTabla ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablaGemelaVista, {
			titulo: p.titulo,
			tabla: p.tablaGemela
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: barra,
				className: cx(graficas_module_default.apilada, "fc-keep"),
				role: "group",
				"aria-label": p.titulo,
				onKeyDown: alTecla,
				children: [partes.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"data-parte": "",
					className: cx(graficas_module_default.bloque, graficas_module_default[claseMuestra(x, slots)], activa === x.id && graficas_module_default.bloqueActivo),
					style: vars({ "--crece": x.valor }),
					tabIndex: i === foco ? 0 : -1,
					role: "img",
					"aria-label": `${x.etiqueta}: ${x.texto} (${pct(x.valor)})`,
					onMouseEnter: () => setActiva(x.id),
					onMouseLeave: () => setActiva(null),
					onFocus: () => {
						setActiva(x.id);
						setFoco(i);
					},
					onBlur: () => setActiva(null)
				}, x.id)), total === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: graficas_module_default.bloqueVacio }) : null]
			}),
			p.etiquetasDirectas ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EtiquetasDirectas, {
				partes: partes.map((x, i) => ({
					id: x.id,
					etiqueta: x.etiqueta,
					pct: pct(x.valor),
					izquierda: posiciones[i]?.izquierda ?? 0,
					px: posiciones[i]?.px ?? 0
				})),
				ancho: W
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: graficas_module_default.lecturaLinea,
				"aria-hidden": "true",
				children: parteActiva ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: parteActiva.texto }),
					" ",
					parteActiva.etiqueta,
					" · ",
					pct(parteActiva.valor)
				] }) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: graficas_module_default.leyendaLista,
				role: "list",
				children: p.partes.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: graficas_module_default.leyendaElemento,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: cx(graficas_module_default.muestra, graficas_module_default[claseMuestra(x, slots)]),
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x.etiqueta }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: graficas_module_default.leyendaValor,
							children: x.texto
						}),
						total > 0 && x.valor > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: graficas_module_default.leyendaPct,
							children: pct(x.valor)
						}) : null
					]
				}, x.id))
			})
		] })]
	});
}
/** Etiquetas directas bajo los bloques: en el bloque si caben y, si no, el porcentaje escalonado en un 2.º renglón. */
function EtiquetasDirectas(p) {
	let finSegundo = -Infinity;
	const filas = p.partes.map((x) => {
		const completo = `${x.etiqueta} · ${x.pct}`;
		if (x.px >= anchoTexto(completo, 12) + 8) return {
			...x,
			texto: completo,
			renglon: 1,
			left: x.izquierda,
			width: x.px
		};
		if (x.px >= anchoTexto(x.pct, 12) + 6) return {
			...x,
			texto: x.pct,
			renglon: 1,
			left: x.izquierda,
			width: x.px
		};
		const w = anchoTexto(x.pct, 12) + 2;
		const left = Math.max(0, Math.min(p.ancho - w, x.izquierda + x.px / 2 - w / 2));
		if (left < finSegundo + 6) return null;
		finSegundo = left + w;
		return {
			...x,
			texto: x.pct,
			renglon: 2,
			left,
			width: void 0
		};
	});
	const conSegundo = filas.some((f) => f?.renglon === 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cx(graficas_module_default.directas, conSegundo && graficas_module_default.directasDos),
		"aria-hidden": "true",
		children: filas.map((f) => f ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cx(graficas_module_default.directa, f.renglon === 2 && graficas_module_default.directaSegunda),
			style: {
				left: f.left,
				...f.width !== void 0 ? { width: f.width } : {}
			},
			children: f.texto
		}, f.id) : null)
	});
}
/**
* Barras horizontales de UNA serie (02 §9.4 catálogo, "Tiendas que más te pagan"): nombre a la izquierda, valor y
* secundario (%) a la derecha, barra de 8 px en --viz-mono con el extremo de datos redondeado a 4 px y base recta;
* hover/foco en --viz-current. Filas pulsables si traen alPulsar. Los valores van impresos: la tabla gemela repite.
*/
function BarrasHorizontales(p) {
	const [verTabla, setVerTabla] = (0, import_react.useState)(false);
	const maximo = Math.max(0, ...p.filas.map((f) => f.valor));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cx(graficas_module_default.grafica, p.className),
		"aria-label": p.titulo,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
			className: graficas_module_default.cabeza,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: graficas_module_default.titulo,
				children: p.titulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: graficas_module_default.verTabla,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					tamano: "sm",
					icono: verTabla ? "ChartColumn" : "LayoutList",
					alPulsar: () => setVerTabla((v) => !v),
					"aria-label": verTabla ? `Ver gráfica: ${p.titulo}` : `Ver como tabla: ${p.titulo}`,
					children: verTabla ? "Ver gráfica" : "Ver como tabla"
				})
			})]
		}), verTabla ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablaGemelaVista, {
			titulo: p.titulo,
			tabla: p.tablaGemela
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: cx(graficas_module_default.horizontales, "fc-keep"),
			role: "list",
			children: p.filas.map((f) => {
				const fraccion = maximo > 0 ? Math.max(0, f.valor) / maximo : 0;
				const contenido = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: graficas_module_default.hFila,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: graficas_module_default.hEtiqueta,
						children: f.etiqueta
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: graficas_module_default.hValor,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: f.texto }), f.secundario ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: graficas_module_default.hSecundario,
							children: [" · ", f.secundario]
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: graficas_module_default.hPista,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: graficas_module_default.hBarra,
						style: vars({ "--f": fraccion })
					})
				})] });
				const alPulsar = f.alPulsar;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: graficas_module_default.hElemento,
					children: alPulsar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: cx(graficas_module_default.hContenido, graficas_module_default.hPulsable),
						onClick: () => alPulsar(),
						children: contenido
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: graficas_module_default.hContenido,
						children: contenido
					})
				}, f.id);
			})
		})]
	});
}
var LimiteError_module_default = {
	error: "_error_1nw99_2",
	icono: "_icono_1nw99_14",
	texto: "_texto_1nw99_25"
};
/**
* @/app · límite de error por sección (01 §4.16): «Algo salió mal al mostrar esta sección.» [Reintentar]. Un error al
* pintar una tarjeta nunca tumba la app completa: se queda dentro de la sección que falló.
*/
var TEXTO_ERROR_SECCION = "Algo salió mal al mostrar esta sección.";
var Limite = class extends import_react.Component {
	state = {
		error: false,
		intento: 0
	};
	static getDerivedStateFromError() {
		return { error: true };
	}
	componentDidCatch(error, info) {}
	render() {
		if (!this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reinicio, { children: this.props.children }, this.state.intento);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "alert",
			className: LimiteError_module_default.error,
			"data-limite-error": this.props.seccion,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: LimiteError_module_default.icono,
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "CircleAlert",
						tamano: 20
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: LimiteError_module_default.texto,
					children: TEXTO_ERROR_SECCION
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "secundario",
					tamano: "sm",
					icono: "RotateCcw",
					alPulsar: () => this.setState((s) => ({
						error: false,
						intento: s.intento + 1
					})),
					children: "Reintentar"
				})
			]
		});
	}
};
/** Fragmento con clave: al reintentar se vuelve a montar el contenido desde cero. */
function Reinicio(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: p.children });
}
/** "Algo salió mal al mostrar esta sección." [Reintentar] — nunca tumba la app completa (01_ux §4.16). */
function LimiteError(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Limite, {
		seccion: p.seccion,
		children: p.children
	});
}
var Pantalla_module_default = {
	pantalla: "_pantalla_g7j3k_2",
	entrar: "_entrar_g7j3k_1"
};
/**
* @/app · contenedor de cada pantalla: título accesible (región con nombre y título de la ventana), restauración del
* scroll al volver (cuando el contenido ya está listo), límite de error por sección y avisarInterfazLista() UNA sola vez
* en toda la sesión: la primera vez que alguna pantalla tiene `lista` en true (Windows `--medir`, splash de Android).
* Al llegar a una pantalla nueva por navegación, el foco pasa a la región (los lectores anuncian la vista nueva).
*/
var interfazAvisada = false;
var pantallasMontadas = 0;
function enDialogo(el) {
	return el !== null && el.closest("[role=\"dialog\"]") !== null;
}
function Pantalla(p) {
	const r = useRuta();
	const region = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof document !== "undefined") document.title = p.titulo === "Inicio" ? "Corte" : `${p.titulo} · Corte`;
	}, [p.titulo]);
	(0, import_react.useEffect)(() => {
		pantallasMontadas++;
		if (pantallasMontadas > 1 && region.current && !enDialogo(document.activeElement)) region.current.focus({ preventScroll: true });
	}, []);
	(0, import_react.useEffect)(() => {
		if (!p.lista) return;
		restaurarScrollPendiente(r.ruta);
		if (!interfazAvisada) {
			interfazAvisada = true;
			avisarInterfazLista();
		}
	}, [p.lista, r.ruta]);
	const clase = p.className ? `${Pantalla_module_default.pantalla} ${p.className}` : Pantalla_module_default.pantalla;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref: region,
		"aria-label": p.titulo,
		tabIndex: -1,
		className: clase,
		"data-pantalla": p.titulo,
		"data-lista": p.lista ? "" : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimiteError, {
			seccion: p.titulo,
			children: p.children
		})
	});
}
//#endregion
export { PASO_ETAPA as $, usePanelDisponible as $n, fechaPrometidaPorOmision as $t, EnlaceRuta as A, resaltar as An, calcularAtributos as At, ICONO_GRUPO as B, tituloPlan as Bn, diaSemana as Bt, ETIQUETA_ETAPA as C, plantillaRecomendada as Cn, alEnlace as Ct, ETIQUETA_PASO_SYNC as D, rangoDePeriodo as Dn, atras as Dt, ETIQUETA_NIVEL as E, promesaEnRiesgo as En, aplicarAtributos as Et, Foto as F, sumarDias as Fn, consumirEnlacePendiente as Ft, Kbd as G, useClaseAncho as Gn, epochDeFecha as Gt, Icono as H, useAtajos as Hn, elegirArchivo as Ht, GraficaColumnas as I, temaVisible as In, contarTrabajo as It, Menu as J, useEntradaAtributos as Jn, esPendiente as Jt, Kpi as K, useConexionPc as Kn, esCampo as Kt, GraficaColumnasApiladas as L, textoDatosGuion as Ln, contentIdDeEnlace as Lt, Esqueleto as M, resolverRuta as Mn, coincide as Mt, EsqueletoVista as N, rutaActual as Nn, compartirTexto as Nt, ETIQUETA_SALUD as O, registrarAtajos as On, avisarTemaNativo as Ot, EstadoVacio as P, sinAcentos as Pn, consultar as Pt, OpcionRadio as Q, useNovedades as Qn, fechaLocalDe as Qt, Hoja as R, textoPermiso as Rn, copiarTexto as Rt, ETIQUETA_ESTADO_ORDEN as S, planVivo as Sn, ahoraS as St, ETIQUETA_MOTIVO_NO_SE_PUEDE as T, programarNotificaciones as Tn, almacen as Tt, Insignia as U, useAtajosRegistrados as Un, emparejarConCodigo as Ut, ICONO_RAZON as V, useAcciones as Vn, diasEntre as Vt, Interruptor as W, useCapacidades as Wn, emparejarConQr as Wt, Modal as X, useListaEstable as Xn, etiquetaContenido as Xt, MiniaturaVideo as Y, useEventoHub as Yn, esWindows as Yt, MosaicoQr as Z, useMetaImagen$1 as Zn, etiquetaTipoMuestra as Zt, ChipEtapa as _, olvidarPc as _n, VARIABLES_PLANTILLA as _t, BandaKpi as a, horaLocal as an, useSesion as ar, PuntoVivo as at, CodigoEmparejamiento as b, pedirPermisoNotificaciones as bn, accionPrincipal as bt, BarraProgreso as c, infoPlataforma as cn, useToast as cr, SelectorFecha as ct, BotonIcono as d, mantenerPantalla as dn, vibrar as dr, TONO_GRUPO as dt, fijarParametro as en, useParametro as er, Palomita as et, BurbujaRecorrido as f, modoDemo as fn, TONO_SALUD as ft, Chip as g, nuevoId as gn, Ticket as gt, Casilla as h, normalizarTitulo as hn, TarjetaProducto as ht, Banda as i, guardarImagen as in, useRuta as ir, ProveedorToasts as it, ErrorHub as j, resolverPlantilla as jn, calcularNotificaciones as jt, EncabezadoPantalla as k, registrarAtras as kn, buscarPcs as kt, BarrasHorizontales as l, iniciarRecorridos as ln, validarEtapa as lr, SelectorFechaHora as lt, CampoTexto as m, nombreCorto as mn, Tarjeta as mt, AvatarCuenta as n, formato as nn, usePrimeraVez as nr, PanelLateral as nt, BarraApilada as o, hoyLocal as on, useSync as or, ReproductorTikTok as ot, CampoBusqueda as p, navegar as pn, Tabla as pt, LimiteError as q, useConsulta as qn, esEnlaceTikTok as qt, AvatarTienda as r, guardarArchivo as rn, useRecorrido as rr, Pantalla as rt, BarraEtapas as s, hub as sn, useTema as sr, Segmentado as st, AreaTexto as t, fijarReloj as tn, usePlataforma as tr, PanelFirma as tt, Boton as u, invalidar as un, ventana as ur, SelectorNumero as ut, ChipFiltro as v, opCambioEtapa as vn, abrirExterno as vt, ETIQUETA_GRUPO as w, profundidadHistorial as wn, alVolverAlFrente as wt, ETIQUETA_ACCION as x, permisoNotificaciones as xn, actualizarCopiaAhora as xt, ChipsDias as y, ordenTiendasAvisar as yn, abrirTikTok as yt, ICONO_ETAPA as z, textoRazon as zn, csvMuestras as zt };
