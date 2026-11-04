# Teaser LIFT by CELLULIFT Academy

- **`lift-teaser-v3.mp4` : version actuelle** (25 s, 1080×1920, sans son), d'après le storyboard v3 : texte mot par mot, vrais écrans LIFT (téléphone + ordinateur) avec l'élément clé qui sort de l'écran, fin sur la page avant-première. Source : `source/teaser-v3.html`, rendu `source/teaser-v3-render.js`. Les versions précédentes (qui mentionnaient « incluse ») ont été retirées.

- `lift-motion-muet.mp4` : **version motion design** (21,5 s, 9:16), sur le modèle d'une pub « interface en 3D » : caméra plongeante, flou de mouvement, cartes qui se valident en cascade, compteurs. Problème (planning présentiel barré, notifications « 12 patients à reporter », « 3 h 10 de trajet », « session complète ») → solution (leçons validées, 12 leçons / 0 km) → recul sur l'appli → LIFT + « Rejoindre l'avant-première ». Source : `source/motion.html`, rendu `source/mrender.js`.

- `lift-teaser-muet.mp4` : 31 s, 1080×1920 (9:16), sans voix. Fin sur l'appel à l'avant-première (`/academy/avant-premiere`).
- `source/index.html` : l'animation (fonction `render(t)` pilotée image par image) ; `source/render.js` capture 30 images/s avec Playwright, puis :
  `ffmpeg -framerate 30 -i frames/f%04d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p lift-teaser-muet.mp4`
- Images attendues dans `source/img/` : captures téléphone de l'application (données de démonstration) et photo `hanover-5g.jpg` ; polices dans `source/fonts.css` + `media/` (copiées depuis le build du site).
- Voix prévue (ElevenLabs, voix Clémence) : « Fermer votre cabinet une journée. Traverser la ville. Pour une formation… qui tombe toujours au mauvais moment. Et si, cette fois… c'était la formation qui venait à vous ? LIFT by CELLULIFT Academy. Les formations de vos machines, en ligne. Sur votre téléphone. Quand vous voulez. Où vous voulez. À votre rythme. Des vidéos courtes. Des protocoles clairs. Nos experts, à vos côtés. Les inscrits entrent en premier. Rejoignez l'avant-première, sur cellulift.ma. »
- Consigne Cellulift : ne pas écrire que la formation est « incluse avec la machine » dans les vidéos, et ne pas ajouter de noms d'intervenants.
