import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Check, UtensilsCrossed, Minus, Plus, Heart } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/components/MenuCard";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { site, starredProductIds, tiramisuFlavorIds, tiramisuPrices, tiramisuSizeIds } from "@/content/site";

const DEFAULT_PRODUCT_IMAGE = "/photo.png";

function imageBase(path: string): string | null {
  if (!path || path === DEFAULT_PRODUCT_IMAGE) return null;
  const match = path.match(/\.(png|jpe?g)$/i);
  return match ? path.slice(0, -match[0].length) : null;
}

function webpUrl(path: string): string | null {
  const base = imageBase(path);
  return base ? base + ".webp" : null;
}

function webpSrcSet(path: string): string | null {
  const base = imageBase(path);
  if (!base || !base.startsWith("/photos/")) return null;
  return `${base}-400.webp 400w, ${base}-800.webp 800w, ${base}.webp 1200w`;
}

export function MenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t } = useLocale();
  const fromFeatured = (location.state as { from?: string } | null)?.from === "featured";
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const rawItem = id ? site.menu.find((m) => m.id === id) : null;
  if (!rawItem) return <Navigate to="/menu" replace />;

  const hasVariants =
    "flavors" in rawItem &&
    "sizes" in rawItem &&
    Array.isArray((rawItem as unknown as { flavors?: readonly unknown[] }).flavors);
  const hasCustomPrice = !hasVariants && rawItem.priceAmount === 0;

  const item: MenuItem & { priceAmount: number } = {
    id: rawItem.id,
    name: t(`products.${rawItem.id}.name`),
    description: t(`products.${rawItem.id}.description`),
    price: hasVariants || hasCustomPrice ? (rawItem as { price: string }).price : `${rawItem.priceAmount} ${t("currency")}`,
    priceAmount: hasVariants ? 0 : rawItem.priceAmount,
    image: rawItem.image,
  };

  const imageSrc = item.image ?? DEFAULT_PRODUCT_IMAGE;
  const webpSrc = webpUrl(imageSrc);
  const webpSet = webpSrcSet(imageSrc);
  const imgStyle =
    item.id === "kunafa_roll_nid_mix"
      ? { width: "115%", height: "115%" }
      : item.id === "tartelette"
        ? { width: "82%", height: "82%", marginLeft: "6%" }
        : item.id === "tiramisu" || item.id === "flan"
          ? { marginTop: "-6%" }
        : undefined;
  const isStarred = starredProductIds.includes(item.id as (typeof starredProductIds)[number]);
  const favorite = isFavorite(item.id);

  const handleAddToCart = () => {
    addItem(
      { id: item.id, name: item.name, priceDisplay: item.price, priceAmount: item.priceAmount },
      quantity
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 800);
  };

  const handleAddVariantToCart = () => {
    if (!selectedFlavor || !selectedSize) return;
    const flavorLabel = t(`products.tiramisu.flavors.${selectedFlavor}`);
    const sizeLabel = t(`products.tiramisu.size${selectedSize}` as "products.tiramisu.sizeP" | "products.tiramisu.sizeG");
    const variantId = `tiramisu_${selectedFlavor}_${selectedSize}`;
    const variantName = `${item.name} – ${flavorLabel} (${sizeLabel})`;
    const priceAmount = tiramisuPrices[selectedFlavor as keyof typeof tiramisuPrices][selectedSize as "P" | "G"];
    const priceDisplay = `${priceAmount} ${t("currency")}`;
    addItem(
      { id: variantId, name: variantName, priceDisplay, priceAmount },
      quantity
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 800);
  };

  return (
    <>
      <header className="sticky top-[var(--navbar-h,64px)] z-20 border-b border-gold/20 bg-[var(--color-inverse-bg)] py-4 text-[var(--color-on-inverse)] sm:py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4">
          <Link
            to={fromFeatured ? "/#featured" : "/menu"}
            className="flex shrink-0 items-center gap-2 text-sm text-[var(--color-on-inverse)]/80 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{t("gestionVente.back")}</span>
          </Link>
          <h1 className="font-display flex min-w-0 flex-1 items-center justify-center gap-2 text-center text-lg font-semibold sm:text-xl md:text-2xl">
            <UtensilsCrossed className="h-5 w-5 shrink-0 text-gold sm:h-6 sm:w-6" aria-hidden />
            <span className="truncate">{item.name}</span>
          </h1>
          <span className="w-14 shrink-0 sm:w-20" aria-hidden />
        </div>
      </header>

      <main className="min-h-[50vh] bg-cream px-4 py-8 sm:py-10 md:py-12">
        <div className="mx-auto max-w-2xl">
          <motion.article
            className="group overflow-hidden rounded-2xl border border-gold/25 bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] dark:border-gold/30 dark:shadow-[var(--shadow-card)] dark:hover:shadow-[var(--shadow-card-hover)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Image avec cadre premium */}
            <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark/60 sm:aspect-[3/2]">
              <div className="absolute inset-0 bg-gradient-to-t from-dark/10 via-transparent to-transparent pointer-events-none z-[1]" aria-hidden />
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-cream/95 p-1.5 shadow-md transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/50 dark:bg-dark/80 dark:hover:bg-gold/15"
                aria-label={favorite ? t("favorites.remove") : t("favorites.add")}
              >
                <Heart className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${favorite ? "fill-gold text-gold" : "text-gold"}`} aria-hidden />
              </button>
              {isStarred && (
                <span
                  className="absolute left-0 top-0 z-10 h-0 w-0 border-[24px] border-gold border-r-transparent border-b-transparent shadow-[2px_2px_6px_rgba(0,0,0,0.2)] sm:border-[28px]"
                  aria-label={t("featured.title")}
                />
              )}
              {webpSrc ? (
                <picture>
                  <source
                    srcSet={webpSet ?? webpSrc}
                    type="image/webp"
                    sizes="(max-width: 640px) 100vw, 672px"
                  />
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    style={imgStyle}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </picture>
              ) : (
                <img
                  src={imageSrc}
                  alt={item.name}
                  className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
                  style={imgStyle}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
            </div>

            {/* Contenu : description, prix ou parfums/tailles, CTA — centré et rangé */}
            <div className="relative flex flex-col items-center border-t border-gold/20 px-6 py-6 text-center sm:px-8 sm:py-8">
              <p className="text-base font-medium leading-relaxed text-dark/90 dark:text-dark-muted sm:text-lg">
                {item.description}
              </p>
              <div className="mt-3 h-0.5 w-12 rounded-full bg-gold/60" aria-hidden />

              {hasVariants ? (
                <>
                  <p className="mt-4 max-w-md text-sm font-medium text-gold dark:text-gold-light">
                    {t("products.tiramisu.description")}
                  </p>
                  <div className="mt-5 w-full max-w-lg">
                    <span className="block text-xs font-medium uppercase tracking-wide text-dark/70 dark:text-dark-muted">
                      {t("menuPage.flavorLabel")}
                    </span>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {tiramisuFlavorIds.map((flavorId) => (
                        <button
                          key={flavorId}
                          type="button"
                          onClick={() => {
                          setSelectedFlavor(flavorId);
                          setSelectedSize(null);
                        }}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] ${
                            selectedFlavor === flavorId
                              ? "border-gold bg-gold/20 text-gold"
                              : "border-gold/30 bg-transparent text-dark hover:bg-gold/10 dark:text-dark-muted dark:hover:bg-gold/15"
                          }`}
                        >
                          {t(`products.tiramisu.flavors.${flavorId}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 w-full max-w-lg grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-wide text-dark/70 dark:text-dark-muted">
                        {t("menuPage.sizeLabel")}
                      </span>
                      <div className="mt-2 flex justify-center gap-2">
                        {tiramisuSizeIds.map((sizeId) => (
                          <button
                            key={sizeId}
                            type="button"
                            disabled={!selectedFlavor}
                            onClick={() => setSelectedSize(sizeId)}
                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent ${
                              selectedSize === sizeId
                                ? "border-gold bg-gold/20 text-gold"
                                : "border-gold/30 bg-transparent text-dark hover:bg-gold/10 dark:text-dark-muted dark:hover:bg-gold/15"
                            }`}
                          >
                            {t(`products.tiramisu.size${sizeId}` as "products.tiramisu.sizeP" | "products.tiramisu.sizeG")}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-wide text-dark/70 dark:text-dark-muted">
                        {t("menuPage.quantityLabel")}
                      </span>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          disabled={!selectedSize}
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-[var(--color-surface)] text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--color-surface)] dark:border-gold/40 dark:bg-cream-dark dark:disabled:hover:bg-cream-dark"
                          aria-label={t("menuPage.quantityLabel")}
                        >
                          <Minus className="h-4 w-4" aria-hidden />
                        </button>
                        <span className="min-w-[2rem] text-center font-display text-lg font-semibold tabular-nums text-dark dark:text-dark">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={!selectedSize}
                          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-[var(--color-surface)] text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--color-surface)] dark:border-gold/40 dark:bg-cream-dark dark:disabled:hover:bg-cream-dark"
                          aria-label={t("menuPage.quantityLabel")}
                        >
                          <Plus className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap">
                    <span className="flex flex-col items-center">
                      {selectedFlavor && selectedSize && quantity > 1 && (
                        <span className="text-sm text-dark/70 dark:text-dark-muted">
                          {tiramisuPrices[selectedFlavor as keyof typeof tiramisuPrices][selectedSize as "P" | "G"]} {t("currency")} × {quantity}
                        </span>
                      )}
                      <span className="font-display text-xl font-semibold text-gold dark:text-gold-light sm:text-2xl">
                        {selectedFlavor && selectedSize
                          ? `${(tiramisuPrices[selectedFlavor as keyof typeof tiramisuPrices][selectedSize as "P" | "G"] * quantity)} ${t("currency")}`
                          : item.price}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddVariantToCart}
                      disabled={!selectedFlavor || !selectedSize}
                      className={`w-full min-w-[12rem] max-w-xs shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-offset-[var(--color-surface)] sm:w-auto sm:py-3 sm:text-base ${
                        added
                          ? "border-gold/60 bg-gold/20 text-gold"
                          : "border-gold/50 bg-gold/10 text-gold hover:bg-gold/20"
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                          {t("cart.addedToCart")}
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                          {t("menuPage.addToCart")}
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 w-full">
                    <span className="block text-xs font-medium uppercase tracking-wide text-dark/70 dark:text-dark-muted">
                      {t("menuPage.quantityLabel")}
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-[var(--color-surface)] text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] dark:border-gold/40 dark:bg-cream-dark"
                        aria-label={t("menuPage.quantityLabel")}
                      >
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <span className="min-w-[2rem] text-center font-display text-lg font-semibold tabular-nums text-dark dark:text-dark">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-[var(--color-surface)] text-gold transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] dark:border-gold/40 dark:bg-cream-dark"
                        aria-label={t("menuPage.quantityLabel")}
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap">
                    <span className="flex flex-col items-center">
                      {item.priceAmount > 0 && quantity > 1 && (
                        <span className="text-sm text-dark/70 dark:text-dark-muted">
                          {item.priceAmount} {t("currency")} × {quantity}
                        </span>
                      )}
                      <span className="font-display text-xl font-semibold text-gold dark:text-gold-light sm:text-2xl">
                        {item.priceAmount > 0 && quantity > 1
                          ? `${(item.priceAmount * quantity).toFixed(quantity % 1 === 0 ? 0 : 2)} ${t("currency")}`
                          : item.price}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                    className={`w-full min-w-[12rem] max-w-xs shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-[var(--color-surface)] sm:w-auto sm:py-3 sm:text-base ${
                      added
                        ? "border-gold/60 bg-gold/20 text-gold"
                        : "border-gold/50 bg-gold/10 text-gold hover:bg-gold/20"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                        {t("cart.addedToCart")}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                        {t("menuPage.addToCart")}
                      </>
                    )}
                  </button>
                  </div>
                </>
              )}
            </div>
          </motion.article>
        </div>
      </main>
    </>
  );
}
