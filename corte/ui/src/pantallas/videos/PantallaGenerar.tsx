/**
 * #/videos/generar · el mismo avatar, el mismo espejo, la sudadera de cuello Perkins.
 * Una foto 9:16 y un video de 10s, solo cuando tú lo pides.
 */
import { useEffect, useState, type ReactElement } from 'react';
import { Boton, EncabezadoPantalla, EstadoVacio, OpcionRadio, Segmentado, SelectorNumero } from '@/componentes';
import { Pantalla } from '@/app';
import { estadoPack, pollPack, startIdeas, startPack } from '@/studio/generate';
import { AJUSTES_PACK, CALIDADES_PACK, COLORES_PACK, DURACION_PACK, IDEAS_PACK, RELACIONES_PACK, guionPack, type AjustesPack, type ColorPack, type IdeaPack } from '@/studio/pack-meta';
import css from './generar.module.css';

type Fase = 'idle' | 'ideas' | 'video' | 'listo';

type IdeaVista = { id: string; url: string };

export function PantallaGenerar(): ReactElement {
  const [color, setColor] = useState<ColorPack>('signal-black');
  const [duracion, setDuracion] = useState(AJUSTES_PACK.duration);
  const [relacion, setRelacion] = useState<AjustesPack['aspectRatio']>(AJUSTES_PACK.aspectRatio);
  const [calidad, setCalidad] = useState<AjustesPack['resolution']>(AJUSTES_PACK.resolution);
  const [fase, setFase] = useState<Fase>('idle');
  const [aviso, setAviso] = useState<string | null>(null);
  const [still, setStill] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [colorListo, setColorListo] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaVista[]>([]);
  const [colorIdeas, setColorIdeas] = useState<string | null>(null);
  const [ideaActiva, setIdeaActiva] = useState<IdeaPack | null>(null);

  useEffect(() => {
    let vivo = true;
    void estadoPack({ data: {} }).then((res) => {
      if (!vivo || !res) return;
      if (res.still) setStill(res.still);
      if (res.video) {
        setVideoUrl(res.video);
        setFase('listo');
      }
      if (res.color) setColorListo(res.color);
      if (res.ideas?.length) setIdeas(res.ideas);
      if (res.colorIdeas) setColorIdeas(res.colorIdeas);
    }).catch(() => undefined);
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    if (!requestId || fase !== 'video') return undefined;
    let vivo = true;
    let timer = 0;
    let intentos = 0;
    const revisar = async (): Promise<void> => {
      intentos += 1;
      const res = await pollPack({ data: { requestId } });
      if (!vivo) return;
      if (!res.ok) {
        setFase('idle');
        setAviso(res.error);
        return;
      }
      if (res.status === 'done') {
        setVideoUrl(res.videoUrl);
        setColorListo(color);
        setFase('listo');
        return;
      }
      if (intentos >= 36) {
        setFase('idle');
        setAviso('El video tardó demasiado.');
        return;
      }
      timer = window.setTimeout(() => void revisar(), 5000);
    };
    timer = window.setTimeout(() => void revisar(), 4000);
    return () => {
      vivo = false;
      window.clearTimeout(timer);
    };
  }, [requestId, fase, color]);

  const ocupado = fase === 'ideas' || fase === 'video';
  const prenda = COLORES_PACK.find((c) => c.id === color) ?? COLORES_PACK[0];
  const nombreListo = COLORES_PACK.find((c) => c.id === colorListo)?.etiqueta;
  const otroColor = colorIdeas !== null && colorIdeas !== color;

  const generarIdeas = async (): Promise<void> => {
    setAviso(null);
    setFase('ideas');
    const res = await startIdeas({ data: { color, aspectRatio: relacion } });
    if (!res.ok) {
      setFase(videoUrl ? 'listo' : 'idle');
      setAviso(res.error);
      return;
    }
    setIdeas(res.ideas.flatMap((i) => (i.url ? [{ id: i.id, url: i.url }] : [])));
    setColorIdeas(res.color);
    const fallos = res.ideas.filter((i) => !i.url);
    setAviso(fallos.length ? fallos.map((f) => f.error).filter(Boolean).join(' ') : null);
    setFase(videoUrl ? 'listo' : 'idle');
  };

  const generar = async (idea: IdeaPack): Promise<void> => {
    const foto = ideas.find((i) => i.id === idea)?.url ?? null;
    setAviso(null);
    setIdeaActiva(idea);
    setVideoUrl(null);
    setStill(foto);
    setRequestId(null);
    setFase('video');
    const res = await startPack({ data: { color, idea, duration: duracion, aspectRatio: relacion, resolution: calidad } });
    if (!res.ok) {
      setFase('idle');
      setAviso(res.error);
      return;
    }
    setStill(res.still ?? foto);
    setRequestId(res.requestId);
  };

  let etiqueta = 'Generar las 4 ideas';
  if (fase === 'ideas') etiqueta = 'Armando las 4 ideas…';
  if (fase === 'video') etiqueta = 'Armando el video…';

  return (
    <Pantalla titulo="Generar video" lista>
      <div className={css.pagina}>
        <EncabezadoPantalla
          titulo="Generar video"
          contexto="El mismo hombre, el mismo espejo, la sudadera de cuello Perkins."
          volver={{ a: '/videos', etiqueta: 'Videos' }}
        />
        <div className={css.cuerpo}>
          <div className={css.form}>
            <fieldset className={css.grupo} disabled={ocupado}>
              <SelectorNumero etiqueta="Duración, en segundos" valor={duracion} min={DURACION_PACK.min} max={DURACION_PACK.max} alCambiar={setDuracion} />
              <Segmentado
                etiqueta="Calidad"
                anchoCompleto
                opciones={CALIDADES_PACK.map((c) => ({ valor: c.id, etiqueta: c.etiqueta }))}
                valor={calidad}
                alCambiar={setCalidad}
              />
              <p className={css.nota}>Con fotos de referencia el tope es 720p. 1080p no entra en este modo.</p>
              <div>
                <p className={css.leyenda} id="relacion-leyenda">Relación</p>
                <div className={css.chips} role="radiogroup" aria-labelledby="relacion-leyenda">
                  {RELACIONES_PACK.map((r) => (
                    <label key={r.id} className={css.chip}>
                      <input type="radio" name="relacion" value={r.id} checked={relacion === r.id} onChange={() => setRelacion(r.id)} />
                      <span>{r.etiqueta}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
            <OpcionRadio
              etiqueta="Color"
              opciones={COLORES_PACK.map((c) => ({
                valor: c.id,
                etiqueta: c.etiqueta,
                descripcion: c.muestra ? 'La muestra pedida es XL' : 'Mismo corte',
              }))}
              valor={color}
              alCambiar={setColor}
            />
            <p className={css.guion}>{guionPack(color)}</p>
            <p className={css.ficha}>
              Cuello Perkins, media cremallera, jalador metálico, paneles más oscuros en hombros y manga. Tallas S a XXL, sin centímetros. Vitrina con descuento: 226 a 227 MXN. Tela según el vendedor: 95% poliéster y 5% elastano, afelpada; no es prueba de laboratorio. Tres reseñas de cinco estrellas: afelpada, viene gruesa y en su talla, la tela muy buena.
            </p>
          </div>
          <div className={css.preview} aria-live="polite">
            {videoUrl ? (
              <video className={css.medio} style={{ aspectRatio: relacion.replace(':', ' / ') }} src={videoUrl} poster={still ?? undefined} controls playsInline />
            ) : still ? (
              <img className={css.medio} style={{ aspectRatio: relacion.replace(':', ' / ') }} src={still} alt={`Sudadera ${prenda.etiqueta} en el espejo`} />
            ) : (
              <EstadoVacio
                icono="Image"
                titulo={fase === 'ideas' ? 'Se están armando las ideas' : 'Primero van las ideas'}
                texto={fase === 'video' ? `Se arma el video de ${duracion} segundos a partir de la idea.` : 'Cuatro fotos: probarla, las manos, el unboxing y el detalle. El video sale después.'}
              />
            )}
            {videoUrl && nombreListo ? <p className={css.notaPie}>Corte en {nombreListo}.</p> : null}
          </div>
        </div>
        <section className={css.paso} aria-labelledby="paso-ideas">
          <p className={css.numero}>01</p>
          <h2 id="paso-ideas" className={css.pregunta}>¿Cómo lo vamos a mostrar?</h2>
          <div className={css.ideas}>
            {IDEAS_PACK.map((idea) => {
              const foto = ideas.find((i) => i.id === idea.id)?.url;
              const activa = ideaActiva === idea.id;
              return (
                <article key={idea.id} className={activa ? `${css.idea} ${css.ideaActiva}` : css.idea}>
                  {foto ? (
                    <img className={css.ideaFoto} style={{ aspectRatio: relacion.replace(':', ' / ') }} src={foto} alt={idea.etiqueta} />
                  ) : (
                    <div className={css.ideaVacia} aria-hidden="true">{idea.numero}</div>
                  )}
                  <div className={css.ideaCuerpo}>
                    <h3 className={css.ideaTitulo}>{idea.etiqueta}</h3>
                    <p className={css.ideaTexto}>{idea.texto}</p>
                    <Boton
                      variante="secundario"
                      icono="Clapperboard"
                      tipo="button"
                      anchoCompleto
                      tamano="sm"
                      deshabilitado={!foto || ocupado}
                      cargando={fase === 'video' && activa}
                      alPulsar={() => void generar(idea.id)}
                    >
                      {fase === 'video' && activa ? 'Armando el video…' : `Video de ${duracion}s`}
                    </Boton>
                  </div>
                </article>
              );
            })}
          </div>
          {otroColor ? <p className={css.nota}>Estas fotos son de otro color. Genera otra vez para {prenda.etiqueta.toLowerCase()}.</p> : null}
          {aviso ? <p className={css.aviso} role="alert">{aviso}</p> : null}
          <Boton variante="primario" icono="Image" tipo="button" anchoCompleto cargando={fase === 'ideas'} deshabilitado={ocupado} alPulsar={() => void generarIdeas()}>
            {etiqueta}
          </Boton>
          <p className={css.nota}>
            Las cuatro usan tu avatar, el mismo espejo y esta sudadera. El video se arma después, de la idea que elijas, y sigue saliendo de las fotos. No habla. Cada idea y cada segundo gastan cupo.
          </p>
        </section>
      </div>
    </Pantalla>
  );
}
