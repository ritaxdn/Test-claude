# CELLULIFT Academy — vidéo publicitaire animée

Motion design de 30 s, style « lancement produit SaaS » (l'application flotte en 3D, les éléments clés en sortent vers la caméra, un curseur montre les interactions), qui présente l'interface de CELLULIFT Academy, réalisé avec [Remotion](https://www.remotion.dev) (React + TypeScript, versions épinglées). Ce dossier est indépendant de `academy/app/` et du site cellulift.ma.

## Rendus

| Fichier | Format | Usage |
|---|---|---|
| `out/academy-pub-16x9.mp4` | 1920×1080, 30 i/s, 30 s, H.264 + AAC | YouTube, site, LinkedIn, écran |
| `out/academy-pub-9x16.mp4` | 1080×1920, 30 i/s, 30 s, H.264 + AAC | Reels, Stories, TikTok (mise en page recomposée) |

Les `.mp4` ne sont pas versionnés (`out/` est dans `.gitignore`) : relancez le rendu pour les obtenir.

## Relancer le rendu

```bash
cd academy/video
npm install
npm run render          # génère le son puis rend les deux formats
npm run render:16x9     # ou un seul
npm run render:9x16
npm run studio          # aperçu interactif dans le navigateur
npm run stills          # images fixes de chaque plan dans stills/ (vérification)
```

Remotion télécharge un Chrome headless au premier rendu. Le son est généré par `npm run audio` (Python 3 + numpy).

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
| 0–2,5 s | Logo CELLULIFT, tracé ECG, « Academy » | `SceneLogo` |
| 2,5–5 s | « Votre machine est installée. » → « Votre formation commence. » (mots à ressort) | `SceneHook` |
| 5–9,5 s | 01 Invitation : l'écran de connexion arrive en 3D, la carte sort, le curseur saisit le mot de passe et clique « Créer mon accès » | `SceneInvite` |
| 9,5–13,5 s | 02 Tableau de bord : la machine HANOVER 5G (balayage scan line) puis son parcours sortent, clic sur « Commencer » | `SceneDashboard` |
| 13,5–18,5 s | 03 Leçon : le lecteur sort, « Présenté par Dr Mohamed Dadoun », la leçon 1 se coche | `SceneLesson` |
| 18,5–22,5 s | 04 Les fiches PDF sortent du dossier « Protocoles », progression 33 → 67 → 100 %, « Formation terminée » | `SceneProgress` |
| 22,5–26,5 s | 05 Vue admin en 3D, la ligne du médecin sort : machine → parcours → 100 % → Terminée | `SceneAdmin` |
| 26,5–30 s | Signature + `academy.cellulift.ma` | `SceneSignature` |

Le découpage (début et fin de chaque plan) est dans `src/Ad.tsx`.

**Motion graphics** : fenêtre de l'app en perspective avec profondeur de champ, cartes qui sortent avec un ressort, curseur animé (clics avec onde), titres cinétiques mot par mot avec filet arc-en-ciel, ligne arc-en-ciel lumineuse qui balaie l'écran à chaque transition, éclats arc-en-ciel aux moments clés (accès créé, leçon cochée, formation terminée), scan line sur les visuels.

## Son

Bande son **100 % synthétisée** par `scripts/make-audio.py` (aucune musique protégée) :
- `public/audio/music.wav` : nappe musicale à **120 BPM** ; tous les changements de plan tombent sur un temps ;
- `public/audio/sfx.wav` : bruitages calés à l'image près — whoosh à chaque transition, « pop » quand une carte sort, clics du curseur, frappe du mot de passe, scintillement verre quand une leçon se coche et à « Formation terminée », montée + impact sur la signature.

Les repères des bruitages sont dans **`scripts/cues.json`** (en secondes). Si vous modifiez le minutage d'un plan, mettez-les à jour puis relancez `npm run render`.

Pour remplacer la musique par une musique **libre de droits fournie par CELLULIFT** (idéalement à 120 BPM) :
1. déposez le fichier dans `public/audio/` (ex. `public/audio/musique.mp3`) ;
2. dans `src/texts.ts`, mettez `MUSIC_FILE = "audio/musique.mp3"` ;
3. relancez le rendu. Les bruitages restent.

Une voix off se dépose de la même façon : ajoutez un `<Audio>` dans `src/Ad.tsx`. Pas de bip ni de son cardiaque : la ligne ECG est un signal de marque uniquement.

## Charte

Direction « Nacre & verre » : jetons et classes repris de `academy/app/src/app/globals.css` (`src/styles.ts`), logo repris de `src/components/brand/Logo.tsx`. Polices Google Fonts (licence OFL) embarquées dans `public/fonts/` : Archivo, Instrument Sans, JetBrains Mono, Cormorant Garamond (logo uniquement). Photos des machines copiées depuis `academy/prototype/img/`.
