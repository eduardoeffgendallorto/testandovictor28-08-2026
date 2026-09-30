import { describe, expect, it } from "vitest";
import {
  descontoPercent,
  idsMaisBaratos,
  maiorPreco,
  menorPreco,
  montarLinhas,
  opcoesComPreco,
  temFaixaDePreco,
} from "@/data/compare";
import type { Product } from "@/data/products";

const base: Product = {
  id: "a",
  nome: "Aparelho A",
  desc: "",
  preco: 5000,
  img: "",
  imgAlt: "",
  categoria: "iphone",
  shortSpec: "",
  cores: ["Preto", "Branco"],
  opcoes: ["128GB", "256GB"],
  precosOpcoes: { "128GB": 5000, "256GB": 5600 },
  tela: "6,1 pol.",
  chip: "A17",
  camera: "48 MP",
};
const mk = (over: Partial<Product>): Product => ({ ...base, ...over });

describe("preços", () => {
  it("usa o menor e o maior preço entre as capacidades", () => {
    expect(menorPreco(base)).toBe(5000);
    expect(maiorPreco(base)).toBe(5600);
    expect(temFaixaDePreco(base)).toBe(true);
  });

  it("sem preço por capacidade, usa o preço base e não há faixa", () => {
    const p = mk({ precosOpcoes: undefined, preco: 6790 });
    expect(menorPreco(p)).toBe(6790);
    expect(temFaixaDePreco(p)).toBe(false);
  });

  it("calcula o desconto só quando o preço antigo é maior", () => {
    expect(descontoPercent(mk({ preco: 9000, precoAntigo: 10000 }))).toBe(10);
    expect(descontoPercent(mk({ preco: 9000, precoAntigo: 9000 }))).toBeNull();
    expect(descontoPercent(base)).toBeNull();
  });

  it("marca o mais barato só com 2 ou mais aparelhos", () => {
    const barato = mk({ id: "b", precosOpcoes: { "128GB": 4000 } });
    expect(idsMaisBaratos([base])).toEqual([]);
    expect(idsMaisBaratos([base, barato])).toEqual(["b"]);
  });
});

describe("capacidades", () => {
  it("ignora opções informativas como 'Consulte as Disponíveis!'", () => {
    const watch = mk({ opcoes: ["Consulte as Disponíveis!"], precosOpcoes: undefined });
    expect(opcoesComPreco(watch)).toEqual([]);
  });

  it("devolve o preço de cada capacidade", () => {
    expect(opcoesComPreco(base)).toEqual([
      { opcao: "128GB", preco: 5000 },
      { opcao: "256GB", preco: 5600 },
    ]);
  });
});

describe("linhas de comparação", () => {
  it("marca como diferente só o que muda", () => {
    const outro = mk({ id: "b", chip: "A19 Pro", seminovo: true });
    const linhas = Object.fromEntries(montarLinhas([base, outro]).map((l) => [l.chave, l]));
    expect(linhas.chip.difere).toBe(true);
    expect(linhas.condicao.difere).toBe(true);
    expect(linhas.tela.difere).toBe(false);
    expect(linhas.cores.difere).toBe(false);
  });

  it("ignora maiúsculas e espaços ao decidir se é diferente", () => {
    const outro = mk({ id: "b", tela: "  6,1 POL. " });
    const tela = montarLinhas([base, outro]).find((l) => l.chave === "tela")!;
    expect(tela.difere).toBe(false);
  });

  it("com um único aparelho nada é 'diferente'", () => {
    expect(montarLinhas([base]).every((l) => !l.difere)).toBe(true);
  });

  it("usa travessão quando o valor está vazio", () => {
    const linhas = montarLinhas([mk({ cores: [] })]);
    expect(linhas.find((l) => l.chave === "cores")!.valores[0]).toBe("—");
  });
});
