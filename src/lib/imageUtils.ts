/**
 * Utilitaires pour les images produits (WebP, srcset).
 * Utilisé par MenuCard, et réutilisable pour ProductImage plus tard.
 */

export const DEFAULT_PRODUCT_IMAGE = "/photos/photo.png";

/** Base URL sans extension (ex. /photos/kunafa_nutella). */
export function imageBase(path: string): string | null {
  if (!path || path === DEFAULT_PRODUCT_IMAGE) return null;
  const match = path.match(/\.(png|jpe?g)$/i);
  return match ? path.slice(0, -match[0].length) : null;
}

/** URL WebP (après npm run optimize-images). */
export function webpUrl(path: string): string | null {
  const base = imageBase(path);
  return base ? base + ".webp" : null;
}

/** srcset WebP responsive pour les photos du menu (400w, 800w, 1200w). */
export function webpSrcSet(path: string): string | null {
  const base = imageBase(path);
  if (!base || !base.startsWith("/photos/")) return null;
  return `${base}-400.webp 400w, ${base}-800.webp 800w, ${base}.webp 1200w`;
}
