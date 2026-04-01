import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useReports } from "@/lib/store";

const TrackingPage = () => {
  const navigate = useNavigate();
  const reports = useReports();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
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
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground leading-snug flex-1 mr-2">
                    {report.description}
                  </p>
                  <StatusBadge status={report.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {report.lat.toFixed(3)}, {report.lng.toFixed(3)}
                  </span>
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
