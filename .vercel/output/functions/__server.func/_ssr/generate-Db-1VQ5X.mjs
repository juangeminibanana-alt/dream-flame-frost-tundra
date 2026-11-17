import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-Db-1VQ5X.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var IMAGE_MODEL = "grok-imagine-image-2.0";
var VIDEO_MODEL = "grok-imagine-video-1.5";
function keyOrError() {
	return process.env.XAI_API_KEY ?? null;
}
async function xai(path, init) {
	const apiKey = keyOrError();
	if (!apiKey) throw new Error("La generación no está disponible.");
	return fetch(`https://api.x.ai/v1${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
			...init?.headers ?? {}
		}
	});
}
function holdPrompt(name, fondo, vibe) {
	const extra = vibe ? ` ${vibe}` : "";
	return [
		"Photorealistic vertical product-hold still, no text, no logos, no watermark, no face.",
		`Masculine hands hold one garment only: ${name}.`,
		`Background: ${fondo}.${extra}`,
		"Soft studio light, catalog look, face completely out of frame, slow and still."
	].join(" ");
}
var startHold_createServerFn_handler = createServerRpc({
	id: "951ec8db5b5d1bbfd56241d2b7174582e0b30eb02f3fb78350973e8958649bbd",
	name: "startHold",
	filename: "src/studio/generate.ts"
}, (opts) => startHold.__executeServer(opts));
var startHold = createServerFn({ method: "POST" }).validator((input) => {
	const name = input?.name?.trim().slice(0, 80) ?? "";
	if (name.length < 2) throw new Error("Falta el nombre del producto.");
	return {
		name,
		vibe: input?.vibe?.trim().slice(0, 240) ?? "",
		fondo: input?.fondo?.trim().slice(0, 80) || "Negro mate"
	};
}).handler(startHold_createServerFn_handler, async ({ data }) => {
	if (!keyOrError()) return {
		ok: false,
		error: "La generación no está disponible."
	};
	const imageRes = await xai("/images/generations", {
		method: "POST",
		body: JSON.stringify({
			model: IMAGE_MODEL,
			prompt: holdPrompt(data.name, data.fondo, data.vibe),
			aspect_ratio: "9:16",
			n: 1,
			response_format: "url"
		})
	});
	if (!imageRes.ok) return {
		ok: false,
		error: `La foto falló (${imageRes.status}).`
	};
	const still = (await imageRes.json()).data?.[0]?.url;
	if (!still) return {
		ok: false,
		error: "La foto no devolvió archivo."
	};
	const videoRes = await xai("/videos/generations", {
		method: "POST",
		body: JSON.stringify({
			model: VIDEO_MODEL,
			prompt: "Slow product-hold. The hands turn the garment a little so the fabric catches the light. No face enters the frame. No text. Camera almost still.",
			image: { url: still },
			duration: 10
		})
	});
	if (!videoRes.ok) return {
		ok: false,
		error: `La foto sí. El video falló (${videoRes.status}).`,
		still
	};
	const videoBody = await videoRes.json();
	if (!videoBody.request_id) return {
		ok: false,
		error: "La foto sí. El video no dio folio.",
		still
	};
	return {
		ok: true,
		still,
		requestId: videoBody.request_id
	};
});
var pollHold_createServerFn_handler = createServerRpc({
	id: "e30fb84d6b43c1b6c3c987cf4334505cc987ceb18d40668c7474f210f153c5be",
	name: "pollHold",
	filename: "src/studio/generate.ts"
}, (opts) => pollHold.__executeServer(opts));
var pollHold = createServerFn({ method: "POST" }).validator((input) => {
	const requestId = input?.requestId?.trim() ?? "";
	if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
	return { requestId };
}).handler(pollHold_createServerFn_handler, async ({ data }) => {
	if (!keyOrError()) return {
		ok: false,
		error: "La generación no está disponible."
	};
	const res = await xai(`/videos/${data.requestId}`);
	if (!res.ok) return {
		ok: false,
		error: `No pude revisar el video (${res.status}).`
	};
	const body = await res.json();
	if (body.status === "done" && body.video?.url) return {
		ok: true,
		status: "done",
		videoUrl: body.video.url
	};
	if (body.status === "failed" || body.status === "expired") return {
		ok: false,
		error: body.error || "El video no se armó."
	};
	return {
		ok: true,
		status: "pending"
	};
});
var startPack_createServerFn_handler = createServerRpc({
	id: "f0ab62d1e8fff318d921825b60a5cee05fc4b42c4009a5b0e5c620dc3a74dd36",
	name: "startPack",
	filename: "src/studio/generate.ts"
}, (opts) => startPack.__executeServer(opts));
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
}).handler(startPack_createServerFn_handler, async ({ data }) => {
	if (!keyOrError()) return {
		ok: false,
		error: "La generación no está disponible."
	};
	const { armarPack } = await import("./pack-YZPotKAL.mjs");
	return armarPack(data.color);
});
var pollPack_createServerFn_handler = createServerRpc({
	id: "4e6d8ecc971f79d80cc2550162ab908ebe0e8187f12ad2f67e6e9660a7e327f7",
	name: "pollPack",
	filename: "src/studio/generate.ts"
}, (opts) => pollPack.__executeServer(opts));
var pollPack = createServerFn({ method: "POST" }).validator((input) => {
	const requestId = input?.requestId?.trim() ?? "";
	if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
	return { requestId };
}).handler(pollPack_createServerFn_handler, async ({ data }) => {
	const { revisarPack } = await import("./pack-YZPotKAL.mjs");
	return revisarPack(data.requestId);
});
var estadoPack_createServerFn_handler = createServerRpc({
	id: "57ed82bf473082399decdc5987f46f69931206a58aa28a72cef375d394b78f43",
	name: "estadoPack",
	filename: "src/studio/generate.ts"
}, (opts) => estadoPack.__executeServer(opts));
var estadoPack = createServerFn({ method: "POST" }).validator((input) => input ?? {}).handler(estadoPack_createServerFn_handler, async () => {
	const { estadoPackDisco } = await import("./pack-YZPotKAL.mjs");
	return estadoPackDisco();
});
//#endregion
export { estadoPack_createServerFn_handler, pollHold_createServerFn_handler, pollPack_createServerFn_handler, startHold_createServerFn_handler, startPack_createServerFn_handler };
