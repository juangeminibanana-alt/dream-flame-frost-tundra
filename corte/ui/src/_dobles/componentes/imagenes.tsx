/* __DOBLE_CORTE__ · doble de @/componentes: imágenes. Foto pinta un <img> con la variante que toca
   (varianteParaAncho + urlConVariante) y el color/LQIP de registroImagenes; sin foto, el mosaico de la tienda. */
import { useState, useSyncExternalStore, type CSSProperties, type ReactElement } from 'react';
import type { ImagenMeta, UrlImagen } from '@/contrato';
import type { FotoProps, MiniaturaVideoProps, ProporcionFoto, TarjetaProductoProps } from '@firmas/componentes';
import { iconoCategoria, inicialesTienda, registroImagenes, tonoTienda, urlConVariante, varianteParaAncho } from '@/dominio';
import { Caja, clases, estilosDoble as css } from '../comun/Caja';

const PROPORCION: Readonly<Record<ProporcionFoto, string>> = { '1:1': '1 / 1', '4:5': '4 / 5', '9:16': '9 / 16' };

function useMeta(url: UrlImagen | null, explicita: ImagenMeta | undefined): ImagenMeta | undefined {
  useSyncExternalStore(registroImagenes.suscribir, registroImagenes.version, registroImagenes.version);
  return explicita ?? registroImagenes.leer(url);
}

function dpr(): number {
  return typeof window !== 'undefined' && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
}

export function MosaicoTienda(p: { tienda: string; categoria?: string | null; anchoCss: number; proporcion?: ProporcionFoto; className?: string }): ReactElement {
  const tono = tonoTienda(p.tienda);
  const estilo: CSSProperties = {
    width: p.anchoCss,
    aspectRatio: PROPORCION[p.proporcion ?? '1:1'],
    background: `var(--av-${tono}-bg)`,
    color: `var(--av-${tono}-fg)`,
  };
  return (
    <div className={clases(css.caja, css.foto, p.className)} style={estilo} data-componente="MosaicoTienda" data-tono={tono}>
      <span className={css.cifra}>{inicialesTienda(p.tienda)}</span>
      <span className={css.nombre}>{iconoCategoria(p.categoria)}</span>
    </div>
  );
}

export function Foto(p: FotoProps): ReactElement {
  const meta = useMeta(p.url, p.meta);
  const [fallo, setFallo] = useState<string | null>(null);
  if (!p.url || fallo === p.url) {
    return (
      <MosaicoTienda
        tienda={p.tienda ?? '—'}
        categoria={p.categoria ?? null}
        anchoCss={p.anchoCss}
        proporcion={p.proporcion ?? '1:1'}
        {...(p.className ? { className: p.className } : {})}
      />
    );
  }
  const variante = varianteParaAncho(p.anchoCss, dpr());
  const src = urlConVariante(p.url, variante);
  const estilo: CSSProperties = { width: p.anchoCss, aspectRatio: PROPORCION[p.proporcion ?? '1:1'] };
  if (meta?.color) estilo.backgroundColor = meta.color;
  if (meta?.lqip) {
    estilo.backgroundImage = `url("${meta.lqip}")`;
    estilo.backgroundSize = 'cover';
  }
  const url = p.url;
  return (
    <div className={clases(css.foto, p.className)} style={estilo} data-componente="Foto" data-variante={variante}>
      <img
        src={src}
        alt={p.alt}
        loading={p.prioridad === 'alta' ? 'eager' : 'lazy'}
        decoding="async"
        draggable={p.arrastrable ? true : undefined}
        onError={() => setFallo(url)}
      />
      {p.rotulo ? <span className={css.nombre}>{p.rotulo}</span> : null}
    </div>
  );
}

export function AvatarTienda(p: { nombre: string; tamano: 16 | 20 | 24 | 32 | 40 | 56; className?: string }): ReactElement {
  const tono = tonoTienda(p.nombre);
  const chico = p.tamano < 20;
  const lado = chico ? 10 : p.tamano;
  const estilo: CSSProperties = {
    width: lado,
    height: lado,
    borderRadius: Math.round(lado * 0.3),
    background: `var(--av-${tono}-bg)`,
    color: `var(--av-${tono}-fg)`,
    display: 'inline-grid',
    placeItems: 'center',
    fontSize: Math.max(9, Math.round(lado * 0.4)),
    fontWeight: 'var(--weight-display)',
  };
  return (
    <span className={p.className} style={estilo} title={p.nombre} aria-hidden data-componente="AvatarTienda" data-tono={tono}>
      {chico ? null : inicialesTienda(p.nombre)}
    </span>
  );
}

export function AvatarCuenta(p: { url: UrlImagen | null; username: string; tamano: 32 | 40; className?: string }): ReactElement {
  if (p.url) {
    return <img className={p.className} src={p.url} alt={`@${p.username}`} width={p.tamano} height={p.tamano} data-componente="AvatarCuenta" />;
  }
  return (
    <span className={clases(css.caja, css.enLinea, p.className)} data-componente="AvatarCuenta" aria-label={`@${p.username}`}>
      {inicialesTienda(p.username)}
    </span>
  );
}

export function MiniaturaVideo(p: MiniaturaVideoProps): ReactElement {
  return (
    <Caja nombre="MiniaturaVideo" props={{ ranking: p.ranking, anchoCss: p.anchoCss }} className={p.className} alPulsar={p.alPulsar} etiqueta={p.etiqueta}>
      {p.url ? (
        <Foto url={p.url} alt="" anchoCss={p.anchoCss} proporcion="9:16" tienda={p.tienda} {...(p.rotulo ? { rotulo: p.rotulo } : {})} {...(p.meta ? { meta: p.meta } : {})} />
      ) : (
        <span className={css.atenuado}>Póster · {p.fechaPoster}</span>
      )}
      <span className={css.cifra}>{p.comision}</span>
      <span className={css.atenuado}>{p.unidades}</span>
      <span>{p.nombre}</span>
    </Caja>
  );
}

export function TarjetaProducto(p: TarjetaProductoProps): ReactElement {
  return (
    <Caja nombre="TarjetaProducto" props={{ ranking: p.ranking }} className={p.className} alPulsar={p.alPulsar}>
      <Foto url={p.imagen} alt={p.nombre} anchoCss={160} tienda={p.tienda} categoria={p.categoria ?? null} {...(p.meta ? { meta: p.meta } : {})} />
      <span className={css.titulo}>{p.nombre}</span>
      {p.tienda ? <span className={css.atenuado}>{p.tienda}</span> : null}
      <span className={css.cifra}>{p.cifraPrincipal}</span>
      {p.cifraSecundaria ? <span className={css.atenuado}>{p.cifraSecundaria}</span> : null}
      {p.chips}
    </Caja>
  );
}

/** Doble: no carga el iframe de TikTok (sin red en desarrollo); muestra el póster y el respaldo «Abrir en TikTok». */
export function ReproductorTikTok(p: { contentId: string; titulo: string; alAbrirFuera: () => void; className?: string }): ReactElement {
  const [pedido, setPedido] = useState(false);
  return (
    <Caja nombre="ReproductorTikTok" props={{ contentId: p.contentId }} className={p.className}>
      <span>{p.titulo}</span>
      {pedido ? <span className={css.atenuado}>No se pudo reproducir aquí</span> : null}
      <div className={css.fila}>
        {!pedido ? (
          <button type="button" className={css.boton} onClick={() => setPedido(true)}>
            Reproducir aquí
          </button>
        ) : null}
        <button type="button" className={css.boton} onClick={p.alAbrirFuera}>
          Abrir en TikTok
        </button>
      </div>
    </Caja>
  );
}
