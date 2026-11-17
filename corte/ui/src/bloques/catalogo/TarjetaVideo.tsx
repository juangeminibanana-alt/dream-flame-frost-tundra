/**
 * TarjetaVideo (01 §4.12 «Tarjeta (cuadrícula)», C4): portada 9:16 = foto del producto que más vendió en ese video,
 * rotulada «Foto del producto», con el lugar y la comisión encima; debajo «{413} pedidos · {17} % reembolsos»,
 * «{tienda} · {producto}» y «Vendiendo ahora» (última venta válida en los últimos 7 días).
 * TarjetaProductoFila (01 §4.13 «Más vendidos»): tarjeta de producto con imagen 1:1, «{1,234} unidades · ${12,345}»,
 * «{12} videos» y los chips «Fue muestra» y «En tu vitrina».
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { Chip, MiniaturaVideo, TarjetaProducto } from '@/componentes';
import { formato, hoyLocal, nombreCorto, sumarDias } from '@/dominio';
import { T } from '../textos';
import { cx } from '../util/comun';
import css from './TarjetaVideo.module.css';

/** Última venta válida en los últimos 7 días (01 §4.12 «Vendiendo ahora»). */
export function vendiendoAhora(v: Pick<C.FilaVideo, 'ultima_venta' | 'pedidos_validos'>, hoy: C.FechaLocal = hoyLocal()): boolean {
  return v.pedidos_validos > 0 && v.ultima_venta >= sumarDias(hoy, -6);
}

/** Nombre visible de un video: título (siempre null desde C4) → producto principal → «Video 7677…3012». */
export function nombreVideo(v: Pick<C.FilaVideo, 'titulo' | 'content_id'>, nombreProducto?: string | null): string {
  return v.titulo ?? (nombreProducto && nombreProducto.length > 0 ? nombreProducto : T.videoId(formato.idCorto(v.content_id)));
}

export function TarjetaVideo(p: { video: C.FilaVideo; ranking?: number; nombreProducto?: string | null; anchoCss: number; alAbrir?: () => void; className?: string }): ReactElement {
  const v = p.video;
  const nombre = nombreVideo(v, p.nombreProducto);
  const comision = formato.dinero(v.comision_estimada_centavos);
  const unidades = `${formato.numero(v.unidades)} ${v.unidades === 1 ? T.unidad : T.unidades}`;
  const ahora = vendiendoAhora(v);
  const etiqueta = [
    p.ranking !== undefined ? T.lugar(p.ranking) : null,
    nombre,
    T.deComision(comision),
    `${formato.numero(v.pedidos)} ${T.pedidos}`,
    T.deReembolsos(formato.porcentaje(v.tasa_reembolso)),
    v.tienda_principal,
    T.vendeDesdeEl(formato.fechaCorta(v.primera_venta)),
    ahora ? T.vendiendoAhora : null,
  ].filter(Boolean).join(', ');
  return (
    <article className={cx(css.video, p.className)} style={{ maxWidth: `${Math.max(120, p.anchoCss)}px` }}>
      <MiniaturaVideo
        url={v.miniatura}
        {...(v.miniatura_origen === 'producto' ? { rotulo: T.fotoDelProducto } : {})}
        {...(p.ranking !== undefined ? { ranking: p.ranking } : {})}
        comision={comision}
        unidades={unidades}
        nombre={nombre}
        fechaPoster={formato.fechaCorta(v.primera_venta)}
        tienda={v.tienda_principal}
        anchoCss={p.anchoCss}
        etiqueta={etiqueta}
        {...(p.alAbrir ? { alPulsar: p.alAbrir } : {})}
      />
      <div className={css.datos}>
        <span className={css.titulo} title={nombre}>
          {nombre}
        </span>
        {/* Dos partes que no se cortan: en una tarjeta angosta los reembolsos bajan al siguiente renglón en vez de «…». */}
        <span className={css.metaPartes}>
          <span className={css.parte}>
            {formato.numero(v.pedidos)} {T.pedidos}
          </span>
          <span className={css.sep} aria-hidden="true">·</span>
          <span className={css.parte}>
            {formato.porcentaje(v.tasa_reembolso)} {T.reembolsos}
          </span>
        </span>
        {v.tienda_principal ? <span className={css.meta}>{v.tienda_principal}</span> : null}
        {ahora ? (
          <span className={css.vivo}>
            <span className={css.punto} aria-hidden="true" />
            {T.vendiendoAhora}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function TarjetaProductoFila(p: { producto: C.FilaProducto; ranking?: number; alAbrir?: () => void; className?: string }): ReactElement {
  const f = p.producto;
  const nombre = f.titulo_corto ?? nombreCorto(f.titulo);
  const chips: ReactElement[] = [];
  if (f.videos > 0) chips.push(<Chip key="v" tono="neutro" icono="Play">{`${formato.numero(f.videos)} ${f.videos === 1 ? T.video : T.videos}`}</Chip>);
  if (f.es_muestra) chips.push(<Chip key="m" tono="marca" icono="Package">{T.fueMuestra}</Chip>);
  if (f.en_vitrina === true) chips.push(<Chip key="e" tono="ok" icono="Check">{T.enVitrina}</Chip>);
  if (!f.con_ficha) chips.push(<Chip key="f" tono="neutro" icono="Info">{T.sinFicha}</Chip>);
  return (
    <TarjetaProducto
      imagen={f.imagen}
      nombre={nombre || T.productoId(formato.idCorto(f.product_id))}
      tienda={f.tienda_nombre}
      cifraPrincipal={formato.dinero(f.comision_estimada_centavos)}
      cifraSecundaria={`${formato.numero(f.unidades)} ${f.unidades === 1 ? T.unidad : T.unidades}`}
      chips={chips.length > 0 ? <>{chips}</> : undefined}
      {...(p.ranking !== undefined ? { ranking: p.ranking } : {})}
      {...(p.alAbrir ? { alPulsar: p.alAbrir } : {})}
      className={cx(p.className)}
    />
  );
}
