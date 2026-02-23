import { Link, useLocation } from "react-router-dom";
import { UtensilsCrossed, Info } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

const links = [
  { to: "/menu", labelKey: "nav.menu" as const, icon: UtensilsCrossed },
  { to: "/about", labelKey: "nav.about" as const, icon: Info },
];

export function Footer() {
  const { t } = useLocale();
  const location = useLocation();
  return (
    <footer className="border-t border-gold/20 bg-inverse-bg text-on-inverse">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="Sultan Kunafa"
          >
            <img
              src="/logo.png"
              alt="Sultan Kunafa"
              className="h-14 w-14 object-contain md:h-16 md:w-16"
              width={64}
              height={64}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>

          <nav className="flex items-center gap-8" aria-label={t("navDrawer.title")}>
            {links.map(({ to, labelKey, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gold md:text-base ${
                    isActive ? "text-gold" : "text-on-inverse/90"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {t(labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-0.5 border-t border-gold/10 pt-6 text-center text-sm text-on-inverse/70 md:flex-row md:items-baseline md:gap-x-1 md:text-left rtl:md:text-right">
          <span>© {new Date().getFullYear()} Sultan Kunafa.</span>
          <span>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
