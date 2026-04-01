import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, CheckCircle, Shield, Trash2, X, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useReports, updateReportStatus, Report } from "@/lib/store";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const reports = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const confirmedCount = reports.filter((r) => r.status === "confirmed").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-card border-b border-border">
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">Painel do Agente</h1>
            <p className="text-xs text-muted-foreground">Vigilância Sanitária</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-destructive hover:bg-destructive/10 font-semibold"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sair
          </Button>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Pendentes", value: pendingReports.length, color: "bg-warning/15 text-warning-foreground" },
              { label: "Confirmadas", value: confirmedCount, color: "bg-primary/10 text-primary" },
              { label: "Resolvidos", value: resolvedCount, color: "bg-accent/10 text-accent" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-3 text-center ${stat.color}`}>
                <p className="text-2xl font-heading font-bold">{stat.value}</p>
                <p className="text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pending List */}
          <div>
            <h2 className="font-heading text-base font-bold text-foreground mb-3">Denúncias Pendentes</h2>
            <div className="space-y-3">
              {pendingReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  Nenhuma denúncia pendente.
                </div>
              ) : (
                pendingReports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedReport(report)}
                    className="cursor-pointer rounded-xl bg-card p-4 border border-border hover:border-primary/30 transition-colors"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground flex-1 mr-2">{report.description}</p>
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{report.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{report.lat.toFixed(3)}, {report.lng.toFixed(3)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* All Reports */}
          <div>
            <h2 className="font-heading text-base font-bold text-foreground mb-3">Todas as Denúncias</h2>
            <div className="space-y-3">
              {reports.filter(r => r.status !== "pending").map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl bg-card p-4 border border-border"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-foreground flex-1 mr-2">{report.description}</p>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end justify-center"
              onClick={() => setSelectedReport(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-t-2xl bg-card p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-foreground">Detalhes da Denúncia</h3>
                  <button onClick={() => setSelectedReport(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-foreground">{selectedReport.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span><Calendar className="inline h-3 w-3 mr-1" />{selectedReport.date}</span>
                    <span><MapPin className="inline h-3 w-3 mr-1" />{selectedReport.lat.toFixed(4)}, {selectedReport.lng.toFixed(4)}</span>
                  </div>

                  {/* Simulated map preview */}
                  <div className="h-32 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border">
                    🗺️ Visualização do mapa
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => { updateReportStatus(selectedReport.id, "confirmed"); setSelectedReport(null); }}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Validar Foco
                  </Button>
                  <Button
                    onClick={() => { updateReportStatus(selectedReport.id, "resolved"); setSelectedReport(null); }}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Registrar Ação
                  </Button>
                  <Button
                    onClick={() => { updateReportStatus(selectedReport.id, "discarded"); setSelectedReport(null); }}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 font-semibold"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default AgentDashboard;
