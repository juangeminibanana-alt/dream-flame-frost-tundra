import { createFileRoute } from "@tanstack/react-router";

/**
 * El hub de Windows no corre aquí. Respuestas vacías y una sesión sin TikTok
 * para que la interfaz de Corte abra de verdad, sin fingir ventas.
 */
const SYNC = {
  en_curso: false,
  sync_id: null,
  tipo: null,
  origen: null,
  progreso: 0,
  paso_actual: null,
  texto: "",
  pasos: [],
  iniciada_at: null,
  ultima_ok_at: null,
  ultima_estado: null,
  proxima_auto_at: null,
  ultimo_error: null,
};

const SESSION = {
  cuenta: null,
  conexion: {
    estado: "sin_credenciales",
    access_expira_at: null,
    refresh_expira_at: null,
    scopes: [],
    scopes_faltantes: [],
    aviso: "TikTok no está conectado en esta vista. Tus ventas siguen en Corte de tu PC.",
    origen: null,
  },
  sync: SYNC,
  datos: {
    data_version: 0,
    local_rev: 0,
    ultima_sync_ok_at: null,
    hay_datos: true,
  },
  plataforma: "windows",
  modo: "real",
  capacidades: {
    auth: false,
    lan_admin: false,
    portapapeles: false,
    escribir: false,
    sincronizar: false,
  },
  servidor: { version: "1.0.3", puerto_ui: 8080, puerto_respaldo: false },
};

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function events(): Response {
  let timer: ReturnType<typeof setInterval> | null = null;
  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      const send = () => {
        controller.enqueue(
          enc.encode(`event: ping\ndata: ${JSON.stringify({ tipo: "ping", t: Math.floor(Date.now() / 1000) })}\n\n`),
        );
      };
      send();
      timer = setInterval(send, 20000);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}

/** 204: la interfaz trata el cuerpo vacío como «sin datos», sin inventar ventas. */
const CERO = {
  pedidos: 0,
  pedidos_reembolsados: 0,
  pedidos_validos: 0,
  tasa_reembolso: 0,
  unidades: 0,
  ventas_centavos: 0,
  comision_total_centavos: 0,
  comision_estimada_centavos: 0,
  comision_liquidada_centavos: 0,
  comision_por_liquidar_centavos: 0,
  comision_retenida_centavos: 0,
  comision_perdida_reembolsos_centavos: 0,
  ticket_promedio_centavos: null,
  tasa_comision_efectiva: null,
  videos_con_venta: 0,
  tiendas_con_venta: 0,
  productos_con_venta: 0,
};

const POR_CLASE = {
  debe_video: 0,
  entregada: 0,
  exenta: 0,
  cancelada: 0,
  nunca_enviada: 0,
  pendiente_abierta: 0,
};

const POR_GRUPO = {
  entregada: 0,
  exenta: 0,
  en_revision: 0,
  por_vencer: 0,
  pausada: 0,
  vencida: 0,
  esperando_aprobacion: 0,
  en_camino: 0,
  pedido_cancelado: 0,
  sin_envio: 0,
};

function lista(): Response {
  return json({ items: [], total: 0, pagina: 1, paginas: 0 });
}

function tablero(url: URL): Response {
  const periodo = url.searchParams.get("periodo") || "30d";
  const hoy = "2026-11-17";
  return json({
    periodo: {
      clave: periodo,
      desde: "2026-10-18",
      hasta: hoy,
      anterior_desde: null,
      anterior_hasta: null,
    },
    kpis: CERO,
    kpis_anterior: null,
    muestras: {
      total: 0,
      por_clase: POR_CLASE,
      por_grupo: POR_GRUPO,
      recibidas: 0,
      tiendas_recibidas: 0,
      debe_video: {
        n: 0,
        tiendas: 0,
        valor_min_centavos: 0,
        valor_max_centavos: 0,
        con_plan: 0,
        saldadas: 0,
      },
      pendientes: 0,
      tiendas_por_avisar: 0,
      promesas_vencidas: 0,
      cumplimiento: null,
      proxima_fecha_limite: null,
      conversion: { productos_recibidos: 0, productos_con_venta: 0, productos_activados: 0 },
    },
    serie: { granularidad: "semana", puntos: [] },
    top_tiendas: [],
    top_videos: [],
    top_productos: [],
    alertas: [],
    data_version: 0,
    generado_at: 0,
  });
}

function serie(url: URL): Response {
  return json({
    granularidad: url.searchParams.get("granularidad") || "semana",
    desde: url.searchParams.get("desde") || "2026-10-18",
    hasta: url.searchParams.get("hasta") || "2026-11-17",
    puntos: [],
  });
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const path = url.pathname;
        if (path === "/api/events") return events();
        if (path === "/api/session") return json(SESSION);
        if (path === "/api/dashboard") return tablero(url);
        if (path === "/api/analitica/serie") return serie(url);
        return lista();
      },
      POST: () => lista(),
      PUT: () => lista(),
      PATCH: () => lista(),
      DELETE: () => lista(),
    },
  },
});
