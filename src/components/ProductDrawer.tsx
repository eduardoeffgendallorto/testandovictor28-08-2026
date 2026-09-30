import { Drawer } from "vaul";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { formatBRL } from "@/data/products";

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const ProductDrawer = ({ product, open, onClose }: ProductDrawerProps) => {
  if (!product) return null;

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse no ${product.nome} por ${formatBRL(product.preco)}. Está disponível?`
  );
  const urlWhatsApp = `https://wa.me/5500000000000?text=${mensagemWhatsApp}`; // Substituir pelo número da loja

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />

        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-background rounded-t-[32px] p-6 pb-8 outline-none border-t border-border/50 shadow-2xl flex flex-col max-h-[85vh]">
          {/* Pegada para arrastar */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6 cursor-grab active:cursor-grabbing" />

          <div className="overflow-y-auto space-y-6 pr-1">
            {/* Foto e Badge */}
            <div className="relative flex items-center justify-center bg-secondary/50 rounded-2xl p-6 min-h-[200px]">
              {product.badge && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              <img
                src={product.img}
                alt={product.imgAlt || product.nome}
                className="max-h-48 object-contain"
              />
            </div>

            {/* Nome e Especificações */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{product.nome}</h2>
              <p className="text-sm text-muted-foreground mt-1">{product.shortSpec}</p>
            </div>

            {/* Garantia */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground bg-primary/5 p-3.5 rounded-2xl border border-primary/10">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
              <span>Produto verificado, lacrado e com garantia direto da loja.</span>
            </div>

            {/* Preço e Botão de WhatsApp */}
            <div className="flex items-center justify-between pt-2 gap-4">
              <div>
                {product.precoAntigo && (
                  <p className="text-xs text-muted-foreground line-through leading-none mb-1">
                    {formatBRL(product.precoAntigo)}
                  </p>
                )}
                <p className="text-2xl font-extrabold text-primary">
                  {formatBRL(product.preco)}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-full gap-2 font-semibold shadow-md px-6 bg-green-600 hover:bg-green-700 text-white"
              >
                <a href={urlWhatsApp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Comprar
                </a>
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};