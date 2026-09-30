// Regras do formulário do painel: converte entre o que a pessoa digita e o que
// o banco guarda, e valida com os MESMOS limites do banco (supabase/1_schema.sql).
// Arquivo "puro" (sem React/Supabase) para ser fácil de testar.
import type { Category } from "./products";
import type { OptionRow, ProductRow } from "./mapper";

export const CATEGORIAS: { value: Category; label: string }[] = [
  { value: "iphone", label: "iPhone novo" },
  { value: "seminovo", label: "iPhone seminovo" },
  { value: "ipad", label: "iPad" },
  { value: "mac", label: "MacBook" },
  { value: "watch", label: "Apple Watch" },
];

export const LIMITES = {
  nome: 120,
  descricao: 1000,
  badge: 40,
  curto: 160, // resumo, tela, chip, câmera
  opcao: 60,
  cores: 20,
  precoMax: 1_000_000,
} as const;

export type OpcaoForm = { opcao: string; preco: string };

export type FormProduto = {
  nome: string;
  descricao: string;
  categoria: Category;
  badge: string;
  short_spec: string;
  preco: string;
  preco_antigo: string;
  cores: string; // uma por linha
  opcoes: OpcaoForm[];
  tela: string;
  chip: string;
  camera: string;
  seminovo: boolean;
  ativo: boolean;
  ordem: string;
};

export type ResultadoPreco = { ok: true; valor: number | null } | { ok: false };

/** Aceita "10490", "10490,50", "10.490,50", "R$ 10.490", "10.490". Vazio => null. */
export function parsePreco(entrada: string): ResultadoPreco {
  let s = entrada.trim().replace(/^R\$\s*/i, "").replace(/\s/g, "");
  if (!s) return { ok: true, valor: null };
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return { ok: false };
  const valor = Math.round(parseFloat(s) * 100) / 100;
  if (valor >= LIMITES.precoMax) return { ok: false };
  return { ok: true, valor };
}

export const precoParaCampo = (n: number | string | null | undefined): string =>
  n === null || n === undefined || n === "" ? "" : Number(n).toFixed(2).replace(".", ",");

export function rowToForm(row: ProductRow, opcoes: OptionRow[]): FormProduto {
  return {
    nome: row.nome,
    descricao: row.descricao,
    categoria: row.categoria,
    badge: row.badge ?? "",
    short_spec: row.short_spec,
    preco: precoParaCampo(row.preco),
    preco_antigo: precoParaCampo(row.preco_antigo),
    cores: (row.cores ?? []).join("\n"),
    opcoes: opcoes.map((o) => ({ opcao: o.opcao, preco: precoParaCampo(o.preco) })),
    tela: row.tela,
    chip: row.chip,
    camera: row.camera,
    seminovo: row.seminovo,
    ativo: row.ativo,
    ordem: String(row.ordem),
  };
}

export type ProdutoPayload = {
  nome: string;
  descricao: string;
  categoria: Category;
  badge: string | null;
  short_spec: string;
  preco: number;
  preco_antigo: number | null;
  cores: string[];
  tela: string;
  chip: string;
  camera: string;
  seminovo: boolean;
  ativo: boolean;
  ordem: number;
};

export type OpcaoPayload = { opcao: string; preco: number | null };

export type ResultadoForm =
  | { ok: true; produto: ProdutoPayload; opcoes: OpcaoPayload[] }
  | { ok: false; erros: string[] };

export function validarForm(f: FormProduto): ResultadoForm {
  const erros: string[] = [];
  const limite = (rotulo: string, valor: string, max: number) => {
    if (valor.length > max) erros.push(`${rotulo}: no máximo ${max} caracteres (tem ${valor.length}).`);
  };

  const nome = f.nome.trim();
  if (!nome) erros.push("Nome é obrigatório.");
  limite("Nome", nome, LIMITES.nome);

  const descricao = f.descricao.trim();
  limite("Descrição", descricao, LIMITES.descricao);

  const badge = f.badge.trim();
  limite("Selo", badge, LIMITES.badge);

  const short_spec = f.short_spec.trim();
  limite("Resumo", short_spec, LIMITES.curto);
  const tela = f.tela.trim();
  const chip = f.chip.trim();
  const camera = f.camera.trim();
  limite("Tela", tela, LIMITES.curto);
  limite("Chip", chip, LIMITES.curto);
  limite("Câmera/detalhe", camera, LIMITES.curto);

  const p = parsePreco(f.preco);
  let preco = 0;
  if (!p.ok || p.valor === null) erros.push("Preço inválido. Exemplo: 10490 ou 10.490,00.");
  else preco = p.valor;

  const pa = parsePreco(f.preco_antigo);
  let preco_antigo: number | null = null;
  if (!pa.ok) erros.push("Preço antigo inválido. Deixe em branco se não houver.");
  else preco_antigo = pa.valor;

  const cores: string[] = [];
  for (const linha of f.cores.split("\n")) {
    const c = linha.trim();
    if (c && !cores.some((x) => x.toLowerCase() === c.toLowerCase())) cores.push(c);
  }
  if (cores.length === 0) erros.push("Informe pelo menos uma cor.");
  if (cores.length > LIMITES.cores) erros.push(`No máximo ${LIMITES.cores} cores.`);
  for (const c of cores) limite(`Cor "${c}"`, c, LIMITES.opcao);

  const opcoes: OpcaoPayload[] = [];
  const vistas = new Set<string>();
  f.opcoes.forEach((o, i) => {
    const nomeOpcao = o.opcao.trim();
    const preco = parsePreco(o.preco);
    if (!nomeOpcao && !o.preco.trim()) return; // linha vazia: ignora
    if (!nomeOpcao) return void erros.push(`Opção ${i + 1}: falta o nome (ex.: 256GB).`);
    limite(`Opção "${nomeOpcao}"`, nomeOpcao, LIMITES.opcao);
    if (vistas.has(nomeOpcao.toLowerCase())) return void erros.push(`Opção repetida: "${nomeOpcao}".`);
    vistas.add(nomeOpcao.toLowerCase());
    if (!preco.ok) return void erros.push(`Preço inválido na opção "${nomeOpcao}".`);
    opcoes.push({ opcao: nomeOpcao, preco: preco.valor });
  });
  if (opcoes.length === 0) erros.push("Informe pelo menos uma opção (ex.: 256GB).");

  const ordemNum = Number(f.ordem.trim() === "" ? "0" : f.ordem);
  if (!Number.isInteger(ordemNum) || Math.abs(ordemNum) > 100000) erros.push("Ordem deve ser um número inteiro.");

  if (erros.length) return { ok: false, erros };
  return {
    ok: true,
    produto: {
      nome,
      descricao,
      categoria: f.categoria,
      badge: badge || null,
      short_spec,
      preco,
      preco_antigo,
      cores,
      tela,
      chip,
      camera,
      seminovo: f.seminovo,
      ativo: f.ativo,
      ordem: ordemNum,
    },
    opcoes,
  };
}

/** Lista no formato do filtro "in" do PostgREST: ("a","b"), com aspas e barras escapadas. */
export const listaPostgrest = (valores: string[]): string =>
  `(${valores.map((v) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")})`;

/** Traduz erros do Supabase para mensagens que o Victor entende. */
export function mensagemDeErro(e: unknown): string {
  const msg = e instanceof Error ? e.message : typeof e === "object" && e && "message" in e ? String((e as { message: unknown }).message) : String(e);
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("row-level security") || m.includes("permission denied") || m.includes("sem permissão"))
    return "Sem permissão para salvar. Entre com uma conta de administrador.";
  if (m.includes("check constraint")) return "Algum valor está fora do permitido (tamanho ou preço). Revise os campos.";
  if (m.includes("failed to fetch") || m.includes("networkerror") || m.includes("network request failed"))
    return "Sem conexão com o servidor. Verifique a internet e tente de novo.";
  if (m.includes("password should be") || m.includes("weak password")) return "Senha fraca. Use pelo menos 8 caracteres.";
  if (m.includes("should be different from the old password")) return "A nova senha precisa ser diferente da atual.";
  return msg || "Algo deu errado. Tente novamente.";
}
