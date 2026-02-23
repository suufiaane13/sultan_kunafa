import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getWhatsAppUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const INSTAGRAM_HANDLE = "sultan_konafa";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export function FloatingSocial() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed right-5 z-[35] flex flex-col-reverse items-end sm:right-6 md:right-8 rtl:right-auto rtl:left-5 rtl:items-start sm:rtl:left-6 md:rtl:left-8"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
    >
      {/* Bouton principal : ouvre / ferme le dropdown */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-white shadow-lg shadow-gold/30 transition-[box-shadow,background] duration-200 focus:outline-none focus:ring-4 focus:ring-gold/50 ${
          open
            ? "scale-95 ring-2 ring-inset ring-white/40 shadow-inner"
            : "hover:scale-110 hover:shadow-xl hover:shadow-gold/40"
        }`}
        aria-label={open ? "Fermer le menu contact" : "Contact et réseaux"}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </button>

      {/* Dropdown : panneau compact, style projet (crème, bordure or), icônes seules */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            role="menu"
            aria-label="Réseaux et contact"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-2 flex w-12 shrink-0 flex-col items-center gap-0.5 rounded-xl border border-gold/25 bg-[var(--color-cream)] px-1.5 py-1.5 shadow-[var(--shadow-card-hover,0_8px_30px_rgba(15,8,4,0.12))] dark:border-gold/30 dark:bg-[var(--color-surface)]"
          >
            <a
              href={getWhatsAppUrl(t("contact.whatsappMessageDefault"))}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#25D366] transition-colors hover:bg-[#25D366]/15 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] dark:focus:ring-offset-[var(--color-surface)]"
              aria-label={t("cta.buttonLabel")}
              data-ga-event="whatsapp_float_click"
            >
              <WhatsAppIcon className="h-5 w-5" aria-hidden />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#E4405F] transition-colors hover:bg-[#E4405F]/15 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] dark:focus:ring-offset-[var(--color-surface)]"
              aria-label="Instagram Sultan Kunafa"
              data-ga-event="instagram_float_click"
            >
              <InstagramIcon className="h-5 w-5" aria-hidden />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
