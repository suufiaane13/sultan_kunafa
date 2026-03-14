/**
 * Porte d'accès pour /gestion : formulaire code PIN côté client.
 * Sans backend, le code est vérifié en JS (ne protège pas contre un accès direct au code).
 * En production, définir VITE_GESTION_PIN dans .env pour un code personnalisé.
 */

import { useState, useCallback, type ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";

const STORAGE_KEY = "sultan-kunafa:gestion-auth";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 h

const DEFAULT_PIN = "200201"; // fallback si VITE_GESTION_PIN non défini

function getExpectedPin(): string {
  const env = import.meta.env.VITE_GESTION_PIN;
  return typeof env === "string" && env.length > 0 ? env : DEFAULT_PIN;
}

function isAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { t } = JSON.parse(raw);
    if (!Number.isFinite(t)) return false;
    return Date.now() - t < TTL_MS;
  } catch {
    return false;
  }
}

function setAuthenticated(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now() }));
  } catch {
    // ignore
  }
}

interface GestionGateProps {
  children: ReactNode;
}

export function GestionGate({ children }: GestionGateProps) {
  const { t } = useLocale();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [auth, setAuth] = useState(isAuthenticated);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(false);
      const expected = getExpectedPin();
      if (pin.trim() === expected) {
        setAuthenticated();
        setAuth(true);
      } else {
        setError(true);
        setPin("");
      }
    },
    [pin]
  );

  if (auth) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream)] p-4 dark:bg-[var(--color-cream-dark)]">
      <div className="w-full max-w-sm rounded-2xl border border-gold/30 bg-[var(--color-surface)] p-8 shadow-xl dark:border-gold/40">
        <h1 className="font-display text-center text-xl font-semibold text-dark md:text-2xl">
          {t("gestionVente.gateTitle")}
        </h1>
        <p className="mt-2 text-center text-sm text-dark/70">
          {t("gestionVente.gatePlaceholder")}
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label htmlFor="gestion-pin" className="sr-only">
            {t("gestionVente.gatePlaceholder")}
          </label>
          <input
            id="gestion-pin"
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder={t("gestionVente.gatePlaceholder")}
            className="rounded-xl border border-gold/40 bg-cream px-4 py-3 text-dark placeholder:text-dark/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 dark:bg-cream-dark dark:border-gold/50"
            autoComplete="off"
            autoFocus
            aria-invalid={error}
            aria-describedby={error ? "gestion-pin-error" : undefined}
          />
          {error && (
            <p id="gestion-pin-error" className="text-center text-sm text-red-600 dark:text-red-400" role="alert">
              {t("gestionVente.gateError")}
            </p>
          )}
          <button
            type="submit"
            className="rounded-xl bg-gold px-4 py-3 font-semibold text-dark shadow-md transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
          >
            {t("gestionVente.gateSubmit")}
          </button>
        </form>
      </div>
    </div>
  );
}
