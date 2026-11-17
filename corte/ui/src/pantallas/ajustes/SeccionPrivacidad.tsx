/**
 * G. Privacidad y datos (01_ux §4.14 G y §7.5; BUILD_SPEC C10, C19, C25, C46).
 * - Texto EXACTO de C10.
 * - Espacio usado (GET /api/datos/uso) como barra apilada con su tabla gemela, y [Borrar caché de imágenes].
 * - [Exportar mi plan, avisos y notas] = hub.exportarLocal() + guardarArchivo (JSON) · [Importar plan, avisos y notas] =
 *   elegirArchivo() + hub.importarLocal(ruta): solo la RUTA viaja al hub (C46).
 * - Archivo de la conexión anterior → hub.borrarLegado() (a la Papelera, recuperable).
 * - [Borrar datos de TikTok de este equipo] y [Borrar todo y desconectar] (activo solo al escribir BORRAR).
 * - Android: aviso de la copia y [Borrar la copia de este celular].
 */
import { useState, type ReactElement } from 'react';
import type * as C from '@/contrato';
import { navegar, useCapacidades, usePlataforma } from '@/app';
import { BarraApilada, Boton, CampoTexto, Modal, useToast } from '@/componentes';
import { hoyLocal } from '@/dominio';
import { ErrorHub, hub, useConexionPc, useConsulta } from '@/datos';
import { elegirArchivo, guardarArchivo, olvidarPc } from '@/plataforma';
import { nombreExportacion, rutaAmigable, tamano } from './logica';
import { Aviso, CargandoGrupo, ErrorCarga, Fila, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

function mensaje(e: unknown): string {
  return e instanceof ErrorHub ? e.mensaje : e instanceof Error ? e.message : T.errorGenerico;
}

type Confirmar = 'imagenes' | 'tiktok' | 'todo' | 'copia' | null;

function Espacio(p: { alBorrar: () => void }): ReactElement {
  const uso = useConsulta('uso_datos', {});
  if (uso.cargando && !uso.datos) return <CargandoGrupo filas={1} />;
  if (!uso.datos) return <ErrorCarga error={uso.error} alReintentar={() => void uso.refrescar()} />;
  const u = uso.datos;
  const partes = [
    { id: 'datos', etiqueta: T.datos.partes.datos, valor: u.datos_bytes, texto: tamano(u.datos_bytes), estilo: 'solido' as const, slot: 1 as const },
    { id: 'imagenes', etiqueta: T.datos.partes.imagenes, valor: u.imagenes_bytes, texto: tamano(u.imagenes_bytes), estilo: 'solido' as const, slot: 2 as const },
    ...(u.registros_bytes > 0
      ? [{ id: 'registros', etiqueta: T.datos.partes.registros, valor: u.registros_bytes, texto: tamano(u.registros_bytes), estilo: 'solido' as const, slot: 3 as const }]
      : []),
  ];
  return (
    <Grupo titulo={T.datos.grupoEspacio}>
      <div className={cx(css.filaLibre)}>
        <p className={cx(css.oculto)}>{T.datos.espacio(tamano(u.datos_bytes), tamano(u.imagenes_bytes))}</p>
        <BarraApilada
          titulo={T.datos.espacioTitulo}
          partes={partes}
          tablaGemela={{ columnas: [T.datos.columnaQue, T.datos.columnaEspacio], filas: partes.map((x) => [x.etiqueta, x.texto]) }}
        />
      </div>
      <Fila etiqueta={T.datos.borrarImagenes} descripcion={T.datos.borrarImagenesTexto}>
        <Boton variante="secundario" icono="Trash2" deshabilitado={u.imagenes_bytes === 0} alPulsar={p.alBorrar}>
          {T.datos.borrarImagenes}
        </Boton>
      </Fila>
    </Grupo>
  );
}

function ArchivoAnterior(): ReactElement | null {
  const cred = useConsulta('credenciales', {});
  const toast = useToast();
  const [borrando, setBorrando] = useState(false);
  const l = cred.datos?.legado;
  if (!l || !l.disponible || !l.ruta) return null;
  const borrar = async (): Promise<void> => {
    setBorrando(true);
    try {
      const r = await hub.borrarLegado();
      toast.mostrar({ texto: r.resultado === 'papelera' ? T.datos.anteriorEnPapelera : T.datos.anteriorNoExiste, tono: 'ok' });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setBorrando(false);
    }
  };
  return (
    <Grupo titulo={T.datos.grupoAnterior}>
      <Fila etiqueta={rutaAmigable(l.ruta)} descripcion={T.datos.anteriorTexto(rutaAmigable(l.ruta))} icono="Lock">
        <Boton variante="secundario" icono="Trash2" cargando={borrando} alPulsar={() => void borrar()}>
          {T.datos.anteriorBorrar}
        </Boton>
      </Fila>
    </Grupo>
  );
}

function PrivacidadAndroid(): ReactElement {
  const pc = useConexionPc();
  const toast = useToast();
  const [ver, setVer] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const borrar = async (): Promise<void> => {
    setBorrando(true);
    try {
      await olvidarPc();
      toast.mostrar({ texto: T.datos.copiaBorrada, tono: 'ok' });
      setVer(false);
      navegar('/bienvenida', { reemplazar: true });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setBorrando(false);
    }
  };
  return (
    <Seccion titulo={T.secciones.datos.titulo} id="datos">
      <div className={cx(css.privacidad)}>
        <p className={cx(css.privacidadTexto)} data-texto-c10="">
          {T.datos.privacidad}
        </p>
        <p className={cx(css.filaDesc)}>{T.datos.androidPrivacidad}</p>
      </div>
      <Grupo titulo={T.datos.grupoBorrar}>
        <Fila etiqueta={T.datos.borrarCopia} descripcion={T.datos.borrarCopiaTexto(pc?.cambios_pendientes ?? 0)}>
          <Boton variante="peligro" alPulsar={() => setVer(true)}>
            {T.datos.borrar}
          </Boton>
        </Fila>
      </Grupo>
      <Modal
        abierto={ver}
        titulo={T.datos.borrarCopiaTitulo}
        alCerrar={() => setVer(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setVer(false)}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" cargando={borrando} alPulsar={() => void borrar()}>
              {T.datos.borrar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.datos.borrarCopiaTexto(pc?.cambios_pendientes ?? 0)}</p>
      </Modal>
    </Seccion>
  );
}

export function SeccionPrivacidad(): ReactElement {
  const android = usePlataforma() === 'android';
  if (android) return <PrivacidadAndroid />;
  return <PrivacidadWindows />;
}

function PrivacidadWindows(): ReactElement {
  const cap = useCapacidades();
  const toast = useToast();
  const [confirmar, setConfirmar] = useState<Confirmar>(null);
  const [texto, setTexto] = useState('');
  const [trabajando, setTrabajando] = useState<string | null>(null);

  const exportar = async (): Promise<void> => {
    setTrabajando('exportar');
    try {
      const datos: C.ExportacionLocal = await hub.exportarLocal();
      const r = await guardarArchivo(nombreExportacion(hoyLocal()), 'application/json', JSON.stringify(datos, null, 2));
      if (r === 'guardado' || r === 'compartido') toast.mostrar({ texto: T.datos.exportado, tono: 'ok' });
      else if (r === 'error') toast.mostrar({ texto: T.errorGenerico, tono: 'error' });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setTrabajando(null);
    }
  };

  const importar = async (): Promise<void> => {
    const ruta = await elegirArchivo(T.datos.tituloElegir, ['json']);
    if (!ruta) return;
    setTrabajando('importar');
    try {
      // Solo la RUTA viaja al hub (C46): él valida, lee y aplica sin duplicar.
      const r = await hub.importarLocal(ruta);
      const i = r.importados;
      toast.mostrar({ texto: T.datos.importado(i.planes, i.avisos, i.notas), tono: 'ok', ...(r.omitidos > 0 ? { detalle: T.datos.importadoOmitidos(r.omitidos) } : {}) });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setTrabajando(null);
    }
  };

  const borrar = async (alcance: C.BorrarDatosRequest['alcance']): Promise<void> => {
    setTrabajando(alcance);
    try {
      await hub.borrarDatos({ alcance, confirmacion: 'BORRAR' });
      toast.mostrar({ texto: alcance === 'imagenes' ? T.datos.imagenesBorradas : alcance === 'tiktok' ? T.datos.tiktokBorrado : T.datos.todoBorrado, tono: 'ok' });
      setConfirmar(null);
      setTexto('');
      if (alcance === 'todo') navegar('/bienvenida', { reemplazar: true });
    } catch (e) {
      toast.mostrar({ texto: mensaje(e), tono: 'error' });
    } finally {
      setTrabajando(null);
    }
  };

  const cerrar = (): void => {
    setConfirmar(null);
    setTexto('');
  };
  const escribioBorrar = texto.trim() === 'BORRAR';

  return (
    <Seccion titulo={T.secciones.datos.titulo} id="datos">
      <div className={cx(css.privacidad)}>
        <p className={cx(css.privacidadTexto)} data-texto-c10="">
          {T.datos.privacidad}
        </p>
      </div>

      <Espacio alBorrar={() => setConfirmar('imagenes')} />

      <Grupo titulo={T.datos.grupoTuyo}>
        <Fila etiqueta={T.datos.exportar} descripcion={T.datos.exportarDesc} icono="Download">
          <Boton variante="secundario" cargando={trabajando === 'exportar'} alPulsar={() => void exportar()}>
            {T.datos.exportarCorto}
          </Boton>
        </Fila>
        <Fila etiqueta={T.datos.importar} descripcion={T.datos.importarDesc} icono="ArrowDownUp">
          <Boton variante="secundario" cargando={trabajando === 'importar'} deshabilitado={!cap.escribir} alPulsar={() => void importar()}>
            {T.datos.importarCorto}
          </Boton>
        </Fila>
      </Grupo>

      <ArchivoAnterior />

      <Grupo titulo={T.datos.grupoBorrar} className={cx(css.grupoPeligro)}>
        <Fila etiqueta={T.datos.borrarTiktok} descripcion={T.datos.borrarTiktokTexto}>
          <Boton variante="secundario" alPulsar={() => setConfirmar('tiktok')}>
            {T.datos.borrar}
          </Boton>
        </Fila>
        <Fila etiqueta={T.datos.borrarTodo} descripcion={T.datos.borrarTodoDesc}>
          <Boton variante="peligro" alPulsar={() => setConfirmar('todo')}>
            {T.datos.borrarTodoBoton}
          </Boton>
        </Fila>
      </Grupo>

      <Modal
        abierto={confirmar === 'imagenes'}
        titulo={T.datos.borrarImagenesTitulo}
        alCerrar={cerrar}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={cerrar}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" cargando={trabajando === 'imagenes'} alPulsar={() => void borrar('imagenes')}>
              {T.datos.borrar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.datos.borrarImagenesTexto}</p>
      </Modal>
      <Modal
        abierto={confirmar === 'tiktok'}
        titulo={T.datos.borrarTiktokTitulo}
        alCerrar={cerrar}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={cerrar}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" cargando={trabajando === 'tiktok'} alPulsar={() => void borrar('tiktok')}>
              {T.datos.borrar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.datos.borrarTiktokTexto}</p>
      </Modal>
      <Modal
        abierto={confirmar === 'todo'}
        titulo={T.datos.borrarTodoTitulo}
        alCerrar={cerrar}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={cerrar}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" deshabilitado={!escribioBorrar} cargando={trabajando === 'todo'} alPulsar={() => (escribioBorrar ? void borrar('todo') : undefined)}>
              {T.datos.borrarTodoBoton}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>
          {T.datos.borrarTodoTexto1}
          <strong>{T.datos.borrarTodoClave}</strong>
          {T.datos.borrarTodoTexto2}
        </p>
        <CampoTexto etiqueta={T.datos.borrarTodoCampo} valor={texto} alCambiar={setTexto} monoespaciado placeholder="BORRAR" autoFoco />
      </Modal>
    </Seccion>
  );
}
