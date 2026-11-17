/**
 * Selección múltiple de Pendientes (01 §4.2): «{n} seleccionadas · [Planear…] [Cambiar etapa] [Avisar a estas tiendas]
 * [Quitar selección]». Planear y Cambiar etapa se aplican en UN lote (acciones.lote) con un solo Deshacer; «Avisar a
 * estas tiendas» abre Avisar a mis tiendas limitado a las tiendas de la selección (#/muestras/avisos?tiendas=…).
 */
import { useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar } from '@/app';
import { Boton, Hoja, OpcionRadio, SelectorFecha, useToast } from '@/componentes';
import { useAcciones, useConsulta } from '@/datos';
import { ETIQUETA_ETAPA, formato, opCambioEtapa, promesaEnRiesgo, sumarDias, validarEtapa, type DatosEtapa } from '@/dominio';
import { Flotante } from './Flotante';
import { rutaAvisarTiendas } from './rutas';
import { T } from './textos';
import { cx } from './util';
import css from './Muestras.module.css';

type EtapaLote = 'por_planear' | 'planeada' | 'video_listo' | 'publicada';
const ETAPAS_LOTE: readonly EtapaLote[] = ['por_planear', 'planeada', 'video_listo', 'publicada'];

export function BarraSeleccion(p: { muestras: C.MuestraVista[]; todas: readonly C.MuestraVista[]; hoy: C.FechaLocal; movil: boolean; alQuitar: () => void }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const preferencias = useConsulta('preferencias', {});
  const [hoja, setHoja] = useState<'planear' | 'etapa' | null>(null);
  const [fecha, setFecha] = useState<C.FechaLocal>(p.hoy);
  const [etapa, setEtapa] = useState<EtapaLote>('planeada');
  const [guardando, setGuardando] = useState(false);
  const n = p.muestras.length;
  const capacidad = preferencias.datos?.capacidad_videos_dia ?? 3;
  const ocupacion = useMemo(() => {
    const r: Record<C.FechaLocal, { usados: number; capacidad: number }> = {};
    for (const m of p.todas) {
      const f = m.avance.fecha_planeada;
      if (f && m.avance.etapa !== 'publicada' && m.avance.etapa !== 'no_se_puede') r[f] = { usados: (r[f]?.usados ?? 0) + 1, capacidad };
    }
    return r;
  }, [p.todas, capacidad]);
  const enRiesgo = p.muestras.filter((m) => promesaEnRiesgo(fecha, m.avisos.promesa)).length;

  const aplicar = async (destino: EtapaLote): Promise<void> => {
    const datos: DatosEtapa =
      destino === 'planeada' ? { fecha_plan: fecha } : destino === 'video_listo' ? { fecha_video_listo: p.hoy } : destino === 'publicada' ? { fecha_publicada: p.hoy } : {};
    const error = validarEtapa(destino, datos);
    if (error) {
      toast.mostrar({ texto: error, tono: 'error' });
      return;
    }
    setGuardando(true);
    const ops = p.muestras.filter((m) => m.avance.etapa !== destino || destino === 'planeada').map((m) => opCambioEtapa(m, destino, datos, p.hoy));
    const r = await acciones.lote(ops);
    setGuardando(false);
    setHoja(null);
    if (r.estado === 'error' || r.estado === 'conflicto') {
      toast.mostrar({ texto: T.noSePudo, tono: 'error' });
      return;
    }
    const texto = destino === 'planeada' ? T.planeadas(ops.length, formato.fechaConDia(fecha)) : T.etapaCambiada(ops.length, ETIQUETA_ETAPA[destino]);
    toast.mostrar({ texto, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() } });
    p.alQuitar();
  };

  const selectorFecha = (
    <SelectorFecha
      etiqueta={T.hojaPlanearEtiqueta}
      valor={fecha}
      alCambiar={setFecha}
      min={p.hoy}
      atajos={[
        { etiqueta: T.hoy, fecha: p.hoy },
        { etiqueta: T.manana, fecha: sumarDias(p.hoy, 1) },
      ]}
      ocupacion={ocupacion}
    />
  );

  const contenido = (
    <>
      <span className={cx(css.seleccionConteo)} aria-live="polite">
        {T.seleccionadas(n)}
      </span>
      <div className={cx(css.seleccionAcciones)}>
        <Boton variante="secundario" tamano="sm" icono="CalendarDays" alPulsar={() => setHoja('planear')}>
          {T.planearVarias}
        </Boton>
        <Boton variante="secundario" tamano="sm" icono="CircleDashed" alPulsar={() => setHoja('etapa')}>
          {T.cambiarEtapa}
        </Boton>
        <Boton variante="secundario" tamano="sm" icono="MessageCircle" alPulsar={() => navegar(rutaAvisarTiendas(p.muestras.map((m) => m.tienda.tienda_key)))}>
          {T.avisarEstas}
        </Boton>
        <Boton variante="fantasma" tamano="sm" icono="X" alPulsar={p.alQuitar}>
          {T.quitarSeleccion}
        </Boton>
      </div>
    </>
  );

  return (
    <>
      {p.movil ? (
        <Flotante className={cx(css.barraSeleccionMovil)} role="toolbar" aria-label={T.seleccionadas(n)}>
          {contenido}
        </Flotante>
      ) : (
        <div className={cx(css.barraSeleccion)} role="toolbar" aria-label={T.seleccionadas(n)}>
          {contenido}
        </div>
      )}
      <Hoja
        abierta={hoja === 'planear'}
        titulo={T.hojaPlanearTitulo}
        alCerrar={() => setHoja(null)}
        pie={
          <Boton variante="primario" anchoCompleto cargando={guardando} alPulsar={() => void aplicar('planeada')}>
            {T.planearN(n)}
          </Boton>
        }
      >
        <div className={cx(css.hojaCuerpo)}>
          {selectorFecha}
          {enRiesgo > 0 ? <p className={cx(css.aviso)}>{T.riesgoPromesa(enRiesgo)}</p> : null}
        </div>
      </Hoja>
      <Hoja
        abierta={hoja === 'etapa'}
        titulo={T.hojaEtapaTitulo}
        alCerrar={() => setHoja(null)}
        pie={
          <Boton variante="primario" anchoCompleto cargando={guardando} alPulsar={() => void aplicar(etapa)}>
            {T.aplicar}
          </Boton>
        }
      >
        <div className={cx(css.hojaCuerpo)}>
          <OpcionRadio<EtapaLote> etiqueta={T.hojaEtapaEtiqueta} opciones={ETAPAS_LOTE.map((e) => ({ valor: e, etiqueta: ETIQUETA_ETAPA[e] }))} valor={etapa} alCambiar={setEtapa} />
          {etapa === 'planeada' ? selectorFecha : null}
        </div>
      </Hoja>
    </>
  );
}
