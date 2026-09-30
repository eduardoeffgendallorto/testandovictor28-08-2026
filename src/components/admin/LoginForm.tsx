import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { mensagemDeErro } from "@/data/adminForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setCarregando(false);
    if (error) setErro(mensagemDeErro(error));
    // Se deu certo, useAdminSession percebe a sessão e troca a tela sozinho.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={entrar} className="w-full max-w-sm bg-surface rounded-3xl shadow-card p-8 space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel da loja</h1>
          <p className="text-sm text-muted-foreground mt-1">Entre para editar preços e produtos.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">E-mail</Label>
          <Input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-senha">Senha</Label>
          <Input
            id="admin-senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && (
          <p role="alert" className="text-sm text-destructive">
            {erro}
          </p>
        )}

        <Button type="submit" className="w-full rounded-full" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};
