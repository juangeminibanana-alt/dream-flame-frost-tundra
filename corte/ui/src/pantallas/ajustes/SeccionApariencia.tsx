/**
 * F. Apariencia (01_ux §4.14 F; BUILD_SPEC C24, C48). Tema (Según el sistema · Claro · Oscuro) y reducir animaciones
 * (Según el sistema · Sí · No) son preferencias sincronizadas; la densidad (Cómoda / Compacta, solo escritorio) vive en
 * AjustesPc. Los atributos de <html> los aplica ui-marco al cambiar las preferencias. Idioma fijo: Español (México).
 */
import { useId, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { usePlataforma, useTema } from '@/app';
import { Segmentado, useToast } from '@/componentes';
import { ErrorHub, hub, useAcciones, useConsulta } from '@/datos';
import { CargandoGrupo, Dato, ErrorCarga, FilaLibre, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

type Tema = NonNullable<C.PreferenciasSincronizadas['tema']>;
type Animaciones = NonNullable<C.PreferenciasSincronizadas['reducir_animaciones']>;

/** Miniatura del tema (dibujada con la rampa grafito primitiva: se ve igual en cualquier tema). */
function Miniatura(p: { tipo: Tema }): ReactElement {
  return (
    <span className={cx(css.mini)} data-mini={p.tipo} aria-hidden="true">
      <span className={cx(css.miniMitad)} data-lado="oscuro">
        <span className={cx(css.miniBarra)} />
        <span className={cx(css.miniTarjeta)}>
          <span className={cx(css.miniLinea)} />
          <span className={cx(css.miniLineaCorta)} />
          <span className={cx(css.miniBoton)} />
        </span>
      </span>
      {p.tipo === 'sistema' ? (
        <span className={cx(css.miniMitad)} data-lado="claro">
          <span className={cx(css.miniBarra)} />
          <span className={cx(css.miniTarjeta)}>
            <span className={cx(css.miniLinea)} />
            <span className={cx(css.miniLineaCorta)} />
            <span className={cx(css.miniBoton)} />
          </span>
        </span>
      ) : null}
    </span>
  );
}

function SelectorTema(p: { valor: Tema; alCambiar: (t: Tema) => void }): ReactElement {
  const nombre = useId();
  const opciones: Tema[] = ['sistema', 'claro', 'oscuro'];
  return (
    <fieldset className={cx(css.temas)}>
      <legend className={cx(css.filaEtiqueta)}>{T.apariencia.tema}</legend>
      <div className={cx(css.temasFila)}>
        {opciones.map((o) => {
          const id = `${nombre}-${o}`;
          const marcada = o === p.valor;
          return (
            <label key={o} htmlFor={id} className={`${css.tema} ${marcada ? css.temaMarcado : ''}`} data-tema={o}>
              <input id={id} type="radio" name={nombre} className={cx(css.oculto)} checked={marcada} onChange={() => p.alCambiar(o)} />
              <span className={cx(css.temaVista)} data-claro={o === 'claro' ? '' : undefined}>
                <Miniatura tipo={o} />
              </span>
              <span className={cx(css.temaNombre)}>{T.apariencia.temas[o]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SeccionApariencia(): ReactElement {
  const android = usePlataforma() === 'android';
  const tema = useTema();
  const prefs = useConsulta('preferencias', {});
  const ajustes = useConsulta('ajustes_pc', {}, { activa: !android });
  const acciones = useAcciones();
  const toast = useToast();
  const titulo = T.secciones.apariencia.titulo;
  const desc = android ? T.apariencia.descripcionAndroid : T.apariencia.descripcion;

  if (prefs.cargando && !prefs.datos) {
    return (
      <Seccion titulo={titulo} id="apariencia" descripcion={desc}>
        <CargandoGrupo filas={3} />
      </Seccion>
    );
  }
  if (!prefs.datos) {
    return (
      <Seccion titulo={titulo} id="apariencia" descripcion={desc}>
        <ErrorCarga error={prefs.error} alReintentar={() => void prefs.refrescar()} />
      </Seccion>
    );
  }
  const p = prefs.datos;
  const guardar = async (cambios: Partial<Omit<C.PreferenciasSincronizadas, 'rev'>>): Promise<void> => {
    const r = await acciones.editarPreferencias({ ...cambios, rev: p.rev });
    if (r.estado === 'error' || r.estado === 'conflicto') toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
  };
  const densidad = async (d: C.AjustesPc['densidad']): Promise<void> => {
    try {
      await hub.ajustesPc({ densidad: d });
    } catch (e) {
      toast.mostrar({ texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico, tono: 'error' });
    }
  };
  const valorTema: Tema = p.tema ?? tema.preferencia;
  const valorAnim: Animaciones = p.reducir_animaciones ?? 'sistema';
  const valorDensidad = ajustes.datos?.densidad ?? (tema.densidad === 'compacta' ? 'compacta' : 'comoda');

  return (
    <Seccion titulo={titulo} id="apariencia" descripcion={desc}>
      <Grupo>
        <FilaLibre>
          <SelectorTema valor={valorTema} alCambiar={(t) => void guardar({ tema: t })} />
        </FilaLibre>
        {!android ? (
          <FilaLibre>
            <div className={cx(css.filaTextos)}>
              <span className={cx(css.filaEtiqueta)}>{T.apariencia.densidad}</span>
              <span className={cx(css.filaDesc)}>{T.apariencia.densidadDesc}</span>
            </div>
            {ajustes.error && !ajustes.datos ? (
              <ErrorCarga error={ajustes.error} alReintentar={() => void ajustes.refrescar()} />
            ) : (
              <Segmentado
                etiqueta={T.apariencia.densidad}
                valor={valorDensidad}
                opciones={[
                  { valor: 'comoda', etiqueta: T.apariencia.densidades.comoda },
                  { valor: 'compacta', etiqueta: T.apariencia.densidades.compacta },
                ]}
                alCambiar={(d) => void densidad(d)}
                className={cx(css.segmentadoAncho)}
              />
            )}
          </FilaLibre>
        ) : null}
        <FilaLibre>
          <div className={cx(css.filaTextos)}>
            <span className={cx(css.filaEtiqueta)}>{T.apariencia.animaciones}</span>
            <span className={cx(css.filaDesc)}>{T.apariencia.animacionesDesc}</span>
          </div>
          <Segmentado
            etiqueta={T.apariencia.animaciones}
            valor={valorAnim}
            opciones={[
              { valor: 'sistema', etiqueta: T.apariencia.animacionesOpc.sistema },
              { valor: 'si', etiqueta: T.apariencia.animacionesOpc.si },
              { valor: 'no', etiqueta: T.apariencia.animacionesOpc.no },
            ]}
            alCambiar={(v) => void guardar({ reducir_animaciones: v })}
            className={cx(css.segmentadoAncho)}
          />
        </FilaLibre>
      </Grupo>
      <Grupo>
        <Dato etiqueta={T.apariencia.idioma} valor={T.apariencia.idiomaValor} />
      </Grupo>
    </Seccion>
  );
}
