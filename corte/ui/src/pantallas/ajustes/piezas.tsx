/**
 * Piezas de maquetación de Conexión y ajustes: sección con título, grupos (rótulo + tarjeta con filas separadas por
 * filetes), filas de dato, avisos con tono semántico y estados de carga y error. Solo tokens (ajustes.module.css).
 */
import { useId, type ReactElement, type ReactNode } from 'react';
import { Boton, Esqueleto, EsqueletoVista, Icono, type NombreIcono } from '@/componentes';
import type { ErrorHub } from '@/datos';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

export function Seccion(p: { titulo: string; descripcion?: ReactNode; children: ReactNode; id?: string }): ReactElement {
  const id = useId();
  return (
    <section className={cx(css.seccion)} aria-labelledby={id} data-seccion={p.id}>
      <header className={cx(css.seccionCabeza)}>
        <h2 id={id} className={cx(css.seccionTitulo)}>
          {p.titulo}
        </h2>
        {p.descripcion ? <p className={cx(css.seccionDesc)}>{p.descripcion}</p> : null}
      </header>
      <div className={cx(css.seccionCuerpo)}>{p.children}</div>
    </section>
  );
}

export function Grupo(p: { titulo?: string; children: ReactNode; pie?: ReactNode; acciones?: ReactNode; className?: string }): ReactElement {
  const id = useId();
  return (
    <div className={`${css.grupo} ${p.className ?? ''}`} role="group" {...(p.titulo ? { 'aria-labelledby': id } : {})}>
      {p.titulo || p.acciones ? (
        <div className={cx(css.grupoCabeza)}>
          {p.titulo ? (
            <h3 id={id} className={cx(css.grupoTitulo)}>
              {p.titulo}
            </h3>
          ) : (
            <span />
          )}
          {p.acciones ? <div className={cx(css.grupoAcciones)}>{p.acciones}</div> : null}
        </div>
      ) : null}
      <div className={cx(css.grupoCaja)}>{p.children}</div>
      {p.pie ? <p className={cx(css.grupoPie)}>{p.pie}</p> : null}
    </div>
  );
}

/** Fila con etiqueta, descripción opcional y un control a la derecha (en angosto, el control baja). */
export function Fila(p: { etiqueta: ReactNode; descripcion?: ReactNode; children?: ReactNode; icono?: NombreIcono; apilada?: boolean; className?: string }): ReactElement {
  return (
    <div className={`${css.fila} ${p.apilada ? css.filaApilada : ''} ${p.className ?? ''}`}>
      {p.icono ? (
        <span className={cx(css.filaIcono)} aria-hidden="true">
          <Icono nombre={p.icono} tamano={18} />
        </span>
      ) : null}
      <div className={cx(css.filaTextos)}>
        <span className={cx(css.filaEtiqueta)}>{p.etiqueta}</span>
        {p.descripcion ? <span className={cx(css.filaDesc)}>{p.descripcion}</span> : null}
      </div>
      {p.children ? <div className={cx(css.filaControl)}>{p.children}</div> : null}
    </div>
  );
}

/** Contenedor de una fila cuyo control ya trae su propio acomodo (Interruptor, OpcionRadio, Segmentado). */
export function FilaLibre(p: { children: ReactNode; className?: string }): ReactElement {
  return <div className={`${css.filaLibre} ${p.className ?? ''}`}>{p.children}</div>;
}

/** Dato de solo lectura: etiqueta a la izquierda y valor a la derecha. */
export function Dato(p: { etiqueta: string; valor: ReactNode; mono?: boolean }): ReactElement {
  return (
    <div className={cx(css.dato)}>
      <span className={cx(css.datoEtiqueta)}>{p.etiqueta}</span>
      <span className={`${css.datoValor} ${p.mono ? css.mono : ''}`}>{p.valor}</span>
    </div>
  );
}

export type TonoAviso = 'info' | 'atencion' | 'critico' | 'ok' | 'neutro';
const ICONO_TONO: Record<TonoAviso, NombreIcono> = { info: 'Info', atencion: 'CircleAlert', critico: 'CircleAlert', ok: 'Check', neutro: 'Info' };

export function Aviso(p: { tono: TonoAviso; icono?: NombreIcono; titulo?: ReactNode; children?: ReactNode; acciones?: ReactNode; vivo?: boolean; className?: string }): ReactElement {
  return (
    <div className={`${css.aviso} ${p.className ?? ''}`} data-tono={p.tono} role={p.vivo ? (p.tono === 'critico' ? 'alert' : 'status') : undefined}>
      <span className={cx(css.avisoIcono)} aria-hidden="true">
        <Icono nombre={p.icono ?? ICONO_TONO[p.tono]} tamano={18} />
      </span>
      <div className={cx(css.avisoCuerpo)}>
        {p.titulo ? <p className={cx(css.avisoTitulo)}>{p.titulo}</p> : null}
        {p.children ? <div className={cx(css.avisoTexto)}>{p.children}</div> : null}
        {p.acciones ? <div className={cx(css.avisoAcciones)}>{p.acciones}</div> : null}
      </div>
    </div>
  );
}

/** Esqueleto con la forma de un grupo de filas (primera carga, 02 §7.15). */
export function CargandoGrupo(p: { filas?: number }): ReactElement {
  const n = p.filas ?? 3;
  return (
    <EsqueletoVista textoLento={T.cargando}>
      <div className={cx(css.grupo)} aria-hidden="true">
        <Esqueleto forma="texto" ancho={120} />
        <div className={cx(css.grupoCaja)}>
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className={cx(css.fila)}>
              <div className={cx(css.filaTextos)}>
                <Esqueleto forma="texto" ancho="45%" />
                <Esqueleto forma="texto" ancho="70%" />
              </div>
              <Esqueleto forma="bloque" ancho={44} alto={24} />
            </div>
          ))}
        </div>
      </div>
    </EsqueletoVista>
  );
}

export function ErrorCarga(p: { error: ErrorHub | null; alReintentar: () => void }): ReactElement {
  const necesitaPc = p.error?.codigo === 'necesita_pc' || p.error?.codigo === 'solo_en_pc';
  return (
    <Aviso
      tono={necesitaPc ? 'neutro' : 'atencion'}
      icono={necesitaPc ? 'Monitor' : 'CircleAlert'}
      titulo={necesitaPc ? T.necesitaPc : T.errorCarga}
      acciones={
        <Boton variante="secundario" tamano="sm" icono="RefreshCw" alPulsar={p.alReintentar}>
          {T.reintentar}
        </Boton>
      }
    >
      {necesitaPc ? T.necesitaPcTexto : p.error?.mensaje ?? null}
    </Aviso>
  );
}

/** Lista de permisos con palomita (01 §4.14 A). */
export function ListaChequeo(p: { items: { id: string; texto: string; ok: boolean }[] }): ReactElement {
  return (
    <ul className={cx(css.chequeo)}>
      {p.items.map((x) => (
        <li key={x.id} className={cx(css.chequeoItem)} data-ok={x.ok ? '' : undefined}>
          <span className={cx(css.chequeoMarca)} aria-hidden="true">
            <Icono nombre={x.ok ? 'Check' : 'Minus'} tamano={14} />
          </span>
          <span>{x.texto}</span>
          {x.ok ? null : <span className={cx(css.oculto)}> (falta)</span>}
        </li>
      ))}
    </ul>
  );
}
