import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Camera, WifiOff, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageTransition from "@/components/PageTransition";
import { addReport } from "@/lib/store";

const ReportPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [gpsStatus, setGpsStatus] = useState<"loading" | "done" | "error">("loading");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setGpsStatus("done"), 2000);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleImagePick = () => {
    // Simulate image pick
    setImagePreview("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LXNpemU9IjE0Ij7wn5OxIEZvdG8gYW5leGFkYTwvdGV4dD48L3N2Zz4=");
  };

  const handleSubmit = () => {
    addReport({
      description: description || "Foco registrado via app",
      lat: -23.55 + Math.random() * 0.02 - 0.01,
      lng: -46.63 + Math.random() * 0.02 - 0.01,
      imageUrl: imagePreview || undefined,
    });
    navigate("/tracking");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center px-5 py-4 bg-card border-b border-border">
          <h1 className="font-heading text-lg font-bold text-foreground">Registrar Foco</h1>
        </div>

        {/* Offline Warning */}
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mx-5 mt-4 flex items-center gap-2 rounded-lg bg-warning/15 border border-warning/30 px-4 py-3 text-sm text-warning-foreground"
          >
            <WifiOff className="h-4 w-4 shrink-0" />
            <span>Você está offline. O registro será salvo no aparelho e enviado depois.</span>
          </motion.div>
        )}

        <div className="flex-1 px-5 py-6 space-y-6">
          {/* GPS Status */}
          <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className={`rounded-full p-2 ${gpsStatus === "done" ? "bg-primary/10" : "bg-muted"}`}>
              <MapPin className={`h-5 w-5 ${gpsStatus === "done" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {gpsStatus === "loading" ? "Obtendo localização..." : "Localização obtida ✓"}
              </p>
              <p className="text-xs text-muted-foreground">
                {gpsStatus === "loading" ? "Aguarde o GPS" : "Lat: -23.5505, Lng: -46.6333"}
              </p>
            </div>
            {gpsStatus === "loading" && (
              <div className="ml-auto h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            )}
          </div>

          {/* Photo */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Foto do Foco</label>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleImagePick}
              className="w-full rounded-xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-32" />
              ) : (
                <>
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tirar Foto ou Anexar Imagem</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Descrição (opcional)</label>
            <Textarea
              placeholder="Breve descrição do local..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-card resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-5 py-4 bg-card border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={gpsStatus === "loading"}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            style={{ boxShadow: "var(--shadow-button)" }}
          >
            <Send className="h-4 w-4 mr-1" />
            Confirmar Envio
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportPage;
