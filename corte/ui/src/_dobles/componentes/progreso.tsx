/* __DOBLE_CORTE__ · doble de @/componentes: carga, vacíos, progreso, ticket, QR y código de emparejamiento. */
import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import type { EpochS } from '@/contrato';
import type { NombreIcono, SegmentoEtapas, TicketProps, TonoEstado } from '@firmas/componentes';
import { Caja, estilosDoble as css } from '../comun/Caja';

export function Esqueleto(p: { forma: 'texto' | 'titulo' | 'bloque' | 'foto' | 'kpi' | 'fila' | 'circulo'; ancho?: number | string; alto?: number | string; lineas?: number; className?: string }): ReactElement {
  return <Caja nombre="Esqueleto" props={{ forma: p.forma, lineas: p.lineas }} className={p.className} etiqueta="Cargando" />;
}

export function EsqueletoVista(p: { children: ReactNode; textoLento?: string; className?: string }): ReactElement {
  const [lento, setLento] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLento(true), 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <Caja nombre="EsqueletoVista" className={p.className}>
      <div aria-busy="true">{p.children}</div>
      {lento ? <span className={css.atenuado}>{p.textoLento ?? 'Esto está tardando más de lo normal…'}</span> : null}
    </Caja>
  );
}

export function EstadoVacio(p: { icono: NombreIcono; titulo: string; texto?: string; accion?: { etiqueta: string; alPulsar: () => void }; className?: string }): ReactElement {
  return (
    <Caja nombre="EstadoVacio" props={{ icono: p.icono }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      {p.texto ? <span className={css.atenuado}>{p.texto}</span> : null}
      {p.accion ? (
        <button type="button" className={css.boton} onClick={p.accion.alPulsar}>
          {p.accion.etiqueta}
        </button>
      ) : null}
    </Caja>
  );
}

export function BarraProgreso(p: { valor: number; etiqueta: string; className?: string }): ReactElement {
  const v = Math.min(1, Math.max(0, p.valor));
  return (
    <Caja nombre="BarraProgreso" className={p.className}>
      <div role="progressbar" aria-label={p.etiqueta} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
        {p.etiqueta}: {Math.round(v * 100)} %
      </div>
    </Caja>
  );
}

export function BarraEtapas(p: { segmentos: SegmentoEtapas[]; total: number; contador: string; tamano?: 'inicio' | 'muestras'; leyenda?: boolean; className?: string }): ReactElement {
  return (
    <Caja nombre="BarraEtapas" props={{ total: p.total, tamano: p.tamano }} className={p.className}>
      <span className={css.titulo}>{p.contador}</span>
      {p.leyenda === false ? null : <span className={css.atenuado}>{p.segmentos.map((s) => `${s.n} ${s.etapa}`).join(' · ')}</span>}
    </Caja>
  );
}

export function BarraSegmentada(p: { partes: { id: string; etiqueta: string; n: number; tono: TonoEstado }[]; etiqueta: string; className?: string }): ReactElement {
  return (
    <Caja nombre="BarraSegmentada" props={{ etiqueta: p.etiqueta }} className={p.className}>
      <span className={css.atenuado}>{p.partes.map((x) => `${x.n} ${x.etiqueta}`).join(' · ')}</span>
    </Caja>
  );
}

export function Ticket(p: TicketProps): ReactElement {
  return (
    <Caja nombre="Ticket" props={{ variante: p.variante }} className={p.className}>
      <span className={css.titulo}>{p.titulo}</span>
      <span className={css.atenuado}>{p.subtitulo}</span>
      <ul className={css.lista}>
        {p.renglones.map((r) => (
          <li key={r.concepto}>
            {r.concepto} · {r.cifra}
          </li>
        ))}
      </ul>
      <span className={css.cifra}>{p.total}</span>
    </Caja>
  );
}

export function Palomita(p: { tamano?: number; className?: string }): ReactElement {
  return <Caja nombre="Palomita" props={{ tamano: p.tamano }} enLinea className={p.className} etiqueta="Listo" />;
}

export function MosaicoQr(p: { png: string; alt: string; className?: string }): ReactElement {
  return (
    <Caja nombre="MosaicoQr" className={p.className}>
      <img src={p.png} alt={p.alt} width={196} height={196} />
    </Caja>
  );
}

function restante(expiraAt: EpochS): number {
  return Math.max(0, expiraAt - Math.floor(Date.now() / 1000));
}

export function CodigoEmparejamiento(p: { codigo: string; expiraAt: EpochS; alVencer?: () => void; className?: string }): ReactElement {
  const [segundos, setSegundos] = useState(() => restante(p.expiraAt));
  const alVencer = p.alVencer;
  useEffect(() => {
    const t = setInterval(() => {
      const s = restante(p.expiraAt);
      setSegundos(s);
      if (s === 0) {
        clearInterval(t);
        alVencer?.();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [p.expiraAt, alVencer]);
  const mm = Math.floor(segundos / 60);
  const ss = String(segundos % 60).padStart(2, '0');
  return (
    <Caja nombre="CodigoEmparejamiento" className={p.className}>
      <code>{p.codigo}</code>
      <span className={css.atenuado}>
        Caduca en {mm}:{ss}
      </span>
    </Caja>
  );
}
