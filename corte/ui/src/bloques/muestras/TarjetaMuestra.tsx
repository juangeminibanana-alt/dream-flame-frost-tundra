/**
 * TarjetaMuestra (01 §3.7, §4.2, §4.4, §4.6, §4.17; 02 §7.23; lienzo Muestras.png): foto real del producto como
 * protagonista, nombre corto, tienda, variante, chips (TikTok, Tu avance, promesa, copiado sin confirmar, vitrina y hasta
 * 2 razones), fecha de solicitud, precio ≈ y comisión por venta, y la acción principal. Seis variantes:
 *   lista   · fila de la cola (en angosto se apila; Android: deslizar = acción principal / mover o no se puede)
 *   tablero · tarjeta compacta arrastrable de la vista Tablero
 *   agenda  · renglón compacto del día (foto de 48, «Atrasado», ✓)
 *   sesion  · bloque grande de la Sesión de videos (foto arrastrable en Windows)
 *   aviso   · renglón de una muestra dentro de «Avisar a mis tiendas» (lo que se le promete)
 *   tira    · miniatura de 64 de la tira de pendientes del panel «Ponte al día»
 * El nombre accesible del botón principal lleva el anuncio completo para lectores de pantalla (01 §8).
 */
import { useRef, useState, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import type { TarjetaMuestraProps } from '@firmas/bloques';
import { AvatarTienda, Chip, Foto, Icono, Menu } from '@/componentes';
import { vibrar } from '@/plataforma';
import { ETIQUETA_ACCION, ETIQUETA_ETAPA, ETIQUETA_NIVEL, ICONO_ETAPA, fechaPrometidaPorOmision, formato, hoyLocal, textoRazon } from '@/dominio';
import { T } from '../textos';
import { cx, nombreDe, textoSolicitada, useEsAndroid, vars } from '../util/comun';
import { useControlMuestra } from '../useControlMuestra';
import { BotonAccionMuestra, BotonCopiarGuion, BotonGuardarImagen, useAccionPrincipal } from './botones';
import { ChipAvance, ChipCopiadoSinConfirmar, ChipPrioridad, ChipPromesa, ChipTikTok, ChipVitrina, ChipsRazonesBase, razonesVisibles, textoAvance, textoTikTok } from './chips';
import { FichaPrecio, precioVisible, textoTeDeja } from './FichaPrecio';
import { useOpcionesMuestra } from './menuMuestra';
import css from './TarjetaMuestra.module.css';

/** Anuncio completo de la muestra para lectores de pantalla (01 §8). */
export function anuncioMuestra(m: C.MuestraVista): string {
  const partes: string[] = [nombreDe(m.producto), m.tienda.nombre];
  if (m.variante) partes.push(`${T.prefijoVariante} ${m.variante}`);
  partes.push(`${T.prefijoTikTok} ${textoTikTok(m, true)}`);
  if (m.prioridad === 'no_se_puede_etiquetar') partes.push(ETIQUETA_NIVEL.no_se_puede_etiquetar);
  partes.push(`${T.prefijoAvance} ${textoAvance(m.avance)}`);
  if (m.avisos.promesa) partes.push(`${m.avisos.promesa_vencida ? T.promesaVencidaAnuncio : ''}${T.lePrometisteEl} ${formato.fechaConDia(m.avisos.promesa)}`);
  if (m.avisos.copiado_sin_confirmar) partes.push(T.copiadoSinConfirmar);
  for (const r of razonesVisibles(m, 2, true)) partes.push(textoRazon(r, m));
  partes.push(textoSolicitada(m));
  const precio = precioVisible(m.producto);
  if (precio) partes.push(`${precio.texto} ${precio.rotulo}`);
  const deja = textoTeDeja(m.producto);
  if (deja) partes.push(deja);
  return `${partes.join('. ')}.`;
}

function Nueva(): ReactElement {
  return <span className={css.punto} role="img" aria-label={T.nueva} title={T.nueva} />;
}

/** Casilla de escritorio: aparece al pasar el cursor; marca sin abrir (clic en la tarjeta = abrir el detalle). */
function Casilla(p: { marcada: boolean; nombre: string; alMarcar?: (v: boolean) => void }): ReactElement {
  return (
    <label className={css.casilla}>
      <input type="checkbox" checked={p.marcada} onChange={(e) => p.alMarcar?.(e.currentTarget.checked)} aria-label={`${T.marcar}: ${p.nombre}`} />
      <span className={css.caja} aria-hidden="true">
        <Icono nombre="Check" tamano={14} />
      </span>
    </label>
  );
}

/**
 * Modo selección de Android (mantener presionado, 01 §3.3 y §4.2): toda la tarjeta es la casilla. Un solo objetivo de
 * foco y de toque (el botón estirado, con rol de casilla) que marca o desmarca en vez de abrir; la caja de la izquierda
 * solo lo dibuja.
 */
function TocarParaMarcar(p: { m: C.MuestraVista; marcada: boolean; alMarcar?: (v: boolean) => void; children: ReactNode }): ReactElement {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={p.marcada}
      className={cx(css.nombre, css.abrir)}
      aria-label={`${T.marcar}: ${nombreDe(p.m.producto)}, ${p.m.tienda.nombre}`}
      onClick={() => p.alMarcar?.(!p.marcada)}
      data-abrir=""
    >
      {p.children}
    </button>
  );
}

function CajaMarca(p: { marcada: boolean }): ReactElement {
  return (
    <span className={cx(css.casilla, css.casillaDibujo)} aria-hidden="true">
      <span className={cx(css.caja, p.marcada && css.cajaMarcada)}>
        <Icono nombre="Check" tamano={14} />
      </span>
    </span>
  );
}

function MenuMuestra(p: { m: C.MuestraVista }): ReactElement {
  const opciones = useOpcionesMuestra(p.m);
  return <Menu etiqueta={`${T.menuMuestra}: ${nombreDe(p.m.producto)}`} opciones={opciones} className={cx(css.menu)} />;
}

/** Botón estirado sobre toda la tarjeta: un solo objetivo de foco que abre el detalle (con el anuncio completo). */
function Abrir(p: { m: C.MuestraVista; alAbrir?: () => void; children: ReactNode; className?: string }): ReactElement {
  if (!p.alAbrir) return <span className={cx(css.nombre, p.className)}>{p.children}</span>;
  const alAbrir = p.alAbrir;
  return (
    <button type="button" className={cx(css.nombre, css.abrir, p.className)} aria-label={anuncioMuestra(p.m)} onClick={() => alAbrir()} data-abrir="">
      {p.children}
    </button>
  );
}

/**
 * Tienda · variante. La tienda va siempre en el primer renglón, pegada a su avatar (los dos son una sola pieza que no
 * se parte) y recortada con «…» si no cabe. La variante la acompaña si junto a la tienda le caben unas 10 letras (o
 * completa, si es más corta); si no, baja entera a un segundo renglón visible, recortada con «…» solo si tampoco cabe
 * ahí. El «·» que quedaría al inicio de ese segundo renglón se esconde (ver .partes en el CSS).
 */
function Meta(p: { m: C.MuestraVista; conAvatar?: boolean }): ReactElement {
  const { m } = p;
  return (
    <span className={cx(css.partes, css.meta)}>
      <span className={css.partesFila}>
        <span className={css.grupoTienda}>
          {p.conAvatar !== false ? <AvatarTienda nombre={m.tienda.nombre} tamano={16} className={cx(css.avatar)} /> : null}
          <span className={css.tienda}>{m.tienda.nombre}</span>
        </span>
        {m.variante ? (
          <span className={css.grupoVariante}>
            <span className={css.sep} aria-hidden="true">·</span>
            <span className={css.variante}>{m.variante}</span>
          </span>
        ) : null}
      </span>
    </span>
  );
}

/** TikTok no deja etiquetar el producto (01 §2.3: desactivado o sin inventario): no se planea sola ni se le ofrece «Planear». */
function noEtiquetable(m: C.MuestraVista): boolean {
  return m.prioridad === 'no_se_puede_etiquetar';
}

/** Chips de la fila en el orden de 01 §3.7. */
function Chips(p: { m: C.MuestraVista; conRazones?: boolean; conFecha?: boolean; className?: string }): ReactElement {
  const { m } = p;
  return (
    <span className={cx(css.chips, p.className)}>
      <ChipTikTok muestra={m} />
      {noEtiquetable(m) ? <ChipPrioridad nivel="no_se_puede_etiquetar" /> : null}
      <ChipAvance avance={m.avance} />
      <ChipPromesa avisos={m.avisos} etapa={m.avance.etapa} />
      <ChipCopiadoSinConfirmar avisos={m.avisos} />
      <ChipVitrina enVitrina={m.producto.en_vitrina} />
      {p.conRazones !== false ? <ChipsRazonesBase muestra={m} maximo={2} sinPromesa /> : null}
      {p.conFecha ? <span className={css.solicitada}>{textoSolicitada(m)}</span> : null}
    </span>
  );
}

// ---------------------------------------------------------------------------------------------- deslizar (Android)

const UMBRAL_PX = 88;

interface EstadoArrastre {
  x0: number;
  y0: number;
  dx: number;
  horizontal: boolean | null;
  id: number;
  avisado: boolean;
}

/** Deslizar a la derecha = acción principal; a la izquierda = «Mover a otro día» (si tiene fecha) o «No se puede». */
interface Deslizar {
  dx: number;
  arrastrando: boolean;
  manejadores: {
    onPointerDown?: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp?: (e: PointerEvent<HTMLElement>) => void;
    onPointerCancel?: () => void;
    onClickCapture?: (e: MouseEvent<HTMLElement>) => void;
  };
}

function useDeslizar(m: C.MuestraVista, activo: boolean): Deslizar {
  const control = useControlMuestra();
  const [estado, setEstado] = useState<EstadoArrastre | null>(null);
  const ref = useRef<EstadoArrastre | null>(null);
  const deslizo = useRef(false);
  const fijar = (e: EstadoArrastre | null): void => {
    ref.current = e;
    setEstado(e);
  };
  if (!activo) return { dx: 0, manejadores: {}, arrastrando: false };
  return {
    dx: estado?.horizontal ? estado.dx : 0,
    arrastrando: estado?.horizontal === true,
    manejadores: {
      // Un deslizamiento no abre el detalle al soltar.
      onClickCapture: (e) => {
        if (!deslizo.current) return;
        deslizo.current = false;
        e.preventDefault();
        e.stopPropagation();
      },
      onPointerDown: (e) => {
        if (e.pointerType === 'mouse' || (e.target as HTMLElement).closest('button:not([data-abrir]), input, a')) return;
        fijar({ x0: e.clientX, y0: e.clientY, dx: 0, horizontal: null, id: e.pointerId, avisado: false });
      },
      onPointerMove: (e) => {
        const a = ref.current;
        if (!a || a.id !== e.pointerId) return;
        const dx = e.clientX - a.x0;
        const dy = e.clientY - a.y0;
        let horizontal = a.horizontal;
        if (horizontal === null && Math.hypot(dx, dy) > 8) {
          horizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
          if (horizontal) e.currentTarget.setPointerCapture(e.pointerId);
        }
        if (!horizontal) {
          if (horizontal === false) fijar(null);
          return;
        }
        const pasa = Math.abs(dx) >= UMBRAL_PX;
        if (pasa && !a.avisado) vibrar('umbral');
        fijar({ ...a, dx, horizontal, avisado: pasa });
      },
      onPointerUp: (e) => {
        const a = ref.current;
        if (!a || a.id !== e.pointerId) return;
        fijar(null);
        if (a.horizontal) deslizo.current = true;
        if (!a.horizontal || Math.abs(a.dx) < UMBRAL_PX) return;
        vibrar('confirmar');
        if (a.dx > 0) void control.accionPrincipal(m);
        else if (m.avance.fecha_planeada) void control.moverDia(m);
        else void control.noSePuede(m);
      },
      onPointerCancel: () => fijar(null),
    },
  };
}

// ---------------------------------------------------------------------------------------------- variantes

function VarianteLista(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const android = useEsAndroid();
  const accionEtapa = useAccionPrincipal(m);
  // Si TikTok no deja etiquetarla, «Planear» no es la salida (01 §5.1 C: avisar a la tienda y «No puedo hacer este
  // video»); queda en el menú ⋯ por si la usuaria lo quiere de todos modos.
  const accion = accionEtapa === 'planear' && noEtiquetable(m) ? null : accionEtapa;
  const marcable = p.marcable === true;
  const marcada = p.marcada ?? false;
  // Android en modo selección: tocar la tarjeta marca o desmarca (no abre ni se desliza). En Windows la casilla marca y
  // el clic en la tarjeta sigue abriendo el detalle (la casilla aparece al pasar el cursor).
  const tocarMarca = marcable && android;
  // Columna «lado» (Nº de la cola o casilla): en Windows siempre reservada, para que la casilla que aparece al pasar
  // el cursor ocupe el lugar del Nº sin reacomodar la fila. En Android solo aparece al entrar al modo selección.
  const conLado = marcable || !android;
  const deslizable = (p.deslizable ?? android) && accion !== null && !tocarMarca;
  const { dx, manejadores, arrastrando } = useDeslizar(m, deslizable);
  const conAccion = p.conAccion ?? true;
  const nombre = nombreDe(m.producto);
  const izquierda = m.avance.fecha_planeada ? T.moverOtroDia : T.noPuedo;
  return (
    <div className={cx(css.carril, deslizable && css.carrilDeslizable)}>
      {deslizable && dx !== 0 ? (
        <div className={cx(css.fondoGesto, dx > 0 ? css.fondoDerecha : css.fondoIzquierda)} aria-hidden="true">
          <span className={css.gestoTexto}>
            <Icono nombre={dx > 0 ? 'Check' : m.avance.fecha_planeada ? 'CalendarDays' : 'Ban'} tamano={18} />
            {dx > 0 && accion ? ETIQUETA_ACCION[accion] : izquierda}
          </span>
        </div>
      ) : null}
      <article
        className={cx(css.tarjeta, css.lista, conLado && css.conLado, p.seleccionada && css.seleccionada, marcable && marcada && css.marcada, arrastrando && css.arrastrando, p.className)}
        style={dx !== 0 ? vars({ '--dx': `${Math.max(-140, Math.min(140, dx))}px` }) : undefined}
        aria-current={p.seleccionada ? 'true' : undefined}
        data-solicitud={m.application_id}
        data-marcada={marcable ? String(marcada) : undefined}
        {...manejadores}
      >
        <div className={css.lado}>
          {tocarMarca ? (
            <CajaMarca marcada={marcada} />
          ) : marcable ? (
            <Casilla marcada={marcada} nombre={nombre} {...(p.alMarcar ? { alMarcar: p.alMarcar } : {})} />
          ) : m.posicion_cola !== null ? (
            <span className={css.posicion} aria-hidden="true">
              {m.avance.fijada ? <Icono nombre="Pin" tamano={14} /> : formato.numero(m.posicion_cola)}
            </span>
          ) : null}
        </div>
        <Foto
          url={m.producto.imagen}
          alt={nombre}
          anchoCss={64}
          proporcion="1:1"
          radio="md"
          tienda={m.tienda.nombre}
          categoria={m.producto.categoria}
          className={cx(css.foto)}
        />
        <div className={css.cuerpo}>
          <span className={css.filaNombre}>
            {p.esNueva ? <Nueva /> : null}
            {tocarMarca ? (
              <TocarParaMarcar m={m} marcada={marcada} {...(p.alMarcar ? { alMarcar: p.alMarcar } : {})}>
                {nombre}
              </TocarParaMarcar>
            ) : (
              <Abrir m={m} {...(p.alAbrir ? { alAbrir: p.alAbrir } : {})}>
                {nombre}
              </Abrir>
            )}
          </span>
          <Meta m={m} />
          <Chips m={m} conFecha className={cx(css.chipsLista)} />
        </div>
        {/* Precio + acciones: en ancho son dos columnas de la fila; en angosto, un renglón que se parte si no cabe. */}
        <div className={css.pie}>
          <FichaPrecio producto={m.producto} compacta className={cx(css.precio)} />
          <div className={css.acciones}>
            {/* En el modo selección de Android las acciones van en la barra de la selección, no en cada tarjeta. */}
            {conAccion && accion !== null && !tocarMarca ? <BotonAccionMuestra muestra={m} tamano="md" className={cx(css.boton)} /> : null}
            <MenuMuestra m={m} />
          </div>
        </div>
      </article>
    </div>
  );
}

/** Fecha que acompaña a la etapa en la vista Tablero (la columna ya dice la etapa): «jue 12 nov», «sáb 14 nov, 6:30 p. m.». */
export function fechaDeEtapa(a: C.AvanceMuestra): string | null {
  switch (a.etapa) {
    case 'planeada':
    case 'video_listo':
      return a.fecha_planeada ? formato.fechaConDia(a.fecha_planeada) : null;
    case 'programada':
      return a.programada_para_at !== null ? `${formato.fechaConDia(a.programada_para_at)}, ${formato.hora(a.programada_para_at)}` : null;
    case 'publicada':
      return a.fecha_publicada ? formato.fechaConDia(a.fecha_publicada) : null;
    default:
      return null;
  }
}

/**
 * Tablero (01 §4.2 «Vista Tablero»): tarjeta compacta de columna angosta —imagen de 48, nombre corto en 2 líneas, tienda,
 * chip de fecha y de promesa—. La etapa la dice la columna; el menú ⋯ va abajo junto a la acción para que el nombre
 * tenga todo el ancho junto a la foto.
 */
function VarianteTablero(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const nombre = nombreDe(m.producto);
  const avisada = m.avance.etapa === 'publicada' && m.avisos.ultimo_enviado_at !== null;
  const fecha = fechaDeEtapa(m.avance);
  const conAccion = p.conAccion ?? true;
  return (
    <article
      className={cx(css.tarjeta, css.tablero, p.seleccionada && css.seleccionada, p.className)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/x-corte-muestra', m.application_id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      aria-current={p.seleccionada ? 'true' : undefined}
      data-solicitud={m.application_id}
    >
      <div className={css.tableroArriba}>
        <Foto url={m.producto.imagen} alt={nombre} anchoCss={48} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto48)} />
        <div className={css.cuerpo}>
          <span className={css.filaNombre}>
            {p.esNueva ? <Nueva /> : null}
            <Abrir m={m} className={cx(css.nombre2)} {...(p.alAbrir ? { alAbrir: p.alAbrir } : {})}>
              {nombre}
            </Abrir>
          </span>
          <span className={css.tiendaTablero}>{m.tienda.nombre}</span>
        </div>
      </div>
      {fecha || m.avisos.promesa || avisada ? (
        <span className={css.chips}>
          {fecha ? (
            <Chip tono="neutro" icono={ICONO_ETAPA[m.avance.etapa]} titulo={`${T.prefijoAvance} ${textoAvance(m.avance)}`}>
              {fecha}
            </Chip>
          ) : null}
          <ChipPromesa avisos={m.avisos} etapa={m.avance.etapa} className={cx(css.chipPartible)} />
          {avisada ? (
            <span className={css.avisada} title={T.tiendaAvisada}>
              <Icono nombre="MessageCircle" tamano={14} etiqueta={T.tiendaAvisada} />
              <Icono nombre="Check" tamano={14} />
            </span>
          ) : null}
        </span>
      ) : null}
      <div className={css.tableroPie}>
        {conAccion ? <BotonAccionMuestra muestra={m} tamano="sm" anchoCompleto={false} className={cx(css.botonTablero)} /> : null}
        {/* Siempre a la derecha, también cuando la etapa no tiene acción (publicada). */}
        <span className={css.tableroMenu}>
          <MenuMuestra m={m} />
        </span>
      </div>
    </article>
  );
}

function VarianteAgenda(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const nombre = nombreDe(m.producto);
  const hoy = hoyLocal();
  const etapa = m.avance.etapa;
  const atrasado = etapa === 'planeada' && m.avance.fecha_planeada !== null && m.avance.fecha_planeada < hoy;
  const hecho = etapa === 'video_listo' || etapa === 'programada' || etapa === 'publicada';
  return (
    <article className={cx(css.tarjeta, css.agenda, p.seleccionada && css.seleccionada, atrasado && css.atrasado, p.className)} data-solicitud={m.application_id} aria-current={p.seleccionada ? 'true' : undefined}>
      <Foto url={m.producto.imagen} alt={nombre} anchoCss={48} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto48)} />
      <div className={css.cuerpo}>
        <Abrir m={m} className={cx(css.nombre1)} {...(p.alAbrir ? { alAbrir: p.alAbrir } : {})}>
          {nombre}
        </Abrir>
        {/* Tienda · promesa: la promesa va junto a la tienda si cabe completa; si no, baja a su propio renglón (y la
            fecha nunca se parte ni se pierde bajo «…»). */}
        <span className={cx(css.partes, css.metaAgenda)}>
          <span className={css.partesFila}>
            <span className={cx(css.partePrimera, css.recorte)}>{m.tienda.nombre}</span>
            {m.avisos.promesa && !m.avisos.promesa_vencida ? (
              <span className={css.parteTexto}>
                <span className={css.sep} aria-hidden="true">·</span>
                <span className={css.textoParte}>
                  {T.lePrometisteEl} <span className={css.sinPartir}>{formato.fechaConDia(m.avisos.promesa)}</span>
                </span>
              </span>
            ) : null}
          </span>
        </span>
      </div>
      <span className={css.estadoAgenda}>
        {atrasado ? (
          <span className={css.atrasadoChip}>{T.atrasado}</span>
        ) : hecho ? (
          <span className={css.hecho} title={ETIQUETA_ETAPA[etapa]}>
            <Icono nombre="Check" tamano={16} etiqueta={ETIQUETA_ETAPA[etapa]} />
          </span>
        ) : null}
        <MenuMuestra m={m} />
      </span>
    </article>
  );
}

function VarianteSesion(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const nombre = nombreDe(m.producto);
  const android = useEsAndroid();
  return (
    <div className={css.contenedorSesion}>
      <article className={cx(css.sesion, p.className)} data-solicitud={m.application_id}>
        <Foto
          url={m.producto.imagen}
          alt={nombre}
          anchoCss={520}
          proporcion={android ? '4:5' : '1:1'}
          radio="xl"
          prioridad="alta"
          tienda={m.tienda.nombre}
          categoria={m.producto.categoria}
          {...(!android ? { arrastrable: { nombreArchivo: nombre } } : {})}
          className={cx(css.fotoSesion)}
        />
        <div className={css.sesionDatos}>
          <span className={css.sesionTienda}>
            <AvatarTienda nombre={m.tienda.nombre} tamano={24} />
            {m.tienda.nombre}
          </span>
          <Abrir m={m} className={cx(css.sesionNombre)} {...(p.alAbrir ? { alAbrir: p.alAbrir } : {})}>
            {nombre}
          </Abrir>
          {m.variante ? <p className={css.sesionVariante}>{m.variante.split(' / ').join(' · ')}</p> : null}
          <span className={css.chips}>
            <ChipVitrina enVitrina={m.producto.en_vitrina} />
            <ChipPromesa avisos={m.avisos} etapa={m.avance.etapa} />
            <ChipsRazonesBase muestra={m} maximo={2} sinPromesa />
          </span>
          <FichaPrecio producto={m.producto} />
          <div className={css.sesionBotones}>
            <BotonGuardarImagen producto={m.producto} />
            <BotonCopiarGuion muestra={m} />
          </div>
        </div>
      </article>
    </div>
  );
}

function VarianteAviso(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const nombre = nombreDe(m.producto);
  const fecha = fechaPrometidaPorOmision(m.avance);
  // El contenedor mide el ancho de la fila: en angosto el chip de avance baja debajo del texto en vez de comérselo.
  return (
    <div className={css.contenedorAviso}>
      <article className={cx(css.tarjeta, css.aviso, p.seleccionada && css.seleccionada, p.className)} data-solicitud={m.application_id}>
        <Foto url={m.producto.imagen} alt={nombre} anchoCss={40} proporcion="1:1" radio="sm" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.foto40)} />
        <div className={css.cuerpo}>
          <Abrir m={m} className={cx(css.nombre1)} {...(p.alAbrir ? { alAbrir: p.alAbrir } : {})}>
            {nombre}
          </Abrir>
          <span className={cx(css.partes, css.metaAgenda, fecha === null && css.sinFecha)}>
            <span className={css.partesFila}>
              <span className={css.partePrimera}>
                {fecha ? (
                  <>
                    {T.lePrometes}: <span className={css.sinPartir}>{formato.fechaConDia(fecha)}</span>
                  </>
                ) : (
                  T.sinFechaAviso
                )}
              </span>
              {m.variante ? (
                <span className={css.grupoVariante}>
                  <span className={css.sep} aria-hidden="true">·</span>
                  <span className={css.variante}>{m.variante}</span>
                </span>
              ) : null}
            </span>
          </span>
        </div>
        <ChipAvance avance={m.avance} className={cx(css.chipAviso, css.chipPartible)} />
      </article>
    </div>
  );
}

function VarianteTira(p: TarjetaMuestraProps): ReactElement {
  const m = p.muestra;
  const nombre = nombreDe(m.producto);
  const contenido = (
    <Foto url={m.producto.imagen} alt="" anchoCss={64} proporcion="1:1" radio="md" tienda={m.tienda.nombre} categoria={m.producto.categoria} className={cx(css.fotoTira)} />
  );
  return p.alAbrir ? (
    <button type="button" className={cx(css.tira, p.seleccionada && css.seleccionada, p.className)} onClick={p.alAbrir} aria-label={`${nombre}, ${m.tienda.nombre}`} title={`${nombre} · ${m.tienda.nombre}`} data-solicitud={m.application_id}>
      {contenido}
      {p.esNueva ? <Nueva /> : null}
    </button>
  ) : (
    <span className={cx(css.tira, p.className)} role="img" aria-label={`${nombre}, ${m.tienda.nombre}`} data-solicitud={m.application_id}>
      {contenido}
    </span>
  );
}

export function TarjetaMuestra(p: TarjetaMuestraProps): ReactElement {
  switch (p.variante) {
    case 'lista':
      return <VarianteLista {...p} />;
    case 'tablero':
      return <VarianteTablero {...p} />;
    case 'agenda':
      return <VarianteAgenda {...p} />;
    case 'sesion':
      return <VarianteSesion {...p} />;
    case 'aviso':
      return <VarianteAviso {...p} />;
    case 'tira':
      return <VarianteTira {...p} />;
  }
}
