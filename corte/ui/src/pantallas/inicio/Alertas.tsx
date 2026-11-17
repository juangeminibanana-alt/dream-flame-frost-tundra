/**
 * «Para tener en cuenta»: avisos del hub (DashboardResponse.alertas) que no repiten una cifra de arriba (02 §5.2).
 * Ícono + texto siempre (el color nunca va solo, 02 §12.2); rojo solo para riesgo real (tonoAlerta): la deuda va en ámbar.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { EnlaceRuta } from '@/app';
import { Icono, Tarjeta, type NombreIcono } from '@/componentes';
import { sinCortarPorcentaje, tonoAlerta, type TonoAlerta } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

/** Ícono por tono; un aviso de tienda lleva la tienda (no un signo de alarma): es deuda, no urgencia. */
const ICONO: Readonly<Record<TonoAlerta, NombreIcono>> = { critico: 'CircleAlert', atencion: 'MessageCircleWarning', info: 'Info' };
const icono = (a: C.Alerta): NombreIcono => (a.id.startsWith('tienda_clave:') ? 'Store' : ICONO[tonoAlerta(a)]);

export function Alertas(p: { alertas: C.Alerta[] }): ReactElement | null {
  if (p.alertas.length === 0) return null;
  return (
    <Tarjeta padding="amplio" className={css.tarjetaSeccion}>
      <section aria-labelledby="inicio-alertas" className={css.seccionInterna}>
        <h2 className={css.tarjetaTitulo} id="inicio-alertas">
          {T.avisos.titulo}
        </h2>
        <ul className={css.alertas}>
          {p.alertas.map((a) => (
            <li key={a.id} className={css.alerta} data-tono={tonoAlerta(a)}>
              <span className={css.alertaIcono} aria-hidden="true">
                <Icono nombre={icono(a)} tamano={18} />
              </span>
              <span className={css.alertaTextos}>
                <b className={css.alertaTitulo}>{sinCortarPorcentaje(a.titulo)}</b>
                <span className={css.alertaTexto}>{sinCortarPorcentaje(a.texto)}</span>
              </span>
              {a.accion ? (
                <EnlaceRuta a={a.accion.ruta} className={css.enlaceChico}>
                  {a.accion.etiqueta}
                  <Icono nombre="ChevronRight" tamano={14} />
                </EnlaceRuta>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </Tarjeta>
  );
}
