/**
 * @/plataforma · ciclo de vida (04 §B.10, §A.6). Atrás de Android: la capa nativa llama window.creatorHubBack(), que
 * recorre la pila de manejadores del último al primero (true = lo consumió; si nadie lo consume, la app pasa a segundo
 * plano). Volver al frente: visibilitychange → visible y el evento nativo creatorhub-reanudar (onResume).
 */
import { apiPywebview, puenteAndroid, ventanaCorte } from './puentes';
import { enSegundoPlano } from './sistema';

interface RegistroAtras {
  fn: () => boolean;
}
const pilaAtras: RegistroAtras[] = [];

function manejarAtras(): boolean {
  for (let i = pilaAtras.length - 1; i >= 0; i -= 1) {
    const r = pilaAtras[i];
    if (!r) continue;
    try {
      if (r.fn()) return true;
    } catch {
      /* un manejador con error no bloquea a los demás */
    }
  }
  return false;
}

function instalarAtras(): void {
  const w = ventanaCorte();
  if (w && w.creatorHubBack !== manejarAtras) w.creatorHubBack = manejarAtras;
}

instalarAtras();

/** El último registrado decide primero; devuelve la función para quitarlo (idempotente). */
export function registrarAtras(manejador: () => boolean): () => void {
  instalarAtras();
  const registro: RegistroAtras = { fn: manejador };
  pilaAtras.push(registro);
  return () => {
    const i = pilaAtras.indexOf(registro);
    if (i >= 0) pilaAtras.splice(i, 1);
  };
}

export function alVolverAlFrente(fn: () => void): () => void {
  if (typeof document === 'undefined') return () => undefined;
  const visible = (): void => {
    if (document.visibilityState === 'visible') fn();
  };
  document.addEventListener('visibilitychange', visible);
  // creatorhub-reanudar trae un detail vacío (o ninguno): cualquier aviso cuenta.
  const w = ventanaCorte();
  const reanudar = (): void => fn();
  w?.addEventListener('creatorhub-reanudar', reanudar);
  return () => {
    document.removeEventListener('visibilitychange', visible);
    w?.removeEventListener('creatorhub-reanudar', reanudar);
  };
}

/** Solo Windows (js_api). En Android y en el navegador no hace nada. */
export const ventana = {
  ocultar(): void {
    if (puenteAndroid() !== null) return;
    enSegundoPlano(async () => {
      const api = await apiPywebview('ventana_ocultar');
      if (api?.ventana_ocultar) await api.ventana_ocultar();
    });
  },
  /** Cierre real (no a la bandeja). */
  cerrarDelTodo(): void {
    if (puenteAndroid() !== null) return;
    enSegundoPlano(async () => {
      const api = await apiPywebview('ventana_cerrar');
      if (api?.ventana_cerrar) await api.ventana_cerrar();
    });
  },
};
