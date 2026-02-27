import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { MenuCard } from "@/components/MenuCard";
import { useLocale } from "@/context/LocaleContext";
import { site } from "@/content/site";
import { ChevronRight } from "lucide-react";

export function Home() {
  const { t } = useLocale();
  const featured = site.featured.items.map((item) => ({
    id: item.id,
    name: t(`products.${item.id}.name`),
    description: t(`products.${item.id}.description`),
    price: `${item.priceAmount} ${t("currency")}`,
    image: "image" in item ? item.image : undefined,
  }));

  return (
    <>
      <Hero />
      <AboutSection />
      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4 sm:py-12 md:py-16" aria-labelledby="featured-heading">
        <div className="flex flex-col items-center text-center">
          <h2 id="featured-heading" className="font-display text-2xl font-semibold text-dark sm:text-3xl md:text-4xl">
            {t("featured.title")}
          </h2>
        </div>
        {/* Grille : mobile 2 cols, tablette 2 cols, web 3 cols ; dernière ligne centrée si incomplète */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4 md:gap-6 lg:gap-8">
          {featured.map((item, i) => (
            <div key={item.id} className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:min-w-[calc((100%-4rem)/3)] lg:max-w-[calc((100%-4rem)/3)] lg:flex-[0_0_calc((100%-4rem)/3)]">
              <MenuCard item={item} index={i} priority linkToDetail />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center sm:mt-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark shadow-md transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cream sm:px-6 sm:py-3 sm:text-base"
            data-ga-event="menu_see_more"
          >
            {t("featured.seeMore")}
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 rtl:rotate-180" aria-hidden />
          </Link>
        </div>
        <div className="mt-12 md:mt-20">
          <CTASection />
        </div>
      </section>
    </>
  );
}
