import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useReports, updateReportStatus, type Report } from "@/lib/store";

const statusOptions: { value: Report["status"]; label: string }[] = [
  { value: "pending", label: "Pendente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "resolved", label: "Resolvido" },
  { value: "discarded", label: "Descartado" },
];

const TrackingPage = () => {
  const navigate = useNavigate();
  const reports = useReports();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: Report["status"]) => {
    updateReportStatus(id, status);
    setEditingId(null);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 px-5 py-4 bg-card border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-destructive hover:bg-destructive/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-heading text-lg font-bold text-foreground">Minhas Denúncias</h1>
        </div>

        <div className="px-5 py-4 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma denúncia registrada.</p>
            </div>
          ) : (
            reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-card p-4 border border-border"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  onClick={() => navigate(`/tracking/${report.id}`)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground leading-snug flex-1 mr-2">
                      {report.description}
                    </p>
                  </div>
                  {report.address && (
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {report.address}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.date}
                    </span>
                    {report.image_url && (
                      <span className="text-primary text-xs">📷 Com foto</span>
                    )}
                  </div>
                </div>

                {/* Status row with edit */}
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between relative">
                  <StatusBadge status={report.status} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(editingId === report.id ? null : report.id);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                  >
                    Alterar status
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${editingId === report.id ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {editingId === report.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[160px]"
                      >
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(report.id, opt.value);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                              report.status === opt.value
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <StatusBadge status={opt.value} />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TrackingPage;
