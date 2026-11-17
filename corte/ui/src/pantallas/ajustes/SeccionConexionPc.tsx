/**
 * C'. Conexión con la PC (Android, 01_ux §4.14 C'; §4.16): «Conectado a {PC 3F2A}» o «Sin conexión con tu PC», última
 * copia, cambios por enviar, permisos del celular, [Actualizar ahora], [Emparejar con otra PC] y [Olvidar esta PC] con
 * la confirmación de 01. Revocado e incompatible muestran su aviso y la acción para salir del problema.
 */
import { useState, type ReactElement } from 'react';
import { navegar } from '@/app';
import { Boton, Icono, Modal, PuntoVivo, useToast } from '@/componentes';
import { ahoraS, formato } from '@/dominio';
import { useConexionPc, useSesion } from '@/datos';
import { actualizarCopiaAhora, olvidarPc } from '@/plataforma';
import { cuandoFue } from './logica';
import { Aviso, Dato, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

export function SeccionConexionPc(): ReactElement {
  const pc = useConexionPc();
  const sesion = useSesion();
  const toast = useToast();
  const [actualizando, setActualizando] = useState(false);
  const [verOlvidar, setVerOlvidar] = useState(false);
  const [olvidando, setOlvidando] = useState(false);
  const ahora = ahoraS();
  const titulo = T.secciones.celular.tituloAndroid;

  if (!pc || !pc.emparejado) {
    return (
      <Seccion titulo={titulo} id="celular">
        <div className={cx(css.vacioPc)}>
          <span className={cx(css.vacioPcIcono)} aria-hidden="true">
            <Icono nombre="QrCode" tamano={24} />
          </span>
          <p className={cx(css.vacioPcTitulo)}>{T.pc.sinEmparejar}</p>
          <p className={cx(css.filaDesc)}>{T.pc.sinEmparejarTexto}</p>
          <Boton variante="primario" tamano="lg" icono="QrCode" alPulsar={() => navegar('/emparejar?desde=ajustes')}>
            {T.pc.emparejar}
          </Boton>
        </div>
      </Seccion>
    );
  }

  const nombre = pc.nombre_equipo ?? 'tu PC';
  const copia = pc.ultima_copia_at ?? sesion.copia_at ?? null;

  const actualizar = async (): Promise<void> => {
    setActualizando(true);
    try {
      await actualizarCopiaAhora();
      toast.mostrar({ texto: T.pc.actualizado, tono: 'ok' });
    } catch (e) {
      toast.mostrar({ texto: e instanceof Error ? e.message : T.errorGenerico, tono: 'error' });
    } finally {
      setActualizando(false);
    }
  };
  const olvidar = async (): Promise<void> => {
    setOlvidando(true);
    try {
      await olvidarPc();
      setVerOlvidar(false);
      navegar('/bienvenida', { reemplazar: true });
    } catch (e) {
      toast.mostrar({ texto: e instanceof Error ? e.message : T.errorGenerico, tono: 'error' });
    } finally {
      setOlvidando(false);
    }
  };

  return (
    <Seccion titulo={titulo} id="celular" descripcion={T.pc.ayuda}>
      <div className={cx(css.cuenta)} data-pc={pc.conectado ? 'conectada' : 'sin_conexion'}>
        <span className={cx(css.pcIcono)} aria-hidden="true">
          <Icono nombre="Monitor" tamano={22} />
        </span>
        <div className={cx(css.cuentaTextos)}>
          <div className={cx(css.cuentaFila)}>
            <PuntoVivo estado={pc.revocado ? 'error' : pc.conectado ? (pc.sync_en_curso ? 'sincronizando' : 'ok') : 'inactivo'} />
            <span className={cx(css.cuentaNombre)}>{pc.conectado ? T.pc.conectado(nombre) : T.pc.sinConexion}</span>
          </div>
          {/* La fecha de la copia va abajo en «Última copia»: aquí, qué significa el estado. */}
          <p className={cx(css.cuentaMeta)}>{pc.sync_en_curso ? T.pc.sincronizando : !copia ? T.pc.sinCopia : pc.conectado ? T.pc.metaConectado : T.pc.metaSinConexion}</p>
        </div>
      </div>

      {pc.revocado ? (
        <Aviso
          tono="critico"
          vivo
          acciones={
            <Boton variante="primario" tamano="sm" icono="QrCode" alPulsar={() => navegar('/emparejar?desde=ajustes')}>
              {T.pc.emparejarDeNuevo}
            </Boton>
          }
        >
          {T.pc.revocado}
        </Aviso>
      ) : null}
      {pc.incompatible ? <Aviso tono="atencion">{pc.incompatible === 'actualiza_pc' ? T.pc.actualizaPc : T.pc.actualizaApp}</Aviso> : null}

      <Grupo>
        <Dato etiqueta={T.pc.ultimaCopia} valor={copia ? cuandoFue(copia, ahora) : T.pc.sinCopia} />
        <Dato etiqueta={T.pc.cambios} valor={formato.numero(pc.cambios_pendientes)} />
        <Dato etiqueta={T.pc.permisos} valor={pc.permisos === 'lectura' ? T.pc.soloVer : T.pc.verEditar} />
        {pc.ip ? <Dato etiqueta={T.pc.direccion} valor={pc.ip} mono /> : null}
      </Grupo>

      <div className={cx(css.accionesPila)}>
        <Boton variante="primario" tamano="lg" icono="RefreshCw" anchoCompleto cargando={actualizando} deshabilitado={pc.revocado} alPulsar={() => void actualizar()}>
          {T.pc.actualizar}
        </Boton>
        <Boton variante="secundario" tamano="lg" icono="QrCode" anchoCompleto alPulsar={() => navegar('/emparejar?desde=ajustes')}>
          {T.pc.otraPc}
        </Boton>
        <Boton variante="peligro" tamano="lg" anchoCompleto alPulsar={() => setVerOlvidar(true)}>
          {T.pc.olvidar}
        </Boton>
      </div>

      <Modal
        abierto={verOlvidar}
        titulo={T.pc.olvidarTitulo}
        alCerrar={() => setVerOlvidar(false)}
        pie={
          <>
            <Boton variante="fantasma" alPulsar={() => setVerOlvidar(false)}>
              {T.cancelar}
            </Boton>
            <Boton variante="peligro" cargando={olvidando} alPulsar={() => void olvidar()}>
              {T.pc.olvidar}
            </Boton>
          </>
        }
      >
        <p className={cx(css.textoModal)}>{T.pc.olvidarTexto(pc.cambios_pendientes)}</p>
      </Modal>
    </Seccion>
  );
}
