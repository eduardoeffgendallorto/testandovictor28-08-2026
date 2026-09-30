import { describe, expect, it } from "vitest";
import { listaPostgrest, mensagemDeErro, parsePreco, precoParaCampo, validarForm, type FormProduto } from "@/data/adminForm";

const base: FormProduto = {
  nome: "iPhone 15 Pro",
  descricao: "Design em titânio.",
  categoria: "iphone",
  badge: "Lacrado",
  short_spec: "Titânio Natural • 128GB",
  preco: "5990",
  preco_antigo: "7.299,00",
  cores: "Titânio Natural\nTitânio Azul\n\n  titânio azul  ",
  opcoes: [
    { opcao: "128GB", preco: "" },
    { opcao: "256GB", preco: "6.490,50" },
  ],
  tela: "6,1 pol.",
  chip: "A17 Pro",
  camera: "48 MP",
  seminovo: false,
  ativo: true,
  ordem: "10",
};

describe("parsePreco", () => {
  it.each([
    ["10490", 10490],
    ["10490,5", 10490.5],
    ["10.490,00", 10490],
    ["R$ 10.490", 10490],
    ["10.49", 10.49],
    ["  5990  ", 5990],
  ])("aceita %s", (entrada, esperado) => {
    expect(parsePreco(entrada)).toEqual({ ok: true, valor: esperado });
  });

  it("vazio vira null", () => {
    expect(parsePreco("  ")).toEqual({ ok: true, valor: null });
  });

  it.each(["abc", "-10", "10,999", "1e5", "10..0", "1000000"])("recusa %s", (entrada) => {
    expect(parsePreco(entrada)).toEqual({ ok: false });
  });
});

describe("validarForm", () => {
  it("converte um formulário válido", () => {
    const r = validarForm(base);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.produto.preco).toBe(5990);
    expect(r.produto.preco_antigo).toBe(7299);
    expect(r.produto.cores).toEqual(["Titânio Natural", "Titânio Azul"]); // sem vazias nem repetidas
    expect(r.opcoes).toEqual([
      { opcao: "128GB", preco: null },
      { opcao: "256GB", preco: 6490.5 },
    ]);
    expect(r.produto.badge).toBe("Lacrado");
  });

  it("selo vazio vira null", () => {
    const r = validarForm({ ...base, badge: "  " });
    expect(r.ok && r.produto.badge).toBe(null);
  });

  it("aponta todos os problemas de uma vez", () => {
    const r = validarForm({ ...base, nome: " ", preco: "x", cores: "", opcoes: [{ opcao: "", preco: "" }] });
    expect(r.ok).toBe(false);
    if (!("erros" in r)) throw new Error("era para falhar");
    expect(r.erros).toHaveLength(4);
  });

  it("respeita os limites do banco", () => {
    const r = validarForm({ ...base, descricao: "a".repeat(1001), badge: "b".repeat(41) });
    expect(r.ok).toBe(false);
  });

  it("recusa opção repetida (sem diferenciar maiúsculas)", () => {
    const r = validarForm({ ...base, opcoes: [{ opcao: "256GB", preco: "" }, { opcao: "256gb", preco: "" }] });
    expect(r.ok).toBe(false);
  });
});

describe("utilitários", () => {
  it("formata preço para o campo", () => {
    expect(precoParaCampo(10490)).toBe("10490,00");
    expect(precoParaCampo("6490.50")).toBe("6490,50");
    expect(precoParaCampo(null)).toBe("");
  });

  it("monta a lista do filtro 'in' com aspas escapadas", () => {
    expect(listaPostgrest(["8GB / 512GB", 'a"b', "x,y"])).toBe('("8GB / 512GB","a\\"b","x,y")');
  });

  it("traduz erros comuns", () => {
    expect(mensagemDeErro(new Error("Invalid login credentials"))).toBe("E-mail ou senha incorretos.");
    expect(mensagemDeErro({ message: 'new row violates row-level security policy' })).toMatch(/Sem permissão/);
    expect(mensagemDeErro(new Error("Failed to fetch"))).toMatch(/Sem conexão/);
  });
});
