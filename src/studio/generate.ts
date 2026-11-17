import { createServerFn } from "@tanstack/react-start";
import type { IdeasResult, PollResult, StartPackResult } from "./generation-types";

type HoldResult =
  | { ok: true; still: string; requestId: string }
  | { ok: false; error: string; still?: string; retryable?: boolean };

// Provider code and validation are loaded only inside server handlers.
export const startHold = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<HoldResult> => {
    const { validateHold } = await import("./generation-input.server");
    const { generatedImage, requestId, requestXai, withGenerationGate } =
      await import("./xai.server");
    try {
      const input = validateHold(data);
      return withGenerationGate("video", async (): Promise<HoldResult> => {
        let still: string | undefined;
        try {
          const image = await requestXai("/images/generations", {
            method: "POST",
            body: {
              model: "grok-imagine-image-2.0",
              prompt: [
                "Photorealistic vertical product-hold still, no text, no logos, no watermark, no face.",
                "Masculine hands hold one garment only: " +
                  input.name +
                  ". Background: " +
                  input.fondo +
                  ". " +
                  input.vibe,
                "Soft studio light, catalog look, face completely out of frame.",
              ].join(" "),
              aspect_ratio: "9:16",
              n: 1,
              response_format: "url",
              quality: "medium",
            },
          });
          if (!image.ok) return image;
          still = generatedImage(image.body) ?? undefined;
          if (!still)
            return { ok: false, error: "Grok no devolvió una foto válida.", retryable: false };
          const video = await requestXai("/videos/generations", {
            method: "POST",
            timeoutMs: 30_000,
            body: {
              model: "grok-imagine-video-1.5",
              prompt:
                "Slow product-hold. Hands turn the garment slightly so the fabric catches the light. No face or text. Camera almost still.",
              image: { url: still },
              duration: 10,
              resolution: "720p",
              generate_audio: false,
            },
          });
          if (!video.ok) return { ...video, still };
          const id = requestId(video.body.request_id);
          return id
            ? { ok: true, still, requestId: id }
            : {
                ok: false,
                still,
                error: "La foto está lista, pero Grok no devolvió un folio válido de video.",
                retryable: false,
              };
        } catch {
          return {
            ok: false,
            error: "No pude preparar el producto.",
            ...(still ? { still } : {}),
            retryable: false,
          };
        }
      });
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Revisa las opciones del producto.",
        retryable: false,
      };
    }
  });

export const pollHold = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<PollResult> => {
    const { validatePoll } = await import("./generation-input.server");
    const { pollVideo } = await import("./xai.server");
    try {
      return await pollVideo(validatePoll(data).requestId);
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Folio de video inválido.",
        retryable: false,
      };
    }
  });

export const startIdeas = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<IdeasResult> => {
    const { validateIdeas } = await import("./generation-input.server");
    const { armarIdeas } = await import("./pack");
    try {
      const input = validateIdeas(data);
      return await armarIdeas(input.color, input.aspectRatio, input.solo);
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Revisa las opciones de las ideas.",
        retryable: false,
      };
    }
  });

export const startPack = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<StartPackResult> => {
    const { validatePack } = await import("./generation-input.server");
    const { armarPack } = await import("./pack");
    try {
      const input = validatePack(data);
      return await armarPack(input.color, input);
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Revisa las opciones del video.",
        retryable: false,
      };
    }
  });

export const pollPack = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<PollResult> => {
    const { validatePoll } = await import("./generation-input.server");
    const { revisarPack } = await import("./pack");
    try {
      return await revisarPack(validatePoll(data).requestId);
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Folio de video inválido.",
        retryable: false,
      };
    }
  });

export const estadoPack = createServerFn({ method: "POST" })
  .validator((input: unknown) => input ?? {})
  .handler(async () => {
    const { estadoPackDisco } = await import("./pack");
    return estadoPackDisco();
  });
