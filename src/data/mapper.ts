// Converte linhas do banco (Supabase) no formato que o site usa (Product).
// Arquivo "puro" (sem Vite/Supabase) para ser fácil de testar.
import type { Category, Product } from "./products";

export type OptionRow = {
  id: number;
  opcao: string;
  preco: number | string | null;
  ordem: number;
};

export type ProductRow = {
  id: string;
  nome: string;
  descricao: string;
  categoria: Category;
  badge: string | null;
  short_spec: string;
  preco: number | string;
  preco_antigo: number | string | null;
  cores: string[] | null;
  tela: string;
  chip: string;
  camera: string;
  seminovo: boolean;
  imagem: string;
  imagem_alt: string;
  ativo: boolean;
  ordem: number;
  product_options: OptionRow[] | null;
};

// Traz o produto junto com as opções (capacidades) e o preço de cada uma.
export const SELECT_PRODUTO = "*, product_options(id, opcao, preco, ordem)";

export const sortOptions = (options: OptionRow[] | null | undefined) =>
  [...(options ?? [])].sort((a, b) => a.ordem - b.ordem || a.id - b.id);

export function rowToProduct(
  row: ProductRow,
  resolveImage: (imagem: string) => string
): Product {
  const options = sortOptions(row.product_options);

  const precosOpcoes: Record<string, number> = {};
  for (const o of options) {
    if (o.preco !== null && o.preco !== undefined) precosOpcoes[o.opcao] = Number(o.preco);
  }

  return {
    id: row.id,
    nome: row.nome,
    desc: row.descricao,
    preco: Number(row.preco),
    precoAntigo:
      row.preco_antigo !== null && row.preco_antigo !== undefined
        ? Number(row.preco_antigo)
        : undefined,
    img: resolveImage(row.imagem),
    imgAlt: row.imagem_alt || row.nome,
    categoria: row.categoria,
    badge: row.badge ?? undefined,
    shortSpec: row.short_spec,
    cores: row.cores ?? [],
    opcoes: options.map((o) => o.opcao),
    precosOpcoes: Object.keys(precosOpcoes).length ? precosOpcoes : undefined,
    tela: row.tela,
    chip: row.chip,
    camera: row.camera,
    seminovo: row.seminovo,
  };
}
