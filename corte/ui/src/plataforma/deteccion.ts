/**
 * @/plataforma · detección (BUILD_SPEC §8.3, 04 §B.3): Windows = window.pywebview · Android = window.CreatorHubAndroid ·
 * si no, navegador. `?simular=android` solo en el modo demo. Se evalúa en cada llamada: pywebview 6 publica su objeto
 * DESPUÉS de que cargó la interfaz (NavigationCompleted). Mientras tanto, la interfaz servida por el propio hub
 * (http://127.0.0.1:39220–39229, el único origen que abre la ventana de Windows) ya cuenta como Windows, para que el
 * marco no arranque con el diseño del navegador; `tiene_puente` sigue siendo literal (solo con el objeto presente).
 */
import type { InfoPlataforma, PlataformaUi } from '@firmas/plataforma';
import { modoDemo, simulaAndroid } from './entorno';
import { esOrigenDelHub, hayPywebview, puenteAndroid } from './puentes';

function plataformaActual(): PlataformaUi {
  if (puenteAndroid() !== null || simulaAndroid()) return 'android';
  if (hayPywebview() || esOrigenDelHub()) return 'windows';
  return 'navegador';
}

export function infoPlataforma(): InfoPlataforma {
  const tiene_puente = puenteAndroid() !== null || hayPywebview();
  return {
    plataforma: plataformaActual(),
    // version.json del build; en el navegador de desarrollo (sin puente), '0.0.0-dev' (firma).
    version_app: !tiene_puente && import.meta.env.DEV ? '0.0.0-dev' : __VERSION_APP__,
    tiene_puente,
    modo_demo_navegador: modoDemo(),
  };
}

export function esAndroid(): boolean {
  return plataformaActual() === 'android';
}

export function esWindows(): boolean {
  return plataformaActual() === 'windows';
}
