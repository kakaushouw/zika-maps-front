import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import logo from "@/assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    // Demo: agent login
    if (email.includes("agente")) {
      navigate("/agent");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex flex-col items-center">
            <img src={logo} alt="ZIKA-MAPS" width={120} height={120} className="mb-4" />
            <h1 className="text-2xl font-heading font-extrabold text-foreground">ZIKA-MAPS</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitoramento inteligente de focos</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="E-mail ou Telefone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-card"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5" style={{ boxShadow: "var(--shadow-button)" }}>
              {isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-semibold text-accent hover:underline"
            >
              {isLogin ? "Criar Conta" : "Entrar"}
            </button>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground/60">
            Demo: use "agente@..." para login de agente
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
