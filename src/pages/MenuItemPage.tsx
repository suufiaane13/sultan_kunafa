import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Check, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/components/MenuCard";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { site } from "@/content/site";

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
  const { t } = useLocale();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const rawItem = id ? site.menu.find((m) => m.id === id) : null;
  if (!rawItem) return <Navigate to="/menu" replace />;

  const item: MenuItem & { priceAmount: number } = {
    id: rawItem.id,
    name: t(`products.${rawItem.id}.name`),
    description: t(`products.${rawItem.id}.description`),
    price: `${rawItem.priceAmount} ${t("currency")}`,
    priceAmount: rawItem.priceAmount,
    image: rawItem.image,
  };

  const imageSrc = item.image ?? DEFAULT_PRODUCT_IMAGE;
  const webpSrc = webpUrl(imageSrc);
  const webpSet = webpSrcSet(imageSrc);
  const imgStyle = item.id === "kunafa_roll_nid_mix" ? { width: "115%", height: "115%" } : undefined;

  const handleAddToCart = () => {
    addItem(
      { id: item.id, name: item.name, priceDisplay: item.price, priceAmount: item.priceAmount },
      1
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 800);
  };

  return (
    <>
      <header className="border-b border-gold/20 bg-[var(--color-inverse-bg)] py-4 text-[var(--color-on-inverse)] sm:py-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4">
          <Link
            to="/menu"
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
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  style={imgStyle}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              )}
            </div>

            {/* Contenu : nom, prix, CTA */}
            <div className="relative border-t border-gold/20 px-6 py-6 sm:px-8 sm:py-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-dark dark:text-dark sm:text-3xl">
                {item.name}
              </h2>
              <div className="mt-1 h-0.5 w-12 rounded-full bg-gold/60" aria-hidden />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 sm:mt-8">
                <span className="font-display text-xl font-semibold text-gold dark:text-gold-light sm:text-2xl">
                  {item.price}
                </span>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg border py-2.5 px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream dark:focus:ring-offset-[var(--color-surface)] sm:py-3 sm:text-base ${
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
            </div>
          </motion.article>

          <p className="mt-8 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10 hover:text-gold-dark dark:text-gold-light dark:hover:bg-gold/15 dark:hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
              {t("menuPage.title")}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
