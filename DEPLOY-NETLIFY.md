# Déployer Sultan Kunafa sur Netlify (GitHub → déploiement auto)

À chaque **push** sur GitHub, Netlify rebuild et redéploie le site. Aucune commande manuelle à lancer après le push.

---

## 1. Prérequis

- Projet déjà poussé sur **GitHub** (repo `sultan-kunafa` ou autre).
- Compte **Netlify** : [netlify.com](https://www.netlify.com) → Sign up / Log in (tu peux te connecter avec GitHub).

---

## 2. Créer le site Netlify et lier GitHub

1. Va sur **[app.netlify.com](https://app.netlify.com)**.
2. Clique sur **« Add new site »** → **« Import an existing project »**.
3. Choisis **« Deploy with GitHub »** (ou GitLab/Bitbucket si tu préfères).
4. Autorise Netlify à accéder à ton GitHub si demandé.
5. **Choisis le dépôt** : `sultan-kunafa` (ou le nom de ton repo).
6. Netlify pré-remplit en général :
   - **Branch to deploy** : `main` (ou `master`).
   - **Build command** : `npm run build` (déjà défini dans `netlify.toml`).
   - **Publish directory** : `dist`.
7. Si tu vois ces champs, laisse-les tels quels (le fichier `netlify.toml` à la racine du projet les prend en charge).
8. Clique sur **« Deploy site »** (ou **« Deploy sultan-kunafa »**).

Netlify va :
- cloner le repo ;
- lancer `npm install` puis `npm run build` ;
- publier le contenu de `dist/`.

---

## 3. Ce qui se passe à chaque push

| Toi | Netlify |
|-----|--------|
| Tu modifies le code en local | — |
| `git add .` puis `git commit -m "..."` | — |
| `git push origin main` | Netlify détecte le push, lance un nouveau build et met à jour le site |

Tu n’as rien à faire côté Netlify : **push = déploiement automatique**.

---

## 4. Config utile dans le projet

Le fichier **`netlify.toml`** à la racine du projet contient déjà :

- **Build command** : `npm run build` (optimisation images + TypeScript + Vite).
- **Publish directory** : `dist`.
- **Redirects SPA** : `/*` → `/index.html` (pour que React Router fonctionne sur toutes les URLs).

Tu peux modifier ce fichier et pousser pour que les prochains déploiements utilisent la nouvelle config.

---

## 5. (Optionnel) Nom de domaine personnalisé

1. Dans Netlify : **Site settings** → **Domain management**.
2. **Add custom domain** ou **Options** sur le sous-domaine `.netlify.app`.
3. Suis les instructions (DNS, vérification). Netlify fournit un HTTPS automatique.

---

## 6. Résumé du flux

```
Local : git push origin main
    ↓
GitHub : repo à jour
    ↓
Netlify (branch main) : build (npm run build) → publish dist/
    ↓
Site en ligne mis à jour
```

Tu peux vérifier les builds dans l’onglet **« Deploys »** de ton site sur Netlify.
