import { describe, expect, it } from "vitest";
import {
  FILTRO_VAZIO,
  armazenamentoDaOpcao,
  contarFiltrosAtivos,
  familiaDeCor,
  filtrar,
  filtrarEOrdenar,
  filtrosParaParams,
  lerFiltros,
  montarFacets,
  ordenar,
  type FiltroState,
} from "@/data/catalogFilters";
import type { Product } from "@/data/products";

const mk = (over: Partial<Product>): Product => ({
  id: "x",
  nome: "Aparelho",
  desc: "",
  preco: 5000,
  img: "",
  imgAlt: "",
  categoria: "iphone",
  shortSpec: "",
  cores: ["Preto"],
  opcoes: ["128GB", "256GB"],
  precosOpcoes: { "128GB": 5000, "256GB": 5600 },
  tela: "",
  chip: "",
  camera: "",
  ...over,
});

const a = mk({ id: "a", nome: "iPhone 15", cores: ["Titânio Azul", "Rosa"] });
const b = mk({
  id: "b",
  nome: "iPhone 17 Pro",
  categoria: "iphone",
  preco: 9000,
  opcoes: ["256GB", "1TB"],
  precosOpcoes: { "256GB": 9000, "1TB": 11000 },
  cores: ["Laranja-Cósmico", "Meia-noite"],
});
const c = mk({
  id: "c",
  nome: "iPhone 16 Pro",
  categoria: "seminovo",
  seminovo: true,
  preco: 4000,
  opcoes: ["128GB"],
  precosOpcoes: { "128GB": 4000 },
});
const mac = mk({
  id: "m",
  nome: "MacBook Air",
  categoria: "mac",
  preco: 8000,
  opcoes: ["8GB / 256GB", "16GB / 512GB"],
  precosOpcoes: { "8GB / 256GB": 8000, "16GB / 512GB": 9500 },
  cores: ["Cinza-espacial"],
});
const relogio = mk({ id: "w", nome: "Apple Watch", categoria: "watch", opcoes: ["Consulte as Disponíveis!"], precosOpcoes: undefined, preco: 7000 });
const todos = [a, b, c, mac, relogio];

const com = (patch: Partial<FiltroState>): FiltroState => ({ ...FILTRO_VAZIO, ...patch });
const ids = (l: Product[]) => l.map((p) => p.id);

describe("características", () => {
  it("lê o armazenamento (ignora a memória e as opções informativas)", () => {
    expect(armazenamentoDaOpcao("256GB")).toBe("256GB");
    expect(armazenamentoDaOpcao("16GB / 1tb")).toBe("1TB");
    expect(armazenamentoDaOpcao("Consulte as Disponíveis!")).toBeNull();
  });
  it("família da cor (só para a bolinha do filtro)", () => {
    expect(familiaDeCor("Titânio Preto")).toBe("Preto");
    expect(familiaDeCor("Meia-noite")).toBe("Preto");
    expect(familiaDeCor("Verde-azulado")).toBe("Verde");
    expect(familiaDeCor("Cinza-espacial")).toBe("Prateado/Cinza");
    expect(familiaDeCor("Titânio Deserto")).toBe("Dourado");
    expect(familiaDeCor("Cor Nova")).toBe("Cor Nova");
  });
});

describe("filtrar", () => {
  it("sem filtros devolve tudo", () => expect(filtrar(todos, FILTRO_VAZIO)).toHaveLength(5));
  it("condição novo/seminovo", () => {
    expect(ids(filtrar(todos, com({ condicao: "seminovo" })))).toEqual(["c"]);
    expect(ids(filtrar(todos, com({ condicao: "novo" })))).toEqual(["a", "b", "m", "w"]);
  });
  it("armazenamento (inclui Macs com memória na opção)", () => {
    expect(ids(filtrar(todos, com({ armazenamentos: ["1TB"] })))).toEqual(["b"]);
    expect(ids(filtrar(todos, com({ armazenamentos: ["512GB"] })))).toEqual(["m"]);
  });
  it("cor pelo nome original do catálogo", () => {
    expect(ids(filtrar(todos, com({ cores: ["Preto"] })))).toEqual(["c", "w"]);
    expect(ids(filtrar(todos, com({ cores: ["Meia-noite"] })))).toEqual(["b"]);
    expect(ids(filtrar(todos, com({ cores: ["Titânio Azul", "Cinza-espacial"] })))).toEqual(["a", "m"]);
  });
  it("faixa de preço considera todas as capacidades", () => {
    expect(ids(filtrar(todos, com({ precoMax: 4500 })))).toEqual(["c"]);
    // b custa 9000 (256GB) e 11000 (1TB): entra em 10.000–12.000 pela capacidade de 1TB
    expect(ids(filtrar(todos, com({ precoMin: 10000 })))).toEqual(["b"]);
  });
  it("preço respeita o armazenamento escolhido", () => {
    // com 256GB marcado, o b vale 9000 e não entra em "a partir de 10000"
    expect(filtrar(todos, com({ armazenamentos: ["256GB"], precoMin: 10000 }))).toEqual([]);
  });
  it("tipo de aparelho", () => {
    expect(ids(filtrar(todos, com({ tipos: ["MacBook", "Relógio"] })))).toEqual(["m", "w"]);
    expect(ids(filtrar(todos, com({ tipos: ["iPhone"] })))).toEqual(["a", "b", "c"]);
  });
  it("busca ignora acento e caixa; modelo filtra pelo nome", () => {
    expect(ids(filtrar(todos, com({ q: "MACBOOK" })))).toEqual(["m"]);
    expect(ids(filtrar(todos, com({ modelo: "iPhone 17" })))).toEqual(["b"]);
  });
  it("combina filtros (E entre grupos)", () => {
    expect(ids(filtrar(todos, com({ condicao: "novo", cores: ["Meia-noite"], armazenamentos: ["256GB"] })))).toEqual(["b"]);
  });
});

describe("ordenar", () => {
  it("relevância mantém a ordem do catálogo", () => expect(ids(ordenar(todos, "relevancia"))).toEqual(ids(todos)));
  it("menor e maior preço usam o 'a partir de'", () => {
    expect(ids(ordenar(todos, "preco-asc"))).toEqual(["c", "a", "w", "m", "b"]);
    expect(ids(ordenar(todos, "preco-desc"))).toEqual(["b", "m", "w", "a", "c"]);
  });
  it("nome A–Z entende números", () => {
    const l = [mk({ id: "1", nome: "iPhone 15" }), mk({ id: "2", nome: "iPhone 9" }), mk({ id: "3", nome: "iPad" })];
    expect(ids(ordenar(l, "nome"))).toEqual(["3", "2", "1"]);
  });
  it("não altera a lista original", () => {
    const copia = [...todos];
    ordenar(todos, "preco-asc");
    expect(todos).toEqual(copia);
  });
  it("filtrarEOrdenar junta os dois", () => {
    expect(ids(filtrarEOrdenar(todos, com({ tipos: ["iPhone"], ordem: "preco-desc" })))).toEqual(["b", "a", "c"]);
  });
});

describe("facets", () => {
  it("lista só o que existe, em ordem útil", () => {
    const f = montarFacets(todos);
    expect(f.cores).toContain("Meia-noite");
    expect(f.armazenamentos).toEqual(["128GB", "256GB", "512GB", "1TB"]);
    expect(f.tipos).toEqual(["iPhone", "MacBook", "Relógio"]);
    expect(f.temNovo && f.temSeminovo).toBe(true);
    expect(f.precoMin).toBe(4000);
    expect(f.precoMax).toBe(11000);
  });
  it("em página só de novos, não oferece seminovo", () => {
    expect(montarFacets([a, b]).temSeminovo).toBe(false);
  });
});

describe("URL", () => {
  it("ida e volta sem perder nada", () => {
    const s = com({
      q: "pro",
      modelo: "iPhone 16",
      ordem: "preco-asc",
      precoMin: 3000,
      precoMax: 9000,
      armazenamentos: ["256GB", "1TB"],
      cores: ["Titânio Natural", "Rosa"],
      tipos: ["iPhone"],
      condicao: "seminovo",
    });
    expect(lerFiltros(filtrosParaParams(s))).toEqual(s);
  });
  it("estado vazio gera URL limpa e valores inválidos são ignorados", () => {
    expect(filtrosParaParams(FILTRO_VAZIO).toString()).toBe("");
    const s = lerFiltros(new URLSearchParams("ordem=xyz&min=abc&max=-5&cond=outro"));
    expect(s).toEqual(FILTRO_VAZIO);
  });
});

describe("contarFiltrosAtivos", () => {
  it("preço conta como um; busca e ordem não contam", () => {
    expect(contarFiltrosAtivos(FILTRO_VAZIO)).toBe(0);
    expect(contarFiltrosAtivos(com({ q: "x", ordem: "nome" }))).toBe(0);
    expect(contarFiltrosAtivos(com({ precoMin: 1, precoMax: 2, cores: ["Preto", "Azul"], condicao: "novo" }))).toBe(4);
  });
});
