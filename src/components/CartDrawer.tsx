import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { t, locale } = useLocale();
  const { items, totalAmount, updateQuantity, removeItem, isOpen, closeCart, getWhatsAppOrderUrl, clearCart } = useCart();
  const isRtl = locale === "ar";
  const slideOffset = isRtl ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            role="presentation"
            className="fixed inset-0 z-40 bg-inverse-bg/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-label={t("cart.title")}
            aria-modal="true"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-xl rtl:left-0 rtl:right-auto"
            initial={{ x: slideOffset }}
            animate={{ x: 0 }}
            exit={{ x: slideOffset }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-4 py-4">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-dark">
                <ShoppingBag className="h-5 w-5 text-gold" aria-hidden />
                {t("cart.title")}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label={t("cart.close")}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-dark hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <p className="flex flex-col items-center gap-2 py-12 text-center text-dark/70">
                  <ShoppingBag className="h-12 w-12 text-gold/30" aria-hidden />
                  {t("cart.empty")}
                </p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="cart-item-card flex flex-col gap-2 rounded-xl border border-gold/20 bg-white/50 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-dark">
                          {t(`products.${item.id}.name`) || item.name}
                        </span>
                        <span className="font-semibold text-gold">{item.priceAmount} {t("currency")}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="cart-item-qty flex items-center rounded-lg border border-gold/30">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label={t("cart.decrease")}
                            className="flex h-9 w-9 items-center justify-center text-dark hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-gold/20 dark:disabled:hover:bg-transparent"
                          >
                            <Minus className="h-4 w-4" aria-hidden />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums text-dark">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={t("cart.increase")}
                            className="flex h-9 w-9 items-center justify-center text-dark hover:bg-gold/10 dark:hover:bg-gold/20"
                          >
                            <Plus className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-gold">
                          {item.quantity * item.priceAmount} {t("currency")}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={t("cart.remove")}
                          className="flex items-center gap-1 text-sm text-dark/60 hover:text-dark dark:text-dark/80 dark:hover:text-dark"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          {t("cart.remove")}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gold/20 px-4 py-4">
                <div className="mb-4 flex justify-between text-lg font-semibold">
                  <span className="text-dark">{t("cart.total")}</span>
                  <span className="text-gold">{totalAmount} {t("currency")}</span>
                </div>
                <a
                  href={getWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => clearCart()}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3 font-semibold text-white shadow transition hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
                  data-ga-event="whatsapp_click"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  {t("cart.checkout")}
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
