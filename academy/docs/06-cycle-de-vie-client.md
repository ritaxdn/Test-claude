# CRM Cellulift — Cycle de vie client (parc installé, onboarding, formation, suivi)

> Objectif : que le CRM sache, pour chaque client, **quel praticien a quelle machine → s'il a été onboardé → quelles formations il a commencées ou terminées → s'il faut le suivre**.
> Le CRM passe d'un outil de vente à un début de système de cycle de vie client. L'Academy en devient une source de données parmi d'autres (plus tard : SAV, consommables).
> Maquette : [`../crm-maquette/index.html`](../crm-maquette/index.html). SQL : [`../supabase/crm-academy-draft.sql`](../supabase/crm-academy-draft.sql) (brouillon, non appliqué).

## 1. L'unité suivie : une machine × un praticien

Une clinique peut avoir plusieurs machines, et une machine plusieurs praticiens. Le cycle de vie se suit donc par **couple machine installée × praticien**. La fiche client agrège ces couples.

## 2. Les étapes

| # | Étape | Qui la renseigne | Source |
|---|---|---|---|
| 1 | **Vendue** | Commercial | Affaire marquée gagnée avec la machine (nouveau : machine obligatoire) |
| 2 | **Installée** | ADV / technicien | Date d'installation + n° de série (`equipements_clients`) |
| 3 | **Onboardée** | Formateur / application specialist | Formation initiale sur site faite : date, formateur, praticiens présents |
| 4 | **Formation en ligne** : non commencée → en cours (x %) → terminée | Automatique | Academy (progression envoyée au CRM) |
| 5 | **Certifiée** | Automatique | Academy (quiz final réussi, n° de certificat) |
| 6 | **Autonome** | Commercial / formateur | Point à 90 jours fait, praticien utilise la machine seul |

L'étape affichée est la plus avancée atteinte. Un couple peut être « certifié » sans être « autonome ».

## 3. Le signal « suivi requis »

Calculé chaque nuit, et à chaque mise à jour. Chaque règle a un seuil réglable dans **Réglages › Suivi client** (valeurs par défaut ci-dessous).

| Règle | Condition (défaut) | Action proposée | Pour qui |
|---|---|---|---|
| Onboarding à planifier | Installée depuis **7 jours** sans onboarding | Planifier la formation sur site | Formateur |
| Praticien inconnu | Machine installée sans praticien avec e-mail | Compléter le praticien | Commercial |
| Formation non commencée | Onboardé depuis **14 jours**, 0 % en ligne | Relancer le praticien | Commercial |
| Formation à l'arrêt | En cours, sans activité depuis **21 jours** | Appeler, proposer un créneau | Commercial |
| Évaluation échouée | 2 échecs au quiz final | Accompagnement pratique | Formateur |
| Point à 90 jours | Certifié depuis **90 jours**, point non fait | Point d'utilisation / satisfaction | Commercial |

Quand une règle se déclenche, le CRM crée **une tâche** (`activites`, type « suivi client ») pour la bonne personne, sans doublon tant que la précédente est ouverte. Elle apparaît dans l'accueil commercial comme les autres tâches. La tâche se ferme seule si la condition disparaît (ex. le praticien commence la formation).

## 4. Où ça apparaît dans le CRM

1. **Fiche client › bloc « Parc & formation »** : chaque machine, ses praticiens, la frise des étapes, la progression en ligne, le badge « Suivi requis » avec la raison, et les actions (Planifier l'onboarding, Marquer onboardé, Relancer, Voir dans l'Academy).
2. **Nouvelle page « Parc installé »** : toutes les machines installées, avec des filtres prêts à l'emploi (Suivi requis, Onboarding à planifier, Formation non commencée, En formation, Certifiés) et des compteurs.
3. **Accueil commercial** : les tâches de suivi dans la liste habituelle.
4. **Espace superviseur** : par commercial, taux d'onboarding, taux de formation commencée et nombre de suivis en retard, comme les indicateurs déjà présents.

## 5. Données

Ajouts au CRM (détail dans le brouillon SQL) :

- `equipements_clients` : machine installée (compte, produit, n° de série, installée le, onboardée le / par, statut).
- `equipement_praticiens` : praticiens rattachés à une machine (contact, principal oui/non).
- `formations_praticiens` : état de la formation en ligne par praticien et programme (statut, %, dernière activité, échecs, certificat). Écrit **uniquement** par l'Academy via `academy_progression(cle, …)`.
- `v_parc_cycle_vie` : une ligne par machine × praticien avec l'étape, le suivi requis et sa raison. C'est elle que lisent la fiche, la page « Parc installé » et l'espace superviseur.
- `private.generer_suivis()` : crée et ferme les tâches de suivi ; lancée chaque nuit (pg_cron) et après chaque synchronisation Academy.
- `reglages` : clé `suivi_client` avec les seuils.

L'Academy n'envoie que l'état de formation (pas les notes ni les réponses aux quiz) ; le CRM ne donne à l'Academy que machine, praticien, e-mail et clinique.

## 6. Plus tard (même modèle, nouvelles sources)

- **SAV** : tickets ouverts, interventions → règle « machine en panne depuis X jours ».
- **Consommables** : dernière commande → règle « pas de consommables depuis 60 jours » (machine peu utilisée).
- **Opportunités suivantes** : client certifié et actif depuis 6 mois → suggestion d'un deuxième équipement (signal, pas de relance automatique).

## 7. À valider avec Cellulift

1. Qui fait l'onboarding sur site et qui le saisit (formateur interne, commercial, prestataire) ?
2. Les seuils par défaut (7 / 14 / 21 / 90 jours) conviennent-ils ?
3. Qui reçoit les tâches : le commercial du compte pour tout, ou le formateur pour les règles « onboarding » et « évaluation échouée » ?
4. Faut-il créer un rôle « formateur / customer success » dans l'équipe du CRM ?
