/**
 * Pantalla de éxito de Armar mi plan (01 §4.5: reemplaza al aviso flotante). «Plan listo: terminas el {mar 24 nov}.
 * Ahora avisa a tus {30} tiendas.» [Avisar a mis tiendas] [Después], con Deshacer durante 6 s (el deshacer del lote:
 * UN solo Deshacer para todo el plan). En Windows con celular emparejado, [Avisar a mis tiendas] ofrece «Desde mi
 * celular» o «Desde esta PC».
 */
import { useEffect, useState, type ReactElement } from 'react';
import { Boton, Foto, Palomita } from '@/componentes';
import { formato, hoyLocal, sumarDias } from '@/dominio';
import type * as C from '@/contrato';
import { Aviso } from '../Estados';
import { useFocoAlMontar } from '../foco';
import { T } from '../textos';
import { cx, nombreDe } from '../util';
import css from './Plan.module.css';

/** «hoy» · «mañana» · «el sáb 14 nov» (para «Empiezas hoy con estas 3»). */
function etiquetaDiaCorta(f: C.FechaLocal): string {
  const hoy = hoyLocal();
  if (f === hoy) return 'hoy';
  if (f === sumarDias(hoy, 1)) return 'mañana';
  return `el ${formato.fechaConDia(f)}`;
}

export interface DatosExito {
  videos: number;
  termina: C.FechaLocal;
  publica: C.FechaLocal;
  tiendasPorAvisar: number;
  /** El primer día del plan y sus muestras (las fotos con las que empiezas). */
  primerDia: { fecha: C.FechaLocal; muestras: C.MuestraVista[] } | null;
  /** null si no hubo nada que cambiar (todo ya estaba en su día). */
  deshacer: (() => Promise<void>) | null;
  enCola: boolean;
}

export const DURACION_DESHACER_MS = 6000;

export function ExitoPlan(p: {
  exito: DatosExito;
  celularEmparejado: boolean;
  alAvisar: () => void;
  alDespues: () => void;
  alDeshacer: () => void;
}): ReactElement {
  const [puedeDeshacer, setPuedeDeshacer] = useState(p.exito.deshacer !== null);
  const [dondeAvisar, setDondeAvisar] = useState<'preguntar' | 'celular' | null>(null);
  const titulo = useFocoAlMontar<HTMLHeadingElement>();
  useEffect(() => {
    if (!puedeDeshacer) return undefined;
    const t = setTimeout(() => setPuedeDeshacer(false), DURACION_DESHACER_MS);
    return () => clearTimeout(t);
  }, [puedeDeshacer]);

  const avisar = (): void => {
    if (p.celularEmparejado && dondeAvisar === null) setDondeAvisar('preguntar');
    else p.alAvisar();
  };

  return (
    <section className={cx(css.exito)} aria-labelledby="flujos-plan-exito">
      <Palomita tamano={56} className={cx(css.exitoPalomita)} />
      <h2 id="flujos-plan-exito" ref={titulo} tabIndex={-1} className={cx(css.exitoTitulo)}>
        {T.planListo(formato.fechaConDia(p.exito.termina), p.exito.tiendasPorAvisar)}
      </h2>
      <p className={cx(css.exitoDetalle)}>{T.planListoDetalle(p.exito.videos, formato.fechaConDia(p.exito.publica))}</p>
      {p.exito.deshacer ? (
        // Deshacer va junto al mensaje, arriba: dura 6 s y tiene que verse sin desplazar aunque la tarjeta global tape
        // el final de la pantalla. Su lugar se conserva al irse, para que los botones de abajo no brinquen bajo el dedo.
        <div className={cx(css.exitoDeshacerLugar)}>
          {puedeDeshacer ? (
            <Boton variante="fantasma" tamano="sm" icono="Undo2" alPulsar={p.alDeshacer}>
              {T.deshacer}
            </Boton>
          ) : null}
        </div>
      ) : null}
      {p.exito.primerDia && p.exito.primerDia.muestras.length > 0 ? (
        <figure className={cx(css.exitoPrimeras)}>
          <ul className={cx(css.exitoFotos)}>
            {p.exito.primerDia.muestras.slice(0, 4).map((m) => (
              <li key={m.application_id} className={cx(css.exitoFoto)}>
                <Foto url={m.producto.imagen} alt={`${nombreDe(m.producto)}, ${m.tienda.nombre}`} anchoCss={96} proporcion="1:1" radio="md" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
              </li>
            ))}
            {p.exito.primerDia.muestras.length > 4 ? <li className={cx(css.exitoFoto, css.previaMas)}>{T.masVideos(p.exito.primerDia.muestras.length - 4)}</li> : null}
          </ul>
          <figcaption className={cx(css.exitoFotosTexto)}>{T.empiezasCon(etiquetaDiaCorta(p.exito.primerDia.fecha), p.exito.primerDia.muestras.length)}</figcaption>
        </figure>
      ) : null}
      {p.exito.enCola ? (
        <Aviso tono="info" icono="Smartphone" className={cx(css.exitoAviso)}>
          {T.planEnCola}
        </Aviso>
      ) : null}

      {dondeAvisar === 'preguntar' ? (
        <div className={cx(css.dondeAvisar)} role="group" aria-label={T.dondeAvisar}>
          <p className={cx(css.dondeTitulo)}>{T.dondeAvisar}</p>
          <div className={cx(css.dondeOpciones)}>
            <Boton variante="secundario" tamano="lg" icono="Smartphone" alPulsar={() => setDondeAvisar('celular')}>
              {T.desdeCelular}
            </Boton>
            <Boton variante="primario" tamano="lg" icono="Monitor" alPulsar={p.alAvisar}>
              {T.desdeEstaPc}
            </Boton>
          </div>
        </div>
      ) : dondeAvisar === 'celular' ? (
        <div className={cx(css.dondeAvisar)}>
          <Aviso tono="info" icono="Smartphone">
            {T.desdeCelularTexto}
          </Aviso>
          <div className={cx(css.exitoAcciones)}>
            <Boton variante="secundario" alPulsar={p.alAvisar}>
              {T.desdeEstaPc}
            </Boton>
            <Boton variante="primario" alPulsar={p.alDespues}>
              {T.volverInicio}
            </Boton>
          </div>
        </div>
      ) : (
        <div className={cx(css.exitoAcciones)}>
          {p.exito.tiendasPorAvisar > 0 ? (
            <Boton variante="primario" tamano="lg" icono="MessageCircle" alPulsar={avisar}>
              {T.avisarMisTiendas}
            </Boton>
          ) : null}
          <Boton variante={p.exito.tiendasPorAvisar > 0 ? 'secundario' : 'primario'} tamano="lg" alPulsar={p.alDespues}>
            {p.exito.tiendasPorAvisar > 0 ? T.despues : T.volverInicio}
          </Boton>
        </div>
      )}
    </section>
  );
}
