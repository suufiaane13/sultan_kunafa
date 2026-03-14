/**
 * Bandeau discret « Ajouter à l'écran d'accueil » (PWA).
 * S'affiche uniquement si le navigateur envoie beforeinstallprompt et que l'utilisateur n'a pas fermé récemment.
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { useLocale } from "@/context/LocaleContext";

const PWA_DISMISS_KEY = "sultan-kunafa:pwa-dismiss";
const DISMISS_DAYS = 7;

function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(PWA_DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function PWAInstallBanner() {
  const { t } = useLocale();
  const [show, setShow] = useState(false);
  const [installable, setInstallable] = useState(false);
  const installPromptRef = useRef<{ prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (wasDismissedRecently()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const ev = e as unknown as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
      installPromptRef.current = ev;
      setInstallable(true);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const ev = installPromptRef.current;
    if (!ev) return;
    try {
      await ev.prompt();
      const { outcome } = await ev.userChoice;
      if (outcome === "accepted") setShow(false);
    } finally {
      installPromptRef.current = null;
      setInstallable(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(PWA_DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!show || !installable) return null;

  return (
    <div
      role="region"
      aria-label={t("pwa.addToHomeScreen")}
      className="fixed bottom-4 left-4 right-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/30 bg-cream px-4 py-3 shadow-lg dark:border-gold/40 dark:bg-cream-dark sm:left-auto sm:right-4 sm:max-w-sm rtl:left-4 rtl:right-auto"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <p className="text-sm font-medium text-dark">{t("pwa.addToHomeScreen")}</p>
      <div className="flex gap-2">
        <Button type="button" onClick={handleDismiss} variant="ghost" size="sm">
          {t("pwa.dismiss")}
        </Button>
        <Button type="button" onClick={handleInstall} variant="gold" size="sm">
          {t("pwa.addToHomeScreen")}
        </Button>
      </div>
    </div>
  );
}
