import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  Clapperboard,
  Monitor,
  Plus,
  Trash2,
} from "lucide-react";
import {
  EXAMPLES,
  FONDOS,
  SEED,
  STAGES,
  fondoById,
  looksLikeLink,
  promptFor,
  scopeIssue,
  stillFor,
  type Job,
} from "./data";
import { pollHold, startHold } from "./generate";

const STORAGE_KEY = "estudio-ugc-v2";

type Screen = "home" | "nuevo" | "job";

function loadJobs(): Job[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as Job[];
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

export function Estudio() {
  const [jobs, setJobs] = useState<Job[]>(SEED);
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [activeId, setActiveId] = useState<string | null>(SEED[0]?.id ?? null);
  const [draftName, setDraftName] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const [draftVibe, setDraftVibe] = useState("");
  const [draftFondo, setDraftFondo] = useState(FONDOS[0].id);
  const [confirming, setConfirming] = useState(false);
  const [reject, setReject] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadJobs();
    setJobs(stored);
    setActiveId(stored[0]?.id ?? null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs, ready]);

  const active = jobs.find((job) => job.id === activeId) ?? null;

  const sorted = useMemo(
    () => [...jobs].sort((a, b) => b.createdAt - a.createdAt),
    [jobs],
  );

  function openNew() {
    setDraftName("");
    setDraftUrl("");
    setDraftVibe("");
    setDraftFondo(FONDOS[0].id);
    setConfirming(false);
    setReject(null);
    setScreen("nuevo");
  }

  function openJob(id: string) {
    setActiveId(id);
    setScreen("job");
  }

  function reviewDraft() {
    const issue = scopeIssue(draftVibe);
    if (!draftName.trim() || !looksLikeLink(draftUrl)) return;
    if (issue) {
      setReject(issue);
      setConfirming(false);
      return;
    }
    setReject(null);
    setConfirming(true);
  }

  function saveDraft() {
    const name = draftName.trim();
    if (!name || !looksLikeLink(draftUrl) || scopeIssue(draftVibe)) return;
    const job: Job = {
      id: crypto.randomUUID(),
      name,
      url: draftUrl.trim(),
      vibe: draftVibe.trim(),
      fondoId: draftFondo,
      createdAt: Date.now(),
      status: "borrador",
      stageIndex: 0,
      still: stillFor(name),
    };
    setJobs((current) => [job, ...current]);
    setActiveId(job.id);
    setScreen("job");
  }

  async function runJob(id: string) {
    const job = jobs.find((item) => item.id === id);
    if (!job || job.status === "corriendo") return;
    setJobs((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "corriendo", stageIndex: 0, error: undefined, videoUrl: undefined }
          : item,
      ),
    );
    const started = await startHold({
      data: { name: job.name, vibe: job.vibe, fondo: fondoById(job.fondoId).name },
    });
    if (!started.ok) {
      setJobs((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "borrador",
                stageIndex: started.still ? 1 : 0,
                still: started.still ?? item.still,
                error: started.error,
              }
            : item,
        ),
      );
      return;
    }
    setJobs((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, still: started.still, requestId: started.requestId, stageIndex: 1 }
          : item,
      ),
    );
    for (let attempt = 0; attempt < 36; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 5000));
      const polled = await pollHold({ data: { requestId: started.requestId } });
      if (!polled.ok) {
        setJobs((current) =>
          current.map((item) =>
            item.id === id ? { ...item, status: "borrador", error: polled.error } : item,
          ),
        );
        return;
      }
      if (polled.status === "done") {
        setJobs((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, status: "entregado", stageIndex: STAGES.length, videoUrl: polled.videoUrl, error: undefined }
              : item,
          ),
        );
        return;
      }
    }
    setJobs((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "borrador", error: "El video sigue en cola. Vuelve a generar en un momento." }
          : item,
      ),
    );
  }

  function removeJob(id: string) {
    setJobs((current) => current.filter((job) => job.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setScreen("home");
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-nav px-4 py-3 text-paper sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {screen !== "home" ? (
            <button
              type="button"
              onClick={() => setScreen("home")}
              className="grid size-11 place-items-center rounded-full bg-paper/10"
              aria-label="Volver"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <span className="grid size-11 place-items-center rounded-full bg-coral text-paper">
              <Clapperboard className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-none tracking-tight">
              Estudio
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-paper/70">
              <Monitor className="size-3.5 text-cyan" />
              Foto y video reales. Un corte por clic.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-coral px-4 text-sm font-semibold text-paper"
        >
          <Plus className="size-4" />
          Nuevo
        </button>
      </header>

      {screen === "home" && (
        <Home
          jobs={sorted}
          onOpen={openJob}
          onNew={openNew}
        />
      )}
      {screen === "nuevo" && (
        <Composer
          name={draftName}
          url={draftUrl}
          vibe={draftVibe}
          fondoId={draftFondo}
          confirming={confirming}
          reject={reject}
          onName={setDraftName}
          onUrl={setDraftUrl}
          onVibe={(value) => {
            setDraftVibe(value);
            setConfirming(false);
            setReject(null);
          }}
          onFondo={(id) => {
            setDraftFondo(id);
            setConfirming(false);
          }}
          onReview={reviewDraft}
          onBack={() => setConfirming(false)}
          onSave={saveDraft}
        />
      )}
      {screen === "job" && active && (
        <JobView job={active} onRun={() => runJob(active.id)} onDelete={() => removeJob(active.id)} />
      )}
      {screen === "job" && !active && (
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted">Ese trabajo ya no está.</p>
          <button type="button" onClick={() => setScreen("home")} className="mt-4 text-sm font-semibold text-cyan">
            Volver al tablero
          </button>
        </main>
      )}
    </div>
  );
}

function Home({
  jobs,
  onOpen,
  onNew,
}: {
  jobs: Job[];
  onOpen: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-card bg-card p-5 shadow-[0_1px_0_var(--color-line)]">
        <p className="font-display text-2xl font-bold leading-tight">
          Una prenda. Manos. Sin cara.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          El link se guarda. No abre TikTok. Al correr, Imagine hace la foto 9:16 y un video de 10 segundos a partir de esa foto.
        </p>
        <ol className="mt-5 space-y-2 text-sm">
          {STAGES.map((stage, index) => (
            <li key={stage.id} className="flex gap-3">
              <span className="font-display w-5 font-bold text-coral">{index + 1}</span>
              <span>{stage.label}</span>
            </li>
          ))}
        </ol>
      </aside>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h1 className="font-display text-xl font-bold">Trabajos</h1>
          <p className="text-sm text-muted">{jobs.length} en este equipo</p>
        </div>
        {jobs.length === 0 ? (
          <button
            type="button"
            onClick={onNew}
            className="flex min-h-48 w-full flex-col items-start justify-end rounded-card bg-card p-6 text-left"
          >
            <span className="font-display text-2xl font-bold">Nada en cola</span>
            <span className="mt-2 text-sm text-muted">Crea el primer corte con un link de producto.</span>
          </button>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {jobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => onOpen(job.id)}
                  className="flex w-full gap-3 rounded-card bg-card p-3 text-left transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <img
                    src={job.still}
                    alt=""
                    className="size-24 shrink-0 rounded-2xl object-cover"
                  />
                  <span className="min-w-0 py-1">
                    <span className="block truncate font-display text-lg font-bold">{job.name}</span>
                    <span className="mt-1 block text-sm text-muted">{fondoById(job.fondoId).name}</span>
                    <Status job={job} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Status({ job }: { job: Job }) {
  const label =
    job.status === "entregado" && job.videoUrl
      ? "Video listo"
      : job.status === "corriendo"
        ? STAGES[Math.min(job.stageIndex, STAGES.length - 1)].label
        : "Sin generar";
  const tone =
    job.status === "entregado"
      ? "text-cyan"
      : job.status === "corriendo"
        ? "text-coral"
        : "text-muted";
  return <span className={`mt-2 block text-xs font-semibold uppercase tracking-wide ${tone}`}>{label}</span>;
}

function Composer({
  name,
  url,
  vibe,
  fondoId,
  confirming,
  reject,
  onName,
  onUrl,
  onVibe,
  onFondo,
  onReview,
  onBack,
  onSave,
}: {
  name: string;
  url: string;
  vibe: string;
  fondoId: string;
  confirming: boolean;
  reject: string | null;
  onName: (value: string) => void;
  onUrl: (value: string) => void;
  onVibe: (value: string) => void;
  onFondo: (id: string) => void;
  onReview: () => void;
  onBack: () => void;
  onSave: () => void;
}) {
  const valid = name.trim().length > 1 && looksLikeLink(url);
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Nuevo corte</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Solo product-hold. Si pides baile, try-on o cara a cámara, se rechaza.
      </p>

      {reject && (
        <div className="mt-5 rounded-card border border-coral/40 bg-card p-5">
          <p className="font-display text-lg font-bold text-coral">Fuera de concepto</p>
          <p className="mt-2 text-sm leading-relaxed">{reject}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Tres que sí entran</p>
          <ul className="mt-2 space-y-2 text-sm">
            {EXAMPLES.map((example) => (
              <li key={example}>
                <button type="button" onClick={() => onVibe(example)} className="text-left underline decoration-line underline-offset-4">
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-4">
        <Field label="Nombre" value={name} onChange={onName} placeholder="Chamarra de ante" />
        <Field label="Link de TikTok Shop" value={url} onChange={onUrl} placeholder="https://vt.tiktok.com/…" />
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">Vibe</span>
          <textarea
            value={vibe}
            onChange={(event) => onVibe(event.target.value)}
            placeholder="Fondo negro mate, luz suave. Opcional."
            rows={3}
            className="mt-2 w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 text-base outline-none focus:border-cyan"
          />
        </label>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">Fondo</p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FONDOS.map((fondo) => {
          const on = fondo.id === fondoId;
          return (
            <button
              key={fondo.id}
              type="button"
              onClick={() => onFondo(fondo.id)}
              className={`rounded-2xl px-3 py-3 text-left ${on ? "bg-ink text-paper" : "bg-card text-ink"}`}
            >
              <span className="block text-sm font-semibold">{fondo.name}</span>
              <span className={`mt-1 block text-xs ${on ? "text-paper/70" : "text-muted"}`}>{fondo.note}</span>
            </button>
          );
        })}
      </div>

      {!confirming ? (
        <button
          type="button"
          disabled={!valid}
          onClick={onReview}
          className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-paper disabled:opacity-40 sm:w-auto sm:px-8"
        >
          Revisar
        </button>
      ) : (
        <div className="mt-6 rounded-card bg-ink p-5 text-paper">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan">Confirmar</p>
          <p className="mt-2 font-display text-2xl font-bold">{name.trim()}</p>
          <p className="mt-2 text-sm text-paper/75">
            {fondoById(fondoId).name}. {vibe.trim() || "Sin ajuste extra."}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={onSave} className="h-12 rounded-full bg-coral px-6 text-sm font-semibold text-paper">
              Confirmar y guardar
            </button>
            <button type="button" onClick={onBack} className="h-12 rounded-full bg-paper/10 px-6 text-sm font-semibold">
              Modificar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-line bg-card px-4 text-base outline-none focus:border-cyan"
      />
    </label>
  );
}

function JobView({
  job,
  onRun,
  onDelete,
}: {
  job: Job;
  onRun: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const prompt = promptFor(job);
  const done = job.status === "entregado";
  const busy = job.status === "corriendo";

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr]">
      <div>
        {job.videoUrl ? (
          <video
            src={job.videoUrl}
            poster={job.still}
            controls
            playsInline
            className="aspect-[9/16] w-full rounded-card bg-ink object-cover"
          />
        ) : (
          <img src={job.still} alt="" className="aspect-[3/4] w-full rounded-card object-cover" />
        )}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold leading-none">{job.name}</h1>
            <p className="mt-2 text-sm text-muted">{fondoById(job.fondoId).name}</p>
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-muted"
            aria-label="Quitar trabajo"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <p className="mt-3 break-all text-xs text-muted">{job.url}</p>
      </div>

      <section>
        <ol className="space-y-2">
          {STAGES.map((stage, index) => {
            const state = done || index < job.stageIndex ? "done" : busy && index === job.stageIndex ? "now" : "wait";
            return (
              <li
                key={stage.id}
                className={`flex gap-3 rounded-2xl px-3 py-3 ${state === "now" ? "bg-ink text-paper" : "bg-card"}`}
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    state === "done"
                      ? "bg-cyan text-paper"
                      : state === "now"
                        ? "bg-coral text-paper"
                        : "bg-wash text-muted"
                  }`}
                >
                  {state === "done" ? <Check className="size-4" /> : index + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{stage.label}</span>
                  <span className={`mt-0.5 block text-xs leading-relaxed ${state === "now" ? "text-paper/70" : "text-muted"}`}>
                    {stage.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        {!done && (
          <button
            type="button"
            disabled={busy}
            onClick={onRun}
            className="mt-4 h-12 w-full rounded-full bg-coral text-sm font-semibold text-paper disabled:opacity-60"
          >
            {busy ? "Generando foto y video…" : "Generar corte de 10s"}
          </button>
        )}

        {job.error && <p className="mt-3 text-sm text-coral">{job.error}</p>}

        {done && job.videoUrl && (
          <div className="mt-4 rounded-card bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan">Video</p>
            <p className="mt-2 text-sm leading-relaxed">
              10 segundos, vertical, a partir de la foto de arriba. No es un archivo de 1080 hecho con ffmpeg.
            </p>
            <p className="mt-3 rounded-2xl bg-wash p-3 text-sm leading-relaxed">{prompt}</p>
            <button type="button" onClick={copy} className="mt-3 h-11 rounded-full bg-ink px-5 text-sm font-semibold text-paper">
              {copied ? "Copiado" : "Copiar prompt"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
