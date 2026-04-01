import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useReports } from "@/lib/store";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const MapPage = () => {
  const navigate = useNavigate();
  const reports = useReports();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Center on Manaus
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([-3.119, -60.0217], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers and heatmap when reports change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Add heatmap
    const heatData: [number, number, number][] = reports.map((r) => [r.lat, r.lng, 0.8]);
    if (heatData.length > 0) {
      const { heatLayer } = require("leaflet.heat") as typeof import("leaflet.heat");
      const heat = heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 15,
        gradient: {
          0.2: "#FDE68A",
          0.4: "#FDBA74",
          0.6: "#F87171",
          1.0: "#DC2626",
        },
      });
      heat.addTo(map);
    }

    // Add pins
    reports.forEach((report) => {
      const color =
        report.status === "confirmed"
          ? "#2F9E6E"
          : report.status === "pending"
          ? "#EAB308"
          : report.status === "resolved"
          ? "#3B82F6"
          : "#9CA3AF";

      const icon = L.divIcon({
        className: "custom-pin",
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([report.lat, report.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-size:13px"><strong>${report.description}</strong><br/><span style="color:${color};font-weight:600;text-transform:capitalize">${report.status}</span></div>`
        );
    });
  }, [reports]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-muted relative">
        <div ref={mapRef} className="h-screen w-full" />

        {/* Map Label */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-muted-foreground border border-border z-[1000]">
          Manaus • {reports.length} focos registrados
        </div>

        {/* Floating back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]"
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
