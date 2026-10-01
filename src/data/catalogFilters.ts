// Regras de filtro e ordenação do catálogo. Arquivo "puro" (sem React/Supabase),
// no mesmo espírito do compare.ts: fácil de testar.
import type { Product } from "./products";

export type Ordem = "relevancia" | "preco-asc" | "preco-desc" | "nome";
export type Condicao = "todas" | "novo" | "seminovo";

export type FiltroState = {
  q: string; // busca por texto
  modelo: string; // atalho por modelo (ex.: "iPhone 17"); "" = todos
  ordem: Ordem;
  precoMin: number | null;
  precoMax: number | null;
  armazenamentos: string[]; // ex.: ["256GB", "1TB"]
  cores: string[]; // nomes de cor exatamente como no catálogo, ex.: ["Titânio Preto"]
  tipos: string[]; // "iPhone" | "iPad" | "MacBook" | "Relógio"
  condicao: Condicao;
};

export const FILTRO_VAZIO: FiltroState = {
  q: "",
  modelo: "",
  ordem: "relevancia",
  precoMin: null,
  precoMax: null,
  armazenamentos: [],
  cores: [],
  tipos: [],
  condicao: "todas",
};

export const ORDENS: { value: Ordem; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "nome", label: "Nome (A–Z)" },
];

const TIPOS_ORDEM = ["iPhone", "iPad", "MacBook", "Relógio"];

const semAcento = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// ---------- características de cada produto ----------

export const ehSeminovo = (p: Product): boolean => p.seminovo === true || p.categoria === "seminovo";

export const tipoDoProduto = (p: Product): string => {
  if (p.categoria === "ipad") return "iPad";
  if (p.categoria === "mac") return "MacBook";
  if (p.categoria === "watch") return "Relógio";
  return "iPhone"; // iphone e seminovo
};

// "256GB" -> "256GB"; "8GB / 512GB" (memória / armazenamento) -> "512GB";
// "Consulte as Disponíveis!" e afins -> null.
export const armazenamentoDaOpcao = (opcao: string): string | null => {
  const ultimo = opcao.split("/").pop()?.trim() ?? "";
  const m = ultimo.match(/^(\d+)\s*(GB|TB)$/i);
  return m ? `${m[1]}${m[2].toUpperCase()}` : null;
};

const emGB = (armazenamento: string) =>
  parseInt(armazenamento, 10) * (armazenamento.endsWith("TB") ? 1024 : 1);

// Família da cor: usada só para escolher a bolinha de cor no filtro (o filtro usa o nome original).
export const familiaDeCor = (cor: string): string => {
  const c = semAcento(cor);
  if (c.includes("laranja")) return "Laranja";
  if (c.includes("deserto")) return "Dourado";
  if (c.includes("verde")) return "Verde";
  if (c.includes("preto") || c.includes("meia-noite")) return "Preto";
  if (c.includes("branco") || c.includes("estelar")) return "Branco";
  if (c.includes("azul") || c.includes("ultramarino")) return "Azul";
  if (c.includes("rosa")) return "Rosa";
  if (c.includes("roxo")) return "Roxo";
  if (c.includes("dourado")) return "Dourado";
  if (c.includes("amarelo")) return "Amarelo";
  if (["prateado", "silver", "cinza", "grafite"].some((t) => c.includes(t))) return "Prateado/Cinza";
  if (c.includes("natural")) return "Titânio natural";
  return cor;
};

const precoDaOpcao = (p: Product, opcao: string) => p.precosOpcoes?.[opcao] ?? p.preco;

// Preços que valem para o filtro: se o cliente escolheu armazenamento, só os dessas capacidades.
export const precosConsiderados = (p: Product, armazenamentos: string[]): number[] => {
  const opcoes = armazenamentos.length
    ? p.opcoes.filter((o) => {
        const a = armazenamentoDaOpcao(o);
        return a !== null && armazenamentos.includes(a);
      })
    : p.opcoes;
  return opcoes.length ? opcoes.map((o) => precoDaOpcao(p, o)) : [p.preco];
};

// ---------- opções disponíveis para os filtros ----------

export type Facets = {
  precoMin: number;
  precoMax: number;
  armazenamentos: string[];
  cores: string[];
  tipos: string[];
  temNovo: boolean;
  temSeminovo: boolean;
};

export function montarFacets(products: Product[]): Facets {
  const precos = products.flatMap((p) => precosConsiderados(p, []));
  const armazenamentos = new Set<string>();
  const contagemCores = new Map<string, number>();
  const tipos = new Set<string>();
  for (const p of products) {
    p.opcoes.forEach((o) => {
      const a = armazenamentoDaOpcao(o);
      if (a) armazenamentos.add(a);
    });
    new Set(p.cores).forEach((f) => contagemCores.set(f, (contagemCores.get(f) ?? 0) + 1));
    tipos.add(tipoDoProduto(p));
  }
  return {
    precoMin: precos.length ? Math.min(...precos) : 0,
    precoMax: precos.length ? Math.max(...precos) : 0,
    armazenamentos: [...armazenamentos].sort((a, b) => emGB(a) - emGB(b)),
    cores: [...contagemCores.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
      .map(([cor]) => cor),
    tipos: TIPOS_ORDEM.filter((t) => tipos.has(t)),
    temNovo: products.some((p) => !ehSeminovo(p)),
    temSeminovo: products.some(ehSeminovo),
  };
}

// ---------- filtrar e ordenar ----------

export function filtrar(products: Product[], s: FiltroState): Product[] {
  const q = semAcento(s.q.trim());
  const modelo = semAcento(s.modelo.trim());
  return products.filter((p) => {
    if (q && !(semAcento(p.nome).includes(q) || semAcento(p.shortSpec).includes(q))) return false;
    if (modelo && !semAcento(p.nome).includes(modelo)) return false;
    if (s.condicao === "novo" && ehSeminovo(p)) return false;
    if (s.condicao === "seminovo" && !ehSeminovo(p)) return false;
    if (s.tipos.length && !s.tipos.includes(tipoDoProduto(p))) return false;
    if (s.armazenamentos.length) {
      const tem = p.opcoes.some((o) => {
        const a = armazenamentoDaOpcao(o);
        return a !== null && s.armazenamentos.includes(a);
      });
      if (!tem) return false;
    }
    if (s.cores.length && !p.cores.some((c) => s.cores.includes(c))) return false;
    if (s.precoMin !== null || s.precoMax !== null) {
      const dentro = precosConsiderados(p, s.armazenamentos).some(
        (v) => (s.precoMin === null || v >= s.precoMin) && (s.precoMax === null || v <= s.precoMax),
      );
      if (!dentro) return false;
    }
    return true;
  });
}

export function ordenar(products: Product[], ordem: Ordem, armazenamentos: string[] = []): Product[] {
  const copia = [...products];
  const menor = (p: Product) => Math.min(...precosConsiderados(p, armazenamentos));
  if (ordem === "preco-asc") return copia.sort((a, b) => menor(a) - menor(b));
  if (ordem === "preco-desc") return copia.sort((a, b) => menor(b) - menor(a));
  if (ordem === "nome")
    return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { numeric: true, sensitivity: "base" }));
  return copia; // relevância = ordem do catálogo
}

export const filtrarEOrdenar = (products: Product[], s: FiltroState): Product[] =>
  ordenar(filtrar(products, s), s.ordem, s.armazenamentos);

// Quantos filtros do painel estão ligados (busca, modelo e ordem não contam).
export const contarFiltrosAtivos = (s: FiltroState): number =>
  (s.precoMin !== null || s.precoMax !== null ? 1 : 0) +
  s.armazenamentos.length +
  s.cores.length +
  s.tipos.length +
  (s.condicao !== "todas" ? 1 : 0);

// ---------- ida e volta com a URL (?ordem=preco-asc&arm=256GB,512GB...) ----------

const lista = (v: string | null) => (v ? v.split(",").map((x) => x.trim()).filter(Boolean) : []);
const numero = (v: string | null): number | null => {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

export function lerFiltros(params: URLSearchParams): FiltroState {
  const ordem = params.get("ordem");
  const cond = params.get("cond");
  return {
    q: params.get("q") ?? "",
    modelo: params.get("modelo") ?? "",
    ordem: ORDENS.some((o) => o.value === ordem) ? (ordem as Ordem) : "relevancia",
    precoMin: numero(params.get("min")),
    precoMax: numero(params.get("max")),
    armazenamentos: lista(params.get("arm")),
    cores: lista(params.get("cor")),
    tipos: lista(params.get("tipo")),
    condicao: cond === "novo" || cond === "seminovo" ? cond : "todas",
  };
}

export function filtrosParaParams(s: FiltroState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q);
  if (s.modelo) p.set("modelo", s.modelo);
  if (s.ordem !== "relevancia") p.set("ordem", s.ordem);
  if (s.precoMin !== null) p.set("min", String(s.precoMin));
  if (s.precoMax !== null) p.set("max", String(s.precoMax));
  if (s.armazenamentos.length) p.set("arm", s.armazenamentos.join(","));
  if (s.cores.length) p.set("cor", s.cores.join(","));
  if (s.tipos.length) p.set("tipo", s.tipos.join(","));
  if (s.condicao !== "todas") p.set("cond", s.condicao);
  return p;
}
