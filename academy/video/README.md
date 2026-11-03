# Teaser LIFT by CELLULIFT Academy

- `lift-teaser-muet.mp4` : 27,5 s, 1080×1920 (9:16), sans voix. Fin sur l'appel à l'avant-première (`/academy/avant-premiere`).
- `source/index.html` : l'animation (fonction `render(t)` pilotée image par image) ; `source/render.js` capture 30 images/s avec Playwright, puis :
  `ffmpeg -framerate 30 -i frames/f%04d.jpg -c:v libx264 -crf 18 -pix_fmt yuv420p lift-teaser-muet.mp4`
- Images attendues dans `source/img/` : captures téléphone de l'application (données de démonstration) et photo `hanover-5g.jpg` ; polices dans `source/fonts.css` + `media/` (copiées depuis le build du site).
- Voix prévue (ElevenLabs, voix Clémence) : « Une nouvelle machine. Des réglages à maîtriser. Et vos patients… qui attendent. LIFT by CELLULIFT Academy. La formation de vos machines… sur votre téléphone. Chaque machine, son parcours. Des vidéos, dans l'ordre, à votre rythme. Présentées par nos experts. Protocoles et documents, toujours à portée de main. Bientôt. Inscrivez-vous à l'avant-première, sur cellulift.ma. »
