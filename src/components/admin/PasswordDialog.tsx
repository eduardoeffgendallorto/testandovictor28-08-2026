import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { mensagemDeErro } from "@/data/adminForm";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const PasswordDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [nova, setNova] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const fechar = () => {
    setNova("");
    setConfirma("");
    setErro("");
    onClose();
  };

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    if (nova.length < 8) return setErro("Use pelo menos 8 caracteres (o ideal são 10 ou mais).");
    if (nova !== confirma) return setErro("As duas senhas não são iguais.");
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: nova });
    setSalvando(false);
    if (error) return setErro(mensagemDeErro(error));
    toast({ title: "Senha alterada" });
    fechar();
  };

  return (
    <Dialog open={open} onOpenChange={(aberto) => !aberto && fechar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Trocar senha</DialogTitle>
          <DialogDescription>Escolha uma senha que você não use em outros lugares.</DialogDescription>
        </DialogHeader>
        <form onSubmit={salvar} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nova-senha">Nova senha</Label>
            <Input id="nova-senha" type="password" autoComplete="new-password" value={nova} onChange={(e) => setNova(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirma-senha">Repita a nova senha</Label>
            <Input id="confirma-senha" type="password" autoComplete="new-password" value={confirma} onChange={(e) => setConfirma(e.target.value)} />
          </div>
          {erro && (
            <p role="alert" className="text-sm text-destructive">
              {erro}
            </p>
          )}
          <Button type="submit" className="w-full rounded-full" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
