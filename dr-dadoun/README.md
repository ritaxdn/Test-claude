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

## Formations : ajouter un événement

Les sessions et événements de la page /formations se gèrent dans un Google Sheet, sans toucher au code.

1. Créer un Google Sheet et importer `docs/formations-evenements-modele.csv` (Fichier → Importer).
2. Une ligne par événement :

| Colonne | Contenu |
| --- | --- |
| `debut` | Date de début au format AAAA-MM-JJ (tri, et masquage une fois passée) |
| `dates` | Dates affichées, ex. « 12 – 13 mars 2027 » |
| `formation` | Injectables, Lasers médicaux ou Endolifting (vide pour un autre événement) |
| `titre` | Titre libre (masterclass, congrès…) ; sinon le nom de la formation s'affiche |
| `lieu` | Ville ou lieu |
| `modalites` | Durée, format, nombre de places |
| `statut` | `ouvert` ou `complet` |

3. Fichier → Partager → Publier sur le web → la feuille → **Valeurs séparées par des virgules (.csv)** → Publier, puis copier le lien.
4. Dans Vercel, ajouter la variable `FORMATIONS_SHEET_CSV` avec ce lien (Production et Preview), puis redéployer une fois.

Ensuite, chaque modification du Sheet apparaît sur le site en 5 minutes environ. Un événement passé disparaît tout seul.

## SEO et GEO

- Métadonnées par page (titres et descriptions ciblés « … à Casablanca »), URL canoniques.
- Données structurées schema.org : `MedicalClinic`, `Physician`, horaires, actes (`MedicalProcedure`),
  `FAQPage`, fil d'Ariane, formations (`Course`) — voir `src/lib/seo.ts`.
- `/sitemap.xml`, `/robots.txt` (moteurs et assistants IA explicitement autorisés), `/llms.txt`
  (résumé du site pour les IA, généré depuis le contenu), image de partage `/opengraph-image`.
- Adresse publique du site : variable `NEXT_PUBLIC_SITE_URL` (ex. `https://www.drdadoun.ma`) à définir
  dans Vercel quand le nom de domaine sera branché.

## Déploiement (Vercel)

Choisir `dr-dadoun` comme *Root Directory* du projet.
