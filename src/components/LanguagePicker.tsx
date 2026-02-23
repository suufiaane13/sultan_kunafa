import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/content/translations";

export function LanguagePicker() {
  const { locale, hydrated, setLocale, t } = useLocale();

  /* N'afficher que lorsque la langue a été lue (localStorage) et qu'aucune n'est choisie (première visite). */
  if (!hydrated || locale !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-bg/90 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl border border-gold/30 bg-cream p-8 shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <h2 className="text-center font-display text-xl font-semibold text-dark md:text-2xl">
            {t("picker.title")}
          </h2>
          <p className="mt-1 text-center text-dark/70" dir="rtl" lang="ar">
            {translations.ar.picker.title}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setLocale("fr")}
              className="w-full rounded-xl border-2 border-gold/50 bg-gold/10 py-4 font-semibold text-dark transition hover:bg-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {t("picker.fr")}
            </button>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className="w-full rounded-xl border-2 border-gold/50 bg-gold/10 py-4 font-semibold text-dark transition hover:bg-gold/20 focus:outline-none focus:ring-2 focus:ring-gold"
              dir="rtl"
              lang="ar"
            >
              {t("picker.ar")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
