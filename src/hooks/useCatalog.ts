import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "@/data/catalog";
import { products as catalogoEmbutido, type Product } from "@/data/products";

export const CATALOG_KEY = ["catalog"] as const;
const VAZIO: Product[] = [];

/**
 * Catálogo vindo do Supabase.
 * - isLoading: ainda buscando pela primeira vez (mostre um esqueleto).
 * - isStale: o banco não respondeu e estamos exibindo a cópia embutida no site,
 *   cujos preços podem estar desatualizados (a interface mostra um aviso).
 */
export function useCatalog() {
  const query = useQuery({
    queryKey: CATALOG_KEY,
    queryFn: fetchCatalog,
    staleTime: 60_000,
    retry: 1,
  });

  const isStale = query.isError && !query.data;
  const products = query.data ?? (query.isError ? catalogoEmbutido : VAZIO);

  const byId = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>,
    [products]
  );

  return { products, byId, isLoading: query.isPending, isStale };
}
