/* Punto de entrada de la interfaz de Corte (BUILD_SPEC §8.1, orden de 02 §4.1): fuentes → tokens → base → App. */
import './estilos/fuentes.css';
import './estilos/tokens.css';
import './estilos/base.css';
import { createRoot } from 'react-dom/client';
import { App } from '@/raiz';

const contenedor = document.getElementById('raiz');
if (!contenedor) throw new Error('Falta el contenedor #raiz en index.html');

createRoot(contenedor).render(<App />);
