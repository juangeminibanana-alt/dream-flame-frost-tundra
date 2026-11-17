/**
 * @/datos · acciones del hub que no son estado local (spec/ui_firmas/datos.d.ts `AccionesHub`, rutas de BUILD_SPEC §5).
 * Windows: REST con X-CH-Hub. Android: solo sincronizar (peticion POST /api/sync); el resto → ErrorHub('solo_en_pc')
 * (cancelarSync también: /api/sync/cancelar es solo local y peticion() no la admite, §5 y §7.4).
 * Demo: respuestas de ui/fixtures o solo_en_pc. Después de cada cambio se invalidan las consultas afectadas.
 * rev. 5: display* (Display API). Sus respuestas con EstadoDisplay se escriben directo en la consulta 'display'.
 */
import type * as C from '@/contrato';
import type { AccionesHub, ClaveConsulta } from '@firmas/datos';
import { escribirEntrada, invalidarClaves } from './almacen';
import { ErrorHub } from './errores';
import { obtenerTransporte, type MetodoMutacion } from './transporte';
import { esEstadoDisplay } from './transporte_windows';

function esObjeto(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function respuestaInvalida(): ErrorHub {
  return new ErrorHub('error_interno', 'Corte respondió algo que no esperábamos. Inténtalo de nuevo.', 0);
}

/** Valida lo mínimo de la respuesta (objeto con las claves indicadas) y la tipa. */
function como<T>(v: unknown, ...claves: string[]): T {
  if (!esObjeto(v) || !claves.every((k) => k in v)) throw respuestaInvalida();
  return v as T;
}

async function pedir(metodo: MetodoMutacion, ruta: string, cuerpo: unknown, invalida: readonly ClaveConsulta[]): Promise<unknown> {
  const t = await obtenerTransporte();
  try {
    return await t.pedir(metodo, ruta, cuerpo);
  } finally {
    if (invalida.length > 0) invalidarClaves(invalida);
  }
}

async function obtener(ruta: string): Promise<unknown> {
  return (await obtenerTransporte()).obtener(ruta);
}

const e = (s: string): string => encodeURIComponent(s);

export const hub: AccionesHub = {
  async sincronizar(tipo?: C.TipoSync): Promise<C.SyncIniciarResponse> {
    const cuerpo: C.SyncIniciarRequest = tipo ? { tipo } : {};
    const r = como<C.SyncIniciarResponse>(await pedir('POST', '/api/sync', cuerpo, ['sesion']), 'sync_id', 'estado');
    (await obtenerTransporte()).vigilarSync();
    return r;
  },
  async cancelarSync(): Promise<C.SyncEstado> {
    return como<C.SyncEstado>(await pedir('POST', '/api/sync/cancelar', undefined, ['sesion']), 'en_curso');
  },
  async authLink(abrirNavegador: boolean): Promise<C.AuthLinkResponse> {
    const cuerpo: C.AuthLinkRequest = { abrir_navegador: abrirNavegador };
    return como<C.AuthLinkResponse>(await pedir('POST', '/api/auth/link', cuerpo, []), 'url', 'state');
  },
  async authPortapapeles(): Promise<C.PortapapelesResponse> {
    return como<C.PortapapelesResponse>(await obtener('/api/auth/portapapeles'), 'detectado');
  },
  async authCanjear(req: C.AuthCanjearRequest): Promise<C.AuthCanjearResponse> {
    return como<C.AuthCanjearResponse>(await pedir('POST', '/api/auth/canjear', req, ['sesion', 'credenciales']), 'conexion');
  },
  async authRefrescar(): Promise<C.AuthEstadoResponse> {
    return como<C.AuthEstadoResponse>(await pedir('POST', '/api/auth/refrescar', undefined, ['sesion']), 'conexion');
  },
  async authDesconectar(req: C.DesconectarRequest): Promise<C.AuthEstadoResponse> {
    const r = como<C.AuthEstadoResponse>(await pedir('POST', '/api/auth/desconectar', req, ['sesion', 'credenciales']), 'conexion');
    if (req.borrar_datos) invalidarClaves([]);
    return r;
  },
  async importarCredenciales(req: C.ImportarRequest): Promise<C.ImportarResponse> {
    return como<C.ImportarResponse>(await pedir('POST', '/api/credenciales/importar', req, ['sesion', 'credenciales']), 'importado');
  },
  async guardarAppSecret(appSecret: string): Promise<C.CredencialesEstado> {
    const cuerpo: C.AppSecretRequest = { app_secret: appSecret };
    return como<C.CredencialesEstado>(await pedir('PUT', '/api/credenciales/app-secret', cuerpo, ['sesion', 'credenciales']), 'app_key');
  },
  async borrarLegado(): Promise<C.BorrarLegadoResponse> {
    const cuerpo: C.BorrarLegadoRequest = { confirmar: true };
    return como<C.BorrarLegadoResponse>(await pedir('POST', '/api/credenciales/legado/borrar', cuerpo, ['credenciales']), 'resultado');
  },
  async lanActivar(activo: boolean): Promise<C.LanEstado> {
    const cuerpo: C.LanActivarRequest = { activo };
    return como<C.LanEstado>(await pedir('POST', '/api/lan/activar', cuerpo, ['lan', 'sesion', 'firewall']), 'activo');
  },
  async lanCambiar(cambios: C.LanCambios): Promise<C.LanEstado> {
    return como<C.LanEstado>(await pedir('PATCH', '/api/lan/estado', cambios, ['lan']), 'activo');
  },
  async lanEmparejar(): Promise<C.EmparejarResponse> {
    return como<C.EmparejarResponse>(await pedir('POST', '/api/lan/emparejar', undefined, []), 'pair_id');
  },
  async lanEstadoEmparejamiento(pairId: string): Promise<C.EmparejamientoEstado> {
    return como<C.EmparejamientoEstado>(await obtener(`/api/lan/emparejar/${e(pairId)}`), 'pair_id', 'estado');
  },
  async lanDecidir(pairId: string, decision: C.DecisionRequest): Promise<C.EmparejamientoEstado> {
    return como<C.EmparejamientoEstado>(await pedir('POST', `/api/lan/emparejar/${e(pairId)}/decision`, decision, ['lan', 'sesion']), 'pair_id', 'estado');
  },
  async lanCambiarDispositivo(deviceId: string, cambios: C.DispositivoCambios): Promise<C.Dispositivo> {
    return como<C.Dispositivo>(await pedir('PATCH', `/api/lan/dispositivos/${e(deviceId)}`, cambios, ['lan']), 'device_id');
  },
  async lanRevocar(deviceId: string): Promise<void> {
    await pedir('DELETE', `/api/lan/dispositivos/${e(deviceId)}`, undefined, ['lan', 'sesion']);
  },
  async firewallDiagnostico(): Promise<C.DiagnosticoFirewall> {
    return como<C.DiagnosticoFirewall>(await obtener('/api/lan/firewall'), 'estado');
  },
  async firewallConfigurar(req: C.FirewallRequest): Promise<C.FirewallResponse> {
    return como<C.FirewallResponse>(await pedir('POST', '/api/lan/firewall', req, ['firewall', 'lan']), 'resultado');
  },
  async ajustesPc(cambios: C.AjustesPcCambios): Promise<C.AjustesPc> {
    return como<C.AjustesPc>(await pedir('PATCH', '/api/ajustes/pc', cambios, ['ajustes_pc']), 'sync_auto');
  },
  async borrarDatos(req: C.BorrarDatosRequest): Promise<void> {
    await pedir('POST', '/api/datos/borrar', req, []);
    invalidarClaves([]);
  },
  async exportarLocal(): Promise<C.ExportacionLocal> {
    return como<C.ExportacionLocal>(await obtener('/api/local/exportar'), 'formato', 'planes');
  },
  async importarLocal(ruta: string): Promise<C.ImportacionLocalResponse> {
    if (typeof ruta !== 'string' || ruta.trim() === '') throw new ErrorHub('archivo_no_encontrado', 'Elige un archivo para importar.', 0);
    const cuerpo: C.ImportarLocalRequest = { ruta };
    return como<C.ImportacionLocalResponse>(
      await pedir('POST', '/api/local/importar', cuerpo, ['plan', 'avisos', 'notas', 'recordatorios', 'plantillas', 'preferencias', 'muestras', 'muestra', 'tiendas', 'tienda', 'dashboard']),
      'importados',
    );
  },

  // ------------------------------------------------------------------ rev. 5 · Display API (solo Windows)
  async displayCredenciales(req: C.CredencialesDisplayRequest): Promise<C.EstadoDisplay> {
    // El cuerpo se arma aquí con solo los dos campos: el Client secret no se copia a ningún otro lado ni se registra.
    const cuerpo: C.CredencialesDisplayRequest = { client_key: req.client_key, client_secret: req.client_secret };
    const r = await pedir('PUT', '/api/display/credenciales', cuerpo, []);
    if (!esEstadoDisplay(r)) throw respuestaInvalida();
    escribirEntrada('display', {}, r);
    return r;
  },
  async displayConectar(req?: C.ConectarDisplayRequest): Promise<C.ConectarDisplayResponse> {
    const cuerpo: C.ConectarDisplayRequest = req?.abrir_navegador ? { abrir_navegador: true } : {};
    // 'display' se vuelve a pedir: ya trae conexion_pendiente (el intento abierto, 10 min).
    return como<C.ConectarDisplayResponse>(await pedir('POST', '/api/display/conectar', cuerpo, ['display']), 'url', 'expira_at');
  },
  async displayDesconectar(req: C.DesconectarDisplayRequest): Promise<C.DesconectarDisplayResponse> {
    const cuerpo: C.DesconectarDisplayRequest = {
      ...(req.borrar_datos ? { borrar_datos: true } : {}),
      ...(req.olvidar_app ? { olvidar_app: true } : {}),
    };
    // Con borrar_datos se van las vistas, la tendencia, el perfil y las portadas: las vistas que las muestran se piden de nuevo.
    const invalida: ClaveConsulta[] = req.borrar_datos ? ['videos', 'video', 'producto', 'muestra', 'dashboard'] : [];
    const r = como<C.DesconectarDisplayResponse>(await pedir('POST', '/api/display/desconectar', cuerpo, invalida), 'display', 'revocado');
    if (esEstadoDisplay(r.display)) escribirEntrada('display', {}, r.display);
    return r;
  },
};
