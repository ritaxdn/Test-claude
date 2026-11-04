# 08 — Lot 2 : parcours commercial minimum (plan, à valider)

> **Statut (4 nov. 2026) : lot 2 codé et testé en local, branche `claude/lift-formations-acces`, aucun déploiement, base de production non modifiée.**
>
> Objectif unique : **un professionnel non client CELLULIFT découvre une formation, demande son inscription,
> est vérifié, paie manuellement et reçoit son accès.** « Mes technologies » reste inchangé pour les clients.
> Branche `claude/lift-formations-acces`, aucun déploiement. S'appuie sur le lot 1 (docs/07).

## 1. Le parcours, étape par étape

```
 Professionnel                                   Cellulift (admin / vérificateur)
 ─────────────                                   ────────────────────────────────
 1. Catalogue public  /formations
 2. Fiche formation   /formations/[slug]
 3. Demande d'inscription (formulaire)  ──────▶  Demande reçue (e-mail + liste « Demandes »)
 4. E-mail « demande reçue »                     5. Vérification de la qualification (vérificateur habilité)
                                                    ├─ refusée → e-mail motivé, fin
                                                    └─ vérifiée → compte créé + commande « en attente »
 6. E-mail : instructions de paiement  ◀──────      (prix de la formation, devise selon le pays, référence unique)
    (virement, référence à rappeler)
                                                 7. Paiement reçu → « marquer payée » (référence bancaire)
                                                    → accès créé (durée de la formation)
 8. E-mail : « Votre accès est ouvert »  ◀─────     (lien d'invitation si nouveau compte)
 9. Création du mot de passe (existant)
10. Tableau de bord → section « Formations » → leçons, documents, progression (existant)
```

Le client existant ne voit aucune différence. S'il achète une formation, son tableau de bord affiche une section de plus.

## 2. Écrans

### Publics (sans connexion)
| Écran | Contenu | Remarques |
|---|---|---|
| **Catalogue** `/formations` | Une carte par formation **publiée et listée** : titre, promesse en une ligne, public visé, durée, intervenant(s), prix | Si aucune formation n'est listée : page « Catalogue en préparation » avec un lien vers l'avant-première. Jamais de fausse carte. |
| **Fiche formation** `/formations/[slug]` | Objectifs pédagogiques, public et prérequis, programme (titres des modules et leçons, durées), intervenants (nom et titre réels), modalités (accès en ligne, durée d'accès, paiement par virement, vérification professionnelle), prix par devise, FAQ, mention « *une formation en ligne n'habilite pas à pratiquer un acte* » | Le contenu des leçons n'est jamais visible ici. CTA unique : « Demander mon inscription ». |
| **Demande d'inscription** | Nom, e-mail, téléphone, pays, profession (liste fermée), n° d'inscription à l'Ordre, justificatif (si demandé), acceptation des CGV et de la politique de confidentialité | Champ piège anti-robot, limite de fréquence, double vérification du format côté serveur. Une profession non autorisée pour la formation est refusée avec un message clair. |
| **Confirmation** | « Demande reçue », prochaines étapes, délai indicatif de traitement | Pas de promesse de date. |

### Professionnel connecté
| Écran | Changement |
|---|---|
| Tableau de bord | Deux sections : **Formations** puis **Mes technologies**, chacune affichée seulement si elle n'est pas vide. Une formation expirée apparaît « Accès terminé », avec un lien vers sa fiche. |
| Mon compte (nouveau, minimal) | Profession, statut de vérification, et le dépôt d'un nouveau justificatif si la qualification a été refusée |

### Administration
| Écran | Actions |
|---|---|
| **Demandes** (nouveau) | Liste filtrable par étape : nouvelle, à vérifier, en attente de paiement, payée, refusée, annulée |
| **Fiche demande** (nouveau) | Consulter le justificatif (vérificateurs seulement, consultation journalisée) ; **vérifier** ou **refuser** avec motif ; **créer le compte et la commande** (prix repris de la formation) ; **marquer payée** (référence obligatoire) ; **annuler** ; **rembourser** (motif) |
| Fiche professionnel (existante, enrichie) | Qualification, commandes, accès (offrir avec motif, révoquer avec motif), historique lisible tiré du journal |
| Fiche formation (existante, enrichie) | Type, professions autorisées, objectifs, public, prérequis, prix MAD / EUR / USD, durée d'accès, « visible au catalogue » |
| **Vérificateurs** (nouveau) | Accorder ou retirer le droit de vérification à un autre administrateur |

### E-mails (Resend, expéditeur LIFT)
1. Demande reçue.
2. Qualification refusée, avec le motif et la possibilité de redéposer un justificatif.
3. Instructions de paiement : montant, devise, RIB, **référence unique à rappeler**.
4. Accès ouvert, avec le lien de création du mot de passe pour un nouveau compte.
5. Remboursement confirmé ou accès révoqué.

## 3. Données à ajouter (migration 004, additive)
- `programs` : `listed` (visible au catalogue), `objectives`, `audience`, `prerequisites`, `price_mad`, `price_eur`, `price_usd`. Un prix par devise, jamais de conversion automatique (règle du projet).
- `enrollment_requests` : identité, contact, pays, profession, n° d'Ordre, formation, consentements (date et version des CGV), statut, motif de refus, liens vers le compte et la commande créés.
- `qualification_documents` : justificatif privé (clé de stockage, type, taille, empreinte), date de dépôt, date de suppression prévue, suppression effective et son auteur.
- `orders.payment_reference` : référence unique générée, du type `LIFT-2026-000123`, à rappeler sur le virement.
- La devise affichée et facturée découle du pays : MA → MAD, sinon EUR ou USD.

## 4. Dépendances (ce qui bloque, et qui le fournit)

### Bloquant pour ouvrir le catalogue au public (côté Cellulift)
| # | Dépendance | Responsable |
|---|---|---|
| D1 | **Une première formation réelle et complète** : vidéos tournées et montées, fiche protocole, objectifs pédagogiques, public, prérequis, intervenant validé | Academy + Dr Dadoun |
| D2 | **Prix** par devise (MAD, EUR, USD) et durée d'accès confirmée (12 mois envisagés) | Direction |
| D3 | **Coordonnées bancaires** et **procédure de facturation** (mentions légales, TVA, qui émet la facture) | Comptabilité |
| D4 | **CGV** : conditions d'accès, durée, **remboursement intégral et partiel**, exceptions | Direction + juridique |
| D5 | **Politique de confidentialité** et cadre légal des justificatifs (loi 09-08, CNDP) | Juridique |
| D6 | **Professions autorisées** pour la première formation | Academy (selon les règles applicables) |
| D7 | **Vérificateur(s) habilité(s)** désigné(s), et délai de traitement d'une demande | Direction |

### Techniques (de mon côté, ou avec un accès de Cellulift)
| # | Dépendance |
|---|---|
| T1 | Migrations 002 → 004 appliquées sur le projet Supabase LIFT, **après validation et sauvegarde** |
| T2 | Compte Mux : politique de lecture « signed », clé de signature dans Vercel, vidéos importées |
| T3 | Compartiment privé `lift-justificatifs` ; compartiment `academy-documents` privé confirmé |
| T4 | Domaine d'envoi d'e-mails vérifié dans Resend (par exemple academy@cellulift.ma) |
| T5 | Optionnel, avec accord : envoyer chaque demande d'inscription au CRM comme prospect, par le même mécanisme que le site (`recevoir_lead`). Sans accord, le CRM n'est pas touché. |

Le développement peut avancer sans D1 à D7, avec des contenus de démonstration. En revanche, **rien ne sera rendu public** tant que D1 à D5 ne sont pas réglées.

## 5. Ordre de développement
1. **Fiche formation et catalogue** : migration 004 (champs commerciaux), écran admin « fiche formation » enrichi, pages publiques catalogue et fiche.
2. **Demande d'inscription** : formulaire public, dépôt du justificatif, e-mail « demande reçue », écrans admin « Demandes » et « Fiche demande », vérification ou refus par un vérificateur habilité.
3. **Commande et accès** : création du compte et de la commande depuis la demande, e-mail d'instructions de paiement, « marquer payée » qui ouvre l'accès avec sa date de fin, e-mail « accès ouvert », remboursement.
4. **Tableau de bord** en deux sections, page « Mon compte », écran « Vérificateurs ».
5. **Tests complets** du parcours (§6), sur téléphone et ordinateur, puis rapport avant toute mise en ligne.

## 6. Tests prévus (ajoutés à `npm run test:e2e`)
| # | Scénario | Attendu |
|---|---|---|
| C1 | Catalogue sans formation listée | Page « en préparation », aucune carte inventée |
| C2 | Formation brouillon ou non listée | Absente du catalogue ; sa fiche répond 404 |
| C3 | Fiche formation | Programme visible (titres), aucun contenu de leçon, aucun lien direct vers une vidéo ou un document |
| C4 | Parcours complet d'un non-client | Demande → vérification → commande → paiement → e-mail → mot de passe → formation ouverte, leçons dans l'ordre |
| C5 | Demande avec une profession non autorisée | Refusée, avec un message clair |
| C6 | Demande robot (champ piège, envoi trop rapide, rafale) | Ignorée ou limitée |
| C7 | Justificatif | Visible par un vérificateur habilité (consultation journalisée) ; refusé à un admin non habilité, au professionnel lui-même pour les autres comptes, et sans connexion |
| C8 | Mauvais type de fichier, ou plus de 5 Mo | Refusé |
| C9 | Suppression automatique du justificatif 30 jours après la décision | Fichier supprimé ; métadonnées conservées ; suppression tracée |
| C10 | Devise selon le pays | MA → MAD ; autre pays → EUR ou USD ; montant repris de la formation |
| C11 | Référence de paiement | Unique, présente dans l'e-mail et sur la commande |
| C12 | Commande payée | Accès créé avec la bonne date de fin ; e-mail « accès ouvert » envoyé |
| C13 | Remboursement intégral | Accès révoqué ; e-mail envoyé ; tracé |
| C14 | Client existant | « Mes technologies » identique ; une formation achetée ajoute une section |
| C15 | Formation expirée | « Accès terminé » au tableau de bord ; leçons fermées |
| C16 | Écrans publics et nouveaux écrans admin | Rendu téléphone et ordinateur ; états vide, chargement, erreur, succès |
| C17 | Non-régression | MVP 32/32, Formations 16/16, Sécurité 12/12 |

## 7. Hors lot 2 (volontairement)
Paiement en ligne, inscription sans vérification, abonnements, attestations ou certificats, avis, codes promo, sessions live, parcours hybrides avec réservation de places en présentiel. Chacun sera une étape suivante, une fois la vente manuelle validée sur de vrais acheteurs.

## 8. Mesurer si ça vend (dès le lot 2)
Entonnoir mesuré en base, sans outil externe : visites de la fiche → demandes → vérifiées → commandes → **payées** → première leçon commencée → formation terminée. Délais : demande → vérification, commande → paiement. Motifs de refus et d'abandon. Ce sont les chiffres qui diront si le modèle payant fonctionne, avant d'investir dans le paiement en ligne.

## 9. Réalisé (lot 2)

### Écrans
| Écran | Adresse | Accès |
|---|---|---|
| Catalogue | `/formations` | Public. Formations **publiées et listées** seulement ; « Catalogue en préparation » si aucune |
| Fiche formation | `/formations/[slug]` | Public. Objectifs, programme (titres et durées), intervenants réels, prix par devise, durée d'accès, mention « n'habilite pas » ; aucun contenu de leçon |
| Demande d'inscription | `/formations/[slug]/inscription` | Public. Professions de la formation seulement, justificatif facultatif, consentement |
| Confirmation | `/formations/[slug]/inscription/merci` | Public |
| Tableau de bord | `/tableau-de-bord` | Sections **Formations** et **Mes technologies**, chacune seulement si elle n'est pas vide. « Accès terminé » pour une formation expirée. Lien vers le catalogue si aucune formation |
| Mon compte | `/mon-compte` | Profession, statut de vérification, commandes |
| Demandes | `/admin/demandes` | Admin. Filtres par étape et entonnoir (demandes, vérifiées, payées, formation commencée) |
| Fiche demande | `/admin/demandes/[id]` | Admin. Accepter ou refuser (**vérificateur habilité**) ; marquer payée, annuler, rembourser |
| Justificatif | `/api/justificatifs/[id]` | **Vérificateur habilité** seulement ; consultation tracée ; 410 après suppression |
| Fiche commerciale | `/admin/parcours/[id]` | Admin. Professions autorisées, promesse, objectifs, public, prérequis, prix MAD / EUR / USD, durée d'accès, visible au catalogue |
| Fiche professionnel | `/admin/medecins/[id]` | Admin. Qualification, commandes (payer, annuler, rembourser), accès (offrir avec motif, révoquer) |
| Vérificateurs | `/admin/verificateurs` | Admin. Accorder ou retirer le droit (jamais à soi-même) ; historique |

### Données (migration 004, additive, retour arrière testé)
- **Fiche commerciale** dans `programs`. Une formation n'apparaît au catalogue que si elle est publiée.
- **`enrollment_requests`** : une demande ne peut être acceptée ou refusée que par un vérificateur habilité, ne change plus de statut une fois traitée, ses informations ne se modifient pas, et elle ne se supprime pas.
- **`qualification_documents`** : type de fichier contrôlé sur son contenu, 5 Mo maximum, empreinte SHA-256. La suppression du fichier est programmée à décision + 30 jours ; la ligne est conservée et la suppression tracée.
- **`orders.payment_reference`** : référence unique `LIFT-AAAA-NNNNNN`, générée par la base, impossible à modifier.
- Le journal couvre les demandes, les justificatifs et les prix. Le RLS est actif sur les deux nouvelles tables, et l'application n'a pas le droit de supprimer leurs lignes.

### Règles appliquées
- La devise découle du pays (Maroc : MAD ; zone euro et Suisse : EUR ; autres : USD), avec un prix fixé par devise, sans conversion. Sans prix dans la devise, l'acceptation est bloquée avec un message.
- Accepter une demande crée le compte (ou le reprend), vérifie la qualification, crée la commande « en attente » et envoie les instructions de paiement. Le texte du RIB vient de la variable `LIFT_PAYMENT_INSTRUCTIONS`.
- Marquer une commande payée exige la référence bancaire du virement. L'accès est ouvert pour la durée de la formation, puis un lien de création du mot de passe est envoyé (nouveau compte) ou un lien de connexion (compte existant).
- E-mails : demande reçue, refus motivé, instructions de paiement, accès ouvert, remboursement. Une copie part à l'équipe (`LIFT_NOTIFY_EMAIL`). Sans clé Resend, rien n'est envoyé et l'admin voit le lien ou la référence à transmettre.
- Contre les robots : champ piège, envoi en moins de 3 s ignoré, 5 demandes par heure par connexion, 3 par jour par adresse et par formation.
- Justificatifs supprimés chaque jour par `npm run purge:justificatifs` (tâche planifiée à mettre en place).
- Libellé côté client : « Votre HANOVER 5G » remplace « Inclus avec votre HANOVER 5G » (règle « ne pas écrire inclus avec la machine »). Réversible si Cellulift préfère l'ancien libellé.

### Tests (4 nov. 2026, compte `academy_app`, navigateur réel)
`npm run test:e2e` : **MVP 32/32, Formations 16/16, Sécurité 13/13, Parcours commercial 18/18** (`scripts/e2e-commercial.mjs`). La suite commerciale couvre :
- catalogue vide, formation non listée (404), fiche sans aucun accès au contenu ;
- robots, profession non autorisée (refusée côté serveur), faux PDF, fichier de plus de 5 Mo ;
- demande valide avec justificatif, consultation du justificatif (401 / 403 / 200, consultation tracée) ;
- acceptation (MAD), paiement (référence obligatoire), accès de 12 mois, mot de passe, formation ouverte, « Mon compte » ;
- hors Maroc (EUR), remboursement intégral, refus motivé, limite de fréquence, suppression du justificatif à 30 jours ;
- client existant inchangé, accès expiré, fiche commerciale, vérificateurs, administration interdite aux professionnels.

Rendu vérifié sur téléphone (390 px, aucun débordement) et sur ordinateur. Typecheck OK. Aucune erreur dans le journal de l'application.

### Avant toute mise en ligne (rappel des dépendances §4)
D1 à D5 côté Cellulift (formation réelle, prix, RIB et facturation, CGV avec règle de remboursement partiel, confidentialité et CNDP) ; T1 à T4 côté technique (migrations 002 → 004 sur Supabase après sauvegarde, Mux signé et DRM, compartiment privé `lift-justificatifs`, domaine d'envoi Resend) ; tâche planifiée de suppression des justificatifs ; variables `LIFT_PAYMENT_INSTRUCTIONS`, `LIFT_NOTIFY_EMAIL`, `LIFT_TERMS_VERSION`, `SUPABASE_PROOF_BUCKET`. La version des conditions enregistrée avec chaque consentement est aujourd'hui « brouillon-2026-11 » : elle doit pointer vers les vraies CGV avant l'ouverture.
