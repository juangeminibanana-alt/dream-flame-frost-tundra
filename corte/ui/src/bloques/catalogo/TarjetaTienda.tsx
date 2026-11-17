/**
 * TarjetaTienda (01 §4.9 «Tarjeta (celular)», §4.10): avatar + nombre + chip de salud; «2 pendientes · por avisar ·
 * $1,234 de comisión»; foto del producto más relevante de la tienda (la API no da logotipos) y chevron.
 *   'fila'  · tarjeta de lista (celular y columnas angostas)
 *   'ficha' · tarjeta de cuadrícula (escritorio): foto arriba, salud con su porqué y 3 cifras
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { AvatarTienda, Foto, Icono } from '@/componentes';
import { formato } from '@/dominio';
import { cx } from '../util/comun';
import { ChipSalud } from '../muestras/chips';
import { T } from '../textos';
import css from './TarjetaTienda.module.css';

/** «2 pendientes · por avisar · $1,234 de comisión» (01 §4.9). */
export function lineaTienda(t: C.FilaTienda): string {
  const partes: string[] = [];
  const n = t.muestras.pendientes;
  if (n > 0) partes.push(`${formato.numero(n)} ${n === 1 ? T.pendienteUna : T.pendientesMinusculas}`);
  if (t.promesas.vencidas > 0) partes.push(`${formato.numero(t.promesas.vencidas)} ${t.promesas.vencidas === 1 ? T.promesaVencidaUna : T.promesasVencidas}`);
  else if (t.por_avisar) partes.push(T.porAvisarMinusculas);
  else if (n > 0 && t.promesas.vigentes > 0) partes.push(T.avisadaMinusculas);
  partes.push(T.deComision(formato.dinero(t.ventas.comision_estimada_centavos)));
  return partes.join(' · ');
}

export function TarjetaTienda(p: { tienda: C.FilaTienda; variante: 'ficha' | 'fila'; alAbrir?: () => void; className?: string }): ReactElement {
  const t = p.tienda;
  const alAbrir = p.alAbrir;
  const etiqueta = `${t.nombre}. ${t.salud_porque}. ${lineaTienda(t)}`;
  const nombre = alAbrir ? (
    <button type="button" className={cx(css.nombre, css.abrir)} onClick={() => alAbrir()} aria-label={etiqueta}>
      {t.nombre}
    </button>
  ) : (
    <span className={css.nombre}>{t.nombre}</span>
  );

  if (p.variante === 'fila') {
    // El contenedor mide la fila: si queda muy angosta, la foto cede su lugar para que el chip de salud no se recorte.
    return (
      <div className={css.contenedorFila}>
        <article className={cx(css.tarjeta, css.fila, alAbrir && css.pulsable, p.className)}>
          <AvatarTienda nombre={t.nombre} tamano={40} />
          <div className={css.cuerpo}>
            <div className={css.titulo}>
              {nombre}
              <ChipSalud salud={t.salud} esSocio={t.es_socio} className={cx(css.chip)} />
            </div>
            <span className={css.linea}>{lineaTienda(t)}</span>
          </div>
          <Foto url={t.imagen} alt="" anchoCss={48} proporcion="1:1" radio="sm" tienda={t.nombre} className={cx(css.foto48)} />
          {alAbrir ? <Icono nombre="ChevronRight" tamano={18} className={cx(css.chevron)} /> : null}
        </article>
      </div>
    );
  }

  const v = t.ventas;
  return (
    <article className={cx(css.tarjeta, css.ficha, alAbrir && css.pulsable, p.className)}>
      <div className={css.fotoFicha}>
        <Foto url={t.imagen} alt="" anchoCss={320} proporcion="1:1" radio="md" tienda={t.nombre} className={cx(css.fotoLlena)} />
        <AvatarTienda nombre={t.nombre} tamano={32} className={cx(css.avatarSobre)} />
      </div>
      <div className={css.cuerpoFicha}>
        {nombre}
        <ChipSalud salud={t.salud} esSocio={t.es_socio} />
        <p className={css.porque}>{t.salud_porque}</p>
        <dl className={css.cifras}>
          <div>
            <dt>{T.pendientes}</dt>
            <dd>{formato.numero(t.muestras.pendientes)}</dd>
          </div>
          <div>
            <dt>{T.comision}</dt>
            <dd>{formato.dinero(v.comision_estimada_centavos)}</dd>
          </div>
          <div>
            <dt>{T.participacion90}</dt>
            <dd>{v.participacion_90d > 0 ? formato.porcentaje(v.participacion_90d, 1) : '—'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
