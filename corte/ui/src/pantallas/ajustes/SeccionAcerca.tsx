/**
 * H. Acerca de (01_ux §4.14 H; 02 §2.1): logotipo «corte», «Corte {versión}», textos de 01, puerto real de la interfaz
 * con el aviso de respaldo (SessionResponse.servidor, 04 §1) y licencias de terceros desde /licencias.json (lo genera
 * build-empaquetado y lo sirve el hub); si no existe: «Disponible en la versión instalada».
 */
import { useEffect, useState, type ReactElement } from 'react';
import { usePlataforma } from '@/app';
import { Icono } from '@/componentes';
import { useSesion } from '@/datos';
import { infoPlataforma } from '@/plataforma';
import { leerLicencias, type Licencia } from './logica';
import { Aviso, Dato, Grupo, Seccion } from './piezas';
import { T } from './textos';
import css from './ajustes.module.css';
import { cx } from './clases';

/** Logotipo: ícono C con el corte a 45° + «corte» (02 §2.2). Colores de tokens. */
export function Logotipo(p: { tamano?: number }): ReactElement {
  const t = p.tamano ?? 40;
  return (
    <span className={cx(css.logo)} style={{ ['--logo' as string]: `${t}px` }} aria-label="Corte" role="img">
      <svg viewBox="0 0 1024 1024" width={t} height={t} aria-hidden="true" className={cx(css.logoIcono)}>
        <rect width="1024" height="1024" rx="232" className={cx(css.logoFondo)} />
        <g transform="translate(18 -6)">
          <path d="M742 330A300 300 0 1 0 742 694L645 625A132 132 0 1 1 645 399Z" className={cx(css.logoC)} />
        </g>
      </svg>
      <span className={cx(css.logoTexto)} aria-hidden="true">
        corte
      </span>
    </span>
  );
}

type EstadoLicencias = { tipo: 'cargando' } | { tipo: 'lista'; items: Licencia[] } | { tipo: 'no' };

function useLicencias(): EstadoLicencias {
  const [e, setE] = useState<EstadoLicencias>({ tipo: 'cargando' });
  useEffect(() => {
    let vivo = true;
    const c = typeof AbortController !== 'undefined' ? new AbortController() : null;
    (async () => {
      try {
        const r = await fetch('/licencias.json', { cache: 'no-store', ...(c ? { signal: c.signal } : {}) });
        const tipo = r.headers.get('content-type') ?? '';
        if (!r.ok || !tipo.includes('json')) throw new Error('sin licencias');
        const items = leerLicencias(await r.json());
        if (vivo) setE(items ? { tipo: 'lista', items } : { tipo: 'no' });
      } catch {
        if (vivo) setE({ tipo: 'no' });
      }
    })();
    return () => {
      vivo = false;
      c?.abort();
    };
  }, []);
  return e;
}

export function SeccionAcerca(): ReactElement {
  const sesion = useSesion();
  const plataforma = usePlataforma();
  const info = infoPlataforma();
  const lic = useLicencias();
  const servidor = sesion.datos?.servidor;
  const version = servidor?.version ?? info.version_app;

  return (
    <Seccion titulo={T.secciones.acerca.titulo} id="acerca">
      <div className={cx(css.acerca)}>
        <Logotipo tamano={44} />
        <p className={cx(css.acercaVersion)}>{T.acerca.version(version)}</p>
        <p className={cx(css.acercaTexto)}>{T.acerca.hecho}</p>
        <p className={cx(css.filaDesc)}>{T.acerca.api}</p>
      </div>

      <Grupo titulo={T.acerca.grupoTecnico}>
        <Dato etiqueta={T.acerca.versionEtiqueta} valor={version} mono />
        <Dato etiqueta={T.acerca.plataforma} valor={T.acerca.plataformas[plataforma] ?? plataforma} />
        {servidor ? <Dato etiqueta={T.acerca.puerto} valor={`127.0.0.1:${servidor.puerto_ui}`} mono /> : null}
      </Grupo>
      {servidor?.puerto_respaldo ? (
        <Aviso tono="info" icono="Info">
          {T.acerca.puertoRespaldo(servidor.puerto_ui)}
        </Aviso>
      ) : null}

      <Grupo titulo={T.acerca.licencias}>
        {lic.tipo === 'cargando' ? (
          <p className={cx(css.vacioGrupo)}>{T.acerca.licenciasCargando}</p>
        ) : lic.tipo === 'no' ? (
          <p className={cx(css.vacioGrupo)} data-licencias="no">
            <Icono nombre="Info" tamano={16} /> {T.acerca.licenciasNoDisponibles}
          </p>
        ) : (
          <>
            <p className={cx(css.vacioGrupo)}>{T.acerca.licenciasN(lic.items.length)}</p>
            {lic.items.map((x) => (
              <details key={`${x.nombre}-${x.version}`} className={cx(css.pregunta)}>
                <summary className={cx(css.preguntaResumen)}>
                  <span>
                    {x.nombre} <span className={cx(css.filaDesc)}>{[x.version, x.licencia].filter(Boolean).join(' · ')}</span>
                  </span>
                  <Icono nombre="ChevronDown" tamano={18} className={cx(css.preguntaFlecha)} />
                </summary>
                <pre className={cx(css.licencia)}>{x.texto}</pre>
              </details>
            ))}
          </>
        )}
      </Grupo>
    </Seccion>
  );
}
