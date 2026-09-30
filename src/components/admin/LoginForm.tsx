import { useState, useRef, FormEvent } from "react";
import { supabase } from "@/lib/supabase"; // Ajusta o caminho se necessário
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para o controlo de tentativas
  const [tentativas, setTentativas] = useState(0);
  const MAX_TENTATIVAS = 5;

  // Ref para podermos reiniciar o Turnstile programmaticamente
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Verifica se já atingiu o limite de tentativas
    if (tentativas >= MAX_TENTATIVAS) {
      setErrorMsg("Número máximo de tentativas excedido. Aguarda alguns minutos.");
      return;
    }

    // 2. Verifica se o CAPTCHA foi concluído
    if (!captchaToken) {
      setErrorMsg("Por favor, completa a verificação do CAPTCHA.");
      return;
    }

    setLoading(true);

    // 3. Tenta efetuar o login com o Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    });

    setLoading(false);

    if (error) {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);

      // Limpa o token e faz reset ao widget Turnstile para exigir nova validação
      setCaptchaToken(null);
      turnstileRef.current?.reset();

      if (novasTentativas >= MAX_TENTATIVAS) {
        setErrorMsg("Demasiadas tentativas falhadas. O acesso foi bloqueado temporariamente.");
      } else {
        const restantes = MAX_TENTATIVAS - novasTentativas;
        setErrorMsg(`Credenciais incorretas. Restam ${restantes} tentativa(s).`);
      }
      return;
    }

    // 4. Sucesso: reseta o contador de tentativas
    setTentativas(0);
    // Seguir com o fluxo de login / 2FA...
  };

  const estaBloqueado = tentativas >= MAX_TENTATIVAS;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={estaBloqueado || loading}
          required
          className="w-full p-2 border rounded-md disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Palavra-passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={estaBloqueado || loading}
          required
          className="w-full p-2 border rounded-md disabled:bg-gray-100"
        />
      </div>

      <div className="flex justify-center my-4">
        <Turnstile
          ref={turnstileRef}
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setCaptchaToken(token)}
          onError={() => setCaptchaToken(null)}
          onExpire={() => setCaptchaToken(null)}
        />
      </div>

      <button
        type="submit"
        disabled={estaBloqueado || loading || !captchaToken}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading
          ? "A entrar..."
          : estaBloqueado
          ? "Bloqueado temporariamente"
          : "Entrar"}
      </button>
    </form>
  );
}