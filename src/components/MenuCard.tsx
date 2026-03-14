import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Heart, ChevronRight, Star } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { starredProductIds } from "@/content/site";
import { useFavorites } from "@/context/FavoritesContext";
import { DEFAULT_PRODUCT_IMAGE, webpUrl, webpSrcSet } from "@/lib/imageUtils";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

interface MenuCardProps {
  item: MenuItem;
  index?: number;
  /** Ajouter au panier (page Menu) : passe priceAmount pour activer le bouton. */
  priceAmount?: number;
  onAddToCart?: (item: MenuItem & { priceAmount: number }) => void;
  /** true = chargement immédiat (above-the-fold), false = lazy */
  priority?: boolean;
  /** true = image et titre cliquables vers /menu/:id */
  linkToDetail?: boolean;
  /** State passé au Link (ex. { from: 'featured' } pour retour vers accueil) */
  linkState?: Record<string, unknown>;
  /** CTA de détail (ex. "Choisir le goût") quand pas d'ajout direct */
  detailCtaLabel?: string;
  /** Affichage liste : image à gauche. Grandes cartes : image + typo premium. */
  layout?: "card" | "list" | "featured";
}

export function MenuCard({ item, index = 0, priceAmount, onAddToCart, priority = false, linkToDetail = false, linkState, detailCtaLabel, layout = "card" }: MenuCardProps) {
  const { t } = useLocale();
  const { isFavorite, toggle } = useFavorites();
  const [added, setAdded] = useState(false);
  const showAddToCart = typeof priceAmount === "number" && onAddToCart;
  const rememberMenuScroll = () => {
    try {
      sessionStorage.setItem("sultan-kunafa:menu-scroll-y", String(window.scrollY));
    } catch {
      // ignore
    }
  };

  const handleAdd = () => {
    if (!onAddToCart || typeof priceAmount !== "number") return;
    onAddToCart({ ...item, priceAmount });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 800);
  };
  const imageSrc = item.image ?? DEFAULT_PRODUCT_IMAGE;
  const webpSrc = webpUrl(imageSrc);
  const webpSet = webpSrcSet(imageSrc);
  const imgClass = "h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105";
  const imgStyle =
    item.id === "kunafa_roll_nid_mix"
      ? { width: "115%", height: "115%" }
      : item.id === "tartelette"
        ? { width: "82%", height: "82%", marginLeft: "8%" }
        : item.id === "tiramisu" || item.id === "flan"
          ? { marginTop: "-6%" }
          : undefined;
  const isStarred = starredProductIds.includes(item.id as (typeof starredProductIds)[number]);
  const favorite = isFavorite(item.id);

  const isList = layout === "list";
  const isFeatured = layout === "featured";
  const imageSizes = isFeatured
    ? "(max-width: 1024px) 100vw, 480px"
    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px";

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-xl border bg-cream transition-shadow md:rounded-2xl ${
        isFeatured
          ? "border-gold/30 shadow-xl hover:shadow-2xl"
          : `border-gold/20 shadow-lg hover:shadow-xl ${isList ? "flex flex-row items-stretch" : ""}`
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={isList ? undefined : { y: isFeatured ? -6 : -4 }}
    >
      <div className={isList ? "relative shrink-0 w-28 sm:w-36" : "contents"}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(item.id);
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-cream/95 p-1.5 shadow-md transition hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold/50 dark:bg-dark/80 dark:hover:bg-gold/15"
          aria-label={favorite ? t("favorites.remove") : t("favorites.add")}
        >
          <Heart className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${favorite ? "fill-gold text-gold" : "text-gold"}`} aria-hidden />
        </button>
        {isStarred && (
          <>
            <span
              className="absolute left-0 top-0 z-10 h-0 w-0 border-[20px] border-gold border-r-transparent border-b-transparent sm:border-[24px]"
              aria-hidden
            />
            <span
              className="absolute left-1.5 top-1.5 z-20 flex items-center justify-center sm:left-2 sm:top-2"
              aria-label={t("featured.title")}
            >
              <Star className="h-3.5 w-3.5 fill-[#2B1D0E] text-[#2B1D0E] sm:h-4 sm:w-4 dark:fill-[#2B1D0E] dark:text-[#2B1D0E]" aria-hidden />
            </span>
          </>
        )}
        <div
          className={`relative flex items-center justify-center overflow-hidden bg-cream-dark/60 ${linkToDetail ? "cursor-pointer" : ""} ${
            isList
              ? "aspect-square sm:aspect-square"
              : isFeatured
                ? "aspect-[4/3] sm:aspect-[3/2]"
                : "aspect-square sm:aspect-[4/3]"
          }`}
        >
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-dark/10 via-transparent to-transparent pointer-events-none" aria-hidden />
        {linkToDetail ? (
          <Link
            to={`/menu/${item.id}`}
            state={linkState}
            onClick={rememberMenuScroll}
            className={`flex h-full w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset focus-visible:ring-offset-0 ${isList ? "rounded-l-xl md:rounded-l-2xl" : "rounded-t-xl md:rounded-t-2xl"}`}
          >
            {webpSrc ? (
              <picture>
                <source
                  srcSet={webpSet ?? webpSrc}
                  type="image/webp"
                  sizes={imageSizes}
                />
                <img
                  src={imageSrc}
                  alt={item.name}
                  className={imgClass}
                  style={imgStyle}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  {...(priority && { fetchpriority: "high" })}
                />
              </picture>
            ) : (
              <img
                src={imageSrc}
                alt={item.name}
                className={imgClass}
                style={imgStyle}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                {...(priority && { fetchpriority: "high" })}
              />
            )}
          </Link>
        ) : (
          <>
            {webpSrc ? (
              <picture>
                <source
                  srcSet={webpSet ?? webpSrc}
                  type="image/webp"
                  sizes={imageSizes}
                />
                <img
                  src={imageSrc}
                  alt={item.name}
                  className={imgClass}
                  style={imgStyle}
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  {...(priority && { fetchpriority: "high" })}
                />
              </picture>
            ) : (
              <img
                src={imageSrc}
                alt={item.name}
                className={imgClass}
                style={imgStyle}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                {...(priority && { fetchpriority: "high" })}
              />
            )}
          </>
        )}
      </div>
      </div>
      <div
        className={
          isList
            ? "flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4 md:p-5"
            : isFeatured
              ? "p-4 sm:p-5 md:p-6"
              : "p-3 sm:p-4 md:p-5"
        }
      >
        {/* Mobile : nom pleine largeur (1 ligne), prix en dessous — Desktop : nom + prix sur une ligne */}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          {linkToDetail ? (
            <Link
              to={`/menu/${item.id}`}
              state={linkState}
              onClick={rememberMenuScroll}
              tabIndex={-1}
              className="min-w-0 flex-1 sm:flex-1"
            >
              <h3
                className={`flex min-w-0 items-center gap-1 truncate font-display font-semibold leading-snug tracking-tight text-dark hover:text-gold ${
                  isFeatured
                    ? "text-base sm:text-lg md:text-xl lg:text-2xl sm:tracking-normal"
                    : "text-xs sm:text-base sm:tracking-normal md:text-xl"
                }`}
                title={item.name}
              >
                {item.name}
              </h3>
            </Link>
          ) : (
            <h3
              className={`flex min-w-0 items-center gap-1 truncate font-display font-semibold leading-snug tracking-tight text-dark sm:flex-1 ${
                isFeatured
                  ? "text-base sm:text-lg md:text-xl lg:text-2xl sm:tracking-normal"
                  : "text-xs sm:text-base sm:tracking-normal md:text-xl"
              }`}
              title={item.name}
            >
              {item.name}
            </h3>
          )}
          {item.price ? (
            <span
              className={`shrink-0 font-semibold text-gold ${isFeatured ? "text-sm sm:text-base md:text-lg" : "text-xs sm:text-sm md:text-base"}`}
            >
              {item.price}
            </span>
          ) : null}
        </div>

        {showAddToCart ? (
          <button
            type="button"
            onClick={handleAdd}
            disabled={added}
            aria-busy={added}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-90 ${
              isFeatured ? "py-2.5 sm:mt-4 sm:py-3 sm:text-base" : "py-2 text-xs sm:mt-3 sm:py-2.5 sm:text-sm"
            } ${
              added
                ? "border-gold/60 bg-gold/20 text-gold"
                : "border-gold/50 bg-gold/10 text-gold hover:bg-gold/20"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                {t("cart.addedToCart")}
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                {t("menuPage.addToCart")}
              </>
            )}
          </button>
        ) : detailCtaLabel && linkToDetail ? (
          <Link
            to={`/menu/${item.id}`}
            state={linkState}
            onClick={rememberMenuScroll}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gold/50 bg-gold/10 font-medium text-gold transition hover:bg-gold/20 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
              isFeatured ? "py-2.5 sm:mt-4 sm:py-3 sm:text-base" : "py-2 text-xs sm:mt-3 sm:py-2.5 sm:text-sm"
            }`}
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            <span>{detailCtaLabel}</span>
          </Link>
        ) : null}
      </div>
    </motion.article>
  );
}
