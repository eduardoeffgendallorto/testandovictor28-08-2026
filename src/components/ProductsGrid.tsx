import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  filters?: string[];
  searchPlaceholder?: string;
};

export const ProductsGrid = ({
  title,
  subtitle,
  products,
  filters,
  searchPlaceholder = "Buscar modelo (ex: 17 Pro)",
}: Props) => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("Todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchQ =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.shortSpec.toLowerCase().includes(q);
      const matchF =
        activeFilter === "Todos" ||
        p.nome.toLowerCase().includes(activeFilter.toLowerCase());
      return matchQ && matchF;
    });
  }, [products, query, activeFilter]);

  const allFilters = filters ? ["Todos", ...filters] : null;

  return (
    <section className="container py-10 md:py-14">
      <div data-reveal className="text-center max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-up">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
        <div className="relative md:max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-11 rounded-full bg-secondary border border-transparent focus:border-primary focus:bg-surface focus:outline-none focus:ring-4 focus:ring-primary/15 pl-11 pr-4 text-sm transition"
          />
        </div>

        {allFilters && (
          <div className="flex flex-wrap gap-2">
            {allFilters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={
                  "px-4 py-2 text-sm rounded-full border transition " +
                  (activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-surface text-foreground border-border hover:border-foreground/30")
                }
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          Nenhum produto encontrado.
        </p>
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
