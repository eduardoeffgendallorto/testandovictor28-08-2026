// Operações do painel (exigem estar logado como admin; quem garante isso é o
// banco, via RLS, e não este código).
import { supabase } from "@/lib/supabase";
import { SELECT_PRODUTO, type ProductRow } from "@/data/mapper";
import { listaPostgrest, type OpcaoPayload, type ProdutoPayload } from "@/data/adminForm";

export const ADMIN_CATALOG_KEY = ["admin-catalog"] as const;

/** Todos os produtos, inclusive os ocultos (o banco só entrega isso para admin). */
export async function fetchAllRows(): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_PRODUTO)
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data as unknown as ProductRow[];
}

export async function setAtivo(id: string, ativo: boolean): Promise<void> {
  const { data, error } = await supabase.from("products").update({ ativo }).eq("id", id).select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("Sem permissão para salvar.");
}

export async function saveProduct(
  id: string,
  produto: ProdutoPayload,
  opcoes: OpcaoPayload[]
): Promise<void> {
  // 1) dados do produto
  const { data, error } = await supabase.from("products").update(produto).eq("id", id).select("id");
  if (error) throw error;
  // Sem permissão o Postgres não dá erro no UPDATE: só não altera nenhuma linha.
  if (!data?.length) throw new Error("Sem permissão para salvar.");

  // 2) opções: primeiro grava/atualiza as atuais...
  const linhas = opcoes.map((o, i) => ({
    product_id: id,
    opcao: o.opcao,
    preco: o.preco,
    ordem: (i + 1) * 10,
  }));
  const up = await supabase.from("product_options").upsert(linhas, { onConflict: "product_id,opcao" });
  if (up.error) throw up.error;

  // 3) ...e só depois remove as que o Victor tirou (assim nunca fica sem opção no meio do caminho).
  const del = await supabase
    .from("product_options")
    .delete()
    .eq("product_id", id)
    .not("opcao", "in", listaPostgrest(opcoes.map((o) => o.opcao)));
  if (del.error) throw del.error;
}
