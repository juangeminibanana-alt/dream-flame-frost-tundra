/* __DOBLE_CORTE__ · doble de @/app: EnlaceRuta, Pantalla y LimiteError. */
import { Component, useEffect, type ErrorInfo, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { avisarInterfazLista } from '@/plataforma';
import { navegar, normalizarDestino } from './navegacion';
import { estilosDoble as css } from '../comun/Caja';

/** Enlace interno accesible (Ctrl+clic no abre otra ventana: se ignora). */
export function EnlaceRuta(p: { a: string; children: ReactNode; className?: string; 'aria-label'?: string; reemplazar?: boolean }): ReactElement {
  const destino = normalizarDestino(p.a);
  const alPulsar = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    navegar(destino, p.reemplazar ? { reemplazar: true } : {});
  };
  return (
    <a href={`#${destino}`} className={p.className} aria-label={p['aria-label']} onClick={alPulsar}>
      {p.children}
    </a>
  );
}

/** Contenedor de cada pantalla: título accesible, límite de error y avisarInterfazLista() la primera vez que está lista. */
export function Pantalla(p: { titulo: string; lista: boolean; children: ReactNode; className?: string }): ReactElement {
  useEffect(() => {
    document.title = `${p.titulo} · Corte`;
  }, [p.titulo]);
  useEffect(() => {
    if (p.lista) avisarInterfazLista();
  }, [p.lista]);
  return (
    <section aria-label={p.titulo} className={p.className} data-pantalla={p.titulo}>
      <LimiteError seccion={p.titulo}>{p.children}</LimiteError>
    </section>
  );
}

interface PropsLimite {
  seccion: string;
  children: ReactNode;
}

class Limite extends Component<PropsLimite, { error: boolean }> {
  override state = { error: false };

  static getDerivedStateFromError(): { error: boolean } {
    return { error: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[${this.props.seccion}]`, error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className={css.caja} data-seccion={this.props.seccion}>
        <span>Algo salió mal al mostrar esta sección.</span>
        <button type="button" className={css.boton} onClick={() => this.setState({ error: false })}>
          Reintentar
        </button>
      </div>
    );
  }
}

/** "Algo salió mal al mostrar esta sección." [Reintentar] — nunca tumba la app completa (01_ux §4.16). */
export function LimiteError(p: { children: ReactNode; seccion: string }): ReactElement {
  return <Limite seccion={p.seccion}>{p.children}</Limite>;
}
