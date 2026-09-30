import { useCallback, useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { MAX_COMPARE } from "@/data/compare";
import type { Product } from "@/data/products";

// Guardamos só os IDs escolhidos. Nome, preço e imagem vêm sempre do catálogo
// atual (mesma ideia do carrinho): se o Victor mudar algo no painel, o
// comparador já mostra o valor novo, e produto desativado some sozinho.
const STORAGE_KEY = "victorandrade:compare";
const EVENT = "victorandrade:compare-changed";

const limpar = (ids: unknown[]): string[] =>
  [...new Set(ids.filter((i): i is string => typeof i === "string" && i.length > 0))].slice(
    0,
    MAX_COMPARE
  );

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? limpar(parsed) : [];
  } catch {
    return [];
  }
};

const write = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limpar(ids)));
  } catch {
    // armazenamento indisponível (modo privado, cota cheia): segue sem persistir
  }
  window.dispatchEvent(new CustomEvent(EVENT));
};

export type ToggleResult = "added" | "removed" | "full";

export function useCompare() {
  const { byId, isLoading } = useCatalog();
  const [stored, setStored] = useState<string[]>(() =>
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

  const items = useMemo<Product[]>(() => {
    if (isLoading) return [];
    return stored.map((id) => byId[id]).filter((p): p is Product => Boolean(p));
  }, [stored, byId, isLoading]);

  const ids = useMemo(() => items.map((p) => p.id), [items]);

  const has = useCallback((id: string) => stored.includes(id), [stored]);

  const toggle = useCallback((id: string): ToggleResult => {
    const atual = read();
    if (atual.includes(id)) {
      write(atual.filter((i) => i !== id));
      return "removed";
    }
    if (atual.length >= MAX_COMPARE) return "full";
    write([...atual, id]);
    return "added";
  }, []);

  const remove = useCallback((id: string) => write(read().filter((i) => i !== id)), []);
  const clear = useCallback(() => write([]), []);
  const setAll = useCallback((novos: string[]) => write(limpar(novos)), []);

  return {
    items,
    ids,
    // enquanto o catálogo carrega, conta o que está guardado (evita a barra piscar)
    count: isLoading ? stored.length : items.length,
    isFull: stored.length >= MAX_COMPARE,
    isLoading,
    has,
    toggle,
    remove,
    clear,
    setAll,
  };
}
