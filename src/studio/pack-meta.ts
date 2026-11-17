export const COLORES_PACK = [
  { id: "signal-black", etiqueta: "Negro intenso", archivo: "ugc/producto/01_signal_black.jpg", en: "intense signal black", adjetivo: "negra", muestra: true },
  { id: "royal-blue", etiqueta: "Azul royal", archivo: "ugc/producto/02_royal_blue.jpg", en: "royal blue", adjetivo: "azul royal", muestra: false },
  { id: "burgundy", etiqueta: "Borgoña", archivo: "ugc/producto/03_burgundy.jpg", en: "burgundy", adjetivo: "borgoña", muestra: false },
  { id: "white", etiqueta: "Blanco", archivo: "ugc/producto/04_white.jpg", en: "white", adjetivo: "blanca", muestra: false },
  { id: "lilac", etiqueta: "Lila", archivo: "ugc/producto/05_lilac.jpg", en: "lilac", adjetivo: "lila", muestra: false },
] as const;

export type ColorPack = (typeof COLORES_PACK)[number]["id"];

export function colorPack(id: string) {
  return COLORES_PACK.find((c) => c.id === id) ?? null;
}

export function guionPack(id: string): string {
  const color = colorPack(id) ?? COLORES_PACK[0];
  const talla = color.muestra ? " La mía es XL, como a doscientos veintisiete pesos." : " Como a doscientos veintisiete pesos.";
  return `No es hoodie: es sudadera ${color.adjetivo} de cuello Perkins con media cremallera. Corte entallado, tela afelpada.${talla}`;
}

export const IDEAS_PACK = [
  { id: "probar", numero: "01", etiqueta: "Probar la prenda", texto: "La persona lleva el producto y muestra cómo se ve." },
  { id: "manos", numero: "02", etiqueta: "Solo manos", texto: "El producto es protagonista, acompañado por las manos." },
  { id: "unboxing", numero: "03", etiqueta: "Unboxing", texto: "Abrir, descubrir y presentar el producto." },
  { id: "detalle", numero: "04", etiqueta: "Detalles del producto", texto: "Acercamientos para mostrar sus rasgos reales." },
] as const;

export type IdeaPack = (typeof IDEAS_PACK)[number]["id"];

export function ideaPack(id: string) {
  return IDEAS_PACK.find((i) => i.id === id) ?? null;
}

export function refsIdea(idea: IdeaPack, archivoProducto: string): string[] {
  if (idea === "manos") {
    return ["ugc/habitacion/01_habitacion.jpg", "ugc/avatar/02_frente.jpg", "ugc/avatar/05_perfil_izquierdo.jpg", archivoProducto];
  }
  if (idea === "detalle") {
    return ["ugc/habitacion/01_habitacion.jpg", "ugc/avatar/02_frente.jpg", archivoProducto, "ugc/avatar/01_rostro.jpg"];
  }
  return [
    "ugc/habitacion/01_habitacion.jpg",
    "ugc/avatar/01_rostro.jpg",
    "ugc/avatar/05_perfil_izquierdo.jpg",
    "ugc/avatar/02_frente.jpg",
    archivoProducto,
  ];
}

export function promptIdea(idea: IdeaPack, colorId: string): string {
  const color = colorPack(colorId) ?? COLORES_PACK[0];
  const prenda = `The last garment image is a fitted men's long-sleeve quarter-zip in ${color.en}: short Perkins collar, half zipper, metallic pull, darker panels on the shoulders and outer sleeves, no hood, no print. Copy that garment.`;
  const cuarto = "The first image is the only room: frameless mirror, rough off-white stucco, beige tile, empty corner. No door, no hallway, no picture.";
  const cuerpo = "Body size comes from the side-view image. Copy that stomach depth and that arm thickness. Do not make him heavier, rounder or slimmer. The front-body image has a blank head on purpose: do not invent a second face.";
  const cierre = "Photorealistic, no text, no watermark, no logo, no extra people. Neck, chest and hands stay plain skin. Do not add drawings or letters on the skin.";
  if (idea === "manos") {
    return [
      "Hands-only photo. The sweatshirt is the subject and his face stays out of frame.",
      "Image 1 is the room. Image 2 is the front body: use only those hands. Image 3 is the side view, for the thickness of the hands and forearms. Image 4 is the sweatshirt.",
      cuarto,
      "The same hands as image 2 hold the sweatshirt so the Perkins collar and the half zipper read clearly. Fingers, palms and the back of both hands are plain skin. No ink, no drawings, no letters and no tattoos on the hands. If a mark exists, it stays on the left forearm only and never moves onto the fingers.",
      prenda,
      cierre,
    ].join(" ");
  }
  if (idea === "detalle") {
    return [
      "Close-up of the real garment: Perkins collar, half zipper, metallic pull, darker shoulder panel and fleece texture.",
      "Image 1 is the room, soft behind the cloth. Image 2 gives the hand that pinches the fabric. Image 3 is the sweatshirt to copy. Image 4 is the face, only if a sliver of beard enters; the garment stays the subject.",
      prenda,
      cuarto,
      "Do not invent prints, pockets, letters or measurements. The hand that pinches the cloth has plain fingers and a plain back of the hand. No ink on the hand.",
      cierre,
    ].join(" ");
  }
  if (idea === "unboxing") {
    return [
      "He opens a plain brown mailer with no logo and no readable text, and pulls this sweatshirt halfway out.",
      "Image 1 is the room. Image 2 is his only face. Image 3 is his left side and the true body size. Image 4 is the front body with a blank head. Image 5 is the sweatshirt.",
      cuarto,
      cuerpo,
      prenda,
      "Mouth closed. One man, and it has to be the face in image 2: dense full black beard, black NY cap, same eyes. Do not swap in a slimmer man or a shorter beard. The bag is ordinary, not a brand.",
      cierre,
    ].join(" ");
  }
  return [
    "Still mirror selfie. He wears the sweatshirt instead of the t-shirt and shows how it fits.",
    "Image 1 is the room. Image 2 is his only face. Image 3 is his left side and the true body size. Image 4 is the front body with a blank head. Image 5 is the sweatshirt.",
    cuarto,
    cuerpo,
    prenda,
    "Sleeves down. Zipper closed to the collar. Phone at chest height. Mouth closed. Black jeans and Chelsea boots stay as in the front-body photo.",
    cierre,
  ].join(" ");
}

export const DURACION_PACK = { min: 1, max: 15, inicial: 10 } as const;

export const CALIDADES_PACK = [
  { id: "480p", etiqueta: "480p" },
  { id: "720p", etiqueta: "720p" },
] as const;

export const RELACIONES_PACK = [
  { id: "9:16", etiqueta: "9:16" },
  { id: "3:4", etiqueta: "3:4" },
  { id: "2:3", etiqueta: "2:3" },
  { id: "1:1", etiqueta: "1:1" },
  { id: "4:3", etiqueta: "4:3" },
  { id: "3:2", etiqueta: "3:2" },
  { id: "16:9", etiqueta: "16:9" },
  { id: "21:9", etiqueta: "21:9" },
  { id: "5:2", etiqueta: "5:2" },
] as const;

export type CalidadPack = (typeof CALIDADES_PACK)[number]["id"];
export type RelacionPack = (typeof RELACIONES_PACK)[number]["id"];

export type AjustesPack = {
  duration: number;
  aspectRatio: RelacionPack;
  resolution: CalidadPack;
};

export const AJUSTES_PACK: AjustesPack = {
  duration: DURACION_PACK.inicial,
  aspectRatio: "9:16",
  resolution: "720p",
};

export function ajustesPack(input: Partial<AjustesPack> | undefined): AjustesPack {
  const duration = Number.isInteger(input?.duration) ? (input?.duration as number) : AJUSTES_PACK.duration;
  const aspectRatio = RELACIONES_PACK.some((r) => r.id === input?.aspectRatio)
    ? (input?.aspectRatio as RelacionPack)
    : AJUSTES_PACK.aspectRatio;
  const resolution = CALIDADES_PACK.some((c) => c.id === input?.resolution)
    ? (input?.resolution as CalidadPack)
    : AJUSTES_PACK.resolution;
  return {
    duration: Math.min(DURACION_PACK.max, Math.max(DURACION_PACK.min, duration)),
    aspectRatio,
    resolution,
  };
}

export function promptVideo(id: string, ajustes: AjustesPack = AJUSTES_PACK, idea: IdeaPack = "probar"): string {
  const color = colorPack(id) ?? COLORES_PACK[0];
  const movimiento =
    idea === "manos"
      ? "Only his hands stay in frame. They hold the sweatshirt and turn it once so the collar and the zipper catch the light. His face never enters."
      : idea === "unboxing"
        ? "He opens a plain mailer with no logo and pulls the sweatshirt out once, then holds it up. Mouth closed."
        : idea === "detalle"
          ? "The view moves in on the Perkins collar, the half zipper, the metallic pull and the darker shoulder panel, then holds. No invented prints."
          : "Phone in one hand at chest height, mouth closed. He tugs the hem once, then turns a few degrees and holds. He is wearing the sweatshirt.";
  return [
    `The same man from <IMAGE_0>, <IMAGE_1>, <IMAGE_2>, <IMAGE_3> and <IMAGE_4> is in <IMAGE_5>, with the sweatshirt from <IMAGE_6> instead of the t-shirt.`,
    `<IMAGE_0> is the front face. <IMAGE_3> is his right profile and <IMAGE_4> is his left profile. One man only. <IMAGE_1> has a blank head on purpose: do not put a different face there.`,
    `Body size comes from the side views <IMAGE_3> and <IMAGE_4>. Copy that chest, that stomach depth, that waist and that arm thickness. Do not make him heavier, rounder or slimmer than those side views.`,
    `Sleeves stay down. The zipper is closed up to the collar. Neck, chest and hands are plain skin. Do not add drawings or letters on the skin.`,
    `<IMAGE_5> is only that frameless mirror: rough off-white stucco and beige tile in an empty corner. No door, no hallway, no picture.`,
    `The garment from <IMAGE_6> is a fitted men's long-sleeve quarter-zip in ${color.en}, short Perkins collar, half zipper, metallic pull, darker panels on the shoulders and outer sleeves, no hood.`,
    `${ajustes.duration} seconds, framed ${ajustes.aspectRatio}. ${movimiento} No dance, no lip-sync, no extra people, no text.`,
  ].join(" ");
}
