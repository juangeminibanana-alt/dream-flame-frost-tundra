/**
 * PanelQrEmparejamiento (01 §4.14 C, §5.3, C6; 02 §7.19): «Lleva Corte en tu celular», los 3 pasos, el QR (tile
 * blanco siempre oscuro sobre blanco), el código manual de 12 caracteres Crockford en 3 grupos con su anillo de cuenta
 * regresiva, la dirección de la PC y «El código cambia cada 5 minutos.». Pide POST /api/lan/emparejar (hub.lanEmparejar)
 * y lo renueva al vencer. Con «emparejamiento.fin» aprobado muestra «{celular} quedó conectado.» y avisa alEmparejado.
 * DialogoSolicitudEmparejamiento (01 §4.14 C): modal global «¿Conectar este celular?» con el número de 4 dígitos.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, CodigoEmparejamiento, Esqueleto, Icono, Modal, MosaicoQr, Palomita, useToast } from '@/componentes';
import { ErrorHub, hub, useEventoHub } from '@/datos';
import { ahoraS } from '@/dominio';
import { T } from '../textos';
import { cx } from '../util/comun';
import css from './celular.module.css';

/** Solo galería y pruebas: reemplaza hub.lanEmparejar (p. ej. con un QR ficticio). */
export const ContextoPedirEmparejamiento = createContext<(() => Promise<C.EmparejarResponse>) | null>(null);

type Estado =
  | { tipo: 'cargando' }
  | { tipo: 'listo'; datos: C.EmparejarResponse }
  | { tipo: 'conectado'; dispositivo: string }
  | { tipo: 'error'; texto: string }
  | { tipo: 'solo_pc' };

export function PanelQrEmparejamiento(p: { compacto?: boolean; alEmparejado?: (dispositivo: string) => void; className?: string }): ReactElement {
  const inyectado = useContext(ContextoPedirEmparejamiento);
  const [estado, setEstado] = useState<Estado>({ tipo: 'cargando' });
  const solicitante = useRef<{ pair_id: string; dispositivo: string } | null>(null);
  const vivo = useRef(true);
  const alEmparejado = p.alEmparejado;

  const pedir = useCallback(async (): Promise<void> => {
    try {
      const datos = await (inyectado ?? (() => hub.lanEmparejar()))();
      if (vivo.current) setEstado({ tipo: 'listo', datos });
    } catch (e) {
      if (!vivo.current) return;
      if (e instanceof ErrorHub && (e.codigo === 'solo_en_pc' || e.codigo === 'necesita_pc')) setEstado({ tipo: 'solo_pc' });
      else setEstado({ tipo: 'error', texto: e instanceof ErrorHub ? e.mensaje : T.errorCodigo });
    }
  }, [inyectado]);

  useEffect(() => {
    vivo.current = true;
    void pedir();
    return () => {
      vivo.current = false;
    };
  }, [pedir]);

  const pairId = estado.tipo === 'listo' ? estado.datos.pair_id : null;
  useEventoHub((e) => {
    if (pairId === null) return;
    if (e.tipo === 'emparejamiento.solicitud' && e.pair_id === pairId) solicitante.current = { pair_id: e.pair_id, dispositivo: e.dispositivo };
    if (e.tipo === 'emparejamiento.fin' && e.pair_id === pairId) {
      if (e.resultado === 'aprobado') {
        const dispositivo = solicitante.current?.pair_id === pairId ? solicitante.current.dispositivo : T.tuCelular;
        setEstado({ tipo: 'conectado', dispositivo });
        alEmparejado?.(dispositivo);
      } else {
        // Rechazado o vencido: el código ya no sirve (un solo uso), se pide otro.
        setEstado({ tipo: 'cargando' });
        void pedir();
      }
    }
  });

  const pasos = (
    <ol className={css.pasos}>
      <li>{T.paso1}</li>
      <li>{T.paso2}</li>
      <li>{T.paso3}</li>
    </ol>
  );

  let tile: ReactElement;
  let codigo: ReactElement | null = null;
  if (estado.tipo === 'listo') {
    tile = <MosaicoQr png={estado.datos.qr_png} alt={T.qrAlt} className={cx(css.qr)} />;
    codigo = (
      <div className={css.codigo}>
        <p className={css.ayuda}>{T.noPuedesEscanear}</p>
        <CodigoEmparejamiento
          codigo={estado.datos.codigo_manual}
          expiraAt={estado.datos.expira_at}
          alVencer={() => {
            setEstado({ tipo: 'cargando' });
            void pedir();
          }}
        />
        {estado.datos.direcciones[0] ? (
          <p className={css.direccion}>
            {T.direccionPc}: <span className={css.mono}>{estado.datos.direcciones.join(' · ')}</span>
          </p>
        ) : null}
        <p className={css.ayuda}>{T.cambiaCada5}</p>
      </div>
    );
  } else if (estado.tipo === 'conectado') {
    tile = (
      <div className={css.conectado} role="status">
        <Palomita tamano={56} />
        <p className={css.conectadoTexto}>{T.celularConectado(estado.dispositivo)}</p>
      </div>
    );
  } else if (estado.tipo === 'cargando') {
    tile = (
      <div className={css.tileVacio} aria-busy="true">
        <Esqueleto forma="bloque" ancho={196} alto={196} />
        <span className={css.ayuda}>{T.generandoCodigo}</span>
      </div>
    );
  } else {
    tile = (
      <div className={css.tileVacio} role={estado.tipo === 'error' ? 'alert' : 'status'}>
        <Icono nombre={estado.tipo === 'error' ? 'CircleAlert' : 'Monitor'} tamano={24} />
        <p className={css.ayuda}>{estado.tipo === 'error' ? estado.texto : T.soloEnPc}</p>
        {estado.tipo === 'error' ? (
          <Boton variante="secundario" tamano="sm" icono="RefreshCw" alPulsar={() => { setEstado({ tipo: 'cargando' }); void pedir(); }}>
            {T.reintentar}
          </Boton>
        ) : null}
      </div>
    );
  }

  // La sección es el contenedor que se mide; la rejilla interior responde a SU ancho (un elemento no puede consultar
  // su propio tamaño): en una tarjeta angosta (W5, columna de 420) el QR va arriba y los pasos y el código debajo.
  return (
    <section className={cx(css.contenedor, p.className)} aria-label={T.llevaCorte}>
      <div className={cx(css.panel, p.compacto && css.compacto)}>
        <div className={css.lienzoQr}>{tile}</div>
        <div className={css.textos}>
          {!p.compacto ? (
            <>
              <h3 className={css.titulo}>{T.llevaCorte}</h3>
              <p className={css.texto}>{T.llevaCorteTexto}</p>
            </>
          ) : null}
          {pasos}
          {codigo}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------- solicitud entrante

export interface SolicitudEmparejamiento {
  pair_id: string;
  dispositivo: string;
  codigo_verificacion: string;
  expira_at: C.EpochS;
}

function segundosRestantes(expira: C.EpochS): number {
  return Math.max(0, Math.round(expira - ahoraS()));
}

/** El modal en sí (lo usa la galería con una solicitud de ejemplo). */
export function VistaSolicitudEmparejamiento(p: { solicitud: SolicitudEmparejamiento | null; alPermitir: () => void; alRechazar: () => void; alCerrar: () => void; ocupado?: boolean }): ReactElement | null {
  const [resta, setResta] = useState(() => (p.solicitud ? segundosRestantes(p.solicitud.expira_at) : 0));
  const expira = p.solicitud?.expira_at ?? null;
  const alCerrar = p.alCerrar;
  useEffect(() => {
    if (expira === null) return undefined;
    setResta(segundosRestantes(expira));
    const t = window.setInterval(() => {
      const s = segundosRestantes(expira);
      setResta(s);
      if (s <= 0) {
        window.clearInterval(t);
        alCerrar();
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [expira, alCerrar]);
  if (!p.solicitud) return null;
  const minutos = Math.floor(resta / 60);
  const segundos = String(resta % 60).padStart(2, '0');
  return (
    <Modal
      abierto
      titulo={T.conectarCelular}
      descripcion={T.quiereConectarse(p.solicitud.dispositivo)}
      alCerrar={p.alCerrar}
      pie={
        <>
          <Boton variante="fantasma" alPulsar={p.alRechazar}>
            {T.rechazar}
          </Boton>
          <Boton variante="primario" icono="Check" cargando={p.ocupado ?? false} alPulsar={p.alPermitir}>
            {T.permitir}
          </Boton>
        </>
      }
    >
      <div className={css.solicitud}>
        <p className={css.ayuda}>{T.verificaNumero}</p>
        <p className={css.numero} aria-label={`${T.numeroConfirmacion} ${p.solicitud.codigo_verificacion.split('').join(' ')}`}>
          {p.solicitud.codigo_verificacion}
        </p>
        <p className={css.caduca} aria-live="off">
          <Icono nombre="Clock" tamano={14} /> {T.caducaEn} <span className={css.mono}>{minutos}:{segundos}</span>
        </p>
      </div>
    </Modal>
  );
}

export function DialogoSolicitudEmparejamiento(): ReactElement | null {
  const [solicitud, setSolicitud] = useState<SolicitudEmparejamiento | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const toast = useToast();
  useEventoHub((e) => {
    if (e.tipo === 'emparejamiento.solicitud') setSolicitud({ pair_id: e.pair_id, dispositivo: e.dispositivo, codigo_verificacion: e.codigo_verificacion, expira_at: e.expira_at });
    if (e.tipo === 'emparejamiento.fin') setSolicitud((s) => (s && s.pair_id === e.pair_id ? null : s));
  });
  const cerrar = useCallback(() => setSolicitud(null), []);
  const decidir = async (aprobar: boolean): Promise<void> => {
    if (!solicitud) return;
    setOcupado(true);
    try {
      await hub.lanDecidir(solicitud.pair_id, aprobar ? { aprobar: true, permisos: 'lectura_escritura' } : { aprobar: false });
      if (aprobar) toast.mostrar({ texto: T.celularConectado(solicitud.dispositivo), tono: 'ok' });
    } catch (e) {
      toast.mostrar({ texto: e instanceof ErrorHub ? e.mensaje : T.errorGenerico, tono: 'error' });
    } finally {
      setOcupado(false);
      setSolicitud(null);
    }
  };
  return <VistaSolicitudEmparejamiento solicitud={solicitud} ocupado={ocupado} alPermitir={() => void decidir(true)} alRechazar={() => void decidir(false)} alCerrar={cerrar} />;
}
