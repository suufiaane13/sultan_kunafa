import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Star } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { starredProductIds } from "@/content/site";

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
}

const DEFAULT_PRODUCT_IMAGE = "/photo.png";

/** Base URL sans extension (ex. /photos/kunafa_nutella). */
function imageBase(path: string): string | null {
  if (!path || path === DEFAULT_PRODUCT_IMAGE) return null;
  const match = path.match(/\.(png|jpe?g)$/i);
  return match ? path.slice(0, -match[0].length) : null;
}

/** URL WebP (après npm run optimize-images). */
function webpUrl(path: string): string | null {
  const base = imageBase(path);
  return base ? base + ".webp" : null;
}

/** srcset WebP responsive pour les photos du menu (400w, 800w, 1200w). */
function webpSrcSet(path: string): string | null {
  const base = imageBase(path);
  if (!base || !base.startsWith("/photos/")) return null;
  return `${base}-400.webp 400w, ${base}-800.webp 800w, ${base}.webp 1200w`;
}

export function MenuCard({ item, index = 0, priceAmount, onAddToCart, priority = false, linkToDetail = false }: MenuCardProps) {
  const { t } = useLocale();
  const [added, setAdded] = useState(false);
  const showAddToCart = typeof priceAmount === "number" && onAddToCart;

  const handleAdd = () => {
    if (!onAddToCart || typeof priceAmount !== "number") return;
    onAddToCart({ ...item, priceAmount });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 800);
  };
  const imageSrc = item.image ?? DEFAULT_PRODUCT_IMAGE;
  const webpSrc = webpUrl(imageSrc);
  const webpSet = webpSrcSet(imageSrc);
  const imgClass = "h-full w-full object-contain transition-transform duration-300 group-hover:scale-105";
  const imgStyle =
    item.id === "kunafa_roll_nid_mix"
      ? { width: "115%", height: "115%" }
      : undefined;
  const isStarred = starredProductIds.includes(item.id as (typeof starredProductIds)[number]);

  return (
    <motion.article
      className="group relative overflow-hidden rounded-xl border border-gold/20 bg-cream shadow-lg transition-shadow hover:shadow-xl md:rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      {isStarred && (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-cream/95 p-1.5 shadow-md dark:bg-dark/80" aria-hidden>
          <Star className="h-4 w-4 fill-gold text-gold sm:h-4.5 sm:w-4.5" />
        </span>
      )}
      <div className={`flex aspect-square items-center justify-center overflow-hidden bg-cream-dark/60 sm:aspect-[4/3] ${linkToDetail ? "cursor-pointer" : ""}`}>
        {linkToDetail ? (
          <Link to={`/menu/${item.id}`} className="flex h-full w-full items-center justify-center">
            {webpSrc ? (
              <picture>
                <source
                  srcSet={webpSet ?? webpSrc}
                  type="image/webp"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
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
      <div className="p-3 sm:p-4 md:p-5">
        {/* Mobile : nom pleine largeur (1 ligne), prix en dessous — Desktop : nom + prix sur une ligne */}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          {linkToDetail ? (
            <Link to={`/menu/${item.id}`} className="min-w-0 flex-1 sm:flex-1">
              <h3
                className="min-w-0 truncate font-display text-xs font-semibold leading-snug tracking-tight text-dark hover:text-gold sm:text-base sm:tracking-normal md:text-xl"
                title={item.name}
              >
                {item.name}
              </h3>
            </Link>
          ) : (
            <h3
              className="min-w-0 truncate font-display text-xs font-semibold leading-snug tracking-tight text-dark sm:flex-1 sm:text-base sm:tracking-normal md:text-xl"
              title={item.name}
            >
              {item.name}
            </h3>
          )}
          {item.price ? (
            <span className="shrink-0 text-xs font-semibold text-gold sm:text-sm md:text-base">
              {item.price}
            </span>
          ) : null}
        </div>

        {showAddToCart && (
          <button
            type="button"
            onClick={handleAdd}
            className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 sm:mt-3 sm:py-2.5 sm:text-sm ${
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
        )}
      </div>
    </motion.article>
  );
}
