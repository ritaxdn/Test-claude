# 07 — Formations payantes et double accès (proposition, à valider)

> Statut : **lot 1 codé et testé en local** (migration, règle d'accès, garde-fous, tests). Branche `claude/lift-formations-acces`. **Aucun déploiement, base de production non modifiée.** Mise en ligne soumise à validation de Cellulift.
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

## 10. Audit avant migration (lot 1)

### 10.1 RLS Supabase et permissions des rôles
| Rôle | Droits | Vérifié |
|---|---|---|
| `anon`, `authenticated` (API automatique Supabase) | **Aucun** : RLS actif sur les 16 tables, aucune politique pour eux, droits retirés (`schema.sql`, migration 002) | 16/16 tables avec RLS, 16 politiques, toutes réservées à `academy_app` |
| `academy_app` (serveur de l'app, Vercel) | Lecture/écriture des données. **Ne peut pas** : modifier ou effacer `audit_log`, supprimer une commande ou un accès. Ni superutilisateur, ni `BYPASSRLS` | Testé (F09) |
| Propriétaire (`postgres`) | Structure et migrations uniquement, jamais utilisé par l'app | — |

**Limite assumée** : l'application se connecte avec un seul compte technique. Le RLS ferme l'API publique, mais il ne distingue pas les médecins entre eux. Le contrôle par utilisateur est fait par le serveur (règle d'accès à chaque requête) **et**, pour les droits payants, par les déclencheurs en base. Conséquence : le mot de passe de `academy_app` donne les pouvoirs de l'application. Il ne doit exister que dans les variables Vercel.
**À vérifier sur le projet Supabase réel avant d'appliquer** : les mêmes requêtes de contrôle (RLS par table, politiques, droits de `academy_app`) et les « advisors » sécurité de Supabase.

### 10.2 Accès directs aux vidéos, documents et ressources
| Ressource | Protection | Preuve |
|---|---|---|
| Pages parcours et leçons | Session + règle d'accès à chaque requête (404 sinon) | F05, F10, F13 |
| Vidéo (local) | Session + règle d'accès + leçon débloquée, à chaque requête ; fichiers hors de `public/` | F05, F10, F13 ; e2e 24 |
| Vidéo (Mux, production) | Jeton de lecture signé (RS256), lié au compte, valable 2 h, émis **après** le contrôle d'accès | Code relu |
| Documents | Session + règle d'accès à chaque requête ; en production, URL Supabase signée valable 5 min, compartiment privé | F05, F10 ; e2e 16 |
| Progression (API) | Session + règle d'accès + contrôle d'origine | F05, F10 |

**Risques résiduels** :
- après une révocation, un jeton Mux déjà émis reste valable jusqu'à 2 h, et une URL de document jusqu'à 5 min ;
- **à vérifier dans la console Mux** : la politique de lecture des vidéos est bien « signed » ;
- **à vérifier dans Supabase** : le compartiment `academy-documents` est bien privé.

### 10.3 Opérations administratives et attribution des droits
- Les 14 actions admin vérifient le rôle côté serveur (`requireAdmin`). Le rôle est relu en base à chaque requête, et un compte désactivé perd ses sessions. Les actions serveur de Next.js contrôlent l'origine (protection CSRF).
- **Nouveau, en base** : une commande, une validation de paiement, une annulation ou un remboursement, un accès accordé ou révoqué et une qualification vérifiée exigent tous un **administrateur actif** comme auteur, même en cas de bug applicatif (F04).
- **Risques résiduels et recommandations pour le lot 2** :
  - pas encore de double authentification pour les admins ;
  - toute personne admin peut vérifier une qualification. Ta consigne « personne habilitée » demande un droit séparé, à ajouter au lot 2 (par exemple « peut vérifier les qualifications ») ;
  - pas de double validation pour les accès offerts.

### 10.4 Sauvegarde, restauration, retour arrière
Procédure testée en local le 4 nov. 2026 :
1. **Sauvegarde** `pg_dump -Fc --no-owner` (base de test : 59 Ko).
2. **Restauration** dans une base neuve. Comptages identiques : users 19, programs 10, device_ownerships 23, lesson_progress 34, audit_log 115.
3. **Migration** appliquée deux fois sans erreur (rejouable).
4. **Retour arrière** (`002_formations_down.sql`) puis nouvelle migration : sans erreur.

Pour la base Supabase réelle :
- vérifier les sauvegardes incluses dans le plan du projet ;
- **faire en plus une sauvegarde manuelle** (`pg_dump` avec le compte propriétaire), conservée hors de Supabase ;
- tester la restauration dans une base jetable avant de migrer.

Le retour arrière se fait **en deux temps indissociables** : remettre le code précédent, puis jouer `002_formations_down.sql`. Le nouveau code a besoin des nouvelles colonnes, et l'ancien code fonctionne sans elles. Le retour arrière supprime les commandes et les accès : les exporter avant, leur trace restant dans `audit_log`.

### 10.5 Paiement, remboursement, révocation : règles appliquées
| Règle | Imposée par |
|---|---|
| Statuts : en attente → payée ou annulée ; payée → remboursée ; aucun autre passage | Déclencheur (F11) |
| « Payée » exige un vérificateur admin, une date et une référence de paiement | Contrainte + déclencheur (F04) |
| Montant, devise, moyen de paiement, compte et formation figés après création | Déclencheur (F09) |
| Accès « achat » seulement sur une commande **payée**, du même compte et de la même formation ; une commande = un accès | Déclencheur + index unique (F03) |
| Remboursement **intégral** confirmé → accès acheté révoqué automatiquement, avec l'auteur et le motif | Déclencheur (F11) |
| Exception après remboursement : accès « offert » avec motif obligatoire, tracé | Contrainte (F12) |
| Révocation définitive et motivée ; une prolongation = un nouvel accès | Déclencheur (F09, F10) |
| Durée de 12 mois envisagée : champ `programs.access_months` et date de fin `expires_at` sur l'accès | Accès expiré fermé (F13) |
| Changer de profession repasse la qualification « en attente » ; une qualification non vérifiée bloque l'accès sans le révoquer | Déclencheur (F06) |

**Points ouverts pour le lot 2** :
- le **remboursement partiel** n'est pas modélisé : la commande reste « payée » et l'accès est conservé. À décider ;
- un renouvellement demandera de révoquer (« remplacé ») l'accès expiré avant d'en créer un nouveau. L'écran admin le fera en une seule action.

## 11. Résultats des tests (lot 1, 4 nov. 2026)
Environnement : PostgreSQL 16 local, application lancée **avec le compte `academy_app`** (mêmes droits qu'en production), stockage et vidéo « local ».

- `npm run test:e2e` : **MVP 32/32 étapes réussies, sans aucune modification des tests existants**, suivies de **Formations 16/16** (`scripts/e2e-formations.mjs`), qui couvrent les scénarios 1 à 12 du §8 ainsi que l'historique protégé.
- Typecheck : OK. Journal de l'application pendant les tests : aucune erreur.
- Règle d'accès : exécution < 1 ms (plan de requête).

## 12. Fichiers modifiés (lot 1)
| Fichier | Changement |
|---|---|
| `db/migrations/002_formations.sql` | Nouveau : colonnes, tables `orders` et `access_grants`, contraintes, déclencheurs, journal, RLS |
| `db/migrations/002_formations_down.sql` | Nouveau : retour arrière |
| `db/app-role.sql` | Politiques pour les 2 nouvelles tables ; journal en ajout seul ; pas de suppression de commande ou d'accès |
| `scripts/db.mjs`, `package.json` | `npm run db:migrate` ; `test:e2e` enchaîne les deux suites ; `test:formations` |
| `src/lib/access.ts` | Règle « Formations » ajoutée à côté de la règle machines (qui gagne seulement `kind = 'technology'`) |
| `src/app/admin/actions.ts` | Message clair si l'on publie un parcours technologie sans machine ; une formation ne reçoit jamais de machine |
| `scripts/e2e-formations.mjs` | Nouveau : 16 étapes |

## 13. Vérifications complémentaires (avant lot 2, 4 nov. 2026)

### 13.1 Jetons vidéo Mux : limites de révocation et durée
- **Ce que fait Mux** (documentation « Secure video playback ») : l'expiration du jeton est contrôlée sur **chaque requête**, manifeste et segments, *« même si la lecture a déjà commencé »*. Un jeton ne peut donc pas être retiré avant son expiration. Il doit aussi couvrir toute la durée de la vidéo.
- **Changement fait** : la durée n'est plus fixée à 2 h. Elle vaut **durée de la leçon + 10 min, au minimum 15 min et au maximum 2 h** (2 h si la durée est inconnue) : `muxTokenTtl()` dans `src/lib/video.ts`.
- **Limite résiduelle documentée** : après une révocation, un jeton déjà émis reste utilisable au plus cette durée (15 min pour une leçon de moins de 5 min). Chaque rechargement de page refait le contrôle d'accès avant d'émettre un nouveau jeton. Quand un professionnel revient sur une vidéo après une longue pause, la page doit être rechargée (amélioration prévue : renouvellement automatique du jeton par le lecteur).
- **Testé** (S12) sur une instance de l'app configurée en mode Mux avec une clé de test : jeton de 15 min pour une leçon de 12 s, lié au compte, et aucun jeton émis pour un compte sans droit.
- À vérifier dans la console Mux : la politique de lecture des vidéos est « signed », sinon le jeton n'est pas exigé.

### 13.2 Accès croisés, sessions, accès directs : `scripts/e2e-securite.mjs` (12/12)
| # | Scénario | Résultat |
|---|---|---|
| S02 | B (vérifié, même profession, sans accès) sur la formation de A : page, leçon, vidéo, document, progression | Tous refusés |
| S03 | B tente d'écrire une progression sur la leçon de A | Refusé ; la progression de A est intacte ; aucune ligne pour B |
| S04 | Client HANOVER sur une formation, acheteur sur HANOVER (5 points d'entrée) | Tous refusés |
| S05 | Leçon sous un autre slug, leçon verrouillée (vidéo et page), identifiants inconnus ou malformés, `../` encodé, plage d'octets hors fichier | 404 / 403 / redirection / 416 |
| S06 | Progression envoyée depuis un autre site (origine) | 403 |
| S07–S10 | Sans session, jeton inventé, empreinte réutilisée comme jeton, session expirée, compte désactivé avec une session ouverte | Traités comme anonymes : pages → connexion, API → 401 |
| S11 | Un professionnel ouvre la fiche admin d'un autre compte | Renvoyé hors de l'administration |

### 13.3 Droit distinct de vérification des qualifications (migration 003, testée)
- Nouvelle colonne `users.can_verify_qualifications`. **Seul un administrateur actif ayant ce droit** peut passer une qualification à « vérifiée » ou « refusée », et jamais sur son propre compte (contrôle en base, F04).
- Le droit s'accorde ou se retire **par un autre administrateur actif**, jamais à soi-même, et il est tracé au journal (F01, F16). Le premier vérificateur est désigné par le compte propriétaire de la base.
- Retour arrière : `003_verificateurs_down.sql`, testé (rejeu complet 002 → 003 → retour → 003).

### 13.4 Justificatifs professionnels : règles de protection et de conservation (à mettre en œuvre au lot 2)
| Règle | Proposition |
|---|---|
| Minimisation | Demander d'abord le **n° d'inscription à l'Ordre**. Un fichier n'est demandé que si le numéro ne suffit pas à vérifier. |
| Formats | PDF, JPEG, PNG ; 5 Mo maximum ; type contrôlé sur le contenu réel du fichier, pas sur son nom. |
| Stockage | Compartiment Supabase **privé et dédié** (`lift-justificatifs`), distinct des supports de cours ; nom de fichier aléatoire ; jamais d'URL publique. |
| Consultation | Uniquement par les **vérificateurs habilités**, via le serveur : URL signée de 60 s. **Chaque consultation est journalisée.** Le professionnel voit seulement le statut de son propre dossier. |
| Conservation | Le fichier est **supprimé 30 jours après la décision**, ce qui laisse le temps d'une contestation. On conserve seulement le type de pièce, le numéro, le vérificateur, la date et la décision. Une suppression automatique, tracée, est prévue. |
| Demande de suppression | À la fermeture du compte, ou sur demande : suppression du fichier et des données de vérification non obligatoires, tracée. |
| Cadre légal | Données personnelles de professionnels de santé : **à faire valider** au regard de la loi 09-08 et des formalités auprès de la CNDP. Une mention d'information est affichée au moment du dépôt. |
