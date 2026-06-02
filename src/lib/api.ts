import type { Report, ReportStatus } from "./types";

export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:5000";

export const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://127.0.0.1:5000/ws";

const IMAGE_PATH_RE = /\/api\/reports\/image\/([^/?#]+)/;

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
  role?: string;
  profile?: {
    display_name?: string | null;
    phone?: string | null;
  };
}

export async function parseApiError(res: Response): Promise<string> {
  if (res.status === 405) {
    return "Método HTTP não permitido neste endpoint. Verifique a configuração da API.";
  }
  if (res.status === 401) {
    return "Sessão expirada ou credenciais inválidas. Faça login novamente.";
  }
  if (res.status === 403) {
    return "Você não tem permissão para realizar esta ação.";
  }
  if (res.status === 404) {
    return "Recurso não encontrado.";
  }
  if (res.status >= 500) {
    return "Erro no servidor. Tente novamente em instantes.";
  }

  try {
    const data = await res.json();
    const { detail } = data;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: { msg?: string; message?: string }) => item.msg || item.message || String(item))
        .join(", ");
    }
  } catch {
    /* corpo não é JSON */
  }

  return `Erro na requisição (${res.status})`;
}

export function getAuthHeaders(json = true): HeadersInit {
  const token = localStorage.getItem("zika_token");
  const headers: Record<string, string> = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new Error(
      "Falha de conexão com o servidor. Verifique sua internet ou a URL da API (VITE_API_URL)."
    );
  }
}

/** URL absoluta para imagens BLOB servidas por GET /api/reports/image/{file_id} */
export function resolveReportImageUrl(imageUrl?: string | null): string | undefined {
  if (!imageUrl) return undefined;
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  const match = imageUrl.match(IMAGE_PATH_RE);
  const fileId =
    match?.[1] ??
    (/^[0-9a-f-]{36}$/i.test(imageUrl) ? imageUrl : null);

  if (fileId) {
    return `${API_URL}/api/reports/image/${fileId}`;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    try {
      const parsed = new URL(imageUrl);
      const pathMatch = parsed.pathname.match(IMAGE_PATH_RE);
      if (pathMatch?.[1]) {
        return `${API_URL}/api/reports/image/${pathMatch[1]}`;
      }
    } catch {
      return imageUrl;
    }
    return imageUrl;
  }

  return `${API_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export function normalizeReport(raw: Record<string, unknown>): Report {
  const lat = Number(raw.lat);
  const lng = Number(raw.lng);
  const status = String(raw.status ?? "pending") as ReportStatus;

  return {
    id: String(raw.id),
    user_id: String(raw.user_id),
    description: String(raw.description ?? ""),
    address: raw.address != null ? String(raw.address) : undefined,
    status,
    date:
      typeof raw.date === "string"
        ? raw.date
        : raw.date != null
          ? String(raw.date)
          : new Date().toISOString().slice(0, 10),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    image_url: resolveReportImageUrl(
      typeof raw.image_url === "string" ? raw.image_url : undefined
    ),
    created_at:
      typeof raw.created_at === "string"
        ? raw.created_at
        : new Date().toISOString(),
  };
}

export function normalizeReports(data: unknown): Report[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => normalizeReport(item as Record<string, unknown>));
}
