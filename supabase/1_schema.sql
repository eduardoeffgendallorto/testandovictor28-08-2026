-- =====================================================================
-- Victor Andrade — estrutura do banco (Supabase / Postgres)
--
-- Como usar: no Supabase, abra "SQL Editor" > "New query", cole TODO este
-- arquivo e clique em "Run". Depois rode 2_catalogo.sql e 3_admin.sql.
-- Pode ser rodado de novo sem estragar nada (não apaga dados).
-- =====================================================================

-- ---------- Quem é administrador ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Sem nenhuma policy e sem permissão: o site nunca lê nem altera esta tabela.
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;

-- Pergunta "o usuário logado é admin?" sem expor a tabela acima.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Produtos ----------
create table if not exists public.products (
  id            text primary key
                check (id ~ '^[a-z0-9-]+$' and char_length(id) <= 60),
  nome          text not null check (char_length(nome) between 1 and 120),
  -- TEXTO PURO. O site exibe como texto (nunca como HTML).
  descricao     text not null default '' check (char_length(descricao) <= 1000),
  categoria     text not null
                check (categoria in ('iphone', 'seminovo', 'ipad', 'mac', 'watch')),
  badge         text check (badge is null or char_length(badge) <= 40),
  short_spec    text not null default '' check (char_length(short_spec) <= 160),
  preco         numeric(10, 2) not null check (preco >= 0 and preco < 1000000),
  preco_antigo  numeric(10, 2)
                check (preco_antigo is null or (preco_antigo >= 0 and preco_antigo < 1000000)),
  cores         text[] not null default '{}' check (cardinality(cores) <= 20),
  tela          text not null default '' check (char_length(tela) <= 160),
  chip          text not null default '' check (char_length(chip) <= 160),
  camera        text not null default '' check (char_length(camera) <= 160),
  seminovo      boolean not null default false,
  -- Chave de uma imagem que já vem no site (ex.: iphone15pro) OU uma URL https
  -- de foto enviada pelo painel.
  imagem        text not null
                check (char_length(imagem) <= 500 and (imagem ~ '^[a-z0-9-]+$' or imagem ~ '^https://')),
  imagem_alt    text not null default '' check (char_length(imagem_alt) <= 160),
  ativo         boolean not null default true,   -- false = some da vitrine
  ordem         integer not null default 0,      -- menor aparece primeiro
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- ---------- Opções (capacidade) e o preço de cada uma ----------
create table if not exists public.product_options (
  id         bigint generated always as identity primary key,
  product_id text not null references public.products (id) on delete cascade,
  opcao      text not null check (char_length(opcao) between 1 and 60),
  -- null = usa o preço do produto
  preco      numeric(10, 2) check (preco is null or (preco >= 0 and preco < 1000000)),
  ordem      integer not null default 0,
  unique (product_id, opcao)
);

-- ---------- Atualiza "atualizado_em" sozinho ----------
create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists products_atualizado_em on public.products;
create trigger products_atualizado_em
  before update on public.products
  for each row execute function public.set_atualizado_em();

-- ---------- Permissões (RLS) ----------
-- Regra geral: qualquer visitante LÊ produtos ativos; só admin ESCREVE.
alter table public.products enable row level security;
alter table public.product_options enable row level security;

grant select on public.products, public.product_options to anon, authenticated;
grant insert, update, delete on public.products, public.product_options to authenticated;
grant usage, select on sequence public.product_options_id_seq to authenticated;

drop policy if exists "produtos: leitura" on public.products;
create policy "produtos: leitura" on public.products
  for select to anon, authenticated
  using (ativo or public.is_admin());

drop policy if exists "produtos: admin insere" on public.products;
create policy "produtos: admin insere" on public.products
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "produtos: admin altera" on public.products;
create policy "produtos: admin altera" on public.products
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "produtos: admin apaga" on public.products;
create policy "produtos: admin apaga" on public.products
  for delete to authenticated
  using (public.is_admin());

drop policy if exists "opcoes: leitura" on public.product_options;
create policy "opcoes: leitura" on public.product_options
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_options.product_id and p.ativo
    )
  );

drop policy if exists "opcoes: admin insere" on public.product_options;
create policy "opcoes: admin insere" on public.product_options
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "opcoes: admin altera" on public.product_options;
create policy "opcoes: admin altera" on public.product_options
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "opcoes: admin apaga" on public.product_options;
create policy "opcoes: admin apaga" on public.product_options
  for delete to authenticated
  using (public.is_admin());
