// Gera public/sitemap.xml com as páginas fixas + um item por produto ATIVO.
// Roda sozinho antes do build ("prebuild" no package.json).
//
// A lista de produtos vem do Supabase (URL e chave públicas, as mesmas de
// src/lib/supabase.ts). Se o banco não responder, usa a cópia antiga do
// catálogo (src/data/products.ts) e avisa; o build nunca quebra por causa disso.
import { readFileSync, writeFileSync } from "node:fs";

const SITE = "https://vitao.cell.eduardoeffgen.com.br";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://kcvlwqchqwvlokeoqcxz.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_tAJgCwNx-uPJFeyJw-160g_JYS-A7Sc";

const rotas = ["/", "/iphones", "/seminovos", "/ipads", "/macs", "/relogios", "/catalogo", "/comparar"];

async function idsDoBanco() {
  const url = `${SUPABASE_URL}/rest/v1/products?select=id&ativo=eq.true&order=ordem.asc`;
  const resp = await fetch(url, {
    headers: { apikey: SUPABASE_KEY },
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const linhas = await resp.json();
  if (!Array.isArray(linhas) || linhas.length === 0) throw new Error("resposta vazia");
  return linhas.map((l) => l.id);
}

function idsDoCodigo() {
  const catalogo = readFileSync(new URL("../src/data/products.ts", import.meta.url), "utf8");
  return [...catalogo.matchAll(/^\s+id: "([^"]+)"/gm)].map((m) => m[1]);
}

let ids;
let origem = "Supabase";
try {
  ids = await idsDoBanco();
} catch (e) {
  console.warn(`Aviso: não consegui ler o Supabase (${e.message}). Usando o catálogo do código.`);
  ids = idsDoCodigo();
  origem = "src/data/products.ts";
}

const urls = [...rotas, ...ids.map((id) => `/produto/${encodeURIComponent(id)}`)];
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml gerado com ${urls.length} URLs (produtos: ${origem})`);
