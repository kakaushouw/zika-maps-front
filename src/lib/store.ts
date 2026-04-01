import { useState, useEffect, useSyncExternalStore } from "react";

export interface Report {
  id: string;
  description: string;
  status: "pending" | "confirmed" | "resolved" | "discarded";
  date: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}

const initialReports: Report[] = [
  { id: "1", description: "Água parada em pneu abandonado na Rua das Flores", status: "confirmed", date: "2026-03-28", lat: -3.1190, lng: -60.0217 },
  { id: "2", description: "Caixa d'água destampada no terreno baldio", status: "pending", date: "2026-03-30", lat: -3.1050, lng: -60.0350 },
  { id: "3", description: "Vaso com água acumulada na calçada", status: "resolved", date: "2026-03-25", lat: -3.0900, lng: -60.0100 },
  { id: "4", description: "Entulho com acúmulo de água", status: "discarded", date: "2026-03-20", lat: -3.1300, lng: -60.0500 },
];

let reports: Report[] = [...initialReports];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function getReports(): Report[] {
  return reports;
}

export function addReport(report: Omit<Report, "id" | "status" | "date">): Report {
  const newReport: Report = {
    ...report,
    id: Date.now().toString(),
    status: "pending",
    date: new Date().toISOString().split("T")[0],
  };
  reports = [newReport, ...reports];
  notify();
  return newReport;
}

export function updateReportStatus(id: string, status: Report["status"]) {
  reports = reports.map((r) => (r.id === id ? { ...r, status } : r));
  notify();
}

function subscribeStore(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useReports(): Report[] {
  return useSyncExternalStore(subscribeStore, getReports, getReports);
}
