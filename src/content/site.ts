/**
 * Contenu & config — PRD simplifié (todo.md).
 * Source unique pour copy et CTA WhatsApp.
 * Images menu : public/photos/{id}.png (ex. baklava_carre_noix.png)
 */

/** Produits mis en avant (affichage d'une étoile). */
export const starredProductIds = ["baklava_carre_noix", "kunafa_a_la_creme", "kunafa_nutella"] as const;

export const site = {
  seo: {
    title: "Sultan Kunafa | Desserts orientaux premium",
    description: "Découvrez nos kunafas : luxe, tradition et modernité.",
    ogImage: "/og-hero.jpg",
  },
  contact: {
    phone: "+212 7 01 73 01 74",
    whatsappNumber: "212701730174", // E.164 sans +
    whatsappMessageDefault: "Bonjour, je souhaite commander chez Sultan Kunafa.",
    mapEmbedUrl: "https://www.google.com/maps?q=34.655196988561705,-1.8970717785253848&z=16&output=embed",
  },
  hero: {
    title: "SULTAN KUNAFA",
    subtitle: "Kunafa authentique, préparé avec passion et tradition.",
    ctaLabel: "Voir le menu",
    ctaHref: "/menu",
  },
  featured: {
    title: "Nos créations",
    items: [
      { id: "baklava_carre_noix", name: "Baklava carré noix", description: "Baklava carré aux noix.", price: "11 DH", priceAmount: 11, image: "/photos/baklava_carre_noix.png" },
      { id: "kunafa_a_la_creme", name: "Kunafa à la crème", description: "Kunafa généreuse à la crème.", price: "10 DH", priceAmount: 10, image: "/photos/kunafa_a_la_crème.png" },
      { id: "kunafa_nutella", name: "Kunafa Nutella", description: "Kunafa au Nutella.", price: "9 DH", priceAmount: 9, image: "/photos/kunafa_nutella.png" },
    ],
  },
  menu: [
    { id: "baklava_carre_noix", name: "Baklava carré noix", description: "Baklava carré aux noix", price: "11 DH", priceAmount: 11, image: "/photos/baklava_carre_noix.png" },
    { id: "baklava_losange_noix", name: "Baklava losange noix", description: "Baklava en losange aux noix", price: "3,5 DH", priceAmount: 3.5, image: "/photos/baklava_losange_noix.png" },
    { id: "baklava_roule", name: "Baklava roulé", description: "Baklava roulé", price: "9 DH", priceAmount: 9, image: "/photos/baklava_roule_noix.png" },
    { id: "kunafa_a_la_creme", name: "Kunafa à la crème", description: "Kunafa à la crème", price: "10 DH", priceAmount: 10, image: "/photos/kunafa_a_la_crème.png" },
    { id: "kunafa_fruits_secs_mix", name: "Kunafa fruits secs mix", description: "Kunafa aux fruits secs mix", price: "8 DH", priceAmount: 8, image: "/photos/kunafa_fruits_secs_mix.png" },
    { id: "kunafa_mini_nid_amandes", name: "Kunafa mini nid amandes", description: "Mini nid aux amandes", price: "3 DH", priceAmount: 3, image: "/photos/kunafa_mini_nid_amandes.png" },
    { id: "kunafa_roll_nid_mix", name: "Kunafa roll nid mix", description: "Roulé nid mix", price: "8 DH", priceAmount: 8, image: "/photos/kunafa_roll_nid_mix.png" },
    { id: "kunafa_nutella", name: "Kunafa Nutella", description: "Kunafa Nutella", price: "9 DH", priceAmount: 9, image: "/photos/kunafa_nutella.png" },
  ],
  about: "Sultan Kunafa allie tradition orientale et goût moderne pour des desserts inoubliables, inspirés d'un héritage précieux.",
  cta: {
    title: "Prêt à commander ?",
    subtitle: "Sélectionnez vos kunafas sur la page Menu, puis envoyez votre commande sur WhatsApp.",
    buttonLabel: "Commander sur WhatsApp",
  },
} as const;

/** Lien WhatsApp avec un message personnalisé (ex. liste d'articles sélectionnés). */
export function getWhatsAppUrl(message?: string): string {
  const { whatsappNumber, whatsappMessageDefault } = site.contact;
  const text = message ?? whatsappMessageDefault;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}
