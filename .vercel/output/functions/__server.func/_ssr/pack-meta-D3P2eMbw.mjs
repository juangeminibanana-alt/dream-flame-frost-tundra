//#region node_modules/.nitro/vite/services/ssr/assets/pack-meta-D3P2eMbw.js
var COLORES_PACK = [
	{
		id: "signal-black",
		etiqueta: "Negro intenso",
		archivo: "ugc/producto/01_signal_black.jpg",
		en: "intense signal black",
		adjetivo: "negra",
		muestra: true
	},
	{
		id: "royal-blue",
		etiqueta: "Azul royal",
		archivo: "ugc/producto/02_royal_blue.jpg",
		en: "royal blue",
		adjetivo: "azul royal",
		muestra: false
	},
	{
		id: "burgundy",
		etiqueta: "Borgoña",
		archivo: "ugc/producto/03_burgundy.jpg",
		en: "burgundy",
		adjetivo: "borgoña",
		muestra: false
	},
	{
		id: "white",
		etiqueta: "Blanco",
		archivo: "ugc/producto/04_white.jpg",
		en: "white",
		adjetivo: "blanca",
		muestra: false
	},
	{
		id: "lilac",
		etiqueta: "Lila",
		archivo: "ugc/producto/05_lilac.jpg",
		en: "lilac",
		adjetivo: "lila",
		muestra: false
	}
];
function colorPack(id) {
	return COLORES_PACK.find((c) => c.id === id) ?? null;
}
function guionPack(id) {
	const color = colorPack(id) ?? COLORES_PACK[0];
	const talla = color.muestra ? " La mía es XL, como a doscientos veintisiete pesos." : " Como a doscientos veintisiete pesos.";
	return `No es hoodie: es sudadera ${color.adjetivo} de cuello Perkins con media cremallera. Corte entallado, tela afelpada.${talla}`;
}
function promptStill(id) {
	return [
		"Photoreal vertical 9:16 mirror selfie. No text, no watermark, no extra people.",
		"Image 1 is the room. Do not redesign it: a tall frameless mirror on a rough matte off-white stucco wall, thin glass edge, reflecting only an empty corner of the same warm off-white textured wall, square beige floor tiles with pale grout, and a thin pale baseboard. Soft diffuse warm-neutral indoor light. No window, no plants, no furniture, no bed, no gym, no black studio.",
		"Image 2 is his face. Image 3 is his body from the front. Image 4 is his back. Image 5 is the garment.",
		"Place this same man inside that mirror reflection, a black phone in one hand at chest height.",
		"Heavy solid build: thick torso, wide midsection, broad shoulders, thick neck and arms. Never slim, never gym-lean, never a flat stomach.",
		"Round face, full cheeks, medium skin tone, dense full dark beard joined to the mustache and trimmed along the cheeks and jaw.",
		"Same black baseball cap as image 2, brim forward, hair hidden. Do not invent a new logo and do not print any logo on the sweatshirt.",
		"One dark ornamental tattoo only on his left arm, forearm and upper arm, which sits on the viewer's right when he faces the mirror. Do not move it, duplicate it, or erase it.",
		"Keep the black jeans and black suede Chelsea boots from image 3.",
		`Replace only the black short-sleeve t-shirt with the garment in image 5: a fitted men's long-sleeve quarter-zip sweatshirt in ${(colorPack(id) ?? COLORES_PACK[0]).en}, short Perkins stand collar, half zipper with a metallic pull, darker panels on the shoulders and outer sleeves, raglan seams, no hood. It is worn on this heavy body, not on a mannequin.`,
		"He stands still, serious calm face, mouth closed, looking toward the phone."
	].join(" ");
}
function promptVideo(id) {
	return [
		"Same man, same frameless mirror, same stucco wall and beige tile corner.",
		"Slow mirror selfie, the phone stays in his hand, mouth closed, he does not speak.",
		`0-2s he is already in the reflection and settles his stance. 2-5s he pulls the hem of the ${(colorPack(id) ?? COLORES_PACK[0]).en} quarter-zip once and lets the shoulders sit. 5-8s he lowers the phone slightly and touches the half zipper once without opening it. 8-10s he turns his torso a few degrees so the side panel shows, then holds still.`,
		"Keep the heavy build, wide midsection, full beard, black cap, left-arm tattoo, black jeans, and black Chelsea boots.",
		"No dance, no lip-sync, no extra people, no furniture, no tripod, no on-screen text."
	].join(" ");
}
//#endregion
export { promptVideo as a, promptStill as i, colorPack as n, guionPack as r, COLORES_PACK as t };
