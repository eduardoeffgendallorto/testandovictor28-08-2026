import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { CompareBar } from "./CompareBar";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCatalog } from "@/hooks/useCatalog";

export const Layout = ({ children }: { children: ReactNode }) => {
  useScrollReveal();
  const { isStale } = useCatalog();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        {isStale && (
          <div role="status" className="bg-amber-100 text-amber-900 text-sm text-center py-2 px-4">
            Não conseguimos atualizar os preços agora. Os valores abaixo podem estar
            desatualizados: confirme com o vendedor no WhatsApp.
          </div>
        )}
        {children}
      </main>
      <Footer />
      <CompareBar />
      <WhatsAppFloat />
    </div>
  );
};
