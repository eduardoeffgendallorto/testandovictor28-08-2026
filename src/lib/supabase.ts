import { createClient } from "@supabase/supabase-js";

// URL do projeto e chave PÚBLICA (publishable). Podem ficar no código: quem
// protege os dados são as regras (RLS) do banco. NUNCA coloque aqui a chave
// "secret" / service_role. Para trocar de projeto sem mexer no código, defina
// VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (veja .env.example).
export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL ?? "https://kcvlwqchqwvlokeoqcxz.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_tAJgCwNx-uPJFeyJw-160g_JYS-A7Sc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
