/**
 * Muestras › Todas (historial, 01 §4.7): chips de grupo con conteo (solo los que tienen más de 0), búsqueda, tabla
 * completa en escritorio (columnasMuestras('todas'), ordenable por cualquier columna; por omisión Solicitada de la más
 * reciente a la más antigua) y tarjetas en el celular (de 24 en 24, sin «Nº en tu cola»). Con «Sin envío»: el
 * desglose de por qué no debes nada.
 * [Exportar CSV] con csvMuestras (UTF-8 con BOM) y guardarArchivo: Windows abre el diálogo Guardar; Android comparte.
 * Casilla «Incluir mis notas, mi avance y mis avisos».
 */
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, Pantalla, useClaseAncho, usePlataforma } from '@/app';
import { PestanasMuestras, TarjetaMuestra, columnasMuestras } from '@/bloques';
import { Boton, CampoTexto, Casilla, ChipFiltro, EncabezadoPantalla, EstadoVacio, Esqueleto, EsqueletoVista, Tabla, useToast } from '@/componentes';
import { consultar, useConsulta, useSync } from '@/datos';
import { coincide, csvMuestras, formato, hoyLocal } from '@/dominio';
import { guardarArchivo } from '@/plataforma';
import { ORDEN_GRUPOS_TODAS, contarPorGrupo, desgloseSinEnvio, ordenarPorColumna, type DireccionOrden } from './logica';
import { ErrorVista, NecesitaPc } from './Estados';
import { CeldaEstado } from './CeldaEstado';
import { CeldaProductoPlegada } from './CeldaProducto';
import { columnasTodas, useAncho } from './columnas';
import { rutaDetalle } from './rutas';
import { T } from './textos';
import { cx, pestanasArriba } from './util';
import css from './Todas.module.css';

const SIN_PARAMS = {};
const PASO_TARJETAS = 24;

/** En el historial no hay «Nº en tu cola» (las tarjetas van por fecha de solicitud, no en el orden de la cola). */
function sinPosicion(m: C.MuestraVista): C.MuestraVista {
  return m.posicion_cola === null ? m : { ...m, posicion_cola: null };
}

/** Primera columna de fecha de solicitud (la que ordena por omisión, de la más reciente a la más antigua). */
function columnaSolicitada(columnas: readonly { id: string }[]): string {
  return columnas.find((c) => /solicit/i.test(c.id))?.id ?? 'solicitada';
}

export function PantallaMuestrasTodas(): ReactElement {
  const plataforma = usePlataforma();
  const clase = useClaseAncho();
  const android = plataforma === 'android';
  const movil = android || clase === 'compacta';
  const toast = useToast();
  const sync = useSync();
  const consulta = useConsulta('muestras', SIN_PARAMS);
  // «Estado en TikTok» con el grupo en el chip y el motivo debajo (CeldaEstado): el resto de las celdas, las de @/bloques.
  const columnas = useMemo(() => columnasMuestras('todas').map((c) => (c.id === 'tiktok' ? { ...c, celda: (m: C.MuestraVista) => <CeldaEstado m={m} /> } : c)), []);
  // Las columnas que caben en el ancho de la tabla (columnas.ts): si no caben las 10, Tienda y Variante van dentro de
  // Producto y del resto, las que quepan; si ni las esenciales caben, tarjetas.
  const [refTabla, anchoTabla] = useAncho<HTMLDivElement>();
  const ajuste = useMemo(() => columnasTodas(columnas, anchoTabla, (m: C.MuestraVista) => <CeldaProductoPlegada m={m} />), [columnas, anchoTabla]);
  const conTarjetas = movil || !ajuste.caben;
  const [grupos, setGrupos] = useState<C.GrupoMuestra[]>([]);
  const [q, setQ] = useState('');
  const [orden, setOrden] = useState<{ columna: string; direccion: DireccionOrden } | null>(null);
  const [incluirLocal, setIncluirLocal] = useState(false);
  const [exportando, setExportando] = useState(false);
  // Tarjetas (celular): se pintan de 24 en 24 al acercarse al final (02 §10.3: pocas fotos decodificadas a la vez y un
  // primer pliegue rápido con ~100 solicitudes); [Mostrar más] hace lo mismo sin depender del desplazamiento.
  const [limite, setLimite] = useState(PASO_TARJETAS);
  const [centinela, setCentinela] = useState<HTMLDivElement | null>(null);
  useEffect(() => setLimite(PASO_TARJETAS), [grupos, q, orden]);
  useEffect(() => {
    if (!centinela || typeof IntersectionObserver === 'undefined') return undefined;
    // Se vuelve a observar con cada tanda: si el centinela sigue cerca, la siguiente llega sola.
    const o = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) setLimite((l) => l + PASO_TARJETAS);
    }, { rootMargin: '600px 0px' });
    o.observe(centinela);
    return () => o.disconnect();
  }, [centinela, limite]);

  const todas = consulta.datos?.items;
  const conteos = useMemo(() => contarPorGrupo(todas ?? []), [todas]);
  const visibles = useMemo(() => {
    const base = (todas ?? []).filter((m) => (grupos.length === 0 || grupos.includes(m.grupo)) && (!q.trim() || coincide(q, m.producto.titulo_corto, m.producto.titulo, m.tienda.nombre, m.variante)));
    const o = orden ?? { columna: columnaSolicitada(columnas), direccion: 'desc' as const };
    return ordenarPorColumna(base, o.columna, o.direccion);
  }, [todas, grupos, q, orden, columnas]);
  const tiendas = useMemo(() => new Set((todas ?? []).map((m) => m.tienda.tienda_key)).size, [todas]);
  const soloSinEnvio = grupos.length === 1 && grupos[0] === 'sin_envio';
  const desglose = useMemo(() => desgloseSinEnvio(todas ?? []), [todas]);

  const alternarOrden = (columna: string): void => {
    setOrden((o) => {
      const actual = o ?? { columna: columnaSolicitada(columnas), direccion: 'desc' as const };
      if (actual.columna !== columna) return { columna, direccion: /solicit|comision|precio|vend/i.test(columna) ? 'desc' : 'asc' };
      return { columna, direccion: actual.direccion === 'asc' ? 'desc' : 'asc' };
    });
  };

  const exportar = async (): Promise<void> => {
    setExportando(true);
    try {
      let extra: { avisos: C.AvisoTienda[]; notas: C.Nota[] } | undefined;
      if (incluirLocal) {
        const [avisos, notas] = await Promise.all([consultar('avisos', {}), consultar('notas', { entidad: 'muestra' })]);
        extra = { avisos: avisos.items, notas: notas.items };
      }
      const contenido = csvMuestras(visibles, incluirLocal, extra);
      const r = await guardarArchivo(T.nombreCsv(hoyLocal()), 'text/csv', contenido);
      if (r === 'guardado') toast.mostrar({ texto: T.csvGuardado, tono: 'ok' });
      else if (r === 'compartido') toast.mostrar({ texto: T.csvCompartido, tono: 'ok' });
      else if (r === 'error') toast.mostrar({ texto: T.csvError, tono: 'error' });
    } catch {
      toast.mostrar({ texto: T.csvError, tono: 'error' });
    } finally {
      setExportando(false);
    }
  };

  const lista = todas !== undefined;
  // Igual que Pendientes: ≥ 1180 las pestañas van junto al título (lienzo Muestras.png).
  const arriba = pestanasArriba(movil, clase);
  const pestanas = <PestanasMuestras activa="todas" className={cx(arriba ? css.pestanasCabeza : movil ? css.pestanasMovil : css.pestanas)} />;
  const contexto = lista
    ? grupos.length > 0 || q.trim()
      ? T.contextoFiltrado(formato.numero(visibles.length), formato.numero(todas.length))
      : T.contextoTodas(formato.numero(todas.length), formato.numero(tiendas), tiendas)
    : T.contextoCargando;

  let cuerpo: ReactElement;
  if (!lista) {
    if (consulta.error?.codigo === 'necesita_pc') cuerpo = <NecesitaPc alReintentar={() => void consulta.refrescar()} />;
    else if (consulta.error) cuerpo = <ErrorVista error={consulta.error} alReintentar={() => void consulta.refrescar()} />;
    else
      cuerpo = (
        <EsqueletoVista textoLento={T.cargandoLento} className={cx(css.esqueleto)}>
          <div className={cx(css.esqueletoChips)}>
            {[0, 1, 2, 3].map((i) => (
              <Esqueleto key={i} forma="bloque" ancho={96} alto={32} />
            ))}
          </div>
          <Esqueleto forma="fila" lineas={8} />
        </EsqueletoVista>
      );
  } else if (todas.length === 0) {
    cuerpo = (
      <div className={cx(css.estado)}>
        <EstadoVacio icono="Package" titulo={T.nuncaTitulo} texto={T.nuncaTexto} {...(sync.puede ? { accion: { etiqueta: T.sincronizarAhora, alPulsar: () => void sync.sincronizar() } } : {})} />
      </div>
    );
  } else {
    const vacio = (
      <div className={cx(css.estado)}>
        <EstadoVacio icono="Search" titulo={T.sinResultadosTitulo} accion={{ etiqueta: T.limpiarFiltros, alPulsar: () => { setGrupos([]); setQ(''); } }} />
      </div>
    );
    cuerpo = (
      <>
        <div className={cx(css.herramientas)}>
          <CampoTexto etiqueta={T.buscarEtiqueta} etiquetaOculta tipo="search" valor={q} alCambiar={setQ} placeholder={T.buscarPlaceholder} className={cx(css.busqueda)} />
          <div className={cx(movil ? css.chipsDesplazables : css.chips)} role="group" aria-label={T.gruposEtiqueta}>
            {ORDEN_GRUPOS_TODAS.filter((g) => (conteos[g] ?? 0) > 0).map((g) => (
              <ChipFiltro key={g} activo={grupos.includes(g)} conteo={conteos[g] ?? 0} alCambiar={(si) => setGrupos((x) => (si ? [...x, g] : x.filter((y) => y !== g)))}>
                {T.grupoPlural[g]}
              </ChipFiltro>
            ))}
          </div>
          <div className={cx(css.exportar)}>
            <Casilla marcada={incluirLocal} alCambiar={setIncluirLocal} etiqueta={T.incluirLocal} />
            <Boton variante="secundario" icono={android ? 'Share2' : 'Download'} cargando={exportando} alPulsar={() => void exportar()}>
              {T.exportarCsv}
            </Boton>
          </div>
        </div>
        {soloSinEnvio ? (
          <p className={cx(css.nota)}>
            {T.sinEnvioTexto(formato.numero(desglose.sinPedido), formato.numero(desglose.rechazada), formato.numero(desglose.noEnvio), formato.numero(desglose.retirada))}
          </p>
        ) : null}
        <div ref={refTabla} className={cx(css.contenido)}>
          {visibles.length === 0 ? (
            vacio
          ) : conTarjetas ? (
            <>
              <ol className={cx(css.tarjetas)} aria-label={T.todasEtiqueta}>
                {visibles.slice(0, limite).map((m) => (
                  <li key={m.application_id} className={cx(css.tarjetaFila)}>
                    {/* Historial ordenado por Solicitada: el Nº de la cola de Pendientes aquí se leía como una numeración rota. */}
                    <TarjetaMuestra muestra={sinPosicion(m)} variante="lista" conAccion={false} alAbrir={() => navegar(rutaDetalle(m.application_id))} />
                  </li>
                ))}
              </ol>
              {visibles.length > limite ? (
                <div ref={setCentinela} className={cx(css.mas)}>
                  <span className={cx(css.masTexto)}>{T.mostrando(formato.numero(limite), formato.numero(visibles.length))}</span>
                  <Boton variante="secundario" tamano="sm" alPulsar={() => setLimite((l) => l + PASO_TARJETAS)}>
                    {T.mostrarMas}
                  </Boton>
                </div>
              ) : null}
            </>
          ) : (
            <Tabla<C.MuestraVista>
              filas={visibles}
              columnas={ajuste.columnas}
              idFila={(m) => m.application_id}
              etiqueta={T.todasEtiqueta}
              orden={orden ?? { columna: columnaSolicitada(columnas), direccion: 'desc' }}
              alOrdenar={alternarOrden}
              alAbrir={(m) => navegar(rutaDetalle(m.application_id))}
              claveScroll="muestras-todas"
              vacio={vacio}
              className={cx(css.tabla)}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <Pantalla titulo={T.tituloTodas} lista={lista} className={cx(css.pantalla)}>
      <EncabezadoPantalla titulo={T.titulo} contexto={contexto} {...(arriba ? { acciones: pestanas } : {})} />
      {arriba ? null : pestanas}
      <div className={consulta.refrescando ? css.refrescando : undefined}>{cuerpo}</div>
    </Pantalla>
  );
}
