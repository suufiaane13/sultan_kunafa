import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, UtensilsCrossed, Info, ShoppingBag, Heart } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { NavDrawer } from "@/components/NavDrawer";
import { LangSwitcher } from "@/components/LangSwitcher";

const links = [
  { to: "/menu", labelKey: "nav.menu" as const, icon: UtensilsCrossed },
  { to: "/favoris", labelKey: "nav.favorites" as const, icon: Heart },
  { to: "/about", labelKey: "nav.about" as const, icon: Info },
];

const HERO_THRESHOLD = 120;

export function Navbar() {
  const { t } = useLocale();
  const { openCart, totalCount, cartBump, isOpen: cartOpen } = useCart();
  const { ids: favoriteIds } = useFavorites();
  const favoritesCount = favoriteIds.length;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (location.pathname !== "/") {
      setOverHero(false);
      return;
    }
    const check = () => setOverHero(window.scrollY < HERO_THRESHOLD);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [location.pathname]);

  // Expose la hauteur réelle de la navbar pour les sous-headers sticky.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--navbar-h", `${h}px`);
    };

    setVar();
    window.addEventListener("resize", setVar, { passive: true });
    return () => window.removeEventListener("resize", setVar);
  }, []);

  // Bloquer le scroll du body quand le menu (drawer) est ouvert
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  const headerOverHero = location.pathname === "/" && overHero;

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-30 border-b shadow-[var(--shadow-nav)] backdrop-blur-md transition-colors duration-200 ${
          headerOverHero
            ? "border-gold/20 bg-[var(--color-inverse-bg)]/90 text-[var(--color-on-inverse)]"
            : "border-gold/20 bg-[var(--color-cream)]/95 text-dark dark:border-gold/30 dark:bg-[var(--color-cream-dark)]/95"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-1.5 sm:px-6 sm:py-1.5 md:px-6 md:py-1.5 lg:px-8">
          <div className="flex items-center justify-between gap-4 md:gap-6">
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex shrink-0 items-center transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] rounded-lg"
            aria-label="SWEETŞ"
          >
            <img
              src="/logo-navbar.png"
              alt=""
              className="h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
              width={80}
              height={80}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label={t("navDrawer.title")}
          >
            {links.map(({ to, labelKey, icon: Icon }) => {
              const isActive = location.pathname === to;
              const showFavCount = to === "/favoris" && favoritesCount > 0;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`font-display relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium tracking-wide transition-colors md:px-5 md:py-3 ${
                    isActive
                      ? "text-gold"
                      : headerOverHero
                        ? "text-[var(--color-on-inverse)]/90 hover:text-gold"
                        : "text-dark/80 hover:text-gold dark:text-dark-muted dark:hover:text-gold"
                  } focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)]`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-lg bg-gold/10 dark:bg-gold/15"
                      aria-hidden
                    />
                  )}
                  <Icon className="relative h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  <span className="relative">{t(labelKey)}</span>
                  {showFavCount && (
                    <span className="font-display absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold tabular-nums text-white">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:block">
              <LangSwitcher variant="navbar" overHero={headerOverHero} />
            </div>
            <button
              type="button"
              onClick={openCart}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-gold/15 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] ${
                headerOverHero ? "text-[var(--color-on-inverse)]/90" : "text-dark/80 dark:text-dark-muted"
              } ${cartBump ? "cart-bump" : ""}`}
              aria-label={t("cart.title")}
            >
              <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
              {totalCount > 0 && !cartOpen && (
                <span className="font-display absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold tabular-nums text-white">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-gold/15 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-cream)] md:hidden ${
                headerOverHero ? "text-[var(--color-on-inverse)]/90" : "text-dark/80 dark:text-dark-muted"
              }`}
              aria-label={t("navDrawer.title")}
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5 shrink-0" aria-hidden />
              {favoritesCount > 0 && (
<span className="font-display absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold tabular-nums text-white">
                {favoritesCount > 99 ? "99+" : favoritesCount}
              </span>
            )}
          </button>
        </div>
          </div>
        </div>
      </header>
      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
