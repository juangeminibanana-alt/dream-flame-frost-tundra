/**
 * Reproductor oficial de TikTok bajo demanda (C4, C43). SOLO Windows: quien lo usa comprueba esWindows().
 * Póster con [Reproducir aquí]; al pulsar, un <iframe> endurecido:
 *   src="https://www.tiktok.com/player/v1/{contentId}"
 *   sandbox="allow-scripts allow-same-origin allow-presentation"   (sin popups ni navegación superior)
 *   referrerpolicy="strict-origin-when-cross-origin"               (solo en el iframe)
 *   allow="autoplay; fullscreen"
 * Si no carga en 8 s, si no hay internet o si el id no es válido: "No se pudo reproducir aquí" + [Abrir en TikTok].
 */
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Boton } from './Boton';
import { Icono } from './Icono';
import { cx } from './util/clases';
import css from './ReproductorTikTok.module.css';

export const TOPE_CARGA_MS = 8000;
export const SANDBOX_REPRODUCTOR = 'allow-scripts allow-same-origin allow-presentation';
export const REFERRER_REPRODUCTOR = 'strict-origin-when-cross-origin';
export const ALLOW_REPRODUCTOR = 'autoplay; fullscreen';

type Estado = 'poster' | 'cargando' | 'listo' | 'fallo';

export interface ReproductorInternoProps {
  contentId: string;
  titulo: string;
  alAbrirFuera: () => void;
  className?: string | undefined;
  /** Solo galería: muestra de entrada el respaldo "No se pudo reproducir aquí" (no forma parte de la firma). */
  estadoInicial?: 'poster' | 'fallo' | undefined;
}

export function ReproductorTikTok(p: ReproductorInternoProps): ReactElement {
  const [estado, setEstado] = useState<Estado>(p.estadoInicial ?? 'poster');
  const [idPrevio, setIdPrevio] = useState(p.contentId);
  const reloj = useRef<number | null>(null);
  const valido = /^\d{6,32}$/.test(p.contentId);

  // Otro video: vuelve al póster (estado derivado durante el render).
  if (idPrevio !== p.contentId) {
    setIdPrevio(p.contentId);
    setEstado('poster');
  }

  useEffect(() => {
    if (estado !== 'cargando') return undefined;
    reloj.current = window.setTimeout(() => setEstado((e) => (e === 'cargando' ? 'fallo' : e)), TOPE_CARGA_MS);
    const sinRed = (): void => setEstado('fallo');
    window.addEventListener('offline', sinRed);
    return () => {
      if (reloj.current !== null) window.clearTimeout(reloj.current);
      window.removeEventListener('offline', sinRed);
    };
  }, [estado]);

  const reproducir = (): void => {
    if (!valido || (typeof navigator !== 'undefined' && navigator.onLine === false)) {
      setEstado('fallo');
      return;
    }
    setEstado('cargando');
  };

  return (
    <div className={cx(css.reproductor, p.className)} data-estado={estado}>
      {estado === 'cargando' || estado === 'listo' ? (
        <iframe
          className={cx(css.iframe, estado === 'listo' && css.iframeListo)}
          src={`https://www.tiktok.com/player/v1/${p.contentId}`}
          title={p.titulo}
          sandbox={SANDBOX_REPRODUCTOR}
          referrerPolicy={REFERRER_REPRODUCTOR}
          allow={ALLOW_REPRODUCTOR}
          onLoad={() => setEstado((e) => (e === 'cargando' ? 'listo' : e))}
        />
      ) : null}
      {estado === 'poster' ? (
        <div className={css.capa}>
          <span className={css.glifo} aria-hidden="true">
            <Icono nombre="Play" tamano={24} />
          </span>
          <p className={css.texto}>Se reproduce con el reproductor oficial de TikTok.</p>
          <Boton variante="primario" icono="Play" alPulsar={reproducir}>
            Reproducir aquí
          </Boton>
        </div>
      ) : null}
      {estado === 'cargando' ? (
        <div className={css.capa} role="status">
          <span className={cx(css.spinner, 'anim-loop')} aria-hidden="true" />
          <p className={css.texto}>Cargando el video…</p>
        </div>
      ) : null}
      {estado === 'fallo' ? (
        <div className={css.capa} role="alert">
          <span className={css.glifoFallo} aria-hidden="true">
            <Icono nombre="CircleAlert" tamano={24} />
          </span>
          <p className={css.textoFuerte}>No se pudo reproducir aquí</p>
          <p className={css.texto}>Revisa tu conexión o míralo en TikTok.</p>
          <Boton variante="secundario" iconoFinal="ExternalLink" alPulsar={p.alAbrirFuera}>
            Abrir en TikTok
          </Boton>
        </div>
      ) : null}
    </div>
  );
}
