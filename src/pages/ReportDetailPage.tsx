import { useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import StatusBadge from "@/components/StatusBadge";
import { useReports, useIsAgent } from "@/lib/store";

// Small embedded map component
const ReportMap = ({ lat, lng, address }: { lat: number; lng: number; address?: string }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="
          width:28px;height:28px;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid white;
          box-shadow:0 4px 10px rgba(239,68,68,0.5);
        "></div>`,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, address]);

  return <div ref={mapRef} className="w-full h-full" />;
};

const ReportDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const reports = useReports();
  const isAgent = useIsAgent();
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
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-card/85 backdrop-blur-md border-b border-border sticky top-0 z-10 w-full">
          <div className="max-w-lg mx-auto w-full flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/tracking")}
              className="text-muted-foreground hover:bg-muted rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-heading text-lg font-extrabold text-foreground">Detalhes da Denúncia</h1>
          </div>
        </div>

        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto max-w-lg mx-auto w-full">
          {/* Status + Date */}
          <div className="flex items-center justify-between">
            <StatusBadge status={report.status} />
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-card px-2.5 py-1 rounded-full border border-border shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              {report.date}
            </span>
          </div>

          {/* Photo */}
          {report.image_url ? (
            <div
              className="rounded-2xl overflow-hidden border border-border bg-card p-1 shadow-md"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={report.image_url}
                alt="Foto do foco"
                className="w-full max-h-72 object-cover rounded-xl"
              />
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center gap-2" style={{ boxShadow: "var(--shadow-card)" }}>
              <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
              <span className="text-sm font-semibold text-muted-foreground">Nenhuma foto anexada</span>
            </div>
          )}

          {/* Description */}
          <div
            className="rounded-2xl bg-card p-5 border border-border"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h2 className="text-sm font-extrabold text-foreground mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          {/* Address — ONLY visible to agents */}
          {isAgent && report.address && (
            <div
              className="rounded-2xl bg-card p-5 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <h2 className="text-sm font-extrabold text-foreground mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                Endereço
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{report.address}</p>
            </div>
          )}

          {/* Coordinates — ONLY visible to agents */}
          {isAgent && (
            <div
              className="rounded-2xl bg-card p-5 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <h2 className="text-sm font-extrabold text-foreground mb-2 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-accent shrink-0" />
                Coordenadas
              </h2>
              <p className="text-sm text-muted-foreground font-mono">
                Lat: {report.lat.toFixed(6)}, Lng: {report.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Map — ONLY visible to agents */}
          {isAgent && (
            <div
              className="rounded-2xl overflow-hidden border border-border shadow-md"
              style={{ height: "220px" }}
            >
              <ReportMap lat={report.lat} lng={report.lng} address={report.address} />
            </div>
          )}

          {/* Status info for citizen */}
          {!isAgent && (
            <div
              className="rounded-2xl bg-card p-5 border border-border text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                📍 A localização exata só é visível para agentes de vigilância.<br />
                Acompanhe o status da sua denúncia acima.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportDetailPage;
