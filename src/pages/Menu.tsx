import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { MenuCard } from "@/components/MenuCard";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { site } from "@/content/site";

export function Menu() {
  const { t } = useLocale();
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sultan-kunafa:menu-scroll-y");
      if (!raw) return;
      sessionStorage.removeItem("sultan-kunafa:menu-scroll-y");
      const y = Number(raw);
      if (Number.isFinite(y) && y >= 0) {
        // next frame ensures layout is ready
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
      }
    } catch {
      // ignore
    }
  }, []);

  const menuItems = site.menu.map((item) => {
    const hasVariants = "flavors" in item && Array.isArray((item as unknown as { flavors?: readonly unknown[] }).flavors);
    const hasCustomPrice = hasVariants || item.priceAmount === 0;
    return {
      id: item.id,
      name: t(`products.${item.id}.name`),
      description: t(`products.${item.id}.descriptionShort`),
      price: hasCustomPrice ? item.price : `${item.priceAmount} ${t("currency")}`,
      priceAmount: hasVariants ? undefined : item.priceAmount,
      hasVariants,
      image: item.image,
    };
  });

  return (
    <>
      <motion.header
        className="bg-inverse-bg py-10 text-center text-on-inverse sm:py-12 md:py-16"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display flex items-center justify-center gap-2 text-2xl font-semibold sm:gap-3 sm:text-3xl md:text-4xl lg:text-5xl">
          <UtensilsCrossed className="h-8 w-8 text-gold sm:h-10 sm:w-10 md:h-12 md:w-12" aria-hidden />
          {t("menuPage.title")}
        </h1>
        <p className="mt-2 text-sm text-on-inverse/90 sm:mt-3 sm:text-base">{t("menuPage.subtitle")}</p>
      </motion.header>

      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10 md:py-12" aria-label={t("menuPage.title")}>
        {/* Grille cartes : mobile 2 cols, tablette 2 cols, web 3 cols ; dernière ligne centrée si incomplète */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {menuItems.map((item, i) => (
            <div key={item.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:min-w-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)] lg:flex-[0_0_calc((100%-4rem)/3)]">
              <MenuCard
              item={{ id: item.id, name: item.name, description: item.description, price: item.price, image: item.image }}
              index={i}
              priceAmount={item.priceAmount}
              priority={i < 6}
              linkToDetail
              detailCtaLabel={item.hasVariants ? t("menuPage.chooseFlavor") : undefined}
              onAddToCart={
                item.priceAmount != null
                  ? ({ id, name, price, priceAmount }) =>
                      addItem({ id, name, priceDisplay: price, priceAmount }, 1)
                  : undefined
              }
            />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
