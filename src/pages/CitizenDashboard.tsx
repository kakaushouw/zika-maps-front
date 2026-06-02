import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, List, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { BrandLogo } from "@/components/BrandLogo";
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
          <BrandLogo size="sm" />
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

        <div className="px-5 py-6 space-y-6 max-w-lg mx-auto">
          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-extrabold text-foreground">Olá, Cidadão!</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Ajude a combater o mosquito na sua região.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold shadow-md">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : "U"}
            </div>
          </div>

          {/* Main CTA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => navigate("/report")}
              className="w-full py-8 text-lg font-extrabold rounded-xl transition-all duration-300"
              style={{
                background: "var(--gradient-hero)",
                color: "white",
                boxShadow: "0 10px 25px -5px hsl(152 55% 38% / 0.4)"
              }}
            >
              <Plus className="h-6 w-6 mr-2 shrink-0" />
              Registrar Novo Foco
            </Button>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/tracking")}
              className="cursor-pointer rounded-2xl bg-card p-5 border border-border transition-all duration-300"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 text-accent shadow-sm border border-blue-100/50">
                <List className="h-5 w-5" />
              </div>
              <p className="text-3xl font-heading font-extrabold text-foreground leading-tight">{myReports}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Minhas Denúncias</p>
              {pendingCount > 0 && (
                <span className="mt-2.5 inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xxs font-bold text-amber-700 border border-amber-200/50">
                  {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
                </span>
              )}
            </motion.div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/map")}
              className="cursor-pointer rounded-2xl bg-card p-5 border border-border transition-all duration-300"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3 text-destructive shadow-sm border border-red-100/50">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="text-3xl font-heading font-extrabold text-foreground leading-tight">Mapa</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Mapa de Calor</p>
            </motion.div>
          </div>

          {/* Prevention Tips */}
          <div className="rounded-2xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
              💡 Dicas de Prevenção
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Mantenha garrafas vazias viradas para baixo.</p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Tampe caixas d'água e recipientes que acumulam água.</p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p>Elimine pratinhos de vasos de plantas ou use areia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CitizenDashboard;
