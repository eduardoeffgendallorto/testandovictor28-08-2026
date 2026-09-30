import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { formatBRL } from "@/data/products";
import { buildWhatsAppLink, descreverVariante, isOpcaoInformativa } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Carrinho = () => {
  const { items, remove, total, count, isLoading, indisponiveis, pruneUnavailable } = useCart();

  const handleFinalizar = () => {
    if (items.length === 0) return;
    let msg = "Olá Victor! ⚡ Quero fechar meu pedido:\n\n";
    items.forEach((i) => {
      msg += `✅ *${i.nome}*\n   ↳ ${descreverVariante(i.opcao, i.cor)}\n   ↳ Valor: ${formatBRL(i.preco)}\n\n`;
    });
    msg += `*Total do Pedido: ${formatBRL(total)}*\n-----------------------------\nAguardo as instruções para o pagamento!`;
    window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Continuar comprando
        </Link>

        <h1 data-reveal className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
          Revise seu pedido.
        </h1>

        {indisponiveis > 0 && (
          <div
            role="status"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p>
              {indisponiveis === 1
                ? "1 item do seu carrinho não está mais disponível e foi ocultado."
                : `${indisponiveis} itens do seu carrinho não estão mais disponíveis e foram ocultados.`}
            </p>
            <button type="button" onClick={pruneUnavailable} className="font-semibold underline">
              Remover do carrinho
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-6" aria-busy="true">
            <Skeleton className="lg:col-span-2 h-40 rounded-3xl" />
            <Skeleton className="h-56 rounded-3xl" />
          </div>
        ) : count === 0 ? (
          <div className="bg-surface rounded-3xl p-12 md:p-20 text-center shadow-card">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-medium mb-2">Seu carrinho está vazio.</p>
            <p className="text-muted-foreground mb-6">Que tal começar pelos lançamentos?</p>
            <Link
              to="/iphones"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition"
            >
              Ver iPhones
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div data-reveal className="lg:col-span-2 bg-surface rounded-3xl shadow-card p-2 md:p-4">
              {items.map((item) => (
                <div
                  key={item.index}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-0"
                >
                  <div className="h-20 w-20 rounded-2xl bg-surface-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={item.imagem} alt={item.nome} className="h-16 w-auto object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.nome}</h3>
                    <p className="text-xs text-muted-foreground">
                      {[isOpcaoInformativa(item.opcao) ? null : item.opcao, item.cor].filter(Boolean).join(" • ")}
                    </p>
                    <p className="font-bold mt-1">{formatBRL(item.preco)}</p>
                  </div>
                  <button
                    onClick={() => {
                      remove(item.index);
                      toast({ title: "Item removido", description: item.nome });
                    }}
                    aria-label="Remover item"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <aside data-reveal data-reveal-delay="0.15" className="bg-surface rounded-3xl shadow-card p-6 h-fit lg:sticky lg:top-24">
              <h2 className="font-bold text-lg mb-4">Resumo</h2>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Itens</span>
                <span>{count}</span>
              </div>
              <hr className="my-4 border-border" />
              <div className="flex justify-between items-baseline mb-6">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">{formatBRL(total)}</span>
              </div>
              <button
                onClick={handleFinalizar}
                className="w-full h-12 rounded-2xl bg-success text-success-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-card"
              >
                <WhatsAppIcon />
                Fechar pedido no WhatsApp
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Você será redirecionado para o WhatsApp de Victor Andrade.
              </p>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Carrinho;
