import {
  ajustesPack,
  colorPack,
  ideaPack,
  relacionPack,
  type AjustesPack,
  type IdeaPack,
} from "./pack-meta.ts";
import type { StartIdeasInput, StartPackInput } from "./generation-types.ts";
import { imageSource, record, requestId } from "./xai.server.ts";

export function legacyStill(value: unknown): string | null {
  return typeof value === "string" &&
    /^\/ugc\/salida\/[\w-]+\.(?:jpg|jpeg|png|webp)(?:\?v=\d+)?$/.test(value)
    ? value
    : null;
}

export function validateIdeas(input: unknown): StartIdeasInput {
  const body = record(input);
  const color = typeof body?.color === "string" ? colorPack(body.color) : null;
  if (!color) throw new Error("Ese color no está en la pieza.");
  let solo: IdeaPack[] | undefined;
  if (body?.solo !== undefined) {
    if (!Array.isArray(body.solo) || body.solo.length < 1 || body.solo.length > 4)
      throw new Error("Elige entre una y cuatro ideas.");
    solo = body.solo.map((id) => {
      const idea = typeof id === "string" ? ideaPack(id) : null;
      if (!idea) throw new Error("Esa idea no está disponible.");
      return idea.id;
    });
    if (new Set(solo).size !== solo.length)
      throw new Error("No repitas una idea en la misma generación.");
  }
  return {
    color: color.id,
    aspectRatio: relacionPack(body?.aspectRatio),
    ...(solo ? { solo } : {}),
  };
}

export function validatePack(input: unknown): StartPackInput {
  const body = record(input);
  const color = typeof body?.color === "string" ? colorPack(body.color) : null;
  if (!color) throw new Error("Ese color no está en la pieza.");
  const idea = typeof body?.idea === "string" ? ideaPack(body.idea) : null;
  if (!idea) throw new Error("Elige una de las ideas antes de generar el video.");
  const still = imageSource(body?.still) ?? legacyStill(body?.still);
  if (!still) throw new Error("Selecciona una foto válida de la idea para animarla.");
  return { color: color.id, idea: idea.id, still, ...ajustesPack(body as Partial<AjustesPack>) };
}

export function validatePoll(input: unknown): { requestId: string } {
  const id = requestId(record(input)?.requestId);
  if (!id) throw new Error("Folio de video inválido.");
  return { requestId: id };
}

export function validateHold(input: unknown): { name: string; vibe: string; fondo: string } {
  const body = record(input);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (name.length < 2 || name.length > 80)
    throw new Error("Escribe un nombre de producto de 2 a 80 caracteres.");
  for (const [field, max] of [
    ["vibe", 240],
    ["fondo", 80],
  ] as const) {
    if (
      body?.[field] !== undefined &&
      (typeof body[field] !== "string" || (body[field] as string).length > max)
    )
      throw new Error("La descripción del producto o del fondo no es válida.");
  }
  return {
    name,
    vibe: typeof body?.vibe === "string" ? body.vibe.trim() : "",
    fondo: typeof body?.fondo === "string" && body.fondo.trim() ? body.fondo.trim() : "Negro mate",
  };
}
