import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canShowLegacy,
  decodeWorkspace,
  emptyWorkspace,
  ideasMatch,
  loadWorkspace,
  mergeIdeas,
  missingIdeas,
  readLegacyMaterials,
  saveWorkspace,
  validLegacyMediaUrl,
  validMediaUrl,
  WORKSPACE_KEY,
  type GenerationWorkspace,
  type IdeasSnapshot,
} from "./client-state.ts";

const image = "https://images.example.test/still.jpg";
const snapshot: IdeasSnapshot = {
  color: "signal-black",
  aspectRatio: "9:16",
  items: [
    { id: "probar", url: image },
    { id: "manos", url: null, error: "No salió" },
  ],
};

test("restores a pending request and retains the last completed video's own settings", () => {
  const stored: GenerationWorkspace = {
    ...emptyWorkspace(),
    ideas: snapshot,
    pending: {
      requestId: "request-blue-123",
      color: "royal-blue",
      idea: "manos",
      still: image,
      ajustes: { duration: 15, aspectRatio: "1:1", resolution: "480p" },
      createdAt: 1000,
      trackingStartedAt: 2000,
      paused: true,
    },
    result: {
      requestId: "request-black-123",
      color: "signal-black",
      idea: "probar",
      still: image,
      ajustes: { duration: 10, aspectRatio: "9:16", resolution: "720p" },
      createdAt: 500,
      trackingStartedAt: 500,
      paused: false,
      videoUrl: "https://videos.example.test/result.mp4",
      completedAt: 900,
    },
  };
  assert.deepEqual(decodeWorkspace(JSON.stringify(stored)), stored);
  assert.equal(stored.result?.ajustes.aspectRatio, "9:16");
  assert.equal(stored.pending?.requestId, "request-blue-123");
});

test("rejects corrupt versions, unsupported settings and unsafe cached media", () => {
  assert.equal(decodeWorkspace("broken json"), null);
  assert.equal(decodeWorkspace(JSON.stringify({ ...emptyWorkspace(), version: 0 })), null);
  assert.equal(
    decodeWorkspace(
      JSON.stringify({
        ...emptyWorkspace(),
        ajustes: { duration: 100, aspectRatio: "9:16", resolution: "720p" },
      }),
    ),
    null,
  );
  assert.equal(
    decodeWorkspace(
      JSON.stringify({
        ...emptyWorkspace(),
        ideas: { ...snapshot, items: [{ id: "probar", url: "javascript:alert(1)" }] },
      }),
    ),
    null,
  );
  assert.equal(
    decodeWorkspace(
      JSON.stringify({
        ...emptyWorkspace(),
        ideas: {
          ...snapshot,
          items: [
            { id: "probar", url: image },
            { id: "probar", url: image },
          ],
        },
      }),
    ),
    null,
  );
});

test("retries missing ideas without replacing successful photos with errors", () => {
  assert.deepEqual(missingIdeas(snapshot), ["manos", "unboxing", "detalle"]);
  const merged = mergeIdeas(snapshot, {
    color: "signal-black",
    aspectRatio: "9:16",
    items: [
      { id: "probar", url: null, error: "Red interrumpida" },
      { id: "manos", url: "https://images.example.test/hands.jpg" },
    ],
  });
  assert.equal(merged.items.find((item) => item.id === "probar")?.url, image);
  assert.equal(
    merged.items.find((item) => item.id === "manos")?.url,
    "https://images.example.test/hands.jpg",
  );
  assert.deepEqual(missingIdeas(merged), ["unboxing", "detalle"]);
});

test("never combines ideas across color or aspect ratio", () => {
  assert.equal(ideasMatch(snapshot, "royal-blue", "9:16"), false);
  assert.equal(ideasMatch(snapshot, "signal-black", "1:1"), false);
  for (const incoming of [
    {
      color: "royal-blue" as const,
      aspectRatio: "9:16" as const,
      items: [{ id: "manos" as const, url: image }],
    },
    {
      color: "signal-black" as const,
      aspectRatio: "1:1" as const,
      items: [{ id: "manos" as const, url: image }],
    },
  ]) {
    const merged = mergeIdeas(snapshot, incoming);
    assert.deepEqual(
      merged.items.map((item) => item.id),
      ["manos"],
    );
  }
});

test("storage quota or privacy errors do not crash the generator", () => {
  assert.equal(
    loadWorkspace({
      getItem() {
        throw new Error("Storage blocked");
      },
    }),
    null,
  );
  assert.equal(
    saveWorkspace(
      {
        setItem() {
          throw new Error("Quota exceeded");
        },
      },
      emptyWorkspace(),
    ),
    false,
  );
  let saved = "";
  assert.equal(
    saveWorkspace(
      {
        setItem(key, value) {
          assert.equal(key, WORKSPACE_KEY);
          saved = value;
        },
      },
      emptyWorkspace(),
    ),
    true,
  );
  assert.deepEqual(decodeWorkspace(saved), emptyWorkspace());
});

test("only accepts HTTPS originals or supported inline image data", () => {
  assert.equal(validMediaUrl("https://images.example.test/still.jpg"), true);
  assert.equal(validMediaUrl("https://user:password@images.example.test/still.jpg"), false);
  assert.equal(validMediaUrl("http://127.0.0.1/private"), false);
  assert.equal(validMediaUrl("blob:old-session"), false);
  assert.equal(validMediaUrl("data:image/png;base64,aGVsbG8=", true), true);
  assert.equal(validMediaUrl("data:text/html;base64,aGVsbG8=", true), false);
});

test("restores historical files separately without inventing settings or request IDs", () => {
  const materials = readLegacyMaterials({
    still: "/ugc/salida/hero.jpg?v=123",
    video: "/ugc/salida/hero.mp4?v=124",
    color: "signal-black",
    ideas: [{ id: "manos", url: "/ugc/salida/idea-manos.jpg?v=120" }],
    colorIdeas: "royal-blue",
    duration: 15,
    requestId: "not-a-real-job",
  });
  assert.deepEqual(materials, {
    still: "/ugc/salida/hero.jpg?v=123",
    video: "/ugc/salida/hero.mp4?v=124",
    color: "signal-black",
    ideas: [{ id: "manos", url: "/ugc/salida/idea-manos.jpg?v=120" }],
    colorIdeas: "royal-blue",
  });
  assert.equal(materials && "ajustes" in materials, false);
  assert.equal(materials && "requestId" in materials, false);
});

test("historical state cannot introduce external URLs, traversal or executable sources", () => {
  for (const invalid of [
    "javascript:alert(1)",
    "https://outside.example.test/hero.jpg",
    "//outside.example.test/hero.jpg",
    "/ugc/salida/../private.jpg",
    "/ugc/salida/%2e%2e/private.jpg",
    "/ugc/salida/hero.jpg?next=outside",
    "/ugc/salida/hero.jpg#fragment",
    "/other/hero.jpg",
    "/ugc/salida/hero.svg",
  ])
    assert.equal(validLegacyMediaUrl(invalid), false, invalid);
  assert.equal(validLegacyMediaUrl("/ugc/salida/hero.mp4", true), true);
  assert.equal(validLegacyMediaUrl("/ugc/salida/hero.mp4"), false);
  assert.equal(
    readLegacyMaterials({
      still: "javascript:alert(1)",
      video: "https://outside.example.test/video.mp4",
      ideas: [],
    }),
    null,
  );
});

test("historical materials never replace a local workspace's own media", () => {
  const empty = emptyWorkspace();
  assert.equal(canShowLegacy(empty), true);
  assert.equal(canShowLegacy({ ...empty, color: "royal-blue" }), true);
  assert.equal(canShowLegacy({ ...empty, ideas: snapshot }), false);
  assert.equal(
    canShowLegacy({
      ...empty,
      pending: {
        requestId: "request-blue-123",
        color: "royal-blue",
        idea: "manos",
        still: image,
        ajustes: { duration: 15, aspectRatio: "1:1", resolution: "480p" },
        createdAt: 1000,
        trackingStartedAt: 2000,
        paused: true,
      },
    }),
    false,
  );
  assert.deepEqual(empty, emptyWorkspace());
});
