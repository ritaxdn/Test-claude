# 07 — Formations payantes et double accès (proposition, à valider)

> Statut : **proposition d'architecture, rien n'est encore codé.** Branche `claude/lift-formations-acces`, aucun déploiement.
> Décision Cellulift (nov. 2026) : une seule marque, **LIFT by CELLULIFT ACADEMY**, deux espaces :
> **Formations** (ouvertes aux professionnels éligibles, accès payant ou offert) et **Mes technologies**
> (parcours des équipements, selon les machines du client). Paiement **manuel** pour le MVP.

## 1. Conditions fixées par Cellulift

| # | Condition | Où elle est tenue |
|---|---|---|
| 1 | Droits machines actuels préservés intégralement | Règle machines inchangée, même requête ; tests existants rejoués à l'identique |
| 2 | Cumul machines + formations achetées | L'accès est l'**union** des deux règles |
| 3 | Accès payant seulement après paiement vérifié | Contrainte en base : un accès « achat » exige une commande au statut `payée`, validée par un admin |
| 4 | Vérification des qualifications, contrôle côté serveur | Profession + statut de vérification sur le compte, recalculés à chaque requête (pages, vidéo, documents, progression) |
| 5 | Ne rien présenter comme disponible s'il ne l'est pas | Aucun écran « bientôt » côté médecin ; un espace vide n'est pas affiché |
| 6 | Traçabilité des accès accordés, modifiés, révoqués | Historique en base (jamais de suppression) + journal `audit_log` écrit par déclencheur, avec l'auteur |

## 2. Règle d'accès proposée

Aujourd'hui (inchangé) : parcours publié **et** rattaché à une machine **et** le client possède une machine active de ce modèle.

Demain, un parcours est ouvert si :

```
publié ET (
  [Mes technologies]  type = 'technologie' ET machine active du bon modèle          ← règle actuelle, telle quelle
  OU
  [Formations]        type = 'formation'
                      ET accès actif (non révoqué, non expiré) pour ce parcours
                      ET qualification du compte = 'vérifiée'
                      ET profession du compte ∈ professions autorisées du parcours
)
```

- Les deux branches sont **étanches** : une machine n'ouvre jamais une formation, un achat n'ouvre jamais un parcours technologie.
- Tout est recalculé à chaque requête, comme aujourd'hui : révoquer un accès, invalider une qualification ou retirer une machine coupe l'accès immédiatement.
- Une seule fonction serveur porte la règle (`src/lib/access.ts`) ; toutes les routes l'utilisent déjà (tableau de bord, parcours, leçon, vidéo signée, documents, progression).

## 3. Modèle de données (ajouts uniquement)

### `programs` (colonnes ajoutées)
| Colonne | Type | Règle |
|---|---|---|
| `kind` | `technology` \| `training` | défaut `technology` ; **technologie ⇒ machine obligatoire**, **formation ⇒ aucune machine** (contrainte `check`) |
| `eligible_professions` | liste de codes | obligatoire et non vide pour une formation |

### `users` (colonnes ajoutées)
| Colonne | Rôle |
|---|---|
| `profession` | code de profession (liste fermée, à valider par Cellulift — voir §7) |
| `professional_id` | n° d'inscription à l'Ordre ou équivalent (texte libre, contrôlé par un humain) |
| `country` | code pays (MA, FR…) — servira à la devise, déjà prévu dans les règles |
| `qualification_status` | `none` \| `pending` \| `verified` \| `rejected` |
| `qualification_checked_by`, `qualification_checked_at`, `qualification_note` | qui a vérifié, quand, sur quelle pièce |

### `orders` (nouvelle) — paiement manuel
`id, user_id, program_id, currency (MAD|EUR|USD), amount, method (virement|chèque|espèces|autre), reference, status (pending|paid|cancelled|refunded), created_by, created_at, paid_checked_by, paid_checked_at, note`

### `access_grants` (nouvelle) — accès aux formations
`id, user_id, program_id, source (purchase|offered), order_id, reason, granted_by, granted_at, expires_at, revoked_at, revoked_by, revoke_reason`

Contraintes en base (et pas seulement dans l'application) :
- `source = purchase` ⇒ `order_id` obligatoire, commande **payée**, même utilisateur et même parcours (déclencheur) ;
- `source = offered` ⇒ `reason` obligatoire ;
- le parcours doit être de type `training` ;
- un seul accès actif par (utilisateur, parcours) ;
- passer une commande à `refunded` ou `cancelled` révoque automatiquement l'accès « achat » lié (déclencheur, journalisé).

### Traçabilité
- Rien n'est supprimé : une révocation est une mise à jour datée, signée et motivée.
- Déclencheurs sur `access_grants`, `orders` et les colonnes de qualification de `users` : chaque création ou modification écrit une ligne dans `audit_log` (avant / après), avec l'auteur transmis par l'application (`set local app.actor_id`). Un oubli dans le code ne peut donc pas créer d'accès non tracé.

### Ce qui ne change pas
`device_models`, `device_ownerships`, `modules`, `lessons`, `documents`, `lesson_progress`, sessions et authentification. La table `entitlements` (jamais utilisée) reste en place, sans usage, pour ne pas mélanger les deux logiques ; suppression possible plus tard.

## 4. Migration

- Un fichier `db/migrations/002_formations.sql`, **idempotent et uniquement additif** (`add column if not exists`, `create table if not exists`).
- Parcours existants : tous passent à `kind = 'technology'` (valeur par défaut). Avant d'ajouter la contrainte « technologie ⇒ machine », la migration vérifie qu'aucun parcours publié n'est sans machine. Ceux qui sont sans machine ne sont de toute façon visibles par personne aujourd'hui ; ils resteraient en brouillon.
- Comptes existants : `qualification_status = 'none'`. Aucun impact, puisque la qualification ne sert qu'aux formations.
- Droits du compte `academy_app` et politiques RLS ajoutés pour les deux nouvelles tables (`app-role.sql`).
- **Retour arrière** : supprimer les deux tables et les colonnes ajoutées. La règle machines n'en dépend pas.
- **Ordre d'application** : base locale de test → base de démonstration → projet Supabase `cellulift-academy`, par un SQL relu, avec sauvegarde préalable si de vrais comptes existent. Le CRM n'est pas concerné (lecture seule).

## 5. Écrans

### Côté professionnel
- Le tableau de bord affiche deux sections, chacune **seulement si elle n'est pas vide** : « Formations » et « Mes technologies ». Un client sans formation voit exactement l'écran actuel.
- Pas de catalogue public, pas de bouton « acheter », pas de paiement en ligne dans ce lot. L'achat se fait hors ligne (virement, facture), puis Cellulift ouvre l'accès.
- Les comptes restent créés sur invitation par Cellulift (pas d'inscription libre dans ce lot).

### Côté Cellulift (admin)
- **Fiche professionnel** : bloc *Qualification* (profession, n°, statut, vérifier ou refuser avec note) ; bloc *Formations* (créer une commande, la marquer payée avec référence, l'annuler ou la rembourser ; offrir un accès avec motif ; révoquer avec motif) ; historique lisible des accès.
- **Fiche parcours** : type (technologie / formation) ; machine (technologie seulement) ; professions autorisées (formation seulement).
- Toutes les actions sont réservées au rôle admin et vérifiées côté serveur.

## 6. Risques pour le MVP existant

| Risque | Gravité | Parade |
|---|---|---|
| Régression sur l'accès machines (la fonction centrale change) | Haute | La branche machines reste la requête actuelle, mot pour mot ; les 32 étapes e2e existantes doivent passer sans modification ; tests dédiés au cumul et à l'étanchéité |
| Accès payant ouvert sans paiement | Haute | Contrainte en base (déclencheur), pas seulement un contrôle dans l'écran |
| Professionnel non qualifié qui accède à un contenu médical | Haute | Qualification + profession vérifiées à chaque requête, y compris pour la vidéo signée, les documents et la progression |
| Formation rattachée par erreur à une machine (ou l'inverse) | Moyenne | Contraintes `check` sur `programs` |
| Compte admin compromis = accès distribués | Moyenne | Journal complet ; plus tard, double validation pour les accès offerts |
| Migration sur la base Supabase réelle | Moyenne | SQL additif et idempotent, sauvegarde, application relue |
| Invalidation d'une qualification qui coupe un parcours en cours | Faible (voulu) | Message clair côté admin avant validation |

## 7. Décisions à prendre par Cellulift (bloquantes pour l'écran admin, pas pour la base)

1. **Liste des professions** et leurs codes (proposition : médecin esthétique, dermatologue, gynécologue, chirurgien plasticien, autre chirurgien, médecin généraliste, kinésithérapeute, autre profession de santé, centre / institut — ce dernier probablement exclu des formations médicales).
2. **Pièce justificative** acceptée pour vérifier une qualification (n° d'Ordre, carte professionnelle…) et qui vérifie.
3. **Durée d'accès** d'une formation achetée : illimitée ou limitée (12 mois ?). Le champ `expires_at` permet les deux.
4. **Remboursement** : un remboursement coupe-t-il l'accès ? Proposition : oui, automatiquement.

## 8. Plan de tests

Toutes les étapes sont ajoutées à `npm run test:e2e`, qui doit passer en entier avant chaque fusion.

| # | Scénario | Attendu |
|---|---|---|
| 0 | Les 32 étapes actuelles, sans modification | Toutes passent |
| 1 | Professionnel vérifié + commande payée + accès « achat » | Voit « Formations », lit les leçons dans l'ordre, ouvre les documents |
| 2 | Accès « achat » avec une commande en attente | Refusé **par la base** |
| 3 | Accès actif mais qualification `pending` ou `rejected` | Pas d'accès : page, vidéo, documents et progression répondent tous refusé |
| 4 | Profession non autorisée pour la formation | Pas d'accès |
| 5 | Révocation d'un accès | Perte immédiate ; ligne d'historique avec auteur et motif |
| 6 | Commande remboursée | Accès révoqué automatiquement, journalisé |
| 7 | Client avec machine + formation achetée | Deux sections ; retirer la machine garde la formation ; révoquer la formation garde la technologie |
| 8 | Une machine n'ouvre aucune formation ; un achat n'ouvre aucun parcours technologie | Étanchéité vérifiée |
| 9 | Formation avec machine, technologie sans machine | Refusé par la base |
| 10 | Accès expiré | Pas d'accès |
| 11 | Un professionnel appelle une action admin (offrir, valider un paiement, vérifier une qualification) | Refusé côté serveur |
| 12 | Chaque action admin du parcours | Une ligne `audit_log` par changement, avec l'auteur |

Vérifications complémentaires : typecheck et lint, rendu téléphone et ordinateur des nouveaux écrans, états vide, chargement, erreur et succès.

## 9. Découpage proposé

1. Migration + règle d'accès + tests 0 à 12 (sans écran admin : accès créés en SQL dans les tests).
2. Écrans admin (qualification, commandes, accès, historique) + tableau de bord à deux sections.
3. Plus tard, hors de ce lot : catalogue public, demande d'accès en ligne, paiement en ligne (MAD / EUR / USD), attestation de suivi.
