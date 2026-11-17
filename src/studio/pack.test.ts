import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { armarIdeas, armarPack, estadoPackDisco } from "./pack.ts";
import { FOTOS_EMPACADAS } from "./fotos-empacadas.ts";

const originalKey = process.env.XAI_API_KEY;
let clock = Date.now();
beforeEach(() => {
  clock += 10_000;
  mock.method(Date, "now", () => clock);
  process.env.XAI_API_KEY = "test-key-not-a-real-credential";
});
afterEach(() => {
  mock.restoreAll();
  if (originalKey === undefined) delete process.env.XAI_API_KEY;
  else process.env.XAI_API_KEY = originalKey;
});

const selected = "https://media.example.com/chosen-idea.jpg";
const pedido = {
  idea: "manos",
  still: selected,
  duration: 8,
  aspectRatio: "3:4",
  resolution: "720p",
} as const;

test("image ideas use exactly the documented JSON edit schema and requested color/aspect", async () => {
  const fetch = mock.method(globalThis, "fetch", async (url: unknown, init?: RequestInit) => {
    assert.equal(String(url), "https://api.x.ai/v1/images/edits");
    assert.equal(init?.method, "POST");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "grok-imagine-image-2.0");
    assert.equal(body.aspect_ratio, "3:4");
    assert.equal(body.n, 1);
    assert.equal(body.quality, "medium");
    assert.equal(body.resolution, "1k");
    assert.equal(body.images.length, 5);
    assert.equal(
      body.images.every(
        (image: { type?: string; url?: string }) =>
          image.type === "image_url" && image.url?.startsWith("data:image/"),
      ),
      true,
    );
    assert.equal(body.images.at(-1).url === FOTOS_EMPACADAS["ugc/producto/03_burgundy.jpg"], true);
    assert.equal("image" in body, false);
    assert.equal(typeof body.prompt, "string");
    return new Response(JSON.stringify({ data: [{ url: "https://media.example.com/idea.jpg" }] }));
  });
  const result = await armarIdeas("burgundy", "3:4", ["probar"]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.color, "burgundy");
    assert.equal(result.aspectRatio, "3:4");
    assert.equal(result.ideas[0].url, "https://media.example.com/idea.jpg");
  }
  assert.equal(fetch.mock.callCount(), 1);
});

test("partial idea failure keeps completed images and never tries speculative payloads", async () => {
  const fetch = mock.method(globalThis, "fetch", async () =>
    fetch.mock.callCount() === 1
      ? new Response(
          JSON.stringify({ error: { code: "invalid_argument", message: "Reference rejected" } }),
          { status: 400 },
        )
      : new Response(JSON.stringify({ data: [{ url: "https://media.example.com/idea.jpg" }] })),
  );
  const result = await armarIdeas("white", "1:1", ["probar", "detalle"]);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.ideas.length, 2);
    assert.equal(result.ideas.filter(({ url }) => url).length, 1);
    assert.match(result.ideas.find(({ error }) => error)?.error ?? "", /invalid_argument/);
  }
  assert.equal(fetch.mock.callCount(), 2);
});

test("a normal ideas batch creates at most four images", async () => {
  const fetch = mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(JSON.stringify({ data: [{ url: "https://media.example.com/idea.jpg" }] })),
  );
  const result = await armarIdeas("lilac", "9:16");
  assert.equal(result.ok && result.ideas.length, 4);
  assert.equal(fetch.mock.callCount(), 4);
});

test("video uses the chosen idea as first frame, seven references and silent audio", async () => {
  const fetch = mock.method(globalThis, "fetch", async (url: unknown, init?: RequestInit) => {
    assert.equal(String(url), "https://api.x.ai/v1/videos/generations");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.model, "grok-imagine-video-1.5");
    assert.deepEqual(body.image, { url: selected });
    assert.equal(body.reference_images.length, 7);
    assert.equal(
      body.reference_images.at(-1).url === FOTOS_EMPACADAS["ugc/producto/02_royal_blue.jpg"],
      true,
    );
    assert.equal(
      body.reference_images.every(
        (image: { url?: string; data_uri?: string }) =>
          typeof image.url === "string" && image.data_uri === undefined,
      ),
      true,
    );
    assert.equal(body.generate_audio, false);
    assert.equal(body.duration, 8);
    assert.equal(body.aspect_ratio, "3:4");
    assert.equal(body.resolution, "720p");
    assert.match(body.prompt, /<IMAGE_0> as the exact first frame/);
    assert.match(body.prompt, /<IMAGE_7>/);
    return new Response(JSON.stringify({ request_id: "request_1234" }));
  });
  const result = await armarPack("royal-blue", pedido);
  assert.deepEqual(result, {
    ok: true,
    requestId: "request_1234",
    color: "royal-blue",
    idea: "manos",
    still: selected,
    ajustes: { duration: 8, aspectRatio: "3:4", resolution: "720p" },
  });
  assert.equal(fetch.mock.callCount(), 1);
});

test("video rejection is returned once without fallback request shapes", async () => {
  const fetch = mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        JSON.stringify({ error: { code: "invalid_argument", message: "Not accepted" } }),
        { status: 400 },
      ),
  );
  const result = await armarPack("signal-black", pedido);
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /invalid_argument/);
  assert.equal(fetch.mock.callCount(), 1);
});

test("invalid selections and absent API key do not start generation", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response("{}"));
  assert.equal((await armarPack("signal-black", { ...pedido, still: "" })).ok, false);
  assert.equal((await armarIdeas("other-color", "9:16")).ok, false);
  assert.equal((await armarIdeas("white", "wrong-aspect")).ok, false);
  delete process.env.XAI_API_KEY;
  assert.equal((await armarPack("white", pedido)).ok, false);
  assert.equal(estadoPackDisco().available, false);
  assert.equal(fetch.mock.callCount(), 0);
});
