/**
 * @/raiz · banner superior ÚNICO (01 §3.5 y §4.16, BUILD_SPEC §8.4): se calculan todos los que aplican y se muestra solo
 * el de mayor prioridad (P0 → P2 → Aviso). Los de bloqueo (P0) no se descartan; los demás se ocultan 24 h por equipo.
 * En Android el P0 de conexión con TikTok usa el texto de C35 (sin botón: se reautoriza desde la PC).
 * Puro: sin React ni DOM, para probar la prioridad con tablas.
 */
import type { EpochS, MuestraVista, SessionResponse } from '@/contrato';
import type { EstadoConexionPc, PlataformaUi } from '@/plataforma';
import { formato } from '@/dominio';
import { T } from './textos';

/** P0 = bloqueo · P2 = promesa vencida · Aviso = estado que conviene saber. Menor número = más prioridad. */
export type PrioridadBanner = 0 | 2 | 3;
export type TonoBanner = 'critico' | 'atencion' | 'neutro';
export type AccionBanner =
  | { tipo: 'reautorizar' }
  | { tipo: 'navegar'; a: string }
  | { tipo: 'sincronizar' }
  | { tipo: 'mensaje_tienda'; tienda_key: string };

export interface DefBanner {
  /** Estable por situación: al cambiar la situación (otra promesa, otra fecha) vuelve a aparecer aunque se descartó. */
  id: string;
  prioridad: PrioridadBanner;
  tono: TonoBanner;
  texto: string;
  detalle?: string;
  acciones: Array<{ etiqueta: string; accion: AccionBanner }>;
  descartable: boolean;
}

export interface EntradaBanner {
  plataforma: PlataformaUi;
  sesion: SessionResponse | undefined;
  /** Solo Android. */
  conexionPc: EstadoConexionPc | null;
  /** Instante de la copia con la que se armó la vista (Android sin la PC). */
  copiaAt: EpochS | null;
  /** Pendientes con sus avisos ya superpuestos (para «Promesa vencida»). */
  pendientes: readonly MuestraVista[];
  ahora: EpochS;
  /** id → instante en que se descartó (vale 24 h). */
  descartados: Readonly<Record<string, EpochS>>;
}

export const VIGENCIA_DESCARTE_S = 24 * 3600;
const VIEJOS_S = 24 * 3600;

/** «tus muestras», «tu vitrina»… a partir de los permisos que faltan (01 §4.14 A). */
const QUE_ACTUALIZA: Readonly<Record<string, string>> = {
  'creator.affiliate_collaboration.read': 'tus muestras',
  'creator.showcase.read': 'tu vitrina',
  'creator.showcase.write': 'tu vitrina',
  'creator.affiliate.info': 'tu perfil',
  'creator.affiliate.link.write': 'tus enlaces de afiliado',
};

export function queActualiza(scopes: readonly string[]): string {
  const nombres: string[] = [];
  for (const s of scopes) {
    const n = QUE_ACTUALIZA[s] ?? 'tus datos';
    if (!nombres.includes(n)) nombres.push(n);
  }
  if (nombres.length === 0) return 'tus datos';
  if (nombres.length === 1) return nombres[0] ?? 'tus datos';
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1] ?? ''}`;
}

/** «12 nov, 6:04 p. m.» con espacios duros: la fecha y la hora nunca se parten entre dos renglones. */
export function fechaYHora(t: EpochS): string {
  return `${formato.fechaCorta(t)}, ${formato.hora(t)}`.replace(/ /g, ' ');
}

/** Todos los banners que aplican, del más prioritario al menos (sin quitar los descartados). */
export function calcularBanners(e: EntradaBanner): DefBanner[] {
  const lista: DefBanner[] = [];
  const android = e.plataforma === 'android';
  const s = e.sesion;
  const conexion = s?.conexion;

  // ------------------------------------------------------------------ P0 · conexión con TikTok
  if (conexion?.estado === 'reautorizar') {
    lista.push(
      android
        ? { id: 'reautorizar', prioridad: 0, tono: 'critico', texto: T.bannerReautorizarAndroid, acciones: [], descartable: false }
        : {
            id: 'reautorizar',
            prioridad: 0,
            tono: 'critico',
            // C42: si el hub explica por qué se venció (panel anterior), ese texto manda.
            texto: conexion.aviso ?? T.bannerReautorizar,
            acciones: [{ etiqueta: T.accReautorizar, accion: { tipo: 'reautorizar' } }],
            descartable: false,
          },
    );
  } else if (conexion?.estado === 'cuenta_sin_region') {
    lista.push({
      id: 'sin_region',
      prioridad: 0,
      tono: 'critico',
      texto: T.bannerSinRegion,
      acciones: s?.capacidades.sincronizar ? [{ etiqueta: T.accReintentar, accion: { tipo: 'sincronizar' } }] : [],
      descartable: false,
    });
  } else if (conexion?.estado === 'conectada' && conexion.scopes_faltantes.length > 0) {
    const que = queActualiza(conexion.scopes_faltantes);
    lista.push({
      id: `permiso:${conexion.scopes_faltantes.join(',')}`,
      prioridad: 0,
      tono: 'atencion',
      texto: android ? T.bannerPermisoAndroid(que) : T.bannerPermiso(que),
      acciones: android ? [] : [{ etiqueta: T.accReautorizar, accion: { tipo: 'reautorizar' } }],
      descartable: false,
    });
  } else if (!android && conexion?.estado === 'sin_credenciales' && s?.datos.hay_datos) {
    lista.push({
      id: 'sin_clave',
      prioridad: 0,
      tono: 'atencion',
      texto: T.bannerClave,
      acciones: [
        { etiqueta: T.accImportar, accion: { tipo: 'navegar', a: '/ajustes/tiktok' } },
        { etiqueta: T.accPegarClave, accion: { tipo: 'navegar', a: '/ajustes/tiktok' } },
      ],
      descartable: false,
    });
  }

  // ------------------------------------------------------------------ P0 en Android · la PC ya no reconoce al celular
  if (android && e.conexionPc?.revocado) {
    lista.push({
      id: 'revocado',
      prioridad: 0,
      tono: 'critico',
      texto: T.bannerRevocado,
      acciones: [{ etiqueta: T.accEmparejar, accion: { tipo: 'navegar', a: '/emparejar' } }],
      descartable: false,
    });
  }

  // ------------------------------------------------------------------ P2 · promesa vencida (la más antigua primero)
  let vencida: { tienda_key: string; tienda: string; promesa: string } | null = null;
  for (const m of e.pendientes) {
    const promesa = m.avisos.promesa;
    if (!m.avisos.promesa_vencida || !promesa) continue;
    if (!vencida || promesa < vencida.promesa) vencida = { tienda_key: m.tienda.tienda_key, tienda: m.tienda.nombre, promesa };
  }
  if (vencida) {
    lista.push({
      id: `promesa:${vencida.tienda_key}:${vencida.promesa}`,
      prioridad: 2,
      tono: 'critico',
      texto: T.bannerPromesa(vencida.tienda, formato.fechaConDia(vencida.promesa)),
      acciones: [{ etiqueta: T.accPrepararMensaje, accion: { tipo: 'mensaje_tienda', tienda_key: vencida.tienda_key } }],
      descartable: true,
    });
  }

  // ------------------------------------------------------------------ Aviso · sin conexión / datos viejos
  const sync = s?.sync;
  const ultimaOk = s?.datos.ultima_sync_ok_at ?? sync?.ultima_ok_at ?? null;
  if (android && e.conexionPc?.emparejado && !e.conexionPc.conectado && !e.conexionPc.revocado) {
    const cuando = e.conexionPc.ultima_copia_at ?? e.copiaAt ?? ultimaOk;
    const n = e.conexionPc.cambios_pendientes;
    lista.push({
      id: 'sin_pc',
      prioridad: 3,
      tono: 'neutro',
      texto: cuando ? T.bannerSinPc(fechaYHora(cuando)) : T.bannerSinPcSinFecha,
      detalle: n > 0 ? `${T.bannerSinPcDetalle} ${T.cambiosPorEnviar(n)}.` : T.bannerSinPcDetalle,
      acciones: [],
      descartable: false,
    });
  } else if (!android && sync && !sync.en_curso && sync.ultimo_error?.codigo === 'sin_internet') {
    lista.push({
      id: `sin_internet:${sync.ultimo_error.at}`,
      prioridad: 3,
      tono: 'neutro',
      texto: T.bannerSinInternet(ultimaOk ? fechaYHora(ultimaOk) : formato.fechaCorta(e.ahora)),
      acciones: [],
      descartable: true,
    });
  } else if (ultimaOk !== null && e.ahora - ultimaOk > VIEJOS_S && !sync?.en_curso && s?.datos.hay_datos) {
    lista.push({
      id: `datos_viejos:${ultimaOk}`,
      prioridad: 3,
      tono: 'atencion',
      texto: T.bannerDatosViejos(formato.fechaCorta(ultimaOk)),
      acciones: s.capacidades.sincronizar ? [{ etiqueta: T.accSincronizar, accion: { tipo: 'sincronizar' } }] : [],
      descartable: true,
    });
  }

  return lista.sort((a, b) => a.prioridad - b.prioridad);
}

/** El único banner visible: el de mayor prioridad que no se descartó en las últimas 24 h (los P0 nunca se descartan). */
export function elegirBanner(e: EntradaBanner): DefBanner | null {
  for (const b of calcularBanners(e)) {
    const at = e.descartados[b.id];
    if (b.descartable && at !== undefined && e.ahora - at < VIGENCIA_DESCARTE_S) continue;
    return b;
  }
  return null;
}
