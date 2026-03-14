# Architecture et composants réutilisables — Sultan Kunafa

Proposition pour une structure claire, des composants réutilisables et un code maintenable.

---

## 1. Structure des dossiers proposée

```
src/
├── app/                    # Point d’entrée et layout global
│   ├── App.tsx
│   └── main.tsx
├── components/
│   ├── layout/             # Structure de la page (header, footer, shell)
│   │   ├── Navbar.tsx
│   │   ├── NavDrawer.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── ui/                 # Composants UI réutilisables (sans logique métier)
│   │   ├── Button.tsx      # Bouton primaire / secondaire / ghost
│   │   ├── Card.tsx        # Carte avec bordure or, ombre, hover
│   │   ├── EmptyState.tsx  # Icône + message + CTA (panier, favoris, menu)
│   │   ├── IconButton.tsx  # Bouton icône (favori, fermer, etc.)
│   │   ├── Toast.tsx
│   │   ├── RouteSkeleton.tsx
│   │   └── index.ts
│   ├── shared/             # Composants partagés (icônes, images)
│   │   ├── WhatsAppIcon.tsx
│   │   ├── ProductImage.tsx # picture + WebP + sizes (extraire de MenuCard)
│   │   └── index.ts
│   └── features/           # Composants métier (assemblent layout + ui + shared)
│       ├── menu/
│       │   ├── MenuCard.tsx
│       │   ├── MenuFilters.tsx  # (optionnel) extraire filtres + vues du Menu
│       │   └── index.ts
│       ├── cart/
│       │   ├── CartDrawer.tsx
│       │   └── index.ts
│       ├── hero/
│       │   ├── Hero.tsx
│       │   └── index.ts
│       ├── cta/
│       │   ├── CTASection.tsx
│       │   └── index.ts
│       ├── about/
│       │   ├── AboutSection.tsx
│       │   ├── AnimatedAvatar.tsx
│       │   └── index.ts
│       ├── pwa/
│       │   ├── PWAInstallBanner.tsx
│       │   └── index.ts
│       └── floating/
│           ├── FloatingSocial.tsx
│           └── index.ts
├── pages/                  # Pages = assemblage de layout + features
│   ├── Home.tsx
│   ├── Menu.tsx
│   ├── MenuItemPage.tsx
│   ├── Favorites.tsx
│   ├── About.tsx
│   └── NotFound.tsx
├── context/
├── content/
├── hooks/
├── lib/                    # Utilitaires purs (optionnel)
│   ├── imageUtils.ts       # imageBase, webpUrl, webpSrcSet (extraire de MenuCard)
│   └── storage.ts          # helpers localStorage si besoin
├── types/                  # Types partagés (optionnel)
│   ├── product.ts          # MenuItem, ProductImageProps, etc.
│   └── index.ts
└── gestion-vente/           # Module isolé (inchangé)
```

---

## 2. Règles d’organisation

| Dossier        | Rôle | Exemple |
|----------------|------|--------|
| **layout/**    | Structure globale : navbar, footer, drawer. Peu de logique métier. | Navbar, Footer |
| **ui/**        | Composants génériques, réutilisables partout. Props simples (children, variant, onClick). | Button, Card, EmptyState, Toast |
| **shared/**    | Éléments réutilisés (icônes, image produit avec WebP). | WhatsAppIcon, ProductImage |
| **features/**  | Composants métier : combinent ui + shared + context. Un sous-dossier par domaine. | MenuCard, CartDrawer, Hero |
| **pages/**     | Une page = composition de layout + composants features. Pages fines, peu de JSX complexe. | Menu, Favorites |

---

## 3. Composants UI réutilisables à introduire

### 3.1 `Button` (variants)

Un seul composant avec des variants pour éviter de répéter les mêmes classes.

```tsx
// components/ui/Button.tsx
type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}
```

- **primary** : fond or, texte dark (CTA principal).
- **secondary** : bordure or, fond gold/10 (Voir le menu, Réinitialiser).
- **ghost** : transparent, hover gold/10 (Plus tard, liens secondaires).
- **gold** : comme primary, pour cohérence visuelle.

Utilisation : panier vide, favoris vides, menu aucun résultat, PWA banner, etc.

### 3.2 `Card`

Wrapper pour toutes les cartes (produit, fondateur, article panier) : bordure, ombre, rounded, hover.

```tsx
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "div";
  hover?: boolean;  // whileHover y -4 pour Framer
}
```

MenuCard, CartDrawer items, About fondateurs peuvent s’appuyer sur ce base.

### 3.3 `EmptyState`

Un seul composant pour les trois cas (panier, favoris, menu sans résultats).

```tsx
// components/ui/EmptyState.tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}
```

Évite la duplication entre CartDrawer, Favorites et Menu.

### 3.4 `IconButton`

Boutons icône (fermer, favori, quantité +/-) : taille, aria-label, focus ring.

```tsx
// components/ui/IconButton.tsx
interface IconButtonProps {
  icon: React.ReactNode;
  "aria-label": string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "ghost";
  size?: "sm" | "md";
}
```

---

## 4. Shared : `ProductImage`

Extraire la logique image (WebP, srcset, sizes) de MenuCard dans un composant réutilisable.

```tsx
// components/shared/ProductImage.tsx
interface ProductImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

- Utilisé dans MenuCard et MenuItemPage.
- Les helpers `imageBase`, `webpUrl`, `webpSrcSet` vont dans `lib/imageUtils.ts` et sont utilisés par ProductImage (et éventuellement d’autres composants).

---

## 5. Types partagés

- **`types/product.ts`** : `MenuItem` (déjà exporté par MenuCard), types pour prix, variantes tiramisu si besoin.
- Les pages et features importent depuis `@/types` au lieu de dépendre de MenuCard pour les types.

---

## 6. Imports : barrels (`index.ts`)

Chaque sous-dossier de `components` peut exporter tout depuis un `index.ts` pour des imports courts.

```ts
// components/ui/index.ts
export { Button } from "./Button";
export { Card } from "./Card";
export { EmptyState } from "./EmptyState";
export { IconButton } from "./IconButton";
export { Toast } from "./Toast";
export { RouteSkeleton } from "./RouteSkeleton";
```

Utilisation : `import { Button, EmptyState } from "@/components/ui"`.

---

## 7. Conventions de nommage

| Élément | Convention | Exemple |
|--------|------------|--------|
| Fichiers composants | PascalCase | `MenuCard.tsx`, `EmptyState.tsx` |
| Dossiers | kebab-case ou camelCase | `menu/`, `MenuCard/` (au choix, rester cohérent) |
| Composants | PascalCase | `MenuCard`, `EmptyState` |
| Props | camelCase | `linkToDetail`, `priceAmount` |
| Fichiers utilitaires | camelCase | `imageUtils.ts`, `storage.ts` |
| Types / interfaces | PascalCase | `MenuItem`, `ButtonVariant` |

---

## 8. Plan de mise en œuvre (par étapes)

1. **Sans déplacer les fichiers** (impact minimal)  
   - Créer `lib/imageUtils.ts` et y déplacer `imageBase`, `webpUrl`, `webpSrcSet`.  
   - Créer `EmptyState` et l’utiliser dans CartDrawer, Favorites et Menu (état vide).  
   - Créer `Button` avec variants et remplacer les boutons répétitifs (panier vide, favoris, menu, PWA).

2. **Réorganiser les composants** (migration progressive)  
   - Créer `components/layout/`, `components/ui/`, `components/shared/`, `components/features/`.  
   - Déplacer les fichiers (Navbar, Footer → layout ; Toast, RouteSkeleton → ui ; WhatsAppIcon, ProductImage → shared ; MenuCard, CartDrawer, Hero, etc. → features).  
   - Mettre à jour les imports (alias `@/components/...` ou barrels `@/components/ui`).

3. **Extraire plus de réutilisabilité**  
   - Introduire `Card` et faire utiliser par MenuCard et About.  
   - Introduire `IconButton` pour les cœurs, fermer, +/-.  
   - Introduire `ProductImage` et l’utiliser dans MenuCard et MenuItemPage.

4. **Types**  
   - Créer `types/product.ts` (et éventuellement `types/index.ts`), y déplacer `MenuItem` et autres types liés aux produits.

---

## 9. Résumé des bénéfices

- **Architecture lisible** : layout / ui / shared / features / pages, chacun avec un rôle clair.  
- **Composants réutilisables** : Button, Card, EmptyState, IconButton, ProductImage utilisables partout.  
- **Moins de duplication** : états vides, boutons, images produits centralisés.  
- **Maintenabilité** : modifications (style, accessibilité) dans un seul endroit.  
- **Évolutivité** : nouvelles pages ou features en réutilisant layout + ui + shared.

Tu peux appliquer d’abord l’étape 1 (EmptyState + Button + imageUtils) sans toucher à la structure des dossiers, puis migrer progressivement vers la structure proposée.
