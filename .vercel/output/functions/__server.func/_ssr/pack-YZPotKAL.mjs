import { a as promptVideo, i as promptStill, n as colorPack } from "./pack-meta-D3P2eMbw.mjs";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/pack-YZPotKAL.js
var IMAGE_MODEL = "grok-imagine-image-2.0";
var VIDEO_MODEL = "grok-imagine-video-1.5";
function raizPublica() {
	const local = join(process.cwd(), "public", "ugc");
	if (existsSync(local)) return join(process.cwd(), "public");
	return "/workspace/public";
}
function dirSalida() {
	const dir = join(raizPublica(), "ugc", "salida");
	mkdirSync(dir, { recursive: true });
	return dir;
}
function leerFoto(rel) {
	const rutas = [join(process.cwd(), "public", rel), join("/workspace/public", rel)];
	for (const ruta of rutas) {
		if (!existsSync(ruta)) continue;
		return `data:image/jpeg;base64,${readFileSync(ruta).toString("base64")}`;
	}
	throw new Error("No encuentro las fotos del avatar o de la habitación.");
}
async function xai(path, body) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("La generación no está disponible.");
	return fetch(`https://api.x.ai/v1${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(12e4)
	});
}
async function guardarRemoto(url, nombre) {
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(6e4) });
		if (!res.ok) return null;
		const buf = Buffer.from(await res.arrayBuffer());
		const ruta = join(dirSalida(), nombre);
		writeFileSync(ruta, buf);
		return `/ugc/salida/${nombre}?v=${Math.floor(statSync(ruta).mtimeMs)}`;
	} catch {
		return null;
	}
}
function escribirMeta(color, patch) {
	const ruta = join(dirSalida(), "hero.json");
	let previo = {};
	try {
		previo = JSON.parse(readFileSync(ruta, "utf8"));
	} catch {
		previo = {};
	}
	writeFileSync(ruta, JSON.stringify({
		...previo,
		color,
		...patch
	}));
}
async function armarPack(id) {
	const color = colorPack(id);
	if (!color) return {
		ok: false,
		error: "Ese color no está en la pieza."
	};
	if (!process.env.XAI_API_KEY) return {
		ok: false,
		error: "La generación no está disponible."
	};
	let imagenes;
	try {
		imagenes = [
			"ugc/habitacion/01_habitacion.jpg",
			"ugc/avatar/01_retrato_frontal.jpg",
			"ugc/avatar/02_cuerpo_completo_frente.jpg",
			"ugc/avatar/03_cuerpo_completo_espaldas.jpg",
			color.archivo
		].map((rel) => ({
			type: "image_url",
			url: leerFoto(rel)
		}));
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "No encuentro las fotos."
		};
	}
	const imageRes = await xai("/images/edits", {
		model: IMAGE_MODEL,
		prompt: promptStill(color.id),
		images: imagenes,
		aspect_ratio: "9:16",
		quality: "medium",
		n: 1,
		response_format: "url"
	});
	if (!imageRes.ok) {
		const detalle = await imageRes.text().catch(() => "");
		console.error("edits", imageRes.status, detalle.slice(0, 400));
		return {
			ok: false,
			error: `La foto falló (${imageRes.status}).`
		};
	}
	const imageBody = await imageRes.json();
	const remota = imageBody.data?.[0]?.url ?? imageBody.url;
	if (!remota) return {
		ok: false,
		error: "La foto no devolvió archivo."
	};
	const still = await guardarRemoto(remota, "hero.jpg") ?? remota;
	try {
		escribirMeta(color.id, { still: still.startsWith("/") ? still : void 0 });
	} catch {}
	const videoRes = await xai("/videos/generations", {
		model: VIDEO_MODEL,
		prompt: promptVideo(color.id),
		image: { url: remota },
		duration: 10
	});
	if (!videoRes.ok) {
		const detalle = await videoRes.text().catch(() => "");
		console.error("video", videoRes.status, detalle.slice(0, 400));
		return {
			ok: false,
			error: `La foto sí. El video falló (${videoRes.status}).`,
			still
		};
	}
	const videoBody = await videoRes.json();
	if (!videoBody.request_id) return {
		ok: false,
		error: "La foto sí. El video no dio folio.",
		still
	};
	return {
		ok: true,
		still,
		requestId: videoBody.request_id,
		color: color.id
	};
}
async function revisarPack(requestId) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "La generación no está disponible."
	};
	const res = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
		headers: { Authorization: `Bearer ${apiKey}` },
		signal: AbortSignal.timeout(3e4)
	});
	if (!res.ok) return {
		ok: false,
		error: `No pude revisar el video (${res.status}).`
	};
	const body = await res.json();
	if (body.status === "done" && body.video?.url) {
		const local = await guardarRemoto(body.video.url, "hero.mp4");
		if (local) try {
			const metaRuta = join(dirSalida(), "hero.json");
			escribirMeta((existsSync(metaRuta) ? JSON.parse(readFileSync(metaRuta, "utf8")) : {}).color ?? "signal-black", { video: local });
		} catch {}
		return {
			ok: true,
			status: "done",
			videoUrl: local ?? body.video.url
		};
	}
	if (body.status === "failed" || body.status === "expired") return {
		ok: false,
		error: "El video no se armó."
	};
	return {
		ok: true,
		status: "pending"
	};
}
function estadoPackDisco() {
	try {
		const ruta = join(raizPublica(), "ugc", "salida", "hero.json");
		if (!existsSync(ruta)) return {
			still: null,
			video: null,
			color: null
		};
		const meta = JSON.parse(readFileSync(ruta, "utf8"));
		const sello = (publico, archivo) => {
			if (!publico) return null;
			const disco = join(raizPublica(), "ugc", "salida", archivo);
			if (!existsSync(disco)) return null;
			return `/ugc/salida/${archivo}?v=${Math.floor(statSync(disco).mtimeMs)}`;
		};
		return {
			color: meta.color ?? null,
			still: sello(meta.still, "hero.jpg"),
			video: sello(meta.video, "hero.mp4")
		};
	} catch {
		return {
			still: null,
			video: null,
			color: null
		};
	}
}
//#endregion
export { armarPack, estadoPackDisco, revisarPack };
