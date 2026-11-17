/**
 * Estados de Ventas (01 §4.11 «Estados», §4.16; 02 §7.15–7.16): esqueleto con la forma final, aviso por sección
 * («Necesita tu PC encendida» o error con Reintentar) y la franja «Todavía estamos trayendo tus pedidos…».
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { Boton, Esqueleto, EsqueletoVista, Icono } from '@/componentes';
import { T } from './textos';
import css from './Ventas.module.css';

export function CargaVentas(): ReactElement {
  return (
    <EsqueletoVista textoLento={T.lento} className={css.carga}>
      <span className={css.srSolo}>{T.cargando}</span>
      <div className={css.esqKpis}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Esqueleto key={i} forma="kpi" />
        ))}
      </div>
      <Esqueleto forma="bloque" alto={300} />
      <div className={css.esqDos}>
        <Esqueleto forma="bloque" alto={200} />
        <Esqueleto forma="bloque" alto={200} />
      </div>
      <Esqueleto forma="fila" lineas={6} />
    </EsqueletoVista>
  );
}

export function EsqueletoSeccion(p: { alto?: number }): ReactElement {
  return (
    <div className={css.esqSeccion} aria-busy="true">
      <Esqueleto forma="titulo" ancho={220} />
      <Esqueleto forma="bloque" alto={p.alto ?? 160} />
    </div>
  );
}

export function AvisoSeccion(p: { error: ErrorHub; alReintentar?: () => void }): ReactElement {
  const necesitaPc = p.error.codigo === 'necesita_pc';
  return (
    <div className={css.avisoSeccion} role="status">
      <span className={css.avisoIcono} aria-hidden="true">
        <Icono nombre={necesitaPc ? 'Monitor' : 'CircleAlert'} tamano={18} />
      </span>
      <span className={css.avisoTextos}>
        <b>{necesitaPc ? T.estados.necesitaPc : T.estados.errorSeccion}</b>
        <span>{necesitaPc ? T.estados.necesitaPcSeccion : p.error.mensaje}</span>
      </span>
      {!necesitaPc && p.alReintentar ? (
        <Boton variante="secundario" tamano="sm" icono="RotateCcw" alPulsar={p.alReintentar}>
          {T.estados.reintentar}
        </Boton>
      ) : null}
    </div>
  );
}

export function FranjaTrayendo(p: { texto: string }): ReactElement {
  return (
    <p className={css.trayendo} role="status">
      <Icono nombre="RefreshCw" tamano={16} className={css.trayendoIcono} />
      <span>{p.texto}</span>
    </p>
  );
}
