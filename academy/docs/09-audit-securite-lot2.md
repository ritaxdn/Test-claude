# 09 — Revue de sécurité du lot 2 (avant ouverture commerciale)

> 5 nov. 2026 · branche `claude/lift-formations-acces` · **rien n'est déployé, la production n'est pas modifiée.**
> Méthode : relecture du code (application et base), vérification de chaque soupçon en conditions réelles (application lancée avec le compte `academy_app`, navigateur réel), puis revue indépendante du code par un second relecteur (§11).
> Les défauts corrigés le sont sur la branche, avec un test chacun. Résultats : **MVP 32/32, Formations 16/16, Sécurité 13/13, Parcours commercial 22/22**.

## 1. Synthèse

| Niveau | Constat | État |
|---|---|---|
| **Critique** | Les liens de création ou de réinitialisation du mot de passe passaient dans l'adresse des pages admin (`?lien=…`). Ils finissaient donc dans l'historique du navigateur et dans les journaux du serveur (Vercel). Quiconque y a accès pouvait **prendre le contrôle d'un compte invité**. | **Corrigé** |
| **Critique (juridique)** | Les traitements de données personnelles n'ont pas de base juridique validée : déclaration ou autorisation CNDP, transferts hors du Maroc, CGV, politique de confidentialité. | **À valider par un juriste avant ouverture** (§10) |
| Important | Une demande publique pouvait **remplacer en silence** la profession et le n° d'Ordre d'un compte existant déjà vérifié. | Corrigé |
| Important | Le paiement était validé sur simple saisie d'une référence : **ni contrôle du montant, ni unicité du virement**. | Corrigé |
| Important | Aucune preuve que le demandeur possède l'adresse e-mail saisie : fausses demandes, et envoi d'e-mails vers des adresses de tiers. | Corrigé (confirmation obligatoire) |
| Important | Le nom saisi par le visiteur était repris dans un e-mail envoyé depuis le domaine CELLULIFT vers une adresse non vérifiée : **hameçonnage possible**. | Corrigé |
| Important | Justificatifs **sans échéance de suppression** si la demande n'était jamais traitée ou était annulée ; fichier orphelin si l'enregistrement échouait. | Corrigé |
| Important | Le journal conservait **sans limite** une copie complète des demandes (e-mail, téléphone, n° d'Ordre, message). | Corrigé (minimisation + nettoyage de l'existant) |
| Important | Limite de fréquence contournable : l'IP était lue dans un en-tête falsifiable, et aucun plafond global n'existait. | Corrigé |
| Important | Un admin à la fois vérificateur peut accepter une demande **et** valider le paiement seul (pas de séparation des tâches). | **À décider** (§5) |
| Important | Lecture DRM et lecture signée Mux non encore actives en production ; compartiments de stockage à confirmer privés. | Configuration avant ouverture (§7) |
| Mineur | Double clic sur une action admin : message d'erreur trompeur (données intactes). | Corrigé |
| Mineur | Échecs d'envoi d'e-mail non journalisés. | Corrigé |
| Mineur | Pas de politique de sécurité du contenu (CSP) globale ; empreinte d'IP salée par une valeur par défaut si `SESSION_SECRET` manque. | Recommandé (§9) |

## 2. Justificatifs : accès, stockage, suppression, traçabilité
**Vérifié :**
- consultation par une route serveur réservée aux **administrateurs actifs ayant le droit de vérification** (sinon 401 / 403), chaque consultation est **journalisée** et renvoie 410 après suppression ;
- stockage hors de la partie publique (local) ou dans un compartiment Supabase **dédié** (`lift-justificatifs`), via des URL signées de 60 s ;
- type contrôlé sur le contenu réel (PDF, JPEG, PNG ; pas de SVG), 5 Mo maximum, empreinte SHA-256 ;
- réponse servie avec `CSP: sandbox` et `nosniff`.

**Corrigé :**
- le fichier est supprimé **au plus tard 90 jours après le dépôt**, même si la demande n'est jamais traitée, et **30 jours après la décision** (acceptation, refus ou annulation) ;
- le fichier déposé est effacé si l'enregistrement de la demande échoue (plus de fichier orphelin) ;
- les justificatifs existants ont reçu une échéance.

**Avant ouverture :**
- créer le compartiment `lift-justificatifs` **privé**, sans aucune politique d'accès public ;
- programmer `npm run purge:justificatifs` une fois par jour, et surveiller son exécution.

## 3. Vérification effective des virements
**Corrigé :**
- pour passer une commande à « payée », il faut maintenant la **référence du virement** et le **montant reçu**. Ce montant doit être **égal** au montant dû : la base refuse sinon, et un virement partiel n'ouvre rien ;
- **une même référence de virement ne valide jamais deux commandes** (index unique en base) ;
- le passage à « payée » est atomique avec la création de l'accès, et un double clic ne crée rien de plus.

**Inchangé (vérifié) :**
- seul un administrateur actif valide un paiement, et la base le revérifie ;
- un accès « achat » n'existe que sur une commande payée du même compte et de la même formation ;
- le remboursement intégral révoque l'accès ;
- les statuts sont irréversibles.

**Limite assumée :** la vérification reste humaine. LIFT ne lit pas le relevé bancaire, et la personne qui valide atteste avoir vu le virement sur le compte. Pour réduire ce risque, voir la séparation des tâches au §5, et un rapprochement mensuel des commandes « payées » avec le relevé, par la comptabilité.

## 4. Fraudes, doublons, créations abusives, accès croisés
**Corrigé :**
- **confirmation de l'adresse e-mail obligatoire** : un lien valable 48 h est envoyé, et c'est un bouton (pas un simple clic sur le lien) qui confirme, pour qu'un antivirus de messagerie ne confirme pas à la place du destinataire. **Une demande non confirmée ne peut pas être acceptée** (refus de la base) ;
- **doublons refusés** : une demande en cours ou un accès actif existe déjà pour la même adresse et la même formation ;
- **identité protégée** : si l'adresse correspond à un compte existant dont la qualification vérifiée est différente (profession ou n° d'Ordre), l'écran le signale et l'acceptation est bloquée. Un compte administrateur ne peut jamais être repris ;
- **limites** : 5 demandes par heure par connexion (IP lue dans l'en-tête posé par l'hébergeur), 3 par jour par adresse et par formation, **100 par heure au total** ;
- **nom et n° d'Ordre** limités aux caractères attendus (pas de lien ni de texte détourné).

**Vérifié :**
- aucun compte n'est créé par le formulaire : seul un vérificateur en crée un, en acceptant une demande ;
- prix, devise et formation sont relus en base (jamais pris du formulaire) ;
- la profession est revérifiée côté serveur et par la base ;
- les accès croisés sont fermés (tests S02 à S04) ;
- « Mon compte » n'affiche que ses propres données ;
- aucun identifiant de demande n'est exposé publiquement.

**À noter :** le pays est déclaré par le demandeur et détermine la devise. Le vérificateur doit contrôler qu'il correspond à l'inscription à l'Ordre ; un rappel est affiché sur l'écran.

## 5. Permissions des vérificateurs et des administrateurs
**Vérifié :**
- accepter ou refuser une demande, vérifier une qualification et consulter un justificatif exigent le **droit de vérification**, contrôlé par la base ;
- le droit est accordé par un autre administrateur, jamais à soi-même, et tracé ;
- les 14 actions admin du MVP et les 10 actions commerciales vérifient le rôle côté serveur ;
- un compte désactivé perd ses sessions ;
- un administrateur non vérificateur ne peut pas ouvrir une formation à une personne non vérifiée.

**À décider (important) : la séparation des tâches.** Aujourd'hui, une même personne vérificatrice peut accepter une demande, valider le paiement et offrir un accès. Deux options :
1. **Recommandée dès que l'équipe compte au moins deux personnes** : la validation d'un paiement et l'accès offert doivent être faits par une autre personne que celle qui a accepté la demande. C'est un contrôle de quelques lignes en base, que je peux ajouter.
2. Garder l'organisation actuelle, avec le rapprochement mensuel décrit au §3.

**Recommandé :**
- activer la double authentification pour les administrateurs (pas encore disponible) ;
- revoir chaque trimestre la liste des vérificateurs.

## 6. Liens de création de mot de passe et e-mails
**Corrigé :**
- les liens ne sont plus jamais dans l'adresse d'une page. Ils sont montrés une seule fois à l'admin, par un cookie `httpOnly` limité à `/admin`, valable 2 minutes ;
- les pages qui portent un jeton (`/invitation`, `/reinitialiser`, `/formations/confirmer`) n'envoient aucun référent et ne sont jamais mises en cache ;
- l'e-mail envoyé à une adresse **non encore confirmée** ne contient **aucun texte saisi par le visiteur** ;
- les échecs d'envoi sont journalisés, sans le contenu.

**Vérifié :**
- jetons aléatoires de 256 bits ; **seule leur empreinte est stockée** ; usage unique ;
- invitation valable 14 jours, réinitialisation 1 heure, confirmation 48 heures ;
- un nouveau lien annule le précédent, et un compte désactivé ne peut pas utiliser un lien ;
- les liens sont construits avec `APP_URL`, jamais avec l'en-tête Host (pas d'empoisonnement de lien) ;
- les e-mails échappent tout le contenu HTML.

**Avant ouverture :** vérifier le domaine d'envoi dans Resend (SPF, DKIM, DMARC) pour que les e-mails LIFT ne tombent pas en indésirables et ne puissent pas être usurpés.

## 7. Accès directs aux vidéos, documents et leçons
**Vérifié** (tests S02 à S13 et C03) :
- pages, leçons, vidéos, documents et progression revérifient les droits **à chaque requête** ;
- une leçon verrouillée, un mauvais slug, un identifiant inconnu ou mal formé, une tentative de remonter les dossiers ou une plage d'octets abusive sont tous refusés ;
- les fiches publiques ne donnent aucun lien vers une vidéo, un document ou une leçon ;
- le plein écran garde le filigrane.

**Avant ouverture :**
- politique de lecture **« signed »** sur chaque vidéo Mux (sinon le jeton n'est pas exigé) ;
- DRM activé (demandes Mux et Apple en cours de ton côté) ;
- compartiment `academy-documents` **privé**.

## 8. Erreurs, interruptions, opérations partielles
**Vérifié et corrigé :**
- acceptation et paiement sont des **transactions complètes** : tout est enregistré, ou rien ;
- les e-mails partent après l'enregistrement. Si l'envoi échoue, l'admin le voit et dispose du lien ou de la référence à transmettre ;
- double clic et actions simultanées : la deuxième action est refusée proprement (contrôle du nombre de lignes modifiées, verrou sur le compte pendant l'acceptation) ;
- les erreurs de la base sont traduites en messages lisibles, sans détail technique, et le détail est journalisé côté serveur ;
- une demande ou un justificatif dont l'enregistrement échoue ne laisse aucun fichier.

**Reste :**
- si le lien d'invitation n'a pas pu être généré après un paiement, l'admin en génère un nouveau depuis la fiche du professionnel (bouton existant) ;
- la tâche de suppression des justificatifs doit être surveillée (une alerte si elle ne tourne plus).

## 9. Points mineurs recommandés
- Ajouter une **CSP** globale (scripts limités au site et au lecteur Mux). Le site n'injecte jamais de HTML brut, donc le risque actuel est faible.
- Rendre **`SESSION_SECRET` obligatoire** en production (sel de l'empreinte d'IP).
- **Expirer** automatiquement les demandes non confirmées après 48 h, et en vider les données au bout de 30 jours.

## 10. Données personnelles : ce qui exige une validation juridique
**Bloquant avant ouverture.** Je ne suis pas juriste : ces points sont à faire valider (loi marocaine 09-08, CNDP ; RGPD pour les professionnels de l'Union européenne).

| # | Point | Ce que fait LIFT aujourd'hui | À valider |
|---|---|---|---|
| J1 | **Formalités CNDP** (déclaration ou autorisation) | — | Dépôt avant l'ouverture : vérification de qualification professionnelle, justificatifs, données de paiement, suivi pédagogique |
| J2 | **Transferts hors du Maroc** | Base Supabase en Union européenne (Francfort), hébergement Vercel, e-mails Resend, vidéo Mux (prestataires américains) | Autorisation de transfert, clauses contractuelles avec chaque prestataire |
| J3 | **Base juridique** de chaque traitement | Case de consentement pour le traitement de la demande ; case **séparée et non cochée** pour la prospection | Choix de la base (mesures précontractuelles, contrat, intérêt légitime, consentement), texte exact des mentions |
| J4 | **Mentions d'information et politique de confidentialité** | Mention courte sous le formulaire | Document complet : finalités, durées, destinataires, droits, contact |
| J5 | **Durées de conservation** | Justificatifs : 30 jours après la décision, 90 jours maximum. Demandes, commandes et journal : conservés | Durée par catégorie, y compris les obligations comptables pour les commandes et factures |
| J6 | **Droits des personnes** (accès, rectification, opposition, suppression) | Le journal et les commandes ne se suppriment pas (traçabilité) | Procédure d'**anonymisation** à la place de la suppression, délais de réponse, contact |
| J7 | **CGV** | Version « brouillon-2026-11 » enregistrée avec chaque consentement | CGV finales : accès, durée, remboursement intégral et **partiel**, rétractation (vente à distance), responsabilité pédagogique (« n'habilite pas à pratiquer un acte ») |
| J8 | **Prospection commerciale** (synchronisation CRM, §12) | Consentement distinct, horodaté | Texte du consentement, preuve, désinscription en un clic |
| J9 | **Vérification des qualifications** | N° d'Ordre et justificatif, vus par les vérificateurs | Légitimité de la collecte, accès restreint, éventuelle vérification auprès de l'Ordre |

## 11. Revue indépendante
Une seconde relecture du code, sans connaissance de mes conclusions, a été menée sur le même périmètre. Ses constats et leur traitement sont dans l'annexe ci-dessous.

## 12. CRM : synchronisation proposée (rien n'est envoyé aujourd'hui)
Voir `docs/10-sync-crm-prospects.md`.

## 13. Corrections avant ouverture : liste de contrôle
**Fait sur la branche (testé) :**
- [x] liens de mot de passe hors des adresses de page ;
- [x] confirmation de l'e-mail ;
- [x] identité protégée ;
- [x] montant reçu et virement unique ;
- [x] contenu des e-mails ;
- [x] échéances des justificatifs ;
- [x] minimisation du journal ;
- [x] limites de fréquence fiables ;
- [x] doubles clics ;
- [x] journalisation des échecs d'envoi.

**À faire par Cellulift :**
- [ ] validation juridique J1 à J9 ;
- [ ] CGV et politique de confidentialité ;
- [ ] décision sur la séparation des tâches (§5) ;
- [ ] désignation des vérificateurs.

**À faire à la mise en ligne (technique) :**
- [ ] sauvegarde, puis migrations 002 → 005 sur Supabase ;
- [ ] compartiments privés ;
- [ ] Mux en lecture signée, puis DRM ;
- [ ] domaine Resend authentifié ;
- [ ] `SESSION_SECRET`, `LIFT_*`, `SUPABASE_PROOF_BUCKET` ;
- [ ] tâche quotidienne de suppression des justificatifs, avec alerte.
