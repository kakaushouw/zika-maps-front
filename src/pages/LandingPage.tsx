import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, MapPin, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import logo from "@/assets/logo.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 overflow-hidden relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/80" />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
          {/* Logo */}
          <motion.img
            src={logo}
            alt="ZIKA-MAPS"
            className="w-56 h-56 mb-6 object-contain mix-blend-multiply"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          {/* Title */}
          <motion.h1
            className="text-2xl md:text-3xl font-heading font-extrabold text-foreground text-center leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-gradient">Zika-Maps</span>: A Inteligência que Antecipa Surtos.
          </motion.h1>

          {/* Intro paragraph */}
          <motion.p
            className="mt-5 text-sm md:text-base text-muted-foreground text-center leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            O Zika-Maps transforma dados em escudo. Somos uma plataforma de monitoramento inteligente de arbovírus que utiliza geoprocessamento para identificar áreas de risco e prever a circulação de{" "}
            <strong className="text-foreground">Zika, Dengue e Chikungunya</strong> em tempo real.
          </motion.p>

          {/* Show More button */}
          <AnimatePresence>
            {!showMore && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="mt-4"
              >
                <button
                  onClick={() => setShowMore(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                >
                  Mostrar mais
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded content */}
          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full overflow-hidden"
              >
                <div className="mt-6 space-y-4">
                  {[
                    { icon: MapPin, title: "Mapeamento de Precisão", desc: "Localize focos com exatidão." },
                    { icon: Brain, title: "Análise Preditiva", desc: "Antecipe-se ao vetor com IA." },
                    { icon: Target, title: "Ação Estratégica", desc: "Dados prontos para a tomada de decisão." },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.4 }}
                      className="flex items-start gap-3 rounded-xl bg-card border border-border p-4"
                      style={{ boxShadow: "var(--shadow-card)" }}
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm text-muted-foreground text-center italic pt-2"
                  >
                    Ciência e tecnologia unidas para proteger cidades e salvar vidas.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <motion.div
            className="mt-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5 gap-2"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              Começar agora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LandingPage;
