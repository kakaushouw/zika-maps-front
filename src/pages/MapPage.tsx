import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useReports } from "@/lib/store";

const heatColors = ["#FDE68A", "#FDBA74", "#F87171", "#DC2626"];

const MapPage = () => {
  const navigate = useNavigate();
  const reports = useReports();

  return (
    <PageTransition>
      <div className="min-h-screen bg-muted relative">
        {/* Simulated Map */}
        <div className="h-screen w-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(200,30%,92%) 0%, hsl(200,20%,85%) 100%)" }}>
          {/* Grid lines to simulate map */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="100%" y2={i * 50} stroke="hsl(200,20%,60%)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="100%" stroke="hsl(200,20%,60%)" strokeWidth="0.5" />
            ))}
          </svg>

          {/* Heatmap blobs */}
          {reports.map((report, i) => {
            const x = 20 + ((report.lng + 46.65) * 3000) % 60;
            const y = 20 + ((report.lat + 23.57) * 3000) % 60;
            return (
              <motion.div
                key={report.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="absolute rounded-full"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: "120px",
                  height: "120px",
                  background: `radial-gradient(circle, ${heatColors[i % heatColors.length]}AA 0%, transparent 70%)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}

          {/* Pins */}
          {reports.map((report, i) => {
            const x = 20 + ((report.lng + 46.65) * 3000) % 60;
            const y = 20 + ((report.lat + 23.57) * 3000) % 60;
            const pinColor = report.status === "confirmed" ? "hsl(152,55%,38%)" :
              report.status === "pending" ? "hsl(45,90%,55%)" :
              report.status === "resolved" ? "hsl(200,60%,50%)" : "hsl(210,10%,65%)";
            return (
              <motion.div
                key={`pin-${report.id}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="absolute flex flex-col items-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)" }}
              >
                <div className="rounded-full p-1 shadow-lg" style={{ backgroundColor: pinColor }}>
                  <div className="h-3 w-3 rounded-full bg-card" />
                </div>
                <div className="h-2 w-0.5" style={{ backgroundColor: pinColor }} />
              </motion.div>
            );
          })}

          {/* Map Label */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-muted-foreground border border-border">
            Mapa interativo simulado • {reports.length} focos registrados
          </div>
        </div>

        {/* Floating back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <Button
            onClick={() => navigate(-1)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-lg px-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default MapPage;
