export type JobStatus = "borrador" | "corriendo" | "entregado";

export type Fondo = {
  id: string;
  name: string;
  note: string;
};

export type Job = {
  id: string;
  name: string;
  url: string;
  vibe: string;
  fondoId: string;
  createdAt: number;
  status: JobStatus;
  stageIndex: number;
  still: string;
  videoUrl?: string;
  requestId?: string;
  error?: string;
};

export const STAGES: { id: string; label: string; detail: string }[] = [
  {
    id: "foto",
    label: "Foto 9:16",
    detail: "Una sola prenda, manos, sin cara. Sale de Imagine, no de un temporizador.",
  },
  {
    id: "video",
    label: "Video 10s",
    detail: "La foto se anima. Vertical, movimiento lento. Un corte por clic.",
  },
];

export const FONDOS: Fondo[] = [
  { id: "negro", name: "Negro mate", note: "Luz suave, sombra corta" },
  { id: "blanco", name: "Blanco estudio", note: "Contraste alto, sombra limpia" },
  { id: "concreto", name: "Concreto", note: "Textura gris, luz lateral" },
  { id: "madera", name: "Madera oscura", note: "Calidez baja" },
  { id: "carbon", name: "Tela carbón", note: "Textil, sin brillo" },
  { id: "marmol", name: "Mármol claro", note: "Superficie fría" },
  { id: "marca", name: "Coral y cian", note: "Acento quieto de marca" },
];

export const EXAMPLES = [
  "Manos sostienen la chamarra, fondo negro mate, luz suave.",
  "Primer plano de una sola prenda sobre concreto, sin cara.",
  "Showcase quieto, movimiento lento, un producto.",
];

const OUT =
  /baile|twerk|pasarela|try-?on|probarse|cara a c[aá]mara|desfile|multi-?producto|lip.?sync|hablando a c[aá]mara|outfit completo/i;

export function scopeIssue(vibe: string): string | null {
  const text = vibe.trim();
  if (!text) return null;
  if (OUT.test(text)) {
    return "Eso sale del estudio. Aquí solo entra product-hold: manos y una prenda, sin cara, sin baile, sin try-on.";
  }
  return null;
}

export function fondoById(id: string): Fondo {
  return FONDOS.find((fondo) => fondo.id === id) ?? FONDOS[0];
}

export function promptFor(job: Job): string {
  const fondo = fondoById(job.fondoId);
  const vibe = job.vibe.trim() || fondo.note;
  return [
    `Product hold, 10s, 9:16.`,
    `Producto: ${job.name}.`,
    `Fondo: ${fondo.name}. ${vibe}.`,
    `Manos sostienen una sola prenda. Cara fuera de cuadro.`,
    `Movimiento lento, sin baile, sin try-on, sin texto.`,
  ].join(" ");
}

export const SEED: Job[] = [
  {
    id: "suede",
    name: "Chamarra de ante",
    url: "https://www.tiktok.com/shop/p/chamarra-ante",
    vibe: "Fondo negro mate, luz suave, sombra corta.",
    fondoId: "negro",
    createdAt: Date.now() - 1000 * 60 * 80,
    status: "borrador",
    stageIndex: 0,
    still: "/studio/suede.jpg",
  },
  {
    id: "cap",
    name: "Gorra de lana",
    url: "https://www.tiktok.com/shop/p/gorra-lana",
    vibe: "Sobre tela carbón, sin cara.",
    fondoId: "carbon",
    createdAt: Date.now() - 1000 * 60 * 40,
    status: "borrador",
    stageIndex: 0,
    still: "/studio/cap.jpg",
  },
  {
    id: "puffer",
    name: "Puffer carbón",
    url: "https://vt.tiktok.com/puffer-carbon/",
    vibe: "Concreto, luz lateral, manos quietas.",
    fondoId: "concreto",
    createdAt: Date.now() - 1000 * 60 * 12,
    status: "borrador",
    stageIndex: 0,
    still: "/studio/puffer.jpg",
  },
];

const STILLS = ["/studio/suede.jpg", "/studio/cap.jpg", "/studio/puffer.jpg"];

export function stillFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("gorra") || n.includes("cap")) return STILLS[1];
  if (n.includes("puffer") || n.includes("pluma")) return STILLS[2];
  return STILLS[0];
}

export function looksLikeLink(value: string): boolean {
  return /^https?:\/\/\S+/i.test(value.trim());
}
