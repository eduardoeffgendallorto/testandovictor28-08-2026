import { buildWhatsAppLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const WhatsAppFloat = () => (
  <a
    href={buildWhatsAppLink("Olá Victor! Vim pelo site e gostaria de mais informações.")}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Falar com o vendedor no WhatsApp"
    className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center h-14 w-14 rounded-full bg-success text-success-foreground shadow-card-hover hover:scale-105 transition-transform"
  >
    <WhatsAppIcon className="h-7 w-7" />
  </a>
);
