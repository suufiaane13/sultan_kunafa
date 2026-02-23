import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { getWhatsAppUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function CTASection() {
  const { t } = useLocale();
  return (
    <motion.section
      className="relative overflow-hidden rounded-[9px] text-on-inverse"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      aria-labelledby="cta-heading"
      style={{
        minHeight: "clamp(320px, 55vw, 520px)",
      }}
    >
      {/* Photo kunafa en fond */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat select-none"
        style={{ backgroundImage: "url(/kunafa.png)", WebkitUserSelect: "none", userSelect: "none" }}
        aria-hidden
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Overlay adaptatif : plus léger sur mobile pour laisser voir l'image */}
      <div className="absolute inset-0 bg-inverse-bg/60 sm:bg-inverse-bg/70 md:bg-inverse-bg/65" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-inverse-bg/75 via-inverse-bg/40 to-inverse-bg/25 sm:from-inverse-bg/90 sm:via-inverse-bg/50 sm:to-inverse-bg/40" aria-hidden />

      <div className="relative z-10 flex min-h-full flex-col justify-center px-5 py-14 text-center sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto w-full max-w-2xl">
          <h2
            id="cta-heading"
            className="font-display text-2xl font-semibold leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] sm:text-3xl md:text-4xl md:leading-snug"
          >
            {t("cta.title")}
          </h2>
          <p className="mt-2.5 max-w-xl mx-auto text-on-inverse/95 text-sm leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] sm:mt-3 sm:text-base md:text-lg md:leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <a
            href={getWhatsAppUrl(t("contact.whatsappMessageDefault"))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full max-w-xs items-center justify-center gap-2.5 self-center rounded-lg bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[#20BD5A] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-dark sm:mt-8 sm:w-auto sm:px-8 sm:py-4"
            data-ga-event="whatsapp_click"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            <span>{t("cta.buttonLabel")}</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
}
