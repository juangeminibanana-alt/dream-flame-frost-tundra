/**
 * «Productos que más venden» (lienzo Ventas.png): los 5 con más comisión del periodo, con su foto real (la del #1
 * más grande), tienda y unidades, y la comisión a la derecha. Cada fila abre el detalle del producto.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { EnlaceRuta } from '@/app';
import { Foto, Icono, Tarjeta } from '@/componentes';
import { formato, nombreCorto } from '@/dominio';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { T } from './textos';
import css from './Ventas.module.css';

const MAXIMO = 5;

export function ProductosTop(p: { productos: C.FilaProducto[] | undefined; error: ErrorHub | null; alReintentar: () => void }): ReactElement {
  let cuerpo: ReactElement;
  if (!p.productos && p.error) cuerpo = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.productos) cuerpo = <EsqueletoSeccion alto={220} />;
  else {
    const top = [...p.productos].filter((x) => x.comision_estimada_centavos > 0).sort((a, b) => b.comision_estimada_centavos - a.comision_estimada_centavos).slice(0, MAXIMO);
    cuerpo =
      top.length === 0 ? (
        <p className={css.vacioSuave}>{T.productos.vacio}</p>
      ) : (
        <ol className={css.productos}>
          {top.map((x, i) => {
            const nombre = x.titulo_corto ?? nombreCorto(x.titulo);
            const comision = formato.dinero(x.comision_estimada_centavos);
            const primero = i === 0;
            return (
              <li key={x.product_id}>
                <EnlaceRuta a={`/productos/${encodeURIComponent(x.product_id)}`} className={css.producto} aria-label={T.productos.abrir(nombre, comision)}>
                  <span className={css.productoRanking} aria-hidden="true">
                    {i + 1}
                  </span>
                  <Foto url={x.imagen} alt="" anchoCss={primero ? 72 : 48} proporcion="1:1" radio={primero ? 'md' : 'sm'} tienda={x.tienda_nombre} className={primero ? css.productoFotoGrande : css.productoFoto} />
                  <span className={css.productoTextos}>
                    <span className={css.productoNombre}>{nombre}</span>
                    <span className={css.productoLinea}>{T.productos.linea(x.tienda_nombre, T.productos.unidades(x.unidades, formato.numero(x.unidades)))}</span>
                  </span>
                  <span className={css.productoCifra}>{comision}</span>
                </EnlaceRuta>
              </li>
            );
          })}
        </ol>
      );
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      <section className={css.seccion} aria-labelledby="ventas-productos">
        <h3 className={css.tarjetaTitulo} id="ventas-productos">
          {T.productos.titulo}
        </h3>
        {cuerpo}
        <EnlaceRuta a="/productos" className={css.enlacePie}>
          {T.productos.verTodos}
          <Icono nombre="ChevronRight" tamano={16} />
        </EnlaceRuta>
      </section>
    </Tarjeta>
  );
}
