import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminStatus = "loading" | "signedOut" | "notAdmin" | "admin";

/**
 * Estado do login do painel. "admin" só quando existe sessão,
 * o 2FA está validado (se ativado) E o banco confirma (função is_admin).
 */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [mfaPendente, setMfaPendente] = useState<boolean>(false);

  useEffect(() => {
    let vivo = true;

    const checarSessaoEMFA = async () => {
      const { data } = await supabase.auth.getSession();
      if (!vivo) return;

      const sessaoAtual = data.session;
      setSession(sessaoAtual);

      if (sessaoAtual) {
        // Verificar se a conta exige 2FA e se ainda não foi verificado nesta sessão
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (vivo && aalData) {
          const pendente = aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2";
          setMfaPendente(pendente);
        }
      } else {
        setMfaPendente(false);
      }
    };

    checarSessaoEMFA();

    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => {
      setSession(nova);
      if (nova) {
        supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data: aalData }) => {
          if (vivo && aalData) {
            const pendente = aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2";
            setMfaPendente(pendente);
          }
        });
      } else {
        setMfaPendente(false);
      }
    });

    return () => {
      vivo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = session === undefined ? undefined : session?.user.id ?? null;

  useEffect(() => {
    if (userId === undefined || mfaPendente) return; // Aguarda a validação do 2FA antes de verificar a permissão de admin
    if (userId === null) {
      setIsAdmin(false);
      return;
    }
    let vivo = true;
    setIsAdmin(undefined);
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (vivo) setIsAdmin(!error && data === true);
    });
    return () => {
      vivo = false;
    };
  }, [userId, mfaPendente]);

  let status: AdminStatus;
  if (session === undefined) status = "loading";
  else if (session === null || mfaPendente) status = "signedOut"; // Força a permanência no LoginForm enquanto o 2FA estiver pendente
  else if (isAdmin === undefined) status = "loading";
  else status = isAdmin ? "admin" : "notAdmin";

  return { status, email: session?.user.email ?? "" };
}