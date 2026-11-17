import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { ajustesPack, colorPack, ideaPack, promptIdea, promptVideo, refsIdea, type AjustesPack, type ColorPack, type IdeaPack } from "./pack-meta.ts";
import { FOTOS_EMPACADAS } from "./fotos-empacadas.ts";

const VIDEO_MODEL = "grok-imagine-video-1.5";
const IMAGE_MODEL = "grok-imagine-image-2.0";
const RELACIONES_VALIDAS = new Set(["9:16", "3:4", "2:3", "1:1", "4:3", "3:2", "16:9", "21:9", "5:2"]);
const execFileAsync = promisify(execFile);

type StartResult =
  | { ok: true; requestId: string; color: ColorPack; still?: string }
  | { ok: false; error: string; still?: string };

type PollResult =
  | { ok: true; status: "pending" }
  | { ok: true; status: "done"; videoUrl: string }
  | { ok: false; error: string };

export type EstadoPack = {
  still: string | null;
  video: string | null;
  color: string | null;
  ideas: { id: string; url: string }[];
  colorIdeas: string | null;
};

export type IdeaHecha = { id: IdeaPack; url: string | null; error?: string };

function raizPublica(): string {
  const local = join(process.cwd(), "public", "ugc");
  if (existsSync(local)) return join(process.cwd(), "public");
  return "/workspace/public";
}

function dirSalida(): string {
  const dir = join(raizPublica(), "ugc", "salida");
  mkdirSync(dir, { recursive: true });
  return dir;
}

function leerFoto(rel: string): string {
  const empacada = FOTOS_EMPACADAS[rel];
  if (empacada) return empacada;
  const rutas = [join(process.cwd(), "public", rel), join("/workspace/public", rel)];
  for (const ruta of rutas) {
    if (!existsSync(ruta)) continue;
    const buf = readFileSync(ruta);
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  }
  throw new Error("No encuentro las fotos del avatar o de la habitación.");
}

async function xai(path: string, body: unknown): Promise<Response> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("La generación no está disponible.");
  return fetch(`https://api.x.ai/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
}

async function guardarLocal(buf: Buffer, nombre: string): Promise<string | null> {
  try {
    const ruta = join(dirSalida(), nombre);
    writeFileSync(ruta, buf);
    return `/ugc/salida/${nombre}?v=${Math.floor(statSync(ruta).mtimeMs)}`;
  } catch {
    return null;
  }
}

async function guardarRemoto(url: string, nombre: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return guardarLocal(buf, nombre);
  } catch {
    return null;
  }
}

function extraerImagen(body: { url?: string; data?: { url?: string; b64_json?: string }[] }): string {
  const dato = body.data?.[0];
  if (dato?.url) return dato.url;
  if (body.url) return body.url;
  if (dato?.b64_json) return `data:image/jpeg;base64,${dato.b64_json}`;
  throw new Error("La idea no devolvió imagen.");
}

async function editarImagen(prompt: string, rels: string[], aspect: string): Promise<string> {
  const urls = rels.map((rel) => leerFoto(rel));
  const objetos = urls.map((url) => ({ type: "image_url", url }));
  const intentos: unknown[] = [
    { model: IMAGE_MODEL, prompt, images: objetos, aspect_ratio: aspect, response_format: "url", n: 1 },
    { model: IMAGE_MODEL, prompt: { text: prompt, images: urls }, aspect_ratio: aspect, response_format: "url" },
    { model: IMAGE_MODEL, prompt, image: objetos[0], images: objetos.slice(1), aspect_ratio: aspect, response_format: "url" },
  ];
  let ultimo = "La idea no aceptó las fotos.";
  for (const cuerpo of intentos) {
    const res = await xai("/images/edits", cuerpo);
    if (res.status === 400 || res.status === 422) {
      ultimo = (await res.text().catch(() => "")).slice(0, 180) || ultimo;
      continue;
    }
    if (!res.ok) throw new Error(`La idea falló (${res.status}).`);
    return extraerImagen((await res.json()) as { url?: string; data?: { url?: string; b64_json?: string }[] });
  }
  throw new Error(ultimo);
}

export async function armarIdeas(
  colorId: string,
  aspectRatio: string,
  solo?: IdeaPack[],
): Promise<{ ok: true; color: ColorPack; ideas: IdeaHecha[] } | { ok: false; error: string }> {
  const color = colorPack(colorId);
  if (!color) return { ok: false, error: "Ese color no está en la pieza." };
  if (!process.env.XAI_API_KEY) return { ok: false, error: "La generación no está disponible." };
  const aspect = RELACIONES_VALIDAS.has(aspectRatio) ? aspectRatio : "9:16";
  const pedidos = (["probar", "manos", "unboxing", "detalle"] as const).filter((id) => !solo || solo.includes(id));
  const ideas = await Promise.all(
    pedidos.map(async (id): Promise<IdeaHecha> => {
      try {
        const remoto = await editarImagen(promptIdea(id, color.id), refsIdea(id, color.archivo), aspect);
        const local = remoto.startsWith("data:")
          ? await guardarLocal(Buffer.from(remoto.split(",")[1] ?? "", "base64"), `idea-${id}.jpg`)
          : await guardarRemoto(remoto, `idea-${id}.jpg`);
        return { id, url: local ?? (remoto.startsWith("data:") ? null : remoto) };
      } catch (err) {
        return { id, url: null, error: err instanceof Error ? err.message : "La idea no salió." };
      }
    }),
  );
  const listas = ideas.filter((i): i is IdeaHecha & { url: string } => Boolean(i.url));
  if (listas.length === 0) return { ok: false, error: ideas.find((i) => i.error)?.error ?? "No salió ninguna idea." };
  try {
    const ruta = join(dirSalida(), "ideas.json");
    let previas: { id: string; url: string }[] = [];
    if (existsSync(ruta)) {
      const previo = JSON.parse(readFileSync(ruta, "utf8")) as { ideas?: { id?: string; url?: string }[] };
      previas = (previo.ideas ?? [])
        .filter((i): i is { id: string; url: string } => Boolean(i.id && i.url && !listas.some((n) => n.id === i.id)));
    }
    writeFileSync(
      ruta,
      JSON.stringify({ color: color.id, ideas: [...previas, ...listas.map((i) => ({ id: i.id, url: i.url }))] }),
    );
  } catch {
    /* el disco de producción puede ser de solo lectura */
  }
  return { ok: true, color: color.id, ideas };
}

function escribirMeta(color: string, patch: { still?: string; video?: string }): void {
  const ruta = join(dirSalida(), "hero.json");
  let previo: { color?: string; still?: string; video?: string } = {};
  try {
    previo = JSON.parse(readFileSync(ruta, "utf8")) as typeof previo;
  } catch {
    previo = {};
  }
  writeFileSync(ruta, JSON.stringify({ ...previo, color, ...patch }));
}

export async function armarPack(id: string, pedido?: Partial<AjustesPack> & { idea?: string }): Promise<StartResult> {
  const color = colorPack(id);
  if (!color) return { ok: false, error: "Ese color no está en la pieza." };
  if (!process.env.XAI_API_KEY) return { ok: false, error: "La generación no está disponible." };
  const ajustes = ajustesPack(pedido);
  const idea = ideaPack(pedido?.idea ?? "")?.id ?? "probar";

  let referencias: { url: string }[];
  try {
    referencias = [
      "ugc/avatar/01_rostro.jpg",
      "ugc/avatar/02_frente.jpg",
      "ugc/avatar/03_espalda.jpg",
      "ugc/avatar/04_perfil_derecho.jpg",
      "ugc/avatar/05_perfil_izquierdo.jpg",
      "ugc/habitacion/01_habitacion.jpg",
      color.archivo,
    ].map((rel) => ({ url: leerFoto(rel) }));
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "No encuentro las fotos." };
  }

  const cuerpo = {
    model: VIDEO_MODEL,
    prompt: promptVideo(color.id, ajustes, idea),
    duration: ajustes.duration,
    aspect_ratio: ajustes.aspectRatio,
    resolution: ajustes.resolution,
  };
  let videoRes = await xai("/videos/generations", { ...cuerpo, reference_images: referencias });
  if (videoRes.status === 400) {
    const detalle = await videoRes.text().catch(() => "");
    console.error("r2v", detalle.slice(0, 500));
    videoRes = await xai("/videos/generations", {
      ...cuerpo,
      reference_images: referencias.map((r) => ({ data_uri: r.url })),
    });
  }
  if (!videoRes.ok) {
    const detalle = await videoRes.text().catch(() => "");
    console.error("video", videoRes.status, detalle.slice(0, 400));
    return { ok: false, error: `El video falló (${videoRes.status}).` };
  }
  const videoBody = (await videoRes.json()) as { request_id?: string };
  if (!videoBody.request_id) return { ok: false, error: "El video no dio folio." };
  try {
    escribirMeta(color.id, {});
  } catch {
    /* el disco de producción puede ser de solo lectura */
  }
  return { ok: true, requestId: videoBody.request_id, color: color.id };
}

export async function revisarPack(requestId: string): Promise<PollResult> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false, error: "La generación no está disponible." };
  const res = await fetch(`https://api.x.ai/v1/videos/${requestId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) return { ok: false, error: `No pude revisar el video (${res.status}).` };
  const body = (await res.json()) as {
    status?: string;
    video?: { url?: string };
    error?: string;
  };
  if (body.status === "done" && body.video?.url) {
    const local = await guardarRemoto(body.video.url, "hero.mp4");
    if (local) {
      const poster = join(dirSalida(), "hero.jpg");
      try {
        await execFileAsync("ffmpeg", ["-y", "-ss", "1", "-i", join(dirSalida(), "hero.mp4"), "-frames:v", "1", "-update", "1", poster], {
          timeout: 20_000,
        });
      } catch {
        /* el video igual se puede ver sin poster */
      }
      try {
        const metaRuta = join(dirSalida(), "hero.json");
        const previo = existsSync(metaRuta)
          ? (JSON.parse(readFileSync(metaRuta, "utf8")) as { color?: string })
          : {};
        escribirMeta(previo.color ?? "signal-black", {
          video: local,
          still: existsSync(poster) ? `/ugc/salida/hero.jpg?v=${Math.floor(statSync(poster).mtimeMs)}` : undefined,
        });
      } catch {
        /* sigue valiendo la url local */
      }
    }
    return { ok: true, status: "done", videoUrl: local ?? body.video.url };
  }
  if (body.status === "failed" || body.status === "expired") {
    return { ok: false, error: "El video no se armó." };
  }
  return { ok: true, status: "pending" };
}

export function estadoPackDisco(): EstadoPack {
  const vacio: EstadoPack = { still: null, video: null, color: null, ideas: [], colorIdeas: null };
  try {
    const sello = (archivo: string): string | null => {
      const disco = join(raizPublica(), "ugc", "salida", archivo);
      if (!existsSync(disco)) return null;
      return `/ugc/salida/${archivo}?v=${Math.floor(statSync(disco).mtimeMs)}`;
    };
    const ideasRuta = join(raizPublica(), "ugc", "salida", "ideas.json");
    let ideas: EstadoPack["ideas"] = [];
    let colorIdeas: string | null = null;
    if (existsSync(ideasRuta)) {
      const meta = JSON.parse(readFileSync(ideasRuta, "utf8")) as { color?: string; ideas?: { id?: string; url?: string }[] };
      colorIdeas = meta.color ?? null;
      ideas = (meta.ideas ?? [])
        .map((i) => ({ id: i.id ?? "", url: i.id ? sello(`idea-${i.id}.jpg`) : null }))
        .filter((i): i is { id: string; url: string } => Boolean(i.id && i.url));
    }
    const ruta = join(raizPublica(), "ugc", "salida", "hero.json");
    if (!existsSync(ruta)) return { ...vacio, ideas, colorIdeas };
    const meta = JSON.parse(readFileSync(ruta, "utf8")) as { color?: string; still?: string; video?: string };
    return {
      color: meta.color ?? null,
      still: meta.still ? sello("hero.jpg") : null,
      video: meta.video ? sello("hero.mp4") : null,
      ideas,
      colorIdeas,
    };
  } catch {
    return vacio;
  }
}
