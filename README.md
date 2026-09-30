# Victor Andrade — Apple novos e seminovos

Loja virtual (vitrine + carrinho que fecha o pedido pelo WhatsApp) com painel
administrativo para o Victor editar preços sozinho.
Site: https://vitao.cell.eduardoeffgen.com.br/

**Stack:** React 18 · Vite · TypeScript · Tailwind · shadcn/ui · GSAP · React Router · Supabase

## Rodando localmente

```bash
npm install
npm install @supabase/supabase-js   # só na primeira vez: adiciona a dependência e atualiza o package-lock.json
npm run dev      # http://localhost:8080
npm run build    # gera dist/ (e atualiza public/sitemap.xml)
npm run lint
npm test
```

> Depois de instalar o `@supabase/supabase-js`, faça commit do `package.json` e
> do `package-lock.json`. O deploy usa `npm ci`, que falha se os dois não
> estiverem em sincronia.

## Como funciona

- **Produtos, preços, cores e capacidades** ficam no banco (Supabase), não no código.
  O site lê de lá; o Victor edita em **`/admin`** (login com e-mail e senha).
- **Segurança:** quem protege os dados são as regras do banco (RLS), em
  `supabase/1_schema.sql`. Qualquer visitante só *lê* produtos ativos; só quem
  está na tabela `admins` consegue *alterar*. A chave pública que está em
  `src/lib/supabase.ts` pode ficar no código; **nunca** coloque ali a chave
  `secret`/`service_role`.
- **Descrição do produto é texto puro** e é exibida como texto (nunca como HTML),
  então um texto malicioso digitado no painel não executa nada no site.
- Se o banco estiver fora do ar, o site mostra a cópia do catálogo embutida no
  código (`src/data/products.ts`) com um aviso de que os preços podem estar
  desatualizados.

## Banco de dados (Supabase)

Arquivos em `supabase/`, para rodar no SQL Editor nesta ordem:

1. `1_schema.sql`: tabelas e regras de segurança (pode rodar de novo sem problema).
2. `2_catalogo.sql`: catálogo inicial (não sobrescreve preços já editados).
3. `3_admin.sql`: troque o e-mail e rode para liberar um administrador.

Para dar ou tirar acesso de alguém: crie/apague o usuário em
*Authentication > Users* e rode o `3_admin.sql` com o e-mail dele. Mantenha o
cadastro público desligado em *Authentication*.

`scripts/export-catalog-sql.mjs` (uso único) gerou o `2_catalogo.sql` a partir de
`src/data/products.ts`. Depois de importado, o banco é a fonte da verdade.

## Onde mexer

- **WhatsApp, Instagram e endereço:** `src/lib/whatsapp.ts`.
- **Fotos embutidas:** `src/assets/products/*.webp` (a coluna `imagem` do produto
  guarda o nome do arquivo sem extensão).
- **Painel:** `src/pages/Admin.tsx` e `src/components/admin/`.
- **Regras e validação do formulário do painel:** `src/data/adminForm.ts` (testes em `src/test/`).
- **Cores e tema:** variáveis em `src/index.css`.

## Deploy

Push na branch `main` publica no GitHub Pages (`.github/workflows/deploy.yml`).
O workflow copia `index.html` para `404.html` para que links diretos como
`/produto/iphone15pro` funcionem. O `sitemap.xml` é gerado a cada build a
partir dos produtos ativos do banco: produto novo entra no sitemap no próximo deploy.
