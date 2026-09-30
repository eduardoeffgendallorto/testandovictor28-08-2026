import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { ADMIN_CATALOG_KEY, saveProduct } from "@/data/adminApi";
import { CATALOG_KEY } from "@/hooks/useCatalog";
import { sortOptions, type ProductRow } from "@/data/mapper";
import {
  CATEGORIAS,
  LIMITES,
  mensagemDeErro,
  rowToForm,
  validarForm,
  type FormProduto,
} from "@/data/adminForm";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Campo = ({ id, label, dica, children }: { id: string; label: string; dica?: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {dica && <p className="text-xs text-muted-foreground">{dica}</p>}
  </div>
);

export const ProductEditor = ({ row, onClose }: { row: ProductRow; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormProduto>(() => rowToForm(row, sortOptions(row.product_options)));
  const [erros, setErros] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);

  const set = <K extends keyof FormProduto>(campo: K, valor: FormProduto[K]) =>
    setForm((f) => ({ ...f, [campo]: valor }));

  const setOpcao = (i: number, campo: "opcao" | "preco", valor: string) =>
    setForm((f) => ({ ...f, opcoes: f.opcoes.map((o, j) => (j === i ? { ...o, [campo]: valor } : o)) }));

  const salvar = async () => {
    const r = validarForm(form);
    if ("erros" in r) return setErros(r.erros);
    setErros([]);
    setSalvando(true);
    try {
      await saveProduct(row.id, r.produto, r.opcoes);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEY }),
        queryClient.invalidateQueries({ queryKey: CATALOG_KEY }),
      ]);
      toast({ title: "Produto salvo", description: r.produto.nome });
      onClose();
    } catch (e) {
      setErros([mensagemDeErro(e)]);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && !salvando && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar produto</DialogTitle>
          <DialogDescription>
            As mudanças aparecem na loja assim que você salvar. Código interno: {row.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Campo id="ed-nome" label="Nome">
            <Input id="ed-nome" value={form.nome} maxLength={LIMITES.nome} onChange={(e) => set("nome", e.target.value)} />
          </Campo>

          <Campo id="ed-desc" label="Descrição" dica="Só texto (sem formatação). Quebras de linha são mantidas.">
            <Textarea id="ed-desc" rows={3} value={form.descricao} maxLength={LIMITES.descricao} onChange={(e) => set("descricao", e.target.value)} />
          </Campo>

          <div className="grid sm:grid-cols-2 gap-4">
            <Campo id="ed-cat" label="Categoria">
              <select
                id="ed-cat"
                value={form.categoria}
                onChange={(e) => set("categoria", e.target.value as FormProduto["categoria"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo id="ed-badge" label="Selo (opcional)" dica='Ex.: Lacrado, Lançamento 2026'>
              <Input id="ed-badge" value={form.badge} maxLength={LIMITES.badge} onChange={(e) => set("badge", e.target.value)} />
            </Campo>
          </div>

          <Campo id="ed-resumo" label="Resumo do card" dica='Aparece na listagem. Ex.: Titânio Natural • 128GB'>
            <Input id="ed-resumo" value={form.short_spec} maxLength={LIMITES.curto} onChange={(e) => set("short_spec", e.target.value)} />
          </Campo>

          <div className="grid sm:grid-cols-2 gap-4">
            <Campo id="ed-preco" label="Preço base (R$)" dica="Usado quando a opção não tem preço próprio.">
              <Input id="ed-preco" inputMode="decimal" value={form.preco} onChange={(e) => set("preco", e.target.value)} />
            </Campo>
            <Campo id="ed-preco-antigo" label="Preço antigo (opcional)" dica="Aparece riscado ao lado do preço.">
              <Input id="ed-preco-antigo" inputMode="decimal" value={form.preco_antigo} onChange={(e) => set("preco_antigo", e.target.value)} />
            </Campo>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium leading-none mb-1">Capacidades e preços</legend>
            <p className="text-xs text-muted-foreground">Deixe o preço em branco para usar o preço base.</p>
            {form.opcoes.map((o, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input aria-label={`Nome da opção ${i + 1}`} placeholder="Ex.: 256GB" value={o.opcao} maxLength={LIMITES.opcao} onChange={(e) => setOpcao(i, "opcao", e.target.value)} />
                <Input aria-label={`Preço da opção ${i + 1}`} placeholder="Preço (R$)" inputMode="decimal" className="max-w-[160px]" value={o.preco} onChange={(e) => setOpcao(i, "preco", e.target.value)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover opção ${i + 1}`}
                  disabled={form.opcoes.length <= 1}
                  onClick={() => setForm((f) => ({ ...f, opcoes: f.opcoes.filter((_, j) => j !== i) }))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setForm((f) => ({ ...f, opcoes: [...f.opcoes, { opcao: "", preco: "" }] }))}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar capacidade
            </Button>
          </fieldset>

          <Campo id="ed-cores" label="Cores" dica="Uma cor por linha.">
            <Textarea id="ed-cores" rows={4} value={form.cores} onChange={(e) => set("cores", e.target.value)} />
          </Campo>

          <div className="grid sm:grid-cols-3 gap-4">
            <Campo id="ed-tela" label="Tela">
              <Input id="ed-tela" value={form.tela} maxLength={LIMITES.curto} onChange={(e) => set("tela", e.target.value)} />
            </Campo>
            <Campo id="ed-chip" label="Chip">
              <Input id="ed-chip" value={form.chip} maxLength={LIMITES.curto} onChange={(e) => set("chip", e.target.value)} />
            </Campo>
            <Campo id="ed-camera" label="Câmera / detalhe">
              <Input id="ed-camera" value={form.camera} maxLength={LIMITES.curto} onChange={(e) => set("camera", e.target.value)} />
            </Campo>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <Campo id="ed-ordem" label="Ordem na loja" dica="Menor aparece primeiro.">
              <Input id="ed-ordem" inputMode="numeric" value={form.ordem} onChange={(e) => set("ordem", e.target.value)} />
            </Campo>
            <div className="flex items-center gap-3 pb-2">
              <Switch id="ed-seminovo" checked={form.seminovo} onCheckedChange={(v) => set("seminovo", v)} />
              <Label htmlFor="ed-seminovo">É seminovo</Label>
            </div>
            <div className="flex items-center gap-3 pb-2">
              <Switch id="ed-ativo" checked={form.ativo} onCheckedChange={(v) => set("ativo", v)} />
              <Label htmlFor="ed-ativo">Visível na loja</Label>
            </div>
          </div>

          {erros.length > 0 && (
            <ul role="alert" className="rounded-2xl bg-destructive/10 text-destructive text-sm p-4 space-y-1 list-disc list-inside">
              {erros.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" className="rounded-full" onClick={onClose} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="button" className="rounded-full" onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
