import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { resetPassword } from "@/lib/store";
import { BrandLogo } from "@/components/BrandLogo";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Digite seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess("Enviamos um link de recuperação para seu e-mail. Verifique sua caixa de entrada.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Erro ao enviar e-mail de recuperação.");
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
            <BrandLogo size="lg" />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </button>

          <h2 className="text-xl font-bold text-foreground mb-2">Recuperar senha</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-5"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
