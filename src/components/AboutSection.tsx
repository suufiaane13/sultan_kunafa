import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

export function AboutSection() {
  const { t } = useLocale();
  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-16 text-center md:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="font-display text-3xl font-semibold text-dark md:text-4xl">
        {t("aboutPage.heading")}
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dark/90">{t("about.text")}</p>
    </motion.section>
  );
}
