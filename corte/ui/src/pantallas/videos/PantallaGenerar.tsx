/** Generación de ideas y seguimiento recuperable del video seleccionado. */
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import {
  Boton,
  EncabezadoPantalla,
  EstadoVacio,
  OpcionRadio,
  Segmentado,
  SelectorNumero,
} from "@/componentes";
import { Pantalla } from "@/app";
import { estadoPack, pollPack, startIdeas, startPack } from "@/studio/generate";
import {
  CALIDADES_PACK,
  COLORES_PACK,
  DURACION_PACK,
  IDEAS_PACK,
  RELACIONES_PACK,
  guionPack,
  type IdeaPack,
} from "@/studio/pack-meta";
import {
  canShowLegacy,
  emptyWorkspace,
  ideasMatch,
  loadWorkspace,
  mergeIdeas,
  missingIdeas,
  readLegacyMaterials,
  saveWorkspace,
  TRACKING_WINDOW_MS,
  type GenerationWorkspace,
  type LegacyMaterials,
  type VideoJob,
} from "@/studio/client-state";
import css from "./generar.module.css";

type Fase = "ideas" | "enviando" | null;
type Disponibilidad = "revisando" | "lista" | "sin-acceso" | "error";

async function conPlazo<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("No se recibió respuesta a tiempo.")),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export function PantallaGenerar(): ReactElement {
  const [workspace, setWorkspace] = useState<GenerationWorkspace>(emptyWorkspace);
  const actual = useRef(workspace);
  const montado = useRef(true);
  const hidratado = useRef(false);
  const accion = useRef(false);
  const [listo, setListo] = useState(false);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>("revisando");
  const [fase, setFase] = useState<Fase>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [avisoGuardado, setAvisoGuardado] = useState<string | null>(null);
  const [descargando, setDescargando] = useState<string | null>(null);
  const descargaActiva = useRef(false);
  const [medioCaducado, setMedioCaducado] = useState(false);
  const [anteriores, setAnteriores] = useState<LegacyMaterials | null>(null);

  const actualizar = useCallback(
    (change: (previous: GenerationWorkspace) => GenerationWorkspace): void => {
      const next = change(actual.current);
      actual.current = next;
      if (montado.current) setWorkspace(next);
      if (!hidratado.current) return;
      let saved = false;
      try {
        saved = saveWorkspace(window.localStorage, next);
      } catch {
        /* almacenamiento bloqueado */
      }
      if (montado.current)
        setAvisoGuardado(
          saved
            ? null
            : "No pude guardar el seguimiento en este navegador. Mantén esta página abierta y descarga tus archivos.",
        );
    },
    [],
  );

  const revisarDisponibilidad = useCallback(async (): Promise<void> => {
    if (montado.current) setDisponibilidad("revisando");
    try {
      const result = await conPlazo(estadoPack({ data: {} }), 45_000);
      if (montado.current) {
        setDisponibilidad(result.available ? "lista" : "sin-acceso");
        setAnteriores(readLegacyMaterials(result));
        if (!result.available && actual.current.pending)
          actualizar((previous) => ({
            ...previous,
            pending: previous.pending ? { ...previous.pending, paused: true } : null,
          }));
      }
    } catch {
      if (montado.current) setDisponibilidad("error");
    }
  }, [actualizar]);

  useEffect(() => {
    montado.current = true;
    let saved: GenerationWorkspace | null = null;
    try {
      saved = loadWorkspace(window.localStorage);
    } catch {
      /* navegación privada */
    }
    if (saved) {
      if (saved.pending && Date.now() - saved.pending.trackingStartedAt >= TRACKING_WINDOW_MS) {
        saved = { ...saved, pending: { ...saved.pending, paused: true } };
      }
      actual.current = saved;
      setWorkspace(saved);
    }
    hidratado.current = true;
    setListo(true);
    void revisarDisponibilidad();
    return () => {
      montado.current = false;
    };
  }, [revisarDisponibilidad]);

  const trabajo = workspace.pending;
  const siguiendo = Boolean(trabajo && !trabajo.paused && disponibilidad === "lista");
  const ocupado = fase !== null || siguiendo;
  const bloqueado = !listo || disponibilidad !== "lista" || ocupado || Boolean(trabajo);
  const { color, ajustes, ideas, result } = workspace;
  const coinciden = ideasMatch(ideas, color, ajustes.aspectRatio);
  const faltantes = missingIdeas(coinciden ? ideas : null);
  const prenda = COLORES_PACK.find((item) => item.id === color) ?? COLORES_PACK[0];

  useEffect(() => {
    if (!trabajo || trabajo.paused || disponibilidad !== "lista") return;
    let vivo = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let fallos = 0;
    const pausar = (mensaje: string): void => {
      if (!vivo) return;
      actualizar((previous) =>
        previous.pending?.requestId === trabajo.requestId
          ? { ...previous, pending: { ...previous.pending, paused: true } }
          : previous,
      );
      setAviso(mensaje);
    };
    const siguiente = (): void => {
      if (vivo)
        timer = setTimeout(
          () => void revisar(),
          Math.min(30_000, 5_000 * 2 ** Math.min(fallos, 3)),
        );
    };
    const revisar = async (): Promise<void> => {
      if (!vivo) return;
      if (Date.now() - trabajo.trackingStartedAt >= TRACKING_WINDOW_MS) {
        pausar(
          "El video sigue pendiente. Pausé la revisión después de 10 minutos; puedes reanudarla sin generar otro video.",
        );
        return;
      }
      try {
        const response = await conPlazo(
          pollPack({ data: { requestId: trabajo.requestId } }),
          45_000,
        );
        if (!vivo) return;
        if (!response.ok) {
          if (response.retryable) {
            fallos += 1;
            setAviso(`${response.error} Volveré a consultar el mismo video.`);
            siguiente();
          } else {
            pausar(response.error);
          }
          return;
        }
        if (response.status === "done") {
          actualizar((previous) =>
            previous.pending?.requestId === trabajo.requestId
              ? {
                  ...previous,
                  pending: null,
                  result: {
                    ...trabajo,
                    paused: false,
                    videoUrl: response.videoUrl,
                    completedAt: Date.now(),
                  },
                }
              : previous,
          );
          setMedioCaducado(false);
          setAviso(null);
          return;
        }
        fallos = 0;
        setAviso(null);
        siguiente();
      } catch {
        if (!vivo) return;
        fallos += 1;
        setAviso(
          "No pude consultar el video. Conservo el seguimiento y volveré a revisar, sin generar otro.",
        );
        siguiente();
      }
    };
    timer = setTimeout(() => void revisar(), 1_000);
    return () => {
      vivo = false;
      clearTimeout(timer);
    };
  }, [trabajo?.requestId, trabajo?.paused, trabajo?.trackingStartedAt, disponibilidad, actualizar]);

  const generarIdeas = async (): Promise<void> => {
    const current = actual.current;
    if (accion.current || current.pending || disponibilidad !== "lista") return;
    accion.current = true;
    setFase("ideas");
    setAviso(null);
    const same = ideasMatch(current.ideas, current.color, current.ajustes.aspectRatio);
    const missing = missingIdeas(same ? current.ideas : null);
    const solo =
      same && missing.length > 0 && missing.length < IDEAS_PACK.length ? missing : undefined;
    try {
      const response = await conPlazo(
        startIdeas({
          data: {
            color: current.color,
            aspectRatio: current.ajustes.aspectRatio,
            ...(solo ? { solo } : {}),
          },
        }),
        150_000,
      );
      if (!response.ok) {
        if (montado.current) setAviso(response.error);
        return;
      }
      actualizar((previous) => ({
        ...previous,
        ideas: mergeIdeas(previous.ideas, {
          color: response.color,
          aspectRatio: response.aspectRatio,
          items: response.ideas,
        }),
      }));
      const errors = response.ideas.filter((item) => !item.url);
      if (montado.current)
        setAviso(
          errors.length
            ? `No salieron ${errors.length} ideas. Conservé las demás; puedes completar solo las que faltan.`
            : null,
        );
    } catch {
      if (montado.current)
        setAviso(
          "No recibí las ideas. Conservé las fotos anteriores. Revisa la conexión antes de volver a pedirlas.",
        );
    } finally {
      accion.current = false;
      if (montado.current) setFase(null);
    }
  };

  const generarVideo = async (idea: IdeaPack): Promise<void> => {
    const current = actual.current;
    if (
      accion.current ||
      current.pending ||
      disponibilidad !== "lista" ||
      !ideasMatch(current.ideas, current.color, current.ajustes.aspectRatio)
    )
      return;
    const still = current.ideas?.items.find((item) => item.id === idea)?.url;
    if (!still) return;
    accion.current = true;
    setFase("enviando");
    setAviso(null);
    try {
      const response = await conPlazo(
        startPack({ data: { color: current.color, idea, still, ...current.ajustes } }),
        150_000,
      );
      if (!response.ok) {
        if (montado.current) setAviso(response.error);
        return;
      }
      const now = Date.now();
      const pending: VideoJob = {
        requestId: response.requestId,
        color: response.color,
        idea: response.idea,
        still: response.still,
        ajustes: { ...response.ajustes },
        createdAt: now,
        trackingStartedAt: now,
        paused: false,
      };
      actualizar((previous) => ({ ...previous, pending }));
    } catch {
      if (montado.current)
        setAviso(
          "No pude confirmar el envío del video. No lo reenvié automáticamente; conservé tu último resultado.",
        );
    } finally {
      accion.current = false;
      if (montado.current) setFase(null);
    }
  };

  const reanudar = (job: VideoJob): void => {
    if (accion.current || fase) return;
    setAviso(null);
    actualizar((previous) => ({
      ...previous,
      pending: { ...job, paused: false, trackingStartedAt: Date.now() },
    }));
  };

  const descargar = async (url: string, nombre: string): Promise<void> => {
    if (descargaActiva.current) return;
    descargaActiva.current = true;
    setDescargando(url);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!response.ok) throw new Error("Descarga no disponible.");
      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Archivo vacío.");
      const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
      const signature = String.fromCharCode(...header);
      const extension =
        header[0] === 0x89 && signature.slice(1, 4) === "PNG"
          ? "png"
          : header[0] === 0xff && header[1] === 0xd8
            ? "jpg"
            : signature.startsWith("RIFF") && signature.slice(8, 12) === "WEBP"
              ? "webp"
              : signature.slice(4, 8) === "ftyp"
                ? "mp4"
                : null;
      if (!extension)
        throw new Error("La respuesta no contiene un archivo de imagen o video compatible.");
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${nombre}.${extension}`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    } catch {
      if (montado.current)
        setAviso(
          "No pude iniciar la descarga directa. Usa «Abrir original» para guardar el archivo desde su vista original.",
        );
    } finally {
      descargaActiva.current = false;
      if (montado.current) setDescargando(null);
    }
  };

  const ultimaFoto = result?.still ?? trabajo?.still ?? ideas?.items.find((item) => item.url)?.url;
  const aspectoVista =
    result?.ajustes.aspectRatio ??
    trabajo?.ajustes.aspectRatio ??
    ideas?.aspectRatio ??
    ajustes.aspectRatio;
  const colorVista = result?.color ?? trabajo?.color ?? ideas?.color ?? color;
  const nombreVista =
    COLORES_PACK.find((item) => item.id === colorVista)?.etiqueta ?? prenda.etiqueta;
  const estado =
    fase === "ideas"
      ? "Generando las fotos solicitadas…"
      : fase === "enviando"
        ? "Enviando el video elegido…"
        : siguiendo
          ? "El video está en proceso. Puedes pausar y reanudar su seguimiento."
          : trabajo?.paused
            ? "Seguimiento pausado. El trabajo puede continuar en el servidor."
            : result
              ? "Tu último video está listo."
              : "Genera las ideas y elige una foto para animarla.";
  const etiquetaIdeas =
    coinciden && faltantes.length > 0 && faltantes.length < IDEAS_PACK.length
      ? `Completar ${faltantes.length} ${faltantes.length === 1 ? "idea" : "ideas"}`
      : coinciden && faltantes.length === 0
        ? "Generar otras 4 ideas"
        : "Generar las 4 ideas";

  return (
    <Pantalla titulo="Generar video" lista>
      <div className={css.pagina}>
        <EncabezadoPantalla
          titulo="Generar video"
          contexto="El mismo hombre, el mismo espejo, la sudadera de cuello Perkins."
          volver={{ a: "/videos", etiqueta: "Videos" }}
        />
        {disponibilidad === "sin-acceso" ? (
          <p className={css.aviso} role="status">
            La generación no está disponible en este entorno. Tus resultados guardados siguen aquí.
          </p>
        ) : null}
        {disponibilidad === "error" ? (
          <div className={css.estado} role="status">
            <p className={css.nota}>No pude comprobar si la generación está disponible.</p>
            <Boton
              variante="secundario"
              tipo="button"
              alPulsar={() => void revisarDisponibilidad()}
            >
              Revisar disponibilidad
            </Boton>
          </div>
        ) : null}
        <div className={css.cuerpo}>
          <div className={css.form}>
            <fieldset className={css.grupo} disabled={!listo || ocupado}>
              <legend className={css.leyenda}>Ajustes del próximo video</legend>
              <SelectorNumero
                etiqueta="Duración, en segundos"
                valor={ajustes.duration}
                min={DURACION_PACK.min}
                max={DURACION_PACK.max}
                alCambiar={(duration) =>
                  actualizar((previous) => ({
                    ...previous,
                    ajustes: { ...previous.ajustes, duration },
                  }))
                }
              />
              <Segmentado
                etiqueta="Resolución"
                anchoCompleto
                opciones={CALIDADES_PACK.map((item) => ({
                  valor: item.id,
                  etiqueta: item.etiqueta,
                }))}
                valor={ajustes.resolution}
                alCambiar={(resolution) =>
                  actualizar((previous) => ({
                    ...previous,
                    ajustes: { ...previous.ajustes, resolution },
                  }))
                }
              />
              <p className={css.nota}>Con estas fotos de referencia, el video admite hasta 720p.</p>
              <div>
                <p className={css.leyenda} id="relacion-leyenda">
                  Relación
                </p>
                <div className={css.chips} role="radiogroup" aria-labelledby="relacion-leyenda">
                  {RELACIONES_PACK.map((item) => (
                    <label key={item.id} className={css.chip}>
                      <input
                        type="radio"
                        name="relacion"
                        value={item.id}
                        checked={ajustes.aspectRatio === item.id}
                        onChange={() =>
                          actualizar((previous) => ({
                            ...previous,
                            ajustes: { ...previous.ajustes, aspectRatio: item.id },
                          }))
                        }
                      />
                      <span>{item.etiqueta}</span>
                    </label>
                  ))}
                </div>
              </div>
              <OpcionRadio
                etiqueta="Color"
                opciones={COLORES_PACK.map((item) => ({
                  valor: item.id,
                  etiqueta: item.etiqueta,
                  descripcion: item.muestra ? "La muestra pedida es XL" : "Mismo corte",
                }))}
                valor={color}
                alCambiar={(next) => actualizar((previous) => ({ ...previous, color: next }))}
              />
            </fieldset>
            <p className={css.guion}>{guionPack(color)}</p>
            <p className={css.ficha}>
              Cuello Perkins, media cremallera, jalador metálico y paneles más oscuros en hombros y
              manga. Tallas S a XXL. Tela según el vendedor: 95% poliéster y 5% elastano, afelpada.
            </p>
          </div>
          <div className={css.preview}>
            {result ? (
              <video
                key={result.videoUrl}
                className={css.medio}
                style={{ aspectRatio: aspectoVista.replace(":", " / ") }}
                src={result.videoUrl}
                poster={result.still}
                controls
                playsInline
                onError={() => setMedioCaducado(true)}
              />
            ) : ultimaFoto ? (
              <img
                className={css.medio}
                style={{ aspectRatio: aspectoVista.replace(":", " / ") }}
                src={ultimaFoto}
                alt={`Sudadera ${nombreVista.toLowerCase()}`}
              />
            ) : (
              <EstadoVacio
                icono="Image"
                titulo="Primero van las ideas"
                texto="Cuatro fotos: probar la prenda, las manos, el unboxing y el detalle. Elige una para crear el video."
              />
            )}
            {result ? (
              <div className={css.entrega}>
                <p className={css.nota}>
                  Último video · {nombreVista} · {result.ajustes.duration}s ·{" "}
                  {result.ajustes.aspectRatio} · {result.ajustes.resolution}
                </p>
                <div className={css.acciones}>
                  <Boton
                    variante="primario"
                    tipo="button"
                    deshabilitado={Boolean(descargando)}
                    cargando={descargando === result.videoUrl}
                    alPulsar={() =>
                      void descargar(result.videoUrl, `corte-${result.color}-${result.idea}`)
                    }
                  >
                    Descargar video
                  </Boton>
                  <a
                    className={css.enlace}
                    href={result.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir original
                  </a>
                </div>
                {medioCaducado ? (
                  <>
                    <p className={css.aviso} role="alert">
                      No pude abrir este video. El enlace puede haber caducado.
                    </p>
                    <Boton
                      variante="secundario"
                      tipo="button"
                      deshabilitado={Boolean(trabajo) || ocupado}
                      alPulsar={() => reanudar(result)}
                    >
                      Actualizar enlace del video
                    </Boton>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <div className={css.estado} aria-live="polite" aria-atomic="true">
          <p className={css.estadoTexto} role="status">
            {disponibilidad === "revisando" ? "Comprobando disponibilidad…" : estado}
          </p>
          {trabajo ? (
            <>
              <p className={css.nota}>
                {COLORES_PACK.find((item) => item.id === trabajo.color)?.etiqueta} ·{" "}
                {trabajo.ajustes.duration}s · {trabajo.ajustes.aspectRatio} ·{" "}
                {trabajo.ajustes.resolution}
              </p>
              <div className={css.acciones}>
                {trabajo.paused ? (
                  <>
                    <Boton
                      variante="secundario"
                      tipo="button"
                      deshabilitado={disponibilidad !== "lista"}
                      alPulsar={() => reanudar(trabajo)}
                    >
                      Reanudar seguimiento
                    </Boton>
                    <Boton
                      variante="secundario"
                      tipo="button"
                      alPulsar={() => actualizar((previous) => ({ ...previous, pending: null }))}
                    >
                      Olvidar seguimiento
                    </Boton>
                  </>
                ) : (
                  <Boton
                    variante="secundario"
                    tipo="button"
                    alPulsar={() =>
                      actualizar((previous) => ({
                        ...previous,
                        pending: previous.pending ? { ...previous.pending, paused: true } : null,
                      }))
                    }
                  >
                    Pausar seguimiento
                  </Boton>
                )}
              </div>
              <p className={css.nota}>
                Pausar u olvidar solo detiene el seguimiento aquí. No cancela la generación ni
                devuelve el cupo utilizado.
              </p>
            </>
          ) : null}
        </div>
        {aviso ? (
          <p className={css.aviso} role="alert">
            {aviso}
          </p>
        ) : null}
        {avisoGuardado ? (
          <p className={css.aviso} role="status">
            {avisoGuardado}
          </p>
        ) : null}
        <section className={css.paso} aria-labelledby="paso-ideas" aria-busy={fase === "ideas"}>
          <p className={css.numero}>01</p>
          <h2 id="paso-ideas" className={css.pregunta}>
            ¿Cómo lo vamos a mostrar?
          </h2>
          {ideas && !coinciden ? (
            <p className={css.nota}>
              Las fotos visibles corresponden a{" "}
              {COLORES_PACK.find((item) => item.id === ideas.color)?.etiqueta.toLowerCase()},{" "}
              {ideas.aspectRatio}. Genera ideas para el color y la relación elegidos antes de crear
              otro video.
            </p>
          ) : null}
          <div className={css.ideas}>
            {IDEAS_PACK.map((idea) => {
              const item = ideas?.items.find((entry) => entry.id === idea.id);
              const foto = item?.url;
              const activa = trabajo?.idea === idea.id;
              return (
                <article
                  key={idea.id}
                  className={activa ? `${css.idea} ${css.ideaActiva}` : css.idea}
                >
                  {foto ? (
                    <img
                      className={css.ideaFoto}
                      style={{
                        aspectRatio: (ideas?.aspectRatio ?? ajustes.aspectRatio).replace(
                          ":",
                          " / ",
                        ),
                      }}
                      src={foto}
                      alt={idea.etiqueta}
                      loading="lazy"
                    />
                  ) : (
                    <div className={css.ideaVacia} aria-hidden="true">
                      {idea.numero}
                    </div>
                  )}
                  <div className={css.ideaCuerpo}>
                    <h3 className={css.ideaTitulo}>{idea.etiqueta}</h3>
                    <p className={css.ideaTexto}>{idea.texto}</p>
                    {item?.error && !foto ? (
                      <p className={css.aviso}>Esta idea no se pudo completar.</p>
                    ) : null}
                    <Boton
                      variante="secundario"
                      icono="Clapperboard"
                      tipo="button"
                      anchoCompleto
                      deshabilitado={!foto || !coinciden || bloqueado}
                      cargando={siguiendo && activa}
                      alPulsar={() => void generarVideo(idea.id)}
                    >
                      {siguiendo && activa
                        ? "Video en proceso…"
                        : `Crear video de ${ajustes.duration}s`}
                    </Boton>
                    {foto ? (
                      <div className={css.acciones}>
                        <button
                          type="button"
                          className={css.enlace}
                          disabled={Boolean(descargando)}
                          onClick={() =>
                            void descargar(foto, `idea-${ideas?.color ?? color}-${idea.id}`)
                          }
                        >
                          {descargando === foto ? "Descargando…" : "Descargar foto"}
                        </button>
                        <a
                          className={css.enlace}
                          href={foto}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Abrir original
                        </a>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          <Boton
            variante="primario"
            icono="Image"
            tipo="button"
            anchoCompleto
            cargando={fase === "ideas"}
            deshabilitado={bloqueado}
            alPulsar={() => void generarIdeas()}
          >
            {fase === "ideas" ? "Generando ideas…" : etiquetaIdeas}
          </Boton>
          <p className={css.nota}>
            Cada imagen y cada segundo de video utilizan cupo. El video parte de la foto que eliges
            y no habla. Guarda tus archivos: los enlaces de los resultados pueden caducar.
          </p>
        </section>
        {anteriores && canShowLegacy(workspace) ? (
          <section className={css.paso} aria-labelledby="materiales-anteriores">
            <h2 id="materiales-anteriores" className={css.pregunta}>
              Materiales anteriores
            </h2>
            <p className={css.nota}>
              Archivos que ya estaban guardados. Puedes revisarlos y descargarlos; sus ajustes de
              generación no están disponibles y no se usan como ideas nuevas.
            </p>
            <div className={css.ideas}>
              {anteriores.video ? (
                <article className={css.preview}>
                  <video
                    className={`${css.medio} ${css.medioAnterior}`}
                    src={anteriores.video}
                    poster={anteriores.still ?? undefined}
                    controls
                    playsInline
                    preload="metadata"
                  />
                  <div className={css.entrega}>
                    <h3 className={css.ideaTitulo}>Video anterior</h3>
                    {anteriores.color ? (
                      <p className={css.nota}>
                        {COLORES_PACK.find((item) => item.id === anteriores.color)?.etiqueta}
                      </p>
                    ) : null}
                    <div className={css.acciones}>
                      <button
                        className={css.enlace}
                        type="button"
                        disabled={Boolean(descargando)}
                        onClick={() => void descargar(anteriores.video!, "corte-material-anterior")}
                      >
                        Descargar video anterior
                      </button>
                      <a
                        className={css.enlace}
                        href={anteriores.video}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir original
                      </a>
                    </div>
                  </div>
                </article>
              ) : null}
              {anteriores.still ? (
                <article className={css.preview}>
                  <img
                    className={`${css.medio} ${css.medioAnterior}`}
                    src={anteriores.still}
                    alt="Foto guardada anteriormente"
                    loading="lazy"
                  />
                  <div className={css.entrega}>
                    <h3 className={css.ideaTitulo}>Foto anterior</h3>
                    <div className={css.acciones}>
                      <button
                        className={css.enlace}
                        type="button"
                        disabled={Boolean(descargando)}
                        onClick={() => void descargar(anteriores.still!, "corte-foto-anterior")}
                      >
                        Descargar foto anterior
                      </button>
                      <a
                        className={css.enlace}
                        href={anteriores.still}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir original
                      </a>
                    </div>
                  </div>
                </article>
              ) : null}
              {anteriores.ideas.map((item) => (
                <article key={item.id} className={css.preview}>
                  <img
                    className={`${css.medio} ${css.medioAnterior}`}
                    src={item.url}
                    alt={`Idea anterior: ${IDEAS_PACK.find((idea) => idea.id === item.id)?.etiqueta ?? item.id}`}
                    loading="lazy"
                  />
                  <div className={css.entrega}>
                    <h3 className={css.ideaTitulo}>
                      {IDEAS_PACK.find((idea) => idea.id === item.id)?.etiqueta}
                    </h3>
                    {anteriores.colorIdeas ? (
                      <p className={css.nota}>
                        {
                          COLORES_PACK.find((colorItem) => colorItem.id === anteriores.colorIdeas)
                            ?.etiqueta
                        }
                      </p>
                    ) : null}
                    <div className={css.acciones}>
                      <button
                        className={css.enlace}
                        type="button"
                        disabled={Boolean(descargando)}
                        onClick={() => void descargar(item.url, `idea-anterior-${item.id}`)}
                      >
                        Descargar idea anterior
                      </button>
                      <a
                        className={css.enlace}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Abrir original
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Pantalla>
  );
}
