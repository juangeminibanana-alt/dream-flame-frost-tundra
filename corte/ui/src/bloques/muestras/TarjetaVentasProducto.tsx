/**
 * TarjetaVentasProducto (01 §4.3 tarjeta 5, §2.4 reglas 3–4): solo si tus videos ya venden este producto.
 *   A · Posible video     «Este video empezó a vender el producto el {28 sep}, {17} días después de que pediste la
 *                         muestra. ¿Es el video de esta muestra?» [Sí, vincular] [No es este]
 *   B · Ya tienes un video «Ya tienes un video que vende este producto (desde el {13 sep}). TikTok no lo contó para esta
 *                         muestra.» [Usarlo en el mensaje] → después de avisar: [La tienda aceptó este video]. Nunca
 *                         cambia la etapa por sí sola.
 *   C · Sin fecha de solicitud «Ya vendes este producto en {12} videos…» [Elegir de mis videos]
 * En todas: los 3 mejores videos (portada = foto del producto, comisión, primera venta) y «Ver todos».
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, Foto, Icono, useToast } from '@/componentes';
import { navegar } from '@/app';
import { useAcciones } from '@/datos';
import { diasEntre, fechaLocalDe, formato, nuevoId, sumarDias } from '@/dominio';
import { abrirMensajeEn } from '../control/contexto';
import { T } from '../textos';
import { cx, nombreDe } from '../util/comun';
import { useControlMuestra } from '../useControlMuestra';
import css from './TarjetaVentasProducto.module.css';

/** Video anterior a la muestra (tarjeta B): el que empezó a vender primero. */
export function videoPrevio(videos: C.VideoDeProducto[]): C.VideoDeProducto | null {
  let previo: C.VideoDeProducto | null = null;
  for (const v of videos) if (previo === null || v.primera_venta < previo.primera_venta) previo = v;
  return previo;
}

/** «Posible video» (01 §2.6): empezó a vender en o después de la solicitud + 7 días (o de la solicitud si está por
 *  vencer o en revisión) y no se descartó. Nunca sin fecha de solicitud. */
export function posibleVideo(m: C.MuestraVista, videos: C.VideoDeProducto[], descartados: readonly string[]): C.VideoDeProducto | null {
  if (m.solicitada_at === null) return null;
  const solicitud = fechaLocalDe(m.solicitada_at);
  const desde = m.grupo === 'por_vencer' || m.grupo === 'en_revision' ? solicitud : sumarDias(solicitud, 7);
  const candidatos = videos.filter((v) => v.primera_venta >= desde && !descartados.includes(v.content_id));
  candidatos.sort((a, b) => (a.primera_venta < b.primera_venta ? -1 : a.primera_venta > b.primera_venta ? 1 : 0));
  return candidatos[0] ?? null;
}

/** ¿Ya se envió un aviso «Ya tengo video» de esta muestra? (entonces aparece «La tienda aceptó este video»). */
export function yaAvisoVideoPrevio(detalle: C.MuestraDetalleResponse): boolean {
  return detalle.avisos.some((a) => a.plantilla_id === 'ya_tengo_video' && a.marcado_enviado_at !== null && a.quitado_at === null && a.solicitud_ids.includes(detalle.muestra.application_id));
}

function FilaVideo(p: { v: C.VideoDeProducto; nombre: string; tienda: string; destacado?: boolean }): ReactElement {
  return (
    <li className={cx(css.video, p.destacado && css.destacado)}>
      <Foto url={p.v.miniatura} alt={`${T.fotoDelProducto}: ${p.nombre}`} anchoCss={44} proporcion="1:1" radio="sm" tienda={p.tienda} className={cx(css.miniatura)} />
      <span className={css.videoTextos}>
        <span className={css.videoId}>{T.videoId(formato.idCorto(p.v.content_id))}</span>
        <span className={css.videoMeta}>{T.vendeDesdeElFila(formato.fechaCorta(p.v.primera_venta))}</span>
      </span>
      <span className={css.videoCifra}>{formato.dinero(p.v.comision_estimada_centavos)}</span>
    </li>
  );
}

export function TarjetaVentasProducto(p: { detalle: C.MuestraDetalleResponse; className?: string }): ReactElement | null {
  const { detalle } = p;
  const m = detalle.muestra;
  const control = useControlMuestra();
  const acciones = useAcciones();
  const toast = useToast();
  const [descartadosLocal, setDescartadosLocal] = useState<string[]>([]);
  const videos = detalle.videos_del_producto;
  if (videos.length === 0) return null;

  const nombre = nombreDe(m.producto);
  const plan = detalle.planes.find((x) => x.application_id === m.application_id) ?? null;
  const descartados = [...(plan?.sugerencias_descartadas ?? []), ...descartadosLocal];
  const mejores = [...videos].sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, 3);
  const solicitud = m.solicitada_at !== null ? fechaLocalDe(m.solicitada_at) : null;
  const publicada = m.avance.etapa === 'publicada';

  const descartar = async (contentId: string): Promise<void> => {
    setDescartadosLocal((d) => [...d, contentId]);
    const r = plan
      ? await acciones.editarPlan(plan.id, { sugerencias_descartadas: [...plan.sugerencias_descartadas, contentId], rev: plan.rev })
      : await acciones.crearPlan({ id: nuevoId(), titulo: nombre.slice(0, 200), application_id: m.application_id, product_id: m.producto.product_id, tienda_key: m.tienda.tienda_key, estado: m.avance.etapa, sugerencias_descartadas: [contentId] });
    if (r.estado === 'conflicto') toast.mostrar({ texto: T.conflicto, tono: 'info' });
    else if (r.estado === 'error') toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
    else toast.mostrar({ texto: T.noVolveremosSugerir, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => { setDescartadosLocal((d) => d.filter((x) => x !== contentId)); void r.deshacer(); } }, duracion_ms: 6000 });
  };

  let cuerpo: ReactElement | null = null;
  const tipo = publicada ? null : m.tarjeta_video;
  if (tipo === 'posible_video') {
    const v = posibleVideo(m, videos, descartados);
    if (v && solicitud) {
      const dias = diasEntre(solicitud, v.primera_venta);
      cuerpo = (
        <div className={css.caso}>
          <p className={css.texto}>
            {T.posibleVideoAntes} <strong>{formato.fechaCorta(v.primera_venta)}</strong>
            {T.posibleVideoDespues(formato.numero(dias), dias === 1)}
          </p>
          <ul className={css.videos}>
            <FilaVideo v={v} nombre={nombre} tienda={m.tienda.nombre} destacado />
          </ul>
          <div className={css.botones}>
            <Boton variante="primario" tamano="sm" icono="Link" alPulsar={() => void control.vincularVideo(m, v.content_id)}>
              {T.siVincular}
            </Boton>
            <Boton variante="fantasma" tamano="sm" alPulsar={() => void descartar(v.content_id)}>
              {T.noEsEste}
            </Boton>
          </div>
        </div>
      );
    }
  } else if (tipo === 'video_previo') {
    const v = videoPrevio(videos);
    if (v) {
      const antes = solicitud !== null && v.primera_venta < solicitud;
      const aviso = yaAvisoVideoPrevio(detalle);
      cuerpo = (
        <div className={css.caso}>
          <p className={css.texto}>
            {T.videoPrevioAntes} <strong>{formato.fechaCorta(v.primera_venta)}</strong>
            {T.videoPrevioDespues}
            {antes ? ` ${T.antesDePedir}` : ''}
          </p>
          <ul className={css.videos}>
            <FilaVideo v={v} nombre={nombre} tienda={m.tienda.nombre} destacado />
          </ul>
          <div className={css.botones}>
            <Boton variante={aviso ? 'secundario' : 'primario'} tamano="sm" icono="MessageCircle" alPulsar={() => abrirMensajeEn({ solicitud: m.application_id }, { plantilla: 'ya_tengo_video' })}>
              {T.usarloMensaje}
            </Boton>
            {aviso ? (
              <Boton variante="primario" tamano="sm" icono="Check" alPulsar={() => void control.vincularVideo(m, v.content_id)}>
                {T.laTiendaAcepto}
              </Boton>
            ) : null}
          </div>
          <p className={css.nota}>
            <Icono nombre="Info" tamano={14} /> {T.noCambiaAvance}
          </p>
        </div>
      );
    }
  } else if (tipo === 'sin_fecha') {
    const vp = m.ventas_producto;
    cuerpo = (
      <div className={css.caso}>
        <p className={css.texto}>
          {T.yaVendesEn} <strong>{T.nVideos(formato.numero(vp.videos), vp.videos === 1)}</strong>
          {T.yaVendesResto(formato.numero(vp.pedidos_validos), formato.dinero(vp.comision_estimada_centavos))}
        </p>
        <div className={css.botones}>
          <Boton variante="secundario" tamano="sm" icono="SquarePlay" alPulsar={() => void control.vincularVideo(m)}>
            {T.elegirDeMisVideos}
          </Boton>
        </div>
      </div>
    );
  }

  return (
    <section className={cx(css.tarjeta, p.className)} aria-label={T.ventasProducto}>
      <header className={css.cabeza}>
        <h3 className={css.titulo}>{T.ventasProducto}</h3>
        {videos.length > 3 ? (
          <button type="button" className={css.verTodos} onClick={() => navegar(`/productos/${encodeURIComponent(m.producto.product_id)}`)}>
            {T.verTodos} ({formato.numero(videos.length)})
          </button>
        ) : null}
      </header>
      {cuerpo}
      <div className={css.mejores}>
        <span className={css.subtitulo}>{T.tusVideosQueMasVenden}</span>
        <ul className={css.videos}>
          {mejores.map((v) => (
            <FilaVideo key={v.content_id} v={v} nombre={nombre} tienda={m.tienda.nombre} />
          ))}
        </ul>
      </div>
    </section>
  );
}
