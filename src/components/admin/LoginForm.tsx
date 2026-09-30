import { useState, useRef, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { supabase } from "@/lib/supabase";
import { mensagemDeErro } from "@/data/adminForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const MAX_TENTATIVAS = 5;

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Estado para a verificação em 2 etapas (MFA / 2FA)
  const [factorId, setFactorId] = useState<string | null>(null);
  const [codigoMfa, setCodigoMfa] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  
  // Controlo do limite de tentativas
  const [tentativas, setTentativas] = useState(0);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const estaBloqueado = tentativas >= MAX_TENTATIVAS;

  // Etapa 1: Validação de Email, Senha e CAPTCHA
  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (estaBloqueado) {
      setErro("Número máximo de tentativas excedido. Aguarde alguns minutos.");
      return;
    }

    if (!captchaToken) {
      setErro("Por favor, conclua a verificação de segurança (CAPTCHA).");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
      options: {
        captchaToken,
      },
    });

    if (error) {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);
      setCarregando(false);
      turnstileRef.current?.reset();
      setCaptchaToken(null);

      if (novasTentativas >= MAX_TENTATIVAS) {
        setErro("Demasiadas tentativas falhadas. O acesso foi bloqueado temporariamente.");
      } else {
        const restantes = MAX_TENTATIVAS - novasTentativas;
        setErro(`${mensagemDeErro(error)} (Restam ${restantes} tentativa(s))`);
      }
      return;
    }

    // Verificar se o utilizador possui o 2FA (TOTP) ativado
    const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors();

    if (mfaError) {
      setCarregando(false);
      setErro(mensagemDeErro(mfaError));
      return;
    }

    const totpFactor = factors.totp.find((f) => f.status === "verified");

    if (totpFactor) {
      // Exige o código do autenticador de 6 dígitos
      setFactorId(totpFactor.id);
      setCarregando(false);
    } else {
      // Sucesso total no login sem 2FA
      setTentativas(0);
      setCarregando(false);
    }
  };

  // Etapa 2: Validação do Código 2FA
  const verificar2FA = async (e: FormEvent) => {
    e.preventDefault();
    if (!factorId) return;

    if (estaBloqueado) {
      setErro("Número máximo de tentativas excedido. Aguarde alguns minutos.");
      return;
    }

    setErro("");
    setCarregando(true);

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      setCarregando(false);
      setErro(mensagemDeErro(challengeError));
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: codigoMfa.trim(),
    });

    setCarregando(false);

    if (verifyError) {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);

      if (novasTentativas >= MAX_TENTATIVAS) {
        setErro("Demasiadas tentativas falhadas. O acesso foi bloqueado temporariamente.");
      } else {
        const restantes = MAX_TENTATIVAS - novasTentativas;
        setErro(`Código de verificação inválido ou expirado. (Restam ${restantes} tentativa(s))`);
      }
      return;
    }

    // Sucesso total no 2FA
    setTentativas(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-surface rounded-3xl shadow-card p-8 space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel da loja</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {factorId
              ? "Introduza o código de 6 dígitos da sua app de autenticação."
              : "Entre para gerir produtos e preços."}
          </p>
        </div>

        {!factorId ? (
          <form onSubmit={entrar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">E-mail</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                disabled={estaBloqueado || carregando}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-senha">Palavra-passe</Label>
              <Input
                id="admin-senha"
                type="password"
                autoComplete="current-password"
                required
                disabled={estaBloqueado || carregando}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="flex justify-center py-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setErro("Erro ao carregar o CAPTCHA.")}
              />
            </div>

            {erro && (
              <p role="alert" className="text-sm text-destructive">
                {erro}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={carregando || !captchaToken || estaBloqueado}
            >
              {carregando
                ? "A verificar..."
                : estaBloqueado
                ? "Bloqueado temporariamente"
                : "Entrar"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verificar2FA} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-mfa">Código de Autenticação (2FA)</Label>
              <Input
                id="admin-mfa"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                className="text-center tracking-widest text-lg font-mono"
                required
                autoFocus
                disabled={estaBloqueado || carregando}
                value={codigoMfa}
                onChange={(e) => setCodigoMfa(e.target.value)}
              />
            </div>

            {erro && (
              <p role="alert" className="text-sm text-destructive">
                {erro}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={carregando || codigoMfa.length < 6 || estaBloqueado}
            >
              {carregando
                ? "A validar código..."
                : estaBloqueado
                ? "Bloqueado temporariamente"
                : "Verificar e Entrar"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full rounded-full text-xs"
              onClick={() => {
                setFactorId(null);
                setCodigoMfa("");
                setErro("");
                supabase.auth.signOut();
              }}
            >
              Voltar ao login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};