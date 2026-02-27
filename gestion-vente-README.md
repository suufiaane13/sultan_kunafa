# Gestion des ventes (fondateurs)

Page **réservée aux fondateurs** pour enregistrer et suivre les ventes au jour le jour.

## Accès

- **URL** : `https://votre-site.netlify.app/gestion` (ou `http://localhost:5173/gestion` en local)
- La page n’apparaît **ni dans le menu ni dans le footer** du site public. Il faut connaître l’URL ou la mettre en favori.

## Fonctionnalités

1. **Résumé**
   - Total des ventes du **mois en cours** (DH) et nombre de jours enregistrés
   - Total des ventes de la **semaine en cours** (DH) et nombre de jours

2. **Nouvelle vente**
   - Date (par défaut : aujourd’hui)
   - Montant en DH
   - Note optionnelle (ex. « fête », « événement »)

3. **Historique**
   - Liste des ventes enregistrées (du plus récent au plus ancien)
   - Suppression d’une entrée possible (avec confirmation)

## Données

- Les données sont stockées **uniquement dans le navigateur** (localStorage).
- Changer d’appareil ou de navigateur = autre historique.
- Pour une sauvegarde durable ou partagée entre plusieurs personnes, il faudrait plus tard un backend (base de données).

## Sécurité

- Aucun mot de passe pour l’instant. Toute personne qui connaît l’URL peut accéder à la page.
- Pour restreindre l’accès en production, vous pouvez utiliser :
  - **Netlify** : Protection par mot de passe (option payante) ou « Password protection » sur un sous-dossier si vous déplacez la gestion sur un sous-domaine.
