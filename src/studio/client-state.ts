import {
  AJUSTES_PACK,
  CALIDADES_PACK,
  COLORES_PACK,
  DURACION_PACK,
  IDEAS_PACK,
  RELACIONES_PACK,
  type AjustesPack,
  type ColorPack,
  type IdeaPack,
  type RelacionPack,
} from "./pack-meta.ts";
import type { IdeaHecha } from "./generation-types.ts";

export const WORKSPACE_KEY = "corte:generacion:v1";
export const TRACKING_WINDOW_MS = 10 * 60 * 1000;

export type IdeasSnapshot = {
  color: ColorPack;
  aspectRatio: RelacionPack;
  items: IdeaHecha[];
};
export type VideoJob = {
  requestId: string;
  color: ColorPack;
  idea: IdeaPack;
  still: string;
  ajustes: AjustesPack;
  createdAt: number;
  trackingStartedAt: number;
  paused: boolean;
};
export type VideoResult = VideoJob & { videoUrl: string; completedAt: number };
export type GenerationWorkspace = {
  version: 1;
  color: ColorPack;
  ajustes: AjustesPack;
  ideas: IdeasSnapshot | null;
  pending: VideoJob | null;
  result: VideoResult | null;
};
export type LegacyMaterials = {
  still: string | null;
  video: string | null;
  color: ColorPack | null;
  colorIdeas: ColorPack | null;
  ideas: { id: IdeaPack; url: string }[];
};

export function emptyWorkspace(): GenerationWorkspace {
  return {
    version: 1,
    color: "signal-black",
    ajustes: { ...AJUSTES_PACK },
    ideas: null,
    pending: null,
    result: null,
  };
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validColor(value: unknown): value is ColorPack {
  return COLORES_PACK.some((color) => color.id === value);
}

function validIdea(value: unknown): value is IdeaPack {
  return IDEAS_PACK.some((idea) => idea.id === value);
}

function validAspect(value: unknown): value is RelacionPack {
  return RELACIONES_PACK.some((aspect) => aspect.id === value);
}

export function validMediaUrl(value: unknown, image = false): value is string {
  if (typeof value !== "string" || value.length === 0 || value.length > 6_000_000) return false;
  if (image && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value))
    return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** Legacy state may only reference the app's existing generated-media directory. */
export function validLegacyMediaUrl(value: unknown, video = false): value is string {
  if (typeof value !== "string" || value.length > 500) return false;
  const pattern = video
    ? /^\/ugc\/salida\/[A-Za-z0-9][A-Za-z0-9_-]*\.mp4(?:\?v=\d+)?$/
    : /^\/ugc\/salida\/[A-Za-z0-9][A-Za-z0-9_-]*\.(?:jpg|jpeg|png|webp)(?:\?v=\d+)?$/;
  return pattern.test(value);
}

export function readLegacyMaterials(value: unknown): LegacyMaterials | null {
  if (!record(value)) return null;
  const seen = new Set<IdeaPack>();
  const ideas: LegacyMaterials["ideas"] = [];
  if (Array.isArray(value.ideas)) {
    for (const item of value.ideas.slice(0, IDEAS_PACK.length)) {
      if (
        !record(item) ||
        !validIdea(item.id) ||
        seen.has(item.id) ||
        !validLegacyMediaUrl(item.url)
      )
        continue;
      seen.add(item.id);
      ideas.push({ id: item.id, url: item.url });
    }
  }
  const materials: LegacyMaterials = {
    still: validLegacyMediaUrl(value.still) ? value.still : null,
    video: validLegacyMediaUrl(value.video, true) ? value.video : null,
    color: validColor(value.color) ? value.color : null,
    colorIdeas: validColor(value.colorIdeas) ? value.colorIdeas : null,
    ideas,
  };
  return materials.still || materials.video || materials.ideas.length ? materials : null;
}

export function canShowLegacy(workspace: GenerationWorkspace): boolean {
  return (
    !workspace.pending &&
    !workspace.result &&
    !workspace.ideas?.items.some((item) => Boolean(item.url))
  );
}

function validSettings(value: unknown): value is AjustesPack {
  return (
    record(value) &&
    Number.isInteger(value.duration) &&
    Number(value.duration) >= DURACION_PACK.min &&
    Number(value.duration) <= DURACION_PACK.max &&
    validAspect(value.aspectRatio) &&
    CALIDADES_PACK.some((quality) => quality.id === value.resolution)
  );
}

function validTimestamp(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= Date.now() + 60_000
  );
}

function validJob(value: unknown): value is VideoJob {
  return (
    record(value) &&
    typeof value.requestId === "string" &&
    /^[\w-]{8,200}$/.test(value.requestId) &&
    validColor(value.color) &&
    validIdea(value.idea) &&
    validMediaUrl(value.still, true) &&
    validSettings(value.ajustes) &&
    validTimestamp(value.createdAt) &&
    validTimestamp(value.trackingStartedAt) &&
    typeof value.paused === "boolean"
  );
}

function validResult(value: unknown): value is VideoResult {
  return (
    record(value) &&
    validMediaUrl(value.videoUrl) &&
    validTimestamp(value.completedAt) &&
    validJob(value)
  );
}

function validIdeas(value: unknown): value is IdeasSnapshot {
  if (
    !record(value) ||
    !validColor(value.color) ||
    !validAspect(value.aspectRatio) ||
    !Array.isArray(value.items) ||
    value.items.length > IDEAS_PACK.length
  )
    return false;
  const seen = new Set<string>();
  return value.items.every((item: unknown) => {
    if (!record(item) || !validIdea(item.id) || seen.has(item.id)) return false;
    seen.add(item.id);
    return (
      (item.url === null || validMediaUrl(item.url, true)) &&
      (item.error === undefined || (typeof item.error === "string" && item.error.length <= 1000))
    );
  });
}

/** Invalid or old storage is ignored as a whole, never silently associated with another product. */
export function decodeWorkspace(serialized: string | null): GenerationWorkspace | null {
  if (!serialized || serialized.length > 8_000_000) return null;
  try {
    const value: unknown = JSON.parse(serialized);
    if (
      !record(value) ||
      value.version !== 1 ||
      !validColor(value.color) ||
      !validSettings(value.ajustes)
    )
      return null;
    if (value.ideas !== null && !validIdeas(value.ideas)) return null;
    if (value.pending !== null && !validJob(value.pending)) return null;
    if (value.result !== null && !validResult(value.result)) return null;
    return value as GenerationWorkspace;
  } catch {
    return null;
  }
}

export function ideasMatch(
  snapshot: IdeasSnapshot | null,
  color: ColorPack,
  aspectRatio: RelacionPack,
): boolean {
  return snapshot?.color === color && snapshot.aspectRatio === aspectRatio;
}

/** Only merge successful prior variants from the exact same color and framing. */
export function mergeIdeas(previous: IdeasSnapshot | null, incoming: IdeasSnapshot): IdeasSnapshot {
  const prior = ideasMatch(previous, incoming.color, incoming.aspectRatio)
    ? (previous?.items ?? [])
    : [];
  const items = IDEAS_PACK.flatMap(({ id }) => {
    const fresh = incoming.items.find((item) => item.id === id);
    const old = prior.find((item) => item.id === id);
    const item = fresh?.url ? fresh : old?.url ? old : (fresh ?? old);
    return item ? [item] : [];
  });
  return { ...incoming, items };
}

export function missingIdeas(snapshot: IdeasSnapshot | null): IdeaPack[] {
  return IDEAS_PACK.filter(
    ({ id }) => !snapshot?.items.some((item) => item.id === id && item.url),
  ).map(({ id }) => id);
}

export function loadWorkspace(storage: Pick<Storage, "getItem">): GenerationWorkspace | null {
  try {
    return decodeWorkspace(storage.getItem(WORKSPACE_KEY));
  } catch {
    return null;
  }
}

export function saveWorkspace(
  storage: Pick<Storage, "setItem">,
  workspace: GenerationWorkspace,
): boolean {
  try {
    storage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
    return true;
  } catch {
    return false;
  }
}
