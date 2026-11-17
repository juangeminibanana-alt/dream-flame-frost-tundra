/**
 * Videos en Inicio (01 §4.1 #9, C4): «Tu video estrella de la semana» (máxima comisión de los últimos 7 días, con
 * «{17} videos vendieron esta semana») y la fila «Tus videos que más venden · 30 días». Portada = la real del video
 * ('/img/v/…', rev. 5: Display API conectada) o, si no hay, la foto del producto que más vendió en ese video, rotulada
 * «Foto del producto»; sin imagen, el póster tipográfico de MiniaturaVideo.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { EnlaceRuta, navegar } from '@/app';
import { Banda, EstadoVacio, Esqueleto, Foto, Icono, MiniaturaVideo, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion } from './Estados';
import { etiquetaVideo, portadaVideo, textoUnidades } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

const rutaVideo = (v: C.FilaVideo): string => `/videos/${encodeURIComponent(v.content_id)}`;

function Miniatura(p: { v: C.FilaVideo; ranking?: number; nombre: string; ancho: number; className?: string }): ReactElement {
  const v = p.v;
  const portada = portadaVideo(v);
  return (
    <MiniaturaVideo
      url={portada.url}
      {...(portada.delProducto ? { rotulo: T.estrella.rotulo } : {})}
      {...(p.ranking !== undefined ? { ranking: p.ranking } : {})}
      comision={formato.dinero(v.comision_estimada_centavos)}
      unidades={textoUnidades(v.unidades)}
      nombre={p.nombre}
      fechaPoster={formato.fechaCorta(v.primera_venta)}
      tienda={v.tienda_principal}
      anchoCss={p.ancho}
      etiqueta={etiquetaVideo(p.ranking ?? 1, v, p.nombre)}
      alPulsar={() => navegar(rutaVideo(v))}
      {...(p.className ? { className: p.className } : {})}
    />
  );
}

/**
 * Portada 9:16 del video estrella (lienzo Main.png / MovilInicio.png): la portada real del video o la foto del producto
 * a sangre con su rótulo, y solo «▶ 8 unidades» encima. La comisión NO se repite sobre la foto: ya es la cifra grande de
 * la tarjeta (con MiniaturaVideo saldría dos veces). Sin portada, el mosaico de la tienda de <Foto>.
 */
function PortadaEstrella(p: { v: C.FilaVideo; nombre: string; ancho: number }): ReactElement {
  const v = p.v;
  // El rótulo va arriba (como en MiniaturaVideo) y las unidades abajo, como el lienzo: el `rotulo` de <Foto> se pinta
  // abajo a la izquierda y chocaría con «▶ 8 unidades».
  const { url, delProducto } = portadaVideo(v);
  return (
    <EnlaceRuta a={rutaVideo(v)} className={css.estrellaPortada} aria-label={etiquetaVideo(1, v, p.nombre)}>
      <Foto url={url} alt="" anchoCss={p.ancho} proporcion="9:16" radio="lg" tienda={v.tienda_principal} className={css.estrellaFoto} />
      {delProducto ? (
        <span className={css.estrellaRotulo} aria-hidden="true">
          {T.estrella.rotulo}
        </span>
      ) : null}
      <span className={css.estrellaUnidades} aria-hidden="true">
        <Icono nombre="Play" tamano={14} />
        {textoUnidades(v.unidades)}
      </span>
    </EnlaceRuta>
  );
}

export interface VideoEstrellaProps {
  video: C.FilaVideo | null;
  nombre: string;
  /** Videos con ventas en los 7 días. */
  vendieron: number;
  cargando: boolean;
  error: ErrorHub | null;
  compacto: boolean;
  alReintentar: () => void;
}

export function VideoEstrella(p: VideoEstrellaProps): ReactElement {
  let cuerpo: ReactElement;
  if (p.cargando) {
    cuerpo = (
      <div className={css.estrella}>
        <Esqueleto forma="bloque" className={css.esqEstrella} />
        <div className={css.estrellaTextos}>
          <Esqueleto forma="titulo" ancho="70%" />
          <Esqueleto forma="texto" lineas={2} />
        </div>
      </div>
    );
  } else if (p.error) {
    cuerpo = (
      <>
        <h2 className={css.tarjetaTitulo}>{T.estrella.titulo}</h2>
        <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />
      </>
    );
  } else if (!p.video) {
    cuerpo = (
      <>
        <h2 className={css.tarjetaTitulo}>{T.estrella.titulo}</h2>
        <EstadoVacio icono="SquarePlay" titulo={T.estrella.sinVideo} texto={T.estrella.sinVideoTexto} className={css.vacioTarjeta} />
      </>
    );
  } else {
    const v = p.video;
    cuerpo = (
      <div className={css.estrella}>
        <PortadaEstrella v={v} nombre={p.nombre} ancho={p.compacto ? 120 : 168} />
        <div className={css.estrellaTextos}>
          <h2 className={css.tarjetaTitulo}>{T.estrella.titulo}</h2>
          <p className={css.estrellaCifra}>{formato.dinero(v.comision_estimada_centavos)}</p>
          <p className={css.estrellaNota}>{T.estrella.nota(p.vendieron, formato.numero(p.vendieron))}</p>
          <p className={css.estrellaProducto}>
            <span className={css.estrellaNombre}>{p.nombre}</span>
            {v.tienda_principal ? <span className={css.estrellaVende}>{v.tienda_principal}</span> : null}
          </p>
          <span className={css.empuje} />
          <EnlaceRuta a="/videos" className={css.enlacePie}>
            {T.estrella.verVideos}
            <Icono nombre="ChevronRight" tamano={16} />
          </EnlaceRuta>
        </div>
      </div>
    );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjetaSeccion}>
      <section aria-label={T.estrella.titulo} className={css.seccionInterna}>
        {cuerpo}
      </section>
    </Tarjeta>
  );
}

export interface TopVideosProps {
  videos: C.FilaVideo[];
  nombres: Map<string, string>;
  compacto: boolean;
}

export function TopVideos(p: TopVideosProps): ReactElement | null {
  if (p.videos.length === 0) return null;
  return (
    <Banda titulo={T.topVideos.titulo} accion={{ etiqueta: T.topVideos.verTodos, a: '/videos' }} className={css.topVideos}>
      <ol className={css.rielVideos} aria-label={T.topVideos.lista} data-compacto={p.compacto ? '' : undefined}>
        {p.videos.map((v, i) => (
          <li key={v.content_id} className={css.rielElemento}>
            <Miniatura v={v} ranking={i + 1} nombre={p.nombres.get(v.content_id) ?? T.video.sinNombre(formato.idCorto(v.content_id))} ancho={p.compacto ? 148 : 200} className={css.rielMiniatura} />
          </li>
        ))}
      </ol>
    </Banda>
  );
}
