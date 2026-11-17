import type { GenerationError, PollResult } from "./generation-types.ts";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function generationAvailable(): boolean {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

export function httpsMediaUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 8192) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.hostname
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function imageMime(bytes: Buffer): string | null {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP")
    return "image/webp";
  return null;
}

export function inlineImage(base64: unknown): string | null {
  if (typeof base64 !== "string" || !base64 || base64.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4)
    return null;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 === 1) return null;
  const bytes = Buffer.from(base64, "base64");
  if (bytes.toString("base64").replace(/=+$/, "") !== base64.replace(/=+$/, "")) return null;
  const mime = imageMime(bytes);
  return mime ? `data:${mime};base64,${bytes.toString("base64")}` : null;
}

export function imageSource(value: unknown): string | null {
  const remote = httpsMediaUrl(value);
  if (remote) return remote;
  if (typeof value !== "string" || value.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 40)
    return null;
  const match = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  return match ? inlineImage(match[1]) : null;
}

export function requestId(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8,128}$/.test(value) ? value : null;
}

function safeDetail(value: unknown): string {
  if (typeof value !== "string") return "";
  const key = process.env.XAI_API_KEY;
  return (key ? value.split(key).join("[credencial]") : value)
    .replace(/Bearer\s+\S+/gi, "Bearer [credencial]")
    .replace(/data:[^\s"']+/gi, "[imagen]")
    .replace(/https?:\/\/[^\s"']+/gi, "[archivo]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

export function providerError(body: unknown, fallback: string): string {
  const root = record(body);
  const error = record(root?.error);
  const message = safeDetail(
    error?.message ?? (typeof root?.error === "string" ? root.error : root?.message),
  );
  const code =
    typeof error?.code === "string" && /^[\w-]{1,64}$/.test(error.code) ? error.code : "";
  return message ? `${fallback} ${code ? `[${code}] ` : ""}${message}` : fallback;
}

type RequestResult = { ok: true; body: Record<string, unknown> } | GenerationError;
type RequestOptions = { method?: "GET" | "POST"; body?: unknown; timeoutMs?: number };

// One HTTP attempt only: a timed-out POST may already have created a billable job.
export async function requestXai(
  path: string,
  options: RequestOptions = {},
): Promise<RequestResult> {
  const apiKey = process.env.XAI_API_KEY?.trim();
  if (!apiKey)
    return {
      ok: false,
      error: "La generación no está disponible en este entorno.",
      retryable: false,
    };
  const method = options.method ?? "GET";
  const signal = AbortSignal.timeout(options.timeoutMs ?? (method === "GET" ? 20_000 : 120_000));
  try {
    const response = await fetch(`https://api.x.ai/v1${path}`, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
      signal,
    });
    let body: unknown;
    try {
      body = JSON.parse(await response.text());
    } catch {
      return {
        ok: false,
        error: `Grok devolvió una respuesta ilegible (${response.status}).`,
        retryable: method === "GET",
      };
    }
    if (!response.ok) {
      const defaults: Record<number, string> = {
        401: "Grok no aceptó la credencial del servidor.",
        402: "La cuenta de Grok no tiene saldo disponible.",
        403: "La cuenta no tiene acceso a esta operación de Grok.",
        429: "Grok alcanzó su límite de solicitudes. Espera antes de continuar.",
      };
      return {
        ok: false,
        error: providerError(
          body,
          defaults[response.status] ?? `Grok no completó la solicitud (${response.status}).`,
        ),
        retryable:
          method === "GET" &&
          (response.status === 408 || response.status === 429 || response.status >= 500),
      };
    }
    const result = record(body);
    return result
      ? { ok: true, body: result }
      : {
          ok: false,
          error: "Grok devolvió una respuesta sin datos válidos.",
          retryable: method === "GET",
        };
  } catch {
    return {
      ok: false,
      error: signal.aborted
        ? method === "GET"
          ? "La consulta tardó demasiado. Puedes volver a revisar el mismo video."
          : "Grok tardó demasiado en responder. No se reenviará la generación automáticamente."
        : method === "GET"
          ? "No pude conectar con Grok. Puedes volver a revisar el mismo video."
          : "Se interrumpió la conexión con Grok. No se reenviará la generación automáticamente.",
      retryable: method === "GET",
    };
  }
}

export function generatedImage(body: Record<string, unknown>): string | null {
  const first = Array.isArray(body.data) ? record(body.data[0]) : null;
  return httpsMediaUrl(first?.url) ?? inlineImage(first?.b64_json);
}

export async function pollVideo(id: string): Promise<PollResult> {
  const validId = requestId(id);
  if (!validId) return { ok: false, error: "Folio de video inválido.", retryable: false };
  const result = await requestXai(`/videos/${encodeURIComponent(validId)}`);
  if (!result.ok) return result;
  if (result.body.status === "pending") return { ok: true, status: "pending" };
  if (result.body.status === "done") {
    const videoUrl = httpsMediaUrl(record(result.body.video)?.url);
    return videoUrl
      ? { ok: true, status: "done", videoUrl }
      : {
          ok: false,
          error: "Grok terminó el trabajo pero no devolvió un archivo de video válido.",
          retryable: false,
        };
  }
  if (result.body.status === "failed" || result.body.status === "expired")
    return {
      ok: false,
      error: providerError(result.body, "El video no se pudo generar."),
      retryable: false,
    };
  return { ok: false, error: "Grok devolvió un estado de video desconocido.", retryable: true };
}

// Per-process burst protection only, not a distributed user quota. Polling is never gated.
export function createGenerationGate(cooldownMs = 5_000, now: () => number = () => Date.now()) {
  const slots = new Map<string, { busy: boolean; next: number }>();
  return async <T>(
    kind: "ideas" | "video",
    work: () => Promise<T>,
  ): Promise<T | GenerationError> => {
    const slot = slots.get(kind) ?? { busy: false, next: 0 };
    if (slot.busy || now() < slot.next)
      return {
        ok: false,
        error:
          "Ya hay una generación en curso o acabas de enviarla. Espera unos segundos antes de volver a intentarlo.",
        retryable: true,
      };
    slot.busy = true;
    slot.next = now() + cooldownMs;
    slots.set(kind, slot);
    try {
      return await work();
    } finally {
      slot.busy = false;
    }
  };
}

export const withGenerationGate = createGenerationGate();
