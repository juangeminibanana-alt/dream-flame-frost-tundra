/**
 * FIRMAS NORMATIVAS · módulo `@/raiz` (lo implementa ui-marco en ui/src/raiz/index.ts). BUILD_SPEC §8.4, rev. 3.1.
 * Solo lo importa ui/src/main.tsx. Está separado de `@/app` para que bloques y pantallas (que importan los hooks de
 * `@/app`) no formen un ciclo ESM con la raíz, que sí importa bloques y pantallas.
 */
import type { ReactElement } from 'react';

/** Raíz de la interfaz: proveedores, marco por plataforma, rutas y capas globales (BUILD_SPEC §8.4). */
export function App(): ReactElement;
