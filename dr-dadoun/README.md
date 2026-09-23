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
prénom, n° RPPS, adresse, téléphone, e-mail, lien Doctolib, biographie, diplômes,
horaires, et le portrait (`src/app/page.tsx`, bloc « Hero »).

## Déploiement (Vercel)

Choisir `dr-dadoun` comme *Root Directory* du projet.
