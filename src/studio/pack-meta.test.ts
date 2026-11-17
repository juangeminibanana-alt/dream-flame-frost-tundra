import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AJUSTES_PACK,
  ajustesPack,
  COLORES_PACK,
  IDEAS_PACK,
  promptIdea,
  promptVideo,
  refsIdea,
  relacionPack,
  type AjustesPack,
} from "./pack-meta.ts";

describe("ajustes de generación", () => {
  it("solo aplica valores predeterminados a los campos ausentes", () => {
    assert.deepEqual(ajustesPack(undefined), AJUSTES_PACK);
    assert.deepEqual(ajustesPack({ duration: 15 }), { ...AJUSTES_PACK, duration: 15 });
    assert.equal(relacionPack("5:2"), "5:2");
    for (const duration of [0, 16, 1.5, NaN, Infinity, "10", null]) {
      assert.throws(() => ajustesPack({ duration } as AjustesPack), /duración/);
    }
    assert.throws(() => ajustesPack({ resolution: "1080p" } as unknown as AjustesPack), /720p/);
    assert.throws(() => relacionPack("panorama"), /relación/);
    assert.throws(() => relacionPack(null), /relación/);
  });
});

describe("referencias de producto e imagen inicial", () => {
  it("mantiene hasta cinco fotos por idea con el producto elegido", () => {
    for (const color of COLORES_PACK) {
      for (const idea of IDEAS_PACK) {
        const refs = refsIdea(idea.id, color.archivo);
        assert.ok(refs.length <= 5);
        assert.ok(refs.includes(color.archivo));
        assert.match(promptIdea(idea.id, color.id), new RegExp(color.en));
      }
    }
  });

  it("reserva IMAGE_0 a la foto elegida y desplaza las siete referencias", () => {
    const prompt = promptVideo(
      "royal-blue",
      { duration: 6, aspectRatio: "3:4", resolution: "720p" },
      "detalle",
      true,
    );
    assert.match(prompt, /<IMAGE_0> as the exact first frame/);
    assert.match(prompt, /<IMAGE_1> is the front face/);
    assert.match(prompt, /garment from <IMAGE_7>/);
    assert.match(prompt, /6 seconds, framed 3:4/);
    assert.doesNotMatch(prompt, /<IMAGE_8>/);
    assert.doesNotMatch(prompt, /<IMAGE_0> is the front face/);
  });

  it("conserva el contrato de referencias para la ruta sin fotograma inicial", () => {
    const prompt = promptVideo("signal-black");
    assert.match(prompt, /<IMAGE_0> is the front face/);
    assert.match(prompt, /garment from <IMAGE_6>/);
  });

  it("no exige vestir la prenda en ideas de manos, unboxing o detalle", () => {
    for (const idea of ["manos", "unboxing", "detalle"] as const) {
      const prompt = promptVideo("signal-black", AJUSTES_PACK, idea);
      assert.doesNotMatch(prompt, /wearing the sweatshirt|Sleeves stay down/);
      assert.match(prompt, /separate sweatshirt/);
    }
    assert.match(promptVideo("signal-black"), /wearing the sweatshirt/);
  });
});
