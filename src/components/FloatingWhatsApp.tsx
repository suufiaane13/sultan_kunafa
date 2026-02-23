import { useLocale } from "@/context/LocaleContext";
import { getWhatsAppUrl } from "@/content/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function FloatingWhatsApp() {
  const { t } = useLocale();

  return (
    <a
      href={getWhatsAppUrl(t("contact.whatsappMessageDefault"))}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
      aria-label={t("cta.buttonLabel")}
      data-ga-event="whatsapp_float_click"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
