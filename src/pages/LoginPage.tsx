import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { signIn, signUp, getUserRole } from "@/lib/store";
import logo from "@/assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"citizen" | "agent">("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, role);
      }

      const userRole = await getUserRole();
      navigate(userRole === "agent" ? "/agent" : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro na autenticação.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("O login social com Google está configurado para o ambiente de produção. Para desenvolvimento local, utilize e-mail e senha.");
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-6 relative overflow-hidden">
        {/* Glow circles for modern mesh background */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 p-8 shadow-2xl relative z-10"
        >
          <div className="mb-6 flex flex-col items-center">
            <motion.img
              src={logo}
              alt="ZIKA-MAPS"
              className="w-40 h-40 object-contain drop-shadow-md"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
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
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 bg-white/70 border-muted focus-visible:ring-primary focus-visible:border-primary rounded-xl h-11"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-10 bg-white/70 border-muted focus-visible:ring-primary focus-visible:border-primary rounded-xl h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex gap-2 p-1 bg-muted/60 rounded-xl border border-border/50"
              >
                <button
                  type="button"
                  onClick={() => setRole("citizen")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    role === "citizen"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Cidadão
                </button>
                <button
                  type="button"
                  onClick={() => setRole("agent")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    role === "agent"
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Agente
                </button>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold text-sm h-11 rounded-xl transition-all duration-300 hover:opacity-95 hover:scale-[1.01]"
              style={{
                background: "var(--gradient-hero)",
                boxShadow: "0 8px 20px -4px hsl(152 55% 38% / 0.3)"
              }}
            >
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full gap-2 border-border hover:bg-white/80 bg-white/40 h-11 rounded-xl text-sm font-bold text-foreground/80 hover:text-foreground transition-all"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.33v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.11z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google
            </Button>
          </div>

          <div className="mt-3 text-center">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-muted-foreground hover:text-accent transition-colors font-medium"
            >
              Esqueceu a senha?
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="font-bold text-accent hover:underline"
            >
              {isLogin ? "Criar Conta" : "Entrar"}
            </button>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
