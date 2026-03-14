import { motion } from "framer-motion";
import { UtensilsCrossed, LayoutGrid, List, LayoutPanelTop, ChevronDown, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { MenuCard } from "@/components/MenuCard";
import { EmptyState } from "@/components/ui";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { site, starredProductIds } from "@/content/site";

type MenuFilter = "all" | "signatures" | "baklava" | "kunafa" | "desserts";
type ViewMode = "grid" | "list" | "featured";
const VIEW_STORAGE_KEY = "sultan-kunafa:menu-view";
const VALID_VIEWS: ViewMode[] = ["grid", "list", "featured"];
/** Tailles de page par mode (~4% en dessous de valeurs rondes). */
const PAGE_SIZE_BY_MODE: Record<ViewMode, number> = {
  grid: 11,
  list: 8,
  featured: 6,
};

function getStoredViewMode(): ViewMode {
  try {
    const raw = sessionStorage.getItem(VIEW_STORAGE_KEY);
    if (raw && VALID_VIEWS.includes(raw as ViewMode)) return raw as ViewMode;
  } catch {
    // ignore
  }
  return "grid";
}

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
  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const setViewModeAndStore = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      sessionStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  };

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

  const filteredByCategory = useMemo(() => {
    if (filter === "all") return menuItems;
    if (filter === "signatures") return menuItems.filter((item) => item.isStarred);
    return menuItems.filter((item) => item.category === filter);
  }, [menuItems, filter]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return filteredByCategory;
    return filteredByCategory.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [filteredByCategory, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, viewMode, searchQuery]);

  const pageSize = PAGE_SIZE_BY_MODE[viewMode];
  const paginatedItems = useMemo(() => {
    const end = page * pageSize;
    return filteredItems.slice(0, end);
  }, [filteredItems, page, pageSize]);

  const hasMore = filteredItems.length > paginatedItems.length;

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
        <div className="mb-4 flex justify-center sm:mb-6">
          <label htmlFor="menu-search" className="sr-only">
            {t("menuPage.filterSearchPlaceholder")}
          </label>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark/50 rtl:left-auto rtl:right-3" aria-hidden />
            <input
              id="menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("menuPage.filterSearchPlaceholder")}
              className="w-full rounded-xl border border-gold/30 bg-cream py-2.5 pl-10 pr-4 text-dark placeholder:text-dark/50 focus:border-gold/60 rtl:pl-4 rtl:pr-10 dark:border-gold/40 dark:bg-cream-dark"
              autoComplete="off"
              aria-label={t("menuPage.filterSearchPlaceholder")}
            />
          </div>
        </div>
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
                onClick={() => setViewModeAndStore(mode)}
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
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={<UtensilsCrossed className="h-12 w-12" />}
            description={t("menuPage.noResults")}
            action={{
              label: t("menuPage.resetFilters"),
              onClick: () => setFilter("all"),
              variant: "secondary",
            }}
            className="mx-auto max-w-xl py-16 sm:py-20"
          />
        ) : (
          <>
        <div
          className={
            viewMode === "list"
              ? "flex flex-col gap-3 sm:gap-4"
              : viewMode === "featured"
                ? "mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10"
                : "flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8"
          }
        >
          {paginatedItems.map((item, i) => (
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
                priority={i < pageSize}
                linkToDetail
                layout={viewMode === "list" ? "list" : viewMode === "featured" ? "featured" : "card"}
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
        {hasMore && (
          <div className="mt-6 flex justify-center sm:mt-8">
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-cream px-3.5 py-2 text-[13px] font-medium text-dark transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream dark:border-gold/40 dark:bg-cream-dark dark:text-dark dark:hover:bg-gold/15"
              aria-label={t("menuPage.seeMore")}
            >
              <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
              {t("menuPage.seeMore")} ({filteredItems.length - paginatedItems.length}{" "}
              {(filteredItems.length - paginatedItems.length) !== 1
                ? t("menuPage.restantes")
                : t("menuPage.restanteOne")})
            </button>
          </div>
        )}
          </>
        )}
      </section>
    </>
  );
}
