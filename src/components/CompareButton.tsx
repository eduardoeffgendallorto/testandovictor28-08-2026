import { Check, ArrowLeftRight } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import { MAX_COMPARE } from "@/data/compare";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Props = {
  productId: string;
  variant?: "icon" | "full";
  className?: string;
};

export const CompareButton = ({ productId, variant = "icon", className }: Props) => {
  const { has, toggle } = useCompare();
  const ativo = has(productId);

  const onClick = () => {
    const resultado = toggle(productId);
    if (resultado === "full") {
      toast({
        title: `Você já está comparando ${MAX_COMPARE} aparelhos`,
        description: "Remova um deles para adicionar outro.",
      });
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={ativo}
        className={cn(
          "h-12 rounded-2xl border-2 font-semibold inline-flex items-center justify-center gap-2 transition",
          ativo
            ? "border-primary text-primary bg-primary/5"
            : "border-border text-foreground hover:border-foreground/40",
          className
        )}
      >
        {ativo ? <Check className="h-5 w-5" /> : <ArrowLeftRight className="h-5 w-5" />}
        {ativo ? "Na comparação" : "Comparar com outro aparelho"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      aria-label={ativo ? "Remover da comparação" : "Adicionar à comparação"}
      title={ativo ? "Remover da comparação" : "Comparar"}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition",
        ativo
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-surface text-foreground border-border hover:border-foreground/40",
        className
      )}
    >
      {ativo ? <Check className="h-3.5 w-3.5" /> : <ArrowLeftRight className="h-3.5 w-3.5" />}
      {ativo ? "Comparando" : "Comparar"}
    </button>
  );
};
