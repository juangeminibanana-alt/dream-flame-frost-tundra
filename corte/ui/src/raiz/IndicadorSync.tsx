/**
 * @/raiz · indicador de sincronización (01 §3.2, §3.5, §4.16; 02 §7.7). Nunca bloquea la interfaz.
 * - 'lateral' (Windows, barra de 248): tarjeta del pie con el punto vivo y «Actualizado hace 4 min» (clic = Sincronizar
 *   ahora; durante la sincronización muestra el paso y una barra fina de avance) y «Celular conectado» / «Sin celular»
 *   (clic = Emparejar).
 * - 'riel' (80 px): los mismos dos botones, solo ícono con su nombre accesible y tooltip.
 * - 'franja' (Android y ventana compacta): línea de estado arriba del contenido, solo cuando hay algo que decir (la PC
 *   sincronizando) o cuando el recorrido la está explicando.
 * Aquí vive el tercer paso del recorrido (indicador_sync, C36: «Tus datos se actualizan solos cada 30 minutos.»).
 */
import type { CSSProperties, ReactElement } from 'react';
import { useConexionPc, useSesion, useSync, ErrorHub } from '@/datos';
import { BurbujaRecorrido, Icono, PuntoVivo, useToast } from '@/componentes';
import { fijarParametro, navegar } from '../app/navegacion';
import { useRecorrido } from '../app/recorridos';
import { cx } from '../app/clases';
import { useAhora } from './datosMarco';
import { vistaIndicador } from './indicador';
import { T } from './textos';
import css from './IndicadorSync.module.css';

function textoCelular(n: number): string {
  if (n <= 0) return T.sinCelular;
  return n === 1 ? T.celularConectado : T.celularesConectados(n);
}

export function IndicadorSync(p: { variante: 'lateral' | 'riel' | 'franja'; android: boolean }): ReactElement | null {
  const sesion = useSesion();
  const sync = useSync();
  const conexionPc = useConexionPc();
  const toast = useToast();
  const recorrido = useRecorrido('indicador_sync');
  const ahora = useAhora();
  const s = sesion.datos;
  const estadoSync = sync.estado ?? s?.sync ?? null;
  const ultimaOk = s?.datos.ultima_sync_ok_at ?? estadoSync?.ultima_ok_at ?? null;
  const vista = vistaIndicador({ android: p.android, sync: estadoSync, conexion: s?.conexion ?? null, conexionPc, ultimaOk, ahora });
  const sincronizando = vista.estado === 'sincronizando';
  const reautorizar = s?.conexion.estado === 'reautorizar';
  const dispositivos = s?.lan?.dispositivos_activos ?? 0;
  const progreso = Math.max(0, Math.min(1, estadoSync?.progreso ?? 0));

  const alPulsar = (): void => {
    if (reautorizar && !p.android) {
      fijarParametro('reautorizar', '1');
      return;
    }
    if (!sync.puede || sincronizando) return;
    sync.sincronizar().catch((e: unknown) => {
      toast.mostrar({ texto: e instanceof ErrorHub ? e.mensaje : 'No pudimos empezar a sincronizar.', tono: 'error' });
    });
  };
  const etiquetaSync = sincronizando
    ? [vista.texto, vista.detalle].filter(Boolean).join(' ')
    : reautorizar
      ? `${vista.texto}. ${T.accReautorizar}`
      : sync.puede
        ? `${vista.texto}. ${T.sincronizarAhora}`
        : vista.texto;

  const burbuja = (hijo: ReactElement): ReactElement => (
    <BurbujaRecorrido visible={recorrido.visible} texto={recorrido.texto} esUltimo={recorrido.esUltimo} alSiguiente={recorrido.siguiente} alEntendido={recorrido.entendido}>
      {hijo}
    </BurbujaRecorrido>
  );

  if (p.variante === 'franja') {
    if (!sincronizando && !recorrido.visible) return null;
    return burbuja(
      <div className={cx(css.franja, sincronizando && css.franjaActiva)} role="status" data-indicador-sync="franja">
        <span className={css.franjaIcono} aria-hidden="true">
          {sincronizando ? <Icono nombre="RefreshCw" tamano={16} className={cx(css.gira, 'anim-loop')} /> : <PuntoVivo estado="ok" />}
        </span>
        <span className={css.franjaTexto}>
          {vista.texto}
          {vista.detalle ? <span className={css.franjaPaso}> {vista.detalle}</span> : null}
        </span>
      </div>,
    );
  }

  if (p.variante === 'riel') {
    return (
      <div className={css.riel} data-indicador-sync="riel">
        {burbuja(
          <button type="button" className={css.botonRiel} onClick={alPulsar} aria-label={etiquetaSync} title={etiquetaSync} aria-disabled={!sync.puede && !reautorizar ? true : undefined}>
            <Icono nombre="RefreshCw" tamano={20} className={cx(sincronizando && css.gira, sincronizando && 'anim-loop')} />
            <span className={css.puntoRiel}>
              <PuntoVivo estado={vista.estado} {...(ultimaOk !== null ? { pulsos: ultimaOk } : {})} />
            </span>
          </button>,
        )}
        {p.android ? null : (
          <button type="button" className={css.botonRiel} onClick={() => navegar('/ajustes/celular')} aria-label={textoCelular(dispositivos)} title={textoCelular(dispositivos)}>
            <Icono nombre="Smartphone" tamano={20} />
            {dispositivos > 0 ? <span className={css.marcaCelular} aria-hidden="true" /> : null}
          </button>
        )}
      </div>
    );
  }

  return burbuja(
    <div className={cx(css.tarjeta, css[vista.estado])} data-indicador-sync="lateral" data-estado={vista.estado}>
      <button type="button" className={css.filaSync} onClick={alPulsar} aria-label={etiquetaSync} aria-disabled={!sync.puede && !reautorizar ? true : undefined}>
        <span className={css.punto} aria-hidden="true">
          {sincronizando ? <Icono nombre="RefreshCw" tamano={14} className={cx(css.gira, 'anim-loop')} /> : <PuntoVivo estado={vista.estado} {...(ultimaOk !== null ? { pulsos: ultimaOk } : {})} />}
        </span>
        <span className={css.textoSync}>{vista.texto}</span>
        {!sincronizando && (sync.puede || reautorizar) ? <Icono nombre={reautorizar ? 'ArrowRight' : 'RefreshCw'} tamano={14} className={cx(css.accion)} /> : null}
      </button>
      {sincronizando ? (
        <>
          {vista.detalle ? (
            <p className={css.paso} title={vista.detalle}>
              {vista.detalle}
            </p>
          ) : null}
          <span className={css.pista} aria-hidden="true">
            <span className={cx(css.relleno, 'fc-fill')} style={{ '--avance': String(progreso) } as CSSProperties} />
          </span>
        </>
      ) : null}
      <button type="button" className={css.filaCelular} onClick={() => navegar('/ajustes/celular')} aria-label={`${textoCelular(dispositivos)}. ${dispositivos > 0 ? T.verCelulares : T.emparejarCelular}`}>
        <Icono nombre="Smartphone" tamano={14} />
        <span>{textoCelular(dispositivos)}</span>
      </button>
    </div>,
  );
}
