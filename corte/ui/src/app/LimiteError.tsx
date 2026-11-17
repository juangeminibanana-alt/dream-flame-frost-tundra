/**
 * @/app · límite de error por sección (01 §4.16): «Algo salió mal al mostrar esta sección.» [Reintentar]. Un error al
 * pintar una tarjeta nunca tumba la app completa: se queda dentro de la sección que falló.
 */
import { Component, type ErrorInfo, type ReactElement, type ReactNode } from 'react';
import { Boton, Icono } from '@/componentes';
import css from './LimiteError.module.css';

export const TEXTO_ERROR_SECCION = 'Algo salió mal al mostrar esta sección.';

interface Props {
  seccion: string;
  children: ReactNode;
}

class Limite extends Component<Props, { error: boolean; intento: number }> {
  override state = { error: false, intento: 0 };

  static getDerivedStateFromError(): { error: boolean } {
    return { error: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error(`[Corte · ${this.props.seccion}]`, error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.error) return <Reinicio key={this.state.intento}>{this.props.children}</Reinicio>;
    return (
      <div role="alert" className={css.error} data-limite-error={this.props.seccion}>
        <span className={css.icono} aria-hidden="true">
          <Icono nombre="CircleAlert" tamano={20} />
        </span>
        <p className={css.texto}>{TEXTO_ERROR_SECCION}</p>
        <Boton variante="secundario" tamano="sm" icono="RotateCcw" alPulsar={() => this.setState((s) => ({ error: false, intento: s.intento + 1 }))}>
          Reintentar
        </Boton>
      </div>
    );
  }
}

/** Fragmento con clave: al reintentar se vuelve a montar el contenido desde cero. */
function Reinicio(p: { children: ReactNode }): ReactElement {
  return <>{p.children}</>;
}

/** "Algo salió mal al mostrar esta sección." [Reintentar] — nunca tumba la app completa (01_ux §4.16). */
export function LimiteError(p: { children: ReactNode; seccion: string }): ReactElement {
  return <Limite seccion={p.seccion}>{p.children}</Limite>;
}
