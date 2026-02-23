import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/content/translations";

type Variant = "navbar" | "drawer";

const options: { value: Locale; label: string; aria: string }[] = [
  { value: "fr", label: "FR", aria: "Français" },
  { value: "ar", label: "ع", aria: "العربية" },
];

interface LangSwitcherProps {
  variant?: Variant;
  overHero?: boolean;
}

export function LangSwitcher({ variant = "navbar", overHero = false }: LangSwitcherProps) {
  const { locale, setLocale, hydrated } = useLocale();
  if (!hydrated || locale === null) return null;

  const isCompact = variant === "navbar";
  const isLightContext = overHero;

  const trackClass = [
    "relative flex h-9 rounded-full border border-gold/25 p-0.5 shadow-inner",
    variant === "drawer" && "h-10",
    variant === "drawer" ? "w-[5.75rem]" : "w-24",
    isLightContext
      ? "bg-[var(--color-inverse-bg)]/60"
      : "bg-[var(--color-cream-dark)]/80 dark:bg-[var(--color-surface)]",
  ].join(" ");

  const labelClass = (isActive: boolean) => {
    const base = "relative z-10 flex h-full flex-1 items-center justify-center font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)]";
    const size = isCompact ? "min-w-0 text-xs" : "min-w-0 text-sm";
    /* Actif = texte blanc sur le curseur or (le « truc jaune ») */
    if (isActive) return `${base} ${size} text-white cursor-default drop-shadow-sm`;
    if (isLightContext) {
      return `${base} ${size} text-[var(--color-on-inverse)]/80 hover:text-gold`;
    }
    return `${base} ${size} text-[var(--color-dark)]/80 hover:text-gold dark:text-[var(--color-on-inverse)]/80 dark:hover:text-gold`;
  };

  /* Toujours LTR pour le switcher : ordre fixe FR (gauche) | ع (droite), curseur avec left */
  return (
    <div className="flex" role="group" aria-label="Choisir la langue" dir="ltr">
      <div className={trackClass}>
        {/* Curseur or : sur FR (gauche) ou ع (droite) */}
        <motion.div
          className="absolute top-0.5 bottom-0.5 rounded-full bg-gold shadow-md ring-2 ring-gold/30"
          style={{ width: "calc(50% - 2px)" }}
          initial={false}
          animate={{
            left: locale === "fr" ? 2 : "calc(50% + 2px)",
          }}
          transition={{ type: "tween", duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden
        />
        <div className="relative flex h-full flex-1">
          {options.map(({ value, label, aria }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLocale(value)}
              className={labelClass(locale === value)}
              aria-pressed={locale === value}
              aria-label={aria}
              lang={value}
            >
              <span className="inline-block min-h-[1.2em] leading-none align-middle">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
