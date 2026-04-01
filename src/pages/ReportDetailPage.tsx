import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useReports } from "@/lib/store";

const ReportDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reports = useReports();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Denúncia não encontrada.</p>
            <Button onClick={() => navigate("/tracking")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center gap-3 px-5 py-4 bg-card border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => navigate("/tracking")} className="text-destructive hover:bg-destructive/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-heading text-lg font-bold text-foreground">Detalhes da Denúncia</h1>
        </div>

        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={report.status} />
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {report.date}
            </span>
          </div>

          {/* Photo */}
          {report.imageUrl ? (
            <div className="rounded-xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <img src={report.imageUrl} alt="Foto do foco" className="w-full max-h-72 object-cover" />
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center gap-2">
              <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              <span className="text-sm text-muted-foreground">Nenhuma foto anexada</span>
            </div>
          )}

          {/* Description */}
          <div className="rounded-xl bg-card p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-sm font-semibold text-foreground mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          {/* Address */}
          {report.address && (
            <div className="rounded-xl bg-card p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Endereço
              </h2>
              <p className="text-sm text-muted-foreground">{report.address}</p>
            </div>
          )}

          {/* Coordinates */}
          <div className="rounded-xl bg-card p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-sm font-semibold text-foreground mb-2">Coordenadas</h2>
            <p className="text-sm text-muted-foreground">
              Lat: {report.lat.toFixed(6)}, Lng: {report.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportDetailPage;
