import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminStatus = "loading" | "signedOut" | "notAdmin" | "admin";

/**
 * Estado do login do painel. "admin" só quando existe sessão E o banco
 * confirma (função is_admin) que este usuário está na tabela de admins.
 */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let vivo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (vivo) setSession(data.session);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => {
      setSession(nova); // só guarda o estado; nada de chamar o Supabase aqui dentro
    });
    return () => {
      vivo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = session === undefined ? undefined : session?.user.id ?? null;

  useEffect(() => {
    if (userId === undefined) return; // ainda carregando a sessão
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
  }, [userId]);

  let status: AdminStatus;
  if (session === undefined) status = "loading";
  else if (session === null) status = "signedOut";
  else if (isAdmin === undefined) status = "loading";
  else status = isAdmin ? "admin" : "notAdmin";

  return { status, email: session?.user.email ?? "" };
}
