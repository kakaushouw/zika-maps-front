import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

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

// Auth hooks
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export async function getUserRole(): Promise<"citizen" | "agent" | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return data?.role ?? "citizen";
}

export async function signUp(email: string, password: string, role: "citizen" | "agent" = "citizen") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    await supabase.from("profiles").insert({ user_id: data.user.id });
    await supabase.from("user_roles").insert({ user_id: data.user.id, role });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

// Reports
export async function getReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Report[];
}

export async function addReport(report: Omit<Report, "id" | "user_id" | "status" | "date" | "created_at">): Promise<Report> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      description: report.description || "Foco registrado via app",
      address: report.address,
      lat: report.lat,
      lng: report.lng,
      image_url: report.image_url,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
}

export async function uploadReportImage(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const ext = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("report-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage.from("report-images").getPublicUrl(path);
  return data.publicUrl;
}

// React hook for reports with realtime
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

// Realtime sync
let subscribed = false;
export function startReportsSync() {
  if (subscribed) return;
  subscribed = true;

  getReports().then((data) => {
    reportsCache = data;
    notify();
  });

  const channel = supabase
    .channel("reports_changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, (payload) => {
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
    })
    .subscribe();

  return () => {
    channel.unsubscribe();
    subscribed = false;
  };
}
