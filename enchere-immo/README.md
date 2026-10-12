# Adjugé — enchères immobilières (prototype HTML)

Prototype d'une plateforme de ventes immobilières aux enchères en ligne au Maroc (prix en dirhams,
biens à Casablanca, Marrakech, Rabat, Tanger, Agadir et Fès). Design en verre dépoli (glassmorphism), police Arial.
Un seul fichier, sans dépendance ni serveur : ouvrez `index.html` dans un navigateur.

## Ce que fait le prototype

- **Catalogue des ventes** : lots en cours, à venir et terminés, filtres (ville, statut, type, prix) et tri.
- **Fiche d'un lot** : description, conditions de vente, « salle de vente » avec compte à rebours en bougie,
  offre actuelle, indicateur « réserve atteinte », historique des offres anonymisé (« Enchérisseur n°3 »).
- **Enchérir** : identification, offre minimum = offre actuelle + pas d'enchère (ou mise à prix pour la première),
  confirmation avec acceptation des conditions et de la consignation (10 % de la mise à prix).
- **Anti-sniping** : une offre dans les 2 dernières minutes prolonge la vente de 2 minutes.
- **Clôture** : « Adjugé » si la meilleure offre atteint le prix de réserve confidentiel, sinon « Non adjugé ».
- **Vendre un bien** : formulaire avec validation (mise à prix, réserve, pas, période de vente).
- **Mes enchères** : suivi des lots où vous avez enchéri (en tête / surenchéri / remporté) et de vos annonces.

## Limites (démo)

- Les autres enchérisseurs sont **simulés** dans la page pour donner vie à la salle.
- Les données sont stockées dans le `localStorage` du navigateur : rien n'est partagé entre utilisateurs.
- Pas de vraie authentification ni de paiement de la consignation.

Pour passer en production il faudra un back-end (API + base de données avec transaction sur chaque offre),
une authentification, du temps réel (WebSocket/SSE) et un prestataire de paiement pour les consignations.
