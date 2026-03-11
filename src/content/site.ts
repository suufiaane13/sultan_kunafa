/**
 * Contenu & config — PRD simplifié (todo.md).
 * Source unique pour copy et CTA WhatsApp.
 * Images menu : public/photos/{id}.png (ex. baklava_carre_noix.png)
 */

/** Produits mis en avant (affichage d'une étoile). */
export const starredProductIds = ["baklava_carre_noix", "kunafa_a_la_creme", "flan", "tiramisu"] as const;

/** Parfums Tiramisu (ids pour traductions). Ordre : prix min → max (kitkat à côté d’oreo, même prix). */
export const tiramisuFlavorIds = ["classique", "oreo", "kitkat", "raffaello", "ferrero", "lotus", "kinder", "blueberry", "mango"] as const;

/** Tailles Tiramisu. */
export const tiramisuSizeIds = ["P", "G"] as const;

/** Prix Tiramisu par goût (P, G) en DH. */
export const tiramisuPrices: Record<(typeof tiramisuFlavorIds)[number], { P: number; G: number }> = {
  classique: { P: 20, G: 80 },
  oreo: { P: 25, G: 90 },
  kitkat: { P: 25, G: 90 },
  raffaello: { P: 45, G: 135 },
  ferrero: { P: 45, G: 135 },
  lotus: { P: 45, G: 135 },
  kinder: { P: 45, G: 135 },
  blueberry: { P: 55, G: 145 },
  mango: { P: 60, G: 170 },
};

export type TiramisuFlavorId = (typeof tiramisuFlavorIds)[number];
export type TiramisuSizeId = (typeof tiramisuSizeIds)[number];

/** Images des parfums Tiramisu (public/flavors/). */
export const tiramisuFlavorImages: Record<(typeof tiramisuFlavorIds)[number], string> = {
  classique: "/flavors/classique.png",
  oreo: "/flavors/oreo.png",
  kitkat: "/flavors/kitkat.png",
  raffaello: "/flavors/raffaello.png",
  ferrero: "/flavors/ferrero.png",
  lotus: "/flavors/lotus.png",
  kinder: "/flavors/kinder.png",
  blueberry: "/flavors/blueberry.png",
  mango: "/flavors/mango.png",
};

export const site = {
  seo: {
    title: "SWEETŞ | Desserts orientaux premium",
    description: "Découvrez nos kunafas : luxe, tradition et modernité.",
    ogImage: "/hero/hero.jpeg",
  },
  contact: {
    phone: "+212 7 01 73 01 74",
    whatsappNumber: "212701730174", // E.164 sans +
    whatsappMessageDefault: "Bonjour, je souhaite commander chez SWEETŞ.",
    mapEmbedUrl: "https://www.google.com/maps?q=34.655196988561705,-1.8970717785253848&z=16&output=embed",
  },
  hero: {
    title: "SWEETS",
    subtitle: "Kunafa authentique, préparé avec passion et tradition.",
    ctaLabel: "Voir le menu",
    ctaHref: "/menu",
  },
  featured: {
    title: "Nos créations",
    items: [
      { id: "baklava_carre_noix", name: "Baklava carré noix", description: "Baklava carré aux noix.", price: "11 DH", priceAmount: 11, image: "/photos/baklava_carre_noix.png" },
      { id: "kunafa_a_la_creme", name: "Kunafa à la crème", description: "Kunafa généreuse à la crème.", price: "10 DH", priceAmount: 10, image: "/photos/kunafa_a_la_crème.png" },
      { id: "flan", name: "Flan", description: "Flan onctueux, préparé maison.", price: "10 DH", priceAmount: 10, image: "/photos/flan.png" },
      { id: "tiramisu", name: "Tiramisu", description: "Plusieurs goûts au choix.", price: "20 - 170 DH", priceAmount: 0, image: "/photos/tiramisu.png" },
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
    { id: "flan", name: "Flan", description: "Flan", price: "10 DH", priceAmount: 10, image: "/photos/flan.png" },
    { id: "tartelette", name: "Tartelette", description: "Tartelette", price: "8 DH", priceAmount: 8, image: "/photos/tartelette.png" },
    {
      id: "tiramisu",
      name: "Tiramisu",
      description: "Tiramisu aux parfums variés.",
      price: "20 - 170 DH",
      priceAmount: 0,
      image: "/photos/tiramisu.png",
      flavors: [...tiramisuFlavorIds],
      sizes: [...tiramisuSizeIds],
    },
  ],
  about: "SWEETŞ allie tradition orientale et goût moderne pour des desserts inoubliables, inspirés d'un héritage précieux.",
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
