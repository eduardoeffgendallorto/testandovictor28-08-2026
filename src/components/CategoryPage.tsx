import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ProductsGrid } from "@/components/ProductsGrid";
import { GridSkeleton } from "@/components/GridSkeleton";
import { useCatalog } from "@/hooks/useCatalog";
import type { Category } from "@/data/products";

type Props = {
  categoria: Category;
  title: string;
  subtitle: string;
  filters?: string[];
  searchPlaceholder?: string;
  documentTitle?: string;
};

export const CategoryPage = ({ categoria, documentTitle, ...grid }: Props) => {
  const { products, isLoading } = useCatalog();

  useEffect(() => {
    if (documentTitle) document.title = documentTitle;
  }, [documentTitle]);

  return (
    <Layout>
      {isLoading ? (
        <GridSkeleton title={grid.title} subtitle={grid.subtitle} />
      ) : (
        <ProductsGrid {...grid} products={products.filter((p) => p.categoria === categoria)} />
      )}
    </Layout>
  );
};
