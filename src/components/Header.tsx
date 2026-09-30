import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Smartphone, Tablet, Laptop, Watch, ArrowLeftRight, Menu, X } from "lucide-react";
import logo from "@/assets/products/logovitao.webp";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const links = [
  { to: "/iphones", label: "iPhones", icon: Smartphone },
  { to: "/seminovos", label: "Seminovos", icon: Smartphone },
  { to: "/ipads", label: "iPads", icon: Tablet },
  { to: "/macs", label: "MacBooks", icon: Laptop },
  { to: "/relogios", label: "Relógios", icon: Watch },
  { to: "/comparar", label: "Comparar", icon: ArrowLeftRight },
];

export const Header = () => {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 glass-nav transition-shadow",
        scrolled && "shadow-card"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" aria-label="Victor Andrade — início" className="flex items-center">
          <img src={logo} alt="Victor Andrade" width={1200} height={577} className="h-10 md:h-12 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:text-foreground hover:bg-secondary"
                )
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/carrinho"
            aria-label={`Carrinho com ${count} itens`}
            className="relative inline-flex items-center justify-center h-10 px-4 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
          >
            <ShoppingCart className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="container py-3 flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-foreground hover:bg-secondary"
                  )
                }
              >
                <Icon className="h-4 w-4" /> {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
