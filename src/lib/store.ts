import { useState, useEffect, useSyncExternalStore } from "react";
import {
  WS_URL,
  apiFetch,
  getAuthHeaders,
  normalizeReport,
  normalizeReports,
  parseApiError,
  resolveReportImageUrl,
  type AuthUser,
} from "./api";
import type { Report, ReportStatus } from "./types";

export type { Report, ReportStatus } from "./types";
export { API_URL, WS_URL, resolveReportImageUrl } from "./api";

// Estado global reativo de autenticação
let authUser: AuthUser | null = null;
try {
  const storedUser = localStorage.getItem("zika_user");
  if (storedUser) authUser = JSON.parse(storedUser) as AuthUser;
} catch {
  /* silent */
}

let authListeners: ((u: AuthUser | null) => void)[] = [];
function notifyAuth(u: AuthUser | null) {
  authUser = u;
  authListeners.forEach((l) => l(u));
}

let sessionInitialized = false;

/** Valida o JWT com GET /api/auth/me e atualiza o usuário em cache */
export async function refreshSession(): Promise<AuthUser | null> {
  const token = localStorage.getItem("zika_token");
  if (!token) {
    notifyAuth(null);
    return null;
  }

  const res = await apiFetch("/api/auth/me", {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    if (res.status === 401) {
      await signOut();
    }
    return null;
  }

  const user = (await res.json()) as AuthUser;
  localStorage.setItem("zika_user", JSON.stringify(user));
  notifyAuth(user);
  return user;
}

// Hook de Autenticação
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(authUser);
  const [loading, setLoading] = useState(
    () => !!localStorage.getItem("zika_token") && !sessionInitialized
  );

  useEffect(() => {
    const listener = (u: AuthUser | null) => setUser(u);
    authListeners.push(listener);

    if (!sessionInitialized && localStorage.getItem("zika_token")) {
      sessionInitialized = true;
      refreshSession().finally(() => setLoading(false));
    } else {
      sessionInitialized = true;
      setLoading(false);
    }

    return () => {
      authListeners = authListeners.filter((l) => l !== listener);
    };
  }, []);

  return { user, loading };
}

// Hook para verificar se o usuário logado é agente
export function useIsAgent(): boolean {
  const { user } = useAuth();
  if (!user) return false;
  if (user.role === "agent") return true;
  if (Array.isArray(user.roles) && user.roles.includes("agent")) return true;
  return false;
}

// Obter papel (role) do usuário
export async function getUserRole(): Promise<"citizen" | "agent" | null> {
  const token = localStorage.getItem("zika_token");
  if (!token) return null;

  try {
    const res = await apiFetch("/api/auth/role", {
      headers: getAuthHeaders(false),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.role as "citizen" | "agent";
  } catch {
    if (authUser?.roles?.length) {
      return authUser.roles[0] as "citizen" | "agent";
    }
    return "citizen";
  }
}

// Cadastrar usuário
export async function signUp(
  email: string,
  password: string,
  role: "citizen" | "agent" = "citizen"
) {
  const res = await apiFetch("/api/auth/signup", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password, role }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return await signIn(email, password);
}

// Fazer login
export async function signIn(email: string, password: string) {
  const res = await apiFetch("/api/auth/signin", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = await res.json();

  localStorage.setItem("zika_token", data.access_token);
  localStorage.setItem("zika_user", JSON.stringify(data.user));

  notifyAuth(data.user as AuthUser);
  return data;
}

// Logout
export async function signOut() {
  localStorage.removeItem("zika_token");
  localStorage.removeItem("zika_user");
  notifyAuth(null);
}

// Esqueceu senha
export async function resetPassword(email: string) {
  const res = await apiFetch("/api/auth/reset-password", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
}

// Atualizar senha
export async function updatePassword(password: string) {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await apiFetch("/api/auth/update-password", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }
}

// Obter denúncias
export async function getReports(): Promise<Report[]> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await apiFetch("/api/reports", {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = await res.json();
  return normalizeReports(data);
}

// Cadastrar denúncia
export async function addReport(
  report: Omit<Report, "id" | "user_id" | "status" | "date" | "created_at">
): Promise<Report> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const payload = {
    description: report.description,
    address: report.address,
    lat: Number(report.lat),
    lng: Number(report.lng),
    image_url: report.image_url
      ? resolveReportImageUrl(report.image_url)
      : undefined,
  };

  const res = await apiFetch("/api/reports", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = await res.json();
  return normalizeReport(data as Record<string, unknown>);
}

// Atualizar status da denúncia
export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await apiFetch(`/api/reports/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = await res.json();
  const updated = normalizeReport(data as Record<string, unknown>);
  reportsCache = reportsCache.map((r) => (r.id === updated.id ? updated : r));
  notify();
}

// Upload de imagem da denúncia
export async function uploadReportImage(file: File): Promise<string> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiFetch("/api/reports/upload", {
    method: "POST",
    headers: getAuthHeaders(false),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  const data = await res.json();
  const url = resolveReportImageUrl(data.url);
  if (!url) {
    throw new Error("Resposta de upload inválida: URL da imagem ausente.");
  }
  return url;
}

// Cache e sub/pub para Denúncias (Realtime)
let reportsCache: Report[] = [];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return reportsCache;
}

export function useReports(): Report[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Sincronização em tempo real via WebSocket (FastAPI)
let syncActive = false;
let wsInstance: WebSocket | null = null;

function applyWsPayload(payload: {
  eventType: string;
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
}) {
  if (payload.eventType === "INSERT" && payload.new) {
    const report = normalizeReport(payload.new);
    if (!reportsCache.some((r) => r.id === report.id)) {
      reportsCache = [report, ...reportsCache];
    }
  } else if (payload.eventType === "UPDATE" && payload.new) {
    const report = normalizeReport(payload.new);
    reportsCache = reportsCache.map((r) => (r.id === report.id ? report : r));
  } else if (payload.eventType === "DELETE" && payload.old) {
    const id = String((payload.old as { id?: string }).id);
    reportsCache = reportsCache.filter((r) => r.id !== id);
  }
  notify();
}

export function startReportsSync() {
  if (syncActive) {
    return () => {};
  }
  syncActive = true;

  getReports()
    .then((data) => {
      reportsCache = data;
      notify();
    })
    .catch((err) => {
      console.error("Erro inicial ao carregar denúncias:", err);
    });

  const connectWs = () => {
    if (!syncActive) return;

    const ws = new WebSocket(WS_URL);
    wsInstance = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        applyWsPayload(payload);
      } catch (e) {
        console.error("Erro ao processar mensagem do WebSocket:", e);
      }
    };

    ws.onclose = () => {
      wsInstance = null;
      if (syncActive) {
        setTimeout(connectWs, 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  };

  connectWs();

  return () => {
    syncActive = false;
    if (wsInstance) {
      wsInstance.close();
      wsInstance = null;
    }
  };
}
