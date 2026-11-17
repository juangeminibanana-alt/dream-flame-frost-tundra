import "../corte/ui/src/estilos/fuentes.css";
import "../corte/ui/src/estilos/tokens.css";
import "../corte/ui/src/estilos/base.css";
import { App } from "../corte/ui/src/raiz/App";
import type { PantallaGenerar as _PantallaGenerar } from "../corte/ui/src/pantallas/videos/PantallaGenerar";

void (null as unknown as typeof _PantallaGenerar);

export function CorteRaiz() {
  return (
    <div id="raiz">
      <App />
    </div>
  );
}
