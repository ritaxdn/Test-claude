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
prénom, n° RPPS, adresse, téléphone, e-mail, biographie, diplômes,
horaires et jours de fermeture du calendrier (`booking`), et le portrait (`src/app/page.tsx`, bloc « Hero »).

Les articles du Journal (le savoir du Dr Dadoun) sont dans `src/content/journal.ts` :
ajouter un objet au tableau `articles` crée automatiquement une nouvelle page
`/journal/<slug>`.

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

## Déploiement (Vercel)

Choisir `dr-dadoun` comme *Root Directory* du projet.
