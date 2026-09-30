import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Wallet,
  Cpu,
  Camera,
  Monitor,
  BatteryCharging,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { formatBRL } from "@/data/products";
import { useCatalog } from "@/hooks/useCatalog";
import { Skeleton } from "@/components/ui/skeleton";
import { buildWhatsAppLink, descreverVariante } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CompareButton } from "@/components/CompareButton";

const ProdutoView = ({ id }: { id: string }) => {
  const { byId, isLoading } = useCatalog();
  const product = byId[id];
  const { add } = useCart();
  const navigate = useNavigate();

  const [cor, setCor] = useState<string>(product?.cores[0] ?? "");
  const [opcao, setOpcao] = useState<string>(product?.opcoes[0] ?? "");

  // Mantém a escolha do cliente enquanto ela ainda existir; se o produto mudar
  // (ex.: o Victor removeu uma cor no painel), volta para a primeira opção.
  useEffect(() => {
    if (!product) return;
    setCor((atual) => (product.cores.includes(atual) ? atual : product.cores[0] ?? ""));
    setOpcao((atual) => (product.opcoes.includes(atual) ? atual : product.opcoes[0] ?? ""));
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const anterior = document.title;
    document.title = `${product.nome} | Victor Andrade`;
    return () => {
      document.title = anterior;
    };
  }, [product]);

  const precoAtual = useMemo(() => {
    if (!product) return 0;
    return product.precosOpcoes?.[opcao] ?? product.preco;
  }, [product, opcao]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 md:py-12" aria-busy="true">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="h-[360px] md:h-[460px] rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Não conseguimos localizar este produto em nosso catálogo.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para a loja
          </Link>
        </div>
      </Layout>
    );
  }

  // Se a pessoa chegou direto pelo link (sem histórico interno), "Voltar" leva
  // para a lista da categoria em vez de não fazer nada / sair do site.
  const rotaCategoria: Record<string, string> = {
    iphone: "/iphones",
    seminovo: "/seminovos",
    ipad: "/ipads",
    mac: "/macs",
    watch: "/relogios",
  };
  const handleVoltar = () => {
    const temHistorico = (window.history.state?.idx ?? 0) > 0;
    if (temHistorico) navigate(-1);
    else navigate(rotaCategoria[product.categoria] ?? "/");
  };

  const tituloOpcoes = id.includes("watch") ? "Modelo da Pulseira" : "Armazenamento";

  const handleWhatsApp = () => {
    const variante = descreverVariante(opcao, cor);
    const msg = `Olá Victor! Tenho interesse no *${product.nome}*${variante ? ` (${variante})` : ""} que está por *${formatBRL(precoAtual)}*. Pode me tirar umas dúvidas?`;
    window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
  };

  const handleAdd = () => {
    add({ id: product.id, opcao, cor });
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.nome} • ${opcao} • ${cor}`,
    });
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <button
          onClick={handleVoltar}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div data-reveal className="bg-surface rounded-3xl p-8 md:p-12 shadow-card flex items-center justify-center min-h-[360px] md:min-h-[460px]">
            <img
              src={product.img}
              alt={product.imgAlt}
              className="max-h-[400px] w-auto object-contain"
            />
          </div>

          <div data-reveal data-reveal-delay="0.15">
            <span
              className={cn(
                "inline-block text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 mb-4",
                product.seminovo
                  ? "bg-primary/10 text-primary"
                  : "bg-foreground text-background"
              )}
            >
              {product.seminovo ? "Seminovo verificado" : "Lacrado / 1 ano de garantia"}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{product.nome}</h1>
            {/* Texto puro: nunca HTML. Quebras de linha da descrição são preservadas. */}
            <p className="text-muted-foreground text-base md:text-lg mb-6 whitespace-pre-line">
              {product.desc}
            </p>

            {product.precoAntigo && (
              <p className="text-sm text-muted-foreground line-through">
                {formatBRL(product.precoAntigo)}
              </p>
            )}
            <p className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              {formatBRL(precoAtual)}
            </p>
            <p className="flex items-center gap-2 text-sm text-success font-medium mb-6">
              <Wallet className="h-4 w-4" />
              Pagamento no PIX ou Cartão em até 10x (com acréscimo)
            </p>

            {product.seminovo && (
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl mb-6">
                <BatteryCharging className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Variação de Preço</p>
                  <p className="text-muted-foreground">
                    O valor exato pode variar conforme a porcentagem da Saúde da Bateria do estoque atual.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-5">
              <p className="font-semibold mb-2">Cor:</p>
              <div className="flex flex-wrap gap-2">
                {product.cores.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={cor === c}
                    onClick={() => setCor(c)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-medium transition",
                      cor === c
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border text-foreground hover:border-foreground/40"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <p className="font-semibold mb-2">{tituloOpcoes}:</p>
              <div className="flex flex-wrap gap-2">
                {product.opcoes.map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={opcao === o}
                    onClick={() => setOpcao(o)}
                    className={cn(
                      "px-4 py-2 rounded-xl border-2 text-sm font-medium transition",
                      opcao === o
                        ? "border-primary text-primary bg-primary/5"
                        : "border-border text-foreground hover:border-foreground/40"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <button
                onClick={handleWhatsApp}
                className="h-13 py-4 rounded-2xl bg-success text-success-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-card"
              >
                <WhatsAppIcon />
                Falar com o Vendedor
              </button>
              <button
                onClick={handleAdd}
                className="h-12 rounded-2xl border-2 border-foreground text-foreground font-semibold inline-flex items-center justify-center gap-2 hover:bg-foreground hover:text-background transition"
              >
                <ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho
              </button>
              <CompareButton productId={product.id} variant="full" />
            </div>

            <h2 className="font-bold text-lg mb-3">O que você precisa saber</h2>
            <ul className="divide-y divide-border border-y border-border">
              {[
                { icon: Monitor, t: product.tela },
                { icon: Cpu, t: product.chip },
                { icon: Camera, t: product.camera },
                { icon: ShieldCheck, t: product.seminovo ? "Aparelho seminovo verificado" : "Garantia de 1 ano" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-4 py-4">
                  <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-sm md:text-base">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Produto = () => {
  const { id = "" } = useParams();
  // key={id}: ao trocar de produto, a seleção de cor/opção recomeça do zero.
  return <ProdutoView key={id} id={id} />;
};

export default Produto;
