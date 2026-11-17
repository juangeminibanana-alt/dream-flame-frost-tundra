/**
 * @/app · contenedor de cada pantalla: título accesible (región con nombre y título de la ventana), restauración del
 * scroll al volver (cuando el contenido ya está listo), límite de error por sección y avisarInterfazLista() UNA sola vez
 * en toda la sesión: la primera vez que alguna pantalla tiene `lista` en true (Windows `--medir`, splash de Android).
 * Al llegar a una pantalla nueva por navegación, el foco pasa a la región (los lectores anuncian la vista nueva).
 */
import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { avisarInterfazLista } from '@/plataforma';
import { LimiteError } from './LimiteError';
import { restaurarScrollPendiente, useRuta } from './navegacion';
import css from './Pantalla.module.css';

let interfazAvisada = false;
let pantallasMontadas = 0;

/** Solo pruebas. */
export function reiniciarPantalla(): void {
  interfazAvisada = false;
  pantallasMontadas = 0;
}

function enDialogo(el: Element | null): boolean {
  return el !== null && el.closest('[role="dialog"]') !== null;
}

export function Pantalla(p: { titulo: string; lista: boolean; children: ReactNode; className?: string }): ReactElement {
  const r = useRuta();
  const region = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') document.title = p.titulo === 'Inicio' ? 'Corte' : `${p.titulo} · Corte`;
  }, [p.titulo]);

  useEffect(() => {
    pantallasMontadas++;
    // La primera pantalla de la sesión no roba el foco; las siguientes sí (si el foco no está en un diálogo).
    if (pantallasMontadas > 1 && region.current && !enDialogo(document.activeElement)) region.current.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!p.lista) return;
    restaurarScrollPendiente(r.ruta);
    if (!interfazAvisada) {
      interfazAvisada = true;
      avisarInterfazLista();
    }
  }, [p.lista, r.ruta]);

  const clase = p.className ? `${css.pantalla} ${p.className}` : css.pantalla;
  return (
    <section ref={region} aria-label={p.titulo} tabIndex={-1} className={clase} data-pantalla={p.titulo} data-lista={p.lista ? '' : undefined}>
      <LimiteError seccion={p.titulo}>{p.children}</LimiteError>
    </section>
  );
}
