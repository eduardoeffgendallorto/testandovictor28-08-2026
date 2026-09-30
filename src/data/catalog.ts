import { supabase } from "@/lib/supabase";
import type { Product } from "@/data/products";
import { rowToProduct, SELECT_PRODUTO, type ProductRow } from "@/data/mapper";

// Imagens que já vêm dentro do site (src/assets/products/*.webp), indexadas
// pelo nome do arquivo sem extensão (ex.: "iphone15pro").
const embutidas = import.meta.glob<string>("/src/assets/products/*.webp", {
  eager: true,
  import: "default",
});

const porChave: Record<string, string> = {};
for (const [caminho, url] of Object.entries(embutidas)) {
  const chave = caminho.split("/").pop()!.replace(/\.webp$/, "");
  porChave[chave] = url;
}

// No banco, "imagem" é a chave de uma imagem embutida OU uma URL https.
export const resolveImage = (imagem: string): string =>
  imagem.startsWith("https://") ? imagem : porChave[imagem] ?? "/placeholder.svg";

// Vitrine pública: só produtos ativos, na ordem definida no painel.
export async function fetchCatalog(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_PRODUTO)
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map((row) => rowToProduct(row, resolveImage));
}
