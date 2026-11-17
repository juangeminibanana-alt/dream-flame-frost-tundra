/**
 * Foto con carga progresiva (02 §8, C45, C47). Cuatro estados (data-estado):
 *  - 'pozo'    → color dominante (meta) o --media-bg mientras carga, sin LQIP. Con '?v=0' (imagen aún no descargada en
 *                el hub, C45) el pozo es SIEMPRE neutro (--media-bg, aunque llegue meta) y la foto se pide igual;
 *  - 'lqip'    → pozo + LQIP a tamaño completo (ya es borroso: sin filter) mientras carga la foto;
 *  - 'foto'    → la foto, con fundido de 120 ms solo de opacidad (sin fundido si ya estaba en caché, si hay 6
 *                fundidos en curso o si el scroll va rápido);
 *  - 'mosaico' → no hay URL o la foto falló: mosaico de la tienda con el ícono de la categoría.
 * Meta: `meta` explícito o registroImagenes.leer(url) (@/dominio) con useSyncExternalStore. La variante sale de
 * varianteParaAncho(anchoCss, devicePixelRatio). lazy salvo prioridad 'alta'. En Windows se puede arrastrar a otra app
 * (DownloadURL con la variante original).
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type DragEvent, type ReactElement, type ReactNode } from 'react';
import type { ImagenMeta } from '@/contrato';
import type { FotoProps } from '@firmas/componentes';
import { registroImagenes, urlConVariante, varianteParaAncho } from '@/dominio';
import { CLASE_PROPORCION, MosaicoTienda } from './MosaicoTienda';
import { cx, vars } from './util/clases';
import { useDpr, usePlataformaHtml } from './util/entorno';
import { pedirFundido, soltarFundido } from './util/fundidos';
import css from './Foto.module.css';

export type EstadoFoto = 'pozo' | 'lqip' | 'foto' | 'mosaico';

/** Lee los metadatos de la URL del registro de @/dominio y se vuelve a pintar cuando cambian. */
export function useMetaImagen(url: string | null | undefined): ImagenMeta | undefined {
  useSyncExternalStore(registroImagenes.suscribir, registroImagenes.version, registroImagenes.version);
  return registroImagenes.leer(url);
}

export function esVersionCero(url: string | null | undefined): boolean {
  return !!url && /[?&]v=0(?:&|$)/.test(url);
}

function radioPorOmision(anchoCss: number): NonNullable<FotoProps['radio']> {
  if (anchoCss <= 32) return 'xs';
  if (anchoCss <= 56) return 'sm';
  if (anchoCss <= 96) return 'md';
  return 'lg';
}

const MIME: Readonly<Record<string, string>> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

export interface FotoBaseProps extends FotoProps {
  /** Respaldo propio en lugar del mosaico (p. ej. iniciales del avatar de la cuenta). */
  respaldo?: ReactNode | undefined;
  /** 'contain' centra la foto sobre su LQIP (miniaturas pequeñas, póster de video). */
  ajuste?: 'cover' | 'contain' | undefined;
  /** Sin proporción propia: el pozo llena a su contenedor (posición absoluta). */
  llenar?: boolean | undefined;
  /** Solo galería: pide la foto pero no la revela, para mostrar los estados 'pozo' y 'lqip' quietos. */
  retenerCarga?: boolean | undefined;
}

export function FotoBase(p: FotoBaseProps): ReactElement {
  const plataforma = usePlataformaHtml();
  const dpr = useDpr();
  const metaRegistro = useMetaImagen(p.url);
  // '?v=0' (C45): la imagen aún no se descargó en el hub. Pozo NEUTRO (sin color ni LQIP, aunque llegue meta) y la
  // foto se pide igual: si ya está, aparece; si no, queda el mosaico.
  const versionCero = esVersionCero(p.url);
  const meta = versionCero ? undefined : (p.meta ?? metaRegistro);
  const src = p.url ? urlConVariante(p.url, varianteParaAncho(p.anchoCss, dpr)) : null;
  // Nunca se amplía más de 2× (02 §8.1): si la original es pequeña, se centra en contain sobre su LQIP.
  const pequena = !!meta && meta.w > 0 && p.anchoCss * dpr > meta.w * 2;
  const [estadoCarga, setEstadoCarga] = useState<'cargando' | 'lista' | 'error'>(src ? 'cargando' : 'error');
  const [fundido, setFundido] = useState(false);
  const [srcEstado, setSrcEstado] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const srcPrevio = useRef(src);

  // Cambió la URL o la variante: vuelve a empezar (estado derivado durante el render, patrón de React).
  if (srcEstado !== src) {
    setSrcEstado(src);
    setEstadoCarga(src ? 'cargando' : 'error');
    setFundido(false);
  }
  useEffect(() => {
    srcPrevio.current = src;
  }, [src]);

  // Ya estaba en caché al montar: sin fundido (02 §8.3).
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (p.retenerCarga) return;
    if (img && img.complete && img.naturalWidth > 0 && estadoCarga === 'cargando') setEstadoCarga('lista');
  }, [src, estadoCarga, p.retenerCarga]);

  const alCargar = useCallback((): void => {
    const img = imgRef.current;
    if (p.retenerCarga) return;
    const mostrar = (): void => {
      if (srcPrevio.current !== src) return;
      const animar = pedirFundido();
      if (animar) {
        setFundido(true);
        window.setTimeout(soltarFundido, 180);
      }
      setEstadoCarga('lista');
    };
    if (img && typeof img.decode === 'function') img.decode().then(mostrar, mostrar);
    else mostrar();
  }, [src, p.retenerCarga]);

  const estado: EstadoFoto = estadoCarga === 'error' ? 'mosaico' : estadoCarga === 'lista' ? 'foto' : meta?.lqip ? 'lqip' : 'pozo';
  const conLqip = !!meta?.lqip && estado !== 'mosaico';
  const arrastrable = !!p.arrastrable && plataforma === 'windows' && estado === 'foto' && !!p.url;

  const alArrastrar = (e: DragEvent<HTMLImageElement>): void => {
    if (!p.arrastrable || !p.url) return;
    const original = new URL(urlConVariante(p.url, 'og'), window.location.href).href;
    const nombre = p.arrastrable.nombreArchivo.replace(/[:\r\n]/g, ' ');
    const ext = (nombre.split('.').pop() ?? '').toLowerCase();
    e.dataTransfer.setData('DownloadURL', `${MIME[ext] ?? 'application/octet-stream'}:${nombre}:${original}`);
    e.dataTransfer.setData('text/uri-list', original);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const radio = p.radio ?? radioPorOmision(p.anchoCss);
  const directo = !!p.url && /^https?:\/\//i.test(p.url);
  const respaldo = p.respaldo ?? (
    <MosaicoTienda tienda={p.tienda ?? ''} categoria={p.categoria} anchoCss={p.anchoCss} relleno />
  );

  return (
    <span
      className={cx(css.foto, p.llenar ? css.llenar : css[CLASE_PROPORCION[p.proporcion ?? '1:1']], css[`r${radio}`], p.className)}
      data-estado={estado}
      data-version-cero={versionCero ? '' : undefined}
      style={vars({ '--foto-ancho': `${p.anchoCss}px`, ...(meta?.color ? { '--foto-color': meta.color } : {}) })}
      {...(estado === 'mosaico' && p.alt ? { role: 'img', 'aria-label': p.alt } : {})}
    >
      {conLqip && meta?.lqip ? <img className={css.lqip} src={meta.lqip} alt="" aria-hidden="true" decoding="async" draggable={false} /> : null}
      {src && estadoCarga !== 'error' ? (
        <img
          ref={imgRef}
          key={src}
          className={cx(css.img, (p.ajuste === 'contain' || pequena) && css.contener, estado === 'foto' && css.visible, fundido && css.fundido)}
          src={src}
          alt={p.alt}
          loading={p.prioridad === 'alta' ? 'eager' : 'lazy'}
          decoding="async"
          {...(p.prioridad === 'alta' ? { fetchPriority: 'high' as const } : {})}
          {...(directo ? { referrerPolicy: 'no-referrer' as const } : {})}
          draggable={arrastrable}
          onDragStart={arrastrable ? alArrastrar : undefined}
          onLoad={alCargar}
          onError={() => {
            if (srcPrevio.current === src) setEstadoCarga('error');
          }}
        />
      ) : null}
      {estado === 'mosaico' ? respaldo : null}
      {p.rotulo && estado !== 'mosaico' ? <span className={css.rotulo}>{p.rotulo}</span> : null}
    </span>
  );
}

export function Foto(p: FotoProps): ReactElement {
  return <FotoBase {...p} />;
}
