/**
 * @/raiz · DialogoReautorizar (01 §5.4, ?reautorizar=1) cargado SIN import estático: import.meta.glob del módulo de
 * ajustes + React.lazy (BUILD_SPEC §8.2). Solo se pide el módulo cuando la URL trae ?reautorizar=1; el diálogo lee el
 * parámetro por su cuenta (pantallas.d.ts). En Android muestra el estado sin reautorizar (C35, lo resuelve ui-ajustes).
 */
import { Suspense, lazy, type ComponentType, type LazyExoticComponent, type ReactElement } from 'react';
import { LimiteError } from '../app/LimiteError';
import { useParametro } from '../app/navegacion';
import type { Cargadores } from '../app/rutas';

const AJUSTES = '../pantallas/ajustes/index.ts';
const CARGADORES: Cargadores = import.meta.glob('../pantallas/ajustes/index.ts');

const perezosos = new WeakMap<Cargadores, LazyExoticComponent<ComponentType>>();

function Nada(): null {
  return null;
}

function perezosoDe(cargadores: Cargadores): LazyExoticComponent<ComponentType> | null {
  const cargar = cargadores[AJUSTES];
  if (!cargar) return null;
  let c = perezosos.get(cargadores);
  if (!c) {
    c = lazy(async () => {
      const m: unknown = await cargar();
      const d = m !== null && typeof m === 'object' && 'DialogoReautorizar' in m ? (m as Record<string, unknown>).DialogoReautorizar : undefined;
      return { default: typeof d === 'function' ? (d as ComponentType) : Nada };
    });
    perezosos.set(cargadores, c);
  }
  return c;
}

export function DialogoReautorizarPerezoso(p: { cargadores?: Cargadores }): ReactElement | null {
  const [valor] = useParametro('reautorizar');
  if (valor !== '1') return null;
  const Perezoso = perezosoDe(p.cargadores ?? CARGADORES);
  if (!Perezoso) return null;
  return (
    <LimiteError seccion="Reautorizar TikTok">
      <Suspense fallback={null}>
        <Perezoso />
      </Suspense>
    </LimiteError>
  );
}
