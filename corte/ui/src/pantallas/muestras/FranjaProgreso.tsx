/**
 * Franja de progreso de Pendientes (01 §4.2 punto 1, 02 §7.21): «Te faltan {n} videos», la barra de etapas con
 * «{0} de {12} videos publicados» y su leyenda, «Tiendas avisadas: {0} de {10}» y «Plan: …».
 * La acción principal (Armar mi plan · Avisar a mis tiendas · Empezar sesión de videos) NO va aquí: la pone
 * PestanasMuestras de @/bloques en el encabezado (escritorio) y el botón flotante de la pantalla (celular), para que
 * haya una sola por vista.
 */
import type { ReactElement } from 'react';
import { BarraEtapas, type SegmentoEtapas } from '@/componentes';
import { formato, type ConteosTrabajo } from '@/dominio';
import type { EstadoPlanCola } from './logica';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

/**
 * `programo`: Ajustes › Recordatorios › «Programo mis videos en TikTok». Programada solo aparece (segmento y leyenda) si
 * está encendido o si alguna muestra ya la usa (01 §2.4, §3.7 «Programada si se usa»).
 */
export function FranjaProgreso(p: { conteos: ConteosTrabajo; plan: EstadoPlanCola; movil: boolean; programo: boolean }): ReactElement {
  const c = p.conteos;
  const conProgramada = p.programo || c.por_etapa.programada > 0;
  const segmentos: SegmentoEtapas[] = [
    { etapa: 'planeada', n: c.por_etapa.planeada },
    { etapa: 'video_listo', n: c.por_etapa.video_listo },
    ...(conProgramada ? [{ etapa: 'programada' as const, n: c.por_etapa.programada }] : []),
    { etapa: 'publicada', n: c.por_etapa.publicada },
  ];
  const total = c.total_cohorte;
  const faltan = T.teFaltan(formato.numero(c.pendientes), c.pendientes);
  const planTexto = p.plan.hayPlan && p.plan.termina && p.plan.publica ? T.planCon(formato.fechaConDia(p.plan.termina), formato.fechaConDia(p.plan.publica)) : T.planSin;
  const tiendas = T.tiendasAvisadas(formato.numero(c.tiendas_avisadas), formato.numero(c.tiendas_con_pendientes));

  return (
    // Escritorio (lienzo Muestras.png, una sola banda): «Te faltan 12 videos» a la izquierda y, a la derecha, la barra de
    // etapas con su contador y leyenda y, debajo, tiendas avisadas y plan. Celular: los tres en columna.
    <section className={cx(p.movil ? css.franjaMovil : css.franja)} aria-label={T.tuAvance}>
      <p className={cx(css.teFaltan)}>
        {faltan.antes}
        <strong className={cx(css.teFaltanCifra)}>{faltan.cifra}</strong>
        {faltan.despues}
      </p>
      <BarraEtapas segmentos={segmentos} total={total} contador={T.contadorPublicados(formato.numero(c.publicadas), formato.numero(total))} tamano="muestras" leyenda={!p.movil} className={cx(css.barraEtapas)} />
      <ul className={cx(css.franjaDatos)}>
        <li>{tiendas}</li>
        <li>{planTexto}</li>
      </ul>
    </section>
  );
}
