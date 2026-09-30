// USO ÚNICO: converte o catálogo atual (src/data/products.ts) em SQL para
// popular o Supabase (supabase/2_catalogo.sql). Depois de importado, o banco
// passa a ser a fonte da verdade e este arquivo não precisa mais rodar.
//
//   node scripts/export-catalog-sql.mjs
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import ts from "typescript";

const origem = new URL("../src/data/products.ts", import.meta.url);
const tmp = new URL("../supabase/.catalogo.tmp.mjs", import.meta.url);

// As imagens viram só a "chave" (ex.: iphone15pro); o site mapeia a chave para o arquivo.
const fonte = readFileSync(origem, "utf8").replace(
  /import (\w+) from "@\/assets\/products\/([\w-]+)\.webp";/g,
  'const $1 = "$2";'
);
const js = ts.transpileModule(fonte, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
writeFileSync(tmp, js);
const { products } = await import(tmp.href);
rmSync(tmp);

// ---------- helpers ----------
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const num = (v) => (v == null ? "null" : Number(v).toFixed(2));
const arr = (a) => `array[${a.map(q).join(", ")}]::text[]`;
const opt = (s) => (s == null || s === "" ? "null" : q(s));

// Espelha as restrições do banco para falhar aqui, e não na hora de importar.
const CATEGORIAS = ["iphone", "seminovo", "ipad", "mac", "watch"];
const erros = [];
const max = (p, campo, valor, limite) => {
  if (String(valor ?? "").length > limite) erros.push(`${p.id}: ${campo} passa de ${limite} caracteres`);
};
for (const p of products) {
  if (!/^[a-z0-9-]+$/.test(p.id) || p.id.length > 60) erros.push(`${p.id}: id inválido`);
  if (!CATEGORIAS.includes(p.categoria)) erros.push(`${p.id}: categoria inválida`);
  if (!/^[a-z0-9-]+$/.test(p.img)) erros.push(`${p.id}: chave de imagem inválida (${p.img})`);
  max(p, "nome", p.nome, 120);
  max(p, "desc", p.desc, 1000);
  max(p, "badge", p.badge, 40);
  max(p, "shortSpec", p.shortSpec, 160);
  max(p, "tela", p.tela, 160);
  max(p, "chip", p.chip, 160);
  max(p, "camera", p.camera, 160);
  max(p, "imgAlt", p.imgAlt, 160);
  if (/[<>]/.test(p.desc)) erros.push(`${p.id}: descrição contém < ou > (deve ser texto puro)`);
  for (const o of p.opcoes) max(p, `opção "${o}"`, o, 60);
}
if (erros.length) {
  console.error("Catálogo não passa nas restrições do banco:\n- " + erros.join("\n- "));
  process.exit(1);
}

// ---------- SQL ----------
const linhasProdutos = products.map((p, i) =>
  `(${[
    q(p.id), q(p.nome), q(p.desc ?? ""), q(p.categoria), opt(p.badge), q(p.shortSpec ?? ""),
    num(p.preco), num(p.precoAntigo), arr(p.cores), q(p.tela ?? ""), q(p.chip ?? ""), q(p.camera ?? ""),
    p.seminovo ? "true" : "false", q(p.img), q(p.imgAlt ?? ""), "true", (i + 1) * 10,
  ].join(", ")})`
);

const linhasOpcoes = products.flatMap((p) =>
  p.opcoes.map((o, i) => `(${q(p.id)}, ${q(o)}, ${num(p.precosOpcoes?.[o])}, ${(i + 1) * 10})`)
);

const sql = `-- =====================================================================
-- Victor Andrade — catálogo inicial (${products.length} produtos), gerado a partir de src/data/products.ts
--
-- Rode DEPOIS de 1_schema.sql: SQL Editor > New query > cole tudo > Run.
-- Seguro para rodar de novo: produtos que já existem NÃO são sobrescritos,
-- então preços que o Victor já alterou no painel não voltam ao valor antigo.
-- =====================================================================

insert into public.products
  (id, nome, descricao, categoria, badge, short_spec, preco, preco_antigo, cores, tela, chip, camera, seminovo, imagem, imagem_alt, ativo, ordem)
values
${linhasProdutos.join(",\n")}
on conflict (id) do nothing;

insert into public.product_options (product_id, opcao, preco, ordem)
values
${linhasOpcoes.join(",\n")}
on conflict (product_id, opcao) do nothing;

-- Conferência: deve mostrar ${products.length} produtos e ${linhasOpcoes.length} opções.
select
  (select count(*) from public.products) as produtos,
  (select count(*) from public.product_options) as opcoes;
`;

writeFileSync(new URL("../supabase/2_catalogo.sql", import.meta.url), sql);
console.log(`OK: ${products.length} produtos, ${linhasOpcoes.length} opções -> supabase/2_catalogo.sql`);
