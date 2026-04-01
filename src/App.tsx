import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import LoginPage from "./pages/LoginPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportPage from "./pages/ReportPage";
import MapPage from "./pages/MapPage";
import TrackingPage from "./pages/TrackingPage";
import ReportDetailPage from "./pages/ReportDetailPage";
import AgentDashboard from "./pages/AgentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/tracking/:id" element={<ReportDetailPage />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
