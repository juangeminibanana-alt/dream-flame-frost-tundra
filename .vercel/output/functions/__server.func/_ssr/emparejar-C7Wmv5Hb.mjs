import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, q as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as EnlaceRuta, Ct as alEnlace, Ft as consumirEnlacePendiente, H as Icono, Ut as emparejarConCodigo, Wt as emparejarConQr, d as BotonIcono, dr as vibrar, er as useParametro, et as Palomita, kn as registrarAtras, kt as buscarPcs, m as CampoTexto, pn as navegar, rt as Pantalla, tr as usePlataforma, u as Boton } from "./app-CLiVRbtG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/emparejar-C7Wmv5Hb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Deja solo los caracteres válidos del código, en mayúsculas y con las equivalencias de C6 (máx. 12). */
function normalizarCodigo(texto) {
	let salida = "";
	for (const original of texto.toUpperCase()) {
		const c = original === "O" ? "0" : original === "I" || original === "L" ? "1" : original;
		if (!"0123456789ABCDEFGHJKMNPQRSTVWXYZ".includes(c)) continue;
		salida += c;
		if (salida.length === 12) break;
	}
	return salida;
}
/** 'K7QM3XRA9TPF' → 'K7QM-3XRA-9TPF' (también con un código a medias: 'K7QM3' → 'K7QM-3'). */
function agruparCodigo(normalizado) {
	const grupos = [];
	for (let i = 0; i < normalizado.length; i += 4) grupos.push(normalizado.slice(i, i + 4));
	return grupos.join("-");
}
function codigoCompleto(normalizado) {
	return normalizado.length === 12 && normalizarCodigo(normalizado) === normalizado;
}
/** IPv4 privada (10/8, 172.16/12, 192.168/16): las únicas que acepta el protocolo LAN. */
function esIpPrivada(ip) {
	const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip.trim());
	if (!m) return false;
	const o = m.slice(1).map(Number);
	if (o.some((n) => n > 255)) return false;
	const [a = 0, b = 0] = o;
	return a === 10 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168;
}
/** Lee 'creatorhub://pair?v=1&h=…&a=ip,ip&p=…&s=…&f=…'. null si no es un enlace de Corte o no trae IP privada. */
function leerEnlaceEmparejar(texto) {
	const limpio = texto.trim();
	if (!/^creatorhub:\/\/pair\?/i.test(limpio)) return null;
	const consulta = new URLSearchParams(limpio.slice(limpio.indexOf("?") + 1));
	const hostId = consulta.get("h") ?? "";
	const direcciones = (consulta.get("a") ?? "").split(",").map((x) => x.trim()).filter(esIpPrivada);
	if (consulta.get("v") !== "1" || !/^[0-9a-f]{32}$/i.test(hostId) || direcciones.length === 0 || !consulta.get("s")) return null;
	return {
		texto: limpio,
		hostId: hostId.toLowerCase(),
		direcciones
	};
}
/** ¿El texto leído de un QR es un enlace de emparejamiento de Corte? */
function esQrDeCorte(texto) {
	return leerEnlaceEmparejar(texto) !== null;
}
/** Textos de Emparejar (01_ux §4.15 A2/A2'/A3, §5.3; BUILD_SPEC C6; 04 §B.9). Español de México. */
var T = {
	tituloPantalla: "Emparejar con tu PC",
	atras: "Atrás",
	tituloA2: "Escanea el código de tu PC",
	textoA2Antes: "En tu PC abre ",
	textoA2Ruta: "Conexión y ajustes › Celular",
	textoA2Despues: " y escanea el código que aparece.",
	camaraAntes: "Usamos la cámara solo para leer el código QR.",
	activarCamara: "Activar cámara",
	camaraPidiendo: "Esperando el permiso de la cámara…",
	camaraApunta: "Apunta la cámara al código de tu PC",
	camaraDenegada: "Sin la cámara puedes escribir el código que aparece en tu PC.",
	camaraNoDisponible: "Este celular no nos deja usar la cámara. Escribe el código que aparece en tu PC.",
	qrNoEsDeCorte: "Ese código QR no es de Corte. Escanea el que aparece en tu PC.",
	escribirCodigo: "Escribir código",
	etiquetaVisor: "Visor de la cámara",
	tituloA2b: "Escribe el código",
	textoA2b: "Es el código de 12 caracteres que aparece en tu PC, en Conexión y ajustes › Celular.",
	sinCamara: "¿Sin cámara? Escribe el código de tu PC",
	etiquetaCodigo: "Código de tu PC",
	ayudaCodigo: (n) => n === 12 ? "Código completo" : `${n} de 12 caracteres · da igual mayúsculas o minúsculas`,
	usarCamara: "Usar la cámara",
	buscandoPc: "Buscando Corte en tu Wi‑Fi…",
	encontramos: "Encontramos Corte en tu Wi‑Fi",
	encontramosVarias: "Encontramos Corte en estas PC de tu Wi‑Fi",
	mismoWifi: "mismo Wi‑Fi",
	pcElegida: "Nos conectaremos a esta PC",
	noEncontramos: "No vimos tu PC en esta red. Escribe su dirección o déjala vacía para seguir buscando.",
	etiquetaDireccion: "Dirección de la PC",
	ayudaDireccion: "Aparece en tu PC debajo del código, por ejemplo 192.168.1.20.",
	direccionInvalida: "Escribe una dirección de tu red, como 192.168.1.20.",
	conectar: "Conectar",
	faltaCodigo: "Escribe los 12 caracteres del código que aparece en tu PC.",
	buscarOtraVez: "Buscar otra vez",
	seguro: "Tus datos viajan cifrados solo por tu Wi‑Fi. Tu acceso a TikTok se queda en tu PC; el celular guarda una copia para verla sin conexión.",
	enlaceTitulo: (nombre, ip) => `¿Emparejar con ${nombre} (${ip})?`,
	enlaceTexto: "Abriste un enlace de emparejamiento. Solo nos conectamos si tú lo confirmas.",
	enlaceTuPc: "tu PC",
	emparejar: "Emparejar",
	cancelar: "Cancelar",
	conectando: "Conectando con tu PC…",
	conectandoTexto: "Esto tarda unos segundos. Mantén Corte abierto en tu PC.",
	tituloA3: "Confirma en tu PC",
	textoA3: "Revisa que tu PC muestre el mismo número y toca Permitir.",
	etiquetaNumero: (n) => `Número de confirmación: ${n.split("").join(" ")}`,
	conectado: (pc) => pc ? `Conectado a ${pc}` : "Conectado",
	copiando: "Copiando tus datos…",
	errores: {
		vencido: "Ese código ya caducó. Escanea el código nuevo que aparece en tu PC.",
		sinRespuesta: "No confirmaste en tu PC a tiempo. Vuelve a intentarlo.",
		rechazado: "Tu PC rechazó la conexión.",
		red: "No pudimos llegar a tu PC. Revisa que ambos estén en el mismo Wi‑Fi y que Corte esté abierto en la PC.",
		redAyuda: "Si Windows preguntó por la red, elige Redes privadas. Las redes de invitados o públicas suelen bloquear esta conexión.",
		huella: "La PC respondió con una identidad distinta. Por seguridad no nos conectamos. Escanea el código otra vez desde tu PC.",
		ocupado: "Demasiados intentos. Espera un minuto e inténtalo de nuevo.",
		enlaceInvalido: "Ese enlace no apunta a una PC de tu red. Escanea el código desde tu PC.",
		qrInvalido: "Ese código QR no es de Corte. Escanea el que aparece en tu PC.",
		codigoInvalido: "Ese código no es válido. Revisa los 12 caracteres que aparecen en tu PC.",
		version: "Corte de tu PC y el de este celular tienen versiones distintas. Actualiza el que sea más viejo.",
		cancelado: "Se canceló el emparejamiento."
	},
	escanearDeNuevo: "Escanear de nuevo",
	intentarDeNuevo: "Intentar de nuevo",
	reintentar: "Reintentar",
	tituloError: "No pudimos emparejar",
	soloAndroidTitulo: "El emparejamiento se hace desde tu celular",
	soloAndroidTexto: "Abre Corte en tu Android y toca Emparejar con mi PC. En esta PC, el código está en Conexión y ajustes › Celular.",
	irACelular: "Ir a Celular"
};
var Emparejar_module_default = {
	raiz: "_raiz_1002h_8",
	columna: "_columna_1002h_16",
	barra: "_barra_1002h_26",
	botonAtras: "_botonAtras_1002h_32",
	barraTitulo: "_barraTitulo_1002h_35",
	cuerpo: "_cuerpo_1002h_42",
	intro: "_intro_1002h_50",
	titulo: "_titulo_1002h_55",
	texto: "_texto_1002h_63",
	ruta: "_ruta_1002h_70",
	enlace: "_enlace_1002h_74",
	enlaceBoton: "_enlaceBoton_1002h_80",
	textoPcBoton: "_textoPcBoton_1002h_81",
	visor: "_visor_1002h_89",
	video: "_video_1002h_102",
	esquina: "_esquina_1002h_117",
	esqSupIzq: "_esqSupIzq_1002h_123",
	esqSupDer: "_esqSupDer_1002h_130",
	esqInfIzq: "_esqInfIzq_1002h_137",
	esqInfDer: "_esqInfDer_1002h_144",
	linea: "_linea_1002h_151",
	barrer: "_barrer_1002h_1",
	visorTexto: "_visorTexto_1002h_178",
	visorIcono: "_visorIcono_1002h_194",
	visorPista: "_visorPista_1002h_197",
	pcs: "_pcs_1002h_203",
	tarjetaPc: "_tarjetaPc_1002h_208",
	tarjetaEnlace: "_tarjetaEnlace_1002h_218",
	iconoPc: "_iconoPc_1002h_225",
	textoPc: "_textoPc_1002h_81",
	nombrePc: "_nombrePc_1002h_247",
	detallePc: "_detallePc_1002h_253",
	botonPc: "_botonPc_1002h_259",
	marcaPc: "_marcaPc_1002h_262",
	accionesEnlace: "_accionesEnlace_1002h_267",
	avisoEnlace: "_avisoEnlace_1002h_272",
	buscando: "_buscando_1002h_281",
	campoCodigo: "_campoCodigo_1002h_296",
	etiquetaCampo: "_etiquetaCampo_1002h_301",
	inputCodigo: "_inputCodigo_1002h_307",
	inputCodigoGrande: "_inputCodigoGrande_1002h_335",
	marcasCodigo: "_marcasCodigo_1002h_339",
	marcaGrupo: "_marcaGrupo_1002h_345",
	marcaRelleno: "_marcaRelleno_1002h_352",
	ayudaCampo: "_ayudaCampo_1002h_360",
	errorCampo: "_errorCampo_1002h_361",
	manual: "_manual_1002h_372",
	estadoCentro: "_estadoCentro_1002h_387",
	circuloIcono: "_circuloIcono_1002h_400",
	circuloAtencion: "_circuloAtencion_1002h_409",
	girador: "_girador_1002h_413",
	giradorChico: "_giradorChico_1002h_414",
	girar: "_girar_1002h_1",
	dispositivos: "_dispositivos_1002h_446",
	dispositivo: "_dispositivo_1002h_446",
	enlaceDispositivos: "_enlaceDispositivos_1002h_461",
	numero: "_numero_1002h_466",
	digito: "_digito_1002h_471",
	ayudaError: "_ayudaError_1002h_485",
	accionesError: "_accionesError_1002h_492",
	seguro: "_seguro_1002h_503",
	seguroIcono: "_seguroIcono_1002h_511"
};
/** Une clases de CSS Modules (con noUncheckedIndexedAccess cada clase es string | undefined) en un string. */
function cx(...xs) {
	return xs.filter((x) => typeof x === "string" && x !== "").join(" ");
}
/**
* Campo del código de 12 caracteres (C6): un solo <input> que agrupa solo en 3 bloques de 4 ('K7QM-3XRA-9TPF') en
* Geist Mono, acepta minúsculas, espacios, guiones y pegar el código entero; O→0 e I/L→1. Debajo, las 3 marcas de
* avance por grupo y la ayuda con el conteo.
*/
function CampoCodigo(p) {
	const propio = (0, import_react.useId)();
	const id = p.id ?? propio;
	const idAyuda = `${id}-ayuda`;
	const alCambiar = (e) => {
		p.alCambiar(normalizarCodigo(e.target.value));
	};
	const grupos = [
		0,
		1,
		2
	].map((g) => Math.max(0, Math.min(4, p.valor.length - g * 4)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Emparejar_module_default.campoCodigo),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: cx(Emparejar_module_default.etiquetaCampo),
				children: p.etiqueta
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				className: cx(Emparejar_module_default.inputCodigo, p.grande && Emparejar_module_default.inputCodigoGrande),
				value: agruparCodigo(p.valor),
				onChange: alCambiar,
				onKeyDown: (e) => {
					if (e.key === "Enter" && p.valor.length === 12) p.alCompletar?.();
				},
				inputMode: "text",
				autoCapitalize: "characters",
				autoComplete: "one-time-code",
				autoCorrect: "off",
				spellCheck: false,
				maxLength: 20,
				placeholder: "XXXX-XXXX-XXXX",
				"aria-describedby": idAyuda,
				"aria-invalid": p.error ? true : void 0,
				autoFocus: p.autoFoco,
				"data-campo-codigo": ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Emparejar_module_default.marcasCodigo),
				"aria-hidden": "true",
				children: grupos.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Emparejar_module_default.marcaGrupo),
					"data-lleno": n === 4 ? "" : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Emparejar_module_default.marcaRelleno),
						style: { transform: `scaleX(${n / 4})` }
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: idAyuda,
				className: cx(p.error ? Emparejar_module_default.errorCampo : Emparejar_module_default.ayudaCampo),
				role: p.error ? "alert" : void 0,
				children: p.error ?? T.ayudaCodigo(p.valor.length)
			})
		]
	});
}
/**
* `trasVerificar`: el error llegó después de mostrar el número de 4 dígitos. Un 'vencido' entonces es «Sin respuesta
* en 90 s» (no confirmaron en la PC a tiempo), no un código caducado. `mensaje` es el texto que trae el evento; se usa
* para los casos que 01 no lista (QR inválido, código inválido, versión, PC ocupada).
*/
function errorVisible(error, mensaje, trasVerificar) {
	switch (error) {
		case "vencido": return trasVerificar ? {
			texto: T.errores.sinRespuesta,
			ayuda: null,
			accion: "intentar"
		} : {
			texto: T.errores.vencido,
			ayuda: null,
			accion: "escanear"
		};
		case "rechazado": return {
			texto: T.errores.rechazado,
			ayuda: null,
			accion: "intentar"
		};
		case "red":
		case "pc_no_encontrada": return {
			texto: T.errores.red,
			ayuda: T.errores.redAyuda,
			accion: "reintentar"
		};
		case "huella_distinta": return {
			texto: T.errores.huella,
			ayuda: null,
			accion: "escanear"
		};
		case "qr_invalido": return {
			texto: conRespaldo(mensaje, T.errores.qrInvalido),
			ayuda: null,
			accion: "escanear"
		};
		case "codigo_invalido": return {
			texto: conRespaldo(mensaje, T.errores.codigoInvalido),
			ayuda: null,
			accion: "escanear"
		};
		case "ocupado": return {
			texto: T.errores.ocupado,
			ayuda: null,
			accion: null
		};
		case "version_incompatible": return {
			texto: conRespaldo(mensaje, T.errores.version),
			ayuda: null,
			accion: "reintentar"
		};
		case "cancelado": return {
			texto: conRespaldo(mensaje, T.errores.cancelado),
			ayuda: null,
			accion: null
		};
	}
}
function conRespaldo(mensaje, respaldo) {
	const m = mensaje.trim();
	return m === "" ? respaldo : m;
}
function etiquetaAccion(a) {
	if (a === "escanear") return T.escanearDeNuevo;
	if (a === "intentar") return T.intentarDeNuevo;
	if (a === "reintentar") return T.reintentar;
	return null;
}
/** Crea el Web Worker del escáner (separado para que las pruebas lo sustituyan; happy-dom no tiene Worker). */
function crearTrabajadorQr() {
	if (typeof Worker === "undefined") return null;
	try {
		return new Worker(new URL("./escaner.worker.ts", import.meta.url), {
			type: "module",
			name: "escaner-qr"
		});
	} catch {
		return null;
	}
}
/**
* Visor de la cámara para leer el QR de la PC (01 §4.15 A2, 02 §7.19, 04 §B.9): getUserMedia con facingMode
* 'environment' (solo después de explicar para qué), cuadros reducidos a ≤ 480 px enviados a jsQR en un Web Worker a
* ~7 cuadros/s, uno a la vez. Un QR que no es de Corte avisa y sigue escaneando. La cámara se apaga al desmontar.
*/
var INTERVALO_MS = 140;
var LADO_MAXIMO = 480;
function esResultado(v) {
	return v !== null && typeof v === "object" && "texto" in v && (typeof v.texto === "string" || v.texto === null);
}
function Visor(p) {
	const [estado, setEstado] = (0, import_react.useState)(() => typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function" ? "antes" : "no_disponible");
	const [avisoQr, setAvisoQr] = (0, import_react.useState)(false);
	const video = (0, import_react.useRef)(null);
	const flujo = (0, import_react.useRef)(null);
	const alLeerRef = (0, import_react.useRef)(p.alLeer);
	alLeerRef.current = p.alLeer;
	const apagar = (0, import_react.useCallback)(() => {
		for (const pista of flujo.current?.getTracks() ?? []) pista.stop();
		flujo.current = null;
	}, []);
	const encender = (0, import_react.useCallback)(async () => {
		setEstado("pidiendo");
		try {
			const s = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
				audio: false
			});
			flujo.current = s;
			setEstado("activa");
		} catch (e) {
			const nombre = e instanceof Error ? e.name : "";
			setEstado(nombre === "NotAllowedError" || nombre === "SecurityError" ? "denegada" : "no_disponible");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const v = video.current;
		if (estado !== "activa" || !v || !flujo.current) return;
		v.srcObject = flujo.current;
		v.play?.()?.catch(() => void 0);
	}, [estado]);
	(0, import_react.useEffect)(() => {
		if (estado !== "activa" || !p.activo) return void 0;
		const trabajador = crearTrabajadorQr();
		if (!trabajador) {
			setEstado("no_disponible");
			return;
		}
		const lienzo = document.createElement("canvas");
		const ctx = lienzo.getContext("2d", { willReadFrequently: true });
		let ocupado = false;
		let vivo = true;
		let quitarAviso = null;
		trabajador.onmessage = (e) => {
			ocupado = false;
			if (!vivo || !esResultado(e.data) || e.data.texto === null) return;
			if (esQrDeCorte(e.data.texto)) {
				vivo = false;
				alLeerRef.current(e.data.texto);
				return;
			}
			setAvisoQr(true);
			if (quitarAviso) clearTimeout(quitarAviso);
			quitarAviso = setTimeout(() => setAvisoQr(false), 2500);
		};
		const tic = setInterval(() => {
			const v = video.current;
			if (!vivo || ocupado || !ctx || !v || v.readyState < 2 || v.videoWidth === 0) return;
			const escala = Math.min(1, LADO_MAXIMO / Math.max(v.videoWidth, v.videoHeight));
			const ancho = Math.max(1, Math.round(v.videoWidth * escala));
			const alto = Math.max(1, Math.round(v.videoHeight * escala));
			lienzo.width = ancho;
			lienzo.height = alto;
			ctx.drawImage(v, 0, 0, ancho, alto);
			const img = ctx.getImageData(0, 0, ancho, alto);
			ocupado = true;
			trabajador.postMessage({
				datos: img.data.buffer,
				ancho,
				alto
			}, [img.data.buffer]);
		}, INTERVALO_MS);
		return () => {
			vivo = false;
			clearInterval(tic);
			if (quitarAviso) clearTimeout(quitarAviso);
			trabajador.terminate();
		};
	}, [estado, p.activo]);
	(0, import_react.useEffect)(() => {
		if (!p.activo) apagar();
	}, [p.activo, apagar]);
	(0, import_react.useEffect)(() => apagar, [apagar]);
	const esquinas = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${Emparejar_module_default.esquina} ${Emparejar_module_default.esqSupIzq}`,
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${Emparejar_module_default.esquina} ${Emparejar_module_default.esqSupDer}`,
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${Emparejar_module_default.esquina} ${Emparejar_module_default.esqInfIzq}`,
			"aria-hidden": "true"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${Emparejar_module_default.esquina} ${Emparejar_module_default.esqInfDer}`,
			"aria-hidden": "true"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Emparejar_module_default.visor),
		role: "group",
		"aria-label": T.etiquetaVisor,
		"data-camara": estado,
		children: [
			estado === "activa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: video,
				className: cx(Emparejar_module_default.video),
				muted: true,
				playsInline: true,
				autoPlay: true,
				"aria-hidden": "true"
			}) : null,
			esquinas,
			estado === "activa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Emparejar_module_default.linea),
				"aria-hidden": "true"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Emparejar_module_default.visorTexto),
				"aria-live": "polite",
				children: [
					estado === "antes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Camera",
							tamano: 24,
							className: cx(Emparejar_module_default.visorIcono)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.camaraAntes }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							icono: "Camera",
							alPulsar: () => void encender(),
							children: T.activarCamara
						})
					] }) : null,
					estado === "pidiendo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.camaraPidiendo }) : null,
					estado === "activa" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Emparejar_module_default.visorPista),
						children: avisoQr ? T.qrNoEsDeCorte : T.camaraApunta
					}) : null,
					estado === "denegada" || estado === "no_disponible" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Keyboard",
							tamano: 24,
							className: cx(Emparejar_module_default.visorIcono)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: estado === "denegada" ? T.camaraDenegada : T.camaraNoDisponible }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
							variante: "secundario",
							tamano: "sm",
							icono: "Keyboard",
							alPulsar: p.alEscribirCodigo,
							children: T.escribirCodigo
						})
					] }) : null
				]
			})
		]
	});
}
/**
* #/emparejar · Android A2 / A2' / A3 (01_ux §4.15 y §5.3; lienzo MovilEmparejar.png).
* - A2: visor de cámara (jsQR en un Web Worker) + la PC encontrada por descubrimiento + el código manual debajo.
* - A2' (?modo=codigo): solo el código de 12 caracteres (C6) y la dirección (precargada si se descubrió la PC).
* - A3: número de 4 dígitos de EventoEmparejamiento 'verifica' + [Cancelar].
* - Errores de EventoEmparejamiento con los textos y acciones de 01 §5.3.
* Al aprobarse pasa a la Bienvenida A4 («Copiando tus datos…»). Un enlace creatorhub://pair que llega de fuera nunca
* empareja solo: se pregunta «¿Emparejar con {nombre} ({ip})?» (04 §B.9).
*/
/** Espera breve para que se lea «Conectado» antes de pasar a A4. */
var ESPERA_APROBADO_MS = 1100;
function PantallaEmparejar() {
	if (usePlataforma() === "windows") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoloAndroid, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emparejar, {});
}
function SoloAndroid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.tituloPantalla,
		lista: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Emparejar_module_default.raiz),
			"data-vista": "solo-android",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cx(Emparejar_module_default.columna),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cx(Emparejar_module_default.estadoCentro),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Emparejar_module_default.circuloIcono),
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
								nombre: "Smartphone",
								tamano: 24
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: cx(Emparejar_module_default.titulo),
							children: T.soloAndroidTitulo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cx(Emparejar_module_default.texto),
							children: T.soloAndroidTexto
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlaceRuta, {
							a: "/ajustes/celular",
							className: cx(Emparejar_module_default.enlace),
							children: T.irACelular
						})
					]
				})
			})
		})
	});
}
function Emparejar() {
	const [modo, setModo] = useParametro("modo");
	const [desde] = useParametro("desde");
	const soloCodigo = modo === "codigo";
	const [fase, setFase] = (0, import_react.useState)({ tipo: "inicio" });
	const [codigo, setCodigo] = (0, import_react.useState)("");
	const [errorCodigo, setErrorCodigo] = (0, import_react.useState)(null);
	const [pcs, setPcs] = (0, import_react.useState)(null);
	const [elegida, setElegida] = (0, import_react.useState)(null);
	const [ipManual, setIpManual] = (0, import_react.useState)("");
	const [errorIp, setErrorIp] = (0, import_react.useState)(null);
	const [enlace, setEnlace] = (0, import_react.useState)(null);
	const [enlaceInvalido, setEnlaceInvalido] = (0, import_react.useState)(false);
	const idCodigo = (0, import_react.useId)();
	const cancelar = (0, import_react.useRef)(null);
	const vioNumero = (0, import_react.useRef)(false);
	const ultimo = (0, import_react.useRef)(null);
	const vivo = (0, import_react.useRef)(true);
	(0, import_react.useEffect)(() => {
		vivo.current = true;
		return () => {
			vivo.current = false;
			cancelar.current?.();
			cancelar.current = null;
		};
	}, []);
	const buscar = (0, import_react.useCallback)(() => {
		setPcs(null);
		buscarPcs().catch(() => []).then((lista) => {
			if (!vivo.current) return;
			setPcs(lista);
			setElegida((previa) => previa && lista.some((x) => x.host_id === previa) ? previa : lista[0]?.host_id ?? null);
		});
	}, []);
	(0, import_react.useEffect)(() => buscar(), [buscar]);
	(0, import_react.useEffect)(() => {
		const recibir = (url) => {
			const leido = leerEnlaceEmparejar(url);
			setEnlace(leido);
			setEnlaceInvalido(leido === null);
		};
		const pendiente = consumirEnlacePendiente();
		if (pendiente) recibir(pendiente);
		return alEnlace(recibir);
	}, []);
	const alEvento = (0, import_react.useCallback)((e) => {
		if (!vivo.current) return;
		switch (e.fase) {
			case "conectando":
				setFase({ tipo: "conectando" });
				return;
			case "verifica":
				vioNumero.current = true;
				vibrar("umbral");
				setFase({
					tipo: "verifica",
					numero: e.codigo_verificacion
				});
				return;
			case "aprobado":
				cancelar.current = null;
				vibrar("confirmar");
				setFase({
					tipo: "aprobado",
					equipo: e.nombre_equipo
				});
				setTimeout(() => {
					if (vivo.current) navegar("/bienvenida?paso=a4", { reemplazar: true });
				}, ESPERA_APROBADO_MS);
				return;
			case "error":
				cancelar.current = null;
				if (e.error === "cancelado") {
					setFase({ tipo: "inicio" });
					return;
				}
				setFase({
					tipo: "error",
					error: e.error,
					mensaje: e.mensaje,
					trasVerificar: vioNumero.current
				});
				return;
		}
	}, []);
	const lanzar = (0, import_react.useCallback)((intento) => {
		cancelar.current?.();
		ultimo.current = intento;
		vioNumero.current = false;
		setFase({ tipo: "conectando" });
		cancelar.current = intento.tipo === "qr" ? emparejarConQr(intento.texto, alEvento) : emparejarConCodigo(intento.codigo, intento.ip, alEvento);
	}, [alEvento]);
	const pcElegida = pcs?.find((x) => x.host_id === elegida) ?? null;
	const conectarConCodigo = () => {
		if (!codigoCompleto(codigo)) {
			setErrorCodigo(T.faltaCodigo);
			document.getElementById(idCodigo)?.focus();
			return;
		}
		let ip = pcElegida?.ip ?? null;
		if (!ip) {
			const manual = ipManual.trim();
			if (manual !== "" && !esIpPrivada(manual)) {
				setErrorIp(T.direccionInvalida);
				return;
			}
			ip = manual === "" ? null : manual;
		}
		setErrorIp(null);
		setErrorCodigo(null);
		lanzar({
			tipo: "codigo",
			codigo,
			ip
		});
	};
	const cancelarEnCurso = (0, import_react.useCallback)(() => {
		cancelar.current?.();
		cancelar.current = null;
		setFase({ tipo: "inicio" });
	}, []);
	(0, import_react.useEffect)(() => {
		if (fase.tipo !== "conectando" && fase.tipo !== "verifica") return void 0;
		return registrarAtras(() => {
			cancelarEnCurso();
			return true;
		});
	}, [fase.tipo, cancelarEnCurso]);
	const volver = () => {
		if (fase.tipo === "conectando" || fase.tipo === "verifica") {
			cancelarEnCurso();
			return;
		}
		if (soloCodigo) {
			setModo(null, { reemplazar: true });
			return;
		}
		navegar(desde === "ajustes" ? "/ajustes/celular" : "/bienvenida?paso=a1");
	};
	const accionError = (a) => {
		if (a === "escanear") {
			setCodigo("");
			setFase({ tipo: "inicio" });
			setModo(null, { reemplazar: true });
			return;
		}
		if (a === "reintentar" && ultimo.current) {
			lanzar(ultimo.current);
			return;
		}
		setFase({ tipo: "inicio" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pantalla, {
		titulo: T.tituloPantalla,
		lista: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cx(Emparejar_module_default.raiz),
			"data-vista": "emparejar",
			"data-fase": fase.tipo,
			"data-modo": soloCodigo ? "codigo" : "camara",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Emparejar_module_default.columna),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: cx(Emparejar_module_default.barra),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BotonIcono, {
							icono: "ChevronLeft",
							etiqueta: T.atras,
							variante: "secundario",
							alPulsar: volver,
							className: cx(Emparejar_module_default.botonAtras)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cx(Emparejar_module_default.barraTitulo),
							children: T.tituloPantalla
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cx(Emparejar_module_default.cuerpo),
						"aria-live": "polite",
						children: [
							fase.tipo === "inicio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inicio, {
								soloCodigo,
								codigo,
								setCodigo: (c) => {
									setCodigo(c);
									setErrorCodigo(null);
								},
								errorCodigo,
								idCodigo,
								pcs,
								elegida,
								setElegida,
								ipManual,
								setIpManual: (v) => {
									setIpManual(v);
									setErrorIp(null);
								},
								errorIp,
								alConectar: conectarConCodigo,
								alLeerQr: (texto) => lanzar({
									tipo: "qr",
									texto
								}),
								alEscribirCodigo: () => setModo("codigo"),
								alUsarCamara: () => setModo(null, { reemplazar: true }),
								alBuscar: buscar,
								enlace,
								enlaceInvalido,
								alConfirmarEnlace: () => {
									if (!enlace) return;
									const texto = enlace.texto;
									setEnlace(null);
									lanzar({
										tipo: "qr",
										texto
									});
								},
								alDescartarEnlace: () => {
									setEnlace(null);
									setEnlaceInvalido(false);
								}
							}) : null,
							fase.tipo === "conectando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(Emparejar_module_default.estadoCentro),
								"data-estado": "conectando",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cx(Emparejar_module_default.girador),
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: cx(Emparejar_module_default.titulo),
										children: T.conectando
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cx(Emparejar_module_default.texto),
										children: T.conectandoTexto
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
										variante: "secundario",
										alPulsar: cancelarEnCurso,
										children: T.cancelar
									})
								]
							}) : null,
							fase.tipo === "verifica" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(Emparejar_module_default.estadoCentro),
								"data-estado": "verifica",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cx(Emparejar_module_default.dispositivos),
										"aria-hidden": "true",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cx(Emparejar_module_default.dispositivo),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
													nombre: "Smartphone",
													tamano: 20
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cx(Emparejar_module_default.enlaceDispositivos) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cx(Emparejar_module_default.dispositivo),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
													nombre: "Monitor",
													tamano: 20
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: cx(Emparejar_module_default.titulo),
										children: T.tituloA3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cx(Emparejar_module_default.numero),
										"aria-label": T.etiquetaNumero(fase.numero),
										"data-numero": fase.numero,
										children: fase.numero.split("").map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cx(Emparejar_module_default.digito),
											"aria-hidden": "true",
											children: d
										}, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cx(Emparejar_module_default.texto),
										children: T.textoA3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
										variante: "secundario",
										tamano: "lg",
										anchoCompleto: true,
										alPulsar: cancelarEnCurso,
										children: T.cancelar
									})
								]
							}) : null,
							fase.tipo === "aprobado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cx(Emparejar_module_default.estadoCentro),
								"data-estado": "aprobado",
								role: "status",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palomita, { tamano: 64 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: cx(Emparejar_module_default.titulo),
										children: T.conectado(fase.equipo)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: cx(Emparejar_module_default.texto),
										children: T.copiando
									})
								]
							}) : null,
							fase.tipo === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorEmparejamiento, {
								fase,
								alAccion: accionError
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cx(Emparejar_module_default.seguro),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
							nombre: "Lock",
							tamano: 16,
							className: cx(Emparejar_module_default.seguroIcono)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: T.seguro })]
					})
				]
			})
		})
	});
}
function ErrorEmparejamiento(p) {
	const v = errorVisible(p.fase.error, p.fase.mensaje, p.fase.trasVerificar);
	const etiqueta = etiquetaAccion(v.accion);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Emparejar_module_default.estadoCentro),
		"data-estado": "error",
		"data-error": p.fase.error,
		role: "alert",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Emparejar_module_default.circuloIcono, Emparejar_module_default.circuloAtencion),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "CircleAlert",
					tamano: 24
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: cx(Emparejar_module_default.titulo),
				children: T.tituloError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Emparejar_module_default.texto),
				children: v.texto
			}),
			v.ayuda ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Emparejar_module_default.ayudaError),
				children: v.ayuda
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx(Emparejar_module_default.accionesError),
				children: [etiqueta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					anchoCompleto: true,
					tamano: "lg",
					alPulsar: () => p.alAccion(v.accion),
					children: etiqueta
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "fantasma",
					anchoCompleto: true,
					alPulsar: () => p.alAccion(null),
					children: T.cancelar
				})]
			})
		]
	});
}
function TarjetaPc(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx(Emparejar_module_default.tarjetaPc),
		"data-activa": p.activa ? "" : void 0,
		"data-pc": p.pc.host_id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Emparejar_module_default.iconoPc),
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
					nombre: "Monitor",
					tamano: 20
				})
			}),
			p.varias ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "radio",
				"aria-checked": p.activa,
				className: cx(Emparejar_module_default.textoPcBoton),
				onClick: p.alElegir,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Emparejar_module_default.nombrePc),
					children: p.pc.nombre_equipo
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Emparejar_module_default.detallePc),
					children: [
						p.pc.ip,
						" · ",
						T.mismoWifi
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cx(Emparejar_module_default.textoPc),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Emparejar_module_default.nombrePc),
					children: T.encontramos
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Emparejar_module_default.detallePc),
					children: [
						p.pc.nombre_equipo,
						" · ",
						T.mismoWifi
					]
				})]
			}),
			p.activa && p.conBoton ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
				variante: "primario",
				tamano: "md",
				alPulsar: p.alConectar,
				className: cx(Emparejar_module_default.botonPc),
				children: T.conectar
			}) : p.activa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
				nombre: "CircleCheckBig",
				tamano: 20,
				etiqueta: T.pcElegida,
				className: cx(Emparejar_module_default.marcaPc)
			}) : null
		]
	});
}
function Inicio(p) {
	const listo = codigoCompleto(p.codigo);
	const nombreEnlace = p.enlace ? p.pcs?.find((x) => x.host_id === p.enlace?.hostId)?.nombre_equipo ?? T.enlaceTuPc : "";
	const varias = (p.pcs?.length ?? 0) > 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Emparejar_module_default.intro),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: cx(Emparejar_module_default.titulo),
				children: p.soloCodigo ? T.tituloA2b : T.tituloA2
			}), p.soloCodigo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Emparejar_module_default.texto),
				children: T.textoA2b
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cx(Emparejar_module_default.texto),
				children: [
					T.textoA2Antes,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: cx(Emparejar_module_default.ruta),
						children: T.textoA2Ruta
					}),
					T.textoA2Despues
				]
			})]
		}),
		p.enlace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Emparejar_module_default.tarjetaPc, Emparejar_module_default.tarjetaEnlace),
			"data-enlace": "",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cx(Emparejar_module_default.iconoPc),
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icono, {
						nombre: "Link",
						tamano: 20
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Emparejar_module_default.textoPc),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Emparejar_module_default.nombrePc),
						children: T.enlaceTitulo(nombreEnlace, p.enlace.direcciones[0] ?? "")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cx(Emparejar_module_default.detallePc),
						children: T.enlaceTexto
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cx(Emparejar_module_default.accionesEnlace),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "primario",
						tamano: "sm",
						alPulsar: p.alConfirmarEnlace,
						children: T.emparejar
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
						variante: "fantasma",
						tamano: "sm",
						alPulsar: p.alDescartarEnlace,
						children: T.cancelar
					})]
				})
			]
		}) : null,
		p.enlaceInvalido ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cx(Emparejar_module_default.avisoEnlace),
			role: "alert",
			children: T.errores.enlaceInvalido
		}) : null,
		p.soloCodigo ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visor, {
			alLeer: p.alLeerQr,
			alEscribirCodigo: p.alEscribirCodigo,
			activo: true
		}),
		p.pcs === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: cx(Emparejar_module_default.buscando),
			role: "status",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cx(Emparejar_module_default.giradorChico),
				"aria-hidden": "true"
			}), T.buscandoPc]
		}) : p.pcs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Emparejar_module_default.pcs),
			role: varias ? "radiogroup" : void 0,
			"aria-label": varias ? T.encontramosVarias : void 0,
			children: [varias ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cx(Emparejar_module_default.etiquetaCampo),
				children: T.encontramosVarias
			}) : null, p.pcs.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TarjetaPc, {
				pc: x,
				varias,
				activa: x.host_id === p.elegida,
				conBoton: !p.soloCodigo,
				alElegir: () => p.setElegida(x.host_id),
				alConectar: p.alConectar
			}, x.host_id))]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoCodigo, {
			id: p.idCodigo,
			valor: p.codigo,
			alCambiar: p.setCodigo,
			etiqueta: p.soloCodigo ? T.etiquetaCodigo : T.sinCamara,
			error: p.errorCodigo,
			grande: p.soloCodigo,
			autoFoco: p.soloCodigo,
			alCompletar: p.alConectar
		}),
		p.pcs !== null && p.pcs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cx(Emparejar_module_default.manual),
			"data-sin-pc": "",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cx(Emparejar_module_default.ayudaCampo),
					children: [
						T.noEncontramos,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cx(Emparejar_module_default.enlaceBoton),
							onClick: p.alBuscar,
							children: T.buscarOtraVez
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampoTexto, {
					etiqueta: T.etiquetaDireccion,
					valor: p.ipManual,
					alCambiar: p.setIpManual,
					placeholder: "192.168.1.20",
					ayuda: T.ayudaDireccion,
					error: p.errorIp,
					monoespaciado: true,
					alEnter: p.alConectar
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
					variante: "primario",
					tamano: "lg",
					anchoCompleto: true,
					deshabilitado: !listo,
					alPulsar: p.alConectar,
					children: T.conectar
				})
			]
		}) : null,
		p.soloCodigo && p.pcs !== null && p.pcs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "primario",
			tamano: "lg",
			anchoCompleto: true,
			deshabilitado: !listo,
			alPulsar: p.alConectar,
			children: T.conectar
		}) : null,
		p.soloCodigo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boton, {
			variante: "fantasma",
			icono: "Camera",
			alPulsar: p.alUsarCamara,
			children: T.usarCamara
		}) : null
	] });
}
//#endregion
export { PantallaEmparejar };
