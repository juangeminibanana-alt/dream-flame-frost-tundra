import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { FOTOS_EMPACADAS } from "./fotos-empacadas.ts";
import {
  colorPack,
  IDEAS_PACK,
  promptIdea,
  promptVideo,
  refsIdea,
  type AjustesPack,
  type IdeaPack,
} from "./pack-meta.ts";
import type {
  EstadoPack,
  IdeaHecha,
  IdeasResult,
  PollResult,
  StartPackResult,
} from "./generation-types.ts";
import { legacyStill, validateIdeas, validatePack } from "./generation-input.server.ts";
import {
  generatedImage,
  generationAvailable,
  imageSource,
  pollVideo,
  record,
  requestId,
  requestXai,
  withGenerationGate,
} from "./xai.server.ts";

export type { EstadoPack, IdeaHecha } from "./generation-types.ts";

const IMAGE_MODEL = "grok-imagine-image-2.0";
const VIDEO_MODEL = "grok-imagine-video-1.5";

function publicRoots(): string[] {
  return [join(process.cwd(), "public"), "/workspace/public"];
}

function leerFoto(rel: string): string {
  const empacada = FOTOS_EMPACADAS[rel];
  if (empacada) return empacada;
  // Only fixed reference paths reach this fallback. No remote download or runtime writes.
  if (!/^ugc\/(?:avatar|habitacion|producto|salida)\/[\w-]+\.(?:jpg|jpeg|png|webp)$/.test(rel)) {
    throw new Error("La referencia de imagen no es válida.");
  }
  for (const root of publicRoots()) {
    const path = join(root, rel);
    if (!existsSync(path)) continue;
    const source = imageSource("data:image/jpeg;base64," + readFileSync(path).toString("base64"));
    if (source) return source;
  }
  throw new Error("No encuentro una de las fotos de referencia.");
}

function selectedStill(still: string): string {
  const source = imageSource(still);
  if (source) return source;
  const local = legacyStill(still);
  if (!local) throw new Error("Selecciona una foto válida de la idea para animarla.");
  return leerFoto(local.slice(1).split("?")[0]);
}

export async function armarIdeas(
  colorId: string,
  aspectRatio: string,
  solo?: IdeaPack[],
): Promise<IdeasResult> {
  let input;
  try {
    input = validateIdeas({ color: colorId, aspectRatio, ...(solo === undefined ? {} : { solo }) });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Revisa las opciones de las ideas.",
      retryable: false,
    };
  }
  if (!generationAvailable())
    return {
      ok: false,
      error: "La generación no está disponible en este entorno.",
      retryable: false,
    };
  const color = colorPack(input.color)!;
  return withGenerationGate("ideas", async (): Promise<IdeasResult> => {
    const pedidos = IDEAS_PACK.filter(({ id }) => !input.solo || input.solo.includes(id));
    const ideas = await Promise.all(
      pedidos.map(async ({ id }): Promise<IdeaHecha> => {
        try {
          const images = refsIdea(id, color.archivo).map((rel) => ({
            type: "image_url",
            url: leerFoto(rel),
          }));
          const result = await requestXai("/images/edits", {
            method: "POST",
            body: {
              model: IMAGE_MODEL,
              prompt: promptIdea(id, color.id),
              images,
              aspect_ratio: input.aspectRatio,
              response_format: "url",
              n: 1,
              resolution: "1k",
              quality: "medium",
            },
          });
          if (!result.ok) return { id, url: null, error: result.error };
          const url = generatedImage(result.body);
          return url
            ? { id, url }
            : { id, url: null, error: "Grok no devolvió una imagen válida para esta idea." };
        } catch (error) {
          return {
            id,
            url: null,
            error: error instanceof Error ? error.message : "No pude preparar esta idea.",
          };
        }
      }),
    );
    if (!ideas.some(({ url }) => url))
      return {
        ok: false,
        error: ideas.find(({ error }) => error)?.error ?? "No salió ninguna idea.",
        retryable: false,
      };
    // Hosted URLs are temporary. Color/aspect belong to client state, not shared public filenames.
    return { ok: true, color: color.id, aspectRatio: input.aspectRatio, ideas };
  });
}

export async function armarPack(
  id: string,
  pedido?: Partial<AjustesPack> & { idea?: string; still?: string },
): Promise<StartPackResult> {
  try {
    const input = validatePack({ ...pedido, color: id });
    if (!generationAvailable())
      return {
        ok: false,
        error: "La generación no está disponible en este entorno.",
        retryable: false,
      };
    const color = colorPack(input.color)!;
    const referencias = [
      "ugc/avatar/01_rostro.jpg",
      "ugc/avatar/02_frente.jpg",
      "ugc/avatar/03_espalda.jpg",
      "ugc/avatar/04_perfil_derecho.jpg",
      "ugc/avatar/05_perfil_izquierdo.jpg",
      "ugc/habitacion/01_habitacion.jpg",
      color.archivo,
    ].map((rel) => ({ url: leerFoto(rel) }));
    const ajustes: AjustesPack = {
      duration: input.duration,
      aspectRatio: input.aspectRatio,
      resolution: input.resolution,
    };
    const firstFrame = selectedStill(input.still);
    return withGenerationGate("video", async (): Promise<StartPackResult> => {
      const result = await requestXai("/videos/generations", {
        method: "POST",
        timeoutMs: 30_000,
        body: {
          model: VIDEO_MODEL,
          prompt: promptVideo(color.id, ajustes, input.idea, true),
          image: { url: firstFrame },
          reference_images: referencias,
          duration: ajustes.duration,
          aspect_ratio: ajustes.aspectRatio,
          resolution: ajustes.resolution,
          generate_audio: false,
        },
      });
      if (!result.ok) return result;
      const idVideo = requestId(result.body.request_id);
      if (!idVideo)
        return {
          ok: false,
          error:
            "Grok no devolvió un folio de video válido. No se reenviará la solicitud automáticamente.",
          retryable: false,
        };
      return {
        ok: true,
        requestId: idVideo,
        color: color.id,
        idea: input.idea,
        still: input.still,
        ajustes,
      };
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No pude preparar el video.",
      retryable: false,
    };
  }
}

export async function revisarPack(id: string): Promise<PollResult> {
  return pollVideo(id);
}

// Read pre-existing bundled media only. Serverless deployments have no writable public directory.
export function estadoPackDisco(): EstadoPack {
  const empty: EstadoPack = {
    available: generationAvailable(),
    still: null,
    video: null,
    color: null,
    ideas: [],
    colorIdeas: null,
  };
  for (const root of publicRoots()) {
    try {
      const salida = join(root, "ugc", "salida");
      if (!existsSync(salida)) continue;
      const stamp = (name: string): string | null => {
        const path = join(salida, name);
        return existsSync(path)
          ? "/ugc/salida/" + name + "?v=" + Math.floor(statSync(path).mtimeMs)
          : null;
      };
      const readMeta = (name: string): Record<string, unknown> | null => {
        try {
          return record(JSON.parse(readFileSync(join(salida, name), "utf8")));
        } catch {
          return null;
        }
      };
      const ideasMeta = readMeta("ideas.json");
      const colorIdeas =
        typeof ideasMeta?.color === "string" && colorPack(ideasMeta.color) ? ideasMeta.color : null;
      const ideas =
        Array.isArray(ideasMeta?.ideas) && colorIdeas
          ? ideasMeta.ideas.flatMap((entry) => {
              const value = record(entry);
              const idea = IDEAS_PACK.find(({ id }) => id === value?.id);
              const url = idea ? stamp("idea-" + idea.id + ".jpg") : null;
              return idea && url ? [{ id: idea.id, url }] : [];
            })
          : [];
      const hero = readMeta("hero.json");
      const color = typeof hero?.color === "string" && colorPack(hero.color) ? hero.color : null;
      return {
        ...empty,
        color,
        still: color && hero?.still ? stamp("hero.jpg") : null,
        video: color && hero?.video ? stamp("hero.mp4") : null,
        ideas,
        colorIdeas,
      };
    } catch {
      // Missing optional legacy assets must not disable new API generation.
    }
  }
  return empty;
}
