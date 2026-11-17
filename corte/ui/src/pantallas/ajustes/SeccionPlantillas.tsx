/**
 * E. Plantillas de mensajes (01_ux §4.14 E, §4.8): las 11 plantillas, editor con chips de variables que se insertan
 * donde está el cursor, vista previa con una muestra real (dominio.resolverPlantilla, variables resaltadas),
 * [Restaurar original] y el campo «Tu firma». Todo es estado local (PATCH con rev; en Android va por la cola).
 */
import { useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type * as C from '@/contrato';
import { AreaTexto, Boton, CampoTexto, Chip, Icono, useToast } from '@/componentes';
import { VARIABLES_PLANTILLA, esPendiente, fechaPrometidaPorOmision, hoyLocal, resolverPlantilla, sumarDias } from '@/dominio';
import { useAcciones, useConsulta, useSesion } from '@/datos';
import { CargandoGrupo, ErrorCarga, FilaLibre, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

function Resaltado(p: { texto: string; rangos: { inicio: number; fin: number }[] }): ReactElement {
  const partes: ReactNode[] = [];
  let i = 0;
  const orden = [...p.rangos].sort((a, b) => a.inicio - b.inicio);
  orden.forEach((r, k) => {
    if (r.inicio > i) partes.push(p.texto.slice(i, r.inicio));
    partes.push(
      <mark key={k} className={cx(css.marca)}>
        {p.texto.slice(r.inicio, r.fin)}
      </mark>,
    );
    i = Math.max(i, r.fin);
  });
  if (i < p.texto.length) partes.push(p.texto.slice(i));
  return <>{partes}</>;
}

/**
 * Extracto de una línea del cuerpo crudo: las variables ({tienda}, {agradecimiento_socio}…) van en mono y con su propio
 * color, para que «{agradecimiento_socio}Me retrasé» no se lea como una sola palabra (la variable ya trae su espacio).
 */
function Extracto(p: { cuerpo: string }): ReactElement {
  const plano = p.cuerpo.replace(/\s+/g, ' ');
  const partes = plano.split(/(\{[a-z_]+\})/g).filter((x) => x !== '');
  return (
    <>
      {partes.map((x, k) =>
        /^\{[a-z_]+\}$/.test(x) ? (
          <span key={k} className={cx(css.extractoVariable)}>
            {x}
          </span>
        ) : (
          x
        ),
      )}
    </>
  );
}

function Editor(p: { plantilla: C.PlantillaMensaje; muestra: C.MuestraVista | null; firma: string; alVolver: () => void }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const [cuerpo, setCuerpo] = useState(p.plantilla.cuerpo);
  const [guardando, setGuardando] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const cambiado = cuerpo !== p.plantilla.cuerpo;

  const insertar = (variable: string): void => {
    const area = caja.current?.querySelector('textarea');
    const token = `{${variable}}`;
    const ini = area?.selectionStart ?? cuerpo.length;
    const fin = area?.selectionEnd ?? cuerpo.length;
    const nuevo = cuerpo.slice(0, ini) + token + cuerpo.slice(fin);
    setCuerpo(nuevo);
    requestAnimationFrame(() => {
      if (!area) return;
      area.focus();
      area.setSelectionRange(ini + token.length, ini + token.length);
    });
  };

  const vista = useMemo(() => {
    if (!p.muestra) return null;
    const m = p.muestra;
    const fecha = fechaPrometidaPorOmision(m.avance) ?? sumarDias(hoyLocal(), 3);
    return resolverPlantilla(
      { id: p.plantilla.id, cuerpo, predeterminada: p.plantilla.predeterminada && !cambiado, rev: p.plantilla.rev },
      {
        tienda: { nombre: m.tienda.nombre, es_socio: m.tienda.es_socio },
        muestras: [m],
        compromisos: { [m.application_id]: fecha },
        fecha_anterior: m.avisos.promesa,
        link_video: m.avance.content_id ? `https://www.tiktok.com/video/${m.avance.content_id}` : null,
        problema_envio: null,
        firma: p.firma,
      },
    );
  }, [p.muestra, p.plantilla, cuerpo, cambiado, p.firma]);

  const guardar = async (): Promise<void> => {
    setGuardando(true);
    const r = await acciones.editarPlantilla(p.plantilla.id, { cuerpo, rev: p.plantilla.rev });
    setGuardando(false);
    if (r.estado === 'aplicada' || r.estado === 'en_cola') {
      toast.mostrar({ texto: T.plantillas.guardada, tono: 'ok', accion: { etiqueta: 'Deshacer', alPulsar: () => void r.deshacer() } });
      p.alVolver();
    } else toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
  };
  const restaurar = async (): Promise<void> => {
    setGuardando(true);
    const r = await acciones.restaurarPlantilla(p.plantilla.id);
    setGuardando(false);
    if (r.estado === 'aplicada' || r.estado === 'en_cola') {
      if (r.objeto) setCuerpo(r.objeto.cuerpo);
      toast.mostrar({ texto: T.plantillas.restaurada, tono: 'ok' });
    } else toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
  };

  return (
    <div className={cx(css.pila)} data-editor-plantilla={p.plantilla.id}>
      <button type="button" className={cx(css.volverEnlace)} onClick={p.alVolver}>
        <Icono nombre="ChevronLeft" tamano={16} />
        {T.plantillas.volver}
      </button>
      <Grupo titulo={p.plantilla.nombre}>
        <FilaLibre>
          <div ref={caja}>
            <AreaTexto etiqueta={T.plantillas.cuerpo} valor={cuerpo} alCambiar={setCuerpo} filas={8} contador />
          </div>
          <div className={cx(css.variables)} role="group" aria-label={T.plantillas.variables}>
            <span className={cx(css.variablesRotulo)}>{T.plantillas.variables}</span>
            {VARIABLES_PLANTILLA.map((v) => (
              <button key={v} type="button" className={cx(css.variable)} onClick={() => insertar(v)}>
                {`{${v}}`}
              </button>
            ))}
          </div>
        </FilaLibre>
        <FilaLibre>
          <span className={cx(css.filaEtiqueta)}>{T.plantillas.vistaPrevia}</span>
          {vista ? (
            <>
              <p className={cx(css.vistaPrevia)}>
                <Resaltado texto={vista.texto} rangos={vista.resaltados} />
              </p>
              {vista.faltantes.length > 0 ? <span className={cx(css.notaChica)}>{T.plantillas.faltan}</span> : null}
            </>
          ) : (
            <span className={cx(css.filaDesc)}>{T.plantillas.sinMuestra}</span>
          )}
        </FilaLibre>
      </Grupo>
      <div className={cx(css.acciones)}>
        <Boton variante="primario" deshabilitado={!cambiado} cargando={guardando} alPulsar={() => void guardar()}>
          {T.guardar}
        </Boton>
        {!p.plantilla.predeterminada ? (
          <Boton variante="secundario" icono="RotateCcw" alPulsar={() => void restaurar()}>
            {T.plantillas.restaurar}
          </Boton>
        ) : null}
        <Boton variante="fantasma" alPulsar={p.alVolver}>
          {T.cancelar}
        </Boton>
      </div>
    </div>
  );
}

function Firma(p: { prefs: C.PreferenciasSincronizadas; username: string }): ReactElement {
  const acciones = useAcciones();
  const toast = useToast();
  const [valor, setValor] = useState(p.prefs.firma);
  const [guardando, setGuardando] = useState(false);
  const guardar = async (): Promise<void> => {
    if (valor === p.prefs.firma) return;
    setGuardando(true);
    const r = await acciones.editarPreferencias({ firma: valor.trim(), rev: p.prefs.rev });
    setGuardando(false);
    toast.mostrar(r.estado === 'aplicada' || r.estado === 'en_cola' ? { texto: T.plantillas.firmaGuardada, tono: 'ok' } : { texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
  };
  return (
    <FilaLibre className={cx(css.alias)}>
      <CampoTexto etiqueta={T.plantillas.firma} valor={valor} alCambiar={setValor} placeholder={T.plantillas.firmaPlaceholder(p.username)} ayuda={T.plantillas.firmaAyuda} maximo={80} alEnter={() => void guardar()} className={cx(css.aliasCampo)} />
      <Boton variante="secundario" deshabilitado={valor === p.prefs.firma} cargando={guardando} alPulsar={() => void guardar()} className={cx(css.aliasBoton)}>
        {T.guardar}
      </Boton>
    </FilaLibre>
  );
}

export function SeccionPlantillas(): ReactElement {
  const plantillas = useConsulta('plantillas', {});
  const prefs = useConsulta('preferencias', {});
  const muestras = useConsulta('muestras', { orden: 'prioridad' });
  const sesion = useSesion();
  const [editando, setEditando] = useState<string | null>(null);
  const titulo = T.secciones.plantillas.titulo;
  const muestra = muestras.datos?.items.find((m) => esPendiente(m)) ?? muestras.datos?.items[0] ?? null;

  if (plantillas.cargando && !plantillas.datos) {
    return (
      <Seccion titulo={titulo} id="plantillas" descripcion={T.plantillas.descripcion}>
        <CargandoGrupo filas={6} />
      </Seccion>
    );
  }
  if (!plantillas.datos) {
    return (
      <Seccion titulo={titulo} id="plantillas" descripcion={T.plantillas.descripcion}>
        <ErrorCarga error={plantillas.error} alReintentar={() => void plantillas.refrescar()} />
      </Seccion>
    );
  }
  const actual = editando ? plantillas.datos.items.find((x) => x.id === editando) ?? null : null;
  if (actual) {
    return (
      <Seccion titulo={titulo} id="plantillas">
        <Editor plantilla={actual} muestra={muestra} firma={prefs.datos?.firma ?? ''} alVolver={() => setEditando(null)} />
      </Seccion>
    );
  }
  return (
    <Seccion titulo={titulo} id="plantillas" descripcion={T.plantillas.descripcion}>
      {prefs.datos ? (
        <Grupo>
          <Firma prefs={prefs.datos} username={sesion.datos?.cuenta?.username ?? 'tu_usuario'} />
        </Grupo>
      ) : null}
      <Grupo titulo={T.plantillas.lista}>
        <ul className={cx(css.plantillas)}>
          {plantillas.datos.items.map((x) => (
            <li key={x.id}>
              <button type="button" className={cx(css.plantilla)} onClick={() => setEditando(x.id)} aria-label={`${T.plantillas.editar}: ${x.nombre}`}>
                <span className={cx(css.plantillaTextos)}>
                  <span className={cx(css.plantillaNombre)}>
                    {x.nombre}
                    {!x.predeterminada ? (
                      <Chip tono="marca" tamano="md">
                        {T.plantillas.editada}
                      </Chip>
                    ) : null}
                  </span>
                  <span className={cx(css.plantillaExtracto)}>
                    <Extracto cuerpo={x.cuerpo} />
                  </span>
                </span>
                <Icono nombre="ChevronRight" tamano={18} className={cx(css.masFlecha)} />
              </button>
            </li>
          ))}
        </ul>
      </Grupo>
    </Seccion>
  );
}
