import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, LogOut, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminSession } from "@/hooks/useAdminSession";
import { LoginForm } from "@/components/admin/LoginForm";
import { PasswordDialog } from "@/components/admin/PasswordDialog";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { status, email } = useAdminSession();
  const [trocandoSenha, setTrocandoSenha] = useState(false);

  // O painel não deve aparecer no Google.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const tituloAnterior = document.title;
    document.title = "Painel | Victor Andrade";
    return () => {
      meta.remove();
      document.title = tituloAnterior;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground" role="status">
        Carregando...
      </div>
    );
  }

  if (status === "signedOut") return <LoginForm />;

  if (status === "notAdmin") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm bg-surface rounded-3xl shadow-card p-8 text-center space-y-4">
          <h1 className="text-xl font-bold">Sem acesso ao painel</h1>
          <p className="text-sm text-muted-foreground">
            A conta {email} não é administradora. Peça para liberarem o acesso ou entre com outra conta.
          </p>
          <Button className="rounded-full" onClick={() => supabase.auth.signOut()}>
            Sair
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="container flex items-center justify-between gap-3 h-16">
          <div className="min-w-0">
            <p className="font-bold leading-none">Painel da loja</p>
            <p className="text-xs text-muted-foreground truncate mt-1">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/">
                <Store className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Ver loja</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setTrocandoSenha(true)}>
              <KeyRound className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Trocar senha</span>
            </Button>
            <Button size="sm" className="rounded-full" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Produtos</h1>
        <p className="text-muted-foreground mb-6">
          Edite preços, capacidades e cores. O que você salvar aparece na loja na hora.
        </p>
        <ProductList />
      </main>

      <PasswordDialog open={trocandoSenha} onClose={() => setTrocandoSenha(false)} />
    </div>
  );
};

export default Admin;
