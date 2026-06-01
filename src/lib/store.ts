import { useState, useEffect, useSyncExternalStore } from "react";

export type ReportStatus = "pending" | "confirmed" | "resolved" | "discarded";

export interface Report {
  id: string;
  user_id: string;
  description: string;
  address?: string;
  status: ReportStatus;
  date: string;
  lat: number;
  lng: number;
  image_url?: string;
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Estado global reativo de autenticação
let authUser: any = null;
try {
  const storedUser = localStorage.getItem("zika_user");
  if (storedUser) authUser = JSON.parse(storedUser);
} catch { /* silent */ }

let authListeners: ((u: any) => void)[] = [];
function notifyAuth(u: any) {
  authUser = u;
  authListeners.forEach((l) => l(u));
}

// Hook de Autenticação
export function useAuth() {
  const [user, setUser] = useState<any>(authUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listener = (u: any) => setUser(u);
    authListeners.push(listener);
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
  // Suporta os formatos: { role: "agent" } ou { roles: ["agent"] }
  if (user.role === "agent") return true;
  if (Array.isArray(user.roles) && user.roles.includes("agent")) return true;
  return false;
}

// Obter papel (role) do usuário
export async function getUserRole(): Promise<"citizen" | "agent" | null> {
  const token = localStorage.getItem("zika_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.role as "citizen" | "agent";
  } catch {
    // Fallback para o role salvo localmente se der erro na rede
    if (authUser && authUser.roles && authUser.roles.length > 0) {
      return authUser.roles[0] as "citizen" | "agent";
    }
    return "citizen";
  }
}

// Cadastrar usuário
export async function signUp(email: string, password: string, role: "citizen" | "agent" = "citizen") {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, role }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao realizar cadastro");
  }

  const data = await res.json();
  
  // Realizar o login automatico logo apos cadastrar
  return await signIn(email, password);
}

// Fazer login
export async function signIn(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao realizar login");
  }

  const data = await res.json();
  
  localStorage.setItem("zika_token", data.access_token);
  localStorage.setItem("zika_user", JSON.stringify(data.user));
  
  notifyAuth(data.user);
  return data;
}

// Logout
export async function signOut() {
  localStorage.removeItem("zika_token");
  localStorage.removeItem("zika_user");
  notifyAuth(null);
}

// Esqueceu senha (Mock para desenvolvimento local, envia email na prod se configurado)
export async function resetPassword(email: string) {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao solicitar redefinição de senha");
  }
}

// Atualizar senha
export async function updatePassword(password: string) {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(`${API_URL}/api/auth/update-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao atualizar senha");
  }
}

// Obter denúncias
export async function getReports(): Promise<Report[]> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(`${API_URL}/api/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao carregar denúncias");
  }

  const data = await res.json();
  return data as Report[];
}

// Cadastrar denúncia
export async function addReport(report: Omit<Report, "id" | "user_id" | "status" | "date" | "created_at">): Promise<Report> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(`${API_URL}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(report),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao enviar denúncia");
  }

  const data = await res.json();
  return data as Report;
}

// Atualizar status da denúncia
export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const res = await fetch(`${API_URL}/api/reports/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao atualizar status da denúncia");
  }
}

// Upload de imagem da denúncia
export async function uploadReportImage(file: File): Promise<string> {
  const token = localStorage.getItem("zika_token");
  if (!token) throw new Error("Usuário não autenticado");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/reports/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Erro ao fazer upload da imagem");
  }

  const data = await res.json();
  return data.url;
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

// Sincronização em tempo real via WebSocket nativo do FastAPI
let syncActive = false;
let wsInstance: WebSocket | null = null;

export function startReportsSync() {
  // Se já há uma sincronização ativa, não inicia outra
  if (syncActive) {
    return () => {}; // cleanup vazio, quem iniciou é responsável por parar
  }
  syncActive = true;

  // Carregamento inicial
  getReports().then((data) => {
    reportsCache = data;
    notify();
  }).catch((err) => {
    console.error("Erro inicial ao carregar denúncias:", err);
  });

  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";

  const connectWs = () => {
    if (!syncActive) return;

    const ws = new WebSocket(wsUrl);
    wsInstance = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.eventType === "INSERT") {
          reportsCache = [payload.new as Report, ...reportsCache];
        } else if (payload.eventType === "UPDATE") {
          reportsCache = reportsCache.map((r) =>
            r.id === (payload.new as Report).id ? (payload.new as Report) : r
          );
        } else if (payload.eventType === "DELETE") {
          reportsCache = reportsCache.filter((r) => r.id !== (payload.old as Report).id);
        }
        notify();
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

  // Retorna cleanup para o componente que iniciou a sync
  return () => {
    syncActive = false;
    if (wsInstance) {
      wsInstance.close();
      wsInstance = null;
    }
  };
}
