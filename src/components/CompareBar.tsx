import { Link, useLocation } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { MAX_COMPARE } from "@/data/compare";

// Barra fixa que aparece quando há aparelhos escolhidos. Fica à esquerda do
// botão flutuante do WhatsApp (por isso o right-24 no celular).
export const CompareBar = () => {
  const { items, count, isLoading, remove, clear } = useCompare();
  const { pathname } = useLocation();

  if (count === 0 || pathname === "/comparar") return null;

  return (
    <div
      role="region"
      aria-label="Comparador de aparelhos"
      className="fixed bottom-5 left-4 right-24 md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-foreground text-background pl-3 pr-2 py-2 shadow-card-hover"
    >
      <div className="flex items-center -space-x-2">
        {isLoading
          ? null
          : items.map((p) => (
              <span key={p.id} className="relative group">
                <img
                  src={p.img}
                  alt={p.nome}
                  className="h-9 w-9 rounded-full bg-surface object-contain p-1 border-2 border-foreground"
                />
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={`Remover ${p.nome} da comparação`}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-background text-foreground hidden group-hover:flex group-focus-within:flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
      </div>
      <span className="text-xs md:text-sm font-medium whitespace-nowrap">
        {count}/{MAX_COMPARE}
      </span>
      <button
        type="button"
        onClick={clear}
        className="hidden md:inline text-xs text-background/70 hover:text-background underline"
      >
        Limpar
      </button>
      <Link
        to="/comparar"
        className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors whitespace-nowrap"
      >
        <ArrowLeftRight className="h-4 w-4" />
        Comparar
      </Link>
    </div>
  );
};
