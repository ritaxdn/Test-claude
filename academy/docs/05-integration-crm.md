# CELLULIFT ACADEMY — Intégration avec le CRM Cellulift

> Le CRM, c'est le projet Supabase `igfgqfwkhyonptbtrywl` : comptes, contacts, produits, opportunités, devis.
> Le site cellulift.ma lui envoie déjà ses demandes via la fonction `recevoir_lead` (`src/lib/crm.ts`).
> Ce document décrit comment l'Academy s'y connecte. Rien n'a été modifié dans la base de production.

## 1. Ce que l'intégration doit faire

| Sens | Événement | Effet |
|---|---|---|
| CRM → Academy | Une machine est vendue et installée chez un client | Le praticien reçoit l'accès au programme de formation de **cette** machine (invitation par e-mail, ou ajout à son compte Academy s'il en a déjà un) |
| CRM → Academy | Vente annulée / reprise de matériel | Les accès liés à cette machine sont révoqués (les achats, la progression et les certificats restent) |
| Academy → CRM | Un professionnel non client s'inscrit, ou achète un cours | Un **lead** arrive dans le CRM (source « Academy »), comme ceux du site |
| Academy → CRM | Un client termine (ou n'a pas commencé) sa formation | Visible sur la fiche client du CRM : le commercial voit l'activation et peut relancer |
| Academy → CRM | Un utilisateur Open Academy devient client | Rapprochement par e-mail : le compte Academy existant est conservé, rien n'est recréé |

## 2. État actuel des données (constaté le 20/10/2026, requêtes agrégées en lecture seule)

| Constat | Chiffre | Conséquence |
|---|---|---|
| Produits actifs dans `produits` | 47, mêmes noms que le catalogue du site | ✅ La correspondance machine ↔ programme se fait par `produits.id` |
| Produits marqués `medical_only` | 5 | ✅ Sert directement de règle « réservé aux médecins » |
| Comptes `statut = client` | 102 | |
| Affaires gagnées (`issue = 'gagnee'`) | 34 | |
| … dont avec un `produit_id` | **0** | ❌ Impossible de savoir quelle machine a été vendue |
| … dont le titre cite un produit | 0 | ❌ Pas de rattrapage automatique possible |
| Lignes de devis avec un produit | 0 sur 21 | ❌ Les devis ne le disent pas non plus |
| Affaires gagnées dont le client a un e-mail | 5 sur 34 | ❌ Pas d'adresse pour envoyer l'invitation |

**Conclusion :** le branchement technique est simple, mais aujourd'hui il ne déclencherait aucun accès. Il faut d'abord que le CRM enregistre, pour chaque vente, **la machine, le numéro de série et le praticien à former (avec son e-mail)**.

## 3. Ce qu'il faut ajouter au CRM (prérequis)

Brouillon SQL : [`../supabase/crm-academy-draft.sql`](../supabase/crm-academy-draft.sql) — **non appliqué**, à relire avec l'équipe CRM.

1. **Table `equipements_clients`** : une ligne par machine installée — compte, praticien (contact), produit, n° de série, date d'installation, affaire d'origine. Une affaire peut couvrir plusieurs machines ; une machine peut changer de clinique.
2. **Dans le CRM, à la clôture « gagnée »** : demander la ou les machines vendues et le praticien à former (avec e-mail obligatoire). C'est le seul vrai changement pour les commerciaux.
3. **Rattrapage** des 34 affaires gagnées existantes : une liste à compléter une fois (machine + e-mail), par l'ADV ou les commerciaux.
4. **Fonction `academy_equipements_depuis(cle, depuis)`** : renvoie à l'Academy les installations créées ou modifiées depuis une date, protégée par une clé secrète comme `recevoir_lead`. Elle ne renvoie que le strict nécessaire (pas de montants, pas de notes commerciales).
5. **Fonction `academy_evenement(cle, evenement)`** : l'Academy y signale l'activation et la fin de formation ; les événements s'affichent sur la fiche client.
6. **Source de leads « Academy »** dans Réglages › Leads entrants, réutilisant `recevoir_lead` sans changement.

## 4. Architecture recommandée

```
          CRM Cellulift (Supabase existant)                     Academy (projet séparé)
 ┌───────────────────────────────────────────┐        ┌───────────────────────────────────────┐
 │ opportunite gagnée → equipements_clients  │        │ device_ownerships (crm_ref = id CRM)  │
 │                                           │  ①     │        → entitlements « equipment »   │
 │ academy_equipements_depuis(cle, depuis) ◄─┼────────┤ tâche planifiée toutes les 15 min    │
 │                                           │        │ + bouton « Synchroniser » (admin)     │
 │ recevoir_lead(cle, lead)              ◄───┼────────┤ ② inscription / achat d'un non-client │
 │ academy_evenement(cle, evenement)     ◄───┼────────┤ ③ activation, fin de formation        │
 └───────────────────────────────────────────┘        └───────────────────────────────────────┘
```

- **Deux projets Supabase distincts, reliés par des fonctions à clé.** L'Academy accueille des centaines de comptes externes ; le CRM contient les données commerciales. Les mettre dans la même base (même authentification, mêmes règles d'accès) ferait qu'une seule erreur de règle exposerait le CRM. Le modèle `recevoir_lead` déjà en place est le bon : chaque partie n'appelle que des fonctions précises, avec une clé stockée côté serveur.
- **① CRM → Academy en « pull »** toutes les 15 minutes (et à la demande depuis l'admin) : l'Academy demande ce qui a changé depuis le dernier passage. Plus simple et plus robuste qu'un webhook : si l'Academy est indisponible, rien n'est perdu. Un déclencheur peut être ajouté plus tard pour un délai de quelques secondes.
- **Rapprochement des personnes** : par e-mail du contact (normalisé), puis par numéro d'inscription à l'Ordre si renseigné. En cas de doute (même nom, e-mail différent), l'installation arrive dans une file « à rattacher » de l'admin Academy au lieu de créer un doublon.
- **Correspondance produit → programmes** : la matrice « Équipements × formation » de l'admin Academy, indexée par `produits.id` du CRM.
- **Révocation** : si une installation est supprimée ou marquée reprise dans le CRM, la synchronisation révoque les accès de source « equipment » correspondants.

## 5. Côté Academy (dans le schéma `schema.sql`)

- `device_models.crm_produit_id` ← `produits.id`
- `device_ownerships.crm_ref` ← `equipements_clients.id` ; `clinic_name` ← `comptes.nom`
- `users.crm_contact_id` (optionnel) ← `contacts.id` une fois rapproché
- Table `crm_sync_runs` (début, fin, nb reçus, nb rattachés, nb en attente, erreurs) affichée dans l'admin.

## 6. Ce qui reste à décider avec Cellulift

1. Qui saisit la machine et le praticien à la vente : le commercial à la clôture, ou l'ADV à la livraison ?
2. Un client multi-praticiens (clinique) : combien de praticiens formés par machine ?
3. Faut-il remonter dans le CRM le détail par leçon, ou seulement « activé / terminé / certificat » ? (Recommandé : seulement ces trois étapes.)
4. Les leads Academy vont-ils au commercial du secteur, ou à une file dédiée ?
