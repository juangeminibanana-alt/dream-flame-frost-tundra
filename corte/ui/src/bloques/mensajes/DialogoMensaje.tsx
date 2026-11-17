/**
 * DialogoMensaje (01 §4.8): lo abre ?mensaje=<application_id> o ?mensaje=t:<tienda_key> (y ?plantilla=<id>). Windows:
 * diálogo de 560 «Mensaje para {tienda}»; Android: hoja inferior que se expande al editar. Si la tienda tiene 2 o más
 * pendientes: «{tienda} tiene {2} muestras pendientes. ¿Un solo mensaje para las dos?» [Sí, un mensaje] [Solo esta].
 * TarjetaConfirmarAviso (01 §3.5): banda fija «¿Le enviaste el mensaje a {tienda}?» al volver la app al frente
 * (compacta, minimizable y fuera de bienvenida y emparejar; ver TarjetaConfirmarAvisoBase y capaConfirmar.ts).
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { Boton, BotonIcono, Hoja, Icono, Modal, useToast } from '@/componentes';
import { useClaseAncho, useRuta } from '@/app';
import { useAcciones, useConsulta } from '@/datos';
import { alVolverAlFrente } from '@/plataforma';
import { ahoraS, esPendiente, formato } from '@/dominio';
import { cerrarMensaje } from '../control/contexto';
import { NOMBRE_PLANTILLA, T } from '../textos';
import { PARAMS_PENDIENTES, cx, useEsAndroid } from '../util/comun';
import comun from '../util/comun.module.css';
import { EditorMensaje } from './EditorMensaje';
import { rutaSinBanda, useConvivenciaBanda } from './capaConfirmar';
import css from './DialogoMensaje.module.css';

const SIETE_DIAS = 7 * 86400;

/** Destino de ?mensaje=: una solicitud o una tienda («t:<tienda_key>»). */
export function leerDestinoMensaje(valor: string | null): { solicitud: string } | { tienda: string } | null {
  if (valor === null || valor.trim() === '') return null;
  return valor.startsWith('t:') ? { tienda: valor.slice(2) } : { solicitud: valor };
}

function contarPalabra(n: number): string {
  return n === 2 ? T.lasDos : T.lasN(formato.numero(n));
}

export function DialogoMensaje(): ReactElement | null {
  const ruta = useRuta();
  const destino = leerDestinoMensaje(ruta.consulta.get('mensaje'));
  const plantilla = ruta.consulta.get('plantilla');
  if (destino === null) return null;
  const clave = 'solicitud' in destino ? `s:${destino.solicitud}` : `t:${destino.tienda}`;
  return <DialogoAbierto key={clave} destino={destino} plantilla={plantilla} />;
}

function DialogoAbierto(p: { destino: { solicitud: string } | { tienda: string }; plantilla: string | null }): ReactElement {
  const android = useEsAndroid();
  const id = 'solicitud' in p.destino ? p.destino.solicitud : null;
  const detalle = useConsulta('muestra', { id: id ?? '' }, { activa: id !== null });
  const tiendaKey = 'tienda' in p.destino ? p.destino.tienda : detalle.datos?.muestra.tienda.tienda_key ?? null;
  const deTienda = useConsulta('muestras', { tienda: tiendaKey ?? '' }, { activa: tiendaKey !== null });
  const [juntas, setJuntas] = useState<boolean | null>(null);

  // Se filtra también por tienda en la interfaz por si la fuente no aplicó el filtro (demostración, copia).
  const pendientes = useMemo(() => (deTienda.datos?.items ?? []).filter((m) => esPendiente(m) && m.tienda.tienda_key === tiendaKey), [deTienda.datos, tiendaKey]);
  const nombreTienda = detalle.datos?.muestra.tienda.nombre ?? pendientes[0]?.tienda.nombre ?? deTienda.datos?.items[0]?.tienda.nombre ?? '';
  const otras = id !== null ? pendientes.filter((m) => m.application_id !== id) : [];
  const solicitudes = id === null ? pendientes.map((m) => m.application_id) : juntas ? [id, ...otras.map((m) => m.application_id)] : [id];

  const titulo = nombreTienda ? T.mensajePara(nombreTienda) : T.mensajeParaLaTienda;
  const listo = tiendaKey !== null && (id === null ? !deTienda.cargando : true);

  const cuerpo = (
    <div className={css.cuerpo}>
      {android ? <p className={css.subtitulo}>{T.subtituloMensaje}</p> : null}
      {id !== null && otras.length > 0 && juntas === null ? (
        <div className={comun.avisoInfo} role="status">
          <Icono nombre="Store" tamano={18} />
          <div className={css.pregunta}>
            <span>
              {T.variasPendientesTienda(nombreTienda ?? '', formato.numero(otras.length + 1), contarPalabra(otras.length + 1))}
            </span>
            <div className={comun.botones}>
              <Boton variante="secundario" tamano="sm" alPulsar={() => setJuntas(true)}>
                {T.siUnMensaje}
              </Boton>
              <Boton variante="fantasma" tamano="sm" alPulsar={() => setJuntas(false)}>
                {T.soloEsta}
              </Boton>
            </div>
          </div>
        </div>
      ) : null}
      {listo && tiendaKey !== null ? (
        <EditorMensaje
          key={solicitudes.join(',')}
          tiendaKey={tiendaKey}
          solicitudes={solicitudes}
          modo="dialogo"
          {...(p.plantilla ? { plantillaInicial: p.plantilla } : juntas ? { plantillaInicial: 'varias_muestras' } : {})}
          alRegistrar={() => cerrarMensaje()}
        />
      ) : detalle.error ? (
        <div className={comun.avisoCritico} role="alert">
          <Icono nombre="CircleAlert" tamano={18} />
          <span>{detalle.error.mensaje}</span>
        </div>
      ) : (
        <p className={css.subtitulo}>{T.cargandoMensaje}</p>
      )}
    </div>
  );

  return android ? (
    <Hoja abierta titulo={titulo} alCerrar={cerrarMensaje} anclas={[0.92, 0.96]}>
      {cuerpo}
    </Hoja>
  ) : (
    <Modal abierto titulo={titulo} descripcion={T.subtituloMensaje} ancho={560} completoEnCompacta alCerrar={cerrarMensaje}>
      {cuerpo}
    </Modal>
  );
}

/** Aviso copiado y sin confirmar más reciente (menos de 7 días). */
export function avisoPorConfirmar(avisos: C.AvisoTienda[], ahora: C.EpochS = ahoraS()): C.AvisoTienda | null {
  return avisos
    .filter((a) => a.copiado_at !== null && a.marcado_enviado_at === null && a.quitado_at === null && ahora - a.copiado_at < SIETE_DIAS)
    .sort((a, b) => (b.copiado_at ?? 0) - (a.copiado_at ?? 0))[0] ?? null;
}

// La galería (#/dev/bloques) muestra la tarjeta en su lugar y apaga la flotante mientras está abierta.
let suprimida = false;
const oyentesSupresion = new Set<() => void>();
export function suprimirTarjetaFlotante(valor: boolean): void {
  suprimida = valor;
  for (const fn of [...oyentesSupresion]) fn();
}
function useSuprimida(): boolean {
  return useSyncExternalStore(
    (fn) => {
      oyentesSupresion.add(fn);
      return () => {
        oyentesSupresion.delete(fn);
      };
    },
    () => suprimida,
    () => false,
  );
}

export function TarjetaConfirmarAviso(): ReactElement | null {
  const oculta = useSuprimida();
  return oculta ? null : <TarjetaConfirmarAvisoBase enLinea={false} />;
}

/** «Minimizada» al montar (la galería la muestra así); se marca con este valor hasta que se expande. */
const MINIMIZADA_AL_MONTAR = '*';

/**
 * Banda compacta de confirmación (01 §3.5; revisión del coordinador del 15 nov: la tarjeta de 4 renglones tapaba ~20 %
 * del celular y salía también en Emparejar):
 *   · Windows ≥ 900: UNA línea abajo a la derecha —ícono, pregunta (con «Lo copiaste hace… · plantilla» si cabe),
 *     [Sí, ya se lo envié] [Todavía no] y ⌄—, 48 px de alto; los avisos van abajo a la izquierda.
 *   · Celular y ventanas de menos de 900: pregunta en un renglón y los botones debajo, ≈ 64 px; en el celular, encima de
 *     la barra inferior, y los avisos suben sobre ella (--avisos-extra).
 *   · ⌄ la minimiza a una pastilla con el nombre de la tienda (a la izquierda en el celular, para no tapar el botón
 *     flotante de Muestras); al volver la app al frente se expande otra vez.
 *   · No sale en bienvenida ni en emparejar, ni mientras está abierto el diálogo del mensaje (?mensaje=).
 */
export function TarjetaConfirmarAvisoBase(p: { enLinea: boolean; minimizadaInicial?: boolean }): ReactElement | null {
  const ruta = useRuta();
  const avisos = useConsulta('avisos', {});
  const pendientes = useConsulta('muestras', PARAMS_PENDIENTES);
  const acciones = useAcciones();
  const toast = useToast();
  const android = useEsAndroid();
  const compacta = useClaseAncho() === 'compacta';
  const [ocultos, setOcultos] = useState<ReadonlySet<string>>(() => new Set());
  const [minimizado, setMinimizado] = useState<string | null>(p.minimizadaInicial ? MINIMIZADA_AL_MONTAR : null);
  const [ocupado, setOcupado] = useState(false);
  const [banda, setBanda] = useState<HTMLElement | null>(null);
  const enfocar = useRef<'pastilla' | 'banda' | null>(null);
  // Solo pregunta por lo que se copió ANTES de volver al frente (o de abrir la app): lo que se copia ahora mismo ya
  // tiene su pregunta en línea en el editor; si sales a TikTok y regresas, vuelve aquí (01 §3.5, §4.8 punto 6).
  const [corte, setCorte] = useState<C.EpochS>(() => ahoraS());

  // «Todavía no» la oculta hasta la siguiente vez que la app vuelve al frente (01 §3.5); minimizada, vuelve expandida.
  useEffect(
    () =>
      alVolverAlFrente(() => {
        setOcultos(new Set());
        setMinimizado(null);
        setCorte(ahoraS());
      }),
    [],
  );

  const aviso = avisoPorConfirmar((avisos.datos?.items ?? []).filter((a) => a.copiado_at !== null && a.copiado_at < corte));
  const tiendaFila = aviso ? (pendientes.datos?.items ?? []).find((m) => m.tienda.tienda_key === aviso.tienda_key)?.tienda : undefined;
  const sinNombre = aviso !== null && tiendaFila === undefined;
  const tienda = useConsulta('tienda', { key: aviso?.tienda_key ?? '' }, { activa: sinNombre });
  const nombre = tiendaFila?.nombre ?? tienda.datos?.tienda.nombre ?? null;
  const visible = aviso !== null && nombre !== null && !ocultos.has(aviso.id) && (p.enLinea || (!ruta.consulta.has('mensaje') && !rutaSinBanda(ruta.ruta)));
  const minimizada = visible && (minimizado === MINIMIZADA_AL_MONTAR || minimizado === aviso?.id);

  useConvivenciaBanda(banda, visible && !p.enLinea);

  // Al minimizar o expandir con el teclado, el foco sigue a la pieza que queda (la pastilla o el primer botón).
  useEffect(() => {
    if (!banda || enfocar.current === null) return;
    const destino = enfocar.current === 'pastilla' ? banda.querySelector<HTMLElement>('[aria-expanded]') : banda.querySelector<HTMLElement>('button');
    enfocar.current = null;
    destino?.focus();
  }, [banda, minimizada]);

  if (!visible || aviso === null || nombre === null) return null;
  const titulo = T.confirmarAvisoTitulo(nombre);
  const fija = p.enLinea ? {} : { 'data-capa-corte': '' };
  const clases = (extra?: string | false): string => cx(css.banda, android && css.android, p.enLinea && css.enLinea, extra);
  // Espacio reservado al final de la página (que es la que se desplaza, ver Marco.module.css) en el acomodo de celular:
  // así lo último de la pantalla puede subir por encima de la banda. En Windows ≥ 600 lo reserva el marco con
  // --avisos-extra (ver la nota de entrega), porque aquí empujaría la barra lateral fija.
  const reserva = p.enLinea ? null : <div className={cx(css.reserva, android && css.reservaAndroid)} aria-hidden="true" data-reserva-confirmar="" />;

  if (minimizada) {
    return (
      <>
      <aside ref={setBanda} className={clases(css.minimizada)} role="region" aria-label={titulo} {...fija}>
        <button
          type="button"
          className={css.pastilla}
          aria-expanded={false}
          aria-label={T.verConfirmarAviso(nombre)}
          title={android ? undefined : T.verConfirmarAviso(nombre)}
          onClick={() => {
            enfocar.current = 'banda';
            setMinimizado(null);
          }}
        >
          <span className={css.pastillaIcono} aria-hidden="true">
            <Icono nombre="MessageCircleWarning" tamano={16} />
          </span>
          <span className={css.pastillaTexto}>{nombre}</span>
        </button>
      </aside>
      {reserva}
      </>
    );
  }

  const confirmar = async (): Promise<void> => {
    setOcupado(true);
    const r = await acciones.editarAviso(aviso.id, { marcado_enviado_at: ahoraS(), rev: aviso.rev });
    setOcupado(false);
    if (r.estado === 'conflicto') toast.mostrar({ texto: T.conflicto, tono: 'info' });
    else if (r.estado === 'error') toast.mostrar({ texto: r.error?.mensaje ?? T.errorGenerico, tono: 'error' });
    else toast.mostrar({ texto: T.toastAvisoRegistrado, tono: 'ok', ...(r.estado === 'en_cola' ? { detalle: T.enCola } : {}), accion: { etiqueta: T.deshacer, alPulsar: () => void r.deshacer() }, duracion_ms: 6000 });
  };
  const detalle = `${T.loCopiaste(formato.relativa(aviso.copiado_at ?? aviso.creado_at))} · ${NOMBRE_PLANTILLA[aviso.plantilla_id] ?? T.otroMensaje}`;

  return (
    <>
    <aside ref={setBanda} className={clases()} role="region" aria-label={titulo} {...fija}>
      <div className={css.contenido}>
        <span className={css.icono} aria-hidden="true">
          <Icono nombre="MessageCircleWarning" tamano={16} />
        </span>
        <p className={css.texto} title={android ? undefined : `${titulo} · ${detalle}`}>
          <span className={css.titulo}>{titulo}</span>
          <span className={css.detalle}>
            <span aria-hidden="true"> · </span>
            {detalle}
          </span>
        </p>
        <div className={css.botones}>
          <Boton variante="primario" tamano="sm" {...(android || compacta ? {} : { icono: 'Check' as const })} cargando={ocupado} alPulsar={() => void confirmar()}>
            {T.siYaSeLoEnvie}
          </Boton>
          <Boton variante="fantasma" tamano="sm" alPulsar={() => setOcultos((s) => new Set([...s, aviso.id]))}>
            {T.todaviaNo}
          </Boton>
          <BotonIcono
            icono="ChevronDown"
            tamano="sm"
            etiqueta={T.minimizarConfirmarAviso}
            className={cx(css.minimizar)}
            alPulsar={() => {
              enfocar.current = 'pastilla';
              setMinimizado(aviso.id);
            }}
          />
        </div>
      </div>
    </aside>
    {reserva}
    </>
  );
}
