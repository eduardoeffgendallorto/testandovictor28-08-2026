import { Link } from "react-router-dom";
import { Instagram, MapPin } from "lucide-react";
import {
  ENDERECO,
  INSTAGRAM_URL,
  INSTAGRAM_USER,
  WHATSAPP_DISPLAY,
  buildWhatsAppLink,
} from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

const links = [
  { to: "/iphones", label: "iPhones" },
  { to: "/seminovos", label: "Seminovos" },
  { to: "/ipads", label: "iPads" },
  { to: "/macs", label: "MacBooks" },
  { to: "/relogios", label: "Relógios" },
];

export const Footer = () => (
  <footer className="border-t border-border bg-surface mt-20">
    <div className="container py-10 grid gap-8 md:grid-cols-3 text-sm">
      <div>
        <p className="mb-2 font-semibold text-foreground text-base">Victor Andrade</p>
        <p className="text-muted-foreground max-w-xs">
          iPhones, iPads e MacBooks novos e seminovos com garantia e procedência.
        </p>
      </div>

      <nav aria-label="Rodapé">
        <p className="mb-2 font-semibold text-foreground">Navegue</p>
        <ul className="space-y-1.5">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <p className="mb-2 font-semibold text-foreground">Contato</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <a
              href={buildWhatsAppLink("Olá Victor! Vim pelo site e gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp {WHATSAPP_DISPLAY}
            </a>
          </li>
          <li>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" /> @{INSTAGRAM_USER}
            </a>
          </li>
          <li className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {ENDERECO}
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-border">
      <p className="container py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Victor Andrade — Todos os direitos reservados.
      </p>
    </div>
  </footer>
);
