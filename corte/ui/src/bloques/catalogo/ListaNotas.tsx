/**
 * ListaNotas (01 §4.3 tarjeta 7, §4.10, §4.12, §7.2): notas locales de una entidad —crear, editar con guardado
 * automático, fijar arriba y borrar con Deshacer—. Funciona sin conexión: en Android las ops van a la cola y el estado
 * dice «Guardado en este celular · se enviará a tu PC».
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { AreaTexto, Boton, Esqueleto, Icono, Menu, useToast } from '@/componentes';
import { useAcciones, useConsulta, type EstadoAccion } from '@/datos';
import { formato, nuevoId } from '@/dominio';
import { PLACEHOLDER_NOTA, T } from '../textos';
import { cx } from '../util/comun';
import css from './ListaNotas.module.css';

type EstadoGuardado = { tipo: 'guardando' } | { tipo: 'guardado'; enCola: boolean } | { tipo: 'error'; texto: string } | null;

function textoEstado(e: EstadoGuardado): string | null {
  if (e === null) return null;
  if (e.tipo === 'guardando') return T.guardando;
  if (e.tipo === 'error') return e.texto;
  return e.enCola ? T.enCola : T.guardado;
}

function estadoDe(r: { estado: EstadoAccion; error: { mensaje: string } | null }): EstadoGuardado {
  if (r.estado === 'conflicto') return { tipo: 'error', texto: T.conflictoNota };
  if (r.estado === 'error') return { tipo: 'error', texto: r.error?.mensaje ?? T.errorGenerico };
  return { tipo: 'guardado', enCola: r.estado === 'en_cola' };
}

/** Orden: fijadas primero y luego la más reciente. */
export function ordenarNotas(notas: C.Nota[]): C.Nota[] {
  return [...notas].sort((a, b) => (a.fijada !== b.fijada ? (a.fijada ? -1 : 1) : b.actualizado_at - a.actualizado_at));
}

function Nota(p: { nota: C.Nota; alEstado: (e: EstadoGuardado) => void }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const { nota } = p;
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(nota.texto);
  const temporizador = useRef<number | null>(null);
  const rev = useRef(nota.rev);
  rev.current = nota.rev;

  useEffect(() => {
    if (!editando) setTexto(nota.texto);
  }, [nota.texto, editando]);
  useEffect(() => () => {
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
  }, []);

  const guardar = (valor: string): void => {
    if (temporizador.current !== null) window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => {
      const limpio = valor.trim();
      if (limpio === '' || limpio === nota.texto.trim()) return;
      p.alEstado({ tipo: 'guardando' });
      void acciones.editarNota(nota.id, { texto: limpio, rev: rev.current }).then((r) => p.alEstado(estadoDe(r)));
    }, 700);
  };

  const opciones = [
    { id: 'editar', etiqueta: T.editarNota, icono: 'Pencil' as const, alPulsar: () => setEditando(true) },
    nota.fijada
      ? { id: 'desfijar', etiqueta: T.desfijarNota, icono: 'Pin' as const, alPulsar: () => void acciones.editarNota(nota.id, { fijada: false, rev: nota.rev }).then((r) => p.alEstado(estadoDe(r))) }
      : { id: 'fijar', etiqueta: T.fijarNota, icono: 'Pin' as const, alPulsar: () => void acciones.editarNota(nota.id, { fijada: true, rev: nota.rev }).then((r) => p.alEstado(estadoDe(r))) },
    {
      id: 'borrar', etiqueta: T.borrarNota, icono: 'Trash2' as const, peligro: true,
      alPulsar: () => void acciones.borrarNota(nota.id, nota.rev).then((r) => {
        if (r.estado === 'aplicada' || r.estado === 'en_cola') {
          toast.mostrar({ texto: T.notaBorrada, tono: 'ok', accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() }, duracion_ms: 6000 });
        } else p.alEstado(estadoDe(r));
      }),
    },
  ];

  return (
    <li className={cx(css.nota, nota.fijada && css.fijada)}>
      {editando ? (
        <AreaTexto
          etiqueta={T.editarNota}
          etiquetaOculta
          valor={texto}
          autoFoco
          filas={3}
          alCambiar={(v) => {
            setTexto(v);
            guardar(v);
          }}
          className={cx(css.area)}
        />
      ) : (
        <p className={css.texto}>{nota.texto}</p>
      )}
      <div className={css.pieNota}>
        <span className={css.fecha}>
          {nota.fijada ? (
            <span className={css.marcaFijada}>
              <Icono nombre="Pin" tamano={14} /> {T.notaFijada}
            </span>
          ) : null}
          {formato.relativa(nota.actualizado_at)}
        </span>
        {editando ? (
          <Boton variante="fantasma" tamano="sm" alPulsar={() => setEditando(false)}>
            {T.listoNota}
          </Boton>
        ) : (
          <Menu etiqueta={T.accionesNota} opciones={opciones} />
        )}
      </div>
    </li>
  );
}

export function ListaNotas(p: { entidad: C.EntidadNota; entidadId: string | null; titulo?: string; className?: string }): ReactElement {
  const params = p.entidadId !== null ? { entidad: p.entidad, entidad_id: p.entidadId } : { entidad: p.entidad };
  const consulta = useConsulta('notas', params);
  const acciones = useAcciones();
  const [borrador, setBorrador] = useState('');
  const [estado, setEstado] = useState<EstadoGuardado>(null);
  const [creando, setCreando] = useState(false);
  const notas = useMemo(
    () => ordenarNotas((consulta.datos?.items ?? []).filter((n) => n.entidad === p.entidad && n.entidad_id === p.entidadId)),
    [consulta.datos, p.entidad, p.entidadId],
  );

  const agregar = async (): Promise<void> => {
    const texto = borrador.trim();
    if (texto === '') return;
    setCreando(true);
    setEstado({ tipo: 'guardando' });
    const r = await acciones.crearNota({ id: nuevoId(), entidad: p.entidad, entidad_id: p.entidadId, texto });
    setCreando(false);
    setEstado(estadoDe(r));
    if (r.estado === 'aplicada' || r.estado === 'en_cola') setBorrador('');
  };

  const textoGuardado = textoEstado(estado);
  return (
    <section className={cx(css.raiz, p.className)} aria-label={p.titulo ?? T.notas}>
      <header className={css.cabeza}>
        <h3 className={css.titulo}>{p.titulo ?? T.notas}</h3>
        <span className={cx(css.estado, estado?.tipo === 'error' && css.estadoError)} aria-live="polite">
          {textoGuardado}
        </span>
      </header>
      <div className={css.nueva}>
        <AreaTexto
          etiqueta={T.nuevaNota}
          etiquetaOculta
          valor={borrador}
          alCambiar={setBorrador}
          placeholder={PLACEHOLDER_NOTA[p.entidad]}
          filas={2}
          maximo={2000}
          className={cx(css.area)}
        />
        <Boton variante="secundario" tamano="sm" icono="Plus" deshabilitado={borrador.trim() === ''} cargando={creando} alPulsar={() => void agregar()} className={cx(css.agregar)}>
          {T.agregarNotaBoton}
        </Boton>
      </div>
      {consulta.cargando ? (
        <Esqueleto forma="texto" lineas={2} />
      ) : notas.length === 0 ? (
        <p className={css.vacio}>{T.sinNotas}</p>
      ) : (
        <ul className={css.lista}>
          {notas.map((n) => (
            <Nota key={n.id} nota={n} alEstado={setEstado} />
          ))}
        </ul>
      )}
    </section>
  );
}
