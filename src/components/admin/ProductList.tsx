import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Search } from "lucide-react";
import { ADMIN_CATALOG_KEY, fetchAllRows, setAtivo } from "@/data/adminApi";
import { resolveImage } from "@/data/catalog";
import { CATALOG_KEY } from "@/hooks/useCatalog";
import { CATEGORIAS, mensagemDeErro } from "@/data/adminForm";
import type { ProductRow } from "@/data/mapper";
import { formatBRL } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ProductEditor } from "./ProductEditor";

export const ProductList = () => {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ADMIN_CATALOG_KEY,
    queryFn: fetchAllRows,
  });

  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [editando, setEditando] = useState<ProductRow | null>(null);
  const [alternando, setAlternando] = useState<Set<string>>(new Set());

  const linhas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return (data ?? []).filter(
      (r) =>
        (categoria === "todos" || r.categoria === categoria) &&
        (!q || r.nome.toLowerCase().includes(q) || r.short_spec.toLowerCase().includes(q))
    );
  }, [data, busca, categoria]);

  const alternarAtivo = async (r: ProductRow, ativo: boolean) => {
    setAlternando((s) => new Set(s).add(r.id));
    try {
      await setAtivo(r.id, ativo);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_CATALOG_KEY }),
        queryClient.invalidateQueries({ queryKey: CATALOG_KEY }),
      ]);
      toast({ title: ativo ? "Produto visível na loja" : "Produto oculto da loja", description: r.nome });
    } catch (e) {
      toast({ title: "Não foi possível alterar", description: mensagemDeErro(e), variant: "destructive" });
    } finally {
      setAlternando((s) => {
        const novo = new Set(s);
        novo.delete(r.id);
        return novo;
      });
    }
  };

  if (isPending) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="rounded-2xl bg-destructive/10 text-destructive p-5 text-sm">
        <p className="mb-3">Não foi possível carregar os produtos: {mensagemDeErro(error)}</p>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => refetch()}>
          Tentar de novo
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-5">
        <div className="relative md:max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            aria-label="Buscar produto"
            placeholder="Buscar produto"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-11 rounded-full bg-secondary border border-transparent focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15 pl-11 pr-4 text-sm transition"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ value: "todos", label: "Todos" }, ...CATEGORIAS].map((c) => (
            <button
              key={c.value}
              type="button"
              aria-pressed={categoria === c.value}
              onClick={() => setCategoria(c.value)}
              className={
                "px-4 py-2 text-sm rounded-full border transition " +
                (categoria === c.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-foreground border-border hover:border-foreground/30")
              }
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {linhas.length} {linhas.length === 1 ? "produto" : "produtos"}
      </p>

      {linhas.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Nenhum produto encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {linhas.map((r) => {
            const opcoes = r.product_options ?? [];
            return (
              <li
                key={r.id}
                className={
                  "flex items-center gap-4 bg-surface rounded-2xl shadow-card p-3 md:p-4 " +
                  (r.ativo ? "" : "opacity-70")
                }
              >
                <div className="h-16 w-16 rounded-xl bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={resolveImage(r.imagem)} alt="" className="h-14 w-auto object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{r.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.short_spec || "—"} • {opcoes.length} {opcoes.length === 1 ? "opção" : "opções"}
                  </p>
                  <p className="text-sm font-bold mt-0.5">
                    {formatBRL(Number(r.preco))}
                    {!r.ativo && <span className="ml-2 text-xs font-medium text-muted-foreground">Oculto</span>}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch
                      aria-label={`${r.nome}: visível na loja`}
                      checked={r.ativo}
                      disabled={alternando.has(r.id)}
                      onCheckedChange={(v) => alternarAtivo(r, v)}
                    />
                    Visível
                  </div>
                  {r.ativo && (
                    <Link to={`/produto/${r.id}`} target="_blank" aria-label={`Ver ${r.nome} na loja`} className="p-2 text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <Button size="sm" className="rounded-full" onClick={() => setEditando(r)}>
                    Editar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editando && <ProductEditor key={editando.id} row={editando} onClose={() => setEditando(null)} />}
    </div>
  );
};
