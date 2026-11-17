/**
 * Bloques que solo aparecen si existen (01 §4.1 #3, #4 y #6): «Vencen pronto · todavía cuentan para TikTok» (rojo con
 * menos de 48 h, si no ámbar), «Promesas vencidas» (una fila por tienda) y «Hoy» (solo con plan). Filas con foto de 40.
 */
import type { ReactElement } from 'react';
import type * as C from '@/contrato';
import { EnlaceRuta } from '@/app';
import { useControlMuestra } from '@/bloques';
import { AvatarTienda, Boton, Chip, Foto, Icono, Tarjeta } from '@/componentes';
import { formato } from '@/dominio';
import { nombreProducto, type BloqueHoy, type FilaPromesa, type FilaVencePronto } from './logica';
import { T } from './textos';
import css from './Inicio.module.css';

const rutaMuestra = (m: C.MuestraVista): string => `/muestras/m/${encodeURIComponent(m.application_id)}`;

export function VencenPronto(p: { filas: FilaVencePronto[]; hoy: C.FechaLocal }): ReactElement | null {
  const control = useControlMuestra();
  if (p.filas.length === 0) return null;
  const rojo = p.filas.some((f) => f.tono === 'critico');
  return (
    <section className={css.franja} data-tono={rojo ? 'critico' : 'atencion'} aria-labelledby="inicio-vencen">
      <h2 className={css.franjaTitulo} id="inicio-vencen">
        <Icono nombre="Clock" tamano={18} />
        {T.vencen.titulo}
      </h2>
      <ul className={css.franjaLista}>
        {p.filas.map((f) => (
          <li key={f.muestra.application_id} className={css.franjaFila}>
            <EnlaceRuta a={rutaMuestra(f.muestra)} className={css.franjaEnlace}>
              <Foto url={f.muestra.producto.imagen} alt="" anchoCss={40} proporcion="1:1" radio="sm" prioridad="alta" tienda={f.tienda} categoria={f.muestra.producto.categoria} />
              <span className={css.franjaTexto}>
                <span className={css.recorte}>{T.vencen.fila(f.producto, f.tienda)}</span>
                <Chip tono={f.tono} icono="Hourglass">
                  {T.vencen.vence(f.vence)}
                </Chip>
              </span>
            </EnlaceRuta>
            <Boton variante="secundario" tamano="sm" icono="CalendarDays" alPulsar={() => void control.planear(f.muestra, p.hoy)}>
              {T.vencen.planearHoy}
            </Boton>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PromesasVencidas(p: { filas: FilaPromesa[] }): ReactElement | null {
  const control = useControlMuestra();
  if (p.filas.length === 0) return null;
  return (
    <section className={css.franja} data-tono="atencion" aria-labelledby="inicio-promesas">
      <h2 className={css.franjaTitulo} id="inicio-promesas">
        <Icono nombre="MessageCircleWarning" tamano={18} />
        {T.promesas.titulo}
      </h2>
      <ul className={css.franjaLista}>
        {p.filas.map((f) => (
          <li key={f.tienda_key} className={css.franjaFila}>
            <span className={css.franjaEnlace}>
              <AvatarTienda nombre={f.tienda} tamano={40} />
              <span className={css.franjaTexto}>
                <span>{T.promesas.fila(f.tienda, formato.fechaConDia(f.promesa))}</span>
              </span>
            </span>
            <Boton variante="secundario" tamano="sm" icono="MessageCircle" alPulsar={() => control.abrirMensaje({ tienda: f.tienda_key })}>
              {T.promesas.preparar}
            </Boton>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Acción de cada video de «Hoy» (01 §4.1: «Video listo ✓» o «Marcar publicada»): planeada → Video listo; lista o
 * programada → Marcar publicada; publicada → chip «Publicada». Botón secundario: la primaria de la vista es la del
 * héroe. El Toast «Video listo · Deshacer» lo da useControlMuestra().cambiarEtapa.
 */
function AccionHoy(p: { m: C.MuestraVista }): ReactElement | null {
  const control = useControlMuestra();
  const m = p.m;
  switch (m.avance.etapa) {
    case 'planeada':
      return (
        <Boton variante="secundario" tamano="sm" icono="Check" alPulsar={() => void control.cambiarEtapa(m, 'video_listo')}>
          {T.hoy.videoListo}
        </Boton>
      );
    case 'video_listo':
    case 'programada':
      return (
        <Boton variante="secundario" tamano="sm" icono="CircleCheckBig" alPulsar={() => void control.cambiarEtapa(m, 'publicada')}>
          {T.hoy.marcarPublicada}
        </Boton>
      );
    case 'publicada':
      return (
        <Chip tono="ok" icono="Check">
          {T.hoy.publicada}
        </Chip>
      );
    default:
      return null;
  }
}

/** «Hoy · 12 nov» con «1 de 3» a la derecha; cada video con su acción principal (Video listo ✓ / Marcar publicada). */
export function TarjetaHoy(p: { bloque: BloqueHoy }): ReactElement {
  const b = p.bloque;
  return (
    <Tarjeta padding="amplio" className={css.hoy}>
      <header className={css.tarjetaCabeza}>
        <h2 className={css.tarjetaTitulo}>{T.hoy.titulo(formato.fechaCorta(b.fecha))}</h2>
        <span className={css.hoyConteo}>{T.hoy.conteo(formato.numero(b.hechos), formato.numero(b.total))}</span>
      </header>
      {b.completo ? <p className={css.hoyCompleto}>{T.hoy.completo(formato.numero(b.hechos), formato.numero(b.total))}</p> : null}
      <ul className={css.hoyLista}>
        {b.items.map((m) => (
          <li key={m.application_id} className={css.hoyFila}>
            <EnlaceRuta a={rutaMuestra(m)} className={css.hoyEnlace}>
              <Foto url={m.producto.imagen} alt="" anchoCss={56} proporcion="1:1" radio="sm" prioridad="alta" tienda={m.tienda.nombre} categoria={m.producto.categoria} />
              <span className={css.hoyTextos}>
                <span className={css.hoyNombre}>{nombreProducto(m)}</span>
                <span className={css.hoyTienda}>{m.tienda.nombre}</span>
              </span>
            </EnlaceRuta>
            <AccionHoy m={m} />
          </li>
        ))}
      </ul>
      <EnlaceRuta a="/muestras/agenda" className={css.enlacePie}>
        {T.hoy.verAgenda}
        <Icono nombre="ChevronRight" tamano={16} />
      </EnlaceRuta>
    </Tarjeta>
  );
}
