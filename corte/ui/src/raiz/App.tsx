/**
 * @/raiz · App de BUILD_SPEC §8.4: ProveedorToasts → ProveedorBloques → marco por plataforma → rutas → capas globales.
 * ProveedorBloques (ui-bloques) monta los diálogos de dominio (?mensaje=, confirmar aviso, solicitud de emparejamiento,
 * DialogoCierre, DialogoMuestraNueva). Aquí además: atributos de <html> (C48) y avisarTemaNativo, y los eventos globales.
 */
import type { ReactElement } from 'react';
import { ProveedorToasts } from '@/componentes';
import { ProveedorBloques } from '@/bloques';
import type { Cargadores } from '../app/rutas';
import { useAtributosHtml, useEventosGlobales } from './globales';
import { Marco } from './Marco';

export interface PropsApp {
  /** Solo pruebas: cargadores de pantallas propios (rutas relativas a ui/src/app, como import.meta.glob). */
  cargadores?: Cargadores;
  /** Solo pruebas: cargador del módulo de ajustes para DialogoReautorizar (relativo a ui/src/raiz). */
  cargadoresReautorizar?: Cargadores;
}

function Raiz(p: PropsApp): ReactElement {
  useAtributosHtml();
  useEventosGlobales();
  return <Marco {...p} />;
}

/** La App con cargadores inyectables (las pruebas no dependen de qué pantallas existan). */
export function AppConPantallas(p: PropsApp): ReactElement {
  return (
    <ProveedorToasts>
      <ProveedorBloques>
        <Raiz {...p} />
      </ProveedorBloques>
    </ProveedorToasts>
  );
}

/** Raíz de la interfaz: proveedores, marco por plataforma, rutas y capas globales (BUILD_SPEC §8.4). */
export function App(): ReactElement {
  return <AppConPantallas />;
}
