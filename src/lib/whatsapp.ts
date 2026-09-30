export const WHATSAPP_NUMBER = "553399747066";
export const WHATSAPP_DISPLAY = "(33) 99974-7066";
export const INSTAGRAM_USER = "victorandrade.cunha";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}`;
export const ENDERECO = "Eunápolis - BA";

export const buildWhatsAppLink = (message: string) =>
  `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

// Opções como "Consulte as Disponíveis!" não são uma variação real do produto:
// não devem aparecer na mensagem enviada ao vendedor.
export const isOpcaoInformativa = (opcao: string) =>
  opcao.trim().toLowerCase().startsWith("consulte");

export const descreverVariante = (opcao: string, cor: string) =>
  [isOpcaoInformativa(opcao) ? null : opcao, cor ? `Cor: ${cor}` : null]
    .filter(Boolean)
    .join(" | ");
