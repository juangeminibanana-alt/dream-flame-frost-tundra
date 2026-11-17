/**
 * #/tiendas/:key · Detalle de tienda a página completa (01_ux §4.10). Encabezado con volver, nombre y las acciones
 * (Avisar a esta tienda · Planear sus pendientes · ⋯ Agregar nota); en Android la acción de avisar va fija abajo.
 * Sin conexión (Android) se arma con la copia y sus extras (plantilla sugerida); si no se puede, «Necesita tu PC».
 */
import type { ReactElement } from 'react';
import { useConsulta } from '@/datos';
import { Pantalla, navegar, useClaseAncho, usePlataforma, useRuta } from '@/app';
import { Boton, EncabezadoPantalla, Menu } from '@/componentes';
import { useControlMuestra } from '@/bloques';
import { ContenidoTienda, ID_NOTAS, rutaPlanTienda } from './ContenidoTienda';
import { CargaDetalle, ErrorVista } from './Estados';
import { T } from './textos';
import { cx } from './util';
import css from './tiendas.module.css';

function irANotas(): void {
  const seccion = document.getElementById(ID_NOTAS);
  if (!seccion) return;
  seccion.scrollIntoView({ block: 'start', behavior: 'smooth' });
  const campo = seccion.querySelector<HTMLElement>('textarea, input, button');
  campo?.focus({ preventScroll: true });
}

export function PantallaTienda(): ReactElement {
  const { params } = useRuta();
  const clave = params['key'] ?? '';
  const consulta = useConsulta('tienda', { key: clave }, { activa: clave !== '' });
  // En el celular (y en una ventana angosta) el encabezado solo lleva ⋯: «Avisar a esta tienda» va fija abajo (01 §4.10)
  // y el nombre de la tienda conserva todo el ancho.
  const plataforma = usePlataforma();
  const ancho = useClaseAncho();
  const angosta = plataforma === 'android' || ancho === 'compacta';
  // Ventana media (960–1179 en Windows): con el título de 30/700 y las tres acciones, el nombre de la tienda bajaba a
  // dos renglones; «Planear sus pendientes» pasa al menú ⋯ (sigue también en «Lo que le debes»).
  const planearEnMenu = angosta || ancho === 'media';
  const control = useControlMuestra();
  const d = consulta.datos;
  const nombre = d?.tienda.nombre ?? T.tituloDetalle;
  const pendientes = d ? d.tienda.muestras.pendientes : 0;

  const menu = (
    <Menu
      etiqueta={T.masAcciones}
      icono="Ellipsis"
      opciones={[
        ...(planearEnMenu && pendientes > 0 ? [{ id: 'planear', etiqueta: T.planearPendientes, icono: 'CalendarDays' as const, alPulsar: () => navegar(rutaPlanTienda(clave)) }] : []),
        { id: 'nota', etiqueta: T.agregarNota, icono: 'Pencil', alPulsar: irANotas },
      ]}
    />
  );
  const acciones = d ? (
    angosta ? menu : (
      <>
        <Boton variante="primario" icono="MessageCircle" alPulsar={() => control.abrirMensaje({ tienda: d.tienda.tienda_key })}>{T.avisarTienda}</Boton>
        {pendientes > 0 && !planearEnMenu ? (
          <Boton variante="secundario" icono="CalendarDays" alPulsar={() => navegar(rutaPlanTienda(d.tienda.tienda_key))}>{T.planearPendientes}</Boton>
        ) : null}
        {menu}
      </>
    )
  ) : undefined;

  // Sin la PC, el marco ya pone la franja «Sin conexión con tu PC · datos del {fecha}» (02 §7.9): aquí no se repite.

  return (
    <Pantalla titulo={nombre} lista={!!d || !!consulta.error}>
      <div className={cx(css.pantalla)}>
        <EncabezadoPantalla
          titulo={nombre}
          volver={{ a: '/tiendas', etiqueta: T.volverTiendas }}
          {...(acciones ? { acciones } : {})}
        />
        <div className={cx(css.trasEncabezado, consulta.refrescando && css.refrescando)}>
          {consulta.cargando || (!d && !consulta.error) ? <CargaDetalle /> : null}
          {consulta.error && !d ? <ErrorVista error={consulta.error} titulo={T.errorDetalleTitulo} alReintentar={() => void consulta.refrescar()} /> : null}
          {d ? <ContenidoTienda detalle={d} modo="pagina" /> : null}
        </div>
      </div>
    </Pantalla>
  );
}
