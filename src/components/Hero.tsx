import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import TextType from "@/components/TextType";

export function Hero() {
  const { t, locale } = useLocale();
  return (
    <section
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-inverse-bg px-4 text-on-inverse sm:min-h-[75vh] md:min-h-[85vh]"
      aria-label="Hero"
    >
      {/* Hero : hero.jpeg (plateau pâtisseries) avec léger flou. Après npm run optimize-images, hero.webp sera généré. */}
      <img
        src="/hero.jpeg"
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[3px]"
        width={1920}
        height={1080}
        loading="eager"
        // @ts-expect-error fetchpriority (minuscules) requis par le DOM ; les types React n'ont que fetchPriority
        fetchpriority="high"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-inverse-bg/80 from-10% via-inverse-bg/60 via-40% to-inverse-bg/90 to-100%" aria-hidden />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <motion.h1
          className="font-display text-4xl font-bold tracking-tight text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] md:text-6xl lg:text-7xl text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            key={locale}
            className="inline-block text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TextType
              as="span"
              text={[t("hero.title")]}
              typingSpeed={75}
              pauseDuration={1500}
              deletingSpeed={50}
              showCursor
              cursorCharacter="_"
              cursorBlinkDuration={0.5}
              loop
              initialDelay={200}
              className="inline-block text-gold"
            />
          </motion.span>
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gold-light/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-8 py-4 font-semibold text-dark shadow-lg transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-dark"
            data-ga-event="menu_click"
          >
            {t("hero.ctaLabel")}
            <ChevronRight className="h-5 w-5 rtl:rotate-180" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
