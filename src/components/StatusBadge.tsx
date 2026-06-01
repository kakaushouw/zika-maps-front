import { Report } from "@/lib/store";

const statusConfig = {
  pending: { label: "Pendente", className: "bg-amber-50 text-amber-700 border-amber-200/60" },
  confirmed: { label: "Confirmada", className: "bg-emerald-50 text-emerald-700 border-emerald-200/60" },
  resolved: { label: "Resolvido", className: "bg-blue-50 text-blue-700 border-blue-200/60" },
  discarded: { label: "Descartado", className: "bg-red-50 text-red-700 border-red-200/60" },
};

interface StatusBadgeProps {
  status: Report["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${config.className} uppercase tracking-wider`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
