/** I. Ayuda (01_ux §4.14 I): 5 preguntas, cada una con su respuesta de 2 a 4 líneas, en acordeón accesible (<details>). */
import type { ReactElement } from 'react';
import { Icono } from '@/componentes';
import { Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

export function SeccionAyuda(): ReactElement {
  return (
    <Seccion titulo={T.secciones.ayuda.titulo} id="ayuda" descripcion={T.ayudaDescripcion}>
      <Grupo>
        {T.ayuda.map((x, i) => (
          <details key={x.pregunta} className={cx(css.pregunta)} {...(i === 0 ? { open: true } : {})}>
            <summary className={cx(css.preguntaResumen)}>
              <span>{x.pregunta}</span>
              <Icono nombre="ChevronDown" tamano={18} className={cx(css.preguntaFlecha)} />
            </summary>
            <p className={cx(css.preguntaRespuesta)}>{x.respuesta}</p>
          </details>
        ))}
      </Grupo>
    </Seccion>
  );
}
