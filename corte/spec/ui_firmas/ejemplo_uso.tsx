/**
 * Ejemplo COMPILABLE de cómo una pantalla usa las firmas (BUILD_SPEC §8). Se compila desde ui/ con `npm run firmas`
 * (ui/tsconfig.firmas.json incluye spec/ui_firmas/** directamente, con skipLibCheck: false): no se copia a ui/.
 * rev. 3.1: también usa Foto con registroImagenes, useRecorrido + BurbujaRecorrido y elegirArchivo.
 */
import type * as C from '@/contrato';
import { useConsulta, useAcciones, useSync, useListaEstable, ErrorHub, hub } from '@/datos';
import { useRuta, useClaseAncho, usePanelDisponible, useAtajos, useRecorrido, navegar, Pantalla } from '@/app';
import {
  EncabezadoPantalla, Boton, BotonIcono, Kpi, BandaKpi, Tabla, EsqueletoVista, Esqueleto, EstadoVacio, PanelLateral,
  useToast, GraficaColumnas, Foto, BurbujaRecorrido,
} from '@/componentes';
import { formato, hoyLocal, contarTrabajo, armarPlan, desdePorOmision, ahoraS, opsDePlan, registroImagenes } from '@/dominio';
import { TarjetaMuestra, columnasMuestras, useControlMuestra, PestanasMuestras } from '@/bloques';
import { esAndroid, copiarTexto, elegirArchivo } from '@/plataforma';
import type { ModuloMuestras } from './pantallas';

function PantallaEjemplo() {
  const { params } = useRuta();
  const ancho = useClaseAncho();
  const conPanel = usePanelDisponible();
  const muestras = useConsulta('muestras', { grupo: ['vencida', 'por_vencer', 'pausada'], orden: 'prioridad' });
  const dashboard = useConsulta('dashboard', { periodo: '30d' });
  const avisos = useConsulta('avisos', {});
  const lista = useListaEstable(muestras.datos?.items, (m) => m.application_id);
  const control = useControlMuestra();
  const acciones = useAcciones();
  const sync = useSync();
  const toast = useToast();
  const recorrido = useRecorrido('muestras');
  const hoy = hoyLocal();

  useAtajos([
    { teclas: 'e', descripcion: 'Acción principal', accion: () => { const m = lista.items[0]; if (m) void control.accionPrincipal(m); } },
    { teclas: 'ctrl+z', descripcion: 'Deshacer el último cambio', accion: () => void acciones.deshacerUltimo() },
  ]);

  if (muestras.cargando) return <EsqueletoVista><Esqueleto forma="fila" lineas={6} /></EsqueletoVista>;
  if (muestras.error instanceof ErrorHub && muestras.error.codigo === 'necesita_pc') {
    return <EstadoVacio icono="Monitor" titulo="Necesita tu PC encendida" />;
  }
  if (muestras.error instanceof ErrorHub && muestras.error.codigo === 'conflicto' && muestras.error.vigente) {
    const vigente: C.ObjetoLocal = muestras.error.vigente;
    void vigente.rev;
  }
  const conteos = contarTrabajo(lista.items, avisos.datos?.items ?? [], hoy);
  const k: C.Kpis | undefined = dashboard.datos?.kpis;
  const primera = lista.items[0];
  const metaPrimera: C.ImagenMeta | undefined = registroImagenes.leer(primera?.producto.imagen);

  async function crearPlan(): Promise<void> {
    const r = armarPlan({
      muestras: lista.items, incluidas: lista.items.map((m) => m.application_id), capacidad: 3, dias: [0, 1, 2, 3, 4, 5],
      desde: desdePorOmision(ahoraS()), respetarFechas: true, orden: 'sugerido', planes: [], promesas: {}, hoy,
    });
    const res = await acciones.lote(opsDePlan(r, lista.items, []));
    toast.mostrar({ texto: `Plan listo: terminas el ${r.termina ? formato.fechaConDia(r.termina) : '—'}`, accion: { etiqueta: 'Deshacer', alPulsar: () => void res.deshacer() } });
  }

  async function importarPlan(): Promise<void> {
    const ruta = await elegirArchivo('Importar plan, avisos y notas', ['json']);
    if (ruta) { const r = await hub.importarLocal(ruta); toast.mostrar({ texto: `Importados ${formato.numero(r.importados.planes)} planes` }); }
  }

  return (
    <Pantalla titulo="Muestras" lista={!!muestras.datos}>
      <EncabezadoPantalla
        titulo="Muestras"
        contexto={`Te faltan ${formato.numero(conteos.pendientes)} videos`}
        acciones={<BotonIcono icono="RefreshCw" etiqueta="Sincronizar ahora" girando={!!sync.estado?.en_curso} alPulsar={() => void sync.sincronizar()} />}
      />
      <BurbujaRecorrido visible={recorrido.visible} texto={recorrido.texto} esUltimo={recorrido.esUltimo} alSiguiente={recorrido.siguiente} alEntendido={recorrido.entendido}>
        <PestanasMuestras activa="pendientes" />
      </BurbujaRecorrido>
      {primera && (
        <Foto url={primera.producto.imagen} alt={primera.producto.titulo_corto ?? 'Producto'} anchoCss={96} proporcion="1:1"
          tienda={primera.tienda.nombre} categoria={primera.producto.categoria} {...(metaPrimera ? { meta: metaPrimera } : {})} />
      )}
      {k && (
        <BandaKpi titulo="Tu dinero · últimos 30 días" accion={{ etiqueta: 'Ver ventas ›', a: '/ventas' }}>
          <Kpi etiqueta="Comisión · 30 días" valor={formato.dinero(k.comision_total_centavos)} />
        </BandaKpi>
      )}
      {ancho === 'compacta' || esAndroid()
        ? lista.items.map((m) => <TarjetaMuestra key={m.application_id} muestra={m} variante="lista" alAbrir={() => navegar(`/muestras/m/${m.application_id}`)} />)
        : <Tabla etiqueta="Pendientes" filas={lista.items} columnas={columnasMuestras('pendientes')} idFila={(m) => m.application_id} seleccionada={params['id'] ?? null} />}
      <PanelLateral abierto={conPanel && !!params['id']} titulo="Detalle" alCerrar={() => navegar('/muestras')}>
        <Boton variante="primario" alPulsar={() => void crearPlan()}>Armar mi plan · 1 min</Boton>
        <Boton variante="secundario" alPulsar={() => void copiarTexto('hola')}>Copiar</Boton>
        <Boton variante="fantasma" alPulsar={() => void importarPlan()}>Importar desde archivo…</Boton>
      </PanelLateral>
      <GraficaColumnas titulo="Comisión por semana" puntos={[]} formatoEje={(v) => formato.ejeDinero(v)} tablaGemela={{ columnas: [], filas: [] }} />
    </Pantalla>
  );
}

export const moduloDeEjemplo: Pick<ModuloMuestras, 'PantallaMuestras'> = { PantallaMuestras: PantallaEjemplo };
