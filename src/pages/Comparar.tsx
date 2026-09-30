import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Link2, ArrowLeftRight, Trash2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalog } from "@/hooks/useCatalog";
import { useCompare } from "@/hooks/useCompare";
import { formatBRL, type Category, type Product } from "@/data/products";
import {
  MAX_COMPARE,
  descontoPercent,
  idsMaisBaratos,
  menorPreco,
  montarLinhas,
  opcoesComPreco,
  temFaixaDePreco,
} from "@/data/compare";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ROTULO_CATEGORIA: Record<Category, string> = {
  iphone: "iPhones novos",
  seminovo: "Seminovos",
  ipad: "iPads",
  mac: "MacBooks",
  watch: "Relógios",
};
const ORDEM_CATEGORIAS: Category[] = ["iphone", "seminovo", "ipad", "mac", "watch"];

const abrirWhatsApp = (msg: string) =>
  window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");

const precoTexto = (p: Product) =>
  `${temFaixaDePreco(p) ? "a partir de " : ""}*${formatBRL(menorPreco(p))}*`;

const Comparar = () => {
  const { products, byId, isLoading } = useCatalog();
  const { items, ids, isFull, toggle, remove, clear, setAll } = useCompare();
  const [params, setParams] = useSearchParams();
  const [soDiferencas, setSoDiferencas] = useState(false);
  const importou = useRef(false);

  useEffect(() => {
    const anterior = document.title;
    document.title = "Comparar aparelhos | Victor Andrade";
    return () => {
      document.title = anterior;
    };
  }, []);

  // Link compartilhado (/comparar?ids=a,b,c): importa uma vez, ignora ids que não
  // existem mais no catálogo e limpa o parâmetro da URL.
  useEffect(() => {
    if (isLoading || importou.current) return;
    importou.current = true;
    const raw = params.get("ids");
    if (!raw) return;
    const validos = raw
      .split(",")
      .map((s) => s.trim())
      .filter((id) => byId[id]);
    if (validos.length) setAll(validos);
    setParams({}, { replace: true });
  }, [isLoading, byId, params, setAll, setParams]);

  const disponiveis = useMemo(() => {
    const escolhidos = new Set(ids);
    return ORDEM_CATEGORIAS.map((cat) => ({
      cat,
      lista: products.filter((p) => p.categoria === cat && !escolhidos.has(p.id)),
    })).filter((g) => g.lista.length > 0);
  }, [products, ids]);

  const baratos = useMemo(() => idsMaisBaratos(items), [items]);
  const linhas = useMemo(() => {
    const todas = montarLinhas(items);
    return soDiferencas && items.length > 1 ? todas.filter((l) => l.difere) : todas;
  }, [items, soDiferencas]);

  const handleAdicionar = (id: string) => {
    if (toggle(id) === "full") {
      toast({ title: `Limite de ${MAX_COMPARE} aparelhos`, description: "Remova um para adicionar outro." });
    }
  };

  const handleCopiarLink = async () => {
    const url = new URL(`comparar?ids=${ids.map(encodeURIComponent).join(",")}`, window.location.origin + import.meta.env.BASE_URL);
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({ title: "Link copiado", description: "Quem abrir vê a mesma comparação." });
    } catch {
      toast({ title: "Não consegui copiar", description: url.toString() });
    }
  };

  const handleDuvida = () => {
    const lista = items.map((p) => `✅ *${p.nome}* (${precoTexto(p)})`).join("\n");
    abrirWhatsApp(
      `Olá Victor! Estou em dúvida entre estes aparelhos:\n\n${lista}\n\nQual você me recomenda?`
    );
  };

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Continuar comprando
        </Link>

        <div data-reveal className="max-w-2xl mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Compare e escolha.</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Coloque até {MAX_COMPARE} aparelhos lado a lado e veja o que muda em preço, tela, chip e câmera.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between mb-6">
          <div className="w-full md:max-w-sm">
            <Select value="" onValueChange={handleAdicionar} disabled={isFull || isLoading}>
              <SelectTrigger className="h-11 rounded-full bg-secondary border-transparent">
                <SelectValue placeholder={isFull ? `Limite de ${MAX_COMPARE} aparelhos` : "Adicionar aparelho"} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {disponiveis.map(({ cat, lista }) => (
                  <SelectGroup key={cat}>
                    <SelectLabel>{ROTULO_CATEGORIA[cat]}</SelectLabel>
                    {lista.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {items.length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {items.length > 1 && (
                <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Switch checked={soDiferencas} onCheckedChange={setSoDiferencas} />
                  Só diferenças
                </label>
              )}
              <button
                type="button"
                onClick={handleCopiarLink}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Link2 className="h-4 w-4" /> Copiar link
              </button>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Limpar
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div aria-busy="true" className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-3xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-10 md:p-16 text-center">
            <ArrowLeftRight className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum aparelho na comparação</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Escolha um aparelho no seletor acima ou toque em “Comparar” nos cards da loja.
            </p>
            <Link
              to="/iphones"
              className="inline-flex items-center h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold"
            >
              Ver iPhones
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-3xl border border-border/40 bg-surface shadow-card">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Comparação de aparelhos</caption>
                <thead>
                  <tr>
                    <td className="sticky left-0 z-10 bg-surface w-28 md:w-40" />
                    {items.map((p) => (
                      <th key={p.id} scope="col" className="align-top p-4 md:p-6 min-w-[200px] font-normal">
                        <div className="relative flex flex-col items-center text-center">
                          <button
                            type="button"
                            onClick={() => remove(p.id)}
                            aria-label={`Remover ${p.nome} da comparação`}
                            className="absolute -top-1 -right-1 h-7 w-7 inline-flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <img src={p.img} alt={p.imgAlt} className="h-32 md:h-40 w-auto object-contain mb-3" />
                          <Link to={`/produto/${p.id}`} className="font-semibold leading-tight hover:underline">
                            {p.nome}
                          </Link>
                          {baratos.includes(p.id) && (
                            <span className="mt-2 text-[11px] uppercase tracking-wider font-semibold rounded-full px-3 py-1 bg-success/15 text-success">
                              Menor preço
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&>tr]:border-t [&>tr]:border-border">
                  <tr>
                    <th scope="row" className="sticky left-0 z-10 bg-surface p-4 md:px-6 text-sm font-semibold align-top">
                      Preço
                    </th>
                    {items.map((p) => {
                      const desconto = descontoPercent(p);
                      return (
                        <td key={p.id} className="p-4 md:p-6 align-top text-center">
                          {temFaixaDePreco(p) && (
                            <p className="text-xs text-muted-foreground">a partir de</p>
                          )}
                          <p className="text-2xl font-bold tracking-tight">{formatBRL(menorPreco(p))}</p>
                          {p.precoAntigo && desconto && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <span className="line-through">{formatBRL(p.precoAntigo)}</span>{" "}
                              <span className="font-semibold text-success">-{desconto}%</span>
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <th scope="row" className="sticky left-0 z-10 bg-surface p-4 md:px-6 text-sm font-semibold align-top">
                      Preço por capacidade
                    </th>
                    {items.map((p) => {
                      const opcoes = opcoesComPreco(p);
                      return (
                        <td key={p.id} className="p-4 md:p-6 align-top text-sm">
                          {opcoes.length === 0 ? (
                            <span className="text-muted-foreground">Consulte as disponíveis</span>
                          ) : (
                            <ul className="space-y-1">
                              {opcoes.map((o) => (
                                <li key={o.opcao} className="flex justify-between gap-3">
                                  <span>{o.opcao}</span>
                                  <span className="font-medium tabular-nums">
                                    {o.preco !== null ? formatBRL(o.preco) : "—"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {linhas.map((l) => (
                    <tr key={l.chave} className={cn(l.difere && "bg-primary/[0.03]")}>
                      <th scope="row" className="sticky left-0 z-10 bg-surface p-4 md:px-6 text-sm font-semibold align-top">
                        {l.rotulo}
                        {l.difere && <span className="sr-only"> (diferente entre os aparelhos)</span>}
                      </th>
                      {l.valores.map((v, i) => (
                        <td key={items[i].id} className="p-4 md:p-6 align-top text-sm">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr>
                    <td className="sticky left-0 z-10 bg-surface" />
                    {items.map((p) => (
                      <td key={p.id} className="p-4 md:p-6 align-top">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              abrirWhatsApp(
                                `Olá Victor! Tenho interesse no *${p.nome}* (${precoTexto(p)}). Pode me tirar umas dúvidas?`
                              )
                            }
                            className="h-11 rounded-2xl bg-success text-success-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition"
                          >
                            <WhatsAppIcon className="h-4 w-4" />
                            Falar com o Vendedor
                          </button>
                          <Link
                            to={`/produto/${p.id}`}
                            className="h-11 rounded-2xl border-2 border-foreground text-sm font-semibold inline-flex items-center justify-center hover:bg-foreground hover:text-background transition"
                          >
                            Ver produto
                          </Link>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs md:text-sm text-muted-foreground">
                Os preços podem mudar e a disponibilidade de cor e capacidade é confirmada direto com o vendedor.
              </p>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={handleDuvida}
                  className="h-11 px-6 rounded-full bg-success text-success-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shrink-0"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Em dúvida? Pergunte ao Victor
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Comparar;
