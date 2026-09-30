-- =====================================================================
-- Torna um usuário administrador do painel.
--
-- Antes: crie o usuário em Authentication > Users > Add user.
-- Depois: TROQUE o e-mail abaixo pelo e-mail dele e rode ("Run").
-- Para dar acesso a mais alguém, repita com o e-mail da pessoa.
-- =====================================================================
insert into public.admins (user_id)
select id from auth.users where email = 'TROQUE-PELO-EMAIL-DO-VICTOR@exemplo.com'
on conflict do nothing;

-- Conferência: deve listar 1 linha com o e-mail que você colocou.
select u.email, a.user_id
from public.admins a
join auth.users u on u.id = a.user_id;
