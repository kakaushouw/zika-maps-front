import { Report } from "@/lib/store";

const statusConfig = {
  pending: { label: "Pendente", className: "bg-status-pending text-warning-foreground" },
  confirmed: { label: "Confirmada", className: "bg-status-confirmed text-success-foreground" },
  resolved: { label: "Resolvido", className: "bg-status-resolved text-info-foreground" },
  discarded: { label: "Descartado", className: "bg-status-discarded text-card" },
};

interface StatusBadgeProps {
  status: Report["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
