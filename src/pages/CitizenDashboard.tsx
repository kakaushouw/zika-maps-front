import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, List, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useReports, signOut, startReportsSync, useAuth } from "@/lib/store";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const reports = useReports();
  const myReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const cleanup = startReportsSync();
    return cleanup;
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-card border-b border-border">
          <h1 className="font-heading text-lg font-bold text-foreground">ZIKA-MAPS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
            className="text-destructive hover:bg-destructive/10 font-semibold"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sair
          </Button>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Olá, Cidadão!</h2>
            <p className="text-sm text-muted-foreground mt-1">Ajude a combater a Dengue e Zika na sua região.</p>
          </div>

          {/* Main CTA */}
          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={() => navigate("/report")}
              className="w-full py-8 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl animate-pulse-glow"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              <Plus className="h-6 w-6 mr-2" />
              Registrar Novo Foco
            </Button>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/tracking")}
              className="cursor-pointer rounded-xl bg-card p-4 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <List className="h-6 w-6 text-accent mb-2" />
              <p className="text-2xl font-heading font-bold text-foreground">{myReports}</p>
              <p className="text-xs text-muted-foreground">Minhas Denúncias</p>
              {pendingCount > 0 && (
                <span className="mt-2 inline-block rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold text-warning-foreground">
                  {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
                </span>
              )}
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/map")}
              className="cursor-pointer rounded-xl bg-card p-4 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <MapPin className="h-6 w-6 text-destructive mb-2" />
              <p className="text-2xl font-heading font-bold text-foreground">Mapa</p>
              <p className="text-xs text-muted-foreground">Mapa de Calor da Região</p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CitizenDashboard;
