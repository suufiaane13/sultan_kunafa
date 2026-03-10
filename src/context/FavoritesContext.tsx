import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const FAVORITES_STORAGE_KEY = "sultan-kunafa-favorites";

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface FavoritesContextValue {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(ids);
  }, [ids]);

  const value = useMemo<FavoritesContextValue>(() => {
    const set = new Set(ids);
    return {
      ids,
      isFavorite: (id) => set.has(id),
      toggle: (id) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev])),
      clear: () => setIds([]),
    };
  }, [ids]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

