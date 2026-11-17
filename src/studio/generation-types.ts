import type { AjustesPack, ColorPack, IdeaPack, RelacionPack } from "./pack-meta.ts";

export type GenerationError = { ok: false; error: string; retryable?: boolean };
export type IdeaHecha = { id: IdeaPack; url: string | null; error?: string };
export type StartIdeasInput = { color: ColorPack; aspectRatio: RelacionPack; solo?: IdeaPack[] };
export type IdeasResult =
  { ok: true; color: ColorPack; aspectRatio: RelacionPack; ideas: IdeaHecha[] } | GenerationError;
export type StartPackInput = AjustesPack & { color: ColorPack; idea: IdeaPack; still: string };
export type StartPackResult =
  | {
      ok: true;
      requestId: string;
      color: ColorPack;
      idea: IdeaPack;
      still: string;
      ajustes: AjustesPack;
    }
  | GenerationError;
export type PollResult =
  | { ok: true; status: "pending" }
  | { ok: true; status: "done"; videoUrl: string }
  | GenerationError;
export type EstadoPack = {
  available: boolean;
  still: string | null;
  video: string | null;
  color: string | null;
  ideas: { id: string; url: string }[];
  colorIdeas: string | null;
};
