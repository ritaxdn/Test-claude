# CELLULIFT Academy — vidéo publicitaire animée

Motion design de 30 s qui présente l'interface de CELLULIFT Academy, réalisé avec [Remotion](https://www.remotion.dev) (React + TypeScript, versions épinglées). Ce dossier est indépendant de `academy/app/` et du site cellulift.ma.

## Rendus

| Fichier | Format | Usage |
|---|---|---|
| `out/academy-pub-16x9.mp4` | 1920×1080, 30 i/s, 30 s, H.264 | YouTube, site, LinkedIn, écran |
| `out/academy-pub-9x16.mp4` | 1080×1920, 30 i/s, 30 s, H.264 | Reels, Stories, TikTok (mise en page recomposée) |

Les `.mp4` ne sont pas versionnés (`out/` est dans `.gitignore`) : relancez le rendu pour les obtenir.

## Relancer le rendu

```bash
cd academy/video
npm install
npm run render          # les deux formats
npm run render:16x9     # ou un seul
npm run render:9x16
npm run studio          # aperçu interactif dans le navigateur
npm run stills          # images fixes de chaque plan dans stills/ (vérification)
```

Remotion télécharge un Chrome headless au premier rendu.

## Modifier les textes

Tous les textes (accroche, légendes, médecin fictif, machine, leçons, PDF, tableau admin, signature) sont dans **`src/texts.ts`**. Modifiez-les puis relancez le rendu. Un mot de chaque titre est mis en dégradé irisé : c'est le champ `iri`.

Règles à respecter (voir `academy/CLAUDE.md`) :
- présentateurs réels uniquement (Dr Mohamed Dadoun, Meryem Belkhalfi, Imane Souali), sans inventer de titres ;
- médecins affichés = personnes fictives ;
- aucune promesse de résultat médical, aucune protection anti-copie présentée comme absolue ;
- textes en français, vouvoiement.

## Plans

| Temps | Plan | Composant (`src/scenes.tsx`) |
|---|---|---|
| 0–3 s | Logo CELLULIFT, tracé ECG, « Academy » | `SceneLogo` |
| 3–7 s | « Votre machine est installée. Votre formation commence. » | `SceneHook` |
| 7–12 s | Invitation (création d'accès) puis tableau de bord : machine HANOVER 5G + parcours | `SceneDashboard` |
| 12–18 s | Leçon : lecteur vidéo, Dr Mohamed Dadoun, coche de la leçon 1 | `SceneLesson` |
| 18–22 s | Progression 33 → 67 → 100 %, « Formation terminée », PDF | `SceneProgress` |
| 22–26 s | Vue admin : médecin → machine → parcours → progression → statut | `SceneAdmin` |
| 26–30 s | Signature + `academy.cellulift.ma` | `SceneSignature` |

Le découpage (début et fin de chaque plan) est dans `src/Ad.tsx`.

## Musique

La piste son est vide. Pour ajouter une musique **libre de droits fournie par CELLULIFT** :
1. déposez le fichier dans `public/audio/` (ex. `public/audio/musique.mp3`) ;
2. dans `src/texts.ts`, mettez `MUSIC_FILE = "audio/musique.mp3"` ;
3. relancez le rendu.

Une voix off se dépose de la même façon : ajoutez un second `<Audio>` dans `src/Ad.tsx`. Pas de bip ni de son cardiaque : la ligne ECG est un signal de marque uniquement.

## Charte

Direction « Nacre & verre » : jetons et classes repris de `academy/app/src/app/globals.css` (`src/styles.ts`), logo repris de `src/components/brand/Logo.tsx`. Polices Google Fonts (licence OFL) embarquées dans `public/fonts/` : Archivo, Instrument Sans, JetBrains Mono, Cormorant Garamond (logo uniquement). Photos des machines copiées depuis `academy/prototype/img/`.
