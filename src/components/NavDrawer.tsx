import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { X, UtensilsCrossed, Info, ShoppingBag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { LangSwitcher } from "@/components/LangSwitcher";

const links = [
  { to: "/menu", labelKey: "nav.menu" as const, icon: UtensilsCrossed },
  { to: "/about", labelKey: "nav.about" as const, icon: Info },
];

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const { t, locale, hydrated } = useLocale();
  const { openCart, totalCount } = useCart();
  const location = useLocation();
  const isRtl = locale === "ar";

  const handleNav = () => {
    onClose();
  };

  const handleCart = () => {
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            role="presentation"
            className="fixed inset-0 z-40 bg-inverse-bg/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label={t("navDrawer.title")}
            aria-modal="true"
            className="fixed left-0 top-0 z-50 flex h-full w-full max-w-[280px] flex-col border-r border-[var(--color-border)] bg-[var(--color-cream)] shadow-[var(--shadow-card-hover,0_8px_30px_rgba(15,8,4,0.12))] rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l"
            initial={{ x: isRtl ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "100%" : "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <span className="font-display text-lg font-semibold tracking-tight text-dark">
                {t("navDrawer.title")}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("navDrawer.close")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-dark/70 transition-colors hover:bg-gold/10 hover:text-dark focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-4" aria-label={t("navDrawer.title")}>
              {links.map(({ to, labelKey, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleNav}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-[15px] font-medium transition rtl:text-right ${
                      isActive
                        ? "bg-gold/15 text-gold"
                        : "text-dark/90 hover:bg-gold/10 hover:text-dark"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                    {t(labelKey)}
                  </Link>
                );
              })}
              <div className="my-2 h-px bg-[var(--color-border)]" aria-hidden />
              <button
                type="button"
                onClick={handleCart}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-[15px] font-medium text-dark/90 transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rtl:text-right"
              >
                <ShoppingBag className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                {t("cart.title")}
                {totalCount > 0 && (
                  <span className="ml-auto rounded-full bg-gold px-2.5 py-1 text-xs font-bold tabular-nums text-dark rtl:ml-0 rtl:mr-auto">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </button>
            </nav>
            {hydrated && locale !== null && (
              <div className="mt-auto border-t border-[var(--color-border)] px-5 py-4">
                <span className="mb-3 block text-sm font-medium text-dark/70 dark:text-[var(--color-on-inverse)]/80">{t("picker.title")}</span>
                <LangSwitcher variant="drawer" />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
