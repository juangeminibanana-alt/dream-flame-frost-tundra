import assert from "node:assert/strict";
import { test } from "node:test";
import {
  legacyStill,
  validateHold,
  validateIdeas,
  validatePack,
  validatePoll,
} from "./generation-input.server.ts";

const pack = {
  color: "burgundy",
  idea: "manos",
  still: "https://media.example.com/selected.jpg",
  duration: 8,
  aspectRatio: "3:4",
  resolution: "720p",
};

test("pack keeps the selected idea, image, color and requested settings", () => {
  assert.deepEqual(validatePack(pack), pack);
  assert.equal(
    validatePack({ ...pack, still: "/ugc/salida/idea-manos.jpg?v=123" }).still,
    "/ugc/salida/idea-manos.jpg?v=123",
  );
});

test("invalid media and explicit invalid generation settings are rejected instead of silently changed", () => {
  for (const patch of [
    { still: "" },
    { still: "javascript:alert(1)" },
    { still: "http://media.example.com/insecure.jpg" },
    { color: "not-a-color" },
    { idea: "not-an-idea" },
    { duration: 16 },
    { duration: 1.5 },
    { duration: "10" },
    { aspectRatio: "100:1" },
    { resolution: "1080p" },
  ])
    assert.throws(() => validatePack({ ...pack, ...patch }));
  assert.equal(legacyStill("/ugc/salida/../../secret.jpg"), null);
  assert.equal(legacyStill("/ugc/salida/idea-manos.jpg?untrusted=1"), null);
});

test("ideas validate the subset and aspect ratio with a four-output cap", () => {
  assert.deepEqual(validateIdeas({ color: "white", aspectRatio: "1:1", solo: ["detalle"] }), {
    color: "white",
    aspectRatio: "1:1",
    solo: ["detalle"],
  });
  for (const solo of [[], ["not-an-idea"], ["manos", "manos"], "manos"])
    assert.throws(() => validateIdeas({ color: "white", solo }));
  assert.throws(() => validateIdeas({ color: "white", aspectRatio: "auto" }));
});

test("poll and legacy hold inputs fail safely for non-string runtime values", () => {
  assert.throws(() => validatePoll({ requestId: 42 }));
  assert.throws(() => validateHold({ name: { trim: "wrong" } }));
  assert.throws(() => validateHold({ name: "Good", vibe: ["bad"] }));
  assert.deepEqual(validateHold({ name: "  Sudadera  " }), {
    name: "Sudadera",
    vibe: "",
    fondo: "Negro mate",
  });
});
