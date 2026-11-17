import { createServerFn } from "@tanstack/react-start";
import { ajustesPack, ideaPack, type AjustesPack } from "./pack-meta";

const IMAGE_MODEL = "grok-imagine-image-2.0";
const VIDEO_MODEL = "grok-imagine-video-1.5";

type StartResult =
  | { ok: true; still: string; requestId: string }
  | { ok: false; error: string; still?: string };

type PollResult =
  | { ok: true; status: "pending" }
  | { ok: true; status: "done"; videoUrl: string }
  | { ok: false; error: string };

function keyOrError(): string | null {
  return process.env.XAI_API_KEY ?? null;
}

async function xai(path: string, init?: RequestInit): Promise<Response> {
  const apiKey = keyOrError();
  if (!apiKey) throw new Error("La generación no está disponible.");
  return fetch(`https://api.x.ai/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(init?.headers ?? {}),
    },
  });
}

function holdPrompt(name: string, fondo: string, vibe: string): string {
  const extra = vibe ? ` ${vibe}` : "";
  return [
    "Photorealistic vertical product-hold still, no text, no logos, no watermark, no face.",
    `Masculine hands hold one garment only: ${name}.`,
    `Background: ${fondo}.${extra}`,
    "Soft studio light, catalog look, face completely out of frame, slow and still.",
  ].join(" ");
}

export const startHold = createServerFn({ method: "POST" })
  .validator((input: { name: string; vibe: string; fondo: string }) => {
    const name = input?.name?.trim().slice(0, 80) ?? "";
    if (name.length < 2) throw new Error("Falta el nombre del producto.");
    return {
      name,
      vibe: input?.vibe?.trim().slice(0, 240) ?? "",
      fondo: input?.fondo?.trim().slice(0, 80) || "Negro mate",
    };
  })
  .handler(async ({ data }): Promise<StartResult> => {
    if (!keyOrError()) return { ok: false, error: "La generación no está disponible." };

    const imageRes = await xai("/images/generations", {
      method: "POST",
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: holdPrompt(data.name, data.fondo, data.vibe),
        aspect_ratio: "9:16",
        n: 1,
        response_format: "url",
      }),
    });
    if (!imageRes.ok) {
      return { ok: false, error: `La foto falló (${imageRes.status}).` };
    }
    const imageBody = (await imageRes.json()) as { data?: { url?: string }[] };
    const still = imageBody.data?.[0]?.url;
    if (!still) return { ok: false, error: "La foto no devolvió archivo." };

    const videoRes = await xai("/videos/generations", {
      method: "POST",
      body: JSON.stringify({
        model: VIDEO_MODEL,
        prompt:
          "Slow product-hold. The hands turn the garment a little so the fabric catches the light. No face enters the frame. No text. Camera almost still.",
        image: { url: still },
        duration: 10,
      }),
    });
    if (!videoRes.ok) {
      return { ok: false, error: `La foto sí. El video falló (${videoRes.status}).`, still };
    }
    const videoBody = (await videoRes.json()) as { request_id?: string };
    if (!videoBody.request_id) {
      return { ok: false, error: "La foto sí. El video no dio folio.", still };
    }
    return { ok: true, still, requestId: videoBody.request_id };
  });

export const pollHold = createServerFn({ method: "POST" })
  .validator((input: { requestId: string }) => {
    const requestId = input?.requestId?.trim() ?? "";
    if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
    return { requestId };
  })
  .handler(async ({ data }): Promise<PollResult> => {
    if (!keyOrError()) return { ok: false, error: "La generación no está disponible." };
    const res = await xai(`/videos/${data.requestId}`);
    if (!res.ok) return { ok: false, error: `No pude revisar el video (${res.status}).` };
    const body = (await res.json()) as {
      status?: string;
      video?: { url?: string };
      error?: string;
    };
    if (body.status === "done" && body.video?.url) {
      return { ok: true, status: "done", videoUrl: body.video.url };
    }
    if (body.status === "failed" || body.status === "expired") {
      return { ok: false, error: body.error || "El video no se armó." };
    }
    return { ok: true, status: "pending" };
  });

export const startIdeas = createServerFn({ method: "POST" })
  .validator((input: { color?: string; aspectRatio?: string }) => {
    const color = input?.color?.trim() || "signal-black";
    if (!["signal-black", "royal-blue", "burgundy", "white", "lilac"].includes(color)) {
      throw new Error("Ese color no está en la pieza.");
    }
    return { color, aspectRatio: input?.aspectRatio?.trim() || "9:16" };
  })
  .handler(async ({ data }) => {
    if (!keyOrError()) return { ok: false as const, error: "La generación no está disponible." };
    const { armarIdeas } = await import("./pack");
    return armarIdeas(data.color, data.aspectRatio);
  });

export const startPack = createServerFn({ method: "POST" })
  .validator((input: { color?: string; idea?: string } & Partial<AjustesPack>) => {
    const color = input?.color?.trim() || "signal-black";
    if (!["signal-black", "royal-blue", "burgundy", "white", "lilac"].includes(color)) {
      throw new Error("Ese color no está en la pieza.");
    }
    return { color, idea: ideaPack(input?.idea ?? "")?.id ?? "probar", ...ajustesPack(input) };
  })
  .handler(async ({ data }) => {
    if (!keyOrError()) return { ok: false, error: "La generación no está disponible." };
    const { armarPack } = await import("./pack");
    return armarPack(data.color, data);
  });

export const pollPack = createServerFn({ method: "POST" })
  .validator((input: { requestId: string }) => {
    const requestId = input?.requestId?.trim() ?? "";
    if (!/^[\w-]{8,}$/.test(requestId)) throw new Error("Folio inválido.");
    return { requestId };
  })
  .handler(async ({ data }): Promise<PollResult> => {
    const { revisarPack } = await import("./pack");
    return revisarPack(data.requestId);
  });

export const estadoPack = createServerFn({ method: "POST" })
  .validator((input: unknown) => input ?? {})
  .handler(async () => {
    const { estadoPackDisco } = await import("./pack");
    return estadoPackDisco();
  });
