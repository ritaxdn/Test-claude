# Benchmark vocal Cellulift — protocole

**Version 1 — gelée le 18 octobre 2026** (référence figée : branche Git `protocole-v1`, commit `46384c2`). Ce document ne change plus : toute évolution passera par une version 2 datée, et le harness n'évolue que pour corriger un bug constaté à l'usage. Rien n'est branché en production.

## 1. Ce que l'on cherche

On ne cherche pas le moteur qui retranscrit le mieux chaque mot. On cherche l'architecture qui comprend le mieux l'information commerciale d'un récit naturel en darija et en français, et qui laisse le moins de travail au commercial après qu'il a parlé.

La question finale est donc : **combien d'effort reste-t-il au commercial après avoir parlé ?**

Trois principes guident tout le protocole :

1. **Mieux vaut « je ne suis pas sûr » qu'une invention.** Une information affirmée alors qu'elle n'a jamais été dite pèse plus lourd qu'un oubli.
2. **Toutes les erreurs n'ont pas le même prix.** Se tromper sur « 240 000 MAD », « Candela », « Dr Amrani » ou « mardi prochain » coûte bien plus cher qu'un mot de liaison mal transcrit. Les résultats sont donc donnés par type de donnée, jamais fondus dans un score unique.
3. **On mesure séparément l'oreille et la compréhension.** La couche A (audio → texte) et la couche B (texte + contexte CRM → informations commerciales) sont évaluées à part, pour savoir où se trouve le problème.

Aucun fournisseur n'est choisi d'avance. Le harness compare des architectures, et chaque fournisseur s'y branche de la même façon.

## 2. Architectures à comparer

| Code | Architecture | Ce qu'elle teste |
|---|---|---|
| E0 | Transcription humaine (fiche de référence) → extraction | Plafond de la couche B : ce qu'on obtiendrait avec une transcription parfaite |
| A | STT multilingue généraliste → extraction LLM | La voie la plus simple |
| B | STT spécialisé darija / arabe maghrébin → extraction LLM | Gain d'un modèle spécialisé |
| C | Modèle audio natif : audio + contexte → JSON | Éviter la perte d'information entre l'oreille et la compréhension |
| D | STT → traduction en français → extraction | Aider l'extraction en normalisant la langue |
| F | Deux STT (darija et français) combinés → extraction | Robustesse au code-switching |

Chaque ligne peut accueillir plusieurs fournisseurs (A1, A2…). Les candidats se déclarent dans `config/architectures.json`. On en garde **au plus 6 à 8 configurations** pour que l'analyse reste lisible.

Règles d'équité :

- même consigne d'extraction pour tous (`prompts/extraction.md`) ; si un fournisseur impose un autre format, sa traduction de la consigne est versionnée à côté ;
- même contexte CRM, mêmes fiches, mêmes vocaux ;
- paramètres « déterministes » quand ils existent (température 0) ;
- sur 6 vocaux tirés au hasard, chaque configuration est lancée deux fois pour mesurer sa variabilité ;
- les clés d'API passent par des variables d'environnement et n'apparaissent jamais dans les résultats.

## 3. Le dataset

### Taille et répartition

Environ **30 vocaux**, de **3 à 5 commerciaux**, de **45 secondes à 3 minutes**. Le plan détaillé est dans `dataset/manifeste.csv`, et `python3 harness/bench.py couverture` vérifie qu'il respecte les cibles de `config/couverture.json`.

| Dimension | Répartition prévue |
|---|---|
| Langue | 9 darija dominante · 8 français dominant · 13 code-switching important |
| Environnement | 10 calme · 8 voiture stationnée · 6 rue · 6 showroom |
| Situations (au moins 3 vocaux chacune) | nom de médecin, nom de clinique, machine Cellulift, concurrent, montant, montant « en millions » (centimes), date précise, date relative, financement, plusieurs décideurs, objection prix, objection technique, visite très positive, visite négative, récit incomplet, sans prochaine étape, nouveau contact, visite non prévue |

Le piège des **« millions »** mérite une ligne à lui seul : en darija, « 28 مليون » veut souvent dire 280 000 MAD (28 millions de centimes), et « ألف ريال » 50 MAD. Une erreur ici multiplie un montant par 100.

### Deux sources de vocaux

- **Environ 20 récits de vraies visites.** Le commercial raconte une visite réelle, faite dans les dernières 48 heures, comme à son superviseur. Pour protéger les clients, il remplace le nom du client et des personnes par des noms fictifs tirés de `dataset/noms_fictifs.csv` (réalistes et marocains, à vérifier contre la base pour qu'aucun ne corresponde à un vrai client). Les machines, les concurrents, les montants et les dates restent réels.
- **Environ 10 jeux de rôle** pour couvrir ce qui manque après la première série (visite négative, récit incomplet, montant en millions…). Le commercial reçoit une situation en une phrase, jamais une liste de champs.

### Consigne donnée aux commerciaux

À lire telle quelle, sans rien ajouter :

> « Après ta visite, raconte-la comme tu la raconterais à ton superviseur au téléphone. Parle comme tu parles d'habitude, en darija, en français ou les deux. Il n'y a rien à réciter et pas de bonne réponse. Une à trois minutes. »

Ne jamais leur montrer les champs de la fiche ni la liste des situations : on veut des récits naturels, pas des formulaires dictés.

### Enregistrement

- avec leur propre téléphone, application d'enregistrement par défaut, format d'origine (m4a ou aac), sans retouche ;
- un vocal = une visite, nommé `V01.m4a`, `V02.m4a`… et déposé dans `dataset/audio/` ;
- dans le manifeste : commercial (pseudonyme C1…C5), langue dominante, environnement, durée réelle.

### Consentement, confidentialité, conservation

- accord écrit de chaque commercial, avec la possibilité de retirer un vocal ;
- les vocaux et les fiches restent **hors du dépôt Git** (voir `.gitignore`), sur un espace à accès restreint ;
- on n'envoie à un fournisseur externe que des vocaux aux noms déjà remplacés, et seulement à des fournisseurs qui proposent une option sans conservation ni entraînement sur les données ;
- suppression des vocaux à la fin du benchmark, sauf décision contraire écrite. La durée de conservation en production reste un réglage, décidé avant la mise en service.

## 4. La fiche de référence (ground truth)

Une fiche par vocal, au format `dataset/schema/fiche.schema.json`. Exemples complets dans `demo/fiches/`.

**Règle absolue : on n'y met que ce qui a été dit.** Une information supposée, même probable, n'y entre pas. Un champ vide veut dire « rien n'a été dit » : toute extraction sur ce champ comptera comme inventée.

### Contenu

- **Contexte** : ce que le CRM sait avant le vocal (client prévu, contacts connus, affaire, technologie, montant existant, commercial, showroom). C'est exactement ce que reçoit la couche B.
- **Transcription de référence** : mot à mot. La darija est écrite en arabe, le français en latin, les marques et les machines dans leur graphie officielle, et les nombres comme ils sont prononcés (« ميتين و ربعين ألف », « deux cent quatre-vingt-cinq mille »). On marque `[inaudible]` plutôt que de deviner.
- **Sens en français** : traduction fidèle, sans interprétation.
- **Termes critiques** : noms, cliniques, machines, technologies, concurrents, montants, dates, rôles, avec leurs graphies acceptables. Ils servent à mesurer l'oreille au-delà du WER.
- **Informations attendues** : client, contacts mentionnés, nouveau contact, technologie, besoin ou motivation, intérêt (seulement s'il est explicite), signal, objection, concurrent, montant (en MAD, avec son objet), financement, décideurs et influenceurs, timing, prochaine étape convenue avec le client, action personnelle du commercial, changement de pipeline (seulement s'il est justifié), signal terrain généralisable. Chaque élément cite sa phrase source.

### Comment les rédiger

1. L'annotateur 1 écoute, transcrit et remplit la fiche (compter 30 à 40 minutes par vocal).
2. L'annotateur 2 réécoute le vocal en lisant la fiche, et corrige ; les désaccords et la façon dont ils ont été tranchés sont notés dans `validation.desaccords`.
3. `python3 harness/bench.py fiches` vérifie la forme : champs présents, dates au bon format, montants chiffrés, sources réellement présentes dans la transcription, fiche relue par une seconde personne.

Budget total : environ **15 à 20 heures** d'annotation pour 30 vocaux. C'est le poste le plus important du benchmark : une fiche fausse fausse tout le reste.

## 5. Couche A : audio → transcription

| Mesure | Ce qu'elle dit |
|---|---|
| Rappel des termes critiques, par catégorie | Noms propres, machines, concurrents, montants, dates : le terme a-t-il été entendu ? |
| Montants entendus | Pour chaque montant, les nombres réellement lus dans la transcription (« deux cent quarante mille » → « 240 » se voit tout de suite) |
| WER et CER, en contexte seulement | Utiles pour comparer, trompeurs seuls : la darija n'a pas d'orthographe fixe et un mot de liaison raté ne coûte rien |
| Par tranche | Darija / français / code-switching, et calme / voiture / rue / showroom |
| Latence et coût | Par vocal, et coût ramené à la minute d'audio |

## 6. Couche B : compréhension commerciale

Entrées : la transcription produite par l'architecture et le contexte CRM réellement disponible (client prévu, contact connu, affaire, technologie, montant existant, catalogue machines, concurrents connus, commerciaux, showroom ; voir `dataset/contexte/crm.json`).

L'architecture E0 reçoit la transcription humaine : l'écart entre E0 et une architecture complète montre ce que coûte l'oreille, et l'écart entre E0 et 100 % ce que coûte la compréhension.

### Statut de chaque information

| Statut | Signification |
|---|---|
| Juste | même information, bonne valeur |
| Valeur fausse | la bonne information est visée (le bon contact, le montant du concurrent…) mais la valeur est fausse |
| Manquée | dite dans le récit, absente de l'extraction |
| Inventée | extraite alors que rien de tel n'a été dit |

### Règles d'appariement par type

| Type | Catégorie | Juste si… |
|---|---|---|
| Client, contacts | Critique | même personne ou établissement (titres ignorés, graphies proches acceptées) ; pour un contact, même statut nouveau / connu |
| Montants | Critique | même valeur exacte en MAD et même objet (prix Cellulift, offre concurrente, budget client…) |
| Étape convenue | Critique | même type, même date, même heure si elle a été dite |
| Changement de pipeline | Critique | même étape cible, seulement si le récit le justifie |
| Décideurs | Importante | même personne et même rôle d'achat |
| Objections | Importante | même type (prix, technique, financement…) |
| Concurrents | Importante | même marque (alias reconnus) |
| Financement | Importante | même durée si elle a été dite |
| Timing | Importante | périodes qui se recouvrent d'au moins la moitié |
| Technologies | Importante | même technologie ou même machine du catalogue |
| Actions personnelles | Importante | mêmes mots-clés et même échéance |
| Besoin, signaux, signal terrain | Secondaire | au moins la moitié des mots-clés de la fiche |
| Intérêt | Secondaire | même niveau, seulement s'il était explicite |

Par type, on rapporte : attendus, justes, valeurs fausses, manquées, inventées, précision, rappel, **exactitude métier** (justes ÷ (attendues + inventées)) et le nombre d'erreurs **affirmées sans réserve**.

Les catégories (critique / importante / secondaire) servent à trier les erreurs par gravité dans le rapport, jamais à calculer une moyenne qui les cacherait.

## 7. Hallucinations

- **False extraction rate** = informations inventées ÷ informations extraites, global et par catégorie. C'est une métrique majeure.
- **Inventions affirmées sans réserve** : celles marquées « confiant ». Ce sont les pires, car le commercial n'a aucune raison de les vérifier.
- **Citations introuvables** : chaque information doit citer sa phrase source ; le harness vérifie que cette citation existe vraiment dans le texte reçu. Une citation inventée est un signal d'hallucination, et elle casse l'explicabilité promise dans l'écran de revue.

## 8. Confiance et calibration

Chaque information extraite porte une étiquette : **confiant**, **à vérifier** ou **non détecté**, et si possible un score entre 0 et 1. Quand un moteur ne fournit pas de score, on le construit (probabilités des tokens, accord entre deux passes, ou score demandé dans la consigne) et on le note dans la configuration.

Le benchmark mesure, par type de donnée :

- la précision réelle de « confiant » et de « à vérifier » ;
- la courbe précision / couverture selon le seuil de score ;
- le plus petit seuil qui atteint la précision visée pour ce type.

Précisions visées, modifiables dans `config/grille.json` : montants 99 %, étape convenue et identités 98 %, concurrents 95 %, décideurs et financement 93 %, objections et timing 90 %, résumé et éléments descriptifs 80 %.

Avec 30 vocaux, certains types n'auront que quelques dizaines d'exemples : les seuils obtenus sont **provisoires**. Le rapport affiche toujours le nombre d'exemples, et les seuils seront recalibrés pendant le pilote.

## 9. Effort du commercial

Le harness simule la revue de chaque compte rendu, telle qu'elle se passe dans l'écran validé :

| Mesure | Définition |
|---|---|
| Corrections par visite | valeurs fausses + inventions à retirer + informations critiques ou importantes manquantes à ajouter |
| Confirmations par visite | informations justes mais marquées « à vérifier » |
| Questions par visite | questions complémentaires posées par le système |
| Comptes rendus acceptables sans modification | aucune correction |
| Erreurs critiques affirmées sans réserve par visite | les erreurs qui passeraient inaperçues |
| Temps fin du vocal → validation | latence + temps de revue estimé |

Le temps de revue suit un modèle simple (lecture 3 s par élément, confirmation 6 s, correction 18 s, ajout 25 s, question 12 s). Il sera recalé en chronométrant 2 ou 3 vraies revues sur le prototype.

## 10. Restitution

Le rapport (`resultats/<exécution>/rapport.md`) contient :

1. **Le tableau comparatif** demandé, une colonne par architecture : darija, français, code-switching, noms propres, machines, concurrents, montants, dates, décideurs, objections, étape convenue, false extraction rate, corrections par visite, questions par visite, latence, coût par minute, plus les erreurs critiques affirmées sans réserve, les confirmations, la part de comptes rendus acceptables sans modification et le temps jusqu'à validation ;
2. le même découpage par environnement sonore ;
3. pour chaque architecture, le détail par type de donnée et la calibration ;
4. **les erreurs réelles les plus graves**, triées par gravité, avec la valeur attendue, la valeur obtenue et la phrase source. Exemples tirés de la démonstration :
   - « V02 · Montants (critique, valeur fausse, affirmé « confiant ») : attendu 280 000 MAD (budget client), obtenu 28 000 000 MAD — « الميزانية ديالها 28 مليون » » ;
   - « V03 · Étape convenue (critique, inventée, affirmé « confiant ») : obtenu visite le 2027-01-05 — « je repasse peut-être en début d'année » » ;
   - « V01 · montant : « ميتين و ربعين ألف » non retrouvé — nombres entendus : 1, 24, 240, 285000 » (le moteur a écrit « 240 » au lieu de 240 000) ;
5. les termes critiques ratés à la transcription.

Un CSV par architecture donne aussi le détail vocal par vocal.

## 11. Critère de décision

Le rapport ne choisit pas. La décision se prend en équipe, en deux temps :

1. **Garde-fous** (réglables dans `config/grille.json`). Une architecture qui dépasse l'un d'eux est écartée ou retravaillée :
   - plus de 5 % d'informations inventées ;
   - plus d'une erreur critique affirmée sans réserve tous les 10 vocaux ;
   - latence médiane au-delà de 45 secondes ;
   - coût par minute au-delà du plafond, à fixer.
2. **Compromis** entre les architectures restantes : compréhension métier sur les données critiques et importantes, faible invention, faible effort de correction, latence acceptable, coût soutenable. La meilleure transcription brute ne gagne pas automatiquement.

La comparaison avec E0 oriente la suite : si E0 est très au-dessus de toutes les architectures, l'effort doit porter sur l'oreille ; si E0 est lui-même faible, il faut retravailler la consigne ou le modèle d'extraction.

## 12. Déroulé proposé

| Étape | Contenu | Durée indicative |
|---|---|---|
| 1 | Liste de noms fictifs, liste des concurrents, choix des 3 à 5 commerciaux, consentements | 2 à 3 jours |
| 2 | Enregistrement des ~20 récits réels, puis des ~10 jeux de rôle pour compléter la couverture | 1 semaine |
| 3 | Fiches de référence, double relecture, `bench.py fiches` sans erreur | 1 semaine |
| 4 | Branchement des configurations candidates, exécutions, `bench.py evaluer` | 3 à 4 jours |
| 5 | Lecture des erreurs, décision en équipe | 1 réunion |

Aucune écriture automatique en base ni aucun déploiement à ce stade.

## 13. À fournir par l'équipe Cellulift

- la liste des concurrents réellement rencontrés, pour compléter `dataset/contexte/crm.json` (la liste actuelle est provisoire) ;
- les 3 à 5 commerciaux volontaires ;
- la validation de la liste de noms fictifs ;
- les fournisseurs à mettre en concurrence dans chaque ligne d'architecture, et leurs conditions de confidentialité ;
- la personne qui relit les fiches (annotateur 2).

## 14. Fichiers

| Chemin | Rôle |
|---|---|
| `PROTOCOLE.md` | ce document |
| `config/couverture.json` | cibles de couverture du dataset |
| `config/grille.json` | types de données, catégories, règles d'appariement, précisions visées, modèle d'effort, garde-fous |
| `config/architectures.json` | architectures candidates, toutes inactives au départ |
| `dataset/manifeste.csv` | plan des 30 vocaux et suivi |
| `dataset/schema/fiche.schema.json` | format de la fiche de référence |
| `dataset/noms_fictifs.csv` | noms de médecins et d'établissements fictifs pour anonymiser les récits réels |
| `dataset/contexte/crm.json` | contexte CRM fourni à la couche B (catalogue réel, concurrents provisoires) |
| `prompts/extraction.md` | consigne d'extraction commune |
| `harness/` | scripts (Python 3, sans dépendance) |
| `demo/` | 3 vocaux fictifs et 3 architectures fictives pour vérifier le harness |
