/**
 * Reembolsos (01 §4.11 #4): «Los reembolsos te quitaron ${1,234} de comisión en este periodo.», los pedidos
 * reembolsados del periodo y la tasa por mes (UNA serie en --viz-mono, el mes en curso marcado) con tabla gemela.
 * La «tabla por tienda» de 01 no se arma: FilaTienda no trae pedidos totales ni reembolsados por tienda (faltante de
 * contrato anotado en la entrega).
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import type { ErrorHub } from '@/datos';
import { GraficaColumnas, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { AvisoSeccion, EsqueletoSeccion } from './Estados';
import { puntosReembolsoMes, type PuntoVentas } from './logica';
import { T } from './textos';
import css from './Ventas.module.css';

export function Reembolsos(p: { kpis: C.Kpis; meses: PuntoVentas[] | undefined; error: ErrorHub | null; compacto: boolean; alReintentar: () => void }): ReactElement {
  const k = p.kpis;
  let grafica: ReactElement | null;
  if (!p.meses && p.error) grafica = <AvisoSeccion error={p.error} alReintentar={p.alReintentar} />;
  else if (!p.meses) grafica = <EsqueletoSeccion alto={140} />;
  // Con un solo mes (7 días, «Este mes») una columna sola no compara nada: la cifra de arriba ya es el dato.
  else if (p.meses.length < 2) grafica = null;
  else {
    const d = puntosReembolsoMes(p.meses);
    grafica = <GraficaColumnas titulo={T.reembolsos.grafica} puntos={d.puntos} formatoEje={(v) => `${formato.numero(Math.round(v))} %`} alto={p.compacto ? 160 : 260} tablaGemela={d.tabla} />;
  }
  return (
    <Tarjeta padding="amplio" className={css.tarjeta}>
      <section className={css.seccion} aria-labelledby="ventas-reembolsos">
        <h3 className={css.tarjetaTitulo} id="ventas-reembolsos">
          {T.reembolsos.titulo}
        </h3>
        <p className={css.reembolsoTexto}>{T.reembolsos.texto(formato.dinero(k.comision_perdida_reembolsos_centavos))}</p>
        <p className={css.textoNota}>{T.reembolsos.detalle(formato.numero(k.pedidos_reembolsados), formato.numero(k.pedidos), formato.porcentaje(k.tasa_reembolso, 1))}</p>
        {grafica}
      </section>
    </Tarjeta>
  );
}
