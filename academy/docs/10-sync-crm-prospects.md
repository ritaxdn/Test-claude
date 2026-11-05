# 10 — Synchronisation des prospects LIFT vers le CRM (proposition, rien n'est envoyé)

> Statut : **conception uniquement**. Aucune donnée n'est envoyée au CRM, et le CRM n'est pas modifié (règle : lecture seule sans accord explicite).
> Décision Cellulift (5 nov. 2026) : ne pas envoyer toutes les demandes ; synchroniser **seulement les prospects ayant consenti à être contactés commercialement**, avec **déduplication** et **distinction client / non-client**.

## 1. Ce qui est déjà en place côté LIFT
- **Consentement commercial distinct** sur le formulaire d'inscription : une case **non cochée par défaut**, horodatée (`enrollment_requests.marketing_consent_at`). Il est séparé du consentement nécessaire au traitement de la demande.
- **Adresse e-mail confirmée** par le demandeur (`email_confirmed_at`) : on ne synchronise jamais une adresse non prouvée.
- L'admin voit sur chaque demande si le demandeur a donné son consentement commercial.

## 2. Qui est synchronisé
Une demande est **éligible** si les trois conditions sont réunies :
1. `marketing_consent_at` est renseigné ;
2. `email_confirmed_at` est renseigné ;
3. la demande n'a pas été annulée pour fraude ou doublon.

Elle n'est jamais envoyée sans consentement, même si le demandeur achète ensuite.

## 3. Ce qui est envoyé, et ce qui ne l'est jamais
| Envoyé (canal existant `recevoir_lead`, celui du site) | Jamais envoyé |
|---|---|
| Nom, e-mail, téléphone, pays, profession (libellé), formation demandée, étape (demande, vérifiée, payée), date du consentement, source « LIFT », référence interne de la demande | N° d'Ordre, justificatif, motif de refus, montant ou référence de paiement, empreinte d'IP, message libre, données de progression |

Le canal `recevoir_lead` est déjà utilisé par le site : il ajoute un prospect avec une clé de source dédiée et ne permet ni de lire ni de modifier le CRM. **Pour LIFT, il faudra créer une clé de source « LIFT »** dans le CRM (Réglages › Leads entrants), à faire par Cellulift.

## 4. Déduplication
- **Clé** : l'adresse e-mail en minuscules, puis, à défaut, le téléphone normalisé (format international, Maroc 0… → 212…).
- **Côté LIFT** : une table d'envoi `crm_outbox` (une ligne par événement à envoyer, avec une **clé d'idempotence** = demande + étape). Une même étape n'est jamais envoyée deux fois.
- **Côté CRM** : c'est le CRM qui rapproche le prospect d'une fiche existante (même e-mail ou même téléphone). LIFT n'écrit jamais directement dans les tables du CRM. Si `recevoir_lead` ne déduplique pas encore, la règle de rapprochement est à ajouter dans le CRM, par une migration relue (brouillon `supabase/crm-academy-draft.sql`).

## 5. Client existant ou non-client
| Signal | Source | Résultat envoyé |
|---|---|---|
| Le compte LIFT a au moins une machine active (`device_ownerships`) | LIFT | `segment = "client"` + machines |
| L'adresse correspond à un client du CRM (contact lié à une vente gagnée ou à un équipement) | CRM, **en lecture** | `segment = "client"` (calculé côté CRM au rapprochement) |
| Aucun des deux | — | `segment = "non-client"` (le prospect prioritaire de LIFT) |

LIFT envoie seulement ce qu'il sait (machines liées au compte). La qualification définitive client ou non-client est faite par le CRM au rapprochement. Les deux bases ne sont pas fusionnées.

## 6. Quand envoyer
| Événement LIFT | Envoi |
|---|---|
| Adresse confirmée (demande transmise) | Prospect créé ou mis à jour : étape « demande » |
| Demande acceptée (qualification vérifiée) | Étape « vérifié » |
| Commande payée | Étape « client formation » |
| Retrait du consentement (désinscription) | Mise à jour « ne plus contacter » ; plus aucun envoi ensuite |

Les événements passent par `crm_outbox`, traitée toutes les 15 minutes par une tâche planifiée. En cas d'échec, l'envoi est retenté (3 fois, avec attente), puis signalé dans l'admin. Une indisponibilité du CRM ne bloque donc jamais une inscription.

## 7. Retrait du consentement
- Un lien de désinscription dans chaque e-mail commercial.
- Une page LIFT « Mes préférences de contact » depuis Mon compte.
- Le retrait est horodaté et transmis au CRM.

## 8. Mise en œuvre proposée (après validation juridique J3 et J8, docs/09)
1. Migration LIFT : `crm_outbox` (événement, clé d'idempotence, état, tentatives, dernière erreur) et retrait du consentement.
2. Remplissage de `crm_outbox` par les actions existantes (confirmation, acceptation, paiement), dans la même transaction.
3. Tâche d'envoi par le canal `recevoir_lead` avec la clé de source « LIFT », dans les variables Vercel `CRM_LEADS_KEY_LIFT`.
4. Écran admin « Synchronisation CRM » : envoyés, en échec, à relancer.
5. Côté CRM (avec ton accord et une migration relue) : rapprochement par e-mail ou téléphone, et segment client / non-client.
6. Tests : envoi seulement si consentement et e-mail confirmé, aucune donnée sensible envoyée, idempotence (même étape envoyée une seule fois), reprise après panne du CRM, retrait du consentement.

## 9. Décisions à prendre
- Créer la clé de source « LIFT » dans le CRM.
- Valider le texte du consentement commercial et la désinscription (juridique).
- Autoriser une petite migration côté CRM pour le rapprochement, si `recevoir_lead` ne le fait pas déjà.
