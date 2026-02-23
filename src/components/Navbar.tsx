import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, UtensilsCrossed, Info, ShoppingBag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import { NavDrawer } from "@/components/NavDrawer";
import { LangSwitcher } from "@/components/LangSwitcher";

const links = [
  { to: "/menu", labelKey: "nav.menu" as const, icon: UtensilsCrossed },
  { to: "/about", labelKey: "nav.about" as const, icon: Info },
];

const HERO_THRESHOLD = 120;

export function Navbar() {
  const { t } = useLocale();
  const { openCart, totalCount, cartBump } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overHero, setOverHero] = useState(false);
  const location = useLocation();

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
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors supports-[backdrop-filter]:bg-opacity-60 ${
          headerOverHero
            ? "border-gold/20 bg-[var(--color-inverse-bg)]/80 text-on-inverse"
            : "border-[var(--color-border)] bg-[var(--color-cream)]/70 text-dark supports-[backdrop-filter]:bg-[var(--color-cream)]/60"
        }`}
        style={{ boxShadow: "var(--shadow-nav, 0 1px 0 rgba(201,155,45,0.06))" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex shrink-0 items-center transition-opacity hover:opacity-90 focus:outline-none"
            aria-label="Sultan Kunafa"
          >
            <img
              src="/logo.png"
              alt="Sultan Kunafa"
              className="h-9 w-9 object-contain sm:h-10 sm:w-10 md:h-11 md:w-11"
              width={44}
              height={44}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label={t("navDrawer.title")}
          >
            {links.map(({ to, labelKey, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium tracking-wide transition-colors md:px-5 md:py-3 ${
                    isActive ? "text-gold" : headerOverHero ? "text-on-inverse/90 hover:text-gold" : "text-dark/80 hover:text-gold"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-md bg-gold/10"
                      aria-hidden
                    />
                  )}
                  <Icon className="relative h-4 w-4 opacity-90" aria-hidden />
                  <span className="relative">{t(labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <LangSwitcher variant="navbar" overHero={headerOverHero} />
            </div>
            <button
              type="button"
              onClick={openCart}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gold/15 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream sm:h-11 sm:w-11 ${
                headerOverHero ? "text-on-inverse/90" : "text-dark/80"
              } ${cartBump ? "cart-bump" : ""}`}
              aria-label={t("cart.title")}
            >
              <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
              {totalCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[11px] font-bold tabular-nums text-white">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gold/15 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream md:hidden ${
                headerOverHero ? "text-on-inverse/90" : "text-dark/80"
              }`}
              aria-label={t("navDrawer.title")}
              aria-expanded={drawerOpen}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>
      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
