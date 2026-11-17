/**
 * Héroe «Ponte al día» (01 §4.1, 02 §7.23): el único panel con chaflán y el único número héroe («Te faltan 12 videos de
 * muestras», con la cifra pareja como en el lienzo). La fotografía de la muestra que toca es la protagonista. PanelFirma
 * conserva su relleno (28/30; 18 en celular):
 *  - ancho (Windows): la foto es una tarjeta en la columna izquierda, dentro del relleno, con el bloque «Siguiente»
 *    (tienda, nombre corto y hasta 2 chips) sobre su velo; a la derecha, título, barra de etapas, UNA acción principal
 *    según la tabla de 01 §4.1 (con el paso de recorrido heroe_inicio) y la tira de pendientes con fotos y «+N»;
 *  - compacto (celular, 02 §5.3): foto 1:1 a todo lo ancho con el velo, botón a todo lo ancho y la tira fuera del panel.
 */
import { useState, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { EnlaceRuta, navegar, useRecorrido } from '@/app';
import { ChipsRazones, useControlMuestra } from '@/bloques';
import { AvatarTienda, BarraEtapas, BurbujaRecorrido, Boton, Chip, Foto, Icono, PanelFirma, Ticket } from '@/componentes';
import { formato, textoRazon, type ConteosTrabajo } from '@/dominio';
import { useAltoFotoQueCabe, veloAjustado } from './cabe';
import { destacadaDe, nombreProducto, segmentosEtapas, tiraDe, totalBarra, type EstadoHeroe } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

export interface HeroeProps {
  estado: EstadoHeroe;
  conteos: ConteosTrabajo;
  /** Pendientes en el orden que se muestra (lista estable). */
  cola: C.MuestraVista[];
  /** Pendientes que no se pueden etiquetar (línea «1 no se puede etiquetar · Avisar a la tienda»). */
  noSePuede: C.MuestraVista[];
  conPlan: boolean;
  compacto: boolean;
  provisional: boolean;
  ordenNuevo: { hay: boolean; aplicar: () => void };
}

const rutaMuestra = (m: C.MuestraVista): string => `/muestras/m/${encodeURIComponent(m.application_id)}`;

/** Fotos de la tira que se ven sin desplazar a 1440 (a 1280 caben 6 de 64 + 12): las demás quedan tras el desvanecido. */
export const FOTOS_TIRA_EN_PLIEGUE = 8;

/**
 * Bloque «Siguiente» sobre el velo de la foto: tienda (con variante), nombre corto y, sobre una franja de grafito al
 * 72 % (02 §5.3), 2 chips como máximo. Es decorativo para los lectores: el enlace lleva todo el texto.
 */
function VeloSiguiente(p: { m: C.MuestraVista; provisional: boolean; chips?: 0 | 1 | 2 }): ReactElement {
  // `chips` = cuántos caben en total (02 §5.3: 2 sobre la foto). El chip provisional (si aplica) ocupa uno de esos
  // lugares y nunca se esconde: normal, provisional + 1 razón o 2 razones; foto ajustada de alto, 1 chip (el provisional
  // manda) o ninguno. Las razones siguen completas en la etiqueta del enlace.
  const maximo = p.chips ?? 2;
  const razones = Math.max(0, maximo - (p.provisional ? 1 : 0));
  const conChips = maximo > 0 && (p.provisional || p.m.razones.length > 0);
  return (
    <span className={css.velo} aria-hidden="true">
      <span className={css.veloSobre}>{T.heroe.siguiente}</span>
      <span className={css.veloTienda}>
        <AvatarTienda nombre={p.m.tienda.nombre} tamano={24} />
        <span className={css.recorte}>
          {p.m.tienda.nombre}
          {p.m.variante ? ` · ${p.m.variante}` : ''}
        </span>
      </span>
      <span className={css.veloNombre}>{nombreProducto(p.m)}</span>
      {conChips ? (
        <span className={css.chipsFoto}>
          {p.provisional ? (
            <Chip tono="info" icono="Hourglass">
              {T.heroe.provisional}
            </Chip>
          ) : null}
          {razones > 0 ? <ChipsRazones muestra={p.m} maximo={razones} /> : null}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Foto protagonista: a sangre en la columna (ancho) o 1:1 a todo lo ancho (compacto). Abre el detalle. En compacto,
 * `alto` (useAltoFotoQueCabe) la baja de alto solo si el botón principal no cabría en el primer pliegue (02 §5.3).
 */
function FotoDestacada(p: { m: C.MuestraVista; compacto: boolean; provisional: boolean; alto?: number | null }): ReactElement {
  const nombre = nombreProducto(p.m);
  const razones = p.m.razones.slice(0, 2).map((r) => textoRazon(r, p.m));
  const etiqueta = [T.heroe.abrirSiguiente(nombre, p.m.tienda.nombre), ...(p.provisional ? [T.heroe.provisional] : []), ...razones].join('. ');
  const alto = p.compacto && typeof p.alto === 'number' ? p.alto : null;
  // Con menos alto, el velo se aprieta para no subir por encima de la foto (veloAjustado).
  const { nivel, chips } = veloAjustado(alto, p.provisional);
  return (
    <div
      className={css.heroeFoto}
      data-compacto={p.compacto ? '' : undefined}
      data-foto-heroe=""
      data-ajustada={nivel ?? undefined}
      style={alto !== null ? { height: alto, aspectRatio: 'auto' } : undefined}
    >
      <EnlaceRuta a={rutaMuestra(p.m)} className={css.heroeFotoEnlace} aria-label={etiqueta}>
        <Foto
          url={p.m.producto.imagen}
          alt={nombre}
          anchoCss={p.compacto ? 358 : 440}
          proporcion={p.compacto ? '1:1' : '4:5'}
          radio={p.compacto ? 'lg' : 'xs'}
          prioridad="alta"
          tienda={p.m.tienda.nombre}
          categoria={p.m.producto.categoria}
          arrastrable={{ nombreArchivo: `${p.m.producto.product_id}.jpg` }}
          className={css.fotoLlena}
        />
        <VeloSiguiente m={p.m} provisional={p.provisional} chips={chips} />
      </EnlaceRuta>
    </div>
  );
}

/**
 * Tira de pendientes. `enPliegue` = cuántas de las primeras fotos caen en el primer pliegue (en Windows la tira vive
 * dentro del héroe, a la vista): esas usan prioridad 'alta' (sin lazy), como la foto protagonista. En celular la tira
 * va debajo del panel, fuera del pliegue, y todas cargan perezosas.
 */
function Tira(p: { cola: C.MuestraVista[]; excluir: string | null; enPliegue?: number; className?: string }): ReactElement | null {
  const { visibles, mas } = tiraDe(p.cola, p.excluir);
  if (visibles.length === 0) return null;
  const enPliegue = p.enPliegue ?? 0;
  return (
    <ul className={`${css.tira}${p.className ? ` ${p.className}` : ''}`} aria-label={T.heroe.tira}>
      {visibles.map((m, i) => {
        const nombre = nombreProducto(m);
        return (
          <li key={m.application_id} className={css.tiraElemento}>
            <EnlaceRuta a={rutaMuestra(m)} className={css.tiraFoto} aria-label={T.heroe.tiraFoto(nombre, m.tienda.nombre)}>
              <Foto
                url={m.producto.imagen}
                alt=""
                anchoCss={64}
                proporcion="1:1"
                radio="md"
                prioridad={i < enPliegue ? 'alta' : 'normal'}
                tienda={m.tienda.nombre}
                categoria={m.producto.categoria}
              />
            </EnlaceRuta>
          </li>
        );
      })}
      {mas > 0 ? (
        <li className={css.tiraElemento}>
          <EnlaceRuta a="/muestras" className={css.tiraMas} aria-label={T.heroe.tiraMas(mas)}>
            +{formato.numero(mas)}
          </EnlaceRuta>
        </li>
      ) : null}
    </ul>
  );
}

function Titulo(p: { n: number; compacto: boolean }): ReactElement {
  const cifra = formato.numero(p.n);
  return (
    <h2 className={css.heroeTitulo} aria-label={T.heroe.titulo(p.n, cifra, p.compacto)}>
      <span aria-hidden="true">
        {T.heroe.antes(p.n)} <span className={css.heroeNumero}>{cifra}</span> <span className={css.heroeDespues}>{T.heroe.despues(p.n, p.compacto)}</span>
      </span>
    </h2>
  );
}

/** Acción principal + secundaria según el estado (una sola primaria por vista, 02 §7.1). */
function Acciones(p: { estado: EstadoHeroe; compacto: boolean }): ReactElement | null {
  const control = useControlMuestra();
  const e = p.estado;
  let principal: ReactNode = null;
  let secundaria: ReactNode = null;
  const enlace = (texto: string, accion: () => void): ReactNode => (
    <button type="button" className={css.enlace} onClick={accion}>
      {texto}
      <Icono nombre="ChevronRight" tamano={16} />
    </button>
  );
  switch (e.tipo) {
    case 'sin_plan': {
      principal = (
        <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" anchoCompleto={p.compacto} alPulsar={() => navegar('/muestras/plan')}>
          {T.heroe.armarPlan}
        </Boton>
      );
      const s = e.siguiente;
      if (s) secundaria = enlace(T.heroe.planearSoloEsta, () => void control.planear(s));
      break;
    }
    case 'hoy': {
      const m = e.primero;
      principal =
        e.accion === 'marcar_publicada' ? (
          <Boton variante="primario" tamano="lg" icono="CircleCheckBig" anchoCompleto={p.compacto} alPulsar={() => void control.cambiarEtapa(m, 'publicada')}>
            {T.heroe.marcarPublicada}
          </Boton>
        ) : (
          <Boton variante="primario" tamano="lg" icono="Clapperboard" anchoCompleto={p.compacto} alPulsar={() => navegar('/muestras/sesion')}>
            {T.heroe.empezarSesion}
          </Boton>
        );
      secundaria = enlace(T.heroe.verAgenda, () => navegar('/muestras/agenda'));
      break;
    }
    case 'nada_hoy':
      principal = (
        <Boton variante="primario" tamano="lg" icono="CalendarDays" anchoCompleto={p.compacto} alPulsar={() => navegar('/muestras/agenda')}>
          {T.heroe.verAgenda}
        </Boton>
      );
      break;
    case 'atrasado':
      principal = (
        <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" anchoCompleto={p.compacto} alPulsar={() => navegar('/muestras/agenda?atrasadas=1')}>
          {T.heroe.ponermeAlCorriente}
        </Boton>
      );
      break;
    case 'al_dia':
      principal = (
        <Boton variante="primario" tamano="lg" iconoFinal="ArrowRight" anchoCompleto={p.compacto} alPulsar={() => navegar('/videos')}>
          {T.heroe.verVentasVideos}
        </Boton>
      );
      break;
    default:
      return null;
  }
  return (
    <div className={css.acciones} data-compacto={p.compacto ? '' : undefined}>
      <span className={css.accionPrincipal} data-cta="">
        {principal}
      </span>
      {secundaria}
    </div>
  );
}

/** Líneas bajo el botón: «Tiendas avisadas 0 de 30 · Avisar» (solo con plan) y «1 no se puede etiquetar · Avisar a la tienda ›». */
function LineasAvisos(p: { conteos: ConteosTrabajo; conPlan: boolean; noSePuede: C.MuestraVista[]; compacto: boolean }): ReactElement | null {
  const control = useControlMuestra();
  const primera = p.noSePuede[0];
  const avisadas = p.conPlan && p.conteos.tiendas_por_avisar > 0;
  if (!avisadas && !primera) return null;
  // En celular cada línea se centra bajo «Planear solo esta ›» y el enlace baja a su propio renglón (sin el «·» colgando).
  return (
    <ul className={css.lineasAviso} data-compacto={p.compacto ? '' : undefined}>
      {avisadas ? (
        <li>
          <span className={css.lineaAvisoTexto}>
            {T.heroe.avisadas} <b className={css.mono}>{T.heroe.avisadasCifra(formato.numero(p.conteos.tiendas_avisadas), formato.numero(p.conteos.tiendas_con_pendientes))}</b>
          </span>
          <span className={css.separador} aria-hidden="true">·</span>
          <EnlaceRuta a="/muestras/avisos" className={css.enlaceChico}>
            {T.heroe.avisar}
            <Icono nombre="ChevronRight" tamano={14} />
          </EnlaceRuta>
        </li>
      ) : null}
      {primera ? (
        <li>
          <span className={css.lineaAvisoTexto}>
            <span className={css.puntoAtencion} aria-hidden="true" />
            <span>{T.heroe.noSePuede(p.noSePuede.length)}</span>
          </span>
          <span className={css.separador} aria-hidden="true">·</span>
          <button type="button" className={css.enlaceChico} onClick={() => control.abrirMensaje({ solicitud: primera.application_id })}>
            {T.heroe.avisarTienda}
            <Icono nombre="ChevronRight" tamano={14} />
          </button>
        </li>
      ) : null}
    </ul>
  );
}

function OrdenNuevo(p: { ordenNuevo: HeroeProps['ordenNuevo'] }): ReactElement | null {
  if (!p.ordenNuevo.hay) return null;
  return (
    <button type="button" className={css.ordenNuevo} onClick={p.ordenNuevo.aplicar}>
      <Icono nombre="RefreshCw" tamano={14} />
      <span>
        {T.heroe.ordenNuevo} · <b>{T.heroe.actualizar}</b>
      </span>
    </button>
  );
}

export function Heroe(p: HeroeProps): ReactElement | null {
  const recorrido = useRecorrido('heroe_inicio');
  const e = p.estado;
  const destacada = e.tipo === 'nada' ? null : destacadaDe(e);
  // Celular: la foto 1:1 cede alto solo si «Armar mi plan» no cabría en el primer pliegue (02 §5.3, cabe.ts).
  const [panelCompacto, setPanelCompacto] = useState<HTMLDivElement | null>(null);
  const altoFoto = useAltoFotoQueCabe(panelCompacto, p.compacto && destacada !== null);
  if (e.tipo === 'nada') return null;
  const total = totalBarra(p.conteos);
  const contador = T.heroe.progreso(formato.numero(p.conteos.publicadas), formato.numero(total));

  const acciones = (
    <BurbujaRecorrido visible={recorrido.visible} texto={recorrido.texto} esUltimo={recorrido.esUltimo} alSiguiente={recorrido.siguiente} alEntendido={recorrido.entendido}>
      <div className={css.accionesMarco}>
        <Acciones estado={e} compacto={p.compacto} />
        <LineasAvisos conteos={p.conteos} conPlan={p.conPlan} noSePuede={p.noSePuede} compacto={p.compacto} />
      </div>
    </BurbujaRecorrido>
  );

  if (e.tipo === 'al_dia') {
    const videos = formato.numero(e.publicadas);
    const tiendas = formato.numero(e.tiendas);
    return (
      <PanelFirma className={css.heroe}>
        <div className={css.heroeAlDia} data-compacto={p.compacto ? '' : undefined}>
          <Ticket variante="al_dia" titulo={T.heroe.alDiaTicket} subtitulo={T.heroe.alDiaTexto(videos, tiendas)} renglones={[]} total={T.heroe.alDiaTotal(videos, tiendas)} className={css.heroeTicket} />
          <div className={css.heroeTexto}>
            <p className={css.sobretitulo}>{T.heroe.sobretitulo}</p>
            <h2 className={css.heroeTituloAlDia}>{T.heroe.alDiaTitulo}</h2>
            <p className={css.heroeSub}>{T.heroe.alDiaTexto(videos, tiendas)}</p>
            {acciones}
          </div>
        </div>
      </PanelFirma>
    );
  }

  const n = p.conteos.pendientes;
  const lineaPlan = e.tipo === 'hoy' || e.tipo === 'nada_hoy' || e.tipo === 'atrasado' ? T.heroe.conPlan(formato.fechaConDia(e.termina), formato.fechaConDia(e.publica)) : null;
  const cabecera = (
    <>
      <p className={css.sobretitulo}>{T.heroe.sobretitulo}</p>
      <div className={css.heroeTitulos}>
        <Titulo n={n} compacto={p.compacto} />
        <p className={css.heroeSub}>{T.heroe.subtitulo(p.conteos.tiendas_con_pendientes, formato.numero(p.conteos.tiendas_con_pendientes))}</p>
      </div>
      {e.tipo === 'atrasado' ? (
        <p className={css.atraso}>
          <Icono nombre="History" tamano={16} />
          {T.heroe.atraso(e.n)}
        </p>
      ) : null}
      {e.tipo === 'nada_hoy' ? <p className={css.heroeLinea}>{T.heroe.nadaHoy(e.siguienteDia ? formato.fechaConDia(e.siguienteDia) : null)}</p> : null}
      {lineaPlan ? <p className={css.heroeLineaTenue}>{lineaPlan}</p> : null}
      <BarraEtapas segmentos={segmentosEtapas(p.conteos)} total={total} contador={contador} tamano="inicio" leyenda={!p.compacto} className={css.heroeBarra} />
    </>
  );

  if (p.compacto) {
    return (
      <>
        <PanelFirma className={css.heroe}>
          <div className={css.heroeCompacto} ref={setPanelCompacto}>
            {cabecera}
            {destacada ? <FotoDestacada m={destacada} compacto provisional={p.provisional} alto={altoFoto} /> : null}
            <OrdenNuevo ordenNuevo={p.ordenNuevo} />
            {acciones}
          </div>
        </PanelFirma>
        <Tira cola={p.cola} excluir={destacada?.application_id ?? null} className={css.tiraSuelta} />
      </>
    );
  }

  return (
    <PanelFirma className={css.heroe}>
      <div className={css.heroeRejilla} data-con-foto={destacada ? '' : undefined}>
        {destacada ? <FotoDestacada m={destacada} compacto={false} provisional={p.provisional} /> : null}
        <div className={css.heroeTexto}>
          {cabecera}
          <OrdenNuevo ordenNuevo={p.ordenNuevo} />
          {acciones}
          <Tira cola={p.cola} excluir={destacada?.application_id ?? null} enPliegue={FOTOS_TIRA_EN_PLIEGUE} />
        </div>
      </div>
    </PanelFirma>
  );
}
