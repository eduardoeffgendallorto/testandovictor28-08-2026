import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { formatBRL } from "@/data/products";
import { cn } from "@/lib/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const isSeminovo = product.seminovo;
  return (
    <Link
      data-reveal
      to={`/produto/${product.id}`}
      className="group flex flex-col h-full rounded-3xl bg-surface p-5 md:p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-border/40"
    >
      {product.badge && (
        <span
          className={cn(
            "self-start text-[11px] uppercase tracking-wider font-semibold rounded-full px-3 py-1 mb-3",
            isSeminovo
              ? "bg-primary/10 text-primary"
              : product.badge.toLowerCase().includes("lançamento")
              ? "bg-amber-100 text-amber-900"
              : "bg-foreground text-background"
          )}
        >
          {product.badge}
        </span>
      )}

      <div className="flex items-center justify-center h-44 md:h-52 mb-4 overflow-hidden">
        <img
          src={product.img}
          alt={product.imgAlt}
          loading="lazy"
          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>

      <div className="mt-auto">
        <h3 className="font-semibold text-base md:text-lg leading-tight">{product.nome}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.shortSpec}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            {product.precoAntigo && (
              <p className="text-xs text-muted-foreground line-through leading-none mb-1">
                {formatBRL(product.precoAntigo)}
              </p>
            )}
            <p className="text-lg md:text-xl font-bold tracking-tight">
              {formatBRL(product.preco)}
            </p>
          </div>
          <span className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold group-hover:bg-primary-hover transition-colors">
            Ver
          </span>
        </div>
      </div>
    </Link>
  );
};
