# CELLULIFT Academy — vidéo publicitaire (HyperFrames)

Version **HyperFrames** (HTML + GSAP rendu en vidéo) de la vidéo de 30 s, portée depuis la version Remotion (`../video/`) en suivant la méthode `remotion-to-hyperframes`. Même histoire, mêmes plans, même son.

| Projet | Format | Rendu |
|---|---|---|
| `16x9/` | 1920×1080, 30 i/s, 30 s | `out/academy-pub-16x9.mp4` |
| `9x16/` | 1080×1920, 30 i/s, 30 s (mise en page recomposée) | `out/academy-pub-9x16.mp4` |

HyperFrames n'accepte qu'une composition racine par projet : chaque format est donc un projet. Les scènes de `compositions/` sont les mêmes fichiers dans les deux projets ; la mise en page s'adapte à l'orientation (`@media (orientation: portrait)` dans `assets/academy.css` et dans les scènes). **Une modification de scène doit être reportée dans les deux projets.**

## Relancer

```bash
cd academy/video-hf/16x9          # ou 9x16
python3 scripts/make-audio.py     # génère assets/audio/music.wav et sfx.wav (numpy)
npx hyperframes check             # contrôle : lint, exécution, mise en page, contraste, son
npx hyperframes preview           # aperçu Studio dans le navigateur (édition possible)
npx hyperframes render --quality delivery -o ../out/academy-pub-16x9.mp4
```

Le projet peut aussi s'ouvrir dans l'application de bureau HyperFrames (`npx hyperframes open`).

## Structure

- `index.html` : racine (fond nacré, 8 scènes, transitions, musique et bruitages).
- `compositions/` : `logo`, `hook`, `invite`, `dashboard`, `lesson` (plan « parcours » : choix parmi les machines du médecin, puis le parcours en étapes), `progress`, `done`, `signature` (une scène par plan) et `wipes` (balayages arc-en-ciel aux transitions).
- `assets/academy.css` : jetons « Nacre & verre » repris de `academy/app/src/app/globals.css`.
- `assets/fonts/`, `assets/img/` : polices (OFL) et photos des machines.
- `scripts/make-audio.py`, `scripts/cues.json` : bande son synthétisée, bruitages calés sur l'image.

## Textes

Les textes sont directement dans les fichiers de `compositions/` (modifiables aussi dans le Studio). Règles : voir `academy/CLAUDE.md` et `../video/README.md` (présentateurs réels, médecins fictifs, pas de promesse médicale, français et vouvoiement).

## Contrôle

`npx hyperframes check` : 0 erreur dans les deux formats. Avertissements restants, acceptés : petits textes d'interface dans la fenêtre floue d'arrière-plan (décor), filigrane volontairement discret dans le lecteur, message « Bravo… » long (texte réel de l'app).
