/**
 * Traductions FR / AR — clés utilisées avec t() dans l'app.
 */

export type Locale = "fr" | "ar";

const translations = {
  fr: {
    picker: {
      title: "Choisissez votre langue",
      fr: "Français",
      ar: "العربية",
    },
    nav: {
      menu: "Menu",
      about: "Notre histoire",
    },
    navDrawer: {
      title: "Navigation",
      close: "Fermer",
    },
    hero: {
      title: "SULTAN KUNAFA",
      subtitle: "L'art de la kunafa élevé au rang d'excellence.",
      ctaLabel: "Découvrir le menu",
    },
    featured: {
      title: "Nos signatures",
      seeMore: "Voir plus",
    },
    menuPage: {
      title: "Menu",
      subtitle: "Composez votre sélection et passez commande via WhatsApp",
      addToCart: "Ajouter au panier",
    },
    aboutPage: {
      title: "Notre histoire",
      subtitle: "L'excellence au cœur de chaque création",
      heading: "SULTAN KUNAFA",
      foundersTitle: "Les fondateurs",
      foundersIntro: "SULTAN KUNAFA est née de la rencontre de deux passionnés, déterminés à réinventer la pâtisserie orientale avec exigence et authenticité.",
      founder1Name: "Ahmed BERKOUKI",
      founder1Role: "Co-fondateur",
      founder2Name: "Haroun SOULIMANI",
      founder2Role: "Co-fondateur",
      founder3Name: "Soufiane HAJJI",
      founder3Role: "Développeur web",
      locationTitle: "Où nous trouver",
      openInMaps: "Ouvrir dans Google Maps",
    },
    about: {
      text: "Chaque pièce Sultan est façonnée selon un savoir-faire ancestral, revisité avec une précision moderne pour offrir une expérience gustative hors du commun.",
    },
    cta: {
      title: "Prêt à savourer ?",
      subtitle: "Composez votre commande depuis la page Menu et finalisez-la en quelques secondes via WhatsApp.",
      buttonLabel: "Commander sur WhatsApp",
    },
    contact: {
      whatsappMessageDefault: "Bonjour, je souhaite passer commande chez Sultan Kunafa.",
      orderIntro: "Voici ma commande :",
      totalLabel: "Total",
    },
    cart: {
      title: "Mon panier",
      close: "Fermer le panier",
      empty: "Votre panier est vide.",
      addedToCart: "Ajouté au panier",
      decrease: "Diminuer",
      increase: "Augmenter",
      remove: "Retirer",
      total: "Total",
      checkout: "Commander sur WhatsApp",
    },
    footer: {
      copyright: "Tous droits réservés.",
    },
    notFound: {
      title: "Page introuvable",
      message: "Cette page n'existe pas ou a été déplacée.",
      backHome: "Retour à l'accueil",
    },
    gestionVente: {
      title: "Gestion des ventes",
      back: "Retour",
      lastSale: "Dernière vente",
      caMonth: "CA du mois",
      salesThisMonth: "Ventes ce mois",
      newSale: "Nouvelle vente",
      close: "Fermer",
      day: "Jour",
      month: "Mois",
      year: "Année",
      amountDh: "Montant (DH)",
      amountPlaceholder: "0,00",
      noteOptional: "Note (optionnel)",
      notePlaceholder: "Ex. événement, type de vente...",
      typeLabel: "Type",
      typeKunafa: "Kunafa",
      typeFlan: "Flan et autre",
      cancel: "Annuler",
      save: "Enregistrer",
      history: "Historique",
      viewModeCards: "Cartes",
      viewModeTable: "Tableau",
      filterBy: "Filtrer par",
      dateLabel: "Date :",
      datePlaceholder: "JJ/MM/AAAA",
      dateAria: "Filtrer par date (JJ/MM/AAAA)",
      period: "Période :",
      filterAria: "Filtrer l'historique",
      allMonths: "Tous les mois",
      currentMonth: "Mois en cours",
      currentWeek: "Semaine en cours",
      exportExcel: "Export Excel téléchargé",
      exportPdf: "Export PDF téléchargé",
      exportError: "Export impossible. Lancez « npm install ».",
      excelTitle: "Exporter en Excel",
      pdfTitle: "Exporter en PDF",
      importTitle: "Importer",
      importToastResult: "X importées, Y ignorées",
      importError: "Fichier Excel invalide (format FR attendu).",
      emptyTitle: "Aucune vente pour le moment",
      emptyHint: "Cliquez sur Nouvelle vente pour enregistrer votre première entrée.",
      deleteAria: "Supprimer",
      seeMore: "Voir plus",
      restanteOne: "restante",
      restantes: "restantes",
      deleteConfirmTitle: "Supprimer cette vente ?",
      deleteConfirmMessage: "Cette action est irréversible.",
      delete: "Supprimer",
      toastSaved: "Vente enregistrée",
      toastDeleted: "Vente supprimée",
      today: "Aujourd'hui",
      yesterday: "Hier",
      daysAgo: "Il y a X j",
      dateShort: "Date",
      allTypes: "Tous les types",
      exportEmpty: "Aucune vente",
      exportNote: "Note",
      exportHistoryTitle: "Historique des ventes",
      exportGeneratedOn: "Généré le",
    },
    currency: "DH",
    products: {
      baklava_carre_noix: {
        name: "Baklava carré noix",
        description: "Baklava carré aux noix, pâtisserie orientale traditionnelle.",
        descriptionShort: "Carré aux noix",
      },
      baklava_losange_noix: {
        name: "Baklava losange noix",
        description: "Baklava en losange aux noix.",
        descriptionShort: "Losange aux noix",
      },
      baklava_roule: {
        name: "Baklava roulé",
        description: "Baklava roulé, feuilleté et noix.",
        descriptionShort: "Baklava roulé",
      },
      kunafa_a_la_creme: {
        name: "Kunafa à la crème",
        description: "Kunafa généreuse à la crème.",
        descriptionShort: "À la crème",
      },
      kunafa_fruits_secs_mix: {
        name: "Kunafa fruits secs mix",
        description: "Kunafa aux fruits secs variés.",
        descriptionShort: "Fruits secs mix",
      },
      kunafa_mini_nid_amandes: {
        name: "Kunafa mini nid amandes",
        description: "Mini nid aux amandes, portion individuelle.",
        descriptionShort: "Mini nid amandes",
      },
      kunafa_roll_nid_mix: {
        name: "Kunafa nid mix",
        description: "Roulé nid mix.",
        descriptionShort: "Roll nid mix",
      },
      kunafa_nutella: {
        name: "Kunafa Nutella",
        description: "Kunafa au Nutella.",
        descriptionShort: "Nutella",
      },
    },
  },
  ar: {
    picker: {
      title: "اختر لغتك",
      fr: "Français",
      ar: "العربية",
    },
    nav: {
      menu: "القائمة",
      about: "قصّتنا",
    },
    navDrawer: {
      title: "التنقل",
      close: "إغلاق",
    },
    hero: {
      title: "كنافة الملوك",
      subtitle: "فن الكنافة في أرقى تجلّياته.",
      ctaLabel: "اكتشف القائمة",
    },
    featured: {
      title: "إبداعاتنا المميّزة",
      seeMore: "عرض المزيد",
    },
    menuPage: {
      title: "القائمة",
      subtitle: "اختر طلبك بعناية وأرسله إلينا عبر واتساب",
      addToCart: "أضف إلى السلة",
    },
    aboutPage: {
      title: "قصّتنا",
      subtitle: "التميّز في صميم كل تجربة",
      heading: "كنافة الملوك",
      foundersTitle: "المؤسسان",
      foundersIntro: "وُلدت كنافة الملوك من لقاء شغوفَين، عازمَين على إعادة اختراع الحلوى الشرقية بمعايير الإتقان والأصالة.",
      founder1Name: "أحمد برقوقي",
      founder1Role: "المؤسس",
      founder2Name: "هارون سليماني",
      founder2Role: "المؤسس",
      founder3Name: "سفيان حجي",
      founder3Role: "المطوّر",
      locationTitle: "الموقع",
      openInMaps: "فتح في خريطة Google",
    },
    about: {
      text: "كل قطعة سلطان تُصنع وفق حرفة موروثة، صُقِلت بدقّة عصرية لتقديم تجربة ذوق استثنائية لا تُنسى.",
    },
    cta: {
      title: "هل أنت مستعد للتذوّق؟",
      subtitle: "اختر طلبك من صفحة القائمة وأتمّه في ثوانٍ عبر واتساب.",
      buttonLabel: "الطلب عبر واتساب",
    },
    contact: {
      whatsappMessageDefault: "مرحباً، أودّ تقديم طلب لدى سلطان كنافة.",
      orderIntro: "إليك طلبي:",
      totalLabel: "المجموع",
    },
    cart: {
      title: "سلّتي",
      close: "إغلاق السلة",
      empty: "سلّتك فارغة.",
      addedToCart: "أُضيف إلى السلة",
      decrease: "تقليل",
      increase: "زيادة",
      remove: "إزالة",
      total: "المجموع",
      checkout: "الطلب عبر واتساب",
    },
    footer: {
      copyright: "جميع الحقوق محفوظة.",
    },
    notFound: {
      title: "الصفحة غير موجودة",
      message: "هذه الصفحة غير موجودة أو تم نقلها.",
      backHome: "العودة إلى الرئيسية",
    },
    gestionVente: {
      title: "إدارة المبيعات",
      back: "رجوع",
      lastSale: "آخر عملية بيع",
      caMonth: "مبيعات الشهر",
      salesThisMonth: "عمليات البيع هذا الشهر",
      newSale: "بيع جديد",
      close: "إغلاق",
      day: "اليوم",
      month: "الشهر",
      year: "السنة",
      amountDh: "المبلغ (درهم)",
      amountPlaceholder: "0,00",
      noteOptional: "ملاحظة (اختياري)",
      notePlaceholder: "مثال: مناسبة، نوع البيع...",
      typeLabel: "النوع",
      typeKunafa: "كنافة",
      typeFlan: "فلان وغيرها",
      cancel: "إلغاء",
      save: "حفظ",
      history: "السجل",
      viewModeCards: "بطاقات",
      viewModeTable: "جدول",
      filterBy: "تصفية حسب",
      dateLabel: "التاريخ :",
      datePlaceholder: "JJ/MM/AAAA",
      dateAria: "تصفية حسب التاريخ (يوم/شهر/سنة)",
      period: "الفترة :",
      filterAria: "تصفية السجل",
      allMonths: "كل الأشهر",
      currentMonth: "الشهر الحالي",
      currentWeek: "الأسبوع الحالي",
      exportExcel: "تم تنزيل ملف Excel",
      exportPdf: "تم تنزيل ملف PDF",
      exportError: "التصدير غير ممكن. شغّل « npm install ».",
      excelTitle: "تصدير إلى Excel",
      pdfTitle: "تصدير إلى PDF",
      importTitle: "استيراد",
      importToastResult: "X مستوردة، Y متجاهلة",
      importError: "ملف Excel غير صالح (المطلوب هو التنسيق الفرنسي).",
      emptyTitle: "لا توجد مبيعات حتى الآن",
      emptyHint: "اضغط على بيع جديد لتسجيل أول عملية.",
      deleteAria: "حذف",
      seeMore: "عرض المزيد",
      restanteOne: "متبقية",
      restantes: "متبقيات",
      deleteConfirmTitle: "حذف هذه العملية؟",
      deleteConfirmMessage: "هذا الإجراء نهائي.",
      delete: "حذف",
      toastSaved: "تم تسجيل العملية",
      toastDeleted: "تم حذف العملية",
      today: "اليوم",
      yesterday: "أمس",
      daysAgo: "منذ X يوم",
      dateShort: "التاريخ",
      allTypes: "كل الأنواع",
      exportEmpty: "لا توجد مبيعات",
      exportNote: "ملاحظة",
      exportHistoryTitle: "سجل المبيعات",
      exportGeneratedOn: "تم الإنشاء في",
    },
    currency: "درهم",
    products: {
      baklava_carre_noix: {
        name: "بقلاوة مربعة بالجوز",
        description: "بقلاوة مربعة بالجوز، حلويات شرقية تقليدية.",
        descriptionShort: "مربعة بالجوز",
      },
      baklava_losange_noix: {
        name: "بقلاوة معيّن باللوز",
        description: "بقلاوة على شكل معيّن باللوز.",
        descriptionShort: "معيّن باللوز",
      },
      baklava_roule: {
        name: "بقلاوة ملفوفة",
        description: "بقلاوة ملفوفة، فطيرة وجوز.",
        descriptionShort: "بقلاوة ملفوفة",
      },
      kunafa_a_la_creme: {
        name: "كنافة بالكريمة",
        description: "كنافة غنية بالكريمة.",
        descriptionShort: "بالكريمة",
      },
      kunafa_fruits_secs_mix: {
        name: "كنافة فواكه جافة ميكس",
        description: "كنافة بمزيج فواكه جافة.",
        descriptionShort: "فواكه جافة ميكس",
      },
      kunafa_mini_nid_amandes: {
        name: "كنافة ميني عش لوز",
        description: "عش صغير باللوز، حصة فردية.",
        descriptionShort: "ميني عش لوز",
      },
      kunafa_roll_nid_mix: {
        name: "كنافة عش البلبل",
        description: "رول عش ميكس.",
        descriptionShort: "كنافة عش البلبل",
      },
      kunafa_nutella: {
        name: "كنافة نوتيلا",
        description: "كنافة بنوتيلا.",
        descriptionShort: "نوتيلا",
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function t(locale: Locale, key: string): string {
  const value = getNested(translations[locale] as Record<string, unknown>, key);
  return value ?? getNested(translations.fr as Record<string, unknown>, key) ?? key;
}

export { translations };

/** Lignes de commande (nom, quantité, prix) pour le message WhatsApp. */
export interface OrderLine {
  name: string;
  quantity: number;
  priceDisplay: string;
  priceAmount: number;
}

/** Construit le message de commande WhatsApp dans la langue choisie. */
export function buildOrderMessage(locale: Locale, lines: OrderLine[]): string {
  const base = t(locale, "contact.whatsappMessageDefault");
  const filtered = lines.filter((l) => l.quantity > 0);
  if (filtered.length === 0) return base;
  const intro = t(locale, "contact.orderIntro");
  const totalLabel = t(locale, "contact.totalLabel");
  const currency = t(locale, "currency");
  const list = filtered
    .map((l) => `• ${l.quantity} x ${l.name} : ${l.priceAmount * l.quantity} ${currency}`)
    .join("\n");
  const total = filtered.reduce((sum, l) => sum + l.priceAmount * l.quantity, 0);
  return [
    base,
    "",
    intro,
    list,
    "",
    "—————————————",
    `${totalLabel} : ${total} ${currency}`,
  ].join("\n");
}