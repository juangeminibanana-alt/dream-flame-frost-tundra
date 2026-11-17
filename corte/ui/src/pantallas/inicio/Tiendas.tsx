/**
 * «Tiendas que necesitan atención» (01 §4.1 #8): 3 como máximo, en el orden de atención del hub (promesa vencida →
 * socio con pendientes → con pendientes por comisión de 180 días). Cada fila: avatar, nombre con su ChipSalud, el «por
 * qué» y las fotos de sus muestras pendientes; lleva al detalle de la tienda.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { EnlaceRuta } from '@/app';
import { ChipSalud } from '@/bloques';
import { AvatarTienda, Esqueleto, Foto, Icono, Tarjeta } from '@/componentes';
import { AvisoSeccion } from './Estados';
import { nombreProducto } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

const FOTOS_POR_TIENDA = 3;

function FilaTiendaAtencion(p: { tienda: C.FilaTienda; pendientes: C.MuestraVista[] }): ReactElement {
  const t = p.tienda;
  const fotos = p.pendientes.slice(0, FOTOS_POR_TIENDA);
  return (
    <li>
      <EnlaceRuta a={`/tiendas/${encodeURIComponent(t.tienda_key)}`} className={css.tiendaFila} aria-label={T.tiendas.abrir(t.nombre, t.salud_porque)}>
        <AvatarTienda nombre={t.nombre} tamano={40} />
        <span className={css.tiendaTextos}>
          <span className={css.tiendaNombreLinea}>
            <span className={css.tiendaNombre}>{t.nombre}</span>
            <ChipSalud salud={t.salud} esSocio={t.es_socio} />
          </span>
          <span className={css.tiendaPorque}>{t.salud_porque}</span>
        </span>
        {fotos.length > 0 ? (
          <span className={css.tiendaFotos} aria-hidden="true">
            {fotos.map((m) => (
              <Foto key={m.application_id} url={m.producto.imagen} alt={nombreProducto(m)} anchoCss={40} proporcion="1:1" radio="sm" tienda={t.nombre} categoria={m.producto.categoria} className={css.tiendaFoto} />
            ))}
          </span>
        ) : null}
        <Icono nombre="ChevronRight" tamano={16} className={css.tiendaChevron} />
      </EnlaceRuta>
    </li>
  );
}

export interface TiendasAtencionProps {
  tiendas: C.FilaTienda[] | undefined;
  /**
   * Primera sincronización sin tiendas todavía: esqueleto, nunca «Ninguna tienda espera un video» (aún no sabemos).
   */
  cargando?: boolean;
  /** Cuántas tiendas tienen pendientes. */
  conPendientes: number;
  porTienda: Map<string, C.MuestraVista[]>;
  error: ErrorHub | null;
  alReintentar: () => void;
}

export function TiendasAtencion(p: TiendasAtencionProps): ReactElement {
  let cuerpo: ReactElement;
  if (!p.tiendas && p.error) cuerpo = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.tiendas || p.cargando === true) {
    // Tres filas (las 3 tiendas como máximo): `forma="fila"` ya pinta varias, con `lineas` se fija cuántas.
    cuerpo = (
      <div className={css.esqFilas} aria-busy="true">
        <Esqueleto forma="fila" lineas={3} />
      </div>
    );
  } else if (p.tiendas.length === 0) cuerpo = <p className={css.vacioSuave}>{T.tiendas.vacio}</p>;
  else {
    cuerpo = (
      <ul className={css.tiendasLista}>
        {p.tiendas.map((t) => (
          <FilaTiendaAtencion key={t.tienda_key} tienda={t} pendientes={p.porTienda.get(t.tienda_key) ?? []} />
        ))}
      </ul>
    );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjetaSeccion}>
      <section aria-labelledby="inicio-tiendas" className={css.seccionInterna}>
        <h2 className={css.tarjetaTitulo} id="inicio-tiendas">
          {T.tiendas.titulo}
        </h2>
        {cuerpo}
        {p.conPendientes > 0 ? (
          <EnlaceRuta a="/tiendas?vista=atencion" className={css.enlacePie}>
            {T.tiendas.enlace(p.conPendientes)}
            <Icono nombre="ChevronRight" tamano={16} />
          </EnlaceRuta>
        ) : null}
      </section>
    </Tarjeta>
  );
}
