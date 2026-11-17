/**
 * Anfitrión de las hojas de etapa (01 §3.3: hojas para cambiar etapa y elegir fecha). ProveedorBloques lo monta UNA
 * vez: useControlMuestra pide una hoja con ContextoHojas.abrir() y la promesa se resuelve cuando la hoja se cierra.
 * La hoja cerrada se queda montada con abierta=false hasta la siguiente para que su salida se anime.
 */
import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { HojaPlanear } from '../hojas/HojaPlanear';
import { HojaPublicar } from '../hojas/HojaPublicar';
import { HojaEtapa, HojaNoSePuede, HojaProgramar } from '../hojas/HojasEtapa';
import { useControlMuestra } from '../useControlMuestra';
import { ContextoHojas, type ApiHojas, type PeticionHoja } from './contexto';

interface HojaActiva {
  peticion: PeticionHoja;
  resolver: () => void;
  clave: number;
  abierta: boolean;
}

function HojaVigente(p: { activa: HojaActiva; alTerminar: () => void }): ReactElement {
  const control = useControlMuestra();
  const { peticion, abierta } = p.activa;
  switch (peticion.tipo) {
    case 'planear':
      return <HojaPlanear m={peticion.m} modo={peticion.modo} abierta={abierta} alTerminar={p.alTerminar} />;
    case 'promesa':
      return <HojaPlanear m={peticion.m} modo={peticion.modo} fechaElegida={peticion.fecha} abierta={abierta} alTerminar={p.alTerminar} />;
    case 'publicar':
      return <HojaPublicar m={peticion.m} origen={peticion.origen} {...(peticion.sugerido ? { sugerido: peticion.sugerido } : {})} abierta={abierta} alTerminar={p.alTerminar} />;
    case 'programar':
      return <HojaProgramar m={peticion.m} abierta={abierta} alTerminar={p.alTerminar} />;
    case 'no_se_puede':
      return <HojaNoSePuede m={peticion.m} abierta={abierta} alTerminar={p.alTerminar} />;
    case 'etapa':
      return (
        <HojaEtapa
          m={peticion.m}
          abierta={abierta}
          alTerminar={p.alTerminar}
          alElegir={(etapa) => {
            p.alTerminar();
            void control.cambiarEtapa(peticion.m, etapa);
          }}
        />
      );
  }
}

export function AnfitrionHojas(p: { children: ReactNode }): ReactElement {
  const [activa, setActiva] = useState<HojaActiva | null>(null);

  const api = useMemo<ApiHojas>(
    () => ({
      abrir(peticion) {
        return new Promise<void>((resolver) => {
          setActiva((previa) => {
            // Abrir otra hoja cierra (y resuelve) la anterior: nunca hay dos a la vez.
            if (previa?.abierta) previa.resolver();
            return { peticion, resolver, clave: (previa?.clave ?? 0) + 1, abierta: true };
          });
        });
      },
    }),
    [],
  );

  const cerrar = useCallback((): void => {
    setActiva((previa) => {
      if (!previa || !previa.abierta) return previa;
      previa.resolver();
      return { ...previa, abierta: false };
    });
  }, []);

  return (
    <ContextoHojas.Provider value={api}>
      {p.children}
      {activa ? <HojaVigente key={activa.clave} activa={activa} alTerminar={cerrar} /> : null}
    </ContextoHojas.Provider>
  );
}
