# CELLULIFT Academy — application (MVP)

Application réelle (pas le prototype) : Next.js 16, TypeScript, PostgreSQL. Elle vit dans ce sous-dossier et se déploie comme un site séparé (`academy.cellulift.ma`), indépendamment de cellulift.ma.

## Ce que fait le MVP

**Médecin :** invitation → création du compte → connexion → ses machines → le parcours de chaque machine → vidéos dans l'ordre (une leçon s'ouvre quand la précédente est vue à 90 %, sans pouvoir avancer dans la vidéo) → documents → progression → formation terminée.

**Cellulift (admin) :** liste des médecins → machine(s) → parcours assigné → progression → terminé / non terminé (filtres, détail par leçon). Plus le nécessaire pour alimenter l'Academy : inviter un médecin avec sa machine, ajouter ou retirer une machine, renvoyer un lien, désactiver un accès, créer machines, parcours, modules, leçons et documents.

Hors MVP (voir `../docs/`) : Open Academy, paiement, quiz, certificats, synchronisation CRM automatique.

## Démarrer en local

```bash
cd academy/app
npm install
cp .env.example .env.local          # puis renseigner DATABASE_URL
npm run db:schema                   # crée les tables (relançable sans risque)
npm run db:seed                     # parcours HANOVER 5G d'exemple (développement uniquement)
npm run media:sample                # 3 vidéos et un PDF d'exemple dans private-media/ (ffmpeg requis)
npm run admin:create -- prenom@cellulift.ma "Prénom Nom"   # affiche le lien pour créer le mot de passe
npm run dev                         # http://localhost:3100
```

## Test de bout en bout

Avec l'application démarrée (`npm run build && npm start`) et la base d'exemple chargée :

```bash
DATABASE_URL=… BASE_URL=http://localhost:3100 npm run test:e2e
```

21 étapes, une par critère du MVP : invitation, création du compte (lien à usage unique), connexion, machines, ordre imposé (URL directe et vidéo verrouillées refusées), anti-saut (déclarer la fin ne valide pas ; avance rapide bloquée), documents, progression, formation terminée, vue admin, filtres, détail par leçon, cloisonnement admin, création de contenu avec envoi de fichier, ajout d'une deuxième machine.

## Mise en production (à faire par Cellulift)

| Élément | Service proposé | Variable(s) |
|---|---|---|
| Base de données | Nouveau projet Supabase (région UE), séparé du CRM | `DATABASE_URL` (chaîne « pooler » en mode transaction) |
| Vidéos | Mux, avec lecture signée (+ DRM si souscrit) | `VIDEO_PROVIDER=mux`, `MUX_SIGNING_KEY_ID`, `MUX_SIGNING_PRIVATE_KEY_BASE64`, `MUX_DRM_ENABLED` |
| Documents | Supabase Storage, bucket **privé** | `STORAGE_PROVIDER=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BUCKET` |
| E-mails | Resend (déjà utilisé par le site du Dr Dadoun), domaine cellulift.ma vérifié | `RESEND_API_KEY`, `MAIL_FROM` |
| Hébergement | Vercel, nouveau projet, dossier racine `academy/app` | `APP_URL=https://academy.cellulift.ma` |

Étapes : créer les comptes → renseigner les variables dans Vercel → `npm run db:schema` sur la base de production (sans `db:seed`) → `npm run admin:create` → charger les vidéos dans Mux et coller leur *playback ID* dans chaque leçon (admin › Parcours).

## Sécurité : ce qui est en place, et ce qui ne l'est pas

- **En place et testé :** mots de passe hachés (scrypt), sessions côté serveur (cookie httpOnly, SameSite), liens d'invitation et de réinitialisation à usage unique et à durée limitée (seule leur empreinte est stockée), limitation des tentatives de connexion, chaque page / vidéo / document vérifie le droit d'accès côté serveur, ordre des leçons imposé côté serveur, progression qui ne peut pas avancer plus vite que le temps réel, journal d'audit des actions admin, en-têtes de sécurité.
- **Écrit mais pas encore testé faute de comptes :** lecture Mux signée et DRM, stockage Supabase, envoi Resend. À valider dès que les comptes existent.
- **Filigrane :** le nom et l'e-mail du médecin défilent sur la vidéo. C'est une surcouche dissuasive (elle rend une fuite traçable) ; elle n'empêche pas une capture d'écran. Le fournisseur « local » sert les fichiers vidéo depuis le disque : il est réservé au développement, la production doit utiliser Mux.
- **Limites connues :** supprimer un document le retire de l'Academy mais pas encore du stockage ; la limitation des tentatives est par adresse e-mail (pas encore par adresse IP).
