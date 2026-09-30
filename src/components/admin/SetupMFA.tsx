import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SetupMFA = () => {
  const [carregando, setCarregando] = useState(true);
  const [mfaAtivo, setMfaAtivo] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [codigoMfa, setCodigoMfa] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Verificar se o utilizador já possui o 2FA configurado
  const verificarStatusMFA = async () => {
    setCarregando(true);
    const { data: factors, error } = await supabase.auth.mfa.listFactors();

    if (error) {
      setErro("Erro ao verificar o estado da autenticação em 2 etapas.");
      setCarregando(false);
      return;
    }

    const totpAtivo = factors.totp.find((f) => f.status === "verified");
    if (totpAtivo) {
      setMfaAtivo(true);
      setFactorId(totpAtivo.id);
    } else {
      setMfaAtivo(false);
    }
    setCarregando(false);
  };

  useEffect(() => {
    verificarStatusMFA();
  }, []);

  // 1. Gerar o QR Code de registo
  const iniciarConfiguracao = async () => {
    setErro(null);
    setSucesso(null);
    setCarregando(true);

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      issuer: "VitaoCell Admin",
    });

    setCarregando(false);

    if (error) {
      setErro(`Erro ao gerar QR Code: ${error.message}`);
      return;
    }

    setFactorId(data.id);
    setQrCodeUrl(data.totp.qr_code);
  };

  // 2. Confirmar o primeiro código de 6 dígitos e ativar o 2FA
  const confirmarAtivacao = async () => {
    if (!factorId) return;

    setErro(null);
    setCarregando(true);

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeError) {
      setErro(`Erro ao criar desafio de validação: ${challengeError.message}`);
      setCarregando(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: codigoMfa.trim(),
    });

    setCarregando(false);

    if (verifyError) {
      setErro("Código inválido. Confirma os 6 dígitos na tua app de autenticação.");
      return;
    }

    setSucesso("Autenticação em 2 etapas (2FA) ativada com sucesso!");
    setMfaAtivo(true);
    setQrCodeUrl(null);
    setCodigoMfa("");
  };

  // 3. Desativar o 2FA
  const desativarMFA = async () => {
    if (!factorId) return;

    setErro(null);
    setCarregando(true);

    const { error } = await supabase.auth.mfa.unenroll({ factorId });

    setCarregando(false);

    if (error) {
      setErro(`Erro ao desativar 2FA: ${error.message}`);
      return;
    }

    setSucesso("Autenticação em 2 etapas desativada.");
    setMfaAtivo(false);
    setFactorId(null);
    setQrCodeUrl(null);
  };

  if (carregando && !qrCodeUrl && !mfaAtivo) {
    return <p className="text-sm text-muted-foreground">A carregar definições de segurança...</p>;
  }

  return (
    <div className="w-full max-w-md bg-surface rounded-3xl shadow-card p-6 space-y-6 border border-border">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Segurança - Autenticação 2FA</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Protege o acesso ao teu painel com a aplicação Google Authenticator, 1Password ou Authy.
        </p>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl font-medium">
          {sucesso}
        </p>
      )}

      {mfaAtivo ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm flex items-center justify-between">
            <span className="font-semibold">2FA Ativado</span>
            <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-1 rounded-full font-medium">
              Protegido
            </span>
          </div>

          <Button
            variant="destructive"
            onClick={desativarMFA}
            disabled={carregando}
            className="w-full rounded-full"
          >
            {carregando ? "A desativar..." : "Desativar 2FA"}
          </Button>
        </div>
      ) : !qrCodeUrl ? (
        <Button
          onClick={iniciarConfiguracao}
          disabled={carregando}
          className="w-full rounded-full"
        >
          {carregando ? "A gerar..." : "Ativar Autenticação em 2 Etapas"}
        </Button>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1. Digitaliza este QR Code na tua aplicação de autenticação:
            </p>

            <div className="flex justify-center p-4 bg-white rounded-2xl border border-border">
              <img src={qrCodeUrl} alt="QR Code 2FA" className="w-48 h-48" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mfa-verify-code">
              2. Introduz o código de 6 dígitos gerado na app:
            </Label>
            <Input
              id="mfa-verify-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              className="text-center tracking-widest text-lg font-mono"
              value={codigoMfa}
              onChange={(e) => setCodigoMfa(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setQrCodeUrl(null)}
              className="w-1/2 rounded-full text-xs"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarAtivacao}
              disabled={carregando || codigoMfa.length < 6}
              className="w-1/2 rounded-full"
            >
              {carregando ? "A validar..." : "Confirmar e Ativar"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};