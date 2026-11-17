/**
 * Estados de Inicio (01 §4.1 «Estados», §4.16; 02 §7.15–7.16): esqueleto con la forma final (una sola animación por
 * vista, la de EsqueletoVista), aviso por sección («Necesita tu PC encendida» o error con Reintentar, nunca tumba la
 * pantalla) y la línea de la primera sincronización.
 */
import type { ReactElement } from 'react';
import type { ErrorHub } from '@/datos';
import { Boton, Esqueleto, EsqueletoVista, Icono } from '@/componentes';
import { T } from './textos';
import css from './Inicio.module.css';

/** Forma del héroe mientras carga: foto a la izquierda (o arriba en celular) y texto. */
export function EsqueletoHeroe(p: { compacto: boolean }): ReactElement {
  return (
    <div className={css.esqHeroe} data-compacto={p.compacto ? '' : undefined}>
      {p.compacto ? null : <Esqueleto forma="foto" className={css.esqHeroeFoto} />}
      <div className={css.esqHeroeTexto}>
        <Esqueleto forma="texto" ancho={96} lineas={1} />
        <Esqueleto forma="titulo" ancho="80%" alto={44} />
        <Esqueleto forma="texto" ancho="55%" lineas={1} />
        <Esqueleto forma="bloque" alto={10} />
        {p.compacto ? <Esqueleto forma="foto" className={css.esqHeroeFotoCompacta} /> : null}
        <Esqueleto forma="bloque" ancho={p.compacto ? '100%' : 220} alto={44} />
        {p.compacto ? null : (
          <div className={css.esqTira}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Esqueleto key={i} forma="bloque" ancho={64} alto={64} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function EsqueletoKpis(): ReactElement {
  return (
    <div className={css.esqKpis}>
      {[0, 1, 2, 3].map((i) => (
        <Esqueleto key={i} forma="kpi" />
      ))}
    </div>
  );
}

/** Primera carga de toda la pantalla. */
export function CargaInicio(p: { compacto: boolean }): ReactElement {
  return (
    <EsqueletoVista textoLento={T.lento} className={css.carga}>
      <span className={css.srSolo}>{T.cargando}</span>
      <div className={css.esqSaludo}>
        <Esqueleto forma="titulo" ancho={240} />
        <Esqueleto forma="texto" ancho={320} />
      </div>
      <EsqueletoHeroe compacto={p.compacto} />
      <EsqueletoKpis />
      <div className={css.esqDos}>
        <Esqueleto forma="bloque" alto={260} />
        <Esqueleto forma="bloque" alto={260} />
      </div>
    </EsqueletoVista>
  );
}

/** Aviso dentro de una sección que no se pudo armar (Android sin la PC) o que falló. */
export function AvisoSeccion(p: { error: ErrorHub; alReintentar?: () => void; className?: string }): ReactElement {
  const necesitaPc = p.error.codigo === 'necesita_pc';
  return (
    <div className={`${css.avisoSeccion}${p.className ? ` ${p.className}` : ''}`} role="status">
      <span className={css.avisoIcono} aria-hidden="true">
        <Icono nombre={necesitaPc ? 'Monitor' : 'CircleAlert'} tamano={18} />
      </span>
      <span className={css.avisoTextos}>
        <b>{necesitaPc ? T.seccion.necesitaPc : T.seccion.error}</b>
        <span>{necesitaPc ? T.seccion.necesitaPcTexto : p.error.mensaje}</span>
      </span>
      {!necesitaPc && p.alReintentar ? (
        <Boton variante="secundario" tamano="sm" icono="RotateCcw" alPulsar={p.alReintentar}>
          {T.seccion.reintentar}
        </Boton>
      ) : null}
    </div>
  );
}

/**
 * «Estamos trayendo tus datos de TikTok Shop. Lo que llegue se mostrará al instante.» (primera sincronización, texto
 * exacto de 01 §4.1). El paso en curso no se repite aquí: lo muestra el indicador global de sincronización.
 */
export function LineaTrayendo(): ReactElement {
  return (
    <p className={css.trayendo} role="status">
      <Icono nombre="RefreshCw" tamano={16} className={css.trayendoIcono} />
      <span>{T.trayendo}</span>
    </p>
  );
}
