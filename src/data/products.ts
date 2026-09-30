// Catálogo único — fonte da verdade. Para adicionar produto: importa imagem + adiciona objeto.
import ipad11 from "@/assets/products/ipad11.webp";
import iphone13 from "@/assets/products/iphone13.webp";
import iphone13pro from "@/assets/products/iphone13pro.webp";
import iphone13promax from "@/assets/products/iphone13promax.webp";
import iphone14 from "@/assets/products/iphone14.webp";
import iphone14pro from "@/assets/products/iphone14pro.webp";
import iphone14promax from "@/assets/products/iphone14promax.webp";
import iphone15 from "@/assets/products/iphone15.webp";
import iphone15pro from "@/assets/products/iphone15pro.webp";
import iphone15promax from "@/assets/products/iphone15promax.webp";
import iphone16 from "@/assets/products/iphone16.webp";
import iphone16pro from "@/assets/products/iphone16pro.webp";
import iphone16promax from "@/assets/products/iphone16promax.webp";
import iphone17 from "@/assets/products/iphone17.webp";
import iphone17pro from "@/assets/products/iphone17pro.webp";
import iphone17promaxnovo from "@/assets/products/iphone17promaxnovo.webp";
import iphone17promaxseminovo from "@/assets/products/iphone17promaxseminovo.webp";
import applewatchultra3 from "@/assets/products/applewatchultra3.webp";
import mac13 from "@/assets/products/mac13.webp";
import mac13chipm5 from "@/assets/products/mac13chipm5.webp";
import macpro from "@/assets/products/macpro.webp";

export type Category = "iphone" | "seminovo" | "ipad" | "mac" | "watch";

export type Product = {
  id: string;
  nome: string;
  desc: string;
  preco: number;
  precoAntigo?: number;
  img: string;
  imgAlt: string;
  categoria: Category;
  badge?: string;
  shortSpec: string;
  cores: string[];
  opcoes: string[];
  precosOpcoes?: Record<string, number>;
  tela: string;
  chip: string;
  camera: string;
  seminovo?: boolean;
};

const p = (n: number) => n;

export const products: Product[] = [
  // ============ iPHONES NOVOS ============
  {
    id: "iphone17promax",
    nome: "iPhone 17 Pro Max",
    desc: "O iPhone mais avançado de todos.",
    precoAntigo: p(11499), preco: p(10490),
    img: iphone17promaxnovo, imgAlt: "iPhone 17 Pro Max Laranja-Cósmico",
    categoria: "iphone", badge: "Lançamento 2026",
    shortSpec: "Laranja-Cósmico • 256GB • Tela 6.9\"",
    cores: ["Laranja-Cósmico", "Azul-Intenso", "Prateado/Cinza"],
    opcoes: ["256GB", "512GB", "1TB"],
    precosOpcoes: { "256GB": 10490, "512GB": 10990, "1TB": 11490 },
    tela: "Tela Super Retina XDR de 6,9 pol.", chip: "Chip A19 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone17pro",
    nome: "iPhone 17 Pro",
    desc: "Potência pura em Titânio.",
    preco: p(9290),
    img: iphone17pro, imgAlt: "iPhone 17 Pro Titânio Preto",
    categoria: "iphone", badge: "Lançamento 2026",
    shortSpec: "Titânio Preto • 128GB • Tela 6.3\"",
    cores: ["Titânio Natural", "Titânio Preto", "Titânio Branco"],
    opcoes: ["128GB", "256GB", "512GB"],
    precosOpcoes: { "128GB": 9290, "256GB": 9990, "512GB": 10490 },
    tela: "Tela Super Retina XDR de 6.3 pol.", chip: "Chip A19 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone17",
    nome: "iPhone 17",
    desc: "O iPhone mais fino de todos.",
    preco: p(7590),
    img: iphone17, imgAlt: "iPhone 17 Branco",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Branco • 128GB • O mais fino de todos",
    cores: ["Rosa", "Branco", "Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 7590, "256GB": 8000 },
    tela: "Tela Super Retina XDR", chip: "Chip A19",
    camera: "Câmera Avançada de 48 MP",
  },
  {
    id: "iphone16promax",
    nome: "iPhone 16 Pro Max",
    desc: "O máximo em desempenho e câmera.",
    preco: p(8490),
    img: iphone16promax, imgAlt: "iPhone 16 Pro Max Titânio Deserto",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Titânio Deserto • 256GB",
    cores: ["Titânio Deserto", "Titânio Natural", "Titânio Branco", "Titânio Preto"],
    opcoes: ["256GB", "512GB"],
    precosOpcoes: { "256GB": 8490, "512GB": 8790 },
    tela: "Tela Super Retina XDR de 6.9 pol.", chip: "Chip A18 Pro",
    camera: "Sistema de câmera Pro",
  },
  {
    id: "iphone16pro",
    nome: "iPhone 16 Pro",
    desc: "Projetado para a inteligência Apple.",
    preco: p(7290),
    img: iphone16pro, imgAlt: "iPhone 16 Pro Titânio Natural",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Titânio Natural • 128GB",
    cores: ["Titânio Natural", "Titânio Branco", "Titânio Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 7290, "256GB": 7500 },
    tela: "Tela Super Retina XDR de 6.3 pol.", chip: "Chip A18 Pro",
    camera: "Sistema de câmera Pro",
  },
  {
    id: "iphone16",
    nome: "iPhone 16",
    desc: "Com o novo Controle da Câmera.",
    preco: p(5890),
    img: iphone16, imgAlt: "iPhone 16 Rosa",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Rosa • 128GB • Novo Botão de Câmera",
    cores: ["Ultramarino", "Verde-azulado", "Rosa", "Branco", "Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 5890, "256GB": 6300 },
    tela: "Tela Super Retina XDR", chip: "Chip A18",
    camera: "Câmera Dupla Avançada",
  },
  {
    id: "iphone15promax",
    nome: "iPhone 15 Pro Max",
    desc: "Forjado em Titânio.",
    preco: p(6990),
    img: iphone15promax, imgAlt: "iPhone 15 Pro Max Azul",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Azul • 256GB • Porta USB-C",
    cores: ["Titânio Natural", "Titânio Azul", "Titânio Branco", "Titânio Preto"],
    opcoes: ["256GB", "512GB"],
    precosOpcoes: { "256GB": 6990, "512GB": 7390 },
    tela: "Tela Super Retina XDR de 6.7 pol.", chip: "Chip A17 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone15pro",
    nome: "iPhone 15 Pro",
    desc: "Design revolucionário em Titânio.",
    precoAntigo: p(7299), preco: p(5990),
    img: iphone15pro, imgAlt: "iPhone 15 Pro Titânio Natural",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Titânio Natural • 128GB",
    cores: ["Titânio Natural", "Titânio Azul", "Titânio Branco", "Titânio Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 5990, "256GB": 6300 },
    tela: "Tela Super Retina XDR de 6.1 pol.", chip: "Chip A17 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone15",
    nome: "iPhone 15",
    desc: "Dynamic Island. Câmera de 48 MP. USB-C.",
    preco: p(4690),
    img: iphone15, imgAlt: "iPhone 15 Preto",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Preto • 128GB • Dynamic Island",
    cores: ["Rosa", "Azul", "Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 4690, "256GB": 5000 },
    tela: "Tela Super Retina XDR de 6.1 pol.", chip: "Chip A16 Bionic",
    camera: "Câmera Avançada de 48 MP",
  },
  {
    id: "iphone14promax",
    nome: "iPhone 14 Pro Max",
    desc: "Tela gigante e a melhor bateria da linha 14.",
    precoAntigo: p(7299), preco: p(5890),
    img: iphone14promax, imgAlt: "iPhone 14 Pro Max Roxo-profundo",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Roxo-profundo • 128GB • Dynamic Island",
    cores: ["Roxo-profundo", "Dourado", "Prateado", "Preto-espacial"],
    opcoes: ["128GB", "256GB", "512GB", "1TB"],
    precosOpcoes: { "128GB": 5890, "256GB": 6590, "512GB": 7490, "1TB": 8390 },
    tela: "Tela Super Retina XDR de 6,7 pol.", chip: "Chip A16 Bionic",
    camera: "Câmera Principal de 48 MP e modo Cinema 4K",
  },
  {
    id: "iphone14pro",
    nome: "iPhone 14 Pro",
    desc: "A chegada da Dynamic Island e câmera de 48MP.",
    precoAntigo: p(6499), preco: p(5290),
    img: iphone14pro, imgAlt: "iPhone 14 Pro Preto-espacial",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Preto-espacial • 128GB • Câmera 48MP",
    cores: ["Roxo-profundo", "Dourado", "Prateado", "Preto-espacial"],
    opcoes: ["128GB", "256GB", "512GB", "1TB"],
    precosOpcoes: { "128GB": 5290, "256GB": 5990, "512GB": 6890, "1TB": 7790 },
    tela: "Tela ProMotion com Dynamic Island", chip: "Chip A16 Bionic",
    camera: "Câmera Principal de 48 MP | Zoom de 3x",
  },
  {
    id: "iphone14",
    nome: "iPhone 14",
    desc: "O equilíbrio perfeito entre potência e bateria.",
    precoAntigo: p(4999), preco: p(3890),
    img: iphone14, imgAlt: "iPhone 14 Meia-noite",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Meia-noite • 128GB • Dual Camera",
    cores: ["Meia-noite", "Estelar", "Roxo", "Azul"],
    opcoes: ["128GB", "256GB", "512GB"],
    precosOpcoes: { "128GB": 3890, "256GB": 4590, "512GB": 5490 },
    tela: "Tela Super Retina XDR de 6,1 pol.", chip: "Chip A15 Bionic (GPU de 5 núcleos)",
    camera: "Sistema de câmera dupla (Principal de 12 MP)",
  },
  {
    id: "iphone13promax",
    nome: "iPhone 13 Pro Max",
    desc: "A lenda da bateria. O iPhone que não acaba a carga.",
    precoAntigo: p(5999), preco: p(4990),
    img: iphone13promax, imgAlt: "iPhone 13 Pro Max Azul-Sierra",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Azul-Sierra • 128GB • Bateria Longa",
    cores: ["Azul-Sierra", "Grafite", "Dourado", "Prateado", "Verde-Alpino"],
    opcoes: ["128GB", "256GB", "512GB", "1TB"],
    precosOpcoes: { "128GB": 4990, "256GB": 5690, "512GB": 6590, "1TB": 7490 },
    tela: "Tela Super Retina XDR de 6,7 pol.", chip: "Chip A15 Bionic",
    camera: "Câmera Tripla de 12 MP com Scanner LiDAR",
  },
  {
    id: "iphone13pro",
    nome: "iPhone 13 Pro",
    desc: "Performance profissional com tela de 120Hz.",
    precoAntigo: p(5499), preco: p(4490),
    img: iphone13pro, imgAlt: "iPhone 13 Pro Grafite",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Grafite • 128GB • Tela ProMotion 120Hz",
    cores: ["Azul-Sierra", "Grafite", "Dourado", "Prateado", "Verde-Alpino"],
    opcoes: ["128GB", "256GB", "512GB", "1TB"],
    precosOpcoes: { "128GB": 4490, "256GB": 5190, "512GB": 6090, "1TB": 6990 },
    tela: "Tela Super Retina XDR com ProMotion", chip: "Chip A15 Bionic (GPU de 5 núcleos)",
    camera: "Fotos Macro e Vídeo ProRes",
  },
  {
    id: "iphone13",
    nome: "iPhone 13",
    desc: "O melhor custo-benefício para quem quer um iPhone moderno.",
    precoAntigo: p(4299), preco: p(3290),
    img: iphone13, imgAlt: "iPhone 13 Estelar",
    categoria: "iphone", badge: "Lacrado",
    shortSpec: "Estelar • 128GB • Chip A15 Bionic",
    cores: ["Meia-noite", "Estelar", "Azul", "Rosa", "Verde"],
    opcoes: ["128GB", "256GB", "512GB"],
    precosOpcoes: { "128GB": 3290, "256GB": 3990, "512GB": 4890 },
    tela: "Tela Super Retina XDR de 6,1 pol.", chip: "Chip A15 Bionic",
    camera: "Sistema de câmera dupla de 12 MP",
  },

  // ============ SEMINOVOS ============
  {
    id: "iphone17promaxseminovo",
    nome: "iPhone 17 Pro Max Seminovo",
    desc: "O iPhone mais avançado de todos.",
    precoAntigo: p(9500), preco: p(8900), seminovo: true,
    img: iphone17promaxseminovo, imgAlt: "iPhone 17 Pro Max Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Laranja-Cósmico • 512GB • Tela 6.9\"",
    cores: ["Laranja-Cósmico"], opcoes: ["512GB"],
    tela: "Tela Super Retina XDR de 6,9 pol.", chip: "Chip A19 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone17proseminovo",
    nome: "iPhone 17 Pro Seminovo",
    desc: "Potência pura em Titânio.",
    preco: p(6950), seminovo: true,
    img: iphone17pro, imgAlt: "iPhone 17 Pro Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Titânio Preto • 256GB • Tela 6.3\"",
    cores: ["Azul", "Laranja-Cósmico"], opcoes: ["256GB"],
    tela: "Tela Super Retina XDR de 6.3 pol.", chip: "Chip A19 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone16promaxseminovo",
    nome: "iPhone 16 Pro Max Seminovo",
    desc: "O máximo em desempenho e câmera.",
    precoAntigo: p(6100), preco: p(5600), seminovo: true,
    img: iphone16promax, imgAlt: "iPhone 16 Pro Max Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Titânio Deserto • 256GB",
    cores: ["Titânio Deserto", "Titânio Natural", "Titânio Branco", "Titânio Preto"],
    opcoes: ["256GB"],
    tela: "Tela Super Retina XDR de 6.9 pol.", chip: "Chip A18 Pro",
    camera: "Sistema de câmera Pro",
  },
  {
    id: "iphone16proseminovo",
    nome: "iPhone 16 Pro Seminovo",
    desc: "Projetado para a inteligência Apple.",
    preco: p(4700), seminovo: true,
    img: iphone16pro, imgAlt: "iPhone 16 Pro Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Titânio Natural • 128GB",
    cores: ["Titânio Natural", "Titânio Deserto", "Titânio Branco", "Titânio Preto"],
    opcoes: ["128GB", "256GB", "512GB"],
    precosOpcoes: { "128GB": 4700, "256GB": 4950, "512GB": 5200 },
    tela: "Tela Super Retina XDR de 6.3 pol.", chip: "Chip A18 Pro",
    camera: "Sistema de câmera Pro",
  },
  {
    id: "iphone15promaxseminovo",
    nome: "iPhone 15 Pro Max Seminovo",
    desc: "Forjado em Titânio.",
    preco: p(4500), seminovo: true,
    img: iphone15promax, imgAlt: "iPhone 15 Pro Max Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Azul • 256GB • Porta USB-C",
    cores: ["Titânio Azul", "Titânio Preto"],
    opcoes: ["256GB", "512GB"],
    precosOpcoes: { "256GB": 4500, "512GB": 4700 },
    tela: "Tela Super Retina XDR de 6.7 pol.", chip: "Chip A17 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },
  {
    id: "iphone15proseminovo",
    nome: "iPhone 15 Pro Seminovo",
    desc: "Design revolucionário em Titânio.",
    precoAntigo: p(4000), preco: p(3800), seminovo: true,
    img: iphone15pro, imgAlt: "iPhone 15 Pro Seminovo",
    categoria: "seminovo", badge: "Seminovo",
    shortSpec: "Titânio Natural • 128GB",
    cores: ["Titânio Azul", "Titânio Preto"],
    opcoes: ["128GB", "256GB"],
    precosOpcoes: { "128GB": 3800, "256GB": 4000 },
    tela: "Tela Super Retina XDR de 6.1 pol.", chip: "Chip A17 Pro",
    camera: "Sistema de câmera Pro de 48 MP",
  },

  // ============ iPADS ============
  {
    id: "ipadpro11",
    nome: "iPad 11 (A16)",
    desc: "O iPad mais fino e potente já criado. Performance extrema com design ultraportátil.",
    precoAntigo: p(2999), preco: p(2700),
    img: ipad11, imgAlt: "iPad 11 A16",
    categoria: "ipad", badge: "Poder Extremo",
    shortSpec: "Chip M4 • Tela OLED • 128GB",
    cores: ["Azul", "Silver", "Rosa", "Amarelo"], opcoes: ["128GB"],
    tela: "Tela Ultra Retina XDR (OLED Tandem)",
    chip: "Chip M4 da Apple (CPU de 9 núcleos)",
    camera: "Câmera Ultra-Angular de 12 MP (Paisagem)",
  },

  // ============ MACS ============
  {
    id: "macbookairm4",
    nome: "MacBook Air 13\" (Chip M4)",
    desc: "O notebook mais amado da Apple. Fino, leve e silencioso, com bateria que dura o dia todo.",
    precoAntigo: p(6999), preco: p(5490),
    img: mac13, imgAlt: "MacBook Air 13 M4",
    categoria: "mac", badge: "M4",
    shortSpec: "Chip M4 • 256GB",
    cores: ["Cinza-espacial", "Prateado", "Dourado"],
    opcoes: ["8GB / 256GB", "16GB / 512GB"],
    precosOpcoes: { "8GB / 256GB": 5490, "16GB / 512GB": 7290 },
    tela: "Tela Retina de 13.3 pol. com Tecnologia P3",
    chip: "Chip M4 da Apple",
    camera: "Câmera FaceTime HD de 720p",
  },
  {
    id: "macbookairm5",
    nome: "MacBook Air 13\" (Chip M5)",
    desc: "Design totalmente novo, mais fino e com a incrível tela Liquid Retina. Potência para tudo.",
    precoAntigo: p(8499), preco: p(7190),
    img: mac13chipm5, imgAlt: "MacBook Air 13 M5",
    categoria: "mac", badge: "M5",
    shortSpec: "Chip M5 • 256GB",
    cores: ["Meia-noite", "Estelar", "Prateado", "Cinza-espacial"],
    opcoes: ["8GB / 256GB", "16GB / 512GB"],
    precosOpcoes: { "8GB / 256GB": 7190, "16GB / 512GB": 8990 },
    tela: "Tela Liquid Retina de 13.6 pol. (500 nits)",
    chip: "Chip M5 da Apple",
    camera: "Câmera FaceTime HD de 1080p",
  },
  {
    id: "macbookprom6",
    nome: "MacBook Pro 14\" (Chip M5)",
    desc: "Uma fera para o trabalho profissional. Tela ProMotion de 120Hz e performance extrema.",
    precoAntigo: p(14999), preco: p(12890),
    img: macpro, imgAlt: "MacBook Pro 14 M5",
    categoria: "mac", badge: "M5 Pro",
    shortSpec: "Chip M5 • 512GB",
    cores: ["Preto-espacial", "Prateado"],
    opcoes: ["8GB / 512GB", "16GB / 512GB", "16GB / 1TB"],
    precosOpcoes: { "8GB / 512GB": 12890, "16GB / 512GB": 14490, "16GB / 1TB": 16290 },
    tela: "Tela Liquid Retina XDR com ProMotion (120Hz)",
    chip: "Chip M5 (Arquitetura de 3nm)",
    camera: "Sistema de Som com Seis Alto-falantes",
  },

  // ============ WATCH ============
  {
    id: "applewatchultra3",
    nome: "Apple Watch Ultra 3",
    desc: "Caixa de titânio de 49 mm. O relógio definitivo para esportes e aventura.",
    precoAntigo: p(7499), preco: p(6790),
    img: applewatchultra3, imgAlt: "Apple Watch Ultra 3",
    categoria: "watch", badge: "Lacrado",
    shortSpec: "Titânio Natural • 49 mm • GPS + Celular",
    cores: ["Titânio Natural", "Titânio Preto"],
    opcoes: ["Consulte as Disponíveis!"],
    tela: "Tela Retina Sempre Ativa (Até 3000 nits)",
    chip: "S10 SiP de dois núcleos",
    camera: "GPS de Dupla Frequência e Sensores de Saúde",
  },
];

export const productsById: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.id, p])
);

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getByCategory = (cat: Category) =>
  products.filter((p) => p.categoria === cat);
