# Gestion des ventes (fondateurs)

Page **réservée aux fondateurs** pour enregistrer et suivre les ventes au jour le jour.

## Accès

- **URL** : `https://votre-site.netlify.app/gestion` (ou `http://localhost:5173/gestion` en local)
- La page n’apparaît **ni dans le menu ni dans le footer** du site public. Il faut connaître l’URL ou la mettre en favori.
- **Code d’accès** : à l’ouverture de `/gestion`, un formulaire demande un code PIN. Une fois correct, l’accès est mémorisé 24 h (session du navigateur).
  - **Sans configuration** : le code par défaut est `gestion` (à changer en production).
  - **Avec configuration** : créez un fichier `.env` à la racine du projet avec `VITE_GESTION_PIN=votre_code_secret`. En production (ex. Netlify), définissez la variable d’environnement `VITE_GESTION_PIN` dans les paramètres du projet.

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

- **Code PIN côté client** : l’accès à `/gestion` est protégé par un formulaire (code PIN). La vérification se fait dans le navigateur (pas de serveur). Cela évite un accès par curiosité ; quelqu’un qui connaît l’URL et le code peut entrer.
- Pour un verrouillage plus fort (vrai mot de passe, expiration, etc.), il faudrait un backend ou une protection au niveau de l’hébergeur :
  - **Netlify** : « Password protection » (option payante) ou « Protect deploy » sur une branche.
  - **Backend** : authentification côté serveur + session.
