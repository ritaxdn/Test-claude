# CELLULIFT Academy — règles de travail

## Question centrale

Avant toute fonctionnalité : **est-ce que cela aide Cellulift à mieux acquérir, convertir, onboarder, former, accompagner ou fidéliser ses médecins ?**
Si la réponse est non, la fonctionnalité est probablement secondaire : le dire, et proposer plus simple.
Pour les *Formations*, la question devient aussi : **est-ce que cela aide à vendre des formations à des professionnels qui ne sont pas encore clients ?**

## Méthode pour toute fonctionnalité LMS

1. Inspecter d'abord l'architecture et le code existants (`app/` pour l'application réelle ; `prototype/`, `crm-maquette/` et `docs/` pour la conception).
2. Comprendre le fonctionnement actuel.
3. Identifier ce qui existe déjà.
4. Éviter les régressions.
5. Proposer l'implémentation minimale cohérente.
6. Implémenter proprement.
7. Vérifier les états chargement / vide / erreur / succès.
8. Vérifier ordinateur et téléphone lorsque c'est pertinent.
9. Vérifier les permissions médecin / admin.
10. Tester le parcours complet après modification : `npm run test:e2e` dans `app/` (à compléter pour chaque nouvelle fonctionnalité).

## Faits à respecter

- Présentateurs des vidéos : **Dr Mohamed Dadoun**, **Meryem Belkhalfi**, **Imane Souali**. Ne pas inventer de formateurs ni de titres : seul celui du Dr Dadoun est connu (« Médecin esthétique & lasériste · Casablanca », source cellulift.ma).
- **Deux espaces, une marque (décision Cellulift, nov. 2026)** : *Formations* (catalogue ouvert aux professionnels éligibles, accès payant ou offert — priorité commerciale : les non-clients) et *Mes technologies* (parcours des équipements, selon les machines du client). Architecture, audit et tests : `docs/07-formations-et-acces.md` (lot 1 codé et testé, non déployé). Parcours commercial (lot 2, codé et testé, non déployé) : `docs/08-lot2-parcours-commercial.md`. Tests : `npm run test:e2e` (MVP, Formations, Sécurité, Commercial).
- **Règle machines (inchangée, à préserver intégralement)** : un parcours *technologie* n'est ouvert qu'aux clients possédant une machine active du bon modèle (`device_ownerships` × `programs.device_model_id`, parcours publié), recalculé à chaque requête. Une machine n'ouvre jamais une formation ; un achat n'ouvre jamais un parcours technologie. Un même compte cumule les deux.
- **Règle formations** : accès seulement via un accès actif (acheté **après paiement vérifié** par un admin, ou offert avec motif), qualification professionnelle **vérifiée par un administrateur habilité** (droit distinct `can_verify_qualifications`, jamais sur soi-même) et profession autorisée pour la formation — contrôlé côté serveur à chaque requête. Tout accès accordé, modifié ou révoqué est tracé (jamais de suppression). Paiement **manuel** pour le MVP ; paiement en ligne plus tard. Aucun autre droit ni exception sans accord explicite.
- Ne jamais présenter comme disponible une fonctionnalité en développement (côté médecin comme dans la communication).
- Paiement (paiement en ligne, plus tard) : selon le pays du client. Maroc → paiement marocain en dirhams (MAD). Hors Maroc → euro ou dollar. Le pays vient du compte du client (pas de l'adresse IP) ; chaque contenu payant a un prix fixé par devise (pas de conversion automatique).
- **Logo officiel CELLULIFT** (fourni par Cellulift, nov. 2026) : vagues de couleur (cyan, violet, magenta, orange, jaune) au-dessus du mot CELLULIFT en capitales noires à empattements, souligné d'une ligne ECG arc-en-ciel. Fichiers : `brand/cellulift-logo-original.png` (source, fond blanc, 225 px), `brand/cellulift-logo.png` (fond transparent) et `brand/cellulift-academy-logo.png` (avec « ACADEMY » dessous). Utiliser ce logo, ne pas le redessiner ; le wordmark seul en dégradé (site, signature e-mail) n'est pas le logo. Demander une version haute définition ou vectorielle avant tout usage en grand format.
- Palette : on garde la direction claire « Nacre & verre » de cellulift.ma (fond nacré, verre clair, signal arc-en-ciel). Une palette bleu nuit a été essayée puis écartée par Cellulift (oct. 2026) : ne pas y revenir sans demande.
- Nom de la plateforme en ligne : **LIFT by CELLULIFT Academy** (« LIFT » en court), une seule marque, sans sous-marque. Communication : promesse centrée sur la valeur de l'expertise et la qualité des parcours ; ne pas écrire « inclus avec la machine » ; ne pas laisser croire que LIFT est réservé aux clients. Ne pas le confondre avec la page Academy du site (masterclasses et formations en présentiel).
- Interface en français, vouvoiement.
- Le CRM Cellulift est en production (`public/crm/index.html` + base Supabase) : lecture seule sans accord explicite ; toute migration passe par un brouillon relu (`supabase/crm-academy-draft.sql`).
- Ne jamais présenter une protection simulée comme réelle ; le filigrane dissuade, il n'empêche pas la capture.
