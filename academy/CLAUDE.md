# CELLULIFT Academy — règles de travail

## Question centrale

Avant toute fonctionnalité : **est-ce que cela aide Cellulift à mieux acquérir, convertir, onboarder, former, accompagner ou fidéliser ses médecins ?**
Si la réponse est non, la fonctionnalité est probablement secondaire : le dire, et proposer plus simple.

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
- **Règle d'accès : un client (médecin, kiné, centre…) n'a accès qu'aux parcours des machines qu'il a achetées.** Pas de machine achetée, pas d'accès. L'accès se calcule à chaque requête à partir de ses machines actives (`device_ownerships` × `programs.device_model_id`, parcours publié) ; ne jamais ajouter de droit stocké à part ni d'exception sans accord explicite.
- Contenus gratuits et payants (Open Academy) : prévus **plus tard**, Cellulift choisira quels contenus sont gratuits et lesquels sont payants. D'ici là, rien n'est ouvert hors machines achetées. Le jour venu, ce sera une source d'accès supplémentaire explicite (gratuit / acheté), sans affaiblir la règle des parcours machines.
- Paiement (quand les contenus payants arriveront) : selon le pays du client. Maroc → paiement marocain en dirhams (MAD). Hors Maroc → euro ou dollar. Le pays vient du compte du client (pas de l'adresse IP) ; chaque contenu payant a un prix fixé par devise (pas de conversion automatique).
- Palette de l'Academy (choisie par Cellulift, oct. 2026) : fond marine `#021223`, cartes en verre sombre `#0A1727`, boutons neutres `#283555`, bleu électrique `#1F4ED0` / `#1D55E6` avec halo `#0145FD`, texte `#F9FDFF`, texte secondaire `#7F8D9B`, choix actif en blanc. Seul le logo CELLULIFT garde son dégradé arc-en-ciel. Jetons dans `app/src/app/globals.css`.
- Interface en français, vouvoiement.
- Le CRM Cellulift est en production (`public/crm/index.html` + base Supabase) : lecture seule sans accord explicite ; toute migration passe par un brouillon relu (`supabase/crm-academy-draft.sql`).
- Ne jamais présenter une protection simulée comme réelle ; le filigrane dissuade, il n'empêche pas la capture.
