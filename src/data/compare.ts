// Regras do comparador de aparelhos. Arquivo "puro" (sem React/Supabase),
// no mesmo espírito do mapper.ts: fácil de testar.
import type { Product } from "./products";
import { isOpcaoInformativa } from "@/lib/whatsapp";

export const MAX_COMPARE = 3;

const precosDasOpcoes = (p: Product): number[] =>
  p.precosOpcoes ? Object.values(p.precosOpcoes) : [];

// Menor preço entre as capacidades ("a partir de"). Sem preço por capacidade, usa o preço base.
export const menorPreco = (p: Product): number => {
  const valores = precosDasOpcoes(p);
  return valores.length ? Math.min(...valores) : p.preco;
};

export const maiorPreco = (p: Product): number => {
  const valores = precosDasOpcoes(p);
  return valores.length ? Math.max(...valores) : p.preco;
};

export const temFaixaDePreco = (p: Product): boolean => menorPreco(p) !== maiorPreco(p);

// Desconto em % em relação ao "preço antigo", quando existir e for maior que o atual.
export const descontoPercent = (p: Product): number | null => {
  if (!p.precoAntigo || p.precoAntigo <= p.preco) return null;
  return Math.round((1 - p.preco / p.precoAntigo) * 100);
};

export type OpcaoComPreco = { opcao: string; preco: number | null };

// Capacidades reais do produto. Opções informativas ("Consulte as Disponíveis!") ficam de fora.
export const opcoesComPreco = (p: Product): OpcaoComPreco[] =>
  p.opcoes
    .filter((o) => !isOpcaoInformativa(o))
    .map((opcao) => ({ opcao, preco: p.precosOpcoes?.[opcao] ?? null }));

// Ids dos produtos com o menor "a partir de" (só faz sentido com 2 ou mais).
export const idsMaisBaratos = (produtos: Product[]): string[] => {
  if (produtos.length < 2) return [];
  const minimo = Math.min(...produtos.map(menorPreco));
  return produtos.filter((p) => menorPreco(p) === minimo).map((p) => p.id);
};

export type Linha = {
  chave: string;
  rotulo: string;
  valores: string[];
  difere: boolean;
};

const normaliza = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const DEFINICOES: { chave: string; rotulo: string; valor: (p: Product) => string }[] = [
  {
    chave: "condicao",
    rotulo: "Condição",
    valor: (p) => (p.seminovo ? "Seminovo verificado" : "Novo e lacrado • 1 ano de garantia"),
  },
  { chave: "tela", rotulo: "Tela", valor: (p) => p.tela },
  { chave: "chip", rotulo: "Chip", valor: (p) => p.chip },
  { chave: "camera", rotulo: "Câmera e extras", valor: (p) => p.camera },
  {
    chave: "capacidades",
    rotulo: "Capacidades",
    valor: (p) =>
      opcoesComPreco(p)
        .map((o) => o.opcao)
        .join(", "),
  },
  { chave: "cores", rotulo: "Cores", valor: (p) => p.cores.join(", ") },
];

// Linhas de especificação lado a lado. "difere" = os aparelhos não têm o mesmo valor.
export const montarLinhas = (produtos: Product[]): Linha[] =>
  DEFINICOES.map(({ chave, rotulo, valor }) => {
    const valores = produtos.map((p) => valor(p).trim() || "—");
    const difere = produtos.length > 1 && new Set(valores.map(normaliza)).size > 1;
    return { chave, rotulo, valores, difere };
  });
