import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/data/products";
import {
  ORDENS,
  contarFiltrosAtivos,
  filtrarEOrdenar,
  montarFacets,
  type Ordem,
} from "@/data/catalogFilters";
import { useCatalogFilters } from "@/hooks/useCatalogFilters";
import { CatalogFilters } from "./CatalogFilters";
import { ProductCard } from "./ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  filters?: string[];
  searchPlaceholder?: string;
};

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const ProductsGrid = ({
  title,
  subtitle,
  products,
  filters,
  searchPlaceholder = "Buscar modelo (ex: 17 Pro)",
}: Props) => {
  const { state, update, clear } = useCatalogFilters();
  const facets = useMemo(() => montarFacets(products), [products]);
  const ativos = contarFiltrosAtivos(state);
  const [painelAberto, setPainelAberto] = useState(ativos > 0);

  // A busca responde na hora; a URL é atualizada logo depois (sem tremer o campo).
  const [texto, setTexto] = useState(state.q);
  useEffect(() => {
    if (texto === state.q) return;
    const t = setTimeout(() => update({ q: texto }), 250);
    return () => clearTimeout(t);
  }, [texto, state.q, update]);
  useEffect(() => setTexto(state.q), [state.q]);

  const filtered = useMemo(
    () => filtrarEOrdenar(products, { ...state, q: texto }),
    [products, state, texto],
  );

  const allFilters = filters ? ["Todos", ...filters] : null;
  const modeloAtivo = state.modelo || "Todos";

  // Etiquetas dos filtros ligados, cada uma com seu "x".
  const etiquetas: { chave: string; texto: string; remover: () => void }[] = [];
  if (state.precoMin !== null || state.precoMax !== null) {
    const faixa =
      state.precoMin !== null && state.precoMax !== null
        ? `${brl(state.precoMin)} – ${brl(state.precoMax)}`
        : state.precoMin !== null
          ? `A partir de ${brl(state.precoMin)}`
          : `Até ${brl(state.precoMax as number)}`;
    etiquetas.push({ chave: "preco", texto: faixa, remover: () => update({ precoMin: null, precoMax: null }) });
  }
  if (state.condicao !== "todas")
    etiquetas.push({
      chave: "cond",
      texto: state.condicao === "novo" ? "Novos" : "Seminovos",
      remover: () => update({ condicao: "todas" }),
    });
  state.tipos.forEach((t) =>
    etiquetas.push({ chave: `tipo-${t}`, texto: t, remover: () => update({ tipos: state.tipos.filter((x) => x !== t) }) }),
  );
  state.armazenamentos.forEach((a) =>
    etiquetas.push({
      chave: `arm-${a}`,
      texto: a,
      remover: () => update({ armazenamentos: state.armazenamentos.filter((x) => x !== a) }),
    }),
  );
  state.cores.forEach((c) =>
    etiquetas.push({ chave: `cor-${c}`, texto: c, remover: () => update({ cores: state.cores.filter((x) => x !== c) }) }),
  );

  const algoLigado = etiquetas.length > 0 || texto.trim() !== "" || state.modelo !== "";
  const limparTudo = () => {
    setTexto("");
    clear();
  };

  return (
    <section className="container py-10 md:py-14">
      <div data-reveal className="text-center max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-up">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
        <div className="relative md:max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-11 rounded-full bg-secondary border border-transparent focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15 pl-11 pr-4 text-sm transition"
          />
        </div>

        <div className="flex gap-3 md:ml-auto">
          <button
            type="button"
            onClick={() => setPainelAberto((v) => !v)}
            aria-expanded={painelAberto}
            className={
              "h-11 px-5 inline-flex items-center gap-2 rounded-full border text-sm font-medium transition " +
              (painelAberto || ativos > 0
                ? "border-primary text-primary bg-primary/5"
                : "border-border bg-surface hover:border-foreground/30")
            }
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {ativos > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs inline-flex items-center justify-center">
                {ativos}
              </span>
            )}
          </button>

          <Select value={state.ordem} onValueChange={(v) => update({ ordem: v as Ordem })}>
            <SelectTrigger aria-label="Ordenar por" className="h-11 rounded-full w-full md:w-[190px] bg-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDENS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {allFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => update({ modelo: f === "Todos" ? "" : f })}
              className={
                "px-4 py-2 text-sm rounded-full border transition " +
                (modeloAtivo === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-foreground border-border hover:border-foreground/30")
              }
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {painelAberto && <CatalogFilters facets={facets} state={state} onChange={update} />}

      <div className="flex flex-wrap items-center gap-2 mb-6 min-h-8">
        <p className="text-sm text-muted-foreground mr-1" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "aparelho" : "aparelhos"}
        </p>
        {etiquetas.map((e) => (
          <button
            key={e.chave}
            type="button"
            onClick={e.remover}
            aria-label={`Remover filtro ${e.texto}`}
            className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 text-xs rounded-full bg-secondary hover:bg-secondary/70 transition"
          >
            {e.texto}
            <X className="h-3.5 w-3.5" />
          </button>
        ))}
        {algoLigado && (
          <button type="button" onClick={limparTudo} className="text-xs text-primary hover:underline ml-1">
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Nenhum aparelho encontrado com esses filtros.</p>
          {algoLigado && (
            <button
              type="button"
              onClick={limparTudo}
              className="h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
