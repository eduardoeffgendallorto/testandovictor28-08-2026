-- =====================================================================
-- Victor Andrade — catálogo inicial (26 produtos), gerado a partir de src/data/products.ts
--
-- Rode DEPOIS de 1_schema.sql: SQL Editor > New query > cole tudo > Run.
-- Seguro para rodar de novo: produtos que já existem NÃO são sobrescritos,
-- então preços que o Victor já alterou no painel não voltam ao valor antigo.
-- =====================================================================

insert into public.products
  (id, nome, descricao, categoria, badge, short_spec, preco, preco_antigo, cores, tela, chip, camera, seminovo, imagem, imagem_alt, ativo, ordem)
values
('iphone17promax', 'iPhone 17 Pro Max', 'O iPhone mais avançado de todos.', 'iphone', 'Lançamento 2026', 'Laranja-Cósmico • 256GB • Tela 6.9"', 10490.00, 11499.00, array['Laranja-Cósmico', 'Azul-Intenso', 'Prateado/Cinza']::text[], 'Tela Super Retina XDR de 6,9 pol.', 'Chip A19 Pro', 'Sistema de câmera Pro de 48 MP', false, 'iphone17promaxnovo', 'iPhone 17 Pro Max Laranja-Cósmico', true, 10),
('iphone17pro', 'iPhone 17 Pro', 'Potência pura em Titânio.', 'iphone', 'Lançamento 2026', 'Titânio Preto • 128GB • Tela 6.3"', 9290.00, null, array['Titânio Natural', 'Titânio Preto', 'Titânio Branco']::text[], 'Tela Super Retina XDR de 6.3 pol.', 'Chip A19 Pro', 'Sistema de câmera Pro de 48 MP', false, 'iphone17pro', 'iPhone 17 Pro Titânio Preto', true, 20),
('iphone17', 'iPhone 17', 'O iPhone mais fino de todos.', 'iphone', 'Lacrado', 'Branco • 128GB • O mais fino de todos', 7590.00, null, array['Rosa', 'Branco', 'Preto']::text[], 'Tela Super Retina XDR', 'Chip A19', 'Câmera Avançada de 48 MP', false, 'iphone17', 'iPhone 17 Branco', true, 30),
('iphone16promax', 'iPhone 16 Pro Max', 'O máximo em desempenho e câmera.', 'iphone', 'Lacrado', 'Titânio Deserto • 256GB', 8490.00, null, array['Titânio Deserto', 'Titânio Natural', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.9 pol.', 'Chip A18 Pro', 'Sistema de câmera Pro', false, 'iphone16promax', 'iPhone 16 Pro Max Titânio Deserto', true, 40),
('iphone16pro', 'iPhone 16 Pro', 'Projetado para a inteligência Apple.', 'iphone', 'Lacrado', 'Titânio Natural • 128GB', 7290.00, null, array['Titânio Natural', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.3 pol.', 'Chip A18 Pro', 'Sistema de câmera Pro', false, 'iphone16pro', 'iPhone 16 Pro Titânio Natural', true, 50),
('iphone16', 'iPhone 16', 'Com o novo Controle da Câmera.', 'iphone', 'Lacrado', 'Rosa • 128GB • Novo Botão de Câmera', 5890.00, null, array['Ultramarino', 'Verde-azulado', 'Rosa', 'Branco', 'Preto']::text[], 'Tela Super Retina XDR', 'Chip A18', 'Câmera Dupla Avançada', false, 'iphone16', 'iPhone 16 Rosa', true, 60),
('iphone15promax', 'iPhone 15 Pro Max', 'Forjado em Titânio.', 'iphone', 'Lacrado', 'Azul • 256GB • Porta USB-C', 6990.00, null, array['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.7 pol.', 'Chip A17 Pro', 'Sistema de câmera Pro de 48 MP', false, 'iphone15promax', 'iPhone 15 Pro Max Azul', true, 70),
('iphone15pro', 'iPhone 15 Pro', 'Design revolucionário em Titânio.', 'iphone', 'Lacrado', 'Titânio Natural • 128GB', 5990.00, 7299.00, array['Titânio Natural', 'Titânio Azul', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.1 pol.', 'Chip A17 Pro', 'Sistema de câmera Pro de 48 MP', false, 'iphone15pro', 'iPhone 15 Pro Titânio Natural', true, 80),
('iphone15', 'iPhone 15', 'Dynamic Island. Câmera de 48 MP. USB-C.', 'iphone', 'Lacrado', 'Preto • 128GB • Dynamic Island', 4690.00, null, array['Rosa', 'Azul', 'Preto']::text[], 'Tela Super Retina XDR de 6.1 pol.', 'Chip A16 Bionic', 'Câmera Avançada de 48 MP', false, 'iphone15', 'iPhone 15 Preto', true, 90),
('iphone14promax', 'iPhone 14 Pro Max', 'Tela gigante e a melhor bateria da linha 14.', 'iphone', 'Lacrado', 'Roxo-profundo • 128GB • Dynamic Island', 5890.00, 7299.00, array['Roxo-profundo', 'Dourado', 'Prateado', 'Preto-espacial']::text[], 'Tela Super Retina XDR de 6,7 pol.', 'Chip A16 Bionic', 'Câmera Principal de 48 MP e modo Cinema 4K', false, 'iphone14promax', 'iPhone 14 Pro Max Roxo-profundo', true, 100),
('iphone14pro', 'iPhone 14 Pro', 'A chegada da Dynamic Island e câmera de 48MP.', 'iphone', 'Lacrado', 'Preto-espacial • 128GB • Câmera 48MP', 5290.00, 6499.00, array['Roxo-profundo', 'Dourado', 'Prateado', 'Preto-espacial']::text[], 'Tela ProMotion com Dynamic Island', 'Chip A16 Bionic', 'Câmera Principal de 48 MP | Zoom de 3x', false, 'iphone14pro', 'iPhone 14 Pro Preto-espacial', true, 110),
('iphone14', 'iPhone 14', 'O equilíbrio perfeito entre potência e bateria.', 'iphone', 'Lacrado', 'Meia-noite • 128GB • Dual Camera', 3890.00, 4999.00, array['Meia-noite', 'Estelar', 'Roxo', 'Azul']::text[], 'Tela Super Retina XDR de 6,1 pol.', 'Chip A15 Bionic (GPU de 5 núcleos)', 'Sistema de câmera dupla (Principal de 12 MP)', false, 'iphone14', 'iPhone 14 Meia-noite', true, 120),
('iphone13promax', 'iPhone 13 Pro Max', 'A lenda da bateria. O iPhone que não acaba a carga.', 'iphone', 'Lacrado', 'Azul-Sierra • 128GB • Bateria Longa', 4990.00, 5999.00, array['Azul-Sierra', 'Grafite', 'Dourado', 'Prateado', 'Verde-Alpino']::text[], 'Tela Super Retina XDR de 6,7 pol.', 'Chip A15 Bionic', 'Câmera Tripla de 12 MP com Scanner LiDAR', false, 'iphone13promax', 'iPhone 13 Pro Max Azul-Sierra', true, 130),
('iphone13pro', 'iPhone 13 Pro', 'Performance profissional com tela de 120Hz.', 'iphone', 'Lacrado', 'Grafite • 128GB • Tela ProMotion 120Hz', 4490.00, 5499.00, array['Azul-Sierra', 'Grafite', 'Dourado', 'Prateado', 'Verde-Alpino']::text[], 'Tela Super Retina XDR com ProMotion', 'Chip A15 Bionic (GPU de 5 núcleos)', 'Fotos Macro e Vídeo ProRes', false, 'iphone13pro', 'iPhone 13 Pro Grafite', true, 140),
('iphone13', 'iPhone 13', 'O melhor custo-benefício para quem quer um iPhone moderno.', 'iphone', 'Lacrado', 'Estelar • 128GB • Chip A15 Bionic', 3290.00, 4299.00, array['Meia-noite', 'Estelar', 'Azul', 'Rosa', 'Verde']::text[], 'Tela Super Retina XDR de 6,1 pol.', 'Chip A15 Bionic', 'Sistema de câmera dupla de 12 MP', false, 'iphone13', 'iPhone 13 Estelar', true, 150),
('iphone17promaxseminovo', 'iPhone 17 Pro Max Seminovo', 'O iPhone mais avançado de todos.', 'seminovo', 'Seminovo', 'Laranja-Cósmico • 512GB • Tela 6.9"', 8900.00, 9500.00, array['Laranja-Cósmico']::text[], 'Tela Super Retina XDR de 6,9 pol.', 'Chip A19 Pro', 'Sistema de câmera Pro de 48 MP', true, 'iphone17promaxseminovo', 'iPhone 17 Pro Max Seminovo', true, 160),
('iphone17proseminovo', 'iPhone 17 Pro Seminovo', 'Potência pura em Titânio.', 'seminovo', 'Seminovo', 'Titânio Preto • 256GB • Tela 6.3"', 6950.00, null, array['Azul', 'Laranja-Cósmico']::text[], 'Tela Super Retina XDR de 6.3 pol.', 'Chip A19 Pro', 'Sistema de câmera Pro de 48 MP', true, 'iphone17pro', 'iPhone 17 Pro Seminovo', true, 170),
('iphone16promaxseminovo', 'iPhone 16 Pro Max Seminovo', 'O máximo em desempenho e câmera.', 'seminovo', 'Seminovo', 'Titânio Deserto • 256GB', 5600.00, 6100.00, array['Titânio Deserto', 'Titânio Natural', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.9 pol.', 'Chip A18 Pro', 'Sistema de câmera Pro', true, 'iphone16promax', 'iPhone 16 Pro Max Seminovo', true, 180),
('iphone16proseminovo', 'iPhone 16 Pro Seminovo', 'Projetado para a inteligência Apple.', 'seminovo', 'Seminovo', 'Titânio Natural • 128GB', 4700.00, null, array['Titânio Natural', 'Titânio Deserto', 'Titânio Branco', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.3 pol.', 'Chip A18 Pro', 'Sistema de câmera Pro', true, 'iphone16pro', 'iPhone 16 Pro Seminovo', true, 190),
('iphone15promaxseminovo', 'iPhone 15 Pro Max Seminovo', 'Forjado em Titânio.', 'seminovo', 'Seminovo', 'Azul • 256GB • Porta USB-C', 4500.00, null, array['Titânio Azul', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.7 pol.', 'Chip A17 Pro', 'Sistema de câmera Pro de 48 MP', true, 'iphone15promax', 'iPhone 15 Pro Max Seminovo', true, 200),
('iphone15proseminovo', 'iPhone 15 Pro Seminovo', 'Design revolucionário em Titânio.', 'seminovo', 'Seminovo', 'Titânio Natural • 128GB', 3800.00, 4000.00, array['Titânio Azul', 'Titânio Preto']::text[], 'Tela Super Retina XDR de 6.1 pol.', 'Chip A17 Pro', 'Sistema de câmera Pro de 48 MP', true, 'iphone15pro', 'iPhone 15 Pro Seminovo', true, 210),
('ipadpro11', 'iPad 11 (A16)', 'O iPad mais fino e potente já criado. Performance extrema com design ultraportátil.', 'ipad', 'Poder Extremo', 'Chip M4 • Tela OLED • 128GB', 2700.00, 2999.00, array['Azul', 'Silver', 'Rosa', 'Amarelo']::text[], 'Tela Ultra Retina XDR (OLED Tandem)', 'Chip M4 da Apple (CPU de 9 núcleos)', 'Câmera Ultra-Angular de 12 MP (Paisagem)', false, 'ipad11', 'iPad 11 A16', true, 220),
('macbookairm4', 'MacBook Air 13" (Chip M4)', 'O notebook mais amado da Apple. Fino, leve e silencioso, com bateria que dura o dia todo.', 'mac', 'M4', 'Chip M4 • 256GB', 5490.00, 6999.00, array['Cinza-espacial', 'Prateado', 'Dourado']::text[], 'Tela Retina de 13.3 pol. com Tecnologia P3', 'Chip M4 da Apple', 'Câmera FaceTime HD de 720p', false, 'mac13', 'MacBook Air 13 M4', true, 230),
('macbookairm5', 'MacBook Air 13" (Chip M5)', 'Design totalmente novo, mais fino e com a incrível tela Liquid Retina. Potência para tudo.', 'mac', 'M5', 'Chip M5 • 256GB', 7190.00, 8499.00, array['Meia-noite', 'Estelar', 'Prateado', 'Cinza-espacial']::text[], 'Tela Liquid Retina de 13.6 pol. (500 nits)', 'Chip M5 da Apple', 'Câmera FaceTime HD de 1080p', false, 'mac13chipm5', 'MacBook Air 13 M5', true, 240),
('macbookprom6', 'MacBook Pro 14" (Chip M5)', 'Uma fera para o trabalho profissional. Tela ProMotion de 120Hz e performance extrema.', 'mac', 'M5 Pro', 'Chip M5 • 512GB', 12890.00, 14999.00, array['Preto-espacial', 'Prateado']::text[], 'Tela Liquid Retina XDR com ProMotion (120Hz)', 'Chip M5 (Arquitetura de 3nm)', 'Sistema de Som com Seis Alto-falantes', false, 'macpro', 'MacBook Pro 14 M5', true, 250),
('applewatchultra3', 'Apple Watch Ultra 3', 'Caixa de titânio de 49 mm. O relógio definitivo para esportes e aventura.', 'watch', 'Lacrado', 'Titânio Natural • 49 mm • GPS + Celular', 6790.00, 7499.00, array['Titânio Natural', 'Titânio Preto']::text[], 'Tela Retina Sempre Ativa (Até 3000 nits)', 'S10 SiP de dois núcleos', 'GPS de Dupla Frequência e Sensores de Saúde', false, 'applewatchultra3', 'Apple Watch Ultra 3', true, 260)
on conflict (id) do nothing;

insert into public.product_options (product_id, opcao, preco, ordem)
values
('iphone17promax', '256GB', 10490.00, 10),
('iphone17promax', '512GB', 10990.00, 20),
('iphone17promax', '1TB', 11490.00, 30),
('iphone17pro', '128GB', 9290.00, 10),
('iphone17pro', '256GB', 9990.00, 20),
('iphone17pro', '512GB', 10490.00, 30),
('iphone17', '128GB', 7590.00, 10),
('iphone17', '256GB', 8000.00, 20),
('iphone16promax', '256GB', 8490.00, 10),
('iphone16promax', '512GB', 8790.00, 20),
('iphone16pro', '128GB', 7290.00, 10),
('iphone16pro', '256GB', 7500.00, 20),
('iphone16', '128GB', 5890.00, 10),
('iphone16', '256GB', 6300.00, 20),
('iphone15promax', '256GB', 6990.00, 10),
('iphone15promax', '512GB', 7390.00, 20),
('iphone15pro', '128GB', 5990.00, 10),
('iphone15pro', '256GB', 6300.00, 20),
('iphone15', '128GB', 4690.00, 10),
('iphone15', '256GB', 5000.00, 20),
('iphone14promax', '128GB', 5890.00, 10),
('iphone14promax', '256GB', 6590.00, 20),
('iphone14promax', '512GB', 7490.00, 30),
('iphone14promax', '1TB', 8390.00, 40),
('iphone14pro', '128GB', 5290.00, 10),
('iphone14pro', '256GB', 5990.00, 20),
('iphone14pro', '512GB', 6890.00, 30),
('iphone14pro', '1TB', 7790.00, 40),
('iphone14', '128GB', 3890.00, 10),
('iphone14', '256GB', 4590.00, 20),
('iphone14', '512GB', 5490.00, 30),
('iphone13promax', '128GB', 4990.00, 10),
('iphone13promax', '256GB', 5690.00, 20),
('iphone13promax', '512GB', 6590.00, 30),
('iphone13promax', '1TB', 7490.00, 40),
('iphone13pro', '128GB', 4490.00, 10),
('iphone13pro', '256GB', 5190.00, 20),
('iphone13pro', '512GB', 6090.00, 30),
('iphone13pro', '1TB', 6990.00, 40),
('iphone13', '128GB', 3290.00, 10),
('iphone13', '256GB', 3990.00, 20),
('iphone13', '512GB', 4890.00, 30),
('iphone17promaxseminovo', '512GB', null, 10),
('iphone17proseminovo', '256GB', null, 10),
('iphone16promaxseminovo', '256GB', null, 10),
('iphone16proseminovo', '128GB', 4700.00, 10),
('iphone16proseminovo', '256GB', 4950.00, 20),
('iphone16proseminovo', '512GB', 5200.00, 30),
('iphone15promaxseminovo', '256GB', 4500.00, 10),
('iphone15promaxseminovo', '512GB', 4700.00, 20),
('iphone15proseminovo', '128GB', 3800.00, 10),
('iphone15proseminovo', '256GB', 4000.00, 20),
('ipadpro11', '128GB', null, 10),
('macbookairm4', '8GB / 256GB', 5490.00, 10),
('macbookairm4', '16GB / 512GB', 7290.00, 20),
('macbookairm5', '8GB / 256GB', 7190.00, 10),
('macbookairm5', '16GB / 512GB', 8990.00, 20),
('macbookprom6', '8GB / 512GB', 12890.00, 10),
('macbookprom6', '16GB / 512GB', 14490.00, 20),
('macbookprom6', '16GB / 1TB', 16290.00, 30),
('applewatchultra3', 'Consulte as Disponíveis!', null, 10)
on conflict (product_id, opcao) do nothing;

-- Conferência: deve mostrar 26 produtos e 61 opções.
select
  (select count(*) from public.products) as produtos,
  (select count(*) from public.product_options) as opcoes;
