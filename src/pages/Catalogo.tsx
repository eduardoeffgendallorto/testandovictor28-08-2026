import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ProductsGrid } from "@/components/ProductsGrid";
import { GridSkeleton } from "@/components/GridSkeleton";
import { useCatalog } from "@/hooks/useCatalog";

const TITULO = "Todos os aparelhos";
const SUBTITULO = "Filtre por preço, armazenamento, cor, condição e tipo de aparelho.";

const Catalogo = () => {
  const { products, isLoading } = useCatalog();

  useEffect(() => {
    document.title = "Catálogo completo | Victor Andrade";
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <GridSkeleton title={TITULO} subtitle={SUBTITULO} />
      ) : (
        <ProductsGrid
          title={TITULO}
          subtitle={SUBTITULO}
          products={products}
          searchPlaceholder="Buscar aparelho (ex: iPhone 16, MacBook)"
        />
      )}
    </Layout>
  );
};

export default Catalogo;
