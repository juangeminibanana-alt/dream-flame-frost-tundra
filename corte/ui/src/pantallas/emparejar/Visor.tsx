/**
 * Visor de la cámara para leer el QR de la PC (01 §4.15 A2, 02 §7.19, 04 §B.9): getUserMedia con facingMode
 * 'environment' (solo después de explicar para qué), cuadros reducidos a ≤ 480 px enviados a jsQR en un Web Worker a
 * ~7 cuadros/s, uno a la vez. Un QR que no es de Corte avisa y sigue escaneando. La cámara se apaga al desmontar.
 */
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { Boton, Icono } from '@/componentes';
import { esQrDeCorte } from './codigo';
import type { ResultadoQr } from './decodificar';
import { crearTrabajadorQr } from './trabajador';
import { T } from './textos';
import css from './Emparejar.module.css';
import { cx } from './clases';

export type EstadoCamara = 'antes' | 'pidiendo' | 'activa' | 'denegada' | 'no_disponible';

const INTERVALO_MS = 140;
const LADO_MAXIMO = 480;

function esResultado(v: unknown): v is ResultadoQr {
  return v !== null && typeof v === 'object' && 'texto' in v && (typeof v.texto === 'string' || v.texto === null);
}

export function Visor(p: {
  /** Texto de un QR de Corte ('creatorhub://pair?…'). */
  alLeer: (texto: string) => void;
  alEscribirCodigo: () => void;
  /** false = la cámara se apaga (p. ej. mientras se conecta). */
  activo: boolean;
}): ReactElement {
  const [estado, setEstado] = useState<EstadoCamara>(() =>
    typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function' ? 'antes' : 'no_disponible',
  );
  const [avisoQr, setAvisoQr] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const flujo = useRef<MediaStream | null>(null);
  const alLeerRef = useRef(p.alLeer);
  alLeerRef.current = p.alLeer;

  const apagar = useCallback(() => {
    for (const pista of flujo.current?.getTracks() ?? []) pista.stop();
    flujo.current = null;
  }, []);

  const encender = useCallback(async () => {
    setEstado('pidiendo');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      flujo.current = s;
      setEstado('activa');
    } catch (e) {
      const nombre = e instanceof Error ? e.name : '';
      setEstado(nombre === 'NotAllowedError' || nombre === 'SecurityError' ? 'denegada' : 'no_disponible');
    }
  }, []);

  // Conectar el flujo al <video> cuando ya existe.
  useEffect(() => {
    const v = video.current;
    if (estado !== 'activa' || !v || !flujo.current) return;
    v.srcObject = flujo.current;
    void v.play?.()?.catch(() => undefined);
  }, [estado]);

  // Escaneo: un cuadro a la vez hacia el trabajador.
  useEffect(() => {
    if (estado !== 'activa' || !p.activo) return undefined;
    const trabajador = crearTrabajadorQr();
    if (!trabajador) {
      setEstado('no_disponible');
      return undefined;
    }
    const lienzo = document.createElement('canvas');
    const ctx = lienzo.getContext('2d', { willReadFrequently: true });
    let ocupado = false;
    let vivo = true;
    let quitarAviso: ReturnType<typeof setTimeout> | null = null;
    trabajador.onmessage = (e: MessageEvent<unknown>) => {
      ocupado = false;
      if (!vivo || !esResultado(e.data) || e.data.texto === null) return;
      if (esQrDeCorte(e.data.texto)) {
        vivo = false;
        alLeerRef.current(e.data.texto);
        return;
      }
      setAvisoQr(true);
      if (quitarAviso) clearTimeout(quitarAviso);
      quitarAviso = setTimeout(() => setAvisoQr(false), 2500);
    };
    const tic = setInterval(() => {
      const v = video.current;
      if (!vivo || ocupado || !ctx || !v || v.readyState < 2 || v.videoWidth === 0) return;
      const escala = Math.min(1, LADO_MAXIMO / Math.max(v.videoWidth, v.videoHeight));
      const ancho = Math.max(1, Math.round(v.videoWidth * escala));
      const alto = Math.max(1, Math.round(v.videoHeight * escala));
      lienzo.width = ancho;
      lienzo.height = alto;
      ctx.drawImage(v, 0, 0, ancho, alto);
      const img = ctx.getImageData(0, 0, ancho, alto);
      ocupado = true;
      trabajador.postMessage({ datos: img.data.buffer, ancho, alto }, [img.data.buffer]);
    }, INTERVALO_MS);
    return () => {
      vivo = false;
      clearInterval(tic);
      if (quitarAviso) clearTimeout(quitarAviso);
      trabajador.terminate();
    };
  }, [estado, p.activo]);

  // Al desmontar o al desactivarse, la cámara se apaga.
  useEffect(() => {
    if (!p.activo) apagar();
  }, [p.activo, apagar]);
  useEffect(() => apagar, [apagar]);

  const esquinas = (
    <>
      <span className={`${css.esquina} ${css.esqSupIzq}`} aria-hidden="true" />
      <span className={`${css.esquina} ${css.esqSupDer}`} aria-hidden="true" />
      <span className={`${css.esquina} ${css.esqInfIzq}`} aria-hidden="true" />
      <span className={`${css.esquina} ${css.esqInfDer}`} aria-hidden="true" />
    </>
  );

  return (
    <div className={cx(css.visor)} role="group" aria-label={T.etiquetaVisor} data-camara={estado}>
      {estado === 'activa' ? <video ref={video} className={cx(css.video)} muted playsInline autoPlay aria-hidden="true" /> : null}
      {esquinas}
      {estado === 'activa' ? <span className={cx(css.linea)} aria-hidden="true" /> : null}
      <div className={cx(css.visorTexto)} aria-live="polite">
        {estado === 'antes' ? (
          <>
            <Icono nombre="Camera" tamano={24} className={cx(css.visorIcono)} />
            <span>{T.camaraAntes}</span>
            <Boton variante="secundario" tamano="sm" icono="Camera" alPulsar={() => void encender()}>
              {T.activarCamara}
            </Boton>
          </>
        ) : null}
        {estado === 'pidiendo' ? <span>{T.camaraPidiendo}</span> : null}
        {estado === 'activa' ? <span className={cx(css.visorPista)}>{avisoQr ? T.qrNoEsDeCorte : T.camaraApunta}</span> : null}
        {estado === 'denegada' || estado === 'no_disponible' ? (
          <>
            <Icono nombre="Keyboard" tamano={24} className={cx(css.visorIcono)} />
            <span>{estado === 'denegada' ? T.camaraDenegada : T.camaraNoDisponible}</span>
            <Boton variante="secundario" tamano="sm" icono="Keyboard" alPulsar={p.alEscribirCodigo}>
              {T.escribirCodigo}
            </Boton>
          </>
        ) : null}
      </div>
    </div>
  );
}
