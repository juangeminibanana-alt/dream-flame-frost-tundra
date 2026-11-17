/**
 * DialogoCierre (01 §3.2, C23): la primera vez que se cierra la ventana sin preferencia, el hub emite
 * «ventana.preguntar_cierre» y la interfaz pregunta «¿Mantener Corte en segundo plano? Así tu celular puede actualizarse
 * y seguimos sincronizando con TikTok.» [Mantener en segundo plano] [Cerrar por completo]. La decisión se guarda con
 * PATCH /api/ajustes/pc (hub.ajustesPc) y después se oculta o se cierra la ventana. Solo Windows.
 */
import { useState, type ReactElement } from 'react';
import { Boton, Casilla, Modal } from '@/componentes';
import { hub, useEventoHub } from '@/datos';
import { ventana } from '@/plataforma';
import { T } from '../textos';
import css from './globales.module.css';

export function VistaCierre(p: { abierto: boolean; ocupado?: boolean; alElegir: (mantener: boolean, iniciarConWindows: boolean) => void; alCerrar: () => void }): ReactElement | null {
  const [iniciar, setIniciar] = useState(true);
  return (
    <Modal
      abierto={p.abierto}
      titulo={T.cierreTitulo}
      descripcion={T.cierreTexto}
      alCerrar={p.alCerrar}
      pie={
        <>
          <Boton variante="fantasma" alPulsar={() => p.alElegir(false, false)} deshabilitado={p.ocupado ?? false}>
            {T.cerrarCompleto}
          </Boton>
          <Boton variante="primario" icono="Moon" cargando={p.ocupado ?? false} alPulsar={() => p.alElegir(true, iniciar)}>
            {T.mantener}
          </Boton>
        </>
      }
    >
      <div className={css.cierre}>
        <Casilla marcada={iniciar} alCambiar={setIniciar} etiqueta={T.iniciarConWindows} />
        <p className={css.ayuda}>{T.cierreAyuda}</p>
      </div>
    </Modal>
  );
}

export function DialogoCierre(): ReactElement | null {
  const [abierto, setAbierto] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  useEventoHub((e) => {
    if (e.tipo === 'ventana.preguntar_cierre') setAbierto(true);
  });
  const elegir = async (mantener: boolean, iniciar: boolean): Promise<void> => {
    setOcupado(true);
    try {
      await hub.ajustesPc(mantener ? { segundo_plano: true, iniciar_con_windows: iniciar } : { segundo_plano: false });
    } catch {
      // Aunque no se haya podido guardar, se respeta lo que eligió para esta vez.
    } finally {
      setOcupado(false);
      setAbierto(false);
      if (mantener) ventana.ocultar();
      else ventana.cerrarDelTodo();
    }
  };
  return <VistaCierre abierto={abierto} ocupado={ocupado} alElegir={(m, i) => void elegir(m, i)} alCerrar={() => setAbierto(false)} />;
}
