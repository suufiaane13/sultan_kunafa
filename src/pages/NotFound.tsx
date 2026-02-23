import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function NotFound() {
  const { t } = useLocale();

  return (
    <motion.section
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AlertCircle className="h-16 w-16 text-gold/80 sm:h-20 sm:w-20" aria-hidden />
      <h1 className="mt-6 font-display text-3xl font-semibold text-dark sm:text-4xl">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 max-w-md text-dark/80">
        {t("notFound.message")}
      </p>
      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 font-semibold text-dark shadow-md transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream"
      >
        <Home className="h-5 w-5" aria-hidden />
        {t("notFound.backHome")}
      </Link>
    </motion.section>
  );
}
