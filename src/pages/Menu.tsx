import { motion } from "framer-motion";
import { UtensilsCrossed, LayoutGrid, List, LayoutPanelTop } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { MenuCard } from "@/components/MenuCard";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { site, starredProductIds } from "@/content/site";

type MenuFilter = "all" | "signatures" | "baklava" | "kunafa" | "desserts";
type ViewMode = "grid" | "list" | "featured";

function getCategory(id: string): "baklava" | "kunafa" | "desserts" {
  if (id.startsWith("baklava_")) return "baklava";
  if (id.startsWith("kunafa_")) return "kunafa";
  return "desserts";
}

const FILTERS: { value: MenuFilter; labelKey: "menuPage.filterAll" | "menuPage.filterSignatures" | "menuPage.filterBaklava" | "menuPage.filterKunafa" | "menuPage.filterDesserts" }[] = [
  { value: "all", labelKey: "menuPage.filterAll" },
  { value: "signatures", labelKey: "menuPage.filterSignatures" },
  { value: "baklava", labelKey: "menuPage.filterBaklava" },
  { value: "kunafa", labelKey: "menuPage.filterKunafa" },
  { value: "desserts", labelKey: "menuPage.filterDesserts" },
];

export function Menu() {
  const { t } = useLocale();
  const { addItem } = useCart();
  const [filter, setFilter] = useState<MenuFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sultan-kunafa:menu-scroll-y");
      if (!raw) return;
      sessionStorage.removeItem("sultan-kunafa:menu-scroll-y");
      const y = Number(raw);
      if (Number.isFinite(y) && y >= 0) {
        requestAnimationFrame(() => window.scrollTo({ top: y, behavior: "auto" }));
      }
    } catch {
      // ignore
    }
  }, []);

  const menuItems = useMemo(() => site.menu.map((item) => {
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
      category: getCategory(item.id),
      isStarred: starredProductIds.includes(item.id as (typeof starredProductIds)[number]),
    };
  }), [t]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return menuItems;
    if (filter === "signatures") return menuItems.filter((item) => item.isStarred);
    return menuItems.filter((item) => item.category === filter);
  }, [menuItems, filter]);

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

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:py-10" aria-label={t("menuPage.title")}>
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:mb-8 sm:gap-3" role="tablist" aria-label={t("menuPage.title")}>
          {FILTERS.map(({ value, labelKey }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream ${
                filter === value
                  ? "border-gold bg-gold text-dark shadow-md dark:border-gold"
                  : "border-gold/40 bg-cream/90 text-dark/80 hover:border-gold/60 hover:bg-gold/20 hover:text-dark dark:border-gold/30 dark:bg-cream-dark/90 dark:hover:border-gold/50 dark:hover:bg-gold/25"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-gold/30 sm:block" aria-hidden />
          <div className="flex rounded-full border border-gold/40 bg-cream/90 p-0.5 dark:border-gold/30 dark:bg-cream-dark/90" role="group" aria-label={t("menuPage.viewLabel")}>
            {(
              [
                { mode: "grid" as const, icon: LayoutGrid, labelKey: "menuPage.viewGrid" },
                { mode: "list" as const, icon: List, labelKey: "menuPage.viewList" },
                { mode: "featured" as const, icon: LayoutPanelTop, labelKey: "menuPage.viewFeatured" },
              ] as const
            ).map(({ mode, icon: Icon, labelKey }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream ${
                  viewMode === mode ? "bg-gold text-dark shadow-sm" : "text-dark/70 hover:bg-gold/15 hover:text-dark"
                }`}
                aria-label={t(labelKey)}
                aria-pressed={viewMode === mode}
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" aria-hidden />
              </button>
            ))}
          </div>
        </div>
        <div
          className={
            viewMode === "list"
              ? "flex flex-col gap-3 sm:gap-4"
              : viewMode === "featured"
                ? "mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10"
                : "flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          }
        >
          {filteredItems.map((item, i) => (
            <div
              key={item.id}
              className={
                viewMode === "list"
                  ? "w-full"
                  : viewMode === "featured"
                    ? "w-full"
                    : "w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:min-w-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)] lg:flex-[0_0_calc((100%-4rem)/3)]"
              }
            >
              <MenuCard
                item={{ id: item.id, name: item.name, description: item.description, price: item.price, image: item.image }}
                index={i}
                priceAmount={item.priceAmount}
                priority={i < 6}
                linkToDetail
                layout={viewMode === "list" ? "list" : "card"}
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
