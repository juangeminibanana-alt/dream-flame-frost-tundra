/**
 * Saludo de Inicio (01 §4.1 #2, 02 §5.2 fila 1 y §5.3). Windows: «Hola, {usuario}» con la fecha y la frescura, y a la
 * derecha el buscador (abre la paleta global Ctrl+K) y Sincronizar. Celular: barra «Inicio» con ⌕ y ⟳ y debajo el saludo.
 */
import type { ReactElement } from 'react';
import { BotonIcono, CampoBusqueda, EncabezadoPantalla } from '@/componentes';
import { T } from './textos';
import css from './Inicio.module.css';

/**
 * La paleta Ctrl+K la monta ui-marco y la firma de @/app no expone cómo abrirla: se le manda el mismo atajo que el
 * usuario teclearía (keydown Ctrl+K que sube hasta document y window). Ver faltantes de contrato.
 */
export function abrirPaleta(): void {
  if (typeof document === 'undefined') return;
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', ctrlKey: true, bubbles: true, cancelable: true }));
}

export interface SaludoProps {
  usuario: string | null;
  /** 'Jueves 12 de noviembre · Actualizado hace 4 min' (Windows) o 'Actualizado hace 12 min · desde tu PC' (celular). */
  contexto: string;
  compacto: boolean;
  sincronizando: boolean;
  puedeSincronizar: boolean;
  alSincronizar: () => void;
}

export function Saludo(p: SaludoProps): ReactElement {
  const hola = p.usuario ? T.saludo(p.usuario) : T.saludoSinCuenta;
  const sincronizar = (
    <BotonIcono
      icono="RefreshCw"
      etiqueta={T.sincronizar}
      variante="secundario"
      girando={p.sincronizando}
      deshabilitado={!p.puedeSincronizar || p.sincronizando}
      alPulsar={p.alSincronizar}
    />
  );
  if (p.compacto) {
    // El «Hola, {usuario}» compacto lo pinta PantallaInicio como primer elemento de su columna (con su ritmo de 16).
    return (
      <EncabezadoPantalla
        titulo={T.pantalla}
        contexto={p.contexto}
        acciones={
          <>
            <BotonIcono icono="Search" etiqueta={T.buscar} variante="secundario" alPulsar={abrirPaleta} />
            {sincronizar}
          </>
        }
      />
    );
  }
  return (
    <header className={css.saludo}>
      <div className={css.saludoTextos}>
        <h1 className={css.saludoTitulo}>{hola}</h1>
        <p className={css.saludoContexto}>{p.contexto}</p>
      </div>
      <div className={css.saludoAcciones}>
        <CampoBusqueda alAbrir={abrirPaleta} className={css.saludoBuscar} />
        {sincronizar}
      </div>
    </header>
  );
}
