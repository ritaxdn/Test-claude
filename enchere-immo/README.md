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

## Adjugé Live (`live.html`) — ventes en direct

Expérience façon live shopping (Whatnot), reliée au catalogue par le menu. Design « désert » : sable et taupe, verre dépoli doux, accent jaune beurre, pilules anthracite, chiffres en trio, pastilles de visite sur la photo et barre flottante en bas sur mobile. Bilingue **français / arabe** (bouton « ع / FR », affichage de droite à gauche).

- **Fil des lives** : lives en cours, prochains lives avec rappel, filtres par catégorie.
- **Salle de live** : visite « filmée » du bien commentée par l'agent, chat avec réponses de l'hôte,
  enchère éclair de 30 s (toute offre dans les 10 dernières secondes relance le chrono à 10 s),
  **glisser pour enchérir**, offre personnalisée, **enchère automatique** jusqu'à un maximum secret.
- **Dossier du bien** : visite pièce par pièce, plan schématique, documents vérifiés (titre foncier,
  note de renseignement, expertise, charges) et **calculateur coût total + crédit** (droits d'enregistrement 4 %,
  conservation foncière 1,5 % + 200 DH, notaire 1 % + TVA 10 %, mensualité selon apport, durée et taux ; estimation indicative).
- **Vérification d'identité** à la première offre (pseudo, CIN, preuve de fonds facultative, accord de consignation).
- **Mes victoires** : suivi de chaque bien remporté jusqu'aux clés (consignation via CMI, identité, compromis,
  acte chez le notaire à J+30, remise des clés), avec un exemple de démonstration.
- **Studio agent** : créer un live, ajouter ses biens, le lancer puis le piloter en **mode hôte**
  (ouvrir les enchères, +15 s, adjuger, lot suivant, meilleurs enchérisseurs).
- **Notifications** : surenchère, victoire, enchère auto dépassée, rappels, live lancé (option WhatsApp simulée).

### Architecture de confiance (simulée)

- **Offre retenue** : jamais présentée comme une vente conclue. Ses conséquences dépendent des conditions de vente
  du lot. Parcours affiché : Offre retenue → Revue du dossier → Étape contractuelle → Acte de vente →
  Inscription foncière → Transaction finalisée (« Mes offres retenues »).
- **Garantie de participation** configurable par lot (montant, dépositaire, conditions) dans les conditions
  particulières ; certains lots n'en exigent pas. L'appli ne détient aucun fonds.
- **Qualification en trois niveaux** : identité vérifiée, capacité financière vérifiée, garantie constituée si requise.
  Le bouton d'enchère n'est actif que si toutes les conditions du lot sont remplies.
- **Capacité maximale d'enchère** (« Vérifié pour enchérir jusqu'à … ») : impossible d'enchérir au-delà,
  bouton « Augmenter ma capacité d'enchère ».
- **Identifiants anonymisés** pendant les enchères (« Enchérisseur vérifié #1847 ✓ ») et compteur
  d'**enchérisseurs vérifiés** distinct du nombre de spectateurs.
- **Dossier du bien** : onglet « Conditions & intégrité » (conditions particulières, réserve confidentielle,
  intégrité des enchères). Badges « Vendeur vérifié ✓ » et « Documents du bien examinés ✓ ».
- **Comptes vendeurs** : ne peuvent pas enchérir sur leurs propres lots.
- **Studio agent** : Brouillon → Revue du bien → Documents → Vérification vendeur → Conditions de vente →
  Approuvé → Programmation du live (simulation visuelle, aucun contrôle réel).

À valider avant un lancement réel : le cadre juridique des ventes immobilières aux enchères au Maroc
(rôle du notaire, statut de la consignation) avec un notaire ou un avocat, et la conformité à la loi 09-08 (CNDP)
pour les données personnelles (CIN, justificatifs).

### Sécurité (prototype)

CSP stricte par empreinte de script (aucune requête réseau), en-têtes HTTP dans `vercel.json`
(anti-clickjacking, HSTS, nosniff, Referrer-Policy, Permissions-Policy), revalidation de toutes les données
relues depuis le navigateur, anti-spam du chat et bouton « Supprimer mes données de ce navigateur ».
Détails, limites et exigences serveur du vrai produit : [SECURITY.md](SECURITY.md).

## Limites (démo)

- Les autres enchérisseurs sont **simulés** dans la page pour donner vie à la salle ; en live, la vidéo,
  les spectateurs et le chat le sont aussi.
- Les données sont stockées dans le `localStorage` du navigateur : rien n'est partagé entre utilisateurs.
- Pas de vraie authentification, vérification d'identité ni paiement de la consignation (CMI simulé).

Pour passer en production il faudra un back-end (API + base de données avec transaction sur chaque offre),
une authentification, du temps réel (WebSocket/SSE), de la vidéo en direct (WebRTC/HLS) et un prestataire de paiement pour les consignations.
