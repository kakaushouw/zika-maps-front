import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Shield, X, MapPin, Calendar,
  ChevronDown, Activity, Filter, RefreshCw, Eye, CheckCircle,
  AlertTriangle, ShieldCheck, CheckCircle2, Trash2, Map, ShieldAlert
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BrandLogo } from "@/components/BrandLogo";
import StatusBadge from "@/components/StatusBadge";
import { useReports, updateReportStatus, startReportsSync, signOut, useAuth, Report, ReportStatus } from "@/lib/store";

// Map component using Leaflet
const ReportMap = ({ lat, lng, address }: { lat: number; lng: number; address?: string }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // Custom red marker for dengue focus
      const customIcon = L.divIcon({
        html: `<div style="
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(239,68,68,0.5);
        "></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([lat, lng], { icon: customIcon })
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

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
};

// Status dropdown for agent
const statusOptions: { value: ReportStatus; label: string; color: string; icon: any }[] = [
  { value: "confirmed", label: "Validar Foco", color: "text-emerald-600", icon: ShieldCheck },
  { value: "resolved", label: "Registrar Ação", color: "text-blue-600", icon: CheckCircle2 },
  { value: "discarded", label: "Descartar", color: "text-red-500", icon: Trash2 },
  { value: "pending", label: "Marcar Pendente", color: "text-amber-600", icon: AlertTriangle },
];

const StatusDropdown = ({ report, onClose }: { report: Report; onClose: () => void }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (status: ReportStatus) => {
    setLoading(status);
    try {
      await updateReportStatus(report.id, status);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 z-30 min-w-[200px] rounded-2xl overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 16px 36px -8px rgba(0,0,0,0.08), 0 4px 12px -4px rgba(0,0,0,0.04)"
      }}
    >
      <div className="p-2 space-y-1">
        {statusOptions.filter(o => o.value !== report.status).map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={(e) => { e.stopPropagation(); handleStatusChange(opt.value); }}
              disabled={loading === opt.value}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold transition-all hover:bg-slate-50 ${opt.color}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {loading === opt.value ? "Atualizando..." : opt.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

// Stats card
const StatCard = ({
  label,
  value,
  icon: IconComponent,
  iconColor,
  iconBg,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
}) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.08)" }}
    transition={{ duration: 0.2 }}
    className="relative rounded-2xl p-5 bg-white border border-slate-100 flex items-center justify-between"
    style={{
      boxShadow: "0 4px 18px -4px rgba(0, 0, 0, 0.04)",
    }}
  >
    <div className="space-y-1">
      <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800 font-heading leading-none">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-inner`}>
      <IconComponent className="h-6 w-6 stroke-[2.2]" />
    </div>
  </motion.div>
);

const AgentDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const reports = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const confirmedCount = reports.filter((r) => r.status === "confirmed").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;
  const discardedCount = reports.filter((r) => r.status === "discarded").length;

  const filteredAllReports = filterStatus === "all"
    ? reports.filter(r => r.status !== "pending")
    : reports.filter(r => r.status === filterStatus);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const cleanup = startReportsSync();
    return cleanup;
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handle = () => setOpenDropdownId(null);
    if (openDropdownId) document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [openDropdownId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const getFilterCount = (status: ReportStatus | "all") => {
    if (status === "all") return reports.filter(r => r.status !== "pending").length;
    return reports.filter(r => r.status === status).length;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div
          className="sticky top-0 z-20 px-6 py-5"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #f1f5f9"
          }}
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <BrandLogo size="xs" className="rounded-lg bg-white/80 p-0.5" />
              <div>
                <h1 className="font-heading text-base font-extrabold text-slate-800 leading-none">Vigilância Sanitária</h1>
                <p className="text-xxs font-extrabold text-emerald-600 uppercase tracking-widest mt-1">Painel do Agente</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 text-slate-400 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={async () => { await signOut(); navigate("/login"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100 hover:border-red-100 bg-white hover:bg-red-50/50 text-slate-600 hover:text-red-600 shadow-sm"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-6 max-w-2xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Pendentes" value={pendingReports.length} icon={AlertTriangle} iconColor="text-amber-500" iconBg="bg-amber-50" />
            <StatCard label="Confirmados" value={confirmedCount} icon={ShieldCheck} iconColor="text-emerald-500" iconBg="bg-emerald-50" />
            <StatCard label="Resolvidos" value={resolvedCount} icon={CheckCircle2} iconColor="text-blue-500" iconBg="bg-blue-50" />
            <StatCard label="Descartados" value={discardedCount} icon={Trash2} iconColor="text-slate-500" iconBg="bg-slate-100" />
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
          >
            {[
              { key: "pending", label: "Pendentes", badge: pendingReports.length },
              { key: "all", label: "Todas", badge: reports.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "pending" | "all")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                style={
                  activeTab === tab.key
                    ? { background: "#ffffff", color: "#1e293b", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)" }
                    : { color: "#64748b" }
                }
              >
                {tab.label}
                <span
                  className="text-xs font-extrabold px-2 py-0.5 rounded-md transition-colors"
                  style={
                    activeTab === tab.key
                      ? { background: "#10b981", color: "#ffffff" }
                      : { background: "#e2e8f0", color: "#64748b" }
                  }
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Pending list */}
          <AnimatePresence mode="wait">
            {activeTab === "pending" && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                {pendingReports.length === 0 ? (
                  <div
                    className="text-center py-16 rounded-2xl bg-white border border-slate-100"
                    style={{ boxShadow: "0 4px 18px -4px rgba(0, 0, 0, 0.04)" }}
                  >
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500 opacity-80" />
                    <p className="text-sm text-slate-500 font-bold">Nenhuma denúncia pendente!</p>
                  </div>
                ) : (
                  pendingReports.map((report, i) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      index={i}
                      onView={() => setSelectedReport(report)}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                    />
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "all" && (
              <motion.div
                key="all"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-3"
              >
                {/* Filter bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {(["all", "pending", "confirmed", "resolved", "discarded"] as const).map((s) => {
                    const active = filterStatus === s;
                    const count = getFilterCount(s);
                    const label = s === "all" ? "Todos" : s === "pending" ? "Pendentes" : s === "confirmed" ? "Confirmados" : s === "resolved" ? "Resolvidos" : "Descartados";
                    
                    return (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border ${
                          active
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : "bg-white border-slate-100 text-slate-500 hover:text-slate-800 hover:border-slate-200"
                        }`}
                      >
                        {label}
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {filteredAllReports.length === 0 ? (
                  <div
                    className="text-center py-16 rounded-2xl bg-white border border-slate-100"
                    style={{ boxShadow: "0 4px 18px -4px rgba(0, 0, 0, 0.04)" }}
                  >
                    <Filter className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm text-slate-400 font-bold">Nenhuma denúncia encontrada.</p>
                  </div>
                ) : (
                  filteredAllReports.map((report, i) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      index={i}
                      onView={() => setSelectedReport(report)}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center px-4"
              style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }}
              onClick={() => setSelectedReport(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-t-3xl md:rounded-2xl overflow-hidden md:mb-8"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 24px 60px -15px rgba(0,0,0,0.15)"
                }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.2)" }} />
                </div>

                <div className="px-5 pb-8 space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <h3 className="font-heading text-base font-bold text-foreground">Detalhes da Denúncia</h3>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-muted"
                      style={{ border: "1px solid hsl(var(--border))" }}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedReport.status} />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{selectedReport.date}
                    </span>
                  </div>

                  {/* Description */}
                  <div
                    className="rounded-2xl p-4 bg-muted/40 border border-border"
                  >
                    <p className="text-sm text-foreground/90 leading-relaxed">{selectedReport.description}</p>
                  </div>

                  {/* Address */}
                  {selectedReport.address && (
                    <div
                      className="rounded-2xl p-4 flex items-start gap-3 bg-muted/40 border border-border"
                    >
                      <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-0.5">Endereço</p>
                        <p className="text-sm text-foreground/90">{selectedReport.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Coordinates */}
                  <div
                    className="rounded-2xl p-3 flex items-center gap-2 bg-muted/20 border border-border/60"
                  >
                    <Activity className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    <p className="text-xs text-muted-foreground font-mono">
                      {selectedReport.lat.toFixed(6)}, {selectedReport.lng.toFixed(6)}
                    </p>
                  </div>

                  {/* Real Map */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ height: "200px", border: "1px solid hsl(var(--border))" }}
                  >
                    <ReportMap lat={selectedReport.lat} lng={selectedReport.lng} address={selectedReport.address} />
                  </div>

                  {/* Image */}
                  {selectedReport.image_url && (
                    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                      <img src={selectedReport.image_url} alt="Foto do foco" className="w-full max-h-48 object-cover" />
                    </div>
                  )}

                  {/* Action button (single with dropdown) */}
                  <div className="relative">
                    <AgentActionDropdown report={selectedReport} onDone={() => setSelectedReport(null)} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

// Report card component
const ReportCard = ({
  report,
  index,
  onView,
  openDropdownId,
  setOpenDropdownId,
}: {
  report: Report;
  index: number;
  onView: () => void;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
}) => {
  const isOpen = openDropdownId === report.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.08)" }}
      className="rounded-2xl overflow-visible relative bg-white border border-slate-100 transition-all duration-300"
      style={{
        boxShadow: "0 4px 18px -4px rgba(0, 0, 0, 0.04)",
        zIndex: isOpen ? 40 : 10,
      }}
    >
      {/* Pending indicator */}
      {report.status === "pending" && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-2xl bg-amber-500"
        />
      )}

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{report.description}</p>
          <StatusBadge status={report.status} />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3.5 mt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
            {report.date}
          </span>
          {report.address ? (
            <span className="flex items-center gap-1.5 truncate max-w-[220px]" title={report.address}>
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2]" />
              <span className="truncate">{report.address}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-mono">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2]" />
              {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-3.5">
          <button
            onClick={onView}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-slate-400 stroke-[2]" />
            Ver no mapa
          </button>

          {/* Single action button with dropdown */}
          <div className="relative ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdownId(isOpen ? null : report.id);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all text-white shadow-sm hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              Alterar Status
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <StatusDropdown
                  report={report}
                  onClose={() => setOpenDropdownId(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Agent action dropdown inside modal
const AgentActionDropdown = ({ report, onDone }: { report: Report; onDone: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const actions = statusOptions.filter(o => o.value !== report.status);

  const handleAction = async (status: ReportStatus) => {
    setLoading(status);
    try {
      await updateReportStatus(report.id, status);
      onDone();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-extrabold text-sm transition-all text-white shadow-sm hover:shadow-md"
        style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
        }}
      >
        <Shield className="h-4 w-4 stroke-[2]" />
        Alterar Status da Denúncia
        <ChevronDown className={`h-4 w-4 transition-transform ml-auto ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "0 -10px 40px -10px rgba(0,0,0,0.12)"
            }}
          >
            {actions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAction(opt.value)}
                  disabled={!!loading}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-xs font-extrabold transition-all hover:bg-slate-50 ${opt.color}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {loading === opt.value ? "Atualizando..." : opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentDashboard;
