/**
 * Hoja «¿Tienes el enlace del video?» (Marcar publicada) y «Vincular un video» (01 §4.3 Publicar, §2.4 regla 3–4):
 * pegar el enlace (con los errores exactos de 01), [Elegir de mis videos] (los que venden este producto, el más reciente
 * primero), aceptar un «Posible video» o «La tienda aceptó este video», y paquetes: «Este video también puede contar
 * para: …. ¿Cuenta para las dos?» [Sí, vincular ambas] [Solo esta] (un solo Deshacer).
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, CampoTexto, Foto, Hoja, Icono } from '@/componentes';
import { useConsulta } from '@/datos';
import { contentIdDeEnlace, esEnlaceTikTok, esPendiente, formato, hoyLocal, opCambioEtapa, type DatosEtapa } from '@/dominio';
import { useOperaciones, useUsername } from '../control/operaciones';
import { T } from '../textos';
import { cuenta, cx, nombreDe, usuarioDeEnlace } from '../util/comun';
import comun from '../util/comun.module.css';
import { MuestraEnHoja } from './MuestraEnHoja';
import css from './hojas.module.css';

export interface HojaPublicarProps {
  m: C.MuestraVista;
  origen: 'etapa' | 'vincular';
  /** content_id sugerido: «Posible video» (tarjeta A) o el video previo (tarjeta B, «La tienda aceptó este video»). */
  sugerido?: string;
  abierta: boolean;
  alTerminar: () => void;
}

type Paso = 'enlace' | 'lista' | 'paquete';

function VideoOpcion(p: { v: C.VideoDeProducto; nombre: string; tienda: string; elegido: boolean; alElegir: () => void }): ReactElement {
  return (
    <li>
      <button type="button" className={css.opcion} aria-pressed={p.elegido} onClick={p.alElegir}>
        <Foto url={p.v.miniatura} alt={`${T.fotoDelProducto}: ${p.nombre}`} anchoCss={40} proporcion="1:1" radio="sm" tienda={p.tienda} className={cx(css.portada)} />
        <span className={css.opcionTexto}>
          <span className={css.opcionTitulo}>{T.videoId(formato.idCorto(p.v.content_id))}</span>
          <span className={css.opcionMeta}>
            {T.vendioDesdeEl(formato.fechaCorta(p.v.primera_venta))} · {T.deComision(formato.dinero(p.v.comision_estimada_centavos))}
          </span>
        </span>
        {p.elegido ? <Icono nombre="Check" tamano={18} className={cx(css.opcionMarca)} /> : <span />}
      </button>
    </li>
  );
}

export function HojaPublicar(p: HojaPublicarProps): ReactElement {
  const { m } = p;
  const ops = useOperaciones();
  const username = useUsername();
  const detalle = useConsulta('muestra', { id: m.application_id });
  const deTienda = useConsulta('muestras', { tienda: m.tienda.tienda_key });
  const videos = useMemo(() => detalle.datos?.videos_del_producto ?? [], [detalle.datos]);
  const nombre = nombreDe(m.producto);

  const [enlace, setEnlace] = useState('');
  const [elegido, setElegido] = useState<string | null>(p.sugerido ?? null);
  const [otraCuentaOk, setOtraCuentaOk] = useState(false);
  const [paso, setPaso] = useState<Paso>('enlace');
  const [guardando, setGuardando] = useState(false);

  const previo = m.tarjeta_video === 'video_previo';
  const sugerido = p.sugerido ? videos.find((v) => v.content_id === p.sugerido) ?? null : null;
  const textoEnlace = enlace.trim();
  const enlaceMalo = textoEnlace !== '' && !esEnlaceTikTok(textoEnlace);
  const usuario = textoEnlace !== '' && !enlaceMalo ? usuarioDeEnlace(textoEnlace) : null;
  const otraCuenta = usuario !== null && username !== null && usuario.toLocaleLowerCase('es-MX') !== username.toLocaleLowerCase('es-MX') && !otraCuentaOk;
  const idPegado = textoEnlace !== '' && !enlaceMalo ? contentIdDeEnlace(textoEnlace) : null;
  const videoPegado = idPegado ? videos.find((v) => v.content_id === idPegado) ?? null : null;

  /** Otras pendientes de la misma tienda que el mismo video puede cumplir (paquete o mismo producto, 01 §4.3). */
  const paquete = useMemo(() => {
    const todas = deTienda.datos?.items ?? [];
    return todas.filter((x) => x.application_id !== m.application_id && x.tienda.tienda_key === m.tienda.tienda_key && esPendiente(x)
      && (x.producto.product_id === m.producto.product_id || (m.razones.includes('paquete') && x.razones.includes('paquete'))));
  }, [deTienda.datos, m.application_id, m.producto.product_id, m.razones]);

  const datos = (): DatosEtapa => {
    if (textoEnlace !== '') return { enlace_video: textoEnlace, vinculo_origen: 'manual' };
    if (elegido) {
      const v = videos.find((x) => x.content_id === elegido);
      let origen: C.VinculoOrigen = 'manual';
      if (p.sugerido && elegido === p.sugerido) origen = previo ? 'video_previo_aceptado' : m.tarjeta_video === 'posible_video' ? 'sugerido_por_ventas' : 'manual';
      return { content_id: elegido, enlace_video: v?.enlace ?? null, vinculo_origen: origen };
    }
    return {};
  };

  const hayVideo = textoEnlace !== '' || elegido !== null;

  const guardar = async (conPaquete: boolean): Promise<void> => {
    setGuardando(true);
    const d = datos();
    if (conPaquete && paquete.length > 0) {
      const hoy = hoyLocal();
      const lista = [m, ...paquete].map((x) => opCambioEtapa(x, 'publicada', d, hoy));
      await ops.aplicarLote(lista, T.marcamosPublicadas(cuenta(lista.length, T.muestra)), { solicitud: m.application_id });
    } else {
      await ops.aplicarEtapa(m, 'publicada', d, { texto: previo && d.vinculo_origen === 'video_previo_aceptado' ? T.toastPublicadaPrevio : T.toastPublicada });
    }
    setGuardando(false);
    p.alTerminar();
  };

  const continuar = (): void => {
    if (hayVideo && paquete.length > 0) setPaso('paquete');
    else void guardar(false);
  };

  const titulo = p.sugerido && previo ? T.laTiendaAcepto : p.origen === 'vincular' ? T.vincularVideo : T.tienesEnlace;

  if (paso === 'paquete') {
    const otra = paquete[0];
    return (
      <Hoja
        abierta={p.abierta}
        titulo={titulo}
        alCerrar={p.alTerminar}
        pie={
          <div className={css.pie}>
            <Boton variante="secundario" cargando={guardando} alPulsar={() => void guardar(false)}>
              {T.soloEsta}
            </Boton>
            <Boton variante="primario" cargando={guardando} alPulsar={() => void guardar(true)}>
              {T.siVincularAmbas}
            </Boton>
          </div>
        }
      >
        <div className={css.cuerpo}>
          <MuestraEnHoja m={m} />
          <p className={css.pregunta}>
            {T.tambienCuentaPara(paquete.map((x) => nombreDe(x.producto)).join(', '), paquete.length === 1 ? T.lasDos : T.lasN(formato.numero(paquete.length + 1)))}
          </p>
          {otra ? <MuestraEnHoja m={otra} /> : null}
        </div>
      </Hoja>
    );
  }

  const pieEnlace = (
    <div className={css.pie}>
      {p.origen === 'etapa' && !p.sugerido ? (
        <Boton variante="secundario" cargando={guardando} alPulsar={() => void guardar(false)} deshabilitado={hayVideo}>
          {T.sinEnlace}
        </Boton>
      ) : (
        <Boton variante="fantasma" alPulsar={p.alTerminar}>
          {T.cancelar}
        </Boton>
      )}
      <Boton variante="primario" cargando={guardando} deshabilitado={!hayVideo || enlaceMalo || otraCuenta} alPulsar={continuar}>
        {p.sugerido ? T.siEsEste : T.guardar}
      </Boton>
    </div>
  );

  return (
    <Hoja abierta={p.abierta} titulo={titulo} alCerrar={p.alTerminar} pie={pieEnlace}>
      <div className={css.cuerpo}>
        <MuestraEnHoja m={m} />
        {p.sugerido ? (
          <div className={css.confirmar}>
            <Foto url={sugerido?.miniatura ?? m.producto.imagen} alt={`${T.fotoDelProducto}: ${nombre}`} anchoCss={64} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} />
            <div className={css.confirmarTextos}>
              <span className={css.pregunta}>{T.esEsteVideo}</span>
              <span className={css.idVideo}>{T.videoId(formato.idCorto(p.sugerido))}</span>
              {sugerido ? (
                <span className={css.ayuda}>
                  {T.empezoAVenderEl(formato.fechaCorta(sugerido.primera_venta))} · {T.deComision(formato.dinero(sugerido.comision_estimada_centavos))}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <CampoTexto
              etiqueta={T.pegaEnlace}
              valor={enlace}
              alCambiar={(v) => {
                setEnlace(v);
                setOtraCuentaOk(false);
                if (v.trim() !== '') setElegido(null);
              }}
              tipo="url"
              placeholder={username !== null && username !== undefined ? T.placeholderEnlaceDe(username) : T.placeholderEnlace}
              error={enlaceMalo ? T.enlaceInvalido : null}
              autoFoco
            />
            {otraCuenta && usuario ? (
              <div className={comun.aviso} role="alert">
                <Icono nombre="CircleAlert" tamano={18} />
                <div className={css.cuerpo}>
                  <span>{T.enlaceOtraCuenta(usuario)}</span>
                  <div className={comun.botones}>
                    <Boton tamano="sm" variante="secundario" alPulsar={() => setOtraCuentaOk(true)}>
                      {T.usarDeTodosModos}
                    </Boton>
                    <Boton tamano="sm" variante="fantasma" alPulsar={() => setEnlace('')}>
                      {T.cambiarEnlace}
                    </Boton>
                  </div>
                </div>
              </div>
            ) : null}
            {idPegado && !otraCuenta ? (
              <div className={css.confirmar}>
                <Foto url={videoPegado?.miniatura ?? m.producto.imagen} alt={`${T.fotoDelProducto}: ${nombre}`} anchoCss={64} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} />
                <div className={css.confirmarTextos}>
                  <span className={css.pregunta}>{T.esEsteVideo}</span>
                  <span className={css.idVideo}>{T.videoId(formato.idCorto(idPegado))}</span>
                  {videoPegado ? <span className={css.ayuda}>{T.vendeEsteProductoDesde(formato.fechaCorta(videoPegado.primera_venta))}</span> : null}
                </div>
              </div>
            ) : null}
            <hr className={css.separador} />
            {paso === 'lista' || videos.length <= 3 ? (
              <section aria-label={T.elegirDeMisVideos} className={css.cuerpo}>
                <span className={comun.overline}>{T.elegirDeMisVideos}</span>
                {videos.length === 0 ? (
                  <p className={css.ayuda}>{detalle.cargando ? T.cargandoVideos : T.sinVideosProducto}</p>
                ) : (
                  <ul className={css.lista}>
                    {videos.map((v) => (
                      <VideoOpcion
                        key={v.content_id}
                        v={v}
                        nombre={nombre}
                        tienda={m.tienda.nombre}
                        elegido={elegido === v.content_id && textoEnlace === ''}
                        alElegir={() => {
                          setEnlace('');
                          setElegido((x) => (x === v.content_id ? null : v.content_id));
                        }}
                      />
                    ))}
                  </ul>
                )}
              </section>
            ) : (
              <Boton variante="secundario" icono="SquarePlay" alPulsar={() => setPaso('lista')}>
                {T.elegirDeMisVideos} ({formato.numero(videos.length)})
              </Boton>
            )}
          </>
        )}
      </div>
    </Hoja>
  );
}
