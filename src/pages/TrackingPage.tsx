import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { BrandLogo } from "@/components/BrandLogo";
import StatusBadge from "@/components/StatusBadge";
import { useReports, startReportsSync, useAuth } from "@/lib/store";

const TrackingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const reports = useReports();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const cleanup = startReportsSync();
    return cleanup;
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="flex items-center gap-3 px-5 py-4 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-10 w-full">
          <div className="max-w-lg mx-auto w-full flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:bg-muted rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BrandLogo size="xs" />
            <h1 className="font-heading text-lg font-extrabold text-foreground flex-1">Minhas Denúncias</h1>
          </div>
        </div>

        <div className="px-5 py-6 space-y-3 max-w-lg mx-auto w-full">
          {reports.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm font-semibold text-muted-foreground">Nenhuma denúncia registrada.</p>
            </div>
          ) : (
            reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => navigate(`/tracking/${report.id}`)}
                className="cursor-pointer rounded-2xl bg-card p-5 border border-border hover:border-primary/30 transition-all duration-300 flex items-center justify-between"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-bold text-foreground leading-snug truncate mb-1">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      {report.date}
                    </span>
                    {report.image_url && (
                      <span className="text-primary font-bold flex items-center gap-0.5">📷 Com foto</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={report.status} />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
