import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { updatePassword } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    const isRecovery = hash.includes("type=recovery");

    if (!isRecovery) {
      setError("Link inválido ou expirado. Solicite uma nova recuperação de senha.");
      setValidating(false);
      return;
    }

    // Process the recovery hash so Supabase recognizes the session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setValidating(false);
      } else {
        // Try to exchange the code from the URL for a session
        supabase.auth.exchangeCodeForSession(hash).then(({ error }) => {
          if (error) {
            setError("Link inválido ou expirado. Solicite uma nova recuperação de senha.");
          }
          setValidating(false);
        });
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess("Senha redefinida com sucesso! Você será redirecionado para o login.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
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
            <img src={logo} alt="ZIKA-MAPS" className="w-48 h-48 object-contain" />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </button>

          <h2 className="text-xl font-bold text-foreground mb-2">Redefinir senha</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Digite sua nova senha abaixo.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2.5 text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-primary/10 border border-primary/30 px-4 py-2.5 text-sm text-primary"
            >
              {success}
            </motion.div>
          )}

          {validating ? (
            <div className="text-center py-8 text-muted-foreground">
              Verificando link...
            </div>
          ) : error && error.includes("inválido") ? null : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nova senha"
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-card"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5"
                style={{ boxShadow: "var(--shadow-button)" }}
              >
                {loading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ResetPasswordPage;
