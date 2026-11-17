/**
 * Hoja «¿Qué día haces este video?» / «Mover a otro día» (01 §4.3 Planear, §4.4, §5.5 paso 6). Chips que planean con
 * un toque —«Hoy», «Mañana», «{lun 16 nov} (siguiente día libre)»— con la ocupación «Ese día ya tienes 2 de 3», y
 * «Elegir fecha…» con el calendario. Nunca ofrece días después del vencimiento y protege las promesas: «Le prometiste a
 * {tienda} publicar a más tardar el {vie 20 nov}. Si lo mueves, avísale.» [Mover y preparar mensaje] [Cancelar].
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, Hoja, Icono, SelectorFecha } from '@/componentes';
import { diaSemana, fechaLocalDe, formato, hoyLocal, promesaEnRiesgo, sumarDias } from '@/dominio';
import { abrirMensajeEn } from '../control/contexto';
import { useOcupacion, useOperaciones } from '../control/operaciones';
import { T } from '../textos';
import { cx } from '../util/comun';
import comun from '../util/comun.module.css';
import { MuestraEnHoja } from './MuestraEnHoja';
import css from './hojas.module.css';
import propio from './HojaPlanear.module.css';

export interface HojaPlanearProps {
  m: C.MuestraVista;
  modo: 'planear' | 'mover';
  /** Si viene, la hoja abre directo en la confirmación de promesa con esa fecha. */
  fechaElegida?: C.FechaLocal;
  abierta: boolean;
  alTerminar: () => void;
}

export function textoPromesaRota(tienda: string, promesa: C.FechaLocal): string {
  return T.avisoMover(tienda, formato.fechaConDia(promesa));
}

interface Atajo {
  etiqueta: string;
  fecha: C.FechaLocal;
}

export function HojaPlanear(p: HojaPlanearProps): ReactElement {
  const { m } = p;
  const ocupacion = useOcupacion();
  const ops = useOperaciones();
  const hoy = hoyLocal();
  const limite = m.fecha_limite_at !== null ? fechaLocalDe(m.fecha_limite_at) : null;
  const promesa = m.avisos.promesa;
  const actual = m.avance.fecha_planeada;
  const libre = ocupacion.siguienteLibre(hoy, m.application_id, limite);
  const [confirmar, setConfirmar] = useState<C.FechaLocal | null>(p.fechaElegida ?? null);
  const [calendario, setCalendario] = useState(false);
  const [fecha, setFecha] = useState<C.FechaLocal | null>(actual);
  const [guardando, setGuardando] = useState(false);

  const atajos = useMemo<Atajo[]>(() => {
    const lista: Atajo[] = [
      { etiqueta: T.hoy, fecha: hoy },
      { etiqueta: T.manana, fecha: sumarDias(hoy, 1) },
    ];
    if (libre && libre !== hoy && libre !== sumarDias(hoy, 1)) {
      lista.push({ etiqueta: `${formato.fechaConDia(libre)} (${T.siguienteLibre})`, fecha: libre });
    }
    return lista;
  }, [hoy, libre]);

  const mapa = useMemo(() => ocupacion.mapa(hoy, 70, m.application_id), [ocupacion, hoy, m.application_id]);

  const guardar = async (dia: C.FechaLocal, prepararMensaje: boolean): Promise<void> => {
    setGuardando(true);
    const etapa = m.avance.etapa;
    // Mover sin bajar de etapa: un video listo o programado conserva su etapa y solo cambia de día.
    const conservar = p.modo === 'mover' && (etapa === 'video_listo' || etapa === 'programada');
    const r = await ops.aplicarEtapa(m, conservar ? etapa : 'planeada', { fecha_plan: dia }, {
      texto: p.modo === 'mover' ? T.movidaAl(formato.fechaConDia(dia)) : T.planeadaParaEl(formato.fechaConDia(dia)),
    });
    setGuardando(false);
    p.alTerminar();
    if (prepararMensaje && r && (r.estado === 'aplicada' || r.estado === 'en_cola')) {
      abrirMensajeEn({ solicitud: m.application_id }, { plantilla: 'nueva_fecha' });
    }
  };

  /** Un toque: planea, o pide confirmación si rompe la promesa (01 §4.4). */
  const elegir = (dia: C.FechaLocal): void => {
    if (promesaEnRiesgo(dia, promesa)) setConfirmar(dia);
    else void guardar(dia, false);
  };

  const titulo = p.modo === 'mover' ? T.moverOtroDia : T.quePlanear;

  if (confirmar && promesa) {
    return (
      <Hoja
        abierta={p.abierta}
        titulo={titulo}
        alCerrar={p.alTerminar}
        pie={
          <div className={css.pie}>
            <Boton variante="fantasma" alPulsar={p.alTerminar}>
              {T.cancelar}
            </Boton>
            <Boton variante="primario" icono="MessageCircle" cargando={guardando} alPulsar={() => void guardar(confirmar, true)}>
              {p.modo === 'mover' ? T.moverYPreparar : T.planearYPreparar}
            </Boton>
          </div>
        }
      >
        <div className={css.cuerpo}>
          <MuestraEnHoja m={m} />
          <div className={comun.aviso} role="alert">
            <Icono nombre="CalendarClock" tamano={18} />
            <span>{textoPromesaRota(m.tienda.nombre, promesa)}</span>
          </div>
          <p className={css.ayuda}>
            {p.modo === 'mover' ? T.nuevoDia : T.diaElegido}: <strong>{formato.fechaConDia(confirmar)}</strong> · {T.publicariasAMasTardar}{' '}
            {formato.fechaConDia(sumarDias(confirmar, 2))}.
          </p>
        </div>
      </Hoja>
    );
  }

  const usados = fecha ? ocupacion.usados(fecha, m.application_id) : 0;
  const noEsDia = fecha !== null && !ocupacion.dias.includes(diaSemana(fecha));

  return (
    <Hoja
      abierta={p.abierta}
      titulo={titulo}
      alCerrar={p.alTerminar}
      pie={
        <div className={css.pie}>
          <Boton variante="fantasma" alPulsar={p.alTerminar}>
            {T.cancelar}
          </Boton>
          {calendario ? (
            <Boton variante="primario" deshabilitado={fecha === null || fecha === actual} cargando={guardando} alPulsar={() => fecha && elegir(fecha)}>
              {p.modo === 'mover' ? T.mover : T.planearBoton}
            </Boton>
          ) : null}
        </div>
      }
    >
      <div className={css.cuerpo}>
        <MuestraEnHoja m={m} />
        {promesa ? (
          <div className={comun.avisoInfo}>
            <Icono nombre="CalendarClock" tamano={18} />
            <span>{T.prometistePublicar(formato.fechaConDia(promesa))}</span>
          </div>
        ) : null}
        <div className={propio.atajos} role="group" aria-label={T.diaDelVideo}>
          {atajos.map((a) => {
            const n = ocupacion.usados(a.fecha, m.application_id);
            const fueraDeDias = !ocupacion.dias.includes(diaSemana(a.fecha));
            const vencida = limite !== null && a.fecha > limite;
            const lleno = n >= ocupacion.capacidad;
            const detalle = fueraDeDias ? T.noHacesVideosCorto : n > 0 ? T.yaTienesDe(formato.numero(n), formato.numero(ocupacion.capacidad)) : T.libre;
            return (
              <button
                key={a.etiqueta}
                type="button"
                className={cx(propio.atajo, lleno && propio.lleno, a.fecha === actual && propio.actual)}
                disabled={vencida || a.fecha === actual || guardando}
                onClick={() => elegir(a.fecha)}
                aria-label={`${a.etiqueta}: ${formato.fechaConDia(a.fecha)}, ${detalle}`}
              >
                <span className={propio.atajoTitulo}>{a.etiqueta}</span>
                <span className={propio.atajoMeta}>
                  {a.etiqueta === T.hoy || a.etiqueta === T.manana ? `${formato.fechaConDia(a.fecha)} · ` : ''}
                  {detalle}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            className={cx(propio.atajo, propio.otra)}
            aria-expanded={calendario}
            onClick={() => setCalendario((v) => !v)}
          >
            <span className={propio.atajoTitulo}>
              <Icono nombre="CalendarDays" tamano={16} /> {T.elegirFecha}
            </span>
            <span className={propio.atajoMeta}>{T.conTuCalendario}</span>
          </button>
        </div>
        {calendario ? (
          <SelectorFecha etiqueta={T.diaDelVideo} valor={fecha} alCambiar={setFecha} min={hoy} {...(limite ? { max: limite } : {})} ocupacion={mapa} />
        ) : null}
        <div aria-live="polite" className={propio.ayudas}>
          {calendario && fecha && usados > 0 ? (
            <p className={cx(css.ayuda, usados >= ocupacion.capacidad && css.ayudaFuerte)}>
              {T.eseDiaYaTienes(formato.numero(usados), formato.numero(ocupacion.capacidad))}
            </p>
          ) : null}
          {calendario && noEsDia ? <p className={css.ayuda}>{T.noHacesVideos}</p> : null}
          {limite ? <p className={css.ayuda}>{T.venceSinDiasPosteriores(formato.fechaConDia(limite))}</p> : null}
        </div>
      </div>
    </Hoja>
  );
}
