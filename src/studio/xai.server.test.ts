import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import {
  createGenerationGate,
  generatedImage,
  imageSource,
  pollVideo,
  requestXai,
} from "./xai.server.ts";

const originalKey = process.env.XAI_API_KEY;
beforeEach(() => {
  process.env.XAI_API_KEY = "test-key-not-a-real-credential";
});
afterEach(() => {
  mock.restoreAll();
  if (originalKey === undefined) delete process.env.XAI_API_KEY;
  else process.env.XAI_API_KEY = originalKey;
});

function respond(body: unknown, status = 200) {
  return mock.method(
    globalThis,
    "fetch",
    async () => new Response(JSON.stringify(body), { status }),
  );
}

test("polling distinguishes pending, done and malformed done responses", async () => {
  const responses = [
    { status: "pending" },
    { status: "done", video: { url: "https://media.example.com/video.mp4" } },
    { status: "done" },
  ];
  mock.method(globalThis, "fetch", async () => new Response(JSON.stringify(responses.shift())));
  assert.deepEqual(await pollVideo("request_1234"), { ok: true, status: "pending" });
  assert.deepEqual(await pollVideo("request_1234"), {
    ok: true,
    status: "done",
    videoUrl: "https://media.example.com/video.mp4",
  });
  const invalid = await pollVideo("request_1234");
  assert.equal(invalid.ok, false);
  if (!invalid.ok) {
    assert.match(invalid.error, /archivo de video/);
    assert.equal(invalid.retryable, false);
  }
});

test("structured provider errors survive failed jobs without exposing credentials or media URLs", async () => {
  respond({
    status: "failed",
    error: {
      code: "invalid_argument",
      message:
        "Bad input https://media.example.com/private.jpg Bearer test-key-not-a-real-credential",
    },
  });
  const result = await pollVideo("request_1234");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /invalid_argument/);
    assert.doesNotMatch(result.error, /test-key|https:/);
    assert.equal(result.retryable, false);
  }
});

test("transient GET failures can resume the same job; POST is never retried automatically", async () => {
  const fetch = respond({ error: { message: "Busy" } }, 429);
  const poll = await pollVideo("request_1234");
  assert.equal(!poll.ok && poll.retryable, true);
  const start = await requestXai("/videos/generations", {
    method: "POST",
    body: { prompt: "test" },
  });
  assert.equal(!start.ok && start.retryable, false);
  assert.equal(fetch.mock.callCount(), 2);
});

test("network and malformed JSON failures are returned as results", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => {
    throw new TypeError("network");
  });
  const result = await pollVideo("request_1234");
  assert.equal(!result.ok && result.retryable, true);
  fetch.mock.mockImplementation(
    async () => new Response("<html>upstream error</html>", { status: 502 }),
  );
  const malformed = await requestXai("/videos/generations", { method: "POST" });
  assert.equal(!malformed.ok && malformed.retryable, false);
});

test("timeout aborts one request and does not send another POST", async () => {
  const fetch = mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, options?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        const keepAlive = setTimeout(() => reject(new Error("test guard")), 100);
        options?.signal?.addEventListener(
          "abort",
          () => {
            clearTimeout(keepAlive);
            reject(new DOMException("Aborted", "AbortError"));
          },
          { once: true },
        );
      }),
  );
  const result = await requestXai("/videos/generations", { method: "POST", timeoutMs: 5 });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /tardó demasiado/);
    assert.equal(result.retryable, false);
  }
  assert.equal(fetch.mock.callCount(), 1);
});

test("invalid job IDs and absent credentials never send HTTP", async () => {
  const fetch = respond({});
  assert.equal((await pollVideo("../../private")).ok, false);
  delete process.env.XAI_API_KEY;
  assert.equal((await requestXai("/videos/generations", { method: "POST" })).ok, false);
  assert.equal(fetch.mock.callCount(), 0);
});

test("image results preserve valid inline images and reject executable or malformed sources", () => {
  const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]).toString("base64");
  assert.equal(
    generatedImage({ data: [{ b64_json: png }] })?.startsWith("data:image/png;base64,"),
    true,
  );
  assert.equal(imageSource("javascript:alert(1)"), null);
  assert.equal(imageSource("data:image/svg+xml;base64,PHN2Zz4="), null);
  assert.equal(generatedImage({ data: [{ b64_json: "not an image" }] }), null);
});

test("generation gate prevents duplicate work, keeps polling independent and releases on failure", async () => {
  let clock = 1_000;
  const gate = createGenerationGate(100, () => clock);
  let release!: () => void;
  const wait = new Promise<void>((resolve) => {
    release = resolve;
  });
  const first = gate("ideas", async () => {
    await wait;
    return "done";
  });
  const duplicate = await gate("ideas", async () => "should not run");
  assert.equal(typeof duplicate === "object" && !duplicate.ok && duplicate.retryable, true);
  assert.equal(await gate("video", async () => "different slot"), "different slot");
  release();
  assert.equal(await first, "done");
  clock += 101;
  await assert.rejects(
    gate("ideas", async () => {
      throw new Error("failed work");
    }),
    /failed work/,
  );
  clock += 101;
  assert.equal(await gate("ideas", async () => "released"), "released");
});
