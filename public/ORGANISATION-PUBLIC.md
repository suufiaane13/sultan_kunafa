# Organisation du dossier `public/`

**Option B appliquée** — Dernière mise à jour : voir commits.

---

## État initial (avant rangement)

| Emplacement | Contenu | Remarque |
|-------------|---------|----------|
| **Racine** | ~25 fichiers en vrac | Avatars, hero, logos, produits (flan, tartelette, tiramisu, photo, kunafa), QR, config |
| **photos/** | Photos menu (baklava_*, kunafa_*) | Déjà rangé ; PNG + WebP + variantes 400/800 |

**Incohérence** : une partie des images produits est à la racine (`/flan.png`, `/tartelette.png`, `/tiramisu.png`, `/photo.png`, `/kunafa.png`), l’autre dans `photos/` (référencée en `/photos/xxx.png`).

---

## Option A — Rangement léger (sans changer le code)

Créer des sous-dossiers uniquement pour ce qui n’est **pas** référencé en chemin fixe dans le code, ou pour regrouper visuellement.

| Nouveau dossier | Fichiers à déplacer | Mise à jour code |
|----------------|---------------------|-------------------|
| `public/avatars/` | `avatar-ahmed.*`, `avatar-haroun.*`, `avatar-soufiane.*` (png + webp) | Oui : About.tsx → `/avatars/avatar-ahmed.png` etc. |
| `public/qr/` | `qr-instagram.*`, `qr-menu.*` | Oui : tout lien vers `/qr-instagram.png` → `/qr/qr-instagram.png` + scripts QR |

**Laissés à la racine** (requis par HTML / convention / site.ts) :  
`logo.png`, `logo+.png`, `favicon.svg`, `manifest.webmanifest`, `sw.js`, `_redirects`, `hero.jpeg` / `hero.png` / `hero.webp`, `kunafa.png`, `flan.png`, `tartelette.png`, `tiramisu.png`, `photo.png`, `instagram-logo-gold.svg`, `og-hero.jpg` (si présent).

---

## Option B — Rangement complet (tout cohérent)

Objectif : **toutes les images “contenu” dans des dossiers dédiés**, racine limitée au strict nécessaire (PWA, favicon, manifest, redirects).

### Structure proposée

```
public/
├── avatars/           # Fondateurs (About)
│   ├── avatar-ahmed.png, .webp
│   ├── avatar-haroun.png, .webp
│   └── avatar-soufiane.png, .webp
├── photos/            # Toutes les images produits (menu + fallback)
│   ├── baklava_* (existant)
│   ├── kunafa_* (existant)
│   ├── flan.png, .webp
│   ├── tartelette.png, .webp
│   ├── tiramisu.png, .webp
│   ├── kunafa.png, .webp
│   └── photo.png, .webp   (image par défaut produit)
├── qr/                # Codes QR
│   ├── qr-instagram.png, .webp, .svg
│   └── qr-menu.png, .svg
├── hero/              # Optionnel : bannière hero + og
│   ├── hero.jpeg, .png, .webp
│   └── og-hero.jpg    (ou rester à la racine pour og:image)
├── logo.png, logo+.png, favicon.svg   # Racine (navbar, splash, PWA)
├── kunafa.png         # Garder à la racine si utilisé en background (CTASection)
├── manifest.webmanifest
├── sw.js
├── _redirects
└── instagram-logo-gold.svg
```

### Modifications code à prévoir (option B)

| Fichier | Changement |
|---------|------------|
| `src/content/site.ts` | `image: "/flan.png"` → `"/photos/flan.png"` (idem tartelette, tiramisu). Featured + menu. |
| `src/components/MenuCard.tsx` | `DEFAULT_PRODUCT_IMAGE = "/photo.png"` → `"/photos/photo.png"` |
| `src/pages/MenuItemPage.tsx` | Idem `DEFAULT_PRODUCT_IMAGE` |
| `src/pages/About.tsx` | `/avatar-xxx.png` → `/avatars/avatar-xxx.png` (et .webp) |
| `src/components/Hero.tsx` | `/hero.jpeg` → `/hero/hero.jpeg` (ou laisser à la racine) |
| `src/components/CTASection.tsx` | `/kunafa.png` → laisser à la racine ou `/hero/kunafa.png` |
| Scripts | `scripts/generate-qr-instagram.js` : sortie dans `public/qr/` ; `scripts/generate-qr-menu.js` idem si utilisé. |
| `scripts/optimize-images.js` | Aucun changement si les chemins relatifs dans `public` restent les mêmes (photos/, avatars/, qr/). |

---

## Recommandation

- **Option A** : si tu veux seulement **clarifier** (avatars + QR en dossiers) avec peu de changements.
- **Option B** : si tu veux **tout** le contenu rangé de façon durable (un seul endroit pour les images produits = `photos/`, un pour avatars, un pour QR).

Pour **Option B**, il faudra aussi déplacer `flan`, `tartelette`, `tiramisu`, `photo`, `kunafa` dans `photos/` puis lancer à nouveau `npm run optimize-images` (il génère les .webp et variantes selon l’arborescence actuelle).

Indique l’option que tu choisis (A ou B) et on pourra détailler les commandes / patches fichier par fichier.
