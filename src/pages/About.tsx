import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Users, MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/content/site";

export function About() {
  const { t } = useLocale();
  const [avatar1Loaded, setAvatar1Loaded] = useState(false);
  const [avatar2Loaded, setAvatar2Loaded] = useState(false);
  const [avatar3Loaded, setAvatar3Loaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  return (
    <>
      <header className="bg-inverse-bg py-16 text-center text-on-inverse">
        <h1 className="font-display flex items-center justify-center gap-3 text-4xl font-semibold md:text-5xl">
          <Info className="h-10 w-10 text-gold md:h-12 md:w-12" aria-hidden />
          {t("aboutPage.title")}
        </h1>
        <p className="mt-3 text-on-inverse/90">{t("aboutPage.subtitle")}</p>
      </header>

      <motion.section
        className="mx-auto max-w-3xl px-4 py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-2xl font-semibold text-dark">{t("aboutPage.heading")}</h2>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-dark/90">{t("about.text")}</p>
      </motion.section>

      <motion.section
        className="border-t border-gold/20 bg-cream/30 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display flex items-center justify-center gap-2 text-2xl font-semibold text-dark md:text-3xl">
            <Users className="h-7 w-7 text-gold" aria-hidden />
            {t("aboutPage.foundersTitle")}
          </h2>
          <p className="mt-4 text-center text-dark/80 md:max-w-2xl md:mx-auto">
            {t("aboutPage.foundersIntro")}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-8 md:gap-10 lg:grid-cols-3">
            <motion.div
              className="founder-card flex flex-col items-center rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-lg sm:p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold/20 ring-2 ring-gold/10 dark:border-gold/30 dark:ring-gold/20 sm:h-24 sm:w-24">
                {!avatar1Loaded && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gold/20 dark:bg-gold/25" aria-hidden />
                )}
                <img
                  src="/avatar-ahmed.png"
                  alt=""
                  className={`h-full w-full object-cover object-center transition-opacity duration-300 ${avatar1Loaded ? "opacity-100" : "opacity-0"} scale-110`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setAvatar1Loaded(true)}
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-dark sm:mt-5 sm:text-xl">
                {t("aboutPage.founder1Name")}
              </h3>
              <p className="mt-1 text-sm font-medium text-gold sm:text-base">{t("aboutPage.founder1Role")}</p>
            </motion.div>
            <motion.div
              className="founder-card flex flex-col items-center rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-lg sm:p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold/20 ring-2 ring-gold/10 dark:border-gold/30 dark:ring-gold/20 sm:h-24 sm:w-24">
                {!avatar2Loaded && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gold/20 dark:bg-gold/25" aria-hidden />
                )}
                <img
                  src="/avatar-haroun.png"
                  alt=""
                  className={`h-full w-full object-cover transition-opacity duration-300 ${avatar2Loaded ? "opacity-100" : "opacity-0"}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setAvatar2Loaded(true)}
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-dark sm:mt-5 sm:text-xl">
                {t("aboutPage.founder2Name")}
              </h3>
              <p className="mt-1 text-sm font-medium text-gold sm:text-base">{t("aboutPage.founder2Role")}</p>
            </motion.div>
            <motion.div
              className="founder-card flex flex-col items-center rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-lg sm:p-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold/20 ring-2 ring-gold/10 dark:border-gold/30 dark:ring-gold/20 sm:h-24 sm:w-24">
                {!avatar3Loaded && (
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gold/20 dark:bg-gold/25" aria-hidden />
                )}
                <img
                  src="/avatar-soufiane.png"
                  alt=""
                  className={`h-full w-full object-cover object-center transition-opacity duration-300 ${avatar3Loaded ? "opacity-100" : "opacity-0"}`}
                  width={96}
                  height={96}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setAvatar3Loaded(true)}
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-dark sm:mt-5 sm:text-xl">
                {t("aboutPage.founder3Name")}
              </h3>
              <p className="mt-1 text-sm font-medium text-gold sm:text-base">{t("aboutPage.founder3Role")}</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-5xl px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="font-display flex items-center justify-center gap-2 text-2xl font-semibold text-dark md:text-3xl">
          <MapPin className="h-7 w-7 text-gold" aria-hidden />
          {t("aboutPage.locationTitle")}
        </h2>
        <div className="map-dark mt-6 overflow-hidden rounded-2xl border border-gold/20 shadow-xl ring-1 ring-black/20 dark:border-gold/30 dark:ring-gold/10">
          <div className="relative aspect-[16/10] w-full min-h-[240px] sm:aspect-video">
            {!mapLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gold/15 dark:bg-gold/20" aria-hidden />
            )}
            <iframe
              src={site.contact.mapEmbedUrl}
              title={t("aboutPage.locationTitle")}
              className={`map-dark-iframe absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            />
          </div>
          <a
            href="https://www.google.com/maps?q=34.655196988561705,-1.8970717785253848"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-gold/20 bg-[#0f0f12] py-3 text-sm font-medium text-gold transition hover:bg-gold/20 hover:text-gold-light dark:border-gold/30"
          >
            <MapPin className="h-4 w-4" aria-hidden />
            {t("aboutPage.openInMaps")}
          </a>
        </div>
      </motion.section>
    </>
  );
}
