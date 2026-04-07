import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Camera, WifiOff, ArrowLeft, Send, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { addReport } from "@/lib/store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ReportPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [gpsStatus, setGpsStatus] = useState<"loading" | "done" | "error">("loading");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useAddress, setUseAddress] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerCoords, setMapPickerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const c = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCoords(c);
          setGpsStatus("done");
          reverseGeocode(c.lat, c.lng);
        },
        () => {
          setCoords({ lat: -3.119, lng: -60.0217 });
          setGpsStatus("done");
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } else {
      setCoords({ lat: -3.119, lng: -60.0217 });
      setGpsStatus("done");
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initialize map picker
  useEffect(() => {
    if (!showMapPicker || !mapRef.current) return;
    if (leafletMapRef.current) return;

    const center = coords || { lat: -3.119, lng: -60.0217 };
    const map = L.map(mapRef.current).setView([center.lat, center.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OSM",
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:hsl(152,55%,38%);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><div style="width:10px;height:10px;background:white;border-radius:50%;transform:rotate(45deg)"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([center.lat, center.lng], { icon: pinIcon, draggable: true }).addTo(map);
    markerRef.current = marker;
    setMapPickerCoords(center);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setMapPickerCoords({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setMapPickerCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    leafletMapRef.current = map;

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markerRef.current = null;
    };
  }, [showMapPicker]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { "Accept-Language": "pt-BR" } }
      );
      const data = await res.json();
      if (data.display_name) {
        setAddress(data.display_name.split(",").slice(0, 3).join(",").trim());
      }
    } catch { /* silent */ }
  };

  const searchAddresses = (query: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const fullQuery = query.includes("Manaus") ? query : `${query}, Manaus, AM, Brasil`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=5&countrycodes=br`,
          { headers: { "Accept-Language": "pt-BR" } }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 400);
  };

  const selectSuggestion = (suggestion: { display_name: string; lat: string; lon: string }) => {
    const shortName = suggestion.display_name.split(",").slice(0, 3).join(",").trim();
    setAddress(shortName);
    setCoords({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setGpsStatus("done");
    setUseAddress(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const confirmMapPicker = async () => {
    if (mapPickerCoords) {
      setCoords(mapPickerCoords);
      setGpsStatus("done");
      setUseAddress(true);
      await reverseGeocode(mapPickerCoords.lat, mapPickerCoords.lng);
    }
    setShowMapPicker(false);
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    addReport({
      description: description || "Foco registrado via app",
      address: address || undefined,
      lat: coords?.lat ?? -3.119,
      lng: coords?.lng ?? -60.0217,
      imageUrl: imagePreview || undefined,
    });
    navigate("/tracking");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {/* Header */}
        <div className="flex items-center px-5 py-4 bg-card border-b border-border">
          <h1 className="font-heading text-lg font-bold text-foreground">Registrar Foco</h1>
        </div>

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

        <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto">
          {/* GPS Status */}
          <div className="flex items-center gap-3 rounded-xl bg-card p-4 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className={`rounded-full p-2 ${gpsStatus === "done" ? "bg-primary/10" : gpsStatus === "error" ? "bg-destructive/10" : "bg-muted"}`}>
              <Navigation className={`h-5 w-5 ${gpsStatus === "done" ? "text-primary" : gpsStatus === "error" ? "text-destructive" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {gpsStatus === "loading" ? "Obtendo localização..." : gpsStatus === "error" ? "Erro no GPS" : "Localização obtida ✓"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {gpsStatus === "loading" ? "Aguarde o GPS" : coords ? `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}` : "Usando localização padrão"}
              </p>
            </div>
            {gpsStatus === "loading" && <div className="ml-auto h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
          </div>

          {/* Address */}
          <div className="relative">
            <label className="text-sm font-semibold text-foreground mb-2 block">
              <MapPin className="h-4 w-4 inline mr-1" />
              Endereço do Foco
            </label>
            <Input
              placeholder="Ex: Rua das Flores, 120 - Centro"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setUseAddress(true);
                searchAddresses(e.target.value);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="bg-card"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Digite para buscar ou marque no mapa abaixo
            </p>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-[calc(100%-1.25rem)] left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/10 border-b border-border last:border-b-0 transition-colors"
                  >
                    <MapPin className="h-3 w-3 inline mr-2 text-primary" />
                    {s.display_name.split(",").slice(0, 4).join(",").trim()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Picker Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMapPicker(true)}
            className="w-full border-primary/40 text-primary hover:bg-primary/10 font-semibold gap-2"
          >
            <MapPin className="h-4 w-4" />
            Marcar localização no mapa
          </Button>

          {/* Map Picker Modal */}
          {showMapPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 bg-card border-b border-border">
                <h2 className="font-heading text-base font-bold text-foreground">Toque no mapa para marcar</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMapPicker(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div ref={mapRef} className="flex-1" />
              {mapPickerCoords && (
                <div className="px-5 py-2 bg-card border-t border-border text-xs text-muted-foreground text-center">
                  Lat: {mapPickerCoords.lat.toFixed(6)}, Lng: {mapPickerCoords.lng.toFixed(6)}
                </div>
              )}
              <div className="px-5 py-4 bg-card border-t border-border">
                <Button onClick={confirmMapPicker} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" style={{ boxShadow: "var(--shadow-button)" }}>
                  Confirmar localização
                </Button>
              </div>
            </motion.div>
          )}

          {/* Photo */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Foto do Foco</label>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleImagePick}
              className="w-full rounded-xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="rounded-lg max-h-40 object-cover" />
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
              maxLength={500}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 bg-card border-t border-border">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 border-destructive text-destructive hover:bg-destructive/10 font-semibold">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <Button onClick={handleSubmit} disabled={gpsStatus === "loading"} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" style={{ boxShadow: "var(--shadow-button)" }}>
            <Send className="h-4 w-4 mr-1" />
            Confirmar Envio
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ReportPage;
