import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/content/site";

export function Favorites() {
  const { t } = useLocale();
  const { ids } = useFavorites();

  const favoriteItems = site.menu
    .filter((item) => ids.includes(item.id))
    .map((item) => {
      const hasVariants = "flavors" in item && Array.isArray((item as unknown as { flavors?: readonly unknown[] }).flavors);
      const hasCustomPrice = hasVariants || item.priceAmount === 0;
      return {
        id: item.id,
        name: t(`products.${item.id}.name`),
        description: t(`products.${item.id}.descriptionShort`),
        price: hasCustomPrice ? item.price : `${item.priceAmount} ${t("currency")}`,
        priceAmount: hasCustomPrice ? undefined : item.priceAmount,
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
          <Heart className="h-8 w-8 text-gold sm:h-10 sm:w-10 md:h-12 md:w-12" aria-hidden />
          {t("nav.favorites")}
        </h1>
        <p className="mt-2 text-sm text-on-inverse/90 sm:mt-3 sm:text-base">
          {ids.length === 0 ? t("favorites.subtitle") : `${ids.length} ${ids.length === 1 ? "article" : "articles"}`}
        </p>
      </motion.header>

      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10 md:py-12" aria-label={t("nav.favorites")}>
        {favoriteItems.length === 0 ? (
          <motion.section
            className="mx-auto max-w-4xl px-4 py-16 text-center md:py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            aria-labelledby="favorites-empty-heading"
          >
            <h2 id="favorites-empty-heading" className="font-display text-3xl font-semibold text-dark md:text-4xl">
              {t("favorites.emptyTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dark/90">
              {t("favorites.emptyHint")}
            </p>
          </motion.section>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {favoriteItems.map((item, i) => (
              <div key={item.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:min-w-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)] lg:flex-[0_0_calc((100%-4rem)/3)]">
                <MenuCard
                  item={{ id: item.id, name: item.name, description: item.description, price: item.price, image: item.image }}
                  index={i}
                  priceAmount={item.priceAmount}
                  priority={i < 6}
                  linkToDetail
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

