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
- Interface en français, vouvoiement.
- Le CRM Cellulift est en production (`public/crm/index.html` + base Supabase) : lecture seule sans accord explicite ; toute migration passe par un brouillon relu (`supabase/crm-academy-draft.sql`).
- Ne jamais présenter une protection simulée comme réelle ; le filigrane dissuade, il n'empêche pas la capture.
