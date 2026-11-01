# CELLULIFT Academy — vidéo publicitaire

Film en motion design de 30 s qui présente l'interface de CELLULIFT Academy. Il est fait avec [Remotion](https://www.remotion.dev/) (React + TypeScript, versions épinglées dans `package.json`). Ce dossier est indépendant de `academy/app/` : il ne le modifie pas, il n'a besoin ni de base de données ni de réseau pendant le rendu, et les polices sont servies en local.

Les écrans ne sont pas des captures : ils sont recréés en composants React à partir des jetons de `academy/app/src/app/globals.css` (direction « Nacre & verre »). Ce choix garde un rendu net à n'importe quelle échelle de zoom et rend l'animation de chaque élément possible.

## Livrables

| Fichier | Format |
|---|---|
| `out/academy-pub-16x9.mp4` | 1920 × 1080, 30 i/s, 30 s, H.264 |
| `out/academy-pub-9x16.mp4` | 1080 × 1920, 30 i/s, 30 s, H.264 (mise en page recomposée pour Reels/Stories) |

`out/` n'est pas versionné (fichiers lourds) : relancez le rendu pour les régénérer.

## Plans

| Temps | Plan | Fichier |
|---|---|---|
| 0–3 s | Logo CELLULIFT, tracé ECG (1,8 s), « Academy » | `src/scenes/Intro.tsx` |
| 3–7 s | Accroche « Votre machine est installée. Votre formation commence. » | `src/scenes/Intro.tsx` |
| 7–9 s | 01 — Invitation (création de l'accès) | `src/scenes/Onboarding.tsx` |
| 9–12 s | 02 — Tableau de bord : machine HANOVER 5G + parcours | `src/scenes/Onboarding.tsx` |
| 12–18 s | 03 — Page leçon : lecteur, Dr Mohamed Dadoun, coches qui se remplissent | `src/scenes/Lesson.tsx` |
| 18–22 s | 04 — Documents PDF, progression 33 % → 100 %, « Formation terminée » | `src/scenes/Outcome.tsx` |
| 22–26 s | 05 — Vue admin : médecin → machine → parcours → progression → statut | `src/scenes/Outcome.tsx` |
| 26–30 s | Signature + academy.cellulift.ma | `src/scenes/Outcome.tsx` |

Le découpage précis (en images) est dans `src/timeline.ts`.

## Relancer le rendu

```bash
cd academy/video
npm install
npm run studio        # aperçu interactif dans le navigateur (http://localhost:3000)
npm run stills        # une image fixe par plan et par format dans out/stills/ (contrôle rapide)
npm run render        # les deux vidéos dans out/
```

Remotion télécharge son propre Chrome au premier rendu. Si ce téléchargement est bloqué (réseau filtré), indiquez un Chrome déjà installé :

```bash
REMOTION_BROWSER=/usr/bin/google-chrome npm run render
```

## Changer les textes

Tous les textes sont dans `src/content.ts` : accroche, repères d'étape, médecin fictif, machine, parcours, leçons, documents, tableau admin, signature. Modifiez-les puis relancez `npm run stills` pour vérifier, et `npm run render`.

Règles à garder (voir `academy/CLAUDE.md`) :
- médecins et clients affichés = personnes fictives ;
- présentateurs réels uniquement (Dr Mohamed Dadoun, Meryem Belkhalfi, Imane Souali), sans inventer de titre : seul celui du Dr Dadoun est connu ;
- machines = noms réels du catalogue ;
- interface en français, vouvoiement ;
- aucune promesse de résultat médical ; le filigrane est présenté comme un filigrane, pas comme une protection anti-copie.

Couleurs et polices : `src/brand.ts` (copie des jetons de `globals.css`). Si la charte change dans l'app, reportez la modification ici.

## Musique

La piste son est vide. Pour ajouter une musique libre de droits fournie par Cellulift :
1. placez le fichier dans `public/` (ex. `public/musique.mp3`) ;
2. dans `src/content.ts`, mettez `MUSIC_FILE = "musique.mp3"` ;
3. relancez le rendu.

Une voix off peut s'ajouter de la même façon (une balise `<Audio>` de plus dans `src/Pub.tsx`).
