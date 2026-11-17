/** Mantiene montada una capa durante su animación de salida (200 ms, 02 §10.2) y luego la desmonta. */
import { useEffect, useState } from 'react';

export const SALIDA_MS = 200;

export function usePresencia(abierta: boolean, salidaMs: number = SALIDA_MS): { montada: boolean; saliendo: boolean } {
  const [montada, setMontada] = useState(abierta);
  const [saliendo, setSaliendo] = useState(false);
  useEffect(() => {
    if (abierta) {
      setMontada(true);
      setSaliendo(false);
      return undefined;
    }
    if (!montada) return undefined;
    setSaliendo(true);
    const t = window.setTimeout(() => {
      setMontada(false);
      setSaliendo(false);
    }, salidaMs);
    return () => window.clearTimeout(t);
  }, [abierta, montada, salidaMs]);
  return { montada: montada || abierta, saliendo: saliendo && !abierta };
}
