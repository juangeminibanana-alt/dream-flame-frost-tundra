/**
 * #/ajustes · #/ajustes/:seccion (01_ux §4.14, BUILD_SPEC §8.6).
 * - Ancho cómodo: subnavegación de 240 a la izquierda y contenido de 720 como máximo. Sin sección → TikTok Shop.
 * - Compacta (< 600): #/ajustes es la lista «Más» (01 §3.3: tarjeta de estado arriba y las secciones) y cada sección
 *   abre a pantalla completa con «‹ Más».
 * En Android no hay Sincronización (la hace la PC) y Celular es «Conexión con la PC».
 * rev. 5: «Métricas de tus videos» (Display API) después de TikTok Shop; en Android solo informa.
 */
import { type ReactElement } from 'react';
import { EnlaceRuta, Pantalla, useClaseAncho, usePlataforma, useRuta } from '@/app';
import { AvatarCuenta, EncabezadoPantalla, EstadoVacio, Icono, PuntoVivo } from '@/componentes';
import { ahoraS, formato } from '@/dominio';
import { useConexionPc, useSesion } from '@/datos';
import { esSeccion, seccionesPara, type DefSeccion, type IdSeccion } from './logica';
import { SeccionTiktok } from './SeccionTiktok';
import { SeccionMetricas } from './SeccionMetricas';
import { SeccionSincronizacion } from './SeccionSincronizacion';
import { SeccionCelular } from './SeccionCelular';
import { SeccionConexionPc } from './SeccionConexionPc';
import { SeccionRecordatorios } from './SeccionRecordatorios';
import { SeccionPlantillas } from './SeccionPlantillas';
import { SeccionApariencia } from './SeccionApariencia';
import { SeccionPrivacidad } from './SeccionPrivacidad';
import { SeccionAyuda } from './SeccionAyuda';
import { SeccionAcerca } from './SeccionAcerca';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

function Contenido(p: { id: IdSeccion; android: boolean }): ReactElement {
  switch (p.id) {
    case 'tiktok':
      return <SeccionTiktok />;
    case 'metricas':
      return <SeccionMetricas />;
    case 'sincronizacion':
      return <SeccionSincronizacion />;
    case 'celular':
      return p.android ? <SeccionConexionPc /> : <SeccionCelular />;
    case 'recordatorios':
      return <SeccionRecordatorios />;
    case 'plantillas':
      return <SeccionPlantillas />;
    case 'apariencia':
      return <SeccionApariencia />;
    case 'datos':
      return <SeccionPrivacidad />;
    case 'ayuda':
      return <SeccionAyuda />;
    case 'acerca':
      return <SeccionAcerca />;
  }
}

function NoExiste(): ReactElement {
  return (
    <div className={cx(css.noExiste)}>
      <EstadoVacio icono="CircleHelp" titulo={T.noExiste} texto={T.noExisteTexto} />
      <EnlaceRuta a="/ajustes" className={cx(css.enlace)}>
        {T.irAlInicio}
      </EnlaceRuta>
    </div>
  );
}

/** Subnavegación de 240 (escritorio) — en anchos medianos se acomoda en varias filas de pastillas. */
function Subnav(p: { secciones: DefSeccion[]; activa: IdSeccion | null }): ReactElement {
  return (
    <nav className={cx(css.subnav)} aria-label={T.navegacion}>
      <ul className={cx(css.subnavLista)}>
        {p.secciones.map((s) => {
          const activa = s.id === p.activa;
          return (
            <li key={s.id}>
              <EnlaceRuta a={`/ajustes/${s.id}`} reemplazar className={`${css.subnavItem} ${activa ? css.subnavActivo : ''}`} {...(activa ? { 'aria-label': `${s.titulo} (sección actual)` } : {})}>
                <Icono nombre={s.icono} tamano={18} />
                <span className={cx(css.subnavTexto)}>{s.titulo}</span>
              </EnlaceRuta>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Tarjeta de estado de «Más» (01 §3.3): conexión con la PC en Android; cuenta de TikTok en Windows compacta. */
function TarjetaEstado(p: { android: boolean }): ReactElement | null {
  const sesion = useSesion();
  const pc = useConexionPc();
  const ahora = ahoraS();
  if (p.android) {
    const copia = pc?.ultima_copia_at ?? sesion.copia_at ?? null;
    const conectado = pc?.conectado === true;
    const texto = !copia ? T.mas.sinCopia : conectado ? T.mas.copiaDe(formato.relativa(copia, ahora)) : T.mas.datosDel(`${formato.fechaCorta(copia)}, ${formato.hora(copia)}`);
    return (
      <EnlaceRuta a="/ajustes/celular" className={cx(css.estadoMas, !conectado && css.estadoMasInactivo)}>
        <span className={cx(css.estadoMasIcono)} aria-hidden="true">
          <Icono nombre="Monitor" tamano={20} />
        </span>
        <span className={cx(css.estadoMasTexto)}>
          <span className={cx(css.estadoMasTitulo)}>
            <PuntoVivo estado={conectado ? 'ok' : 'inactivo'} /> {conectado ? T.pc.conectado(pc?.nombre_equipo ?? 'tu PC') : T.pc.sinConexion}
          </span>
          <span className={cx(css.estadoMasDesc)}>{texto}</span>
        </span>
        <Icono nombre="ChevronRight" tamano={18} className={cx(css.estadoMasFlecha)} />
      </EnlaceRuta>
    );
  }
  const s = sesion.datos;
  if (!s) return null;
  const ok = s.conexion.estado === 'conectada';
  return (
    <EnlaceRuta a="/ajustes/tiktok" className={cx(css.estadoMas)}>
      <AvatarCuenta url={s.cuenta?.avatar ?? null} username={s.cuenta?.username ?? 'tu cuenta'} tamano={40} />
      <span className={cx(css.estadoMasTexto)}>
        <span className={cx(css.estadoMasTitulo)}>{s.cuenta ? `@${s.cuenta.username}` : T.secciones.tiktok.titulo}</span>
        <span className={cx(css.estadoMasDesc)}>
          <PuntoVivo estado={ok ? 'ok' : 'error'} /> {ok ? T.mas.cuentaConectada : T.mas.cuentaRevisar}
        </span>
      </span>
      <Icono nombre="ChevronRight" tamano={18} className={cx(css.estadoMasFlecha)} />
    </EnlaceRuta>
  );
}

function ListaMas(p: { secciones: DefSeccion[]; android: boolean }): ReactElement {
  return (
    <div className={cx(css.mas)}>
      <TarjetaEstado android={p.android} />
      <nav aria-label={T.navegacion}>
        <ul className={cx(css.masLista)}>
          {p.secciones.map((s) => (
            <li key={s.id}>
              <EnlaceRuta a={`/ajustes/${s.id}`} className={cx(css.masItem)}>
                <span className={cx(css.masIcono)} aria-hidden="true">
                  <Icono nombre={s.icono} tamano={20} />
                </span>
                <span className={cx(css.masTextos)}>
                  <span className={cx(css.masTitulo)}>{s.titulo}</span>
                  <span className={cx(css.masResumen)}>{s.resumen}</span>
                </span>
                <Icono nombre="ChevronRight" tamano={18} className={cx(css.masFlecha)} />
              </EnlaceRuta>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function PantallaAjustes(): ReactElement {
  const r = useRuta();
  const clase = useClaseAncho();
  const android = usePlataforma() === 'android';
  const secciones = seccionesPara(android);
  const pedida = r.params['seccion'] ?? null;
  const compacta = clase === 'compacta';
  const valida = pedida === null ? null : esSeccion(pedida) && secciones.some((s) => s.id === pedida) ? pedida : 'invalida';
  const titulo = compacta && android ? T.tituloMas : T.tituloPantalla;

  if (compacta) {
    if (valida === null) {
      return (
        <Pantalla titulo={titulo} lista>
          <div className={cx(css.raiz)} data-vista="mas">
            <EncabezadoPantalla titulo={titulo} />
            <ListaMas secciones={secciones} android={android} />
          </div>
        </Pantalla>
      );
    }
    const def = secciones.find((s) => s.id === valida);
    return (
      <Pantalla titulo={def?.titulo ?? titulo} lista>
        <div className={cx(css.raiz)} data-vista="seccion" data-seccion-activa={valida}>
          <EncabezadoPantalla titulo={def?.titulo ?? T.noExiste} volver={{ a: '/ajustes', etiqueta: T.volverMas }} />
          <div className={cx(css.contenidoCompacto)}>{valida === 'invalida' ? <NoExiste /> : <Contenido id={valida} android={android} />}</div>
        </div>
      </Pantalla>
    );
  }

  const activa: IdSeccion | 'invalida' = valida ?? secciones[0]?.id ?? 'tiktok';
  return (
    <Pantalla titulo={T.tituloPantalla} lista>
      <div className={cx(css.raiz)} data-vista="dos-columnas" data-seccion-activa={activa}>
        <EncabezadoPantalla titulo={T.tituloPantalla} contexto={android ? T.contextoAndroid : T.contexto} />
        <div className={cx(css.columnas)}>
          <Subnav secciones={secciones} activa={activa === 'invalida' ? null : activa} />
          <div className={cx(css.contenido)}>{activa === 'invalida' ? <NoExiste /> : <Contenido id={activa} android={android} />}</div>
        </div>
      </div>
    </Pantalla>
  );
}
