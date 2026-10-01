import { Link } from "react-router-dom";
import { ShieldCheck, BadgeCheck, MessageCircle, Truck, Sparkles, ArrowRight, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { GridSkeleton } from "@/components/GridSkeleton";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useCatalog } from "@/hooks/useCatalog";
import heroPhone from "@/assets/products/iphone17promaxnovo.webp";
import { ENDERECO, INSTAGRAM_URL, INSTAGRAM_USER, WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/whatsapp";

// Só afirmações que a loja já faz em outras partes do site.
const GARANTIAS = [
  {
    icon: ShieldCheck,
    t: "Garantia de 1 ano",
    d: "Garantia oficial de 1 ano em todos os aparelhos novos e lacrados.",
  },
  {
    icon: BadgeCheck,
    t: "Seminovos verificados",
    d: "Aparelhos conferidos, com procedência e ótimo custo-benefício.",
  },
  {
    icon: MessageCircle,
    t: "Atendimento direto",
    d: "Tire dúvidas e confirme cor e capacidade direto com o vendedor, pelo WhatsApp.",
  },
  {
    icon: Truck,
    t: "Envio para todo o Brasil",
    d: `Atendemos de ${ENDERECO} e enviamos com rapidez e cuidado.`,
  },
];

const Index = () => {
  const { byId, isLoading } = useCatalog();
  const destaques = [
    "iphone17promaxseminovo",
    "iphone15pro",
    "iphone17promax",
    "applewatchultra3",
    "iphone16promaxseminovo",
    "macbookprom6",
  ]
    .map((id) => byId[id])
    .filter(Boolean);

  return (
    <Layout>
      {/* HERO */}
      <section className="bg-gradient-hero">
        <div className="container py-14 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-reveal className="animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 text-xs md:text-sm font-medium shadow-card mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                iPhones <span className="text-primary font-semibold">Lacrados</span> com Garantia
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                Sua melhor escolha em <span className="text-primary">Apple</span>.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Modelos novos e seminovos com segurança, procedência e garantia Victor Andrade.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/iphones"
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-primary-foreground font-semibold shadow-primary hover:bg-primary-hover transition"
                >
                  iPhones Novos & Lacrados <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/seminovos"
                  className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-surface border border-border font-semibold hover:border-foreground/30 transition"
                >
                  Ver Seminovos
                </Link>
              </div>
            </div>

            <div data-reveal data-reveal-delay="0.15" className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" aria-hidden />
              <img
                src={heroPhone}
                alt="iPhone 17 Pro Max"
                width={800}
                height={800}
                fetchPriority="high"
                className="relative max-h-[480px] md:max-h-[560px] w-auto animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* POR QUE COMPRAR */}
      <section className="border-y border-border bg-surface">
        <div className="container py-12 md:py-16">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Compra segura
            </p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
              Por que comprar com o Victor Andrade
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Atendimento direto, garantia e procedência em cada aparelho.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {GARANTIAS.map(({ icon: Icon, t, d }, i) => (
              <div
                data-reveal
                data-reveal-delay={(i * 0.1).toString()}
                key={t}
                className="rounded-3xl border border-border bg-background p-4 md:p-6 shadow-card"
              >
                <span className="inline-flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </span>
                <h3 className="font-semibold text-base md:text-lg leading-snug mb-1.5">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink("Olá Victor! Vim pelo site e gostaria de atendimento.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-success text-success-foreground font-semibold hover:opacity-90 transition"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar com o Victor · {WHATSAPP_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-surface border border-border font-semibold hover:border-foreground/30 transition"
            >
              <Instagram className="h-5 w-5" />@{INSTAGRAM_USER}
            </a>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="container py-14 md:py-20">
        <div data-reveal className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Custo-Benefício: Novos & Seminovos
          </h2>
          <p className="text-muted-foreground text-lg">
            A tecnologia <span className="text-primary font-semibold">Apple</span> com o melhor valor do{" "}
            <span className="text-primary font-semibold">Mercado</span>.
          </p>
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {destaques.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div data-reveal className="mt-10 text-center">
          <Link
            to="/iphones"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition"
          >
            Ver todos os iPhones <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
