/**
 * D. Recordatorios (01_ux §4.14 D; BUILD_SPEC C32, C44). Permiso de notificaciones (@/plataforma) y preferencias
 * sincronizadas (PreferenciasSincronizadas, PATCH con su rev; en Android van por la cola y funcionan sin conexión).
 * En Android 13+ se explica antes de pedir el permiso: «Para recordarte tus videos y tus promesas…».
 */
import { useEffect, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { usePlataforma } from '@/app';
import { Boton, Interruptor, Menu, useToast } from '@/componentes';
import { useAcciones, useConsulta } from '@/datos';
import { pedirPermisoNotificaciones, permisoNotificaciones, type PermisoNotificaciones } from '@/plataforma';
import { HORAS_RECORDATORIO, horaLegible } from './logica';
import { Aviso, CargandoGrupo, ErrorCarga, FilaLibre, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

type ClaveBool = 'recordatorio_diario' | 'aviso_por_vencer' | 'aviso_promesas' | 'aviso_atrasados' | 'resumen_semanal' | 'programo_mis_videos';

function usePermiso(): [PermisoNotificaciones | null, () => Promise<void>] {
  const [permiso, setPermiso] = useState<PermisoNotificaciones | null>(null);
  useEffect(() => {
    let vivo = true;
    void permisoNotificaciones()
      .then((p) => {
        if (vivo) setPermiso(p);
      })
      .catch(() => {
        if (vivo) setPermiso('no_aplica');
      });
    return () => {
      vivo = false;
    };
  }, []);
  const pedir = async (): Promise<void> => {
    try {
      setPermiso(await pedirPermisoNotificaciones());
    } catch {
      setPermiso('denegado');
    }
  };
  return [permiso, pedir];
}

function Ejemplo(p: { texto: string }): ReactElement {
  return (
    <span className={cx(css.ejemplo)}>
      <span className={cx(css.ejemploRotulo)}>{T.recordatorios.ejemplo}</span> {p.texto}
    </span>
  );
}

export function SeccionRecordatorios(): ReactElement {
  const android = usePlataforma() === 'android';
  const prefs = useConsulta('preferencias', {});
  const acciones = useAcciones();
  const toast = useToast();
  const [permiso, pedir] = usePermiso();
  const [pidiendo, setPidiendo] = useState(false);

  const titulo = T.secciones.recordatorios.titulo;
  if (prefs.cargando && !prefs.datos) {
    return (
      <Seccion titulo={titulo} id="recordatorios" descripcion={T.recordatorios.descripcion}>
        <CargandoGrupo filas={5} />
      </Seccion>
    );
  }
  if (!prefs.datos) {
    return (
      <Seccion titulo={titulo} id="recordatorios" descripcion={T.recordatorios.descripcion}>
        <ErrorCarga error={prefs.error} alReintentar={() => void prefs.refrescar()} />
      </Seccion>
    );
  }
  const p = prefs.datos;

  const guardar = async (cambios: Partial<Omit<C.PreferenciasSincronizadas, 'rev'>>): Promise<void> => {
    const r = await acciones.editarPreferencias({ ...cambios, rev: p.rev });
    if (r.estado === 'error' || r.estado === 'conflicto') toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
  };
  const alternar = (clave: ClaveBool) => (v: boolean): void => {
    const cambios: Partial<Pick<C.PreferenciasSincronizadas, ClaveBool>> = {};
    cambios[clave] = v;
    void guardar(cambios);
    // Al encender un aviso por primera vez en Android 13+, el permiso se pide después de explicarlo (texto de arriba).
    if (v && android && permiso === 'denegado') void pedir();
  };

  const pedirConExplicacion = async (): Promise<void> => {
    setPidiendo(true);
    await pedir();
    setPidiendo(false);
  };

  return (
    <Seccion titulo={titulo} id="recordatorios" descripcion={T.recordatorios.descripcion}>
      <Grupo titulo={T.recordatorios.grupoPermiso}>
        {permiso === null ? (
          <FilaLibre>
            <span className={cx(css.filaDesc)}>…</span>
          </FilaLibre>
        ) : permiso === 'concedido' ? (
          <FilaLibre>
            <Aviso tono="ok" icono="Bell" className={cx(css.avisoPlano)}>
              {T.recordatorios.permisoConcedido}
            </Aviso>
          </FilaLibre>
        ) : permiso === 'denegado' ? (
          <FilaLibre>
            <Aviso
              tono="atencion"
              icono="Bell"
              className={cx(css.avisoPlano)}
              acciones={
                <Boton variante="primario" tamano="sm" icono="Bell" cargando={pidiendo} alPulsar={() => void pedirConExplicacion()}>
                  {T.recordatorios.pedirPermiso}
                </Boton>
              }
            >
              <span className={cx(css.parrafo)}>{android ? T.recordatorios.permisoExplicacion : T.recordatorios.permisoDenegado}</span>
            </Aviso>
          </FilaLibre>
        ) : (
          <FilaLibre>
            <Aviso tono="neutro" icono="Bell" className={cx(css.avisoPlano)}>
              {T.recordatorios.permisoNoAplica}
            </Aviso>
          </FilaLibre>
        )}
      </Grupo>

      <Grupo titulo={T.recordatorios.grupoAvisos}>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.diario} descripcion={T.recordatorios.diarioDesc} activo={p.recordatorio_diario} alCambiar={alternar('recordatorio_diario')} />
          <div className={cx(css.subfila)}>
            <Menu
              disparador="boton"
              icono="Clock"
              etiqueta={T.recordatorios.hora(horaLegible(p.hora_recordatorio))}
              opciones={HORAS_RECORDATORIO.map((h) => ({ id: h, etiqueta: horaLegible(h), alPulsar: () => void guardar({ hora_recordatorio: h }) }))}
            />
            <Ejemplo texto={T.recordatorios.ejemplos.diario} />
          </div>
        </FilaLibre>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.porVencer} descripcion={T.recordatorios.porVencerDesc} activo={p.aviso_por_vencer} alCambiar={alternar('aviso_por_vencer')} />
          <Ejemplo texto={T.recordatorios.ejemplos.porVencer} />
        </FilaLibre>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.promesas} descripcion={T.recordatorios.promesasDesc} activo={p.aviso_promesas} alCambiar={alternar('aviso_promesas')} />
          <Ejemplo texto={T.recordatorios.ejemplos.promesas} />
        </FilaLibre>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.atrasados} descripcion={T.recordatorios.atrasadosDesc} activo={p.aviso_atrasados} alCambiar={alternar('aviso_atrasados')} />
          <Ejemplo texto={T.recordatorios.ejemplos.atrasados} />
        </FilaLibre>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.semanal} descripcion={T.recordatorios.semanalDesc} activo={p.resumen_semanal} alCambiar={alternar('resumen_semanal')} />
          <Ejemplo texto={T.recordatorios.ejemplos.semanal} />
        </FilaLibre>
      </Grupo>

      <Grupo titulo={T.recordatorios.grupoAvance}>
        <FilaLibre>
          <Interruptor etiqueta={T.recordatorios.programo} descripcion={T.recordatorios.programoDesc} activo={p.programo_mis_videos} alCambiar={alternar('programo_mis_videos')} />
        </FilaLibre>
      </Grupo>
    </Seccion>
  );
}
