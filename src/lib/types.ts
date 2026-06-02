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
