# Dr Dadoun — Site de médecine esthétique

Site vitrine (FR) du cabinet de médecine esthétique du Dr Dadoun.
Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

```bash
cd dr-dadoun
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Modifier le contenu

Tout le texte du site se trouve dans `src/content/site.ts`.
Les valeurs marquées `À COMPLÉTER` sont des exemples à remplacer avant la mise en ligne :
nom complet, n° d'inscription à l'Ordre, e-mail, diplômes (`about.education`), jours de fermeture
du calendrier (`booking.closedDates`), liens officiels (`practice.sameAs`).

Le contenu de l'espace médecins (formations, sessions, newsletter) est dans `src/content/formations.ts`.

## Prise de rendez-vous

La page `/rendez-vous` (et la section du même nom sur l'accueil) propose un calendrier :
motif → jour → créneau → coordonnées. Les créneaux découlent des horaires définis dans
`booking.openings`. Chaque demande est envoyée au cabinet par e-mail via
[Resend](https://resend.com), puis confirmée au patient par le secrétariat.

Variables d'environnement à définir (sinon les demandes sont seulement journalisées) :

| Variable | Exemple |
| --- | --- |
| `RESEND_API_KEY` | `re_…` |
| `BOOKING_EMAIL_TO` | `secretariat@dr-dadoun.fr` |
| `BOOKING_EMAIL_FROM` | `Site Dr Dadoun <rdv@dr-dadoun.fr>` |

### Newsletter Cellulift Academy

Les inscriptions à la newsletter (page `/formations`) sont ajoutées à une *Audience* Resend,
qui sert de base de données des inscrits et permet d'envoyer les newsletters depuis Resend.

| Variable | Rôle |
| --- | --- |
| `RESEND_AUDIENCE_ID` | identifiant de l'audience « Cellulift Academy » (Resend → Audiences) |

La clé `RESEND_API_KEY` doit avoir l'accès **Full access** pour ajouter des contacts.
Sans audience configurée, chaque inscription est envoyée par e-mail au cabinet.

## Formations : événements et inscriptions en ligne

Tout se gère dans **un Google Sheet**, sans toucher au code :
- l'onglet **Événements** contient les sessions que vous publiez ;
- l'onglet **Inscriptions** est rempli automatiquement par le site : une ligne par médecin inscrit.

### Mise en place (une seule fois)

1. Créer un Google Sheet. Renommer le premier onglet exactement **Événements**, puis y importer `docs/formations-evenements-modele.csv` (Fichier → Importer → Remplacer la feuille actuelle).
2. Extensions → **Apps Script** : coller le contenu de `docs/inscriptions-apps-script.js`, remplacer `CLE_SECRETE` par un mot de passe long, puis enregistrer.
3. Déployer → **Nouveau déploiement** → type **Application Web** : « Exécuter en tant que : Moi », « Qui a accès : Tout le monde ». Autoriser l'accès demandé, puis copier l'URL de l'application Web.
4. Dans Vercel → Settings → Environment Variables (Production et Preview), ajouter :
   - `FORMATIONS_SCRIPT_URL` = l'URL copiée ;
   - `FORMATIONS_SCRIPT_KEY` = le mot de passe choisi à l'étape 2.
5. Redéployer une fois.

### Au quotidien

Une ligne dans l'onglet Événements = une session sur le site.

| Colonne | Contenu |
| --- | --- |
| `id` | Identifiant unique, sans espace, ex. `lasers-2027-03` (ne plus le changer une fois publié) |
| `debut` | Date de début AAAA-MM-JJ (tri, et masquage une fois passée) |
| `dates` | Dates affichées, ex. « 12 – 13 mars 2027 » |
| `formation` | Injectables, Lasers médicaux ou Endolifting (vide pour un autre événement) |
| `titre` | Titre libre (masterclass, congrès…) ; sinon le nom de la formation |
| `lieu` | Ville ou lieu |
| `modalites` | Durée, format |
| `places` | Nombre de places (vide = illimité) |
| `statut` | `ouvert`, ou `complet` pour fermer les inscriptions à la main |
| `lien` | Facultatif : lien d'inscription externe (formulaire, billetterie). S'il est rempli, le bouton « S'inscrire » y mène au lieu du formulaire du site |

- Le site affiche les places restantes et passe la session en « Complet » automatiquement.
- Chaque inscription arrive dans l'onglet Inscriptions, avec la date, le nom, la spécialité, l'e-mail, le téléphone, la ville et le n° d'Ordre. Le cabinet reçoit aussi un e-mail, et le médecin une confirmation.
- Pour annuler une inscription, écrire `annulé` dans sa colonne `statut` : la place est libérée.
- Les changements apparaissent sur le site en 1 minute environ.

Sans script configuré, le site peut aussi lire l'onglet publié en CSV (`FORMATIONS_SHEET_CSV`), mais sans inscription en ligne.

## SEO et GEO

- Métadonnées par page (titres et descriptions ciblés « … à Casablanca »), URL canoniques.
- Données structurées schema.org : `MedicalClinic`, `Physician`, horaires, actes (`MedicalProcedure`),
  `FAQPage`, fil d'Ariane, formations (`Course`) — voir `src/lib/seo.ts`.
- `/sitemap.xml`, `/robots.txt` (moteurs et assistants IA explicitement autorisés), `/llms.txt`
  (résumé du site pour les IA, généré depuis le contenu), image de partage `/opengraph-image`.
- Adresse publique du site : https://docteurdadoun.com par défaut (variable `NEXT_PUBLIC_SITE_URL` pour la changer).
- Page « entité » du médecin : `/docteur-mohamed-dadoun` (`Person` + `Physician`, `sameAs`). Ajouter les conférences
  dans `about.talks` et les autres profils officiels (Cellulift, fiche Google…) dans `about.profiles` (`site.ts`).
- Google Search Console : méthode « Balise HTML », coller le code (la valeur de `content="…"`) dans la variable
  `GOOGLE_SITE_VERIFICATION` de Vercel, redéployer, puis cliquer « Valider ».
- Fiches détaillées des soins (`src/content/fiches.ts`) : publiées quand `validated: true` (+ `reviewed: "AAAA-MM-JJ"`).
  Aperçu des brouillons : `FICHES_PREVIEW=1`, uniquement sur l'environnement Preview de Vercel.

## Déploiement (Vercel)

Choisir `dr-dadoun` comme *Root Directory* du projet.
