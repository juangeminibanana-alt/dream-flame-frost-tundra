/**
 * FichaPrecio (01 §6.0, §4.3): «≈ $400 – $450 · precio de venta» + «Te deja ≈ $40 – $45 por venta». El precio que se
 * muestra sale del hub en este orden: variante que recibiste → vitrina → comisión ÷ tasa (≈) → lista. El precio de LISTA
 * siempre va rotulado «precio de lista» (sobrestima). `compacta` = columna derecha de la tarjeta de la cola.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { formato } from '@/dominio';
import { T } from '../textos';
import { cx } from '../util/comun';
import css from './FichaPrecio.module.css';

const ROTULO: Readonly<Record<C.FuentePrecio, string>> = {
  variante: T.precioVariante,
  vitrina: T.precioVitrina,
  comision: T.precioVenta,
  lista: T.precioLista,
};

export interface PrecioVisible {
  texto: string;
  rotulo: string;
  fuente: C.FuentePrecio | null;
}

/** Precio que se muestra y su rótulo; null si no hay ningún precio publicado. */
export function precioVisible(p: C.ProductoResumen): PrecioVisible | null {
  const fuente = p.precio_fuente;
  if (fuente !== null && (p.precio_venta_min_centavos !== null || p.precio_venta_max_centavos !== null)) {
    // Solo el precio calculado con la comisión es aproximado; variante, vitrina y lista son precios publicados.
    const texto = formato.rangoDinero(p.precio_venta_min_centavos, p.precio_venta_max_centavos, { aprox: fuente === 'comision' });
    return { texto, rotulo: ROTULO[fuente], fuente };
  }
  if (p.precio_min_centavos !== null || p.precio_max_centavos !== null) {
    return { texto: formato.rangoDinero(p.precio_min_centavos, p.precio_max_centavos), rotulo: T.precioLista, fuente: 'lista' };
  }
  return null;
}

/** «Te deja ≈ $40 – $45 por venta» (el mínimo manda; el rango solo si son distintos). */
export function textoTeDeja(p: C.ProductoResumen, corto = false): string | null {
  if (p.comision_por_venta_centavos === null && p.comision_por_venta_max_centavos === null) return null;
  const rango = formato.rangoDinero(p.comision_por_venta_centavos, p.comision_por_venta_max_centavos);
  return corto ? T.teDeja(rango) : T.teDejaPorVenta(rango);
}

export function FichaPrecio(p: { producto: C.ProductoResumen; compacta?: boolean; className?: string }): ReactElement {
  const precio = precioVisible(p.producto);
  const deja = textoTeDeja(p.producto, p.compacta === true);
  const tasa = p.producto.comision_bp !== null ? formato.tasaBp(p.producto.comision_bp) : null;
  if (p.compacta) {
    return (
      <div className={cx(css.compacta, p.className)}>
        {precio ? (
          <span className={css.cifra} title={precio.rotulo}>
            {precio.texto}
            {precio.fuente === 'lista' ? <span className={css.rotuloLista}> · {T.precioLista}</span> : null}
          </span>
        ) : (
          <span className={css.sinPrecio}>{T.sinPrecio}</span>
        )}
        {deja ? <span className={css.deja}>{deja}</span> : tasa ? <span className={css.deja}>{T.deComision(tasa)}</span> : null}
      </div>
    );
  }
  return (
    <div className={cx(css.ficha, p.className)}>
      {precio ? (
        <p className={css.linea}>
          <span className={css.cifraGrande}>{precio.texto}</span>
          <span className={css.rotulo}>{precio.rotulo}</span>
        </p>
      ) : (
        <p className={css.sinPrecio}>{T.sinPrecio}</p>
      )}
      {deja ? (
        <p className={css.lineaDeja}>
          {deja}
          {tasa ? <span className={css.rotulo}> · {T.comisionTasa(tasa)}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
