/**
 * Flujos de Muestras (paquete ui-muestras-flujos) · ModuloFlujos de spec/ui_firmas/pantallas.d.ts. ui-marco las carga
 * con import.meta.glob + React.lazy (BUILD §8.6): #/muestras/agenda, #/muestras/plan, #/muestras/sesion y
 * #/muestras/avisos. Ninguna recibe props: leen sus parámetros con useRuta()/useParametro() de @/app.
 */
export { PantallaAgenda } from './agenda/PantallaAgenda';
export { PantallaArmarPlan } from './plan/PantallaArmarPlan';
export { PantallaSesion } from './sesion/PantallaSesion';
export { PantallaAvisar } from './avisar/PantallaAvisar';
