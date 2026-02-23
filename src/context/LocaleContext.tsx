import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { t as translate, type Locale } from "@/content/translations";

const STORAGE_KEY = "sultan-kunafa-lang";

function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "ar") return stored;
  return null;
}

interface LocaleContextValue {
  locale: Locale | null;
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setHydrated(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const lang = locale === "ar" ? "ar" : "fr";
    const dir = locale === "ar" ? "rtl" : "ltr";
    root.setAttribute("lang", lang);
    root.setAttribute("dir", dir);
  }, [locale, hydrated]);

  const t = useCallback(
    (key: string) => translate(locale ?? "fr", key),
    [locale]
  );

  const value: LocaleContextValue = {
    locale: hydrated ? locale : null,
    hydrated,
    setLocale,
    t,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
