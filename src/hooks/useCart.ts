import { useEffect, useState, useCallback, useMemo } from "react";
import { useCatalog } from "@/hooks/useCatalog";

// O carrinho guarda só a ESCOLHA do cliente. Nome, preço e imagem são sempre
// lidos do catálogo atual: assim, se o Victor mudar um preço no painel, o
// carrinho já mostra o valor novo (e a URL da imagem, que muda a cada build,
// nunca fica velha).
export type CartChoice = { id: string; opcao: string; cor: string };

export type CartItem = CartChoice & {
  index: number; // posição no armazenamento (usada para remover)
  nome: string;
  preco: number;
  imagem: string;
};

const STORAGE_KEY = "victorandrade:cart";
const EVENT = "victorandrade:cart-changed";

const read = (): CartChoice[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i) =>
          i &&
          typeof i.id === "string" &&
          typeof i.opcao === "string" &&
          typeof i.cor === "string"
      )
      .map(({ id, opcao, cor }) => ({ id, opcao, cor }));
  } catch {
    return [];
  }
};

const write = (items: CartChoice[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // armazenamento indisponível (modo privado, cota cheia): segue sem persistir
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

export function useCart() {
  const { byId, isLoading } = useCatalog();
  const [stored, setStored] = useState<CartChoice[]>(() =>
    typeof window === "undefined" ? [] : read()
  );

  useEffect(() => {
    const sync = () => setStored(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const { items, indisponiveis } = useMemo(() => {
    const lista: CartItem[] = [];
    let fora = 0;
    if (isLoading) return { items: lista, indisponiveis: 0 };

    stored.forEach((s, index) => {
      const p = byId[s.id];
      // Produto desativado, ou capacidade/cor removida no painel: não dá para
      // cobrar um preço que não existe mais.
      if (!p || !p.opcoes.includes(s.opcao) || !p.cores.includes(s.cor)) {
        fora += 1;
        return;
      }
      lista.push({
        index,
        id: s.id,
        opcao: s.opcao,
        cor: s.cor,
        nome: p.nome,
        preco: p.precosOpcoes?.[s.opcao] ?? p.preco,
        imagem: p.img,
      });
    });
    return { items: lista, indisponiveis: fora };
  }, [stored, byId, isLoading]);

  const add = useCallback((choice: CartChoice) => {
    write([...read(), choice]);
  }, []);

  const remove = useCallback((index: number) => {
    write(read().filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => write([]), []);

  const pruneUnavailable = useCallback(() => {
    const manter = new Set(items.map((i) => i.index));
    write(read().filter((_, i) => manter.has(i)));
  }, [items]);

  const total = items.reduce((s, i) => s + i.preco, 0);
  const count = isLoading ? stored.length : items.length;

  return { items, indisponiveis, isLoading, add, remove, clear, pruneUnavailable, total, count };
}
