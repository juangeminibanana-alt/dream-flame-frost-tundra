/**
 * Hojas cortas de etapa (01 §2.4 «Datos que pide», §4.3 «Tu avance»):
 *   HojaProgramar · «¿Cuándo se publica?» fecha y hora obligatorias · «Usa la misma hora que programaste en TikTok.»
 *   HojaNoSePuede · «¿Por qué no puedes hacerlo?» motivo obligatorio + texto opcional + «Te recomendamos avisarle a la
 *                   tienda» con la plantilla del motivo [Solo guardar] [Guardar y preparar mensaje]
 *   HojaEtapa     · «Cambiar etapa» (menú ⋯ «Cambiar etapa…»): se puede avanzar saltando etapas y retroceder.
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { AreaTexto, Boton, Hoja, Icono, OpcionRadio, SelectorFechaHora } from '@/componentes';
import { ETIQUETA_ACCION, ETIQUETA_ETAPA, ETIQUETA_MOTIVO_NO_SE_PUEDE, ICONO_ETAPA, ahoraS, epochDeFecha, sumarDias, hoyLocal } from '@/dominio';
import { abrirMensajeEn } from '../control/contexto';
import { useOperaciones, usePreferencias } from '../control/operaciones';
import { DESCRIPCION_ETAPA, NOMBRE_PLANTILLA, PLANTILLA_DE_MOTIVO, T } from '../textos';
import { cx } from '../util/comun';
import comun from '../util/comun.module.css';
import { MuestraEnHoja } from './MuestraEnHoja';
import css from './hojas.module.css';

interface PropsHoja {
  m: C.MuestraVista;
  abierta: boolean;
  alTerminar: () => void;
}

export function HojaProgramar(p: PropsHoja): ReactElement {
  const ops = useOperaciones();
  const { m } = p;
  const inicial = m.avance.programada_para_at ?? (m.avance.fecha_planeada ? epochDeFecha(m.avance.fecha_planeada, 18, 0) : epochDeFecha(sumarDias(hoyLocal(), 1), 18, 0));
  const [cuando, setCuando] = useState<C.EpochS | null>(inicial);
  const [guardando, setGuardando] = useState(false);
  const guardar = async (): Promise<void> => {
    if (cuando === null) return;
    setGuardando(true);
    await ops.aplicarEtapa(m, 'programada', { programada_para_at: cuando });
    setGuardando(false);
    p.alTerminar();
  };
  return (
    <Hoja
      abierta={p.abierta}
      titulo={T.cuandoSePublica}
      alCerrar={p.alTerminar}
      pie={
        <div className={css.pie}>
          <Boton variante="fantasma" alPulsar={p.alTerminar}>
            {T.cancelar}
          </Boton>
          <Boton variante="primario" icono="CalendarClock" deshabilitado={cuando === null} cargando={guardando} alPulsar={() => void guardar()}>
            {ETIQUETA_ACCION.marcar_programada}
          </Boton>
        </div>
      }
    >
      <div className={css.cuerpo}>
        <MuestraEnHoja m={m} />
        <SelectorFechaHora etiqueta={T.fechaYHora} valor={cuando} alCambiar={setCuando} min={ahoraS() - 3600} />
        <p className={css.ayuda}>{T.mismaHora}</p>
      </div>
    </Hoja>
  );
}

const MOTIVOS: C.MotivoNoSePuede[] = ['agotado', 'desactivado', 'no_llego', 'incompleta', 'no_va_con_mi_contenido', 'otro'];

/** Motivo precargado: si TikTok ya dice que no se puede etiquetar, «Producto desactivado» (01 §5.1 variante C). */
export function motivoSugerido(m: C.MuestraVista): C.MotivoNoSePuede | null {
  return m.prioridad === 'no_se_puede_etiquetar' ? 'desactivado' : null;
}

export function HojaNoSePuede(p: PropsHoja): ReactElement {
  const ops = useOperaciones();
  const { m } = p;
  const [motivo, setMotivo] = useState<C.MotivoNoSePuede | null>(motivoSugerido(m));
  const [texto, setTexto] = useState('');
  const [guardando, setGuardando] = useState(false);
  const faltaTexto = motivo === 'otro' && texto.trim() === '';
  const guardar = async (preparar: boolean): Promise<void> => {
    if (motivo === null || faltaTexto) return;
    setGuardando(true);
    const r = await ops.aplicarEtapa(m, 'no_se_puede', { motivo_no_se_puede: motivo, motivo_texto: texto.trim() || null });
    setGuardando(false);
    p.alTerminar();
    if (preparar && r && (r.estado === 'aplicada' || r.estado === 'en_cola')) {
      abrirMensajeEn({ solicitud: m.application_id }, { plantilla: PLANTILLA_DE_MOTIVO[motivo] });
    }
  };
  const plantilla = motivo ? PLANTILLA_DE_MOTIVO[motivo] : null;
  return (
    <Hoja
      abierta={p.abierta}
      titulo={T.noPuedo}
      alCerrar={p.alTerminar}
      pie={
        <div className={css.pie}>
          <Boton variante="secundario" deshabilitado={motivo === null || faltaTexto} cargando={guardando} alPulsar={() => void guardar(false)}>
            {T.soloGuardar}
          </Boton>
          <Boton variante="primario" icono="MessageCircle" deshabilitado={motivo === null || faltaTexto} cargando={guardando} alPulsar={() => void guardar(true)}>
            {T.guardarYPreparar}
          </Boton>
        </div>
      }
    >
      <div className={css.cuerpo}>
        <MuestraEnHoja m={m} />
        <OpcionRadio<C.MotivoNoSePuede>
          etiqueta={T.porQueNoPuedes}
          opciones={MOTIVOS.map((x) => ({ valor: x, etiqueta: ETIQUETA_MOTIVO_NO_SE_PUEDE[x] }))}
          valor={motivo}
          alCambiar={setMotivo}
        />
        <AreaTexto etiqueta={T.cuentanosMas} valor={texto} alCambiar={setTexto} filas={2} maximo={500} {...(faltaTexto ? { ayuda: T.escribeMotivo } : {})} />
        {plantilla ? (
          <div className={comun.avisoInfo}>
            <Icono nombre="MessageCircle" tamano={18} />
            <span>
              {T.recomendacionAvisar}: <strong>{NOMBRE_PLANTILLA[plantilla] ?? plantilla}</strong>. {T.saleDePendientes}
            </span>
          </div>
        ) : null}
        <div className={css.desvanecido} aria-hidden="true" />
      </div>
    </Hoja>
  );
}

export interface HojaEtapaProps extends PropsHoja {
  /** Elegir una etapa: la cierra y abre la hoja que pide sus datos (o la aplica directo). */
  alElegir: (etapa: C.EtapaAvance) => void;
}

export function HojaEtapa(p: HojaEtapaProps): ReactElement {
  const prefs = usePreferencias();
  const { m } = p;
  const actual = m.avance.etapa;
  const etapas: C.EtapaAvance[] = ['por_planear', 'planeada', 'video_listo', ...(prefs.programo_mis_videos || actual === 'programada' ? (['programada'] as const) : []), 'publicada', 'no_se_puede'];
  return (
    <Hoja abierta={p.abierta} titulo={T.tituloCambiarEtapa} alCerrar={p.alTerminar}>
      <div className={css.cuerpo}>
        <MuestraEnHoja m={m} />
        <ul className={css.lista} aria-label={T.tituloCambiarEtapa}>
          {etapas.map((e) => (
            <li key={e}>
              <button
                type="button"
                className={cx(css.opcion)}
                aria-current={e === actual ? 'true' : undefined}
                disabled={e === actual}
                onClick={() => p.alElegir(e)}
              >
                <span className={css.opcionIcono}>
                  <Icono nombre={ICONO_ETAPA[e]} tamano={18} />
                </span>
                <span className={css.opcionTexto}>
                  <span className={css.opcionTitulo}>{ETIQUETA_ETAPA[e]}</span>
                  <span className={css.opcionMeta}>{e === actual ? T.etapaActual : DESCRIPCION_ETAPA[e]}</span>
                </span>
                {e === actual ? <Icono nombre="Check" tamano={18} className={cx(css.opcionMarca)} /> : <Icono nombre="ChevronRight" tamano={18} className={cx(css.opcionFlecha)} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Hoja>
  );
}

